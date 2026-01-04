// ==UserScript==
// @name      t66y自动复制
// @namespace   Violentmonkey Scripts
// @match    *://t66y.com/*
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// @grant    GM_getResourceURL
// @grant    GM_listValues
// @grant    GM.getResourceUrl
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @grant    GM_registerMenuCommand
// @grant    GM_setClipboard
// @grant    opentab
// @grant    window.close
// @grant    unsafeWindow
// @run-at   document-idle
// @version     1.0
// @author      
// @description 2022/6/20 00:55:25
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/500397/t66y%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500397/t66y%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {


  console.log('我的脚本加载了');
  var button = document.createElement("button");
  button.innerHTML ="复制磁力";
  button.className = "a-b-c-d-toTop";
  var style = document.createElement("style");
   style.id = "a-b-c-d-style";
   var css = `.a-b-c-d-toTop{
    position: fixed;
    bottom: 10%;
    left: 5%;
    width: 130px;
    height: 50px;
    border-radius: 50%;
    font-size: 15px;
    z-index: 999;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
    }`


    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.body.appendChild(button);
    document.body.appendChild(style);



//button.addEventListener("click", function(){ for (var key in keywords){ replaceTextOnPage(key, keywords[key]);}});

  button.onclick = function (){

		console.log('点击了按键');

    var L_url = window.location.href;
    var t_title = document.title;
  //t66y自动复制磁力链接
      if (L_url.indexOf("t66y.com") != -1 ) {

        let target_link = document.getElementsByClassName("newTorrent newMagnet")[0].href;
        console.log(target_link);
        let target_txt = document.getElementsByClassName("h")[1].innerText.replace("--> 本頁主題:","");
        console.log(target_txt);
        let tt = target_link + target_txt+"\n";
        GM_setClipboard(tt);



///html/body/div[2]/div[1]/table/tbody/tr[1]/td/text()[3]
    }

		return;

	};
})();