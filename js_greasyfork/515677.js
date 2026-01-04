// ==UserScript==
// @name         MyShowBox
// @version      2025.04.24
// @description  修复touch就滚两页的bug
// @author       You
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// ==/UserScript==

if(window.GAIL == null || window.Downloader == null){alert("GAIL or Downloader is null");}

/**
 * 把图片全部添加到一个Showbox里的类,只能new一次
 * @class
 * @example
 const showBox = new ShowBox();
 showBox.Add(imgs);
 
 @ps Add函数只能调用一次
*/
function ShowBox(){
	let imgs = null;
	let num = 10;
	let showNum = num;
	let nowIndex = 0;
	/**
	 * @type {Downloader}
	*/
	let downloader = window.Downloader ? new window.Downloader() : (() => { throw new DOMException("Downloader does not exist"); })();
	let box = $('.clickShowBox').length > 0 ? $('.clickShowBox') : CreateShowBox()
	downloader.Set_downloadType("GM_download");
	
	this.downloader = {get obj(){return downloader;}}
	/**
	 * 把图片全部添加到一个Showbox里
	 * @example Add(imgs)
	 * @param {JQuery} iimgs
	 * @ps 只能调用一次，等图片获取完了再调用
	*/
	this.Add = (iimgs)=>{
		imgs = iimgs;
		AddImgs();
	}
	
	/**
	 * @example controlType = "mouse"
	*/
	this.controlType = "mouse";
	
	/**
	 * 设置一次预加载多少图片，默认是10
	 * @example SetShowNum = 20
	 * @param {number} n 
	 * @ps 未加载的图片src为空，只有small_src和big_src
	*/
	this.SetShowNum = (n) => {showNum = num = n;}
	
	/**
	 * @param {string} type - {GM_download / atag / blob}
	*/
	this.Set_donwloadType = (type)=>{downloader.Set_downloadType(type);}

	/**
	 * 重写下载图片的方法
	 * @example SetDonloadFunction((imgs)=>{...})
	 * @param {function(JQuery)} foo - (imgs)=>{}
	*/
	this.SetDonloadFunction = (foo)=>{downloader.Download_img = foo;}
	
	function AddImgs(){
		imgs.each(function(){
			const item = $('<div class="item"></div>')
				.append($('<img>').attr({'small_src':this.src,src:"",'big_src':$(this).attr('big_src')}));
			$('.clickShowBox').append(item);
		})
		ClickShowNext({img:$('img'),onlyDown:false});
	}
	function CreateShowBox(){
		let box = `
		<div class="clickShowBox">
			<p class="pages">1/10</p>
			<button class="close">x</button>
			<div class="downloadBU">
				<button class="download">↓</button>
				<button class="downloadall">↓↓</button>
			</div>
		</div>
		<div class="clickShowBox_ShowBu"></div>
		`
		box = $(box);
		$('body').prepend(box);
		
		$('.clickShowBox .close').click(function(){
			$('.clickShowBox').fadeOut();
			$('.clickShowBox_ShowBu').show()
		})
		$('.clickShowBox_ShowBu').click(function(){
			$('.clickShowBox').fadeIn();
			$(this).hide();
			Show_imgs(num);
		})
		$('.clickShowBox .download').click(function(){
			BU_nomal($(this))
			const img = $('.clickShowBox .item img').eq(nowIndex);
			let src = img[0].src;
			if(img.attr('big_src')){
				src = img.attr('big_src');
				img[0].src = src;
			}
			let name = document.title + new Date().getTime() + src.match(/\.jpg|\.jpeg|\.webp|\.png/g)[0];
			if(img.attr('name')){
				name = img.attr('name');
			}
			BU_busy($(this))
			try{
				GM_download({
					url:src,
					name:name,
					onload:function(){
						BU_done($('.download'));
					},
					error:function(){
						BU_error($('.download'));
					}
				})
			}catch(error){
				console.log(error);
				BU_error($('.download'));
			}
		})
		
		$('.clickShowBox .downloadall').click(function(){
			BU_busy($(this));
			try{
				console.log(downloader)
				downloader.Download_img($('.clickShowBox .item img'));
			}catch(error){
				console.log(error);
				BU_error($(this));
			}
		})
		downloader.AllComplete(()=>{
			BU_done($('.clickShowBox .downloadall'));
		});
		downloader.OneSuccess((img)=>{
			var src = img.attr('big_src') || img.attr('big-src') || null;
			console.log(src);
			if(!src){return;}
			img.attr('src',src);
			// $('.clickShowBox .item img').filter(function(){return $(this).attr('big_src')||$(this).attr('small_src') == img[0].src})
			// 							.attr('src',img[0].src);
		});
		Add_ClickShowBox_css();
		$('.clickShowBox').hide();
		Add_keyControl()
		return box;
	}
	
	function Add_ClickShowBox_css(){
		let css = `
		.clickShowBox{
			width: 100%;
			height: 100%;
			background-color: #2d2d2d;
			overflow: hidden;
			border-radius: 0vw;
			position: fixed;
			z-index: 9999;
		}
		.clickShowBox .item{
			width: 100%;
			height: 100%;
			background-color: #2D2D2D;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.clickShowBox .item img{
			max-width: 100%;
			height: auto;
			max-height: 100%;
		}
		.clickShowBox .pages{
			font-size: 5vw;
			color: rgba(255,255,255,0.5);
			position: fixed;
			top: 1.5vw;
			margin: 2vw;
			right:12vw
		}
		.clickShowBox .close{
			width: 10vw;
			height:10vw;
			font-size: 6vw;
			border-radius: 10vw;
			background-color: rgba(255,255,255,0.1);
			color: rgba(255,255,255,0.1);
			position: fixed;
			right: 0;
			top:0;
			margin: 2vw;
			font-weight: bold;
			border: none;
		}
		.clickShowBox .close:active{
			filter:invert(100%);
		}
		.clickShowBox .downloadBU{
			display: flex;
			flex-direction: row;
			position: fixed;
			bottom:0;
		}
		.clickShowBox .download
		,.clickShowBox .downloadall{
		    width:100%;
			font-size: 5vmin;
			aspect-ratio: 1/1;
			border-radius: 2vmin;
			background-color: #ff8a17;
			color: white;
			margin: 0 0 2vw 2vw;
			border: none;
			opacity: .4;
			position: relative;
		}
		.clickShowBox .download:active
		,.clickShowBox .downloadall:active{
			opacity: .6;
		}
		.clickShowBox .busy{
			animation: BU_busy infinite 1s linear;
		}
		@keyframes BU_busy{
			0%{top:0}
			25%{top:2vw}
			75%{top:-2vw}
			100%{top:0}
		}
		.clickShowBox .error{
			background-color: red;
		}
		.clickShowBox_ShowBu{
			width: 10vw;
			height: 10vw;
			border-radius: 10vw;
			background-color: orange;
			position: fixed;
			bottom: 30%;
			right: -5vw;
			z-index: 999999;
			display: flex;
			align-items: center;
			justify-content: center;
	
		}
		.clickShowBox_ShowBu::after{
			content: "";
			width: 70%;
			height: 70%;
			background-image: url('data:image/svg+xml;utf8,<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M 10 10 L 0 5 L 10 0 Z" fill="White"/></svg>');
			background-size: cover;
			background-repeat: no-repeat;
			transform: scaleX(0.8);
		}
		`
		Add_css(css)
	}
	function BU_busy(bu){
		bu.addClass('busy');
	}
	function BU_done(bu){
		bu.removeClass('busy');
	}
	function BU_error(bu){
		bu.removeClass('busy');
		bu.addClass('error');
	}
	function BU_nomal(bu){
		bu.removeClass('busy').removeClass('error');
	}
	
	function Add_keyControl(){
		let downItem = $('<button><button>').click(function(){
			simulateClick($(window).width()/2,$(window).height()*0.8);
		})
		let upItem = $('<button><button>').click(function(){
			simulateClick($(window).width()/2,$(window).height()*0.2);
		})
		window.GAIL.AddKeyControl(downItem,upItem,null,null,true);
	}
	
	function ClickShowNext({img,onlyDown}){
		if(!$){return;}
		if(img.length<=1){console.log('only one img');return;}
		let item = $('.clickShowBox .item');
		$('.clickShowBox .pages').text(1+"/"+item.length);
		item.on("touchstart mousedown",function(event){
			if ($(window).height()>$(window).width() && event.type === 'mousedown'){return;}
			let y = event.clientY;
			if(event.touches){y = event.touches[0].clientY;}
			let index = item.index($(this));
			index = !onlyDown && y<$(this).height()/2 ? index-1:index+1;
			index = index>=0?Math.min(index,item.length-1):0
			item.eq(index)[0].scrollIntoView();
			$('.clickShowBox .pages').text((index+1)+"/"+item.length);
			nowIndex = index;
			Show_imgs(showNum);
		});
	}
	function Show_imgs(i){
		let img = $('.clickShowBox .item img[small_src][src=""]');
		let start = Math.max(0,nowIndex-i);
		let end = Math.min(img.length,nowIndex+i);
		img.slice(start,end).each(function(){
			this.src = $(this).attr('small_src');
		});
		console.log(`${start} ${end} ${img.length}`)
	}
	function Add_css(cssString){
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = cssString;
		document.body.appendChild(style);
	}
}

