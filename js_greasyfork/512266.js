// ==UserScript==
// @name         kemono 3.0 pc版
// @namespace    http://tampermonkey.net/
// @version      20250222
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
// @require https://update.greasyfork.org/scripts/480132/1534996/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/515674/1518464/MyDownloader.js
// @require https://update.greasyfork.org/scripts/486938/1325051/download_by_atag.js
// @require https://update.greasyfork.org/scripts/522187/1532433/Kquery.js
// @require https://update.greasyfork.org/scripts/518420/1488747/MaxShowBox.js
// @downloadURL https://update.greasyfork.org/scripts/512266/kemono%2030%20pc%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512266/kemono%2030%20pc%E7%89%88.meta.js
// ==/UserScript==
 
$(function(){
	askAndAjax(changepb)
	GetBigImg()
	Add_hide_bu()
	ChangePageAtag()
	//ListeningDownload()
})

 function ChangePageAtag(){
	 WaitingElement(()=>$('.paginator menu'))
		.then(atag=>{
			atag.each(function(){
				const clone = $(this).clone();
				$(this).before(clone);
				clone.css('background','yellow').attr('clone','yes')
				//$(this).hide();
				const menu = $(this);
				clone.find('a[aria-current="page"]').each(function(){
					$(this).removeAttr('href');
					$(this).click(function(){
						$('.BottomConfirmWindow').hide();
						const i = clone.find('a[aria-current="page"]').index(this);
						const a = menu.find('a[aria-current="page"]').eq(i);
						stopAjax = true;
						const num = menu.find('.pagination-button-disabled.pagination-button-current').text();
						setTimeout(function() {
							$(hiddenItem).show();
							$(addedItem).remove();
							setTimeout(function() {
								$('[clone]').remove();
								menu.show();
								const href = a[0].href;
								window.open(href);
								window.close();
								return;
								a[0].click();
								WaitingElement(()=>{
									const li = menu.find('.pagination-button-disabled.pagination-button-current');
									if(li.text()!=num){
										return li;
									}else{
										return $();
									}
								}).then(tag=>{
										ChangePageAtag();
										askAndAjax(changepb);
									})
							}, 200);
						}, 100);
					})
				});
			})
		})
 }
 
let hiddenItem;
let addedItem;
let stopAjax = false;
async function askAndAjax(callback){
	if(window.location.href.match(/patreon\/user\/\d+\/post\/\d+/g)||window.location.href.match(/\.\w+$/g)){return}
	BottomConfirmWindow('是否显示全部？')
		.then(()=>{
			callback()
			hiddenItem = $();
			addedItem = $();
			stopAjax = false;
			let key = "kemono"
			let atag = $('.post-card.post-card--preview a.fancy-link.fancy-link--kemono[href]')
			let nums = atag.length
			let geturl = function(i){return stopAjax==true?false:atag.eq(i)[0].href}
			let getimg = function(data){
				return $(data).find('.post__body');
				return img.length==0?$("<img>"):img;
			}
			let putimg = function(img,i){
				if(stopAjax||img.length==0){return;}
				img = $(img[0].outerHTML);
				atag.eq(i).parent().after(img)
				atag.eq(i).parent().hide()
				hiddenItem = hiddenItem.add(atag.eq(i).parent());
				addedItem = addedItem.add(img);
				let link = $('<a target="_blank">Link</a>').attr('href',atag.eq(i)[0].href).click(function(event){
					event.stopPropagation();
					window.open(this.href);
				})
				img.append(link).css('border','#ff3908 2px solid')
 
				//$('.ad-container').remove()
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
				img.click(function(){
					Hide_and_show_one_line($(this));
				})

			}
			const gi = new window.GAIL.Get_img_obo_iframe(key,nums,geturl,getimg,putimg);
			gi.timeout = 2000;
			gi.Start();
		})
}

