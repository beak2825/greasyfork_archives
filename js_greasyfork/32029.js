// ==UserScript==
// @name         网页短链接
// @namespace    none
// @version      0.4
// @description  让你发给别人的链接更简洁
// @author       Kaxyubok
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32029/%E7%BD%91%E9%A1%B5%E7%9F%AD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/32029/%E7%BD%91%E9%A1%B5%E7%9F%AD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

GM_addStyle(".hide{display: none;}.sto{position: absolute;z-index: 2147483647;color: #000}.sto ul,.sto li{margin: 0;padding: 0;list-style: none;}.short-url{position: fixed;top: 0;left: 0;width: 200px;box-shadow: rgba(0, 0, 0, 0.5) 2px 2px 3px;border: 1px solid rgb(204, 204, 204);background: rgba(255, 255, 255, 0.9);cursor: pointer;text-align: center;font-size: 14px;}.url-title{width: 100%;height: 20px;line-height: 20px;font-size: 12px;margin-bottom: 2px;}.url-item{display: flex;width: 100%;height: 24px;line-height: 24px;transition: all 0.2s linear;}.url-item:hover{background-color: #eee;}.url-item>div{flex: 1;}.tip{position: fixed;left: 50%;top: 50%;transform: translate(-50%,-50%);width: 200px;height: 60px;line-height:60px;border-radius: 6px;text-align: center;color: #fff;}.tip.succ{background-color: #1180cb;}.tip.erro{background-color: red;}");

const statusSucc = 1;
const statusErr = 0;
let doc = document,
    el = doc.createElement('div'),
    content = '<div class="short-url hide">' +
        '<div class="url-title">选择短链接</div>' +
        '<ul>' +
        '<li class="url-item baidu" data-to="baidu" data-clipboard-text="" status="" tipMessage="">' +
        '<div>百度</div>'+
        '</li>' +
        '<li class="url-item sina" data-to="sina" data-clipboard-text="" status="" tipMessage="">' +
        '<div>新浪</div>'+
        '</li>' +
        '<li class="url-item suoim" data-to="suoim" data-clipboard-text="" status="" tipMessage="">' +
        '<div>suo.im</div>'+
        '</li>' +
        '</ul>' +
        '</div>' +
        '<div class="tip hide"></div>';
el.classList = 'sto';
el.innerHTML = content;
doc.body.appendChild(el);
let urlBar = doc.querySelector('.short-url'),
    urlItem = doc.querySelectorAll('.url-item'),
    tip = doc.querySelector('.tip');

let href = window.location.href,
    baidu = 'http://dwz.mn/create.aspx?url=',
    sina = 'https://api.t.sina.com.cn/short_url/shorten.json?source=1681459862&url_long=',
    suoim = 'http://suo.im/api.php?format=json&url=';

function addClass(obj, cls) {
    obj.classList.add(cls);
}

function removeClass(obj, cls) {
    obj.classList.remove(cls);
}

function position(ev) {
    let clientWidth = doc.documentElement.clientWidth,
        clientHeight = doc.documentElement.clientHeight,
        x = ev.clientX,
        y = ev.clientY;
    if ((x + urlBar.offsetWidth) > clientWidth) {
        x -= urlBar.offsetWidth;
    }
    if ((y + urlBar.offsetHeight) > clientHeight) {
        y -= urlBar.offsetHeight;
    }
    urlBar.style.left = x + 'px';
    urlBar.style.top = y + 'px';
}

function dataFilter(type, data) {
    let res = {};
    switch (type) {
        case 'baidu':
            if (data.status === 0) {
                res.status = statusSucc;
                res.url = data.tinyurl;
            } else {
                res.status = statusErr;
                res.url = '';
            }
            res.tipMessage = data.err_msg;
            break;
        case 'sina':
            if (data.error_code === '400') {
                res.status = statusErr;
                res.url = '';
                res.tipMessage = data.error;
            } else {
                res.status = statusSucc;
                res.url = data[0].url_short;
                res.tipMessage = '';
            }
            break;
        case 'suoim':
            if (data.url === '') {
                res.status = statusErr;
                res.url = '';
            } else {
                res.status = statusSucc;
                res.url = data.url;
            }
            res.tipMessage = data.err;
            break;
    }
    return res;
}

let dataGet = function () {
    let promise = new Promise(function (resolve, reject) {
        let lth = urlItem.length;
        for (i = 0; i < lth; i++) {
            let website;
            let _this = urlItem[i];
            let type = _this.getAttribute('data-to');
            switch (type) {
                case 'baidu':
                    website = baidu;
                    break;
                case 'sina':
                    website = sina;
                    break;
                case 'suoim':
                    website = suoim;
                    break;
            }
            GM_xmlhttpRequest({
                method: 'GET',
                synchronous: true,
                url: website + href,
                onload: function (res) {
                    res = JSON.parse(res.response);
                    let data = dataFilter(type, res);
                    _this.setAttribute('data-clipboard-text', data.url);
                    _this.setAttribute('status', data.status);
                    _this.setAttribute('tipMessage', data.tipMessage);
                    resolve();
                }
            });
        }
    });
    return promise;
};

document.oncontextmenu = function (e) {
    if (e.ctrlKey) {
        dataGet().then(()=>{
            removeClass(urlBar, 'hide');
        });
        position(e);
        return false;
    }
};

urlBar.querySelector('ul').addEventListener('click', function (e) {
    let el = e.target;
    let type = el.parentNode.getAttribute('data-to');
    let status = el.parentNode.getAttribute('status');
    let tipMessage = el.parentNode.getAttribute('tipMessage');
    let copy;
    switch (type) {
        case 'baidu':
            copy = new Clipboard('.baidu');
            break;
        case 'sina':
            copy = new Clipboard('.sina');
            break;
        case 'suoim':
            copy = new Clipboard('.suoim');
            break;
    }
    if(status == 1){
        copy.on('success', function(e) {
            tip.innerText = '复制成功';
            addClass(tip, 'succ');
        });
    }else{
        tip.innerText = tipMessage;
        addClass(tip, 'erro');
    }
    removeClass(tip, 'hide');
    addClass(urlBar, 'hide');
    let t = setTimeout(() => {
        addClass(tip, 'hide');
        removeClass(tip, 'succ');
        removeClass(tip, 'erro');
    }, 1500);
});
