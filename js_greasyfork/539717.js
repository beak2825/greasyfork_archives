// ==UserScript==
// @name        豆瓣书籍一键跳转
// @description 改编自https://github.com/OldPanda/douban-book-plus-homepage
// @namespace   namespace
// @match       *://book.douban.com/subject/*
// @version     1.5.1
// @author      -
// @license     WTFPL
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.xmlhttpRequest
// @grant GM.getResourceURL
// @resource logo_douban https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/douban-logo.svg
// @resource logo_duokan https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/duokan-logo.png
// @resource logo_snail https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/snailreader-logo.png
// @resource logo_dedao https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/dedao-logo.png
// @resource logo_zlibrary https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/zlibrary-logo.png
// @resource logo_anna https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/anna-logo.svg
// @resource logo_weread https://github.com/OldPanda/douban-book-plus-homepage/raw/refs/heads/master/docs/public/weread-logo.png

// @downloadURL https://update.greasyfork.org/scripts/539717/%E8%B1%86%E7%93%A3%E4%B9%A6%E7%B1%8D%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539717/%E8%B1%86%E7%93%A3%E4%B9%A6%E7%B1%8D%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

const vendors = [
    "weread",
    // "kindle",
    "duokan",
    "snail",
    "douban",
    "dedao",
    "zlibrary",
    "anna"
];


const preferencesKey = "douban-book-plus-preferences";

const apiEndpoint = "https://api.old-panda.com/GetEBookUrls";

const dedaoPrefix1 = "https://www.dedao.cn/reader";
const dedaoPrefix2 = "https://www.dedao.cn/ebook/reader";
const doubanPrefix = "https://read.douban.com/reader/ebook";

function simple_fetch(url, method = "GET") {
    return new Promise((resolve, reject) => {
        GM.xmlhttpRequest({
            url: url,
            method: method,
            responseType: "json",
            onload(res) {
                try {
                    if (res.status == 200) {
                        resolve(res.response);
                    } else {
                        reject(new DOMException("Failed to fetch: response code is " + res.status));
                    }
                } catch (e) {
                    reject(e);
                }
            },
            onabort() {
                reject(new DOMException("Aborted", "AbortError"));
            },
            ontimeout() {
                reject(new TypeError("Network request failed, timeout"));
            },
            onerror(err) {
                reject(new TypeError("Failed to fetch: " + err.finalUrl));
            },
        });
    })
}

async function background(message) {
    let ebookLinks = message.ebooks;
    let dedao = null;
    let douban = null;
    for (let link of ebookLinks) {
        if (link.startsWith(dedaoPrefix1) || link.startsWith(dedaoPrefix2)) {
            dedao = link;
        } else if (link.startsWith(doubanPrefix)) {
            douban = link;
        }
    }
    let params = new URLSearchParams({
        "isbn": message.isbn,
        "title": message.title,
        "authors": message.authors,
        "publisher": message.publisher,
        "douban_url": message.doubanURL,
    });
    if (message.subtitle !== null) {
        params.append("subtitle", message.subtitle);
    }
    if (message.translators !== null) {
        params.append("translators", message.translators);
    }
    if (dedao !== null) {
        params.append("dedao", dedao);
    }
    if (douban !== null) {
        params.append("douban", douban);
    }
    let url = apiEndpoint + "?" + params.toString();

    // fetch preferences first, then remove the vendors
    // which are turned off by users


    let resp = await simple_fetch(url);
    let settings = await GM.getValue("vendors", { 'weread': false });
    for (let [vendor, checked] of Object.entries(settings)) {
        if (!checked) {
            delete resp[vendor];
        }
    }
    return resp;
}

const nonAsciiChecker = str => [...str].some(char => char.charCodeAt(0) > 127);

const imgSizes = {
    "weread": [117, 32],
    "duokan": [109, 32],
    "snail": [129, 32],
    "douban": [99, 32],
    "dedao": [80, 32],
    "zlibrary": [126, 32],
    "anna": [200, 32],
    "nobook": [150, 32],
};

let getValue = (item) => {
    return item.split(":")[1].trim();
};

let parseNames = (names) => {
    return names.split("/")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => {
            let newItem = item;
            if (item.startsWith("[") || item.startsWith("【")) {
                let idx = 0;
                while (idx < item.length) {
                    if (item[idx] == "]" || item[idx] == "】") {
                        break;
                    }
                    idx++;
                }
                newItem = item.substring(idx + 1, item.length);
            }
            return newItem.trim().replace(/ /g, "");
        })
        .join(",");
}

