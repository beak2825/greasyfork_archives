// ==UserScript==
// @name         輕小說文庫直書工具
// @name:zh-CN   轻小说文库直书工具
// @name:zh-TW   輕小說文庫直書工具
// @namespace    http://tampermonkey.net/
// @version      1.08
// @description  將顯示方式轉為直書，新增黑夜模式，兼容輕小說文庫+
// @description:zh-TW  將顯示方式轉為直書，新增黑夜模式，兼容輕小說文庫+
// @description:zh-CN  将显示方式转为直书，新增黑夜模式，兼容轻小说文库+
// @author       0225
// @license      GPL-license
// @match        https://www.wenku8.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511578/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%96%87%E5%BA%AB%E7%9B%B4%E6%9B%B8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/511578/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%96%87%E5%BA%AB%E7%9B%B4%E6%9B%B8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    `);

    // 記住黑夜模式狀態
    const isNightMode = localStorage.getItem('nightMode') === 'true';
    if (isNightMode) {
        document.body.style.backgroundColor = 'black';
        const color = 'white';
        document.getElementById('adtop') && (document.getElementById('adtop').style.color = color);
        document.getElementById('title') && (document.getElementById('title').style.color = color);
        document.getElementById('content') && (document.getElementById('content').style.color = color);
    }

    if (document.querySelector('.main.nav') || document.getElementById('info') ||
        (document.getElementById('title') && /插圖|插图/.test(document.getElementById('title').innerText))) {
        document.body.style.backgroundColor = 'white'; // 恢复为白色背景
        document.getElementById('adtop') && (document.getElementById('adtop').style.color = 'black');
        document.getElementById('title') && (document.getElementById('title').style.color = 'black');
        document.getElementById('content') && (document.getElementById('content').style.color = 'black');
        localStorage.setItem('nightMode', false); // 更新本地存储的黑暗模式状态
        return;
    }




    const init = () => {
        const adv4 = document.getElementById('adv4');
        adv4 && adv4.remove();

        const adv5 = document.getElementById('adv5');
        adv5 && adv5.remove();

        const footlink = document.getElementById('footlink');
        if (footlink) {
            footlink.style.border = 'none';
            footlink.style.padding = '10px';
        }

        const leftDiv = document.getElementById('linkleft');
        leftDiv && leftDiv.remove();

        const headlink = document.getElementById('headlink');
        if (headlink) {
            Object.assign(headlink.style, {
                position: 'fixed',
                left: '0',
                bottom: '0',
                zIndex: '2000',
                display: 'block',
            });
        }

        const rightDiv = document.getElementById('linkright');
        if (rightDiv) {
            Object.assign(rightDiv.style, {
                position: 'absolute',
                left: '0',
                top: '0',
                zIndex: '1000',
            });
        }

        const adtop = document.getElementById('adtop');
        if (adtop) {
            Object.assign(adtop.style, {
                position: 'fixed',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '2000',
                display: 'block',
            });
        }

        const content = document.getElementById('content');
        if (content) {
            const emptyLines = document.createElement('div');
            emptyLines.innerHTML = '<br><br><br><br>';
            content.insertBefore(emptyLines, content.firstChild);

            content.style.marginTop = '30px';

            Object.assign(content.style, {
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                overflowY: 'auto',
                overflowX: 'hidden',
                whiteSpace: 'normal',
                width: 'auto',
                maxHeight: '80vh',
                lineHeight: '1.6',
                transition: 'color 0.3s, background-color 0.3s',
            });
        }

        const contentMain = document.getElementById('contentmain');
        if (contentMain) {
            Object.assign(contentMain.style, {
                width: 'auto',
                borderLeft: 'none',
                borderRight: 'none',
                boxShadow: 'none',
            });
        }

        document.body.style.width = 'auto';

        window.addEventListener('wheel', (event) => {
            if (event.deltaY > 0) {
                window.scrollBy(-50, 0);
                event.preventDefault();
            } else if (event.deltaY < 0) {
                window.scrollBy(50, 0);
                event.preventDefault();
            }
        });

        const title = document.getElementById('title');
        if (title) {
            Object.assign(title.style, {
                position: 'fixed',
                right: '0',
                top: '0',
                writingMode: 'horizontal-tb',
                textOrientation: 'upright',
                zIndex: '1000',
                whiteSpace: 'nowrap',
                paddingRight: '10px',
            });
        }

        let rightSpace = document.getElementById('rightspace');
        if (!rightSpace) {
            rightSpace = document.createElement('div');
            rightSpace.id = 'rightspace';
            Object.assign(rightSpace.style, {
                position: 'fixed',
                right: '0',
                top: '0',
                width: 'auto',
                height: '100vh',
                backgroundColor: 'transparent',
            });
            document.body.appendChild(rightSpace);
        }

        const sidepanel = document.getElementById('sidepanel-panel');
        if (sidepanel) {
            sidepanel.style.display = 'none';
        }

        const foottext = document.getElementById('foottext');
        if (foottext) {
            Object.assign(foottext.style, {
                position: 'fixed',
                right: '10px',
                bottom: '30px',
                zIndex: '2000',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            });

            headlink.parentNode.insertBefore(foottext, headlink);

            const footLinks = foottext.querySelectorAll('a');
            const newButtonsHtml = `
                <a id="bookmarkBtn" style="margin: 0 5px;" title="添加書籤"><i class="fas fa-bookmark"></i></a>
                <a id="backToBookBtn" style="margin: 0 5px;" title="返回書頁"><i class="fas fa-book"></i></a>
                <a id="nextPageBtn" style="margin: 0 5px;" title="下一章"><i class="fas fa-chevron-left"></i></a>
                <a id="prevPageBtn" style="margin: 0 5px;" title="上一章"><i class="fas fa-chevron-right"></i></a>
                <a id="backToContentsBtn" style="margin: 0 5px;" title="返回書目"><i class="fas fa-list"></i></a>
                <a id="refreshBtn" style="margin: 0 5px;" title="刷新頁面"><i class="fas fa-sync"></i></a>
                <a id="moveLeftBtn" style="margin: 0 5px;" title="移至最左"><i class="fas fa-backward"></i></a>
                <a id="moveRightBtn" style="margin: 0 5px;" title="移至最右"><i class="fas fa-forward"></i></a>
                <a id="nightModeBtn" style="margin: 0 5px;" title="黑暗模式"><i class="fas fa-moon"></i></a>
            `;
            foottext.innerHTML = newButtonsHtml;

            document.getElementById('bookmarkBtn').onclick = () => {
                const bookmarkUrl = window.location.href;
                const bookmarkTitle = document.title;
                alert(`書籤已添加：${bookmarkTitle}`);
            };

            document.getElementById('backToBookBtn').onclick = () => {
                const bookUrl = footLinks[1].href;
                window.location.href = bookUrl;
            };

            document.getElementById('nextPageBtn').onclick = () => {
                const nextPageUrl = footLinks[3].href;
                window.location.href = nextPageUrl;
            };

            document.getElementById('prevPageBtn').onclick = () => {
                const prevPageUrl = footLinks[2].href;
                window.location.href = prevPageUrl;
            };

            document.getElementById('backToContentsBtn').onclick = () => {
                const contentsUrl = footLinks[4].href;
                window.location.href = contentsUrl;
            };

            document.getElementById('refreshBtn').onclick = () => {
                window.location.reload();
            };

            document.getElementById('moveLeftBtn').onclick = () => {
                window.scrollTo(0, 0);
            };

            document.getElementById('moveRightBtn').onclick = () => {
                window.scrollTo(document.body.scrollWidth, 0);
            };

            const nightModeBtn = document.getElementById('nightModeBtn');
            let isNightModeEnabled = isNightMode;
            nightModeBtn.onclick = () => {
                isNightModeEnabled = !isNightModeEnabled;
                document.body.style.backgroundColor = isNightModeEnabled ? 'black' : 'white';
                const color = isNightModeEnabled ? 'white' : 'black';
                document.getElementById('adtop') && (document.getElementById('adtop').style.color = color);
                document.getElementById('title') && (document.getElementById('title').style.color = color);
                document.getElementById('content') && (document.getElementById('content').style.color = color);
                localStorage.setItem('nightMode', isNightModeEnabled);
            };
        }

        // 屏蔽上下左右的按鍵監聽
        window.addEventListener('keydown', (event) => {
            if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                event.stopPropagation();
                event.preventDefault();
            }
            // 阻止默認的左右鍵行為，並添加自定義滑動
            if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.stopPropagation();
                event.preventDefault();
                if (event.key === 'ArrowLeft') {
                    window.scrollBy(-50, 0); // 向左滑動
                } else if (event.key === 'ArrowRight') {
                    window.scrollBy(50, 0); // 向右滑動
                }
            }
        }, true);

        // 等待頁面完全載入後自動移至最右
        setTimeout(() => {
            window.scrollTo(document.body.scrollWidth, 0);
        }, 300); // 延時 300ms
    };

    window.addEventListener('load', init);
})();
