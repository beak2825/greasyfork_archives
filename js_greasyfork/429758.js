// ==UserScript==
// @name            超星泛雅平台学习通批量评分
// @namespace       moe.canfire.flf
// @version         1.0.0
// @description     超星泛雅平台学习通批量改作业
// @author          mengzonefire
// @license         MIT
// @compatible      firefox Tampermonkey
// @compatible      firefox Violentmonkey
// @compatible      chrome Violentmonkey
// @compatible      chrome Tampermonkey
// @contributionURL https://afdian.net/@mengzonefire
// @match           *://mooc1-1.chaoxing.com/work/*

// @resource jquery         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @resource sweetalert2Css https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @require         https://cdn.jsdelivr.net/npm/js-base64
// @require         https://cdn.staticfile.org/spark-md5/3.0.0/spark-md5.min.js
// @require         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/429758/%E8%B6%85%E6%98%9F%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E9%87%8F%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/429758/%E8%B6%85%E6%98%9F%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E9%87%8F%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==
"use strict";
var url=window.location.href;

window.setAllScore=function(){
//// alert(localStorage.jkscore);
//加编号
 $("tr").find("input[type='checkbox']").each(function(idx){ $(this).before((idx+1)+'、');});

//进入批量打分，自动选中所有已交且待批的人员，并随机打分85+1~3
var jobs=$("tr:contains('待批')");
$(jobs).find("input[type='checkbox']").attr("checked",'true');
$(jobs).find("input[type='text']").each(function(){
	if(localStorage.jkscore==88){
	    $(this).attr("value",85+Math.ceil(Math.random()*3));
	}else if(localStorage.jkscore==90){ $(this).attr("value",90); }
	else{ $(this).attr("value",85);  }
});
  toBatchUpdateScore();//保存得分
}//

function tryaddLinks(){
 if(url.match(/getAllWork/g) ){
     $("a:contains('查看')").each(function(){
       var href=$(this).attr("href");
       href=href.replace("reviewTheList","batchMarkingScore");
       $(this).after('<a  href="'+href+'"><span style="border:1px solid red">打分</span></a>');
     });
  }
}
//////////////////////////////////////////
 
$(function(){
 ///   alert(url);
 if( url.match(/reviewTheList/g) ){
     //从查看作业，跳到批量评分
    var btn=$("#RightCon > div > div.ZuoYe > div.CyTop1 > div > ul > li.on");
    $(btn).after('<li style="border:2px solid red;" onclick="localStorage.jkscore =85;$(\'#wraptip > a:nth-child(1) > span\').click();">批量打85分</li>');
    $(btn).after('<li style="border:2px solid red;" onclick="localStorage.jkscore =90;$(\'#wraptip > a:nth-child(1) > span\').click();">批量打90分</li>');
    $(btn).after('<li style="border:2px solid red;" onclick="localStorage.jkscore =88;$(\'#wraptip > a:nth-child(1) > span\').click();">随机打85-88分</li>');

 }
  // tryaddLinks(); 必须要通批量打分 按钮进入才行；
 if(url.match(/batchMarkingScore/g) ){
   $("#pageCount").html("<option value=\"600\">600</option><option value=\"500\">500</option><option value=\"1000\">1000</option>");
   $("#pageCount").val("1000");
    searchWorkAnswerListBy();
    setTimeout( setAllScore ,2000);//关键之处，"xx()" 调用不到全局函数；使用非字符串，无括号；
  }
});

