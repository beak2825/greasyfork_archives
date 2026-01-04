// ==UserScript==
// @name         japonx-patch
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  你懂得哦
// @author       逍遥一仙
// @match        http://*/portal/index/detail/id/*.html
// @match        https://*/portal/index/detail/id/*.html
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/386252/japonx-patch.user.js
// @updateURL https://update.greasyfork.org/scripts/386252/japonx-patch.meta.js
// ==/UserScript==


window.hookplay=function(){
    var getid=$("input[name='bb']")[0].value;
    window.player = true;
    if(getid == ""){
        ajax_get_js();
    }else{
        $.get(
            '/portal/index/ajax_get_js.html',{id:getid},
            function(res){
                $("#ajax_js").remove();
                $("body").append("<script id='ajax_js' type='text/javascript'>"+res+"<\/script>");
                $('#coverBox').remove();
                $('#video').show();
                $('#video').css('z-index','110000');
                // dp.play();
            },'text'
        );
    }
}
$(".desc").append('<dt>控制</dt><div id="d-btn"> <input value="" placeholder="" name="bb" class="ie-css3"> <a onclick="hookplay()" class="d-btn play" target="_blank">get</a></div>');