window.ShowBox = ShowBox;

window.ShowBox.ShowInNewPage = (url)=>{
	GM_setValue('ShowBoxInNewPage','yes');
	window.open(url);
	const img = $('.clickShowBox img');
	GM_setValue('ShowBoxInNewPage_img',img.eq(0)[0].src);
	GM_setValue('ShowBoxInNewPage_num',img.length);
	let i = 1;
	let obo = setInterval(()=>{
		if(i==img.length){clearInterval(obo);return;}
		if(!GM_getValue('ShowBoxInNewPage_img')){
			GM_setValue('ShowBoxInNewPage_img',img.eq(++i).html());
		}
	},100);
}
window.ShowBox.Linsening_ShowInNewPage = ()=>{
	if(!GM_getValue('ShowBoxInNewPage')){
		return;
	}
	GM_deleteValue('ShowBoxInNewPage');
	const box = new window.ShowBox();
	let i = 0;
	let img = ''
	const num = Number(GM_getValue('ShowBoxInNewPage_num'));
	let obo = setInterval(()=>{
		if(i==num){GM_deleteValue('ShowBoxInNewPage_num');box.AddImgs($(img));clearInterval(obo);return;}
		if(GM_getValue('ShowBoxInNewPage_img')){
			img += GM_getValue('ShowBoxInNewPage_img')
			GM_deleteValue('ShowBoxInNewPage_img');
		}
	},100);
}
$(function(){
	window.ShowBox.Linsening_ShowInNewPage();
})