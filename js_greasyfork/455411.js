// ==UserScript==
// @name         GetThecookie
// @name:zh-CN   一键获取网站cookie
// @name:zh-TW   一鍵獲取网站cookie
// @name:zh-HK   一鍵獲取网站cookie
// @name:zh-ja   ワンクリックでウェブサイトの Cookie を取得
// @namespace    https://www.techwb.cn/177.html
// @version      2.5.0
// @description  Get the cookie of the current web page with one click, and automatically release it and set it on the clipboard, which can be directly pasted and used (the get button is located in the lower left corner of the page).
// @description:zh-CN  一键获取当前网页cookie，并且自动放置于剪切板，可直接粘贴使用（获取按钮位于页面左下角）。
// @description:zh-TW  一鍵獲取當前網頁cookie，並自動釋放設置於剪切板，可直接粘貼粘貼使用（獲取按鈕位於頁面左下角）。
// @description:zh-HK  一鍵獲取當前網頁cookie，並自動釋放設置於剪切板，可直接粘貼粘貼使用（獲取按鈕位於頁面左下角）。
// @description:ja     现在の Web ページの Cookie をワンクリックで取得でき、取得ボタンの位置は左下隅にあり、ボタンをクリックすると、现在のページの Cookie がクリップボードに置かれます.
// @author       Techwb.cn
// @match        *://*/*
// @icon         https://www.techwb.cn/CK100.png
// @grant        GM_setClipboard
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/455411/GetThecookie.user.js
// @updateURL https://update.greasyfork.org/scripts/455411/GetThecookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // Your code here...

  let Container = document.createElement("div");
  Container.id = "getcookie";
  Container.style.position = "fixed";
  Container.style.color = "red";
  Container.style.left="5px"
  // Container.style.right="0px" // 默认靠左边，靠右请去掉注释;
  Container.style.top = "92%"; // 垂直方向位置，可自定义；
  Container.style["z-index"] = "999999";
  Container.innerHTML = `
<div style="padding: 0px; border: 1px solid #aaa; border-radius: 21px; float: right; background: #fff; position: relative; ">
<button id="getcookie"
 style="background-image:url(https://XXX.jpg);
 padding: 6px;
 width: auto;
 height: auto;
 background-repeat:no-repeat;
 background-size:62px;
 border:0;
 background-color:transparent;
 background:red;
 border-radius:21px;
 color:#fff;
 font-size:10px;
 text-align:center;">CK</button>

</div>
`;
  /* ---按钮上方提示---
<div style="position: absolute;
    width: 65px;
    text-align: center;
    top: -21px;
    left: 0px;
    color: #ff8000;
    font-weight: bold;
    font-size: 14px;
    text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;">获取网站(${btn.btname})
</div>
---/按钮上方提示---
*/

  document.body.appendChild(Container);
  var b;
  var current_cookies;
  b = document.getElementById("getcookie");
  b.onclick = function () {
    current_cookies = document.cookie;
    GM_setClipboard(current_cookies);

      /*------------- 重写alert弹窗样式------------*/
      window._alert = function(msg1,msg2,callback) {
        var div = document.createElement("div");
        div.innerHTML = "<style type=\"text/css\">"
            + ".alrMask { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
            + ".alrMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
            + ".alrDialog { position: fixed; z-index: 5000; width: 80%; max-width: 380px; top: 78%; left: 15%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; border-radius: 36px;border: 2px solid #e6e6fa;}"
            + ".alrDialog .alrDialogHd { padding: .2rem .27rem .08rem .27rem; }                                                                                                                                                                                                                         "
            + ".alrDialog .alrDialogHd .alrDialogTitle { font-size: 17px; font-weight: 400; }                                                                                                                                                                                                           "
            + ".alrDialog .alrDialogBT { padding: 0 .27rem; font-size: 18px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000;margin-top: 5%;}                                                                                                                                          "
            + ".alrDialog .alrDialogNR { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000;margin-bottom: 5%;max-height: 230px; }                                                                                                                                          "
            + ".alrDialog .alrDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
            + ".alrDialog .alrDialogFt:after { content: \" \"; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
            + ".alrDialog .alrDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #0183FC; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; border-radius: 36px;}                                                                       "
            + ".alrDialog .alrDialogBtn:after { content: \" \"; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             "
            + ".alrDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
            + "</style>"
            + "<div id=\"dialogs2\" style=\"display: none\">"
           
            + "<div class=\"alrDialog\">"

            + "    <div class=\"alrDialogBT\" id=\"dialog_msg1\" style=\"text-align: center;height: 30px;\">弹窗标题</div>"
            + "    <div class=\"alrDialogHd\">"

            + "    <div class=\"alrDialogNR\" id=\"dialog_msg2\" style=\"text-align: left;height: auto;\">弹窗内容，告知当前状态、信息和解决方法，描述文字</div>"

            + "    <div class=\"alrDialogFt\">"
            + "        <a href=\"javascript:;\" class=\"alrDialogBtn alrDialogBtnPrimary\" id=\"dialog_ok2\" style='background-color: lavender'>确定</a>"
            + "    </div></div></div>";
        document.body.appendChild(div);
        var dialogs2 = document.getElementById("dialogs2");
        dialogs2.style.display = 'block';
        var dialog_msg1 = document.getElementById("dialog_msg1");
        dialog_msg1.innerHTML = msg1;
        var dialog_msg2 = document.getElementById("dialog_msg2");
        dialog_msg2.innerHTML = msg2;
        var dialog_ok2 = document.getElementById("dialog_ok2");
        dialog_ok2.onclick = function() {
            dialogs2.style.display = 'none';
            callback();
        };
    };
    //调用_alert弹出框
var msg1="本站cookie已复制";
//var msg2="温馨提示：";
window._alert(msg1,document.cookie);// windows弹窗提示，不想要弹窗可注释掉;
 /*----------------/重写alert弹窗样式----------------------*/

//alert(document.cookie);//原来的弹窗消息
    return;
  };
})();
