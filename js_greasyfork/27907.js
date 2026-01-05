// ==UserScript==
// @name pic_viewer
// @author NLF
// @description  仿dicusz7看图.(支持Opera 10.1+ ,Fx3.6+ , Chrome5.0+)
// @create 2010-4-5
// @lastmodified 2010-5-19
// @version 1.4.6.1
// @include http*
// @namespace https://greasyfork.org/users/107610
// @downloadURL https://update.greasyfork.org/scripts/27907/pic_viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/27907/pic_viewer.meta.js
// ==/UserScript==


(function (){
	//图标显示延时
	var pset={
		black_div:true					,//当查看图片的时候,是否显示黑色半透明层,如果开启这个功能,你就需要先关闭当前查看的图,才能点击下一张了..因为黑色的图层会覆盖住屏幕;
		c_timeout:200						,//悬浮在图片上多久显示按钮..单位 毫秒;
		wucha:0										,//实际图片和显示图片的误差值超过这个值后,显示按钮..;
		min:120										,//如果原始的图片小于这个数值,那么忽略它...;
		smart_click:false					,//智能点击接管...;
		pagesize:1								,//页面的大小..默认 1=100%..;
	};


	var img_button=[
										["data:image/gif;base64,R0lGODlhEQARAKIAAAAAAP///0SXzJmZmf///wAAAAAAAAAAACH5BAEAAAQALAAAAAARABEAAAMtSLo7/o7AJ6eFrM7MLm8R9lHaMEaKmKEp+XHsW81yS9ehWc/xm+u+38XSGooSADs=","data:image/gif;base64,R0lGODlhEQARAKIAAAAAAP///0SXzJmZmf///wAAAAAAAAAAACH5BAEAAAQALAAAAAARABEAAAMtSLor/o7AJ6eFrM7MLm8R9lGaMEaKmKEp+XHsW81yS9ehWc/xm+u+38XSGooSADs="],
										["data:image/gif;base64,R0lGODlhEQARAKIAAAAAAP///0SXzJmZmf///wAAAAAAAAAAACH5BAEAAAQALAAAAAARABEAAAMuSLPcri5KQqutDV66YB8b5oHhlXERxqgP2rnnyMZ0CpfmSoZg9uYy3ExCHBFXCQA7","data:image/gif;base64,R0lGODlhEQARAKIAAAAAAP///0SXzJmZmf///wAAAAAAAAAAACH5BAEAAAQALAAAAAARABEAAAMuSLLcri5KQqutDV66YBcb5oHhlXERxqgP2rnnyMZ0CpfmSoZg9uYy3ExCHBFXCQA7"],
										["data:image/gif;base64,R0lGODlhEQARAKIAAAAAAP///0SXzJmZmf///wAAAAAAAAAAACH5BAEAAAQALAAAAAARABEAAAMuSLPcri7KQaq9kOFdG99eR4lWmJ3icj2ltqovnMrZeLp1q88fZvY122dC1BQfCQA7","data:image/gif;base64,R0lGODlhEQARAKIAAAAAAP///0SXzJmZmf///wAAAAAAAAAAACH5BAEAAAQALAAAAAARABEAAAMuSLLcri5KQaq9kOFdG99eR4lWmJ3icj2ltqovnMrZeLp1q88fZvY122dC1BQfCQA7"],
										["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAABjpJREFUeNqcV0uLHFUU/u6tR9ejuycmMSKBLHQTIZqVLnwsBAnE+AiG  oBuDK3+ALgzBqISJrl0aRPQHCAGdARcudZGNSDYixpiHeQxDJtPd04+qrnv9zq3qme6ezIzpgtO3  qrpufed85zvn3lIA/BOf/3ixsOqYMQYPOiy2PrTS8LVd+P7Ma8d5OcQMR+P4+QWbW2sLu3GY6npI  k/8y2qCyPq1HWzPl+ZvzC+JjYxZwnxYVxroTdXYJSDV2xbSaRoNWDxWSQCEO+KBWqHlAwId9xedp  F46kKErmIlp7FgfUOskhsK/u4dFEoRkQvKacAzHRarRQw5nvlRMzM5EiNSsDG/lkeE0CNoIy+gYd  SBl9xKecA6oC19XEkWSsxazHhAMJEVKJmg4kFfWJc6CiXpfgnhbxkYFBCVzQkTfmF+9aq8iGfbCE  R7c5z5NAKuFOOsDwEv4bCbBfGVFrfCqSyJl0TnQOSNCBV84bFho/fHbUlYAZw7JTBI1GSeM75xeP  8TT2x/+IA0twz+U8DkpwYSL2yhQEoxRwZHXQRqUY48y3TFGQ0JqcW6dQ6/CDmGAp50R0NqbjHH0f  J5//BsMyfdEEAwLilO6iL8HrRBXqVzOg1bdY6hq0qb4rKwVudwxOPxdB6wBpEnPefoRhk29N4fkE  J6gvpmsO3FM1Vs5wnA014UAk9FcpiENRvcLdNeDeoORzwLm9AuhzbPD/VjA2N6zTgToZSB0TgZfA  9yOCVw4ocdSHLdTWIqxp7WpcEnOvZ3GLQAmrocmkFdaUuc8UhnQyoPlyo4qmFtQQBCHn19bN92g6  JDjNjQHTlk3U7IQDoXupwvWW5QsJTOWllL8IcGg0BVZgwNEzQ6icaq5EqJTh8wFqoY+QIgkZhQBK  5Jrmq3KE1VDan+ga/rhaJaBbHRGiRqw9mPYK8sxjZBo5FTdk7i3VozmGmUXK89srHucVaPcOMkV7  SDupp/AOPHbfidNT1AOE/sgBqanlwh+vl5ttvpgC3NfwEf39G9aWb/JxqW3l2q5TfOV8TNvPee99  ySuK8OffP4Q1uqo3jWeeuIEXD19Ep9fDWneZuulhuXWV5x0cOXxunYIJBq68v7GevPLxdVycfwuD  qbpWUy1muu2ICyQbJz75FQefvIRBHiMvLC0nsynyoIPxHPgl9XpTixyyQOrS76vQVRxC725Cz9Wh  mimvE2eIYqiQI0UH1r3POg8vfEW9kM0wokBJvSmcUAsvZ0o2V4FVw+7l1+cXn65WNSGceS8VVsjP  nkegHt8N7EphBbxB8FrsDLWIxUwQ1juocmRF+VLplD5Vn3vMv3X7BqWUs2kHBotfvHvqqZfffinP  uLoXQ9NdXR4cOvnR12ZE1N6U0RN0V+LAdZ0RJwRmxCoQ8EhWMj5IB9YGVTumcoRYTeHyDl/Mm+RF  2U0OdIdZ/9rln75blmxUaW0eOnm6zDmXZzTZwZpMgYxztCSEiggachTqWXLObMDyzJ0DxubI8hZ6  FFGP97JsgH7WQ79awLjlWXdA6uI+rVVpSJ7I4fymA81A2h4jJ7CM9eo8IiCbj2KzoQhokQgHqq/d  vML0cOrZG1suw6NV0x8TdDFK+dhIQALUK+CKCbmnYgKy5SqXe6ZC0sC1QudD9zKti+33AVpt7oQP  OpwDKQHrpFfGBnPfSB39aN9B0VqFXVpGca8H89c/UNdWkH7wKTujh2PnFlyk4/sV0aBUne3f/0UC  39YB5cqPKUgCF7GqR7IxhO38SfuXPLFJMWqbF1DSnudYIc22y6OsE4tnXz1apnNzldNEc31/mySV  Dkiu2QNUyppeIyi7mprj9Z4UbkPQJtUmh6wxKgrcLkWPQgWu0la22On3ab1tGXCdQF7KejZ3/iD1  BmpvKUYkhJE2yS5nKTzF9cLKToWmN/q7gC9th6F31AA7m7lzlRF23dOKTQU+a7xO0Ih6l+tS98Rk  Gqzd+Wtmq/3AgzaT5hbBmzznBsMyFSbm5kJY8bi56BK0Q/o7GWyLttpzjehhPNjaAVO+oHmpi+Ih  ttne1PyZHRjVqfo/tbrN/FkdsIZ1ygXqBVmgHua7Y7rOd3x+qw9W2gFZhmYkYFTn13f6XlTbMBNX  H5yzfPOt1/lOn+z/CTAAnSFMZsMNbBkAAAAASUVORK5CYII="]
								];

	var URL=location.href;
/*
	//某些网站的一些开关设置..
	(function(){
		var sitekg=[
			[/baidu\.com/i,'pset.smart_click=false;'],
			[/image\.soso\.com\/image/i,'pset.smart_click=false;']
		];

		for(var i=0,ii=sitekg.length;i<ii;i++){
			sitekg[i][0].test(URL)? eval(sitekg[i][1]) :'';
		};
	})();
*/

	//各网站规则;
	var Sites=[
			{
				"sitename":"google图片搜索",
				"enable":true																													,//是否启用..
				"click":true																													,//接管鼠标左键点击..
				"site_regexp":/^https?:\/\/\w{3,7}\.google(?:\.\w{1,4}){1,2}\/images/i			,//站点正则..
				"site_example":"images.google.cn/images"															,//网址例子..
				"get_image":function(){							//获取图片实际地址的处理函数,target为当前鼠标悬浮图片的引用..
					try{
						return matchSingleNode('ancestor::a',target).href.match(/imgurl=(.*?\.\w{1,5})&/i)[1];
					}catch(e){}
				}
			},
			{
				"sitename":"必应图片",
				"enable":true,
				"click":true,
				"site_regexp":/^http:\/\/.*?bing\.com\/images\/search/i,
				"site_example":"http://cn.bing.com/images/search",
				"get_image":function(){
					try{
						return matchSingleNode('ancestor::a',target).href.match(/furl=(.*?\.(?:jpg|jpeg|png|gif|bmp))$/i)[1];
					}catch(e){}
				}
			},
			{
				"sitename":"豆瓣",
				"enable":true,
				"click":false,
				"site_regexp":/^http:\/\/www\.douban\.com/i,
				"site_example":"http://www.douban.com",
				"get_image":function(){
					var templink=target.src.replace(/view\/photo\/thumb\//i,'view/photo/photo/');
					if(templink!=target.src){return templink};
				}
			},
			{
				"sitename":"flickr",
				"enable":true,
				"click":false,
				"site_regexp":/^http:\/\/www\.flickr\.com/i,
				"site_example":"http://www.flickr.com",
				"get_image":function(){
						var templink=target.src.replace(/_t(\.\w{2,5})$/i,'$1');
						if(templink!=target.src){return templink};
				}
			},
			{
				"sitename":"mozest",
				"enable":true,
				"click":true,
				"site_regexp":/^http:\/\/board\.mozest\.com/i,
				"site_example":"http://board.mozest.com",
				"get_image":function(){
						var templink=target.src.replace(/\.thumb\.\w{2,5}$/i,'');
						if(templink!=target.src){return templink};
				}
			},
			{
				"sitename":"17173",
				"enable":true,
				"click":true,
				"site_regexp":/^http:\/\/.*?\.17173\.com/i,
				"site_example":".17173.com",
				"get_image":function(){
					try{
						return matchSingleNode('ancestor::a',target).href.match(/https?:.*(https?:.*\.(?:jpg|jpeg|png|gif|bmp))$/i)[1];
					}catch(e){};
				}
			},
			{
				"sitename":"deviantart",
				"enable":true,
				"click":true,
				"site_regexp":/^http:\/\/www\.deviantart\.com/i,
				"site_example":"http://www.deviantart.com",
				"get_image":function(){
					return target.src.replace(/(http:\/\/[^\/]*\/fs\d*\/)150\/(.*)/i,'$1$2')
				}
			},
			{
				"sitename":"opera官方论坛",
				"enable":true,
				"click":true,
				"site_regexp":/^http:\/\/bbs\.operachina\.com/i,
				"site_example":"http://bbs.operachina.com",
				"get_image":function(){
					try{
						return target.src.match(/(.*)&t=1$/i)[1]+'&mode=view';
					}catch(e){};
				}
			},
			{
				"sitename":"深度,远景",
				"enable":true,
				"click":true,
				"site_regexp":/^http:\/\/bbs\.(?:deepin\.org|pcbeta\.com)/i,
				"site_example":"http://bbs.deepin.org,http://bbs.pcbeta.com",
				"get_image":function(){
					return (/attachment\.php/i.test(target.src))? target.src+'&noupdate=yes&nothumb=yes' : '';
				}
			},
			{
				"sitename":"QQ微博",
				"enable":true,
				"click":false,
				"site_regexp":/^http:\/\/t\.qq\.com\//i,
				"site_example":"http://t.qq.com",
				"get_image":function(){
					try{
						return matchSingleNode('ancestor::a',target).href.match(/^http:\/\/mblogpic\.store\.qq\.com\/.*/i)[0];
					}catch(e){};
				}
			}
		];

	//使用opera特有的事件进行拦截..
	var kill_click;
	if(window.opera && pset.smart_click){
		window.opera.addEventListener("BeforeEventListener.click",function(e){
			if(kill_click){
				if(e.listener.toString().indexOf('view_o_pic')==-1){
					e.preventDefault();
				};
			};
		},false);
	};

	//封装evaluate函数..
	function matchNodes(xpath,root,doc){
		doc=doc||document;
		root=root||doc;
		return doc.evaluate(xpath, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	};
	function matchSingleNode(xpath,root,doc){
		doc=doc||document;
		root=root||doc;
		return doc.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	};

	//创建一个图片,用来点击
	var clickimg;
	function create_clickimg(){
		if(!clickimg){
			clickimg=document.createElement('img');
			clickimg.src=img_button[3][0];
			clickimg.title='点击我查看原图';
			clickimg.style.cssText='\
				cursor:pointer;\
				position:absolute;\
				border:none;\
				z-index:99990;\
				opacity:0.8;\
				-o-transition:opacity 0.2s ease-in-out;\
				-moz-transition:opacity 0.2s ease-in-out;\
				-webkit-transition:opacity 0.2s ease-in-out;'
			clickimg.addEventListener('click',view_o_pic,false);
			clickimg.addEventListener('mouseover',function(){this.style.opacity=1;},false);
			clickimg.addEventListener('mouseout',function(){this.style.opacity=0.8;},false);
			document.body.appendChild(clickimg);
		};
		clickimg.style.left=target_x+2+'px';
		clickimg.style.top=target_y+2+'px';
		clickimg.style.display='';
	};

	var pic_box;
	function view_o_pic(e){
		e.stopPropagation();
		e.preventDefault();
		if(!pic_box){
			pic_box=document.createElement('div');
			pic_box.style.cssText='\
				border:1px solid #ccc;\
				z-index:999999;\
				cursor:pointer;\
				display:none;\
				position:absolute;\
				top:0px;\
				left:0px;\
				padding:8px;\
				background-color:white;\
				border-radius:3px;\
				-moz-border-radius:3px;'
			pic_box.innerHTML='\
							<div style="text-align:right;padding:5px 2px;">\
								<span style="vertical-align:top;float:left;color:#666;padding-right:20px;font-size:13px;">鼠标滚轮缩放</span>\
								<img id="open_pic_dic" title="在新窗口打开图片" style="border:none;cursor:pointer;padding-right:8px;" src='+img_button[0][0]+' / >\
								<img id="full_pic_dic"   title="实际尺寸"      style="border:none;cursor:pointer;padding-right:8px;" src='+img_button[1][0]+' / >\
								<img id="close_pic_dic"   title="关闭窗口"     style="border:none;cursor:pointer;padding-right:2px;" src='+img_button[2][0]+' / >\
							</div>\
							<div style="text-align:center">\
								<img id="o_image" style="max-width:999999px;max-height:999999px;border:none;opacity:0;box-shadow:0 0 5px #000;-webkit-box-shadow:0 0 5px #000;" />\
							</div>';
			document.body.appendChild(pic_box);

			var load_div=document.createElement('div');
			load_div.id='load_div_';
			load_div.style.cssText='\
				z-index:99992;\
				margin:0;\
				padding:0;\
				position:absolute;\
				background-color:none;';
			var gif_back=document.createElement('div');
			gif_back.id='gif_back_';
			gif_back.style.cssText='\
				border:1px dashed #000;\
				margin:0;\
				padding:0;\
				background-color:#fff;\
				opacity:0.9;';
			var load_gif=document.createElement('img');
			load_gif.src='data:image/gif;base64,R0lGODlhEAAQAPQAAP///2FhYfv7+729vdbW1q2trbe3t/Dw8OHh4bKystHR0czMzPX19dzc3Ovr68LCwsfHxwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDQuMAAh/hVNYWRlIGJ5IEFqYXhMb2FkLmluZm8AIfkECQoAAAAsAAAAABAAEAAABVAgII5kaZ6lMBRsISqEYKqtmBTGkRo1gPAG2YiAW40EPAJphVCREIUBiYWijqwpLIBJWviiJGLwukiSkDiEqDUmHXiJNWsgPBMU8nkdxe+PQgAh+QQJCgAAACwAAAAAEAAQAAAFaCAgikfSjGgqGsXgqKhAJEV9wMDB1sUCCIyUgGVoFBIMwcAgQBEKTMCA8GNRR4MCQrTltlA1mCA8qjVVZFG2K+givqNnlDCoFq6ioY9BaxDPI0EACzxQNzAHPAkEgDAOWQY4Kg0JhyMhACH5BAkKAAAALAAAAAAQABAAAAVgICCOI/OQKNoUSCoKxFAUCS2khzHvM4EKOkPLMUu0SISC4QZILpgk2bF5AAgQvtHMBdhqCy6BV0RA3A5ZAKIwSAkWhSwwjkLUCo5rEErm7QxVPzV3AwR8JGsNXCkPDIshACH5BAkKAAAALAAAAAAQABAAAAVSICCOZGmegCCUAjEUxUCog0MeBqwXxmuLgpwBIULkYD8AgbcCvpAjRYI4ekJRWIBju22idgsSIqEg6cKjYIFghg1VRqYZctwZDqVw6ynzZv+AIQAh+QQJCgAAACwAAAAAEAAQAAAFYCAgjmRpnqhADEUxEMLJGG1dGMe5GEiM0IbYKAcQigQ0AiDnKCwYpkYhYUgAWFOYCIFtNaS1AWJESLQGAKq5YWIsCo4lgHAzFmPEI7An+A3sIgc0NjdQJipYL4AojI0kIQAh+QQJCgAAACwAAAAAEAAQAAAFXyAgjmRpnqhIFMVACKZANADCssZBIkmRCLCaoWAIPm6FBUkwJIgYjR5LN7INSCwHwYktdIMqgoNFGhQQpMMt0WCoiGDAAvkQMYkIGLCXQI8OQzdoCC8xBGYFXCmLjCYhADsAAAAAAAAAAAA='
			load_gif.style.cssText='\
				z-index:2;\
				position:absolute;\
				border:none;\
				top:50%;\
				left:50%;\
				margin-top:-8px;\
				margin-left:-8px;';
			load_div.addEventListener('mousemove',function(e){e.stopPropagation();},false);
			load_div.appendChild(load_gif);
			load_div.appendChild(gif_back);
			document.body.appendChild(load_div);

			var no_scale_width,no_scale_height;
			function pic_loadover(){
				closeit(false);
				full_pic();
				no_scale_width=o_image.width;
				no_scale_height=o_image.height;
				o_image.style.width=no_scale_width+'px';
				o_image.style.height=no_scale_height+'px';
				var zoomx=1;
				while((parseInt(o_image.style.width)>=(window.innerWidth-20) || parseInt(o_image.style.height)>=(window.innerHeight-50))){
					o_image.style.width=no_scale_width * zoomx+'px';
					o_image.style.height=no_scale_height * zoomx +'px';
					zoomx-=0.02;
				};
				pic_center();
				load_div.style.display='none';
			};

			var o_image=document.getElementById('o_image');
			o_image.addEventListener('load',pic_loadover,false);
			o_image.addEventListener('error',function(){load_div.style.display='none';},false);
			o_image.style.cssText+='\
				;-o-transition:opacity 0.5s ease-in-out;\
				-webkit-transition:opacity 0.5s ease-in-out;\
				-moz-transition:opacity 0.5s ease-in-out;';

			if(pset.black_div){
				var black_div=document.createElement('div');
				black_div.style.cssText='display:none;z-index:99994;background-color:black;opacity:0;position:absolute;top:0;left:0;width:100%;'
				black_div.style.cssText+='\
					;-o-transition:opacity 0.3s ease-in-out;\
					-webkit-transition:opacity 0.3s ease-in-out;\
					-moz-transition:opacity 0.3s ease-in-out;';
				black_div.addEventListener('click',function(){closeit(true)},false);
				document.body.appendChild(black_div);
			};

			function closeit(status){
				if(status){
					kill_click=true;
					o_image.style.opacity=0;
					pic_box.style.display='none';
					if(pset.black_div){
						black_div.style.opacity=0;
						black_div.style.display='none';
					};
				}else{
					kill_click=false;
					pic_box.style.display='';
					if(pset.black_div){
						black_div.style.display='';
						black_div.style.height=document.body.scrollHeight+'px';
					};
					setTimeout(function(){
						o_image.style.opacity=1;
						if(pset.black_div){
							black_div.style.opacity=0.8;
						};
					},0);
				};
			};

			var open_pic_dic=document.getElementById('open_pic_dic');
			open_pic_dic.addEventListener('mouseover',function(e){
				this.src=img_button[0][1];
			},false);
			open_pic_dic.addEventListener('mouseout',function(e){
				this.src=img_button[0][0];
			},false);
			open_pic_dic.addEventListener('click',function(e){
				e.preventDefault();
				window.open(o_image.src,'_blank');
			},false);

			var full_pic_dic=document.getElementById('full_pic_dic');
			full_pic_dic.addEventListener('mouseover',function(e){
				this.src=img_button[1][1];
			},false);
			full_pic_dic.addEventListener('mouseout',function(e){
				this.src=img_button[1][0];
			},false);
			full_pic_dic.addEventListener('click',function(e){
				e.preventDefault();
				full_pic();
				pic_center();
			},false);

			var close_pic_dic=document.getElementById('close_pic_dic');
			close_pic_dic.addEventListener('mouseover',function(e){
				this.src=img_button[2][1];
			},false);
			close_pic_dic.addEventListener('mouseout',function(e){
				this.src=img_button[2][0];
			},false);
			close_pic_dic.addEventListener('click',function(e){
				e.preventDefault();
				closeit(true);
			},false);
			document.addEventListener('keypress',function(e){if(e.keyCode==27){closeit(true);}},false);

			//点击还原/关闭图片
			o_image.addEventListener('click',function(){
				//修正opera10.1 chrome firefox的拖曳冲突
				if(!(window.opera && window.opera.version()>10.5)){if(ismoving){ismoving=false;return;};};
				if(o_image.style.width=='' || parseInt(o_image.style.width)==no_scale_width){
					closeit(true);
				}else{
					full_pic();
					pic_center();
				};
			},false);

			function full_pic(){
				o_image.style.removeProperty('width');
				o_image.style.removeProperty('height');
				o_image.removeAttribute('width');
				o_image.removeAttribute('height');
				zoom=1;
				img_wh=false;
			};

			//拖动UI
			var o_x,o_y,o_mouse_x,o_mouse_y,ismoving;
			function box_move(e){
				ismoving=true;
				pic_box.style.left=o_x+e.clientX-o_mouse_x+'px';
				pic_box.style.top=o_y+e.clientY-o_mouse_y+'px';
			};
			function box_move_over(e){
				document.removeEventListener('mousemove',box_move,false);
				document.removeEventListener('mouseup',arguments.callee,false);
			};
			pic_box.addEventListener('mousedown',function(e){
				e.preventDefault();
				if(e.button!=0){return;};
				o_x=parseInt(pic_box.style.left);
				o_y=parseInt(pic_box.style.top);
				o_mouse_x=e.clientX;
				o_mouse_y=e.clientY;
				document.addEventListener('mousemove',box_move,false);
				document.addEventListener('mouseup',box_move_over,false);
			},false);

			//滚轮缩放图片;
			var mouse_scroll_event;
			if(window.opera || window.chrome){
				mouse_scroll_event='mousewheel'
			}else{
				mouse_scroll_event='DOMMouseScroll'
			};
			var zoom=1,img_wh=false,img_o_height,img_o_width;
			pic_box.addEventListener(mouse_scroll_event,function(e){
				e.preventDefault();
				e.stopPropagation();
				if (!img_wh){
					img_o_width=parseInt(o_image.width);
					img_o_height=parseInt(o_image.height);
					img_wh=true;
				};
				if(e.wheelDelta){
					zoom+=e.wheelDelta>0? 0.05:-0.05;
				}else{
					zoom+=e.detail<0? 0.05:-0.05;
				};
				//if(img_o_width * zoom<210){zoom-=e.detail<0? 0.05:-0.05;return;};
				o_image.style.width=img_o_width * zoom+'px';
				o_image.style.height=img_o_height * zoom +'px';
				//让图片居中
				pic_center();
			},false);

			//使图片居中
			function pic_center(){
				var box_width=pic_box.offsetWidth;
				var box_height=pic_box.offsetHeight;
				pic_box.style.left=((window.innerWidth/pset.pagesize - box_width)/2+window.scrollX)+'px';
				pic_box.style.top=((window.innerHeight/pset.pagesize - box_height)/2+window.scrollY)+'px';
			};
		};
		var c_image=document.getElementById('o_image');
		//修复chrome上的点击同一张图片多次..而只有第一次显示的问题
		if (window.chrome){c_image.src='';}
		c_image.src=piclink;
		var load_div=document.getElementById('load_div_');
		var gif_back=document.getElementById('gif_back_');
		load_div.style.top=target_y+'px';
		load_div.style.left=target_x+'px';
		gif_back.style.width=target.offsetWidth+'px';
		gif_back.style.height=target.offsetHeight+'px';
		load_div.style.display='';
	};

	var piclink,target,icon_timeout,target_x,target_y;
	document.addEventListener('mousemove',function(e){
		//如果鼠标在图片和开关之间来回切换;
		var temp_target=e.target;
		if(temp_target==target || temp_target==clickimg){
			return;
		};
		kill_click=false;
		//或者在打开的图片上;
		if(pic_box && pic_box.style.display!='none'){
			//alert(matchNodes('ancestor-or-self::div',temp_target).snapshotLength);
			if(matchSingleNode('ancestor-or-self::div',temp_target)==pic_box){return};
		};
		target=temp_target;
		clearTimeout(icon_timeout);
		//如果移出当前图片,那么隐藏图片开关.
		if(clickimg){clickimg.style.display='none';};
		if(target.nodeName.toLowerCase()=='img'){
			//alert(target);
			piclink=null;
			var temp_click;
			for (var i=0,ii=Sites.length;i<ii;i++){
				if(Sites[i].site_regexp.test(URL) && Sites[i].enable){
					piclink=Sites[i].get_image();
					if(Sites[i].click && piclink){
						temp_click=true;
						target.addEventListener('click',view_o_pic,false);
					};
					break;
				};
			};
			//试图请求原图,因为的原图的src,所以不消耗宽带
			if(!piclink){
				var temp_image=new Image();
				temp_image.src=target.src;
				var t_width=parseInt(window.getComputedStyle(target,'').width);
				var t_height=parseInt(window.getComputedStyle(target,'').height);
				var ti_w=temp_image.width;
				var ti_h=temp_image.height;
				if(ti_w<pset.min && ti_h<pset.min){return;};
				//如果图片被缩放了,并且误差大于 pset.wucha;
				if((Math.abs(ti_w-t_width)>pset.wucha || Math.abs(ti_h-t_height)>pset.wucha)){
					piclink=target.src;
					if(pset.smart_click){
						var image_a=matchSingleNode('ancestor::a',target);
						if(!image_a){
							target.addEventListener('click',view_o_pic,false);
						}else{
							if(/\.(?:jpg|jpeg|png|gif|bmp)$/i.test(image_a.href)){
								target.addEventListener('click',view_o_pic,false);
							};
						};
					};
				};
				temp_image=null;
			};
			//如果连接的图片于缩略图相同,那么检查这个元素的a的指向
			if(!piclink){
				var image_a = matchSingleNode('ancestor::a',target);
				if(image_a){
					if(/\.(?:jpg|jpeg|png|gif|bmp)$/i.test(image_a.href)){
						piclink=image_a.href;
						if(pset.smart_click){
							target.addEventListener('click',view_o_pic,false);
						};
					};
				};
			};
			if(piclink){
				if(pset.smart_click || temp_click){
					target.removeAttribute('onclick');
					kill_click=true;
					try{
						matchSingleNode('ancestor::a',target).removeAttribute('onclick');
					}catch(e){};
				};
				target_x=target.getBoundingClientRect().left + window.scrollX;
				//alert(target_x)
				target_y=target.getBoundingClientRect().top + window.scrollY;
				//alert(target_y)
				icon_timeout=setTimeout(function(){create_clickimg()},pset.c_timeout);
			}
		}
	},false);
})();
