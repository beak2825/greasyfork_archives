// ==UserScript==
// @name         GBF Friend Summon Exporter
// @version      20200306.1
// @description  Listens and Captures Friend Summon Data into LocalStorage
// @match        http://game.granbluefantasy.jp/
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://greasyfork.org/users/18331
// @downloadURL https://update.greasyfork.org/scripts/397450/GBF%20Friend%20Summon%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/397450/GBF%20Friend%20Summon%20Exporter.meta.js
// ==/UserScript==

// Constants
const DEBUG = false;
const COLUMN_SEPARATOR = "	";
const ROW_SEPARATOR = "\n";

// Utility Functions
const tryParseJSON = text => {
    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        if (e instanceof SyntaxError) {
            return text;
        }
        throw e;
    }
    return json;
};

const log = (...args) => {
    if (!DEBUG) return;
    console.debug("GFP", ...args);
};

const copyToClipboard = str => {
    // Source: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

// isOnFriendTab returns true if selected tab is Friends tab
const isOnFriendTab = () => {
    const display = document.querySelector("#frind").style.display;
    return display !== "none";
}

// getFriendDataById returns an object containing various data associated with a specific player id
const getFriendDataById = id => {
    const el = document.querySelector(`[data-location-href$='${id}'] + .prt-friend-detail`);
    const name = el.querySelector('.txt-name').textContent;
    const rank = el.querySelector('.txt-rank').textContent.match(/(\d+)/)[0];
    const lastActivity = el.querySelector('.prt-friend-login').textContent.split("Active: ")[1];
    return {
        name,
        rank,
        lastActivity,
    };
}

const customLoad = (xhr, ...args) => {
    const url = new URL(xhr.responseURL);
    const req = tryParseJSON(args[0]);
    const res = tryParseJSON(xhr.response);

    // Check for request path

    // Rank Friends Tab
    // Use this tab to delete localStorage
    if (url.pathname.indexOf('/friend/search/-1') >= 0) {
        log("» DELETE");
        localStorage.removeItem("friends");
        alert("Removed stored friends data");
        return;
    }

    // Search Page / Tab
    // Use this to export localStorage data in Tab-Separated Format
    if (url.pathname === "/friend/search") {
        log("» EXPORT");
        const friends = tryParseJSON(localStorage.friends) || {};
        const friendEntries = Object.entries(friends);
        let result = "";

        friendEntries.forEach(fe => {
            const playerId = fe[0];
            const friend = fe[1];
            friend.summons.forEach(summon => {
                result += playerId;
                result += COLUMN_SEPARATOR;
                result += friend.name;
                result += COLUMN_SEPARATOR;
                result += friend.rank;
                result += COLUMN_SEPARATOR;
                result += friend.lastActivity;
                result += COLUMN_SEPARATOR;
                result += summon.id;
                result += COLUMN_SEPARATOR;
                result += summon.level;
                result += COLUMN_SEPARATOR;
                result += summon.plusmark;
                result += COLUMN_SEPARATOR;
                result += summon.uncap;
                result += ROW_SEPARATOR;
            });
        });

        copyToClipboard(result);
        alert("Stored Friends data has been put in your clipboard; paste this in the Google Sheets.");
        return;
    }

    // Friend Details
    if (url.pathname.indexOf('/friend/friend_fixed_summon') < 0) return;
    log("» FOUND /friend/friend_fixed_summon request");

    // Abort if not on friends tab
    if (!isOnFriendTab()) return;
    log("» CONFIRMED to be on friends tab");

    // Parse response JSON
    // Notice that schema is a bit weird, roughly:
    // { "fixed_summon_list": [
    //    [s, s], [s], [s], [s], [s], [s], [s],
    // ] }
    const summonSlots = res.fixed_summon_list;
    const summonsData = summonSlots.flat();
    const summons = summonsData.map(sd => {
        const s = sd.fixed_summon_info;
        return {
            id: s.master_id,
            level: s.level,
            plusmark: s.quality,
            uncap: s.evolution,
        };
    });

    // Get Friend Player-ID from request URL
    const playerId = url.pathname.match(/(\d+)$/)[1];

    // Get Friend Data from friend ID
    const playerData = getFriendDataById(playerId);

    // Store in localStorage
    const friends = tryParseJSON(localStorage.friends) || {};
    friends[playerId] = {
        ...playerData,
        summons,
    };
    log("»» ADDED Friend; Current Friend Count:", Object.keys(friends).length);
    localStorage.friends = JSON.stringify(friends);
};

const origSend = unsafeWindow.XMLHttpRequest.prototype.send;
const main = () => {
    unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', () => {
            if (this.status === 200) {
                customLoad(this, args);
            }
        });
        origSend.apply(this, args);
    };
};

main();