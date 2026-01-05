// ==UserScript==
// @name        C&C:TA Attack Alert
// @namespace   CnC_TA_Attack_Alert
// @author  	Vulcano
// @version     1.0.0.1
// @date        2015-03-25
// @copyright   (c) by Vulcanion.com
// @license     Vulcanion.com
// @URL         http://Vulcanion.com
// @icon        http://Images.Vulcanion.com/Vulcanion/Vulcano_62x64.png
// @description Play alert sound if someone attacks your bases
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15055/CC%3ATA%20Attack%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/15055/CC%3ATA%20Attack%20Alert.meta.js
// ==/UserScript==

(function () {
    console.log("C&C:TA Attack Alert loading ...");
    var original_title = window.document.title;
    var enable_sound   = true;
    var was_attacked   = false;
    
if(enable_sound) {
    siren = new Audio('http://Data.Vulcanion.com/Games/CC-TA/Scripts/AttackAlert/AttackAlert.mp3'); 
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
            window.document.title = 'ALERT - Base ' + victim + ' is under attack!';
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
            new_href = "http://Data.Vulcanion.com/Games/CC-TA/Scripts/AttackAlert/alert.gif";
        } else if(status == "relax") {
            new_href = "http://Data.Vulcanion.com/Games/CC-TA/Scripts/AttackAlert/normal.png";
        }

        link.rel  = 'shortcut icon';
        link.href = new_href;
        
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    window.setInterval(function(){
        checkAlert();
    }, 5000);
    
    console.log("C&C:TA Attack Alert loaded successfully !!!");

})();