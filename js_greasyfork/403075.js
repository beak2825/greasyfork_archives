// ==UserScript==
// @name                Google: News Filter
// @name:zh-TW          Google 新聞過濾篩選
// @name:zh-CN          Google 新闻过滤筛选
// @name:ja             Googleニュースフィルター
// @name:ko             Google 뉴스 필터
// @name:ru             Новостной фильтр Google
// @version             1.0.6
// @description         Show or Hide news whatever you want.
// @description:zh-TW   可自行設定指定的新聞報社顯示或隱藏。
// @description:zh-CN   可自行设定指定的新闻报社显示或隐藏。
// @description:ja      好きなようにニュースを表示または非表示にします。
// @description:ko      원하는 뉴스를 표시하거나 숨 깁니다.
// @description:ru      Показать или скрыть новости, что вы хотите.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/zHU2Zt3.png
// @match               https://news.google.com/*
// @grant               GM_setValue
// @grant               GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403075/Google%3A%20News%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403075/Google%3A%20News%20Filter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // icon made by https://www.flaticon.com/authors/freepik
    const svg = `<svg width="15px" height="15px" viewBox="0 0 192.701 192.701" fill="#5f6368"><path d="M20.746,104.169l75.61-74.528l75.61,74.54c4.74,4.704,12.439,4.704,17.179,0s4.74-12.319,0-17.011l-84.2-82.997 c-4.559-4.511-12.608-4.535-17.191,0l-84.2,83.009c-4.74,4.692-4.74,12.319,0,17.011C8.307,108.873,16.006,108.873,20.746,104.169 z"/><path d="M104.946,88.373c-4.559-4.511-12.608-4.535-17.191,0l-84.2,82.997c-4.74,4.704-4.74,12.319,0,17.011 c4.74,4.704,12.439,4.704,17.179,0l75.622-74.528l75.61,74.54c4.74,4.704,12.439,4.704,17.179,0s4.74-12.319,0-17.011 L104.946,88.373z"/></svg>`;
    const css =
