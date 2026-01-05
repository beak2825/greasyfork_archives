// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         todogh-theme
// @version      0.05
// @description  New design for todogh.com
// @include      http://todogh.com/directo/
// @include      http://todogh.com/directo2/
// @include      http://todogh.com/telecinco/
// @include      http://todogh.com/chat-grande/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26472/todogh-theme.user.js
// @updateURL https://update.greasyfork.org/scripts/26472/todogh-theme.meta.js
// ==/UserScript==
//
(function(){

 function addStyleEx(css)
 {
  var dad, obj = document.createElement('style');
  obj.setAttribute('type', 'text/css');
  obj.innerHTML = css;
  dad = document.getElementsByTagName('head');
  (dad && dad.length ? dad[0] : document).appendChild(obj);
  if(document.readyState == 'loading')
   document.addEventListener('DOMContentLoaded', function(){obj.parentNode.appendChild(obj);});
  return obj;
 }
 addStyleEx(`
.section.header{display:block;position:absolute;left:0;top:0;width:250px;height:60px;margin:0;padding:0}
.section.navigation{display:block;position:absolute;left:0;top:0;width:calc(100% - 250px);height:60px;margin:0 0 0 250px;padding:0}
.main-menu>li>a{padding:25px 10px}
.section.wrapper{padding:0;position: absolute;left: 0;right: 0;bottom: 0;top: 60px;}
.section-inner{max-width:98%;height: 98%;}
.content, .post, .post-content{padding:0!important;width:100%!important;height:100%;!important}
.post-header,.adsbygoogle,.sidebar,.section.footer,.section.credits,.todog-adlabel,.cdp-cookies-alerta{display:none!important}
/* CHAT GRANDE */
.page-id-60 .post-content>p>iframe{width:100%!important}
.page-id-60 .post-content>p{margin-bottom:0}
/* DIRECTO */
.page-id-11 .post-content>p{width:50%;margin:0;font-size:80%}
.page-id-11 .post-content>p~div>iframe{float:left;width:50%!important;height:100%!important;min-height:500px}
.page-id-11 .post-content>p~p{display:none}
.page-id-11 .post-content>h6{display:none}
/* DIRECTO2 */
.page-id-103 .post-content>p~div>p>iframe{float:left;width:100%!important;height:100%!important;min-height:500px}
.page-id-103 .post-content>p~div+div>iframe{float:left;width:100%!important;height:100%!important;min-height:500px}
.page-id-103 .post-content>p~div>p>a{display:none}
/* TELECINCO */
.page-id-13 .post-content>div>div{width:100%}
.page-id-13 .post-content>div>div>p>iframe{float:left;width:50%!important;height:100%!important;min-height:500px}
`);

})();
