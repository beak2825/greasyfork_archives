// ==UserScript==
// @name         kemono 2.0
// @namespace    http://tampermonkey.net/
// @version      20241018
// @description  修复预览bug
// @author       You
// @include      https://kemono.su/*
// @include      https://*.kemono.su/data/*
// @require		https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require https://update.greasyfork.org/scripts/480132/1309498/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/486938/1325051/download_by_atag.js
// @downloadURL https://update.greasyfork.org/scripts/490715/kemono%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/490715/kemono%2020.meta.js
// ==/UserScript==
 
$(function(){
	askAndAjax(changepb)
	GetBigImg()
	ListeningDownload()
})
 
 
async function askAndAjax(callback){
	if(window.location.href.match(/patreon\/user\/\d+\/post\/\d+/g)||window.location.href.match(/\.\w+$/g)){return}
	BottomConfirmWindow('是否显示全部？')
		.then(()=>{
			callback()
 
			let key = "kemono"
			let atag = $('a.image-link[href]')
			let nums = atag.length-1
			let geturl = function(i){return atag.eq(i)[0].href}
			let getimg = function(data){return $(data).find('.post__body')}
			let putimg = function(img,i){
				atag.eq(i).parent().after(img)
				atag.eq(i).parent().hide()
				let link = $('<a target="_blank">Link</a>').attr('href',atag.eq(i)[0].href)
				img.append(link).css('border','#ff3908 2px solid')
 
				$('.ad-container').remove()
				$('.mass_top').css('font-size','10vw')
				$('.getBiger').click()
				$('.post__attachment-link[href]').each(function(){
					$(this).attr('data-href',this.href)
				           .removeAttr('href')
					       .click(function(event){
							   event.stopPropagation();
								downloadText($(this).attr('data-href'))
							})
				})
				
				img.find('p').hide()
			}
			window.GAIL.get_img_obo_ajax_href(key,nums,geturl,getimg,putimg)
		})
}
function downloadText(text) {
 
    // 创建 Blob 对象
    var blob = new Blob([text], { type: "text/plain" });
 
    // 创建下载链接
    var url = URL.createObjectURL(blob);
 
    // 创建下载按钮
    var a = document.createElement("a");
    a.href = url;
    a.download = "downloaded_text.txt"; // 文件名
    document.body.appendChild(a);
 
    // 模拟点击下载
    a.click();
 
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
 
function BottomConfirmWindow(mass){
	return new Promise((resolve,reject)=>{
		box = $('<div class="BottomConfirmWindow"></div>').text(mass)
					.css({
						width:'100vw',
						'background':'rgb(175 15 37)',
						'position':'fixed',
						'border-radius':'5vw',
						bottom:'0px',
						'z-index':'999999',
						'padding':'5vw',
						'font-size':'5vw',
						'text-align':'center',
						'display':'flex',
						'flex-direction':'column'
					})
		$('body').append(box)
 
		let span = $('<span></span>')
		box.append(span)
		span.append($('<button>是</button>')
						.click(()=>{box.fadeOut();resolve()})
						.css({
							width:'50%',
							height:'10vw',
							'font-size':'2vw',
							'margin-top':'5vw'
						})
					)
		span.append($('<button>否</button>')
						.click(()=>{box.fadeOut();reject()})
						.css({
							width:'50%',
							height:'10vw',
							'font-size':'2vw',
							'margin-top':'5vw'
						})
					)
 
		box.fadeIn()
 
	})
}
 
 
function GetBigImg(){
	if(window.location.href.match(/\.\w+$/g)){return}
	let checkbu = $('<button class="getBiger">getBiger</button>')
					.css({
						'width':'100%',
						'font-size':'10vw'
					})
					.click(()=>{
						$('a.fileThumb[href]:not([big-src])').each(function(){
							$(this).attr('big-src',this.href)
							$(this).removeAttr('href')
							//$(this).click(function(){$(this).find('img')[0].src = $(this).attr('big-src')})
						})
						$('.post__body img:not([ccc])').attr('ccc','yes').click(function(){
							let src = $(this).parent().attr('big-src')
							if(!src){src = this.src}
							let name = document.title + (new Date()).getTime() + this.src.match(/\.\w+$/g)[0]
							// GM_download({
							// 	url:src,
							// 	name:name,
							// })
							console.log(name)
							//window.DBA.SetDownload(src,name)
							$(this).attr({
								"big_src":src,
								name:name
							});
							const p = $("<span>0%</span>");
							$(this).after(p);
							const downloader = new Downloader();
							downloader.downloadType = "blob";
							downloader.FetchShowProgress = function(pro){
								p.text(pro.toFixed(2)+"%");
							}
							downloader.Download_img($(this));
						})
						//$(this).hide()
					})
	$('#main').prepend(checkbu).append(checkbu.clone(true))
	checkbu.click()
}
 
 
function changepb(){
	$('.card-list__items').css('display','block')
}
 
function ListeningDownload(){
	let src = GM_getValue('src')
	if(src&&window.location.href.indexOf(src.match(/[^\/]+$/g)[0])>=0){
		$('img').click(function(){
			new Promise((resolve,reject)=>{
				//const timeout = setTimeout(function() {reject()}, 10000);
				GM_download({
					url:window.location.href,
					name:GM_getValue('name'),
					onprogress:function(pro){
						window.GAIL.showmass((pro.loaded/pro.totalSize*100).toFixed(2) + "%");
						$('.mass_top').css('font-size','10vw');
					},
					success:function(){
						resolve();
					},
					error:function(){
						reject()
					}
				})
				GM_deleteValue('name')
				GM_deleteValue('src')
			})
		})
	}
}
class Downloader{
	constructor(){
		this.downloadType = "";
		this.downloaded = [];
		this.downloading = 0;
		this.downloadError = [];
		this.imgs = "";
		this.maxDownloadingCounts = 10;
		this.timeout = null;
		this.AllComplete = null;
		this.OneSuccess = null;
		this.OneError = null;
	}
	
	async Download_img(imgs){
		let self = this;
		if(this.downloadType==""){
			await this.Test_downloadType(imgs.eq(0));
		}
		
		this.Set_download(imgs)
		if(this.downloadType=="GM_download"){
			this.Donwload_img_by_GM();
		}else if(this.downloadType=="atag"){
			this.Donwload_img_by_atag();
		}else if(this.downloadType=="blob"){
			this.Donwload_img_by_blob();
		}
	}
	
	async Test_downloadType(img){
		return new Promise((resolve)=>{
			let timeout = 3000;
			let isOk = false;
			GM_download({
				url:img[0].src,
				name:"test.png",
				onload:()=>{isOk = true;this.downloadType = "GM_download";resolve()},
			})
			setTimeout(()=>{
				if(!isOk){this.downloadType = "atag";}
				resolve()
			},timeout)
		})
	}
	Set_download(imgs){
		this.downloaded = [];
		this.downloading = 0;
		this.downloadError = [];
		this.imgs = imgs;
	}
	
	Donwload_img_by_GM(){
		let self = this;
		async function Download_one(i){
			if(i>=self.imgs.length){if(self.AllComplete){self.AllComplete()};return;}
			if(self.downloading>=self.maxDownloadingCounts){setTimeout(()=>{Download_one(i)},1000);return;}
			
			let name = '';
			let src = '';
			self.downloading++;
			try{
				await self.Check_and_get_nameAndsrc({img:self.imgs.eq(i),checkSrc:true})
						.then((m)=>{
							name = m.name;
							src = m.src;
						});
			}catch(error){
				console.log(error)
				console.log('imgsrc is error:');
				self.downloadError.push(i);
				self.downloading--;
				Download_one(i+1);
				return;
			}
			console.log(name)
			console.log(document.title)
			let timeout = false;
			setTimeout(() => {timeout = true;},10000);
			const donwimg = self.imgs.eq(i);
			GM_download({
				url:src,
				name:name,
				onload:function(){
					self.downloaded.push(downimg);
					self.downloading--;
					if(window.GAIL.showmass){
						window.GAIL.showmass((self.downloaded.length+self.downloadError.length)+"/"+self.imgs.length);
					}
					self.imgs.eq(i).remove();
					
					if(self.OneSuccess){self.OneSuccess(downimg);}
				},
				onerror:function(){
					self.downloading--;
					self.downloadError.push(downimg);
					if(self.OnError){self.OnError(downimg);}
				},
				onprogress:function(){
					if(timeout){return false;}
				}
			});
			setTimeout(function() {Download_one(i+1);}, 10);
		}
		Download_one(0);
	}
	Check_and_get_nameAndsrc(args){
		let self = this;
		console.log(args);
		return new Promise(async (resolve,reject)=>{
			if(!args || !args.img){return reject();}
			let src = args.img.attr('big_src');
			if(!src){src = args.img.attr('src');}
			if(!src){reject();}
			console.log("check:"+src)
			if(args.checkSrc){
				try{
					await self.check_src_is_right(src);
				}catch(error){
					reject();
				}
			}
			let ext = src.match(/\.jpg|\.png|\.webp|\.gif|\.bmp/g);
			if(!ext){ext = '.png';}else{ext = ext[0];}
			let name = args.img.attr('name');
			if(!name){name = document.title + new Date().getTime() + ext;}
			resolve({name:name,src:src});
		});
	}
	Donwload_img_by_atag(){
		let self = this;
		let myWindow = window.open('_blank');
		async function Download_one(i){
			if(i>=imgs.length){myWindow.alert('end');myWindow.history.go(0-myWindow.history.length+1);myWindow.close();return;}
			
			let name = '';
			let src = '';
			self.downloading++;
			try{
				await self.Check_and_get_nameAndsrc({img:self.imgs.eq(i),checkSrc:true})
						.then((m)=>{
							name = m.name;
							src = m.src;
						});
			}catch(error){
				console.log('imgsrc is error:');
				self.downloadError.push(i);
				self.downloading--;
				Download_one(i+1);
				return;
			}
			
			if(!myWindow){alert('windows is closed');return;}
			myWindow.location.href = src;
			let a = $('<a></a>').attr({
				'href':$(myWindow.document.body).find('img:first').attr('src'),
				'download':name,
			})
			a[0].click();
			setTimeout(function() {Download_one(i+1);self.imgs.eq(i).remove()}, 1000);
			self.downloaded.push(i);
			self.downloading--;
		}
		Download_one(0);
	}
	check_src_is_right(src){
		let self = this;
		return new Promise((resolve,reject)=>{
			let iimg = new Image();
			iimg.onload = function(){
				if(this.width*this.height*this.naturalWidth*this.naturalHeight==0){reject();}else{resolve();}
			}
			iimg.onerror = function(){reject();}
			iimg.src = src;
			setTimeout(function() {iimg.abort();reject();}, 2000);
		})
	}
	Donwload_img_by_blob(){
		if(!this.imgs || this.imgs.length==0){return;}
		
		const _this = this;
		const imgs = this.imgs;
		const obo = (i)=>{
			if(i>=imgs.length){return;}
			if(_this.maxDownloadingCounts>1 && _this.downloading >= _this.maxDownloadingCounts){
				setTimeout(function() {obo(i)}, 1000);
			}
			let src = imgs.eq(i).attr('big_src');
			if(!src){src = imgs.eq(i).attr('src');}
			const checkimg = imgs.eq(i);
			_this.downloading++;
			_this.UrlToBlob({url:src,timeout:_this.timeout})
				.then(blob=>{
					_this.Check_and_get_nameAndsrc({img:checkimg}).then(args=>{
						const name = args.name;
						let a = $('<a></a>').attr({
							download:name,
							href:blob
						})
						a[0].click();
						_this.downloaded.push(checkimg);
						_this.downloading--;
						checkimg.attr('src',blob);
						OneSuccess?.(checkimg);
					})
					
					if(_this.maxDownloadingCounts==1){
						obo(++i);
					}else{
						window.GAIL.showmass((_this.downloaded.length+_this.downloadError.length)+"/"+_this.imgs.length);
					}
				})
				.catch(er=>{
					console.log(er);
					_this.downloadError.push(imgs.eq(i));
					_this.downloading--;
					if(_this.maxDownloadingCounts==1){
						obo(++i);
					}else{
						window.GAIL.showmass((_this.downloaded.length+_this.downloadError.length)+"/"+_this.imgs.length);
					}
				});
			if(_this.maxDownloadingCounts>1){
				setTimeout(function() {obo(++i);}, 10);
			}
		}
		obo(0);
	}
	/*
	args = {url:url,timeout:timeout}
	*/
	async UrlToBlob(args) {
		let _this = this;
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
							_this.FetchShowProgress?.(progress);
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
	FetchShowProgress(pro){
		if(this.maxDownloadingCounts==1 && this.imgs.length==1){
			window.GAIL.showmass(pro);
			$(".mass_top").css('font-size',"10vw");
		}
	}
}
