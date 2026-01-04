// ==UserScript==
// @name         Custom yz_tj
// @namespace    https://github.com/invobzvr
// @version      0.3
// @description  研招网调剂增强
// @author       invobzvr
// @match        *://yz.chsi.com.cn/sytj/tj/qecx.html*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://greasyfork.org/scripts/443030-hook-js/code/Hookjs.js?version=1037826
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/yz_tj
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/424504/Custom%20yz_tj.user.js
// @updateURL https://update.greasyfork.org/scripts/424504/Custom%20yz_tj.meta.js
// ==/UserScript==

(function () {
    function inithook() {
        XMLHttpRequest.prototype.open.hook({
            scope: XMLHttpRequest.prototype,
            before: function () {
                if (arguments[1].endsWith('/sytj/stu/sytjqexxcx.action')) {
                    this.addEventListener('readystatechange', () => {
                        if (this.readyState !== 4) {
                            return;
                        }
                        let ret = JSON.parse(this.responseText);
                        ret.data.vo_list.vos = ret.data.vo_list.vos.filter(ii => !ii.sfmzjybyq && !ii.sfmzyq).sort((a, b) => a.gxsj - b.gxsj);
                        Object.defineProperty(this, 'responseText', { value: JSON.stringify(ret) });
                    });
                }
            }
        });

        unsafeWindow.template_zytb_add && unsafeWindow.template_zytb_add.hook({
            scope: unsafeWindow,
            before: function (id) {
                if (zy_status.cur_num < zy_status.max_num) {
                    open(`tbtjzy.html?zy_type=1&id=${id}`);
                    return null;
                }
            }
        });

        unsafeWindow.change_seach && unsafeWindow.change_seach.hook({
            scope: unsafeWindow,
            after: function () {
                let stype = arguments[1][1];
                GM_setValue('stype', stype);
                if (stype === 'accurate') {
                    return;
                }
                let dwxx = document.querySelector('[name=dwmc2]'),
                    tjBtn = document.querySelector('.tj-seach-btn'),
                    ddb = dwxx.insertAdjacentElement('afterend', document.createElement('div'));
                ddb.className = 'dropdown-box';
                dwxx.parentElement.style.position = 'relative';
                dwxx.addEventListener('keydown', evt => evt.keyCode === 13 && tjBtn.click());
                dwxx.addEventListener('click', evt => {
                    evt.stopPropagation();
                    if (keywords.length) {
                        ddb.classList.add('show');
                        ddb.innerHTML = keywords.map(ii => `<div class="dropdown-item">${ii}<div class="dropdown-delete"></div></div>`).join('');
                    }
                });
                addEventListener('click', evt => {
                    if (!ddb.classList.contains('show')) {
                        return;
                    }
                    switch (evt.target.className) {
                        case 'dropdown-item':
                            dwxx.value = evt.target.innerText;
                            ddb.classList.remove('show');
                            break;
                        case 'dropdown-delete':
                            let el = evt.target.parentElement;
                            GM_setValue('keywords', keywords = keywords.filter(ii => ii !== el.innerText));
                            el.remove();
                            !keywords.length && ddb.classList.remove('show');
                            break;
                        default:
                            ddb.classList.remove('show');
                            break;
                    }
                });
            }
        });

        unsafeWindow.qecx_post && unsafeWindow.qecx_post.hook({
            scope: unsafeWindow,
            before: function () {
                let kw = arguments[1].find(ii => ii.name === 'dwmc2').value;
                if (!keywords.includes(kw)) {
                    keywords.push(kw);
                    GM_setValue('keywords', keywords);
                }
            }
        });

        unsafeWindow.layer && layer.alert.hook({
            scope: layer,
            before: function () {
                let args = arguments[1];
                if (typeof args === 'object') {
                    args.shadeClose = true;
                }
            }
        });
    }

    inithook();
    let stype = GM_getValue('stype'),
        keywords = GM_getValue('keywords', ['aa', 'bb']);
    stype === 'fuzzy' && change_seach('', 'fuzzy', new MouseEvent('click'));
    unsafeWindow.page_size = 100;
    GM_addStyle(`.dropdown-box {
    background: #fff;
    border-radius: 2px;
    border: 1px solid!important;
    display: none;
    position: absolute;
    top: 51px;
    user-select: none;
    width: 252px;
}
.dropdown-box.show {
    display: block;
}
.dropdown-item {
    padding: 5px;
    position: relative;
}
.dropdown-item:hover {
    background: #0002;
}
.dropdown-delete:before,
.dropdown-delete:after {
    background: grey;
    border-radius: 25px;
    content: '';
    height: 2px;
    position: absolute;
    top: 11px;
    transform: rotate(45deg);
    transition: .2s;
    width: 15px;
}
.dropdown-delete {
    height: 15px;
    margin: 5px;
    position: absolute;
    right: 0;
    top: 0;
    width: 15px;
}
.dropdown-delete:after {
    transform: rotate(-45deg);
}
.dropdown-delete:hover:before,
.dropdown-delete:hover:after {
    background: #09f;
}`);
})();