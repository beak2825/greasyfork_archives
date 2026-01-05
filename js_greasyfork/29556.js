// ==UserScript==
// @name         Vk Background (Custom)
// @namespace     https://vk.com/id283655449
// @version      1.0
// @description  Custom buckground
// @author       AnakonDRaG(Dmitriy)
// @match        https://vk.com/*
// @require    http://code.jquery.com/jquery-latest.min.js
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/29556/Vk%20Background%20%28Custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29556/Vk%20Background%20%28Custom%29.meta.js
// ==/UserScript==
var src= localStorage.getItem("image"),
    rgba_write="255,255,255,0.8",
    rgba_dark="rgba(0,0,0,0.8)";
var author ='<a href="https://vk.com/id283655449" style="font-size:10px;">Подписаться на автора</a>';
document.body.style.background="url("+ src +") fixed no-repeat";
document.body.style.backgroundSize="100%";
$("#stl_bg").css("background","rgba(220,226,232,0.5)");
$("#quick_login_form input").css('width','100%');
$("#index_footer_wrap").css('background','rgba('+rgba_dark+')');
$("#page_layout").css({'background':'rgba('+rgba_write+')','height':'100%'});
$("#side_bar_inner ol").append('<center><input type="button" value="Setting" class="flat_button" id="setting_block" style="font-size:10px;"></center>');
$("body").append('<div id="block_open" style="display:none;"><div class="page_block" style="width:500px;height:;position: fixed;top: 50%;left: 50%;margin: -250px 0 0 -220px;z-index:100;" "><div class="ui_tabs"><input type="button" id="but_close_image" class="flat_button" value="X" style="position:relavite;margin-top:-5px;"><p style="">Setting</p></div><div id="i_block_content" style="margin:10px;"><center><img src="'+localStorage.getItem("image")+'" width="250px"  id="now_image"></center><br><input style="width:100%" id="load_image_value" value="" type="input" placeholder="Link to backgroung" class="dark"><center><input id="load_image_but" class="flat_button" value="Save background" type="button"></center>'+author+'</div></div></div>');
$("#setting_block").click(function(){$("#block_open").css('display','block');});
$("#but_close_image").click(function(){$("#block_open").css('display','none');});
$("#load_image_but").click(function(){
    var src= $("#load_image_value").val();
    if($("#load_image_value").val()!==''){
    document.body.style.background="url("+ src +") fixed no-repeat";
   localStorage.setItem("image",src);
         document.getElementById("now_image").src= localStorage.getItem("image");
    document.body.style.backgroundSize="100%";
    }else{
           $("#load_image_value").css('border','1px solid #EB6361');
        setTimeout(function(){$("#load_image_value").css('border','1px solid #d3d9de');},250);
    }
});
$.window(function(){
    var src = getImage;
        document.getElementById("now_image").src= localStorage.getItem("image");
});
//Если не трудно подпишитесь :D Так же предлогайте свои идеи что добаваить или изменить /// If it's not difficult to subscribe :D Also, offer your ideas what to add or change
// https://vk.com/id283655449
