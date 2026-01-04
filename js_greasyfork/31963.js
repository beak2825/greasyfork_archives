// ==UserScript==
// @name Nations Your turn Notifier
// @namespace tequila_j-script
// @version    0.1.1
// @description  Notify Nations in your turn (mabiweb.com)
// @match      http://www.mabiweb.com/modules.php?name=GM_Nations*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @run-at document-ready
// @downloadURL https://update.greasyfork.org/scripts/31963/Nations%20Your%20turn%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/31963/Nations%20Your%20turn%20Notifier.meta.js
// ==/UserScript==

// request permission on page load

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

GM_addStyle( `
div.playerboardinfo {
    position: absolute;
    top: 10px;
    left: 1150px;
}

div.playerboardinfo dl {
}

div.playerboardinfo dt {
    margin-bottom: 4px;
    padding-left: 10px;
}

div.playerboardinfo dd {
    margin: 0px;
}

div.playerboardinfo ul {
    list-style-type: disc;
    margin: 0px;
    padding:0px;
}

div.playerboardinfo ul li {
    display: inline-block;
    width: 40px;
    height: 30px;
    margin: 0px 5px;
}

div.playerboardinfo li p {
    margin: 0px;
    width: 20px;
    height: 20px;
    display: inline-block;
}

div.playerboardinfo li p.desc {
    background-repeat: no-repeat;
    background-position: center; 
    background-size: 100% 100%;
}

div.playerboardinfo li.food p.desc {
    background-image: url(modules/GM_Nations/images/Token_Food.png);
}

div.playerboardinfo li.stone p.desc {
    background-image: url(modules/GM_Nations/images/Token_Stone.png);
}

div.playerboardinfo li.gold p.desc {
    background-image: url(modules/GM_Nations/images/Token_Gold.png);
}

div.playerboardinfo li.point p.desc {
    background-image: url(modules/GM_Nations/images/Token_VP.png);
}

div.playerboardinfo li.spare p.desc {
    opacity: 0.5;
}

div.playerboardinfo li.worker-Blue p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Blue.png);
}

div.playerboardinfo li.worker-Yellow p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Yellow.png);
}

div.playerboardinfo li.worker-Red p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Red.png);
}

div.playerboardinfo li.worker-Green p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Green.png);
}

div.playerboardinfo li.worker-Purple p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Purple.png);
}

div.playerboardinfo li.worker-Orange p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Orange.png);
}

div.playerboardinfo li.worker-Gray p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Gray.png);
}

div.playerboardinfo li.worker-Pink p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Pink.png);
}

div.playerboardinfo li.worker-Cyan p.desc {
    background-image: url(modules/GM_Nations/images/Meeple_Cyan.png);
}




`);


//console.log = function() {};

