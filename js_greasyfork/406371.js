    // ==UserScript==

//タイピングワード表示の処理高速化のため

//playheadupdate()、keydownfunc(event)、keypressfunc_kana()、keydownfunc_kana()
//parseRomaMap(),parseLyrics(),hiraganaToRomaArray()、checkNextChar()、update_status()、getScorePerChar(),onPlayerStateChange()

//以上の9つの関数を書き換えています。書き換えているコード内に解説を記載しています
//このスクリプトの適応時は書き換えた関数が発動しているので注意をお願いします


// @name         Typing Tube MOD official debug
// @namespace    https://typing-tube.net/
// @version      23.2.5
// @description  try to take over the world!
// @author       Toshi
// @match        https://typing-tube.net/movie/show/*?test=test
// @match        https://typing-tube.net/movie/typing/*?test=test
// @noframes
// @run-at document-end


// @downloadURL https://update.greasyfork.org/scripts/406371/Typing%20Tube%20MOD%20official%20debug.user.js
// @updateURL https://update.greasyfork.org/scripts/406371/Typing%20Tube%20MOD%20official%20debug.meta.js
// ==/UserScript==
var next_kpm = 0;//次のラインの必要kpm
var line_remaining_time = 0;//ラインの残り時間
let latency = (0).toFixed(3)
var line_playing_time = 0;//現在ラインの入力時間(ライン切替時0になる)
var past_playing_time = 0;//過去のラインの合計入力時間
var playing_time_current = 0;//入力時間(累計)
var movie_mm;
var movie_ss;
var line_typingspeed = 0;//ラインの打鍵速度
var line_typingspeed_rkpm = 0;//初速を無視したライン打鍵速度
var typing_speed = 0;//累計打鍵速度


var clear_percent=0
var clear_gauge1=0
var clear_gauge2=0
var clear_linecounter=0
var ranking_array = [];
var escape_word_length = 0; //ミス制限モードで使用する逃した数
let miss_mode_life = "miss"


var latencylog = ["0"]
var kpmlog=["0"]
var rkpmlog=["0"]
var nokorimoji_log=["0"]
var inputline_counter=[]
var misstyping_count_save = 0
var line_misscount =["0"]
var initial_diff=0.0
var initial_speed=[]
var initial_speed1=1.0
var initial_speed2=1.0
var initial_speed3=1.0
var initial_speed4=1.0
var initial_speed5=1.0

let miss_limit_color="gold"
let miss_limit_color_keep_corrent="gold"
let logcount =0
let count_save = -1;//ライン切替時、ライン数を取得する。フラグ用
let typing_count_save = 0;//ライン切替時、現在の打鍵数を取得する
let ending = false;
let game_clear = false
let practice_failure=false
let clear_sound_flag = false;
let combo100 = false;
let ranking = false;
let countdown_anime = false//カウントダウンアニメのフラグ

document.getElementById("modal-open").classList.add('no_select');

var setting_css =document.createElement('style')
setting_css.innerHTML=`.combo_animated {
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
// 		opacity: 0.5;
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

.countdown_animation {
	-webkit-animation-name: countdown_animation;
	animation-name: countdown_animation;
	-webkit-transform-origin: center center;
	transform-origin: center center;
}

/*タブのスタイル*/
.tab_item {
  width: calc(100%/4);
  height: 30px;
  line-height: 30px;

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
.colorChooser {

    top: -130px;
zoom:80%;
}
.tab_item:hover{
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
.tab_content_description{
border-bottom:1px solid #fff;
border-left:1px solid #fff;
border-right:1px solid #fff;
}
.tab_content_description h6
{
margin-left: 10px;
}
.tab_content_description label {
margin-left: 10px;
}
.tab_content_description label input {
margin-right: 5px;
margin-left: 5px;
}
form #mod_setting p {
    margin-bottom: 0;
}
/*ラジオボタンを全て消す*/
input[name="tab_item"],input[name="input_page"],input[name="details"] {
  display: none;
}

/*タブ切り替えの中身のスタイル*/
.tab_content,
.page_content,
.details_content {
  display: none;
  clear: both;

}

.tab_content h6{
margin-bottom:0;
padding-top: 10px;
margin-right: 10px;
}
.input_page{
margin-bottom:2px;
padding-top: 7.5px;
margin-left: 0px!important;

}.input_page:hover{
text-decoration: underline;

}.tab_content h6:nth-child(n+5){
border-top-style: inset;
}

/*選択されているタブのコンテンツのみを表示*/
#all:checked ~ #all_content,
#design:checked ~ #design_content,
#playcolor:checked ~ #playcolor_content,
#etc:checked ~ #etc_content,
#page1:checked ~ #page1_content,
#page2:checked ~ #page2_content,
#details:checked ~ #details_content {
  display: block!important;
}

/*選択されているタブのスタイルを変える*/
input:checked + .tab_item {
border-bottom:hidden;

  color: #fff!important;
}
input:checked + .input_page,#details:checked+.details {

  color: #919395!important;
}
#modal-overlay{
z-index:2;display:none;position:fixed;top:0;left:0;width:100%;height:120%;
}
#mod_setting .btn{
padding-top:0px;
padding-bottom:0px;
}


#close,#close2 {
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
#close{
float:left;
}#close2{
float:right;
}
#mask {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 98;
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
  z-index: 101;
}
#mask.hidden {
  display: none;
}

#modal.hidden {
  display: none;
}`
document.head.appendChild(setting_css);

//設定を追加
var setting_html = document.createElement('form');
    setting_html.setAttribute("id", "mod_setting");
    setting_html.setAttribute("style", "color:#fff; z-index:100;display:none;position:fixed;word-break: break-all;width:580px;max-height: 900px;background-color: rgba(0,0,0,0.96);");
    setting_html.innerHTML='<input id="all" type="radio" name="tab_item" checked><label class="tab_item" for="all">プレイ設定</label><input id="design" type="radio" name="tab_item"><label class="tab_item" for="design">エフェクト設定</label><input id="playcolor" type="radio" name="tab_item"><label class="tab_item" for="playcolor">配色設定</label><input id="etc" type="radio" name="tab_item"><label class="tab_item" for="etc">ステータス設定</label>'+
'<div class="tab_content" id="all_content"><div class="tab_content_description"><p class="c-txtsp">'+
'<button type="button" id="osusume" style="position:absolute;right:130px;bottom:10px;">おすすめ設定</button>'+
'<h6 style="float:left;">入力モード設定</h6><input id="page1" type="radio" name="input_page"checked><label class="input_page" for="page1">＜Page1</label><input id="page2" type="radio" name="input_page"><label class="input_page" for="page2">Page2＞</label>'+
'<div class="page_content" id="page1_content"><div class="page_content_description"><p class="c-txtsp">'+
'<label title="かな表示モードは大文字ローマ字。ローマ字表示モードはかな表示が表示されます。"><input type="checkbox" value="sub"checked>ローマ字orひらがなも表示</input></label><br><label title="促音→「った」を[ltuta.xtuta]。拗音→「しゃ」を[silya,sixya]。等の手間がかかる入力パターンを無効化します。少ない打鍵数で入力したい方におすすめです。"><input type="checkbox" value="mizumasi">促音・拗音の入力パターンを最適化</label><br><label title="2文字以上ある英数字・記号を先頭の文字色とアンダーラインでハイライトさせます。"><input type="checkbox" value="eng_highlight">英数字をハイライト(かな表示のみ)</input></label><br>'+
'</p></div></div>'+
'<div class="page_content" id="page2_content"><div class="page_content_description"><p class="c-txtsp">'+
'<label title="タイピングワードが一行に収まるように表示され、指定した文字数入力するとワードがスクロールされていきます。"><input type="checkbox" value="letter_scroll">タイピングワードをスクロール表示</input></label><br><span class="scroll_amount"><span style="margin-left:13px;">└</span><label><input type="number"name="letter_scroll_kana"min="0" max="30"value="10">かな表示スクロール数</input></label><label><input type="number"name="letter_scroll_roma"min="0" max="30" value="16">ローマ字表示スクロール数</input></label></span>'+
'<label title="タイピングデータにスペース・記号系が含まれていても、こちらの設定を変更することで省略できます。省略しても100点を取ることは可能です。変更後はページを更新してください。"><input type="checkbox" value="word_disable">スペース・記号を省略する</label><span id=word_making style=display:none;><span style="margin-left:13px;">└</span><label title="スペースの入力を省略します"><input type="checkbox" value="space_disable">スペース</label><label title="記号の入力を省略します"><input type="checkbox" value="kigou_disable">記号(長音記号「ー～」は除く)</label><label title="全角チルダ記号「～」を全角長音記号「ー」に置き換えます。"><input type="checkbox" value="chiruda_chouoxn">「～」記号を「ー」として扱う</label></span>'+
'<label title="アルファベット大文字をSHIFT有り+アルファベット。アルファベット小文字をSHIFT無し+アルファベットで入力できるようにします。有効にした場合は一度ページを更新してください。" style=display:block;><input type="checkbox" value="oomoji_shift">アルファベット入力でSHIFTキーを使用する</label>'+
'</p></div></div>'+
'<h6>制限モード</h6><label title="次の歌詞とライン経過時間を隠します。いきなり現れた文字を瞬時に入力するスキルを鍛えることができます。"><input type="checkbox" value="line_hidden">初速測定モード</input></label><br><label title="正確率に制限をかけるモードです。指定した正確率より下回ると動画が強制終了します。タイピングの正確性を上げる目標設定です。"><input type="checkbox" value="perfect_mode">ミス制限モード</input></label><label class="miss_limit">目標正確率<input type="number"name="miss_limit" value="95" min="0" max="100">%</input><label title="目標正確率を下回った瞬間にゲームオーバーになります。玄人向け"><input type="radio" name=miss_limit_mode value="keep_corrent">正確率を維持</input></label><label title="目標正確率を達成する為のライフがstatusに表示されます。タイピングワードを逃す程ライフが減り、1ミスすると-1点されます。ライフがマイナスになると、目標正確率は達成不可能になりゲームオーバーになります。"><input type="radio" name=miss_limit_mode value="life_corrent" checked>ライフ制</input></label><label title="ゲームオーバーすると効果音が鳴るようになります。"><input type="checkbox" value="gameover_sound" checked>ゲームオーバー音</input></label><label><input type="number"name="effect_volume_gameover"min="0" max="100" value="70"></input></label></label>'+
'<h6>効果音・音量</h6><label title="正解打鍵をした時に効果音がなるようになります。"><input type="checkbox" value="type_sound">打鍵音</input></label><label><input type="number"name="effect_volume_type"min="0" max="100" value="70"></input></label><label title="ミス打鍵をした時に効果音がなるようになります。"><input type="checkbox" value="miss_sound">ミス音</input></label><label><input type="number"name="effect_volume_miss"min="0" max="100" value="70"></input></label><br><label title="ライン中のタイピングワードをすべて入力した時に効果音がなるようになります。"><input type="checkbox" value="clear_sound">クリア音</input></label><label><input type="number"name="effect_volume_clear"min="0" max="100" value="70"></input></label><label title="100コンボ以上コンボが続いている時にミスをすると、効果音が鳴るようになります"><input type="checkbox" value="combo_break_sound">100コンボ以上のミス音</input></label><label><input type="number"name="effect_volume_combo_break"min="0" max="100" value="70"></input></label><br><label title="動画音量に合わせて効果音音量も変更されます。無効にすると効果音毎で個別に音量指定ができます。"><input type="checkbox" value="Interlocking_volume"checked>曲音量と効果音音量を連動</input></label>'+
'<br></p></div></div>'+
'<div class="tab_content" id="design_content"><div class="tab_content_description"><p class="c-txtsp">'+
'<h6>エフェクト設定</h6><label title="ミスをした文字の上に「・」マークが表示されます。"><input type="checkbox" value="miss_on"checked>ミスエフェクト</label><label><input class="color" value="#FF3554" name="miss_color">色で表示</label><br><label title="３・２・１・GO!のカウントダウンが表示されます。間奏中にも歌詞がある場合は表示されません。"><input type="checkbox" value="anime_count" checked>間奏終了前にカウントダウン</label><label><input class="color" value="rgba(255,255,255,0.9)" name="countdown_color">色で表示</label><label title="カウントダウンが秒数ごとにフィードアウトされるようになります。"><input type="checkbox" value="count_animation" checked>アニメーション</label><br><label title="スキップ可能な時に「Type ~ key to skip. ⏩」と表示されるようになります。表示されているときにスペースキー又はEnterキーを押すとライン切り替わり1秒前にスキップします。"><input type="checkbox" value="skip_guide" checked>任意スキップ</label><label><input class="color" value="rgba(255,255,255,0.53)" name="skipguide_color">色で表示</label><label title="スキップ機能で使用するキーをスペースキーにします。"><input type="radio" name=skip_button value="skip_space" checked>スペースキー</label><label title="スキップ機能で使用するキーをEnterキーにします。" style="margin-left:0;"><input type="radio" name=skip_button value="skip_enter">Enterキー</label><br><label title="タイピングワードの上部に現在コンボを表示します。この機能を有効にし、ステータス設定のコンボ表示をOFFにするのもおすすめです"><input type="checkbox" value="combo_display">現在コンボを表示</label><label><input class="color" value="#FFFFFF" name="combo_color">色で表示</label><label><select name="combo_position"><option value="left">左寄せ</option><option value="center">中央</option></select></label><label title="コンボが更新される度、コンボ数が前面に押し出されたように表示されます。"><input type="checkbox" value="combo_animation" checked>アニメーション</label><br><label title="動画下にラインクリア率ゲージを表示します。達成したクリア率に応じた色のトロフィーも表示されます。"><input type="checkbox" value="gauge" >ラインクリア率ゲージを表示(デモ)</input></label><br><button style="margin:10px" type="button" onclick="effectcolor_reset()">エフェクトの色をリセット</button>'+
'<h6>フォント設定</h6><label title="タイピングワード部分のフォントを游ゴシックフォントに変更します。游ゴシックフォントがPCにインストールされていない場合は変更されません。"><input type="checkbox" value="font_Gothic"checked>游ゴシックフォントを使用</input></label><br>'+
'<label><input type="number"name="font_size_kana"min="1" max="25" step="0.5" value="17.5">かな表示フォントサイズ</input></label><label><input type="number"name="font_size_roma"min="0" max="25" step="0.5" value="17.5">ローマ字表示フォントサイズ</input></label>'+
'<br><h6>歌詞の色/表示</h6><label>入力後<input class="color" value="#0099CC" name="correctword_color"></label><label>ラインクリア<input class="color" value="#1eff52" name="lineclear_color"></label><label>先頭の文字<input class="color" value="#FFFFFF" name="first_color"></label><label>未入力<input class="color" value="#FFFFFF" name="word_color"></label><br><label>歌詞<input class="color" value="#FFFFFF" name="lyric_color"></label><label>次の歌詞<input class="color" value="rgba(255,255,255,.7)" name="next_lyrics_color"></label><label title="次の歌詞に通常の歌詞を表示します。"><input type="radio" name=next_text value="next_text_lyric"checked>歌詞</input></label><label title="次の歌詞に実際に入力する文字(歌詞のふりがな)を表示します"><input type="radio" name=next_text value="next_text_reading">よみ</input></label>'+
'<br><select style="margin:10px" name="color_theme"><option value="プリセット">プリセットから色変更</option><option value="デフォルト">デフォルト</option><option value="先頭の文字を赤く強調">先頭の文字を赤く強調</option></select><label title="歌詞があっても入力が不要なラインは[次の歌詞]に歌詞を表示しません。装飾譜面や演出に有効です。"><input type="checkbox" value="next_lyric_hidden">非入力lineは[次の歌詞]に表示しない</input></label>'+
'<br></p></div></div>'+
'<div class="tab_content" id="playcolor_content"><div class="tab_content_description"><p class="c-txtsp">'+
'<h6>背景カラー</h6><label><input class="color" value="transparent" name="playarea_color"id="input2"></label><label><input type="number" name="playarea_radius" min="0" max="30" value="0"step="1">px</input>縁を丸める</label><br>'+
'<label>縁取り線<select name="futidori_theme"><option value="none" selected>なし</option><option value="solid">１本線</option><option value="double">２本線</option><option value="groove">立体線(窪む)</option><option value="ridge">立体線(隆起)</option><option value="outset">立体線(影)</option><option value="dashed">破線</option><option value="dotted">点線</option></select></label><label>縁の色<input class="color" value="#FFFFFF" name="futidori_color"></label><label>太さ<select name="futidori_border-width"><option value="medium" selected>普通</option><option value="thin">細い</option><option value="thick">太い</option></select></label><br><button type="button" onclick="playareacolor_reset()" class="m-3">背景カラーをリセット</button><br>'+
'<h6>ラインカラー</h6><label>ラインゲージ<input class="color" value="#17a2b8" name="line_color"></label><label>empty<input class="color" value="#f5f5f5" name="line_empty_color"></label><br><label>ラインゲージ2<input class="color" value="#ffc107" name="line_color2"></label><label>empty<input class="color" value="#f5f5f5" name="line_empty_color2"></label><br><button type="button" onclick="linecolor_reset()" class="m-3">ラインカラーをリセット</button>'+
'<h6>ステータス/コントロール文字色</h6><label>ステータス<input class="color" value="#FFFFFF" name="status_color"></label><label>自分の色<input class="color" value="#20c997" name="me_color"></label><br><label>コントロール<input class="color" value="rgba(255,255,255,.85);" name="control_color"></label><br><button type="button" onclick="subtextcolor_reset()" class="m-3">ステータス/コントロール文字色をリセット</button>'+
'<br></p></div></div>'+
'<div class="tab_content" id="etc_content"><div class="tab_content_description"><p class="c-txtsp">'+
'<h6>プレイ前設定</h6><label title="プレイ中に変更できる時間調整の初期値を変更します。打ち始めのタイミングが合わないときは、+0.1~+0.2程タイミングを早めるのもおすすめです">時間調整オフセット<span class="btn btn-link" title="タイミングが遅くなります。SHIFTキーを押しながらクリックすると-0.1します。" style="cursor: pointer"onclick="initial_diff_minus()">-</span><span id="initial_diff">'+initial_diff.toFixed(2)+'</span><span class="btn btn-link" title="タイミングが早くなります。SHIFTキーを押しながらクリックすると+0.1します。" style="cursor: pointer"onclick="initial_diff_plus()">+</span></label><button type="button" onclick="initial_diff_reset()">初期値に戻す</button>'+
'<br><label title="プレイ開始前に決める挑戦速度の初期値を変更します。この値を変更するとLv1の挑戦速度が変更されます。">Lv１の挑戦速度<span class="btn btn-link" title="Lv1の動画が遅くなります" style="cursor: pointer"onclick="initial_speed1_down()">-</span><span id="initial_speed1">'+initial_speed1+'</span><span class="btn btn-link" title="Lv1の動画が速くなります" style="cursor: pointer"onclick="initial_speed1_up()">+</span></label>'+
'<label title="プレイ開始前に決める挑戦速度の初期値を変更します。この値を変更するとLv2の挑戦速度が変更されます。">Lv２の挑戦速度<span class="btn btn-link" title="Lv2の動画が遅くなります" style="cursor: pointer"onclick="initial_speed2_down()">-</span><span id="initial_speed2">'+initial_speed2+'</span><span class="btn btn-link" title="Lv2の動画が速くなります" style="cursor: pointer"onclick="initial_speed2_up()">+</span></label>'+
'<br><label title="プレイ開始前に決める挑戦速度の初期値を変更します。この値を変更するとLv3の挑戦速度が変更されます。">Lv３の挑戦速度<span class="btn btn-link" title="Lv3の動画が遅くなります" style="cursor: pointer"onclick="initial_speed3_down()">-</span><span id="initial_speed3">'+initial_speed3+'</span><span class="btn btn-link" title="Lv3の動画が速くなります" style="cursor: pointer"onclick="initial_speed3_up()">+</span></label>'+
'<label title="プレイ開始前に決める挑戦速度の初期値を変更します。この値を変更するとLv4の挑戦速度が変更されます。">Lv４の挑戦速度<span class="btn btn-link" title="Lv4の動画が遅くなります" style="cursor: pointer"onclick="initial_speed4_down()">-</span><span id="initial_speed4">'+initial_speed4+'</span><span class="btn btn-link" title="Lv4の動画が速くなります" style="cursor: pointer"onclick="initial_speed4_up()">+</span></label>'+
'<label title="プレイ開始前に決める挑戦速度の初期値を変更します。この値を変更するとLv5の挑戦速度が変更されます。">Lv５の挑戦速度<span class="btn btn-link" title="Lv5の動画が遅くなります" style="cursor: pointer"onclick="initial_speed5_down()">-</span><span id="initial_speed5">'+initial_speed5+'</span><span class="btn btn-link" title="Lv5の動画が速くなります" style="cursor: pointer"onclick="initial_speed5_up()">+</span></label><br><button type="button" class="m-3" onclick="initial_speed_reset()">初期値に戻す</button><br>'+
'<label title="プレイ開始時やプレイ中の拡大値を変更したとき、自動でプレイエリアにスクロール位置が調整されます。プレイ開始時は画面内に動画が表示されていないと発動されません。"><input type="checkbox" value="play_scroll">プレイ開始時スクロール位置を調整</input></label><br><span class="adjustment"><span style="margin-left:13px;">└</span>'+
'<select name="scroll_adjustment1"><option value="55" selected>中央</option><option value="75">上部</option><option value="-10">下部</option></select><label title="プレイ中動画を非表示にします。動画自体は読み込まれているので通信を抑える効果はありません。"><input type="checkbox" value="not_video">動画を隠す</input></label></span>'+
'<h6>status表示設定</h6><label title="歌詞タイピングエリアを左側、status/rankingエリアを右側に表示します。歌詞タイピングエリアは狭くなりますが動画全体も表示しやすくなります。"><input type="radio" name=status_mode value="status_mode_not_break"checked>statusを折り返さない</input></label>'+
'<label title="歌詞タイピングエリアを上部全体で表示、status/rankingエリアを下部に表示します。動画が見切れやすくなりますが歌詞タイピングエリアが広くなりプレイしやすくなります。"><input type="radio" name=status_mode value="status_mode_new_line">statusを折り返して表示</input></label><br>'+
'<input id="details" type="checkbox" name="details"><label class="details" for="details">詳細設定</label><div class="details_content"id="details_content"><label><input type="checkbox" value="score"checked>スコア</input></label><label><input type="checkbox" value="miss"checked>ミス</input></label><label><input type="checkbox" value="acc"checked>正確率</input></label><br><label><input type="checkbox" value="combo_counter"checked>コンボ</input></label><label><input type="checkbox" value="type_counter"checked>正解打鍵</input></label><label><input type="checkbox" value="escape_counter"checked>逃した文字数</input></label><br><label><input type="checkbox" value="clear_counter"checked>ラインクリア</input></label>'+
'<label><input type="checkbox" value="line_count"checked>残りライン</input></label><br><label><input type="checkbox" value="rank"checked>現在の順位</input></label><label><input type="checkbox" value="typing_speed"checked>打鍵速度</input></label></div>'+
'<h6>リザルト設定</h6><label><input type="checkbox" value="word_result"checked>ミスをした箇所を赤く表示</input></label><br><label><input type="checkbox" value="word_result_real">ミスをした文字も詳細に表示</input></label>'+
'<br></p></div></div>'+
'<button type="button" onclick="setting_reset()" style="position:absolute;right:10px;bottom:10px;">設定をリセット</button>'
document.getElementsByClassName("share")[0].parentNode.insertBefore(setting_html , document.getElementsByClassName("share")[0].nextElementSibling);

var gauge_html = document.createElement('div');
    gauge_html.setAttribute("id", "gauge");
    gauge_html.setAttribute("style", "display:none;");
    gauge_html.innerHTML = '<div class="progress2" id="gauge1" style="width: 80%;float: left;height:8px;"><div id="clear_gauge"></div></div><div class="progress2" id="gauge2" style="width: 20%;background: #4E3701;height:12px;"><span style="height: 5px;border-left: thin #FFEB3B solid;"></span><div id="clear_gauge2"></div></div><div id="clear_percent" style="font-weight: normal;color: #fff;text-align: right;width: 0px;float: right;position: relative;top: -26px;left: 3px;font-size: 1.4rem;font-family: sans-serif;">0%</div>'
document.getElementById("controlbox").parentNode.insertBefore(gauge_html, document.getElementById("controlbox"));

var f10_html = document.createElement('span')
    f10_html.innerHTML = "(F10)";
document.getElementById("speed").parentNode.insertBefore(f10_html , document.getElementById("speed").nextElementSibling);

var start_html = document.createElement('div');
    start_html.setAttribute("id", "esckey");
    start_html.innerHTML = "Enterキー / 動画をクリックして開始"
document.getElementById("playBotton1").parentNode.insertBefore(start_html, document.getElementById("playBotton1"));

document.querySelector("#playBotton1 > .col-6").innerHTML = '<label style="margin-bottom:0!important;"><input  type="radio" name=mode_select value="kana_type"checked>Play - かな表示</label>';
document.querySelector("#playBotton2 > .col-6").innerHTML = '<label style="margin-bottom:0!important;"><input  type="radio" name=mode_select value="roma_type">Play - ローマ字表示</label>';

//稀にかな入力が選択できない動画がある
function kana_existence_select(){
if(document.getElementById("playBotton4") != null){
document.querySelector("#playBotton4 > .col-6").innerHTML = '<label style="margin-bottom:0!important;"><input  type="radio" name=mode_select value="kanamode_type">Play - かな入力<span style="font-size:50%">(106/109)</span></label>';
document.querySelector("#playBotton5 > .col-6").innerHTML = '<label style="margin-bottom:0!important;"><input  type="radio" name=mode_select value="kanamode_mac_type">Play - かな入力<span style="font-size:50%">(Mac用JIS)</span></label>';
}
}
kana_existence_select()
  // ダイアログの初期設定
var mask_html = document.createElement('div');
    mask_html.setAttribute("id", "mask");
    mask_html.setAttribute("class", "hidden");

var section_html = document.createElement('section');
    section_html.setAttribute("id", "modal");
    section_html.setAttribute("class", "hidden");
    section_html.innerHTML = '<div id="close" >動画・音楽重視</div><div id="close2" >タイピング重視</div>'
document.getElementsByClassName("share")[0].parentNode.insertBefore(mask_html , document.getElementsByClassName("share")[0].nextElementSibling);
document.getElementsByClassName("share")[0].parentNode.insertBefore(section_html , document.getElementsByClassName("share")[0].nextElementSibling);

  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const modal = document.getElementById('modal');
  const mask = document.getElementById('mask');

