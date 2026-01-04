// ==UserScript==
// @name         X to Twitter
// @name:ja  X to Twitter
// @description  Get our Twitter back from Elon.
// @namespace    https://xtotwitter.yakisova.com
// @version      3.1.1
// @author       yakisova41
// @match        https://twitter.com/*
// @match        https://x.com/home
// @match        https://x.com/explore
// @match        https://x.com/notifications
// @match        https://x.com/messages
// @match        https://x.com/search
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @description:ja  イーロンから私達のTwitterを取り戻します
// @downloadURL https://update.greasyfork.org/scripts/471572/X%20to%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/471572/X%20to%20Twitter.meta.js
// ==/UserScript==

const DEBUG = false;

let isEnableAlert = false;
/**
 * Output log if debug mode is true.
 * @param logText
 */
function log(logText, isalert = true) {
    if (DEBUG) {
        console.log(logText);
        if (isEnableAlert && isalert) {
            alert(logText);
        }
    }
}
/**
 * Alert when log.
 */
function enableAlert() {
    isEnableAlert = true;
}

/**
 * Prevent observing dually for same element.
 */
class ObserverHooksControler {
    constructor() {
        // Record<selector, Replacer[]>
        Object.defineProperty(this, "hookHandlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    addHookHandler(hookHandler) {
        if (this.hookHandlers[hookHandler.selector] === undefined) {
            this.hookHandlers[hookHandler.selector] = [];
        }
        this.hookHandlers[hookHandler.selector].push(hookHandler);
    }
    startObserve(selector, options) {
        const elem = document.querySelector(selector);
        if (elem !== null) {
            const observer = new MutationObserver(() => {
                if (this.hookHandlers[selector] !== undefined) {
                    this.hookHandlers[selector].forEach((hookHandler, i) => {
                        hookHandler.callback(elem, () => {
                            this.hookHandlers[selector] = this.hookHandlers[selector].splice(i, 1);
                        });
                    });
                }
            });
            observer.observe(elem, options);
        }
    }
}

/**
 * Favicon change
 * @param head
 */
const faviconReplacer = {
    selector: "head",
    callback: (head) => {
        const faviconHref = "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=";
        const shortcutIcon = head.querySelector('[rel="shortcut icon"]');
        if (shortcutIcon !== null) {
            if (shortcutIcon.getAttribute("href") !== faviconHref) {
                log("favicon replace");
                shortcutIcon.href = faviconHref;
            }
        }
    },
};

const paths = {
    xLogoPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    loadingXLogoPath: "M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0",
    birdPath: "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z",
    verifiedPath: "M8.52 3.59c.8-1.1 2.04-1.84 3.48-1.84s2.68.74 3.49 1.84c1.34-.21 2.74.14 3.76 1.16s1.37 2.42 1.16 3.77c1.1.8 1.84 2.04 1.84 3.48s-.74 2.68-1.84 3.48c.21 1.34-.14 2.75-1.16 3.77s-2.42 1.37-3.76 1.16c-.8 1.1-2.05 1.84-3.49 1.84s-2.68-.74-3.48-1.84c-1.34.21-2.75-.14-3.77-1.16-1.01-1.02-1.37-2.42-1.16-3.77-1.09-.8-1.84-2.04-1.84-3.48s.75-2.68 1.84-3.48c-.21-1.35.14-2.75 1.16-3.77s2.43-1.37 3.77-1.16zm3.48.16c-.85 0-1.66.53-2.12 1.43l-.38.77-.82-.27c-.96-.32-1.91-.12-2.51.49-.6.6-.8 1.54-.49 2.51l.27.81-.77.39c-.9.46-1.43 1.27-1.43 2.12s.53 1.66 1.43 2.12l.77.39-.27.81c-.31.97-.11 1.91.49 2.51.6.61 1.55.81 2.51.49l.82-.27.38.77c.46.9 1.27 1.43 2.12 1.43s1.66-.53 2.12-1.43l.39-.77.82.27c.96.32 1.9.12 2.51-.49.6-.6.8-1.55.48-2.51l-.26-.81.76-.39c.91-.46 1.43-1.27 1.43-2.12s-.52-1.66-1.43-2.12l-.77-.39.27-.81c.32-.97.12-1.91-.48-2.51-.61-.61-1.55-.81-2.51-.49l-.82.27-.39-.77c-.46-.9-1.27-1.43-2.12-1.43zm4.74 5.68l-6.2 6.77-3.74-3.74 1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z",
    homePath: "M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z",
    homeActivePath: "M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z",
    oldHomePath: "M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z",
    oldHomeActivePath: "M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z",
    oshogatsuXlogoPath: "M18.436 1.92h3.403l-7.433 8.495 8.745 11.563h-6.849l-5.363-7.012-6.136 7.012H1.4l7.951-9.088L.96 1.92h7.02l4.848 6.41 5.608-6.41zm-1.194 18.021h1.886L6.958 3.851H4.933l12.308 16.09z",
};
const colors = {
    twitterColor: "rgb(29, 155, 240)",
    loadingBirdColor: "rgba(29,161,242,1.00)",
};

/**
 * Add style to head
 */
function styleInject(head, env) {
    const style = document.createElement("style");
    const verifiedSelector = `a[href="/i/verified-choose"] > div > div > svg > g > path`;
    const verifiedSelectorMobile = `a[href="/i/verified-choose"] > div > svg > g > path`;
    const xLogoSelector = [
        `path[d="${paths.oshogatsuXlogoPath}"]:not(${verifiedSelector}):not(${verifiedSelectorMobile})`,
        `path[d="${paths.xLogoPath}"]:not(${verifiedSelector}):not(${verifiedSelectorMobile})`,
    ].join(",");
    const xLogoDarkmodeSelector = `div[style="text-overflow: unset; color: rgb(239, 243, 244);"] > svg > g > path:not(${verifiedSelector}):not(${verifiedSelectorMobile})`;
    const homeSelector = 'a[data-testid="AppTabBar_Home_Link"] > div > div > svg > g > path';
    style.innerHTML = `
    .x-to-twitter {
        fill: inherit;
        color: ${colors.twitterColor};
    }

    ${xLogoSelector}, path[d="${paths.loadingXLogoPath}"] {
        d:path("${paths.birdPath}");
        fill: inherit;
        color: ${colors.twitterColor};
    }

    ${xLogoDarkmodeSelector} {
        color: rgb(239, 243, 244);
    }

    div[aria-label="Loading…"] > svg > g > path {
        d:path("${paths.birdPath}");
        fill: inherit;
        color: ${colors.loadingBirdColor};
    }

    ${verifiedSelector}, ${verifiedSelectorMobile} {
        d:path("${paths.verifiedPath}");
    }

    ${homeSelector}:not(path[d="${paths.homePath}"]) {
        d:path("${paths.oldHomeActivePath}");
    }

    ${homeSelector}:not(path[d="${paths.homeActivePath}"]) {
      d:path("${paths.oldHomePath}");
    }

    ${env === "extension" || env === "userscript_windows"
        ? `
    a[data-testid="SideNav_NewTweet_Button"], button[data-testid="tweetButtonInline"], button[data-testid="tweetButtonInline"], button[data-testid="tweetButton"] {
      background-color: var(--x-to-twitter-theme)!important;
    }

    a[data-testid="SideNav_NewTweet_Button"] div[dir="ltr"], a[data-testid="SideNav_NewTweet_Button"] > div[dir="ltr"] > svg,  button[data-testid="tweetButtonInline"] div[dir="ltr"], button[data-testid="tweetButtonInline"] div[dir="ltr"], button[data-testid="tweetButton"] div[dir="ltr"]  {
      color: rgb(255, 255, 255)!important;
    }
    `
        : ""}
    `;
    head.appendChild(style);
}

const titleReplacer = {
    selector: "head",
    callback: (head) => {
        const titleElem = head.querySelector("title");
        if (titleElem !== null) {
            if (titleElem.innerHTML === "X") {
                log("Title repalce", false);
                titleElem.innerHTML = "Twitter";
            }
            else {
                log("Title repalce", false);
                const split = titleElem.innerHTML.split("/");
                if (split[1] === " X") {
                    split[1] = " Twitter";
                    titleElem.innerHTML = split.join("/");
                }
            }
        }
    },
};

/**
 * !NOTE It's the code for userscript,
 * so you must write a same code to extension/main-world.js for chrome extension
 *
 *
 * Get theme rgb from react state.
 * @returns {Promise<string>} theme RGB
 */
function getThemeColor() {
    function foundLtr(ltr) {
        const propsKey = Object.keys(ltr).filter((key) => key.match(/^__reactProps/))[0];
        const props = ltr[propsKey];
        const store = props.children[1].props.children.props.children.props.children.props.value.store;
        const state = store.getState();
        switch (state.settings.local.themeColor) {
            case "purple500":
                return "rgb(120, 86, 255)";
            case "orange500":
                return "rgb(255, 122, 0)";
            case "magenta500":
                return "rgb(249, 24, 128)";
            case "green500":
                return "rgb(0, 186, 124)";
            case "yellow500":
                return "rgb(255, 212, 0)";
            case "blue500":
                return "rgb(29, 155, 240)";
            default:
                return "rgb(29, 155, 240)";
        }
    }
    return new Promise((resolve) => {
        const reactRoot = document.querySelector("#react-root");
        const ltrO = new MutationObserver(() => {
            const ltr = document.querySelector('#react-root > div > div > div[dir="ltr"]');
            if (ltr !== null) {
                const themeColorRGB = foundLtr(ltr);
                resolve(themeColorRGB);
                ltrO.disconnect();
            }
            else {
                throw new Error("Ltr is null");
            }
        });
        if (reactRoot !== null) {
            ltrO.observe(reactRoot, {
                subtree: true,
                childList: true,
            });
        }
    });
}
/**
 * Set theme rgb to css variable.
 * @param {*} themeColor
 * @param {*} head
 */
function setThemeColor(themeColor, head) {
    const style = document.createElement("style");
    style.innerHTML = `
    :root {
      --x-to-twitter-theme : ${themeColor};
    }
  `;
    head.appendChild(style);
}

/**
 * Replace PWA's manifest.
 * !! It's worked on extension environment only
 */
function replaceManifest(head) {
    const oldManifestEl = document.querySelector('link[rel="manifest"]');
    if (oldManifestEl !== null) {
        oldManifestEl.remove();
    }
    const manifestEl = document.createElement("link");
    manifestEl.setAttribute("rel", "manifest");
    manifestEl.setAttribute("crossorigin", "use-credentials");
    manifestEl.setAttribute("href", chrome.runtime.getURL("/twitterManifest.json"));
    head.prepend(manifestEl);
}

const forSafari = {
    selector: "body",
    callback: (body) => {
        const pathElems = body.querySelectorAll([
            `path[d="${paths.xLogoPath}"]:not(.x-to-twitter):not(a[href="/i/verified-choose"] > div > div > svg > g > path, a[href="/i/verified-choose"] > div > svg > g > path)`,
            `path[d="${paths.oshogatsuXlogoPath}"]:not(.x-to-twitter):not(a[href="/i/verified-choose"] > div > div > svg > g > path, a[href="/i/verified-choose"] > div > svg > g > path)`,
            `path[d="${paths.loadingXLogoPath}"]:not(.x-to-twitter)`,
        ].join(","));
        if (pathElems.length !== 0) {
            pathElems.forEach((path) => {
                log("For safari");
                path.setAttribute("d", paths.birdPath);
                path.classList.add("x-to-twitter");
            });
        }
        const verifiedElems = document.querySelectorAll(`a[href="/i/verified-choose"] > div > div > svg > g > path:not(.x-to-twitter-noncolor), a[href="/i/verified-choose"] > div > svg > g > path:not(.x-to-twitter-noncolor)`);
        if (verifiedElems.length !== 0) {
            verifiedElems.forEach((path) => {
                path.setAttribute("d", paths.verifiedPath);
                path.classList.add("x-to-twitter-noncolor");
            });
        }
        const homeicon = document.querySelector(`a[data-testid="AppTabBar_Home_Link"] > div > div > svg > g > path:not(.x-to-twitter-birdhome)`);
        if (homeicon !== null) {
            const d = homeicon.getAttribute("d");
            if (d === paths.homeActivePath) {
                homeicon.setAttribute("d", paths.oldHomeActivePath);
            }
            if (d === paths.homePath) {
                homeicon.setAttribute("d", paths.oldHomePath);
            }
            homeicon.classList.add("x-to-twitter-birdhome");
        }
        const loading = document.querySelector('div[aria-label="Loading…"] > svg > g > path');
        if (loading !== null) {
            loading.setAttribute("d", paths.birdPath);
        }
    },
};

const i18n = {
    "ar-x-fm": {
        f70a36d0: "تغريد الكل",
        d25289b4: "مُعاد تغريدها بواسطة",
        bab1f8b0: "التغريدات",
        h99e9c95: 'return["قام "," بإعادة تغريدها"]',
        d2c7a41c: "غرّدي ردَكِ",
        e2414184: 'return"تغريد"+n(e.count,"ات","ة","ة","ة","تا","ة")+" اقتباس"',
        hb7b0cea: 'return e.retweetCount+" إعاد"+n(e.retweetCount,"ات","ة","ة","ة","تا","ة")+" تغريد"',
        bd7c039f: "تغريدات اقتباس",
        bea869b3: "غرّدي",
        hdf72269: "ردّ",
        e349147b: "ماذا يحدث؟",
        f3bbbb87: "التراجع عن التغريدة",
        c9d7235d: "اقتباس التغريدة",
        d6c85149: "إعادة التغريد",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") غرّد:\\n"+e.tweet',
        d6917e0c: 'return"عرض "+e.count+" تغريد"+n(e.count,"ات","ة","ة","ة","تين","ة")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    bg: {
        f70a36d0: "Туитване на всички",
        d25289b4: "Ретуитнат от",
        bab1f8b0: "Туитове",
        h99e9c95: 'return[""," ретуитна"]',
        d2c7a41c: "Отговори с туит",
        e2414184: 'return""+n(e.count,"Цитиране на туита","Туитове с цитат")',
        hb7b0cea: 'return e.retweetCount+" ретуит"+n(e.retweetCount,"","а")',
        bd7c039f: "Туитове с цитат",
        bea869b3: "Туит",
        hdf72269: "Отговор",
        e349147b: "Какво се случва?",
        f3bbbb87: "Отмяна на ретуитването",
        c9d7235d: "Цитиране на туита",
        d6c85149: "Ретуитване",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0c: 'return"Показване на "+e.count+" туит"+n(e.count,"","а")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    bn: {
        f70a36d0: "সব টুইট করুন",
        d25289b4: "পুনঃ টুইট করেছেন",
        bab1f8b0: "টুইটগুলি",
        h99e9c95: 'return[""," পুনঃ টুইট করেছেন"]',
        d2c7a41c: "আপনার উত্তর টুইট করুন",
        e2414184: 'return"টুইট উদ্ধৃত"+a(e.count," করুন","িগুলো")',
        hb7b0cea: 'return e.retweetCount+" পুনঃ"+a(e.retweetCount," টুইট করুন","টুইটগুলো")',
        bd7c039f: "টুইট উদ্ধৃতিগুলো",
        hdf72269: "উত্তর",
        e349147b: "কী ঘটছে?",
        f3bbbb87: "পুনঃ টুইট পুর্বাবস্থায় ফেরান",
        c9d7235d: "টুইট উদ্ধৃত করুন",
        d6c85149: "পুনঃটুইট",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") টুইট করেছেন: "+e.tweet',
        d6917e0c: 'return e.count+" টুইট"+a(e.count,"","গুলো")+" দেখান"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        bea869b3: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    ca: {
        f70a36d0: "Tuita-ho tot",
        d25289b4: "Retuitat per",
        bab1f8b0: "Tuits",
        h99e9c95: 'return[""," ha retuitat"]',
        d2c7a41c: "Tuita una resposta",
        e2414184: 'return""+r(e.count,"Cita el tuit","Tuits amb cita")',
        hb7b0cea: 'return e.retweetCount+" Retuit"+r(e.retweetCount,"","s")',
        bd7c039f: "Tuits amb cita",
        bea869b3: "Tuita",
        hdf72269: "Respon",
        e349147b: "Què passa?",
        f3bbbb87: "Desfés el retuit",
        c9d7235d: "Cita el tuit",
        d6c85149: "Retuit",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") ha tuitat: "+e.tweet',
        d6917e0c: 'return"Mostra "+e.count+" Tuit"+r(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    cs: {
        f70a36d0: "Tweetnout vše",
        d25289b4: "Retweetnuto uživateli",
        bab1f8b0: "Tweety",
        h99e9c95: 'return["Uživatel "," retweetnul"]',
        d2c7a41c: "Tweetnout odpověď",
        e2414184: 'return""+n(e.count,"Tweety s citací","Tweety s citací","Citovat Tweet","Tweety s citací")',
        hb7b0cea: 'return e.retweetCount+" Retweet"+n(e.retweetCount,"y","y","","ů")',
        bd7c039f: "Tweety s citací",
        bea869b3: "Tweet",
        hdf72269: "Odpovědět",
        e349147b: "Co se právě děje?",
        f3bbbb87: "Zrušit Retweet",
        c9d7235d: "Citovat Tweet",
        d6c85149: "Retweetnout",
        d91695cb: 'return"Uživatel "+e.fullName+" (@"+e.screenName+") tweetnul: "+e.tweet',
        d6917e0c: 'return"Ukázat "+e.count+" "+n(e.count,"tweety","tweety","Tweet","tweetů")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    da: {
        f70a36d0: "Tweet alt",
        d25289b4: "Retweetet af",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," retweetede"]',
        d2c7a41c: "Tweet dit svar",
        e2414184: 'return"Cit"+i(e.count,"ér Tweet","at-Tweets")',
        hb7b0cea: 'return e.retweetCount+" Retweet"+i(e.retweetCount,"","s")',
        bd7c039f: "Citat-Tweets",
        bea869b3: "Tweet",
        hdf72269: "Svar",
        e349147b: "Hvad sker der?",
        f3bbbb87: "Fortryd Retweet",
        c9d7235d: "Citér Tweet",
        d6c85149: "Retweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") tweetede: "+e.tweet',
        d6917e0c: 'return"Vis "+e.count+" Tweet"+i(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    de: {
        f70a36d0: "Alle twittern",
        d25289b4: "Retweetet von",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," hat retweetet"]',
        d2c7a41c: "Twittere deine Antwort",
        e2414184: 'return""+r(e.count,"Tweet zitieren","Zitierte Tweets")',
        hb7b0cea: 'return e.retweetCount+" Retweet"+r(e.retweetCount,"","s")',
        bd7c039f: "Zitierte Tweets",
        bea869b3: "Twittern",
        hdf72269: "Antworten",
        e349147b: "Was gibt's Neues?",
        f3bbbb87: "Retweet rückgängig machen",
        c9d7235d: "Tweet zitieren",
        d6c85149: "Retweeten",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0c: 'return e.count+" Tweet"+r(e.count,"","s")+" anzeigen"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    el: {
        f70a36d0: "Δημοσίευση όλων ως Tweet",
        d25289b4: "Έγινε Retweet από",
        bab1f8b0: "Tweet",
        h99e9c95: 'return["Ο χρήστης "," έκανε Retweet"]',
        d2c7a41c: "Κάντε Tweet με την απάντησή σας",
        e2414184: 'return""+n(e.count,"Παράθεση Tweet","Tweet με παράθεση")',
        hb7b0cea: 'return e.retweetCount+" Retweet"',
        bd7c039f: "Tweet με παράθεση",
        bea869b3: "Tweet",
        hdf72269: "Απάντηση",
        e349147b: "Τι συμβαίνει;",
        f3bbbb87: "Αναίρεση Retweet",
        c9d7235d: "Παράθεση Tweet",
        d6c85149: "Retweet",
        d91695cb: 'return"Ο χρήστης "+e.fullName+" (@"+e.screenName+") έγραψε το Tweet: "+e.tweet',
        d6917e0c: 'return"Εμφάνιση "+e.count+" Tweet"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    "en-GB": {
        f70a36d0: "Tweet all",
        d25289b4: "Retweeted by",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," Retweeted"]',
        d2c7a41c: "Tweet your reply",
        e2414184: 'return"Quote Tweet"+n(e.count,"","s")',
        hb7b0cea: 'return e.retweetCount+" Retweet"+n(e.retweetCount,"","s")',
        bd7c039f: "Quote Tweets",
        bea869b3: "Tweet",
        hdf72269: "Reply",
        e349147b: "What’s happening?",
        f3bbbb87: "Undo Retweet",
        c9d7235d: "Quote Tweet",
        d6c85149: "Retweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted: "+e.tweet',
        d6917e0c: 'return"Show "+e.count+" Tweet"+n(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    en: {
        f70a36d0: "Tweet all",
        d25289b4: "Retweeted by",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," Retweeted"]',
        d2c7a41c: "Tweet your reply",
        e2414185: 'return"Quote Tweet"+n(e.count,"","s")',
        hb7b0ceb: 'return e.retweetCount+" Retweet"+n(e.retweetCount,"","s")',
        bd7c0390: "Quote Tweets",
        bea869b4: "Tweet",
        d17df548: "Reply",
        e349147c: "What’s happening?",
        fa9ce7f4: "Undo Retweet",
        c9d7235e: "Quote Tweet",
        d6c8514a: "Retweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return"Show "+e.count+" Tweet"+n(e.count,"","s")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    es: {
        f70a36d0: "Twittear todo",
        d25289b4: "Retwitteado por",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," lo retwitteó"]',
        d2c7a41c: "Twittea tu respuesta",
        e2414184: 'return""+r(e.count,"Citar Tweet","Tweets citados")',
        hb7b0cea: 'return e.retweetCount+" Retweet"+r(e.retweetCount,"","s")',
        bd7c039f: "Tweets citados",
        bea869b3: "Twittear",
        hdf72269: "Responder",
        e349147b: "¿Qué está pasando?",
        f3bbbb87: "Deshacer Retweet",
        c9d7235d: "Citar Tweet",
        d6c85149: "Retwittear",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") twitteó: "+e.tweet',
        d6917e0c: 'return"Mostrar "+e.count+" Tweet"+r(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    fa: {
        f70a36d0: "توییت به همه",
        d25289b4: "بازتوییت‌ شد توسط",
        bab1f8b0: "توييت‌ها",
        h99e9c95: 'return[""," بازتوییت کرد"]',
        d2c7a41c: "پاسختان را توییت کنید",
        e2414184: 'return"نقل‌توییت"',
        hb7b0cea: 'return e.retweetCount+" بازتوییت"',
        bd7c039f: "نقل‌توییت‌ها",
        bea869b3: "توییت",
        hdf72269: "پاسخ",
        e349147b: "چه خبر است؟",
        f3bbbb87: "لغو بازتوییت",
        c9d7235d: "نقل‌توییت",
        d6c85149: "بازتوییت",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") توییت کرد: "+e.tweet',
        d6917e0c: 'return"نمایش "+e.count+" تو"+f(e.count,"یی","يي")+"ت"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    eu: {
        f70a36d0: "Txiotu guztiak",
        d25289b4: "Bertxiotua:",
        bab1f8b0: "Txioak",
        h99e9c95: 'return[""," erabiltzaileak bertxiotu du"]',
        d2c7a41c: "Txiokatu erantzuna",
        e2414184: 'return"Quote Tweet"+n(e.count,"","s")',
        hb7b0cea: 'return e.retweetCount+" bertxio"',
        bd7c039f: "Aipatu txioak",
        bea869b3: "Txio",
        hdf72269: "Erantzun",
        e349147b: "Zer ari da gertatzen?",
        f3bbbb87: "Desegin birtxiokatzea",
        c9d7235d: "Txioa apaitu",
        d6c85149: "Bertxiotu",
        d91695cb: 'return e.fullName+"(e)k (@"+e.screenName+") Txiokatu du: "+e.tweet',
        d6917e0c: 'return"Show "+e.count+" Tweet"+n(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    fi: {
        f70a36d0: "Twiittaa kaikki",
        d25289b4: "Uudelleentwiitannut",
        bab1f8b0: "Twiitit",
        h99e9c95: 'return[""," uudelleentwiittasi"]',
        d2c7a41c: "Twiittaa vastauksesi",
        bd7c039f: "Twiitin lainaukset",
        bea869b3: "Twiittaa",
        hdf72269: "Vastaa",
        e349147b: "Mitä tapahtuu?",
        f3bbbb87: "Kumoa uudelleentwiittaus",
        c9d7235d: "Twiitin lainaus",
        d6c85149: "Uudelleentwiittaa",
        e2414184: null,
        e2414185: null,
        hb7b0ceb: null,
        hb7b0cea: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d91695cb: null,
        d6917e0c: null,
        d6917e0d: null,
    },
    fr: {
        f70a36d0: "Tout tweeter",
        d25289b4: "Retweeté par",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," a retweeté"]',
        d2c7a41c: "Tweetez votre réponse.",
        e2414185: 'return""+s(e.count,"Citer le Tweet","Tweets cités")',
        hb7b0ceb: 'return e.retweetCount+" Retweet"+s(e.retweetCount,"","s")',
        bd7c0390: "Tweets cités",
        bea869b4: "Tweeter",
        d17df548: "Répondre",
        e349147c: "Quoi de neuf ?",
        fa9ce7f4: "Annuler le Retweet",
        c9d7235e: "Citer le Tweet",
        d6c8514a: "Retweeter",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") a tweeté : "+e.tweet',
        d6917e0d: 'return"Voir "+e.count+" Tweet"+s(e.count,"","s")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    ga: {
        f70a36d0: "Tweetáil gach rud",
        d25289b4: "Atweetáilte ag",
        bab1f8b0: "Tweetanna",
        h99e9c95: 'return["Rinne "," Atweetáil"]',
        d2c7a41c: "Tweetáil do Fhreagra",
        bd7c0390: "Luaigh Tvuíteanna",
        bea869b4: "Tweet",
        d17df548: "Freagair",
        e349147c: "Cad atá ag tarlú?",
        fa9ce7f4: "Cuir an Atweet ar ceal",
        c9d7235e: "Cuir Ráiteas Leis",
        d6c8514a: "Atweetáil",
        e2414184: null,
        e2414185: null,
        hb7b0ceb: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d91695cb: null,
        d6917e0c: null,
        d6917e0d: null,
    },
    gl: {
        f70a36d0: "Chiar todo",
        d25289b4: "Rechouchiado por",
        bab1f8b0: "Chíos",
        h99e9c95: 'return[""," rechouchiou"]',
        d2c7a41c: "Chía a túa resposta",
        e2414184: 'return"Quote Tweet"+r(e.count,"","s")',
        hb7b0cea: 'return e.retweetCount+" rechouchío"+t(e.retweetCount,"","s")',
        bd7c039f: "Chíos citados",
        bea869b3: "Chío",
        hdf72269: "Responder",
        e349147b: "Que está a pasar?",
        f3bbbb87: "Desfacer rechouchío",
        c9d7235d: "Citar chío",
        d6c85149: "Rechouchiar",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") chiou:\\n"+e.tweet',
        d6917e0c: 'return"Show "+e.count+" Tweet"+r(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    gu: {
        f70a36d0: "બધાને ટ્વીટ કરો",
        d25289b4: "આમની દ્વારા પુનટ્વીટ કરવામાં આવી",
        bab1f8b0: "ટ્વીટ્સ",
        h99e9c95: 'return["","એ પુનટ્વીટ કરી"]',
        d2c7a41c: "તમારા પ્રત્યુતરને ટ્વીટ કરો",
        e2414184: 'return"અવતરણની સાથે ટ્વીટ"+n(e.count," કરો","્સ")',
        hb7b0cea: 'return e.retweetCount+" પુનટ્વીટ"+n(e.retweetCount,"","્સ")',
        bd7c039f: "અવતરણની સાથે ટ્વીટ્સ",
        bea869b3: "ટ્વીટ",
        hdf72269: "પ્રત્યુતર",
        e349147b: "શું ચાલી રહ્યું છે?",
        f3bbbb87: "પુનટ્વીટને પૂર્વવત કરો",
        c9d7235d: "અવતરણની સાથે ટ્વીટ કરો",
        d6c85149: "પુનટ્વીટ",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") એ ટ્વીટ કરી: "+e.tweet',
        d6917e0c: 'return"બતાવો "+e.count+" ટ્વીટ"+n(e.count,"","્સ")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    he: {
        f70a36d0: "צייץ הכל",
        d25289b4: "צויץ מחדש על־ידי",
        bab1f8b0: "ציוצים",
        h99e9c95: 'return[""," צייץ מחדש"]',
        d2c7a41c: "צייץ את התשובה שלך",
        e2414184: 'return"צי"+c(e.count,"וץ ציטוט","טוט ציוץ","וץ ציטוט","וץ ציטוט")',
        hb7b0cea: 'return e.retweetCount+" ציו"+c(e.retweetCount,"צים","ץ","צים","צים")+" מחדש"',
        bd7c039f: "ציוצי ציטוט",
        bea869b3: "צייץ",
        hdf72269: "השב",
        e349147b: "מה קורה?",
        f3bbbb87: "ביטול ציוץ מחדש",
        c9d7235d: "ציטוט ציוץ",
        d6c85149: "צייץ מחדש",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") צייץ: "+e.tweet',
        d6917e0c: 'return"הצג "+e.count+" ציו"+c(e.count,"צים","ץ","צים","צים")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    hi: {
        f70a36d0: "सभी ट्वीट करें",
        d25289b4: "इनके द्वारा रीट्वीट किया गया",
        bab1f8b0: "ट्वीट",
        h99e9c95: 'return[""," ने रीट्वीट किया"]',
        d2c7a41c: "अपना जवाब ट्वीट करें",
        e2414185: 'return"कोट ट्वीट"+n(e.count,"","्स")',
        hb7b0ceb: 'return e.retweetCount+" रीट्वीट"+n(e.retweetCount,"","्स")',
        bd7c0390: "कोट ट्वीट्स",
        bea869b4: "ट्वीट करें",
        d17df548: "जवाब दें",
        e349147c: "क्या हो रहा है?",
        fa9ce7f4: "रीट्वीट को पूर्ववत करें",
        c9d7235e: "ट्वीट क्वोट करें",
        d6c8514a: "रीट्वीट करें",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") ने ट्वीट किया: "+e.tweet',
        d6917e0d: 'return e.count+" ट्वीट"+n(e.count,"","्स")+" दिखाएं"',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    hr: {
        f70a36d0: "Tweetaj sve",
        d25289b4: "Korisnici koji su proslijedili Tweet",
        bab1f8b0: "Tweetovi",
        h99e9c95: 'return[""," proslijedio/la je Tweet"]',
        d2c7a41c: "Pošalji Tweet s odgovorom",
        e2414185: 'return""+t(e.count,"citirana tweeta","Citiraj Tweet","citiranih tweetova")',
        hb7b0ceb: 'return e.retweetCount+" proslijeđen"+t(e.retweetCount,"a tweeta","i Tweet","ih tweetova")',
        bd7c0390: "Citirani tweetovi",
        bea869b4: "Tweet",
        d17df548: "Odgovori",
        e349147c: "Što se događa?",
        fa9ce7f4: "Poništi prosljeđivanje tweeta",
        c9d7235e: "Citiraj Tweet",
        d6c8514a: "Proslijedi tweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") objavio/la je Tweet: "+e.tweet',
        d6917e0d: 'return"Prikaži "+e.count+" "+t(e.count,"tweeta","Tweet","tweetova")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    hu: {
        f70a36d0: "Tweet küldése mindenkinek",
        d25289b4: "Retweetelte",
        bab1f8b0: "Tweetek",
        h99e9c95: 'return[""," Retweetelte"]',
        d2c7a41c: "Tweeteld válaszodat",
        e2414185: 'return"Tweet"+n(e.count," idézése","-idézés")',
        hb7b0ceb: 'return e.retweetCount+" Retweet"',
        bd7c0390: "Tweet-idézések",
        bea869b4: "Tweetelj",
        d17df548: "Válasz",
        e349147c: "Mi történik éppen most?",
        fa9ce7f4: "Retweet visszavonása",
        c9d7235e: "Tweet idézése",
        d6c8514a: "Retweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") tweetelte: "+e.tweet',
        d6917e0d: 'return e.count+" Tweet megjelenítése"',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    id: {
        f70a36d0: "Tweet semua",
        d25289b4: "Di-retweet oleh",
        bab1f8b0: "Tweet",
        h99e9c95: 'return[""," me-retweet"]',
        d2c7a41c: "Tweet balasan Anda",
        bd7c039f: "Tweet Kutipan",
        bea869b3: "Tweet",
        hdf72269: "Balas",
        e349147b: "Apa yang sedang terjadi?",
        f3bbbb87: "Batalkan Retweet",
        c9d7235d: "Kutip Tweet",
        d6c85149: "Retweet",
        e2414184: null,
        e2414185: null,
        hb7b0ceb: null,
        hb7b0cea: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d91695cb: null,
        d6917e0c: null,
        d6917e0d: null,
    },
    it: {
        f70a36d0: "Twitta tutto",
        d25289b4: "Ritwittato da",
        bab1f8b0: "Tweet",
        h99e9c95: 'return[""," ha ritwittato"]',
        d2c7a41c: "Twitta la tua risposta",
        e2414184: 'return"Tweet di citazione"',
        hb7b0cea: 'return e.retweetCount+" Retweet"',
        bd7c039f: "Tweet di citazione",
        bea869b3: "Twitta",
        hdf72269: "Rispondi",
        e349147b: "Che c'è di nuovo?",
        f3bbbb87: "Annulla Retweet",
        c9d7235d: "Cita Tweet",
        d6c85149: "Ritwitta",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") ha twittato: "+e.tweet',
        d6917e0c: 'return"Mostra "+e.count+" Tweet"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    ja: {
        f70a36d0: "すべてツイート",
        d25289b4: "リツイートしたユーザー",
        bab1f8b0: "ツイート",
        h99e9c95: 'return["","さんがリツイート"]',
        d2c7a41c: "返信をツイート",
        e2414184: 'return"件の引用ツイート"',
        hb7b0cea: 'return e.retweetCount+" 件のリツイート"',
        bd7c039f: "引用ツイート",
        bea869b3: "ツイートする",
        hdf72269: "返信",
        e349147b: "いまどうしてる？",
        f3bbbb87: "リツイートを取り消す",
        c9d7235d: "引用ツイート",
        d6c85149: "リツイート",
        d91695cb: 'return e.fullName+"（@"+e.screenName+"）さんがツイートしました: "+e.tweet',
        d6917e0c: 'return e.count+" 件のツイートを表示"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    kn: {
        f70a36d0: "ಎಲ್ಲಾ ಟ್ವೀಟ್ ಮಾಡಿ",
        d25289b4: "ಮರುಟ್ವೀಟಿಸಿದವರು",
        bab1f8b0: "ಟ್ವೀಟ್‌ಗಳು",
        h99e9c95: 'return[""," ಅವರು ಮರುಟ್ವೀಟಿಸಿದ್ದಾರೆ"]',
        d2c7a41c: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಟ್ವೀಟ್ ಮಾಡಿ",
        e2414185: 'return""+n(e.count,"ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ","ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು")',
        hb7b0ceb: 'return e.retweetCount+" ಮರುಟ್ವೀಟ"+n(e.retweetCount,"ಿಸಿ","್‌ಗಳು")',
        bd7c0390: "ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು",
        bea869b4: "ಟ್ವೀಟ್",
        d17df548: "ಪ್ರತಿಕ್ರಿಯಿಸಿ",
        e349147c: "ಏನಾಗುತ್ತಿದೆ?",
        fa9ce7f4: "ಮರುಟ್ವೀಟಿಸುವುದನ್ನು ರದ್ದುಮಾಡಿ",
        c9d7235e: "ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ",
        d6c8514a: "ಮರುಟ್ವೀಟಿಸಿ",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return"ತೋರಿಸಿ "+e.count+" ಟ್ವೀಟ್"+n(e.count,"","‌ಗಳು")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    ko: {
        f70a36d0: "모두 트윗하기",
        d25289b4: "리트윗함",
        bab1f8b0: "트윗",
        h99e9c95: 'return[""," 님이 리트윗함"]',
        d2c7a41c: "내 답글을 트윗합니다.",
        e2414184: 'return"인용한 트윗"',
        hb7b0cea: 'return e.retweetCount+" 리트윗"',
        bd7c039f: "트윗 인용하기",
        bea869b3: "트윗",
        hdf72269: "답글",
        e349147b: "무슨 일이 일어나고 있나요?",
        f3bbbb87: "리트윗 취소",
        c9d7235d: "트윗 인용하기",
        d6c85149: "리트윗",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0c: 'return"보기 "+e.count+" 트윗"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    mr: {
        f70a36d0: "सर्व ट्विट करा",
        d25289b4: "यांनी पुन्हा ट्विट केले",
        bab1f8b0: "ट्विट्स",
        h99e9c95: 'return[""," यांनी पुन्हा ट्विट केले"]',
        d2c7a41c: "आपल्या प्रत्युत्तरावर ट्विट करा",
        e2414184: 'return""+r(e.count,"ट्विट वर भाष्य करा","भाष्य ट्विट्स")',
        hb7b0cea: 'return e.retweetCount+" पुन"+r(e.retweetCount,"्हा ट्विट करा","र्ट्विट्स")',
        bd7c039f: "भाष्य ट्विट्स",
        bea869b3: "ट्विट",
        hdf72269: "प्रत्युत्तर",
        e349147b: "काय घडत आहे?",
        f3bbbb87: "पुनर्ट्विट पूर्ववत करा",
        c9d7235d: "ट्विट वर भाष्य करा",
        d6c85149: "पुन्हा ट्विट",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") यांनी ट्विट केले: "+e.tweet',
        d6917e0c: 'return e.count+" ट्विट"+r(e.count,"","्स")+" दाखवा"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    ms: {
        f70a36d0: "Tweet semua",
        d25289b4: "Ditweet semula oleh",
        bab1f8b0: "Tweet",
        h99e9c95: 'return[""," telah Tweet semula"]',
        d2c7a41c: "Tweet balasan anda",
        bd7c039f: "Tweet Petikan",
        bea869b3: "Tweet",
        hdf72269: "Balas",
        e349147b: "Apakah yang sedang berlaku?",
        f3bbbb87: "Buat asal Tweet semula",
        c9d7235d: "Petik Tweet",
        d6c85149: "Tweet semula",
        e2414184: null,
        e2414185: null,
        hb7b0ceb: null,
        hb7b0cea: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d91695cb: null,
        d6917e0c: null,
        d6917e0d: null,
    },
    nb: {
        f70a36d0: "Tweet alle",
        d25289b4: "Retweetet av",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," retweetet"]',
        d2c7a41c: "Tweet svaret ditt",
        e2414185: 'return"sitat-Tweet"+i(e.count,"","s")',
        hb7b0ceb: 'return e.retweetCount+" Retweet"+i(e.retweetCount,"","s")',
        bd7c0390: "Sitat-Tweets",
        bea869b4: "Tweet",
        d17df548: "Svar",
        e349147c: "Hva skjer?",
        fa9ce7f4: "Angre Retweet",
        c9d7235e: "Sitat-Tweet",
        d6c8514a: "Retweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweetet: "+e.tweet',
        d6917e0d: 'return"Vis "+e.count+" Tweet"+i(e.count,"","s")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    nl: {
        f70a36d0: "Alles tweeten",
        d25289b4: "Geretweet door",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," heeft geretweet"]',
        d2c7a41c: "Je antwoord tweeten",
        e2414185: 'return""+r(e.count,"Citeer Tweet","Geciteerde Tweets")',
        hb7b0ceb: 'return e.retweetCount+" Retweet"+r(e.retweetCount,"","s")',
        bd7c0390: "Geciteerde Tweets",
        bea869b4: "Tweeten",
        d17df548: "Beantwoorden",
        e349147c: "Wat houdt je bezig?",
        fa9ce7f4: "Retweet ongedaan maken",
        c9d7235e: "Citeer Tweet",
        d6c8514a: "Retweeten",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return e.count+" Tweet"+r(e.count,"","s")+" weergeven"',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    pl: {
        f70a36d0: "Tweetnij wszystko",
        d25289b4: "Podane dalej przez",
        bab1f8b0: "Tweety",
        h99e9c95: 'return[""," podał/a dalej Tweeta"]',
        d2c7a41c: "Wyślij Tweeta z odpowiedzią",
        e2414184: 'return"Cyt"+n(e.count,"aty z","atów z","uj","atów z")+" Tweeta"',
        hb7b0cea: 'return e.retweetCount+" Tweet"+n(e.retweetCount,"y podane","ów podanych"," podany","ów podanych")+" dalej"',
        bd7c039f: "Cytatów z Tweeta",
        bea869b3: "Tweet",
        hdf72269: "Odpowiedz",
        e349147b: "Co się dzieje?",
        f3bbbb87: "Cofnij podanie dalej",
        c9d7235d: "Cytuj Tweeta",
        d6c85149: "Podaj dalej",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Napisał/a: "+e.tweet',
        d6917e0c: 'return"Pokaż "+e.count+" Tweet"+n(e.count,"y","ów","a","ów")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    pt: {
        f70a36d0: "Tweetar tudo",
        d25289b4: "Retweetado por",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," retweetou"]',
        d2c7a41c: "Tweete sua resposta",
        e2414184: 'return"Tweet"+r(e.count,"","s")+" de comentário"',
        hb7b0cea: 'return e.retweetCount+" Retweet"+r(e.retweetCount,"","s")',
        bd7c039f: "Tweets com comentário",
        bea869b3: "Tweetar",
        hdf72269: "Responder",
        e349147b: "O que está acontecendo?",
        f3bbbb87: "Desfazer Retweet",
        c9d7235d: "Citar Tweet",
        d6c85149: "Retweetar",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") tweetou: "+e.tweet',
        d6917e0c: 'return"Mostrar "+e.count+" Tweet"+r(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    ro: {
        f70a36d0: "Dă Tweeturi cu tot",
        d25289b4: "Redistribuit de către",
        bab1f8b0: "Tweeturi",
        h99e9c95: 'return[""," a redistribuit"]',
        d2c7a41c: "Dă un Tweet cu răspunsul",
        e2414184: 'return""+r(e.count,"Tweeturi cu citat","Tweet cu citat","de Tweeturi cu citate")',
        hb7b0cea: 'return e.retweetCount+" "+r(e.retweetCount,"Retweeturi","Retweet","de Retweeturi")',
        bd7c039f: "Tweeturi cu citat",
        bea869b3: "Tweet",
        hdf72269: "Răspunde",
        e349147b: "Ce se întâmplă?",
        f3bbbb87: "Anulează Retweetul",
        c9d7235d: "Citează Tweetul",
        d6c85149: "Redistribuie",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") a dat Tweetul: "+e.tweet',
        d6917e0c: 'return"Afișează "+e.count+" "+r(e.count,"Tweeturi","Dă Tweet","Tweeturi")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    ru: {
        f70a36d0: "Твитнуть все",
        d25289b4: "Ретвитнул(а)",
        bab1f8b0: "Твиты",
        h99e9c95: 'return[""," ретвитнул(а)"]',
        d2c7a41c: "Твитнуть в ответ",
        e2414184: 'return""+n(e.count,"твита с цитатами","твитов с цитатами","Цитировать твит","Твиты с цитатами")',
        hb7b0cea: 'return e.retweetCount+" ретвит"+n(e.retweetCount,"а","ов","","а")',
        bd7c039f: "Твиты с цитатами",
        bea869b3: "Твитнуть",
        hdf72269: "Ответить",
        e349147b: "Что происходит?",
        f3bbbb87: "Отменить ретвит",
        c9d7235d: "Цитировать",
        d6c85149: "Ретвитнуть",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") твитнул(а): "+e.tweet',
        d6917e0c: 'return"Показать "+e.count+" твит"+n(e.count,"а","ов","","а")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    sr: {
        f70a36d0: "Твитуј све",
        d25289b4: "Ретвитовано од стране",
        bab1f8b0: "Твитови",
        h99e9c95: 'return[""," ретвитује"]',
        d2c7a41c: "Твитуј свој одговор",
        e2414185: 'return"твит"+n(e.count,"а","","(ов)а")+" са цитатом"',
        hb7b0ceb: 'return e.retweetCount+" ретвит"+n(e.retweetCount,"а","","ова")',
        bd7c0390: "твит(ов)а са цитатом",
        bea869b4: "Твитуј",
        d17df548: "Одговори",
        e349147c: "Шта се дешава?",
        fa9ce7f4: "Опозови ретвит",
        c9d7235e: "твит са цитатом",
        d6c8514a: "Ретвитуј",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return"Прикажи "+e.count+" твит"+n(e.count,"а","","ова")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    sk: {
        f70a36d0: "Tweetnuť všetko",
        d25289b4: "Retweetnuté používateľom",
        bab1f8b0: "Tweety",
        h99e9c95: 'return["Používateľ "," retweetol"]',
        d2c7a41c: "Tweetnuť odpoveď",
        e2414184: 'return"Tweet"+n(e.count,"y","u","","y")+" s citátom"',
        hb7b0cea: 'return e.retweetCount+" retweet"+n(e.retweetCount,"y","u","","ov")',
        bd7c039f: "Tweety s citátom",
        bea869b3: "Tweetnuť",
        hdf72269: "Odpovedať",
        e349147b: "Čo sa deje?",
        f3bbbb87: "Zrušiť retweet",
        c9d7235d: "Tweet s citátom",
        d6c85149: "Retweetnuť",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0c: 'return"Zobraziť "+e.count+" Tweet"+n(e.count,"y","u","","ov")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    sv: {
        f70a36d0: "Tweeta allt",
        d25289b4: "Retweetad av",
        bab1f8b0: "Tweets",
        h99e9c95: 'return[""," Retweetade"]',
        d2c7a41c: "Tweeta ditt svar",
        e2414184: 'return"citat-tweet"+r(e.count,"","s")',
        hb7b0cea: 'return e.retweetCount+" Retweet"+r(e.retweetCount,"","s")',
        bd7c039f: "Citat-tweets",
        bea869b3: "Tweeta",
        hdf72269: "Svara",
        e349147b: "Vad händer?",
        f3bbbb87: "Ångra retweeten",
        c9d7235d: "Citera Tweet",
        d6c85149: "Retweeta",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweetade: "+e.tweet',
        d6917e0c: 'return"Visa "+e.count+" Tweet"+r(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    ta: {
        f70a36d0: "அனைத்தையும் ட்விட் செய்",
        d25289b4: "இவரால் மறுட்விட் செய்யப்பட்டது",
        bab1f8b0: "கீச்சுகள்",
        h99e9c95: 'return[""," மறுட்வீட் செய்துள்ளார்"]',
        d2c7a41c: "உங்கள் பதிலை ட்விட் செய்யவும்",
        e2414185: 'return""+n(e.count,"ட்விட்டை மேற்கோள் காட்டு","மேற்கோள் கீச்சுகள்")',
        hb7b0ceb: 'return e.retweetCount+" மறுகீச்சு"+n(e.retweetCount,"","கள்")',
        bd7c0390: "மேற்கோள் கீச்சுகள்",
        bea869b4: "ட்விட் செய்",
        d17df548: "பதிலளி",
        e349147c: "என்ன நிகழ்கிறது?",
        fa9ce7f4: "மறுகீச்சை செயல்தவிர்",
        c9d7235e: "ட்விட்டை மேற்கோள் காட்டு",
        d6c8514a: "மறுட்விட் செய்",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return e.count+" கீச்சு"+n(e.count,"","கள்")+"-ஐக் காண்பி"',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    th: {
        f70a36d0: "ทวีตทั้งหมด",
        d25289b4: "ถูกรีทวีตโดย",
        bab1f8b0: "ทวีต",
        h99e9c95: 'return[""," รีทวีต"]',
        d2c7a41c: "ทวีตการตอบกลับของคุณ",
        e2414185: 'return"ทวีตและคำพูด"',
        hb7b0ceb: 'return e.retweetCount+" รีทวีต"',
        bd7c0390: "ทวีตและคำพูด",
        bea869b4: "ทวีต",
        d17df548: "ตอบกลับ",
        e349147c: "มีอะไรเกิดขึ้นบ้าง",
        fa9ce7f4: "ยกเลิกการรีทวีต",
        c9d7235e: "อ้างอิงทวีต",
        d6c8514a: "รีทวีต",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return"แสดง "+e.count+" ทวีต"',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    tr: {
        f70a36d0: "Hepsini Tweetle",
        d25289b4: "Retweetleyen(ler):",
        bab1f8b0: "Tweetler",
        h99e9c95: 'return[""," Retweetledi"]',
        d2c7a41c: "Yanıtını Tweetle",
        e2414184: 'return"Alıntı Tweet"+r(e.count,"","ler")',
        hb7b0cea: 'return e.retweetCount+" Retweet"',
        bd7c039f: "Alıntı Tweetler",
        bea869b3: "Tweetle",
        hdf72269: "Yanıtla",
        e349147b: "Neler oluyor?",
        f3bbbb87: "Retweeti Geri Al",
        c9d7235d: "Tweeti Alıntıla",
        d6c85149: "Retweet",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweetledi: "+e.tweet',
        d6917e0c: 'return"Göster "+e.count+" Tweet"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    uk: {
        f70a36d0: "Твітнути все",
        d25289b4: "Ретвіти",
        bab1f8b0: "Твіти",
        h99e9c95: 'return[""," ретвітнув(ла)"]',
        d2c7a41c: "Твітніть відповідь",
        e2414185: 'return"цитован"+n(e.count,"і твіти","их твітів","ий твіт","ого твіта")',
        hb7b0ceb: 'return e.retweetCount+" ретвіт"+n(e.retweetCount,"и","ів","","а")',
        bd7c0390: "Цитовані твіти",
        bea869b4: "Твіт",
        d17df548: "Відповісти",
        e349147c: "Що відбувається?",
        fa9ce7f4: "Скасувати ретвіт",
        c9d7235e: "Цитувати твіт",
        d6c8514a: "Ретвітнути",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") Tweeted:\\n"+e.tweet',
        d6917e0d: 'return"Показати "+e.count+" твіт"+n(e.count,"и","ів","","а")',
        e2414184: null,
        hb7b0cea: null,
        bd7c039f: null,
        bea869b3: null,
        hdf72269: null,
        e349147b: null,
        f3bbbb87: null,
        c9d7235d: null,
        d6c85149: null,
        d6917e0c: null,
    },
    ur: {
        f70a36d0: "سب کو ٹویٹ کریں",
        d25289b4: "ریٹویٹ منجانب",
        bab1f8b0: "ٹویٹس",
        h99e9c95: 'return[""," نے ریٹویٹ کیا"]',
        d2c7a41c: "اپنا جواب ٹویٹ کریں",
        e2414184: 'return"Quote Tweet"+o(e.count,"","s")',
        hb7b0cea: 'return e.retweetCount+" ریٹویٹ"',
        bd7c039f: "ٹویٹ کو نقل کرو",
        bea869b3: "ٹویٹ کریں",
        hdf72269: "جواب دیں",
        e349147b: "کیا ہو رہا ہے؟",
        f3bbbb87: "ریٹویٹ کالعدم کریں",
        c9d7235d: "ٹویٹ اقتباس کریں",
        d6c85149: "ریٹویٹ",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") نے ٹویٹ کی: "+e.tweet',
        d6917e0c: 'return"Show "+e.count+" Tweet"+o(e.count,"","s")',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    vi: {
        f70a36d0: "Đăng Tweet tất cả",
        d25289b4: "Được Tweet lại bởi",
        bab1f8b0: "Tweet",
        h99e9c95: 'return[""," đã Tweet lại"]',
        d2c7a41c: "Tweet trả lời của bạn",
        bd7c039f: "Tweet trích dẫn",
        hdf72269: "Trả lời",
        e349147b: "Chuyện gì đang xảy ra?",
        f3bbbb87: "Hoàn tác Tweet lại",
        c9d7235d: "Trích dẫn Tweet",
        d6c85149: "Tweet lại",
        e2414184: null,
        e2414185: null,
        hb7b0ceb: null,
        hb7b0cea: null,
        bd7c0390: null,
        bea869b4: null,
        bea869b3: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d91695cb: null,
        d6917e0c: null,
        d6917e0d: null,
    },
    "zh-Hant": {
        f70a36d0: "推全部內容",
        d25289b4: "已被轉推",
        bab1f8b0: "推文",
        h99e9c95: 'return[""," 已轉推"]',
        d2c7a41c: "推你的回覆",
        e2414184: 'return"引用的推文"',
        hb7b0cea: 'return e.retweetCount+" 則轉推"',
        bd7c039f: "引用的推文",
        bea869b3: "推文",
        hdf72269: "回覆",
        e349147b: "有什麼新鮮事？",
        f3bbbb87: "取消轉推",
        c9d7235d: "引用推文",
        d6c85149: "轉推",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") 已推文："+e.tweet',
        d6917e0c: 'return"顯示 "+e.count+" 則推文"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
    zh: {
        f70a36d0: "全部发推",
        d25289b4: "转推者",
        bab1f8b0: "推文",
        h99e9c95: 'return[""," 转推了"]',
        d2c7a41c: "发布你的回复",
        e2414184: 'return"引用推文"',
        hb7b0cea: 'return e.retweetCount+" 转推"',
        bd7c039f: "引用推文",
        bea869b3: "推文",
        hdf72269: "回复",
        e349147b: "有什么新鲜事？",
        f3bbbb87: "撤销转推",
        c9d7235d: "引用推文",
        d6c85149: "转推",
        d91695cb: 'return e.fullName+" (@"+e.screenName+") 发推说："+e.tweet',
        d6917e0c: 'return"显示 "+e.count+" 推文"',
        e2414185: null,
        hb7b0ceb: null,
        bd7c0390: null,
        bea869b4: null,
        d17df548: null,
        e349147c: null,
        fa9ce7f4: null,
        c9d7235e: null,
        d6c8514a: null,
        d6917e0d: null,
    },
};

function header(messages) {
    const header = document.querySelector(`h2[dir="ltr"]:not(#modal-header) > span`);
    const toTweet = messages.bea869b3 !== null ? messages.bea869b3 : messages.bea869b4;
    const quoteTweet = messages.c9d7235d !== null ? messages.c9d7235d : messages.bd7c0390;
    const splitPath = location.pathname.split("/");
    if (header !== null) {
        if (splitPath[2] === "status" && splitPath[4] !== "photo") {
            if (splitPath[4] === "retweets" && splitPath[5] === "with_comments") {
                if (header.textContent !== quoteTweet) {
                    header.textContent = quoteTweet;
                }
            }
            else {
                if (header.textContent !== toTweet) {
                    header.textContent = toTweet;
                }
            }
        }
    }
}

/**
 * プロフィールのタブのツイート
 */
function profileTweets(messages) {
    const tweets = messages.bab1f8b0;
    const profileTabPost = document.querySelector('div[role="tablist"] > div[role="presentation"]:nth-child(1) > a > div > div > span');
    const isProfilePage = document.querySelector('div[data-testid="UserProfileHeader_Items"]') !==
        null;
    if (profileTabPost !== null &&
        profileTabPost.textContent !== tweets &&
        isProfilePage) {
        setTimeout(() => {
            if (document.querySelector(`script[data-testid="UserProfileSchema-test"]`) !== null) {
                profileTabPost.textContent = tweets;
            }
        });
    }
}

function quoteCounter(messages) {
    const counterLinks = document.querySelectorAll("article > div > div > div:nth-child(3) > div:nth-child(5) > div > a");
    let splitRetweets = null;
    if (messages.e2414184 !== null) {
        splitRetweets = messages.e2414184.split('"');
    }
    else if (messages.e2414185 !== null) {
        splitRetweets = messages.e2414185.split('"');
    }
    if (splitRetweets === null) {
        throw log(new Error("Can't get retweet's language messages!"));
    }
    const quote = splitRetweets[1].trim() +
        (splitRetweets[5] !== undefined ? splitRetweets[5] : "");
    counterLinks.forEach((counterLink) => {
        const hrefSplit = counterLink.href.split("/");
        if (hrefSplit[4] === "retweets" && hrefSplit[5] === "with_comments") {
            const counter = counterLink.querySelector("a > span > span");
            if (counter !== null) {
                if (counter.textContent !== quote) {
                    counter.textContent = quote;
                }
            }
        }
    });
}

/**
 * 返信をツイート
 */
function replyDraftEditorPlaceholder(messages) {
    const whatsHappen = messages.e349147c !== null ? messages.e349147c : messages.e349147b;
    const placeholder = document.querySelector(`.public-DraftEditorPlaceholder-inner`);
    // mobile
    const placeholderTextArea = document.querySelector(`textarea[data-testid="tweetTextarea_0"]`);
    if (placeholder !== null) {
        if (location.pathname !== "/home" &&
            location.pathname !== "/compose/tweet") {
            if (placeholder.textContent !== messages.d2c7a41c) {
                placeholder.textContent = messages.d2c7a41c;
            }
        }
        else {
            if (placeholder.textContent !== whatsHappen) {
                placeholder.textContent = whatsHappen;
            }
        }
    }
    if (placeholderTextArea !== null) {
        if (location.pathname !== "/home" &&
            location.pathname !== "/compose/tweet") {
            if (placeholderTextArea.getAttribute("placeholder") !== messages.d2c7a41c) {
                placeholderTextArea.placeholder =
                    whatsHappen === null ? "" : whatsHappen;
            }
        }
    }
}

/**
 * Retweet button, Quote button.
 */
function retweetBtn(messages) {
    const retweetBtns = document.querySelectorAll('div[data-testid="retweetConfirm"] > div:nth-child(2) > div > span:not(.x-to-twitter-retweet)');
    const quoteBtns = document.querySelectorAll('a[href="/compose/tweet"] > div:nth-child(2) > div > span:not(.x-to-twitter-retweet)');
    const unRetweetBtns = document.querySelectorAll('div[data-testid="unretweetConfirm"] > div:nth-child(2) > div > span:not(.x-to-twitter-retweet)');
    const toRetweet = messages.d6c8514a !== null ? messages.d6c8514a : messages.d6c85149;
    const toQuote = messages.c9d7235d !== null ? messages.c9d7235d : messages.c9d7235e;
    const undoRetweet = messages.f3bbbb87 !== null ? messages.f3bbbb87 : messages.fa9ce7f4;
    retweetBtns.forEach((retweetBtn) => {
        retweetBtn.classList.add("x-to-twitter-retweet");
        retweetBtn.textContent = toRetweet;
    });
    quoteBtns.forEach((quoteBtn) => {
        quoteBtn.classList.add("x-to-twitter-retweet");
        quoteBtn.textContent = toQuote;
    });
    unRetweetBtns.forEach((unRetweetBtn) => {
        unRetweetBtn.classList.add("x-to-twitter-retweet");
        unRetweetBtn.textContent = undoRetweet;
    });
}

/**
 * Retweet counter
 */
function retweetCounter(messages) {
    const counterLinks = document.querySelectorAll("article > div > div > div:nth-child(3) > div:nth-child(5) > div > a");
    let splitRetweets = null;
    if (messages.hb7b0cea !== null) {
        splitRetweets = messages.hb7b0cea.split('"');
    }
    else if (messages.hb7b0ceb !== null) {
        splitRetweets = messages.hb7b0ceb.split('"');
    }
    if (splitRetweets === null) {
        throw log(new Error("Can't get retweet's language messages!"));
    }
    const retweet = splitRetweets[1].trim() +
        (splitRetweets[5] !== undefined ? splitRetweets[5] : "");
    counterLinks.forEach((counterLink) => {
        const hrefSplit = counterLink.href.split("/");
        if (hrefSplit[4] === "retweets" && hrefSplit[5] === undefined) {
            const counter = counterLink.querySelector("a > span > span");
            if (counter !== null) {
                if (counter.textContent !== retweet) {
                    counter.textContent = retweet;
                }
            }
        }
    });
}

/**
 * リポストしました
 */
function retweeted(messages) {
    const retweetedMessage = messages.h99e9c95;
    if (retweetedMessage === null) {
        throw log(new Error("Can't get Retweeted's i18n!"));
    }
    const retweeted = retweetedMessage.split('"')[3];
    const retweetedSpans = document.querySelectorAll(`article span[data-testid="socialContext"]:not(.x-to-twitter-retweeted)`);
    retweetedSpans.forEach((retweetedSpan) => {
        retweetedSpan.classList.add("x-to-twitter-retweeted");
        if (retweetedSpan.childNodes[2] !== undefined) {
            retweetedSpan.childNodes[2].textContent = retweeted;
        }
    });
}

function retweetedByPopup(messages) {
    const header = document.querySelector(`h2[dir="ltr"]#modal-header > span`);
    const splitPath = location.pathname.split("/");
    const retweetedBy = messages.d25289b4;
    if (header !== null &&
        splitPath[4] === "retweets" &&
        header.textContent !== retweetedBy) {
        header.textContent = retweetedBy;
    }
}

/**
 * Tweet button in sidemenu.
 */
function sideNavNewTweetButton(messages) {
    const tweetButton = document.querySelector('a[data-testid="SideNav_NewTweet_Button"] > div > span > div > div > span > span');
    const toTweet = messages.bea869b3 !== null ? messages.bea869b3 : messages.bea869b4;
    if (tweetButton !== null) {
        if (tweetButton.textContent !== null) {
            if (tweetButton.textContent !== toTweet) {
                tweetButton.textContent = toTweet;
            }
        }
        else {
            tweetButton.textContent = toTweet;
        }
    }
}

/**
 * 上の「件のツイートを表示」
 */
function topCountTweets(messages) {
    const showEPostsElem = document.querySelector(`div[data-testid="cellInnerDiv"] > div > button[role="button"] > div > div > span`);
    const showEPostsMessages = messages.d6917e0c !== null ? messages.d6917e0c : messages.d6917e0d;
    if (showEPostsMessages === null) {
        throw log(new Error("showEPostsMessages not found"));
    }
    const splitShowEPosts = showEPostsMessages.split('"');
    if (showEPostsElem !== null) {
        const parent = showEPostsElem.parentElement.parentElement.parentElement
            .parentElement.parentElement;
        if (parent === undefined || parent === null) {
            throw log(new Error("parent not found"));
        }
        const key = Object.keys(parent).filter((key) => {
            return key.match(/^__reactProps\$/);
        })[0];
        const count = parent[key].children._owner.memoizedProps.item.data.content.count;
        const showEPosts = count +
            " " +
            splitShowEPosts[1].trim() +
            (splitShowEPosts[5] !== undefined ? splitShowEPosts[5] : "");
        if (showEPostsElem.textContent !== showEPosts) {
            showEPostsElem.textContent = showEPosts;
        }
    }
}

/**
 * Tweet button
 * @param messages
 */
function tweetButton(messages) {
    const tweetButton = document.querySelector('button[data-testid="tweetButton"] > div > span > span');
    const tweetAll = messages.f70a36d0;
    const toTweet = messages.bea869b3 !== null ? messages.bea869b3 : messages.bea869b4;
    const reply = messages.hdf72269 !== null ? messages.hdf72269 : messages.d17df548;
    if (tweetButton !== null) {
        const pathSplited = location.pathname.split("/");
        if (pathSplited[2] === "status" && pathSplited[4] === "photo") {
            /**
             * If in photo page, tweetbutton will be replay button.
             */
            if (tweetButton.textContent !== reply) {
                tweetButton.textContent = reply;
            }
        }
        else {
            const isTweetAll = document.querySelector('label[data-testid="tweetTextarea_1_label"]') !==
                null;
            if (isTweetAll) {
                if (tweetButton.textContent !== tweetAll) {
                    tweetButton.textContent = tweetAll;
                }
            }
            else {
                if (tweetButton.textContent !== toTweet) {
                    tweetButton.textContent = toTweet;
                }
            }
        }
    }
}

/**
 * Small button to tweet.
 */
function tweetButtonInline(messages) {
    const tweetButton = document.querySelector('button[data-testid="tweetButtonInline"] > div > span > span');
    const toTweet = messages.bea869b3 !== null ? messages.bea869b3 : messages.bea869b4;
    const reply = messages.hdf72269 !== null ? messages.hdf72269 : messages.d17df548;
    if (tweetButton !== null) {
        if (location.pathname === "/home") {
            if (tweetButton.textContent !== toTweet) {
                tweetButton.textContent = toTweet;
            }
        }
        else {
            if (tweetButton.textContent !== reply) {
                tweetButton.textContent = reply;
            }
        }
    }
}

/**
 * 上から出てくるやつ
 * "さんがツイートしました"
 */
function tweetedPill(messages) {
    const tweetedMessage = messages.d91695cb;
    if (tweetedMessage === null) {
        throw log(new Error("Can't get tweeted's message"));
    }
    const tweeted = tweetedMessage
        .replaceAll("）", ")")
        .split(")")[1]
        .split(":")[0];
    const pill = document.querySelector(`div[data-testid="pillLabel"] > span > span > span`);
    if (pill !== null && pill.textContent !== tweeted) {
        pill.textContent = tweeted;
    }
}

const postToTweet = {
    selector: "body",
    callback: (_body) => {
        const language = getLang();
        const messages = i18n[language];
        sideNavNewTweetButton(messages);
        tweetButtonInline(messages);
        tweetButton(messages);
        replyDraftEditorPlaceholder(messages);
        retweetBtn(messages);
        retweetCounter(messages);
        header(messages);
        retweeted(messages);
        retweetedByPopup(messages);
        tweetedPill(messages);
        profileTweets(messages);
        quoteCounter(messages);
        topCountTweets(messages);
    },
};
/**
 * Get current language from cookie.
 * @returns
 */
function getLang() {
    const cookie = document.cookie;
    const cookieLang = cookie
        .split(";")
        .map((s) => s.split("="))
        .filter(([key, _value]) => {
        return key === " lang";
    })[0][1];
    if (Object.keys(i18n).includes(cookieLang)) {
        return cookieLang;
    }
    else if (cookieLang === "zh-cn") {
        return "zh";
    }
    else if (cookieLang === "zh-tw") {
        return "zh-Hant";
    }
    else if (cookieLang === "en-gb") {
        return "en-GB";
    }
    else {
        return "en";
    }
}

/**
 * Get running environment.
 * @returns
 */
function envChecker() {
    if (typeof GM_info !== "undefined") {
        log(GM_info);
        log(JSON.stringify(GM_info));
        if (GM_info.scriptHandler === "Userscripts") {
            return "userscript_ios";
        }
        if (typeof GM_info.userAgentData !== "undefined") {
            if (GM_info.userAgentData.platform === "Windows") {
                return "userscript_windows";
            }
        }
        return "userscript_not_windows";
    }
    else {
        return "extension";
    }
}
/**
 * Run a callback in no time when a head element is found.
 * @param {*} callback
 */
function headFinder(callback) {
    const observer = new MutationObserver((_mutations, obs) => {
        const head = document.querySelector("head");
        if (head) {
            callback(head);
            obs.disconnect();
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}
/**
 * headが見つかったときの処理
 */
function headFound(head, observerHooksControler, env) {
    log("Head found");
    observerHooksControler.startObserve("head", {
        childList: true,
    });
    observerHooksControler.startObserve("title", {
        childList: true,
    });
    observerHooksControler.startObserve("body", {
        subtree: true,
        childList: true,
    });
    // wait rendering
    setTimeout(() => {
        log("Post To Tweet");
        if (env !== "extension") {
            getThemeColor().then((colorRGB) => {
                setThemeColor(colorRGB, head);
            });
        }
        if (document.body !== null) {
            observerHooksControler.startObserve("body", {
                subtree: true,
                childList: true,
            });
        }
    }, 100);
    styleInject(head, env);
}
function main() {
    log("X to Twitter");
    const env = envChecker();
    log(`Env: ${env}`);
    const observerHooksControler = new ObserverHooksControler();
    observerHooksControler.addHookHandler(faviconReplacer);
    observerHooksControler.addHookHandler(titleReplacer);
    observerHooksControler.addHookHandler(forSafari);
    observerHooksControler.addHookHandler(postToTweet);
    if (env === "extension") {
        headFinder((head) => {
            log(head);
            headFound(head, observerHooksControler, env);
            replaceManifest(head);
        });
    }
    else if (env === "userscript_ios" || env === "userscript_not_windows") {
        enableAlert();
        log(document.head);
        headFound(document.head, observerHooksControler, env);
    }
    else if (env === "userscript_windows") {
        headFinder((head) => {
            log(head);
            headFound(head, observerHooksControler, env);
        });
    }
}
main();
