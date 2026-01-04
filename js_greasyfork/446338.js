// ==UserScript==
/*
远程调用代码 ：  	https://greasyfork.org/scripts/441600-jk/code/jk.user.js
php <script src="https://greasyfork.org/scripts/441600-jk/code/jk.user.js<?php echo "?v=".rand(1,10000);?>"></script>
js:
     var url='https://greasyfork.org/scripts/441600-jk/code/jk.user.js';
     el=document.createElement('script');
     el.src=url+'?rnd='+Math.random();
     document.getElementsByTagName("head")[0].appendChild(el); 
*/
//  
// @name            usejq
// @namespace       moe.canfire.flf

// @description     引入jQuery
// @author          mengzonefire
// @license         MIT
// @match           *
 
// @resource jquery         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @version 0.0.1.20220611082718
// @downloadURL https://update.greasyfork.org/scripts/446338/usejq.user.js
// @updateURL https://update.greasyfork.org/scripts/446338/usejq.meta.js
// ==/UserScript==
  
     var url='https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js';
     el=document.createElement('script');
     el.src=url+'?rnd='+Math.random();
     document.getElementsByTagName("head")[0].appendChild(el);

      




 
   



    