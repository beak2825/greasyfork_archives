// ==UserScript==
// @name       danbooru 2.0 pc&手机版
// @namespace    http://tampermonkey.net/
// @version      20230108
// @description  修复下载bug
// @author       You
// @include      https://danbooru.donmai.us/*
// @include		https://cdn.donmai.us/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://code.jquery.com/jquery-3.5.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/512268/danbooru%2020%20pc%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512268/danbooru%2020%20pc%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

$(function() {
	class index_mode{
		change_pb(){
			$('a.post-preview-link').each(function(){
				var link = $(this).attr('href')
				$(this).click(function(){
					window.open(link)
				}).removeAttr('href').find('img').off('mouseleave')
				let name = document.title + '.png';
				let Getname = (img)=>{
					return name;
				}
				let GetBig = (callback)=>{
					$.ajax({
						url:link,
						success:function(data){
							let src = $(data).find('a.image-view-original-link')
							if(src.length!=0){
								src = src[0].href
							}else{
								src = $(data).find('#image')
								if(src.length!=0){
									src = src[0].src
								}else{
									src = null
								}
							}
							if(src){
								let getname = $(data).find('.artist-tag-list .search-tag:first');
								if(getname.length!=0){
									name = getname.text() + src.match(/\.jpg|\.jpeg|\.gif|\.png|\.webp/g)[0];
								}
							}
							console.log(src);
							callback(src)
						},
						error:function(){
							callback(null);
						}
					})
				}
				window.GAIL.hold_and_zoom($(this).find('img'),Getname,GetBig)
			})
			$('a.paginator-next').each(function(){
				$(this).parent().after($('<button>Next</button>').css({width:'100%',height:'20vh','font-size':'10vh'}).click(function(){
					$('a.paginator-next')[0].click()
				}))
			})
		}
	}
	var index = new index_mode
	index.change_pb()

	class list_mode{
		get_img(){
			var check = setInterval(function(){
				var close = function(){clearInterval(check);check=null}
				if($('a.image-view-original-link:not([ccc])').attr('class')){
					$('img').attr('src',$('a.image-view-original-link').attr('ccc','yes').attr('href'))
					//$('a.image-view-original-link').attr('ccc','yes')[0].click()
				}
				$('img:not([ccc])').each(function(){
					if($(this).width()==0||$(this).height()==0){return true}
					$(this).attr('ccc','yes')
					if($(this).width()<($(window).width()/2)||$(this).height()<100){return true}
					$(this).css({
						   'border-width': '5px',
						   'border-color': 'rgb(171, 147, 130)',
						   'border-style': 'dashed',
					})
					$(this).click(function(){
						document.title = '【comic】'+document.title.replace('【comic】','')
						if(window.location.href.indexOf('by_')>=0){
							document.title = '【comic】'+window.location.href.match(/by_.+/g)[0].replace('by_','').replace(/_[^_]+$/g,'')
						}else{
							if($('ul.artist-tag-list a.search-tag').text()!=''){
								document.title = '【comic】'+$('ul.artist-tag-list a.search-tag').text()
							}
						}
						download_img($(this))
					})
					close()
				})
			},100)
		}
	}
	var list = new list_mode
	list.get_img()
})

