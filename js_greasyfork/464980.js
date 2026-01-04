// ==UserScript==
// @name         禁用中键自动滑动和SPACE跳跃SC029清空键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  禁用中键自动滑动,和SPACE跳跃SC029清空键
// @license MIT
// @author       artlana
// @match         *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464980/%E7%A6%81%E7%94%A8%E4%B8%AD%E9%94%AE%E8%87%AA%E5%8A%A8%E6%BB%91%E5%8A%A8%E5%92%8CSPACE%E8%B7%B3%E8%B7%83SC029%E6%B8%85%E7%A9%BA%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/464980/%E7%A6%81%E7%94%A8%E4%B8%AD%E9%94%AE%E8%87%AA%E5%8A%A8%E6%BB%91%E5%8A%A8%E5%92%8CSPACE%E8%B7%B3%E8%B7%83SC029%E6%B8%85%E7%A9%BA%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    var target;
    window.addEventListener('mousedown', function(mouseEvent) {
        if(mouseEvent.button != 1)
            return;
        target = mouseEvent.target;
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
    }, true);

})();


window.addEventListener('keydown', function(e) { //(要keydown才禁得了)
    let keysPressed = {};
    if (keysPressed['Control'])
    {alert("hi")}

    if(e.keyCode == 32 && ((e.target == document.body)|| isURL(e.target))) {        //如果是空白处，或者URL(谷歌点了链接会激活住)
        e.preventDefault();
    }
    else if(e.keyCode == 32 && (e.target instanceof HTMLDivElement)) {        //防止一些网页会是默认激活的空白处为divelement
        if (!(e.target.querySelector('video'))){  //(yt video 是divelement)
            if(!(e.target.getElementsByClassName('ytd-commentbox'))){  //(youtube的评论框也是divelement)
                e.preventDefault();
            }
        }
    }
    /*SC029清空键，但找不到方法全选删除，现在先用着AHK
  else if ( e.keyCode == 192 && (e.target instanceof HTMLInputElement)){
            alert('hi');

    }
*/

    /*   //NUMPAD1做法：失败
  if(e.keyCode == 96 && (e.target instanceof HTMLDivElement)) {        //防止一些网页会是默认激活的空白处为divelement
  var x = e.target.querySelector('video');
    if (x){
            e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
            x.pause();

    }
  }*/

    /*
  else if(e.keyCode == 33 && (e.target instanceof HTMLDivElement || e.target instanceof HTMLHeadingElement)) {
      var video = e.target.querySelector('video');
      if (video){
        e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false
      }
  }
  else if(e.keyCode == 34 && (e.target instanceof HTMLDivElement || e.target instanceof HTMLHeadingElement)) {
      video = e.target.querySelector('video');
      if (video){
        e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false
      }
  }

    if(e.keyCode == 32){
      alert(e.target)
    }*/
});

function isURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


//其他方法：看是不是HTMLInputElement、或者HTMLDivElement、或HTMLHeadingElement。这么写e.target instanceof HTMLDivElement

/*bug：


*/
