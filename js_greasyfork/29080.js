// ==UserScript==
// @name         Slideshare DownloadBoxy
// @namespace    Slideshare Download URL Generator
// @version      0.3
// @description  https://toolboxy.blogspot.com/
// @author       QQBoxy
// @include      https://www.slideshare.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29080/Slideshare%20DownloadBoxy.user.js
// @updateURL https://update.greasyfork.org/scripts/29080/Slideshare%20DownloadBoxy.meta.js
// ==/UserScript==
function $(id) {
    var i = 0;
    var j = 0;
    var elems = document.body.getElementsByTagName('*');
    var target = id.substr(1);
    var result=[];
    for(i=0;j=elems[i];i++) {
        if(j.getAttribute("class")) {
            if(j.getAttribute("class").indexOf(target)!=-1) {
                result.push(j);
            }
        }
    }
    return result;
}

function slideshareboxy() {
    var e = $('.slide_container')[0].getElementsByTagName('img');
    var o = "";
    for(var key=0;key<e.length;key+=1) {
        if(e[key].attributes['data-full']) {
            var url = e[key].attributes['data-full'].value;
            a = document.createElement("a");
            a.target = "blank";
            a.download = "download";
            a.href = url;
            a.click();
        }
    }
}

function downloadboxy() {
    var btn = document.createElement("button");
    btn.onclick = function() {
        slideshareboxy();
    };
    btn.innerHTML = "Download Images";
    $('.playerWrapper')[0].appendChild(btn);
}
downloadboxy();