// ==UserScript==
// @name         vol.moe 显示分级信息
// @description  在 vol.moe 的列表页显示分级信息
// @version      0.1
// @match        https://vol.moe/
// @match        https://vol.moe/list/*
// @match        https://vol.moe/u/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js
// @namespace https://greasyfork.org/users/216382
// @downloadURL https://update.greasyfork.org/scripts/375795/volmoe%20%E6%98%BE%E7%A4%BA%E5%88%86%E7%BA%A7%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/375795/volmoe%20%E6%98%BE%E7%A4%BA%E5%88%86%E7%BA%A7%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const store = localforage.createInstance({
        name: "volmoer18"
    });

    function getContent(url) {
        return fetch(url).then(r => r.text())
    }

    const r18RE = /var is_r18 = "(\d)"/

    const R18 = 'r18'
    const R15 = 'r15'
    const OTHER = 'rall'

    function getIsR18(url) {
        return store.getItem(url).then((cached) => {
            if (cached) {
                return cached
            }
            return getContent(url).then(content => {
                 const rv = r18RE.exec(content)
                 if (rv && rv[1]) {
                     let flag = OTHER
                     switch (rv[1]) {
                         case '2':
                             flag = R18;
                             break;
                         case '1':
                             flag = R15;
                     }
                     store.setItem(url, flag);
                     return flag;
                 }
             })
        }, (err) => console.log(err))
    }

    document.querySelectorAll('.book_list .listbg td').forEach(td => {
        try {
            const anchor = td.querySelectorAll('a')[1]
            getIsR18(anchor.href).then(rv => {
                if (rv === R18) {
                    anchor.innerHTML = '<font class="hd_logo" id="logo_r18_2">[18限]</font>' + anchor.innerHTML
                } else if (rv == R15) {
                    anchor.innerHTML = '<font class="hd_logo" id="logo_r18">[15限]</font>' + anchor.innerHTML
                } else {
                    anchor.innerHTML = '<font class="hd_logo">[全年龄]</font>' + anchor.innerHTML
                }
            })
        } catch (e) {
            console.error(e)
        }
    })
})();