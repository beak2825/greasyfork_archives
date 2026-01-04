// ==UserScript==
// @name         Ankiweb Autoplay
// @namespace    http://whynot.moe/
// @version      0.3.7
// @description  Automatically plays sound files on ankiweb.net
// @author       Rainer
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @match        https://ankiweb.net/study/
// @match        https://ankiuser.net/study/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38176/Ankiweb%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/38176/Ankiweb%20Autoplay.meta.js
// ==/UserScript==

(function() {
    window.playing = false;
    window.playqueue = [];
    genoptions = {
        'childList': true,
        'subtree': true
    };
    audiooptions = {
        'attributes': true,
        'attributeFilter': ['src'],
        'subtree': false
    };
    window.replay = function(e){
        var isR = e.key? (e.key == 'r' || e.key == 'R') : e.keyCode == 67;
        if(isR){
            playqueue = [].slice.call(document.getElementsByTagName('audio'));
            ff();
            this.removeEventListener(e.type, arguments.callee);
        }
    };
    window.ff = function(e){
        if(playqueue.length){
            el = playqueue.shift();
            el.play();
            el.addEventListener('ended', ff);
        } else {
            playing = false;
            bs = document.getElementsByClassName('btn-primary');
            btn = bs[bs.length - 1];
            if(window.getComputedStyle(btn).visibility == "hidden"){
                btn = bs[bs.length - 2];
            }
            btn.focus();
            document.removeEventListener('keydown', replay);
            document.addEventListener('keydown', replay);
        }
    };
    window.doplay = function(t){
        if(playing){
            playqueue.push(t);
        } else {
            playing = true;
            t.play();
            t.addEventListener('ended', ff);
        }
    };
    window.audiocallback = function(mutations){
        mutations.map(function(m){
            t = m.target;
            if((!t.srcdone) && t.src){
                t.srcdone = true;
                doplay(t);
            }
        });
    };
    ma = new MutationObserver(audiocallback);
    window.gencallback = function(allmutations) {
        document.removeEventListener('keydown', replay);
        playing = false;
        playqueue = [];
        allmutations.map( function(mr) {
            n = mr.target;
            [].forEach.call(n.getElementsByTagName('audio'), function(el){
                ma.observe(el, audiooptions);
            });
        });
    };
    mo = new MutationObserver(gencallback);
    mo.observe(document.body, genoptions);
})();