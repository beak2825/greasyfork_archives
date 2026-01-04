// ==UserScript==
// @name         XL助手
// @namespace    https://pan.xunlei.com
// @version      0.2
// @description  -- 略
// @author       tuite
// @match        https://pan.xunlei.com/**
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/447750/XL%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447750/XL%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var v = '0.2'
    var get_no_null = (getf, ef, time) => {
        var f = getf();
        if (f == null) {
            setTimeout(() => {
                get_no_null(getf, ef, time)
            }, time)
        } else {
            ef(f)
        }
    }
    var del_btn = '<a id="del_job_a" class="pan-list-menu-item pan-list-menu-item__primary"><div class="td-badge pan-badge-container"><span>删除云添加</span><!----></div></a>'
    var get_menus_f = () => {
        return document.querySelector('.pan-list-menu')
    }
    var yes_c = () => {
        var y_btn = document.querySelector('.message-content button.btn-primary')
        y_btn.click()
        setTimeout(del_job_evryone, 1000)
    }
    var del_job_evryone = () => {
        var db = document.querySelector('i.xly-icon-clear')
        if (db == null)
            return
        db.click();
        setTimeout(yes_c, 500)
    }
    var del_job = () => {
        document.querySelectorAll('.pan-list-menu a.pan-list-menu-item')[1].click()
        setTimeout(del_job_evryone, 1000)
    }
    var add_del_btn = (menu_dom) => {
        menu_dom.insertAdjacentHTML('beforeend', del_btn)
        document.querySelector('#del_job_a').onclick = del_job
    }
    get_no_null(get_menus_f, add_del_btn, 500)
})();

