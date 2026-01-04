// ==UserScript==
// @name        ins shotcut
// @name:zh     ins 快捷键增强
// @namespace   neysummer2000_insShotcut
// @match       https://www.instagram.com/
// @grant       none
// @version     1.1
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @author      -
// @license MIT
// @description Use cursor keys to browse images, use shortcut keys to like and favorite,ArrowLeft:Prev | image ArrowRight:Next Image | Up ArrowDown:NextArticle | ArrowUp:PrevArticle | KeyZ:Like | KeyX: Add to Favorite
// @description:zh Use cursor keys to browse images, use shortcut keys to like and favorite,ArrowLeft:Prev | image ArrowRight:Next Image | Up ArrowDown:NextArticle | ArrowUp:PrevArticle | KeyZ:Like | KeyX: Add to Favorite
// @downloadURL https://update.greasyfork.org/scripts/423074/ins%20shotcut.user.js
// @updateURL https://update.greasyfork.org/scripts/423074/ins%20shotcut.meta.js
// ==/UserScript==

(function(){
  var _dom;
  window.addEventListener('scroll', (e) => {
   var dom = $(document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)).parents('article');
   if(dom.length){
     _dom = dom;
   }
 });
  window.addEventListener('keydown', (e) => {
     if(!_dom || $(':focus').length && $(':focus')[0].nodeName.toLocaleLowerCase() == 'textarea') return;
    switch(e.code){
      case 'ArrowDown':
        var next = _dom.next();
        if(next.length){
          e.preventDefault();
          _dom = next;
         scrollTo(next.offset().top - 54);
        }
        break;
        
      case 'ArrowUp':
        var prev = _dom.prev();
        if(prev.length){
          e.preventDefault();
          _dom = prev;
         scrollTo(prev.offset().top - 54);
        }
        break;
        
      case 'ArrowLeft':
         var btn = _dom.find('.POSa_');
         if(btn.length){
           btn[0].click();
        }
        break;
        
      case 'ArrowRight':
        var btn = _dom.find('._6CZji');
        console.log(btn);
         if(btn.length){
           btn[0].click();
        }
        break;
        
      case 'KeyZ':
        _dom.find('.fr66n button')[0].click();
          break;
        
       case 'KeyX':
        _dom.find('.wmtNn svg').parents('.wpO6b')[0].click()
          break;
    }
     });
  
  function scrollTo(y, ms = 600){
     $("html, body").stop(true, true).animate({
            scrollTop: y+'px',
          }, ms);
  }
})();