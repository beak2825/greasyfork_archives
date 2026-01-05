// ==UserScript==
// @name       HF Mobile
// @author     Polunom
// @namespace  http://hackforums.net/
// @version    0.1
// @description  A mobile theme for HackForums
// @include     http://hackforums.net/*
// @copyright  2015+, Polunom
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13187/HF%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/13187/HF%20Mobile.meta.js
// ==/UserScript==
$("body").prepend('<div class="load" style="width: 100vw; height: 200vw; z-index: 1002; background-color:#333; position: fixed"></div>');
$('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="http://puu.sh/kPfUL/c99ceaf9dd.css">');
$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');
$('input[type="submit"]').addClass("btn btn-default").css("height", "50px");
$('.links').remove();
$('div[class="pm_alert"]').addClass("alert alert-info").prependTo('.quick_keys');

function check_and_wait(callback) {
    var interval = setInterval(function() {
        if ($('body').css("margin") == "0px") {
            $(".load").hide();
            clearInterval(interval);
            callback();
        }
    }, 30);
}

check_and_wait(function() {
    if(document.title === "Hack Forums - 503"){
        $('.bottommenu').css("display", "none");
        $('#container').css({"position" : "fixed", "top" : "69px"});
    }else{
        $('link[href="http://hackforums.net/cache/themes/theme5/global.css"]')[0].disabled=true;
        if(window.location.href == "http://hackforums.net/" || window.location.href == "http://hackforums.net/index.php"){
            $('a[rel="tabmenu_1"]').click();
            $('link[href="http://hackforums.net/cache/themes/theme5/tabbed.css"]')[0].disabled=true;   
            $(".menu").hide();
            $(".menu1").hide();
            $('ul#menutabs').each(function() {
                var select = $(document.createElement('select')).insertBefore($(this).hide());
                $('>li a', this).each(function() {
                    $('select').change(function(){ 
                        $('a[rel=' + $(this).val() + ']').click();
                    }),
                        option = $(document.createElement('option')).appendTo(select).val(this.rel).html($(this).html());
                });
            });
        }else if(window.location.href.indexOf("http://hackforums.net/showthread.php") > -1){
            $('.post_body').css("color", "#F2F2F2");
            $('table[id^="post_"] tbody').after("<img src='http://i.imgur.com/vlCXPeB.png' style='width: 100%; max-width: 90vw;' class='divider'/>");
            $('.post_avatar img').each(function() {
                $(this).attr("height", $(this).height()/2);
                $(this).attr("width", $(this).width()/2);
            });
            $('.post_author .smalltext:not(.post_author_info)').css({"display" : "block"});
            $('strong[class^="reputation_"]').each(function(){

                $(this).appendTo($(this).parent().parent().prev().find(".largetext"));
                $(this).before(' (').after(')');
            });
            $('textarea').css("display", "none");
            $('a[title="Post Reply"]').addClass("btn btn-default").css({"color" : "#212121", "width" : "100%"}).eq(0).after($('table[style="clear: both; border-bottom-width: 0;"] strong').eq(1).addClass("post_title"));
            $('div[class="pagination"]').first().remove();
            $('a[title="Post Reply"]').eq(1).after('<nav><ul class="pagination"></ul></nav>');
            $('div[class="pagination"] a').appendTo('ul[class="pagination"]').wrap("<li></li>");
            $('div.float_left.smalltext').each(function(){
                $(this).prependTo($(this).parent().parent().parent().parent());
            });
            $('img[src^="http://hackforums.net/images/modern_bl/groupimages"]').wrap("<div></div>").parent().css({"display" : "block"});
            $('span[class="bitButton"] a').remove();
            $('div[style="float:left;"]').each(function(){
               $(this).html($(this).html().replace(/&nbsp;/gi,''));
               $(this).attr("style", "");
            });

        }else if(window.location.href.indexOf("http://hackforums.net/member.php") > -1 && window.location.href.indexOf("http://hackforums.net/member.php?action=profile") < 0){
            $('input[name="username"]').attr("placeholder", "Username/Email");
            $('input[name="password"]').attr("placeholder", "Password");
            $('input[name="gauth_code"]').attr("placeholder", "Gauth");
            $('input[name="remember"]').before("<a class='nohide'>Remember me?</a>");
            $('td:not(".error")').css("color", "#333");
            

        }else if(window.location.href.indexOf("http://hackforums.net/member.php?action=profile") > -1){
            $('table .largetext').css({"display" : "block", "font-weight" : "600", "font-size" : "24pt"}).append($('table .smalltext img[src^="http://hackforums.net/images/modern_bl/groupimages"]').css("display", "block"));
            $('td[width="50%"]:nth-child(1)').attr("width", "100%");
            $('td[width="50%"]').css("display", "none");
            $('a').css("font-size", "12pt");
            $('a[href^="private.php?action=send"]').addClass("btn btn-default").text("PM User");
            $('table .smalltext').eq(1).css("display", "block");

        }else if(window.location.href.indexOf("http://hackforums.net/forumdisplay.php") > -1){
            $('a[title="Post Thread"]').addClass("btn btn-default").css("color", "#212121");
            $('td[class="trow_sep"]').css("display", "none");

        }else if(window.location.href.indexOf("http://hackforums.net/reputation.php") > -1){
            $('.float_right a').addClass("btn btn-default");
            $('tbody tr:nth-child(3)').css("display", "none");
            $('.repvote').css({"padding-left" : "0", "max-width" : "90vw", "word-wrap" : "break-word"}).after("<img src='http://i.imgur.com/vlCXPeB.png' style='width: 100%;' class='divider'/>");
            $('tbody').after('<nav><ul class="pagination"></ul></nav>');
            $('div[class="pagination"] a').appendTo('ul[class="pagination"]').wrap("<li></li>");
            $('div.float_left.smalltext').each(function(){
                $(this).prependTo($(this).parent().parent().parent().parent());
            });
        }else if(window.location.href.indexOf("http://hackforums.net/newthread.php") > -1){
            $('td[valign="top"]').css("display", "none");
            $('td[width="20%"]').css("display", "none");
            $('.toolbar_button_with_arrow').css("display", "none");
            $('input[name="subject"]').attr("placeholder", "Thread Title").after('</br><textarea placeholder="Content" id="message_new" name="message_new" tabindex="2" style="width: 100%; height: 80vw; border-radius: 5px; color: black"></textarea>').before("<h2>New Thread</h2>");
            $('table tr:nth-child(4)').css("display", "none");
            $('tbody tr:nth-child(2) td:nth-child(2)').css("display", "none");
            $('input').css("margin-bottom", "10px");
            $('.post_author').attr("style", "");
            $('input[type="submit"]').css("height", "50px").addClass("btn btn-default");
        }else if(window.location.href.indexOf("http://hackforums.net/newreply.php") > -1){
            $('td[valign="top"]').css("display", "none");
            $('td[width="20%"]').css("display", "none");
            $('.toolbar_button_with_arrow').css("display", "none");
            $('.messageEditor').attr('style', '').prepend('<h2 style="text-align: left;">New Reply</h2></br><textarea placeholder="Content" id="message_new" name="message_new" tabindex="2" style="width: 100%; height: 80vw; border-radius: 5px; color: black;"></textarea>');
            $('.quick_keys table').eq(0).css("display", "none");
            $('tbody tr:nth-child(3)').css("display", "none");
            $('input').css("margin-bottom", "10px");
            $('.post_author').attr("style", "");
            $('div[style="clear: both; height: 656px; width: 574px;"]').remove();
            $('.post_content').parent().css("display", "block");
            $('input[type="submit"]').css("height", "50px").addClass("btn btn-default");
            $('.messageEditor div[style*="clear: both"]').remove();
        }else if(window.location.href.indexOf("http://hackforums.net/private.php") > -1){
            $('img[src^="http://hackforums.net/images/modern_bl/groupimages"]').appendTo('.post_author strong').wrap("<div class='usrbr'></div>");
            $('span[style="display:inline-block;width:20%; text-align:right"]').css("display", "none");
            $('.post_body').prepend("<div id='quotes'></div>");
            $('blockquote').each(function(index){
                if(index % 2 === 0){
                    $(this).prependTo("#quotes").css({"border" : "0px", "border-radius" : "5px", "background-color" : "#212121"});
                }else{
                    $(this).prependTo("#quotes").css({"border" : "0px", "border-radius" : "5px", "background-color" : "#171717"});
                }
            });
            $('.bitButton').addClass("btn btn-default").css("margin-right", "10px").appendTo('#post_');
            $('.bitButton').eq(0).before("<img src='http://i.imgur.com/vlCXPeB.png' style='width: 100%; margin-bottom: 10px;' class='divider'/>");
            if(window.location.href == "http://hackforums.net/private.php" || window.location.href.indexOf("http://hackforums.net/private.php?fid") > -1){

                $(".quick_keys img").css("display", "none");
                $('.checkbox').css("display", "none");
                $('span[style="float:right"]').css("display", "none").before("<h2 id='pm_title' style='color: #F2F2F2; width: 100%; display: block; font-size: 24pt; font-weight: bold; text-shadow: 1px 2px 1px rgba(0,0,0,.24);'>Private Messages</h2>");
                $('a:contains("Compose Message")').addClass("btn btn-default").appendTo($('#pm_title').parent());
                $('span[style="display:inline-block;width:45%; text-align:left"]').css("width", "60%");
                $('table:nth-child(3)').after('<nav><ul class="pagination"></ul></nav>');
                $('div[class="pagination"] a').appendTo('ul[class="pagination"]').wrap("<li></li>");
                $('.forumdisplay_regular').prepend("<img src='http://i.imgur.com/vlCXPeB.png' style='width: 100%;' class='divider'/>");
            }else if(window.location.href.indexOf("http://hackforums.net/private.php?action=send") > -1){
                $('#clickable_smilies').parent().css("display", "none");
                $('.toolbar_button_with_arrow').css("display", "none");
                $('.messageEditor').attr('style', '').css("width", "90vw").prepend('</br><textarea placeholder="Content" id="message_new" name="message_new" tabindex="2" style="width: 100%; height: 80vw; border-radius: 5px; color: black"></textarea>').before("<h2>New PM</h2>");
                $('input').css("margin-bottom", "10px");
                $('.post_author').attr("style", "");
                $('input[type="submit"]').css("height", "50px").addClass("btn btn-default");
                $('strong:contains("Subject:")').parent().css("display", "none");
                $('strong:contains("Message:")').parent().css("display", "none");
                $('strong:contains("Options:")').parent().css("display", "none");
                $('strong:contains("Recipients:")').css("display", "none");
                $('input[name="subject"]').parent().prepend($('textarea[name="to"]').attr("style", 'width: 100%; border-radius: 5px; color: black; margin-bottom: 10px;'));
                $('tbody tr:nth-child(2)').css("display", "none");
                $('.messageEditor div[style*="clear: both"]').remove();
            }
        }else if(window.location.href.indexOf("http://hackforums.net/search.php?") > -1){
            $('tr').each(function(){
                $(this).children('td[class="trow2 forumdisplay_regular"]').eq(1).css("display", "none"); 
                $(this).children('td[class="trow1 forumdisplay_regular"]').eq(1).css("display", "none"); 
            });

            $('a[href^="showthread.php"]').parent().css("display", "block").each(function(){
                $(this).prepend($(this).parent().parent().find('a[href^="forumdisplay.php"]'));
                $(this).find('a[href^="forumdisplay.php"]').before("Forum: ").after("<br>");
            });
            $(".smalltext a:nth-child(5)").text("View Post").addClass("btn btn-default").css("font-size", "12pt");
            $('.smalltext br').css("display", "block");
            $('em').parent().css("display", "block");
            $('td[align="center"][class^="trow"]').css("display", "none");
            $('.forumdisplay_regular').prepend("<img src='http://i.imgur.com/vlCXPeB.png' style='width: 100%;' class='divider'/>");
        }else if(window.location.href.indexOf("http://hackforums.net/misc.php") > -1){
            $('#content br').css("display", "block");
        }else if(window.location.href.indexOf("http://hackforums.net/contact.php") > -1){
            $("legend").css("max-width", "90vw");
            $("input").css("max-width", "90vw");
            $("select").css("max-width", "90vw");
            $("textarea").css({"max-width" : "90vw", "border-radius" : "5px", "color" : "black"});
        }else if(window.location.href.indexOf("http://hackforums.net/allhelp.php") > -1){
            $("td").css({"max-width" : "90vw", "word-wrap" : "break-word"});
            $("blockquote").css({"max-width" : "90vw", "word-wrap" : "break-word"});
        }else if(window.location.href.indexOf("http://hackforums.net/memberlist.php") > -1){
            $('td[width="33%"]').eq(1).css("display", "none");
            $('td[width="33%"]').eq(0).attr("width", "100%");
            $('select').css({"display" : "block", "width" : "90vw"}).prependTo('div[align="center"]');
            $('input[type="submit"]').addClass("btn btn-default").css({"height" : "50px", "margin-bottom" : "20px"});
            $('input:not(.button)').attr("placeholder", "Username");
            $('tr:not(form)').each(function(){
                $(this).children('td[align="center"]').css("display", "none");
            });

            $('td[align="center"] img').parent().attr("style", "").css("width", "100px");
        }else if(window.location.href == "http://hackforums.net/search.php"){
            $('form').prepend('<div id="searchform"></div>');
            $('form[action="search.php"]').css("display", "block");
            $('table').css("display", "none");
            $('tbody tr:nth-child(2)').css("display", "none");
            $('tr').css({"display" : "block", "width" : "90vw"});
            $('td[rowspan="5"]').css({"display" : "block", "width" : "90vw"});
            $('.trow1').css({"display" : "block", "width" : "90vw"});
            $('input:not(.radio)').css({"display" : "block", "width" : "90vw"});
            $('select[name="forums[]"]').css({"overflow-y" : "scroll", "font-size" : "12pt", "text-align" : "left", "white-space" : "pre-wrap"});
            $('input[type="submit"]').addClass("btn btn-default").css("height", "50px");
            $('#author').css("display", "none");
            $('tbody tr:nth-child(3)').children('td:nth-child(2)').css("display", "none");
            $('#searchform').append($('input[name="keywords"]').css("margin-bottom", "20px").attr("placeholder", "Search"));
            $('#searchform').append($('td[rowspan="5"]'));
            $('#searchform').append($('input[type="submit"]'));
        }else if(window.location.href.indexOf("http://hackforums.net/extras.php") > -1){
            $('td:contains("√")').css("display", "none");
        }
    }

    $('#header').append("<div class='menu1'><ul></ul></div>");
    $('input').each(function() {
        $(this).addClass("form-control"); 
    });

    $('strong').each(function() {
        $(this).after("<br />");  
    });
    $('#panel a').each(function() {
        $(this).wrap("<li><li/>");
    });



    $('.menu1 ul').append($('#panel li')).append("<li style='height: 80px;'></li>");
    if(document.title === "Hack Forums - 503"){
        $( ".menu" ).before( "<div id='menubar'><div id='buttonBack' style='display: inline'><i class='fa fa-arrow-left fa-2x'></i></div><h1 id='title'><a href='http://hackforums.net'>hackforums</a></h1></div>" );$("#menutabs").after("<br>");
    }else{
        if(window.location.href.indexOf("http://hackforums.net/showthread.php") > -1 || window.location.href.indexOf("http://hackforums.net/new") > -1 || (window.location.href.indexOf("http://hackforums.net/reputation.php") > -1) || window.location.href.indexOf("http://hackforums.net/private.php?action=") > -1){
            $( ".menu" ).before( "<div id='menubar'><div id='buttonBack' style='display: inline'><i class='fa fa-arrow-left fa-2x'></i></div><h1 id='title'><a href='http://hackforums.net'>hackforums</a></h1><div id='buttonright' style='display: inline'><i class='fa fa-user fa-2x'></i></div></div>" );$("#menutabs").after("<br>");
        }else{
            $( ".menu" ).before( "<div id='menubar'><div id='button' style='display: inline'><i class='fa fa-bars fa-2x'></i></div><h1 id='title'><a href='http://hackforums.net'>hackforums</a></h1><div id='buttonright' style='display: inline'><i class='fa fa-user fa-2x'></i></div></div>" );$("#menutabs").after("<br>");
        }
    }
    $('.menu ul').append("<li style='height: 80px;'></li>");
    $(".menu").hide();
    $(".menu1").hide();

    $('#button').click( 
        function() {
            $(".menu1").hide();
            $(".menu").animate({width: 'toggle'}, 'fast');

        }
    );
    $('#buttonBack').click( 
        function() {
            window.history.back();

        }
    );
    $('#buttonright').click( 
        function() {
            $(".menu").hide();
            $(".menu1").animate({width: 'toggle'}, 'fast');
        }
    );
});