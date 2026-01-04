// ==UserScript==
// @name         HiFiNi 助手
// @namespace    https://greasyfork.org/users/866159-gmail
// @version      0.3.0
// @description  HiFini、5song 下载助手。1、自动填写回复内容；2、自动提取蓝奏（修改超链接），自动下载（下载窗口可能会被浏览器拦截）；
// @author       foobar
// @match        https://www.hifini.com/thread-*.htm
// @match        https://www.hifini.com/sg_sign.htm
// @match        https://www.5song.xyz/*/*.html
// @match        https://*.lanzoui.com/*
// @match        https://*.lanzouo.com/*
// @match        https://*.lanzoux.com/*
// @match        https://*.lanzn.com/*
// @icon         https://www.hifini.com/view/img/logo.png
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506580/HiFiNi%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/506580/HiFiNi%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //region utils
    function displaying(el) {
        return window.getComputedStyle(el).display !== 'none';
    }

    function copyText(text) {
        return navigator.clipboard.writeText(text);
    }

    function domesticate(text) {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.body.firstChild;
    }

    //endregion

    //region HiFiNi
    function shorthandReply(waiting) {
        let titles = document.title.split('[');
        document.getElementById('message').value = titles[0];
        copyText(titles[0]).then();
        if (waiting) {
            let btn = document.querySelector('#submit');
            let timerId;

            function waitReply() {
                if (findLanZou()) {
                    clearInterval(timerId);
                }
            }

            if (btn) {
                btn.addEventListener('click', () => {
                    timerId = setInterval(waitReply, 500);
                });
            }
        }
    }

    function filterText(el) {
        const spans = el.querySelectorAll('span');
        return Array.from(spans)
            .filter(x => displaying(x))
            .map(x => x.innerText)
            .join('');
    }

    function findBaiDu() {
        let links = document.querySelectorAll('p a');
        let link;
        for (let i = 0; i < links.length; i++) {
            if (links[i].href.indexOf('pan.baidu.com') > 0) {
                link = links[i];
                break;
            }
        }
        if (!link) return false;
        let list = document.querySelector('.alert.alert-success');
        const pwd = filterText(list);
        if (link.href.indexOf('pwd=') < 0) {
            link.href += `?pwd=${pwd}`;
            link.textContent += `?pwd=${pwd}`;
        }
        return true;
    }

    function findLanZou() {
        let list = document.querySelectorAll('.alert.alert-success');
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            const link = el.querySelector('a');
            if (!link) continue;
            const href = link.href;
            if (href.indexOf('lanz') > 0 && href.indexOf('.com') > 0) {
                const pu = filterText(el);
                link.href = href + '?pu=' + pu;
                el.prepend('!! ');
                el.style.color = 'green';
                return true;
            }
        }
        return false;
    }

    function waitHiFiNi() {

        return new Promise((resolve, reject) => {
            let n = 1;
            let id = setInterval(() => {
                const el = document.querySelector('.jan.card');
                if (el) {
                    clearInterval(id);
                    resolve(true);
                }
                if (n++ > 10) {
                    clearInterval(id);
                    reject('10s内未找到主贴');
                }
            }, 1000);
        });
    }

    async function handleHiFini() {
        try {
            await waitHiFiNi();
            const replied = !document.querySelector('.alert.alert-warning .post_reply');
            if (replied) {
                findLanZou();
                findBaiDu();
            } else {
                shorthandReply(true);
            }
        } catch (e) {
            console.error('[HiFini]', e);
        }
    }

    //endregion

    //region HiFini sign
    function handleHiFiniSign() {
        const text =
            `<div class="form-group"> <form>
      <div class="input-group">
        <input type="text" class="form-control" placeholder="关键词" name="keyword">
        <div class="input-group-append">
          <button class="btn btn-primary" type="submit">搜索</button>
        </div>
      </div>
  </form></div>`;
        const el = domesticate(text);
        const form = el.children[0];
        const input = form.querySelector('input');
        form.addEventListener('submit', (e) => {
            const word = input.value.trim();
            if (word) {
                const kw = encodeURIComponent(word).replaceAll('%', '_')
                window.location = `/search-${kw}-1.htm`;
            }
            e.preventDefault();
        });
        document.querySelector('.msign').appendChild(el);
        const sign = document.querySelector('#sign');
        if (sign && sign.textContent.indexOf('已签') > -1) {
            input.focus();
        }
    }

    //endregion


    //region LanZou
    function rushLanZou() {
        const params = new URLSearchParams(document.location.search);
        const pickup = params.get('pu');
        if (!pickup) return;
        const pwd = document.getElementById("pwd");

        if (!pwd) return;
        pwd.value = pickup;
        const btn = document.querySelector('.passwddiv-btn, .btnpwd');
        btn?.click();

        const timerId = setInterval(autoDown, 500);
        let times = 0;

        function autoDown() {
            times++;
            const link = document.querySelector("#downajax a")
            if (link) {
                link.style.backgroundColor = 'green';
                link.innerHTML += ' !';
                link.click();
                // link.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                clearInterval(timerId)
            } else if (times > 10) {
                clearInterval(timerId);
                alert("无法下载，未找到下载按钮");
            }
        }

    }

//endregion


    //region 5song
    function handle5Song() {
        let el = document.querySelector('.mobileDown');
        if (!el) {
            return;
        }
        el = el.parentElement;
        el.addEventListener('click', (e) => {
            const url = e.target.parentElement.dataset.url;
            if (url) {
                window.open(url, '_blank')
                e.preventDefault();
                e.stopPropagation();
            } else {
                console.warn('没找到 url. target:', e.target);
                alert('没找到 url')
            }
        }, {capture: true});

    }

    //endregion

    const host = document.location.host;
    if (host.indexOf("hifini.com") > -1) {
        if (document.location.pathname.indexOf("sg_sign.htm") > -1) {
            handleHiFiniSign();
        } else {
            handleHiFini().then();
        }
    } else if (host.indexOf("5song.xyz") > -1) {
        handle5Song();
    } else {
        rushLanZou();
    }

})();