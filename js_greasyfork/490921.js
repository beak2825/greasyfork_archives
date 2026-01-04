// ==UserScript==
// @name        xchina
// @version      2025.05.02.01
// @author       You
// @include     https://xchina.co/*
// @include     https://img.xchina.store/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect       *
// @require     https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/480132/1534996/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/522187/1532433/Kquery.js
// @namespace https://greasyfork.org/users/1210231
// @description good
// @downloadURL https://update.greasyfork.org/scripts/490921/xchina.user.js
// @updateURL https://update.greasyfork.org/scripts/490921/xchina.meta.js
// ==/UserScript==


//旧逻辑
$(function(){
	add_bu()
		.click(()=>{sessionStorage.setItem('startAjax','true');location.reload(true)})  //先清除缓存，再ajax
	Add_new_container()
	if(sessionStorage.getItem('startAjax')=='true'){get_list(get_big_img);sessionStorage.setItem('startAjax','false')}  //判断是否ajax
})
function add_bu(){
	let bu = $('<button>Ajax10</button>')
			.css({
				width:'100%',
				'font-size':'10vw'
			})
	$('.photos').before(bu);
	$('.breadcrumb').after(bu);
	return bu
}
function Add_new_container(){
	const box = $('<div></div>').css({
		width:'100vw',
		height:'100vh',
		'overflow':'auto',
		'position':'fixed',
		top:0,
		left:0,
		'z-index':9999,
	})
	
}
function get_list(callback){
	if(window.location.href.match(/xchina\.co\/photo\/id-\w+\.html/g)){}else{sessionStorage.removeItem('page');return}
 
	let key = "xchina"
	let atag = $('a.next[href]:first')
	let nums = (()=>{
					if(atag.length>0&&atag.prev().length>0){
						return Number(atag.prev().text())
					}else{
						return 1
					}
				})()
	atag = $('a[current="true"]:first')
	if(atag.length==0){callback($('.photos').children());return}
	$('.photos').children().remove()
	//page记录当前ajax到了第几页
	let page = sessionStorage.getItem('page')
	if(!page){page=0}else{page = Number(page)}
	if(page>=nums-1){page=0}
 
	let geturl = function(i){
		            if(i>=10){sessionStorage.setItem('page',i+page);return false}
					if(i+page>=nums){sessionStorage.setItem('page',0);return false}
					return atag[0].href.replace(/\d+(?=\.)/,(i+1+page))
				}
	let getimg = function(data){return $(data).find('.photos').children().attr('ccc','yes')}
	let putimg = function(img,i){
		$('.photos').append(img)
		setTimeout(function(){$('.mass_top').css('font-size','10vw').text(`${page + i + 1}/${nums}`)},1000)
 
		$('.photos').children('*:not([ccc])').remove()
		del_ad();
		callback(img)
	}
	window.GAIL.get_img_obo_ajax_href(key,nums,geturl,getimg,putimg)
}
let showbox;
function Put_img_to_ClickShowBox(imgs){
	if(!showbox){
		showbox = new ShowBox();
		showbox.Set_donwloadType("blob");
	}
	showbox.Add(imgs)
	console.log('Put_img_to_ClickShowBox is run');
}
function get_big_img(img){
	let iimg = img.find('img')
	iimg.each(function(){
        let parent = $(this).parent().before($(this).attr('big','yes'))
        parent.hide()
		$(this).attr('big_src',this.src.replace(/_[^\.]+/g,"").replace(/\w+$/g,"jpg"))
		//this.src = this.src.replace(/_[^\.]+/g,"").replace(/\w+$/g,"jpg")
		$('body').append($('<p></p>').text(this.src))
		$(this).parents('a:first[href]').removeAttr('href')
		$(this).click(function(){
			let name = document.title + new Date().getTime() + ".jpg"
			let src = $(this).attr('big_src')
			let _this = this
			GM_download({
				url:src,
				name:name,
				onload:()=>{$(_this).remove()}
			})
		})
	})
	Put_img_to_ClickShowBox(iimg);
	$(".push-bottom").remove()
	return
 
}
function checkimg_unloaded(){
	let checking = function(){
		let img = $('img[big]:visible').filter(function(){return this.naturalWidth == 0})
		if(img.length>0){
			img.each(function(){
				var clone = $(this).clone(true)
				$(this).after(clone)
				$(this).remove()
				clone[0].scrollIntoView()
			})
		}else{}
	}
	let check = setInterval(checking,500)
}
function del_ad(){
	$('*:not(.download_bu,.mass_top,.clickShowBox,.clickShowBox *,.clickShowBox_ShowBu,.one_scroll_box)').filter(function(){return $(this).css('position')=="fixed"}).remove()
}
$('body').on('touchend',del_ad);