window.addEventListener('click', evt => {
if(evt.srcElement.id=='osusume') {
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
}
if(evt.srcElement.id=='mask') {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
}
if(evt.srcElement.id=='close') {
document.querySelector("[value=status_mode_not_break]").checked = true;
document.querySelector("[value=mizumasi]").checked = true;
document.querySelector("[value="+CSS.escape(-10)+"]").selected = true;
document.querySelector("[value=next_lyric_hidden]").checked = true;
document.querySelector("[value=play_scroll]").checked = true;
document.querySelector("[value=line_count]").checked = true;
document.querySelector("[value=rank]").checked = true;
document.querySelector("[value=typing_speed]").checked = true;
document.querySelector("[value=escape_counter]").checked = true;
document.querySelector("[value=skip_space]").checked = true;
document.querySelector("[value=miss_on]").checked = true;
document.querySelector("[value=chiruda_chouoxn]").checked = true;
document.querySelector("[value=gameover_sound]").checked = true;
document.querySelector("[value=anime_count]").checked = true;
document.querySelector("[value=font_Gothic]").checked = true;
document.querySelector("[value=sub]").checked = true;
document.querySelector("[value=Interlocking_volume]").checked = true;
document.querySelector("[value=skip_guide]").checked = true;
document.querySelector("[value=score]").checked = true;
document.querySelector("[value=miss]").checked = true;
document.querySelector("[value=acc]").checked = true;
document.querySelector("[value=combo_counter]").checked = true;
document.querySelector("[value=type_counter]").checked = true;
document.querySelector("[value=clear_counter]").checked = true;

document.querySelector("[value=gauge]").checked = false;
document.querySelector("[value=not_video]").checked = false;
document.querySelector("[value=word_disable]").checked = false;
document.querySelector("[value=oomoji_shift]").checked = false;
document.querySelector("[value=perfect_mode]").checked = false;
document.querySelector("[value=combo_animation]").checked = false;
document.querySelector("[value=letter_scroll]").checked = false;
document.querySelector("[value=line_hidden]").checked = false;
document.querySelector("[value=type_sound]").checked = false;
document.querySelector("[value=miss_sound]").checked = false;
document.querySelector("[value=clear_sound]").checked = false;
document.querySelector("[value=combo_break_sound]").checked = false;
document.querySelector("[value=eng_highlight]").checked = false;
document.querySelector("[value=combo_display]").checked = false;

document.querySelector("[name=font_size_kana]").value = 17.5;
document.querySelector("[name=font_size_roma]").value = 17.5;

if(localStorage.getItem('playarea_color')=="rgba(0,0,0,0.5)"){
document.querySelector("[name=playarea_color]").value = "transparent"
document.querySelector("[name=playarea_color]").style.backgroundColor='transparent';
document.querySelector("[name=playarea_color]").style.color='rgb(0, 0, 0)';
}
color_default()
setting_change()
if(is_played){
window.scrollTo({
    top: (document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight-document.documentElement.clientHeight-10),
behavior: "smooth",
});
}

    modal.classList.add('hidden');
    mask.classList.add('hidden');
}

if(evt.srcElement.id=='close2') {
document.querySelector("[value=status_mode_new_line]").checked = true;
document.querySelector("[value=gauge]").checked = true;
document.querySelector("[value=center]").checked = true;
document.querySelector("[value=mizumasi]").checked = true;
document.querySelector("[value=next_text_lyric]").checked = true;
document.querySelector("[value=next_lyric_hidden]").checked = true;
document.querySelector("[value=play_scroll]").checked = true;
document.querySelector("[value=type_sound]").checked = true;
document.querySelector("[value=miss_sound]").checked = true;
document.querySelector("[value=clear_sound]").checked = true;
document.querySelector("[value=combo_break_sound]").checked = true;
document.querySelector("[value=line_count]").checked = true;
document.querySelector("[value=rank]").checked = true;
document.querySelector("[value=typing_speed]").checked = true;
document.querySelector("[value=escape_counter]").checked = true;
document.querySelector("[value=skip_space]").checked = true;
document.querySelector("[value=miss_on]").checked = true;
document.querySelector("[value=chiruda_chouoxn]").checked = true;
document.querySelector("[value=gameover_sound]").checked = true;
document.querySelector("[value=anime_count]").checked = true;
document.querySelector("[value=font_Gothic]").checked = true;
document.querySelector("[value=sub]").checked = true;
document.querySelector("[value=Interlocking_volume]").checked = true;
document.querySelector("[value=skip_guide]").checked = true;
document.querySelector("[value=score]").checked = true;
document.querySelector("[value=miss]").checked = true;
document.querySelector("[value=acc]").checked = true;
document.querySelector("[value=combo_counter]").checked = true;
document.querySelector("[value=type_counter]").checked = true;
document.querySelector("[value=clear_counter]").checked = true;
document.querySelector("[value="+CSS.escape(55)+"]").selected = true;

document.querySelector("[value=not_video]").checked = false;
document.querySelector("[value=word_disable]").checked = false;
document.querySelector("[value=oomoji_shift]").checked = false;
document.querySelector("[value=perfect_mode]").checked = false;
document.querySelector("[value=combo_animation]").checked = false;
document.querySelector("[value=letter_scroll]").checked = false;
document.querySelector("[value=line_hidden]").checked = false;
document.querySelector("[value=eng_highlight]").checked = false;
document.querySelector("[value=combo_display]").checked = false;

document.querySelector("[name=font_size_kana]").value = 17.5;
document.querySelector("[name=font_size_roma]").value = 17.5;

if(localStorage.getItem('playarea_color')=="transparent"){
document.querySelector("[name=playarea_color]").value = "rgba(0,0,0,0.5)";
document.querySelector("[name=playarea_color]").style.backgroundColor='rgba(0,0,0,0.5)';
document.querySelector("[name=playarea_color]").style.color='rgb(0, 0, 0)';
}
letter_red()
setting_change()


if(is_played){
window.scrollTo({
    top: (document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight-document.documentElement.clientHeight-10),
behavior: "smooth",
});
}
    modal.classList.add('hidden');
    mask.classList.add('hidden');
}
});


//チェックボックス状態・value値をlocalstorageに保存
function setting_change() {
if(document.querySelector("[name=color_theme]").value =="デフォルト"){
color_default()
}else if(document.querySelector("[name=color_theme]").value =="先頭の文字を赤く強調"){
letter_red()
}
document.querySelector("[name=color_theme]").selectedIndex = 0


//チェックボックス設定保存　判別(サーバーに保存する機能ができ次第削除)ここから
    localStorage.setItem('sub',document.querySelector("[value=sub]").checked)
    localStorage.setItem('eng_highlight',document.querySelector("[value=eng_highlight]").checked)
    localStorage.setItem('letter_scroll',document.querySelector("[value=letter_scroll]").checked)
    localStorage.setItem('next_lyric_hidden',document.querySelector("[value=next_lyric_hidden]").checked)
    localStorage.setItem('chiruda_chouoxn',document.querySelector("[value=chiruda_chouoxn]").checked)
    localStorage.setItem('oomoji_shift',document.querySelector("[value=oomoji_shift]").checked)
    localStorage.setItem('mizumasi',document.querySelector("[value=mizumasi]").checked)
    localStorage.setItem('line_hidden',document.querySelector("[value=line_hidden]").checked)
    localStorage.setItem('type_sound',document.querySelector("[value=type_sound]").checked)
    localStorage.setItem('miss_sound',document.querySelector("[value=miss_sound]").checked)
    localStorage.setItem('clear_sound',document.querySelector("[value=clear_sound]").checked)
    localStorage.setItem('combo_break_sound',document.querySelector("[value=combo_break_sound]").checked)
    localStorage.setItem('Interlocking_volume',document.querySelector("[value=Interlocking_volume]").checked)
    localStorage.setItem('gameover_sound',document.querySelector("[value=gameover_sound]").checked)
    localStorage.setItem('word_disable',document.querySelector("[value=word_disable]").checked)
    localStorage.setItem('space_disable',document.querySelector("[value=space_disable]").checked)
    localStorage.setItem('kigou_disable',document.querySelector("[value=kigou_disable]").checked)
    localStorage.setItem('anime_count',document.querySelector("[value=anime_count]").checked)
    localStorage.setItem('count_animation',document.querySelector("[value=count_animation]").checked)
    localStorage.setItem('skip_guide',document.querySelector("[value=skip_guide]").checked)
    localStorage.setItem('skip_key',document.querySelector("[value=skip_enter]").checked)
    localStorage.setItem('font_Gothic',document.querySelector("[value=font_Gothic]").checked)
    localStorage.setItem('word_result',document.querySelector("[value=word_result]").checked)
    localStorage.setItem('word_result_real',document.querySelector("[value=word_result_real]").checked)
    localStorage.setItem('not_video',document.querySelector("[value=not_video]").checked)
    localStorage.setItem('perfect_mode',document.querySelector("[value=perfect_mode]").checked)
    localStorage.setItem('miss_limit_mode',document.querySelector("[value=keep_corrent]").checked)
    localStorage.setItem('gauge',document.querySelector("[value=gauge]").checked)
    localStorage.setItem('combo_display',document.querySelector("[value=combo_display]").checked)
    localStorage.setItem('combo_animation',document.querySelector("[value=combo_animation]").checked)
    localStorage.setItem('next_text',document.querySelector("[value=next_text_reading]").checked)
    localStorage.setItem('play_scroll1',document.querySelector("[value=play_scroll]").checked)
    localStorage.setItem('status_mode',document.querySelector("[value=status_mode_new_line]").checked)

//数値入力フォーム
    localStorage.setItem('combo_position',document.querySelector("[name=combo_position]").value)
    localStorage.setItem('mode_select1',document.querySelector("[name=mode_select]:checked").value)
    localStorage.setItem('ef_volume_type',document.querySelector("[name=effect_volume_type]").value)
    localStorage.setItem('ef_volume_miss',document.querySelector("[name=effect_volume_miss]").value)
    localStorage.setItem('ef_volume_clear',document.querySelector("[name=effect_volume_clear]").value)
    localStorage.setItem('ef_volume_combo_break',document.querySelector("[name=effect_volume_combo_break]").value)
    localStorage.setItem('effect_volume_gameover',document.querySelector("[name=effect_volume_gameover]").value)
    localStorage.setItem('miss_limit', document.querySelector("[name=miss_limit]").value)
    localStorage.setItem('letter_scroll_kana',document.querySelector("[name=letter_scroll_kana]").value)
    localStorage.setItem('letter_scroll_roma',document.querySelector("[name=letter_scroll_roma]").value)
    localStorage.setItem('font_size_kana',document.querySelector("[name=font_size_kana]").value)
    localStorage.setItem('font_size_roma',document.querySelector("[name=font_size_roma]").value)
    localStorage.setItem('playarea_radius', document.querySelector("[name=playarea_radius]").value)
    localStorage.setItem('futidori_theme',document.querySelector("[name=futidori_theme]").value)
    localStorage.setItem('futidori_border-width',document.querySelector("[name=futidori_border-width]").value)


//status表示・非表示チェックボックス
if(document.querySelector("[value=score]").checked){
    localStorage.setItem('score1',"display:block;")
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('score1',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('score1',"display:none;")
}
}if(document.querySelector("[value=miss]").checked){
    localStorage.setItem('miss1',"display:block;")
}else if(!document.querySelector("[value=miss]").checked){
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('miss1',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('miss1',"display:none;")
}
}if(document.querySelector("[value=acc]").checked && document.querySelector("[value=miss]").checked){
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('acc1',".acc{display:block;font-size:110%;}")
}else{
    localStorage.setItem('acc1',".acc{display:block;line-height:0;margin-bottom:15.5px;font-size:95%;font-weight:normal;}")
}
}else if(document.querySelector("[value=acc]").checked && !document.querySelector("[value=miss]").checked){
    localStorage.setItem('acc1',".acc{display:block;font-size:110%;}")
}else if(!document.querySelector("[value=acc]").checked){
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('acc1',".acc{visibility:hidden;display:block;}")
}else{
    localStorage.setItem('acc1',".acc{display:none;}")
}
}if(document.querySelector("[value=combo_counter]").checked){
    localStorage.setItem('combo_counter1',"display:block;")
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('combo_counter1',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('combo_counter1',"display:none;")
}
}if(document.querySelector("[value=type_counter]").checked){
    localStorage.setItem('type_counter1',"display:inline-block;")
if(!document.querySelector("[value=escape_counter]").checked){
    localStorage.setItem('type_counter1',"display:block;")
}
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('type_counter1',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('type_counter1',"display:none;")
}
}if(document.querySelector("[value=clear_counter]").checked){
    localStorage.setItem('clear_counter1',"display:inline-block;")
if(!document.querySelector("[value=line_count]").checked){
    localStorage.setItem('clear_counter1',"display:block;")
}
}else{
    localStorage.setItem('clear_counter1',"display:none;")
}if(document.querySelector("[value=escape_counter]").checked){
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('escape_counter1',"display:block;")
}else{
    localStorage.setItem('escape_counter1',"display:inline;")
}
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('escape_counter1',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('escape_counter1',"display:none;")
}
}if(document.querySelector("[value=line_count]").checked){
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('line_count1',"display:block;")
}else{
    localStorage.setItem('line_count1',"display:inline;")
}
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('line_count1',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('line_count1',"display:none;")
}
}if(document.querySelector("[value=rank]").checked){
    localStorage.setItem('rank',"display:inline-block;")
if(!document.querySelector("[value=typing_speed]").checked){
    localStorage.setItem('rank',"display:block;")
}
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('rank',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('rank',"display:none;")
}
}if(document.querySelector("[value=typing_speed]").checked){
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('typing_speed',"display:block;")
}else{
    localStorage.setItem('typing_speed',"display:inline;")
}
}else{
if(document.querySelector("[value=status_mode_new_line]").checked){
    localStorage.setItem('typing_speed',"visibility:hidden;display:block;")
}else{
    localStorage.setItem('typing_speed',"display:none;")
}
}


//設定を反映
checkbox_effect()
checkbox_effect_play()


//カラーコードの状態保存
OnColorChanged()
//チェックボックス設定保存　判別(サーバーに保存する機能ができ次第削除)ここまで


if(document.querySelector("[name=mode_select]:checked").value == "kanamode_type"||document.querySelector("[name=mode_select]:checked").value == "kanamode_mac_type"){
document.querySelector("#difficult > span").innerHTML = '<span title="打鍵数"><i class="fas fa-drum" style="backgroundcolor=:#441188; border-radius: 16px;"></i> '+total_notes_kana_mode + '打</span>　<span title="ライン数"><i class="fas fa-scroll" style=""></i>'+line_length+'ライン</span>　<span title="長さ"><i class="far fa-clock" style=""></i>'+movie_mm+':'+movie_ss+'</span>　<span title="必要入力スピード"><i class="fas fa-tachometer-alt" style=""></i>平均'+difficulty_ave_kana+'打/秒, 最高'+difficulty_kana+'打/秒</span>';
}else{
document.querySelector("#difficult > span").innerHTML = '<span title="打鍵数"><i class="fas fa-drum" style="backgroundcolor=:#441188; border-radius: 16px;"></i> '+total_notes + '打</span>　<span title="ライン数"><i class="fas fa-scroll" style=""></i>'+line_length+'ライン</span>　<span title="長さ"><i class="far fa-clock" style=""></i>'+movie_mm+':'+movie_ss+'</span>　<span title="必要入力スピード"><i class="fas fa-tachometer-alt" style=""></i>平均'+difficulty_ave+'打/秒, 最高'+difficulty+'打/秒</span>';
}
}

//カラーコードをlocalstorageに保存
function OnColorChanged(selectedColor, input) {
    localStorage.setItem('miss_color', document.querySelector("[name=miss_color]").value)
    localStorage.setItem('countdown_color', document.querySelector("[name=countdown_color]").value)
    localStorage.setItem('skipguide_color', document.querySelector("[name=skipguide_color]").value)
    localStorage.setItem('combo_color', document.querySelector("[name=combo_color]").value)
    localStorage.setItem('first_color1', document.querySelector("[name=first_color]").value)
    localStorage.setItem('playarea_color', document.querySelector("[name=playarea_color]").value)
    localStorage.setItem('futidori_color', document.querySelector("[name=futidori_color]").value)
    localStorage.setItem('correctword_color', document.querySelector("[name=correctword_color]").value)
    localStorage.setItem('lineclear_color', document.querySelector("[name=lineclear_color]").value)
    localStorage.setItem('word_color', document.querySelector("[name=word_color]").value)
    localStorage.setItem('lyric_color', document.querySelector("[name=lyric_color]").value)
    localStorage.setItem('next_lyrics_color', document.querySelector("[name=next_lyrics_color]").value)
    localStorage.setItem('line_color', document.querySelector("[name=line_color]").value)
    localStorage.setItem('line_color2', document.querySelector("[name=line_color2]").value)
    localStorage.setItem('line_empty_color', document.querySelector("[name=line_empty_color]").value)
    localStorage.setItem('line_empty_color2', document.querySelector("[name=line_empty_color2]").value)
    localStorage.setItem('status_color', document.querySelector("[name=status_color]").value)
    localStorage.setItem('me_color', document.querySelector("[name=me_color]").value)
    localStorage.setItem('control_color', document.querySelector("[name=control_color]").value)

//設定を反映
document.getElementById("controlbox").style.backgroundColor=document.querySelector("[name=playarea_color]").value;
document.getElementById("controlbox").style.borderRadius=document.querySelector("[name=playarea_radius]").value+"px";
document.getElementById("controlbox").style.border=document.querySelector("[name=futidori_theme]").value+"px";
document.getElementById("controlbox").style.borderColor=document.querySelector("[name=futidori_color]").value;
document.getElementById("controlbox").style.borderWidth=document.querySelector("[name=futidori_border-width]").value;
document.getElementById("controlbox").style.paddingBottom="6px";
if(window.navigator.userAgent.indexOf('Firefox') != -1) {
document.getElementById("line_color_styles").innerHTML = "#bar_input_base::-moz-progress-bar{background-color:"+document.querySelector("[name=line_color]").value+
"!important;}#bar_input_base{background-color:"+document.querySelector("[name=line_empty_color]").value+"!important;}"+
"#bar_base::-moz-progress-bar{background-color:"+document.querySelector("[name=line_color2]").value+"!important;}#bar_base{background-color:"+document.querySelector("[name=line_empty_color2]").value+"!important;}"+
"#controlbox .text-teal {color:"+document.querySelector("[name=me_color]").value+"!important;}#controlbox .col-4,#controlbox .col-4 a,#controlbox .col-4 .h4,#line_remaining_time,#total_time{color:"+document.querySelector("[name=status_color]").value+
"!important;}#controlbox .control {color:"+document.querySelector("[name=control_color]").value+"!important;}}";
}else{
document.getElementById("line_color_styles").innerHTML = "#bar_input_base::-webkit-progress-value{background-color:"+document.querySelector("[name=line_color]").value+
"!important;}#bar_input_base[value]::-webkit-progress-bar{background-color:"+document.querySelector("[name=line_empty_color]").value+"!important;}"+
"#bar_base::-webkit-progress-value{background-color:"+document.querySelector("[name=line_color2]").value+"!important;}#bar_base[value]::-webkit-progress-bar{background-color:"+document.querySelector("[name=line_empty_color2]").value+"!important;}"+
"#controlbox .text-teal {color:"+document.querySelector("[name=me_color]").value+"!important;}#controlbox .col-4,#controlbox .col-4 a,#controlbox .col-4 .h4,#line_remaining_time,#total_time{color:"+document.querySelector("[name=status_color]").value+
"!important;}#controlbox .control {color:"+document.querySelector("[name=control_color]").value+"!important;}}";
}
if(!is_played){
document.getElementById("esckey").style.color=document.querySelector("[name=status_color]").value;
  for(let i=0;i<document.getElementsByClassName("playButton").length;i++){
    document.getElementsByClassName("playButton")[i].style.color = document.querySelector("[name=status_color]").value;}
}else if(is_played && !finished){
document.getElementById("kashi").style.color=document.querySelector("[name=lyric_color]").value;
document.getElementById("kashi_next").style.color=document.querySelector("[name=next_lyrics_color]").value;
document.getElementById("next_kpm").style.color=document.querySelector("[name=next_lyrics_color]").value;
updateLineView();
if(document.querySelector("[value=combo_display]").checked){
if(combo>=1 && next_char[0]){
document.getElementById("combo_stat2").innerHTML = "<div style='color:"+document.querySelector("[name=combo_color]").value+";' class='combo_anime combo_animated'>"+combo+"</div>";
}
else if(combo==0 && typing_count>=1){
document.getElementById("combo_stat2").innerHTML = "<div style='color:"+document.querySelector("[name=combo_color]").value+";'>"+0+"</div>";
}
}
}
}

document.getElementById("mod_setting").addEventListener('change', setting_change);
document.querySelectorAll("[name=mode_select]")[0].addEventListener('change', setting_change);
document.querySelectorAll("[name=mode_select]")[1].addEventListener('change', setting_change);
function kana_existence(){
if(document.querySelectorAll("[name=mode_select]")[2] != null){
document.querySelectorAll("[name=mode_select]")[2].addEventListener('change', setting_change);
document.querySelectorAll("[name=mode_select]")[3].addEventListener('change', setting_change);
}
}
kana_existence()
document.querySelector("[value=type_sound]").addEventListener('change', function(){if(document.querySelector("[value=type_sound]").checked){key_type_play()}});
document.querySelector("[value=miss_sound]").addEventListener('change', function(){if(document.querySelector("[value=miss_sound]").checked){miss_type_play()}});
document.querySelector("[value=clear_sound]").addEventListener('change', function(){if(document.querySelector("[value=clear_sound]").checked){clear_type_play()}});
document.querySelector("[value=combo_break_sound]").addEventListener('change', function(){if(document.querySelector("[value=combo_break_sound]").checked){combo_break.play()}});
document.querySelector("[value=gameover_sound]").addEventListener('change', function(){if(document.querySelector("[value=gameover_sound]").checked){gameover_sound.play()}});

document.querySelector("[value=status_mode_not_break]").addEventListener('change',scroll_change)
document.querySelector("[value=status_mode_new_line]").addEventListener('change',scroll_change)
document.querySelector("[value=not_video]").addEventListener('change',scroll_change)
document.querySelector("[name=scroll_adjustment1]").addEventListener('change',scroll_change)

//かなモードをラジオボタンで選択時、ローマ字の練習モードをクリック
document.querySelector("#playBotton1 a").addEventListener('click', function(){kana_mode = false});
document.querySelector("#playBotton2 a").addEventListener('click', function(){kana_mode = false});

document.querySelector(".col-4 .nav").addEventListener('click', function (){
if(document.querySelector("#ranking").style.display == 'block'){
document.querySelector(".status .nav").children[0].classList.remove('under_line');
document.querySelector(".status .nav").children[1].classList.add('under_line');
}else if(document.querySelector("#status").style.display == 'block'){
document.querySelector(".status .nav").children[0].classList.add('under_line');
document.querySelector(".status .nav").children[1].classList.remove('under_line');
}});
window.addEventListener('resize', function() {
if(is_played&&!finished&&document.querySelector("[value=play_scroll]").checked){
if(!navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)){
window.scrollTo({top: (document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight+Number(localStorage.getItem('scroll_adjustment1'))-document.documentElement.clientHeight)})
}
}
});

const ranking_length = document.querySelectorAll(".player_ranking").length
//スコアランキングから登録者数とスコアを抽出
window.addEventListener('load', function(){for (let i = 0;i<ranking_length; i++) {ranking_array.unshift(parseFloat(document.querySelectorAll(".player_ranking")[i].textContent))}});


function scroll_change(){
    localStorage.setItem('scroll_adjustment1',document.querySelector("[name=scroll_adjustment1]").value)

if(is_played&&!finished){
window.scrollTo({top:(document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight+Number(localStorage.getItem('scroll_adjustment1'))-document.documentElement.clientHeight)})
}
}



function add_css(){
var stylesheet = document.styleSheets.item(0)
    stylesheet.insertRule("[data-kana]{    position: relative;}", 1);
    stylesheet.insertRule(".missmark::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -2px;right: 0;margin: auto;font-size: 1.4em;}",3);
    stylesheet.insertRule(".missmark1::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -3.2px;right: 0;margin: auto;font-size: 1.4em;}", 4);
    stylesheet.insertRule(".missmark2::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -5.4px;right: 0;margin: auto;font-size: 1.4em;}", 5);
    stylesheet.insertRule(".missmark3::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -5.9px;right: 0;margin: auto;font-size: 1.4em;}", 6);
    stylesheet.insertRule(".missmark4::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -6.2px;right: 0;margin: auto;font-size: 1.4em;}", 7);
    stylesheet.insertRule(".missmark5::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -6.7px;right: 0;margin: auto;font-size: 1.4em;}", 8);
    stylesheet.insertRule(".missmark6::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -7.7px;right: 0;margin: auto;font-size: 1.4em;}", 9);
    stylesheet.insertRule(".missmark7::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -8.2px;right: 0;margin: auto;font-size: 1.4em;}", 10);
    stylesheet.insertRule(".missmark8::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -8.5px;right: 0;margin: auto;font-size: 1.4em;}", 11);
    stylesheet.insertRule(".missmark9::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -9.2px;right: 0;margin: auto;font-size: 1.4em;}", 12);
    stylesheet.insertRule(".missmark10::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -2.8px;right: 0;margin: auto;font-size: 1.4em;}", 13);
    stylesheet.insertRule(".missmark11::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -4px;right: 0;margin: auto;font-size: 1.4em;}", 14);
    stylesheet.insertRule(".missmark12::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -5.3px;right: 0;margin: auto;font-size: 1.4em;}", 15);
    stylesheet.insertRule(".missmark13::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -5.8px;right: 0;margin: auto;font-size: 1.4em;}", 16);
    stylesheet.insertRule(".missmark14::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -4.7px;right: 0;margin: auto;font-size: 1.4em;}", 17);
    stylesheet.insertRule(".missmark15::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -7.3px;right: 0;margin: auto;font-size: 1.4em;}", 18);
    stylesheet.insertRule(".missmark16::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -5px;right: 0;margin: auto;font-size: 1.4em;}", 19);
    stylesheet.insertRule(".missmark17::before{    content: attr(data-kana);position: absolute;top: -.49em;left:-5.5px;right: 0;margin: auto;font-size: 1.4em;}", 20);
    stylesheet.insertRule(".missmark18::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -2.7px;right: 0;margin: auto;font-size: 1.4em;}", 21);
    stylesheet.insertRule(".missmark19::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -7.9px;right: 0;margin: auto;font-size: 1.4em;}", 22);
    stylesheet.insertRule(".missmark20::before{    content: attr(data-kana);position: absolute;top: -.49em;left: -4.4px;right: 0;margin: auto;font-size: 1.4em;}", 23);
    stylesheet.insertRule("#kashi_roma:after,#kashi_sub:after,#skip_guide:after,#kashi_next:after,#next_kpm:after{content:'\u200b';}", 24);
    stylesheet.insertRule(".fa-cog:hover{transform:rotate(90deg);}", 26);
    stylesheet.insertRule('.gothicfont{font-family:"游ゴシック", "Yu Gothic"!important;}',27);
    stylesheet.insertRule('.ui-dialog-buttonset button:last-of-type{opacity:0.5;zoom:70%;}',27);

    stylesheet.insertRule('#kashi_area{cursor:none!important;user-select: none !important;-ms-user-select: none !important;-moz-user-select: none !important;-webkit-user-select: none !important;}',29);
    stylesheet.insertRule("[onclick='submit_score()']:after{content:'Enterキーでランキング送信';}", 30);
    stylesheet.insertRule(".letter_space{letter-spacing: 0.7px;}", 31);
    stylesheet.insertRule(".letter_bold{font-weight:600;}", 32);
    stylesheet.insertRule(".letter_nomal{font-weight:500!important;}", 33);
    stylesheet.insertRule(".kashi_hidden{visibility:hidden;}", 34);
    stylesheet.insertRule(".letter_scroll{white-space: nowrap;position:relative;height:25.591px;overflow:hidden;}", 36);
　　stylesheet.insertRule("#kashi_roma,#kashi_sub{word-break: break-all;}", 37);
    stylesheet.insertRule(".progress{margin-bottom: 0!important;}", 38);
    stylesheet.insertRule(".sub_margin{margin-top: 0.5rem!important;}", 39);
    stylesheet.insertRule(".next_hidden{visibility: hidden!important;white-space: nowrap;overflow:hidden;}", 40);
    stylesheet.insertRule("#mod_setting label,.col-6 label,.status .nav-fill{cursor: pointer;}", 41);
    stylesheet.insertRule("#mod_setting label{margin-right: 5px;}", 42);

    stylesheet.insertRule('#kashi_next{margin-top:0px!important;}',46);
    stylesheet.insertRule('#modal-open:hover{  cursor: pointer;text-decoration : underline;}',47);
    stylesheet.insertRule('#controlbox .col-6{padding-right: 0!important;}',48);
    stylesheet.insertRule('#controlbox{margin-left:0px!important;    padding-top: 6px;}',49);
    stylesheet.insertRule('#status{font-size:1.4rem;white-space: nowrap;letter-spacing: 0.8px;font-weight:600;filter: blur(0);line-height:31px!important;margin-bottom: 8px;margin-top: 2px;}',50);
    stylesheet.insertRule('.progress2{margin-bottom: 0.5vw; -webkit-box-shadow: inset 0 0.1vw 0.2vw rgba(0,0,0,.1);box-shadow: inset 0 0.1vw 0.2vw rgba(0,0,0,.1);border-radius: 0;display: flex;font-size: .75rem;line-height: 3px;text-align: center;background-color: rgba(255,255,255,.1);}',51);
    stylesheet.insertRule('#gauge1{position:relative;top:5px;border-top:thin solid;border-bottom:thin solid;border-left:thin solid;height: 5px;}',52);
    stylesheet.insertRule('#gauge2{height:13px!important;border-top:thin #FFEB3B solid;border-right:thin #FFEB3B solid;border-bottom:thin #FFEB3B solid;}',53);
    stylesheet.insertRule('.col-4{padding-top:4px;}',54);
    stylesheet.insertRule('div#gauge {width: 75%;padding-left: 10px;}',55);
    stylesheet.insertRule('.combo_center{width:100%;}',57);
    stylesheet.insertRule('#playBotton1 a:hover,#playBotton2 a:hover,#playBotton4 a:hover,#playBotton5 a:hover,.under_line{text-decoration: underline;}',61);
    stylesheet.insertRule('.no_select{text-decoration: none!important;cursor: context-menu!important;}',62);
    stylesheet.insertRule('.uppercase{text-transform:uppercase;}',63);


    stylesheet.insertRule('.status_text:before {content: "";position: absolute;bottom: 3.89rem;display: inline-block;width: 62px;height: 1px;background-color: white;}',64);
    stylesheet.insertRule('.status_text2:before {content: "";position: absolute;bottom: 0.66rem;display: inline-block;width: 62px;height: 1px;background-color: white;}',65);
    stylesheet.insertRule('#time_settings{float: left!important;}',66);
    stylesheet.insertRule('.score_text:before {content: "";position: absolute;bottom: 3.89rem;display: inline-block;width: 67px;height: 1px;background-color: white;}',68);
    stylesheet.insertRule('.score_text2:before {content: "";position: absolute;bottom: 0.66rem;display:inline-block;left:40.4px;width: 68px;height: 1px;background-color: white;}',69);
    stylesheet.insertRule('.status_label{position:relative;top: 2px;text-transform:capitalize;}',70);

    stylesheet.insertRule('.line_text:before {content: "";position: absolute;bottom: 3.89rem;display: inline-block;width: 47px;height: 1px;background-color: white;}',72);
    stylesheet.insertRule('.line_text2:before {content: "";position: absolute;bottom: 0.66rem;display:inline-block;width: 47px;height: 1px;background-color: white;}',73);
    stylesheet.insertRule('.status_text_result:before {content: "";position: absolute;bottom: 3.89rem;display: inline-block;width: 79px;height: 1px;background-color: white;}',72);
    stylesheet.insertRule('.status_text_result2:before {content: "";position: absolute;bottom: 0.66rem;display:inline-block;width: 106px;height: 1px;background-color: white;}',73);
if(window.navigator.userAgent.indexOf('Firefox') != -1) {
    stylesheet.insertRule("progress{width:100%;height:5px!important;;appearance:none;margin-top:1vw;}", 74);
}else{
    stylesheet.insertRule("progress{width:100%;height:3px!important;-webkit-appearance: scale-horizontal;appearance: scale-horizontal;margin-top:1vw;}", 74);
}
}

