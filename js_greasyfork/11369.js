// ==UserScript==
// @name NNM-plugin v2.0
// @name:ru Кнопки для сайта nnm.me
// @namespace https://openuserjs.org/users/sigala
// @description Adds some features to the interface of nnm.me
// @description:ru Добавляет кнопки в окно написания комментария
// @author Sigala
// @include http://*.nnm.me/*
// @include http://nnm.me/*
// @grant       none
// @version 1.6.1
// @downloadURL https://update.greasyfork.org/scripts/11369/NNM-plugin%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/11369/NNM-plugin%20v20.meta.js
// ==/UserScript==

var extension = function() {

    //Добавляет стили
if (typeof GM_addStyle == 'undefined') {
    function GM_addStyle(css) {
      if (window.document.head) {
        var style = window.document.createElement("style");
        style.type = "text/css";
        style.appendChild(window.document.createTextNode(css));
        window.document.head.appendChild(style);
      }
    }
  }
    
 //Плагин для Cookie
jQuery.cookie = function(name, value, options) { 
    if (typeof value != "undefined") { 
        options = options || {}; 
        if (value === null) {
            value = ""; 
            options = $.extend({}, options); 
            options.expires = -1; 
        } 
        var expires = ""; 
        if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) { 
            var date; 
            if (typeof options.expires == "number") { 
                date = new Date(); 
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)); 
            } else { 
                date = options.expires; 
            } 
            expires = "; expires=" + date.toUTCString(); 
        } 
        var path = options.path ? "; path=" + (options.path) : ""; 
        var domain = options.domain ? "; domain=" + (options.domain) : ""; 
        var secure = options.secure ? "; secure" : ""; 
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join(""); 
    } else { 
        var cookieValue = null;
        if (document.cookie && document.cookie != "") { 
            var cookies = document.cookie.split(";"); 
            for (var i = 0; i < cookies.length; i++) { 
                var cookie = jQuery.trim(cookies[i]); 
                if (cookie.substring(0, name.length + 1) == (name + "=")) { 
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); 
                    break; 
                } 
            } 
        } 
        return cookieValue; 
    } 
}; 

var a_clear_adds=  $.cookie("a_clear_adds"); 
var a_left_panel=  $.cookie("a_left_panel"); 
var a_fast_preview=$.cookie("a_fast_preview"); 
var a_view_user=   $.cookie("a_view_user"); 
var a_full_screen= $.cookie("a_full_screen"); 
var a_count_chars= $.cookie("a_count_chars"); 
var a_min_pic=     $.cookie("a_min_pic");
var a_clear_tiser= $.cookie("a_clear_tiser");
var a_oval_avatar= $.cookie("a_oval_avatar");

//Удаление рекламы и всякой хрени  
 if (a_clear_adds) { 
function my_remove_ads(){ 
$("#links").remove(); 
$("#banner_left_2").remove(); 
$("#footer").remove(); 
$("#top-banner").remove(); 
$("#top100Counter").remove(); 
$("#branding_link").remove(); 
$("#banner_left_3").remove(); 
$("#rdminfrm_31257").remove();
$("div.mgbox").remove();
$("div.bnr").remove();
//$("#Kavanga.AdEngine").remove();
$("div.banner").remove(); 
//$("div.pb0:nth-child").remove();
$("td.f-content div:last-child").remove(); 
$("div.social").remove(); 
//$("#sidebar > div:gt(3)").remove(); 
$("a[href*=\'obs.nnm2.ru\']").remove(); 
$("#links > div").remove();
$("div.video-b").remove();
} 
my_remove_ads(); 
} 

//Удаление тизеров  
 if (a_clear_tiser) { 
function my_remove_ads(){ 
$("div.pb0:nth-child").remove();

} 
my_remove_ads(); 
} 
    
//Уменьшение всех картинок до 200 пикселей по высоте
 if (a_min_pic) { 
 $("img").each( function() { if (this.height>200) { 
  var z=this.width/this.height; this.className ="inpic"; 
 this.height=200; this.width=200*z;}; } );    
 $("object").each( function() {    
this.height=210; this.width=255; }  );    
} 

//Широкий экран
if (a_full_screen) {
    
GM_addStyle('body {padding: 0 !important;} #page {width: 100% !important; left:0px !important; top:0px !important; margin-left:0px !important; margin-top:0px !important; padding: 0 0px !important; } #wrap {width: 100% !important; padding: 0 0px;} #content {width: auto !important;} #scrollPanel {width: auto !important;} #htmlarea {width: 100% !important;} text {width: 100% !important;} textarea {width: 98% !important;}  ');    
}

// Овальные аваторки
if (a_oval_avatar) {

GM_addStyle('.avatar {cursor: pointer; border-radius:8px;}');    
} 

