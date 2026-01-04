// ==UserScript==
// @name         78动漫模型金额转换
// @namespace    http://tampermonkey.net/
// @version      2025-06-26
// @description  金额转换、排序、自动翻页
// @author       You
// @match        https://acg.78dm.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=78dm.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540720/78%E5%8A%A8%E6%BC%AB%E6%A8%A1%E5%9E%8B%E9%87%91%E9%A2%9D%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/540720/78%E5%8A%A8%E6%BC%AB%E6%A8%A1%E5%9E%8B%E9%87%91%E9%A2%9D%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 汇率常量（动态获取）
    let JPY2CNY = 0.049; // 默认值
    function fetchJPY2CNYRate(callback) {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const storageKey = 'JPY2CNY_ALL';
        let allRates = {};
        try { allRates = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch (e) {}
        if (allRates[today]) {
            JPY2CNY = parseFloat(allRates[today]);
            if (typeof callback === 'function') callback(JPY2CNY);
            return;
        }
        fetch('https://api.exchangerate.host/latest?base=JPY&symbols=CNY')
            .then(r => r.json())
            .then(data => {
                if (data && data.rates && data.rates.CNY) {
                    JPY2CNY = data.rates.CNY;
                    allRates[today] = JPY2CNY;
                    localStorage.setItem(storageKey, JSON.stringify(allRates));
                    if (typeof callback === 'function') callback(JPY2CNY);
                } else {
                    if (typeof callback === 'function') callback(JPY2CNY);
                }
            })
            .catch(() => { if (typeof callback === 'function') callback(JPY2CNY); });
    }

    // 金额转换：日元转人民币
    function convertYenToCNY() {
        // <p class="price">10500</p> 转换
        document.querySelectorAll('p.price').forEach(function(p) {
            // 只对未转换过的进行转换
            let jpy = null;
            if (p.title && /\d+ 日元/.test(p.title)) {
                jpy = parseFloat(p.title);
            } else {
                jpy = parseFloat(p.textContent.replace(/[^\d.]/g, ''));
            }
            if (!isNaN(jpy)) {
                const cny = (jpy * JPY2CNY).toFixed(2);
                p.title = `${jpy} 日元`;
                p.textContent = `${cny} 元人民币`;
            }
        });
        // 6000日元 追加人民币
        document.querySelectorAll('body *:not(script):not(style)').forEach(function(el) {
            if (el.innerHTML.match(/\d+日元/) && !el.innerHTML.includes('元人民币')) {
                el.innerHTML = el.innerHTML.replace(/(\d+(?:\.\d+)?)日元(?!（\d+\.\d+元人民币）)/g, function(match, jpy) {
                    const cny = (parseFloat(jpy) * JPY2CNY).toFixed(2);
                    return `${jpy}日元（${cny}元人民币）`;
                });
            }
        });
    }

    // 懒加载图片（IntersectionObserver优先）
    function lazyLoadImagesIO() {
        if (!('IntersectionObserver' in window)) {
            // 兼容老浏览器，降级为原有方案
            lazyLoadImages();
            window.addEventListener('scroll', lazyLoadImages);
            window.addEventListener('resize', lazyLoadImages);
            return;
        }
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src && !img.dataset.loaded) {
                        img.src = img.dataset.src;
                        img.dataset.loaded = '1';
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '200px' });
        document.querySelectorAll('img.lazy[data-src]:not([data-loaded])').forEach(img => {
            io.observe(img);
        });
    }

    // 提取评分和人数并保存到localStorage
    function extractAndSaveScore(id, html) {
        // 追加：<label for="want">想入（<span id="wishCount">175</span>）</label>，提取wishCount
        // 追加：<label for="has">已入（<span id="haveCount">1468</span>）</label>，提取haveCount
        // 追加：<p class="is-flex">评论<span style="color: #888;">(122)</span></p>，提取评论数
        let score = null, userCount = 0, wishCount = 0, haveCount = 0, commentCount = 0;
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const scoreEl = doc.querySelector('h4#average');
            const userEl = doc.querySelector('#sumUser');
            const wishEl = doc.querySelector('#wishCount');
            const haveEl = doc.querySelector('#haveCount');
            const commentEl = doc.querySelector('p.is-flex span[style*="color: #888"]');

            if (scoreEl) score = parseFloat(scoreEl.textContent.trim());
            if (userEl) userCount = parseInt(userEl.textContent.trim());
            if (wishEl) wishCount = parseInt(wishEl.textContent.trim());
            if (haveEl) haveCount = parseInt(haveEl.textContent.trim());
            if (commentEl) {
                const commentMatch = commentEl.textContent.match(/\((\d+)\)/);
                if (commentMatch) commentCount = parseInt(commentMatch[1]);
            }
        } catch (e) {}
        if (score !== null && !isNaN(score)) {
            let scoreObj2 = {};
            try { scoreObj2 = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
            scoreObj2[id] = [score, userCount, wishCount, haveCount, commentCount];
            localStorage.setItem('score', JSON.stringify(scoreObj2));
        }
    }

    // 为卡片渲染评分人数div
    function renderScoreDivForCard(card, scoreArr) {
        if (scoreArr && Array.isArray(scoreArr)) {
            const score = parseFloat(scoreArr[0]);
            const userCount = parseInt(scoreArr[1]);
            const wishCount = parseInt(scoreArr[2]) || 0;
            const haveCount = parseInt(scoreArr[3]) || 0;
            const commentCount = parseInt(scoreArr[4]) || 0;
            let hot = userCount + wishCount * 0.2 + haveCount * 0.2 + commentCount * 0.3;
            let weighted = score * (1 - Math.exp(-hot / 100));
            if (!isNaN(score) && !isNaN(userCount)) {
                weighted = (score * (1 - Math.exp(-hot / 100))).toFixed(2);
            }
            if (card.querySelector('.score-info')) return;
            // 获取当前排序类型
            let type = 'score';
            try { type = JSON.parse(localStorage.getItem('sortParams')||'{}').type || 'score'; } catch(e){}
            // 高亮样式
            const highlight = 'color:#d32f2f;font-weight:bold;';
            // 普通样式
            const normal = 'color:#666;';
            // 评分项
            const scoreStyle = (type==='score'?highlight:'color:#1976d2;font-weight:bold;');
            const weightedStyle = (type==='weighted'?highlight:normal);
            const userCountStyle = (type==='userCount'?highlight:normal);
            const wishCountStyle = (type==='wishCount'?highlight:normal);
            const haveCountStyle = (type==='haveCount'?highlight:normal);
            const commentCountStyle = (type==='commentCount'?highlight:normal);
            // 渲染
            const scoreInfoDiv = document.createElement('div');
            scoreInfoDiv.className = 'score-info';
            scoreInfoDiv.style.cssText = 'padding:6px;background:#fff;border-radius:4px;font-size:11px;line-height:1.3;width:100%;box-sizing:border-box;display:flex;flex-wrap:wrap;';
            scoreInfoDiv.innerHTML = `
                <div style="width:50%;text-align:left;box-sizing:border-box;${scoreStyle}">评分：${score} / 10</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;${weightedStyle}">权重：${weighted}，${userCount}人</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;${wishCountStyle}">想入：${wishCount}</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;${haveCountStyle}">已入：${haveCount}</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;${commentCountStyle}">评论：${commentCount}条</div>
            `;
            const inner = card.querySelector('.inner');
            if (inner && inner.parentNode) {
                inner.parentNode.insertBefore(scoreInfoDiv, inner.nextSibling);
            }
        }
    }

    // 详情页：提取评分和人数
    function handleDetailPage() {
        const match = location.pathname.match(/^\/ct\/(\d+)\.html$/);
        if (!match) return;
        const id = match[1];
        const scoreEl = document.querySelector('h4#average');
        const userEl = document.querySelector('#sumUser');
        const wishEl = document.querySelector('#wishCount');
        const haveEl = document.querySelector('#haveCount');
        const commentEl = document.querySelector('p.is-flex span[style*="color: #888"]');
        if (scoreEl) {
            const score = parseFloat(scoreEl.textContent.trim());
            const userCount = userEl ? parseInt(userEl.textContent.trim()) : 0;
            const wishCount = wishEl ? parseInt(wishEl.textContent.trim()) : 0;
            const haveCount = haveEl ? parseInt(haveEl.textContent.trim()) : 0;
            let commentCount = 0;
            if (commentEl) {
                const commentMatch = commentEl.textContent.match(/\((\d+)\)/);
                if (commentMatch) commentCount = parseInt(commentMatch[1]);
            }
            if (!isNaN(score)) {
                let scoreObj = {};
                try { scoreObj = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                scoreObj[id] = [score, userCount, wishCount, haveCount, commentCount];
                localStorage.setItem('score', JSON.stringify(scoreObj));
            }
        }
    }

    // 列表页：渲染评分、金额、图片懒加载、排序、自动翻页
    function handleListPage() {
        // 读取本地参数
        let sortParams = {type:'score',order:'desc',mode:'click',next:'off'};
        try { sortParams = Object.assign(sortParams, JSON.parse(localStorage.getItem('sortParams')||'{}')); } catch(e){}
        let loadingNext = false;

        // 渲染排序条
        function renderSortBar() {
            const updateDaysDiv = document.getElementById('updateDays');
            if (!updateDaysDiv || document.getElementById('sort-bar')) return;
            const sortDiv = document.createElement('div');
            sortDiv.id = 'sort-bar';
            sortDiv.style = 'margin:10px 0;padding:8px 12px;background:#f5f5f5;border-radius:6px;display:block;background:#fff;';
            sortDiv.innerHTML = `
                <div id="sort-type-row" style="margin-bottom:6px;font-size:12px;">
                    <span style="margin-right:8px;">排序</span>
                    <a href="#" data-type="score" class="sort-type-btn">评分</a>
                    <a href="#" data-type="weighted" class="sort-type-btn">权重</a>
                    <a href="#" data-type="userCount" class="sort-type-btn">人数</a>
                    <a href="#" data-type="wishCount" class="sort-type-btn">想入</a>
                    <a href="#" data-type="haveCount" class="sort-type-btn">已入</a>
                    <a href="#" data-type="commentCount" class="sort-type-btn">评论</a>
                </div>
                <div id="sort-order-row" style="margin-bottom:6px;font-size:12px;">
                    <span style="margin-right:8px;">顺序</span>
                    <a href="#" data-order="desc" class="sort-order-btn">降序</a>
                    <a href="#" data-order="asc" class="sort-order-btn">升序</a>
                </div>
                <div id="sort-mode-row" style="margin-bottom:6px;font-size:12px;">
                    <span style="margin-right:8px;">方式</span>
                    <a href="#" data-mode="click" class="sort-mode-btn">点击</a>
                    <a href="#" data-mode="auto" class="sort-mode-btn">自动</a>
                </div>
                <div id="sort-next-row" style="margin-bottom:6px;font-size:12px;">
                    <span style="margin-right:8px;">自动翻页</span>
                    <a href="#" data-next="on" class="sort-next-btn">是</a>
                    <a href="#" data-next="off" class="sort-next-btn">否</a>
                    <a href="#" data-next="5" class="sort-next-btn">加载5页</a>
                </div>
                <button id="sort-btn" style="margin-top:4px; width: 80%;font-size:12px;">排序</button>
                <div id="sort-next-row" style="margin-bottom:6px;font-size:12px;">
                    <span style="margin-right:8px;">本地列表</span>
                    <a href="#" data-action="save" class="sort-list-btn">保存</a>
                    <a href="#" data-action="load" class="sort-list-btn">读取</a>
                    <a href="#" data-action="clear" class="sort-list-btn">清空</a>
                    <a href="#" data-action="update" class="sort-list-btn">更新</a>
                    <a href="#" id="usercount-dist-btn" class="sort-list-btn" style="color:#d32f2f;">评分人数-卡片分布</a>
                </div>
                <style>
                    #sort-bar, #sort-bar * {font-size:12px !important;}
                    #sort-bar a.sort-type-btn, #sort-bar a.sort-order-btn, #sort-bar a.sort-mode-btn, #sort-bar a.sort-next-btn, #sort-bar a.sort-list-btn {
                        display:inline-block;padding:2px 2px;border-radius:4px;text-decoration:none;transition:all .2s;font-size:12px !important;
                    }
                    #sort-bar a.selected {background:#1976d2;color:#fff !important;}
                    #sort-bar a:not(.selected) {background:transparent;color:#222;}
                    #sort-btn {font-size:12px !important;}
                </style>
            `;
            updateDaysDiv.parentNode.insertBefore(sortDiv, updateDaysDiv.nextSibling);

            function updateSortBarUI() {
                document.querySelectorAll('#sort-bar a.sort-type-btn').forEach(a=>{
                    a.classList.toggle('selected', a.dataset.type===sortParams.type);
                });
                document.querySelectorAll('#sort-bar a.sort-order-btn').forEach(a=>{
                    a.classList.toggle('selected', a.dataset.order===sortParams.order);
                });
                document.querySelectorAll('#sort-bar a.sort-mode-btn').forEach(a=>{
                    a.classList.toggle('selected', a.dataset.mode===sortParams.mode);
                });
                document.querySelectorAll('#sort-bar a.sort-next-btn').forEach(a=>{
                    a.classList.toggle('selected', a.dataset.next===sortParams.next);
                });
            }
            updateSortBarUI();

            // 事件绑定
            document.querySelectorAll('#sort-bar a.sort-type-btn').forEach(a=>{
                a.onclick = function(e){e.preventDefault();sortParams.type=this.dataset.type;updateSortBarUI();if(sortParams.mode==='auto')doSort();};
            });
            document.querySelectorAll('#sort-bar a.sort-order-btn').forEach(a=>{
                a.onclick = function(e){e.preventDefault();sortParams.order=this.dataset.order;updateSortBarUI();if(sortParams.mode==='auto')doSort();};
            });
            document.querySelectorAll('#sort-bar a.sort-mode-btn').forEach(a=>{
                a.onclick = function(e){e.preventDefault();sortParams.mode=this.dataset.mode;updateSortBarUI();if(sortParams.mode==='auto')doSort();};
            });
            document.querySelectorAll('#sort-bar a.sort-next-btn').forEach(a=>{
                a.onclick = function(e){e.preventDefault();sortParams.next=this.dataset.next;updateSortBarUI();localStorage.setItem('sortParams', JSON.stringify(sortParams));
                    if(this.dataset.next==='5') { window.dispatchEvent(new Event('autoLoad5Pages')); }
                };
            });
            document.getElementById('sort-btn').onclick = doSort;
            // 本地列表功能
            document.querySelectorAll('#sort-bar a.sort-list-btn').forEach(a=>{
                a.onclick = function(e){
                    e.preventDefault();
                    const action = this.dataset.action;
                    if (action === 'save') {
                        // 保存前移除所有score-info
                        document.querySelectorAll('.column.is-narrow.is-4 .score-info').forEach(el=>el.remove());
                        const listContainer = document.querySelector('.columns.is-mobile.is-multiline.single-columns.list-mode.is-active');
                        if (listContainer) {
                            // 提取所有商品卡片，按href分组保存
                            const cards = listContainer.querySelectorAll('.column.is-narrow.is-4');
                            let listHtmlObj = {};
                            try { listHtmlObj = JSON.parse(localStorage.getItem('listHtml')) || {}; } catch (e) {}

                            cards.forEach(card => {
                                // 保存前再次移除score-info，确保干净
                                card.querySelectorAll('.score-info').forEach(el=>el.remove());
                                const link = card.querySelector('a[href^="/ct/"]');
                                if (link) {
                                    const href = link.getAttribute('href');
                                    listHtmlObj[href] = card.outerHTML;
                                }
                            });

                            localStorage.setItem('listHtml', JSON.stringify(listHtmlObj));
                            alert(`已保存 ${Object.keys(listHtmlObj).length} 个商品卡片！`);
                        }
                    } else if (action === 'update') {
                        // 更新按钮：移除所有score-info，不再渲染新的score-info
                        document.querySelectorAll('.column.is-narrow.is-4 .score-info').forEach(el=>el.remove());
                        alert('所有评分信息已移除，页面已还原为纯净卡片！');
                    } else if (action === 'load') {
                        let listHtmlObj = {};
                        try { listHtmlObj = JSON.parse(localStorage.getItem('listHtml')) || {}; } catch (e) {}
                        if (Object.keys(listHtmlObj).length > 0) {
                            const listContainer = document.querySelector('.columns.is-mobile.is-multiline.single-columns.list-mode.is-active');
                            if (listContainer) {
                                // 清空现有内容
                                listContainer.innerHTML = '';

                                // 获取所有保存的卡片数据
                                let cardData = listHtmlObj;
                                const totalCount = Object.keys(cardData).length;

                                // 如果超过500个，按排序规则只加载前500个
                                if (totalCount > 500) {
                                    // 创建临时容器来排序
                                    const tempContainer = document.createElement('div');
                                    tempContainer.style.display = 'none';
                                    document.body.appendChild(tempContainer);

                                    // 将所有卡片添加到临时容器
                                    Object.values(cardData).forEach(cardHtml => {
                                        tempContainer.insertAdjacentHTML('beforeend', cardHtml);
                                    });

                                    // 获取所有卡片元素并排序
                                    const cards = Array.from(tempContainer.querySelectorAll('.column.is-narrow.is-4'));
                                    let scoreObj = {};
                                    try { scoreObj = JSON.parse(localStorage.getItem('score'))||{}; } catch(e){}

                                    cards.sort((a, b) => {
                                        function getVal(card) {
                                            const aTag = card.querySelector('a[href^="/ct/"]');
                                            if (!aTag) return -Infinity;
                                            const idMatch = aTag.getAttribute('href').match(/\/ct\/(\d+)\.html/);
                                            if (!idMatch) return -Infinity;
                                            const arr = scoreObj[idMatch[1]];
                                            if (!arr) return -Infinity;
                                            const score = parseFloat(arr[0]);
                                            const userCount = parseInt(arr[1]);
                                            const wishCount = parseInt(arr[2]) || 0;
                                            const haveCount = parseInt(arr[3]) || 0;
                                            const commentCount = parseInt(arr[4]) || 0;
                                            const hot = userCount + wishCount * 0.2 + haveCount * 0.2 + commentCount * 0.3;
                                            const weighted = score * (1 - Math.exp(-hot / 100));
                                            if (sortParams.type === 'score') return score;
                                            if (sortParams.type === 'userCount') return userCount;
                                            if (sortParams.type === 'weighted') return weighted;
                                            if (sortParams.type === 'wishCount') return wishCount;
                                            if (sortParams.type === 'haveCount') return haveCount;
                                            if (sortParams.type === 'commentCount') return commentCount;
                                            return score;
                                        }
                                        let va = getVal(a), vb = getVal(b);
                                        if (isNaN(va)) va = -Infinity;
                                        if (isNaN(vb)) vb = -Infinity;
                                        if (sortParams.order === 'asc') return va - vb;
                                        return vb - va;
                                    });

                                    // 只取前500个
                                    const top500Cards = cards.slice(0, 500);
                                    top500Cards.forEach(card => {
                                        listContainer.appendChild(card);
                                    });

                                    // 移除临时容器
                                    document.body.removeChild(tempContainer);

                                    alert(`已加载前500个商品（共${totalCount}个），按${sortParams.type}${sortParams.order === 'desc' ? '降序' : '升序'}排列！`);
                                } else {
                                    // 不超过500个，直接加载所有
                                    Object.values(cardData).forEach(cardHtml => {
                                        listContainer.insertAdjacentHTML('beforeend', cardHtml);
                                    });
                                    alert(`已加载 ${totalCount} 个商品卡片！`);
                                }

                                setTimeout(() => {
                                    lazyLoadImagesIO();
                                    convertYenToCNY();
                                    // 重新渲染评分
                                    renderAllCardScores();
                                    // 如果自动排序模式，重新排序
                                    if (sortParams.mode === 'auto') doSort();
                                }, 100);
                            }
                        } else {
                            alert('没有保存的列表！');
                        }
                    } else if (action === 'clear') {
                        if (confirm('确定要清空所有保存的列表吗？')) {
                            localStorage.removeItem('listHtml');
                            alert('所有列表已清空！');
                        }
                    }
                };
            });

            // 评分人数分布按钮事件
            setTimeout(()=>{
                const distBtn = document.getElementById('usercount-dist-btn');
                if(distBtn){
                    distBtn.onclick = function(e){
                        e.preventDefault();
                        // 统计分布区间
                        let scoreObj = {};
                        try { scoreObj = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                        const bins = [0,10,50,100,300,500,1000,2000,999999];
                        const binLabels = ['0-9','10-49','50-99','100-299','300-499','500-999','1000-1999','2000+'];
                        const binCount = Array(binLabels.length).fill(0);
                        Object.values(scoreObj).forEach(arr=>{
                            const n = parseInt(arr[1]);
                            for(let i=0;i<bins.length-1;i++){
                                if(n>=bins[i] && n<bins[i+1]){ binCount[i]++; break; }
                            }
                        });
                        let msg = '评分人数分布：\n';
                        for(let i=0;i<binLabels.length;i++){
                            msg += `${binLabels[i]}：${binCount[i]}\n`;
                        }
                        alert(msg);
                        console.log(msg);
                    }
                }
            },200);
        }

        // 排序逻辑
        function doSort() {
            localStorage.setItem('sortParams', JSON.stringify(sortParams));
            const cards = Array.from(document.querySelectorAll('.column.is-narrow.is-4'));
            let scoreObj = {};
            try { scoreObj = JSON.parse(localStorage.getItem('score'))||{}; } catch(e){}
            cards.sort((a, b) => {
                function getVal(card) {
                    const aTag = card.querySelector('a[href^="/ct/"]');
                    if (!aTag) return -Infinity;
                    const idMatch = aTag.getAttribute('href').match(/\/ct\/(\d+)\.html/);
                    if (!idMatch) return -Infinity;
                    const arr = scoreObj[idMatch[1]];
                    if (!arr) return -Infinity;
                    const score = parseFloat(arr[0]);
                    const userCount = parseInt(arr[1]);
                    const wishCount = parseInt(arr[2]) || 0;
                    const haveCount = parseInt(arr[3]) || 0;
                    const commentCount = parseInt(arr[4]) || 0;
                    const hot = userCount + wishCount * 0.2 + haveCount * 0.2 + commentCount * 0.3;
                    const weighted = score * (1 - Math.exp(-hot / 100));
                    if (sortParams.type === 'score') return score;
                    if (sortParams.type === 'userCount') return userCount;
                    if (sortParams.type === 'weighted') return weighted;
                    if (sortParams.type === 'wishCount') return wishCount;
                    if (sortParams.type === 'haveCount') return haveCount;
                    if (sortParams.type === 'commentCount') return commentCount;
                    return score;
                }
                let va = getVal(a), vb = getVal(b);
                if (isNaN(va)) va = -Infinity;
                if (isNaN(vb)) vb = -Infinity;
                if (sortParams.order === 'asc') return va - vb;
                return vb - va;
            });
            const parent = cards[0]?.parentNode;
            if (parent) cards.forEach(card => parent.appendChild(card));
        }

        // 渲染所有卡片评分div
        function renderAllCardScores() {
            let scoreObj = {};
            try { scoreObj = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
            document.querySelectorAll('.column.is-narrow.is-4').forEach(function(card) {
                const a = card.querySelector('a[href^="/ct/"]');
                if (a) {
                    const idMatch = a.getAttribute('href').match(/\/ct\/(\d+)\.html/);
                    if (idMatch) {
                        if (scoreObj[idMatch[1]]) {
                            renderScoreDivForCard(card, scoreObj[idMatch[1]]);
                        } else {
                            fetch(`/ct/${idMatch[1]}.html`).then(r=>r.text()).then(html=>{
                                extractAndSaveScore(idMatch[1], html);
                                let scoreObj2 = {};
                                try { scoreObj2 = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                                renderScoreDivForCard(card, scoreObj2[idMatch[1]]);
                            });
                        }
                    }
                }
            });
        }

        // 自动翻页/加载下5页
        function setupAutoPaging() {
            // 自动翻页（滚动触底）
            let loadingNext = false;
            function tryLoadNextPage() {
                if (loadingNext) return;
                if (sortParams.next !== 'on') return;
                if (window.innerHeight + window.scrollY < document.body.offsetHeight - 100) return;
                const nextBtn = document.querySelector('.pagination li.next a');
                if (nextBtn && !nextBtn.classList.contains('disabled')) {
                    const nextUrl = nextBtn.getAttribute('href');
                    if (nextUrl) {
                        loadingNext = true;
                        fetch(nextUrl).then(r=>r.text()).then(html=>{
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const newCards = doc.querySelectorAll('.column.is-narrow.is-4');
                            const parent = document.querySelector('.column.is-narrow.is-4')?.parentNode;
                            newCards.forEach(card=>{
                                parent.appendChild(card);
                                // 新增卡片后渲染评分div
                                const a = card.querySelector('a[href^="/ct/"]');
                                if (a) {
                                    const idMatch = a.getAttribute('href').match(/\/ct\/(\d+)\.html/);
                                    if (idMatch) {
                                        let scoreObj2 = {};
                                        try { scoreObj2 = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                                        if (scoreObj2[idMatch[1]]) {
                                            renderScoreDivForCard(card, scoreObj2[idMatch[1]]);
                                        } else {
                                            fetch(`/ct/${idMatch[1]}.html`).then(r=>r.text()).then(html=>{
                                                extractAndSaveScore(idMatch[1], html);
                                                let scoreObj3 = {};
                                                try { scoreObj3 = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                                                renderScoreDivForCard(card, scoreObj3[idMatch[1]]);
                                            });
                                        }
                                    }
                                }
                            });
                            // 新增卡片后也触发一次图片懒加载和金额转换
                            setTimeout(lazyLoadImagesIO, 100);
                            setTimeout(lazyLoadImagesIO, 400);
                            setTimeout(convertYenToCNY, 100);
                            // 新增卡片后自动排序（如模式为auto）
                            if (typeof doSort === 'function' && sortParams.mode === 'auto') { doSort(); }
                            // 覆盖分页条
                            const newPage = doc.querySelector('.pagination');
                            const oldPage = document.querySelector('.pagination');
                            if (newPage && oldPage) oldPage.outerHTML = newPage.outerHTML;
                            loadingNext = false;
                        });
                    }
                }
            }
            window.addEventListener('scroll', tryLoadNextPage);

            // 自动加载下5页
            window.addEventListener('autoLoad5Pages', function(){
                if (sortParams.next !== '5') return;
                let pageCount = 0;
                function loadNext5() {
                    if (pageCount >= 5) {
                        // 5页加载完成后，触发首次加载完成事件
                        if (!hasLoadedInitial5) {
                            setTimeout(() => window.dispatchEvent(new Event('initial5PagesLoaded')), 500);
                        }
                        return;
                    }
                    const nextBtn = document.querySelector('.pagination li.next a');
                    if (nextBtn && !nextBtn.classList.contains('disabled')) {
                        const nextUrl = nextBtn.getAttribute('href');
                        if (nextUrl) {
                            fetch(nextUrl).then(r=>r.text()).then(html=>{
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const newCards = doc.querySelectorAll('.column.is-narrow.is-4');
                                const parent = document.querySelector('.column.is-narrow.is-4')?.parentNode;
                                newCards.forEach(card=>{
                                    parent.appendChild(card);
                                    // 新增卡片后渲染评分div
                                    const a = card.querySelector('a[href^="/ct/"]');
                                    if (a) {
                                        const idMatch = a.getAttribute('href').match(/\/ct\/(\d+)\.html/);
                                        if (idMatch) {
                                            let scoreObj2 = {};
                                            try { scoreObj2 = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                                            if (scoreObj2[idMatch[1]]) {
                                                renderScoreDivForCard(card, scoreObj2[idMatch[1]]);
                                            } else {
                                                fetch(`/ct/${idMatch[1]}.html`).then(r=>r.text()).then(html=>{
                                                    extractAndSaveScore(idMatch[1], html);
                                                    let scoreObj3 = {};
                                                    try { scoreObj3 = JSON.parse(localStorage.getItem('score')) || {}; } catch (e) {}
                                                    renderScoreDivForCard(card, scoreObj3[idMatch[1]]);
                                                });
                                            }
                                        }
                                    }
                                });
                                setTimeout(lazyLoadImagesIO, 100);
                                setTimeout(lazyLoadImagesIO, 400);
                                setTimeout(convertYenToCNY, 100);
                                // 新增卡片后自动排序（如模式为auto）
                                if (typeof doSort === 'function' && sortParams.mode === 'auto') { doSort(); }
                                const newPage = doc.querySelector('.pagination');
                                const oldPage = document.querySelector('.pagination');
                                if (newPage && oldPage) oldPage.outerHTML = newPage.outerHTML;
                                pageCount++;
                                setTimeout(loadNext5, 200);
                            });
                        } else {
                            // 没有下一页时，也要触发首次加载完成事件
                            if (!hasLoadedInitial5) {
                                setTimeout(() => window.dispatchEvent(new Event('initial5PagesLoaded')), 500);
                            }
                        }
                    } else {
                        // 没有下一页时，也要触发首次加载完成事件
                        if (!hasLoadedInitial5) {
                            setTimeout(() => window.dispatchEvent(new Event('initial5PagesLoaded')), 500);
                        }
                    }
                }
                loadNext5();
            });
            if (sortParams.next === '5') window.dispatchEvent(new Event('autoLoad5Pages'));

            // 首次加载5页后，滚动到底部继续加载下5页
            let hasLoadedInitial5 = false;
            function tryLoadNext5AfterInitial() {
                if (!hasLoadedInitial5 || sortParams.next !== '5') return;
                if (window.innerHeight + window.scrollY < document.body.offsetHeight - 100) return;
                const nextBtn = document.querySelector('.pagination li.next a');
                if (nextBtn && !nextBtn.classList.contains('disabled')) {
                    window.dispatchEvent(new Event('autoLoad5Pages'));
                }
            }
            // 监听首次5页加载完成
            window.addEventListener('initial5PagesLoaded', function() {
                hasLoadedInitial5 = true;
                window.addEventListener('scroll', tryLoadNext5AfterInitial);
            });
        }

        // 初始化
        renderSortBar();
        renderAllCardScores();
        fetchJPY2CNYRate(convertYenToCNY);
        lazyLoadImagesIO();
        setupAutoPaging();
        // 自动排序
        if (sortParams.mode === 'auto') doSort();
        // 监听窗口变化
        window.addEventListener('resize', lazyLoadImagesIO);
        setTimeout(lazyLoadImagesIO, 300);
        setTimeout(() => fetchJPY2CNYRate(convertYenToCNY), 300);
    }

    // 添加CSS样式覆盖
    function addCssStyle(){
        return;
        const style = document.createElement('style');
        style.textContent = `
            .single-columns.list-mode .column .inner .is-right .is-top {
                max-height: 12.3125rem !important;
            }
            .single-columns.list-mode .column .inner .is-right h2 {
                height: 6.375rem !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 页面初始化
    if (location.pathname.match(/^\/ct\/(\d+)\.html$/)) {
        // 详情页
        handleDetailPage();
        fetchJPY2CNYRate(convertYenToCNY);
    } else if (location.pathname.match(/^\/p\//)) {
        // 列表页
        handleListPage();
        addCssStyle();
    } else {
        // 其他页面也可做金额转换和图片懒加载
        fetchJPY2CNYRate(convertYenToCNY);
        lazyLoadImagesIO();
        window.addEventListener('resize', lazyLoadImagesIO);
        setTimeout(lazyLoadImagesIO, 300);
        setTimeout(() => fetchJPY2CNYRate(convertYenToCNY), 300);
    }
})();

function page_demo_html(){
    const demo_html = `<ul class="pagination"><li class="prev disabled"><span>上一页</span></li>
<li class="active"><a href="/p/4_1_2024_0_0/1.html" data-page="0">1</a></li>
<li><a href="/p/4_1_2024_0_0/2.html" data-page="1">2</a></li>
<li><a href="/p/4_1_2024_0_0/3.html" data-page="2">3</a></li>
<li class="ellipsis disabled"><span>…</span></li>
<li class="last"><a href="/p/4_1_2024_0_0/5.html" data-page="4">5</a></li>
<li class="next"><a href="/p/4_1_2024_0_0/2.html" data-page="1">下一页</a></li>
                <div class="form go-to-page">
                    <span class="text">跳到</span>
                    <input class="input" type="number" value="1" min="1" max="5" aria-label="页码输入框">
                    <span class="text">页</span>
                    <button class="button btn go-page" role="button" tabindex="0"> 确定 </button>
                </div>  </ul>`
}


function list_demo_html() {
    // 平台页面样式参考
    // .single-columns.list-mode .column .inner{display: flex;width: 100%;font-size: 0.75rem;color: #434343;background-color: #fff;border-radius: .25rem;overflow: hidden;}
    // .single-columns.list-mode .column .inner .is-left{flex: none;    width: 44.674%;}
    // .single-columns.list-mode .column .inner .is-right{width: calc(100% - 5rem);    padding: .75rem .75rem .75rem 1rem;    justify-content: space-between;}
    const demo_html = `<div class="column is-narrow is-4">
                            <div class="inner">
                                <div class="is-left">
                                    <a class="image is-4by5" href="/ct/421693.html" target="_blank" data-pjax="0">
                                        <img class="lazy" loading="lazy" src="//bbs-attachment-cdn.78dm.net/upload/2024/08/05de43e1cb9b52b3bb6864edc749dc73-w180h180" data-src="//bbs-attachment-cdn.78dm.net/upload/2024/08/05de43e1cb9b52b3bb6864edc749dc73-w180h180" data-loaded="1" style="background: none;">
                                    </a>
                                </div>
                                <div class="is-right">
                                    <div class="is-top is-flex">
                                        <h2><a href="/ct/421693.html" target="_blank" data-pjax="0">HGUC 网限版 飞龙高达</a></h2>
                                        <div>
                                            <p class="sale-time">2024.11 发售</p>
                                        </div>
                                        <div>
                                            <a class="brand" href="" target="_blank"></a>
                                        </div>
                                    </div>
                                    <div class="is-bottom">
                                        <p class="price">未知</p>
                                    </div>
                                </div>
                            </div><div class="score-info" style="padding: 6px; background: rgb(255, 255, 255); border-radius: 4px; font-size: 11px; line-height: 1.3; width: 100%; box-sizing: border-box; display: flex; flex-wrap: wrap;">
                <div style="width:50%;text-align:left;box-sizing:border-box;color:#1976d2;font-weight:bold;">评分：9.5 / 10</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;color:#666;">权重：8.08，57人</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;color:#666;">想入/已入：361 / 270</div>
                <div style="width:50%;text-align:left;box-sizing:border-box;color:#666;">评论：229条</div>
            </div>
                        </div><div class="column is-narrow is-4">...</div>`
}
function filter_demo_html(){
    const demo_html = `<div class="tile is-parent is-vertical databank-content-right">
    <form class="field is-grouped search-field" action="//www.78dm.net/search" method="get" target="_blank">
        <p class="control has-icons-right search-bar">
            <input class="input is-rounded" placeholder="输入搜索文字" name="keyword" maxlength="40">
            <button class="button icon is-right" type="submit"><span class="is-small is-marginless is-flex"><i class="search-icon is-block"></i></span>
            </button>
        </p>
    </form>
    <div class="screen">
        <p class="screen-title is-flex"><span class="line"></span>筛选</p>
        <div class="screen-item">
            <div class="screen-item-title is-flex"><span>发售时间：</span>
                <div class="is-flex"><a class="item " href="/p/4_1_0_0_0/1.html">全部</a><a class="item " href="/p/4_1_2025_06_24/1.html">今天</a><a class="item  " href="/p/4_1_2025_06_0/1.html">当月</a>
                </div>
            </div>
            <div class="columns is-mobile is-multiline is-marginless years"><a class="column is-narrow " href="/p/4_1_0_0_0/1.html" data-id="1" data-key="0">全部</a><a class="column is-narrow " href="/p/4_1_2026_0_0/1.html" data-id="1" data-key="0">2026</a><a class="column is-narrow " href="/p/4_1_2025_0_0/1.html" data-id="1"
                data-key="0">2025</a><a class="column is-narrow actived" href="/p/4_1_2024_0_0/1.html" data-id="1" data-key="0">2024</a><a class="column is-narrow more-year " style="display: none" href="/p/4_1_1968_0_0/1.html" data-id="1" data-key="0">1968</a><a class="column is-narrow show-more-years"
                onclick="showMoreYears(this);">更多</a>
            </div>
            <div id="updateMonths" class="columns is-mobile is-multiline is-marginless months" data-id="1" style="display: flex;">
                <div class="times-line"></div><a class="column is-narrow actived" href="/p/4_1_2024_0_0/1.html" data-id="1" data-key="0">全部</a><a class="column is-narrow " href="/p/4_1_2024_1_0/1.html" data-id="1" data-key="0">1月</a><a class="column is-narrow " href="/p/4_1_2024_2_0/1.html"
                data-id="1" data-key="0">2月</a><a class="column is-narrow " href="/p/4_1_2024_3_0/1.html" data-id="1" data-key="0">3月</a><a class="column is-narrow " href="/p/4_1_2024_4_0/1.html" data-id="1" data-key="0">4月</a><a class="column is-narrow " href="/p/4_1_2024_5_0/1.html"
                data-id="1" data-key="0">5月</a><a class="column is-narrow " href="/p/4_1_2024_6_0/1.html" data-id="1" data-key="0">6月</a><a class="column is-narrow " href="/p/4_1_2024_7_0/1.html" data-id="1" data-key="0">7月</a><a class="column is-narrow " href="/p/4_1_2024_8_0/1.html"
                data-id="1" data-key="0">8月</a><a class="column is-narrow " href="/p/4_1_2024_9_0/1.html" data-id="1" data-key="0">9月</a><a class="column is-narrow " href="/p/4_1_2024_10_0/1.html" data-id="1" data-key="0">10月</a><a class="column is-narrow " href="/p/4_1_2024_11_0/1.html"
                data-id="1" data-key="0">11月</a><a class="column is-narrow " href="/p/4_1_2024_12_0/1.html" data-id="1" data-key="0">12月</a>
            </div>
            <div id="updateDays" class="columns is-mobile is-multiline is-marginless days  " data-id="1" style="display: none;">
                <div class="times-line"></div><a class="column is-narrow actived" href="/p/4_1_2024_0_0/1.html" data-id="1" data-key="0">全部</a><a class="column is-narrow " href="/p/4_1_2024_0_1/1.html" data-id="1" data-key="0">1日</a><a class="column is-narrow " href="/p/4_1_2024_0_2/1.html"
                data-id="1" data-key="0">2日</a><a class="column is-narrow " href="/p/4_1_2024_0_3/1.html" data-id="1" data-key="0">3日</a><a class="column is-narrow " href="/p/4_1_2024_0_4/1.html" data-id="1" data-key="0">4日</a><a class="column is-narrow " href="/p/4_1_2024_0_5/1.html"
                data-id="1" data-key="0">5日</a><a class="column is-narrow " href="/p/4_1_2024_0_6/1.html" data-id="1" data-key="0">6日</a><a class="column is-narrow " href="/p/4_1_2024_0_7/1.html" data-id="1" data-key="0">7日</a><a class="column is-narrow " href="/p/4_1_2024_0_8/1.html"
                data-id="1" data-key="0">8日</a><a class="column is-narrow " href="/p/4_1_2024_0_9/1.html" data-id="1" data-key="0">9日</a><a class="column is-narrow " href="/p/4_1_2024_0_10/1.html" data-id="1" data-key="0">10日</a><a class="column is-narrow " href="/p/4_1_2024_0_11/1.html"
                data-id="1" data-key="0">11日</a><a class="column is-narrow " href="/p/4_1_2024_0_12/1.html" data-id="1" data-key="0">12日</a><a class="column is-narrow " href="/p/4_1_2024_0_13/1.html" data-id="1" data-key="0">13日</a><a class="column is-narrow " href="/p/4_1_2024_0_14/1.html"
                data-id="1" data-key="0">14日</a><a class="column is-narrow " href="/p/4_1_2024_0_15/1.html" data-id="1" data-key="0">15日</a><a class="column is-narrow " href="/p/4_1_2024_0_16/1.html" data-id="1" data-key="0">16日</a><a class="column is-narrow " href="/p/4_1_2024_0_17/1.html"
                data-id="1" data-key="0">17日</a><a class="column is-narrow " href="/p/4_1_2024_0_18/1.html" data-id="1" data-key="0">18日</a><a class="column is-narrow " href="/p/4_1_2024_0_19/1.html" data-id="1" data-key="0">19日</a><a class="column is-narrow " href="/p/4_1_2024_0_20/1.html"
                data-id="1" data-key="0">20日</a><a class="column is-narrow " href="/p/4_1_2024_0_21/1.html" data-id="1" data-key="0">21日</a><a class="column is-narrow " href="/p/4_1_2024_0_22/1.html" data-id="1" data-key="0">22日</a><a class="column is-narrow " href="/p/4_1_2024_0_23/1.html"
                data-id="1" data-key="0">23日</a><a class="column is-narrow " href="/p/4_1_2024_0_24/1.html" data-id="1" data-key="0">24日</a><a class="column is-narrow " href="/p/4_1_2024_0_25/1.html" data-id="1" data-key="0">25日</a><a class="column is-narrow " href="/p/4_1_2024_0_26/1.html"
                data-id="1" data-key="0">26日</a><a class="column is-narrow " href="/p/4_1_2024_0_27/1.html" data-id="1" data-key="0">27日</a><a class="column is-narrow " href="/p/4_1_2024_0_28/1.html" data-id="1" data-key="0">28日</a><a class="column is-narrow " href="/p/4_1_2024_0_29/1.html"
                data-id="1" data-key="0">29日</a><a class="column is-narrow " href="/p/4_1_2024_0_30/1.html" data-id="1" data-key="0">30日</a>
            </div>
        </div>
    </div><a class="button is-rounded new-single-btn is-flex" href="/ct/create"><i class="icon"></i><span>新增玩具单品</span></a>
</div>`;
}