// ==UserScript==
// @name         Typing Tube Editページに便利機能を追加 vol.2
// @namespace    https://typing-tube.net/
// @version      5.2
// @description  思いつく限りの便利機能を詰め込みました。
// @match        https://typing-tube.net/movie/edit*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/422402/Typing%20Tube%20Edit%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E4%BE%BF%E5%88%A9%E6%A9%9F%E8%83%BD%E3%82%92%E8%BF%BD%E5%8A%A0%20vol2.user.js
// @updateURL https://update.greasyfork.org/scripts/422402/Typing%20Tube%20Edit%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E4%BE%BF%E5%88%A9%E6%A9%9F%E8%83%BD%E3%82%92%E8%BF%BD%E5%8A%A0%20vol2.meta.js
// ==/UserScript==
var authenticity_token_command_kakasi_en = window['command_kakasi_en'].toString().match(/'authenticity_token' : '([^']+)'/)[1]
command_kakasi_en = function (nextWordFlag) {
	let words = ""
	if(!nextWordFlag){
		words = document.getElementById("words").value;
	}else{
		words = document.getElementById("lyric_text").value.split(/\n/).slice(0,1)[0];
	}
	words = words.replace(/<ruby>.*?<rt>(.*?)<\/rt><\/ruby>/g, function(whole,b){return b;});
	words = words.replace(/\s+$/g, "");
        $.ajax({
          type: 'POST',
          data: {
            's': words,
            'authenticity_token' : authenticity_token_command_kakasi_en
          },
          url:"/api/kakasi_en",
            success:function (data){
				if(!nextWordFlag){
					document.getElementById("kana").value = data.replace(/([^!-~])(\s)/g ,"$1").replace(/(\s)([^!-~])/g ,"$2")
				}else{
					next_word_kana = data.replace(/([^!-~])(\s)/g ,"$1").replace(/(\s)([^!-~])/g ,"$2");
				}
			},
            error:function() {
              console.log("kanaの作成に失敗しました");
            }
        });
        return false;
      }

var authenticity_token_command_kakasi = window['command_kakasi'].toString().match(/'authenticity_token' : '([^']+)'/)[1]
command_kakasi = function (nextWordFlag) {
	let words = ""
	if(!nextWordFlag){
		words = document.getElementById("words").value;
	}else{
		words = document.getElementById("lyric_text").value.split(/\n/).slice(0,1)[0];
	}
	words = words.replace(/<ruby>.*?<rt>(.*?)<\/rt><\/ruby>/g, function(whole,b){return b;});
	words = words.replace(/\s+$/g, "");
        $.ajax({
          type: 'POST',
          data: {
            's': words,
            'authenticity_token' : authenticity_token_command_kakasi
          },
          url:"/api/kakasi",
            success:function (data){
				if(!nextWordFlag){
					document.getElementById("kana").value = data.replace(/～/g ,"ー");
				}else{
					next_word_kana = data.replace(/～/g ,"ー");
				}
            },
            error:function() {
              console.log("kanaの作成に失敗しました");
            }
        });
        return false;
      }

speed = 1
let next_time = 0
let Editor_css = document.createElement('style')
Editor_css.type = 'text/css';
Editor_css.innerHTML =
`

#main_content{
margin-top:6rem;
}
#lyric_text {
    resize:both!important;
    background: rgba(0, 0, 0, 0.2);
}
[style="max-height: 450px; overflow-y: scroll;"]{
position:relative;
top:0;
left:0;
}
/*102px*/
body{
    overflow-x: hidden;
    overflow-y: scroll;
zoom:90%;
}
.bg-info_select{
background-color: #2fa098!important;
border:solid;
}
.bg-info_select_stop{
background-color: #607D8B!important;
border:solid;
}
.content{
    padding-top:0px!important;
}


/*3rem)*/
.mt-5, .my-5 {
    margin-top: 0!important;
}
.pointer:hover{  cursor: help;text-decoration : underline;}
/*padding:1rem 1.5rem; vertical-align: top;)*/
.table td, .table th {
    padding:0!important;
    vertical-align:inherit;
    }


.row{
max-height:600px!important;
}


.wrapper{
    display:none!important;
}


#mod-setting{
    position: absolute;
    right: 7px;
    bottom: -2px;
    font-size: 1.5rem;
}

footer{
    display: none !important;

}
body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
body::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}
body::-webkit-scrollbar-thumb {
  background-color: #dfdfdf;
  border-radius: 10px;
}

[onclick='command_ruby();return false']{
    border-color: gray;
}
.gray{
    color: gray;
}
[onclick='command_ruby();return false']:hover{
    border-color: gray;
}
#volume {
  -webkit-appearance: none;
  background: transparent;
  margin-right: 10px;
  width: 100px;
  position: relative;
  top: 2px;
  right: 20px;
}

#volume:focus {
  outline: none;
}

#volume::-webkit-slider-runnable-track {
  height: 1.5rem;
  margin: 0;
  width: 100%;
  background: linear-gradient(
    to bottom right,
    transparent 50%,
    #00000066 50%
  );
}

#volume::-moz-range-track {
  height: 1.5rem;
  margin: 0;
  width: 100%;
  background: linear-gradient(
    to bottom right,
    transparent 50%,
     #00000066 50%
  );
}


#volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1.9rem;
  width: 0.5rem;
  background: #ffffffb1;
  border: 1px solid;
  margin-top: -3px;
  border-radius: 3px;
}



#volume::-moz-range-thumb {
  -webkit-appearance: none;
  height: 1.9rem;
  width: 0.5rem;
  background: #ffffffb1;
  border: 1px solid;
  border-radius: 3px;
  margin-top: 0;
}

#volume:focus::-moz-range-thumb {
  box-shadow: 0px 0px 7px 3px #0065c4;
}












#mod-menu{
color:#fff;
z-index:102;
display:none;
position:fixed;
word-break: break-all;
max-height: 900px;
background-color: rgba(0,0,0,0.96);
right:0px;
top:70px;
}
#osusume{
position:absolute;
right:130px;
bottom:10px;
margin-right:5px;
z-index:3;
background:#333;
}
#mod-menu label:not(.default-pointer),#mod-menu details,#mod-menu button,#mod-menu .color,#mod-menu select,.col-6 label,.status .nav-fill,.cursor-pointer{cursor: pointer;}
#mod-menu label{margin-right: 5px;}
#modal-open:hover,.pointer:hover{  cursor: pointer;text-decoration : underline;}
.help_pointer:hover{  cursor: help;text-decoration : underline;}
.caret:hover{  cursor: text;    background: #ffffff45;
    border-radius: 3px;}
.ui-dialog-buttonset button:last-of-type{opacity:0.5;zoom:70%;}
.fa-cog:hover{transform:rotate(90deg);}
/*タブのスタイル*/
.tab-item {
  width: calc(100%/4);
  height: 30px;
  line-height: 30px;
  overflow:hidden;
  font-size: 16px;
  text-align: center;
  color: #565656;
  display: block;
  float: left;
  text-align: center;
  transition: all 0.2s ease;
  margin:0px!important;
  border-left: 1px solid #fff;
  border-top: 1px solid #fff;
  border-bottom:2px solid #aaa;

}
.form-control {
    border-width: 0 0 1px;
    padding-left: 1px;
    padding-right: 1px;
    resize: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -ms-overflow-style: none;
}
.p-0 {
    padding: 0!important;
}
.form-control-sm {
    padding: .25rem .55rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: 0;
}

#kana-mode-config{
display:none;
margin: 0 10px 0 10px;
}
#font-option-container{
display:flex;
width: fit-content;
flex-direction: column;

}
#font-option-container label{
margin:0;
width:280px;

}
#font-size-reset{
margin:10px;
width:97%;
}
#character-scroll-length-reset{
margin: 0 0px 0px 15px!important;
display: none;
}
[name="skip-guide-key"]{
margin-left: 10px;
position: relative;
bottom: 3px;
}
#line-clear-gauge-effect-option{
display:flex;
justify-content: flex-start;
flex-direction: column;
}
#setting-reset{
position:absolute;
right:10px;
bottom:10px;
background:#333;
}
.mod-menu-round-wrapper{
    border: solid thin;
    padding-left: 1rem;
    transform: scale(0.9);
    border-radius: 30px;
}
.colorChooser {

    top: -130px;
zoom:80%;
}
.tab-item:hover{
    border-left: 1px solid #ffcd05!important;
    border-top: 1px solid #ffcd05!important;

  color: #ffcd05!important;
}
[for="etc"]{
    border-right: 1px solid #fff;
}
[for="etc"]:hover{
    border-right: 1px solid #ffcd05!important;

}
[for="all"]:hover~[for="design"],
[for="design"]:hover~[for="playcolor"],
[for="playcolor"]:hover~[for="etc"],
[for="etc"]:hover~.solid
{
    border-left: 1px solid #ffcd05!important;

}
.mod-tab-content-description{
    white-space: nowrap;
border-bottom:1px solid #fff;
border-left:1px solid #fff;
border-right:1px solid #fff;
overflow: scroll;
max-height: 380px;
display:flex;
flex-direction: column;
}

.mod-tab-content-description h6{
margin-bottom: 8px;
margin-left: 10px;
}
.mod-tab-content-description label {
margin-left: 10px;
display:block;
}
.mod-tab-content-description label input {
margin-right: 5px;
margin-left: 5px;
}
form #mod-menu p {
    margin-bottom: 0;
}
/*ラジオボタンを全て消す*/
input[name="tab-item"],input[name="input_page"],input[name="details"] {
  display: none;
}

/*タブ切り替えの中身のスタイル*/
.mod-tab-content,
.page_content{
  display: none;
  clear: both;

}
        select {
        font-weight: 600;
        padding: 5px 8px;
        width: 130%;
        color:#FFF;
        box-shadow: none;
        background-color: #000000CC;
        background-image: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        width: auto;
        }
        select:focus {
        outline: none;
        }
        select:hover{
        background:#1E90FF;
        }
        option{
        background:#333;
        color:#FFF;
       }
.mod-tab-content h6{
padding-top: 10px;
}
.input_page{
margin-bottom:2px;
padding-top: 7.5px;
margin-left: 0px!important;

}
.input_page:hover{
text-decoration: underline;
}
.folded-luled-line{
    font-size: 1.5rem;
    position: relative;
    bottom: 6px;
    left: 3px;
    font-family: cursive;
}
.three-digits[type=number]{
width: 46px;
}
.four_digits[type=number]{
width: 50px;
}
.sound-effect-list{
    display: flex;
    align-items: center;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
cursor:pointer;
}
.mod-tab-content [id*='config']:not(:first-of-type){
border-top-style: inset;
}
#status-config{
margin-bottom:10px;
}
.mod-tab-content-description > [id*='config']:last-of-type{
margin-bottom:30px;
}
.mod-tab-content [id*='config']{
margin:0 10px 0 10px;
}
#input-config h6{
margin-right:10px;
}
#miss-limit-mode-config{
    justify-content: flex-start;
    align-items: flex-end;
    margin-bottom: 4px;
}
#character-scroll-config{
    justify-content: flex-start;
    align-items: center;
}
#difficult > span > span:nth-of-type(-n+4) {
    margin-right: 0.9rem;
}
.EntrySymbol{
margin-bottom:0.5rem;
}
.AppearanceSymbol {
    font-size: large;
}
.SymbolColumn{
display: inline-flex;
flex-direction: column;
}
.SymbolColumn:not(:last-child){
margin-right:3rem;
}
/*選択されているタブのコンテンツのみを表示*/
#all:checked ~ #all-content,
#design:checked ~ #design-content,
#playcolor:checked ~ #playarea-color-content,
#etc:checked ~ #etc-content,
#page1:checked ~ #page1_content,
#page2:checked ~ #page2_content{
  display: block!important;
}

/*選択されているタブのスタイルを変える*/
input:checked + .tab-item {
border-bottom:hidden;

  color: #fff!important;
}
input:checked + .input_page {

  color: #919395!important;
}
#modal-overlay{
z-index:101;display:none;position:fixed;top:0;left:0;width:100%;height:120%;
}

#mask {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 104;
}

#modal {
  background: #fff;
  color: #555;
  width: 520px;
  padding: 25px;
  border-radius: 4px;
  position: fixed;
  top: 270px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 105;
}
#mask.hidden {
  display: none;
}

#modal.hidden {
  display: none;
}
.rgba-color-scroll-padding{
padding-bottom:130px;
    padding-top: 60px;
}
.c-txtsp{
    margin-bottom: 0;
}
#mod-menu .btn-link{
margin:0;
}
`
document.getElementsByTagName('HEAD').item(0).appendChild(Editor_css);
function esc_play_movie(){
	if(event.key=="Escape"){//Escでポーズ解除
		player.playVideo()
		event.preventDefault();
	}
}
skip_play = function (time,select_time_stop) {
          headtime = parseFloat(time);
          player.seekTo(time);
          player.playVideo();
              if(event.ctrlKey && !select_time_stop){
                  input_flag = true
              }else{
                  input_flag = false
              }
	last_seek = time
	createjs.Ticker.removeEventListener("tick", playheadUpdate);
}

