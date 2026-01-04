// ==UserScript==
// @name        Forward Slack messages, files, and Later items to channels and threads using an invisible link
// @namespace   Violentmonkey Scripts
// @match       *://app.slack.com/client/*
// @grant       none
// @version     1.11.4
// @author      CyrilSLi
// @description This script enhances Slack's forwarding functionality and bypasses the built-in button's inability to forward to threads. It works for top-level and threaded messages, canvases, lists, files, and Later items which have no built-in way of copying links to them. Set which message or file to forward by clicking the fast forward icon beside it, then click the rewind button in an input area to insert an invisible link to that item. Right-click the rewind button to clear the set item.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526439/Forward%20Slack%20messages%2C%20files%2C%20and%20Later%20items%20to%20channels%20and%20threads%20using%20an%20invisible%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/526439/Forward%20Slack%20messages%2C%20files%2C%20and%20Later%20items%20to%20channels%20and%20threads%20using%20an%20invisible%20link.meta.js
// ==/UserScript==

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("cdn_fallback") != null) {
    urlParams.delete("cdn_fallback");
    const paramStr = urlParams.toString();
    history.replaceState({}, "", window.location.origin + window.location.pathname + (paramStr.length ? "?" + paramStr : ""));
    window.location.reload();
}

function recurseClass(el, classNames, blacklist = []) {
    var parentEl = el.parentNode;
    if (typeof classNames === "string") {
        classNames = [classNames];
    }
    while (!classNames.some((name) => parentEl.classList.contains(name))) {
        if (blacklist.some((cls) => parentEl.classList.contains(cls))) {
            return null;
        }
        parentEl = parentEl.parentNode;
        if (parentEl == document.body) {
            return null;
        }
    }
    return parentEl;
}

const inputBtnId = "userscriptForwardMsgInput";
const inputSpanId = "userscriptForwardMsgInputSpan";
const reactBtnId = "userscriptForwardMsgReact";
const tooltip = "Link Forward";
var fwdLink = "";

const inputDivider = document.createElement("span");
inputDivider.className = inputSpanId + " c-wysiwyg_container__footer_divider";

const inputBtn = document.createElement("button");
inputBtn.className = inputBtnId + " c-button-unstyled c-icon_button c-icon_button--size_small c-wysiwyg_container__button c-wysiwyg_container__button--workflows c-icon_button--default";
inputBtn.setAttribute("tabindex", "0");
inputBtn.setAttribute("aria-label", tooltip);
inputBtn.setAttribute("delay", "500");
inputBtn.setAttribute("type", "button");
inputBtn.setAttribute("title", tooltip);
inputBtn.innerHTML = `
    <svg style="width: 1em; height: 1em; --s: 18px; pointer-events: none;" data-s7u="true" data-qa="rewind" aria-hidden="true" viewBox="0 0 16 16" class="">
        <path d="M9.196 8 15 4.633v6.734zm-.792-.696a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z"/>
        <path d="M1.196 8 7 4.633v6.734zm-.792-.696a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z"/>
    </svg>
`;

const reactBtn = document.createElement("button");
reactBtn.className = reactBtnId + " c-button-unstyled c-icon_button c-icon_button--size_small c-message_actions__button c-icon_button--default";
reactBtn.setAttribute("aria-label", tooltip);
reactBtn.setAttribute("type", "button");
reactBtn.setAttribute("title", tooltip);
reactBtn.innerHTML = `
    <svg style="width: 1em; height: 1em; --s: 18px; pointer-events: none;" data-s7u="true" data-qa="forward" aria-hidden="true" viewBox="0 0 16 16" class="">
        <path d="M6.804 8 1 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
        <path d="M14.804 8 9 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
    </svg>
`;

function setFwdLink(ev) {
    var parentEl = recurseClass(ev.target, "c-wysiwyg_container");
    var firstLine = [...document.getElementsByClassName("ql-editor")].filter(el => parentEl.contains(el))[0].children[0];
    const linkHTML = `<a href="${fwdLink}" rel="noopener noreferrer" target="_blank">&NoBreak;</a>`;
    firstLine.innerHTML = firstLine.innerHTML === "<br>" ? linkHTML : linkHTML + firstLine.innerHTML;
}

