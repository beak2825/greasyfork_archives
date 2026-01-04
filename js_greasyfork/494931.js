// ==UserScript==
// @name         画廊页竖屏浏览
// @version      0.0.3
// @description  XGMT/MTTT画廊页读取所有图片
// @author       lin
// @match        *://*.xgmeitu.com/*/*/*/*.html
// @match        *://*.mttaotu.com/*/*/*/*.html
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @namespace    greasyfork
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494931/%E7%94%BB%E5%BB%8A%E9%A1%B5%E7%AB%96%E5%B1%8F%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/494931/%E7%94%BB%E5%BB%8A%E9%A1%B5%E7%AB%96%E5%B1%8F%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
(function () {
    let tmp = document.getElementsByClassName("pagelist");
    let size = tmp[tmp.length - 1].getElementsByTagName("a").length;
    let urls = [];
    let tp = document.getElementById("picg").getElementsByTagName("img");
    for (let ej = 0; ej < tp.length; ej++) {
        urls.push(tp[ej].src);
    }
    let td = new DOMParser();
    let ts = 2;
    let tu = window.location.href.split('.html')[0];
    
    let tt = document.title;
    $('h1')[0].textContent = "1 - " + size;
    let jj = function(tts) {
        let url = tu + "_" + tts + ".html";
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                let result = httpRequest.responseText;
                let doo = td.parseFromString(result, 'text/html');
                try {
                    let tp = doo.getElementById("picg").getElementsByTagName("img");
                    for (let ej = 0; ej < tp.length; ej++) {
                        urls.push(tp[ej].src);
                    }
                } catch (error) {
                    console.error(ts)
                }
                $('h1')[0].textContent  = ts + " - " + size;
                if (ts < size) {
                    ts++;
                    jj(ts)
                } else {
                    let doo2t = "<div id='cont' style='margin:auto;width:100%;'>";
                    for (let t = 0; t < urls.length; t++) {
                        if(urls[t].indexOf('gif')<0){
                            doo2t += "<img style='width:100%;' src='" + urls[t] + "' />";
                        }
                    }
                    doo2t += "</div>";
                    document.body.innerHTML = doo2t
                }
            } else if (httpRequest.readyState == 4) {
                jj(ts)
            }
        }
    };
    jj(ts);
})();
