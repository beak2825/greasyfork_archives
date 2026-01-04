// ==UserScript==
// @name        hitomi获取列表2.0
// @namespace    http://tampermonkey.net/
// @version      2024.2.9
// @description  重写遍历的逻辑
// @author       You
// @include      https://hitomi.la/*
// @include		https://ltn.hitomi.la/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/486946/hitomi%E8%8E%B7%E5%8F%96%E5%88%97%E8%A1%A820.user.js
// @updateURL https://update.greasyfork.org/scripts/486946/hitomi%E8%8E%B7%E5%8F%96%E5%88%97%E8%A1%A820.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf('reader')>0){return}
	add_button()
	check_dj()
	if(window.location.href.indexOf("ltn.hitomi.la")>0){show_list()}
})();

function check_dj(){
	function change_range_css() {
		$('body').prepend((function(){/*<style>
		input.goinset[type="range"]{
			-webkit-appearance: none;
			overflow:hidden;
			width:70%;
			height:50px;
			margin: 0 15%;
			outline: none;
			background:#a3adc3;
			border-radius:50px;
		}
		input.goinset[type="range"]::-webkit-slider-thumb{
			-webkit-appearance: none;
			position: relative;
			width:50px;
			height:50px;
			background:#dbdde0;
			border-radius:50%;
			transition:.2s;
		}
	</style>*/}).toString().replace(/^[^\*]+\*|\*[^\*]+$/g,''))
	}
	//change_range_css()
	var check = setInterval(function(){
		$('.exo-ipp,iframe,.exo-native-widget-header,.exo-native-widget-outer-container').hide()
		$('.list-title').parent().children('div:not(.list-title)').hide()
		if($('.gallery-content>div:not([dj]):first').text()!=''){
			$('.gallery-content>div:not([dj])').each(function(){
				$(this).attr('dj','yes')
				$(this).find('a').attr('target','_blank')
				// $(this).children('div:last').prepend($('<input class="goinset" type="range">').change(function(){
				// 	if($(this).val()=='0' || $(this).val()=='100'){
				// 		window.open(link)
				// 	}
				// }))

				function range_box_color_change(range){
					var s = 0
					range.on('touchstart',function(e){
						range.removeAttr('lock')
						var t = e.originalEvent.targetTouches[0]
						s = t.pageX
						if((s-10)<$(this).width()/2){
							$(this).css('background','linear-gradient(90deg, white 50%, #ffc41e 50%)'.replace(/50/g,'70'))
						}else{
							$(this).css('background','linear-gradient(90deg, #ffc41e 50%, white 50%)'.replace(/50/g,'30'))
						}
					})
					range.on('touchmove',function(e){
						var t = e.originalEvent.targetTouches[0]
						var l = s-t.pageX
						// if(Math.abs(l)>$(this).width()/2){window.open(link)}
						if((s-10)<=$(this).width()/2 && (t.pageX-10)>$(this).width()*0.7 && !range.attr('lock')){range.attr('lock','yes');window.open(link)}
						if((s-10)>$(this).width()/2 && (t.pageX-10)<$(this).width()*0.3 && !range.attr('lock')){range.attr('lock','yes');window.open(link)}

					})
					range.on('touchend',function(e){
						$(this).css('background','')
					})
				}
				//range_box_color_change($(this))
			})
		}
	},100)
}
function add_button(){
	var bu = $('<button style="position: fixed;">获取列表</button>')
	bu.css({
		width:100,
		height:50,
		'font-size':20,
		top:10,
		right:10,
	})
	$('body').append(bu)
	bu.on('touchstart',function(){
		if(confirm("是否开始遍历")){}else{return}
		if(GM_getValue('list')){
			GM_deleteValue('list')
		}
		GM_setValue('list-url',window.location.href)
		get_list()
	})

	if(GM_getValue('list')){
		ask_wait()
		function ask_wait(){
			if($('.gallery-content').find('img:first').attr('src')==undefined){
				setTimeout(function(){
					ask_wait()
				},500)
				return
			}
			// var ask = confirm('是否继续获取列表')
			if(encodeURI(GM_getValue('list-url'))==window.location.href || GM_getValue('list-url').replace(/ /g,'')==window.location.href.replace(/20%/g,'')){
				if(Number(window.location.href.match(/\d+$/g)[0])%10==0){
					var ask = confirm('是否继续获取列表')
					if(!ask){show_list();return}
				}
				get_list()
			}else{
				GM_deleteValue('list')
				GM_deleteValue('list-url')
			}
		}
	}
}
function get_list(){
	var h = $('<div></div>')
	if(GM_getValue('list')){
		var d = GM_getValue('list')
		d = $(d)
		h.append(d)
	}
	h.append($('.gallery-content').children().clone())
	GM_setValue('list',h.html())
	setTimeout(function(){
		function check_next(){
			var now = $('.page-container li:not(li:contains("...")):not(li:has(a))')
			if($('.page-container:first').attr('class')==undefined){
				setTimeout(function(){check_next()},1000)
			}
			//console.log(now.html())
			if($('.gallery-content img:first').attr('src')==undefined){
				setTimeout(function(){check_next()},1000)
			}
			if(now.next().find('a').attr('href')){
				now.next().find('a').append('<div></div>')
				var url = now.next().find('a').attr('href')
				//url = window.location.href.replace(/#\d+/g,url)
				url = 'https://hitomi.la'+url
				GM_setValue('list-url',url)
				window.location.href = url
				// setTimeout(function(){
				// 	get_list()
				// },1000)
			}else{
				alert('end')
				show_list()
			}
		}
		check_next()
	},1000)
}
function show_list(){
	if(GM_getValue('list')){
		if(!GM_getValue('list_inimgsrc')){GM_setValue('list_inimgsrc','yes');window.location.href=$('img[src*="ltn.hitomi.la"]:first').attr('src');return}
		GM_deleteValue('list_inimgsrc')
		//alert()
		$('img').remove()
		var list = $('<div></div>')
		list.html(GM_getValue('list'))
		// $('.gallery-content').children().remove()
		// $('.gallery-content').append(list.children())
		$('body').append($('<div class="gallery-content"></div>').append(list.children()))
		check_title()
		GM_deleteValue('list')
		GM_deleteValue('list-url')
	}else{
		alert('list is error')
	}
	$('[dj]').each(function(){
		$(this).find('input[type="range"]').remove()
	}).removeAttr('dj')
	check_dj()
}
function check_title(){
		
		//let hs = new Array
		$('.gallery-content').children().each(function(){
			// if($(this).find('h1.lillie a').attr('title')){
			// 	$(this).find('h1.lillie a').text($(this).find('h1.lillie a').attr('title'))
			// }
			var title = $(this).find('h1.lillie a').text().replace(/\([^\)]+\)/g,'').replace(/\[[^\]]+\]/g,'').replace(/\{[^\}]+\}/g,'').replace(/[ ~？\?！\!\.]+/g,'').replace(/\|.+/g,'').replace(/-.+/g,'')
			//$(this).find('.lillie').attr('title',$(this).find('.lillie a').text())
			$(this).find('h1.lillie a').text(title)
			// if(hs.indexOf(title)<0){
			// 	hs.push(title)
			// }else{
			// 	//$(this).remove()
			// 	$(this).css('background-color','#ff5500')
			// 	$(this).attr('cf','yes')
			// }
			$(this).find('a').each(function(){$(this).attr('href','https://hitomi.la'+$(this).attr('href').replace(/^.+ltn\.hitomi\.la/g,''))})
		})
		
		let SortItems = $('.gallery-content').children().sort(function(a, b) {
		  var titleA = $(a).find('h1.lillie a').text();
		  var titleB = $(b).find('h1.lillie a').text();
		
		  // 使用localeCompare()方法进行文字排序
		  return titleA.localeCompare(titleB);
		});
		$('.gallery-content').append(SortItems)
		
		let hs = ""
		$('.gallery-content').children().each(function(){
			let title = $(this).find('h1.lillie a').text()
			console.log(title+" : "+hs)
			console.log(title==hs)
			if(title!=hs){hs = title}else{$(this).remove()}
		})
		
		
		//排序
		// hs=hs.sort()
		// var newlist = $('.gallery-content').children().clone()
		// $('.gallery-content').children().remove()
		// $(hs).each(function(){
		// 	var title = this
		// 	$('.gallery-content').append(newlist.filter(function(){if($(this).find('.lillie a').text()==title){return true}}))
		// })
		// $('[cf]').hide()
		$('img').css({'width':'100%','height':'auto'})
		$('body').css('background-color','white')
		// $('body').append($('<button style="position: fixed;">隐藏重复</button>').css({
		// 	width:100,
		// 	height:50,
		// 	top:100,
		// 	right:10,
		// 	'z-index':9999,
		// }).click(function(){
		// 	$('[cf]').fadeToggle()
		// }))
		//$('body').append('<button class="gettitle">获取标题</div>')
		// $('.gettitle').click(function(){
		// 	$('.gallery-content').children().each(function(){
		// 		var p = $('<p></p>')
		// 		p.text($(this).find('.lillie a').text())
		// 		$('body').append(p)
		// 	})
		// })
		// $('.gallery-content').children().each(function(){
		// 	var bu = $('<button style="position: absolute;">删除</button>')
		// 	bu.css({
		// 		'background-color':'red',
		// 		color:'white',
		// 		right:0,
		// 		bottom:0,
		// 	})
		// 	$(this).append(bu)
		// 	var p = $(this)
		// 	bu.click(function(){
		// 		p.remove()
		// 	})
		// })
	}