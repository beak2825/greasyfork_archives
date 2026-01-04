// ==UserScript==
// @name         pixiv_changpb 2.0
// @namespace    http://tampermonkey.net/
// @version      2025.01.07
// @description  修改成iframe下载，试试是否可行
// @author       You
// @include        https://www.pixiv.net/*
// @include			https://i.pximg.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouo.io
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @require		https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://update.greasyfork.org/scripts/488188/1335058/Lasy_load_img_Library.js
// @require https://update.greasyfork.org/scripts/518420/1488747/MaxShowBox.js
// @require https://update.greasyfork.org/scripts/480132/1349340/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/515674/1500240/MyDownloader.js
// @require https://update.greasyfork.org/scripts/486938/1325051/download_by_atag.js
// @require https://update.greasyfork.org/scripts/522187/1511410/Kquery.js
// @downloadURL https://update.greasyfork.org/scripts/488552/pixiv_changpb%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/488552/pixiv_changpb%2020.meta.js
// ==/UserScript==


$(function(){
	window.MaxShowBox.StopAutoRun();
	let home = new Home();
	if(home.Is_homePath()){
		console.log('home');
		let bu = home.Add_bu();
		let once = false;
		bu.click(function(){
			if(!once){
				home.Change_pb();
				once = true;
			}
			home.Get_bigImg();
			home.Change_next_bu();
		});
		$('body').on('touchstart',()=>{bu.click();})
		let lockbu = Add_lockLoad_bu();
	}
	
	let list = new List();
	if(list.Is_listPath()){
		console.log('list');
		let bu = list.Add_bu();
		bu.click(function(){
			list.Get_img();
			list.Build_Hide_and_Show_Card();
			list.Change_next_bu();
		});
		$('body').on('touchstart',()=>{bu.click();})
		let lockbu = Add_lockLoad_bu();
		list.Change_pb();
	}
	if(list.Is_bigPath()){
		list.iframe_auto_download_img();
	}
	let following = new Following();
	if(following.Is_followingPath()){
		console.log('following');
		$('body').on('touchstart',following.Change_atag)
	}
})
class Home{
	Is_homePath(){
		if(window.location.href.match(/tags.+artworks/g)){return true;}
		return false;
	}
	
	Add_bu(){
		let bu = $('<button>GetBiger</button>').css({width:'100%','font-size':'10vw'});
		return bu;
	}
	Change_pb(){
		//https://i.pximg.net/c/600x1200_90_webp/img-master/img/2024/04/19/21/23/51/117979360_p0_master1200.jpg
		//https://i.pximg.net/c/360x360_10_webp/img-master/img/2024/04/19/21/23/51/117979360_p0_square1200.jpg
		let tag = "";
		let object = {};
		
		tag = ".list-item.column-3"
		object = {'width':'100% !important'}
		window.GAIL.add_css(tag,object)
	}
	