var options="<div id=\'optionspanel\'><br><input type=\'checkbox\' id=\'check1\' name=\'a_clear_adds\' />Чистка мусора    <br><input type=\'checkbox\' id=\'check2\' name=\'a_left_panel\' />Павающая панель лички<br><input type=\'checkbox\' id=\'check3\' name=\'a_fast_preview\' />Быстрый предпросмотр<br><input type=\'checkbox\' id=\'check4\' name=\'a_view_user\' />Просмотр кармы юзера<br><input type=\'checkbox\' id=\'check5\' name=\'a_full_screen\' />Полный экран<br><input type=\'checkbox\' id=\'check6\' name=\'a_count_chars\' />Счетчик символов<br><input type=\'checkbox\' id=\'check7\' name=\'a_min_pic\' />Картинки по 200 px<br><input type=\'checkbox\' id=\'check8\' name=\'a_clear_tiser\' />Убрать тизеры........    <br><input type=\'checkbox\' id=\'check9\' name=\'a_oval_avatar\' />Овальные аватарки<br><input type=\'button\' id=\'check\' value=\'Сохранить\'/><input type=\'button\' id=\'setscript\' value=\'Настройки\'/></div>"; 

// Функция открытия панели настроек
function ОptionsShow() 
{
GM_addStyle('.optionpanel {align: left;}');
$("#page").prepend(options);  
var hbtn=$("#check").height() - $("#optionspanel").height(); 
var h="margin-top:"+hbtn+"px; "; 
var wbtn=$("div.categories").offset().left-150; 
var w="margin-left:"+wbtn+"px; "; 
$("#optionspanel").attr("style","background-color: #fff; border: 1px solid #aaa; position:absolute; top: 100px; right: 20px; z-index: 200; display: block; "+w+h+" padding: 5px; overflow : auto; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius:10px; opacity: 0.2; text-align: left;  "); 
$("#check").hide(); 
$("#setscript").click(function() {$("#check").show(); $("#setscript").hide(); 

if (a_clear_adds)   {$("#check1").attr("checked", "checked"); } else {$("#check1").attr("checked", ""); }; 
if (a_left_panel)   {$("#check2").attr("checked", "checked"); } else {$("#check2").attr("checked", ""); }; 
if (a_fast_preview) {$("#check3").attr("checked", "checked"); } else {$("#check3").attr("checked", ""); };  
if (a_view_user)    {$("#check4").attr("checked", "checked"); } else {$("#check4").attr("checked", ""); }; 
if (a_full_screen)  {$("#check5").attr("checked", "checked"); } else {$("#check5").attr("checked", ""); }; 
if (a_count_chars)  {$("#check6").attr("checked", "checked"); } else {$("#check6").attr("checked", ""); }; 
if (a_min_pic)      {$("#check7").attr("checked", "checked"); } else {$("#check7").attr("checked", ""); };
if (a_clear_tiser)   {$("#check8").attr("checked", "checked"); } else {$("#check8").attr("checked", ""); }; 
if (a_oval_avatar)   {$("#check9").attr("checked", "checked"); } else {$("#check9").attr("checked", ""); }; 


$("#optionspanel").animate({"marginTop":"-10px", "opacity": "1" }, "normal"); 
 } ); 
 $("#check").click(function() { 
  var count = 9; var i = 0; 
	        while(++i <= count) { 
			var el=document.getElementById("check" + i); 
	            if(el.checked) { $.cookie(el.name, "true", { expires: 180, path: "/", domain: ".nnm.me" });} 
                else { $.cookie(el.name, "", { expires: -1, path: "/", domain: ".nnm.me" }); } 
                } 
                $("#optionspanel").animate({marginTop: "-180px"}, "fast"); 
                location.reload(); 
       } ); }  ; ОptionsShow(); 

    var styleform="background-color: #ffc; border: 1px solid #aaa; position: absolute; z-index: 200; display: block; padding: 10px; margin-top: 0px;  -moz-border-radius: 10px;  -webkit-border-radius: 10px; border-radius:10px;"; 

var iframestyle="background-color: #fff; border: 1px #333 solid; position: absolute; left: 60px; width:220px; height:90px; z-index: 100; display: block;  padding: 5px;  -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius:10px;"; 

//Позиция курсора 
function doGetCaretPosition (ctrl) { 
 var CaretPos = 0;  
	if (document.selection) {  
		ctrl.focus ();  
		var Sel = document.selection.createRange (); 
		Sel.moveStart ("character", -ctrl.value.length); 
		CaretPos = Sel.text.length; }  
 	else if (ctrl.selectionStart || ctrl.selectionStart == "0") 
	CaretPos = ctrl.selectionStart;  
	return (CaretPos); } 
  
//Вставка тегов
 function ModifySelection (start,end) {  
 var textarea= document.getElementsByName("text").item(0); 
 if ("selectionStart" in textarea) {  
 if (textarea.selectionStart != textarea.selectionEnd) { 
 var newText = textarea.value.substring (0, textarea.selectionStart) +  
  start + textarea.value.substring  (textarea.selectionStart, textarea.selectionEnd) + end + 
  textarea.value.substring (textarea.selectionEnd);  
  textarea.value = newText;  } 
  else {  var CaretPos=doGetCaretPosition (textarea);  
  var newText = textarea.value.substring (0, CaretPos) + 
   start + end + textarea.value.substring (CaretPos,textarea.value.length); 
   textarea.value = newText; }  } else  {  
   var textRange = document.selection.createRange ();  
   var rangeParent = textRange.parentElement ();  
   if (rangeParent === textarea)  textRange.text = start + textRange.text + end; } } 
   
