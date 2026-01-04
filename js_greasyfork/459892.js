// ==UserScript==
// @name         ChatGPT Download Markdown
// @namespace    https://space.bilibili.com/1208812226
// @version      0.3
// @description  快捷键：Ctrl+Alt+S，一键下载ChatGPT页面内容为Markdown文档，也可点击右侧下载图标下载页面内容
// @author       大王鹅鹅鹅
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @icon         https://chat.openai.com/favicon-32x32.png
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/459892/ChatGPT%20Download%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/459892/ChatGPT%20Download%20Markdown.meta.js
// ==/UserScript==
 
(function () {
    "use strict";

 document.addEventListener("keydown", function (event) {
 if (event.altKey && event.keyCode == 83) {//下载为markdown格式——快捷键：Ctrl+Alt+S
            if (event.ctrlKey) {
                downloadMD();
            }
        }
   });


})();
   
function downloadMD(){
    const wFull = document.querySelectorAll(".w-full.border-b");
    var allContent="";
    if(wFull!=null && wFull.length>0){
        var myTitle=wFull[0].innerText;
        for(let i=0;i<wFull.length;i++){
            if(i%2==0){
                allContent+="### "+wFull[i].innerText+"\n";
            }else{
                allContent+=""+wFull[i].innerText.replace("Copy code", "```\n").replace("\n\n\n", "\n```\n")+"\n\n";
            }
        }

        let blob = new Blob([allContent]);
        let a = document.createElement('a');
        a.download = "ChatGPT_"+ myTitle+ ".md";
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
    }
}


window.onload=function(){
    var svgDom= '<button style="padding-left: 5px;font-size: 100%;cursor: pointer; position: absolute; top: 14rem;right: 1.5rem;width: 2em;height: 2em;z-index: 100000; border-radius: 9999px; border-width: 1px;border-color: #10a37f;background-color: rgba(247,247,248,0.1);color: rgba(86,88,105,1); "><svg t="1676210681214" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1992" width="1.2em" height="1.2em"><path d="M828.975746 894.125047 190.189132 894.125047c-70.550823 0-127.753639-57.18542-127.753639-127.752616L62.435493 606.674243c0-17.634636 14.308891-31.933293 31.93227-31.933293l63.889099 0c17.634636 0 31.93227 14.298658 31.93227 31.933293l0 95.821369c0 35.282574 28.596292 63.877843 63.87682 63.877843L765.098927 766.373455c35.281551 0 63.87682-28.595268 63.87682-63.877843l0-95.821369c0-17.634636 14.298658-31.933293 31.943526-31.933293l63.877843 0c17.634636 0 31.933293 14.298658 31.933293 31.933293l0 159.699212C956.729385 836.939627 899.538849 894.125047 828.975746 894.125047L828.975746 894.125047zM249.938957 267.509636c12.921287-12.919241 33.884738-12.919241 46.807049 0l148.97087 148.971893L445.716876 94.89323c0-17.634636 14.300704-31.94762 31.933293-31.94762l63.875796 0c17.637706 0 31.945573 14.312984 31.945573 31.94762l0 321.588299 148.97087-148.971893c12.921287-12.919241 33.875528-12.919241 46.796816 0l46.814212 46.818305c12.921287 12.922311 12.921287 33.874505 0 46.807049L552.261471 624.930025c-1.140986 1.137916-21.664416 13.68365-42.315758 13.69286-20.87647 0.010233-41.878806-12.541641-43.020816-13.69286L203.121676 361.13499c-12.922311-12.933567-12.922311-33.884738 0-46.807049L249.938957 267.509636 249.938957 267.509636z" fill="#10a37f" p-id="1993"></path></svg></button>';
    var newDiv = document.createElement("div");
    newDiv.innerHTML = svgDom;
    newDiv.addEventListener("click", () => {
      downloadMD();

    });
    document.body.append(newDiv);

};

