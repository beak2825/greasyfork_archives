// ==UserScript==
// @name         Download Torrent to qB WebUI
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download Torrent to qBittorrent WebUI
// @author       TYT
// @match        http*://www.nexushd.org/details.php*
// @match        http*://www.nexushd.org/torrents.php*
// @require      https://cdn.bootcss.com/fetch-jsonp/1.1.3/fetch-jsonp.min.js
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/392535/Download%20Torrent%20to%20qB%20WebUI.user.js
// @updateURL https://update.greasyfork.org/scripts/392535/Download%20Torrent%20to%20qB%20WebUI.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    const $dl = $('a[href*="download.php?id="]:has(img.dt_download,img.download)');
    const hostURL = 'http://10.12.226.111:8080'
    const d2qb = function (evt, dlURL){
        evt.preventDefault();
        let ctrlKeyPressed = evt.ctrlKey;
        if (!ctrlKeyPressed) {
            dlURL = `${dlURL}&passkey=e07dd9b554a9c06fa40b83db0d3bba1b`;
        }
        fetch(dlURL)
            .then(e => Promise.all([e.blob(), e.headers.get('content-disposition').match(/filename="([^"]*)"/)[1]]))
            .then(([blob, fileName]) => new File([blob], fileName))
            .then(file => {
            let formData = new FormData();
            formData.append('torrents', file);
            formData.append('savepath', '/mnt/hdd/Downloads/Media/');
            formData.append('root_folder', true);
            if (ctrlKeyPressed) {
                formData.append('skip_checking', true);
            }
            let add_torrent_promise = new Promise((resolve, reject) => GM_xmlhttpRequest({
                url: `${hostURL}/api/v2/torrents/add`,
                method: 'POST',
                headers: {
                    'referer': hostURL,
                    'orgin': hostURL
                },
                onload: result => {
                    resolve(result);
                },
                onerror: result => {
                    resolve(result);
                },
                data: formData
            }));
            add_torrent_promise.then((result) => {
                switch(result.status) {
                    case 200: //成功
                        console.log('种子已添加！');
                        break;
                    case 403: //未授权
                        {
                            confirm('请先登录qBittorrent WebUI，然后再进行尝试');
                            window.open(`${hostURL}/login.html`, '_blank', 'location=yes,height=500,width=500,scrollbars=yes,status=yes,noreferrer');
                        }
                }
            });
        })
    };
    $dl.map((i, e) => {
        let dlURL = e.href;
        let seedersCount;
        let windowHref = window.location.href;
        if (windowHref.match('torrents.php')) {
            seedersCount = parseInt($(e).closest('table').closest('tr').find('a[href$="seeders"]').text() | '0');
        }
        else if (windowHref.match('details.php')) {
            seedersCount = parseInt($('#peercount').text().match(/\d/)[0]);
        }
        $(e).after(
            $(`<a title="WebUI" href="${dlURL}"><b><font class="small">WebUI</font></b></a>`).on('click', (evt) => d2qb(evt, dlURL)).css({
                'color': seedersCount === 0 ? 'grey' : 'black'
            })
        ).after('&nbsp;|&nbsp;');
    });
})(window.$.noConflict(true));