//Форма загрузки картинки
var formloadimg="<form method=\'post\' enctype=\'multipart/form-data\' id=\'form_write1\' >Закрузить картинку с диска:&nbsp;&nbsp;&nbsp;<input class=\'btn\' name=\'img_file\' id=\'js_img_file\' type=\'file\'  size=\'40%\'><br><br> или вставить адрес картинки:<input type=\'text\' autocomplete=\'of\' value=\'http://\' id=\'js_img_url\' name=\'img_url\' class=\'i-text\'  size=\'50%\'><br><br><center><input class=\'btn\' id=\'iset\' name=\'upload_img\' value=\'Загрузить\' type=\'submit\'>&nbsp;&nbsp;&nbsp;<input class=\'btn\' id=\'exit_btn\' type=\'button\' value=\'Отменить\' /><div class=\'loading\' id=\'js_img_spinner\' style=\'display: none;\'><img src=\'/i/spinner.gif\' title=\'Загрузка\'>Загрузка</div></center></form>"; 

//Форма загрузки ссылки
var put_link=" <div id=\'putlink\'>Адрес ссылки: <input type=\'text\' autocomplete=\'of\' value=\'http://\' id=\'link_url\' name=\'namelink_url\' class=\'i-text\'  size=\'50%\'><br><br>Текст ссылки:&nbsp; <input type=\'text\' autocomplete=\'of\' value=\'\' id=\'link_text\' name=\'name_url\' class=\'i-text\' size=\'50%\'><br><br><center><input class=\'btn\' id=\'putlink_set\' name=\'add_link_text\' value=\'Вставить\' type=\'button\'  onClick=\'add_Linktext();\'>&nbsp;&nbsp;&nbsp;<input class=\'btn\' id=\'exit_putlink\' type=\'button\' value=\'Отменить\' onClick=\'add_Link();\'></center></div>"; 

//Функция добавления/удаления формы ссылки 
 function add_Link() {  
  if($("#putlink")[0])  {$("#putlink").remove();} else {  
  $("#knopki").append(put_link); 
  $("#putlink").attr("style",styleform);  
   };}  

//Функция вставки тегов ссылки
 function add_Linktext() { 
 var Lt=$("#link_url").attr("value");  
 if ($("#link_text").attr("value")=="") {ModifySelection ("[url]"+Lt,"[/url]"); }  
 else  { ModifySelection ("[url="+Lt+"]",$("#link_text").attr("value")+"[/url]"); }; 
 $("#putlink").remove();  
 }  

//Функции добавления/удаления формы загрузки картинки
 function addForm() { 
 $("#knopki").append(formloadimg);  
 $("#form_write1").attr("style",styleform); 

 $("#exit_btn").click(function () { ImageShow(); }); 
}   

// Функция открытия диалога вставки картинки
function ImageShow() { 
if($("#form_write1")[0])  {$("#form_write1").remove();} else   
{if ($("#knopki")[0]) 
{ addForm(); $("#iset").click(function (e) { return set_itext(e); })}; }  }; 



// Собственно Кнопки                  
var Sb=["[b]", "[i]", "[u]", "[s]", "[blockquote]", "[code]", "[doc]", "[img]", "[video]","™","©","°",""];  
var Se=["[/b]","[/i]","[/u]","[/s]","[/blockquote]","[/code]","[/doc]","[/img]","[/video]"]; 
var Space=""; 

var panelknopki="<div id=\'knopki\'><img src=\'http://nnm.me/i/editor/bold.gif\'  class=\'sysb\' title=\'Выделить текст жирным\' onClick=\'ModifySelection (Sb[0],Se[0]);\'><img src=\'http://nnm.me/i/editor/italic.gif\' class=\'sysb\' title=\'Выделить текст курсивом\' onClick=\'ModifySelection (Sb[1],Se[1]);\'><img src=\'http://nnm.me/i/editor/underline.gif\' class=\'sysb\' title=\'Подчеркнуть текст\' onClick=\'ModifySelection (Sb[2],Se[2]);\'><img src=\'http://nnm.me/i/editor/strike.gif\' class=\'sysb\' title=\'Зачеркнуть текст\' onClick=\'ModifySelection (Sb[3],Se[3]);\'><img src=\'http://nnm.me/i/editor/indent.gif\' class=\'sysb\' title=\'Цитата\' onClick=\'ModifySelection (Sb[4],Se[4]);\'><img src=\'http://nnm.me/i/editor/code.gif\' class=\'sysb\' title=\'Код\' onClick=\'ModifySelection (Sb[5],Se[5]);\'><img src=\'http://nnm.me/i/editor/link.gif\' class=\'sysb\' title=\'Вставить ссылку\' onClick=\'add_Link();\'><img src=\'http://nnm.me/i/editor/image.gif\' class=\'sysb\' title=\'Вставить изображение\' onClick=\'ImageShow();\' ><img src=\'http://nnm.me/i/editor/video.gif\' class=\'sysb\' title=\'Вставить видео\' onClick=\'ModifySelection (Sb[8],Se[8]);\'><img height=\'22\' src=\'http://img15.nnm.me/b/b/1/0/d/969ce7a8c5975f01ee49cb4d3c4.gif\' class=\'sysb\' title=\'Показать набор смайлов\' onClick=\'SmileyShow();\'><img src=\'http://img12.nnm.me/2/0/8/a/a/145561b083c38e985173c2b9c7f.gif\' class=\'sysb\' title=\'™\' onClick=\'ModifySelection (Space,Sb[9]);\'><img src=\'http://img15.nnm.me/8/7/c/5/e/fab583f3ac892bb6a20d8dc9858.gif\' class=\'sysb\' title=\'©\' onClick=\'ModifySelection (Space,Sb[10]);\'><img src=\'http://img15.nnm.me/4/c/b/a/1/eba4de8a34aaa97ca93a50f874e.gif\' class=\'sysb\' title=\'°\' onClick=\'ModifySelection (Space,Sb[11]);\'></div>"; 

 
 

