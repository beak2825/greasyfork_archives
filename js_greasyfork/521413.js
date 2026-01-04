// ==UserScript==
// @name         Myhome房子的均价以及房东调价变化查看
// @name:en      MyHome.ie Property Price Tracker
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  在MyHome.ie网站添加房源均价计算、价格变动追踪及看房笔记功能
// @description:en  Add price per square meter calculation, price change tracking and viewing notes for MyHome.ie
// @author       Jerry
// @license      MIT
// @match        https://www.myhome.ie/residential/brochure/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @supportURL   https://github.com/your-username/your-repo/issues
// @homepageURL  https://github.com/your-username/your-repo
// @icon         https://www.myhome.ie/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/521413/Myhome%E6%88%BF%E5%AD%90%E7%9A%84%E5%9D%87%E4%BB%B7%E4%BB%A5%E5%8F%8A%E6%88%BF%E4%B8%9C%E8%B0%83%E4%BB%B7%E5%8F%98%E5%8C%96%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521413/Myhome%E6%88%BF%E5%AD%90%E7%9A%84%E5%9D%87%E4%BB%B7%E4%BB%A5%E5%8F%8A%E6%88%BF%E4%B8%9C%E8%B0%83%E4%BB%B7%E5%8F%98%E5%8C%96%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

/* 
MIT License

Copyright (c) 2024 Jerry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
功能说明：
1. 自动计算房源每平方米均价
2. 追踪并显示房源价格变动历史
3. 提供看房笔记功能，可添加和管理看房心得
4. 记录房源基本信息（面积、地址、能源等级等）
5. 支持中英文界面

使用说明：
1. 安装脚本后访问 MyHome.ie 的房源详情页
2. 页面会自动显示额外的信息面板
3. 可以在右侧添加看房笔记
4. 价格变动会自动追踪并显示

注意事项：
1. 需要浏览器安装 Tampermonkey 或类似脚本管理器
2. 删除笔记需要密码验证
3. 部分数据需要后端 API 支持
*/

