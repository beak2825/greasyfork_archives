// ==UserScript==
// @name         Second Browser Protocol
// @version      0.0.0.2
// @description  レジストリで指定したプロトコルを利用して別のブラウザにリダイレクトします。
// @author       Shikikan
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/159960
// @downloadURL https://update.greasyfork.org/scripts/423922/Second%20Browser%20Protocol.user.js
// @updateURL https://update.greasyfork.org/scripts/423922/Second%20Browser%20Protocol.meta.js
// ==/UserScript==

(()=>{
// ================== ユーザー設定 ==================
  
  // 置換先のプロトコル名
  const protocolName = "secondbrowser";
  
  // リダイレクト対象のURL
  const targetURLs = [
    "//www.curseforge.com/",
    "//www.loverslab.com/"
  ];
  
  // リダイレクト対象のセレクター
  const targetSelectors = [
    ".cf-browser-verification"
  ];
  
  // リンクを対象にする = true
  // ページが開くまで待つ = false
  const aggressiveMode = false;
  
// ================== 設定ここまで ==================
  
  // スクリプト名（デバッグ用）
  const scriptName = "Second Browser Protocol";
  
  // 特定の要素が存在する場合は即開き直す
  for(let i=0,len=targetSelectors.length; i<len; i++) {
    if( document.querySelector( targetSelectors[i] ) ) {
      location.href = location.href.replace( /^https?/, protocolName );
      ( history.length == 1 ) ? window.close() : history.back();
    }
  };
  
  // 普通に開けた場合はそのまま終了する
  for(let i=0,len=targetURLs.length; i<len; i++) {
    if( location.href.indexOf( targetURLs[i] ) != -1 ) {
      console.log(scriptName + ": 正常にブラウジング可能なのでURL置換は行いません");
      return;
    }
  };
  
  // onMouseDownの処理
  const onMouseDown = (e) => {
    console.log(scriptName + ": クリックが発生");
    if( typeof e.target === "undefined" ) return;

    // 対象の要素がAタグになるまで親を遡る
    let elem = e.target;
    let i = 0;
    while( i<100 && elem.tagName.toUpperCase() != "BODY" ) {
      if( typeof elem.href !== "undefined" ) break; 
      elem = elem.parentNode;
      i++;
    }
    // Aタグが無いか、直近のリンクが置換済みなら終了
    if( i>=100 || elem.tagName.toUpperCase() == "BODY" || elem.href.indexOf(protocolName) == 0 ) return;

    // リンクのプロトコル部分を置換する
    for(let i=0,len=targetURLs.length; i<len; i++) {
      if( elem.href.indexOf( targetURLs[i] ) != -1 ) {
        elem.href = elem.href.replace( /^https?/, protocolName );
        console.log(scriptName + ": " + elem.href);
        return;
      }
    }
  };
  
  // リンクを対象にするならイベント登録
  if( aggressiveMode ) {
    document.body.addEventListener("mousedown", onMouseDown, { capture:false, passive:true });
  }
})();
