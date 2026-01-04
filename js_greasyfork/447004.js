// ==UserScript==
// @name         [Typing-Tube]動画インライン表示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  動画インライン表示を追加
// @author       You
// @match        https://typing-tube.net/movie/show/*
// @exclude      *?test=test*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447004/%5BTyping-Tube%5D%E5%8B%95%E7%94%BB%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447004/%5BTyping-Tube%5D%E5%8B%95%E7%94%BB%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==



document.getElementById("roma-mode-config").insertAdjacentHTML('beforebegin',`
<div id="inline-mode-config" style="display: block;">
        <h6>動画インライン設定</h6>
<label><input type="checkbox" id="movie-inline-mode" ${localStorage.getItem("RTC_InlineYT") == "true" ? "checked" : ""}> インラインモード有効</label>
<label><input type="checkbox" id="combatting-mode-inline" ${localStorage.getItem("Inherit_InlineMode") == "true" ? "checked" : ""}> 対戦時のみ有効</label>
<label><span style="
    display: flex;
"><input type="range" id="opacity_change" value=`+(+localStorage.getItem("YT_opacity")? localStorage.getItem("YT_opacity"):0.3)+` step="0.01" max="0.8">透過度　<input type="range" id="brightness_change" value=`+(+localStorage.getItem("YT_brightness")? localStorage.getItem("YT_brightness"):-1)+` step="0.01" max="0" min="-1">明度</span></label>
</div>
`)
    document.getElementById("movie-inline-mode").addEventListener("input", function(event){
		localStorage.setItem("RTC_InlineYT", event.target.checked)
		window.alert("インラインモードの設定が変更されました。ページをリロードします。")
		location.reload();
    });
    document.getElementById("combatting-mode-inline").addEventListener("input", function(event){
		localStorage.setItem("Inherit_InlineMode", event.target.checked)
		window.alert("インラインモードの設定が変更されました。ページをリロードします。")
		location.reload();
    });

	function Inline_Mode(){
		if(document.getElementById("player") != null && localStorage.getItem("RTC_InlineYT") == "true" && ((localStorage.getItem("Inherit_InlineMode") == "false" || !localStorage.getItem("Inherit_InlineMode")) || sessionStorage.getItem("RTC_Switch") == "true" && localStorage.getItem("Inherit_InlineMode") == "true")){
			if(sessionStorage.getItem("RTC_Switch") == "true"){
				document.getElementById("ranking_roma").style.cursor = "pointer"
				document.getElementById("ranking_roma").insertAdjacentHTML('afterbegin', `<span id="InlineMovieControl" class="`+(localStorage.getItem("RTCpreview") == "true" ? "video_pause":"video_play")+`" style="position: absolute;left: 0;right: 0;top:0;bottom:0;margin: auto;"></span>`)
			}
			document.querySelector(`[id*="youtube-movie-content"]`).style.opacity = document.getElementById("opacity_change").value

			document.getElementsByClassName("counter")[0].insertAdjacentHTML('afterend',`<style id="brightness">
#controlbox{
background:rgba(0, 0, 0,${Math.abs(document.getElementById("brightness_change").value)})!important;
}
</style>`)
			document.getElementById("ranking_roma").addEventListener("click",function(){
				if(event.target.tagName != "SPAN"){
					if(!is_played&&sessionStorage.getItem("RTC_Switch") == "true"){
						if(player.getPlayerState() == 1){
							player.pauseVideo()
							if(document.getElementById("InlineMovieControl") != null){
								document.getElementsByClassName("video_pause")[0].classList.add("video_play")
								document.getElementsByClassName("video_pause")[0].classList.remove("video_pause")

							}
						}else{
							player.playVideo()
							if(document.getElementById("InlineMovieControl") != null){
								document.getElementsByClassName("video_play")[0].classList.add("video_pause")
								document.getElementsByClassName("video_play")[0].classList.remove("video_play")

							}
						}
					}
				}
			})

			let style_tag = document.createElement('style');
			style_tag.innerHTML = `
#youtube-movie{
    position: absolute;
	width:auto!important;
}
#ranking{
    min-height: 140px;
}
`+(RTC_Switch ? `
.video_play {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    color: rgba(0,0,0,0.6);
    font-size: 136px;
}
.video_play::before {
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translateY(-50%);
    width: 0px;
    height: 0px;
    border: 0.3em solid transparent;
    border-left: 0.5em solid currentColor;
    box-sizing: border-box;
    content: "";
}
.video_pause {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    color:rgba(0,0,0,0.6);
    font-size: 136px;
}
.video_pause::before,
.video_pause::after {
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 0.1em;
    height: 0.5em;
    box-sizing: border-box;
    background-color: currentColor;
    content: "";
}


.video_pause::before {
    left: 40%;
}
.video_pause::after {
    left: 60%;
}



`:"")+`
[id*="youtube-movie-content"]{

    position: absolute;
    width:100%;
}
#player{
height:`+CONTROLBOX_SELECTOR.getBoundingClientRect().height+`px;
}
`
			let ScriptTag_style_tag = document.getElementsByTagName('script')[0];
			ScriptTag_style_tag.parentNode.insertBefore(style_tag, ScriptTag_style_tag);
			$('#controlbox').before($('#youtube-movie'));


			function player_adjust(){
				document.getElementById("player").style.height = CONTROLBOX_SELECTOR.getBoundingClientRect().height+"px"
				if(document.getElementById("movie_cover") != null){
					document.getElementById("movie_cover").style.height = CONTROLBOX_SELECTOR.getBoundingClientRect().height+"px"
					document.getElementById("movie_cover_black_layer").style.height = CONTROLBOX_SELECTOR.getBoundingClientRect().height+"px"
				}

			}
			window.addEventListener('resize', player_adjust);

			var observer = new MutationObserver(function(){
				player_adjust()
			});

			/** 監視対象の要素オブジェクト */
			const elem = CONTROLBOX_SELECTOR

			/** 監視時のオプション */
			const config = {
				childList: true,//「子ノード（テキストノードも含む）」の変化
				subtree: true
			};

			/** 要素の変化監視をスタート */
			observer.observe(elem, config);
			document.getElementsByClassName("share")[0].insertAdjacentHTML('afterbegin',``)
			document.querySelector(`[id*="youtube-movie-content"]`).style.opacity = document.getElementById("opacity_change").value
			CONTROLBOX_SELECTOR.style.background = "rgba(0, 0, 0,"+document.getElementById("brightness_change").value+")"

			CONTROLBOX_SELECTOR.style.background = "rgba(0, 0, 0,"+document.getElementById("brightness_change").value+")"

			document.getElementById("opacity_change").addEventListener("input",function(event){
				localStorage.setItem("YT_opacity",event.target.value)
				document.querySelector(`[id*="youtube-movie-content"]`).style.opacity = event.target.value
			})


			document.getElementById("brightness_change").addEventListener("input",function(event){
				localStorage.setItem("YT_brightness",event.target.value)
				document.getElementById("brightness").innerHTML = `
#controlbox{
background:`+"rgba(0, 0, 0,"+Math.abs(event.target.value)+")!important;"+`
}
`
			})

var videoid = window['onYouTubeIframeAPIReady'].toString().match(/videoId: '([^']+)'/)[1]
 document.getElementById("player").setAttribute("style","max-width:100%!important;")
onYouTubeIframeAPIReady = function () {

        player = new YT.Player('player', {
			width:"100%",
          playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            rel: 0,
            origin: location.protocol + '//' + location.hostname + "/"
          },
          videoId: videoid,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
            'onPlaybackRateChange': onPlayerPlaybackRateChange,
          }
        });
        player.difftime = 0.0;
      }
		}
	}
	Inline_Mode()