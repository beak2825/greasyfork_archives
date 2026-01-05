// ==UserScript==
// @name Kanban Your turn Notifier
// @namespace tequila_j-script
// @version    0.4.2
// @description  Notify Kanban in your turn
// @match      http://*.boiteajeux.net/jeux/kan/*
// @match      https://*.boiteajeux.net/jeux/kan/*
// @match      http://www.boiteajeux.net/jeux/kan/*
// @match      https://www.boiteajeux.net/jeux/kan/*
// @grant    GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/18726/Kanban%20Your%20turn%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/18726/Kanban%20Your%20turn%20Notifier.meta.js
// ==/UserScript==

// request permission on page load

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

(function() {

  'use strict';
  /*jshint multistr: true */


var honkSound = new Audio("http://www.soundjay.com/transportation/car-locked-honk-1.mp3");

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
                        incrementInterval: function() {
                        var alic = this.getInterval() + this.config.step;
                                if (alic > this.config.max) {
                        this.setInterval(this.config.max)
                                console.log("Interval already set to maximum:" + this.getInterval());
                        } else {
                        this.setInterval(this.getInterval() + this.config.step);
                                console.log("Interval increased to:" + this.getInterval());
                        }
                        return this;
                        },
                        resetInterval: function() {
                        this.setInterval(this.config.start)
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
	max: 60000,
	step: 3000,
	current: 10000
};


var gameName = $("#dvBandeauHaut > div:first > div.clTexteFort:nth-child(2)").html();

function notify(message) {
  if (!Notification) {
    console.log('Desktop notifications are not available for your browser.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  else {
    var notification = new Notification(gameName + ': your turn!', {
      icon: 'http://www.boiteajeux.net/jeux/kan/img/sandra_1.png',
      body: message,
	  requireInteraction: true
    });
	notification.onclick = function () {
    	window.focus();
  	};
  }
  
  honkSound.play();

}

var isMyTurn = function() {
	var message = $('#dvMessage').html();
	return ! message.startsWith("Still twiddling your thumbs");
}


var turnNotifier = setCheckTurn(function() {
	actualiserPage();
	}, notificationTimeout
)


function startNotification() {
	turnNotifier.resetInterval();
	turnNotifier.start();
}


//override function so notification can start again when they are clicked
var proxied_finalizeActions = finalizeActions
finalizeActions = function() {
	turnNotifier.stop();
	proxied_finalizeActions.apply(this, arguments);
	startNotification();
}


var proxied_refreshDisplay = refreshDisplay;
refreshDisplay = function() {
	proxied_refreshDisplay.apply( this, arguments );
    console.log("Display refreshed");
  	if (isMyTurn()) {
      	var message = $('#dvMessage').html();
		notify(message);
		turnNotifier.stop();
      	console.log("Auto refresh stop");
    } else {
		turnNotifier.incrementInterval();
    }
}

var proxied_passer = passer;
passer = function() {
	turnNotifier.stop();
	var result =  proxied_passer.apply( this, arguments );
	startNotification();
}

var proxied_actualiserPage = actualiserPage;
actualiserPage = function() {
	turnNotifier.stop();
	var result = proxied_actualiserPage.apply( this, arguments);
  	turnNotifier.start();
}

var proxied_faire = faire;
faire = function() {
	var result = proxied_faire.apply( this, arguments );
	//if (arguments[0] == "moveWorker" || arguments[0] == "perfGoal" || arguments[0] == "nextperfgoal" || arguments[0] == "selectDesignInit" || arguments[0] == "selectPosCertifInit") // selectPosCertifInit does not work. It is used by any cert
	if (arguments[0] == "moveWorker" || arguments[0] == "perfGoal" || arguments[0] == "nextperfgoal" || arguments[0] == "selectDesignInit" )
			startNotification();
	return result;
};

startNotification();
  
})() //end of script


