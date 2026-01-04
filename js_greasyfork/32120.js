// ==UserScript==
// @name         sssta girl only
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  sssta 2017 招新管理页面特殊操作233333
// @author       Ciaran Chen
// @match        http://www.sssta.org/admin/infos
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32120/sssta%20girl%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/32120/sssta%20girl%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(typeof(String.prototype.trim) === "undefined"){
        String.prototype.trim = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

    var trs = document.getElementById('studentTable').children;

    $('a[href="/admin/infos/girls_only"]').first()
    .attr('href', '#').click(function() {// show girl only
        for (var i = 0; i < trs.length; i++){
            if (trs[i].children[1].innerHTML.trim() == 'male'){
                trs[i].setAttribute('hidden', '');
            } else {
                trs[i].removeAttribute('hidden');
            }
        }
    });
    
    $('a[href="/admin/infos"]').first()
        .attr('href', '#').click(function () { // show all
        for (var i = 0; i < trs.length; i++){
            trs[i].removeAttribute('hidden');
        }
    });
    
    
    // append undefined & 
    var content = '<li><a href="#">xxx</a></li>';
    $('.dropdown-menu').append(content.replace('xxx', 'None')).append(content.replace('xxx', 'undefined'))

    // filter attr
    var _filter = function (direct) {
        for (var i = 0; i < trs.length; i++){
            if (trs[i].children[2].innerHTML.trim().toLowerCase() !== direct){
                trs[i].setAttribute('hidden', '');
            } else {
                trs[i].removeAttribute('hidden');
            }
        }
    };

    $('.dropdown-menu').children().children().attr('href', '#').click(function (event) {
        _filter(event.target.innerText.trim().toLowerCase());
    });
})();