function Add_to_one_div(){
	let box = `
	<div class="one_scroll_box"></div>
	<style>
		.one_scroll_box{
			width:100vw;
			height:100vh;
			overflow:scroll;
			position:fixe;
			top:0;
			left:0;
			z-index:99999;
		}
	</style>
	`
	$('body').append(box);
	$('.one_scroll_box').append($('body').children());
}
$(function(){
	Add_to_one_div();
})

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
	let downloader = Downloader ? new Downloader() : (() => { throw new DOMException("Downloader does not exist"); })();
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

/**
 * 包含多种下载方法的下载类
 * @example
 const downloader = new Downloader();
 downloader.Download_img(imgs);
*/
function Downloader(){
	
	let downloading = 0;
	let downloaded = [];
	let downloadError = [];
	let imgs = null;
	let maxDownloadingCounts = 10;
	let timeout = null;
	let downloadType = ""
	let checkSrc = false;
	
	
	/**
	 * @example Download_img(imgs)
	 */
	this.Download_img = async (imgs)=>{
		Set_download(imgs)
		if(downloadType==""){
			Download_obo("GM_download");return;
		}
 
		console.log(downloadType);
		if(downloadType=="GM_download"){
			Download_obo("GM_download");
		}else if(downloadType=="atag"){
			Download_obo("atag");
			console.log('download atag')
		}else if(downloadType=="blob"){
			Download_obo("blob");
		}else{
			alert("no this donwload type");
		}
	}
 
	this.Set_downloadType = v => downloadType = v;
 
	this.Set_maxDownloadingCounts = v => maxDownloadingCounts = v;
 
	this.Set_timeout = v => timeout = v;
	
	this.Set_checkSrc = v => checkSrc = v;
	/**
	 * @example OneSuccess((success_img)=>{...})
	 */
	function OneSuccess(img){}
	this.OneSuccess = foo=>OneSuccess = foo;
	/**
	 * @example OneError((error_img)=>{...})
	 */
	function OneError(img){}
	this.OneError = foo=>OneError = foo;
	/**
	 * @example AllComplete(()=>{...})
	 */
	function AllComplete(){}
	this.AllComplete = foo=>AllComplete = foo;
	
	this.Set_download = (iimgs)=>{Set_download(iimgs);}
	function Set_download(iimgs){
		downloaded = [];
		downloading = 0;
		downloadError = [];
		imgs = iimgs;
	}
	function Download_obo(dtype){
		async function Download_one(i){
			if(i>=imgs.length){AllComplete();return;}
			if(downloading>=maxDownloadingCounts){setTimeout(()=>{Download_one(i)},1000);return;}
			const img = imgs.eq(i);
			downloading++;
			function success(img){
				OneSuccess(img);
				downloading--;
				downloaded.push(img);
				ConsoleWrite((downloaded.length+downloadError.length)+"/"+imgs.length)
			}
			function error(img){
				OneError(img);
				downloading--;
				downloadError.push(img);
			}
			switch(dtype){
				case "GM_download":
					Donwload_img_by_GM(img)
						.then(img=>success(img))
						.catch(img=>{
							dtype = "blob"
							Download_one(i);
						});
					break;
				case "blob":
					Download_img_by_blob(img)
						.then(img=>success(img))
						.catch(img=>{
							dtype = "atagIfram";
							Download_one(i);
						});
					break;
				case "atagIfram":
					Download_img_by_atag(img)
						.then(img=>success(img))
						.catch(img=>{
							error(img);
							dtype = "GM_download";
						});
					break;
			}
			Download_one(++i);
		}
		Download_one(0);
	}
	function ConsoleWrite(mass){
		if(window.GAIL){
			window.GAIL.showmass(mass);
		}
	}
	this.ConsoleWrite = foo=>ConsoleWrite = foo;
	
	this.Donwload_img_by_GM = img=>{Donwload_img_by_GM(img);}
	function Donwload_img_by_GM(img){
		return new Promise(async(resolve,reject)=>{
			if(!img){alert("img is empty");reject(img);return;}
			if(!GM_download){alert("GM_download is undefind");reject(img);return;}
			let name = '';
			let src = '';
			try{
				await Check_and_get_nameAndsrc({img:img,checkSrc:checkSrc})
						.then((m)=>{
							name = m.name;
							src = m.src;
							console.log(m);
						});
			}catch(error){
				reject(img);
				return;
			}
			console.log(name)
			console.log(src)
			GM_download({
				url:src,
				name:name,
				onload:function(){
					resolve(img);
				},
				onerror:function(){
					reject(img);
				},
				onprogress:function(){
					
				}
			});
			if(timeout){
				setTimeout(()=>{
					reject(img);
				},timeout);
			}
		})
	}
	
	this.Download_img_by_blob = (img)=>{Download_img_by_blob(img);}
	function Download_img_by_blob(img){
		return new Promise(async(rs,rj)=>{
			if(!img){alert("imgs is empty");rj(img);return;}
			
			let name = '';
			let src = '';
			try{
				await Check_and_get_nameAndsrc({img:img,checkSrc:checkSrc})
						.then((m)=>{
							name = m.name;
							src = m.src;
							console.log(m);
						});
			}catch(error){
				rj(img);
				return;
			}
			UrlToBlob({url:src,timeout:timeout})
				.then(blob=>{
					let a = $('<a></a>').attr({
						download:name,
						href:blob
					})
					a[0].click();
					rs(img);
				})
				.catch(er=>{
					console.log(er);
					rj(img);
				});
			if(timeout){
				setTimeout(()=>{
					rj(img);
				},timeout)
			}
		})
	}
	
	this.Download_img_by_atag = (img,nowIsImgPage)=>{Download_img_by_atag(img,nowIsImgPage);}
	async function Download_img_by_atag(img,nowIsImgPage) {
		return new Promise(async(resolve,reject)=>{
			if(!img){alert("imgs is empty");reject(img);return;}
			if(!GM_setValue){alert("GM_setValue is underfind");reject(img);return;}
			if (!nowIsImgPage) {
				let name = '';
				let src = '';
				try{
					await Check_and_get_nameAndsrc({img:img,checkSrc:checkSrc})
							.then((m)=>{
								name = m.name;
								src = m.src;
								console.log(m);
							});
				}catch(error){
					reject(img);
					return;
				}
				GM_setValue("downloadType", "start");
				GM_setValue("downloadName", name);
				GM_setValue("downloadSrc", src);
				let mi = new My_iframe();
				let iframe;
				let isTimeout = false;
				if(timeout){
					setTimeout(()=>{isTimeout = true;},timeout)
				}
				await mi.Add_iframe(src).then(ifr=>iframe = ifr);
				
				const checkDownload = setInterval(() => {
					if (GM_getValue("downloadType") === "end") {
						$(iframe).remove();
						resolve(img);
						clearInterval(checkDownload);
						return;
					}
					if(isTimeout){
						reject(img);
					}
				}, 100);
			}else {
				const newimg = $("img").attr({
					name:GM_getValue("downloadName"),
				})
				await Check_and_get_nameAndsrc({img:newimg,checkSrc:true})
						.then((m)=>{
							let name = m.name;
							let src = m.src;
							$('<a></a>').attr({
								'href': src,
								'download': name,
							})[0].click();
						});
				await new Promise(resolve => setTimeout(resolve, 1000));
				GM_setValue("downloadType", "end");
				window.close();
			}
			
		})
	}
	this.Listening_Download_by_atag = ()=>{
		const locationHref = window.location.href;
		const GM_downloadSrc = GM_getValue("downloadSrc");
		if(!GM_downloadSrc){return;}
		if(GM_downloadSrc == locationHref|| locationHref.indexOf(GM_downloadSrc)>=0 || GM_downloadSrc.indexOf(locationHref)>=0 ){
			Download_img_by_atag($("img"),true);
		}
	}
	
	
	/**
	 * @example Urls({url:url,timeout : 100})
    */
   this.UrlToBlob = (args)=>{UrlToBlob(args);}
	async function UrlToBlob(args) {
		return new Promise((resolve,reject)=>{
			if(!args.url){reject("no url");}
			if(args.timeout){
				const timeout = setTimeout(function() {reject("fetch timeout")}, args.timeout);
			}
			fetch(args.url)
					.then(response => {
						const contentLength = response.headers.get('Content-Length');
						const total = parseInt(contentLength, 10);
						let loaded = 0;
			
						// 克隆响应以便分别读取流和获得 Blob
						const clonedResponse = response.clone();
						const reader = clonedResponse.body.getReader();
			
						// 更新进度的函数
						function updateProgress({ done, value }) {
							if (done) {
								return; // 如果读取完毕，直接返回
							}
							loaded += value.byteLength; // 累加已加载字节
							const progress = (loaded / total) * 100; // 计算进度百分比
							console.log(`Loading: ${progress.toFixed(2)}%`);
							FetchShowProgress(progress);
							// 继续读取下一块数据
							return reader.read().then(updateProgress);
						}
			
						// 开始读取流以更新进度
						return reader.read().then(updateProgress).then(() => {
							// 完成后返回原始响应的 Blob
							return response.blob();
						});
					})
					.then(blob => {
						const blobUrl = URL.createObjectURL(blob);
						resolve(blobUrl);
					})
					.catch(error => {
						console.error('Error caching video:', error);
						reject(error);
					});
		});
	}
	this.FetchShowProgress = (pro)=>{FetchShowProgress(pro);}
	function FetchShowProgress(pro){
		if(this.maxDownloadingCounts==1 && this.imgs.length==1){
			window.GAIL.showmass(pro);
			$(".mass_top").css('font-size',"10vmin");
		}
	}
	
	this.Check_and_get_nameAndsrc = (args)=>{Check_and_get_nameAndsrc(args);}
	function Check_and_get_nameAndsrc(args){
		return new Promise(async (resolve,reject)=>{
			if(!args || !args.img){return reject();}
			let src = args.img.attr('big_src')||args.img.attr('big-src');
			if(!src){src = args.img.attr('src');}
			if(!src){src = args.img.attr('small_src')||args.img.attr('small-src');}
			if(!src){reject();}
			//console.log("check:"+src)
			if(args.checkSrc){
				try{
					await check_src_is_right(src);
				}catch(error){
					reject();
				}
			}
			let ext = src.match(/\.jpg|\.png|\.webp|\.gif|\.bmp/g);
			if(!ext){ext = '.png';}else{ext = ext[0];}
			let name = args.img.attr('name');
			if(!name){name = document.title + new Date().getTime() + Math.floor(Math.random()*100) + ext;}
			resolve({name:name,src:src,img:args.img});
		});
	}
	function generateUUID() {
	  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
	    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	  );
	}

	
	this.check_src_is_right = (src)=>{check_src_is_right(src);}
	function check_src_is_right(src){
		return new Promise((resolve,reject)=>{
			let iimg = new Image();
			iimg.onload = function(){
				if(this.width*this.height*this.naturalWidth*this.naturalHeight==0){reject();}else{resolve();}
			}
			iimg.onerror = function(){reject();}
			iimg.src = src;
			setTimeout(function() {reject();}, 2000);
		})
	}
	
	function downloadText(text,name) {
	 
	    // 创建 Blob 对象
	    var blob = new Blob([text], { type: "text/plain" });
	 
	    // 创建下载链接
	    var url = URL.createObjectURL(blob);
	 
	    // 创建下载按钮
	    var a = document.createElement("a");
	    a.href = url;
	    a.download = name?name:"downloaded_text"+new Date().getTime()+".txt"; // 文件名
	    document.body.appendChild(a);
	 
	    // 模拟点击下载
	    a.click();
	 
	    // 清理
	    window.URL.revokeObjectURL(url);
	    document.body.removeChild(a);
	}
	this.Download_to_text = (url,name)=>{downloadText(url,name);}
}
$(function(){
	let dd = new Downloader()
	dd.Listening_Download_by_atag()
})
