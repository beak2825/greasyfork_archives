// ==UserScript==

//タイピングワード表示の処理高速化・不具合修正・MODの処理最適化ため

//プレイ前準備処理
//onPlayerReady()、parseRomaMap(),parseLyrics(),hiraganaToRomaArray()、getScorePerChar()、onPlayerStateChange()


//プレイ終了時処理
//stop_movie(),finish_movie()


//以上の関数を書き換えています。
//このスクリプトの適応時は書き換えた関数が優先して発動されているので注意をお願いします。


// @name         Typing Tube MOD official + RealTimeCombatting
// @namespace    https://typing-tube.net/
// @version      20231103
// @description  try to take over the world!!
// @author       Toshi
// @match        https://typing-tube.net/movie/show/*
// @match        https://typing-tube.net/movie/typing/*
// @noframes
// @grant GM_info
// @grant unsafeWindow
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/400774/Typing%20Tube%20MOD%20official%20%2B%20RealTimeCombatting.user.js
// @updateURL https://update.greasyfork.org/scripts/400774/Typing%20Tube%20MOD%20official%20%2B%20RealTimeCombatting.meta.js
// ==/UserScript==

//バージョンチェック値
const Ver = "20230717.1"

const VERSION = `<span style="float: right;color: #FFFFFF33;text-align: end;padding-right: 5px;">ver ${Ver}</span>`;

const PHONE_FLAG = navigator.userAgent.match(/(iPhone|iPod|iPad|Android.*Mobile)/i);
const IOS_FLAG = navigator.userAgent.match(/(iPhone|iPod|iPad)/i);

let typing_play_mode = 'roma'






/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@ページを開いたときのMOD追加機能処理 ここから---
*/

/**
 * @type {DOM} CONTROLBOX_SELECTOR - タイピングプレイエリア
 * @type {DOM} romaModeConfig  - ローマ字入力モードが有効の時に表示される設定。
 * @type {DOM} kanaModeConfig -  かな入力モードが有効の時に表示される設定。
 */
const CONTROLBOX_SELECTOR = document.getElementById("controlbox");
let kanaModeConfig , romaModeConfig;
const FONT_SIZE_KANA_DEFAULT = 21.0
const FONT_SIZE_ROMA_DEFAULT = 17.0
const SPASING_KANA_DEFAULT = 1.0
const SPASING_ROMA_DEFAULT = 2.2
const FONT_SHADOW_DEFAULT = 0.6

const KANA_SCROLL_LENGTH_DEFAULT = !PHONE_FLAG ? "10":"5";
const ROMA_SCROLL_LENGTH_DEFAULT = !PHONE_FLAG?"16":"8";



(function add_dom(){
	/**
     * @type {String} FOLDED_RULED_LINE - タイピングゲームの設定フォーム内で使用する折れ罫線。
     * @type {Array} DISABLE_SYMBOL_LIST - 記号省略設定有効時に省略される記号一覧の説明文。
     * @type {Array} VALID_SYMBOL_LIST - 記号省略設定有効時でも省略されない記号一覧の説明文。
     * @type {DOM} MOD_SETTINGS_MENU  - 動画上部の歯車アイコンをクリックすると表示されるタイピングゲームの設定フォーム。
     */
	const FOLDED_RULED_LINE = '<span class="folded-luled-line">└</span>';
	const DISABLE_SYMBOL_LIST = [":; (コロン,セミコロン)","!? (疑問符,感嘆符)","[](){}<>「」『』 (括弧系)","_・| (アンダーバー,中点,パイプライン)","”'`^ (クォーテーション&アポストロフィ系,キャロット)","、。,. (句読点,カンマ,ピリオド　※数字の直後のピリオドは省略されません)","～~- (全角チルダ,半角チルダ,ハイフン　※全角チルダは長音符[ー]に変換されます/アルファベット&スペース直後のハイフンのみ省略されます。)"].join("\n");
	const VALID_SYMBOL_LIST = ["ー(長音符)","￥","＆", "％","＠", "＃", "＄","＊", "＋","＝","数字直後のピリオド","アルファベット&スペース直後以外のハイフン"];


	const MOD_SETTINGS_MENU = document.createElement('form');
	MOD_SETTINGS_MENU.setAttribute("id", "mod-menu");
	MOD_SETTINGS_MENU.innerHTML=
		`<input id="all" type="radio" name="tab-item" checked>
  <label class="tab-item" for="all">入力</label>
  <input id="design" type="radio" name="tab-item">
  <label class="tab-item" for="design">エフェクト</label>
  <input id="playcolor" type="radio" name="tab-item">
  <label class="tab-item" for="playcolor">配色</label>
  <input id="etc" type="radio" name="tab-item">
  <label class="tab-item" for="etc">その他</label>
  <div class="mod-tab-content" id="all-content">
    <div class="mod-tab-content-description">${VERSION}
      <div id="roma-mode-config" style="display:none;">
        <h6>ローマ字入力設定</h6>
        <label title="かな表示モードは大文字ローマ字。ローマ字表示モードはかな表示が表示されます。">
          <input class="during-play-option" type="checkbox" name="sub" checked>
          <span id="roma-sub-display" style="display:none;">ローマ字文</span>
          <span id="kana-sub-display" style="display:none;">ひらがな文</span>を表示</label>
        <label title="「促音」例:「った」を「ltuta や xtuta」「拗音」例:「しゃ」を「silya や sixya」。等の打鍵数が多くなる入力を受け付けなくします。少ない打鍵数で入力出来るようにしたい方におすすめです。">
          <input class="during-play-option" type="checkbox" name="sokuon-yoon-disable">促音・拗音の入力パターンを最適化</label>
      </div>
      <div id="kana-mode-config">
        <h6>かな入力 / フリック入力設定</h6>
        <label id="kana-daku-handaku-split-setting-label" title="ONにすると「ば、ぱ、が、だ」→「は゛、は゜、か゛、た゛」のように濁点・半濁点が別れてタイピングワードに表示されます。">
          <input class="during-play-option" type="checkbox" name="dakuten-handakuten-split-mode">濁点・半濁点を分けて表示</label>
      </div>
      <div id="limits-config">
        <h6>制限モード</h6>
        <label style="display:inline-block;" title="以下の記号とスペースを省略します。\省略した文字数分、最大スコアが低くなります。\n\n省略記号一覧\n ${DISABLE_SYMBOL_LIST} \n\n省略しない記号一覧\n ${VALID_SYMBOL_LIST} ">
          <input type="checkbox" name="space-symbol-omit">スペース・記号を省略</label>
        <label style="display:none;" id="space-trace" display:none title="記号省略時に作られる文字間の余白を無効化します。">
          <input type="checkbox" name="margin-space-disable">文字間の余白を無効化</label>
        <label title="アルファベット大文字がタイピングワードに出現するようになります。SHIFTキーやCapsLockを使用して大文字を入力してください。">
          <input class="during-play-option" type="checkbox" name="case-sensitive-mode">アルファベット大文字を入力する</label>
        <label title="正確率に制限をかけるモードです。指定した正確率より下回ると動画が強制終了します。タイピングの正確性を上げる目標設定です。">
          <input class="during-play-option" type="checkbox" name="miss-limit-mode">ミス制限モード</label>
        <div id="miss-limit-mode-config" style="display:none;">${FOLDED_RULED_LINE}
          <label class="miss-limit-correct">目標正確率
            <input class="three-digits during-play-option" type="number" name="miss-limit-correct" value="95" min="0" max="100">%</label>
          <label title="目標正確率を下回った瞬間にゲームオーバーになります。玄人向け">
            <input class="during-play-option" type="radio" name="miss-limit-game-mode" value="keep-correct-mode">正確率を維持</label>
          <label title="目標正確率を達成する為のライフがstatusに表示されます。タイピングワードを逃す程ライフが減り、1ミスすると-1点されます。ライフがマイナスになると、目標正確率は達成不可能になりゲームオーバーになります。">
            <input type="radio" name="miss-limit-game-mode" value="life-correct-mode" checked>ライフ制</label>
          <span>
            <label title="ゲームオーバーすると効果音が鳴るようになります。">
              <input class="during-play-option" type="checkbox" name="gameover-sound-effect" checked>ゲームオーバー音</label>
          </span>
        </div>
      </div>
      <div id="preparation-config">
        <h6>時間調整</h6>
        <div style="
    display: flex;
    align-items: baseline;
">
          <label class="mod-menu-round-wrapper default-pointer" title="プレイ中に変更できる時間調整の初期値を変更します。">全体時間調整
            <span class="btn btn-link cursor-pointer"  title="タイミングが遅くなります。SHIFTキーを押しながらクリックすると-0.1します。" id="initial-time-diff-minus">-</span>
            <span name="initial-time-diff" class="caret" contenteditable="true">0.00</span>
            <span class="btn btn-link cursor-pointer" title="タイミングが早くなります。SHIFTキーを押しながらクリックすると+0.1します。" id="initial-time-diff-plus">+</span>
          </label>
          <button type="button" id="initial-time-diff-reset" class="btn btn-light mx-3 mb-3">時間調整をリセット</button>
        </div>
      </div>

      <div id="font-size-config">
        <h6>フォント設定</h6>
        <div id="font-option-container">
          <div class="d-flex">

          <label class="mod-menu-round-wrapper default-pointer">
            <span id="kana-main-font-size" style="display:none;">かな表示フォントサイズ</span>
            <span id="roma-main-font-size" style="display:none;margin-right: 0.5px;">ローマ字フォントサイズ</span>
            <span>
              <span class="btn btn-link cursor-pointer" id="kana-font-size-minus">-</span>
              <span name="kana-font-size-px" class="caret" contenteditable="true">${FONT_SIZE_KANA_DEFAULT.toFixed(1)}</span>px
              <span class="btn btn-link cursor-pointer" id="kana-font-size-plus">+</span>
            </span>
          </label>

          <label class="mod-menu-round-wrapper default-pointer">
            <span id="kana-sub-font-size" style="display:none;">かな表示フォントサイズ</span>
            <span id="roma-sub-font-size" style="display:none;margin-right: 0.5px;">ローマ字フォントサイズ</span>
            <span>
              <span class="btn btn-link cursor-pointer" id="roma-font-size-minus">-</span>
              <span name="roma-font-size-px" class="caret" contenteditable="true">${FONT_SIZE_ROMA_DEFAULT.toFixed(1)}</span>px
              <span class="btn btn-link cursor-pointer" id="roma-font-size-plus">+</span>
            </span>
          </label>
          </div>

          <div style="display:flex;margin-top:1rem;">
          <label class="mod-menu-round-wrapper default-pointer">
            <span id="kana-main-font-spacing" style="margin-right: 35.5px;">かな表示 文字間隔</span>
            <span>
              <span class="btn btn-link cursor-pointer" id="kana-font-spacing-minus">-</span>
              <span name="kana-font-spacing-px" class="caret" contenteditable="true">${SPASING_KANA_DEFAULT.toFixed(1)}</span>px
              <span class="btn btn-link cursor-pointer" id="kana-font-spacing-plus">+</span>
            </span>
          </label>
          <label class="mod-menu-round-wrapper default-pointer">
            <span id="roma-sub-font-spacing" style="margin-right: 35.5px;">ローマ字 文字間隔</span>
            <span>
              <span class="btn btn-link cursor-pointer" id="roma-font-spacing-minus">-</span>
              <span name="roma-font-spacing-px" class="caret" contenteditable="true">${SPASING_ROMA_DEFAULT.toFixed(1)}</span>px
              <span class="btn btn-link cursor-pointer" id="roma-font-spacing-plus">+</span>
            </span>
          </label>
          </div>

          <div style="display:flex;margin-top:1rem;align-items: flex-end;">
          <label class="mod-menu-round-wrapper default-pointer">
            <span id="font-shadow" style="margin-right: 51.5px;">テキスト縁取り</span>
            <span>
              <span class="btn btn-link cursor-pointer" id="font-shadow-minus">-</span>
              <span name="font-shadow-px" class="caret" contenteditable="true">${FONT_SHADOW_DEFAULT.toFixed(1)}</span>px
              <span class="btn btn-link cursor-pointer" id="font-shadow-plus">+</span>
            </span>
          </label>
          <label>
          <input class="during-play-option" type="checkbox" name="bordering-word">入力前の文字のみ縁取り</label>
          </div>
        </div>
        <button class="btn btn-light" type="button" id="font-size-reset">フォント設定をリセット</button>
      </div>
      <div id="sound-config">
        <h6>効果音・音量</h6>
        <span class="d-flex">
          <span class="sound-effect-list">
            <label title="正解打鍵をした時に効果音がなるようになります。">
              <input class="three-digits during-play-option" type="checkbox" name="typing-sound-effect">打鍵音</label>
          </span>
          <span class="sound-effect-list d-flex">
            <label title="ミス打鍵をした時に効果音がなるようになります。">
              <input class="three-digits during-play-option" type="checkbox" name="miss-sound-effect">ミス音</label>
            <label title="行頭のミス打鍵時もミス音を鳴らします" id="miss-sound-effect-beginning-line" style="display:none;">
              <input class="during-play-option" type="checkbox" name="miss-beginning-sound-effect">行頭のミス音</label>
          </span>
        </span>
        <span class="d-flex">
          <span class="sound-effect-list">
            <label title="ライン中のタイピングワードをすべて入力した時に効果音がなるようになります。">
              <input class="three-digits during-play-option" type="checkbox" name="clear-sound-effect">クリア音</label>
          </span>
          <span class="sound-effect-list">
            <label title="100コンボ以上コンボが続いている時にミスをすると、効果音が鳴るようになります">
              <input class="three-digits during-play-option" type="checkbox" name="combo-break-sound">100コンボ以上のミス音</label>
          </span>
        </span>
      </div>
    </div>
  </div>
  <div class="mod-tab-content" id="design-content">
    <div class="mod-tab-content-description rgba-color-scroll-padding" style="padding-top:20px;">
      <div id="input-config">
        <h6>タイピングワード表示</h6>
        <label title="タイピングワードが一行に収まるように表示され、指定の文字数入力するとワードがスクロールされていきます。">
          <input class="during-play-option" type="checkbox" name="character-scroll">タイピングワードをスクロール表示
          <button type="button" id="character-scroll-length-reset" class="btn btn-light m-3">スクロール数をリセット</button>
        </label>
        <div id="character-scroll-config" style="display:none;">${FOLDED_RULED_LINE}
          <label class="mod-menu-round-wrapper default-pointer">かな表示スクロール数
            <span>
              <span class="btn btn-link cursor-pointer" id="kana-scroll-length-minus">-</span>
              <span name="kana-scroll-length" class="caret during-play-option" contenteditable="true">${KANA_SCROLL_LENGTH_DEFAULT}</span>
              <span class="btn btn-link cursor-pointer " id="kana-scroll-length-plus">+</span>
            </span>
          </label>
          <label class="mod-menu-round-wrapper default-pointer">ローマ字表示スクロール数
            <span>
              <span class="btn btn-link cursor-pointer" id="roma-scroll-length-minus">-</span>
              <span name="roma-scroll-length" class="caret during-play-option" contenteditable="true">${ROMA_SCROLL_LENGTH_DEFAULT}</span>
              <span class="btn btn-link cursor-pointer" id="roma-scroll-length-plus">+</span>
            </span>
          </label>
        </div>
      </div>
      <div id="effect-config">
        <h6>エフェクト設定</h6>
<div style="display: flex;margin: 1rem 0;">
        <div>
          <label title="ミスをした文字の上に「・」マークが表示されます。">
            <input class="during-play-option" type="checkbox" name="miss-mark-effect" checked>ミスエフェクト</label>
        </div>
        <div>
          <label title="３・２・１・GO!のカウントダウンが表示されます。間奏中に歌詞がある場合は表示されません。">
            <input class="during-play-option" type="checkbox" name="countdown-effect" checked>カウントダウン</label>
        </div>
        <div>
          <label title="タイピングエリアの左上に現在コンボを表示します。">
            <input class="during-play-option" type="checkbox" name="combo-counter-effect" checked>コンボ表示</label>
        </div>
</div>
<div style="display: flex;margin: 1rem 0;">
        <div class="d-flex" style="align-items: center;">
          <select class="during-play-option" name="skip-guide-key" title="スキップ機能で使用するキーを設定できます。">
            <option value="skip-guide-space-key" selected>スペースキー</option>
            <option value="skip-guide-enter-key">Enterキー</option>
          </select>
          <label title="スキップ可能な時に「Type ~ key to skip. ⏩」と表示されるようになります。表示されているときにスペースキー又はEnterキーを押すとライン切り替わり1秒前にスキップします。">
            <span>スキップ表示</span>
          </label>
        </div>
</div>
      </div>
      <div id="lyric-font-color-config">
        <h6>歌詞の色/表示</h6>
        <div class="d-flex">
          <label>
            <span style="margin: 0 13px;">入力後</span>
            <input class="color during-play-option" value="#0099CC" name="correct-word-color">
          </label>
          <label>ラインクリア
            <input class="color during-play-option" value="#1eff52" name="line-clear-color">
          </label>
        </div>
        <div class="d-flex">
          <label>先頭の文字
            <input class="color during-play-option" value="#FFFFFF" name="next-character-color">
          </label>
          <label>
            <span style="margin: 0 19.5px;">未入力</span>
            <input class="color during-play-option" value="#FFFFFF" name="word-color">
          </label>
        </div>
        <div class="d-flex">
          <label style="cursor:default;">
            <span style="margin:0 0.8px;">次の歌詞：</span>
            <select class="during-play-option" style="width:156px;" name="next-lyric-display-option" title="次の歌詞に表示する内容を設定できます。">
              <option value="next-text-lyric" selected>歌詞</option>
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
          <input class="color" value="transparent" name="playarea-color" id="input2">
        </label>
        <button type="button" style="width: 97%;" id="playarea-color-reset" class="btn btn-light m-3">背景カラーをリセット</button>
      </div>
      <div id="line-color-config">
        <h6>ラインカラー</h6>
        <div class="d-flex">
          <label>
            <span style="margin: 0 4px;">ラインゲージ</span>
            <input class="color" value="#17a2b8" name="phrase-line-color">
          </label>
          <label>
            <span style="margin: 0 4px;">empty</span>
            <input class="color" value="#f5f5f5" name="empty-color">
          </label>
        </div>
        <div class="d-flex">
          <label>ラインゲージ2
            <input class="color" value="#ffc107" name="movie-line-color">
          </label>
        </div>
        <button type="button" style="width: 97%;" id="line-color-reset" class="btn btn-light m-3">ラインカラーをリセット</button>
      </div>
    </div>
  </div>
  <div class="mod-tab-content" id="etc-content">
    <div class="mod-tab-content-description">
      <p class="c-txtsp"></p>
      <div id="play-scroll-config">
        <h6>自動スクロール</h6>
        <label title="プレイ開始時やプレイ中の拡大値を変更したとき、自動でプレイエリアにスクロール位置が調整されます。プレイ開始時は画面内に動画が表示されていないと発動されません。">
          <input class="during-play-option" type="checkbox" name="play-scroll">プレイ開始時にスクロール位置を調整</label>
        <div id="adjust-config" style="display:flex;align-items:center;">${FOLDED_RULED_LINE}
          <select style="margin: 0 13px;position: relative;bottom: 5px;" name="scroll-adjustment" class="during-play-option">
            <option value="55" selected>中央</option>
            <option value="75">上揃え</option>
            <option value="-10">下揃え</option>
          </select>
        </div>
      </div>
      <div id="status-config">
        <h6>status表示設定</h6>
          <div class="d-flex" style="padding-top:7px;">
            <label>
              <input type="checkbox" name="visibility-score" checked>スコア</label>
            <label style="margin: 0 36px;">
              <input type="checkbox" name="visibility-miss" checked>ミス</label>
            <label style="margin: 0px -8px;">
              <input type="checkbox" name="visibility-escape-counter" checked>逃した文字数</label>
            <label style="margin: 0px 24px;">
              <input type="checkbox" name="visibility-typing-speed" checked>打鍵速度</label>
          </div>
          <div class="d-flex">
            <label>
              <input type="checkbox" name="visibility-rank" checked>現在の順位</label>
            <label>
              <input type="checkbox" name="visibility-correct" checked>正確率</label>
            <label>
              <input type="checkbox" name="visibility-type-counter" checked>正解打鍵</label>
            <label style="margin: 0 38px;">
              <input type="checkbox" name="visibility-remaining-line-counter" checked>残りライン</label>
          </div>
        </div>
      <div id="result-config">
        <h6>リザルト設定</h6>
        <div class="flex-column">
		<div class="d-flex">
          <label>
            <input type="radio" class="during-play-option" name="word-result" value="word-result" checked>ミスをした箇所を赤く表示</label>
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
       <div id="change-mode-config" style="display:flex;align-items:center;">${FOLDED_RULED_LINE}
          <label>かな入力モード選択時に切り替えるローマ字表示<select style="margin: 0 13px;" name="from-kana-mode-change">
            <option value="from-kana-display" selected>かな表示</option>
            <option value="from-roma-display">ローマ字表示</option>
          </select></label>
        </div>
      </div>
    </div>
  </div>
  <button type="button" id="setting-reset" class="btn btn-light">設定をリセット</button>`
	document.getElementsByClassName("share")[0].parentNode.insertBefore(MOD_SETTINGS_MENU , document.getElementsByClassName("share")[0].nextElementSibling);

	/**
     * @type {String} FOLDED_RULED_LINE - タイピングゲームの設定フォーム内で使用する折れ罫線。
     * @type {Array} DISABLE_SYMBOL_LIST - 記号省略設定有効時に省略される記号一覧の説明文。
     * @type {Array} VALID_SYMBOL_LIST - 記号省略設定有効時でも省略されない記号一覧の説明文。
     * @type {DOM} MOD_SETTINGS_MENU  - 動画上部の歯車アイコンをクリックすると表示されるタイピングゲームの設定フォーム。
     */
	//設定メニューの要素を変数に格納
	kanaModeConfig = document.getElementById("kana-mode-config")
	romaModeConfig = document.getElementById("roma-mode-config")

	document.getElementsByClassName("icon-cog-solid")[0].addEventListener('mousedown', function createModMenuEvent(){
		mod_menu_event()

		document.getElementById("modal-overlay").addEventListener('click', function(){
			document.getElementById("modal-overlay").style.display = "none";
			document.getElementById("mod-menu").style.display = "none";
		});
		document.getElementsByClassName("icon-cog-solid")[0].removeEventListener("mousedown",createModMenuEvent)
	});

	document.getElementsByClassName("icon-cog-solid")[0].addEventListener('click', event => {
		centering();
		document.getElementById("modal-overlay").style.display = "block";
		//コンテンツをセンタリングする
		document.getElementById("mod-menu").style.display = "block";
		document.getElementById("mod-menu").animate([{opacity: '0'}, {opacity: '1'}], 100)
	});

	window.addEventListener('resize', centering);

	createControlArea()

	createTypingModeOption()

	if(PHONE_FLAG){
		document.getElementById("play-scroll-config").style.display = "none"
		document.getElementById("status-mode").style.display = "none"
		document.querySelector("[value='kanamode_mac_type']").checked = true
	}
}());

function createControlArea(){
	document.getElementById("time_settings").style.visibility = "hidden"
	document.getElementById("time_settings").style.display = "flex"

	const SPEED_CHANGE_HTML = `<div id="speed_change">
  <span id="speed" class="control_option pointer">1.00倍速</span>
  <kbd id="speed_change_F10" class="shortcut_navi cursor-pointer select_none">F10</kbd>
</div>`
	const TIME_ADJUST_HTML =
`<div id="time_adjust">
  <span class="control_option time_adjust_head">
    <span id="time_">時間調整</span>
    <span id="time_diff">0.00</span>
  </span>
  <kbd id="time_adjust_minus" class="shortcut_navi pointer select_none">←</kbd>
  <kbd id="time_adjust_plus" class="shortcut_navi pointer select_none">→</kbd>
</div>`

	const RESTART_HTML =
`<div id="song_reset">
  <span id="restart" class="control_option pointer">
    <span>やり直し</span>
  </span>
  <kbd id="song_reset_F4" class="shortcut_navi cursor-pointer select_none">F4</kbd>
</div>`

	const SHORTCUTKEY_HTML =
`<div id="more_shortcutkey" class="control_option pointer">
  <span>ショートカットキー</span>
</div>`

	const SHORTCUT_LIST_HTML = `<div id="shortcut" class="short_popup" style="display:none;top:0px;width:100%;">
    <div style="display: flex;justify-content: space-between;">
      <div>
        <span class="control-option2" style="background: #1ABC9C;">一時停止・再開</span>
        <kbd class="shortcut-navi-display-block">Esc</kbd>
      </div>
      <div>
        <span class="control-option2" style="background: #F5AB35;">練習モードへ移行</span>
        <kbd class="shortcut-navi-display-block">F7</kbd>
      </div>
      <div>
        <span class="control-option2" style="background: #e67e22;">入力モード切り替え</span>
        <kbd class="shortcut-navi-display-block">Alt+kana</kbd>
      </div>
      <div style="display:${PHONE_FLAG ? " none ":"block "};">
        <span class="control-option2" style="background: #22A7F0;">音量調整 ±10</span>
        <kbd class="shortcut-navi-display-block">↑↓</kbd>
      </div>
      <div>
        <span class="control-option2" style="background: #2980b9;">0.01ずつ時間調整</span>
        <kbd class="shortcut-navi-display-block">Ctrl+Shift+←→</kbd>
      </div>
  </div>`

	//rankingタブにアンダーラインを追加。
	document.querySelector(".status .nav").children[1].classList.add('underline');

	if(PHONE_FLAG && document.documentElement.clientWidth < 650){
		const TIME_SETTING_CLONE = document.getElementById("time_settings").cloneNode(true)
		TIME_SETTING_CLONE.id = "time_settings2"
		document.getElementById("time_settings").style.marginBottom = "7px"
		document.getElementById("time_settings").parentNode.insertBefore(TIME_SETTING_CLONE, document.getElementById("time_settings").nextSibling);
		document.getElementById("time_settings2").innerHTML = `${TIME_ADJUST_HTML} ${SHORTCUTKEY_HTML}`

		document.getElementById("time_settings").innerHTML= `${SPEED_CHANGE_HTML} ${RESTART_HTML}`


	}else{
		document.getElementById("time_settings").innerHTML= `${SPEED_CHANGE_HTML} ${TIME_ADJUST_HTML} ${RESTART_HTML} ${SHORTCUTKEY_HTML}`
	}
	document.getElementsByClassName("status")[0].insertAdjacentHTML('afterbegin',SHORTCUT_LIST_HTML)
}

function createTypingModeOption(){
	while(document.querySelectorAll("[id*='playBotton']").length != 0){
		document.querySelectorAll("[id*='playBotton']")[0].remove()
	}
	document.getElementById("kashi_area").insertAdjacentHTML("beforebegin",`<form id="mode-select-area">
<p id="esckey" style="margin: 3px 0px 7px 0px; display:${PHONE_FLAG ? "none":"block"};">Enterキー / 動画をクリックして開始</p>
${PHONE_FLAG ? `<group class="inline-radio"><div id="playBotton5"><input type="radio" name="mode_select" value="kanamode_mac_type" title="フリック入力" class="flick" id="flick-mode"><label>フリック入力<small style="font-weight: 600;">ここをタップして開始すると<wbr>キーボードが表示されます！</small></label></div></group>` : ""}
${PHONE_FLAG ? `<div style="margin-top: 15px;"><small>Bluetoothキーボード等を接続してプレイ</small></div>` : ''}
<group class="inline-radio" ${PHONE_FLAG ? 'style="margin-top:0;"' : ''} id="play-mode-select">
  <div id="playBotton1"><input type="radio" name="mode_select" value="kana_type" title="かな表示" class="roma" checked><label><div>ローマ字<wbr>入力</div><small >かな表示</small></label></div>
  <div id="playBotton2"><input type="radio" name="mode_select" value="roma_type" title="ローマ字表示" class="roma"><label><div>ローマ字<wbr>入力</div><small>ローマ字表示</small></label></div>
  <div id="playBotton4"><input type="radio" name="mode_select" value="kanamode_type" title="かな入力" class="kana"><label>かな入力</label></div>
  ${!PHONE_FLAG ? `<div id="playBotton5"><input type="radio" name="mode_select" value="kanamode_mac_type" title="フリック入力" class="flick" id="flick-mode"><label>フリック入力</label></div>` : ""}
</group>

<div class="sub-button">
<style>
.speed-option {
    color: #FFF;
    display: inline-flex;
    align-content: center;
    align-items: center;
    font-size: inherit;
    width:${PHONE_FLAG ? `100%` : "16rem"};
	${PHONE_FLAG ? `margin-bottom:15px` : ""};
    justify-content: center;
}
.sub-button{
  display: flex;
  justify-content: space-between;
  margin: ${PHONE_FLAG ? `1rem` : "3rem"} 0 1.5rem 0;
${PHONE_FLAG ? `flex-direction: column;` : ""}
}
span.btn-border {
	border: 1px solid #FFF;
  font-weight:600;
  border-radius: 0;
  width:${PHONE_FLAG ? `100%` : "16rem"};
  color: rgb(255, 255, 255);
  }
    ${!PHONE_FLAG ? `
  .inline-radio small{
  position:absolute;
  bottom: 5.5px;
  }` : ""}

</style>
<span class="mod-menu-round-wrapper speed-option" style="transform: scale(1);" id="playBotton3">
<span>挑戦速度</span>
<button type="button" class="btn btn-link cursor-pointer" id="speed-down" data-toggle="tooltip" data-placement="bottom" title="再生速度を遅くして挑戦">-</button>
<span id="playspeed">1.00倍速</span>
<button type="button" class="btn btn-link cursor-pointer" id="speed-up" data-toggle="tooltip" data-placement="bottom" title="再生速度を早くして挑戦">+</button>
</span>
<div><span class="btn btn-border cursor-pointer" id="practice-mode-button" onclick="play_mode='practice';player.playVideo();">練習モードで開始</span></div>
</div>
</form>`)



	if(PHONE_FLAG){
		document.getElementById("flick-mode").addEventListener("click",create_flick_textbox)
		document.getElementById("flick-mode").addEventListener("click",mobile_sound_enables)
		document.getElementById("practice-mode-button").addEventListener("click",mobile_sound_enables)
	}
}



//MOD設定メニュー位置調整する関数
function centering(){
	//画面(ウィンドウ)の幅、高さを取得
	var w = document.body.clientWidth;
	//センタリングを実行する
	document.getElementById("mod-menu").style.width = (w >= 600 ? "580px" : "100%" );
}



let initialTimeDiff = 0.0 //ローカルストレージに保存された時間調整値

//MOD設定メニュー項目変更時に呼び出すイベント集
function mod_menu_event(){
	//設定リセット関数
	checkbox_effect_mod_open_play()

	document.getElementById("setting-reset").addEventListener('click', function (){
		let res = confirm("初期設定に戻します。よろしいですか？\n(設定の初期化完了後、ページのリロードを行います。)");
		if( res == true ) {
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.clear();
			request.onsuccess = event => {
				location.reload()
			}
		}
	});


	document.getElementById("playarea-color-reset").addEventListener('click', function (){

		document.getElementsByName('playarea-color')[0].value = "transparent"
		document.getElementsByName('playarea-color')[0].style.backgroundColor="transparent"
		document.getElementsByName('playarea-color')[0].style.color="rgb(0, 0, 0)"
		saveModOption()
	});


	document.getElementById("line-color-reset").addEventListener('click', function (){
		document.getElementsByName('phrase-line-color')[0].value = "#17a2b8";
		document.getElementsByName('phrase-line-color')[0].style.backgroundColor="rgb(23, 162, 184)"
		document.getElementsByName('phrase-line-color')[0].style.color="rgb(255, 255, 255)"

		document.getElementsByName('movie-line-color')[0].value = "#ffc107"
		document.getElementsByName('movie-line-color')[0].style.backgroundColor="rgb(255, 193, 7)"
		document.getElementsByName('movie-line-color')[0].style.color="rgb(0, 0, 0)"

		document.getElementsByName('empty-color')[0].value = "#f5f5f5"

		document.getElementsByName('empty-color')[0].style.backgroundColor="rgb(245, 245, 245)"
		document.getElementsByName('empty-color')[0].style.color="rgb(0, 0, 0)"
		saveModOption()
	});




	const MODAL_OVERLAY= document.createElement('div');
	MODAL_OVERLAY.setAttribute("id", "modal-overlay");
	MODAL_OVERLAY.setAttribute("style", "display:none;");
	document.body.appendChild(MODAL_OVERLAY);



	document.getElementById("mod-menu").addEventListener('change', saveModOption);

	let type_sound_selector = document.getElementsByName('typing-sound-effect')[0]
	let miss_sound_selector = document.getElementsByName('miss-sound-effect')[0]
	let clear_sound_selector = document.getElementsByName('clear-sound-effect')[0]
	let combo_break_sound_selector = document.getElementsByName('combo-break-sound')[0]
	let gameover_sound_selector = document.getElementsByName('gameover-sound-effect')[0]

	type_sound_selector.addEventListener('change', function(){
		if(type_sound_selector.checked){
			soundEffect.play('keyType')
		}
	});
	miss_sound_selector.addEventListener('change', function(){
		if(miss_sound_selector.checked){
			soundEffect.play('missType')
			document.getElementById("miss-sound-effect-beginning-line").style.display = "";
		}else{
			document.getElementById("miss-sound-effect-beginning-line").style.display = "none";
		}
	});
	clear_sound_selector.addEventListener('change', function(){if(clear_sound_selector.checked){ soundEffect.play('clearType') }});
	combo_break_sound_selector.addEventListener('change', function(){if(combo_break_sound_selector.checked){soundEffect.play('comboBreak')}});
	gameover_sound_selector.addEventListener('change', function(){if(gameover_sound_selector.checked){soundEffect.play('gameOver')}});
	document.getElementsByName('scroll-adjustment')[0].addEventListener('change',scroll_change)


	document.getElementById("initial-time-diff-reset").addEventListener('click', function (){
		initialTimeDiff = 0
		document.getElementsByName('initial-time-diff')[0].textContent = initialTimeDiff.toFixed(2);
		putOptionSaveData('initial-time-diff' , initialTimeDiff.toFixed(2))
	});


	document.getElementById("initial-time-diff-minus").addEventListener('click', function (){
		initialTimeDiff = Number(document.getElementsByName('initial-time-diff')[0].textContent)

		if(initialTimeDiff > -4){
			initialTimeDiff = !event.shiftKey ? Number((initialTimeDiff-0.01).toFixed(2)) : Number((initialTimeDiff-0.1).toFixed(2))
		}
		if(initialTimeDiff <= -4){
			initialTimeDiff = -4
		}

		const initialTimeDiffToFixed2 = initialTimeDiff.toFixed(2)
		document.getElementsByName('initial-time-diff')[0].textContent = initialTimeDiffToFixed2;
		document.getElementById("time_diff").textContent = initialTimeDiffToFixed2;

		putOptionSaveData('initial-time-diff' , initialTimeDiffToFixed2)
		player.difftime = Number(initialTimeDiffToFixed2)
	});

	document.getElementById("initial-time-diff-plus").addEventListener('click', function (){
		initialTimeDiff = Number(document.getElementsByName('initial-time-diff')[0].textContent)

		if(initialTimeDiff < 4){
			initialTimeDiff = !event.shiftKey ? Number((initialTimeDiff+0.01).toFixed(2)) : Number((initialTimeDiff+0.1).toFixed(2))
		}
		if(initialTimeDiff >= 4){
			initialTimeDiff = 4
		}

		const initialTimeDiffToFixed2 = initialTimeDiff.toFixed(2);
		document.getElementsByName('initial-time-diff')[0].textContent = initialTimeDiffToFixed2;
		document.getElementById("time_diff").textContent = initialTimeDiffToFixed2;
		putOptionSaveData('initial-time-diff' , initialTimeDiffToFixed2)
		player.difftime = initialTimeDiff

	});

	document.getElementById("kana-scroll-length-minus").addEventListener('click', function (){
		scroll_kana = Number(document.getElementsByName('kana-scroll-length')[0].textContent)

		if(scroll_kana > 0){
			scroll_kana = Number((scroll_kana-1).toFixed())
		}

		document.getElementsByName('kana-scroll-length')[0].textContent = scroll_kana
		OPTION_ACCESS_OBJECT['kana-scroll-length'] = scroll_kana
		putOptionSaveData('kana-scroll-length' , scroll_kana)
	});
	document.getElementById("kana-scroll-length-plus").addEventListener('click', function (){
		scroll_kana = Number(document.getElementsByName('kana-scroll-length')[0].textContent)

		if(scroll_kana < 30){
			scroll_kana = Number((scroll_kana+1).toFixed())
		}
		if(scroll_kana > 30){
			scroll_kana = 30
		}

		document.getElementsByName('kana-scroll-length')[0].textContent = scroll_kana
		OPTION_ACCESS_OBJECT['kana-scroll-length'] = scroll_kana
		putOptionSaveData('kana-scroll-length' , scroll_kana)
	});
	document.getElementsByName('kana-scroll-length')[0].addEventListener('focusout', function (event){
		scroll_kana = +Number(event.target.textContent).toFixed()
		if(isNaN(scroll_kana)){
			scroll_kana = KANA_SCROLL_LENGTH_DEFAULT
		}
		if(scroll_kana > 30){
			scroll_kana = 30
		}
		if(scroll_kana < 0){
			scroll_kana = 0
		}

		document.getElementsByName('kana-scroll-length')[0].textContent = scroll_kana
		OPTION_ACCESS_OBJECT['kana-scroll-length'] = scroll_kana
		putOptionSaveData('kana-scroll-length' , scroll_kana)
	});
	document.getElementById("roma-scroll-length-minus").addEventListener('click', function (){
		scroll_roma = Number(document.getElementsByName('roma-scroll-length')[0].textContent)

		if(scroll_roma > 0){
			scroll_roma = Number((scroll_roma-1).toFixed())
		}

		document.getElementsByName('roma-scroll-length')[0].textContent = scroll_roma
		OPTION_ACCESS_OBJECT['roma-scroll-length'] = scroll_roma
		putOptionSaveData('roma-scroll-length' , scroll_roma)
	});
	document.getElementById("roma-scroll-length-plus").addEventListener('click', function (){
		scroll_roma = Number(document.getElementsByName('roma-scroll-length')[0].textContent)

		if(scroll_roma < 30){
			scroll_roma = Number((scroll_roma+1).toFixed())
		}
		if(scroll_roma > 30){
			scroll_roma = 30
		}

		document.getElementsByName('roma-scroll-length')[0].textContent = scroll_roma
		OPTION_ACCESS_OBJECT['roma-scroll-length'] = scroll_roma
		putOptionSaveData('roma-scroll-length' , scroll_roma)
	});
	document.getElementsByName('roma-scroll-length')[0].addEventListener('focusout', function (event){
		scroll_roma = +Number(event.target.textContent).toFixed()
		if(isNaN(scroll_roma)){
			scroll_roma = ROMA_SCROLL_LENGTH_DEFAULT
		}
		if(scroll_roma > 30){
			scroll_roma = 30
		}
		if(scroll_roma < 0){
			scroll_roma = 0
		}

		document.getElementsByName('roma-scroll-length')[0].textContent = scroll_roma
		OPTION_ACCESS_OBJECT['roma-scroll-length'] = scroll_roma
		putOptionSaveData('roma-scroll-length' , scroll_roma)
	});
	document.getElementById("character-scroll-length-reset").addEventListener('click', function (event){
		document.getElementsByName('kana-scroll-length')[0].textContent = (!PHONE_FLAG?10:5)
		OPTION_ACCESS_OBJECT['kana-scroll-length'] = (!PHONE_FLAG?10:5)
		putOptionSaveData('kana-scroll-length' , (!PHONE_FLAG?10:5))
		document.getElementsByName('roma-scroll-length')[0].textContent = (!PHONE_FLAG?16:8)
		OPTION_ACCESS_OBJECT['roma-scroll-length'] = (!PHONE_FLAG?16:8)
		putOptionSaveData('roma-scroll-length' , (!PHONE_FLAG?16:8))
	});


	document.getElementById("kana-font-size-plus").addEventListener('click', function (){
		font_kana = +document.getElementsByName('kana-font-size-px')[0].textContent

		if(font_kana < 25){
			font_kana = Number((font_kana+0.5).toFixed(1))
		}
		if(font_kana > 25){
			font_kana = 25
		}
		if(font_kana == 0.5){
			font_kana = 10
		}

		document.getElementsByName('kana-font-size-px')[0].textContent = font_kana.toFixed(1)
		putOptionSaveData('kana-font-size-px' , font_kana.toFixed(1))
		set_status_setting()
	});

	document.getElementById("kana-font-size-minus").addEventListener('click', function (){
		font_kana = +document.getElementsByName('kana-font-size-px')[0].textContent
		if(font_kana > 0){
			font_kana = Number((font_kana-0.5).toFixed(1))
		}
		if(font_kana < 10){
			font_kana = 0
		}

		document.getElementsByName('kana-font-size-px')[0].textContent = font_kana.toFixed(1)
		putOptionSaveData('kana-font-size-px' , font_kana.toFixed(1))
		set_status_setting()
	});
	document.getElementsByName('kana-font-size-px')[0].addEventListener('focusout', function (event){
		font_kana = +Number(event.target.textContent).toFixed(1)
		if(isNaN(font_kana)){
			font_kana = FONT_SIZE_KANA_DEFAULT
		}
		if(font_kana > 25){
			font_kana = 25
		}
		if(font_kana < 10 && font_kana != 0){
			font_kana = 10
		}

		document.getElementsByName('kana-font-size-px')[0].textContent = font_kana.toFixed(1)
		putOptionSaveData('kana-font-size-px' , font_kana.toFixed(1))
		set_status_setting()
	});

	document.getElementById("roma-font-size-plus").addEventListener('click', function (){
		font_roma = +document.getElementsByName('roma-font-size-px')[0].textContent

		if(font_roma < 25){
			font_roma = Number((font_roma+0.5).toFixed(1))
		}
		if(font_roma > 25){
			font_roma = 25
		}
		if(font_roma == 0.5){
			font_roma = 10
		}
		document.getElementsByName('roma-font-size-px')[0].textContent = font_roma.toFixed(1)
		putOptionSaveData('roma-font-size-px' , font_roma.toFixed(1))
		set_status_setting()
	});

	document.getElementById("roma-font-size-minus").addEventListener('click', function (){
		font_roma = +document.getElementsByName('roma-font-size-px')[0].textContent
		if(font_roma > 0){
			font_roma = Number((font_roma-0.5).toFixed(1))
		}
		if(font_roma < 10){
			font_roma = 0
		}

		document.getElementsByName('roma-font-size-px')[0].textContent = font_roma.toFixed(1)
		putOptionSaveData('roma-font-size-px' , font_roma.toFixed(1))
		set_status_setting()
	});
	document.getElementsByName('roma-font-size-px')[0].addEventListener('focusout', function (event){
		font_roma = +Number(event.target.textContent)
		if(isNaN(font_roma)){
			font_roma = FONT_SIZE_ROMA_DEFAULT
		}
		if(font_roma > 25){
			font_roma = 25
		}
		if(font_roma < 10 && font_roma != 0){
			font_roma = 10
		}

		document.getElementsByName('roma-font-size-px')[0].textContent = font_roma.toFixed(1)
		putOptionSaveData('roma-font-size-px' , font_roma.toFixed(1))
		set_status_setting()
	});

	//文字の間隔設定
	document.getElementById("kana-font-spacing-plus").addEventListener('click', function (){
		spacing_kana = +document.getElementsByName('kana-font-spacing-px')[0].textContent

		if(spacing_kana < 3){
			spacing_kana = Number((spacing_kana+0.1).toFixed(1))
		}
		if(spacing_kana > 3){
			spacing_kana = 3
		}
		if(spacing_kana <= 0){
			spacing_kana = 0
		}

		document.getElementsByName('kana-font-spacing-px')[0].textContent = spacing_kana.toFixed(1)
		putOptionSaveData('kana-font-spacing-px' , spacing_kana.toFixed(1))
		set_status_setting()
	});

	document.getElementById("kana-font-spacing-minus").addEventListener('click', function (){
		spacing_kana = +document.getElementsByName('kana-font-spacing-px')[0].textContent
		if(spacing_kana > 0){
			spacing_kana = Number((spacing_kana-0.1).toFixed(1))
		}
		if(spacing_kana <= 0){
			spacing_kana = 0
		}

		document.getElementsByName('kana-font-spacing-px')[0].textContent = spacing_kana.toFixed(1)
		putOptionSaveData('kana-font-spacing-px' , spacing_kana.toFixed(1))
		set_status_setting()
	});
	document.getElementsByName('kana-font-spacing-px')[0].addEventListener('focusout', function (event){
		spacing_kana = +Number(event.target.textContent).toFixed(1)
		if(isNaN(spacing_kana)){
			spacing_kana = SPASING_KANA_DEFAULT
		}
		if(spacing_kana > 3){
			spacing_kana = 3
		}
		if(spacing_kana <= 0 ){
			spacing_kana = 0
		}

		document.getElementsByName('kana-font-spacing-px')[0].textContent = spacing_kana.toFixed(1)
		putOptionSaveData('kana-font-spacing-px' , spacing_kana.toFixed(1))
		set_status_setting()
	});

	document.getElementById("roma-font-spacing-plus").addEventListener('click', function (){
		spacing_roma = +document.getElementsByName('roma-font-spacing-px')[0].textContent

		if(spacing_roma < 3){
			spacing_roma = Number((spacing_roma+0.1).toFixed(1))
		}
		if(spacing_roma > 3){
			spacing_roma = 3
		}
		if(spacing_roma <= 0 ){
			spacing_roma = 0
		}
		document.getElementsByName('roma-font-spacing-px')[0].textContent = spacing_roma.toFixed(1)
		putOptionSaveData('roma-font-spacing-px' , spacing_roma.toFixed(1))
		set_status_setting()
	});

	document.getElementById("roma-font-spacing-minus").addEventListener('click', function (){
		spacing_roma = +document.getElementsByName('roma-font-spacing-px')[0].textContent
		if(spacing_roma > 0){
			spacing_roma = Number((spacing_roma-0.1).toFixed(1))
		}
		if(spacing_roma <= 0){
			spacing_roma = 0
		}

		document.getElementsByName('roma-font-spacing-px')[0].textContent = spacing_roma.toFixed(1)
		putOptionSaveData('roma-font-spacing-px' , spacing_roma.toFixed(1))
		set_status_setting()
	});
	document.getElementsByName('roma-font-spacing-px')[0].addEventListener('focusout', function (event){
		spacing_roma = +Number(event.target.textContent)
		if(isNaN(spacing_roma)){
			spacing_roma = SPASING_ROMA_DEFAULT
		}
		if(spacing_roma > 3){
			spacing_roma = 3
		}
		if(spacing_roma <= 0){
			spacing_roma = 0
		}

		document.getElementsByName('roma-font-spacing-px')[0].textContent = spacing_roma.toFixed(1)
		putOptionSaveData('roma-font-spacing-px' , spacing_roma.toFixed(1))
		set_status_setting()
	});


	document.getElementById("font-shadow-plus").addEventListener('click', function (){
		font_shadow = +document.getElementsByName('font-shadow-px')[0].textContent

		if(font_shadow < 3){
			font_shadow = Number((font_shadow+0.1).toFixed(1))
		}
		if(font_shadow > 3){
			font_shadow = 3
		}
		if(font_shadow <= 0 ){
			font_shadow = 0
		}
		document.getElementsByName('font-shadow-px')[0].textContent = font_shadow.toFixed(1)
		putOptionSaveData('font-shadow-px' , font_shadow.toFixed(1))
		set_status_setting()
	});

	document.getElementById("font-shadow-minus").addEventListener('click', function (){
		font_shadow = +document.getElementsByName('font-shadow-px')[0].textContent
		if(font_shadow > 0){
			font_shadow = Number((font_shadow-0.1).toFixed(1))
		}
		if(font_shadow <= 0){
			font_shadow = 0
		}

		document.getElementsByName('font-shadow-px')[0].textContent = font_shadow.toFixed(1)
		putOptionSaveData('font-shadow-px' , font_shadow.toFixed(1))
		set_status_setting()
	});
	document.getElementsByName('font-shadow-px')[0].addEventListener('focusout', function (event){
		font_shadow = +Number(event.target.textContent)
		if(isNaN(font_shadow)){
			font_shadow = FONT_SHADOW_DEFAULT
		}
		if(font_shadow > 3){
			font_shadow = 3
		}
		if(font_shadow <= 0){
			font_shadow = 0
		}

		document.getElementsByName('roma-font-spacing-px')[0].textContent = font_shadow.toFixed(1)
		putOptionSaveData('roma-font-spacing-px' , font_shadow.toFixed(1))
		set_status_setting()
	});
	document.getElementById("font-size-reset").addEventListener('click', function (){
		document.getElementsByName('kana-font-size-px')[0].textContent = FONT_SIZE_KANA_DEFAULT.toFixed(1)
		putOptionSaveData('kana-font-size-px' , FONT_SIZE_KANA_DEFAULT)
		document.getElementsByName('roma-font-size-px')[0].textContent = FONT_SIZE_ROMA_DEFAULT.toFixed(1)
		putOptionSaveData('roma-font-size-px' , FONT_SIZE_ROMA_DEFAULT)
		document.getElementsByName('kana-font-spacing-px')[0].textContent = SPASING_KANA_DEFAULT.toFixed(1)
		putOptionSaveData('kana-font-spacing-px' , SPASING_KANA_DEFAULT)
		document.getElementsByName('roma-font-spacing-px')[0].textContent = SPASING_ROMA_DEFAULT.toFixed(1)
		putOptionSaveData('roma-font-spacing-px' , SPASING_ROMA_DEFAULT)
		document.getElementsByName('font-shadow-px')[0].textContent = FONT_SHADOW_DEFAULT.toFixed(1)
		putOptionSaveData('font-shadow-px' , FONT_SHADOW_DEFAULT)
		set_status_setting()
	});
}

function color_default(){
	document.getElementsByName('next-character-color')[0].value = "#FFFFFF"

	document.getElementsByName('next-character-color')[0].style.backgroundColor="rgb(255, 255, 255)"
	document.getElementsByName('next-character-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('word-color')[0].style.backgroundColor="rgb(255, 255, 255)"
	document.getElementsByName('word-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('correct-word-color')[0].value = "#0099CC"
	document.getElementsByName('correct-word-color')[0].style.backgroundColor="rgb(0, 153, 204)"
	document.getElementsByName('correct-word-color')[0].style.color="rgb(255, 255, 255)"

	document.getElementsByName('line-clear-color')[0].value = "#1eff52"
	document.getElementsByName('line-clear-color')[0].style.backgroundColor="rgb(30, 255, 82)"
	document.getElementsByName('line-clear-color')[0].style.color="rgb(255, 255, 255)"

	saveModOption()

}

function letter_red(){
	document.getElementsByName('next-character-color')[0].value = "#FF0000"
	document.getElementsByName('next-character-color')[0].style.backgroundColor="rgb(255, 0, 0)"
	document.getElementsByName('next-character-color')[0].style.color="rgb(255, 255, 255)"

	document.getElementsByName('word-color')[0].value = "#FFFFFF"
	document.getElementsByName('word-color')[0].style.backgroundColor="rgb(255, 255, 255)"
	document.getElementsByName('word-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('correct-word-color')[0].value = "#919395"
	document.getElementsByName('correct-word-color')[0].style.backgroundColor="rgb(145, 147, 149)"
	document.getElementsByName('correct-word-color')[0].style.color="rgb(255, 255, 255)"

	document.getElementsByName('line-clear-color')[0].value = "#919395"
	document.getElementsByName('line-clear-color')[0].style.backgroundColor="rgb(145, 147, 149)"
	document.getElementsByName('line-clear-color')[0].style.color="rgb(255, 255, 255)"

	saveModOption()

}

function letter_input_style(){
	document.getElementsByName('next-character-color')[0].value = "#777777"
	document.getElementsByName('next-character-color')[0].style.backgroundColor="rgb(119, 119, 119)"
	document.getElementsByName('next-character-color')[0].style.color="rgb(255, 255, 255)"

	document.getElementsByName('word-color')[0].value = "#777777"
	document.getElementsByName('word-color')[0].style.backgroundColor="rgb(119, 119, 119)"
	document.getElementsByName('word-color')[0].style.color="rgb(255, 255, 255)"

	document.getElementsByName('correct-word-color')[0].value = "#FFFFFF"
	document.getElementsByName('correct-word-color')[0].style.backgroundColor="rgb(255, 255, 255)"
	document.getElementsByName('correct-word-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('line-clear-color')[0].value = "#1eff52"
	document.getElementsByName('line-clear-color')[0].style.backgroundColor="rgb(30, 255, 82)"
	document.getElementsByName('line-clear-color')[0].style.color="rgb(255, 255, 255)"

	saveModOption()

}

function transparent_style(){
	document.getElementsByName('next-character-color')[0].value = "#FFFFFF"
	document.getElementsByName('next-character-color')[0].style.backgroundColor="rgb(255, 255, 255)"
	document.getElementsByName('next-character-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('word-color')[0].value = "#FFFFFF"
	document.getElementsByName('word-color')[0].style.backgroundColor="rgb(255, 255, 255)"
	document.getElementsByName('word-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('correct-word-color')[0].value = "transparent"
	document.getElementsByName('correct-word-color')[0].style.backgroundColor="rgb(0, 0, 0)"
	document.getElementsByName('correct-word-color')[0].style.color="rgb(0, 0, 0)"

	document.getElementsByName('line-clear-color')[0].value = "transparent"
	document.getElementsByName('line-clear-color')[0].style.backgroundColor="rgb(0, 0, 0)"
	document.getElementsByName('line-clear-color')[0].style.color="rgb(0, 0, 0)"

	saveModOption()

}



var line_color_styles_html = document.createElement('style');
line_color_styles_html.setAttribute("id", "line_color_styles");
var status_setting_html = document.createElement('style');
status_setting_html.setAttribute("id", "status_setting");


let db;
let indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
let OptionDatabaseObject = {}
const STORE_NAME = "TypingTubeModDb";

(function accessIndexedDB(){
	const OPEN_REQUEST = indexedDB.open(STORE_NAME, 1.0);

	//データベースストア新規作成。(初回アクセス時)
	OPEN_REQUEST.onupgradeneeded = function(event) {
		// データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
		db = event.target.result;
		const CREATE_STORE = db.createObjectStore(STORE_NAME, { keyPath: "OptionName"});
	}

	//データベースストアアクセス成功時。
	OPEN_REQUEST.onsuccess = function(event) {
		db = event.target.result;
		getAllIndexedDbData(loadIndexedDbData)
	}
})();

function getAllIndexedDbData (callback){

	const TRANSACTION = db.transaction([STORE_NAME], "readwrite");
	const STORE = TRANSACTION.objectStore(STORE_NAME);

	//すべてのキーを取得
	const REQUEST = STORE.getAll();
	REQUEST.onsuccess = function (event) {
		if (event.target.result === undefined) {
			// キーが存在しない場合の処理
		} else {
			// 取得成功
			OptionDatabaseObject = event.target.result
			if(callback()){
				callback()
			}
		}
	}
}


function loadIndexedDbData(){


	for (let i=0; i<OptionDatabaseObject.length; i++){

		const SAVE_DATA_VALUE = OptionDatabaseObject[i].Data
		const MOD_CONFIG_ELEMENT = play_mode == 'normal' ? document.getElementsByName(OptionDatabaseObject[i].OptionName) : document.querySelectorAll(`#practice-setting [name='${OptionDatabaseObject[i].OptionName}']`)
		if(MOD_CONFIG_ELEMENT[0] === null || MOD_CONFIG_ELEMENT[0] === undefined){
			continue;
		}

		if( MOD_CONFIG_ELEMENT[0].tagName === 'SELECT' ){
			MOD_CONFIG_ELEMENT[0].options[ SAVE_DATA_VALUE ].selected = true
		}else if(MOD_CONFIG_ELEMENT[0].tagName === 'SPAN'){
			MOD_CONFIG_ELEMENT[0].textContent = SAVE_DATA_VALUE;
		}else if( MOD_CONFIG_ELEMENT[0].type === 'checkbox' ){
			MOD_CONFIG_ELEMENT[0].checked = SAVE_DATA_VALUE;
		}else if( MOD_CONFIG_ELEMENT[0].type === 'radio' ){
			MOD_CONFIG_ELEMENT[SAVE_DATA_VALUE].checked = true;
		}else{
			MOD_CONFIG_ELEMENT[0].value = SAVE_DATA_VALUE;
		}

		if(OptionDatabaseObject[i].OptionName === 'miss-sound-effect' && SAVE_DATA_VALUE === true){
			document.getElementById("miss-sound-effect-beginning-line").style.display = "";
		}
		if(OptionDatabaseObject[i].OptionName === 'initial-time-diff'){
			initialTimeDiff = +SAVE_DATA_VALUE
			document.getElementById("time_diff").textContent = SAVE_DATA_VALUE
		}
		if(play_mode == 'practice'){
			OPTION_ACCESS_OBJECT[OptionDatabaseObject[i].OptionName] = document.getElementsByName(OptionDatabaseObject[i].OptionName)[0].checked
		}
	}






	//CSS設定を反映
	CONTROLBOX_SELECTOR.style.backgroundColor = document.getElementsByName('playarea-color')[0].value;
	CONTROLBOX_SELECTOR.style.paddingBottom = "6px";



	document.head.appendChild(line_color_styles_html);
	document.head.appendChild(status_setting_html);
	updateProgressStyleTag()



	//入力モード設定をlocalStorageに保存するイベントリスナーを追加
	document.getElementsByName('mode_select')[0].addEventListener('change', saveModOption);
	document.getElementsByName('mode_select')[1].addEventListener('change', saveModOption);
	document.getElementsByName('mode_select')[2].addEventListener('change', saveModOption);
	document.getElementsByName('mode_select')[3].addEventListener('change', saveModOption);

	//タイピングエリアのstatus rankingの部分にアンダーラインを追加するイベントリスナー
	rankingTabsUnderlineEvent()

	inputModeManager = new InputModeManager();
	inputModeManager.updateMode()
};


/**
 * 	タイピングエリアのstatus rankingの部分にアンダーラインを追加するイベントリスナー
 */
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


function updateProgressStyleTag(){

	if(window.navigator.userAgent.indexOf('Firefox') != -1) {
		line_color_styles_html.innerHTML=`#bar_input_base::-moz-progress-bar {
    background-color:${document.getElementsByName('phrase-line-color')[0].value}!important;
}
#bar_input_base {
    background-color:${document.getElementsByName('empty-color')[0].value}!important;
}
#bar_base::-moz-progress-bar {
    background-color:${document.getElementsByName('movie-line-color')[0].value}!important;
}
#bar_base {
    background-color:${document.getElementsByName('empty-color')[0].value}!important;
}


.combo-counter-effect-color {
    color:#FFF;
}`;
	}else{
		line_color_styles_html.innerHTML=`#bar_input_base::-webkit-progress-value{
    background-color:${document.getElementsByName('phrase-line-color')[0].value}!important;
}
#bar_input_base[value]::-webkit-progress-bar {
    background-color:${document.getElementsByName('empty-color')[0].value}!important;
}

#bar_base::-webkit-progress-value {
    background-color:${document.getElementsByName('movie-line-color')[0].value}!important;
}
#bar_base[value]::-webkit-progress-bar{
    background-color:${document.getElementsByName('empty-color')[0].value}!important;
}


.combo-counter-effect-color {
    color:#FFF;
   }`;

	}
}




function create_flick_textbox(){
	if(keyboard == "mac"){
		flick_form.setAttribute("style", "opacity:0;position:absolute;transform: scale(0);top:120px;font-size:16px;");
		flick_form_second.setAttribute("style", "opacity:0;position:absolute;transform: scale(0);z-index:-1;top:120px;font-size:16px;");
		document.getElementById("kashi").parentNode.insertBefore(flick_form, document.getElementById("kashi"));
		document.getElementById("kashi").parentNode.insertBefore(flick_form_second, document.getElementById("kashi"));
		document.getElementById("kashi_area").addEventListener("click",play_focus,true)
		starting_kashi_area()
		SELECTOR_ACCESS_OBJECT['flick-input'] = document.getElementById("flick-input")
		SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener("focusout",flick_blur_notification)
		SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener("focus",flick_focus)
		SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener("change",settimeout_delete_flick_form)
		SELECTOR_ACCESS_OBJECT['flick-input-second'] = document.getElementById("flick-input-second")
		SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener("focusout",flick_blur_notification)
		SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener("focus",flick_focus)
		SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener("change",settimeout_delete_flick_form)
		window.addEventListener("keydown",key_device_disabled)
		document.getElementById("kashi_area").insertAdjacentHTML('afterbegin', `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
id="tap_here" x="0px" y="0px" width="300px" height="300px" viewBox="0 0 400 500" style="z-index:-1;margin:auto;left:0;right:0;display:none;enable-background:new 0 0 455 455;position: absolute;top: -10%;" xml:space="preserve">
<style type="text/css">
	.st0{opacity:0.15;}
	.st1{opacity:0.15;stroke:#000000;stroke-width:10;stroke-miterlimit:10;}

.text {
  animation: bounce 1s linear infinite;
}

@keyframes bounce {
  10% {
    transform: translateY(-10px)
  }
  70% {
    transform: translateY(0)
  }
}
</style>
<circle class="st0" cx="200" cy="230" r="100"></circle>
<circle class="st1" cx="200" cy="230" r="105">
        <animate attributeName="r" from="105" to="130" begin="0s" dur="1s" repeatCount="indefinite"></animate>
        <animate attributeName="opacity" from="0.15" to="0" dur="1s" begin="0s" repeatCount="indefinite" fill="freeze" id="circ-anim"></animate>
</circle>
</svg>`)
	}
	play_focus()
	player.playVideo()
}

//MOD設定でプレイ前に必要な分を適用

let inputModeManager
class InputModeManager {

	constructor(){
		this.kanaMode = false
	}


	updateMode(){

		if(!is_played && play_mode == "normal"){

			if(document.querySelector("[value=kana_type]").checked){
				this.kanaMode = false
				mode='kana'
				typing_play_mode = 'roma'
				document.getElementById("kana-sub-display").style.display = "none"
				document.getElementById("roma-sub-display").style.display = "inline"
				document.getElementById("kana-main-font-size").style.display = "inline"
				document.getElementById("roma-sub-font-size").style.display = "inline"
				document.getElementById("roma-main-font-size").style.display = "none"
				document.getElementById("kana-sub-font-size").style.display = "none"
				kanaModeConfig.style.display = "none"
				romaModeConfig.style.display = "block"
				document.getElementById("practice-mode-button").removeEventListener("click",create_flick_textbox);
			}else if(document.querySelector("[value=roma_type]").checked){
				this.kanaMode = false
				mode='roma'
				typing_play_mode = 'roma'
				document.getElementById("roma-sub-display").style.display = "none"
				document.getElementById("kana-sub-display").style.display = "inline"
				document.getElementById("roma-main-font-size").style.display = "inline"
				document.getElementById("kana-sub-font-size").style.display = "inline"
				document.getElementById("kana-main-font-size").style.display = "none"
				document.getElementById("roma-sub-font-size").style.display = "none"
				kanaModeConfig.style.display = "none"
				romaModeConfig.style.display = "block"
				document.getElementById("practice-mode-button").removeEventListener("click",create_flick_textbox);
			}else if(document.querySelector("[value=kanamode_type]").checked){
				this.kanaMode = true
				mode='kana'
				typing_play_mode = 'kana'
				kanaModeConfig.style.display = "block"
				romaModeConfig.style.display = "none"
				document.getElementById("kana-main-font-size").style.display = "inline"
				document.getElementById("roma-sub-font-size").style.display = "inline"
				document.getElementById("roma-main-font-size").style.display = "none"
				document.getElementById("kana-sub-font-size").style.display = "none"
				document.getElementById("practice-mode-button").removeEventListener("click",create_flick_textbox);
			}else if(document.querySelector("[value=kanamode_mac_type]").checked){
				this.kanaMode = true
				mode='kana'
				typing_play_mode = 'flick'
				kanaModeConfig.style.display = "block"
				romaModeConfig.style.display = "none"
				document.getElementById("kana-main-font-size").style.display = "inline"
				document.getElementById("roma-sub-font-size").style.display = "inline"
				document.getElementById("roma-main-font-size").style.display = "none"
				document.getElementById("kana-sub-font-size").style.display = "none"
				document.getElementById("practice-mode-button").addEventListener("click",create_flick_textbox);
			}

		}

	}



}





//MODメニューを開いた時、プレイ開始時に必要な文を適用
function checkbox_effect_mod_open_play(){
	document.getElementById("character-scroll-config").style.display = document.getElementsByName('character-scroll')[0].checked ? "flex" : "none";
	document.getElementById("change-mode-config").style.display = document.getElementsByName('disable-change-mode')[0].checked ? "none" : "flex";
	document.getElementById("character-scroll-length-reset").style.display = document.getElementsByName('character-scroll')[0].checked ? "inline" : "none";
	document.getElementById("adjust-config").style.display = document.getElementsByName('play-scroll')[0].checked ? "flex" : "none";


	if(document.getElementsByName('space-symbol-omit')[0].checked){
		document.getElementById("space-trace").style.display = "inline";
	}
	if(document.getElementsByName('miss-limit-mode')[0].checked){
		document.getElementById("miss-limit-mode-config").style.display = "flex";
	}else{
		document.getElementById("miss-limit-mode-config").style.display = "none";
	}
}





const SoundURL = {
	'keyType':'https://d2kibbevux4y1g.cloudfront.net/sounds/key_type.mp3',
	'missType':'https://d2kibbevux4y1g.cloudfront.net/sounds/miss_type.mp3',
	'clearType':'https://d2kibbevux4y1g.cloudfront.net/sounds/clear_type.mp3',
	'comboBreak':'https://d2kibbevux4y1g.cloudfront.net/sounds/combo_break.mp3',
	'gameOver':'https://d2kibbevux4y1g.cloudfront.net/sounds/gameover.mp3'
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

class SoundEffect {

	constructor(){
		this.keyType = new AudioContext();
		this.missType = new AudioContext();
		this.clearType = new AudioContext();
		this.comboBreak = new AudioContext();
		this.gameOver = new AudioContext();
		this.audioBuffer = {}

		const SE = Object.keys(SoundURL)

 		for(let i=0;i<SE.length;i++){
			this.loadSoundEffect(SE[i])
		}

	}

	loadSoundEffect(soundName){
		fetch(SoundURL[soundName]).then(function(response) {
			return response.arrayBuffer();
		}).then(function(arrayBuffer) {
			soundEffect[soundName].decodeAudioData(arrayBuffer, function(buffer) {
				soundEffect.audioBuffer[soundName] = buffer;
			});
		})
	}

	play(soundName,mute){
		let playGain = this[soundName].createGain();
		let playSrc = this[soundName].createBufferSource();

		playSrc.buffer = this.audioBuffer[soundName];
		playSrc.connect(playGain);
		playGain.connect(this[soundName].destination);
		if(!mute){
			playGain.gain.value = volume/100
		}else{
			playGain.gain.value = 0
		}
		playSrc.start(0,0.0005);
	}


}
let soundEffect






/*
*@ページを開いたときのMOD追加機能処理 ここから---
**/
/////////////////////////////////////////////////////////////////////////////////////////////////









/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@ページ読み込み時のタイピングワード生成処理 ここから---
*/

function press_start(){
	if(!RTC_Switch){

		if(event.key=="F7"){
			if(!is_played){
				play_mode = "practice"
				player.playVideo()
			}
			event.preventDefault();
		}

		//Enterキーでプレイ開始
		if((document.activeElement.tagName != "INPUT" || document.activeElement.type == "radio") && (event.key=="Enter" || event.key=="F4" )){
			if(!is_played){
				document.activeElement.blur();
				player.playVideo()
			}
			event.preventDefault();
		}

	}
}

function enter_ranking_entry(){
	if((document.activeElement.tagName != "INPUT" || document.activeElement.type == "radio") && event.key == "Enter"){
		if(finished && play_mode=="normal" && document.querySelector('[onclick="submit_score()"]') != null){//曲終了、Enterキーで記録送信
			submit_score()
		}
	}
}

function mobile_sound_enables(){
	soundEffect.play('gameOver','mute')
	soundEffect.play('comboBreak','mute')
	soundEffect.play('clearType','mute')
	soundEffect.play('missType','mute')
	soundEffect.play('keyType','mute')
}


const ranking_length = document.querySelectorAll(".player_ranking") //ランキングの人数
let ranking_array = []; //ランキングのスコア
let volume = 70;

//YouTubeプレイヤーの準備が完了した時に処理
onPlayerReady = function (event) {

	if(localStorage.getItem('volume_storage') == null){
		localStorage.setItem('volume_storage',volume)
	}

	volume = Number(localStorage.getItem('volume_storage'))

	if(isNaN(volume)){
		volume = 70
		localStorage.setItem('volume_storage',volume)
	}
	if(RTC_Switch){
		//動画読み込み後にFirebaseにログイン → ClockWriteTimeStamp
		RoginAnon();
	}

	document.getElementById("volume").textContent = volume;
	document.getElementById("volume_control").value = volume
	document.getElementById("volume_control").addEventListener("input",function(event){
		volume = event.target.value
		player.setVolume(volume);
		document.getElementById("volume").textContent = volume;
		localStorage.setItem('volume_storage', volume);
		play_focus()
	})

	if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android.*Mobile)/i)){
		document.getElementById("volume_control_area").style.visibility = "hidden"
	}
	soundEffect = new SoundEffect()


	player.difftime = initialTimeDiff
	document.getElementById("time_adjust_minus").addEventListener("click",function time_adjust_minus(){
		player.difftime -= 0.1
		player.difftime = Math.round(player.difftime* 100)/100
		document.getElementById("time_diff").textContent = player.difftime.toFixed(2);
		play_focus()
	})
	document.getElementById("time_adjust_plus").addEventListener("click",function time_adjust_plus(){
		player.difftime += 0.1
		player.difftime = Math.round(player.difftime* 100)/100
		document.getElementById("time_diff").textContent = player.difftime.toFixed(2);
		play_focus()
	})

	player.setVolume(volume);
	completeIme();
}


var change_bar_base = document.createElement("progress");
var changebar_input_base = document.createElement("progress");

function replaceProgressBar(){


	change_bar_base.setAttribute("value", 0);
	change_bar_base.setAttribute("id", "bar_base");
	change_bar_base.setAttribute("class", "progress");
	document.getElementById("bar_base").parentNode.replaceChild(change_bar_base,document.getElementById("bar_base"));
	SELECTOR_ACCESS_OBJECT['bar_base'] = document.getElementById("bar_base")


	changebar_input_base.setAttribute("value", 0);
	changebar_input_base.setAttribute("id", "bar_input_base");
	changebar_input_base.setAttribute("class", "progress");
	document.getElementById("bar_input_base").parentNode.replaceChild(changebar_input_base,document.getElementById("bar_input_base"));
	SELECTOR_ACCESS_OBJECT['bar_input_base'] = document.getElementById("bar_input_base")

}



parseRomaMap = function (){
	return new requestLyricInfo().romaMap
}


const speedList = [0.25,0.5,0.75,1.00,1.25,1.5,1.75,2]
const zenkaku_list = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９", "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", "～", "＆", "％", "！", "？", "＠", "＃", "＄", "（", "）", "｜", "｛", "｝", "｀", "＊", "＋", "：", "；", "＿", "＜", "＞", "＝", "＾"]
const sokuon_join = ["ヰ", "ゐ", "ヱ", "ゑ","ぁ", "ぃ", "ぅ", "ぇ", "ぉ","ゃ","ゅ","ょ","っ", "ゎ", "ヵ", "ヶ", "ゔ", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
const imperfect_sokuon_join = ["い", "う", "ん"]
const imperfect_sokuon_roma_list = ["i","u","n"]
const nn_list = ["あ", "い", "う", "え", "お", "な", "に", "ぬ", "ね", "の", "や", "ゆ", "よ", "ん", "'", "’","a","i","u","e","o","y","n"]
const symbol_disable_list = ["!","?",",","\"","'","^","|","[","]","(",")","`",":",";","<",">","_","~","{","}"," "]
const symbol_disable_romamap_list = [",",".","/","\"","'","[","]","z[","z]"]
const valid_symbol = ["#","$","%","&","\~","=","*","+","@","\\"," "]
const symbol_list = symbol_disable_romamap_list.concat(symbol_disable_list,valid_symbol)

let parseLyric
let lyrics_array
let line_length = 0 //HTML内のコードで使われているので変数を削除できない


lyrics_array = new Array;
class ParseLyric {

	constructor(data){
		document.getElementsByName('space-symbol-omit')[0].checked === true ? this.symbolDisable = true : this.symbolDisable = false;
		document.getElementsByName('margin-space-disable')[0].checked === true ? this.spaceDisable = true : this.spaceDisable = false;


		this.typingArrayKana = []
		this.typingArrayRoma = []
		this.typingArray = []
		this.lyricsArray = []
		this.mapStyle = ''
		this.abridgementWordLength = 0
		this.data = data
		this.symbolCount = {};
		this.scoreParChar = 0
		this.missPenalty = 0
		this.startLine = 0
		this.lineLength = 0
		this.romaTotalNotes = 0
		this.kanaTotalNotes = 0
		this.romaLineNotesList = []
		this.kanaLineNotesList = []
		this.movieTotalTime = 0
		this.videoDuration
		this.movieTimeMM = 0
		this.movieTimeSS = 0
		this.romaMedianSpeed = 0
		this.kanaMedianSpeed = 0
		this.romaMaxSpeed = 0
		this.kanaMaxSpeed = 0
		this.romaLineSpeedList = []
		this.kanaLineSpeedList = []

		this.romaArray = []
		this.kanaArray = []
		this.strArray = []

		movieSpeedController = new MovieSpeedController()
		movieSpeedController.addEvent()

		mapInfoDisplay = new MapInfoDisplay()
	}

	parse(){

		this.abridgementWordLength = 0
		let	lyric = ""
		let a

		const lines = this.data.split("\n");
		const lines_length = lines.length
		const romaMap_length = romaMap.length
		const speed_ = lines[0].split("\t")[0].match(/【\d?\.?\d?\d倍速】/)
		const caseSensitiveMode = lines[0].split("\t")[0].match(/【英語大文字?.*】/)

		if(speed_){
			movieSpeedController.fixedSpeed = parseFloat(speed_[0].slice(1))
			if(!speedList.includes(movieSpeedController.fixedSpeed)){
				movieSpeedController.fixedSpeed = false
			}
		}
		if(caseSensitiveMode){
			document.getElementsByName("case-sensitive-mode")[0].checked = true;
			document.getElementsByName("case-sensitive-mode")[0].disabled = true;
		}

		for (let s=1; s<lines_length; s++){
			a = lines[s].split("\t");

			if(s == 1){
				if(!lyrics_array[0] && +a[0] > 0 ){
					a = ["0", "", ""]
					s--
				}
				this.mapStyle = a[1].match(/<style(?: .+?)?>.*?<\/style>/g)
			}

			if(a.length >= 3){

			}else{
				a.push("")
			}

			lyric += a[2].replace(/[ 　]+$/,"").replace(/^[ 　]+/,"")+"\n"
			lyrics_array.push(a);

			if(a[1] == "end" && !this.movieTotalTime) {
				replaceProgressBar()

				this.getVideoTime(a[0])

				//Enterキーで行うショートカットキー
				window.addEventListener('keydown', press_start,true);
				break;
			}
		};

		lyric = lyric
			.replace(/…/g,"...")
			.replace(/‥/g,"..")
			.replace(/･/g,"・")
			.replace(/〜/g,"～")
			.replace(/｢/g,"「")
			.replace(/｣/g,"」")
			.replace(/､/g,"、")
			.replace(/｡/g,"。")
			.replace(/　/g," ")
			.replace(/ {2,}/g," ")
			.replace(/ヴ/g,"ゔ")
			.replace(/－/g,"ー")
		for (let i=0; i<romaMap_length; i++){
			if(romaMap[i].length > 1){
				lyric = lyric.replace(RegExp(romaMap[i][0],"g"),"\t"+i+"\t");
			}
		};

		lyric = lyric.split("\n")

		for(let m=0;m<lyrics_array.length;m++){
			if(lyric[m] && lyrics_array[m][1] != "end"){
				const arr = this.hiraganaToRomaArray(lyric[m]);
				this.typingArray.push(arr[0]);
				this.typingArrayKana.push(arr[1]);
				this.typingArrayRoma.push(arr[2]);
			} else {
				this.typingArray.push([]);
				this.typingArrayKana.push([]);
				this.typingArrayRoma.push([]);
			}
		}
		return lyrics_array;

	}

	getVideoTime(endTime){
		const DURATION = player.getDuration()

		if(DURATION < +endTime){
			lyrics_array[lyrics_array.length-1][0] = DURATION.toString()
		}

		this.videoDuration = DURATION;
		this.setTotalTIme()
		change_bar_base.setAttribute("max", parseLyric.movieTotalTime);
	}

	setTotalTIme(){
		this.movieTotalTime = lyrics_array[lyrics_array.length-1][0]/movieSpeedController.speed;
		this.movieTimeMM =("00" + parseInt(parseInt(this.movieTotalTime) / 60)).slice(-2)
		this.movieTimeSS = ("00" +(parseInt(this.movieTotalTime) - this.movieTimeMM * 60)).slice(-2)
	}

	createSokuonMap(iunFlag){
		const xtu_times = ( this.kanaArray[this.kanaArray.length-2].match( /っ/g ) || [] ).length

		this.kanaArray[this.kanaArray.length-1] = this.kanaArray[this.kanaArray.length-2] + this.kanaArray[this.kanaArray.length-1]
		this.kanaArray.splice(-2,1)
		const length = this.strArray[this.strArray.length-1].length
		let repeat = []
		let xtu = []
		let ltu = []
		let xtsu = []
		let ltsu = []

		for(let s = 0;s<length;s++){
			if(!iunFlag || !imperfect_sokuon_roma_list.includes(this.strArray[this.strArray.length-1][s][0])){
				repeat.push(this.strArray[this.strArray.length-1][s][0].repeat(xtu_times)+this.strArray[this.strArray.length-1][s])
			}
			xtu.push("x".repeat(xtu_times)+"tu"+this.strArray[this.strArray.length-1][s])
			ltu.push("l".repeat(xtu_times)+"tu"+this.strArray[this.strArray.length-1][s])
			xtsu.push("x".repeat(xtu_times)+"tsu"+this.strArray[this.strArray.length-1][s])
			ltsu.push("l".repeat(xtu_times)+"tsu"+this.strArray[this.strArray.length-1][s])
		}

		this.strArray[this.strArray.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
		this.strArray.splice(-2,1)

		this.romaArray[this.romaArray.length-1] = this.strArray[this.strArray.length-1][0]
		this.romaArray.splice(-2,1)
	}

	nnCheck(){
		//n→nn変換
		const n_kana_check = this.kanaArray[this.kanaArray.length-2]

		if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){

			if(nn_list.includes(this.kanaArray[this.kanaArray.length-1][0])){

				for(let n=0;n<this.strArray[this.strArray.length-2].length;n++){

					const str_pattern = this.strArray[this.strArray.length-2][n]

					if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
						this.strArray[this.strArray.length-2][n] = this.strArray[this.strArray.length-2][n]+"n"
					}

				}

				this.romaArray[this.romaArray.length-2] = this.strArray[this.strArray.length-2][0]

				//それ以外の文字でもnnの入力を可能にする
			}else if(this.kanaArray[this.kanaArray.length-1]){

				const array_length = this.strArray[this.strArray.length-1].length

				for (let i=0; i<array_length; i++){
					this.strArray[this.strArray.length-1].push("n"+this.strArray[this.strArray.length-1][i])
					this.strArray[this.strArray.length-1].push("'"+this.strArray[this.strArray.length-1][i])
				}

			}

		}
	}

	symbolCounter(){
		const symbolEncount = symbol_list.indexOf(this.romaArray[this.romaArray.length-1])
		if(symbolEncount > -1){
			if(this.symbolCount[this.kanaArray[this.kanaArray.length-1]]){
				this.symbolCount[this.kanaArray[this.kanaArray.length-1]]++
			}else{
				this.symbolCount[this.kanaArray[this.kanaArray.length-1]] = 1
			}
		}
	}

	hiraganaToRomaArray(str){

		this.romaArray = []
		this.kanaArray = []
		this.strArray = []

		str = str.split("\t").filter(word => word > "")
		const STR_LENGTH = str.length

		for (let i=0; i<STR_LENGTH; i++){

			if(romaMap[parseInt(str[i])]){
				this.kanaArray.push(romaMap[parseInt(str[i])][0]);
				this.strArray.push(romaMap[parseInt(str[i])].slice(1));
				this.romaArray.push(romaMap[parseInt(str[i])][1]);

				//促音の打鍵パターン
				if(this.kanaArray.length >= 2 && this.kanaArray[this.kanaArray.length-2][this.kanaArray[this.kanaArray.length-2].length-1]=="っ"){

					if(sokuon_join.includes(this.kanaArray[this.kanaArray.length-1][0])){
						this.createSokuonMap()
					}else if(imperfect_sokuon_join.includes(this.kanaArray[this.kanaArray.length-1][0])){
						this.createSokuonMap('iunFlag')
					}

				}

				//記号無効化モードで・記号を削除
				if(this.symbolDisable){
					this.deleteSymbol()
				}


				//n→nn変換
				this.nnCheck()

				//記号の種類をカウント
				this.symbolCounter()

			} else{

				//打鍵パターン生成を行わなくて良い文字はそのままthis.typingArrayに追加
				for (let v=0; v<str[i].length; v++){


					let typing_character = str[i][v]

					if(zenkaku_list.includes(str[i][v])){
						typing_character = String.fromCharCode(typing_character.charCodeAt(0) - 0xFEE0);
					}

					this.kanaArray.push(typing_character);
					this.romaArray.push(typing_character);

					if(/[A-Z]/.test(typing_character)){
						typing_character = typing_character.toLowerCase()
					}

					this.strArray.push( [typing_character] );


					if(this.symbolDisable){
						this.deleteSymbol()
					}


					//n→nn変換
					if(v == 0){
						this.nnCheck()
					}

					this.symbolCounter()

				}
			}

		};

		//this.kanaArray最後の文字が「ん」だった場合も[nn]に置き換えます。
		if(this.kanaArray[this.kanaArray.length-1] == "ん"){
			this.romaArray.splice(-1,1,'nn')
			this.strArray[this.strArray.length-1][0] = 'nn'
			this.strArray[this.strArray.length-1].push("n'")
		}

		return [this.strArray, this.kanaArray, this.romaArray];

	}

	addDisguiseSpace(){
		if(this.kanaArray.length >= 2 && !this.spaceDisable){
			this.kanaArray[this.kanaArray.length-2] += " "
			this.romaArray[this.romaArray.length-2] += " "
		}

	}


	deleteSymbol(){
		if(this.kanaArray[this.kanaArray.length-1]=="～"){
			this.kanaArray[this.kanaArray.length-1]="ー"
			this.romaArray.splice(-1,1,'-')
			this.strArray[this.strArray.length-1][0] = '-'
		}

		if(symbol_disable_list.includes(this.romaArray[this.romaArray.length-1]) || symbol_disable_romamap_list.includes(this.romaArray[this.romaArray.length-1])){

			if(this.kanaArray[this.kanaArray.length-1] == "・" || this.kanaArray[this.kanaArray.length-1] == " "){
				this.addDisguiseSpace()
			}
			this.arrayDelete()
			this.abridgementWordLength ++
		}else if(this.kanaArray[this.kanaArray.length-1] == "-" && (this.kanaArray.length >= 2 && /[a-zA-Zａ-ｚＡ-Ｚ\s]/.test(this.kanaArray[this.kanaArray.length-2]) || this.kanaArray.length == 1)){
			this.addDisguiseSpace()
			this.arrayDelete()
			this.abridgementWordLength ++
		}else if(this.kanaArray[this.kanaArray.length-1] == "."&&(this.kanaArray.length >= 2 && !/[0-9０-９]/.test(this.kanaArray[this.kanaArray.length-2])||this.kanaArray.length == 1)){
			this.abridgementWordLength ++
		}

	}

	arrayDelete(){
		this.kanaArray.pop()
		this.strArray.pop()
		this.romaArray.pop()
	}


	getScorePerChar(){


		//TypingLog(詳細記録)
		latency_kpm_rkpm_log = Array(lyrics_array.length-1).fill([0,0,0]); //[反応時間,打鍵速度,初速抜き打鍵速度]
		clear_time_log = Array(lyrics_array.length-1).fill(0); //[ライン毎の入力経過時間]
		escape_word_length_log = Array(lyrics_array.length-1).fill(["",0,0]); //[逃した文字,文字数, completeしてたら1。それ以外は0。]
		line_score_log = Array(lyrics_array.length-1).fill([0,0]); //[そのラインで獲得したスコア]
		line_typing_count_miss_count_log = Array(lyrics_array.length-1).fill([0,0,0]); //[打鍵数,ミス打鍵数,コンボ]
		line_typinglog_log = Array(lyrics_array.length-1).fill([]);//line_typinglogのlog。[line_typinglog.push([c , 1 , headtime+practice_time , inputModeManager.kanaMode]);



		const TYPING_ARRAY_LENGTH = this.typingArray.length

		for (let i=0; i<TYPING_ARRAY_LENGTH; i++){
			let romaLineNotes = 0
			let kanaLineNotes = 0
			let dakuHandakuLineNotes = 0
			let lineSpeed = 0

			if(RTC_Switch && lyrics_array[i][0].substr( -5, 1 ) == "." && !BGM_time_flag){
				BGM_time_flag = true
				BGM_time = +lyrics_array[i][0]
			}
			//this.typingArrayのi番号がend行と同じ番号なら総合打鍵数に含まない
			if(lyrics_array[i][1]!='end' && this.typingArray[i] != ''){

				this.lineLength++;
				line_length++; //HTML内の処理で使用されている。内容はthis.lineLengthと同じ

				if(this.startLine == 0){
					this.startLine = i+1
				}

				if(RTC_Switch && BGM_time == -1 && lyrics_array[i][0]){
					BGM_time = +lyrics_array[i][0]
				}

				lineSpeed = lyrics_array[i+1][0]-lyrics_array[i][0]

				//かな入力
				dakuHandakuLineNotes=(this.typingArrayKana[i].join('').match( /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g ) || [] ).length
				kanaLineNotes = this.typingArrayKana[i].join('').replace(/ /g,"").length
				this.kanaTotalNotes += (kanaLineNotes+dakuHandakuLineNotes)

				//ローマ字入力
				romaLineNotes = this.typingArrayRoma[i].join('').replace(/ /g,"").length
				this.romaTotalNotes += romaLineNotes






			}else if(lyrics_array[i][1]=='end'){

				this.romaMedianSpeed = this.median(this.romaLineSpeedList);
				this.kanaMedianSpeed = this.median(this.kanaLineSpeedList);
				this.romaMaxSpeed = Math.max(...this.romaLineSpeedList)
				this.kanaMaxSpeed = Math.max(...this.kanaLineSpeedList)

				this.scoreParChar = 200000 / (this.romaTotalNotes + this.abridgementWordLength)
				this.missPenalty = parseLyric.scoreParChar/4

				if(movieSpeedController.fixedSpeed){
					movieSpeedController.speed = movieSpeedController.fixedSpeed
					movieSpeedController.playSpeed = movieSpeedController.fixedSpeed;
					movieSpeedController.updateSpeedDisplay()
				}
				mapInfoDisplay.updateMapInfo()
				break;
			}

			this.kanaLineNotesList.push(kanaLineNotes+dakuHandakuLineNotes)
			this.romaLineNotesList.push(romaLineNotes)
			this.romaLineSpeedList.push(lineSpeed > 0 ? Math.round((romaLineNotes/lineSpeed) * 100) / 100 : 0)
			this.kanaLineSpeedList.push(lineSpeed > 0 ? Math.round(((kanaLineNotes+dakuHandakuLineNotes)/lineSpeed) * 100) / 100 : 0)

		};
		return;

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



parseLyrics = function (data) {
	parseLyric = new ParseLyric(data)
	parseLyric.parse()
	parseLyric.getScorePerChar()
}






//配点基準・必要速度を計算・表示
getScorePerChar = function () {
	return;
}

function redo_parseLyrics(){
	if(document.getElementsByName('space-symbol-omit')[0].checked === true){
		document.getElementById("space-trace").style.display = "inline";
	}else{
		document.getElementById("space-trace").style.display = "none";
	}
	parseLyrics(parseLyric.data);
}

document.getElementsByName('space-symbol-omit')[0].addEventListener("change",redo_parseLyrics)
document.getElementsByName('margin-space-disable')[0].addEventListener("change",redo_parseLyrics)






/*
*@ページ読み込み時のタイピングワード生成処理 ここまで---
**/
/////////////////////////////////////////////////////////////////////////////////////////////////











/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@プレイ開始前準備の関数変更 ここから---
*/




let complete_html_save

var speedbutton
let combo_challenge
let combo_challenge_beatmap_data
let play_ID
let play_Name

var flick_form = document.createElement('input');
flick_form.setAttribute("id", "flick-input");
var flick_form_second = document.createElement('input');
flick_form_second.setAttribute("id", "flick-input-second");

function starting_kashi_area(){
	document.getElementById("kashi_area").style.display = "block"
	document.getElementById("mode-select-area").style.display = "none"
}
function view_shortcut_key(){
	if(document.getElementById("shortcut").style.display == "none"){
		document.getElementById("shortcut").style.display = "block";
		document.getElementById("shortcut").animate([{opacity: '0'}, {opacity: '1'}], 100)
	}else{
		document.getElementById("shortcut").style.display = "none";
	}
}



//プレイ開始時に各機能で必要なDOMを追加
function play_preparation(){


	player.setPlaybackRate(movieSpeedController.playSpeed);

	//ランキングのスコア取得
	for (let i = 0;i<ranking_length.length; i++) {ranking_array.push(parseFloat(ranking_length[i].textContent))};
	ranking_array = ranking_array.slice(ranking_array.lastIndexOf(ranking_array.find(element => element > 0)))


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
	movieSpeedController.addDynamicSpeedChangeEvent()
	document.getElementById("more_shortcutkey").addEventListener("click",view_shortcut_key)
	document.getElementById("shortcut").addEventListener("click",view_shortcut_key)

	if(document.getElementById("combo_challenge") != null){
		document.getElementsByName('challenge-enable')[0].setAttribute("disabled","disabled")
	}
	document.getElementsByName('space-symbol-omit')[0].setAttribute("disabled","disabled")
	document.getElementsByName('margin-space-disable')[0].setAttribute("disabled","disabled")

	if(parseLyric.mapStyle != null){document.head.insertAdjacentHTML('beforeend',parseLyric.mapStyle[0]);}//譜面styleを適用


	document.getElementById("speed-down").innerHTML = `<div style="position:relative;">-<span style="position: absolute;top: -0.8em;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);font-size:90%;">F9</span></div>`
	document.getElementById("speed-up").innerHTML = `<div style="position:relative;">+<span style="position: absolute;top: -0.8em;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);font-size:84%;">F10</span></div>`
	speedbutton = document.getElementById("playBotton3").cloneNode(true)


	window.addEventListener('resize',scroll_change);

	SELECTOR_ACCESS_OBJECT['kashi'] = document.getElementById("kashi")
	SELECTOR_ACCESS_OBJECT['kashi_next'] = document.getElementById("kashi_next")
	SELECTOR_ACCESS_OBJECT['kashi_roma'] = document.getElementById("kashi_roma")
	SELECTOR_ACCESS_OBJECT['header'] = document.getElementsByTagName('header')[0]
	if(typing_play_mode == 'flick'){
		document.getElementById("song_reset_F4").style.visibility = "hidden"
		document.getElementById("speed_change_F10").style.visibility = "hidden"
		document.getElementById("more_shortcutkey").style.display = "none"
		if(!SELECTOR_ACCESS_OBJECT['flick-input']){
			create_flick_textbox()
		}
	}

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
	skip_guide_total_time_html.innerHTML = `<div id="skip-guide"></div><div id="total-time">00:00 / `+parseLyric.movieTimeMM+`:`+parseLyric.movieTimeSS+`</div>`
	SELECTOR_ACCESS_OBJECT['kashi_next'].parentNode.insertBefore(skip_guide_total_time_html, SELECTOR_ACCESS_OBJECT['kashi_next'].nextElementSibling);
	SELECTOR_ACCESS_OBJECT['skip-guide'] = document.getElementById("skip-guide")

	if(typing_play_mode == 'flick'){
		SELECTOR_ACCESS_OBJECT['skip-guide'].display = "none";
		SELECTOR_ACCESS_OBJECT['skip-guide'].insertAdjacentHTML('beforebegin', `<div id='flick-status'><span id="flick-score-value" style="font-weight:bold;">0.00</span> , miss: <span id="flick-miss-value">0</span> , lost: <span id="flick-lost-value">0</span></div>`);
		SELECTOR_ACCESS_OBJECT['flick-score-value'] = document.getElementById("flick-score-value")
		SELECTOR_ACCESS_OBJECT['flick-miss-value'] = document.getElementById("flick-miss-value")
		SELECTOR_ACCESS_OBJECT['flick-lost-value'] = document.getElementById("flick-lost-value")
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
	SELECTOR_ACCESS_OBJECT['kashi'].style.color = '#FFF';
	SELECTOR_ACCESS_OBJECT['kashi_next'].style.marginBottom = "0";
	SELECTOR_ACCESS_OBJECT['kashi_next'].style.color = 'rgba(255,255,255,.7)'


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

	checkbox_effect_mod_open_play()
	checkbox_effect_play()
	starting_kashi_area()
}

function scrollPlayArea(){
	const scroll = (document.documentElement.scrollTop+CONTROLBOX_SELECTOR.getBoundingClientRect().top+CONTROLBOX_SELECTOR.clientHeight+Number(document.getElementsByName('scroll-adjustment')[0].selectedOptions[0].value)-document.documentElement.clientHeight)
	window.scrollTo({
		top: scroll
	})
}





function play_focus(){
	if(SELECTOR_ACCESS_OBJECT['flick-input']){
		SELECTOR_ACCESS_OBJECT['flick-input'].focus()
		SELECTOR_ACCESS_OBJECT['flick-input'].setSelectionRange(SELECTOR_ACCESS_OBJECT['flick-input'].value.length, SELECTOR_ACCESS_OBJECT['flick-input'].value.length);
	}else{
		document.activeElement.blur()
		window.focus()
	}
}

let playarea_save
let pause_flag = false
var finished_practice


onPlayerStateChange = function (event) {
	switch(event.data){
		case 1: //再生(player.playVideo)
			console.log("再生 1")
			if (finished || !playing && RTC_Switch) {

				if(!finished && prevState != "preStart" && RTC_Switch && !demo_play_flag && localStorage.getItem("RTCpreview")=="false"){
					RTCpreviewStart()
				}else if(finished){
					//player.pauseVideo()
				}
				return;

			}else if(!is_played) {//プレイ開始
				playStart(event)
			} else {
				//ポーズから復帰
				if(pause_flag){
					pauseCancel()
				}
				if(is_played && !finished){
					tick.addEvent()
				}
			}

			if(PHONE_FLAG){
				player.setPlaybackRate(movieSpeedController.speed)
			}
			break;

		case 0: //プレイ終了(最後まで再生した)
		case 5://動画停止(途中でStopVideo)
			if(event.data == 0){
				console.log("プレイ終了 0")
			}else{
				console.log("動画停止 5")
			}

			if(is_played){
				//プレイ終了
				playFinished()

			}else if(prevState != "preStart" && localStorage.getItem("RTCpreview") == "true"){

				//対戦のプレビュー再生時に動画が終了したらフェードインしながらループさせる。
				RTCpreviewStart("feedIn")

			}

			break;

		case 2 : //一時停止(player.pauseVideo)
			console.log("一時停止 2")
			if(is_played && !finished && ( playing && Object.keys(Players_ID).length == 1 || !RTC_Switch)){
				pause()
			}

			break;
		case 3: //再生時間移動 スキップ(player.seekTo)
			console.log("シーク 3")
			RTCmovieLoadedCheck()

			if(PHONE_FLAG){
				player.setPlaybackRate(movieSpeedController.speed)
			}

			if(practiceMode){
				//練習モードでラインをやり直す場合count変数を合わせる
				if(practiceMode.isLineRetry){
					practiceMode.isLineRetry = false;
					getLyricsCount(practiceMode.setSeekTime,-1)
				}else if(practiceMode.isPracticeReset){
					practiceMode.isPracticeReset = false;
					getLyricsCount(0,0)
				}
			}
			break;

		case -1: //	未スタート、他の動画に切り替えた時など
			console.log("未スタート -1")
			//プレイ開始時、０秒目から再生を開始する。
			if(!is_played && (!RTC_Switch || playing)){
				player.seekTo(0)
			}
			break;
	}}



function getLyricsCount(time , lineSet){
	for(let i=0;i<lyrics_array.length;i++){
		if(lyrics_array[i][0] - time >= 0){
			line.count = i-1
			break;
		}
	}

	if(line.count<0){line.count = 0}
	//取得したラインのワードをセット
	if(typeof lineSet == 'number'){
		const SET_LINE_COUNT = line.count <= 0 ? 0 : line.count-lineSet
		line.addNextLineWord(SET_LINE_COUNT)
		if(line.lineInput.length > 0){ keyDown.addNextChar(false) }
		typingWordRenderer.update('kanaUpdate')
		line.setNextLyric(SET_LINE_COUNT)
		timeSkip.seekedCount = line.count
	}
}



function RTCmovieLoadedCheck(){
	if(prevState == "preStart" && !playing){
		if(!FirstVideoLoadedCheck){
			FirstVideoLoadedCheck = setInterval(function(){
				if(player.getVideoLoadedFraction() > 0){
					var updates = {};
					updates['users/' + myID + '/state'] = "play";
					firebase.database().ref().update(updates);
					clearInterval(FirstVideoLoadedCheck)
				}
			},50)

		}
	}
}



/**
*@Description プレイスタート
*/
function playStart(event){

	player.unMute()
	player.setVolume(volume);

	window.removeEventListener('keydown',enter_ranking_entry);

	parseLyric.getVideoTime(lyrics_array[lyrics_array.length-1][0])

	is_played = true;

	play_preparation()
	play_movie();
	start_movie();

	window.removeEventListener('keydown', press_start ,true);

	if(document.getElementById("playBotton3") != null){document.getElementById("playBotton3").remove()}

	playarea_save = document.getElementsByClassName("playarea")[0].cloneNode(true);

	if(!RTC_Switch && OPTION_ACCESS_OBJECT['play-scroll']){
		scrollPlayArea()
	}


	if(movieSpeedController.fixedSpeed){
		movieSpeedController.defaultPlaySpeed = movieSpeedController.playSpeed
	}
	if(play_mode == 'practice'){
		practiceMode.createMenu()
	}

}

/**
*@Description ポーズから復帰
*/
function pauseCancel(){

	//リプレイモードで止まってなかったら▶を表示
	if(!OPTION_ACCESS_OBJECT['replay-mode'] || OPTION_ACCESS_OBJECT['replay-mode'] && !line_typinglog_log[line.count-1][push_counter]){
		replace_complete_area("▶")
	}


	pause_flag = false
	play_focus()


	//ポーズ時に使用するイベントを削除
	window.removeEventListener('keydown',esc_play_movie,true);
	window.removeEventListener('keydown',miss_limit_mode_space_disable,true);


	//以下、イベント追加
	tick.addEvent()

	timeSkip.addSkipEvent()

	keyDown.addEvent()

	if(SELECTOR_ACCESS_OBJECT['flick-input']){
		window.addEventListener("keydown",key_device_disabled)
	}

}
/**
*@Description プレイ終了した
*/
function playFinished(){

	if(RTC_Switch){
		endGames();
	}

	finished = true;

	if(PHONE_FLAG){
		player.setPlaybackRate(1)
	}

	not_play_event()

	retry.addFinishedRetryEvent()

	createServerData()

	if(keyDown.nextChar[0]){
		line.calculateLineResult()
	}

	if(play_mode == "normal"){

		window.addEventListener('keydown',enter_ranking_entry,true);

		if(!typingResult){
			typingResult = new TypingResult()
		}

		if(!OPTION_ACCESS_OBJECT['not-submit-score']){
			submit_score();
		}

	}

	if(RTC_Switch){
		document.getElementById("RTCContainer").style.display = "block"
		if(document.getElementById("RTCGamePlayWrapper").scrollHeight > 292){
			document.getElementById("RTCGamePlayWrapper").style.height = ""
			document.getElementById("RTCStatus_Area").style.height = "auto"
		}
	}

	finish_comment();


}

function createServerData(){
	retry.resetSendServerData()

	const SCORE_DATA = (typingCounter.score > 0 ? typingCounter.score : 0)

	score = SCORE_DATA;
	max_combo = typingCounter.maxCombo;
	typing_count = typingCounter.typeCount;
	typing_miss_count = typingCounter.missCount;
	correct = typingCounter.correct;
	type_per_min = tick.typingSpeed * 60;
	complete_count = typingCounter.completeCount;
	failer_count = line.failerCount
	line_clear_rate = typingCounter.lineClearRate;
	typinglog = typingCounter.typingLog;
}

/**
*@Description ポーズした(プレイ停止 Escキー)
*/
function pause(){

	if(!OPTION_ACCESS_OBJECT['replay-mode'] ||OPTION_ACCESS_OBJECT['replay-mode'] && !line_typinglog_log[line.count-1][push_counter]){
		replace_complete_area("ll")
	}

	if(PHONE_FLAG){
		player.setPlaybackRate(1)
	}

	pause_flag = true
	play_focus()

	window.addEventListener('keydown',esc_play_movie);
	not_play_event()

}


function esc_play_movie(){
	if(event.key=="Escape" && !player_demo){//Escでポーズ解除
		player.playVideo()
		event.preventDefault();
	}
}









function play_movie() {
	tick = new Tick()
	retry = new Retry()
	keyDown = new KeyDown()
	statusRenderer = new StatusRenderer()
	practiceMode = new PracticeMode()
	retry.addEvent()

	addStartLine()

	play_focus()
}

function addStartLine(){

	line.updateLineView()
	line.addNextLineWord(line.count)
	statusRenderer.viewStatusArea()
}


/**
*@プレイ前準備の関数変更 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////




function replace_complete_area(replace){
	document.getElementById("complete_effect").parentNode.replaceChild(complete_html_save,document.getElementById("complete_effect"));
	if(replace != "ll"){
		document.getElementById("complete_effect").classList.add('countdown_animation','complete_animated')
	}else{
		document.getElementById("complete_effect").classList.remove('countdown_animation','complete_animated')
	}
	document.getElementById("complete_effect").innerHTML = replace
}





/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@MOD設定保存・反映 ここから---
*/



/**
 * MOD Menuの設定が変更されたときに変更内容をlocalStorageに保存する
 * @param {event} 設定変更があった要素
 */

function backUpIndexedDb(EVENT_TARGET){
	/**
      * 設定を変更した要素のName属性とValueをIndexedDBにPutする
      * @param SAVE_DATA {array} 配列データを返します。[EventTargetName , EventTargetValue]
      */
	const SAVE_DATA = modConfigLocalStorageSave(EVENT_TARGET)
	if(SAVE_DATA){
		putOptionSaveData(SAVE_DATA[0] , SAVE_DATA[1])
	}
}


function putOptionSaveData(OptionName , Data){
	const SEND_DATA = { OptionName : OptionName, Data : Data };
	const OPEN_REQ = window.indexedDB.open(STORE_NAME);

	OPEN_REQ.onsuccess = function(event){
		var db = event.target.result;
		var trans = db.transaction(STORE_NAME, 'readwrite');
		var store = trans.objectStore(STORE_NAME);
		var putReq = store.put(SEND_DATA);
	}
}


function saveModOption(event){


	if(event){ //changeイベントで変更があった設定を保存

		const EVENT_TARGET = event.target;

		if(EVENT_TARGET.name === 'tab-item'){
			return;
		}
		backUpIndexedDb(EVENT_TARGET);
		if(EVENT_TARGET.name === 'color-preset'){
			if(document.getElementsByName('color-preset')[0].value == "デフォルト"){
				color_default();
			}else if(document.getElementsByName('color-preset')[0].value == "先頭の文字を赤く強調"){
				letter_red();
			}else if(document.getElementsByName('color-preset')[0].value == "入力スタイル"){
				letter_input_style();
			}else if(document.getElementsByName('color-preset')[0].value == "打つと消える"){
				transparent_style();
			}
			document.getElementsByName('color-preset')[0].selectedIndex = 0;
			allSave();
		}else{
			modConfigLocalStorageSave(EVENT_TARGET);
		}

	}else{ //全ての設定を一括保存
		allSave();
	}

	//設定を反映
	inputModeManager.updateMode();
	checkbox_effect_mod_open_play();
	checkbox_effect_play();

	//カラーコードの状態保存
	OnColorChanged();

	if(!finished){
		mapInfoDisplay.updateMapInfo();

	}

}

function allSave() {
	const MOD_LOCALSTORAGE_CONFIG_DATA = document.querySelectorAll(".mod-tab-content [name]");

	for(let i=0; i<MOD_LOCALSTORAGE_CONFIG_DATA.length; i++){
		const SAVE_DATA = modConfigLocalStorageSave(MOD_LOCALSTORAGE_CONFIG_DATA[i]);
		if(SAVE_DATA != undefined){
			putOptionSaveData(SAVE_DATA[0] , SAVE_DATA[1]);
		}
	}
}

/**２
 * MOD設定メニューの内容をlocalStorageに保存する
 * @param {DOM} 設定を保存するinputタグ
 */

function modConfigLocalStorageSave(saveTarget){

	if(saveTarget.type === 'checkbox'){
		return [saveTarget.name,saveTarget.checked];
	}else if(saveTarget.type === 'radio'){
		for(let i = 0; i<document.getElementsByName(saveTarget.name).length;i++){
			if(document.getElementsByName(saveTarget.name)[i].checked){
				return [saveTarget.name,i];
			}
		}
	}else if(saveTarget.type === 'number'){
		return [saveTarget.name,saveTarget.value > 100 ? 100 : saveTarget.value];
	}else if(saveTarget.tagName === 'SELECT'){
		return [saveTarget.name,saveTarget.selectedIndex];
	}else if(saveTarget.className.match('color')){
		return [saveTarget.name,saveTarget.value];
	}
}




//カラーコードをlocalstorageに保存
function OnColorChanged(selectedColor, input) {

	if(selectedColor){
		putOptionSaveData(input.name ,selectedColor);
		OPTION_ACCESS_OBJECT[input.name] = selectedColor;
	}

	//設定を反映
	CONTROLBOX_SELECTOR.style.backgroundColor = document.getElementsByName('playarea-color')[0].value;
	updateProgressStyleTag();

	if(!is_played){

	}else if(is_played && !finished){
		line.updateLineView();
		typingWordRenderer.update('kanaUpdate');
	}
}


//スクロール調整機能を設定時に反映
function scroll_change(){

	if(is_played && !finished && !RTC_Switch){
		scrollPlayArea()
	}
}


//タイピングワードのフォントサイズ設定を反映
function set_status_setting(){
	if(mode!="roma"&&mode!="kana"){return}
	const TEXT_SHADOW_PX = document.getElementsByName('font-shadow-px')[0].textContent
	document.getElementById("status_setting").innerHTML= `
#kashi_roma{font-size:${document.getElementsByName('kana-font-size-px')[0].textContent}px;}
#kashi_sub{font-size:${document.getElementsByName('roma-font-size-px')[0].textContent}px;}
.kana-input-dom{letter-spacing:${document.getElementsByName('kana-font-spacing-px')[0].textContent}px;}
.roma-input-dom{letter-spacing:${document.getElementsByName('roma-font-spacing-px')[0].textContent}px;}

.text_shadow{
   text-shadow:black ${TEXT_SHADOW_PX}px 0px,  black -${TEXT_SHADOW_PX}px 0px,
    black 0px -${TEXT_SHADOW_PX}px, black 0px ${TEXT_SHADOW_PX}px,
    black ${TEXT_SHADOW_PX}px ${TEXT_SHADOW_PX}px , black -${TEXT_SHADOW_PX}px ${TEXT_SHADOW_PX}px,
    black ${TEXT_SHADOW_PX}px -${TEXT_SHADOW_PX}px, black -${TEXT_SHADOW_PX}px -${TEXT_SHADOW_PX}px,
    black 1px ${TEXT_SHADOW_PX}px,  black -1px ${TEXT_SHADOW_PX}px,
    black 1px -${TEXT_SHADOW_PX}px, black -1px -${TEXT_SHADOW_PX}px,
    black ${TEXT_SHADOW_PX}px 1px,  black -${TEXT_SHADOW_PX}px 1px,
    black ${TEXT_SHADOW_PX}px -1px, black -${TEXT_SHADOW_PX}px -1px;
}
`
}



const OPTION_ACCESS_OBJECT = {}


//プレイ中に必要な設定を反映(プレイ開始時に1度読み込まれる)
function checkbox_effect_play(){

	if(is_played && !finished){

		const DURING_PLAY_OPTIONS = document.getElementsByClassName("during-play-option")

		for(let i=0;i<DURING_PLAY_OPTIONS.length;i++){
			const OPTION_NAME = DURING_PLAY_OPTIONS[i].getAttribute('name')

			if(DURING_PLAY_OPTIONS[i].type === 'number'){

				if(OPTION_NAME.match('volume')){
					OPTION_ACCESS_OBJECT[OPTION_NAME] = DURING_PLAY_OPTIONS[i].value/100
				}else{
					OPTION_ACCESS_OBJECT[OPTION_NAME] = DURING_PLAY_OPTIONS[i].value
				}

			}else if(DURING_PLAY_OPTIONS[i].type === 'checkbox' || DURING_PLAY_OPTIONS[i].type === 'radio'){
				OPTION_ACCESS_OBJECT[OPTION_NAME] = DURING_PLAY_OPTIONS[i].checked
			}else if(DURING_PLAY_OPTIONS[i].tagName === 'SELECT'){
				OPTION_ACCESS_OBJECT[OPTION_NAME] = DURING_PLAY_OPTIONS[i].selectedOptions[0].value
			}else if(DURING_PLAY_OPTIONS[i].tagName === 'SPAN'){
				OPTION_ACCESS_OBJECT[OPTION_NAME] = +DURING_PLAY_OPTIONS[i].textContent
			}else if(DURING_PLAY_OPTIONS[i].className.match('color')){
				OPTION_ACCESS_OBJECT[OPTION_NAME] = DURING_PLAY_OPTIONS[i].value;
			}
		}

		const STATUS_RANKING_AREA = document.querySelector("#controlbox .col-sm-4")
		const TYPING_AREA = document.querySelector("#controlbox .col-sm-8")



		if(OPTION_ACCESS_OBJECT['character-scroll']){
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('character-scroll')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('character-scroll')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('mt-2')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('mt-2')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].setAttribute("style", "margin-top: .2rem!important;");

		}else{
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('character-scroll')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('character-scroll')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('mt-2')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('mt-2')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].setAttribute("style", "margin-top: .8rem!important;");

		}

		if(mode == 'roma'){
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('roma-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('kana-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('kana-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('roma-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].style.textTransform = !OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? "lowercase" : "";
			SELECTOR_ACCESS_OBJECT['kashi_roma'].style.textTransform = !OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? "lowercase" : "";
		}else if(mode == 'kana'){
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('kana-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('roma-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('roma-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('kana-input-dom')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].style.textTransform = !OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? "uppercase" : "";
			SELECTOR_ACCESS_OBJECT['kashi_roma'].style.textTransform = !OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? "lowercase" : "";
		}

		SELECTOR_ACCESS_OBJECT['roma-input-dom'] = document.getElementsByClassName("roma-input-dom")[0]
		SELECTOR_ACCESS_OBJECT['kana-input-dom'] = document.getElementsByClassName("kana-input-dom")[0]
		set_status_setting();
	}

}







/*
*@MOD設定保存・反映 ここまで---
**/
/////////////////////////////////////////////////////////////////////////////////////////////////








////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@プレイ中の処理　全体　 ここから---
*/

const missmark = document.createElement("span");
missmark.setAttribute("style", "position: absolute;top:"+(IOS_FLAG ? "-0.6em":"-0.55em")+";margin: auto;font-size: 1.5em;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);");
missmark.setAttribute("id", "missmark");
missmark.textContent = "・"

let keep_correct = 0 //目標正確率と現在正確率の差
let life_correct = 0 //残りライフ(ライフ制)

let line_clear_rate = 0 //HTML内のコードで使われているので変数を削除できない
let correct = 100 //HTML内のコードで使われているので変数を削除できない

let typingCounter
class TypingCounter {

	constructor(){
		this.score = 0
		this.lineScore = 0
		this.lastComboScore = 0
		this.currentRank = 0

		this.typeCount = 0
		this.lineTypeCount = 0
		this.totalTypeCount = 0

		this.kanaTypeCount = 0
		this.romaTypeCount = 0
		this.flickTypeCount = 0

		this.missCount = 0

		this.correct = 0
		this.lineClearRate = 0

		this.combo = 0
		this.maxCombo = 0
		this.missCombo = 0
		this.romaCombo = 0
		this.kanaCombo = 0
		this.is100Combo = false

		this.completeCount = 0
		this.completed = false

		this.typingLog = []
		this.lineTypingLog = []

	}

	calcCorrect(){
		this.correct = this.missCount ? Math.round( (this.typeCount / (this.missCount + this.typeCount) * 100) * 10) / 10 : 100
		const TOTAL_NOTES = inputModeManager.kanaMode ? parseLyric.kanaTotalNotes : parseLyric.romaTotalNotes


		if(OPTION_ACCESS_OBJECT['miss-limit-mode']){
			keep_correct = Math.round( (this.correct-OPTION_ACCESS_OBJECT['miss-limit-correct']) * 10) / 10
			life_correct = OPTION_ACCESS_OBJECT['miss-limit-game-mode'] ? "":TOTAL_NOTES-line.lostTypeLength - (TOTAL_NOTES - line.lostTypeLength) * OPTION_ACCESS_OBJECT['miss-limit-correct']/100-this.missCount
		}else{//ミス制限モードオフ
			keep_correct = 0
			life_correct = 0
		}

	}

	addTypingCount(inputChar){
		this.typeCount++;
		this.lineTypeCount++;
		this.totalTypeCount++
		this.combo++;
		this.missCombo = 0;

		if(play_mode == "normal"){

			if(inputModeManager.kanaMode && typing_play_mode == 'kana'){
				this.kanaTypeCount++
			}else if(inputModeManager.kanaMode && SELECTOR_ACCESS_OBJECT['flick-input']){
				this.flickTypeCount++
			}else{
				this.romaTypeCount++
			}

		}

		if(this.maxCombo < this.combo){
			this.maxCombo = this.combo;
		}

		if(this.score > 199999){
			this.score = 200000
		}

		this.lineTypingLog.push([inputChar , 1 , tick.headTime , inputModeManager.kanaMode]);



		if(!keyDown.nextChar[0]) { //ラインクリア時の打鍵タイム加算

			this.completed = true;
			clear_time_log.splice(line.count-1, 1, tick.linePlayTime);

			if(this.completed && escape_word_length_log[line.count-1][2] != 1){

				if(combating_mode == "Line"){
					status_updates['/users/' + myID + '/status/ClearTime/' + (line.count-1)] = tick.linePlayTime;
				}

				typingCounter.completeCount ++;

				if(RTC_Switch){
					status_updates['/users/' + myID + '/status/clearline'] = this.completeCount;
				}

				statusRenderer.statusCountsUpdate(["Line"])
				this.lineClearRate = Math.round( (this.completeCount / parseLyric.lineLength) * 100.0 )
			}

			typingCounter.clearEffect()
			tick.pastPlaytime += clear_time_log[line.count-1]
			line.calculateLineResult()
		}

		statusRenderer.statusCountsUpdate(["Type","Correct"])

		if(RTC_Switch){
			status_updates['/users/' + myID + '/status/combo'] = this.combo;

			if(this.combo == this.maxCombo){
				status_updates['/users/' + myID + '/status/maxCombo'] = this.maxCombo;
			}

			status_updates['/users/' + myID + '/status/score'] = ((this.score-this.lastComboScore)/2000).toFixed(2);
		}

		tick.updateTypingSpeed()

		if(RTC_Switch){
			status_updates['/users/' + myID + '/status/keySec'] = (tick.typingSpeed).toFixed(2);

			if(this.completed){
				status_updates['/users/' + myID + '/status/linekeySec'] = tick.lineTypingSpeed.toFixed(2);
			}

			firebase.database().ref().update(status_updates);
			status_updates = {}
		}

		this.typingLog.push([tick.headTime, inputChar, Math.round(this.score), line.count, this.completed ? 1 : 0, 1]);
	}

	lineComplete(){
		keyDown.nextPoint = 0;

		for(let i=0;i<SELECTOR_ACCESS_OBJECT['correct-input'].length;i++){
			SELECTOR_ACCESS_OBJECT['correct-input'][i].style.color = OPTION_ACCESS_OBJECT['line-clear-color']
		}

	}

	typeEffect(){

		if(OPTION_ACCESS_OBJECT['combo-counter-effect'] && this.combo >= 1){
			SELECTOR_ACCESS_OBJECT['combo-value'].innerHTML = "<div class='combo_animated'id='combo_anime'>"+this.combo+"</div>"
		}

		if (OPTION_ACCESS_OBJECT['typing-sound-effect'] && !this.completed) {
			soundEffect.play('keyType')
		}

		if(this.combo >= 100){
			this.is100Combo = true;
		}

	}

	clearEffect(){

		if(OPTION_ACCESS_OBJECT['clear-sound-effect']){
			soundEffect.play('clearType')
		}else if(!OPTION_ACCESS_OBJECT['clear-sound-effect'] && OPTION_ACCESS_OBJECT['typing-sound-effect']){
			soundEffect.play('keyType')
		}

		timeSkip.displaySkipGuide()
	}

	addMissCount(){

		this.missCount ++;
		this.lineTypeCount ++;
		this.missCombo ++;
		this.lastComboScore = 0

		if(play_mode == "normal" && combo_challenge && this.missCount == 1){
			this.resetComboChallenge()
		}

		this.combo = 0;
		this.romaTypeCount = 0
		this.kanaTypeCount = 0
		this.flickTypeCount = 0
		this.kanaCombo = 0
		this.romaCombo = 0

		if(play_mode == "normal" || line_score_log[line.count-1][0] < this.lineScore){
			this.score -= parseLyric.missPenalty
			line.lostTypeScore += parseLyric.missPenalty
		}

		this.lineScore -= parseLyric.missPenalty


		if(combating_mode == "Combo" || combating_mode == "Perfect"){
			this.lastComboScore += this.score
		}

		if(play_mode == "practice" && OPTION_ACCESS_OBJECT['seek-line-miss'] && !push_counter){
			practice_missline_auto_set()
		}

		statusRenderer.statusCountsUpdate(["Score","Rank","Miss","Correct"])

		if(RTC_Switch){
			status_updates['/users/' + myID + '/status/combo'] = this.combo;
			status_updates['/users/' + myID + '/status/score'] = ( (this.score-this.lastComboScore) / 2000).toFixed(2);
			firebase.database().ref().update(status_updates);
			status_updates = {}
		}

		tick.updateTypingSpeed()
	}

	missEffect(){

		if(OPTION_ACCESS_OBJECT['combo-counter-effect'] && this.missCombo == 1){
			SELECTOR_ACCESS_OBJECT['combo-value'].textContent = "0";
		}

		if(this.missCombo && this.lineTypeCount != 0 || OPTION_ACCESS_OBJECT['miss-beginning-sound-effect']){

			if(!this.is100Combo || !OPTION_ACCESS_OBJECT['combo-break-sound']){

				if(OPTION_ACCESS_OBJECT['miss-sound-effect']){
					soundEffect.play('missType')
				}

			}else if(this.is100Combo){//100combo

				if(OPTION_ACCESS_OBJECT['combo-break-sound']){
					soundEffect.play('comboBreak');//100 combo以上でミスするとcombo break音
				}

				this.is100Combo = false;//フラグOFF
			}

		}

		if(OPTION_ACCESS_OBJECT['miss-mark-effect'] && (this.lineTypeCount == 0 || this.missCombo == 1)){//ミス表示を追加
			missmark.style.color = this.lineTypeCount == 0 ? OPTION_ACCESS_OBJECT['word-color'] : '#FF3554'
			SELECTOR_ACCESS_OBJECT['next-character-color'].appendChild(missmark)
		}

	}

	resetComboChallenge(){
		combo_challenge_combo_Calc()

		const combo_challenge_roma_result = +localStorage.getItem('combo_challenge_roma')+this.romaCombo
		const combo_challenge_kana_result = +localStorage.getItem('combo_challenge_kana')+this.kanaCombo
		const combo_challenge_full_combo_result = +localStorage.getItem('combo_challenge_fullcombo') + 1

		if(+localStorage.getItem('combo_challenge_roma') >= 700){
			const date = new Date()
			const date_format = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
			combo_challenge_beatmap_data.push([play_ID,play_Name,this.romaCombo,this.kanaCombo,(this.score/2000).toFixed(2),tick.typingSpeed.toFixed(2),movieSpeedController.playSpeed.toFixed(2),this.romaTypeCount,this.kanaTypeCount,this.flickTypeCount,date_format])

			if(+localStorage.getItem('combo_challenge_max_kana') < combo_challenge_kana_result || isNaN(+localStorage.getItem('combo_challenge_max_kana'))){
				localStorage.setItem('combo_challenge_max_roma',combo_challenge_roma_result)
				localStorage.setItem('combo_challenge_max_kana',combo_challenge_kana_result)
				localStorage.setItem('combo_challenge_fullcombo_max' , combo_challenge_full_combo_result)
				localStorage.setItem('combo_challenge_beatmap_data_max', JSON.stringify(combo_challenge_beatmap_data))
				localStorage.removeItem('combo_challenge_beatmap_data_last')
			}else{
				localStorage.setItem('combo_challenge_last_roma',combo_challenge_roma_result)
				localStorage.setItem('combo_challenge_last_kana',combo_challenge_kana_result)
				localStorage.setItem('combo_challenge_fullcombo_last' , combo_challenge_full_combo_result)
				localStorage.setItem('combo_challenge_beatmap_data_last', JSON.stringify(combo_challenge_beatmap_data))
			}

		}

		localStorage.removeItem('combo_challenge_kana')
		localStorage.removeItem('combo_challenge_roma')
		localStorage.removeItem('combo_challenge_fullcombo')
		localStorage.removeItem('challenge-enable')
		localStorage.removeItem('combo_challenge_beatmap_data')
		combo_challenge_beatmap_data = []
	}


}





const SELECTOR_ACCESS_OBJECT = {}


let statusRenderer
class StatusRenderer {

	constructor(){

	}

	viewStatusArea(){
		typingCounter.calcCorrect()

		SELECTOR_ACCESS_OBJECT['combo-value'].innerHTML = "&#8203;";
		document.getElementById("status").style.height = "initial"
		document.getElementById("status").style.lineHeight = "30px"
		document.getElementById("status").style.fontSize = "1.5rem"
		document.getElementById("status").style.backgroundColor = "rbga(0,0,0,0.5)";
		document.getElementById("status").style.backgroundBlendMode = "lighten";
		document.getElementById("status").innerHTML = `
<table style="width:100%;table-layout: fixed;position: relative;right: -82px;">
<tr id=statu1dan style='height: 4rem;'>

<td class='score_counter'><span class='status_label' style="left: -48px;">Score</span>
<span class="flex_status_position"><span id='score-value'>${(typingCounter.score/2000).toFixed(2)}</span><span class="flex_status_border"></span></span>
</td>

<td class='miss' id='miss_life'><span class='status_label' >Miss</span>
${(OPTION_ACCESS_OBJECT['miss-limit-mode'] && !OPTION_ACCESS_OBJECT['miss-limit-game-mode'] ? `<span id="life" style="position: absolute;left: -48px;line-height: 10px;top: -2px;"><span id='life-value'>`+life_correct.toFixed(1)+`</span></span>`:"")}

<span class="flex_status_position"><span id='miss-value'>${typingCounter.missCount}</span><span class="flex_status_border"></span></span>
</td>

<td class='escape-counter'><span class='status_label'>Lost</span>
<span class="flex_status_position"><span id='escape-value'>${line.lostTypeLength}</span><span class="flex_status_border"></span></span>
</td>

<td class='typing_speed'><span class='status_label' style='font-weight:normal;left: -42px;'>打/秒</span>
<span class="flex_status_position"><span id='type-speed'>${tick.typingSpeed.toFixed(2)}</span><span class="flex_status_border"></span></span>
</td>
</tr>

<tr id=statu2dan style='height: 4rem;'>
<td class='rank'><span class='status_label' style="left: -45px;">Rank</span>
<span class="flex_status_position"><span id='rank-value'>${(typingCounter.currentRank+1)}</span><span style='font-weight:normal;'>位</span><span class="flex_status_border"></span></span>
</td>


<td class='correct' style='visibility:${(OPTION_ACCESS_OBJECT['miss-limit-mode'] || document.getElementsByName('visibility-correct')[0].checked ? "visible":"hidden")};'><span class='status_label' style='font-size:65%;font-weight:normal;left: -45px;'>正確率</span>
<span id="keep" style="display:${(OPTION_ACCESS_OBJECT['miss-limit-mode'] ? "block":"none")};${(OPTION_ACCESS_OBJECT['miss-limit-mode'] && OPTION_ACCESS_OBJECT['miss-limit-game-mode'] ? "color:gold":"opacity: 0.6")};padding-left:9px;position: absolute;left: -53px;line-height: 10px;top: 0;"><span id="keep-value">${(OPTION_ACCESS_OBJECT['miss-limit-mode'] ? keep_correct.toFixed(1) :"")}</span>%</span>
<span class="flex_status_position"><span style='font-size:90%;'><span id='correct-value'>${typingCounter.correct}</span>%</span><span class="flex_status_border"></span></span>
</td>

<td class='type-counter'><span class='status_label' style='left: -43px;'>Type</span>
<span class="flex_status_position"><span id='typing-count-value'>${typingCounter.typeCount}</span><span class="flex_status_border"></span></span>
</td>

<td class='remaining-line-counter'><span class='status_label' ><span id='normal_line_change'>${play_mode == 'normal' ? "Line":"Faile"}</span></span>
<span class="flex_status_position"><span id='line-count-value'>${parseLyric.lineLength-(line.failerCount+typingCounter.completeCount)}</span><span class="flex_status_border"></span></span>
</td>
</tr>
</table>`;
		SELECTOR_ACCESS_OBJECT['life-value'] = OPTION_ACCESS_OBJECT['miss-limit-mode'] && !OPTION_ACCESS_OBJECT['miss-limit-game-mode'] ? document.getElementById("life-value") : undefined
		SELECTOR_ACCESS_OBJECT['score-value'] = document.getElementById("score-value")
		SELECTOR_ACCESS_OBJECT['miss-value'] = document.getElementById("miss-value")
		SELECTOR_ACCESS_OBJECT['typing-count-value'] = document.getElementById("typing-count-value")
		SELECTOR_ACCESS_OBJECT['escape-value'] = document.getElementById("escape-value")
		SELECTOR_ACCESS_OBJECT['keep-value'] = document.getElementById("keep-value")
		SELECTOR_ACCESS_OBJECT['correct-value'] = document.getElementById("correct-value")
		SELECTOR_ACCESS_OBJECT['rank-value'] = document.getElementById("rank-value")
		SELECTOR_ACCESS_OBJECT['line-count-value'] = document.getElementById("line-count-value")
		SELECTOR_ACCESS_OBJECT['type-speed'] = document.getElementById("type-speed")

		if(!document.getElementsByName('visibility-score')[0].checked){
			document.getElementsByClassName('score_counter')[0].style.visibility = "hidden"
		}

		if(!document.getElementsByName('visibility-rank')[0].checked){
			document.getElementsByClassName('rank')[0].style.visibility = "hidden"
		}

		if(!document.getElementsByName('visibility-miss')[0].checked){
			document.getElementById('miss_life').style.visibility = "hidden"
		}

		if(!document.getElementsByName('visibility-type-counter')[0].checked){
			document.getElementsByClassName('type-counter')[0].style.visibility = "hidden"
		}

		if(!document.getElementsByName('visibility-escape-counter')[0].checked){
			document.getElementsByClassName('escape-counter')[0].style.visibility = "hidden"
		}

		if(!document.getElementsByName('visibility-typing-speed')[0].checked){
			document.getElementsByClassName('typing-speed')[0].style.visibility = "hidden"
		}

		if(!document.getElementsByName('visibility-remaining-line-counter')[0].checked){
			document.getElementsByClassName('remaining-line-counter')[0].style.visibility = "hidden"
		}
	}

	//Statusエリアの各項目を更新  StatusCountsUpdate(["Score","Rank","Type","Miss","Correct","Line","Escape"])
	statusCountsUpdate(CountsItemArray){
		if(!Array.isArray(CountsItemArray)){return;}

		for(let i=0;CountsItemArray.length>i;i++){
			switch (CountsItemArray[i]) {
				case "Score":
					const SCORE = (typingCounter.score/2000).toFixed(2)

					SELECTOR_ACCESS_OBJECT['score-value'].textContent = SCORE;

					if(typing_play_mode == 'flick'){
						SELECTOR_ACCESS_OBJECT['flick-score-value'].textContent = SCORE;
					}

					break;
				case "Rank":
					if(typingCounter.currentRank+1<=ranking_array.length && (100 - (line.lostTypeScore/2000)) < ranking_array[typingCounter.currentRank] || play_mode == "practice"){
						const score_Position = ranking_array.find(element => element < 100 - (line.lostTypeScore/2000) )
						typingCounter.currentRank = score_Position ? ranking_array.indexOf(score_Position) : ranking_array.length
						SELECTOR_ACCESS_OBJECT['rank-value'].textContent = (typingCounter.currentRank+1)
					}
					break;
				case "Type":
					SELECTOR_ACCESS_OBJECT['typing-count-value'].textContent = !OPTION_ACCESS_OBJECT['replay-mode'] ? typingCounter.totalTypeCount : typingCounter.typeCount
					if(RTC_Switch){
						status_updates['/users/' + myID + '/status/type'] = typingCounter.totalTypeCount;
					}
					break;
				case "Miss":
					SELECTOR_ACCESS_OBJECT['miss-value'].textContent = typingCounter.missCount
					if(typing_play_mode == 'flick'){
						SELECTOR_ACCESS_OBJECT['flick-miss-value'].textContent = typingCounter.missCount
					}
					if(RTC_Switch){
						status_updates['/users/' + myID + '/status/miss'] = typingCounter.missCount;
					}
					break;
				case "Correct":
					typingCounter.calcCorrect()
					if(RTC_Switch){
						status_updates['/users/' + myID + '/status/correct'] = typingCounter.correct.toFixed(1);
					}
					if(OPTION_ACCESS_OBJECT['miss-limit-mode']){
						if(SELECTOR_ACCESS_OBJECT['keep-value']){
							SELECTOR_ACCESS_OBJECT['keep-value'].textContent = (OPTION_ACCESS_OBJECT['miss-limit-mode'] ? keep_correct.toFixed(1) :"")
						}
						if(!OPTION_ACCESS_OBJECT['miss-limit-game-mode']){
							SELECTOR_ACCESS_OBJECT['life-value'].textContent = life_correct.toFixed(1)
						}
					}
					typingCounter.missCount ? SELECTOR_ACCESS_OBJECT['correct-value'].textContent = typingCounter.correct.toFixed(1) : SELECTOR_ACCESS_OBJECT['correct-value'].textContent = 100
					break;
				case "Line":
					if(play_mode == "normal"){
						SELECTOR_ACCESS_OBJECT['line-count-value'].textContent = (parseLyric.lineLength-(line.failerCount+typingCounter.completeCount))
					}else{
						SELECTOR_ACCESS_OBJECT['line-count-value'].textContent = parseLyric.lineLength-typingCounter.completeCount
					}
					break;
				case "Escape":
					SELECTOR_ACCESS_OBJECT['escape-value'].textContent = line.lostTypeLength
					if(typing_play_mode == 'flick'){
						SELECTOR_ACCESS_OBJECT['flick-lost-value'].textContent = line.lostTypeLength
					}
					break;
			}
		}
	}

}



let typingWordRenderer
class TypingWordRenderer {

	constructor(){
		this.alreadyInputKana = ''
		this.alreadyInputRoma = ''
	}


	update(kanaUpdate) {
		let kana_first_letter = ""
		let kana_words = ""
		let roma_first_letter = ""
		let roma_words = ""
		let space_disable_space_html = ""

		//RealTimeCombatting用変数
		let kana_words2 = ""
		let kana_correct = ""
		let roma_correct = ""

		if(keyDown.nextChar.length > 1){

			space_disable_space_html = !parseLyric.spaceDisable && keyDown.nextChar[0][keyDown.nextChar[0].length-1] == " " ? " " : ""
			kana_first_letter = (keyDown.nextChar[0][0] || "")

			if(kanaUpdate){
				kana_words = keyDown.nextChar[0].slice(1)

				if(RTC_Switch && inputModeManager.kanaMode){
					kana_words2 = (!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? line.lineInputKana.join('').toLowerCase():line.lineInputKana.join(''))
					kana_correct = (!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? this.alreadyInputKana.toLowerCase() : this.alreadyInputKana);
					status_updates['/users/' + myID + '/status/lineInput'] = (!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? this.alreadyInputKana.toLowerCase() : this.alreadyInputKana).slice(-1) + (this.alreadyInputKana.length ? String(this.alreadyInputKana.length) : "")
				}

			}

			if(!inputModeManager.kanaMode){
				roma_first_letter = (OPTION_ACCESS_OBJECT['case-sensitive-mode'] && /[A-ZＡ-Ｚ]/.test(keyDown.nextChar[0]) ? keyDown.nextChar[1][0].toUpperCase() : keyDown.nextChar[1][0] || "")
				roma_words = !OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? (keyDown.nextChar[1].slice(1) + space_disable_space_html+ line.lineInputRoma.join('')).toLowerCase() : (keyDown.nextChar[1].slice(1) +space_disable_space_html+ line.lineInputRoma.join(''))

				if(RTC_Switch){
					roma_correct = (!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? this.alreadyInputRoma.toLowerCase() : this.alreadyInputRoma);
					status_updates['/users/' + myID + '/status/lineInput'] = (!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? this.alreadyInputRoma.toLowerCase() : this.alreadyInputRoma).slice(-1) + (this.alreadyInputRoma.length ? String(this.alreadyInputRoma.length) : "")
				}

			}

		}else if(RTC_Switch){
			status_updates['/users/' + myID + '/status/lineInput'] = ""
		}



		if(OPTION_ACCESS_OBJECT['character-scroll']){

			if(kanaUpdate){
				SELECTOR_ACCESS_OBJECT['correct-input-kana'].textContent = this.alreadyInputKana.substr(-OPTION_ACCESS_OBJECT['kana-scroll-length'],OPTION_ACCESS_OBJECT['kana-scroll-length']).replace(/ /g,'ˍ')
			}
			if(!inputModeManager.kanaMode){
				SELECTOR_ACCESS_OBJECT['correct-input-roma'].textContent = this.alreadyInputRoma.substr(-OPTION_ACCESS_OBJECT['roma-scroll-length'],OPTION_ACCESS_OBJECT['roma-scroll-length']).replace(/ /g,'ˍ')
			}

		}else{

			if(kanaUpdate){
				SELECTOR_ACCESS_OBJECT['correct-input-kana'].textContent = this.alreadyInputKana.replace(/ /g,'ˍ')
			}
			if(!inputModeManager.kanaMode){
				SELECTOR_ACCESS_OBJECT['correct-input-roma'].textContent = this.alreadyInputRoma.replace(/ /g,'ˍ')
			}

		}

		if(kanaUpdate || typingCounter.missCombo || typingCounter.lineTypeCount == 0){
			SELECTOR_ACCESS_OBJECT['kana-first-word'].textContent = kana_first_letter.replace(/ /g,' ')
		}
		if(!inputModeManager.kanaMode){
			SELECTOR_ACCESS_OBJECT['first-color-roma'].textContent = roma_first_letter.replace(/ /g,' ')
			SELECTOR_ACCESS_OBJECT['typing-word-roma'].textContent = roma_words.replace(/ /g,' ')
		}
		if(kanaUpdate){
			SELECTOR_ACCESS_OBJECT['kana-second-word'].textContent = kana_words
			SELECTOR_ACCESS_OBJECT['typing-word-kana'].textContent = line.lineInputKana.join('').replace(/ /g,' ')
		}

	}



}






///////////////////////////////////////////////////////////////////////



function miss_limit_mode_space_disable(){

	if(event.code == "Space") {
		event.preventDefault();
	}

}
///////////////////////////////////////////////////////////////////////
function perfect_mode_judge(key_judge){

	if(OPTION_ACCESS_OBJECT['miss-limit-mode']){

		if(play_mode == "normal" && ( OPTION_ACCESS_OBJECT['miss-limit-game-mode'] && typingCounter.correct < OPTION_ACCESS_OBJECT['miss-limit-correct'] || !OPTION_ACCESS_OBJECT['miss-limit-game-mode'] && life_correct < 0 ) ){//correctが目標製確率より下がったらゲームオーバー || ライフが0未満でゲームオーバー

			gameover('stopVideo')

			if(OPTION_ACCESS_OBJECT['gameover-sound-effect']){
				soundEffect.play('gameOver')
			}

			if(key_judge && event.code == "Space") {
				event.preventDefault();
			}

			window.addEventListener('keydown',miss_limit_mode_space_disable,true);

			return true;
		}

	}

	return false;
}






let retry
class Retry {

	constructor(){
		this.retryCount = 1
		this.resetFlag = false
	}


	addEvent(){
		this.Event = this.reset.bind(this)
		document.getElementById("song_reset").addEventListener("click",this.Event)
	}


	addFinishedRetryEvent(){
		this.finishedEvent = this.finishedRetryMovie.bind(this)
		window.addEventListener("keydown",this.finishedEvent)
	}


	practiceModeReset(){
		retry.resetFlag = true
		this.isPracticeReset = true
		line.count = 0
		player.seekTo(0)
		practiceMode.seek_practice_line(0,0)
		replace_complete_area("⟳")
	}


	reset(){

		if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android.*Mobile)/i)){
			mobile_sound_enables()
		}

		if(document.getElementById("result-container") != null){
			document.getElementById("result-container").remove()
			typingResult = null
		}

		if(typingCounter.typeCount >= 10){
			start_movie(); //再生数をカウントする
			if(!OPTION_ACCESS_OBJECT['not-submit-score']){
				createServerData()
				submit_score();
			}
		}

		if(finished){
			this.restorePlayArea()
		}

		play_focus()

		if(typingCounter.typeCount){
			this.retryCount ++;
		}

		replace_complete_area("⟳"+this.retryCount)

		keyDown = new KeyDown()
		tick = new Tick()

		nothing_line_log = []
		this.resetFlag = true


		SELECTOR_ACCESS_OBJECT['type-speed'].textContent = "0.00";
		SELECTOR_ACCESS_OBJECT['line-speed'].textContent = "0.00打/秒";
		/* 		SELECTOR_ACCESS_OBJECT['next-kpm'].innerHTML = "&nbsp;";
		SELECTOR_ACCESS_OBJECT['kashi_roma'].innerHTML = "&nbsp;";
		SELECTOR_ACCESS_OBJECT['kashi_sub'].innerHTML = "&nbsp;";
		SELECTOR_ACCESS_OBJECT['kashi'].innerHTML = '<ruby>　<rt>　</rt></ruby>';
		SELECTOR_ACCESS_OBJECT['kashi_next'].innerHTML = '<ruby>　<rt>　</rt></ruby>' */

		latency_kpm_rkpm_log = Array(lyrics_array.length-1).fill([0,0,0]);
		escape_word_length_log = Array(lyrics_array.length-1).fill(["",0,0]);
		line_score_log = Array(lyrics_array.length-1).fill([0,0]);
		line_typing_count_miss_count_log = Array(lyrics_array.length-1).fill([0,0,0]);
		line_typinglog_log = Array(lyrics_array.length-1).fill([]);
		checkbox_effect_play()
		typingCounter.calcCorrect()

		if(RTC_Switch){
			var updates = {};
			//プレイステータスをすべて初期値に戻す
			updates['/users/' + myID + '/status/score'] = "0.00";
			updates['/users/' + myID + '/status/miss'] = 0;
			updates['/users/' + myID + '/status/combo'] = 0;
			updates['/users/' + myID + '/status/clearline'] = 0;
			updates['/users/' + myID + '/status/combo'] = 0;
			updates['/users/' + myID + '/status/maxCombo'] = 0;
			updates['/users/' + myID + '/status/type'] = 0;
			updates['/users/' + myID + '/status/correct'] = 100;
			updates['/users/' + myID + '/status/moviePos'] = "0";
			updates['/users/' + myID + '/status/lineInput'] = " ";
			updates['/users/' + myID + '/status/lineRemain'] = " ";
			updates['/users/' + myID + '/status/count'] = 0;
			updates['/users/' + myID + '/status/SkipOptin'] = " ";
			updates['/users/' + myID + '/status/keySec'] =  "0.00";
			updates['/users/' + myID + '/status/linekeySec'] = " ";
			updates['/users/' + myID + '/state'] = "play";
			updates['rooms/' + roomID + '/state'] = "play";
			firebase.database().ref().update(updates);
			firebase.database().ref('/users/' + myID + '/status/ClearTime/').set({start:0});
			document.getElementById("RTCGamePlayWrapper").style.height = "292px"
			document.getElementById("RTCRoomMes").textContent = " ";
		}

		checkbox_effect_mod_open_play()
		statusRenderer.viewStatusArea()

		if(movieSpeedController.fixedSpeed){
			player.setPlaybackRate(movieSpeedController.fixedSpeed)
		}

		tick.removeEvent()
		player.seekTo(0);

		event.preventDefault()
	}

	resetSendServerData(){
		score = 0
		max_combo = 0
		typing_count = 0
		typing_miss_count = 0
		correct = 0
		type_per_min = 0
		complete_count = 0
		failer_count = 0
		line_clear_rate = 0
		typinglog = []
	}


	restorePlayArea(){
		document.getElementsByClassName("playarea")[0].parentNode.replaceChild(playarea_save,document.getElementsByClassName("playarea")[0]);
		SELECTOR_ACCESS_OBJECT['kashi'] = document.getElementById("kashi")
		SELECTOR_ACCESS_OBJECT['kashi_next'] = document.getElementById("kashi_next")
		SELECTOR_ACCESS_OBJECT['kashi_roma'] = document.getElementById("kashi_roma")
		SELECTOR_ACCESS_OBJECT['skip-guide'] = document.getElementById("skip-guide")
		SELECTOR_ACCESS_OBJECT['total-time'] = document.getElementById("total-time")
		SELECTOR_ACCESS_OBJECT['next-kpm'] = document.getElementById("next-kpm")
		SELECTOR_ACCESS_OBJECT['combo-value'] = document.getElementById("combo-value")
		SELECTOR_ACCESS_OBJECT['remaining-time'] = document.getElementById("remaining-time")
		SELECTOR_ACCESS_OBJECT['line-speed'] = document.getElementById("line-speed")
		SELECTOR_ACCESS_OBJECT['count-anime'] = document.getElementById("count-anime")
		SELECTOR_ACCESS_OBJECT['kashi_sub'] = document.getElementById("kashi_sub")
		SELECTOR_ACCESS_OBJECT['bar_input_base'] = document.getElementById("bar_input_base")
		SELECTOR_ACCESS_OBJECT['bar_base'] = document.getElementById("bar_base")
		finished = false
		document.getElementById("speed").textContent = movieSpeedController.speed.toFixed(2)+"倍速"
		checkbox_effect_play()
		line.updateLineView()
		playarea_save = document.getElementsByClassName("playarea")[0].cloneNode(true);

		if(document.getElementById("song_reset") != null){
			retry.addEvent()
			movieSpeedController.addDynamicSpeedChangeEvent()
			document.getElementById("more_shortcutkey").addEventListener("click",view_shortcut_key)
		}

		if(SELECTOR_ACCESS_OBJECT['flick-input']){
			SELECTOR_ACCESS_OBJECT['flick-input'] = document.getElementById("flick-input")
			document.getElementById("kashi_area").addEventListener("click",play_focus,true)
			SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener("focusout",flick_blur_notification)
			SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener("focus",flick_focus)
			SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener("change",settimeout_delete_flick_form)
			SELECTOR_ACCESS_OBJECT['flick-input-second'] = document.getElementById("flick-input-second")
			SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener("focusout",flick_blur_notification)
			SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener("focus",flick_focus)
			SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener("change",settimeout_delete_flick_form)
			SELECTOR_ACCESS_OBJECT['flick-score-value'] = document.getElementById("flick-score-value")
			SELECTOR_ACCESS_OBJECT['flick-miss-value'] = document.getElementById("flick-miss-value")
			SELECTOR_ACCESS_OBJECT['flick-lost-value'] = document.getElementById("flick-lost-value")
		}

		if(!RTC_Switch && OPTION_ACCESS_OBJECT['play-scroll']){
			scrollPlayArea()
		}

	}


	finishedRetryMovie(event){

		if(SELECTOR_ACCESS_OBJECT['flick-input']){
			inputModeManager.kanaMode=true
		}

		const RETRY_TRIGGER = (event.type == "click" && (/btn_replay/.test(event.target.src) || event.target.id == 'movie_cover') || event.key=="F4")

		if(RETRY_TRIGGER && (document.activeElement.tagName != "INPUT" && play_mode == "normal" || play_mode == "practice")){

			if(play_mode == 'normal'){
				this.reset()
			}else{
				this.practiceModeReset()
			}

			window.removeEventListener('keydown',this.finishedEvent);
			addStartLine()
			player.playVideo();
			event.preventDefault();

		}else if(play_mode == "normal" && event.key=="F7" && document.activeElement.tagName != "INPUT"){
			practiceMode.move_practice_mode()
			event.preventDefault();
		}else if(event.key=="F3" || event.key=="F7"){
			event.returnValue = false;
			event.preventDefault();
		}

	}

}





/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@入力判定 ここから---
*/
function key_device_disabled(event){
	const tagname = document.activeElement.id == "flick-input" ? true : document.activeElement.tagName
	typingShortcutKeys.shortcuts(tagname);
}

function settimeout_delete_flick_form(event){
	dakuHandakuRedoNextChar()

	event.target.value = ""
	keyDown.flickInputMaxValue = ""
}

function flick_blur_notification(event){
	if(player.getPlayerState() == 1){
		document.getElementsByTagName("header")[0].style.display = ""
		document.getElementById("tap_here").style.display = "block"
		document.getElementById("tap_here").style.opacity = "1"
	}

	dakuHandakuRedoNextChar()

}

function dakuHandakuRedoNextChar(){

	if(SELECTOR_ACCESS_OBJECT['flick-input'] && keyDown.nextChar[0] && (keyDown.nextChar[0][0] == "゛" || keyDown.nextChar[0][0] == "゜")){

		if(dakuKanaList.includes(keyDown.nextChar.slice(-1)[0]) || handakuKanaList.includes(keyDown.nextChar.slice(-1)[0]) ){

			if(keyDown.nextChar.slice(-1)[0].normalize('NFD')[0]){
				keyDown.nextChar[0] = keyDown.nextChar.slice(-1)[0]+keyDown.nextChar[0].slice(1)
				keyDown.nextChar.pop()
				typingCounter.typeCount--
				typingWordRenderer.update('kanaUpdate')
			}

		}else if(typingWordRenderer.alreadyInputKana[typingWordRenderer.alreadyInputKana.length-1]){
			keyDown.redoFlickAlreadyInput()
		}

	}

}

function flick_focus(event){
	document.getElementsByTagName("header")[0].style.display = "none"
	document.getElementById("tap_here").style.display = "none"
	event.target.setSelectionRange(event.target.value.length, event.target.value.length);

}



const keyboardCodes = ["Space","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0","Minus","Equal","IntlYen","BracketLeft","BracketRight","Semicolon","Quote","Backslash","Backquote","IntlBackslash","Comma","Period","Slash","IntlRo"]//keyboardCodes.includes(event.code)
const tenkeyCodes = ["Numpad1","Numpad2","Numpad3","Numpad4","Numpad5","Numpad6","Numpad7","Numpad8","Numpad9","Numpad0","NumpadDivide","NumpadMultiply","NumpadSubtract","NumpadAdd","NumpadDecimal"]//tenkeyCodes.includes(event.code)
const keyboardCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "~", "&", "%", "!", "?", "@", "#", "$", "(", ")", "|", "{", "}", "`", "*", "+", ":", ";", "_", "<", ">", "=", "^"]
const disableKeys = ["Home","End","PageUp","PageDown","CapsLock","Backquote","Tab","F3","Backspace"]

const dakuKanaList = ["ゔ","が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ"];
const handakuKanaList = ["ぱ","ぴ","ぷ","ぺ","ぽ"];
const yoonFlickList = ["ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","っ","ゎ"]
const yoonFlickListLarge = ["あ","い","う","え","お","や","ゆ","よ","つ","わ"]
const smallKanaList = ["っ","ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","ゎ","ヵ","ヶ","ん"]
const OptimisationWhiteList = ["っっ","っん","っい","っう"]

const kana_mode_convert_rule_before = ["←", "↓", "↑", "→", "『", "』"]
const kana_mode_convert_rule_after = ["ひだり", "した", "うえ", "みぎ", "「", "」"]
let kanaKeyMap = {
	"0": ["わ"],
	"1": ["ぬ"],
	"!":["ぬ"],
	"2": ["ふ"],
	"3": ["あ"],
	"4": ["う"],
	"5": ["え"],
	"6": ["お"],
	"7": ["や"],
	"8": ["ゆ"],
	"9": ["よ"],
	"-": ["ほ","-"],
	"q": ["た"],
	"Q": ["た"],
	"w": ["て"],
	"W": ["て"],
	"e": ["い"],
	"E": ["い"],
	"r": ["す"],
	"R": ["す"],
	"t": ["か"],
	"T": ["か"],
	"y": ["ん"],
	"Y": ["ん"],
	"u": ["な"],
	"U": ["な"],
	"i": ["に"],
	"I": ["に"],
	"o": ["ら"],
	"O": ["ら"],
	"p": ["せ"],
	"P": ["せ"],
	"a": ["ち"],
	"A": ["ち"],
	"s": ["と"],
	"S": ["と"],
	"d": ["し"],
	"D": ["し"],
	"f": ["は"],
	"F": ["は"],
	"g": ["き"],
	"G": ["き"],
	"h": ["く"],
	"H": ["く"],
	"j": ["ま"],
	"J": ["ま"],
	"k": ["の"],
	"K": ["の"],
	"l": ["り"],
	"L": ["り"],
	"z": ["つ"],
	"Z": ["つ"],
	"x": ["さ"],
	"X": ["さ"],
	"c": ["そ"],
	"C": ["そ"],
	"v": ["ひ"],
	"V": ["ひ"],
	"b": ["こ"],
	"B": ["こ"],
	"n": ["み"],
	"N": ["み"],
	"m": ["も"],
	"M": ["も"],
	",": ["ね",","],
	"<": ["、"],
	".": ["る","."],
	">": ["。"],
	"/": ["め","/"],
	"?": ["・"],
	"#": ["ぁ"],
	"$": ["ぅ"],
	"%": ["ぇ"],
	"'": ["ゃ","’","'"],
	"^": ["へ"],
	"~": ["へ"],
	"&": ["ぉ"],
	"(": ["ゅ"],
	")": ["ょ"],
	"|": ["ー"],
	"_": ["ろ"],
	"=": ["ほ"],
	"+": ["れ"],
	";": ["れ"],
	'"': ["ふ","”","“","\""],
	"@": ["゛"],
	"`": ["゛"],
	"[": ["゜"],
	"]": ["む"],
	"{": ["「"],
	"}": ["」"],
	":": ["け"],
	"*": ["け"]
}
let kanaCodeKeyMap = {
	"IntlYen":["ー","￥","\\"],
	"IntlRo":["ろ","￥","\\"],
	"Space":[" "],
	"Numpad1":[],
	"Numpad2":[],
	"Numpad3":[],
	"Numpad4":[],
	"Numpad5":[],
	"Numpad6":[],
	"Numpad7":[],
	"Numpad8":[],
	"Numpad9":[],
	"Numpad0":[],
	"NumpadDivide":[],
	"NumpadMultiply":[],
	"NumpadSubtract":[],
	"NumpadAdd":[],
	"NumpadDecimal":[]
}


let keyDown
class KeyDown {

	constructor(){
		this.lineTypingLog = []
		this.flickInputMaxValue = 0
		this.continuousSokuonFlag = false
		this.sokuonChain = ''
		this.nFlag = false
		this.dakuKanaFlag = false
		this.kanaKeyObjects = 0
		this.tsuFlag = false
		this.nextChar = []
		this.nextPoint = 0

		typingShortcutKeys = new TypingShortcutKeys()
		typingCounter = new TypingCounter()
		typingWordRenderer = new TypingWordRenderer()

		if(keyDown){
			keyDown.removeEvent()
		}

		this.addEvent()
	}

	addEvent(){
		this.Event = this.handleKeyDown.bind(this)

		if(SELECTOR_ACCESS_OBJECT['flick-input']){
			SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener('input',this.Event);
			SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener('input',this.Event);
		}else{
            //useCapture(第3引数)をtrueにする必要あり(スペースキーのスクロールが無効にならないため)
			window.addEventListener('keydown',this.Event,true);
		}
	}

	removeEvent(){
		if(SELECTOR_ACCESS_OBJECT['flick-input']){
			SELECTOR_ACCESS_OBJECT['flick-input'].removeEventListener('input',this.Event);
			SELECTOR_ACCESS_OBJECT['flick-input-second'].removeEventListener('input',this.Event);
		}else{
            //useCapture(第3引数)をtrueにする必要あり(スペースキーのスクロールが無効にならないため)
			window.removeEventListener('keydown',this.Event,true);
		}
	}

	createKanaInputChar(){
		this.inputChar = kanaCodeKeyMap[event.code] ? kanaCodeKeyMap[event.code] : kanaKeyMap[event.key];
		if(event.shiftKey){
			if(event.code == "KeyE"){this.inputChar[0] = "ぃ";}
			if(event.code == "KeyZ"){this.inputChar[0] = "っ";}

			//ATOK入力 https://support.justsystems.com/faq/1032/app/servlet/qadoc?QID=024273
			if(event.code == "KeyV"){this.inputChar.push("ゐ","ヰ")}
			if(event.code == "Equal"){this.inputChar.push("ゑ","ヱ")}
			if(event.code == "KeyT"){this.inputChar.push("ヵ")}
			if(event.code == "Quote"){this.inputChar.push("ヶ")}
			if(event.code == "KeyF"){this.inputChar.push("ゎ")}
			if(event.key == "0"){this.inputChar = ["を"];}
		}
		if(keyboardCharacters.includes(event.key)){
			!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? this.inputChar.push(event.key.toLowerCase() , event.key.toLowerCase().replace(event.key.toLowerCase(), function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);})) : c.push(event.key , event.key.replace(event.key, function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);}))
		}

	}

	createFlickInputChar(){
		if(this.flickInputMaxValue == event.target.value){
			return;
		}

		if(this.flickInputMaxValue.length > event.target.value.length){
			this.flickInputMaxValue = event.target.value

			dakuHandakuRedoNextChar()
			return;
		}


		this.flickInputMaxValue = event.target.value
		this.inputChar = [this.flickChar]

		if(this.inputChar[0] == "~" || this.inputChar[0] == "～"){
			this.inputChar = ["~","～"]
		}
		if(this.inputChar[0] == "\\" || this.inputChar[0] == "￥"){
			this.inputChar = ["\\","￥"]
		}
		if(this.inputChar[0] == "　"){
			this.inputChar = [" "]
		}
		if(this.inputChar[0] == "！" || this.inputChar[0] == "!"){
			this.inputChar = ["!","！"]
		}
		if(this.inputChar[0] == "？" || this.inputChar[0] == "?"){
			this.inputChar = ["?","？"]
		}
		if(this.nextChar[0][0] == "゛" && dakuKanaList.includes(this.inputChar[0]) || this.nextChar[0][0] == "゜" && handakuKanaList.includes(this.inputChar[0])){
			if(this.inputChar[0].normalize('NFD')[0] == typingWordRenderer.alreadyInputKana.slice(-1)|| this.inputChar[0] == this.nextChar.slice(-1)[0]){
				this.inputChar = [this.nextChar[0][0]]
			}
		}
		const zenkaku = keyboardCharacters.indexOf(this.inputChar[0])

		if(zenkaku > -1){
			this.inputChar.push(this.inputChar[0].replace(this.inputChar[0], function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0)}));
		}else if(this.inputChar[0] == "\\"){
			this.inputChar.push("￥")
		}else if(this.inputChar[0] == "\""){
			this.inputChar.push("“","”")
		}else if(this.inputChar[0] == "'"){
			this.inputChar.push("’")
		}

	}

	handleKeyDown(event){
		this.inputChar = null
		this.flickChar = event.type == "input" && event.data != null ? event.data.slice(0.-1) : false

		//Check
		const replayFlag = (!OPTION_ACCESS_OBJECT['replay-mode'] || OPTION_ACCESS_OBJECT['replay-mode'] && line.count && !line_typinglog_log[line.count-1][push_counter]) ? true : false
		const focusCheck = event.type == "input" || document.activeElement.type == "range" || document.activeElement.tagName != 'INPUT' || document.activeElement.className != "caret" ? true : false
		const charKeyCheck = this.flickChar !== false || ((event.keyCode >= 65 && event.keyCode <= 90) || keyboardCodes.includes(event.code) || tenkeyCodes.includes(event.code)) && event.key != "Process" ? true : false


		if(replayFlag && charKeyCheck && focusCheck  && this.nextChar[0]){

			tick.headTime = player.getCurrentTime() + player.difftime;
			tick.updateLineTime()

			if(inputModeManager.kanaMode){

				this.daku = dakuKanaList.includes(this.nextChar[0][0]) ? dakuKanaList[dakuKanaList.indexOf(this.nextChar[0][0])] : false
				this.handaku = handakuKanaList.includes(this.nextChar[0][0]) ? handakuKanaList[handakuKanaList.indexOf(this.nextChar[0][0])] : false

				if(event.type == "keydown"){
					this.createKanaInputChar()
				}else{
					this.createFlickInputChar()
				}

				if(this.checkNextKana()){
					typingWordRenderer.update('kanaUpdate')

					if(this.daku || this.handaku){
						this.inputChar = this.daku ? this.daku.normalize('NFD')[0] : this.handaku.normalize('NFD')[0]
					}else{
						this.inputChar = this.inputChar[this.kanaKeyObjects]
					}

					this.continuousSokuonFlag = false // ローマ字モードの「っ」連鎖判定
					typingCounter.addTypingCount(this.inputChar);
					typingCounter.typeEffect();

				}else if(!typingCounter.completed) {

					//フリック入力モードで小文字を入力する際の大文字ひらがな入力はミスにしない。
					if(this.flickChar && yoonFlickList.includes(this.nextChar[0][0]) && yoonFlickListLarge.indexOf(this.inputChar[0]) == yoonFlickList.indexOf(this.nextChar[0][0]) ){return;}

					//already_input.length != 0 || dakuKanaList.includes(this.nextChar.slice(-1)[0]) || handakuKanaList.includes(this.nextChar.slice(-1)[0])
					if(typingWordRenderer.alreadyInputKana.length != 0) {
						dakuHandakuRedoNextChar()
						const checkKanaChar = (!this.flickChar && /[!-~]/.test(this.nextChar[0]))
						typingCounter.typingLog.push([tick.headTime, (checkKanaChar ? event.key : this.inputChar[0]), Math.round(typingCounter.score-parseLyric.scoreParChar/4), line.count, 0, 0]);
						typingCounter.lineTypingLog.push([(checkKanaChar ? event.key : this.inputChar[0]) , 0 , tick.headTime, inputModeManager.kanaMode]);
						typingCounter.addMissCount();
					}

					typingCounter.missEffect();

					if(perfect_mode_judge(true)){return;}

				}


			}else{


				this.inputChar = OPTION_ACCESS_OBJECT['case-sensitive-mode'] && keyboardCharacters.includes(this.nextChar[0]) ? event.key : (event.key).toLowerCase()


				if(this.checkNextChar(this.zCommand(event.code,event.shiftKey))){
					typingCounter.addTypingCount(this.inputChar);

					typingCounter.typeEffect();

				}else if(!typingCounter.completed) {


					if(typingWordRenderer.alreadyInputRoma.length != 0) {
						typingCounter.addMissCount();
						typingCounter.typingLog.push([tick.headTime, this.inputChar, Math.round(typingCounter.score), line.count,0,0]);
						typingCounter.lineTypingLog.push([this.inputChar , 0 , tick.headTime, inputModeManager.kanaMode]);
					}

					typingCounter.missEffect();
					if(perfect_mode_judge(true)){return;}
				}


			}

			if(event.type == "keydown" && !(event.ctrlKey && event.code == "KeyC")){
				event.preventDefault()
            }

        }

        if(focusCheck && event.type == "keydown"){
            typingShortcutKeys.shortcuts();
        }

	}

	redoFlickAlreadyInput(){
		this.nextChar[0] = typingWordRenderer.alreadyInputKana.slice(-1)+this.nextChar[0]
		typingWordRenderer.alreadyInputKana = typingWordRenderer.alreadyInputKana.slice(0,-1)
		typingCounter.typeCount--
		typingWordRenderer.update('kanaUpdate')
	}


	checkNextKana(){
		let yoon = ""

		this.kanaKeyObjects = [].indexOf.call(this.inputChar, !OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? this.nextChar[0].slice(0,1).toLowerCase(): this.nextChar[0].slice(0,1))

		if(this.nextChar[0].length >= 2 && (this.daku || this.handaku)){
			yoon = this.nextChar[0][1]
		}

		if(this.dakuKanaFlag && this.inputChar[this.kanaKeyObjects] && (this.nextChar[0][0] == "゛" || this.nextChar[0][0] == "゜")){
			typingCounter.kanaCombo --
			this.dakuKanaFlag = false
		}

		if(this.flickChar){
			if(OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] && this.inputChar[0] && this.nextChar[0].length >= 2){
				const boin = (dakuKanaList.includes(this.inputChar[0]) || handakuKanaList.includes(this.inputChar[0])) ? this.inputChar[0] : false
				if(boin && this.nextChar[0][0] == boin.normalize('NFD')[0] && ( (this.nextChar[0][1] == "゛" && dakuKanaList.includes(this.inputChar[0])) || (this.nextChar[0][1] == "゜" || handakuKanaList.includes(this.inputChar[0])) ) ){
					this.addNextChar(true)
					return true
				}
			}
		}

		//return trueは正解　return falseは不正解。
		if(this.daku && this.inputChar.includes(this.daku.normalize('NFD')[0])) {
			this.nextChar = ["゛"+yoon, ...this.nextChar.slice(1),this.daku];
			typingCounter.kanaCombo ++
			this.dakuKanaFlag = true
			return true;
		}else if (this.handaku && this.inputChar.includes(this.handaku.normalize('NFD')[0])) {
			this.nextChar = ["゜"+yoon, ...this.nextChar.slice(1),this.handaku];
			typingCounter.kanaCombo ++
			this.dakuKanaFlag = true
			return true;
		}else if(this.kanaKeyObjects > -1) {
			if(this.nextChar[0].length >= 2 && this.nextChar[0][1] != " "){
				this.romaDistinguish()
			}else{
				this.addNextChar(true)
			}
			return true
		}


		return false;
	}

	checkNextChar(z_command){
		let flag = false;
		let next_char_roma = this.nextChar.slice(1)
		let kana_update_flag = z_command ? 'kanaUpdate' : false
		let space_disable_space = ""
		//入力したキー == 打鍵パターン1文字目  確認
		for (let i=0; i<next_char_roma.length; i++){
			if(this.inputChar == next_char_roma[i][0]){
				flag = true;
				break;
			}
		}


		if(this.continuousSokuonFlag && this.inputChar == "t"){
			this.continuousSokuonAdjust(this.inputChar)

		}else if(this.tsuFlag && this.inputChar == "s"){
			typingWordRenderer.alreadyInputRoma += this.inputChar
			typingWordRenderer.update(kana_update_flag)
			return true;

		}else if(this.nFlag && (line.lineInputKana[0][0] == "う" && this.inputChar == "w" || line.lineInputKana[0][0] == "ん" && this.inputChar == "x")){
			this.addNextChar(true)
			typingWordRenderer.update('kanaUpdate')

		}else if(this.nextChar[0] == "..." && this.inputChar == ","){

			this.nextChar = ["..", ","]
			this.nextPoint = 2 * parseLyric.scoreParChar
			line.lineInput.unshift(".")
			line.lineInputRoma.unshift(".")
			line.lineInputKana.unshift(".")

		}else if(!flag){
			return false;
		}

		this.continuousSokuonFlag = false
		this.nFlag = false

		//xnで「ん」を入力する場合は[nn]のパターンを削除
		//nnの入力中にwu,whuの判定を追加。
		if(this.nextChar[0]=='ん'){
			if(this.inputChar == 'x' && line.lineInputRoma[0] && (line.lineInputRoma[0][0] != 'n' && line.lineInputRoma[0][0] != 'N')){
				line.lineInput[0] = line.lineInput[0].filter(function(value) { return value.match(/^(?!(n)).*$/)})
			}else if(line.lineInputKana[0] && (line.lineInputKana[0][0] == "う" || line.lineInputKana[0][0] == "ん") && this.inputChar == 'n' && this.nextChar[1] == 'nn'){
				this.nFlag = true
			}
		}

		//打ってない方のパターン削除
		if(this.nextChar.length >= 3){

			//拗音・促音クリア判定
			//先頭の文字(現在入力してるモノ)を削除
			for (let j=0; j<this.nextChar.length; j++){
				if(j > 0){
					if(this.inputChar == this.nextChar[j][0]){
						this.nextChar[j] = this.nextChar[j].slice(1);
					}else{
						//入力したキーから始まる打鍵パターン以外を削除
						this.nextChar.splice( j, 1 );
						j--
					}
				}
			}
		}else{
			this.nextChar[1] = this.nextChar[1].slice(1)
		}


		if(this.nextChar[0].length >= 2){

			if(this.nextChar[0][0] != 'っ' && (this.nextChar[1][0] == 'x' || this.nextChar[1][0] == 'l') || this.nextChar[0][0] == 'っ' && (this.inputChar == 'u' || this.nextChar[1][0] == this.inputChar)){

				if(this.nextChar[0][0] == 'っ' && this.nextChar[0][1] == 'っ' && (this.nextChar[1][0] == 'x' || this.nextChar[1][0] == 'l') && (this.inputChar == "x"|| this.inputChar == "l")){
					this.continuousSokuonFlag = true
				}

				this.romaDistinguish()
				kana_update_flag = 'kanaUpdate'

				if(this.nextChar[0][0] == 'っ' && this.inputChar == 'u'){
					this.tsuFlag = false
				}

			}

		}


		space_disable_space = !parseLyric.spaceDisable && this.nextChar[0][this.nextChar[0].length-1] == " " ? " " : ""
		typingWordRenderer.alreadyInputRoma += this.inputChar + space_disable_space;

		if(!this.nextChar[1]) {
			this.addNextChar(true)
			kana_update_flag = true
		}

		typingWordRenderer.update(kana_update_flag)

		return true;
	}


	continuousSokuonAdjust(){

		const SOKUON_TIMES = ( this.sokuonChain[0].match( /っ/g ) || [] ).length-( this.nextChar[0].match( /っ/g ) || [] ).length

		if(this.continuousSokuonFlag){
			this.nextChar[0] = typingWordRenderer.alreadyInputKana.slice(-1)+this.nextChar[0]
			typingWordRenderer.alreadyInputKana = typingWordRenderer.alreadyInputKana.slice(0,-1)
			this.tsuFlag = true
		}

		for(let h=1;h<this.sokuonChain.length;h++){
			this.nextChar[h] = (this.continuousSokuonFlag?"tu":"") + this.sokuonChain[h].slice(SOKUON_TIMES)
		}

		if(this.continuousSokuonFlag){
			typingWordRenderer.update('kanaUpdate')
		}

	}

	zCommand(pushkey,shiftkey){
		if(pushkey == "KeyZ" && !shiftkey){
			if(this.nextChar[0] == "." && line.lineInputKana[0] == "."){
				if(line.lineInputKana[1] == "."){
					this.nextChar = ["...", this.inputChar + "."]
					this.nextPoint = 3 * parseLyric.scoreParChar
					line.lineInput.splice(0, 2)
					line.lineInputRoma.splice(0, 2)
					line.lineInputKana.splice(0, 2)
				}else{
					this.nextChar = ["..", this.inputChar + ","]
					this.nextPoint = 2 * parseLyric.scoreParChar
					line.lineInput.splice(0, 1)
					line.lineInputRoma.splice(0, 1)
					line.lineInputKana.splice(0, 1)
				}
				return true
			}else if(this.nextChar[0] == "～" && this.nextChar[1] != "-"){
				this.nextChar[1] = this.inputChar + "-"
			}
		}
	}

	romaDistinguish(){
		typingWordRenderer.alreadyInputKana += inputModeManager.kanaMode && !OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] && ["゛", "゜"].includes(this.nextChar[0][0]) ? this.nextChar[this.nextChar.length-1] : this.nextChar[0].slice( 0, 1 )
		this.nextChar[0] = this.nextChar[0].slice(1)
	}

	addNextChar(flag){

		if(flag){
			typingWordRenderer.alreadyInputKana += inputModeManager.kanaMode && !OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] && ["゛", "゜"].includes(this.nextChar[0]) ? this.nextChar[this.nextChar.length-1] : this.nextChar[0];

			//スコア加算
			typingCounter.lineScore += this.nextPoint;

			if(line_score_log[line.count-1][0] < typingCounter.lineScore){
				typingCounter.score += this.nextPoint;
				statusRenderer.statusCountsUpdate(["Score"])

			}
		}

		if(inputModeManager.kanaMode && flag && this.nextChar.length >= 2 && this.nextChar[0].length == 1){
			typingWordRenderer.alreadyInputRoma += this.nextChar[1];
			line.lineInputRoma.shift(1)
		}else if(!inputModeManager.kanaMode || !flag){
			line.lineInputRoma.shift(1)
		}

		this.sokuonChain = ""
		this.nextChar = !line.lineInput[0] ? ["",""] : [line.lineInputKana.shift(1), ...line.lineInput.shift(1)]

		if(this.nextChar[0][0] == "っ" && this.nextChar[0][1] == "っ"){
			this.sokuonChain = this.nextChar.concat()
		}

		if(OPTION_ACCESS_OBJECT['case-sensitive-mode'] && this.nextChar[0] == this.nextChar[1].toUpperCase()){
			this.nextChar[1] = this.nextChar[1].toUpperCase()
		}

		if(!this.nextChar[0]) {
			typingCounter.lineComplete()
		}else{
			this.nextPoint = this.nextChar[1].length * parseLyric.scoreParChar

			if(!inputModeManager.kanaMode){
				this.optimizeKeystrokePattern()
			}
		}

	}


	//打鍵パターンを最適化
	optimizeKeystrokePattern(){
		//ひらがな2文字の周りくどい入力方法ltuta,xtufu,silya,ltuteleなどを入力できなくする機能
		if(OPTION_ACCESS_OBJECT['sokuon-yoon-disable'] && keyDown.nextChar[0].length >= 2 && keyDown.nextChar.length >= 4){

			const next_char_before = keyDown.nextChar[0][keyDown.nextChar[0].length-2]
			const next_char_last = keyDown.nextChar[0][keyDown.nextChar[0].length-1]

			if( !(smallKanaList.includes(next_char_before) && smallKanaList.includes(next_char_last)) ){
				keyDown.nextChar = keyDown.nextChar.filter(function(value) { return value.match(/^(?!.*(x|l)).*$/)})
			}else if(!OptimisationWhiteList.includes(next_char_before+next_char_last)){
				keyDown.nextChar = keyDown.nextChar.filter(function(value) { return value.match(/^(?!.*(tu|tsu)).*$/)})
			}

		}

	}


}



let typingShortcutKeys
class TypingShortcutKeys {

	constructor(){


	}

	shortcuts(){

		switch(event.key){

			case "ArrowDown":

				if(OPTION_ACCESS_OBJECT['disable-up-down-shortcut']){
					event.preventDefault();
					return;
				}

				this.changeVolume(-10)
				event.preventDefault();
				break;

			case "ArrowUp":

				if(OPTION_ACCESS_OBJECT['disable-up-down-shortcut']){
					event.preventDefault();
					return;
				}

				this.changeVolume(10)
				event.preventDefault();
				break;

			case "ArrowLeft" :

				if(!event.altKey){

					if(play_mode == "practice" && event.ctrlKey && !event.shiftKey) {
						this.arrowLeftPracticeMode()
					}else{

						if(OPTION_ACCESS_OBJECT['disable-left-right-shortcut']){
							event.preventDefault();
							return;
						}

						if(event.ctrlKey && event.shiftKey){
							this.changeDiffTime(-0.01)
						}else{
							this.changeDiffTime(-0.1)
						}

					}

				}
				event.preventDefault();
				break;

			case "ArrowRight":

				if(!event.altKey){

					if(play_mode == "practice" && event.ctrlKey  && !event.shiftKey){
						this.arrowRightPracticeMode()
					}else{

						if(OPTION_ACCESS_OBJECT['disable-left-right-shortcut']){
							event.preventDefault();
							return;
						}

						if(event.ctrlKey && event.shiftKey){
							this.changeDiffTime(0.01)
						}else{
							this.changeDiffTime(0.1)
						}
					}
				}

				event.preventDefault();
				break;

			case "F4": //F4でやり直し

				if(!RTC_Switch || Object.keys(Players_ID).length == 1){

					if(play_mode == 'normal'){
						retry.reset()
					}else{
						retry.practiceModeReset()
					}

				}

				event.preventDefault();
				break;

			case "F7": //F7で練習モードに切り替え

				if(play_mode == "normal"){

					if(!RTC_Switch || Object.keys(Players_ID).length == 1){
						practiceMode.move_practice_mode()
					}

				}
				event.preventDefault();
				break;
			case "F9": //F9で低速(練習モード)

				if(play_mode=="practice"){
					movieSpeedController.setDownPlaySpeed()
					replace_complete_area("x"+movieSpeedController.speed.toFixed(2))
				}

				event.preventDefault();
				break;
			case "F10" ://F10で倍速

				if(play_mode=="normal"){

					if(!RTC_Switch || Object.keys(Players_ID).length == 1){
						movieSpeedController.setDynamicSpeed();
					}

				}else{
					movieSpeedController.setUpPlaySpeed()
					replace_complete_area("x"+movieSpeedController.speed.toFixed(2))
				}

				event.preventDefault();
				break;

			case "F1" : //対戦のランキング表示方法変更

				if(RTC_Switch){
					changeBattleContainer()
				}

				event.preventDefault();
				break;

			case "Escape" : //Escでポーズ

				if(!RTC_Switch || Object.keys(Players_ID).length == 1){
					player.pauseVideo()
				}
				event.preventDefault();
				break;

			case "KanaMode" :
			case "Romaji" :

				if(keyboard != "mac" && !OPTION_ACCESS_OBJECT['disable-change-mode']){
					this.changeInputMode()
					event.preventDefault();
					break;
				}

			case "Backspace" :

				if(play_mode == "practice" && document.activeElement.tagName != "INPUT" && practiceMode.setSeekTime){
					practiceMode.seek_practice_line(practiceMode.setSeekTime,practiceMode.setLineCount);
					practiceMode.isLineRetry = true
					event.preventDefault();
				}

				break;
		}

		//間奏スキップ
		if(event.code == timeSkip.skipCode || SELECTOR_ACCESS_OBJECT['skip-guide'].textContent.includes("Tap")){
			timeSkip.triggerSkip()

			if(typing_play_mode != 'flick'){
				event.preventDefault();
			}

		}

		if(event.altKey && (event.key == "ArrowLeft" || event.key == "ArrowRight")) {
			//Alt + Leftキーは使えるようにする(ブラウザの戻るショートカットキー)
			return;
		}else if(disableKeys.includes(event.code) || (event.altKey || (event.code=="Space" && typing_play_mode != 'flick') || window.navigator.userAgent.indexOf('Firefox') != -1 && (event.key=="'" || event.key=="/")) ) {
			event.preventDefault();
			return;
		}
	}

	changeVolume(diff){
		volume = player.getVolume();
		volume += diff;

		if(volume < 0) {
			volume = 0;
		}else if(volume > 100) {
			volume = 100;
		}

		player.setVolume(volume);
		localStorage.setItem('volume_storage', volume);
		document.getElementById("volume").textContent = volume;
		document.getElementById("volume_control").value = volume

		replace_complete_area("音量: "+volume+"%")
	}

	changeDiffTime(diff){
		player.difftime += diff

		if(player.difftime < -4.0){
			player.difftime = -4.0;
		}else if(player.difftime > 4.0){
			player.difftime = 4.0;
		}

		player.difftime = Math.round(player.difftime * 100)/100
		document.getElementById("time_diff").textContent = player.difftime.toFixed(2);
		replace_complete_area(`時間調整　`+player.difftime.toFixed(2))
	}


	arrowLeftPracticeMode(){
		let n = practiceMode.setLineCount != line.count ? -1 : 0
		let clone

		while ( document.querySelector('[number="'+(line.count+n)+'"]') == null && (line.count+n) >= parseLyric.startLine) {n--;}

		if(line.count < parseLyric.startLine){return;}

		if(line.count > parseLyric.startLine){
			const jumpNumber = document.querySelector('[number="'+(line.count+n)+'"]')
			practiceMode.setSeekTime = jumpNumber.getAttribute('value')-1
			practiceMode.setLineCount = Number(jumpNumber.getAttribute('number'))-1
			clone = jumpNumber.cloneNode(true)
		}else{
			const FirstLine = document.querySelector("#line-list [number]")
			practiceMode.setSeekTime = FirstLine.getAttribute('value')-1
			practiceMode.setLineCount = Number(FirstLine.getAttribute('number')) - (parseLyric.startLine-1?1:0)
			clone = FirstLine.cloneNode(true)
		}

		createjs.Ticker.removeAllEventListeners('tick');
		replace_complete_area("◁")
		practiceMode.seek_line_set(clone)
		line.updateLineView()
		getLyricsCount(practiceMode.setSeekTime, 0)
		practiceMode.seek_practice_line(lyrics_array[line.count+1][0]-1,line.count)
	}


	arrowRightPracticeMode(){
		let n = practiceMode.setLineCount != line.count ? 1 : 2

		if(line.count - practiceMode.setLineCount > 1){
			n--
		}

		if(practiceMode.setLineCount > 0 && (line.count+1) - practiceMode.setLineCount <= 1 && lyrics_array[practiceMode.setLineCount+1][0] - lyrics_array[practiceMode.setLineCount][0] <= 1){
			n += 2
		}

		while ( document.querySelector('[number="'+(line.count+n)+'"]') == null && lyrics_array.length-1 > (line.count+n)) {n++;}
		if(lyrics_array.length-2 < (line.count+n)){return;}
		let clone
		const jumpNumber = document.querySelector('[number="'+(line.count+n)+'"]')
		practiceMode.setSeekTime = jumpNumber.getAttribute('value')-1
		practiceMode.setLineCount = Number(jumpNumber.getAttribute('number'))-1
		clone = document.querySelector('[number="'+(practiceMode.setLineCount+1)+'"]').cloneNode(true)


		createjs.Ticker.removeAllEventListeners('tick');
		replace_complete_area("▷")
		practiceMode.seek_line_set(clone)
		getLyricsCount(practiceMode.setSeekTime , practiceMode.setLineCount == line.count-1 ? "":-1)
		practiceMode.seek_practice_line(lyrics_array[line.count+1][0]-1,line.count)
	}


	changeInputMode(){

		if(inputModeManager.kanaMode){
			inputModeManager.kanaMode = false

			kanaModeConfig.style.display = "none"

			if(keyDown.nextChar[0]){

				if(OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode']){
					line.lineInputKana = daku_handaku_join(true,false,line.lineInputKana)
				}else if(keyDown.nextChar[0] == "゜" || keyDown.nextChar[0] == "゛"){
					keyDown.nextChar[0] = keyDown.nextChar[keyDown.nextChar.length-1]
				}

				if(!keyDown.sokuonChain){

					for (let i=0; i<romaMap.length; i++){

						if(keyDown.nextChar[0] == romaMap[i][0]){
							keyDown.nextChar = [romaMap[i][0],...romaMap[i].slice(1)]
						}

					}

				}else{
					continuous_xtu_adjust()
				}

			}

			if(document.querySelector("[name=mode_select]:checked").value == "roma_type" || selected_play_mode == "roma" || document.getElementsByName('from-kana-mode-change')[0].selectedOptions[0].value == "from-roma-display"){
				mode = "roma"
			}

			replace_complete_area("Romaji")
		}else{

			inputModeManager.kanaMode = true
			kanaModeConfig.style.display = "block"

			const next_char_convert_target = kana_mode_convert_rule_before.indexOf(keyDown.nextChar[0])

			if(next_char_convert_target >= 0){
				keyDown.nextChar[0] = kana_mode_convert_rule_after[next_char_convert_target]
			}

			if(/←|↓|↑|→|『|』/.test(line.lineInputKana.join(""))){

				for(h=0;h<line.lineInputKana.length;h++){
					const convert_target = kana_mode_convert_rule_before.indexOf(line.lineInputKana[h])

					if(convert_target >= 0){
						line.lineInputKana[h] = kana_mode_convert_rule_after[convert_target]
					}

				}

			}

			if(keyDown.nextChar[0] && OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode']){
				line.lineInputKana = daku_handaku_join(true,false,line.lineInputKana)
			}

			if(document.querySelector("[name=mode_select]:checked").value == "roma_type" || selected_play_mode == "roma" || document.getElementsByName('from-kana-mode-change')[0].selectedOptions[0].value == "from-roma-display"){
				mode = "kana"
			}

			replace_complete_area("KanaMode")
		}

		checkbox_effect_play()
		line.updateLineView()
		//lineクリア色変更はupdateLineViewで行うと練習モードで誤作動を起こす。
		if(typingCounter.completed){
			typingCounter.lineComplete()
		}

		typingWordRenderer.update('kanaUpdate')
		line.setNextLyric(line.count-1)
		mapInfoDisplay.updateMapInfo()

		if(RTC_Switch){
			var updates = {};

			if(inputModeManager.kanaMode){
				updates['users/' + myID + '/status/InputMode'] = "かな";
			}else{
				updates['users/' + myID + '/status/InputMode'] = "ローマ字";
			}

			firebase.database().ref().update(updates);
		}
	}

}


function daku_handaku_join(next_char_flag,Calculation,join_word){
	let tagstr1 = {
		"ゔ": "う゛","が": "か゛", "ぎ": "き゛", "ぐ": "く゛", "げ": "け゛", "ご": "こ゛",
		"ざ": "さ゛", "じ": "し゛", "ず": "す゛", "ぜ": "せ゛", "ぞ": "そ゛",
		"だ": "た゛", "ぢ": "ち゛", "づ": "つ゛", "で": "て゛", "ど": "と゛",
		"ば": "は゛", "び": "ひ゛", "ぶ": "ふ゛", "べ": "へ゛", "ぼ": "ほ゛",
		"ぱ": "は゜", "ぴ": "ひ゜", "ぷ": "ふ゜", "ぺ": "へ゜", "ぽ": "ほ゜",
	};
	let tagstr2 = {}; Object.keys(tagstr1).map(function (v, index, array) { return tagstr2[tagstr1[v]] = v }); // keyとvalueを逆にする
	let s1 = "ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ";
	let s2 = "う゛|か゛|き゛|く゛|け゛|こ゛|さ゛|し゛|す゛|せ゛|そ゛|た゛|ち゛|つ゛|て゛|と゛|は゛|ひ゛|ふ゛|へ゛|ほ゛|は゜|ひ゜|ふ゜|へ゜|ほ゜";
	let reg, replacer;
	if((!inputModeManager.kanaMode || !OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode']) && !Calculation){
		function replacer2(match, index, input) { // 「か゛」 → 「が」
			return tagstr2[match]
		}
		reg = new RegExp(s2, "g"); replacer = replacer2;
		if(next_char_flag){
			keyDown.nextChar[0] = keyDown.nextChar[0].replace(reg, replacer);
		}
		for(let i=0 ; join_word.length > i ; i++){
			join_word[i] = join_word[i].replace(reg, replacer);
		}
	}else if(OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] || Calculation){
		function replacer1(match, index, input) { // 「が」 → 「か゛」
			return tagstr1[match]
		}
		reg = new RegExp(s1, "g"); replacer = replacer1;
		if(next_char_flag){
			keyDown.nextChar[0] = keyDown.nextChar[0].replace(reg, replacer);
		}
		for(let i=0 ; join_word.length > i ; i++){
			join_word[i] = join_word[i].replace(reg, replacer);
		}
	}
	return join_word;
}



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@動画スピード変更 ここから---
*/



let mapInfoDisplay
class MapInfoDisplay {

	constructor(){
		this.comboRecordTitle = `只今のTypingTube上での0miss継続打数です。\n継続ノーミスコンボがローマ字換算で700comboを超えると表示されます。\n
エスケープした文字(escカウント)は参照しません。練習モードでのミス打鍵はカウントしません。\n
継続打数の更新は曲終了時の\"Typing Result\"が表示された時に更新されます。\n\n
コンボ継続チャレンジをせずにプレイしたい時やスピード重視でプレイする時は右のチェックボックスを外してください。\n
OFFにすると継続ノーミス記録が更新されなくなり、ミスしてもノーミス記録は維持されます。\n\n`


		this.comboCheckboxTitle = `コンボ継続チャレンジをせずにプレイしたい時やスピード重視でプレイする時はこちらのチェックボックスを外してください。\n
OFFにすると継続ノーミス記録が伸びなくなり、ミスしてもノーミス記録は維持されます`


		this.pastRecordHTML = `　<span id='max_record_label'></span><span id='last_record'></span>`

		this.comboRecordText = ''
		this.maxComboRecordHTML = ''
		this.lastComboRecordHTML = ''
		this.nowComboRecordHTML = ''
		this.symbolDisableHTML = ''

		this.symbolLength = ''
		this.symbolListHTML = ''

	}

	updateMapInfo(){
		parseLyric.setTotalTIme()

		const average = inputModeManager.kanaMode ? (parseLyric.kanaMedianSpeed*movieSpeedController.speed).toFixed(2) : (parseLyric.romaMedianSpeed*movieSpeedController.speed).toFixed(2)
		const Difficult = inputModeManager.kanaMode ? (parseLyric.kanaMaxSpeed*movieSpeedController.speed).toFixed(2) : (parseLyric.romaMaxSpeed*movieSpeedController.speed).toFixed(2)
		const TOTAL_NOTES = inputModeManager.kanaMode ? parseLyric.kanaTotalNotes : parseLyric.romaTotalNotes

		this.createTemplate()

		document.querySelector("#difficult > span").innerHTML =
			`<span title="打鍵数"><i class="icon-drum-solid" style="backgroundcolor=:#441188; border-radius: 16px;"></i> ${TOTAL_NOTES}打${this.symbolLength[0] > 0 ? `<span id="symbolLength" class="hover_underline">(記号の数: ${this.symbolLengt[0]})</span>`+this.symbolListHTML : "" }</span>
		 <span title="ライン数"><i class="icon-scroll-solid" style=""></i>${parseLyric.lineLength}ライン</span><span title="長さ"><i class="far fa-clock" style=""></i>${parseLyric.movieTimeMM}:${parseLyric.movieTimeSS}</span>
		 <span title="必要入力スピード"><i class="icon-tachometer-alt-solid" style=""></i>中央値${average}打/秒 | 最高${Difficult}打/秒</span>${this.symbolDisableHTML + this.maxComboRecordHTML + this.lastComboRecordHTML + this.nowComboRecordHTML}`

		this.addMouseEvent()
	}


	addMouseEvent(){
		if(document.getElementById("combo_challenge") != null){
			document.getElementById("combo_challenge").addEventListener('click', {name:"now", data: JSON.parse(localStorage.getItem("combo_challenge_beatmap_data")), handleEvent: details_generator});
			document.getElementsByName('challenge-enable')[0].addEventListener('change', saveModOption);
		}

		if(document.getElementById("symbolLength") != null){
			document.getElementById("symbolLength").addEventListener("mouseover",function(){
				document.getElementById("SymbolList").style.display = "block";
				document.getElementById("SymbolList").parentNode.title = ""

			})
			document.getElementById("symbolLength").addEventListener("mouseout",function(){
				document.getElementById("SymbolList").style.display = "none";
				document.getElementById("SymbolList").parentNode.title = "打鍵数"
			})
		}

		if(localStorage.getItem("combo_challenge_beatmap_data_max") && localStorage.getItem("combo_challenge_beatmap_data_max") != "null"){
			document.getElementById("max_record").addEventListener('mouseover', hover_combo_record);
			document.getElementById("max_record").addEventListener('mouseout', out_combo_record);
			document.getElementById("max_record").addEventListener('click', {name:"max",data: JSON.parse(localStorage.getItem("combo_challenge_beatmap_data_max")), handleEvent: details_generator});
		}

		if(localStorage.getItem("combo_challenge_beatmap_data_last") && localStorage.getItem("combo_challenge_beatmap_data_last") != "null"){
			document.getElementById("last_record").addEventListener('mouseover', hover_combo_record);
			document.getElementById("last_record").addEventListener('mouseout', out_combo_record);
			document.getElementById("last_record").addEventListener('click', {name:"last", data:JSON.parse(localStorage.getItem("combo_challenge_beatmap_data_last")), handleEvent: details_generator});

		}
	}


	createTemplate(){


		this.comboRecordText = inputModeManager.kanaMode ? ("只今のローマ字入力モード推定ノーミス記録「"+localStorage.getItem('combo_challenge_roma')+"打鍵」"):("只今のかな入力モード推定ノーミス記録「"+localStorage.getItem('combo_challenge_kana')+"打鍵」")

		const RECORD_STARTING_COMBO = 700
		this.nowComboRecordHTML = (+localStorage.getItem('combo_challenge_roma') >= RECORD_STARTING_COMBO ? `${this.pastRecordHTML}<span title='${this.comboRecordTitle+this.comboRecordText}' class='help_pointer' id='combo_challenge'>只今の継続ノーミス記録「${(inputModeManager.kanaMode ? localStorage.getItem('combo_challenge_kana') : localStorage.getItem('combo_challenge_roma'))}打鍵, ${localStorage.getItem('combo_challenge_fullcombo')}曲目」</span><input title='${this.comboCheckboxTitle}' type='checkbox' name='challenge-enable' ${(localStorage.getItem('challenge-enable') != "false" ? "checked":"")}>　` : this.pastRecordHTML)


		if(localStorage.getItem("combo_challenge_beatmap_data_max") && localStorage.getItem("combo_challenge_beatmap_data_max") != "null"){
			this.maxComboRecordHTML = `<span class="cursor-pointer"> <i id="max_record" class="cursor-pointer icon-chess-queen-solid"></i> </span>`
		}

		if(localStorage.getItem("combo_challenge_beatmap_data_last") && localStorage.getItem("combo_challenge_beatmap_data_last") != "null"){
			this.lastComboRecordHTML = `<span id="last_record" class="cursor-pointer"> <i class="far fa-caret-square-left"></i> </span>`
		}

		this.symbolDisableHTML = document.getElementsByName('space-symbol-omit')[0].checked === true && parseLyric.abridgementWordLength > 0 ? `<span title="省略設定詳細">(省略文字数:${parseLyric.abridgementWordLength}, 最大点数:${((parseLyric.scoreParChar * ((parseLyric.romaTotalNotes+parseLyric.abridgementWordLength)-parseLyric.abridgementWordLength))/2000).toFixed(2)})</span>` : ""


		this.symbolLength = this.parseSymbolLength()

		this.symbolListHTML = `<div id="SymbolList" class="short_popup" style="color: #FFF;padding: 1.5rem;font-size:initial;height: 183px;">
						<h5>登場記号一覧</h5>
						${this.symbolLength[1]}
						</div>`
	}


	parseSymbolLength(){
		let SymbolEntries = ""

		const SumSymbol = Object.values(parseLyric.symbolCount).reduce(function(sum, element){
			return sum + element;
		}, 0);

		if(SumSymbol){
			parseLyric.symbolCount = Object.keys(parseLyric.symbolCount).map((k)=>({ key: k, value: parseLyric.symbolCount[k] }));
			parseLyric.symbolCount.sort((a, b) => b.value - a.value);

			//配列⇒オブジェクト　で元に戻す
			parseLyric.symbolCount = Object.assign({}, ...parseLyric.symbolCount.map((item) => ({
				[item.key]: item.value,
			})));

			const Entries = Object.entries(parseLyric.symbolCount)

			for(let i=0;i<Entries.length;i++){
				let S = Entries[i][0]

				if(i % 4 == 0){
					SymbolEntries += `${i != 0 ? "</div>":""}<div class="SymbolColumn">`
				}

				if(S == " "){
					S = "スペース"
				}

				SymbolEntries += `<div class="EntrySymbol">
							  <span class="AppearanceSymbol">${S}</span> : <span class="AppearanceTimes">${Entries[i][1]}打</span>
					          </div>`
		}

			SymbolEntries += "</div>"
		}

		return [SumSymbol,SymbolEntries];

	}

}


function out_combo_record(){

	if(document.getElementById("combo_challenge") != null){
		document.getElementById("combo_challenge").style.display = "inline"
	}

	if(document.getElementById("max_record_label") != null){
		document.getElementById("max_record_label").textContent = ""
	}
}

function hover_combo_record(event){

	if(document.getElementById("combo_challenge") != null){
		document.getElementById("combo_challenge").style.display = "none"
	}

	let mode_record = ""

	if(event.target.id == "max_record"){

		if(inputModeManager.kanaMode){
			mode_record = "最大コンボ「"+localStorage.getItem('combo_challenge_max_kana')+"打鍵, "+ localStorage.getItem('combo_challenge_fullcombo_max')+`曲」`+" <span style='font-size:50%'>（ローマ字単位 "+localStorage.getItem('combo_challenge_max_roma')+"打鍵）</span>"
		}else{
			mode_record = "最大コンボ「"+localStorage.getItem('combo_challenge_max_roma')+"打鍵, "+ localStorage.getItem('combo_challenge_fullcombo_max')+`曲」`+" <span style='font-size:50%'>（かな単位 "+localStorage.getItem('combo_challenge_max_kana')+"打鍵）</span>"
		}

	}else{

		if(inputModeManager.kanaMode){
			mode_record = "前回のコンボ数「"+localStorage.getItem('combo_challenge_last_kana')+"打鍵, "+ localStorage.getItem('combo_challenge_fullcombo_last')+`曲」`+" <span style='font-size:50%'>（ローマ字単位 "+localStorage.getItem('combo_challenge_last_roma')+"打鍵）</span>"
		}else{
			mode_record = "前回のコンボ数「"+localStorage.getItem('combo_challenge_last_roma')+"打鍵, "+ localStorage.getItem('combo_challenge_fullcombo_last')+`曲」`+" <span style='font-size:50%'>（かな単位 "+localStorage.getItem('combo_challenge_last_kana')+"打鍵）</span>"
		}

	}

	if(document.getElementById("max_record_label") != null){
		document.getElementById("max_record_label").innerHTML = mode_record
	}
}

function details_generator(){
	/*
0[ID,
1Name,
2roma_combo,
3kana_combo,
4score,
5typing_speed,
6play_speed,
7typing_count_roma_mode,
8typing_count_inputModeManager.kanaMode,
9typing_count_flick_mode])}
*/
	const max_details = this.data

	let details_html = "<h3 style='display:inline-block;margin-top:10px;margin-bottom:30px;text-indent: 0.4rem;'>"

	if(this.name == "now"){
		details_html += `只今のノーミス記録　詳細`
	}else if(this.name == "last"){
		details_html += `前回のノーミス記録　詳細`
	}else{
		details_html += `最大ノーミス記録　詳細`
	}

	details_html += "</h3>"
	details_html += max_details[max_details.length-1].length == 11 ? `　<span id=date style="font-size:90%;">(${max_details[max_details.length-1][10]})</span>` : ""

	let transition_combo_kana = 0
	let transition_combo_roma = 0
	let roma_typing = 0
	let kana_typing = 0
	let flick_typing = 0
	let all_typing = 0
	let typing_speed_average = 0
	let level = 0
	let music_name

	for(let i=0;i<max_details.length;i++){

		transition_combo_roma += +max_details[i][2]
		transition_combo_kana += +max_details[i][3]
		roma_typing += +max_details[i][7]
		kana_typing += +max_details[i][8]
		flick_typing += +max_details[i][9]
		typing_speed_average += i+1<max_details.length ? +max_details[i][5] : 0
		level = max_details[i][1].match(/ \(難易度Lv.\)/)[0].match(/Lv./)[0]
		music_name = max_details[i][1].replace(/ \(難易度Lv.\)/,"")
		const score_board = `<div><div id=score_board>Score:${max_details[i][4]},　打/秒:${max_details[i][5]}</div>`

		details_html +=
			`<div class="music_info"><div class="music_title"><a class="link" href="https://typing-tube.net/movie/show/${max_details[i][0]}">${(i+1)}曲目　${music_name}</a></div><div class="music_level">${level}, ${max_details[i][6]}倍速</div></div>

<div class="score_board">
${score_board}
<div>コンボ： ローマ字単位「${max_details[i][2]}打鍵」　かな単位「${max_details[i][3]}打鍵」</div>
<div>　推移： ローマ字単位「${transition_combo_roma}打鍵」　かな単位「${transition_combo_kana}打鍵」</div>
</div></div></div>`
	}
	details_html +=
		`<div style="font-weight:600;margin-bottom:0;text-indent: 0.4rem;">--${(this.name == "now" ? "只今の結果" : "最終結果")}--</div>
<div id="last_result"><div style="background:rgba(0,0,0,0.5);padding: 19px;width:38rem;margin-bottom:25px;">
<h3><div>ノーミス持続平均速度「${(max_details.length > 1 ? (typing_speed_average/(max_details.length-1)).toFixed(2) : max_details[0][5])}打/秒」</div><br>
<div>最終コンボ： ローマ字単位「${transition_combo_roma}打鍵」　かな単位「${transition_combo_kana}打鍵」</div>
</h3></div></div>`
	all_typing = roma_typing + kana_typing + flick_typing
	details_html += `<div style="font-weight:600;margin-bottom:0;text-indent: 0.4rem;">各入力モード使用率</div><h3 style="margin-top:0;background:rgba(0,0,0,0.5);padding: 10px;display:inline-block;">ローマ字入力率「${((roma_typing/all_typing)*100)}%」　かな入力率「${((kana_typing/all_typing)*100)}%」　フリック入力率「${((flick_typing/all_typing)*100)}%」</h3></div>`

	let nwin = window.open("about:blank");
	nwin.document.open();
	nwin.document.write(`<HTML><head>
<style>
.score_board{
background:rgba(0,0,0,0.5);
padding: 19px;
width:38rem;
margin-bottom:25px;
}
.music_info {
    width: calc(38rem + 38px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.music_title{
font-weight:600;
margin-bottom:0;
text-indent: 0.4rem;
width: 80%;
float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.music_level{
font-weight:normal;
margin-bottom:0;
text-indent: 0.4rem;
float: right;
}
.link{
color:#fff;
text-decoration: none;
}
.link:hover{
 color: #58A8FF	;
}
</style>
</head>
<BODY style="overflow: scroll;color: #fff;background-color:${getComputedStyle( document.querySelector("[data-sa-theme]"), null ).getPropertyValue("background-color")};">${details_html}</BODY></HTML>`);
	nwin.document.close();

}


let movieSpeedController
class MovieSpeedController {

	constructor(){
		this.speed = 1
		this.playSpeed = 1
		this.defaultPlaySpeed = 1
		this.fixedSpeed = 0
	}


	addEvent(){
		this.upEvent = this.setUpPlaySpeed.bind(this)
		this.downEvent = this.setDownPlaySpeed.bind(this)
		document.getElementById("speed-up").addEventListener("click",this.upEvent)
		document.getElementById("speed-down").addEventListener("click",this.downEvent)
	}


	addDynamicSpeedChangeEvent(){
		this.Event = this.setDynamicSpeed.bind(this)
		document.getElementById("speed_change").addEventListener("click",this.Event)
	}


	setDynamicSpeed() {

		if(!is_played || this.playSpeed == 2){return}

		const SPEED_CHANGE_LIST = speedList.filter(function(x){return x >= movieSpeedController.playSpeed});
		this.speed = player.getPlaybackRate();

		if(this.speed < 2){

			for(let i=0;i<SPEED_CHANGE_LIST.length;i++){

				if(SPEED_CHANGE_LIST[i] > this.speed){
					this.speed = SPEED_CHANGE_LIST[i]
					break;
				}

			}

		}else{
			this.speed = this.playSpeed;
		}

		player.setPlaybackRate(this.speed);
		document.getElementById("speed").textContent = this.speed.toFixed(2)+"倍速"
		movieSpeedController.updateTimeAdjust(this.speed)
		replace_complete_area("x"+this.speed.toFixed(2))
	}


	setDownPlaySpeed() {
		if(movieSpeedController.fixedSpeed && play_mode == "normal") { return false; }

		const SPEED_LIST = [...speedList].sort((a, b) => b - a)

		if(this.speed > 0.25){

			for(let i=0;i<SPEED_LIST.length;i++){

				if(SPEED_LIST[i] < this.speed){
					this.speed = SPEED_LIST[i]
					break;
				}

			}

		}

		this.playSpeedChange()
		this.updateSpeedDisplay()
	}


	setUpPlaySpeed() {
		if(movieSpeedController.fixedSpeed && play_mode == "normal") { return false; }

		if(this.speed < 2){

			for(let i=0;i<speedList.length;i++){

				if(speedList[i] > this.speed){
					this.speed = speedList[i]
					break;
				}

			}

		}

		this.playSpeedChange()
		this.updateSpeedDisplay()
	}


	playSpeedChange(){
		this.playSpeed = this.speed;
		play_speed = this.speed;//HTML内のonPlayerPlaybackRateChangeで使用される

		player.setPlaybackRate(this.speed);
	}


	updateTimeAdjust(){

		if(is_played&&!finished){
			line.setNextLyric(line.count-1)
			tick.updateLineTime()
			tick.updateTotalTime()
		}

		mapInfoDisplay.updateMapInfo()
	}


	updateSpeedDisplay(){
		document.getElementById("playspeed").textContent = this.speed.toFixed(2)+"倍速"
		document.getElementById("speed").textContent = this.playSpeed.toFixed(2)+"倍速"

		if(play_mode == "normal"){

			if(this.playSpeed == 2){
				speed_background = "#ed143d99"
				speed_color = "ghostwhite"
			}else if(this.playSpeed == 1.75){
				speed_background = "#9370dba9"
				speed_color = "ghostwhite"
			}else if(this.playSpeed == 1.5){
				speed_background = "#00ff7f7a"
				speed_color = "#FFF"
			}else if(this.playSpeed == 1.25){
				speed_background = "#4ed6ff73"
			}else if(this.playSpeed == 1){
				speed_background = "transparent"
				speed_color = "#FFF"
			}

			document.getElementById("speed").setAttribute("style", `color:${speed_color};background:${speed_background};`);

		}

		movieSpeedController.updateTimeAdjust(this.speed)
	}

}






/////////////////////////////////////////////////////////////////////////////////////////////////
/**1FPS毎(ブラウザにより異なる)の処理
*@playheadUpdate ここから---
*/


//練習モード






let tick

class Tick {

	constructor(){
		this.headTime = 0
		this.nowTime = 0

		this.latency = 0; //反応するまでにかかった時間
		this.linePlayTime = 0;//ライン経過時間
		this.pastPlaytime = 0;//(過去の入力時間合計)
		this.lineRemainTime = 0;//ライン残り時間
		this.totalPlayTime = 0;//入力時間(ライン経過時間 + 過去の入力時間合計)
		this.typingSpeed = 0;
		this.lineTypingSpeed = 0;
		this.lineTypingRspm = 0;
		this.speedMaker = '';

		this.totalTimeUpdateFrequency = 1
		this.totalTimeUpdateCount = 0
		this.lineTimeUpdateFrequency = 0.1
		this.lineTimeUpdateCount = 0
		this.barBaseUpdateFrequency = parseLyric.movieTotalTime/1700
		this.barBaseUpdateCount = 0

		timeSkip = new TimeSkip()
		line = new Line()

		if(tick){
			tick.removeEvent()
		}

		this.addEvent()
	}

	addEvent(){
		this.Event = this.playheadUpdate.bind(this)

		createjs.Ticker.addEventListener("tick", this.Event);
		createjs.Ticker.timingMode = createjs.Ticker.RAF;

	}

	removeEvent(){
		createjs.Ticker.removeAllEventListeners('tick');
	}


	playheadUpdate() {
		this.headTime = player.getCurrentTime() + player.difftime;
		this.nowTime = this.headTime/movieSpeedController.speed



		if(lyrics_array[line.count][0] <= this.headTime){
			line.update()
		}

		if(play_mode == 'practice'){
			//リプレイ再生
			if(OPTION_ACCESS_OBJECT['replay-mode'] && practiceMode.setLineCount != line.count-1 && line_typinglog_log[line.count-1][push_counter] != undefined && this.headTime >= line_typinglog_log[line.count-1][push_counter][2]){
				practice_replay_mode()
			}

		}

		this.updateTimeContainer()
	}

	updateLineTime(updateTypeSpeed){

		this.lineRemainTime = (lyrics_array[line.count][0] - this.headTime)/movieSpeedController.speed; //ライン残り時間


		if(!typingCounter.completed){


			const LINE_TIME = (line.count - 1) > -1 ? (this.headTime - lyrics_array[line.count - 1][0]) : this.headTime

			this.linePlayTime =  (LINE_TIME / movieSpeedController.speed) //経過ライン時間(裏ステータス)

			if(keyDown.nextChar[0]){

				if(typingCounter.lineTypeCount == 0){
					this.latency = this.linePlayTime
				}

				this.totalPlayTime = this.linePlayTime + this.pastPlaytime //タイピングワードが存在していた累計時間(裏ステータス)

				if(updateTypeSpeed){
					tick.updateTypingSpeed()
				}

			}else if(!keyDown.nextChar){
				this.latency = 0
			}

		}

		SELECTOR_ACCESS_OBJECT['remaining-time'].textContent = "残り" + this.lineRemainTime.toFixed(1) + "秒"
		this.lineTimeUpdateCount = this.nowTime


	}

	updateTotalTime(){

		if(RTC_Switch){
			var updates = {};
			updates['/users/' + myID + '/status/moviePos'] = this.nowTime.toFixed(0);
			firebase.database().ref().update(updates);
		}

		SELECTOR_ACCESS_OBJECT['total-time'].textContent = ("00" + parseInt(parseInt(this.nowTime) / 60)).slice(-2) + ':' + ("00" +(parseInt(this.nowTime) - ("00" + parseInt(parseInt(this.nowTime) / 60)).slice(-2) * 60)).slice(-2) + " / " + parseLyric.movieTimeMM+':'+parseLyric.movieTimeSS;
		this.totalTimeUpdateCount = this.nowTime
	}

	updateTypingSpeed(){

		this.lineTypingSpeed = Math.round( (typingCounter.lineTypeCount / this.linePlayTime) * 100) / 100
		this.lineTypingRspm = typingCounter.lineTypeCount == 0 ? this.lineTypingSpeed : Math.round( (typingCounter.lineTypeCount / (this.linePlayTime-this.latency) ) * 100) / 100
		this.typingSpeed = Math.round( (typingCounter.typeCount/this.totalPlayTime) * 100) / 100

		if(this.linePlayTime <=1 && !typingCounter.completed || this.lineTypingSpeed == this.typingSpeed || !keyDown.nextChar){
			this.speedMaker=""
		}else if(this.typingSpeed>this.lineTypingSpeed || (this.typingSpeed>this.lineTypingSpeed&&typingCounter.completed)){
			this.speedMaker="▼"
		}else if(this.typingSpeed<this.lineTypingSpeed || (this.typingSpeed<this.lineTypingSpeed&&typingCounter.completed)){
			this.speedMaker="▲"
		}

		//DOMに打鍵時間を表示
		SELECTOR_ACCESS_OBJECT['type-speed'].textContent = this.typingSpeed.toFixed(2);
		SELECTOR_ACCESS_OBJECT['line-speed'].textContent = this.lineTypingSpeed.toFixed(2) + "打/秒" + this.speedMaker;
	}

	updateTimeContainer(){

		if(countdown_anime){
			sec_countdownanime()
		}

		const line_meter = (line.count > 0 ? this.headTime - lyrics_array[line.count-1][0] : 0)
		SELECTOR_ACCESS_OBJECT['bar_input_base'].setAttribute('value',line_meter); //ラインバー蓄積

		if(Math.abs(this.nowTime - this.barBaseUpdateCount) >= this.barBaseUpdateFrequency){//ライン経過時間 ＆ 打鍵速度計算
			SELECTOR_ACCESS_OBJECT['bar_base'].setAttribute('value', this.headTime); //累計時間バー蓄積
			this.barBaseUpdateCount = this.nowTime
		}

		if(Math.abs(this.nowTime - this.lineTimeUpdateCount) >= this.lineTimeUpdateFrequency){//ライン経過時間 ＆ 打鍵速度計算
			this.updateLineTime('updateTypeSpeed')

			if(timeSkip.seekedCount != line.count && !keyDown.nextChar[0] && lyrics_array[line.count][0] - this.headTime > 1 || retry.resetFlag){
				timeSkip.displaySkipGuide()
			}

			if(Math.abs(this.nowTime - this.totalTimeUpdateCount) >= this.totalTimeUpdateFrequency){//曲の経過時間を[分:秒]で表示}

				this.updateTotalTime()
			}

		}

	}

}


var latency_kpm_rkpm_log = []
var escape_word_length_log = [] //逃した文字
var nothing_line_log = [] //タイピングしていないライン情報を保存(typinglogに保存されない為)
var line_score_log = [] //そのラインで失ったスコア
var clear_time_log = [] //入力時間のログ
var line_typing_count_miss_count_log = [] //打鍵数
var line_typinglog_log = []
///////////////////////////////////





let line
class Line {

	constructor(){
		this.count = 0
		this.nextSpeed = 0;
		this.nothingLineLog = []
		this.totalLatency = 0
		this.lostTypeLength = 0
		this.lostTypeScore = 0; // 失点数
		this.nextAdjustSpeed = 0//通常速度で求められるkpm(低速プレイ時のスコア調整で使用)
		this.failerCount = 0

		this.lineResultObj = {}
		this.lineInput = []
		this.lineInputRoma = []
		this.lineInputKana = []
		/* 		line_score_log.splice(count-1, 1, [line_score,lost_score]);
		line_typinglog_log.splice(count-1, 1, line_typinglog);
		escape_word_length_log.splice(count-1, 1, [escape_word , escape_notes , completed ? 1 : 2]);
		latency_kpm_rkpm_log.splice(count-1, 1,[latency,line_typingspeed,line_typingspeed_rkpm]);
		line_typing_count_miss_count_log.splice(count-1, 1, [typing_count-typing_count_save,typing_miss_this.count-miss_count_save,combo]);
		if(!completed){ clear_time_log.splice(count-1, 1, (lyrics_array[count - 0][0]-lyrics_array[count - 1][0])/speed+practice_time); } */
	}

	update(){
		//end歌詞が来たらプレイ終了
		if(lyrics_array[this.count][1] == "end") {

			if(RTC_Switch){
				var updates = {};
				updates['/users/' + myID + '/status/keySec'] = (tick.typingSpeed).toFixed(2);
				firebase.database().ref().update(updates);
			}

			gameover()
			return;
		}

		//ラインの結果を記録
		if(keyDown.nextChar[0] && this.count){
			this.calculateLineResult()
		}

		//フリックモードのテキストボックスを初期化
		if(SELECTOR_ACCESS_OBJECT['flick-input'] && PHONE_FLAG && parseLyric.typingArrayKana[this.count][0] && parseLyric.typingArrayKana[this.count][0].match(/[ぁ-ゞ]/)){

			if(document.activeElement.id == "flick-input"){
				document.activeElement.blur()
				SELECTOR_ACCESS_OBJECT['flick-input-second'].focus()

				setTimeout(function(){
					SELECTOR_ACCESS_OBJECT['flick-input'].focus()
				},0)
			}

		}

		//練習モードのラインセット処理
		if(play_mode == "practice" && this.count >= parseLyric.startLine-1){
			practiceMode.updateSetLine()
		}

		//次のタイピングワードを変数にセット
		this.addNextLineWord(this.count)

		//先頭のワードをセット
		if(this.lineInput.length > 0){
			keyDown.addNextChar(false)
		}


		//ワードをタイピングエリアに表示
		this.updateLineView()
		typingWordRenderer.update('kanaUpdate')

		//歌詞をタイピングエリアに表示
		this.setNextLyric(this.count)
		this.count ++;

		if(RTC_Switch){
			status_updates['/users/' + myID + '/status/keySec'] = (tick.typingSpeed).toFixed(2);
			status_updates['/users/' + myID + '/status/linekeySec'] = "";
			status_updates['/users/' + myID + '/status/count'] = this.count
			firebase.database().ref().update(status_updates);
		}

		SELECTOR_ACCESS_OBJECT['bar_base'].setAttribute('value', tick.headTime);
		tick.updateTimeContainer()

		if(!retry.resetFlag){
			SELECTOR_ACCESS_OBJECT['skip-guide'].textContent = ""
		}

		typingCounter.completed = false;
		keyDown.tsuFlag = false
		keyDown.continuousSokuonFlag = false
		keyDown.nFlag = false
		tick.updateLineTime('updateTypeSpeed')
		if(this.count >= parseLyric.startLine){

			//何も打たないラインを記録
			if(!keyDown.nextChar){
				tick.updateTypingSpeed()
				nothing_line_log.push([this.headTime,"", Math.round(typingCounter.score), this.count, 3, 2]);
				line_typing_count_miss_count_log.splice(this.count-1, 1, [0,0,typingCounter.combo]);
			}

		}

		if(OPTION_ACCESS_OBJECT['replay-mode'] && practiceMode.setLineCount <= this.count && line_typinglog_log[this.count-1][push_counter] != undefined){

			if(inputModeManager.kanaMode && line_typinglog_log[this.count-1][push_counter][3] == "false\r" || !inputModeManager.kanaMode && line_typinglog_log[this.count-1][push_counter][3] == "true\r"){
				typingShortcutKeys.changeInputMode()
			}

		}

		this.endResultDisplay()
		if(perfect_mode_judge(false)){return;}
	}


	endResultDisplay(){

		if(parseLyric.lineLength-(this.failerCount+typingCounter.completeCount) == 0 && play_mode != "practice"){

			window.setTimeout(function (){

				if(!typingResult){
					typingResult = new TypingResult()
				}

				if(RTC_Switch){
					document.getElementById("RTCContainer").style.display = "block"
					if(document.getElementById("RTCGamePlayWrapper").scrollHeight > 292){
						document.getElementById("RTCGamePlayWrapper").style.height = ""
						document.getElementById("RTCStatus_Area").style.height = (document.getElementById("RTCGamePlayWrapper").scrollHeight + 20) + 'px'
					}

					var updates = {};
					prevState = "end"
					updates['/users/' + myID + '/state'] = "end";
					updates['/rooms/' + roomID + '/state'] = "result";
					firebase.database().ref().update(updates);
				}
			}, 150);

		}

	}


	calculateLineResult(){
		this.totalLatency += tick.latency
		tick.updateTypingSpeed()
		let slow_speed_adjust_key_count = 0

		if(movieSpeedController.playSpeed<movieSpeedController.defaultPlaySpeed){
			const nextSpeed = (inputModeManager.kanaMode ? parseLyric.kanaLineSpeedList[this.count-1] : parseLyric.romaLineSpeedList[this.count-1])

			this.nextAdjustSpeed = (nextSpeed * movieSpeedController.defaultPlaySpeed)
			let slow_speed_adjust_key_score = 0
			let slow_speed_adjust_key_score_point = 0

			slow_speed_adjust_key_count = Math.floor((tick.lineTypingSpeed)*((lyrics_array[this.count][0]-(this.count>0 ? lyrics_array[this.count-1][0]:0))/movieSpeedController.defaultPlaySpeed))
			const word = !inputModeManager.kanaMode ? parseLyric.typingArrayRoma[this.count-1] : parseLyric.typingArrayKana[this.count-1]

			word.forEach((typing,index) => {

				if(slow_speed_adjust_key_count >= typing.length + slow_speed_adjust_key_score){
					slow_speed_adjust_key_score += typing.length
					slow_speed_adjust_key_score_point += parseLyric.typingArrayRoma[this.count-1][index].length
				}

			})

			let min_line_score = 0
			min_line_score += typingCounter.lineScore
			typingCounter.lineScore = tick.lineTypingSpeed < this.nextAdjustSpeed ? (slow_speed_adjust_key_score_point*parseLyric.scoreParChar) : (parseLyric.romaLineNotesList[this.count-1] * parseLyric.scoreParChar)
			typingCounter.lineScore -= typingCounter.lineMissCount * parseLyric.missPenalty

			if(min_line_score > typingCounter.lineScore){
				typingCounter.lineScore = min_line_score
			}

		}

		if(keyDown.nextChar && !push_counter && (line_score_log[this.count-1][0] <= typingCounter.lineScore || line_score_log[this.count-1][0] == typingCounter.lineScore && latency_kpm_rkpm_log[this.count-1][1] < tick.lineTypingSpeed)){

			const roma_word = this.lineInputRoma.join('').replace(/ /g,"")
			const escape_word = !inputModeManager.kanaMode ? keyDown.nextChar[1]+roma_word : keyDown.nextChar[0]+this.lineInputKana.join('').replace(/ /g,"")
			const escape_notes = !inputModeManager.kanaMode ? Math.round(keyDown.nextPoint/parseLyric.scoreParChar)+roma_word.length : escape_word.length
			const lost_score = (parseLyric.romaLineNotesList[this.count-1]*parseLyric.scoreParChar) - typingCounter.lineScore

			line_score_log.splice(this.count-1, 1, [typingCounter.lineScore,lost_score]);
			line_typinglog_log.splice(this.count-1, 1, typingCounter.lineTypingLog);
			escape_word_length_log.splice(this.count-1, 1, [escape_word , escape_notes , typingCounter.completed ? 1 : 2]);
			latency_kpm_rkpm_log.splice(this.count-1, 1,[tick.latency,tick.lineTypingSpeed,tick.lineTypingRspm]);
			line_typing_count_miss_count_log.splice(this.count-1, 1, [typingCounter.lineTypeCount,typingCounter.lineMissCount,typingCounter.combo]);
			if(!typingCounter.completed){ clear_time_log.splice(this.count-1, 1, (lyrics_array[this.count - 0][0]-lyrics_array[this.count - 1][0])/movieSpeedController.speed); }


			if(play_mode == "practice"){

				if(typingCounter.completed){
					typingCounter.score = line_score_log.reduce((a,x) => a+=x[0],0);
					statusRenderer.statusCountsUpdate(["Score"])
				}

				practice_line_status_display(slow_speed_adjust_key_count)
			}

			//継続コンボ計測
			if(combo_challenge){
				combo_challenge_combo_Calc()
			}

			if(!typingCounter.completed){
				if(combating_mode == "Perfect"){
					typingCounter.lastComboScore = 0
					typingCounter.lastComboScore += typingCounter.score
					var updates = {}
					updates['/users/' + myID + '/status/score'] = ((typingCounter.score-typingCounter.lastComboScore)/2000).toFixed(2);
					firebase.database().ref().update(updates);
				}

				if(typingCounter.lineTypeCount == 0 && typingCounter.lineMissCount == 0){ //放置ライン蓄積
					nothing_line_log.push([tick.headTime,"", Math.round(typingCounter.score), this.count, 2, 2]);
				}

				if(play_mode == "normal"){
					this.lostTypeLength = escape_word_length_log.reduce((a,x) => a+=x[1],0);
					this.lostTypeScore += lost_score - (parseLyric.missPenalty * typingCounter.lineMissCount)
					this.failerCount = escape_word_length_log.filter(failer => failer[0] != "").length
					statusRenderer.statusCountsUpdate(["Rank"])
				}

				statusRenderer.statusCountsUpdate(["Correct","Line","Escape"])

				tick.pastPlaytime += clear_time_log[this.count-1]//ライン時間を加算
			}

			if(!keyDown.nextChar && this.count >= partseLyric.startLine){//空白ライン
				nothing_line_log.push([tick.headTime,"", Math.round(typingCounter.score), this.count-1, 3, 2]);
				line_typing_count_miss_count_log.splice(count-2, 1, [0,0,typingCounter.combo]);
			}
		}

	}




	addNextLineWord(line_number){

		typingCounter.lineScore = 0
		typingCounter.lineTypingLog = []
		typingCounter.lineTypeCount = 0
		typingCounter.lineMissCount = 0

		countdown_anime = false //カウントダウンフラグOFF

		keyDown.nextChar = ""

		typingWordRenderer.alreadyInputKana = "";
		typingWordRenderer.alreadyInputRoma = "";
		this.lineInput = parseLyric.typingArray[line_number].slice();
		this.lineInputRoma = parseLyric.typingArrayRoma[line_number].slice();
		this.lineInputKana = parseLyric.typingArrayKana[line_number].slice();

		if(inputModeManager.kanaMode){

			if(/←|↓|↑|→|『|』/.test(this.lineInputKana.join(""))){

				for(h=0;h<this.lineInputKana.length;h++){
					const convert_target = kana_mode_convert_rule_before.indexOf(this.lineInputKana[h])

					if(convert_target >= 0){
						this.lineInputKana[h] = kana_mode_convert_rule_after[convert_target]
					}

				}

			}

			if(OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode']){
				this.lineInputKana = daku_handaku_join(false,false,this.lineInputKana)
			}
		}

	}


	//タイピングワードフィールド全体更新
	//ラインアップデート時更新


	updateLineView() {
		let kashi_kana_html
		let kashi_roma_html
		const SCROLL_MODE_STYLE = OPTION_ACCESS_OBJECT['character-scroll'] ? 'style="position: absolute;bottom: 3px;"' : ""
		const first_color_text_shadow = OPTION_ACCESS_OBJECT['next-character-color'] != "transparent" ? `text_shadow` : ``
		const word_text_shadow = OPTION_ACCESS_OBJECT['word-color'] != "transparent" ? `text_shadow` : ``
		const correct_word_text_shadow = OPTION_ACCESS_OBJECT['correct-word-color'] != "transparent" ? `text_shadow` : ``
		kashi_kana_html = `&#8203;<span ${SCROLL_MODE_STYLE}><span id='correct-input-kana' class='correct-input ${OPTION_ACCESS_OBJECT['bordering-word'] ? "" : correct_word_text_shadow}' style='color:${OPTION_ACCESS_OBJECT['correct-word-color']};'></span><span id='kana-first-word' class='next-character-color ${first_color_text_shadow}' style='color: ${OPTION_ACCESS_OBJECT['next-character-color']} ;position: relative;'></span><span id='kana-second-word' class='next-character-color ${first_color_text_shadow}' style='color:${!inputModeManager.kanaMode ? OPTION_ACCESS_OBJECT['next-character-color'] : OPTION_ACCESS_OBJECT['word-color']};'></span><span id='typing-word-kana' class='typing_word ${word_text_shadow}' style='color:${OPTION_ACCESS_OBJECT['word-color']};'></span></span>`;
		kashi_roma_html = `&#8203;<span ${SCROLL_MODE_STYLE}><span id='correct-input-roma' class='correct-input ${OPTION_ACCESS_OBJECT['bordering-word'] ? "" : correct_word_text_shadow}' style='color:${OPTION_ACCESS_OBJECT['correct-word-color']};'></span><span id='first-color-roma' class='next-character-color ${first_color_text_shadow}' style='color:${OPTION_ACCESS_OBJECT['next-character-color']};position: relative;'></span><span id='typing-word-roma' class='typing_word ${word_text_shadow}' style='color:${OPTION_ACCESS_OBJECT['word-color']};'></span></span>`;
		SELECTOR_ACCESS_OBJECT['roma-input-dom'].innerHTML = kashi_roma_html;
		SELECTOR_ACCESS_OBJECT['kana-input-dom'].innerHTML = kashi_kana_html;

		SELECTOR_ACCESS_OBJECT['correct-input-roma'] = document.getElementById("correct-input-roma")
		SELECTOR_ACCESS_OBJECT['first-color-roma'] = document.getElementById("first-color-roma")
		SELECTOR_ACCESS_OBJECT['typing-word-roma'] = document.getElementById("typing-word-roma")
		SELECTOR_ACCESS_OBJECT['correct-input'] = document.getElementsByClassName("correct-input")
		SELECTOR_ACCESS_OBJECT['correct-input-kana'] = document.getElementById("correct-input-kana")
		SELECTOR_ACCESS_OBJECT['kana-first-word'] = document.getElementById("kana-first-word")
		SELECTOR_ACCESS_OBJECT['kana-second-word'] = document.getElementById("kana-second-word")
		SELECTOR_ACCESS_OBJECT['typing-word-kana'] = document.getElementById("typing-word-kana")
		SELECTOR_ACCESS_OBJECT['next-character-color'] = document.getElementsByClassName("next-character-color")[0]
		SELECTOR_ACCESS_OBJECT['kashi_sub'].children[0].style.display = OPTION_ACCESS_OBJECT['sub'] ? "inline" : "none"

	}



	setNextLyric(line_number){

		if(parseLyric.typingArrayKana[line_number].join("").indexOf(" ") < 0){
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('eng_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('eng_word')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('jp_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('jp_word')
		}else{
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('jp_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('jp_word')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('eng_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('eng_word')
		}


		SELECTOR_ACCESS_OBJECT['bar_input_base'].setAttribute('max', lyrics_array[line_number+1][0] - lyrics_array[line_number][0]);
		SELECTOR_ACCESS_OBJECT['count-anime'].textContent = ""
		SELECTOR_ACCESS_OBJECT['kashi'].innerHTML = '<ruby>　<rt>　</rt></ruby>'+lyrics_array[line_number][1];

		line.displayNextLyric(line_number+1)

		if(OPTION_ACCESS_OBJECT['replay-mode'] || practiceMode && practiceMode.setLineCount > (line_number+1)){
			document.getElementById("complete_effect").classList.remove('countdown_animation','count_animated')
			document.getElementById("complete_effect").textContent = OPTION_ACCESS_OBJECT['replay-mode'] && practiceMode.setLineCount != this.count && line_typinglog_log[line_number].length > 1 ? "Replay" : ""
		}


		if(parseLyric.typingArrayKana[line_number+1][0]){

			//なにも表示されていないラインはカウントダウンフラグをON
			if(!keyDown.nextChar && OPTION_ACCESS_OBJECT['countdown-effect'] && !lyrics_array[line_number][1]){
				countdown_anime = true
			}

			//次ラインの打鍵速度を計算して表示
			const nextSpeed = (inputModeManager.kanaMode ? parseLyric.kanaLineSpeedList[line_number+1] : parseLyric.romaLineSpeedList[line_number+1])

			this.nextSpeed = nextSpeed * movieSpeedController.speed
			SELECTOR_ACCESS_OBJECT['next-kpm'].innerHTML = "<span id='kpm_color' style='color:rgba(255,255,255,.7);'>&nbsp;NEXT:<span class='next_kpm_value'>"+this.nextSpeed.toFixed(2)+"</span>打/秒</span>";
		}else{
			SELECTOR_ACCESS_OBJECT['next-kpm'].innerHTML = "&nbsp;";
		}

	}

	displayNextLyric(lineCount){

		if(OPTION_ACCESS_OBJECT['next-lyric-display-option'] === 'next-text-kana'){
			SELECTOR_ACCESS_OBJECT['kashi_next'].innerHTML = lyrics_array[lineCount][1] != 'end' && !parseLyric.typingArrayKana[lineCount][0] && lyrics_array[lineCount][0].substr( -6, 1 ) != "." ? '<ruby>　<rt>　</rt></ruby>' : '<ruby>　<rt>　</rt></ruby>'+parseLyric.typingArrayKana[lineCount].join('');
		}else{
			SELECTOR_ACCESS_OBJECT['kashi_next'].innerHTML = lyrics_array[lineCount][1] != 'end' && !parseLyric.typingArrayKana[lineCount][0] && lyrics_array[lineCount][0].substr( -6, 1 ) != "." ? '<ruby>　<rt>　</rt></ruby>' : '<ruby>　<rt>　</rt></ruby>'+lyrics_array[lineCount][1];
		}

	}


}

function practice_line_status_display(slow_speed_adjust_key_count){
	clear_word = ""
	let adjust_key_count = 0
	let adjusted_word = ""

	for(let i = 0; i < typingCounter.lineTypingLog.length; i++){//入力した文字の数繰り返す

		if(typingCounter.lineTypingLog[i][1] == 1){//正当
			if(slow_speed_adjust_key_count == adjust_key_count && (movieSpeedController.playSpeed<movieSpeedController.defaultPlaySpeed)){
				adjusted_word += typingCounter.lineTypingLog[i][0]
				continue
			}

			clear_word += i > 0 && typingCounter.lineTypingLog[i-1][1] == 0 ? '<span style="color:#FF3554;">'+typingCounter.lineTypingLog[i][0].replace(' ', '⎽')+'</span>' : '<span style="color:#60d7ff;">'+typingCounter.lineTypingLog[i][0].replace(' ', '⎽')+'</span>'
			adjust_key_count++
		}

	}

	if(adjusted_word != ""){
		clear_time_log.splice(line.count-1, 1, tick.linePlayTime)
		escape_word_length_log[line.count-1].splice(0, 1, adjusted_word+escape_word_length_log[line.count-1][0])
	}

	clear_word += typingCounter.lineTypingLog.length && typingCounter.lineTypingLog[typingCounter.lineTypingLog.length-1][1] == 0 ? '<span style="color:#ae81ff;">'+escape_word_length_log[line.count-1][0][0].replace(' ', '⎽')+'</span>'+escape_word_length_log[line.count-1][0].slice(1) : escape_word_length_log[line.count-1][0]

	const statu_speed_query = document.querySelectorAll('[number="'+(line.count-1)+'"] .statu_speed')
	const statu_miss_query = document.querySelectorAll('[number="'+(line.count-1)+'"] .statu_miss')
	const statu_score_query = document.querySelectorAll('[number="'+(line.count-1)+'"] .statu_score')
	const daken_moji_query = document.querySelectorAll('[number="'+(line.count-1)+'"] .daken_moji')
	const pass_query = document.querySelectorAll('[number="'+(line.count-1)+'"] .pass')

	for(let i = 0; i < statu_speed_query.length; i++){//入力した文字の数繰り返す
		statu_speed_query[i].classList.add('passed');
		statu_speed_query[i].textContent = '打/秒: '+latency_kpm_rkpm_log[line.count-1][1].toFixed(2)+',　初速抜き: '+latency_kpm_rkpm_log[line.count-1][2].toFixed(2)
		statu_miss_query[i].textContent = typingCounter.lineMissCount
		statu_score_query[i].textContent = (line_score_log[line.count-1][0]/2000).toFixed(2)

		if(!escape_word_length_log[line.count-1][0]){
			clear_word = clear_word.replace(/<span style="color:#60d7ff;">/g,'<span style="color:rgb(30, 255, 82);">')
		}

		daken_moji_query[i].innerHTML = clear_word
		pass_query[i].innerHTML = !escape_word_length_log[line.count-1][0] ? '<span class="seikou" style="color:#FFFF00;">clear</span>' : '<span class="sippai" style="color:#F12FFF;">failed'+(movieSpeedController.playSpeed < movieSpeedController.defaultPlaySpeed ? "<span style='font-size: 90%; margin-left:7px;'>(速度:"+movieSpeedController.playSpeed.toFixed(2)+")</span>":"")+'</span>'
	}

}



let timeSkip
class TimeSkip {

	constructor(){
		this.skipCode = '';
		this.seekedCount = 0;
		this.skipOptIn = false;
		this.skipSecond = 1;

		if(timeSkip){
			timeSkip.removeSkipEvent()
		}

		this.addSkipEvent()
	}


	addSkipEvent(){
		this.Event = this.triggerSkip.bind(this)

		if(typing_play_mode == 'flick'){
			document.getElementById("kashi_area").addEventListener("click", this.Event)
		}else{
			SELECTOR_ACCESS_OBJECT['skip-guide'].addEventListener("click",this.Event)
		}

	}

	removeSkipEvent(){

		if(typing_play_mode == 'flick'){
			document.getElementById("kashi_area").removeEventListener("click", this.Event)
		}else{
			SELECTOR_ACCESS_OBJECT['skip-guide'].removeEventListener("click", this.Event)
		}

	}

	displaySkipGuide(){

		const skip_enable_time = !RTC_Switch || Object.keys(Players_ID).length == 1 ? 0.4 : 1.5
		const skip_disable_time = typingCounter.completed && (!RTC_Switch || Object.keys(Players_ID).length == 1) ? 2 : 4

		if(OPTION_ACCESS_OBJECT['skip-guide-key'] === 'skip-guide-enter-key'){
			this.skipCode = "Enter";
		}else{
			this.skipCode = "Space";
		}

		//スキップ表示絶対条件
		const skipEnable = (tick.linePlayTime >= skip_enable_time || typingCounter.completed) && tick.lineRemainTime >= skip_disable_time || retry.resetFlag

		if(retry.resetFlag && (lyrics_array[parseLyric.startLine-1][0]-1<=tick.headTime)){
			retry.resetFlag = false;
		}

		//スキップ表示絶対条件 && 既に表示されているか
		if(skipEnable){

			if(SELECTOR_ACCESS_OBJECT['skip-guide'].textContent == ""){

				if(skip_enable_time == 0.4 || parseLyric.lineLength-(line.failerCount+typingCounter.completeCount) == 0 || Players_ID[RoomMaster_ID] == null){
					//対戦申請式スキップ || ソロプレイ || 打鍵するライン全て終了 || 対戦ルームマスター不在
					this.displayPressSkip()
				}else if(tick.lineRemainTime > 5){
					//ホスト式スキップルール
					this.hostRuleDisplaySkip()
				}

			}

		}else if(this.skipOptIn || SELECTOR_ACCESS_OBJECT['skip-guide'].textContent != ""){
			SELECTOR_ACCESS_OBJECT['skip-guide'].textContent = "";
			this.disableSkipOptin()
		}

	}


	displayPressSkip(){

		if(keyboard == "mac"){

			if(document.activeElement.id == "flick-input"){
				SELECTOR_ACCESS_OBJECT['skip-guide'].innerHTML = "<span style='color:rgba(255,255,255,0.53);'><i>Tap skip.⏩</i></span>";
				document.getElementById("tap_here").style.display = "block"
			}

		}else{
			SELECTOR_ACCESS_OBJECT['skip-guide'].innerHTML = "<span style='color:rgba(255,255,255,0.53);'><i>Type "+ this.skipCode +" key to skip. ⏩</i></span>";
		}

	}


	hostRuleDisplaySkip(){

		if(isRoomMaster){

			//スキップ申請していない人が自分だけだったらPress Skip.を表示
			if(Object.keys(Players_ID).length - 1 == document.getElementsByClassName("skip_opt_in").length){
				this.displayPressSkip()
			}

		}else if(!isRoomMaster){

			const HostLineCount = Number(document.getElementsByClassName("host")[1].getElementsByClassName("count")[0].textContent)

			if(HostLineCount == line.count){

				//ホストと同じラインにいるなら自動スキップ申請
				if(!this.skipOptIn){
					this.enableSkipOptin()
				}

				//スキップ申請していない人がホストのみになったらWaiting for Host to Skip.を表示
				if(Object.keys(Players_ID).length-1 == document.getElementsByClassName("skip_opt_in").length){
					SELECTOR_ACCESS_OBJECT['skip-guide'].innerHTML = "<span style='color:rgba(255,255,255,0.53);'><i>Waiting for Host to Skip.</i></span>";
				}

			}

		}

	}


	disableSkipOptin(){

		if(this.skipOptIn){
			this.skipOptIn = false
			var updates = {};
			updates['/users/' + myID + '/status/SkipOptin'] = " "
			firebase.database().ref().update(updates);
		}

	}


	enableSkipOptin(){
		this.skipOptIn = true
		var updates = {};
		updates['/users/' + myID + '/status/SkipOptin'] = line.count
		firebase.database().ref().update(updates);
	}


	triggerSkip(){

		if(SELECTOR_ACCESS_OBJECT['skip-guide'].textContent.includes(this.skipCode) || SELECTOR_ACCESS_OBJECT['skip-guide'].textContent.includes("Tap") ){
			const SKIP_LINE_TIME = !retry.resetFlag ? parseFloat(lyrics_array[line.count][0]) : lyrics_array[parseLyric.startLine-1][0]

			player.seekTo( (SKIP_LINE_TIME - player.difftime - this.skipSecond) + (1 - movieSpeedController.speed) )

			retry.resetFlag = false;
			this.seekedCount = line.count

			if(typing_play_mode == 'flick'){
				document.getElementById("tap_here").style.display = "none"
			}

			SELECTOR_ACCESS_OBJECT['skip-guide'].textContent = "";
			tick.playheadUpdate();
		}

	}

}


let countdown_anime = false//カウントダウンアニメのフラグ
function sec_countdownanime(){

	if(4.0 >= tick.lineRemainTime && tick.lineRemainTime > 3.0 && SELECTOR_ACCESS_OBJECT['count-anime'].textContent != "3"){//間奏ラインの残り時間大体3秒ぐらいのとき
		SELECTOR_ACCESS_OBJECT['count-anime'].innerHTML = "<span style='color:rgba(255,255,255,0.9);' class='countdown_animation count_animated'><i>3</i></span>";//残り時間を整数で歌詞エリアに表示
	}else if(3.0 >= tick.lineRemainTime && tick.lineRemainTime > 2.0 && SELECTOR_ACCESS_OBJECT['count-anime'].textContent != "2"){//間奏ラインの残り時間大体3秒ぐらいのとき
		SELECTOR_ACCESS_OBJECT['count-anime'].innerHTML = "<span style='color:rgba(255,255,255,0.9);' class='countdown_animation count_animated'><i>2</i></span>";//残り時間を整数で歌詞エリアに表示
	}else if(2.0 >= tick.lineRemainTime && tick.lineRemainTime > 1.0 && SELECTOR_ACCESS_OBJECT['count-anime'].textContent != "1" && SELECTOR_ACCESS_OBJECT['count-anime'].textContent != ""){//間奏ラインの残り時間大体3秒ぐらいのとき
		SELECTOR_ACCESS_OBJECT['count-anime'].innerHTML = "<span style='color:rgba(255,255,255,0.9);' class='countdown_animation count_animated'><i>1</i></span>";//残り時間を整数で歌詞エリアに表示
	}else if(tick.lineRemainTime <= 1 && SELECTOR_ACCESS_OBJECT['count-anime'].textContent != "GO!" && SELECTOR_ACCESS_OBJECT['count-anime'].textContent != ""){////間奏ラインの残り時間大体1秒ぐらいのとき
		SELECTOR_ACCESS_OBJECT['count-anime'].innerHTML = "<span style='color:rgba(255,255,255,0.9);' class='countdown_animation count_animated'><i>GO!</i></span>";//歌詞エリアにGO!と表示する
	}


}




function combo_challenge_combo_Calc(){

	if(typingCounter.combo){
		typingCounter.kanaCombo += daku_handaku_join(false,true,typingWordRenderer.alreadyInputKana.replace(/ /g,"").split("")).join("").length
		typingCounter.romaCombo += typingWordRenderer.alreadyInputRoma.replace(/ /g,"").length
	}

}


















/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@練習モード ここから---
*/


const X_Element = document.createElement("span");
X_Element.appendChild(document.createTextNode("✕"));
X_Element.setAttribute("id","seek_line_close");
X_Element.setAttribute("style","font-size: 145%;position:absolute;left:-20px;top:-4px;");



let practiceMode
class PracticeMode {

	constructor(){
		this.failureSetLine = -1
		this.setSeekTime = 0
		this.setLineCount = -1
		this.number = 1

		this.isLineRetry = false
		this.isPracticeReset = false
	}


	createMenu(){

		let line_kpm_speed;
		let Typing_Line_List = "";

		this.number = 1
		line.failerCount = 0


		CONTROLBOX_SELECTOR.insertAdjacentHTML('afterend' , `<section id='practice-container' class='practice-mode' style='text-indent: 5px;background-color: rgba(0,0,0,.33);'></section>`)

		speedbutton.setAttribute("style", "float: right;display:block;margin-top:4px;width:auto;");
		speedbutton.childNodes[0].data = speedbutton.childNodes[0].data.replace("挑戦速度","速度切替")
		document.getElementById("practice-container").appendChild(speedbutton)
		document.getElementById("playspeed").textContent = movieSpeedController.speed.toFixed(2)+"倍速"
		movieSpeedController.addEvent()


		document.getElementById("practice-container").insertAdjacentHTML("beforeend",
`<h1 id="result-head" style="font-size:20px;margin:0px!important;padding-bottom: 5px;padding-top: 10px;">Typing Practice MODE</h1>
<ul id="practice-shortcutkeys"><li><kbd class="shortcut_navi" style="margin-right: 2px;">Ctrl+←</kbd>現在のラインをセット / 前のラインをセット</li>
<li><kbd class="shortcut_navi" style="margin-right: 2px;">Ctrl+→</kbd>次のラインをセット</li>
<li><kbd class="shortcut_navi" style="margin-right: 2px;">Backspaceキー</kbd>セットしたラインへ</li></ul>
<form id="practice-setting">
<fieldset style="display: inline;height: fit-content;">
<legend>練習設定</legend>
<div title="一度もクリアしていないラインを通過すると練習ライン登録されます。">
<label><input type="checkbox" name="seek-line-failed">未クリアライン通過で自動登録</label></div>
<div title="0miss通過していないラインを通過すると練習ラインに登録されます。">
<label><input type="checkbox" name="seek-line-miss">打鍵ミスしたラインを自動登録</label></div>
</fieldset><fieldset style="display: inline;margin-left: 3rem;height: fit-content;">
<legend>リプレイ・オートモード</legend><label title="通過したラインをリプレイ再生します。"><input type="checkbox" name="replay-mode">リプレイモード　</label>
</fieldset>
<input style="margin-right: 14px;" type="button" value="練習記録をリセット" id="practice-reset" class="btn btn-light">
</form>
<div id="line-result-head">Line Select List</div><ol id='line-list' style='padding-inline-start:0.4rem;'></ol>
`)


		document.getElementById("practice-reset").addEventListener("click",this.practice_reset)

		getAllIndexedDbData(loadIndexedDbData)

		if(PHONE_FLAG){
			document.getElementById("playBotton3").parentNode.insertBefore(document.getElementById("playBotton3"),document.getElementById("result-head").nextSibling);
		}

		for(let i = 0; i < parseLyric.typingArrayKana.length; i++){

			if(parseLyric.typingArrayKana[i].length > 0){
				const necessary_key_push = !inputModeManager.kanaMode ? parseLyric.romaLineNotesList[i]:parseLyric.kanaLineNotesList[i]
				const line_time_speed = (lyrics_array[i+1][0]-lyrics_array[i][0])/movieSpeedController.defaultPlaySpeed
				const necessary_typing_speed = necessary_key_push/line_time_speed
				const kana_line_word = parseLyric.typingArrayKana[i].join("")
				const mode_word = !inputModeManager.kanaMode ? parseLyric.typingArrayRoma[i].join("") : kana_line_word

				Typing_Line_List +=
					`<li class="result_lyric" value="${+lyrics_array[i][0]}" number="${i}">
  <div class="typing_line">
    <div class='line_numbering'>
      <span class="icon-play_circle_filled">
</span>${ this.number +`/`+ parseLyric.lineLength } (<span class=necessary_key title=ライン打鍵数>${necessary_key_push}</span>打 ÷ <span class=necessary_time title=ライン時間>${line_time_speed.toFixed(1)}</span>秒 = <span class=necessary_kpm title=要求打鍵速度>${necessary_typing_speed.toFixed(2)}</span>打/秒)
      <span
        id="retry_number">0</span>ﾘﾄﾗｲ</div>
    <div><span class="kana_word_practice select_none">${kana_line_word}</span><span class="pass"></span></div>
  </div>
  <div class="typing_line_result">
    <div class='line-list-text-shadow daken_moji' style='font-weight:600;'>${mode_word}</div>
    <div><span class="statu_speed statu">打/秒: 0.00,　初速抜き: 0.00</span>,　miss: <span class="statu_miss">0</span>,　score: <span class="statu_score">0.00</span> / ${((parseLyric.romaLineNotesList[i]*parseLyric.scoreParChar)/2000).toFixed(2)}</div>
  </div>
</div>`
				this.number ++
			}
		}

		document.getElementById("line-list").insertAdjacentHTML('beforeend',Typing_Line_List)




		for (let i = 0; i < document.querySelectorAll("#practice-container input").length; ++i) {
			document.querySelectorAll("#practice-container input")[i].addEventListener('click', function(event){

				if(event.target.type == "button"){
					return;
				}

				if(event.target.name != 'replay-mode'){
					saveModOption(event)
				}

				play_focus()
				OPTION_ACCESS_OBJECT[event.target.name] = document.getElementsByName(event.target.name)[0].checked;

				if(!finished && practiceMode.setLineCount != line.count){
					practiceMode.updateAllStatus()
					document.getElementById("complete_effect").classList.remove('countdown_animation','count_animated')
					document.getElementById("complete_effect").textContent = OPTION_ACCESS_OBJECT['replay-mode'] && practiceMode.setLineCount != line.count && line_typinglog_log[line.count-1].length > 1 ? "Replay":""
				}

			})
		}

		if(!OPTION_ACCESS_OBJECT['case-sensitive-mode']){
			const eleList = document.querySelectorAll("#practice-container .daken_moji")
			for (let i = 0; i < eleList.length; ++i) {
				eleList[i].classList.add('uppercase');//打鍵ログをuppercaseで表示。
			}
		}


		const menus = document.getElementsByClassName("result_lyric");
		// 上記で取得したすべての要素に対してクリックイベントを適用

		for(let i = 0; i < menus.length; i++) {
			menus[i].addEventListener('click', function(event){
				practiceMode.setSeekTime = event.currentTarget.getAttribute('value')-1
				practiceMode.setLineCount = +event.currentTarget.getAttribute('number') > 0 ?event.currentTarget.getAttribute('number')-1:+event.currentTarget.getAttribute('number')
				const clone = event.currentTarget.cloneNode(true)
				practiceMode.seek_practice_line(practiceMode.setSeekTime,practiceMode.setLineCount)
				practiceMode.seek_line_set(clone)
				window.scrollTo({top:(document.documentElement.scrollTop+document.getElementsByClassName("result_lyric")[0].getBoundingClientRect().top+document.getElementsByClassName("result_lyric")[0].clientHeight+Number(document.getElementsByName('scroll-adjustment')[0].selectedOptions[0].value)-document.documentElement.clientHeight)})
				play_focus()
			})
		}


		if(sessionStorage.getItem((location.pathname).replace(/[^0-9]/g, ''))){onLoadreplayFile()}

	}


	updateSetLine(){

		if(this.setLineCount != line.count && !push_counter){

			if((keyDown.nextChar[0] || tick.lineTypingSpeed < line.nextAdjustSpeed && typingWordRenderer.alreadyInputRoma) && line.count && OPTION_ACCESS_OBJECT['seek-line-failed'] && document.querySelector('[number="'+(line.count-1)+'"] .seikou') == null){
				this.practice_failed_auto_set()
				this.failureSetLine = line.count
			}

			if(practiceMode.failureSetLine == line.count && movieSpeedController.playSpeed >= movieSpeedController.defaultPlaySpeed && typingCounter.completed &&(line_typing_count_miss_count_log[line.count-1][1] == 0 && OPTION_ACCESS_OBJECT['seek-line-miss'] || OPTION_ACCESS_OBJECT['seek-line-failed'] && !OPTION_ACCESS_OBJECT['seek-line-miss'])){
				this.seek_line_delete()
				this.failureSetLine = -1
			}

		}

		this.updateAllStatus()
		push_counter = 0

	}


	updateAllStatus(){
		typingCounter.currentRank = 0

		if(!OPTION_ACCESS_OBJECT['replay-mode']){
			typingCounter.score = line_score_log.reduce((a,x) => a+=x[0],0);
			line.lostTypeScore = line_score_log.reduce((a,x) => a+=x[1],0);
			tick.pastPlaytime = clear_time_log.reduce((a,x) => a+=x,0);
			line.lostTypeLength = escape_word_length_log.reduce((a,x) => a+=x[1],0);
			typingCounter.typeCount = line_typing_count_miss_count_log.reduce((a,x) => a+=x[0],0);
			typingCounter.missCount = line_typing_count_miss_count_log.reduce((a,x) => a+=x[1],0);
			typingCounter.completeCount = document.querySelectorAll("#line-list .seikou").length
		}else{
			replayModeStatusUpdate()
		}

		tick.totalPlayTime = tick.pastPlaytime
		statusRenderer.statusCountsUpdate(["Score","Rank","Type","Miss","Correct","Line","Escape"])

		if(typingCounter.typeCount){
			tick.updateTypingSpeed()
		}else{
			SELECTOR_ACCESS_OBJECT['type-speed'].textContent = tick.typingSpeed.toFixed(2);
		}

	}


	move_practice_mode(){
		let res
		if(finished && document.querySelector("#result_comment [type=button]") == null && PHONE_FLAG){
			res = true
		}else{
			res = confirm("練習モードに切り替えます。");
		}
		if(finished && document.querySelector("#result_comment [type=button]") == null || res == true ) {

			play_mode = "practice"
			type_per_min = null
			statusRenderer.viewStatusArea()
			practiceMode.createMenu()
			nothing_line_log.push([parseLyric.movieTotalTime*movieSpeedController.speed,"", Math.round(typingCounter.score), line.count, 3, 2]);
			let typinglog_save = typingCounter.typingLog.concat(nothing_line_log)
			let clear_word = ""
			typinglog_save.sort( function(a,b) {return a[0] - b[0];} )
			let logCount= parseLyric.startLine
			for(let i = 0; i <= typinglog_save.length-1; i++){//入力した文字の数繰り返す
				if(logCount == typinglog_save[i][3] && typinglog_save[i][5] == 1){//正当
					clear_word += i > 0 && typinglog_save[i-1][5] == 0 && typinglog_save[i][3] == typinglog_save[i-1][3] ? '<span style="color:#FF3554;">'+typinglog_save[i][1].replace(' ', '⎽')+'</span>' : '<span style="color:#60d7ff;">'+typinglog_save[i][1].replace(' ', '⎽')+'</span>'
				}
				if(logCount < typinglog_save[i][3]){//ラインの更新
					logCount = typinglog_save[i][3]
					if(typinglog_save[i-1][4] != 3){
						clear_word += typinglog_save[i-1][5] == 0 && escape_word_length_log[logCount-2][0] ? '<span style="color:#ae81ff;">'+escape_word_length_log[logCount-2][0][0].replace(' ', '⎽').replace(/</g, '&lt;')+'</span>'+escape_word_length_log[logCount-2][0].slice(1).replace(/</g, '&lt;') : escape_word_length_log[logCount-2][0].replace(/</g, '&lt;')
						document.querySelector('[number="'+[logCount-2]+'"] .statu_speed').classList.add('passed');
						document.querySelector('[number="'+[logCount-2]+'"] .statu_speed').textContent = '打/秒: '+latency_kpm_rkpm_log[logCount-2][1].toFixed(2)+',　初速抜き: '+latency_kpm_rkpm_log[logCount-2][2].toFixed(2)
						document.querySelector('[number="'+[logCount-2]+'"] .statu_miss').textContent = line_typing_count_miss_count_log[logCount-2][1]
						document.querySelector('[number="'+[logCount-2]+'"] .statu_score').textContent = (line_score_log[logCount-2][0]/2000).toFixed(2)
						if(!escape_word_length_log[logCount-2][0]){
							clear_word = clear_word.replace(/<span style="color:#60d7ff;">/g,'<span style="color:rgb(30, 255, 82);">')
						}
						document.querySelector('[number="'+[logCount-2]+'"] .daken_moji').innerHTML = clear_word
						document.querySelector('[number="'+[logCount-2]+'"] .pass').innerHTML = !escape_word_length_log[logCount-2][0] ? '<span class="seikou" style="color:#FFFF00;">clear</span>' : '<span class="sippai" style="color:#F12FFF;">failed</span>'
						clear_word = ""
						i--
					}
				}
			}
			logCount = Number(document.querySelector('[number]').getAttribute('number'))+1
			if(finished){
				retry.practiceModeReset()
			}

		}
	}


	practice_reset(){
		let res = confirm("練習記録をリセットします。\n\n(練習記録は通常モードのプレイ終了時に一時的に保存され、ブラウザ(Chrome,Edgeなど)を終了するまで保持されます。)");
		if(res){
			if(document.getElementById("practice-container") != null){
				document.getElementById("practice-container").remove()
			}

			retry.reset("practice")
			sessionStorage.removeItem((location.pathname).replace(/[^0-9]/g, ''))
			sessionStorage.removeItem((location.pathname).replace(/[^0-9]/g, '')+"score")

			practiceMode.createMenu()
		}
	}


	practice_failed_auto_set(){
		practiceMode.setSeekTime = document.querySelector('[number="'+(line.count-1)+'"]').getAttribute('value')-1
		practiceMode.setLineCount = line.count-2>=0? line.count-2 : -1
		const clone = document.querySelector('[number="'+(practiceMode.setLineCount+1)+'"]').cloneNode(true)
		this.seek_line_set(clone)
	}


	practice_missline_auto_set(){
		const line_statu_speed = document.querySelector('[number="'+(line.count-1)+'"] .statu_speed')
		if(!line_statu_speed.classList.contains('passed') || line_typing_count_miss_count_log[line.count-1][1] > 0){
			clear_word = ""
			if(!line_statu_speed.classList.contains('passed')){
				const line_daken_moji = document.querySelector('[number="'+(line.count-1)+'"] .daken_moji')
				for(let i = 0; i < typingCounter.lineTypingLog.length; i++){//入力した文字の数繰り返す
					if(typingCounter.lineTypingLog[i][1] == 1){
						clear_word += i > 0 && typingCounter.lineTypingLog[i-1][1] == 0 ? '<span style="color:#FF3554;">'+typingCounter.lineTypingLog[i][0].replace(' ', '⎽')+'</span>' : '<span style="color:#60d7ff;">'+typingCounter.lineTypingLog[i][0].replace(' ', '⎽')+'</span>'
					}
				}
				if(!inputModeManager.kanaMode){
					clear_word +=('<span style="color:#ae81ff;">'+keyDown.nextChar[1][0].replace(' ', '⎽')+'</span>')
					line_daken_moji.innerHTML = clear_word+keyDown.nextChar[1].slice(1)+line.lineInputRoma.join("").replace(/</g, '&lt;')
				}else{
					clear_word +=('<span style="color:#ae81ff;">'+keyDown.nextChar[0][0].replace(' ', '⎽')+'</span>')
					line_daken_moji.innerHTML = clear_word+line.lineInputKana.join("").replace(/</g, '&lt;')
				}
			}
			practice_failed_auto_set()
			practiceMode.failureSetLine = line.count
		}
	}


	seek_line_set(clone){
		if(document.getElementById("practice-container").children[2].className == "result_lyric"){
			document.getElementById("practice-container").children[2].parentNode.replaceChild(clone, document.getElementById("practice-container").children[2]);
		}else{
			document.getElementById("result-head").parentNode.insertBefore(clone, document.getElementById("result-head"));
		}


		if(document.getElementById("seek_line_close") == null){
			document.getElementById("practice-container").children[0].parentNode.insertBefore(X_Element, document.getElementById("practice-container").children[0]);
			document.getElementById("seek_line_close").addEventListener('click',this.seek_line_delete,true)
		}
		document.getElementById("practice-container").children[2].addEventListener('click', function(event){
			practiceMode.isLineRetry = true
			practiceMode.seek_practice_line(practiceMode.setSeekTime,practiceMode.setLineCount)
			play_focus()
		})


	}


	seek_line_delete(){
		document.getElementById("seek_line_close").removeEventListener('click',this.seek_line_delete,true)
		document.getElementById("practice-container").children[2].remove()
		document.getElementById("seek_line_close").remove()
		practiceMode.setSeekTime = null
		practiceMode.setLineCount = null
	}


	seek_practice_line(seek_time , seek_line_count){
		//シークする前のライン結果を記録
		if(keyDown.nextChar[0] && line.count){line.calculateLineResult()}

		//リトライ回数を増やす
		if(!retry.resetFlag){
			this.practiceRetryCount(seek_line_count)
		}

		practiceMode.updateAllStatus()


		//スキップ用カウント
		timeSkip.seekedCount = line.count
		push_counter = 0

		if(finished){
			retry.restorePlayArea()
			play_movie()
		}

		player.seekTo(seek_time+(1-movieSpeedController.speed))

		player.playVideo()
	}


	practiceRetryCount(seek_line_count){
		let number_of_times = +document.querySelector('[number="'+(seek_line_count+1)+'"] #retry_number').textContent
		number_of_times ++
		let now_number_selectorAll = document.querySelectorAll('[number="'+(seek_line_count+1)+'"] #retry_number')

		for (let i = 0; i < now_number_selectorAll.length; ++i) {
			now_number_selectorAll[i].textContent = number_of_times;//打鍵ログをuppercaseで表示。
		}
	}
}




function replay_generator(movie_number){
	let csvData = ""
	csvData += movie_number+"\r\n"+movieSpeedController.playSpeed+"\r\n"+(inputModeManager.kanaMode ? "kana_mode\r\n" : "roma_mode\r\n")+"latency_kpm_rkpm_log\r\n"

	for(let i=0;i<latency_kpm_rkpm_log.length;i++){
		let latency_kpm_rkpm = latency_kpm_rkpm_log[i].join(",");
		csvData += latency_kpm_rkpm + "\r\n";
	}

	csvData += "escape_word_length_log\r\n"
	for(let i=0;i<escape_word_length_log.length;i++){
		let escape_word_length
		escape_word_length = escape_word_length_log[i].join(",");
		csvData += escape_word_length + "\r\n";

	}

	csvData += "line_score_log\r\n"
	for(let i=0;i<line_score_log.length;i++){
		let line_score = line_score_log[i];
		csvData += line_score + "\r\n";
	}

	csvData += "clear_time_log\r\n"
	for(let i=0;i<clear_time_log.length;i++){
		let clear_time = clear_time_log[i];
		csvData += clear_time + "\r\n";
	}

	csvData += "line_typing_count_miss_count_log\r\n"
	for(let i=0;i<line_typing_count_miss_count_log.length;i++){
		let line_typing_count_miss_count = line_typing_count_miss_count_log[i].join(",");
		csvData += line_typing_count_miss_count + "\r\n";
	}

	csvData += "line_typinglog_log\r\n"
	for(let i=0;i<line_typinglog_log.length;i++){
		csvData += i+"\r\n";
		if(!line_typinglog_log[i].length){
			csvData += "\r\n";
		}
		for(let j=0;j<line_typinglog_log[i].length;j++){
			let line_typinglog = line_typinglog_log[i][j].join(",");
			csvData += line_typinglog + "\r\n";
		}
	}
	sessionStorage.setItem(movie_number, csvData);

}

function replayModeStatusUpdate(){

	typingCounter.score = 0
	tick.typingSpeed = 0
	typingCounter.typeCount = 0
	line.lostTypeScore = 0
	typingCounter.missCount = 0
	tick.pastPlaytime = 0
	line.lostTypeLength = 0

	for(let t = 0; t <= line.count-1; t++){
		typingCounter.score += line_score_log[t][0]
		line.lostTypeScore +=  line_score_log[t][1]
		tick.pastPlaytime += clear_time_log[t]
		line.lostTypeLength += escape_word_length_log[t][1]
		typingCounter.typeCount += line_typing_count_miss_count_log[t][0]
		typingCounter.missCount += line_typing_count_miss_count_log[t][1]

		if(t == line.count-1){
			typingCounter.combo = line_typing_count_miss_count_log[t][2]
		}

	}

	if(practiceMode.setLineCount == line.count){
		typingCounter.score += line_score_log[line.count][0]
		line.lostTypeScore +=  line_score_log[line.count][1]
		tick.pastPlaytime += clear_time_log[line.count]
		line.lostTypeLength += escape_word_length_log[line.count][1]
		typingCounter.typeCount += line_typing_count_miss_count_log[line.count][0]
		typingCounter.missCount += line_typing_count_miss_count_log[line.count][1]
		typingCounter.combo = line_typing_count_miss_count_log[line.count][2]
	}

	if(isNaN(typingCounter.score)) {
		typingCounter.score = 0;
		typingCounter.typeCount = 0
		line.lostTypeScore = 0
		typingCounter.missCount = 0
		tick.pastPlaytime = 0
		line.lostTypeLength = 0
	}

}

let push_counter = 0
function practice_replay_mode(){
	let c = line_typinglog_log[line.count-1][push_counter][0]
	if(!inputModeManager.kanaMode){
		if(keyDown.checkNextChar(c,z_command_roma_mode(c,c,false,line_typinglog_log[line.count-1][push_counter][1]))){
			typingCounter.typeCount++
			typingCounter.combo++;
			if(typingCounter.maxCombo < typingCounter.combo){typingCounter.maxCombo = typingCounter.combo;}
			typingCounter.missCombo = 0;
			if(!keyDown.nextChar[0]) { //ラインクリア時の打鍵速度調整
				typingCounter.completed = true;
				tick.linePlayTime = clear_time_log[line.count-1]
				typingCounter.clearEffect()
			}
			typingCounter.typeEffect();
		}else if(!typingCounter.completed) {
			if(typingWordRenderer.alreadyInputRoma.length != 0) {
				typingCounter.missCount++
				typingCounter.combo=0;
				typingCounter.missCombo++;
				if(typingCounter.score>0){
					typingCounter.score-=parseLyric.scoreParChar/4
					typingCounter.lineScore-=parseLyric.scoreParChar/4
				}
			}
			typingCounter.missEffect();
		}
	}else{

		if(checkNextKana(c)){
			typingCounter.typeCount++
			typingCounter.combo++;

			if(typingCounter.maxCombo < typingCounter.combo){
				typingCounter.maxCombo = typingCounter.combo;
			}

			typingCounter.missCombo = 0;

			if(!keyDown.nextChar[0]) { //ラインクリア時の打鍵速度調整
				typingCounter.completed = true;
				tick.linePlayTime = clear_time_log[line.count-1]/movieSpeedController.speed
			}

			typingCounter.typeEffect();
		} else if(!typingCounter.completed) {

			if(typingWordRenderer.alreadyInputKana.length != 0) {
				typingCounter.missCount++
				typingCounter.combo=0;
				typingCounter.missCombo++;

				if(typingCounter.score>0){
					typingCounter.score-=parseLyric.scoreParChar/4
					typingCounter.lineScore-=parseLyric.scoreParChar/4
				}

			}

			typingCounter.missEffect();
		}
	}

	push_counter++

	if(line_typinglog_log[line.count-1][push_counter] != undefined && (inputModeManager.kanaMode && line_typinglog_log[line.count-1][push_counter][3] == "false\r" || !inputModeManager.kanaMode && line_typinglog_log[line.count-1][push_counter][3] == "true\r")){
		typingShortcutKeys.changeInputMode()
	}

	statusRenderer.statusCountsUpdate(["Score","Rank","Type","Miss","Correct"])
	tick.updateTypingSpeed()

}




function onLoadreplayFile(){
	// A file was loaded.
	var listOfRuby = sessionStorage.getItem((location.pathname).replace(/[^0-9]/g, '')).split('\n');

	movieSpeedController.playSpeed = +listOfRuby[1]
	movieSpeedController.defaultPlaySpeed = +listOfRuby[1]
	mapOfRuby = {};
	var v
	var v_num = 0
	var line_index = -1
	var line_log = []
	listOfRuby.forEach((ruby,index, array) => {
		if(ruby == "latency_kpm_rkpm_log\r"){
			v = "latency_kpm_rkpm_log"
			return true
		}else if(ruby == "escape_word_length_log\r"){
			v = "escape_word_length_log"
			v_num = 0
			return true
		}else if(ruby == "line_score_log\r"){
			v = "line_score_log"
			v_num = 0
			return true
		}else if(ruby == "clear_time_log\r"){
			v = "clear_time_log"
			v_num = 0
			return true
		}else if(ruby == "line_typing_count_miss_count_log\r"){
			v = "line_typing_count_miss_count_log"
			v_num = 0
			return true
		}else if(ruby == "line_typinglog_log\r"){
			v = "line_typinglog_log"
			v_num = 0


			return true
		}

		if(v == "latency_kpm_rkpm_log"){
			latency_kpm_rkpm_log.splice(v_num, 1, ruby.split(",").map(Number))
			v_num++
		}else if(v == "escape_word_length_log"){
			if(ruby[0] == ","){
				escape_word_length_log.splice(v_num, 1, ruby.split(","))
				escape_word_length_log[v_num][0] = ""
			}else{
				escape_word_length_log.splice(v_num, 1, ruby.split(","))
			}
			v_num++
		}else if(v == "line_score_log"){
			line_score_log.splice(v_num, 1, ruby.split(",").map(Number))
			v_num++
		}else if(v == "clear_time_log"){
			clear_time_log.splice(v_num, 1, Number(ruby))
			v_num++
		}else if(v == "line_typing_count_miss_count_log"){
			line_typing_count_miss_count_log.splice(v_num, 1, ruby.split(",").map(Number))
			v_num++
		}else if(v == "line_typinglog_log"){
			if(parseInt(ruby) != NaN && line_index - (+ruby) == -1){
				line_typinglog_log.splice(line_index, 1, line_log)
				line_index ++
				line_log = []
				v_num = 0
				return true
			}
			line_log.splice(v_num, 1, ruby.split(","))
			v_num++
		}


	});

	line_typinglog_log.forEach((typing,index, array) => {
		let clear_word = ""
		if(typing.length > 1){
			for(let i = 0; i < typing.length; i++){//入力した文字の数繰り返す
				if(typing[i][1] == 1){//正当
					clear_word += i > 0 && typing[i-1][1] == 0 ? '<span style="color:#FF3554;">'+typing[i][0].replace(' ', '⎽')+'</span>' : '<span style="color:#60d7ff;">'+typing[i][0].replace(' ', '⎽')+'</span>'
				}
			}
			clear_word += typing[typing.length-1][1] == 0 && escape_word_length_log[index][0] ? '<span style="color:#ae81ff;">'+escape_word_length_log[index][0][0].replace(' ', '⎽').replace(/</g, '&lt;')+'</span>'+escape_word_length_log[index][0].slice(1).replace(/</g, '&lt;') : escape_word_length_log[index][0].replace(/</g, '&lt;')
			document.querySelector('[number="'+[index]+'"] .statu_speed').classList.add('passed');
			document.querySelector('[number="'+[index]+'"] .statu_speed').textContent = '打/秒: '+latency_kpm_rkpm_log[index][1].toFixed(2)+',　初速抜き: '+latency_kpm_rkpm_log[index][2].toFixed(2)
			document.querySelector('[number="'+[index]+'"] .statu_miss').textContent = line_typing_count_miss_count_log[index][1]
			document.querySelector('[number="'+[index]+'"] .statu_score').textContent = (line_score_log[index][0]/2000).toFixed(2)
			if(!escape_word_length_log[index][0]){
				clear_word = clear_word.replace(/<span style="color:#60d7ff;">/g,'<span style="color:rgb(30, 255, 82);">')
			}
			document.querySelector('[number="'+[index]+'"] .daken_moji').innerHTML = clear_word
			document.querySelector('[number="'+[index]+'"] .pass').innerHTML = !escape_word_length_log[index][0] ? '<span class="seikou" style="color:#FFFF00;">clear</span>' : '<span class="sippai" style="color:#F12FFF;">failed</span>'

		}
	})
	for(let i = 0; i < escape_word_length_log.length; i++){//入力した文字の数繰り返す
		escape_word_length_log[i][1] = +escape_word_length_log[i][1]
	}

	practiceMode.updateAllStatus()
}


function replay_mode_check(){
	document.getElementsByName('replay-mode')[0].checked = !document.getElementsByName('replay-mode')[0].checked
	OPTION_ACCESS_OBJECT['replay-mode'] = document.getElementsByName('replay-mode')[0].checked
	if(practiceMode.setLineCount != line.count && play_mode == "practice"){
		document.getElementById("complete_effect").classList.remove('countdown_animation','count_animated')
		document.getElementById("complete_effect").textContent = OPTION_ACCESS_OBJECT['replay-mode'] && practiceMode.setLineCount != line.count && line_typinglog_log[line.count].length > 1 ? "Replay":""
	}
}















/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@プレイ終了時の関数変更 ここから---
*/

//プレイ終了
function gameover(stopVideo){
	not_play_event()
	finished = true;
	stop_movie(stopVideo);
}






function stop_movie(stopVideo) {

	if(stopVideo || lyrics_array[lyrics_array.length-1][0] <  parseLyric.videoDuration){
		player.stopVideo()
		console.log('stopVideo!')
		tick.removeEvent()
	}

	SELECTOR_ACCESS_OBJECT['bar_base'].style.display = "none"
	SELECTOR_ACCESS_OBJECT['kashi'].style.display = "none"
	SELECTOR_ACCESS_OBJECT['kashi_roma'].style.display = "none"
	SELECTOR_ACCESS_OBJECT['kashi_sub'].style.display = "none"
	SELECTOR_ACCESS_OBJECT['kashi_next'].style.display = "none"
}

function not_play_event(){
	window.removeEventListener("keydown",key_device_disabled)
	tick.removeEvent()
	keyDown.removeEvent()

	timeSkip.removeSkipEvent()

	if(SELECTOR_ACCESS_OBJECT['flick-input']){
		keyDown.flickInputMaxValue = ""
		SELECTOR_ACCESS_OBJECT['flick-input'].blur()
		SELECTOR_ACCESS_OBJECT['flick-input-second'].blur()
	}
}



let typingResult

class TypingResult {

	constructor(){
		this.number = 1
		this.lineResult = ''
		this.word = ''

		this.createResult()
	}

	createResult(){
		nothing_line_log.push([tick.headTime,"", Math.round(typingCounter.score), line.count+1, 3, 2]);
		this.resultData = typingCounter.typingLog.concat(nothing_line_log)
		this.resultData.sort( function(a,b) {return a[0] - b[0];} )

		if(combo_challenge){
			this.updateComboChallenge()
		}

		this.createResultElement()

		this.replaceResultStatus()

		this.createPracticeData()
	}

	updateComboChallenge(){

		localStorage.setItem('combo_challenge_roma' , (!typingCounter.missCount ? +localStorage.getItem('combo_challenge_roma')+typingCounter.romaCombo : typingCounter.romaCombo))
		localStorage.setItem('combo_challenge_kana' , (!typingCounter.missCount ? +localStorage.getItem('combo_challenge_kana')+typingCounter.kanaCombo : typingCounter.kanaCombo))

		const AFK = typingCounter.romaCombo ? 1:0
		const SCORE = (typingCounter.score > 0 ? (typingCounter.score/2000).toFixed(2) : (0).toFixed(2))
		localStorage.setItem('combo_challenge_fullcombo' , !typingCounter.missCount ? isNaN(+localStorage.getItem('combo_challenge_fullcombo')) ? 1 : +localStorage.getItem('combo_challenge_fullcombo')+AFK :AFK)
		if(AFK){	combo_challenge_beatmap_data.push([play_ID,play_Name,typingCounter.romaCombo,typingCounter.kanaCombo,SCORE,tick.typingSpeed.toFixed(2),movieSpeedController.playSpeed.toFixed(2),typingCounter.romaTypeCount,typingCounter.kanaTypeCount,typingCounter.flickTypeCount])}

		localStorage.setItem('combo_challenge_beatmap_data', JSON.stringify(combo_challenge_beatmap_data))
	}

	createResultElement(){
		this.Container = document.createElement('div');
		this.Container.setAttribute("id", "result-container");
		this.Container.setAttribute("style", "font-size:16.2px;font-weight:bold;");
		document.getElementById("typing-line-list-container").appendChild(this.Container);

		const typingLineResut_html = document.createElement('ol');
		typingLineResut_html.setAttribute("id", "typing-line-result");
		this.Container.appendChild(typingLineResut_html);

		this.createDetailResult()
		this.createLineResult()
		this.replaceResultStatus()
	}

	createDetailResult(){
		this.rspmSpeed = typingCounter.typeCount / (tick.pastPlaytime-line.totalLatency)

		const DETAIL_RESULT =
			  `<div id='detail-result' style='height:200px;'>
<div id='line-clear-result' style='margin-bottom: 0.75rem;'><div>ラインクリア率</div>
<div><span style="color:#FFFF00;">${typingCounter.completeCount} clear</span> / <span style="color:#F12FFF;">${line.failerCount} failed</span> | <span style="${(this.lineClearRate == 100 ? 'color:#FFFF00;' : '')}">${this.lineClearRate}%</span></div></div>

<div id='rspm-result' style='border-top: solid thin #FFFFFF77;padding-top: 0.75rem; margin-bottom: 0.75rem;'><div>初速抜き速度</div>
<div>${this.rspmSpeed.toFixed(2)}打/秒</div></div>

<div id='score-penalty-result' style='border-top: solid thin #FFFFFF77;padding-top: 0.75rem; margin-bottom: 0.75rem;'><div>スコアペナルティ</div>
<div>Miss: ${(-typingCounter.missCount*((parseInt(parseLyric.scoreParChar)/2000)/4)).toFixed(2)}</div><div>Lost: ${(( (typingCounter.score/2000) + (typingCounter.missCount*((parseLyric.scoreParChar/2000)/4)))-100).toFixed(2).replace(/^[-]?(\d*|0)(\.01)?$/,'0.00')}</div></div>
</div>
<div style="
    margin-top: 1.5rem;
    border-top: solid thin #FFFFFF77;
    padding-top: 0.75rem;
    font-size: 130%;
">タイピング結果詳細</div>`


		this.Container.insertAdjacentHTML('afterbegin',DETAIL_RESULT);

	}


	createLineResult(){
		let logCount = parseLyric.startLine;

		for(let i = 0; i <= this.resultData.length-1; i++){//入力した文字の数繰り返す

			if(logCount == this.resultData[i][3]){
				if(OPTION_ACCESS_OBJECT['word-result']){
					if(this.resultData[i][5] == 1){//正当
						this.word += i >= 1 && this.resultData[i-1][5] == 0 && this.resultData[i][3] == this.resultData[i-1][3] ? '<span style="color:#FF3554;">'+this.resultData[i][1].replace(' ', '⎽')+'</span>' : '<span style="color:#60d7ff;">'+this.resultData[i][1].replace(' ', '⎽')+'</span>'
					}
				}else{
					this.word += this.resultData[i][5] == 0 ? '<span style="color:#FF3554;">'+this.resultData[i][1].replace(' ', '⎽')+'</span>' : '<span style="color:#60d7ff;">'+this.resultData[i][1].replace(' ', '⎽')+'</span>'
				}
			}


			if(logCount < this.resultData[i][3]){//ライン番号取得
				logCount = this.resultData[i][3]
				this.word += this.resultData[i-1][5] == 0 && escape_word_length_log[logCount-2][0] && OPTION_ACCESS_OBJECT['word-result'] ? '<span style="color:#ae81ff;">'+escape_word_length_log[logCount-2][0][0].replace(' ', '⎽')+'</span>'+escape_word_length_log[logCount-2][0].slice(1) : escape_word_length_log[logCount-2][0]
				if(this.resultData[i-1][4] != 3){//空白ラインは出現させない
					const necessary_key_push = !inputModeManager.kanaMode ? parseLyric.romaLineNotesList[logCount-2]:parseLyric.kanaLineNotesList[logCount-2]
					const line_time_speed = (lyrics_array[logCount-1][0]-lyrics_array[logCount-2][0])/movieSpeedController.defaultPlaySpeed
					const necessary_typing_speed = necessary_key_push/line_time_speed
					const clear_failed = this.resultData[i-1][4] == 1 && !escape_word_length_log[logCount-2][1] ? '<span class="seikou" style="color:#FFFF00;">clear</span>' : '<span class="sippai" style="color:#F12FFF;">failed</span>'

					//紫表示
					if(this.resultData[i-1][4] == 1 && !escape_word_length_log[logCount-2][1]){
						this.word = this.word.replace(/<span style="color:#60d7ff;">/g,'<span style="color:rgb(30, 255, 82);">');
					}

					this.lineResult +=
						`<li class="result_lyric">
  <small>${this.number+'/'+parseLyric.lineLength} (<span class=necessary_key>${necessary_key_push}</span>打 ÷ <span class=necessary_time>${line_time_speed.toFixed(1)}</span>秒 = <span class=necessary_kpm>${necessary_typing_speed.toFixed(2)}</span>打/秒)</small>
  <div class="select_none">${lyrics_array[logCount-2][2]+clear_failed}</div>
<div class='line-list-text-shadow daken_moji' style='font-weight:bold;'>${this.word}</div>
<div>打/秒: ${latency_kpm_rkpm_log[logCount-2][1].toFixed(2)},　初速抜き: ${latency_kpm_rkpm_log[logCount-2][2].toFixed(2)},　miss: ${line_typing_count_miss_count_log[logCount-2][1]},　score: ${(line_score_log[logCount-2][0]/2000).toFixed(2)+' / '+((parseLyric.romaLineNotesList[logCount-2]*parseLyric.scoreParChar)/2000).toFixed(2)}</div>
</li>`
					this.number++
					i--
				}
				this.word = ""
			}
		}
		document.getElementById("typing-line-result").insertAdjacentHTML('afterbegin',this.lineResult);


		if(!OPTION_ACCESS_OBJECT['case-sensitive-mode']){
			const eleList = document.querySelectorAll("#typing-line-result .daken_moji")
			for (let i = 0; i < eleList.length; ++i) {
				eleList[i].classList.add('uppercase');//打鍵ログをuppercaseで表示。
			}
		}

	}


	replaceResultStatus(){

		const SCORE = (typingCounter.score > 0 ? (typingCounter.score/2000).toFixed(2) : (0).toFixed(2))

		const gameover_flag = ( OPTION_ACCESS_OBJECT['miss-limit-game-mode'] && typingCounter.correct < OPTION_ACCESS_OBJECT['miss-limit-correct'] || !OPTION_ACCESS_OBJECT['miss-limit-game-mode'] && life_correct < 0 ) ? true:false

		document.getElementById("status").innerHTML = `<table style="width:100%;table-layout: fixed;position: relative;right: -82px;">
<tr id=statu1dan style='height: 4rem;'>

<td><span class='status_label' style="left: -48px;">Score</span>
<span class="flex_status_position"><span id='score-value'>${SCORE}</span><span class="flex_status_border"></span></span>
</td>

<td class='miss'><span class='status_label' >Miss</span>
${(OPTION_ACCESS_OBJECT['miss-limit-mode'] && !OPTION_ACCESS_OBJECT['miss-limit-game-mode'] ? `<span id="life" style="position: absolute;left: -48px;line-height: 10px;top: -2px;${(gameover_flag ? "color:#FF4B00!important;":"color:gold;")}"><span id='life-value'>${life_correct.toFixed(1)}</span></span>`:"")}

<span class="flex_status_position"><span id='miss-value'>${typingCounter.missCount}</span><span class="flex_status_border"></span></span>
</td>

<td class='escape-counter'><span class='status_label'>Lost</span>
<span class="flex_status_position"><span id='escape-value'>${line.lostTypeLength}</span><span class="flex_status_border"></span></span>
</td>

<td class='typing-speed'><span class='status_label' style='font-weight:normal;left: -42px;'>打/秒</span>
<span class="flex_status_position"><span id='type-speed'>${tick.typingSpeed.toFixed(2)}</span><span class="flex_status_border"></span></span>
</td>
</tr>

<tr id=statu2dan style='height: 4rem;'>
<td class='rank'><span class='status_label' style="left: -45px;">Rank</span>
<span class="flex_status_position"><span id='rank-value'>${typingCounter.currentRank+1}</span><span style='font-weight:normal;'>位</span><span class="flex_status_border"></span></span>
</td>


<td class='correct'><span class='status_label' style='font-size:65%;font-weight:normal;left: -45px;'>正確率</span>
<span id="keep" style="display:${(OPTION_ACCESS_OBJECT['miss-limit-mode'] ? "block":"none")}; color:${(gameover_flag ? "#FF4B00!important":"gold")}; padding-left:9px; position: absolute;left: -53px;line-height: 10px;top: 0;"><span id="keep-value">${OPTION_ACCESS_OBJECT['miss-limit-mode'] ? keep_correct.toFixed(1) : ""}</span>%</span>
<span class="flex_status_position"><span style='font-size:90%;'><span id='correct-value'>${typingCounter.correct}</span>%</span><span class="flex_status_border"></span></span>
</td>

<td class='type-counter'><span class='status_label' style='left: -43px;'>Type</span>
<span class="flex_status_position"><span id='typing-count-value'>${typingCounter.typeCount}</span><span class="flex_status_border"></span></span>
</td>

<td class='remaining-line-counter'><span class='status_label' style="left: -60px;"><span id='normal_line_change' >Combo</span></span>
<span class="flex_status_position"><span id='line-count-value'>${typingCounter.maxCombo}</span><span class="flex_status_border"></span></span>
</td>
</tr>
</table>`;
	}


	createPracticeData(){

		const movie_number = (location.pathname).replace(/[^0-9]/g, '')
		if((typingCounter.score/2000) > sessionStorage.getItem(movie_number+"score")){
			sessionStorage.setItem(movie_number+"score",(typingCounter.score/2000))
			replay_generator(movie_number)
		}

	}

}











// ==UserScript==
// @name       　選曲ページ用RealTimeCombatting[Typing-Tube]
// @namespace    http://tampermonkey.net/
// @version      2.9.5
// @description  typing-tube.netにて、リアルタイムでの対戦を実現したい。
// @author       Spacia(の)
// @match        https://typing-tube.net/user*
// @grant        none
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js
// ==/UserScript==


/////////////////////////////////////////////////////////////////////////////////////////////////
//
//firebase Project ? https://console.firebase.google.com/u/0/project/realtimecombatting-typingtube/overview
//Greasy Fork https://greasyfork.org/ja/scripts/391474-realtimecombatting-typing-tube
//テスト譜面 https://typing-tube.net/movie/show/28719
//
//  <参考サイト>
//Firebase初期化方法-Qiita  https://qiita.com/kohashi/items/43ea22f61ade45972881
//js内部から他scriptの読み込み　https://teratail.com/questions/41023
//クッキーの使用方法　https://so-zou.jp/web-app/tech/programming/javascript/cookie/
//一意な文字列の作成 https://qiita.com/coa00/items/679b0b5c7c468698d53f
//ポップアップ作成 https://tech-dig.jp/js-modal/
//JavaScriptでHTMLタグを削除する正規表現 https://qiita.com/miiitaka/items/793555b4ccb0259a4cb8
//Divにイベントハンドラを追加 https://blog.keisuke11.com/webdesign/div-watch-js/
//下から出現する固定メニュー http://know-garden.com/%e4%b8%8b%e9%83%a8%e5%9b%ba%e5%ae%9a%e3%83%a1%e3%83%8b%e3%83%a5%e3%83%bc%e3%81%ae%e4%bd%9c%e3%82%8a%e6%96%b903%ef%bc%88%e6%a0%bc%e7%b4%8d%e5%bc%8f%ef%bc%9a%e7%b8%a6%e5%87%ba%e7%8f%be%ef%bc%89/
//Youtube API reference https://developers.google.com/youtube/iframe_api_reference#Playback_controls
//JavaScriptで連想配列に対してforEachループを使う方法 https://pisuke-code.com/javascript-dictionary-foreach/
//
/////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @note RealTimeCombatting ON/OFF 切り替えスイッチをヘッダーに追加　ここから ---
*/


let RTC_Switch = sessionStorage.getItem("RTC_Switch") == "true"
const MOBILE_FLAG = navigator.userAgent.match(/iPhone|Android.+Mobile/)
const PHONE_TABLET_FLAG = navigator.userAgent.match(/(iPhone|iPod|iPad|Android.*Mobile)/i);


//if(!MOBILE_FLAG){
document.querySelector('[data-sa-action="search-open"]').parentNode.insertAdjacentHTML('afterend',`<li id="RTC_Switch"><span class="" id="notify_room" data-sa-action="combat"><span id="combat-mode-on-off" style="
    color:`+(RTC_Switch ? "gold" : "")+`;
　　">`+(RTC_Switch ? "ON" : "OFF")+`</span>
 <i class="icon-users"></i></span></li>`)


//ON/OFF 切り替えスイッチクリック時イベント
document.getElementById("RTC_Switch").addEventListener("click",function RTC_Switcher(event){
	if(sessionStorage.getItem("RTC_Switch") == "true"){

		sessionStorage.setItem("RTC_Switch", "false")
		document.getElementById("RTC_Switch").removeEventListener("click",RTC_Switcher)
		if(isEnter){
			ExitRoom()
		}
		location.reload();
	}else if(sessionStorage.getItem("RTC_Switch") == "false" || !sessionStorage.getItem("RTC_Switch")){
		sessionStorage.setItem("RTC_Switch", "true")
		document.getElementById("RTC_Switch").removeEventListener("click",RTC_Switcher)
		location.reload();
	}
})


AddStyles();
//}
/**
 *@note RealTimeCombatting切り替えスイッチをヘッダーに追加　ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////



(function() {
	'use strict';
	if(RTC_Switch || location.href.indexOf("https://typing-tube.net/movie")<0){
		InitFirebase();
	}
})();



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note Firebase初期化ここから ---
*/


/**
*@Description Firebaseの初期化作業、SDKの読み込み後、使用する前に呼び出す。
*@param callback
*/


function InitFirebase(){

	// Your web app's Firebase configuration
	var firebaseConfig = {
		/*
		RealTimeCombatting"TypingTube" データベース(非公式)
		https://console.firebase.google.com/u/1/project/realtimecombatting-typingtube/database/realtimecombatting-typingtube/data
		authDomain: "realtimecombatting-typingtube.firebaseapp.com",
        projectId: "realtimecombatting-typingtube",
        storageBucket: "realtimecombatting-typingtube.appspot.com",
        messagingSenderId: "62043628528",
        appId: "1:62043628528:web:3ab013403b1f3ed9383335",
        measurementId: "G-1P2BBSLWYW",
		*/
		//apiKey: "AIzaSyACA8ARVyv9vawk9BAfoaKg5Cl8dsNGItM",
		//databaseURL: "https://realtimecombatting-typingtube.firebaseio.com"

		/*
		TypingTube データベース(公式)
		*/
		//authDomain: "api-project-959901312274.firebaseapp.com",

		//projectId: "api-project-959901312274",
		//storageBucket: "api-project-959901312274.appspot.com",
		//messagingSenderId: "959901312274",
		//appId: "1:959901312274:web:f78a1d9339b573bbdc7fcb",
		//measurementId: "G-04HLEDZM",

		apiKey: "AIzaSyDAsof24N3Ikx3vpKegkmhVYo6j1ejx2Ss",
		databaseURL: "https://typingtube.firebaseio.com"

	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	if(location.href.indexOf("https://typing-tube.net/movie/") == -1){
		RoginAnon();
	}
}

/**
*@note Firebase初期化ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note ログイン関係 ここから---
*/


/**
 * TypingTubeのサーバー時刻を取得します。取得したサーバー時刻を一定間隔で更新し、ログイン or ログアウトの状態をユーザー間で確認し合います。
 * @param LocationDateTimeStamp {number} サーバー時刻のタイムスタンプ
 * @param LocalDateTimeStamp {number} サーバー時刻を取得出来たときのローカル時刻のタイムスタンプ
 */


let LocationDateTimeStamp
let LocalDateTimeStamp
const GetLocationDate = async () => {
	const resp = await fetch("/api/ping")
	//サーバー時刻のタイムスタンプ
	LocationDateTimeStamp = await new Date(resp.headers.get("date")).getTime()
	//ローカル時刻タイムスタンプ
	LocalDateTimeStamp = new Date().getTime()

	//LocationDateTimeStamp + (new Date().getTime() - LocalDateTimeStamp)
	//サーバー時刻のタイムスタンプ + (現在のローカル時刻 - ローカル時刻タイムスタンプ)
	//上記の計算で環境の違いでズレない時刻を取得

	////////////////////////////////////////////////////////////////////

	//サーバー時刻取得後、現在ログインしていない部屋とユーザー情報を削除
	deleteIdlePlayerAndRoom();
	return true
}


/*
*@note サーバー時刻を取得 ここまで---
**/





/**
*@*(F5時)ユーザー&ルーム存在確認 ここから---
*/


/**
*@Description (F5時)1分以上更新されていない部屋&人データを削除
*/

const TIME_FOR_DELETE = 60000;

function deleteIdlePlayerAndRoom(){

	const nowTime = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)

	firebase.database().ref('users/').once('value').then(users => {

		firebase.database().ref('rooms/').once('value').then(rooms => {

			//ルーム有り
			if(rooms.val() != null){

				//現在ログインしていない人と部屋の削除
				Object.keys(rooms.val()).forEach(function(roomID){
					const roomInfo = rooms.val()[roomID];

					//ユーザーが存在しない部屋を削除
					if(!roomInfo.users){
						ForcePlayerDelete(null ,roomID)
						return;
					}

					//部屋にユーザーがいた場合の処理
					inRoomUserDelete(roomInfo , users.val() ,nowTime)
				});

			}
			//ユーザー有り
			if(users.val() != null){

				//その他の人の削除
				Object.keys(users.val()).forEach(function(userID){

					const PlayerTimeStamp = users.val()[userID].DeletetimeStamp;

					if(!PlayerTimeStamp){
						var updates = {};
						updates['/users/' + userID + '/DeletetimeStamp'] = nowTime
						firebase.database().ref().update(updates);
					}

					//60秒以上更新されていないユーザーを削除
					if(nowTime > TIME_FOR_DELETE + PlayerTimeStamp){
						ForcePlayerDelete(userID);
					}

				});

			}


		});
	});
}


/**
*@*(F5時)1分以上更新されていない部屋内の人データを削除
*/
function inRoomUserDelete(roomInfo,users,nowTime){

	Object.keys(roomInfo.users).forEach(function(userID){

		//部屋内のログアウトしているユーザーを削除
		if(users[userID] == null){
			ForcePlayerDelete(userID, roomID);
			return;
		}

		//60秒以上更新されていないユーザーを削除
		const PlayerTimeStamp = userID != myID ? users[userID].DeletetimeStamp : nowTime
		if(nowTime > TIME_FOR_DELETE + PlayerTimeStamp){
			ForcePlayerDelete(userID, roomID);
		}
	});

}



/*
*@note サーバー時刻を取得 ここまで---
**/







/**
*@Description　自分のユーザーデータを送信する
*/
function myUserDataUpdate(){
	//アイコンがされている場合はTypingTubeのユーザーID{Number}を取得する
	const USER_IMG = document.getElementsByClassName("user__img")[0]
	var updates = {};

	if(USER_IMG != null){
		updates['/users/' + myID + '/img'] = USER_IMG.getAttribute("alt")
	}

	//ユーザーネーム更新
	updates['/users/' + myID + '/name'] = userName;

	//ユーザーの状態を更新
	if(location.href.indexOf("https://typing-tube.net/movie")==0 && player.getVideoData().title == ""){
		//再生不可
		updates['/users/' + myID + '/state'] = prevState = "not_playable";
	}else{
		updates['/users/' + myID + '/state'] = prevState = "idle";
	}


	firebase.database().ref().update(updates)
}


/**
*@Description　キックされた人を判別するIPアドレスを取得
*/
function getIPaddress(){
	//一度取得していたらhttps://ipinfo.ioに接続しない。
	myIP = localStorage.getItem("IPaddress")

	if(!myIP){
		fetch('https://ipinfo.io?callback').then(res => res.json()).then(json => {
			myIP = md5(json.ip)
			localStorage.setItem("IPaddress",md5(json.ip))
		});
	}
}


/**
*@Description　動画一覧ページでオープン部屋が存在するときに点滅で通知する
*/
function checkOpenRoom(){

	firebase.database().ref('rooms').once('value').then(room => {
		if(location.href.indexOf("https://typing-tube.net/movie")<0&&room.val()){
			const roomCheck = (_roomID) => _roomID.length == 14;
			const ROOMS_ID = Object.keys(room.val());

			if(ROOMS_ID.some(roomCheck)){
				document.getElementById("notify_room").classList.add("top-nav__notify_room");
			}
		}
	})

}





var userName;
var myID;
var myIP;
var prevTS = new Date().getTime()
var playing = false;
/**
*@Description　ユーザの匿名ログイン
*@return bool  true:ログインに成功
*/
function RoginAnon(){

	firebase.auth().signInAnonymously().catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		console.log(errorCode);
		console.log( errorMessage);
		alert("RealTimeCombatting:Firebaseのサインインに失敗しました。");
		return false;
		// ...
	});

	firebase.auth().onAuthStateChanged(function(user) {

		if (user) {
			// User is signed in.

			if(RTC_Switch){

				//Firebaseで使用するuserID、ユーザーネーム取得
				myID = "U"+user.uid;
				userName = document.getElementsByClassName("user__name")[0].textContent;

				//IPアドレス取得(一度取得していたら取得しない)
				getIPaddress()

				var path = firebase.database().ref('users/' + myID);

				path.transaction(function(currentData) {
					//ユーザー情報を更新
					myUserDataUpdate()

					//対戦用のデータ読み込み + 対戦用の表示領域を作成。
					createRTC();
				});

			}else{
				//部屋が存在すれば、動画一覧ページで通知する
				GetLocationDate().then(checkOpenRoom)
			}
			// ...
		} else {
			// User is signed out.
			// ...
			var _path = firebase.database().ref('users/' + myID);
			if(_path.name != null){
				_path.remove();
			}
		}
		// ...
	});

	return true;
}




let timeStampForAFK;
let isWrittenAFKState;

/**
*@Description　操作があればafkの状態から復帰する
*/
function afkStateChange(){
	timeStampForAFK = new Date().getTime();
	if(isWrittenAFKState == true){
		var updates = {};
		isWrittenAFKState = false;
		updates['/users/' + myID + "/state"] = prevState;
		updates['/users/' + myID + '/DeletetimeStamp'] = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)
		firebase.database().ref().update(updates);
	}
}


/**
*@Description　ユーザーのタイムアウト状態をチェックする
*/
function roomUserTimeoutCheck(DeleteTimeStamp){
	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")
	firebase.database().ref('users').once('value').then(users => {
		var updates = {}

		for(let i=0;i<roomPlayers.length;i++){
			const checkID = roomPlayers[i].id
			const TimeOut_time = DeleteTimeStamp - users.val()[checkID].DeletetimeStamp

			if(TimeOut_time >= 50000){
				//50秒TimeStampの更新が無ければユーザーを削除する
				ForcePlayerDelete(checkID, null)
			}else if(TimeOut_time >= 20000){
				//20秒TimeStampの更新が無ければタイムアウト状態にする
				updates['/users/' + checkID + '/state'] = "timeOut"
			}
		}
		firebase.database().ref().update(updates);
	});
}



let AFK_TIMEOUT = 60000;

let RoomUserAfkWriteClock = 0
let prevState;

/**
*@Description　ユーザーのタイムスタンプ書き換え
*/
function ClockWriteTimeStamp(){
	const new_Date = new Date().getTime()
	var updates = {};
	const DeleteTimeStamp = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp)
	updates['/users/' + myID + '/DeletetimeStamp'] = DeleteTimeStamp


	//afkTimeout
	if(new_Date > AFK_TIMEOUT + timeStampForAFK && playing == false && (prevState == "idle" || prevState == "move") ){
		if(isWrittenAFKState == false){
			isWrittenAFKState = true;
			updates['/users/' + myID + "/state"] = "afk";
		}
	}

	//30秒に一度、ルーム内のユーザーの存在をチェックする
	if(isEnter && !playing && new_Date - RoomUserAfkWriteClock >= 30000){
		RoomUserAfkWriteClock = new_Date
		roomUserTimeoutCheck(DeleteTimeStamp)
	}

	firebase.database().ref().update(updates);
}


/**
*@Description 1.5秒効果音を無効化する
*/
function RTCSECancel(){
	isSECancel = true;
	setTimeout(function(){
		isSECancel = false;
	}, 1500);
}


/**
*@Description 対戦用のデータ読み込み + 対戦用の表示領域を作成。
*/
let wholeRoom
function createRTC(){

	//対戦用のインタラクティブエリア作成
	CreateRTCElement();


	//初めの数秒は音を鳴らさない
	RTCSECancel()


	firebase.database().ref('users/' + myID + '/roomID').once('value').then(inRoomID => {
		roomID = inRoomID.val();

		//ルームにすでに入っているか
		if(roomID != null){
			EnterRoom(roomID);
		}

	});

	//以下、サーバー時間を取得した後に行う処理
	GetLocationDate().then( () => {

		if(roomID == null && !wholeRoom){
			addWholeRoomsUpdateEvent()
			setTimeout(()=> {document.getElementById("noRoomMes").textContent = "現在ルームが存在しません。";},700)
		}

		//ユーザー確認用タイムスタンプを更新
		ClockWriteTimeStamp()
		setInterval(ClockWriteTimeStamp,5000)

		//afk復帰確認イベント
		timeStampForAFK = new Date().getTime();
		document.body.addEventListener("keydown",afkStateChange);
		document.body.addEventListener("mousedown",afkStateChange);
		document.body.addEventListener("mousemove",afkStateChange);

		window.addEventListener("focus",windowFocusUpdate)

		window.addEventListener('beforeunload',windowBeforeunload );
	})

}


/**
*@Description　ウィンドウがアクティブになった
*/
function windowFocusUpdate(){
	var updates = {}
	updates['/users/' + myID + '/name'] = userName
	updates['/users/' + myID + "/state"] = prevState;
	firebase.database().ref().update(updates);

	//タイムアウト処理を受けていたらルームから離脱。
	if(isEnter){
		firebase.database().ref('users/' + myID + '/roomID').once('value').then(inRoomID => {
			if(!inRoomID.val()){
				ExitRoom();
			}
		})
	}

	ClockWriteTimeStamp()
}

/**
*@Description　ウィンドウから離れる
*/
function windowBeforeunload(){
	if(!playing){
		var updates = {}
		updates['/users/' + myID + '/state'] = "move"
		firebase.database().ref().update(updates);
	}
}



/**
*@note ログイン関係 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note 対戦用のインタラクティブエリア作成 ここから---
*/

var DOMContainer;
var DOMChatInput;
var movieID;
var movieTitle;
var RTCselectingMode;
var WindowBlur


/**
*@Description 対戦用のインタラクティブエリア作成 ルート
*/
function CreateRTCElement(){
	//動画の再生を無効化
	var playarea = document.getElementsByClassName("playarea")[0];

	if(playarea != null){
		playarea.classList.add("is-hide-playarea");
		// document.getElementsByClassName("status")[0].classList.add("flex_100");
	}

	CreateContainer();
	CreateStatusArea();
	CreateChatArea();
}





/**
*@note スタイルを追加---
*/
function AddStyles(){
	var DOMstyle = document.createElement("style");
	DOMstyle.setAttribute("type","text/css");
	DOMstyle.textContent = `
#notify_room{
    padding-bottom: 1.5rem;
    padding-top: 0.6rem;
    position: relative;
    top: 5px;
}

#combat-mode-on-off{
    position: absolute;
    top: 4.1em;
    margin: auto;
    font-size: 0.5em;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    font-weight: 600;
}
#ranking ::-webkit-scrollbar {
    width: 10px;
    background-color: hsla(0,0%,100%,.025);
    -webkit-border-radius: 100px;
}
#ranking ::-webkit-scrollbar-thumb {
    background: hsla(0,0%,100%,.5);
    -webkit-border-radius: 100px;
    background-clip: padding-box;
    border: 2px solid hsla(0,0%,100%,0);
    min-height: 10px;
}
.RTCroom{
width:45%;
max-height:160px;
height:160px;
margin:5px;
background-color:rgba(0,0,0, 0.2);
display:inline-block;
overflow-y:auto;
}

.RTCroom:hover{
background-color:rgba(0,0,0, 0.5);
}
#RTCRoomPlayers::-webkit-scrollbar{display:block;}/*バーの太さ*/
#RTCRoomPlayers::-webkit-scrollbar-thumb{display:block;background: #8b8b8b;border-radius: 1em;}

#RTCRoomPlayers::-webkit-scrollbar-thumb:hover{display:block;background: #8b8b8b;}
#RTCRoomPlayers::-webkit-scrollbar-thumb:active{background: #555555;}
.RTClineInput{
letter-spacing: 0.7px;
}
.top-nav__notify_room:before {
    content: '';
    width: 5px;
    height: 5px;
    background-color: #fff;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    top: -6.4px;
    right: 0;
    left: 0;
    margin: auto;
    -webkit-animation-name: flash;
    animation-name: flash;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
}
        .popup {
     position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 101;
        opacity: 0;
        visibility: hidden;
		background:rgb(255 255 255 / 10%);
        }

        .is-show {
        opacity: 1;
        visibility: visible;
        }
        .is-hide {
        opacity:0;
        visibility: hidden;
        display: none;
        }
        .is-hide-playarea {
        opacity:0;
        visibility: hidden;
        }
        .flex_100{
        flex:0 0 100%;
        max-width:100%;
        }
        .popup-inner {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%,-50%);
        width: 60%;
        height:340px;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.96);
        z-index: 100;
        }
		.popup-text-area{
        background-color:rgba(0,0,0, 0.2);
        color:white;
        margin:4px 4px 10px;
        width:80%;
        border: none;
        border-bottom: solid thin;
        }
         .mine {
        color:#e65c00;
        }

        .RTCLine {
		font-size:13px;
        }

        .RTCLine:after{content:'\u200b';}

        .chatArea {
        display: none;
        width: 100%;
        position: fixed;
        background-color: rgb(0 0 0 / 78%);
        bottom: 0;
        z-index:101;
        }

        .is-disable {
        disabled:true;
        }

        .is-DifferInMovieID {
        color:#e6e600;
        }
        .count {
        display:none;
        }
       .select_area{
       font-weight: 600;
       display: flex;
       justify-content: flex-start;
       align-items: center;
       margin-top: 13px;
       margin-right: 10px;
       margin-left: 5px;
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
.rtc-room-container{
height:100%;
width:47%;
margin:0 5px;
padding:0;
display:inline-block;
vertical-align: top;
background-color:rgba(0,0,0, 0.2);
font-size:12px;
overflow-y:auto;
}
        .ready_background_color td{
        background: #5eff8330;
       }

        .timeout_background_color td{
        opacity:0.5;
       }
    .display_AutoStart{
    display: flex!important;
    justify-content: flex-end;
    align-items: center;
    }
    .display_AutoMove{
    display: flex!important;
    justify-content: flex-end;
    align-items: center;
    }
.ready_loading{
    background: #ffffff38;
}
#ChatInput{
width:75%;
height:30px;
font-size:15px;
background-color:rgba(0,0,0, 0.2);
border:none;
color:white;
}
#ChatInput:hover{
background-color:rgba(80,80,80, 0.5);

}

#RTCChat{
max-height:170px;
margin:0 0 5px 0;
padding:0;
background-color:rgba(0,0,0, 0.2);
overflow-y:auto;
font-size:12px;
}
#RTCRoomChat{
max-height:170px;
margin:0 0 5px 0;
padding:0;
background-color:rgba(0,0,0, 0.2);
overflow-y:auto;
font-size:12px;
}
#chat-limit{
    width: 10%;
    padding: 0.3rem;
}
.rtc-button {
    vertical-align: middle;
    user-select: none;
    border:1.5px solid transparent;
    padding: .6rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    border-radius: 2px;
    transition: all .15s ease-in-out;
    cursor:pointer;
}
#Room_Existence{
    font-size:14px;
    background: #000000dd;
    position: absolute;
    height: 201px;
}

#Room_Existence span{
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    position: absolute;
    top: 48%;
    left: 50%;
}

[value="準備完了"],[value="途中参加"],[value="ゲーム開始"] {
    color: #56e576;
    background-color: transparent;
    background-image: none;
    border-color: #56e576!important;
}
[value="準備完了"]:hover,[value="途中参加"]:hover,[value="ゲーム開始"]:hover {
    color: #fff;
    background-color: #56e576b3;
    border-color: #56e576b3!important;
    text-shadow: 0.5px 0.5px 0px #333, -0.5px -0.5px 0px #333, -0.5px 0.5px 0px #333, 0.5px -0.5px 0px #333, 0.5px 0px 0px #333, -0.5px 0px 0px #333, 0px 0.5px 0px #333, 0px -0.5px 0px #333;
}
[value="ルームを退出"]{
    color: #ffc107;
    background-color: transparent;
    background-image: none;
    border-color: #ffc107!important;
    border: 1px solid!important;
}
[value="ルームを退出"]:hover {
    color: #fff;
    background-color: #ffc107a6;
    border-color: #ffc107c9!important;
    text-shadow: 0.5px 0.5px 0px #333, -0.5px -0.5px 0px #333, -0.5px 0.5px 0px #333, 0.5px -0.5px 0px #333, 0.5px 0px 0px #333, -0.5px 0px 0px #333, 0px 0.5px 0px #333, 0px -0.5px 0px #333;
}
[value="準備完了を解除"]{
    color:#00dcff;
    background-color: transparent;
    background-image: none;
    border-color:#17a2b8!important;
    border: 1px solid!important;
}
[value="準備完了を解除"]:hover {
    color: #fff;
    background-color:#00dcffa6;
    border-color:#17a2b8!important;
    text-shadow: 0.5px 0.5px 0px #333, -0.5px -0.5px 0px #333, -0.5px 0.5px 0px #333, 0.5px -0.5px 0px #333, 0.5px 0px 0px #333, -0.5px 0px 0px #333, 0px 0.5px 0px #333, 0px -0.5px 0px #333;
}
.request-playing {
    cursor: pointer;
    text-decoration: underline;
}
.rtc-request-info {
    color: #ffdd557d;
}
.rtc-request-info:hover {
    color: #fd5;
}
.rtc-request-info > span{
    margin-left: 5px;
}
.rtc-request-info .mode-label{
    margin-left: 15px;
}
#RTCContainer{
    border-style: solid;border-color: #f5f5f5;border-width: 2px;margin-top:10px;z-index:5;
}
#RTCStatus_Area{
    min-height: 320px;
    max-width: 896px;
    width:100%;
    aspect-ratio:89/32;
    padding: 0px 10px;
    position: absolute;
    background-color: rgb(1,2,3,0.95);
}



.button-group-pills .btn {
    border-radius: 20px;
    line-height:0.8;
    border-color: #bbbbbb;
    color: rgb(255 255 255 / 88%);
    zoom: 80%;
	margin-left:1rem;
}
.button-group-pills #battleChat.active {
  border-color: #14a4be;
  background-color: #128ca370;
  color: #fff;
  box-shadow: none;
}
.button-group-pills .btn:hover {
  border-color: #158b9f;
  background-color: #158b9f;
  color: #fff;
}
.button-group-pills #submit-report:hover {
  border-color: #ffc107;
  background-color:#ffc1078c;
  color: #fff;
}
#roomKey{
    margin-left: 15px;cursor:pointer;
}
`
	var DOMstyleRequestInfo = document.createElement("style");
	DOMstyleRequestInfo.setAttribute("type","text/css");
	DOMstyleRequestInfo.setAttribute("id","request-info-roma-kana");
	DOMstyleRequestInfo.textContent = `
.request-kana-info{
    display:none;
}
.request-roma-info{
    display:table-row;
}
`
        ;
	document.querySelector("head").appendChild(DOMstyle);
	document.querySelector("head").appendChild(DOMstyleRequestInfo);
}

/**
*@note コンテナ作成---
*/
function CreateContainer(){
	if (document.getElementById("RTCContainer")) {
		return false;
	}
	DOMContainer = document.createElement("div");
	DOMContainer.classList.add('w-100');
	DOMContainer.id = "RTCContainer";

	if(/movie\/show/.test(location.pathname)){
		const parent = CONTROLBOX_SELECTOR;
		parent.appendChild(DOMContainer);

		movieID = location.pathname.match(/\d+/g)[0];
		movieTitle = document.querySelector(".movietitle > h1").textContent;
	}else{
		const parent = document.querySelector("#main_content");
		parent.prepend(DOMContainer);
		movieID = 0;
		movieTitle = " ";
	}
}

/**
*RTCステータスエリア作成
*/
function CreateStatusArea(){
	if (document.getElementById("RTCStatus_Area") != null) {
		return false;
	}
	var DOMStatus = document.createElement("div");
	DOMStatus.setAttribute("id","RTCStatus_Area");
	DOMContainer.appendChild(DOMStatus);

	CreateRoomSelectScene(DOMStatus);
	CreateRoomIdleScene(DOMStatus);
	CreateGamePlayScene(DOMStatus);
}

/**
*ルーム選択画面作成
*/
function CreateRoomSelectScene(parent){
	var DOMRoomSelectScene = document.createElement("div");
	DOMRoomSelectScene.setAttribute("style","width:100%");

	DOMRoomSelectScene.id = "RTCRoomSelectScene";
	parent.appendChild(DOMRoomSelectScene);

	var DOMp = document.createElement("p");
	DOMp.setAttribute("style","font-size:18px;margin:10px 0;");
	DOMp.textContent = "ルームを選択";
	DOMRoomSelectScene.appendChild(DOMp);

	var DOMRooms = document.createElement("ul");
	DOMRooms.setAttribute("style","width:100%;overflow-y:auto;margin:0;padding:0;aspect-ratio:4/1");
	DOMRooms.id = "RTCRooms";
	DOMRoomSelectScene.appendChild(DOMRooms);

	var DOMNoRoomMes = document.createElement("p");
	DOMNoRoomMes.setAttribute("style","font-size:14px;padding-top:90px;text-align: center;");
	DOMNoRoomMes.id = "noRoomMes";
	DOMRooms.appendChild(DOMNoRoomMes);

	var DOMUIs = document.createElement("div");
	DOMUIs.setAttribute("style","height:30px;margin:10px 0; padding:0");
	DOMRoomSelectScene.appendChild(DOMUIs);

	var DOMCreateNewRoom = document.createElement("input");
	DOMCreateNewRoom.setAttribute("type","button");
	DOMCreateNewRoom.id = "create-room-button";
	DOMCreateNewRoom.setAttribute("class","rtc-button");
	DOMCreateNewRoom.setAttribute("value","新しくルームを作成");
	DOMCreateNewRoom.addEventListener("click", onClickCreateNewRoom);
	DOMUIs.appendChild(DOMCreateNewRoom);

	CreateModalForCreateNewRoom();
}

/**
*ルーム新規作成用モーダルの作成
*/
function CreateModalForCreateNewRoom(){
	var DOMpopup = document.createElement("div");
	DOMpopup.classList.add("popup");
	DOMpopup.id = "createNewRoom";
	document.getElementsByTagName("body")[0].appendChild(DOMpopup);

	var DOMpopupInner = document.createElement("div");
	DOMpopupInner.classList.add("popup-inner");
	DOMpopup.appendChild(DOMpopupInner);

	var DOMdiv = document.createElement("div");
	DOMdiv.setAttribute("style","height:80%;");
	DOMpopupInner.appendChild(DOMdiv);

	var DOMp = document.createElement("p");
	DOMp.setAttribute("style","font-size:18px;margin:4px 0 20px;");
	DOMp.textContent = "新しく対戦ルームを作成";
	DOMdiv.appendChild(DOMp);

	var DOMlabelRoomName = document.createElement("label");
	DOMlabelRoomName.setAttribute("for","roomName");
	DOMlabelRoomName.setAttribute("style","font-size:14px;margin:4px 0;width:20%;");
	DOMlabelRoomName.textContent = "ルーム名: ";
	DOMdiv.appendChild(DOMlabelRoomName);

	var DOMroomName = document.createElement("input");
	DOMroomName.id = "roomName";
	DOMroomName.setAttribute("type","text");
	DOMroomName.setAttribute("name","roomName");
	DOMroomName.setAttribute("maxlength","64");
	DOMroomName.setAttribute("class","popup-text-area");
	DOMroomName.setAttribute("value", userName + "'s room");
	DOMdiv.appendChild(DOMroomName);

	var DOMbr = document.createElement("br");
	DOMdiv.appendChild(DOMbr );

	var DOMlabelDescription = document.createElement("label");
	DOMlabelDescription.setAttribute("for","roomDescription");
	DOMlabelDescription.setAttribute("style","font-size:14px;margin:4px 0;width:20%;");
	DOMlabelDescription.textContent = "詳細: ";
	DOMdiv.appendChild(DOMlabelDescription);

	var DOMDescription = document.createElement("input");
	DOMDescription.id = "roomDescription";
	DOMDescription.setAttribute("type","text");
	DOMDescription.setAttribute("name","roomName");
	DOMDescription.setAttribute("maxlength","64");
	DOMDescription.setAttribute("value", "誰でもわいわい！");
	DOMDescription.setAttribute("class","popup-text-area");
	DOMdiv.appendChild(DOMDescription);

	var DOMPassWord = document.createElement("label");
	DOMPassWord.setAttribute("style","display:flex;align-items: center;margin-top:10px;");
	DOMPassWord.innerHTML = `<span style="font-size: 14px;margin: 0 5px  0 0;">パスワード設定:</span>
                             <input type="checkbox" id="Enable_PassWord">`
    DOMdiv.appendChild(DOMPassWord);

	DOMPassWord.addEventListener("change",function(){
		if(document.getElementById("Enable_PassWord").checked){
			document.getElementById("roomPassWordArea").style.display = "block"
		}else{
			document.getElementById("roomPassWordArea").style.display = "none"
		}
	})


	var DOMPassWordArea = document.createElement("input");
	DOMPassWordArea.id = "roomPassWordArea";
	DOMPassWordArea.setAttribute("type","text");
	DOMPassWordArea.setAttribute("name","roomName");
	DOMPassWordArea.setAttribute("maxlength","64");
	DOMPassWordArea.setAttribute("value", "");
	DOMPassWordArea.setAttribute("class","popup-text-area");
	DOMPassWordArea.setAttribute("style","display:none;");
	DOMdiv.appendChild(DOMPassWordArea);


	var DOMdiv2 = document.createElement("div");
	DOMdiv2.setAttribute("style","height:20%;");
	DOMpopupInner.appendChild(DOMdiv2);

	var DOMbuttonCreate = document.createElement("input");
	DOMbuttonCreate.setAttribute("type","button");
	DOMbuttonCreate.setAttribute("value","ルームを作成");
	DOMbuttonCreate.setAttribute("class","btn btn-light");
	DOMbuttonCreate.setAttribute("style","margin:4px 4px");
	DOMbuttonCreate.addEventListener("click", onClickCreateRoom);
	DOMdiv2.appendChild(DOMbuttonCreate);

	var DOMbuttonCancel = document.createElement("input");
	DOMbuttonCancel.setAttribute("type","button");
	DOMbuttonCancel.setAttribute("value","キャンセル");
	DOMbuttonCancel.setAttribute("class","btn btn-light");
	DOMbuttonCancel.setAttribute("style","margin:4px 4px");
	DOMbuttonCancel.addEventListener("click", onClickCancel);
	DOMdiv2.appendChild(DOMbuttonCancel);
}

/**
*ルーム待機画面作成
*/

const RequestInfoStyleRoma = `
.request-kana-info{
    display:none;
}
.request-roma-info{
    display:table-row;
}
`
	const RequestInfoStyleKana = `
.request-kana-info{
    display:table-row;
}
.request-roma-info{
    display:none;
}
`
	function CreateRoomIdleScene(parent){
		var DOMRoomIdleScene = document.createElement("div");
		DOMRoomIdleScene.setAttribute("style","width:100%");

		DOMRoomIdleScene.id = "RTCRoomIdleScene";
		DOMRoomIdleScene.classList.add('is-hide');
		parent.appendChild(DOMRoomIdleScene);

		var DOMp = document.createElement("p");
		DOMp.setAttribute("style","font-size:18px;margin:10px 0;");
		DOMp.id = "RTCRoomName";
		DOMp.textContent = "ルーム";
		DOMRoomIdleScene.appendChild(DOMp);

		var DOMRoomWrapper = document.createElement("div");
		DOMRoomWrapper.setAttribute("style","height:200px;margin:0;padding:0;");
		DOMRoomWrapper.id = "RTCRoomWrapper";
		DOMRoomIdleScene.appendChild(DOMRoomWrapper);


		var DOMRoomPlayers = document.createElement("div");
		DOMRoomPlayers.setAttribute("class","rtc-room-container");
		DOMRoomPlayers.id = "RTCRoomPlayers";
		DOMRoomWrapper.appendChild(DOMRoomPlayers);

		var DOMAutoStart = document.createElement("label");
		DOMAutoStart.setAttribute("style","float: right;display: none;");
		DOMAutoStart.innerHTML = `<input id="RTC_AutoStart" type="checkbox">自動開始`;
		DOMRoomPlayers.appendChild(DOMAutoStart);

		DOMAutoStart.addEventListener("change",function(event){
			if(isRoomMaster){
				var updates = {}
				if(event.target.checked){
					updates['/rooms/' + roomID + '/AutoStart'] = true;
				}else{
					updates['/rooms/' + roomID + '/AutoStart'] = false;
					if(prevState == "Auto_ready" || prevState == "ready"){
						prevState = "idle"
						updates['users/' + myID + '/state'] = "idle";
					}
				}

				firebase.database().ref().update(updates);
			}
		})


		var DOMThead = document.createElement("P");
		DOMThead.id = "RTCRoomPlayerCount";
		DOMThead.textContent = "参加者一覧";
		DOMRoomPlayers.appendChild(DOMThead);

		var DOMTable = document.createElement("table");
		DOMTable.setAttribute("rules","all");
		DOMTable.setAttribute("border","1");
		DOMTable.id = "RTCRoomPlayersTable";
		DOMRoomPlayers.appendChild(DOMTable);

		var DOMRoomInfo = document.createElement("div");
		DOMRoomInfo.setAttribute("class","rtc-room-container");
		DOMRoomInfo.id = "RTCRoomInfo";
		DOMRoomWrapper.appendChild(DOMRoomInfo);

		var DOMAutoMove = document.createElement("label");
		DOMAutoMove.setAttribute("style","float: right;display: none;");
		DOMAutoMove.innerHTML = `<input id="RTC_AutoMove" type="checkbox"`+(localStorage.getItem("RTC_AutoMove") == "false" ? "" : "checked")+`>譜面ページ自動遷移`;
		DOMRoomInfo.appendChild(DOMAutoMove);
		DOMAutoMove.addEventListener("change",function(event){
			if(!isRoomMaster){
				localStorage.setItem("RTC_AutoMove",event.target.checked)
				if(event.target.checked && document.getElementById("RTCRoomMovieTitle").href != "https://typing-tube.net/movie/show/null" && window.location.href != document.getElementById("RTCRoomMovieTitle").href){
					window.location.href = document.getElementById("RTCRoomMovieTitle").href
				}
			}
		})


		var DOMplayModeMes = document.createElement("p");
		DOMplayModeMes.textContent = "プレイモード";
		DOMRoomInfo.appendChild(DOMplayModeMes);


		var DOMmovieTitleDiv = document.createElement("div");
		DOMmovieTitleDiv.id  = "RTCmovieTitleDiv";
		DOMmovieTitleDiv.setAttribute("style","margin:5px 5px;");
		DOMRoomInfo.appendChild(DOMmovieTitleDiv);

		var DOMmovieTitleMes = document.createElement("span");
		DOMmovieTitleMes.setAttribute("style","color:inherit;");
		DOMmovieTitleMes.textContent = "楽曲: "
		DOMmovieTitleDiv.appendChild(DOMmovieTitleMes);

		var DOMmovieTitleU = document.createElement("u");
		DOMmovieTitleDiv.appendChild(DOMmovieTitleU);

		var DOMmovieTitleA = document.createElement("a");
		DOMmovieTitleA.setAttribute("style","color:inherit;font-weight:600;");
		DOMmovieTitleA.id = "RTCRoomMovieTitle";
		DOMmovieTitleU.appendChild(DOMmovieTitleA);


		var DOMselectingMes = document.createElement("span");
		DOMselectingMes.textContent = "ルームマスターがプレイする曲を選択中です。 ";
		DOMselectingMes.id = "RTCMovleSelectingMes";
		DOMRoomIdleScene.classList.add('is-hide');
		DOMmovieTitleDiv.appendChild(DOMselectingMes);

		var DOMselectingMesRM = document.createElement("span");
		DOMselectingMesRM.textContent = "プレイする曲を選択してください。 ";
		DOMselectingMesRM.id = "RTCMovleSelectingMesRM";
		DOMselectingMesRM.classList.add('is-hide');
		DOMmovieTitleDiv.appendChild(DOMselectingMesRM);


		var DOMplaySpeedDiv = document.createElement("div");
		DOMplaySpeedDiv.setAttribute("style","margin:5px 5px;");
		DOMRoomInfo.appendChild(DOMplaySpeedDiv);

		var DOMplaySpeedMes = document.createElement("span");
		DOMplaySpeedMes.textContent = "プレイ速度: "
		DOMplaySpeedDiv.appendChild(DOMplaySpeedMes);

		var DOMbtSpeedlt = document.createElement("a");
		DOMbtSpeedlt.addEventListener("click", onClickPlaySpeedlt);

		DOMbtSpeedlt.textContent = " - ";
		DOMbtSpeedlt.setAttribute("style","margin:5px 5px;");
		DOMbtSpeedlt.id = "RTCPlaybtSpeedlt";
		DOMbtSpeedlt.classList.add('is-hide');
		DOMbtSpeedlt.setAttribute("title","プレイ速度を遅くする");
		DOMplaySpeedDiv.appendChild(DOMbtSpeedlt);

		var DOMplaySpeedSpan = document.createElement("span");
		DOMplaySpeedSpan.id = "RTCPlaySpeedSpan";
		DOMplaySpeedSpan.textContent = movieSpeedController.speed.toFixed(2)+"倍"
		DOMplaySpeedDiv.appendChild(DOMplaySpeedSpan);

		var DOMbtSpeedgt = document.createElement("a");
		DOMbtSpeedgt.addEventListener("click", onClickPlaySpeedgt);
		DOMbtSpeedgt.textContent = " + ";
		DOMbtSpeedgt.id = "RTCPlaybtSpeedgt";
		DOMbtSpeedgt.classList.add('is-hide');
		DOMbtSpeedgt.setAttribute("title","プレイ速度を速くする");
		DOMbtSpeedgt.setAttribute("style","margin:5px 5px;");
		DOMplaySpeedDiv.appendChild(DOMbtSpeedgt);


		var DOMPlayMideDiv = document.createElement("div");
		DOMPlayMideDiv.id = "RTCPlayModeDiv";
		DOMRoomInfo.appendChild(DOMPlayMideDiv);

		var DOMlabel1 = document.createElement("label");
		DOMlabel1.setAttribute("style","font-size:7px;margin:0 0 0 5px");
		DOMlabel1.setAttribute("for","rbModeKana");
		DOMlabel1.textContent = "かな表示";
		DOMRoomInfo.appendChild(DOMlabel1);

		var DOMrb1 = document.createElement("input");
		DOMrb1.id = "rbModeKana";
		DOMrb1.setAttribute("type","radio");
		DOMrb1.setAttribute("name","rbPlayMode");
		DOMrb1.setAttribute("checked","checked");
		DOMrb1.setAttribute("value","kana");
		DOMrb1.addEventListener("change", function(){
			mode = 'kana';
			inputModeManager.kanaMode = false;
			typing_play_mode = 'roma'
			RTCselectingMode = mode;
			WriteToCookie('cookieRTCselectingMode', 'roma1');
			var updates = {};
			updates['users/' + myID + '/status/InputMode'] = "ローマ字";
			firebase.database().ref().update(updates);
			document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleRoma
		});
		DOMRoomInfo.appendChild(DOMrb1);
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "ローマ字";
		firebase.database().ref().update(updates);

		var DOMlabel2 = document.createElement("label");
		DOMlabel2.setAttribute("style","font-size:7px;margin:0 0 0 10px");
		DOMlabel2.setAttribute("for","rbModeRoma");
		DOMlabel2.textContent = "ローマ字表示";
		DOMRoomInfo.appendChild(DOMlabel2);

		var DOMrb2 = document.createElement("input");
		DOMrb2.id = "rbModeRoma";
		DOMrb2.setAttribute("type","radio");
		DOMrb2.setAttribute("name","rbPlayMode");
		DOMrb2.setAttribute("value","roma");
		DOMrb2.addEventListener("change", function(){
			mode = 'roma';
			inputModeManager.kanaMode = false;
			typing_play_mode = 'roma'
			WriteToCookie('cookieRTCselectingMode', 'roma2');
			var updates = {};
			updates['users/' + myID + '/status/InputMode'] = "ローマ字";
			firebase.database().ref().update(updates);
			document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleRoma
		});
		DOMRoomInfo.appendChild(DOMrb2);


		var DOMlabel3 = document.createElement("label");
		DOMlabel3.setAttribute("style","font-size:7px;margin:0 0 0 10px");
		DOMlabel3.setAttribute("for","rbModeKanaInput");
		DOMlabel3.textContent = "かな入力";
		DOMRoomInfo.appendChild(DOMlabel3);

		var DOMrb3 = document.createElement("input");
		DOMrb3.id = "rbModeKanaInput";
		DOMrb3.setAttribute("type","radio");
		DOMrb3.setAttribute("name","rbPlayMode");
		DOMrb3.setAttribute("value","kanaInput");
		DOMrb3.addEventListener("change", function(){
			mode = 'kana';
			inputModeManager.kanaMode = true;
			typing_play_mode = 'kana'
			WriteToCookie('cookieRTCselectingMode', 'kana1');
			var updates = {};
			updates['users/' + myID + '/status/InputMode'] = "かな";
			firebase.database().ref().update(updates);
			document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleKana
		});
		DOMRoomInfo.appendChild(DOMrb3);


		var DOMlabel4 = document.createElement("label");
		DOMlabel4.setAttribute("style","font-size:7px;margin:0 0 0 10px");
		DOMlabel4.setAttribute("for","rbModeFlickInput");
		DOMlabel4.textContent = "フリック入力";
		DOMRoomInfo.appendChild(DOMlabel4);

		var DOMrb4 = document.createElement("input");
		DOMrb4.id = "rbModeKanaInput";
		DOMrb4.setAttribute("type","radio");
		DOMrb4.setAttribute("name","rbPlayMode");
		DOMrb4.setAttribute("value","flickInput");
		DOMrb4.addEventListener("change", function(){
			mode = 'kana';
			inputModeManager.kanaMode = true;
			typing_play_mode = 'flick'
			WriteToCookie('cookieRTCselectingMode', 'kana2');
			var updates = {};
			updates['users/' + myID + '/status/InputMode'] = "フリック";
			firebase.database().ref().update(updates);
			document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleKana
		});
		DOMRoomInfo.appendChild(DOMrb4);

		DOMRoomInfo.insertAdjacentHTML('beforeend', `<div class="select_area"><span style="margin-right: 9px;">勝敗条件:</span>
<select id="combat_mode" style="width: 70px;" disabled>
<option value="Score" title="通常のScoreで対戦するモードです。">Score</option>
<option value="Line" title="いち早くLineクリアすると1clearポイント獲得できます。clearポイントの多さで競います。">Line先取</option>
<option value="Combo" title="Missをすると対戦エリアのScoreがリセットされます。">Combo</option>
<option value="Perfect" title="Missに加えて、ラインクリアに失敗しても対戦エリアのScoreがリセットされます。">Perfect</option>
</select></div>`)
		document.getElementById("combat_mode").addEventListener("change",onChangeCombatMode)

		var DOMdiv2 = document.createElement("div");
		DOMdiv2.setAttribute("style","height:20%;");
		DOMRoomIdleScene.appendChild(DOMdiv2);

		var DOMbuttonReady = document.createElement("input");
		DOMbuttonReady.setAttribute("type","button");
		DOMbuttonReady.setAttribute("class","rtc-button");
		DOMbuttonReady.setAttribute("value","準備完了");
		DOMbuttonReady.id = "RTCbtnReady";
		DOMbuttonReady.setAttribute("style","margin:10px 4px;visibility:hidden;");
		DOMbuttonReady.addEventListener("click", onClickBtnReady);
		DOMdiv2.appendChild(DOMbuttonReady);

		var DOMbuttonGameStart = document.createElement("input");
		DOMbuttonGameStart.setAttribute("type","button");
		DOMbuttonGameStart.setAttribute("class","rtc-button");
		DOMbuttonGameStart.setAttribute("value","ゲーム開始");
		DOMbuttonGameStart.setAttribute("style","visibility:hidden");
		DOMbuttonGameStart.id = "RTCbtnGameStart";
		if(movieID == 0){
			DOMbuttonGameStart.disabled = true;
			DOMbuttonGameStart.setAttribute("title","プレイする楽曲を選択してください。");
		}
		DOMbuttonGameStart.setAttribute("style","margin:10px 4px;" + (movieID == 0 ? "visibility:hidden;":""));
		DOMbuttonGameStart.addEventListener("click", onClickBtnGameStart);
		DOMdiv2.appendChild(DOMbuttonGameStart);

		var DOMbuttonExit = document.createElement("input");
		DOMbuttonExit.setAttribute("type","button");
		DOMbuttonExit.id = "RTCbtnExit";
		DOMbuttonExit.setAttribute("class","rtc-button");
		DOMbuttonExit.setAttribute("value","ルームを退出");
		DOMbuttonExit.setAttribute("style","margin:10px 4px 10px 30px");
		DOMbuttonExit.addEventListener("click", ExitRoom);
		DOMdiv2.appendChild(DOMbuttonExit);


		if(!localStorage.getItem("RTCpreview")){
			localStorage.setItem("RTCpreview", "false")
		}
		var DOMbuttonPreview = document.createElement("span");
		DOMbuttonPreview.setAttribute("style","display: flex;justify-content: flex-end;    position: relative;top: -10px;");
		DOMbuttonPreview.innerHTML = `<label><input type="checkbox" value="RTC_Scroll" `+(localStorage.getItem("RTC_Scroll")=="false" ? "":"checked")+`>自動スクロール</label>　<label><input type="checkbox" value="nowplay_preview" id="rtc-preview" `+(localStorage.getItem("RTCpreview")=="false"?"":"checked")+`>プレビュー再生</label>`

	DOMdiv2.appendChild(DOMbuttonPreview);

		document.querySelector("[value='RTC_Scroll']").addEventListener("change", function(event){
			localStorage.setItem("RTC_Scroll", event.target.checked)
		});
		document.querySelector("[value='nowplay_preview']").addEventListener("change", function(event){
			localStorage.setItem("RTCpreview", event.target.checked)
			if(!event.target.checked && location.href.indexOf("https://typing-tube.net/movie/") >= 0 && !playing){
				player.pauseVideo()
			}
		});

		//クッキーにより、記憶されていたモードを自動で選択するようにする処理
		RTCselectingMode = ReadFromCookie('cookieRTCselectingMode');
		if(RTCselectingMode == ''){
			WriteToCookie('cookieRTCselectingMode', 'roma1');
		}else{
			switch(RTCselectingMode){
				case 'roma1':DOMrb1.click();break;
				case 'roma2':DOMrb2.click();break;
				case 'kana1':DOMrb3.click();break;
				case 'kana2':DOMrb4.click();break;
				default: WriteToCookie('cookieRTCselectingMode', 'roma1');DOMrb1.click();break;
			}

		}
	}

/**
*プレイ中画面作成
*/
function CreateGamePlayScene(parent){
	var DOMGamePlayScene = document.createElement("div");
	DOMGamePlayScene.id = "RTCGamePlayScene";
	DOMGamePlayScene.setAttribute("style","width:98.5%;margin:8px 8px;");
	DOMGamePlayScene.classList.add('is-hide');
	parent.appendChild(DOMGamePlayScene);

	var DOMWrapper = document.createElement("div");
	DOMWrapper.setAttribute("style","height:292px;margin:0;padding:0;overflow-y:auto;background-color:rgba(0,0,0, 0.2);");
	DOMWrapper.id = "RTCGamePlayWrapper";
	DOMGamePlayScene.appendChild(DOMWrapper);

	var DOMTable = document.createElement("table");
	DOMTable.id = "RTCGamePlayPlayersStatusTable";
	DOMTable.setAttribute("style","width:100%;margin: 8px 0px 6.5px 0;");
	DOMTable.setAttribute("rules","all");
	DOMTable.setAttribute("border","1");
	DOMWrapper.appendChild(DOMTable);

	var DOMdiv2 = document.createElement("div");
	DOMGamePlayScene.appendChild(DOMdiv2);

	var DOMp2 = document.createElement("p");
	DOMp2.setAttribute("style","font-size:14px;margin:25px 0;display:none;");
	DOMp2.id = "RTCRoomMes";
	DOMp2.textContent = "　";
	DOMWrapper.appendChild(DOMp2);
}

let getSelectionBak = ""
/**
*チャットエリア作成
*/
function CreateChatArea(){


	var DOMChatDiv = document.createElement("div");
	DOMChatDiv.classList.add("chatArea");
	DOMChatDiv.setAttribute("style",`display:${sessionStorage.getItem("chatOpen") != "false" ? "block" : "none"};`);
	document.getElementsByClassName('main')[0].appendChild(DOMChatDiv);

	var DOMKnobUp = document.createElement("span");
	DOMKnobUp.setAttribute("style","height: 18px;position: absolute;cursor: pointer;bottom: 15px;");
	DOMKnobUp.setAttribute("id","knob-up");
	DOMKnobUp.textContent = "△"

	DOMChatDiv.appendChild(DOMKnobUp);
	DOMKnobUp.addEventListener("click", function chatAreaUp(e){
		const CHAT_HEIGHT = parseFloat(document.getElementById("RTCRoomChat").style.height)
		const MAX_HEIGHT = 170
		const ROOM_CHAT_FIRST_CHILD = document.getElementById("RTCRoomChat").firstChild
		const CHAT_UP_HEIGHT = (CHAT_HEIGHT+ (ROOM_CHAT_FIRST_CHILD && ROOM_CHAT_FIRST_CHILD.clientHeight ? document.getElementById("RTCRoomChat").firstChild.clientHeight:20) )

		if(CHAT_UP_HEIGHT >= MAX_HEIGHT){
			e.target.style.visibility = "hidden"
			document.getElementById("RTCRoomChat").style.height = MAX_HEIGHT+"px"
			document.getElementById("RTCChat").style.height = MAX_HEIGHT+"px"
		}else{
			e.target.style.visibility = ""
			document.getElementById("RTCRoomChat").style.height = CHAT_UP_HEIGHT+"px"
			document.getElementById("RTCChat").style.height = CHAT_UP_HEIGHT+"px"
		}

		localStorage.setItem( (!playing ? "RTCRoomChatHeight":"RTCRoomBattleChatHeight") ,document.getElementById("RTCRoomChat").style.height)
		document.getElementById("knob-down").style.visibility = ""
	},false)

	var DOMKnobDown = document.createElement("span");
	DOMKnobDown.setAttribute("style","height: 18px;position: absolute;bottom: 0px;cursor: pointer;");
	DOMKnobDown.setAttribute("id","knob-down");
	DOMKnobDown.textContent = "▽"
	DOMChatDiv.appendChild(DOMKnobDown);
	DOMKnobDown.addEventListener("click", function chatAreaDown(e){
		const CHAT_HEIGHT = parseFloat(document.getElementById("RTCRoomChat").style.height)
		const MINUMUM_HEIGHT = 40
		const ROOM_CHAT_FIRST_CHILD = document.getElementById("RTCRoomChat").firstChild
		const CHAT_DOWN_HEIGHT = (CHAT_HEIGHT-(ROOM_CHAT_FIRST_CHILD && ROOM_CHAT_FIRST_CHILD.clientHeight ? document.getElementById("RTCRoomChat").firstChild.clientHeight:20) )

		if(CHAT_DOWN_HEIGHT <= MINUMUM_HEIGHT){
			e.target.style.visibility = "hidden"
			document.getElementById("RTCRoomChat").style.height = MINUMUM_HEIGHT+"px"
			document.getElementById("RTCChat").style.height = MINUMUM_HEIGHT+"px"

		}else{
			e.target.style.visibility = ""
			document.getElementById("RTCRoomChat").style.height = CHAT_DOWN_HEIGHT +"px"
			document.getElementById("RTCChat").style.height = CHAT_DOWN_HEIGHT+"px"
		}

		localStorage.setItem((!playing ? "RTCRoomChatHeight":"RTCRoomBattleChatHeight"),document.getElementById("RTCRoomChat").style.height)
		document.getElementById("knob-up").style.visibility = ""
	})
	var DOMDiv = document.createElement("div");
	DOMDiv.setAttribute("style","margin:0 2.5%;padding-top: 7px;");
	DOMChatDiv.appendChild(DOMDiv);

	var DOMChatModeDiv = document.createElement("span");
	DOMChatModeDiv.id = "RTCchatModeDiv";
	DOMChatModeDiv.classList.add('is-hide');
	DOMDiv.appendChild(DOMChatModeDiv);


	var DOMlabelWorldChat = document.createElement("label");
	DOMlabelWorldChat.setAttribute("style","font-size:7px;margin:0 0 0 20px");
	DOMlabelWorldChat.setAttribute("for","rbWorldChat");
	DOMlabelWorldChat.textContent = "全体チャット";
	DOMChatModeDiv.appendChild(DOMlabelWorldChat);

	var DOMrbWorldChat = document.createElement("input");
	DOMrbWorldChat.id = "rbWorldChat";
	DOMrbWorldChat.setAttribute("type","radio");
	DOMrbWorldChat.setAttribute("name","rbChatMode");
	DOMrbWorldChat.setAttribute("checked","checked");
	DOMrbWorldChat.setAttribute("value","world");
	DOMrbWorldChat.addEventListener("change", function(){
		document.getElementById("RTCChat").classList.remove("is-hide");
		document.getElementById("RTCRoomChat").classList.add("is-hide");
	});

	DOMChatModeDiv.appendChild(DOMrbWorldChat);

	var DOMlabelRoomChat = document.createElement("label");
	DOMlabelRoomChat.setAttribute("style","font-size:7px;margin:0");
	DOMlabelRoomChat.setAttribute("for","rbRoomChat");
	DOMlabelRoomChat.textContent = "ルームチャット";
	DOMChatModeDiv.appendChild(DOMlabelRoomChat);

	var DOMrbRoomChat = document.createElement("input");
	DOMrbRoomChat.id = "rbRoomChat";
	DOMrbRoomChat.setAttribute("type","radio");
	DOMrbRoomChat.setAttribute("style","font-size:10px;");
	DOMrbRoomChat.setAttribute("name","rbChatMode");
	DOMrbRoomChat.setAttribute("value","room");
	DOMrbRoomChat.addEventListener("change", function(){
		document.getElementById("RTCChat").classList.add("is-hide");
		document.getElementById("RTCRoomChat").classList.remove("is-hide");
	});
	DOMChatModeDiv.appendChild(DOMrbRoomChat);

	const battleChatButtonOption = localStorage.getItem("battleChat")
	var DOMp2 = document.createElement("span");
	DOMp2.setAttribute("style","font-size:12px;margin:0 20px;");
	description = 'F4キーで表示非表示を切替。全体チャット利用不可。匿名でない形で記録されます。書込内容は公開されています。';
	DOMp2.innerHTML = description + `
<span class="button-group-pills text-center" data-toggle="buttons">
        <label class="pointer btn btn-default ${battleChatButtonOption && battleChatButtonOption != "active" ? "active" : ""}" id="battleChat">
          <div>対戦中に表示</div>
        </label>
		        <label class="pointer btn btn-default" id="submit-report">
          <div>運営に通報</div>
        </label>
      </span>`;
	DOMDiv.appendChild(DOMp2);
	document.getElementById("battleChat").addEventListener("click", e => {
		localStorage.setItem("battleChat" ,e.currentTarget.classList[2])
	},false)

	document.getElementById("submit-report").addEventListener("click", submitChatReportApi, false)

	const CHAT_HEIGHT = localStorage.getItem("RTCRoomChatHeight")
	if(!CHAT_HEIGHT){
		localStorage.setItem("RTCRoomChatHeight",MOBILE_FLAG ? "40px":"150px")
	}
	if(CHAT_HEIGHT == "170px"){
		DOMKnobUp.style.visibility = "hidden"
	}else if(CHAT_HEIGHT == "40px"){
		DOMKnobDown.style.visibility = "hidden"
	}

	var DOMChatUl = document.createElement("ul");
	DOMChatUl.id = "RTCChat";
	DOMChatUl.setAttribute("style",`height:${localStorage.getItem("RTCRoomChatHeight")};`);
	DOMDiv.appendChild(DOMChatUl);

	var DOMRoomChatUl = document.createElement("ul");
	DOMRoomChatUl.id = "RTCRoomChat";
	DOMRoomChatUl.innerHTML = `<li style="position: absolute;visibility: hidden;"></li>`
    DOMRoomChatUl.classList.add('is-hide');
	DOMRoomChatUl.setAttribute("style",`height:${localStorage.getItem("RTCRoomChatHeight")};`);

	DOMDiv.appendChild(DOMRoomChatUl);

	var DOMForm = document.createElement("div");
	DOMForm.setAttribute("style","margin:10px 0; padding:0;");
	DOMDiv.appendChild(DOMForm);

	// ログインしていないユーザーは利用不可にする
	//userName = document.getElementsByClassName("user__name")[0].textContent;
	//if (userName && !userName.match(/^guest/)) {
	DOMChatInput = document.createElement("input");
	DOMChatInput.id = "ChatInput";
	DOMChatInput.setAttribute("type","text");
	DOMChatInput.setAttribute("name","text");
	DOMChatInput.setAttribute("placeholder","メッセージを入力　[コマンド #譜面ID or 譜面URL でリクエストができます。例：#22097 ランダム：#random] ");
	DOMChatInput.setAttribute("autocomplete","off");

	DOMChatInput.addEventListener("input",function(event){

		//チャット入力中は自動遷移しない。(入力後に自動遷移する)
		if(event.target.value == "" && AutoMovehref && document.getElementById("RTC_AutoMove").checked){
			window.location.href = AutoMovehref
		}

		//文字数カウント処理
		document.getElementById("chat-input-limit").textContent = event.target.value.length
		if(event.target.value.length > 200){
			document.getElementById("chat-limit").classList.add("text-warning")
		}else{
			document.getElementById("chat-limit").classList.remove("text-warning")
		}
	});
	DOMForm.appendChild(DOMChatInput);

	var DOMChatLimit = document.createElement("span");
	DOMChatLimit.id = "chat-limit"
	DOMChatLimit.innerHTML = `<span id="chat-input-limit">0</span> / 200`
		DOMForm.appendChild(DOMChatLimit);


	var DOMChatSubmit = document.createElement("input");
	DOMChatSubmit.setAttribute("type","button");
	DOMChatSubmit.setAttribute("value","送信");
	DOMChatSubmit.setAttribute("style","width:15%;");
	DOMChatSubmit.setAttribute("class","btn btn-light");
	DOMChatSubmit.addEventListener("click", SubmitMessage);
	DOMForm.appendChild(DOMChatSubmit);
	//コメント入力後Enterを押したら送信
	DOMChatInput.addEventListener("keydown" , function(event){
		if(!event.isComposing && event.code == "Enter" && document.getElementById("ChatInput").value){
			DOMChatSubmit.click();
			event.stopImmediatePropagation()
		}
	});
	//}


	window.addEventListener("beforeunload" , function(event){
		if(limitter>0){
			sessionStorage.setItem("LIMITTER",requestDate)
		}
	});
	if(sessionStorage.getItem("LIMITTER")){
		requestDate = +sessionStorage.getItem("LIMITTER")
		requestLimit = setInterval(() => { requestLimitter(+sessionStorage.getItem("LIMITTER_TIME")) },1000)
	}
	document.addEventListener("click" , function(event){

		const focusing_area = event.target.type == "text" || event.target.type == "select-one" || document.activeElement.id == "RoomNameArea" || document.activeElement.id == "roomName" ? true:false
		const GET_SELECTION = window.getSelection().toString()
		const selecting_input = String(GET_SELECTION) && document.activeElement.type == "text" ? true:false
		const notPlaying = !focusing_area && !selecting_input && (GET_SELECTION == getSelectionBak || GET_SELECTION == "") && !playing
		const playingFocus = playing && event.target.closest(".chatArea") != null

		// ログインしていないユーザーは利用不可にする
		// userName = document.getElementsByClassName("user__name")[0].textContent;
		// if (userName && !userName.match(/^guest/)) {
		if(!PHONE_TABLET_FLAG && (notPlaying || playingFocus)){
			document.getElementById("ChatInput").focus();
			getSelectionBak = ""
		}
		// }
		getSelectionBak = GET_SELECTION
	});
	document.addEventListener("change" , function(event){
		if(!PHONE_TABLET_FLAG && document.activeElement.id != 'keyword'){
			$('.chatArea input[name="text"]:visible').focus();
		}
	});
	//F4キークリックで表示非表示切り替え
	window.addEventListener("keydown" , function(event){
		if(event.code == "F4" && (playing == false || document.getElementsByClassName("RTCRoomPlayerName").length >= 2 && playing == true)){

			if(document.getElementsByClassName("chatArea")[0].style.length == 1){

				if(document.getElementsByClassName("chatArea")[0].style.display == "block"){
					$('.chatArea').animate({height: 'hide',opacity:'hide'}, 'nomal')
					sessionStorage.setItem("chatOpen","false")
				}else{
					$('.chatArea').animate({height: 'show',opacity:'show'}, 'nomal')
					const Chat = document.getElementById('RTCRoomChat');
					Chat.scrollTo(0, Chat.scrollHeight)
					sessionStorage.setItem("chatOpen","true");

					// ログインしていないユーザーは利用不可にする
					// userName = document.getElementsByClassName("user__name")[0].textContent;
					// if (userName && !userName.match(/^guest/)) {
					document.getElementById("ChatInput").focus();
					// }
				}

			}

			event.preventDefault()
		}
	});
	if(location.href.indexOf("https://typing-tube.net/movie/show/")>-1 && localStorage.getItem("RTC_Scroll") != "false"){
		window.scrollBy({
			top:CONTROLBOX_SELECTOR.getBoundingClientRect().bottom-document.documentElement.clientHeight+250+document.getElementById("RTCStatus_Area").clientHeight
		})
	}
	// ログインしていないユーザーは利用不可にする
	// userName = document.getElementsByClassName("user__name")[0].textContent;
	// if (userName && !userName.match(/^guest/)) {
	//ページ読み込み時、チャットが表示されているならDOMChatInputに自動フォーカス by.Toshi
	if(!PHONE_TABLET_FLAG){
		if(document.getElementsByClassName("chatArea")[0].style.display == "block"){
			// ログインしていないユーザーは利用不可にする
			// userName = document.getElementsByClassName("user__name")[0].textContent;
			// if (userName && !userName.match(/^guest/)) {
			document.getElementById("ChatInput").focus();
			// }
		}
	}
	// }
	//F8キークリックで key/sec と key/minのトグル
	window.addEventListener("keydown" , function(event){
		if(event.code == "F8"){
			isDispFmtKeySec = !isDispFmtKeySec;
		}
	});
}




/**
*@note 対戦用のインタラクティブエリア作成 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note チャット関連 ここから ---
*/

let requestLyric
let requestDate

/**
*@Description 全体ルーム読み込み
*/
function addWholeRoomsUpdateEvent(){
	wholeRoom = new updateRoomsInfo()

	//全体Room情報自動更新
	var rooms = firebase.database().ref('rooms');
	rooms.on('child_added', wholeRoom.onAddRoom)
	rooms.on('child_changed', wholeRoom.onChangeRoom);
	rooms.on('child_removed', wholeRoom.onRemoveRoom);
}


/**
*@Description チャット送信
*/


function connectMessageRef(){

	if(document.getElementById("RTCChat").classList[0] == "is-hide"){
		return firebase.database().ref('roomChat/' + roomID).push();
	}else{
		return firebase.database().ref('chats').push();
	}

}

let createReq
let SubmitedWord
function SubmitMessage(){
	if(DOMChatInput.value.length == 0 || DOMChatInput.value.length > 200){
		return;
	}
	if(SubmitedWord == DOMChatInput.value || document.getElementById("ChatInput").placeholder.match("連投")){
		//チャットボックスを初期化
		chatInputClear()
		return;
	}


	if(DOMChatInput.value.match("https://typing-tube.net/movie/") || (DOMChatInput.value.match("#") || DOMChatInput.value.match("＃")) && !isNaN(hankaku2Zenkaku( (DOMChatInput.value.slice(1)) ))){
		const TYPING_DATA_NUMBER = +hankaku2Zenkaku((DOMChatInput.value).replace(/[^0-9０-９]/g, ''))
		if(requestLimit){
			DOMChatInput.value = "";
			return;
		}

		$.ajax({
			type: 'POST',
			url: '/movie/lyrics/' + TYPING_DATA_NUMBER,
			headers: {
				'X-CSRF-Token' : document.getElementsByName('csrf-token').item(0).content
			},
			success:function(data){
				createReq = new createRequest(data , TYPING_DATA_NUMBER ,"Request")
				createReq.createRequest()
			}
		});

	}else if(hankaku2Zenkaku(DOMChatInput.value) == "#random"){
		if(requestLimit){
			DOMChatInput.value = "";
			return;
		}
		random_generator()
	}else{
		//連投カウントを進める
		chatLimitCount()
		const messageRef = connectMessageRef()
		submitChatApi()
		if(continuousPitchingCount >= 8){
			messageRef.set({
				"userID": myID,
				"name": userName,
				"text" : DOMChatInput.value,
				"announce" : true,
			});
		}else{
			messageRef.set({
				"userID": myID,
				"name": userName,
				"text" : DOMChatInput.value
			});
		}
		SubmitedWord = DOMChatInput.value

	}

	chatInputClear()

}

function submitChatApi(){
	const options = {
		method: 'POST', // HTTPメソッドを指定
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-Token' : document.getElementsByName('csrf-token').item(0).content
		},
		body: JSON.stringify({
			room_id: (document.getElementById('rbRoomChat').checked ? roomID : undefined),
			name: userName,
			text: DOMChatInput.value,
			firebase_user_id: myID,
		})
	}

	fetch("/api/chat/add", options);
}

function submitChatReportApi(event){
	const LIMIT = (+localStorage.getItem('submitReportLimit') + (60000 * 10))
	if(LIMIT > LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)){
		const remarningSubmitTime = Math.abs((LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp) - LIMIT)/1000)
		const MIN = Math.floor((remarningSubmitTime/60))
		const SEC = Math.round(+String((remarningSubmitTime/60)).slice(1)*60)

		alert(`通報機能は${MIN}分${SEC}秒後に使用可能です。`)
		return;
	}

	const kick_password = Math.floor( Math.random() * (999 + 1 - 100) ) + 100
	const pass_form = prompt("問題のあるコメントは運営チームに通報することができます。\nよろしければ入力欄に　"+kick_password+"　を入力してください。")
	if (pass_form == kick_password) {
		const options = {
			method: 'POST', // HTTPメソッドを指定
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-Token' : document.getElementsByName('csrf-token').item(0).content
			},
			body: JSON.stringify({
				room_id: (document.getElementById('rbRoomChat').checked ? roomID : undefined),
				name: userName,
				firebase_user_id: myID
			})
		}

		fetch("/api/chat/report", options).then(() => {
			alert(`チャット内容の通報が完了しました。`)
			localStorage.setItem('submitReportLimit',LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp))
		});
	}

}

class createRequest{

	constructor(data , number ,messageType) {
		this.data = data;
		this.messageType = messageType;
		this.dataNumber = number
	}

	createRequest(){

		const DATA_SPLIT = this.data.split("\n")
		const SLICE_SEARCH = DATA_SPLIT[0].search("http")
		const REQUEST_MUSIC_NAME = DATA_SPLIT[0].slice(0 , SLICE_SEARCH-1)
		requestLyric = new requestLyricInfo(this.data);
		requestLyric.splitData();
		requestLyric.createTypingData();
		requestLyric.getTypingDataInfo();
		const messageRef = connectMessageRef()

		messageRef.set({
			"userID": myID,
			"name": userName,
			"number": this.dataNumber,
			"musicName":REQUEST_MUSIC_NAME,
			"movieTime":`${requestLyric.movieTime_mm}:${requestLyric.movieTime_ss}`,
			"totalNotes": [requestLyric.totalNotesRomaMode , requestLyric.totalNotesKanaMode],
			"medianSpeed": [requestLyric.medianRomaSpeed.toFixed(2) , requestLyric.medianKanaSpeed.toFixed(2)],
			"maxSpeed": [requestLyric.maxRomaSpeed.toFixed(2) , requestLyric.maxKanaSpeed.toFixed(2)],
			"messageType" : this.messageType
		});
		requestDate = new Date().getTime()
		sessionStorage.setItem("LIMITTER_TIME","20000")
		requestLimit = setInterval(() => { requestLimitter(+sessionStorage.getItem("LIMITTER_TIME")) },1000)

	}

}

/**
*@Description チャットボックスを初期化
*/
function chatInputClear(){

	DOMChatInput.value = "";
	document.getElementById("chat-input-limit").textContent = 0

}


let chatSubmitTime = 0
let continuousPitchingCount = 0
const continuousPitchingCheckTime = 30000


/**
*@Description チャットの連投カウンター
*/

function chatLimitCount(){

	if(new Date().getTime() - chatSubmitTime > continuousPitchingCheckTime){
		chatSubmitTime = new Date().getTime()
		continuousPitchingCount = 1
	}else{

		continuousPitchingCount++
	}

	if(continuousPitchingCount >= 8){
		requestDate = new Date().getTime()
		sessionStorage.setItem("LIMITTER_TIME","100000")
		requestLimitter(+sessionStorage.getItem("LIMITTER_TIME"))
		requestLimit = setInterval(() => { requestLimitter(+sessionStorage.getItem("LIMITTER_TIME")) },1000)
	}

}



/**
*@Description チャット欄更新
*/

class ChatUpdate {
	constructor(data) {
		this.data = data;
	}

	onChatUpdate(snapshot) {
		const msg = snapshot.val();

		if(roomID == null || this.data == "RTCRoomChat"){
			playSE("chat");
		}

		var li = document.createElement("li");
		li.setAttribute('data-id',msg.userID)
		const announce = `<span class="text-success">　(announce: 連投を検知しました。100秒間チャット送信ができなくなります。)</span>`
		if(msg.messageType == "Request" || msg.messageType == "Random"){
			const REQ_DATA =
				  `#${msg.messageType} - <a style="background:#2c487e;" href="https://typing-tube.net/movie/show/${msg.number}">[ID${msg.number}] ${msg.musicName}</a> [<span class="request-playing" value=${msg.number}>視聴</span>]
<span class="rtc-request-info">
<span><i class="far fa-clock"></i>&nbsp;
${msg.movieTime}</span>
<span><i class="icon-drum-solid"></i>&nbsp;
<span class="request-roma-info">${msg.totalNotes[0]}</span>
<span class="request-kana-info">${msg.totalNotes[1]}</span>打</span>

<span><i class="icon-tachometer-alt-solid"></i>&nbsp;中央値
<span class="request-roma-info">${msg.medianSpeed[0]}</span>
<span class="request-kana-info">${msg.medianSpeed[1]}</span>打/秒 | 最高
<span class="request-roma-info">${msg.maxSpeed[0]}</span>
<span class="request-kana-info">${msg.maxSpeed[1]}</span>打/秒</span>
</span>`

			li.innerHTML = `<span class="${msg.userID == myID ? 'mine' : ''}">${msg.name}</span> : <span>${REQ_DATA}</span>`
		}else{
			li.innerHTML = `<span class="${msg.userID == myID ? 'mine' : ''}">${msg.name}</span> : <span>${msg.announce ? (escapeHtml(msg.text) + announce)  : escapeHtml(msg.text)}</span>`;
		}
		//this.data : "RTCChat" or "RTCRoomChat"
		const target = document.getElementById(this.data);

		if(target.scrollTop + 10 >= target.scrollHeight - target.clientHeight){
			target.appendChild(li);
			target.scrollTop = target.scrollHeight - target.clientHeight;
		}else{
			target.appendChild(li);
		}

		if(msg.messageType == "Request" || msg.messageType == "Random"){
			const REQUEST_PLAYING = document.getElementsByClassName("request-playing")
			REQUEST_PLAYING[REQUEST_PLAYING.length-1].addEventListener("click" , requestPlay)
		}
	}
}


/**
*@Description コメント内のHTMLタグをエスケープ
*/
function escapeHtml(str) {
	str = str.replace(/&/g, '&amp;');
	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/"/g, '&quot;');
	str = str.replace(/'/g, '&#39;');
	return str;
}


/**
*@Description 全角数字を半角数字に変換
*/
function hankaku2Zenkaku(str) {
	return str.replace(/[０-９]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
}


/**
*@Description リクエストコマンドリミッター
*/
let requestLimit
let limitter = 0
function requestLimitter(limitterTime){
	const NOW_DATE = new Date().getTime()
	limitter = (requestDate + limitterTime) - NOW_DATE

	if(limitterTime == 20000){
		document.getElementById("ChatInput").setAttribute("placeholder",`メッセージを入力 (次のコマンド使用可能まで ${Math.floor(limitter / 1000)} 秒)`);
	}else{
		document.getElementById("ChatInput").setAttribute("placeholder",`連投を検知しました。 (次のチャット使用可能時間まで ${Math.floor(limitter / 1000)} 秒)`);
	}

	if(limitter < 0){
		document.getElementById("ChatInput").setAttribute("placeholder",`メッセージを入力　[コマンド #譜面ID or 譜面URL でリクエストができます。例：#22097 ランダム：#random] `);
		clearInterval(requestLimit)
		requestLimit = null
		sessionStorage.removeItem("LIMITTER")
		sessionStorage.removeItem("LIMITTER_TIME")
	}
}


/**
*@note チャット関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note リクエスト視聴再生 ここから ---
*/



function requestPlay (event){
	if(playing){ return;}
	if(typeof player != "undefined" && player.getPlayerState() == 1){
		player.pauseVideo()
	}
	$.ajax({
		type: 'POST',
		url: '/movie/lyrics/' + (+event.target.getAttribute("value")),
		headers: {
			'X-CSRF-Token' : document.getElementsByName('csrf-token').item(0).content
		},
		success:function(data){
			const DATA_SPLIT = data.split("\n")
			start_time = -1
			speed_title = DATA_SPLIT[0].match(/^【\d?\.?\d?\d倍速】/)
			if(speed_title){
				speed_title = parseFloat(speed_title[0].slice(1))
				if(!speedList.includes(speed_title)){
					speed_title = false
				}
			}
			for(let i=0;i<DATA_SPLIT.length;i++){
				if(i>0){
					if(start_time == -1 && DATA_SPLIT[i].split("\t")[2]){
						start_time = Math.floor(+DATA_SPLIT[i].split("\t")[0])
						preview_time = +DATA_SPLIT[i].split("\t")[0]
					}else if(DATA_SPLIT[i].split("\t")[0].substr( -5, 1 ) == "."){
						start_time = Math.floor(+DATA_SPLIT[i].split("\t")[0])
						preview_time = +DATA_SPLIT[i].split("\t")[0]
						break;
					}
				}
			}
			onYouTubeIframeAPIReady_Chat(data.match(/(v=).*\n/)[0].slice(2))
		}
	});
}

let player_demo
function onYouTubeIframeAPIReady_Chat(preview_videoid) {

	document.getElementsByTagName('section')[0].insertAdjacentHTML('beforebegin', `<div id="player_demo" style="position: fixed;
    z-index: 102;
    width: 355px;
    height: 200px;
    bottom: 30px;
    right: 17px;"></div>`)

	player_demo = new YT.Player('player_demo', {
		playerVars: {
			autoplay: 1,
			disablekb: 1,
			modestbranding:1,
			origin: location.protocol + '//' + location.hostname + "/",
			start: start_time
		},
		videoId: preview_videoid,
		events: {
			'onReady': onPlayerReady_demo,
			'onStateChange': onPlayerStateChange_demo

		}
	});
}

let random
let randomName
let player_random
if(+(location.pathname).replace(/[^0-9]/g, '') > 50571 && +(location.pathname).replace(/[^0-9]/g, '') > localStorage.getItem("randomMaxLength")){
	localStorage.setItem("randomMaxLength",(location.pathname).replace(/[^0-9]/g, ''))
}
function random_generator(){
	if(document.getElementById("player_box") == null){
		document.querySelector("head").insertAdjacentHTML('afterend', `<span id=player_box style="position:absolute;visibility:hidden;"></span>`)
	}
	random = Math.floor(Math.random() * (50571 - 5 + 1) + 5)
	$.ajax({
		type: 'POST',
		url: '/movie/lyrics/' + random,
		headers: {
			'X-CSRF-Token' : document.getElementsByName('csrf-token').item(0).content
		},
		success:function(data){
			if(data.match(/(v=).*\n/) != null){
				createReq = new createRequest(data , random , "Random")
				onYouTubeIframeAPIReady_random(data.match(/(v=).*\n/)[0].slice(2))
			}else{
				random_generator()
			}
		},error: function(data) {
			random_generator()
		}
	});
}

function onYouTubeIframeAPIReady_random(preview_videoid) {
	player_random = ""
	player_random = new YT.Player('player_box', {
		height: 100 ,
		width: 100 ,
		playerVars: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			modestbranding:1,
			origin: location.protocol + '//' + location.hostname + "/",
			start: 0
		},
		videoId: preview_videoid,
		events: {
			'onReady': onPlayerReady_check,
			'onError': onPlayerReady_check,


		}
	});
}

function onPlayerReady_check(event){

	if(event.target.videoTitle){
		createReq.createRequest()
		document.getElementById("player_box").remove()
	}else{
		//削除済みの動画だった場合は再度ランダム抽選
		document.getElementById("player_box").remove()
		random_generator()
	}

}

/**
*@note リクエスト視聴再生 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note リクエスト譜面情報取得 ここから ---
*/



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
		const speedList = [0.25,0.5,0.75,1.00,1.25,1.5,1.75,2]
		this.lyricsArray = []
		this.kanaLyric = ""
		this.titleSpeed = 1
		if(speed_){
			this.titleSpeed = parseFloat(speed_[0].slice(1))
			if(!speedList.includes(this.titleSpeed)){
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

				//打鍵パターン生成を行わなくて良い文字はそのままparseLyric.typingArrayに追加
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

			//parseLyric.typingArrayのi番号がend行と同じ番号なら総合打鍵数に含まない
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






/**
*@note リクエスト譜面情報取得 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note クッキー関連 ここから ---
*/


/**
*@description クッキーデータの読み込み
*@param name
*@return val
*/
function ReadFromCookie(name){
	var result = null;

	var cookieName = name + '=';
	var allcookies = document.cookie;

	var position = allcookies.indexOf( cookieName );
	if( position != -1 )
	{
		var startIndex = position + cookieName.length;

		var endIndex = allcookies.indexOf( ';', startIndex );
		if( endIndex == -1 )
		{
			endIndex = allcookies.length;
		}

		result = decodeURIComponent(
			allcookies.substring( startIndex, endIndex ) );
	}
	return result;
}

/**
*@description クッキーにデータの書き込み
*@param name
*@param val
*/
function WriteToCookie(name, val){
	var expire = new Date();
	expire.setTime( expire.getTime() + 1000 * 3600 * 24 * 30);
	document.cookie = name + '=' +  encodeURIComponent(val) + '; path=/ ; expires=' + expire.toUTCString();
}


/**
*@note クッキー関連 ここから ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////











/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note room関連 ここから ---
*/

let roomID;
let playSpeeds = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00];

class updateRoomsInfo{

	/**
*@Description Roomが追加された
*/
	onAddRoom(snapShot){
		const msg = snapShot.val();
		const roomID_ = snapShot.ref_.path.pieces_[1];
		if(roomID_ == "null"){ return; }

		const roomName = msg.roomName;
		const desc = msg.description;
		const state = msg.state;
		const movieInfo = msg.movieInfo
		const roomMaster = msg.roomMaster;
		const players = msg.users;
		const roomPassWord = msg.roomPassWord;

		//キックされた部屋なら表示しない
		if(msg.kick != null && myIP){
			if(msg.kick[myIP.replace(/\./g , "")] != undefined){
				return;
			}
		}

		var DOMroom = document.createElement("div");
		DOMroom.id = roomID_;
		DOMroom.classList.add("RTCroom");

		DOMroom.addEventListener("click",function(event){
			const roomID_ = event.currentTarget.id

			if(event.currentTarget.closest(".RTCroom")){
				if(/debug$/.test(event.currentTarget.id)){
					if (window.confirm("このルームは対戦機能テスト用のデバッグルームです。\nこのルームに参加するにはTampermonkeyアドオンとテストページ用対戦スクリプトをブラウザに導入する必要があります。\nTampermonkeyアドオンを導入済みの場合はOKを選択してください。")) {

						firebase.database().ref('debugData').once('value').then(debugData => {
							if(!localStorage.getItem("testScriptVersion")){
								window.open(debugData.val().ScriptURL, '_blank');
								alert("別タブで開かれたテストページ用対戦スクリプトを更新・または導入してください。")
							}
							EnterRoom(roomID_);
						})

					}else{
						return;
					}
				}


				if(event.currentTarget.id.length == 14){
					EnterRoom(roomID_);
				}else if(event.currentTarget.id.length == 15){
					const pass_form = window.prompt("このルームに参加するにはパスワードが必要です")
					if(pass_form){
						firebase.database().ref('rooms/' + roomID_ + '/roomPassWord').once('value').then(roomPassWord => {
							if(roomPassWord.val() == pass_form){
								EnterRoom(roomID_);
							}else{
								alert("パスワードが違います。")
							}
						})
					}
				}


			}
		});
		document.getElementById("RTCRooms").appendChild(DOMroom);

		var DOMroomTitle = document.createElement("div");
		DOMroomTitle.setAttribute("id","roomTitle");
		DOMroomTitle.setAttribute("style",`display: flex;justify-content: space-between;`);
		DOMroom.appendChild(DOMroomTitle);

		var DOMName = document.createElement("p");
		DOMName.setAttribute("style","font-size:14px;margin:2px 2px;");
		DOMName.textContent = roomName;
		DOMName.classList.add("RTCroomName");
		DOMroomTitle.appendChild(DOMName);

		if(roomPassWord){
			DOMName.insertAdjacentHTML('afterend', `<i class="icon-lock" style="margin: 6px 9px 0 5px;font-size: 1.5rem;"></i>`)
		}

		var DOMDesc = document.createElement("p");
		DOMDesc.setAttribute("style","font-size:10px;margin:2px 2px;");
		DOMDesc.textContent = desc;
		DOMDesc.classList.add("RTCroomDescription");
		DOMroom.appendChild(DOMDesc);

		var DOMstatus = document.createElement("p");
		DOMstatus.setAttribute("style","font-size:8px;margin:10px 2px;");
		DOMstatus.classList.add("RTCroomPlayStatus");

		if(state == "play"){
			DOMstatus.textContent = "プレイ中";
		}else if(state == "result"){
			DOMstatus.textContent = "プレイ終了";
		}else{
			DOMstatus.textContent = "プレイ前";
		}
		DOMroom.appendChild(DOMstatus);


		var DOMMovieTitle = document.createElement("p");
		DOMMovieTitle.setAttribute("style","font-size:8px;margin:2px 2px;");
		DOMMovieTitle.classList.add("RTCroomMovieTitle");
		if(movieInfo){
			DOMMovieTitle.textContent = "楽曲: [ID" + movieInfo.movieID + "]" + movieInfo.movieTitle;
		}
		DOMroom.appendChild(DOMMovieTitle);

		var DOMplayers = document.createElement("p");
		DOMplayers.setAttribute("style","font-size:8px;margin:10px 2px; 2px");
		DOMplayers.classList.add("RTCroomPlayers");
		DOMroom.appendChild(DOMplayers);

		if(players != null){
			let playersName = ""
			Object.keys(players).forEach(function(key) {
				playersName +=  " " + players[key].name;
			});
			DOMplayers.textContent += "参加者:"+playersName
		}

		document.getElementById("noRoomMes").classList.add('is-hide');
	}


	/**
*@Description Room情報が変更された
*/
	onChangeRoom(snapshot){
		const msg = snapshot.val();
		const roomID_ = snapshot.ref_.path.pieces_[1];
		const roomName = msg.roomName;
		const desc = msg.description;
		const state = msg.state;
		const movieInfo = msg.movieInfo
		const roomMaster = msg.roomMaster;
		const players = msg.users;
		const roomPassWord = msg.roomPassWord;
		const roomCreateTimeStamp = msg.roomCreateTimeStamp;
		//キックされた部屋なら表示しない
		if(msg.kick != null && myIP){
			if(msg.kick[myIP.replace(/\./g , "")] != undefined){
				return;
			}
		}

		const ELAPSED_TIME = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp) - roomCreateTimeStamp;
		let sec = ELAPSED_TIME / 1000;
		let hour = Math.floor(sec / 3600);
		let min = Math.floor(sec % 3600 / 60);
		console.log(`${hour}時間 ${min}分`);


		//変更されたルームの情報を上書き
		document.getElementById(roomID_).getElementsByClassName("RTCroomName")[0].textContent = roomName;
		document.getElementById(roomID_).getElementsByClassName("RTCroomDescription")[0].textContent = desc;
		if(movieInfo){
			document.getElementById(roomID_).getElementsByClassName("RTCroomMovieTitle")[0].textContent= "楽曲: [ID" + movieInfo.movieID + "]" + movieInfo.movieTitle;
		}
		if(state == "play"){
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayStatus")[0].textContent = "プレイ中";
		}else if(state == "result"){
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayStatus")[0].textContent = "プレイ終了";
		}else{
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayStatus")[0].textContent = "プレイ前";
		}

		if(players != null){

			let playersName = ""
			Object.keys(players).forEach(function(key) {
				playersName += " " + players[key].name;
			});
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayers")[0].textContent = "参加者:"+playersName
		}

	}

	/**
*@Description Roomが削除された
*/
	onRemoveRoom(snapshot){
		const msg = snapshot.val();
		const roomID_ = snapshot.ref_.path.pieces_[1];
		const RemoveRoom = document.getElementById(roomID_)
		if(RemoveRoom){
			document.getElementById(roomID_).remove();
		}
		if(document.getElementById("RTCRooms").getElementsByClassName("RTCroom").length === 0){
			document.getElementById("noRoomMes").classList.remove('is-hide');
			document.getElementById("noRoomMes").textContent = "現在ルームが存在しません。";
		}
	}



}






/**
*@Description [新しくルームを作成] ボタンが押された
*/
function onClickCreateNewRoom(){
	playSE("click");
	document.getElementById("createNewRoom").classList.add('is-show');
	document.getElementById("roomName").focus();
	document.getElementById("roomName").setSelectionRange(999, 999);
}

/**
*@Description　32文字の一意な文字列を作成
*/
function getUniqueStr(){
	const strong = 1000;
	return new Date().getTime().toString(16) + Math.floor(strong*Math.random()).toString(16);
}

/**
*@Description [ルームを作成] ボタンが押された
*/

let debugMode = false
function onClickCreateRoom(){

	const roomPassWord = document.getElementById("Enable_PassWord").checked ? document.getElementById("roomPassWordArea").value:""
	let roomID_ = getUniqueStr()


	//roomIDが14文字のIDになるように調整
	if(roomID_.length < 14){
		while(roomID_.length != 14){
			roomID_ += "0"
		}
	}else if(roomID_.length > 14){
		while(roomID_.length != 14){
			roomID_ = roomID_.slice(0,-1)
		}
	}


	if(roomPassWord){
		roomID_ = "P"+roomID_
	}

	if(debugMode){
		roomID_ = roomID_.replace(/.{5}$/,"debug")
	}


	const description = document.getElementById("roomDescription").value;

	let _movieID = movieID;
	if(_movieID == null){
		_movieID = " ";
	}
	let _movieTitle = movieTitle;
	if(_movieTitle == null){
		_movieTitle = " ";
	}

	const roomMaster = myID;
	const roomName = document.getElementById("roomName").value;
	const state = "idle";


	var path = firebase.database().ref('rooms/' + roomID_);
	path.set({
		"description": description,
		"movieInfo":{
			"movieID" :_movieID,
			"movieTitle": _movieTitle
		},
		"roomMaster": roomMaster,
		"roomName": roomName,
		"roomPassWord": roomPassWord,
		"roomCreateTimeStamp": LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp),
		"state": state,
		"playSpeed": 3,
		"playMode": "Score",
		"AutoStart": false
	});

	document.getElementById("createNewRoom").classList.remove('is-show');
	EnterRoom(roomID_);
}

/**
*@Description [キャンセル] ボタンが押された
*/
function onClickCancel(){
	playSE("cancel");
	document.getElementById("createNewRoom").classList.remove('is-show');
}

let isEnter;
let roomChat
let roomUpdate


/**
*@Description プレイ者がいなければ部屋の状態をidleにする
*@param
*/
function roomStateCheck(roomState , roomUsers){
	if(roomState == "play" || roomState == "result"){
		const playCheck = (userState) => userState == "play";
		let usersState = []
		const roomUsersKey = Object.keys(roomUsers)
		for(let i=0;i<roomUsersKey.length;i++){
			const key = roomUsersKey[i]
			if(myID != key){
				usersState.push(roomUsers[key].state)
			}
		}

		if(!usersState.some(playCheck)){
			var updates = {};
			updates['/rooms/' + roomID + '/state'] = "idle";
			roomState = "idle"
			firebase.database().ref().update(updates);
		}
	}
	return roomState;
}

/**
*@Description ホストならゲーム開始ボタン、参加者なら準備完了 or 途中参加ボタンを表示する
*@param
*/
function readyButtonDisplay(isRoomState){

	if(!isRoomMaster){
		document.getElementById("RTCbtnReady").classList.remove("is-hide");
		document.getElementById("RTCbtnGameStart").classList.add("is-hide");
		if(isRoomState == "play"){
			document.getElementById("RTCbtnReady").value = "途中参加"
		}

	}else if(isRoomMaster){
		document.getElementById("RTCbtnReady").classList.add("is-hide");
		document.getElementById("RTCbtnGameStart").classList.remove("is-hide");

		if(movieID && !playing){
			window.addEventListener("keydown" , ready_key)
		}

	}

}

/**
*@Description (F5時)ホストが自動開始設定を有効にしている。
*@param
*/
function autoStartCheck(AutoStart , roomState , Users){

	if(isRoomMaster && AutoStart){
		document.getElementById("RTC_AutoStart").checked = true

		if(roomState == "idle" && Object.keys(Users).length > 1){
			let updates = {}
			prevState = "Auto_ready"
			updates['users/' + myID + '/state'] = "Auto_ready";
			firebase.database().ref().update(updates);
		}
	}

}


/**
*@Description デバッグルームに入室しているか
*@param
*/
function inDebugRoomCheck(_roomID){
	if(/debug$/.test(_roomID)){
		if(localStorage.getItem("testScriptVersion")){
			debugMode = true
		}

		//バージョンチェック
		firebase.database().ref('debugData').once('value').then(debugData => {
			const msg = debugData.val()
			if(localStorage.getItem("testScriptVersion") != msg.version){
				document.getElementById("RTCRoomPlayers").insertAdjacentHTML("beforeend",`<a href="${msg.scriptURL}" style="text-decoration: underline;">テスト用対戦スクリプトを${localStorage.getItem("testScriptVersion") ? "更新":"導入"}</a>
<div>スクリプト導入後に<a href="https://typing-tube.net/movie/show/38539?test=test" style="text-decoration: underline;">ココ</a>をクリックしてテストページに移動してください。</<div>`)
				var updates = {}
				updates['/rooms/' + roomID + '/users/' + myID + '/state'] = 'noScript';
				updates['/users/' + myID + '/state'] = prevState = "noScript";
				firebase.database().ref().update(updates);
			}
		})
		if(debugMode && location.pathname.match("/movie/show") && location.search != '?test=test'){
			window.location.href = location.href+'?test=test'
		}
	}
}

/**
*@Description roomに入室した
*@param _roomID
*/
function EnterRoom(_roomID){

	playSE("greet");
	//初めの数秒は音を鳴らさない
	RTCSECancel()

	//are you ready? SoundEffect Load
	if(!matchconfirm_sound){
		matchconfirm_sound = new AudioContext();
		matchconfirm_sound_load()
	}
	if(!CountDown_sound){
		CountDown_sound = new AudioContext();
		countDownEnd_sound = new AudioContext();
		countDownEnd_sound_load()
		CountDown_sound_load()
	}
	isEnter = true;
	roomID = _roomID;


	firebase.database().ref('rooms/' + _roomID).once('value').then(room => {
		//入室していたroomが無くなった
		if(room.val() == null){
			ExitRoom();
		}else{
			//チャット先をルームチャットに変更
			document.getElementById("rbRoomChat").checked = true;
			document.getElementById("RTCRoomChat").classList.remove("is-hide");
			document.getElementById("RTCChat").classList.add("is-hide");
			document.getElementById("RTCRoomName").innerHTML = "ルーム - <span id='RoomNameArea'>" + room.val().roomName + "</span>";
			roomUsersCount(room.val().users ? Object.keys(room.val().users).length : 1)


			//鍵部屋に入室している。
			if(_roomID.length == 15){
				document.getElementById("RoomNameArea").insertAdjacentHTML('afterend', `<i id="roomKey" class="icon-key-solid"></i>`)
				document.getElementById("roomKey").addEventListener("click",getRoomKey)
			}

			//入室ステータス送信
			var updates = {};
			//ルーム内ユーザー情報
			updates['/rooms/' + roomID + '/users/' + myID + '/name'] = userName;
			updates['/rooms/' + roomID + '/users/' + myID + '/state'] = 'idle';
			if(myIP){
				updates['/rooms/' + roomID + '/users/' + myID + '/IP'] = myIP;
			}

			//ユーザー情報更新
			updates['/users/' + myID + '/roomID'] = roomID;
			updates['/users/' + myID + '/name'] = userName;
			updates['/users/' + myID + '/status/score'] = "0.00";
			updates['/users/' + myID + '/status/miss'] = 0;
			updates['/users/' + myID + '/status/combo'] = 0;
			updates['/users/' + myID + '/status/clearline'] = 0;
			updates['/users/' + myID + '/status/combo'] = 0;
			updates['/users/' + myID + '/status/maxCombo'] = 0;
			updates['/users/' + myID + '/status/type'] = 0;
			updates['/users/' + myID + '/status/correct'] = 100;
			updates['/users/' + myID + '/status/moviePos'] = "0"
			updates['/users/' + myID + '/status/lineInput'] = " ";
			updates['/users/' + myID + '/status/lineRemain'] = " ";
			updates['/users/' + myID + '/status/count'] = 0;
			updates['/users/' + myID + '/status/SkipOptin'] = " ";
			updates['/users/' + myID + '/status/keySec'] = "0.00";
			updates['/users/' + myID + '/status/linekeySec'] = " ";
			updates['/users/' + myID + '/status/linekeySec'] = " ";

			if(document.getElementsByName('correct-word-color')[0] != null){
				const CORRECT_COLOR = document.getElementsByName('correct-word-color')[0].value
				const CLEAR_COLOR = document.getElementsByName('line-clear-color')[0].value
				updates['/users/' + myID + '/status/correctColor'] = CORRECT_COLOR == "transparent" ? "rgba(255,255,255,0.4)" : CORRECT_COLOR;
				updates['/users/' + myID + '/status/lineClearColor'] = CLEAR_COLOR == "transparent" ? "rgba(255,255,255,0.4)" : CLEAR_COLOR;
			}

			firebase.database().ref('/users/' + myID + '/status/ClearTime/').set({start:0});
			firebase.database().ref().update(updates);

			//room情報が更新された時用のイベントリスナー追加
			roomUpdate = new inRoomInfo()
			firebase.database().ref('/rooms/' + roomID).on('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));
			firebase.database().ref('/rooms/' + roomID + '/kick/').on('child_added', onAddKickUser);
			const roomUserInOut = firebase.database().ref('/rooms/' + roomID + '/users/')
			roomUserInOut.on('child_removed', onRemoveRoomUser);
			roomUserInOut.on('child_added', onAddRoomUser)


			//ルームマスターになっているか
			if(room.val().roomMaster == myID){
				becomeRoomMaster(room.val().movieInfo);
			}else{
				becomeCommon();
			}

			//プレイしていない曲であれば自動開始設定を確認(ルーム情報の更新前に適用)
			autoStartCheck(room.val().AutoStart , room.val().state , room.val().users)

			//ルームのstateを更新＆取得
			const isRoomState = roomStateCheck(room.val().state , room.val().users)

			//ルームセレクト画面非表示
			document.getElementById("RTCRoomSelectScene").classList.add('is-hide');

			//入室画面表示
			document.getElementById("RTCRoomIdleScene").classList.remove('is-hide');

			//デバッグルームチェック
			inDebugRoomCheck(_roomID)

			//選択されている曲を表示
			loadSelectMovie()



			//ルームチャット切り替え用ラジオボタンの表示
			document.getElementById("RTCchatModeDiv").classList.remove('is-hide');

			//ルームチャット欄自動更新
			var chats = firebase.database().ref('roomChat/' + roomID).limitToLast(30);
			roomChat = new ChatUpdate("RTCRoomChat")
			chats.on('child_added', roomChat.onChatUpdate.bind(roomChat));

			//プレイ速度更新
			changeSelectSpeed(room.val().playSpeed)

			//ルームステータス更新
			document.getElementById("combat_mode").value = room.val().playMode

			//ボタン等表示
			readyButtonDisplay(isRoomState)

			setTimeout(addWinnerTrophy,200)
		}
	});
}

/**
*@Description roomから退出した
*/
function ExitRoom(){

	//退出音を鳴らす
	playSE("exit");
	isEnter = false;
	isRoomMaster = false;
	var updates = {};
	updates['/users/' + myID + '/roomID'] = null;
	updates['/rooms/' + roomID + '/users/' + myID] = null;
	firebase.database().ref().update(updates);

	//ルームチャット欄自動更新解除
	var chats = firebase.database().ref('roomChat/' + roomID).limitToLast(30);
	chats.off('child_added', roomChat.onChatUpdate.bind(roomChat));

	//ルームチャットすべて削除
	var rc = document.getElementById("RTCRoomChat");
	while(rc.firstChild){
		rc.removeChild(rc.firstChild );
	}

	//ルームチャット切り替え用ラジオボタンの非表示
	document.getElementById("rbWorldChat").checked = true;
	document.getElementById("RTCChat").classList.remove("is-hide");
	document.getElementById("RTCRoomChat").classList.add("is-hide");
	document.getElementById("RTCchatModeDiv").classList.add('is-hide');

	if(!wholeRoom){
		addWholeRoomsUpdateEvent()
	}


	//room情報が更新された時用のイベントリスナー削除
	firebase.database().ref('/rooms/' + roomID).off('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));
	firebase.database().ref('/rooms/' + roomID + '/users/').off('child_added', onAddRoomUser);
	firebase.database().ref('/rooms/' + roomID + '/users/').off('child_removed', onRemoveRoomUser);
	firebase.database().ref('/rooms/' + roomID + '/kick/').off('child_added', onAddKickUser);
	window.removeEventListener("keydown" , ready_key)
	document.getElementById("RTCRoomSelectScene").classList.remove("is-hide");
	document.getElementById("RTCRoomIdleScene").classList.add('is-hide');

	firebase.database().ref('rooms/' + roomID + '/users/').once('value').then(users => {

		//もしroomに誰もいなければこのroomを削除
		if(users.val() === null || users.length === 0){

			firebase.database().ref("/rooms/" + roomID).set(null);
			firebase.database().ref("/roomChat/" + roomID).set(null);

		}else{

			firebase.database().ref('rooms/' + roomID).once('value').then(room => {
				//自分がルームマスターなら他の誰かにルームマスターを移動
				var newRoomMaster = {};
				var idx = 0;

				if(room.val().roomMaster != null && room.val().roomMaster  == myID){
					newRoomMaster = {};
					Object.keys(room.val().users).forEach(function(key){
						if(key != myID){
							newRoomMaster[idx++] = key;
						}
					});

					if(idx > 0){
						idx = Math.floor( Math.random() * idx);
						updates = {};
						updates['/rooms/' + roomID + '/roomMaster'] = newRoomMaster[idx];
						firebase.database().ref().update(updates);
					}
				}
				roomID = null;
			});
		}
	});
}

/**
*@Description 入室中のroom情報が更新された
*/
let AutoMovehref = ""

class inRoomInfo {

	onUpdateRoomInfo(snapshot){
		if(snapshot){
			const msg = snapshot.val();
			const updateKey = snapshot.ref_.path.pieces_[2];
			var updates = {};

			switch(updateKey){
					//ルームマスターが行う処理
				case "AutoStart":
					if(isRoomMaster && prevState == "idle" && msg && movieID){
						prevState = "Auto_ready"
						updates['users/' + myID + '/state'] = "Auto_ready";
					}
					break;

				case "playSpeed":
					changeSelectSpeed(msg)
					break;
				case "roomName":
					document.getElementById("RoomNameArea").textContent = msg
					break;
				case "users":
					firebase.database().ref('rooms/' + roomID + '/users').once('value').then(users => {
						roomUsersCount(Object.keys(users.val()).length)
					})
					break;
				case "playMode":
					document.getElementById("combat_mode").value = msg
					break;
				case "state":
					if(msg == "play"){
						document.getElementById("RTCbtnReady").setAttribute("value","途中参加");
					}else {
						document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
					}
					break;
				case "movieInfo":
					if(msg.movieID == 0){
						selectingMovie(msg)
					}else if(msg.movieID >= 1){
						changeSelectMovie(msg)
					}
					break;

				case "Winner":
					addWinnerTrophy()

					break;

				case "roomMaster": //動作確認済み
					const Players = document.getElementsByClassName("RTCRoomPlayerAuthority")

					//旗の移動
					for(let i=0;i<Players.length;i++){
						if(document.getElementsByClassName("RTCRoomPlayerAuthority")[i].parentElement.id == msg){
							Players[i].textContent = "🚩";
							Players[i].parentElement.classList.add("roomMaster");
						}else{
							Players[i].textContent = "・"
							Players[i].parentElement.classList.remove("roomMaster");
						}
					}

					//ルームマスターになったか
					if(msg == myID){
						updates['/rooms/' + roomID + '/AutoStart'] = false;
						document.getElementById("RTC_AutoStart").checked = false
						becomeRoomMaster();
					}else if(msg != myID){
						becomeCommon();
					}
					break;

			}
			firebase.database().ref().update(updates);
		}
	}

}

/**
*@Description 現在の参加人数を更新する。
*/
function roomUsersCount(usersLength){
	document.getElementById("RTCRoomPlayerCount").textContent = "参加者一覧 ("+usersLength+"人)"
}

/**
*@Description ページ更新時に選曲されている動画を表示する
*/
function loadSelectMovie(){
	firebase.database().ref('rooms/' + roomID + '/movieInfo').once('value').then(movieInfo => {
		const msg = movieInfo.val()
		changeSelectMovie(msg)
	})
}
/**
*@Description ユーザー待機画面で前回の1位にトロフィーを追加する。
*/
function addWinnerTrophy(winners){
	firebase.database().ref('rooms/' + roomID + '/Winner').once('value').then(roomWinner => {


		if(roomWinner.val()){
			//トロフィー更新時にすべてのトロフィーを削除
			while(document.getElementsByClassName("Winner_Trophy").length){
				document.getElementsByClassName("Winner_Trophy")[0].remove()
			}

			//取得したWinnersデータから新たにトロフィーを追加する。
			Object.keys(roomWinner.val()).forEach(function(winner_id){
				const Consecutive_wins = roomWinner.val()[winner_id].length
				if(document.getElementById(winner_id) != null){
					document.getElementById(winner_id).getElementsByClassName("RTCRoomBtBan")[0].insertAdjacentHTML('afterend',
																													`<span class="Winner_Trophy"><i class="icon-trophy" style="color:#FFD700"></i>`+ (Consecutive_wins > 1 ? "x"+Consecutive_wins : "")+"</span>")
				}
			})

		}
	})
}

/**
*@Description スピードが変更された
*/
function changeSelectSpeed(msg){
	//movieSpeedController.fixedSpeed {スピード固定譜面の場合は処理しない}
	if( typeof movieSpeedController.fixedSpeed != "number"){

		document.getElementById("RTCPlaySpeedSpan").textContent = playSpeeds[msg].toFixed(2) + "倍速";
		movieSpeedController.playSpeed = playSpeeds[msg]
		movieSpeedController.speed = playSpeeds[msg]

		if(typeof player !== 'undefined'){
			player.setPlaybackRate(playSpeeds[msg])
		}

		if(!playing && location.href.indexOf("https://typing-tube.net/movie/show/")>-1){
			mapInfoDisplay.updateMapInfo()
		}

	}
}

/**
*@Description ルームマスターが選曲中になった
*/
function selectingMovie(msg){

	document.getElementById("RTCbtnReady").disabled = true;
	document.getElementById("RTCbtnReady").style.visibility = "hidden";
	document.getElementById("RTCbtnReady").setAttribute("title","");

	document.getElementById("RTCRoomMovieTitle").textContent = "";
	document.getElementById("RTCRoomMovieTitle").href = null;

	if(!isRoomMaster){
		document.getElementById("RTCMovleSelectingMes").classList.remove('is-hide');
		document.getElementById("RTCMovleSelectingMesRM").classList.add('is-hide');
		document.getElementById("RTCRoomMovieTitle").setAttribute("title","");
		AutoMovehref = ""
	}else{
		document.getElementById("RTCMovleSelectingMesRM").classList.remove('is-hide');
		document.getElementById("RTCMovleSelectingMes").classList.add('is-hide');
		document.getElementById("RTCRoomMovieTitle").setAttribute("title","");
	}

	prevState = "move"
	var updates = {}
	updates['users/' + myID + '/state'] = "move";
	firebase.database().ref().update(updates);
}

/**
*@Description 対戦開始前のプレビュー再生を開始する
*/
function RTCpreviewStart(feedIn){

	player.setVolume(volume*.7)
	player.setPlaybackRate(movieSpeedController.speed)
	player.seekTo(+BGM_time)
	player.playVideo()
	demo_play_flag = true


	if(feedIn == "feedIn"){

		volume_feedin = setInterval(function(){
			feedin_volume ++
			player.setVolume(feedin_volume)
			if(feedin_volume == volume){
				feedin_volume = -10
				clearInterval(volume_feedin);
			}
		},25)

	}

}

/**
*@Description 曲が変更された
*/
function changeSelectMovie(msg){

	//選曲中は曲を表示しない。
	if(!msg.movieID){
		selectingMovie()
		return;
	}


	playSE("cngSong");


	//選択された曲を表示
	if(isRoomMaster){
		document.getElementById("RTCRoomMovieTitle").textContent = "[ID" + movieID + "]" + movieTitle;
		document.getElementById("RTCRoomMovieTitle").href = "https://typing-tube.net/movie/show/" + movieID + (debugMode ? '?test=test':"");
	}else{
		document.getElementById("RTCRoomMovieTitle").textContent = "[ID" + msg.movieID + "]" + msg.movieTitle;
		document.getElementById("RTCRoomMovieTitle").href = "https://typing-tube.net/movie/show/" + msg.movieID + (debugMode ? '?test=test':"");
	}

	//非選択メッセージを非表示
	document.getElementById("RTCMovleSelectingMes").classList.add('is-hide');
	document.getElementById("RTCMovleSelectingMesRM").classList.add('is-hide');

	//準備完了ボタン無効
	document.getElementById("RTCbtnReady").disabled = true;
	document.getElementById("RTCbtnReady").style.visibility = "hidden";

	if(msg.movieID == movieID){

		if(typeof player != "undefined" && !playing && localStorage.getItem("RTCpreview")=="true" && !demo_play_flag){
			RTCpreviewStart()
		}
		prevState = "idle"
		let updates = {}
		updates['users/' + myID + '/state'] = "idle";
		firebase.database().ref().update(updates);

		document.getElementById("RTCbtnReady").disabled = false;
		document.getElementById("RTCbtnReady").style.visibility = "visible";
		document.getElementById("RTCbtnReady").setAttribute("title","");
		document.getElementById("RTCmovieTitleDiv").classList.remove("is-DifferInMovieID");
		document.getElementById("RTCRoomMovieTitle").setAttribute("title","準備が完了したら、準備完了ボタンを押してください。");
		window.addEventListener("keydown" , ready_key)

	}else if(msg.movieID != movieID){

		//選択曲が変わったらプレビュー再生を止める。
		if(!playing && demo_play_flag){
			player.pauseVideo()
			demo_play_flag = false
		}

		//以下、移動させる処理
		if(!isRoomMaster){
			prevState = "move"
			let updates = {}
			updates['users/' + myID + '/state'] = "move";
			firebase.database().ref().update(updates);

			if(document.getElementById("RTC_AutoMove").checked){
				AutoMovehref = document.getElementById("RTCRoomMovieTitle").href
				// ログインしていないユーザーは利用不可にする
				// userName = document.getElementsByClassName("user__name")[0].textContent;
				// if (userName && !userName.match(/^guest/)) {
				if(DOMChatInput.value == "" || document.getElementsByClassName("chatArea")[0].style.display == "none"){
					window.location.href = AutoMovehref
				}
				// }
			}

			document.getElementById("RTCbtnReady").setAttribute("title","ルームマスターが選択した曲と同じ曲を選択してください。");
			document.getElementById("RTCmovieTitleDiv").classList.add("is-DifferInMovieID");
			document.getElementById("RTCRoomMovieTitle").setAttribute("title","ルームマスターが選択した曲と違います。コチラをクリックして開きなおしてください。");
			window.removeEventListener("keydown" , ready_key)
			document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
		}else{
			if(typeof player != "undefined" && !playing && localStorage.getItem("RTCpreview")=="true" && !demo_play_flag){
				RTCpreviewStart()
			}
		}

	}
}

/**
*@Description room内の人がキックされた
*/
function onAddKickUser(snapshot){
	const _userIP = snapshot.ref_.path.pieces_[3];
	const _userID = snapshot.val()
	if(_userID == myID){
		kicked();
	}
}
/**
*@Description roomに人が入室した
*/
let SE_COUNT = 0

function onAddRoomUser(snapshot){

	if(SE_COUNT < 10){
		playSE("greet");
		SE_COUNT ++
	}

	const _userID = snapshot.ref_.path.pieces_[3];
	const _userName = snapshot.val().name;

	//すでに追加されていたらそれ以上の処理はしない
	if(document.getElementById(_userID) != null){
		return;
	}

	var DOMTr = document.createElement("tr");
	DOMTr.id = _userID;
	DOMTr.classList.add("RTCroomPlayer");
	if(_userID == myID){
		DOMTr.classList.add("mine");
	}

	document.getElementById("RTCRoomPlayersTable").appendChild(DOMTr);


	var DOMisRM = document.createElement("td");
	DOMisRM.classList.add("RTCRoomPlayerAuthority");
	DOMisRM.setAttribute("style","width:20px;");
	firebase.database().ref('rooms/' + roomID + '/roomMaster').once('value').then(roomMasterId => {
		if(roomMasterId.val() == _userID){
			DOMisRM.textContent = "🚩";
			DOMTr.classList.add("roomMaster");
		}else{
			DOMisRM.textContent = "・";
			DOMTr.classList.remove("roomMaster");
		}
	});
	DOMTr.appendChild(DOMisRM);

	var DOMname = document.createElement("td");
	DOMname.classList.add("RTCRoomPlayerName");
	DOMname.textContent = _userName;
	DOMTr.appendChild(DOMname);

	var DOMstatus = document.createElement("td");
	DOMstatus.classList.add("RTCRoomPlayerState");
	DOMstatus.setAttribute("style","width:75px;");
	DOMTr.appendChild(DOMstatus);

	var DOMbtChangeRM = document.createElement("a");
	DOMbtChangeRM.classList.add("RTCRoomBtChangeRM");
	DOMbtChangeRM.setAttribute("style","width:20px;font-size:8px");
	DOMbtChangeRM.setAttribute("title",_userName + " にルームマスター権限を渡す。");
	DOMbtChangeRM.addEventListener("click", onButtonChangeRM);
	DOMbtChangeRM.textContent = "↪🚩";
	DOMTr.appendChild(DOMbtChangeRM);

	var DOMbtBan = document.createElement("a");
	DOMbtBan.classList.add("RTCRoomBtBan");
	DOMbtBan.setAttribute("style","width:20px;font-size:12px");
	DOMbtBan.setAttribute("title",_userName + " をルームからキックする。");
	DOMbtBan.addEventListener("click", onButtonBan);
	DOMbtBan.textContent = "💣";
	DOMTr.appendChild(DOMbtBan);

	//自分の↪🚩💣を隠す
	if(!isRoomMaster || _userID == myID){
		DOMbtChangeRM.classList.add("is-hide");
		DOMbtBan.classList.add("is-hide");
	}

	//マルチプレイ用のチェックボックスを表示
	if(isRoomMaster){
		const Players = document.getElementsByClassName("RTCRoomPlayerAuthority")
		if(Players.length >= 2 && prevState != "not_playable"){
			document.getElementById("RTC_AutoStart").parentNode.classList.add("display_AutoStart")
		}
	}else{
		document.getElementById("RTC_AutoMove").parentNode.classList.add("display_AutoMove")
	}

	//このユーザにイベントリスナー追加
	firebase.database().ref('/users/' +_userID+'/state').on('value', onUpdateRoomUser);

}

/**
*@Description room人が退出した
*/
function onRemoveRoomUser(snapshot){
	const _userID = snapshot.ref_.path.pieces_[3];
	const _userName = snapshot.val().name;


	firebase.database().ref('/users/' +_userID+'/state').off('value', onUpdateRoomUser);
	//すでに削除されていたらそれ以上の処理はしない
	if(document.getElementById(_userID) == null){
		return;
	}
	document.getElementById(_userID).remove();

	//もし自分自身ならルーム参加者欄すべて削除
	if(_userID == myID){
		const roomPlayers = document.getElementsByClassName("RTCroomPlayer");
		for(let i=0;i<roomPlayers.length;i++){
			firebase.database().ref('/users/' +roomPlayers[i].id+'/state').off('value', onUpdateRoomUser);
			roomPlayers[i].remove()
			i--
		}
	}else{
		const roomPlayers = document.getElementsByClassName("RTCroomPlayer")


		if(roomPlayers.length == 1){
			if(isRoomMaster){
				document.getElementById("RTC_AutoStart").parentNode.classList.remove("display_AutoStart")
			}else{
				document.getElementById("RTC_AutoMove").parentNode.classList.remove("display_AutoMove")
			}
		}
		if(isRoomMaster){
			autoReadyDisable(roomPlayers)
		}

	}

}


function autoReadyDisable(roomPlayers){
	var AutoStart = false
	firebase.database().ref('users/').once('value').then(users => {
		//全員が準備完了になっているかチェック
		for(let i=0;i<roomPlayers.length;i++){
			const key = roomPlayers[i].id
			if(users.val()[key].state != "ready" && users.val()[key].state != "Auto_ready"){
				AutoStart = true
			}
		}
		//全員が準備完了
		if(!AutoStart){
			var updates = {}
			prevState = "idle"
			updates['users/' + myID + '/state'] = "idle";
			firebase.database().ref().update(updates);
		}
	});
}




/**
*@Description room内の人の情報が変更された
*/
var playing_interval
let standByGraceTime
let graceTime
let ready_player = []

function roomUserBackGroundChange(userId , change){
	const userTable = document.getElementById(userId)
	userTable.classList.remove("ready_background_color");
	userTable.classList.remove("timeout_background_color");

	if(change == "ready"){
		userTable.classList.add("ready_background_color");
	}else if(change == "timeout"){
		userTable.classList.add("timeout_background_color");
	}

}

function readyPlayerStartChange (roomPlayersId){
	if(roomPlayersId.length >= 2){
		if(matchconfirm_sound){
			matchconfirm_sound_play()
		}

		if(prevState == "Auto_ready" || prevState == "ready"){
			document.getElementById("RTCbtnGameStart").disabled = true;
			document.getElementById("RTCbtnReady").disabled = true;
			document.getElementById("RTCbtnExit").disabled = true;
		}

		window.removeEventListener("keydown" , ready_key)

		//ルームマスターがreadyプレイヤー全員の状態をPreStartに変更する
		if(isRoomMaster){
			setTimeout(function(){
				PreStartRM();
			},1600)
		}
	}else{
		PreStartRM();
	}
}

function readyPlayerCheck(user,state){

	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")
	const roomMaster = document.getElementsByClassName("roomMaster")[0]
	if(!roomMaster){return;}

	let roomPlayersId = []
	for(let i=0;i<roomPlayers.length;i++){
		roomPlayersId.push(roomPlayers[i].id)
	}


	const allReadyStateCheck = (key) => roomPlayers[key].className.match("ready_background_color");
	const hostReadyCheck = roomMaster.id == user && state == "ready"

	if(roomPlayersId.every(allReadyStateCheck) || hostReadyCheck){
		//ゲーム前準備処理
		readyPlayerStartChange(roomPlayersId)
	}
}


function onUpdateRoomUser(snapshot){
	const user = snapshot.ref_.path.pieces_[1];
	const state = snapshot.node_.value_
	switch(state){
		case "move":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "移動中";
			roomUserBackGroundChange(user , "remove")
			break;
		case "idle":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "準備中";
			roomUserBackGroundChange(user , "remove")
			break;
		case "ready":

			const roomPlayers = document.getElementsByClassName("RTCroomPlayer");

			//準備完了表示
			if(roomPlayers.length >= 2){
				document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "準備完了";
				roomUserBackGroundChange(user , "ready")
			}
			readyPlayerCheck(user,state)

			break;
		case "Auto_ready":

			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "準備完了";
			roomUserBackGroundChange(user , "ready")
			readyPlayerCheck(user,state)

			break;
		case "play":

			if(prevState == "preStart"){

				ready_player.push(user)
				ready_player = ready_player.filter((element, index) => ready_player.indexOf(element) === index);

				if(Object.keys(Players_ID).length <= ready_player.length){
					prevState = "play"
					console.log("ready_playerBattleStart")
					clearInterval(graceTime)
					battleStart()
				}else{
					standByGraceTime = new Date().getTime()
					if(!graceTime){
						graceTime = setInterval(function(){
							if(new Date().getTime() > 3000 + standByGraceTime){
								battleStart()
								prevState = "play"
								if(!ready_player.includes(myID)){
									var updates = {};
									updates['users/' + myID + '/state'] = "play";
									firebase.database().ref().update(updates);
								}
								clearInterval(graceTime)
							}
						},100)
					}
				}

			}

			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ中";
			const userLoadingContainer = document.querySelector("#__" + user + " > .RTCLine")
			if(userLoadingContainer != null){
				userLoadingContainer.classList.remove("ready_loading")
			}
			roomUserBackGroundChange(user , "remove")
			break;
		case "preStart":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ中";
			if(user == myID && !playing){
				prevState = "preStart"
				//ゲーム前準備処理
				PreStart();
			}
			break;
		case "timeOut":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "タイムアウト";
			roomUserBackGroundChange(user , "timeout")
			if(user == myID){
				isWrittenAFKState = true
			}
			break;
		case "afk":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "afk";
			roomUserBackGroundChange(user , "remove")
			break;
		case "result":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ終了";
			roomUserBackGroundChange(user , "remove")
			break;
		case "end":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ終了";
			roomUserBackGroundChange(user , "remove")
			break;
		case "not_playable":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "再生不可";
			roomUserBackGroundChange(user , "remove")
			break;
		case "noScript":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "ｽｸﾘﾌﾟﾄ未導入";
			roomUserBackGroundChange(user , "remove")
			break;
	}
}

function battleStart(){
	playing = true
	prevState = "play"
	window.removeEventListener("keydown",preventScrollBySpacaKey)
	player.setVolume(volume)
	playing_interval = setInterval(function(){
		if(playing){
			player.seekTo(roomMasterMoviePos)
			player.pauseVideo()
			console.log("後")
			player.playVideo();
			clearInterval(playing_interval)
		}
	},10)
	document.getElementsByClassName("playarea")[0].classList.remove("is-hide-playarea");
	// document.getElementsByClassName("status")[0].classList.remove("flex_100");
}


var isRoomMaster = false;

/**
*@Description ルームマスターになった。
*/
function becomeRoomMaster(movieInfo){
	if(isRoomMaster){return;}

	//初めの数秒は音を鳴らさない
	RTCSECancel()

	if(!isSECancel){
		matchconfirm_sound_play()
	}

	var updates = {};

	if(!movieInfo || movieInfo.movieID != movieID){
		prevState = "idle"
		updates['users/' + myID + '/state'] = "idle";
		updates['/rooms/' + roomID + '/state' ] = "idle";
		updates['/rooms/' + roomID + '/movieInfo'] = { "movieID":movieID , "movieTitle":movieTitle }
		firebase.database().ref().update(updates);
	}

	var cngRMbts = document.getElementsByClassName("RTCRoomBtChangeRM");
	var Banbts = document.getElementsByClassName("RTCRoomBtBan");

	Array.prototype.forEach.call(cngRMbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.remove("is-hide");
		}
	});
	Array.prototype.forEach.call(Banbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.remove("is-hide");
		}
	});

	document.getElementById("RoomNameArea").setAttribute("contentEditable","true")
	document.getElementById("RoomNameArea").addEventListener("input",RoomName_Change)
	document.getElementById("RTCPlaybtSpeedlt").classList.remove("is-hide");
	document.getElementById("RTCPlaybtSpeedgt").classList.remove("is-hide");
	document.getElementById("combat_mode").removeAttribute("disabled")
	document.getElementById("RTCbtnReady").classList.add("is-hide");
	document.getElementById("RTCbtnGameStart").classList.remove("is-hide");

	document.getElementById("RTC_AutoMove").parentNode.classList.remove("display_AutoMove")
	const Players = document.getElementsByClassName("RTCRoomPlayerAuthority")
	if(Players.length >= 2 && prevState != "not_playable"){
		document.getElementById("RTC_AutoStart").parentNode.classList.add("display_AutoStart")
	}
	isRoomMaster = true;
}

/**
*@Description ルームマスターではなくなった。
*/
function becomeCommon(){
	if(!isRoomMaster){return;}
	var cngRMbts = document.getElementsByClassName("RTCRoomBtChangeRM");
	var Banbts = document.getElementsByClassName("RTCRoomBtBan");
	Array.prototype.forEach.call(cngRMbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.add("is-hide");
		}
	});
	Array.prototype.forEach.call(Banbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.add("is-hide");
		}
	});
	document.getElementById("RoomNameArea").setAttribute("contentEditable","false")
	document.getElementById("RoomNameArea").removeEventListener("input",RoomName_Change)
	document.getElementById("RTCPlaybtSpeedlt").classList.add("is-hide");
	document.getElementById("RTCPlaybtSpeedgt").classList.add("is-hide");
	document.getElementById("combat_mode").setAttribute("disabled","")
	document.getElementById("RTCbtnReady").classList.remove("is-hide");
	document.getElementById("RTCbtnReady").style.visibility = "visible";
	document.getElementById("RTCbtnGameStart").classList.add("is-hide");
	document.getElementById("RTC_AutoStart").parentNode.classList.remove("display_AutoStart")
	document.getElementById("RTC_AutoMove").parentNode.classList.add("display_AutoMove")

	isRoomMaster = false;
}

/**
*@Description ルームマスター権限を渡す ボタンが押された。
*/
function onButtonChangeRM(event){
	const EVENT_PATH = event.composedPath()
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			firebase.database().ref('rooms/' + roomID + '/users/' + EVENT_PATH[1].id).once('value').then(user => {
				if (window.confirm("RealTimeCombatting:" + user.val().name + " にルームマスター権限を渡します。よろしいですか？")) {
					var updates = {};
					prevState = "idle"
					updates['users/' + myID + '/state'] = "idle";
					updates['/rooms/' + roomID + '/roomMaster'] = EVENT_PATH[1].id;
					firebase.database().ref().update(updates);
					document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
				}
			});
		}
	});
}

/**
*@Description キックする ボタンが押された。
*/
function onButtonBan(event){
	const EVENT_PATH = event.composedPath()
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			firebase.database().ref('rooms/' + roomID + '/users/' + EVENT_PATH[1].id).once('value').then(user => {
				const kick_password = Math.floor( Math.random() * (999 + 1 - 100) ) + 100
				const pass_form = window.prompt("RealTimeCombatting: " + user.val().name + " さんをルームからキックします。\nよろしければ入力欄に　"+kick_password+"　を入力してください。")
				if (pass_form == kick_password) {
					var updates = {};
					updates['/rooms/' + roomID + '/users/' + EVENT_PATH[1].id] = null;
					updates['/rooms/' + roomID + '/kick/'+user.val().IP.replace(/\./g, "")] = EVENT_PATH[1].id;
					updates['users/' + EVENT_PATH[1].id + '/roomID'] = null;
					firebase.database().ref().update(updates);
					window.alert("RealTimeCombatting: " + user.val().name + " さんをルームからキックしました。")
				}
			});
		}
	});
}


/**
*@Description 。player情報をDBから削除
*@param playerID
*@param roomID nullならroomからの削除処理はしない
*/
function ForcePlayerDelete(playerID, _roomID){

	var updates = {};

	if(_roomID == null){

		firebase.database().ref('users/' + playerID).once('value').then(player_info => {

			if(player_info.val() && player_info.val().roomID != null){
				//削除対象プレイヤーがルームに入っていた。
				ForcePlayerDelete(playerID, player_info.val().roomID)
			}else{
				//プレイヤーを削除
				updates['/users/' + playerID] = null;
			}
			firebase.database().ref().update(updates);
		})

	}else{

		firebase.database().ref('rooms/' + _roomID).once('value').then(room => {

			//ルーム内ユーザーを取得
			let roomUsers = room.val() ? room.val().users : room.val()

			//削除対象プレイヤーIDをルーム内ユーザーオブジェクトから削除
			if(roomUsers){
				delete roomUsers[playerID]
			}

			if(!roomUsers || Object.keys(roomUsers).length == 0){
				//最後の1人ならRoom削除
				updates['/rooms/' + _roomID] = null;
				updates['/roomChat/' + _roomID] = null;

			}else if(room.val().roomMaster == playerID){
				//ルームマスターが削除されたらマスター権限の移動
				updates['/rooms/' + _roomID + '/roomMaster'] = moveRoomMaster(roomUsers , playerID)
			}

			//ユーザー情報を削除
			updates['/users/' + playerID] = null;
			if(updates["/rooms/"+_roomID] === undefined){
				updates['/rooms/' + _roomID + '/users/' + playerID] = null;
			}

			firebase.database().ref().update(updates);
		});

	}
}

/**
*@Description ルームマスターを誰かに変更する。
*/
function moveRoomMaster(roomUsers , playerID){
	var masterID;

	Object.keys(roomUsers).forEach(function(id){
		if(id != playerID){
			masterID = id;
		}
	});

	return masterID;
}


/**
*@Description キックされた
*/
function kicked(){
	location.reload();
	ExitRoom();
}


/**
*@Description 対戦モードが変更された
*/
function onChangeCombatMode(event){
	playSE("click");
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var updates = {};
			updates['/rooms/' + roomID + '/playMode'] = document.getElementById("combat_mode").value;
			firebase.database().ref().update(updates);
		}
	});
}


/**
*@Description プレイ速度変更ボタンが押された
*/
function onClickPlaySpeedlt(event){
	playSE("click");
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var ps = room.val().playSpeed - 1;
			if(ps < 0){
				ps = 0;
			}
			var updates = {};
			updates['/rooms/' + roomID + '/playSpeed'] = ps;
			firebase.database().ref().update(updates);
		}
	});
}

/**
*@Description プレイ速度変更ボタンが押された
*/
function onClickPlaySpeedgt(event){
	playSE("click");

	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var ps = room.val().playSpeed + 1;
			if(ps >= playSpeeds.length){
				ps = playSpeeds.length - 1;
			}
			var updates = {};
			updates['/rooms/' + roomID + '/playSpeed'] = ps;
			firebase.database().ref().update(updates);
		}
	});
}


/**
*@Description 準備完了ボタンを押した
*/

let ReadyTimeStamp = 0
let playerReadyInterval
function onClickBtnReady(event){

	if(!playerReadyInterval){

		player.playVideo()
		playerReadyInterval = setInterval(readyStateChange , 50)
		CountDown_sound_play("mute")
		countDownEnd_sound_play("mute")
		matchconfirm_sound_play("mute")
		playSE("enter","mute")
		playSE("cancel","mute");
		if(!document.getElementById("rtc-preview").checked && player.getPlayerState() != 1){
			player.mute()
		}
	}

}


let middleStart = false
function readyStateChange(){
	if(player.getPlayerState() != 1){ return; }
	clearInterval(playerReadyInterval)
	playerReadyInterval = null

	var updates = {};
	const now_date = new Date().getTime()
	if(prevState == "idle"){

		ReadyTimeStamp = new Date().getTime()
		playSE("enter");
		if(document.getElementById("RTCbtnReady").value == "途中参加"){
			prevState = "preStart"
			updates['users/' + myID + '/state'] = "preStart";
			middleStart = true
			firebase.database().ref('rooms/'+ roomID + '/users').once('value').then(roomUsers => {
				const roomPlayers = document.getElementsByClassName("RTCroomPlayer");
				for(let i=0;i<roomUsers.val().length;i++){
					if(roomUsers.val()[roomPlayers[i].id].state == "play"){
						ready_player.push(roomPlayers[i].id)
					}
				}
			});
		}else{
			prevState = "ready"
			updates['users/' + myID + '/state'] = "ready";
			document.getElementById("RTCbtnReady").setAttribute("value","準備完了を解除");
		}


	}else if(prevState == "ready" && now_date-ReadyTimeStamp > 1000){

		playSE("cancel");
		prevState = "idle"
		updates['users/' + myID + '/state'] = "idle";
		document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
	}
	firebase.database().ref().update(updates);


}


/**
*@note room関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note ゲーム中処理 ここから ---
*/

/**
*@note （ルームマスター）ゲーム開始ボタンを押した
*/
function onClickBtnGameStart(event){

	if(!playerReadyInterval){

		player.playVideo()

		playerReadyInterval = setInterval(hostGameStartCheck , 50)

		CountDown_sound_play("mute")
		countDownEnd_sound_play("mute")
		matchconfirm_sound_play("mute")
		playSE("enter","mute")
		playSE("cancel","mute");
		if(!document.getElementById("rtc-preview").checked && player.getPlayerState() != 1){
			player.mute()
		}
	}

}

function hostGameStartCheck(){
	if(player.getPlayerState() != 1){ return; }
	clearInterval(playerReadyInterval)
	playerReadyInterval = null

	//room内の全員が準備完了かどうか確認
	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")

	//参加者のIDを取得
	let roomPlayersId = []
	for(let i=0;i<roomPlayers.length;i++){
		roomPlayersId.push(roomPlayers[i].id)
	}

	//自分以外にready_background_color classが付いているか確認
	const ReadyStateCheck = (key) => roomPlayers[key].className.match("ready_background_color") || key == myID

	//ready_background_color classが付いていない人がいれば確認ダイアログを出す
	if(!roomPlayersId.every(ReadyStateCheck)){
		if (!window.confirm("RealTimeCombatting: ルーム内全員が準備完了ボタンを押していません。ゲームをスタートしてもよろしいですか？")) {
			return;
		}
	}

	var updates = {};
	prevState = "ready"
	updates['users/' + myID + '/state'] = "ready";
	firebase.database().ref().update(updates);
	window.removeEventListener("keydown" , ready_key)


}


/**
*@note （ルームマスター）ゲーム開始ボタンを押した
*/
let combating_mode = "Score"
let Preflag = false

function PreStartRM(){
	//全員の状態をpreStartへ。

	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")

	var updates = {};
	for(let i=0;i<roomPlayers.length;i++){
		const key = roomPlayers[i].id
		if(roomPlayers[key].className.match("ready_background_color") || key == myID){
			updates['users/' + key + '/state'] = "preStart";
		}
	}
	const new_Date = new Date().getTime()
	updates['rooms/' + roomID + '/state'] = "play";
	updates['rooms/' + roomID + '/StartTime'] = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp);
	firebase.database().ref().update(updates);
}
/**
*@note ゲーム開始準備処理
*/



let speed_background = "transparent"
let speed_color = "rgba(255,255,255,.85)"
let RTCGamePlayPlayersStatusTableSelector
let FirstVideoLoadedCheck
let selected_play_mode
let combat_ranking_ViewMode = "Scroll"
let status_updates = {}
let score_flag = false
let roomMasterMoviePos = 0
let Players_ID = {}
let RoomMaster_ID = ""

function PreStart(){


	if(Preflag){return;}
	Preflag = true

	feedout_volume = +localStorage.getItem("volume_storage")
	//プレイスピードをroomの設定に合わせる。
	if( typeof movieSpeedController.fixedSpeed != "number"){
		firebase.database().ref('rooms/' + roomID).once('value').then(room => {
			changeSelectSpeed(room.val().playSpeed)
			movieSpeedController.updateSpeedDisplay()
		});
	}
	var updates = {};
	updates['/rooms/' + roomID + '/users/' + myID + '/state'] = 'play';
	firebase.database().ref().update(updates);


	//表示画面の切り替え
	document.getElementById("RTCRoomIdleScene").classList.add("is-hide");
	document.getElementById("RTCGamePlayScene").classList.remove("is-hide");

	combating_mode = document.getElementById("combat_mode").value
	// 選択状態を再設定(TypingTubeMODと競合しないように)
	selected_play_mode = document.querySelector("[name=rbPlayMode]:checked").value
	if(selected_play_mode == "kana"){
		mode = 'kana';
		inputModeManager.kanaMode = false;
		typing_play_mode = 'roma'
	}else if(selected_play_mode == "roma"){
		mode = 'roma';
		inputModeManager.kanaMode = false;
		typing_play_mode = 'roma'
	}else if(selected_play_mode == "kanaInput"){
		mode = 'kana';
		inputModeManager.kanaMode = true;
		typing_play_mode = 'kana'
	}else if(selected_play_mode == "flickInput"){
		mode = 'kana';
		inputModeManager.kanaMode = true;
		typing_play_mode = 'flick'
	}
	window.removeEventListener("keydown" , ready_key)
	player.setVolume(volume/7.5)

	//チャットを非表示にする
	if(!document.getElementById("battleChat").classList.value.includes('active')){
		$('.chatArea').animate({height: 'hide'}, 'slow');
	}

	let CHAT_HEIGHT = localStorage.getItem("RTCRoomBattleChatHeight")

	if(CHAT_HEIGHT){

		if(CHAT_HEIGHT == "170px"){
			document.getElementById("knob-up").style.visibility = "hidden"
			document.getElementById("knob-down").style.visibility = "visible"
		}else if(CHAT_HEIGHT == "40px"){
			document.getElementById("knob-up").style.visibility = "visible"
			document.getElementById("knob-down").style.visibility = "hidden"
		}
	}else{

		const DEFAULT_HEIGHT = "60px"
		CHAT_HEIGHT = DEFAULT_HEIGHT
		localStorage.setItem("RTCRoomBattleChatHeight",DEFAULT_HEIGHT)
	}

	const Chat = document.getElementById('RTCRoomChat');
	Chat.style.height = CHAT_HEIGHT
	Chat.scrollTo(0, Chat.scrollHeight)

	// ログインしていないユーザーは利用不可にする
	// userName = document.getElementsByClassName("user__name")[0].textContent;
	// if (userName && !userName.match(/^guest/)) {
	DOMChatInput.setAttribute("placeholder","メッセージを入力　<対戦中はTABキーでフォーカスを切り替えることができます>");
	// }


	// ログインしていないユーザーは利用不可にする
	// userName = document.getElementsByClassName("user__name")[0].textContent;
	// if (userName && !userName.match(/^guest/)) {
	window.addEventListener("keydown" , event => {
		if(event.key == "Tab"){
			if(document.activeElement.id == 'ChatInput'){
				play_focus()
				play_focus()
			}else if(!keyDown.nextChar[0] && document.activeElement.id != 'ChatInput'){
				document.getElementById("ChatInput").focus()
			}
			event.preventDefault()
		}
	})

	document.getElementById("ChatInput").addEventListener("focus" , event => {
		document.getElementById("ChatInput").style.borderBottom = "solid thin"
	})
	document.getElementById("ChatInput").addEventListener("blur" , event => {
		document.getElementById("ChatInput").style.borderBottom = "none"
	})
	// }

	//対戦エリアの表示設定を呼び出し
	const ViewMode = localStorage.getItem("combat_ranking_ViewMode")
	if(ViewMode){
		combat_ranking_ViewMode = ViewMode
	}



	//ルーム情報更新イベント削除
	firebase.database().ref('/rooms/' + roomID).off('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));
	AutoMovehref = ""

	//ステータス表示用のテーブルの作成
	var table = document.getElementById("RTCGamePlayPlayersStatusTable");
	while(table.firstChild){
		table.firstChild.remove();
	}
	//スペースキーによるscrollの無効化
	window.addEventListener("keydown",preventScrollBySpacaKey)
	//ルーム内ユーザーに対してイベントハンドラを追加
	firebase.database().ref('rooms/' + roomID + '/roomMaster').once('value').then(roomMasterID => {
		RoomMaster_ID = roomMasterID.val()

		const roomPlayers = document.getElementsByClassName("RTCroomPlayer");

		firebase.database().ref('users/').once('value').then(users => {

			for(let i=0;i<roomPlayers.length;i++){
				const key = roomPlayers[i].id
				if(users.val()[key].state == "preStart" || users.val()[key].state == "play"){

					//ユーザーの対戦イベントを追加
					addUserBattleStatusEvent(users.val()[key].name , key)


					//ユーザーの対戦テーブルが既に追加されていたらここで終了
					if(document.getElementById("_" + key) != null){
						return;
					}

					//ユーザーの対戦テーブルを追加
					addbattleStatusTable(users.val()[key] , key)
				}




			}


			//以下、準備完了者のテーブル追加終了後
			RTCGamePlayPlayersStatusTableSelector = document.getElementById("RTCGamePlayPlayersStatusTable")

			if(Object.keys(Players_ID).length >= 2 || !isRoomMaster){
				let mode_color = "transparent"
				if(combating_mode == "Combo"){
					mode_color = "#fd7e009e"
				}else if(combating_mode == "Line"){
					mode_color = "#37a34a"
				}else if(combating_mode == "Perfect"){
					mode_color = "#dab3008c"
				}
				//controlエリアを対戦用に変更
				document.getElementById("time_settings").style.marginTop = "8px"
				document.getElementById("time_settings").style.marginBottom = "8px"
				document.getElementById("speed_change_F10").style.display = "none"
				document.getElementById("song_reset").style.display = "none"
				document.getElementById("shortcut").style.zIndex = "6"
				document.getElementById("speed").style.border = "solid thin"
				document.getElementById("speed").classList.remove('pointer');
				document.getElementById("more_shortcutkey").style.display = "none"
				document.getElementById("more_shortcutkey").insertAdjacentHTML('afterend',`<div id="battle_mode"><span style="border:solid thin;background:${mode_color};" class="control_option">${combating_mode == "Line" ? "Line先取" : combating_mode}</span></div>`)

				document.getElementById("song_reset").insertAdjacentHTML('afterend',`<div id="battle_container_display"><span id="battle_container_display_button" class="control_option pointer">順位表示切り替え</span><span id="battle_container_display_button_F1" class="shortcut_navi hover_dom select_none">F1</span></div>`)
				document.getElementById("battle_container_display").addEventListener("click",changeBattleContainer)
				document.getElementById("battle_container_display_button_F1").addEventListener("mouseover",function battle_container_underline(event){
					document.getElementById("battle_container_display_button").style.textDecoration = "underline"
				})
				document.getElementById("battle_container_display_button_F1").addEventListener("mouseout",function battle_container_underline_delete(event){
					document.getElementById("battle_container_display_button").style.textDecoration = ""
				})
				document.querySelector("#shortcut > div").style.display = "none"
			}

			//カウントダウン
			ClockCountDownFirst();
			document.getElementById("RTCGamePlayWrapper").scrollTo({
				top:999
			})

			if(localStorage.getItem("RTC_Scroll") != "false"){
				const absolute_controlbox_point = window.pageYOffset+CONTROLBOX_SELECTOR.getBoundingClientRect().top-document.getElementsByTagName("header")[0].clientHeight
				const display_size_height = document.documentElement.clientHeight-document.getElementsByTagName("header")[0].clientHeight
				window.scrollTo({top: absolute_controlbox_point-(display_size_height > CONTROLBOX_SELECTOR.clientHeight+50 ? localStorage.getItem('scroll_adjustment1') : 0)})
			}

			//途中参加のユーザーを検知するイベントを追加。
			firebase.database().ref('/rooms/' + roomID + '/users').on('child_changed', middleUserJoin);
		});
	});
}

function addUserBattleStatusEvent(name , key){
	//試合参加者のIDをPlayers_IDに格納
	Players_ID[key] = name

	//ユーザーのStatus更新イベント
	firebase.database().ref('users/' + key + '/status').on('child_changed', onUpdateRoomUserInfo);
	//ユーザーのState更新イベント
	firebase.database().ref('users/' + key + '/state').on('value', onUpdateRoomUserState)

	//Line先取モード専用イベント
	if(combating_mode == "Line"){
		ClearTime_addevent_target = firebase.database().ref('users/' + key + '/status/ClearTime');
		ClearTime_addevent_target.on('child_added', add_clear_time);
	}

}



let PlayersColor = {}
function addbattleStatusTable(User,key){
	var DOMtr = document.createElement("tr");
	DOMtr.id = "_" + key ;
	if(key == myID){
		DOMtr.classList.add("mine");
	}
	if(key == RoomMaster_ID){
		DOMtr.classList.add("host");
	}
	DOMtr.setAttribute("style","font-size:14px;font-weight:bold");

	document.getElementById("RTCGamePlayPlayersStatusTable").appendChild(DOMtr);

	var DOMrank = document.createElement("td");
	DOMrank .classList.add("RTCrank");
	DOMrank.setAttribute("style","width:7%;");
	DOMrank.setAttribute("rowspan","2");
	DOMrank.textContent = "1位";
	DOMtr.appendChild(DOMrank);

	var DOMname = document.createElement("td");
	DOMname.textContent = User.name;
	DOMname.setAttribute("rowspan","2");
	DOMname.setAttribute("style","width:11%;");

	DOMtr.appendChild(DOMname);


	var DOMscore = document.createElement("td");
	DOMscore .classList.add("RTCscore");
	if(key == myID){
		DOMscore .classList.add("mine_score");
	}
	DOMscore.setAttribute("style","width:9%;");
	DOMscore.textContent = User.status.score+"点"
	var DOMclear = document.createElement("td");
	DOMclear .classList.add("RTCclear");
	DOMclear.setAttribute("style","width:9%;");
	if(combating_mode != "Line"){
		DOMtr.appendChild(DOMscore);
	}else{
		DOMclear.textContent = (Object.values(User.status.ClearTime).length-1)+"pt"
		DOMtr.appendChild(DOMclear);
	}
	var DOMmiss = document.createElement("td");
	DOMmiss.classList.add("RTCmiss");
	DOMmiss.setAttribute("style","width:9%;");
	DOMmiss.textContent = User.status.miss+"ミス";
	DOMtr.appendChild(DOMmiss );

	var DOMcombo = document.createElement("td");
	DOMcombo.classList.add("RTCcomboArea");
	DOMcombo.setAttribute("style","width:16%;");
	DOMcombo.innerHTML = `<span class='RTCcombo'>${User.status.combo}</span> / <span class='RTCmaxcombo'>${User.status.maxCombo}</span> コンボ`;
	DOMtr.appendChild(DOMcombo);

	var DOMtype = document.createElement("td");
	DOMtype.classList.add("RTCtype");
	DOMtype.setAttribute("style","width:9%;");
	DOMtype.textContent = User.status.type+"打";
	DOMtr.appendChild(DOMtype);

	var DOMcorrect = document.createElement("td");
	DOMcorrect .classList.add("RTCcorrect");
	DOMcorrect.setAttribute("style","width:9%;");
	DOMcorrect .textContent = User.status.correct+"%";
	DOMtr.appendChild(DOMcorrect);
	if(combating_mode != "Line"){
		DOMclear.textContent = User.status.clearline+"clear"
		DOMtr.appendChild(DOMclear);
	}else{
		DOMtr.appendChild(DOMscore);
	}
	var DOMkeySec = document.createElement("td");
	DOMkeySec .classList.add("RTCkeySec");
	DOMkeySec.setAttribute("style","width:11%;");
	DOMkeySec .textContent = User.status.keySec+"打/秒";
	DOMtr.appendChild(DOMkeySec);

	var DOMTime = document.createElement("td");
	DOMTime .classList.add("RTCtime");
	DOMTime.setAttribute("style","width:12%;");
	DOMTime .textContent = User.status.moviePos+"秒";
	DOMtr.appendChild(DOMTime);


	var DOMLinetr = document.createElement("tr");
	DOMLinetr.id = "__" + key ;
	if(key == myID){
		DOMLinetr.classList.add("mine");
	}
	if(key == RoomMaster_ID){
		DOMLinetr.classList.add("host");
		roomMasterMoviePos = User.status.moviePos
	}
	DOMLinetr.setAttribute("style","font-size:10px;font-weight:bold");
	document.getElementById("RTCGamePlayPlayersStatusTable").appendChild(DOMLinetr);


	var DOMLine = document.createElement("td");
	DOMLine .classList.add("RTCLine");
	if(User.state == "preStart"){
		DOMLine .classList.add("ready_loading");
	}
	if(key == myID){
		DOMscore .classList.add("mine_line");
	}
	DOMLine.setAttribute("colspan","7");
	DOMLine.setAttribute("style","max-width: 350px;white-space: nowrap;overflow:hidden;");
	DOMLinetr.appendChild(DOMLine);

	var DOMInputMode = document.createElement("td");
	DOMInputMode .classList.add("InputMode");
	DOMInputMode.textContent = User.status.InputMode;
	DOMInputMode.setAttribute("style","font-size:12px");
	DOMLinetr.appendChild(DOMInputMode);

	var DOMlineInput = document.createElement("span");
	DOMlineInput.classList.add("RTClineInput");
	DOMlineInput.setAttribute("style",`color:${User.status.correctColor}`);
	DOMLine.appendChild(DOMlineInput);
	PlayersColor[key] = {
		"correctColor" : User.status.correctColor,
		"lineClearColor" : User.status.lineClearColor
	}

	var DOMlineRemain = document.createElement("span");
	DOMlineRemain .classList.add("RTClineRemain");
	DOMLine.appendChild(DOMlineRemain);

	var DOMlineSpeed = document.createElement("span");
	DOMlineSpeed .classList.add("RTClineSpeed");
	DOMlineSpeed.setAttribute("style","opacity:0.7;font-size: 95%;");
	DOMLine.appendChild(DOMlineSpeed);

	var DOMlineCount = document.createElement("span");
	DOMlineCount .classList.add("count");
	DOMlineCount .textContent = User.status.count;
	DOMLine.appendChild(DOMlineCount);

}




//途中参加者を対戦ステータスに表示
function middleUserJoin(snapshot){
	const _userID = snapshot.ref_.path.pieces_[3];
	const _userName = snapshot.val().name;
	const _userState = snapshot.val().state;
	if(_userState != "play" || Players_ID[_userID]){return;}


	//ユーザーの対戦イベントを追加
	addUserBattleStatusEvent(_userName , _userID)

	//ユーザーの対戦テーブルが既に追加されていたらここで終了
	if(document.getElementById("_" + _userID) != null){
		return;
	}

	//ユーザーの対戦テーブルを追加
	firebase.database().ref('users/').once('value').then(users => {
		addbattleStatusTable(users.val()[_userID],_userID)
	})
}

function preventScrollBySpacaKey(){
	if(event.code == "Space" && document.activeElement.tagName != "INPUT"){
		event.preventDefault();
	}
}

var isFirstClockCountDown =true;
var startTime; //ホストが開始ボタンを押したTimeStamp
var countDown = 3;
let countDownInterval
/**
*@note プレイ前カウントダウンはじめ
*/
function ClockCountDownFirst(){
	const COUNT_DOWN_TIME_FLAG = (Object.keys(Players_ID).length >= 2 || !isRoomMaster)
	startTime = parseInt(new Date().getTime() + (COUNT_DOWN_TIME_FLAG && !middleStart ? 3000:0));

	if(COUNT_DOWN_TIME_FLAG){
		CountDown_sound_play()
	}

	if(!countDownInterval){
		countDownInterval = setInterval(ClockCountDown , 100);
	}
}

/**
*@note ボリュームを小さくしながら動画を止める
*/
function volumeFeedout(){
	feedout_volume = +localStorage.getItem("volume_storage")/7.5

	volume_feedout = setInterval(function(){
		feedout_volume --
		player.setVolume(feedout_volume)

		if(feedout_volume < 0){
			demo_play_flag = false
			feedout_volume = +localStorage.getItem("volume_storage")/7.5
			player.stopVideo()
			clearInterval(volume_feedout);
		}
	},75)
}


/**
*@note プレイ前カウントダウン
*/
let feedout_volume = 0
let volume_feedout

function ClockCountDown(){
	var now = new Date().getTime()


	if(now < startTime){
		//カウントダウン中
		var  ct = Math.ceil(((startTime - now) * 0.001));
		if(ct == countDown){

			if(countDown == 2){
				console.log("start")
				//ボリュームを小さくしながら動画を止める
				volumeFeedout()
			}

			countDown--;
			if(countDown <= 2){
				CountDown_sound_play()
			}
		}

		document.getElementById("RTCRoomMes").style.display = "block"
		document.getElementById("RTCRoomMes").textContent = "開始まであと" + ct+ "秒です。";
	}else{
		//カウントダウン終了
		if(Object.keys(Players_ID).length >= 2){
			countDownEnd_sound_play()
		}

		//カウントダウン非表示
		document.getElementById("RTCRoomMes").style.display = "none"
		document.getElementById("RTCRoomMes").textContent = " ";

		//対戦テーブル内の自分の位置にスクロール
		const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;
		document.getElementById("RTCGamePlayWrapper").scrollTo({
			top:combat_ranking_ViewMode == "Scroll" ? (document.getElementsByClassName("mine")[1].querySelector(".RTCrank").clientHeight*(([].slice.call( users ).indexOf(document.getElementsByClassName("mine")[1])/2)-6)):0,
		})

		//対戦テーブル非表示モードだったら非表示
		if(combat_ranking_ViewMode == "none"){
			document.getElementById("RTCContainer").style.display = "none"
			document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.setAttribute("style","margin-top:250px!important;")
		}

		roomMasterMoviePos = parseFloat(document.getElementsByClassName("host")[0].getElementsByClassName("RTCtime")[0].textContent)
		player.seekTo(roomMasterMoviePos);
		clearInterval(countDownInterval);
	}
}


var isDispFmtKeySec = true; //true:key/sec形式で表示 false key/min形式で表示

let rank = -5
let HostLineCount = 0

/**
*@note 対戦中にユーザーが離脱した。
*/
function exitPlayer(SnapShotValue,uid){
	if(SnapShotValue != "end"){
		firebase.database().ref('users/' + uid + '/status').off('child_changed', onUpdateRoomUserInfo);
		firebase.database().ref('users/' + uid + '/state').off('value', onUpdateRoomUserState)
	}
	delete Players_ID[uid]
}

/**
*@note ルーム内ユーザーの状態が変更された。
*/
function onUpdateRoomUserState(snapshot){
	const uid = snapshot.ref_.path.pieces_[1];
	const Update_Info = snapshot.ref_.path.pieces_[3]


	if(RTCGamePlayPlayersStatusTableSelector == null){return;}

	const SnapShotValue = snapshot.val()
	if(SnapShotValue == 'preStart' || SnapShotValue == "play"){return;}
	//	BubbleSort()
	if(SnapShotValue == "result"){
		RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = "プレイ終了";
	}else if(SnapShotValue != "play" && SnapShotValue != "end"){
		firebase.database().ref('rooms/' + roomID + '/state').once('value').then(room_state => {
			if(room_state.val() == "play"){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput").textContent = "タイムアウトしました。";
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = "プレイ終了";
			}
		})
	}
	exitPlayer(SnapShotValue,uid)
	if(Object.keys(Players_ID).length == 0){
		//勝者を記録
		winnerRecord()
	}
}

/**
*@note 対戦後、最後まで残っていた人が1位の人を記録する。
*/
function winnerRecord(){
	const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;

	if(users.length > 2){
		firebase.database().ref('rooms/' + roomID).once('value').then(room => {
			const StartTime = room.val().StartTime

			var updates = {}
			if(room.val().Winner){

				if(Object.values(room.val().Winner).flat().includes(StartTime)){
					return;
				}
				let Win_data = Object.keys(room.val().Winner)

				for (let i = 0; i < users.length/2; i++){
					if(document.getElementsByClassName("RTCrank")[i].textContent == "1位"){
						const Winner_ID = document.getElementsByClassName("RTCrank")[i].parentElement.id.slice(1)
						const idx = Win_data.indexOf(Winner_ID);
						if(idx >= 0){
							Win_data.splice(idx, 1);
						}
					}else{
						break;
					}
				}
				for (let i = 0; i < Win_data.length; i++){
					updates['/rooms/' + roomID + '/Winner/' + Win_data[i]] = null
				}
				firebase.database().ref().update(updates);
			}

			firebase.database().ref('rooms/' + roomID + '/Winner').once('value').then(Winner => {
				var updates = {}
				for (let i = 0; i < users.length/2; i++){
					if(document.getElementsByClassName("RTCrank")[i].textContent == "1位"){
						const Winner_ID = document.getElementsByClassName("RTCrank")[i].parentElement.id.slice(1)
						let Win_count = Winner.val() && Winner.val()[Winner_ID] && Winner.val()[Winner_ID].length ? Winner.val()[Winner_ID].concat(StartTime) : [StartTime]
						updates['/rooms/' + roomID + '/Winner/' + Winner_ID] = Win_count.length > 1 ? Win_count.filter((x, i, self) => self.indexOf(x) === i):Win_count
					}else{
						break;
					}
				}
				firebase.database().ref().update(updates);
			})
		})
	}
}

function onUpdateRoomUserInfo(snapshot){
	const uid = snapshot.ref_.path.pieces_[1];
	const Update_Info = snapshot.ref_.path.pieces_[3]
	if(RTCGamePlayPlayersStatusTableSelector == null){return;}
	const SnapShotValue = snapshot.val()
	switch(Update_Info){
		case "clearline":
			if(combating_mode != "Line"){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCclear").textContent = SnapShotValue+"clear"
			}
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput").style.color = PlayersColor[uid].lineClearColor
			break;
		case "combo":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " .RTCcombo").textContent =  SnapShotValue;
			break;
		case "maxCombo":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " .RTCmaxcombo").textContent =  SnapShotValue;
			break;
		case "correct":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCcorrect").textContent = SnapShotValue +"%";
			break;
		case "keySec":
			if(isDispFmtKeySec){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCkeySec").textContent = SnapShotValue + '打/秒';
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCkeySec").textContent = Math.round(SnapShotValue * 60) + 'kpm';
			}
			break;
		case "linekeySec":
			if(SnapShotValue){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineSpeed").textContent =` ${SnapShotValue}打/秒`;
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine").scrollLeft = 999
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineSpeed").textContent = ""
			}
			break;
		case "lineInput":
			const RTCLineWidth = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine")
			const LineInput = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput")
			if(SnapShotValue){
				LineInput.textContent = (LineInput.textContent + SnapShotValue.slice(0,1) ).substr( -60, 60 );
			}else{
				LineInput.textContent = "";
			}
			if(!LineInput.textContent){
				RTCLineWidth.scrollLeft = 0
				LineInput.style.color = PlayersColor[uid].correctColor
			}
			break;
		case "lineRemain":
			break;
		case "SkipOptin":
			if(typeof SnapShotValue === "number"){
				const RTCLineWidth = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine")
				RTCLineWidth.scrollLeft = RTCLineWidth.scrollWidth
				if(timeSkip.seekedCount != line.count && Object.keys(Players_ID).length <= document.getElementsByClassName("skip_opt_in").length){
					while(document.getElementsByClassName("skip_opt_in")[0] != null){
						document.getElementsByClassName("skip_opt_in")[0].remove()
					}
					timeSkip.seekedCount = line.count;
					player.seekTo((parseFloat(lyrics_array[line.count][0]) + player.difftime - 4)+(4-movieSpeedController.speed*4));

					tick.playheadUpdate();
					replace_complete_area("Skip")
					SELECTOR_ACCESS_OBJECT['skip-guide'].textContent = ""
				}
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").textContent = "";
			}
			break;
		case "miss":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCmiss").textContent = SnapShotValue +"ミス";
			break;
		case "count":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " .count").textContent = SnapShotValue;
			break;
		case "moviePos":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = SnapShotValue +"秒";
			break;
		case "score":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCscore").textContent = SnapShotValue +"点";
			break;
		case "type":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtype").textContent = SnapShotValue +"打";
			break;
		case "InputMode":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .InputMode").textContent = SnapShotValue
			break;
	}
	if(combating_mode != "Line" && (Update_Info == "score") || combating_mode == "Line" && Update_Info == "ClearTime"){
		//順位入れ替え
		BubbleSort(SnapShotValue,uid)
	}
}


function BubbleSort(SnapShotValue,uid){

	//順位入れ替え
	const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;
	const users_column = users.length / 2
	var scores = {};
	var score_arr = []
	for (let i = 0; i < users.length; i+=2){
		const user_score = parseFloat(combating_mode != "Line" ? users[i].getElementsByClassName("RTCscore")[0].textContent : users[i].getElementsByClassName("RTCclear")[0].textContent);
		scores[i / 2] = user_score
		score_arr.push(user_score)
	}

	var tmp;
	let ranking
	//バブルソート
	for(let i = 0; i < users.length / 2; ++i){ //上位から
		for(var j = i; j < users.length / 2; ++j){
			if(scores[j] > scores[i]){
				users[j * 2 + 1].after(users[i * 2]);
				users[j * 2 + 1].after(users[i * 2]);
				users[i * 2].before(users[j * 2 - 1]);
				users[i * 2].before(users[j * 2 - 1]);
			}
		}
	}
	score_arr.sort(
		function(a,b){
			return (a < b ? 1 : -1);
		}
	);
	let Shift_rank = 0
	for (let i = 0; i < users.length; i+=2){
		const RTCrank = users[i].getElementsByClassName("RTCrank")[0]
		if(RTCrank){
			if(score_arr[ (i / 2)-1-Shift_rank] == score_arr[ (i / 2)]){
				Shift_rank++
			}
			RTCrank.textContent = ((i / 2) + 1 - Shift_rank) + "位";
			if(uid == myID && users[i].classList.value.indexOf("mine") > -1){
				ranking = (i / 2) + 1
				if(SnapShotValue == 0.00 && typingCounter.score){
					ranking = users_column
				}
			}
		}
	}
	if(typingCounter.score && combat_ranking_ViewMode == "Scroll"){
		if(Math.abs(ranking - rank) >= 1 || ranking <= 6){
			if(ranking > 6){
				document.getElementById("RTCGamePlayWrapper").scrollTo({
					top:(document.getElementsByClassName("mine")[1].querySelector(".RTCrank").clientHeight*(ranking-5)),

				})
			}else{
				document.getElementById("RTCGamePlayWrapper").scrollTo({
					top:(0),
				})
			}
			rank = ranking
		}
	}
}

/**
*@note ゲーム終了
*/
function endGames(){
	firebase.database().ref('/rooms/' + roomID).on('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));

	prevState = "result"
	var updates = {};
	updates['/rooms/' + roomID + '/state'] = "result";
	updates['/users/' + myID + '/state'] = "result";
	firebase.database().ref().update(updates);
}

/**
*@note ゲーム中処理 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////////////////////

var isSECancel = false;

/**
*@note SE関連 ここから ---
*/
var SE_SET = {
	"enter":"https://soundeffect-lab.info/sound/button/mp3/decision5.mp3",
	"warning":"https://soundeffect-lab.info/sound/button/mp3/warning1.mp3",
	"exit":"https://soundeffect-lab.info/sound/button/mp3/decision23.mp3",
	"click":"https://soundeffect-lab.info/sound/button/mp3/cursor1.mp3",
	"cancel":"https://soundeffect-lab.info/sound/button/mp3/cancel2.mp3",

	"greet":"https://soundeffect-lab.info/sound/voice/mp3/game/swordwoman-greeting1.mp3",
	"chat":"https://soundeffect-lab.info/sound/various/mp3/bubble-burst1.mp3",
	"cngSong":"https://soundeffect-lab.info/sound/button/mp3/decision29.mp3",
};

/**
*@note SEを鳴らす
*@param string SEname
*/
function playSE(SEname,mute){
	if(isSECancel){return;}
	var se = new Audio();
	if(mute == "mute"){
		se.muted = true
	}else{
		se.muted = false
		se.volume = (localStorage.getItem("volume_storage")/100)*(SEname == "greet"?0.5:1)
	}
	se.src = SE_SET[SEname];
	se.play();
}


var matchconfirm_sound
var CountDown_sound //https://web.archive.org/web/20170618145501/http://soundeffect-lab.info/sound/button/mp3/cursor3.mp3
var countDownEnd_sound


function CountDown_sound_load(){
	var request_CountDown_sound = new XMLHttpRequest();
	request_CountDown_sound.open('GET', "https://dl.dropboxusercontent.com/s/hpn3k6msvnb2m3c/cursor3.mp3?dl=0", true);
	request_CountDown_sound.responseType = 'arraybuffer';
	request_CountDown_sound.onload = function() {
		CountDown_sound.decodeAudioData(request_CountDown_sound.response, function(buffer) {
			audio_buffer_CountDown_sound = buffer;
		}, function(){
			//エラー
		}
									   );
	};
	request_CountDown_sound.send();
};

function CountDown_sound_play(mute){
	let CountDown_sound_gain = CountDown_sound.createGain();
	let CountDown_sound_source = CountDown_sound.createBufferSource();
	CountDown_sound_source.buffer = audio_buffer_CountDown_sound;
	CountDown_sound_source.connect(CountDown_sound_gain);
	CountDown_sound_gain.connect(CountDown_sound.destination);
	if(mute == "mute"){
		CountDown_sound_gain.gain.value = 0
	}else{
		CountDown_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)
	}
	CountDown_sound_source.start(0);
}

function countDownEnd_sound_load(){
	var request_countDownEnd_sound = new XMLHttpRequest();
	request_countDownEnd_sound.open('GET', "https://dl.dropboxusercontent.com/s/pvzs4c3k9z4j923/decision1.mp3?dl=0", true);
	request_countDownEnd_sound.responseType = 'arraybuffer';
	request_countDownEnd_sound.onload = function() {
		countDownEnd_sound.decodeAudioData(request_countDownEnd_sound.response, function(buffer) {
			audio_buffer_countDownEnd_sound = buffer;
		}, function(){
			//エラー
		}
										  );
	};
	request_countDownEnd_sound.send();
};

function countDownEnd_sound_play(mute){
	let countDownEnd_sound_gain = countDownEnd_sound.createGain();
	let countDownEnd_sound_source = countDownEnd_sound.createBufferSource();
	countDownEnd_sound_source.buffer = audio_buffer_countDownEnd_sound;
	countDownEnd_sound_source.connect(countDownEnd_sound_gain);
	countDownEnd_sound_gain.connect(countDownEnd_sound.destination);
	if(mute == "mute"){
		countDownEnd_sound_gain.gain.value = 0
	}else{
		countDownEnd_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)
	}
	countDownEnd_sound_source.start(0);
}


function matchconfirm_sound_load(){
	var request_matchconfirm_sound = new XMLHttpRequest();
	request_matchconfirm_sound.open('GET', "https://dl.dropboxusercontent.com/s/25y0ey3wszmlgev/match-confirm.mp3?dl=0", true);
	request_matchconfirm_sound.responseType = 'arraybuffer';
	request_matchconfirm_sound.onload = function() {
		matchconfirm_sound.decodeAudioData(request_matchconfirm_sound.response, function(buffer) {
			audio_buffer_matchconfirm_sound = buffer;
		}, function(){
			//エラー
		}
										  );
	};
	request_matchconfirm_sound.send();
};

function matchconfirm_sound_play(mute){
	let matchconfirm_sound_gain = matchconfirm_sound.createGain();
	let matchconfirm_sound_source = matchconfirm_sound.createBufferSource();
	matchconfirm_sound_source.buffer = audio_buffer_matchconfirm_sound;
	matchconfirm_sound_source.connect(matchconfirm_sound_gain);
	matchconfirm_sound_gain.connect(matchconfirm_sound.destination);
	if(mute == "mute"){
		matchconfirm_sound_gain.gain.value = 0
	}else{
		matchconfirm_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)*0.4
	}
	matchconfirm_sound_source.start(0);
}
/**
*@note SE関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////











let demo_play_flag = false
let BGM_time = -1
let BGM_time_flag = false

let feedin_volume = -10
let volume_feedin



function getRoomKey(event){

	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		const PassWord = room.val().roomPassWord
		if(isRoomMaster){
			let PassWord_Key = window.prompt( "パスワードを変更", PassWord )
			if(PassWord_Key != null && PassWord_Key.length >= 1) {
				var updates = {};
				updates['rooms/' + roomID + "/roomPassWord"] = PassWord_Key;
				firebase.database().ref().update(updates);
			}else if(PassWord_Key == ""){
				window.alert( "1文字以上のパスワードを設定してください。" )
			}
		}else{
			window.alert( "ルームパスワード: " + PassWord)
		}

	})
}
function RoomName_Change(event){
	if(/\n/.test(event.target.innerText)){
		document.activeElement.blur()
	}
	let event_target_id = event.target.innerText.replace(/\n/g,"")
	event.target.textContent = event_target_id
	if(event_target_id.length > 64){
		event_target_id = event_target_id.slice(0,window.getSelection().focusOffset-1)+event_target_id.slice(window.getSelection().focusOffset)
		document.activeElement.blur()
		document.getElementById("RoomNameArea").innerText = event_target_id
	}
	if(event.inputType == "insertFromPaste"){
		event_target_id = event_target_id.slice(0,64)
		document.getElementById("RoomNameArea").innerText = event_target_id
	}
	var updates = {};
	updates['rooms/' + roomID + "/roomName"] = event_target_id;
	firebase.database().ref().update(updates);
}


//ルームマスターの時はゲーム開始、非ルームマスターのときは準備完了ショートカットキー[Enter]

function ready_key(event){
	if(!PHONE_TABLET_FLAG && event.key == "Enter" && (document.activeElement.tagName != "INPUT" || document.activeElement.id == "ChatInput" && !document.getElementById("ChatInput").value)){
		if(isRoomMaster){
			document.getElementById("RTCbtnGameStart").click()
		}else{
			document.getElementById("RTCbtnReady").click()
		}
	}
}

function changeBattleContainer(){
	if(combat_ranking_ViewMode == "Scroll"){
		combat_ranking_ViewMode = "Fixed"
		replace_complete_area("順位スクロール OFF")
	}else if(combat_ranking_ViewMode == "Fixed"){
		combat_ranking_ViewMode = "none"
		document.getElementById("RTCContainer").style.display = "none"
		document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.setAttribute("style","margin-top:250px!important;")
		replace_complete_area("順位非表示")
	}else{
		combat_ranking_ViewMode = "Scroll"
		document.getElementById("RTCContainer").style.display = "block"
		document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.removeAttribute("style")
		replace_complete_area("順位スクロール ON")
	}
	localStorage.setItem("combat_ranking_ViewMode",combat_ranking_ViewMode)
}

function add_clear_time(event){

	const event_target_id = event.ref_.path.pieces_[1];
	const line_number = +event.ref_.path.pieces_[4];
	const line_clear_time = +event.node_.value_
	var updates = {};
	firebase.database().ref('users').once('value').then(room_user => {
		for (let room_user_key in Players_ID) {
			if(!isNaN(line_number)){
				if(room_user_key != event_target_id && room_user.val()[room_user_key].status.ClearTime[line_number]){
					if(room_user.val()[room_user_key].status.ClearTime[line_number] > line_clear_time){
						updates['/users/' + room_user_key + '/status/ClearTime/'+ (line_number)] = null;
					}else{
						updates['/users/' + event_target_id + '/status/ClearTime/'+ (line_number)] = null;
					}
				}
			}
		}
		firebase.database().ref().update(updates);
		firebase.database().ref('users').once('value').then(room_user_update => {
			for (let room_user_key in Players_ID) {
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + room_user_key + " > .RTCclear").textContent = Object.keys( room_user_update.val()[room_user_key].status.ClearTime ).length-1+"pt";
			}
		});
	})
}
