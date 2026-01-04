// ==UserScript==
// @name        YT Live Chat アイコン非表示スクリプト - youtube.com
// @name:en     YT Live Chat Icon Hider Script - youtube.com
// @namespace   Violentmonkey Scripts
// @include     https://www.youtube.com/live_chat*
// @include     https://www.youtube.com/live_chat_replay*
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.02
// @author      tyPhoon
// @description     どうやら、卑猥なアイコンでLive中にコメントすることによって、LiveChatをそのまま表示している配信者をBANにしようとする輩がいるそうです。何人か大物の配信者もBANを食らっています！許せないのでLiveChat上で、ユーザのアイコンを非表示にするスクリプトを書きました。GUIも用意したので、簡単に無効にすることもできます。他スクリプトのようにインストールするだけで使用できます。あとは単純に画像を表示しなくなるため、メモリ節約やPCの負荷も軽減します。YouTubeのLiveChatが重たい人もお試しあれ。
// @description:en  Apparently, some people are trying to ban distributors who are displaying LiveChat as it is by commenting during Live with obscene icons. Several big name distributors have been banned!I wrote a script to hide the user's icon on LiveChat, and I've included a GUI so you can easily disable it. Just install and use it like any other script.If you have a heavy YouTube LiveChat, you can try it too.Translated with www.DeepL.com/Translator (free version)
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/444928/YT%20Live%20Chat%20%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%20-%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/444928/YT%20Live%20Chat%20%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%20-%20youtubecom.meta.js
// ==/UserScript==


// 画面に変更を加えたくないひとは、true -> false にしてください。
// If you don't want to insert GUI, change to false.
const INSERT_GUI = true;
// const INSERT_GUI = false;

const LANGUAGE = window.navigator.language === "ja" ? "ja" : "en"

const HideMode = {
  NONE: 0,
  ICON: 1,
  ICON_AND_NAME: 2,
  MAX: 3,
}

const HideModeNames = {
  "ja": ["無効", "アイコンを非表示", "アイコンと名前を非表示"],
  "en": ["Disable", "Icon", "Icon & Name"],
}

// Config. Look at https://developer.mozilla.org/ja/docs/Web/API/MutationObserver
const CONFIG = { 
  attributes: false,
  childList: true, 
  subtree: false
};

document.hiderMode = HideMode.ICON;
document.hiderModeMax = HideMode.MAX;

function main() {
  // Observe only targetNode child changes.
  const targetNode = $("yt-live-chat-item-list-renderer #items")[0];
  
  // Check enable.
  if (!targetNode) 
    return;
  
  const hide = (doms) => {
    doms.each(function(i, elem) {
      const dom = $(elem);
      const mode = document.hiderMode;

      if (mode === HideMode.ICON) {
        dom.find('yt-img-shadow').hide();
      } else if (mode === HideMode.ICON_AND_NAME) {
        dom.find('yt-img-shadow').hide();
        dom.find('yt-live-chat-author-chip').hide();
      }
    })
  }

  const callback = (mutationsList, observer) => {
    if (document.hiderMode === HideMode.NONE) return;
    
    mutationsList.forEach(mutation => {
      // const doms = $(mutation.target).find(`yt-live-chat-text-message-renderer`);
      hide($(mutation.target));
    });
  }

  // MutationObserverを使用してチャットの更新を監視。https://developer.mozilla.org/ja/docs/Web/API/MutationObserver
  let observer = new MutationObserver(callback);

  observer.observe(targetNode, CONFIG);
  
  // チャットのモードを変更すると、iframeごと破棄されるので、もう一度実行。
  // DOMが更新されてから実行するためにsetTimeoutを使用。
  for (const chatModeChangeAnchor of $("tp-yt-paper-listbox a")) {
    $(chatModeChangeAnchor).click(function() {
        setTimeout(document.hiderMain, 2000);
      }
    )
  }
  
  console.log(`Now, Icon Hider script was enbale.`);
  
  if (INSERT_GUI) 
    gui();
  
  // Make GUI.
  function gui() {
    if ($("#hider-mode-change-button").length > 0) return;
    
    
    $("head").append(`
      <style>
        .hider-padding {
          padding: 0.5em;
        }
        .hider-btn {
          border: none;
          background: #fff;
          transition: 0.2s;
          color: #808080;
        }
        .hider-btn:hover{
          background: #fff8dc;
          transition: 0.8s;
          color: #000;
        }
        .hider-btn:active{
          background: #ffe4c4;
          transition: 0.8s;
        }
        .hider-flex{
          width: 100%;
        }
        .hider-border{
          border-bottom: 1px solid #d3d3d3;
          border-top: 1px solid #d3d3d3;
        }
      </style>
    `)
    
    console.log(document.hiderMode);
    
    $("#input-panel").prepend(`
      <button 
        id="hider-mode-change-button"
        title="Inserted by Icon Hider Script. Mode Change Button"
        class="hider-btn hider-padding hider-flex hider-border"
      >${HideModeNames[LANGUAGE][document.hiderMode]}</button>
    `);
    
    $("#hider-mode-change-button").click(function() {
      document.hiderMode = (document.hiderMode + 1) % document.hiderModeMax; 
      $(this).text(HideModeNames[LANGUAGE][document.hiderMode])
    })
    
    console.log(`Now, Icon Hider GUI was inserted.`);
  }
}
 
main();
// 再実行する際に、この関数を覚えておく必要があるのでdocumentの属性としてmainを設定。このスクリプトのグローバル変数は埋め込んでいないので使えない。
document.hiderMain = main;