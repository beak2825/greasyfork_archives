// ==UserScript==

// @name         Deplacer Actu de la Sidebar 
// @namespace    http://crystalmodding.net/
// @version      1.3
// @description  ------------------
// @author       Marentdu93 & Wells 
// @match       http://crystalmodding.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20364/Deplacer%20Actu%20de%20la%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/20364/Deplacer%20Actu%20de%20la%20Sidebar.meta.js
// ==/UserScript==
$(document).ready(function(){

    var css = "h3.actuh3{ font-size: 13pt;    font-family: 'Open sans condensed','Arial',sans-serif;    color: rgb(252,252,255);    background: rgba(47,120,160,1) url('styles/realitygaming/images/main/pattern3-ts.png') repeat-x bottom;    padding: 4px 7px;    margin: -10px -10px 5px;    border-bottom: 1px solid #d7edfc;    text-shadow: 1px 1px rgba(0,0,0,0.4);}";

    $('head').append('<style>' + css + '</style>');

    var coucou ='a.wellsastu{color:green;}';
     $('head').append('<style>' + coucou + '</style>');
    
});
function deplacer(){
    var actu1 = $('div.section').count;
   if (actu1 > 7){
       var actu = $('div.section')[4].innerHTML;
    $('div.section')[4].remove();
    var test = actu.replace('Tooltip','Wellsactu');
    var test2 = test.replace('secondaryContent','secondaryContent Marentking');
    $('div.titleBar').after(test2);
    var testttt = "if(this.value == 0){$('div.secondaryContent.Marentking').css('display','none');document.getElementById('ActuaOK').value = 1;}else {$('div.secondaryContent.Marentking').css('display','block');document.getElementById('ActuaOK').value = 0;	}";
    $('div.titleBar').after('<input type="checkbox" id="ActuaOK" onclick="'+testttt+'" value="0"  checked="checked"class="checkbox">');
   }
    else {
    var actu4 = $('div.section')[5].innerHTML;
    $('div.section')[5].remove();
    var test4 = actu4.replace('Tooltip','ellsastu');
    var test24 = test4.replace('secondaryContent','secondaryContent Marentking');
    $('div.titleBar').after(test24);
    var testttt4 = "if(this.value == 0){$('div.secondaryContent.Marentking').css('display','none');document.getElementById('ActuaOK').value = 1;}else {$('div.secondaryContent.Marentking').css('display','block');document.getElementById('ActuaOK').value = 0;	}";
    $('div.titleBar').after('<input type="checkbox" id="ActuaOK" onclick="'+testttt4+'" value="0"  checked="checked"class="checkbox">');
    }

  
}
deplacer();

