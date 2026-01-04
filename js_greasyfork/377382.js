// ==UserScript==
// @name         四经普脚本测试
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       吉亮 qq：5862325 微信：13397521007
// @match        http://10.43.161.10:7010/ydata/check/tablelogicset.do?tableDisType=0
// @match        http://10.43.161.10:7010/ydata/gather/edittracequerycond.do
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377382/%E5%9B%9B%E7%BB%8F%E6%99%AE%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/377382/%E5%9B%9B%E7%BB%8F%E6%99%AE%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
(function () {
  'use strict';
    
    var $ = $ || window.$;
    var sortmode = 0;
     $(function () {
         
         var curUrl = document.URL;
         if(curUrl.indexOf("tablelogicset.do") >= 0){
            tablelogicset();
         }
         if(curUrl.indexOf("edittracequerycond.do")>= 0){
            edittracequerycond();
         }
     });
    function tablelogicset() {
        var $mybutton = $('<span class="btn_s0"><input type="button" value="错误排序" style="width:60px;" class="btn0 bhl"></span>');
        var tb = $("table");
        var td = $(tb[3]).find("td");
        $mybutton.click(sortErr);
        $(td[2]).append($mybutton);
    }
    function edittracequerycond() {
        var btns = $(".btn1");
        var $btn = $('<input type="button" value=">>>" style="width:44px;" class="btn1">');
        var span = $(btns[0]).parent();
        $(btns[0]).remove();
        $btn.on("click",function(){
            moveItem_new('sfrom', 'sfor');
        });
        $(span).append($btn);
    }

    //
    function sortErr() {
        var list = getList();
        list = sortList(list);
        reloadTr(list);
    }
    function getList() {
        var tb = $("#fetable");
        var trs = $(tb).find("tr");
        //console.log(trs);
        return trs;
    }
    function sortList(list) {
        var trs = new Array();
        for(var i=1;i<list.length;i++){
            trs.push(list[i]);
        }
        trs.sort(function(a,b){
            var a_tds = $(a).find("td");
            var b_tds = $(b).find("td");
            var a_err1 = $(a_tds[4]).text();
            var b_err1 = $(b_tds[4]).text();
            var a_err = $(a_tds[4]).text().substr(0, 1);
            var b_err = $(b_tds[4]).text().substr(0, 1);
            var a_ere_counts = $(a_tds[6]).find("a");
            var b_ere_counts = $(b_tds[6]).find("a");
            var a_ere_count = $(a_ere_counts[0]).text();
            var b_ere_count = $(b_ere_counts[0]).text();
            if (a_err === b_err){
                if(b_ere_count === a_ere_count){
                    if(a_err1 > b_err1){
                        return 1;
                    }else{
                        return -1;
                    }
                }
                if(sortmode === 0){
                    return b_ere_count - a_ere_count;
                }else{
                    return a_ere_count - b_ere_count;
                }
            }
            if(a_err > b_err){
                return 1;
            }else{
                return -1;
            }
        });
        if(sortmode === 0){
            sortmode = 1;
        }else{
            sortmode = 0;
        }
        trs.unshift(list[0]);
        return trs;
    }
    function reloadTr(list) {
        $("#fetable tbody tr").remove();
        $("#fetable tbody").append(list);
    }

    //
    function moveItem_new(name1, name2, rToL) {
        var singleSelect = false;
        var frm = document.forms[0];
        if (frm && frm.singleSelect && frm.singleSelect.value == "true") {
            singleSelect = true;
        }
        if (rToL == null && singleSelect) {
            clearOptions(name2);
        }
        var obj1 = document.all(name1);
        var obj2 = document.all(name2);
        if (obj1.options.length > 0 && obj1.selectedIndex != -1) {
            var selectedCount = 0;
            for (var i = 0; i < obj1.options.length; i++) {
                if (obj1.options[i].selected) {
                    selectedCount ++;
                }
            }
            //if(obj2.options.length<=5){
                var count=selectedCount+obj2.options.length;
            //    if(selectedCount>5||count>5){
            //        alert("查询指标个数不能超过5个!");
            //        return;
            //    }
            //}
            for (var i = 0; i < obj1.options.length; i++) {
                if (obj1.options[i].selected) {
                    if(rToL == null){
                        var o;
                        if (singleSelect) {
                            o = obj1.options[i].cloneNode(true);
                            obj2.appendChild(o);
                            obj2.focus();
                            break;
                        } else {
                            o = obj1.options[i].parentNode.removeChild(obj1.options[i]);
                            obj2.appendChild(o);
                        }
                        i--;
                    }else{
                        if (singleSelect) {
                            obj1.options[i].parentNode.removeChild(obj1.options[i]);
                            break;
                        }
                        var period = getPeriod(obj1.options[i]);
                        var o = obj1.options[i].parentNode.removeChild(obj1.options[i]);
                        for(var t=0;t<periodArray.length;t++){
                            if(periodArray[t] == period){
                                periodArray.splice(t,1);
                            }
                        }
                        obj2.appendChild(o);
                        i--;
                    }
                }
            }      
        }
        validZs();
    }
})();