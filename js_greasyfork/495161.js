// ==UserScript==
// @name         jdwht 2.0
// @namespace    http://tampermonkey.net/
// @version      2025.03.15
// @description  删除广告
// @author       You
// @include        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouo.io
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require     https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/515674/1518464/MyDownloader.js
// @require https://update.greasyfork.org/scripts/480132/1534996/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/515677/1525859/MyShowBox.js
// @downloadURL https://update.greasyfork.org/scripts/495161/jdwht%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/495161/jdwht%2020.meta.js
// ==/UserScript==
$(function () {
	if($('.dh,.nav').eq(0).attr('class')==undefined){return false}
	var index = new index_mod
	index.change_pb()
	var list = new list_mod
	list.getimg()
	list.del_ad()
	list.more_img()
})
class index_mod{
	change_pb(){
		$('.dh a').removeAttr('target')
		$('.pagelist a').removeAttr('target')
	}
}
class list_mod{
	getimg(){
		if(window.location.href.indexOf('list')>=0){return;}
		const showBox = new ShowBox();
		showBox.Add($('.slider img'));
		$('body').before($('.clickShowBox,.clickShowBox_ShowBu'));
		let key = "jdwht";
		let atag = $('.pagelist a:eq(-2)');
		let nums = (()=>{
						if(atag.length>0){
							return Number(atag.text());
						}else{
							return 1;
						}
					})();
					
		$('.slide').children().remove();

		let geturl = function(i){
						return atag[0].href.replace(/\d+(?=.html)/g,(i+1));
					}
		let getimg = function(data){return $(data).find('.slide').children();}
		let putimg = function(img,i){
			//$('.slide').append(img);
			img.find('img').attr('big','yes');
			showBox.Add(img.find('img'));
			$('.mass_top').css('font-size','10vw');
		}
		window.GAIL.get_img_obo_ajax_href(key,nums,geturl,getimg,putimg);
	}
	getimg2(){
		var atag = $('.pagelist a:contains("下一页"):first')
		if(atag.eq(0).attr('href')==undefined){console.log('atag none');return}
		$('body').append($('<div class="mass_top"></div>').css({
			'font-size':'10vw',
			'color':'rgba(0, 102, 0, 0.5)',
			'position':'fixed',
			'top':'10px',
			'left':'10px',
			'font-weight':'bold',
		}).click(function(){$(this).hide()}))

		var num = Number(atag.prev().text())
		var href = atag.prev().attr('href')
		for(var i = 1;i<=num;i++){
			function ajax(urls){
				$.ajax({
					url:urls,
					success:function(data){
						console.log(urls)
						var src = $('<div></div>').html(data).find("#picg img").attr('src')
						src = ("img[src='ssrc']").replace('ssrc',src)
						if($(src).attr('src')){return}
						$('#picg p').append($('<div></div>').html(data).find("#picg a"))
						$('.mass_top').text(Math.floor($("#picg img").length/num*100)+"%")
						if($('.mass_top').text()=="100%"){$('.mass_top').css('color','red')}
					},
					error:function(){
						setTimeout(function(){
							ajax(urls)
						},100)
					}
				})
			}
			ajax(href.replace(/\d+\.html$/g,i+".html"))
		}
		var deladd = setInterval(function(){
			if(!$("#picg img").attr('src')){return}
			if(!$('.showbox').attr('class')){$('body').append($('<div class="showbox"></div>').css({
				position:'fixed',
				top:0,
				left:0,
				width:'100vw',
				height:'100vh',
				'overflow':'scroll',
				'background-color':'#636363',
				'z-index':99999999999999999999,
			}))}
			$('#picg img:not([showbox])').each(function(){
				$(this).attr('showbox','yes')
				$('.showbox').append($(this).clone().css({
					'max-width':'100vw',
				}))
			})
			$('button:contains("重试"):not([inshowbox]),.mass_top:not([inshowbox])').each(function(){
				$(this).attr('inshowbox','yes')
				$('.showbox').append($(this))
			})
		},100)
	}
	del_ad(){
		var check = setInterval(function(){$('#pic,#divStayTopright2').remove()},10)
	}
	more_img(){
		var atag = $('.more a')
		if(atag.eq(0).attr('href')==undefined){return}
		function ajax(urls,tag){
			$.ajax({
				url:urls,
				success:function(data){
					console.log(urls)
					var src = $('<div></div>').html(data).find("#picg img").attr('src')
					src = ("img[src='ssrc']").replace('ssrc',src)
					if($(src).attr('src')){return}
					tag.before($('<div></div>').html(data).find("#picg img").css({width:'100%',heigth:'auto'}).click(function(){
						window.open(tag.attr('href'))
					}).hide())
				},
				error:function(){
					setTimeout(function(){
						ajax(urls)
					},100)
				}
			})
		}
		atag.each(function(){
			ajax($(this).attr('href'),$(this))
		})
		$('.more').prepend($('<button>Look</button>').css({
			width:'100%',
			height:'20vw',
			'font-size':'10vw',
		}).click(function(){
			$('.more img').show()
		}))
	}
}
function change_atag(){
	$('.nav a').removeAttr('target');
	$('a:not([delad]),#list img').on('click,touchend',function(){
		$(this).attr('delad','yes').click(function(e){e.stopPropagation();})
	});
}
function del_ad(){
	$('*:not(.mass_top,.download_bu)')
	    .filter(function(){
		    return $(this).css('position')=="fixed";
		})
		.remove();
}
$(function(){
	$('body').on('touchstart',function(){
		change_atag();
		del_ad();
	});
});