$("form.comment_answer_textarea").prepend(panelknopki); 
var im=$("img.sysb"); 
im.css({"background-image":"url(\'http://img11.nnm.me/2/6/1/3/a/35b331dd1e029dfd9780b85f1dd.gif\')"} ); 
im.css({"cursor":"pointer"} ); 
im.mouseover(function () {    $(this).css("background-image", 
"url(\'http://img12.nnm.me/b/7/4/4/d/3f558d880437dea23af19d39577.gif\')");  }); 
im.mouseout(function () {    $(this).css("background-image", 
"url(\'http://img11.nnm.me/2/6/1/3/a/35b331dd1e029dfd9780b85f1dd.gif\')");  }); 

//Функция загрузки картинки на сервер
function set_itext(e) { 
	e.preventDefault(); 
	$("#form_write1").ajaxSubmit({ 
      target: "form.comment_answer_textarea", 
		url: "http://nnm.me/ajax/image_upload/"+user_digest+"/", 
		dataType: "json", 
		type: "POST", 
		beforeSubmit: function () { 
			$("#js_img_spinner").show(); 
		}, 
		success: function(data) { 
if (data && data.complete) { 
var firsttag="[img]"+data.url; var lasttag="[/img]";   
	ModifySelection (firsttag,lasttag); 
			} else { 
				alert("Не удалось загрузить изображение"); 
			} 
 $("#form_write1").remove();            
			$("#js_img_spinner").hide(); 
		} 
	}); 
	return false; 
} 



//Счетчик символов
function simvolcount (t) 
{ 
 var countchar="<div id=\'countchar\' style=\'color: #999;\'>0</div>"; 

if(!$("#countchar")[0]) {$("fieldset").append(countchar); }; 
$("#countchar").html("Кол-во символов: "+t.val().length+" Осталось: "+(5000-t.val().length)); 
} 

//Счетчик символов    
if (a_count_chars && document.getElementsByName("text").item(0)!=null) { 
var camenttext= $("textarea.i-textarea"); 
 camenttext.keyup(function(){simvolcount (camenttext)}); 
camenttext.change(function(){simvolcount (camenttext)}); 
} 

//Ответ на камент
 $("a.comment_reply").click(function() {$("#knopki").remove(); 
  $("form.comment_answer_textarea").prepend(panelknopki);  
$("img.sysb").css({"background-image":"url(\'http://nnm.me/i/editor/btn-bg.gif\')"} ); 
$("img.sysb").mouseover(function () {    $(this).css("background-image","");  }); 
$("img.sysb").mouseout(function ()  
{ $(this).css("background-image","url(\'http://nnm.me/i/editor/btn-bg.gif\')"); 
 }); 
if (a_count_chars && document.getElementsByName("text").item(0)!=null) { 
var camenttext= $("textarea.i-textarea"); 
camenttext.keyup(function(){simvolcount (camenttext)}); 
camenttext.change(function(){simvolcount (camenttext)}); 
 } 
fastprev (); 
}); 


// str_replace("что заменяем", "чем заменяем", "исходная строка");
function str_replace(search, replace, subject) {  
    return subject.split(search).join(replace);  
} 

function thisID () {          
var id_this = $("textarea.i-textarea").attr("id"); 
if (id_this!=null) 
  return "#"+str_replace("comment_answer_ta_", "comment_answer_sm_", id_this);  
}  

var YoutubeBegin="<object width=\'425px\' height=\'350px\' type=\'application/x-shockwave-flash\' data=\'";  
var YoutubeEnd="></object>";  

var RutubeBegin="<object height=\'373\' width=\'425\'><embed src=\'"; 
var RutubeEnd="\' type=\'application/x-shockwave-flash\' wmode=\'window\' allowfullscreen=\'true\' height=\'373\' width=\'425\'></object>";  

var VimeoBegin="<object width=\'425\' height=\'238\'><embed src=\'"; 
var Vimeo="moogaloop.swf?clip_id=";   
var VimeoEnd="&amp;server=www.vimeo.com&amp;show_title=1&amp;show_byline=1&amp; show_portrait=0&amp;color=&amp;fullscreen=1\' type=\'application/x-shockwave-flash\' allowfullscreen=\'true\' allowscriptaccess=\'always\' width=\'425\' height=\'238\'></object>";  

