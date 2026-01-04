// ==UserScript==
// @name         预加载下一章/页，方向键上/下一章
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       wodexianghua
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393472/%E9%A2%84%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E7%AB%A0%E9%A1%B5%EF%BC%8C%E6%96%B9%E5%90%91%E9%94%AE%E4%B8%8A%E4%B8%8B%E4%B8%80%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/393472/%E9%A2%84%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E7%AB%A0%E9%A1%B5%EF%BC%8C%E6%96%B9%E5%90%91%E9%94%AE%E4%B8%8A%E4%B8%8B%E4%B8%80%E7%AB%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var shang = false;
    var xia = false;
    var found_pre_now;
    var found_next_now;
    var iscanfenye = true;
    var searchText = {
        pre: ["上一章", "上一页", "pre", "<", "< 上一页"],
        next: ["下一章", "下一页", "next", ">", "下一页 >"]
    }

    document.addEventListener('keydown', function (event) {
        if (document.activeElement.nodeName != 'BODY') return;
        else if (document.activeElement.nodeName == 'BODY' && !iscanfenye) return;

        if (event.keyCode == 37) shang = true;
        else if (event.keyCode == 39) xia = true;

        //是否按下左右键
        if (shang || xia) {
            if (shang) {
                found_pre_now = getpreornextelement("a", searchText.pre);
                if (found_pre_now == undefined) found_pre_now = getpreornextelement("button", searchText.pre)
                if (found_pre_now != undefined) {
                    shang = false;
                    found_pre_now.click();
                    return;
                }
            } else {
                found_next_now = getpreornextelement("a", searchText.next);
                if (found_next_now == undefined) found_next_now = getpreornextelement("button", searchText.next);
                if (found_next_now != undefined) {
                    xia = false;
                    found_next_now.click();
                    return;
                }
            }
            shang = false;
            xia = false;
        }
    });

    //如果有视频在播放，禁用左右键翻页
    let video = document.querySelector('video');
    if (video != null) {
        video.addEventListener("play", function () {
            iscanfenye = false;
        });
        video.addEventListener("pause", function () {
            iscanfenye = true;
        });
    }

    setTimeout(() => {
        foundnextpage();
    }, 2000);

    //预加载下一页
    function foundnextpage() {
        found_next_now = getpreornextelement("a", searchText.next);

        //如果没找到或者href是javascript的话就退出
        if (found_next_now == undefined) {
            return;
        } else if (found_next_now.getAttribute('href').includes("javascript")) {
            return;
        }

        let xiaurl = found_next_now.getAttribute('href');
        if (!xiaurl.includes(document.domain)) {
            var ishttps = 'https:' == document.location.protocol ? true : false;
            if (ishttps) {
                xiaurl = 'https://' + xiaurl;
            } else {
                xiaurl = 'http://' + xiaurl;
            }
        }
        var head = document.querySelector('head');
        head.insertAdjacentHTML('beforeend', '<link rel="prefetch" href="' + xiaurl + '" />');
        return;
    }

    /**
     * @param {string} tags
     * @param {string[]} searchTextarry
     * @return {HTMLAnchorElement} 
     */
    function getpreornextelement(tags, searchTextarry) {
        let aTags = document.getElementsByTagName(tags);
        for (const iterator of aTags) {
            let incElement = includesElement(iterator, searchTextarry);
            if (incElement) return incElement;
        }
        return undefined;
    }

    /**
     * @param {string[]} searchTextarry
     * @param {HTMLAnchorElement} element
     */
    function includesElement(element, searchTextarry) {
        for (const iterator of searchTextarry) {
            if (element.textContent.trim() == iterator) {
                return element;
            }
        }
        return undefined;
    }
    // Your code here...
})();