// ==UserScript==
// @name         Get_all_img_Library
// @namespace    http://tampermonkey.net/
// @version      2025.02.11.01
// @description  添加了downloader和Add_css;
// @author       You
// @grant        none
// ==/UserScript==
function get_img_obo_sessionStorage(key,nums,geturl,getimg,putimg){
	if(window.location.href.indexOf(key)<0){return}
	var i = 2
	if(sessionStorage.num){i = Number(sessionStorage.num)}
	var oldimg = $(sessionStorage.img)
	before_reflash(i,oldimg,putimg)
	
	var state = sessionStorage.state
	if(state!='start'){putimg($(sessionStorage.img),0);sessionStorage.clear();return}
	
	if(i<=nums){
		var href = geturl(i)
		if(!href){putimg($(sessionStorage.img),0);sessionStorage.clear();return}
		$.ajax({
			url:href,
			success:function(){
				var img = getimg('')
				if(sessionStorage.img==undefined){sessionStorage.img=""}
				sessionStorage.img += $('<div></div>').append(img.clone()).html()
				window.location.href = href
				i+=1
				sessionStorage.num = i
			},
			error:function(){
				alert(href+' error')
				putimg($(sessionStorage.img),0)
				sessionStorage.clear()
			},
		})
		
	}else{
		putimg($(sessionStorage.img),0)
		sessionStorage.clear()
	}
}
function before_reflash(i,oldimg,putimg){
	if(sessionStorage.reflash){putimg($(sessionStorage.img),0)}
 
	console.log('before_reflash')
	window.onbeforeunload = function(){
		if(!oldimg){return}
		if(sessionStorage.state){return}
		sessionStorage.img = $('<div></div>').append(oldimg).html()
		sessionStorage.reflash = 'reflash'
		sessionStorage.num = i
	}
}
function get_img_obo_ajax_href(key,nums,geturl,getimg,putimg){
	var obo = function(i){
		var href = geturl(i)
		console.log(href)
		if(!href){return}
		$.ajax({
			url:href,
			success:function(data){
				var img = getimg(data)
				putimg(img,i)
				showmass(i+'/'+nums)
				
				i+=1
				if(i>=nums){return}
				obo(i)
			},
			error:function(){
				console.log('error: '+href)
				i+=1
				if(i>=nums){return}
				obo(i)
			}
		})
	};obo(0)
}
function new_bottom_bu(text){
	var bu = $('<button></button>').text(text).css({
		position:'fixed',
		bottom:0,
		width:'100vw',
		height:'10vh',
		'font-size':'5vh'
	})
	return bu
}
function obo_sessionStorage_start_bu(){
	var bu = new_bottom_bu("start")
	bu.click(function(){
		if(sessionStorage.state!='start'){
			sessionStorage.clear()
			sessionStorage.setItem('state','start')
			location.reload()
		}else{
			sessionStorage.clear()
		}
	})
	return bu
}
function showmass(ms) {
	if($('.mass_top').attr('class')){$('.mass_top').text(ms);return}
	$('body').append($('<div class="mass_top"></div>').css({
		'font-size':'2vw',
		'color':'rgba(0, 102, 0, 0.5)',
		'position':'fixed',
		'top':'10px',
		'left':'10px',
		'font-weight':'bold',
		'z-index':99999999,
	}).click(function(){$(this).hide()}))
	$('.mass_top').text(ms)
}
function add_css(tag,object){
	var style = $('<style></style>').text(tag+JSON.stringify(object).replace(/\"/g,'').replace(/,/g,";"))
	$('body').append(style)
}
function remove_sameimg(){
	var hs = new Array()
	$('img').each(function(){
		if(hs.indexOf(this.src)<0){
			hs.push(this.src)
		}else{
			$(this).remove()
		}
	})
}
function reflash_unloadimg(){
	var check = setInterval(function(){
		if(sessionStorage.reflashlock == 'yes'){return}
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
	},1000)
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
	    } else if (event.key === '0' && closew) {
	        // 用户按下了下箭头键
			window.close();
	        // 执行下方向键对应的操作
	    }
	});
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
 
		showimg = setTimeout(function(){
			if(state=='mouseout'){return}
			if(GetBigImg && img.attr('big-src')==null && !getting){
				new Promise((resolve,reject)=>{
					getting = true;
					GetBigImg(function(src){
						if(!src || src==""){console.log('src error');resolve()}else{
							getting = false;
							_img.attr('big-src',src).attr('src',src);
							let mass = $('<p>loading...</p>');
							_img.after(mass);
							let ioo = new Image();
							ioo.onload = function(){
								iimg.attr('src',src);
								console.log('src success');
								mass.remove();
								resolve();
							}
							ioo.src = src;
						}
					})
				})
			}
			$('.holdbox img').remove()
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
function Add_css(cssString){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssString;
	document.body.appendChild(style);
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
				await gi.WaitingElement(My_getimg).then(ele=>img = ele).catch(()=>img = $());
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
	gi.timeout = 5000;
	gi.WaitingElement=(GetEle)=>{
		return new Promise((resolve,reject)=>{
			let ele = GetEle();
			if(ele.length>0){resolve(ele);}else{
				let timeout = gi.timeout;
				let check = setInterval(()=>{
					let ele = GetEle();
					if(ele.length>0){
						resolve(ele);
						clearInterval(check);
					}
					timeout -= 100;
					if(timeout<=0){reject();clearInterval(check);}
				},100)
			}
		})
	}
}
Get_img_obo_iframe.prototype.show_mass = (mass)=>{
	window.GAIL.showmass(mass);
	$('.mass_top').css('font-size','10vmin')
}
 
 
window.GAIL = {
	get_img_obo_sessionStorage : get_img_obo_sessionStorage,
	get_img_obo_ajax_href : get_img_obo_ajax_href,
        Get_img_obo_iframe : Get_img_obo_iframe,
	new_bottom_bu : new_bottom_bu,
	obo_sessionStorage_start_bu : obo_sessionStorage_start_bu,
	showmass : showmass,
	add_css : add_css,
	remove_sameimg : remove_sameimg,
	reflash_unloadimg : reflash_unloadimg,
	AddKeyControl : AddKeyControl,
	hold_and_zoom : hold_and_zoom,
	Add_css:Add_css,
}