onPlayerStateChange = function (event) {
	if(document.activeElement.id == "player"){
		document.activeElement.blur();
	}
	switch(event.data){


		case 1: //再生(player.playVideo)
			createjs.Ticker.addEventListener("tick", playheadUpdate);
			window.removeEventListener('keydown',esc_play_movie,true)
			createjs.Ticker.framerate = 60;
			if(!word_input.value){
				add_next_wordset()
			}
			break;
		case 2: //一時停止(player.pauseVideo)
		case 0://終了(player.stopVideo)
			createjs.Ticker.removeEventListener("tick", playheadUpdate);
			reset_color_line();
			window.addEventListener('keydown',esc_play_movie,true)
			break;


		case 3: //再生時間移動 スキップ(player.seekTo)
			playheadUpdate()
			setBgBlueColor()
			break;
	}
}


let Timing_input
let rubyButtonFlag = false
function html_create(){
	const MODAL_OVERLAY= document.createElement('div');
	MODAL_OVERLAY.setAttribute("id", "modal-overlay");
	MODAL_OVERLAY.setAttribute("style", "display:none;");
	document.body.appendChild(MODAL_OVERLAY);
	document.getElementsByClassName("content")[0].insertAdjacentHTML('afterbegin',`
<form id="mod-menu" style="width: 580px; display: none;"><input id="all" type="radio" name="tab-item" checked="">
  <label class="tab-item" for="all">入力</label>
  <input id="design" type="radio" name="tab-item">
  <label class="tab-item" for="design">エフェクト</label>
  <input id="playcolor" type="radio" name="tab-item">
  <label class="tab-item" for="playcolor">配色</label>
  <input id="etc" type="radio" name="tab-item">
  <label class="tab-item" for="etc">その他</label>
  <div class="mod-tab-content" id="all-content">
    <div class="mod-tab-content-description"><span style="float: right;color: #FFFFFF33;text-align: end;padding-right: 5px;">ver 2.1.7</span>

      <div id="preparation-config">
        <h6>時間調整</h6>
        <div style="
    display: flex;
    align-items: baseline;
">
          <label class="mod-menu-round-wrapper default-pointer" title="プレイ中に変更できる時間調整の初期値を変更します。">全体時間調整
            <span class="btn btn-link cursor-pointer" title="タイミングが遅くなります。SHIFTキーを押しながらクリックすると-0.1します。" id="initial-time-diff-minus">-</span>
            <span name="initial-time-diff" class="caret" contenteditable="true">0.00</span>
            <span class="btn btn-link cursor-pointer" title="タイミングが早くなります。SHIFTキーを押しながらクリックすると+0.1します。" id="initial-time-diff-plus">+</span>
          </label>
          <button type="button" id="initial-time-diff-reset" class="btn btn-light mx-3 mb-3">時間調整をリセット</button>
        </div>
      </div>

      <div id="sound-config">
        <h6>効果音・音量</h6>
        <span class="d-flex">
          <span class="sound-effect-list">
            <label title="正解打鍵をした時に効果音がなるようになります。">
              <input class="three-digits during-play-option" type="checkbox" name="typing-sound-effect">打鍵音</label>
            <label class="sound-effect-volume">
              <input class="three-digits during-play-option" type="number" name="typing-effect-volume" min="0" max="100" value="70" style="display: none;">
            </label>
          </span>
          <span class="sound-effect-list d-flex">
            <label title="ミス打鍵をした時に効果音がなるようになります。">
              <input class="three-digits during-play-option" type="checkbox" name="miss-sound-effect">ミス音</label>
            <label title="行頭のミス打鍵時もミス音を鳴らします" id="miss-sound-effect-beginning-line" style="display:none;">
              <input class="during-play-option" type="checkbox" name="miss-beginning-sound-effect">行頭のミス音</label>
            <label class="sound-effect-volume">
              <input class="three-digits during-play-option" type="number" name="miss-effect-volume" min="0" max="100" value="70" style="display: none;">
            </label>
          </span>
        </span>
        <span class="d-flex">
          <span class="sound-effect-list">
            <label title="ライン中のタイピングワードをすべて入力した時に効果音がなるようになります。">
              <input class="three-digits during-play-option" type="checkbox" name="clear-sound-effect">クリア音</label>
            <label class="sound-effect-volume" style="margin-left: -3px;">
              <input class="three-digits during-play-option" type="number" name="line-clear-effect-volume" min="0" max="100" value="70" style="display: none;">
            </label>
          </span>
          <span class="sound-effect-list">
            <label title="100コンボ以上コンボが続いている時にミスをすると、効果音が鳴るようになります">
              <input class="three-digits during-play-option" type="checkbox" name="combo-break-sound">100コンボ以上のミス音</label>
            <label class="sound-effect-volume">
              <input class="three-digits during-play-option" type="number" name="combo-break-effect-volume" min="0" max="100" value="70" style="display: none;">
            </label>
          </span>
        </span>
        <label title="動画音量に合わせて効果音音量も変更されます。無効にすると効果音毎に個別で音量の指定ができます。">
          <input class="during-play-option" type="checkbox" name="sound-effect-interlocking-youtube-volume" checked="">動画音量と効果音音量を連動</label>
      </div>
    </div>
  </div>
  <div class="mod-tab-content" id="design-content">
    <div class="mod-tab-content-description rgba-color-scroll-padding" style="padding-top:20px;">
      <div id="input-config">
        <h6>タイピングワード表示</h6>
        <label title="タイピングワードが一行に収まるように表示され、指定の文字数入力するとワードがスクロールされていきます。">
          <input class="during-play-option" type="checkbox" name="character-scroll">タイピングワードをスクロール表示
          <button type="button" id="character-scroll-length-reset" class="btn btn-light m-3" style="display: none;">スクロール数をリセット</button>
        </label>
        <div id="character-scroll-config" style="display:none;"><span class="folded-luled-line">└</span>
          <label class="mod-menu-round-wrapper default-pointer">かな表示スクロール数
            <span>
              <span class="btn btn-link cursor-pointer" id="kana-scroll-length-minus">-</span>
              <span name="kana-scroll-length" class="caret during-play-option" contenteditable="true">10</span>
              <span class="btn btn-link cursor-pointer " id="kana-scroll-length-plus">+</span>
            </span>
          </label>
          <label class="mod-menu-round-wrapper default-pointer">ローマ字表示スクロール数
            <span>
              <span class="btn btn-link cursor-pointer" id="roma-scroll-length-minus">-</span>
              <span name="roma-scroll-length" class="caret during-play-option" contenteditable="true">16</span>
              <span class="btn btn-link cursor-pointer" id="roma-scroll-length-plus">+</span>
            </span>
          </label>
        </div>
        <label title="2文字以上連続で続く英単語・数字・記号をスペースひらがな区切りでハイライトします。">
          <input class="during-play-option" type="checkbox" name="character-word-highlight">英単語・数字記号毎にハイライト表示(ひらがな表示のみ対応)</label>
      </div>
      <div id="effect-config">
        <h6>エフェクト設定</h6>
        <div class="d-flex">
          <label title="ミスをした文字の上に「・」マークが表示されます。">
            <input class="during-play-option" type="checkbox" name="miss-mark-effect" checked="">ミスエフェクト</label>
          <label>
            <input class="color during-play-option" value="#FF3554" name="miss-effect-color" style="background-color: rgb(255, 53, 84); color: rgb(255, 255, 255);"><span class="colorChooser"></span>色で表示</label>
        </div>
        <div class="d-flex">
          <label title="３・２・１・GO!のカウントダウンが表示されます。間奏中に歌詞がある場合は表示されません。">
            <input class="during-play-option" type="checkbox" name="countdown-effect" checked="">カウントダウン</label>
          <label>
            <input class="color during-play-option" value="rgba(255,255,255,0.9)" name="countdown-effect-color" style="background-color: rgba(255, 255, 255, 0.9); color: rgb(0, 0, 0);"><span class="colorChooser"></span>色で表示</label>
        </div>
        <div class="d-flex">
          <label title="スキップ可能な時に「Type ~ key to skip. ⏩」と表示されるようになります。表示されているときにスペースキー又はEnterキーを押すとライン切り替わり1秒前にスキップします。">
            <input class="during-play-option" type="checkbox" name="skip-guide-effect" checked="">
            <span style="margin:0 6.5px;">任意スキップ</span>
          </label>
          <label>
            <input class="color during-play-option" value="rgba(255,255,255,0.53)" name="skip-guide-effect-color" style="background-color: rgba(255, 255, 255, 0.53); color: rgb(0, 0, 0);"><span class="colorChooser"></span>色で表示</label>
          <select class="during-play-option" name="skip-guide-key" title="スキップ機能で使用するキーを設定できます。">
            <option value="skip-guide-space-key" selected="">スペースキー</option>
            <option value="skip-guide-enter-key">Enterキー</option>
          </select>
        </div>
        <div class="d-flex">
          <label title="タイピングエリアの左上に現在コンボを表示します。">
            <input class="during-play-option" type="checkbox" name="combo-counter-effect" checked="">
            <span style="margin: 0 12.5px;">コンボ表示</span>
          </label>
          <label>
            <input class="color during-play-option" value="#FFFFFF" name="combo-counter-effect-color" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);"><span class="colorChooser"></span>色で表示</label>
        </div>
        <div id="line-clear-gauge-effect-option">
          <label title="動画下にラインクリア率ゲージを表示します。達成したクリア率に応じた色のトロフィーも表示されます。">
            <input class="during-play-option" type="checkbox" name="line-clear-gauge-effect">ラインクリア率ゲージ</label>
          <button style="margin:10px;" class="btn btn-light" type="button" id="effect-color-reset">エフェクト色をリセット</button>
        </div>
      </div>
      <div id="lyric-font-color-config">
        <h6>歌詞の色/表示</h6>
        <div class="d-flex">
          <label>
            <span style="margin: 0 13px;">入力後</span>
            <input class="color during-play-option" value="#0099CC" name="correct-word-color" style="background-color: rgb(0, 153, 204); color: rgb(255, 255, 255);"><span class="colorChooser"></span>
          </label>
          <label>ラインクリア
            <input class="color during-play-option" value="#1eff52" name="line-clear-color" style="background-color: rgb(30, 255, 82); color: rgb(255, 255, 255);"><span class="colorChooser"></span>
          </label>
        </div>
        <div class="d-flex">
          <label>先頭の文字
            <input class="color during-play-option" value="#FFFFFF" name="next-character-color" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
          <label>
            <span style="margin: 0 19.5px;">未入力</span>
            <input class="color during-play-option" value="#FFFFFF" name="word-color" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
        </div>
        <div class="d-flex">
          <label>
            <span style="margin: 0 19.5px;">歌詞</span>
            <input class="color" value="#FFFFFF" name="lyric-color" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
          <label style="margin-right: -10px;">
            <span style="margin: 0 12.5px;">次の歌詞</span>
            <input class="color during-play-option" value="rgba(255,255,255,.7)" name="next-lyric-color" style="background-color: rgba(255, 255, 255, 0.7); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
        </div>
        <div class="d-flex">
          <label style="cursor:default;">
            <span style="margin:0 0.8px;">次の歌詞：</span>
            <select class="during-play-option" style="width:156px;" name="next-lyric-display-option" title="次の歌詞に表示する内容を設定できます。">
              <option value="next-text-lyric" selected="">歌詞</option>
              <option value="next-text-kana">よみ</option>
            </select>
          </label>
          <label style="cursor:default;">
            <span style="cursor:default;margin: 0 8px;">自動変更：</span>
            <select style="width: 156px;margin-left:-6px;" name="color-preset">
              <option value="プリセット">プリセットから色変更</option>
              <option value="デフォルト">デフォルト</option>
              <option value="先頭の文字を赤く強調">先頭の文字を赤く強調</option>
              <option value="打つと消える">打つと消える</option>
              <option value="入力スタイル">入力スタイル</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="mod-tab-content" id="playarea-color-content">
    <div class="mod-tab-content-description rgba-color-scroll-padding">
      <p class="c-txtsp"></p>
      <div id="playarea-color-config">
        <h6>背景カラー</h6>
        <label style="width: fit-content;">タイピングエリア
          <input class="color" value="transparent" name="playarea-color" id="input2" style="background-color: transparent; color: rgb(0, 0, 0);"><span class="colorChooser"></span>
        </label>
        <button type="button" style="width: 97%;" id="playarea-color-reset" class="btn btn-light m-3">背景カラーをリセット</button>
      </div>
      <div id="line-color-config">
        <h6>ラインカラー</h6>
        <div class="d-flex">
          <label>
            <span style="margin: 0 4px;">ラインゲージ</span>
            <input class="color" value="#17a2b8" name="phrase-line-color" style="background-color: rgb(23, 162, 184); color: rgb(255, 255, 255);"><span class="colorChooser"></span>
          </label>
          <label>
            <span style="margin: 0 4px;">empty</span>
            <input class="color" value="#f5f5f5" name="phrase-line-empty-color" style="background-color: rgb(245, 245, 245); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
        </div>
        <div class="d-flex">
          <label>ラインゲージ2
            <input class="color" value="#ffc107" name="movie-line-color" style="background-color: rgb(255, 193, 7); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
          <label>empty2
            <input class="color" value="#f5f5f5" name="movie-line-empty-color" style="background-color: rgb(245, 245, 245); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
        </div>
        <button type="button" style="width: 97%;" id="line-color-reset" class="btn btn-light m-3">ラインカラーをリセット</button>
      </div>
      <div id="etc-color-config">
        <h6>その他の文字色</h6>
        <div style="display:flex;flex-direction: column;width: fit-content;">
          <label>
            <span style="margin: 0 7px;">ステータスエリア</span>
            <input class="color" value="#FFFFFF" name="status-area-color" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);"><span class="colorChooser"></span>
          </label>
        </div>
        <button type="button" style="width: 97%;" id="status-area-color-reset" class="btn btn-light m-3">ステータスエリア色をリセット</button>
      </div>
    </div>
  </div>
  <div class="mod-tab-content" id="etc-content">
    <div class="mod-tab-content-description">
      <p class="c-txtsp"></p>
      <div id="play-scroll-config">
        <h6>自動スクロール設定</h6>
        <label title="プレイ開始時やプレイ中の拡大値を変更したとき、自動でプレイエリアにスクロール位置が調整されます。プレイ開始時は画面内に動画が表示されていないと発動されません。">
          <input class="during-play-option" type="checkbox" name="play-scroll">プレイ開始時にスクロール位置を調整</label>
        <div id="adjust-config" style="display: none; align-items: center;"><span class="folded-luled-line">└</span>
          <select style="margin: 0 13px;position: relative;bottom: 5px;" name="scroll-adjustment" class="during-play-option">
            <option value="55" selected="">中央</option>
            <option value="75">上揃え</option>
            <option value="-10">下揃え</option>
          </select>
        </div>
      </div>
      <div id="status-config">
        <h6>status表示設定</h6>
        <div id="status-mode" class="d-flex">
          <label title="歌詞タイピングエリアを左側、status/rankingエリアを右側に表示します。歌詞タイピングエリアは狭くなりますが動画全体も表示しやすくなります。">
            <input class="during-play-option" type="radio" name="status-mode" value="status-mode-default" checked="">折り返さない</label>
          <label title="歌詞タイピングエリアを上部全体で表示、status/rankingエリアを下部に表示します。動画が見切れやすくなりますが歌詞タイピングエリアが広くなりプレイしやすくなります。">
            <input type="radio" name="status-mode" value="status-mode-wrap">折り返す</label>
        </div>
        <input id="details" type="checkbox" name="details">
<details style="margin-left: 16px;">
  <summary>詳細設定</summary>
          <div class="d-flex" style="padding-top:7px;">
            <label>
              <input type="checkbox" name="visibility-score" checked="">スコア</label>
            <label style="margin: 0 36px;">
              <input type="checkbox" name="visibility-miss" checked="">ミス</label>
            <label style="margin: 0px -8px;">
              <input type="checkbox" name="visibility-escape-counter" checked="">逃した文字数</label>
            <label style="margin: 0px 24px;">
              <input type="checkbox" name="visibility-typing-speed" checked="">打鍵速度</label>
          </div>
          <div class="d-flex">
            <label>
              <input type="checkbox" name="visibility-rank" checked="">現在の順位</label>
            <label>
              <input type="checkbox" name="visibility-correct">正確率</label>
            <label>
              <input type="checkbox" name="visibility-type-counter" checked="">正解打鍵</label>
            <label style="margin: 0 38px;">
              <input type="checkbox" name="visibility-remaining-line-counter" checked="">残りライン</label>
          </div>
        </details></div>

      <div id="result-config">
        <h6>リザルト設定</h6>
        <div class="flex-column">
		<div class="d-flex">
          <label>
            <input type="radio" class="during-play-option" name="word-result" value="word-result" checked="">ミスをした箇所を赤く表示</label>
          <label>
            <input name="word-result" type="radio" value="word-result-real">ミスをした文字を詳細に表示</label>
		</div>
		<div>
          <label>
            <input type="checkbox" class="during-play-option" name="not-submit-score">任意でランキング登録</label>
		</div>
        </div>
      </div>

       <div id="shortcutkey-config">
        <h6>ショートカットキー設定</h6>
          <label><input class="during-play-option" type="checkbox" name="disable-left-right-shortcut">時間調整のショートカットキー(← →)を無効化</label>
	      <label><input class="during-play-option" type="checkbox" name="disable-up-down-shortcut">音量調整のショートカットキー(↑ ↓)を無効化</label>
		  <label><input class="during-play-option" type="checkbox" name="disable-change-mode">ローマ⇔かな入力切り替えショートカットキー(Alt+kana)を無効化</label>
       <div id="change-mode-config" style="display:flex;align-items:center;"><span class="folded-luled-line">└</span>
          <label>かな入力モード選択時に切り替えるローマ字表示<select style="margin: 0 13px;" name="from-kana-mode-change">
            <option value="from-kana-display" selected="">かな表示</option>
            <option value="from-roma-display">ローマ字表示</option>
          </select></label>
        </div>
      </div>
    </div>
  </div>
  <button type="button" id="setting-reset" class="btn btn-light">設定をリセット</button></form>
`);

	const RUBY = document.querySelector("[onclick='command_ruby();return false']")
	RUBY.setAttribute("disabled","")
	RUBY.lastElementChild.classList.add("gray")
	document.addEventListener('click', function(){
		const RUBY_BUTTON = document.querySelector("[onclick='command_ruby();return false']")
		if(rubyButtonFlag){
			RUBY_BUTTON.setAttribute("disabled","")
			RUBY_BUTTON.lastElementChild.classList.add("gray")
			RUBY_BUTTON.style.borderColor = ""
			rubyButtonFlag = false
		}
	});
	document.getElementById("words").addEventListener('select', function(){
		console.log(window.getSelection().toString())
		const RUBY_BUTTON = document.querySelector("[onclick='command_ruby();return false']")
		if(window.getSelection().toString()){
			RUBY_BUTTON.removeAttribute("disabled")
			RUBY_BUTTON.lastElementChild.classList.remove("gray")
			RUBY_BUTTON.style.borderColor = "#17a2b8"
			rubyButtonFlag = true
		}else if(rubyButtonFlag){
			RUBY_BUTTON.setAttribute("disabled","")
			RUBY_BUTTON.lastElementChild.classList.add("gray")
			RUBY_BUTTON.style.borderColor = ""
			rubyButtonFlag = false
		}
	});
	document.getElementById("words").addEventListener("input",function(){
		if(rubyButtonFlag && !window.getSelection().toString()){
			const RUBY_BUTTON = document.querySelector("[onclick='command_ruby();return false']")
			RUBY_BUTTON.setAttribute("disabled","")
			RUBY_BUTTON.lastElementChild.classList.add("gray")
			RUBY_BUTTON.style.borderColor = ""
			rubyButtonFlag = false
		}
	})
	let ruby_button = RUBY.parentNode
	let all_adjust_button = document.querySelector("[onclick='command_timefix_all();return false']")
	let one_adjust_button = document.querySelector("[onclick='command_timefix();return false']")
	all_adjust_button.parentNode.remove()
	one_adjust_button.parentNode.insertBefore(all_adjust_button , one_adjust_button.nextElementSibling);
	ruby_button.parentNode.insertAdjacentHTML('beforeend', `<div id="mod-setting"><input id="volume" type="range" value='${(localStorage.getItem('volume_storage') != null ? localStorage.getItem('volume_storage'):70)}' min="0" max="100"><i class="zmdi-hc-fw zmdi fas fa-cog" title="オプション"></i></div>`);
			document.getElementById("modal-overlay").addEventListener('click', function(){
			document.getElementById("modal-overlay").style.display = "none";
			document.getElementById("mod-menu").style.display = "none";
		});

	document.getElementsByClassName("fa-cog")[0].addEventListener('click', event => {
		document.getElementById("modal-overlay").style.display = "block";
		document.getElementById("mod-menu").style.display = "block";
		document.getElementById("mod-menu").animate([{opacity: '0'}, {opacity: '1'}], 100)
	});
	ruby_button.parentNode.style.position = "relative"
	ruby_button.classList.remove('col-2')
	ruby_button.classList.add('col-1')
	document.querySelector("[onclick='command_ruby();return false']").parentNode.classList.remove('col-2')

	let pr2 = document.getElementsByClassName("text-right")[0]
	pr2.classList.remove('pr-2','text-right','col-2')
	document.getElementById("volume").addEventListener("input", video_volume_change);
	player.setVolume(+document.getElementById("volume").value)

}

