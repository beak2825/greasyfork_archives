// ==UserScript==
// @name        zcoolWorkCleanPage - 站酷 work 页面简化
// @namespace   leizingyiu.net
// @match       http*://www.zcool.com.cn/work/*
// @grant       none
// @version     2022.10.08
// @author      -
// @description 站酷 work 页面简化 ，快捷键 ctrl shift alt + c
// @license     GNU AGPLv3

// @downloadURL https://update.greasyfork.org/scripts/452054/zcoolWorkCleanPage%20-%20%E7%AB%99%E9%85%B7%20work%20%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/452054/zcoolWorkCleanPage%20-%20%E7%AB%99%E9%85%B7%20work%20%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

var shortKeysArr = ['control', 'shift', 'alt', 'c'];
var searchName = 'yiu_zcoolWorkClean';
var url = new URL(window.location),
    search = new URLSearchParams(url.search),
    cleanBoo = eval(search.get(searchName));

function clean() {
    let main = [...document.querySelectorAll('main>div>section>div')].filter(div => div.classList.length == 0).pop();
    let title = document.querySelector('.titleBox').parentElement;
    console.log(main, title);

  let style=document.createElement('style');
  style.innerText=`
    body{min-width: unset!important;
    margin: 1em!important;
    touch-action: pan-y;
    overflow: auto!important;
    overscroll-behavior: none;
    }
    html{
    overflow: scroll!important;
    }
    .ReactModalPortal{display:none!important;
    }`;

    document.body.innerHTML = title.innerHTML + main.innerHTML;
    document.body.appendChild(style);

}

function updateClean() {
    url = new URL(window.location),
        search = new URLSearchParams(url.search),
        cleanBoo = eval(search.get(searchName));

    console.log(cleanBoo, search.get(searchName));
    cleanBoo = !cleanBoo;
    console.log(cleanBoo);

    search.set(searchName, cleanBoo);
    url.search = search.toString();

    var _url = url.href;
    window.history.pushState(null, null, _url);

    if (cleanBoo == true) {
        clean();
    }else{
      window.location=_url;
    }
}

function multKeys(keysArr, callback) {
    keysArr = [...new Set(keysArr)];
    const tokenJoining = '_',
        tokenSortFunction = (_a, _b) => {
            let a = String(_a),
                b = String(_b);
            if (a.length != b.length) {
                return a.length - b.length;
            } else {
                return a.localeCompare(b);
            }
        },
        tokenFn = arr => arr.sort(tokenSortFunction).join(tokenJoining),
        keysToken = tokenFn(keysArr);
    let keys = [];

    document.onkeydown = function (ev) {
        let k = ev.key.length == 1 ? ev.code.toLowerCase().replace('key', '') : ev.key.toLowerCase();
        keys.push(k);
        keys = [...new Set(keys)];
        console.log(ev, keys);

        let hitKeys = keys.filter(key => keysArr.includes(key)),
            hitToken = tokenFn(hitKeys);
        if (hitToken == keysToken) {
            callback(ev);
            keys = [];
        }
    }
    document.onkeyup = function (ev) {
        let k = ev.key.length == 1 ? ev.code.toLowerCase().replace('key', '') : ev.key.toLowerCase();
        keys = keys.filter(_k => _k != k);
        console.log(ev, keys);
    }
}

if (cleanBoo == true) {
    clean();
}

multKeys(shortKeysArr, updateClean);