// ==UserScript==
// @name         MyDownloaderBox
// @version      2025.07.04
// @description  一个管理下载列表的库
// @author       You
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// ==/UserScript==

class Downloader {
	constructor() {
		this.name = '';
		this.src = '';
		this.aborted = false;
		this.retryCount = 0;
	}
	download(name, src) {}
	onDownloadBegin() {}
	onDownloadProgress(progress) {}
	onDownloadEnd() {}
	onDownloadError(error) {}
	retry() {this.retryCount++}
	abort() {this.aborted = true;}
}

// 使用 GM_download 实现的下载器
class GMDownloader extends Downloader {
	constructor() {
		super();
		this.gm = null
	}
	download(name, src) {
		this.name = name;
		this.src = src;
		this.onDownloadBegin();
		this.gm = GM_download({
			url:src,
			name:name,
			onload:()=>{console.log('end');this.onDownloadEnd()},
			onprogress:progress=>{//console.log(progress);
				if(progress.totalSize > 0) {
					let p = (progress.loaded / progress.totalSize * 100).toFixed(0);
					console.log(p);
					this.onDownloadProgress(p + "%");
				}
			},
			onerror:error=>this.onDownloadError(error)
		});
	}
	retry() {
		super.retry();
		if(this.gm) this.gm.abort();
		this.download(this.name,this.src);
	}
	abort(){
		super.abort();
		if(this.gm) this.gm.abort();
	}
}

// 使用 iframe 实现的下载器
class IframeDownloader extends Downloader {
	constructor() {
		super();
		this.iframe = null;
		this.img = null;
		this.iframeContainer = $('body');
	}
	download(name, src) {
		if(!GM_getValue('linsten iframe')) GM_setValue('linsten iframe','yes')
		this.img = {name:name,src:src};
		this.onDownloadBegin();
		this.Add_linstenerArgs()
			.then(()=>{return this.Add_iframe(src,this.iframeContainer)})
			.then((f)=>{
				this.onDownloadProgress("50%");
			})
			.then(()=>this.LinstenMyProgress())
			.catch(()=>this.onDownloadError());
	}
	retry() {
		this.abort()
		this.download(img.name,img.src);
	}
	abort() {
		this.iframe.remove();
		this.iframe = null;
	}
	Add_iframe(url,container){
		const f = $("<iframe></iframe>").attr('src',url).css({'width':1,'height':1});
		container.append(f);
		this.iframe = f;
		return new Promise((rs,rj)=>{
			f.on('load', ()=>rs(f));
			f.on('error', rj);
		})
	}
	Add_linstenerArgs(){
		GM_setValue('src',this.img.src);
		GM_setValue('name',this.img.name);
		return Promise.resolve();
	}
	LinstenMyProgress(){
		let end = false;
		let check = setInterval(()=>{
			if(GM_getValue('downloadEnd') && !end){
				end = true;
				this.onDownloadProgress('100%');
				this.onDownloadEnd();
				this.Del_GM_value();
				this.abort();
				clearInterval(check)
				return;
			}
		},100);
	}
	Del_GM_value(){
		GM_deleteValue('src');
		GM_deleteValue('name');
		GM_deleteValue('downloadEnd');
	}
	Add_linstener(){
		//console.log(GM_getValue('linsten iframe'))
		if(!GM_getValue('linsten iframe')) return;
		//console.log(GM_getValue('src'))
		const src = GM_getValue('src');
		//console.log(window.location.href == GM_getValue('src'));
		if(window.location.href!=src) return;
		this.Download_by_atag();
		GM_setValue('downloadEnd','yes')
		console.log(GM_getValue('downloadEnd'))
	}
	Download_by_atag(){
		console.log(GM_getValue('name'))
		const name = GM_getValue('name');
		const a = $('<a></a>').attr({
			href:$('img').attr('src'),
			download:name
		});
		a[0].click();
	}
}
new IframeDownloader().Add_linstener();

class TestDownloader extends Downloader {
	constructor() {
		super();
	}
	download(name, src) {
		const time = Math.random() * 10; // 修正 Math.random() 的使用
		this.onDownloadBegin();
		let i = 0; // 使用 let 声明变量 i，以便在 setInterval 回调中正确更新其值
		let progressInterval = setInterval(() => {
			i += 100; // 更新 i 的值
			const progress = Math.min((i / (time * 1000)) * 100, 100); // 计算进度百分比，确保不超过 100%
			this.onDownloadProgress(progress.toFixed(0) + '%');
			if (i >= time * 1000) { // 判断是否达到或超过预计下载时间
				this.onDownloadEnd();
				clearInterval(progressInterval); // 清除定时器
			}
		}, 100);
	}
}

