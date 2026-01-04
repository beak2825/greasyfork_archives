// ==UserScript==
// @name         第四届生态文明竞赛自动答题
// @namespace    http://wxwx.ml/
// @version      1.0
// @description  领导要求一次性过关，没办法
// @author       网型网秀
// @match        http://dati.cqep.org/NewExam.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35099/%E7%AC%AC%E5%9B%9B%E5%B1%8A%E7%94%9F%E6%80%81%E6%96%87%E6%98%8E%E7%AB%9E%E8%B5%9B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/35099/%E7%AC%AC%E5%9B%9B%E5%B1%8A%E7%94%9F%E6%80%81%E6%96%87%E6%98%8E%E7%AB%9E%E8%B5%9B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    for (var q = 1; q < 16; q++) {
        var x = document.getElementsByName(q);
        var key = new Array(3,3,1234,13,1,1,1,4,4,2,3,2,3,1,3,4,4,4,3,2,1,3,2,4,13,1,3,2,1,1234,3,4,1,4,2,123,1,123,1234,2,2,2,2,1234,4,3,3,2,2,3,3,1,1,3,1,2,2,4,2,2,3,1,2,2,1,3,1,1,3,1,3,3,3,4,3,3,2,1,2,2,1,4,234,124,123,234,124,4,2,4,1,2,1,2,4,3,123,2,2,1,1,2,1,2,1,3,1,2,1,123,13,3,3,1,1,1234,123,1,1234,1,1234,2,1,4,2,1,3,13,4,3,123,1,3,123,1234,3,2,2,3,4,3,1,1,1,3,1,3,124,2,2);
        for (var num = 1; num < key.length+1; num++) {
            if (x[0].nextSibling.value == num){
                if (key[num-1]>10) {
                    key[num-1] = String(key[num-1]).split('');
                    for (var j = 0; j < key[num-1].length; j++) {
                        x[key[num-1][j]-1].checked = true;
                    }
                } else{
                    x[key[num-1]-1].checked = true;
                }
            }
        }
    }
})();