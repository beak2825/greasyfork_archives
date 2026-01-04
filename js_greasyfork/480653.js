// ==UserScript==
// @name        Library
// @description Never install it.
// @author      Sakura
// @namespace   http://extensions.fenrir-inc.com/list/author/Sakura_Kocho/
// @match       http://*/*
// @match       https://*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version     0.0.9
// @history:ja  0.0.1 localstrage.setitem追加
// @history:ja  0.0.2 setitemに例外処理
// @history:ja  0.0.3 position fixed
// @history:ja  0.0.5 ~.select(); document.execCommand("Copy");は要素を隠していると動作しない
// @history:ja  0.0.8 clipボタンを復活 項目を追加
// @history:ja  0.0.9 ミリタリー速報の広告をtarterselector.parentelementとすると広告元のurlを参照してしまうことが判明
// @downloadURL https://update.greasyfork.org/scripts/480653/Library.user.js
// @updateURL https://update.greasyfork.org/scripts/480653/Library.meta.js
// ==/UserScript==
 
var css = function(){/*
.go2333016382 {
 color:rgb(232, 234, 237);
 color-scheme:dark;
 font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
 font-size:13px;
 line-height:1.5;
}
.go2333016382 *,
.go2333016382 *::before,
.go2333016382 *::after {
 box-sizing:border-box;
}
.go3826439780 {
 align-items:center;
 background:rgba(0, 0, 0, 0.6);
 display:flex;
 justify-content:center;
 height:100%;
 left:0;
 position:fixed;
 top:0;
 width:100%;
 z-index:100000;
}
.go1742019026 {
 color: #FFF;
 background:rgb(41, 42, 45);
 border-radius:8px;
 box-shadow:0 0 16px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.24);
 max-height:100%;
 max-width:100%;
 outline:none;
 overflow-y:auto;
 padding:1.5em;
 width:80%;
 position: fixed;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 z-index:2147483646;
}
.go1043490243 {
 word-break:break-all;
}
 
 
.go1918864833 {
 margin-bottom:1em;
}
.go1103109428 {
 font-size:1.125em;
 font-weight:normal;
 margin:0;
}
.go297108182 {
 align-items:center;
 display:flex;
 flex-wrap:nowrap;
 justify-content:flex-start;
}
.go297108182:not(:first-child) {
 margin-top:1em;
}
 
 
.go3308260910 {
 flex-grow:0;
 flex-shrink:0;
 min-width:0;
}
.go3308260910:not(:first-child) {
 margin-left:0.625em;
}
 
 
.go504329284 {
 flex-grow:1;
 flex-shrink:1;
 min-width:0;
}
.go504329284:not(:first-child) {
 margin-left:0.625em;
}
 
 
.go2939226367 {
 cursor:pointer;
 outline:none;
}
.go2939226367:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go2939226367:focus:not(:focus-visible) {
 box-shadow:none;
}
.go2939226367:focus:not(:-moz-focusring) {
 box-shadow:none;
}
 
 
.go3433268835 {
 margin-top:1em;
}
.go389740541 {
 margin-bottom:0.5em;
 opacity:1;
}
.go435145941 {
 color:rgb(232, 234, 237);
 cursor:pointer;
}
.go758480430 {
 background:transparent;
 border:solid 1px rgb(95, 99, 104);
 border-radius:4px;
 color:rgb(232, 234, 237);
 display:block;
 font:inherit;
 height:calc(1em * 2 + 2px);
 line-height:1;
 padding:0.5em 0.625em;
 resize:none;
 width:100%;
 word-break:break-all;
}
.go758480430:disabled {
 opacity:0.38;
}
.go758480430:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
 outline:none;
}
.go758480430:read-only {
 color:rgb(154, 160, 166);
}
 
 
.go2658119172 {
 background:transparent;
 border:solid 1px rgb(95, 99, 104);
 border-radius:4px;
 color:rgb(232, 234, 237);
 display:block;
 font:inherit;
 height:calc(1.5em * 2 + 1em + 2px);
 line-height:1.5;
 padding:0.5em 0.625em;
 resize:none;
 width:100%;
 word-break:normal;
}
.go2658119172:disabled {
 opacity:0.38;
}
.go2658119172:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
 outline:none;
}
.go2658119172:read-only {
 color:rgb(154, 160, 166);
}
 
 
 
.go3433279036 {
 margin-top:2em;
}
.go3755328674 {
 align-items:center;
 display:flex;
 flex-wrap:wrap;
 justify-content:flex-end;
}
.go3755328674:not(:first-child) {
 margin-top:1em;
}
 
 
.go1741954662 {
 background:transparent;
 border:none;
 color:rgb(138, 180, 248);
 cursor:pointer;
 display:inline;
 font:inherit;
 outline:none;
 padding:0;
}
.go1741954662:disabled {
 cursor:default;
}
.go1741954662:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go1741954662:focus:not(:focus-visible) {
 box-shadow:none;
}
.go1741954662:focus:not(:-moz-focusring) {
 box-shadow:none;
}
 
 
.go1001709306 {
 background:transparent;
 border:solid 1px rgb(95, 99, 104);
 border-radius:4px;
 color:rgb(138, 180, 248);
 cursor:pointer;
 font:inherit;
 height:2.5em;
 outline:none;
 padding:calc(0.5em - 1px) 1em;
}
.go1001709306:active {
 background:rgba(138, 180, 248, 0.16);
}
.go1001709306:disabled {
 background:transparent;
 color:rgb(128, 134, 139);
 cursor:default;
}
.go1001709306:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go1001709306:focus:not(:focus-visible) {
 box-shadow:none;
}
.go1001709306:focus:not(:-moz-focusring) {
 box-shadow:none;
}
.go1001709306:hover:not(:active):not(:disabled) {
 background:rgba(138, 180, 248, 0.08);
}
.go1680006790 {
 background:rgb(138, 180, 248);
 border:none;
 border-radius:4px;
 color:rgb(32, 33, 36);
 cursor:pointer;
 font:inherit;
 height:2.5em;
 outline:none;
 padding:0.5em 1em;
}
.go1680006790:active {
 background:rgba(138, 180, 248, 0.8);
}
.go1680006790:disabled {
 background:rgb(60, 64, 67);
 color:rgb(128, 134, 139);
 cursor:default;
}
.go1680006790:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go1680006790:focus:not(:focus-visible) {
 box-shadow:none;
}
.go1680006790:focus:not(:-moz-focusring) {
 box-shadow:none;
}
.go1680006790:hover:not(:active):not(:disabled) {
 background:rgba(138, 180, 248, 0.9);
}
.go2348475077 {
 align-items:center;
 background:rgba(0, 0, 0, 0.6);
 display:none;
 justify-content:center;
 height:100%;
 left:0;
 position:fixed;
 top:0;
 width:100%;
 z-index:100000;
}
.GoodByeApril {
 display: none;
}
.ElementCheck {
 border-style: solid;
 border-width: thin;
 border-color: #ff007f;
}
*/}.toString().match(/\n([\s\S]*)\n/)[1];
 
