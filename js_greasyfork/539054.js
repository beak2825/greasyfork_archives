// ==UserScript==
// @name         PubMed to Sci-Hub (바로가기 & 다운로드)
// @namespace    https://github.com/poihoii/PMtoSH
// @version      1.1
// @description  PubMed 문헌 페이지에 Sci-Hub 바로가기 및 직접 다운로드 버튼 추가. DOI→PMID→제목 순 검색, 다중 미러에서 존재 확인
// @author       poihoii
// @license      MIT
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @match        https://sci-hub.se/*
// @match        https://sci-hub.ru/*
// @match        https://sci-hub.st/*
// @match        https://sci-hub.wf/*
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539054/PubMed%20to%20Sci-Hub%20%28%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%20%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539054/PubMed%20to%20Sci-Hub%20%28%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%20%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 poihoii

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
*/

(function() {
    'use strict';

    // Sci-Hub 미러 목록 (필요 시 조정)
    const MIRRORS = [
        'https://sci-hub.se/',
        'https://sci-hub.ru/',
        'https://sci-hub.st/',
        'https://sci-hub.wf/'
    ];

    // PubMed: DOI→PMID→제목 우선 검색어
    if (location.hostname === 'pubmed.ncbi.nlm.nih.gov') {
        const doiElem   = document.querySelector('a[data-ga-action="DOI"]');
        const pmidElem  = document.querySelector('strong.current-id');
        const titleElem = document.querySelector('.heading-title');
        if (!titleElem) return;

        const doi   = doiElem   ? doiElem.textContent.trim()   : null;
        const pmid  = pmidElem  ? pmidElem.textContent.trim()  : null;
        const title = titleElem ? titleElem.textContent.trim() : null;
        const query = doi || pmid || title;
        if (!query) return;

        // 다중 미러에서 PDF 여부 확인
        checkMirrors(query,
            () => displayButtons(titleElem, query),
            () => displayWarning(titleElem)
        );
        return;
    }

    // Sci-Hub: 자동 다운로드 모드 (#download)
    if (/sci-hub\./.test(location.hostname) && location.hash === '#download') {
        window.addEventListener('load', () => {
            const el = document.querySelector('embed#pdf, iframe#pdf, embed[type="application/pdf"], iframe[src*=".pdf"]');
            if (!el) { alert('⚠️ PDF 링크를 찾을 수 없습니다.'); return; }
            let pdf = el.src || el.getAttribute('src');
            if (pdf.startsWith('//')) pdf = 'https:' + pdf;
            pdf = pdf.split('#')[0];
            const name = pdf.split('/').pop().split('?')[0] || 'download.pdf';
            GM_download({url: pdf, name: name, saveAs: false});
            setTimeout(() => window.close(), 3000);
        });
        return;
    }

    /**
     * 각 미러에 GET 요청으로 PDF 존재 확인
     */
    function checkMirrors(query, onFound, onNotFound) {
        let remaining = MIRRORS.length;
        let found = false;
        const notFoundMsg = "Unfortunately, Sci-Hub doesn't have the requested document";

        MIRRORS.forEach(base => {
            GM_xmlhttpRequest({ method: 'GET', url: base + encodeURIComponent(query),
                onload(res) {
                    const html = res.responseText || '';
                    // 미등록 메시지 없고 embed/pdf 태그 존재 시
                    if (!html.includes(notFoundMsg) && /(<embed[^>]+src=["'][^"']+\.pdf)|(<iframe[^>]+src=["'][^"']+\.pdf)/i.test(html)) {
                        if (!found) { found = true; onFound(); }
                    }
                    if (--remaining === 0 && !found) onNotFound();
                },
                onerror() {
                    if (--remaining === 0 && !found) onNotFound();
                }
            });
        });
    }

    // 버튼 생성
    function displayButtons(target, query) {
        const container = document.createElement('div');
        Object.assign(container.style, {display:'flex', gap:'8px', margin:'10px 0'});
        const btn1 = document.createElement('button');
        btn1.textContent = '🔗 Sci-Hub로 이동'; styleButton(btn1,'#6c757d');
        btn1.onclick = () => GM_openInTab(MIRRORS[0]+encodeURIComponent(query),{active:true});
        const btn2 = document.createElement('button');
        btn2.textContent = '📥 바로 다운로드'; styleButton(btn2,'#007bff');
        btn2.onclick = () => GM_openInTab(MIRRORS[0]+encodeURIComponent(query)+'#download',{active:false,insert:true});
        container.append(btn1, btn2);
        target.parentNode.insertBefore(container, target.nextSibling);
    }

    // 경고문 생성
    function displayWarning(target) {
        const warn = document.createElement('div');
        warn.textContent = '⚠️ 해당 논문은 아직 Sci-Hub에 업로드되지 않았습니다.';
        styleWarning(warn);
        target.parentNode.insertBefore(warn, target.nextSibling);
    }

    function styleButton(b,c) { Object.assign(b.style,{padding:'6px 12px',background:c,color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'14px'}); }
    function styleWarning(e) { Object.assign(e.style,{color:'#dc3545',fontWeight:'bold',margin:'10px 0'}); }
})();
