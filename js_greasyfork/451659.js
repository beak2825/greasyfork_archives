// ==UserScript==
// @name         Mejorador Applusiteuve
// @icon         https://icons.duckduckgo.com/ip2/applusiteuve.com.ico
// @version      0.2
// @namespace    https://greasyfork.org/users/592063
// @description  Mejorador para Applusiteuve.
// @author       wuniversales
// @license      MIT
// @match        https://apps.applusiteuve.com/*/mobile/fichamob.aspx*
// @match        https://apps.applusiteuve.com/*/CveFile
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451659/Mejorador%20Applusiteuve.user.js
// @updateURL https://update.greasyfork.org/scripts/451659/Mejorador%20Applusiteuve.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let location_url=window.location.href;
    let mat,temp;
    if(location_url.indexOf('https://apps.applusiteuve.com/cve/mobile/fichamob.aspx')==0){//Vista movil
        mat=document.body.querySelector('span#lblMatricula').innerText;
        if(mat.indexOf('R')==0){//Remolques
            mat=mat.replace('R', 'R-');
            temp=mat.slice(0, 6);
            mat=mat.replace(temp,temp+'-');
        }else{//Tractoras
            temp=mat.slice(0, 4);
            mat=mat.replace(temp,temp+'-');
        }
        document.body.querySelector('span#lblMatricula').innerHTML='<br><input type="button" value="'+mat.trim()+'" onclick="navigator.clipboard.writeText('+"'ITV "+mat.trim()+" ( APPlus "+document.querySelector('#HCVE').value+" )'"+')">';
    }
 
    if(location_url.indexOf('https://apps.applusiteuve.com/CVE/CveFile')==0){//Vista PC
        mat=document.body.querySelector('input#LicensePlate').value;
        if(mat.indexOf('R')==0){//Remolques
            mat=mat.replace('R', 'R-');
            temp=mat.slice(0, 6);
            mat=mat.replace(temp,temp+'-');
        }else{//Tractoras
            temp=mat.slice(0, 4);
            mat=mat.replace(temp,temp+'-');
        }
        document.body.querySelector('input#LicensePlate').value=mat.trim();
        document.body.querySelector('input#LicensePlate').addEventListener("click", copy_mat('ITV '+mat.trim()+' ( APPlus '+document.querySelector('a.descargarpdf').href.replace('https://apps.applusiteuve.com/CVE/DownloadPDF?cve=','')+' )'));
    }
 
    function copy_mat(mat) {
        navigator.clipboard.writeText(mat);
    }
 
})();