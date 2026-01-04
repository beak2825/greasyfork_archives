// ==UserScript==
// @name         小说侠辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  小说侠自动打开他人空间
// @author       xia

// @match        https://www.xiaoshuoxia.net/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_notification

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/450334/%E5%B0%8F%E8%AF%B4%E4%BE%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/450334/%E5%B0%8F%E8%AF%B4%E4%BE%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
// @require      file:///E:\work\project_2021\继续教育\油猴脚本\武汉理工大学继续教育学院\goeduscript\src\xiaoshuoxia.js

(function () {
    'use strict';

let baseUrl = "https://www.xiaoshuoxia.net/" ;
let optBtn = `
    <div id='optBtn'>
        <div>
            <button id='openAll'>快速打开他人空间</button><br/>
        </div>
        <div id='result'></div>
    </div>    
    `; 

setTimeout(function (){
    main();
}, 100);


function main(){
//============================================================

console.log(" ===== hello world 小说侠 ==== ");
$('.wp.cl').append(optBtn);

$("#openAll").click(function(){
    console.log("openAll ...")
    let urls = [] ;
    getUrls(urls);
    console.log("urls", urls)
    $.each(urls, function(i,o){
        console.log("url", o);
        window.open(o, "_blank");
    })
    // $("#optBtn #result").append("open is finish").append("")
})

$("#next").click(function(){
    console.log("click next...")
    $('#J_list_detail tbody tr:last td div.pg .nxt').trigger("click");
})


let removeLastUrl = function(urls){
    let nextPageUrl = urls[urls.length-1]
    urls.splice(urls.length-1, 1)
    window.open(nextPageUrl,"_self");
    sleep(500)
}

let getUrls = function(urls){
    let trArr = $('#J_list_detail tbody tr:gt(0)');
    console.log(trArr.length)
    $(trArr).each(function(index){
        let href = $(this).find("div a").attr("href");
        urls.push(baseUrl+href)
    }) 
    sleep(100)
    let nextPageUrl = urls[urls.length-1]
    urls.splice(urls.length-1, 1)
}


function toClick(){
    $('#content .layout-page-main .layout-page-main-inner footer button').click()
}

console.log("=====End====");

function sleep(delay) {
    for(var t = Date.now(); Date.now() - t <= delay;);
}

function isEmpty(val){
    if(val==undefined || val == null || val == ""){
        return true ;
    }
    return false ;
}


Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
     if (index > -1) {
          this.splice(index, 1);
        }
 };




// .exams-topnav {
//     display:none;
// }

GM_addStyle(` 

#optBtn {
    background-color:#f54949;
    top:200px;
    right:40px;
    position:fixed;
    z-index:100000;
    line-height: 20px;
    padding: 5px;
    font-size:13px;
}
.hide {
    display:none
}


#yh_div_new2 {
    background-color:#dbd990;
    top:200px;
    right:60px;
    position:fixed;
    z-index:100000;
}

#doLogin {
    background-color:#f3f3f3;
}

.tiku{
    line-height: 40px;
    padding-left: 30%;
    color: #f20b3687;
    font-size: 20px;
    font-weight: bold;
    background-color: #dff0d8;
}
.youhui{
    line-height:40px;	
	padding-left:30%;	
	color:#00b8d0;
    font-size:15px;
    background-color: #dff0d8;
}

.notiku{
    line-height:40px;	
	padding-left:30%;	
	color:red;
    font-size:20px;
}

#timeOp>input{
    disabled:false;
    color:red; 
    font-size:15px;
    width:200px;
    height: 40px;
}

#zuoyeOp>input {
    disabled:false;
    color:red; 
    font-size:15px;
    width:200px;
    height: 40px;

}

.jinyong{
    disabled:disabled;
    color:#aca3a3;
    font-size:15px;
}

.red{
    color:red; 
}

.huihui{
    background-color:#aca3a3;
}

.hide{
    display:none;
}

`)

/**
 * 这里写css 文件
 */
function createCss(){
var globalCss = heredoc(function(){/*
    
.exams-topnav {
    display:none;
}
#yh_div_new {
    background-color:#dbd990;
    top:200px;
    right:60px;
    position:fixed;
    z-index:100000;
    
}
#yh_btn1, #yh_btn2, #yh_btn3, #yh_btn4 {
    disabled:false;
    color:red; 
    font-size:15px;
}

.red{
    color:red; 
}

*/});
return globalCss ;
}


function getCookie(cookieName){  
    var cookieValue="";  
    if (document.cookie && document.cookie != '') {   
        var cookies = document.cookie.split(';'); 
        console.log("cookies:",cookies);
        for (var i = 0; i < cookies.length; i++) {   
             var cookie = cookies[i].trim();
             if (cookie.substring(0, cookieName.length + 1).trim() == cookieName.trim() + "=") {  
                   cookieValue = cookie.substring(cookieName.length + 1, cookie.length);
                   break;  
             }  
         }  
    }   
    return cookieValue;  
} 


// 生成随机数
function random(min,max){
    let n = Math.random()*(max-min+1)+min;
    if(n>30){
        return 30 ;
    }
    return n;
}


 //获取url中的参数
 function queryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


String.prototype.startWith=function(str){     
    var reg=new RegExp("^"+str);     
    return reg.test(this);        
  } 
   
String.prototype.endWith=function(str){     
var reg=new RegExp(str+"$");     
return reg.test(this);        
}


String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
             }
          }
       }
   }
   return result;
}


// =================================================================
// 这里是结束符
}


})();
