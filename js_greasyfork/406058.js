// ==UserScript==
// @name           Chaturbate
// @version 4.7
// @namespace      cam4_goes_droopy
// @description    cam4 cleanup
// @include        https://chaturbate.com/male-cams/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require        https://code.jquery.com/jquery-3.1.0.js
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/406058/Chaturbate.user.js
// @updateURL https://update.greasyfork.org/scripts/406058/Chaturbate.meta.js
// ==/UserScript==

$(function(){

    console.log('=============||||| RUNNING CHATURBATE |||||==============');


    setTimeout(function() {
        $('#close_entrance_terms').click();
        $('body').removeAttr('style');
    }, 1200);



    $("head").append("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/tooltipster.min.css' type='text/css' media='screen'>");
    $("head").append("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css' type='text/css' media='screen'>");

    var refresh = '<div class="refresh"><i class="fa fa-refresh"></i></div>';
    $('#header .section').append(refresh);



    var jumpTop = '<div class="jumpToTop"></div>';
    $('.endless_page_template').append(jumpTop);

    $(".jumpToTop").click( function() {
        window.scrollTo(0, 0);
    });







    function statusBar() {
        setTimeout(function() {
              $('#statuss_wrap').removeClass('stathide');

              setTimeout(function() {
                  $('#statuss_wrap').addClass('stathide');
              }, 1000);

        }, 1500);
    }


    function gayProfs() {
        $('.subject li').each(function() {

            //var gayy = $(this).text().indexOf("gay");
            var gayy = $(this).attr('title').indexOf("gay");

            //console.log(gayy);

            if (gayy !== -1) {
                $(this).parents('.profiles').addClass('gayyy');
            }

        });
    }


    function blank() {
        $('#main > div.content > div.c-1.endless_page_template > ul.list > li > a').addClass('thumbs');
        $('#main > div.content > div.c-1.endless_page_template > ul.list > li > a').attr('target', '_blank');
        $('#main > div.top-section.top-section_small_gfx > ul.sub-nav > li > a').attr('target', '_blank');

        $('#main > div.content > div.c-1.endless_page_template > ul.list > li > div.details > div > a').attr('target', '_blank');
    }



    function linkWrap(){
        $('#main > div.content > div.c-1.endless_page_template > ul.list > li').each(function() {
            var videoLink = $(this).find('.thumbs').attr('href');
            $(this).find('.thumbs').removeAttr('href');
            $(this).wrap( '<a class="profiles" data-profile-url="'+videoLink+'" href="'+videoLink+'" target="_blank"></div>' );
        });
    };








    $('#main > div.content > div.c-1.endless_page_template > ul.list > li > a').addClass('thumbs');
    $('#main > div.content > div.c-1.endless_page_template > ul.list > li > a').attr('target', '_blank');
    $('#main > div.top-section.top-section_small_gfx > ul.sub-nav > li > a').attr('target', '_blank');
    $('<div id="statuss_wrap" class="stathide"><div id="statuss">updated</div></div>').prependTo('body');
    $('#main > div.content > div.c-1.endless_page_template > ul.list > li > div.details > div > a').attr('target', '_blank');

    linkWrap();
    gayProfs();



    $('.room_list_room').removeAttr('onmousedown onclick ontouchstart');







    function updateDirectURL() {
        console.log("updateDirectURL ===================");

        $('body').prepend('<div id="response-container" class="xxx"></div>');

        $('.profiles').each(function() {
            var $this = $(this);

            var profHref = $(this).attr('href');
            var newProfLink = 'https://chaturbate.com/'+profHref;
            $(this).attr('href', newProfLink);

            $.get(newProfLink, function(response) {
                var myRegex = /(window.initialRoomDossier)(.*)/g;
                var match = myRegex.exec(response);
                var newTxt = match[0];

                var regQuote = /\\u0022/ig;
                var regHyph = /\\u002D/ig;
                var regBkSlsh = /\\u005C/ig;
                newTxt = newTxt.replace(regQuote, '"');
                newTxt = newTxt.replace(regHyph, '-');
                newTxt = newTxt.replace(regBkSlsh, '\\');

                var hlsRep = /(hls_source": ")(\bhttps?:\/\/\S+\b)/i;
                var hls_source = hlsRep.exec(newTxt);
                var hlsURL = hls_source[2];
                //console.log(hlsURL);

                $this.attr('data-m3u8', hlsURL);
                $this.find('.thumbs').attr('data-m3u8', hlsURL);
                $this.find('.thumbs').attr('data-profile-url', newProfLink);
                //$this.find('.icon_not_following').wrap("<a href="+hlsURL+" target='_blank'><i class='fa fa-play-circle'></i></a>");
                $this.find('.icon_not_following').remove();
                //$this.find('.fa-play-circle').addClass('icon_not_following').attr('style', 'position: absolute; top: 0; right: 0; width: 23.25px; height: 23.25px; margin-top: 3px; margin-right: 1px; cursor: pointer; font-size: 20px; text-align: center; color: #fff !important; opacity: .5; background: none !important; transition: ease all .25s;');
            });
        });
    }
    updateDirectURL();


// ENLARGE THUMBS FUNCTION =======================================================
    function hoverThumbs() { console.log('Hovering thumbs');


        $(".hoverVid").remove();



        var timeoutId;
        var rect, recttop, winScroll;

        $(".thumbs img").hover(function() {
                console.log('Hovering thumb');

                if( $(".hoverVid") ) {
                    $(".hoverVid").remove();

                    var $this = $(this);

                    var m3u8URL = $this.parents('.thumbs').attr('data-m3u8');
                    var hoverVidURL = m3u8URL; //console.log(hoverVidURL);
                    var username = $this.parents(".profiles").find(".title a").text();

                    rect = $(this).offset(); //console.log(rect);
                    recttop = rect.top; //console.log(recttop);
                    winScroll = $(window).scrollTop(); //console.log(winScroll);


                    if (!timeoutId) {
                        timeoutId = window.setTimeout(function() {
                            timeoutId = null;

                            $('body').append('<div class="hoverVid"><video id="'+username+'" loop="" muted data-setup="{}" class="video-js profile-preview " autoplay="" src="'+hoverVidURL+'" style="background-color: black;"></video></div>');

                            if (rect.left > 700) {
                                    $(document).bind('mousemove', function(e){
                                        $('.hoverVid').css({
                                           left:  e.pageX - 200,
                                           top:   e.pageY + 40
                                        });
                                    });
                            } else {

                                $(document).bind('mousemove', function(e){
                                    $('.hoverVid').css({
                                       left:  e.pageX + 20,
                                       top:   e.pageY
                                    });
                                });

                            }


                        }, 1000);
                    }
                }
            },
            function() {
                if (timeoutId) {
                    window.clearTimeout(timeoutId);
                    timeoutId = null;
                } else {
                    $(".hoverVid").remove();
                    $(".thumbs img").removeClass('enlarge pushdown pushright pushleft');
                    $(".thumbs img").removeAttr('style');
                    rect = null;
                    recttop = null;
                }
            });
    }

hoverThumbs();







// OPEN BOTH LINKS ON CLICK ==========================================================
    function twoWindowOpen() {
        $('.profiles').click(function(e) {
            console.log('.profiles clicked....');
            e.preventDefault();

            var directVidURL = $(this).attr("data-m3u8");
            var profileURL = $(this).attr("data-profile-url");

            window.open(directVidURL, '_blank');
            //window.open(profileURL, '_blank');
        });
    }
    twoWindowOpen();









   $(".refresh").click( function() {
        statusBar();
        blank();
        linkWrap();
        gayProfs();

        twoWindowOpen();

        var jumpTop = '<div class="jumpToTop"></div>';
        $('.endless_page_template').append(jumpTop);

        $(".jumpToTop").click( function() {
            window.scrollTo(0, 0);
        });
    });


    function profilesUpd() { console.log('profilesUpd ==============');
        statusBar();
        blank();
        linkWrap();
        gayProfs();
        updateDirectURL();
        hoverThumbs();
        twoWindowOpen();

        var jumpTop = '<div class="jumpToTop"></div>';
        $('.endless_page_template').append(jumpTop);

        $(".jumpToTop").click( function() {
            window.scrollTo(0, 0);
        });
    }

/*
    $(document).ready(function() {
        console.log('observer');
        var observer = new MutationObserver(function(e) {
            console.log('observer triggered');
            profilesUpd();
        });

        var falseInput = $('#room_list');

        //observer.observe($(falseInput)[0], {childList: true});
        //observer.observe($(falseInput)[0], {characterData: true, childList: true, attributes: true});
        observer.observe($(falseInput)[0], {characterData: true, childList: true, attributes: true});
    });
*/


    setTimeout(function() {
        console.log('Being watched ===================================>>>>');
        $('.endless_page_template').addClass('beingWatched');

        console.log('observer');
        var falseInput = $('.beingWatched');
        var observer = new MutationObserver(function(e) {
            console.log('mutation triggered: '+e.type);
            profilesUpd();

            setTimeout(function() {
                observer.observe($(falseInput)[0], {characterData: true, childList: true, attributes: true});
            }, 15000);

            observer.disconnect();
        });
        observer.observe($(falseInput)[0], {characterData: true, childList: true, attributes: true});

    }, 15000);







    document.addEventListener("visibilitychange", function() {
        console.log(document.hidden, document.visibilityState);
    }, false);







    $('.subject li').each(function() {

        var gayy = $(this).text().indexOf("gay");

        if (gayy !== -1) {
            $(this).parents('.profiles').addClass('gayyy');
        }

    });












     $(document).click(function(event) {
        console.log( $(event.target) );
    });





});
