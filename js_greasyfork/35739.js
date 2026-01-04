// ==UserScript==
// @name          Auto-Streamcloud
// @description   autoplay video & direct-download
// @match         http://streamcloud.eu/*
// @grant         GM_addStyle
// @version       2018.07.31
// @author        fakeraol
// @namespace     https://greasyfork.org/de/users/160942
// @downloadURL https://update.greasyfork.org/scripts/35739/Auto-Streamcloud.user.js
// @updateURL https://update.greasyfork.org/scripts/35739/Auto-Streamcloud.meta.js
// ==/UserScript==

var target = document.getElementById('btn_download');
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type == "attributes") {
            if (target.classList.contains('blue')){setTimeout(function(){target.click();cI();}, 100);}
        }
    });
});
try { observer.observe(target, { attributes: true, attributeFilter: ['class'] }); }
catch(e) {}

function cI(){
    var player=document.getElementById('mediaplayer_display');
    if (player){
        GM_addStyle('#player_code, #mediaplayer {position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important;z-index: 1000000}' +
                    '#video-detach-button, #mediaplayer_display_button {display: none !important}' +
                    'div[style*="z-index: 999999"] {display: none !important}');
        // background-image: url(&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;)
        document.getElementById('vmenubar').style.display = 'none';
        document.getElementById('mediaplayer_display').click();
        mL();
    }
    else{
    setTimeout(cI, 250);
    }
}
function mL(){
    var v=document.getElementsByTagName('video')[0];
    if (v){
        var dl = document.createElement('a');
        dl.appendChild(document.createTextNode('\u25BC'));
        dl.setAttribute('href',v.src);
        dl.style='position:fixed;bottom:1px;width:20px;height:20px;color:#fff;text-align:center;border-radius:5px;text-shadow:0 0 8px #000;'+
            'box-shadow:inset 0 0 4px #fff;cursor:pointer;font-weight:900;text-decoration:none;z-index:1000000;text-decoration:underline;right:98px';
        dl.title='Download';
        document.body.appendChild(dl);
        bt('70px', -5,'‹');
        bt('47px',-73,'«');
        bt('24px',+85,'»');
        bt( '1px', +3,'›');
        var u = document.createElement('div');
        u.style='position:fixed;bottom:2px;right:123px;color:#fff;text-align:right;z-index:1000000';
        u.id = "uhr";
        document.body.appendChild(u);
        showClock();
        // document.getElementById('mediaplayer_display').focus();
    }
    else{
    setTimeout(mL, 50);
    }
    function bt(right,time,text){
        var b = document.createElement('div');
        b.style='position:fixed;bottom:1px;width:20px;height:20px;color:#fff;text-align:center;border-radius:5px;text-shadow:0 0 8px #000;'+
            'box-shadow:inset 0 0 4px #fff;cursor:pointer;font-weight:900;text-decoration:none;z-index:1000000;right:'+right;
        b.title= time + 's';
        b.addEventListener('mousedown', function(e) {v.currentTime += time;});
        b.appendChild(document.createTextNode(text));
        document.body.appendChild(b);
    }
}
function showClock(){
    var d = new Date();
    var m = "0" + d.getMinutes();
    document.getElementById('uhr').innerHTML = d.getHours() + ':' + m.substr(-2, 2);
    window.setTimeout(showClock, 10000);
}
/* document.querySelector('video').playbackRate = 1.25;
v.style.objectFit = 'fill';
 */