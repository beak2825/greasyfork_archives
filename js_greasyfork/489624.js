// ==UserScript==
// @name         nHentai 标签翻译
// @namespace    http://tampermonkey.net/
// @version      2024-03-11
// @description  nHentai 标签翻译，标签数据来源于https://github.com/EhTagTranslation/Database
// @license MIT
// @author       nuliptr
// @match        https://nhentai.net/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/489624/nHentai%20%E6%A0%87%E7%AD%BE%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/489624/nHentai%20%E6%A0%87%E7%AD%BE%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const a = document.createElement('a')
    a.innerHTML = "重新获取标签数据"
    const reloadButton = document.createElement('li').appendChild(a);
    reloadButton.innerHTML = "重新获取标签数据";

    reloadButton.addEventListener("click", function (event) {

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://github.com/EhTagTranslation/DatabaseReleases/raw/master/db.html.json",
            onload: function (response) {
                // 将响应解析为JSON
                const raw = JSON.parse(response.responseText);
                GM_setValue("tag-data", raw)
                // 在这里可以处理获取到的JSON数据



                window.location.reload()
            },
            onerror: function (error) {
                // 发生错误时的处理逻辑
                console.error("Error loading JSON: " + error);
            }
        });
    })

    const rightNav = document.body.querySelector("nav .menu.right")
    rightNav.insertBefore(reloadButton, rightNav.firstChild);

    const data = GM_getValue("tag-data")
    if (!data) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://github.com/EhTagTranslation/DatabaseReleases/raw/master/db.html.json",
            onload: function (response) {
                // 将响应解析为JSON
                const raw = JSON.parse(response.responseText);
                GM_setValue("tag-data", raw)
                // 在这里可以处理获取到的JSON数据



                translate(raw)
            },
            onerror: function (error) {
                // 发生错误时的处理逻辑
                console.error("Error loading JSON: " + error);
            }
        });
    }
    translate(data)



    var tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#1f1f1f';
    tooltip.style.borderRadius = '10px';

    tooltip.style.padding = '5px';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Function to show the tooltip with HTML content
    function showTooltip(htmlContent, x, y) {
        tooltip.innerHTML = htmlContent;
        tooltip.style.left = (x + 10) + 'px';
        tooltip.style.top = (y + 10) + 'px';
        tooltip.style.display = 'block';
    }

    // Function to hide the tooltip
    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    function translate(raw) {
        console.log(raw);
        const data = raw.data.reduce((p, c) => {
            p[c["namespace"]] = c.data;
            return p
        }, {})

        replace();
        function replace(selector) {
            const nodes = document.querySelectorAll("#tags .tag");
            for (const tagNode of nodes) {

                const [tagType, tagName] = tagNode.href.substring("https://nhentai.net/".length, tagNode.href.length - 1).replaceAll("-", " ").split('/');
                let target
                switch (tagType) {
                    case "tag":
                        target = data["male"][tagName] || data["female"][tagName] || data["mixed"][tagName] || data["other"][tagName];
                        break;
                    case "parody":
                        target = data["parody"][tagName]
                        break;
                    case "character":
                        target = data["character"][tagName]
                        break;
                    case "group":
                        target = data["group"][tagName]
                        break;
                    case "artist":
                        target = data["artist"][tagName]
                        break;
                    default:
                        break;
                }
                if (target) {
                    tagNode.firstChild.innerHTML = target.name.substring(3, target.name.length - 4) + `(${tagNode.firstChild.innerHTML})`;
                    const htmlContent = target.intro;
                    if (htmlContent) {
                        tagNode.addEventListener('mouseover', function (event) {

                            var x = event.clientX;
                            var y = event.clientY;
                            showTooltip(htmlContent, x, y);
                        });

                        tagNode.addEventListener('mouseout', function () {
                            hideTooltip();
                        });
                    }

                }
            }
        }
    }
})();


