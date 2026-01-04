// ==UserScript==
// @name         微信编辑器爆破
// @namespace    https://greasyfork.org/users/734068
// @homepage	 https://gitee.com/yeminch/hack-wxeditor
// @version      1.17
// @description  [请勿商用]无视微信编辑器VIP限制，可以使用VIP排版（135/365/96/zhubian/xmyeditor/wxeditor/yibanbianji/yiban.io）
// @author       Yim @ yeminch@qq.com
// @match        *://*.135editor.com/*
// @match        *://www.135editor.com/js/ueditor/dialogs/135editor/imgstyle.html*
// @match        *://bj.96weixin.com/*
// @match        *://www.wxeditor.com/*
// @match        *://www.zhubian.com/*
// @match        *://yibanbianji.com
// @match        *://yibanbianji.com/*
// @match        *://www.365editor.com/*
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @match        *://*.yibanbianji.com/*
// @match        *://www.xmyeditor.com/*
// @run-at 		 document-end
// @grant    	 unsafeWindow
// @require		 https://cdn.jsdelivr.net/npm/jquery@1.11.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421126/%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E7%88%86%E7%A0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/421126/%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E7%88%86%E7%A0%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
	let setting={
		item:null,
        type:1,
	};
    var lists=[];
	function init(){
		var host = window.location.host;
		if(host.search(/www.135editor.com/)>=0) init135();
        if(host.search(/bj.96weixin.com/)>=0) init96();
        if(host.search(/www.wxeditor.com/)>=0) initYD();
        if(host.search(/www.zhubian.com/)>=0) initZB();
		if(host.search(/yibanbianji.com/)>=0) initYB();
        if(host.search(/weixin.qq.com/)>=0) initWXYB();
        if(host.search(/www.xmyeditor.com/)>=0) initXMY2();
        if(host.search(/www.365editor.com/)>=0) init365();
	}
	function addStyle(cssText) {
		let a = document.createElement('style');
		a.textContent = cssText;
		let doc = document.head || document.documentElement;
		doc.appendChild(a);
	}
	function init135(){
		 $('<div class="ym_wx_plus_btn">强势插入</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
			var h;
			var ue = unsafeWindow.top.UE.getEditor('WxMsgContent');
            if(setting.type==1){
				h = setting.item.find('._135editor').html();
			}else if(setting.type==2){
				h = setting.item.html();
				unsafeWindow.window.top.$("#preview_modal_").hide();
			}
			if(h) ue.setContent(h, true);
		});
        $("body").on('mousemove',function(event){
			var mouseX = event.pageX,mouseY = event.pageY;
            var ele,x1,x2,y1,y2;
            if($(event.target).attr("id")=="template-modal"){
                ele = $(event.target);
                y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
                setting.type=2;
                setting.item=$(".l-img .Content-body");
                $('.ym_wx_plus_btn').css('left','auto').css('right','20px').css('top',(y1+50)+'px').show();
            }else{
                ele = $(event.target).parents('li.style-item');
                if(ele.length<=0) ele = $(event.target).parents('li.vip-style');
                if(ele.length>0){
                    y1 = ele.offset().top;
                    y2 = y1 + ele.height();
                    x1 = ele.offset().left;
                    x2 = x1 + ele.width();
                    if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                        unsafeWindow.window.top.$('.ym_wx_plus_btn').hide();
                        setting.item=null;
                    }else{
                        unsafeWindow.window.top.$('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+5)+'px').show();
                        setting.type=1;
                        setting.item=ele;
                    }
                }else{
                    if(!$(event.target).hasClass('ym_wx_plus_btn'))unsafeWindow.window.top.$('.ym_wx_plus_btn').hide();
                }
            }
		});
	}
    function init96(){
        setInterval(function(){
            $('.rich_media_content').attr('data-vip',1);
        },2000);
    }
    function initYD(){
        setInterval(function(){
            $('.yead_editor').attr('data-use',1);
        },2000);
    }
    function initZB(){
        setInterval(function(){
            unsafeWindow.AlreadyLogin = true;
            unsafeWindow.localStorage.year=99;
            if($('#user_vip').length==0){
                $('body').append('<div style="display:none"><div id="user_vip" data-vip="4"></div></div>');
            }else{
                $('#user_vip').attr('data-vip',4);
            }
            $('.rich_media_content').attr('data-vip',1);
        },2000);
    }
	function initYB(){
        $('<div class="ym_wx_plus_btn">强势插入</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
            var ue = UE.getEditor('ueditor-container');
			var h;
			if(setting.type==2){
				h=setting.item.children().eq(0).prop('outerHTML');
			}else if(setting.type==3){
				h=setting.item.find('.template-set').html();
				setting.item.find('.close-icon').trigger('click');
			}else{
				h=setting.item.find('.html-container').html();
			}
			if(h) ue.setContent(h, true);
		});
        $("body").on('mousemove',function(event){
            var mouseX = event.pageX,mouseY = event.pageY;
			var ele,x1,x2,y1,y2;
			if($(event.target).parents('.material-item').length>0){
				ele = $(event.target).parents('.material-item');
                y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
                if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+5)+'px').show();
                    setting.item=ele;
					setting.type=1;
                }
			}else if($(event.target).parents('.img-list-ul').length>0){
				ele = $(event.target).parents('li');
				setting.type=2;
                y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
                if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+2)+'px').show();
                    setting.item=ele;
                }
			}else if($(event.target).parents('.part-style-template').length>0){
				ele = $(event.target).parents('.style-template-item');
				setting.type=1;
                y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
                if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+2)+'px').show();
                    setting.item=ele;
                }
            }else if($(event.target).parents('.template-set-preview').length>0){
				ele = $(event.target).parents('.template-set-preview');
				setting.type=3;
                y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
                if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x1+10)+'px').css('top',(y1+5)+'px').show();
                    setting.item=ele;
                }
			}else{
                if(!$(event.target).hasClass('ym_wx_plus_btn'))$('.ym_wx_plus_btn').hide();
            }
		});
    }
    function initWXYB(){
        var wxybinit=false;
        $('<div class="ym_wx_plus_btn">强势插入</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
			var h;
			if(setting.type==2){
				h=setting.item.children().eq(1).prop('outerHTML');
			}else if(setting.type==3){
				h=setting.item.find('.dynamic-material-html-container').html();
			}else if(setting.type==4){
				h=setting.item.find('.template-set').html();
				setting.item.find('.close-icon').trigger('click');
			}else if(setting.type==5){
				//长图需要跨域通信 懒得弄
				//var ue = unsafeWindow.top.UE.getEditor('WxMsgContent');
				//h=setting.item.find('.editor-canvas').html();
				//unsafeWindow.window.top.$('.gaoding-editor-iframe-dialog').prev('div').remove();
				//unsafeWindow.window.top.$('.gaoding-editor-iframe-dialog').remove();
			}else{
				h=setting.item.find('.html-container').not('.mpa-hide').html();
			}
			if(h){
                unsafeWindow.window.__MP_Editor_JSAPI__.invoke({
                    apiName: 'mp_editor_insert_html',
                    apiParam: {
                        html: h,
                        isSelect: false
                    },
                    sucCb: (res) => {console.log('设置成功', res)},
                    errCb: (err) => {console.log('设置失败', err)}
                })
            }
		});

        $("body").on('mousemove',function(event){
            var mouseX = event.pageX,mouseY = event.pageY;
			var ele,x1,x2,y1,y2;
			ele = $(event.target).parents('.material-item');
			if($(event.target).parents('.img-list-ul').length>0){
				ele = $(event.target).parents('li');
				y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+2)+'px').show();
                    setting.item=ele;
					setting.type=2;
                }
			}else if($(event.target).parents('.material-item.material-item-svg').length>0){
				y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-150)+'px').css('top',(y1+25)+'px').show();
                    setting.item=ele;
					setting.type=3;
                }
			}else if($(event.target).parents('.material-item.style-template-item').length>0){
				if(! ele.hasClass('part-template-item')){
					$('.ym_wx_plus_btn').hide();
					setting.item=null;
					return;
				}
				y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+5)+'px').show();
                    setting.item=ele;
					setting.type=1;
                }
			}else if($(event.target).parents('.material-item').length>0){
				y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1+5)+'px').show();
                    setting.item=ele;
					setting.type=1;
                }
			}else if($(event.target).parents('.template-set-preview').length>0){
				ele = $(event.target).parents('.template-set-preview');
				y1 = ele.offset().top;
				y2 = y1 + ele.height();
				x1 = ele.offset().left;
				x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
					$('.ym_wx_plus_btn').hide();
					setting.item=null;
				}else{
					$('.ym_wx_plus_btn').css('left',(x2-180)+'px').css('top',(y1+25)+'px').show();
					setting.item=ele;
					setting.type=4;
				}
			}else if($(event.target).parents('.design-editor').length>0){
				$('.ym_wx_plus_btn').hide();
				return;
				ele = $(event.target).parents('.design-editor');
				y1 = ele.offset().top;
				y2 = y1 + ele.height();
				x1 = ele.offset().left;
				x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
					$('.ym_wx_plus_btn').hide();
					setting.item=null;
				}else{
					$('.ym_wx_plus_btn').css('left',(x2-180)+'px').css('top',(y1+25)+'px').show();
					setting.item=ele;
					setting.type=5;
				}
			}else{
				if(!$(event.target).hasClass('ym_wx_plus_btn'))$('.ym_wx_plus_btn').hide();
			}
		});
    }
    function initXMY2(){
		 $('<div class="ym_wx_plus_btn">强势插入</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
            var h=setting.item.find('.LB-sl-content').html().replace(/class="xmyedltor"/g,'class="xmyeditor"').replace(/data-xmy="xmyeditor.com"/g, '');//.replace(/<div/g,'<section').replace(/<\/div>/,'</section>');
			if(h) ue.setContent(h, true);
		});
        $("body").on('mousemove',function(event){
			var mouseX = event.pageX,mouseY = event.pageY;
            var ele = $(event.target).parents('li.LB-sl-li');
			if(ele.length>0){
                var y1 = ele.offset().top;
                var y2 = y1 + ele.height();
                var x1 = ele.offset().left;
                var x2 = x1 + ele.width();
                if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1)+'px').show();
                    setting.item=ele;
                }
            }else{
                if(!$(event.target).hasClass('ym_wx_plus_btn'))$('.ym_wx_plus_btn').hide();
            }
		});
	}
    function init365(){
		 $('<div class="ym_wx_plus_btn">强势插入</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
            var h;
			if(setting.type==1) h=setting.item.find('.KolEditor').html();
			else if(setting.type==2){
				h= setting.item.children().eq(2).prop('outerHTML');
				$('.phone-perview-inner .close-btn').trigger('click');
			}
			if(h) UE.instants["ueditorInstant0"].setContent(h,true);
			$('.ym_wx_plus_btn').hide();
		});

        $("body").on('mousemove',function(event){
			var mouseX = event.pageX,mouseY = event.pageY;
			var ele,x1,x2,y1,y2;
            ele = $(event.target).parents('.content-material .material-list');
			if(ele.length>0){
				setting.type=1;
				y1 = ele.offset().top;
                y2 = y1 + ele.height();
                x1 = ele.offset().left;
                x2 = x1 + ele.width();
				if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
                    $('.ym_wx_plus_btn').hide();
                    setting.item=null;
                }else{
                    $('.ym_wx_plus_btn').css('left',(x2-90)+'px').css('top',(y1)+'px').show();
                    setting.item=ele;
                }
			}else{
				ele = $(event.target).parents('.phone-perview-inner .preview-body');
				if(ele.length>0){
					y1 = ele.offset().top;
					y2 = y1 + ele.height();
					x1 = ele.offset().left;
					x2 = x1 + ele.width();
					setting.type=2;
					setting.item=ele;
					$('.ym_wx_plus_btn').css('left',(x2-150)+'px').css('top',(y1+5)+'px').show();
				}else{
					if(!$(event.target).hasClass('ym_wx_plus_btn'))$('.ym_wx_plus_btn').hide();
				}
			}
		});
	}
	addStyle(`
	.ym_wx_plus_btn{position:absolute;display:none;left:0;top:5px;cursor:pointer;width:90px;height:30px;line-height:30px;background:#f00;color:#fff;text-align:center;z-index:99999999;}
	`);
	init();
})();