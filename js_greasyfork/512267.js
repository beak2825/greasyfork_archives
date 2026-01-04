// ==UserScript==
// @name     rule34.xxx 2.0 pc版
// @version  20210317
// @description good looking
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @include https://rule34.xxx/*
// @include http://rule34.xxx/*
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1423808/Get_all_img_Library.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/512267/rule34xxx%2020%20pc%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512267/rule34xxx%2020%20pc%E7%89%88.meta.js
// ==/UserScript==
function download_img(imgs){
	function download_img_one(imgs,i){
		if(i<imgs.length){
			var src = imgs.eq(i).attr('src')
			var houzui = '.jpg'
			if(src.match(/\.[^\.\?]+$/g)){
				houzui = src.match(/\.[^\.\?]+$/g)[0]
			}
			var names = document.title+(i+1)+houzui
			console.log(names)
			console.log(src)
			GM_download({
				url:src,
				name:names,
				onload:function(){
					i = i+1
					download_img_one(imgs,i)
				},
				error:function(){
					console.log('下载错误：'+src)
					download_img_one(imgs,i)
				}
			})
		}else{show_mas_short('下载完毕')}
	}
	var i = 0
	download_img_one(imgs,i)
}
function zoomimg(img){
	img.each(function(){
		$(this).on('mouseover',function(){
			$('.zoomimg').removeClass('zoomimg')
			$(this).addClass('zoomimg')
		})
		$(this).on('mouseout',function(){
			$(this).removeClass('zoomimg')
		})
	})
}
$(function(){
	var zoom = 1
	$(document).on('keydown',function(e){
		if(e.key=="+"){
			zoom+=0.5
			$('.zoomimg').css('transform','scale(xx)'.replace('xx',zoom))

		}
		if(e.key=="-"){
			zoom-=0.5
			if(zoom<=1){zoom = 1}
			$('.zoomimg').css('transform','scale(xx)'.replace('xx',zoom))
		}
	})
})
class rule34{
	check_img(){
		var check = setInterval(function(){
			var img = $('#image:not([ccc])')
			if(img.attr('src')){
				img.each(function(){
					//$(this).attr('ccc','yes');
					$(this).find('img').attr('big','yes');
					$(this).css({
						width:'auto',
						height:'100vh',
					})
					$(this).click(function(){
						document.title = '【comic】'+document.title.replace(/[(【ren】)(【comic】)]/g,'')
						let a = $('.tag-type-artist.tag a:last')
						if(a.length>0){
							document.title = '【comic】' + a.text()
						}
						download_img($(this))
					})
				})
				zoomimg(img)
				$('#post-view').css({'justify-content':'center',display:'flex'})
				clearInterval(check)
				return
			}
		},100)
	}
}

