// ==UserScript==
// @name         NGA 少女前线&少女前线2追放表情包
// @namespace    https://greasyfork.org/users/1302103
// @version      1.4.004
// @icon         http://bbs.nga.cn/favicon.ico
// @description  少前&少前2追放表情脚本
// @author       原作者:AgLandy 少前表情脚本原作者：Starainbow 魔改：P*4
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|ngabbs\.com)/.+/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      gitee.com
// @downloadURL https://update.greasyfork.org/scripts/495052/NGA%20%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF2%E8%BF%BD%E6%94%BE%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/495052/NGA%20%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF2%E8%BF%BD%E6%94%BE%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

//原仓鼠表情脚本的发布地址：https://nga.178.com/read.php?tid=11430750
//SOP2表情的发布地址：http://m.dcinside.com/board/gfl2/362213
//年糕狗表情的发布地址：
//Part1.https://www.weibo.com/1725474505/Fwanjb8M5
//Part2.https://www.weibo.com/1725474505/FwanEqlMO
//Bonus.https://bbs.nga.cn/read.php?tid=17784222
//云图表情包：@少前云图计划
//追放表情包来源：@少女前线2-追放 & https://www.pixiv.net/users/455690
//16Lab表情来源1：https://ngabbs.com/read.php?pid=755956251&opt=128
//16Lab表情来源2：https://ngabbs.com/read.php?pid=755963671&opt=128
//薯片：https://weibo.com/1934379845/OgXLH6UAz
//旧脚本1.2.0.5的发布地址：http://nga.178.com/read.php?tid=16127479

