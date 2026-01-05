// ==UserScript==
// @name        MyAgar
// @namespace   MyAgar
// @author      翠如bb HK Golden
// @include     http://agar.io/
// @version     1.2
// @grant       none
// @description BB tool Agar
// @downloadURL https://update.greasyfork.org/scripts/10610/MyAgar.user.js
// @updateURL https://update.greasyfork.org/scripts/10610/MyAgar.meta.js
// ==/UserScript==
$.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpVlhYTmVKTjZqZzA" )
.done(function( script, textStatus ) {
    $.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpX0VvY0hZNnZVemM" );
})
.fail(function( jqxhr, settings, exception ) {
    console.log("fail to load script");
});
$(document).ready(function(){
    var team_name = "VÔZ";
    $(document).on('click','.btn-settings', function(){
        $('#cb_team').attr("checked", true)[0].onchange();
        $('#team').val(team_name);
        $('#cb_Msg').attr("checked", false)[0].onchange();
        $('#cb_bord').attr("checked", true)[0].onchange();
        $('#cb_skin').attr("checked", true)[0].onchange();
        $('#cb_cie').attr("checked", false)[0].onchange();
        $('#cb_dfbgg').attr("checked", false)[0].onchange();
        $('#cb_dfv').attr("checked", false)[0].onchange();
        $('#region').val('SG-Singapore')[0].onchange();
        $('#minimap').css({
            right: '10px',
            left: 'inherit'
        });
    });
    var _iframe = '<iframe style="position:absolute; bottom: 10px; left: 10px; width: 200px; height: 250px; opacity: 0.5; z-index: 9999999;" src="http://my.cbox.ws/piggy001001"></iframe>';
	  $('body').append(_iframe);
});

//Script siêu nhẹ, siêu mượt, an toàn, tiện lợi, đã được bộ y tế kiểm chứng.