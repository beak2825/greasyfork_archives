// ==UserScript==
// @name            Reddit Image Directly
// @namespace       https://greasyfork.org/users/821661
// @match           https://www.reddit.com/media?url=*
// @grant           none
// @version         1.2.1
// @run-at          document-start
// @license         GPL-3.0
// @author          hdyzen
// @description     This script uses the a proxy to redirect images on reddit
// @downloadURL https://update.greasyfork.org/scripts/524538/Reddit%20Image%20Directly.user.js
// @updateURL https://update.greasyfork.org/scripts/524538/Reddit%20Image%20Directly.meta.js
// ==/UserScript==

const getImgUrl = () => {
    try {
        const url = new URL(window.location.href);
        const imageUrl = new URL(url.searchParams.get("url"));

        return imageUrl.pathname;
    } catch (err) {
        console.error("Error on get image url:", err);
        return "unknow";
    }
};

window.location.href = `https://go-reddit-load-image-directly.vercel.app/${getImgUrl()}`;
