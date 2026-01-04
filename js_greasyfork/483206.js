// ==UserScript==
// @name              bilibili收藏快捷键
// @namespace         https://leizingyiu.net
// @version           20231227
// @author            leizingyiu
// @description       bilibili打开收藏列表之后，使用键盘直接收藏； 默认使用‘123asdzxc’收藏列表的第1至9项，收藏后关闭；如果关闭了自动关闭，可以按4键提交；如果不用修改，可以按`键关闭； 可在下方代码修改内容。请自行避免与bilibili原快捷键冲突，譬如 qwef。
// @license           AGPL-3.0-or-later
// @homepage          https://leizingyiu.net
// @match             *://www.bilibili.com/video/*
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/483206/bilibili%E6%94%B6%E8%97%8F%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/483206/bilibili%E6%94%B6%E8%97%8F%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==


收藏列表的快捷键 = '123asdzxc';
收藏后是否关闭 = false;//true 或者 false
延迟防加载不粗来 = 500;
延迟关闭 = 250;
提交按键 = '4';
关闭按键 = '`';

document.querySelector('.video-fav.video-toolbar-left-item').addEventListener('click', function () {
    setTimeout(colectFn, 延迟防加载不粗来);
});

window.addEventListener('keyup', function (e) {
    /** 这里用的bilibili自己的快捷键，如果bilibili改了，请自己修改 */
    if (e.key == 'e') { setTimeout(colectFn, 延迟防加载不粗来); }
});

function colectFn(t = 收藏列表的快捷键, closeboo = 收藏后是否关闭,
    delay = 延迟防加载不粗来, delayClose = 延迟关闭,
    sKey = 提交按键, cKey = 关闭按键) {
    c = '.bili-dialog-bomb .group-list li label';
    t = typeof t == 'undefined' ? '123asdzxc' : t;
    closeboo = typeof closeboo == 'undefined' ? true : closeboo;

    function clickListItemAndOrClose(e) {
        console.log(e);
        if (t.indexOf(e.key) != -1) {
            /**click item */
            document.querySelector('li>label.yiu-key-' + e.key).click();

            /**close and clean */
            setTimeout(() => {

                if (closeboo == true) {
                    removecolectfn();
                    document.querySelector('button.btn.submit-move').click();
                    document.querySelector('.bili-dialog-bomb .title .close').click();
                }
            }, delayClose);
        }
    }

    [...document.querySelectorAll(c)].map((label, idx) => {
        if (idx >= t.length) { return } else {
            let i = document.createElement('i'); i.innerText = t.split('')[idx]; i.classList.add('yiu-key-hint');

            label.insertBefore(i, label.querySelector('span'));
            label.classList.add('yiu-key-' + i.innerText);
        }
    });

    sty = document.createElement('style'); document.body.appendChild(sty);
    sty.innerText = `.yiu-key-hint{padding:0.2em;} .yiu-key-hint:before,.yiu-key-hint:after{opacity:0.5;} .yiu-key-hint:before{content:'['} .yiu-key-hint:after{content:']';padding-right:0.5em}
.bili-dialog-bomb .content{height:72vh!important;transition:all 0.5s ease;}
`;

    function removecolectfn() {
        window.removeEventListener('keydown', clickListItemAndOrClose);
        document.querySelector('.bili-dialog-m').removeEventListener('click', removecolectfn);
        document.body.removeChild(sty);
    }

    window.addEventListener('keydown', clickListItemAndOrClose);

    document.querySelector('.bili-dialog-m').addEventListener('click', removecolectfn);


    /**如果关闭了自动关闭，就按4键提交 */
    window.addEventListener('keydown', function colectSummit(e) {
        if (e.key == sKey) {
            removecolectfn();
            document.querySelector('button.btn.submit-move').click();
            this.window.removeEventListener('keydown', colectSummit);
        }
    });

    /**按`键关闭 */
    window.addEventListener('keydown', function colectclose(e) {
        if (e.key == cKey) {
            removecolectfn();
            document.querySelector('.bili-dialog-bomb .title .close').click();
            this.window.removeEventListener('keydown', colectclose);
        }
    });
}