((ui, poster) => {
    if (!ui || !poster) return;

    const hookFunction = (object, functionName, callback) => {
        ((originalFunction) => {
            object[functionName] = function () {
                const returnValue = originalFunction.apply(this, arguments);
                callback.apply(this, [returnValue, originalFunction, arguments]);
                return returnValue;
            };
        })(object[functionName]);
    };

    const updateStoredIconSetStatus = () => {
        let iconSetStatus = GM_getValue('iconSetStatus') || {};
        GM_setValue('iconSetStatus', iconSetStatus);
    };

    const fetchIconSets = () => {
        const cachedIconSets = GM_getValue('cachedIconSets');
        const cacheTimestamp = GM_getValue('cacheTimestamp');
        const now = new Date(); // 获取当前时间
        const formattedNow = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}`; // 格式化时间为年月日时
        const cacheDuration = 72 * 60 * 60 * 1000; // 缓存有效期为72小时    

        if (cachedIconSets && cacheTimestamp && (formattedNow - cacheTimestamp < cacheDuration)) {
            // 如果缓存有效，则不更新 iconSetStatus
            const iconSets = JSON.parse(cachedIconSets);
            updateIconSetStatus(iconSets);
        } else {
            // 如果缓存无效，则重新获取数据并更新 iconSetStatus
            const urls = [
                "https://gitee.com/t-800x/gf-emoji-warehouse/raw/master/Image/girls_frontline.json",
                "https://gitee.com/t-800x/gf-emoji-warehouse/raw/master/Image/girls_frontline2.json",
                "https://gitee.com/t-800x/gf-emoji-warehouse/raw/master/Image/project_neural_cloud.json",
                "https://gitee.com/t-800x/gf-emoji-warehouse/raw/master/Image/extra_emoji.json"
            ]; // 托管文件地址

            const fetchData = (url) => {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            if (response.status === 200) {
                                try {
                                    const parsedData = JSON.parse(response.responseText);
                                    resolve(parsedData);
                                } catch (e) {
                                    console.error("Failed to parse response:", e);
                                    reject(e);
                                }
                            } else {
                                console.error("Failed to fetch icon sets");
                                reject(new Error("Failed to fetch icon sets"));
                            }
                        },
                        onerror: function () {
                            console.error("Error occurred while fetching icon sets");
                            reject(new Error("Error occurred while fetching icon sets"));
                        }
                    });
                });
            };

            Promise.all(urls.map(fetchData)).then(dataArray => {
                const allIconSets = dataArray.reduce((acc, data) => {
                    return acc.concat(data.groups);
                }, []);

                // 比对新旧数据并更新
                if (cachedIconSets) {
                    const oldIconSets = JSON.parse(cachedIconSets);
                    const updatedIconSets = allIconSets.map(newGroup => {
                        const oldGroup = oldIconSets.find(old => old.name === newGroup.name);
                        return oldGroup ? { ...oldGroup, ...newGroup } : newGroup;
                    });
                    GM_setValue('cachedIconSets', JSON.stringify(updatedIconSets));
                } else {
                    GM_setValue('cachedIconSets', JSON.stringify(allIconSets));
                }

                GM_setValue('cacheTimestamp', formattedNow); // 更新缓存时间戳为当前时间
                updateIconSetStatus(allIconSets);
            }).catch(error => {
                console.error("Error fetching icon sets:", error);
            });
        }
    };

    // 更新存储的表情包状态
    const updateIconSetStatus = (iconSets) => {
        let iconSetStatus = GM_getValue('iconSetStatus') || {};
        const newIconSetStatus = {};

        iconSets.forEach(group => {
            const groupName = group.name;
            if (groupName in iconSetStatus) {
                newIconSetStatus[groupName] = iconSetStatus[groupName];
            } else {
                newIconSetStatus[groupName] = true; // 默认启用
            }
        });

        GM_setValue('iconSetStatus', newIconSetStatus);
        console.log('Updated iconSetStatus:', newIconSetStatus);
        console.log('Saved iconSetStatus to storage');
    };

    fetchIconSets();


    // 创建浮动窗口
    // 管理表情包
    const createSettingsWindow = () => {
        const settingsWindow = document.createElement('div');
        settingsWindow.style.position = 'fixed';
        settingsWindow.style.top = '50px';
        settingsWindow.style.right = '50px';
        settingsWindow.style.width = '300px';
        settingsWindow.style.backgroundColor = '#e9e6de';
        settingsWindow.style.padding = '20px';
        settingsWindow.style.border = '1px solid #000';
        settingsWindow.style.zIndex = '999';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '2px';
        closeBtn.style.right = '5px';
        closeBtn.onclick = () => {
            document.body.removeChild(settingsWindow);
        };
        settingsWindow.appendChild(closeBtn);

        const table = document.createElement('table');
        table.style.width = '100%';

        const iconSets = JSON.parse(GM_getValue('cachedIconSets'));
        let iconSetStatus = GM_getValue('iconSetStatus') || {};

        // 更新 iconSetStatus 以匹配当前的 cachedIconSets
        iconSets.forEach(group => {
            const groupName = group.name;
            if (!(groupName in iconSetStatus)) {
                iconSetStatus[groupName] = true; // 默认启用
            }
        });

        // 移除不在 cachedIconSets 中的旧状态
        for (const groupName in iconSetStatus) {
            if (!iconSets.some(group => group.name === groupName)) {
                delete iconSetStatus[groupName];
            }
        }

        GM_setValue('iconSetStatus', iconSetStatus);

        iconSets.forEach(group => {
            const groupName = group.name;

            const row = table.insertRow();

            const nameCell = row.insertCell(0);
            nameCell.innerText = groupName;

            const enableCell = row.insertCell(1);
            const enableCheckbox = document.createElement('input');
            enableCheckbox.type = 'checkbox';
            enableCheckbox.checked = iconSetStatus[groupName];
            enableCell.appendChild(enableCheckbox);

            enableCheckbox.addEventListener('change', (event) => {
                const isEnabled = event.target.checked;

                iconSetStatus[groupName] = isEnabled;
                GM_setValue('iconSetStatus', iconSetStatus);

                const statusMessage = document.createElement('div');
                statusMessage.textContent = `${groupName}已${isEnabled ? '启用' : '禁用'}`;
                statusMessage.style.position = 'fixed';
                statusMessage.style.top = '10px';
                statusMessage.style.left = '10px';
                statusMessage.style.backgroundColor = isEnabled ? '#4CAF50' : '#f44336';
                statusMessage.style.padding = '10px';
                statusMessage.style.borderRadius = '5px';
                statusMessage.style.transition = 'opacity 1s ease-in-out';

                document.body.appendChild(statusMessage);

                setTimeout(() => {
                    statusMessage.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(statusMessage);
                    }, 1000);
                }, 1500);
            });
        });

        settingsWindow.appendChild(table);

        document.body.appendChild(settingsWindow);
    };

    // 注册菜单命令
    GM_registerMenuCommand('设置', () => {
        createSettingsWindow();
    });

    GM_registerMenuCommand('获取更新', () => {
        GM_deleteValue('cachedIconSets');
        GM_deleteValue('cacheTimestamp');

        const statusMessage = document.createElement('div');
        statusMessage.textContent = '请刷新网页';
        statusMessage.style.position = 'fixed';
        statusMessage.style.top = '10px';
        statusMessage.style.left = '10px';
        statusMessage.style.backgroundColor = '#4CAF50';
        statusMessage.style.padding = '10px';
        statusMessage.style.borderRadius = '5px';
        statusMessage.style.transition = 'opacity 1s ease-in-out';

        document.body.appendChild(statusMessage);

        setTimeout(() => {
            statusMessage.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(statusMessage);
            }, 1000);
        }, 1500);
    });

    // 表情包状态的初始化
    let iconSetStatus = GM_getValue('iconSetStatus') || {};
    console.log('Initial iconSetStatus:', iconSetStatus);

    // 添加表情
    const loadIcons = (loaded) => {
        if (loaded) return;

        const { correctAttachUrl } = ui;
        const tabs = poster.selectSmilesw._.__c.firstElementChild;
        const contents = poster.selectSmilesw._.__c.lastElementChild;

        const iconSets = JSON.parse(GM_getValue('cachedIconSets'));

        iconSets.forEach(group => {
            const groupName = group.name;
            const author = group.author;
            const tab = document.createElement('BUTTON');
            const content = document.createElement('DIV');

            tab.className = 'block_txt_big';
            tab.innerText = groupName;
            const isIconSetStatus = iconSetStatus[groupName];
            if (isIconSetStatus) {
                tab.onclick = () => {
                    tabs.firstChild.textContent = author; // 统一作者名称

                    contents.childNodes.forEach((c) => {
                        c.style.display = c !== content ? 'none' : '';
                    });

                    if (content.childNodes.length === 0) {
                        const sliderContainer = document.createElement('DIV');
                        sliderContainer.style.display = 'flex';
                        sliderContainer.style.flexDirection = 'column';
                        sliderContainer.style.overflowX = 'auto';
                        sliderContainer.style.whiteSpace = 'nowrap';

                        const rows = 3; // 限制显示三行表情
                        const iconsPerRow = Math.ceil(group.data.length / rows);

                        // 显示注释
                        for (let i = 0; i < rows; i++) {
                            const rowContainer = document.createElement('DIV');
                            rowContainer.style.display = 'flex';
                            rowContainer.style.flexDirection = 'row';

                            for (let j = 0; j < iconsPerRow; j++) {
                                const index = i * iconsPerRow + j;
                                if (index < group.data.length) {
                                    const icon = group.data[index];
                                    const iconElement = document.createElement('IMG');
                                    iconElement.dataset.src = correctAttachUrl(icon.img);
                                    iconElement.style.maxHeight = '100px';
                                    iconElement.style.margin = '0 5px';
                                    if (icon.name) {
                                        iconElement.title = icon.name;
                                    }
                                    iconElement.onclick = () => {
                                        poster.selectSmilesw._.hide();
                                        poster.addText(`[img]${icon.img}[/img]`);
                                    };

                                    rowContainer.appendChild(iconElement);
                                }
                            }

                            sliderContainer.appendChild(rowContainer);
                        }

                        content.appendChild(sliderContainer);

                        // 懒加载图片，并添加随机延时
                        const observer = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const img = entry.target;
                                    const randomDelay = Math.random() * 1000; // 随机延时0到1000毫秒
                                    setTimeout(() => {
                                        img.src = img.dataset.src;
                                        observer.unobserve(img);
                                    }, randomDelay);
                                }
                            });
                        });

                        content.querySelectorAll('img[data-src]').forEach(img => {
                            observer.observe(img);
                        });
                    }
                };

                tabs.appendChild(tab);
                contents.appendChild(content);
            }
        });
    };

    hookFunction(poster, 'selectSmiles', (returnValue) => loadIcons(returnValue));
})(commonui, postfunc);