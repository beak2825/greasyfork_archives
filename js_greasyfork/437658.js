// ==UserScript==
// @name         Kinox Image Thumbnails
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Loads Thumbnails on Kinox.to
// @author       Fut
// @match        https://kinoz.to/*
// @match        https://www3.kinox.to/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437658/Kinox%20Image%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/437658/Kinox%20Image%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("#preview { visibility: hidden; }");
    GM_addStyle(".Title > a { font: 18px Arial, Helvetica, sans-serif; }");

    var $ = window.jQuery;


    // Home
    $('.FullModuleTable > tbody  > tr').each(function(index, tr) {
        //console.log(index);
        //console.log(tr);
        //console.log($(tr).find(".Icon > img").attr('src'));
        var thumb = $(tr).find(".img_preview").attr('rel');
        $(tr).find("td.img_preview > a").css('display', 'block');
        $(tr).find(".OverlayLabel").css('display', 'block');
        $(tr).find("td.img_preview").append('<img src="' + thumb + '">');
    });





    // Newest, etc.
    $('#RsltTableStatic > tbody > tr').each(function(index, tr) {
        var url = $(tr).find('.Title > a').attr('href');
        console.log(url);

        $.ajax({
            url: url,
            type:'GET',
            success: function(data){
                var thumb = $(data).find('#Vadda').find('a').find('img').attr('src');

                console.log(thumb);
                $(tr).find("span.Year").css('display', 'block');
                $(tr).find("td.Title").append('<img src="' + thumb + '">');
                //$(tr).find("td.Title").append(thumb);

                //$('#content').html($(data).find('#firstHeading').html());
            }
        });


    });



    function StartWork(){
        setTimeout(() => {
            console.log(DoCheck());
            if(DoCheck()){
                DoWork();
            }
        }, 1000);
    }

    $(document).ready(function() {
        $(document).on('click','.paginate_button',function(e) {
            //handler code here
            StartWork();
        });
        $(document).on('click','.paginate_active',function(e) {
            //handler code here
            StartWork();
        });
        $(document).on('click','.LetterMode',function(e) {
            //handler code here
            StartWork();
        });
    });



    StartWork();
    


    function DoCheck(){
        if($('#RsltTable_processing').css('visibility') === 'hidden'){
            return true;
        }
        else{
            setTimeout(DoCheck(), 500);
            return false;
        }

    }

    function DoWork(){
        $("#RsltTable > tbody > tr").each(function(index, tr) {
            var url = $(tr).find('.Title > a').attr('href');
            console.log(url);

            $.ajax({
                url: url,
                type:'GET',
                success: function(data){
                    var thumb = $(data).find('#Vadda').find('a').find('img').attr('src');

                    console.log(thumb);
                    if($(tr).find('.Year').length){
                        $(tr).find('.Year').css('display', 'block');
                    }
                    else{
                        $(tr).find(".Title > a").css('display', 'block');

                    }
                    $(tr).find("td.Title").append('<img src="' + thumb + '">');
                    //$(tr).find("td.Title").append(thumb);

                    //$('#content').html($(data).find('#firstHeading').html());
                }
            });


        });
    }



})();