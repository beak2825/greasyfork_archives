// ==UserScript==
// @name        YT Live Chat Emoji Replacer Script - youtube.com
// @name:en     YT Live Chat Emoji Replacer Script - youtube.com
// @name:ja     YT Live Chat 絵文字置換スクリプト - youtube.com
// @namespace   Violentmonkey Scripts
// @include     https://www.youtube.com/live_chat*
// @include     https://www.youtube.com/live_chat_replay*
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.21
// @author      tyPhoon
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @description     If you have a lot of emojis in live chat on YouTube, it can be slow. This script makes the process faster by replacing the emoji to alt attr.
// @description:en  If you have a lot of emojis in live chat on YouTube, it can be slow. This script makes the process faster by replacing the emoji to alt attr.
// @description:ja  imgタグをすべてalt要素のテキストに変換します。メモリ節約、CPUの負荷軽減が期待できます。ライブ配信にて、コメントを表示していると配信が止まってしまう人は試してみてください。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/442961/YT%20Live%20Chat%20Emoji%20Replacer%20Script%20-%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/442961/YT%20Live%20Chat%20Emoji%20Replacer%20Script%20-%20youtubecom.meta.js
// ==/UserScript==


// 画面に変更を加えたくないひとは、true -> false にしてください。
// If you don't want to insert GUI, change to false.
const INSERT_GUI = true;
// const INSERT_GUI = false;


// 特定の絵文字を特定の文字に変換したい場合に使用します。
// You can add some emojis you want to detect.
const DETECT_EMOJIS = [
  {emoji: "👏", replaceChar: "8"},
  {emoji: "👏🏻", replaceChar: "8"},
  {emoji: "👏🏾", replaceChar: "8"},
  // {emoji: "", replaceChar: ""},
  // 
  // ex)
  // {emoji: "kao", replaceChar: ""}, // 'kao' is example of membership emoji's alt name.
];


const LANGUAGE = window.navigator.language === "ja" ? "ja" : "en"

const ReplaceMode = {
  NONE: 0,
  ALL: 1,
  DETECT: 2,
}

const ReplaceModeNames = {
  "ja": ["無効", "すべて", "指定のみ"],
  "en": ["Disable", "All", "Detect"],
}

// Config. Look at https://developer.mozilla.org/ja/docs/Web/API/MutationObserver
const CONFIG = { 
  attributes: false,
  childList: true, 
  subtree: false
};

// er => emoji replacer
document.erMode = ReplaceMode.ALL;

function main() {
  // Observe only targetNode child changes.
  const targetNode = $("yt-live-chat-item-list-renderer #items")[0];
  // const targetNode = $("yt-live-chat-renderer #items")[0];
  // console.log(targetNode); // If you want to check what targetNode is, uncomment this line.
  
  
  // Check enable.
  if (!targetNode) 
    return;
  
  const replace = (doms) => {
//     let alt = dom.attr("alt");
//     console.log(alt); 
    
//     for (const detectEmoji of DETECT_EMOJIS) {        
//       if (alt == detectEmoji.emoji) {
//         console.log("detect");
//         dom.replaceWith(detectEmoji.replaceChar);
//         return;
//       }
//     }

//     if (document.erMode === ReplaceMode.ALL) dom.replaceWith(alt);
    doms.each(function(i, elem) {
      const dom = $(elem);
      const alt = dom.attr("alt")
      
      for (const detectEmoji of DETECT_EMOJIS) {        
        if (alt == detectEmoji.emoji) {
          dom.replaceWith(detectEmoji.replaceChar);
          return;
        }
      }

      if (document.erMode === ReplaceMode.ALL) dom.replaceWith(alt);
    })
  }

  const callback = (mutationsList, observer) => {
    if (document.erMode === ReplaceMode.NONE) return;
    
    mutationsList.forEach(mutation => {
      // console.log(mutation.target); // If you want to check what mutation is, uncomment this line.
      const doms = $(mutation.target).find(`#message img`);
      if (doms.length > 0) replace(doms)
    });
  }

  // MutationObserverを使用してチャットの更新を監視。https://developer.mozilla.org/ja/docs/Web/API/MutationObserver
  let observer = new MutationObserver(callback);

  observer.observe(targetNode, CONFIG);
  
  // チャットのモードを変更すると、iframeごと破棄されるので、もう一度実行。
  // DOMが更新されてから実行するためにsetTimeoutを使用。
  for (const chatModeChangeAnchor of $("tp-yt-paper-listbox a")) {
    $(chatModeChangeAnchor).click(function() {
        setTimeout(document.erMain, 2000);
      }
    )
  }
  
  console.log(`Now, Emoji Replacer script was enbale.`);
  
  if (INSERT_GUI) 
    gui();
  
  // Make GUI.
  function gui() {
    if ($("#er-mode-change-button").length > 0) return;
    
    
    $("head").append(`
      <style>
        .er-padding {
          padding: 0.5em;
        }
        .er-btn {
          border: none;
          background: #fff;
          transition: 0.2s;
          color: #808080;
        }
        .er-btn:hover{
          background: #fff8dc;
          transition: 0.8s;
          color: #000;
        }
        .er-btn:active{
          background: #ffe4c4;
          transition: 0.8s;
        }
        .er-flex{
          width: 100%;
        }
        .er-border{
          border-bottom: 1px solid #d3d3d3;
          border-top: 1px solid #d3d3d3;
        }
      </style>
    `)

    $("#input-panel").prepend(`
      <button 
        id="er-mode-change-button"
        title="Inserted by Emoji Replacer Script. Mode Change Button"
        class="er-btn er-padding er-flex er-border"
      >${ReplaceModeNames[LANGUAGE][document.erMode]}</button>
    `);
    
    $("#er-mode-change-button").click(function() {
      document.erMode = (document.erMode + 1) % 3; 
      $(this).text(ReplaceModeNames[LANGUAGE][document.erMode])
    })
    
    console.log(`Now, Emoji Replacer GUI was inserted.`);
  }
}
 
main();
// 再実行する際に、この関数を覚えておく必要があるのでdocumentの属性としてmainを設定。
document.erMain = main;

