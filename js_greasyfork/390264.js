// ==UserScript==
// @name         leetcode copy testcase
// @namespace   https://leetcode-cn.com/
// @version      0.144
// @description  leetcode自动将测试用例转化为sql语句
// @author       LiMingYu
// @match      https://leetcode-cn.com/submissions/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390264/leetcode%20copy%20testcase.user.js
// @updateURL https://update.greasyfork.org/scripts/390264/leetcode%20copy%20testcase.meta.js
// ==/UserScript==
//获取表的对象集合信息
var creattable="";
var sql=""
var deltable=""
var tableinfos=JSON.parse(pageData.submissionData.input).headers
//得到插入的行信息
var tablerows=JSON.parse(pageData.submissionData.input).rows
//获得表名,字段名
for(var name in tableinfos){
    //得到列头
         var list=new Array();
      for(var k=0;k<tableinfos[name].length;k++)
      {

           list.push(tableinfos[name][k]+" varchar(200)")
      }

      creattable+='CREATE TABLE IF NOT EXISTS '+name+'('+list.join(",")+')'+';\n';
      deltable+='DROP TABLE if EXISTS '+name+';\n';
}
//处理数据

      for(var row in tablerows)
     {

        for(var i=0;i<tablerows[row].length;i++)
         {
              for(var j=0;j<tablerows[row][i].length;j++)
              {
                   if(tablerows[row][i][j]==null)
                       tablerows[row][i][j]="a"
                  tablerows[row][i][j]='"'+tablerows[row][i][j]+'"'
              }

        }
         
         for(var m=0;m<tablerows[row].length;m++)
         {
             var str=tablerows[row][m].toString();
              sql+='INSERT INTO'+' '+row+ ' VALUES ('+str.replace(new RegExp("a","g"),"null")+')'+';\n';
         }
    }

//添加到页面上
$("#details-summary").append('<input type="button" value="复制" id="copy" class="btn btn-primary" ><input type="button" value="隐藏" id="watch" style="margin-left:10px" class="btn btn-primary" > <textarea style="margin-top:10px;height:200px;display:block" id="sql" value="" " class="form-control"></textarea>')
$("#sql").val(deltable+creattable+sql)
//添加滑动及其处理
$("#watch").click(
 function(){
     if($("#watch").val()=="查看")
     {
          $('#sql').css("display","block")
        $("#watch").val("隐藏")
     }
     else
      {
          $('#sql').css("display","none")
           $("#watch").val("查看")

      }
 })

$("#copy").click(
 function(){
      var urlresult=document.getElementById("sql")
    urlresult.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
 }

)