`.article {
    max-height: 100px;
    overflow: hidden;
    transition: all 0.3s;
}
.hide {
    max-height: 0px;
    padding: 0px !important;
}
.panel {
    border: 1px solid #dadce0;
    border-radius: 8px;
    padding: 8px;
    margin-right: 10px;
}
.title {
    font-size: 1rem;
    font-weight: 500;
    font-family: 'Google Sans', sans-serif;
    display: flex;
}
.hover {
    position: fixed;
    width: 450px;
    max-height: 1000px;
    right: 8px;
    top: 60px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    z-index: 999;
    background: white;
    overflow: hidden;
    transition: max-height 0.3s;
}
.collapse1 {
    max-height: 0px;
}
.collapse2 {
    border: 0px;
}
.arrow {
    margin-left: 15px;
    padding-top: 3px;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all 0.3s ease-in-out;
}
.rotateArrow {
    transform: rotate(180deg);
}
.pressed {
    background-color: #498ce4 !important;
    color: white !important;
}`;
    let scrolling = false;

    CSS();
    locationChange();
    window.addEventListener("load", init);
    window.addEventListener("scroll", update);

    function init(retry = 0) {
        // get all news title
        const titles = document.querySelectorAll("a.wEwyrc");
        // check
        if (!titles.length && retry < 5) {
            setTimeout(() => init(retry + 1), 500);
            return;
        }
        // title text
        const text = [...titles].map(title => title.innerText);
        const news = [...new Set(text)].sort();
        addMenu(news);
    }

    function addMenu(news) {
        // remove exist
        const exist1 = document.querySelector(".panel");
        const exist2 = document.querySelector(".hover");
        if (exist1) {
            exist2.firstElementChild.remove();
            addOption(exist2, news);
            return;
        }
        // get dynamic class.
        let dynamicClass = "";
        document.querySelector("[ng-non-bindable][data-ogsr-up]").classList.forEach(eachClass => {
            dynamicClass += `.${eachClass}`;
        });
        const parent = document.querySelector(dynamicClass);
        // create
        const panel = document.createElement("div");
        panel.className = "panel";
        parent.insertBefore(panel, parent.firstElementChild);
        const title = document.createElement("h2");
        title.className = "title";

        switch(document.querySelector("html").lang) {
            case "zh":
                title.innerText = "Google 新聞過濾篩選";
                break;
            case "ja":
                title.innerText = "Googleニュースフィルター";
                break;
            case "ko":
                title.innerText = "Google 뉴스 필터";
                break;
            case "ru":
                title.innerText = "Новостной фильтр Google";
                break;
            default:
                title.innerText = "Google News Filter";
        }

        panel.appendChild(title);
        const icon = document.createElement("div");
        icon.className = "arrow rotateArrow";
        icon.innerHTML = svg;
        icon.addEventListener("click", () => {
            const toggle = hover.classList.toggle("collapse1");
            setTimeout(() => hover.classList.toggle("collapse2"), toggle ? 300 : 0);
            icon.classList.toggle("rotateArrow");
        });
        title.appendChild(icon);
        const hover = document.createElement("div");
        hover.className = "hover collapse1 collapse2";
        document.body.appendChild(hover);
        // option
        addOption(hover, news);
    }

    function addOption(parent, news) {
        // create
        const div = document.createElement("div");
        div.className = "ndSf3d ttg1Pb j7vNaf Pz9Pcd a8arzf";
        // append
        parent.appendChild(div);
        // news
        news.forEach(text => singleOption(div, text));
    }

    function singleOption(div, text) {
        // create
        const div1 = document.createElement("div");
        div1.className = "To2ZZb u9jkpc hpDt6e DbQnIe rrijPb R7GTQ keNKEd";
        div1.style.cursor = "pointer";
        div1.addEventListener("click", () => setOption(div1, text));
        getOption(div1, text);
        const div2 = document.createElement("div");
        div2.className = "K9tMQ";
        const div3 = document.createElement("div");
        div3.className = "VgnMrb";
        const span1 = document.createElement("span");
        span1.className = "Ix4NZd";
        const span2 = document.createElement("span");
        span2.className = "pPbimc ljLXBd";
        span2.innerText = text;
        // append
        div.appendChild(div1);
        div1.appendChild(div2);
        div2.appendChild(div3);
        div3.appendChild(span1);
        span1.appendChild(span2);
    }

    function getOption(div, text) {
        // change color
        const isCollapse = GM_getValue(text, false);
        if (isCollapse) {
            div.classList.add("pressed");
        }
        // collapse or expand
        execution(isCollapse, text);
    }

    function setOption(div, text) {
        // change color and record
        const isCollapse = div.classList.toggle("pressed");
        GM_setValue(text, isCollapse);
        // collapse or expand
        execution(isCollapse, text);
    }

    function execution(isCollapse, text) {
        // add article class
        document.querySelectorAll("article:not(.article)").forEach(article => article.classList.add("article"));
        // collapse
        if (isCollapse) {
            document.querySelectorAll("article.article:not(.hide)").forEach(article => {
                const title = article.querySelector("a.wEwyrc").innerText;
                if (title.includes(text)) {
                    article.classList.add("hide");
                }
            });
        }
        // expand
        else {
            document.querySelectorAll("article.article.hide").forEach(article => {
                const title = article.querySelector("a.wEwyrc").innerText;
                if (title.includes(text)) {
                    article.classList.remove("hide");
                }
            });
        }
    }

    function update() {
        if (scrolling) return;
        scrolling = true;
        if (document.querySelectorAll("article:not(.article)").length) init();
        setTimeout(() => { scrolling = false; }, 1000);
    }

    function CSS() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function locationChange() {
        window.addEventListener('locationchange', init);
        // situation 1
        history.pushState = (f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);
        // situation 2
        history.replaceState = (f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replaceState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);
        // situation 3
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    }

})();
