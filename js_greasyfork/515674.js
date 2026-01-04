// ==UserScript==
// @name         MyDownloader
// @version      2025.05.03
// @description  包含多种下载方法的下载库
// @author       You
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://update.greasyfork.org/scripts/480132/1476440/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/522187/1511410/Kquery.js
// ==/UserScript==
// 2025.01.07 更新了download text
// 2025.01.07.02 更新了download text(src,name)
// 2025.01.07.03 修复了download text(src,name)没有传入name的bug
// 2025.05.03 修复isnowpage的bug
 
 
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
 
window.Downloader = Downloader;