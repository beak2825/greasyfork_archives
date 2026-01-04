// ==UserScript==
// @name           Chaturbate | JSON-XX
// @version            5.5
// @namespace      chaturbate-json
// @description    chaturbate JSON convert
// @include        https://m.chaturbate.com/*
// @include        https://chaturbate.com/male-cams/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.6/handlebars.min.js
// @grant          GM_xmlhttpRequest
// @icon               https://www.google.com/s2/favicons?domain=chaturbate.com
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/420370/Chaturbate%20%7C%20JSON-XX.user.js
// @updateURL https://update.greasyfork.org/scripts/420370/Chaturbate%20%7C%20JSON-XX.meta.js
// ==/UserScript==

$(function(){

    console.log('=============||||| RUNNING CHATURBATE JSON-X |||||==============');




    $('#close_entrance_terms').click();

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('*{box-sizing: border-box !important;}body {box-sizing: border-box !important; padding: 0; margin: 0;}@media(max-width:900px) and (min-width:414px) and (orientation:landscape){ .profile{width: 32.5% !important;} } #header-links {display:none !important;} .pushmenu {display:none !important;}.playing .vid{visibility: visible !important;opacity: 1 !important;}.dynamic-header #mmnav{display:none !important;}.dynamic-header .nav_list{display:none !important;}');



    $('.pushmenu-push').append('<div class="reloadBtn" style="background-size: 100%;height: 30px;width: 30px;position: absolute;left: 8px;top: 8px;cursor: pointer;background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9ImktcmVsb2FkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjksMTZjMCw2LTUsMTMtMTMsMTNTMywyMiwzLDE2UzgsMywxNiwzYzUsMCw5LDMsMTEsNiBNMjAsMTBsNy0xbDEtNyIvPgo8L3N2Zz4K);background-repeat: no-repeat;">');
    $('.dynamic-header').append('<div class="reloadBtn" style="background-size: 100%;height: 30px;width: 30px;position: absolute;left: 8px;top: 8px;cursor: pointer;background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9ImktcmVsb2FkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjksMTZjMCw2LTUsMTMtMTMsMTNTMywyMiwzLDE2UzgsMywxNiwzYzUsMCw5LDMsMTEsNiBNMjAsMTBsNy0xbDEtNyIvPgo8L3N2Zz4K);background-repeat: no-repeat;">');




    function windowReszr() {
        console.log('===== INITIAL WINDOW RESR =====');

        var height = $(window).height();
        var width = $(window).width();
        if (height > width) {
            $('.profile').attr('style', 'width: 48.5%;display: inline-block;float: left;position: relative;transition: transform .2s ease-out;background: #fff;min-height: 225px;overflow: hidden;margin: 2px;border: 2px solid #ccc;max-height: 225px !important;');
        }
        if (height < width) {
            $('.profile').attr('style', 'width: 32.5% !important;display: inline-block;float: left;position: relative;transition: transform .2s ease-out;background: #fff;min-height: 225px;overflow: hidden;margin: 2px;border: 2px solid #ccc;max-height: 225px !important;');
        }
    }






    $('.reloadBtn').click(function() {
        console.log('reloadBtn Clicked.');

        $('.profile').each(function() {
            var $this = $(this);

            var origURL = $(this).attr('data-origurl');

            $.get(origURL, function(response) {
                console.log('$.get()');
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

                hlsURL = hlsURL.match(/(^.*)(?=\?)/g, /$&/);

                //console.log(hlsURL[0]);

                $this.attr('data-m3u8', hlsURL[0]);
                $this.find('.vid').attr('data-src', hlsURL[0]);

            });
        });
    });















    function hovv() {
        console.log('hovv() running');

        $(".profile").each(function() {

            var m3u8URL = $(this).attr('data-m3u8');

            if( m3u8URL.length > -1 ) {
                //$(this).prepend('<div class="copyVidURL" style="z-index: 10;background-size: 100%;height: 20px;width: 20px;position: absolute;right: 8px;top: 8px;opacity: .7;cursor: pointer;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCgkgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0NDggNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NDggNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjtzdHJva2U6Izc1NzU3NTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMDguNCw0MjQuOHYzNS4yYzAsMTEuNy05LjQsMjEuMS0yMS4xLDIxLjFINDguMmMtMTEuNywwLTIxLjEtOS40LTIxLjEtMjEuMVYxMzYuNWMwLTExLjcsOS40LTIxLjEsMjEuMS0yMS4xCgloNjMuM3YyNjAuMmMwLDI3LjIsMjIuMSw0OS4yLDQ5LjIsNDkuMkgzMDguNHogTTMwOC40LDEyMi40VjMxSDE2MC43Yy0xMS43LDAtMjEuMSw5LjQtMjEuMSwyMS4xdjMyMy40YzAsMTEuNyw5LjQsMjEuMSwyMS4xLDIxLjEKCWgyMzkuMWMxMS43LDAsMjEuMS05LjQsMjEuMS0yMS4xdi0yMzJoLTkxLjRDMzE3LjksMTQzLjUsMzA4LjQsMTM0LDMwOC40LDEyMi40eiBNNDE0LjcsOTUuMmwtNTgtNThjLTQtNC05LjMtNi4yLTE0LjktNi4yaC01LjMKCXY4NC40aDg0LjRWMTEwQzQyMC45LDEwNC41LDQxOC43LDk5LjEsNDE0LjcsOTUuMnoiLz4KPC9zdmc+Cg==);background-repeat: no-repeat;">');
                $(this).prepend('<div class="copyVidURL" style="z-index: 10;height: 25px;position: absolute;right: 8px;top: 8px;opacity: .7;cursor: pointer;"><svg class="svg" viewbox="0 0 488 512" height="25"><path class="path" fill="#fff" stroke="#454545" stroke-width="8" d="M308.4,424.8v35.2c0,11.7-9.4,21.1-21.1,21.1H48.2c-11.7,0-21.1-9.4-21.1-21.1V136.5c0-11.7,9.4-21.1,21.1-21.1 h63.3v260.2c0,27.2,22.1,49.2,49.2,49.2H308.4z M308.4,122.4V31H160.7c-11.7,0-21.1,9.4-21.1,21.1v323.4c0,11.7,9.4,21.1,21.1,21.1 h239.1c11.7,0,21.1-9.4,21.1-21.1v-232h-91.4C317.9,143.5,308.4,134,308.4,122.4z M414.7,95.2l-58-58c-4-4-9.3-6.2-14.9-6.2h-5.3 v84.4h84.4V110C420.9,104.5,418.7,99.1,414.7,95.2z" style="stroke-dasharray: 1300;stroke-dashoffset: 1300;"></path></svg></div>');
            }

        });



        $('.thumb').click(function() {
            console.log('thumb clicked');

            var $this = $(this).parents('.profile');

            if( $this.hasClass('playing') ) {
                $this.removeClass('playing');
                $this.find('.vidSource').remove();
                $this.find('.vid').removeAttr('src');
                $this.find('.vid').hide();
            } else {
                $this.addClass('playing');
                $this.find('.vid').show();

                var hlsURL = $this.find('.vid').attr("data-src");
                $this.find('.vid').append('<source class="vidSource" src="'+hlsURL+'" type="video/mp4">');
                $this.find('.vid').attr('src', hlsURL);

                $this.find('.vid')[0].play();
            }
        });




        $('.profileURL').click(function() {
            console.log('profileURL Clicked.');

            setTimeout(function(){
                $('.profile').removeClass('playing');
                $('source').remove();
                $('.vid').removeAttr('src');
                $('.vid').hide();
            }, 1000);

            var bounsrVidURL = $(this).attr('data-href');
            window.open(bounsrVidURL);

        });





        function copyToClipboard(str) {
            console.log('copyToClipboard() running');
            var el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            setTimeout(function(){
                $('.profile').removeClass('playing');
                $('source').remove();
                $('.vid').removeAttr('src');
                $('.vid').hide();
            }, 1000);

            setTimeout(function(){
                $('.path').attr('fill', "#ffffff");
            }, 1800);

        };

        $('.path').click(function() {
            console.log('path clicked');

            var str = $(this).parents('.profile').find('.vid').attr('data-src');
            copyToClipboard(str);

            $(this).attr('fill', "rgb(197, 244, 107, .8)");
        });



        windowReszr();
    }





    // GAY FILTER FUNCTIONS ===================================================
    var all_profiles;

    function gayFilter() {
        console.log('gayFilter()');

        all_profiles = $('.noHomo');

        var gay = $('.gayyy');

        $('body').append(gay);
        $('body').append(all_profiles);

        gay = null;




        var profileCount = 1;

        $(".profile").each(function() {
            $(this).attr('data-profCount', profileCount);
            profileCount++;
        });



        hovv();
    }












    var users = {};
    var myArr = [];






    function gayProfs() {
        console.log('gayProfs()');
        $('.profile').each(function() {

            var $this = $(this);

            var gayy = $(this).attr('data-subject').indexOf("gay");

            if (gayy !== -1) {
                $(this).addClass('gayyy');
                $(this).attr('data-orientation', 'gayyy');
                $(this).css("border-color", "purple");
            } else {
                $(this).addClass('noHomo');
            }


            $( $this.find('.subject a') ).each(function() {
                var gayySUB = $(this).text().indexOf("gay");

                if (gayySUB !== -1) {
                    $this.addClass('gayyy');
                    $this.attr('data-orientation', 'gayyy');
                }
            });

        });

        gayFilter();
    }






    function runHandles() {
        console.log('runHandles()');

        var source = $('#entry-template').html();
        var template = Handlebars.compile(source);

        $("#main").append(template(users));

        gayProfs();
    }


    function appendStructure() {
        console.log('appendStructure()');

        $('body').attr('style', 'width: 100vw !important;max-width: 100vw !important;overflow: hidden !important;box-sizing: border-box;');
        $('#main').attr('style', 'width: 100vw !important;max-width: 100vw !important;overflow: hidden !important;');
        $('#main').empty();
        $('#main').empty();

        setTimeout(function(){
            runHandles();
        }, 800);
    }





    function buildProfileArrays() {
        console.log("BUILDING PROFILE ARRAYS");

            $('#broadcasters li').each(function() {

                var item = {};

                var originalProfURL = $(this).attr('data-origProfURL');
                var m3u8 = $(this).attr("data-m3u8");
                var thumb = $(this).find('.broadcaster-img').attr("src");
                var user = $(this).find('.username a').text();
                var viewStats = $(this).find('.time-viewers-inner').text();
                var subject = $(this).find('.subject').text();

                item["originalProfURL"] = originalProfURL;
                item["m3u8"] = m3u8;
                item["thumb"] = thumb;
                item["user"] = user;
                item["viewStats"] = viewStats;
                item["subject"] = subject;

                myArr.push(item);
            });

            users.users = myArr;


            $('<div class="newMain" style="visibility:hidden;"><script id="entry-template" type="text/x-handlebars-template"><style>@media(max-width:900px) and (min-width:414px) and (orientation:landscape){.profile{width: 32.5% !important;}}#header-links{display: none !important;}.pushmenu{display: none !important;}</style>{{#each users}}<div class="profile" style="width:48.5%;display:inline-block;float:left;position:relative;transition:transform .2s ease-out;background:#fff;min-height:225px;overflow:hidden;margin:2px;border:2px solid #ccc;max-height:225px!important;" data-origURL="{{originalProfURL}}" data-m3u8="{{m3u8}}" data-subject="{{subject}}"><div class="thumb" style="background:url({{thumb}});width:100%;height:225px;max-height:225px;position:relative;display:inline-block;background-repeat:no-repeat!important;background-position:center center!important;" data-resolution=""><video class="vid" data-src="{{m3u8}}" autoplay muted style="width:100%;height:100%;max-height:225px;opacity:0;transition:.8s ease all;background:rgba(0,0,0,.5);border:2px solid transparent;visibility:hidden;"></video></div><div class="userInfo" style="width:100%;position:relative;display:inline-block;padding:0 6px 0;box-sizing:border-box;top:-4px;"><a class="profileURL" target="_blank" data-href="{{originalProfURL}}" style="position:relative;display: block;overflow:hidden;"><span class="user" style="float:left;font-size:10px;">{{user}}</span><span class="viewers" style="float:right;font-size:10px;">{{viewStats}}</span></a></div></div>{{/each}}</script></div>').prependTo('body');



            setTimeout(function(){
                appendStructure();
            }, 1000);
            
    }







    function updateDirectURL() {
        console.log("updateDirectURL ===================");


        $('#broadcasters li').each(function() {
            var $this = $(this);

            var profHref = $(this).find(".broadcaster-cell").attr('href');
            var newProfLink = 'https://m.chaturbate.com'+profHref;
            var origProfLink = 'https://chaturbate.com'+profHref;
            $(this).attr('href', newProfLink).attr('data-origProfURL', newProfLink);

            $.get(newProfLink, function(response) {
                console.log('$.get()');
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

                hlsURL = hlsURL.match(/(^.*)(?=\?)/g, /$&/);

                //console.log(hlsURL[0]);

                $this.attr('data-m3u8', hlsURL[0]);
                $this.find(".broadcaster-cell").attr('href', hlsURL[0]);

                $this.find('.icon_not_following').remove();
            });
        });
        setTimeout(function(){
            buildProfileArrays();
        }, 1200);
    }
    updateDirectURL();
















    $('#header').remove();
    $('.top-section').remove();
    $('#hashtag_ticker').remove();
    $('.footer-holder').remove();
    $('[id*="SwfStore_"]').remove();

    $('.icon_update_following').remove();
    $('#mmnav').remove();
    $('.nav_list').remove();
    $('.dynamic-header #mmnav').remove();
    $('.dynamic-header .nav_list').remove();

    $('.push-overlay').remove();
    $('.pushmenu').remove();
    $('#userUpdatesMenuDropdownRoot').remove();




    setTimeout(function() {

        $('body > script').each(function() {
            var $this = $(this);

            $this.attr('src','xyz');

            var scriptURL = $this.attr('src');
            var scriptIdx = scriptURL.indexOf("cachebust");

            if (scriptIdx == -1) {
                $(this).remove();
            }
        })

    }, 800);






// WINDOW RESIZING FUNCTION ===========================================================================







    $(window).resize(function () {
        console.log('===== WINDOW RESR =====');
        var height = $(window).height();
        var width = $(window).width();
        if (height > width) {
            $('.profile').attr('style', 'width: 48.5%;display: inline-block;float: left;position: relative;transition: transform .2s ease-out;background: #fff;min-height: 225px;overflow: hidden;margin: 2px;border: 2px solid #ccc;max-height: 225px !important;');
        }
        if (height < width) {
            $('.profile').attr('style', 'width: 32.5% !important;display: inline-block;float: left;position: relative;transition: transform .2s ease-out;background: #fff;min-height: 225px;overflow: hidden;margin: 2px;border: 2px solid #ccc;max-height: 225px !important;');
        }
    });






     $(document).click(function(event) {
        console.log( $(event.target) );
    });


});


