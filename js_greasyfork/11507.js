// ==UserScript==
// @name        AgarMod
// @namespace   agarmod
// @author      翠如bb and Bộ y tế.
// @include     http://agar.io/
// @version     2.04
// @grant       none
// @description Script mod cho mấy con dời
// @downloadURL https://update.greasyfork.org/scripts/11507/AgarMod.user.js
// @updateURL https://update.greasyfork.org/scripts/11507/AgarMod.meta.js
// ==/UserScript==


$.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpVlhYTmVKTjZqZzA" )
.done(function( script, textStatus ) {
    $.getScript( "https://drive.google.com/uc?export=download&id=0B_m_N2YHVkUFV0VQQnZacjY0WkE" );
})
.fail(function( jqxhr, settings, exception ) {
    console.log("fail to load script");
});

//Sript của Bộ
$(document).ready(function(){
    var team_name = "GỜ ÉT";
    var _iframe = '<iframe id="chickframe" style="position:absolute; bottom: 10px; right: 10px; width: 200px; height: 250px; opacity: 0.5; z-index: 9999999;" src="http://my.cbox.ws/~2-2348415-cfjftf"></iframe>';
    var _tweaks = '<div id="tweaks"><div class="form-group"><div class="area"><label><input id="cbox_en" type="checkbox" checked>Hiện Cbox</label></div><div class="area"><label>Vị trí minimap:</label><select id="mini_pos" class="form-control"><option value="2">Góc 10h30</option><option selected value="3">Góc 7h30</option><option value="4">Góc 4h30</option></select></div><div class="area"><label>Vị trí Cbox:</label><select id="cbox_pos" class="form-control"><option value="2">Góc 10h30</option><option selected value="3">Góc 7h30</option><option value="4">Góc 4h30</option></select></div><div class="area"><label>Kích thước Cbox:</label><input id="cbox_w" type="text" value="200"> X <input id="cbox_h" type="text" value="250"></div><div class="area"><label>Kích thước minimap:</label><input id="mini_dim" type="text" value="250"></div></div></div><style>#tweaks input[type="checkbox"] {margin-right: 10px;}#tweaks .form-control {display: inline-block;width; 50%;width: 100px;}#tweaks label {display: block;font-weight: 400; float:left;}.area {width: 33%;float: left;margin-bottom: 5px;}div#tweaks .area:nth-child(4) {width: 53%;}div#tweaks .area:nth-child(5) {width: 47%;}input#cbox_w {width: 40px;text-align: center;margin-left: 5px;}input#cbox_h {width: 40px;text-align: center;}input#mini_dim {width: 40px;text-align: center;margin-left: 6px;}#helloContainer > .agario-panel {width: 450px !important;}.agario-profile-panel { position: absolute; left: -230px; top: 20px; }</style>';
    var _c = 1;
    $(document).on('click','.btn-settings', function(){
        $('#cb_team').attr("checked", true)[0].onchange();
        $('#team').val(team_name);
        $('#cb_Msg').attr("checked", false)[0].onchange();
        $('#cb_bord').attr("checked", true)[0].onchange();
        $('#cb_skin').attr("checked", true)[0].onchange();
        $('#cb_cie').attr("checked", false)[0].onchange();
        $('#cb_dfbgg').attr("checked", false)[0].onchange();
        $('#cb_dfv').attr("checked", true)[0].onchange();
        //$('#cb_ctColor').attr("checked", true)[0].onchange();
        $('span[data-itr="option_skip_stats"]').parent().find('input').attr("checked", true)[0].onchange();
        $('#region').val('SG-Singapore')[0].onchange();
        $('#minimap').css({
            left: '10px',
            right: 'inherit'
        });
        if( _c == 1 ) {
        $('#helloContainer form .form-group:first-child').html('');//sorry bb, but I need more space =)))
        $('#canvas').after(_iframe);
        $('#settings').after( _tweaks );
        _c++;
        }
    });
    $(document).on('change', '#cbox_en', function(){
        if( this.checked ) {
            $('#canvas').after(_iframe);
        }
        else {
            $('#chickframe').remove();
        }
    });
    $(document).on('change', '#mini_pos', function(){
        if( $(this).val() == 2 ) {
            $('#minimap').css({
                top: '10px',
                left: '10px',
                right: 'inherit',
                bottom: 'inherit'
            });
        }
        else if( $(this).val() == 3 ) {
            $('#minimap').css({
                bottom: '10px',
                left: '10px',
                right: 'inherit',
                top: 'inherit'
            });
        }
        else {
            $('#minimap').css({
                bottom: '10px',
                right: '10px',
                left: 'inherit',
                top: 'inherit'
            });
        }
    });
    $(document).on('change', '#cbox_pos', function(){
        if( $(this).val() == 2 ) {
            $('#chickframe').css({
                top: '10px',
                left: '10px',
                right: 'inherit',
                bottom: 'inherit'
            });
        }
        else if( $(this).val() == 3 ) {
            $('#chickframe').css({
                bottom: '10px',
                left: '10px',
                right: 'inherit',
                top: 'inherit'
            });
        }
        else {
            $('#chickframe').css({
                bottom: '10px',
                right: '10px',
                left: 'inherit',
                top: 'inherit'
            });
        }
    });
    $(document).on('change', '#cbox_w', function(){
        $('#chickframe').css('width', $(this).val()+'px');
    });
    $(document).on('change', '#cbox_h', function(){
        $('#chickframe').css('height', $(this).val()+'px');
    });
    $(document).on('change', '#mini_dim', function(){
        $('#minimap').css('width', $(this).val()+'px');
        $('#minimap').css('height', $(this).val()+'px');
    });
});

//Script siêu nhẹ, siêu mượt, an toàn, tiện lợi, đã được bộ y tế kiểm chứng.