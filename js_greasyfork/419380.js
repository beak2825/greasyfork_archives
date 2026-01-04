// ==UserScript==
// @icon         https://ci.phncdn.com/www-static/favicon.ico
// @name         Get-Pornhub
// @namespace    https://github.com/lanlan
// @version      0.2.0
// @description  Get Pornhub video
// @author       lanlan
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.pornhubpremium.com/view_video.php?viewkey=*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419380/Get-Pornhub.user.js
// @updateURL https://update.greasyfork.org/scripts/419380/Get-Pornhub.meta.js
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
    const playerDom = document.querySelector('#player');
    // console.warn('playerDom========>', playerDom);

    if(playerDom) {
        mutationObserver.observe(playerDom, {
            childList: true,
            subtree: true,
        });
    }else {
        console.warn('Not found element #player...');
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
            const flashvars = this.getObjectValueByStartsWithChar(unsafeWindow, 'flashvars_');
            // console.warn('flashvars========>', flashvars);
            if(!flashvars.length) {
                console.error('Not found object flashvars...', flashvars);
                return;
            }

            const qualitys = flashvars[0].value.mediaDefinitions;
            console.warn('qualitys========>', qualitys);
            // const results = qualitys.filter(item => item.format === 'mp4');
            return qualitys;
        }

        static injectUrls2Dom(urlInfo) {
            const li = [];
            urlInfo.forEach(item => {
                li.push(`
                    <li>
                        <span class="download-url-label">${ item.quality }</span>
                        <input class="download-url-input" value="${ item.videoUrl }" />
                        <a target="_blank" class="download-url-copy" data-href="${ item.videoUrl }" href="javascript: void(0);">点击复制地址</a>
                    </li>
                `);
            });

            $('.title-container').before(`<div class="download-urls"><h3>视频下载地址：</h3><ul>${ li.join('') }</ul></div>`);
        }

        static initEvens() {
            $(document).on('click', '.download-url-copy', function(e) {
                e.preventDefault();
                GM_setClipboard($(this).data('href'));
                GM_notification('下载地址复制成功！', '提示');
            })
        }

        static init() {
            this.injectUrls2Dom(this.getUrlInfo());
            this.initEvens();
        }
    }

    unsafeWindow.VideoParsing = VideoParsing;
})();