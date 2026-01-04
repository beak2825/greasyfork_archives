// ==UserScript==
// @name             IT之家屏蔽优化器
// @name:zh-CN  IT之家屏蔽优化器
// @description              屏蔽“曝光”类新闻。移除看不惯的一堆垃圾信息。移除辣品广告。改变显示样式，将5页内容全部显示。
// @description:zh-CN   屏蔽“曝光”类新闻。移除看不惯的一堆垃圾信息。移除辣品广告。改变显示样式，将5页内容全部显示。
// @version             1.4
// @icon                  https://www.ithome.com/favicon.ico
// @author              Luoht
// @match               https://*.ithome.com/*
// @grant               unsafeWindow
// @run-at              document-end
// @namespace https://greasyfork.org/users/576566
// @downloadURL https://update.greasyfork.org/scripts/404466/IT%E4%B9%8B%E5%AE%B6%E5%B1%8F%E8%94%BD%E4%BC%98%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/404466/IT%E4%B9%8B%E5%AE%B6%E5%B1%8F%E8%94%BD%E4%BC%98%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    let url = window.location.href;
    if (url.indexOf("ithome")==-1) {
        return false;
    }

    let deleteElements = [];
    let pages = document.querySelector("#n-p");
    let side_func = document.querySelector("#side_func");
    deleteElements.push(pages);
    deleteElements.push(side_func);

    deleteElements.forEach(item => {
        if(item) item.remove();
    });

    //评论数量 设置字体颜色大小
    let s = document.querySelector(".pti_comm");
    if(s) {
        s.style.color = "#D22222";
        s.style.fontSize = "20px";
    }

    let box = document.querySelector(".t-b.sel");
    let list = document.querySelectorAll(".t-b>.nl > li");
    let temp_list = [];

    let loadIndex = 0;
    if (list.length > 0) {
        let pingbiArray = ["曝光", "爆料", "首曝", "预热", "官宣", "渲染图", "将 发布", "海报 公布", "当当", "福包", "会员", "云主机", "红包", "天猫", "淘宝", "李国庆", "俞渝"];
        list.forEach(function(item) {
            let text = item.querySelector("a").innerText;
            let href = item.querySelector("a").getAttribute("href");
            let isPingbi = pingbiArray.some(function(pingbi) {
                if (href.indexOf("lapin") > -1) return true;
                let ss = pingbi.trim().split(/\s+/);
                let r = ss.reduce(function (pre, item) {
                    if (pre && item) {
                        return pre + ".*(" + item + ")"
                    } else if (item) {
                        return "(" + item + ")"
                    }
                }, "")
                return new RegExp(r, 'g').test(text)
            });
            if (!isPingbi) {
                temp_list.push(item);
            };
        });

        box.innerHTML = "";
        let ulList = [];
        let hang = 5;
        let ulNum = Math.ceil(temp_list.length / hang);

        for(let i = 0; i < ulNum; i++){
            let ul = document.createElement("ul");
            ul.setAttribute('class', 'nl');
            ulList.push(ul);
        }

        for(let i = 0; i < temp_list.length; i++){
            ulList[Math.floor(i / hang)].appendChild(temp_list[i]);
        }

        box.innerHTML = "";

        for(let i = 0; i < ulList.length; i++){
            box.appendChild(ulList[i]);
        }

    }

})();