(function() {

  'use strict';
  /*jshint multistr: true */

  
  //avoid double loading
  if (window.location.href.indexOf('show_message') > 0) return;

    // Game finished
  if ($("#nations-gameheader:contains('Game fini')").length > 0) return;

  //finds username
var $userNameBox = $("a[href='modules.php?name=Your_Account&op=logout'").parent();
var userName = $userNameBox.text().replace(/.*welcome /i,"").replace(/!.*/,"");
console.log("Username:" + userName + ".");

var currentUser = $("#nations-gameheader").children("img").next("b").text();
console.log("Current user:"+ currentUser + ".");

var gameUrl = "http://www.mabiweb.com/modules.php?name=GM_Nations&g_id="+ urlParam("g_id") + "&op=view_game_reset";
console.log(gameUrl);

var numberOfPlayers = $("#nations-gameheader").children("img").length;
console.log("Number of players:" + numberOfPlayers);

var $playerboards = $("#placeholder > div");
var $playernameboxes = $("#placeholder > ul.tab > li");

var playercolors = $("#nations-gameheader").children("img").map(function() {
    var ptoken = $(this).attr('src');
    var color = ptoken.replace(/.*Disc_/,"").replace(/\.png/,"");
    return color;}).get();


var $newPlayerBoxes = $("<div class='playerboardinfo'/>");
$("div#nations-board").append($newPlayerBoxes);
for (var i = 0; i < numberOfPlayers; i++) {
    var $playerDiv = $($playerboards[i]);
    var playerName = $($playernameboxes[i]).text();
    var playerColor = playercolors[i];
    console.log("player: " + playerName);
    var resources = $playerDiv.find(".resource_text").map(function() {
                 return $(this).text();
              }).get();
    var spareWorkFinder = $playerDiv.find(".resource_text:first").prev();
    if (spareWorkFinder.hasClass('outline_text')) {
        resources.push(spareWorkFinder.text())
    } else {
        resources.push(0);
    }
                 
    $newPlayerBoxes.append(buildPlayerAF(playerName,playerColor,resources));
}

function buildPlayerAF(playerName, playercolor, resources) {
    var playerTable = "<dl><dt>" + playerName + "</dt>"
    + "<dd><ul>"
    + "<li class='food'><p class='desc'></p><p class='qdt'>" + resources[0] + "</p></li>"
    + "<li class='stone'><p class='desc'></p><p class='qdt'>" + resources[1] + "</p></li>"
    + "<li class='gold'><p class='desc'></p><p class='qdt'>" + resources[2] + "</p></li>"
    + "<li class='point'><p class='desc'></p><p class='qdt'>" + resources[3] + "</p></li>"
    + "<li class='worker-"+playercolor+"'><p class='desc'></p><p class='qdt'>" + resources[4] + "/" + resources[5] + "</p></li>"
    + "</ul></dd></dl>"
    ;

    return $(playerTable);
}

window.setCheckTurn = function(callbackFunc, timing) {
        var variableInterval = {
            config: timing,
            callback: callbackFunc,
            stopped: false,
            runLoop: function() {
                if (variableInterval.stopped) return;
                    var result = variableInterval.callback.call(variableInterval);
                    if (typeof result == 'number') {
                        if (result === 0) return;
                            variableInterval.interval = result;
                    };
                    variableInterval.loop();
                        },
                        stop: function() {
	                        this.stopped = true;
                            console.log("Auto refresh stopped");
                            window.clearTimeout(this.timeout);
                        },
                        start: function() {
                        this.stopped = false;
                            console.log("Auto refresh started");
                            return this.loop();
                        },
                        loop: function() {
                        this.timeout = window.setTimeout(this.runLoop, this.getInterval());
                                return this;
                        },
                        incrementInterval: function(multiply) {
                            if (multiply !== undefined) multiply = 1;
                        var alic = this.getInterval() + this.config.step*multiply;
                                if (alic > this.config.max) {
                        this.setInterval(this.config.max);
                                console.log("Interval already set to maximum:" + this.getInterval());
                        } else {
                        this.setInterval(this.getInterval() + this.config.step);
                                console.log("Interval increased to:" + this.getInterval());
                        }
                        return this;
                        },
                        resetInterval: function() {
                        this.setInterval(this.config.start);
                                console.log("Interval reset to:" + this.getInterval());
                        },
                        getInterval: function() {
                        if (sessionStorage.getItem("currentTime") === null) {
                        sessionStorage.setItem("currentTime", this.config.start);
                        }
                        return Number(sessionStorage.getItem("currentTime"));
                        },
                        setInterval: function(val) {
                        sessionStorage.setItem("currentTime", val);
                        }

                }
                
       return variableInterval;
               
    };


var notificationTimeout = {
	start: 10000,
	max: 120000,
	step: 5000,
	current: 10000
};


function urlParam(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}


var honkSound = new Audio("https://www.soundjay.com/misc/sounds/briefcase-lock-4.mp3");




var isDefaultTitle = true;
var origTitle = document.title;
var yourTurnTitle = origTitle + " - Your turn!";

function blinkTitle() {
    document.title = isDefaultTitle ? origTitle : yourTurnTitle;
    isDefaultTitle = !isDefaultTitle;
}




function notify(message) {
  if (!Notification) {
    console.log('Desktop notifications are not available for your browser.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  else {
    var notification = new Notification('Mabiweb: it is your turn!', {
      icon: 'http://www.boiteajeux.net/jeux/kan/img/sandra_1.png',
      body: message,
	  requireInteraction: true
    });
	notification.onclick = function () {
    	window.focus();
  	};
  }
  
  honkSound.play();
  var titleNotification = setInterval(blinkTitle, 1500);

}



function updatePage() {
    turnNotifier.incrementInterval(numberOfPlayers-1);
    window.location.href = gameUrl;

}

var turnNotifier = setCheckTurn(function() {
	updatePage();
	}, notificationTimeout
);

var isMyTurn = function() {
	return userName == currentUser;
};

function startNotification() {
    console.log("Is my turn?" + isMyTurn());

    if (! isMyTurn()) {
        console.log("Next reload:" + turnNotifier.getInterval());
        turnNotifier.start();
    } else {
        turnNotifier.resetInterval(); //ugly hack for double reload
        notify("Table " + urlParam("g_id"));
    }
}

startNotification();
  
})() ;//end of script


