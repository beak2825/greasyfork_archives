// ==UserScript==
// @name         imgsrc download
// @namespace    http://imgsrc.ru/
// @version      2020.12.12
// @description  Download imgsrc.ru with ctrl+D
// @author       Anonymous
// @match        http://imgsrc.ru/*
// @match        https://imgsrc.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387143/imgsrc%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/387143/imgsrc%20download.meta.js
// ==/UserScript==

const imgsrcExtensionVersion = "2020.12.07a"

function logMessage(msg) {
    console.log(`${new Date().toLocaleTimeString('en-us', { hour12: false })}: ${msg}`)
}

class KeyPressEvent {
    constructor(event) {
        this.e = event;
    }

    isCtrl(keyString) {
        return this.e.ctrlKey && this.e.key.toLowerCase() == keyString.toLowerCase();
    }

    isCtrlShift(keyString) {
        return this.e.ctrlKey && this.e.shiftKey && this.e.key.toLowerCase() == keyString.toLowerCase();
    }

    isAlt(keyString) {
        return this.e.altKey && this.e.key.toLowerCase() == keyString.toLowerCase();
    }

    is(keyString) {
        return this.e.key.toLowerCase() == keyString.toLowerCase();
    }

    isSpaceKey() {
        return this.e.keyCode == 32;
    }

    isEnterKey() {
        return this.e.keyCode == 13;
    }

    isNumKey() {
        return this.e.key.match(/^\d$/);
    }

    isCtrlNum() {
        return this.e.ctrlKey && this.e.key.match(/^\d$/);
    }

    getKeyCombo() {
        let keycombo = (this.e.ctrlKey && this.e.key != "Control" ? "Ctrl-" : "") +
            (this.e.altKey && this.e.key != "Alt" ? "Alt-" : "") +
            (this.e.shiftKey && this.e.key != "Shift" ? "Shift-" : "") +
            this.e.key;
        return keycombo;
    }

    log() {
        logMessage("Pressed " + this.getKeyCombo());
    }

    blockUntil(ms) {
        let keycombo = this.getKeyCombo();
        if (window.keyPressBlocked == undefined) {
            window.keyPressBlocked = {};
        }
        window.keyPressBlocked[keycombo] = true;
        window.setTimeout(() => { window.keyPressBlocked[keycombo] = false }, ms);
    }

    isBlocked() {
        let keycombo = this.getKeyCombo();
        return window.keyPressBlocked && window.keyPressBlocked[keycombo];
    }
}

class ImgsrcPage {
    constructor() {
        this.location = window.location;
        this.href = window.location.href;
        this.domain = window.location.host;
        this.path = window.location.pathname;
        this.search = window.location.search;
        this.id = window.location.hash.substring(1);

        if (this.path == "/main/search.php" || this.path.match("/cat/")) {
            if (this.search.match(/love=true/i)) {
                this.isFaves = true;
                this.name = "Favorites"
            } else {
                this.isSearch = true;
                this.name = "Search"
            }
        } else if (this.path == "/main/user.php") {
            this.isTape = this.isUserpage = true;
            this.name = "User Page"
        } else if (this.path == "/main/tape.php") {
            this.isTape = this.isViewAll = true;
            this.name = "View All"
            if (this.id) {
                this.name += " with id #" + this.id
            }
        } else if (this.path.match(/^\/[^/]+\/a?\d+\.html/i)) {
            this.isAlbum = true;
            this.name = "Album"
        } else if (this.path == "/members/") {
            this.isLanding = true;
            this.name = "Member Landing Page"
        } else if (this.path == "/main/login.php") {
            this.isTape = this.isLogin = true;
            this.name = "Login Prompt"
        } else if (this.path == "/main/warn.php") {
            this.isTape = this.isAgeCheck = true;
            this.name = "Age Check"
        } else if (this.path == "/main/passchk.php") {
            this.isTape = this.isPassCheck = true;
            this.name = "Album Password Check"
        }
    }

