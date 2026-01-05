// ==UserScript==
// @name        Topserialy - Watch overlay
// @namespace   topserialy-overlay
// @include     /^https?://www\.topserialy\.(to|sk)//
// @description Simple overlay to watch free
// @version     3.2
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18192/Topserialy%20-%20Watch%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/18192/Topserialy%20-%20Watch%20overlay.meta.js
// ==/UserScript==

// simplify - Hide not uselful sections
$(".hslide").remove();
setTimeout(function(){
    $(".vypis .span4").css("width","241px");
    $(".vypis .span4 .overspa .iconavideo").remove();
    $(".row .span4:nth-child(3n)").css("margin-right","20px");
    $(".row .span4:nth-child(4n)").css("margin-right","0px");
    $(".vypisto").css({ "display":"flex", "flex-wrap":"wrap"});
    $(".mk-pagination").css("width","100%");
}, 500);

//
if(window.location.href.indexOf("serialy/") > -1){

    // vars
    var rand_id = Math.random().toString(36).substring(7);
    var rand_id2 = Math.random().toString(36).substring(7);
    var rand_id3 = Math.random().toString(36).substring(7);
    var iframe_id = Math.random().toString(36).substring(7);

    var css = [
        '.overlay {width:100%;padding:20px;height:60px;opacity:.4}',
        '.overlay a {letter-spacing: 3px;display: inline-block;background: #222;font-size: 9px;text-transform: uppercase;padding: 6px 10px 6px 12px;margin: 0 0 0 20px;font-weight: 800 }',
        '.overlay .spacer {padding: 20px;}',
        '#viframe {align-self:center}'
    ].join("");
    addGlobalStyle(css);

    var video = [];

    $.ajax({
        url: window.location.href,
        dataType: 'html',
        type: 'GET',
        success: function(response) {
            var el = document.createElement('html');
            el.innerHTML = response;

            var scripts = el.getElementsByTagName("iframe");
            for (var i = 0; i < scripts.length; ++i) {
                if (scripts[i].dataset.src !== null){
                    video.push(atob(scripts[i].dataset.src));
                }
            }

            if (video.length > 0) {
                window.localStorage.setItem('videos', JSON.stringify(video)); // prevent using empty array
            } else {
                video = JSON.parse(window.localStorage.getItem('videos')); // load from localStorage
            }
            console.log('Detected videos: ', video);
        },
    });

    $('body').on('click', '#' + rand_id3, function() {
        var id = $(this).attr("data-id");
        $("#" + rand_id2 + " iframe").remove();
        $("#" + rand_id2).append(iframe(video[id]));
    });

    $('body').on('click', '#' + rand_id, function() {
        $("#" + rand_id2 + " iframe").remove();
        $("#" + rand_id2).append(iframe(video[0]));
        if ($('#' + rand_id2).is(':hidden')) {
            $("#" + rand_id2).slideDown().css("display","flex");
            $("body").css("overflow","hidden");
        } else {
            $("#" + rand_id2).css("display","none");
            $("body").css("overflow","auto");
        }
    });

    $('body').on('click', '#wFullscreen', function() {
        $("#viframe").css({ "width":"100%", "height":"calc(100vh - 100px)" });
    });

    $("body").prepend("<div id='" + rand_id2 + "' style='position:fixed;top:0px;width:100%;height:100%;z-index:10000000000;display:none;background:#000;color:#444;margin:auto;text-align:center;flex-direction:column'><div class='overlay' onMouseOver='this.style.opacity=9' onMouseOut='this.style.opacity=.4'></div></div>");

    var li = $('.newtabs').find('li');

    for (var i = 0; i < li.length; ++i) {
        var sub = li[i].innerText;
        var nameT = li[i].className.replace("active", "");
        $(".overlay").append("<a id='" + rand_id3 + "' data-id='" + i + "' href='#'>" + nameT + sub + "</a>");
    }

    $(".overlay").append("<span class='spacer'></span><a id='wFullscreen' href='#'>Celé okno</a><a href='/'>hlavna stranka</a><a id='" + rand_id + "' href='#'>ZATVORIŤ</a>");

    // button to open
    $(".nadpstitdb .oznacenia").append("<a href='#' id='" + rand_id + "' style='background:#2980b9;color:#fff' class='ifsrt subtitles-active dabing-active'>> OTVORIT WATCH OVERLAY <</a>");
    $(".chcem-viacej").parent().parent().remove(); // remove shit text

}

function iframe(src) {
    return "<iframe id='viframe' src='" + src + "' scrolling='no' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' frameborder='0' height='500' width='800'></iframe>";
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}