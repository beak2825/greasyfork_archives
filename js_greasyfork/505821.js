// ==UserScript==
// @name         AVDBS Favorite Button Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  광고 차단기를 우회하여 찜 버튼을 표시합니다.
// @author       Won Soon Park
// @match        https://www.avdbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=avdbs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505821/AVDBS%20Favorite%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/505821/AVDBS%20Favorite%20Button%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 광고 버튼 그룹과 버튼의 클래스 이름을 변경하는 코드
    document.querySelectorAll('.ad-btn-grp').forEach(function(grp) {
        grp.classList.remove('ad-btn-grp');
        grp.classList.add('custom-btn-grp');
    });

    document.querySelectorAll('.ad-btn').forEach(function(btn) {
        btn.classList.remove('ad-btn');
        btn.classList.add('custom-btn');
    });

    // 특정 클래스를 가진 버튼을 제거하는 코드
    // K디스크, 온디스크 버튼 삭제
    // 해당 버튼이 필요하면 이 구간 주석 ( 29,30,31번째 줄 주석 처리 )
    document.querySelectorAll('.custom-btn.tp1, .custom-btn.tp2').forEach(function(btn) {
        btn.remove();
    });

    // 새로운 클래스에 스타일을 적용하는 코드
    var style = document.createElement('style');
    style.innerHTML = `
        .custom-btn-grp {
            text-align: center;
        }
        .custom-btn {
            line-height: 18px;
            padding: 5px 0 0 0;
            display: inline-block;
            height: 45px;
            color: white;
            font-size: 16px;
            margin-left: 5px;
            border-radius: 5px;
        }
        .custom-btn.tp1 {
            background-color: #ff6959;
        }
        .custom-btn.tp2 {
            background-color: #4285f4;
        }
        .custom-btn.pc {
            width: 100px;
        }
        .custom-btn.mob {
            width: 130px;
        }
        .custom-btn.btn_jjim {
            vertical-align: 10px;
            line-height: 40px;
            padding: 2px 0 0 0;
        }
        .custom-btn > .dscr {
            font-size: 12px;
            color: yellow;
        }
        .custom-btn.kwd {
            line-height: 45px !important;
            padding: 0 !important;
            vertical-align: 0 !important;
        }
        @media only screen and (max-width:1023px) {
            .custom-btn-grp {
                clear: both;
            }
            .profile_view_inner {
                padding: 10px 0;
            }
        }
        @media only screen and (max-width: 729px) {
            .shw2-970-over {
                display: none !important;
            }
            .shw2-730-over {
                display: none !important;
            }
            .shw2-730-under {
                display: block !important;
            }
            .custom-btn.mob {
                width: 95px;
                margin-left: 0;
            }
        }
        @media only screen and (max-width: 300px) {
            .custom-btn.mob {
                width: 80px;
                margin-left: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();
