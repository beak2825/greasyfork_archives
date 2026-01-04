// ==UserScript==
// @name        中色科技视频快进
// @namespace   xcg
// @version     7
// @grant       none
// @description   可快速看完中色Oa内的视频  可学习并答题(模拟试卷提交后可以学习),考试页面--右键--此框架--新建框架打开
// @author       NianJiTao 年纪涛

 
// @match       *://192.1.1.86/*DocData.aspx*
// @match       *://192.1.1.86/*Video.aspx*
// @match       *://192.1.1.86/*VideoList.aspx*
// @match       *://192.1.1.86/*VideoData.aspx*
// @match       *://192.1.1.86/*/Answer/answerlist.aspx*
// @match       *://192.1.1.86/*/Answer/*.aspx*
// @match       *://192.1.1.86/*/Answer/Formal.aspx*
// @match       *://192.1.1.86/QYGLSEtestpaper/Main/Main.aspx
 
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32371/%E4%B8%AD%E8%89%B2%E7%A7%91%E6%8A%80%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/32371/%E4%B8%AD%E8%89%B2%E7%A7%91%E6%8A%80%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.meta.js
// ==/UserScript==
(function () {
  'use strict';
var video = /Video.aspx/i;
var 文档列表页 = /DocData.aspx/i;  
var VideoList = /VideoList.aspx/i;
var 视频列表页 = /VideoData.aspx/i;
var 模拟答案页 = /answerlist.aspx/i; 
var 模拟考试页 = /Practice.aspx/i; 
var 正式考试页面 = /Fpaper.aspx/i;
var loginAnswer = /loginAnswer/i;
var 主框架页 = /Main.aspx/i;
 
  
var caix = 0;
var url = window.location.href;
  
//  var Btn答题 = '<button id="Btn答题">答题</button>';  
 //var Btn学习 = '<button id="Btn学习">学习</button>';
//var Btn清除记忆 = '<button id="Btn清除记忆">清除记忆</button>';
  
    var Btn答题 = '<a id="Btn答题" style="cursor:pointer;text-decoration:none;color:red;padding:2 5px;border:1px solid red;">答题</a>';
  var Btn学习 = '<a id="Btn学习" style="cursor:pointer;text-decoration:none;color:red;padding:2 5px;border:1px solid red;">学习答案</a>';
  var Btn清除记忆 = '<a id="Btn清除记忆" style="cursor:pointer;text-decoration:none;color:red;padding:2 5px;border:1px solid red;">清除记忆</a>';

  var Btn全部下载 = '<button id="Btn全部下载">全部下载</button>';
  
var Btn全部打开 = '<button id="Btn全部打开">全部打开</button>';
var Btn全部快进 = '<button id="Btn全部快进">全部快进</button>';
var Btn快进 = '<button id="Btn快进">快进</button>';
var Btn一键看完 = '<button id="Btn一键看完" >一键看完</button>';
 
var Btn提示 = '<td>已学习: <a id="学习数量1"></a></td></td>';
var Btn答题数量1 = '<font face="宋体" size="4">已答题: <a id="答题数量1"></a></font></td>';

var Text显示框 = '<div><textarea id="Text显示框"> </textarea></div>';
var Text输入框 = '<div><textarea id="Text输入框"> </textarea></div>';
var Btn显示答案 = '<button id="Btn显示答案">显示答案</button>';
var Btn导入答案 = '<button id="Btn导入答案">导入答案</button>';
var Btn导入提示 = '<td><font color="Red" size="6"> <span id="Btn导入提示"></span></font> </td>';

var Btn交卷 = '<button id="Btn交卷">交卷</button>';
  
var pp = '<p></p>';
  
  
 var Btn框架提示 = '<span ><b><font color="Red" size="6">请在考试页--右键--此框架--新建标签页打开框架--在新的页面可以看到答题按钮--先模拟考,再正式考</font></b></span>';

var 答案2022 ='obGgT:D;BRW7cB:D;obGgT:D;Md2Ko:B;xU7R9:C;nwLy7B:D;c0vSEB:B;qqPrC:A;nna6EB:A;VWAzIB:D;DiAAuB:C;GBCWundefinedB:A;5zmDC:A;omngw:C;nNlInB:A;4ahg2B:B;NBFk9B:A;jk5HundefinedB:C;tundefinedhpy:B;b8pJiB:C;3WGClB:D;8BcD0:C;Omn8wB:D;8v74undefined:A;b3aex:B;bg99zB:D;BjsLE:A;DJGGMB:A;4bPYk:B;UzFMd:B;SpteEB:A;SVxge:A;7KpgNB:A;mBO5RB:A;LH3yUB:A;rFYsundefinedB:D;6YgeF:B;9831undefinedB:A;52fwC:B;tiundefinedxE:A;udQasB:D;dbtXN:A;yGhfx:A;2sDCUB:A;kJswB:B;z9bGAB:B;ObT2:B;I08pBB:C;fLm5W:C;gvJIIB:B;TyNmuB:B;Rmkja:A;dWb41:C;XdpqDB:C;ZGJrg:B;6cIy7:A;2Xsbundefined:D;RDKBEB:A;jLRSB:B;gxYqK:A;Tfzp8B:A;O77undefined8B:A;mqyIr:A;bTFv9:D;gl5L6B:A;FbuIcB:A;pqhsAB:B;M36uBB:A;Us5WNB:B;JwQfundefined:B;7OidundefinedB:B;A7Ymk:D;NYV9M:A;dVBv7B:A;SR5fu:A;C46I3B:B;EcundefinedEq:A;IIBI3:B;5rRSz:D;E2hDaB:A;AEfFXB:A;0XDT6:A;PaZXEB:A;RgO8i:C;BRW7cB:D;UMKAM:D;AQRxJB:B;HPULbB:A;LQa7UB:A;u7rmP:A;3gn1J:A;iyo2eB:D;u6dCm:B;89HIzB:A;RF9p4:A;il0BsB:A;g479P:C;1FdXgB:A;BFMgoB:A;uHz5l:A;3dCAR:B;qcsUYB:A;3undefinedfiwB:A;s34JJ:B;jJIs2B:C;xMWgeB:A;IPR6G:A;iCuZLB:A;DN1undefinedPB:A;NSlLBB:B;WApAqB:C;obGgT:D;bfObNB:D;nbqzEB:D;BN05m:D;5JdizB:B;qdFhm:A;yYe0U:A;SQyundefined2:A;gXsb4B:A;EYA3lB:A;Vy84DB:B;kI72P:A;OEIjqB:B;7JdnD:B;EE69l:B;rW80c:A;olWowB:A;n1undefinedAMB:B;HJWv:B;X0UNK:A;TGRyT:C;gsC5undefined:A;ZPHa5:D;oKd92B:D;pKQundefinedP:B;XiX2h:A;PqFOLB:A;AL119B:B;x3WeUB:C;P4dlundefined:A;MY5NBB:C;5xBu7:D;8BBXSB:A;vSJ72B:C;1xE2undefinedB:A;NgTQf:A;3Khyf:A;zyO7x:C;9XUtGB:A;tURmzB:A;74e2AB:A;NgFYy:C;fn8EmB:B;YjAGV:A;UsIdb:A;BA3il:B;O0voxB:D;GWvlPB:C;c1yZbB:D;qofz1:B;ouXSrB:B;otpBUB:A;W8xqQB:D;NvUXBB:A;qeIGCB:A;lvxspB:A;LbNIi:A;CknPL:B;IBtsXB:C;SPsNM:A;tusDg:A;CviRY:B;5P5ze:B;pvuvoB:C;jO4fAB:B;Lpqvu:B;iuHO1B:D;Y9gLQ:A;d0CTW:A;vundefinedO0E:A;8u2n8B:A;RundefinedTIJB:C;ej0L7:A;6XBWTB:A;xundefinedYWTB:C;rwYtG:A;WaoundefinedjB:A;qsWsi:C;2kXqb:B;Yt2DBB:D;SMdk6:B;10ZBW:C;6922F:C;Cq4QG:A;nDtQ4B:A;AYhVdB:C;YT1Cy:A;wPdsSB:A;EpRD3B:B;CvezjB:A;aMFZm:C;yAvUI:B;M6g2NB:B;AQWRD:B;KKslS:A;3ZJNBB:B;0undefinedundefined1eB:A;ZimwK:A;EgXyV:A;auAxq:D;DY8bE:A;MjNN:A;ZundefinedGDcB:B;ZPgbkB:B;dfSOMB:C;fHtPW:A;Xqi73B:A;tsDundefinedcB:C;xk9o4B:A;N9yHh:A;eE78W:A;3HlkundefinedB:B;0hiPHB:C;CcWgy:D;Elpe3B:A;Fnt40:A;NC7CM:C;exIQW:B;SIyRAB:C;7xULJB:A;62z3UB:A;gqundefinedmzB:A;LATvUB:C;CFAU7:A;Pt1R6:A;mqeIr:B;ulRQt:B;3undefinedEt2B:B;mVpDw:D;OXOdF:C;';
  
var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  //哈希算法
function 哈希算法(input){var hash=5381;var i=input.length-1;if(typeof input=='string'){for(;i>-1;i--)hash+=(hash<<5)+input.charCodeAt(i)}else{for(;i>-1;i--)hash+=(hash<<5)+input[i]}var value=hash&2147483647;var retValue='';do{retValue+=I64BIT_TABLE[value&63]}while(value>>=6);return retValue}

  //保存答案
function 保存答案(name,value2){if(window.localStorage){localStorage.setItem(name,value2)}else{$.cookie(name,value2,3)}}
 
  //读取答案
function 读取答案(name){var m2='';if(window.localStorage){if(localStorage.hasOwnProperty(name)){m2=localStorage.getItem(name)}}else{m2=$.cookie(name)}return m2}
  
  //读取所有答案
function 读取所有答案(){var m2='';var storage=window.localStorage;var len=0;for(var i=0,len=storage.length;i<len;i++){var key=storage.key(i);var value=storage.getItem(key);m2=m2+key+":"+value+";"}return m2}

 
function 读取答案数量(){var storage = window.localStorage;return storage.length}
 
  
function 全部打开() {
     var 超链接 = $('.Grid').find('a');
    超链接.each(function() {
        var 新开页面 = $(this).attr('href');
        window.open(新开页面)
    })
}
  
function 全部快进() {
    var 超链接 = $('.Grid').find('a');
    超链接.each(function() {
        var 新开页面 = $(this).attr('href').replace(/video/i, 'SetFinish');
        window.open(新开页面)
    })
}


   
    
  function 导入答案2022() {
   var str = 答案2022;
    var strs = new Array();
    var strs2 = new Array();
    strs = str.split(';');
    var i = 0;
    var n = 0;
    for (i = 0; i < strs.length; i++) {
        var k = strs[i];
        strs2 = k.split(':');
        if (strs2.length === 2) {
            var read3 = 读取答案(strs2[0]);
            if (read3 !== strs2[1]) {
                n += 1;保存答案 (strs2[0], strs2[1])
            }
        }
    }
    var text = '导入答案:' + strs.length ;    
   // document.getElementById('Text显示框').value = text;    
     document.getElementById('Btn导入提示').innerHTML = text
    } 
  
 
   //美化格式
function 美化按钮(name){name.css({'width':'200px','border':'solid 1px #0076a3', 'border-radius':'4px', 'font-size':'30px','margin':'5 5px', 'padding':'2 5px','color':'red','cursor':'pointer','text-decoration':'none'})}



  //在视频播放页面添加快进按钮
//  if (video.test(url)) {    var title = $('body');    if (title.length !== 0) {        title.after(Btn快进);美化按钮 ($('#Btn快进'))    }}
 
 
  
   
  
    //在文档列表页面添加 全部下载
    if (文档列表页.test(url)) {   
       var title = $('.Grid');
    if (title.length !== 0) {
      title.after(Btn全部下载).after(pp);
      美化按钮($('#Btn全部下载'));
      
    }
  } 
  
  
  
  //在视频列表页面添加全播放,全快进
  if (视频列表页.test(url)) {   
       var title = $('.Grid');
    if (title.length !== 0) {
      title.after(Btn全部快进).after(pp).after(Btn全部打开).after(pp).after(Btn一键看完);
      美化按钮($('#Btn全部打开'));
      美化按钮($('#Btn全部快进'));
      美化按钮($('#Btn一键看完'));
    }
  } 
  
  //在模拟答案页面添加学习
  if (模拟答案页.test(url)) {    
   
    var title = $('#table1').find('[id=\'HyperLink1\']');
    if (title.length !== 0) {      
       title.after(Btn提示).after(Btn清除记忆).after(Btn学习);
      美化按钮($('#Btn学习'));
      美化按钮($('#Btn清除记忆'));     
    }
  } 
  //在模拟考试页面添加 答题 ,答案导入导出按钮

 if (模拟考试页.test(url)) {
    var title =  $(document.body); 
    if (title.length !== 0) {      
        title.prepend(Btn导入提示).prepend(Btn交卷).prepend(Btn答题数量1).prepend(Btn答题);                     
        title.append(Btn导入答案).append(Text输入框).append(Btn显示答案).append(Text显示框).append(pp);
        美化按钮($('#Btn交卷'));      
	    	美化按钮($('#Btn答题'));
        美化按钮($('#Btn导入答案'));
        美化按钮($('#Btn显示答案'));
        $('#Text显示框').css({ 'width': '1600px',  'height': '80px',   });
        $('#Text输入框').css({ 'width': '1600px',  'height': '80px',   });
      
     var x= 读取答案数量();      
      if(x<9) { 导入答案2022() }      
    }
  
}
  
  //在正式考试页面添加 答题

if (正式考试页面.test(url)) {
    var title = $('#table1').find('[align=\'center\']');
    if (title.length !== 0) {
        title.append(Btn答题).append(Btn答题数量1).append(Btn交卷);
      美化按钮($('#Btn交卷'));
      美化按钮 ($('#Btn答题'))            
    }
}
 
    
  //在主框架页添加提示
if (主框架页.test(url)) {
    var title =  $(document.body); 
    if (title.length !== 0) {
        title.prepend(Btn框架提示);   
    }
}
  
   
  
  
  //清除记忆答案

$('#Btn清除记忆').on('click',function(){localStorage.clear()});
  
  //快进
$('#Btn快进').on('click',function(){var url3=url.replace(/video/i,'SetFinish');window.open(url3)});
  
  
  
  
    //全部下载
 $('#Btn全部下载').on('click',
function() {
  
      var 超链接 = $('.Grid').find('a');
    超链接.each(function() {
      
         $(this).click();
         
    })
});
  
  
  //全部打开
 $('#Btn全部打开').on('click',
function() {
    全部打开(); 
});
  
  //全部快进
 $('#Btn全部快进').on('click',function(){var test=$('.Grid').find('a');test.each(function(){var url4=$(this).attr('href').replace(/video/i,'SetFinish');window.open(url4)})});
  
  $('#Btn一键看完').on('click',
function() {        
    setTimeout(全部打开,1000);     
    setTimeout(全部快进,5000);     
    return false;
});
  
  
  //学习 
  
  $('#Btn学习').on('click',
function() {
var 已学数量 =0;
    var test = $('#DataList1').find('[id=\'table2\']');
    test.each(function() {
        var 题目 = $(this).find('span').eq(0).text().replace(/[^\u4e00-\u9fa5]+/g, '');
        var 题目答案 = $(this).find('span').eq(1).text();
        var 题目哈希 = 哈希算法(题目);
        var m2 = 读取答案(题目哈希);
        if (m2 == 题目答案) {} else {
            保存答案(题目哈希, 题目答案);
            已学数量 = 已学数量 + 1;
        }
        document.getElementById('学习数量1').innerHTML = 已学数量
    })
});
  
  //答题
  $('#Btn答题').on('click',
function() {
    var 已答数量 = 0;
    var 题目列表 = $('#DataList1').find('[id=\'table2\']');
    题目列表.each(function() {
        var 题目 = $(this).find('span').eq(0).text().replace(/[^\u4e00-\u9fa5]+/g, '');
        var 题目哈希 = 哈希算法(题目);
        var 题目答案 = 读取答案(题目哈希);
        var 按钮索引 = 9;
        if (题目答案 == 'A') {            按钮索引 = 0        };
        if (题目答案 == 'B') {            按钮索引 = 1        };
        if (题目答案 == 'C') {            按钮索引 = 2        };
        if (题目答案 == 'D') {            按钮索引 = 3        };
        if (按钮索引 < 9) {
            $(this).find('[type=\'radio\']').eq(按钮索引).attr('checked', true);
           已答数量 = 已答数量 + 1
        }
    });
    document.getElementById('答题数量1').innerHTML = 已答数量
});
  
  
  //显示模拟考试已经学习的答案
  $('#Btn显示答案').on('click',function(){document.getElementById('Text显示框').value=读取所有答案()});
  
 
  //导入模拟考试答案
$('#Btn导入答案').on('click',
function() {
    var str = document.getElementById('Text输入框').value;
    var strs = new Array();
    var strs2 = new Array();
    strs = str.split(';');
    var i = 0;
    var n = 0;
    for (i = 0; i < strs.length; i++) {
        var k = strs[i];
        strs2 = k.split(':');
        if (strs2.length === 2) {
            var read3 = 读取答案(strs2[0]);
            if (read3 !== strs2[1]) {
                n += 1;保存答案 (strs2[0], strs2[1])
            }
        }
    }
    var text = '导入:' + strs.length + ' 新:' + n;
    window.alert(text)
});
    
  
    //交卷

$('#Btn交卷').on('click',function(){
  document.getElementById('Button1').click()                                 
                                 });
  
  
  
  
}) ();
