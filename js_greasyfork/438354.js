// ==UserScript==
// @name         魔数Plus
// @namespace    http://tampermonkey.net/
// @version      0.12.70
// @description  给魔数添加一些便捷操作
// @author       duantianci
// @match        https://bi.sankuai.com/sql/edit*
// @match        https://data.sankuai.com/wanxiang#/xt/edit/*
// @icon         https://www.google.com/s2/favicons?domain=sankuai.com
// @license      MIT
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438354/%E9%AD%94%E6%95%B0Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/438354/%E9%AD%94%E6%95%B0Plus.meta.js
// ==/UserScript==

(function() {
     // Your code here...

     var curUrl = window.location.href; 
     // 魔数
     if(curUrl.includes("bi")){
         var selectAllBtn = createSelectAllBtn(); // select *
        var SelectAggrBtn = createSelectAggrBtn(); // 单表聚合
        var SelectAggrDiffBtn = createSelectAggrDiffBtn(); // 双表聚合diff
        var AllDiffBtn = createAllDiffBtn(); // 无diff测试
        var toXtEditBtn = createRunInXtEdit();
        var btnList = [toXtEditBtn,selectAllBtn,SelectAggrBtn,SelectAggrDiffBtn,AllDiffBtn];

        // XT
        setTimeout( function(){
    
        var matchingElement=document.querySelector("#app > div > div.sidebar-container > div > div.ms-sidebar-main > div > div.router-view > div > div > div.mtd-tabs-content > div > div > div.control-buttons > div > span > button")
        var beforeEle = matchingElement
        for (var i in btnList){
            var curBtn=btnList[i]
            if(i==0){
                curBtn.style.cssText = 'display: inline-block;color:#fff;background:#0a70f5;white-space:nowrap;cursor:pointer;outline:0;text-align:center;font-weight:400;user-select:none;position:relative;transition:all.3s;border-radius:4px;min-width:32px;height:32px;font-size:14px;border-style:none;margin-right:10px;';
            }else{
                curBtn.style.cssText='color: #0a70f5;border-color: transparent!important;background-color: #0000;font-size: 14px;font-weight: 400;cursor: pointer;';
            }
            beforeEle.parentElement.insertBefore(curBtn,beforeEle);
            beforeEle=curBtn;
        }


        },3000);

     }else{
         //探数
         var sqlValue = GM_getValue("sqlText")
         GM_setValue("sqlText",undefined)
         if(sqlValue ==undefined){
             return
         }else{
            setTimeout( function(){
            AddIcon=getAddIcon()
            AddIcon.click()
                setTimeout(  function(){
                    var cm = getCm(-1)
                    cm.setValue(sqlValue)

                },3000)
         
                

        },2000)

         }
     }


})();


// Date.prototype.format = function (fmt) {
//     var o = {
//         "M+": this.getMonth() + 1, //月份
//         "d+": this.getDate(), //日
//         "h+": this.getHours(), //小时
//         "m+": this.getMinutes(), //分
//         "s+": this.getSeconds(), //秒
//         "q+": Math.floor((this.getMonth() + 3) / 3), //季度
//         "S": this.getMilliseconds() //毫秒
//     };
//     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for(var k in o)
//         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//     return fmt;
// }


var getDate=function(delta){
 var currentDate = new Date();
 currentDate.setDate(currentDate.getDate() - delta);
 var yearStr = currentDate.getFullYear(); // 年份
var monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月份，toString 和 padStart 可以保证一位数月份前面加 0
var dayStr = currentDate.getDate().toString().padStart(2, '0'); // 日，同样保证前面加 0

//  var sDate = day.format("yyyyMMdd");
 return yearStr+monthStr+dayStr;
}

var getFormatBtn = function(){
    return document.getElementsByClassName("sql-icon-format")[0];
}



var getCm = function(tag=0){
    var cmList = document.getElementsByClassName("CodeMirror cm-s-ms-light CodeMirror-wrap")
    if(tag==0){
        return cmList[0].CodeMirror;
    }else{
        return cmList[cmList.length-1].CodeMirror;
    }
    
}

var getDiffTableName = function(oriTableName){
    return oriTableName.split(".")[0]+"_test." + oriTableName.split(".")[1]
}

var getTableName = function(){
   return document.getElementsByClassName("table-line show-column")[0].childNodes[1].childNodes[0].title;
}

var getTablePartitionType = function(){
    var first_text = document.getElementsByClassName("column-list")[0].rows[1].cells[0].textContent;
    var is_partiiton = first_text.includes('P');
    if(is_partiiton ){
        return 1;
    }else{
        return 0;
    }
}

var getColsName = function(){
   var tableCols=[];
   var table = document.getElementsByClassName("column-list")[0];
   var rows = table.rows;//获取所有行
   console.log("lenth",rows.length) //
   for(var i=1; i < rows.length; i++){
       var row = rows[i];//获取每一行
       var colName = row.cells[0].title;//获取具体单元格
       tableCols.push(colName);
   }
   return tableCols;
}


var getColInfo = function(cols){
    var sumEndPatterns=['num', 'cnt', 'amt','fee','1d','7d','15d']
    var disEndPatterns=['uv','user','poi_num']
    var sumCols=cols.filter(name => (
    sumEndPatterns.some(pattern => name.endsWith(pattern)) && !disEndPatterns.some(pattern => name.endsWith(pattern))
)).map(function(col){
    return 'sum('+ col +') as '+col
    }).join(',');

   var disCols=cols.filter(name => (
  disEndPatterns.some(pattern => name.endsWith(pattern))
)).map(function(col){
    return  'count(distinct '+ col +') as '+col
    }).join(',');
   return {'sum':sumCols,'dis':disCols};
}

