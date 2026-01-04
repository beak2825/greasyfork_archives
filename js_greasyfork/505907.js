// ==UserScript==
// @name        cosppi
// @version      2024.08.17
// @author       You
// @description   good
// @include     https://cosppi.net/*
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/505907/cosppi.user.js
// @updateURL https://update.greasyfork.org/scripts/505907/cosppi.meta.js
// ==/UserScript==

$(function(){
	//alert()
	ChangeList();
	AddZoomKeystart();
	if($(window).height()>$(window).width()){
		ChangePb();
	}
})
function ChangeList(){
	$('.img_a.img_all').each(function(){
		let img = $(this).find('img');
		if(img.length==0){return true;}
		let href = this.href;
		if(!href){href = $(this).attr('data-link');}
		let GetGig = (callback)=>{
			callback(href);
			// $.ajax({
			// 	url:href,
			// 	success:function(data){
			// 		let big = $(data).find('#image-container img');
			// 		if(big.length==0){callback(null);}
			// 		callback(big[0].src);
			// 	},
			// 	error:function(){callback(null);}
			// });
		}
		let Getname = (img)=>{
			return $('.prof_name').text().replace(/[0-9]/g,'')+ href.match(/\.jpg|\.jpeg|\.png|\.webp|\.gif|\.mp4|\.wmp/g)[0];
		}
		if($(window).height()>$(window).width()){
			if(href.match('video')){return;}
			img.parent('a').removeAttr('href');
			let GetBigAndName = (callback)=>{
				callback(href,Getname(img));
			}
			window.GAIL.Shouji_LazyLoad(img,GetBigAndName);
			return;
		}
		window.GAIL.hold_and_zoom(img,Getname,GetGig)
	})
}
function ChangePb(){
	let css = ".img_wrapper";
	let csso = {
		'width':'100% !important',
	};
	window.GAIL.add_css(css,csso);
}
function AddZoomKeystart(){
	let check = setInterval(function(){
		let zoombox = $('.holdbox')
		if(zoombox.length!=0){
			AddZoomKey();
			clearInterval(check);
			check = null;
		}
	},100)
}
function AddZoomKey(){
	let x = 0;
	let y = 0;
	let s = 1;
	$(document).on('keydown',function(event){
		if(event.key === "+"){
			s*=1.5;
		}else if(event.key === "-"){
			s/=1.5;
		}else if(event.key === "5"){
			y+=10;
		}else if(event.key === "8"){
			y-=10;
		}else if(event.key === "4"){
			x-=10;
		}else if(event.key === "6"){
			x+=10;
		}
		$('.holdbox').find('img').css('transform', `scale(${s}) translate(${x}px, ${y}px)`);
	})
}
function add_css(tag,object){
	var style = $('<style></style>').text(tag+JSON.stringify(object).replace(/\"/g,'').replace(/,/g,";"))
	$('body').append(style)
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
		if(GetBigImg && img.attr('big-src')==null && !getting){
			new Promise((resolve,reject)=>{
				getting = true;
				GetBigImg(function(src){
					if(!src || src==""){console.log('src error');resolve()}else{
						if(src.match(/\.mp4/g)){
							let video = $('<video controls autoplay></video>').attr('src',src);
							let videoDowned = false;
							video.on("playing",function(){
								if(!videoDowned){videoDowned=true;}else{return;}
								GM_download({
									url:src,
									name:name(video),
								})
							})
							iimg = video;
						}else{
							_img.attr('big-src',src).attr('src',src);
							iimg.attr('src',src);
						}
						getting = false;
						console.log('src success');
						resolve()
					}
				})
			})
		}


		showimg = setTimeout(function(){
			if(state=='mouseout'){return}
			$('.holdbox').children().remove()
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
const LoadState = Object.freeze({
	loading:"loading",
	loaded:"loaded",
	unload:"unload"
})
function Shouji_LazyLoad(img,GetBigImg_and_name){
	let p = $("<p>loading</p>").css({
		'font-size': 'large',
		'position': 'absolute',
		'bottom': '0px',
	});
	img.after(p);
	p.hide();
	let loadstate = LoadState.unload;
	img.click(async function(event){
		let src = this.src;
		let ext = src.match(/\.png|\.jpg|\.jpeg|\.gif|\.webp/g)
		let name = document.title + ext.length>0?ext[0]:".png";
		if(GetBigImg_and_name){
			await new Promise((resolve)=>{
				GetBigImg_and_name(function(bigsrc,downname){
					src = bigsrc;
					name = downname;
					resolve();
				})
			});
		}
		p.text('loading').show();

		if(loadstate == LoadState.unload){
			let lazy = new Image();
			lazy.onload = function(){
				loadstate = LoadState.loaded;
				img[0].src = src;
				p.text("downing")
				GM_download({
					url:src,
					name:name,
					onload:function(){
						p.text("end");
					}
				})
			}
			lazy.onerror = function(){
				p.text("error");
				loadstate = LoadState.unload;
			}
			lazy.src = src;
		}else if(loadstate == LoadState.loaded){
			img[0].src = src;
			p.text("downing")
			GM_download({
				url:src,
				name:name,
				onload:function(){
					p.text("end");
				}
			})
		}

	})
}
window.GAIL = {
	hold_and_zoom:hold_and_zoom,
	Shouji_LazyLoad:Shouji_LazyLoad,
	add_css:add_css,
}