//Быстрый предпросмотр
if (a_fast_preview && document.getElementsByName("text").item(0)!=null) { 

function fastprev () {  
var ipreview="<div id=\'preview\' style=\'background-color: #ffc; border: 1px solid #aaa; position: absolute; z-index: 200; display: block; padding: 5px; margin-top: 0px; overflow : auto; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius:10px;\'></div>";  
$(thisID ()).mouseover(function () { if(!$("#preview")[0]) {  

var itextarea= document.getElementsByName("text").item(0).value;  

$("form.comment_answer_textarea").append(ipreview);                       

while (itextarea.indexOf("[img]") >= 0) { itextarea = itextarea.replace("[img]","<img src="); };   
while (itextarea.indexOf("[/img]") >= 0) { itextarea = itextarea.replace("[/img]",">"); };   

while (itextarea.indexOf("[video]http://www.youtube.com") >= 0)   
{ itextarea = itextarea.replace("[video]http://www.youtube.com",YoutubeBegin+"http://www.youtube.com"); };   

while (itextarea.indexOf("[/video]") >= 0) { itextarea = itextarea.replace("[/video]",YoutubeEnd); };   
while (itextarea.indexOf("http://www.youtube.com/watch?v=") >= 0)   
{ itextarea = itextarea.replace("http://www.youtube.com/watch?v=","http://www.youtube.com/v/"); };   

while (itextarea.indexOf("[") >= 0) { itextarea = itextarea.replace("[","<"); };   
while ( itextarea.indexOf("]") >= 0) {itextarea = itextarea.replace("]",">"); };  

$("#preview").html(itextarea);     }  }  );    
$(thisID ()).mouseout(function () { if($("#preview")[0])  { $("#preview").remove(); }  });    }   
fastprev ();  
} 

