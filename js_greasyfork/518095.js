// ==UserScript==
// @name         PlayList
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  下载你的歌单列表
// @author       2222234
// @match        https://music.163.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/518095/PlayList.user.js
// @updateURL https://update.greasyfork.org/scripts/518095/PlayList.meta.js
// ==/UserScript==

(function() {
    var btn = document.createElement("input");
    btn.id = "btn";
    btn.type = "button";
    btn.value = "读取歌单";
    btn.style.position="absolute";
    btn.style.top="100px";
    document.body.appendChild(btn);

    btn.onclick=function(){
        var iframe = document.getElementsByTagName("iframe")[0];
        var iframeDocument = iframe.contentWindow.document;
        var url = iframe.contentWindow.location.href;
        const trs = iframeDocument.getElementsByTagName("tr");
        const name = iframeDocument.getElementsByClassName("f-ff2 f-thide")[0];
        if(trs.length == 0){
            alert("未在"+name.textContent+"中读取到歌曲");
            return;
        }
        var cf = confirm("在"+name.textContent+"中读取到"+(trs.length-1)+"首歌曲 是否下载歌曲列表");
        if(!cf){
            return;
        }
        const author = iframeDocument.getElementsByClassName("s-fc7");
        const real = author[author.length-1];
        const time = iframeDocument.getElementsByClassName("time s-fc4")[0];

        const titleElements = iframeDocument.getElementsByTagName("b");
        const timeElements = iframeDocument.getElementsByClassName("u-dur candel");
        const textElements = iframeDocument.getElementsByClassName("text");
        const txtElements = iframeDocument.getElementsByClassName("txt");

        var text = new Array();
        text.push(name.textContent+"\n"+
                  "由"+real.textContent+"于"+time.textContent+"\n\n");
        for(var i = 0;i<trs.length-1;i++){
            text.push((i+1)+"."+titleElements[i].getAttribute("title")+"\n"+
                      "  "+timeElements[i].textContent+"\n"+
                      "  "+textElements[i*2].getAttribute("title")+"\n"+
                      "  "+textElements[i*2+1].children[0].getAttribute("title")+"\n"+
                      "  "+txtElements[i].children[0].href+"\n\n");
        }
        text.push("链接："+url);
        const data = new Blob(text, { type: 'text/plain' });
        saveAs(data, name.textContent+".txt");
    }
})();