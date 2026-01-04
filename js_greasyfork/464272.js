// ==UserScript==
// @name         批量查询指定机构人员论文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在知网上查询机构人员论文
// @author       hohoyu
// @match        https://kns.cnki.net/kns8/AdvSearch?dbprefix=CFLS&&crossDbcodes=CJFQ%2CCDMD%2CCIPD%2CCCND%2CCISD%2CSNAD%2CBDZK%2CCCJD%2CCCVD%2CCJFN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464272/%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E6%8C%87%E5%AE%9A%E6%9C%BA%E6%9E%84%E4%BA%BA%E5%91%98%E8%AE%BA%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/464272/%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E6%8C%87%E5%AE%9A%E6%9C%BA%E6%9E%84%E4%BA%BA%E5%91%98%E8%AE%BA%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var names = ['此处改为人员列表'];
    var org = '此处改为机构名';
    var par = $('div.ecp_top-nav')[0];
    var bro = $('div.ecp_tn-header')[0];
    var table = document.createElement('table');
    var nameCnt = names.length;
    var rowCnt = Math.ceil(nameCnt/5);
    for (var i = 0; i <rowCnt; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 5; j++) {
            var cell = document.createElement('td');
            var a = document.createElement('a');
            if (i*5+j < nameCnt) {
                var per = names[i*5 + j];
                a.innerText = per;
                a.addEventListener('click', function() {
                    $("input[data-tipid='autxt-1']")[0].value=this.innerText;
                    $("input[data-tipid='autxt-2']")[0].value=org;
                    $('.btn-search')[0].click();
                });
            }
            cell.appendChild(a);
            row.append(cell);
        }
        table.appendChild(row);
    }
    par.insertBefore(table, bro);

})();