// ==UserScript==
// @name         药约约gitlab pipelines详情页面魔改
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  药约约gitlab pipelines详情页面魔改，增加job宽度
// @author       You
// @match        *://192.168.199.33:18060/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/442846/%E8%8D%AF%E7%BA%A6%E7%BA%A6gitlab%20pipelines%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E9%AD%94%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/442846/%E8%8D%AF%E7%BA%A6%E7%BA%A6gitlab%20pipelines%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E9%AD%94%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const timer = ms => new Promise(res => setTimeout(res, ms))

    async function load() {
        for (let i = 0; i < 30; i++) {
            try {
                let items = document.querySelectorAll("[data-testid=stage-column-group]");
                if (items.length >= 1) {
                    let parent = items[0].parentElement;
                    parent.classList.remove("gl-display-flex");

                    items.forEach(el => {
                        el.style.width = '400px';

                        let contentDiv = el.querySelector(".gl-text-truncate");
                        let content = contentDiv.innerText;
                        let newContent = content;
                        let projectName = content.split('.')[1];

                        if (content.endsWith(".API")) {
                            newContent = projectName + "—后台";
                        }
                        else if (content.endsWith(".QueryAPI")) {
                            newContent = projectName + "—只读";
                        }
                        else if (content.endsWith(".UseCaseAPI")) {
                            newContent = projectName + "—读写";
                        }

                        contentDiv.innerText = newContent;
                        contentDiv.style.width = '400px';
                        contentDiv.style.overflow = 'visible';
                    });
                    return;
                }
                else {
                    await timer(500);
                }
            }
            catch (e) { console.log(e) };
        }
    }

    load();
})();