    getImgURL(options) {
        let anchorMoved
        if (options && options.anchorMoved) {
            anchorMoved = true
        } else {
            anchorMoved = false
        }
        try {
            let imgURL;
            if (this.isViewAll && this.id) {
                if (anchorMoved) {
                    imgURL = document.getElementById(this.id).getElementsByTagName("img")[0].src;
                } else {
                    imgURL = document.getElementById(this.id).nextElementSibling.getElementsByTagName("img")[0].src;
                }
            } else if (this.isViewAll) {
                imgURL = document.getElementsByClassName("big")[0].src;
            } else if (this.isAlbum) {
                imgURL = document.getElementById("bpi").src;
            } else {
                logMessage(`No img path defined for ${this.name}`);
            }
            return imgURL.replace(/\.webp$/i, ".jpg")
        } catch (e) {
            logMessage("Error finding img");
            return;
        }
    }

    log() {
        logMessage(`Current page is ${this.name} `);
    }
}

class HistoryStack {
    constructor(key) {
        this.key = key ? key : "imgsrcStack";
        let data = window.localStorage[this.key];
        this.stack = data ? JSON.parse(data) : [];
    }

    store(state) {
        window.localStorage[this.key] = JSON.stringify(
            state ? state : this.stack
        )
    }

    push(url) {
        if (!url) {
            url = window.location.href;
        }
        this.stack.push(url)
        if (this.stack.length > 10) {
            this.stack.shift()
        }
        this.store()
    }

    pop() {
        let url = this.stack.pop()
        this.store()
        return url
    }
}

