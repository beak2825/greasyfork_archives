// ==UserScript==
// @name         commanderHelper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  commander helper to expandAll and get brief
// @author       You
// @match        http://project.alibaba.net/process/commander/assessTechnicalTeam.htm
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23816/commanderHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/23816/commanderHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    GM_addStyle(`
.commander-helper.panel{
    background: #AFDEEC;
}
.commander-helper button{
    padding: 3px;
}
.commander-helper .output b{
    color: red;
    padding: 0 3px;
}
.commander-helper .output .info{
    color: gray;
}

`);
    //
    //expandAll
    function expandAll(){
        console.log('expandAll');
        var n=0;
        $('.open-icon:visible').each(function(){
            $(this).click();
            n++;
        });
        $('.commander-helper .output').html(`全部展开 ${n} 项`);
    }
    //collapseAll
    function collapseAll(){
        console.log('collapseAll');
        var n=0;
        $('.close-icon:visible').each(function(){
            $(this).click();
            n++;
        });
        $('.commander-helper .output').html(`全部折叠 ${n} 项`);
    }
    //counter
    function counter(){
        var output = $('.commander-helper .output');
        var keyword = $('.emp-keyword').val();
        if(keyword=='') return output.html('请先输入员工名字');
        //
        var resItems = [];
        var total = 0;
        $('.ant-select-selection__choice__content:contains("'+keyword+'")').each(function(){
            var o = {};
            o.res = $(this).closest('.resource_item').find('input.cost').val();
            o.pName = $(this).closest('tr').find('a[target="_blank"]').text();
            o.pId = $(this).closest('tr').find('input[name="batch_submit"]').val();
            resItems.push(o);
            total += +(o.res);
        });
        var hcNeeded = total / (62*0.9);
        output.html(`与员工<b>${keyword}</b>相关联的资源项有<b>${resItems.length}</b>个,共<b>${total}</b>人日。Q3人头换算：<b>${hcNeeded}</b> (总人日 / (62工作日*0.9))
<br><span class="info">详情：${JSON.stringify(resItems)}</span>`);
    }
    function initPanel() {
        $(".commandarBtn").parent().before(`
<div id="commander-helper" class="commander-helper panel">
  <div>
    <button class="collapseAll">全部折叠</button> <button class="expandAll"">全部展开</button>
    关联人员：<input type="text" name="emp-keyword" class="emp-keyword" /> <button class="counter">汇总</button>
  </div>
  <div class="output">（汇总前请确保全部展开过一次）</div>
</div>
`);
        $('.commander-helper')
            .on('click', '.collapseAll', collapseAll)
            .on('click','.expandAll', expandAll)
            .on('click','.counter', counter);
    }
    //
    initPanel();
})();