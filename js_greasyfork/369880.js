// ==UserScript==
// @name     Jira auto
// @description Reload page every minute and scrolls down the page in the meanwhile
// @version  1.1
// @grant    none
// @include  https://*atlassian.net/*sprint*
// @namespace https://greasyfork.org/users/193582
// @downloadURL https://update.greasyfork.org/scripts/369880/Jira%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/369880/Jira%20auto.meta.js
// ==/UserScript==

function main ($) {
    // If ever the Jira box changes, search the correct id to bind the scroll to
    var window_id = '#ghx-pool';


    var refresh_active = window.location.href.indexOf('refresh=false') === -1;
    var scroll_active = window.location.href.indexOf('scroll=false') === -1;

    // Refresh the page over time
    var numMinutes = 1;
    var timeout = numMinutes*60*1000;
    setTimeout(function() {
        if (refresh_active) {
            window.location.reload(true);
        }
    }, timeout);

    // Scroll down the page
    var pixels_per_scroll = $('html,body').height()/2;
    var interval = 5000;
    var previous_position = -1;
    setInterval(function() {
        if (scroll_active) {
            if (previous_position == $(window_id).scrollTop()) {
                $(window_id).animate({
                    scrollTop: 0
                }, 500);
            } else {
                previous_position = $(window_id).scrollTop()
                $(window_id).animate({
                    scrollTop: $(window_id).scrollTop() + pixels_per_scroll
                }, 500);
            }
        }
    }, interval);

    function update_url() {
        var url = location.href;
        url = url.replace('&scroll=true', '');
        url = url.replace('&scroll=false', '');
        url = url.replace('&refresh=true', '');
        url = url.replace('&refresh=false', '');
        url += '&refresh='+refresh_active+'&scroll='+scroll_active;
        var stateObj = { foo: "bar" };
        history.pushState(stateObj, "update_url", url);
    }


    function create_button() {
        if(document.body){
            var refresh = document.createElement('span');
            var scroll = document.createElement('span');
            var css = document.createElement('style');

            refresh.id = "refresh";
            scroll.id = "scroll";

            var refresh_svg = '<svg aria-hidden="true" data-prefix="fas" data-icon="redo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-redo fa-w-16 fa-2x"><path fill="currentColor" d="M500.333 0h-47.411c-6.853 0-12.314 5.729-11.986 12.574l3.966 82.759C399.416 41.899 331.672 8 256.001 8 119.34 8 7.899 119.526 8 256.187 8.101 393.068 119.096 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-33.971-33.971c-4.466-4.466-11.64-4.717-16.38-.543C341.308 415.448 300.606 432 256 432c-97.267 0-176-78.716-176-176 0-97.267 78.716-176 176-176 60.892 0 114.506 30.858 146.099 77.8l-101.525-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12z" class=""></path></svg>';
            var scroll_svg = '<svg aria-hidden="true" data-prefix="fas" data-icon="sort" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-sort fa-w-10 fa-2x"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" class=""></path></svg>';

            var css_refresh = '#refresh {' +
                ' opacity:1;' +
                ' -moz-transition-duration:0.2s;' +
                ' border-radius:5px;' +
                ' padding:5px;' +
                ' cursor:pointer;' +
                ' height:36px;' +
                ' margin-top:-24px;' +
                ' width:36px;' +
                ' position:fixed;' +
                ' right:10px;' +
                ' bottom:53%;' +
                ' z-index:1;' +
                ' background-color:green;' +
                ' color:white;' +
                ' } ';
            var css_scroll ='#scroll {' +
                ' opacity:1;' +
                ' -moz-transition-duration:0.2s;' +
                ' border-radius:5px;' +
                ' padding:5px;' +
                ' padding-bottom: 25px;' +
                ' cursor:pointer;' +
                ' height:36px;' +
                ' margin-top:-24px;' +
                ' width:36px;' +
                ' position:fixed;' +
                ' right:10px;' +
                ' top:53%;' +
                ' z-index:1;' +
                ' background-color:green;' +
                ' color:white;' +
                ' }';
            var css_red = '.red { background-color:red !important; }';

            $(css).text(css_refresh+' '+css_scroll+' '+css_red);
            $(refresh).html(refresh_svg);
            $(scroll).html(scroll_svg);

            $(refresh).toggleClass('red', !refresh_active);
            $(scroll).toggleClass('red', !scroll_active);

            refresh.addEventListener('click', function(e){ refresh_active = !refresh_active; $(refresh).toggleClass('red', !refresh_active); update_url(); });
            scroll.addEventListener('click', function(e){ scroll_active = !scroll_active; $(scroll).toggleClass('red', !scroll_active); update_url(); });
            document.body.appendChild(css);
            document.body.appendChild(refresh);
            document.body.appendChild(scroll);
        }
    }
    if(window != window.top) return 0;
    create_button();
}

add_jQuery (main, "1.7.2");

function add_jQuery (callbackFn, jqVersion) {
    jqVersion = jqVersion || "1.7.2";
    var D = document;
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode = D.createElement ('script');
    scriptNode.src = 'https://ajax.googleapis.com/ajax/libs/jquery/' +
                    jqVersion +
                    '/jquery.min.js';
    scriptNode.addEventListener ("load", function () {
        var scriptNode = D.createElement ("script");
        scriptNode.textContent =
            'var gm_jQuery  = jQuery.noConflict (true);\n' +
            '(' + callbackFn.toString () + ')(gm_jQuery);';
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);
}