var style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);
 
function previousElementSibling (element) {
  if (element.previousElementSibling !== 'undefined') {
    return element.previousElementSibling;
  } else {
    while (element = element.previousSibling) {
      if (element.nodeType === 1) {
        return element;
      }
    }
  }
}
 
   /* 外部より挿入 */
function getXpath(element) {
  if(element && element.parentNode) {
    var xpath = getXpath(element.parentNode) + '/' + element.tagName;
    var s = [];
    for(var i = 0; i < element.parentNode.childNodes.length; i++) {
      var e = element.parentNode.childNodes[i];
      if(e.tagName == element.tagName) {
        s.push(e);
      }
    }
    if(1 < s.length) {
      for(var i = 0; i < s.length; i++) {
        if(s[i] === element) {
          xpath += '[' + (i+1) + ']';
          break;
        }
      }
    }
    return xpath.toLowerCase();
  } else {
    return '';
  }
}
 
 
function getPath (element) {
  if (!(element instanceof HTMLElement)) { return false; }
  var path = [];
  while (element.nodeType === Node.ELEMENT_NODE) {
    var selector = element.nodeName;
    if (element.id) { selector += ('#' + element.id); }
    else {
      var sibling = element;
      var siblingSelectors = [];
      while (sibling !== null && sibling.nodeType === Node.ELEMENT_NODE) {
        siblingSelectors.unshift(sibling.nodeName);
        sibling = previousElementSibling(sibling);
      }
      if (siblingSelectors[0] !== 'HTML') {
        siblingSelectors[0] = siblingSelectors[0] + ':first-child';
      }
      selector = siblingSelectors.join(' + ');
    }
    path.unshift(selector);
    element = element.parentNode;
  }
  return path.join(' > ');
}
 