var line_color_styles_html = document.createElement('style');
    line_color_styles_html.setAttribute("id", "line_color_styles");
function styles(){
if(window.navigator.userAgent.indexOf('Firefox') != -1) {
    line_color_styles_html.innerHTML=`#bar_input_base::-moz-progress-bar {
    background-color:`+document.querySelector("[name=line_color]").value+`!important;
}
#bar_input_base {
    background-color:`+document.querySelector("[name=line_empty_color]").value+`!important;
}
#bar_base::-moz-progress-bar {
    background-color:`+document.querySelector("[name=line_color2]").value+`!important;
}
#bar_base {
    background-color:`+document.querySelector("[name=line_empty_color2]").value+`!important;
}
#controlbox .text-teal {
    color:`+document.querySelector("[name=me_color]").value+`!important;
}

#controlbox .col-4,
#controlbox .col-4 a,
#controlbox .col-4 .h4,
#line_remaining_time,
#total_time{
    color:`+document.querySelector("[name=status_color]").value+`!important;}

#controlbox .control {
    color:`+document.querySelector("[name=control_color]").value+`!important;}`;
}else{
    line_color_styles_html.innerHTML=`#bar_input_base::-webkit-progress-value{
    background-color:`+document.querySelector("[name=line_color]").value+`!important;
}
#bar_input_base[value]::-webkit-progress-bar {
    background-color:`+document.querySelector("[name=line_empty_color]").value+`!important;
}

#bar_base::-webkit-progress-value {
    background-color:`+document.querySelector("[name=line_color2]").value+`!important;
}
#bar_base[value]::-webkit-progress-bar{
    background-color:`+document.querySelector("[name=line_empty_color2]").value+`!important;
}
#controlbox .text-teal {
    color:`+document.querySelector("[name=me_color]").value+`!important;
}

#controlbox .col-4,
#controlbox .col-4 a,
#controlbox .col-4 .h4,
#line_remaining_time,
#total_time{
    color:`+document.querySelector("[name=status_color]").value+`!important;}

#controlbox .control {
    color:`+document.querySelector("[name=control_color]").value+`!important;}`;
}
}
var status_setting_html = document.createElement('style');
    status_setting_html.setAttribute("id", "status_setting");
    status_setting_html.innerHTML = `.score {
`+localStorage.getItem('score1')+`
}
.miss {
`+localStorage.getItem('miss1')+`
}

`+localStorage.getItem('acc1')+`

.combo_counter {
`+localStorage.getItem('combo_counter1')+`
}

.type_counter {
`+localStorage.getItem('type_counter1')+`
}
.clear_counter {
`+localStorage.getItem('clear_counter1')+`
}
.escape_counter {
`+localStorage.getItem('escape_counter1')+`
}
.line_count {
`+localStorage.getItem('line_count1')+`
}
.rank {
`+localStorage.getItem('rank')+`
}
.typing_speed {
`+localStorage.getItem('typing_speed')+`
}`;
styles()
//設定関連の処理
function read_localstorage(){
//localstorageからカラーコード&設定数値を反映
if(localStorage.getItem('miss_limit')){document.querySelector("[name=miss_limit]").value = localStorage.getItem('miss_limit')}
if(localStorage.getItem('font_size_kana')){document.querySelector("[name=font_size_kana]").value = localStorage.getItem('font_size_kana')}
if(localStorage.getItem('font_size_roma')){document.querySelector("[name=font_size_roma]").value = localStorage.getItem('font_size_roma')}
if(localStorage.getItem('ef_volume_type')){document.querySelector("[name=effect_volume_type]").value = localStorage.getItem('ef_volume_type')}
if(localStorage.getItem('ef_volume_miss')){document.querySelector("[name=effect_volume_miss]").value = localStorage.getItem('ef_volume_miss')}
if(localStorage.getItem('ef_volume_clear')){document.querySelector("[name=effect_volume_clear]").value = localStorage.getItem('ef_volume_clear')}
if(localStorage.getItem('letter_scroll_kana')){document.querySelector("[name=letter_scroll_kana]").value = localStorage.getItem('letter_scroll_kana')}
if(localStorage.getItem('letter_scroll_roma')){document.querySelector("[name=letter_scroll_roma]").value = localStorage.getItem('letter_scroll_roma')}
if(localStorage.getItem('effect_volume_gameover')){document.querySelector("[name=effect_volume_gameover]").value = localStorage.getItem('effect_volume_gameover')}
if(localStorage.getItem('ef_volume_combo_break')){document.querySelector("[name=effect_volume_combo_break]").value = localStorage.getItem('ef_volume_combo_break')}
if(localStorage.getItem('line_color')){document.querySelector("[name=line_color]").value = localStorage.getItem('line_color')}
if(localStorage.getItem('line_color2')){document.querySelector("[name=line_color2]").value = localStorage.getItem('line_color2')}
if(localStorage.getItem('line_empty_color')){document.querySelector("[name=line_empty_color]").value = localStorage.getItem('line_empty_color')}
if(localStorage.getItem('line_empty_color')){document.querySelector("[name=line_empty_color2]").value = localStorage.getItem('line_empty_color2')}
if(localStorage.getItem('status_color')){document.querySelector("[name=status_color]").value = localStorage.getItem('status_color')}
if(localStorage.getItem('me_color')){document.querySelector("[name=me_color]").value = localStorage.getItem('me_color')}
if(localStorage.getItem('line_empty_color')){document.querySelector("[name=control_color]").value = localStorage.getItem('control_color')}
if(localStorage.getItem('miss_color')){document.querySelector("[name=miss_color]").value = localStorage.getItem('miss_color')}
if(localStorage.getItem('countdown_color')){document.querySelector("[name=countdown_color]").value = localStorage.getItem('countdown_color')}
if(localStorage.getItem('skipguide_color')){document.querySelector("[name=skipguide_color]").value = localStorage.getItem('skipguide_color')}
if(localStorage.getItem('combo_color')){document.querySelector("[name=combo_color]").value = localStorage.getItem('combo_color')}
if(localStorage.getItem('first_color1')){document.querySelector("[name=first_color]").value = localStorage.getItem('first_color1')}
if(localStorage.getItem('playarea_color')){document.querySelector("[name=playarea_color]").value = localStorage.getItem('playarea_color')}
if(localStorage.getItem('playarea_radius')){document.querySelector("[name=playarea_radius]").value = localStorage.getItem('playarea_radius')}
if(localStorage.getItem('futidori_color')){document.querySelector("[name=futidori_color]").value = localStorage.getItem('futidori_color')}
if(localStorage.getItem('correctword_color')){document.querySelector("[name=correctword_color]").value = localStorage.getItem('correctword_color')}
if(localStorage.getItem('word_color')){document.querySelector("[name=word_color]").value = localStorage.getItem('word_color')}
if(localStorage.getItem('lineclear_color')){document.querySelector("[name=lineclear_color]").value = localStorage.getItem('lineclear_color')}
if(localStorage.getItem('lyric_color')){document.querySelector("[name=lyric_color]").value = localStorage.getItem('lyric_color')}
if(localStorage.getItem('next_lyrics_color')){document.querySelector("[name=next_lyrics_color]").value = localStorage.getItem('next_lyrics_color')}

//BGMボリューム
if(!localStorage.getItem('volume_storage')){
    localStorage.setItem('volume_storage',70)
document.getElementById("volume").innerHTML = 70;
}else if (localStorage.getItem('volume_storage')) {
document.getElementById("volume").innerHTML = localStorage.getItem('volume_storage');
}

//時間オフセット
if(!localStorage.getItem('diff_storage')){
    localStorage.setItem('diff_storage',0)
}
initial_diff=Number(localStorage.getItem('diff_storage'));
document.getElementById("time_diff").innerHTML = initial_diff.toFixed(2);
document.getElementById("initial_diff").innerHTML = initial_diff.toFixed(2);



//ここからチェックボックス保存(サーバーで保存される機能実装までの仮実装)
document.querySelector(".status .nav").children[1].classList.add('under_line');
if(localStorage.getItem('sub') == "false"){document.querySelector("[value=sub]").checked = false;}
if(localStorage.getItem('eng_highlight') == "true"){document.querySelector("[value=eng_highlight]").checked = true;}
if(localStorage.getItem('letter_scroll') == "true"){document.querySelector("[value=letter_scroll]").checked = true;}
if(localStorage.getItem('next_lyric_hidden') == "true"){document.querySelector("[value=next_lyric_hidden]").checked = true;}
if(localStorage.getItem('line_hidden') == "true"){document.querySelector("[value=line_hidden]").checked = true;}
if(localStorage.getItem('oomoji_shift') == "true"){document.querySelector("[value=oomoji_shift]").checked = true;}
if(localStorage.getItem('type_sound') == "true"){document.querySelector("[value=type_sound]").checked = true;}
if(localStorage.getItem('miss_sound') == "true"){document.querySelector("[value=miss_sound]").checked = true;}
if(localStorage.getItem('clear_sound') == "true"){document.querySelector("[value=clear_sound]").checked = true;}
if(localStorage.getItem('combo_break_sound') == "true"){document.querySelector("[value=combo_break_sound]").checked = true;}
if(localStorage.getItem('gameover_sound') == "false"){document.querySelector("[value=gameover_sound]").checked = false;}
if(localStorage.getItem('Interlocking_volume') == "false"){document.querySelector("[value=Interlocking_volume]").checked = false;}
if(localStorage.getItem('chiruda_chouoxn') == "true"){document.querySelector("[value=chiruda_chouoxn]").checked = true;}
if(localStorage.getItem('mizumasi') == "true"){document.querySelector("[value=mizumasi]").checked = true;}
if(localStorage.getItem('word_disable') == "true"){document.querySelector("[value=word_disable]").checked = true;}
if(localStorage.getItem('kigou_disable') == "true"){document.querySelector("[value=kigou_disable]").checked = true;}
if(localStorage.getItem('space_disable') == "true"){document.querySelector("[value=space_disable]").checked = true;}
if(localStorage.getItem('miss_on') == "false"){document.querySelector("[value=miss_on]").checked = false;}
if(localStorage.getItem('anime_count') == "false"){document.querySelector("[value=anime_count]").checked = false;}
if(localStorage.getItem('count_animation') == "false"){document.querySelector("[value=count_animation]").checked = false;}
if(localStorage.getItem('skip_guide') == "false"){document.querySelector("[value=skip_guide]").checked = false;}
if(localStorage.getItem('skip_key') == "true"){document.querySelector("[value=skip_enter]").checked = true;}
if(localStorage.getItem('font_Gothic') == "false"){document.querySelector("[value=font_Gothic]").checked = false;}
if(localStorage.getItem('word_result') == "false"){document.querySelector("[value=word_result]").checked = false;}
if(localStorage.getItem('word_result_real') == "true"){document.querySelector("[value=word_result_real]").checked = true;}
if(localStorage.getItem('perfect_mode') == "true"){document.querySelector("[value=perfect_mode]").checked = true;}
if(localStorage.getItem('miss_limit_mode') == "true"){document.querySelector("[value=keep_corrent]").checked = true;}
if(localStorage.getItem('gauge') == "true"){document.querySelector("[value=gauge]").checked = true;}
if(localStorage.getItem('combo_display') == "true"){document.querySelector("[value=combo_display]").checked = true;}
if(localStorage.getItem('combo_animation') == "true"){document.querySelector("[value=combo_animation]").checked = true;}
if(localStorage.getItem('next_text') == "true"){document.querySelector("[value=next_text_reading]").checked = true;}
if(localStorage.getItem('play_scroll1') == "true"){document.querySelector("[value=play_scroll]").checked = true;}
if(localStorage.getItem('status_mode') == "true"){document.querySelector("[value=status_mode_new_line]").checked = true;}
if(localStorage.getItem('not_video') == "true"){document.querySelector("[value=not_video]").checked = true;}
if(localStorage.getItem('mode_select1') == ("kanamode_type"||"kanamode_mac_type") && document.querySelectorAll("[name=mode_select]")[2] == null || !localStorage.getItem('mode_select1')){
document.querySelector("[value='kana_type']").checked = true;
}else{
document.querySelector("[value="+localStorage.getItem('mode_select1')+"]").checked = true;
}
if(localStorage.getItem('combo_position')){document.querySelector("[value="+localStorage.getItem('combo_position')+"]").selected = true;}
if(localStorage.getItem('futidori_theme')){document.querySelector("[value="+localStorage.getItem('futidori_theme')+"]").selected = true;}
if(localStorage.getItem('futidori_border-width')){document.querySelector("[value="+localStorage.getItem('futidori_border-width')+"]").selected = true;}
if(localStorage.getItem('scroll_adjustment1')){document.querySelector("[value="+CSS.escape(localStorage.getItem('scroll_adjustment1'))+"]").selected = true;}

if(!localStorage.getItem('score1')){
    localStorage.setItem('score1',"display:block;")
}else if(localStorage.getItem('score1') == "display:none;" || localStorage.getItem('score1') == "visibility:hidden;display:block;"){
document.querySelector("[value=score]").checked = false;
}if(!localStorage.getItem('miss1')){
    localStorage.setItem('miss1',"display:display:block;")
}else if(localStorage.getItem('miss1') == "display:none;" || localStorage.getItem('miss1') == "visibility:hidden;display:block;"){
document.querySelector("[value=miss]").checked = false;
}if(!localStorage.getItem('acc1')){
    localStorage.setItem('acc1',".acc{display:block;line-height:0;margin-bottom:15.5px;font-size:95%;font-weight:normal;}")
}else if(localStorage.getItem('acc1') == ".acc{display:none;}" || localStorage.getItem('acc1') == ".acc{visibility:hidden;display:block;}"){
document.querySelector("[value=acc]").checked = false;
}if(!localStorage.getItem('combo_counter1')){
    localStorage.setItem('combo_counter1',"display:block;")
}else if(localStorage.getItem('combo_counter1') == "display:none;" || localStorage.getItem('combo_counter1') == "visibility:hidden;display:block;"){
document.querySelector("[value=combo_counter]").checked = false;
}if(!localStorage.getItem('type_counter1')){
    localStorage.setItem('type_counter1',"display:inline-block;")
}else if(localStorage.getItem('type_counter1') == "display:none;" || localStorage.getItem('type_counter1') == "visibility:hidden;display:block;"){
document.querySelector("[value=type_counter]").checked = false;
}if(!localStorage.getItem('clear_counter1')){
    localStorage.setItem('clear_counter1',"display:inline-block;")
}else if(localStorage.getItem('clear_counter1') == "display:none;" || localStorage.getItem('clear_counter1') == "visibility:hidden;display:block;"){
document.querySelector("[value=clear_counter]").checked = false;
}if(!localStorage.getItem('escape_counter1')){
    localStorage.setItem('escape_counter1',"display:inline;")
}else if(localStorage.getItem('escape_counter1') == "display:none;" || localStorage.getItem('escape_counter1') == "visibility:hidden;display:block;"){
document.querySelector("[value=escape_counter]").checked = false;
}if(!localStorage.getItem('line_count1')){
    localStorage.setItem('line_count1',"display:inline;")
}else if(localStorage.getItem('line_count1') == "display:none;" || localStorage.getItem('line_count1') == "visibility:hidden;display:block;"){
document.querySelector("[value=line_count]").checked = false;
}if(!localStorage.getItem('rank')){
    localStorage.setItem('rank',"display:inline-block;")
}else if(localStorage.getItem('rank') == "display:none;" || localStorage.getItem('rank') == "visibility:hidden;display:block;"){
document.querySelector("[value=rank]").checked = false;
}if(!localStorage.getItem('typing_speed')){
    localStorage.setItem('typing_speed',"display:inline;")
}else if(localStorage.getItem('typing_speed') == "display:none;" || localStorage.getItem('typing_speed') == "visibility:hidden;display:block;"){
document.querySelector("[value=typing_speed]").checked = false;
}

//チェックボックス保存ここまで(サーバー保存の機能ができ次第削除)


//CSS設定を反映
document.getElementById("controlbox").style.backgroundColor=document.querySelector("[name=playarea_color]").value;
document.getElementById("controlbox").style.borderRadius=document.querySelector("[name=playarea_radius]").value+"px";
document.getElementById("controlbox").style.border=document.querySelector("[name=futidori_theme]").value+"px";
document.getElementById("controlbox").style.borderColor=document.querySelector("[name=futidori_color]").value;
document.getElementById("controlbox").style.borderWidth=document.querySelector("[name=futidori_border-width]").value;
document.getElementById("controlbox").style.paddingBottom="6px";

document.getElementById("esckey").style.color=document.querySelector("[name=status_color]").value;
  for(let i=0;i<document.getElementsByClassName("playButton").length;i++){
    document.getElementsByClassName("playButton")[i].style.color = document.querySelector("[name=status_color]").value;
  }


document.head.appendChild(line_color_styles_html);
document.head.appendChild(status_setting_html);
checkbox_effect()
}


function checkbox_effect(){
if(!is_played && play_mode == "normal"){
if(document.querySelector("[value=kana_type]").checked){
kana_mode = false
mode='kana'
keyboard='normal';
}else if(document.querySelector("[value=roma_type]").checked){
kana_mode = false
mode='roma'
keyboard='normal';

}else if(document.querySelector("[value=kanamode_type]").checked){
kana_mode = true
mode='kana'
keyboard='normal';

}else if(document.querySelector("[value=kanamode_mac_type]").checked){
kana_mode = true
mode='kana'
keyboard='mac';
}
}
if(document.querySelector(".playButton .under_line")!=null){
document.querySelector(".playButton .under_line").classList.remove('under_line');
}
document.querySelector("[name=mode_select]:checked").parentNode.classList.add('under_line');

if(document.querySelector("[value=play_scroll]").checked){
document.getElementsByClassName("adjustment")[0].style.display = "block";
}else{
document.getElementsByClassName("adjustment")[0].style.display = "none";

}
if(document.querySelector("[value=perfect_mode]").checked){
if(document.querySelector("[value=life_corrent]").checked){
miss_mode_life="<span style='padding-left:5.35px;'>Life</span>"
}
document.getElementsByClassName("miss_limit")[0].style.display = "block";
if(miss_limit_color!="#FF4B00"){
miss_limit_color="gold"
}

if(document.querySelector("[value=keep_corrent]").checked){
if(miss_limit_color_keep_corrent!="#FF4B00"){
miss_limit_color_keep_corrent="gold"
miss_limit_color=localStorage.getItem('status_color')
miss_mode_life="miss"
}
}else{
miss_limit_color_keep_corrent=localStorage.getItem('status_color')
}
}else{
miss_limit_color=localStorage.getItem('status_color')
miss_limit_color_keep_corrent=localStorage.getItem('status_color')
document.getElementsByClassName("miss_limit")[0].style.display = "none";
miss_mode_life="miss"

}
if(document.querySelector("[value=word_disable]").checked){
document.getElementById("word_making").style.display = "block";
}else{
document.getElementById("word_making").style.display = "none";
}
if(document.querySelector("[value=letter_scroll]").checked){
document.getElementsByClassName("scroll_amount")[0].style.display = "block";
}else{
document.getElementsByClassName("scroll_amount")[0].style.display = "none";
}
if(document.querySelector("[value=Interlocking_volume]").checked){
if(document.getElementById("volume").innerHTML){
    combo_break.volume = (document.getElementById("volume").innerHTML/100)
    gameover_sound.volume = (document.getElementById("volume").innerHTML/100)

}}
    else{

    combo_break.volume = document.querySelector("[name=effect_volume_miss]").value/100
    gameover_sound.volume = document.querySelector("[name=effect_volume_gameover]").value/100

}
if(document.querySelector("[value=Interlocking_volume]").checked){
  for(let i=0;i<document.querySelectorAll("[name*='effect_volume']").length;i++){
    document.querySelectorAll("[name*='effect_volume']")[i].style.display = "none";
  }

}else{
  for(let i=0;i<document.querySelectorAll("[name*='effect_volume']").length;i++){
    document.querySelectorAll("[name*='effect_volume']")[i].style.display = "block";
  }}

    if(document.querySelector("[value=gauge]").checked){
document.getElementById("gauge").style.display = "block";
    }else{
document.getElementById("gauge").style.display = "none";
}

}


