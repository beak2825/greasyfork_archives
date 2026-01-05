// ==UserScript==
// @name        Auto-Love
// @version      1.01
// @description  dejar abierto onics feed. @macrigatou cualquier duda...
// @match        https://onics.me/user/feeds
// @grant        none
// @namespace https://greasyfork.org/users/117692
// @downloadURL https://update.greasyfork.org/scripts/29065/Auto-Love.user.js
// @updateURL https://update.greasyfork.org/scripts/29065/Auto-Love.meta.js
// ==/UserScript==
/* jshint -W097 */


(function(){
    function autolove(){
$(".brz-btn-love").each(function(){
            var $this = $(this);
                if(!$this.hasClass("brz-pink-light")){
                $this.click();
            }
            }
        );
    }
    setInterval(autolove, 500);
   })();