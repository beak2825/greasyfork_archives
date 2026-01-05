// ==UserScript==
// @name 	     JSBTV
// @description	 this script will automatically fetch and go to the next video after the meter goes up. 
// @version      0.34
// @include	     http://www.swagbucks.com/watch*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant none
// @namespace https://greasyfork.org/users/25633
// @downloadURL https://update.greasyfork.org/scripts/17842/JSBTV.user.js
// @updateURL https://update.greasyfork.org/scripts/17842/JSBTV.meta.js
// ==/UserScript==

loadjscssfile('http://flipclockjs.com/_themes/flipclockjs/js/flipclock/flipclock.js','js');
loadjscssfile('http://flipclockjs.com/_themes/flipclockjs/css/flipclock.css','css');


$('#sbFooterWrap').hide();
$('#sbWatchPlaylistHeaderInnerContainer').hide();
$('#sbMainNavSectionQuickLinks').hide();
$('#sbMainNavSectionSocialize').hide();
$('#mainNavMainList').hide();
$('#promoButtonContainer').hide();

$(document).ready(function() {
    if ( typeof getWatchedVideoCount == 'function' ){
        nextJSBVideo();
    } else {
        nextJSBPlaylist();
    }
});

function nextJSBVideo(){

    $('#commentsCont').hide();
    $('#watchAdBanner').hide();

    $('#sbWatchPlaylistDetailDesc').css('zoom', 0.6);
    $('#sbWatchPlaylistDetailDesc').css('MozTransform', 'scale(0.6)');

    clock = $('#sbWatchPlaylistDetailDesc').FlipClock(0, {
        clockFace: 'Counter'
    });

    setTimeout(function() {
        setInterval(function() {
            clock.increment();
        }, 1000);
    });

    var jwatchcount = 0;
    var jtextw = document.getElementById("watchVideosEarn").innerHTML;
    var jsbPlayTime = Math.floor( (Math.random() * 15) + 20) * 1000;
    var jvidcount = 0;

    setInterval(function(){
        jwatchcount = jwatchcount + 1;

        //change category if going to fast message appears
        if (jwatchcount == 6){
            /*if ($('#watchPlaylistHide').length == 1){ 
                $('#sbWatchPlaylistVideoHeading').css("background-color","red");
            }*/
            top.location.href = nextCate();
        }

        if (jtextw == document.getElementById("watchVideosEarn").innerHTML) {
            $('#sbWatchPlaylistVideoHeading').css("background-color","yellow");
        } else {
            $('#sbWatchPlaylistVideoHeading').css("background-color","green");

            //too fast counter measure
            jvidcount = jvidcount + 1;
            if (jvidcount == 3) {
                jvidcount = 0;
                top.location.href = nextCate();
            }

            jtextw = document.getElementById("watchVideosEarn").innerHTML;

            if ($('.sbPlaylistVideo')[0] != null){
                switchToVideoAndDisableLink($('.sbPlaylistVideo')[ getWatchedVideoCount() ]);
            }
            clock.setTime(0);
            jwatchcount = 0;
        }
        if ($('.sbPlaylistVideo').length==getWatchedVideoCount()  ) {
            $('#sbWatchPlaylistVideoHeading').css("background-color","blue");
            top.location.href = nextCate();
        }
    },jsbPlayTime);

}

function nextJSBPlaylist(){
    $('#sbStreamType').css('zoom', 0.6);
    $('#sbStreamType').css('MozTransform', 'scale(0.6)');
    $('html, body').animate({scrollTop: $('#middle').height() }, 800);
    $('html, body').animate({scrollTop: '0px'}, 800);
    $('#sbStreamType').css("background-color","yellow");

    var jsbTime = Math.floor( (Math.random() * 5) + 5) * 1000;

    /*clock = $('#sbStreamType').FlipClock(jsbTime/1000, {
        clockFace: 'MinuteCounter',
        countdown: true,
    }); 

    if (  Math.floor( (Math.random() * 10) + 1) == 1 ) {
        $('#sbStreamType').css("background-color","red");
        jsbTime = Math.floor( (Math.random() * 180) + 120) * 1000;
        clock.setTime(jsbTime/1000);
    }*/

    var jsbPlayList = setInterval(function(){
        var rdmoffsetv = 0 + Math.floor( (Math.random() * 3) + 0);

        if (document.getElementsByClassName('selected')[0].getAttribute('id')[0] != null &&
            $('header.watchItemHeader:not(:has(div.playlistWasWatched))')[rdmoffsetv] == null){

            $('#sbStreamType').css("background-color","green");

            top.location.href = nextCate();

        } else {
            $('header.watchItemHeader:not(:has(div.playlistWasWatched))')[rdmoffsetv].click();
        }
    }, jsbTime );
}

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

function nextCate(){
    var ojbArrCat = $('#mainNavCategoriesList > li > a');
    var selCat = ojbArrCat[Math.floor(Math.random() * ojbArrCat.length)];
   
    console.log('Changing category to ',selCat.href); 
    return selCat.href; 
}