// ==UserScript==
// @name         文献引用生成器
// @name:en-us   Reference Generator
// @description  自动生成页面参考文献引用字符串
// @description:en-us  Automatically generate reference strings of the page
// @author       KazariEX
// @version      1.0.2
// @license      MIT
// @copyright    2023-2023, References Generator Contributors (https://github.com/MysteryBao37/reference-generator/graphs/contributors)
// @namespace    http://github.com/MysteryBao37
// @homepageURL  https://github.com/MysteryBao37/reference-generator

// @match        *://*.gmw.cn/*/*/*
// @match        *://*.people.com.cn/*/*/*/*
// @match        *://www.cppcc.gov.cn/zxww/*/*/*/*
// @match        *://www.guancha.cn/*/*
// @match        *://www.npc.gov.cn/*/*/*
// @match        *://www.xuexi.cn/*/*/*

// @downloadURL https://update.greasyfork.org/scripts/468922/%E6%96%87%E7%8C%AE%E5%BC%95%E7%94%A8%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/468922/%E6%96%87%E7%8C%AE%E5%BC%95%E7%94%A8%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==
"use strict";

const typelist = [
    "DB/OL",
    "DB/MT",
    "DB/CD",
    "M/CD",
    "CP/DK",
    "J/OL",
    "EB/OL"
];

const re_date = /([0-9]*)[-\/\u5e74]([0-9]*)[-\/\u6708]([0-9]*)[\u65e5]?/;

const sites = {
    "gmw.cn": {
        date: {
            selector: "body > div.g-main > div.m-title-box > div > div.m_tips > span.m-con-time",
            re: /([0-9]*)-([0-9]*)-([0-9]*)/
        },
        src: {
            selector: "body > div.g-main > div.m-title-box > div > div.m_tips > span.m-con-source > a"
        },
        title: {
            selector: "body > div.g-main > div.m-title-box > h1"
        }
    },
    "people.com.cn": {
        date: {
            selector: "body > div.main > div.layout.rm_txt.cf > div.col.col-1.fl > div.channel.cf > div.col-1-1.fl",
            re: /([0-9]*)年([0-9]*)月([0-9]*)日/
        },
        src: {
            selector: "body > div.main > div.layout.rm_txt.cf > div.col.col-1.fl > div.channel.cf > div.col-1-1.fl > a"
        },
        title: {
            selector: "body > div.main > div.layout.rm_txt.cf > div.col.col-1.fl > h1"
        }
    },
    "www.cppcc.gov.cn": {
        date: {
            selector: "#page_body > div.column_wrapper.ariaskiptheme > div.col_w770.ariaskiptheme > div > div > div.infobox.ariaskiptheme > span.info.ariaskiptheme > i",
            re: /([0-9]*)-([0-9]*)-([0-9]*)/
        },
        src: {
            selector: "#page_body > div.column_wrapper.ariaskiptheme > div.col_w770.ariaskiptheme > div > div > div.infobox.ariaskiptheme > span.info.ariaskiptheme > em",
            re: /^来源：(.*)$/,
            index: 1
        },
        title: {
            selector: "#page_body > div.column_wrapper.ariaskiptheme > div.col_w770.ariaskiptheme > div > div > h3"
        }
    },
    "www.guancha.cn": {
        date: {
            selector: "body > div.content > div.main.content-main > ul > li.left.left-main > div.time.fix > span:nth-child(1)",
            re: /([0-9]*)-([0-9]*)-([0-9]*)/
        },
        src: {
            selector: "body > div.content > div.main.content-main > ul > li.left.left-main > div.time.fix > span:nth-child(3)",
            re: /^来源：(.*)$/,
            index: 1
        },
        title: {
            selector: "body > div.content > div.main.content-main > ul > li.left.left-main > h3"
        }
    },
    "www.npc.gov.cn": {
        date: {
            selector: "body > div.wrapper > div > div.fl.w680 > div.fontsize > span",
            re: /([0-9]*)\u5e74([0-9]*)\u6708([0-9]*)\u65e5/
        },
        src: {
            selector: "body > div.wrapper > div > div.fl.w680 > div.fontsize",
            re: /来源： (.*?)\s\s/,
            index: 1
        },
        title: {
            selector: "body > div.wrapper > div > div.fl.w680 > div.tit > h1"
        }
    },
    "www.xuexi.cn": {
        date: {
            selector: "#root > div > section > div > div > div > div > div:nth-child(2) > section > div > div > div > div > div > div > div.render-detail-detail > div > span.render-detail-time",
            re: /([0-9]*)-([0-9]*)-([0-9]*)/
        },
        src: {
            selector: "#root > div > section > div > div > div > div > div:nth-child(2) > section > div > div > div > div > div > div > div.render-detail-detail > div > span.render-detail-resource",
            re: /来源：(.*?)/,
            index: 1
        },
        title: {
            selector: "#root > div > section > div > div > div > div > div:nth-child(2) > section > div > div > div > div > div > div > div.render-detail-titles > div"
        }
    }
};

function siteHandler(site)
{
    const result = {};
    for (const key in site) {
        const elem = document.querySelector(site[key].selector);
        let value;
        if (elem) {
            if (site[key].re) {
                value = elem.textContent.match(site[key].re)[site[key].index ?? 0];
            }
            else {
                value = elem.textContent;
            }
        }
        result[key] = value.trim();
    }
    return result;
}

(function main() {

    const btn = document.createElement("button");
    btn.textContent = "生成文献引用";
    btn.style.cssText = `
    display: block;
    position: fixed;
    top: 8px;
    right: 8px;
    padding: 4px 12px;
    outline: none;
    box-shadow: 0 0 4px rgb(0 0 0 / 33%);
    border: 0;
    border-radius: 4px;
    background-color: rgb(255 255 255 / 88%);
    cursor: pointer;
    z-index: 9999999;
    `;

    btn.addEventListener("click", handler);

    document.body.appendChild(btn);
})();

function handler()
{
    let type = typelist[6];
    let title = document.title;
    let author;
    let date;

    const $MetaList = document.querySelectorAll("head > meta");
    $MetaList.forEach(($Meta) => {
        //作者
        if ($Meta.name === "author" || $Meta.getAttribute("property")?.includes("author")) {
            author = $Meta.content;
        }
        //标题
        if ($Meta.getAttribute("property")?.includes("title")) {
            title = $Meta.content;
        }
    });

    //网站特化
    const host = window.location.host;
    for (const site in sites) {
        if (host.includes(site)) {
            ({
                date,
                src: author,
                title
            } = siteHandler(sites[site]));
        }
    };

    const dateFormat = function(item, index) {
        const len = index === 0 ? 4 : 2;
        return item.padStart(len, "0");
    }

    //发布日期
    date = date.match(re_date)
    .slice(1, 4)
    .map(dateFormat)
    .join("-");

    //引用日期
    const now = new Date()
    .toLocaleDateString()
    .split("/")
    .map(dateFormat)
    .join('-');

    //拼接结果
    const result = `[1] ${author}. ${title}[${type}]. (${date})[${now}] ${window.location.href}`;

    //显示结果
    alert(result);
};