// ==UserScript==
// @name         総合ランキング追加＆表示タブ保存
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  総合ランキング追加
// @author       You
// @match        https://typing-tube.net/movie/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458290/%E7%B7%8F%E5%90%88%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E8%BF%BD%E5%8A%A0%EF%BC%86%E8%A1%A8%E7%A4%BA%E3%82%BF%E3%83%96%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/458290/%E7%B7%8F%E5%90%88%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E8%BF%BD%E5%8A%A0%EF%BC%86%E8%A1%A8%E7%A4%BA%E3%82%BF%E3%83%96%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

const romaRank = Array.from( document.getElementById("ranking_roma").firstElementChild.children )
const kanaRank = Array.from( document.getElementById("ranking_kana").firstElementChild.children )
const flickRank = Array.from( document.getElementById("ranking_flick").firstElementChild.children )
for(let i=0;i<romaRank.length;i++){
	romaRank[i] = romaRank[i].cloneNode(true)
	romaRank[i].querySelector('.player_ranking_name').insertAdjacentHTML('beforeend', ` <span class="roma-color">[ロマ]</span>`);
}
for(let i=0;i<kanaRank.length;i++){
	kanaRank[i] = kanaRank[i].cloneNode(true)
	kanaRank[i].querySelector('.player_ranking_name').insertAdjacentHTML('beforeend', ` <span class="kana-color">[かな]</span>`);
}
for(let i=0;i<flickRank.length;i++){
	flickRank[i] = flickRank[i].cloneNode(true)
	flickRank[i].querySelector('.player_ranking_name').insertAdjacentHTML('beforeend', ` <span class="flick-color">[フリック]</span>`);
}

const allRank = romaRank.concat(kanaRank).concat(flickRank)
//ランキングスコア取得


allRank.sort(function(a,b){
        if( parseFloat(a.textContent) > parseFloat(b.textContent) ) return -1;
        if( parseFloat(a.textContent) < parseFloat(b.textContent) ) return 1;
        return 0;
});
document.getElementById("status").insertAdjacentHTML('afterend',
`<div id="ranking_all" style="display: none;">
<ul class="list-group scroll"></ul>
</div>`);

const aaa = document.getElementById("ranking_all").firstElementChild
for(let i=0;i<allRank.length;i++){
	aaa.appendChild(allRank[i])
}
document.querySelector(".status .nav").children[0].textContent = 'all'
document.body.insertAdjacentHTML('afterend',`<style>
.status small{
display:none;
}
.roma-color{
color:#17a3b8d2!important;
}
.kana-color{
color:#de781fde!important;
}
.flick-color{
color:#59e04db6!important;
}
</style>
`)


document.querySelector(".status .nav").children[0].addEventListener('click' , event => {
		const SCORE_RANKINGS = document.querySelectorAll("div[id*=ranking]")
	for(let i=0;i<SCORE_RANKINGS.length;i++){
		SCORE_RANKINGS[i].style.display = 'none'
		}
		if(event.target.textContent == 'all'){
			document.getElementById("status").style.display = 'none'
			document.getElementById("ranking_all").style.display = 'block'
			localStorage.setItem('showRanking','all')
			if(is_played){
				event.target.textContent = 'status'
				event.target.style.opacity = 0.5
			}
	}else if(is_played){
		event.target.textContent = 'all'
		event.target.style.opacity = 0.5
		document.getElementById("status").style.display = 'block'
	}

})

	const NAVS = document.querySelector(".status .nav").children
	for(let i=1;i<NAVS.length;i++){
		NAVS[i].addEventListener('click', event => {
		const title = event.target.textContent
		const SCORE_RANKINGS = document.querySelectorAll("div[id*=ranking]")
		for(let i=0;i<SCORE_RANKINGS.length;i++){
			SCORE_RANKINGS[i].style.display = 'none'
		}
			document.getElementById(`ranking_${title}`).style.display = 'block'
			localStorage.setItem('showRanking',title)
		});
	}



function rankingTabsUnderlineEvent(){
	const NAVS = document.querySelector(".status .nav").children
	for(let i=0;i<NAVS.length;i++){
		NAVS[i].addEventListener('click', event => {
			const NAVS = document.querySelector(".status .nav").children
			for(let i=0;i<NAVS.length;i++){
				NAVS[i].classList.remove('underline')
			}
			event.target.classList.add('underline')
		});
	}
}
rankingTabsUnderlineEvent()


const showRanking = localStorage.getItem('showRanking')
if(showRanking == 'kana'){
	document.querySelector(".status .nav").children[2].click()
}else if(showRanking == 'flick'){
	document.querySelector(".status .nav").children[3].click()
}else if(showRanking == 'all'){
	document.querySelector(".status .nav").children[0].click()
}



