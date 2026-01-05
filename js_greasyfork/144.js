// ==UserScript==
// @name	Tieba Common
// @namespace	http://geraldl.net/
// @author	Gerald <gera2ld@163.com>
// @description	Common JS for Baidu scripts by Gerald
// @version	1.0
// ==/UserScript==

if(typeof unsafeWindow=='undefined') unsafeWindow=window;
var $=unsafeWindow.$,PageData=unsafeWindow.PageData,utils=null,
		gkey='__ge_firefox';
(function(){
function getObj(key,def){
	var v=ff[key];
	if(v==null&&def!=null) setObj(key,v=def);
	return v;
}
function setObj(key,val){ff[key]=val;}
function notice(title,msg){
	var n=getObj('msg',{});
	if(!n[title]) {
		n[title]=1;
		var d=document.createElement('div');
		d.setAttribute('style','position:fixed;z-index:999999;background:white;border:1px solid;border-radius:3px;padding:10px;top:50px;left:50px;');
		d.innerHTML='<a href=# style="float:right">关闭</a><h3 style="margin-right:2.5em;">'+title+'</h3>'+msg;
		document.body.appendChild(d);
		d.firstChild.onclick=function(e){
			e.preventDefault();d.parentNode.removeChild(d);
		};
		return d;
	}
}
var ff=unsafeWindow[gkey];
if(!ff) ff=unsafeWindow[gkey]={};
utils=getObj('utils');
if(!utils)
	notice('未检测到依赖脚本！','请确认已安装并启用：<br><a target=_blank href=https://greasyfork.org/scripts/118>Tieba Utilities</a><br><p align=right>——寂寞的原子</p>');
})();