var SmilAr=[ 
//Картинки вставляются сюда:
"http://img12.nnm.me/b/4/3/f/a/6d6ab0257a517f0f78fde546cc9.gif", 
"http://img15.nnm.me/5/8/3/2/e/71b29a655f63bc1e930557583c5.gif", 
"http://img12.nnm.me/1/a/c/8/c/97e54b743e9a37d9e41f1429ed1.gif", 
"http://img15.nnm.me/8/d/f/b/f/d85c799eaee6d3558f6732f5ee5.gif", 
"http://img12.nnm.me/e/b/a/8/4/c190735c7db4f20f3bf5e1c42d8.gif", 
"http://img11.nnm.me/8/0/8/1/a/17a2ed5593fff78ecfc5f4bfbc5.gif", 
"http://img15.nnm.me/b/b/1/0/d/969ce7a8c5975f01ee49cb4d3c4.gif", 
"http://img15.nnm.me/3/b/7/4/e/ec15fbaaba40331c5e4b24e4fb3.gif", 
"http://img12.nnm.me/b/0/3/a/8/65c35176333ef4beeffef76b389.gif", 
"http://img11.nnm.me/6/3/6/9/9/7164f245419f1d672b1a14ac431.gif", 
"http://img12.nnm.me/d/5/3/4/b/a1488659df2517461174cfced2f.gif", 

"http://img11.nnm.me/6/4/c/1/0/c2aeafa9db25fcfdee4283bdc35.gif", 
"http://img12.nnm.me/3/9/e/d/c/e84cafd4c5014597b5588f1265d.gif", 
"http://img12.nnm.me/1/5/7/b/5/13310166eb3541b463fdc5a2719.gif", 
"http://img11.nnm.me/3/f/c/1/3/f1a76abe811a42713fb438f2195.gif", 
"http://img12.nnm.me/3/e/5/4/f/55b1b2f74957761b6fe2a74ebcc.gif", 
"http://img12.nnm.me/c/9/5/c/f/621e5ffc128c4be32cd1a806730.gif", 
"http://img12.nnm.me/0/8/e/2/8/63063ccb5f89844a5fef7f7fd2c.gif", 
"http://img12.nnm.me/b/7/0/1/2/9a3bff99dd58e3e86d07f9fb984.gif", 
"http://img12.nnm.me/e/a/d/2/9/9fcde549b52014b72ca74098b0d.gif", 

"http://img11.nnm.me/f/b/4/c/f/6a9cca5bef4000c95aa5db6bed9.gif", 
"http://img11.nnm.me/1/0/d/3/4/99a861c602eba53667a331376a9.gif", 
"http://img11.nnm.me/c/c/7/2/d/ef4d1956753584b9b471e28b673.gif", 
"http://img12.nnm.me/1/4/d/e/c/86d980fbe3c69c55009be566ad9.gif", 
"http://img12.nnm.me/b/5/4/6/d/e1ac8044f388688f3f65ea0c67a.gif", 
"http://img12.nnm.me/1/4/a/8/e/5a1508c10309c4639ae2ef2a609.gif", 
"http://img11.nnm.me/4/d/c/5/6/683c50927dfe1c9d6c60f6372a3.gif", 
"http://img11.nnm.me/8/d/8/c/0/1a46b8d3b47ff79451598ab51a8.gif", 
"http://img11.nnm.me/b/2/e/f/b/da7f8bc635722867c42c762de08.gif", 
"http://img11.nnm.me/1/5/f/b/1/326c5fc84d04fb48b307c3238a3.gif", 

"http://img15.nnm.me/9/4/a/2/4/43a27934bbd57d29b93b18fd580.gif", 
"http://img15.nnm.me/4/0/8/e/e/1377b5509649e9f605573720295.gif", 
"http://img15.nnm.me/7/9/2/f/4/fd480a65141000fdd8637c31a4e.gif", 
"http://img11.nnm.me/8/1/f/0/f/506655f2dba90154fbf1a4303b5.gif", 
"http://img11.nnm.me/c/e/0/c/a/fc5c5611c2da102379c66604171.gif", 
"http://img15.nnm.me/1/b/3/5/0/7fdfe61c0917b03a0b8d6f38b42.gif", 
"http://img15.nnm.me/9/9/2/8/6/a445a42422e951aaa12e60d1560.gif", 

"http://img15.nnm.me/6/f/6/4/8/9f2f961dbf20cb79604f1bcc2f8.gif", 
"http://img15.nnm.me/9/a/b/0/b/27ce25402b31f063f6638963a00.gif", 
"http://img12.nnm.me/5/e/3/c/8/0f7d0ee77214a842098364c6a41.gif", 
"http://img15.nnm.me/1/e/a/8/c/2da5e58326413867b5fdfd0ed2e.gif", 
"http://img12.nnm.me/e/3/b/7/1/6be20ccd307b8ba22ee0f221685.gif", 
"http://img11.nnm.me/2/c/5/4/6/fafdaf55f70aaf8db50b878c486.gif", 
"http://img12.nnm.me/4/a/e/3/2/88180921eddb6eebd6cb4e23f39.gif", 
"http://img11.nnm.me/5/6/9/a/b/c953b85a20f831c20d273639fbe.gif", 

"http://img12.nnm.me/2/4/c/9/b/2a84946d14662a4271272ec38b9.gif", 
"http://img12.nnm.me/1/8/2/e/a/f6d0afbdd2a7f1bde3fe2687506.gif", 
"http://img12.nnm.me/4/1/1/6/9/da43a27fb68cdb38ab741795842.gif", 
"http://img12.nnm.me/f/b/8/5/3/2e61237ab6605ac6a30ed764388.gif", 
"http://img11.nnm.me/4/2/4/b/e/04df3d7730065601df7249451c1.gif", 

"http://img12.nnm.me/0/e/f/d/e/f2153c1c1a3ffdff50be24595ff.gif", 
"http://img15.nnm.me/3/c/1/c/0/c2dbcac0710a2bcceed81c15b36.gif", 
"http://img11.nnm.me/6/0/3/3/1/4dbd89ee3d490c0dfe4786111f0.gif", 
"http://img15.nnm.me/7/b/c/d/a/1ef7039d8aebaddcef17e4971b2.gif", 
"http://img15.nnm.me/2/5/b/0/2/03c369a9a703a6f6b6f27f8d51f.gif", 
"http://img11.nnm.me/a/1/5/d/5/c13d04fd7b2cb39952f5cad43c4.gif", 
"http://img15.nnm.me/5/0/1/8/9/e48eedfa9fb6780afb90d8ff72c.gif", 

"http://img11.nnm.me/f/d/9/4/4/578cb4d52a905d6016cffd04932.gif", 
"http://img11.nnm.me/3/f/6/3/4/13df4d83dced7f48ba3d93a68b2.gif", 
"http://img15.nnm.me/b/e/1/f/0/a54ba736fd48748e719bd68274b.gif", 
"http://img12.nnm.me/7/1/b/e/6/e7dd15ef6f38d6de004aa5b6399.gif", 
"http://img12.nnm.me/4/9/6/1/f/2325d3facf22e95b4ef6bb04995.gif", 
"http://img11.nnm.me/e/2/a/a/e/032f3022bd640f19a877575fef6.gif", 
"http://img12.nnm.me/c/b/b/6/a/a7137276f52b437d3e254712e56.gif", 
"http://img15.nnm.me/b/5/2/a/4/e7363e0e9a503acbea70cc1821e.gif", 

"http://img15.nnm.me/0/a/4/9/3/856e0d8352c3f6f0642a7e438fd.gif", 
"http://img12.nnm.me/0/a/7/8/2/d50bff8ba9884453ade05ccd517.gif", 
"http://img11.nnm.me/a/d/6/b/c/4e9966949cb56b79381008097f1.gif", 
"http://img11.nnm.me/4/a/c/3/7/8e963128a5815ee5a18384bbfcf.gif", 
"http://img12.nnm.me/0/a/9/e/5/c592fbb19736ac2394548dcd909.gif", 
"http://img11.nnm.me/4/d/f/b/c/17c91e89a36340341913973f10a.gif", 

"http://img11.nnm.me/9/1/2/2/c/d429a4f6e693d0a69c96cc57b10.gif", 
"http://img11.nnm.me/d/e/4/0/6/e341f34dd0244c2bcbd43164a5c.gif", 
"http://img15.nnm.me/6/2/f/c/b/24f49baf65fe40511a7592daf10.gif", 
"http://img11.nnm.me/7/9/e/4/f/7fc9efaa3600d38e0e066c87772.gif", 
"http://img12.nnm.me/0/f/3/3/8/174bdc7707a708236a37336b554.gif", 
"http://img12.nnm.me/3/5/2/1/0/1a089e7a35ec8ac1ca5bbe4abf3.gif", 

"http://img15.nnm.me/7/d/c/4/b/34c3b02435f499c9c184f28f7b9.gif", 
"http://img11.nnm.me/3/6/4/c/f/74a23320decc11af1bd57b0b904.gif", 
"http://img11.nnm.me/7/f/7/5/5/f1aa2025112c68c6aabb364120a.gif", 
"http://img12.nnm.me/d/a/b/4/8/2fcd862051cb85912d7b01e04cb.gif", 
"http://img15.nnm.me/4/b/f/8/5/ba85985c086c287996a30db23f8.gif", 

"http://img11.nnm.me/8/e/9/b/f/0abd1c08c423164dd77d38ca986.gif", 
"http://img11.nnm.me/e/6/5/b/3/dae3dfbb36ab0e090d7026692f6.gif", 
"http://img15.nnm.me/7/4/9/d/c/1dafdf66685cb7943af52517f35.gif", 
"http://img15.nnm.me/f/e/b/0/2/46e4d1797afd9ea33f63375334b.gif", 
"http://img15.nnm.me/5/7/c/6/c/dca133f3458cd87949264f6b4cc.gif", 
"http://img12.nnm.me/c/e/1/e/c/bb48851385868ef2d9a8f79b266.gif", 
"http://img12.nnm.me/4/8/5/3/5/98d2bff20b9d7f851cee93b7031.gif", 

"http://img15.nnm.me/5/9/4/f/2/75a1aa5a994b173ada43efa3d0f.gif", 
"http://img11.nnm.me/4/e/e/a/5/48f31c765983d43607f083f85f4.gif", 
"http://img15.nnm.me/8/0/e/2/6/c40adb641ed6fc743137c3e969e.gif", 
"http://img15.nnm.me/8/a/3/f/0/a7e312913c0374cf878ea481db6.gif", 
"http://img11.nnm.me/2/0/0/d/d/9fbecc67d31e2fc2063846e2127.gif", 
"http://img11.nnm.me/e/5/3/9/a/99d1a06e7227f96c1d6986dae52.gif", 
"http://img12.nnm.me/e/1/d/8/7/95115625f7e62c77ff1258e9274.gif", 

"http://img11.nnm.me/d/7/8/c/9/d9cd8bdfd0406262fcb9eb59c66.gif", 
"http://img12.nnm.me/9/9/3/9/a/290e34fe84913d4dfd253345bf6.gif", 
"http://img11.nnm.me/2/4/6/e/5/c6cff8210e8e06d1087262f95da.gif", 
"http://img15.nnm.me/a/b/7/3/5/8826d086057eb8e1190f9777965.gif", 
"http://img12.nnm.me/6/5/1/3/d/96df0b40d30e5b8445ad48b0e9d.gif", 

"http://img15.nnm.me/e/0/9/5/0/8e7ea9268a7cff5e3c32f702ac2.gif", 
"http://img11.nnm.me/b/7/f/7/8/67db89a761a62e7953ec4c096e3.gif", 
"http://img15.nnm.me/6/8/f/d/2/61a9ff4610a9228b84e7f3df3c3.gif", 
"http://img11.nnm.me/7/c/2/c/0/0e184edd3eba9de55a054d8b1d2.gif", 
"http://img15.nnm.me/8/6/9/0/0/bc783f5a6d16564ecf66750d287.gif",

"http://img15.nnm.me/4/6/0/e/7/b339fa588a34e38cc316874cc5c.gif",
"http://img12.nnm.me/b/1/3/3/e/a9bc55d977fc29cc9ce056cba7c.gif",
"http://img12.nnm.me/7/1/b/e/6/e7dd15ef6f38d6de004aa5b6399.gif",
"http://img15.nnm.me/7/0/3/e/c/ed6ad71bef34bfa2f1dba1fb69d.gif",
"http://img15.nnm.me/6/a/d/a/0/484fb8846032f0a663a4e7c89c6.gif",
"http://img11.nnm.me/0/7/b/8/1/6ae328263292dd53f5c72947183.gif",
"http://img15.nnm.me/f/f/b/5/a/68b96a53865bc4a300ab23f0b1f.gif",
"http://img12.nnm.me/a/c/e/d/4/f73b33c89cbed64c6f918e44b4e.gif",
"http://img12.nnm.me/b/d/c/8/4/d17d369e928bef392b33eb0d4e0.gif",
"http://img12.nnm.me/7/3/9/5/0/96e2ca12d8986add4f23137854c.gif",
"http://img11.nnm.me/7/f/1/a/3/5207f32201d74ab6f2233192dd6.gif",
];