function video_volume_change(){
	player.setVolume(+document.getElementById("volume").value)
	localStorage.setItem('volume_storage',document.getElementById("volume").value)
}


function change_Convert(){
	if(document.getElementById("ConverTypeKana").checked){
		localStorage.setItem('ConverType',"Kana")
	}else if(document.getElementById("ConverTypeEn").checked){
		localStorage.setItem('ConverType',"En")
	}else{

	}
}


var custom_edit_2 = document.createElement("div");
    custom_edit_2.id = "custom_edit_2";
    custom_edit_2.setAttribute("class","row w-100 ml-2");
　　custom_edit_2.setAttribute("style","margin-top: 10px;");
document.getElementById("edit").appendChild(custom_edit_2);
document.getElementById("custom_edit_2").insertAdjacentHTML('beforeend', `<div class="col-1 pointer" title='Timingボックスは、再生中に追加ボタン(Ｓキー)で新たに行を追加するとき、Timingボックスに入力されている数値分のタイムを補正する便利な機能です。\n\n初期値の[-0.15秒]は、歌詞に合わせてタイミング良く追加ボタン(Ｓキー)が押されたら、プレイ時に違和感なくタイピングできる補正値だと思います。(あくまでもこの機能の製作者の感覚です。)\nBluetooth接続のオーディオデバイスやキーボードなど使用しているときは誤差が生じる可能性がありますので、環境に合わせて適切な補正値に変更してください。'>
 Timing
          </div><div class="col-1">
<input id="Timing" type="text" value=`+(isNaN(+localStorage.getItem('timing'))? localStorage.getItem('timing'):-0.15) +` class="form-control form-control-sm p-0" style="margin-bottom: 15px;width:50px;">
          </div>`);
