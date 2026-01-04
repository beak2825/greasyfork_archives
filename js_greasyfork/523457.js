// ==UserScript==
// @name        GM_DL
// @namespace   Violentmonkey Scripts
// @grant       GM.xmlHttpRequest
// @version     1.3
// @author      https://greasyfork.org/en/users/1409235-paywalldespiser
// @description GM_download but it actually works
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// ==/UserScript==

/**
 * Arguments for GM_DL
 *
 * @typedef {object} GM_DL_ARGS
 * @property {string | URL} url
 * @property {string} filename
 * @property {("GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "TRACE" | "OPTIONS" | "CONNECT")} [method='GET']
 * @property {("follow" | "error" | "manual")} [redirect='follow']
 * @property {string | undefined} data
 * @property {{ [key: string]: string; } | undefined} headers
 */
/**
 * GM_download but it actually works
 *
 * @param {GM_DL_ARGS}
 * @returns {Promise<void>}
 */
function GM_DL({
    url,
    filename,
    method = 'GET',
    redirect = 'follow',
    data,
    headers,
}) {
    return GM.xmlHttpRequest({
        url,
        method,
        responseType: 'blob',
        redirect,
        data,
        headers,
    }).then(({ response }) => saveAs(response, filename));
}