(function() {
    'use strict';

    // 获取房产面积
    function Property_size() {
        const pageText = document.body.innerHTML;
        const sizeMatch = pageText.match(/"MaxSize":(\d+)/);

        if (sizeMatch && sizeMatch[1]) {
            return sizeMatch[1];
        }

        return '暂无面积数据';
    }

    // 获取房产地址
    function Property_address() {
        const addressElement = document.querySelector('h1.h4.fw-bold');
        return addressElement ? addressElement.innerText.trim() : '地址未知';
    }

    // 获取房产价格
    function Property_price() {
        const priceElement = document.querySelector('b.brochure__price.p-1');
        return priceElement ? priceElement.innerText.trim() : '价格需要咨询';
    }

    // 获取房产能源等级
    function Property_ber() {
        const berElement = document.querySelector('img[alt="Energy Rating"]');
        if (berElement) {
            const srcPath = berElement.src;
            const berMatch = srcPath.match(/energyRating\/([A-G][0-9]?)\.png/);
            return berMatch ? berMatch[1] : '暂无等级报告';
        }
        return '暂无等级报告';
    }

    // 获取创建日期
    function Property_created_date() {
        const dateElement = document.querySelector('p.m-0.text-center.text-md-end');
        if (dateElement) {
            const dateText = dateElement.innerText.replace('Date created:', '').trim();
            const date = new Date(dateText);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).replace(/ /g, ' ');
        }
        return null;
    }

    // 计算每平米均价
    function calculateAveragePrice(price, size) {
        if (price === '价格需要咨询' || size === '暂无面积数据') {
            return '无法计算';
        }

        const priceNum = parseFloat(price.replace(/[€,\s]/g, ''));
        const sizeNum = parseFloat(size);

        if (!isNaN(priceNum) && !isNaN(sizeNum) && sizeNum > 0) {
            return `${(priceNum / sizeNum).toFixed(2)}/m²`;
        }

        return '无法计算';
    }

    // 生成历史价格HTML
    function generatePriceHistoryHTML(priceHistory) {
        if (!priceHistory || priceHistory.length === 0) {
            return `
                <div style="padding: 15px; text-align: center; color: #666;">
                    暂无历史价格数据
                </div>
            `;
        }

        let historyHTML = '';
        let previousPrice = null;

        priceHistory.forEach((record, index) => {
            const currentPrice = parseFloat(record.price.replace(/[€,\s]/g, ''));
            let priceChange = '';
            let changeClass = '';

            if (previousPrice !== null) {
                const difference = currentPrice - previousPrice;
                const percentChange = ((difference / previousPrice) * 100).toFixed(1);

                if (difference > 0) {
                    priceChange = `↑ +€${Math.abs(difference).toLocaleString()} (+${percentChange}%)`;
                    changeClass = 'price-increase';
                } else if (difference < 0) {
                    priceChange = `↓ -€${Math.abs(difference).toLocaleString()} (${percentChange}%)`;
                    changeClass = 'price-decrease';
                }
            }

            const date = record.created_date || new Date(record.timestamp).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            historyHTML += `
                <div style="position: relative; padding: 15px; margin-bottom: 15px; border-radius: 6px; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div style="color: #666; min-width: 100px;">${date}</div>
                            <div style="font-weight: bold; color: ${index === 0 ? '#D75441' : '#2C3E50'}; font-size: 16px;">${record.price}</div>
                        </div>
                        ${priceChange ? `
                            <div style="display: flex; align-items: center; background-color: ${changeClass === 'price-increase' ? '#F0FFF4' : '#FFF5F5'}; padding: 4px 8px; border-radius: 4px;">
                                <span style="color: ${changeClass === 'price-increase' ? '#28a745' : '#DA3630'}; font-size: 13px;">${priceChange}</span>
                            </div>
                        ` : `
                            <div style="display: flex; align-items: center; background-color: #F8F9FA; padding: 4px 8px; border-radius: 4px;">
                                <span style="color: #666; font-size: 13px;">首次挂牌</span>
                            </div>
                        `}
                    </div>
                    ${index === 0 || index === priceHistory.length - 1 ? `
                        <div style="position: absolute; left: -5px; top: 50%; transform: translateY(-50%); width: 3px; height: 70%; background-color: ${index === 0 ? '#D75441' : '#6c757d'}; border-radius: 2px;"></div>
                    ` : ''}
                </div>
            `;

            previousPrice = currentPrice;
        });

        return historyHTML;
    }

    // 收集房产数据
    function collectPropertyData() {
        const propertyData = {
            property_id: window.location.pathname.split('/').pop(),
            address: Property_address(),
            price: Property_price(),
            size: Property_size(),
            ber: Property_ber(),
            url: window.location.href,
            created_date: Property_created_date(),
            timestamp: new Date().toISOString()
        };

        // 发送数据到服务器
        sendToServer(propertyData);
    }

    // 发送数据到服务器
    function sendToServer(data) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.ncpx.com/myhome.php',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function(response) {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    if (result.price_history) {
                        updatePriceHistory(result.price_history);
                    }
                    console.log('数据处理成功:', result);
                } else {
                    console.error('数据处理失败:', response.statusText);
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
            }
        });
    }

    // 更新历史价格显示
    function updatePriceHistory(priceHistory) {
        const historyContainer = document.querySelector('.jerry-info-window .history-price-container');
        if (historyContainer) {
            historyContainer.innerHTML = generatePriceHistoryHTML(priceHistory);
        }
    }

    // 创建新窗口
    const createNewWindow = () => {
        if (document.querySelector('.jerry-info-window')) {
            return;
        }

        // 创建容器div来包含两个模块
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '24px';
        container.style.margin = '30px auto';
        container.style.padding = '0 10px';
        container.style.maxWidth = '2000px';
        container.style.width = '100%';

        // 创建主要信息模块 (2/3宽度)
        const mainWindow = document.createElement('div');
        mainWindow.className = 'jerry-info-window';
        mainWindow.style.flex = '9';
        mainWindow.style.backgroundColor = '#ffffff';
        mainWindow.style.borderRadius = '16px';
        mainWindow.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
        mainWindow.style.padding = '0';

        // 创建备用模块 (1/3宽度)
        const sideWindow = document.createElement('div');
        sideWindow.className = 'jerry-side-window';
        sideWindow.style.flex = '5';
        sideWindow.style.backgroundColor = '#f0f8ff';
        sideWindow.style.borderRadius = '16px';
        sideWindow.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
        sideWindow.style.minHeight = '200px'; // 临时高度，后续可调整
        sideWindow.style.padding = '0';

        // 获取数据
        const address = Property_address();
        const price = Property_price();
        const ber = Property_ber();
        const size = Property_size();
        const averagePrice = calculateAveragePrice(price, size);

        // 设置主要信息模块的内容
        mainWindow.innerHTML = `
            <div style="padding: 50px;">
                <!-- 标题栏 -->
                <div style="display: flex; align-items: center; margin-bottom: 30px;">
                    <div style="flex-grow: 1;">
                        <h2 style="margin: 0; font-size: 24px; color: #2C3E50; font-weight: 600;">房源详细信息</h2>
                        <div style="margin-top: 8px; color: #666; font-size: 14px;">${address}</div>
                    </div>
                    <div style="background: #FFF3F0; padding: 12px 20px; border-radius: 24px; box-shadow: 0 2px 8px rgba(215, 84, 65, 0.15);">
                        <span style="color: #D75441; font-weight: 600; font-size: 18px;">€${price.replace('€', '')}</span>
                    </div>
                </div>
                
                <!-- 主要信息卡片 -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 35px;">
                    <!-- 面积卡片 -->
                    <div style="background: #FFFFFF; padding: 24px; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="width: 42px; height: 42px; background: #E3F2FD; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px;">📏</span>
                            </div>
                            <div style="margin-left: 14px; color: #666;">建筑面积</div>
                        </div>
                        <div style="font-size: 26px; font-weight: 600; color: #2196F3;">
                            ${size === '暂无面积数据' ? size : `${size} m²`}
                        </div>
                    </div>
                    
                    <!-- 均价卡片 -->
                    <div style="background: #FFFFFF; padding: 24px; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="width: 42px; height: 42px; background: #E8F5E9; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px;">💰</span>
                            </div>
                            <div style="margin-left: 14px; color: #666;">每平米均价</div>
                        </div>
                        <div style="font-size: 26px; font-weight: 600; color: #4CAF50;">
                            €${averagePrice.replace('/m²', '')}
                            <span style="font-size: 14px; font-weight: normal; color: #666;">/m²</span>
                        </div>
                    </div>
                    
                    <!-- 能源等级卡片 -->
                    <div style="background: #FFFFFF; padding: 24px; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="width: 42px; height: 42px; background: #F3E5F5; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px;">⚡</span>
                            </div>
                            <div style="margin-left: 14px; color: #666;">能源等级</div>
                        </div>
                        <div>
                            ${ber !== '暂无等级报告' ?
                                `<img src="https://photos-a.propertyimages.ie/static/images/energyRating/${ber}.png"
                                     style="width: 80px; height: 38px;"
                                     alt="Energy Rating ${ber}">` :
                                '<div style="font-size: 26px; font-weight: 600; color: #9C27B0;">暂无等级报告</div>'}
                        </div>
                    </div>
                </div>

                <!-- 历史价格变动 -->
                <div style="background: #FFFFFF; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                    <div style="padding: 24px; border-bottom: 1px solid #EEE;">
                        <div style="display: flex; align-items: center;">
                            <div style="width: 42px; height: 42px; background: #FFF3F0; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 14px;">
                                <span style="font-size: 20px;">📊</span>
                            </div>
                            <div style="font-weight: 600; font-size: 18px; color: #2C3E50;">历史价格变动</div>
                        </div>
                    </div>
                    <div class="history-price-container" style="padding: 24px;">
                        <div style="padding: 20px; text-align: center; color: #666;">
                            <div style="display: inline-block; width: 28px; height: 28px; border: 2.5px solid #D75441; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                            <div style="margin-top: 12px; font-size: 15px;">加载中...</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        // 设置备用模块的内容
        sideWindow.innerHTML = `
            <div style="padding: 30px;">
                <!-- 标题栏 -->
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="width: 38px; height: 38px; background: #E3F2FD; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 18px;">📝</span>
                    </div>
                    <div style="margin-left: 12px; font-weight: 600; font-size: 18px; color: #2C3E50;">��源备注</div>
                </div>

                <!-- 历史备注列表 -->
                <div style="margin-bottom: 20px;">
                    <div class="notes-list" style="
                        max-height: 300px; 
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column-reverse;
                        gap: 10px;
                    ">
                        <div style="
                            text-align: center;
                            padding: 25px;
                            color: #666;
                            background: white;
                            border-radius: 10px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                        ">
                            <div style="font-size: 15px;">暂无备注</div>
                            <div style="font-size: 13px; margin-top: 8px; color: #999;">
                                可以在下方添加看房心得
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 添加备注区域 -->
                <div>
                    <div style="margin-bottom: 12px;">
                        <span style="font-weight: 600; color: #2C3E50;">��房心得</span>
                    </div>
                    <textarea 
                        class="note-input"
                        placeholder="在这添加你的看房心得..." 
                        style="
                            width: 100%;
                            min-height: 100px;
                            padding: 14px;
                            border: 1px solid #E0E7FF;
                            border-radius: 10px;
                            background: #FFFFFF;
                            font-size: 14px;
                            line-height: 1.6;
                            color: #2C3E50;
                            resize: vertical;
                            margin-bottom: 12px;
                            transition: all 0.3s ease;
                        "
                    ></textarea>
                    <button 
                        class="add-note-btn"
                        style="
                            width: 100%;
                            padding: 10px 20px;
                            background: linear-gradient(to right, #3B82F6, #2563EB);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        "
                    >保存</button>
                </div>
            </div>
        `;

        // 将两个模块添加到容器中
        container.appendChild(mainWindow);
        container.appendChild(sideWindow);

        // 插入容器到图片画廊后面
        const galleryElement = document.querySelector('app-image-gallery');
        if (galleryElement) {
            galleryElement.parentNode.insertBefore(container, galleryElement.nextSibling);
            
            // 初始化备注功能
            initializeNotes();
            
            // 收集并发送数据以获取历史价格
            collectPropertyData();
        }
    };

    window.addEventListener('load', () => {
        createNewWindow();
    });

    const observer = new MutationObserver((mutations) => {
        const galleryElement = document.querySelector('app-image-gallery');
        const jerryWindow = document.querySelector('.jerry-info-window');
        
        if (galleryElement && !jerryWindow) {
            createNewWindow();
            setTimeout(initializeNoteTooltips, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加立即执行的初始检查
    setTimeout(() => {
        const jerryWindow = document.querySelector('.jerry-info-window');
        if (!jerryWindow) {
            createNewWindow();
        }
    }, 1000);

    // 添加删除备注的函数
    function deleteNote(noteId, password) {
        const propertyId = window.location.pathname.split('/').pop();

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.ncpx.com/myhome.php',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                action: 'delete_note',
                note_id: noteId,
                property_id: propertyId,
                password: password
            }),
            onload: function(response) {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        loadNotes(); // 重新加载备注列表
                    } else {
                        alert('删除失败：' + (result.error || '密码错误'));
                    }
                } else {
                    alert('删除失败，请稍后重试');
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
                alert('删除失败，请稍后重试');
            }
        });
    }

    // 添加处备注显示的函数
    function initializeNoteTooltips() {
        document.querySelectorAll('.note-item').forEach(item => {
            const content = item.querySelector('.note-content');
            const popup = item.querySelector('.note-popup');
            const deleteBtn = item.querySelector('.delete-note');

            if (!content || !popup) return;

            const text = content.textContent;
            if (text.length <= 60) return;

            // 移除旧的事件监听器
            content.removeEventListener('mouseover', showPopup);
            content.removeEventListener('mouseout', hidePopup);
            popup.removeEventListener('mouseleave', hidePopup);
            
            // 添加新的事件监听器
            function showPopup(e) {
                const rect = content.getBoundingClientRect();
                popup.style.display = 'block';
                popup.style.left = `${rect.left}px`;
                popup.style.top = `${rect.top - popup.offsetHeight - 10}px`;
            }

            function hidePopup(e) {
                if (!popup.contains(e.relatedTarget)) {
                    popup.style.display = 'none';
                }
            }

            content.addEventListener('mouseover', showPopup);
            content.addEventListener('mouseout', hidePopup);
            popup.addEventListener('mouseleave', () => popup.style.display = 'none');

            // 添加删除按钮事件
            deleteBtn.addEventListener('click', () => {
                if(prompt('请输入删除密码') === '正确的密码') {
                    // 删除操作
                }
            });
        });
    }

    // 在创建完备注列表后调用初始化函数
    setTimeout(initializeNoteTooltips, 100);

    // 添加备注相关的函数
    function loadNotes() {
        const notesList = document.querySelector('.notes-list');
        const propertyId = window.location.pathname.split('/').pop();

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.ncpx.com/myhome.php',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                action: 'get_notes',
                property_id: propertyId
            }),
            onload: function(response) {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        if (result.notes && result.notes.length > 0) {
                            // 对备注按时间倒序排序
                            const sortedNotes = result.notes.sort((a, b) => {
                                const dateA = new Date(a.created_at);
                                const dateB = new Date(b.created_at);
                                return dateB - dateA; // 降序排序，最新的在前面
                            });

                            // 创建一个容器来存放备注项
                            const notesContainer = document.createElement('div');
                            notesContainer.style.display = 'flex';
                            notesContainer.style.flexDirection = 'column';
                            notesContainer.style.gap = '12px';

                            // 将排序后的备注添加到容器中
                            sortedNotes.forEach(note => {
                                notesContainer.innerHTML += createNoteElement(note);
                            });

                            // 清空并更新列表内容
                            notesList.innerHTML = '';
                            notesList.appendChild(notesContainer);

                            // 重新绑定事件监听器
                            initializeNoteEvents();
                        } else {
                            notesList.innerHTML = `
                                <div style="
                                    text-align: center;
                                    padding: 30px;
                                    color: #666;
                                    background: white;
                                    border-radius: 12px;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                                ">
                                    <div style="font-size: 16px;">暂无备注</div>
                                    <div style="font-size: 13px; margin-top: 8px; color: #999;">
                                        可以在下方添加新的备注
                                    </div>
                                </div>
                            `;
                        }
                    } else {
                        notesList.innerHTML = `
                            <div style="text-align: center; padding: 20px; color: #666;">
                                加载失败，请稍后重试
                            </div>
                        `;
                    }
                } else {
                    notesList.innerHTML = `
                        <div style="text-align: center; padding: 20px; color: #666;">
                            加载失败，请稍后重试
                        </div>
                    `;
                }
            },
            onerror: function(error) {
                notesList.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #666;">
                        加载失败，请稍后重试
                    </div>
                `;
            }
        });
    }

    // 添加新函数用于初始化备注的事件监听器
    function initializeNoteEvents() {
        // 为所有删除按钮添加事件监听
        document.querySelectorAll('.note-item .delete-note-btn').forEach(btn => {
            const noteId = btn.getAttribute('data-note-id');
            btn.onclick = () => {
                const password = prompt('请输入删除密码');
                if (password) {
                    deleteNote(noteId, password);
                }
            };
        });

        // 为长文本添加悬浮显示功能
        document.querySelectorAll('.note-item .note-content').forEach(content => {
            const popup = content.nextElementSibling;
            if (content.textContent.length > 60) {
                content.onmouseover = (e) => {
                    const rect = content.getBoundingClientRect();
                    popup.style.display = 'block';
                    popup.style.left = `${rect.left}px`;
                    popup.style.top = `${rect.top - popup.offsetHeight - 10}px`;
                };
                content.onmouseout = (e) => {
                    if (!popup.contains(e.relatedTarget)) {
                        popup.style.display = 'none';
                    }
                };
                popup.onmouseleave = () => {
                    popup.style.display = 'none';
                };
            }
        });
    }

    // 修改 createNoteElement 函数，添加 note-id 属性
    function createNoteElement(note) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.style.cssText = `
            background: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            position: relative;
        `;

        noteElement.innerHTML = `
            <div class="note-content" style="
                color: #2C3E50;
                font-size: 14px;
                line-height: 1.6;
                cursor: pointer;
            ">${note.note_content.length > 60 ? note.note_content.substring(0, 60) + '...' : note.note_content}</div>
            
            <div class="note-popup" style="
                display: none;
                position: fixed;
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.2);
                max-width: 400px;
                z-index: 1000;
                line-height: 1.6;
                color: #2C3E50;
                font-size: 14px;
            ">${note.note_content}</div>

            <div style="
                margin-top: 8px;
                font-size: 12px;
                color: #666;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>${new Date(note.created_at).toLocaleString()}</span>
                <button 
                    class="delete-note-btn"
                    data-note-id="${note.id}"
                    style="
                        padding: 4px 8px;
                        border: none;
                        background: none;
                        color: #DC2626;
                        cursor: pointer;
                        font-size: 12px;
                        opacity: 0.6;
                        transition: opacity 0.2s ease;
                    "
                >删除</button>
            </div>
        `;

        return noteElement.outerHTML;
    }

    // 添加备注的函数
    function addNote() {
        const textarea = document.querySelector('.note-input');
        const content = textarea.value.trim();
        
        if (!content) {
            alert('请输入备注内容');
            return;
        }

        const propertyId = window.location.pathname.split('/').pop();

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.ncpx.com/myhome.php',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                action: 'add_note',
                property_id: propertyId,
                note_content: content
            }),
            onload: function(response) {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        textarea.value = ''; // 清空输入框
                        
                        // 立即重新加载备注列表，确保新备注显示在最前面
                        loadNotes();
                    } else {
                        alert('添加备注失败：' + (result.error || '未知错误'));
                    }
                } else {
                    alert('添加备注失败，请稍后重试');
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
                alert('添加备注失败，请稍后重试');
            }
        });
    }

    // 在创建窗口后初始化备注功能
    function initializeNotes() {
        // 载备注列表
        loadNotes();

        // 添加保存按钮事件监听
        const addButton = document.querySelector('.add-note-btn');
        if (addButton) {
            addButton.removeEventListener('click', addNote); // 移除旧的事件监听
            addButton.addEventListener('click', addNote);
        }
    }

    // 在创建完窗口后调用初始化
    setTimeout(initializeNotes, 100);
})(); 