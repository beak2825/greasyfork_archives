// ==UserScript==
// @name         ABL GROUPER
// @description  Group AntiBotLinks into one place for better manual solving
// @version      1.0
// @author       WXC
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at document-idle
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/458887/ABL%20GROUPER.user.js
// @updateURL https://update.greasyfork.org/scripts/458887/ABL%20GROUPER.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';


    var $ = window.jQuery;
    $(document).ready(function() {



        var auto_last_word = 1; // 0/1 auto click last word (1)
        var resize_small_q = 1; // 0/1 scale up small-height question (1)



        setTimeout( function() {


            function cl( text ) {
                var cssRule = "border-left: 3px solid #f1b44c; padding-left: 5px; ";
                setTimeout(console.log.bind(console, "%c"+ text, cssRule), 0);
            }


            if( $("#antibotlinks").length > -1 ) {

                var abl_q_src = $("#antibotlinks_reset").prev("img").attr("src");

                var abl_tmp = new Image();
                abl_tmp.src = abl_q_src;
                var abl_q_width = abl_tmp.clientWidth;
                var abl_q_height = abl_tmp.clientHeight;
                var my_height_q = '';
                var my_height_b = '';

                if( resize_small_q == 1 ) {

                    my_height_q = 35; // question img height (35)
                    my_height_b = 50; // buttons img height (50)

                    // you can set own dimension and scale
                    if( abl_q_width < 150 ) my_height_q *= 1.3; // 1.3 = +30%
                }

                var abl_q_img = '<img src="' + abl_q_src +'" style="height: '+ my_height_q +'px !important; ">';


                var img = '';
                var rel = '';
                var abl_btn_data = '';
                var abl_cnt = 0;
                var abl_clicks = 0;


                $("#antibotlinks").closest('form').find('a').each( function() {

                    rel = $(this).attr('rel')
                    img = $(this).find("img").attr("src");

                    if( rel > 0 && img.length > 0 ) {
                        abl_btn_data += `<img src="`+ img +`" height="`+ my_height_b +`" data-abl="`+ rel +`" class="abl_btn abl_abl_hand">`;
                        abl_cnt ++;
                    }

                });



                if( $("#antibotlinks").closest('form').is(":visible") ) {

                    cl( "ABL visible" );

                    if(!$("#i_bg").length) {

                        $("html").append(`
                        <div id="i_bg" style="position: fixed; z-index: 99999999; background-color: #212529; opacity: 0.98; top: 0px; left: 0px; width: 100%; height: 100%; display: none;">
                        <div id="i_box" style="position: fixed; z-index: 99999998; top: 10%; left: 50%; transform: translateX(-50%); text-align: center; font: bold 16px arial; line-height: 150%; opacity: 1; border: 1px solid #000; padding: 50px; border-radius: 10px;" class="abl_bg_light">
                        `+ abl_q_img +`
                        <br><br>

                        <div style="font: 14px arial;">
                        <span class="abl_theme" style="float:left; margin: 0px 20px;">Hover to THEME</span>
                        <span class="abl_reset abl_abl_hand" style="float:right; margin: 0px 20px;">Click to RESET</span>
                        </div>

                        <br><br><br>
                        `+ abl_btn_data +`

                        </div>
                        </div>
                        <style>
                        #i_box a, #i_box a:visited { line-height: 150%; font-size: 24px; color: #000000; }
                        .abl_btn { margin: 0px 10px; border-bottom: 1px solid #ccc; }
                        .abl_abl_hand { cursor: pointer; }
                        .abl_bg_light { background-color: #ffffff; color: #cccccc; }
                        .abl_bg_dark { background-color: #000000; color: #303030
                        </style>
                        `);

                        $("#i_bg").fadeIn("fast");


                        var tit1 = document.title;
                        setInterval(function(){
                            var title = document.title;
                            var tit2 = "ABL!";
                            document.title = (title == tit2 ? tit1 : tit2 );
                        }, 1000);


                    }

                }
                else {
                    cl( "ABL not visible" );
                }



                $(document).on("click", "img[data-abl]", function(e){

                    $("#antibotlinks").val( $("#antibotlinks").val() + " "+ $(this).data("abl") ); // starting space needed!
                    $(this).hide();
                    abl_clicks++;

                    if( auto_last_word == 1 && abl_clicks == ( abl_cnt -1 ) ) { // auto click last word
                        $(".abl_btn:visible").click();
                        abl_clicks++;
                    }

                    if( abl_clicks == abl_cnt ) { // all btns clicked

                        $("#i_bg").fadeOut("fast");
                        $("#antibotlinks").closest('form').find(':submit').removeClass('d-none').show().css('display','block'); // try to display submit button
                        cl( "ABL solution:"+ $("#antibotlinks").val() );

                        // hide original buttons
                        for (let i = 1; i <= abl_cnt; i++) {
                            $("#antibotlinks").closest('form').find("a").eq(i).fadeOut();
                        }

                        $("#antibotlinks_reset").after(`<p>`+ $("#antibotlinks").val() +`</p>`);

                    }

                });



                $(document).on("click", ".abl_reset", function(e){ // reset

                    $("#antibotlinks").val("");
                    $("img[data-abl]").show();
                    abl_clicks = 0;
                    cl( abl_clicks );

                });



                $(document).on("mouseover", ".abl_theme", function() {
                    $("#i_box").toggleClass("abl_bg_light abl_bg_dark");
                });


            }
            else {
                cl( "No ABL detected" );
            }


        }, ( 2 * 1000 ) ); // wait for site fully load (sec)


    })

})();