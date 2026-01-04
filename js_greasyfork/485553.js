// ==UserScript==
// @name         壹伴
// @namespace    http://tampermonkey.net/
// @description  用于复制壹伴模板
// @version      2024-01-24
// @description  try to take over the world!
// @author       You
// @match        https://yiban.io/style_detail/normal/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yiban.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485553/%E5%A3%B9%E4%BC%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/485553/%E5%A3%B9%E4%BC%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var herfs = location.href.split("/")
    var copyId = herfs[herfs.length-1].split(".")[0]
    console.log("当前模板id：",copyId)
    let copyNodeHtml = `
    <div class="copy" view-ref="freeCopy" id="freeCopy">
              <img src="//assets.yiban.io/assets/imgs/style-detail/copy-icon-cc67359cc2.png" alt="剪贴板">
              <span style="color: #ffb600;">免费复制</span>
    </div>
    `

    function decodeHtmlEntities(e) {
        return $("<textarea/>").html(e).text()
    }
    function addUrlArgs(e, t) {
        var n = e.split("#")
        , i = n[0]
        , r = n[1]
        , a = [];
        for (var s in t) {
            var o = t[s];
            void 0 !== o && null !== o && a.push(s + "=" + encodeURIComponent(o.toString()))
        }
        return i.indexOf("?") > -1 ? i += "&" + a.join("&") : i += "?" + a.join("&"),
            r ? i + "#" + r : i
    }
    function parseData(t){
        var n = function(t) {
            if (t = decodeHtmlEntities(t),
                t.indexOf("url") > -1 && t.indexOf('"') > -1) {
                t = "url(" + t.match(/https?:([^"]*)/g) + ")"
            }
            return t = t.replace(/https?:([^();"]*)/g, function(t) {
                return t = addUrlArgs(t, {
                    "mpa-referer": "none"
                })
            })
        };
        return t = t.replace(/url(\([^\(]*\))/g, function(e) {
            return n(e)
        }),
            t = t.replace(/src=(\"[^\"]*\")/g, function(e) {
            return n(e)
        })
    }

    let copyParent = document.querySelector("#style-detail > div > section.style-detail-intro > div.style-operator")
    copyParent.insertAdjacentHTML("beforeend",copyNodeHtml)
    let copyEle = document.querySelector("#freeCopy")
    copyEle.addEventListener("click",()=>{
        console.log("free copy", copyId)
        fetch("https://yiban.io/api/article_editor/collection/copy?material_id="+copyId, {
            "headers": {
                "accept": "text/plain, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-request-browser": "Edge",
                "x-request-client": "web",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://yiban.io/style_detail/normal/20240117/21428.html",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(r=>r.json()).then(data=>{
            console.log(data)
            let detail = data.material.detail
            let sec = document.createElement("section")
            let insertData = parseData(detail)
            debugger
            sec.innerHTML = insertData
            sec.classList.add("mpa-template")
            sec.setAttribute("data-mpa-template","t")
            var l = document.createElement("input");
            document.body.appendChild(l)
            l.setAttribute("value", sec.outerHTML)
            l.select();
            try {
                document.execCommand("copy")
            } catch (e) {
                console.log("please press Ctrl/Cmd+C to copy")
            }
            document.body.removeChild(l)
            alert("复制成功")
        });
    });
    // Your code here...
})();