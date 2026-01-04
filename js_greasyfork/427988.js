// ==UserScript==
// @name         hsLogin
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  none
// @author       Silite
// @match        https://testzjlh.fullnine.com.cn/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.js
// @downloadURL https://update.greasyfork.org/scripts/427988/hsLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/427988/hsLogin.meta.js
// ==/UserScript==
let box, textDom, img, hasTrigger = false, flag = false;
const disNone = { display: 'none' };

Element.prototype.setStyle = function(styleObj) {
    Object.keys(styleObj).forEach(attr => {
        this.style[attr] = styleObj[attr];
    });
}

function getDom() {
    box = document.querySelector('.pageError');
    textDom = document.querySelector('.tips.ng-binding');
    img = document.querySelector('img');
    box.style.position = 'relative';
}

function setBtns() {
    textDom.setStyle(disNone);
    const createBtn = text => {
        const btn = document.createElement('button');
        btn.innerText = text;
        return btn;
    };

    const btnReturnHome = createBtn('返回登录页');
    const btnLogin = createBtn('直接登录(87654321)');
    const btnCommonStyle = {
        color: 'rgb(64, 169, 255)', 'line-height': '1.499', position: 'relative', display: 'inline-block', 'font-weight': '400', 'white-space': 'nowrap', 'text-align': 'center', 'background-image': 'none', 'box-shadow': '0 2px 0 rgb(0 0 0 / 2%)', cursor: 'pointer', transition: 'all .3s cubic-bezier(.645,.045,.355,1)', 'user-select': 'none', 'touch-action': 'manipulation', height: '32px', padding: '0 15px', 'font-size': '14px', 'border-radius': '4px', 'background-color': '#fff', border: '1px solid rgb(64, 169, 255)',
    };
    btnReturnHome.setStyle(btnCommonStyle);
    btnLogin.setStyle({ marginLeft: '20px', ...btnCommonStyle, color: '#fff', 'background-color': '#1890ff', 'border-color': '#1890ff', 'text-shadow': '0 -1px 0 rgb(0 0 0 / 12%)', 'box-shadow': '0 2px 0 rgb(0 0 0 / 5%)' });

    box.insertBefore(btnReturnHome, img);
    box.insertBefore(btnLogin, img);

    btnReturnHome.addEventListener('click', () => {
        flag = false;
        location.href = 'https://testzjlh.fullnine.com.cn/#!/passwordLogin'
    });

    btnLogin.addEventListener('click', () => {
        flag = false;
        btnLogin.setStyle(disNone);
        btnReturnHome.setStyle(disNone);
        triggerLogin();
    });
}

function removeImg() {
    img.style.display = 'none';
}

function setText(text) {
    textDom.innerHTML = text;
}

function triggerLogin() {
    setText('正在重新登录');
    const textDomStyle = { position: 'absolute', bottom: '180px', display: 'block', 'text-align': 'center', width: '100%' };
    textDom.setStyle(textDomStyle);

    const pathD = 'M546.462897 266.292966c-73.410207 0-133.15531-59.727448-133.155311-133.137656C413.307586 59.762759 473.05269 0 546.462897 0c73.410207 0 133.12 59.727448 133.12 133.15531 0 73.410207-59.709793 133.137655-133.12 133.137656z m-283.453794 105.736827c-67.054345 0-121.626483-54.554483-121.626482-121.644138s54.572138-121.644138 121.626482-121.644138a121.767724 121.767724 0 0 1 121.608828 121.644138c0 67.054345-54.554483 121.644138-121.608828 121.644138zM142.547862 647.185655A107.343448 107.343448 0 0 1 35.310345 539.895172a107.343448 107.343448 0 0 1 107.237517-107.237517 107.343448 107.343448 0 0 1 107.219862 107.237517 107.343448 107.343448 0 0 1-107.219862 107.272828z m120.461241 272.595862a91.047724 91.047724 0 0 1-90.941793-90.959448 91.065379 91.065379 0 0 1 90.924138-90.941793 91.065379 91.065379 0 0 1 90.941793 90.941793c0 50.14069-40.783448 90.959448-90.924138 90.959448zM546.462897 1024a79.518897 79.518897 0 0 1-79.448276-79.448276c0-43.820138 35.645793-79.448276 79.448276-79.448276a79.518897 79.518897 0 0 1 79.43062 79.448276c0 43.820138-35.628138 79.448276-79.448276 79.448276z m287.744-134.285241a64.194207 64.194207 0 0 1-64.123587-64.123587 64.194207 64.194207 0 0 1 64.123587-64.123586 64.194207 64.194207 0 0 1 64.123586 64.123586 64.194207 64.194207 0 0 1-64.123586 64.123587z m117.848275-296.695173a52.683034 52.683034 0 0 1-52.612413-52.612414 52.683034 52.683034 0 0 1 52.612413-52.630069 52.70069 52.70069 0 0 1 52.630069 52.612414 52.718345 52.718345 0 0 1-52.630069 52.630069z m-158.667034-338.696827a40.818759 40.818759 0 1 0 81.655172 0.017655 40.818759 40.818759 0 0 0-81.655172 0z';
    const svgAttr = {
        viewBox: '0 0 1024 1024',
        width: '20',
        height: '20'
    };
    let svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );
    Object.keys(svgAttr).forEach(k => {
        svg.setAttribute(k, svgAttr[k]);
    });
    let path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    );
    path.setAttribute('d', pathD);
    svg.appendChild(path);

    const svgStyle = { transitoin: 'all 0.2s', marginTop: '50px', opacity: '0.5' };
    svg.setStyle(svgStyle);
    let initRotate = 0
    setInterval(() => {
        initRotate += 7.2
        svg.setStyle({ transform: `rotate(${initRotate}deg)` });
    }, 20);
    box.insertBefore(svg, img);

    axios.post('https://testzjlh.fullnine.com.cn/account/login', {"userCode":"87654321","password":"vovo.1234"}).then(res => {
        setText('登录成功，正在跳转');
        setTimeout(() => {
            location.href = 'https://testzjlh.fullnine.com.cn/#!/home#top'
        },100);
    })
}

(function() {
    'use strict';

    console.log('123')

    window.onhashchange = function() {
        const isHome = location.href === 'https://testzjlh.fullnine.com.cn/#!/wearLoginError?msg=%E8%AF%B7%E4%BB%8E%E6%B3%9B%E5%BE%AE%E7%99%BB%E5%BD%95#top';
        if (isHome) {
            created();
            flag = true;
        }
    };

    window.onload = function() {
        created();
        flag = true;
    };



    function created() {
        if (flag) return;
        getDom();
        removeImg();
        setBtns();
    };

    // Your code here...
})();