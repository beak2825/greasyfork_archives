// ==UserScript==
// @name	Tieba Float Movable
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.2.14
// @description	贴吧可移动悬浮窗
// @homepageURL	http://gerald.top/code/TiebaFloatMovable
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://greasyfork.org/scripts/144/code.user.js
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/116/Tieba%20Float%20Movable.user.js
// @updateURL https://update.greasyfork.org/scripts/116/Tieba%20Float%20Movable.meta.js
// ==/UserScript==

function locate(m,css) {
	var c={};
	args.forEach(function(i){c[i]=/^-?\d+px/.test(css[i])?css[i]:'20px';});
	m.css(c);
	var ensureVisible=function(keys,max,min){
		keys.some(function(key){
			var v=parseInt(m.css(key));
			if(isNaN(v)) return false;
			if(v<min) {nc=nc||{};nc[key]=min;}
			else if(v>max) {nc=nc||{};nc[key]=max;}
			return true;
		});
	};
	var mw=$(window).width(),mh=$(window).height(),pw=m.width(),ph=m.height(),nc=null;
	ensureVisible(['top','bottom'],mh-10,10-ph);
	ensureVisible(['left','right'],mw-10,10-pw);
	if(nc) m.css(nc);
}
function movable(o,name) {
	var m=$(o);
	if(!m.mousedown) return;
	o={};args=['right','bottom'];
	m.mousedown(function(e) {
		if(['DIV','TD'].indexOf(e.target.tagName)<0||e.target.contentEditable=='true') return;
		e.preventDefault();e.stopPropagation();
		o.x=e.pageX;
		if(args.indexOf('left')>=0) o.x-=parseInt(m.css('left'));
		else o.x+=parseInt(m.css('right'));
		o.y=e.pageY;
		if(args.indexOf('top')>=0) o.y-=parseInt(m.css('top'));
		else o.y+=parseInt(m.css('bottom'));
		if(!o.moving) $(document).mousemove(function(e) {
			if(o.moving) {
				var css={};
				for(var i in args) {
					var arg=args[i];
					if(arg=='left') css[arg]=e.pageX-o.x;
					else if(arg=='right') css[arg]=o.x-e.pageX;
					else if(arg=='top') css[arg]=e.pageY-o.y;
					else if(arg=='bottom') css[arg]=o.y-e.pageY;
					else continue;
					css[arg]+='px';
				}
				locate(m,css);
			}
			e.preventDefault();
		}).mouseup(function(e) {
			if(o.moving) {
				o.moving=false;
				var css={};
				for(var i in args) {
					var arg=args[i];
					css[arg]=m.css(arg);
				}
				utils.setObj('mcss_'+name,css);
				$(document).unbind('mousemove').unbind('mouseup');
			}
		});
		o.moving=true;
	});
	locate(m,utils.getObj('mcss_'+name,{}));
}
function unmovable(o) {$(o).unbind('mousedown').css({left:'',right:'',top:'',bottom:''});}
function main(editor) {
	function unminify(){
		if(utils.unminify) {
			mn.hide();ep.show();editor.focus();delete utils.unminify;
		}
	}
	function minify(){
		ep.hide();mn.show();utils.unminify=unminify;
		// 献给大花猫
		// 在事件中调用的时候最好加上event.stopPropagation()，
		// 不然可能因为失去焦点导致窗口又重新被隐藏
		unsafeWindow.unminifyShare=unminify;
	}
	function floatUp(){
		if(sta=='normal'||!allowUp) styleUp.html('');
		else styleUp.html('\
.edui-popup{bottom:44px;top:auto !important;}\
.edui-popup-caret{bottom:-8px;top:auto !important;transform:scale(1,-1);-webkit-transform:scale(1,-1);}\
');
	}
	function updateMinifyButton() {
		if(sta=='open'&&allowMinify&&!allowMinifyOnBlur) mx.show();
		else mx.hide();
	}
	function showFloat() {
		if(sta=='open') {
			styleFloat.html('\
.editor_title{width:610px !important;}\
#ueditor_replace{min-height:50px !important;}\
.poster_success{top:50px !important}\
.old_style_wrapper{width:600px !important;}\
.j_floating{margin-left:.5em;}\
');
			if(allowSimple) ep.attr('title','双击精简');
		} else {
			styleFloat.html('\
.editor_title{width:360px !important;}\
#ueditor_replace{min-height:24px !important;width:310px !important;}\
.poster_success{top:0 !important;left:40px !important;}\
.poster_signature,.editor_bottom_panel,.edui-toolbar{display:none !important;}\
.editor_textfield{padding:0 !important;}\
.old_style_wrapper{width:330px !important;}\
');
			ep.attr('title','双击展开');
		}
		updateMinifyButton();
	}
	function bindShortcut(){
		if(shortcut) utils.shortcut(shortcut,unminify);
	}
	function showSettings(e){
		e.stopPropagation();
		utils.popup.show({
			html:'\
<div class="ge_sbtn" style="cursor:default">悬浮设置</div>\
<label><input type=checkbox id=allowUp>向上弹出窗口</label><br>\
<label><input type=checkbox id=allowSimple>双击精简或展开</label><br>\
<label><input type=checkbox id=allowMinify>允许窗口隐藏</label><br>\
<div style="margin-left:20px">\
<label><input type=checkbox id=allowMinifyOnBlur>失去焦点时自动隐藏</label><br>\
<label>呼出的快捷键：'+utils.getLink('hotkey',{title:'帮助',html:'(?)'})+'<input id=shortcut style="width:60px"></label><br>\
</div>\
',
			className:'ge_opt',
			init:function(d){
				utils.bindProp($('#allowUp',d),'checked','allowUp',0,function(e){
					allowUp=this.checked;floatUp();
				});
				utils.bindProp($('#allowMinify',d),'checked','allowMinify',0,function(e){
					allowMinify=this.checked;showFloat();
				});
				utils.bindProp($('#allowMinifyOnBlur',d),'checked','allowMinifyOnBlur',0,function(e){
					allowMinifyOnBlur=this.checked;updateMinifyButton();
				});
				utils.bindProp($('#shortcut',d),'value','hk-float',0,function(e){
					if(shortcut) utils.shortcut(shortcut);
					shortcut=this.value;bindShortcut();
				});
				utils.bindProp($('#allowSimple',d),'checked','allowSimple',0,function(e){
					allowSimple=this.checked;showFloat();
				});
			},
		});
	}
	utils.addStyle('\
#tb_rich_poster{box-shadow:2px 2px 8px;position:fixed !important;z-index:10001;background-color:#E7EAEB;}\
#tb_rich_poster .editor_wrapper{margin-left:0;}\
.poster_head,#bdInputObjWrapper,.tb_poster_placeholder,.poster_draft_status,.poster_reply{display:none !important;}\
.editor_bottom_panel{margin-bottom:0 !important;}\
.poster_body .poster_component{padding-bottom:0 !important;}\
.float-button{position:absolute;bottom:0;right:0;cursor:pointer;line-height:2em;color:white;}\
.float-button>div{display:none;background:brown;float:right;}\
.float-button>div>*{display:inline-block;margin:0 .5em;}\
.float-button>div>*:hover{text-shadow:2px 1px 2px black;}\
.float-button:hover>div{display:block;}\
.float-button::before{content:"...";position:absolute;right:.2em;bottom:0;}\
.float-button:hover::before{content:"";}\
.float-button::after{content:"";border-bottom:2em solid brown;border-left:2em solid transparent;float:right;}\
#btUnminify{position:fixed;bottom:0;right:0;background:brown;color:white;font-weight:bold;padding:.5em;z-index:10;}\
#btUnminify::before{content:"＋";}\
');
	var styleFloat=utils.addStyle(),styleUp=utils.addStyle(),
	args,shortcut=utils.getObj('hk-float',''),
	sta=utils.getObj('float','open'),
	allowUp=utils.getObj('allowUp',true),
	allowMinify=utils.getObj('allowMinify',true),
	allowSimple=utils.getObj('allowSimple',true),
	allowMinifyOnBlur=utils.getObj('allowMinifyOnBlur',true),
	ep=$('#tb_rich_poster').dblclick(function(){
		if(allowSimple) {
			sta=sta=='open'?'close':'open';
			utils.setObj('float',sta);
			showFloat();
		}
	}).click(function(e){justClicked=e.target;}),justClicked=null,
	buttonFloat=$('<div>').appendTo($('<div class=float-button title="">').appendTo('#tb_rich_poster')),
	mn=$('<div id=btUnminify></div>').appendTo(document.body).mouseover(unminify).hide(),
	mx=$('<div>隐藏</div>').appendTo(buttonFloat).click(minify).hide();
	$('<div>悬浮设置</div>').prependTo(buttonFloat).click(showSettings);
	movable(ep[0],'float');
	editor.$container.attr('style','');
	showFloat();floatUp();bindShortcut();
	if(allowMinify) minify();
	$(document).click(function(e){
		if(justClicked) justClicked=null;
		else if(allowMinify&&allowMinifyOnBlur) minify();
	});
	$('.j_quick_reply').click(unminify);
	var o=$('#j_p_postlist');
	if(o.length) utils.find('.p_reply_first',o[0],function(o){o.click(unminify);});
}

function initEditor(t) {
  t.init();t.unbindScrollEvent();main(unsafeWindow.test_editor);
}

if(unsafeWindow.PosterContext&&unsafeWindow.PosterContext.isPostAllowed()) {
	if(unsafeWindow.test_editor) main(test_editor);
	else if(/"poster\/widget\/rich_poster"/.test(document.body.innerHTML))
		_.Module.use("poster/widget/rich_poster",{},initEditor);
	else _.Module.use("common/widget/RichPoster",{prefix:{}},initEditor);
}
