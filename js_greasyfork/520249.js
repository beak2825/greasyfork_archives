// ==UserScript==
// @name        hitomi 3.0 手机版
// @namespace    http://tampermonkey.net/
// @version      2025.03.01
// @description  修改回去在父窗口下载
// @author       You
// @include      https://hitomi.la/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1476440/Get_all_img_Library.js
// @downloadURL https://update.greasyfork.org/scripts/520249/hitomi%2030%20%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520249/hitomi%2030%20%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

$(function(){
	if(window.location.href.indexOf('reader')>0){
		const list = NewList();
		list.Start();
	}else{
		const home = NewHome();
		home.Start();
	}
	document.addEventListener('touchstart',function(){
		Open_readerPage();
	})
})
function NewHome(){
	//从外部绑定GAIL函数，之所以在外部绑定是为了清楚看到当前类需要依赖的外部函数
	class H extends Home{
		async Get_img_obo_iframe(key,nums,Geturl,Getimg,Putimg){
			const gi = new window.GAIL.Get_img_obo_iframe(key,nums,Geturl,Getimg,Putimg);
			await gi.Start();
			console.log('geted');
		}
	}
	//return new H();
	let HH = NewHome1(new H());  //增加下载按键
	HH = NewHome2(HH);  //2025-02-26 增加搜索页的点击打开逻辑和搜索页就可以预览
	return HH;
}
function NewHome1(h){
	//增加一个下载按钮，并在list加载完后自动下载
	let hh = h;
	const oldStart = hh.Start.bind(hh);
	hh.Start = ()=>{
		oldStart();
		const bu = hh.Add_downloadBU();
		if(GM_getValue("hitomi download")){
			bu.click();
			GM_deleteValue("hitomi download");
		}
	}
	hh.Add_downloadBU = ()=>{
		const bu = `
			<button class="downloadBU">download</button>
			<style>
				.downloadBU{
					position: absolute;
					top: 30vmin;
					right: 5px;
					padding: 4px;
					background-color: #999999;
					border-radius: 4px;
					color: white;
					border: none;
				}
			</style>
		`
		$('.cover-column').append(bu);
		$('.downloadBU').click(function(){
			Check_download();
			if(NewList){NewList().Flash_gallery_donwloadBU_progress();}
		})
		return $('.downloadBU');
	}
	return hh;
}
function NewHome2(h){
	//2025-02-26 增加搜索页的点击打开逻辑和搜索页就可以预览
	h.ChangeAtag = ()=>{
		$('.gallery-content').on('touchstart',function(){
			$('.gallery-content').children("*:not([changeAtag])").each(function(){
				$(this).attr("changeAtag","yes");
				$(this).find('a').attr('target','_blank');
				h.Add_thumb($(this));
			});
		})
	}
	h.Add_thumb = (item)=>{
		const box = `
			<div class="thumb-showbox-bu">预览</div>
			<div class="thumb-container"></div>
			<style>
				.thumb-showbox-bu{
					width:100%;
					height:auto;
					font-size:5vh;
					text-align:center;
				}
				.thumb-container{
					width:100%;
					height:auto;
				}
				.thumb-container img{
					transform:none;
				}
			</style>
		`
		item.find("table").after(box);
		const container = item.find(".thumb-container");
		const bu = item.find('.thumb-showbox-bu');
		container.hide();
		bu.click(function(){
			container.slideToggle()
			if(container.children().length==0){
				const atag = item.find(".lillie a");
				if(atag.length==0){return;}
				container.append("<p>loading</p>")
				h.Get_thumbImg(atag[0].href)
					.then(imgs=>{
						container.children().remove();
						container.append(imgs);
					})
			}
		});
		const top = $('<img style="height:0px;top:0;position:absolute;"/>');
		item.prepend(top);
		container.click(function(){
			top[0].scrollIntoView();
			$(this).slideToggle();
		});
	}
	h.Get_thumbImg = (href)=>{
		return new Promise((rs,rj)=>{
			if(NewList){
				const lt = NewList();
				lt.Add_iframe(href)
					.then(iframe=>{
						const th = ()=>$(iframe.contentWindow.document).find(".thumbnail-list")
						lt.WaitingElement(th)
							.then(th=>{
								rs(th.find('img').clone());
								$(iframe).remove();
							})
					})
			}else(rj())
		})
	}
	
	const OldS = h.Start.bind(h);
	h.Start = ()=>{
		h.ChangeAtag()
		OldS();
	}
	return h;
}