// 下载器工厂类
class DownloaderFactory {
	constructor(type) {
		this.downloaders = {
			iframe: IframeDownloader,
			gm: GMDownloader,
			test: TestDownloader
		};
		// 如果传入了type参数，则直接返回对应的下载器实例
		if (type !== undefined) {
	return this.createDownloader(type);
		}
	}
	createDownloader(type) {
		const DownloaderClass = this.downloaders[type];
		if (!DownloaderClass) {
			throw new Error(`不支持的下载器类型: ${type}`);
		}
		return new DownloaderClass();
	}
}

class ImgItem{
	constructor({name,src}){
		this.name = name;
		this.src = src;
		this.downloader = null;
	}
}
class ImgNode{
	img = null;
	next = null;
}
class ImgLine{
	hard = new ImgNode();
	count = 0;
	ant = this.hard;
	Add(img){
		this.ant.img = img;
		this.ant.next = new ImgNode();
		this.ant = this.ant.next;
		this.count++;
	}
	Pop(){
		if(this.count==0||this.hard==this.ant) return null;
		const img = this.hard.img;
		this.hard = this.hard.next;
		this.count--;
		return img;
	}
}
class DownloadBox{
	maxDownloadCount = 3;
	unDownload = new ImgLine();
	downloadingCount = {value:0,lock:false,queue:Promise.resolve()};
	downloadType = "gm";
	count = 0;
	end = 0;
	constructor(){
		this.box = this.AddBox();
		const _this = this;
		$('#downloadOptions').on('click', function(event) {
			const selectedOption = $('input[name="downloadType"]:checked').val();
			console.log('Selected download type: ' + selectedOption);
			_this.downloadType = selectedOption;
			if(_this.downloadType=="iframe") _this.maxDownloadCount = 1
		});
		$('.downloadBox').hide()
		$('.small-download-box').click(function(){
			$('.downloadBox').fadeIn()
		})
		$('.downloadBox .close').click(()=>$('.downloadBox').fadeOut())
	}
	Update_smallBox(sum,now){
		$('.small-download-box').text(now+"/"+sum)
	}
	AddBox(){
		let box = `
			<button class="small-download-box">1/10</button>
			<style>
				.small-download-box{
					border: none;
					border-radius: 5vmin;
					font-size: 5vmin;
					background-color: #fb8500;
					color: white;
					position: fixed;
					top: 0;
					left: 0;
					margin: 5vmin;
				}
			</style>
			<div class="downloadBox">
				<span class="counter">
					<a>总数：</a>
					<a>已完成：</a>
				</span>
				<span class="close">X</span>
				<form id="downloadOptions">
					<div class="radio-option">
						<input type="radio" id="gmOption" name="downloadType" value="gm" checked>
						<label for="gmOption">GM_downloand</label>
					</div>
					<div class="radio-option">
						<input type="radio" id="iframeOption" name="downloadType" value="iframe">
						<label for="iframeOption">iframe</label>
					</div>
				</form>
				<div class="item-container">
					
				</div>
			</div>
			<style>
				.downloadBox{
					margin: 5vmin;
					width: calc(100vmin - 10vmin - 10vmin);
					height: 80vmin;
					background-color: #023047;
					border-radius: 5vmin;
					padding: 5vmin;
					position:fixed;
					top:0;
					left: 0;
				}
				.downloadBox .item-container{
					width:100%;
					max-height: 63vmin;
					overflow-y:scroll;
				}
				.downloadBox .close{
					width: 6vmin;
					height: 6vmin;
					text-align: center;
					border-radius: 6vmin;
					float: right;
					line-height: 6vmin;
					color: #4a2f13;
					background-color: #d44b4b;
					display: inline-block;
				}
				.downloadBox .item-container::-webkit-scrollbar{width: 0px;}
				.downloadBox .counter{
					color: white;
				}
				.downloadBox #downloadOptions{
					margin: 2vmin 0 5vmin 0;
					color: #8ecae6;
				}
				.downloadBox #downloadOptions>div{
					display:inline-block;
				}
				.downloadBox .item{
					width: auto;
					height: auto;
					background-color: #fb8500;
					border-radius: 2.5vmin;
					list-style-type: none;
					margin: 0 0 5vmin 0;
					display: grid;
					grid-template-columns: 3fr 1fr 1fr;
					justify-content: center;
					align-items: center;
					grid-gap: 2vmin;
					--pd:1.5vmin;
					padding: var(--pd);
				}
				.downloadBox .item.end{
					filter:grayscale();
				}
				.downloadBox .item.ing{
					filter: hue-rotate(65deg);
				}
				.downloadBox .item button:first-of-type{
					background-color: #fb8500;
					text-align: left;
				}
				.downloadBox .item button{
					width: 100%;
					height: 100%;
					color: white;
					font-size: 3.5vmin;
					border: none;
					background-color: #ffb703;
					border-radius: 1.5vmin;
					padding: 1vmin;
				}
				.downloadBox .item button:active{
					filter: invert();
				}
				@media(min-width:1080px){
					.downloadBox .item button{
						font-size : 2.5vmin;
					}
				}
			</style>
		`
		$('body').append(box);
		return {
			obj:$('.downloadBox .item-container'),
			counter:{
				sum:$('.downloadBox .counter a:first'),
				end:$('.downloadBox .counter a:last')
			}
		}
	}
	AddImgs(imgs){
		if(!imgs.length){this.AddImg(imgs);return;}
		for(let i=0;i<imgs.length;i++){
			this.AddImg(imgs[i])
		}
	}
	AddImg(img){
		const _this = this;
		const item = this.AddItem(img);
		item.retry.click(function(){
			_this.AddImg(item.img);
			_this.RemoveItem(item);
			_this.count--;
			_this.UpdateCounter();
			_this.StartDownload();
		})
		item.name.click(function(){
			for(let i=0;i<_this.maxDownloadCount;i++){
				_this.StartDownload();
			}
		})

		const downloader = item.downloader;
		downloader.onDownloadBegin = ()=>{item.obj.addClass("ing")};
		downloader.onDownloadProgress = progress=>{
			_this.UpdateProgress(item.progress,progress);
		};
		downloader.onDownloadEnd = async ()=>{
			_this.end++;
			item.obj.removeClass("ing");
			item.obj.addClass("end");
			_this.UpdateCounter();
			await  _this.AddDownloadingCount(-1);
			this.StartDownload();
		};
		img.downloader = downloader;
		this.count++;
		this.unDownload.Add(img);
		this.UpdateCounter();
	}
	async StartDownload(){
		if(this.count==this.end){return;}
		console.log(this.downloadingCount.value,this.maxDownloadCount);
		//alert();
		if(this.downloadingCount.value>=this.maxDownloadCount){
			//setTimeout(() => this.StartDownload(), 1000);
			return;
		}
		await this.AddDownloadingCount(1);
		const img = this.unDownload.Pop();console.log(img,this.unDownload.count)
		if(img) img.downloader.download(img.name,img.src);
	}
	AddItem(img){
		const data = this.CreateItem(img);
		data.name.text(img.name);
		data.retry.data("data",data);
		this.box.obj.append(data.obj);
		return data;
	}
	RemoveItem(item){
		item.downloader.abort();
		item.obj.remove();
	}
	CreateItem(img){
		let li = `
			<li class="item">
				<button class="name">aaa.jpg</button>
				<button class="progress">0%</button>
				<button class="retry">Retry</button>
			</li>
		`
		li = $(li);
		const downloader = new DownloaderFactory(this.downloadType);
		const data = {
			obj:li,
			name:li.find(".name"),
			progress:li.find(".progress"),
			retry:li.find(".retry"),
			img:img,
			downloader:downloader
		};
		li.data("data",data);
		return data;
	}
	async AddDownloadingCount(n) {
		await this.downloadingCount.queue.then(() => {
			this.downloadingCount.value = this.downloadingCount.value + n;
		});
	}
	UpdateProgress(obj,progress){
		obj.text(progress);
	}
	UpdateCounter(){
		this.box.counter.sum.text("总数："+this.count);
		this.box.counter.end.text("已完成："+this.end);
		this.Update_smallBox(this.count,this.end);
	}
}
