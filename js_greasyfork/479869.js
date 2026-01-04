// ==UserScript==
// @name        hitomi 2.0
// @namespace    http://tampermonkey.net/
// @version      20240304
// @description  修复预览bug
// @author       You
// @include      https://hitomi.la/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/479869/hitomi%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/479869/hitomi%2020.meta.js
// ==/UserScript==
 
(function() {
	//修改：再此标签之后添加输入框
    //add_input($('.navbar:first'))
	check_download()
	//change_close_bu()
	//add_next16()
	change_shuping()
	del_ad()
	add_ylimglist()
})();
//https://atn.hitomi.la/webpsmallsmalltn/2/66/6862fcd92e9b67ec4c78519d934bc18636b575ce65fbc2f5f0b7bcc7123d6662.webp
//https://aa.hitomi.la/webp/1691251202/614/6862fcd92e9b67ec4c78519d934bc18636b575ce65fbc2f5f0b7bcc7123d6662.webp
function add_css(tag,object){
	var style = $('<style></style>').text(tag+JSON.stringify(object).replace(/\"/g,'').replace(/,/g,";"))
	$('body').append(style)
}
var hitomi_list_click = null
var listToShowAction = null
function add_ylimglist(){
	if(window.location.href.indexOf('reader')<0){return}
	var getlist = function(){return $(window.opener.document).find('.gallery-preview.lillie').clone(true)}
	var putlist = function(img){
		$('.listbox').append(img).slideDown()
		add_css('ul.thumbnail-list',{
			'display': 'grid',
			'grid-template-columns': '1fr 1fr 1fr 1fr',
		})
		add_css('.thumbnail-container',{
			'width': '100% !important',
			'height': 'auto !important',
		})
		add_css('.thumbnail-container img',{
			'width': '100% !important',
			'height': 'auto !important',
		})
		add_css('ul.simplePagerNav',{
			'display': 'grid',
			'grid-template-columns': '1fr 1fr 1fr 1fr 1fr',
			'margin': 0,
			'width': '100vw',
			'justify-items': 'center',
		})
		add_css('ul.simplePagerNav li',{
			'font-size': '50px',
			'line-height': '50px',
		})
		add_css('.currentPage a',{'color':'black !important'})
		$('.thumbnail-container img').click(function(){
			$('.listbox').slideUp()
			var id = Number($(this).parents('a:first')[0].href.match(/\d+$/g)[0])-1
			$('.item img').eq(id)[0].scrollIntoView()
			if($('.item img').eq(id).attr('data-src')){
				$('.item img').eq(id).attr('src',$('.item img').eq(id).attr('data-src'))
			}else{if(listToShowAction){listToShowAction(id)}}
		})
		$('ul.simplePagerNav li').click(function(){
			setTimeout(function() {$('.thumbnail-list li:visible:first').each(function(){this.scrollIntoView()})}, 500);
		})
		$('ul.simplePagerNav li').click(function(e){
			e.stopPropagation()
			var id = $(this).attr('class').match(/\d+$/g)[0]
			id = ".simplePagerPage"+id
			$('.thumbnail-list li').hide()
			$(this).children().css('color','red')
			$(id).css('display','inline-block')
		})
		$('.listbox').click(function(){
			if(window.location.href.match("reader")){
				$(this).hide()
			}
		})
		$('ul.simplePagerNav a').removeAttr('href')
		if($(window).height()>$(window).width()){
			$('ul.thumbnail-list').css({'margin':'0px','grid-template-columns':'1fr 1fr'})
		}
	}
 
	var bu = $('<button>List</button>').css({
		'position':'fixed',
		top:'100px',
		right:'10px',
		'z-index':99999999,
	}).click(function(){
		var ajaxlist = (function(){
			if(!$('.listbox')[0]){
				$('body').append($('<div class="listbox"></div>').css({
					width:'100vw',
					height:'100vh',
					position:'fixed',
					'background-color':'#3b3b3b',
					top:0,
					'overflow':'scroll',
					'z-index':99999999,
				}))
				$('.listbox').hide()
				$(document).on('keydown',function(e){
					if(e.key=="-"){
						$('.listbox').slideToggle()
					}
				})
				var a = getlist()
				putlist(a)
			}else{
				$('.listbox').slideToggle()
			}
 
		})()
	})
	$('body').append(bu)
	if($(window).height()>$(window).width()){
		bu.css({
			'position':'fixed',
			'top':'90vh',
			'bottom':'0px',
			'left':'0px',
			'right':'0px',
			'width':'100vw',
			'height':'10vh',
		})
	}
}
function del_ad(){
	var check = setInterval(function(){
		$('.exo-ipp:visible').hide()
		$('.hitomi-XpDIUtCuC:visible').hide()
	})
}
function hold_and_zoom_leftorright(img){
			if(!$('.zoombox:first')[0]){
				var box = $('<div class="zoombox"><img><img></div>').css({
					position:'fixed',
					width:'100vw',
					height:'100vh',
					overflow:'hidden',
					'z-index':9999999,
					left:0,
					top:0,
					'background-color':'#2b2b2b',
				})
				box.find('img:first').css({
					width:'50%',
					height:'auto',
					position:'relative',
					left:'-50%'
				})
				box.find('img:last').css({
					width:'auto',
					height:'100vh',
					position:'relative',
					float:'right',
					left:'-35%'
				})
				$('body').append(box)
				box.hide()
				var state = 'small'
				var mode = 2
				box.on('mousemove',function(e){
					if(state=='small'){return}
					var x = e.clientX
					var y = e.clientY
					var top = 0-(y/$(window).height()*$('.zoombox img:first').height()-$(window).height()/2)
					if(top>0){top=0}
					if(top<(0-$('.zoombox img:first').height()+$(window).height())){top=0-$('.zoombox img:first').height()+$(window).height()}
					$('.zoombox img:first').css({
						top:top,
					})
				})
 
				box.find('img:first').on('mouseover',function(){
					if(mode==2){return}
					state = 'big'
					box.find('img:first').animate({left:'0px'},500)
					box.find('img:last').animate({left:'0px'},500)
				})
 
				box.find('img:last').on('mouseover',function(){
					if(mode==2){return}
					state = 'small'
					box.find('img:first').animate({left:'-50%'},500)
					box.find('img:last').animate({left:'-35%'},500)
				})
				if(mode==2){
					box.find('img:first').animate({left:'35%'},100)
					box.find('img:last').animate({left:'-68%'},100)
					state = 'big'
				}
				var z =1
				box.find('img').on('mousewheel',function(e){
					if(e.originalEvent.wheelDelta>0){
						z+=0.1
					}else{
						z-=0.1
					}
					if(z<=0){z=0.1}
					console.log(z)
					$(this).css('transform','scale(zz)'.replace('zz',z))
				})
				$(document).on('keydown',function(e){
					if(e.key=='+'){box.slideToggle(500)}
				})
			}
 
			img.on('mouseover',function(){
				$('.zoombox img').attr('src',this.src)
			})
		}
async function change_shuping(){
 
	if(!$('#mobileImages').attr('class')){return}
	$('#mobileImages').before((function(){/*<div class="box">
		<div class="item"><img src="no"></div>
	</div>*/}).toString().replace(/^[^\*]+\*|\*[^\*]+$/g,''))
	if(window.location.href.match(/\d+-$/g)){window.location.href = window.location.href.replace(/-$/g,"")}
	$('#mobileImages').before((function(){/*<style>
		.box{
			width: 100%;
			height: calc(100vh - 40px - 20vw);
			overflow: scroll;
			background-color: #222222;
			scroll-snap-type: y mandatory;
		}.box div{
			scroll-snap-align: start;
		}
		.item{
			width:100%;
			height: calc(100vh - 40px - 20vw);
			background-color: black;
			display: flex;
			align-items: start;
		}.item img{
			width: 100%;
			height: auto;
			background-color: #828282;
		}
		.blank{
			width:100%;
			height: 20vh;
		}
	</style>*/}).toString().replace(/^[^\*]+\*|\*[^\*]+$/g,''))
	function format(){
		var get = setInterval(function(){
			if($('#mobileImages img:not([ccc])').attr('src')){
				$('#mobileImages img').attr('ccc','yes')
				$('#mobileImages').hide()
				var now = window.location.href.match(/\d+$/g)[0]
				if(!now){now=1}
				now = Number(now)
				var num = Number($('#mobile-single-page-select option:last').text())
				var up_target= null
				var down_target = null
				if(true){
					for(var i=2;i<=num;i++){
						$('.box').append($('.item:last').clone(true))
					}
				}
				$('.box img:first').attr('src',$('#mobileImages img').attr('src'))
				$('.box').attr('lock','yes')
 
				window.sessionStorage.setItem('history',window.location.hash.match(/\d+/g)[0])
				function yl_next(i){
					//if(window.history.length>100){window.location.reload()}
					var history = Number(window.sessionStorage.getItem('history'))
					var gotopage = history+1
					if(!$('a#mobile-nextPanel .arrow_disabled.hidden').attr('class') || i==1 || gotopage>$('ul.mobile-nav-right select option').length){
						//清空历史记录，方便关闭
						//window.sessionStorage.setItem('history',window.location.hash.match(/\d+/g)[0])
						//alert(window.sessionStorage.getItem('history'))
						window.history.go(0-window.history.length+1);window.sessionStorage.setItem('hitomi_yl_end','yes')
						$('.box').attr('lock','no');return
					}
 
					//$('a#mobile-nextPanel')[0].click()
 
					window.sessionStorage.setItem('history',history+1)
					$('ul.mobile-nav-right select').val(gotopage)[0].dispatchEvent(new InputEvent("change"))
					$('.gallery-link a').text(history+1)
 
					var check=setInterval(function(){
						if($('#mobileImages img').attr('src')!=$('.item img:not([src="no"]):last').attr('src') && $('#mobileImages img').attr('src')){
							$('.item img[src="no"]:first').attr('src',$('#mobileImages img').attr('src'))
							yl_next(i-1)
							clearInterval(check)
							return
						}
					},100)
				}
				//yl_next(5)
 
				//修复手机list无效的逻辑
				console.log('start')
				var src = null
				var nowpage = Number(window.location.hash.match(/\d+/g)[0])
				if(sessionStorage.getItem('inview')){
					//nowpage = Number(sessionStorage.getItem('inview'))+1
				}
				
				function showimg(img){
					console.log(img)
					var pre = img.parent().prevAll().slice(1,3)
					console.log(pre)
					var nex = img.parent().nextAll().slice(0,3)
					console.log(nex)
					var all = null
					if(pre.length==0){all = nex}
					if(nex.length==0){all = pre}
					if(!all){all = pre.add(nex).add(img.parent())}
					all.find('img').each(function(){
						if(lock){return false}
						if(!$(this).attr('data-src')){getimgsrc($('.item img').index($(this)));return true}
						//if(!$(this).attr('data-src')){console.log('imgsrc error');return true}
						if(this.src == $(this).attr('data-src')){return true}
						this.src = $(this).attr('data-src')
					})
				}
				
				
				var lock = false
				let getImgStop = false
				let getImgStopCallback = null
				let scroll_state = 'down'
				async function getimgsrc(n){
					$('button:contains("List")').hide()
					if(lock){return}
					lock = true
					//预加载30
					let yulan = 3
					for(var i=n;(i<n+30&&i<num&&scroll_state=="down")||(i>=0&&i>n-30&&scroll_state=="up");){
						if(!$('.item img').eq(i).attr('data-src')){
							console.log('start get imglist '+i)
							var gotopage = i+1
							$('ul.mobile-nav-right select').val(gotopage)[0].dispatchEvent(new InputEvent("change"))
							var getsrc = new Promise((resolve,reject)=>{
								function dg(){
									setTimeout(function() {
										if(getImgStop){reject(new Error('user is stop'));if(getImgStopCallback){getImgStopCallback()};return}
										if(src!=$('#mobileImages img')[0].src){
											src = $('#mobileImages img')[0].src
											resolve()
										}else{dg()}
									}, 100);
								};dg()
							})
							await getsrc
							if(getImgStop){return}
							$('.item img').eq(i).attr('data-src',src)
							$('.gallery-link a').text(Math.floor((i+1)/num*100).toString()+"%")
							if(yulan>0){$('.item img').eq(i).attr('src',src);yulan--}
						}
						if(scroll_state=='down'){i++}else{i--}
					}
                    //window.history.go(0-window.history.length+1)//清空历史记录，方便关闭
					//showimg($('.item img').eq(nowpage-1))
					//$('.item img').eq(nowpage-1)[0].scrollIntoView()
					lock = false
					$('button:contains("List")').show()
					setTimeout(function() {window.history.go(0-window.history.length+1)}, 500);
				}
				$('.item img').eq(nowpage-1)[0].scrollIntoView()
				try{getimgsrc(nowpage-1)}catch(e){console.log(e.message)}
				showimg($('.item img').eq(nowpage-1))
 
				$('.item').on('touchstart',function(){
					//if(lock){return}
					showimg($(this).find('img'))
					if($(this).find('img')[0].naturalHeight==0){
						var myself = this
						var img = new Image
						img.onload=function(){
							$(myself).children().remove()
							$(myself).append(img)
						}
						img.src=$(this).find('img').attr('src')
					}
					$('[touch]').removeAttr('touch')
					$(this).attr('touch','yes')
				})
				
				//绑定list点击的逻辑
				listToShowAction = (n)=>{
					if($('.item img').eq(n).attr('src')=='no'){
						getimgsrc(n)
					}else{
						showimg($('.item img').eq(n))
					}
				}
				
				var scrollend = null
				var sy = $('.box').scrollTop()
				$('.box').scroll(function(){
					//获取正在看的图片，并加入缓存，后面刷新页面时使用
					if(scrollend){clearTimeout(scrollend)}
					scrollend = setTimeout(function() {
						var inview = function(){
							if($('[touch]').length==0){return null}
							console.log(sy+":"+$('.box').scrollTop())
							if(Math.abs($('[touch]')[0].getBoundingClientRect().top)<$(window).height()/2){
								console.log('return touch')
								return $('[touch]')
							}
							if(sy<$('.box').scrollTop()){
								console.log('down')
								scroll_state = 'down'
								//向下滚动
								var p = $('[touch]')
								for(var i=0;i<5;i++){
									p = p.next()
									if(p[0].getBoundingClientRect().top<$(window).height()/2){return p;break}
								}
								return null
							}else{
								//向上滚动
								console.log('up')
								scroll_state = 'up'
								var p = $('[touch]')
								for(var i=0;i<5;i++){
									p = p.prev()
									if(p[0].getBoundingClientRect().top<$(window).height()/2){return p;break}
								}
								return null
							}
						}
						
						var inviewimg = inview()
						sy = $('.box').scrollTop()
						if(!inviewimg){return}
						inviewimg = $('.item').index(inviewimg)
						sessionStorage.setItem('inview',inviewimg)
						console.log(inviewimg)
					}, 500);
					
					return//以下是旧的逻辑
					var all = $('.item:first').height()*($('.item').length-1)
					if($('.item img[src="no"]:first').attr('src') && $('.box').attr('lock')=='no'){
						if($('.item img[src="no"]:first')[0].getBoundingClientRect().top<$(window).height()){
							$('.box').attr('lock','yes')
							yl_next(6)
						}
					}
				})
				check_back_and_close()
				// var check_imgload=setInterval(function(){
				// 	$('.item img:not([src="no"])').each(function(){
				// 		if(this.naturalHeight==0){
				// 			var myself = this
				// 			var img = new Image
				// 			img.onload=function(){
				// 				$(myself).after(img)
				// 				$(myself).remove()
				// 			}
				// 			img.src=this.src
				// 		}
				// 	})
				// },100)
				clearInterval(get)
				return
			}
		},100)
 
 
	}
	format()
 
	//add close
	var touch_button = function(){
		var bu = $('<div style="display: flex;align-items: center;justify-content: center;">关闭</div>').css({
			width:'100%',
			height:'20vw',
			'font-size':'10vw',
			'color':'white',
			'background':'red',
		}).on('touchstart',function(){
			if(confirm('close?')){window.close()}
		})
		return bu
	}
    if($(window).height()>$(window).width()){
        $('body').prepend(touch_button())
    }else{
		var wait = function(){
			var lock = false
 
			if(!$('#comicImages img')[0]||!$('#comicImages img')[0].src){setTimeout(function(){wait()},500);return}
			hold_and_zoom_leftorright($('#comicImages img'))
			$('.zoombox').click(function(){
				if(lock){return}
				$('#comicImages img').click()
			})
 
			var checksrc = setInterval(function(){
				if(lock){return}
				var oimg = $('.zoombox img:first')[0].src
				if(oimg != $('#comicImages img')[0].src){
					$('.zoombox img:first')[0].src = $('#comicImages img')[0].src
					$('.zoombox img:last')[0].src = $('#comicImages img')[0].src
				}
			},100)
 
			var pages = Number($('#single-page-select option:last').val())
			var yl = function(i){
				lock = true
				if(window.location.hash==('#'+pages)){window.history.go(0-5+i);lock=false;return}
				if(i<=0){window.history.go(0-5);lock=false;return}
				var oimg = $('#comicImages img')[0].src
				$('#comicImages img').click()
				var waitimgload = function(){
					if(oimg==$('#comicImages img')[0].src||!$('#comicImages img')[0].complete){setTimeout(function(){waitimgload()},100);return}
					yl(i-1)
				};waitimgload()
			};yl(5)
			$('.zoombox').on('click',function(){
				var now = Number(window.location.hash.replace('#',''))
                if(window.location.hash==('#'+pages)){return}
				if(now%5==0){yl(5)}
			})
 
		};wait()
	}
 
 
	$('body').css({
		width:'100vw',
		height:'100vh',
		overflow:'hidden',
	})
}
function check_back_and_close(){
	var closew = function(){sessionStorage.removeItem('history');window.history.go(0-window.history.length+1);window.history.back();window.close()}
	// if(!sessionStorage.getItem('history')){
	// 	sessionStorage.setItem('history',window.location.href)
	// }else{
	// 	//如果有记录，说明是跳转过来的，直接判断是否返回了
	// 	if(sessionStorage.getItem('history')==window.location.href){
	// 		closew();return
	// 	}else{
	// 		sessionStorage.setItem('history',window.location.href)
	// 	}
	// }
	var history = window.history.length
	var now = window.location.href
	return
	var check = setInterval(()=>{
		if(now!=window.location.href){
			console.log("history:"+window.history.length)
			if(history<=window.history.length){
				closew();clearInterval(check)
			}
			history = window.history.length
			now = window.location.href
		}
	},100)
}
function add_next16(){
	if(window.location.href.indexOf('reader')<0){
		return
	}
	$('body').append($('<style></style>').html("input.button{\
	-webkit-appearance: none;\
	overflow:hidden;\
	width:20vw;\
	height:10vw;\
	outline: none;\
	border: 2px #FF557F solid;\
	border-radius: 10vw;\
	background: none;\
	}\
	input.button::-webkit-slider-thumb{\
	-webkit-appearance: none;\
	position: relative;\
	width:10vw;\
	height:10vw;\
	background:#ff557f;\
	border-radius:50%;\
	}"))
	$('body').append($('<input class="button" type="range" value="0">').css({
		bottom:'3vw',
		right:'0vw',
		'position':'fixed',
		'transform':'rotate(90deg)',
		'transform-origin':"right top",
	}).change(function(){
		if($(this).val()<80){
			return
		}
		var nums = Number($('#mobile-single-page-select option[value]:last').text())
		console.log(nums)
		var now = Number(window.location.href.match(/#\d+/g)[0].replace('#',''))
		console.log(now)
		var next = now + 16
		if(next>nums){next = nums}
		window.location.href = window.location.href.replace(/#\d+/g,('#'+next))
        location.reload()
		$(this).val(0)
		//$('option[value="num"]:first'.replace('num',next)).click()
	}).add($('<div style="position: fixed;bottom: 5vw;right: 2vw;color: white;">+16</div>')))
 
}
function change_close_bu(){
	var check = setInterval(function(){
		var bo = $('#mobileImages:not([ch])')
		if(bo.attr('class') && bo.find('img').height()!=0 && bo.find('img').height()!=undefined){
			bo.attr('ch','yes').height(bo.find('img').height())
			console.log(bo.find('img').height())
 
		}
		$('body').css('overflow','scroll')
	},500)
}
function check_download(){
	if($('#dl-button').attr('id')){
		setTimeout(function(){
			//$('#dl-button')[0].click()
			var name = $('#artists a')
			if(name.length>2){name = document.title.match(/^[^\|]+/g)[0]}else{name = name.text()}
			var bu = $('<button onclick="">download</button>').attr('onclick','download_gallery("name")'.replace('name',name))
			$('body').append(bu)
			bu.click()
			console.log(name)
			var check_downed=setInterval(function(){
				if($('#dl-button:visible').text()!=''){
					//window.close()
				}
			},3000)
		},100)
	}
    if($('h1:contains("Read Online")').text()==''){return}
	var c = 0
	var check = setInterval(function(){
		var read = $('a[href*="reader"]:not([ccc]):first')
		if(read.attr('href') && c==0){
			c=1
			read.attr('ccc','yes')
			window.open(read.attr('href'))
			clearInterval(check)
			return
		}
	},500)
}
function add_input(main){
	if(window.location.href.indexOf('reader')>=0){return}
	var input = $('<textarea class="searchall" style="overflow: scroll;"></textarea>')
	input.css({
		width:'100%',
		height:'200px',
 
	})
	main.after(input)
	var bu = $('<button>搜索</button>')
	input.after(bu)
	var i = 0
	bu.click(function(){
		var key = input.val().split('\n')
		console.log(key)
 
		var result = ''
 
		function search_one(){
			if(key[i].replace(' ','')==''){
				i = i+1
				if(i==key.length){alert('搜索完毕');return}
				search_one()
			}else{
				//修改：搜索地址
				var urls = 'https://hitomi.la/search.html?'+key[i].replace(/\([^\)]+\)/g,'').replace(/\[[^\]]+\]/g,'').replace(/\|.+/g,'').replace('error : ','')
				window.open(urls)
				i = i+1
			}
		}
		search_one()
		setTimeout(function(){
			search_one()
			setTimeout(function(){
				search_one()
			},300)
		},300)
	})
}
function add_button(x,y){
	if($('.tool').attr('class')==undefined){
		$('body').append('<div class="tool" style="position: fixed;"></div>')
		$('.tool').css({
			width:'100px',
			height:'auto',
			top:x,
			right:y,
			'z-index':999,
		})
	}
	var bu = $('<button></button>')
	bu.css({
		width:'100%',
		height:'50px',
	})
	$('.tool').append(bu)
	return bu
}