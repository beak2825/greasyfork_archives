// ==UserScript==
// @name        pass平台镜像过滤
// @namespace   Violentmonkey Scripts
// @match       http*://*paas.myhexin.com/*
// @grant       none
// @version     1.2
// @author      -
// @description 2023/11/20 15:02:22
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481452/pass%E5%B9%B3%E5%8F%B0%E9%95%9C%E5%83%8F%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/481452/pass%E5%B9%B3%E5%8F%B0%E9%95%9C%E5%83%8F%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

const innerRender = () => {

    function mountedCb(wrapper) {

        let comboxDom = null;

        // 没有勾选筛选条件时  是否 将镜像 恢复至初始状态
        let reset = false;

        document.onkeydown = function (e) {
            var keyCode = e.keyCode || e.which || e.charCode;
            var ctrlKey = e.ctrlKey || e.metaKey;
            // ctrl + b
            if (ctrlKey && keyCode == 66) {
                clickHandle();
            }
        }

        // 缓存 checkbox
        try {
          const ffOption1 = document.querySelector('#ff-option1');
          ffOption1.onchange  = function(){
            localStorage.setItem('ff-option1', !!ffOption1.checked);
          }
          const ffOption2 = document.querySelector('#ff-option2');

          ffOption2.onchange  = function(){
            localStorage.setItem('ff-option2', !!ffOption2.checked);
          }
          ffOption1.checked = String(localStorage.getItem('ff-option1')) === 'true';
          ffOption2.checked = String(localStorage.getItem('ff-option2')) === 'true';
        } catch (error) {

        }

        // 浮窗 确定 事件
        const queryBtn = document.querySelector('.ff-footer');
        queryBtn.addEventListener('click', function () {
            observer.disconnect();
            const select = getCheckVal();
            // setDomHide(select);
            setComBoxClick();
            // setOb(select);
        })
        // 是否不是快捷键
        function clickHandle(e) {
            observer.disconnect();
            setTimeout(() => {
                const select = getCheckVal();
                setDomHide(select, !e);
                setTimeout(() => {
                    setOb(select);

                }, 500)
            }, 500)
        }

        // 获取 ant-select-dropdown 没有这个class ant-select-dropdown-hidden 就是 当前展开的
        // 镜像的combox组件 点击 事件
        function setComBoxClick() {
            if (comboxDom) {
                comboxDom.removeEventListener('click', clickHandle);
            }
            if (window.location.href.includes('editReleaseComponent')) {
                comboxDom = document.querySelectorAll('.ant-space-horizontal')[3];
                comboxDom.addEventListener('click', clickHandle)
            }
            // if(window.location.href.includes('newEditRelease')) {
            //   comboxDom = document.querySelectorAll('.ant-form-horizontal .ant-space-item')[4];
            //   comboxDom.addEventListener('click', clickHandle)
            // }

        }

        // 获取 checkbox 的value
        function getCheckVal() {
            const domList = document.querySelectorAll('.ff-checkbox input[name="options"]:checked');
            return [...domList].map(u => u.value);
        }

        // flag -> 是否是快捷键
        function setDomHide(list, flag) {
            // 如果是0 就得初始化
            if (reset && !Array.isArray(list)) {
                return
            }
            // 编辑的地方进行 选择 镜像
            if (window.location.href.includes('editReleaseComponent')) {
                const id = document.querySelectorAll('.ant-space-horizontal')[3].querySelector('input').getAttribute('aria-owns');
                formateEdit(list, id);
                return;
            }
            // 应用编排 发布 然后部署
            // if(window.location.href.includes('newEditRelease')) {
            //   const id = document.querySelectorAll('.ant-form-horizontal .ant-space-item')[4].querySelector('input').getAttribute('aria-owns');
            //   formateEdit(list, id);
            //   return;
            // }
            if (!flag) {
                return;
            }
            // 获取已经实例化的所有drop
            let dropList = document.querySelectorAll('.ant-select-dropdown');
            let dom = [...dropList].find(u => !u.className.includes('ant-select-dropdown-hidden'));
            if (!dom) {
                return;
            }
            let childDom = dom.querySelector('.rc-virtual-list');
            formateSelect(list, childDom, dom);
        }

        // 找到 此时 展开的 下拉框
        function findOpenDrag() {
            let dropList = document.querySelectorAll('.ant-select-dropdown');
            let dom = [...dropList].find(u => !u.className.includes('ant-select-dropdown-hidden'));
            return dom;
        }

        // 设置元素监听
        const config = { attributes: false, childList: true, subtree: true };
        const observer = new MutationObserver((a, b) => {
            observer.disconnect();
            let id = '';
            if (window.location.href.includes('editReleaseComponent')) {
                id = document.querySelectorAll('.ant-space-horizontal')[3].querySelector('input').getAttribute('aria-owns');
            }
            // else if (window.location.href.includes('newEditRelease')) {
                // id = document.querySelectorAll('.ant-form-horizontal .ant-space-item')[4].querySelector('input').getAttribute('aria-owns');
            // }
            let dom = null;
            if (id) {
                const domPre = document.querySelector(`#${id}`);
                dom = domPre.nextSibling;
            } else {
                dom = findOpenDrag();
                if (!dom) {
                    return
                }
            }
            try {
                const divDom = dom.querySelector('.rc-virtual-list-holder').children[0];
                divDom.style.height = '480px';
                divDom.children[0].style.top = '0px';
                const list = dom.querySelectorAll('.ant-select-item');
                [...list].forEach(u => {
                    const txt = u.getAttribute('title');
                    u.style.display = '';
                    u.querySelector('.ant-select-item-option-content').innerText = txt;
                })
            } catch (error) {

            }
        });

        function setOb(select) {
            if (reset && !select.length) {
                return;
            }
            let id = '';
            if (window.location.href.includes('editReleaseComponent')) {
                id = document.querySelectorAll('.ant-space-horizontal')[3].querySelector('input').getAttribute('aria-owns');
            }
            // else if (window.location.href.includes('newEditRelease')) {
                // id = document.querySelectorAll('.ant-form-horizontal .ant-space-item')[4].querySelector('input').getAttribute('aria-owns');
            // }
            let targetNode = null;
            if (id) {
                const domPre = document.querySelector(`#${id}`);
                targetNode = domPre.nextSibling.querySelector('.rc-virtual-list-holder-inner');
            } else {
                let dom = findOpenDrag();
                if (!dom) {
                    return
                }
                targetNode = dom.querySelector('.rc-virtual-list-holder-inner');
            }
            observer.observe(targetNode, config);
        }

        function getNumByStr(str) {
            return str.replace(/[^0-9]/g, "");
        }

        // 编辑的地方进行 选择 镜像
        function formateEdit(arr, id) {
            const domPre = document.querySelector(`#${id}`);
            if (!domPre) {
                alert('请先点击镜像')
                return console.error('没找到下拉框元素');
            }
            const dom = domPre.nextSibling;
            const parentDom = domPre.parentElement.parentElement;
            formateSelect(arr, dom, parentDom);
        }

        function formateSelect(arr, dom, parentDom) {
            const user = getUser();
            const query = [];
            if (arr.includes('当天')) {
                query.push(getTime())
            }
            if (arr.includes('自己') && getUser()) {
                query.push(getUser())
            }
            const list = dom.querySelectorAll('.ant-select-item');
            if (!query.length) {
                if (reset) {
                  restore();
                } else {
                  parentDom.style.width = '400px';
                  filterAll([...list]);
                }
                return
            }
            try {
                const divDom = dom.querySelector('.rc-virtual-list-holder').children[0];
                // divDom.style.height = '256px';
                // divDom.children[0].style.transform = 'translateY(0px)';
                let top = getNumByStr(divDom.children[0].style.transform);
                if (top > 0) {
                    // divDom.children[0].style.top = (0 - top) + 'px';
                    divDom.children[0].style.top = 32 + 'px';
                }
            } catch (error) {

            }

            parentDom.style.width = '400px';
            // let hadSet = false;
            // let isAddY = false;
            // list = dom.querySelectorAll('.ant-select-item');
            [...list].forEach((u, index) => {
                // 当前已选择的不处理
                // if (u.getAttribute('aria-selected') === 'true') {
                //     u.style.display = '';
                //     return
                // }
                // if (u.style.display === 'none') {
                //     hadSet = true;
                // }
                const txt = u.getAttribute('title');
                if (query.every(i => txt.includes(i))) {
                    u.style.display = '';
                    u.querySelector('.ant-select-item-option-content').innerHTML = getItemInfo(txt);
                } else {
                    u.style.display = 'none';
                    u.querySelector('.ant-select-item-option-content').innerHTML = txt;
                }
            })
        }

      // 恢复至未格式化状态
      function restore() {
        parentDom.style.width = '300px';
        [...list].forEach(u => {
           const txt = u.getAttribute('title');
           u.style.display = '';
           u.querySelector('.ant-select-item-option-content').innerText = txt;
        })
        try {
          const divDom = dom.querySelector('.rc-virtual-list-holder').children[0];
          // divDom.style.height = '480px';
          divDom.children[0].style.top = '0px';
        } catch (error) {

        }
      }

        // 没有选择任何条件 格式化所有数据
        function filterAll(list) {
          for(let i=0;i<list.length;i++) {
            const u = list[i];
            const txt = u.getAttribute('title'); // 例子：'1.0.0.204-20240105141402.xiaoming.ad6357c5.204.feat-v1';
            const regexPattern = /-(\d{8}\d{6}\.)/; // 匹配形如 -YYYYMMDDHHmmss. 的格式
            const matchResult = txt.match(regexPattern);
            // 没有 就默认此时的下拉框不是选择镜像的下拉框
            if (!matchResult) {
              break;
            }
            // const str = matchResult[0]; // 例如：'-20240105141402.'
            // const arr = txt.split(str);
            // if (!arr[1]) {
            //   continue;
            // }
            // const infoTxt = arr[1]; // 例如：'xiaoming.ad6357c5.204.feat-v1';
            u.style.display = '';
            u.querySelector('.ant-select-item-option-content').innerHTML = getItemInfo(txt);
          }
        }

        function formateUpload() {

        }

        function getItemInfo(str) {
            if (!str) {
                return str;
            }
            const arr = str.split('-')[1].split('.');
            return `<span style="color: red;">${formateTime(arr[0])}</span>；<span style="color: green;">${arr[1]}</span>;<span style="color: blue;"> ${getGitNum(str, arr[1])}</span>`;
        }

        // 获取 构建代码 分支
        function getGitNum(str, name) {
          try {
            const useTxt = str.split(`${name}.`)[1];
            let arr = useTxt.split('.');
            return arr.slice(2).join('.');
          } catch (error) {
            const list = str.split('.');
            return list[list.length - 1];
          }
        }

        // 格式化时间
        function formateTime(str) {
            return `${str.substring(0, 4)}/${str.substring(4, 6)}/${str.substring(6, 8)} ${str.substring(8, 10)}：${str.substring(10, 12)}：${str.substring(12, 14)}`
        }

        // 获取当天
        function getTime() {
            const dDate = new Date();
            const y = dDate.getFullYear();
            const m = calcTime(dDate.getMonth() + 1);
            const d = calcTime(dDate.getDate())
            return `${y}${m}${d}`;
        }

        function calcTime(date) {
            if (date <= 9) {
                return `0${date}`
            }
            return date + '';
        }

        // 获取当前用户
        function getUser() {
            try {
                return document.querySelector('.anticon-user').nextSibling.innerText;
            } catch (error) {
                return '';
            }
        }


    }
    return {
        innerHtml: `
        <div style="
          display: flex;
          justify-content: space-between;
          padding: 0 5px;
        ">
            <span title="同时按住Ctrl+b即可对当前下拉框展示的镜像进行处理;如果没有需要的，滚动再重新操作即可">操作
              <span style="font-size: 11px;">💡</span>
            </span>
           <span>Ctrl+b</span>
        </div>
        <div class="ff-checkbox-container">
          <div class="ff-checkbox">
            <input type="checkbox" id="ff-option1" name="options" value="当天">
            <label style="margin-left: 5px;" for="option1">当天</label>
          </div>
          <div class="ff-checkbox">
            <input type="checkbox" id="ff-option2" name="options" value="自己">
            <label style="margin-left: 5px;" for="option2">自己</label>
          </div>
        </div>
        <div class="ff-footer">确定</div>

        <style>
            .ff-checkbox {
                text-align: left;
                display: flex;
            }

            .ff-footer {
                cursor: pointer;
                background: #0097f4;
                color: #fff;
                display: none;
            }

            .ff-checkbox-container {
              padding: 0 5px 5px;
              display: flex;
              justify-content: space-between;
            }
        </style>
        `,
        mountedCb,
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
    const { innerHtml, mountedCb } = innerRender();
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
                /* min-width: 80px; */
                min-width: 116px;
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