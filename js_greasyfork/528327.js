// ==UserScript==
// @name         MyFreeMP3批量操作
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  多次点击列标题可升序/降序排序；读取真实歌单列表；批量收藏或取消收藏所选歌曲。
// @match        *://tools.liumingye.cn/music/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528327/MyFreeMP3%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/528327/MyFreeMP3%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;
    let lastUrl = location.href;


    /**
     * 等待元素加载
     */
    async function waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const elem = document.querySelector(selector);
            if (elem) return elem;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        return null;
    }

    /**
     * 一些全局或静态配置
     */
    // 用来排除的菜单项：这些不是歌单，而是其他功能
    const EXCLUDE_MENU_TEXTS = [
        '收藏到歌单',  // 本身这个是父项
        '下一首播放',
        '播放',
        '复制歌名',
        '下载',
        '取消收藏'   // 这个一般是“取消收藏”项，也不是歌单
    ];

    // 如果子菜单里出现了这行文本，就表示是“取消收藏”选项
    // 你可以改成自己在菜单中看到的文本，例如“从歌单移除”或“移除收藏”
    const CANCEL_FAV_TEXT = '取消收藏';

    // 用来记录每个列当前是 "asc" 还是 "desc" (升序还是降序)
    let sortOrderState = {
        title: 'asc',
        artist: 'asc',
        album: 'asc',
        duration: 'asc'
    };

    /**
     * 延时函数，用于在菜单展开、请求发送时做等待，防止操作过快
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 获取表头行：
     * 因为类名中含有 `$`，我们采用 [class*="text-$gray"] 来规避选择器冲突
     */
    function getHeaderRow() {
        // 例子： .arco-row.h-10.leading-10.px-2[class*="text-$gray"]
        return document.querySelector('.arco-row.h-10.leading-10.px-2[class*="text-$gray"]');
    }

    /**
     * 获取所有“真正的歌曲行”
     * 你提到它是 div.item.relative[playlist]
     */
    function getSongItems() {
        return document.querySelectorAll('div.item.relative[playlist]');
    }

    /**
     * 给表头第一列插入“全选”复选框，给其他列绑定“多次点击->升序/降序”事件
     */
    function enhanceHeaderRow() {
        const headerRow = getHeaderRow();
        if (!headerRow) {
            console.log('未找到表头行，无法设置全选和列点击排序。');
            return;
        }

        const colEls = headerRow.querySelectorAll('.arco-col');
        if (colEls.length < 2) {
            console.log('表头列数不足，无法正常设置复选框或排序事件。');
            return;
        }

        if (document.querySelector('#selectAllCheckbox')) {
            console.log('全选复选框已存在，跳过添加');
            return;
        }

        // 假设 colEls[0] 就是最左侧的一列
        const firstCol = colEls[0];

        // 创建“全选”checkbox
        const selectAllCb = document.createElement('input');
        selectAllCb.type = 'checkbox';
        selectAllCb.style.cursor = 'pointer';
        selectAllCb.title = '全选 / 全不选';

        // 点击事件：选中/取消选中所有歌曲复选框
        selectAllCb.addEventListener('change', () => {
            const checked = selectAllCb.checked;
            const songCbs = document.querySelectorAll('.song-select-checkbox');
            songCbs.forEach(cb => {
                cb.checked = checked;
            });
        });

        firstCol.appendChild(selectAllCb);

        // 绑定列点击 -> 升序 / 降序
        // 这里假设：colEls[1] 是标题, colEls[2] 是歌手, colEls[3] 是专辑, colEls[4] 是时长
        function bindSort(colIndex, fieldKey) {
            if (colEls[colIndex]) {
                colEls[colIndex].style.cursor = 'pointer';
                colEls[colIndex].addEventListener('click', () => {
                    // 切换 sortOrderState[fieldKey] 的 asc/desc
                    sortOrderState[fieldKey] = (sortOrderState[fieldKey] === 'asc') ? 'desc' : 'asc';
                    sortSongsBy(fieldKey, sortOrderState[fieldKey]);
                });
            }
        }

        bindSort(1, 'title');    // 标题
        bindSort(2, 'artist');   // 歌手
        bindSort(3, 'album');    // 专辑
        bindSort(4, 'duration'); // 时长
    }

    /**
     * 在每首歌曲行最左侧插入复选框。若已经有了就不重复添加。
     * 我们假设 .arco-row 里 colEls[0] 可能是图片/空位
     */
    function addCheckboxesToSongs() {
        const songItems = getSongItems();
        songItems.forEach(song => {
            const row = song.querySelector('.arco-row');
            if (!row) return;

            const cols = row.querySelectorAll('.arco-col');
            if (cols.length === 0) return;

            // 在 cols[0] 里放一个复选框(如果还没有)
            const newCol = document.createElement('div');
            newCol.className = 'arco-col text-center';
            newCol.style.flex = '0 0 30px';
            newCol.style.paddingLeft = '6px';
            newCol.style.paddingRight = '6px';

            if (!cols[0].querySelector('.song-select-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'song-select-checkbox';
                checkbox.style.cursor = 'pointer';

                // 也可以根据需要给它 data-* 属性，比如 data-title = ...
                newCol.appendChild(checkbox);
                row.prepend(newCol);
            }
        });
    }

    /**
     * 排序函数：对所有歌曲进行升序/降序排列
     * @param {string} field - 'title' | 'artist' | 'album' | 'duration'
     * @param {string} order - 'asc' or 'desc'
     */
    function sortSongsBy(field, order) {
        const songItems = Array.from(getSongItems());
        if (songItems.length === 0) return;

        // 拿到它们的共同父容器
        const parent = songItems[0].parentElement;
        if (!parent) {
            console.log('未能定位歌曲父容器，无法排序。');
            return;
        }

        // 提取某列文本
        function getFieldValue(songEl, f) {
            const row = songEl.querySelector('.arco-row');
            if (!row) return '';
            const cols = row.querySelectorAll('.arco-col');
            // 这里要对应上：
            //   0 => 复选框 + 图片?
            //   1 => 标题
            //   2 => 歌手
            //   3 => 专辑
            //   4 => 时长
            //   5 => 三点按钮?
            switch (f) {
                case 'title':    return cols[2]?.textContent.trim() ?? '';
                case 'artist':   return cols[3]?.textContent.trim() ?? '';
                case 'album':    return cols[4]?.textContent.trim() ?? '';
                case 'duration': return cols[5]?.textContent.trim() ?? '';
                default:         return '';
            }
        }

        songItems.sort((a, b) => {
            const valA = getFieldValue(a, field);
            const valB = getFieldValue(b, field);
            if (order === 'asc') {
                return valA.localeCompare(valB);
            } else {
                return valB.localeCompare(valA);
            }
        });

        // 重新插入 DOM
        songItems.forEach(el => parent.appendChild(el));
        console.log(`已按 [${field}] 字段 ${order === 'asc' ? '升序' : '降序'} 排列`);
    }

    /**
     * 从子菜单里读取“可用的歌单”列表
     * 做法：对一首歌执行：三点 -> 收藏到歌单(悬停) -> 读取子菜单 -> 排除 EXCLUDE_MENU_TEXTS
     *
     * 返回一个对象数组：[{text: 'xxx', element: <div>}, ...]
     */
    async function readPlaylistsFromOneSong(songItem) {
        // 1. 点击“三点”按钮
        const moreBtn = songItem.querySelector('button[class*="arco-btn"][class*="arco-btn-text"][class*="arco-btn-shape-circle"]');
        if (!moreBtn) {
            console.log('readPlaylistsFromOneSong: 未找到三点按钮');
            return [];
        }
        moreBtn.click();
        await delay(500);

        // 2. 找到“收藏到歌单”
        let menuItems = document.querySelectorAll('.mx-context-menu-item');
        const favMenu = Array.from(menuItems).find(m =>
            m.textContent.includes('收藏到歌单')
        );
        if (!favMenu) {
            console.log('readPlaylistsFromOneSong: 未找到“收藏到歌单”菜单项');
            moreBtn.click(); // 关菜单
            return [];
        }

        // 3. 悬停展开
        favMenu.dispatchEvent(new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
        await delay(500);

        // 4. 再次获取子菜单项
        menuItems = document.querySelectorAll('.mx-context-menu-item');

        // 5. 关掉菜单
        moreBtn.click();
        await delay(300);

        // 6. 过滤掉 EXCLUDE_MENU_TEXTS
        //    只保留真正是“歌单名称”的那几项
        const result = [];
        Array.from(menuItems).forEach(m => {
            const t = m.textContent.trim();
            if (!t) return;
            // 如果 t 包含排除列表，则跳过
            if (EXCLUDE_MENU_TEXTS.some(ex => t.includes(ex))) {
                return;
            }
            result.push({
                text: t,
                element: m
            });
        });

        console.log(`读取到 ${result.length} 个歌单：`, result.map(r => r.text));
        return result;
    }

    /**
     * 在页面左侧插入一个浮动面板，包含：
     *   - 一个“读取歌单列表”按钮
     *   - 动态显示所有歌单项，点击后可执行批量收藏
     *   - 一个“批量取消收藏”按钮（对勾选歌曲执行“取消收藏”）
     */
    function addControlPanel() {
        if (document.getElementById('customControlPanel')) {
            return; // 已添加过就不重复
        }

        const panel = document.createElement('div');
        panel.id = 'customControlPanel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '600px',
            left: '10px',
            width: '200px',
            padding: '10px',
            backgroundColor: '#f7f7f7',
            border: '1px solid #ddd',
            borderRadius: '6px',
            zIndex: 999999
        });

        const title = document.createElement('div');
        title.textContent = '批量收藏 / 取消收藏';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '8px';
        panel.appendChild(title);

        // “读取歌单列表”按钮
        const readListBtn = document.createElement('button');
        readListBtn.textContent = '读取歌单列表';
        readListBtn.style.width = '100%';
        readListBtn.addEventListener('click', async () => {
            // 先随便选一首歌曲(比如第一首)来读取其子菜单
            const allSongs = getSongItems();
            if (allSongs.length === 0) {
                alert('找不到任何歌曲，无法读取歌单列表');
                return;
            }
            const playlists = await readPlaylistsFromOneSong(allSongs[0]);
            // 然后在 panel 里显示这些歌单名称
            showPlaylistButtons(playlists);
        });
        panel.appendChild(readListBtn);

        // 占位：用于插入歌单按钮
        const playlistContainer = document.createElement('div');
        playlistContainer.id = 'playlistContainer';
        playlistContainer.style.marginTop = '8px';
        panel.appendChild(playlistContainer);

        // “批量取消收藏”按钮
        const cancelFavBtn = document.createElement('button');
        cancelFavBtn.textContent = '批量取消收藏(选中)';
        cancelFavBtn.style.marginTop = '8px';
        cancelFavBtn.style.width = '100%';
        cancelFavBtn.addEventListener('click', async () => {
            await batchCancelFavoriteSelected();
        });
        panel.appendChild(cancelFavBtn);

        document.body.appendChild(panel);
    }

    /**
     * 在面板里生成一组按钮，每个按钮对应一个歌单。
     * 点击后，对选中的歌曲执行“收藏到该歌单”
     */
    function showPlaylistButtons(playlists) {
        const container = document.getElementById('playlistContainer');
        if (!container) return;

        // 先清空
        container.innerHTML = '';

        if (!playlists || playlists.length === 0) {
            container.innerHTML = '<div style="color:red;margin-top:6px;">未读取到任何歌单</div>';
            return;
        }

        container.innerHTML = '<div style="margin: 4px 0;">请选择要收藏到的歌单:</div>';

        playlists.forEach(p => {
            const btn = document.createElement('button');
            btn.textContent = p.text;
            btn.style.display = 'block';
            btn.style.width = '100%';
            btn.style.marginBottom = '4px';
            btn.addEventListener('click', () => {
                batchFavoriteSelectedSongs(p.text);
            });
            container.appendChild(btn);
        });
    }

    /**
     * 对勾选的歌曲执行“收藏到指定歌单”
     */
    async function batchFavoriteSelectedSongs(playlistName) {
        const allSongs = getSongItems();
        if (allSongs.length === 0) {
            alert('找不到任何歌曲行');
            return;
        }
        // 筛选出勾选的
        const selectedSongs = Array.from(allSongs).filter(s => {
            const cb = s.querySelector('.song-select-checkbox');
            return cb && cb.checked;
        });
        if (selectedSongs.length === 0) {
            alert('你还没勾选任何歌曲');
            return;
        }

        console.log(`开始收藏 ${selectedSongs.length} 首歌曲到【${playlistName}】...`);

        for (let i = 0; i < selectedSongs.length; i++) {
            const song = selectedSongs[i];
            console.log(`第 ${i+1} 首: 准备收藏到【${playlistName}】`);

            const moreBtn = song.querySelector('button[class*="arco-btn"][class*="arco-btn-text"][class*="arco-btn-shape-circle"]');
            if (!moreBtn) {
                console.log('未找到三点按钮，跳过');
                continue;
            }
            moreBtn.click();
            await delay(500);

            let menuItems = document.querySelectorAll('.mx-context-menu-item');
            const favMenu = Array.from(menuItems).find(m =>
                m.textContent.includes('收藏到歌单')
            );
            if (!favMenu) {
                console.log('未找到“收藏到歌单”菜单项');
                moreBtn.click();
                continue;
            }

            // 悬停
            favMenu.dispatchEvent(new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
            await delay(500);

            // 找到目标歌单
            menuItems = document.querySelectorAll('.mx-context-menu-item');
            const targetItem = Array.from(menuItems).find(m =>
                m.textContent.includes(playlistName)
            );
            if (!targetItem) {
                console.log(`未找到【${playlistName}】选项`);
                moreBtn.click();
                continue;
            }
            targetItem.click();
            console.log(`已收藏到【${playlistName}】`);
            await delay(300);
        }

        console.log('批量收藏完毕');
    }

    /**
     * 对勾选的歌曲执行“取消收藏”
     * 即点击三点 -> 找到“取消收藏” -> 点击
     */
    async function batchCancelFavoriteSelected() {
        const allSongs = getSongItems();
        if (allSongs.length === 0) {
            alert('没有歌曲行');
            return;
        }
        // 找勾选
        const selectedSongs = Array.from(allSongs).filter(s => {
            const cb = s.querySelector('.song-select-checkbox');
            return cb && cb.checked;
        });
        if (selectedSongs.length === 0) {
            alert('你还没勾选任何歌曲');
            return;
        }

        console.log(`准备对 ${selectedSongs.length} 首歌曲执行“取消收藏”...`);

        for (let i = 0; i < selectedSongs.length; i++) {
            const song = selectedSongs[i];
            console.log(`第 ${i+1} 首: 准备取消收藏`);

            const moreBtn = song.querySelector('button[class*="arco-btn"][class*="arco-btn-text"][class*="arco-btn-shape-circle"]');
            if (!moreBtn) {
                console.log('未找到三点按钮，跳过');
                continue;
            }
            moreBtn.click();
            await delay(500);

            const menuItems = document.querySelectorAll('.mx-context-menu-item');
            const cancelItem = Array.from(menuItems).find(m =>
                m.textContent.includes(CANCEL_FAV_TEXT)
            );
            if (!cancelItem) {
                console.log(`未找到“${CANCEL_FAV_TEXT}”选项，此歌曲可能不是已收藏状态`);
                moreBtn.click();
                continue;
            }

            cancelItem.click();
            console.log('已点击 取消收藏');
            await delay(300);
        }

        console.log('批量取消收藏操作结束');
    }


    /**
     * 等待指定元素出现（避免 `main()` 执行时找不到表头）
     */
    async function waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const elem = document.querySelector(selector);
            if (elem) return elem;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        console.warn(`⚠️ 超时: 未能找到元素 ${selector}`);
        return null;
    }

    /**
     * 主函数：先等待表头元素加载，再执行主要逻辑
     */
    async function main() {
        console.log("🔄 执行 main()...");

        // 等待表头加载
        const headerRow = await waitForElement('.arco-row.h-10.leading-10.px-2[class*="text-$gray"]');
        if (!headerRow) {
            console.warn('🚨 表头未能正确加载，跳过执行 main()');
            return;
        }

        enhanceHeaderRow();
        addCheckboxesToSongs();
        addControlPanel();
    }

    /**
     * 监听 URL 变化，并在目标元素加载后执行 `main()`
     */
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('🔄 检测到 URL 变化，重新执行脚本...');

            // **等待表头加载后再执行 main()**
            waitForElement('.arco-row.h-10.leading-10.px-2[class*="text-$gray"]').then(header => {
                if (header) {
                    main();
                }
            });
        }
        setTimeout(checkUrlChange, 1000);
    }

    // **首次执行**
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    } else {
        main();
    }

    checkUrlChange();
})();
