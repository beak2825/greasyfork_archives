// ==UserScript==
// @name         Download / Play - [ X ]
// @namespace    http://tampermonkey.net/
// @version      3.0
// @copyright    2022, terifash (https://greasyfork.org/en/users/964055-teri-fash)
// @author       feri.fash <teri.fash@gmail.com>
// @license      MIT
// @description  1) Auto play 2) Auto widescreen 3) High quality playback 4) Click to push the next video 5) Download thumbnail
// @match        *://*.xvideos.com/video*
// @icon         https://www.xvideos.com/favicon-32x32.png
// @supportURL   https://github.com/TeriFash/x.scripts.user/issues
// @homepageURL  https://github.com/TeriFash/x.scripts.user
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/452185/Download%20%20Play%20-%20%5B%20X%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/452185/Download%20%20Play%20-%20%5B%20X%20%5D.meta.js
// ==/UserScript==

(function () {

	const textMessages = {
		responseSucssesGood: 'Загрузка прошла успешно',
		responseSucssesBad: 'Не удалось выполнить загрузку',
		responseError: 'Ошибка отправки, откройте пакетный загрузчик M3U8 или проверьте занятость порта :8787',
		thumbbigWait: 'Идет загрузка миниатюры',
		thumbbigError: 'Миниатюра не найдена',
		downloadNotFound: 'Разбор, пожалуйста, скачайте позже'
	}

	function init() {
		    const download = (url) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://127.0.0.1:8787/",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({
                data: url,
                type: "2",
            }),
            responseType: "json",
            onload: res => {
                res.response.stat && (showToast(textMessages.responseSucssesGood));
                res.response.stat || (showToast(textMessages.responseSucssesBad));
            },
            onerror: () => { showToast(textMessages.responseError) },
        });
    }

    const showToast = (msg) => {
        let m = document.createElement("div");
        m.innerHTML = msg;
        m.style.cssText =
            "max-width:60%;min-width: 180px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 18px;";
        document.body.appendChild(m);
        setTimeout(() => {
            let d = 0.5;
            m.style.transition = `-webkit-transform ${d}s ease-in, opacity ${d}s ease-in`;
            m.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(m);
            }, d * 1000);
        }, 2000);
    }

    html5player.player_init && (html5player.toggleExpand());

    const downloadBtn = document.querySelector("button.dl.tab-button");
    downloadBtn.insertAdjacentHTML('afterend', '<button class="dl" id="thumbbig"><span class="icon-f icf-image"></span><span>Миниатюра</span></button>');

		document.getElementById('thumbbig').onclick = () => {
        if (!!html5player.thumb_slide_big) {
            let thumbUrl = html5player.thumb_slide_big;
            let videoTittle = document.querySelector("p.video-title").innerText;
            GM_download(thumbUrl, videoTittle + '.jpg');
            showToast(textMessages.thumbbigWait);
        } else {
            showToast(textMessages.thumbbigError);
        }
    }

		downloadBtn.addEventListener('click', e => {
        e.stopImmediatePropagation();
        if (!!html5player.hlsobj.levels) {
            let m3u8 = html5player.hlsobj.levels.slice(-1)[0].url[0];
            let videoTittle = document.querySelector("p.video-title").innerText;
            download(videoTittle + "," + m3u8);
        } else {
            showToast(textMessages.downloadNotFound);
        }
    }, true);

    Object.defineProperties(html5player.hlsobj, {
        autoLevelEnabled: { value: false, writable: false },
        firstLevel: { value: 4, writable: false },
    })

    let playValue = false;

    Object.defineProperty(html5player, 'canPlay', {
        get: () => playValue,
        set: (val) => {
            val && (html5player.playClicked = true);
            val && (html5player.play());
            playValue = val;
        }
    });
	}

	window.addEventListener('DOMContentLoaded', init);
})();