Timing_input = document.getElementById("Timing")
Timing_input.addEventListener("change", change_timing);


    var pattern_metronome = document.createElement("div");
pattern_metronome.innerHTML = `
　<span title='Enter：ルビタグ挿入\n修正したい単語を選択してF3：簡易辞書登録\n\n以下のショートカットキーはテキストボックスにフォーカスを当てていないときに使用できます。\n\nCtrl+H：読み仮名の置き換え\nCtrl+Z：一つ戻る / Ctrl+Y：繰り返し\nS：追加\nShift+S：空行を追加\nU：変更\nE：英語変換\nH：かな変換\nQ：次の歌詞をセット\nD：選択解除\nX：初めから再生\nDelete：選択ラインを削除\nライン選択後↑↓：ラインの移動\n←→：3秒スキップ\nF9：速度低下\nF10：速度上昇\nEsc：再生・停止\nCtrl+S：タイピングデータを保存' class=pointer>ショートカットキー一覧</span>
　<span title='再生中にCtrlキーを押しながら行選択をするとタイマーボックスを停止して行編集をすることができます。\n["追加・変更コマンドを使用"or"別の行を選択"or"シークバーに触れる"] の動作をすると再びタイマーボックスが更新されます。\n\nさらにこの方法でタイマーが停止している状態だと以下の操作が行えるようになります。\n\n ↑↓キー：選択中の行の時間を0.01秒間隔で調整\nCtrl+↑↓：選択中の行の時間を0.1秒間隔で調整'
class=pointer>◆</span>`


document.getElementById("custom_edit_2").appendChild(pattern_metronome);
document.querySelector("[onclick='command_kakasi_en();return false']").insertAdjacentHTML('beforebegin','<input id=ConverTypeEn name=lrcConvertType type=radio checked>');
document.querySelector("[onclick='command_kakasi();return false']").insertAdjacentHTML('beforebegin','<input id=ConverTypeKana name=lrcConvertType type=radio >');

document.getElementById("edit").insertAdjacentHTML('beforeend', `<details id="lyrics-text-details-box" ${localStorage.getItem("lyrics-text-details-box") === "true" ? "open" : ""}><summary>簡易追加ボックス</summary><div style="display:flex;"><div style="margin-left:20px;"><div style="display: flex;justify-content: space-between;">
<div style="
    display: flex;
    width: 300px;
    justify-content: space-between;
"><div id="lyric_text_length">0行</div><div>追加: <span id="add-shortcut-key">Sキー or TABキー</span></div><div>戻る: <span id="undo-shortcut-key">Ctrl+Z</span></div>
</div>
<div style="display: flex;"><div id=blank_delete title='クリックで歌詞に含まれている空行を削除します。\nShift+Sキーで譜面に空行を挿入することもできます。'class=pointer>空行削除</div>　<div id=symbol_delete title='クリックで歌詞に含まれる記号を削除 \n("ー","￥","＆", "％","＠", "＃", "＄","＊", "＋","＝",スペース　は削除されません)'class=pointer>記号削除</div></div></div>
<textarea class="form-control form-control-lg p-0" id="lyric_text" style="max-height: 403px;width:${localStorage.getItem("lyric_text_width") ? localStorage.getItem("lyric_text_width"):"auto"};
height:${localStorage.getItem("lyric_text_height") ? localStorage.getItem("lyric_text_height"):"auto"};" rows="6" cols="75" name="text1" placeholder="タイピング用に整形した歌詞を入力してください。\n歌詞を入力後、動画再生中にSキー or TABキーを押すと先頭の歌詞が追加されます。"></textarea></div>
</div></details>`);

document.getElementById("lyrics-text-details-box").addEventListener('toggle',function (){
localStorage.setItem("lyrics-text-details-box",event.target.open)
},true)


document.getElementById("lyric_text").addEventListener('input',(function (){
document.getElementById("lyric_text_length").innerHTML = document.getElementById("lyric_text").value.split(/\n/).length+"行"
add_next_wordset()
}))

document.getElementById("lyric_text").addEventListener('paste',function(event){
	setTimeout(function(){
		document.activeElement.blur();
		document.getElementById("lyric_text").value = document.getElementById("lyric_text").value.replace(/　/g , " ")
		document.getElementById("lyric_text").scrollTop = 0;
		document.getElementById("lyric_text").scrollLeft = 0;
	},0)
})
document.getElementById("lyric_text").addEventListener('focus',function(event){
document.getElementById("add-shortcut-key").textContent = "TABキー"
document.getElementById("undo-shortcut-key").textContent = "Ctrl+Shift+Z"
})

document.getElementById("lyric_text").addEventListener('blur',function(event){
document.getElementById("add-shortcut-key").textContent = "Sキー or TABキー"
document.getElementById("undo-shortcut-key").textContent = "Ctrl+Z"
})

document.getElementById("symbol_delete").addEventListener('click',(function (){
document.getElementById("lyric_text").value = document.getElementById("lyric_text").value.replace(/\…|\!|\?|\,|\.|\...|\'|\"|\^|\||\[|\]|\`|\:|\;|\<|\>|\_|\~|\{|\}|！|？|，|＂|＇|＾|｜|「|」|｀|：|；|＜|＞|＿|｛|｝|、|。|・/g," ")
.replace(/ {2,}/g," ").replace(/\n /g,"\n").replace(/ \n/g,"\n").replace(/ \)/g,")").replace(/ ）/g,"）").replace(/～/g,"ー")
}))
document.getElementById("blank_delete").addEventListener('click',(function (){
	document.getElementById("lyric_text").value = document.getElementById("lyric_text").value.replace(/\n{2,}|\n \n/g,"\n")
	document.getElementById("lyric_text_length").innerHTML = document.getElementById("lyric_text").value.split(/\n/).length+"行"
}))
if(localStorage.getItem('ConverType') == "Kana"){
document.getElementById("ConverTypeKana").checked = true
}else if(localStorage.getItem('ConverType') == "Tool"){
document.getElementById("ConverTypeTool").checked = true
}
for(let i=0; i<document.querySelectorAll("[name=lrcConvertType]").length;i++){
document.querySelectorAll("[name=lrcConvertType]")[i].addEventListener('change',change_Convert)
}






// create an observer instance
const observer = new MutationObserver(function(mutation) {
localStorage.setItem("lyric_text_width", document.getElementById("lyric_text").style.width)
localStorage.setItem("lyric_text_height", document.getElementById("lyric_text").style.height)
}),
// configuration of the observer:
config = {
    attributes: true // this is to watch for attribute changes.
};
// pass in the element you wanna watch as well as the options
observer.observe(document.getElementById("lyric_text"), config);


var edit_flag = false;
var edit_target;
var input_flag = false

function change_timing(){
	if(!isNaN(+Timing_input.value)){
		localStorage.setItem('timing',Timing_input.value)
	}
}

let headtime = 0
let time_frame = document.getElementById("time")
playheadUpdate = function () {
    headtime = player.getCurrentTime();
	input_range.value = headtime

	if(!input_flag){
		time_frame.value = headtime.toFixed(3)
	}
	if(headtime > next_time) {
		setBgBlueColor()
	}
}

function setBgBlueColor(){
	for(let i=0;i<lyrics_array.length;i++){
		if(lyrics_array[i][0] > headtime && i > 0){
			next_time = lyrics_array[i][0];

			removeBackgroundBlueColor()
			document.getElementById("tr"+(i-1)).classList.add("bg-info")
			color_line_number = i-1;
			return false;
		}

	}
}

update_subtitles_table = function () {
        var diff;
        var flag_end = false;
        var time_after = '';

        lyrics_array.sort(function(a,b){
          var a = parseFloat(a[0]);
          var b = parseFloat(b[0]);
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        });

        $('table#subtitles_table tbody tr').remove();

        $.each(lyrics_array, function(index, line) {
			var time = line[0];
			var word = line[1];
			var kana = line[2];

			if(time === undefined) {
				time = "0.0";
			}

			if(word === undefined) {
				word = '';
			}

			if(kana === undefined) {
				kana = '';
			}

			var type_sec;

			if (lyrics_array[index + 1]) {
				diff = parseFloat(lyrics_array[index + 1][0]) - parseFloat(time);
			} else {
				diff = 0.0
			}

			if(diff > 0) {
				type_count = (hiraganaToRomaCount(kana) / diff).toFixed(2)
				type_count = type_count + '<br><div class="btn btn-outline-warning m-0 p-1"><span style="font-size:xx-small;" onclick="command_button_join('+index+')">↑結合↑</span></div>';
				type_count = type_count + '<div class="btn btn-outline-danger p-1" style="margin-left:0 20px;"><span style="font-size:xx-small;" onclick="command_button_delete('+index+')">削除</span></div>';
			} else {
				type_count = '';
			}

			if(word == 'end' || flag_end == true) {
				type_count = '';
				flag_end = true;
			}

			//tr追加

			var tr = '<tr id="tr'+index+'"><td class="p-0 pt-3"><span  class="ml-1 icon-play_circle_filled" onclick="skip_play('+time+')"></span>&nbsp;'+time+'<br><span class="zmdi zmdi-pause-circle-outline zmdi-hc-fw mt-3" onclick="stop_movie()"></span></td><td>'+word+'</td><td>'+kana+'</td><td>'+type_count+'</td></tr>';
			$('table#subtitles_table tbody').append(tr);

			document.getElementById("tr"+index).addEventListener("click", function() {
				tabmenu('edit');
				if(line_number_input.value && line_number_input.value >= 0) {
					document.getElementById("tr"+line_number_input.value).classList.remove("bg-info_select")
					document.getElementById("tr"+line_number_input.value).classList.remove("bg-info_select_stop")
				}
				line_number_input.value = index
				document.getElementById("select_number").textContent = index
				time_frame.value = time
				word_input.value = word
				kana_input.value = kana
				if(event.ctrlKey){
					input_flag = true
					$(this).addClass('bg-info_select_stop');
				}else{
					input_flag = false
					$(this).addClass('bg-info_select');
				}
			});
		});
	setBgBlueColor()
	//最後のend行がなかった場合は、動画終了時間を設定したend行を追加します。
	if(flag_end == false) {
		var duration = player.getDuration().toFixed(3)
		var index = lyrics_array.length;
		var tr = '<tr id="tr'+index+'"><td class="p-0 pt-3">'+duration+'</td><td>end</td><td></td><td></td></tr>';

		$('table#subtitles_table tbody').append(tr);

		document.getElementById("tr"+index).addEventListener("click", function() {
			tabmenu('edit');
			if(line_number_input.value && line_number_input.value >= 0) {
				document.getElementById("tr"+line_number_input.value).classList.remove("bg-info_select")
				document.getElementById("tr"+line_number_input.value).classList.remove("bg-info_select_stop")
			}
			if(event.ctrlKey){
				input_flag = true
				$(this).addClass('bg-info_select_stop');
			}else{
				input_flag = false
				$(this).addClass('bg-info_select');
			}
			line_number_input.value = index
			document.getElementById("select_number").textContent = index
			time_frame.value = duration
			word_input.value = "end"
			kana_input.value = ""
		});

		lyrics_array.push([duration, 'end', '']);
	}

}


let music_length = 0
let input_range = document.getElementsByClassName("input-range")[0]

function range_seek_time(){
	headtime = input_range.value
	player.seekTo(headtime);
	time_frame.value = headtime
	tabmenu("edit");
	input_flag=false
        };