function clearFwdLink(ev) {
    ev.preventDefault();
    fwdLink = "";
    run();
    return false;
}

function getFwdLink(ev, className, targetEl = null) {
    ev.preventDefault();
    ev.stopPropagation();
    const target = targetEl ?? ev.target;
    function getLinkById() {
        var fileId = recurseClass(target, "c-virtual_list__item").id;
        _fwdLink = `https://files.slack.com/files-pri/${workspace}-${fileId}`;
    }
    const workspace = window.location.pathname.match(/(client\/)(T|E[0-9A-Z]+?)(\/|$)/)[2];
    if (className == "p-saved_item__actions") {
        var savedId = recurseClass(target, "c-virtual_list__item").id;
        if (savedId.startsWith("F")) {
            _fwdLink = `https://files.slack.com/files-pri/${workspace}-${savedId}`;
        } else {
            savedId = savedId.split("-");
            _fwdLink = `https://app.slack.com/archives/${savedId[0]}/p${savedId[1].split("_")[0].replace(".", "")}`;
        }
    } else if (className == "p-activity_ia4_page__item__actions") {
        var activityId = recurseClass(target, "c-virtual_list__item").id;
        if (activityId.includes("bot_dm_bundle-")) {
            target.style.display = "none";
            _fwdLink = "";
            return;
        } else {
            activityId = activityId.split("-").slice(1);
            _fwdLink = `https://app.slack.com/archives/${activityId[0]}/p${activityId[1].split("_")[0].replace(".", "")}`;
        }
    } else if (window.location.pathname.endsWith("/canvases") || window.location.pathname.endsWith("/lists") || window.location.pathname.endsWith("/files")) {
        getLinkById();
    } else {
        var timestampEl = recurseClass(target, "c-message_kit__actions");
        if (timestampEl !== null) {
            const timestamp = timestampEl.querySelector("a.c-timestamp");
            if (timestamp) {
                _fwdLink = timestampEl.querySelector("a.c-timestamp").href;
            } else {
                timestampEl = recurseClass(timestampEl, "p-pinned_message");
                if (timestampEl !== null) {
                    _fwdLink = timestampEl.querySelector("a.c-timestamp").href;
                } else {
                    console.error("Unable to find timestamp link of message", timestampEl);
                }
            }
        } else {
            getLinkById();
        }
    }
    if (targetEl) {
        return _fwdLink;
    } else {
        ev.target.firstElementChild.style.filter = "invert(0.15) sepia(1) saturate(100)";
        setTimeout(() => ev.target.firstElementChild.style.filter = "", 1000);
        fwdLink = _fwdLink;
        run();
    }
}

