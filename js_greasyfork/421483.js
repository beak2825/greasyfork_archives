// ==UserScript==
// @name         Youtube Full Text (Subtitle Downloader + Viewer)
// @namespace    https://greasyfork.org/zh-CN/scripts/421483-youtube-full-text
// @version      1
// @description  在线字幕阅读/下载神器！ - View full text of the subtitles/captions just online! And even download them as srt files !
// @author       KnIfER
// @include      https://*youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/421483/Youtube%20Full%20Text%20%28Subtitle%20Downloader%20%2B%20Viewer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421483/Youtube%20Full%20Text%20%28Subtitle%20Downloader%20%2B%20Viewer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loadOnStart = false; /* true false 是否自动分析字幕 */
    var pinFTMenu = false; /* true false 是否不自动关闭字幕列表 */
    var autoFTM = false; /* true false 是否自动打开字幕列表 */

    var cssData = "#TextView{position:fixed;bottom:0;left:0;width:100%;height:30px;box-sizing:border-box;background:#fff;z-index: 1000;overflow-y:scroll}#drag_resizer{position:sticky;top:0;right:0;height:6px;width:100%;padding:0;cursor:ns-resize}#ftv{margin-top:9px;margin-left:5px;font-size:x-large;padding:0 100px 0 100px;}a.ft-time:before{content:attr(data-val)}a.ft-time{text-decoration:none;color:blue;user-select:none;-moz-user-select:none}.ft-ln.curr {border-bottom: 2px solid #0000ffac;}ytd-masthead{background: transparent;}";

	var btnCss = ".ytp-gradient-top,.ytp-chrome-top{opacity:0}.ytp-fulltext-menu{right: 12px;bottom: 53px;z-index: 71;will-change: width,height;}.ytp-fulltext-menu .ytp-menuitem-label{width: 65%;}";

    // the dialog
    var pageData = '<p id="drag_resizer"></p><p id="ftv">CAPTION</p>';

    var menuData = `<div class="ytp-popup ytp-fulltext-menu" data-layer="6" id="yft-select"
style="width: 251px; height: 137px; display: block;">
	<div class="ytp-panel" style="min-width: 250px; width: 251px; height: 137px;" id="yft_cc">
		<div class="ytp-panel-menu" role="menu" style="height: 137px;"></div>
	</div>
</div>`;

    // the svg icon from Android Assets && the VectorPathTweaker plugin
    var btnData = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-99"></use><path class="ytp-svg-fill" d="M18.97,18h6.82v1.46h-6.82zM18.97,15.57h6.82L25.8,17.03h-6.82zM18.97,20.43h6.82L25.8,21.89h-6.82zM26.77,10.19L9.23,10.19c-1.07,0 -1.96,0.88 -1.96,1.96v12.67c0,1.07 0.88,1.96 1.96,1.96h17.55c1.07,0 1.96,-0.88 1.96,-1.96L28.73,12.15c0,-1.07 -0.88,-1.96 -1.96,-1.96zM26.77,24.83h-8.77L18,12.15h8.77v12.67z" id="ytp-id-99"></path></g></svg>';

	// api address
	var baseUrl = 'https://video.google.com/timedtext';

	// the panel, the text, the button
    var YFT, ftv, BTN;

	// the menu
	var YFT_menu, YFT_mps;

	// video tag
    var H5Vid;

	var lrcLoaded;

    function initBTN(){
        if(!BTN){
            var doc=document,rct = doc.getElementsByClassName("ytp-right-controls")[0];
            if(rct&&rct.firstChild){
				// insert a control btn
				var e = doc.createElement("style");
				e.id = "FTCB"
				doc.head.appendChild(e);
				e.innerHTML = btnCss;
                e = doc.createElement("button");
                e.id = "YFTB"
                e.className = "ytp-fulltext-button ytp-button";
                e.title="Full text (t)";
                rct.insertBefore(e,rct.firstChild);
                e.innerHTML = btnData;
                e.onclick = function() {
					if(YFT_mps) {
						var st = YFT_mps;
						if(st.display!="none") {
							st.display="none"
						} else {
							st.display="";
							build_cc_menu()
						}
					} else {
						build_cc_menu()
					}
                }
				BTN=e;
				if(autoFTM) {
					build_cc_menu()
				}
				if(loadOnStart) {
					// todo load initial lyrics
					build_cc_menu(1);
					initYFT();
				}
            } else {
                setTimeout(initBTN, 100);
            }
        }
    }

    function initYFT(H){
        if(!YFT) {
            var doc=document,item = doc.createElement("style");
            item.id = "YFT"
            doc.head.appendChild(item);
            item.innerHTML = cssData;

            item=doc.createElement("div");
            item.id="TextView";
            doc.body.appendChild(item);
            item.innerHTML=pageData;
            YFT = item;

			ftv = YFT.children[1];

            // drag-resize the TextView
            //item.onload= ()=> bindResize();
            bindResize();

            function bindResize(){
                var tvP = YFT;
                var tvPs = tvP.style,
                    x = 0;
                var el = drag_resizer;
                function mousedown(e){
                    if(e.clientY==undefined)
                        e.clientY=e.originalEvent.changedTouches[0].clientY;
                    x = e.clientY + tvP.offsetHeight;
                    e.preventDefault()
                    document.addEventListener("mousemove", mouseMove); document.addEventListener("mouseup", mouseUp);
                };
                function mouseMove(e){
                    if(e.clientY==undefined)
                        e.clientY=e.originalEvent.changedTouches[0].clientY;
                    tvPs.height = x - e.clientY + 'px';
                }
                function mouseUp(){
                    document.removeEventListener("mousemove", mouseMove); document.removeEventListener("mouseup", mouseUp);
                }

                el.addEventListener("mousedown", mousedown);
                el.addEventListener("touchstart", mousedown);
                el.addEventListener("touchmove", mouseMove);
                el.addEventListener("touchend", mouseUp);
            }
			installTimers();
			//var insertionLis = e => {
			//	//console.log("DOMNodeInserted")
			//	if(document.body.lastElementChild!=YFT){
			//		document.body.removeChild(YFT);
			//		document.body.appendChild(YFT);
			//	}
			//};
			//document.body.addEventListener('DOMNodeInserted', insertionLis)
        }
		ensureFTH(H||30)
    }

    function ensureFTH(e){
		// ensure visibility
		if(YFT){
			var h = parseFloat(YFT.style.height);
			if(h!=h||h<e) {
				YFT.style.height = e+"px"
			}
			if(YFT.style.display!=="") {
				YFT.style.display = ""
			}
		}
	}

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

    function installTimers(){
		if(H5Vid==null) {
			H5Vid=document.querySelector('video')
			if(H5Vid==null) {
				setTimeout(initTimer, 100)
			} else {
				H5Vid.addEventListener('timeupdate', e => {
					// lyrics scroll sync to time
					var tm=H5Vid.currentTime;
					if(lrcArr&&(!lcN||tm>=lcN.endTime||tm<lcN.startTime)) {
						var n = reduce(tm,lrcArr,0,lrcArr.length);
						if(n&&n!=lcN) {
							lcN = n;
							if(lcE) {
								lcE.className="ft-ln";
							}
							n = n.ele;
							lcE = n;
							if(n) {
								n.className+=" curr";
							}
							if(window.getSelection().isCollapsed
								&&(n.offsetTop+n.offsetHeight>TextView.scrollTop+TextView.offsetHeight
								||n.offsetTop<TextView.scrollTop)) {
								TextView.scrollTop=n.offsetTop;
								//TextView.scrollTo(n.offsetTop);
							}
						}
					}
				})
				window.addEventListener("click", function(e){
					if(e.srcElement.className==="ft-time") {
						e.preventDefault();
						H5Vid.currentTime=parseFloat(e.srcElement.getAttribute("data-tm"));
					}
				});
			}
		}
	}

	// http://qtdebug.com/fe-srt/
	function parseSrtSubtitles(srt) {
		var subtitles = [];
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
				// 你没有对象
				var subtitle = {
					sn: sn,
					startTime: startTime,
					endTime: endTime,
					content: content
				};
				subtitles.push(subtitle);
			}
		}
		return subtitles;
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

	var lrcArr;
	var lcN, lcE;

	// Append full text.
	function APFT(e, d) {
		//console.log("APFT", e, d);
		var lrc = e.srt;
		if(d) {
			var t=document.getElementsByTagName("H1")[0];
			if(t)t=t.innerText;
			else t=document.title;
			downloadString(lrc, "text/plain", t+"."+(e.lang_code||"a")+".srt");
			return;
		}
		unsafeWindow.srtlrc=e;
		// parse
		var lrcs = parseSrtSubtitles(lrc);
		var span="";
		var lastTime=0;
		// concatenate
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
				+"<span class='ft-ln'>"+text+"</span>"
			lastTime = lI.startTime;
		}
		ftv.innerHTML=span;

		// attach ele to array
		lrcArr = lrcs;
		lcN = 0;
		var cc=0;
		var sz = ftv.childElementCount;
		for(var i=0;i<sz,cc<lrcArr.length;i++) {
			if(ftv.children[i].className==="ft-ln") {
				lrcArr[cc++].ele=ftv.children[i];
			}
		}
		window.lrcArr=lrcArr;
		//console.log(lrcArr);
	}

	//window.APFT = APFT;

    initBTN();

	unsafeWindow.yft_captions = []; // store all subtitle


	// trigger when loading new page
	// (actually this would also trigger when first loading, that's not what we want, that's why we need to use firsr_load === false)
	// (new Material design version would trigger this "yt-navigate-finish" event. old version would not.)
	var body = document.getElementsByTagName("body")[0];
	body.addEventListener("yt-navigate-finish", function (event) {
		if (is_video_page()&&autoFTM) {
			if(build_cc_menu()) {
				var st = YFT_mps;
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
		return getURLParameter('v');
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
		var url;
		if(e==0) {
			console.log("auto");
			url = get_auto_xml_url();
			console.log("auto", url);
		}
		e = yft_captions[e]
		if(e) {
			if(!e.srt)
			fetch(url||buildXmlurl(get_vid(), e.lang_code))
			.then(v => v.text())
			.then(v => (new window.DOMParser()).parseFromString(v, "text/xml"))
			.then(v => {
				v = buildSrtFromXML(v);
				e.srt = v;
				APFT(e, d)
			})
			else APFT(e, d)
		}
	}

	function buildMenu(e){
return `<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="${e.cid||0}">
	<div class="ytp-menuitem-icon"></div>
	<div class="ytp-menuitem-label">
		${e.lang_name}
	</div>
	<div class="ytp-menuitem-content">
		下载
	</div>
</div>`;
	}

	function menuic(e){
		var t = e.target;
		var i = parseInt(t.parentNode.getAttribute("tabindex"));
		if(i==i) {
			if(t.className==="ytp-menuitem-content") {
				// 下载
				pullLyrics(i, 1);
			} else {
				// 查看
				initYFT(120);
				pullLyrics(i);
			}
		}
		t.blur();
		if(!pinFTMenu) {
			YFT_mps.display="none";
		}
	}
	var lastVid;

	function build_cc_menu(src) {
		var vid = get_vid();
		if(vid==lastVid) {
			return false;
		}
		lastVid=vid;
		if(loadOnStart) {
			src=1;
		}
		// todo validify auto caption exists
		if(!YFT_menu&&unsafeWindow.movie_player) {
			var item = document.createElement("div");
			movie_player.appendChild(item);
			item.innerHTML = menuData;
			YFT_mps = item.style;
			YFT_menu = unsafeWindow.yft_cc;
			if(src==1&&!autoFTM) {
				YFT_mps.display = "none";
			}
		}
		if(YFT_menu) {
			YFT_menu.innerHTML = "";
			var list_url = `${baseUrl}?hl=en&v=${vid}&type=list`;
			console.log("loading_list::", list_url);
			makeRequest('GET',list_url, function (xhr) {
				// todo auto select if requested
				try{
					yft_captions = [];
					var tracks = xhr.responseXML.getElementsByTagName('track');
					xhr="";
					var autosel=-1;
					for (var i = 0, len = tracks.length, xml, ety; i <= len; i++) {
						if(i==0) {
							ety={lang_code:'AUTO',lang_name:'AUTO'}
						} else {
							xml = tracks[i-1];
							ety = {
								lang_code: xml.getAttribute('lang_code'),
								lang_name: xml.getAttribute('lang_original')
								||xml.getAttribute('lang_translated'),
								cid:i
							}
							if(src==1&&xml.getAttribute('lang_default')) {
								autosel=i;
								src=0;
							}
						}
						yft_captions.push(ety); // 加到 yft_captions, 待会靠它下载
						xhr+=buildMenu(ety);
					}
					if(src==1) {
						autosel=0;
					}
					console.log("autosel", autosel);
					YFT_menu.innerHTML=xhr;
					var cc = YFT_menu.children;
					for (var i = 0, len = cc.length; i < len; i++) {
						cc[i].onclick = menuic;
						if(autosel==i) {
							initYFT(120);
							pullLyrics(i);
						}
					}
				} catch(e) {console.log(e)}
			});
		} else {
			lastVid="";
		}
		return true;
	}

	// 处理时间. 比如 start="671.33"  start="37.64"  start="12" start="23.029"
	// 处理成 srt 时间, 比如 00:00:00,090    00:00:08,460    00:10:29,350
	function process_time(s) {
		s = s.toFixed(3);
		// 超棒的函数, 不论是整数还是小数都给弄成3位小数形式
		// 举个柚子:
		// 671.33 -> 671.330
		// 671 -> 671.000
		// 注意函数会四舍五入. 具体读文档

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
		e.class = 'dummy-element-for-tampermonkey-Youtube-Subtitle-Downloader-script-to-decode-html-entity';
		e.innerHTML = input;
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
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

	// Youtube return XML. we want SRT
	// input: Youtube XML format
	// output: SRT format
	function buildSrtFromXML(youtube_xml_string) {
		if (youtube_xml_string === '') {
			return false;
		}
		var text = youtube_xml_string.getElementsByTagName('text');
		var result = '';
		var BOM = '\uFEFF';
		result = BOM + result; // store final SRT result
		var len = text.length;
		for (var i = 0; i < len; i++) {
			var index = i + 1;
			var content = text[i].textContent.toString();
			content = content.replace(/(<([^>]+)>)/ig, ""); // remove all html tag.
			var start = text[i].getAttribute('start');
			var end = parseFloat(text[i].getAttribute('start')) + parseFloat(text[i].getAttribute('dur'));
			var new_line = "\n";
			result = result + index + new_line;
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
			result = result + end_time + new_line;
			// 00:00:01,939 --> 00:00:04,350

			content = htmlDecode(content);
			// turn HTML entity back to text. example: &#39; back to apostrophe (')

			result = result + content + new_line + new_line;
			// everybody Craig Adams here I'm a
		}
		return result;
	}

	function get_captionTracks() {
		var json = null
		if (unsafeWindow.youtube_playerResponse_1c7) {
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

	// https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
	function makeRequest(method, url, load) {
		return new Promise(function (resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.timeout = 2000;
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					if(load) {
						load(xhr);
						resolve('');
					} else {
						resolve(xhr.responseXML);
					}
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			};
			xhr.onerror = function () {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			xhr.send();
		});
	}
	async function getUrl(url) {
		return makeRequest("GET", url);
	}
})();