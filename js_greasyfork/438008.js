// ==UserScript==
// @name            Tellonym.me Guest
// @name:de         Tellonym.me Gast
// @version         1.1.0
// @description     Load tellonym.me Tells without Login
// @description:de  Lade tellonym.me Tells ohne Anmeldung
// @icon            https://www2.tellonym.me/assets/img/icon64x64.png
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/tellonym.me-guest
// @supportURL      https://github.com/TalkLounge/tellonym.me-guest/issues
// @license         MIT
// @match           https://tellonym.me/*
// @require         https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js
// @require         https://cdn.jsdelivr.net/npm/luxon@2.3.0/build/global/luxon.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/438008/Tellonymme%20Guest.user.js
// @updateURL https://update.greasyfork.org/scripts/438008/Tellonymme%20Guest.meta.js
// ==/UserScript==

/*
Text Examples:

Context, Comments & Sender: https://tellonym.me/avgx.wvmx/answer/4468890875
Image: https://tellonym.me/avgx.wvmx/answer/4196788015
*/

(function () {
    'use strict';
    let initInterval, ul, user, pos, scrollLoading, initTimeout, scrollEnded, url;

    async function loadTells() {
        let data = await axios.get(`https://api.tellonym.me/profiles/name/${user}?limit=25&pos=${pos}`);
        data = data.data;
        const answers = data.answers;

        if (!answers.length) {
            scrollEnded = true;
            return;
        }

        for (let i = 0; i < answers.length; i++) {
            if (answers[i].type == "AD") { // Do not display ads
                continue;
            }

            console.log("[Tellonym.me Guest]", answers[i]);

            pos++;
            ul.insertAdjacentHTML("beforeend", `<div style="background-color: white; padding: 16px; border-radius: 8px; margin-bottom: 8px" id="${answers[i].id}">
                <a style="float: right; text-decoration: none; color: black" href="https://tellonym.me/${user}/answer/${answers[i].id}" target="_blank">
                    <i class="icon-share"></i>
                </a>
                <div style="display: flex; align-items: center">
                    <div>
                        <img style="height: 38px; border-radius: 8px" src="https://userimg.tellonym.me/xs-v2/${data.avatarFileName}">
                    </div>
                    <div style="margin-left: 12px">
                        <span style="font-weight: bold; font-size: 14px">${user}</span>
                        ${(() => { // Verified
                    if (data.isVerified) {
                        return `<img style="filter: invert(39%) sepia(88%) saturate(1949%) hue-rotate(191deg) brightness(100%) contrast(105%); height: 12px" src="https://www2.tellonym.me/assets/img/verified.png">`;
                    }

                    return "";
                })()}
                        <br>
                        <span style="color: grey; font-size: 12px">${luxon.DateTime.fromISO(answers[i].createdAt).toRelative()}</span>
                    </div>
                </div>
                ${(() => { // Context
                    if (answers[i].parent) {
                        return `<div style="margin-top: 12px" class="context">
                        <a style="background-color: rgb(243, 243, 243); border-radius: 10px; padding: 2px 10px; font-size: 12px; text-decoration: none; color: black; display: block; max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; width: min-content" href="https://tellonym.me/${user}/answer/${answers[i].parent.id}" target="_blank">${answers[i].parent.content}</a>
                    </div>`;
                    }

                    return "";
                })()}
                <div style="border-left: 3px solid rgb(136, 137, 143); margin-top: 12px">
                    <div style="margin-left: 12px; display: flex">
                        ${(() => { // Sender
                    if (answers[i].sender?.username) {
                        return `<a style="text-decoration: none; color: black; margin-top: 1px" href="https://tellonym.me/${answers[i].sender.username}" target="_blank">
                                <div style="display: inline-block">
                                    <img style="height: 16px; border-radius: 4px; margin-right: 4px" src="https://userimg.tellonym.me/xs-v2/${answers[i].sender.avatarFileName}">
                                </div>
                                <span style="font-weight: bold; font-size: 14px; margin-right: 4px; vertical-align: top">${answers[i].sender.username}</span>
                            </a>`;
                    }

                    return "";
                })()}
                        <span>${answers[i].tell}</span>
                    </div>
                </div>
                <div style="margin-top: 12px">
                    <span>${answers[i].answer}</span>
                </div>
                ${(() => { // Media
                    let inject = "";

                    for (let j = 0; j < answers[i].media.length; j++) {
                        if (answers[i].media[j].type == 0) {
                            inject += `<div style="margin-top: 12px">
                            <a href="${answers[i].media[j].url}" target="_blank">
                                <img src="${answers[i].media[j].thumbUrl}">
                            </a>
                        </div>`;
                        }

                        if (answers[i].media[j].type != 0 || !answers[i].media[j].url.endsWith(".jpg")) {
                            alert("[Tellonym.me Guest Userscript]\n\nCongratulations, you have found a tell with media files that the userscript doesn't currently support.\nWith your help I can implement this in the userscript.\nTherefore I kindly ask you to report this URL\n\nhttps://tellonym.me/${user}/answer/${answers[i].id}\n\nto one of these:\n\nhttps://github.com/TalkLounge/tellonym.me-guest/issues\n\nhttps://greasyfork.org/de/scripts/438008-tellonym-me-guest/feedback\n\nMail to talklounge@yahoo.de\n\n\nThank you so much!");
                        }
                    }

                    return inject;
                })()}
                <div style="margin-top: 12px">
                    <div style="width: 32px; display: inline-block">
                        <img style="height: 22px" src="https://www2.tellonym.me/assets/img/reactions/heart_unfilled.png">
                    </div>
                    <div style="width: 32px; display: inline-block">
                        <img style="height: 22px" src="https://www2.tellonym.me/assets/img/reactions/crying_unfilled.png">
                    </div>
                    <div style="width: 32px; display: inline-block">
                        <img style="height: 22px" src="https://www2.tellonym.me/assets/img/reactions/laugh_unfilled.png">
                    </div>
                </div>
                ${(() => { // Comments
                    let comments = "";

                    if (answers[i].comments?.previews?.length) {
                        for (let j = 0; j < answers[i].comments.previews.length; j++) {
                            comments += `<div style="margin-top: 12px; display: flex; align-items: center">
                            <a style="text-decoration: none; color: black; display: flex; margin-top: 1px" href="https://tellonym.me/${answers[i].comments.previews[j].user.username}" target="_blank">
                                <div style="height: 22px">
                                    <img style="height: 22px; border-radius: 4px; margin-right: 8px" src="https://userimg.tellonym.me/xs-v2/${answers[i].comments.previews[j].user.avatarFileName}">
                                </div>
                                <span style="font-weight: bold; font-size: 14px; align-self: center">${answers[i].comments.previews[j].user.username}</span>
                            </a>
                            <span style="margin-left: 4px">${answers[i].comments.previews[j].content}</span>
                        </div>`;
                        }
                    }

                    return comments;
                })()}
            </div>`);

            [...document.querySelectorAll(`.context a[href^="https://tellonym.me/${user}/answer/${answers[i].id}"]`)].forEach(item => { item.href = `#${answers[i].id}`; item.target = ""; }); // Skip to context instead of opening, when loaded already

            if (answers[i].likesCount || answers[i].likes?.count) {
                alert(`[Tellonym.me Guest Userscript]\n\nCongratulations, you have found a tell with likes that the userscript doesn't currently support.\nWith your help I can implement this in the userscript.\nTherefore I kindly ask you to report this URL\n\nhttps://tellonym.me/${user}/answer/${answers[i].id}\n\nto one of these:\n\nhttps://github.com/TalkLounge/tellonym.me-guest/issues\n\nhttps://greasyfork.org/de/scripts/438008-tellonym-me-guest/feedback\n\nMail to talklounge@yahoo.de\n\n\nThank you so much!`);
            }
        }
    }

    async function onScroll() { // Load new tells, if near page end
        const last10 = ul.childNodes[ul.childNodes.length - 10]; // 10th last child
        if (last10.getBoundingClientRect().top <= document.body.clientHeight && !scrollLoading && !scrollEnded) {
            scrollLoading = true;

            await loadTells();

            scrollLoading = undefined;
        }
    }

    async function init() {
        ul = [...document.querySelectorAll("img[src^='https://user']")].reverse()[0]; // Last custom profile picture in tell
        ul = ul || [...document.querySelectorAll("svg[height='38']")].reverse()[0]?.parentNode; // Last generic profile picture in tell

        if (!ul) {
            initTimeout++;

            if (initTimeout >= 20) { // Timeout after 5 seconds (4 per second * 5 = 20)
                console.log("[Tellonym.me Guest]", "Page Timeout");
                window.clearInterval(initInterval);
            }

            return;
        }

        window.clearInterval(initInterval);

        ul = ul.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        console.log(ul);

        await new Promise(r => setTimeout(r, 250)); // Thanks to https://stackoverflow.com/a/39914235
        [...ul.childNodes].splice(1).forEach(item => item.remove()); // Remove initial loaded tells

        user = window.location.pathname.split("/")[1];

        await loadTells();

        window.addEventListener("scroll", onScroll);

        for (let i = 0; i < 20; i++) {
            document.querySelector("img[src*=appstore]")?.parentNode.parentNode.parentNode.parentNode.parentNode.remove(); // Remove Appstore Banner
            await new Promise(r => setTimeout(r, 500));
        }
    }

    function checkNavigate() {
        if (url == window.location.origin + window.location.pathname) { // Not navigated
            return;
        }

        url = window.location.origin + window.location.pathname;

        if (["/search", "/login"].includes(window.location.pathname)) { // Not a user profile
            return;
        }

        // Reset variables
        pos = 0;
        scrollLoading = undefined;
        initTimeout = 0;
        scrollEnded = undefined;

        initInterval = window.setInterval(init, 250);
    }

    checkNavigate();
    window.setInterval(checkNavigate, 1000);
})();