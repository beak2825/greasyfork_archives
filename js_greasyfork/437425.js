// ==UserScript==
// @name         Hacker News Translator
// @namespace    http://tampermonkey.net/Hacker-News-Translator
// @version      0.4
// @description  Hacker News Translator Using tmt.tencentcloudapi.com
// @author       Luoyayu
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?domain=news.ycombinator.com
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js
// @downloadURL https://update.greasyfork.org/scripts/437425/Hacker%20News%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/437425/Hacker%20News%20Translator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const HighLight_Color = "orange";

  var DEBUG_INFO = false;
  var DEBUG_VERBOSE = false;

  function debug_info(...data) {
    if (DEBUG_INFO) {
      console.log("[INFO] ", data);
    }
  }
  function debug_verbose(...data) {
    if (DEBUG_VERBOSE) {
      console.log("[VERBOSE]", data);
    }
  }

  debug_info("CryptoJS OK: ", CryptoJS);

  function translate(text) {
    const Translate_Target = "zh";

    function sha256(message, secret = "") {
      return CryptoJS.HmacSHA256(message, secret);
    }

    function getHash(message) {
      return CryptoJS.SHA256(message);
    }

    function getDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const year = date.getUTCFullYear();
      const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
      const day = ("0" + date.getUTCDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }

    // Key parameter 密钥参数
    const SECRET_ID = "AKIDrb??????????????????????????";
    const SECRET_KEY = "e5KQN??????????????????????????";

    const endpoint = "tmt.tencentcloudapi.com";
    const service = "tmt";
    const region = "ap-shanghai";
    const action = "TextTranslate";
    const version = "2018-03-21";
    const timestamp = Math.floor(Date.now() / 1000);
    const date = getDate(timestamp);

    // ************* 步骤 1：拼接规范请求串 *************
    const signedHeaders = "content-type;host";

    const payload = JSON.stringify({
      SourceText: text,
      Source: "auto",
      Target: Translate_Target,
      ProjectId: 0,
    });

    const hashedRequestPayload = getHash(payload);
    const httpRequestMethod = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "";
    const canonicalHeaders =
      "content-type:application/json" + "\n" + "host:" + endpoint + "\n";

    const canonicalRequest =
      httpRequestMethod +
      "\n" +
      canonicalUri +
      "\n" +
      canonicalQueryString +
      "\n" +
      canonicalHeaders +
      "\n" +
      signedHeaders +
      "\n" +
      hashedRequestPayload;
    debug_verbose(canonicalRequest);

    // ************* 步骤 2：拼接待签名字符串 *************
    const algorithm = "TC3-HMAC-SHA256";
    const hashedCanonicalRequest = getHash(canonicalRequest);
    const credentialScope = date + "/" + service + "/" + "tc3_request";
    const stringToSign =
      algorithm +
      "\n" +
      timestamp +
      "\n" +
      credentialScope +
      "\n" +
      hashedCanonicalRequest;
    debug_verbose(stringToSign);

    // ************* 步骤 3：计算签名 *************
    const kDate = sha256(date, "TC3" + SECRET_KEY);
    const kService = sha256(service, kDate);
    const kSigning = sha256("tc3_request", kService);
    const signature = sha256(stringToSign, kSigning).toString(CryptoJS.enc.Hex);
    debug_verbose(signature);

    // ************* 步骤 4：拼接 Authorization *************
    const authorization =
      algorithm +
      " " +
      "Credential=" +
      SECRET_ID +
      "/" +
      credentialScope +
      ", " +
      "SignedHeaders=" +
      signedHeaders +
      ", " +
      "Signature=" +
      signature;
    debug_verbose(authorization);

    /*const curlcmd = 'curl -X POST ' + 'https://' + endpoint +
        ' -H "Authorization: ' + authorization + '"' +
        ' -H "Content-Type: application/json"' + ' -H "Host: ' +
        endpoint + '"' + ' -H "X-TC-Action: ' + action + '"' +
        ' -H "X-TC-Timestamp: ' + timestamp.toString() + '"' +
        ' -H "X-TC-Version: ' + version + '"' + ' -H "X-TC-Region: ' + region +
        '"' + ' -d \'' + payload + '\'';*/
    // debug_verbose(curlcmd);

    // return xmlhttpRequest
    return {
      url: "https://" + endpoint,
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Host: endpoint,
        "X-TC-Action": action,
        "X-TC-Timestamp": timestamp.toString(),
        "X-TC-Version": version,
        "X-TC-Region": region,
      },
      data: payload,
      onload: null, // 回调函数实现
    };
  }

  // Example
  /*let xmlhttpRequest = translate('Hello World!');
  xmlhttpRequest['onload'] = xhr => {
    let data = JSON.parse(xhr.responseText);
    console.log(data['Response']['TargetText']);
  };
  GM_xmlhttpRequest(xmlhttpRequest);*/

  function translate_eventHandler(event, div_comment) {
    let commtext = div_comment.querySelector("span");
    // console.log(div_comment.innerText);

    let xmlhttpRequest = translate(div_comment.innerText);
    xmlhttpRequest["onload"] = (xhr) => {
      debug_info(xhr.responseText);
      let data = JSON.parse(xhr.responseText);
      let translated_text = data["Response"]["TargetText"];

      const paragraphs = translated_text.split("\n\n");

      Array.from(commtext.getElementsByTagName("p")).forEach((el, index) => {
        let translated_paragraph = document.createElement("p");
        translated_paragraph.setAttribute("style", `color:${HighLight_Color}`);
        translated_paragraph.innerHTML = paragraphs[index];
        commtext.insertBefore(
          translated_paragraph,
          el.innerText !== "reply" ? el : commtext.querySelector(".reply")
        );
      });

      // no paragraphs
      if (commtext.getElementsByTagName("p").length === 0) {
        let translated_paragraph = document.createElement("p");
        translated_paragraph.setAttribute("style", `color:${HighLight_Color}`);
        translated_paragraph.innerHTML = paragraphs[0];
        commtext.insertBefore(
          translated_paragraph,
          commtext.querySelector(".reply")
        );
      }
    };
    GM_xmlhttpRequest(xmlhttpRequest);
  }

  if (
    window.location.pathname === "/news" ||
    window.location.pathname === "/" ||
    window.location.pathname === "/newest"
  ) {
    // 主页
    function sleep(time) {
      return new Promise((resolve) => window.setTimeout(resolve, time));
    }
    function Random(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }

    function handler_titlelink(el) {
      let xmlhttpRequest = translate(el.innerHTML);
      xmlhttpRequest["onload"] = (xhr) => {
        debug_info(xhr.responseText);
        let data = JSON.parse(xhr.responseText);
        let error = data["Response"]["Error"];
        let translated_title = data["Response"]["TargetText"];
        if (error != undefined) {
          sleep(Random(0, 5000)).then(() => {
            handler_titlelink(el);
          });
        } else {
          debug_info("translated text: ", translated_title);
          el.innerHTML += "<br/>" + translated_title;
        }
      };
      GM_xmlhttpRequest(xmlhttpRequest);
    }

    Array.from(document.getElementsByClassName("titlelink")).forEach((el) => {
      sleep(Random(0, 5000)).then(() => {
        handler_titlelink(el);
      });
    });
  } else if (window.location.pathname === "/item") {
    // 评论页面
    Array.from(document.getElementsByClassName("comhead")).forEach((el) => {
      if (el.className === "sitebit comhead") {
        // This is a Title comhead
        let xmlhttpRequest = translate(el.parentNode.textContent);
        xmlhttpRequest["onload"] = (xhr) => {
          let data = JSON.parse(xhr.responseText);
          // console.log('标题翻译: ', data['Response']['TargetText']);
          el.append(
            document.createElement("BR"),
            data["Response"]["TargetText"]
          );
        };
        GM_xmlhttpRequest(xmlhttpRequest);
      } else {
        // 评论正文
        let div_comment = el.parentNode.parentNode.querySelector(".comment");

        // 导航栏
        let navs = el.querySelector(".navs");

        let translate_in_nav = document.createElement("a");
        translate_in_nav.setAttribute("style", "color:orange");
        translate_in_nav.innerHTML = "翻译";

        translate_in_nav.addEventListener(
          "click",
          (function (node) {
            return function (e) {
              translate_eventHandler(e, node);
            };
          })(div_comment),
          { once: true }
        );

        navs.append(" | ", translate_in_nav);
      }
    });
  }
})();
