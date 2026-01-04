// ==UserScript==
// @name         Bluesky Clickable Hashtag
// @name:ja         Bluesky Clickable Hashtag
// @namespace    https://github.com/yakisova41
// @version      1.0.3
// @description  Make bluesky hashtags blue and clickable
// @description:ja  blueskyのハッシュタグを青文字にし、クリック可能にします
// @author       yakisova41
// @match        https://bsky.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/486861/Bluesky%20Clickable%20Hashtag.user.js
// @updateURL https://update.greasyfork.org/scripts/486861/Bluesky%20Clickable%20Hashtag.meta.js
// ==/UserScript==

getRouterElem().then(routerElem => {
    const navigation = routerElem[getPropsKey(routerElem)].children.props.children[0].props.children.props.children.props.children.props.value.navigation;

    const style = document.createElement("style");
    style.textContent = `
        .clickable-hashtag-link {
            background-color: rgba(0, 0, 0, 0);
            border: 0px solid black;
            box-sizing: border-box;
            color: rgb(0, 0, 0);
            display: inline;
            font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            list-style: none;
            margin: 0px;
            padding: 0px;
            position: relative;
            text-align: start;
            text-decoration: none;
            white-space: pre-wrap;
            overflow-wrap: break-word;
        }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(()=> {    
        const texts = document.querySelectorAll(`div[data-word-wrap="1"]:not(.clickable-hashtag)`);
        texts.forEach(textElem => {
            textElem.classList.add("clickable-hashtag");
            textElem.innerHTML = textElem.innerHTML.replace(/#(\S*)/g, '<a class="clickable-hashtag-nolistener clickable-hashtag-link" role="link" keyword="$1" style="font-size: 16px; letter-spacing: 0.25px; font-weight: 400; color: rgb(16, 131, 254);" href="/search?q=$1">#$1</a>')
            const nolistenerElements = textElem.querySelectorAll(".clickable-hashtag-nolistener");
            nolistenerElements.forEach(nolistenerElement => {
                nolistenerElement.addEventListener("click", (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    navigation.push("Search", {q: nolistenerElement.getAttribute("keyword")})
                });
                nolistenerElement.classList.remove("clickable-hashtag-nolistener");            
            })
        });
    });
    
    const root = document.querySelector("#root");
    observer.observe(root, {
        childList: true,
        subtree: true
    })
});
 
function getPropsKey(elem) {
    let result = null;
    Object.keys(elem).forEach(key => {
        if(key.match(/__reactProps\$.*/) !== null) {
            result = key;
        } 
    });
    return result;
}

function getRouterElem() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const routerElem = document.querySelector("#root > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)");
            if(routerElem !== null) {
                resolve(routerElem);
                clearInterval(interval);
            }
        }, 500);        
    });
}