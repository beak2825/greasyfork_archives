// ==UserScript==
// @name         优化CoCo
// @namespace    https://shequ.codemao.cn/user/6384716
// @version      1.1.5
// @description  优化CoCo！可自动保存、一键静默发布...
// @author       XJ王大哥(QQ2357942846)
// @match        *://coco.codemao.cn/*
// @icon         https://static.codemao.cn/coco/player/unstable/rJenQZM03.image/png?hash=FvJjSLkZJwhh6XMquWvTB6MqxL
// @require      https://fastly.jsdelivr.net/npm/lil-gui@0.19

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473811/%E4%BC%98%E5%8C%96CoCo.user.js
// @updateURL https://update.greasyfork.org/scripts/473811/%E4%BC%98%E5%8C%96CoCo.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const gui = new lil.GUI({ title: '优化CoCo' });
    gui.onChange(() => GM_setValue('obj', gui.save()));

    const obj = {
        自动保存: 0,
        自定义标题: '',
        H5发布() {
            document.querySelectorAll('.style_shareBtn__2X5i-')[1].click();
            $('#_cocoDialogContainer').css('display', 'none');
            setTimeout(() => {
                document
                    .querySelector(
                        '#_cocoDialogContainer > div:nth-child(4) > div.coco-dialog-scroll > div > div.coco-dialog-content > div.style_qrWrapper__1uWkX > div.style_shareLinkWrapper__1rQdk > div.style_copyBtn__Iz1FI'
                    )
                    .click();
                $('#_cocoDialogContainer').css('display', '');
                this.所有弹窗快速点叉();
            }, 3000);
        },
        导入控件() {
            document
                .querySelector(
                    '#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div.coco-dropdown.Header_fileDropdown__3MYW_ > div > div.coco-popover-content.coco-dropdown-overlay.hide > div > div > div:nth-child(6) > div'
                )
                .click();
            document
                .querySelector(
                    '#previewAreaWrapper > section > aside > div > div.WidgetList_tabNav__aT0g3 > div:nth-child(2)'
                )
                .click();

            const 滑动 = document.querySelector(
                '#previewAreaWrapper > section > aside > div > div.WidgetList_tabContent__3Ov_Z > div:nth-child(2) > div.WidgetList_scrollExtension__1rWzd'
            );
            滑动.scrollTop = 滑动.scrollHeight;
            setTimeout(() => {
                滑动.scrollTop = 滑动.scrollHeight;
            }, 5000);
        },
        所有弹窗点叉() {
            document.querySelectorAll('.coco-dialog-close').forEach(v => v.click());
        },
    };
    gui.add(obj, '自动保存', { 关: 0, 快速: 10, 中速: 60, 慢速: 300 }).onChange(() => {
        const saveButton = document.querySelector(
            '#root > div > header > div > div.Header_right__3m7KF > button:nth-child(4)'
        );
        const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
        async function save() {
            while (true) {
                const time = GM_getValue('obj').controllers.自动保存 * 1000;
                if (!time) return;
                await sleep(time);
                saveButton.click();
            }
        }
        save();
    });
    gui.add(obj, '自定义标题').onChange(e => {
        if (!e) return;
        document.title = e;
    });
    gui.add(obj, 'H5发布');
    gui.add(obj, '导入控件');
    gui.add(obj, '所有弹窗点叉');

    gui.load(GM_getValue('obj'));

    GM_addStyle(`
    .lil-gui {
        --title-background-color:rgb(148, 41, 255);
    }
    `);
    // dragElement(gui.domElement);

    function dragElement(elmnt) {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        if (document.getElementById(elmnt.id + 'header')) {
            // 如果存在，标题是您从中移动 DIV 的位置:
            document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
        } else {
            // 否则，从 DIV 内的任何位置移动 DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 在启动时获取鼠标光标位置:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 每当光标移动时调用一个函数:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置:
            elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
            elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
        }

        function closeDragElement() {
            // 释放鼠标按钮时停止移动:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();