function CreateSmiley () { 
var smiley="<div id=\'smileypanel\'>";  
for (var i = 0; i <= SmilAr.length-1; i++) 
{ 
 smiley=smiley+"<img class=\'smiley\' src=\'"+ SmilAr[i]+"\'>"; 
} 
smiley=smiley+"</div>"; 
return smiley; 
} 

 // Функция открытия панели смайлов
function SmileyShow() { 
if($("#smileypanel")[0])  {$("#smileypanel").remove(); $("text").focus();} else  
{ 
var kn=$("#knopki"); kn.prepend(CreateSmiley ()); 
var sm=$("#smileypanel"); sm.attr("style",styleform); 
var HeightScreen = $(window).height(); 
sm.css({"position":"absolute", "left":"0",  
"width":"250px", "height":HeightScreen }); 
var Top_modal_window=$(document).scrollTop(); 
sm.css({"top":Top_modal_window+"px"}); 
 sm.focus(); 
$("img.smiley").css({"cursor":"pointer"} ); 
$("img.smiley").click(function() { ModifySelection("[img]"+$(this).attr("src"),"[/img]");} ); 
 }; } 




//Увеличение картинки
if (a_min_pic) { 
var ftf="<div class=\'modal_window\'><img  id=\'imgbig\' src=\'\'></div> "; 
$("img.inpic").click(function() { 
$("div.modal_window").remove();  
 var mysrc=str_replace("_prev","", $(this).attr("src")); 
$("#page").append(ftf); 
//Ширина и высота всего документа
var HeightDocument = $(document).height(); 
var WidthDocument = $(document).width(); 
		//Ширина и высота окна браузера
var HeightScreen = $(window).height(); 
$("div.modal_window").css({"position":"absolute", "left":"0", "z-index":"999", 
"width":"100%", "height":"100%" }); 
var Top_modal_window=$(document).scrollTop(); 
$("div.modal_window").css({"top":Top_modal_window+"px","display":"block"}); 

$("#imgbig").attr("src",mysrc); 
$("#imgbig").bind("load",function(){  


$("#imgbig").attr("width",$("#imgbig").width()); 
$("#imgbig").attr("height",$("#imgbig").height()); 
$("div.modal_window").click(function () {  $("div.modal_window").remove(); }); 
$("#imgbig").click(function () {  $("div.modal_window").remove(); });  
} ); return false; 
}); 
}; 




 //Плавающая панель лички 
