// ==UserScript==
// @name        抖音绿化插件
// @namespace   http://tampermonkey.net/
// @match       https://www.douyin.com/*
// @require     https://fastly.jsdelivr.net/npm/@whitesev/utils@2.2.9/dist/index.umd.js
// @require     https://cdn.jsdelivr.net/npm/qmsg@1.2.3/dist/index.umd.min.js
// @grant       unsafeWindow
// @run-at      document-start
// @version     1.0
// @license     MIT
// @author      Berger
// @description 抖音网页绿化插件
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/512771/%E6%8A%96%E9%9F%B3%E7%BB%BF%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512771/%E6%8A%96%E9%9F%B3%E7%BB%BF%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function (Qmsg, Utils) {
    'use strict';

    const utils = Utils.noConflict();

    const commonUtils = {
        checkElement(className, callback) {
            const observer = new MutationObserver(function (mutationsList, observer) {
                const element = document.querySelector(className);
                if (element) {
                    observer.disconnect();
                    callback(element)
                }
            });

            observer.observe(document.body, {childList: true, subtree: true});
        },

        removeElement(element) {
            if (element) {
                element.remove()
            }
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            return GM_setValue(name, value);
        },
        validateAndFormatNumber(value, label) {

            // 验证输入是否为有效数字
            const isValidNumber = (input) => /^-?\d+(\.\d+)?$/.test(input);

            if (!isValidNumber(value)) {
                Qmsg.error(`${label} 输入必须是有效数字`);
                return null; // 可以选择返回或给用户提示
            }

            // 检查输入是否为正整数
            const num = parseInt(value);

            if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
                Qmsg.error(`${label} 必须是大于0的整数`);
                return null
            }

            // 检查数字是否超过100亿
            if (num > 1e10) {
                return Qmsg.err(`${label} 不能超过100亿`);
            }

            // 格式化数字
            if (num >= 1e8) {
                return (num / 1e8).toFixed(2) + '亿'; // 超过1亿
            } else if (num >= 1e5) {
                return (num / 1e4).toFixed(2) + '万'; // 超过1万
            } else {
                return num.toString(); // 小于1万
            }
        }
    }

    const pageUtils = {
        switchElement(nameList) {
            const elements = nameList.map(data => {
                return `<div class="UO9vUQo_">
                        <span>${data.name}</span>
                        <div id="${data.id}" class="semi-switch semi-switch-large ${data.isCheck ? 'semi-switch-checked' : ''}">
                            <div class="semi-switch-knob"></div>
                            <input class="semi-switch-native-control" type="checkbox"></div>
                    </div>`;
            });

            // 使用 join() 将数组中的所有元素连接成一个字符串
            return elements.join('');
        }
    }

    function createSysButton() {
        commonUtils.checkElement('.cBtmhsJF', function (buttonBox) {
            GM_addStyle(`
        @media (min-width: 1240px) {
            .MKOzvYDg.eR8RHYtF {
                height: calc(100vh - var(--header-height) - 128px);
            }
        }
    `);
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'pop2P7gf pon8LXvt';
            buttonDiv.innerHTML = `<div class="lFSurLsQ yhpVp3Zf"></div><div class="Gb4fIr9w"><span>绿化插件</span></div>`
            buttonBox.appendChild(buttonDiv);
            // 添加点击事件以弹出对话框
            buttonDiv.onclick = function () {
                showDialog();
            };

        })
    }

    // 显示对话框的函数
    function showDialog() {
        // 创建对话框背景
        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'dialog-overlay';
        dialogOverlay.style.position = "fixed"
        dialogOverlay.style.top = "0"
        dialogOverlay.style.left = "0"
        dialogOverlay.style.right = "0"
        dialogOverlay.style.bottom = "0"
        dialogOverlay.style.background = "rgba(0, 0, 0, 0.5)"
        dialogOverlay.style.display = "flex"
        dialogOverlay.style.justifyContent = "center"
        dialogOverlay.style.alignItems = "center"
        dialogOverlay.style.zIndex = "1000"

        // 创建对话框内容
        const dialogContent = document.createElement('div');
        dialogContent.setAttribute('role', 'dialog');
        dialogContent.setAttribute('aria-modal', 'true');
        dialogContent.setAttribute('aria-labelledby', 'semi-modal-title');
        dialogContent.setAttribute('aria-describedby', 'semi-modal-body');
        dialogContent.className = 'semi-modal-content s3DGxdr5';

        const modalBody = document.createElement('div');
        modalBody.className = 'semi-modal-body';
        modalBody.id = 'semi-modal-body';
        modalBody.setAttribute('x-semi-prop', 'children');

        const dialogMain = document.createElement('div');
        // 创建对话框标题
        dialogMain.className = 'GL0Q_LOW';
        dialogMain.innerHTML = ` <div class="w3QE_iRj"><span class="i96lusL1">${Constants.DIALOG_TITLE}
 <div style="position:absolute;top: 1rem;margin-left: 0.4rem" class="semi-tag semi-tag-small semi-tag-circle semi-tag-solid semi-tag-pink-solid">
    <div class="semi-tag-content semi-tag-content-ellipsis">${Constants.VERSION}</div>
</div>
 </span>
                <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="mOV4ZwvR">
                    <path d="M22.133 23.776a1.342 1.342 0 1 0 1.898-1.898l-4.112-4.113 4.112-4.112a1.342 1.342 0 0 0-1.898-1.898l-4.112 4.112-4.113-4.112a1.342 1.342 0 1 0-1.898 1.898l4.113 4.112-4.113 4.113a1.342 1.342 0 0 0 1.898 1.898l4.113-4.113 4.112 4.113z"
                          fill="#0A0C20"></path>
                </svg>
            </div>`
        modalBody.appendChild(dialogMain);


        const contentDiv = document.createElement('div')
        contentDiv.className = 'NrFxEhcf'
        dialogMain.appendChild(contentDiv)

        // 对话框侧边栏
        const leftNavUl = document.createElement('ul');
        leftNavUl.className = 'uDQmgB5K';
        const leftNavChild01 = document.createElement('li');
        leftNavChild01.className = 'VystVx9t PxXsmnUU'
        leftNavChild01.id = 'left'
        leftNavChild01.innerHTML = `<svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="IqnUAd8P"
                             viewBox="-5 -7 36 36">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2ZM6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H9C9.55229 20 10 19.5523 10 19V5C10 4.44772 9.55229 4 9 4H6Z" fill="currentColor"></path>
                        </svg>
                        <span>侧边栏</span>`
        leftNavUl.appendChild(leftNavChild01);

        const leftNavChild02 = document.createElement('li');
        leftNavChild02.className = 'VystVx9t'
        leftNavChild02.id = 'top'
        leftNavChild02.innerHTML = `<svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="OOh_ZFHT"
                             viewBox="-5 -7 36 36">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2H5ZM6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7H18C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5H6ZM5 10C5 9.44772 5.44772 9 6 9H10C10.5523 9 11 9.44772 11 10V18C11 18.5523 10.5523 19 10 19H6C5.44772 19 5 18.5523 5 18V10ZM14 9C13.4477 9 13 9.44772 13 10V15C13 15.5523 13.4477 16 14 16H18C18.5523 16 19 15.5523 19 15V10C19 9.44772 18.5523 9 18 9H14Z" fill="currentColor"></path>
                        </svg>
                        <span>顶部</span>`
        leftNavUl.appendChild(leftNavChild02);

        const leftNavChild03 = document.createElement('li');
        leftNavChild03.className = 'VystVx9t'
        leftNavChild03.id = 'other'
        leftNavChild03.innerHTML = `<svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="OOh_ZFHT"
                             viewBox="-5 -7 36 36">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6632 5C14.8792 4.54537 15 4.0368 15 3.5C15 1.567 13.433 0 11.5 0C9.567 0 8 1.567 8 3.5C8 4.0368 8.12085 4.54537 8.33682 5H5C3.89543 5 3 5.89543 3 7V10.3368C3.45463 10.1208 3.9632 10 4.5 10C6.433 10 8 11.567 8 13.5C8 15.433 6.433 17 4.5 17C3.9632 17 3.45463 16.8792 3 16.6632V21C3 22.1046 3.89543 23 5 23H18C19.1046 23 20 22.1046 20 21V16.9646C20.1633 16.9879 20.3302 17 20.5 17C22.433 17 24 15.433 24 13.5C24 11.567 22.433 10 20.5 10C20.3302 10 20.1633 10.0121 20 10.0354V7C20 5.89543 19.1046 5 18 5H14.6632Z" fill="currentColor"></path>
                        </svg>
                        <span>其他</span>`
        leftNavUl.appendChild(leftNavChild03);

        const leftNavChild05 = document.createElement('li');
        leftNavChild05.className = 'VystVx9t'
        leftNavChild05.id = 'entertain'
        leftNavChild05.innerHTML = `
                        <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="IqnUAd8P"
     viewBox="-5 -7 36 36">
    <path d="M0.829978 7.659C0.590978 6.892 1.50498 6.29 2.11498 6.813L3.96998 8.402C4.32328 8.70469 4.74214 8.92106 5.19346 9.03401C5.64478 9.14696 6.11618 9.15339 6.57041 9.05281C7.02464 8.95222 7.44925 8.74737 7.81069 8.45445C8.17213 8.16152 8.46049 7.78855 8.65298 7.365L11.091 2.003C11.446 1.221 12.556 1.221 12.911 2.003L15.349 7.365C15.5415 7.78855 15.8298 8.16152 16.1913 8.45445C16.5527 8.74737 16.9773 8.95222 17.4315 9.05281C17.8858 9.15339 18.3572 9.14696 18.8085 9.03401C19.2598 8.92106 19.6787 8.70469 20.032 8.402L21.886 6.813C22.496 6.29 23.41 6.893 23.17 7.659L19.44 19.597C19.3127 20.0041 19.0586 20.3598 18.7148 20.6122C18.371 20.8646 17.9555 21.0005 17.529 21H6.46998C6.04369 21 5.62856 20.8637 5.28515 20.6112C4.94174 20.3586 4.68801 20.0029 4.56098 19.596L0.830978 7.66L0.829978 7.659Z"
          fill="currentColor"></path>
</svg>
                        <span>娱乐功能</span>`
        leftNavUl.appendChild(leftNavChild05);

        const leftNavChild04 = document.createElement('li');
        leftNavChild04.className = 'VystVx9t'
        leftNavChild04.id = 'about'
        leftNavChild04.innerHTML =
            `
            <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" class="IqnUAd8P"
     viewBox="-5 -7 36 36">
    <path d="M12.0101 1C5.92171 1 1 5.92171 1 12.0101C1 16.8771 4.15354 20.9967 8.5284 22.455C9.07526 22.5644 9.27577 22.218 9.27577 21.9264C9.27577 21.6712 9.25754 20.7962 9.25754 19.8848C6.19514 20.541 5.55714 18.5723 5.55714 18.5723C5.06497 17.2963 4.33583 16.9682 4.33583 16.9682C3.33326 16.2938 4.40874 16.2938 4.40874 16.2938C5.52069 16.3667 6.104 17.4239 6.104 17.4239C7.08834 19.101 8.67423 18.627 9.31223 18.3354C9.40337 17.6245 9.69503 17.1323 10.0049 16.8589C7.56229 16.6037 4.99206 15.6558 4.99206 11.4267C4.99206 10.2237 5.42954 9.23931 6.12223 8.47371C6.01286 8.20028 5.63006 7.07011 6.2316 5.55714C6.2316 5.55714 7.16126 5.26548 9.25754 6.68731C10.1325 6.45034 11.0804 6.32274 12.0101 6.32274C12.9397 6.32274 13.8876 6.45034 14.7626 6.68731C16.8589 5.26548 17.7885 5.55714 17.7885 5.55714C18.3901 7.07011 18.0073 8.20028 17.8979 8.47371C18.6088 9.23931 19.0281 10.2237 19.0281 11.4267C19.0281 15.6558 16.4578 16.5854 13.997 16.8589C14.398 17.2052 14.7443 17.8614 14.7443 18.9004C14.7443 20.377 14.7261 21.5618 14.7261 21.9264C14.7261 22.218 14.9266 22.5644 15.4735 22.455C19.8483 20.9967 23.0019 16.8771 23.0019 12.0101C23.0201 5.92171 18.0802 1 12.0101 1Z" fill="currentColor"></path>
    <path d="M5.17419 16.8042C5.15596 16.8589 5.06482 16.8771 4.99191 16.8406C4.91899 16.8042 4.86431 16.7313 4.90076 16.6766C4.91899 16.6219 5.01014 16.6037 5.08305 16.6401C5.15596 16.6766 5.19242 16.7495 5.17419 16.8042ZM5.61168 17.2964C5.55699 17.351 5.44762 17.3146 5.39294 17.2417C5.32002 17.1688 5.30179 17.0594 5.35648 17.0047C5.41116 16.95 5.50231 16.9865 5.57522 17.0594C5.64814 17.1505 5.66636 17.2599 5.61168 17.2964ZM6.04916 17.9344C5.97625 17.989 5.86688 17.9344 5.81219 17.8432C5.73928 17.7521 5.73928 17.6245 5.81219 17.588C5.88511 17.5333 5.99448 17.588 6.04916 17.6792C6.12208 17.7703 6.12208 17.8797 6.04916 17.9344ZM6.65071 18.5541C6.59602 18.627 6.46842 18.6088 6.35905 18.5177C6.26791 18.4265 6.23145 18.2989 6.30436 18.2442C6.35905 18.1713 6.48665 18.1896 6.59602 18.2807C6.68716 18.3536 6.70539 18.4812 6.65071 18.5541ZM7.47099 18.9005C7.45276 18.9916 7.32516 19.0281 7.19756 18.9916C7.06996 18.9552 6.99705 18.8458 7.01528 18.7729C7.03351 18.6817 7.16111 18.6453 7.28871 18.6817C7.41631 18.7182 7.48922 18.8093 7.47099 18.9005ZM8.36419 18.9734C8.36419 19.0645 8.25482 19.1374 8.12722 19.1374C7.99962 19.1374 7.89025 19.0645 7.89025 18.9734C7.89025 18.8822 7.99962 18.8093 8.12722 18.8093C8.25482 18.8093 8.36419 18.8822 8.36419 18.9734ZM9.20271 18.8276C9.22093 18.9187 9.12979 19.0098 9.00219 19.0281C8.87459 19.0463 8.76522 18.9916 8.74699 18.9005C8.72876 18.8093 8.81991 18.7182 8.94751 18.7C9.07511 18.6817 9.18448 18.7364 9.20271 18.8276Z" fill="currentColor"></path>
</svg>
            <span>关于本项目</span>
            `
        leftNavUl.appendChild(leftNavChild04);

        contentDiv.appendChild(leftNavUl);

        dialogContent.append(modalBody)
        dialogOverlay.appendChild(dialogContent);
        document.body.appendChild(dialogOverlay);

        contentDiv.appendChild(dialogLeftNavGreenPage())
        dialogTabClickEven()

        // 添加关闭对话框的事件
        document.querySelector('.mOV4ZwvR').onclick = function () {
            document.body.removeChild(dialogOverlay);
        };
    }

    function dialogLeftNavGreenPage() {
        const mainDiv = document.createElement('div');
        mainDiv.className = '_ZFc4ZO0'
        mainDiv.innerHTML = `<div class="vgff11k5">
                        <div class="Jte2zbxO">
                            <span>${Constants.TIPS}</span>     
                            </div>
                    </div>`
        const pageLeftNavName = [
            {
                name: Constants.LEFT_NAV_INDEX.HOME.NAME,
                id: Constants.LEFT_NAV_INDEX.HOME.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.HOME.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.RECOMMEND.NAME,
                id: Constants.LEFT_NAV_INDEX.RECOMMEND.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.RECOMMEND.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.ATTENTION.NAME,
                id: Constants.LEFT_NAV_INDEX.ATTENTION.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.ATTENTION.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.FRIEND.NAME,
                id: Constants.LEFT_NAV_INDEX.FRIEND.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.FRIEND.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.MY.NAME,
                id: Constants.LEFT_NAV_INDEX.MY.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.MY.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.LIVE.NAME,
                id: Constants.LEFT_NAV_INDEX.LIVE.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.LIVE.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.CINEMA.NAME,
                id: Constants.LEFT_NAV_INDEX.CINEMA.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.CINEMA.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.SHORT.NAME,
                id: Constants.LEFT_NAV_INDEX.SHORT.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.SHORT.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.KNOWLEDGE.NAME,
                id: Constants.LEFT_NAV_INDEX.KNOWLEDGE.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.KNOWLEDGE.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.GAME.NAME,
                id: Constants.LEFT_NAV_INDEX.GAME.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.GAME.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.DIMENSION.NAME,
                id: Constants.LEFT_NAV_INDEX.DIMENSION.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.DIMENSION.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.MUSIC.NAME,
                id: Constants.LEFT_NAV_INDEX.MUSIC.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.MUSIC.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.FOOD.NAME,
                id: Constants.LEFT_NAV_INDEX.FOOD.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.FOOD.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_NAV_INDEX.FOOT.NAME,
                id: Constants.LEFT_NAV_INDEX.FOOT.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_NAV_INDEX.FOOT.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_BOTTOM_NAV_INDEX.SETTING.NAME,
                id: Constants.LEFT_BOTTOM_NAV_INDEX.SETTING.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_BOTTOM_NAV_INDEX.SETTING.ID) === Constants.OPEN_VALUE
            },
            {
                name: Constants.LEFT_BOTTOM_NAV_INDEX.COOPERATE.NAME,
                id: Constants.LEFT_BOTTOM_NAV_INDEX.COOPERATE.ID,
                isCheck: commonUtils.getValue(Constants.LEFT_BOTTOM_NAV_INDEX.COOPERATE.ID) === Constants.OPEN_VALUE
            }
        ]
        mainDiv.innerHTML += pageUtils.switchElement(pageLeftNavName)

        bindSwitchEvents(mainDiv, pageLeftNavName)
        return mainDiv
    }

    function dialogTopNavGreenPage() {
        const mainDiv = document.createElement('div');
        mainDiv.className = '_ZFc4ZO0'
        mainDiv.innerHTML = `<div class="vgff11k5">
                        <div class="Jte2zbxO">
                            <p>${Constants.TIPS}</p>
                            </div>
                    </div>`
        const pageTopNavName = [
            {
                name: Constants.TOP_NAV_INDEX.CHARGE.NAME,
                id: Constants.TOP_NAV_INDEX.CHARGE.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.CHARGE.ID) === Constants.OPEN_VALUE
            }, {
                name: Constants.TOP_NAV_INDEX.CLIENT.NAME,
                id: Constants.TOP_NAV_INDEX.CLIENT.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.CLIENT.ID) === Constants.OPEN_VALUE
            }, {
                name: Constants.TOP_NAV_INDEX.QUICK_VISIT.NAME,
                id: Constants.TOP_NAV_INDEX.QUICK_VISIT.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.QUICK_VISIT.ID) === Constants.OPEN_VALUE
            }, {
                name: Constants.TOP_NAV_INDEX.WALLPAPER.NAME,
                id: Constants.TOP_NAV_INDEX.WALLPAPER.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.WALLPAPER.ID) === Constants.OPEN_VALUE
            }, {
                name: Constants.TOP_NAV_INDEX.INFORM.NAME,
                id: Constants.TOP_NAV_INDEX.INFORM.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.INFORM.ID) === Constants.OPEN_VALUE
            }, {
                name: Constants.TOP_NAV_INDEX.CHAT.NAME,
                id: Constants.TOP_NAV_INDEX.CHAT.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.CHAT.NAME) === Constants.OPEN_VALUE
            }, {
                name: Constants.TOP_NAV_INDEX.CONTRIBUTE.NAME,
                id: Constants.TOP_NAV_INDEX.CONTRIBUTE.ID,
                isCheck: commonUtils.getValue(Constants.TOP_NAV_INDEX.CONTRIBUTE.ID) === Constants.OPEN_VALUE
            }
        ];
        mainDiv.innerHTML += pageUtils.switchElement(pageTopNavName)

        // 为每个开关绑定点击事件
        bindSwitchEvents(mainDiv, pageTopNavName)

        return mainDiv
    }

    function dialogOtherNavGreenPage() {
        const mainDiv = document.createElement('div');
        mainDiv.className = '_ZFc4ZO0'
        mainDiv.innerHTML = `<div class="vgff11k5">
                        <div class="Jte2zbxO">
                            <p>${Constants.TIPS}</p>
                            </div>
                    </div>`
        const pageFootNavName = [{
            name: Constants.OTHER_NAV_INDEX.HOME_DEFAULT.NAME,
            id: Constants.OTHER_NAV_INDEX.HOME_DEFAULT.ID,
            isCheck: commonUtils.getValue(Constants.OTHER_NAV_INDEX.HOME_DEFAULT.ID) === Constants.OPEN_VALUE
        }
        ];
        mainDiv.innerHTML += pageUtils.switchElement(pageFootNavName)

        bindSwitchEvents(mainDiv, pageFootNavName)
        return mainDiv
    }

    function dialogEntertainPage() {
        const entertainData = commonUtils.getValue('entertain_data')
        let fansCount, followCount, likeCount = null
        // 校验 entertainData 是否存在
        if (entertainData) {
            fansCount = entertainData.FANS_COUNT.NUMBER
            followCount = entertainData.FOLLOW_COUNT.NUMBER
            likeCount = entertainData.LIKE_COUNT.NUMBER
        }
        const mainDiv = document.createElement('div');
        mainDiv.className = 'eUiTb5nT'
        mainDiv.innerHTML =
            `
            <div class="pitRM1At">个人数据修改</div>
<div class="semi-tabs-pane">
    <span>粉丝数</span>
    <div class="semi-input-wrapper semi-input-wrapper-default"
         style="margin-top: 4px; border-radius: 4px; margin-bottom: 24px; height: 32px;">
        <input id="fans-count" class="semi-input fans-count" type="text" placeholder="粉丝数量" ${fansCount !== undefined && fansCount !== null ? `value="${fansCount}"` : ''}>
    </div>
    <span>关注数</span>
    <div class="semi-input-wrapper semi-input-wrapper-default"
         style="margin-top: 4px; border-radius: 4px; margin-bottom: 24px; height: 32px;">
        <input id="follow-count" class="semi-input follow-count" type="text" placeholder="关注数量" ${followCount !== undefined && followCount !== null ? `value="${followCount}"` : ''}>
    </div>
    <span>获赞数</span>
    <div class="semi-input-wrapper semi-input-wrapper-default"
         style="margin-top: 4px; border-radius: 4px; margin-bottom: 24px; height: 32px;">
        <input id="like-count" class="semi-input like-count" type="text" placeholder="获赞数量" ${likeCount !== undefined && likeCount !== null ? `value="${likeCount}"` : ''}>
    </div>
    <button id="save-entertain-data" class="semi-button semi-button-primary" type="button"><span>保存数据</span></button>
    <button id="clear-local-data" class="semi-button semi-button-secondary" type="button"><span>清空本地数据</span></button>
</div>
            `

        // 添加按钮的点击事件
        const saveButton = mainDiv.querySelector('#save-entertain-data');
        const clearButton = mainDiv.querySelector('#clear-local-data');

        saveButton.addEventListener('click', () => {
            const fansCount = document.getElementById('fans-count').value;
            const followCount = document.getElementById('follow-count').value;
            const likeCount = document.getElementById('like-count').value;

            save_entertain_data(fansCount, followCount, likeCount)
        });

        clearButton.addEventListener('click', () => {
            commonUtils.setValue('entertain_data', null)
            Qmsg.success('数据清除成功，刷新即生效！')
        });
        return mainDiv
    }


    function save_entertain_data(fansCount, followCount, likesCount) {
        // 验证和格式化函数
        const formattedFansCount = commonUtils.validateAndFormatNumber(fansCount, "粉丝数");
        const formattedFollowCount = commonUtils.validateAndFormatNumber(followCount, "关注数");
        const formattedLikesCount = commonUtils.validateAndFormatNumber(likesCount, "获赞数");

        // 如果任意一个输入无效，则退出
        if (formattedFansCount === null || formattedFollowCount === null || formattedLikesCount === null) {
            return
        }

        Constants.ENTERTAIN_DATA.FANS_COUNT.NUMBER = fansCount
        Constants.ENTERTAIN_DATA.FANS_COUNT.TEXT = formattedFansCount
        Constants.ENTERTAIN_DATA.FOLLOW_COUNT.NUMBER = followCount
        Constants.ENTERTAIN_DATA.FOLLOW_COUNT.TEXT = formattedFollowCount
        Constants.ENTERTAIN_DATA.LIKE_COUNT.NUMBER = likesCount
        Constants.ENTERTAIN_DATA.LIKE_COUNT.TEXT = formattedLikesCount

        commonUtils.setValue('entertain_data', Constants.ENTERTAIN_DATA)
        console.log(Constants.ENTERTAIN_DATA)
        Qmsg.success('保存成功，刷新即可生效！')
    }

    function dialogAboutPage() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'eUiTb5nT'
        mainDiv.innerHTML =
            `
            <div class="pitRM1At">贡献者</div>
<div class="vgff11k5">
    <a class="uz1VJwFY qgOuDyWB">
    <span class="semi-avatar semi-avatar-circle semi-avatar-medium semi-avatar-grey syIEauc_ AaEZ65VP avatar-component-avatar-container qGbmyC_T yzIBOVa_"
                                      style="background-color: transparent;"><img
            src="${Constants.OTHER_CONFIG.AVATAR.URL}"
            alt="" class="fiWP27dC"></span>
        <svg width="23" height="23" fill="none" xmlns="http://www.w3.org/2000/svg"
             class="cXvZV6As bn_V7ZwO">
            <circle cx="11.5" cy="11.5" r="10.285" fill="#13C15A" stroke="#F7F7F9"
                    stroke-width="1.571"></circle>
        </svg>
    </a>
    <div class="Jte2zbxO">
        <p class="mpk9KR6x"><a href="https://github.com/BergerLee" target="_blank">BergerLee</a></p>
    </div>
</div>
<div class="pitRM1At" style="margin-top: 2rem">请作者吃鸡腿🍗</div>
<div style="display: flex; justify-content: space-between;">
    <img alt="${Constants.OTHER_CONFIG.ALIPAY.TEXT}" src="${Constants.OTHER_CONFIG.ALIPAY.URL}" style="flex: 1; width: 40%; height: auto;">
    <img alt="${Constants.OTHER_CONFIG.WECHAT_PAY.TEXT}" src="${Constants.OTHER_CONFIG.WECHAT_PAY.URL}" style="flex: 1; width: 40%; height: auto;">
</div>

            `
        return mainDiv
    }


    //对话框tab点击事件
    function dialogTabClickEven() {
        const tabNav = document.querySelectorAll('.VystVx9t');
        const tabItems = document.querySelectorAll('.tab-item');

        // 默认选中第一个 Tab
        tabNav[0].classList.add('active');

        tabNav.forEach(tabBtn => {
            tabBtn.addEventListener('click', function () {
                // 移除所有按钮的 PxXsmnUU 类
                tabNav.forEach(btn => btn.classList.remove('PxXsmnUU'));

                // 添加 active 类到当前按钮
                this.classList.add('PxXsmnUU');

                const contentDiv = document.querySelector('.NrFxEhcf')

                if (contentDiv.children.length > 1) {
                    commonUtils.removeElement(contentDiv.children[1])
                }


                // 更新 tab-content 的内容
                const tabToShow = this.getAttribute('id');
                switch (tabToShow) {
                    case 'left':
                        contentDiv.appendChild(dialogLeftNavGreenPage())
                        break;
                    case 'top':
                        contentDiv.appendChild(dialogTopNavGreenPage())
                        break;
                    case 'other':
                        contentDiv.appendChild(dialogOtherNavGreenPage())
                        break;
                    case 'about':
                        contentDiv.appendChild(dialogAboutPage())
                        break;
                    case 'entertain':
                        contentDiv.appendChild(dialogEntertainPage())
                        break;
                }
            });
        });
    }

    // 通用函数，用于绑定开关点击事件
    function bindSwitchEvents(container, itemList) {
        itemList.forEach(item => {
            const switchElement = container.querySelector(`#${item.id}`);
            if (switchElement) {
                switchElement.addEventListener('click', function () {
                    // 切换开关状态
                    const isChecked = switchElement.classList.toggle('semi-switch-checked');
                    switch (switchElement.id) {
                        case Constants.LEFT_NAV_INDEX.FOOT.ID:
                            ConcisePageUtils.removeFoot(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.CHARGE.ID:
                            ConcisePageUtils.removeCharge(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.CLIENT.ID:
                            ConcisePageUtils.removeClient(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.QUICK_VISIT.ID:
                            ConcisePageUtils.removeQuickVisit(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.WALLPAPER.ID:
                            ConcisePageUtils.removeWallPaper(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.INFORM.ID:
                            ConcisePageUtils.removeInform(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.CHAT.ID:
                            ConcisePageUtils.removeChat(isChecked)
                            break
                        case Constants.TOP_NAV_INDEX.CONTRIBUTE.ID:
                            ConcisePageUtils.removeContribute(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.LIVE.ID:
                            ConcisePageUtils.removeLive(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.CINEMA.ID:
                            ConcisePageUtils.removeCinema(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.SHORT.ID:
                            ConcisePageUtils.removeShort(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.KNOWLEDGE.ID:
                            ConcisePageUtils.removeKnowledge(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.GAME.ID:
                            ConcisePageUtils.removeGame(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.DIMENSION.ID:
                            ConcisePageUtils.removeDimension(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.MUSIC.ID:
                            ConcisePageUtils.removeMusic(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.FOOD.ID:
                            ConcisePageUtils.removeFood(isChecked)
                            break
                        case Constants.OTHER_NAV_INDEX.HOME_DEFAULT.ID:
                            ConcisePageUtils.removeHomeDefault(isChecked)
                            break
                        case Constants.LEFT_BOTTOM_NAV_INDEX.SETTING.ID:
                            ConcisePageUtils.removeSetting(isChecked)
                            break
                        case Constants.LEFT_BOTTOM_NAV_INDEX.COOPERATE.ID:
                            ConcisePageUtils.removeCooperate(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.HOME.ID:
                            ConcisePageUtils.removeHome(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.RECOMMEND.ID:
                            ConcisePageUtils.removeRecommend(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.ATTENTION.ID:
                            ConcisePageUtils.removeAttention(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.FRIEND.ID:
                            ConcisePageUtils.removeFriend(isChecked)
                            break
                        case Constants.LEFT_NAV_INDEX.MY.ID:
                            ConcisePageUtils.removeMy(isChecked)
                            break
                    }
                });
            }
        });
    }

    class ConcisePageUtils {
        static removeElementByCondition(selector, isChecked, constantValue) {
            const value = isChecked === true ? Constants.OPEN_VALUE : Constants.CLOSE_VALUE;

            if (isChecked === false) {
                return commonUtils.setValue(constantValue, Constants.CLOSE_VALUE);
            }

            if (value === Constants.OPEN_VALUE || commonUtils.getValue(constantValue) === Constants.OPEN_VALUE) {
                commonUtils.checkElement(selector, function (element) {
                    commonUtils.removeElement(element);
                    commonUtils.setValue(constantValue, Constants.OPEN_VALUE);
                })
            }
        }

        static removeElementByText(isChecked, constantJson, parentClassName) {
            const value = isChecked === true ? Constants.OPEN_VALUE : Constants.CLOSE_VALUE;
            if (isChecked === false) {
                utils.addStyle(
                    `${parentClassName}{display: block !important;}`
                );
                return commonUtils.setValue(constantJson.ID, Constants.CLOSE_VALUE);
            }
            if (value === Constants.OPEN_VALUE || commonUtils.getValue(constantJson.ID) === Constants.OPEN_VALUE) {
                commonUtils.setValue(constantJson.ID, Constants.OPEN_VALUE)
                utils.addStyle(
                    `${parentClassName}{display: none !important;}`
                );
            }
        }

        // 去除页脚元素
        static removeFoot(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.FOOT.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.FOOT, `div.wlJhKwNH`)

        }

        // 顶部充值
        static removeCharge(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.CHARGE.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.CHARGE, `div.eJhYZuIF > div:nth-of-type(1)`)
        }

        // 顶部客户端
        static removeClient(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.CLIENT.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.CLIENT, `div.eJhYZuIF > div:nth-of-type(2)`)
        }

        // 顶部快捷访问
        static removeQuickVisit(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.QUICK_VISIT.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.QUICK_VISIT, `div.eJhYZuIF > div:nth-of-type(3)`)
        }

        // 顶部壁纸
        static removeWallPaper(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.WALLPAPER.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.WALLPAPER, `div.eJhYZuIF > div:nth-of-type(4)`)
        }

        // 顶部通知
        static removeInform(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.INFORM.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.INFORM, `div.eJhYZuIF > ul:nth-of-type(1)`)
        }

        // 顶部私信
        static removeChat(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.CHAT.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.CHAT, `div.eJhYZuIF > ul:nth-of-type(2)`)
        }

        // 顶部投稿
        static removeContribute(isChecked = commonUtils.getValue(Constants.TOP_NAV_INDEX.CONTRIBUTE.ID)) {
            this.removeElementByText(isChecked, Constants.TOP_NAV_INDEX.CONTRIBUTE, `div.eJhYZuIF > div:nth-of-type(5)`)
        }

        // 左侧首页
        static removeHome(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.HOME.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.HOME, `div.q06xF672 > div:nth-of-type(1)`)
        }

        // 左侧推荐
        static removeRecommend(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.RECOMMEND.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.RECOMMEND, `div.q06xF672 > div:nth-of-type(2)`)
        }

        // 左侧关注
        static removeAttention(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.ATTENTION.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.ATTENTION, `div.q06xF672 > div:nth-of-type(3)`)
        }

        // 左侧朋友
        static removeFriend(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.FRIEND.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.FRIEND, `div.q06xF672 > div:nth-of-type(4)`)
        }

        // 左侧我的
        static removeMy(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.MY.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.MY, `div.q06xF672 > div:nth-of-type(5)`)
        }


        // 左侧直播
        static removeLive(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.LIVE.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.LIVE, `div.q06xF672 > div:nth-of-type(7)`)
        }

        // 左侧放映厅
        static removeCinema(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.CINEMA.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.CINEMA, `div.q06xF672 > div:nth-of-type(8)`)
        }

        // 左侧短剧
        static removeShort(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.SHORT.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.SHORT, `div.q06xF672 > div:nth-of-type(9)`)
        }

        // 左侧知识
        static removeKnowledge(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.KNOWLEDGE.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.KNOWLEDGE, `div.q06xF672 > div:nth-of-type(10)`)
        }

        // 左侧游戏
        static removeGame(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.GAME.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.GAME, `div.q06xF672 > div:nth-of-type(11)`)
        }

        // 左侧二次元
        static removeDimension(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.DIMENSION.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.DIMENSION, `div.q06xF672 > div:nth-of-type(12)`)
        }

        // 左侧音乐
        static removeMusic(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.MUSIC.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.MUSIC, `div.q06xF672 > div:nth-of-type(13)`)
        }

        // 左侧音乐
        static removeFood(isChecked = commonUtils.getValue(Constants.LEFT_NAV_INDEX.FOOD.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_NAV_INDEX.FOOD, `div.q06xF672 > div:nth-of-type(14)`)
        }

        // 左侧设置
        static removeSetting(isChecked = commonUtils.getValue(Constants.LEFT_BOTTOM_NAV_INDEX.SETTING.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_BOTTOM_NAV_INDEX.SETTING, `div.cBtmhsJF > div:nth-of-type(1)`)
        }

        // 左侧业务合作
        static removeCooperate(isChecked = commonUtils.getValue(Constants.LEFT_BOTTOM_NAV_INDEX.COOPERATE.ID)) {
            this.removeElementByText(isChecked, Constants.LEFT_BOTTOM_NAV_INDEX.COOPERATE, `div.cBtmhsJF > div:nth-of-type(2)`)
        }

        // 个人主页精简
        static removeHomeDefault(isChecked = commonUtils.getValue(Constants.OTHER_NAV_INDEX.HOME_DEFAULT.ID)) {
            this.removeElementByText(isChecked, Constants.OTHER_NAV_INDEX.HOME_DEFAULT, `div.m6gzwj_4`)
            this.removeElementByText(isChecked, Constants.OTHER_NAV_INDEX.HOME_DEFAULT, `footer.user-page-footer`)
        }

        static editPersonDataCount() {
            const entertainData = commonUtils.getValue('entertain_data')
            let fansCountText, followCountText, likeCountText = null
            // 校验 entertainData 是否存在
            if (entertainData) {
                fansCountText = entertainData.FANS_COUNT.TEXT
                followCountText = entertainData.FOLLOW_COUNT.TEXT
                likeCountText = entertainData.LIKE_COUNT.TEXT
            }

            if (fansCountText === null || followCountText === null || likeCountText === null) {
                return
            }

            if (window.location.href.includes('/user/self')) {

                utils.waitNode("div.cuA7Ana_").then((element => {

                    console.log(element);
                    console.log(element.children)

                    const checkDataLoaded = setInterval(() => {
                        const originalFollowCountText = element.children[0].children[1].textContent
                        const originalFansCountText = element.children[1].children[1].textContent
                        const originalLikeCountText = element.children[2].children[1].textContent

                        if (originalFansCountText !== '' && originalFollowCountText !== '' && originalLikeCountText !== '') {
                            // 数据加载完成，更新内容
                            element.children[0].children[1].textContent = followCountText
                            element.children[1].children[1].textContent = fansCountText
                            element.children[2].children[1].textContent = likeCountText
                            clearInterval(checkDataLoaded); // 停止检查
                        }

                    }, 500); // 每秒检查一次
                }))
            }


        }
    }

    class Constants {
        // 左侧栏
        static LEFT_NAV_INDEX = {
            FOOT: {
                NAME: "底部页脚",
                ID: 'foot'
            },
            HOME: {
                NAME: "首页",
                ID: "home"
            },
            RECOMMEND: {
                NAME: "推荐",
                ID: "recommend"
            },
            ATTENTION: {
                NAME: "关注",
                ID: "attention"
            },
            FRIEND: {
                NAME: "朋友",
                ID: "friend",
            },
            MY: {
                NAME: "我的",
                ID: "my"
            },
            LIVE: {
                NAME: "直播",
                ID: "live",
            },
            CINEMA: {
                NAME: "放映厅",
                ID: "cinema"
            },
            SHORT: {
                NAME: "短剧",
                ID: "short"
            },
            KNOWLEDGE: {
                NAME: "知识",
                ID: "knowledge"
            },
            GAME: {
                NAME: "游戏",
                ID: "game"
            },
            DIMENSION: {
                NAME: "二次元",
                ID: "dimension",
            },
            MUSIC: {
                NAME: "音乐",
                ID: "music"
            },
            FOOD: {
                NAME: "美食",
                ID: "food"
            }
        }

        // 左侧栏底部
        static LEFT_BOTTOM_NAV_INDEX = {
            SETTING: {
                NAME: "设置",
                ID: "setting"
            },
            COOPERATE: {
                NAME: "业务合作",
                ID: "cooperate"
            }
        }

        // 顶部
        static TOP_NAV_INDEX = {
            CHARGE: {
                NAME: "充钻石",
                ID: "charge"
            },
            CLIENT: {
                NAME: "客户端",
                ID: "client"
            },
            QUICK_VISIT: {
                NAME: "快捷访问",
                ID: "quickVisit"
            },
            WALLPAPER: {
                NAME: "壁纸",
                ID: "wallPaper"
            },
            INFORM: {
                NAME: "通知",
                ID: "inform",
            },
            CHAT: {
                NAME: "私信",
                ID: "chat",
            },
            CONTRIBUTE: {
                NAME: "投稿",
                ID: "contribute"
            }
        }

        // 其他
        static OTHER_NAV_INDEX = {
            HOME_DEFAULT: {
                NAME: "精简个人主页",
                ID: "home_default"
            }
        }

        static OPEN_VALUE = 1
        static CLOSE_VALUE = 0

        static TIPS = `在使用中遇到BUG请在<a style="color: #FE2C55" href="https://greasyfork.org/zh-CN/scripts/512771-%E6%8A%96%E9%9F%B3%E7%BB%BF%E5%8C%96%E6%8F%92%E4%BB%B6/feedback" target="_blank">GreasyFork仓库</a>中反馈`
        static DIALOG_TITLE = '抖音网页绿化插件'
        static VERSION = 'v1.0'

        static ENTERTAIN_DATA = {
            FANS_COUNT: {
                NUMBER: '',
                TEXT: ''
            },
            FOLLOW_COUNT: {
                NUMBER: '',
                TEXT: ''
            },
            LIKE_COUNT: {
                NUMBER: '',
                TEXT: ''
            }
        }

        static OTHER_CONFIG = {
            ALIPAY: {
                TEXT: '支付宝',
                URL: 'https://img.picui.cn/free/2024/10/15/670e65fc5934d.jpg'
            },
            WECHAT_PAY: {
                TEXT: '微信',
                URL: 'https://img.picui.cn/free/2024/10/15/670e65fc46dfe.jpg'
            },
            AVATAR: {
                URL: 'https://img.picui.cn/free/2024/10/15/670e65e51007a.png'
            }
        }
    }

    function initPage() {
        ConcisePageUtils.removeFoot()
        ConcisePageUtils.removeCharge()
        ConcisePageUtils.removeClient()
        ConcisePageUtils.removeQuickVisit()
        ConcisePageUtils.removeWallPaper()
        ConcisePageUtils.removeInform()
        ConcisePageUtils.removeChat()
        ConcisePageUtils.removeContribute()


        ConcisePageUtils.removeHome()
        ConcisePageUtils.removeRecommend()
        ConcisePageUtils.removeAttention()
        ConcisePageUtils.removeFriend()
        ConcisePageUtils.removeMy()
        ConcisePageUtils.removeLive()
        ConcisePageUtils.removeCinema()
        ConcisePageUtils.removeShort()
        ConcisePageUtils.removeKnowledge()
        ConcisePageUtils.removeGame()
        ConcisePageUtils.removeDimension()
        ConcisePageUtils.removeMusic()
        ConcisePageUtils.removeFood()
        ConcisePageUtils.removeSetting()
        ConcisePageUtils.removeCooperate()


        ConcisePageUtils.removeHomeDefault()

        ConcisePageUtils.editPersonDataCount()


    }

    function registerMenuCommand() {
        GM_registerMenuCommand('⚙️ 打开配置面板', () => {
            showDialog()
        });
    }

    window.addEventListener('DOMContentLoaded', function () {
        // startChecking()
        initPage();
        setTimeout(() => {
            createSysButton()
        }, 1500);
        registerMenuCommand()
    })
})(Qmsg, Utils);