function DialogCreate () {
  eval(`
    document.documentElement.insertAdjacentHTML('afterbegin', '\
      <div aria-labelledby="title" class="go1742019026" aria-modal="true" role="dialog" tabindex="-1">\
        <div class="go1918864833">\
          <h1 id="title" class="go1103109428">\
            <div class="go297108182">\
              <div class="go504329284">ブロックする要素</div>\
            </div>\
          </h1>\
        </div>\
        <div>\
          <div class="go297108182">\
            <div class="go504329284">\
              <span class="go1043490243">${BlockElement}</span>\
            </div>\
          </div>\
          <div class="go297108182">\
            <div class="go504329284">\
              <details>\
                <summary class="go2939226367 js-focus-start">詳細</summary>\
                <div class="go3433268835">\
                  <div class="go297108182">\
                    <div class="go504329284">\
                      <div class="go389740541">\
                        <div>\
                            <label class="go435145941" for="url">実行されるドメイン</label>\
                        </div>\
                      </div>\
                      <textarea id="url" readonly="" rows="1" class="go758480430">${Domain}</textarea>\
                    </div>\
                  </div>\
                  <div class="go297108182">\
                    <div class="go504329284">\
                      <div class="go389740541">\
                        <div>\
                          <label class="go435145941" for="pageTitle">XPath</label>\
                        </div>\
                      </div>\
                      <textarea id="pageTitle" readonly="" rows="1" spellcheck="false" class="go2658119172">${XPath}</textarea>\
                    </div>\
                  </div>\
                  <div class="go297108182">\
                    <div class="go504329284">\
                      <div class="go389740541">\
                        <div>\
                          <label class="go435145941" for="rulesToAdd">非表示にする要素</label>\
                        </div>\
                      </div>\
                      <textarea id="rulesToAdd" rows="1" spellcheck="false" class="go758480430">${BlockElement}</textarea>\
                      <textarea id="allData2Clip" rows="1" spellcheck="false" class="go758480430">${Domain}+${XPath}+${BlockElement}</textarea>\
                      子の親<input type="checkbox" class="ChecBoxOYA" onchange="CBOYA()">　／　全要素<input type="checkbox" class="ChecBoxALL" onchange="CBALL()">\
                    </div>\
                  </div>\
                </div>\
              </details>\
            </div>\
          </div>\
        </div>\
        <div class="go3433279036">\
          <div class="go3755328674">\
            <div class="go504329284">\
              <button class="go1741954662" onclick="ButtonParent()">親要素</button>\
            </div>\
            <div class="go3308260910">\
              <div class="go297108182">\
                <div class="go3308260910">\
                  <button class="go1001709306" type="button" onclick="ButtonCopy2Clip()">Clip</button>\
                </div>\
                <div class="go3308260910">\
                  <button class="go1001709306" type="button" onclick="ButtonCancel()">キャンセル</button>\
                </div>\
                <div class="go3308260910">\
                  <button class="go1680006790" type="button" onclick="ButtonBlock()">ブロック</button>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
    ')
  `);
}
 
/* 子の親 */
function CBOYA() {
  if (document.querySelector('input[class="ChecBoxOYA"]').checked){
    if (!!TargetSelector.parentElement) {
      for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
        document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
      }
      document.querySelector(BlockElement).parentElement.classList.add("ElementCheck");
    }
  } else {
    for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
      document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
    }
    document.querySelector(BlockElement).classList.add("ElementCheck");
  }
}
/* 全要素 */
function CBALL() {
  if (document.querySelector('input[class="ChecBoxALL"]').checked){
    for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
      document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
    }
    for (var i = 0 ; i < document.querySelectorAll(BlockElement).length ; i++){
      document.querySelectorAll(BlockElement)[i].classList.add("ElementCheck");
    }
  } else {
    for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
      document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
    }
    document.querySelector(BlockElement).classList.add("ElementCheck");
  }
}
/* 親要素 */
function ButtonParent() {
    /* tergetselectorを更新*/
    /* ミリタリー速報ではここで失敗している */
    /* 広告元のurlになっている */
  if (!!TargetSelector.parentElement) {
    for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
      document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
    }
    TargetSelector = TargetSelector.parentElement;
    
/* 赤枠用のA_attributeを更新*/
    var A_attribute = "";
    for (var i = 0 ; i < TargetSelector.attributes.length ; i++){
      if (TargetSelector.attributes[i].name != "style") {
        A_attribute = A_attribute + "[" + TargetSelector.attributes[i].name  + "=\"" + TargetSelector.attributes[i].value  + "\"]";
      }
    }
    XPath = getPath(TargetSelector);
    Domain = window.location.hostname;
    BlockElement = TargetSelector.tagName + A_attribute;

    alert("TargetSelector:" + TargetSelector +　"\nA_attribute:" + A_attribute + "\nblockelement:" + BlockElement);
    //ButtonCopy2Clip();
    let tempElem1 = document.querySelector('div[class="go1742019026"]');
    tempElem1.remove();


/* 赤枠の再表示*/
    /*　ミリタリー速報では失敗する　*/
    let tempElem2 = document.querySelector(BlockElement);
    alert("element:" + tempElem2);
    tempElem2.classList.add("ElementCheck");

 
    DialogCreate ();
  }
}
function ButtonCancel() {
  /* delete CANVAS(ID SakuraCanvas)@foreground. if doesnt delete, we cannot touch other elements. */
  document.getElementById('SakuraCanvas').remove();
  /* delete dialog */
  document.querySelector('div[class="go1742019026"]').remove();
  /* delete red rectangle line */
  for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
    document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
  }
 
  /* これがないと、スクリプトが中止されたまま。 */
  //ScriptRun();
}
 
