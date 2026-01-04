// ==UserScript==
// @name         teszt - Supreme7
// @namespace    http://tampermonkey.net/
// @version      0.99
// @description  try to take over the world!
// @author       You
// @include      *prohardver.hu*
// @require     https://cdnjs.cloudflare.com/ajax/libs/slideout/1.0.1/slideout.min.js
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/390431/teszt%20-%20Supreme7.user.js
// @updateURL https://update.greasyfork.org/scripts/390431/teszt%20-%20Supreme7.meta.js
// ==/UserScript==

(function($) {
    'use strict';


    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
body {
width: 100%;
height: 100%;
}

.slideout-menu {
padding-left: 5px;
-webkit-box-shadow: -7px 0px 19px -10px rgba(0,0,0,0.75);
-moz-box-shadow: -7px 0px 19px -10px rgba(0,0,0,0.75);
box-shadow: -7px 0px 19px -10px rgba(0,0,0,0.75);
position: fixed;
top: 0;
bottom: 0;
width: 256px;
min-height: 100vh;
overflow-y: scroll;
-webkit-overflow-scrolling: touch;
z-index: 10002;
display: none;
background: #444;
}

.slideout-menu-left {
left: 0;
}

.slideout-menu-right {
right: 0;
}

.slideout-panel {
position: relative;
z-index: 1;
will-change: transform;
background-color: transparent; /* A background-color is required */
min-height: 100vh;
}

.slideout-open,
.slideout-open body,
.slideout-open .slideout-panel {
overflow: hidden;
}

.slideout-open .slideout-menu {
display: block;
}
#drag-target {
height: 100%;
width: 40px;
position: fixed;
right: 0;
top: 0;
z-index: 10001;
}

#overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: #000;
filter:alpha(opacity=50);
-moz-opacity:0.5;
-khtml-opacity: 0.5;
opacity: 0.5;
z-index: 10000;
}
`);


    $( "body" ).append( "<div id='drag-target'></div>" );
    $("#header-sticky").prepend("<button class='toggle-button'>☰</button>")

    var userFace = $("span.user-face:first").find("img:first").attr("src");
    userFace = userFace.replace("/small/", "/");
    var userUrl = $(".user-dropdown-menu:first").find("a:first").attr("href");
    var userName = $(".user-dropdown-menu:first").find("a:first").text();


    $("body").prepend('<div id="menu"></div>');


    var userThreadListFav = $('.user-thread-list-fav:first').clone();
    var userThreadListLMS = $('.user-thread-list-lms:first').clone();

        $('#menu').append('<div class="card card-forum"><div class="text-center"><img src="'+userFace+'"><p><b><a href="'+userUrl+'">'+userName+'</a></b></p></div></div>');
        $('#menu').append(userThreadListFav);
        $('#menu').append(userThreadListLMS);

    var overlay = jQuery('<div id="overlay"> </div>');

    var slideout = new Slideout({
        'panel': document.getElementById('drag-target'),
        'menu': document.getElementById('menu'),
        'padding': 256,
        'tolerance': 0,
        'side': 'right'

    });

      // Toggle button
      document.querySelector('.toggle-button').addEventListener('click', function() {
        slideout.toggle();
      });

    function close(eve) {
        eve.preventDefault();
        slideout.close();
    }

    slideout
        .on('beforeopen', function() {
        overlay.appendTo(document.body);
        document.getElementById('overlay').classList.add('panel-open');


    })
        .on('open', function() {
        document.getElementById('overlay').addEventListener('click', close);
    })

        .on('beforeclose', function() {
        document.getElementById('overlay').classList.remove('panel-open');
        $("#overlay").remove();
        this.panel.removeEventListener('click', close);
    });

})(jQuery);