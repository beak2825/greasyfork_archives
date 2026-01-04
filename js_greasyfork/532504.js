// ==UserScript==
// @name         Battle Cats Auto Display
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-show enemy lists
// @author       HmmmE
// @match        https://ponosgames.com/information/appli/battlecats/stage/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/532504/Battle%20Cats%20Auto%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/532504/Battle%20Cats%20Auto%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 기존 기능: 적 리스트 자동 표시
    function tryRunScript() {
        const ready = typeof setCurrentStageIndex === "function" &&
                      document.querySelector('[id$="enemy_list_1"]');

        if (!ready) return false;

        // 1. Set high stage index
        setCurrentStageIndex(10000);

        // 2. Show all *_enemy_list
        document.querySelectorAll('[id$="enemy_list"]').forEach(function(el) {
            if (el.id.startsWith("stage") && el.id.includes("_enemy_list")) {
                el.style.display = "";
            }
        });

        // 3. Show all *_enemy_list_1
        document.querySelectorAll('[id$="enemy_list_1"]').forEach(function(el) {
            if (el.id.startsWith("stage") && el.id.includes("_enemy_list_1")) {
                el.style.display = "";
            }
        });

        // 4. Show all *_no_continue
        document.querySelectorAll('[id$="no_continue"]').forEach(function(el) {
            if (el.id.startsWith("stage") && el.id.includes("_no_continue")) {
                el.style.display = "";
            }
        });

        // 5. Show all *_get_item_1
        document.querySelectorAll('[id$="get_item_1"]').forEach(function(el) {
            if (el.id.startsWith("stage") && el.id.includes("_get_item_1")) {
                el.style.display = "";
            }
        });
        return true;
    }

    // 지연 실행
    const delayTime = 100; // 0.1초
    setTimeout(function() {
        const interval = setInterval(() => {
            const success = tryRunScript();
            if (success) clearInterval(interval);
        }, 300);
    }, delayTime);

    // 추가 기능: Ctrl + Shift + S로 <article> 캡처
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
            e.preventDefault();

            const article = document.querySelector('article');
            if (!article) {
                alert('<article> 요소를 찾을 수 없습니다.');
                return;
            }

            html2canvas(article).then(canvas => {
                // 파일명 생성 로직
                const urlPath = new URL(window.location.href).pathname;
                const pathParts = urlPath.split('/');

                let filename = 'stage';
                const stageIndex = pathParts.indexOf('stage');
                if (stageIndex !== -1) {
                    const maybeLang = pathParts[stageIndex + 1];
                    const maybeStage = pathParts[stageIndex + 2] || maybeLang;

                    if (maybeStage.endsWith('.html')) {
                        if (maybeLang !== undefined && maybeLang !== maybeStage) {
                            filename += `_${maybeLang}`;
                        }
                        filename += `_${maybeStage.replace('.html', '')}`;
                    }
                }

                // 이미지 저장
                const link = document.createElement('a');
                link.download = `${filename}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        }
    });

    let showGetItem1 = true;

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyG') {
            e.preventDefault();

            const allItem1 = document.querySelectorAll('[id$="_get_item_1"]');
            const allItem0 = document.querySelectorAll('[id$="_get_item_0"]');

            allItem1.forEach(el => el.style.display = showGetItem1 ? 'none' : '');
            allItem0.forEach(el => el.style.display = showGetItem1 ? '' : 'none');

            showGetItem1 = !showGetItem1;
        }
    });
})();