function checkbox_effect_play(){
if(is_played && !finished){

if(document.querySelector("[value=not_video]").checked&&document.querySelector("[value=play_scroll]").checked){
document.getElementById("player").classList.add('kashi_hidden')
}else{
document.getElementById("player").classList.remove('kashi_hidden')
}

if(document.querySelector("[value=font_Gothic]").checked){
document.getElementById("kashi_roma").classList.add('gothicfont')
document.getElementById("kashi_sub").classList.add('gothicfont')
}else{
document.getElementById("kashi_roma").classList.remove('gothicfont')
document.getElementById("kashi_sub").classList.remove('gothicfont')
}

if(document.querySelector("[value=line_hidden]").checked){
document.getElementById("kashi_next").classList.add('kashi_hidden')
document.getElementById("next_kpm").classList.add('kashi_hidden')

}else{
document.getElementById("kashi_next").classList.remove('kashi_hidden')
document.getElementById("next_kpm").classList.remove('kashi_hidden')
}

if(document.querySelector("[value=status_mode_new_line]").checked){
document.querySelector("#controlbox .col-8").style.flex="0 0 100%";
document.querySelector("#controlbox .col-8").style.maxWidth="100%";
document.querySelector("#controlbox .col-4").style.flex="0 0 100%";
document.querySelector("#controlbox .col-4").style.maxWidth="100%";
}else{
document.querySelector("#controlbox .col-8").style.flex="0 0 75.66667%";
document.querySelector("#controlbox .col-8").style.maxWidth="75.66667%";
document.querySelector("#controlbox .col-4").style.flex="0 0 24.33333%";
document.querySelector("#controlbox .col-4").style.maxWidth="24.33333%";
}

if(document.querySelector("[name=combo_position]").value =="center"){
document.getElementById("combo_stat2").classList.add('combo_center')
}else if(document.querySelector("[name=combo_position]").value =="left"){
document.getElementById("combo_stat2").classList.remove('combo_center')
}
if(!document.querySelector("[value=combo_display]").checked){
document.getElementById("combo_stat2").innerHTML = "";
}

if(document.querySelector("[value=letter_scroll]").checked){
document.getElementById("kashi_roma").classList.add('letter_scroll')
document.getElementById("kashi_sub").classList.add('letter_scroll','sub_margin')
document.getElementById("kashi_roma").classList.remove('mt-2')
document.getElementById("kashi_sub").classList.remove('mt-2')
}else{
document.getElementById("kashi_roma").classList.remove('letter_scroll')
document.getElementById("kashi_sub").classList.remove('letter_scroll','sub_margin')
document.getElementById("kashi_roma").classList.add('mt-2')
document.getElementById("kashi_sub").classList.add('mt-2')
}

if(!kana_mode){
if(document.querySelector("[value=sub]").checked){
document.getElementById("kashi_sub").classList.remove('kashi_hidden')
}else{
document.getElementById("kashi_sub").classList.add('kashi_hidden')
}

if (mode == 'roma') {
document.getElementById("kashi_roma").classList.add('roma_input_dom')
document.getElementById("kashi_sub").classList.add('kana_input_dom')
}else if(mode == 'kana'){
document.getElementById("kashi_roma").classList.add('kana_input_dom')
document.getElementById("kashi_sub").classList.add('roma_input_dom')
if(!document.querySelector("[value=oomoji_shift]").checked){
document.getElementById("kashi_sub").style.textTransform="uppercase";

document.getElementById("kashi_roma").style.textTransform="lowercase";
}else{
document.getElementById("kashi_sub").style.textTransform="";
document.getElementById("kashi_roma").style.textTransform="";
}
}
document.getElementById("kashi_roma").classList.add('letter_space')
document.getElementById("kashi_sub").classList.add('letter_space')
}
if(document.querySelector("[value=next_text_reading]").checked&&lyrics_array[count+1][1]!='end'){
document.getElementById("kashi_next").innerHTML = '<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;'+typing_array_kana[count].join('');
}else{
document.getElementById("kashi_next").innerHTML = '<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;'+lyrics_array[count][1];
}
set_status_setting();
update_status();
}
}
var difficulty_ave=0
var difficulty_ave_kana=0
var difficulty_kana=0
var difficulty=0
var observer = new MutationObserver(function(){
if(is_played&&!finished){
movie_timer()
}
movieTotalTime = document.getElementById("bar_base").getAttribute('max')/Number(document.getElementById("speed").innerHTML)
movie_mm =("00" + parseInt(parseInt(movieTotalTime) / 60)).slice(-2)
movie_ss = ("00" +(parseInt(movieTotalTime) - movie_mm * 60)).slice(-2)
difficulty_ave=((difficulty_average/line_length)*Number(document.getElementById("speed").innerHTML)).toFixed(2)
difficulty_ave_kana=((difficulty_average_kana/line_length)*Number(document.getElementById("speed").innerHTML)).toFixed(2)
difficulty_kana=(difficulty_max_kana*Number(document.getElementById("speed").innerHTML)).toFixed(2)
difficulty=(difficulty_max*Number(document.getElementById("speed").innerHTML)).toFixed(2)
//かな入力モード
if(document.querySelector("[name=mode_select]:checked").value == "kanamode_type"||document.querySelector("[name=mode_select]:checked").value == "kanamode_mac_type"){
document.querySelector("#difficult > span").innerHTML = '<span title="打鍵数"><i class="fas fa-drum" style="backgroundcolor=:#441188; border-radius: 16px;"></i> '+total_notes_kana_mode + '打</span>　<span title="ライン数"><i class="fas fa-scroll" style=""></i>'+line_length+'ライン</span>　<span title="長さ"><i class="far fa-clock" style=""></i>'+movie_mm+':'+movie_ss+'</span>　<span title="必要入力スピード"><i class="fas fa-tachometer-alt" style=""></i>平均'+difficulty_ave_kana+'打/秒, 最高'+difficulty_kana+'打/秒</span>';
}else{
document.querySelector("#difficult > span").innerHTML = '<span title="打鍵数"><i class="fas fa-drum" style="backgroundcolor=:#441188; border-radius: 16px;"></i> '+total_notes + '打</span>　<span title="ライン数"><i class="fas fa-scroll" style=""></i>'+line_length+'ライン</span>　<span title="長さ"><i class="far fa-clock" style=""></i>'+movie_mm+':'+movie_ss+'</span>　<span title="必要入力スピード"><i class="fas fa-tachometer-alt" style=""></i>平均'+difficulty_ave+'打/秒, 最高'+difficulty+'打/秒</span>';
}
if(is_played&&!finished){
//次のラインの必要打鍵速度を計算
if(lyrics_array[count +1]){//曲終了前のライン以外
if(!kana_mode){
next_kpm = Number(((typing_array_roma[count].join("").length) / (lyrics_array[count+1][0]-lyrics_array[count][0]))*speed).toFixed(2)
}else if(kana_mode){
next_kpm = Number(((typing_array_kana[count].join('').length+( typing_array_kana[count].join('').match( /[ゔ||が||ぎ||ぐ||げ||ご||ざ||じ||ず||ぜ||ぞ||だ||ぢ||づ||で||ど||ば||び||ぶ||べ"||ぼ||ぱ||ぴ||ぷ||ぺ||ぽ]/g ) || [] ).length) / (lyrics_array[count+1][0]-lyrics_array[count][0]))*player.getPlaybackRate()).toFixed(2)
}
}

if(typing_array_kana[count] != '' && lyrics_array[count+1]){
document.getElementById("next_kpm").innerHTML = "<span id='kpm_color' style='color:"+document.querySelector("[name=next_lyrics_color]").value+";'>NEXT:<span class='next_kpm_value'>"+next_kpm+"</span>打/秒</span>";
}
//次のライン入力する文字が無かったらnext速度を表示しない
else if((typing_array_kana[count] == '' || !lyrics_array[count+1])){
document.getElementById("next_kpm").innerHTML = "&nbsp;";
}
}
});
/** 監視対象の要素オブジェクト */
const elem = document.getElementById('speed');

/** 監視時のオプション */
const config = {
  attributes: true,
  childList: true,
  characterData: true
};
/** 要素の変化監視をスタート */
observer.observe(elem, config);

//歌詞のend処理と同じ処理。ミス制限モードで使われる
function gameover(){
gameover_sound.play()
finished = true;
stop_movie();
if(document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top >window.scrollY){
window.scrollTo({
    top: document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top - document.getElementsByTagName('header')[0].clientHeight,
    behavior: "smooth"
});

}
return;
}
function gamerule(){
if(count && !finished){
if(localStorage.getItem('volume_storage') != document.getElementById("volume").innerHTML){
    localStorage.setItem('volume_storage', document.getElementById("volume").innerHTML)
}

if(document.querySelector("[value=perfect_mode]").checked){
if(document.querySelector("[value=keep_corrent]").checked){
//document.querySelector("[name=miss_limit]").valueは目標正確率
if(document.querySelector("[name=miss_limit]").value-correct>0 ){
gameover()
miss_limit_color_keep_corrent="#FF4B00"
}
}else{
if( Number(((total_notes-escape_word_length)-((total_notes-escape_word_length) * (document.querySelector("[name=miss_limit]").value/100)))-typing_miss_count).toFixed(1) < 0 ){
gameover()
miss_limit_color="#FF4B00"
}
}
}

}
}

let control_default_size

//プレイ開始時に各機能で必要なDOMを追加
function play_preparation(){
speed=Number(document.getElementById("speed").innerHTML)
document.querySelector(".status .nav").children[0].classList.add('under_line');
document.querySelector(".status .nav").children[1].classList.remove('under_line');
document.getElementById("kashi").classList.remove('text-white');
document.getElementById("kashi").classList.remove('mt-3');
document.getElementById("kashi_next").classList.remove('mt-3');
document.getElementById("kashi_next").classList.remove('text-muted');
set_status_setting();
var skip_guide_html = document.createElement('div');
    skip_guide_html.setAttribute("id", "skip_guide");
    skip_guide_html.setAttribute("style", "font-weight:400;text-align:left;");
    skip_guide_html.innerHTML = "&#8203;"
document.getElementById("kashi_next").parentNode.insertBefore(skip_guide_html, document.getElementById("kashi_next").nextElementSibling);

var total_time_html = document.createElement('div');
    total_time_html.setAttribute("id", "total_time");
    total_time_html.setAttribute("style", "font-weight: 600;color: #fff;text-align: right;height: 0px;font-family: sans-serif;");
    total_time_html.innerHTML = "&#8203;"
document.getElementById("kashi_next").parentNode.insertBefore(total_time_html, document.getElementById("kashi_next").nextElementSibling);


var next_kpm_html = document.createElement('div');
    next_kpm_html.setAttribute("id", "next_kpm");
    next_kpm_html.setAttribute("style", "font-size:12.5px;font-weight: 500;text-align:left;");
    next_kpm_html.innerHTML = "&#8203;"
document.getElementById("kashi_next").parentNode.insertBefore(next_kpm_html, document.getElementById("kashi_next").nextElementSibling);

var combo_stat2_html = document.createElement('span');
    combo_stat2_html.setAttribute("id", "combo_stat2");
    combo_stat2_html.setAttribute("style", "display: inline-block;text-align: center;font-weight:600;position: absolute;top: -7px;font-size: 20px;font-family: sans-serif;");
    combo_stat2_html.innerHTML = "&#8203;"
document.getElementById("bar_input_base").parentNode.insertBefore(combo_stat2_html, document.getElementById("bar_input_base"));

var line_remaining_time_html = document.createElement('div');
    line_remaining_time_html.setAttribute("id", "line_remaining_time");
    line_remaining_time_html.setAttribute("style", "font-family: sans-serif;padding-top:5px;font-size: 13px;font-weight: 600;color: #fff;text-align: right;");
    line_remaining_time_html.innerHTML = "&#8203;"
document.getElementById("bar_input_base").parentNode.insertBefore(line_remaining_time_html, document.getElementById("bar_input_base"));

var count_anime_html = document.createElement('div');
    count_anime_html.setAttribute("id", "count_anime");
    count_anime_html.setAttribute("style", "font-size:45px;font-weight: 600;text-align:center;height: 0px;position:relative;top:-15px;");
    count_anime_html.innerHTML = "&#8203;"
document.getElementById("kashi").parentNode.insertBefore(count_anime_html, document.getElementById("kashi"));

document.getElementById("esckey").style.display='none';
document.getElementById("bar_input_base").style.marginTop = "0";
document.getElementById("bar_base").style.marginTop = "0";
document.getElementById("kashi").style.color=document.querySelector("[name=lyric_color]").value;
document.getElementById("kashi_next").style.marginBottom="0";
document.getElementById("kashi_next").style.color=document.querySelector("[name=next_lyrics_color]").value;


if(kana_mode){
total_notes = total_notes_kana_mode
score_per_char = kana_score_per_char
}

player.difftime = Number(localStorage.getItem('diff_storage'))
if (document.getElementById("kashi_sub") == null) {
// DOM要素がない場合は初期化
var kashi_roma_html = document.createElement('div');
    kashi_roma_html.setAttribute("id", "kashi_sub");
    kashi_roma_html.setAttribute("style", "font-weight:600;");
    kashi_roma_html.innerHTML = "&#8203;"
document.getElementById("kashi_roma").parentNode.insertBefore(kashi_roma_html, document.getElementById("kashi_roma").nextElementSibling);
document.getElementById("kashi_roma").innerHTML = '&#8203;';
}

document.getElementById("kashi").innerHTML = "<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;";
document.getElementById("kashi_next").innerHTML = "<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;";

control_default_size=(document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight)
is_in_sight(document.getElementById("youtube-movie"));

checkbox_effect_play()

setInterval(function (){
time_calculation()
typing_result_generator()
skipguide()
sec_countdownanime()
},50);
movie_timer()

setInterval(function (){
movie_timer()
},250);

if (isNaN(line_typingspeed)){line_typingspeed = 0;}
if (isNaN(typing_speed)){typing_speed = 0;}




}

function is_in_sight(jq_obj) {
	var scroll_top    = window.scrollY;
	var scroll_bottom = scroll_top + window.innerHeight;
	var target_top    = document.documentElement.scrollTop+jq_obj.getBoundingClientRect().top;
	var target_bottom = target_top + parseInt(window.getComputedStyle(jq_obj).height);
    if (scroll_bottom > target_top) {

setTimeout(function (){
if(document.querySelector("[value=play_scroll]").checked){
window.scrollTo({
    top: (document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight+Number(localStorage.getItem('scroll_adjustment1'))-document.documentElement.clientHeight)
})
}},50);

}
}


//時間計算・時間を利用した機能
let speed_marker=""
let stop_time=0
let stop_time_flag=false
let practice_time = 0
let practice_time_current = 0
function movie_timer(){
if(!finished){
/**
*@時間計算
*/
const now_time = headtime/speed
const mm =("00" + parseInt(parseInt(now_time) / 60)).slice(-2)
const ss = ("00" +(parseInt(now_time) - mm * 60)).slice(-2)

//曲の経過時間を[分:秒]で表示
document.getElementById("total_time").innerHTML = mm + ':' + ss + " / " + movie_mm+':'+movie_ss;

}
}
function time_calculation(){
if(!finished){

/**
*@ライン経過時間計算
*/

//打鍵時間計測
if(!completed){
//ライン経過時間
if(count > 1){
line_playing_time = (headtime - lyrics_array[count - 1][0])/speed+practice_time
}else{
line_playing_time = headtime
}
if(play_mode=="practice"){
if(player.getPlayerState()==1){
if(stop_time_flag){
practice_time_current += ((new Date).getTime()-stop_time)/1000
stop_time_flag=false
}
stop_time=(new Date).getTime()

}else{
practice_time=(((new Date).getTime()-stop_time)/1000)+practice_time_current
stop_time_flag=true
}

}
//latency計測
if(next_char[0] || playing_time_current == 0){
//全体の経過時間
playing_time_current = line_playing_time + past_playing_time
if(already_input_roma.length == 0 ||already_input.length == 0){
latency = line_playing_time
}
}else if(!completed){
latency = 0
}
}


//ライン打鍵速度、初速抜き、平均打鍵速度計算
line_typingspeed = (typing_count-typing_count_save)/line_playing_time
line_typingspeed_rkpm = (typing_count-typing_count_save)/ (line_playing_time-latency)
typing_speed = typing_count/playing_time_current

if(line_playing_time <=1 && !completed || !lyrics_array[count-1][2] || line_typingspeed == typing_speed){
speed_marker=""
}else if(typing_speed>line_typingspeed || (typing_speed>line_typingspeed&&completed)){
speed_marker="▼"
}else if(typing_speed<line_typingspeed || (typing_speed<line_typingspeed&&completed)){
speed_marker="▲"
}


line_remaining_time =(lyrics_array[count][0] - headtime)/speed
type_per_min=typing_speed*60



//DOMに打鍵時間を表示
if(Number(line_remaining_time)>=0){
document.getElementById("type_speed").innerHTML =typing_speed.toFixed(2);

if(document.querySelector("[value=line_hidden]").checked){
document.getElementById("line_remaining_time").innerHTML =line_typingspeed.toFixed(2)+"打/秒"+speed_marker+" - latency: " +latency.toFixed(3)+ "ms";

}else{
document.getElementById("line_remaining_time").innerHTML =line_typingspeed.toFixed(2)+"打/秒"+speed_marker+" - 残り" +line_remaining_time.toFixed(1) +"秒";
}
}


}
}





function line_clear_process(){
//クリア時は現在のライン経過時間を加算
past_playing_time += line_playing_time
//クリアゲージ
clear_percent=(complete_count / line_length) * 100.0;
if((Math.floor(parseInt(score)/20)/100).toFixed(2) < 50){
document.getElementById("clear_percent").innerHTML = clear_percent.toFixed(0)+"%";
}else if((Math.floor(parseInt(score)/20)/100).toFixed(2) >= 50 && clear_percent.toFixed(0)<80){
document.getElementById("clear_percent").innerHTML = clear_percent.toFixed(0)+"%<i style='width: 0px;display: contents!important;color:#FFF;' class='fa fa-trophy'></i>";
}else if(clear_percent.toFixed(0)>=80 && clear_percent.toFixed(0)!=100){
document.getElementById("clear_percent").innerHTML = clear_percent.toFixed(0)+"%<i style='width: 0px;display: contents!important;color:#8B4513;' class='fa fa-trophy'></i>";
}else if(clear_percent.toFixed(0)==100 && (Math.floor(parseInt(score)/20)/100).toFixed(2) < 99.99){
document.getElementById("clear_percent").innerHTML = clear_percent.toFixed(0)+"%<i style='width: 0px;display: contents!important;color:#C0C0C0;' class='fa fa-trophy'></i>";
}else if((Math.floor(parseInt(score)/20)/100).toFixed(2) >= 99.99){
document.getElementById("clear_percent").innerHTML = clear_percent.toFixed(0)+"%<i style='width: 0px;display: contents!important;color:#FFD700;' class='fa fa-trophy'></i>";
}

clear_gauge1=(complete_count / line_length) * 200.0
if(!game_clear){
document.getElementById("clear_gauge").style.width=(clear_gauge1/1.6)+"%";
document.getElementById("clear_gauge").style.backgroundColor="#fff";
}
if(game_clear){
clear_gauge2=(clear_gauge2+1)
document.getElementById("clear_gauge2").style.width=((clear_gauge2/clear_linecounter)*100)+"%";
}
if(!game_clear&& clear_percent>=80){
clear_linecounter=line_length*(100-clear_percent)/100
clear_gauge2=(clear_percent-80)/10
game_clear=true
document.getElementById("clear_gauge").style.width="100%";
document.getElementById("clear_percent").style.color="#FFEB3B";
document.getElementById("clear_gauge2").style.backgroundColor="#FFEB3B";
document.getElementById("clear_gauge2").style.width=(((clear_gauge2/clear_linecounter)*100)+1)+"%";
document.querySelector("#gauge2 > span").style.cssText = "";
}
}
var line_count=0
var pp=0
function line_update(){
let typing_amount;

//if(line_speed_ranking[0][0] == count-1){
//if(already_input_roma.length>line_speed_ranking[0][1]){
//typing_amount=line_speed_ranking[0][1]
//}else{
//typing_amount=already_input_roma.length
//}
//pp += Number((typing_amount/(lyrics_array[count][0]-lyrics_array[count-1][0])).toFixed(2))
//if(line_speed_ranking.length !=1){
//line_speed_ranking.shift()
//}
//}
if(document.querySelector("[value=next_lyric_hidden]").checked){
if(lyrics_array[count+1][1] != 'end' && !lyrics_array[count+1][2]){
document.getElementById("kashi_next").classList.add('next_hidden')
}else if(lyrics_array[count+1][2] || lyrics_array[count+1][1] == 'end'){
document.getElementById("kashi_next").classList.remove('next_hidden')
}
}else{
document.getElementById("kashi_next").classList.remove('next_hidden')
}
document.getElementById("count_anime").innerHTML = ""
if(countdown_anime){
countdown_anime = false //間奏でのカウントダウンフラグOFF
}
if(count >= 1){//2ライン目以降
if(lyrics_array[count][2]){
line_count++
}
if(lyrics_array[count-1][2]){
if(typing_count_save != typing_count && !practice_failure){
    kpmlog.push(Number(line_typingspeed.toFixed(2)))
    rkpmlog.push(Number(line_typingspeed_rkpm.toFixed(2)))
    latencylog.push(latency.toFixed(3))
}
if(typing_count_save == typing_count && count > logcount){
inputline_counter.push(count-1)
    kpmlog.push(0)
    rkpmlog.push(0)
    latencylog.push('null')
}
line_misscount.push((typing_miss_count-misstyping_count_save))
if(!kana_mode){
    nokorimoji_log.push(String(next_char[1]+line_input_roma.join('')).replace('undefined',''))
}else{
    nokorimoji_log.push(String(next_char[0]+line_input_kana.join('')).replace('undefined',''))
}

if(!completed){//③ラインクリア失敗時
past_playing_time += (lyrics_array[count - 0][0]-lyrics_array[count - 1][0])/speed+practice_time//ライン時間を加算
if(!kana_mode){
escape_word_length+=(next_char[1]+line_input_roma.join('')).length;
typing_miss_count+= (next_char[1]+line_input_roma.join('')).length;
}else if(kana_mode){
escape_word_length+=(next_char[0]+line_input_kana.join('')).length;
typing_miss_count+=(next_char[0]+line_input_kana.join('')).length;
}
gamerule();
}}else if(!lyrics_array[count-1][2]){
    kpmlog.push(kpmlog[kpmlog.length-1])
    rkpmlog.push(rkpmlog[rkpmlog.length-1])
    nokorimoji_log.push(nokorimoji_log[nokorimoji_log.length-1])
    line_misscount.push(line_misscount[line_misscount.length-1])
    latencylog.push(latencylog[latencylog.length-1])
}
practice_time=0
practice_time_current=0
practice_failure=false
clear_sound_flag=false
misstyping_count_save = typing_miss_count
typing_count_save = typing_count //現在ラインの打鍵数を出す
}





}



function skipguide(){
//スキップ案内を表示
if(!finished){
var skip_code = "";
if(!document.querySelector("[value=skip_enter]").checked){
  skip_code="Space";
}
if(document.querySelector("[value=skip_enter]").checked){
  skip_code="Enter";
}
if(document.querySelector("[value=skip_guide]").checked&&next_char==''){
if(completed &&line_remaining_time > 3.0 && document.getElementById("skip_guide").textContent != "Type "+ skip_code +" key to skip. ⏩"){
document.getElementById("skip_guide").innerHTML = "<span style='color:"+document.querySelector("[name=skipguide_color]").value+";'><i>Type "+ skip_code +" key to skip. ⏩</i></span>";
}else if(!completed && line_remaining_time > 4.0 && line_playing_time >= 0.5 && document.getElementById("skip_guide").textContent != "Type "+ skip_code +" key to skip. ⏩"){//入力する文字がなかった時
document.getElementById("skip_guide").innerHTML = "<span style='color:"+document.querySelector("[name=skipguide_color]").value+";'><i>Type "+ skip_code +" key to skip. ⏩</i></span>";
}else if(line_remaining_time <= 3.0 && completed && document.getElementById("skip_guide").textContent == "Type "+ skip_code +" key to skip. ⏩"){
document.getElementById("skip_guide").innerHTML = "";//スキップできなくなるタイミングで案内非表示(ラインクリア時は3秒)
}else if(line_remaining_time <= 1.2 && !completed && document.getElementById("skip_guide").textContent == "Type "+ skip_code +" key to skip. ⏩"){
document.getElementById("skip_guide").innerHTML = "";//スキップできなくなるタイミングで案内非表示
}else if(countdown_anime && 4.0 >= line_remaining_time && document.getElementById("skip_guide").textContent == "Type "+ skip_code +" key to skip. ⏩"){
document.getElementById("skip_guide").innerHTML = "";//カウントダウンが表示されたタイミングで案内非表示
}
}else if(document.getElementById("skip_guide").textContent == "Type Space key to skip. ⏩" || document.getElementById("skip_guide").textContent == "Type Enter key to skip. ⏩"){
document.getElementById("skip_guide").innerHTML = "";
}
}
}
function sec_countdownanime(){
if(count){
if(next_char=='' && line_remaining_time >= 1.3 && !countdown_anime && !completed && (!lyrics_array[count-1][1] || lyrics_array[count-1][1]=="") && lyrics_array[count][2] && lyrics_array[count+1] && document.querySelector("[value=anime_count]").checked){//4秒以上の間奏中、次のラインに入力する文字が存在する時
countdown_anime = true
}

if(countdown_anime){
if(document.querySelector("[value=count_animation]").checked){
if(4.0 >= line_remaining_time && line_remaining_time > 3.0 && document.getElementById("count_anime").textContent != "3"){//間奏ラインの残り時間大体3秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";' class='countdown_animation count_animated'><i>3</i></span>";//残り時間を整数で歌詞エリアに表示
}else if(3.0 >= line_remaining_time && line_remaining_time > 2.0 && document.getElementById("count_anime").textContent != "2"){//間奏ラインの残り時間大体3秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'class='countdown_animation count_animated'><i>2</i></span>";//残り時間を整数で歌詞エリアに表示
}else if(2.0 >= line_remaining_time && line_remaining_time > 1.0 && document.getElementById("count_anime").textContent != "1" && document.getElementById("count_anime").textContent != ""){//間奏ラインの残り時間大体3秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'class='countdown_animation count_animated'><i>1</i></span>";//残り時間を整数で歌詞エリアに表示
}else if(line_remaining_time <= 1 && document.getElementById("count_anime").textContent != "GO!" && document.getElementById("count_anime").textContent != ""){////間奏ラインの残り時間大体1秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'class='countdown_animation count_animated'><i>GO!</i></span>";//歌詞エリアにGO!と表示する
}
}else{
if(4.0 >= line_remaining_time && line_remaining_time > 3.0 && document.getElementById("count_anime").textContent != "3"){//間奏ラインの残り時間大体3秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'><i>3</i></span>";//残り時間を整数で歌詞エリアに表示
}else if(3.0 >= line_remaining_time && line_remaining_time > 2.0 && document.getElementById("count_anime").textContent != "2"){//間奏ラインの残り時間大体3秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'><i>2</i></span>";//残り時間を整数で歌詞エリアに表示
}else if(2.0 >= line_remaining_time && line_remaining_time > 1.0 && document.getElementById("count_anime").textContent != "1" && document.getElementById("count_anime").textContent != ""){//間奏ラインの残り時間大体3秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'><i>1</i></span>"//残り時間を整数で歌詞エリアに表示
}else if(line_remaining_time <= 1 && document.getElementById("count_anime").textContent != "GO!" && document.getElementById("count_anime").textContent != ""){////間奏ラインの残り時間大体1秒ぐらいのとき
document.getElementById("count_anime").innerHTML = "<span style='color:"+document.querySelector("[name=countdown_color]").value+";'><i>GO!</i></span>";//歌詞エリアにGO!と表示する
}
}
}}
}


function typing_result_generator(){

if(!lyrics_array[count+1] && next_char=='' || finished){
if(!ending){
update_status()

let typinglog_save = typinglog.concat()
let houti
let word_result = ""
let word_result_real = ""
let word_result_out=""
let word_result_real_out=""
let Typing_Result = '';
let start3 = false;
    number_lyrics = 1
    ending = true
var typingloglog_html = document.createElement('div');
    typingloglog_html.setAttribute("id", "typingloglog");
    typingloglog_html.setAttribute("style", "word-break: break-all;overflow: scroll; max-height: 700px;font-size: 120%;background-color: rgba(0,0,0,.33);font-weight: 600;user-select: none !important;-ms-user-select: none !important;-moz-user-select: none !important;-webkit-user-select: none !important;");
document.getElementById("controlbox").parentNode.insertBefore(typingloglog_html, document.getElementById("controlbox").nextElementSibling);

var result_head_html = document.createElement('h1');
    result_head_html.setAttribute("id", "result_head");
    result_head_html.setAttribute("style", "font-size:20px;background-color: rgba(0,0,0,.33);margin:0px!important;padding-bottom: 5px;");
    result_head_html.innerHTML = "Typing Result"
document.getElementById("controlbox").parentNode.insertBefore(result_head_html, document.getElementById("controlbox").nextElementSibling);
if(typinglog_save.length == 0){
typinglog_save.splice(lyrics_array.length-1, 0, ["1", "", "0", lyrics_array.length-1, 0, 2]);
houti=true
}else if(typinglog_save.length != 0 && lyrics_array[count-1][2] && typing_count_save == typing_count && lyrics_array[count][1] =='end' && finished){
inputline_counter.push(count)
}

for(let m = 0; m < (typinglog_save.length+(inputline_counter.length)); m++){
if(inputline_counter == ''){
if(houti && !lyrics_array[count-1][2]){
typinglog_save.pop()
houti=false
}
break
}
if(!typinglog_save[m]){//ライン番号取得
typinglog_save.splice(m, 0, ["0", "", "0", inputline_counter[0], 0, 2]);
inputline_counter.shift()
}
if(typinglog_save[m][3] > inputline_counter[0]){//ライン番号取得
typinglog_save.splice(m, 0, ["0", "", "0", inputline_counter[0], 0, 2]);
inputline_counter.shift()
}
}

if(!start3){
Typing_Result += (number_lyrics+'/'+line_length+' '+lyrics_array[logcount-1][2])
start3 = true
number_lyrics = (number_lyrics+1)
}

for(let i = 0; i < typinglog_save.length; i++){//入力した文字の数繰り返す

if(logcount < typinglog_save[i][3] && i >= 1){//ライン番号取得
logcount = typinglog_save[i][3]
if(play_mode == 'normal'){

if(typinglog_save[i-1][5] == 1){
if(document.querySelector("[value=word_result]").checked){
word_result_out="<br>"+word_result+nokorimoji_log[typinglog_save[i][3]-1]
}
if(document.querySelector("[value=word_result_real]").checked){
word_result_real_out ="<br>"+word_result_real+nokorimoji_log[typinglog_save[i][3]-1]
}
}else if(typinglog_save[i-1][5] == 0){
if(document.querySelector("[value=word_result]").checked){
word_result_out="<br>"+word_result+nokorimoji_log[typinglog_save[i][3]-1].replace(/(.)(.*)/,'<span style="color:red;">$1</span>$2')
}
if(document.querySelector("[value=word_result_real]").checked){
word_result_real_out ="<br>"+word_result_real+nokorimoji_log[typinglog_save[i][3]-1]
}
}



if(nokorimoji_log[typinglog_save[i-1][3]]!=""){
if(typinglog_save[i-1][5] == 0){
Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji>' + word_result_out  + word_result_real_out + '</span><br>latency: '+latencylog[typinglog_save[i][3]-1]+', '+'打/秒: ' +kpmlog[typinglog_save[i][3]-1]+ ', 初速抜き: '+rkpmlog[typinglog_save[i][3]-1]+', miss: '+line_misscount[typinglog_save[i][3]-1]+'<br><br><span class="result_lyric">'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}else if(typinglog_save[i-1][5] == 1){
Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji>' + word_result_out + word_result_real_out + '</span><br>latency: '+latencylog[typinglog_save[i][3]-1]+', '+'打/秒: ' +kpmlog[typinglog_save[i][3]-1]+ ', 初速抜き: '+rkpmlog[typinglog_save[i][3]-1]+', miss: '+line_misscount[typinglog_save[i][3]-1]+'<br><br><span class="result_lyric">'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}else if(typinglog_save[i-1][5] == 2){
Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji><br>' + nokorimoji_log[typinglog_save[i][3]-1] +'</span><br>latency: null, 打/秒: 0 初速抜き: 0, miss: 0<br><br><span>'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}
}else{
if(typinglog_save[i-1][5] == 1){
Typing_Result += ('<span class="seikou" style="color:#FFFF00;">'+' clear</span><span class=daken_moji>' + word_result_out + word_result_real_out + '</span><br>latency: '+latencylog[typinglog_save[i][3]-1]+', '+'打/秒: ' +kpmlog[typinglog_save[i][3]-1]+ ', 初速抜き: '+rkpmlog[typinglog_save[i][3]-1]+', miss: '+line_misscount[typinglog_save[i][3]-1]+'<br><br><span class="result_lyric">'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}else{
Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji><br>' + nokorimoji_log[typinglog_save[i-1][3]] +'</span><br>latency: null, 打/秒: 0 初速抜き: 0, miss: 0<br><br><span class="result_lyric">'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}
}
}else if(play_mode == 'practice'){

if(document.querySelector("[value=word_result]").checked){
word_result_out="<br>"+word_result
}
if(document.querySelector("[value=word_result_real]").checked){
word_result_real_out ="<br>"+word_result_real
}

if(nokorimoji_log[typinglog_save[i-1][3]]!=""){
if(typinglog_save[i-1][5] == 1){
Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji>' + word_result_out  + word_result_real_out  + '</span><br>latency: '+latencylog[typinglog_save[i][3]-1]+', '+'打/秒: ' +kpmlog[typinglog_save[i][3]-1]+ ', 初速抜き: '+rkpmlog[typinglog_save[i][3]-1]+', miss: '+line_misscount[typinglog_save[i][3]-1]+'<br><br><span class="result_lyric">'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}
}else{
if(typinglog_save[i-1][5] == 1){
Typing_Result += ('<span class="seikou" style="color:#FFFF00;">'+' clear</span><span class=daken_moji>' + word_result_out + word_result_real_out + '</span><br>latency: '+latencylog[typinglog_save[i][3]-1]+', '+'打/秒: ' +kpmlog[typinglog_save[i][3]-1]+ ', 初速抜き: '+rkpmlog[typinglog_save[i][3]-1]+', miss: '+line_misscount[typinglog_save[i][3]-1]+'<br><br><span class="result_lyric">'+number_lyrics+'/'+line_length+' '+lyrics_array[typinglog_save[i][3]-1][2]+'</span>')
}
}


}
number_lyrics = (number_lyrics+1)
word_result = ""
word_result_real=""
}


if(document.querySelector("[value=word_result]").checked){
if(typinglog_save[i][5] == 1){//正当していたときの処理
if(i >= 1 && logcount == typinglog_save[i-1][3] && typinglog_save[i-1][5] == 0){//ミスをしていたら
if(!kana_mode){
if(typinglog_save[i][1] != undefined){
word_result += ('<span style="color:red">'+typinglog_save[i][1].replace(' ', '⎽')+'</span>')
}
}else if(kana_mode){
if(typinglog_save[i][1].length >= 2){
word_result += ('<span style="color:red">'+typinglog_save[i][1][1].replace('ー', 'ろ').replace('\'', 'ゃ').replace('\]', 'む').replace('#', 'ぁ').replace('$', 'ぅ').replace('%', 'ぇ').replace('&', 'ぉ').replace('^', 'へ')+'</span>')
}else if(typinglog_save[i][1].length == 1){
word_result += ('<span style="color:red">'+typinglog_save[i][1]+'</span>')
}
}

}else{//してなかったら
if(!kana_mode){
if(typinglog_save[i][1] != undefined){
word_result +=('<span style="color:#60d7ff">'+typinglog_save[i][1].replace(' ', '⎽')+'</span>')
}
}else if(kana_mode){
if(typinglog_save[i][1].length >= 2){
word_result +=('<span style="color:#60d7ff">'+typinglog_save[i][1][1].replace('ー', 'ろ').replace('\'', 'ゃ').replace('\]', 'む').replace('#', 'ぁ').replace('$', 'ぅ').replace('%', 'ぇ').replace('&', 'ぉ').replace('^', 'へ')+'</span>')
}else if(typinglog_save[i][1].length == 1){
word_result +=('<span style="color:#60d7ff">'+typinglog_save[i][1]+'</span>')
}
}

}
}
}

if(document.querySelector("[value=word_result_real]").checked){
if(logcount == typinglog_save[i][3] && typinglog_save[i][5] == 0){//ミス
if(!kana_mode){
if(typinglog_save[i][1] != undefined){
word_result_real += ('<span style="color:red">'+typinglog_save[i][1].replace(' ', '⎽')+'</span>')
}
}else if(kana_mode){
if(typinglog_save[i][1].length >= 2){
word_result_real += ('<span style="color:red">'+typinglog_save[i][1][1].replace('ー', 'ろ').replace('\'', 'ゃ').replace('\]', 'む').replace('#', 'ぁ').replace('$', 'ぅ').replace('%', 'ぇ').replace('&', 'ぉ').replace('^', 'へ')+'</span>')
}else if(typinglog_save[i][1].length == 1){
word_result_real += ('<span style="color:red">'+typinglog_save[i][1]+'</span>')
}
}
}else if(logcount == typinglog_save[i][3] && typinglog_save[i][5] == 1){//正当
if(!kana_mode){
if(typinglog_save[i][1] != undefined){
word_result_real +=('<span style="color:#60d7ff">'+typinglog_save[i][1].replace(' ', '⎽')+'</span>')
}
}else if(kana_mode){
if(typinglog_save[i][1].length >= 2){
word_result_real +=('<span style="color:#60d7ff">'+typinglog_save[i][1][1].replace('ー', 'ろ').replace('\'', 'ゃ').replace('\]', 'む').replace('#', 'ぁ').replace('$', 'ぅ').replace('%', 'ぇ').replace('&', 'ぉ').replace('^', 'へ')+'</span>')
}else if(typinglog_save[i][1].length == 1){
word_result_real +=('<span style="color:#60d7ff">'+typinglog_save[i][1]+'</span>')
}
}
}
}


if(i+1 == typinglog_save.length){
if(next_char==''){

if(completed){//次の行がend時、ラインクリア
if(document.querySelector("[value=word_result]").checked){word_result_out="<br>"+word_result}
if(document.querySelector("[value=word_result_real]").checked){word_result_real_out ="<br>"+word_result_real}
Typing_Result += ('<span class="seikou" style="color:#FFFF00;">'+' clear</span><span class=daken_moji>' + word_result_out + word_result_real_out + '</span><br>latency: '+latency.toFixed(3)+', '+'打/秒: ' +line_typingspeed+ ', 初速抜き: '+line_typingspeed_rkpm+', miss: '+(typing_miss_count-misstyping_count_save))
}else if(!completed){//次の行がend時、失敗
if(nokorimoji_log[nokorimoji_log.length-1].length != 0){
if(document.querySelector("[value=word_result]").checked){word_result_out="<br>"+word_result + nokorimoji_log[nokorimoji_log.length-1]}
if(document.querySelector("[value=word_result_real]").checked){word_result_real_out ="<br>"+word_result_real + nokorimoji_log[nokorimoji_log.length-1]}

Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji>' + word_result_out + word_result_real_out + '</span><br>latency: '+latencylog[nokorimoji_log.length-1]+', '+kpmlog[nokorimoji_log.length-1]+'打/秒: ' +[nokorimoji_log.length-1]+ ', 初速抜き: '+rkpmlog[nokorimoji_log.length-1]+', miss: '+line_misscount[nokorimoji_log.length-1])
}else{
if(document.querySelector("[value=word_result]").checked){word_result_out="<br>"+word_result}
if(document.querySelector("[value=word_result_real]").checked){word_result_real_out ="<br>"+word_result_real}
Typing_Result += ('<span class="seikou" style="color:#FFFF00;">'+' clear</span><span class=daken_moji>' + word_result_out + word_result_real_out + '</span><br>latency: '+latencylog[nokorimoji_log.length-1]+', '+kpmlog[nokorimoji_log.length-1]+'打/秒: ' +[nokorimoji_log.length-1]+ ', 初速抜き: '+rkpmlog[nokorimoji_log.length-1]+', miss: '+line_misscount[nokorimoji_log.length-1])
}
}
}else if(!completed && next_char!=''){
if(!kana_mode){
if(document.querySelector("[value=word_result]").checked){word_result_out="<br>"+word_result + (String(next_char[1]+line_input_roma.join('')).replace('undefined',''))}
if(document.querySelector("[value=word_result_real]").checked){word_result_real_out ="<br>"+word_result_real + (String(next_char[1]+line_input_roma.join('')).replace('undefined',''))}
}else if(kana_mode){
if(document.querySelector("[value=word_result]").checked){word_result_out="<br>"+word_result + (String(next_char[0]+line_input_kana.join('')).replace('undefined',''))}
if(document.querySelector("[value=word_result_real]").checked){word_result_real_out ="<br>"+word_result_real + (String(next_char[0]+line_input_kana.join('')).replace('undefined',''))}
}
Typing_Result += ('<span class="sippai" style="color:#F12FFF;">'+' failure</span><span class=daken_moji>' + word_result_out + word_result_real_out +'</span><br>latency: '+(latency).toFixed(3)+', '+kpmlog[nokorimoji_log.length-1]+'打/秒: ' +rkpmlog[nokorimoji_log.length-1]+ ', 初速抜き: '+rkpmlog[nokorimoji_log.length-1]+', miss: '+(typing_miss_count-misstyping_count_save))
}
}
if(i+2 == typinglog_save.length+1){
var typing_result_html = document.createElement('span');
typing_result_html.innerHTML=Typing_Result
document.getElementById("typingloglog").appendChild(typing_result_html)
if(!document.querySelector("[value=oomoji_shift]").checked){
const eleList = document.querySelectorAll("#typingloglog .daken_moji")

//全部に共通のclassを追加したい。
for (let i = 0; i < eleList.length; ++i) {
  eleList[i].classList.add('uppercase');
}
}
var score_result_html = document.createElement('h6');
    score_result_html.setAttribute("style", "font-size:130%;background-color: rgba(0,0,0,.33);margin:0px!important;padding-bottom: 5px;");
    score_result_html.innerHTML = 'Score Penalty<br>Miss: '+ (-typing_miss_count*(((parseInt(score_per_char)/20)/100)/4)).toFixed(2)+'<br>Esc: '+(((Math.floor(parseInt(score)/20)/100)+(typing_miss_count*(((parseInt(score_per_char)/20)/100)/4)))-100).toFixed(2).replace(/^[-]?(\d*|0)(\.01)?$/,'0.00')
document.getElementById("result_head").parentNode.insertBefore(score_result_html, document.getElementById("result_head").nextElementSibling);

var line_result_html = document.createElement('h5');
    line_result_html.setAttribute("id", "line_result");
    line_result_html.setAttribute("style", "background-color: rgba(0,0,0,.33);margin:0px!important;padding-bottom: 5px;");
    line_result_html.innerHTML = '<span style="color:#FFFF00;">'+complete_count+' clear</span> / <span style="color:#FFFF00;"><span style="color:#F12FFF;">'+failer_count+' failure</span>'
document.getElementById("result_head").parentNode.insertBefore(line_result_html, document.getElementById("result_head").nextElementSibling);
//pp *= Math.min(1,kpmlog/1500) * 0.1 + 1;
//pp *= Math.pow(correct/100,3)
//pp *= Math.pow(  (((parseInt(score)/20)/100) + typing_miss_count*(((parseInt(score_per_char)/20)/100)/4)) /100,5)
//console.log(pp.toFixed())
if(document.querySelector("[value=play_scroll]").checked){
if(document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top - document.getElementsByTagName('header')[0].clientHeight >window.scrollY){
window.scrollTo({
    top:document.documentElement.scrollTop+document.getElementById("line_result").getBoundingClientRect().top+parseInt(window.getComputedStyle(document.getElementById("line_result")).height)- document.documentElement.clientHeight,
    behavior: "smooth"
});

}
}
}
}
}
}



}


//関数を適用
load_sound()
add_css()
read_localstorage()




onPlayerStateChange = function (event) {
        if(player.getPlayerState() == 1) {

          if (finished) {
            player.stopVideo();
          } else if(!is_played) {
            is_played = true;
            play_movie();
            start_movie();
play_preparation()

          } else {
            createjs.Ticker.addEventListener("tick", playheadUpdate);
            if(kana_mode) {
              window.addEventListener('keypress',keypressfunc_kana,true);
              window.addEventListener('keydown',keydownfunc_kana,true);
              window.addEventListener('keyup',keyupfunc,true);
            } else {
              window.addEventListener('keydown',keydownfunc,true);
              window.addEventListener('keyup',keyupfunc,true);
            }
          }
        } else if(player.getPlayerState() == 0){
          finished = true;
          finish_movie();
        } else if(player.getPlayerState() != -1 && player.getPlayerState() != 3 && player.getPlayerState() != 5) {
          player.pauseVideo();
          if (play_mode != 'practice') {
            createjs.Ticker.removeEventListener('tick');
            if(kana_mode) {
              window.removeEventListener('keypress',keypressfunc_kana,true);
              window.removeEventListener('keydown',keydownfunc_kana,true);
              window.removeEventListener('keyup',keyupfunc,true);
            } else {
              window.removeEventListener('keydown',keydownfunc,true);
              window.removeEventListener('keyup',keyupfunc,true);
            }
          }
        }
      }

//関数名の変更はNG
function updateLineView() {
let roma_first_letter=next_char[1]
if(document.querySelector("[value=oomoji_shift]").checked && /[A-ZＡ-Ｚ]/.test(next_char[0])){
roma_first_letter=next_char[1].toUpperCase()
}
let kashi_kana_html
let kashi_roma_html

//かな入力モードの表示(かな表示のみ)
if(kana_mode){
if(document.querySelector("[value=letter_scroll]").checked){
document.getElementById("kashi_roma").innerHTML = "<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char.length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_kana'),localStorage.getItem('letter_scroll_kana'))+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>");
if(Array.isArray(next_char[0])){
document.getElementById("kashi_roma").innerHTML = "<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char.length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_kana'),localStorage.getItem('letter_scroll_kana'))+"</span>"+String(next_char[0][0] || '').replace(/(.)(\S*)/, "<span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>$1</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>$2</span>") +"<span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>");
}
if(document.querySelector("[value=eng_highlight]").checked){
if(((/.*[ぁ-ん|ヴ|ゔ|ー|、|。|゛]$/.test(already_input)||already_input=='') && (/^[ぁ-ん|ヴ|ゔ|ー|、|。|゛].*/.test(line_input_kana[0]) || line_input_kana[0] == undefined)) == false ){
if(/^(?!\s)[^ぁ-ん|ヴ|ゔ|ー|←|↑|↓|→|、|。|゛|\s][a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*/.test(next_char + line_input_kana.join(''))){
document.getElementById("kashi_roma").innerHTML = "<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char.length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_kana'),localStorage.getItem('letter_scroll_kana'))+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')).replace(/([a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*)(.*)/,"<span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'>$1</span>$2") + "</span></span>";
}
}
}
}else{
document.getElementById("kashi_roma").innerHTML = "<span><span class='correct_input' style='color:"+(next_char.length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽')+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>");
if(Array.isArray(next_char[0])){
document.getElementById("kashi_roma").innerHTML = "<span><span class='correct_input' style='color:"+(next_char.length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽')+"</span>"+String(next_char[0][0] || '').replace(/(.)(\S*)/, "<span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>$1</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>$2</span>") +"<span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>");
}
if(document.querySelector("[value=eng_highlight]").checked){
if(((/.*[ぁ-ん|ヴ|ゔ|ー|、|。|゛]$/.test(already_input)||already_input=='') && (/^[ぁ-ん|ヴ|ゔ|ー|、|。|゛].*/.test(line_input_kana[0]) || line_input_kana[0] == undefined)) == false ){
if(/^(?!\s)[^ぁ-ん|ヴ|ゔ|ー|←|↑|↓|→|、|。|゛|\s][a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*/.test(next_char + line_input_kana.join(''))){
document.getElementById("kashi_roma").innerHTML = "<span><span class='correct_input' style='color:"+(next_char.length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽')+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')).replace(/([a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*)(.*)/,"<span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'>$1</span>$2") + "</span></span>";
}
}
}
}

//ローマ字モードの表示(ローマ・かな表示両方)
}else if(!kana_mode){

//スクロールモード
if(document.querySelector("[value=letter_scroll]").checked){
kashi_kana_html = ("<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_kana'),localStorage.getItem('letter_scroll_kana'))+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>"));
kashi_roma_html = "<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input_roma.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_roma'),localStorage.getItem('letter_scroll_roma'))+"</span>" + String(roma_first_letter || '').replace(/(.)(\S*)/, "<span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>$1</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>$2</span>") + "<span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_roma.join('')+ "</span></span>");
if(Array.isArray(next_char[0])){
kashi_kana_html = ("<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_kana'),localStorage.getItem('letter_scroll_kana'))+"</span>"+String(next_char[0][0] || '').replace(/(.)(\S*)/, "<span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>$1</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>$2</span>") +"<span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>"));
}
//英単語をハイライトするモード
if(document.querySelector("[value=eng_highlight]").checked){
if(((/.*[ぁ-ん|ヴ|ゔ|ー|、|。|゛]$/.test(already_input)||already_input=='') && (/^[ぁ-ん|ヴ|ゔ|ー|、|。|゛].*/.test(line_input_kana[0]) || line_input_kana[0] == undefined)) == false ){
if(/^(?!\s)[^ぁ-ん|ヴ|ゔ|ー|←|↑|↓|→|、|。|゛|\s][a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*/.test(next_char[0] + line_input_kana.join(''))){
kashi_kana_html =("<span style='position: absolute;bottom: 0;'><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽').substr(-localStorage.getItem('letter_scroll_kana'),localStorage.getItem('letter_scroll_kana'))+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')).replace(/([a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*)(.*)/,"<span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'>$1</span>$2") + "</span></span>");
}
}
}
//非スクロールモード
}else if(!document.querySelector("[value=letter_scroll]").checked){
kashi_kana_html = ("<span><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽')+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>"));
kashi_roma_html = "<span><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input_roma.replace(/ /g, '⎽')+"</span>" + String(roma_first_letter || '').replace(/(.)(\S*)/, "<span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>$1</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>$2</span>") + "<span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_roma.join('')+ "</span>");
if(Array.isArray(next_char[0])){
kashi_kana_html = ("<span><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽')+"</span>"+String(next_char[0][0] || '').replace(/(.)(\S*)/, "<span style='color:"+document.querySelector("[name=first_color]").value+";'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>$1</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>$2</span>") +"<span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')+ "</span></span>"));
}
//英単語をハイライトするモード
if(document.querySelector("[value=eng_highlight]").checked){
if(((/.*[ぁ-ん|ヴ|ゔ|ー|、|。|゛]$/.test(already_input)||already_input=='') && (/^[ぁ-ん|ヴ|ゔ|ー|、|。|゛].*/.test(line_input_kana[0]) || line_input_kana[0] == undefined)) == false ){
if(/^(?!\s)[^ぁ-ん|ヴ|ゔ|ー|←|↑|↓|→|、|。|゛|\s][a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*/.test(next_char[0] + line_input_kana.join(''))){
kashi_kana_html =("<span><span class='correct_input' style='color:"+(next_char[0].length == 0 ? document.querySelector("[name=lineclear_color]").value : document.querySelector("[name=correctword_color]").value)+";'>"+already_input.replace(/ /g, '⎽')+"</span><span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'><span class='input_letter' data-kana='・' style='color:"+document.querySelector("[name=miss_color]").value+"!important;'></span>" + String(next_char[0] || []) + "</span><span class='typing_word' style='color:"+document.querySelector("[name=word_color]").value+";'>" + String(line_input_kana.join('')).replace(/([a-zA-Z0-9ａ-ｚＡ-Ｚ０-９|%％|'’|！!|\?？|\,|\.|”"|＆&|\-|#＃|\\￥|\~|\=|+|\(|\)|\*|\^|\<|\>|\/|\[|\]|\{|\}|\;|\:]*)(.*)/,"<span style='color:"+document.querySelector("[name=first_color]").value+";text-decoration: underline;'>$1</span>$2") + "</span></span>");
}
}
}

}

//DOMにタイピングワードを表示
document.getElementsByClassName("roma_input_dom")[0].innerHTML = kashi_roma_html;
document.getElementsByClassName("kana_input_dom")[0].innerHTML = kashi_kana_html;
}
}


function shortcut_key_esc_enter(){
//ショートカットキー
if(event.key=="Escape"){//Escでポーズ・再生
event.preventDefault();
if(!is_played){
}else if(is_played) {
if(player.getPlayerState() == 1){
    player.pauseVideo()
}else{
    player.playVideo()
}
}
}
if(document.activeElement.tagName != "INPUT"){
if(!finished&&event.key=="Enter"&&!is_played){document.activeElement.blur(); player.playVideo()}//Enterキーでプレイ開始
if(finished&&event.key=="Enter"&& !ranking && play_mode=="normal" &&document.querySelector("#result_comment [type=button]")!=null ){//曲終了、Enterキーで記録送信
            submit_score();
            ranking = true;
}
}
}
function shortcut_key_playing(){
    if(event.key=="F10") {//F10で倍速
            speedup();

            event.preventDefault();
    }else if(event.key=="Tab") {//TABキー、Firefoxのクイック検索ショートカットキーを無効化
        event.preventDefault();
        }
if(player.getPlayerState() == 1){
    if(event.code=="Space"&&document.getElementById("skip_guide").textContent == "Type Space key to skip. ⏩"){//スペースキーでスキップ
toggle_skip();
window.setTimeout(toggle_skip, 25);
}else  if(event.key=="Enter"&&document.getElementById("skip_guide").textContent == "Type Enter key to skip. ⏩"){//Enterキーでスキップ
toggle_skip();
window.setTimeout(toggle_skip, 25);
}
}
}

function miss_effect(){
if(document.querySelector("[value=combo_display]").checked&&!finished){
document.getElementById("combo_stat2").innerHTML="<div style='color:"+document.querySelector("[name=combo_color]").value+";'>"+0+"</div>";
}
if(document.querySelector("[value=miss_sound]").checked) {//ミス音
if(!combo100){//ミス音

miss_type_play()

}else if(combo100){//100 combo以上でミスするとcombo break音
if(document.querySelector("[value=combo_break_sound]").checked){
    combo_break.play();
}
miss_type_play()
    combo100 = false;//フラグOFF
}
}
    if(document.querySelector("[value=miss_on]").checked){//ミス表示を追加
        if (mode == 'kana') {//かな表示専用のミス表示
if(/[\u3042\u3044\u3046\u3048\u304a-\u3062\u3064-\u3082\u3084\u3086\u30F4\u3088-\u3094\u0025\u30FC\uFF5E\uFF20\uFF03\uFF05\uFF08\uFF09\uFF5B\uFF5D\u300C\u300D\uFF1C\uFF1E\u30F0\u3090]+$/.test(next_char[0][0][0])){//全角全角数字%ヴ＠＃％（）｛｝「」＜＞
document.querySelector("#kashi_roma .input_letter").classList.add("missmark");
}else if(/[\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u0023\u0040\uFF41-\uFF5A\uFF21-\uFF3A\uFF01\uFF1F\u30FB\uFF04\uFF06\uFF0A\uFF0B\uFF1A\uFF1B\uFF3F\uFF5C\uFFE5\uFF1D\u3091\u30F1]+$/.test(next_char[0][0][0])){//ぁぃぅぇぉっゃゅょ#@全角英字大文字小文字！？・＄＆＊＋＿｜＝￥
document.querySelector("#kashi_roma .input_letter").classList.add("missmark1");
}else if(/[\u006E\u0070\u0071\u0075\u0026\u0067\u006B\u003C\u003E]+$/.test(next_char[0][0][0])){//npqu&gk<>
document.querySelector("#kashi_roma .input_letter").classList.add("missmark2");
}else if(/[\u0063\u0064\u0065\u006F\u0068\u0062\u0054\u002B]+$/.test(next_char[0][0][0])){//cdeogT+
document.querySelector("#kashi_roma .input_letter").classList.add("missmark3");
}else if(/[\u0078\u0079\u0061\u0024\u005F\u005C]+$/.test(next_char[0][0][0])){//xya$_\
document.querySelector("#kashi_roma .input_letter").classList.add("missmark4");
}else if(/[\u003F\u0076\u0072\u0073\u007A]+$/.test(next_char[0][0][0])){//?vsrz
document.querySelector("#kashi_roma .input_letter").classList.add("missmark5");
}else if(/[\u006A\u0066\u0074\u005E\u002A]+$/.test(next_char[0][0][0])){//jft^*
document.querySelector("#kashi_roma .input_letter").classList.add("missmark6");
}else if(/[\u0021]+$/.test(next_char[0][0][0])){//!
document.querySelector("#kashi_roma .input_letter").classList.add("missmark7");
}else if(/[\u002C\u002E\s\u3001\u3002\u201D\u2019\uFF3E\uFF40\u0028\u0029\u007B\u007D\u005B\u005D\u0060\u003A\u003B\u007C]+$/.test(next_char[0][0][0])){//,.半角スペース、。”’｀＾(){}[]:;
document.querySelector("#kashi_roma .input_letter").classList.add("missmark8");
}else if(/[\u0027\u0069\u006C]+$/.test(next_char[0][0][0])){//'il
document.querySelector("#kashi_roma .input_letter").classList.add("missmark9");
}else if(/[\u006D\uFF10-\uFF19]+$/.test(next_char[0][0][0])){//全角数字m
document.querySelector("#kashi_roma .input_letter").classList.add("missmark10");
}else if(/[\u0077\u004D]+$/.test(next_char[0][0][0])){//wM
document.querySelector("#kashi_roma .input_letter").classList.add("missmark11");
}else if(/[\u0041-\u0044\u004B\u004C\u0052\u0055]+$/.test(next_char[0][0][0])){//ABCDKLRU
document.querySelector("#kashi_roma .input_letter").classList.add("missmark12");
}else if(/[\u0045\u0046\u0050\u0059\u005A\u0030-\u0039]+$/.test(next_char[0][0][0])){//EFYZ半角01234566789
document.querySelector("#kashi_roma .input_letter").classList.add("missmark13");
}else if(/[\u0047\u0048\u004E\u0051]+$/.test(next_char[0][0][0])){//GHNQ
document.querySelector("#kashi_roma .input_letter").classList.add("missmark14");
}else if(/[\u0049\u004A\u0022]+$/.test(next_char[0][0][0])){//IJ"
document.querySelector("#kashi_roma .input_letter").classList.add("missmark15");
}else if(/[\u004F]+$/.test(next_char[0][0][0])){//O
document.querySelector("#kashi_roma .input_letter").classList.add("missmark16");
}else if(/[\u0053\u0056\u0058\u002F]+$/.test(next_char[0][0][0])){//SVX/
document.querySelector("#kashi_roma .input_letter").classList.add("missmark17");
}else if(/[\u0057]+$/.test(next_char[0][0][0])){//W
document.querySelector("#kashi_roma .input_letter").classList.add("missmark18");
}else if(/[\u002D]+$/.test(next_char[0][0][0])){//-
document.querySelector("#kashi_roma .input_letter").classList.add("missmark19");
}else if(/[\u003D\u007E]+$/.test(next_char[0][0][0])){//=~
document.querySelector("#kashi_roma .input_letter").classList.add("missmark20");
}
}else if (mode == 'roma') {//ローマ字表示専用のミス表示
if(/[\u3042\u3044\u3046\u3048\u304a-\u3062\u3064-\u3082\u3084\u3086\u30F4\u3088-\u3094\u0025\u30FC\uFF5E\uFF20\uFF03\uFF05\uFF08\uFF09\uFF5B\uFF5D\u300C\u300D\uFF1C\uFF1E\u30F0\u3090]+$/.test(next_char[1][0][0])){//全角全角数字%ヴ＠＃％（）｛｝「」＜＞
document.querySelector("#kashi_roma .input_letter").classList.add("missmark");
}else if(/[\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u0023\u0040\uFF41-\uFF5A\uFF21-\uFF3A\uFF01\uFF1F\u30FB\uFF04\uFF06\uFF0A\uFF0B\uFF1A\uFF1B\uFF3F\uFF5C\uFFE5\uFF1D\u3091\u30F1]+$/.test(next_char[1][0][0])){//ぁぃぅぇぉっゃゅょ#@全角英字大文字小文字！？・＄＆＊＋＿｜＝￥
document.querySelector("#kashi_roma .input_letter").classList.add("missmark1");
}else if(/[\u006E\u0070\u0071\u0075\u0026\u0067\u006B\u003C\u003E]+$/.test(next_char[1][0][0])){//npqu&gk<>
document.querySelector("#kashi_roma .input_letter").classList.add("missmark2");
}else if(/[\u0063\u0064\u0065\u006F\u0068\u0062\u0054\u002B]+$/.test(next_char[1][0][0])){//cdeogT+
document.querySelector("#kashi_roma .input_letter").classList.add("missmark3");
}else if(/[\u0078\u0079\u0061\u0024\u005F\u005C]+$/.test(next_char[1][0][0])){//xya$_\
document.querySelector("#kashi_roma .input_letter").classList.add("missmark4");
}else if(/[\u003F\u0076\u0072\u0073\u007A]+$/.test(next_char[1][0][0])){//?vsrz
document.querySelector("#kashi_roma .input_letter").classList.add("missmark5");
}else if(/[\u006A\u0066\u0074\u005E\u002A]+$/.test(next_char[1][0][0])){//jft^*
document.querySelector("#kashi_roma .input_letter").classList.add("missmark6");
}else if(/[\u0021]+$/.test(next_char[1][0][0])){//!
document.querySelector("#kashi_roma .input_letter").classList.add("missmark7");
}else if(/[\u002C\u002E\s\u3001\u3002\u201D\u2019\uFF3E\uFF40\u0028\u0029\u007B\u007D\u005B\u005D\u0060\u003A\u003B\u007C]+$/.test(next_char[1][0][0])){//,.半角スペース、。”’｀＾(){}[]:;
document.querySelector("#kashi_roma .input_letter").classList.add("missmark8");
}else if(/[\u0027\u0069\u006C]+$/.test(next_char[1][0][0])){//'il
document.querySelector("#kashi_roma .input_letter").classList.add("missmark9");
}else if(/[\u006D\uFF10-\uFF19]+$/.test(next_char[1][0][0])){//全角数字m
document.querySelector("#kashi_roma .input_letter").classList.add("missmark10");
}else if(/[\u0077\u004D]+$/.test(next_char[1][0][0])){//wM
document.querySelector("#kashi_roma .input_letter").classList.add("missmark11");
}else if(/[\u0041-\u0044\u004B\u004C\u0052\u0055]+$/.test(next_char[1][0][0])){//ABCDKLRU
document.querySelector("#kashi_roma .input_letter").classList.add("missmark12");
}else if(/[\u0045\u0046\u0050\u0059\u005A\u0030-\u0039]+$/.test(next_char[1][0][0])){//EFYZ半角01234566789
document.querySelector("#kashi_roma .input_letter").classList.add("missmark13");
}else if(/[\u0047\u0048\u004E\u0051]+$/.test(next_char[1][0][0])){//GHNQ
document.querySelector("#kashi_roma .input_letter").classList.add("missmark14");
}else if(/[\u0049\u004A\u0022]+$/.test(next_char[1][0][0])){//IJ"
document.querySelector("#kashi_roma .input_letter").classList.add("missmark15");
}else if(/[\u004F]+$/.test(next_char[1][0][0])){//O
document.querySelector("#kashi_roma .input_letter").classList.add("missmark16");
}else if(/[\u0053\u0056\u0058\u002F]+$/.test(next_char[1][0][0])){//SVX/
document.querySelector("#kashi_roma .input_letter").classList.add("missmark17");
}else if(/[\u0057]+$/.test(next_char[1][0][0])){//W
document.querySelector("#kashi_roma .input_letter").classList.add("missmark18");
}else if(/[\u002D]+$/.test(next_char[1][0][0])){//-
document.querySelector("#kashi_roma .input_letter").classList.add("missmark19");
}else if(/[\u003D\u007E]+$/.test(next_char[1][0][0])){//=~
document.querySelector("#kashi_roma .input_letter").classList.add("missmark20");
}
}
    }
}

function typesound(){

//ランキングのスコアを抜かした時の処理
if((parseInt(score)/20)/100 >= ranking_array[0]){//次の目標スコアを超えた時

for(let i = 0; i < ranking_length; i++){//現在の自分のスコアより下のスコアを削除
ranking_array.shift();
    if((parseInt(score)/20)/100 < ranking_array[0]){//目標スコアが自分のスコアより高くなったらループ終わり
        break;
    }
}
}
if(document.querySelector("[value=combo_display]").checked){
if(combo>=1 && document.querySelector("[value=combo_animation]").checked){
document.getElementById("combo_stat2").innerHTML = "<div style='color:"+document.querySelector("[name=combo_color]").value+";' class='combo_animated'id='combo_anime'>"+combo+"</div>";
}else if(combo>=1 && !document.querySelector("[value=combo_animation]").checked){
document.getElementById("combo_stat2").innerHTML = "<div style='color:"+document.querySelector("[name=combo_color]").value+";'>"+combo+"</div>";
}
}

if (!completed){//combo継続中
if (document.querySelector("[value=type_sound]").checked) {//打鍵音
key_type_play()
}
}else if(!clear_sound_flag){
line_clear_process()
clear_sound_flag=true
if(document.querySelector("[value=combo_display]").checked){
if(document.querySelector("[value=combo_animation]").checked){
document.getElementById("combo_stat2").innerHTML = "<div style='color:"+document.querySelector("[name=combo_color]").value+";' class='combo_animated'id='combo_anime'>"+combo+"</div>";
}else if(!document.querySelector("[value=combo_animation]").checked){
document.getElementById("combo_stat2").innerHTML = "<div style='color:"+document.querySelector("[name=combo_color]").value+";'>"+combo+"</div>";
}
}
if(document.querySelector("[value=clear_sound]").checked){
clear_type_play()
}else if(!document.querySelector("[value=clear_sound]").checked && document.querySelector("[value=type_sound]").checked){
key_type_play()
}
}
if(combo >= 100){//100combo以上のフラグON
    combo100 = true;
}
}

window.addEventListener('keydown', function(){
gamerule()
shortcut_key_esc_enter()
if(is_played && !finished){
shortcut_key_playing()
if(play_mode=="practice"){
if(player.getPlayerState() == 2 && !practice_failure){
practice_failure=true
    kpmlog.push(Number((line_typingspeed).toFixed(2)))
    rkpmlog.push(Number((line_typingspeed_rkpm).toFixed(2)))
    line_misscount.push((typing_miss_count-misstyping_count_save))
    latencylog.push(Number(latency.toFixed(3)))
if(!kana_mode){
    nokorimoji_log.push(next_char[1]+line_input_roma.join(''))
}else if(kana_mode){
    nokorimoji_log.push(next_char[0]+line_input_kana.join(''))
}
}
}

}
});



/**
*@プレイ中の処理変更 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////
var combo_break;
var gameover_sound

//効果音ロード
function load_sound(){
    combo_break = new Audio();
    combo_break.src = "/sounds/combo_break.mp3";
    combo_break.preload

    gameover_sound= new Audio();
    gameover_sound.src = "/sounds/gameover.mp3";
    gameover_sound.preload
}
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var key_type = new AudioContext();
var miss_type = new AudioContext();
var clear_type = new AudioContext();

key_type_load();
function key_type_load(){
var request_key_type = new XMLHttpRequest();
request_key_type.open('GET', "/sounds/key_type.mp3", true);
request_key_type.responseType = 'arraybuffer';
request_key_type.onload = function() {
        key_type.decodeAudioData(request_key_type.response, function(buffer) {
                audio_buffer_key_type = buffer;
        }, function(){
                //エラー
        }
        );
};
request_key_type.send();
}
function key_type_play(){
var key_type_gain = key_type.createGain();
var key_type_source = key_type.createBufferSource();
key_type_source.buffer = audio_buffer_key_type;
key_type_source.connect(key_type_gain);
key_type_gain.connect(key_type.destination);
if (is_played && !finished) {
if(document.querySelector("[value=Interlocking_volume]").checked){
if(document.getElementById("volume").innerHTML){
key_type_gain.gain.value = (document.getElementById("volume").innerHTML/100)
}}
    else{
key_type_gain.gain.value = document.querySelector("[name=effect_volume_type]").value/100
}}
key_type_source.start(0);
}
miss_type_load();
function miss_type_load(){
var request_miss_type = new XMLHttpRequest();
request_miss_type.open('GET', "/sounds/miss_type.mp3", true);
request_miss_type.responseType = 'arraybuffer';
request_miss_type.onload = function() {
        miss_type.decodeAudioData(request_miss_type.response, function(buffer) {
                audio_buffer_miss_type = buffer;
        }, function(){
                //エラー
        }
        );
};
request_miss_type.send();
}
function miss_type_play(){
var miss_type_gain = miss_type.createGain();
var miss_type_source = miss_type.createBufferSource();
miss_type_source.buffer = audio_buffer_miss_type;
miss_type_source.connect(miss_type_gain);
miss_type_gain.connect(miss_type.destination);
if (is_played && !finished) {
if(document.querySelector("[value=Interlocking_volume]").checked){
if(document.getElementById("volume").innerHTML){
miss_type_gain.gain.value = (document.getElementById("volume").innerHTML/100)
}}
    else{
miss_type_gain.gain.value = document.querySelector("[name=effect_volume_type]").value/100
}}
miss_type_source.start(0);
}
clear_type_load();
function clear_type_load(){
var request_clear_type = new XMLHttpRequest();
request_clear_type.open('GET', "/sounds/clear_type.mp3", true);
request_clear_type.responseType = 'arraybuffer';
request_clear_type.onload = function() {
        clear_type.decodeAudioData(request_clear_type.response, function(buffer) {
                audio_buffer_clear_type = buffer;
        }, function(){
                //エラー
        }
        );
};
request_clear_type.send();
}
function clear_type_play(){
var clear_type_gain = clear_type.createGain();
var clear_type_source = clear_type.createBufferSource();
clear_type_source.buffer = audio_buffer_clear_type;
clear_type_source.connect(clear_type_gain);
clear_type_gain.connect(clear_type.destination);
if (is_played && !finished) {
if(document.querySelector("[value=Interlocking_volume]").checked){
if(document.getElementById("volume").innerHTML){
clear_type_gain.gain.value = (document.getElementById("volume").innerHTML/100)
}}
    else{
clear_type_gain.gain.value = document.querySelector("[name=effect_volume_type]").value/100
}}
clear_type_source.start(0);
}

//設定リセット関数
function setting_reset(){
    var res = confirm("全てのチェックボックス・効果音音量・スクロール量を初期設定に戻します。よろしいですか？");
    if( res == true ) {
document.querySelector("[value=next_text_lyric]").checked = true;
document.querySelector("[value=center]").checked = true;
document.querySelector("[value=line_count]").checked = true;
document.querySelector("[value=rank]").checked = true;
document.querySelector("[value=typing_speed]").checked = true;
document.querySelector("[value=escape_counter]").checked = true;
document.querySelector("[value=status_mode_not_break]").checked = true;
document.querySelector("[value=skip_space]").checked = true;
document.querySelector("[value=miss_on]").checked = true;
document.querySelector("[value=chiruda_chouoxn]").checked = true;
document.querySelector("[value=gameover_sound]").checked = true;
document.querySelector("[value=anime_count]").checked = true;
document.querySelector("[value=font_Gothic]").checked = true;
document.querySelector("[value=sub]").checked = true;
document.querySelector("[value=Interlocking_volume]").checked = true;
document.querySelector("[value=skip_guide]").checked = true;
document.querySelector("[value=score]").checked = true;
document.querySelector("[value=miss]").checked = true;
document.querySelector("[value=acc]").checked = true;
document.querySelector("[value=combo_counter]").checked = true;
document.querySelector("[value=type_counter]").checked = true;
document.querySelector("[value=clear_counter]").checked = true;
document.querySelector("[value=gauge]").checked = false;
document.querySelector("[value=play_scroll]").checked = false;
document.querySelector("[value=not_video]").checked = false;
document.querySelector("[value=word_disable]").checked = false;
document.querySelector("[value=oomoji_shift]").checked = false;
document.querySelector("[value=mizumasi]").checked = false;
document.querySelector("[value=perfect_mode]").checked = false;
document.querySelector("[value=combo_animation]").checked = false;
document.querySelector("[value=letter_scroll]").checked = false;
document.querySelector("[value=next_lyric_hidden]").checked = false;
document.querySelector("[value=line_hidden]").checked = false;
document.querySelector("[value=eng_highlight]").checked = false;
document.querySelector("[value=type_sound]").checked = false;
document.querySelector("[value=miss_sound]").checked = false;
document.querySelector("[value=clear_sound]").checked = false;
document.querySelector("[value=combo_break_sound]").checked = false;
document.querySelector("[value=combo_display]").checked = false;


document.querySelector("[name=effect_volume_type]").value = 70;
document.querySelector("[name=effect_volume_miss]").value = 70;
document.querySelector("[name=effect_volume_clear]").value = 70;
document.querySelector("[name=effect_volume_gameover]").value = 70;
document.querySelector("[name=letter_scroll_roma]").value = 16;
document.querySelector("[name=letter_scroll_kana]").value = 10;
document.querySelector("[name=font_size_kana]").value = 17.5;
document.querySelector("[name=font_size_roma]").value = 17.5;
    }

}
function effectcolor_reset(){
    var res = confirm("エフェクト色をデフォルトに戻します。よろしいですか？");
    if( res == true ) {
document.querySelector("[name=miss_color]").value = "#FF3554"
document.querySelector("[name=miss_color]").style.backgroundColor="rgb(255, 53, 84)"
document.querySelector("[name=miss_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=countdown_color]").value = "rgba(255,255,255,0.9)"
document.querySelector("[name=countdown_color]").style.backgroundColor="rgba(255,255,255,0.9)"
document.querySelector("[name=countdown_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=skipguide_color]").value = "rgba(255,255,255,0.53)"
document.querySelector("[name=skipguide_color]").style.backgroundColor="rgba(255,255,255,0.53)"
document.querySelector("[name=skipguide_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=combo_color]").value = "#FFFFFF"
document.querySelector("[name=combo_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=combo_color]").style.color="rgb(0, 0, 0)"
OnColorChanged()

}
}
function playareacolor_reset(){
    var res = confirm("背景カラーをデフォルトに戻します。よろしいですか？");
    if( res == true ) {
document.querySelector("[name=playarea_color]").value = "rgba(255,255,255,0)"
document.querySelector("[name=playarea_color]").style.backgroundColor="transparent"
document.querySelector("[name=playarea_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=playarea_radius]").value = 0
document.querySelector("[name=futidori_theme]")[0].selected = true;

document.querySelector("[name=futidori_color]").value = "#FFFFFF"
document.querySelector("[name=futidori_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=futidori_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=futidori_border-width]")[0].selected = true;
OnColorChanged()

}
}
function linecolor_reset(){
    var res = confirm("ラインカラーをデフォルトに戻します。よろしいですか？");
    if( res == true ) {
document.querySelector("[name=line_color]").value = "#17a2b8";
document.querySelector("[name=line_color]").style.backgroundColor="rgb(23, 162, 184)"
document.querySelector("[name=line_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=line_color2]").value = "#ffc107"
document.querySelector("[name=line_color2]").style.backgroundColor="rgb(255, 193, 7)"
document.querySelector("[name=line_color2]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=line_empty_color]").value = "#f5f5f5"
document.querySelector("[name=line_empty_color2]").value = "#f5f5f5"

document.querySelector("[name=line_empty_color]").style.backgroundColor="rgb(245, 245, 245)"
document.querySelector("[name=line_empty_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=line_empty_color2]").style.backgroundColor="rgb(245, 245, 245)"
document.querySelector("[name=line_empty_color2]").style.color="rgb(0, 0, 0)"
OnColorChanged()

}
}

function subtextcolor_reset(){
    var res = confirm("ステータス/コントロール文字色をデフォルトに戻します。よろしいですか？");
    if( res == true ) {
document.querySelector("[name=status_color]").value = "#FFFFFF"
document.querySelector("[name=status_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=status_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=me_color]").value = "#20c997"
document.querySelector("[name=me_color]").style.backgroundColor="rgb(32, 201, 151)"
document.querySelector("[name=me_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=control_color]").value = "rgba(255,255,255,.85)"
document.querySelector("[name=control_color]").style.backgroundColor="rgba(255, 255, 255, 0.85)"
document.querySelector("[name=control_color]").style.color="rgb(0, 0, 0)"
OnColorChanged()

}
}

function color_default(){
document.querySelector("[name=first_color]").value = "#FFFFFF"
document.querySelector("[name=lyric_color]").value = "#FFFFFF"
document.querySelector("[name=word_color]").value = "#FFFFFF"

document.querySelector("[name=first_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=first_color]").style.color="rgb(0, 0, 0)"
document.querySelector("[name=lyric_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=lyric_color]").style.color="rgb(0, 0, 0)"
document.querySelector("[name=word_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=word_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=correctword_color]").value = "#0099CC"
document.querySelector("[name=correctword_color]").style.backgroundColor="rgb(0, 153, 204)"
document.querySelector("[name=correctword_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=lineclear_color]").value = "#1eff52"
document.querySelector("[name=lineclear_color]").style.backgroundColor="rgb(30, 255, 82)"
document.querySelector("[name=lineclear_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=next_lyrics_color]").value = "rgba(255,255,255,.7)"
document.querySelector("[name=next_lyrics_color]").style.backgroundColor="rgba(255, 255, 255, 0.7)"
document.querySelector("[name=next_lyrics_color]").style.color="rgb(0, 0, 0)"
OnColorChanged()

}
function letter_red(){
document.querySelector("[name=first_color]").value = "#FF0000"
document.querySelector("[name=first_color]").style.backgroundColor="rgb(255, 0, 0)"
document.querySelector("[name=first_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=lyric_color]").value = "#FFFFFF"
document.querySelector("[name=word_color]").value = "#FFFFFF"
document.querySelector("[name=lyric_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=lyric_color]").style.color="rgb(0, 0, 0)"
document.querySelector("[name=word_color]").style.backgroundColor="rgb(255, 255, 255)"
document.querySelector("[name=word_color]").style.color="rgb(0, 0, 0)"

document.querySelector("[name=correctword_color]").value = "#919395"
document.querySelector("[name=correctword_color]").style.backgroundColor="rgb(145, 147, 149)"
document.querySelector("[name=correctword_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=lineclear_color]").value = "#919395"
document.querySelector("[name=lineclear_color]").style.backgroundColor="rgb(145, 147, 149)"
document.querySelector("[name=lineclear_color]").style.color="rgb(255, 255, 255)"

document.querySelector("[name=next_lyrics_color]").value = "rgba(255,255,255,.7)"
document.querySelector("[name=next_lyrics_color]").style.backgroundColor="rgba(255, 255, 255, 0.7)"
document.querySelector("[name=next_lyrics_color]").style.color="rgb(0, 0, 0)"
OnColorChanged()

}
var modal_overlay_html= document.createElement('div');
    modal_overlay_html.setAttribute("id", "modal-overlay");
    modal_overlay_html.setAttribute("style", "display:none;");
document.body.appendChild(modal_overlay_html);
function facog_check(){
if(document.getElementsByClassName("fa-cog")[0] ==null){
var cog_html= document.createElement('a');
    cog_html.setAttribute("class", "btn");
    cog_html.setAttribute("style", "font-size:24px;");
    cog_html.innerHTML = '<i class="zmdi-hc-fw zmdi fas fa-cog" title="オプション"></i>'
document.getElementsByClassName("twitter")[0]
document.getElementsByClassName("twitter")[0].parentNode.insertBefore(cog_html, document.getElementsByClassName("twitter")[0]);
}
document.getElementsByClassName("fa-cog")[0].addEventListener('click', function(){
document.getElementById("modal-overlay").style.display = "block";

    //コンテンツをセンタリングする
document.getElementById("mod_setting").style.display = "block";
    centering();

document.getElementById("mod_setting").animate([{opacity: '0'}, {opacity: '1'}], 100)
//    $("#mod_setting").fadeIn( "fast" );
    //[#modal-overlay]、をクリックしたら#mod_settingを閉じる
//    $( "#modal-overlay" ).click( function () {
document.getElementById("modal-overlay").addEventListener('click', function(){

document.getElementById("modal-overlay").style.display = "none";
document.getElementById("mod_setting").style.display = "none";

    });
document.getElementById("modal-overlay").addEventListener('touchstart', function(){

document.getElementById("modal-overlay").style.display = "none";
document.getElementById("mod_setting").style.display = "none";

    });
});

}
facog_check()
window.addEventListener('resize', centering);
    //センタリングを実行する関数
    function centering() {

        //画面(ウィンドウ)の幅、高さを取得
        var w = window.innerWidth;
        var h = window.innerHeight;

        // コンテンツ(#mod_setting)の幅、高さを取得
        var cw = document.getElementById("mod_setting").offsetWidth;
        var ch = document.getElementById("mod_setting").offsetHeight;

        //センタリングを実行する
document.getElementById("mod_setting").style.left = ((w - cw))+ "px";
document.getElementById("mod_setting").style.top = ((h - ch)/4.4) + "px";
    }

//#status変更(update_status関数を上書き)
var correct = 100
update_status = function(){
correct = typing_count / (typing_miss_count + typing_count) * 100.0;
if (isNaN(correct)) {
          correct = 100;
}

if(document.querySelector("[value=status_mode_not_break]").checked){
if(document.querySelector("[value=perfect_mode]").checked){
var keep_corrent="["+(correct-document.querySelector("[name=miss_limit]").value).toFixed(1).replace(".0","")+"%]"
if(document.querySelector("[value=life_corrent]").checked){
var life_corrent = "["+Number(((total_notes-escape_word_length)-((total_notes-escape_word_length) * (document.querySelector("[name=miss_limit]").value/100)))-typing_miss_count).toFixed(1)+"]life"
}else{
life_corrent = ""
}
}else{
keep_corrent = ""
life_corrent = ""
}
if(!lyrics_array[count+1] && next_char=='' || finished){
document.getElementById("status").innerHTML = ((parseInt(score)/20)/100).toFixed(2)+"<br>"+
typing_miss_count + "miss<span style='font-size:90%;color:"+miss_limit_color+";'>"+life_corrent+"</span><span style='display:block;line-height:0;margin-bottom:15.5px;font-size:95%;font-weight:normal;color:"+miss_limit_color_keep_corrent+";' ><span style='font-size:75%;'>正確率</span><span style='font-size:85%;'>:"+(correct.toFixed(1)).replace(".0","")+"%"+keep_corrent+"</span></span>"+
"<span style='margin-top:1.5px;'><span style='position:relative;top:-1.5px;'>"+combo+"</span><span style='position:relative;top:1.5px;font-size:80%;'>/"+max_combo+"<span style='font-size: 110%;'>combo</span></span></span><br>"+
"<span style='margin-top:1.5px;'><span style='position:relative;top:-1.5px;'>"+(total_notes-escape_word_length) + "</span><span style='position:relative;top:1.5px;font-size:80%;'>/" + total_notes + "</span><span style='position:relative;top:0.5px;font-size:105%;font-weight:normal;'>打</span></span><span style='font-size:80%;'>[" + -escape_word_length + "]esc<br></span>"+
"<span>"+(ranking_array.length +1) + "<span style='font-weight:normal;'>位</span></span><span>[<span id='type_speed'>"+typing_speed.toFixed(2)+"</span><span style='font-weight:normal;'>打/秒</span>]</span>";

}else{
document.getElementById("status").innerHTML = "<span class='score'>"+((parseInt(score)/20)/100).toFixed(2)+"</span>"+
"<span class='miss'>"+typing_miss_count + "miss<span style='font-size:90%;color:"+miss_limit_color+";'>"+life_corrent+"</span></span><span class='acc' style='color:"+miss_limit_color_keep_corrent+";'><span style='font-size:75%;font-weight:normal;'>正確率</span><span style='font-size:85%;'>:"+(correct.toFixed(1)).replace(".0","")+"%"+keep_corrent+"</span></span>"+
"<span class='combo_counter'>"+combo+"combo</span>"+
"<span class='type_counter'>"+typing_count + "<span style='font-weight:normal;'>打</span></span><span class='escape_counter' style='font-size:80%;'>[" + -escape_word_length + "]esc<br></span>"+
"<span class='clear_counter'>"+complete_count + "<span style='font-size:90%;'>clear</span></span><span class='line_count'>["+(line_length-(failer_count+complete_count))+"]<span style='font-size:90%;'>line</span><br></span>"+
"<span class='rank'>"+(ranking_array.length +1) + "<span style='font-weight:normal;'>位</span></span><span class='typing_speed'>[<span id='type_speed'>"+typing_speed.toFixed(2)+"</span><span style='font-weight:normal;'>打/秒</span>]</span>";
}
}else{
if(document.querySelector("[value=perfect_mode]").checked){
var keep_corrent="["+(correct-document.querySelector("[name=miss_limit]").value).toFixed(1).replace(".0","")+"%]"
if(document.querySelector("[value=life_corrent]").checked){
var life_corrent =Number(((total_notes-escape_word_length)-((total_notes-escape_word_length) * (document.querySelector("[name=miss_limit]").value/100)))-typing_miss_count).toFixed(1)
}else{
life_corrent = typing_miss_count
}
}else{
keep_corrent = ""
life_corrent = typing_miss_count
}
if(!lyrics_array[count+1] && next_char=='' || finished){
if(document.querySelector("[value=perfect_mode]").checked&&document.querySelector("[value=life_corrent]").checked){
life_corrent ="<span class='status_text_result' style='margin-left: 3px;'>"+Number(((total_notes-escape_word_length)-((total_notes-escape_word_length) * (document.querySelector("[name=miss_limit]").value/100)))-typing_miss_count).toFixed(1)+"<span style='color:"+localStorage.getItem('status_color')+"!important;'>/<span style='font-size:70%;'>"+typing_miss_count+"</span></span></span>"
}else{
life_corrent="<span class='status_text' style='margin-left: 3px;'>"+typing_miss_count+"</span>"
}

document.getElementById("status").innerHTML = "<div id=statu1dan style='box-pack: justify;    display: box;display: -webkit-box;display: -moz-box;display: -o-box;display: -ms-box;'>"+
"<div style='width:226px;'><span class='status_label'' style='font-size:75%;'> Score</span><span class='score_text' style='margin-left: 3px;'>"+((parseInt(score)/20)/100).toFixed(2)+"</span></div>"+
"<div style='width:137px;color:"+miss_limit_color+";'><span class='status_label' style='font-size:75%;'>"+miss_mode_life+"</span>"+life_corrent +"</div>"+
"<div style='width:168px;'><span class='status_label' style='font-size:75%;'>Combo</span><span class='score_text'style='margin-left: 3px;'>"+combo+"/<span style='font-size:70%;'>"+max_combo+"</span></span></div>"+
"<div style='display:block;width:226px;'><span class='status_label' style='font-size:75%;font-weight:normal;'>打/秒</span></span><span id='type_speed' class='status_text_result' style='margin-left: 3px;'>" +typing_speed.toFixed(2)+"/<span style='font-size:70%;'>"+Math.max.apply(null, kpmlog).toFixed(2)+"</span></span></div>"+
"<div style='display:block;visibility:hidden;'><span class='status_label' style='font-size:75%;'>Line</span><span class='line_text' style='margin-left: 3px;'>" +(line_length-(failer_count+complete_count))+"</span></div>"+
"</div><div id=statu2dan style='box-pack: justify;    display: box;display: -webkit-box;display: -moz-box;display: -o-box;display: -ms-box;margin-top:10px;'>"+
"<div style='width: 215px;display:block;'><span class='status_label' style='font-size:75%;'> Rank</span><span class='score_text2'style='margin-left: 7px;'>"+(ranking_array.length +1) + "<span style='font-weight:normal;'>位</span></span><span class='status_label' style='font-size:110%;position: relative;top:-11px;left: 42px;float:right;color:"+miss_limit_color_keep_corrent+";font-size:65%;font-weight:normal;'>"+keep_corrent+"</span></div>"+
"<div style='font-size:110%;width: 164px;color:"+miss_limit_color_keep_corrent+";'><span class='status_label' style='font-size:65%;font-weight:normal;'>正確率</span><span style='font-size:90%;margin-left: 3px;'class='status_text2'>"+(correct.toFixed(1)).replace(".0","")+"%</span></div>"+
"<div style='width:161px;'><span class='status_label' style='font-size:75%;'>Type</span><span class='status_text_result2'style='margin-left: 3px;'>"+(total_notes-escape_word_length) + "/<span style='font-size:70%;'>"+total_notes+"</span></span></div>"+
"<div style='display:block;width:212px;'><span class='status_label' style='font-size:75%;'>Esc</span><span class='status_text2'style='margin-left: 3px;'>"+escape_word_length + "</span></div>"+
"<div style='display:block;'><span class='status_label' style='font-size:75%;'>Clear</span><span class='status_text2'style='margin-left: 3px;'>"+complete_count + "/<span style='font-size:70%;'>"+line_length+"</span></span></div></div>";
}else{
document.getElementById("status").innerHTML = "<div id=statu1dan style='box-pack: justify;    display: box;display: -webkit-box;display: -moz-box;display: -o-box;display: -ms-box;'>"+
"<span class='score'style='width:227px;'><span class='status_label'' style='font-size:75%;'> Score</span><span class='score_text' style='margin-left: 3px;'>"+((parseInt(score)/20)/100).toFixed(2)+"</span></span>"+
"<span class='miss' style='width:137px;color:"+miss_limit_color+";'><span class='status_label' style='font-size:75%;'>"+miss_mode_life+"</span><span class='status_text' style='margin-left: 3px;'>"+life_corrent +"</span></span>"+
"<span class='combo_counter' style='width:166px;'><span class='status_label' style='font-size:75%;'>Combo</span><span class='status_text'style='margin-left: 3px;'>"+combo+"</span></span>"+
"<span class='typing_speed'style='width:229px;'><span class='status_label' style='font-size:75%;font-weight:normal;'>打/秒</span><span class='status_text' id='type_speed' style='margin-left: 3px;'>" +typing_speed.toFixed(2)+"</span></span>"+
"<span class='line_count'style=''><span class='status_label' style='font-size:75%;'>Line</span><span class='line_text' style='margin-left: 3px;'>" +(line_length-(failer_count+complete_count))+"</span></span>"+
"</div><div id=statu2dan style='box-pack: justify;    display: box;display: -webkit-box;display: -moz-box;display: -o-box;display: -ms-box;margin-top:10px;'>"+
"<span class='rank' style='width: 215px;'><span class='status_label' style='font-size:75%;'> Rank</span><span class='score_text2'style='margin-left: 7px;'>"+(ranking_array.length +1) + "<span style='font-weight:normal;'>位</span></span><span class='status_label acc' style='position: relative;top:-11px;left: 42px;float:right;color:"+miss_limit_color_keep_corrent+";font-size:65%;font-weight:normal;'>"+keep_corrent+"</span></span>"+
"<span class='acc' style='width: 164px;color:"+miss_limit_color_keep_corrent+";'><span class='status_label' style='font-size:65%;font-weight:normal;'>正確率</span><span style='font-size:90%;margin-left: 3px;'class='status_text2'>"+(correct.toFixed(1)).replace(".0","")+"%</span></span>"+
"<span class='type_counter' style='width:161px;'><span class='status_label' style='font-size:75%;'>Type</span><span class='status_text2'style='margin-left: 3px;'>"+typing_count + "</span></span>"+
"<span class='escape_counter' style='width:212px;'><span class='status_label' style='font-size:75%;'>Esc</span><span class='status_text2'style='margin-left: 3px;'>"+escape_word_length + "</span></span>"+
"<span class='clear_counter' style=''><span class='status_label' style='font-size:75%;'>Clear</span><span class='line_text2'style='margin-left: 3px;'>"+complete_count + "</span></span></div>";
}
}
update_skip();

}





//keydownfunc()書き換え箇所全④箇所
keydownfunc = function (event) {
        var volume = 0;

//書き換え箇所①、headtime変数をグローバル化したのでheadtime変数を削除
//        var headtime = player.getCurrentTime();

        var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        arrowkey();
         if(
          event.code=="Space" ||//スペース
         (event.keyCode >= 65 && event.keyCode <= 90)//A-Z

||event.key === '!'||event.key === '"'||event.key === '#'||event.key === '$'||event.key === '%'||event.key === '&'||event.key === "'"||event.key === '('||event.key === ')'||event.key === '='||event.key === '~'||event.key === '\|'//SHIFT最上段
||(event.key >=0 && event.key <=9)||event.key === '-'||event.key === '^'||event.key === '\\'//最上段
||event.key === '@'||event.key === '`'||event.key === '['||event.key === '{'//上段
||event.key === '+'||event.key === '*'||event.key === ':'||event.key === ';'||event.key === ']'||event.key === '}'//中段
||event.key === '\_'||event.key === '/'||event.key === '?'||event.key === '.'||event.key === ','||event.key === '<'||event.key === '>'//下段

){
          if(next_char.length > 1){
            var c = "";
            keyproperty_map = {
                '*': function() { return "\*" },
                '+': function() { return "\+" },
                ':': function() { return ":" },
                ';': function() { return ";" },
                '-': function() { return "-" },
                '@': function() { return "@" },
                '[': function() { return "[" },
                '\\': function() { return "\\" },
                ']': function() { return "]" },
                '^': function() { return "^" },
                '/': function() { return "/" },
                '?': function() { return "?" },
                '.': function() { return "." },
                ',': function() { return "," },
                '<': function() { return "<" },
                '>': function() { return ">" },
                "!": function() { return "!" },
                "#": function() { return "#" },
                "$": function() { return "$" },
                "%": function() { return "%" },

                '"': function() { return '"' },
                '&': function() { return "&" },
                "'": function() { return "'" },
                '(': function() { return "\(" },
                ')': function() { return "\)" },

                '=': function() { return "=" },
                '`': function() { return "`" },
                '{': function() { return "\{" },
                '\|': function() { return "\|" },
                '}': function() { return "\}" },
                '~': function() { return "~" },
                '\_': function() { return "\_" },

                0: function() { return "0" },
                1: function() { return "1" },
                2: function() { return "2" },
                3: function() { return "3" },
                4: function() { return "4" },
                5: function() { return "5" },
                6: function() { return "6" },
                7: function() { return "7" },
                8: function() { return "8" },
                9: function() { return "9" }
            }

            keymap = {
                32: function() { return " " },
            }
            shift_keymap = {



            }
            if(event.shiftKey && shift_keymap[event.keyCode]) {
              c = shift_keymap[event.keyCode]();
            } else if(keymap[event.keyCode]) {
              c = keymap[event.keyCode]();
            }else if(keyproperty_map[event.key]){
              c = keyproperty_map[event.key]();
            } else {
                c = chars[event.keyCode - 65];
            }
              if(c != "" && checkNextChar(c)){

//書き換え箇所②、各モードの$("#kashi_roma")の表示処理をupdateLineView()関数から行うように変更
updateLineView()

                add_typing_count();
if(document.querySelector("[value=oomoji_shift]").checked && event.shiftKey){
                typinglog.push([player.getCurrentTime().toFixed(3), c.toUpperCase(), score.toFixed(), count, completed ? 1 : 0, 1]);
}else{
                typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed(), count, completed ? 1 : 0, 1]);
}

                if(max_combo < combo) {
                  max_combo = combo;
                }
//書き換え箇所③、打鍵音とラインクリア音を鳴らす処理
//今まではcomboが1以上の時をif文で見ていましたが、ローマ字入力モード、かな入力モードでcombo=combo+1の処理が行われるタイミングが違うので
//かな入力で効果音を付加することができませんでした。keydownfunc(),keypressfunc_kana(),keydownfunc_kana()内で効果音を鳴らす処理を行えば、効果音を各モードに対応できます
typesound()
              } else if(!completed) {
                if(flag_nn && c == 'n')  {
                  flag_nn = false;
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed, count, completed ? 1 : 0, 2]);
                } else {
                 add_typing_miss_count();
if(document.querySelector("[value=oomoji_shift]").checked && event.shiftKey){
                  typinglog.push([player.getCurrentTime().toFixed(3), c.toUpperCase(), score.toFixed(), count, completed ? 1 : 0, 0]);
}else{
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed(), count, completed ? 1 : 0, 0]);
}
                  combo = 0;
                  miss_combo = miss_combo + 1;
//書き換え箇所④、ミス音・ミスエフェクトを表示する処理
miss_effect()
                }
              }
time_calculation()
type_per_min=typing_speed*60
update_status()

            }
          }
          if(event.code=="Space") {
            event.returnValue = false;
            if (event.preventDefault) {
              event.preventDefault();
            }
          }
          if(event.keyCode == 999) {
            if(mode == "kana") {
              mode = "roma";
            } else {
              mode = "kana";
            }
          }
          //if (event.preventDefault) {
          //  event.preventDefault();
          //}
          return false;

      }

//keypressfunc_kana()書き換え箇所全4箇所
keypressfunc_kana = function (event) {
       if(event.keyCode==721){
         console.log(888);
         return false;
       }
       var volume = 0;

//書き換え箇所①、headtime変数をグローバル化したのでheadtime変数を削除
//       var headtime = player.getCurrentTime();
       if(next_char.length >= 1 && next_char[0] != ""){
         var c = "";
         if(keyboard == 'mac') {
           kana_keymap = {
              165: function() { return ["ー"] },
              49: function() { return ["1", "ぬ"] },
              33: function() { return ["!", "ぬ"] },
              50: function() { return ["2", "ふ", "ぶ", "ぷ"] },
              34: function() { return ["ふ", "ぶ", "ぷ"] },
              51: function() { return ["3", "あ"] },
              52: function() { return ["4", "う", "ゔ"] },
              53: function() { return ["5", "え"] },
              54: function() { return ["6", "お"] },
              55: function() { return ["7", "や"] },
              56: function() { return ["8", "ゆ"] },
              57: function() { return ["9", "よ"] },
              45: function() { return ["-", "ほ", "ぼ", "ぽ"] },
              61: function() { return ["=", "ほ", "ぼ", "ぽ"] },
              94: function() { return ["へ", "べ", "ぺ" ]},
              126: function() { return ["へ", "べ", "ぺ"] },
              113: function() { return ["q", "た", "だ"] },
              81: function() { return ["q", "た", "だ"] },
              119: function() { return ["w", "て", "で"] },
              87: function() { return ["w", "て", "で"] },
              101: function() { return ["e", "い"] },
              69: function() { return ["e", "い"] },
              114: function() { return ["r", "す", "ず"] },
              82: function() { return ["r", "す", "ず"] },
              116: function() { return ["t", "か", "が"] },
              84: function() { return ["t", "か", "が"] },
              121: function() { return ["y", "ん"] },
              89: function() { return ["y", "ん"] },
              117: function() { return ["u", "な"] },
              85: function() { return ["u", "な"] },
              105: function() { return ["i", "に"] },
              73: function() { return ["i", "に"] },
              111: function() { return ["o", "ら"] },
              79: function() { return ["o", "ら"] },
              112: function() { return ["p", "せ", "ぜ"] },
              80: function() { return ["p", "せ", "ぜ"] },
              97: function() { return ["a", "ち", "ぢ"] },
              65: function() { return ["a", "ち", "ぢ"] },
              115: function() { return ["s", "と", "ど"] },
              83: function() { return ["s", "と", "ど"] },
              100: function() { return ["d", "し", "じ"] },
              68: function() { return ["d", "し", "じ"] },
              102: function() { return ["f", "は", "ば", "ぱ"] },
              70: function() { return ["f", "は", "ば", "ぱ"] },
              103: function() { return ["g", "き", "ぎ"] },
              71: function() { return ["g", "き", "ぎ"] },
              104: function() { return ["h", "く", "ぐ"] },
              72: function() { return ["h", "く", "ぐ"] },
              106: function() { return ["j", "ま"] },
              74: function() { return ["j", "ま"] },
              107: function() { return ["k", "の"] },
              75: function() { return ["k", "の"] },
              108: function() { return ["l", "り"] },
              76: function() { return ["l", "り"] },
              59: function() { return [";", "れ"] },
              43: function() { return ["+", "れ"] },
              58: function() { return [":", "け", "げ"] },
              42: function() { return ["*", "け", "げ"] },
              93: function() { return ["]", "む"] },
              125: function() { return ["}", "む"] },
              122: function() { return ["z", "つ", "づ"] },
              90: function() { return ["z", "つ", "づ"] },
              120: function() { return ["x", "さ", "ざ"] },
              88: function() { return ["x", "さ", "ざ"] },
              99: function() { return ["c", "そ", "ぞ"] },
              67: function() { return ["c", "そ", "ぞ"] },
              118: function() { return ["v", "ひ", "び", "ぴ"] },
              86: function() { return ["v", "ひ", "び", "ぴ"] },
              98: function() { return ["b", "こ", "ご"] },
              66: function() { return ["b", "こ", "ご"] },
              110: function() { return ["n", "み"] },
              78: function() { return ["n", "み"] },
              109: function() { return ["m", "も"] },
              77: function() { return ["m", "も"] },
              44: function() { return [",", "ね"] },
              60: function() { return ["<", "、"] },
              46: function() { return [".", "る"] },
              62: function() { return [">", "。"] },
              47: function() { return ["/", "め"] },
              63: function() { return ["?", "・"] },
              95: function() { return ["_", "ろ"] },
              64: function() { return ["@", "゛"] },
              96: function() { return ["`", "゛"] },
              91: function() { return ["[", "゜"] },
              123: function() { return ["「", "゜"] },
              35: function() { return ["ぁ","#"] },
              36: function() { return ["ぅ","$"] },
              37: function() { return ["ぇ","%"] },
              38: function() { return ["ぉ","&"] },
              39: function() { return ["ゃ", "'"] },
              40: function() { return ["(", "ゅ"] },
              41: function() { return [")", "ょ"] },
              69: function() { return ["e", "ぃ"] },
              90: function() { return ["z", "っ"] }
          }
            daku = false;
            daku_kana_list = ["ゔ","が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ"];
            handaku = false;
            handaku_kana_list = ["ぱ","ぴ","ぷ","ぺ","ぽ"];
          } else {
             windows_keymap = {
              192: function() { return "゛" },
              39: function() { return ["ゃ", "'"] },
              94: function() { return ["へ", "^", "べ", "ぺ"] },
              126: function() { return ["へ", "~", "べ", "ぺ"] },
              38: function() { return ["ぉ", "&"] },
              40: function() { return ["(", "ゅ"] },
              41: function() { return [")", "ょ"] },
              92: function() { return ["ろ", "ー", "-"] },
              95: function() { return "ろ" },
              61: function() { return ["=", "ほ", "ぼ", "ぽ"] },
              43: function() { return ["+", "れ"] },
              59: function() { return [";", "れ"] },
              34: function() { return ["ふ", "ぶ", "ぷ"] },
              124: function() { return ["|", "」"] },
              64: function() { return ["@", "゛"] },
              96: function() { return "゛" },
              38: function() { return ["ぉ", "&"] },
              93: function() { return ["む", "]"] },
              125: function() { return ["}", "「"] },
              91: function() { return ["[", "゜"] },
              123: function() { return ["{", "゛"] },
              58: function() { return [":", "け", "げ"] },
              42: function() { return ["*", "け", "げ"] }
             }
             mac_keymap = {
              94: function() { return ["ぉ","^"] },
              38: function() { return ["ゃ", "&"] },
              42: function() { return ["ゅ", "*"] },
              40: function() { return ["ょ", "("] },
              41: function() { return ["を", ")"] },
              95: function() { return ["_", "ほ", "ぼ", "ぽ"] },
              45: function() { return ["-", "ほ", "ぼ", "ぽ"] },
              61: function() { return ["=", "へ", "べ", "ぺ"] },
              43: function() { return ["+", "へ", "べ", "ぺ"] },
              59: function() { return [";", "れ"] },
              58: function() { return [":", "れ"] },
              39: function() { return ["'", "け", "げ"] },
              34: function() { return ["け", "げ"] },
              92: function() { return "む" },
              165: function() { return "-", "ー" },
              124: function() { return "|" },
              91: function() { return ["[", "゛"] },
              123: function() { return ["{", "゛"] },
              125: function() { return ["}", "「"] },
              93: function() { return ["]", "゜"] },
              64: function() { return ["ふ", "@", "ぶ", "ぷ"] },
              126: function() { return ["-", "~"] },
             }
             kana_keymap = {
              49: function() { return ["1", "ぬ"] },
              33: function() { return ["!", "ぬ"] },
              50: function() { return ["2", "ふ", "ぶ", "ぷ"] },
              51: function() { return ["3", "あ"] },
              52: function() { return ["4", "う", "ゔ"] },
              53: function() { return ["5", "え"] },
              54: function() { return ["6", "お"] },
              55: function() { return ["7", "や"] },
              56: function() { return ["8", "ゆ"] },
              57: function() { return ["9", "よ"] },
              45: function() { return ["-", "ほ", "ぼ", "ぽ"] },
              113: function() { return ["q", "た", "だ"] },
              81: function() { return ["q", "た", "だ"] },
              119: function() { return ["w", "て", "で"] },
              87: function() { return ["w", "て", "で"] },
              101: function() { return ["e", "い"] },
              69: function() { return ["e", "い"] },
              114: function() { return ["r", "す", "ず"] },
              82: function() { return ["r", "す", "ず"] },
              116: function() { return ["t", "か", "が"] },
              84: function() { return ["t", "か", "が"] },
              121: function() { return ["y", "ん"] },
              89: function() { return ["y", "ん"] },
              117: function() { return ["u", "な"] },
              85: function() { return ["u", "な"] },
              105: function() { return ["i", "に"] },
              73: function() { return ["i", "に"] },
              111: function() { return ["o", "ら"] },
              79: function() { return ["o", "ら"] },
              112: function() { return ["p", "せ", "ぜ"] },
              80: function() { return ["p", "せ", "ぜ"] },
              97: function() { return ["a", "ち", "ぢ"] },
              65: function() { return ["a", "ち", "ぢ"] },
              115: function() { return ["s", "と", "ど"] },
              83: function() { return ["s", "と", "ど"] },
              100: function() { return ["d", "し", "じ"] },
              68: function() { return ["d", "し", "じ"] },
              102: function() { return ["f", "は", "ば", "ぱ"] },
              70: function() { return ["f", "は", "ば", "ぱ"] },
              103: function() { return ["g", "き", "ぎ"] },
              71: function() { return ["g", "き", "ぎ"] },
              104: function() { return ["h", "く", "ぐ"] },
              72: function() { return ["h", "く", "ぐ"] },
              106: function() { return ["j", "ま"] },
              74: function() { return ["j", "ま"] },
              107: function() { return ["k", "の"] },
              75: function() { return ["k", "の"] },
              108: function() { return ["l", "り"] },
              76: function() { return ["l", "り"] },
              59: function() { return [";", "れ"] },
              122: function() { return ["z", "つ", "づ"] },
              90: function() { return ["z", "つ", "づ"] },
              120: function() { return ["x", "さ", "ざ"] },
              88: function() { return ["x", "さ", "ざ"] },
              99: function() { return ["c", "そ", "ぞ"] },
              67: function() { return ["c", "そ", "ぞ"] },
              118: function() { return ["v", "ひ", "び", "ぴ"] },
              86: function() { return ["v", "ひ", "び", "ぴ"] },
              98: function() { return ["b", "こ", "ご"] },
              66: function() { return ["b", "こ", "ご"] },
              110: function() { return ["n", "み"] },
              78: function() { return ["n", "み"] },
              109: function() { return ["m", "も"] },
              77: function() { return ["m", "も"] },
              44: function() { return [",", "ね"] },
              60: function() { return ["<", "、"] },
              46: function() { return [".", "る"] },
              62: function() { return [">", "。"] },
              47: function() { return ["/", "め"] },
              63: function() { return ["?", "・"] },
              35: function() { return ["ぁ","#"] },
              36: function() { return ["ぅ","$"] },
              37: function() { return ["ぇ","%"] },
              69: function() { return "ぃ" },
              90: function() { return "っ" }
          }
            console.log(event.keyCode);
            if(navigator.userAgent.match(/Mac|PPC/)) {
              kana_keymap = $.extend(kana_keymap, mac_keymap);
            } else {
              kana_keymap = $.extend(kana_keymap, windows_keymap);
            }
            daku = false;
            daku_kana_list = ["ゔ","が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ"];
            handaku = false;
            handaku_kana_list = ["ぱ","ぴ","ぷ","ぺ","ぽ"];

            }
            if(kana_keymap[event.keyCode]) {
              c = kana_keymap[event.keyCode]();
              if($.inArray(next_char[0],daku_kana_list) > -1) {
                daku = true;
              } else if ($.inArray(next_char[0],handaku_kana_list) > -1) {
                handaku = true;
              }
            } else if(!event.shiftKey && event.keyCode == 48){
              c = ["0", "わ"];
            }

//書き換え箇所②、$("#kashi_roma")の表示処理をupdateLineView()関数から行うように変更
              if(c != "" && checkNextKana(c, daku, handaku)){
updateLineView()
//                $("#kashi_roma").html("<span style='color:"+(next_char.length == 0 ? '#1eff52' : '#09c')+"'>"+already_input+"</span>&nbsp;" + String(next_char[0] || []) + String(line_input_kana.join('')));
                add_typing_count();
                typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed(), count, completed ? 1 : 0, 1]);
                if(max_combo < combo) {
                  max_combo = combo;
                }
//書き換え箇所③ 打鍵音・ラインクリア音を鳴らす処理
typesound()

              } else if(!completed) {
                if(flag_nn && c == 'n')  {
                  flag_nn = false;
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed, count, completed ? 1 : 0, 2]);
                } else if(daku || handaku) {
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed, count, completed ? 1 : 0, 2]);
                } else {
                  add_typing_miss_count();
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed(), count, completed ? 1 : 0, 0]);
                  combo = 0;
                  miss_combo = miss_combo + 1;
//書き換え箇所④ ミス音・ミスエフェクトを表示する処理
miss_effect()
                }
              }
time_calculation()
type_per_min=typing_speed*60
update_status()

        }
        if(event.keyCode == 32) {
          event.returnValue = false;
          if (event.preventDefault) {
            event.preventDefault();
          }
        }
        return false;
      }


//keydownfunc_kana()書き換え箇所全3箇所
keydownfunc_kana=function (event) {
        c = "";
          if(navigator.userAgent.match(/Mac|PPC/)) {
            if(event.keyCode == 0) {
              c = ["ー", "-", "ろ"];
            } else if(event.shiftKey && event.keyCode == 48){
              c = ["を"];
            }
          } else {
            if(event.shiftKey && event.keyCode == 48){
              c = ["を"];
            }
          }
        if(c != "") {
              daku = false;
              handaku = false;

//書き換え箇所①、$("#kashi_roma")の表示処理をupdateLineView()関数から行うように変更
              if(checkNextKana(c, daku, handaku)){
updateLineView()
                add_typing_count();
//                type_per_min = (typing_count / (playing_sec * 60));
                typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed(), count, completed ? 1 : 0, 1]);
                if(max_combo < combo) {
                  max_combo = combo;
                }
//書き換え箇所② 打鍵音・ラインクリア音を鳴らす処理
typesound()
              } else if(!completed) {
                if(flag_nn && c == 'n')  {
                  flag_nn = false;
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed, count, completed ? 1 : 0, 2]);
                } else {
                  add_typing_miss_count();
                  typinglog.push([player.getCurrentTime().toFixed(3), c, score.toFixed(), count, completed ? 1 : 0, 0]);
                  combo = 0;
                  miss_combo = miss_combo + 1;

//書き換え箇所③ ミス音・ミスエフェクトを表示する処理
miss_effect()
                }
              }
time_calculation()
type_per_min=typing_speed*60
update_status()
        }
       arrowkey();
       return false;
     }

parseRomaMap = function (data){
        var result = new Array();
        var lines = data.split("\n");
const roma_length = lines.length
for (let s=0; s<roma_length; s++){
          result.push(lines[s].split("\t"));
        };
        result.push([" "," "]);
        return result;
      }

parseLyrics = function (data) {
        var lines = data.split("\n");
        typing_array = new Array;
        lyrics_array = [];

const lines_length = lines.length
for (let s=0; s<lines_length; s++){
          if(s==0) {
            a = lines[s].split("\t");
            bufferTimer = setInterval(function() {
              updateMovieBuffer();
            },42);
            $("#play_botton").visible = true;
          } else {
            a = lines[s].split("\t");
            if(a.length > 2){
              var arr = hiraganaToRomaArray(a[2]);
              typing_array.push(arr[0]);
              typing_array_kana.push(arr[1]);
              typing_array_roma.push(arr[2]);
              //a[2] = hiraganaToRoma(a[2]);
            } else {
              typing_array.push([]);
              typing_array_kana.push([]);
              typing_array_roma.push([]);
            }
            lyrics_array.push(a);
            if(a[1] == "end") {
movieTotalTime = parseInt(a[0]);
movie_mm =("00" + parseInt(parseInt(movieTotalTime) / 60)).slice(-2)
movie_ss = ("00" +(parseInt(movieTotalTime) - movie_mm * 60)).slice(-2)
var change_bar_base = document.createElement("progress");
    change_bar_base.setAttribute("max", movieTotalTime);
    change_bar_base.setAttribute("value", 0);
    change_bar_base.setAttribute("id", "bar_base");
    change_bar_base.setAttribute("class", "progress");
document.getElementById("bar_base").parentNode.replaceChild(change_bar_base,document.getElementById("bar_base"));

var changebar_input_base = document.createElement("progress");
    changebar_input_base.setAttribute("value", 0);
    changebar_input_base.setAttribute("id", "bar_input_base");
    changebar_input_base.setAttribute("class", "progress");
document.getElementById("bar_input_base").parentNode.replaceChild(changebar_input_base,document.getElementById("bar_input_base"));


break;
            }
          }
        };
        return lyrics_array;
      }


hiraganaToRomaArray = function (str) {

        var str_array = [];
        var kana_array = [];
        var roma_array = [];

const romaMap_length = romaMap.length
for (let i=0; i<romaMap_length; i++){
          if(romaMap[i].length > 1){
            str = str.replace(RegExp(romaMap[i][0],"g"),"\t"+i+"\t");
          }
        };
const str_length = (str.split(/\s+/)).length
str = str.split(/\s+/)
for (let i=0; i<str_length; i++){
          if(str[i] != "") {
            if(str.length > 0 && romaMap[parseInt(str[i])]){
              kana_array.push(romaMap[parseInt(str[i])][0]);
              str_array.push(romaMap[parseInt(str[i])].slice(1));
              roma_array.push(romaMap[parseInt(str[i])][1]);

if( localStorage.getItem('oomoji_shift') == "true" && /[A-ZＡ-Ｚ]/.test(kana_array[kana_array.length-1]) ){
roma_array.splice(-1,1,kana_array[kana_array.length-1])
   }
//「～」はハイフンで入力できる仕様なので「ー」に変換。設定で全角長音記号にも対応
if(localStorage.getItem('word_disable') == "true"&&localStorage.getItem('chiruda_chouoxn') == "true"){
if(kana_array[kana_array.length-1]=="～"){
kana_array.splice(-1,1,'ー')
}
}else{
if(kana_array[kana_array.length-1]=="～"){
roma_array.splice(-1,1,'~')
str_array[str_array.length-1][0] = '~'
}
}
//579はromaMapの「ん」
//s_log=579のとき「あいうえお、なにぬねの」など打鍵パターンが変化する文字がkana_arrayに追加されたときに、前回追加した「n」を「nn」に置き換えます。
//正規表現にマッチする文字は[あ行、な行、や行、ん、アルファベット]
if(kana_array[kana_array.length-2]=="ん" && /あ|い|う|え|お|な|に|ぬ|ね|の|や|ゆ|よ|ん|[a-zA-Zａ-ｚＡ-Ｚ]/.test(kana_array[kana_array.length-1])){
roma_array.splice(-2,1,'nn')
str_array[str_array.length-2][0] = 'nn'

}else if(kana_array[kana_array.length-2]=="ん" && kana_array[kana_array.length-1]){
str_array[str_array.length-1].splice(1, 0, 'n'+str_array[str_array.length-1][0])
}
            } else if(localStorage.getItem('kigou_disable') != "true"||localStorage.getItem('word_disable') != "true"){
              kana_array.push([str[i].replace(/…/g,"...")
.replace(/‥/g,"..")]);
              str_array.push([str[i]
.replace(/、/g,",")
.replace(/。/g,".")
.replace(/！/g,"!")
.replace(/？/g,"?")
.replace(/・/g,"\/")
.replace(/＠/g,"@")
.replace(/”/g,"\"")
.replace(/＃/g,"#")
.replace(/＄/g,"\$")
.replace(/％/g,"%")
.replace(/＆/g,"&")
.replace(/’/g,"'")
.replace(/（/g,"\(")
.replace(/）/g,"\)")
.replace(/￥/g,"\\")
.replace(/｜/g,"\|")
.replace(/「/g,"\[")
.replace(/」/g,"\]")
.replace(/｛/g,"\{")
.replace(/｝/g,"\}")
.replace(/｀/g,"`")
.replace(/＊/g,"\*")
.replace(/＋/g,"\+")
.replace(/：/g,":")
.replace(/；/g,";")
.replace(/＿/g,"_")
.replace(/＜/g,"<")
.replace(/＞/g,">")
.replace(/＝/g,"=")
.replace(/＾/g,"\^")
.replace(/…/g,"...")
.replace(/‥/g,"..")
.replace(/←/g,"zh")
.replace(/↓/g,"zj")
.replace(/↑/g,"zk")
.replace(/→/g,"zl")
.replace(/『/g,"z[")
.replace(/』/g,"z]")
.replace(/ヰ/g,"wi")
.replace(/ゐ/g,"wi")
.replace(/ヱ/g,"we")
.replace(/ゑ/g,"we")]);
              roma_array.push([str[i].replace(/、/g,",")
.replace(/。/g,".")
.replace(/！/g,"!")
.replace(/？/g,"?")
.replace(/・/g,"\/")
.replace(/＠/g,"@")
.replace(/”/g,"\"")
.replace(/＃/g,"#")
.replace(/＄/g,"\$")
.replace(/％/g,"%")
.replace(/＆/g,"&")
.replace(/’/g,"'")
.replace(/（/g,"\(")
.replace(/）/g,"\)")
.replace(/￥/g,"\\")
.replace(/｜/g,"\|")
.replace(/「/g,"\[")
.replace(/」/g,"\]")
.replace(/｛/g,"\{")
.replace(/｝/g,"\}")
.replace(/｀/g,"`")
.replace(/＊/g,"\*")
.replace(/＋/g,"\+")
.replace(/：/g,":")
.replace(/；/g,";")
.replace(/＿/g,"_")
.replace(/＜/g,"<")
.replace(/＞/g,">")
.replace(/＝/g,"=")
.replace(/＾/g,"\^")
.replace(/…/g,"...")
.replace(/‥/g,"..")
.replace(/←/g,"zh")
.replace(/↓/g,"zj")
.replace(/↑/g,"zk")
.replace(/→/g,"zl")
.replace(/『/g,"z[")
.replace(/』/g,"z]")
.replace(/ヰ/g,"wi")
.replace(/ゐ/g,"wi")
.replace(/ヱ/g,"we")
.replace(/ゑ/g,"we")]);

//全角記号・三点リーダを対応

//ひらがなの直後のカンマ、ピリオドを句読点に変換(三点リーダは変換されない)
if(/[ぁ-ん|ヴ|ゔ|ー|゛]/.test(kana_array[kana_array.length-2]) && /^[\.](?![\.])/.test(kana_array[kana_array.length-1][0])){
kana_array.splice(-1,1,['。'])
}
if(/[ぁ-ん|ヴ|ゔ|ー|゛]/.test(kana_array[kana_array.length-2]) && /^[\,](?![\,])/.test(kana_array[kana_array.length-1][0])){
kana_array.splice(-1,1,['、'])
}
if(kana_array[kana_array.length-2]=="ん" && kana_array[kana_array.length-1]){
str_array[str_array.length-1].splice(1, 0, 'n'+str_array[str_array.length-1][0])
}
            }
          }
if(localStorage.getItem('word_disable') == "true"&&localStorage.getItem('space_disable') == "true" && kana_array[kana_array.length-1] == " "){
kana_array.pop()
str_array.pop()
roma_array.pop()
}
        };

//kana_array最後の文字が「ん」だった場合も[nn]に置き換えます。
if(kana_array[kana_array.length-1] == "ん"){
roma_array.splice(-1,1,'nn')
str_array[str_array.length-1][0] = 'nn'
}

return [str_array, kana_array, roma_array];
}

checkNextChar=function (c){
        if(flag_nn && c == "x") {
          flag_nn = false;
        }
        flag = false;
        flag_roma = false;
next_char_slice = next_char.slice(1)
const next_char_typing_length = next_char_slice.length

for (let i=0; i<next_char_typing_length; i++){
//ncは打鍵パターンが入る
//c==nc[0][0](先頭の文字が一致したときに正解の処理がされる)
          if(c==next_char_slice[i][0][0]){


if(document.querySelector("[value=oomoji_shift]").checked){
if (/[A-ZＡ-Ｚ]/.test(next_char[0]) && !event.shiftKey||(/[a-zａ-ｚ]/.test(next_char[0]) && event.shiftKey) ){
break;
}}
//かな表示の記号系を正解色にする
if(Array.isArray(next_char[0]) && next_char[0][0].length > 1 && c!='w' && c!='z'){
already_input = already_input+next_char[0][0][0]
next_char[0][0] = next_char[0][0].slice(1);
}
//xnで「ん」を入力する場合は[nn]のパターンを削除
if(next_char[0]=='ん'&& c=='x' && line_input_roma[0] && line_input_roma[0][0]!='n'){
line_input[0]=line_input[0].filter(function(value) { return value.match(/^(?!(n)).*$/)})
}

if(!flag && next_char_slice[i].length >= 2){
//ひらがなを1文字ずつ処理する
if(next_char[0].length >= 2){
if(next_char[0][0]!='っ'&&(next_char_slice[i][1][0] == 'x' || next_char_slice[i][1][0] == 'l') || (next_char[0][0]=='っ' && (c=='u'||already_input_roma[already_input_roma.length-1]==c||c==next_char_slice[i][1][0]&&(next_char_slice[i][0][0] != 'x' && next_char_slice[i][0][0] != 'l'))) ){
already_input = already_input+next_char[0][0]
next_char[0] = next_char[0].slice(1);
}}
//以下打鍵パターンを絞る処理
if((c!='n'||next_char_slice[i]=='nn')&&next_char.slice(1).length>=2){
flag = true;

//打鍵パターンを絞る正規表現
regexp_c = new RegExp('^('+c+').*$')
next_char=[next_char[0]].concat(next_char.slice(1).filter(function(value) { return value.match(regexp_c)}))
//打鍵パターンを絞ったnext_charを再度eachで回す
next_char_slice=next_char.slice(1)
for (let j=0; j<next_char_slice.length; j++){
          if(c==next_char_slice[j][0][0]){
            next_char[j+1] = next_char_slice[j].slice(1);
          }
if(flag_roma == false) {
already_input_roma = already_input_roma + c;
flag_roma = true;
}
}
//最後に打鍵数が少ない順にソート
next_char=[next_char[0]].concat(next_char.slice(1).sort(function(a, b) {return a.length - b.length;}))
break
}
}
//以下から通常の処理
next_char[i+1] = next_char_slice[i].slice(1);
flag = true;

            if(flag_roma == false) {
if(document.querySelector("[value=oomoji_shift]").checked && /[A-ZＡ-Ｚ]/.test(next_char[0]) ){
              already_input_roma = already_input_roma + c.toUpperCase();
   }else{
              already_input_roma = already_input_roma + c;
   }
              flag_roma = true;
            }
            if(next_char_slice[i].length == 1) {
              already_input = already_input + next_char[0];
              next_char = line_input.shift(1) || [];
              line_input_roma.shift(1);
              next_char.unshift(line_input_kana.shift(1) || []);
              score+=next_point;
              if(next_char[0].length == 0) {
                if(!completed) {
                  completed = true;
                  complete_count = complete_count + 1;
                  if(play_mode == 'practice' && player.getPlayerState() == 2) {
                    player.playVideo();
                    createjs.Ticker.addEventListener("tick", playheadUpdate);
                    window.addEventListener('keydown',keydownfunc,true);
                    window.addEventListener('keyup',keyupfunc,true);
                  }
                }
              } else {
                next_point = next_char[1].length * score_per_char;
//ひらがな2文字の周りくどい入力方法ltuta,xtufu,silya,ltuteleなどを入力できなくする機能
if(document.querySelector("[value=mizumasi]").checked){
                if(next_char[0].length >= 2 && /^(?!(っゃ|っゅ|っょ|っぁ|っぃ|っぅ|っぇ|っぉ|っっ|っゎ|っヵ|っヶ))[ぁ-ん]/.test(next_char[0])) {
next_char=next_char.filter(function(value) { return value.match(/^(?!.*(x|l)).*$/)})
}
}
              }
break;
            }


}
        };
        if(flag&&score>200000){score=200000}
        return flag;
      }


var total_notes=0;
var line_length=0;

var total_notes_kana_mode = 0;
var kana_score_per_char = 0;

var difficulty_max = 0
var difficulty_average = 0;

var difficulty_max_kana = 0
var difficulty_average_kana = 0;

var line_speed_ranking=[];//打鍵速度が早い順で[ライン番号,ライン打鍵数,ラインの必要打鍵速度]が入る(1000notesまで)

//配点基準・必要速度を計算・表示
getScorePerChar=function () {
        c = 0.0;

line_notes_roma=0
line_notes_kana=0
line_daku_handaku=0
line_speed=0
kana_daku_handaku_length = 0
const typing_array_length = typing_array.length
for (let i=0; i<typing_array_length; i++){
//typing_arrayのi番号がend行と同じ番号なら総合打鍵数に含まない
if(lyrics_array[i][1]!='end' && typing_array[i] != ''){


//ラインの数・ライン時間
if(logcount == 0){logcount = i+1}
line_length++;
line_speed=lyrics_array[i+1][0]-lyrics_array[i][0]

//かな入力
line_daku_handaku=(typing_array_kana[i].join('').match( /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g ) || [] ).length
kana_daku_handaku_length += line_daku_handaku
line_notes_kana=typing_array_kana[i].join('').length
total_notes_kana_mode += (line_notes_kana+line_daku_handaku)


//ローマ字入力
line_notes_roma = typing_array_roma[i].join('').length
total_notes += line_notes_roma


//かな入力ライン速度
if( (line_notes_kana+line_daku_handaku)/line_speed > difficulty_max_kana ){
difficulty_max_kana = ((line_notes_kana+line_daku_handaku)/line_speed)
}
difficulty_average_kana += (line_notes_kana+line_daku_handaku)/line_speed

line_speed_ranking.push([i ,line_notes_roma, Number((line_notes_roma/line_speed).toFixed(2))])

//ローマ字入力ライン速度
difficulty_average += line_notes_roma/line_speed

}else if(lyrics_array[i][1]=='end'){
        //line_speed_rankingを打鍵速度が速い順に降順でソート
        line_speed_ranking.sort( function(a,b){return(b[2]-a[2]);} )
//if(line_speed_ranking.length>11){
//line_speed_ranking.splice(11-line_speed_ranking.length,9999)
//}
//var sum = 0;
//$.each(line_speed_ranking, function(i, line_speed){
//sum += line_speed[2]

//})
difficulty_max=line_speed_ranking[0][2]

//        line_speed_ranking.sort( function(a,b){return(a[0]-b[0]);} )
//console.log(line_speed_ranking)
//console.log(sum)
kana_score_per_char = 200000 / (total_notes_kana_mode-kana_daku_handaku_length)
difficulty_ave=(difficulty_average/line_length).toFixed(2)
difficulty_ave_kana=(difficulty_average_kana/line_length).toFixed(2)
difficulty_kana=difficulty_max_kana.toFixed(2)

    player.setVolume(localStorage.getItem('volume_storage'));
if (localStorage.getItem('initial_speed')) {

let initial_speed_array = localStorage.getItem('initial_speed');
initial_speed_array = JSON.parse(initial_speed_array);
initial_speed1=initial_speed_array[0]
initial_speed2=initial_speed_array[1]
initial_speed3=initial_speed_array[2]
initial_speed4=initial_speed_array[3]
initial_speed5=initial_speed_array[4]
document.getElementById("initial_speed1").innerHTML = initial_speed_array[0].toFixed(2);
document.getElementById("initial_speed2").innerHTML = initial_speed_array[1].toFixed(2);
document.getElementById("initial_speed3").innerHTML = initial_speed_array[2].toFixed(2);
document.getElementById("initial_speed4").innerHTML = initial_speed_array[3].toFixed(2);
document.getElementById("initial_speed5").innerHTML = initial_speed_array[4].toFixed(2);

if(document.querySelector(".movietitle span").textContent.replace(/[^0-9^\.]/g,"") == 1){
       play_speed = initial_speed_array[0];
       player.setPlaybackRate(initial_speed_array[0]);
document.getElementById("playspeed").innerHTML = initial_speed_array[0].toFixed(2)+"倍速";
document.getElementById("speed").innerHTML = initial_speed_array[0].toFixed(2);
document.getElementById("default_speed").innerHTML = initial_speed_array[0].toFixed(2)+"倍速";
}else if(document.querySelector(".movietitle span").textContent.replace(/[^0-9^\.]/g,"") == 2){
       play_speed = initial_speed_array[1];
       player.setPlaybackRate(initial_speed_array[1]);
document.getElementById("playspeed").innerHTML = initial_speed_array[1].toFixed(2)+"倍速";
document.getElementById("speed").innerHTML = initial_speed_array[1].toFixed(2);
document.getElementById("default_speed").innerHTML = initial_speed_array[1].toFixed(2)+"倍速";
}else if(document.querySelector(".movietitle span").textContent.replace(/[^0-9^\.]/g,"") == 3){
       play_speed = initial_speed_array[2];
       player.setPlaybackRate(initial_speed_array[2]);
document.getElementById("playspeed").innerHTML = initial_speed_array[2].toFixed(2)+"倍速";
document.getElementById("speed").innerHTML = initial_speed_array[2].toFixed(2);
document.getElementById("default_speed").innerHTML = initial_speed_array[2].toFixed(2)+"倍速";
}else if(document.querySelector(".movietitle span").textContent.replace(/[^0-9^\.]/g,"") == 4){
       play_speed = initial_speed_array[3];
       player.setPlaybackRate(initial_speed_array[3]);
document.getElementById("playspeed").innerHTML = initial_speed_array[3].toFixed(2)+"倍速";
document.getElementById("speed").innerHTML = initial_speed_array[3].toFixed(2);
document.getElementById("default_speed").innerHTML = initial_speed_array[3].toFixed(2)+"倍速";
}else if(document.querySelector(".movietitle span").textContent.replace(/[^0-9^\.]/g,"") == 5){
       play_speed = initial_speed_array[4];
       player.setPlaybackRate(initial_speed_array[4]);
document.getElementById("playspeed").innerHTML = initial_speed_array[4].toFixed(2)+"倍速";
document.getElementById("speed").innerHTML = initial_speed_array[4].toFixed(2);
document.getElementById("default_speed").innerHTML = initial_speed_array[4].toFixed(2)+"倍速";
}

}
//かな入力モード
if(document.querySelector("[name=mode_select]:checked").value == "kanamode_type"||document.querySelector("[name=mode_select]:checked").value == "kanamode_mac_type"){
document.querySelector("#difficult > span").innerHTML = '<span title="打鍵数"><i class="fas fa-drum" style="backgroundcolor=:#441188; border-radius: 16px;"></i> '+total_notes_kana_mode + '打</span>　<span title="ライン数"><i class="fas fa-scroll" style=""></i>'+line_length+'ライン</span>　<span title="長さ"><i class="far fa-clock" style=""></i>'+movie_mm+':'+movie_ss+'</span>　<span title="必要入力スピード"><i class="fas fa-tachometer-alt" style=""></i>平均'+difficulty_ave_kana+'打/秒, 最高'+difficulty_kana+'打/秒</span>';
}else{
document.querySelector("#difficult > span").innerHTML = '<span title="打鍵数"><i class="fas fa-drum" style="backgroundcolor=:#441188; border-radius: 16px;"></i> '+total_notes + '打</span>　<span title="ライン数"><i class="fas fa-scroll" style=""></i>'+line_length+'ライン</span>　<span title="長さ"><i class="far fa-clock" style=""></i>'+movie_mm+':'+movie_ss+'</span>　<span title="必要入力スピード"><i class="fas fa-tachometer-alt" style=""></i>平均'+difficulty_ave+'打/秒, 最高'+difficulty+'打/秒</span>';
}

break;
}
};
        return 200000 / total_notes;
      }




//書き換え箇所①headtime変数をグローバル変数化
//time_calculation() （打鍵速度計算や経過時間計算を行う関数）にて
//headtime変数が使える箇所が多いのでグローバルで使えるようにしたいです
//時間計算の処理は重いので、なるべく流用していきたい
var headtime = 0;
playheadUpdate = function () {
        if(finished) { return; }
        player.f.blur();
        headtime = player.getCurrentTime() + player.difftime;

document.getElementById("bar_base").setAttribute('value', headtime);
        if(skip != false && (completed || lyrics_array[count-1][2] == '' || !lyrics_array[count-1][2] || next_char=='')){
          if(lyrics_array[count][0] - headtime > skip && seeked_count != count) {
            player.seekTo(parseFloat(lyrics_array[count][0]) + player.difftime - skip);
            seeked_count = count;
            stop_count = 0;
            playheadUpdate();
          }
        }
        if(count > 0){
//ラインの進行時間をvalueに反映
if(document.querySelector("[value=line_hidden]").checked){
document.getElementById("bar_input_base").setAttribute('value', 0);
}else{
document.getElementById("bar_input_base").setAttribute('value', headtime - lyrics_array[count-1][0]);
}
        }
        if(play_mode == 'practice' && count > 0 && lyrics_array[count-1].length > 2 && lyrics_array[count-1][2].length != 0  && lyrics_array[count][0] - 0.5 <= headtime) {
          if(!completed) {
            if(player.getPlayerState() == 1) {
              createjs.Ticker.removeEventListener('tick');
              player.pauseVideo();
            }
            return;
          }
        }
        if(lyrics_array[count][0] <= headtime){

//次のライン時間を取得してmaxに反映

          if(lyrics_array[count][1] == "end") {
            finished = true;
            stop_movie();
            return;
          }

document.getElementById("bar_input_base").setAttribute('max', lyrics_array[count+1][0] - lyrics_array[count][0]);

line_update()
          if(count > 0 && lyrics_array[count].length == 3) {

            if(next_char == '' && line_input.length == 0 || completed) {
              //complete_count = complete_count + 1;
            } else {
              failer_count = failer_count + 1;
            }
            clearForNextString();
          }

document.getElementById("kashi").innerHTML = '<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;'+lyrics_array[count][1];
if(document.querySelector("[value=next_text_reading]").checked&&lyrics_array[count+1][1]!='end'){
document.getElementById("kashi_next").innerHTML = '<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;'+typing_array_kana[count+1].join('');
}else{
document.getElementById("kashi_next").innerHTML = '<ruby>&#8203;<rt>&#8203;</rt></ruby>&nbsp;'+lyrics_array[count+1][1];
}
          if(lyrics_array[count].length == 3) {
            line_input = typing_array[count];
            line_input_kana = typing_array_kana[count];
            if(kana_mode) {
              line_input_kana = line_input_kana.join('').split('');
            }
            line_input_roma = typing_array_roma[count];
            if(line_input.length > 0) {
              next_char = line_input.shift(1);
              next_char.unshift(line_input_kana.shift(1));
              line_input_roma.shift(1);

//書き換え箇所⑥、next_pointを決める処理に!kana_modeとkana_modeの分岐を追加
            if(!kana_mode) {
              next_point = next_char[1].length * score_per_char;

if(document.querySelector("[value=mizumasi]").checked){
                if(next_char[0].length >= 2 && /^(?!(っゃ|っゅ|っょ|っぁ|っぃ|っぅ|っぇ|っぉ|っっ|っゎ|っヵ|っヶ))[ぁ-ん]/.test(next_char[0])) {
next_char=next_char.filter(function(value) { return value.match(/^(?!.*(x|l)).*$/)})
}
}
            }else if(kana_mode) {
              next_point = score_per_char;
            }
            }else{
              next_char = [""];
              flag_nn = false;
            }
          } else {
            line_input = [];
            line_input_kana = [];
            line_input_roma = [];
            already_input = "";
            already_input_roma = "";
            next_char = [""];
            flag_nn = false;
          }

updateLineView()

          count+=1;
          completed=false;
          if(score>200000){score=200000}
          update_status();
if(typing_count>0){
gamerule()
}
if(!finished){
//次のラインの必要打鍵速度を計算
if(lyrics_array[count +1]){//曲終了前のライン以外
if(!kana_mode){
next_kpm = Number(((typing_array_roma[count].join("").length) / (lyrics_array[count+1][0]-lyrics_array[count][0]))*speed).toFixed(2)
}else if(kana_mode){
next_kpm = Number(((typing_array_kana[count].join('').length+( typing_array_kana[count].join('').match( /[ゔ||が||ぎ||ぐ||げ||ご||ざ||じ||ず||ぜ||ぞ||だ||ぢ||づ||で||ど||ば||び||ぶ||べ"||ぼ||ぱ||ぴ||ぷ||ぺ||ぽ]/g ) || [] ).length) / (lyrics_array[count+1][0]-lyrics_array[count][0]))*player.getPlaybackRate()).toFixed(2)
}
}

if(typing_array_kana[count] != '' && lyrics_array[count+1]){
document.getElementById("next_kpm").innerHTML = "<span id='kpm_color' style='color:"+document.querySelector("[name=next_lyrics_color]").value+";'>NEXT:<span class='next_kpm_value'>"+next_kpm+"</span>打/秒</span>";
}
//次のライン入力する文字が無かったらnext速度を表示しない
else if((typing_array_kana[count] == '' || !lyrics_array[count+1])){
document.getElementById("next_kpm").innerHTML = "&nbsp;";
}
if(document.querySelector("[value=play_scroll]").checked&&count>1&&document.documentElement.scrollTop+document.getElementById("kashi_roma").getBoundingClientRect().top<Number((window.scrollY+document.documentElement.clientHeight).toFixed())){
if(Number(window.scrollY+document.documentElement.clientHeight) < Number(document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight-20) && (document.documentElement.clientHeight-document.getElementsByTagName('header')[0].clientHeight)>parseInt(window.getComputedStyle(document.getElementById("controlbox")).height)-20){
if(Number(localStorage.getItem('scroll_adjustment1'))>=0){
window.scrollTo({
    top: (document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight-document.documentElement.clientHeight-10),
behavior: "smooth",
});
}else{
window.scrollTo({
    top: (document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight+Number(localStorage.getItem('scroll_adjustment1'))-document.documentElement.clientHeight),
behavior: "smooth",
});
}
}else if((document.documentElement.clientHeight-document.getElementsByTagName('header')[0].clientHeight)<parseInt(window.getComputedStyle(document.getElementById("controlbox")).height)){
if(document.getElementById("gauge").style.display == "none"){
window.scrollTo({
    top: document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top-document.getElementsByTagName('header')[0].clientHeight,
behavior: "smooth",
});
}else{
window.scrollTo({
    top: document.documentElement.scrollTop+document.getElementById("player").getBoundingClientRect().top+ document.getElementById("player").clientHeight-document.getElementsByTagName('header')[0].clientHeight,
    behavior: "smooth"
});
}
}else if((!lyrics_array[count-1][2]&&!lyrics_array[count-1][1] ||!lyrics_array[count-2][2]&&lyrics_array[count-1][2])){
if(document.documentElement.scrollTop+document.getElementById("kashi_roma").getBoundingClientRect().top+document.getElementById("kashi_roma").clientHeight>window.scrollY&&control_default_size >= Number(document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight-10)){
window.scrollTo({
    top:document.documentElement.scrollTop+document.getElementById("controlbox").getBoundingClientRect().top+document.getElementById("controlbox").clientHeight+Number(localStorage.getItem('scroll_adjustment1'))-document.documentElement.clientHeight
,
behavior: "smooth",
})
}
}
}}
        }
      }

function initial_diff_reset(){
initial_diff=0
document.getElementById("initial_diff").innerHTML = initial_diff.toFixed(2);
localStorage.setItem('diff_storage', Number(initial_diff))
}
function initial_diff_minus(){
initial_diff=Number(Number(localStorage.getItem('diff_storage')))

if(initial_diff != -4){
if(!event.shiftKey){
initial_diff=Number((initial_diff-0.01).toFixed(2))
}else{
initial_diff=Number((initial_diff-0.1).toFixed(2))
}
}else if(initial_diff == -4){
initial_diff=-4
}
document.getElementById("initial_diff").innerHTML = initial_diff.toFixed(2);
localStorage.setItem('diff_storage', Number(initial_diff))
player.difftime = Number(localStorage.getItem('diff_storage'))

}
function initial_diff_plus(){
initial_diff=Number(Number(localStorage.getItem('diff_storage')))

if(initial_diff != 4){
if(!event.shiftKey){
initial_diff=Number((initial_diff+0.01).toFixed(2))
}else{
initial_diff=Number((initial_diff+0.1).toFixed(2))
}
}else if(initial_diff == 4){
initial_diff=4
}
document.getElementById("initial_diff").innerHTML = initial_diff.toFixed(2);
localStorage.setItem('diff_storage', Number(initial_diff))
player.difftime = Number(localStorage.getItem('diff_storage'))

}
function initial_speed_reset(){
initial_speed1=1.0
initial_speed2=1.0
initial_speed3=1.0
initial_speed4=1.0
initial_speed5=1.0
document.getElementById("initial_speed1").innerHTML = "1.0";
document.getElementById("initial_speed2").innerHTML = "1.0";
document.getElementById("initial_speed3").innerHTML = "1.0";
document.getElementById("initial_speed4").innerHTML = "1.0";
document.getElementById("initial_speed5").innerHTML = "1.0";
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed1_down(){
if(initial_speed1 != 0.25){
initial_speed1=(initial_speed1-0.25)
}else if(initial_speed1 == 0.25){
initial_speed1=0.25

}
document.getElementById("initial_speed1").innerHTML = initial_speed1.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))

}
function initial_speed1_up(){
if(initial_speed1 != 2){
initial_speed1=(initial_speed1+0.25)
}else if(initial_speed1 == 2){
initial_speed1=2.00

}
document.getElementById("initial_speed1").innerHTML = initial_speed1.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed2_down(){
if(initial_speed2 != 0.25){
initial_speed2=(initial_speed2-0.25)
}else if(initial_speed2 == 0.25){
initial_speed2=0.25
}
document.getElementById("initial_speed2").innerHTML = initial_speed2.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed2_up(){
if(initial_speed2 != 2){
initial_speed2=(initial_speed2+0.25)
}else if(initial_speed2 == 2){
initial_speed2=2
}
document.getElementById("initial_speed2").innerHTML = initial_speed2.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed3_down(){
if(initial_speed3 != 0.25){
initial_speed3=(initial_speed3-0.25)
}else if(initial_speed3 == 0.25){
initial_speed3=0.25
}
document.getElementById("initial_speed3").innerHTML = initial_speed3.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed3_up(){
if(initial_speed3 != 2){
initial_speed3=(initial_speed3+0.25)
}else if(initial_speed3 == 2){
initial_speed3=2
}
document.getElementById("initial_speed3").innerHTML = initial_speed3.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed4_down(){
if(initial_speed4 != 0.25){
initial_speed4=(initial_speed4-0.25)
}else if(initial_speed4 == 0.25){
initial_speed4=0.25
}
document.getElementById("initial_speed4").innerHTML = initial_speed4.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed4_up(){
if(initial_speed4 != 2){
initial_speed4=(initial_speed4+0.25)
}else if(initial_speed4 == 2){
initial_speed4=2
}
document.getElementById("initial_speed4").innerHTML = initial_speed4.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed5_down(){
if(initial_speed5 != 0.25){
initial_speed5=(initial_speed5-0.25)
}else if(initial_speed5 == 0.25){
initial_speed5=0.25
}
document.getElementById("initial_speed5").innerHTML = initial_speed5.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function initial_speed5_up(){
if(initial_speed5 != 2){
initial_speed5=(initial_speed5+0.25)
}else if(initial_speed5 == 2){initial_speed5=2}
document.getElementById("initial_speed5").innerHTML = initial_speed5.toFixed(2);
initial_speed=[initial_speed1,initial_speed2,initial_speed3,initial_speed4,initial_speed5]
localStorage.setItem('initial_speed',JSON.stringify(initial_speed))
}
function set_status_setting(){
if(mode!="roma"&&mode!="kana"){return}
var kashi_roma_name="";
var kashi_sub_name="";
if(mode=="roma"){
  kashi_roma_name="roma";
  kashi_sub_name="kana";
}
if(mode=="kana"){
  kashi_roma_name="kana";
  kashi_sub_name="roma";
}
document.getElementById("status_setting").innerHTML= ".score{"+localStorage.getItem('score1')+"}.miss{"+localStorage.getItem('miss1')+"}"+localStorage.getItem('acc1')+".combo_counter{"+localStorage.getItem('combo_counter1')+"}.type_counter{"+localStorage.getItem('type_counter1')+"}.clear_counter{"+localStorage.getItem('clear_counter1')+"}.escape_counter{"+localStorage.getItem('escape_counter1')+"}.line_count{"+localStorage.getItem('line_count1')+"}.rank{"+localStorage.getItem('rank')+"}.typing_speed{"+localStorage.getItem('typing_speed')+"}#kashi_roma{font-size:"+document.querySelector("[name=font_size_"+kashi_roma_name+"]").value+"px;}#kashi_sub{font-size:"+document.querySelector("[name=font_size_"+kashi_sub_name+"]").value+"px;}";
}
function add_typing_count(){
typing_count+=1;
combo+=1;
miss_combo=0;
if(score>200000){score=200000}
}
function add_typing_miss_count(){
typing_miss_count+=1;
flag_nn=false;
if(score>0){score-=score_per_char/4}
if(score<0){score=0}
}
function arrowkey(){
          if(event.shiftKey && event.key == "ArrowUp"){
            skip = 2;
            update_skip();
            if (event.preventDefault) {
              event.preventDefault();
            }
          } else if(event.shiftKey && event.key == "ArrowDown"){
            skip = false;
            update_skip();
            if (event.preventDefault) {
              event.preventDefault();
            }
          }

else if(event.key == "ArrowDown") {
            volume = player.getVolume();
            volume = volume - 10;
            if(volume < 0) {
              volume = 0;
            }
            player.setVolume(volume);
document.getElementById("volume").innerHTML = volume
            if (event.preventDefault) {
              event.preventDefault();
            }
          } else if(event.key == "ArrowUp"){
            volume = player.getVolume();
            volume = volume + 10;
            if(volume > 100) {
              volume = 100;
            }
            player.setVolume(volume);
document.getElementById("volume").innerHTML = volume
            if (event.preventDefault) {
              event.preventDefault();
            }
          } else if(event.key == "ArrowLeft") {
            var difftime = player.difftime;
            difftime = difftime - 0.1;
            if(difftime < -4.0) {
              difftime = -4.0;
            }
            player.difftime = difftime;
document.getElementById("time_diff").innerHTML = difftime.toFixed(2);
            if (event.preventDefault) {
              event.preventDefault();
            }
          } else if(event.key == "ArrowRight"){
            var difftime = player.difftime;
            difftime = difftime + 0.1;
            if(difftime > 4.0) {
              difftime = 4.0;
            }
            player.difftime = difftime;
document.getElementById("time_diff").innerHTML = difftime.toFixed(2);
            if (event.preventDefault) {
              event.preventDefault();
            }
          }
}