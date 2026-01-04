// ==UserScript==
// @name         pwstyle
// @namespace    xyzdwf/pwstyle
// @version      0.4
// @description  change pw style
// @author       xyzdwf
// @license MIT
// @match        *://*/pw/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAhUlEQVRIS2NkoDFgpLH5DPS1QHLP7P8gHz13SaWaxRgGgSxBtgBmKSlBiayfvhYgu5ZawUS1sMYVhMPMAprHgdTu2Q3/mBj+M/5naIBFMlWTKcgwxv8MjaAIe+aa2gCiqW4BLDWMJlNYSNA3Hwz9ZArKB6Cw+8/IUE+zfDCaTNGLbZonUwCqPFEZqtQoRgAAAABJRU5ErkJggg==
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432556/pwstyle.user.js
// @updateURL https://update.greasyfork.org/scripts/432556/pwstyle.meta.js
// ==/UserScript==
function isInt(str) {
	var reg = new RegExp("^[1-9][0-9]*$");
	return reg.test(str);
}
var ccnt=GM_getValue('fxqy_ccnt');
if(ccnt==null || typeof(ccnt)=='undefined' || !isInt(ccnt))ccnt=0;
function bindItmClk(itm){
   itm.onclick=function(){
       ccnt++;
       this.innerHTML="["+ccnt+"]"
       this.style.color="#489F78";
       this.parentNode.style.padding="0px";
       this.parentNode.parentNode.style.backgroundColor="#E2F3E8";
       GM_setValue('fxqy_ccnt', ccnt);
   }
}
(function() {
    'use strict';

    document.title='---['+ccnt+']---';
    var its = document.querySelectorAll("#ajaxtable>tbody>tr>td>a");
    for(var i=0; i<its.length; i++){
        bindItmClk(its[i]);
    }
})();
