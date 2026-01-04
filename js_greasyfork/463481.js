// ==UserScript==
// @name        work.ink bypasser
// @namespace   lemons
// @match       https://*.work.ink/*
// @match       https://workink.click/*
// @match       *://*/direct/?*
// @grant       none
// @icon        https://work.ink/favicon.ico
// @license     GPLv3.0-or-later
// @version     1.0.6
// @resource    NOTYF_CSS https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css
// @require     https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @author      lemons
// @description Automatically does work.ink steps.
// @noframes
// @run-at      document-end
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463481/workink%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/463481/workink%20bypasser.meta.js
// ==/UserScript==

const notyfCss = GM_getResourceText("NOTYF_CSS");
GM_addStyle(notyfCss);
const notyf = new Notyf({ duration: 5000 });

(async () => {
    if (window.location.hostname.includes("r.")) window.location.hostname = window.location.hostname.replace("r.", "");
    if (window.location.hostname === "work.ink") {
        const [encodedUserId, linkCustom] = decodeURIComponent(window.location.pathname.slice(1)).split("/").slice(-2);
        const BASE = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const loopTimes = encodedUserId.length;
        let decodedUserId = BASE.indexOf(encodedUserId[0]);
        for (let i = 1; i < loopTimes; i++) decodedUserId = 62 * decodedUserId + BASE.indexOf(encodedUserId[i]);

        const payloads = {
            social: (url) => JSON.stringify({
                type: "c_social_started",
                payload: {
                    url
                }
            }),
            readArticles: {
                1: JSON.stringify({
                    type: "c_monetization",
                    payload: {
                        type: "readArticles",
                        payload: {
                            event: "start"
                        }
                    }
                }),
                2: JSON.stringify({
                    type: "c_monetization",
                    payload: {
                        type: "readArticles",
                        payload: {
                            event: "closeClicked"
                        }
                    }
                })
            },
            browserExtension: {
                1: JSON.stringify({
                    type: "c_monetization",
                    payload: {
                        type: "browserExtension",
                        payload: {
                            event: "start"
                        }
                    }
                }),
                2: (token) => JSON.stringify({
                    type: "c_monetization",
                    payload: {
                        type: "browserExtension",
                        payload: {
                            event: "confirm",
                            token
                        }
                    }
                })
            }
        }

        WebSocket.prototype.oldSendImpl = WebSocket.prototype.send;
        WebSocket.prototype.send =
            function (data) {
                this.oldSendImpl(data);
                    this.addEventListener(
                        "message",
                        async (e) => {
                            const sleep = ms => new Promise(r => setTimeout(r, ms));
                            const data = JSON.parse(e.data);
                            if (data.error) return;
                            const payload = data.payload;

                            switch (data.type) {
                                case "s_link_info":
                                    notyf.success("got link info")
                                    if (payload.socials) socials.push(...payload.socials);
                                    const monetizationTypes = ["readArticles", "browserExtension"];
                                    for (const type of monetizationTypes) {
                                        if (payload.monetizationScript.includes(type)) {
                                            activeMonetizationTypes.push(type)
                                        }
                                    }
                                    break;
                                case "s_start_recaptcha_check":
                                    this.oldSendImpl(payloads.captcha);
                                    break;
                                case "s_recaptcha_okay":
                                    if (socials.length) {
                                        for (const [index, social] of socials.entries()) {
                                            notyf.success(`performing social #${index+1}`)
                                            this.oldSendImpl(payloads.social(social.url));
                                            await sleep(3 * 1000);
                                        }
                                    }

                                    if (activeMonetizationTypes.length) {
                                        for (const type of activeMonetizationTypes) {
                                            switch (type) {
                                                case "readArticles":
                                                    notyf.success("reading articles...")
                                                    this.oldSendImpl(payloads.readArticles["1"]);
                                                    this.oldSendImpl(payloads.readArticles["2"]);
                                                    break;
                                                case "browserExtension":
                                                    notyf.success("skipping browser extension step")
                                                    if (activeMonetizationTypes.includes("readArticles")) await sleep(11 * 1000);
                                                    this.oldSendImpl(payloads.browserExtension["1"])
                                                    break;
                                            }
                                        }
                                    }
                                    break;
                                case "s_monetization":
                                    if (payload.type !== "browserExtension") break;
                                    this.oldSendImpl(payloads.browserExtension["2"](payload.payload.token))
                                    break;
                                case "s_link_destination":
                                    notyf.success("done!")
                                    const url = new URL(payload.url);
                                    localStorage.clear(window.location.href);
                                    if (url.searchParams.has("duf")) {
                                        window.location.href = window.atob(url.searchParams.get("duf").split("").reverse().join(""))
                                    };
                                    window.location.href = payload.url;
                                    break;
                            }
                        },
                        false
                    );
                this.send =
                    function (data) {
                        this.oldSendImpl(data);
                    };
            }
            notyf.success("patched websocket")
        let socials = [];
        let activeMonetizationTypes = [];
    } else if (window.location.hostname == "workink.click") {
        const uuid = new URLSearchParams(window.location.search).get("t")
        fetch(`https://redirect-api.work.ink/externalPopups/${uuid}/pageOpened`);
        await new Promise(r => setTimeout(r, 11 * 1000));
        const { destination } = await fetch(`https://redirect-api.work.ink/externalPopups/${uuid}/destination`).then(r => r.json());
        const url = new URL(destination);
        if (url.searchParams.has("duf")) {
            window.location.href = window.atob(url.searchParams.get("duf").split("").reverse().join(""))
        };
        window.location.href = destination;
        notyf.success("wait 11 seconds")
    } else {
        if (new URL(window.location.href).searchParams.has("duf")) {
            var link = document.createElement("a");
            link.referrerPolicy = "no-referrer";
            link.rel = "noreferrer";

            link.href = window.atob(new URL(window.location.href).searchParams.get("duf").split("").reverse().join(""));
            link.click();
        };
    }
})();