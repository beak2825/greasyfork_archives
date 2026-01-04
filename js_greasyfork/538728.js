// ==UserScript==
// @name         BetterFxP for Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @description  מעולם לא היה קל יותר לגלוש ב-FxP.
// @author       You
// @match        https://www.fxp.co.il/*
// @supportURL   https://discord.gg/AW7CeG7
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @icon         https://lh3.googleusercontent.com/j-CdJwaXX0eoqlMDLLYfbYTuuaFUM5Ep-Mph1UNktCZSYbm665WoIwGGw4d1iXxQWkLMDYior_xS8OKfWCBf1i4srw=s120
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @resource pms https://update.greasyfork.org/scripts/476628/1259426/fxp%20anti-delete%20PMs.user.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538728/BetterFxP%20for%20Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/538728/BetterFxP%20for%20Tampermonkey.meta.js
// ==/UserScript==
// @noframes

const checkbox = (label) => ({ label, default: false, type: 'checkbox' });
const text = (label, defaultValue = '', opt = {}) => ({ label, default: defaultValue, type: 'text', ...opt });
const cfg = new MonkeyConfig({
    title: 'הגדרות FxPlus+',
    menuCommand: true,
    params: {
        hideBigImages: checkbox("הסתר את הכתבות הגדולות מדך הבית"),
        hideGames: checkbox("הסתר את אזור המשחקים מדף הבית"),
        hideArticles: checkbox("הסתר כתבות מדף הבית"),
        resizeSignatures: checkbox("חותך חתימות גדולות"),
        hideAds: checkbox("הסתר מודעות"),
        hideNagish: checkbox("הסתר את תפריט הנגישות"),
        showFriends: checkbox("הצג חברים באשכולת"),
        showAutoPinned: checkbox("הצג יותר משלושה אשכולות נעוצים"),
        disableLiveTyping: checkbox("אל תודיע שאני מקליד"),
        showDeletedPost: checkbox("הצג פוסט שנמחק"),
        showLikeLimit: checkbox("הצג מגבלת לייקים"),
        connectedStaff: checkbox("הצג צוות מחובר"),
        allforums: checkbox('מציג את כל הפורומים בעיצוב החדש'),
        notitle: checkbox('אל תציג כותרות בעיצוב החדש'),
        noimages: checkbox('אל תציג תמונות בעיצוב החדש'),
        showCounts: checkbox('מציג את מספר הפוסטים ואת כמות המשתמשים המחוברים'),
        pms: checkbox("מציג הודעות פרטיות שנמחקו"),
        showForumStats: checkbox('הצג סטטיסטיקות פורומים'),
        weeklyChallenge: checkbox('מציג אתגרים שבועיים בתוך הפורום'),
        audioChange: text(":קישור לקובץ שמע עבור התראה"), // https://www.tzevaadom.co.il/static/sounds/calm.wav
        hideCategories: text(":רשימה של קטגוריות להסתרה"), // 4428, 13
        smiles: text(':רשימה של קישורים לסמיילים', '', { long: 3 }), // https://yoursmiles.org/tsmile/heart/t4524.gif
        nightMode: checkbox('הפעל את מצב הלילה אוטומטית'),
        startTime: text('Start Time:', '17:00'),
        endTime: text("End Time:", '23:50'),
        color: text("צבע"),
        font: text('פונט'),
        size: text('גודל'),
        // This is a temporary solution until I find a better library.
        // TODO: md5 the pass
        user1name: text("שם"),
        user1pass: text("סיסמה"),
        user2name: text("שם"),
        user2pass: text("סיסמה"),
    }
});

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        cfg.open("window", {
            windowFeatures: { width: 500 }
        });
    }
});

/*
CKEDITOR.tools.callFunction(41, this); //131,'almoni-dl'
The system that automatically disables and enables the feature is currently not working in either version.
TODO:
- Implement audio file upload
- disable/enable on the same page and prevent reload
- BBCode support
- Hide sticky posts
*/
const rawWindow = unsafeWindow;
const queryParams = new URLSearchParams(location.search);
const domParser = new DOMParser();

function waitForObject(path) {
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            const obj = path.split('.').reduce((o, key) => (o && key in o ? o[key] : undefined), rawWindow);
            if (typeof obj !== "undefined") {
                clearInterval(timer);
                resolve(obj);
            }
        }, 100);
    });
}

function setCookie(name, value, minutes) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(n) {
    return decodeURIComponent(document.cookie.split('; ').find(c => c.startsWith(n + '='))?.split('=')[1] || '');
}

