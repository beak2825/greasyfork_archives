// ==UserScript==
// @name         Newtoki Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Download images as ZIP or open links in a new tab for Newtoki
// @author       Your Name
// @match        *://*.newtoki.*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/519924/Newtoki%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/519924/Newtoki%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 설정 정보
     * - `imgConfig`: 이미지 다운로드에 사용되는 설정.
     * - `linkConfig`: 링크 열기에 사용되는 설정.
     */
    const imgConfig = {
        targetDivId: 'bo_v_con', // 이미지가 포함된 div의 id
        titleClass: 'bo_v_tit', // ZIP 파일 제목으로 사용할 span의 class
    };

    const linkConfig = [
        {
            site: /newtoki/, // URL에 "newtoki"를 포함하는 경우
            targetDivClass: 'view-padding' // 링크가 포함된 div의 class
        },
        // 추가 사이트 설정은 여기 추가
        // {
        //     site: /example/,
        //     targetDivClass: 'example-class'
        // }
    ];

    // 키 입력 이벤트 리스너 추가
    document.addEventListener('keydown', async (event) => {
        if (event.key === '2') { // 이미지 다운로드
            handleImageDownload();
        } else if (event.key === '`') { // 링크 열기
            handleLinkOpen();
        }
    });

    // 이미지 다운로드 처리 함수
    async function handleImageDownload() {
        // div id가 'bo_v_con'인 요소 가져오기
        const targetDiv = document.getElementById(imgConfig.targetDivId);
        if (!targetDiv) {
            alert('대상 div를 찾을 수 없습니다.');
            return;
        }

        // 대상 div 내의 모든 이미지 URL 가져오기
        const images = targetDiv.querySelectorAll('img');
        if (images.length === 0) {
            alert('다운로드할 이미지가 없습니다.');
            return;
        }

        // span class가 'bo_v_tit'인 요소의 텍스트 가져오기
        const titleElement = document.querySelector(`span.${imgConfig.titleClass}`);
        const zipFileName = titleElement ? `${titleElement.textContent.trim()}.zip` : 'Downloaded Images.zip';

        // ZIP 생성
        const zip = new JSZip();
        const imgFolder = zip.folder('images');

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const imgUrl = img.src;

            // 이미지 데이터를 가져와 ZIP에 추가
            try {
                const response = await fetch(imgUrl);
                const blob = await response.blob();
                imgFolder.file(`image${i + 1}.jpg`, blob);
            } catch (err) {
                console.error(`이미지 다운로드 실패: ${imgUrl}`, err);
            }
        }

        // ZIP 파일 생성 및 다운로드
        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, zipFileName);
            alert(`이미지 ${images.length}개가 ${zipFileName}으로 저장되었습니다.`);
        });
    }

    // 링크 열기 처리 함수
    function handleLinkOpen() {
        const currentConfig = linkConfig.find(config => config.site.test(window.location.href));
        if (!currentConfig) {
            alert('대상 사이트가 설정에 없습니다.');
            return;
        }

        // 대상 div 검색
        const targetDiv = document.querySelector(`.${currentConfig.targetDivClass}`);
        if (!targetDiv) {
            alert('대상 div를 찾을 수 없습니다.');
            return;
        }

        // div 내의 모든 링크를 가져와 새 창으로 열기
        const links = targetDiv.querySelectorAll('a[href]');
        if (links.length === 0) {
            alert('열 URL이 없습니다.');
            return;
        }

        links.forEach(link => {
            const url = link.href;
            if (url) window.open(url, '_blank'); // 새 창으로 열기
        });

        alert(`${links.length}개의 링크가 새 창에서 열렸습니다.`);
    }
})();
