// ==UserScript==
// @name           Chaturbate JSON
// @version        4.7
// @namespace      cam4_goes_droopy
// @description    cam4 cleanup
// @include        https://chaturbate.com/male-cams/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require        https://code.jquery.com/jquery-3.1.0.js
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/406059/Chaturbate%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/406059/Chaturbate%20JSON.meta.js
// ==/UserScript==

$(function(){

    console.log('=============||||| RUNNING CHATURBATE JSON |||||==============');

    var users = {};
    var myArr = [];







        function hovv() {
        console.log("function hovv()");

        var timeoutId;

        $('.profile').hover(function() {
            var $this = $(this);
            var profNum = $this.attr('data-profcount');

            var rect = $(this).offset();
            var recttop = rect.top;
            var winScroll = $(window).scrollTop();


            if (!timeoutId) {
                timeoutId = window.setTimeout(function() {
                    timeoutId = null;

                    var hlsURL = $this.find('.vid').attr("data-src");
                    var pref = $this.attr("data-pref");
                    var orientation = $this.attr('data-orientation');
                    var subject = $this.attr('data-subject');

                    $('body').append('<div class="hoverVid '+pref+' '+orientation+' hide"><video id="hoverVid" loop="" muted data-setup="{}" class="video-js profile-preview " autoplay="" src="'+hlsURL+'" style="background-color: black;"></video><div class="subject_hov">'+subject+'</div></div>');


                    function vidOnCanPlay() {
                        $('.hoverVid').toggleClass('hide');
                    }
                    function vidOnError() {
                        $this.find('.play').remove();
                        $this.css('opacity', '.4');
                    }

                    var vid = document.getElementById("hoverVid");
                    vid.oncanplay = function() {
                        //console.log("Can start playing video");
                        vidOnCanPlay();
                    };
                    vid.onerror = function() {
                        //console.log("Video load error");
                        vidOnError();
                    };



                    if( profNum > 70 ) {
                        if (rect.left > 900) {
                            $(document).bind('mousemove', function(e){
                                $('.hoverVid').css({
                                   left:  e.pageX - 300,
                                   top:   e.pageY - 200
                                });
                            });
                        } else {
                            $(document).bind('mousemove', function(e){
                                $('.hoverVid').css({
                                   left:  e.pageX - 200,
                                   top:   e.pageY - 200
                                });
                            });
                        }

                    } else {
                        if (rect.left > 700) {
                            $(document).bind('mousemove', function(e){
                                $('.hoverVid').css({
                                   left:  e.pageX - 250,
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
                    }
                }, 500);
            }
        }, function() {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
                $(".hoverVid").remove();
                $(".profile").find('.vid').removeAttr('src');
                // $(".profile").removeClass('enlarge');
            }
        });
    }




    function gayProfs() {
        console.log('gayProfs()');
        $('.profile').each(function() {

            var gayy = $(this).attr('data-subject').indexOf("gay");

            if (gayy !== -1) {
                $(this).addClass('gayyy');
                $(this).attr('data-orientation', 'gayyy');
            }

        });
    }



    // Progress Bar Function ===========================================================
    function progressBar() {
        console.log('FUNCTION progressBar');

        $(".progress-bar").removeClass("notransition");

        $("#progressTimer").progressTimer({
            timeLimit: 181,
            warningThreshold: 20,
            baseStyle: 'progress-bar-warning',
            warningStyle: 'progress-bar-danger',
            completeStyle: 'progress-bar-info',
            onFinish: function() {
            }
        });
    }






    function runHandles() {
        console.log('runHandles()');
        var source = $('#entry-template').html();
        var template = Handlebars.compile(source);

        $("#main").append(template(users));

        $('body').prepend('<div class="progress-wrapper"><div id="progressTimer"></div><a href="http://c4.devv"><span class="home-btn"><i class="fa fa-home"></i></span></a><span class="cancel_timer">🚫</span></div>');

        gayProfs();
        hovv();
        progressBar();
    }


    function appendStructure() {
        console.log('appendStructure()');
        setTimeout(function() {
            $('#main').empty();
            runHandles();
        }, 1000);
    }

    setTimeout(function(){

        $(".profiles").each(function() {

            var item = {};

            var profURL = $(this).attr("data-profile-url");
            var m3u8 = $(this).attr("data-m3u8");
            var thumb = $(this).find('.thumbs > img').attr("src");
            var user = $(this).find('.thumbs').attr("data-room");
            var viewStats = $(this).find('.cams').text();
            var subject = $(this).find('.subject li').attr('title');

            item["profURL"] = profURL;
            item["m3u8"] = m3u8;
            item["thumb"] = thumb;
            item["user"] = user;
            item["viewStats"] = viewStats;
            item["subject"] = subject;

            myArr.push(item);
        });

        users.users = myArr;
        console.log(users);


        $('body').prepend('<div id="response-container" class="xxx"></div>');
        $('<div id="statuss_wrap" class="stathide"><div id="statuss">updated</div></div>').prependTo('body');
        $('<div class="newMain"><script id="entry-template" type="text/x-handlebars-template">{{#each users}}<div class="profile" data-pref="" data-subject="{{subject}}"><i class="fa fa-play-circle play"></i><a class="directVidLink" target="_blank" href="{{m3u8}}"><div class="thumb" style="background:url({{thumb}})" data-resolution=""><video class="vid" data-src="{{m3u8}}" autoplay muted></video></div></a><div class="userInfo"><span class="user">{{user}}</span><span class="viewers">{{viewStats}}</span></div></div>{{/each}}</script></div>').insertAfter('#statuss_wrap');


        appendStructure();

    }, 1000);




       // RELOAD PAGE AFTER TIMER ======================================================
       function reloadPageTimer() {
           window.location.replace("https://chaturbate.com/male-cams/");
       }

        var myTimer = setInterval(reloadPageTimer, 181000);






    $('<div class="cursorRest left"></div>').appendTo('body');
    $('<div class="cursorRest right"></div>').appendTo('body');

    $('#header').remove();
    $('.top-section').remove();
    $('#hashtag_ticker').remove();
    $('.footer-holder').remove();
    $('[id*="SwfStore_"]').remove();










    setTimeout(function() {
        $('.endless_page_template').addClass('beingWatched');

        var falseInput = $('.beingWatched');
        var observer = new MutationObserver(function(e) {
            window.location.replace("https://chaturbate.com/male-cams/");

            setTimeout(function() {
                observer.observe($(falseInput)[0], {characterData: true, childList: true, attributes: true});
            }, 15000);

            observer.disconnect();
        });
        observer.observe($(falseInput)[0], {characterData: true, childList: true, attributes: true});

    }, 15000);


});