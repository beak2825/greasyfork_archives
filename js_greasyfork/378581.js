// ==UserScript==
// @name        JR Mturk Panda Crazy
// @version     10.6.9
// @description Collects panda's for you at a certain cycle instead of timers. Lot of organizing of panda's and grouping them together to start and stop them at once.
// @author      M.C.KRISH & RUTHUVAN (Modified to Own Use) Courtasy to JohnnyRS Script
// @include     http*://worker.mturk.com/?filters[search_term]=pandacrazy=on*
// @include     http*://worker.mturk.com/requesters/PandaCrazy/projects*
// @include     http*://worker.mturk.com/?PandaCrazy*
// @include     http*://worker.mturk.com/?end_signin=1&filters%5Bsearch_term%5D=pandacrazy%3Don*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require	https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.js
// @require	https://cdn.jsdelivr.net/gh/mckrishnan/digilock@cd85ae803afa92e10cf98dab78fa8918b71d259d/pc.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/jquery.layout.min.js
// @resource    jQueryUICSS          http://code.jquery.com/ui/1.11.4/themes/pepper-grinder/jquery-ui.css
// @resource    jQueryModalCSS       https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.css
// @resource    jQueryLayoutCSS      https://cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/layout-default.css
// @connect     allbyjohn.com
// @connect     mturk.com
// @connect     tiny.cc
// @connect     ibotta.com
// @connect     ns4t.net
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant 		GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_setClipboard
// @namespace   https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/378581/JR%20Mturk%20Panda%20Crazy.user.js
// @updateURL https://update.greasyfork.org/scripts/378581/JR%20Mturk%20Panda%20Crazy.meta.js
// ==/UserScript==