// ==UserScript==
// @name         Image On Hover
// @namespace    https://wilchan.org
// @version      0.2
// @description  Umożliwia podgląd obrazka po najechaniu.
// @author       Anonimas
// @match        https://wilchan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510247/Image%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/510247/Image%20On%20Hover.meta.js
// ==/UserScript==

if (viewConfiguration.boardViewType === BoardViewType.ClassicBoard || viewConfiguration.boardViewType === BoardViewType.ClassicThread) {
    let iCss = document.createElement("style");
    iCss.innerHTML = `#hover-container > img{border-radius:4px;filter: drop-shadow(0 0 4px rgba(0,0,0,.5));display:none;pointer-events:none;position:fixed;z-index:300;}#hover-containter{z-index:300;}`;
    document.head.appendChild(iCss);

    document.querySelectorAll(".file[data-mime] > a").forEach(el => {
        el.addEventListener("mouseenter", imageHover);
    })

    let div = document.createElement("div");
    div.setAttribute("id", "hover-container");
    document.body.appendChild(div);

    let navH = document.querySelector("body > nav").offsetHeight;

    function imageHover(event) {
        let target = event.currentTarget,
            src = target.getAttribute("href"),
            mime = target.parentNode.getAttribute("data-mime"),
            image = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

        div.innerHTML = "";
        if (image.indexOf(mime) > -1) {
            let img = document.createElement("img");
            img.setAttribute("src", src);
            div.appendChild(img);
            target.addEventListener("mouseleave", () => {
                img.remove();
            });

            img.addEventListener("load", () => {
                let width, height, left, top, maxWidth, maxHeight, scale, rect, pos;
                rect = target.getBoundingClientRect();
                left = rect.left + rect.width + 10;
                maxWidth = window.document.body.scrollWidth - left - 10;
                maxHeight = window.innerHeight - (navH + 10 + 25);
                width = img.width;
                height = img.height;
                scale = Math.min(1, maxWidth / width, maxHeight / height);

                pos = (rect.top - (navH + 10))/(maxHeight - (rect.height));
                if (pos > 1) pos = 1;
                else if (pos < 0) pos = 0;
                top = navH + 10 + pos * (maxHeight - height * scale);

                img.style.left = left + "px";
                img.style.top = top + "px";
                img.style.maxHeight = maxHeight + "px";
                img.style.maxWidth = maxWidth + "px";
                img.style.display = "unset";
            });
        }
    }

    window.addEventListener("after-create-thread-article-element-event", function (event) {
        let section = event.detail.element;
        let file = section.querySelector(".file[data-mime] > a");
        if(file)
            file.addEventListener("mouseenter", imageHover);
    }, false);

    window.addEventListener("after-create-post-section-element-event", function (event) {
        let section = event.detail.element;
        let file = section.querySelector(".file[data-mime] > a");
        if(file)
            file.addEventListener("mouseenter", imageHover);
    }, false);
}