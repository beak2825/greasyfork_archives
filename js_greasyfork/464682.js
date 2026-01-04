// ==UserScript==
// @name         voicehub链接asmr.one
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  向voicehub添加asmr.one链接
// @author       danhuang jiang
// @match        *://voicehub.xarchiver.tk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464682/voicehub%E9%93%BE%E6%8E%A5asmrone.user.js
// @updateURL https://update.greasyfork.org/scripts/464682/voicehub%E9%93%BE%E6%8E%A5asmrone.meta.js
// ==/UserScript==
const asmr_one_api = "api.asmr-100.com"
const asmr_one="www.asmr-100.com"
//const asmr_one = "www.asmr.one"
var count = 0;

function processItem(item) {
    if ($(item).hasClass('processed')) {
        return;
    }
    var imgContent = $(item).find('div > a > div > div.q-img__content.absolute-full.q-anchor--skip > div.absolute-top-left.transparent.q-pa-none > div > div');
    if (imgContent.length > 0) {
        var rj = imgContent.text().trim();
        var target = $(item).find('div > div > div > div:nth-child(4) > div > div:nth-child(4)');
        var newTarget = target.clone();
        newTarget.find('a').attr('href', `https://${asmr_one}/work/${rj}`);
        GM_xmlhttpRequest({
                method: "GET",
                url: `https://${asmr_one_api}/api/workInfo/${rj.slice(2)}`,
                responseType: "json",
                onload: function (resp) {
                    if (resp.readyState === 4 && resp.status === 200) {
                        if (resp.response['has_subtitle']) {
                            $(newTarget).find('a').text('asmr.one 字幕')
                        } else {
                            $(newTarget).find('a').text('asmr.one')
                        }
                        $(target).after(newTarget);
                    }
                }
            }
        );
        $(item).addClass('processed');
        count = 0;
    }
}

function checkItems() {
    const url = window.location.href
    var items;
    if (url.includes('works')) {
        items = $('#q-app > div > div.q-page-container > main > div > div:nth-child(2) > div > div');
    } else if (url.includes('work')) {
        items = $('#q-app > div > div.q-page-container > main > div > div.col-xs-12.col-sm-8.col-lg-6');
    }
    var unprocessedItems = items.filter(':not(.processed)');
    if (unprocessedItems.length == 0) {
        if (++count == 5) {
            clearInterval(intervalId);
        }
    } else {
        unprocessedItems.each(function (index, item) {
            processItem(item);
        });
    }
}

var intervalId = setInterval(checkItems, 2000);