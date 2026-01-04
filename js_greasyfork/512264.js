// ==UserScript==
// @name        yande.re
// @version      2025.01.07
// @author       You
// @include     https://yande.re/*
// @description  good looking
// @license MIT
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1349340/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/515674/1516722/MyDownloader.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/512264/yandere.user.js
// @updateURL https://update.greasyfork.org/scripts/512264/yandere.meta.js
// ==/UserScript==
$(function(){
	Homepage()
	Listpage()
})
function Homepage(){
	class Home{
		static ChangePb(){
			let item = "";
			let css = {};
 
			item = '.content li';
			css = {
				'width': $(window).width() > $(window).height() ? '25% !important' : '50% !important',
				'height': 'auto !important',
			};
			window.GAIL.add_css(item,css);
 
			item = '.inner' ;
			css = {
				'width': '100% !important',
				'min-height': '50vh !important',
				'height': 'auto !important',
			};
			window.GAIL.add_css(item,css);
 
			item = '.content li a.thumb img';
			css = {
				'width': '100% !important',
				'height': 'auto !important',
			};
			window.GAIL.add_css(item,css);
			
			item = '.content li a.thumb';
			css = {
				'height': 'auto !important',
				'display':'block',
			};
			window.GAIL.add_css(item,css);
			
			css = `<style>
				.content li a.ajax.thumb::after{
					content:"loading";
					font-size:300%;
				}
				.content li a.ajax.thumb{
					border:1vw solid red;
				}
				div.sidebar{
					width:100% !important;
				}
				.sidebar a{
					font-size:10vmin;
				}
			</style>`
			$('body').append(css);
			
			if($(window).width()<$(window).height()){
				window.GAIL.add_css('div.content',{'width':'100% !important'});
				$('div.content').after($('.sidebar'));
			}
 
			$('a.thumb').attr('target','_blank').addClass("ajax");
			// $('a.thumb').each(async function(){
			// 	await Home.GetChildPost($(this));
			// });
			const atag = $('a.thumb');
			async function obo(i){
				if(i>=atag.length){
					return;
				}
				await Home.GetChildPost(atag.eq(i));
				obo(++i);
			}
			obo(0)
			
		}
		static AddKeyEvent(){
			let left = $('a.previous_page');
			let right = $('a.next_page');
			let down;
			let up;
			AddKeyControl(down,up,left,right,true);
		}
		static async GetChildPost(atag){
			//console.log(atag);
			const putImg = (img,href)=>{
				const tag = atag.clone();
				tag.attr('href',href);
				srcs.push(img[0].src);
				allImgs.add(tag.find('img'));
				// tag.find('img')[0].src = img[0].src;
				tag.removeClass('ajax');
				atag.after(tag);
				//Add_big_control(tag.find('img'));
			}
			atag.addClass("ajax");
			//Add_big_control(atag.find('img'));
			await new Promise((resolve)=>{
				$.ajax({
					url:atag[0].href,
					success:async function(data){
						const img = $(data).find("#image");
						if(img.length>0){
							srcs.push(img[0].src);
							allImgs.add(atag.find('img'));
							const ll = new LazyLoad();
							//await ll.Start(new Array(img[0].src),atag.find('img'));
							// atag.find('img')[0].src = img[0].src
						}
						const childs = $(data).find('a:contains("child post")');
						resolve(childs);
					}
				});
			})
			.then((childs)=>{
				if(childs.length==0){atag.removeClass('ajax');}
				childs.each(async function(){
					await new Promise(resolve=>{
						const href = this.href;
						$.ajax({
							url:href,
							success:function(data){
								const img = $(data).find('a.thumb').attr('target','_blank');
								atag.after(img);
								//putImg(img,href);
								resolve()
							},
							error:function(){
								resolve()
							}
						})
					})
				})
				atag.removeClass("ajax")
			});
		}
	}
	let srcs = [];
	let allImgs = $();
	Home.ChangePb();
	Home.AddKeyEvent();
}
function Listpage(){
	class List{
		static ChangePb(){
			CheckItemLoaded('#image').then(function(item){
				item.click(function(){
					document.title = '【comic】'+document.title;
					let name = document.title.match(/^[^\|]+/g)[0] + '.jpg';
					let src = this.src;
					let big = $('.original-file-unchanged');
					if(big.length==0){big = $('.original-file-changed');}
					if(big.length>0){
						src = big[0].href;
						name = document.title.match(/^[^\|]+/g)[0] + src.match(/\.[^\.]+$/g);
					}
					let actor = $('.tag-type-artist')
					if(actor.length>0 && actor.text()!=""){
						name = '【comic】' + actor.text() + new Date().getTime() + src.match(/\.[^\.]+$/g);
					}
					const newimg = $("<img />");
					newimg[0].onload = function(){
						//GM_download({src,name});
						newimg.click(function(){GM_download({url:src,name:name});});
					}
					newimg[0].src = src;
					item.after(newimg);
					List.DownloadImg(src,name);
				})
			})
			
			$('.sidebar+.content').before($('.sidebar'));
		}
		static DownloadImg(src,name){
			GM_download({
				url:src,
				name:name,
				onload:function(){alert("done")},
				onprogress:function(pro){
					window.GAIL.showmass((pro.loaded / pro.total * 100).toFixed(2) + "%")
					$(".mass_top").css("font-size","10vmin");
				}
			});
		}
	}
	const downloader = new Downloader();
	List.DownloadImg = (src,name)=>{downloader.Download_to_text(src,name+".txt");}
	List.ChangePb();
}
async function CheckItemLoaded(css){
	return new Promise((resolve,reject)=>{
		function check(){
			if($(css).length>0){resolve($(css));return;}
			setTimeout(()=>{
				check();
			},500);
		}
		check();
	})
}
 
