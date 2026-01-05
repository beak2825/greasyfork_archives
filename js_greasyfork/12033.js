// ==UserScript==
// @name         WK Alternate F Game
// @version      0.2
// @description  Assigns the effect of your F'd up F key to some random F'ing key. Good luck finding it!
// @author       Me
// @match        https://www.wanikani.com/lesson/session
// @match        https://www.wanikani.com/review/session
// @grant        none
// @namespace https://greasyfork.org/users/8907
// @downloadURL https://update.greasyfork.org/scripts/12033/WK%20Alternate%20F%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/12033/WK%20Alternate%20F%20Game.meta.js
// ==/UserScript==

(function() {

    var msgElmt = null;
    var activeKey = 86;
    var otherShortcuts = [65, 68, 70, 71, 74, 81, 190, 191];
    //var keyLocations = [[49, 50, 51, 52, 53, 54, 55, 56, 57, 48], [81, 87, 69, 82, 84, 89, 85, 73, 79, 80], [65, 83, 68, 70, 71, 72, 74, 75, 76, 186], [90, 88, 67, 86, 66, 78, 77, 188, 190, 191]];
    var invKeyLocations = {49:[0,0],50:[0,1],51:[0,2],52:[0,3],53:[0,4],54:[0,5],55:[0,6],56:[0,7],57:[0,8],48:[0,9],81:[1,0],87:[1,1],69:[1,2],82:[1,3],84:[1,4],89:[1,5],85:[1,6],73:[1,7],79:[1,8],80:[1,9],
                           65:[2,0],83:[2,1],68:[2,2],70:[2,3],71:[2,4],72:[2,5],74:[2,6],75:[2,7],76:[2,8],186:[2,9],90:[3,0],88:[3,1],67:[3,2],86:[3,3],66:[3,4],78:[3,5],77:[3,6],188:[3,7],190:[3,8],191:[3,9]};

    function getKeyDistance(key1, key2) {
        var key1Loc = invKeyLocations[key1];
        var key2Loc = invKeyLocations[key2];
        if (!key1Loc || !key2Loc) return -1;
        var dx = key1Loc[0] - key2Loc[0];
        var dy = key1Loc[1] - key2Loc[1];
        return Math.sqrt(dx*dx+dy*dy);
    }
    
    function isUsableKey(key) {
        return key >= 48 && key <= 191 && otherShortcuts.indexOf(key) === -1 && invKeyLocations[key];
    }
    
    function randomizeActiveKey() {
        var newKey = -1;
        while (!isUsableKey(newKey)) {
            newKey = 48 + Math.floor(Math.random() * 143);
        }
        activeKey = newKey;
    }
    
    function getWarmthMessage(keyDist) {
        if (keyDist <= 1) return "HOT HOT HOT";
        if (keyDist <= 2) return "Hot!";
        if (keyDist <= 3) return "Warmer...";
        if (keyDist <= 4) return "Room temperature";
        if (keyDist <= 5) return "Kinda chilly...";
        if (keyDist <= 6) return "Brrrrrr!";
        else return "Frozen solid";
    }
    
    function displayMessage(message) {
        if (msgElmt) msgElmt.remove();
        
        msgElmt = $("<div id='warmth-msg'></div>");

        msgElmt.css({
            position: "absolute",
            zIndex: 9999,
            boxShadow: "rgba(50,50,50,0.4) 0px 0px 5px 2px",
            top: "-999px",
            left: "-999px",
            background: "#F5F5F5",
            width: "200px",
            height: "auto",
            padding: "15px 0",
            textAlign: "center",
            borderRadius: "5px",
            fontWeight: "bold"
        });

        $(document.body).append(msgElmt);

        msgElmt.css({
            left: "50%",
            top: "50%",
            marginLeft: -msgElmt.outerWidth()/2,
            marginTop: -msgElmt.outerHeight()/2
        });
        
        msgElmt.text(message);
        msgElmt.delay(1500).fadeOut(1000);
    }

    randomizeActiveKey();
    $(document).on("keyup", function(e) {
        if (e.keyCode === activeKey) {
            $("li#option-item-info").click();
            displayMessage("Yes! You are number one!\nPicking new F key...");
            msgElmt.css({background: "#82c13f"});
            randomizeActiveKey();
        } else if (invKeyLocations[e.keyCode]) {
            displayMessage(getWarmthMessage(getKeyDistance(activeKey, e.keyCode)));
        }
    });
    
})();