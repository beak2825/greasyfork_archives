// ==UserScript==
// @name FCM Your turn Notifier
// @namespace tequila_j-script
// @version    0.4.0
// @description  Notify FCM on Boardgamecore in your turn
// @match      http://play.boardgamecore.net/fcm/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js 
// @grant    GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/22605/FCM%20Your%20turn%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/22605/FCM%20Your%20turn%20Notifier.meta.js
// ==/UserScript==



$(window).load(function(){

    'use strict';
        /*jshint multistr: true */

        //lets's put a function so it is easy to ckeck user
        
    Model.prototype.tj_currentPlayerLogin = function() {
        var cindex = this.workflow.currentPlayer;
      	var tindex = this.workflow.turnOrder[cindex];
      	console.log("Teste2:" + this.players[tindex].name);
        return this.players[cindex].name;
      
    };
  
    Controller.prototype._proxy_next = Controller.prototype.next;
	Controller.prototype.next = function() {
      	console.log("Botao apertado? Enviando requisicao????");
		Controller.prototype._proxy_next.apply(this, arguments);
	    console.log("Botao apertado? Fim de turno????");
      	turnNotifier.resetInterval();
        turnNotifier.start();
	}

    //notification default config
    var notificationConfig = {
        start: 1000,
        max: 120000,
        step: 5000
    };
  
    //capturing ajax request so we know when player turn has ended
    /**
    var checkXMLCalls = function(open) {
                XMLHttpRequest.prototype.open = function() {
                this.addEventListener("readystatechange", function() {
                var ev = arguments[0];
                        if (this.readyState == 4
                                && ev.srcElement instanceof XMLHttpRequest
                                && ev.srcElement.responseURL == "http://play.boardgamecore.net/Json"
                                && ev.srcElement.status == 200) {
                          	console.log(ev);
                           //turnNotifier.resetInterval();
                           //turnNotifier.start();
                }

                }, false);
                        open.apply(this, arguments);
                };
                };
       **/         
//    checkXMLCalls(XMLHttpRequest.prototype.open);
                
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    };
    
    window.setVariableInterval = function(callbackFunc, timing) {
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
                                window.clearTimeout(this.timeout);
                        },
                        start: function() {
                        this.stopped = false;
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
  
  	
  
  
  	var isMyTurn = function(currUser) {
      	console.log("currUser:" + currUser);
    	return (currUser.indexOf(myUser) >= 0);
	};
                
    var gameName = global.gameName;
    var phase = $("span#phase").html();
    var myUser = global.name;
    var honkSound = new Audio("http://play.boardgamecore.net/wsdv/mp3/beep.mp3");
  
	var notify = function(message) {
      if (!Notification) {
      	console.log('Desktop notifications are not available for your browser.');
      	return;
      };
                
      if (Notification.permission !== "granted")
      	Notification.requestPermission();
            else {
                var notification = new Notification(gameName + ': your turn!', {
                    icon: 'http://play.boardgamecore.net/images/fcm-icon.png',
                        body: message,
                        requireInteraction: true
                });
                notification.onclick = function () {
                    window.focus();
                };
            }
            
            honkSound.play();
        }

                
      	var turnNotifier = setVariableInterval(function() {
          		checkServer();
                console.log("function");
                }
                , notificationConfig);
                        
        var checkServer = function() {
          $.ajax(
            {
                method: "POST",
                url: "../Json",
                data: { id: global.gameId, action: "load" },
              	cache: false,
              	beforeSend: function() {
                  console.log("Stopping request so we can fetch in peace");
                  turnNotifier.stop();
                }
            })

        	.done(function(data) {
                var model = Model.import(Encoder.decodeObject(data));
                console.log(model.tj_currentPlayerLogin());
            	console.log(model);
                if (isMyTurn(model.tj_currentPlayerLogin())) {
                    var message = gameName + ":" + phase + ": Your Turn!";
                    notify(message);
                }
                else {
                    turnNotifier.incrementInterval();
                  	turnNotifier.start();
                }
            })
            .fail(function(jqXHR, textStatus) {
              	turnNotifier.incrementInterval();
              	turnNotifier.start();
                console.log("problem fetching server:" + textStatus);
            })
            
            .always(function() {
            });
        }
            
	if (! isMyTurn(global.currentPlayers)) {
      turnNotifier.start();
    }
    
});
