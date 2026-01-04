// ==UserScript==
// @license MIT
// @name        复制任务为表格形式 - qq.com
// @namespace   Violentmonkey Scripts
// @match       https://codesign.qq.com/*
// @grant       none
// @version     1.2.11
// @author      -
// @description 2023/10/25 15:15:01
// @downloadURL https://update.greasyfork.org/scripts/478214/%E5%A4%8D%E5%88%B6%E4%BB%BB%E5%8A%A1%E4%B8%BA%E8%A1%A8%E6%A0%BC%E5%BD%A2%E5%BC%8F%20-%20qqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/478214/%E5%A4%8D%E5%88%B6%E4%BB%BB%E5%8A%A1%E4%B8%BA%E8%A1%A8%E6%A0%BC%E5%BD%A2%E5%BC%8F%20-%20qqcom.meta.js
// ==/UserScript==

const innerRender = () => {
    
    function copyToTable() {
        if (!document.querySelector('.board-screen-list__section')) {
            return alert('当前页面不适用该脚本');
        }
        var assignee = prompt('请输入默认指派人', '翟')
        if (assignee) {
            var estimateText = `ui: 0h, 联调: 0h(0个Api)`
            var taskNames = Array.from(document.querySelectorAll('.board-screen-list__section')).map(it => {
                const groupName = it.querySelector('.board-screen-list__section-name').innerText;
                var res = Array.from(it.querySelectorAll('.board-screen-list__item-container>div')).map(it => ` \t${it.innerText}\t${assignee}\t0\t${estimateText}`);
                res[0] = groupName + res[0];
                return res;
            }).flat().join('\n');

            // console.log('taskNames: ', taskNames);
            navigator.clipboard.writeText(taskNames)
                .then(() => { alert('复制成功！'); })
                .catch(err => {
                    alert('复制失败！');
                })
            /*
            var tx = document.createElement('textarea');
            tx.style = "max-height:0;"
            tx.value = taskNames;
            setTimeout(() => {
                document.body.append(tx)
                tx.select();
                document.execCommand('copy');
                alert('复制成功');
                setTimeout(() => tx.remove(), 800)
            })
            */
        }
    }
    const opts = [{ onClick: copyToTable, text: '复制成表格' }];
    return {
        innerHtml: opts.map(({ text }, idx) => `<div class="ff-action" data-index="${idx}">${text}</div>`).join(' '),
        mountedCb: (wrapper) => {
            // const wrapper = div.querySelector('.ff-wrapper');
            wrapper.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                opts[index]?.onClick();
            });
        },
    };
}
createFloatMenu(innerRender);

function getPreConfig() {
    const pos = JSON.parse(localStorage.getItem('__ffPosition') || '{}')
    return pos[location.pathname] || { "top": "10px", "left": "10px", "collapsed": false };
}

function persistConfig(newConfig) {
    let posMap = JSON.parse(localStorage.getItem('__ffPosition') || '{}')
    posMap[location.pathname] = Object.assign(getPreConfig(), newConfig);
    posStr = JSON.stringify(posMap)
    localStorage.setItem('__ffPosition', posStr)
}

function debounce(fn, delay) {
    // 1.定义一个定时器, 保存上一次的定时器
    let timer = null

    // 2.真正执行的函数
    const _debounce = function (...args) {
        // 取消上一次的定时器
        if (timer) clearTimeout(timer)
        // 延迟执行
        timer = setTimeout(() => {
            // 外部传入的真正要执行的函数
            fn(...args)
        }, delay)
    }

    return _debounce
}
const debouncePersistConfig = debounce(persistConfig, 300);

function createFloatMenu(innerRender) {
    const id = 'ff-' + Math.floor(Math.random() * 10);
    var div = document.createElement('div');
    div.id = id;
    div.classList.add('ff-container');
    const {innerHtml, mountedCb} = innerRender();
    const { top, left, collapsed } = getPreConfig();
    div.innerHTML = `
        <style>
            .ff-container {
            position: absolute;
            z-index: 1999;
            left: ${left};
            top: ${top};
            background-color: #f1f1f1;
            text-align: center;
            border-radius: 2px;
            font-size: 14px;
            overflow: hidden;
            box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
            }

            .ff-header {
            padding: 0 5px;
            cursor: move;
            z-index: 2999;
            background-color: #2196F3;
            display: flex;
            align-items: center;
            justify-content: center;
            justify-content: space-between;
            color: #fff;
            min-width: 80px;
            }

            .ff-action {
                padding:4px 6px;
                background:white;
                cursor:pointer;
            }

            .ff-hidden {
                display: none;
            }
            .ff-toggle {
            font-weight: bold;
            cursor: pointer;
            }
        </style>
        <div id="${id}header" class="ff-header">
        <span class="ff-toggle">${collapsed ? '+' : '-'}</span>
        <span>: :</span>
        </div>
        <div class='ff-wrapper ${collapsed ? 'ff-hidden' : ''}'>
            ${innerHtml}
        </div>
    `;

    document.body.appendChild(div);
    const wrapper = div.querySelector('.ff-wrapper');
    const toggleHandler = div.querySelector('.ff-toggle');
    mountedCb(wrapper);
    toggleHandler.addEventListener('click', (event) => {
        const preCollapsed = wrapper.classList.contains('ff-hidden');
        if (preCollapsed) {
            toggleHandler.innerText = '-';
            wrapper.classList.remove('ff-hidden');
        } else {
            toggleHandler.innerText = '+';
            wrapper.classList.add('ff-hidden');
        }
        debouncePersistConfig({ collapsed: !preCollapsed })
    });
    dragElement(div);

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            const top = (elmnt.offsetTop - pos2) + "px";
            const left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.top = top;
            elmnt.style.left = left;
            debouncePersistConfig({ top, left })
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}






