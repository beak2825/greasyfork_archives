// ==UserScript==
// @name     Raw GIF buttons for GIPHY
// @version  1.1
// @grant    none
// @match    https://giphy.com/gifs/*
// @run-at   document-idle
// @author       HappyViking
// @namespace    happyviking
// @description  Adds buttons to copy the raw url of a gif on GIPHY, or visit the raw gif in the browser.
// @license MIT
// @icon https://giphy.com/static/img/giphy_logo_square_social.png
// @downloadURL https://update.greasyfork.org/scripts/471954/Raw%20GIF%20buttons%20for%20GIPHY.user.js
// @updateURL https://update.greasyfork.org/scripts/471954/Raw%20GIF%20buttons%20for%20GIPHY.meta.js
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));

//https://github.com/mlcheng/js-toast/blob/master/toast.min.js
!function (t) { "use strict"; function n(t, r) { var e = r; for (var i in t) e.hasOwnProperty(i) ? null !== t[i] && t[i].constructor === Object && (e[i] = n(t[i], e[i])) : e[i] = t[i]; return e } function r(t, n) { Object.keys(n).forEach((function (r) { t.style[r] = n[r] })) } var e = function () { var t, e, i = { SHOW: { "-webkit-transition": "opacity 400ms, -webkit-transform 400ms", transition: "opacity 400ms, transform 400ms", opacity: "1", "-webkit-transform": "translateY(-100%) translateZ(0)", transform: "translateY(-100%) translateZ(0)" }, HIDE: { opacity: "0", "-webkit-transform": "translateY(150%) translateZ(0)", transform: "translateY(150%) translateZ(0)" } }, a = { style: { main: { background: "rgba(0, 0, 0, .85)", "box-shadow": "0 0 10px rgba(0, 0, 0, .8)", "border-radius": "3px", "z-index": "99999", color: "rgba(255, 255, 255, .9)", "font-family": "sans-serif", padding: "10px 15px", "max-width": "60%", width: "100%", "word-break": "keep-all", margin: "0 auto", "text-align": "center", position: "fixed", left: "0", right: "0", bottom: "0", "-webkit-transform": "translateY(150%) translateZ(0)", transform: "translateY(150%) translateZ(0)", "-webkit-filter": "blur(0)", opacity: "0" } }, settings: { duration: 4e3 } }, o = []; function s(t, s, c) { var l = c || i; if (void 0 !== f()) o.push({ text: t, options: s, transitions: l }); else { var m = s || {}; (function (t, n, i) { !function (t, n) { var e = document.createElement("div"); "string" == typeof t && (t = document.createTextNode(t)); e.appendChild(t), d(e), r(f(), n) }(t, n.style.main); var a = f(); document.body.insertBefore(a, document.body.firstChild), a.offsetHeight, r(a, i.SHOW), clearTimeout(e), 0 !== n.settings.duration && (e = setTimeout((function () { return u(i) }), n.settings.duration)) })(t, m = n(a, m), l) } return { hide: function () { return u(l) } } } function u(t) { var n = f(); r(n, t.HIDE), clearTimeout(e), n.addEventListener("transitionend", c, { once: !0 }) } function c() { var t = f(); if (document.body.removeChild(t), d(void 0), o.length > 0) { var n = o.shift(); s(n.text, n.options, n.transitions) } } function f() { return t } function d(n) { t = n } return { toast: s } }(); t.mergeOptions = n, t.stylize = r, t.toast = e }(this.iqwerty = this.iqwerty || {});


const main = async () => {
    let contentWrapper = document.querySelector('div[class^="ContentWrapper"]');
    if (!contentWrapper) return

    //We sometimes have to try a few times before we get the gif (since we have to wait for it to load in)
    let gifWrapper = null;
    for (let attempt = 0; attempt < 10; attempt++) {
        gifWrapper = contentWrapper.querySelector("img")
        if (gifWrapper) break;
        await delay(500)
    }

    if (!gifWrapper) return

    const rawMediaLink = gifWrapper.src.replace(/media\d*\.giphy/, "i.giphy")

    let buttonContainer = document.querySelector('div[class^="ButtonDiv"]');
    if (!buttonContainer) return

    const linkButton = document.createElement("button")
    buttonContainer.prepend(linkButton)
    linkButton.appendChild(document.createTextNode("Copy Raw Link"))
    linkButton.onclick = () => {
        navigator.clipboard.writeText(rawMediaLink)
        iqwerty.toast.toast('Copied!', { settings: { duration: 1000 }, style: { main: { background: "purple" } } });
    }
    const linkButtonParent = document.createElement("div")
    linkButtonParent.appendChild(linkButton)

    const visitButton = document.createElement("button")
    buttonContainer.prepend(visitButton)
    visitButton.appendChild(document.createTextNode("Visit Raw Link"))
    visitButton.onclick = () => window.location.href = rawMediaLink
    const visitButtonParent = document.createElement("div")
    visitButtonParent.appendChild(visitButton)

    // Not working as intended, removed for now
    // const downloaderButton = document.createElement("button")
    // downloaderButton.appendChild(document.createTextNode("Download Raw GIF"))
    // const downloader = document.createElement("a")
    // downloader.download = "giphy"
    // downloader.href = rawMediaLink
    // downloader.appendChild(downloaderButton)
    // const downloaderParent = document.createElement("div")
    // downloaderParent.appendChild(downloader)

    buttonContainer.prepend(linkButtonParent)
    buttonContainer.prepend(visitButtonParent)
    // buttonContainer.prepend(downloaderParent)
}

main()