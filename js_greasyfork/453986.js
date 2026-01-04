// ==UserScript==
// @name        SankakuEasySubs
// @namespace   https://greasyfork.org/users/731869
// @version     0.2
// @license     MIT
// @description Automate the management of tab subscriptions on chan.sankakucomplex.com
// @match       https://chan.sankakucomplex.com/post/show/*
// @match       https://legacy.sankakucomplex.com/post/show/*
// @run-at      document-end
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/453986/SankakuEasySubs.user.js
// @updateURL https://update.greasyfork.org/scripts/453986/SankakuEasySubs.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
const BASE_TAG_URL = "https://chan.sankakucomplex.com/tag_subscription";
const GET_SUB_URL = `${BASE_TAG_URL}/index`;
const CREATE_GROUP_URL = `${BASE_TAG_URL}/create`;
const SAVE_GROUP_URL = `${BASE_TAG_URL}/update`;
const USER_EDIT_URL = "https://chan.sankakucomplex.com/user/edit";
const TAG_ROW_REGEX = /tag-subscription-row-(?<id>\d+)/;
const MANAGED_PREFIX = "MANAGED_DONT_TOUCH_";
const TAG_LIMIT = 20;
const GROUP_LIMIT = 32;
const GM_STORE_KEY = "subscription";
/**
 * Unlike XMPHttpRequest, the fetch API will not reject even if the response has an HTTP error
 * status code. This helper function ensures that:
 * - it throws an error on HTTP error status codes
 *
 * @async
 * @param {string} url the URL of the request.
 * @param {string} on_err the error message when the response has an HTTP error status code.
 * @param {?(RequestInit | undefined)} [options] HTTP request options, same as the second
 * parameter of {@link fetch}.
 * @returns {Promise<Response>}
 */
async function fetch_or(url, on_err, options) {
    const res = await fetch(url, options);
    if (res.status >= 400) {
        throw new Error(`${res.status} ${res.statusText}: ${on_err}`);
    }
    return res;
}
// interface TagSubs {
//   existing: number;
//   managed: TagGroup[];
// }
// const schema = {
//   type: "object",
//   properties: {
//     existing: { type: "number" },
//     managed: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           id: { type: "number" },
//           tags: {
//             type: "array",
//             items: { type: "string" }
//           }
//         }
//       }
//     }
//   }
// };
/**
 * An aggregation of the core functionalities of this script.
 *
 * @class TagSubscriptions
 * @typedef {TagSubscriptions}
 */
