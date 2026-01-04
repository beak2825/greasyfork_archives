// ==UserScript==
// @name        video fullpage
// @namespace   github.q962
// @match       https://*/*
// @match       http://*/*
// @version     1.7
// @author      q962
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_deleteValues
// @grant       GM_setValue
// @grant       GM_setValues
// @grant       GM_getValue
// @grant       GM_getValues
// @grant       GM_listValues
// @grant       GM_addElement
// @license     MIT

// @description 将 video 作为全页显示，隐藏其他元素

// @downloadURL https://update.greasyfork.org/scripts/500424/video%20fullpage.user.js
// @updateURL https://update.greasyfork.org/scripts/500424/video%20fullpage.meta.js
// ==/UserScript==

let global_css = `
.__visiable_true.__level_up {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: unset !important;
  max-height: unset !important;
  min-width: unset !important;
  min-height: unset !important;
  margin: unset !important;
  padding: unset !important;
  overflow: hidden !important;
  position: unset !important;
}

.__hidden_all > :not(.__visiable_true, .__dialog) {
  display: none !important;
}

.__dialog {
  position: fixed;
  width: 600px;
  height: auto;
  top: 30vh;
  z-index: 99999;
  background: white;
  border: 1px #aaa solid;
  border-radius: 5px;
  padding: 10px;
  left: calc( ( 100vw - 600px ) / 2 );
  box-shadow: 0px 4px 8px 0px black;
}
.__dialog > *, .__dialog > h1 {
  color: black;
  width: 100%;

}
.__dialog input {
  width: 90%;
}
`;

GM_addStyle(global_css);

///////////////////////////////

var upCount = get_upCount();
var current_video_elem = null;
var current_video_elem_controls = undefined;

/////////////////////////////////////////////////////////

var count_dialog = GM_addElement('div');
count_dialog.classList.add("__dialog");
count_dialog.innerHTML = `
  <h1>设置上层层数</h1>
  <label>正则：<input id="regex"/></label><br/>
  <label>层数：<input id="count" min=0 max=15 type="number"  value=0 /></label><br/>
  <br/>
  <button id="ok">确定</button>
  <button id="cancel">取消</button>
  <p id="msg"></p>
`;
count_dialog.hidden = true;

var regex_elem = count_dialog.querySelector("#regex");
var count_elem = count_dialog.querySelector("#count");
var msg_elem = count_dialog.querySelector("#msg");

count_dialog.querySelector("#ok").addEventListener("click", ()=>{
  let regex_str = regex_elem.value;
  let count = count_elem.value;

  if( !regex_str ) return;
  try{
    new RegExp(regex_str);
  } catch(error){
    msg_elem.innerText = error;
    return;
  }

  if( count>15 || count < 0 ){
    msg_elem.innerText = "0 <= 层数  <=15";
    return;
  }

  GM_setValue(location.origin, JSON.stringify({regex: regex_str, count: count}));

  count_dialog.hidden = true;

  upCount = count;

});

count_dialog.querySelector("#cancel").addEventListener("click", ()=>{
  count_dialog.hidden = true;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_upCount(){
  let j = JSON.parse(GM_getValue(location.origin)||null);
  if(!j) return 0;

  if( j.regex ) {
    try{
      let regex = new RegExp(j.regex);
      if( !regex.test(location.href) ) return 0;
   } catch(error){return 0;}
  }

  return parseInt(j.count);
}

function settings(){
  count_elem.value = 0;
  regex_elem.value = (location.origin+location.pathname).replaceAll(".","\\.");

  let j = JSON.parse(GM_getValue(location.origin)||null);
  if( j ) {
    if( j.regex ) regex_elem.value = j.regex;
    if( j.count ) count_elem.value = j.count;
  }

  msg_elem.innerText = "";

  count_dialog.hidden = false;
}

function do_full(target){
  let action = '';
  if(target.classList.contains("__visiable_this")){
    action = 'remove';

    if (target instanceof HTMLVideoElement ) {
      target.controls = current_video_elem_controls;
    }
  } else{
    action = 'add';

    if (target instanceof HTMLVideoElement ) {
      target.controls = true;
    }
  }

  target.classList[action]("__visiable_this");

  let p = target;
  while(p){

    p.classList[action]("__visiable_true");
    p.classList[action]("__level_up");

    if( p.parentElement )
      p.parentElement.classList[action]("__hidden_all");

    p = p.parentElement;
  }

  return action == "add";
}

function try_iframe(){
  let playing_href = GM_getValue("playing_href");

  for(let win_index=0; window.top[win_index]; win_index++){
    let win = window.top[win_index];
    if( win.____playing )
      return win.frameElement;
  }
}

function try_find(){
  let all = document.querySelectorAll("video");
  for(let i=0;i < all.length;i++){
    let videl_elem = all[i];

    if( videl_elem.currentTime > 0 && !videl_elem.paused && !videl_elem.ended ) {
      return videl_elem;
    }
  }
  return false;
}

let oldUpCount = undefined;
let isFull = false;

function set_fullpage(){
  current_video_elem = current_video_elem || try_find() || try_iframe();

  if(!current_video_elem) return;

  if (current_video_elem instanceof HTMLVideoElement ) {
    current_video_elem_controls = current_video_elem.controls;
  }

  let target = current_video_elem;
  let _upCount = upCount;

  // 如果在全页状态下，当前的 upCount 发生了改变时，
  // 需要保证移除 class 的结点要正确
  if( isFull && oldUpCount != undefined && oldUpCount != upCount )
    _upCount = oldUpCount;

  for( let i=0; i < _upCount; i++ ) {
      target = target.parentElement;
  }

  oldUpCount = upCount;
  isFull = do_full( target );
}

GM_registerMenuCommand('全页', set_fullpage);
GM_registerMenuCommand('设置', settings);

//////////////////////////////////////////////////////////////////////////////

function bind_evnet(elem){
  elem.addEventListener('play',  function(e) {
    // 记录当前正在播放的 iframe
    unsafeWindow.____playing = true;
    current_video_elem = e.target;
  });
}

const observer = new MutationObserver( function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (let node of mutation.addedNodes) {
        if (node.tagName === 'VIDEO') {
          bind_evnet(node);
        }
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function FindAllVideoElems(){

  let video_elems = document.querySelectorAll("video");
  for( let index=0; index < video_elems.length; index++){
    bind_evnet( video_elems[index] );
  }
}

FindAllVideoElems();
