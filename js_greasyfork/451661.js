// ==UserScript==
// @name         Mejorador LaITV
// @icon         https://icons.duckduckgo.com/ip2/laitv.com.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Mejorador para LaITV.
// @author       wuniversales
// @license      MIT
// @match        https://informes.laitv.com/encontrado.php
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451661/Mejorador%20LaITV.user.js
// @updateURL https://update.greasyfork.org/scripts/451661/Mejorador%20LaITV.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    window.addEventListener("load", function(){
        document.body.querySelector('input[name=matricula]').disabled=false;
        document.body.querySelector('input[name=matricula]').readOnly=true;
        let mat=document.body.querySelector('input[name=matricula]').value,temp;
        if(mat.indexOf('R')==0){//Remolques
            mat=mat.replace('R', 'R-');
            temp=mat.slice(0, 6);
            mat=mat.replace(temp,temp+'-');
        }else{//Tractoras
            temp=mat.slice(0, 4);
            mat=mat.replace(temp,temp+'-');
        }
        document.body.querySelector('input[name=matricula]').value=mat.trim();
        document.body.querySelector('input[name=matricula]').addEventListener("click", copy_mat(mat.trim()));
 
        function copy_mat(mat) {
            navigator.clipboard.writeText(mat);
        }
    });
})();