(function () {
    'use strict';

    if (window.imgsrcLoaded) {
        console.log("Aborted loading extension version " + imgsrcExtensionVersion);
        return; // Detect multiple versions and abort if already loaded.
    } else {
        window.imgsrcLoaded = true;
    }

    console.log("Loaded extension version " + imgsrcExtensionVersion);
    let loadedPage = new ImgsrcPage();
    loadedPage.log();
    var anchorMoved = false;

    /* Make sure big images don't go off screen */
    document.head.innerHTML += "<style>img.big{max-height: 100vh !important}</style>"

    if (loadedPage.isSearch) { // Transform Search page to grid view and filter
        logMessage("Setting search grid css")
        document.head.innerHTML += "<style>.tdd td {display:inline-flex; display:flex}" +
            ".tdd tbody {display:flex; max-width:100vw; flex-wrap:wrap}" +
            ".nologo, .unveil50 {background-image:url(https://static.us.icdn.ru/images/nologo.png);" +
            "  height:unset!important; width:unset!important; background-size:unset!important;" +
            "  float:unset!important; display:block}" +
            ".tdd td:nth-child(1) {width:min-content; flex-direction:column; text-align:left}" +
            ".tdd td:nth-child(1) a {font-size:1.2em;}" +
            ".tdd TH {display:none}" +
            ".tdd TH:nth-child(1) {display:initial}" +
            ".tdd .uilt {display:initial}" +
            ".tdd br {display:none}" +
            ".hidden {display:none}</style>";

        let elems = document.getElementsByClassName("tdd")[0].getElementsByTagName("tr")

        let blacklist = [/boy'?s?z?\b/i, /\bbrother'?s?z?\b/i, /\bson'?s?\b/i, /\bnephew'?s?\b/i, /chubb(y|ie)/i, /\bfatt?(y|ie)s??\b/i]
        let whitelist = [/girl'?s?z?/i, /\bsister'?s?\b/i, /\bdau(ghter)?'?s?\b/i, /\bniece'?s?\b/i, /\bher'?s?\b/i, /pant(ie|y)/i, /upskirt/i]
        let highlight = [/pant(ie|y)[^h]/i, /upskirt/i, /upshort/i, /\b(summer)?camp(ing|ers?)?\b/i, /\bwet/i, /\bpee/i, /\byt/i, /youtube/i, /\boops/i,
            /hidden/i, /(web|spy|ip|security)cam/i, /cam(girl|whore|slut)s?/i, /\bspy/i];

        let authorBlacklist = [/conrad052/i, /spyonboyz/i, /otismeyer/i, /dad3boys/i, /ducman4988/i]
        let authorHighlight = [/pant(ie|y)[^h]/i, /upskirt/i]

        logMessage("Begin blacklisting")
        for (let e of elems) {
            let at = e.innerText.match(/([^:\s]+): (.*)/); // [match, author, title]
            if (!at) { continue; }
            let author = at[1];
            let title = at[2];
            for (let b of blacklist) {
                if (title.match(b)) {
                    e.classList.add("hidden")
                    console.log(`${at[0]}\n matches ${b}; blacklisted`)
                    for (let w of whitelist) {
                        if (title.match(w)) {
                            e.classList.remove("hidden")
                            console.log(` but also matches ${w}; whitelisted`)
                            break;
                        }
                    }
                    break;
                }
            }
            for (let b of authorBlacklist) {
                if (author.match(b)) {
                    e.classList.add("hidden")
                    console.log(`${at[0]}\n matches ${b}; blacklisted`)
                    break;
                }
            }
            for (let w of highlight) {
                if (title.match(w)) {
                    e.style.border = "gold dotted"
                    console.log(`${at[0]}\n matches ${w}; highlighted`)
                    break;
                }
            }
            for (let w of authorHighlight) {
                if (author.match(w)) {
                    e.style.border = "gold dotted"
                    console.log(`${at[0]}\n matches ${w}; highlighted`)
                    break;
                }
            }
            logMessage("Finished blacklisting")
        }
    }

    if (loadedPage.isViewAll) {
        console.log("setting IDs");
        for (let anchor of document.querySelectorAll("a[id]")) {
            anchor.nextElementSibling.id = anchor.id
            anchor.id = ""
        }
        console.log("IDs set");
        anchorMoved = true;
    }

    if (loadedPage.isFaves) { // Save Favorite Users as Map in Local Storage
        let favoriteUsers = {};
        for (let a of document.getElementsByTagName("a")) {
            if (a.href) {
                let m = a.href.match(/https:\/\/imgsrc\.ru\/main\/user.php\?user=([\d\w-_.]+)/i);
                if (m) {
                    favoriteUsers[m[1]] = true;
                }
            }
        }
        // eslint-disable-next-line dot-notation
        window.localStorage["imgsrcFavoriteUsers"] = JSON.stringify(favoriteUsers);
    }

    if (loadedPage.isUserpage) { // Add "add [user] to faves" button
        // eslint-disable-next-line dot-notation
        let favoriteUsers = window.localStorage["imgsrcFavoriteUsers"];
        let userMatch = window.location.search.match(/user=([\d\w-_.]+)/);
        if (favoriteUsers && userMatch) {
            favoriteUsers = JSON.parse(favoriteUsers);
            let username = userMatch[1];
            let favestring
            if (favoriteUsers[userMatch[1]]) {
                favestring = `<p>You \u{2764} ${username}</p>`;
            } else {
                favestring = `<p><a href="https://imgsrc.ru/members/fav.php?action=add&user=${username}">` +
                    `Add ${username} to \u{2764}</a></p>`;
            }
            let tdd = document.getElementsByClassName("tdd")[0]
            tdd.insertAdjacentHTML('beforebegin', favestring)
        }
    }

    if (loadedPage.isAgeCheck) {
        if (!window.location.search.match(/over18=yeah/i)) {
            window.location = window.location.href += "&over18=yeah"
        } else {
            console.error("Tried to redirect to +=&over18=yeah when it already exists in URL");
        }
    }

    if (loadedPage.isPassCheck) {
        loadedPage.passform = document.forms.passchk
        let table = loadedPage.passform
        while (table.tagName.toLowerCase() != "tbody") {
            table = table.parentElement;
        }
        table.insertAdjacentHTML("beforeend",
            '<tr><td colspan="2"><div id="passbtns"></div></td></tr>'
        )
        let passbtns = document.getElementById("passbtns")
        let samplePasswords = [
            { name: "EZ", pass: "12345" },
            { name: "ZE", pass: "54321" },
            { name: "EZE", pass: "123454321" },
            { name: "EZZE", pass: "1234554321" },
            { name: "EZ6", pass: "123456" }
        ]
        for (let i = 0; i < samplePasswords.length && i < 9; i++) {
            let name = samplePasswords[i].name
            let pass = samplePasswords[i].pass
            passbtns.insertAdjacentHTML("beforeend",
                `<button pass="${pass}" num="${i + 1}" title="${pass}" onclick="` +
                `passchk = document.forms.passchk; ` +
                `passchk.pwd.value='${pass}'; passchk.submit()` +
                `">${i + 1}: ${name}</button> `
            )
        }
    }

    /**** == Add keybindings == ****/
    onkeydown = function (e) {
        let key = new KeyPressEvent(e);
        if (key.isBlocked()) {
            console.warn("Captured blocked keypress" + key.getKeyCombo())
            return;
        }
        key.log()
        let page = new ImgsrcPage();

        /**** ^S or ^D ****/
        if (key.isCtrl('S') || key.isCtrl('D')) {
            console.log("^S Captured")
            key.blockUntil(300) // Prevent multiple keypresses from faulty mice
            let source;
            let newWindow = true;
            page.log()

            source = page.getImgURL({ anchorMoved: anchorMoved })
            if (page.isViewAll) {
                // leave newWindow = true
            } else if (page.isAlbum) {
                if (!e.shiftKey) {
                    newWindow = false;
                }
            }
            if (!source) {
                logMessage("No image node found")
                return;
            }
            if (source) {
                e.preventDefault();
                if (newWindow) {
                    window.newWindow = window.open(source, '_blank');
                } else {
                    window.location = source;
                }
            }
        }
        /**** Enter Key ****/
        else if (key.isEnterKey() || key.isSpaceKey()) {
            console.log("Enter Captured")
            let nextAnchor;
            if (page.isTape) {
                try {
                    if (page.id) {
                        if (anchorMoved) {
                            nextAnchor = document.getElementById(page.id).href
                        } else {
                            nextAnchor = document.getElementById(page.id).nextElementSibling.href
                        }
                    } else {
                        nextAnchor = document.getElementsByClassName("big")[0].parentElement.href;
                    }
                } catch (e) {
                    logMessage("Error finding img")
                    return;
                }
            } else if (page.isAlbum) {
                if (document.querySelector('input[value="Continue to album"]')) {
                    document.querySelector('input[value="Continue to album"]').click()
                    e.preventDefault();
                    return;
                }
                nextAnchor = document.querySelector('a[href*="tape.php"]')
            } else if (page.isLanding) {
                nextAnchor = "https://imgsrc.ru/main/search.php?love=true"
            }
            if (nextAnchor) {
                e.preventDefault();
                window.location = nextAnchor;
            }
        }
        /**** pipe key ****/
        else if (key.is('\\') || key.is('|')) {
            e.preventDefault();
            window.history.back()
        }
        /**** ^Z ****/
        else if (key.isCtrl("Z")) {
            key.blockUntil(200)
            window.open(new HistoryStack().pop(), '_blank');
        }
        /**** => ****/
        else if (key.is('ArrowRight')) {
            //?
        }
        /**** ctrl + num ****/
        else if (key.isCtrlNum()) {
            if (loadedPage.isPassCheck) {
                try {
                    document.querySelector(`#passbtns button[num="${e.key}"]`).click()
                    e.preventDefault();
                } catch (e) {
                    console.error(e)
                }
            }
        }
    };

    // eslint-disable-next-line no-unused-vars
    window.addEventListener('beforeunload', (_e) => {
        if (!loadedPage.isLogin) {
            new HistoryStack().push()
        }
        return null; // Chrome requires returnValue to be set.
    });
})();