function onMatchIfLoggedIn(match, permissions, callback) {
    rawWindow.LOGGEDIN && onMatch(match, permissions, callback);
}

function onMatch(match, permission, callback) {
    const hasPermission = permission === "none" || cfg.get(permission);
    if (!shouldRun(match) || !hasPermission) return;

    const docReady = /complete|interactive/.test(document.readyState);
    const runImmediately = !callback.toString().includes("document");

    let teardown = () => {};
    const executeFeature = () => {
        teardown();
        teardown = callback() || (() => {});
    };

    if (runImmediately || docReady) executeFeature();
    else document.addEventListener('DOMContentLoaded', executeFeature);

    GM_addValueChangeListener(permission, (key, oldVal, newVal) => {
        const func = newVal ? executeFeature : teardown;
        func();
    });
}

function injectStyle(match, permissions, css) {
    onMatch(match, permissions, function() {
        const styleElement = GM_addStyle(css);
        return () => styleElement?.remove();
    });
}

function shouldRun(matchPattern) {
    const urlPath = '/' + location.href.split('/').pop();
    const pattern = new RegExp(matchPattern.replace('*', '.*'));
    return pattern.test(urlPath);
}

async function fetcher(url, opt = {}) {
    const response = await fetch(url, opt);
    return await response.text();
}

function Listener(callback) {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this.method = method;
        this.url = url;
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.body = body;
        this.addEventListener("load", () => {
            callback(this);
        });
        originalSend.apply(this, arguments);
    };
}
// Author ID: 967488
injectStyle("forumdisplay", "showAutoPinned", "#stickies li.threadbit:nth-child(n+4) { display: list-item !important; } .morestick { display: none !important; }");
injectStyle("*", "hideAds", "#adfxp, #related_main, .trc_related_container, .trc_spotlight_widget, .videoyoudiv, .OUTBRAIN { display: none !important }");
injectStyle("*", "hideNagish", ".nagish-button { display: none; }");
injectStyle("/(?:index.php)?", "hideCategories", `${cfg.get("hideCategories").split(", ").map(cId => `.hp_category:has(a[href="forumdisplay.php?f=${cId}"])`).join(',')} { display: none }`) // #cat${cId}, .hi4 { height: 337px }
injectStyle("/(?:index.php)?", "hideArticles", "#slide { height:auto !important; } .mainsik { display: none; }");
injectStyle("/(?:index.php)?", "hideBigImages", "#slide { height:auto !important; } .big-image-class { display: none; }");
injectStyle("/(?:index.php)?", "hideGames", "#slide ~ div h1, .fxp2021_Games { display: none !important;");
// חותך חתימות גדולות לגודל המותר וזה תלוי במשתמש במקום באתר לשנות את החתימה שתתאים
injectStyle("show(post|thread)|member.php", "resizeSignatures", ".signaturecontainer { max-width: 500px; max-height: 295px; overflow: hidden; }");

