// ==UserScript==
// @name         auto jump
// @copyright    2020, xgame-0 (https://github.com/xgame-0/tamper-monkey-script)
// @license      MIT
// @namespace    https://github.com/xgame-0/tamper-monkey-script
// @version      2024-11-19
// @description  auto jump to target link
// @match        *://news.17173.com/*
// @match        *://imagetwist.com/*
// @match        *://img599.net/*
// @match        *://imgbaron.com/*
// @match        *://imgsto.com/*
// @match        *://picbaron.com/*
// @match        *://picdollar.com/*
// @match        *://silverpic.com/*
// @match        *://viidii.info/*
// @match        *://redircdn.com/*
// @match        *://downsx.*/*
// @match        *://hgcdown.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518083/auto%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/518083/auto%20jump.meta.js
// ==/UserScript==

let CONFIGS = [{
    host: 'imagetwist.com',
    image: 'img.pic.img.img-responsive',
}, {
    host: 'img599.net',
    image: '#image-viewer-container img',
}, {
    host: ['imgbaron.com', 'imgsto.com', 'picbaron.com', 'picdollar.com', 'silverpic.com'],
    image: 'img.pic',
    click: 'form input[type=submit]',
}, {
    host: ['viidii.info', 'redircdn.com'],
    param: ['url', 'src'],
}, {
    host: 'news.17173.com',
    func: function () {
        let href = window.location.href;
        let url = href.replace(/_[0-9]*\.(s?html)/, '_all.$1');
        if (url != href) {
            window.location = url;
            return true
        }
    },
}, {
    host: ['downsx.net', 'downsx.rocks', 'downsx.pw', 'downsx.club', 'hgcdown.net'],
    func: function () {
        let e = document.querySelector('.uk-width-1-1.text-center');
        let res = e.innerText.match(/\d+/);
        if (!res || res.length === 0) {
            return;
        }
        let size = +res[0];
        if (!size) {
            return;
        }
        size = calcBytes(size);
        let html = e.innerHTML.replace(/\d+\s*\(Bytes\)/, size);
        console.log(html);
        e.innerHTML = html;
    },
}, {
    host: 'imgrock.pw',
    image: 'img[onload="scaleImg(this)"]',
    func: function () {
        setInterval(function () {
            let e1 = document.querySelectorAll('input[type=button]');
            e1.forEach((v, i) => {
                console.log('click:', v);
                v && v.click && v.click();
            });

            let e2 = document.querySelector('button.btn_blue');
            console.log('click:', e2);
            e2 && e2.click && e2.click();
        }, 500);
    },
}];

function calcBytes(n) {
    let u = 'B';
    if (n >= 1024) {
        n /= 1024;
        u = 'KiB';
    }
    if (n >= 1024) {
        n /= 1024;
        u = 'MiB';
    }
    if (n >= 1024) {
        n /= 1024;
        u = 'GiB';
    }
    return n.toFixed(2) + ' ' + u;
}

function checkConfigHost(cfgHost) {
    if (Array.isArray(cfgHost)) {
        for (let i in cfgHost) {
            if (checkConfigHost(cfgHost[i])) {
                return true;
            }
        }
        return false
    }

    let host = window.location.host;
    return cfgHost && host.indexOf(cfgHost) >= 0
}

function getConfig() {
    let res = [];
    for (let i in CONFIGS) {
        let cfg = CONFIGS[i];
        if (checkConfigHost(cfg.host)) {
            res.push(cfg)
        }
    }
    return res;
}

function doImage(selector) {
    if (Array.isArray(selector)) {
        let r = false;
        selector.forEach((v, i) => {
            r = r || doImage(v);
        });
        return r;
    }
    let e = document.querySelector(selector);
    if (e && e.src) {
        console.log('goto image src. selector:', selector, ', url:', e.src)
        window.location = e.src;
        return true
    }
}

function doClick(selector) {
    if (Array.isArray(selector)) {
        let r = false;
        selector.forEach((v, i) => {
            r = r || doClick(v);
        });
        return r;
    }
    let e = document.querySelector(selector);
    if (e && e.click) {
        console.log('goto click. selector:', selector)
        e.click();
        return true;
    }
}

let PARAMS = null;

function doParam(param) {
    PARAMS = PARAMS || new URLSearchParams(window.location.search.substr(1))
    let params = PARAMS;
    if (Array.isArray(param)) {
        let r = false;
        param.every((v, i) => {
            r = r || doParam(v);
        });
        return r;
    }
    let url = params.get(param);
    console.log(param, url);
    if (url && url != 'undefined') {
        console.log('goto param url. param:', param, ', url:', url)
        window.location = url;
        return true;
    }
}

function doFunc(func) {
    if (Array.isArray(func)) {
        let r = false;
        func.every((v, i) => {
            r = r || doFunc(v);
        });
        return r;
    }
    return func();
}

function main() {
    let cfgs = getConfig() || [];
    console.log('host:', window.location.host, ', cfgs:', cfgs)

    for (let i in cfgs) {
        let cfg = cfgs[i]
        console.log('cfg:', cfg);
        let r = false;
        r = r || cfg.image && doImage(cfg.image);
        r = r || cfg.click && doClick(cfg.click);
        r = r || cfg.param && doParam(cfg.param);
        r = r || cfg.func && doFunc(cfg.func);
    }
}

if (['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1) {
    main();
} else {
    window.addEventListener('DOMContentLoaded', main);
}