function ButtonCopy2Clip() {
    //  httpsサイトでは使用できるが、httpサイトでは使用できない。
    //	navigator.clipboard.writeText("Domain:" + Domain +",XPath:" + XPath + ",BlockElement:" + BlockElement);
    var varText = document.getElementById("allData2Clip");
    varText.select();
    document.execCommand("Copy");
} 
 
function ButtonBlock() {
  document.getElementById('SakuraCanvas').remove();
  document.querySelector('div[class="go1742019026"]').remove();
  for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
    document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
  }
  XPath = getPath(TargetSelector);
  setItem2LocalStrage(XPath);
//  XPath = getXpath(TargetSelector);
//  let nodesSnapshot = getElementsByXPath(XPath, document);
//  for (let i = 0; i < nodesSnapshot.length-1; ++i) {
// //  何故かうまく行かない
////　　　→代入された要素を削除しても、元の要素は消えない 
//    nodesSnapshot.snapshotItem(i).remove();
//  }
/*
  HideElement();
  */
  ScriptRun();
  window.location.reload(false);
}
 
function setItem2LocalStrage(XPath){
    var tempI = localStorage.getItem('SakuraBlocker');
    if(tempI != null){
            tempI = tempI + ";" + XPath;
            localStorage.setItem('SakuraBlocker', tempI);
    } else {
            localStorage.setItem('SakuraBlocker', XPath);
    }
}
 
  /* 外部より挿入 */
function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    alert(query.snapshotLength);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        /* これで要素が消える */
        /* query.snapshotItem(i).remove(); */
        results.push(query.snapshotItem(i));
    }
    return results;
}
 
function ScriptRun() {
  Check = "NO";
  var canvas = "<canvas id=\"SakuraCanvas\" style=\"z-index: 2147483645; width: 100%; height: 100vh; opacity: 0.0; position:fixed; left: 0%; top: 0%;\"></canvas>";
  document.documentElement.insertAdjacentHTML("afterbegin", canvas);
  document.onmousemove = function (e) {
    if (Check == "NO") {
      var x = event.pageX -window.pageXOffset;
      var y = event.pageY -window.pageYOffset;
      document.getElementById('SakuraCanvas').remove();
      TargetSelector = document.elementFromPoint(x,y);
			var A_attribute = "";
			for (var i = 0 ; i < TargetSelector.attributes.length ; i++){
				if (TargetSelector.attributes[i].name != "style", TargetSelector.attributes[i].name != "onclick") {
					A_attribute = A_attribute + "[" + TargetSelector.attributes[i].name  + "=\"" + TargetSelector.attributes[i].value  + "\"]";
				}
			}
      XPath = getPath(TargetSelector);
      Domain = window.location.hostname;
      BlockElement = TargetSelector.tagName + A_attribute;
      //ButtonCopy2Clip();
      document.querySelector(BlockElement).classList.add("ElementCheck");
      var canvas = "<canvas id=\"SakuraCanvas\" style=\"z-index: 2147483645; width: 100%; height: 100vh; opacity: 0.0; position:fixed; left: 0%; top: 0%;\"></canvas>";
      document.documentElement.insertAdjacentHTML("afterbegin", canvas);
      Check = "OK";
    } else {
      DialogCreate ();
      Check = "NO";
      document.onmousemove = function (e) {};
    }
  };
}