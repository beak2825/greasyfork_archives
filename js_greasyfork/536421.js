// ==UserScript==
// @name         Blookedex IQ
// @namespace    http://tampermonkey.net/
// @version      7
// @description  An efficient Blooket overhaul with Blookedex integrations.
// @author       fsscooter
// @match        https://*.blooket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blooket.com
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536421/Blookedex%20IQ.user.js
// @updateURL https://update.greasyfork.org/scripts/536421/Blookedex%20IQ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const version = "7";

    //w3schools minfied cookie managers
    function setCookie(e,t,o){let i=new Date;i.setTime(i.getTime()+864e5*o);let n="expires="+i.toUTCString();document.cookie=`${e}=${encodeURIComponent(t)}; ${n}; path=/; domain=.blooket.com; secure; samesite=Lax`}function getCookie(e){let t=e+"=",o=decodeURIComponent(document.cookie),i=o.split(";");for(let n of i){for(;" "===n.charAt(0);)n=n.substring(1);if(0===n.indexOf(t))return n.substring(t.length,n.length)}return null}

    let themes = [
        { name: "blooket", primary: "#9A48AA", secondary: "#08C2D0", background: "#08C2D0" },
        { name: "blooket dark", primary: "hsl(0,0%,12%)", secondary: "hsl(0,0%,18%)", background: ["hsl(0,0%,8%)", "hsl(0,0%,3%)"] },
        { name: "sunset", primary: "#E44C51", secondary: "#FFA41B", background: ["#5d87e3", "#ff3b8c"] },
        { name: "forest", primary: "#2E8B57", secondary: "#A3C586", background: ["#1B512D", "#A4DE02"] },
        { name: "ocean", primary: "#0077B6", secondary: "#90E0EF", background: ["#00B4D8", "#03045E"] },
        { name: "sunrise", primary: "#FFA07A", secondary: "#FFD700", background: ["#FFDEE9", "#B5FFFC"] },
        { name: "aurora", primary: "#7F00FF", secondary: "#00FF87", background: ["#00FFC3", "#3E1E68"] },
        { name: "peach", primary: "#FFADAD", secondary: "#FFD6A5", background: ["#FFEACD", "#FFDAC1"] },
        { name: "ice", primary: "#A0E9FD", secondary: "#CAF0F8", background: ["#B2EBF2", "#E0F7FA"] },
        { name: "coral", primary: "#148cdf", secondary: "#ee7de9", background: ["#ef1284", "#00b898"] },
        { name: "minecraft", primary: "#61371f", secondary: "#70b237", background: ["#3c44aa", "#3ab3da"], customShopkeeper: ["https://hollowvr.github.io/onlineassets/steveblooket.png", "1"], customStore: "https://hollowvr.github.io/onlineassets/mcstoreblooket.svg" },
        { name: "easter", primary: "#F8DC8A", secondary: "#F4A8CF", background: ["#B6E7B9", "#93DE8B"] },
        { name: "halloween", primary: "#F86D01", secondary: "#18e810", background: ["#A805F7", "#DA03F6"], customShopkeeper: ["https://hollowvr.github.io/onlineassets/jackolanternblooket.png","1.3"] },
        { name: "summer", primary: "#72D6E4", secondary: "#D8A93F", background: ["#89CDDA", "#FBDCA5"] },
        { name: "autumn", primary: "#C16A19", secondary: "#DFA628", background: ["#AD3B2D", "#D8284D"] },
        { name: "winter", primary: "#96CEFE", secondary: "#6C80BE", background: ["#A4F4FF", "#75A5C3"] },
        { name: "christmas", primary: "#C9001C", secondary: "#1FB34F", background: "radial-gradient(ellipse at bottom, #4e9a51 0%, #3d7b42 40%, #2f5e34 100%);", customShopkeeper: ["https://ac.blooket.com/marketassets/blooks/santaclaus.svg", "1"], customStore: "https://ac.blooket.com/dashclassic/assets/StoreWinter-DOhqNDCZ.svg" },
        { name: "marti gras", primary: "#A016FC", secondary: "#27DA3B", background: "linear-gradient(45deg,rgba(47, 163, 75, 1) 0%, rgba(140, 71, 151, 1) 50%, rgba(255, 204, 40, 1) 100%);" },
        { name: "haze", primary: "#4e4c29", secondary: "#f8de99", background: ["#fdbb35", "#ad1f25"] },
        { name: "midnight flare", primary: ["rgba(0, 20, 80, 0.8)", "rgba(0, 60, 255, 0.9)"], secondary: "#6c757d", background: ["#1a2b99", "#141414"] },
        { name: "twilight", primary: "rgba(38, 50, 56, 0.8)", secondary: "#b0bec5", background: ["#1a2327", "#37474f"] },
        { name: "blood moon", primary: "rgba(102, 0, 0, 0.8)", secondary: "#2f2f2f", background: ["#3e1414", "#000000"] },
        { name: "kraken", primary: "rgba(0, 51, 102, 0.8)", secondary: "#1abc9c", background: "linear-gradient(to bottom, #7db9e8 -5%, #005073 10%, #003e58 25%, #002a3d 55%, #000022 80%)", customShopkeeper: ["https://ac.blooket.com/marketassets/blooks/kraken.svg","1"] }
    ];
    //   { name: "halloween", primary: "", secondary: "", background: ["", ""] }
    if (getCookie("blxdexadmin") == null) {
        setCookie("blxdexadmin", "f,f,f")
    }
    const adminCodes = getCookie("blxdexadmin").split(",")
    if (adminCodes[0] == "t") {
        themes.push({ name: "USSR", primary: "#C60300", secondary: "#F9D700", background: "radial-gradient(#ff0000, #a60000)", customShopkeeper: ["https://hollowvr.github.io/onlineassets/karlmarxblooket.png", "1.7"], customStore: "https://hollowvr.github.io/onlineassets/ussrstoreblooket.png" })
    }
    if (adminCodes[1] == "t") {
        themes.push({ name: "usa", primary: "#424173", secondary: "#B52A3A", background: "repeating-linear-gradient(-5deg,#dbdbdb,#dbdbdb 60px,#B52A3A 60px,#B52A3A 120px);", customShopkeeper: ["https://upload.wikimedia.org/wikipedia/commons/5/5a/Donald_Trump_cutout.png", "1.5"], customStore: "https://hollowvr.github.io/onlineassets/usastoreblooket.svg" },)
    } else {
        themes.push({ name: "usa", primary: "#424173", secondary: "#B52A3A", background: "repeating-linear-gradient(-5deg,#dbdbdb,#dbdbdb 60px,#B52A3A 60px,#B52A3A 120px);", customShopkeeper: ["https://pngimg.com/d/barack_obama_PNG39.png", "2"], customStore: "https://hollowvr.github.io/onlineassets/usastoreblooket.svg" })
    }
    if (adminCodes[2] == "t") {
        themes.push({ name: "pittsburgh", primary: "#000000", secondary: "#E0B800", background: ["#FFD700 0%", "#D4AF37 40%", "#B8860B 80%", "#2F1C00 100%"] });
    }
    if (getCookie("blxdextheme") == null) {
        setCookie("blxdextheme", "0")
    }
    let theme = Number(getCookie("blxdextheme"))
    let background = "#fff"
    if (Array.isArray(themes[theme].background)) {
        background = 'linear-gradient('+themes[theme].background[0]+', '+themes[theme].background[1]+')';
    } else {
        background = themes[theme].background;
    }

    console.log("Blooket extension initialized");
    const style = document.createElement('style');
    style.innerHTML = `
        .blookedex-btnClose {
            transition:all .2s ease;
        }

        .blookedex-btnCloseGrandparent:hover .blookedex-btnClose {
            fill:#fff;
        }
        @keyframes blookedex-packImgKeyframes {
            from {transform:translateY(-50%) rotateY(90deg) scale(.1)}
            to {transform:translateY(-50%) rotateY(20deg) scale(1)}
        }
        .blookedex-packImg {
            animation: .5s cubic-bezier(.08,.54,.55,1.07) blookedex-packImgKeyframes;
        }
        .blookedex-buyBtn {
            transition: filter .25s;
        }
        .blookedex-buyBtn:hover {
            filter:brightness(110%);
        }
        .blookedex-buyBtn:hover > :first-child {
            transform:translateY(-2px);
        }
        .blookedex-buyBtn:hover > :nth-child(3) {
            transform:translateY(2px);
        }
        @keyframes blookedex-previewScrollAnim {
            from {transform:none}
            to {transform:translateX(calc(-50% - 10px))}
        }
        .blookedex-chancesPreview {transition:all .2s ease}
        .blookedex-chancesPreview:hover {
            filter:brightness(1.2);
            transform:scale(1.04);
        }

        @keyframes blookedex-zoomInAnim {
            from {
                transform: translate(-50%, -50%) scale(0);
            }
            to {
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .blookedex-zoomIn {
            animation: blookedex-zoomInAnim .5s cubic-bezier(0.68, -0.1, 0.27, 1.55);
        }
        :root {--blookedex-background:${background};}
    `
    const themeStyles = document.createElement('style');
    if (theme != 0) {
        style.innerHTML += `
        :root {
            --purple: var(--blookedex-primary);
        }
        `;
    }
    document.head.appendChild(style);
    updateThemeStyles();
    document.head.appendChild(themeStyles);

    function updateThemeStyles() {
        if (Array.isArray(themes[theme].background)) {
            background = 'linear-gradient('+themes[theme].background[0]+', '+themes[theme].background[1]+')';
        } else {
            background = themes[theme].background;
        }
        if (theme != 0) {
            themeStyles.innerHTML = `
:root {
    --blookedex-primary:${themes[theme].primary};
    --blookedex-secondary:${themes[theme].secondary};
    --blookedex-background:${background} !important;
    --blookedex-sidebar:${themes[theme].customSidebar};
}
            `
        } else {themeStyles.innerHTML = '';}
    }

    const applyBackground = () => {
        if (theme == 0) return;
        // Try primary selector
        let bgGradient = document.querySelector("div[data-sentry-component='Blooks']")?.children[0];

        // If not found, try fallback
        if (!bgGradient) {
            if (window.app?.children?.[0]?.children?.[0]?.children?.[6]) {
                bgGradient = window.app.children[0].children[0].children[6];
            }
        };

        if (!bgGradient) return;

        if (!bgGradient.className.includes('background')) return;

        bgGradient.style = "background:var(--blookedex-background);";
    };

    const replacements = {
        "my": "our",
        "My": "Our",
        "you": "us",
        "You": "Us",
        "Newbie": "Comrade"
    };

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            for (const [key, value] of Object.entries(replacements)) {
                text = text.replaceAll(key, value);
            }
            node.nodeValue = text;
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(node.tagName)
        ) {
            for (const child of node.childNodes) {
                replaceTextInNode(child);
            }
        }
    }


    const correctColor = (el) => {
        if (theme == 0) return;
        const style = getComputedStyle(el);
        ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
            const val = style[prop];
            if (val === 'rgb(154, 73, 170)' || val === 'rgb(64, 17, 95)') {
                el.style[prop] = "var(--blookedex-primary)";
            }
            if (val === 'rgb(11, 194, 207)' || val === 'rgb(122, 3, 157)') {
                el.style[prop] = "var(--blookedex-secondary)";
            }
            if (val === 'rgb(154, 73, 170)' && el.className.includes("statContainer")) {
                el.style[prop] = "var(--blookedex-secondary)";
            }
        });
    };

    const insertTab = (sideBar) => {
        if (typeof sideBar == 'undefined' || !sideBar.className.includes('sidebar') || sideBar.dataset.injected == "true") return;

        if (typeof themes[theme].customSidebar != 'undefined') sideBar.style = "background: var(--blookedex-sidebar) !important;background-color:transparent !important;"

        let clonedNode = sideBar.children[Math.min(3,sideBar.children.length-2)].cloneNode(true);
        if (sideBar.tagName == 'NAV') {
            clonedNode = sideBar.children[0].children[2].children[sideBar.children.length - 1].children[0].cloneNode(true);
        }
        clonedNode.href = "/my-sets?blookedex=true";
        clonedNode.children[0].classList.remove("fa-suitcase")
        clonedNode.classList.forEach(c => c.includes('pageSelected') && clonedNode.classList.remove(c));
        clonedNode.children[0].classList.add("fa-user-plus")
        clonedNode.children[1].textContent = "Blookedex"
        if (document.querySelector("#app") != null) {
            style.innerHTML += `
            .${clonedNode.className}:hover {
              color:var(--blookedex-primary) !important;
            }
            `
        }

        clonedNode.onclick = function() {
            console.log("sucess")
        }
        if (sideBar.tagName == 'NAV') {
            clonedNode.children[0].remove()
            clonedNode.innerHTML = `<svg aria-hidden="true" focusable="false" class="svg-inline--fa" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>` + clonedNode.innerHTML;

            const newElem = document.createElement('ul')
            newElem.appendChild(clonedNode)
            sideBar.children[0].children[2].appendChild(newElem)
            return;
        }
        if (window.location.href.includes("blookedex=true")) clonedNode.className = window.app.dataset.selectedClasses;
        sideBar.insertBefore(clonedNode, sideBar.childNodes[sideBar.children.length-1])
        sideBar.dataset.injected = "true"
    };

    const createCustomPage = () => {
        const body = window.app.children[0].children[0].children[6].cloneNode(false);
        window.app.children[0].children[0].children[6].style.display = "none";
        body.style = "display:flex;flex-direction:column;gap:20px;align-items:center;padding-top:50px;";
        body.innerHTML = '<div style="background:var(--blookedex-background);position:fixed;width:100%;height:100%;left:0;top:0;overflow:hidden;"><div style="background-image: url(&quot;https://ac.blooket.com/dashclassic/assets/BlookCheckers-BykpA7vd.png&quot;);position: absolute;width: 200%;height: 200%;top: 50%;left: 50%;background-size: 550px;background-position: -100px -100px;opacity: .1;transform: translate(-50%,-50%) rotate(15deg)"></div></div>';
        const versionSection = document.createElement("div")
        versionSection.style = "position:relative;background-color:var(--blookedex-primary);backdrop-filter:blur(10px);border:6px solid rgba(255, 255, 255, 0.2);border-radius:20px;width:50rem;padding:20px;"
        versionSection.innerHTML = "<div style='font-family: Titan One;font-size: 44px;font-weight: 700;margin: 15px 5% 10px;color: #efefef;text-shadow:0 0 10px rgba(0,0,0,0.2);'>Version Info</div>"
        versionSection.appendChild(Object.assign(document.createElement('div'),{textContent: "Current Version: "+version, style: "font-size: 2em;color:white;"}))
        versionSection.appendChild(Object.assign(document.createElement('a'),{textContent: "Check Updates", href: "https://greasyfork.org/en/scripts/536421-blookedex-iq", style: "font-size: 2em;"}))
        const themeSection = document.createElement("div")
        themeSection.style = "position:relative;background-color:var(--blookedex-primary);backdrop-filter:blur(10px);border:6px solid rgba(255, 255, 255, 0.2);border-radius:20px;width:50rem;padding:20px;"
        themeSection.innerHTML = "<div style='font-family: Titan One;font-size: 44px;font-weight: 700;margin: 15px 5% 10px;color: #efefef;text-shadow:0 0 10px rgba(0,0,0,0.2);'>Select a Theme</div>"
        const themesContainer = document.createElement("div")
        themesContainer.style = "display: flex;flex-wrap: wrap;gap: 10px;width:100%;justify-content:center;";
        for (let i = 0;i < themes.length;i++) {
            let background = "#fff"
            if (Array.isArray(themes[i].background)) {
                background = 'linear-gradient('+themes[i].background[0]+', '+themes[i].background[1]+')';
            } else {
                background = themes[i].background;
            }
            const themeBox = document.createElement("div")
            themeBox.onclick = function() {
                setCookie("blxdextheme", String(i));
                if (i == 0 || theme == 0) {window.location.reload();return;}
                theme = i;
                updateThemeStyles();
                Array.from(themesContainer.children).forEach((el) => {
                    if (el.style.border == "2px solid #0377fc") {
                        el.style.border = "2px solid #e4e8ec33";
                    }
                })
                themeBox.style.border = "2px solid #0377fc";
            }
            themeBox.style = "width:120px;height:100px;border:2px solid "+((theme == i) ? "#0377fc" : "#e4e8ec33")+";border-radius:10px;background:#efefef22;--primary:"+themes[i].primary+";--secondary:"+themes[i].secondary+";--bgGradient:"+background+";";
            const previewBG = document.createElement("div");
            previewBG.style = "width:100%;height:80%;background:var(--bgGradient);border-radius:10px;cursor:pointer;overflow:hidden;position:relative;"
            const previewBar = document.createElement("div");
            previewBar.style = "position:absolute;left:0;top:0;height:100%;background:var(--primary);width:20px;box-shadow: 0 0 10px rgba(0,0,0,0.2), inset -3px 0 0 rgba(0,0,0,0.05);display:flex;flex-direction:column;gap:5px;padding:5px;align-items:center;"
            previewBar.innerHTML = "<div style='height:3px;width:15px;background:#efefefee;border-radius:10px;'></div><div style='height:8px;width:18px;background:"+themes[i].secondary+";border-radius:2px;'></div><div style='height:2px;width:10px;background:#efefefee;border-radius:10px;'></div><div style='height:2px;width:13px;background:#efefefee;border-radius:10px;'></div><div style='height:2px;width:15px;background:#efefefee;border-radius:10px;'></div><div style='height:2px;width:10px;background:#efefefee;border-radius:10px;'></div><div style='height:2px;width:8px;background:#efefefee;border-radius:10px;'></div><div style='height:2px;width:13px;background:#efefefee;border-radius:10px;'></div>"
            previewBG.appendChild(previewBar)
            themeBox.appendChild(previewBG)
            const themeName = document.createElement("div")
            themeName.textContent = themes[i].name
            themeName.style = "margin-left:7px;color:white;text-shadow: 0 0 5px rgba(0,0,0,0.5);"
            themeBox.appendChild(themeName)
            themesContainer.appendChild(themeBox)
        }
        themeSection.appendChild(themesContainer)

        const adminSection = document.createElement("div")
        adminSection.style = "position:relative;background-color:var(--blookedex-primary);backdrop-filter:blur(10px);border:6px solid rgba(255, 255, 255, 0.2);border-radius:20px;width:50rem;padding:20px;"
        adminSection.innerHTML = "<div style='font-family: Titan One;font-size: 44px;font-weight: 700;margin: 15px 5% 10px;color: #efefef;text-shadow:0 0 10px rgba(0,0,0,0.2);'>Admin Codes</div>"
        adminSection.appendChild(Object.assign(document.createElement('div'),{textContent: "Admin codes implement secret functionalities the devs want", style: "font-size: 2em;color:white;"}))
        const adminInput = document.createElement("input");
        adminInput.placeholder = "Enter Code";
        adminInput.type = "text";
        adminInput.style = "font-size:2em;";
        adminSection.appendChild(adminInput);
        adminSection.appendChild(Object.assign(document.createElement('button'),{textContent: "submit", style: "font-size: 2em;", onclick: function() {
            if (adminInput.value == "USSR") {
                setCookie("blxdexadmin", "t,"+adminCodes[1]+","+adminCodes[2])
            }
            if (adminInput.value == "bigbeautifulbill") {
                setCookie("blxdexadmin", adminCodes[0]+",t,"+adminCodes[2])
            }
            if (adminInput.value == "pitty") {
                setCookie("blxdexadmin", adminCodes[0]+","+adminCodes[1]+",t")
            }
            location.reload()
        }}))

        body.appendChild(versionSection)
        body.appendChild(themeSection)
        body.appendChild(adminSection)
        window.app.children[0].children[0].appendChild(body)





        const sidebar = window.app.children[0].children[0].children[0]
        const mo = new MutationObserver(() => {
            if (sidebar.children.length === 10) {
                mo.disconnect();
                insertTab(sidebar);
            }
        });
        mo.observe(sidebar, { childList: true });

    };

    const walkAndFix = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (themes[theme]?.name == "USSR") {
                replaceTextInNode(node);
                if (typeof node.className == 'string' && (node.className.includes("logo") || node.className.includes("Logo")) && node.tagName == "IMG") {
                    node.src = "https://hollowvr.github.io/onlineassets/blooketcomradelogo.png";
                    node.style.transform = "scale(1.2)";
                }
            };
            correctColor(node);
            if (typeof node.className == 'string' && node.className.includes("background")) {
                applyBackground();
            }
            if (typeof node.className == 'string' && (node.className.includes("bottomRow") || node.className.includes("Sidebar_footerWrapper"))) {
                try {
                    insertTab([...document.querySelectorAll('*')].find(e => String(e.className).includes('sidebar')));
                } catch (err) {}
            }
            if (typeof node.className == 'string' && node.className.includes("passContainer")) {
                node.style = "background:repeating-linear-gradient(45deg,rgba(0,0,0,0.1) 25%,transparent 0,transparent 75%,rgba(0,0,0,0.1) 0,rgba(0,0,0,0.1)),repeating-linear-gradient(45deg,rgba(0,0,0,0.1) 25%,transparent 0 75%,rgba(0,0,0,0.1) 0,rgba(0,0,0,0.1)),var(--blookedex-primary);background-position: 0 0,20px 20px;background-size: 40px 40px;";
            }
            if (typeof node.className == 'string' && (node.className.includes("spacer") && node.parentNode.className.includes("profileBody")) && window.location.href.includes("blookedex=true")) {
                createCustomPage();
            }
            if (typeof node.className == 'string' && (node.className.includes("topFolderButton") || node.className.includes("searchBar")) && window.location.href.includes("blookedex=true")) {
                node.style.display = "none";
            }
            if (typeof node.className == 'string' && node.className.includes("cashier") && window.location.pathname == "/market" && typeof themes[theme].customShopkeeper != 'undefined') {
                node.src = themes[theme].customShopkeeper[0];
                node.style = "transform: rotate(10deg) scale("+themes[theme].customShopkeeper[1]+")";
            }
            if (typeof node.className == 'string' && node.className.includes("storeImg") && window.location.pathname == "/market" && typeof themes[theme].customStore != 'undefined') {
                node.src = themes[theme].customStore;
                node.style = "filter: drop-shadow(0 0 5px #0004)";
            }
            if (node && typeof node.className === 'string' && node.className.includes("modal") && !node.className.includes("modalTransition") && node.children[0] && typeof node.children[0].className === 'string' && node.children[0].className.includes("container") && window.location.pathname == '/market') {
                const poorMenu = document.createElement('div');
                poorMenu.style = "width:500px;height:120px;background:var(--blookedex-primary);border: solid 6px hsla(0, 0%, 100%, .2); border-radius:5px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:26px;font-size:30px;font-family:Titan One;display:flex;align-items:center;color:white;text-shadow: 2px 2px 0 rgba(0,0,0,0.2);flex-direction:column;padding-top:30px;";
                poorMenu.innerHTML = "Not Enough Tokens!"
                const Pmatches = [...node.children[0].querySelectorAll("*")]
                .filter(e => String(e.className).includes('button_'));
                const closeButton = document.createElement("button");
                closeButton.className = "blookedex-btnCloseGrandparent";
                closeButton.style = "background:transparent;border:none;outline:none;padding:8px;font-size:26px;position:absolute;top:3px;right:10px;cursor:pointer;";
                closeButton.onclick = () => Pmatches[0].click();
                closeButton.innerHTML = '<svg style="width:.6875em;height:1em;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path class="blookedex-btnClose" fill="hsla(0, 0%, 100%, .2)" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>';
                const closeBtn = document.createElement('button')
                closeBtn.className = "blookedex-buyBtn"
                closeBtn.style = "position:absolute;width:200px;height: 55px;top:calc(100% - 65px);left:50%;padding:0;cursor:pointer;background:transparent;border:none;outline:none;transform:translateX(-50%);"
                closeBtn.innerHTML = "<div style='transition:transform .25s cubic-bezier(.3,.7,.4,1);font-family:Titan One;font-size:30px;display:flex;align-items:center;justify-content:center;text-shadow: 2px 2px 0 rgba(0,0,0,0.2);color:white;background:var(--blookedex-secondary);width:100%;height:calc(100% - 15px);position:absolute;top:5px;z-index:3;border-radius:5px;'>Close</div><div style='background:var(--blookedex-secondary);width:100%;height:calc(100% - 15px);position:absolute;top:9px;filter:brightness(.8);z-index:2;border-radius:5px;'></div><div style='background:#00000040;width:100%;height:calc(100% - 15px);position:absolute;top:12px;z-index:1;border-radius:5px;transition:transform .25s cubic-bezier(.3,.7,.4,1);'></div>"
                closeBtn.onclick = () => Pmatches[0].click();
                poorMenu.appendChild(closeBtn);
                poorMenu.appendChild(closeButton);
                function runLogic() {
                    poorMenu.remove();

                    let chances = node.querySelector('i').dataset.tip.replace("Ding: ", "Dink: ").split("</div><div>")
                    chances.splice(0,1)
                    chances[chances.length-1] = chances[chances.length-1].slice(0,-12)

                    const chancesObject = chances.map(entry => {
                        const [name, chanceStr] = entry.split(': ');
                        return {
                            name,
                            chance: parseFloat(chanceStr.replace('%', ''))
                        };
                    });

                    const matches = [...node.children[0].querySelectorAll("*")]
                    .filter(e => String(e.className).includes('button_'));
                    if (matches.length !== 2) return;

                    closeButton.onclick = () => matches[0].click();

                    const container = node.children[0];

                    const packName = container.firstChild.firstChild.childNodes[1].textContent.substr(13);
                    const packCost = +container.firstChild.firstChild.childNodes[3].textContent.match(/\d+/);


                    const menu = document.createElement("div");
                    menu.style = "width:500px;height:250px;background:var(--blookedex-primary);border: solid 6px hsla(0, 0%, 100%, .2); border-radius:5px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:26px;perspective: 300px;";


                    const nametopackimg = {
                        "Bug Pack": "https://ac.blooket.com/dashclassic/assets/Bug_Pack-Cm44315z.png",
                        "Pirate Pack": "https://ac.blooket.com/dashclassic/assets/Pirate_Pack-Uir9GffU.png",
                        "Outback Pack": "https://ac.blooket.com/dashclassic/assets/Outback_Pack-Y8OWSe8a.png",
                        "Ice Monster Pack": "https://ac.blooket.com/dashclassic/assets/Ice_Monsters_Pack-BkSPnfqh.png",
                        "Dino Pack": "https://ac.blooket.com/dashclassic/assets/Dino_Pack-DAApPtRS.png",
                        "Aquatic Pack": "https://ac.blooket.com/dashclassic/assets/Aquatic_Pack-jzoFduWG.png",
                        "Safari Pack": "https://ac.blooket.com/dashclassic/assets/Safari_Pack-CH238vQG.png",
                        "Bot Pack": "https://ac.blooket.com/dashclassic/assets/Bot_Pack-DH_cssp8.png",
                        "Space Pack": "https://ac.blooket.com/dashclassic/assets/Space_Pack-Ck3VoVFZ.png",
                        "Medieval Pack": "https://ac.blooket.com/dashclassic/assets/Medieval_Pack-Cv60cQFL.png",
                        "Wonderland Pack": "https://ac.blooket.com/dashclassic/assets/Wonderland_Pack-CaB8iqtb.png",
                        "Breakfast Pack": "https://ac.blooket.com/dashclassic/assets/Breakfast_Pack-Dbk28uOc.png",
                        "Lunch Pack": "https://ac.blooket.com/dashclassic/assets/Lunch_Pack-DWYwdJdz.png",
                    }

                    const packImg = document.createElement("div");
                    packImg.style = "filter:drop-shadow(0 0 10px rgba(0,0,0,0.4));background-image:url("+nametopackimg[packName]+");width:204.55px;height:225px;background-size: 204.55px 225px;position:absolute;top:50%;left:25px;transform:translateY(-50%) rotateY(20deg);"
                    packImg.className = "blookedex-packImg";

                    menu.addEventListener('mousemove', e => {
                        const rect = packImg.getBoundingClientRect();
                        const x = e.clientX - rect.left + 100; // x position within the box
                        const y = e.clientY - rect.top; // y position within the box

                        const rotateX = ((y / rect.height) - 0.5) * -10; // max 5° rotation
                        const rotateY = ((x / rect.width) - 0.5) * 10;

                        packImg.style.transform = `translateY(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });

                    menu.addEventListener('mouseleave', () => {
                        packImg.style.transform = 'translateY(-50%) rotateX(0deg) rotateY(10deg)';
                    });

                    const buyBtn = document.createElement('button')
                    buyBtn.className = "blookedex-buyBtn"
                    buyBtn.style = "position:absolute;width:250px;height: 55px;top:calc(100% - 65px);right:10px;padding:0;cursor:pointer;background:transparent;border:none;outline:none;"
                    buyBtn.innerHTML = "<div style='transition:transform .25s cubic-bezier(.3,.7,.4,1);font-family:Titan One;font-size:30px;display:flex;align-items:center;justify-content:center;text-shadow: 2px 2px 0 rgba(0,0,0,0.2);color:white;background:var(--blookedex-secondary);width:100%;height:calc(100% - 15px);position:absolute;top:5px;z-index:3;border-radius:5px;'>Purchase</div><div style='background:var(--blookedex-secondary);width:100%;height:calc(100% - 15px);position:absolute;top:9px;filter:brightness(.8);z-index:2;border-radius:5px;'></div><div style='background:#00000040;width:100%;height:calc(100% - 15px);position:absolute;top:12px;z-index:1;border-radius:5px;transition:transform .25s cubic-bezier(.3,.7,.4,1);'></div>"
                    buyBtn.onclick = () => matches[1].click();

                    const infoTitle = document.createElement("div");
                    infoTitle.style = "position:absolute;right:50px;width:200px;height:50px;top:20px;font-family:Titan One;font-size:30px;display:flex;align-items:center;text-shadow: 2px 2px 0 rgba(0,0,0,0.2);color:white;"
                    infoTitle.textContent = packName

                    const infoCost = document.createElement("div");
                    infoCost.style = "position:absolute;right:185px;width:65px;height:30px;top:80px;background:#00000040;font-family:Titan One;font-size:20px;display:flex;align-items:center;text-shadow: 2px 2px 0 rgba(0,0,0,0.2);color:white;padding-left:5px;border-radius:5px;"
                    infoCost.innerHTML = "<img src='https://ac.blooket.com/dashclassic/assets/Token-DmrosBZF.svg' alt='Token' draggable='false' style='height:20px;height:20px;margin-right:7px;' />"+packCost;

                    const chancesPreview = document.createElement("div")
                    chancesPreview.className = "blookedex-chancesPreview";
                    chancesPreview.style = "position:absolute;width:236px;height:66px;top:calc(100% - 135px);right:15px;background:#28282828;border-radius:5px;border:2px solid rgba(255, 255, 255, 0.2);box-shadow:0 0 5px rgba(0,0,0,0.2),inset 0 0 20px rgba(255,255,255,0.2);overflow:hidden;cursor:pointer;";
                    chancesPreview.innerHTML = "<div style='position:absolute;font-family:Titan One;color:white;text-shadow:0 0 5px rgba(0,0,0,0.2);font-size:.5em;left:5px;top:5px;z-index:2;'>Chances</div>"
                    const chancesPreviewContent = document.createElement("div")
                    chancesPreviewContent.style = "position:absolute;height:100%;width:auto;display:flex;gap:20px;animation-name:blookedex-previewScrollAnim;animation-duration:10s;animation-iteration-count:infinite;animation-timing-function:linear;"
                    for (let i = 0;i<2;i++){chancesObject.forEach((obj) => chancesPreviewContent.appendChild(Object.assign(document.createElement("img"), {style: "width:50px;", src: "https://ac.blooket.com/marketassets/blooks/"+obj.name.replace(/\s+/g, '').toLowerCase()+".svg"})));}

                    chancesPreview.onclick = function() {

                        const hgBg = {Aquatic:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Aquatic-CDVAa5Z1.svg",Arctic:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Arctic-DnFet-Es.svg",Blizzard:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Blizzard-BEOZGRo9.svg",Bot:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Bots-CWFp85lE.svg",Breakfast:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Breakfast-rXV3rN0C.svg",Dino:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Dino-qvYP8NHH.svg","Farm Animal":"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Farm-Cf8P0mJz.svg","Forest Animal":"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Forest-56I9sRnu.svg",Color:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Generic-BG3_DSfA.svg","Ice Monster":"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Ice_Monster-IrnSpiG5.svg",Medieval:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Medieval-HAKt-8uS.svg",Outback:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Outback-CCDUJgD9.svg",Pet:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Pets--9tpvwHe.svg",Safari:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Safari-Bov1ICT4.svg",Space:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Space-BVfDeCoN.svg",Spooky:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Spooky-BE3Q44ax.svg","Tropical Animal":"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Tropical-DV9rwhsh.svg",Wonderland:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Wonderland-By4voe3_.svg",Pirate:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Pirate-CrD0PKuQ.svg",Autumn:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Autumn-p3HcOb_2.svg",Bug:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Bug-D5IFT82n.svg",Lunch:"https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Lunch-BfOeSTeT.svg"}
                        const blookRarities = {"Old Boot":"Uncommon",Jellyfish:"Uncommon",Clownfish:"Uncommon",Frog:"Uncommon",Crab:"Uncommon",Pufferfish:"Rare",Blobfish:"Rare",Octopus:"Rare",Narwhal:"Epic",Dolphin:"Epic","Baby Shark":"Legendary",Megalodon:"Legendary","Snowy Owl":"Common","Polar Bear":"Common","Arctic Fox":"Common","Baby Penguin":"Common",Penguin:"Common","Arctic Hare":"Common",Seal:"Common",Walrus:"Common","Black Bear":"Uncommon","Pumpkin Pie":"Uncommon",Chipmunk:"Uncommon",Cornucopia:"Uncommon","Autumn Cat":"Rare","Pumpkin Puppy":"Rare","Autumn Crow":"Epic",Turkey:"Legendary","Snow Globe":"Uncommon","Holiday Gift":"Uncommon","Hot Chocolate":"Uncommon","Holiday Wreath":"Uncommon",Stocking:"Uncommon","Gingerbread Man":"Rare","Gingerbread House":"Rare",Reindeer:"Rare",Snowman:"Epic","Santa Claus":"Legendary","Lil Bot":"Uncommon","Lovely Bot":"Uncommon","Angry Bot":"Uncommon","Happy Bot":"Uncommon",Watson:"Rare","Buddy Bot":"Rare","Brainy Bot":"Epic","Mega Bot":"Legendary",Toast:"Uncommon",Cereal:"Uncommon",Yogurt:"Uncommon","Breakfast Combo":"Uncommon","Orange Juice":"Uncommon",Milk:"Uncommon",Waffle:"Rare",Pancakes:"Rare","French Toast":"Epic",Pizza:"Epic","Light Blue":"Common",Black:"Common",Red:"Common",Purple:"Common",Pink:"Common",Orange:"Common",Lime:"Common",Green:"Common",Teal:"Common",Tan:"Common",Maroon:"Common",Gray:"Common",Mint:"Common",Salmon:"Common",Burgandy:"Common","Baby Blue":"Common",Dust:"Common",Brown:"Common","Dull Blue":"Common",Yellow:"Common",Blue:"Common",Amber:"Uncommon","Dino Egg":"Uncommon","Dino Fossil":"Uncommon",Stegosaurus:"Uncommon",Velociraptor:"Rare",Brontosaurus:"Rare",Triceratops:"Epic","Tyrannosaurus Rex":"Legendary",Chick:"Common",Chicken:"Common",Cow:"Common",Goat:"Common",Horse:"Common",Pig:"Common",Sheep:"Common",Duck:"Common",Alpaca:"Common",Bear:"Common",Moose:"Common",Fox:"Common",Raccoon:"Common",Squirrel:"Common",Owl:"Common",Hedgehog:"Common",Deer:"Common",Wolf:"Common",Beaver:"Common","Rainbow Jellyfish":"Chroma","Blizzard Clownfish":"Chroma","Lovely Frog":"Chroma","Lucky Frog":"Chroma","Spring Frog":"Chroma","Poison Dart Frog":"Chroma","Lucky Hamster":"Chroma","Chocolate Rabbit":"Chroma","Spring Rabbit":"Chroma","Lemon Crab":"Chroma","Pirate Pufferfish":"Chroma","Donut Blobfish":"Chroma","Crimson Octopus":"Chroma","Rainbow Narwhal":"Chroma","Frost Wreath":"Chroma","Tropical Globe":"Chroma","New York Snow Globe":"Chroma","London Snow Globe":"Chroma","Japan Snow Globe":"Chroma","Egypt Snow Globe":"Chroma","Paris Snow Globe":"Chroma","Red Sweater Snowman":"Chroma","Blue Sweater Snowman":"Chroma","Elf Sweater Snowman":"Chroma","Santa Claws":"Chroma","Cookies Combo":"Chroma","Chilly Flamingo":"Chroma","Snowy Bush Monster":"Chroma","Nutcracker Koala":"Chroma",Sandwich:"Epic","Ice Slime":"Chroma","Frozen Fossil":"Chroma","Ice Crab":"Chroma","Rainbow Panda":"Chroma","White Peacock":"Chroma","Tiger Zebra":"Chroma","Teal Platypus":"Chroma","Golden Pumpkin Pie":"Chroma","Red Astronaut":"Chroma","Orange Astronaut":"Chroma","Yellow Astronaut":"Chroma","Lime Astronaut":"Chroma","Green Astronaut":"Chroma","Cyan Astronaut":"Chroma","Blue Astronaut":"Chroma","Pink Astronaut":"Chroma","Purple Astronaut":"Chroma","Brown Astronaut":"Chroma","Black Astronaut":"Chroma","Lovely Planet":"Chroma","Lovely Peacock":"Chroma","Haunted Pumpkin":"Chroma","Pumpkin Cookie":"Chroma","Ghost Cookie":"Chroma","Red Gummy Bear":"Chroma","Blue Gummy Bear":"Chroma","Green Gummy Bear":"Chroma","Chick Chicken":"Chroma","Chicken Chick":"Chroma","Raccoon Bandit":"Chroma","Owl Sheriff":"Chroma","Vampire Frog":"Chroma","Pumpkin King":"Chroma",Leprechaun:"Chroma","Anaconda Wizard":"Chroma","Spooky Pumpkin":"Chroma","Spooky Mummy":"Chroma","Agent Owl":"Chroma","Master Elf":"Chroma","Party Pig":"Chroma","Wise Owl":"Unique","Spooky Ghost":"Mystical","Phantom King":"Mystical","Tim the Alien":"Mystical","Rainbow Astronaut":"Mystical","Hamsta Claus":"Mystical","Ice Bat":"Uncommon","Ice Bug":"Uncommon","Ice Elemental":"Uncommon","Rock Monster":"Uncommon",Dink:"Rare",Donk:"Rare","Bush Monster":"Epic",Yeti:"Legendary",Witch:"Uncommon",Wizard:"Uncommon",Elf:"Uncommon",Fairy:"Uncommon","Slime Monster":"Uncommon",Jester:"Rare",Dragon:"Rare",Queen:"Rare",Unicorn:"Epic",King:"Legendary",Dingo:"Uncommon",Echidna:"Uncommon",Koala:"Uncommon",Kookaburra:"Uncommon",Platypus:"Rare",Joey:"Rare",Kangaroo:"Rare",Crocodile:"Epic","Sugar Glider":"Legendary",Dog:"Common",Cat:"Common",Rabbit:"Common",Goldfish:"Common",Hamster:"Common",Turtle:"Common",Kitten:"Common",Puppy:"Common",Panda:"Uncommon",Sloth:"Uncommon",Tenrec:"Uncommon",Flamingo:"Uncommon",Zebra:"Uncommon",Elephant:"Rare",Lemur:"Rare",Peacock:"Rare",Chameleon:"Epic",Lion:"Legendary",Earth:"Uncommon",Meteor:"Uncommon",Stars:"Uncommon",Alien:"Uncommon",Planet:"Rare",UFO:"Rare",Spaceship:"Epic",Astronaut:"Legendary",Pumpkin:"Uncommon","Swamp Monster":"Uncommon",Frankenstein:"Uncommon",Vampire:"Uncommon",Zombie:"Rare",Mummy:"Rare","Caramel Apple":"Rare","Candy Corn":"Rare",Crow:"Rare",Werewolf:"Epic",Ghost:"Legendary",Tiger:"Common",Orangutan:"Common",Cockatoo:"Common",Parrot:"Common",Anaconda:"Common",Jaguar:"Common",Macaw:"Common",Toucan:"Common",Panther:"Common",Capuchin:"Common",Gorilla:"Common",Hippo:"Common",Rhino:"Common",Giraffe:"Common","Two of Spades":"Uncommon","Eat Me":"Uncommon","Drink Me":"Uncommon",Alice:"Uncommon","Queen of Hearts":"Uncommon",Dormouse:"Rare","White Rabbit":"Rare","Cheshire Cat":"Rare",Caterpillar:"Epic","Mad Hatter":"Epic","King of Hearts":"Legendary",Deckhand:"Uncommon",Buccaneer:"Uncommon",Swashbuckler:"Uncommon","Treasure Map":"Uncommon",Seagull:"Uncommon","Jolly Pirate":"Rare","Pirate Ship":"Rare",Kraken:"Epic","Captain Blackbeard":"Legendary","Holiday Elf":"Chroma","Cozy Baby Penguin":"Chroma",Ant:"Uncommon","Rhino Beetle":"Uncommon",Ladybug:"Uncommon",Fly:"Uncommon",Worm:"Rare",Bee:"Rare",Mantis:"Epic",Butterfly:"Legendary","Blue Butterfly":"Chroma",Bananas:"Uncommon",Watermelon:"Uncommon",Cheese:"Uncommon",Doughnut:"Uncommon",Taco:"Rare",Bao:"Rare",Sushi:"Rare",Cheeseburger:"Epic","Half a Sandwich":"Chroma"};
                        const menu = document.createElement("div");
                        menu.className = "blookedex-zoomIn";
                        menu.style = "width:800px;background:var(--blookedex-primary);border: solid 6px hsla(0, 0%, 100%, .2); border-radius:5px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:26px;padding-bottom:20px;";
                        const title = document.createElement("div");
                        title.style = "display:block;font-size:1.5em;color:white;font-family:Titan One;text-align:center;margin:20px;";
                        title.textContent = packName + " - Chances";
                        const blooksContainer = document.createElement("div");
                        blooksContainer.style = "display: flex; flex-wrap: wrap; gap: 10px; width: 100%; justify-content: center;"
                        chancesObject.forEach((obj) => {
                            const blookCard = document.createElement("div")
                            blookCard.style = "width:200px;height:150px;background:var(--blookedex-secondary);border-radius:8px;box-shadow: 0 6px 10px rgba(0,0,0,0.3);position:relative;";
                            const blookCardTitle = document.createElement("abbr")
                            blookCardTitle.title = obj.name
                            blookCardTitle.style = "position:absolute;top:5px;left:5px;height:25px;width:190px;background:hsla(0, 0%, 0%, .2);border-radius:5px;font-family:Titan One;color:white;font-size:17px;align-items:center;justify-content:center;display:flex;text-shadow:2px 2px 0 rgba(0,0,0,0.5);white-space: nowrap;text-overflow:ellipsis;text-decoration:none;z-index:2;"
                            blookCardTitle.textContent = obj.name
                            const blookCardMain = document.createElement('div')
                            blookCardMain.style = "position:absolute;top:35px;width:190px;height:80px;border-radius:5px;overflow:hidden;background-image:url("+(hgBg[packName.replace(' Pack', '')] ?? "https://ac.blooket.com/dashclassic/assets/Highlighted_Background_Generic-BG3_DSfA.svg")+");background-size:190px;left:5px;background-position: 50% 80%;"
                            const blookCardBlook = document.createElement('img')
                            blookCardBlook.src = "https://ac.blooket.com/marketassets/blooks/"+obj.name.replace(/\s+/g, '').toLowerCase()+".svg"
                            blookCardBlook.style = "width:60px;position:absolute;left:50%;transform:translateX(-50%);bottom:10px;"
                            const blookCardRarity = document.createElement('div')
                            blookCardRarity.style = "position:absolute;bottom:5px;height:19px;left:5px;background:"+({Common:"#D8DFED",Uncommon:"#41B427",Rare:"#0A14FA",Epic:"#BE0000",Legendary:"#FF9110",Chroma:"#0CF",Mystical:"#A335ED",Unique:"#3E7C7F"}[blookRarities[obj.name]] ?? "#C1C5CD")+";width:86.5px;border-radius:5px;border: solid 3px hsla(0, 0%, 100%, .2);display:flex;align-items:center;justify-content:center;font-family:Titan One;color:white;font-size:14px;"
                            blookCardRarity.textContent = blookRarities[obj.name] ?? "Unavaliable"
                            const blookCardChance = document.createElement('div')
                            blookCardChance.style = "position:absolute;bottom:5px;height:25px;right:5px;background:hsla(0,0%,0%,.2);width:92.5px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:Titan One;color:white;font-size:14px;"
                            blookCardChance.textContent = obj.chance+"%"
                            blookCard.appendChild(blookCardTitle)
                            blookCardMain.appendChild(blookCardBlook)
                            blookCard.appendChild(blookCardMain)
                            blookCard.appendChild(blookCardRarity)
                            blookCard.appendChild(blookCardChance)
                            blooksContainer.appendChild(blookCard);
                        })

                        const closeButton = document.createElement("button");
                        closeButton.className = "blookedex-btnCloseGrandparent";
                        closeButton.style = "background:transparent;border:none;outline:none;padding:8px;font-size:26px;position:absolute;top:3px;right:10px;cursor:pointer;";
                        closeButton.onclick = () => Pmatches[0].click();
                        closeButton.innerHTML = '<svg style="width:.6875em;height:1em;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path class="blookedex-btnClose" fill="hsla(0, 0%, 100%, .2)" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>';
                        closeButton.onclick = () => menu.remove()
                        menu.appendChild(closeButton);
                        menu.appendChild(title);
                        menu.appendChild(blooksContainer);
                        node.appendChild(menu);
                    }

                    chancesPreview.appendChild(chancesPreviewContent)

                    menu.appendChild(buyBtn);
                    menu.appendChild(chancesPreview);
                    menu.appendChild(closeButton);
                    menu.appendChild(packImg);
                    menu.appendChild(infoTitle);
                    menu.appendChild(infoCost)
                    node.appendChild(menu);
                }

                const initialMatches = [...node.children[0].querySelectorAll("*")]
                .filter(e => String(e.className).includes('button_'));
                const container = node.children[0];
                container.style.display = 'none';
                if (initialMatches.length === 2) {
                    runLogic();
                } else {
                    node.appendChild(poorMenu)

                    const observer = new MutationObserver(() => {
                        const updatedMatches = [...node.children[0].querySelectorAll("*")]
                        .filter(e => String(e.className).includes('button_'));
                        if (updatedMatches.length === 2) {
                            observer.disconnect();
                            runLogic();
                        }
                    });

                    observer.observe(node, { childList: true, subtree: true });
                }

            }
            if (typeof node.className == 'string' && node.className.includes("profileBody") && !window.location.href.includes("blookedex=true") && (window.location.pathname != "/stats" || window.location.pathname != "/blooks")) {
                if (theme == 0) return;
                window.app.children[0].children[0].classList.add("blookedex-bgInject");
                if (window.app.dataset.backgroundInjected == "true") document.getElementById("blookedex-customStyles").remove();
                const style = document.createElement('style');
                style.id = "blookedex-customStyles"
                style.innerHTML = `
.blookedex-bgInject {
    background-image: var(--blookedex-background);
}
.blookedex-bgInject::before {
    content: "";display:block;position:fixed;
    background-image: url(https://ac.blooket.com/dashclassic/assets/BlookCheckers-BykpA7vd.png);width: 200%;height: 200%;top: 50%;left: 50%;background-size: 550px;background-position: -100px -100px;opacity: .1;transform: translate(-50%,-50%) rotate(15deg);
}
.${[...node.querySelectorAll('*')].find(e => String(e.className).includes('header'))?.className}, .${[...node.querySelectorAll('*')].find(e => String(e.className).includes('subheader'))?.className} {
    font-family: Titan One;
    color:white;
    text-shadow: .1em .1em 0 rgba(0,0,0,0.4), 0 0 .2em rgba(0,0,0,0.2);
}
                `;
                document.head.appendChild(style);
                window.app.dataset.backgroundInjected = "true"
            }
            if (typeof node.className == 'string' && node.className.includes("pageSelected") && window.location.href.includes("blookedex=true") && node.href == "https://dashboard.blooket.com/my-sets") {
                window.app.dataset.selectedClasses = node.className
                node.classList.forEach(c => c.includes('pageSelected') && node.classList.remove(c));
                node.style = ""//"width:500px;height:100px;background:var(--blookedex-primary);border: solid 6px hsla(0, 0%, 100%, .2); border-radius:5px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:26px;perspective: 300px;";
                node.addEventListener('click', function() {
                    window.location.href = "/my-sets";
                });
                node.childrenNodes[0].style = ""
                node.childrenNodes[1].style = ""
            }
            if (node.children.length) {
                Array.from(node.children).forEach(walkAndFix);
            }
        }
    };

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(walkAndFix);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run on current elements
    document.querySelectorAll('*').forEach(correctColor);
    applyBackground();
})();