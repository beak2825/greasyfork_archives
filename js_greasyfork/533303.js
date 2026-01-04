// ==UserScript==
// @name         jav_lib_more
// @namespace    http://tampermonkey.net/
// @version      2025-04-22.1
// @description  find vid for jav lib
// @author       jacky
// @license      MIT
// @match        https://www.javlibrary.com/cn/publictopic.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @connect     missav.ai
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/533303/jav_lib_more.user.js
// @updateURL https://update.greasyfork.org/scripts/533303/jav_lib_more.meta.js
// ==/UserScript==

//window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener("load", pageFullyLoaded);

unsafeWindow.add_vid = function(id) {
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://missav.ai/cn/search/${id}`,
        onload: function(response) {
            var r = $(response.responseText).find('video');
            r.each(function(){
                var r1 = this.dataset.src;
                var r2 = $(this).next('img')[0];
                var alt = r2.alt;
                r2 = r2.dataset.src;
                var video = `<video controls poster="${r2}"><source src="${r1}" type="video/mp4"></video>`;
                $('#'+id).append(video);
                var r3 = this.parentNode.nextElementSibling;
                if (r3) {
                    var h = r3.href;
                    var t1 = $.trim(r3.innerText);
                    var t = t1;
                    r3 = r3.nextElementSibling;
                    if (r3) {
                        t1 = $.trim(r3.innerText);
                        t = `${t} ${t1}`;
                    }
                    $('#'+id).append(`<div><a target=_blank href="${h}">${alt}</a><b>${t}</b></div>`);
                }
            });
        },
        onerror:  function(response) {
            $('#'+id).append(`<a target=_blank href="https://missav.ai/cn/search/${v}"><span style="color:red;font-weight:bold;">${id}</span></a>`);
        },
        ontimeout:  function(response) {
            $('#'+id).append(`<a target=_blank href="https://missav.ai/cn/search/${v}"><span style="color:red;font-weight:bold;">${id}</span></a>`);
        },
    });
}

function pageFullyLoaded () {
    $('.posttext').each(function(){
        var t = $(this).text();
        console.log(t);
        var h = $(this).html();
        var m = t.match(/[A-Za-z0-9]+\-[0-9]+/g);
        if (m) {
            $.each(m, function(k, v){
                var l = `<a target=_blank href="https://missav.ai/cn/search/${v}"><span style="font-weight:bold;">${v}</span></a>&nbsp;<a href="javascript:void(0);" onclick="add_vid('${v}');"><span style="color:red;font-weight:bold;">预览</span></a><div id="${v}"></div>`;
                h = h.replace(v, l);
            });
        }
        $(this).empty();
        $(this).append(h);
    });
}