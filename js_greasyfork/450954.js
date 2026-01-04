// ==UserScript==
// @name     全国企业员工全面质量管理知识竞赛
// @version  3
// @description   可学习并答题(试卷提交前学习) 网址  http://tqm.caq.org.cn/trainManager/compete/publish/compete_notice.jsp
// @author       NianJiTao 925007694
// @grant    none
// @include      http://tqm.caq.org.cn:8080/trainManager/*
// @include      http://tqm.caq.org.cn/trainManager/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @namespace 质量管理知识竞赛
// @downloadURL https://update.greasyfork.org/scripts/450954/%E5%85%A8%E5%9B%BD%E4%BC%81%E4%B8%9A%E5%91%98%E5%B7%A5%E5%85%A8%E9%9D%A2%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/450954/%E5%85%A8%E5%9B%BD%E4%BC%81%E4%B8%9A%E5%91%98%E5%B7%A5%E5%85%A8%E9%9D%A2%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.meta.js
// ==/UserScript==
 (function () {
  'use strict';

var caiurl = /publish/i;
var caiurl2 = /loginAnswer/i;

var caix = 0;
var url = window.location.href;

var Btn学习 = '<button id="Btn学习">学习</button>';
var Btn答题 = '<button id="Btn答题">答题</button>';
var Btn清除记忆 = '<button id="Btn清除记忆" >清除记忆</button>';
var label提示1 = '<td width="100px">已学习: <a id="学习数量1"></a></td><td width="100px">已答题: <a id="答题数量1"></a></td>';
 
 
var Text显示框 = '<div><textarea id="Text显示框"> </textarea></div>';
var Btn显示答案 = '<button id="Btn显示答案" >显示答案</button>';
var Text输入框 = '<div><textarea id="Text输入框"> </textarea></div>';
var Btn导入答案 = '<button id="Btn导入答案" >导入答案</button>';
var Btn调整高度 = '<button id="Btn调整高度" >调整高度</button>';
var pp = '<p></p>';
var table1 ='<table border="1">  <tr> <th><button id="Btn导入答案" >导入答案</button></th>    <td><div><textarea id="Text输入框"> </textarea></div></td> </tr>      <tr> <th><button id="Btn显示答案" >显示答案</button></th>    <td><div><textarea id="Text显示框"> </textarea></div></td>  </tr>  </table>';
  
  
var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  //哈希算法,存储题目
function hash3(input){var hash=5381;var i=input.length-1;if(typeof input=='string'){for(;i>-1;i--)hash+=(hash<<5)+input.charCodeAt(i)}else{for(;i>-1;i--)hash+=(hash<<5)+input[i]}var value=hash&2147483647;var retValue='';do{retValue+=I64BIT_TABLE[value&63]}while(value>>=6);return retValue}

  //保存答案
function save2(name,value2){if(window.localStorage){localStorage.setItem(name,value2)}else{$.cookie(name,value2,3)}}
 
  //读取答案
function read2(name){var m2='';if(window.localStorage){if(localStorage.hasOwnProperty(name)){m2=localStorage.getItem(name)}}else{m2=$.cookie(name)}return m2}
  
  //读取所有答案
function readAll(){var m2='';var storage=window.localStorage;var len=0;for(var i=0,len=storage.length;i<len;i++){var key=storage.key(i);var value=storage.getItem(key);m2=m2+key+":"+value+";"}return m2}
  
  
  //美化格式
function css2(name){name.css({'width':'200px','border':'solid 1px #0076a3', 'border-radius':'4px', 'font-size':'30px','margin':'5 5px', 'padding':'2 5px','color':'red','cursor':'pointer','text-decoration':'none'})}

function css5(name){name.css({'overflow':'scroll'})}
 
   
   
  //在考试页面添加 答题 ,答案导入导出按钮

 if (caiurl.test(url)) {
   var title =  $(document.body); 
  //  var title = $("#mainFrame").contents().find("#showNotAnswer");
  // var title = $("#showNotAnswer");
    if (title.length !== 0) {      
       
       title.overflow = "scroll";  //显示滚动条
       title.prepend(label提示1).prepend(Btn调整高度).prepend(Btn清除记忆).prepend(Btn答题).prepend(Btn学习);   //.prepend(pp)
       css2($('#Btn学习'));
       css2($('#Btn答题'));
       css2($('#Btn清除记忆'));  
       css2($('#Btn调整高度'));
        //title.prepend(Btn导入答案).prepend(Text输入框).prepend(Btn显示答案).prepend(Text显示框).prepend(pp).prepend(table1) ;
       title.prepend(table1) ;
       css2($('#Btn导入答案'));
       css2($('#Btn显示答案'));
       
        $('#Text输入框').css({            'width': '1200px',  'height': '40px',      });
        $('#Text显示框').css({            'width': '1200px',  'height': '40px',      });
         css5(title);     
    }
   
   
    document.getElementById('Text显示框').value = "答题页输入正确答案交卷前点学习,然后再用答题.学习后的答案可以导出,导入.上面输入框已放入部分答案,可以点导入";     
   
   //2022年部分答案
    document.getElementById('Text输入框').value = "WSusgB:ACD;1hEx0B:C;9gOQ9:D;jHE1ZB:D;xQQji:B;dzi0MB:B;CB9W7B:B;rQP16:B;lfM8m:A;jrGXundefined:B;uY3De:B;zUzFW:A;c2trr:D;eJzobB:D;mRundefined54B:A;AzKHO:AC;KqUAu:ABCD;S2xundefinednB:D;vpgNI:C;YU5iundefinedB:A;PWjYs:BCDE;jNUwlB:D;UjpO4:D;WWTWlB:B;MTizBB:ABD;aS9Yn:D;SkARN:D;tDXmbB:D;tQGZ3:CDE;l6f5Z:C;ohnqSB:D;Cgtws:ABCD;3f9dfB:D;pp0SO:D;jhe9nB:D;DfCcUB:A;wTSiL:A;SCisBB:BCDE;Eic2q:BCE;xAPcundefinedB:A;EuVX8:B;kjpEP:A;fP6UundefinedB:C;sSISS:D;NUxQl:BCDE;21vGy:D;dba8d:D;tundefinedrSpB:C;oqg26B:A;c6Cwr:C;EDKAsB:B;5ymzbB:B;ZEt37B:B;NWiD7B:D;pVGEaB:ABC;TzbLK:D;JvrVV:ABD;4RCmf:C;CfdANB:ABDE;XundefinedTZE:ABDE;CLtXuB:B;5o72QB:D;LQw2F:ACD;VRW4XB:A;Mf2undefinedUB:ACDE;6BCmrB:C;FSTIgB:BCDE;OundefinedYDpB:BCD;9undefinedtRc:ACE;I4JfDB:ABCE;LqEuBB:D;FXxlDB:ABCE;J6cKE:B;mHundefinedC8B:D;3IcGundefinedB:D;KzYxQB:A;KV3Hh:D;hwXIK:AD;6wWSZB:A;NPvtuB:ABC;RT6MiB:BCDE;Wo6GK:D;";  
}   
  
 
 
  //清除记忆答案

$('#Btn清除记忆').on('click',function(){localStorage.clear()});
 
    
  //知识竞赛答题
  $('#Btn答题').on('click', function () {
    var x = 0;
//    var test = $('#singleSelect').children();  
    
     var test = $("#mainFrame").contents().find("#singleSelect").children();
     test.each(function () {
      var s10 = $(this).find('.content_style').text().replace(/[^\u4e00-\u9fa5]+/g, '');
      var s12 = hash3(s10);
      var m2 = read2(s12);
      var y3 = 9;
      if (m2 == 'A') {        y3 = 0      }
      if (m2 == 'B') {        y3 = 1      }
      if (m2 == 'C') {        y3 = 2      }
      if (m2 == 'D') {        y3 = 3      }
      if (m2 == 'E') {        y3 = 4      }
      if (m2 == 'F') {        y3 = 5      }
      if (m2 == 'G') {        y3 = 6      }
      if (y3 < 9) {
        $(this).find('[type=\'radio\']').eq(y3).attr('checked', true);
        x = x + 1;
      }
    })
   // var test2 = $('#multipleSelect').children();
    var test2 = $("#mainFrame").contents().find("#multipleSelect").children();
    test2.each(function () {
      var s10 = $(this).find('.content_style').text().replace(/[^\u4e00-\u9fa5]+/g, '');
      var s12 = hash3(s10);
      var m2 = '';
      m2 = read2(s12);
      //  document.getElementById('答题数量1').innerHTML  += m2;
      var y3 = 9;
      if (m2.length !== 0) {
        if (m2.indexOf('A') >= 0) {          $(this).find('[type=\'checkbox\']').eq(0).attr('checked', true);        }
        else        { $(this).find('[type=\'checkbox\']').eq(0).attr('checked', false); }
        if (m2.indexOf('B') >= 0) {          $(this).find('[type=\'checkbox\']').eq(1).attr('checked', true);        }
        else        { $(this).find('[type=\'checkbox\']').eq(1).attr('checked', false); }
        if (m2.indexOf('C') >= 0) {          $(this).find('[type=\'checkbox\']').eq(2).attr('checked', true);        }
        else        { $(this).find('[type=\'checkbox\']').eq(2).attr('checked', false); }
        if (m2.indexOf('D') >= 0) {          $(this).find('[type=\'checkbox\']').eq(3).attr('checked', true);        }
        else        { $(this).find('[type=\'checkbox\']').eq(3).attr('checked', false); }
        if (m2.indexOf('E') >= 0) {          $(this).find('[type=\'checkbox\']').eq(4).attr('checked', true);        }
        else        { $(this).find('[type=\'checkbox\']').eq(4).attr('checked', false); }
         if (m2.indexOf('F') >= 0) {          $(this).find('[type=\'checkbox\']').eq(5).attr('checked', true);       }
        else        { $(this).find('[type=\'checkbox\']').eq(5).attr('checked', false); }
         if (m2.indexOf('G') >= 0) {          $(this).find('[type=\'checkbox\']').eq(6).attr('checked', true);       }
        else        { $(this).find('[type=\'checkbox\']').eq(6).attr('checked', false); }
      }
      if (y3 < 9) {        x = x + 1;      }
    })
    document.getElementById('答题数量1').innerHTML = x;
  });
 
  
  //知识竞赛学习
  $('#Btn学习').on('click', function () {
    var x = 0;
   // var test = $('#singleSelect').children();
    var test = $("#mainFrame").contents().find("#singleSelect").children();
    test.each(function () {
      var s10 = $(this).find('.content_style').text().replace(/[^\u4e00-\u9fa5]+/g, '');
      var s12 = hash3(s10);
      var s13 = $(this).find('[type=\'radio\']');
      if (s13.eq(0).attr('checked'))      {        x = x + 1;        save2(s12, 'A');      }
      if (s13.eq(1).attr('checked'))      {        x = x + 1;        save2(s12, 'B');      }
      if (s13.eq(2).attr('checked'))      {        x = x + 1;        save2(s12, 'C');      }
      if (s13.eq(3).attr('checked'))      {        x = x + 1;        save2(s12, 'D');      }
    })
 //   var test2 = $('#multipleSelect').children();
     var test2 = $("#mainFrame").contents().find("#multipleSelect").children();
    test2.each(function () {
      var s10 = $(this).find('.content_style').text().replace(/[^\u4e00-\u9fa5]+/g, '');
      var s12 = hash3(s10);
      var m2 = '';
      var s13 = $(this).find('[type=\'checkbox\']');
      if (s13.eq(0).attr('checked'))         {             m2 += 'A';          }
      if (s13.eq(1).attr('checked'))         {             m2 += 'B';          }
      if (s13.eq(2).attr('checked'))         {             m2 += 'C';          }
      if (s13.eq(3).attr('checked'))         {             m2 += 'D';          }      
      if (s13.eq(4).attr('checked'))         {             m2 += 'E';          }
      if (s13.eq(5).attr('checked'))         {             m2 += 'F';          }
      if (s13.eq(6).attr('checked'))         {             m2 += 'G';          }
      if (m2.length !== 0)       {            x = x + 1;                save2(s12, m2);          }
    })
    document.getElementById('学习数量1').innerHTML = x;
    
 //  var test3 = $('.trainExamName') ;
 //     document.getElementById('学习数量1').innerHTML = test3.text();
    
  });
  
   
  //显示竞赛学习答案
  $('#Btn显示答案').on('click', function () {     document.getElementById('Text显示框').value = readAll();  });
 
  
  //导入竞赛学习答案
  $('#Btn导入答案').on('click', function () {
    var str = document.getElementById('Text输入框').value;
    var strs = new Array(); //定义一数组
    var strs2 = new Array();
    strs = str.split(';'); //字符分割
    var i = 0;
    var n = 0;
   
    for (i = 0; i < strs.length; i++)
    {
      var k = strs[i];
      strs2 = k.split(':');
      if (strs2.length === 2)
      {
        var read3 = read2(strs2[0]);
        if (read3 !== strs2[1])        {          n += 1;          save2(strs2[0], strs2[1]);        }
      }
    }
    var text = '导入:' + strs.length + ' 新:' + n;
    window.alert(text);
  });
 
  
  //Btn调整高度
  $('#Btn调整高度').on('click', function () {        
     css5($(document.body));     
  });

  
  
}) ();