class Home{
	Start(){
        let h = this;
		const bu = h.Add_obo_bu()
		bu.on('touchstart',function(event){
			event.stopPropagation();
			$('.gallery-content').hide();
		    h.Get_all_books_bu_click_event()
				.then(()=>{return h.Get_all_books()})
				.then(h.ChangPB)
				.then(h.SortItems)
				.then(()=>h.Del_theSame())
				.then(()=>$('.gallery-content').show())
		});
	}
	Add_obo_bu(){
		let bu = `
			<button class="get-all-books-bu">获取列表</button>
			<style>
				.get-all-books-bu{
					width: 40vmin;
					height: 40px;
					font-size: 6vmin;
					top: 0;
					right: 100px;
					position: absolute;
				}
			</style>
		`
		$('body').append(bu);
		return $('.get-all-books-bu');
	}
	Get_all_books_bu_click_event(){
		return new Promise(resolve=>resolve());
	}
	async Get_all_books(){
		const key = "";
		const li = $('.page-container.page-top li:not(*:has(a))').nextAll('li:has(a)');
		if(li.length==0){return;}
		let now = Number(li.first().find('a').text());
		const nums = Number(li.last().find('a').text()) - now + 1;
		const Geturl = (i)=>{
			return li.first().find('a')[0].href.replace(/\d+$/g,(now+i));
		}
		const Getimg = (doc)=>{
			return $(doc).find('.gallery-content').children();
		}
		const Putimg = (img,i)=>{
			$('.gallery-content').append(img);
		}
		await this.Get_img_obo_iframe(key,nums,Geturl,Getimg,Putimg);
	}
	async Get_img_obo_iframe(key,nums,Geturl,Getimg,Putimg){
		console.log('Home.Get_img_obo_iframe is undefined');
	}
	ChangPB(){
		const css = `
		<style>
			.dj-img-cont>div {
			    position: relative;
			    left: 0;
			    width: 40%;
			}
			.dj-img-cont {
			    display: flex;
			    left: 0;
			}
			.dj-img-back {
			    display: none;
			}
			.sameKard{
				width: calc(100% - 20px);
				display: grid;
				grid-template-columns: repeat(5, 1fr);
				padding: 10px;
			}
			.sameKard img{
				width:100%;
			}
		</style>
		`
		$('body').append(css);
	}
	SortItems(){
		$('.gallery-content').children().each(function(){
			const a = $(this).find('h1.lillie a').attr('target','_blank');
			if(a.length==0){return true;}
			let title = a[0].title;
			if(!title){title = a.text();}
			//Iyarase!!DairokuKuchikutai!!
			//Iyarase!!DaiRokuKuchikutai!!
			title = title.replace(/\|.+$/g,"").replace(/\(.+$/g,"").replace(/[ \-\!\.!~]/g,"").toLowerCase();;
			a.text(title);
		})
		const SortItems = $('.gallery-content').children().sort(function(a, b) {
		  const titleA = $(a).find('h1.lillie a').text();
		  const titleB = $(b).find('h1.lillie a').text();
		
		  // 使用localeCompare()方法进行文字排序
		  return titleA.localeCompare(titleB);
		});
		$('.gallery-content').children().remove();
		$('.gallery-content').append(SortItems);
	}
	Del_theSame(){
		let hs;
		let h = this;
		$('.gallery-content').children().each(function(){
			const title = $(this).find('h1.lillie a').text();
			if(title!=hs){hs = title;}else{
				h.Add_sameKard(this);
			}
		})
	}
	Add_sameKard(item){
		const src = $(item).find('.dj-img-cont img:first')[0].src;
		const href = $(item).find('h1.lillie a')[0].href;
		const img = $('<img />').attr('src',src);
		const a = $('<a target="_blank"></a>').attr('href',href).append(img);
		let box = $(item).prev('.sameKard');
		if(box.length==0){
			box = $('<div class="sameKard"></div>');
			$(item).after(box);
		}
		box.append(a);
		$(item).remove();
	}
}

function NewList(){
	//return (new List());
	const ll = NewList1(new List());
	return ll;
}
function NewList1(l){
	let ll = l;
	const oldStart = ll.Start.bind(ll);
	ll.Start = ()=>{
		oldStart();
		const downloadBU = ll.Add_downloadBU();
		ll.Auto_download();
		ll.Touch_control();
		ll.Auto_touch();
	}
	ll.Add_downloadBU = ()=>{
		const bu = `
			<button id="dl-button">download</button>
			<div id="progressbar" style="display:none"></div>
			<style>
				#dl-button,#progressbar{
					height: 40px;
					min-width:30vmin;
					font-size: 6vmin;
					top: 0px;
					right: 100px;
					position: absolute;
					border-radius: 100px;
					background: #11750e;
					border: none;
					color: white;
					overflow:hidden;
				}
				#progressbar>*{
					height:100%;
					background:#ffff00;
				}
			</style>
		`
		$('body').append(bu);
		$('#dl-button').on('touchstart',()=>{
			ll.DownloadBU_Event();
		})
	}
	ll.gallery_iframe = null;
	ll.DownloadBU_Event = ()=>{
		const parent = window.opener;
		if(parent){
			const bu = $(parent.document.body).find(".downloadBU");
			if(bu.length==0){alert("download button is no find");return;}
			bu.click();
			ll.Get_download_progress(parent);
		}else{
			GM_setValue("hitomi download","yes")
			ll.Add_Gallery_iframe()
				.then(ll.Get_download_progress)
		}
	}
	ll.Add_Gallery_iframe = ()=>{
		return new Promise(resolve=>{
			const atag = ()=>$('.gallery-link a');
			ll.WaitingElement(atag)
				.then(tag=>{
					return tag[0].href;
				})
				.then(ll.Add_iframe)
				.then(iframe=>{
					if(ll.gallery_iframe){
						$(ll.gallery_iframe).remove();
						ll.gallery_iframe = null;
					}
					ll.gallery_iframe = iframe;
					resolve(iframe);
				});
		});
	}
	ll.Get_download_progress = (iframe)=>{
		return new Promise(resolve=>{
			let progress = ()=>$(iframe.contentWindow.document).find('#progressbar')
			if(iframe.document){progress = ()=>$(iframe.document.body).find('#progressbar')}
			ll.WaitingElement(progress)
				.then(atag=>{
					const check = setInterval(()=>{
						let w = atag.attr('aria-valuenow');
						if(w){
							w = Math.floor(Number(w)) + "%";
							$('#dl-button').text(w);
						}
						if(w=="100%"){resolve();clearInterval(check)}
					},1000)
				});
		});
	}
	ll.Flash_gallery_donwloadBU_progress = ()=>{
		const atag = $("#progressbar");
		const check = setInterval(()=>{
			if(atag.length==0){return;}
			let w = atag.attr('aria-valuenow');
			if(w){
				w = Math.floor(Number(w)) + "%";
				$('.downloadBU').text(w);
			}
			if(w=="100%"){resolve();clearInterval(check)}
		},1000)
	}
	ll.Auto_download = ()=>{
		const img = ()=>$('.lt-showbox img:first')
		ll.WaitingElement(img)
			.then(iimg=>{
				let downloaded = false;
				iimg[0].onload = function(){
					if(downloaded){return}
					downloaded = true;
					const touchstart = new TouchEvent('touchstart',{bubbles:true});
					$('#dl-button')[0].dispatchEvent(touchstart);
				}
			})
	}
	ll.Touch_control = ()=>{
		const css = `
		<style>
			.up-and-down{
				top: auto !important;
				bottom: 50vmin !important;
			}
			.up-and-down span{
				width: 50vw !important;
				height: 30vmax !important;
			}
		</style>
		`
		$('body').append(css);
		ll.WaitingElement(()=>$('.big-and-small'))
			.then(a=>{
				$('.big-and-small').on('touchstart',function(){
					const sc = $('.lt-showbox img:visible').css('--scale');
					console.log(sc,sc==1,sc=="1");
					if(sc==1){$('.up-and-down').show()}else{$('.up-and-down').hide()}
				})
			})
		return;
		const atag = ()=>$('.lt-showbox');
		ll.WaitingElement(atag)
			.then(atag=>{
				$('.lt-showbox').on('touchstart',function(event){
					const y = event.touches[0].clientY;
					console.log(y,$(window).height()/2)
					
					// 创建一个触摸事件对象
					var touchEvent = new TouchEvent('touchstart', {
					    bubbles: true,
					    cancelable: true
					});

					if(y<$(window).height()/2){
						$('.up-and-down:first span:first')[0].dispatchEvent(touchEvent);
					}else{
						$('.up-and-down:first span:last')[0].dispatchEvent(touchEvent);
					}
				})
			})
	}
	ll.Auto_touch = ()=>{
		if(window.frameElement && window.frameElement.tagName==="IFRAME"){}else{
			const touchstart = new TouchEvent("touchstart",{bubbles:true});
			$('.start')[0].dispatchEvent(touchstart);
		}
	}
	return ll;
}

function List(){
	const lt = this;
	lt.Start = function(){
		const th = NewThumb();
		const sb = NewShowbox();
		const bu = lt.Add_start_bu();
		bu.on('touchstart',async function(){
			bu.hide();
			await th.LoadThumb();
			sb.Add_show_box();
			lt.GetPageCount().then(pages=>{
				sb.Add_blank_Img_to_showbox(pages);
				sb.Show_img(0);
			})
		})
	}
	lt.Add_start_bu = ()=>{
		let bu = `
			<button class="start">start</button>
			<style>
			button.start{
				width:100vw;
				height:100vh;
				position:fixed;
				top:0;
				left:0;
				z-index:9999;
			}
			</style>
		`
		$('body').append(bu);
		return $('.start');
	}

	function NewThumb(){
		return (NewThumb2())
		const th = new Thumb();
		return th;
	}
	function NewThumb2(){
		const th = new Thumb();
		const old = th.Open_atag;
		th.Open_atag = (atag)=>{
			return new Promise(resolve=>{
				function obo(){
					console.log('start Open_atag')
					console.log(atag[0].href)
					let success = false;
					Add_iframe(atag[0].href)
						.then(iframe=>{resolve(iframe);success=true})
						.catch(()=>{
							obo();
						});
					setTimeout(()=>{if(!success){obo()}},3000);
				}
				obo();
			})
		}
		return th;
	}
	function Thumb(){
		const th = this;
		th.iframe = null;
		th.LoadThumb = ()=>{
			return new Promise(resolve=>{
				th.Wait_atag()
					.then(th.Open_atag)
					.then(th.Wait_div)
					.then(th.Get_div)
					.then(th.Add_box)
					.then(th.Add_box_click_event)
					.then(resolve)
			})
		}
		th.Wait_atag = ()=>{
			const thumbAtag = ()=>{return $('.gallery-link a').filter(function(){return this.href.indexOf("reader")<0});}
			return WaitingElement(thumbAtag);
		}
		th.Open_atag = (atag)=>{
			return Add_iframe(atag[0].href);
		}
		th.Wait_div = (f)=>{
			th.iframe = f;
			const div = ()=>{return $(th.iframe.contentWindow.document).find('.gallery-preview.lillie')};
			return WaitingElement(div);
		}
		th.Get_div = (thumbEle)=>{
			const thumbEleClone = thumbEle.clone(true);
			$(th.iframe).remove();
			return thumbEleClone;
		}
		th.Add_box = (ele)=>{
			const box = `
				<button class="thumb-bu">list</button>
				<div class="thumb-box"></div>
				<style>
					.thumb-bu{
						min-width: 50vw;
						height: 5vh;
						font-size: 5vmin;
						position: fixed;
						bottom: 5vmin;
						z-index: 999;
						border-radius: 100px;
						transform: translate(-50%, 0);
						left: 50%;
						background: #11750e;
						border: none;
						color: white;
					}
					.thumb-box{
						width:100%;
						height:calc(95vh - 10vmin);
						font-size:5vmin;
						position:fixed;
						top:0;
						z-index:1000;
					}
					ul.thumbnail-list {
					    margin: 0;
					    display: grid;
					    background: black;
					    grid-template-columns: 1fr 1fr;
						grid-gap: 3vmin 2vmin;
						height:calc(95vh - 10vmin);
						overflow-y:scroll;
					}
					.thumbnail-container {
					    width: 100% !important;
					    height: auto !important;
						border-radius: 1vmin;
						overflow: hidden;
					}
					img.lazyload {
					    width: 100% !important;
					    max-width: none !important;
					    height: auto !important;
					}
				</style>
			`
			$('body').append(box);
			$('.thumb-box')
				.append(ele)
				.hide()
			$('.thumbnail-list li').show();
			$('.simplePagerNav').hide()
		}
		th.Add_box_click_event = ()=>{
			$('.thumb-bu').click(()=>{
				th.ThumbButtonClick()
			})
			$('.thumb-box').click(()=>{
				th.ThumbBoxClick()
			});
			$('.thumbnail-container a').each(function(){
				$(this).attr('data-href',this.href).removeAttr('href');
				const index = $('.thumbnail-container a').index(this);
				//这里有时直接a.click不行，所以用一个div绕一下
				const div = $("<div></div>").click(function(event){
					event.stopPropagation();
					console.log('.thumbnail-container a click');
					th.Thumbnail_items_click(index)
				})
				$(this).after(div);
				$(this).attr('onclick',`this.nextElementSibling.click()`)
			})
		}
		th.ThumbButtonClick = ()=>{
			$('.thumb-box').slideToggle();
		}
		th.ThumbBoxClick = ()=>{
			$('.thumb-box').slideUp();
		}
		th.Thumbnail_items_click = (index)=>{
			$('.thumb-box').slideUp();
			console.log(`show ${index}`);
			th.Show_img(index);
		}
		th.Get_url = (index)=>{
			return new Promise(resolve=>{
				const a = ()=>{return $('.thumbnail-container a[data-href]')};
				WaitingElement(a).then(ele=>{console.log(index)
					console.log(ele.eq(index).attr('data-href'));
					resolve(ele.eq(index).attr('data-href'));
				})
			})
		}
	}
	Thumb.prototype.Show_img = (index)=>{
		NewShowbox().Show_img(index);
	}
	lt.Get_url = (index)=>{
		return NewThumb().Get_url(index);
	};

	function NewShowbox(){
		const sb = new Showbox();
		return sb;
	}
	function Showbox(){
		const sb = this;
		sb.Add_show_box = ()=>{
			const box = `
				<div class="lt-showbox">
					<div class="up-and-down">
						<span></span>
						<span></span>
					</div>
					<div class="up-and-down">
						<span></span>
						<span></span>
					</div>
					<div class="big-and-small">
						<span>-</span>
						<span>+</span>
					</div>
					<span class="page">1/100</span>
				</div>
				<style>
					.lt-showbox {
					    width: 100vw;
					    height: calc(95vh - 40px - 10vmin);
					    overflow: scroll;
					    position: fixed;
					    top: 40px;
					    left: 0;
					    background: #171717;
					    z-index: 999;
					}
					.up-and-down,.big-and-small{
						font-size:10vmin;
						position:fixed;
					}
					.up-and-down {
					    top: 50%;
					    display: grid;
					    color: white;
					    justify-content: center;
					}
					.up-and-down span {
					    width: 20px;
					    height: 50px;
					}
					.up-and-down span:nth-of-type(1)::after{
						background: #55aaff;
					}
					.up-and-down:nth-of-type(2){
						right: 0;
						transform: scaleX(-1);
					}
					.up-and-down span::after {
					    content: "";
					    width: 2px;
					    height: 50%;
					    position: absolute;
					    background: #ffaa00;
					}
					.big-and-small {
						bottom: 30vmin;
						left: 50%;
						transform: translate(-50%, 0);
						background: #ffffff4f;
						padding: 1vmin;
						border-radius: 10vmin;
						opacity:0.2;
					}
					.big-and-small span {
					    width: 8vmin;
					    height: 8vmin;
					    background: #333;
					    border-radius: 10vmin;
					    display: inline-flex;
					    align-items: center;
					    justify-content: center;
					    color: #976830;
					}
					.lt-showbox .page{
						font-size:5vmin;
						position:fixed;
						left:50%;
						bottom:21vmin;
						transform:translate(-50%,0);
					}
					.lt-showbox img{
						--scale:1;
						width:calc(var(--scale) * 100vw);
						height:auto;
						max-width:none;
					}
				</style>
			`
			$('body').append(box);
			sb.Add_event();
		}
		sb.Add_event = ()=>{
			$('.up-and-down').each(function(){
				$(this).children('span').first().on('touchstart',function(event){
					sb.Show_prev()
				})
				$(this).children('span').last().on('touchstart',function(event){
					sb.Show_next()
				})
			})
			$('.big-and-small span:first').on('touchstart',function(event){
				sb.Smaller()
			})
			$('.big-and-small span:last').on('touchstart',function(event){
				sb.Biger()
			});
		}
		sb.Show_prev = ()=>{
			const now = $('.lt-showbox img:visible');
			const prev = now.prev('img');
			if(prev.length>0){
				now.hide();
				sb.Show_img($('.lt-showbox img').index(prev));
			}else{
				sb.Show_img($('.lt-showbox img').index(now));
			}
		}
		sb.Show_next = ()=>{
			const now = $('.lt-showbox img:visible');
			const next = now.next('img');
			if(next.length>0){
				now.hide();
				sb.Show_img($('.lt-showbox img').index(next));
			}else{
				sb.Show_img($('.lt-showbox img').index(now));
			}
		}
		sb.Show_img = (index)=>{
			$('.lt-showbox img:visible').hide();
			$('.lt-showbox img').eq(index).show();
			sb.Showbox_img_ontouch($('.lt-showbox img').eq(index));
			sb.Show_page_mess(index)
		}
		sb.Show_page_mess= (index)=>{
			$('.lt-showbox .page').text((index+1)+"/"+$('.lt-showbox img').length);
		}
		sb.scale = 0.5;
		sb.Biger = ()=>{
			let scale = $('.lt-showbox img:visible').css('--scale');
			scale = Number(scale) + sb.scale;
			$('.lt-showbox img:visible').css('--scale',scale);
		}
		sb.Smaller = ()=>{
			let scale = $('.lt-showbox img:visible').css('--scale');
			scale = Math.max(1,Number(scale) - sb.scale);
			$('.lt-showbox img:visible').css('--scale',scale);
		}
		sb.Add_blank_Img_to_showbox = (pages)=>{
			for(let i = 0;i<pages;i++){
				let img = $('<img />');
				$('.lt-showbox').append(img);
				img.on('touchstart',function(event){
					//sb.Showbox_img_ontouch($(this));
				});
				img.hide();
			}
		}
		sb.Showbox_img_ontouch = (img)=>{console.log('Showbox_img_ontouch')
			sb.Get_src(img);
			let count = 0;
			img.prevAll('img').slice(0,sb.load_pages_length).each(function(){
				if(count%3==1){
					const now = this.src;
					const prev = $(this).prev('img').length>0 && $(this).prev('img').attr('src');
					const next = $(this).next('img').length>0 && $(this).next('img').attr('src');
					if(!now || !prev || !next){
						sb.Get_src($(this));
					}
				}
				count++;
			});
			count = 0;
			img.nextAll('img').slice(0,sb.load_pages_length).each(function(){
				if(count%3==1){
					const now = this.src;
					const prev = $(this).prev('img').length>0 && $(this).prev('img').attr('src');
					const next = $(this).next('img').length>0 && $(this).next('img').attr('src');
					if(!now || !prev || !next){
						sb.Get_src($(this));
					}
				}
				count++;
			});
		}
		sb.load_pages_length = 10;
		sb.Get_src = (img)=>{
			return new Promise(resolve=>{
				const index = $('.lt-showbox img').index(img);
				sb.Get_url(index)
					.then(lt.Load_onePage)
					.then((imgs)=>{
						img[0].src = imgs.now;
						if(imgs.pre){img.prev('img').attr('src',imgs.pre);}
						if(imgs.next){img.next('img').attr('src',imgs.next);}
						resolve();
					});
			});
		}
	}
	Showbox.prototype.Get_url = (index)=>{
		return NewThumb().Get_url(index);
	}

	lt.GetPageCount = ()=>{
		return new Promise(resolve=>{
			const option = ()=>{return $('#mobile-single-page-select option')};
			WaitingElement(option)
				.then(ele=>{
					const num = $('#mobile-single-page-select option').length;
					resolve(num)
				})
		})
	}

	lt.Load_onePage = (url)=>{
		//if(window.location.href == url){return;}
		return new Promise((resolve,reject)=>{
			let iframe;
			lt.Start_Load_onePage(url)
			Add_iframe(url)
			    .then(f=>{
					iframe = f;
					return lt.Get_iframe_img(f);
				})
				.then(img=>{
					console.log(img);
					lt.End_Load_onePage(url)
					$(iframe).remove();
					resolve(img);
				})
		})
	}
	lt.Start_Load_onePage = (url)=>{
		$('.thumb-bu').text(url);
	}
	lt.End_Load_onePage = (url)=>{
		$('.thumb-bu').text("list");
	}
	
	lt.Get_iframe_img = (iframe)=>{
		return new Promise(resolve=>{
			let check = setInterval(function(){
				let img = $(iframe.contentWindow.document).find('#mobileImages .lillie');
				let next = $(iframe.contentWindow.document).find('#preload .lillie');
				let pre = $(iframe.contentWindow.document).find('#postload .lillie');
				if(img.length>0){
					const allImg = {
						now:img.length>0 ? img[0].src:null,
						next:next.length>0 ? next[0].src:null,
						pre:pre.length>0 ? pre[0].src:null,
					}
					resolve(allImg);
					clearInterval(check);
				}
			},200)
		})
	}
	
	async function Add_iframe(url){
		return new Promise((resolve,reject)=>{
			// 创建一个iframe元素
			var iframe = document.createElement('iframe');

			// 设置iframe的宽度和高度
			iframe.width = '1px';
			iframe.height = '1px';

			// 设置iframe的src属性，指向你想要打开的URL
			iframe.src = url;  // 请替换为你想要加载的URL

			// 将iframe添加到页面的body中
			document.body.appendChild(iframe);

			// 等待iframe加载完成后再操作它
			iframe.onload = function() {
				resolve(iframe);
			};
			iframe.onerror = function(){
				$(iframe).remove();
				reject(url);
			}
		})
	}
	lt.Add_iframe = Add_iframe;
	
	async function WaitingElement(GetEle){
		return new Promise(resolve=>{
			let ele = GetEle();
			if(ele.length>0){resolve(ele);}else{
				let check = setInterval(()=>{
					let ele = GetEle();
					if(ele.length>0){
						resolve(ele);
						clearInterval(check);
					}
				},100)
			}
		})
	}
	lt.WaitingElement = WaitingElement;
}

let downloaded = false
function Check_download(){
	if($('#dl-button').attr('id') && !downloaded){
		setTimeout(function(){
			//$('#dl-button')[0].click()
			var name = $('#artists a')
			if(name.length>2){name = document.title.match(/^[^\|]+/g)[0]}else{name = name.text()}
			var bu = $('<button onclick="">download</button>').attr('onclick','download_gallery("name")'.replace('name',name))
			$('body').append(bu)
			bu.click()
			downloaded = true
			console.log(name)
			var check_downed=setInterval(function(){
				if($('#dl-button:visible').text()!=''){
					//window.close()
				}
			},3000)
		},100)
	}
}
let openReadered = false
function Open_readerPage(){
	var read = $('a[href*="reader"]:not([ccc]):first');
	if(read.attr('href') && !openReadered){
		read.attr('ccc','yes');
		window.open(read.attr('href'));
		openReadered = true;
	}
}


/**
 * 通过iframe获取图片的类
 * @class
 * @param {string} key -跳过的条件
 * @param {number} nums -总页数
 * @param {function({index: number}):string} Geturl -获取每一页的地址的方法
 * @param {function({document: document}):JQuery} Getimg -获取每一页的图片的方法
 * @param {function({img: JQuery},{index:number})} Putimg -图片加载到主页面的方法
 * @example
		 const key = "reader";
		 const atag;
		 const nums = atag.length;
		 const Geturl = (i)=>{
			return atag.eq(i)[0].href;
		 }
		 const Getimg = (doc)=>{
			return $(doc).find('img');
		 }
		 const Putimg = (img,i)=>{
			 atag.eq(i).after(img);
		 }
		 new Get_img_obo_iframe(key,nums,Geturl,Getimg,Putimg).Start()
*/
function Get_img_obo_iframe(key,nums,Geturl,Getimg,Putimg){
	const gi = this;
	gi.Start = async()=>{
		for(let i=0;i<nums;i++){
			let url = await Geturl(i);
			//if(url.indexOf(key)>=0){continue;}
			let iframe;
			try {
			  iframe = await gi.Add_iframe(url);
			} catch (error) {
			  console.error('发生错误:', error); // 如果 Add_iframe 被 reject，错误会被捕获
			}
			let img;
			if(iframe){
				let My_getimg = ()=>{
					return Getimg(iframe.contentWindow.document);
				}
				img = await gi.WaitingElement(My_getimg);
				await Putimg(img,i);
				gi.show_mass((i+1)+"/"+nums);
				$(iframe).remove();
			}
		}
	}
	gi.Add_iframe=(url)=>{
		return new Promise((resolve,reject)=>{
			// 创建一个iframe元素
			var iframe = document.createElement('iframe');

			// 设置iframe的宽度和高度
			iframe.width = '1px';
			iframe.height = '1px';

			// 设置iframe的src属性，指向你想要打开的URL
			iframe.src = url;  // 请替换为你想要加载的URL

			// 将iframe添加到页面的body中
			document.body.appendChild(iframe);

			// 等待iframe加载完成后再操作它
			iframe.onload = function() {
				resolve(iframe);
			};
			iframe.onerror = function(){
				reject(url);
			}
		})
	}
	gi.WaitingElement=(GetEle)=>{
		return new Promise(resolve=>{
			let ele = GetEle();
			if(ele.length>0){resolve(ele);}else{
				let check = setInterval(()=>{
					let ele = GetEle();
					if(ele.length>0){
						resolve(ele);
						clearInterval(check);
					}
				},100)
			}
		})
	}
}
Get_img_obo_iframe.prototype.show_mass = (mass)=>{
	window.GAIL.showmass(mass);
	$('.mass_top').css('font-size','10vmin')
}

window.GAIL.Get_img_obo_iframe = Get_img_obo_iframe;

function ConsoleWrite(mess,item){
	if(item.length>0){item.text(mess);return item;}
	let div = $(".console");
	if(div.length==0){
		div = `
			<div class="console"></div>
			<style>
				.console{
					position:fixed;
					width:100%;
					background:black;
					color:white;
					bottom:0;
				}
			</style>
		`
		$('body').append(div);
		div = $(".console");
		div.on('touchstart',function(){$(this).hide()});
	}
	div.text(mess);
	return div;
}