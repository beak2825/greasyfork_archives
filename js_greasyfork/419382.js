// ==UserScript==
// @icon         https://ci.phncdn.com/www-static/favicon.ico
// @name         Get-91Porn
// @namespace    https://github.com/lanlan
// @version      0.2.0
// @description  Get 91Porn Video
// @author       lanlan
// @match        *://*.91porn.com/view_video.php?viewkey=*
// @match        *://*.91p01.com/view_video.php?viewkey=*
// @match        *://*.91porn.com/view_video_hd.php?viewkey=*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419382/Get-91Porn.user.js
// @updateURL https://update.greasyfork.org/scripts/419382/Get-91Porn.meta.js
// ==/UserScript==

GM_addStyle(`
.download-urls ul {
    padding: 10px;
    font-weight: bold;
    line-height: 1.5;
}
.download-urls ul li {
    display: flex;
    align-items: center;
    height: 20px;
}
.download-url-label {
    width: 100px;
    text-align: right;
}
.download-url-copy {
    flex: 1;
}
.download-url-input {
    flex: 3;
    font-size: 12px;
    padding: 0 5px;
    border: 1px solid #ffff;
    margin: 0 5px;
}
`);

(function() {
    'use strict';

    const MutationObserver = unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver || unsafeWindow.MozMutationObserver;
    const mutationObserver = new MutationObserver(mutations => {
        mutationObserver.disconnect();
        setTimeout(() => {
            unsafeWindow.VideoParsing.init();
        }, 200);
    });
    const playerDom = document.querySelector('#videodetails');

    if(playerDom) {
        mutationObserver.observe(playerDom, {
            childList: true,
            subtree: true,
        });
    }else {
        console.warn('Not found element #videodetails...');
    }
})();

(function() {
    class VideoParsing {
        static getObjectValueByStartsWithChar(obj, char) {
            const vars = [];
            Object.keys(obj).forEach(key => {
                if(key.startsWith(char)) {
                    vars.push({
                        key: key,
                        value: obj[key],
                    });
                }
            });
            return vars;
        }

        static getUrlInfo() {
            // console.warn('unsafeWindow========>', unsafeWindow);
            const player = this.getObjectValueByStartsWithChar(unsafeWindow, 'player');
            // console.warn('player========>', player);
            if(!player.length) {
                console.error('Not found object player...', player);
                return;
            }

            const playerChild = this.getObjectValueByStartsWithChar(player[0].value, 'children_');
            console.warn('playerChild value========>', playerChild[0].value);
            const tempRes = playerChild[0].value[0];
            const results = [];
            results.push(
                {
                    key: "source",
                    currentSrc: tempRes.currentSrc,
                    value: tempRes.children[1].src
                },
                {
                    key: "source",
                    currentSrc: tempRes.currentSrc,
                    value: tempRes.children[1].src.split("?")[0]
                });

            return results;
        }

        static injectUrls2Dom(urlInfo) {
            const li = [];
            urlInfo.forEach(item => {
                li.push(`
                    <li>
                        <span class="download-url-label">${ item.key }</span>
                        <input class="download-url-input" value="${ item.value }" />
                        <a target="_blank" class="download-url-copy" data-href="${ item.value }" href="javascript: void(0);">点击复制地址</a>
                    </li>
                `);
            });

            $('#useraction').before(`<div class="download-urls"><h3>视频下载地址：</h3><ul>${ li.join('') }</ul></div>`);
        }

        static initEvens() {
            $(document).on('click', '.download-url-copy', function(e) {
                e.preventDefault();
                GM_setClipboard($(this).data('href'));
                GM_notification('Copy download link successfully...', 'Notification');
            })
        }

        static init() {
            this.injectUrls2Dom(this.getUrlInfo());
            this.initEvens();
        }
    }

    unsafeWindow.VideoParsing = VideoParsing;
})();