function Hide_and_show_one_line(item){
	let y = item[0].getBoundingClientRect().top;
	if(!y || y==0){alert('y is error');return;}
	let items = item;
	let prevall = item.prevAll().filter(function(){return this.getBoundingClientRect().top == y});
	let nextall = item.nextAll().filter(function(){return this.getBoundingClientRect().top == y});
	let scrolly = (getElementPosition(item[0])).top;
	window.scrollTo(0,scrolly);
	items.add(prevall).add(nextall).each(function(){
		$(this).children("*:not(h2)").slideToggle();
	})
}
function getElementPosition(element) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
 
    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };
}
function BottomConfirmWindow(mass){
	return new Promise((resolve,reject)=>{
		let box = $('<div class="BottomConfirmWindow"></div>').text(mass)
					.css({
						width:'100vw',
						'background':'rgb(175 15 37)',
						'position':'fixed',
						'border-radius':'5vw',
						bottom:'10vh',
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
		if($(window).width()>$(window).height()){
			box.css({
				'transform':'scale(0.2)',
				'bottom':'60%'
			})
		}
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
						$('.post__body img:not([ccc])').attr('ccc','yes').click(function(event){
							event.stopPropagation()
							let src = $(this).parent().attr('big-src')
							if(!src){src = this.src}
							let name = document.title + (new Date()).getTime() + this.src.match(/\.\w+$/g)[0]
							// GM_download({
							// 	url:src,
							// 	name:name,
							// })
							console.log(name)
							downloadText(src)
							//window.DBA.SetDownload(src,name)
						}).each(function(){
							let Getname = (img)=>{return document.title + ".png"}
							let _this = this;
							let GetBig = function(callback){
								let bigsrc = $(_this).parent().attr('big-src');
								callback(bigsrc);
							}
							hold_and_zoom($(this),Getname,GetBig)
						})
						//$(this).hide()
					})
	$('body').prepend(checkbu)
	checkbu.click().hide()
}

function Add_hide_bu(){
	let bu = $('<button>Hide</button>').css({
		position:'fixed',
		right:'0',
		bottom:'50%',
		'font-size':'5vh',
	}).click(function(){
		let min = -99999999999;
		let item = null;
		$('.post__body').each(function(){
			let y = this.getBoundingClientRect().top;
			if(y<0 && min<y){min = y;item = this;}
		});
		Hide_and_show_one_line($(item));
	})
	$('body').append(bu);
}
function changepb(){
	$('.card-list__items').css('display','block')
	if($(window).width()>$(window).height()){
		$('.card-list__items').css({
			display:"grid",
			'grid-template-columns':'20% 20% 20% 20%',
		})
	}
}
 
function ListeningDownload(){
	let src = GM_getValue('src')
	if(src&&window.location.href.indexOf(src.match(/[^\/]+$/g)[0])>=0){
		// let a = $('<a></a>')
		//         .attr('href',window.location.href)
		// 		.attr('download',GM_getValue('name'))
		// $('img').after(a)
		// a.append($('img'))
		// a[0].click()
		// $('img').click(function(e){
		// 	e.preventDefault(); // 阻止默认行为
		// 	  var link = document.createElement('a');
		// 	  link.setAttribute('href', window.location.href);
		// 	  link.setAttribute('download', GM_getValue('name')); // 指定下载文件名
		// 	  link.click();
		// 	  GM_deleteValue('name')
		// 	  GM_deleteValue('src')
		// })
		$('img').click(function(){
			GM_download({
				url:window.location.href,
				name:GM_getValue('name'),
			})
			GM_deleteValue('name')
			GM_deleteValue('src')
			$(this).after('<p>下载中。。。</p>')
		})
	}
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
async function hold_and_zoom(img,name,GetBigImg){
	if(!$('.holdbox:first')[0]){
		$('body').append($('<div class="holdbox"></div>').css({
			'z-index':'99',
			width:'100vw',
			height:'100vh',
			position:'fixed',
			top:0,
			left:0,
			display:'flex',
			'justify-content':'center',
		}))
		$('.holdbox').hide()
		$('.holdbox').on('click',function(e){
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
								if(LazyloadOneEndEvent){LazyloadOneEndEvent(iimg);}
								resolve();
							}
							ioo.src = src;
							mass.on('click',()=>{ioo.src = "";ioo.src = src});
						}
					})
				})
			}
			$('.holdbox img').remove()
			$('.holdbox:first').append(iimg.css({
				width:'auto',
				height:'100vh',
			}).attr('name',name(_img)).on('click',function(){
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
function LazyloadOneEndEvent(img){
	window.MaxShowBox.Add_Img(img);
	$('.max-show-box img').click(()=>{img.click();$('.max-show-box .closeBox').click()});
	Add_scale_mover($('.max-show-box'),$('.max-show-box img'));
	$('.max-show-box .closeBox').css({
		'z-index':99,
		'width':'100px',
		'height':'100px'
	});
	//img.on('mouseenter',()=>$('.max-show-box').show());
}

let Add_scale_mover_container_event = null
function Add_scale_mover(container,img){
	container.css('overflow','hidden');
	img.css({
		'transform': 'translate(var(--x),var(--y)) scale(var(--scale))',
		'transform-origin': 'top left',
		'--scale':'1'
	})
	Add_scale_mover_container_event = function(event){
		const mouseX = event.clientX - container[0].getBoundingClientRect().left;
		const mouseY = event.clientY - container[0].getBoundingClientRect().top;
		
		const px = mouseX/container.width();
		const py = mouseY/container.height();
		let tx = (img[0].getBoundingClientRect().width-container.width())*px;
		let ty = (img[0].getBoundingClientRect().height-container.height())*py;
		tx = Math.floor(0-tx) + "px"
		ty = Math.floor(0-ty) + "px"
		img.css({
			"--x":tx,
			"--y":ty
		});
	}
	if(container.attr('add-event')){return;}
	container.on('mousemove mouseenter',function(event){
		Add_scale_mover_container_event(event);
	}).attr('add-event','yes')
}