	constructor(){this.list = new List();}
	Get_bigImg(){
		$('div.list-item.column-3').attr('class','list-item column-2');
		this.list.Get_img();
		this.list.Build_Hide_and_Show_Card();
		return;
		let img = $('img[src*="360x360"]');
		if(img.length==0){return;}
		img.each(function(){
			let newsrc = this.src.replace('360x360_10','600x1200_90').replace('square','master');
			this.src = newsrc;
			let link = $(this).parents('a.thumbnail-link[href]:first').attr('href');
			$(this).parents('.list-item.column-3:first').append($(this));
			$(this).css('width','100%');
			$(this).prev().css('height','0px')
			$(this).click(function(){
				window.open(link)
			});
		});
	}
	Change_next_bu(){
		$('a.router-link-active:not([ccc])').click(function(){
			setTimeout(function() {location.reload()}, 300);
		})
	}
}
class List{
	Is_listPath(){
		if(window.location.href.match(/users\/\d+$/g)){window.location.href = window.location.href+"/artworks"}
		if(window.location.href.match(/users.+artworks/g)){return true;}
		return false;
	}
	Is_bigPath(){
		if(window.location.href.match(/artworks\/\d+#big/g)){return true;}
		return false;
	}
	Add_bu(){
		let bu = $('<button>ChangPb</button>');
		return bu;
	}
	Get_img(){

		let myself = this;
		$('img[src*="i.pximg.net"]:not([ccc])').each(function(){
			$(this).attr('ccc','yes')
			var src = $(this).attr('src').replace(/net.+img(?=\/)/g,'net/img-master/img').replace(/[a-z]+1200/g,'master1200')
			let card = myself.img_card(src);
			$(this).parents('.list-item.column-2:first').after(card);
			window.MaxShowBox.Add_bu(card.eq(0));
			$(this).parents('.list-item.column-2:first').next('img').css('outline','none')
			//检测动图
			if($(this).parents('.list-item.column-2:first').find('.square-thumbnail-container .center-slot .ugoira-play-icon').attr('class')){
				$(this).parents('.list-item.column-2:first').next('img').css('outline','2vw blue solid').off('click').click(function(){
					var gif = ('/ajax/illust/#id#/ugoira_meta').replace('#id#',src.toString().match(/\d+(?=_[^\\]+$)/g)[0])
					$.ajax(gif,{
						method: 'GET',
						success: function (json) {
							if (json.error == true) {
								return;
							}
							// 因为浏览器会拦截不同域的 open 操作，绕一下
							let newWindow = window.open('_blank');
							newWindow.location = json.body.originalSrc;
						}
					})
				})
			}
			//$(this).parents('.list-item.column-2:first').hide()
		})
	}
	Build_Hide_and_Show_Card(){
        let myself = this;
		$('span[data-v-5e6e10b7]:not([ccc])').each(function(){
			if($(this).text()==''){return true}
			$(this).attr('ccc','yes')
			console.log(Number($(this).text()))
			if(Number($(this).text())>1){
				var src = $(this).parents('.list-item.column-2:first').next().attr('my_src')
                console.log(src);

				var box = $('<div style="width: 100%;background-color: #ff89b6;"></div>').click(function(){
						var top = $(this).prevAll('img:first')[0];
						$(this).hide()
						top.scrollIntoView();
					})
				let insert = $(this).parents('.list-item.column-2:first').nextAll('.list-item.column-2:first');
				insert.before(box);
				if(insert.length==0){$(this).parents('.list-item.column-2:first').nextAll('button:last').after(box);}
				for(var i=1;i<Number($(this).text());i++){
					let card = myself.img_card(src.replace(/p\d+/g,'p'+i))
					box.append(card)
					window.MaxShowBox.Add_bu(card.eq(0));
				}
				box.before($('<button>收起</button>')
					.css({
						width:'50%',
						height:'10vw',
						'font-size':'5vw',
						'background':'#ff89b6',
						'border':'none',
						'color':'white',
						'display':'inline-block',
					})
					.click(function(event){
						if(box.css('display')!='none'){
							box.hide()
						}else{
							box.show()
						}
					})
				)
				box.before($('<button>收起全部</button>')
					.css({
						width:'50%',
						height:'10vw',
						'font-size':'5vw',
						'background':'#ff89b6',
						'border':'none',
						'color':'white',
						'display':'inline-block',
					})
					.click(function(event){
						if(box.css('display')!='none'){
							$('button:contains("收起全部")+div').hide()
						}else{
							$('button:contains("收起全部")+div').show()
						}
					})
				)
			}
		})
	}
	img_card(src){
			var myself = this
			const card_img = $('<img class="lasyload">').attr('my_src',src)
					.css({
						'width':'80vw',
						'height':'auto',
						'margin':'10vw 10% 0px 10%',
						'border-radius':'5vw',
						'min-height':'50vw',
						'min-width':'80vw',
						'background-color':'white',
						'outline': '2vw #ff89b6 solid',
						// 'display':'none',
					})
					.on('touchstart',function(){myself.Lasy_Load(this);})
					.click(function(event){
						event.stopPropagation()
						$(this).after($('<p style="display: flex;align-items: center;justify-content: center;">loading...</p>'))
						var img = this
						var newimg = new Image
						function changesrc(){
							$(img).attr('src',newimg.src).css({
								'width':'100vw',
								'height':'auto',
								'margin':'10vw 0px 0px 0px',
								'border-radius':'0px',
							}).off('click').click(function(event){
								event.stopPropagation()
								document.title = '【comic】'+document.title.replace('【comic】','')
								var src = this.src
								var names = document.title+new Date().getTime()+this.src.match(/\.[a-z]+$/g)[0]
								let DT = new Donwload_test();
								DT.Start(src,names);
								
								// GM_download({
								// 	url:src,
								// 	name:names,
								// 	onload:function(){
								// 		console.log('success')
								// 	},
								// 	error:function(){
								// 		console.log('下载错误：'+src)
								// 	}
								// })
							}).next('p').remove()
						}
						newimg.onload = function(){
							changesrc()
						}
						newimg.onerror = function(){
							newimg.src = newimg.src.replace('.jpg','.png')
							changesrc()
						}
						newimg.src = $(this).attr('src').replace('img-master','img-original').replace('_master1200','')
						
					})
				const card = card_img.add($('<button>详情</button><button>原图</button>').css({
						'width':'50%',
						'height':'20vw',
						'background-color':'rgb(218 218 218)',
						'border':'none',
					})
					.each(function(){
						if($(this).text()=="详情"){
							$(this).click(function(){
								event.stopPropagation();
								var href = $(this).prevAll('.list-item.column-2:first').find('a[href*="artworks"]').attr('href')
								if(!href){
									href = $(this).parent().prevAll('.list-item.column-2:first').find('a[href*="artworks"]').attr('href')
								}
								window.open(href)
							})
						}
						if($(this).text()=="原图"){
							$(this).click(function(event){
								event.stopPropagation();
								if(card_img.attr('src').indexOf('img-original')<0){return;}
								var href = $(this).prevAll('.list-item.column-2:first').find('a[href*="artworks"]').attr('href')
								if(!href){
									href = $(this).parent().prevAll('.list-item.column-2:first').find('a[href*="artworks"]').attr('href')
								}
								let num = card_img.attr('src').match(/(?<=_p)\d+(?=\.)/g)[0];
								href+="#big_"+num;
								//if(ConsoleWrite){ConsoleWrite(imglink)};
								myself.Add_iframe(href,card_img);
								//GM_setValue('pixiv_img',document.title.match(/^.{0,50}/g))
								//window.open($(this).prevAll('img:first').attr('src').replace('img-master','img-original').replace('_master1200',''))
							})
						}
					}))
				return card;
		}
		Add_iframe(url,card_img){
			if(My_iframe){
				const mi = new My_iframe();
				GM_setValue("pixiv-iframe-open","yes");
				mi.Add_iframe(url)
					.then(iframe=>{
						iframe.width = $(window).width();
						iframe.height = $(window).height();
						$(iframe).css({
							'position':'fixed',
							'top':'0',
							'z-index':99999
						})
						const bu = $('<div class="iframe-close-bu"></div>');
						bu.click(function(){iframe.remove();bu.remove();GM_deleteValue("pixiv-iframe-open")})
						$('body').append(bu);
					})
			}
		}
		iframe_auto_download_img(){
			if(!GM_getValue("pixiv-iframe-open")){return;}
			//alert('iframe');
			const getimg = ()=>$('.status:contains("%")');
			WaitingElement(getimg)
				.then(tag=>{
					document.title = '【comic】'+document.title.replace('【comic】','');
					var src = $('.zoomable-area img')[0].src;
					var names = document.title+new Date().getTime()+src.match(/\.[a-z]+$/g)[0];
					console.log(src,names);
					GM_download(src,name);
				})
		}
		Lasy_Load(img){
			if(islock){return;}
			let imgs = $('img.lasyload');
			if(imgs.length==0){return;}
			if(!img){return;}
			let index = imgs.index(img);
			if(index<0){return;}
			
			let next = imgs.slice(index,Math.min(index+6,imgs.length+1));
			next.each(function(){
				if(this.src){return true;}
				this.src = $(this).attr('my_src');
			})
		}
		down_original_img(){
			if(window.location.href.indexOf('img-original')<0 || GM_getValue('pixiv_img')==undefined){return}
			document.title = GM_getValue('pixiv_img')
			$('<a></a>').attr({
				'href':$('img').attr('src'),
				'download':document.title+$('img').attr('src').match(/[^\/]+$/g)[0],
			})[0].click()
		}
		Change_next_bu(){
			$('.pager:last:has(a.next):not([ccc])').each(function(){
				if($(this).find('.next').attr('class')==undefined || $('button:contains("下一页")').text()!=''){return}
				$(this).find('a:not(a.next)').attr('ccc','yes').click(function(){
					location.reload()
				})
				$(this).attr('ccc','yes').parent().after($('<button>下一页</button>').css({
					width:'100%',
					height:'20vw',
					'font-size':'10vw',
					'background-color':'#6b7fff',
					'border':'none',
					'color':'white'
				}).click(function(){
					$('.list-item.column-2:first').parent().children('*:not(.list-item)').remove()
					$('.pager:last:has(a.next) .next')[0].click()
					setTimeout(function() {window.location.reload()}, 300);
				}))
				$('button:contains("下一页")').next().hide()
			})
		}
		Change_pb(){
			const maxshowbox_css = `
				<style>
				img+div {
					display: block !important;
					position: relative !important;
					height: 10vmin;
					line-height: 100%;
					text-align: center;
				}
				.iframe-close-bu{
					width:100%;
					height:70px;
					position:fixed;
					bottom:0;
					z-index:99999999;
					background:rgba(0,0,0,.5)
				}
				</style>
			`
			$('body').append(maxshowbox_css)
		}
}

class Following{
	Is_followingPath(){
		if(window.location.href.match(/users.+following/g)){return true;}
		return false;
	}
	Change_atag(){
		$('a:not([ccc]):not([target])[href*="users"]').filter(function(){return this.href.indexOf('following')<0;}).attr('target','_blank');
	}
}

let islock = false;
function Add_lockLoad_bu(){
	let bu = $('<button>O</button>')
				.css({
					position:'fixed',
					width:'12vw',
					height:'12vw',
					'border-radius':'100%',
					'background':'#bebebe',
					'color':'white',
					bottom:'50vh',
					'font-size':'8vw',
					'border':'none',
				})
				.click(function(){
					if(!islock){
						$(this).css('background','red').text('L');
						islock = true;
					}else{
						$(this).css('background','#bebebe').text('O');
						islock = false;
					}
				})
	$('body').append(bu);
	return bu;
}
window.MaxShowBox.Add_bu = (img)=>{
	const ms = window.MaxShowBox;
	const bu = $('<div>B</div>').css({
					'position': 'absolute',
					'bottom': '0px',
					'color': 'white',
					'font-size': '10vw',
					'background': '#0000005e'
			})
	if(img){
		img.after(bu);
		bu.click(function(event){
			event.stopPropagation();
			ms.Add_Img(img);
			ms.ScrollToCenter($('.max-show-box'));
		});
	}
	return bu;
}
window.MaxShowBox.ScrollToCenter = (item)=>{
		const sh = item[0].scrollHeight;
		const ch = item[0].clientHeight;
		const y = (sh-ch)/2;
		const sw = item[0].scrollWidth;
		const cw = item[0].clientWidth;
		const x = (sw-cw)/2;
		item[0].scrollTop = y;
		item[0].scrollLeft = x;
}
function Donwload_test(){
	this.Start = async (src,name)=>{
		if(!src || !name){return false;}
		let success = false;
		await Try_GMX(src,name).then(s=>success = s);
		if(success){ConsoleWrite("success:GMX is done");return true;}else{ConsoleWrite("error:GMX is error")}
		await Try_GM(src,name).then(s=>success = s);
		if(success){ConsoleWrite("success:GM_download is done");return true;}else{ConsoleWrite("error:GM_download is error")}
		Try_atag(src,name);
	}
	
	function Try_GM(src,name){
		return new Promise(resolve=>{
			if(!GM_download){resolve(false);}
			let success = false;
			GM_download({
				url:src,
				name:name,
				onload:function(){
					success = true;
					resolve(true);
				},
				onerror:function(){
					resolve(false);
				}
			})
			setTimeout(()=>{
				if(success){
					resolve(true);
				}else{
					resolve(false);
				}
			},5000);
		})
	}
	this.Try_GM = Try_GM;
	
	function Try_atag(src,name){
		if(!window.DBA){return false;}
		window.DBA.SetDownload(src,name);
	}
	this.Try_atag = Try_atag;
	
	function Try_GMX(src,name){
		return new Promise(resolve=>{
			if(!src || !name){resolve(false);}
			var GM__xmlHttpRequest;
			if ("undefined" != typeof (GM_xmlhttpRequest)) {
			    GM__xmlHttpRequest = GM_xmlhttpRequest;
			} else {
			    GM__xmlHttpRequest = GM.xmlHttpRequest;
			}
			let success = false;
			GM__xmlHttpRequest({
				method: 'GET',
				url: src,
				anonymous: true,
				responseType: 'arraybuffer',  // 使用 arraybuffer 获取二进制数据
				onload: function(response) {
					if (response.status === 200) {
						// 将响应数据转换为 Blob
						const blob = new Blob([response.response], { type: 'image/png' });
						
						// 使用 URL.createObjectURL 创建一个临时 URL
						const url = URL.createObjectURL(blob);
						
						// 创建一个下载链接并触发下载
						const a = document.createElement('a');
						a.href = url;
						a.download = name; // 下载的文件名
						a.click();
						success = true;
						// 清理临时 URL
						URL.revokeObjectURL(url);
						resolve(true);
					} else {
						ConsoleWrite('Failed to load image: ' + response.status);
						resolve(false);
						success = false;
					}
				},
				onerror: function(error) {
					ConsoleWrite('Request failed:');
					resolve(false);
				}
			});
			setTimeout(()=>{
				if(success){
					resolve(true);
				}else{
					resolve(false);
				}
			},5000);
		})
	}
	
	function ConsoleWrite(mess){
		let div = $(".console");
		if(div.length==0){
			div = `
				<div class="console"></div>
				<style>
					.console{
						position:fixed;
						width:100%;
						background:black;
						color:white;
						bottom:0;
					}
				</style>
			`
			$('body').append(div);
			div = $(".console");
			div.on('touchstart',function(){$(this).hide()});
		}
		div.text(mess)
	}
	this.ConsoleWrite = ConsoleWrite;
}
if(window.DBA){
	window.DBA.ListeningDownload = ()=>{
		if(GM_getValue('src')==window.location.href){
				let a = $('<a></a>')
				        .attr('href',window.location.href)
						.attr('download',GM_getValue('name'))
				a[0].click()
				GM_deleteValue('name')
				GM_deleteValue('src')
			}
	}
	window.DBA.ListeningDownload();
}