function download_img(imgs){
	function download_img_one(imgs,i){
		if(i<imgs.length){
			var src = imgs.eq(i).attr('src')
			var qianzui = window.location.href.match(/.+(?=\/[^\/]+)/g)[0]
			if(src.match(/(http)[^\/]+\/\/[^\/]+/g)==null){
				src = qianzui+src
			}

			var houzui = src
			if(src.indexOf('.')>=0){
				houzui = houzui.split('.')[src.split('.').length-1]
			}else{
				houzui = ''
			}

			if((new Array('jpg','jpeg','png','gif','bmg')).indexOf(houzui)<0){
				houzui = 'jpg'
			}
			var names = document.title+(i+1)+'.'+houzui
			console.log(names)
			console.log(src)
			GM_download({
				url:src,
				name:names,
				onload:function(){
					i = i+1
					download_img_one(imgs,i)
				},
				error:function(){
					console.log('下载错误：'+src)
					download_img_one(imgs,i)
				}
			})
		}else{show_mas_short('下载完毕')}
	}
	var i = 0
	download_img_one(imgs,i)
}
async function hold_and_zoom(img,name,GetBigImg){
	if(!$('.holdbox:first')[0]){
		$('body').append($('<div class="holdbox"></div>').css({
			'z-index':'9999999',
			width:'100vw',
			height:'100vh',
			position:'fixed',
			top:0,
			left:0,
			display:'flex',
			'justify-content':'center',
		}))
		$('.holdbox').hide()
		$('.holdbox').on('mousedown',function(e){
			if(e.button!=0){return}
			if(showimg){clearTimeout(showimg)}
			if(showimg){showimg = null}
			$('.holdbox:first').hide()
		}).on('mousewheel',function(){
			if(showimg){clearTimeout(showimg)}
			if(showimg){showimg = null}
			$('.holdbox:first').hide()
		})
	}
	hold_and_zoom_keyControler();

	var showimg = null
	var state = 'mouseout'
	img.on('mouseout',function(){
		state = 'mouseout'
	})
	let getting = false;
	img.on('mouseover',async function(event){
		state = 'mousemove'
		if(showimg){clearTimeout(showimg)}
		if(showimg){showimg = null}

		let _img = $(this);
		let iimg = $(this).clone();

		showimg = setTimeout(function(){
			if(state=='mouseout'){return}
			if(GetBigImg && img.attr('big-src')==null && !getting){
				new Promise((resolve,reject)=>{
					getting = true;
					GetBigImg(function(src){
						if(!src || src==""){console.log('src error');resolve()}else{
							getting = false;
							_img.attr('big-src',src).attr('src',src);
							let mass = $('<p>loading...</p>');
							_img.after(mass);
							let ioo = new Image();
							ioo.onload = function(){
								iimg.attr('src',src);
								console.log('src success');
								mass.remove();
								resolve();
							}
							ioo.src = src;
						}
					})
				})
			}
			$('.holdbox img').remove()
			$('.holdbox:first').append(iimg.css({
				width:'auto',
				height:'100vh',
			}).attr('name',name(_img)).on('mousedown',function(){
				var src = this.src
				var n = $(this).attr('name')
				if($(this).attr('big-src')){
					src = $(this).attr('big-src')
				}
				GM_download({
					url:src,
					name:n,
				})
			}))
			console.log('show');
			$('.holdbox').fadeIn(200)
		},500)

	})
}
let set_hold_and_zoom_keyControler = false;
function hold_and_zoom_keyControler(){
	    	if($==null && set_hold_and_zoom_keyControler==true){return};
	    	set_hold_and_zoom_keyControler = true;
	    	let zoom = 1;
	    	$(document).on('keydown',function(event){
	    		if(event.key === "+"){
	    			zoom+=0.5;
	    		}else if(event.key === "-"){
	    			zoom-=zoom==0.5?0:0.5;
	    		}
	    		$('.holdbox img').css('transform',`scale(${zoom}`);
	    	})
	    	$('.holdbox').on('mousemove',function(event){
	    		if(zoom<=1){return;}
	    		let imgh = $(this).children().height() * zoom;
	    		let imgw = $(this).children().width() * zoom;
	    		let wh = $(this).height();
	    		let ww = $(this).width();
	    		let y = 0;
	    		let x = 0;
	    		let mousey = event.clientY;
				let mousex = event.clientX;
				console.log(imgw + " " +ww)
	    		if(imgh > wh){
	    			let ps = (imgh - wh)/2 / (wh/2);
	    			y = ps * (wh/2-mousey) / zoom;
					console.log(y)
	    			$(this).children().css('transform',`scale(${zoom}) translate(${x}px,${y}px)`)
	    		}
				if(imgw > ww){
					let ps = (imgw - ww)/2 / (ww/2);
					x = ps * (ww/2-mousex) / zoom;
					console.log(x)
					$(this).children().css('transform',`scale(${zoom}) translate(${x}px,${y}px)`)
				}
	    	})
	    }
window.GAIL = {
	hold_and_zoom : hold_and_zoom,
}