// ==UserScript==
// @name         haidaowang Userscript
// @namespace    http://haidaowang.com/
// @version      0.32
// @description  haidaowang compare price
// @author       andy
// @match        http://haidaowang.com/product_detail*.aspx
// @match        http://www.haidaowang.com/product_detail*.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14157/haidaowang%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/14157/haidaowang%20Userscript.meta.js
// ==/UserScript==

var name = $.trim(document.getElementById("bfdBrand").innerHTML);
var isTitle = false;
if(name=="")
{
    name = $.trim(document.getElementById("bfdProductTitle").innerHTML);
    isTitle = true;  
} 
var myli =""; 
var xhrurl = 'http://172.16.29.10:8081/bj/blog';
$.ajax({
        type : "post",
        async : false,
        url :xhrurl, 
        cache : false,
    data:{"name":encodeURIComponent(name),"isTitle":isTitle},
        dataType : "jsonp",
        scriptCharset: 'utf-8',
        jsonp: "callbackparam",
        jsonpCallback:"jsonpCallback1",
        success : function(json){
                $.each(json, function(){ 
                    myli += "<li><a target='_blank' href='"+this.url+"'><font color='blue' size=4>"+this.siteName+"</font> 名称:"+this.name+"</a></li>";
                    myli += "<li>金额：<font color='red' size=4>"+this.price+"</font></li>";
                    myli += "<li><a target='_blank' href='"+this.url+"'><img src='"+this.imgUrl+"' height=200 width=200 ></a></li>";
               });
var el = document.createElement('div');
el.innerHTML = "<style type='text/css'>body {font-family: Arial, Helvetica, sans-serif;font-size: 12px;}#nav, #nav ul {list-style: none;background: #F9F9F9;font-weight: bold;padding: 0px;margin: 0px;border: solid 1px #CCCCCC;border-bottom: 0px;width: 280px;text-align: left;}#nav{position:fixed;top:10px;left:10px;width: 300px;height: 1000px;overflow: auto;border: 1px solid #000000;}#nav a {display: block;width:280px; color: #333333;text-decoration: none;text-align: center;border-bottom: solid 1px #CCCCCC;text-align: center;padding-left: 0px;}#nav a:hover{color: #336666;}#nav li {line-height: 22px;position: relative;}</style><ul id='nav'>XXXXXXXXXXXXXXXXXX</ul>".replace("XXXXXXXXXXXXXXXXXX",myli);       
document.body.appendChild(el);
},
        error:function(e){
            alert("error");
        }
    }); 


   