const topNavBtns = [{
    id: "_userscriptRevealChannelsButton",
    title: "Reveal private channel IDs",
    onclick: revealChannels,
    html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
        </svg>
    `
}];

function run() {
    [...document.getElementsByClassName("c-texty_buttons")].forEach((inputRow) => {
        if (fwdLink) {
            if (!inputRow.getElementsByClassName(inputBtnId)[0]) {
                inputRow.appendChild(inputDivider.cloneNode(true));
                msgInput = inputBtn.cloneNode(true);
                msgInput.addEventListener("click", setFwdLink);
                msgInput.addEventListener("contextmenu", clearFwdLink, false);
                inputRow.appendChild(msgInput);
            }
        } else {
            if (inputRow.getElementsByClassName(inputBtnId)[0]) {
                inputRow.getElementsByClassName(inputBtnId)[0].remove();
                inputRow.getElementsByClassName(inputSpanId)[0].remove();
            }
        }
    });
    ["c-message_actions__group", "p-saved_item__actions", "p-activity_ia4_page__item__actions"].forEach((className) => {
        if (document.getElementsByClassName(className)[0]) {
            [...document.getElementsByClassName(className)].forEach((el) => {
                if (!el.getElementsByClassName(reactBtnId)[0]) {
                    msgReact = reactBtn.cloneNode(true);
                    msgReact.addEventListener("click", (ev) => {getFwdLink(ev, className)});
                    el.insertBefore(msgReact, el.lastChild);
                }
            })
        }
    });
    topNavBtns.forEach((btn) => {
        if (!document.getElementById(btn.id)) {
            const navBtn = document.createElement("button");
            navBtn.className = "c-button-unstyled p-top_nav__button";
            navBtn.id = btn.id;
            navBtn.title = btn.title;
            navBtn.innerHTML = btn.html;
            navBtn.addEventListener("click", btn.onclick);
            const topNav = document.getElementsByClassName("p-ia4_top_nav__right_container")[0];
            topNav.insertBefore(navBtn, topNav.firstChild);
        }
    });
}

var _userscriptChannelLinks = {};
function revealChannels() {
    const messages = [...document.querySelectorAll(".c-message_kit__message .c-missing_channel--private")];
    let count = 0, errors = 0;
    if (!messages.some((el) => {
        const msgURL = getFwdLink(new Event("click"), "", el);
        const msgEl = recurseClass(el, "c-message_kit__message", ["c-message_attachment", "c-message__broadcast_preamble"]);
        if (!msgEl || !recurseClass(msgEl, ["p-view_contents--primary", "p-view_contents--secondary"], ["p-view_contents--sidebar"])) {
            return false;
        }
        const linkEls = [...msgEl.querySelectorAll(".c-mrkdwn__channel, .c-missing_channel--private")].filter(
            (link) => recurseClass(link, "c-message_kit__message", ["c-message_attachment", "c-message__broadcast_preamble"])
        );
        const msgIndex = linkEls.indexOf(el);
        if (links = _userscriptChannelLinks[msgURL]) {
            if (links.length <= msgIndex) {
                console.error("Private channel link out of bounds", {
                    "Out-of-bounds Link": el,
                    "Link Text": links,
                    "Link Elements": linkEls
                });
                el.lastChild.nodeValue = "Script Error";
                errors++;
            } else {
                el.lastChild.nodeValue = links[msgIndex];
                count++;
            }
        } else {
            unfurl(msgURL);
            return true;
        }
    })) {
        window.alert(`Revealed ${count} private channel ID(s) from ${messages.length} total` + (
            errors > 0 ? `\nError: ${errors} link(s) out of bounds, see console errors for more information` : ""
        ));
    }
};

function unfurl(url) {
    const editor = document.getElementsByClassName("ql-editor")[0].children[0];
    const origXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.send = function(body) {
        if (body instanceof FormData && body.get("url") == url) {
            this.addEventListener("load", () => {
                if (!this.responseURL.includes("slack.com/api/chat.unfurlLink")) {
                    return;
                }
                unsafeWindow.XMLHttpRequest.prototype.send = origXHRSend;
                channelLinks = [];
                function walk(obj) {
                    if (obj.constructor == Object) {
                        if (obj.type == "channel") {
                            channelLinks.push(obj.channel_id);
                        } else {
                            Object.values(obj).forEach(walk);
                        }
                    } else if (obj.constructor == Array) {
                        obj.forEach(walk);
                    }
                }
                const msgJSON = Object.values(JSON.parse(this.responseText).attachments)[0];
                if (msgJSON.message_blocks) {
                    walk(msgJSON);
                } else if (msgJSON.text) {
                    console.warn(`Using "text" instead of "message_blocks" to reveal private channels in message ${url}`);
                    channelLinks = Array.from(msgJSON.text.matchAll(/(?<=<#)C[0-9A-Z]+?(?=\|?>)/g), (match) => match[0]);
                }
                _userscriptChannelLinks[url] = channelLinks;
                if (linkEl = document.getElementById("_userscriptUnfurlLink")) {
                    linkEl.remove();
                }
                window.setTimeout(revealChannels, 100);
            });
        }
        return origXHRSend.apply(this, arguments);
    };
    editor.innerHTML = `<a href="${url}" rel="noopener noreferrer" target="_blank" id="_userscriptUnfurlLink">&NoBreak;</a>` + editor.innerHTML;
};

const observer = new MutationObserver((muts) => {
    ["p-view_contents--primary", "p-view_contents--secondary", "c-search__container", "p-view_contents--theme-surf-ter"].some((className) => (
        document.getElementsByClassName(className)[0] &&
        document.getElementsByClassName(className)[0].innerHTML &&
        setTimeout(run, 0)
    ));
});
observer.observe(document.body, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
});