let addedKeyControl = false;
function AddKeyControl(downItem,upItem,leftItem,rightItem,closew){
	if(addedKeyControl){return;}else{addedKeyControl = true;}
 
	if(!downItem){
		downItem = $('<a></a>').click(function(){
			// 获取当前窗口的滚动位置
			var currentScroll = document.documentElement.scrollTop;
 
			// 设置每次 PageDown 后滚动的距离，可以根据需要调整
			var scrollDistance = $(window).height()/2;
 
			console.log(currentScroll);
			// 使用 scrollTo 方法将窗口滚动到当前位置加上设定的滚动距离
			window.scrollTo(0,currentScroll + scrollDistance);
		})
	}
	if(!upItem){
		upItem = $('<a></a>').click(function(){
			// 获取当前窗口的滚动位置
			var currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
 
			// 设置每次 PageDown 后滚动的距离，可以根据需要调整
			var scrollDistance = window.innerHeight/2;
 
			// 使用 scrollTo 方法将窗口滚动到当前位置加上设定的滚动距离
			window.scrollTo(0,currentScroll - scrollDistance);
		})
	}
	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowLeft' && leftItem && leftItem.length>0) {
			// 用户按下了左箭头键
			leftItem[0].click();
			console.log('Left arrow key pressed');
			// 执行左方向键对应的操作
		} else if (event.key === 'ArrowRight' && rightItem && rightItem.length>0 ) {
			// 用户按下了右箭头键
			rightItem[0].click();
			console.log('Right arrow key pressed');
			// 执行右方向键对应的操作
		} else if (event.key === 'ArrowUp' && upItem && upItem.length>0) {
			// 用户按下了上箭头键
			upItem[0].click();
			console.log('Up arrow key pressed');
			// 执行上方向键对应的操作
		} else if (event.key === 'ArrowDown' && downItem && downItem.length>0) {
			// 用户按下了下箭头键
			downItem[0].click();
			console.log('Down arrow key pressed');
			// 执行下方向键对应的操作
		}else if (event.key === '0' && closew) {
			// 用户按下了下箭头键
			window.close();
			// 执行下方向键对应的操作
		}
	});
}
function Add_big_control(imgs){
	imgs.each(function(){
		const img = this;
		let showbox = $('.showbox_shouji');
		if(showbox.length==0){
			showbox = $('<div class="showbox_shouji"><img /></div>')
				.css({
					width:'100%',
					height:'100%',
					'position':'fixed',
					'top':0,
					'left':0,
					'z-index':999999,
					'background':'black'
				})
				.click(function(){
					$(this).hide();
				})
			showbox.find('img').css({
				'width':'100%',
				'max-height':'100vh',
				'object-fit': 'contain',
			})
			$('body').append(showbox.hide());
		}
		const bu = $('<div>B</div>').css({
				'position': 'absolute',
				'bottom': '0px',
				'color': 'white',
				'font-size': '10vw',
				'background': '#0000005e'
		})
		.click(function(event){
			event.preventDefault();
			showbox.show()
				.find('img').attr('src',img.src);
		})
		
		const parent = $(this).parent();
		if(parent.css("position")!="absolute"||parent.css("position")!="relative"){
			parent.css("position","relative");
		}
		parent.append(bu);
		
	})
}

function LazyLoad(){
	// let downloader = new window.GAIL.Downloader();
	let loadType = "ImgLoad";
	this.Set_laodType = (n)=>{loadType = n;};
	
	this.Start = async (srcs,imgs)=>{
		for(var i=0;i<imgs.length;i++){
			const img = imgs.eq(i);
			const src = srcs[i];
			if(loadType == "ImgLoad"){
				StartLoadOne(img);
				await ByLoadEvent(src);
				LoadedOne(src,img);
			}
		}
		AllOver();
	}
	function ByLoadEvent(src) {
		return new Promise((resolve, reject) => {
			const img = new Image(); // 使用 Image 构造函数
			img.onload = () => resolve(); // 使用箭头函数
			img.onerror = () => reject(); // 使用箭头函数
			img.src = src;
		});
	}
	let StartLoadOne = (img)=>{
		const p = $("<p>loading</p>");
		img.after(p);
	};
	this.OnStartLoadOne = (foo)=>{StartLoadOne = foo;}
	let LoadedOne = (src,img)=>{
		img.next("p").remove();
		img[0].src = src;
		console.log(src);
	};
	this.OnLoadedOne = (foo)=>{LoadedOne = foo;}
	let AllOver = ()=>{};
	this.OnAllOver = (foo)=>{AllOver = foo;};
}