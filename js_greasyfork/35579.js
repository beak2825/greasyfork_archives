// ==UserScript==
// @name         Star Federation
// @description:en Star Federation game
// @namespace starfederationuimod
// @include      https://www.star-kings.ru/*
// @include      https://star-kings.ru/*
// @include      https://starfederation.ru/*
// @include      https://www.starfederation.ru/*
// @version      2
// @grant        none
// @description Star Federation game
// @downloadURL https://update.greasyfork.org/scripts/35579/Star%20Federation.user.js
// @updateURL https://update.greasyfork.org/scripts/35579/Star%20Federation.meta.js
// ==/UserScript==
var run = function() {

$("body").append ( '\
<table id="gmRightSideBar" style="position:fixed; top:80; right: 0;z-index:99999900; "> \
<tr> \
<td> <table>\
<tr><td><button type="button" \
         onclick="document.getElementById(`gmRightSideBar`).style.right=`0px`" \
         class="text_btn_bg" style="font-size:11px;height:24px;width:100%;background-position:left 0px top 0px,right 0px top 0px, left 2px top;background-size:2px 24px, 3px 24px, 30px 24px;">Вкл.</button></td></tr> \
<tr><td><button type="button" class="text_btn_bg" \
         onclick="document.getElementById(`gmRightSideBar`).style.right=`-190px`" \
         style="font-size:11px;height:24px;width:100%;background-position:left 0px top 0px,right 0px top 0px, left 2px top;background-size:2px 24px, 3px 24px, 30px 24px;">Выкл.</button></td></tr> \
</table></td> \
<td> <table>\
<tr><td style="font-size:13px;height:24px;width:100%;" background="/images/ui/buttons/text_btn_bg_center_h.png">Панель расширенных команд:</td></tr> \
<tr><td><button type="button" class="text_btn_bg" style="font-size:11px;height:24px;width:100%;background-position:left 0px top 0px,right 0px top 0px, left 2px top;background-size:2px 24px, 3px 24px, 173px 24px;" onclick="$(`#gmRightSideBar`).trigger(`grabFlightPlan`);">Сохранить полетник</button></td></tr> \
<tr><td><button type="button" class="text_btn_bg" style="font-size:11px;height:24px;width:100%;background-position:left 0px top 0px,right 0px top 0px, left 2px top;background-size:2px 24px, 3px 24px, 173px 24px;" onclick="$(`#gmRightSideBar`).trigger(`loadFlightPlan`);">Добавить команды к полетнику</button></td></tr> \
</td> </table>\
</tr> \
</table> \
' );


function addnextcmd(forms_html,id){
if (id == forms_html.length)
return;

var new_form = $("#WndFleet_comand_form_new");
new_form[0].outerHTML = forms_html[id];
var forms = $("form[id^='WndFleet_comand_form_']:last");
forms.attr('id','WndFleet_comand_form_new');
$("> input[name='icmd']",forms).attr('value','new');
getWindow('WndFleet').add_comand('new');
setTimeout(function(){addnextcmd(forms_html,id+1)}, 5000);
}

$("#gmRightSideBar").bind('loadFlightPlan',function() {
var text = window.prompt("Вставьте сохраненные команды: Ctrl+V, Enter", '');
var forms_html = text.split("<;>");
addnextcmd(forms_html,0);
});

$("#gmRightSideBar").bind('grabFlightPlan',function() {
var forms = $("form[id^='WndFleet_comand_form_']");
var text = "";
forms.each(function(index){
if (index < forms.length-1){
if (index > 0)
         text = text + "<;>";
var tmp = forms[index].outerHTML;       
text = text + tmp.replace(/<[^\/if][^>]*>/g,"").replace(/<\/[^f][^>]*>/g,"").replace(/title="[^"]*"/g,"").replace(/style="[^"]*"/g,"").replace(/onclick="[^"]*"/g,"").replace(/src="[^"]*"/g,"").replace(/class="[^"]*"/g,"").replace(/>[^<]*</g,"><").replace(/<img[^>]*>/g,"");
}
});
window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
});

}
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);