let lyric_list_html
onPlayerReady=function (event) {
        $.ajax({
          type: 'GET',
	  url:"/ime.txt",
	    success:function (data){
              completeIme(data);
            },
            error:function() {
              alert("imeデータの読み込みに失敗しました");
            }
		});
	html_create()
	if(!document.getElementById("title").value){
		document.getElementById("title").value = player.getVideoData().title
	}
	lyric_list_html = document.getElementById("subtitles_table").parentNode
	music_length = player.getDuration()
	input_range.setAttribute("max", music_length);
	input_range.addEventListener("input", range_seek_time);
	window.addEventListener('keydown',keydownfunc,true);
	word_input.insertAdjacentHTML('beforebegin','<span id=select_number style=position:absolute;left:-5px;>-</span>');
	window.addEventListener('keydown',esc_play_movie,true);
}


var last_seek = 0
keydownfunc = function (event) {
if(document.activeElement.type != "text" && document.activeElement.type != "textarea" || (event.code == "Tab" || event.code == "KeyZ" && event.shiftKey && document.activeElement.id == "lyric_text")){
	switch(event.code){
		case "ArrowUp" :
			if(input_flag){
				last_seek = Number(time_frame.value)
				if(event.ctrlKey){
					last_seek -= 0.1
				}else{
					last_seek -= 0.01
				}
				if(last_seek < 0){
					event.preventDefault();
					return
				}
				if(line_number_input.value){
					lyrics_array[+line_number_input.value][0] = (last_seek).toFixed(3)
					time_frame.value = (last_seek).toFixed(3)
					update_subtitles_table()
				}
				player.seekTo(time_frame.value)
				for(let i=0;i<lyrics_array.length;i++){
					if(lyrics_array[i][0]==time_frame.value && word_input.value == lyrics_array[i][1] && kana_input.value == lyrics_array[i][2]){
						if(lyrics_array[+line_number_input.value][0] != lyrics_array[i][0]){
							line_number_input.value = i
							document.getElementById("select_number").textContent = i
						}
					}
				}
				removeBackgroundBlueColor()
				document.getElementById("tr"+line_number_input.value).classList.add("bg-info_select_stop")
				next_time = lyrics_array[Math.max(line_number_input.value-1,0)][0]
				createjs.Ticker.removeEventListener("tick", playheadUpdate);
			}else if(document.getElementsByClassName("bg-info_select")[0] != null && document.getElementsByClassName("bg-info_select")[0].previousSibling.id){
				removeBackgroundBlueColor()
				document.getElementsByClassName("bg-info_select")[0].previousSibling.click()
				skip_play(+document.getElementsByClassName("bg-info_select")[0].firstChild.textContent.replace(/[^0-9\.]/g, '')+0.15)
				document.getElementById("subtitles_table").parentNode.scrollTo({
					top:document.getElementById(document.getElementsByClassName("bg-info_select")[0].id).offsetTop-document.getElementById(document.getElementsByClassName("bg-info_select")[0].id).clientHeight,
					behavior: "smooth",
				})
			}
			event.preventDefault();
			break;
		case "ArrowDown" :
			if(input_flag){
				last_seek = Number(time_frame.value)
				if(event.ctrlKey){
					last_seek += 0.1
				}else{
					last_seek += 0.01
				}
				if(line_number_input.value){
					lyrics_array[+line_number_input.value][0] = (last_seek).toFixed(3)
					time_frame.value = (last_seek).toFixed(3)
					update_subtitles_table()
				}
				player.seekTo(last_seek)
				for(let i=0;i<lyrics_array.length;i++){
					if(lyrics_array[i][0]==time_frame.value && word_input.value == lyrics_array[i][1] && kana_input.value == lyrics_array[i][2]){
						if(lyrics_array[+line_number_input.value][0] != lyrics_array[i][0]){
							line_number_input.value = i
							document.getElementById("select_number").textContent = i
						}
					}
				}
				removeBackgroundBlueColor()
				document.getElementById("tr"+line_number_input.value).classList.add("bg-info_select_stop")
				next_time = lyrics_array[Math.max(line_number_input.value-1,0)][0]
				createjs.Ticker.removeEventListener("tick", playheadUpdate);

			}else if(document.getElementsByClassName("bg-info_select")[0] != null && document.getElementsByClassName("bg-info_select")[0].nextSibling.id){
				removeBackgroundBlueColor()
				document.getElementsByClassName("bg-info_select")[0].nextSibling.click()
				skip_play(+document.getElementsByClassName("bg-info_select")[0].firstChild.textContent.replace(/[^0-9\.]/g, ''))
				document.getElementById("subtitles_table").parentNode.scrollTo({
					top:document.getElementById(document.getElementsByClassName("bg-info_select")[0].id).offsetTop-document.getElementById(document.getElementsByClassName("bg-info_select")[0].id).clientHeight,
					behavior: "smooth",
				})

			}
			event.preventDefault();
			break;
		case "ArrowLeft" :
			player.seekTo(headtime-(3*(speed >= 1 ? 1 : speed)))
			playheadUpdate()
			event.preventDefault();
			break
		case "ArrowRight" :
			player.seekTo(headtime+(3*(speed >= 1 ? 1 : speed)))
			playheadUpdate()
			event.preventDefault();
			break;
		case "KeyS" :
			if(event.ctrlKey) {
				let res = confirm("現在の譜面の状態を保存しますか？");
				if( res == true ) {
					command_save()
					tabmenu('save')
					dialog_flag = false
				}
				event.preventDefault();
				return;
			}
			break;
		case "KeyZ" :
			if(event.ctrlKey) {
				Undo()
				event.preventDefault();
			}
			break;
		case "KeyY" :
			if(event.ctrlKey) {
				Redo()
				event.preventDefault();
			}
			break;
		case "KeyX" :
			player.seekTo(0)
			time_frame.value = 0
			event.preventDefault();
			break;
		case "KeyD" :
			if(line_number_input.value != "") {
				document.getElementById("tr"+line_number_input.value).classList.remove("bg-info_select")
				select_line_Release()
				event.preventDefault();
			}
			break;
		case "Delete" :
			if(line_number_input.value != "") {
				command_delete();
				event.preventDefault();
			}
			break;
		case "KeyQ" :
			add_next_wordset()
			event.preventDefault();
			break;
		case "KeyH" :
			if(event.ctrlKey) {
				wordSearchReplace()
				event.preventDefault();
			}
			break;
		case "Escape" :
			player.pauseVideo()
			event.preventDefault();
			break;
	}


    if(time_frame.value){
		switch(event.code){
			case "KeyS" :
			case "Tab" :
				if((event.code == "KeyS" || event.code == "Tab") && !input_flag) {
					if(event.shiftKey){
						const add_time = (+time_frame.value+ (isNaN(+Timing_input.value)?0:+Timing_input.value) ).toFixed(3)
						lyrics_array.push([add_time,"",""]);
						update_subtitles_table();
						Undo_block.push(["add",search_number(add_time),[add_time,"",""]])
					}else{
						if(document.getElementById("lyric_text").value){
							command_add("nextLyric",event.code);
						}else{
							command_add("",event.code);
						}
					}
					event.preventDefault();
				}
				break;
			case "KeyU" :
				command_update();
				event.preventDefault();
				break;
			case "KeyH" :
				command_kakasi();
				event.preventDefault();
				break;
			case "KeyE" :
				command_kakasi_en();
				event.preventDefault();
				break;
		}
	}

}
	switch(event.code){
		case "F3" :
			if(document.activeElement.id == "words" && window.getSelection().toString() != ""){
				window.open("https://typing-tube.net/my/phonetics/create?"+window.getSelection().toString(),null, 'width=500,toolbar=yes,menubar=yes,scrollbars=yes');
				event.preventDefault();
			}
			break;
		case "F9" :
			play_speed_down()
			event.preventDefault();
			break;
		case "F10" :
			play_speed_up()
			event.preventDefault();
			break;
	}

}


async function wordSearchReplace(){

	const search = escapeRegExp(prompt("置き換えしたい読みを入力してください。"))

	if(!search){return;}

	let kanaMatchLength = getKanaSearchLength(new RegExp(search,"g"))
	const replace = prompt("置き換えする文字を入力してください。")
	const searchReg = new RegExp(`${replace ? `(?!${replace})` : ""}${search}`,"g");

	if(search && replace.match(search)){
		alert("sorry...置き換えする文字に検索する文字が含まないようにしてください。")
		return;
	}

	for(let i=0,len=lyrics_array.length; i<len; i++){

		const match = lyrics_array[i][2].match(searchReg)
		if(!match){continue;}
		let replacedWord = lyrics_array[i][2]
		let replacedLength = 0


		for(let j=1;j<match.length+1;j++){
			await replaceFoundFocus(i,search,replacedWord,replacedLength)
			await replaceDialog(i,j,searchReg,replace,kanaMatchLength)
			replacedWord = replacedWord.replace(search,"")
			replacedLength += search.length
			kanaMatchLength--
		}

	}

}

function escapeRegExp(string) {
    return string ? string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') : null;
}


function replaceFoundFocus(i,search,replacedWord,replacedLength){
	return new Promise(resolve => {
		setTimeout(() => {
			const FOUND_TR = document.getElementById("tr"+i)
			document.getElementById("subtitles_table").parentNode.scrollTo({
				top:FOUND_TR.offsetTop-FOUND_TR.clientHeight,
				behavior: "smooth",
			})

			var range = document.createRange();
			//取得した要素の内側を範囲とする
			const text = FOUND_TR.children[2]
			const textMatch = FOUND_TR.children[2].textContent.match(new RegExp(search))
			range.selectNodeContents(text);
			//範囲を選択状態にする
			range.setStart(text.firstChild, textMatch.index)
			range.setEnd(text.firstChild, textMatch.index+textMatch[0].length)
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range);
			resolve(1)
		}, 50)
	})
}

function replaceDialog(i,j,searchReg,replace,kanaMatchLength){
	return new Promise(resolve => {
		setTimeout(() => {
			if(confirm(`残り${kanaMatchLength}件\n${lyrics_array[i][2]}\n置き換えますか？`)){
				let n = 0
				lyrics_array[i][2] = lyrics_array[i][2].replace(searchReg,function(match){ if(++n==1) return replace; else return match; })
				update_subtitles_table()
			}
			resolve(1)
		}, 50)
	})
}

function getKanaSearchLength(searchReg){
	let lyricsKana = ""

	for(let i=0,len=lyrics_array.length; i<len; i++){
		lyricsKana += lyrics_array[i][2]
	}

	const Result = lyricsKana.match(searchReg)

	return Result ? Result.length:0;
}

function removeBackgroundBlueColor(){
	if(document.getElementsByClassName("bg-info")[0] != null){
		document.getElementsByClassName("bg-info")[0].classList.remove("bg-info")
	}
}

let line_number_input = document.getElementById("number")
let word_input = document.getElementById("words")
let kana_input = document.getElementById("kana")
let Undo_block = [] //元に戻す
let Redo_block = [] //やり直し