document.querySelector(".status .nav").children[0].addEventListener('mouseover', event => {
	const underline = document.querySelector(".status .nav").children[0].className.includes('underline')
	if(is_played && underline){
		if(event.target.textContent == 'status'){
			event.target.textContent = 'all'
			event.target.style.opacity = 0.5
		}else{
			event.target.textContent = 'status'
			event.target.style.opacity = 0.5
		}
	}
}, false);

document.querySelector(".status .nav").children[0].addEventListener('mouseleave', event => {
	const underline = document.querySelector(".status .nav").children[0].className.includes('underline')
	if(is_played && underline){
		if(event.target.textContent == 'status'){
			event.target.textContent = 'all'
			event.target.style.opacity = 1
		}else{
			event.target.textContent = 'status'
			event.target.style.opacity = 1
		}
	}
}, false);


play_preparation = function (){
	OPTION_ACCESS_OBJECT['typing-effect-volume'] = document.getElementsByName('typing-effect-volume')[0].value/100
	OPTION_ACCESS_OBJECT['miss-effect-volume'] = document.getElementsByName('miss-effect-volume')[0].value/100
	OPTION_ACCESS_OBJECT['line-clear-effect-volume'] = document.getElementsByName('line-clear-effect-volume')[0].value/100
	OPTION_ACCESS_OBJECT['combo-break-effect-volume'] = document.getElementsByName('combo-break-effect-volume')[0].value/100
	OPTION_ACCESS_OBJECT['gameover-effect-volume'] = document.getElementsByName('gameover-effect-volume')[0].value/100


	const tooltip = document.querySelector('[role="tooltip"]')
	if(tooltip != null){
		tooltip.remove()
	}
	player.setPlaybackRate(play_speed);

	//ランキングのスコア取得
	for (let i = 0;i<ranking_length.length; i++) {ranking_array.push(parseFloat(ranking_length[i].textContent))};
	ranking_array = ranking_array.slice(ranking_array.lastIndexOf(ranking_array.find(element => element > 0)))

	if(!kana_mode){
		notes_list = roma_notes_list
		line_difficulty_data = line_difficulty_data_roma
		total_notes = total_notes_roma_mode
	}else{
		notes_list = kana_notes_list
		line_difficulty_data = line_difficulty_data_kana
		total_notes = total_notes_kana_mode
	}

	if(localStorage.getItem('challenge-enable') != "false" && play_mode == "normal"){
		combo_challenge_beatmap_data = localStorage.getItem("combo_challenge_beatmap_data") ? JSON.parse(localStorage.getItem("combo_challenge_beatmap_data")) : [];
		combo_challenge = true
		play_ID = location.href.match(/[0-9]+\.?[0-9]*/)[0]
		play_Name = document.querySelector(".movietitle h1").textContent
	}
	document.getElementById("time_settings").style.visibility = "visible"
	if(document.getElementById("time_settings2") != null){
		document.getElementById("time_settings2").style.visibility = "visible"
	}
	if(PHONE_FLAG){
		const shortcut_key_div = document.querySelectorAll("#shortcut > div")
		for(let i=0;i<shortcut_key_div.length;i++){
			shortcut_key_div[i].style.flexDirection = "column"
		}
	}
	if(document.getElementById("song_reset") != null){
		document.getElementById("song_reset").addEventListener("click",{name:"touch_restart", handleEvent:song_reset})
		document.getElementById("song_reset_F4").addEventListener("mouseover",function restart_underline(event){
			document.getElementById("restart").style.textDecoration = "underline"
		})
		document.getElementById("song_reset_F4").addEventListener("mouseout",function restart_underline_delete(event){
			document.getElementById("restart").style.textDecoration = ""
		})
		document.getElementById("speed_change_F10").addEventListener("mouseover",function restart_underline(event){
			document.getElementById("speed").style.textDecoration = "underline"
		})
		document.getElementById("speed_change_F10").addEventListener("mouseout",function restart_underline_delete(event){
			document.getElementById("speed").style.textDecoration = ""
		})

	}
	document.getElementById("speed_change").addEventListener("click",speed_change)
	document.getElementById("more_shortcutkey").addEventListener("click",view_shortcut_key)

	if(document.getElementById("combo_challenge") != null){
		document.getElementsByName('challenge-enable')[0].setAttribute("disabled","disabled")
	}
	document.getElementsByName('space-symbol-omit')[0].setAttribute("disabled","disabled")
	document.getElementsByName('margin-space-disable')[0].setAttribute("disabled","disabled")

	if(map_style != null){document.head.insertAdjacentHTML('beforeend',map_style[0]);}//譜面styleを適用


	document.querySelector("[onclick='play_speed_down()']").innerHTML = `<div style="position:relative;">-<span style="position: absolute;top: -0.8em;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);font-size:90%;">F9</span></div>`
	document.querySelector("[onclick='play_speed_up()']").innerHTML = `<div style="position:relative;">+<span style="position: absolute;top: -0.8em;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);font-size:84%;">F10</span></div>`
	speedbutton = document.getElementById("playBotton3").cloneNode(true)

	function resize_adjust(){
		if(!finished&&document.getElementsByName('play-scroll')[0].checked&&!navigator.userAgent.match(/(iPhone|iPod|iPad|Android.*Mobile)/i)){
			auto_scroll_flag = true
			window.scrollTo({top: (document.documentElement.scrollTop+CONTROLBOX_SELECTOR.getBoundingClientRect().top+CONTROLBOX_SELECTOR.clientHeight+Number(document.getElementsByName('scroll-adjustment')[0].selectedOptions[0].value)-document.documentElement.clientHeight)})
		}
	}
	window.addEventListener('resize',resize_adjust);

	SELECTOR_ACCESS_OBJECT['kashi'] = document.getElementById("kashi")
	SELECTOR_ACCESS_OBJECT['kashi_next'] = document.getElementById("kashi_next")
	SELECTOR_ACCESS_OBJECT['kashi_roma'] = document.getElementById("kashi_roma")
	SELECTOR_ACCESS_OBJECT['header'] = document.getElementsByTagName('header')[0]
	if(keyboard == "mac"){
		document.getElementById("song_reset_F4").style.visibility = "hidden"
		document.getElementById("speed_change_F10").style.visibility = "hidden"
		document.getElementById("more_shortcutkey").style.display = "none"
		if(!SELECTOR_ACCESS_OBJECT['flick-input']){
			create_flick_textbox()
		}
	}
	document.querySelector(".status .nav").children[0].textContent = 'status'
	const SCORE_RANKINGS = document.querySelectorAll("div[id*=ranking]")
	for(let i=0;i<SCORE_RANKINGS.length;i++){
		SCORE_RANKINGS[i].style.display = 'none'
	}

	const NAVS = document.querySelector(".status .nav").children
	for(let i=0;i<NAVS.length;i++){
		if(i == 0){
			NAVS[i].classList.add('underline')
		}else{
			NAVS[i].classList.remove('underline')
		}
	}

	SELECTOR_ACCESS_OBJECT['kashi'].classList.add('lyric_space');
	SELECTOR_ACCESS_OBJECT['kashi_next'].classList.add('lyric_space');
	SELECTOR_ACCESS_OBJECT['kashi'].classList.remove('text-white');
	SELECTOR_ACCESS_OBJECT['kashi'].classList.remove('mt-3');
	SELECTOR_ACCESS_OBJECT['kashi_next'].classList.remove('mt-3');
	SELECTOR_ACCESS_OBJECT['kashi_next'].classList.remove('text-muted');


	var skip_guide_total_time_html = document.createElement('div');
	skip_guide_total_time_html.setAttribute("id", "skip_guide_total_time");
	skip_guide_total_time_html.setAttribute("class", "bar_text");
	skip_guide_total_time_html.innerHTML = `<div id="skip-guide"></div><div id="total-time">00:00 / `+movie_mm+`:`+movie_ss+`</div>`
	SELECTOR_ACCESS_OBJECT['kashi_next'].parentNode.insertBefore(skip_guide_total_time_html, SELECTOR_ACCESS_OBJECT['kashi_next'].nextElementSibling);
	SELECTOR_ACCESS_OBJECT['skip-guide'] = document.getElementById("skip-guide")

	if(keyboard == "mac"){
		SELECTOR_ACCESS_OBJECT['skip-guide'].display = "none";
		SELECTOR_ACCESS_OBJECT['skip-guide'].insertAdjacentHTML('beforebegin', `<div id='flick-status'><span id="flick-score-value" style="font-weight:bold;">0.00</span> , miss: <span id="flick-miss-value">0</span> , lost: <span id="flick-lost-value">0</span></div>`);
		SELECTOR_ACCESS_OBJECT['flick-score-value'] = document.getElementById("flick-score-value")
		SELECTOR_ACCESS_OBJECT['flick-miss-value'] = document.getElementById("flick-miss-value")
		SELECTOR_ACCESS_OBJECT['flick-lost-value'] = document.getElementById("flick-lost-value")
		document.getElementById("kashi_area").addEventListener("click", flickModeTapSkip ,false)
	}else{
		SELECTOR_ACCESS_OBJECT['skip-guide'].addEventListener("click",press_skip,false)
	}

	SELECTOR_ACCESS_OBJECT['total-time'] = document.getElementById("total-time")


	var next_kpm_html = document.createElement('div');
	next_kpm_html.setAttribute("id", "next-kpm");
	next_kpm_html.setAttribute("style", "font-size:12.5px;font-weight: 500;text-align:left;");
	next_kpm_html.innerHTML = "&#8203;"
	SELECTOR_ACCESS_OBJECT['kashi_next'].parentNode.insertBefore(next_kpm_html, SELECTOR_ACCESS_OBJECT['kashi_next'].nextElementSibling);
	SELECTOR_ACCESS_OBJECT['next-kpm'] = document.getElementById("next-kpm")


	const remaining_time_create_html = "<span id='line-speed'>0.00打/秒</span> - <span id='remaining-time'>残り0.0秒</span>"
	var top_text_html = document.createElement('div');
	top_text_html.setAttribute("id", "top_flex_box");
	top_text_html.setAttribute("class", "bar_text");
	top_text_html.setAttribute("style", "font-family: sans-serif;font-weight: 600;");
	top_text_html.innerHTML = `<div id="combo-value" class="combo-counter-effect-color">&#8203;</div>
<div id="complete_effect" class="combo-counter-effect-color"></div>
<div id="line_remaining_time">`+remaining_time_create_html+`</div>`
	document.getElementById("bar_input_base").parentNode.insertBefore(top_text_html, document.getElementById("bar_input_base"));
	SELECTOR_ACCESS_OBJECT['combo-value'] = document.getElementById("combo-value")
	SELECTOR_ACCESS_OBJECT['remaining-time'] = document.getElementById("remaining-time")
	SELECTOR_ACCESS_OBJECT['line-speed'] = document.getElementById("line-speed")
	var complete_html = document.createElement("div");
	complete_html.setAttribute("id", "complete_effect");
	complete_html.setAttribute("class", "combo-counter-effect-color");
	complete_html_save = complete_html.cloneNode(true)

	var count_anime_html = document.createElement('div');
	count_anime_html.setAttribute("id", "count-anime");
	SELECTOR_ACCESS_OBJECT['kashi'].parentNode.insertBefore(count_anime_html, SELECTOR_ACCESS_OBJECT['kashi']);
	SELECTOR_ACCESS_OBJECT['count-anime'] = document.getElementById("count-anime")

	document.getElementById("bar_input_base").style.marginTop = "0";
	document.getElementById("bar_base").style.marginTop = "0";
	SELECTOR_ACCESS_OBJECT['kashi'].style.color=document.getElementsByName('lyric-color')[0].value;
	SELECTOR_ACCESS_OBJECT['kashi_next'].style.marginBottom="0";
	SELECTOR_ACCESS_OBJECT['kashi_next'].style.color=document.getElementsByName('next-lyric-color')[0].value;


	var kashi_roma_html = document.createElement('div');
	kashi_roma_html.setAttribute("id", "kashi_sub");
	kashi_roma_html.setAttribute("style", "font-weight:600;");
	kashi_roma_html.innerHTML = "&#8203;"
	SELECTOR_ACCESS_OBJECT['kashi_roma'].parentNode.insertBefore(kashi_roma_html, SELECTOR_ACCESS_OBJECT['kashi_roma'].nextElementSibling);
	SELECTOR_ACCESS_OBJECT['kashi_sub'] = document.getElementById("kashi_sub")
	SELECTOR_ACCESS_OBJECT['kashi_roma'].innerHTML = '&#8203;';
	SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('gothicfont')
	SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('gothicfont')
	if(SELECTOR_ACCESS_OBJECT['flick-input']){
		SELECTOR_ACCESS_OBJECT['kashi_sub'].style.display = "none"
		SELECTOR_ACCESS_OBJECT['kashi_next'].classList.add('kashi_omit')
		if(PHONE_FLAG){
			document.activeElement.blur()
			SELECTOR_ACCESS_OBJECT['flick-input-second'].focus()
			SELECTOR_ACCESS_OBJECT['flick-input'].focus()
			setTimeout(function(){
				document.activeElement.blur()
				SELECTOR_ACCESS_OBJECT['flick-input-second'].focus()
				SELECTOR_ACCESS_OBJECT['flick-input'].focus()
			},0)
		}
	}
	SELECTOR_ACCESS_OBJECT['kashi'].innerHTML = "<ruby>　<rt>　</rt></ruby>";
	SELECTOR_ACCESS_OBJECT['kashi_next'].innerHTML = "<ruby>　<rt>　</rt></ruby>";

	control_default_size=(document.documentElement.scrollTop+CONTROLBOX_SELECTOR.getBoundingClientRect().top+CONTROLBOX_SELECTOR.clientHeight)
	checkbox_effect_mod_open_play()
	checkbox_effect_play()
	starting_kashi_area()
}
