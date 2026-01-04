// ==UserScript==
// @name        下载大照片-手机
// @version      20240416
// @author       You
// @description  good
// @include     *
// @exclude		http://www.3ycy.com/*
// @exclude		https://www.pixiv.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require     https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://update.greasyfork.org/scripts/480132/1349340/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/491134/%E4%B8%8B%E8%BD%BD%E5%A4%A7%E7%85%A7%E7%89%87-%E6%89%8B%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/491134/%E4%B8%8B%E8%BD%BD%E5%A4%A7%E7%85%A7%E7%89%87-%E6%89%8B%E6%9C%BA.meta.js
// ==/UserScript==
var downloaded_IMG = 0
$(function(){
	if($(window).width()>$(window).height()){return}
	add_bu().then(add_check_img_fun)
	//check_atag()
})
$(function(){
	check_session()
})
function add_bu(){
	var bu = $('<button class="download_bu" style="position: fixed;">重试</button>').css({
		width:'100vw',
		height:'20vw',
		bottom:'0px',
		left:'0px',
		'font-size':'10vw',
		'z-index':9999,
	})
	$('body').append(bu)
	return new Promise((reject)=>{reject(bu)})

	// var bu2 = $('<button style="position: fixed;">下载2</button>').css({
	// 	width:'100%',
	// 	height:$(window).height()/20,
	// 	bottom:$(window).height()/20,
	// 	'z-index':9999,
	// 	'display':'none',
	// })
	//$('body').append(bu2)

	// bu2.click(function(){
	// 	download_img_by_atag($('img[big]:visible'))
	// })
}
function add_check_img_fun(bu){
	bu.attr('state','none')
	bu.click(function(){
		switch(bu.attr('state')){
			case ("none") : get_big_img(bu);break
			case ("geted") : or_download_big_img(bu);break
			case ("downloading") : or_re_download_big_img(bu);break
		}

		// bu2.show()
		// bu2.text(bu2.text().replace('2',$('img[big]:visible').length.toString()))
		// if(!window.location.href.match(/117.life/g)){return}
		// $('img[big]:visible').off('click').each(function(){
		// 	$(this).click(function(){download_img_by_atag($(this))})
		// })
	})
}
async function get_big_img(bu){

	if(bu.attr('state')!="none"){return}

	if(!$('img[big]:first').attr('src')){
		$('img').each(function(){
			if(this.naturalWidth>400 && this.naturalHeight>400){
				$(this).attr('big','yes')
				check_img_has_atag($(this))
			}
		})
	}
	$('img[big]').css({
		'border-width':'5px',
		'border-color':'#ff9514',
		'border-style':'dashed'
	})
	bu.text('下载'+$('img[big]:visible').length.toString())
	bu.attr('state',"geted")
}
async function download_img_to_zip(images,name){
	// const images = $('img[big]');
	if(images.length==0){return}
	const urls = images.map(function() {
	    return $(this).attr('src');
	}).get();

	let i = 0
	// 使用Canvas获取图片内容
	const responses = await Promise.all(urls.map(url => {
	    return new Promise((resolve, reject) => {
	        const img = new Image();
	        img.crossOrigin = 'Anonymous';

	        img.onload = () => {
	            const canvas = document.createElement('canvas');
	            const ctx = canvas.getContext('2d');
	            canvas.width = img.naturalWidth;
	            canvas.height = img.naturalHeight;
	            ctx.drawImage(img, 0, 0);
	            $('.mass_top').text(++i)
	            // 将图片转换为Blob对象
	            canvas.toBlob(blob => resolve(blob));
	        };

	        img.onerror = reject;
	        img.src = url;
	    });
	}));

	// 创建并打包图片文件
	const zip = new JSZip();
	responses.forEach((data, index) => {
	    zip.file(`image_${index}.jpg`, data, { binary: true });
	});

	// 下载压缩包
	const content = await zip.generateAsync({ type: 'uint8array' });
	console.log("content")
	const blob = new Blob([content], { type: 'application/zip' });
	const url = URL.createObjectURL(blob);
	GM_download({
	    url: url,
	    name: name,
	    onprogress: function(details) {
	        const process = Math.round((details.loaded / details.total) * 100) + '%';
	        $(".mass_top").text(process);
	    },
	    onload: function() {
	        console.log('Download completed');
			images.remove()
	    },
	    onerror: function(error) {
	        console.error('Download error:', error);
	    }
	});
}
function check_img_has_atag(img){
	let atag = img.parents('a[href]:first')
	if(atag.length==0){return}
	let href = atag[0].href
	if(href.match(/\.jpg|\.jpeg|\.png|\.webp|\.bmp|\.gif/g)){
		img[0].src = href
	}
	atag.removeAttr('href')
	img.click(function(e){
		e.stopPropagation()
		download_img($(this),function(){$(this).remove()})
	})
}
function or_download_big_img(bu){
	if(bu.attr('state')!="geted"){return}
	
	donwnloader.Download_img($('img[big]:visible'))
	//download_img($('img[big]:visible'),(img)=>{img.remove()})
	//download_img_to_zip($('img[big]:visible'),document.title+".zip")
	//download_img_by_atag($('img[big]:visible'))

	bu.attr('state','downloading')
	bu.text('downloading')
}
function or_re_download_big_img(bu){
	if(bu.attr('state')!="downloading"){return}
	
	donwnloader.Download_img($('img[big]:visible'))
	//download_img($('img[big]:visible'),(img)=>{img.remove()})
	//download_img_to_zip($('img[big]:visible'),document.title+".zip")
	//download_img_by_atag($('img[big]:visible'))

	bu.attr('state','none')
	reload_img()
	bu.text('重试')
}
function reload_img(){
	var img = $('img:visible').filter(function(){return this.naturalWidth==0})
	img.each(function(){
		if(this.naturalWidth==0){
			//console.log(this.src)
			var clone = $(this).clone(true)
			var parent = $(this).parent()
			var pre = $(this).prev()
			var next = $(this).next()
			$(this).remove()

			setTimeout(function(){
				if(pre[0]){pre.after(clone);return}
				if(next[0]){next.before(clone);return}
				if(parent[0]){parent.append(clone);return}
			},500)
		}
	})
}
function download_img_by_atag(imgs){
	let srcs = ""
	let i = 0
	imgs.each(function(){
		srcs += this.src+"【】"
		$(this).remove()
		if(++i>49){
			return false
		}
	})
	GM_setValue('srcs',srcs)
	GM_setValue('name',document.title)
	GM_setValue('num',0)
	window.open(imgs.eq(0)[0].src)
}