onMatchIfLoggedIn("private_chat.php?do=showpm|show(post|thread)", "disableLiveTyping", function() {
    const originalSendTypingInThread = rawWindow?.sendUserIsTypingInShowthread;
    const originalTypingSend = rawWindow?.typeingsend;

    rawWindow.sendUserIsTypingInShowthread = () => {};
    rawWindow.typeingsend = () => {};

    return () => {
        rawWindow.sendUserIsTypingInShowthread = originalSendTypingInThread;
        rawWindow.typeingsend = originalTypingSend;
    }
});
onMatchIfLoggedIn("signature", "none", function() {
    const publishedThreadUrl = "https://www.fxp.co.il/showthread.php?t=16859147";

    GM_addStyle(`
        #creditAddon { padding: .5em; text-align: center; }
        .addCreditBtn { margin: .2em 1em; background: #fff; border-radius: .2em; font-weight: 700; color: #004b67; border: 1px solid #c5c5c5; cursor: pointer; padding: 0; position: relative; width: 60px; height: 60px; display: inline-flex; justify-content: center; align-items: center; overflow: hidden; }
        .addCreditBtn img { border: 0; height: 100%; }
        .addCreditBtn .addCreditDesc { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: #fff; background: rgba(0,0,0,.4); opacity: 1; }
        .addCreditBtn .addCreditDesc:hover { opacity: 0; }
        .addCreditBtn#addTextCredit .addCreditDesc:hover { opacity: 1; }
        .addCreditBtn#addXLimg { width: 110px; }
    `);

    const creditAddon = GM_addElement('div', {
        id: 'creditAddon',
    })
    creditAddon.innerHTML = `
    <div>שתף את הכיף!™ והוסף קרדיט לתוסף +FxPlus בחתימה שלך:</div>
    <div class="addCreditBtn" id="addLimg">
        <img src="https://i.imagesup.co/images2/b059514f80af8c5ec69afc73356a4dfa3b771343.png">
        <span class="addCreditDesc">128x128</span>
    </div>
    <div class="addCreditBtn" id="addMimg">
        <img src="https://i.imagesup.co/images2/7797f421f0e4895878e51d09266a35355b214d5a.png">
        <span class="addCreditDesc">48x48</span>
    </div>
    <div class="addCreditBtn" id="addTextCredit">
        <span class="addCreditDesc">טקסט</span>
    </div>`

    creditAddon.querySelectorAll('#addLimg, #addMimg, #addTextCredit').forEach(element => {
        element.addEventListener('click', (event) => {
            const imgElement = event.target.parentElement.querySelector('img');
            const iframeBody = document.querySelector(".cke_contents iframe").contentDocument.body;
            
            const creditLink = GM_addElement(iframeBody, 'a', {
                href: publishedThreadUrl, target: '_blank'
            });

            if (!imgElement) creditLink.textContent = '+FxPlus';
            else GM_addElement(creditLink, "img", { src: imgElement.src });
        });
    });
    const smilieBox = document.querySelector('form[action*="signature"] .editor_smiliebox');
    smilieBox.parentNode.insertBefore(creditAddon, smilieBox);
});

