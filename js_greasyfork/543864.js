// ==UserScript==
// @name         Auto CF4VN Menu
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Tự động đăng nhập, nhập gift code, điểm danh cho CF4VN với menu hiện đại
// @author       Lệ Phi Vũ
// @match        https://cf4vn.com/*
// @match        https://cf4vn.com/inventory?*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      cf4vn.com
// @downloadURL https://update.greasyfork.org/scripts/543864/Auto%20CF4VN%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/543864/Auto%20CF4VN%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const menuHtml = `
    <div id="cf4vnMenu" style="position: fixed; top: 100px; left: 50px; background: linear-gradient(135deg, #1f1f1f, #444); border: 2px solid #888; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); z-index: 9999; font-family: 'Segoe UI', sans-serif; padding: 12px; min-width: 280px; color: #fff;">
        <div id="cf4vnHeader" style="cursor: move; font-weight: bold; background: #000; color: #00ffff; padding: 8px 12px; border-radius: 12px 12px 0 0; font-size: 18px; text-align: center; letter-spacing: 1px;">✨ CF4VN ✨</div>
        <div style="margin-top: 12px">
            <input type="text" id="codeInput" placeholder="Nhập code" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 14px; text-align: center;"/>
            <button id="eatCodeBtn" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 15px;">🎁 Ăn Code</button>
            <button id="diemDanhBtn" style="margin-top: 10px; width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 15px;">📅 Điểm Danh</button>
            <button id="khoDoBtn" style="margin-top: 10px; width: 100%; padding: 10px; background: #ff5722; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 15px;">🎒 Kho Đồ</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", menuHtml);

    // Kéo thả và lưu vị trí
    const menu = document.getElementById('cf4vnMenu');
    const header = document.getElementById('cf4vnHeader');
    let offsetX = 0, offsetY = 0, isDragging = false;

    if (localStorage.cf4vnPos) {
        const pos = JSON.parse(localStorage.cf4vnPos);
        menu.style.left = pos.left;
        menu.style.top = pos.top;
    }

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        menu.style.left = (e.clientX - offsetX) + 'px';
        menu.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            localStorage.cf4vnPos = JSON.stringify({ left: menu.style.left, top: menu.style.top });
        }
        isDragging = false;
    });

    // Tự động đăng nhập nếu có thể (3 lần, mỗi lần cách 2s)
    if (location.href.includes('/dang-nhap')) {
        let tries = 0;
        const tryLogin = () => {
            const loginBtn = document.querySelector('#loginBtn:not([disabled])');
            if (loginBtn && loginBtn.innerText.includes('Đăng Nhập')) {
                loginBtn.click();
                tries++;
            }
            if (tries < 3) setTimeout(tryLogin, 2000);
        };
        setTimeout(tryLogin, 1000);
    }

    // Xử lý nút Ăn Code
    document.getElementById('eatCodeBtn').addEventListener('click', () => {
        localStorage.cf4vnGiftCode = document.getElementById('codeInput').value.trim();
        location.href = 'https://cf4vn.com/tai-khoan';
    });

    // Nút điểm danh
    document.getElementById('diemDanhBtn').addEventListener('click', () => {
        location.href = 'https://cf4vn.com/diem-danh';
    });

    // Nút kho đồ
    document.getElementById('khoDoBtn').addEventListener('click', () => {
        location.href = 'https://cf4vn.com/kho-do';
    });

    // Auto nhập code nếu đang ở trang tài khoản
    if (location.href.includes('/tai-khoan')) {
        const waitForElement = (selector, timeout = 5000) => new Promise(resolve => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                }
            }, 300);
        });

        (async () => {
            const tabBtn = await waitForElement('#giftcode-tab');
            tabBtn.click();

            const charSelect = await waitForElement('#characterSelect');
            if (charSelect.options.length > 1) charSelect.selectedIndex = 1;

            const input = await waitForElement('#giftcodeInput');
            input.value = localStorage.cf4vnGiftCode || '';

            const submitBtn = document.querySelector('button.btn.btn-primary');
            if (submitBtn) {
                submitBtn.click();
                const confirm = () => {
                    const alertBox = document.querySelector('div.swal2-container button.swal2-confirm');
                    if (alertBox) alertBox.click();
                    else setTimeout(confirm, 500);
                };
                setTimeout(confirm, 1000);
            }
        })();
    }

    if (location.href.includes('/diem-danh')) {
        let attempts = 0;
        const tryClick = () => {
            const btn = document.querySelector('button.checkin-btn');
            if (btn && btn.innerText.includes('ĐIỂM DANH')) {
                btn.click();
            } else if (attempts < 2) {
                attempts++;
                setTimeout(tryClick, 1000);
            }
        };
        setTimeout(tryClick, 1000);
    }

    // Xử lý khi vào trang kho đồ
    if (location.href.includes('/kho-do') || location.href.includes('/inventory?')) {
        // Hàm tự động click nút xác nhận xóa
        const autoConfirmDelete = () => {
            let attempts = 0;
            const tryConfirm = () => {
                const confirmBtn = document.querySelector('.swal2-confirm.swal2-styled');
                if (confirmBtn && confirmBtn.textContent.includes('Xóa')) {
                    confirmBtn.click();
                } else if (attempts < 2) {
                    attempts++;
                    setTimeout(tryConfirm, 2000);
                }
            };
            setTimeout(tryConfirm, 100);
        };

        // Tạo menu phụ hiển thị danh sách vật phẩm
        const createInventoryMenu = () => {
            const inventoryMenuHtml = `
            <div id="cf4vnInventoryMenu" style="position: fixed; top: 100px; right: 50px; background: linear-gradient(135deg, #1f1f1f, #444); border: 2px solid #888; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); z-index: 9998; font-family: 'Segoe UI', sans-serif; padding: 12px; width: 350px; max-height: 600px; overflow-y: auto; color: #fff;">
                <div style="font-weight: bold; background: #000; color: #00ffff; padding: 8px 12px; border-radius: 8px; font-size: 16px; text-align: center; margin-bottom: 10px;">
                    🎒 Kho Đồ Của Bạn
                    <button id="loadAllPagesBtn" style="float: right; background: #4CAF50; color: white; border: none; border-radius: 4px; padding: 2px 8px; font-size: 12px; cursor: pointer;">Tải tất cả</button>
                </div>
                <div style="margin-bottom: 10px; font-size: 12px; color: #aaa; text-align: center;" id="inventoryStats"></div>
                <div id="inventoryItemsList" style="font-size: 14px;"></div>
                <div id="loadingIndicator" style="text-align: center; display: none;">
                    <div style="color: #00ffff; margin: 10px 0;">Đang tải dữ liệu...</div>
                </div>
            </div>`;

            document.body.insertAdjacentHTML("beforeend", inventoryMenuHtml);

            document.getElementById('loadAllPagesBtn').addEventListener('click', loadAllPages);
            updateInventoryList();
        };

        // Hàm tải tất cả các trang
        const loadAllPages = async () => {
            const loadingIndicator = document.getElementById('loadingIndicator');
            const loadAllPagesBtn = document.getElementById('loadAllPagesBtn');
            const inventoryItemsList = document.getElementById('inventoryItemsList');

            loadingIndicator.style.display = 'block';
            loadAllPagesBtn.disabled = true;
            loadAllPagesBtn.textContent = 'Đang tải...';
            inventoryItemsList.innerHTML = '<div style="text-align: center; padding: 10px; color: #aaa;">Đang thu thập dữ liệu từ tất cả trang...</div>';

            try {
                const pagination = document.querySelector('.pagination');
                if (!pagination) {
                    updateInventoryList();
                    return;
                }

                const pageLinks = pagination.querySelectorAll('.page-item:not(.disabled):not(.active) a.page-link');
                const totalPages = parseInt(pageLinks[pageLinks.length - 1]?.textContent) || 1;

                let allItems = collectItemsFromPage();

                for (let page = 2; page <= totalPages; page++) {
                    const url = new URL(window.location.href);
                    url.searchParams.set('page', page);

                    const pageHtml = await fetchPage(url.toString());
                    if (pageHtml) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = pageHtml;
                        const items = Array.from(tempDiv.querySelectorAll('.item-card')).map(card => ({
                            name: card.querySelector('.item-name')?.innerText.trim() || '',
                            expire: card.querySelector('.item-expire')?.innerText.trim() || '',
                            quantity: card.querySelector('.item-quantity')?.innerText.trim() || 'x1',
                            imgSrc: card.querySelector('.item-image')?.src || '',
                            deleteBtn: card.querySelector('.delete-btn')
                        }));

                        allItems = allItems.concat(items);
                        renderInventoryList(allItems);
                    }
                }

                GM_setValue('cachedInventory', JSON.stringify(allItems));
                GM_setValue('lastInventoryUpdate', Date.now());
                renderInventoryList(allItems);

            } catch (error) {
                console.error('Lỗi khi tải tất cả trang:', error);
                inventoryItemsList.innerHTML = '<div style="text-align: center; padding: 10px; color: #ff5555;">Có lỗi xảy ra khi tải dữ liệu</div>';
            } finally {
                loadingIndicator.style.display = 'none';
                loadAllPagesBtn.disabled = false;
                loadAllPagesBtn.textContent = 'Tải tất cả';
            }
        };

        // Hàm fetch trang bằng AJAX
        const fetchPage = (url) => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function() {
                        resolve(null);
                    }
                });
            });
        };

        // Thu thập vật phẩm từ trang hiện tại
        const collectItemsFromPage = () => {
            const itemCards = document.querySelectorAll('.item-card');
            return Array.from(itemCards).map(card => ({
                name: card.querySelector('.item-name')?.innerText.trim() || '',
                expire: card.querySelector('.item-expire')?.innerText.trim() || '',
                quantity: card.querySelector('.item-quantity')?.innerText.trim() || 'x1',
                imgSrc: card.querySelector('.item-image')?.src || '',
                deleteBtn: card.querySelector('.delete-btn')
            }));
        };

        // Hiển thị danh sách vật phẩm
        const renderInventoryList = (items) => {
            const itemsList = document.getElementById('inventoryItemsList');
            const inventoryStats = document.getElementById('inventoryStats');

            if (!itemsList) return;

            if (items.length === 0) {
                itemsList.innerHTML = '<div style="text-align: center; padding: 10px; color: #aaa;">Không có vật phẩm nào</div>';
                inventoryStats.textContent = '';
                return;
            }

            const totalItems = items.reduce((sum, item) => sum + parseInt(item.quantity.replace('x', '') || '1'), 0);
            inventoryStats.textContent = `Tổng: ${items.length} loại vật phẩm (${totalItems} cái)`;

            const groupedItems = {};
            items.forEach(item => {
                const key = `${item.name}_${item.expire}`;
                if (!groupedItems[key]) {
                    groupedItems[key] = {
                        ...item,
                        count: parseInt(item.quantity.replace('x', '') || '1'),
                        deleteBtns: item.deleteBtn ? [item.deleteBtn] : []
                    };
                } else {
                    groupedItems[key].count += parseInt(item.quantity.replace('x', '') || '1');
                    if (item.deleteBtn) {
                        groupedItems[key].deleteBtns.push(item.deleteBtn);
                    }
                }
            });

            let html = '';
            Object.values(groupedItems).forEach(item => {
                html += `
                <div style="display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #555; margin-bottom: 5px;">
                    <img src="${item.imgSrc}" style="width: 40px; height: 40px; margin-right: 10px; border-radius: 4px;" onerror="this.src='/images/items/default.png'">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; margin-bottom: 3px;">${item.name}</div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px;">
                            <span>x${item.count}</span>
                            <span>${item.expire}</span>
                        </div>
                    </div>
                    ${item.deleteBtns.length > 0 ? `<button class="menu-delete-btn" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 3px 6px; cursor: pointer; margin-left: 5px;">Xóa</button>` : ''}
                </div>`;
            });

            itemsList.innerHTML = html;

            // Thêm sự kiện click cho các nút xóa trong menu
            document.querySelectorAll('.menu-delete-btn').forEach((btn, index) => {
                btn.addEventListener('click', function() {
                    const groupedItemsArray = Object.values(groupedItems);
                    const currentItem = groupedItemsArray[index];

                    if (currentItem && currentItem.deleteBtns.length > 0) {
                        const originalDeleteBtn = currentItem.deleteBtns[0];
                        if (originalDeleteBtn) {
                            originalDeleteBtn.click();
                            // Tự động xác nhận sau khi click nút xóa
                            autoConfirmDelete();
                        }
                    }
                });
            });
        };

        // Tạo menu sau khi trang tải xong
        setTimeout(createInventoryMenu, 1000);

        // Theo dõi thay đổi URL
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl && (location.href.includes('/kho-do') || location.href.includes('/inventory?'))) {
                lastUrl = location.href;
                setTimeout(updateInventoryList, 500);
            }
        }, 300);
    }
})();