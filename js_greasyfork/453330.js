// ==UserScript==
// @name         coofoUtils-tampermonkeyUtils
// @namespace    https://github.com/coofo/someScript
// @version      0.0.2
// @license      MIT License
// @description  tampermonkeyUtils扩展包
// @author       coofo
// @downloadURL  https://github.com/coofo/someScript/raw/main/tampermonkey/coofoUtils-tampermonkeyUtils.user.js
// @supportURL   https://github.com/coofo/someScript/issues
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    window.coofoUtils.tampermonkeyUtils = {
        downloadHelp: {
            toBlob: {
                asBlob: function (url, onSuccess) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        nocache: true,
                        responseType: "arraybuffer",
                        onload: function (responseDetails) {
                            onSuccess(responseDetails);
                        }
                    });
                }
            },
            toUser: {
                asGMdownload: function (url, fileName, setting) {
                    let details;
                    if (typeof setting === "object" && typeof setting.gmDownload === "object") {
                        details = setting.gmDownload;
                    } else {
                        details = {saveAs: false};
                    }
                    details.url = url;
                    details.name = fileName;
                    // console.log(details.url);
                    // console.log(details.name);
                    GM_download(details);
                }
            }
        }
    };
})();