var buautify = function(){
    var matchingElement=document.querySelector("#app > div > div.sidebar-container > div > div.ms-sidebar-main > div > div.router-view > div > div > div.mtd-tabs-content > div > div > div.sql-item-main > div.editor-controls > div.editor-control-button-groups > div.format-control.control-item > button")
    matchingElement.click()
}

var getAddIcon = function(){
    return document.getElementsByClassName("mtdicon mtdicon-add")[0];
}



// select *
function createSelectAllBtn(){
     let selectAllBtn=document.createElement("button");
     selectAllBtn.innerText="select *";
     selectAllBtn.className="biPlus"
     selectAllBtn.onclick=function(){
         var is_par = getTablePartitionType();
         var yesterday='and dt='+getDate(1);
         if(is_par == 0){
            yesterday ='';
         }
         var cm = getCm();
         var tableName =getTableName();
         var tableCols = getColsName();
         var joinCols = tableCols.join(",")
         var finalSql="select " +tableCols.join(",") +" from "+tableName +" where (1=1)   "+yesterday +" limit 100";
         cm.setValue(finalSql);
         buautify();
     }
     return selectAllBtn;
}

// 单表聚合
function createSelectAggrBtn(){
     let selectAllBtn=document.createElement("button");
     selectAllBtn.innerText="单表聚合";
     selectAllBtn.className="biPlus"
     selectAllBtn.onclick=function(){
         var is_par = getTablePartitionType();
         var dtstr = ',dt'
         var yesterday='and dt='+getDate(1);
         if(is_par == 0){
            yesterday ='';
            dtstr='';
         }
         var cm = getCm();
         var tableName =getTableName();
         var tableCols = getColsName();
         var colInfo = getColInfo(tableCols);
         var discommaInfo = colInfo.dis=='' ? '' : ',';
         var sumcommaInfo = colInfo.sum=='' ? '' : ',';
         var finalSql="select 1 "+ dtstr +",'online' as type, count(*) count_num "+ sumcommaInfo +colInfo.sum +discommaInfo+colInfo.dis +" from "+tableName +" where (1=1)  "+yesterday+" group by 1"+ dtstr;
         cm.setValue(finalSql);
         buautify();
     }
     return selectAllBtn;
}

//双表聚合diff
function createSelectAggrDiffBtn(){
     let selectAllBtn=document.createElement("button");
     selectAllBtn.innerText="双表聚合diff";
     selectAllBtn.className="biPlus"
     selectAllBtn.onclick=function(){
         var is_par = getTablePartitionType();
         var dtstr = ',dt'
         var yesterday='and dt='+getDate(1);
         if(is_par == 0){
            yesterday ='';
            dtstr='';
         }
         var cm = getCm();
         var tableName =getTableName();
         var diffTabeName = getDiffTableName(tableName);
         var tableCols = getColsName();
         var colInfo = getColInfo(tableCols);
         var discommaInfo = colInfo.dis=='' ? '' : ',';
          var sumcommaInfo = colInfo.sum=='' ? '' : ',';
         var online ="select 1 "+ dtstr +", 'online' as type, count(*) count_num " + sumcommaInfo +colInfo.sum +discommaInfo+colInfo.dis +" from "+tableName +" where (1=1)  "+yesterday +" group by 1"+ dtstr;
         var test   ="select 1 "+ dtstr +", 'test' as type, count(*) count_num  " + sumcommaInfo +colInfo.sum +discommaInfo+colInfo.dis +" from "+diffTabeName +" where (1=1)   "+yesterday +" group by 1"+ dtstr;
         //var finalSql="select 'online' as type, " +colInfo.sum +commaInfo+colInfo.dis +" from "+tableName +" where dt ="+yesterday + " union all    select 'test' as type," +colInfo.sum +commaInfo+colInfo.dis +" from "+diffTabeName +" where dt ="+yesterday;
         var finalSql= online +" union all "+test;
         cm.setValue(finalSql);
         buautify();
     }
     return selectAllBtn;
}

//双表无diff
function createAllDiffBtn(){
     let selectAllBtn=document.createElement("button");
     selectAllBtn.innerText="双表无diff";
     selectAllBtn.className="biPlus"
     selectAllBtn.onclick=function(){
         var is_par = getTablePartitionType();
         var yesterday='and dt='+getDate(1);
         if(is_par == 0){
            yesterday ='';
         }

         var cm = getCm();
         var tableName =getTableName();
         var diffTabeName = getDiffTableName(tableName);
         var tableCols = getColsName();
         var joinCols = tableCols.join(",")
         var finalSql="select "+tableCols.join(",") +", COUNT(*) num FROM (select " +tableCols.join(",") +" from "+tableName +" where (1=1)  "+yesterday+" union all   select " +tableCols.join(",") +" from "+diffTabeName +" where (1=1)  "+yesterday +" )tmp GROUP BY " + tableCols.join(",") + " HAVING COUNT(*) !=2";
         // var beautifulSql=vkbeautify.sql(finalSql);
         cm.setValue(finalSql);
         buautify();
     }
     return selectAllBtn;
}

//去探数执行
function createRunInXtEdit(){
     let toXtEditBtn=document.createElement("button");
     toXtEditBtn.className="biPlus"
     toXtEditBtn.innerText="去探数执行";
     toXtEditBtn.onclick=function(){
         var cm = getCm();
         var curSql = cm.getValue();
         GM_setValue("sqlText",curSql)
         window.open("https://data.sankuai.com/wanxiang#/xt/edit/");
     }

     return toXtEditBtn;
}