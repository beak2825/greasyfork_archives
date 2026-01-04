// ==UserScript==
// @name            MB: Artist Credit Splitter
// @namespace       https://rinsuki.net/
// @version         1.0.2
// @description     いい感じに MusicBrainz のアーティストクレジットを分割します (失敗することもあります)
// @author          rinsuki
// @match           https://musicbrainz.org/*
// @grant           none
// @contributionURL https://rinsuki.fanbox.cc/
// @contributionURL https://github.com/sponsors/rinsuki
// @homepageURL     https://github.com/rinsuki/userscripts
// @supportURL      https://github.com/rinsuki/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/450437/MB%3A%20Artist%20Credit%20Splitter.user.js
// @updateURL https://update.greasyfork.org/scripts/450437/MB%3A%20Artist%20Credit%20Splitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getReactProps(elem) {
        const properties = Object.getOwnPropertyNames(elem);
        const name = properties.find(x => x.startsWith("__reactProps$"));
        if (name != null)
            return elem[name];
    }

    const LOCALSTORAGE_KEY_COPIED_ARTIST_CREDIT = "copiedArtistCredit";
    function getArtistCreditClipboard() {
        const str = localStorage.getItem(LOCALSTORAGE_KEY_COPIED_ARTIST_CREDIT);
        if (str == null)
            return undefined;
        try {
            return JSON.parse(str);
        }
        catch (e) {
            console.warn("Failed to parse artist credit clipboard data", e);
            return undefined;
        }
    }
    function setArtistCreditClipboard(artistCredit) {
        localStorage.setItem(LOCALSTORAGE_KEY_COPIED_ARTIST_CREDIT, JSON.stringify(artistCredit));
    }

    function waitDOMByObserve(root, check, options) {
        const firstRes = check();
        if (firstRes != null)
            return Promise.resolve(firstRes);
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                const res = check();
                if (res != null) {
                    observer.disconnect();
                    resolve(res);
                }
            });
            observer.observe(root, {
                childList: true,
                subtree: options.subtree
            });
        });
    }

    function splitCredit(input) {
        const RE = /([ 　]*((?:CV|cv)[.:．：] *|[\(（]((?:CV|cv)[.:．：] *)?(?=[^)]{3,})|(?<=[^(]{3})[\)）]\/?|[、,\/／［］\[\]]|(?: & |＆)| feat[.: ．：　] *)[ 　]*)+/g;
        const splittedCredits = [];
        let lastIndex = 0;
        for (const match of input.matchAll(RE)) {
            splittedCredits.push([input.slice(lastIndex, match.index), match[0]]);
            lastIndex = match.index + match[0].length;
        }
        if (input.slice(lastIndex).length > 0)
            splittedCredits.push([input.slice(lastIndex), ""]);
        return splittedCredits;
    }

    (async () => {
        const bubble = await waitDOMByObserve(document.body, () => document.querySelector("#artist-credit-bubble"), { subtree: false });
        const buttons = await waitDOMByObserve(bubble, () => bubble.querySelector(".buttons"), { subtree: false });
        const button = document.createElement("button");
        button.type = "button";
        button.style.float = "left";
        button.textContent = "USERJS: Split Automatically";
        button.addEventListener("click", async () => {
            const props = getReactProps(bubble);
            console.log(props);
            if (props == null)
                return alert("Failed to get React container");
            const tbody = bubble.querySelector("tbody");
            if (tbody == null)
                return alert("Failed to get tbody");
            const dispatch = props.children[0].props.children.props.dispatch;
            dispatch({ type: "copy" });
            await new Promise(resolve => requestAnimationFrame(resolve));
            const currentCredit = getArtistCreditClipboard()?.names.map(name => name.name + (name.joinPhrase ?? "")).join("") ?? "";
            const splittedCredits = splitCredit(currentCredit);
            if (!confirm("次のように指定します。よろしいですか？\n\n" + JSON.stringify(splittedCredits, null, 4)))
                return;
            // localStorage.removeItem(LOCALSTORAGE_KEY_COPIED_ARTIST_CREDIT)
            // let p = waitLocalStorage(LOCALSTORAGE_KEY_COPIED_ARTIST_CREDIT)
            // props.copyArtistCredit()
            // await p
            // const stubArtistCredit = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_COPIED_ARTIST_CREDIT)!)
            setArtistCreditClipboard({ names: splittedCredits.map(([name, joinPhrase], i) => {
                    return {
                        joinPhrase,
                        name,
                        artist: null,
                        // artist: {
                        //     entityType: "artist",
                        //     uniqueID: stubArtistCredit[i].artist.uniqueID,
                        //     name,
                        // }
                    };
                }) });
            dispatch({ type: "paste" });
            alert("finish!");
        });
        buttons.appendChild(button);
    })();

})();