onMatchIfLoggedIn("show(post|thread)", "showFriends", async function() {
    const allFriendIds = await cachedFn("friendIds", 15, async () => {
        const ids = [];
        const regex = /<h4><a href="member\.php\?u=(\d+)"/g;
        let page = 1;

        while (true) {
            const url = `https://www.fxp.co.il/profile.php?do=buddylist&pp=100&page=${page}`;
            const html = await fetcher(url);

            const matches = Array.from(html.matchAll(regex)).map(m => m[1]);
            matches.forEach(id => ids.push(id));

            if (matches.length < 100) break;
            page++;
        }

        return ids;
    });
    const styleElement = GM_addStyle(`
        ${allFriendIds.map(id => '.username[href$="' + id + '"]::after').join(', ')} {
            content: "";
            display: inline-block;
            width: 20px;
            height: 20px;
            background-image: url('https://w7.pngwing.com/pngs/236/25/png-transparent-computer-icons-avatar-friends-love-text-logo-thumbnail.png');
            background-size: cover;
    }`)
    return () => styleElement.remove()
})
onMatchIfLoggedIn("*", "audioChange", function() {
    let isFeatureEnabled = true;
    Object.defineProperty(HTMLAudioElement.prototype, 'src', {
        set: function(value) {
            if (isFeatureEnabled && value === "https://images4.fxp.co.il/nodejs/sound.mp3") {
                value = cfg.get("audioChange");
            }
            this.setAttribute('src', value);
        },
        get: () => this.getAttribute('src'),
        configurable: true,
        enumerable: true,
    });
    return () => {
        isFeatureEnabled = false;
    }
})
onMatchIfLoggedIn("show(post|thread)", "smiles", async function() {
    const images = cfg.get("smiles").trim().split('\n');
    if (images.length < 1) return;

    const editor = await waitForObject("vB_Editor.vB_Editor_QR");
    let originalDescriptions = editor.config.smiley_descriptions,
        originalImages = editor.config.smiley_images;

    for (const image of images) {
        if (!image) continue;
        editor.config.smiley_descriptions.push(`[img]${image}[/img]`);
        editor.config.smiley_images.push(`https://wsrv.nl/?url=${image}&w=30`);
    }

    return () => {
        editor.config.smiley_descriptions = originalDescriptions;
        editor.config.smiley_images = originalImages;
    }
})
onMatchIfLoggedIn("show(post|thread)", "showLikeLimit", async function() {
    let toRemove = [];
    async function checkLike(postid) {
        const response = await fetcher("https://www.fxp.co.il/ajax.php", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: `do=wholikepost&postid=${postid}&securitytoken=${rawWindow.SECURITYTOKEN}`,
        });
        return response.includes(`>${rawWindow.my_user_name}<`);
    }
    Listener(async e => {
        if (e.method !== "POST" || e.url !== "ajax.php") {
            return;
        }
        const postId = e.body.match(/\d+/);
        if (!postId || await checkLike(postId)) return;
        
        const element = document.getElementById(`${postId}_removelike`);
        element.style.backgroundImage = 'url("https://em-content.zobj.net/source/google/387/broken-heart_1f494.png")';
        toRemove.push(element);
    });

    return () => {
        toRemove.forEach(el => el.style.backgroundImage = '');
        toRemove = [];
    }
})
// https://greasyfork.org/en/scripts/476628-fxp-anti-delete-pms
onMatchIfLoggedIn("do=showpm&pmid=", "pms", async function() {
    await waitForObject("socket");
    new Function(GM_getResourceText("pms")).apply(rawWindow);
})
onMatch("show(post|thread)", "showDeletedPost", function() {
    const targetPostId = queryParams.get('p');
    const isPostExist = document.contains(document.getElementById('post_' + targetPostId));
    if (!targetPostId || isPostExist) return;
    const elements = Array.from(document.querySelectorAll('.postbit'));
    const postIds = elements.map(el => parseInt(el.id.replace('post_', '')));
    const index = postIds.filter(pid => pid < targetPostId).length - 1;
    // if (index === 0) index = 1; //need to be test
    const newElement = GM_addElement("li", {
        textContent: 'התגובה שאתה מנסה לראות נמחקה.',
        id: 'post_' + targetPostId,
        class: 'postbit postbitim postcontainer', //test how this show (innerHTML)
        style: "background-color: #ffdddd; border: 1px solid #ff0000; padding: 10px 0; border-radius: 5px; color: #333; font-weight: bold; text-align: center;"
    })
    const targetElement = elements.at(index);
    targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);

    if (!queryParams.has('t')) {
        setTimeout(() => targetElement.scrollIntoView(), 500);
    }

    return () => newElement?.remove();
});
onMatch("forumdisplay", "connectedStaff", function() {
    const team = document.querySelector(".teammen.flo");
    team.dir = "auto"
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '10px');
    svg.setAttribute('height', '10px');
    svg.setAttribute('viewBox', '0 0 24 24');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', '#00FF00');
    path.setAttribute('d', 'm2 12a10 10 0 1 1 10 10 10 10 0 0 1 -10-10z');

    svg.appendChild(path);

    const usernameElements = document.querySelectorAll('.flo .username');

    usernameElements.forEach(async usernameElement => {
        const username = usernameElement.innerText;
        const userLink = usernameElement.href;

        const html = await fetcher(userLink);
        if (html.includes(username + ' מחובר/ת')) {
            usernameElement.insertAdjacentHTML('beforeend', svg.outerHTML);
        }
    });

    return () => {
        team.dir = "";
        usernameElements.forEach(({
            lastChild
        }) => lastChild.tagName === 'svg' && lastChild.remove());
    }
});
onMatch("*", "showCounts", function() {
    const scripts = document.querySelectorAll('script[type="text/javascript"]:not([src])');
    const script = Array.from(scripts).find(e => e.textContent.includes("counts"));
    if (!script) return;

    const lines = script.innerText.split("\n");
    const counts = {};
    for (const line of lines) {
        const match = line.match(/counts\["(.+?)"\]\s*=\s*(\d+);/);
        if (match) counts[match[1]] = parseInt(match[2]);
    }

    const container = GM_addElement("div", {
        style: `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: white;
            color: white;
            border: 1px solid #ccc;
            padding: 10px 15px;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            transition: opacity 1s`
    });
    container.innerHTML = `
        <strong>סטטיסטיקה:</strong><br>
        מחוברים: ${counts["#total_online"]?.toLocaleString() ?? 'N/A'}<br>
        פוסטים: ${counts["#total_posts"]?.toLocaleString() ?? 'N/A'}
    `;

    setTimeout(() => {
        container.style.opacity = "0";
        container.addEventListener("transitionend", container.remove);
    }, 5000);
});

