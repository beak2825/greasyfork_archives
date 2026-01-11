// ==UserScript==  
// @name         나무위키 도우미
// @namespace    http://tampermonkey.net/  
// @version      6.4
// @description  주석 번호와 설명을 복사할 수 있는 패널을 작고 세련된 UI로 제공하며, 페이지 내용과 URL 변경 시 자동 갱신. 복사 시 선택된 텍스트에 주석 내용 HTML을 보존한 형태로 자동 덧붙임, 이미지 링크 변환 기능.
// @license      MIT
// @match        https://namu.wiki/*  
// @grant        GM_setClipboard  
// @downloadURL https://update.greasyfork.org/scripts/546729/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546729/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==      
  
(function () {  
    'use strict';  
  
    const green = '#4CAF50';  
    const greenTransparent = 'rgba(76, 175, 80, 0.8)';  
    let collected = []; // {num, title, el}  
    let collectedHtmlMap = new Map(); // Map(el → html)  
    let convertTimer = null;  
  
    let panel, copyBtn, previewDiv, fixedContainer, expandBtn;  
    let isCopyButtonClick = false;  
  
    // ---------------- 수집 ----------------  
    function collectAndUpdate() {  
        // href에 fn- 포함 + title 있는 <a>만 선택  
        const fnNotes = Array.from(document.querySelectorAll('a[href*="fn-"]'))  
            .filter(a => a.getAttribute('title'));  

        const newCollected = fnNotes.map(fn => {
            const numMatch = fn.href.match(/([a-zA-Z0-9_-]*?)fn-(\d+)$/);
            if (!numMatch) return null;
            const prefix = numMatch[1] || '';
            const num = numMatch[2];
            const title = fn.getAttribute('title') || '';
            return { prefix, num, title, el: fn };
        }).filter(Boolean);
  
        if (newCollected.length !== collected.length) {  
            collected = newCollected;  
            updatePanel();  
            if (convertTimer) clearTimeout(convertTimer);  
            convertTimer = setTimeout(() => convertCollectedToHtml(), 200);  
        }  
    }  
  
    // ---------------- UI 생성 ----------------  
    function createUI() {  
        panel = document.createElement('div');  
        panel.style = `  
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;  
            background: white; border: 1px solid #ccc; padding: 10px;  
            box-shadow: 0 2px 10px rgba(0,0,0,0.2); width: 360px;  
            max-height: 440px; overflow: auto; font-size: 13px;  
            line-height: 1.4; display: none;  
        `;  
  
        copyBtn = document.createElement('button');  
        copyBtn.innerText = '주석 복사';  
        copyBtn.style = `  
            background: ${green}; color: white; border: none;  
            padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer;  
        `;  
        copyBtn.onclick = () => handleCopyClick(copyBtn);  
  
        const headerRow = document.createElement('div');  
        headerRow.style = 'display:flex; gap:8px; align-items:center; margin-bottom:8px;';  
        headerRow.appendChild(copyBtn);  
  
        const collapseBtn = document.createElement('div');  
        collapseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>`;  
        collapseBtn.style = `  
            width: 28px; height: 28px; background: ${greenTransparent}; border-radius: 6px;  
            display:flex; align-items:center; justify-content:center; cursor:pointer;  
        `;  
        collapseBtn.title = '최소화';  
        collapseBtn.onclick = () => {  
            panel.style.display = 'none';  
            fixedContainer.style.display = 'flex';  
        };  
        headerRow.appendChild(collapseBtn);  
        panel.appendChild(headerRow);  
  
        previewDiv = document.createElement('div');  
        previewDiv.style = 'margin-top:8px;padding:6px;background:#fff;border-radius:4px;border:1px dashed #eee;max-height:240px;overflow:auto;';  
        previewDiv.innerHTML = '<small style="color:#666">주석 HTML 미리보기</small>';  
        panel.appendChild(previewDiv);  
  
        fixedContainer = document.createElement('div');  
        fixedContainer.style = `  
            position: fixed; bottom: 20px; right: 20px; z-index: 9998;  
            display: flex; align-items: center; gap: 6px;  
        `;  
  
        expandBtn = document.createElement('button');  
        expandBtn.title = '펼치기';  
        expandBtn.style = `  
            background: ${greenTransparent}; border: none; border-radius: 6px;  
            height: 34px; width: 34px; padding: 0; display: flex;  
            align-items: center; justify-content: center; cursor: pointer;  
        `;  
        expandBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M4 4h6v2H6v4H4V4zm16 0v6h-2V6h-4V4h6zm0 16h-6v-2h4v-4h2v6zM4 20v-6h2v4h4v2H4z"/></svg>`;  
        expandBtn.onclick = () => {  
            panel.style.display = 'block';  
            fixedContainer.style.display = 'none';  
        };  
  
        fixedContainer.appendChild(expandBtn);  
        document.body.appendChild(panel);  
        document.body.appendChild(fixedContainer);  
    }  
  
    function escapeHtml(s) {  
        return (s + '').replace(/[&<>"']/g, c =>  
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])  
        );  
    }  
  
    // ---------------- collected → HTML 변환 ----------------  
    function updatePanel() {
        const htmlParts = [];

        // 현재 페이지의 기본 주소( # 이전까지 )
        const baseUrl = location.href.split('#')[0];

        for (const item of collected) {
            const html = collectedHtmlMap.get(item.el);
            const num = item.num;

            // rfn 링크 생성
            const rfnLink = `${baseUrl}#${item.prefix}rfn-${num}`;

            // 번호를 클릭하면 → 해당 문서의 rfn 위치로 이동하는 링크 만들기
            const numHtml = `<a href="${rfnLink}" style="text-decoration:none; color:#2b7cff;">[${num}]</a>`;

            // 기존 footnote html 또는 title 사용
            const contentHtml = html || escapeHtml(item.title);

            htmlParts.push(`
                <div style="margin-bottom:8px;">
                    ${numHtml} ${contentHtml}
                </div>
            `);
        }

        previewDiv.innerHTML = htmlParts.length
            ? htmlParts.join('')
            : '<small style="color:#666">주석 HTML 미리보기 없음</small>';
    }
  
    function findRangeByText(root, text) {  
        if (!text) return null;  
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);  
        let node, offset = 0, startNode = null, startOffset = 0, endNode = null, endOffset = 0;  
  
        while (node = walker.nextNode()) {  
            const value = node.nodeValue;  
            for (let i = 0; i < value.length; i++) {  
                if (text[offset] === value[i]) {  
                    if (offset === 0) {  
                        startNode = node;  
                        startOffset = i;  
                    }  
                    offset++;  
                    if (offset === text.length) {  
                        endNode = node;  
                        endOffset = i + 1;  
                        const range = document.createRange();  
                        range.setStart(startNode, startOffset);  
                        range.setEnd(endNode, endOffset);  
                        return range;  
                    }  
                } else offset = 0;  
            }  
        }  
        return null;  
    }  
  
    function convertCollectedToHtml() {  
        const map = new Map();  
        for (const item of collected) {  
            const { el, title, num } = item;  
            let foundHtml = null;  
  
            const range = findRangeByText(document.body, title);  
            if (range) {  
                const div = document.createElement('div');  
                div.appendChild(range.cloneContents());  
                foundHtml = div.innerHTML.trim();  
            }  
  
            if (!foundHtml) {  
                const ids = [`fn-${num}`, `rfn-${num}`, `fn${num}`, `ref-${num}`];  
                for (const id of ids) {  
                    const elem = document.getElementById(id);  
                    if (elem && elem.innerHTML.trim()) {  
                        const clone = elem.cloneNode(true);  
                        clone.querySelectorAll('.wiki-edit,.footnote-backref,.editsection').forEach(x => x.remove());  
                        foundHtml = clone.innerHTML.trim();  
                        break;  
                    }  
                }  
            }  
  
            if (!foundHtml) foundHtml = escapeHtml(title);  
            map.set(el, foundHtml);  
        }  
        collectedHtmlMap = map;  
        updatePanel();  
    }  
  
    // ---------------- 앵커 언랩(복사 전) ----------------  
    function cleanNoteAnchors(root) {  
        const anchors = root.querySelectorAll('a[href]');  
        anchors.forEach(a => {  
            try {  
                const href = a.getAttribute('href') || '';  
                if (!href.match(/^#([a-zA-Z0-9]*-)?fn-\d+$/)) return;  
  
                const title = a.getAttribute('title') || '';  
                const numMatch = href.match(/([a-zA-Z0-9]*-)?fn-(\d+)/);  
                const span = document.createElement('span');  
                span.textContent = a.textContent;  
  
                if (numMatch) span.setAttribute('data-fn-num', numMatch[2]);  
                if (title) span.setAttribute('data-fn-title', title);  
  
                a.parentNode.replaceChild(span, a);  
            } catch (e) { /* 안전하게 무시 */ }  
        });  
    }  
  
    // ---------------- 선택 영역 기준 치환 (공백 문제 수정) ----------------  
    function replaceNotesInNodeHtml(node, containerRoot) {  
        if (!node) return;  
      
        // 텍스트 노드인 경우  
        if (node.nodeType === Node.TEXT_NODE) {  
            const parts = node.nodeValue.split(/(\[\d+\])/g);  
            if (parts.length === 1) return; // 치환할 패턴 없음  
      
            const frag = document.createDocumentFragment();  
      
            for (const part of parts) {  
                const m = part.match(/^\[(\d+)\]$/);  
                if (!m) {  
                    // 일반 텍스트 조각  
                    frag.appendChild(document.createTextNode(part));  
                    continue;  
                }  
      
                const num = m[1];  
      
                // --- (1) 이 텍스트 노드가 rfn-숫자 앵커 내부에 있는지 검사 ---  
                // 텍스트 노드의 조상 중 a[href]가 있고, 그 href에 해당 rfn-num이 포함되어 있으면 원본 유지
                let inRfnAnchor = false;  
                try {  
                    const ancA = node.parentElement && node.parentElement.closest ? node.parentElement.closest('a[href]') : null;  
                    const ancHref = ancA ? ancA.getAttribute('href') || '' : '';  
                    if (ancHref && ancHref.includes(`rfn-${num}`)) {  
                        inRfnAnchor = true;  
                    }  
                } catch (e) { /* ignore */ }  
      
                if (inRfnAnchor) {  
                    frag.appendChild(document.createTextNode(part)); // 원본 [num] 유지  
                    continue;  
                }  
      
                // --- (2) fn 요소 탐색 (containerRoot 우선, rfn 제외) ---  
                let el = null;  
                try {  
                    el = containerRoot.querySelector(`[data-fn-num="${num}"]`);  
                    if (!el) el = containerRoot.querySelector(`a[href*="fn-${num}"]:not([href*="rfn-${num}"])`);  
                    if (!el) el = containerRoot.querySelector(`[data-fn-title*="${num}"], a[title*="${num}"]`);  
                } catch (e) { el = null; }  
      
                // containerRoot에서 못 찾았으면 document 수준에서 한 번 더 안전 검색 (rfn 제외)
                if (!el) {  
                    try {  
                        el = document.querySelector(`a[href*="fn-${num}"]:not([href*="rfn-"])`) || document.querySelector(`[data-fn-num="${num}"]`);  
                    } catch (e) { el = null; }  
                }  
      
                // --- (3) replacement HTML 찾기 (title 범위 추출 또는 collectedHtmlMap 사용 등) ---
                let html = null;  
                let titleForFind = null;  
      
                if (el) titleForFind = el.getAttribute('data-fn-title') || el.getAttribute('title') || null;  
      
                if (titleForFind) {  
                    const range = findRangeByText(document.body, titleForFind);  
                    if (range) {  
                        const div = document.createElement('div');  
                        div.appendChild(range.cloneContents());  
                        html = div.innerHTML.trim();  
                    }  
                }  
      
                // collectedHtmlMap에 이미 있는 경우 사용
                if (!html) {  
                    try {  
                        const foundItem = [...collected].find(it => it.num === num && collectedHtmlMap.has(it.el));  
                        if (foundItem) html = collectedHtmlMap.get(foundItem.el);  
                    } catch (e) { /* ignore */ }  
                }  
      
                // el 자체가 있고 아직 html 못 찾았으면 그 요소의 innerHTML을 사용
                if (!html && el) {  
                    try {  
                        const clone = el.cloneNode(true);  
                        clone.querySelectorAll('.wiki-edit,.footnote-backref,.editsection').forEach(x => x.remove());  
                        html = clone.innerHTML.trim();  
                    } catch (e) { /* ignore */ }  
                }  
      
                // --- (4) 최종 처리: html 있으면 치환, 없으면 원본 유지, span 래핑 제거 ---  
                if (!html) {  
                    frag.appendChild(document.createTextNode(part)); // 못 찾았으면 원본 [n]  
                } else {  
                    // span으로 래핑하지 않고 직접 HTML을 삽입  
                    const tempDiv = document.createElement('div');  
                    tempDiv.innerHTML = '[' + html + ']';  
                    
                    // DocumentFragment에 직접 자식 노드들을 이동  
                    while (tempDiv.firstChild) {  
                        frag.appendChild(tempDiv.firstChild);  
                    }  
                }  
            }  
      
            // 원래 텍스트 노드를 치환  
            node.parentNode.replaceChild(frag, node);  
            return;  
        }  
      
        // 요소 노드인 경우  
        if (node.nodeType === Node.ELEMENT_NODE) {  
            // --- 만약 이 요소가 rfn 링크(a[href*="rfn-숫자"])이면 내부 건드리지 않음 ---
            if (node.tagName === 'A') {  
                try {  
                    const href = node.getAttribute('href') || '';  
                    if (href.includes('rfn-')) return; // rfn 앵커는 건너뛴다 (원본 유지)
                } catch (e) { /* ignore */ }  
            }  
      
            // 그 외 요소는 자식들 재귀 처리 (live NodeList 문제 방지로 배열화)
            Array.from(node.childNodes).forEach(child => replaceNotesInNodeHtml(child, containerRoot));  
        }  
    }  
      
    function fixLinksToAbsolute(container) {
        // 기존 링크 절대경로 처리
        const anchors = container.querySelectorAll('a[href]');
        anchors.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
    
            if (href.startsWith('#') && !href.match(/^#([a-zA-Z0-9]*-)?fn-\d+$/)) {
                try { a.setAttribute('href', new URL(href, location.origin).href); } catch (e) {}
            } else if (!href.match(/^https?:\/\//i) && !href.startsWith('mailto:')) {
                try { a.setAttribute('href', new URL(href, location.origin).href); } catch (e) {}
            }
        });
    
        // 이미지 src 절대경로 처리
        const imgs = container.querySelectorAll('img[src]');
        imgs.forEach(img => {
            const src = img.getAttribute('src');
            if (!src) return;
            if (!src.match(/^https?:\/\//i) && !src.startsWith('data:')) {
                try { img.setAttribute('src', new URL(src, location.origin).href); } catch (e) {}
            }
        });
    }

    // ---------------- 링크로 감싸진 이미지를 링크 텍스트로 변환 ----------------
    function convertLinkedImagesToLinks(container) {
        // <a href="..."><img ...></a> 패턴을 찾아서 링크 텍스트로 변환
        const linkedImages = container.querySelectorAll('a[href] img');
        
        linkedImages.forEach(img => {
            const anchor = img.closest('a[href]');
            if (!anchor) return;
            
            const href = anchor.getAttribute('href');
            if (!href) return;
            
            // 나무위키 내부 링크는 변환하지 않음
            if (href.includes('namu.wiki') || href.startsWith('/w/') || href.startsWith('#')) {
                return;
            }
            
            // 외부 링크만 텍스트로 변환
            // 이미지의 alt 텍스트 또는 URL을 표시 텍스트로 사용
            const alt = img.getAttribute('alt') || '';
            const displayText = alt || href;
            
            // 링크 텍스트로 변환
            const textNode = document.createTextNode(displayText);
            anchor.innerHTML = ''; // 기존 내용 제거
            anchor.appendChild(textNode);
        });
    }

    // ---------------- 불필요한 공백 텍스트 노드 정리 (강화 버전) ----------------
    function normalizeWhitespace(container) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null
        );
        
        const nodesToCheck = [];
        let node;
        while (node = walker.nextNode()) {
            nodesToCheck.push(node);
        }
        
        nodesToCheck.forEach(textNode => {
            const parent = textNode.parentNode;
            if (!parent) return;
            
            const isBlockParent = ['DIV', 'P', 'LI', 'UL', 'OL', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE', 'TR', 'TD', 'TH'].includes(parent.tagName);
            
            // 공백만 있는 노드는 완전히 제거
            if (/^\s*$/.test(textNode.nodeValue)) {
                textNode.remove();
                return;
            }
            
            // 인라인 요소 내부 공백도 정규화
            // 연속된 공백을 하나로 압축
            textNode.nodeValue = textNode.nodeValue.replace(/\s+/g, ' ');
            
            // 블록 요소의 첫/마지막 자식인 경우 앞뒤 공백 제거
            if (isBlockParent) {
                if (textNode === parent.firstChild) {
                    textNode.nodeValue = textNode.nodeValue.replace(/^\s+/, '');
                }
                if (textNode === parent.lastChild) {
                    textNode.nodeValue = textNode.nodeValue.replace(/\s+$/, '');
                }
            }
            
            // 빈 문자열이 되면 제거
            if (textNode.nodeValue === '') {
                textNode.remove();
            }
        });
        
        // 빈 요소들도 정리
        const emptyElements = container.querySelectorAll('*:empty:not(br):not(img):not(hr):not(input)');
        emptyElements.forEach(el => {
            // 실제로 내용이 없는 경우만 제거 (공백도 없음)
            if (!el.textContent.trim() && el.children.length === 0) {
                el.remove();
            }
        });
    }

    async function writeClipboard(plain, html) {
        // 방법 1: Modern Clipboard API (iOS Safari, Desktop Chrome 등)
        try {
            if (navigator.clipboard && window.ClipboardItem) {
                const items = {};
                items['text/plain'] = new Blob([plain], { type: 'text/plain' });
                if (html) {
                    items['text/html'] = new Blob([html], { type: 'text/html' });
                }
            
                await navigator.clipboard.write([new ClipboardItem(items)]);
                return true;
            }
        } catch (e) {
            console.warn('Clipboard API failed:', e);
        }

        // 방법 2: execCommand를 이용한 HTML 복사 (Android Chrome 등)
        try {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-999999px';
            container.style.top = '-999999px';
            container.innerHTML = html || plain;
            document.body.appendChild(container);

            const range = document.createRange();
            range.selectNodeContents(container);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const success = document.execCommand('copy');
            selection.removeAllRanges();
            document.body.removeChild(container);

            if (success) return true;
        } catch (e) {
            console.warn('execCommand copy failed:', e);
        }

        // 방법 3: GM_setClipboard (Tampermonkey fallback - plain text only)
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(plain);
                return true;
            }
        } catch (e) {
            console.warn('GM_setClipboard failed:', e);
        }

        return false;
    }

    // ---------------- HTML 압축 (공백 제거) ----------------
    function minifyHtml(htmlString) {
        // 태그 사이의 불필요한 공백 제거
        return htmlString
            .replace(/>\s+</g, '><')  // 태그 사이 공백 제거
            .replace(/\s{2,}/g, ' ')   // 연속된 공백을 하나로
            .trim();
    }

    // ---------------- HTML을 plaintext로 변환 ----------------
    function htmlToPlaintext(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        
        // <br>과 블록 요소들을 줄바꿈으로 변환
        tempDiv.querySelectorAll('br').forEach(br => {
            br.replaceWith(document.createTextNode('\n'));
        });
        
        // 블록 레벨 요소 앞뒤에 줄바꿈 추가
        const blockElements = tempDiv.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, blockquote');
        blockElements.forEach(el => {
            el.insertAdjacentText('beforebegin', '\n');
            el.insertAdjacentText('afterend', '\n');
        });
        
        // textContent로 순수 텍스트 추출
        let text = tempDiv.textContent || '';
        
        // 연속된 줄바꿈을 2개로 제한 (문단 구분)
        text = text.replace(/\n{3,}/g, '\n\n');
        
        // 앞뒤 공백 제거
        text = text.trim();
        
        return text;
    }

    async function copyNotesAsync() {  
        const sel = window.getSelection();  
        let plain = '';  
        let html = '';  
  
        if (sel && sel.toString().trim().length > 0) {  
            const range = sel.getRangeAt(0);  
            const cloned = range.cloneContents();  
            const container = document.createElement('div');  
            container.appendChild(cloned);  
  
            cleanNoteAnchors(container);  
            replaceNotesInNodeHtml(container, container);
            convertLinkedImagesToLinks(container); // 🔥 이미지 링크 변환 추가
            normalizeWhitespace(container);
            fixLinksToAbsolute(container);  
  
            html = minifyHtml(container.innerHTML); // ✅ HTML 압축 추가
            plain = htmlToPlaintext(html); // ✅ HTML에서 plaintext 추출
        } else {  
            plain = collected.map(c => `[${c.num}] ${c.title}`).join('\n');  
            html = '';  
            collected.forEach(c => {  
                const h = collectedHtmlMap.get(c.el);  
                html += `<div><strong>[${c.num}]</strong> ${h || escapeHtml(c.title)}</div>`;  
            });  
        }  
  
        if (!plain) return false;  
        return await writeClipboard(plain, html);  
    }  
  
    function handleCopyClick(button) {  
        isCopyButtonClick = true;  
        copyNotesAsync().then(success => {  
            if (success) {  
                const original = button.innerText;  
                button.innerText = '복사됨!';  
                setTimeout(() => { button.innerText = original; isCopyButtonClick = false; }, 1300);  
            } else {  
                isCopyButtonClick = false;  
                alert('복사 실패: 브라우저 권한 또는 환경 문제일 수 있습니다.');  
            }  
        });  
    }  
  
    document.addEventListener('copy', (e) => {  
        try {  
            if (isCopyButtonClick) return;  
            if (panel && panel.style.display !== 'none') return;  
  
            const sel = window.getSelection();  
            if (!sel || sel.rangeCount === 0) return;  
  
            const range = sel.getRangeAt(0);  
            const cloned = range.cloneContents();  
            const container = document.createElement('div');  
            container.appendChild(cloned);  
  
            cleanNoteAnchors(container);  
            replaceNotesInNodeHtml(container, container);
            convertLinkedImagesToLinks(container); // 🔥 이미지 링크 변환 추가
            normalizeWhitespace(container);
            fixLinksToAbsolute(container);  
  
            const html = minifyHtml(container.innerHTML); // ✅ HTML 압축 추가
            const plain = htmlToPlaintext(html); // ✅ plaintext 추출
            
            e.preventDefault();  
            e.clipboardData.setData('text/html', html);  
            e.clipboardData.setData('text/plain', plain);
        } catch (err) { console.warn('copy handler error', err); }  
    });  
  
    function onUrlChange(callback) {  
        window.addEventListener('popstate', callback);  
        const pushState = history.pushState;  
        history.pushState = function (...args) { const res = pushState.apply(this, args); callback(); return res; };  
        const replaceState = history.replaceState;  
        history.replaceState = function (...args) { const res = replaceState.apply(this, args); callback(); return res; };  
    }  
  
    createUI();  
    collectAndUpdate();  
    const observer = new MutationObserver(() => { collectAndUpdate(); });  
    observer.observe(document.body, { childList: true, subtree: true });  
    onUrlChange(() => { setTimeout(() => collectAndUpdate(), 500); });  
  
})();