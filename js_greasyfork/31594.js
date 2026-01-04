// ==UserScript==
// @name         Soundeo downloaded track
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Mark your downloaded tracks
// @author       Facundo Vazquez
// @match        http://soundeo.com/*
// @match        https://soundeo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/31594/Soundeo%20downloaded%20track.user.js
// @updateURL https://update.greasyfork.org/scripts/31594/Soundeo%20downloaded%20track.meta.js
// ==/UserScript==

(function() {
    console.log('Script executed.');
    if( typeof jQuery === 'undefined' ){
        console.log('jQuery -> Fail');
        return false;
    }
    else {
        console.log('jQuery -> OK. Version: ' + jQuery.fn.jquery);
    }

    var $bcolor=$(".trackitem").css("background-color");

    function reg_Download(e) {
        //console.log(GM_getValue($(e).prop("data-track-id")));
        GM_setValue($(e).parents('.trackitem').attr("data-track-id"),true);
        //console.log(GM_getValue($(e).prop("data-track-id")));
        $(e).parents('.trackitem').css('background-color', '#cae9ef');
        $(e).parents('.trackitem').children('.downloadcheckbox').prop('checked', true);
    }

    function unreg_Download(e) {
        //console.log(GM_getValue($(e).attr("data-track-id")));
        GM_setValue($(e).parents('.trackitem').attr("data-track-id"),false);
        //console.log(GM_getValue($(e).attr("data-track-id")));
        $(e).parent().css('background-color', $bcolor);
    }

    function addCheckbox() {
        //console.log( "addCheckbox!" );
        $(".folder").width(700);
        var count_total=0, count_downloaded=0;
        $(".trackitem").each( function(){
            if($(this).children('.download').length) {
                $(this).append('<input class="downloadcheckbox" type="checkbox" data-track-id="'+$(this).attr("data-track-id")+'">' );
                var checked=GM_getValue($(this).attr("data-track-id"));
                //console.log("checked:"+checked);
                $(this).children('.downloadcheckbox').attr('checked', checked);
                if(checked) {
                    $(this).css('background-color', '#cae9ef');
                    count_downloaded++;
                }
                count_total++;
            }
        });

        console.log('Tracks: '+count_total+'. Downloaded: '+count_downloaded);
    }

    addCheckbox();

    var divW = 700;
    function checkResize(){
        var w = $(".folder").width();

        if (w < divW) {
            addCheckbox();
        }
    }
    $(window).resize(checkResize);
    var timer = setInterval(checkResize, 1000);

    // Listeners **************************************************************************************************************

    $(".downloadcheckbox").change(function() {
        console.log('Something change...');
        if(this.checked) {
            reg_Download($(this));
        }
        else {
            unreg_Download($(this));
        }
    });

    $(".track-download-lnk").click(function() {
        if($(this.downloadcheckbox).is(':checked')) {
        }
        else {
            reg_Download($(this));
        }
    });

    var flag_allSelected=true;

    $(document).keypress("m",function(e) {
        if(e.ctrlKey) {
            $(".downloadcheckbox").each(function(){
                // console.log('flag_allSelected: '+flag_allSelected);
                // $('.downloadcheckbox').attr('checked', checked);
                $('.downloadcheckbox').prop('checked', flag_allSelected);

                if(flag_allSelected) {
                    reg_Download($(this));
                }
                else {
                    unreg_Download($(this));
                }
            });
            flag_allSelected=!flag_allSelected;
        }
    });
})();