//TODO: still needs improvement, but much better than before
onMatch("forumdisplay", "showForumStats", function() {
    function getDupeSortedDictionary(arr) {
        const counts = new Map();

        for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);

        const sortedArr = Array.from(counts, ([value, count]) => ({ value, count }));
        sortedArr.sort((a, b) => {
            return b.count === a.count ? 
                a.value.localeCompare(b.value) : b.count - a.count;
        });

        return sortedArr;
    }

    function openPopupWindow(title, content) {
        let dialog = document.getElementById("detailedStats");
        if (!dialog) {
            dialog = GM_addElement("dialog", {
                id: "detailedStats"
            })
            dialog.innerHTML = `${title}${content}`
            dialog.addEventListener("click", (e) => {
                if (e.target === dialog) dialog.close();
            });
        }

        dialog.showModal();
    }

    function removePopupWindow(id) {
        const dialog = document.getElementById(id);
        if (dialog && dialog.open) {
            dialog.close();
        }
    }

    const total = document.querySelectorAll('#threads .threadtitle').length;

    const container = document.createElement("div");
    container.id = "forumStatsContainer";
    const threadsList = document.querySelector(".threads_list_fxp");
    threadsList?.parentNode?.insertBefore(container, threadsList.nextSibling);

    const forumStats = GM_addElement(container, "div");
    GM_addElement(forumStats, "i", { textContent: `נתונים סטטיסטיים של ${total} אשכולות:` });
    const toArray = selector => Array.from(document.querySelectorAll(selector)).map(el => el.textContent);

    function appendLine(dict, introText, noText, suffix) {
        const line = GM_addElement(forumStats, "div");
        if (dict.length > 1 && dict[0].count > 1) {
            line.append(introText);
            for (let i = 0; i < dict.length && dict[i].count === dict[0].count; i++) {
                if (i > 0) line.append(" או ");
                GM_addElement(line, "b", { textContent: dict[i].value });
            }
            line.append(" עם " + dict[0].count + suffix);
        } else {
            line.append(noText);
        }
    }

    const publishersDict = getDupeSortedDictionary(toArray("#threads .threadinfo .username"));
    const commentorsDict = getDupeSortedDictionary(toArray("#threads .threadlastpost .username"));
    const prefixesDict = getDupeSortedDictionary(toArray("#threads .prefix").map(prefix => prefix.replace(/\||סקר: /g, '')));

    appendLine(
        publishersDict,
        "המפרסם הדומיננטי ביותר הוא ",
        "אין מפרסם דומיננטי במיוחד.",
        " אשכולות."
    );
    appendLine(
        commentorsDict,
        "המגיב האחרון הדומיננטי ביותר הוא ",
        "אין מגיב אחרון דומיננטי במיוחד.",
        " תגובות אחרונות."
    );
    appendLine( //TODO:  שנמצא ב-" + prefixesDict[0].count + " אשכולות.
        prefixesDict,
        "התיוג הנפוץ ביותר הוא ",
        "אין תיוג נפוץ במיוחד.",
        " אשכולות."
    );

    const parseNumber = text => parseInt(text.replace(/[^\d]/g, ""), 10) || 0;

    let commentsCount = 0;
    let viewsCount = 0;

    document.querySelectorAll("#threads .threadstats").forEach(el => {
        const [comments, views] = el.querySelectorAll("li");
        commentsCount += parseNumber(comments.textContent);
        viewsCount += parseNumber(views.textContent);
    });

    let viewsCommentsRatio = commentsCount > 0 ? Math.max(1, Math.round(viewsCount / commentsCount)) : "∞";

    const ratioLine = document.createElement("div");
    const b = document.createElement("b");
    b.textContent = viewsCommentsRatio + " צפיות";
    ratioLine.append("יחס הצפיות לתגובה הוא תגובה כל ", b, ".");
    forumStats.appendChild(ratioLine);

    const detailedStatsBtn = GM_addElement(forumStats, "div", { textContent: "+" });
    detailedStatsBtn.addEventListener("click", () => {
        const pContent = document.createElement("div");

        const flexTableContainer = GM_addElement(pContent, "div", {
            style: "display: flex; flexWrap: wrap;"
        });

        function helper(headerA, headerB, arr) {
            const table = GM_addElement(flexTableContainer, "table");
            const headerRow = GM_addElement(table, "tr")
            
            GM_addElement(headerRow, "th", { textContent: headerA });
            GM_addElement(headerRow, "th", { textContent: headerB });

            arr.forEach(item => {
                const tr = GM_addElement(table, "tr");
                GM_addElement(tr, "td", { textContent: item.value });
                GM_addElement(tr, "td", { textContent: item.count });
            });
        }

        helper("מפרסם", "אשכולות", publishersDict);
        helper("מגיב", "תגובות אחרונות", commentorsDict);
        helper("תיוג", "אשכולות", prefixesDict);

        const closeBtn = GM_addElement(pContent, "div", { textContent: "סגור" });
        closeBtn.addEventListener("click", () => removePopupWindow("detailedStats"));

        const forumTitle = document.querySelector('.lastnavbit > span').textContent;
        openPopupWindow(
            "סטטיסטיקות מפורטות לפורום " + forumTitle,
            pContent.outerHTML
        );
    });

    return () => {
        document.querySelectorAll("#forumStatsContainer, dialog").forEach(e => e.remove());
    };
});

