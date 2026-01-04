// ==UserScript==
// @name         支付宝企业码 批量代商家入驻
// @description  批量入驻
// @namespace    alipay_qiyema_merchants_join
// @version      0.0.0
// @include      https://qiyema.alipay.com/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @connect      
// @connect      qiyema-api-v2.alipay.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518287/%E6%94%AF%E4%BB%98%E5%AE%9D%E4%BC%81%E4%B8%9A%E7%A0%81%20%E6%89%B9%E9%87%8F%E4%BB%A3%E5%95%86%E5%AE%B6%E5%85%A5%E9%A9%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/518287/%E6%94%AF%E4%BB%98%E5%AE%9D%E4%BC%81%E4%B8%9A%E7%A0%81%20%E6%89%B9%E9%87%8F%E4%BB%A3%E5%95%86%E5%AE%B6%E5%85%A5%E9%A9%BB.meta.js
// ==/UserScript==
(function (jQuery) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var jQuery__default = /*#__PURE__*/_interopDefaultLegacy(jQuery);

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".global-module_container__-tGDM {\n  font-size: 16px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 999;\n  min-width: 15em;\n  max-width: 100%;\n  background-color: #fff;\n  border: 1px solid #eee;\n  border-radius: 4px;\n  padding: 1em;\n  text-align: center;\n}\n\n.global-module_logo__RzTo1 {\n  width: 48px;\n  height: 48px;\n}\n\n.global-module_check__1s-U5 {\n  color: green;\n  vertical-align: middle;\n  margin-right: 0.5em;\n}\n\n.global-module_supports__XdEcd {\n  text-align: left;\n  width: auto;\n  line-height: 2;\n}\n\n.global-module_button__EeOr9 {\n  padding: 0.2em 2em;\n  border-radius: 2px;\n  text-align: center;\n  background-color: #000;\n  color: #fff;\n  display: inline-block;\n  cursor: pointer;\n}\n\n.global-module_hide__63gRn {\n  display: none;\n}\n";
  var style = {"container":"global-module_container__-tGDM","logo":"global-module_logo__RzTo1","check":"global-module_check__1s-U5","supports":"global-module_supports__XdEcd","button":"global-module_button__EeOr9","hide":"global-module_hide__63gRn"};
  styleInject(css_248z);

  let _cookies;
  function getCookies() {
    if (!_cookies) {
      _cookies = document.cookie;
    }
    return _cookies;
  }
  const container = document.createElement("div");
  container.classList.add(style.container);
  container.classList.add(style.hide);
  jQuery__default["default"](container).append(jQuery__default["default"]("<div style='text-align:left'>输入json：<textarea id='inputjson' wrap='off' style='width:500px;height:100px;margin-top:8px'></textarea></div>")).append(jQuery__default["default"]("<div style='text-align:left'>执行进度：<textarea id='console' disabled wrap='off' style='width:500px;height:100px;margin-top:8px'></textarea></div>"));
  const getItButton = document.createElement("div");
  getItButton.textContent = "开始执行";
  getItButton.classList.add(style.button);
  // container.appendChild(getItButton);
  getItButton.addEventListener("click", async () => {
    // const { list }: any = await readFileLocal();
    const inputElement = document.querySelector("#inputjson");
    if (inputElement) {
      const value = inputElement.value;
      try {
        const {
          list
        } = JSON.parse(value);
        log("解析JSON成功：", JSON.stringify(list));
        for (let i = 0; i < list.length; i++) {
          const params = list[i];
          await startWithParams(params);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Element with id 'inputjson' not found");
    }
  });
  jQuery__default["default"](container).append(getItButton);
  const btnCancel = jQuery__default["default"]("<div style='margin-left:8px'>关闭</div>").on("click", () => {
    jQuery__default["default"](container).addClass(style.hide);
  });
  btnCancel.addClass(style.button);
  jQuery__default["default"](container).append(btnCancel);
  const btnBatchShow = jQuery__default["default"]("<div style='padding-top:16px;background-color:blue;color:#fff;font-size:12px;border-radius:25px;overflow:hidden;position:fixed;bottom:100px;right:80px;width:50px;height:50px'>批量入驻</div>").on("click", () => {
    jQuery__default["default"](container).removeClass(style.hide);
  });
  jQuery__default["default"]("body").append(btnBatchShow);
  document.body.appendChild(container);
  function log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const origin = jQuery__default["default"]("#console").text() + args.join("\n");
    jQuery__default["default"]("#console").text(origin + "\n" + args.join(" "));
  }
  async function startWithParams(params) {
    const path = params.shopInfo.shopRelationMerchantServiceInfoList[0].agreementFileName;
    log("协议路径解析成功：", path);
    const file = await loadAgreement(path);
    log("协议文件读取成功：", file.name, file.size);
    const ossUrl = await uploadAgreement(file);
    log("协议上传成功：", ossUrl);
    delete params.shopInfo.shopRelationMerchantServiceInfoList[0].agreementFileName;
    params.shopInfo.shopRelationMerchantServiceInfoList[0].agreementUrl = ossUrl;
    const submitRet = await submit(params);
    log("提交成功：", submitRet);
    log("======================");
  }
  function loadAgreement(path) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        responseType: "blob",
        url: path,
        headers: {
          "Content-Type": "text/json,charset=utf-8"
        },
        onload: function (r) {
          const file = new File([r.response], "agreement.png", {
            type: "image/png"
          });
          resolve(file);
        },
        onerror: function (err) {
          reject(err);
        }
      });
    });
  }
  function uploadAgreement(file) {
    // 获取cookies字符串
    const cookies = getCookies();
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append("file", file, file.name + "_expenseTypeSubCategory__REACH_SHOP");
      formData.append("fileUploadType", "brandImgUpload");
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://qiyema-api-v2.alipay.com/wapi/base/file/upload",
        data: formData,
        headers: {
          Cookie: cookies,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          Referer: "https://qiyema.alipay.com/"
          // 注意：不需要设置 Content-Type，因为使用 FormData 时它会自动设置为 multipart/form-data
        },
        responseType: "json",
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            const obj = JSON.parse(response.responseText);
            resolve(obj.data);
          } else {
            reject(new Error(`HTTP error! status: ${response.status}`));
          }
        },
        onerror: function (error) {
          console.log("error", error);
          reject(error);
        }
      });
    });
  }
  function submit(params) {
    const cookies = getCookies();
    const paramsStr = JSON.stringify(params);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://qiyema-api-v2.alipay.com/wapi/mechant/shop/create?ctoken=5kstXbP__hzccqtA",
        headers: {
          accept: "application/json",
          "accept-language": "zh-CN,zh;q=0.9",
          "app-name": "qiyema",
          "appid-token": "qRI2ot+9pTDkrnaCdqWHTGW8vKhMm9wmxnHXtR9YDjt+q0FIkwEAAA==",
          "cache-control": "no-cache",
          "call-back": "https%3A%2F%2Fqiyema.alipay.com%2Fsecurity",
          "content-type": "application/json;charset=UTF-8",
          cookie: cookies,
          origin: "https://qiyema.alipay.com",
          pragma: "no-cache",
          priority: "u=1, i",
          referer: "https://qiyema.alipay.com/",
          "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          source: "undefined",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
        },
        data: paramsStr,
        onload: function (response) {
          resolve(response.responseText);
        },
        onerror: function (error) {
          reject(error);
        }
      });
    });
  }

})(jQuery);
