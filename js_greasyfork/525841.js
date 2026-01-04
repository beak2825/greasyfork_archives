// ==UserScript==
// @name         过滤帖子用户ID
// @namespace    https://18cm.me
// @version      0.8
// @description  过滤指定用户ID的帖子
// @author       semen
// @license      MIT
// @match        https://sss.921069.xyz*
// @match        https://stboy.net*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525841/%E8%BF%87%E6%BB%A4%E5%B8%96%E5%AD%90%E7%94%A8%E6%88%B7ID.user.js
// @updateURL https://update.greasyfork.org/scripts/525841/%E8%BF%87%E6%BB%A4%E5%B8%96%E5%AD%90%E7%94%A8%E6%88%B7ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认的屏蔽用户数据
    const defaultBlockedUsers = {
        "35996":"广告",
"97633":"一键屏蔽",
"168219":"磨枪刷屏",
"186309":"一键屏蔽",
"308970":"一键屏蔽",
"487060":"一键屏蔽",
"740508":"一键屏蔽",
"790305":"一键屏蔽",
"849626":"一键屏蔽",
"962061":"发广告",
"1006934":"花钱买片广告",
"1116789":"一键屏蔽",
"1476982":"一键屏蔽",
"1499336":"一键屏蔽",
"1523542":"花钱按摩广告",
"1619193":"毒品",
"1670331":"发花钱按摩广告",
"1827138":"刷屏",
"1913761":"一键屏蔽",
"2125883":"一键屏蔽",
"2287187":"毒品",
"2309866":"发广告",
"2327428":"刷屏求交友",
"2501585":"一键屏蔽",
"2541339":"一键屏蔽",
"2558568":"消费按摩广告",
"2618429":"一键屏蔽",
"2644664":"刷屏跑外卖",
"2709495":"花钱按摩广告",
"2709502":"消费按摩广告",
"2710939":"一键屏蔽",
"2710940":"一键屏蔽",
"2710943":"一键屏蔽",
"2710944":"一键屏蔽",
"2710945":"一键屏蔽",
"2714466":"花钱按摩广告",
"2714468":"发广告",
"2714469":"消费按摩广告",
"2718169":"一键屏蔽",
"2718217":"一键屏蔽",
"2718914":"刷屏骗钱",
"2738657":"一键屏蔽",
"2744642":"一键屏蔽",
"2764061":"骗子",
"2764784":"一键屏蔽",
"2766880":"一键屏蔽",
"2775547":"一键屏蔽",
"2804102":"卖毒品",
"2837792":"发广告",
"-2826025":"永封",
"35996":"广告",
"97633":"一键屏蔽",
"168219":"磨枪刷屏",
"186309":"一键屏蔽",
"308970":"一键屏蔽",
"487060":"一键屏蔽",
"740508":"一键屏蔽",
"790305":"一键屏蔽",
"849626":"一键屏蔽",
"962061":"发广告",
"1006934":"花钱买片广告",
"1116789":"一键屏蔽",
"1476982":"一键屏蔽",
"1499336":"一键屏蔽",
"1523542":"花钱按摩广告",
"1619193":"毒品",
"1670331":"发花钱按摩广告",
"1827138":"刷屏",
"1913761":"一键屏蔽",
"2125883":"一键屏蔽",
"2287187":"毒品",
"2309866":"发广告",
"2327428":"刷屏求交友",
"2501585":"一键屏蔽",
"2541339":"一键屏蔽",
"2558568":"消费按摩广告",
"2618429":"一键屏蔽",
"2644664":"刷屏跑外卖",
"2709495":"花钱按摩广告",
"2709502":"消费按摩广告",
"2710939":"一键屏蔽",
"2710940":"一键屏蔽",
"2710943":"一键屏蔽",
"2710944":"一键屏蔽",
"2710945":"一键屏蔽",
"2714466":"花钱按摩广告",
"2714468":"发广告",
"2714469":"消费按摩广告",
"2718169":"一键屏蔽",
"2718217":"一键屏蔽",
"2718914":"刷屏骗钱",
"2738657":"一键屏蔽",
"2744642":"一键屏蔽",
"2764061":"骗子",
"2764784":"一键屏蔽",
"2766880":"一键屏蔽",
"2775547":"一键屏蔽",
"2804102":"卖毒品",
"2837792":"发广告",
"-2826025":"永封"
    };

    // 获取屏蔽用户数据，如果没有则使用默认数据
    let blockedUsers = GM_getValue('blockedUsers', {});
    if (Object.keys(blockedUsers).length === 0) {
        blockedUsers = defaultBlockedUsers;
        GM_setValue('blockedUsers', blockedUsers);
    }

    // 添加自定义弹框   
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.width = '80%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1001';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.display = 'none';
    popup.id = 'blockPopup';

    // 输入框和标签
    const input = document.createElement('textarea');
    input.placeholder = '输入用户ID和原因 (格式: 用户ID:原因)\n例如：33482:发广告的';
    input.style.width = '100%';
    input.style.height = '550px';
    input.style.padding = '10px';
    input.style.boxSizing = "border-box"; // 标准写法
    input.style.marginBottom = '10px';
    input.id = 'userInput';

    // 确认按钮
    const button = document.createElement('button');
    button.textContent = '确认屏蔽';
    button.style.padding = '10px';
    button.style.width = '100%';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px';
    closeButton.style.width = '100%';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    // 关闭按钮事件
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // 一键转换按钮
    const convertButton = document.createElement('button');
    convertButton.textContent = '一键转换';
    convertButton.style.marginTop = '10px';
    convertButton.style.padding = '5px';
    convertButton.style.width = '100%';
    convertButton.style.backgroundColor = '#f44336';
    convertButton.style.color = 'white';
    convertButton.style.border = 'none';
    convertButton.style.cursor = 'pointer';
    convertButton.addEventListener('click', () => {
        const inputValue = input.value.trim();
        // 处理换行并转换ID
        const processed = inputValue.split(/\r?\n/)           // 兼容不同系统的换行符
            .map(line => {
                if (!line.includes(':')) return line;        // 跳过无效行
                
                // 分割ID和原因（原因可能包含冒号）
                const [idPart, ...reasonParts] = line.split(':');
                const reason = reasonParts.join(':');        // 重新合并原因部分
                
                // 转换ID
                const originalId = idPart.trim();
                const numId = parseInt(originalId, 10);
                
                if (isNaN(numId)) return line;               // 无效ID跳过
                
                // 反转数值并保持字符串格式
                return `${numId * -1}:${reason}`;
            })
            .join('\n');                                     // 重新拼接为字符串
            input.value = processed;
    });

    
    // 确认按钮事件
    button.addEventListener('click', () => {
        const inputValue = input.value.trim();
        if (inputValue) {
            const lines = inputValue.split('\n');
            let newBlockedUsers = {};
            lines.forEach(line => {
                const [userId, reason] = line.split(':').map(item => item.trim());
                if (userId && reason) {
                    newBlockedUsers[userId] =reason;
                }
            });
            if (Object.keys(newBlockedUsers).length > 0) {
                // 合并新数据和原来的数据
                let storedBlockedUsers = GM_getValue('blockedUsers', {});
                // storedBlockedUsers = {...storedBlockedUsers, ...newBlockedUsers};
                GM_setValue('blockedUsers', newBlockedUsers);
                alert('设置完成，页面将自动刷新');
                location.reload(); // 刷新页面
            } else {
                alert('请输入正确的格式，例如：33482:发广告的 或 -33482:发广告的');
            }
        }else{
            GM_setValue('blockedUsers', '');
            alert('设置完成，页面将自动刷新');
            location.reload(); // 刷新页面
        }
    });

    popup.appendChild(input);
    popup.appendChild(button);
    popup.appendChild(closeButton);
    popup.appendChild(convertButton);
    
    document.body.appendChild(popup);
   

    // 从接口获取屏蔽的用户ID和原因
    function fetchBlockedUsersFromAPI() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.921069.xyz/st/getBlockedUsers', // 替换为实际的API地址
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.blockedUsers) {
                            resolve(data.blockedUsers);
                        } else {
                            reject('数据格式错误');
                        }
                    } catch (e) {
                        reject('解析失败');
                    }
                },
                onerror: function() {
                    reject('获取失败');
                }
            });
        });
    }

    // 页面加载时初始化
    // window.addEventListener('load', function() {
        // 获取接口数据，如果获取失败，则回退到 GM_getValue
        // let blockedUsers = GM_getValue('blockedUsers', {});

        fetchBlockedUsersFromAPI()
            .then(apiBlockedUsers => {
                blockedUsers = apiBlockedUsers;
                GM_setValue('blockedUsers', blockedUsers);
            })
            .catch(err => {
                console.warn('接口获取失败，使用本地存储的数据', err);
            })
            .finally(() => {
                // 添加一个“过滤用户”按钮
                const filterBtn = document.createElement('button');
                filterBtn.textContent = '过滤用户';
                filterBtn.style.position = 'fixed';
                filterBtn.style.top = '10px';
                filterBtn.style.right = '10px';
                filterBtn.style.zIndex = '1000';
                document.body.appendChild(filterBtn);

                // 点击按钮弹出输入框
                filterBtn.addEventListener('click', function() {
                    const popup = document.getElementById('blockPopup');
                    if (popup) {
                        popup.style.display = 'block';
                    }

                    // 显示之前保存的屏蔽数据
                    const inputField = document.getElementById('userInput');
                    const savedBlockedUsers = GM_getValue('blockedUsers', {});
                    const formattedData = Object.entries(savedBlockedUsers)
                        .map(([userId, data]) => {
                            return `${userId}:${data}`;
                        })
                        .join('\n');
                    inputField.value = formattedData;
                });

                // 遍历页面上的帖子，进行过滤
                function filterPosts() {
                    const posts = document.querySelectorAll('#threadlisttableid tbody[id^="normalthread_"]');
                    posts.forEach(post => {
                        const typeCell = post.querySelector('.common em>a[href*="forum.php?mod=forumdisplay&fid="]');
                        if(post.innerHTML.includes('MB花钱找')){
                            post.remove();
                        }
                        // if (typeCell && typeCell.innerText === "MB花钱找友") {
                        //     post.remove();
                        // }
                        const authorCell = post.querySelector('.by a[href*="home.php?mod=space&uid="]');
                        if (authorCell) {
                            const userIdMatch = authorCell.href.match(/uid=(\d+)/);
                            if (userIdMatch) {
                                const userId = userIdMatch[1];
                                const userData = blockedUsers[userId] || blockedUsers[-userId];
                                if (userData) {
                                    if (blockedUsers[-userId]) {
                                        // 隐藏被屏蔽的帖子
                                        // post.style.display = 'none';
                                        post.remove();
                                        const reasonTag = document.createElement('div');
                                        reasonTag.textContent = `此帖已被屏蔽，原因: ${userData}`;
                                        reasonTag.style.color = 'red';
                                        post.appendChild(reasonTag);
                                    } else {
                                        // 在标题下标注原因
                                        const titleCell = post.querySelector('.common');
                                        if (titleCell && !titleCell.hasAttribute('data-annotated')) {
                                            const reasonTag = document.createElement('div');
                                            // reasonTag.textContent = `${userData}(${userId})`;
                                            // reasonTag.style.color = 'orange';
                                            // // 添加标记属性，避免下次再处理
                                            // titleCell.setAttribute('data-annotated', 'true');
                                            // titleCell.appendChild(reasonTag);
                                            const reasonLink = document.createElement('a');
                                            reasonLink.textContent = `${userData}(${userId})`;
                                            reasonLink.href = `/home.php?mod=space&uid=${userId}&do=thread&view=me&from=space`;
                                            reasonLink.style.color = 'orange';
                                            reasonLink.style.textDecoration = 'none'; // 移除下划线
                                            reasonLink.target = '_blank'; // 新标签页打开

                                            // 标记已处理的单元格
                                            titleCell.setAttribute('data-annotated', 'true');
                                            reasonTag.appendChild(reasonLink);
                                            titleCell.appendChild(reasonTag);

                                            // 强制将 titleCell 下所有 <a> 元素的字体颜色设置为灰色
                                            const links = titleCell.querySelectorAll(':scope > a,em>a,em,td.num');
                                            links.forEach(link => {
                                                link.style.color = '#e5e5e5';
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                // 初始过滤
                filterPosts();

                // 使用 MutationObserver 监听列表变化
                const threadList = document.querySelector('#threadlisttableid');
                if (threadList) {
                    const observer = new MutationObserver(() => {
                        // 当列表发生变化时，重新过滤帖子
                        console.log("123");
                        filterPosts();
                    });

                    observer.observe(threadList, {
                        childList: true,  // 监听子节点的变化
                        subtree: false,    // 监听所有后代节点
                    });
                }                
            });
    // });

    // 查找页面上的 <h2 class="mbn"> 元素
    const h2Elements = document.querySelectorAll('h2.mbn');
    h2Elements.forEach(h2 => {
        const usernameElement = h2.querySelector('.xw0');
        if (usernameElement) {
            const userIdMatch = usernameElement.textContent.match(/\(UID: (\d+)\)/);
            if (userIdMatch) {
                const userId = userIdMatch[1];

                // 创建并添加 "屏蔽此用户" 链接
                const blockLink = document.createElement('a');
                blockLink.href = 'javascript:void(0)';
                blockLink.textContent = '屏蔽此用户';
                blockLink.style.color = 'red';
                blockLink.style.marginLeft = '10px';
                blockLink.style.cursor = 'pointer';

                blockLink.addEventListener('click', () => {
                    // 将用户ID和原因添加到屏蔽列表中
                    blockedUsers[userId] = '一键屏蔽';
                    // let storedBlockedUsers = GM_getValue('blockedUsers', {});
                    GM_setValue('blockedUsers', blockedUsers);
                    alert(`用户 ${userId} 已被自动屏蔽！`);
                    location.reload(); // 刷新页面以应用更改
                });

                h2.appendChild(blockLink); // 将链接添加到 <h2> 元素后面
            }
        }
    });
})();