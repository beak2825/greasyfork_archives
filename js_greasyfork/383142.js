    // ==UserScript==
    // @name         t66y.com
    // @namespace    t66y.com/
    // @version      0.3
    // @description  try to take over the world!
    // @author       You
    // @include     *t66y.com*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383142/t66ycom.user.js
// @updateURL https://update.greasyfork.org/scripts/383142/t66ycom.meta.js
    // ==/UserScript==
        var table = document.querySelectorAll('.sptable_do_not_remove');
        if (document.querySelectorAll('.sptable_do_not_remove span').length > 0) {
          var str = document.querySelectorAll('.sptable_do_not_remove span') [0].className;
          for (var j = 0; j < table.length; j++) {
            var td = table[j].querySelectorAll('td');
            for (var i = 0; i < td.length; i++) {
              td[i].innerHTML = '<span class=' + str + '>&nbsp;</span>';
            }
          }
        } else {
          for (var k = 0; k < table.length; k++) {
            table[k].style.display = 'none';
          }
        }