class rule34_index{
	change_bj(callback){
		var check = setInterval(function(){
			var div = $('span.thumb:first').parent('div:not([ccc])')
			if(div.html()!=''&&div.html()){
				div.attr('ccc','yes')
				div.css({
					display: 'grid',
					'grid-template-columns': 'repeat(5,1fr)',
					'background-color':'#319500',
					width:'90vw',
				})
			}


			var img = $('span.thumb:first').parent().find('img:not([ccc])')
			if(img.eq(0).attr('src')){
				var i = 1;
				img.each(function(){
					$(this).attr('ccc','yes').attr('id',i+'_'+'0img')
					i+=1
					// $(this).css({
					// 	height:'auto',
					// 	width:'100%',
					// })
					// $(this).parent().parent().css({
					// 	height:'auto',
					// 	width:'100%',
					// })
				})
				zoomimg(img)

				$('.pagination').attr('id',(i+(i-1)%5+1)+'_'+'0img')
				callback(img)
			}

			var page = $('.pagination:not([ccc])')
			if(page.attr('class')){
				page.attr('ccc','yes')
				page.css('font-size','10em')
			}
		})
	}
	check_item(img){
		img.each(function(){
			var a = $(this).parent()
			a.attr('ccc','yes')
			a.css('background-color','yellow')
			var link =a.attr('href')
			a.click(function(){
				GM_deleteValue('mhba')
				window.open(link)
				event.stopPropagation()
			})
			a.removeAttr('href')

			let name = function(img){
				return img.attr('downlaodname')
			}
			let _this = this;
			let GetBigSrc = function(callback){
				$.ajax({
					url:link,
					success:function(data){
						let smallimg = $(data).find('#image')
						let actor = $(data).find('.tag-type-artist.tag a:last')
						console.log(smallimg.length)
						if(smallimg.length==0){
							//alert("error")
                            smallimg = $(_this)
							//smallimg = $(data).find('#gelcomVideoPlayer')
							if(smallimg.length==0){smallimg = $(_this)}else{
								smallimg.attr('src',smallimg.find('source').attr('src'))
							}
						}
						console.log(smallimg[0].src)
						let downloadname = (document.title + smallimg[0].src.match(/\.jpg|\.jpeg|\.png|\.webp|\.gif|.mp4/g)[0])
						if(actor.length>0){
							downloadname = (actor.text() + smallimg[0].src.match(/\.jpg|\.jpeg|\.png|\.webp|\.gif|\.mp4/g)[0])
						}
						$(_this).attr('downlaodname',downloadname).attr('src',smallimg[0].src)
						if(smallimg.length>0){
							callback(smallimg.attr('src'))
						}
					},
					error:function(){
						callback("")
					}
				})
			}
			window.GAIL.hold_and_zoom($(this),name,GetBigSrc)
		})
	}
}
function add_css(tag,object){
	var style = $('<style></style>').text(tag+JSON.stringify(object).replace(/\"/g,'').replace(/,/g,";"))
	$('body').append(style)
}
$(function(){
	// alert(GM_getValue('mhba'))
	var r = new rule34
	r.check_img()

	var index = new rule34_index
	index.change_bj(function(img){
		index.check_item(img)
	})

	add_css('.image-list span',{
		'width':'100%',
		'height':'100vh',
		'display': 'block',
	})
	add_css('.image-list img',{
		'width':'100%',
		'height':'auto',
		'display': 'block',
	})
	var showlistbu = function(){
		var i = 1
		var n = 0
		var hs = []
		$('body').append($('<button class="Mynextimg">next</button>').css({
			position:'fixed',
			right:'10px',
			top:'50vh',
		}).click(function(){
			var id = ''
			do{
				id = '#'+i+'_'+n+'img'
				if($(id).attr('id')){break}else{
					if(i%5==0){i+=1;n=0;break}
					i+=1
				}
			}while(true)
			//if(!$(id).attr(id)){alert('end')}
			window.location.href = window.location.href.replace(/#.+$/g,"")+"#"+i+'_'+n+'img'
			hs.push({i:i,n:n})
			n += 1
		}))
		var preimg = function(){
			var pr = hs.pop()
			if(pr&&pr.i==i&&pr.n==n-1){preimg();return}
			if(!pr){pr = {i:1,n:0}}
			i = pr.i
			n = pr.n
			window.location.href = window.location.href.replace(/#.+$/g,"")+"#"+i+'_'+n+'img'
			n += 1
		}
		$(document).on('keydown',function(e){
			if(e.key=='.'){$('button.Mynextimg').click()}
			if(e.key=='3'){preimg()}
			if(e.key=='ArrowRight'){$('a[alt="next"]')[0].click()}
			//alert(e.key)
		})
	};showlistbu()
	let down = null;
	let up = null;
	let left = null;
	let right = null;
	let closew = true;
	window.GAIL.AddKeyControl(down,up,left,right,closew)
	//fiexdHoldAndZoom()
})

function fiexdHoldAndZoom(){
	// let foo = function(){
	// 	$('.holdbox img:not([fiexd])')
	// }
	// let check = setInterval()
	$('body').on('mousedown',function(event) {
	    // 获取被点击的元素
	    const clickedElement = event.target;
	    // 判断被点击的元素是否具有特定类名
	    if ($(clickedElement).hasClass('zoomimg')) {
	        // 如果点击的是具有 'yourClassName' 类名的元素
			console.log(clickedElement.src)
	        setTimeout(()=>{download_img($(clickedElement));},500)
	    }
	});
}