async function main() {
    if (window.location.href.indexOf("book.douban.com/subject/") != -1 && window.location.href.indexOf("/comments/") === -1) {
        // parse basic info of the book
        let title = document
            .querySelectorAll("[property='v:itemreviewed']")[0]
            .textContent.trim();
        if (nonAsciiChecker(title)) {
            title = title.replaceAll(" ", "").trim();
        }
        let bookInfo = document.getElementById("info").innerText.split("\n");
        let isbn, publisher, authors, subtitle, translators;
        for (let i = 0; i < bookInfo.length; i++) {
            if (bookInfo[i].trim().startsWith("ISBN:")) {
                isbn = getValue(bookInfo[i]);
            } else if (bookInfo[i].trim().startsWith("出版社:")) {
                publisher = getValue(bookInfo[i]);
            } else if (bookInfo[i].trim().startsWith("作者:")) {
                authors = getValue(bookInfo[i]);
            } else if (bookInfo[i].trim().startsWith("副标题:")) {
                subtitle = getValue(bookInfo[i]);
            } else if (bookInfo[i].trim().startsWith("译者:")) {
                translators = getValue(bookInfo[i]);
            }
        }
        authors = parseNames(authors);
        if (translators !== null && translators !== undefined) {
            translators = parseNames(translators);
        }

        // parse link of Douban and Dedao, if available
        let ebooksOnPage = document.getElementsByClassName("online-read-or-audio");
        let ebookLinks = [];
        for (let ebook of ebooksOnPage) {
            let link = ebook.getElementsByTagName("a").item(0).getAttribute("href");
            if (link !== null) {
                ebookLinks.push(link);
            }
        }

        if (isbn !== null && title !== null && publisher !== null && authors !== null) {
            let message = await background(
                {
                    isbn: isbn,
                    title: title,
                    subtitle: subtitle,
                    publisher: publisher,
                    authors: authors,
                    translators: translators,
                    doubanURL: window.location.href,
                    ebooks: ebookLinks
                }
            );
            let found = false;
            if (message.hasOwnProperty("weread")) {
                showLink("weread", message.weread, "img/weread-logo.png");
                found = true;
            }
            // if (message.hasOwnProperty("kindle")) {
            //   showLink(message.kindle, "img/kindle-logo.png");
            // }
            if (message.hasOwnProperty("duokan")) {
                showLink("duokan", message.duokan, "img/duokan-logo.png");
                found = true;
            }
            if (message.hasOwnProperty("snail")) {
                showLink("snail", message.snail, "img/snail-logo.png");
                found = true;
            }
            if (message.hasOwnProperty("douban")) {
                showLink("douban", message.douban, "img/douban-logo.svg");
                found = true;
            }
            if (message.hasOwnProperty("dedao")) {
                showLink("dedao", message.dedao, "img/dedao-logo.png");
                found = true;
            }
            if (message.hasOwnProperty("zlibrary")) {
                showLink("zlibrary", message.zlibrary, "img/zlibrary-logo.png");
                found = true;
            }
            if (message.hasOwnProperty("anna")) {
                showLink("anna", message.anna, "img/anna-logo.svg");
                found = true;
            }
            if (!found) {
                showLink("nobook", "", "img/no-book.png");
            }
        }
    }
}

function initDivElement() {
    let ul = document.getElementById("douban-book-plus-list");
    if (ul === null) {
        let div = document.createElement("div");
        div.id = "douban-book-plus";
        div.style.padding = "18px 16px";
        div.style.backgroundColor = "#F6F6F2";
        div.style.margin = "20px auto";

        let componentTitle = document.createElement("h2");
        componentTitle.innerHTML = `
    <span>在线阅读</span>
      &nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;
    `;
        componentTitle.style.fontSize = "15px";
        div.append(componentTitle);
        ul = document.createElement("ul");
        ul.id = "douban-book-plus-list";
        div.append(ul);

        let footer = document.createElement("p");
        footer.style = "text-align: center; color: grey;";
        footer.innerHTML = `Powered by <a href="https://doubanbook.plus/" target="_blank">Douban Book+</a>`;
        div.append(footer);

        let element = document.getElementsByClassName("aside");
        element.item(0).insertBefore(div, element.item(0).firstChild);
    }
    return ul;
}

// add ebook logo
function showLink(name, url, imgUrl) {
    if (url) {
        let ul = initDivElement();
        let li = document.createElement("li");
        li.style.borderBottom = "1px solid rgba(0,0,0,0.08)";
        li.style.margin = "10px auto";
        let a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.style.backgroundColor = "transparent";
        let img = new Image();
        if (imgUrl.startsWith("http")) {
            img.src = imgUrl;
        } else {
            img.src = GM.getResourceURL(`logo_${name}`);
        }
        [img.width, img.height] = imgSizes[name];
        a.append(img);
        li.append(a);
        ul.append(li);
    } else if (name == "nobook") {
        let ul = initDivElement();
        let li = document.createElement("li");
        li.style.borderBottom = "1px solid rgba(0,0,0,0.08)";
        li.style.margin = "10px auto";
        let img = new Image();
        if (imgUrl.startsWith("http")) {
            img.src = imgUrl;
        } else {
            img.src = chrome.runtime.getURL(imgUrl);
        }
        img.style = "display: block; margin-left: auto; margin-right: auto;";
        [img.width, img.height] = imgSizes[name];
        li.append(img);
        ul.append(li);
    }
}

main().then();