function Undo(){
if(Undo_block.length){
const number = Undo_block[Undo_block.length-1][1]
const last_State = Undo_block[Undo_block.length-1][0]
const undo_lyric = Undo_block[Undo_block.length-1][2]
if(last_State == "update"){
Redo_block.push(["update",number,lyrics_array[number].slice()])
lyrics_array[number] = undo_lyric

}else if(last_State == "add"){
Redo_block.push(["add",number,undo_lyric.slice()])

	time_frame.value = undo_lyric[0]
	word_input.value = undo_lyric[1]
	kana_input.value = undo_lyric[2]
	document.getElementById("lyric_text").value = undo_lyric[1]+"\n"+document.getElementById("lyric_text").value
	document.getElementById("lyric_text_length").innerHTML = document.getElementById("lyric_text").value.split(/\n/).length+"行"
	if(document.activeElement.id == "lyric_text"){
		let caret = 0
		caret += (document.activeElement.selectionStart + undo_lyric[1].length) + 1
		if(caret < 0 || isNaN(caret)){caret = 0}
		setTimeout(function(){
			document.getElementById("lyric_text").focus()
			document.getElementById("lyric_text").setSelectionRange(caret, caret);
			document.getElementById("lyric_text").scrollTop = 0;
			document.getElementById("lyric_text").scrollLeft = 0;
		},0)
	}
		if(document.getElementById('ConverTypeEn').checked){
			command_kakasi_en(true);
		}else{
			command_kakasi(true);
		}
	lyrics_array.splice(number,1);//削除
	skip_play(+undo_lyric[0]-3,true);
}else if(last_State == "delete"){
	const delete_lyric = Undo_block[Undo_block.length-1][2]
	Redo_block.push(["delete",number,delete_lyric.slice()])

	time_frame.value = delete_lyric[0]
	word_input.value = delete_lyric[1]
	kana_input.value = delete_lyric[2]
	command_add("Undo")
}
	update_subtitles_table();
	const scrollNumber = search_approximation_number(undo_lyric[0])
	if(document.getElementById("tr"+(scrollNumber-1)) != null){
		document.getElementById("subtitles_table").parentNode.scrollTo({
			top:document.getElementById("tr"+(scrollNumber-1)).offsetTop,
			behavior: "smooth",
		})
	}
	Undo_block.splice( Undo_block.length-1, 1 )
}
}

function Redo(){
	if(Redo_block.length){
		const number = Redo_block[Redo_block.length-1][1]
		const last_State = Redo_block[Redo_block.length-1][0]
		if(last_State == "update"){
			Undo_block.push(["update",number,lyrics_array[number].slice()])
			lyrics_array[number] = Redo_block[Redo_block.length-1][2]

		}else if(last_State == "add"){
			const add_lyric = Redo_block[Redo_block.length-1][2]
			time_frame.value = add_lyric[0]
			word_input.value = add_lyric[1]
			kana_input.value = add_lyric[2]

			command_add("Redo")
			skip_play(+add_lyric[0],true);
		}else if(last_State == "delete"){
			Undo_block.push(["delete",number,lyrics_array[number].slice()])
			lyrics_array.splice(number,1);
			select_line_Release()
		}
		update_subtitles_table();
		const scrollNumber = search_approximation_number(undo_lyric[0])
		if(document.getElementById("tr"+(scrollNumber-1)) != null){
			document.getElementById("subtitles_table").parentNode.scrollTo({
				top:document.getElementById("tr"+(scrollNumber-1)).offsetTop,
				behavior: "smooth",
			})
		}
		Redo_block.splice( Redo_block.length-1, 1 )
	}
}
command_update = function () {
	let index = +line_number_input.value;
	if(index >= 0) {
		Undo_block.push(["update",index,lyrics_array[index].slice()])
		Redo_block = []

		if(!input_flag && player.getPlayerState() == 1){
			lyrics_array[index][0] = (+time_frame.value+ (isNaN(+Timing_input.value)?0:+Timing_input.value) ).toFixed(3)
		}else{
			lyrics_array[index][0] = time_frame.value
		}
		lyrics_array[index][1] = word_input.value;
		lyrics_array[index][2] = kana_input.value;
		select_line_Release()
		if(index == 0 && parseFloat(lyrics_array[index][0]) != 0.0) {
			lyrics_array.unshift([0, "", ""]);
		}
		dialog_flag = true
		update_subtitles_table();
	}
}
function select_line_Release(){
	line_number_input.value = ""
	time_frame.value = ""
	word_input.value = ""
	kana_input.value = ""
	document.getElementById("select_number").textContent = "-"
	input_flag = false
}

command_button_delete = function (number) {
    Undo_block.push(["delete",number,lyrics_array[number].slice()])
    lyrics_array.splice(number,1);
    Redo_block = []
    select_line_Release()
    update_subtitles_table();
      }

let next_word_kana = ""
function add_next_wordset(){
	if(document.getElementById('lyric_text').value){
		word_input.value = document.getElementById("lyric_text").value.split(/\n/).slice(0,1)[0].replace(/　/g , " ")
		document.getElementById("lyric_text_length").innerHTML = document.getElementById("lyric_text").value.split(/\n/).length+"行"
		if(document.getElementById('ConverTypeEn').checked){
			command_kakasi_en();
			command_kakasi_en(true);
		}else{
			command_kakasi();
			command_kakasi(true); 
		}
	}
}

function search_number(search_time){
	for (let i=0; i<lyrics_array.length; i++){
		if(lyrics_array[i][0] == search_time){
			var find_number = i
			break;
		}
	}
	return find_number
}

function search_approximation_number(search_time){
	for (let i=0; i<lyrics_array.length; i++){
		if(+lyrics_array[i][0] > +search_time){
			var find_number = i
			break;
		}
	}
	return find_number
}

command_add = function (flag,Tab) {
	if(time_frame.value == "") {
		return false;
	}
	var arr = [];
if(player.getPlayerState() == 1){
		arr[0] = (+time_frame.value+ (isNaN(+Timing_input.value) ? 0 : +Timing_input.value) ).toFixed(3)
}else{
	arr[0] = time_frame.value
}
	last_seek = arr[0]
	if(flag == "nextLyric"){
		arr[1] = document.getElementById("lyric_text").value.split(/\n/).slice(0,1)[0];
		arr[2] = next_word_kana;
	}else{
		arr[1] = word_input.value;
		arr[2] = kana_input.value;
	}
	lyrics_array.push(arr);
	if(document.getElementById("lyric_text").value){
		let caret = 0
		caret += (document.activeElement.selectionStart - document.getElementById("lyric_text").value.split(/\n/)[0].length) - 1
		if(caret < 0 || isNaN(caret)){caret = 0}
		document.getElementById("lyric_text").value = document.getElementById("lyric_text").value.split(/\n/).slice(1).join("\n")
		if(Tab == "Tab"){
			setTimeout(function(){
				document.getElementById("lyric_text").focus()
				document.getElementById("lyric_text").setSelectionRange(caret, caret);
				document.getElementById("lyric_text").scrollTop = 0;
				document.getElementById("lyric_text").scrollLeft = 0;
			},0)
		}
	}

	select_line_Release()
	dialog_flag = true
	update_subtitles_table();
	if(flag != "Undo"){
		Undo_block.push(["add",search_number(arr[0]),[arr[0],arr[1],arr[2]]])
	}
	if(!flag || flag == "nextLyric"){
		Redo_block = []
		$.each(lyrics_array, function(index, line) {
			if(line[0] == arr[0]) {
				document.getElementById("subtitles_table").parentNode.scrollTo({
					top:document.getElementById("tr"+index).offsetTop-document.getElementById("tr"+index).clientHeight,
					behavior: "smooth",
				})
				return false;
			}
		})
	}
	add_next_wordset()
}
command_timefix_all = function () {
	var fix = parseFloat($('#timefix').val());
	if(Number.isNaN(fix)) {
		return;
	}
	$.each(lyrics_array, function(i, arr){
		if(i != 0 && lyrics_array[i][1] != 'end') {
			fixed = parseFloat(lyrics_array[i][0]) + fix;
			if(fixed < 0.01) {
				fixed = 0.01;
			}
			lyrics_array[i][0] = (parseInt(fixed * 1000)/1000.0).toFixed(3);

		}
	});
	if(line_number_input.value && line_number_input.value > 0) {
		removeBackgroundBlueColor()
	}
	select_line_Release()
	update_subtitles_table();
      }

command_ruby = function () {
	tr = document.activeElement.parentNode;
	td = tr.querySelectorAll("td");
	if(Array.prototype.indexOf.call(td, document.activeElement) == 1 && window.getSelection().toString().length != 0 || document.activeElement.id == "words" || document.activeElement.innerText == "ルビタグ"){
		let start;
		let end;
		if(document.activeElement.id == "words" || document.activeElement.innerText == "ルビタグ"){
			start = $('#words').get(0).selectionStart;
			end = $('#words').get(0).selectionEnd;
		}else{
			start = window.getSelection().anchorOffset
			end = window.getSelection().extentOffset
		}
		if(end - start < 1) {
			if(document.activeElement.id == "words" || document.activeElement.innerText == "ルビタグ"){
				return false;
			}else{
				start = window.getSelection().extentOffset
				end = window.getSelection().anchorOffset
			}
		}
		let text = ""
		let fix_text = ""
		if(document.activeElement.id == "words" || document.activeElement.innerText == "ルビタグ"){
			text = document.getElementById("words").value;
		}else{
			text = td[1].textContent
		}
		fix_text = text.slice(0, start) + '<ruby>' + text.slice(start, end) + '<rt></rt></ruby>' + text.slice(end, text.length);
		if(document.activeElement.id == "words" || document.activeElement.innerText == "ルビタグ"){
			document.getElementById("words").value = fix_text;
			document.getElementById("words").focus();
			document.getElementById("words").setSelectionRange(word_input.value.search("<rt></rt></ruby>")+4, word_input.value.search("<rt></rt></ruby>")+4);

		}else{
			td[1].innerText = fix_text
			td[1].focus();
		}}
      }
document.querySelector("[onclick='command_ruby();return false']").setAttribute("title","ルビタグを挿入したい文を選択後、Enterキーを押すことでルビタグ挿入できます。");





parseLyrics = function (data) {
	var lines = data.split("\n");
	lyrics_array = [];
	$.each(lines, function(index, line) {
		if(index==0) {
			a = line.split("\t");
		} else {
			a = line.split("\t");
			if(parseInt(a[0]) >= 0) {
				lyrics_array.push(a);
				if(line[1] == "end" && movieTotalTime == 0) {
					movieTotalTime = line[0];
				}
			}
		}
	});
	return lyrics_array;
}

let dialog_flag = false
function beforeunload_dialog(e) {
if(dialog_flag)
    e.returnValue = "このページを離れてもよろしいですか？";

}
window.addEventListener('beforeunload', beforeunload_dialog);
document.querySelector("#save .btn-outline-success").addEventListener('click', function (){
dialog_flag = false
});


class requestLyricInfo {

