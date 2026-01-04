// ==UserScript==
// @name         Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Fur下载器
// @author       Rehtt
// @match        *://www.furaffinity.net/*
// @icon         https://rehtt.com/img/rehtt.jpg
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @note         2020.1.28-V1.0 完成下载furaffinity
// @downloadURL https://update.greasyfork.org/scripts/395753/Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395753/Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("脚本By Rehtt")
    switch (location.host.split(".")[1]) {
        case "furaffinity":
            furaffinity();
            break
        default:
            break;
    }

})();

function furaffinity() {
    function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
    function download(document, ii) {
        let t = document.getElementsByTagName("figcaption")
        let id
        id = t[ii].getElementsByTagName("p")[0].getElementsByTagName("a")[0].href
        GM_xmlhttpRequest({
            method: "GET",
            url: id,
            onload: function (res) {
                let documentt = new DOMParser().parseFromString(res.responseText, 'text/html');
                let url = documentt.getElementsByClassName("button standard")
                for (let i = 0; i < url.length; i++) {
                    if (url[i].innerText == "Download") {
                        let name = url[i].href.split(".")
                        GM_download(url[i].href, name[name.length - 2] + "." + name[name.length - 1])
                        if (ii < t.length - 1) {
                            sleep(500).then(() => {
                                console.log("脚本By Rehtt")
                                download(document, ii + 1)
                            })
                        }
                        break
                    }
                }

            }
        });


    }


//
    let t = location.href.split(".")[2].split("/")[1];
    if (t == "gallery" || t == "scraps" || t == "favorites") {
        let tag1 = document.createElement("button")
        tag1.innerHTML = '下载当前页面'
        tag1.type = 'button'
        tag1.className = 'button'
        tag1.addEventListener('click', function () {
            download(document, 0)
        })
        let tag2 = document.createElement("button")
        tag2.innerHTML = '下载全部'
        tag2.type = 'button'
        tag2.className = 'button'
        let document2 = document
        let next
        tag2.addEventListener('click', function q() {
            download(document2, 0)
            next = document2.getElementsByClassName("p20 aligncenter")[0].getElementsByTagName("div")[3]
            if (next.innerText != "Next") {
                return
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: next.getElementsByTagName("form")[0].action,
                onload: function (res) {
                    document2 = new DOMParser().parseFromString(res.responseText, 'text/html');
                    q()
                }
            });
        })

        let biao = document.getElementsByClassName("button standard toggle_titles")
        biao[0].parentNode.appendChild(tag1)
        biao[0].parentNode.appendChild(tag2)

    }
}