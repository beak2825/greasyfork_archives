// ==UserScript==
// @name         Douban eBooks Finder
// @version      1.13
// @description  search the book on your preferred ebook platforms with just one click
// @author       limpido
// @license      MIT License
// @match        https://book.douban.com/subject/*
// @namespace
// @namespace https://github.com/caspartse/eBooksAssistant
// @downloadURL https://update.greasyfork.org/scripts/496938/Douban%20eBooks%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/496938/Douban%20eBooks%20Finder.meta.js
// ==/UserScript==

const platforms = [
    {
        title: "zlib (singlelogin.re)",
        urlPrefix: "https://singlelogin.re/s/?q="
    },
    {
        title: "zlib (z-library.sk)",
        urlPrefix: "https://z-library.sk/s/"
    },
    {
        title: "zlib (z-lib.gs)",
        urlPrefix: "https://z-lib.gs/s/"
    },
    {
        title: "Anna's Archive",
        urlPrefix: "https://annas-archive.org/search?q="
    }
]

const aside = document.querySelector(".aside");

if (aside) {
    bookTitle = document.querySelector("h1 > span").textContent;

    bookSubtitle = null;
    infoSpans = document.querySelectorAll("div#info > span");
    for (const span of infoSpans) {
        if (span.textContent === "副标题:") {
            bookSubtitle = span.nextSibling.textContent.trim();
        }
    }

    const ebookLinks = document.createElement("div");
    ebookLinks.id = "ebook_links";
    ebookLinks.style.padding = "18px 16px";
    ebookLinks.style.margin = "0 0 20px 0";
    ebookLinks.style.background = "#f6f6f2";

    const sectionTitle = document.createElement("h2");
    const sectionTitleSpan = document.createElement("span");
    sectionTitleSpan.textContent = "搜索电子版";
    sectionTitle.appendChild(sectionTitleSpan);
    sectionTitle.innerHTML += `&nbsp;&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·`;
    ebookLinks.appendChild(sectionTitle);

    ul = document.createElement("ul");
    for (const platform of platforms) {
        li = document.createElement("li");
        li.style.borderBottom = "1px solid rgba(0,0,0,.08)";
        li.style.padding = "12px 0";
        a = document.createElement("a");
        a.textContent = platform.title;
        a.href = `${platform.urlPrefix}${bookTitle}${bookSubtitle ? "+" + bookSubtitle : ""}`;
        li.appendChild(a);
        ul.appendChild(li);
    }
    
    ebookLinks.appendChild(ul);
    aside.insertAdjacentElement("afterbegin", ebookLinks);
} else {
    console.log("aside element not found!");
}