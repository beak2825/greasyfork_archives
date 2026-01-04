// ==UserScript==
// @name         enbita tvflix adblock
// @namespace    enbita tvflix adblock
// @version      1.1
// @description  enbita tvflix adblock script
// @author       You
// @match        https://tvwiki*.net/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530447/enbita%20tvflix%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/530447/enbita%20tvflix%20adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** 1️⃣ 페이지 로드 전에 검은 장막 덮기 **/
    let overlay = document.createElement("div");
    overlay.id = "custom-black-overlay"; // ID 추가
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = "99999";  // 최상위 배치
    overlay.style.transition = "opacity 0.5s";
    overlay.style.opacity = "1";

    // HTML 문서에 즉시 삽입 (페이지 로드 전에 실행됨)
    document.documentElement.appendChild(overlay);

    /** 2️⃣ 페이지 로드 후 실행될 코드 **/
    window.addEventListener("DOMContentLoaded", function() {

        // 타이틀 변경
        document.title = "Netflix";

        // 로고 변경
        const logoLink = document.querySelector("a.logo");
        if (logoLink) {
            const img = logoLink.querySelector("img");
            if (img) {
                img.src = "https://i.imgur.com/rBAwaXX.png"; // 이미지를 바로 변경
                img.style.width = "110px";
                img.style.height = "auto";
            }
        }

        // 광고 및 UI 제거 (배너, 메뉴 등)
        document.querySelectorAll('div.notice, ul.banner2, li.full.pc-only, li.full.mobile-only, nav.gnb.sf-js-enabled.sf-arrows, a.btn_login, #bnb, #footer, .search_wrap ul')
            .forEach(element => element.remove());


        /** 3️⃣ HTML에서 직접 오버레이 삭제 **/
        setTimeout(() => {
            document.querySelector("#custom-black-overlay")?.remove();
        }, 50); // 애니메이션 시간 고려 후 삭제


        // 자동 플레이어 넘기기
        const button = document.querySelector('a.btn.btn_normal');
        if (button) {
            button.click();
        }

        // 추가: 컨텐츠 내부 동작 제거 (좋아요 공유 스크랩 등)
        const bo_v_act = document.getElementById('bo_v_act');
        if (bo_v_act) {
            bo_v_act.remove();
        }

        //댓글 제거
        const bo_vc = document.getElementById('bo_vc');
        if (bo_vc) {
            bo_vc.remove();
        }

        //하단 플로트바 제거
        const bottom_float = document.getElementById('float');
        if (bottom_float) {
            bottom_float.remove();
        }


    });
})();
