// ==UserScript==
// @name         MaxShowBox
// @version      2025.02.06
// @description  最大程度显示图片的库
// @author       You
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// ==/UserScript==
 
/**
 * 让图片放大到原始或满屏大小
 * @class
 * @example
 const maxShowBox = new MaxShowBox();
 MaxShowBox.Add_Img(img);
 
 @ps 每调用一次Add_Img显示一次Img;
*/
function MaxShowBox(){
	const box = `<div class="max-show-box">
				<button class="closeBox">X</button>
				</div>
	           <style>
			       .max-show-box{
					   width:100vw;
					   height:100vh;
					   overflow:auto;
					   z-index:9999;
					   position:fixed;
					   top:0;
					   left:0;
					   background:#434343;
				   }
				   .max-show-box button{
					   width:20vmin;
					   height:20vmin;
					   border-radius:50%;
					   position:fixed;
					   bottom:0;
					   left:50%;
					   transform:translateX(-50%);
					   background: #272727;
					   color: #ffffff;
					   opacity: .5;
					   border: none;
				   }
				   .max-show-box img{
					   min-width:100vw;
					   min-height:100vh;
					   max-width:none;
					   max-height:none;
					   width:auto !important;
					   height:auto !important;
				   }
			   </style>
	`
	/**
	 * 最大显示一张图片
	 * @param {JQuery} img
	 * @example maxShowBox.Add_Img(img);
	*/
	this.Add_Img = (img)=>{
		CreatBox();
		Add_Img(img);
	}
	function CreatBox(){
		if($('.max-show-box').length==0){
			$('body').append(box);
			$('.max-show-box').hide();
			$('.max-show-box .closeBox').click(function(){
				$('.max-show-box').fadeOut();
			});
		}
	}
	function Add_Img(img){
		const newimg = $('<img />').attr('src',img[0].src);
		$('.max-show-box img').remove();
		$('.max-show-box').append(newimg);
		$('.max-show-box').fadeIn();
	}
	
	let autoRun = false;
	/**
	 * 自动给图片加一个最大显示按钮，由body touchstart触发
	 * @param null
	 * @example maxShowBox.StartAutoRun();
	*/
	this.StartAutoRun = ()=>{
		autoRun = true;
		$('body').on('touchstart',()=>{
			if(!autoRun){return;}
			$('img:not([add-max-show-box]):not(.max-show-box img)').each(function(){
				$(this).attr('add-max-show-box','yes');
				const parent = $(this).parent();
				if(parent.css("position")!="absolute"||parent.css("position")!="relative"){
					parent.css("position","relative");
				}
				
				const img = $(this);
				const bu = $('<div>B</div>').css({
								'position': 'absolute',
								'bottom': '0px',
								'color': 'white',
								'font-size': '10vw',
								'background': '#0000005e'
						})
				img.after(bu);
				bu.click(function(event){
						event.stopPropagation();
						maxShowBox.Add_Img(img);
						ScrollToCenter($('.max-show-box'));
					});
			});
		});
	}
	/**
	 * 停止给图片加一个最大显示按钮
	 * @param null
	 * @example maxShowBox.StopAutoRun();
	*/
	this.StopAutoRun = ()=>{autoRun = false;}
	
	function ScrollToCenter(item){
		const sh = item[0].scrollHeight;
		const ch = item[0].clientHeight;
		const y = (sh-ch)/2;
		const sw = item[0].scrollWidth;
		const cw = item[0].clientWidth;
		const x = (sw-cw)/2;
		item[0].scrollTop = y;
		item[0].scrollLeft = x;
	}
}
const maxShowBox = new MaxShowBox();
window.MaxShowBox = maxShowBox;