class TagSubscriptions {
    constructor(existing, managed) {
        this.existing = existing;
        this.managed = managed;
        const map = new Map();
        managed.forEach((group, i) => {
            for (const tag of group.tags) {
                map.set(tag, i);
            }
        });
        this.map = map;
    }
    /**
     * Initializes the script from {@link GET_SUB_URL} in the rare cases when the storage is wiped or
     * this script is removed by the user once.
     *
     * @private
     * @static
     * @async
     * @returns {Promise<TagSubscriptions>}
     */
    static async init() {
        const res = await fetch_or(GET_SUB_URL, "Failed at fetching subscription page");
        const sub_page = new DOMParser().parseFromString(await res.text(), "text/html");
        const rows = Array.from(sub_page.querySelectorAll("tr[id^='tag-subscription-row']"));
        const groups = rows
            .map(row => {
            var _a, _b, _c;
            const name = (_a = row.querySelector("input[id$='name']")) === null || _a === void 0 ? void 0 : _a.getAttribute("value");
            if (name === null || name === undefined) {
                throw new Error("Malformed tag subscription group name");
            }
            const id_match = TAG_ROW_REGEX.exec(row.id);
            if (id_match === null) {
                throw new Error("Malformed tag subscription row id");
            }
            const id = parseInt(id_match[1]);
            const tags = (_c = (_b = row.querySelector("input[id$='tag_query']")) === null || _b === void 0 ? void 0 : _b.getAttribute("value")) === null || _c === void 0 ? void 0 : _c.split(" ");
            if (tags === undefined) {
                throw new Error("Malformed tag subscription query");
            }
            return { name, id, tags };
        });
        const managed = groups.filter(group => group.name.startsWith(MANAGED_PREFIX)).map(({ id, tags }) => {
            return { id, tags };
        });
        managed.sort((a, b) => a.id - b.id);
        const subs = new TagSubscriptions(rows.length - managed.length, managed);
        // on initialization all un-managed tags are copied to managed groups
        for (const group of groups.filter(g => !g.name.startsWith(MANAGED_PREFIX))) {
            for (const tag of group.tags) {
                await subs.add_tag_without_commit(tag);
            }
        }
        await subs.commit();
        return subs;
    }
    /**
     * The usual way to initialize this script. The data has to be synchronized to the store because
     * of the following assumptions of user behavior:
     * 1. Users may load the script on multiple tabs simultaneously.
     * 2. Users are unlikely to interact with (i.e. click on generated links) the script on multiple
     *    tabs simultaneously.
     * @static
     * @async
     * @returns {Promise<TagSubscriptions>}
     */
    static async init_from_store() {
        const stored = await GM.getValue(GM_STORE_KEY);
        if (typeof stored === "string") {
            // sankaku replaces the default JSON stringify functionality with a non-standard polyfill, in
            // this case an array of objects is stringified to a string instead
            const subs = JSON.parse(stored);
            return new TagSubscriptions(subs.existing, JSON.parse(subs.managed));
        }
        else {
            const subs = await TagSubscriptions.init();
            await subs.save_to_store();
            return subs;
        }
    }
    async save_to_store() {
        await GM.setValue(GM_STORE_KEY, JSON.stringify({
            existing: this.existing,
            managed: this.managed
        }));
    }
    async load_from_store() {
        const subs = await TagSubscriptions.init_from_store();
        this.existing = subs.existing;
        this.managed = subs.managed;
        this.map = subs.map;
    }
    async add_group() {
        // sankaku server rejects this POST request if these headers are not present
        const headers = {
            // "X-Prototype-Version": "1.6.0.3",
            "X-Requested-With": "XMLHttpRequest"
        };
        const res = await fetch_or(CREATE_GROUP_URL, "Failed at creating new group", { method: "POST", headers });
        const id_match = TAG_ROW_REGEX.exec(await res.text());
        if (id_match === null) {
            throw new Error("Malformed group creation response");
        }
        return parseInt(id_match[1]);
    }
    /**
     * Test whether a tag is contained by any of the managed tag groups.
     *
     * @param {string} tag
     * @returns {boolean}
     */
    contains_tag(tag) {
        return this.map.has(tag);
    }
    async add_tag_without_commit(tag) {
        if (this.contains_tag(tag)) {
            return;
        }
        let idx = this.managed.findIndex(group => group.tags.length < TAG_LIMIT);
        if (idx === -1) {
            if (this.existing + this.managed.length > GROUP_LIMIT) {
                throw new Error("Exceeded maximum number of tags");
            }
            const id = await this.add_group();
            this.managed.push({ id, tags: [] });
            idx = this.managed.length - 1;
        }
        this.managed[idx].tags.push(tag);
        this.map.set(tag, idx);
    }
    /**
     * Add a tag to the tag subscription. This operation must be synchronized or the changes made by
     * the user on other simultaneous tabs will be reverted.
     *
     * @async
     * @param {string} tag
     * @returns {*}
     */
    async add_tag(tag) {
        await this.load_from_store();
        await this.add_tag_without_commit(tag);
        await this.commit();
        await this.save_to_store();
    }
    /**
     * Remove a tag from the tag subscription. This operation must be synchronized or the changes made
     * by the user on other simultaneous tabs will be reverted.
     *
     * @async
     * @param {string} tag
     * @returns {*}
     */
    async remove_tag(tag) {
        await this.load_from_store();
        const idx = this.map.get(tag);
        if (idx === undefined) {
            return;
        }
        const query = this.managed[idx].tags;
        query.splice(query.indexOf(tag), 1);
        this.map.delete(tag);
        await this.commit();
        await this.save_to_store();
    }
    /**
     * Commit the current state of managed tag groups to the sankaku website.
     *
     * @async
     * @returns {*}
     */
    async commit() {
        const form_data = new URLSearchParams({
            "commit": "Save"
        });
        this.managed.forEach((group, i) => {
            form_data.append(`tag_subscription[${group.id}][name]`, `${MANAGED_PREFIX}${i.toString().padStart(2, "0")}`);
            form_data.append(`tag_subscription[${group.id}][tag_query]`, group.tags.join(" "));
            form_data.append(`tag_subscription[${group.id}][is_visible_on_profile]`, "false");
        });
        await fetch_or(SAVE_GROUP_URL, "Failed at updating tag groups", {
            method: "POST",
            body: form_data,
            redirect: "manual",
        });
    }
}
/**
 * Add links to easily add or remove tags from tag subscription on post page. Accepts
 * {@link TagSubscriptions} as a parameter because otherwise this function has to be async, but it
 * doesn't actually perform any async operation beside (potentially) initializing
 * {@link TagSubscriptions}.
 *
 * @param {TagSubscriptions} subs
 */
