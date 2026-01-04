// ==UserScript==
// @name				dm5/dmzj/manhuagui/copymanga/tongli/colamanga - navigate with keyboard
// @name:zh-TW			動漫屋/動漫之家/漫畫櫃/拷貝漫畫/東立電子書城/colamanga 鍵盤導覽
// @name:zh-CN			动漫屋/动漫之家/漫画柜/拷贝漫画/东立电子书城/colamanga 键盘导览
// @description			[a / ←]prev page, [d / →]next page, [w / ↑]next chapter, [s / ↓]prev chapter, [q]newer comments, [e]older comments, [r]load all comments new-to-old on dm5, [t]load all comments old-to-new on dm5, [esc]stop loading more comments on dm5, [v]picture size switch between one-page/actual
// @description:zh-TW	[a / ←]前一頁，[d / →]下一頁，[w / ↑]新一章，[s / ↓]舊一章，[q]新一頁留言，[e]舊一頁留言，[r]dm5載入全部留言_新到舊，[t]dm5載入全部留言_舊到新，[esc]中斷載入更多留言，[v]圖片尺寸切換 整頁/實際
// @description:zh-CN	[a / ←]前一页，[d / →]下一页，[w / ↑]新一章，[s / ↓]旧一章，[q]新一页留言，[e]旧一页留言，[r]dm5载入全部留言_新到旧，[t]dm5载入全部留言_旧到新，[esc]中断载入更多留言，[v]图片尺寸切换 整页/实际
// @author				Evan Tseng
// @namespace			https://greasyfork.org/zh-TW/users/393133-evan-tseng
// @version				1.0.33
// @match				*://*.dm5.com/*
// @match				*://*.dm5.cn/*
// @match				*://*.dmzj.com/*
// @match				*://*.idmzj.com/*
// @match				*://*.mhgui.com/*
// @match				*://*.manhuagui.com/*
// @match				*://*.copymanga.com/*
// @match				*://*.copymanga.info/*
// @match				*://*.copymanga.net/*
// @match				*://*.copymanga.org/*
// @match				*://*.copymanga.site/*
// @match				*://*.copymanga.tv/*
// @match				*://*.mangacopy.com/*
// @match				*://*.colamanhua.com/*
// @match				*://*.colamanga.com/*
// @match				*://ebook.tongli.com.tw/*
// @run-at				document-start
// @grant				GM.setValue
// @grant				GM.getValue
// @license				MIT
// @downloadURL https://update.greasyfork.org/scripts/395461/dm5dmzjmanhuaguicopymangatonglicolamanga%20-%20navigate%20with%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/395461/dm5dmzjmanhuaguicopymangatonglicolamanga%20-%20navigate%20with%20keyboard.meta.js
// ==/UserScript==

