// ==UserScript==
// @name         微信编辑器爆破,修改版
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在微信编辑器爆破1.3的基础上,修改了135的不能拖放图片处理的问题,增加了图片处理批量的功能,跟原作者回复修改无反应,自己改出来一个.
// @author       Yim @ yeminch@qq.com
// @match        *://*.135editor.com
// @match        *://bj.96weixin.com
// @match        *://www.wxeditor.com
// @match        *://www.zhubian.com
// @match        *://yibanbianji.com
// @match        *://*.yibanbianji.com
// @run-at 		 document-end
// @grant    	 unsafeWindow
// @require		 https://cdn.jsdelivr.net/npm/jquery@1.11.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426321/%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E7%88%86%E7%A0%B4%2C%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/426321/%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E7%88%86%E7%A0%B4%2C%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
	let setting={
		item:null,
	};
    var lists=[];
	function init(){
		var host = window.location.host;
        console.log('Hack=>'+host);
		if(host.search(/www.135editor.com/)>=0) init135();
        if(host.search(/bj.96weixin.com/)>=0) init96();
        if(host.search(/www.wxeditor.com/)>=0) initYD();
        if(host.search(/www.zhubian.com/)>=0) initZB();
		if(host.search(/yibanbianji.com/)>=0) initYB();
	}
	function addStyle(cssText) {
		let a = document.createElement('style');
		a.textContent = cssText;
		let doc = document.head || document.documentElement;
		doc.appendChild(a);
	}
	function init135(){

		 $('<div class="ym_wx_plus_btn">点我使用</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
            var h=setting.item.find('._135editor').html();
		//	if(h) unsafeWindow.current_editor.execCommand('inserthtml',h);

         //    console.log(current_editor);

             //这里无需unsafewindow,申请了unsafe,默认应该就是unsafewindow下的变量.
             //且不能用window.current_editor  ,globalThis.current_editor 也是不行的,在@grant none时可用.
             //只能用 current_editor 或者 unsafeWindow.current_editor
           if(h) current_editor.execCommand('inserthtml',h);
		});
        function myMove(event){
			var mouseX = event.pageX,mouseY = event.pageY;
            var ele = $(event.target).parents('li.style-item');
			if(ele.length==0){
                if(!$(event.target).hasClass('ym_wx_plus_btn'))$('.ym_wx_plus_btn').hide();
               // return false;
            }
            else
            {
			var y1 = ele.offset().top;
			var y2 = y1 + ele.height();
			var x1 = ele.offset().left;
			var x2 = x1 + ele.width();
			if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
				$('.ym_wx_plus_btn').hide();
				setting.item=null;
			}else{
				$('.ym_wx_plus_btn').css('left',(x2-120)+'px').css('top',(y1)+'px').show();
				setting.item=ele;
			}
            }
		}
       $('body').on('mousemove',myMove);

      try{
          //这里用 current_editor就行,不用editor,editor是iframe里面的名字, 路径是 imgs 什么的.关键字是这个.
          //若要用editor,则需要在子页面搞.父页面跟子页面 对象是同一个,名字不同而已.这样的话,也不用 在

          // @match   *://*.135editor.com    的时候 增加
          //          *://*.135editor.com/* 了
          //这里或许一次就行,不用2秒一次.未测试.
          setInterval( ()=>{ current_editor.isPaidUser=()=>{return true}},2000);
         }
        catch{}
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
            $('.rich_media_content').attr('data-vip',1);
        },2000);
    }
	function initYB(){
        $('<div class="ym_wx_plus_btn">点我使用</div>').appendTo('body').on('click',function(){
			if(!setting.item) return false;
            var ue = UE.getEditor('ueditor-container');
			var h=setting.item.find('.html-container').html();
			if(h) ue.setContent(h, true);
		});
        $("body").on('mousemove',function(event){
            var mouseX = event.pageX,mouseY = event.pageY;
			var ele = $(event.target).parents('.material-item');
			if(ele.length==0){
                if(!$(event.target).hasClass('ym_wx_plus_btn'))$('.ym_wx_plus_btn').hide();
                return false;
            }
			var y1 = ele.offset().top;
			var y2 = y1 + ele.height();
			var x1 = ele.offset().left;
			var x2 = x1 + ele.width();
            console.log('mouseX:',mouseX,x1);
            console.log('mouseX:',mouseX,x2);
            console.log('mouseY:',mouseY,y1);
            console.log('mouseY:',mouseY,y2);
			if( mouseX < x1 || mouseX > x2 || mouseY < y1 || mouseY > y2){
				$('.ym_wx_plus_btn').hide();
				setting.item=null;
			}else{
				$('.ym_wx_plus_btn').css('left',(x2-120)+'px').css('top',(y1)+'px').show();
				setting.item=ele;
			}
		});
    }
	addStyle(`
	.ym_wx_plus_btn{position:absolute;display:none;left:0;top:0;cursor:pointer;width:120px;height:30px;line-height:30px;background:#f00;color:#fff;text-align:center;z-index:99999999;}
	`);
	init();
})();