if (a_left_panel) { 
//$("#sidebar").attr("style", "position:fixed;"); //Плавающее левое поле
GM_addStyle('.user-menu {position:fixed; top:20px; left:5px; z-index: 60; background-color: #fff; padding:5px; border: 1px #333 solid; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;}');
//Кнопка перезагрузки в панель лички
var dum=$("div.user-menu"); 
var reloadbtn="<img align='right' src='http://img15.nnm.me/d/3/b/0/b/bf1c8a58a96a7e2c7dd454ae1e8.gif' id='breload' title='Перезагрузить страницу' onClick='location.reload();'><br><br><a href='http://nnm.me/blogs/tr4v15/otzyvy-2/'>Отзывы</a><br><a href='http://nnm.me/blogs/madrabbitt/arena/'>Арена</a><br><a href='http://nnm.me/blogs/mt12/chat_bez_cenzury/'>Поломанный</a><br><a href='http://nnm.me/'>Индекс</a><br><a href='http://rabbitz.nnm.me/'>У Кролика</a>"; 
dum.append(reloadbtn); 
var b_reload=$("#breload"); 
b_reload.css({"background-image":"url(\'http://img11.nnm.me/2/6/1/3/a/35b331dd1e029dfd9780b85f1dd.gif\')"} ); 
b_reload.css({"cursor":"pointer"} ); 
b_reload.mouseover(function () { $(this).css("background-image", 
"url(\'http://img12.nnm.me/b/7/4/4/d/3f558d880437dea23af19d39577.gif\')");  }); 
b_reload.mouseout(function () { $(this).css("background-image", 
"url(\'http://img11.nnm.me/2/6/1/3/a/35b331dd1e029dfd9780b85f1dd.gif\')");  }); 

//просмотр кармы
if (a_view_user) { 
var frameuser="<div id='frameuserpanel' style='background-color: #fff; border: 1px #333 solid; position: absolute; left: 150px; width:140px; height:40px; z-index: 200; display: block; padding: -10px; margin-top: 20px; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius:10px; '><iframe id='f21' src='' style='background-color: #fff;  position: absolute; left: 0px; top: 0px; width:80px; margin-left: 10px; margin-top: 10px; height:20px; overflow: hidden;'></iframe><div align='right'><input id='closebtn' type='button' value='X'  style='  margin-top: 10px; margin-right: 10px;   '/></div></div>";
 $("img.avatar").click(function() { 
 if($("#frameuserpanel")[0]) $("#frameuserpanel").remove(); 
 $(this).parent().parent().prepend(frameuser);  
 
 hrefthis=$(this).parent().find("strong").children().attr("href"); 
 $('#f21').hide();
  $("#f21").attr("src",hrefthis+'#xyi'); 
$('#f21').load(function(){ $(this).show();                } );
 $("#closebtn").click(function() { $("#frameuserpanel").remove(); } );    
 } ) ; 
} 



}
}.toString(); 


 var script = document.createElement("script");

script.type = "text/javascript";


var adres= window.location.toString();

 if(adres.indexOf("/#xyi") != -1) {


 var fdel = function() {
var el=$("p.rating");

$("body").empty();    


  $("body").append(el);
  $("body").css({"overflow":"hidden"});
  
  $("p.rating").css({"background-color":"#fff","margin-top": "0px","height":"20px" } ); 

$("a.down").css( { 
"display": "inline-block",
"width": "16px",
"height": "16px",
"text-indent": "-9999px",
"margin": "0px 5px", 
"background":"url('http://nnm.me/i/rate-down.gif')"
});
$("a.up").css( { 
 "display": "inline-block",
"width": "16px",
"height": "16px",
"text-indent": "-9999px",
"margin": "0px 5px", 
"background":"url('http://nnm.me/i/rate-up.gif')"});
$("span.down").css( {"color":"#fff"});
$("span.up").css( {"color":"#fff"});
$("strong.positive").css( {"color":"#189C3A"} );    
$("strong.negative").css( {"color":"#F11100"} );   


 
 }.toString(); 
 script.textContent = fdel.replace(/^.*?\{|\}.*?$/g, '');
 } else { script.textContent = extension.replace(/^.*?\{|\}.*?$/g, ''); }

document.head.appendChild(script);
