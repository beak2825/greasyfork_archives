// ==UserScript==
// @name         you-get
// @description  UGC下载 bilibili acfun 快手 抖音
// @namespace    https://greasyfork.org/zh-CN/users/863179
// @version      0.2.0
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.douyin.com/*
// @match        https://www.kuaishou.com/*
// @match        https://www.acfun.cn/v/*
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438368/you-get.user.js
// @updateURL https://update.greasyfork.org/scripts/438368/you-get.meta.js
// ==/UserScript==

(() => {
  // src/util/index.js
  var download = async (blob, fileName) => {
    let link = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${fileName}`;
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(link);
  };
  var safetyParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (error) {
      return null;
    }
  };
  var getFile = async (url) => {
    const res = await fetch(url);
    const reader = res.body.getReader();
    const contentLength = +res.headers.get("Content-Length");
    if (!contentLength) {
      const data = await res.arrayBuffer();
      return new Uint8Array(data);
    }
    let receivedLength = 0;
    let chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
      console.log(
        `fileSize: ${contentLength} %c downloaded ${receivedLength}`,
        "background: #222; color: #bada55"
      );
    }
    return new Blob(chunks);
  };
  var getUrlsByM3u8 = async (url, parser) => {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname.split("/").slice(0, -1).join("/");
    urlObj.search = "";
    const base = urlObj.toString();
    const res = await fetch(url);
    const data = await res.text();
    return data.split("\n").filter((i) => !!i && !i.startsWith("#")).map((i) => {
      if (parser) {
        return parser(i);
      }
      return i.startsWith("/") ? `${base}${i}` : `${base}/${i}`;
    });
  };
  var getFiles = (urls, max = 8) => {
    let connections = 0;
    let files = [];
    urls = urls.map((i, index) => ({
      ...i,
      index
    }));
    return new Promise((resolve, reject) => {
      const getSingleFile = async ({ url, index, ...rest }) => {
        if (connections < max) {
          try {
            connections = connections + 1;
            const data = await getFile(url);
            connections = connections - 1;
            files[index] = data;
            if (urls?.length) {
              getSingleFile(urls.shift());
            } else {
              connections === 0 && resolve(files);
            }
          } catch (error) {
            console.log(error);
            urls.push({
              url,
              index,
              ...rest
            });
          }
        }
      };
      new Array(max).fill(0).forEach((i) => {
        getSingleFile(urls.shift());
      });
    });
  };

  // src/module/acfun.js
  var getVideoInfo = async () => {
    const m3u8FileUrl = safetyParse(window.pageInfo.currentVideoInfo.ksPlayJson)?.adaptationSet?.[0]?.representation?.[0]?.url;
    const urls = await getUrlsByM3u8(m3u8FileUrl);
    return urls.map((url) => ({ url }));
  };
  var acfun_default = async () => {
    const urls = await getVideoInfo();
    const files = await getFiles(urls);
    download(new Blob(files), "download.mp4");
  };

  // src/module/bilibili.js
  var getBilibiliVideoInfo = async () => {
    const res = await fetch(window.location.href);
    const str = await res.text();
    const data = JSON.parse(
      str.match(/window.__playinfo__=([\d\D]+?)<\/script>/)[1]
    );
    const dash = data?.data?.dash;
    const video = dash?.video?.sort((a, b) => b?.width - a?.width)?.[0];
    const audio = dash?.audio[0];
    return [
      {
        url: video?.baseUrl,
        fileName: `download.${video?.mimeType?.split("/")?.[1] || "mp4"}`
      },
      {
        url: audio?.baseUrl,
        fileName: `download.${video?.mimeType?.split("/")?.[1] || "mp4"}`
      }
    ];
  };
  var bilibili_default = async () => {
    const urls = await getBilibiliVideoInfo();
    while (urls?.length) {
      const { url, fileName } = urls.shift();
      const file = await getFile(url);
      download(file, fileName);
    }
  };

  // src/module/douyin.js
  var getDouyinVideoInfo = () => {
    const urls = [...document.querySelectorAll("video source")].map((i) => i.src);
    return {
      url: urls[0],
      fileName: `download.mp4`
    };
  };
  var douyin_default = async () => {
    const url = await getDouyinVideoInfo();
    const file = await getFile(url.url);
    download(file, url.fileName);
  };

  // src/module/kuaishou.js
  var getKuaishouVideoInfo = () => {
    const urls = [...document.querySelectorAll("video")].map((i) => i.src);
    return {
      url: urls[0],
      fileName: `download.mp4`
    };
  };
  var kuaishou_default = async () => {
    const url = await getKuaishouVideoInfo();
    const file = await getFile(url.url);
    download(file, url.fileName);
  };

  // src/module/qq.js
  var proxyhttpBody = null;
  var monitor = async () => {
    try {
      window.__PLAYER__.pluginMsg.emit = new Proxy(
        window.__PLAYER__.pluginMsg.emit,
        {
          apply: (...args) => {
            if (args?.[2]?.[0] === "PROXY_HTTP_START" && args?.[2]?.[1]?.vinfoparam) {
              console.log(args?.[2]?.[1]);
              proxyhttpBody = JSON.stringify(args?.[2]?.[1]);
            }
            return Reflect.apply(...args);
          }
        }
      );
    } catch (error) {
      console.log("monitor error");
    }
  };
  var getVideoInfo2 = async () => {
    let m3u8FileUrl = null;
    if (!m3u8FileUrl) {
      let res = await fetch("https://vd6.l.qq.com/proxyhttp", {
        method: "post",
        body: proxyhttpBody
      });
      res = await res.json();
      if (res?.errCode === 0 && res?.vinfo) {
        const data = safetyParse(res?.vinfo);
        const m3u8 = data?.vl?.vi?.sort((a, b) => b.vw - a.vw)?.[0]?.ul;
        if (m3u8) {
          m3u8FileUrl = m3u8.ui[0].url;
        }
      }
    }
    const urls = await getUrlsByM3u8(m3u8FileUrl);
    return urls.map((url) => ({
      url,
      fileName: `download.mp4`
    }));
  };
  if (window.location.host === "v.qq.com") {
    monitor();
  }
  var qq_default = async () => {
    const urls = await getVideoInfo2();
    const files = await getFiles(urls);
    download(new Blob(files), "download.mp4");
  };

  // src/module/youku.js
  var youku_default = async () => {
    if (!document.querySelector("meta#you-get-youku")) {
      const meta = document.createElement("meta");
      meta.httpEquiv = "Content-Security-Policy";
      meta.content = "upgrade-insecure-requests";
      meta.id = "you-get-youku";
      document.querySelector("head").appendChild(meta);
    }
    const data = window?.videoPlayer?.context?.mediaData?.mediaResource?._model;
    if (data) {
      const m3u8FileUrl = data.streamList.sort((a, b) => b.width - a.width)[0].uri.HLS;
      const urls = await getUrlsByM3u8(m3u8FileUrl, (i) => i);
      const files = await getFiles(urls.map((url) => ({ url })));
      download(new Blob(files), `${data.video.title}.ts`);
    }
  };

  // src/module/index.js
  var module_default = {
    bilibili: bilibili_default,
    douyin: douyin_default,
    kuaishou: kuaishou_default,
    acfun: acfun_default,
    qq: qq_default,
    youku: youku_default
  };

  // src/index.js
  var youget = () => {
    const handler = Object.entries(module_default).find(
      ([key, fn]) => window.location.host.toLocaleLowerCase().includes(key)
    )?.[1];
    if (handler) {
      handler();
    } else {
      console.log("not support");
    }
  };
  youget.toString = () => {
    youget();
    return 1;
  };
  // window.you = 1;
  // window.get = youget;
  window.youget = youget;
  var bae=document.createElement("a");
  bae.style="position:fixed;top:10vh;right:6vw;font-size:2vw;z-index:999;color:#89FF89";
  bae.textContent="YouGet";
  bae.href="javascript:youget()";
  document.body.append(bae);
})();