(async function() {
	'use strict';
	var mySetting;
	if((mySetting=await GM.getValue("setting", false)) == false){
		mySetting={
			"dm5": { "loadAllComments": "none" },
			"colamanga": { readed: [] }
		};
		await GM.setValue("setting", mySetting);
	}

	let theHost=window.location.hostname.replace(/(?:[^\.]+\.)*(colamanhua|colamanga|copymanga|dm5|dmzj|idmzj|manhuagui|mhgui|mangacopy|tongli)(?:\.(?:cn|com|info|net|org|site|tv|tw))+$/, "$1");
	switch(theHost) {
		case "dm5":
			//	dm5 讀取留言・改
			var loadCmts=null;
			var getAllPost2=async function(pageindex, pagesize, tid, type, rev=false, first=false) {
				var cid=0;
				if (typeof (DM5_CID) !="undefined") {
					cid=DM5_CID;
				}
				$.ajax({
					url: 'pagerdata.ashx?d=' + new Date().getTime(),
					data: { pageindex: pageindex, pagesize: pagesize, tid: tid, mid:tid, cid: cid, t: type },
					error: function (msg) {
						//ShowDialog("服务器出现异常请重试");
					},
					success: function (json) {
						var objs=eval(json);
						var html="";
						for (var i=0; i < objs.length; i++) {
							var obj=rev ? objs[objs.length-1-i] : objs[i];
							html +="<li class=\"dashed\">";
							html +="<div class=\"cover\"><img src=\"";
							html +=obj.HeadUrl;
							html +="\"/></div>";
							html +="<div class=\"info\">";
							html +="<p class=\"title\">";
							html +=obj.Poster;
							if (obj.VipLevel > 0) {
								html +="<span class=\"vip\">VIP" + obj.VipLevel + "</span>";
								if (obj.VipType==  1) {
									html +="<span class=\"year\">年费</span>";
								}
							}
							html +="</p>";
							if (obj.ToPostShowDataItems) {
								var topostcount=obj.ToPostShowDataItems.length;
								for (var j=0; j < obj.ToPostShowDataItems.length; j++) {
									var topost=obj.ToPostShowDataItems[j];
									if (j==  0) {
										html +='<ul class="child-list">'
									}
									if (topostcount >=4) {
										if (j==  1) {
											html +='<li class="open"><a href="javascript:void(0);" class="openpostbtn" id="openpostbtn' + obj.ID + '" data="' + obj.ID + '">展开全部楼层</a></li>'
										}
										if (j==  0 || j==  (topostcount - 1)) {
											html +='<li>';
										}
										else {
											html +='<li class="litopost' + obj.ID + '" style="display:none;">';
										}
									}
									else {
										html +='<li>';
									}
									html +='<div class="cover"><img src="' + topost.HeadUrl + '"></div><div class="info">';
									html +='<p class="title">' + topost.Poster;
									if (topost.VipLevel > 0) {
										html +="<span class=\"vip\">VIP" + topost.VipLevel + "</span>";
										if (topost.VipType==  1) {
											html +="<span class=\"year\">年费</span>";
										}
									}
									html +='</p><p class="content">' + topost.PostContent + '</p>';
									html +='<p class="bottom">' + topost.PostTime + '<span class="right">';
									html +="<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + topost.Id + "\" ";
									html +=" class=\"zan";
									if (topost.IsPraise) {
										html +=" active";
									}
									html +=" zanbtn\">";
									if (topost.PraiseCount > 0) {
										html +=topost.PraiseCount;
									}
									else {
										html +="赞";
									}
									html +="</a>";
									html +="<a href=\"javascript:void(0)\"";
									html +=" data=\""
									html +=topost.Poster;
									html +=" \" pid=\"";
									html +=topost.Id;
									html +="\" class=\"";
									html +="comment recommentbtn";
									html +="\">";
									html +="评论";
									html +="</a></span></p>";
									if (j==  (obj.ToPostShowDataItems.length - 1)) {
										html +='</ul>'
									}
								}
							}
							html +="<p class=\"content\">";
							html +=obj.PostContent;
							html +="</p>";
							html +=" <p class=\"bottom\">";
							html +=obj.PostTime;
							html +="<span class=\"right\">";
							html +="<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + obj.Id + "\" ";
							html +=" class=\"zan";
							if (obj.IsPraise) {
								html +=" active";
							}
							html +=" zanbtn\">";
							if (obj.PraiseCount > 0) {
								html +=obj.PraiseCount;
							}
							else {
								html +="赞";
							}
							html +="</a>"
							html +="<a href=\"javascript:void(0)\"";
							html +=" data=\""
							html +=obj.Poster;
							html +=" \" pid=\"";
							html +=obj.Id;
							html +="\" class=\"";
							html +="comment recommentbtn";
							html +="\">";
							html +="评论";
							html +="</a></span></p>";
							html +="</div></li>";
						}
						first? $(".postlist").html(html): $(".postlist").html($(".postlist").html()+html);
						$(".postlist").find(".recommentbtn").click(function () {
							$('body').addClass('toolbar');
							reComment($(this).attr("pid"), $(this).attr("data"), $(this));
						});
						$(".postlist").find(".openpostbtn").click(function () {
							openpost($(this));
						});
						$(".postlist").find(".zanbtn").click(function () {
							praisepost($(this).attr("pid"), $(this));
						});
						if(rev) {
							if(pageindex>1)	loadCmts=setTimeout(function(){ getAllPost2(pageindex-1, pagesize, tid, type, rev); }, 600);
							else	loadCmts=null;
						}
						else {
							if(pageindex<pagesize)	loadCmts=setTimeout(function(){ getAllPost2(pageindex+1, pagesize, tid, type, rev); }, 600);
							else	loadCmts=null;
						}
					}
				});
			}

			var dm5AllComments=async function(direction){
				$('#last-mask, #last-win').hide();
				if(direction== "f") {
					if (typeof (DM5_PAGETYPE) !="undefined") {
						if (DM5_PAGETYPE==  9) {
							getAllPost2(DM5_PAGEPCOUNT>100?100:DM5_PAGEPCOUNT, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE, true, true);
						}
						else if (DM5_PAGETYPE==  4) {
							getAllPost2(DM5_PAGEPCOUNT>100?100:DM5_PAGEPCOUNT, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE, true, true);
						}
					}
				}
				else {
					if (typeof (DM5_PAGETYPE) !="undefined") {
						if (DM5_PAGETYPE==  9) {
							getAllPost2(1, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE, false, true);
						}
						else if (DM5_PAGETYPE==  4) {
							getAllPost2(1, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE, false, true);
						}
					}
				}
				$(".view-comment-main .top .page, .view-comment-main .bottom-page").hide()
			}

			document.addEventListener('readystatechange', (event)=> {
				if(document.readyState==  'complete') {
					let adutBtn=document.querySelector("#checkAdult");
					if(adutBtn)	adutBtn.click();
					if(document.querySelector(".view-comment-main .postlist")) {
						switch(mySetting.dm5.loadAllComments) {
							case "backward":
								dm5AllComments("b");
								break
							case "forward":
								dm5AllComments("f")
								break;
						}
					}
				}
			});

			document.addEventListener("keydown", async function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				var PrevC, NextC, PrevP, NextP,
					ppa=document.querySelectorAll(".view-paging>.container>a");
				PrevC=NextC=PrevP=NextP=null;
				for(let i in ppa) {
					switch(ppa[i].innerText) {
						case "上一章":	PrevC=ppa[i]; break;
						case "下一章":	NextC=ppa[i]; break;
						case "上一页":	PrevP=ppa[i]; break;
						case "下一页":	NextP=ppa[i]; break;
					}
				}

				var actP=document.querySelector("li.lidaykey.active a, .page-pagination ul li a.active");
				e=await (e || window.event);
				try {
					switch(await e.key.toLowerCase()) {
						case 'arrowup':
						case 'w': // 新一章
							if(NextC) NextC.click();
							break;
						case 'arrowdown':
						case 's': // 舊一章
							if(PrevC) PrevC.click();
							break;
						case 'arrowleft':
						case 'a': // 前一頁
							if(document.querySelector("#comicRead[show]")) return;
							$('#last-mask, #last-win').hide();
							if(PrevP) ShowPre();
							else if(actP) actP.parentNode.previousElementSibling.querySelector('a').click();
							else YingdmList.self.changepager(parseInt(actP.innerText)-1)
							break;
						case 'arrowright':
						case 'd': // 下一頁
							if(document.querySelector("#comicRead[show]")) return;
							$('#last-mask, #last-win').hide();
							if(NextP) ShowNext();
							else if(actP) actP.parentNode.nextElementSibling.querySelector('a').click();
							else YingdmList.self.changepager(parseInt(actP.innerText)+1)
							break;
						case 'e': // 載入舊一頁留言
							if(document.querySelector("#comicRead[show]")) return;
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							var NextE=document.querySelector(".view-comment-main .top .page span.current").nextElementSibling;
							if(NextE) NextE.click();
							$(".view-comment-main .top .page, .view-comment-main .bottom-page").show();
							mySetting.dm5.loadAllComments="none";
							await GM.setValue("setting", mySetting);
							break;
						case 'q': // 載入新一頁留言
							if(document.querySelector("#comicRead[show]")) return;
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							var PrevE=document.querySelector(".view-comment-main .top .page span.current").previousElementSibling;
							if(PrevE) PrevE.click();
							$(".view-comment-main .top .page, .view-comment-main .bottom-page").show();
							mySetting.dm5.loadAllComments="none";
							await GM.setValue("setting", mySetting);
							break;
						case 'v':
							if(document.querySelector("#comicRead[show]")) return;
							if(document.querySelector("#showimage, #barChapter"))	document.body.classList.toggle("actualSize");
							break;
						case 'r': // 載入全部留言，新→舊
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							if(document.querySelector(".view-comment-main .postlist")) dm5AllComments("b");
							mySetting.dm5.loadAllComments="backward";
							await GM.setValue("setting", mySetting);
							break;
						case 't': // 載入全部留言，舊→新
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							if(document.querySelector(".view-comment-main .postlist")) dm5AllComments("f");
							mySetting.dm5.loadAllComments="forward";
							await GM.setValue("setting", mySetting);
							break;
						case 'escape': // 中斷載入更多留言
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							break;
					}
				} catch(err) { console.log(err); }
			});
			break;

			//============================================================================ =
		case "dmzj":
		case "idmzj":
			document.addEventListener("keydown", function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				var elm=document.querySelectorAll(".pages a[href]"),
					PrevC=null, NextC=null, PrevP=null, NextP=null;
				for(let i in elm) {
					switch(elm[i].innerText) {
						case "上一章节": PrevC=elm[i]; break;
						case "下一章节": NextC=elm[i]; break;
						case "上一页":	PrevP=elm[i]; break;
						case "下一页":	NextP=elm[i]; break;
					}
				}

				e=e || window.event;
				try {
					switch(e.key.toLowerCase()) {
						case 'arrowup':
						case 'w':
							document.querySelector(".btmBtnBox>a.btm_chapter_btn.fr").click();
							break;
						case 'arrowdown':
						case 's':
							document.querySelector(".btmBtnBox>a.btm_chapter_btn.fl").click();
							break;
						case 'arrowleft':
						case 'a':
							if(elm) PrevP.click();
							else if(elm=document.querySelector(".comment_con_tab a.prev")) elm.click()
							else prev_img();
							break;
						case 'arrowright':
						case 'd':
							if(document.querySelector("#comicRead[show]")) return;
							if(elm) NextP.click();
							else if(elm=document.querySelector(".comment_con_tab a.next")) elm.click()
							else next_img();
							break;
						case 'v':
							if(document.querySelector("#comicRead[show]")) return;
							if(document.querySelector(".inner_img"))	document.body.classList.toggle("actualSize");
							break;
					}
				} catch(err) { console.log(err); }
			});
			break;

			//============================================================================ =
		case "mhgui":
		case "manhuagui":
			document.addEventListener('readystatechange', (event)=> {
				if(document.readyState==  'complete') {
					let adutBtn=document.querySelector("#checkAdult");
					if(adutBtn)	adutBtn.click();
				}
			});
			document.addEventListener("keydown", function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				e=e || window.event;
				var curr=document.querySelector(".pager .current, .page .cu, div.flickr span.current");
				var comicPage=document.querySelector('#mangaBox');
				var comicPageScroll=document.querySelector('#mangaMoreBox');
				try {
					$("#pb, #pb-mask").remove();
					switch(e.key.toLowerCase()) {
						case 'arrowup':
						case 'w':
							document.querySelector(".main-btn>a.nextC").click();
							break;
						case 'arrowdown':
						case 's':
							document.querySelector(".main-btn>a.prevC").click();
							break;
						case 'arrowleft':
							if(comicPage) break;
						case 'a':
							if(document.querySelector("#comicRead[show]")) return;
							if(curr && !comicPageScroll) curr.previousElementSibling.click();
							break;
						case 'arrowright':
							if(comicPage) break;
						case 'd':
							if(document.querySelector("#comicRead[show]")) return;
							if(curr && !comicPageScroll) curr.nextElementSibling.click();
							break;
						case 'v':
							if(document.querySelector("#mangaBox"))	document.body.classList.toggle("actualSize");
							break;
					}
				} catch(err){ console.log(err); }
			});
			break;

			//============================================================================ =
		case "copymanga":
		case "mangacopy":
			document.addEventListener("keydown", function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				var elm=null;
				e=e || window.event;
				try {
					switch(e.key.toLowerCase()) {
						case 'arrowup':
						case 'w':
							elm=document.querySelector(".footer .comicContent-next a:not(.prev-null)");
							break;
						case 'arrowdown':
						case 's':
							elm=document.querySelector(".footer .comicContent-prev:not(.index):not(.list) a:not(.prev-null)");
							break;
						case 'arrowleft':
						case 'a':
							if(document.querySelector("#comicRead[show]")) return;
							elm=document.querySelector(".el-pagination li.active");
							if(elm) elm=elm.previousElementSibling;
							else if(elm=document.querySelector(".tab-content>.active .page-all li.prev>a")) ;
							else elm=document.querySelector(".page-all li.prev>a");
							break;
						case 'arrowright':
						case 'd':
							if(document.querySelector("#comicRead[show]")) return;
							elm=document.querySelector(".el-pagination li.active");
							if(elm) elm=elm.nextElementSibling;
							else if(elm=document.querySelector(".tab-content>.active .page-all li.next>a")) ;
							else elm=document.querySelector(".page-all li.next>a");
							break;
						case 'v':
							if(document.querySelector(".comicContent-list"))	document.body.classList.toggle("actualSize");
							break;
					}
					if(elm) elm.click();
				} catch(err) { console.log(err); }
			});
			break;

			//============================================================================ =
		case "tongli":
			document.addEventListener("keydown", function(e) {
				if((e.shiftKey | e.ctrlKey | e.altKey | e.metaKey) || document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus")) return;
				var elm=document.querySelector("#endBoard .btnClose a");
				if(elm){
					switch(e.key.toLowerCase()) {
						case 'arrowup':
						case 'arrowdown':
						case 'arrowright':
						case 'w':
						case 'a':
						case 's':
							elm.click();
					}}
				try{
					switch(e.key.toLowerCase()) {
						case 'arrowup':
						case 'w':
							document.querySelector("#gallery-controls .nextChapter").click();
							break;
						case 'arrowdown':
						case 's':
							document.querySelector("#gallery-controls .prevChapter, .breadcrumbs>a:nth-last-of-type(2)").click();
							break;
						case 'arrowleft':
							document.querySelector(".pagination .page-li.page-number.page-active").previousElementSibling.click();
							break;
						case 'arrowright':
							document.querySelector(".pagination .page-li.page-number.page-active").nextElementSibling.click();
							break;
						case 'a':
							if(elm=document.querySelector("#gallery .swiper-button-prev")) elm.click();
							else document.querySelector(".page-li.page-number.page-active").previousElementSibling.click();
							break;
						case 'd':
							if(elm=document.querySelector("#gallery .swiper-button-next")) elm.click();
							else document.querySelector(".page-li.page-number.page-active").nextElementSibling.click();
							break;
					}
				} catch(err){ console.log(err); }
			});

			document.addEventListener("click", function(evt){
				var rBtnGrp=document.querySelector(".book_content .bookinfo_rightbox2"),
					rBtn=document.querySelector(".book_content .bookinfo_rightbox2 a[href]");
				const watchOptGrp={ childList: true },
					  watchOptBtn={ attributes: true, attributeFilter: ["href"] };
				if ( evt.target.matches(".episode_wrap .episode_icon") ){
					if(rBtn) {
						var observer1=new MutationObserver(function(){
							rBtn.click();
							observer1.disconnect();
						});
						observer1.observe(rBtn, watchOptBtn);
						setTimeout(function(){observer1.disconnect();}, 1300);
					}
					else {
						var observer2=new MutationObserver(
							function(){
								rBtnGrp.querySelector("a[href]").click();
								observer2.disconnect();
							}
						);
						observer2.observe(rBtnGrp, watchOptGrp);
					}
				}
			});
			break;

			//============================================================================ =
		case "colamanhua":
		case "colamanga":
			document.addEventListener("keydown", async function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				e=e || window.event;
				try{
					var elm=null;
					switch(e.key.toLowerCase()) {
						case 'arrowup':
						case 'w':
							document.querySelector(".mh_headpager a.read_page_link:last-of-type").click();
							break;
						case 'arrowdown':
						case 's':
							document.querySelector(".mh_headpager a.read_page_link:first-of-type").click();
							break;
						case 'arrowleft':
						case 'a':
							if(document.querySelector("#comicRead[style='']")) return;
							elm=document.querySelector('.fed-page-info a.fed-btns-info.fed-btns-green').previousElementSibling
							if(elm.classList.contains("fed-btns-disad")) break;
							elm.click();
							break;
						case 'arrowright':
						case 'd':
							if(document.querySelector("#comicRead[style='']")) return;
							elm=document.querySelector('.fed-page-info a.fed-btns-info.fed-btns-green').nextElementSibling;
							if(elm.classList.contains("fed-btns-disad")) break;
							elm.click();
							break;
					}
				} catch(err){ console.log(err); }
			});

			var sortList = function(){
				// 對「我的收藏」依照更新日期排序
				var rowSort=function(theList){
					if(theList.length <=1) return theList;
					else {
						var list1=[], list2=[], list3=[], p=theList[0];
						for(let i=1; i<theList.length; i++){
							if(theList[i].date > p.date) list1.push(theList[i]);
							else	list2.push(theList[i]);
						}
						list1=rowSort(list1);
						list2=rowSort(list2);
						for(let i=0; i<list1.length; i++)	list3.push(list1[i]);
						list3.push(p);
						for(let i=0; i<list2.length; i++)	list3.push(list2[i]);
						return list3;
					}
				}
				setTimeout(function(){
					var today=new Date(),
						url=window.location.href,
						feedList=document.querySelector(".fed-user-info .fed-user-list");
					if(url.includes("/dynamic/user/subscription") && feedList){
						let subscribeCSS=document.createElement("style");
						document.body.appendChild(subscribeCSS)
						subscribeCSS.innerText=`
.update_noti {
	color:#000;
	background:#ffeac0;
	padding:.15em .3em;
	margin-left:.5em;
	border-radius:4pt;
	box-shadow:inset 0 0 0 1px #321;
}
`;
						let feedList2=[];
						try{
							document.querySelectorAll(".fed-user-list .fed-part-rows.fed-line-top").forEach(function(elm, idx){
								let elmDate=elm.querySelector(".fed-visible>span:nth-of-type(4)"),
									theDate=elmDate.innerText;
								feedList2.push({date:theDate, element: elm});
								let theUpdate=new Date(theDate);
								let days=Math.round((today-theUpdate)/86400000-0.33);
								if(days<=5) elmDate.innerHTML+=("<span class='update_noti' style='opacity:" + (1-Math.round(15*days)/100) + "'>更新</span>");
							});
						} catch(err){ console.log(err); }
						let sortedList=rowSort(feedList2);
						for(let i=0; i<sortedList.length; i++) feedList.appendChild(sortedList[i].element);
					}
				},100);
			}
			window.addEventListener("load",sortList);
			break;
	}
})();
