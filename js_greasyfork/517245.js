// ==UserScript==
// @name         Molfigall - FMKOREA EAFC
// @namespace    https://www.fmkorea.com/fifa_series
// @version      1.8
// @description  몰래하자 몰코
// @author       mulcal
// @match        https://www.fmkorea.com/*
// @match        https://m.fmkorea.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517245/Molfigall%20-%20FMKOREA%20EAFC.user.js
// @updateURL https://update.greasyfork.org/scripts/517245/Molfigall%20-%20FMKOREA%20EAFC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* 기본 스타일 */
        body, html, #body, #content, .bd, .bd_lst_wrp {
            font-family: Arial, sans-serif !important;
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }
        
        * {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* 헤더 관련 클래스 - PC & 모바일 통합 */
        header, nav, #header, #nav, .top_area, .gnb_area, .hd, .h1,
        .app_header, .at-header, .at-container {
            background-color: #2d2d2d !important;
            border-bottom: 1px solid #404040 !important;
        }

        /* 게시판 리스트 */
        .li_best2_pop1, .li_best2_hotdeal0,
        #best2.div_hotdeal.at-tip,
        div[class*="best2_"], li[class*="best2_"] {
            background-color: #252525 !important;
            border: 1px solid #404040 !important;
        }

        /* 리스트 항목 호버 효과 */
        .li_best2_pop1:hover, .li_best2_hotdeal0:hover,
        div[class*="best2_"]:hover, li[class*="best2_"]:hover {
            background-color: #2d2d2d !important;
        }

        /* 콘텐츠 영역 */
        .content, article, main, .bd_lst_wrp, .bd, .bd_detail {
            max-width: 1000px !important;
            margin: 0 auto !important;
            padding: 20px !important;
            background-color: #252525 !important;
        }

        /* 로고 관련 스타일 - PC & 모바일 */
        .logo img, h1.title img, .app_header img, .h1 img {
            display: none !important;
        }
        
        .logo a, h1.title a, .app_header a, .h1 a {
            color: #4CAF50 !important;
            font-size: 24px !important;
            font-weight: bold !important;
            text-decoration: none !important;
            padding: 10px !important;
        }

        /* 모바일 특정 요소 */
        .app_header, .hd {
            background-color: #2d2d2d !important;
        }

        .app_menu {
            background-color: #252525 !important;
        }

        .app_footer {
            background-color: #2d2d2d !important;
        }

        /* 모든 텍스트 요소의 색상 변경 */
        p, span, div, h1, h2, h3, h4, h5, h6, td, th {
            color: #e0e0e0 !important;
        }

        /* 링크 색상 변경 */
        a, a:visited, .read_more {
            color: #81c784 !important;
            transition: color 0.2s ease !important;
        }

        a:hover {
            color: #4CAF50 !important;
            text-decoration: none !important;
        }

        /* 모바일 메뉴와 버튼 */
        .at-menu, .at-body, .at-footer,
        .btn_top, .btn_bo_user, .btn_bo_adm {
            background-color: #252525 !important;
            color: #e0e0e0 !important;
        }

        /* 카테고리 메뉴 */
        .list-category .active a,
        .list-category .active a:hover,
        .list-category a:hover {
            background-color: #4CAF50 !important;
            color: #fff !important;
        }

        /* 선택된 텍스트 색상 */
        ::selection {
            background-color: #4CAF50 !important;
            color: #fff !important;
        }

        /* 테이블 스타일 */
        table, th, td {
            border-color: #404040 !important;
            background-color: #252525 !important;
        }

        /* 입력 필드 스타일 */
        input, textarea, select {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border: 1px solid #404040 !important;
        }

        input:focus, textarea:focus, select:focus {
            border-color: #4CAF50 !important;
            outline: none !important;
        }

        /* 버튼 스타일 */
        button, .btn, .btn_img {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border: 1px solid #4CAF50 !important;
            transition: all 0.2s ease !important;
        }

        button:hover, .btn:hover, .btn_img:hover {
            background-color: #4CAF50 !important;
            color: #fff !important;
        }

        /* 하이라이트 요소 */
        .highlight, .active, .selected {
            color: #4CAF50 !important;
        }

        /* 이미지 스타일 */
        img {
            max-width: 100% !important;
            height: auto !important;
        }

        /* 배경이 흰색인 요소들 강제 다크모드 */
        [style*="background-color: white"],
        [style*="background-color: #fff"],
        [style*="background-color: #ffffff"],
        [style*="background: white"],
        [style*="background: #fff"],
        [style*="background: #ffffff"] {
            background-color: #252525 !important;
        }

        /* 스크롤바 스타일링 */
        ::-webkit-scrollbar {
            width: 10px !important;
            background-color: #1a1a1a !important;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #4CAF50 !important;
        }

        ::-webkit-scrollbar-track {
            background-color: #2d2d2d !important;
        }

        /* 모바일 메뉴 아이콘 */
        .menuIcon, .menu_icon {
            filter: invert(1) !important;
        }
    `;
    document.head.appendChild(style);

    // 페이지 제목 변경
    document.title = "업무 문서 - 분기별 보고서";

    // favicon 설정
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/svg+xml';
    favicon.rel = 'shortcut icon';
    favicon.href = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTTIgNCBMMzAgNCBMMTYgMjggWiIgZmlsbD0iIzI1MjUyNSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
    document.head.appendChild(favicon);

    function updatePageAppearance() {
        // 로고 변경 (PC & 모바일)
        const logoSelectors = '.logo a, h1.title a, .app_header h1 a, .h1 a, header h1 a';
        document.querySelectorAll(logoSelectors).forEach(logo => {
            if (!logo.dataset.modified) {
                logo.href = 'https://www.fmkorea.com/fifa_series';
                logo.textContent = 'EAFC';
                logo.dataset.modified = 'true';
            }
        });

        // 이미지 숨기기 (모바일용 선택자 추가)
        document.querySelectorAll('.logo img, h1.title img, .app_header h1 img, .h1 img').forEach(img => {
            img.style.display = 'none';
        });

        // 이미지 설명 변경
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.modified) {
                img.alt = "업무 차트";
                if (img.title) img.title = "업무 차트";
                img.dataset.modified = 'true';
            }
        });

        // 링크 제목 변경
        document.querySelectorAll('a').forEach(link => {
            if (!link.dataset.modified) {
                if (link.title) link.title = "업무 문서";
                link.dataset.modified = 'true';
            }
        });

        // 배경색이 흰색인 요소들 찾아서 다크모드로 변경
        document.querySelectorAll('*').forEach(element => {
            if (!element.dataset.modified) {
                const style = window.getComputedStyle(element);
                if (style.backgroundColor === 'rgb(255, 255, 255)' || 
                    style.backgroundColor === '#ffffff' || 
                    style.backgroundColor === '#fff') {
                    element.style.backgroundColor = '#252525';
                }
                element.dataset.modified = 'true';
            }
        });

        // 모바일 요소 처리를 위한 추가 코드
        document.querySelectorAll('div, li').forEach(element => {
            if (element.className.includes('best2_') && !element.dataset.modified) {
                element.style.backgroundColor = '#252525';
                element.style.color = '#e0e0e0';
                element.dataset.modified = 'true';
            }
        });
    }

    // 페이지 로드 시 실행
    window.addEventListener('load', updatePageAppearance);

    // DOM 변경 감지를 위한 옵저버 설정
    const observer = new MutationObserver(updatePageAppearance);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
})();