// ==UserScript==
// @name         51Talk优化:智能排序
// @version      0.0.1
// @namespace    51talk_sort
// @description  智能排序选课页
// @author       qingcaomc@gmail.com
// @license      GPLv3
// @match        https://www.51talk.com/ReserveNew/index*
// @match        http://www.51talk.com/ReserveNew/index*
// @icon         https://avatars3.githubusercontent.com/u/25388328
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387538/51Talk%E4%BC%98%E5%8C%96%3A%E6%99%BA%E8%83%BD%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/387538/51Talk%E4%BC%98%E5%8C%96%3A%E6%99%BA%E8%83%BD%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //删除数组中的空元素
    Array.prototype.clean = function(deleteValue="") {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };

    function teacher_sort(a, b){
        return b - a;
    }

    let num = /[0-9]*/g;
    let i_len = $(".label").length;
    let value = [];
    for(let i = 0; i < i_len; i++) {
        let j_len = $(".label")[i].textContent.match(num).clean("").length;
        value[i] = 0;
        for(let j = 0; j < j_len; j++) {
            value[i] += Number($(".label")[i].textContent.match(num).clean("")[j]);
        }
        value[i] /= 5;
        $(".teacher-name")[i].innerText += "(" + value[i] + ")";
    }
    console.log(value.sort(teacher_sort));
})();