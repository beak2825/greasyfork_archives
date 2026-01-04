// ==UserScript==
// @name         百度盘不限速下载【pansvip】
// @namespace    http://pansvip.com/
// @version      0.1.1
// @description  百度盘不限速, 使用 svip 账号加速下载
// @author       pansvip.com
// @match        https://pan.baidu.com/*
// @icon         https://pansvip.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      pansvip.com
// @connect      localhost
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/479091/%E7%99%BE%E5%BA%A6%E7%9B%98%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E3%80%90pansvip%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/479091/%E7%99%BE%E5%BA%A6%E7%9B%98%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E3%80%90pansvip%E3%80%91.meta.js
// ==/UserScript==

function useRequest(baseUrl) {
  const encodeToString = (o) =>
    Object.keys(o)
      .map((k) => `${k}=${o[k]}`)
      .join("&");
  const buildUrl = (endpoint, params) => {
    const url = new URL(endpoint, baseUrl);
    return `${baseUrl}${endpoint}?` + encodeToString(params);
  };

  const makeRequest = (method, endpoint, config = {}) => {
    const { data = {}, params = {}, headers = {} } = config;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url: buildUrl(endpoint, params),
        data:
          method == "POST"
            ? typeof data == "object"
              ? JSON.stringify(data)
              : data
            : undefined,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        responseType: "json",
        onload: function (res) {
          const {
            finalUrl,
            status,
            statusText,
            responseHeaders,
            response,
            responseText,
          } = res;
          resolve({
            url: finalUrl,
            status,
            statusText,
            headers: responseHeaders,
            data: response || responseText,
          });
        },
        ontimeout: function (err) {
          reject(err);
        },
        onerror: function (err) {
          reject(err);
        },
      });
    });
  };

  return {
    get(endpoint, params = {}, headers = {}) {
      return makeRequest("GET", endpoint, { params, headers });
    },
    post(endpoint, body, params = {}, headers = {}) {
      return makeRequest("POST", endpoint, { data: body, params, headers });
    },
    postForm(endpoint, body, params = {}, headers = {}) {
      return makeRequest("POST", endpoint, {
        params,
        data: encodeToString(body),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...headers,
        },
      });
    },
  };
}

function get_bdstoken() {
  const htmlString = $("html").html();
  const testRes = /"bdstoken":"(\w+)"/.exec(htmlString);
  return testRes[1];
}

function get_selected_ids() {
  const ids = [];
  $("tr.selected").each(function () {
    const dataId = $(this).data("id");
    ids.push(dataId);
  });

  $(".mouse-choose-box .is-checked").each(function () {
    const dataId = $(this).data("id");
    if (dataId) {
      ids.push(dataId);
    }
  });

  return ids;
}

(function () {
  "use strict";

  const SVIP_CONFIG = {
    baseUrl: "https://pansvip.com/api/plugin",
    pwd: "svip",
  };

  const svipClient = useRequest(SVIP_CONFIG.baseUrl);
  const panClient = useRequest("https://pan.baidu.com");

  async function shareFile(fs_ids, pwd, period = 1) {
    const bdstoken = get_bdstoken();
    try {
      const shareRes = await panClient.postForm(
        "/share/set",
        {
          period,
          pwd,
          eflag_disable: true,
          channel_list: [],
          schannel: 4,
          fid_list: JSON.stringify(fs_ids),
        },
        {
          channel: "chunlei",
          bdstoken,
          clienttype: 0,
          app_id: 250528,
          web: 1,
        }
      );

      const { show_msg = "", link = "" } = shareRes.data;
      if (show_msg) {
        throw new Error(`创建分享失败: ${show_msg}`);
      }

      const share_url = link + "?pwd=" + pwd;
      return {
        share_url,
        ...shareRes.data,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function parse_shareFile(share_url) {
    try {
      const parse = await svipClient.post("/parse_share", { url: share_url });
      if (parse.status != 200) {
        throw parse.data || { error: "未知错误" };
      }
      const { userAgent, realUri, filename, size, md5 } = parse.data;

      const get_bitComet = () => {
        return `bc://http/${btoa(
          unescape(
            encodeURIComponent(
              `AA/${realUri.match(/&fin=(.*?)&/)[1]}/?url=${encodeURIComponent(
                realUri
              )}&user_agent=${userAgent}ZZ`
            )
          )
        )}`;
      };

      const get_motrix = () => {
        const params = [[realUri], { "user-agent": userAgent }];
        return `http://localhost:16800/jsonrpc?method=aria2.addUri&id=pansvip&params=${btoa(
          JSON.stringify(params)
        )}`;
      };

      return {
        filename,
        size,
        md5,
        realUri,
        userAgent,
        motrix_uri: get_motrix(),
        bitcomet_uri: get_bitComet(),
      };
    } catch (err) {
      console.error(err);
      throw err.error || err;
    }
  }

  async function svip_click() {
    const fs_ids = get_selected_ids();
    if (fs_ids.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "出错了",
        text: "你没有选中你需要下载的资源，没办法给你提供服务",
      });
    }

    if (fs_ids.length > 1) {
      return Swal.fire({
        icon: "error",
        title: "出错了",
        text: "当前只支持单文件解析",
      });
    }

    try {
      Swal.fire({
        title: "正在解析中, 请稍候...",
        allowOutsideClick: false,
      });
      Swal.showLoading();

      const pwd = SVIP_CONFIG.pwd;
      const { share_url } = await shareFile(fs_ids, pwd, 1);

      const { realUri, userAgent, bitcomet_uri, motrix_uri } =
        await parse_shareFile(share_url);

      const renderHtml =
        `
      <input id="swal-input1" class="swal2-input" value="` +
        realUri +
        `">
      <input id="swal-input2" class="swal2-input" value="` +
        userAgent +
        `">
      <a target='_blank' href='${bitcomet_uri}'> 
        <button class="swal2-confirm swal2-styled">BitComet</button>
      </a>
      <a target='_blank' href='${motrix_uri}'>
        <button class="swal2-confirm swal2-styled">Motrix(aria2)</button> 
      </a>
    `;

      Swal.fire({
        icon: "success",
        title: "解析成功",
        html: renderHtml,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "解析失败",
        text: `${err}`,
      });
      console.error(err);
    }
  }

  function init_ui() {
    const Button = `
  <button id="svipdown" 
    class="u-button nd-file-list-toolbar-action-item u-button--primary"
    style="margin: 0 8px;background-color: #cd78cfc7;border: 0;border-radius: 18px;">
    PanSVIP
  </button>`;
    $(".wp-s-agile-tool-bar__header").prepend(Button);
    $("#svipdown").click(svip_click);
  }

  init_ui();
})();
