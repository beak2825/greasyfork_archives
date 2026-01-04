// ==UserScript==
// @name         B站学习机 | Bilibili+Youtube字幕全文阅读 | coursera-like subtitles fulltext reader
// @namespace    https://gist.github.com/KnIfER/9e43ffa31c3b9831a500edf35595c1dc
// @version      6
// @description  在线字幕阅读或下载，B站油管秒变cousera！ - Read & learn subtitles full text online!
// @author       KnIfER
// @match        https://*.bilibili.com/video/*
// @match        https://*.youtube.com/*
// @match        https://*/watch?v=*
// @match        https://*/embed/*?si=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457737/B%E7%AB%99%E5%AD%A6%E4%B9%A0%E6%9C%BA%20%7C%20Bilibili%2BYoutube%E5%AD%97%E5%B9%95%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%20%7C%20coursera-like%20subtitles%20fulltext%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/457737/B%E7%AB%99%E5%AD%A6%E4%B9%A0%E6%9C%BA%20%7C%20Bilibili%2BYoutube%E5%AD%97%E5%B9%95%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%20%7C%20coursera-like%20subtitles%20fulltext%20reader.meta.js
// ==/UserScript==

  
// (function() {
	var trustedPolicy = trustedTypes.createPolicy("myPolicy", {
		createHTML: (s) => s
	  });
	  
	'use strict';
	var lastVid='x';
	var win = window.unsafeWindow || window, doc=document, d=doc
		, bank=win.parent._xxj_bank
		, isBY = location.host.indexOf('bilibili')>=0?0:1
		, isYProxy = e=>parent.advancedVideoPlayer && parent.advancedVideoPlayerContainer // YOUTUBEUNBLOCKED
		, Data;
	if(!bank) {
		bank = win.parent._xxj_bank = {};
	} else try{
		lastVid = bank.unreg();
	} catch(e) {}
	bank.unreg = uninstall;
	// unregister the script for hot reload
	var unregs = [];
	function uninstall() {
		if(Btn) Btn.remove();
		if(TextPane) TextPane.remove();
		//
		Btn = 0;
		Menu = 0;
		TextPane = 0;
		//
		if(isBY==0) {
			proto.open = proto.realOpen;
			proto.send = proto.realSend;
		}
		var tmp = ge('_xxj_sty');
		if(tmp) tmp.remove();
		for(var i=0;i<unregs.length;i++) {
			unregs[i]();
		}
		return lastVid;
	}

	function debug(a,b,c,d,e){var t=[a,b,c,d,e];for(var i=5;i>=0;i--){if(t[i]===undefined)t[i]='';else break}console.log("%c 学习机 ","color:#eee!important;background:#0FF;",t[0],t[1],t[2],t[3],t[4])}
	function gc(c, d) {
		return (d||document).getElementsByClassName(c)[0];
	}
	function gt(c, d) {
		return (d||document).getElementsByTagName(c)[0];
	}
	function ge(id) {
		return document.getElementById(id);
	}
	function gcs(c, d) {
		return (d||document).getElementsByClassName(c);
	}
	function gts(c, d) {
		return (d||document).getElementsByTagName(c);
	}
	function gcp(c, d, max) {
		var p = d||document;
		if(!max) max=99999;
		while(p) {
			if(p.classList && p.classList.contains(c)) return p;
			p = p.parentNode;
			if(--max<=0) return null;
		}
		return p;
	}
	function addEvent(a, b, c, d) {
		if(!d) d = win;
		d.addEventListener(a, b, c);
		unregs.push(function(){ d.removeEventListener(a, b, c)} );
	}
	function delEvent(a, b, c, d) {
		if(!d) d = win;
		d.removeEventListener(a, b, c);
	}
	function stop(e) {
		try{
			e.stopPropagation();
			e.preventDefault();
		} catch(e) {debug(e)}
	}
	function editing() {
		var act = document.activeElement;
		if(act)
			return act.tagName==='INPUT'
				|| act.contentEditable==='true'
				|| act.tagName==='TEXTAREA'
	}

	var proto = XMLHttpRequest.prototype, html=e=>e;
	if(isBY==0) {
		proto.realOpen = proto.open;
		proto.open = function(method, url, a, u, p) {
			//debug('request::open!!!', url);
			this.realOpen(method, url , true, u, p); // set async to true to avoid 'sync responseType error'
			if(url) {
				var tmp = new RegExp('(aid=[0-9]+&cid=[0-9]+)').exec(url);
				if(tmp) tmp = tmp[0];
				if(tmp && lastVid!=tmp) {
					lastVid = tmp;
					debug('正在播放='+lastVid);
				}
			}
		};
		proto.realSend = proto.send;
		proto.send = function(b) {
			//debug('request::send!!!', b);
			this.realSend(b);
		};
	} else {
		html=e=>trustedPolicy.createHTML(e);
	}
	
	// 动态z-order，配合B站笔记窗口
	var zIndexes = ['1500', '10000'];
	if(isBY==1) {
		zIndexes = ['2030', '10000'];
	}

    var loadOnStart = false; /* true false 是否自动分析字幕 */
    var autoFTM = false; /* true false 是否自动打开字幕列表 */
 
	// the panel, textview, and the button
    var TextPane, tv, Btn, installTryCnt=0
		, autoScroling, userScrollTm=0
		, moved, focused=0
		// the menu
		, Menu, MenuSty
		// video tag
		, Vid
		;
 
	function ge(e,p){return (p||doc).getElementById(e)};
	function gc(e,p){return (p||doc).getElementsByClassName(e)[0]};
	function craft(p, t, c) {
		var e=doc.createElement(t||'DIV');
		if(c)e.className=c;
		if(p)p.appendChild(e);
		return e;
	}
 
    function installBtn(){
        if(!Btn || !Btn.parentNode){
			var ibf = 0, tmp;
			if(isBY==0) {
				ibf = doc.getElementsByClassName("bpx-player-ctrl-subtitle")[0];
				if(!ibf) ibf = doc.getElementsByClassName("bpx-player-ctrl-volume")[0];
				if(ibf) ibf = ibf.nextElementSibling;
			} else {
				ibf = doc.getElementsByClassName("ytp-settings-button")[0];
				if(!ibf) {
					tmp = doc.getElementsByClassName("slim_video_action_bar_renderer_button");
					ibf = tmp[tmp.length-1];
				}
			}
			debug('insertBefore', ibf, installTryCnt);
            if(ibf) {
				// insert a control BUTTON
				tmp = craft(doc.head, "STYLE");
				tmp.id = "_xxj_sty"
				tmp.textContent = ".ytp-gradient-top,.ytp-chrome-top{opacity:0}.ytp-fulltext-menu{right: 12px;bottom: 53px;z-index: 71;will-change: width,height;}._xxj_menu .ytp-menuitem-label{width:65%;}._xxj_menu{user-select:none}";
                if(isBY==0) {
					tmp.textContent+=".ytp-menuitem>div{display:inline-block;font-size:medium}.ytp-menuitem-label{cursor:pointer}";
				}
				if(isBY==1) {
					tmp.textContent+="._xxj_menu .ytp-menuitem-label{width:65%;white-space:nowrap;font-size:100%;}._xxj_menu .ytp-menuitem-content{white-space:nowrap;font-size:100%;}";
				}
				tmp = craft(0, isBY==1?'BUTTON':'DIV', "ytp-fulltext-button ytp-button bpx-player-ctrl-btn");
                tmp.id = "_xxj_btn"
                tmp.title="字幕学习机 (x)";
				// button svg icon
				
				debug('create the control button')
                tmp.innerHTML = html('<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-99"></use><path class="ytp-svg-fill" d="M18.97,18h6.82v1.46h-6.82zM18.97,15.57h6.82L25.8,17.03h-6.82zM18.97,20.43h6.82L25.8,21.89h-6.82zM26.77,10.19L9.23,10.19c-1.07,0 -1.96,0.88 -1.96,1.96v12.67c0,1.07 0.88,1.96 1.96,1.96h17.55c1.07,0 1.96,-0.88 1.96,-1.96L28.73,12.15c0,-1.07 -0.88,-1.96 -1.96,-1.96zM26.77,24.83h-8.77L18,12.15h8.77v12.67z" id="ytp-id-99"></path></g></svg>'
					);
				
				tmp.onclick = function() {
					if(MenuSty) {
						tmp = MenuSty;
						if(tmp.display!="none") {
							tmp.display="none"
						} else {
							tmp.display="";
							build_cc_menu()
						}
					} else {
						build_cc_menu()
					}
                }
				var ts = tmp.style;
				if(isBY==0) {
					ts.maxHeight='30px'
					tmp.firstElementChild.style = "transform:scale(1.5);"
				}
				if(isBY==1) {
					if(location.host[0]=='m') {
						ts.marginTop='.5%';
						ts.minWidth='25px';
						gc('ytp-svg-fill', tmp).style.fill='#000';
					}
				}
                ibf.parentNode.insertBefore(tmp, ibf);
				Btn=tmp;
				debug('成功安装按钮:', tmp);
				// if(autoFTM) {
				// 	build_cc_menu()
				// }
				// if(loadOnStart) {
				// 	// todo load initial lyrics
				// 	build_cc_menu(1);
				// 	initYFT();
				// }
            } else if(installTryCnt++<15){
                setTimeout(installBtn, 500);
            }
        }
    }
	
	
    function tvShown(){
		return TextPane && TextPane.style.display!='none';
	}

	var keysDwn=[];
	let pdoc = doc;
	if(isYProxy()) {
		pdoc = parent.document;
	}
	function fnKeydown(e){
		//debug('fnKeydown', tvShown(), e.code, e.code==="KeyX", e.altKey)
		if(!keysDwn[e.code]) {
			keysDwn[e.code] = e;
			if(!editing())
			if(focused || tvShown()) {
				if(focused) {
					if(e.code==="Escape") {
						TextPane.close();
						stop(e);
					}
				}
				// if(userScrollTm && e.code==="ArrowRight" && e.code==="ArrowLeft") {
				// 	userScrollTm = 0;
				// 	debug('userScrollTm = 0');
				// }
				if(e.code==="KeyX"/*  && e.altKey */) {
					TextPane.close();
				}
			}
			else if(e.code==="KeyX"/*  && e.altKey */) {
				installTextPane().style.display = "";
			}
		}
	}
	function fnKeyup(e){
		delete keysDwn[e.code];
	}
	addEvent("keydown", fnKeydown, 1, pdoc);
	addEvent("keyup", fnKeyup, 1, pdoc);
	if(pdoc!=doc) {
		addEvent("keydown", fnKeydown, 1, doc);
		addEvent("keyup", fnKeyup, 1, doc);
	}
	
    function insertTextToEl(){
		if(isBY==0) {
			return gc('bpx-player-container');
		} else {
			return isYProxy()&&parent['player-container-inner']
		}
	}
	
    function installTextPane(H){
        if(!TextPane) {
            craft(pdoc.head, "STYLE").innerHTML = html("a.ft-time:before{content:attr(data-val)}a.ft-time{text-decoration:none;color:blue;user-select:none;-moz-user-select:none}._xxj_ft_ln.curr {border-bottom: 5px solid #0000ffac;}ytd-masthead{background: transparent;}._xxj_btn:hover{ box-shadow: 1px 1px 2px 1px rgb(0 0 0 / 15%); }._xxj_btn:active{ box-shadow: inset 1px 1px 2px 1px rgb(0 0 0 / 15%);}"
				+ ".bpx-player-container[data-screen=full], .bpx-player-container[data-screen=web] {z-index: 1500!important;}"
				+ "#bilibili-player.mode-webscreen {z-index: 1500!important;}"
				// + "._xxj_tv {display: none;}"
				);
			if(isYProxy() && win==parent) {
				return;
			}
			// the lyrics display float window.
			var advPlayer = insertTextToEl();
            TextPane=craft(advPlayer||pdoc.body,0,"_xxj_tv");
			TextPane.innerHTML=html('<p class="drag_resizer"></p><div class="_xxj_tvp"><p class="_xxj_ftv">FETCHING……</p></div>');
			tv = gc('_xxj_ftv', TextPane);
			tv.style = 'margin-left:5px;font-size:x-large;padding:9px 100px 0 100px;';
			var tvP = gc('_xxj_tvp', TextPane)
				, tvPs = TextPane.style
				, x = 0
				, minHeight = 1.35 * (parseInt(getComputedStyle(tv).lineHeight)||tv.offsetHeight);
				;
			tvPs.zIndex = zIndexes[1];
			tvP.style = 'overflow-y:scroll;height:100%;';
			TextPane.style='position:fixed;bottom:0;left:0;width:100%;height:'+minHeight+'px;box-sizing:border-box;background:#fff;z-index:10000;overflow:hidden;transition:background 0.25s';
			// the play button.
			var playBtn = craft(TextPane);
			playBtn.style = 'position:fixed;height:70px;width:80px;bottom:0;';
			playBtn.innerHTML = html('<svg style="background-color:#fff;fill: #03a9f4ab;width: 60px;border-radius: 4px;" class="_xxj_btn" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g><path class="btnPlay" d="M12,7.5v21l16.5,-10.5z"></path><path class="btnPause" d="M9,7.5h6v21L9,28.5zM21,7.5h6v21h-6z"></path></g></svg>');
			var btnPause = gc('btnPause', playBtn), btnPlay = gc('btnPlay', playBtn);
			function syncPlay(p) {
				btnPause.style.display=p?'':'none';
				btnPlay.style.display=p?'none':'';
				playBtn.title = p?'暂停':'播放';
			}
			playBtn = playBtn.children[0];
			function togglePlay(){
				var p = Vid.playing;
				if(p) Vid.pause();
				else Vid.play();
				syncPlay(Vid.playing);
			}
			addEvent('click', togglePlay, true, playBtn)
			addEvent('contextmenu', playBtn.ctx = function(e) {
				lcN=userScrollTm=0;
				timeUpdate();
				stop(e);
			}, true, playBtn)
			//
			// float window control buttons on the top-right corner.
			//
			var topBtns = craft(TextPane);
			topBtns.style='user-select:none;padding-right:0.25em;font-weight:600;text-decoration:none;position:absolute;top:0;right:20px;font-size:17px;';
			// the close button.
			var closeBtn = craft(topBtns, 'A', 'notranslate');
			closeBtn.innerText = '[X]';
			closeBtn.style = 'color:#175199;';
			closeBtn.title = '关闭';
			closeBtn.onclick = TextPane.close = function(){
				tvPs.display = 'none';
				focused = 0;
			}
			// the maximise button.
			craft(topBtns, 'DIV').style='height:5px;';
			var maxBtn = craft(topBtns, 'A', 'notranslate');
			maxBtn.innerText = '[▢]';
			maxBtn.style = 'color:#175199;';
			maxBtn.title = '最大化';
			maxBtn.onclick = function(){
			}
			// the opacity button.
			craft(topBtns, 'DIV').style='height:5px;';
			var zenBtn = craft(topBtns, 'A', 'notranslate');
			zenBtn.innerText = '[⊥]';
			zenBtn.style = 'color:#175199;transform:rotate(180deg);position:absolute;';
			zenBtn.title = '透明背景';
			zenBtn.onclick = function(){
				if(tvPs.background=='rgb(255, 255, 255)')
					tvPs.background = 'rgb(255, 255, 255, 0.55)'
				else
					tvPs.background = 'rgb(255, 255, 255)'
				debug(tvPs.background);
			}
			
            // drag-resize the TextView, bindResize
            if(1) {
                var el = gc('drag_resizer', TextPane);
				el.style = 'position:absolute;top:0;right:0;height:6px;width:100%;padding:0;cursor:ns-resize';
                function y(e){
                    if(e.clientY==undefined)
                        return e.originalEvent.changedTouches[0].clientY;
					return e.clientY;
				}
				// drag-resie area on the top
                function mousedown(e){
                    x = y(e) + tvP.offsetHeight;
                    stop(e);
                    addEvent("mousemove", mouseMove, 1, pdoc);
                    addEvent("mouseup", mouseUp, 1, pdoc);
                };
                function mouseMove(e){
					var h = x - y(e);
                    tvPs.height = Math.min(pdoc.documentElement.clientHeight, Math.max(minHeight, h)) + 'px';
                }
                function mouseUp(){
					delEvent("mousemove", mouseMove, 1, pdoc);
					delEvent("mouseup", mouseUp, 1, pdoc);
                }
                el.addEventListener("mousedown", mousedown);
                el.addEventListener("touchstart", mousedown);
                el.addEventListener("touchmove", mouseMove);
                el.addEventListener("touchend", mouseUp);
				
				// 右击拖拽缩放
				function fnDown(e){
					// debug("mousedown", e.target);
					if(tvShown()) {
						var p=e.path,t=e.target,d=!!gcp('_xxj_tv', t,5);
						if(gcp('_xxj_btn',t,5)) { 
							playBtn.ctx(e);
						}
						else if(d && e.button==2) {
							debug('开启移动检测')
							moved = 7;
							delEvent("mousemove", fnMove, 1, pdoc);
							//pdoc.addEventListener("mousemove", fnMove)
							setTimeout(function(){addEvent("mousemove", fnMove, 1, pdoc)}, 64);
						}
						if(d ^ focused) {
							focused = d;
							tvPs.zIndex = zIndexes[d];
							if(!d && userScrollTm) {
								userScrollTm = 0;
							}
						}
					}
				}
				function fnMenu(e){
					// debug('contextmenu', moved, e.target);
					if(moved==-1) {
						stop(e);
					}
					else if(focused && e.target.tagName!=='A') {
						delEvent("mousemove", fnMove, 1, pdoc);
						if(window.getSelection().isCollapsed) {
							debug('该显示特别菜单啊！');
							fnAbort();
							moved = 0;
						}
					}
				}
				addEvent("contextmenu", fnMenu, 1, pdoc);
				addEvent("pointerdown", fnDown, 1, pdoc);
				function fnAbort(){
					debug('fnAbort');
					moved=-1; 
					delEvent("mousemove", fnMove, 1, pdoc);
					delEvent("mouseup", fnAbort, 1, pdoc);
				}
				function fnMove(e){ 
					//debug('fnMove', e);
					if(moved==7) {
						debug('开始右击手势移动', e);
						moved = 1;
						x = y(e) + tvP.offsetHeight;
						delEvent("mouseup", fnAbort, 1, pdoc); addEvent("mouseup", fnAbort, 1, pdoc);
					}
					if(moved==1) {
						mouseMove(e);
					}
				}
                tvP.addEventListener("scroll", function(e){
					if(autoScroling) {
						var tmp=Math.ceil(autoScroling), now=tvP.scrollTop;
						if(now>=tmp-1 && now<=tmp+1) {
							return;
						}
						autoScroling = 0;
					}
					//debug('scroll!', autoScroling, tvP.scrollTop);
					userScrollTm = Date.now();
				});
				tvP.addEventListener("click", function(e){
					if(e.target.className==="ft-time") {
						stop(e);
						Vid.currentTime=parseFloat(e.target.getAttribute("data-tm"));
						if(!Vid.playing) {
							Vid.play();
						}
						var n = e.target.nextElementSibling;
						if(n && n.classList.contains('_xxj_ft_ln')) {
							if(lcE) {
								lcE.classList.remove("curr");
							}
							lcE = n;
							n.classList.add("curr");
						}
					}
				});
				TextPane.ondblclickx = function(e) {
					debug(e, getSelection().isCollapsed);
					if((e.target==tv || e.target==tvP)
						&& (e.offsetX<95 || e.offsetX>tvP.clientWidth+100)) {
						togglePlay();
						getSelection().empty();
						stop(e);
					}
				}
				TextPane.addEventListener('dblclick', TextPane.ondblclickx, 1)
            }
			
			function timeUpdate(e) {
				// lyrics scroll sync to time
				var tm=Vid.currentTime;
				if(lrcArr && (!lcN||tm>=lcN.endTime||tm<lcN.startTime)) {
					var n = reduce(tm,lrcArr,0,lrcArr.length);
					if(n && n!=lcN) {
						lcN = n;
						if(lcE) {
							lcE.classList.remove("curr");
						}
						n = n.ele;
						lcE = n;
						if(n) {
							n.classList.add("curr");
						}
						if(userScrollTm) {
							var scrollWait = 800;
							if(Date.now()-userScrollTm > scrollWait) {
								userScrollTm = 0;
							}
						}
						if(window.getSelection().isCollapsed
							&& userScrollTm==0 && moved!=1
							&& (n.offsetTop+n.offsetHeight+minHeight/2>tvP.scrollTop+tvP.offsetHeight
									||n.offsetTop<tvP.scrollTop)) {
							autoScroling=n.offsetTop;
							if(tvP.offsetHeight > minHeight*1.7) {
								autoScroling -= minHeight/2;
							}
							// 自动滚动
							tvP.scrollTop=autoScroling;
							// tvP.scrollTo({ // todo 平滑滚动
							// 	top: autoScroling
							// 	,behavior: 'smooth'
							// });
						}
					}
				}
			}
			
			// install timers to h5 video tag
			function installTimer() {
				if(Vid==null) {
					Vid=document.querySelector('video')
					if(Vid==null) {
						setTimeout(installTimer, 100)
					} 
					else {
						Vid.addEventListener('timeupdate', timeUpdate);
						Vid.addEventListener('playing', e => {
							syncPlay(1);
						});
						Vid.addEventListener('play', e => {
							syncPlay(1);
						});
						Vid.addEventListener('pause', e => {
							syncPlay(0);
						});
						Vid.addEventListener('seeking', e => {
							userScrollTm = 0;
							timeUpdate(e);
							//debug('seeking...', Vid.currentTime, e)
						});
						if(Vid.playing==undefined) {
							Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
								get: function(){
									return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
								}
							})
						}
						syncPlay(Vid.playing);
					}
				}
			}
			installTimer();
			//var insertionLis = e => {
			//	//console.log("DOMNodeInserted")
			//	if(document.body.lastElementChild!=YFT){
			//		document.body.removeChild(YFT);
			//		document.body.appendChild(YFT);
			//	}
			//};
			//document.body.addEventListener('DOMNodeInserted', insertionLis)
        }
		// ensure visibility
		if(H>0) {
			var tmp = TextPane.style;
			var h = parseFloat(tmp.height);
			if(h!=h||h<H) {
				tmp.height = H+"px"
			}
			if(tmp.display!=="") {
				tmp.display = ""
			}
		}
		focused = 1;
		return TextPane;
    }


	addEvent('keydown', e=>{
		// de('keydown', e)
		if(isYProxy())
		if(e.key=='Enter' && !editing() && !(e.altKey||e.shiftKey||e.ctrlKey)) {
			if(doc.fullscreenElement||parent.doc.fullscreenElement) {
				doc.exitFullscreen();
				parent.doc.exitFullscreen();
				stop(e)
				return
			}
			// doc.body.requestFullscreen();
			parent['player-container-inner'].requestFullscreen();
			stop(e)
		}
	}, 1, doc);
 
	/*via mdict-js*/
	function reduce(val,arr,st,ed) {
		var len = ed-st;
		if (len > 1) {
		  len = len >> 1;
		  return val > arr[st + len - 1].endTime
					? reduce(val,arr,st+len,ed)
					: reduce(val,arr,st,st+len);
		} else {
		  return arr[st];
		}
	}
 
	// http://qtdebug.com/fe-srt/
	function parseSrt(srt) {
		var parsed = [];
		var textSubtitles = srt.split('\n\n'); // 每条字幕的信息，包含了序号，时间，字幕内容
		for (var i = 0; i < textSubtitles.length; ++i) {
			var textSubtitle = textSubtitles[i].split('\n');
			if (textSubtitle.length >= 2) {
				var sn = textSubtitle[0];
				var tms = textSubtitle[1].split(' --> ');
				var startTime = toSeconds(tms[0]);
				var endTime   = toSeconds(tms[1]);
				var content   = textSubtitle[2];
				// 字幕可能有多行
				if (textSubtitle.length > 2) {
					for (var j = 3; j < textSubtitle.length; j++) {
						content += ' ' + textSubtitle[j];
					}
				}
				parsed.push({
					sn: sn,
					startTime: startTime,
					endTime: endTime,
					content: content
				});
			}
		}
		return parsed;
	}
 
	function toSeconds(t) {
		var s = 0.0;
		if (t) {
			var p = t.trim().split(':');
			for (var i = 0; i < p.length; i++) {
				s = s * 60 + parseFloat(p[i].replace(',', '.'));
			}
		}
		return s;
	}
 
	var tracks = win._xxj_tracks = []; // store all subtitle tracks
	var lrcArr;
	var lcN, lcE;
 
	function AppendFulltext(sub, d) {
		debug("APFT", sub, d);
		var lrc = sub.srt;
		if(d) {
			// var t=win.title;
			// if(t)t=t.innerText;
			var t=document.title;
			downloadString(lrc, "text/plain", t+"."+(sub.lang_code||"a")+".srt");
			return;
		}
		win.srtlrc=sub;
		// parse
		var lrcs = parseSrt(lrc);
		var span="";
		var lastTime=0;
		// concate
		for(var i=0;i<lrcs.length;i++){
			var lI=lrcs[i];
			var text = lI.content;
			var lnSep="<br><br>";
			var sepLn="";
			if(lI.startTime-lastTime>3){
				var idx = text.indexOf(".");
				// skip numberic dots
				while(idx>0) {
					if(idx+1>=text.length||text[idx+1]<=' ') {
						break;
					}
					idx = text.indexOf(".", idx+1);
				}
				if(idx<0) idx = text.indexOf("。");
				if(idx<0) idx = text.indexOf(",");
				if(idx<0) idx = text.indexOf("，");
				if(idx>=0) {
					text=" "+text.substring(0, idx+1)
						+lnSep+text.substring(idx+1);
				} else {
					sepLn = lnSep;
				}
				lnSep = " ";
			} else {
				// merge to previous line
				text="&nbsp;"+text;
				lnSep = "";
			}
 
			//console.log(lI.startTime-lastTime);
			var s = lI.startTime;
			var m = parseInt(lI.startTime/60);
			span+=sepLn+"<a class='ft-time' href='' data-val='" + " "
				+(m+":"+parseInt(s-m*60))+lnSep+"' data-tm='"+s+"'></a>"
				+"<span class='_xxj_ft_ln'>"+text+"</span>"
			lastTime = lI.startTime;
		}
		tv.innerHTML=html(span);
 
		// attach ele to array
		lrcArr = lrcs;
		lcN = 0;
		var cc=0;
		var sz = tv.childElementCount;
		for(var i=0;i<sz,cc<lrcArr.length;i++) {
			if(tv.children[i].className==="_xxj_ft_ln") {
				lrcArr[cc++].ele=tv.children[i];
			}
		}
		window.lrcArr=lrcArr;
		//console.log(lrcArr);
	}
 
    installBtn();
 
	win.APFT = AppendFulltext;
	
	
	// trigger when loading new page
	// (actually this would also trigger when first loading, that's not what we want, that's why we need to use firsr_load === false)
	// (new Material design version would trigger this "yt-navigate-finish" event. old version would not.)
	var body = document.getElementsByTagName("body")[0];
	body.addEventListener("yt-navigate-finish", function (event) {
		if (is_video_page()&&autoFTM) {
			if(build_cc_menu()) {
				var st = MenuSty;
				if(st.display!="") {
					st.display=""
				}
			}
		}
	});
 
	// trigger when loading new page
	// (old version would trigger "spfdone" event. new Material design version not sure yet.)
	window.addEventListener("spfdone", function (e) {
		//if (is_video_page()) {
		//	remove_dwnld_btn();
		//	var checkExist = setInterval(function () {
		//		if (unsafeWindow.watch7_headline) {
		//			init();
		//			clearInterval(checkExist);
		//		}
		//	}, 330);
		//}
	});
 
	function is_video_page() {
		return get_vid() !== null;
	}
 
	function get_vid() {
		if(isBY==1) {
			Data = (gt('ytd-app')||gt('ytd-app', parent.document)).data.playerResponse;
			return Data.videoDetails.videoId;
		}
		return lastVid;
	}
 
	//https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}
 
	// https://stackoverflow.com/questions/32142656/get-youtube-captions#58435817
	function buildXmlurl(videoId, loc) {
		return `${baseUrl}?lang=${loc}&v=${videoId}`;//&fmt=json3
	}
 
	// pull the selected caption.
	function pullLyrics(e, d) {
		//var url;
		// if(e==0) {
		// 	console.log("auto");
		// 	url = get_auto_xml_url();
		// 	console.log("auto", url);
		// }
		// e = tracks[e]
		// if(e) {
		// 	if(!e.srt)
		// 	fetch(url||buildXmlurl(get_vid(), e.lang_code))
		// 	.then(v => v.text())
		// 	.then(v => (new window.DOMParser()).parseFromString(v, "text/xml"))
		// 	.then(v => {
		// 		v = buildSrtFromXML(v);
		// 		e.srt = v;
		// 		appendFulltext(e, d)
		// 	})
		// 	else appendFulltext(e, d)
		// }
		var track = tracks[e];
		var subtitle_url = track.subtitle_url||track.baseUrl;
		debug('fetching caption track url=', subtitle_url, track);
		if(!subtitle_url) {
			throw '字幕地址为空';
		}
		if(!subtitle_url.includes('://')) {
			// bilibili new api does not have https prefix
			subtitle_url = "https:" + subtitle_url;
		}
		var url = subtitle_url;
		if(bank[url]) {
			track.srt = bank[url];
			AppendFulltext(track, d)
		} else {
			fetch(url)
				.then(v => v.text())
				.then(v => {
					debug('fetched caption track=', v);
					var srt;
					if(isBY==0) {
						srt = buildSrtFromJson(v);
					} else {
						  const trusted = html(v);
						  srt =  new window.DOMParser().parseFromString(trusted, 'text/html');
						//   win._src =   srt;
						  srt =  buildSrtFromXML(srt);
						  debug('parsed=', srt);
						// srt = buildSrtFromXML((new window.DOMParser()).parseFromString(v, "text/xml"));
					}
					bank[url] = track.srt = srt;
					AppendFulltext(track, d)
				})
		}
	}
 
	function buildMenu(e, cid){
return (`<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="${e.cid||cid}">
	<div class="ytp-menuitem-icon"></div>
	<div class="ytp-menuitem-label">
		${e.lan_doc||e.name.simpleText}
	</div>
	<div class="ytp-menuitem-content">
		下载
	</div>
</div>`);
	}
 
	function menuClick(e){
		debug('menuClick', e);
		var t = e.target;
		var i = parseInt(t.parentNode.getAttribute("tabindex"));
		if(i==i) {
			if(t.className==="ytp-menuitem-content") {
				// 下载
				pullLyrics(i, 1);
			} else {
				// 查看
				installTextPane(120);
				pullLyrics(i);
			}
		}
		MenuSty.display="none";
		setTimeout(()=>{
			MenuSty.display="none";
			;debug('消失了吗', MenuSty, MenuSty.display);
		}, 1);
		t.blur();
	}
 
	function build_cc_menu(src) {
		var vid = get_vid();
		if(vid==Btn.parsedVid && Menu && Menu.children.length) {
			return false;
		}
		Btn.parsedVid=vid;
		if(loadOnStart) {
			src=1;
		}
		function onMenuLoad(tmp) {
			Menu.innerHTML=html(tmp);
			if(Menu && Menu.children) {
				for (var i=0,ch=Menu.children,len=ch.length; i < len; i++) {
					ch[i].onclick = menuClick;
					// if(autosel==i) {
					// 	initYFT(120);
					// 	pullLyrics(i);
					// }
				}
			}
		}
		var ibf = Btn; // unsafeWindow.movie_player
		// todo check auto caption exists
		if((!Menu||!Menu.parentNode) && ibf) {
			var tmp = document.createElement("div");
			ibf.appendChild(tmp);
			// menuData
			tmp.innerHTML = html(`<div class="ytp-popup ytp-fulltext-menu" data-layer="6" id="yft-select"
			style="width: 251px; height: 137px; display: block;">
				<div class="ytp-panel _xxj_menu" style="min-width: 250px; width: 251px; height: 137px;">
					<div class="ytp-panel-menu" role="menu" style="height: 137px;"></div>
				</div>
			</div>`);
			


			MenuSty = tmp.firstElementChild.style;
			MenuSty.position='absolute';
			MenuSty.background='#000000cf';
			if(isBY==0) {
				MenuSty.left='-100px';
			}
			Menu = gc('_xxj_menu', tmp);
			// if(src==1 && !autoFTM) {
			// 	MenuSty.display = "none";
			// }
			debug('Menu', Menu);
		}
		if(Menu) {
			try{
				// bilibili 需要根据视频aid&cid获取字幕列表
				if(isBY==0) {
					Menu.innerHTML = "";
					var url = `https://api.bilibili.com/x/player/v2?${vid}`;
					debug("loading_list, url=", url);
					function onload(res, xhr) {
						debug('得到', res, xhr)
						try{
							bank[vid] = res;
							var autosel=-1
								, arr=res.data.subtitle.subtitles
								, tmp=""
								;
							tracks.length = 0;
							for (var i=0, len=arr.length;i<len;i++) {
								tracks.push(arr[i]);
								tmp+=buildMenu(arr[i], i);
							}
							if(src==1) {
								autosel=0;
							}
							debug('tmp::', arr.length);
							onMenuLoad(tmp)
						} catch(e) {
							console.log(e);
						}
						// todo ... load from file
					}
					if(bank[vid]) {
						onload(bank[vid]);
					} else {
						loadJson(url, onload);
					}
				} 
				// youtube 字幕列表直接给我们了，无需解析api
				else {
					var autosel=-1
						, arr=Data.captions.playerCaptionsTracklistRenderer.captionTracks
						, tmp="", xml
					;
					tracks.length = 0;
					for (var i=0, len=arr.length;i<len;i++) {
						tracks.push(arr[i]);
						tmp += buildMenu(arr[i], i)
					}
					onMenuLoad(tmp)
				}
			} catch(e) {
				debug('获取字幕列表失败！', e)
				Btn.parsedVid="";
			}
		} else {
			Btn.parsedVid="";
		}
		debug('tracks', arr);
		debug("autosel", autosel);
		
		return true;
	}
 
	// 处理时间. 比如 start="671.33"  start="37.64"  start="12" start="23.029"
	// 处理成 srt 时间, 比如 00:00:00,090    00:00:08,460    00:10:29,350
	function process_time(s) {
		s = s.toFixed(3);
		// 671.33 -> 671.330
		// 671 -> 671.000
 
		var array = s.split('.');
		// 把开始时间根据句号分割
		// 671.330 会分割成数组: [671, 330]
 
		var Hour = 0;
		var Minute = 0;
		var Second = array[0]; // 671
		var MilliSecond = array[1]; // 330
		// 先声明下变量, 待会把这几个拼好就行了
 
		// 我们来处理秒数.  把"分钟"和"小时"除出来
		if (Second >= 60) {
			Minute = Math.floor(Second / 60);
			Second = Second - Minute * 60;
			// 把 秒 拆成 分钟和秒, 比如121秒, 拆成2分钟1秒
 
			Hour = Math.floor(Minute / 60);
			Minute = Minute - Hour * 60;
			// 把 分钟 拆成 小时和分钟, 比如700分钟, 拆成11小时40分钟
		}
		// 分钟，如果位数不够两位就变成两位，下面两个if语句的作用也是一样。
		if (Minute < 10) {
			Minute = '0' + Minute;
		}
		// 小时
		if (Hour < 10) {
			Hour = '0' + Hour;
		}
		// 秒
		if (Second < 10) {
			Second = '0' + Second;
		}
		return Hour + ':' + Minute + ':' + Second + ',' + MilliSecond;
	}
 
	// copy from: https://gist.github.com/danallison/3ec9d5314788b337b682
	// Thanks! https://github.com/danallison
	// work in Chrome 66
	// test passed: 2018-5-19
	function downloadString(text, fileType, fileName) {
		var blob = new Blob([text], {type: fileType});
		var a = document.createElement('a');
		a.download = fileName;
		a.href = URL.createObjectURL(blob);
		a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(function () {
			URL.revokeObjectURL(a.href);
		}, 1500);
	}
 
	// https://css-tricks.com/snippets/javascript/unescape-html-in-js/
	// turn HTML entity back to text, example: &quot; should be "
	function htmlDecode(input) {
		var e = document.createElement('div');
		const trusted = html(input);
		e.innerHTML = trusted;
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
		// var e = document.createElement('div');
		// e.innerHTML = input;
		// return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	}
 
	// return URL or null;
	// later we can send a AJAX and get XML subtitle
	function get_auto_xml_url() {
		try {
			var captionTracks = get_captionTracks()
			for (var index in captionTracks) {
				var caption = captionTracks[index];
				if (caption.kind === 'asr') {
					return captionTracks[index].baseUrl;
				}
				// ASR – A caption track generated using automatic speech recognition.
				// https://developers.google.com/youtube/v3/docs/captions
			}
			return false;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	async function get_auto_subtitle() {
		var url = get_auto_xml_url();
		console.log("dwnld_auto_url::", url);
		if (url == false) {
			return false;
		}
		var result = await getUrl(url)
		return result
	}
 
	// Youtube return XML.
	// input: Youtube XML format
	// output: SRT format
	function buildSrtFromXML(youtube_xml_string) {
		if (youtube_xml_string === '') {
			return false;
		}
		var text = youtube_xml_string.getElementsByTagName('text');
		var result = '\uFEFF';
		var len = text.length;
		for (var i = 0; i < len; i++) {
			var content = text[i].textContent.toString();
			content = content.replace(/(<([^>]+)>)/ig, ""); // remove all html tag.
			var start = text[i].getAttribute('start');
			var end = parseFloat(text[i].getAttribute('start')) + parseFloat(text[i].getAttribute('dur'));
			result = result + (i + 1) + "\n";
			// 1
			if (i + 1 >= len) {
			  end = parseFloat(text[i].getAttribute('start')) + parseFloat(text[i].getAttribute('dur'));
			} else {
			  end = text[i + 1].getAttribute('start');
			}
 
			var start_time = process_time(parseFloat(start));
			var end_time = process_time(parseFloat(end));
			result = result + start_time;
			result = result + ' --> ';
			result = result + end_time + "\n";
			// 00:00:01,939 --> 00:00:04,350
 
			content = htmlDecode(content);
			// turn HTML entity back to text. example: &#39; back to apostrophe (')
 
			result = result + content + "\n" + "\n";
		}
		return result;
	}
	
	// bilibili return JSON.
	function buildSrtFromJson(bilibili_json_string) {
		var json = JSON.parse(bilibili_json_string);
		debug('buildSrtFromJson, json=', json);
		var arr = json.body, result = '\uFEFF';
		for (var i = 0, len=arr.length; i < len; i++) {
			var content = arr[i].content;
			content = content.replace(/(<([^>]+)>)/ig, ""); // remove all html tag.
			var start = arr[i].from;
			var end = arr[i].to;
			// 1
			result = result + (i + 1) + "\n";
 
			var start_time = process_time(parseFloat(start));
			var end_time = process_time(parseFloat(end));
			result = result + start_time;
			result = result + ' --> ';
			result = result + end_time + "\n";
			// 00:00:01,939 --> 00:00:04,350
 
			// content = htmlDecode(content);
			// turn HTML entity back to text. example: &#39; back to apostrophe (')
 
			result = result + content + "\n" + "\n";
		}
		return result;
	}
 
	function get_captionTracks() {
		var json = null
		if (win.youtube_playerResponse_1c7) {
			json = youtube_playerResponse_1c7;
		} else if(ytplayer.config.args.player_response) {
			let raw_string = ytplayer.config.args.player_response;
			json = JSON.parse(raw_string);
		} else if (ytplayer.config.args.raw_player_response) {
			json = ytplayer.config.args.raw_player_response;
		}
		let captionTracks = json.captions.playerCaptionsTracklistRenderer.captionTracks;
		return captionTracks
	}
 
	function loadJson(url,cb,parm){
		//debug('loadJson!!!', url,parm)
		var req = new XMLHttpRequest();
		req.open(parm?'POST':'GET', url, true);
		req.responseType = 'json';
        // bilibili API need SESSDATA key from browser's cookies, carry cookies of session for it
        req.withCredentials = true;
		if(cb){
			req.onload = function() {
				cb(req.response, req);
			};
			req.onerror = function() {
				cb(0, req);
			};
		}
		//req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		//x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		req.send(parm);
	}
	
	// https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
	function makeRequest(method, url, load, type) {
		return new Promise(function (resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.responseType = type;
			//xhr.timeout = 2000;
			xhr.onload = function () {
				debug('makeRequest, onload::', this.status, xhr.statusText);
				if (this.status >= 200 && this.status < 300) {
					if(load) {
						load(xhr);
						resolve('');
					} else {
						resolve(xhr);
					}
				} else {
					debug('makeRequest, 发生错误::', this.status, xhr.statusText);
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			};
			xhr.onerror = function () {
				debug('makeRequest, 发生错误::', this.status, xhr.statusText);
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			xhr.open(method, url, true); // set async to true to avoid 'sync responseType error'
			xhr.send();
		});
	}
	async function getUrl(url) {
		return makeRequest("GET", url);
	}
	
	// de
	// var hack =1;
	// if(parent!=win) {
	// 	win.originalRemove_ ||= Element.prototype.removeChild;
	// 	// Override the remove method
	// 	Element.prototype.removeChild = function(e) {
	// 		de('removing...', e.className, e)
	// 		win.originalRemove_.call(this, e);
	// 	};
	// }
	
// })();