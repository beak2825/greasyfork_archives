// ==UserScript==
// @name         GPT3（intumu.com）
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  持续对话文字加载！
// @author       yeayee
// @match        https://*.intumu.com/chatgpt
// @icon        https://intumu.com/static/images/favicon.ico
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @run-at     document-end
// @require    https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require    https://unpkg.com/axios/dist/axios.min.js
// @connect    intumu.com
// @connect    anfans.cn
// @license    MIT
// @require    https://intumu.com/static/js/marked.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/extensions/MathZoom.js
// @require    https://cdn.staticfile.org/clipboard.js/2.0.4/clipboard.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/languages/go.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.4/katex.min.js

// @downloadURL https://update.greasyfork.org/scripts/466854/GPT3%EF%BC%88intumucom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/466854/GPT3%EF%BC%88intumucom%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

  $("head").append($(
      '<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown.css" media="(prefers-color-scheme: dark)">'
  ));
  $("head").append($(
      '<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/base16/default-dark.min.css">'
  ));
  $("head").append($(
      '<link href="https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css" rel="stylesheet">'
  ));
  $("head").append($(
      '<link href="https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.4/katex.css" rel="stylesheet">'
  ));
  $("head").append($(
      '<script src="https://intumu.com/static/js/marked.min.js"></script>'
  ));
  $("head").append($(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js"></script>'
  ));
  $("head").append($(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/extensions/MathZoom.js"></script>'
));
  if(!document.getElementById("katex-link")){
    $("head").append($(
        '<link id="katex-link" href="https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.4/katex.css" rel="stylesheet">'
    ));
}

  //封装GM_xmlhttpRequest ---start---
  async function GM_fetch(details) {
    return new Promise((resolve, reject) => {
      switch (details.responseType) {
        case "stream":
          details.onloadstart = (res) => {
            resolve(res)
          }
          break;
        default:
          details.onload = (res) => {
            resolve(res)
          };
      }

      details.onerror = (res) => {
        reject(res)
      };
      details.ontimeout = (res) => {
        reject(res)
      };
      details.onabort = (res) => {
        reject(res)
      };
      GM_xmlhttpRequest(details)
    });
  }

  function GM_httpRequest(details, callBack, errorCallback, timeoutCallback, abortCallback) {
    if (callBack) {
      switch (details.responseType) {
        case "stream":
          details.onloadstart = callBack;
          break;
        default:
          details.onload = callBack
      }
    }
    if (errorCallback) {
      details.onerror = errorCallback;
    }
    if (timeoutCallback) {
      details.ontimeout = timeoutCallback;
    }
    if (abortCallback) {
      details.onabort = abortCallback;
    }
    console.log(details)
    GM_xmlhttpRequest(details);
  };

  //封装GM_xmlhttpRequest ---end---

  // 通过class定位button
  const button = document.getElementById('send-btn');


  // 创建新的button元素
  const newButton = document.createElement('button');
  newButton.setAttribute('id', 'newbutton');
  newButton.innerHTML = 'ChatGPT3';

  // 将新的button插入到button后面
  button.parentNode.insertBefore(newButton, button.nextSibling);
  const newbutton = document.getElementById('newbutton');
  newbutton.setAttribute("class", "btn btn-danger margin");
  document.getElementById('newbutton').addEventListener('click', () => {

      let text = '';
      text = document.getElementById("textarea").value;
      if (text == "") {
        alert("请输入内容");
        return;
      };
      let html = '';
      let send_time = new Date();
      let send_time_str = '';
      if (send_time.getTime() - last_time > 1000 * 60 * 5) {
        // 以'%Y年%#m月%#d日 %H:%M'格式显示时间
        html += '<div class="item item-center"><span>' + get_time_str(send_time) + '</span></div>';
        last_time = send_time.getTime();
        send_time_str = get_time_str(send_time);
      }
      html += '<div class="item item-right"><div class="bubble bubble-right markdown">' + marked.marked(text) + '</div><div class="avatar"><img src="./static/people.jpg" /></div></div>';
      $(".content").append(html);
      $("#textarea").val("");
      $(".content").scrollTop($(".content")[0].scrollHeight);
      if (text.startsWith('new:')) send_time_str = get_time_str(send_time)
      LEMURCHAT(text);

    });
    
  // 请求接口
  function LEMURCHAT(your_qus) {

    let baseURL = "http://lemurchat.anfans.cn/";
    let chat_item = $('<div class="item item-left"><div class="avatar"><img src="./static/chatgpt.png" /></div><div class="bubble bubble-left markdown">正在等待回复</div></div>')
    $(".content").append(chat_item);
    $(".box-body").scrollTop($(".box-body")[0].scrollHeight);  
    GM_fetch({
      method: "POST",
      url: baseURL + "api/chat/conversation-trial",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 4 Prime) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36"
      },
      data: `{"messages":"[{\\"content\\":\\"\\",\\"id\\":\\"LEMUR_AI_SYSTEM_SETTING\\",\\"isSensitive\\":false,\\"needCheck\\":false,\\"role\\":\\"system\\"},{\\"content\\":\\"${your_qus}\\",\\"isSensitive\\":false,\\"needCheck\\":true,\\"role\\":\\"user\\"}]"}`,
      responseType: "stream"
    }).then((stream) => {
      const reader = stream.response.getReader();
      let result = [];
      reader.read().then(function processText({done, value}) {
        if (done) {
            return;
        }
        try {
          let d = new TextDecoder("utf8").decode(new Uint8Array(value));
          console.log("raw:", d)
          let dd = d.replace(/data: /g, "").split("\n\n")
          console.log("dd:", dd)
          dd.forEach(item => {
            try {
              let delta = /content\\":\\"(.*?)\\"/gi.exec(item)[1]
              result.push(delta.replace(/\\\\n/g, "\n"))
              let response = result.join("");
              console.log("response:", response)
              let div = document.createElement('div');
              div.innerHTML = marked.marked(response);
              MathJax.Hub.Typeset(div);
              chat_item.find(".bubble").empty();
              chat_item.find(".bubble").append(div);
              $(".box-body").scrollTop($(".box-body")[0].scrollHeight);          
            } catch (e) {
            }
          })

        } catch (e) {
          console.log(e)
        }

        return reader.read().then(processText);
      });
    }, function (err) {
      console.log(err)
    }).catch((ex) => {
      console.log(ex)
    });

  };




})();