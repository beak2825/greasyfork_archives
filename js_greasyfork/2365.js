// ==UserScript==
// @name        Tieba - Chemical Equation
// @namespace   http://userscripts.org/users/v910JQK
// @description 在百度貼吧寫出格式較工整的化學方程式
// @include     http://tieba.baidu.com/p*
// @include     http://tieba.baidu.com/f*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/2365/Tieba%20-%20Chemical%20Equation.user.js
// @updateURL https://update.greasyfork.org/scripts/2365/Tieba%20-%20Chemical%20Equation.meta.js
// ==/UserScript==
var str
		
		
function e_replace(str){

}
function GM_wait()
{
    if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); }
    else { $ = unsafeWindow.jQuery; eq_init(); }
}
GM_wait();

function eq_init()
{
	
e_submit=function(){
//bck=$(".tb-editor-editarea").html();
bck=$("#ueditor_replace").html();
$("#ueditor_replace").html(bck+"<p>"+$('#e_result').text()+"</p>");
}
	
	etext="<div id='equation_container' style='margin-top:10px;' ><input form='' style='width:200px;height:25px;float:left;margin-right:10px;' class='ui_textfield' placeholder='请在这里输入方程式' id='equation' type='text' title='delta/dta:Δ,\\數字:下標,\\:↓,/:↑,=>:→,<=:←,<==>:⇌' /></textaera><a id='ebutton' class='subbtn_bg ui_btn ui_btn_m' href='#' onclick='return false;' ><span><em>Add</em></span></a><div id='e_result' style='padding-left:8px;'></div></div>"
//$(".pt_submit").prepend(etext);
$(".old_style_wrapper").append(etext);

$("#equation").keyup(function(e){
str=$('#equation').attr('value')
str=str.replace(/\\0/g,'₀')
str=str.replace(/\\1/g,'₁')
str=str.replace(/\\2/g,'₂')
str=str.replace(/\\3/g,'₃')
str=str.replace(/\\4/g,'₄')
str=str.replace(/\\5/g,'₅')
str=str.replace(/\\6/g,'₆')
str=str.replace(/\\7/g,'₇')
str=str.replace(/\\8/g,'₈')
str=str.replace(/\\9/g,'₉')
str=str.replace(/delta/g,'Δ')
str=str.replace(/dta/g,'Δ')
str=str.replace(/<\\>/g,'↮')
str=str.replace(/\\>/g,'↛')
str=str.replace(/<\\/g,'↚')
str=str.replace(/\\>/g,'')
str=str.replace(/<==>/g,'⇌')
str=str.replace(/=>/g,'→')
str=str.replace(/<=/g,'←')
str=str.replace(/\//g,'↑')
str=str.replace(/\\/g,'↓')
$('#e_result').html(str)
if(e.keyCode == 13) e_submit();
})

$("#ebutton").click(e_submit);


}