onMatch("*", "nightMode", function () {
    const toggleDarkMode = (isEnabled) => setCookie("bb_darkmode",  isEnabled ? "1" : "0", 1440);

    function timeInMinutes(timeString) {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    const darkModeThemeEl = document.querySelector("#darkmode_theme");

    function exec() {
        const now = new Date();
        const minutesCurrent = now.getHours() * 60 + now.getMinutes();

        const minutesStart = timeInMinutes(cfg.get("startTime"));
        const minutesEnd = timeInMinutes(cfg.get("endTime"));

        const rangeActive = minutesEnd < minutesStart
            ? (minutesCurrent >= minutesStart || minutesCurrent < minutesEnd)
            : (minutesCurrent >= minutesStart && minutesCurrent < minutesEnd);

        const nightModeActive = getCookie("bb_darkmode") == "1"

        if (nightModeActive && !rangeActive) {
            darkModeThemeEl?.classList?.remove('ofset');
            document.body.classList.remove('darkmode');
            document.querySelector('[href*="darkmode"]')?.remove();
            toggleDarkMode(false);
        } else if (!nightModeActive && rangeActive) {
            darkModeThemeEl?.classList?.add('ofset');
            document.body.classList.add('darkmode');
            if (!document.querySelector('[href*="darkmode"]')) {
                GM_addElement("link", {
                    rel: 'stylesheet',
                    href: '//static.fcdn.co.il/dyn/projects/css/desktop/darkmode.css'
                });
            }
            toggleDarkMode(true);
        }
    };

    exec();
    const interval = setInterval(exec, 20 * 1000);

    return () => clearInterval(interval);
});
onMatch("forumdisplay", "weeklyChallenge", async function() {
    const getTodayDMY = () => new Date().toLocaleDateString('en-GB').split('/').join('-');

    function parseDMY(dateStr) {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function checkDateDifference(dateStr1, dateStr2) {
        const date1 = parseDMY(dateStr1);
        const date2 = parseDMY(dateStr2);
        return Math.abs(date2 - date1) / 604800000; // 604800000 = week
    }

    /*
    TODO:
    - Handle multiple thread links properly current implementation only processes the first link and does not cover all cases.
    - Replace textContent below with real URL
    */
    const CACHE_KEY = "weeklyChallengeCache" + rawWindow.FORUM_ID_FXP;

    const { thread, member } = await cachedFn(CACHE_KEY, 20, async () => {
        const stickies = Array.from(document.querySelectorAll('.stickies .threadinfo'))
            .filter(node => /אשכול השבוע|משקיען השבוע|7 ימי ווינר|משקיען ואשכול/.test(node.textContent))
            .map(node => node.parentElement);
        // maybe in the future, this will handle values greater than 1
        if (!stickies.length) return { thread: null, member: null };

        const element = stickies[0].querySelector('a.lastpostdate');
        const url = element.href?.replace(/#post.*/, '');
        console.log(url);
        if (!url) return { thread: null, member: null };

        const time = element.parentElement.textContent;
        const date = time.split(" ").shift().replace(/אתמול|היום/, getTodayDMY());
        if (checkDateDifference(getTodayDMY(), date) >= 2) return { thread: "לא עודכן", member: "לא עודכן" };

        const response = await fetcher(url + "&pp=1");
        const doc = domParser.parseFromString(response, "text/html");

        const threads = doc.querySelectorAll(".postcontent a[href*='showthread.php']");
        const members = doc.querySelectorAll(".postcontent a[href*='member.php']");

        return {
            thread: threads.length > 0 ? threads[0].textContent.trim().replace(/^"|"$/g, "") : "לא נמצא אשכול",
            member: members.length > 0 ? members[0].textContent.trim() : "לא נמצא משתמש"
        };
    });

    if (thread === null || member === null) {
        return;
    }

    const target = document.querySelector(".flo > .description_clean");

    const container = GM_addElement(target, "div", {
        style: "direction: rtl; text-align: right; max-width: 300px; padding: 10px;"
    });

    GM_addElement(container, "h3", {
        textContent: "אשכול השבוע",
        style: "margin-top: 0;"
    });

    GM_addElement(container, "div", {
        id: "thread-week",
        textContent: thread,
        style: "margin-bottom: 12px"
    });

    GM_addElement(container, "h3", {
        textContent: "משתמש השבוע"
    });

    GM_addElement(container, "div", {
        id: "member-week",
        textContent: member
    });
})


// TODO: check that every editor is compatible 
// consider adding a check to validate the parameter
// currently does not support setting changes
// This code runs only once; executeCommand works better then
onMatch("show(post|thread)|newreply", "none", async function() {    
    const instances = await waitForObject("CKEDITOR.instances");
    const editor = Object.values(instances)[0];
    let content = editor.getData(); // document

    if (!content.trim()) {
        content = '\u200B';
    }
    
    ['size', 'font', 'color'].forEach(style => {
        const value = cfg.get(style);
        if (!value) return;
        content = `[${style}=${value}]${content}[/${style}]`;
    })

    editor.setData(content);
});

//temporally
onMatch("upload.php", 'none', function() {
    const user1 = [cfg.get("user1name"), cfg.get("user1pass")]
    if (user1.filter(Boolean).length) {
        const b = GM_addElement(document.querySelector(".back_image"), "button", {
            textContent: "התחבר ל-" + user1[0]
        })
        b.addEventListener("click", async function() {
            await login(...user1)
        });
    }
    const user2 = [cfg.get("user2name"), cfg.get("user2spass")]
    if (user2.filter(Boolean).length) {
        const b = GM_addElement(document.querySelector(".back_image"), "button", {
            textContent: "התחבר ל-" + user2[0]
        })
        b.addEventListener("click", async function() {
            await login(...user2)
        });
    }
});

injectStyle("/(?:index.php)?", "noimages", ".imagediv { display:  none !important}")
injectStyle("/(?:index.php)?", "notitle", ".favtitle[style*=\"top\"] { display: none !important }")
onMatch("/(?:index.php)?", "allforums", async function() {
    const style = getCookie("bb_forumHomeStyle");
    if (style == 1) return;
    
    let toRemove = [];
    const digit = a => a.replace(/\D+/g, '') || '';
    const forums = await cachedFn('allforums', 20, async function() {
        setCookie('bb_forumHomeStyle', 1);
        const html = await fetcher('https://www.fxp.co.il');
        setCookie('bb_forumHomeStyle', 0);

        const doc = domParser.parseFromString(html, "text/html");

        const forums = Array.from(doc.querySelectorAll('.forum_title a'), a => ({
            id: digit(a.href),
            title: a.textContent,
            category: digit(a.closest('ol').id)
        }));

        return forums;
    });

    const compact = cfg.get("notitle");
    const size = `${compact ? '16' : '32'}px !important`;
    GM_addStyle(`
    .favswipecontent { height: unset !important }
    .favcontainer { height: 50% !important }
    .imagediv div, .imagediv img { height: ${size}; width: ${size} }
    `)

    const exists = [...document.querySelectorAll('[id*="hrefi_down_"]')].map(t => t.id.replace(/\D+/, ''));
    for (const {category, id, title} of forums) {
        if (id == '2450' || exists.includes(id)) continue;
        const parentCategory = document.querySelector(`.hp_category:has([href='forumdisplay.php?f=${category}'])`);
        // GM_addElement(parentCategory, "hr", {
        //     style: "width:65%;margin:0 auto;"
        // });
        const a = GM_addElement(parentCategory, "a", {
            id: `hrefi_down_${id}`,
            href: `forumdisplay.php?f=${id}`
        });

        toRemove.push(a);

        const li = GM_addElement(a, "li", {
            class: "favcontainer",
            id: `topfavli_hp${id}`,
        });

        const swipe = GM_addElement(li, "div", {
            id: `favswipecontenttop${id}`,
            class: "favswipecontent",
        });

        const content = GM_addElement(swipe, "div", {
            id: `contenttop${id}`,
            class: "content"
        });

        const imagediv = GM_addElement(content, "div", {
            style: "float: right;",
            class: "imagediv"
        });

        GM_addElement(imagediv, "div", {
            style: `float: right; height: 60px; border-radius: 30px; width: 60px; margin-left: 5px; background-image: url("https://images.weserv.nl/?url=https://static.fcdn.co.il/forumbg/${id}.gif&w=60&h=60&t=square&a=left");`
        });

        GM_addElement(content, "div", {
            class: "favtitle",
            textContent: title
        });

        GM_addElement(content, "div", {
            class: "favtitle",
            id: "favempty",
            style: "top: 20px;font-weight: normal;"
        });

    }

    if (!compact) { // the ugly way
        const titles = JSON.parse(await fetcher("https://www.fxp.co.il/ajax.php?do=forumdisplayqserach"));
        titles.forEach(t => {
            const f = document.querySelector(`contenttop${t.forumid} #favempty`);
            f && (f.innerHTML = t.lastthread)
        })
    }
    return () => {
        toRemove.forEach(el => el.remove());
        toRemove = [];
    }
})
/*
onMatch("show(post|thread)", 'none', async function() {
    GM_addElement('script', {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    })
    const original = document.querySelector('.report');
    const postId = original.href.replace(/\D+/, '');
    const post = document.querySelector('#post_' + postId);
    if (!post) return;

    const sog = prompt("סוג הדיווח הקריטי");
    const userId = post.querySelector('[data-user-id]').dataset.userId;

    const html = await fetcher(`/member.php?u=${userId}`);
    const doc = domParser.parseFromString(html, 'text/html');

    const birthDate = doc.querySelector(".agerow dd")?.textContent || "אין תאריך בפרופיל";
    const lastLogin = doc.querySelector('.userinfo dl:last-child > dd')?.textContent || "לא ידוע";
    const canvas = await html2canvas(post);
    const blob = await canvasToBlob(canvas);

    const formData = new FormData();
    formData.append('fileToUpload', blob, 'canvas.png');

    const response = await fetch('https://api.imagesup.co/u', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    console.log('Upload success:', data);

    const getFormatDate = (days = 0) => new Date(Date.now() - days * 86400000)
        .toLocaleDateString('en-GB')
        .replaceAll('/', '-');
    const content = `[FONT=open sans hebrew]
    [CENTER]
    [SIZE=5]דיווח קריטי[/SIZE]
    [SIZE=3]${sog}[/SIZE]
    [/CENTER]
    [B]א. קישור לפרופיל המשתמש של פותח האשכול:[/B]
    https://www.fxp.co.il/member.php?u=${userId}
    [B]ב. תאריך לידה של המשתמש:[/B]
    ${birthDate}
    [B]ג. קישור לאשכול עצמו:[/B]
    https://www.fxp.co.il/showpost.php?p=${postId}
    [B]ד. תאריך ושעת פתיחת האשכול:[/B]
    ${post.querySelector('.date')?.replace('היום', getFormatDate)?.replace('אתמול', getFormatDate(1))}
    [B]ה. מתי התחבר המשתמש בפעם האחרונה:[/B]
    ${lastLogin?.replace('היום', getFormatDate)?.replace('אתמול', getFormatDate(1))}
    [B]ו. כתובת מייל של המשתמש:[/B]
    יש לשנות
    [B]ז. קישור לתמונת תצלום מסך של האשכול:[/B]
    [IMG]${data.image_link}[/IMG]
    [/FONT]`;
    console.log(content);
    const url = `https://www.fxp.co.il/newthread.php?do=newthread&f=9771&message=${encodeURIComponent(content)}`;
    window.open(url);
})
*/

function canvasToBlob(canvas, type = 'image/png') {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, type);
    });
}

async function login(vb_login_username, vb_login_password) {
    const postData = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams({
            securitytoken: "guest",
            vb_login_username,
            vb_login_password,
            cookieuser: 1,
            do: "login"
        })
    };

    try {
        const data = await fetcher("https://www.fxp.co.il/login.php", postData);
        if (data.includes("התחברת בהצלחה")) alert("✅ Logged in successfully");
        else if (data.includes("במספר הפעמים המרבי")) alert("⚠️ Login restricted");
        alert("❌ Login failed: Invalid credentials");
    } catch (err) {
        alert("Login request failed");
    }
}

async function cachedFn(key, maxAgeMinutes, fetchFn) {
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    let stored = GM_getValue(key);
    stored = stored ? JSON.parse(stored) : null;

    if (stored && (now - stored.timestamp) < maxAgeMs) {
        return stored.data;
    }

    const data = await fetchFn();
    GM_setValue(key, JSON.stringify({ data, timestamp: now }));
    return data;
}