	constructor(data) {
		this.data = data;
		this.imperfectSokuonJoin = ["い", "う", "ん"]
		this.imperfectSokuonRomaList = ["i","u","n"]
		this.sokuonJoin = ["ヰ", "ゐ", "ヱ", "ゑ","ぁ", "ぃ", "ぅ", "ぇ", "ぉ","ゃ","ゅ","ょ","っ", "ゎ", "ヵ", "ヶ", "ゔ", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
		this.zenkakuList = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９", "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", "～", "＆", "％", "！", "？", "＠", "＃", "＄", "（", "）", "｜", "｛", "｝", "｀", "＊", "＋", "：", "；", "＿", "＜", "＞", "＝", "＾"]
		this.nnList = ["あ", "い", "う", "え", "お", "な", "に", "ぬ", "ね", "の", "や", "ゆ", "よ", "ん", "'", "’"]

		this.romaMap = [
			["0", "0"],
			["1", "1"],
			["2", "2"],
			["3", "3"],
			["4", "4"],
			["5", "5"],
			["6", "6"],
			["7", "7"],
			["8", "8"],
			["9", "9"],
			["ぎゃ", "gya", "gilya", "gixya"],
			["ぎぃ", "gyi", "gili", "gixi", "gilyi", "gixyi"],
			["ぎゅ", "gyu", "gilyu", "gixyu"],
			["ぎぇ", "gye", "gile", "gixe", "gilye", "gixye"],
			["ぎょ", "gyo", "gilyo", "gixyo"],
			["きゃ", "kya", "kilya", "kixya"],
			["きぃ", "kyi", "kili", "kixi", "kilyi", "kixyi"],
			["きゅ", "kyu", "kilyu", "kixyu"],
			["きぇ", "kye", "kile", "kixe", "kilye", "kixye"],
			["きょ", "kyo", "kilyo", "kixyo"],
			["ぐぁ", "gwa", "gula", "guxa"],
			["ぐぃ", "gwi", "guli", "guxi", "gulyi", "guxyi"],
			["ぐぅ", "gwu", "gulu", "guxu"],
			["ぐぇ", "gwe", "gule", "guxe", "gulye", "guxye"],
			["ぐぉ", "gwo", "gulo", "guxo"],
			["しゃ", "sya", "sha", "silya", "sixya", "shilya", "shixya", "cilya", "cixya"],
			["しぃ", "syi", "sili", "sixi", "silyi", "shixyi", "shili", "shixi", "shilyi", "shixyi", "cili", "cixi", "cilyi", "cixyi"],
			["しゅ", "syu", "shu", "silyu", "sixyu", "shilyu", "shixyu", "cilyu", "cixyu"],
			["しぇ", "sye", "she", "sile", "sixe", "silye", "sixye", "shile", "shixe", "shilye", "shixye", "cile", "cixe", "cilye", "cixye"],
			["しょ", "syo", "sho", "silyo", "sixyo", "shilyo", "shixyo", "cilyo", "cixyo"],
			["じゃ", "ja", "zya", "jya", "jilya", "jixya", "zilya", "zixya"],
			["じぃ", "zyi", "jyi", "jili", "jixi", "jilyi", "jixyi", "zili", "zixi", "zilyi", "zixyi"],
			["じゅ", "ju", "zyu", "jyu", "jilyu", "jixyu", "zilyu", "zixyu"],
			["じぇ", "je", "zye", "jye", "jile", "jixe", "jilye", "jixye", "zile", "zixe", "zilye", "zixye"],
			["じょ", "jo", "zyo", "jyo", "jilyo", "jixyo", "zilyo", "zixyo"],
			["すぁ", "swa", "sula", "suxa"],
			["すぃ", "swi", "suli", "suxi", "sulyi", "suxyi"],
			["すぅ", "swu", "sulu", "suxu"],
			["すぇ", "swe", "sule", "suxe", "sulye", "suxye"],
			["すぉ", "swo", "sulo", "suxo"],
			["ちゃ", "tya", "cya", "cha", "tilya", "tixya", "chilya", "chixya"],
			["ちぃ", "tyi", "cyi", "tili", "tixi", "tilyi", "tixyi", "chili", "chixi", "chilyi", "chixyi"],
			["ちゅ", "tyu", "cyu", "chu", "tilyu", "tixyu", "chilyu", "chixyu"],
			["ちぇ", "tye", "cye", "che", "tile", "tixe", "tilye", "tixye", "chile", "chixe", "chilye", "chixye"],
			["ちょ", "tyo", "cyo", "cho", "tilyo", "tixyo", "chilyo", "chixyo"],
			["ぢゃ", "dya", "dilya", "dixya"],
			["ぢぃ", "dyi", "dili", "dixi", "dilyi", "dixyi"],
			["ぢゅ", "dyu", "dilyu", "dixyu"],
			["ぢぇ", "dye", "dile", "dixe", "dilye", "dixye"],
			["ぢょ", "dyo", "dilyo", "dixyo"],
			["つぁ", "tsa", "tula", "tuxa", "tsula", "tsuxa"],
			["つぃ", "tsi", "tuli", "tuxi", "tulyi", "tuxyi", "tsuli", "tsuxi", "tsulyi", "tsuxyi"],
			["つぇ", "tse", "tule", "tuxe", "tulye", "tuxye", "tsule", "tsuxe", "tsulye", "tsuxye"],
			["つぉ", "tso", "tulo", "tuxo", "tsulo", "tsuxo"],
			["てゃ", "tha", "telya", "texya"],
			["てぃ", "thi", "t'i", "teli", "texi", "telyi", "texyi"],
			["てゅ", "thu", "t'yu", "telyu", "texyu"],
			["てぇ", "the", "tele", "texe", "telye", "texye"],
			["てょ", "tho", "telyo", "texyo"],
			["でゃ", "dha", "delya", "dexya"],
			["でぃ", "dhi", "d'i", "deli", "dexi", "delyi", "dexyi"],
			["でゅ", "dhu", "d'yu", "delyu", "dexyu"],
			["でぇ", "dhe", "dele", "dexe", "delye", "dexye"],
			["でょ", "dho", "delyo", "dexyo"],
			["とぁ", "twa", "tola", "toxa"],
			["とぃ", "twi", "toli", "toxi", "tolyi", "toxyi"],
			["とぅ", "twu", "t'u", "tolu", "toxu"],
			["とぇ", "twe", "tole", "toxe", "tolye", "toxye"],
			["とぉ", "two", "tolo", "toxo"],
			["どぁ", "dwa", "dola", "doxa"],
			["どぃ", "dwi", "doli", "doxi", "dolyi", "doxyi"],
			["どぅ", "dwu", "d'u", "dolu", "doxu"],
			["どぇ", "dwe", "dole", "doxe", "dolye", "doxye"],
			["どぉ", "dwo", "dolo", "doxo"],
			["にゃ", "nya", "nilya", "nixya"],
			["にぃ", "nyi", "nili", "nixi", "nilyi", "nixyi"],
			["にゅ", "nyu", "nilyu", "nixyu"],
			["にぇ", "nye", "nile", "nixe", "nilye", "nixye"],
			["にょ", "nyo", "nilyo", "nixyo"],
			["ひゃ", "hya", "hilya", "hixya"],
			["ひぃ", "hyi", "hili", "hixi", "hilyi", "hixyi"],
			["ひゅ", "hyu", "hilyu", "hixyu"],
			["ひぇ", "hye", "hile", "hixe", "hilye", "hixye"],
			["ひょ", "hyo", "hilyo", "hixyo"],
			["ぴゃ", "pya", "pilya", "pixya"],
			["ぴぃ", "pyi", "pili", "pixi", "pilyi", "pixyi"],
			["ぴゅ", "pyu", "pilyu", "pixyu"],
			["ぴぇ", "pye", "pile", "pixe", "pilye", "pixye"],
			["ぴょ", "pyo", "pilyo", "pixyo"],
			["びゃ", "bya", "bilya", "bixya"],
			["びぃ", "byi", "bili", "bixi", "bilyi", "bixyi"],
			["びゅ", "byu", "bilyu", "bixyu"],
			["びぇ", "bye", "bile", "bixe", "bilye", "bixye"],
			["びょ", "byo", "bilyo", "bixyo"],
			["ゔぁ", "va", "vula", "vuxa"],
			["ゔぃ", "vi", "vyi", "vuli", "vuxi", "vulyi", "vuxyi"],
			["ゔぇ", "ve", "vye", "vule", "vuxe", "vulye", "vuxye"],
			["ゔぉ", "vo", "vulo", "vuxo"],
			["ゔゃ", "vya", "vulya", "vuxya"],
			["ゔゅ", "vyu", "vulyu", "vuxyu"],
			["ゔょ", "vyo", "vulyo", "vuxyo"],
			["ふぁ", "fa", "fwa", "hwa", "fula", "fuxa", "hula", "huxa"],
			["ふぃ", "fi", "fwi", "hwi", "fuli", "fuxi", "fulyi", "fuxyi", "huli", "huxi", "hulyi", "huxyi"],
			["ふぅ", "fwu", "fulu", "fuxu", "hulu", "huxu"],
			["ふぇ", "fe", "fwe", "fye", "hwe", "fule", "fuxe", "fulye", "fuxye", "hule", "huxe", "hulye", "huxye"],
			["ふぉ", "fo", "fwo", "hwo", "fulo", "fuxo", "hulo", "huxo"],
			["ふゃ", "fya", "fulya", "fuxya", "hulya", "huxya"],
			["ふゅ", "fyu", "hwyu", "fulyu", "fuxyu", "hulyu", "huxyu"],
			["ふょ", "fyo", "fulyo", "fuxyo", "hulyo", "huxyo"],
			["みゃ", "mya", "milya", "mixya"],
			["みぃ", "myi", "mili", "mixi", "milyi", "mixyi"],
			["みゅ", "myu", "milyu", "mixyu"],
			["みぇ", "mye", "mile", "mixe", "milye", "mixye"],
			["みょ", "myo", "milyo", "mixyo"],
			["りゃ", "rya", "rilya", "rixya"],
			["りぃ", "ryi", "rili", "rixi", "rilyi", "rixyi"],
			["りゅ", "ryu", "rilyu", "rixyu"],
			["りぇ", "rye", "rile", "rixe", "rilye", "rixye"],
			["りょ", "ryo", "rilyo", "rixyo"],
			["いぇ", "ye", "ile", "ixe", "ilye", "ixye", "yile", "yixe", "yilye", "yixye"],
			["うぁ", "wha", "ula", "uxa", "wula", "wuxa", "whula", "whuxa"],
			["うぃ", "wi", "whi", "uli", "uxi", "ulyi", "uxyi", "wuli", "wuxi", "wulyi", "wuxyi", "whuli", "whuxi", "whulyi", "whuxyi"],
			["うぇ", "we", "whe", "ule", "uxe", "ulye", "uxye", "wule", "wuxe", "wulye", "wuxye", "whule", "whuxe", "whulye", "whuxye"],
			["うぉ", "who", "ulo", "uxo", "wulo", "wuxo", "whulo", "whuxo"],
			["くぁ", "qa", "qwa", "kwa", "kula", "kuxa", "qula", "quxa", "cula", "cuxa"],
			["くぃ", "qi", "qwi", "qyi", "kwi", "kuli", "kuxi", "kulyi", "kuxyi", "quli", "quxi", "qulyi", "quxyi", "culi", "cuxi", "culyi", "cuxyi"],
			["くぅ", "qwu", "kwu", "kulu", "kuxu", "qulu", "quxu", "culu", "cuxu"],
			["くぇ", "qe", "qwe", "qye", "kwe", "kule", "kuxe", "kulye", "kuxye", "qule", "quxe", "qulye", "quxye", "cule", "cuxe", "culye", "cuxye"],
			["くぉ", "qo", "qwo", "kwo", "kulo", "kuxo", "qulo", "quxo", "culo", "cuxo"],
			["くゃ", "qya", "kulya", "kuxya", "qulya", "quxya", "culya", "cuxya"],
			["くゅ", "qyu", "kulyu", "kuxyu", "qulyu", "quxyu", "culyu", "cuxyu"],
			["くょ", "qyo", "kulyo", "kuxyo", "qulyo", "quxyo", "culyo", "cuxyo"],
			["あ", "a"],
			["い", "i", "yi"],
			["う", "u", "wu", "whu"],
			["え", "e"],
			["お", "o"],
			["か", "ka", "ca"],
			["き", "ki"],
			["く", "ku", "cu", "qu"],
			["け", "ke"],
			["こ", "ko", "co"],
			["さ", "sa"],
			["し", "si", "ci", "shi"],
			["す", "su"],
			["せ", "se", "ce"],
			["そ", "so"],
			["た", "ta"],
			["ち", "ti", "chi"],
			["つ", "tu", "tsu"],
			["て", "te"],
			["と", "to"],
			["な", "na"],
			["に", "ni"],
			["ぬ", "nu"],
			["ね", "ne"],
			["の", "no"],
			["は", "ha"],
			["ひ", "hi"],
			["ふ", "hu", "fu"],
			["へ", "he"],
			["ほ", "ho"],
			["ま", "ma"],
			["み", "mi"],
			["む", "mu"],
			["め", "me"],
			["も", "mo"],
			["や", "ya"],
			["ゆ", "yu"],
			["よ", "yo"],
			["ら", "ra"],
			["り", "ri"],
			["る", "ru"],
			["れ", "re"],
			["ろ", "ro"],
			["わ", "wa"],
			["を", "wo"],
			["ん", "n", "xn", "n'"],
			["ゔ", "vu"],
			["が", "ga"],
			["ぎ", "gi"],
			["ぐ", "gu"],
			["げ", "ge"],
			["ご", "go"],
			["ざ", "za"],
			["じ", "zi", "ji"],
			["ず", "zu"],
			["ぜ", "ze"],
			["ぞ", "zo"],
			["だ", "da"],
			["ぢ", "di"],
			["づ", "du"],
			["で", "de"],
			["ど", "do"],
			["ば", "ba"],
			["び", "bi"],
			["ぶ", "bu"],
			["べ", "be"],
			["ぼ", "bo"],
			["ぱ", "pa"],
			["ぴ", "pi"],
			["ぷ", "pu"],
			["ぺ", "pe"],
			["ぽ", "po"],
			["ぁ", "xa", "la"],
			["ぃ", "xi", "li", "lyi", "xyi"],
			["ぅ", "xu", "lu"],
			["ぇ", "xe", "le", "lye", "xye"],
			["ぉ", "xo", "lo"],
			["ゃ", "xya", "lya"],
			["ゅ", "xyu", "lyu"],
			["ょ", "xyo", "lyo"],
			["ゎ", "xwa", "lwa"],
			["っ", "xtu", "ltu", "xtsu", "ltsu"],
			["ヵ", "xka", "lka"],
			["ヶ", "xke", "lke"],
			["←", "zh"],
			["↓", "zj"],
			["↑", "zk"],
			["→", "zl"],
			["『", "z["],
			["』", "z]"],
			["ヰ", "wyi"],
			["ゐ", "wyi"],
			["ヱ", "wye"],
			["ゑ", "wye"],
			["ー", "-"],
			["、", ","],
			["。", "."],
			["・", "/" , "z/"],
			["”", "\""],
			["“", "\""],
			["’", "'"],
			["￥", "\\"],
			["「", "["],
			["」", "]"]
		];
	}

	splitData() {
		const lines = this.data.split("\n");
		const lines_length = lines.length
		const speed_= lines[0].split("\t")[0].match(/^【\d?\.?\d?\d倍速】/)
		const speed_Fixed = [0.25,0.5,0.75,1.00,1.25,1.5,1.75,2]
		this.lyricsArray = []
		this.kanaLyric = ""
		this.titleSpeed = 1
		if(speed_){
			this.titleSpeed = parseFloat(speed_[0].slice(1))
			if(!speed_Fixed.includes(this.titleSpeed)){
				this.titleSpeed = 1
			}
		}

		for (let s=1; s<lines_length; s++){
			let LINE = lines[s].split("\t");

			if(s == 1){
				//先頭の行が["0", "", ""]出ない場合、["0", "", ""]を挿入
				if(+LINE[0] > 0 ){
					LINE = ["0", "", ""]
					s--
				}
			}

			if(LINE.length >= 3){

			}else{
				LINE.push("")
			}

			this.kanaLyric += LINE[2].replace(/[ 　]+$/,"").replace(/^[ 　]+/,"")+"\n"
			this.lyricsArray.push(LINE);

			if(LINE[1] == "end") {
				this.movieTotalTime = parseInt(LINE[0] * this.titleSpeed);
				this.movieTime_mm =("00" + parseInt(parseInt(this.movieTotalTime) / 60)).slice(-2)
				this.movieTime_ss = ("00" +(parseInt(this.movieTotalTime) - this.movieTime_mm * 60)).slice(-2)
				break;
			}
		};
		this.kanaLyric = this.kanaLyric
			.replace(/…/g,"...")
			.replace(/‥/g,"..")
			.replace(/･/g,"・")
			.replace(/〜/g,"～")
			.replace(/｢/g,"「")
			.replace(/｣/g,"」")
			.replace(/､/g,"、")
			.replace(/｡/g,"。")
			.replace(/　/g," ")
			.replace(/ヴ/g,"ゔ")
			.replace(/－/g,"ー")

	}


	createTypingData(){
		const romaMap_length = this.romaMap.length
		this.typingArrayKana = []
		this.typingArrayRoma = []

		for (let i=0; i<romaMap_length; i++){
			if(this.romaMap[i].length > 1){
				this.kanaLyric = this.kanaLyric.replace(RegExp(this.romaMap[i][0],"g"),"\t"+i+"\t");
			}
		};

		this.kanaLyric = this.kanaLyric.split("\n")

		for(let m=0;m<this.lyricsArray.length;m++){
			if(this.kanaLyric[m] && this.lyricsArray[m][1] != "end"){
				const arr = this.createKanaAndRomaWord(this.kanaLyric[m]);
				this.typingArrayKana.push(arr[0]);
				this.typingArrayRoma.push(arr[1]);
			} else {
				this.typingArrayKana.push([]);
				this.typingArrayRoma.push([]);
			}
		}
	}


	createKanaAndRomaWord(str) {
		var str_array = [];
		var kana_array = [];
		var roma_array = [];
		str = str.split("\t").filter(word => word > "")
		const str_length = str.length

		for (let i=0; i<str_length; i++){
			if(this.romaMap[parseInt(str[i])]){
				kana_array.push(this.romaMap[parseInt(str[i])][0]);
				str_array.push(this.romaMap[parseInt(str[i])].slice(1));
				roma_array.push(this.romaMap[parseInt(str[i])][1]);
				//促音の打鍵パターン
				if(kana_array.length >= 2 && kana_array[kana_array.length-2][kana_array[kana_array.length-2].length-1]=="っ"){
					if(this.sokuonJoin.includes(kana_array[kana_array.length-1][0])){
						const xtu_times = ( kana_array[kana_array.length-2].match( /っ/g ) || [] ).length

						kana_array[kana_array.length-1] = kana_array[kana_array.length-2] + kana_array[kana_array.length-1]
						kana_array.splice(-2,1)
						const length = str_array[str_array.length-1].length
						let repeat = []
						let xtu = []
						let ltu = []
						let xtsu = []
						let ltsu = []
						for(let s = 0;s<length;s++){
							repeat.push(str_array[str_array.length-1][s][0].repeat(xtu_times)+str_array[str_array.length-1][s])
							xtu.push("x".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							ltu.push("l".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							xtsu.push("x".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
							ltsu.push("l".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
						}

						str_array[str_array.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
						str_array.splice(-2,1)

						roma_array[roma_array.length-1] = str_array[str_array.length-1][0]
						roma_array.splice(-2,1)
					}else if(this.imperfectSokuonJoin.includes(kana_array[kana_array.length-1][0])){
						const xtu_times = ( kana_array[kana_array.length-2].match( /っ/g ) || [] ).length

						kana_array[kana_array.length-1] = kana_array[kana_array.length-2] + kana_array[kana_array.length-1]
						kana_array.splice(-2,1)

						const length = str_array[str_array.length-1].length
						let repeat = []
						let xtu = []
						let ltu = []
						let xtsu = []
						let ltsu = []
						for(let s = 0;s<length;s++){
							if(!this.imperfectSokuonRomaList.includes(str_array[str_array.length-1][s][0])){
								repeat.push(str_array[str_array.length-1][s][0].repeat(xtu_times)+str_array[str_array.length-1][s])
							}
							xtu.push("x".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							ltu.push("l".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							xtsu.push("x".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
							ltsu.push("l".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
						}

						str_array[str_array.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
						str_array.splice(-2,1)

						roma_array[roma_array.length-1] = str_array[str_array.length-1][0]
						roma_array.splice(-2,1)
					}
				}

				//n→nn変換
				const n_kana_check = kana_array[kana_array.length-2]
				if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){
					if(this.nnList.includes(kana_array[kana_array.length-1][0])){
						for(let n=0;n<str_array[str_array.length-2].length;n++){
							const str_pattern = str_array[str_array.length-2][n]
							if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
								str_array[str_array.length-2][n] = str_array[str_array.length-2][n]+"n"
							}
						}
						roma_array[roma_array.length-2] = str_array[str_array.length-2][0]
						//それ以外の文字でもnnの入力を可能にする
					}else if(kana_array[kana_array.length-1]){
						const array_length = str_array[str_array.length-1].length
						for (let i=0; i<array_length; i++){
							str_array[str_array.length-1].push("n"+str_array[str_array.length-1][i])
							str_array[str_array.length-1].push("'"+str_array[str_array.length-1][i])
						}
					}
				}

			} else{

				//打鍵パターン生成を行わなくて良い文字はそのままtyping_arrayに追加
				for (let v=0; v<str[i].length; v++){
					kana_array.push( str[i][v] );
					let typing_character = str[i][v]
					if(this.zenkakuList.includes(str[i][v])){
						typing_character = String.fromCharCode(typing_character.charCodeAt(0) - 0xFEE0);
					}
					roma_array.push(typing_character);
					if(/[A-Z]/.test(typing_character) ){
						typing_character = typing_character.toLowerCase()
					}
					str_array.push( [typing_character] );

					//n→nn変換
					if(v == 0){

						//ん
						const n_kana_check = kana_array[kana_array.length-2]
						//「アルファベット シングルクォート」の [n] 非対応の文字がkana_arrayに追加されたとき、 [n]→[nn] に置き換えます。
						if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){
							if(/[a-zA-Zａ-ｚＡ-Ｚ]/.test(kana_array[kana_array.length-1])||this.nnList.includes(kana_array[kana_array.length-1][0])){
								for(let n=0;n<str_array[str_array.length-2].length;n++){
									const str_pattern = str_array[str_array.length-2][n]
									if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
										str_array[str_array.length-2][n] = str_array[str_array.length-2][n]+"n"
									}
								}
								roma_array[roma_array.length-2] = str_array[str_array.length-2][0]
								//それ以外の文字でもnnの入力を可能にする
							}else if(kana_array[kana_array.length-1]){
								const array_length = str_array[str_array.length-1].length
								for (let i=0; i<array_length; i++){
									str_array[str_array.length-1].push("n"+str_array[str_array.length-1][i])
									str_array[str_array.length-1].push("'"+str_array[str_array.length-1][i])
								}
							}
						}
					}
				}
			}

		};

		//kana_array最後の文字が「ん」だった場合も[nn]に置き換えます。
		if(kana_array[kana_array.length-1] == "ん"){
			roma_array.splice(-1,1,'nn')
			str_array[str_array.length-1][0] = 'nn'
			str_array[str_array.length-1].push("n'")
		}
		return [kana_array, roma_array];
	}

	getTypingDataInfo() {

		this.lineDifficultyDataRoma = []
		this.lineDifficultyDataKana = []
		this.totalNotesKanaMode = 0
		this.totalNotesRomaMode = 0
		for (let i=0; i<this.lyricsArray.length; i++){

			//typing_arrayのi番号がend行と同じ番号なら総合打鍵数に含まない
			if(this.lyricsArray[i][1]!='end' && this.typingArrayRoma[i] != ''){

				const LINE_SPEED = this.lyricsArray[i+1][0]-this.lyricsArray[i][0]

				//かな入力
				const LINE_DAKU_HANDAKU = (this.typingArrayKana[i].join('').match( /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g ) || [] ).length
				const LINE_NOTES_KANA = this.typingArrayKana[i].join('').replace(/ /g,"").length
				this.totalNotesKanaMode += (LINE_NOTES_KANA + LINE_DAKU_HANDAKU)

				//ローマ字入力
				const LINE_NOTES_ROMA = this.typingArrayRoma[i].join('').replace(/ /g,"").length
				this.totalNotesRomaMode += LINE_NOTES_ROMA

				this.lineDifficultyDataRoma.push(LINE_SPEED > 0 ? (Math.round((LINE_NOTES_ROMA / LINE_SPEED) * 100) / 100) * this.titleSpeed : 0)
				this.lineDifficultyDataKana.push(LINE_SPEED > 0 ? (Math.round(( (LINE_NOTES_KANA + LINE_DAKU_HANDAKU) / LINE_SPEED) * 100) / 100) * this.titleSpeed : 0)

			}else if(this.lyricsArray[i][1]=='end'){

				this.medianRomaSpeed = this.median(this.lineDifficultyDataRoma);
				this.medianKanaSpeed = this.median(this.lineDifficultyDataKana);
				this.maxRomaSpeed = Math.max(...this.lineDifficultyDataRoma)
				this.maxKanaSpeed = Math.max(...this.lineDifficultyDataKana)
				break;
			}

		};
	}

	median(arr) {
		arr = arr.filter(function(a) {return a !== 0;})
		var half = (arr.length/2)|0;
		var temp = arr.sort((a, b) => a - b);

		if (temp.length%2) {
			return temp[half];
		}

		return (temp[half-1] + temp[half])/2;
	};
}