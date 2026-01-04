// ==UserScript==
// @name         微信公众号自动登录
// @namespace    https://wxx.324.com/
// @version      1.1.7
// @description  自动登录微信公众号插件 by-小强点点 qq:314801013  😊
// @author       小强点点
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376025/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/376025/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

/*
 * 动态添加 CSS 样式
 * @param selector {string} 选择器
 * @param rules    {string} CSS样式规则
 * @param index    {number} 插入规则的位置, 靠后的规则会覆盖靠前的
 */
var addCssRule = function() {
	// 创建一个 style， 返回其 stylesheet 对象
	// 注意：IE6/7/8中使用 style.stylesheet，其它浏览器 style.sheet
	function createStyleSheet() {
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		head.appendChild(style);
		console.dir(style)
		return style.sheet ||style.styleSheet;
	}

	// 创建 stylesheet 对象
	var sheet = createStyleSheet();

	// 返回接口函数
	return function(selector, rules, index) {
		index = index || 0;
	    if (sheet.insertRule) {
	        sheet.insertRule(selector + "{" + rules + "}", index);
	    } else if (sheet.addRule) {
	        sheet.addRule(selector, rules, index);
	    }
	}
}();


(function() {
    'use strict';
    if (window.location.toString().indexOf("https://mp.weixin.qq.com/cgi-bin/r?cookies=") === 0) {
        document.body.innerHTML=`
<style>
*{padding:0;margin:0;}
</style>
<div style='width:100%;height:100vh;background:#eee;overflow:auto;margin:0;'>
    <div style='width:300px;height:200px;line-height:200px;font-size:28px;margin:200px auto;text-align:center;background:#fff;color:#b00;border-radius:5px;'>登录中😂</div>
</div>
`;
        window.onload=function() {

        }

    }
    //return;
    addCssRule(".weui-desktop-dropdown__list li:last-child", "display:none");
    window.onload=function(){
        if (ret=="200003") {
            clearAll();
        }
    }
    function clearAll()
    {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if(keys) {
            for(var i = keys.length; i--;)
            {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
            }
        }
    }

    function setCookie(c_name,value,expiredays)
    {
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";path=/;expires="+exdate.toGMTString())
    }
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    var cookies = getQueryString("cookies");
    var xqloginurl = getQueryString("xqloginurl");
    if (cookies && xqloginurl)
    {
        clearAll();
        cookies = eval("("+cookies+")");
        cookies.forEach(function(item){
            setCookie(item.key, item.value, 7);
        });
        var clearSession="/cgi-bin/appmsgotherinfo?appmsgidlist=";
        clearSession+="2247485339&token=1602311&lang=zh_CN&f=json&ajax=";
        clearAll();

        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log("清除成功");
                cookies.forEach(function(item){
                    setCookie(item.key, item.value, 7);
                });
                location.href=xqloginurl;
            }
        }
        xmlhttp.open("GET",clearSession,true);
        xmlhttp.send();
    }
})();