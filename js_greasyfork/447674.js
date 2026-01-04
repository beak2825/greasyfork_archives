// ==UserScript==
// @name         Typing Tube MOD Add CSS
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Typing Tube MOD用のCSSを追加するライブラリ
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

	const play_css = document.createElement('style')
	play_css.type = 'text/css';
	play_css.innerHTML =
		`
`
	document.getElementsByTagName('HEAD').item(0).appendChild(play_css);

	var setting_css = document.createElement('style')
	setting_css.type = 'text/css';
	setting_css.innerHTML=`
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


#osusume1,#osusume2 {
  cursor: pointer;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  padding: 12px;
  margin: 0px auto 0;
  background: #4caf50;
  z-index: 105;

  color: white;
}
#osusume1 {
float:left;
}#osusume2{
float:right;
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
#practice-setting fieldset{
    padding: revert!important;
    margin: revert!important;
    border: groove!important;
    height: 160px;
    margin-left: 1rem!important;

}
#practice-setting > * {
    margin-left: 1rem!important;
}
#practice-setting legend{
width:auto;
}
#practice-setting{
    display: inline-flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 1rem;
}
#practice-setting fieldset div {
    margin-bottom: 1rem;
}




.bar_text{display: flex;justify-content: space-between;align-items: baseline;position: relative;}
.flex_space_between{display: flex;justify-content: space-between;}
#combo-value{position: relative;top: -3px;font-size: 20px;}
#complete_effect{font-size: 140%;letter-spacing: 2px;position: absolute;left: 50%;transform: translate(-50%);-webkit-transform: translate(-50%);}
#line_remaining_time{font-size: 14px;}
#count-anime{
    font-size: 45px;
    font-weight: 600;
    position: relative;
}
#count-anime > span{
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
}
body ::-webkit-scrollbar {
    width: 10px;
    background-color: rgb(0 0 0 / 39%);
    -webkit-border-radius: 100px;
    height:10px;
}
body ::-webkit-scrollbar-corner {
  background:transparent;
}
body ::-webkit-scrollbar-thumb {
    background: hsla(0,0%,100%,.5);
    -webkit-border-radius: 100px;
    background-clip: padding-box;
    border: 2px solid hsla(0,0%,100%,0);
    min-height: 10px;
}

.status_border {
    border-bottom: solid thin;
    opacity: 0.25;
}
#volume_control_area{
    display: flex;
    position: relative;
    align-items: baseline;
    margin-right: 42px;
}

#volume-label{
    position: absolute;
    z-index: -1;
    top: -22px;
    color: #FFFFFF88;
}
#volume{
    background: #00000088;
    padding: 3px;
    border: solid thin;
    border-radius: 5px;
    position: absolute;
    top: -5px;
    min-width: 25px;
    text-align: center;
}
group + group {
	margin-top: 20px;
	font-weight:600;
  }
  .inline-radio {
	display: flex;
	overflow: hidden;
	border: 1.5px solid #ffffff;
	font-weight:600;
	border-radius: 0;
    margin-top: 12px;
  }
  .inline-radio div {
	position: relative;
	flex: 1;
    word-break: keep-all;
    text-align: center;
  }
  .inline-radio input {
	width: 100%;
	height: 60px;
	opacity: 0;
  }
  .inline-radio label {
	display: grid;
    justify-items: center;
    align-content: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	color:#fff;
	border-right: 1.5px solid #ffffff;
	border-radius: 0;
}
  .inline-radio div:last-child label {
	border-right: 0;
  }
  .inline-radio .roma:checked + label {
	background: #17a3b8d2!important;
	color: #fff;
  }
  .inline-radio .kana:checked + label {
	background: #de781fde!important;
	color: #fff;
  }
  .inline-radio .flick:checked + label {
	background: #59e04db6!important;
	color: #fff;
  }
  .inline-radio .roma:hover + label {
	background: #17a3b856;
	color: #fff;
  }
  .inline-radio .kana:hover + label {
	background: #de781f85;
	color: #fff;
  }
  .inline-radio .flick:hover + label {
	background: #59e04d3b;
	color: #fff;
  }
  span.btn-border:hover {
	background: rgba(245, 245, 245, 0.356);
  }
.status_name{font-weight:normal;margin-left:1.5px;}
.flex_space_between{display: flex;justify-content: space-between;}
#missmark{text-shadow: initial;}
.gothicfont{font-family: Segoe UI , "Yu Gothic","YuGothic",sans-serif !important;}
#kashi_area{cursor:none!important;user-select: none !important;-ms-user-select: none !important;-moz-user-select: none !important;-webkit-user-select: none !important;}
.select_none{user-select: none !important;-ms-user-select: none !important;-moz-user-select: none !important;-webkit-user-select: none !important;}
[onclick='submit_score()']:after{content:'Enterキーでランキング送信';}
.character-scroll{white-space: nowrap;position:relative;height: 1.5em;overflow:hidden;}
.jp_word{word-break:break-all;}
.eng_word{word-wrap: break-word;overflow-wrap:break-word;}
.daken_moji{font-family:sans-serif;letter-spacing: 0.7px;font-weight:normal;}
.progress{margin-bottom: 0!important;}
#kashi_sub{margin-bottom:0.5rem;}
#kashi{font-size:1.65rem;}
#kashi_next{margin-top:0px!important; text-overflow: ellipsis;}
#controlbox .col-6{padding-right: 0!important;}
#controlbox{margin-left:0px!important;    padding-top: 6px;}
#status{font-size:1.4rem;white-space: nowrap;letter-spacing:0.1em;margin-bottom: 0;}
#life,#keep{font-size: 80%;background: rgb(0 0 0 / 60%);padding: 3px 7px 3px 7px;border-radius: 15px;color:gold;}
.correct_sub{line-height:0;padding-top: 8px;padding-bottom:15.5px;font-size:95%;font-weight:normal;}
#total-time{font-weight:600;color:#fff;font-family: sans-serif;}
#seek_line_close:hover{  cursor: pointer;text-decoration : underline;}
.practice-mode .result_lyric:hover{  cursor: pointer; text-decoration: underline;background: rgb(0 0 0 / 60%);
    width: fit-content;
    padding-right: 7px;
    border-radius: 5px;
	}
#typing-line-list-container {
    text-indent: 5px;
	background-color: rgba(0,0,0,.33);
    position: relative;
    }
#typing-line-result {
    word-break: break-all;
    overflow: scroll;
    max-height: 700px;
    font-size: 130%;
    font-weight: 600;
    list-style-type: none;
    padding-left: 0;
}
#line-result-head {
    font-size:21px;
    margin:0px!important;
    padding-bottom: 5px;
    color:#FFF;
	font-weight: 600;
}
#gauge2{height:13px!important;border-top:thin #FFEB3B solid;border-right:thin #FFEB3B solid;border-bottom:thin #FFEB3B solid;}
.kashi_omit{
        overflow: hidden;
        white-space: nowrap;}
.col-4{padding-top:4px;}
#gauge{width: 75%;padding-left: 10px;}
.underline, .hover_underline:hover{text-decoration: underline;}
.uppercase{text-transform:uppercase;}
.lyric_space{text-indent: -1rem;}
#btn_container{
    display: flex;
    margin-top: 10px;
    align-content: stretch;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-end;
}
.result_lyric {
    list-style-type: none;
}
ol .result_lyric {
    margin-bottom: 3rem;
}
.seikou,.sippai{
   margin-left:5px;
}
.line_numbering{
    text-indent:2px;
    font-size:80%;
    font-weight:normal;
}
.flex_status_position{margin-left: 3px;position:relative;}
#status td{
position: relative;
}
.status_label{
    position: absolute;
    top:1rem;
    left: -40px;
    font-size:75%;
}
.flex_status_border{
    border-top: solid thin;
    position: absolute;
    width: 100%;
    bottom: 0.5px;
    min-width: 5.5rem;
    left: -2px;
}


progress{width:100%;height:3px!important;-webkit-appearance: scale-horizontal;appearance: scale-horizontal;margin-top:1vw;}
@-moz-document url-prefix() {
progress{height:5px!important;appearance:none;}
}

div#gauge1 {
    position: relative;
    top: 5px;
    border-top: thin solid;
    border-bottom: thin solid;
    border-left: thin solid;
}
.progress2{margin-bottom: 0.5vw; -webkit-box-shadow: inset 0 0.1vw 0.2vw rgba(0,0,0,.1);box-shadow: inset 0 0.1vw 0.2vw rgba(0,0,0,.1);border-radius: 0;display: flex;font-size: .75rem;line-height: 3px;text-align: center;background-color: rgba(255,255,255,.1);}

.combo_animated {
	animation-duration: 0.6s;
	animation-fill-mode: both;
}


@keyframes combo_anime {
	0% {
		transform:scale(1.1,1.2);
	} 2% {
		transform:scale(1.1,1.3);
	} 9% {
		transform:scale(1,1);
	}
}

#combo_anime {
	animation-name: combo_anime;
    display: inline-block;
}

.count_animated {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}


@keyframes countdown_animation {
	from {
		opacity: 1;
	} to {
		opacity: 0.0;
	} 10% {
		opacity: 0.9;
	} 20% {
		opacity: 0.8;
	} 30% {
		opacity: 0.7;
	} 40% {
		opacity: 0.6;
	} 50% {
 		opacity: 0.5;
	} 60% {
		opacity: 0.4;
	} 70% {
		opacity: 0.3;
	} 80% {
		opacity: 0.2;
	} 90% {

		opacity: 0.1;
	}
}
.complete_animated {
	-webkit-animation-duration: 0.7s;
	animation-duration: 0.7s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}
.countdown_animation {
	-webkit-animation-name: countdown_animation;
	animation-name: countdown_animation;
	-webkit-transform-origin: center center;
	transform-origin: center center;
}
#volume_control {
  -webkit-appearance: none;
  width: 11rem;
  background: transparent;
  margin-right: 10px;
}

#volume_control:focus {
  outline: none;
}

#volume_control::-webkit-slider-runnable-track {
  height: 1.5rem;
  margin: 0;
  width: 100%;
  background: #464646;
  background: linear-gradient(
    to bottom right,
    transparent 50%,
    #000000bb 50%
  );
}

#volume_control::-moz-range-track {
  height: 1.5rem;
  margin: 0;
  width: 100%;
  background: #464646;
  background: linear-gradient(
    to bottom right,
    transparent 50%,
     #000000bb 50%
  );
}


#volume_control::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1.9rem;
  width: 0.5rem;
  background: #ffffff;
  border: 1px solid;
  margin-top: -3px;
  border-radius: 3px;
}



#volume_control::-moz-range-thumb {
  -webkit-appearance: none;
  height: 1.9rem;
  width: 0.5rem;
  background: #ffffff;
  border: 1px solid;
  border-radius: 3px;
  margin-top: 0;
}

#volume_control:focus::-moz-range-thumb {
  box-shadow: 0px 0px 7px 3px #0065c4;
}


.control_option{
    color:rgba(255,255,255,.85);
    background:transparent;
    border:outset thin;
    border-radius: 15px;
    padding-left: 8px;
    padding-right: 8px;
display:inline-flex;
}
.time_adjust_head{
    border: solid thin #777;
    background: #222;
    color: #eee;
    display: inline-flex;
    align-items: center;
}
[id*="time_settings"]{
    margin-top: 8px;
    width: 100%;
    justify-content: space-between;
    align-items: baseline;
}
#time_{
transform: scale(0.8,0.8);
margin-right:5px;
position:relative;
top:0.5px;
left: -4px;
}
#time_diff{
    transform: scale(1.1,1.1);
    position: relative;
    left: -4px;
}
#more_shortcutkey{
    background: #4d4d4d;
    color: #ccc;
    border: solid thin #777;
    padding-right:0px;
    padding-left:0px;
}
#restart span{
    transform: scale(0.9,0.9);
}
#more_shortcutkey span{
    transform: scale(0.8,0.8);
}
.shortcut_navi{
    background: #4d4d4d;
    color:#ccc;
    padding:1px 5px 2px 5px;
    border-radius: 5px;
    margin-left: 2px;
}
.shortcut-navi-display-block {
    display:block;
    background: #4d4d4d;
    color: #ccc;
    margin-left: auto;
    margin-right: auto!important;
    width: min-content;
    padding: 1px 3px 1px 3px;
    border-radius: 5px;
	margin-top: 3px;
    font-size: 10px;
}
.control-option2 {
    border-radius: 15px;
    width: 12rem;
    display: inline-flex;
    justify-content: center;
    border: none;
    padding: 1px 10px 0px 10px;
    color: #FFF;
}
.short_popup{
    position: absolute;
    background: hsl(0deg 0% 8%);
    border: solid #FFF;
    z-index: 5;
    font-weight: 600;
    display:none;
	padding-top:1.5rem;
}
#shortcut {
    top: 252px;
    right: 0;
}
#shortcut > div{
margin-bottom:1.5rem;
display: flex;
justify-content: flex-start;
}
#practice-shortcutkeys{
    margin-top: 1rem;
}
#practice-shortcutkeys > div{
margin-bottom:12px;
}
.line-list-text-shadow{
    text-shadow: 0.6px 0.6px 0px #000, -0.6px -0.6px 0px #000, -0.6px 0.6px 0px #000, 0.6px -0.6px 0px #000, 0.6px 0px 0px #000, -0.6px 0px 0px #000, 0px 0.6px 0px #000, 0px -0.6px 0px #000;
}
`
	document.getElementsByTagName('HEAD').item(0).appendChild(setting_css);