async function check_session(){
	if(!GM_getValue('srcs')){return}
	let srcs = GM_getValue('srcs')
	let name = GM_getValue('name')
	let num = GM_getValue('num')


	srcs = srcs.split("【】")
	num = Number(num)
	// alert(srcs)
	// alert(srcs.length)
	// alert(num)
	if(window.location.href!=srcs[num]){return}

	let download = ()=>{
		let a = $('<a></a>')
					.attr({
						'href':window.location.href,
						'download':name + num + '.jpg'
					})
		a[0].click()
		setTimeout(()=>{
			num++
			if(num==srcs.length){
				GM_deleteValue('srcs')
				GM_deleteValue('name')
				GM_deleteValue('num')
				alert('end')
				window.close()
				return
			}
			GM_setValue('num',num)
			window.location.href = srcs[num]
		},500)
	}

	let img = $('img:first').clone()
	img[0].onload = download
	$('img:first').after(img)
}
class Downloader{
	constructor(){
		this.downloadType = "";
		this.downloaded = [];
		this.downloading = 0;
		this.downloadError = [];
		this.imgs = "";
		this.maxDownloadingCounts = 10;
		this.timeout = 2000;
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
	async Download_img(imgs){
		let self = this;
		if(this.downloadType==""){
			await this.Test_downloadType(imgs.eq(0));
		}
		
		this.Set_download(imgs)
		if(this.downloadType=="GM_download"){
			this.Donwload_img_by_GM();
		}else{
			this.Donwload_img_by_atag();
		}
	}
	Donwload_img_by_GM(){
		let self = this;
		async function Download_one(i){
			if(i>=self.imgs.length){return;}
			if(self.downloading>=self.maxDownloadingCounts){setTimeout(()=>{Download_one(i)},1000);return;}
			
			let name = '';
			let src = '';
			self.downloading++;
			try{
				await self.Check_and_get_nameAndsrc(i)
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
			GM_download({
				url:src,
				name:name,
				onload:function(){
					self.downloaded.push(i);
					self.downloading--;
					if(window.GAIL){
						window.GAIL.showmass((self.downloaded.length+self.downloadError.length)+"/"+self.imgs.length);
					}
					self.imgs.eq(i).remove();
				},
				onerror:function(){
					self.downloading--;
					self.downloadError.push(i);
				},
				onprogress:function(){
					if(timeout){return false;}
				}
			});
			Download_one(i+1);
		}
		Download_one(0);
	}
	Check_and_get_nameAndsrc(i){
		let self = this;
		return new Promise(async (resolve,reject)=>{
			let src = self.imgs.eq(i).attr('big_src');
			if(!src){src = self.imgs.eq(i)[0].src;}
			if(!src){reject();}
			console.log("check:"+src)
			try{
				await self.check_src_is_right(src);
			}catch(error){
				reject();
			}
			let ext = src.match(/\.jpg|\.png|\.webp|\.gif|\.bmp/g);
			if(!ext){ext = '.png';}else{ext = ext[0];}
			let name = document.title + i + ext;
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
				await self.Check_and_get_nameAndsrc(i)
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
}
let donwnloader = new Downloader();


function download_img(imgs,callback){
	if(document.title.length>20){document.title = document.title.substr(0,20)}
	async function download_img_one(imgs,i){
		if(i<imgs.length){
			
			var src = imgs.eq(i).attr('big_src')
			if(!src){src = imgs.eq(i).attr('src')}
			var qianzui = window.location.href.match(/.+(?=\/[^\/]+)/g)[0]
			if(src.match(/(http)[^\/]+\/\/[^\/]+/g)==null){
				if(src[0]=='/'){
					src = window.location.href.match(/.+\/\/[^\/]+/g)[0]+src
				}else{
					src = qianzui+src
				}
				if(src.indexOf('?')>0){
					src = src.replace(/\?.+/g,'')
				}
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
			var names = document.title+(new Date()).getTime()+'.'+houzui
			// var names = 'abc'+(i+1)+'.'+houzui
			console.log(names)
			console.log(src)
			try{
				await check_src_is_right(src)
			}catch(error){
				console.log('imgsrc error')
				download_img_one(imgs,++i)
				return
			}
			GM_download({
				url:src,
				name:names,
				onload:function(){
					callback(imgs.eq(ied))
					ied++
					if($('.mass_top').attr('class')==undefined){
						$('body').append($('<div class="mass_top"></div>').css({
							'font-size':'10vw',
							'color':'rgba(0, 102, 0, 0.5)',
							'position':'fixed',
							'bottom':'30vw',
							'left':'10px',
							'font-weight': 'bold',
						}).click(function(){$(this).hide()}))
					}
					$('.mass_top').text(Math.floor(ied/imgs.length*100)+"%")
					$('.download_bu').text(Math.floor(ied/imgs.length*100)+"%")
					if(ied==imgs.length){$('.mass_top').css('color','#c26304')}
				},
				error:function(){
					console.log('下载错误：'+src)
					download_img_one(imgs,i)
				}
			})
			i = i+1
			download_img_one(imgs,i)

		}else{}
	}

	let i = 0
	let ied=0
	download_img_one(imgs,i)
}
function check_src_is_right(src){
	return new Promise((resolve,reject)=>{
		let iimg = new Image()
		iimg.onload = function(){
			if(this.width*this.height*this.naturalWidth*this.naturalHeight==0){reject()}else{resolve()}
		}
		iimg.onerror = function(){reject()}
		iimg.src = src
	})
}
function show_mas_short(t){
	if($('.show_mas_short').attr('class')==undefined){
		$('body').append('<button class="show_mas_short" style="position: fixed;"></button>')
		$('.show_mas_short').css({
			width:$(window).width()*0.6,
			height:$(window).height()*0.08,
			bottom:$(window).height()*0.01,
			left:'20%',
			'background-color':'#ffffff',
			'font-size':$(window).height()*0.04,
			'display':'none',
			'z-index':'11',
			'border-radius':'50px',
			'border':'none'
		})
	}
	if($('.show_mas_short').css('display')!='none'){
		if(t == $('.show_mas_short').text()){return}else{
			setTimeout(function(){show_mas_short(t)},3000)
		}
	}
	$('.show_mas_short').text(t)
	$('.show_mas_short').fadeIn()
	setTimeout(function(){
		$('.show_mas_short').fadeOut()
	},3000)
}