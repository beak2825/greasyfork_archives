// ==UserScript==
// @name        Mangaupdates - Custom releases page
// @version     3.0
// @description Splits releases page into to areas. One for Novels and one for Mangas. Also adds menu bar that allows to hide novels,mangas and oneshots.
// @namespace   https://greasyfork.org/en/scripts/10937-mangaupdates-custom-releases-page
// @include     https://www.mangaupdates.com/releases.html*
// @include     http://www.mangaupdates.com/releases.html*
// @copyright   2015+, MiPo91
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/10937/Mangaupdates%20-%20Custom%20releases%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/10937/Mangaupdates%20-%20Custom%20releases%20page.meta.js
// ==/UserScript==

$( document ).ready(function() {

    var showNovels = true;
    var showMangas = true;
    var showOneShots = true;

    if(document.cookie.indexOf('novels') >= 0) {
        showNovels = false;
    }

    if(document.cookie.indexOf('mangas') >= 0) {
        showMangas = false;
    }

    if(document.cookie.indexOf('oneshot') >= 0) {
        showOneShots = false;
    }


    /*
    ** Releases section
    */

    var releases = [];
    $("#main_content div.p-2 div div.p-1 .col-6").each(function () {
        var bgcolor = $(this).css("background-color");
        bgcolor = (bgcolor == 'rgb(240, 243, 247)') ? '#F0F3F7' : (bgcolor == 'rgba(0, 0, 0, 0)') ? '#e4e7eb' : bgcolor;

        var release = new Object;
        release.title = $(this).text();
        release.group = $(this).next().next().text();
        release.release = $(this).next().text();
        release.link_group = $(this).next().next().children().attr('href');
        release.link_manga = $(this).children().last().attr('href');
        release.date = $(this).parent().parent().prev().text();
        release.bgcolor = bgcolor;
        release.icon = $(this).find('img').attr('src');
        release.readingstate = $(this).find('img').parent().attr('title');
        
        if (~release.title.indexOf('Novel')) release.type = 'Novel';
        else if (~release.title.indexOf('Oneshot')) release.type = 'Oneshot';
        else release.type = 'Manga';

        if (release.title !== 'Title') releases.push(release);

    });

    var releaseArea = $("#main_content div.p-2 div div:first");
    releaseArea.siblings().remove();

    var customAreasHtml = '';
    if (showNovels) customAreasHtml += '<div class="custom_novels"></div>';
    if (showMangas) customAreasHtml += '<div class="custom_mangas"></div>';

    releaseArea.parent().append(customAreasHtml);

    $(releases).each(function() {
        var dateGroupHtml = '<div class="custom_releasegroup"><div class="custom_releasegrouptitle">' + this.type + ' :'+this.date+'</div></div>';
        var newElm = document.createElement('ul');
        newElm.className = 'custom_release';
        newElm.style = 'background-color:'+this.bgcolor;
        newElm.innerHTML += '<li>'+((this.icon !== undefined) ? '<img src="'+this.icon+'" title="'+this.readingstate+'"/>' : '') + '<a href="' + this.link_manga+ '">' + this.title + '</a></li>';
        newElm.innerHTML += '<li>' + this.release + '</li>';
        newElm.innerHTML += '<li><a href="' + this.link_group + '">' + this.group + '</a></li>';

        switch(this.type) {
            case 'Novel':
                if (showNovels) {
                    if ($('.custom_novels').text().indexOf(this.date) == -1) $('.custom_novels').append(dateGroupHtml);
                    $('.custom_novels .custom_releasegroup:last').append(newElm);
                }
                break;
            case 'Oneshot':
                if (showOneShots) {
                    if ($('.custom_mangas').text().indexOf(this.date) == -1) $('.custom_mangas').append(dateGroupHtml);
                    $('.custom_mangas .custom_releasegroup:last').append(newElm);
                }
                break;
            default:
                if (showMangas) {
                    if ($('.custom_mangas').text().indexOf(this.date) == -1) $('.custom_mangas').append(dateGroupHtml);
                    $('.custom_mangas .custom_releasegroup:last').append(newElm);
                }
                break;
        }
    });

    $('.custom_novels, .custom_mangas').css({width:'45%', float:'left', margin: '5px 5px 0 0'});
    $('.custom_novels').css({width: document.cookie.indexOf('mangas') >=0 && document.cookie.indexOf('oneshot') >= 0 ? '100%' : '49%' });
    $('.custom_mangas').css({width: document.cookie.indexOf('novels') >=0 ? '100%' : '49%'});
    $('.custom_novels .custom_releasegroup, .custom_mangas .custom_releasegroup').css({border:'1px solid #ccc', margin:'0 0 10px 0'});
    $('.custom_novels ul, .custom_mangas ul').css({'list-style':'none', 'margin':'0'});
    $('.custom_novels ul li, .custom_mangas ul li').css({width:'33%', 'display':'inline-block'});
    $('.custom_releasegrouptitle').css({background:'#d1d1d1', padding:'5px'});

    /*
    ** Menu section
    */
    var valikko = '<div id="valikko" style="margin:10px 0 10px 0;">Options: <span id="oneshot" style="background:#d1d1d1;padding:3px;color:#fff;cursor:pointer;margin:0 3px;">Oneshots: '+(document.cookie.indexOf('oneshot') >=0 ? '<i style="color:#ff0000;">Hidden</i>' : '<i style="color:#00ff00;">Visible</i>')+'</span><span id="novels" style="background:#d1d1d1;padding:3px;color:#fff;cursor:pointer;margin:0 3px;">Novels: '+(document.cookie.indexOf('novels') >=0 ? '<i style="color:#ff0000;">Hidden</i>' : '<i style="color:#00ff00;">Visible</i>')+'</span><span id="mangas" style="background:#d1d1d1;padding:3px;color:#fff;cursor:pointer;margin:0 3px;">Mangas: '+(document.cookie.indexOf('mangas') >=0 ? '<i style="color:#ff0000;">Hidden</i>' : '<i style="color:#00ff00;">Visible</i>')+'</span><span id="hoverShow" style="background:#d1d1d1;padding:3px;color:#fff;cursor:pointer;margin:0 3px;">Hover: '+(document.cookie.indexOf('hoverShow') >=0 ? '<i style="color:#ff0000;">Hidden</i>' : '<i style="color:#00ff00;">Visible</i>')+'</span></div>';
    var info = '<div id="info" style="margin-bottom:30px;font-size:10px;"><i>- Click options from above to hide/show content of your choice</i></div>';

    $('#main_content div.p-2 div div:first').after(valikko);
    $('#valikko').after(info);

    $("#valikko span").click(function(e){
        var cookie_nimi = $(this).closest('span').attr('id');

        if(document.cookie.indexOf(cookie_nimi) >= 0) {
            document.cookie = cookie_nimi + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        else {
           document.cookie = cookie_nimi + '=;expires=Thu, 01 Jan '+ (new Date().getFullYear() + 1) +' 00:00:01 GMT;';
        }

        location.reload();
    });

    /*
    ** Hover section
    */
    if(document.cookie.indexOf('hoverShow') < 0) {
        hoverStuff();
        var kuvanHaku;
        function hoverStuff() {
            $("#main_content").append("<div id=\"seriesHover\"></div>");

            $(".custom_release").mouseenter(function(e){
                e.stopPropagation();

                var linkki = $(this).children().children('a').first();
                if (linkki.attr('href').length != 30) {
                    if(kuvanHaku && kuvanHaku.abort) kuvanHaku.abort();

                    var parentOffset = $(this).position();
                    var parentWidth = $(this).width();

                    var relX = parentOffset.left;
                    var relY = parentOffset.top + $(this).outerHeight(true);

                    var elementti = this;
                    var kuvaDivi = $(this).find('.hoverInfo');

                    if(typeof kuvaDivi.html() == 'undefined') {
                        kuvanHaku = $.ajax({
                            url: linkki.attr('href'),
                            type: 'GET',
                            beforeSend: function() {
                                $("#seriesHover").html('<div style="padding:0 5px;">Loading image...</div>');
                            },
                            success: function(data) {
                                var kuva = $(data).find('#main_content .img-fluid').attr('src');
                                var genretTeksti = '';
                                var genretPath =  $(data).find('.col-6:last .sContent:eq(1) a');
                                var author =  $(data).find('.col-6:last .sContent:eq(5)').text().split('[Add]');
                                author = author.join();
                                author = author.replace(/\s/g, '');

                                var artist =  $(data).find('.col-6:last .sContent:eq(6)').text().split('[Add]');
                                artist = artist.join();
                                artist = artist.replace(/\s/g, '');

                                var year =  $(data).find('.col-6:last .sContent:eq(7)').text();
                                var rating =  $(data).find('.col-6:first .sContent:eq(11)').text().split(".0")[0].substr(9);

                                var genret = genretPath.each(function(index){
                                    if(index == genretPath.length - 2) {
                                        genretTeksti += $(this).text();
                                    }
                                    else if(index != genretPath.length - 1) {
                                        genretTeksti += $(this).text() +', ';
                                    }
                                });

                                if(typeof kuva != 'undefined') {
                                    kuva = '<div class="kuva"><img src="'+kuva+'" width="121px"/></div>';
                                } else {
                                    kuva = '<div class="kuva" style="padding:5px 5px;">No image has been found.</div>';
                                }

                                $(elementti).append('<div class="hoverInfo" style="display: none;">'+kuva+'<div class="genret">'+genretTeksti+'</div><div class="muut"><div>Year: '+year+'</div><div>Rating: '+rating+'</div><div>Author: '+author+'</div><div>Artist: '+artist+'</div></div></div>');
                                $("#seriesHover").html('<div class="kuva">'+kuva+'</div><div class="genret">'+genretTeksti+'</div><div class="muut"><div>Year: '+year+'</div><div>Rating: '+rating+'</div><div>Author: '+author+'</div><div>Artist: '+artist+'</div></div>');

                                $(".kuva, .genret").css({float:"left", display:"inline-block"});
                                $(".genret").css({width:(parentWidth-131),padding:"0 5px"});
                                $(".muut").css({width:(parentWidth-131),padding:"5px 5px",float:"left"});

                                $(linkki).css({color:"#282828"});
                            }
                        });
                    } else {
                        $("#seriesHover").html("<div>"+kuvaDivi.html()+"</div>");
                    }


                    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

                    if($(this).offset().top + 200 > ($(window).height() + $(window).scrollTop()) && isFirefox) {
                        $("#seriesHover").css({position:"absolute", left:relX,top:(relY-($('#seriesHover').height() + $(elementti).height())),background:"#ccc",width:parentWidth,opacity:0.9});
                    } else {
                        $("#seriesHover").css({position:"absolute", left:relX,top:relY,background:"#ccc",width:parentWidth,opacity:0.9});
                    }


                    $(".kuva, .genret").css({float:"left", display:"inline-block"});
                    $(".genret").css({width:(parentWidth-131),padding:"0 5px"});
                    $("#seriesHover").show();
                }

            });

            $(".custom_release").mouseleave(function(e){
                e.stopPropagation();
                $("#seriesHover").html("");
                $("#seriesHover").hide();
            });
        }
    }
});