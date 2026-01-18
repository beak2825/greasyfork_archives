// ==UserScript==
// @name				漫畫 鍵盤導覽(L改)
// @description	[a / ←]前一頁，[d / →]下一頁，[e /↓ ]新一章，[q/↑ ]舊一章，[r]新一頁留言，[t]舊一頁留言，[esc]中斷載入更多留言，[v]圖片尺寸切換 整頁/實際
// @author				Evan Tseng
// @version				1.2
// @match				*://*.dm5.com/*
// @match				*://*.dm5.cn/*
// @match				*://*.dmzj.com/*
// @match				*://*.mhgui.com/*
// @match				*://*.manhuagui.com/*
// @match				*://*.mangacopy.com/*
// @match				*://*.2025copy.com/*
// @run-at				document-idle
// @grant				GM.setValue
// @grant				GM.getValue
// @license				MIT
// @namespace https://greasyfork.org/zh-TW/scripts/440324
// @icon           https://css122us.cdnmanhua.net/v202303131713/dm5/images/dm5.ico
// @downloadURL https://update.greasyfork.org/scripts/440324/%E6%BC%AB%E7%95%AB%20%E9%8D%B5%E7%9B%A4%E5%B0%8E%E8%A6%BD%28L%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440324/%E6%BC%AB%E7%95%AB%20%E9%8D%B5%E7%9B%A4%E5%B0%8E%E8%A6%BD%28L%E6%94%B9%29.meta.js
// ==/UserScript==
//動漫屋/動漫之家/漫畫櫃/拷貝漫畫 鍵盤導覽dm5/dmzj/manhuagui - navigate with keyboard
//https://greasyfork.org/zh-TW/scripts/395461
(async function() {
	'use strict';
	var mySetting;
	if((mySetting = await GM.getValue("setting", false)) == false){
		mySetting = { "dm5": { "loadAllComments": "none" } };
		await GM.setValue("setting", mySetting);
	}

	let theHost = window.location.hostname.replace(/(?:[^\.]+\.)*(dm5|dmzj|manhuagui|mhgui|mangacopy|2025copy)\.(?:cn|com|info|net|org|site|tv)/, "$1");

	switch(theHost) {
		case "dm5":
			//	dm5 讀取留言・改
			var loadCmts=null;
			var getAllPost2 = async function(pageindex, pagesize, tid, type, rev=false, first=false) {
				var cid = 0;
				if (typeof (DM5_CID) != "undefined") {
					cid = DM5_CID;
				}
				$.ajax({
					url: 'pagerdata.ashx?d=' + new Date().getTime(),
					data: { pageindex: pageindex, pagesize: pagesize, tid: tid, mid:tid, cid: cid, t: type },
					error: function (msg) {
						//ShowDialog("服务器出现异常请重试");
					},
					success: function (json) {
						var objs = eval(json);
						var html = "";
						for (var i = 0; i < objs.length; i++) {
							var obj = rev ? objs[objs.length-1-i] : objs[i];
							html += "<li class=\"dashed\">";
							html += "<div class=\"cover\"><img src=\"";
							html += obj.HeadUrl;
							html += "\"/></div>";
							html += "<div class=\"info\">";
							html += "<p class=\"title\">";
							html += obj.Poster;
							if (obj.VipLevel > 0) {
								html += "<span class=\"vip\">VIP" + obj.VipLevel + "</span>";
								if (obj.VipType == 1) {
									html += "<span class=\"year\">年费</span>";
								}
							}
							html += "</p>";
							if (obj.ToPostShowDataItems) {
								var topostcount = obj.ToPostShowDataItems.length;
								for (var j = 0; j < obj.ToPostShowDataItems.length; j++) {
									var topost = obj.ToPostShowDataItems[j];
									if (j == 0) {
										html += '<ul class="child-list">'
									}
									if (topostcount >= 4) {
										if (j == 1) {
											html += '<li class="open"><a href="javascript:void(0);" class="openpostbtn" id="openpostbtn' + obj.ID + '" data="' + obj.ID + '">展开全部楼层</a></li>'
										}
										if (j == 0 || j == (topostcount - 1)) {
											html += '<li>';
										}
										else {
											html += '<li class="litopost' + obj.ID + '" style="display:none;">';
										}
									}
									else {
										html += '<li>';
									}
									html += '<div class="cover"><img src="' + topost.HeadUrl + '"></div><div class="info">';
									html += '<p class="title">' + topost.Poster;
									if (topost.VipLevel > 0) {
										html += "<span class=\"vip\">VIP" + topost.VipLevel + "</span>";
										if (topost.VipType == 1) {
											html += "<span class=\"year\">年费</span>";
										}
									}
									html += '</p><p class="content">' + topost.PostContent + '</p>';
									html += '<p class="bottom">' + topost.PostTime + '<span class="right">';
									html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + topost.Id + "\" ";
									html += " class=\"zan";
									if (topost.IsPraise) {
										html += " active";
									}
									html += " zanbtn\">";
									if (topost.PraiseCount > 0) {
										html += topost.PraiseCount;
									}
									else {
										html += "赞";
									}
									html += "</a>";
									html += "<a href=\"javascript:void(0)\"";
									html += " data=\""
									html += topost.Poster;
									html += " \" pid=\"";
									html += topost.Id;
									html += "\" class=\"";
									html += "comment recommentbtn";
									html += "\">";
									html += "评论";
									html += "</a></span></p>";
									if (j == (obj.ToPostShowDataItems.length - 1)) {
										html += '</ul>'
									}
								}
							}
							html += "<p class=\"content\">";
							html += obj.PostContent;
							html += "</p>";
							html += " <p class=\"bottom\">";
							html += obj.PostTime;
							html += "<span class=\"right\">";
							html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + obj.Id + "\" ";
							html += " class=\"zan";
							if (obj.IsPraise) {
								html += " active";
							}
							html += " zanbtn\">";
							if (obj.PraiseCount > 0) {
								html += obj.PraiseCount;
							}
							else {
								html += "赞";
							}
							html += "</a>"
							html += "<a href=\"javascript:void(0)\"";
							html += " data=\""
							html += obj.Poster;
							html += " \" pid=\"";
							html += obj.Id;
							html += "\" class=\"";
							html += "comment recommentbtn";
							html += "\">";
							html += "评论";
							html += "</a></span></p>";
							html += "</div></li>";
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

			var dm5AllComments = async function(direction){
				$('#last-mask, #last-win').hide();
				if(direction=="f") {
					if (typeof (DM5_PAGETYPE) != "undefined") {
						if (DM5_PAGETYPE == 9) {
							getAllPost2(DM5_PAGEPCOUNT>100?100:DM5_PAGEPCOUNT, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE, true, true);
						}
						else if (DM5_PAGETYPE == 4) {
							getAllPost2(DM5_PAGEPCOUNT>100?100:DM5_PAGEPCOUNT, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE, true, true);
						}
					}
				}
				else {
					if (typeof (DM5_PAGETYPE) != "undefined") {
						if (DM5_PAGETYPE == 9) {
							getAllPost2(1, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE, false, true);
						}
						else if (DM5_PAGETYPE == 4) {
							getAllPost2(1, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE, false, true);
						}
					}
				}
				$(".view-comment-main .top .page, .view-comment-main .bottom-page").hide()
			}

			document.addEventListener('readystatechange', (event) => {
				if(document.readyState == 'complete') {
					let adutBtn = document.querySelector("#checkAdult");
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
					ppa = document.querySelectorAll(".view-paging>.container>a");
				PrevC = NextC = PrevP = NextP = null;
				for(let i in ppa) {
					switch(ppa[i].innerText) {
						case "上一章":	PrevC=ppa[i]; break;
						case "下一章":	NextC=ppa[i]; break;
						case "上一页":	PrevP=ppa[i]; break;
						case "下一页":	NextP=ppa[i]; break;
					}
				}

				var actP=document.querySelector("li.lidaykey.active a, .page-pagination ul li a.active");
				e = await (e || window.event);
				try {
					switch(await e.key.toLowerCase()) {
						case 'delete':
						case 'e': // 新一章
							if(NextC) NextC.click();
							break;
						case 'insert':
						case 'q': // 舊一章
							if(PrevC) PrevC.click();
							break;
            case 'arrowup':
						case 'arrowleft':
						case 'a': // 前一頁
							if(document.querySelector("#comicRead[style='']")) return;
							$('#last-mask, #last-win').hide();
							if(PrevP) ShowPre();
							else if(actP) actP.parentNode.previousElementSibling.querySelector('a').click();
							else YingdmList.self.changepager(parseInt(actP.innerText)-1)
							break;
						case 'arrowdown':
						case 'arrowright':
						case 'd': // 下一頁
							if(document.querySelector("#comicRead[style='']")) return;
							$('#last-mask, #last-win').hide();
							if(NextP) ShowNext();
							else if(actP) actP.parentNode.nextElementSibling.querySelector('a').click();
							else YingdmList.self.changepager(parseInt(actP.innerText)+1)
							break;
						case 'r': // 載入舊一頁留言
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							var NextE=document.querySelector(".view-comment-main .top .page span.current").nextElementSibling;
							if(NextE) NextE.click();
							$(".view-comment-main .top .page, .view-comment-main .bottom-page").show();
							mySetting.dm5.loadAllComments="none";
							await GM.setValue("setting", mySetting);
							break;
						case 't': // 載入新一頁留言
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							var PrevE=document.querySelector(".view-comment-main .top .page span.current").previousElementSibling;
							if(PrevE) PrevE.click();
							$(".view-comment-main .top .page, .view-comment-main .bottom-page").show();
							mySetting.dm5.loadAllComments="none";
							await GM.setValue("setting", mySetting);
							break;
						case 'v'://原圖切換
							document.body.classList.toggle("actualSize");
							break;
						case '': // 載入全部留言，新→舊
							if(loadCmts) clearTimeout(loadCmts)
							$('#last-mask, #last-win').hide();
							if(document.querySelector(".view-comment-main .postlist")) dm5AllComments("b");
							mySetting.dm5.loadAllComments="backward";
							await GM.setValue("setting", mySetting);
							break;
						case '': // 載入全部留言，舊→新
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

			//=============================================================================


		case "dmzj":
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

				e = e || window.event;
				try {
					switch(e.key.toLowerCase()) {
						case 'delete':
						case 'e':
							document.querySelector(".btmBtnBox>a.btm_chapter_btn.fr").click();
							break;
						case 'insert':
						case 'q':
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
							if(elm) NextP.click();
							else if(elm=document.querySelector(".comment_con_tab a.next")) elm.click()
							else next_img();
							break;
						case 'v':
							document.body.classList.toggle("actualSize");
							break;
					}
				} catch(err) { console.log(err); }
			});
			break;

			//=============================================================================

		case "mhgui":
		case "manhuagui":
			document.addEventListener('readystatechange', (event) => {
				if(document.readyState == 'interactive') {
					setTimeout(function(){
						let adutBtn = document.querySelector("#checkAdult");
						if(adutBtn)	adutBtn.click();
					}, 200);
				}
			});

			document.addEventListener("keydown", function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				e = e || window.event;
				var curr=document.querySelector(".pager .current, .page .cu, div.flickr span.current"),
					view=document.querySelector('#mangaBox'),
					scrollMode=document.querySelector(".w980.sub-btn .support .pfunc:last-child a.current");
				try {
					$("#pb, #pb-mask").remove();
					switch(e.key.toLowerCase()) {
						case 'delete':
						case 'e':
							document.querySelector(".main-btn>a.nextC").click();
							break;
						case 'insert':
						case 'q':
							document.querySelector(".main-btn>a.prevC").click();
							break;
						case 'arrowleft':
              case 'arrowup':
							if(view) break;
						case 'a':
              case 'w':
							if(document.querySelector("#comicRead[style='']")) return;
							if(curr && !scrollMode) curr.previousElementSibling.click();
							break;
						case 'arrowright':
            case 'arrowdown':
							if(view) break;
						case 'd':
              case 's':
							if(document.querySelector("#comicRead[style='']")) return;
							if(curr && !scrollMode) curr.nextElementSibling.click();
							break;
						case 'v':
							document.body.classList.toggle("actualSize");
							break;
					}
				} catch(err){ console.log(err); }
			});
			break;

			//=============================================================================

		case "2025copy":
      case "mangacopy":
			document.addEventListener("keydown", function(e) {
				if(document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
				var elm=null;
				e = e || window.event;
				try {
					switch(e.key.toLowerCase()) {
						case 'delete':
						case 'e':
							elm=document.querySelector(".footer .comicContent-next a:not(.prev-null)");
							break;
						case 'insert':
						case 'q':
							elm=document.querySelector(".footer .comicContent-prev:not(.index):not(.list) a:not(.prev-null)");
							break;
						case 'arrowleft':
              case 'w':
						case 'a':
							if(document.querySelector("#comicRead[style='']")) return;
							elm=document.querySelector(".el-pagination li.active");
							if(elm) elm=elm.previousElementSibling;
							else	elm=document.querySelector(".page-all li.prev>a, .comic-detail-page li.prev>a");
							break;
						case 'arrowright':
              case 's':
						case 'd':
							if(document.querySelector("#comicRead[style='']")) return;
							elm=document.querySelector(".el-pagination li.active");
							if(elm) elm=elm.nextElementSibling;
							else	elm=document.querySelector(".page-all li.next>a, .comic-detail-page li.next>a");
							break;
						case 'v':
							document.body.classList.toggle("actualSize");
							break;
					}
					if(elm) elm.click();
				} catch(err) { console.log(err); }
			});
			break;
	}

})();