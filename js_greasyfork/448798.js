// ==UserScript==
// @name            推文扒取
// @namespace       https://github.com/Cierra-Runis/getTweets
// @version         1.2
// @description     扒取推文的插件
// @connect         raw.githubusercontent.com
// @connect         github.com
// @connect         cdn.jsdelivr.net
// @author          https://github.com/Cierra-Runis
// @match           https://twitter.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/448798/%E6%8E%A8%E6%96%87%E6%89%92%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448798/%E6%8E%A8%E6%96%87%E6%89%92%E5%8F%96.meta.js
// ==/UserScript==

window.onload = (function () {
    'use strict';

    var list = [];
    var times = 0;
    setInterval(addButton, 1000);

    function addButton() {
        var div = document.createElement('div');
        div.style.cssText = "width: 25px;height: 25px;color: #ffffff;text-align: center;font-size: small;line-height: 25px;margin: 5px;cursor: pointer;display: flow-root;z-index: 1";
        div.innerText = "下载";
        div.onclick = function () {
            if (confirm("要下载推文吗？")) {
                setInterval(getTweets, 5000);
            }
        }
        if (document.querySelector('#react-root').lastChild.innerText == '下载') {
            // console.log('button has existed');
        } else {
            document.querySelector('#react-root').appendChild(div);
        }

    }

    function getTweets() {
        var url = window.location.href;
        var before = list.length;

        try {

            var blocks = document.evaluate('//*[@id="react-root"]/div[1]/div/div[2]/main/div/div/div/div[1]/div/div[3]/div/div/section/div/div', document).iterateNext().childNodes

            for (var i = 0; i < blocks.length; i++) {
                var div = blocks[i].querySelector('div>div>div>article>div>div');
                if (div == null) {
                    // console.log('block is null');
                } else {
                    try {
                        var block = div.childNodes[1];
                        if (block.childNodes[1].childElementCount != 3) {
                            console.log('This is a block has not text');
                            continue;
                        } else {
                            console.log('Has text!');
                        }
                        var href = block.getElementsByTagName("a")[0].href;
                        if (href != url) {
                            // console.log(href + "!=" + url);
                            continue;
                        } else {
                            var textContent = block.childNodes[1].childNodes[1].innerText;
                            var isExited = false;
                            for (var j = 0; j < list.length; j++) {
                                if (list[j].content == textContent) {
                                    // console.log('text (' + list[j].content + ') has existed!');
                                    isExited = true;
                                }
                            }
                            if (!isExited) {
                                console.log('text hasn\'t existed, adding to list.');
                                list.push({ content: textContent });
                            }
                        }
                    } catch (error) {
                        // console.log('href isn\'t exist');
                    }
                }
                // console.log(i + ". end");
            }
            // console.log('END');
            var after = list.length;
            if (after == before) {
                // console.log('No new text was add!!!');
                times++;
            } else {
                // console.log('New text was Add.');
                times = 0;
            }
            if (times > 3) {
                var jsonStr = JSON.stringify(list);
                // console.log(jsonStr);
                createAndDownloadFile(url.substring(20) + ".json", jsonStr);
                window.location.href = "about:blank";
                window.close();
            }
            window.scrollTo(0, document.body.scrollHeight);
        } catch (error) {
            console.log('error');
        }

    }

    function createAndDownloadFile(fileName, content) {
        var aTag = document.createElement('a');
        var blob = new Blob([content]);
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
    }

})();
