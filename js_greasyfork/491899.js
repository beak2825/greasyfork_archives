// ==UserScript==
// @name         PTT網頁版樓層擴充
// @namespace    https://www.ptt.cc/
// @version      1.8.1
// @description  PTT網頁版的樓層擴充套件
// @author       Anisile
// @match        https://www.ptt.cc/bbs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ptt.cc
// @license      GPL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/491899/PTT%E7%B6%B2%E9%A0%81%E7%89%88%E6%A8%93%E5%B1%A4%E6%93%B4%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/491899/PTT%E7%B6%B2%E9%A0%81%E7%89%88%E6%A8%93%E5%B1%A4%E6%93%B4%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const items = document.querySelectorAll(".push");
    const authorHighlight = AuthorHighlightInit ();
    const authorID = GetAuthorID ();
    const baseUrl = ExtractBaseUrl (location.href);

    const isInArticle = !location.href.split('/').pop().includes ("index");
    if (!isInArticle) return;

    // ========新增CSS========
    AddStyle (
        `.floor {
            float: right;
        }
        .hover {
            background-color: #222222;
        }
        .highlight {
            background-color: #333333;
        }
        .authorHighlight {
            background-color: blue;
        }
        .targetFloor {
            background-color: #444444 !important;
        }
        .push-userid a {
            color: #ff6;
        }
        .article-meta-value a {
            color: #999;
        }
        .float-menu {
            position: absolute;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 10px;
            background: black;
            text-align: center;
            border: solid 2px;
            border-radius: 8px;
            border-color: white;
            transform: translateX(-50%);
            z-index: 10000;
        }
        .float-menu button {
            background-color: Transparent;
            background-repeat:no-repeat;
            border: none;
            cursor:pointer;
            overflow: hidden;
            outline:none;
            color: white;
        }`
    )

    var i = 1;
    items.forEach((item) => {
        // ========顯示樓層========
        const child = document.createElement ("span");
        child.classList.add ("floor");
        child.innerHTML = `${i}樓`.padStart (6, " ");
        item.insertBefore (child, item.lastChild);
        item.setAttribute("id", `floor${i}`);
        i++;

        // ========同使用者留言上色========
        item.addEventListener("mouseover", function (e){
            OnMouseOverFloor (e);
        });
        item.addEventListener("mouseleave", function (e){
            OnMouseLeaveFloor (e);
        });
        item.addEventListener("click", function (e){
            OnMouseClickFloor (e);
        });

        // ========留言相關========
        const user = item.querySelector('.push-userid');
        // 有些版會在ID後方加上空格對齊版面，先移除空格
        const userID = user.textContent.replace(/\s+/g, '');
        user.textContext = userID;

        // ========原作者ID上色========
        if (authorHighlight) {
            if (userID === authorID) {
                user.classList.add ("authorHighlight");
            }
        }

        // ========查詢使用者在版面發過的文========
        CreateLink ({
            element: user,
            url: `${baseUrl}search?q=author%3A${userID}`,
            content: `${userID}`,
        });
    });

    // ========查詢作者在版面發過的文========
    CreateLink ({
        element: GetAuthorElement (),
        url: `${baseUrl}search?q=author%3A${authorID}`,
    });

    // ========搜尋樓層========
    var form = document.createElement ("form");
    var label = document.createElement ("label");
    var floor = document.createElement("input");
    floor.setAttribute("type", "text");
    floor.setAttribute("name", "floor");
    floor.setAttribute("autocomplete", "off");
    floor.setAttribute("placeholder", "輸入想跳轉的樓層");

    label.setAttribute("for", "floor");
    label.style.fontSize = "16px";
    label.innerHTML = "歡迎搭乘電梯：";

    form.append (label);
    form.append (floor);
    form.addEventListener('submit', function (e){
        GoToFloor (e);
    });
    document.getElementById ("navigation").appendChild (form);

    // ========直達頂樓========
    var goToTop = document.createElement ("a");
    goToTop.innerHTML = '直達頂樓';
    goToTop.style.cursor = "pointer";
    goToTop.onclick = function () {
        GoToTop ();
    };
    document.getElementById ("navigation").appendChild (goToTop);

    // ========選取搜尋========
    const floatMenu = document.createElement ("div");
    floatMenu.classList.add ("float-menu");
    const searchBtn = document.createElement ("button");
    searchBtn.textContent = "搜尋";
    searchBtn.onclick = function(){
        const selection = document.getSelection();
        window.open (`${baseUrl}search?q=${selection}`, "_blank").focus ();
    };

    document.body.appendChild (floatMenu);
    floatMenu.appendChild (searchBtn);
    document.onselectionchange = () => {
        let selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString () != "") {
            let getRange = selection.getRangeAt(0),
                selectionRect = getRange.getBoundingClientRect();
            floatMenu.style.display = "flex";
            floatMenu.style.top = document.body.scrollTop + document.documentElement.scrollTop + selectionRect.top - 42 + 'px';
            floatMenu.style.left = (selectionRect.left + (selectionRect.width * 0.5)) + 'px'
        }
        else {
            floatMenu.style.display = "none";
        }
    };

    // ========功能區========
    function AddStyle (css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild (style);
    }

    function GoToFloor (e) {
        e.preventDefault();

        var submit = floor.value;
        if (isNaN (submit)) {
            window.alert("請填入數字");
            return false;
        }
        console.log (`跳轉到${submit}樓`);
        try {
            var result = document.getElementById(`floor${submit}`);
            result.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            result.classList.add ("targetFloor");
            setTimeout(() => {
                result.classList.remove ("targetFloor");
            }, 3000);
        }
        catch (err) {
            console.log (err);
        }
        return false;
    }

    function OnMouseOverFloor (e) {
        const user = e.currentTarget.querySelector('.push-userid').innerHTML;
        items.forEach((item) => {
            if (user === item.querySelector('.push-userid').innerHTML) {
                item.classList.add ("hover");
            }
            else {
                item.classList.remove ("hover");
            }
        });
    }

    function OnMouseLeaveFloor (e) {
        items.forEach((item) => {
            item.classList.remove ("hover");
        });
    }

    function OnMouseClickFloor (e) {
        const hasHighlight = e.currentTarget.classList.contains ("highlight");
        const user = e.currentTarget.querySelector('.push-userid').innerHTML;
        if (hasHighlight) {
            items.forEach((item) => {
                if (item.classList.contains ("highlight")) {
                    item.classList.remove ("highlight");
                }
            });
        }
        else {
            items.forEach((item) => {
                if (user === item.querySelector('.push-userid').innerHTML) {
                    item.classList.add ("highlight");
                }
                else {
                    item.classList.remove ("highlight");
                }
            });
        }
    }

    function GoToTop () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    function AuthorHighlightInit () {
        let menuId;

        function open() {
            GM_unregisterMenuCommand (menuId);
            localStorage.setItem ("authorHighlight", "true");
            location.reload ();
        }
        function close() {
            GM_unregisterMenuCommand (menuId);
            localStorage.setItem ("authorHighlight", "false");
            location.reload ();
        }

        let authorHighlight = localStorage.getItem ("authorHighlight");
        if (!authorHighlight || authorHighlight === "false") {
            menuId = GM_registerMenuCommand ("開啟作者ID上色", open);
        }
        else if (authorHighlight === "true") {
            menuId = GM_registerMenuCommand ("關閉作者ID上色", close);
        }
        return authorHighlight === "true";
    }

    function GetAuthorElement () {
        let element = null;
        const collection = document.getElementsByClassName ("article-metaline");
        Array.from (collection).forEach ((item) => {
            if (item.querySelector ('.article-meta-tag').innerHTML === "作者") {
                element = item.querySelector ('.article-meta-value');
            }
        });
        return element;
    }

    function GetAuthorID () {
        let ID = "";
        let authorElement = GetAuthorElement ();
        if (authorElement != null) {
            ID = authorElement.innerHTML.substring (0, authorElement.innerHTML.indexOf(' '));;
        }
        return ID;
    }

    function ExtractBaseUrl (url) {
        const parsedUrl = new URL(url);
        const pathParts = parsedUrl.pathname.split ('/');
        return `${parsedUrl.origin}/bbs/${pathParts[2]}/`;
    }

    function CreateLink (linkParameter) {
        if (!linkParameter.element || !(linkParameter.element instanceof HTMLElement)) return;

        const elementText = linkParameter.element.innerHTML;

        if (!linkParameter.content || !elementText.includes(linkParameter.content)) {
            const aTag = document.createElement('a');
            aTag.href = linkParameter.url;
            aTag.target = '_blank';
            aTag.textContent = elementText;
            linkParameter.element.innerHTML = '';
            linkParameter.element.appendChild(aTag);
        } else {
            const updatedText = elementText.replace(
                new RegExp(linkParameter.content, 'g'),
                `<a href="${linkParameter.url}" target="_blank">${linkParameter.content}</a>`
            );
            linkParameter.element.innerHTML = updatedText;
        }
    }
})();