function on_post_page_load(subs) {
    var _a;
    function detect_login_state() {
        var _a;
        const first_header = (_a = document.querySelector("#navbar > li:first-child > a")) === null || _a === void 0 ? void 0 : _a.textContent;
        return first_header === "My Account";
    }
    function anchor(sign, tag) {
        const a = document.createElement("a");
        a.href = "#";
        a.text = sign;
        a.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            a.setAttribute("style", "pointer-events: none;");
            if (a.text === "+") {
                await subs.add_tag(tag);
                a.text = "-";
            }
            else {
                await subs.remove_tag(tag);
                a.text = "+";
            }
            a.setAttribute("style", "");
        });
        return a;
    }
    if (!detect_login_state()) {
        throw new Error("Not logged in");
    }
    const sidebar = document.querySelector("#tag-sidebar");
    if (sidebar === null) {
        throw new Error("Tag sidebar not found");
    }
    for (const div of sidebar.querySelectorAll("li[class^='tag-type'] > div[id^='tag_container']")) {
        const tag = (_a = div.querySelector("a")) === null || _a === void 0 ? void 0 : _a.text.replace(" ", "_");
        if (tag === undefined) {
            throw new Error("Tag name not found");
        }
        const sign = subs.contains_tag(tag) ? "-" : "+";
        div.prepend(document.createTextNode(" "));
        div.prepend(anchor(sign, tag));
    }
}
/**
 * Test whether user is logged in to sankaku. The better idea is to check the status code and
 * Location header of each http response to see whether they are redirected to the login page,
 * however that's currently impossible because of:
 * - Redirected http requests are opaque in fetch API and invisible in XMLHttpRequest API _by
 *   design_.
 * - Those requests would be blocked by most user's browser because sankaku redirects HTTPS requests
 *   to HTTP login page, triggering un-catchable "insecure content on secure page" error hence the
 *   final destination is unobtainable in an user-script.
 *
 * ## known problems
 * The current implementation of login test is vulnerable to TOCTOU problems, e.g. if users log out
 * then browser back to a post page they will be able to click generated links while logged out thus
 * cause inconsistency.
 *
 * @async
 * @returns {Promise<boolean>} return `true` if user is logged in.
 */
async function login_test() {
    const res = await fetch_or(USER_EDIT_URL, "login test failed", { redirect: "manual" });
    return !res.redirected;
}
(async () => {
    "use strict";
    if (!await login_test()) {
        throw new Error("Not logged in");
    }
    const subs = await TagSubscriptions.init_from_store();
    on_post_page_load(subs);
})().catch(console.error);
