// ==UserScript==
// @name         Check-icon-name
// @namespace    ngsocCheckIconName
// @version      0.1.3
// @description  检查icon的名称是否规范
// @match        https://www.iconfont.cn/icons/upload*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415649/Check-icon-name.user.js
// @updateURL https://update.greasyfork.org/scripts/415649/Check-icon-name.meta.js
// ==/UserScript==

(function() {

    let wrap,mask;
    let projectIDList = {
        2187350: {
            name: 'test',
            reg: /^icon-sip-.+/
        },
        541738: {
            name: 'sip',
            reg: /^icon-sip-.+/
        },
        2064955: {
            name: 'ngsoc',
            reg: /^icon-ngsoc-.+/
        }
    }

    let projectId = (window.location.search.match(/projectId=(\d+)/) || [])[1];
    let projectInfo = projectIDList[projectId];
    projectInfo && init();

    function init () {
        wrap = document.querySelector('.btn-uploader-group');

        if (!wrap) {
            setTimeout(init, 1000);
            return;
        }


        console.log('[init] Check icon name');
        wrap.style.position = 'relative';
        addMask();
        if (!checkName()) {
            enableMask(true);
            listenersNameChange();
        };
    }

    function checkName() {
        let input = getInput();
        if (input) {
            return projectInfo.reg.test(input.value);
        }

        return true;
    }

    function enableMask(status) {
        if (mask) {
            mask.style.display = status ? 'block' : 'none';
        }
    }

    function listenersNameChange() {
        let input = getInput();
        let fn = debounce(function () {
            enableMask(!checkName());
        })
        if (input) {
            input.addEventListener('input', fn);
        }
    }

    function addMask () {
        mask = document.createElement('div');
        let maskStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'rgba(200, 200, 200, 0.3)',
            cursor: 'not-allowed',
            top: '0',
            left: '0',
            display: 'none'
        }
        addStyle(mask, maskStyle);
        wrap.append(mask);
        addTip(mask);
    }

    function addTip (wrap) {
        let tip = document.createElement('h3');
        tip.innerHTML = `tip: 图标名称请带上${projectInfo.name}， 格式为icon-${projectInfo.name}-xxxx`;
        addStyle(tip, {
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#00f',
            padding: '4px',
            color: 'red'
        });
        wrap.append(tip);
    }

    function addStyle (dom, styles) {
        Object.keys(styles).forEach(key => dom.style[key] = styles[key]);
    }

    let input;
    function getInput () {
        if (!input) {
            let inputWarp = [...document.querySelectorAll('.form-line')].find(item => item.querySelector('label') && item.querySelector('label').innerText.includes('名称'));
            input = inputWarp.querySelector('input');
        }
        return input;

    }

    function debounce(fn, time) {
        time = time || 500;
        let timer = null;
        let cb = function () {
            if (timer) {
                timer = setTimeout(cb, time);
            } else {
                fn();
            }
        }
        return function () {
            setTimeout(cb, time);
        }
    }
})();