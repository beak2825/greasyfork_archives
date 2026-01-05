// ==UserScript==
// @name         Cancer
// @version      0.9.9
// @description  Change Google logo to absolute cancer
// @match        *://www.google.com/*
// @namespace    https://greasyfork.org/users/41967
// @include      *://*youtube.com/*
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20402/Cancer.user.js
// @updateURL https://update.greasyfork.org/scripts/20402/Cancer.meta.js
// ==/UserScript==

(function() {
    try {
        if(window.location.href.indexOf("google.com") > -1){
            document.getElementById('lga').style.margin="0px";
            document.getElementById('hplogo').src='https://ia.nextgenclimate.org/wp-content/uploads/sites/4/2016/05/trump-blog-500x200-c-default.png';
            document.getElementById('hplogo').srcset='https://ia.nextgenclimate.org/wp-content/uploads/sites/4/2016/05/trump-blog-500x200-c-default.png';
            document.getElementById('hplogo').height='200';
            document.getElementById('hplogo').width='500';
            document.getElementById('gsr').style.backgroundImage = 'url(https://i.imgur.com/pUIxcZE.jpg)';
            document.getElementById('logo').innerHTML='<img height="41" src="https://i.imgur.com/pUIxcZE.jpg" width="167" alt="Google" onload="google.aft&amp;&amp;google.aft(this)" style="width: 95px;top: 0px;">';
            document.getElementById('hplogo').innerHTML='<img border="0" height="200" src="https://i.imgur.com/pUIxcZE.jpg" style="padding-top:1px" width="500">';
            document.getElementById('logocont').innerHTML='<img height="41" src="https://i.imgur.com/pUIxcZE.jpg" width="95" border="0">';
            var oldLocation = location.href;
        }
    }
    catch (e) {
        setInterval(function() {
            if(window.location.href.indexOf("google.com") > -1){
                document.getElementById('lga').style.margin="0px";
                document.getElementById('hplogo').src='https://ia.nextgenclimate.org/wp-content/uploads/sites/4/2016/05/trump-blog-500x200-c-default.png';
                document.getElementById('hplogo').srcset='https://ia.nextgenclimate.org/wp-content/uploads/sites/4/2016/05/trump-blog-500x200-c-default.png';
                document.getElementById('hplogo').height='200';
                document.getElementById('hplogo').width='500';
                document.getElementById('gsr').style.backgroundImage = 'url(https://i.imgur.com/pUIxcZE.jpg)';
                document.getElementById('logo').innerHTML='<img height="41" src="https://i.imgur.com/pUIxcZE.jpg" width="167" alt="Google" onload="google.aft&amp;&amp;google.aft(this)" style="width: 95px;top: 0px;">';
                document.getElementById('hplogo').innerHTML='<img border="0" height="200" src="https://i.imgur.com/pUIxcZE.jpg" style="padding-top:1px" width="500">';
                document.getElementById('logocont').innerHTML='<img height="41" src="https://i.imgur.com/pUIxcZE.jpg" width="95" border="0">';
            }
        }, 1000); // check every second
    }
})();

(function() {
    if(window.location.href.indexOf("youtube.com") > -1){
        var imgs = document.getElementsByClassName("yt-thumb-simple");
        for (var i=imgs.length; i--;) {
            imgs[i].innerHTML = '<img src="https://i.imgur.com/396C8TK.png" height="110" width="196" alt="">';
        }
    }
    var oldLocation = location.href;
    setInterval(function() {
        if(window.location.href.indexOf("youtube.com") > -1){
            var imgs = document.getElementsByClassName("yt-thumb-simple");
            for (var i=imgs.length; i--;) {
                imgs[i].innerHTML = '<img src="https://i.imgur.com/396C8TK.png" height="110" width="196" alt="">';
            }
        }
    }, 1000); // check every second
})();

(function() {
    if(window.location.href.indexOf("youtube.com") > -1){
        var imgs = document.getElementsByClassName("yt-thumb-square");
        for (var i=imgs.length; i--;) {
            imgs[i].innerHTML = '<span class="yt-thumb-clip" style="top: 0px;"><img aria-hidden="true" width="20" height="20" style="top:0px;" alt="" src="https://i.imgur.com/396C8TK.png"></span>';
            imgs[i].style.top="0px";
        }
    }
    var oldLocation = location.href;
    setInterval(function() {
        if(window.location.href.indexOf("youtube.com") > -1){
            var imgs = document.getElementsByClassName("yt-thumb-square");
            for (var i=imgs.length; i--;) {
                imgs[i].innerHTML = '<span class="yt-thumb-clip" style="top: 0px;"><img aria-hidden="true" width="20" height="20" style="top:0px;" alt="" src="https://i.imgur.com/396C8TK.png"></span>';
                imgs[i].style.top="0px";
            }
        }
    }, 1000); // check every second
})();

(function() {
    if(window.location.href.indexOf("youtube.com") > -1){
        var imgs = document.getElementsByClassName("yt-uix-simple-thumb-wrap");
        for (var i=imgs.length; i--;) {
            imgs[i].innerHTML = '<img src="https://i.imgur.com/396C8TK.png" height="110" width="196" alt="">';
        }
    }
    var oldLocation = location.href;
    setInterval(function() {
        if(window.location.href.indexOf("youtube.com") > -1){
            var imgs = document.getElementsByClassName("yt-uix-simple-thumb-wrap");
            for (var i=imgs.length; i--;) {
                imgs[i].innerHTML = '<img src="https://i.imgur.com/396C8TK.png" height="110" width="196" alt="">';
            }
        }
    }, 1000); // check every second
})();

(function() {
    try {
        if(window.location.href.indexOf("youtube.com") > -1) {
            document.getElementById('page').style.background= '#F6F';
            var oldLocation = location.href;
        }
    }
    catch (e) {
        setInterval(function() {
            if(window.location.href.indexOf("youtube.com") > -1) {
                document.getElementById('page').style.background= '#F6F';
            }
        }, 1000); // check every second
    }
})();

(function() {
    try {
        if(window.location.href.indexOf("google.com") > -1) {
            document.getElementById('center_col').style.background= 'rgba(230,230,230,0.7)';
            var oldLocation = location.href;
        }
    }
    catch (e) {
        setInterval(function() {
            if(window.location.href.indexOf("google.com") > -1) {
                document.getElementById('center_col').style.background= 'rgba(230,230,230,0.7)';
            }
        }, 1000); // check every second
    }
})();

//UPDATE BUTTON//
(function() {
    if(window.location.href.indexOf("google.com") > -1) {
        document.getElementById('gbqfbb').id="upbtn";
        document.getElementById('upbtn').value="Update Cancer";
        document.getElementById("upbtn").addEventListener("click", function(){
            var win = window.open('https://greasyfork.org/scripts/20402-mlp/code/MLP.user.js', '_blank');
            win.focus();
        });
    }
})();