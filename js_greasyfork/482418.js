// ==UserScript==
// @name         s21gravatar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays user avatars from gravatar
// @author       eckhardy, bgenia
// @match        https://edu.21-school.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482418/s21gravatar.user.js
// @updateURL https://update.greasyfork.org/scripts/482418/s21gravatar.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const origFetch = window.fetch

    const loginHashes = new Map()

    async function digestText(message) {
        const msgUint8 = new TextEncoder().encode(message)
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
        return hashHex
    }

    async function getAvatar(login, defaultAvatarUrl) {
        if (loginHashes.has(login)) {
            const hash = loginHashes.get(login)

            const gravatarUrl = `https://gravatar.com/avatar/${hash}?s=512&d=404`

            const headResponse = await origFetch(gravatarUrl, {method: 'HEAD'})

            if (headResponse.status == 404) {
                return defaultAvatarUrl
            }

            return gravatarUrl
        }

        const hash = await digestText(login.trim().toLowerCase())

        loginHashes.set(login, hash)

        return getAvatar(login, defaultAvatarUrl)
    }

    async function replaceAvatars(object) {
        if (typeof object != "object" || !object) {
            return
        }

        if (object.__typename == "User" && object.login && object.avatarUrl) {
            const newAvatarUrl = await getAvatar(object.login, object.avatarUrl)

            object.avatarUrl = newAvatarUrl

            return
        }

        if (object.__typename == "School21Queries" && object.getEmailbyUserId && object.getAvatarByUserId) {
            const newAvatarUrl = await getAvatar(object.getEmailbyUserId, object.getAvatarByUserId)

            object.getAvatarByUserId = newAvatarUrl

            return
        }

        for (const key in object) {
            await replaceAvatars(object[key])
        }
    }

    const USER_DATA_TYPENAME_PATTERN = /"__typename":"(?:User|School21Queries)"/

    async function modify(req, res) {
        if (!USER_DATA_TYPENAME_PATTERN.test(res)) {
            return res
        }

        const result = JSON.parse(res)

        await replaceAvatars(result)

        return JSON.stringify(result)

    }

    unsafeWindow.fetch = async function(url, options) {
        if(`${url}`.includes("sentry")) {
            console.warning(`Blocked ${url}`);
            return new Response();
        }

        const data = await origFetch(url, options);
        if(!`${url}`.includes("graphql")) {
            return data;
        }

        const request = JSON.parse(options.body);

        const origText = data.text;
        data.text = async function() {
            return await modify(request, await origText.call(this));
        }

        data.json = async function() {
            return JSON.parse(await modify(request, await origText.call(this)));
        }

        return data;
    }
})();