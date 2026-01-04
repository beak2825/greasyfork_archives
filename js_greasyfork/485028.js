// ==UserScript==
// @name         HenryToys
// @namespace    HenryToys
// @version      6.20
// @description  Toys for Henry
// @author       Henry

// @include      *.amazon.*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com

// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand

// @connect      *.amazon.*
// @connect      *.s3.amazonaws.com
// @connect      advertising.amazon.com
// @connect      decorated-reports-prod-iad.s3.amazonaws.com
// @connect      open.feishu.cn
// @connect      dav.jianguoyun.com

// @require      https://update.greasyfork.org/scripts/539094/1609048/dav.js

// @license      CC-BY-4.0

// @downloadURL https://update.greasyfork.org/scripts/485028/HenryToys.user.js
// @updateURL https://update.greasyfork.org/scripts/485028/HenryToys.meta.js
// ==/UserScript==

/* global dav */
/* eslint-disable no-eval */

const load_code = async function () {
    const code = await dav.get_file_data('HenryLab/AmazonAssistant/script/code.js')
    await eval(code)
    console.log(new Date().toLocaleString() + ' code loaded')
}

if (window === window.top) { load_code() }
