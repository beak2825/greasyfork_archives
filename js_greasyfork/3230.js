// ==UserScript==
// @name        -:TA Alert Status:-
// @description Alert if someone attacks your bases.
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @icon        http://c2n.me/ivdCY1.png
// @version     1.0.1
// @author      der_flake
// @downloadURL https://update.greasyfork.org/scripts/3230/-%3ATA%20Alert%20Status%3A-.user.js
// @updateURL https://update.greasyfork.org/scripts/3230/-%3ATA%20Alert%20Status%3A-.meta.js
// ==/UserScript==

(function () {
    var original_title = window.document.title;
    var enable_sound   = true; // false
    var was_attacked   = false;
    
if(enable_sound) {
    siren = new Audio('http://booz.ro/tiberium/siren.mp3'); 
    siren.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}
    
    function checkAlert() {
        var in_background = false;
        var new_title     = "";
        var is_alerted    = false;
            
        if (document.hasFocus() == false) {
            in_background = true;
        }
        
        if(in_background) {
            var mainData  = ClientLib.Data.MainData.GetInstance();
            var bases     = mainData.get_Cities();
            var all_bases = bases.get_AllCities().d;
            var victim    = "";

            for (var key in all_bases) {
               var current_base = all_bases[key];
                if(current_base.get_isAlerted()) {
                    is_alerted = true;
                    victim = current_base.get_Name();
                    was_attacked = true;
                }
            }
        }

        if(is_alerted && !was_attacked) {
            window.document.title = 'ALERT - База ' + victim + ' под атакой!';
            makeFavicon("alert");
            
            if(enable_sound) {
                siren.play();
            }
        } else if(was_attacked && !in_background) {
            window.document.title = original_title;
            makeFavicon("relax");
            
            if(enable_sound) {
                siren.pause();
                siren.currentTime = 0;
            }

            was_attacked = false;
        }
    }
    
    function makeFavicon(status) {
        var link = document.createElement('link'),
            new_href = "";
        
        if(status == "alert") {
            new_href = "http://c2n.me/iv7pNm.gif";
        } else if(status == "relax") {
            new_href = "http://c2n.me/iv8Y2f.png";
        }

        link.rel  = 'shortcut icon';
        link.href = new_href;
        
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    window.setInterval(function(){
        checkAlert();
    }, 5000);
    
    console.log("-:TA Alert Status:- loaded!");

})();