// ==UserScript==
// @name        熱門作品 - pixiv.net
// @namespace   Violentmonkey Scripts
// @match       http*://www.pixiv.net/*
// @grant       none
// @version     2.1
// @author      HYTeddy
// @license     MIT
// @run-at      document-start
// @description 2021/12/25 下午3:47:33
// @downloadURL https://update.greasyfork.org/scripts/481900/%E7%86%B1%E9%96%80%E4%BD%9C%E5%93%81%20-%20pixivnet.user.js
// @updateURL https://update.greasyfork.org/scripts/481900/%E7%86%B1%E9%96%80%E4%BD%9C%E5%93%81%20-%20pixivnet.meta.js
// ==/UserScript==

//https://github.com/teddy92729/teddy92729.github.io/blob/main/tool.js
let after = (ms, ...args) => {
    return new Promise((r) => {
        setTimeout(() => r(...args), ms);
    });
}
let afterFrame = (...args) => {
    return new Promise((r) => {
        requestAnimationFrame(() => r(...args));
    });
}
let afterIdle = (...args) => {
    return new Promise((r) => {
        requestIdleCallback(() => r(...args));
    });
}
//--------------------
let elementCreated = (selector, timeout = -1) => {
    return new Promise((resolve, reject) => {
        let element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        let observer = new MutationObserver((mutations) => {
            element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        if (timeout >= 0) after(timeout).then(reject);
    });
}
let elementRemoved = (element, timeout = -1) => {
    return new Promise((resolve, reject) => {
        if (!element || !(element instanceof HTMLElement)) {
            resolve();
            return;
        }
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (Array.from(mutation.removedNodes).includes(element))
                    resolve();
            });
        });
        observer.observe(element.parentNode, { childList: true });
        if (timeout >= 0) after(timeout).then(reject);

    });
}
let waitVideoLoaded = (videoElement, timeout = -1) => {
    return new Promise((resolve, reject) => {
        if (!(videoElement instanceof HTMLVideoElement)) return reject("invalid videoElement");
        if (videoElement.readyState > 0) return resolve(videoElement);
        videoElement.addEventListener("loadedmetadata", () => resolve(videoElement), { once: true });
        if (timeout >= 0) after(timeout).then(reject);
    });
}
//--------------------
(() => {
    const pushStateEvent = new Event("pushState");
    const pushStateFunc = window.history.pushState;
    window.history.pushState = (...args) => {
        console.info("pushState");
        window.dispatchEvent(pushStateEvent);
        return pushStateFunc.apply(window.history, args);
    }
})();
//--------------------
let addCss = (cssString) => {
    return new Promise((r) => {
        let css = document.createElement("style");
        css.innerText = cssString;
        document.head.appendChild(css);
        r(css);
    });
}
let addCssDisplayNone = (...selector) => {
    return addCss(`
        ${selector.join(", ")} {
            display: none !important;
        }
    `);
}
let addCssDisplayNoneAlt = (...selector) => {
    return addCss(`
        ${selector.join(", ")} {
            display: block !important;
            visibility: hidden !important;
            width: 0px !important;
            height: 0px !important;
            overflow: hidden !important;
        }
    `);
}

console.log("tool.js loaded");
//main
addCssDisplayNone(
    "section div > a[href^=\"/premium/lead/lp/\"]", // 阻擋premium超連結
    "section div:has(a[href^=\"/premium/lead/lp/\"]) > aside > iframe",
    "section div:has(a[href^=\"/premium/lead/lp/\"]) > aside > div", // 阻擋premium廣告文字
    "section div:has(a[href^=\"/premium/lead/lp/\"]) > aside > button" // 阻擋premium廣告按鈕
);
addCss(`
    section div:has(a[href^=\"/premium/lead/lp/\"]) > aside > ul {
        mask: unset;
        overflow-x: overlay;

        &::-webkit-scrollbar {
            height: 10px;
        }
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            margin-top: 20px;
        }
        &::-webkit-scrollbar-thumb {
            background: #888;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }
`);// 移除熱門作品的漸變遮罩，並加上滾動條

let main = (e) => {
    // 檢查網站位置
    if (/tags\/\S*/.test(window.location.pathname)) {
        let tags = window.location.pathname.split('/')[2];//取得tags
        console.log(tags);

        elementCreated("section div:has(a[href^=\"/premium/lead/lp/\"]) > aside:has(img)") // 等待熱門作品元素生成
            .then((aside) => {
                let ul = aside.querySelector("ul");
                let template_li = ul.children[0].cloneNode(true);//取得第一個熱門作品元素作為模板
                console.log("found ", ul);
                // 依模板生成新的熱門作品元素
                let createNewLi = (userId, artworksId, alt, title, src) => {
                    let clone_li = template_li.cloneNode(true);
                    let clone_a = clone_li.querySelector("a");
                    let clone_img = clone_li.querySelector("img");
                    clone_a.dataset.gtmUserId = userId;
                    clone_a.dataset.gtmValue = artworksId;
                    clone_a.href = "/artworks/" + artworksId;
                    clone_img.alt = alt;
                    clone_img.title = title;
                    clone_img.src = src;
                    return clone_li;
                }
                return fetch(`https://www.pixiv.net/ajax/search/artworks/${tags}`).then(res => res.json()).then((data) => {
                    // 取得熱門作品資料
                    let popular = data["body"]["popular"];
                    // 將recent和permanent合併
                    popular = [].concat(popular["recent"], popular["permanent"]);

                    ul.innerHTML = ""; // clear all li
                    for (let v of popular) {
                        let li = createNewLi(v.userId, v.id, v.alt, v.title, v.url);//生成熱門作品元素
                        ul.appendChild(li);
                    }
                });
            }).then(() => {
                console.log("成功執行");
            }).catch((e) => {
                console.error(e);
                afterIdle().then(main);//重新執行
            });
    }
}

window.addEventListener("pushState", () => afterIdle().then(main));//pixiv跳轉
afterIdle().then(main);