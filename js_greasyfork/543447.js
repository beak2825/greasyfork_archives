// ==UserScript==
// @name         F95 Tag Whitelist Blacklist
// @namespace    http://tampermonkey.net/
// @version      2
// @author       soc9bbmco
// @description  Whitelist Blacklist
// @match        https://f95zone.to/threads/*
// @match        https://f95zone.to/sam/latest_alpha/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543447/F95%20Tag%20Whitelist%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/543447/F95%20Tag%20Whitelist%20Blacklist.meta.js
// ==/UserScript==

(function() {
    
    let Like = GM_getValue('Like', '');
    let Dislike = GM_getValue('Dislike', '');

    GM_registerMenuCommand('settings', openSettings);

    function openSettings() {
        if (document.getElementById('translationWindow')) return;

        const translationWindow = document.createElement('div');
        translationWindow.id = 'translationWindow';
        translationWindow.style.position = 'fixed';
        translationWindow.style.top = '100px';
        translationWindow.style.left = '50%';
        translationWindow.style.transform = 'translateX(-50%)';
        translationWindow.style.background = '#272727';
        translationWindow.style.border = '1px solid #ccc';
        translationWindow.style.padding = '10px';
        translationWindow.style.zIndex = 99999;
        translationWindow.style.width = '300px';
        translationWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        translationWindow.innerHTML = `
      <div id="dragHandle" style="cursor: move; margin-bottom:10px; font-weight:bold;color:#272727; background:#eee; padding:4px;">
        Separate with , (not case sensitive)
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
        <label style="flex:1;color:#FFFFFF;">Like</label>
        <input id="likeInput" type="text" style="flex:2;" value="${Like}">
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <label style="flex:1;color:#FFFFFF;">Dislike</label>
        <input id="dislikeInput" type="text" style="flex:2;" value="${Dislike}">
      </div>
      <div style="display:flex; justify-content:space-between;">
        <button id="saveBtn">Save</button>
        <button id="closeBtn">Exit</button>
      </div>
    `;

        document.body.appendChild(translationWindow);

        makeDraggable(translationWindow, document.getElementById('dragHandle'));

        document.getElementById('saveBtn').onclick = function() {
            let likeVal = document.getElementById('likeInput').value
                .trim()
                .replace(/^,|,$/g, '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .join(',');

            let dislikeVal = document.getElementById('dislikeInput').value
                .trim()
                .replace(/^,|,$/g, '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .join(',');

            Like = likeVal;
            Dislike = dislikeVal;

            GM_setValue('Like', Like);
            GM_setValue('Dislike', Dislike);

            alert('Saved！\nlike: ' + Like + '\ndislike: ' + Dislike);
        };

        document.getElementById('closeBtn').onclick = function() {
            translationWindow.remove();
        };
    }

    function makeDraggable(elmnt, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Threads 頁面功能
    if (location.href.includes('https://f95zone.to/threads/')) {
        const url = window.location.href;
        const parts = url.split("/").filter(Boolean);
        const hasExtra = parts.length > 4;
        if (hasExtra) return;

        const currentUrl2 = document.querySelector('ul[class="p-breadcrumbs "] a[href="/forums/games.2/"]');
        if (!currentUrl2) return;

        const $tagList = $('span.js-tagList');
        const likeTags = [];
        const dislikeTags = [];
        const others = [];

        function includesAnyIgnoreCase(text, keywords) {
            if (!keywords) return false;
            const textLower = text.toLowerCase();
            return keywords.split(',').some(kw => textLower.includes(kw.trim().toLowerCase()));
        }

        $('span.js-tagList a').each(function() {
            const $this = $(this);
            const text = $this.text();
            if (includesAnyIgnoreCase(text, Like)) {
                $this.css({ 'color': '#000000', 'background-color': '#F0F0F0' });
                likeTags.push($this);
            } else if (includesAnyIgnoreCase(text, Dislike)) {
                $this.css('color', 'red');
                dislikeTags.push($this);
            } else {
                others.push($this);
            }
        });

        $tagList.empty();
        likeTags.forEach($el => $tagList.append($el).append(' '));
        dislikeTags.forEach($el => $tagList.append($el).append(' '));
        others.forEach($el => $tagList.append($el).append(' '));
    }

    // SAM 頁面的動態偵測功能
    (function samHoverDetect() {
        if (!location.href.includes('/sam/latest_alpha/')) return;
        console.log('SAM 動態偵測啟動');

        function includesAnyIgnoreCase(text, keywords) {
            if (!keywords) return false;
            const t = text.toLowerCase();
            return keywords.split(',').some(k => t.includes(k.trim().toLowerCase()));
        }

        function processTile(tile) {
            const tagContainer = tile.querySelector('.resource-tile_tags');
            if (!tagContainer) return;

            const tagSpans = tagContainer.querySelectorAll('span');
            if (!tagSpans.length) return;

            let hitLike = false;
            let hitDislike = false;

            tagSpans.forEach(span => {
                const text = span.textContent.trim();

                // 檢查並套用樣式
                if (includesAnyIgnoreCase(text, Like)) {
                    hitLike = true;
                    span.style.backgroundColor = '#F0F0F0';
                    span.style.color = '#000000';
                } else if (includesAnyIgnoreCase(text, Dislike)) {
                    hitDislike = true;
                    span.style.backgroundColor = '#FF0000';
                    span.style.color = '#000000';
                } else {
                    span.style.backgroundColor = '';
                    span.style.color = '';
                }
            });

            if (!hitLike && !hitDislike) return;

            const header = tile.querySelector('.resource-tile_info-header');
            if (!header) return;

            const oldMark = header.querySelector('.sam-like-indicator');
            if (oldMark) oldMark.remove();

            const mark = document.createElement('span');
            mark.className = 'sam-like-indicator';
            mark.style.marginLeft = '8px';
            mark.style.fontSize = '18px';
            mark.textContent =
                (hitLike ? '😀' : '') +
                (hitDislike ? '🤮' : '');

            header.appendChild(mark);
        }

        function setupTileObservers(tile) {
            if (tile.dataset._observerSetup) return;
            tile.dataset._observerSetup = '1';

            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    if (m.type !== 'attributes') return;
                    if (m.attributeName !== 'class') return;

                    const tile = m.target;
                    if (!tile.classList.contains('resource-tile-hover')) return;

                    setTimeout(() => processTile(tile), 100);
                });
            });

            observer.observe(tile, {
                attributes: true,
                attributeFilter: ['class']
            });

            const childObserver = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList?.contains('resource-tile_tags')) {
                            const tile = node.closest('.resource-tile');
                            if (tile && tile.classList.contains('resource-tile-hover')) {
                                processTile(tile);
                            }
                        }
                    });
                });
            });

            childObserver.observe(tile, {
                childList: true,
                subtree: true
            });
        }

        function initExistingTiles() {
            const tiles = document.querySelectorAll('.resource-tile');
            tiles.forEach(tile => setupTileObservers(tile));
        }

        const pageObserver = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('resource-tile')) {
                            setupTileObservers(node);
                        }
                        const tiles = node.querySelectorAll?.('.resource-tile');
                        if (tiles && tiles.length > 0) {
                            tiles.forEach(tile => setupTileObservers(tile));
                        }
                    }
                });
            });
        });

        pageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        initExistingTiles();

        console.log('SAM 監聽器設定完成');
    })();
})();