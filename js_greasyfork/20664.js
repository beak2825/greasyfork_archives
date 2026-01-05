// ==UserScript==
// @name         EarthBound
// @version      0.3
// @description  Carl's theme
// @match        *://www.google.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/41967
// @downloadURL https://update.greasyfork.org/scripts/20664/EarthBound.user.js
// @updateURL https://update.greasyfork.org/scripts/20664/EarthBound.meta.js
// ==/UserScript==

(function() {
    try {
        if(window.location.href.indexOf("google.com") > -1){
            document.getElementById('lga').style.margin="0px";
            document.getElementById('hplogo').src='https://i.imgur.com/ut1lfxw.png';
            document.getElementById('hplogo').srcset='https://i.imgur.com/ut1lfxw.png';
            document.getElementById('hplogo').height='200';
            document.getElementById('hplogo').width='500';
            document.getElementById('gsr').style.background = '#180038';
            var asd = $("div[class*='gb_db gb_tf gb_R gb_sf gb_wf gb_T']");
            $(asd[0]).css("background","rgba(230,230,230,0.4)");
            document.getElementById('logo').innerHTML='<img height="41" src="https://i.imgur.com/ut1lfxw.png" width="167" alt="Google" onload="google.aft&amp;&amp;google.aft(this)" style="width: 95px;top: 0px;">';
            document.getElementById('hplogo').innerHTML='<img border="0" height="200" src="https://i.imgur.com/ut1lfxw.png" style="padding-top:1px" width="500">';
            document.getElementById('logocont').innerHTML='<img height="41" src="https://i.imgur.com/ut1lfxw.png" width="95" border="0">';
        }
    }
    catch (e) {
        setInterval(function() {
            if(window.location.href.indexOf("google.com") > -1){
                document.getElementById('hplogo').src='https://i.imgur.com/ut1lfxw.png';
                document.getElementById('hplogo').srcset='https://i.imgur.com/ut1lfxw.png';
                document.getElementById('hplogo').height='200';
                document.getElementById('hplogo').width='500';
                var asd = $("div[class*='gb_db gb_tf gb_R gb_sf gb_wf gb_T']");
                $(asd[0]).css("background","rgba(230,230,230,0.4)");
                document.getElementById('logo').innerHTML='<img height="41" src="https://i.imgur.com/ut1lfxw.png" width="167" alt="Google" onload="google.aft&amp;&amp;google.aft(this)" style="width: 95px;top: 0px;">';
                document.getElementById('hplogo').innerHTML='<img border="0" height="200" src="https://i.imgur.com/ut1lfxw.png" style="padding-top:1px" width="500">';
                document.getElementById('logocont').innerHTML='<img height="41" src="https://i.imgur.com/ut1lfxw.png" width="95" border="0">';
            }
        }, 1000); // check every second
    }
})();

(function() {
    $( "body" ).append( '<audio loop="loop" autoplay="autoplay"><source src="https://starmen.net/mother2/music/007-%20Earthbound%20-%20Your%20Name,%20Please.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>' );
})();

(function() {
    setInterval(function() {
        if(window.location.href.indexOf("google.com") > -1) {
            try{document.getElementById('center_col').style.background= 'rgba(230,230,230,0.7)';}catch(e){}
        }
    }, 1000); // check every second
})();