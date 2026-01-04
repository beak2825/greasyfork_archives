// ==UserScript==
// @name         Web小説 メモサポーター
// @namespace    https://mypage.syosetu.com/348820/
// @version      1.0.2
// @description  Web小説に登場する固有の単語にルビやノート、文字色を追加する事で、作品の理解を助けます。設定は作品ごとに個別適用されます。
// @author       hikoyuki (ChatGPT)
// @license      MIT
// @match        https://ncode.syosetu.com/*/*
// @match        https://novel18.syosetu.com/*/*
// @match        https://syosetu.org/novel/*/*
// @match        https://kakuyomu.jp/works/*/episodes/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/540135/Web%E5%B0%8F%E8%AA%AC%20%E3%83%A1%E3%83%A2%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/540135/Web%E5%B0%8F%E8%AA%AC%20%E3%83%A1%E3%83%A2%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

;(async function() {
    'use strict';

    //
    // 1. サイト判定＆識別子取得
    //
    const host = location.hostname;
    const parts = location.pathname.split('/').filter(s => s);
    let identifier = '';
    if (host === 'ncode.syosetu.com'    && parts.length >= 2) identifier = parts[0];
    else if (host === 'novel18.syosetu.com' && parts.length >= 1) identifier = parts[0];
    else if (host === 'syosetu.org' && parts[0] === 'novel' && parts.length >= 3) identifier = parts[1];
    else if (host === 'kakuyomu.jp' && parts[0] === 'works' && parts.length >= 4) identifier = parts[1];
    if (!identifier) identifier = host.replace(/\./g, '_');

    //
    // 2. ストレージキー設定
    //
    const prefixColor    = `color_${host}_${identifier}_`;
    const prefixRuby     = `ruby_${host}_${identifier}_`;
    const prefixConvert  = `conv_${host}_${identifier}_`;
    const prefixNote     = `note_${host}_${identifier}_`;
    const prefixBM       = `bm_${host}_${identifier}_`;
    const posLocalKey    = `pos_${host}_${identifier}`;

    //
    // 3. ストレージ操作関数
    //
    async function getEntries(prefix) {
        const arr = [];
        for (const k of await GM_listValues()) {
            if (k.startsWith(prefix)) {
                arr.push({ key: k, val: await GM_getValue(k) });
            }
        }
        return arr;
    }
    async function addEntry(prefix, obj) {
        const key = prefix + Date.now() + '_' + Math.random();
        await GM_setValue(key, obj);
    }
    async function resetAll() {
        for (const k of await GM_listValues()) {
            if (
                k.startsWith(prefixColor) ||
                k.startsWith(prefixRuby) ||
                k.startsWith(prefixConvert) ||
                k.startsWith(prefixNote) ||
                k.startsWith(prefixBM) ||
                k === posLocalKey
            ) {
                await GM_deleteValue(k);
            }
        }
    }
    async function deleteEntryByText(prefix, sel) {
        for (const e of await getEntries(prefix)) {
            const v = e.val;
            if (
                (prefix === prefixColor   && v.text === sel) ||
                (prefix === prefixRuby    && (v.text === sel || v.ruby === sel)) ||
                (prefix === prefixConvert && (v.text === sel || v.replace === sel)) ||
                (prefix === prefixNote    && (v.text === sel || v.note === sel)) ||
                (prefix === prefixBM      && v.text === sel)
            ) {
                await GM_deleteValue(e.key);
            }
        }
    }

    //
    // 4. DOM置換ユーティリティ
    //
    function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function applyColor(text, color, root = document.body) {
        const re = new RegExp(escapeRegExp(text), 'g');
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: node => re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            const frag = document.createDocumentFragment();
            let last = 0, m;
            while ((m = re.exec(node.nodeValue)) !== null) {
                frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
                const span = document.createElement('span');
                span.textContent = m[0];
                span.style.color = color;
                frag.appendChild(span);
                last = m.index + m[0].length;
            }
            frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
            node.parentNode.replaceChild(frag, node);
        }
    }
    function applyRuby(text, ruby, root = document.body) {
        const re = new RegExp(escapeRegExp(text), 'g');
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: node => re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            const frag = document.createDocumentFragment();
            let last = 0, m;
            while ((m = re.exec(node.nodeValue)) !== null) {
                frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
                const r = document.createElement('ruby'),
                      rb = document.createElement('rb'),
                      rt = document.createElement('rt');
                rb.textContent = m[0];
                rt.textContent = ruby;
                r.appendChild(rb);
                r.appendChild(rt);
                frag.appendChild(r);
                last = m.index + m[0].length;
            }
            frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
            node.parentNode.replaceChild(frag, node);
        }
    }
    function applyConvert(oldText, newText, root = document.body) {
        const re = new RegExp(escapeRegExp(oldText), 'g');
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: node => re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            const frag = document.createDocumentFragment();
            let last = 0, m;
            while ((m = re.exec(node.nodeValue)) !== null) {
                frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
                frag.appendChild(document.createTextNode(newText));
                last = m.index + oldText.length;
            }
            frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
            node.parentNode.replaceChild(frag, node);
        }
    }
    function applyNote(text, note, root = document.body) {
        const re = new RegExp(escapeRegExp(text), 'g');
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: node => re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            const frag = document.createDocumentFragment();
            let last = 0, m;
            while ((m = re.exec(node.nodeValue)) !== null) {
                frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
                const span = document.createElement('span');
                span.textContent = m[0];
                span.className = 'annotation';
                span.dataset.note = note;
                frag.appendChild(span);
                last = m.index + m[0].length;
            }
            frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
            node.parentNode.replaceChild(frag, node);
        }
    }
    function applyBookmark(text, bm, root = document.body) {
        const re = new RegExp(escapeRegExp(text), 'g');
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: node => re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            const frag = document.createDocumentFragment();
            let last = 0, m;
            while ((m = re.exec(node.nodeValue)) !== null) {
                frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
                const span = document.createElement('span');
                span.textContent = m[0];
                span.className = 'bookmark';
                frag.appendChild(span);
                last = m.index + m[0].length;
            }
            frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
            node.parentNode.replaceChild(frag, node);
        }
    }

    //
    // 5. 初期描画 - ページ読み込み時に保存済み設定を再適用
    //
    (await getEntries(prefixColor)).forEach(e => applyColor(e.val.text, e.val.color));
    (await getEntries(prefixRuby)).forEach(e => applyRuby(e.val.text, e.val.ruby));
    (await getEntries(prefixConvert)).forEach(e => applyConvert(e.val.text, e.val.replace));
    (await getEntries(prefixNote)).forEach(e => applyNote(e.val.text, e.val.note));
    (await getEntries(prefixBM)).forEach(e => applyBookmark(e.val.text, e.val));

    //
    // 6. 注釈ポップアップ制御
    //
    function closePopup() {
        const p = document.getElementById('annotation-popup');
        if (p) p.remove();
    }
    document.addEventListener('click', e => {
        const p = document.getElementById('annotation-popup');
        if (p && !p.contains(e.target) && !e.target.classList.contains('annotation')) {
            closePopup();
        }
    });
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('annotation')) {
            e.stopPropagation();
            closePopup();
            const note = e.target.dataset.note;
            const rect = e.target.getBoundingClientRect();
            const pop = document.createElement('div');
            pop.id = 'annotation-popup';
            Object.assign(pop.style, {
                position:   'absolute',
                top:        `${rect.top + window.scrollY - 8}px`,
                left:       `${rect.left + window.scrollX}px`,
                transform:  'translateY(-100%)',
                background: '#fff',
                border:     '1px solid #ccc',
                padding:    '4px',
                borderRadius: '4px',
                zIndex:     2147483647,
                maxWidth:   '200px'
            });
            pop.textContent = note;
            document.body.appendChild(pop);
        }
    });

    //
    // 7. インポート／エクスポート機能
    //
    async function exportAll() {
        const data = {};
        for (const k of await GM_listValues()) {
            data[k] = await GM_getValue(k);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'WebNovelReader.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    async function importAll() {
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = function() {
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const obj = JSON.parse(reader.result);
                        for (const k in obj) {
                            await GM_setValue(k, obj[k]);
                        }
                        location.reload();
                    } catch (e) {
                        alert('インポート失敗: ' + e);
                    }
                    resolve();
                };
                reader.readAsText(input.files[0]);
            };
            input.click();
        });
    }

    //
    // 8. 設定管理UI
    //
    async function openSettingsManager() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 2147483647
        });
        document.body.appendChild(overlay);

        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '80%', maxHeight: '80%', overflowY: 'auto',
            background: '#fff', padding: '16px',
            borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        });
        overlay.appendChild(panel);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '8px', right: '8px',
            background: 'transparent', border: 'none',
            fontSize: '18px', cursor: 'pointer'
        });
        panel.appendChild(closeBtn);
        closeBtn.addEventListener('click', () => overlay.remove());

        const table = document.createElement('table');
        table.style.width = '100%';
        table.innerHTML = '<tr><th>種別</th><th>テキスト</th><th>値</th><th>操作</th></tr>';
        panel.appendChild(table);

        const prefixes = [
            { key: prefixColor,    name: 'カラー' },
            { key: prefixRuby,     name: 'Ruby' },
            { key: prefixConvert,  name: 'Convert' },
            { key: prefixNote,     name: 'Note' },
            { key: prefixBM,       name: 'Bookmark' }
        ];
        for (const pr of prefixes) {
            for (const e of await getEntries(pr.key)) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                  <td>${pr.name}</td>
                  <td>${e.val.text}</td>
                  <td>${JSON.stringify(e.val)}</td>
                  <td>
                    <button class="edit">編集</button>
                    <button class="del" style="margin-left:8px">削除</button>
                  </td>`;
                table.appendChild(tr);

                tr.querySelector('.edit').addEventListener('click', async () => {
                    const input = prompt('新しい設定値(JSON):', JSON.stringify(e.val));
                    if (!input) return;
                    try {
                        const nv = JSON.parse(input);
                        await GM_setValue(e.key, nv);
                        tr.cells[2].textContent = input;
                    } catch {
                        alert('JSON形式が不正です');
                    }
                });
                tr.querySelector('.del').addEventListener('click', async () => {
                    if (!confirm('本当に削除しますか？')) return;
                    await GM_deleteValue(e.key);
                    tr.remove();
                });
            }
        }
    }

    //
    // 9. ブックマーク一覧表示
    //
    async function openBookmarkList() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 2147483647
        });
        document.body.appendChild(overlay);

        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '80%', maxHeight: '80%', overflowY: 'auto',
            background: '#fff', padding: '16px',
            borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        });
        overlay.appendChild(panel);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '8px', right: '8px',
            background: 'transparent', border: 'none',
            fontSize: '18px', cursor: 'pointer'
        });
        panel.appendChild(closeBtn);
        closeBtn.addEventListener('click', () => overlay.remove());

        const table = document.createElement('table');
        table.style.width = '100%';
        table.innerHTML = '<tr><th>テキスト</th><th>ページ</th><th>タグ</th><th>操作</th></tr>';
        panel.appendChild(table);

        for (const entry of await getEntries(prefixBM)) {
            const bm = entry.val;
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${bm.text}</td>
              <td><a href="${bm.url}" target="_blank">${bm.title}</a></td>
              <td>${(bm.tags||[]).join(', ')}</td>
              <td>
                <button class="jump">ジャンプ</button>
                <button class="del" style="margin-left:8px">削除</button>
              </td>`;
            table.appendChild(tr);

            tr.querySelector('.jump').addEventListener('click', () => {
                if (bm.url === location.href) window.scrollTo(0, bm.scrollY); else window.open(bm.url, '_blank');
                overlay.remove();
            });
            tr.querySelector('.del').addEventListener('click', async () => {
                if (!confirm('本当に削除しますか？')) return; await GM_deleteValue(entry.key); tr.remove();
            });
        }
    }

    //
    // 10. メニュー生成 & 選択キャッシュ対応
    //
    function createMenu() {
        const container = document.createElement('div');
        Object.assign(container.style, { position: 'fixed', zIndex: 2147483647, cursor: 'move' });
        document.body.appendChild(container);

        let lastSelection = '';
        container.addEventListener('mousedown', () => { lastSelection = window.getSelection().toString(); });
        container.addEventListener('touchstart', () => { lastSelection = window.getSelection().toString(); });

        (async () => {
            const pos = await GM_getValue(posLocalKey);
            if (pos && pos.x != null && pos.y != null) {
                container.style.left = pos.x + 'px'; container.style.top = pos.y + 'px';
            } else {
                container.style.left = '16px'; container.style.bottom = '16px';
            }
        })();
        // 表示ボタン
        const mainBtn = document.createElement('button');
        mainBtn.textContent = '≡';
        Object.assign(mainBtn.style, { width: '48px', height: '48px', borderRadius: '8px', background: '#444', color: '#fff', border: 'none', fontSize: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' });
        container.appendChild(mainBtn);

        const menu = document.createElement('div');
        Object.assign(menu.style, { display: 'none', flexDirection: 'column', alignItems: 'stretch', gap: '2px', position: 'absolute', background: '#fff', border: '1px solid #ccc', padding: '4px 0', borderRadius: '4px', boxShadow: '0 0 5px rgba(0,0,0,0.2)', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', width: '180px' });
        container.appendChild(menu);

        function showPalette() {
            const pal = document.createElement('div');
            Object.assign(pal.style, {
                position: 'absolute',
                bottom: '56px',
                left: '0',
                display: 'flex',
                gap: '4px',
                background: '#fff',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 0 5px rgba(0,0,0,0.2)'
            });
            const colors = [
              '#FF0000', '#FF3F00', // 赤、赤-橙中間
              '#FF7F00', '#FFBF00', // 橙、橙-黄中間
              '#FFFF00', '#80FF00', // 黄、黄-緑中間
              '#00FF00', '#0080FF', // 緑、緑-青中間
              '#0000FF', '#2600C1', // 青、青-藍中間
              '#4B0082', '#6B00C0', // 藍、藍-紫中間
              '#8B00FF', '#C5007F'  // 紫、紫-赤中間
            ];
            for (const c of colors) {
                const sw = document.createElement('button');
                Object.assign(sw.style, {
                    background: c,
                    width: '24px',
                    height: '24px',
                    border: '1px solid #999',
                    borderRadius: '4px',
                    cursor: 'pointer'
                });
                sw.addEventListener('click', async () => {
                    const sel = window.getSelection().toString().trim() || lastSelection.trim();
                    if (!sel) { alert('テキストを選択してください'); return; }
                    await addEntry(prefixColor, { text: sel, color: c });
                    applyColor(sel, c);
                    pal.remove();
                });
                pal.appendChild(sw);
            }
            container.appendChild(pal);
        }

        const items = [
            { label: 'カラー', fn: () => { menu.style.display = 'none'; showPalette(); } },
            { label: 'ルビ', fn: async () => { menu.style.display = 'none'; const sel = window.getSelection().toString().trim() || lastSelection.trim(); if (!sel) { alert('テキストを選択してください'); return; } const rub = prompt('表示したいルビを入力してください:', ''); if (!rub) return; await addEntry(prefixRuby, { text: sel, ruby: rub }); applyRuby(sel, rub); } },
            { label: 'コンバート', fn: async () => { menu.style.display = 'none'; const sel = window.getSelection().toString().trim() || lastSelection.trim(); if (!sel) { alert('テキストを選択してください'); return; } const rep = prompt('置換後の文字列を入力してください:', ''); if (rep == null) return; await addEntry(prefixConvert, { text: sel, replace: rep }); applyConvert(sel, rep); } },
            { label: 'ノート', fn: async () => { menu.style.display = 'none'; const sel = window.getSelection().toString().trim() || lastSelection.trim(); if (!sel) { alert('テキストを選択してください'); return; } const note = prompt('ノートを入力してください:', ''); if (note == null) return; await addEntry(prefixNote, { text: sel, note }); applyNote(sel, note); } },
            { label: 'ブックマーク追加', fn: async () => { menu.style.display = 'none'; const sel = window.getSelection().toString().trim() || lastSelection.trim(); if (!sel) { alert('テキストを選択してください'); return; } const tags = prompt('タグをカンマ区切りで入力してください:', ''); if (tags == null) return; const bm = { text: sel, title: document.title, url: location.href, scrollY: window.scrollY, tags: tags.split(',').map(s => s.trim()).filter(Boolean) }; await addEntry(prefixBM, bm); applyBookmark(sel, bm); } },
            { label: 'ブックマーク一覧', fn: openBookmarkList },
            { label: '設定管理', fn: openSettingsManager },
            { label: 'エクスポート', fn: exportAll },
            { label: 'インポート', fn: importAll },
            { label: 'リセット', fn: async () => { menu.style.display = 'none'; const sel = window.getSelection().toString().trim() || lastSelection.trim(); if (sel) { if (!confirm(`「${sel}」の設定を削除しますか？`)) return; await deleteEntryByText(prefixColor, sel); await deleteEntryByText(prefixRuby, sel); await deleteEntryByText(prefixConvert, sel); await deleteEntryByText(prefixNote, sel); await deleteEntryByText(prefixBM, sel); location.reload(); } else { if (!confirm('全設定をリセットしますか？')) return; await resetAll(); location.reload(); } } }
        ];

        for (const it of items) {
            const b = document.createElement('button');
            b.textContent = it.label;
            Object.assign(b.style, { display: 'block', width: '100%', padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap' });
            b.addEventListener('mouseover', () => b.style.background = '#eef');
            b.addEventListener('mouseout', () => b.style.background = 'none');
            b.addEventListener('click', it.fn);
            menu.appendChild(b);
        }

        mainBtn.addEventListener('click', () => {
            if (menu.style.display === 'flex') {
                menu.style.display = 'none';
            } else {
                menu.style.left   = '0';
                menu.style.right  = 'auto';
                menu.style.bottom = '48px';
                menu.style.top    = 'auto';
                menu.style.display = 'flex';
            }
        });
    }

    // メニュー初期化
    createMenu();

})();
