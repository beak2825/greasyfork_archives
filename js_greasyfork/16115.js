// ==UserScript==
// @name					Power Sensor
// @author					aldev
// @namespace			aldev
// @description			sensing  words of web pages under mouse very quickly without selection&a web page links previewer
// @description			this is a test version,if you like it,please give me ur suggestions or feel free to improve ,just dont forget to update your codes!! thx a lot !
// @version					0.0.0.1
// @homepage                       https://greasyfork.org/zh-CN/scripts/16115
// @include					*
// @grant					GM_xmlhttpRequest
// @charset					UTF-8
//	@run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/16115/Power%20Sensor.user.js
// @updateURL https://update.greasyfork.org/scripts/16115/Power%20Sensor.meta.js
// ==/UserScript==
d=document;
body=d.body;
create=d.createElement;
q=d.querySelector;
qa=d.querySelectorAll;
efp=d.elementFromPoint;
function p(s) {
	console.log(s);
}
function _(s) {
	return create.call(d,s);
}
function $(s) {
	return q.call(d,s);
}
function $$(s) {
	return qa.call(d,s);
}
function frome(e) {
	return efp.call(d,e.clientX,e.clientY);
}
//el ele
function worde(el) {
		texts=el.textContent.split(/\s+/ig);
		if(texts.length<2)return;
		el.textContent='';
		for(i in texts){
			w=_('span');
			w.textContent=texts[i]+' ';
			el.appendChild(w);
		}
	return el;
	}
function word(e) {
	if(e.target.id=='c')return;
	el=frome(e);
	ori_text=el.innerHTML;
	worde(el);
	el2=frome(e);
	text=el2.textContent.replace(/\W+/ig,'');
	el.innerHTML=ori_text;
	return text;
	}

function handlejs(js) {
	return js.replace(/<img[^<]*?>/ig,'').replace(/<script[^<]*? src=[^<]*?\/>/ig,'').replace(/<script[^`]*?<\/script>/ig,'').replace(/<link[^<]*?>/ig,'');
}
function mov(c,e) {
	s=c.style;
	s.left=e.clientX+'px';
	s.top=e.clientY+'px';
	}
	function preview(u,e) {
		c=$('#c');
	    GM_xmlhttpRequest( {
		method: "GET",
		url: u,
		onload: function(response) {
			c.innerHTML=handlejs(response.responseText);
		    mov(c,e);
		    c.style.display='';
			setTimeout("c.style.display='none'",5000);
         }
     });
 }
 function handlehover() {
	 as=$$('a');
	for (i in as){
	as[i].onmouseover=function(e){
	preview(e.target.href,e);
 }}}
function handleevents() {
	//events
	body.onmousemove=function(e){
		/* text=word(e);
		u='http://m.haosou.com/s?q='+text+'&mode=jisu&src=home_input&srcg=home';
		preview(u,e); */
	};
	body.ondblclick=function(e){
		$('#c').style.display='none';
	};
	body.onclick=function(e){
		text=word(e);
		if(text.length<1)return;
		u='http://m.haosou.com/s?q='+text+'&mode=jisu&src=home_input&srcg=home';
		preview(u,e);
	};
$('#c').ondblclick=function(e){
		this.style.display='none';
};
handlehover();
//end events
}
function main() {
    console.clear();
    console.log("-----------------------begin sensor----------------------");
	c=_('div');
	c.id='c';
	c.style='font:3pt;display:none;top:0px;float:right;width:600px;height:300px;position:fixed;overflow:auto;zIndex:2999999999;background:gray' ;
	body.appendChild(c);
  
	handleevents();
    console.log("-----------------------end    sensor----------------------");
}
//app entrance
main();
