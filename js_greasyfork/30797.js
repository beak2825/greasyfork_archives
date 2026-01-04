// ==UserScript==
// @name        AdventureLogLog
// @namespace   http://tampermonkey.net/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @description Record adventure log and save to text file.
// @author      Farflier
// @match       http://idle.land/*
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30797/AdventureLogLog.user.js
// @updateURL https://update.greasyfork.org/scripts/30797/AdventureLogLog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $ = jQuery = jQuery.noConflict(true);

    function ComponentProvider(){
        this.find = function (search){
            var n = ng.probe($(search)[0]);
            if (n){
                return n.componentInstance;
            }
           return null;
        };
        this.init = function(){
            Object.defineProperties(ComponentProvider.prototype, {
                overview: {
                    get: function () {
                        return this.find("page-overview");
                 }}
            });
        };
    }

	function LogHandler(){
		var k = "AdvLog";

		this.load = function(){
			var str = localStorage.getItem(k);

			if(str){
				this.log = JSON.parse(str);

				if (!Array.isArray(this.log)){
					this.log = [];
				}
			}else{
				var log = [];

				$('.adventure-log > .list > .item').each(function(){
					var ts = new Date($(this).find('.note > span').text());
					var desc = $(this).find('.note').next().text();
					var icon = $(this).find('.game-icon').attr('class').split('-')[4];
					var entry = {ts: ts.getTime(), c: icon.charAt(0).toUpperCase()+icon.slice(1), d: desc};

					log.push(entry);
				});

				this.log = log;
				this.save();
			}
		}

		this.save = function(){
			localStorage.setItem(k, JSON.stringify(this.log));
		}

		this.clear = function(){
			this.log = [];
			this.save();
		}

		this.loadUI = function(){
			if ($('.adventure-log').length && !$('.log-handler').length){
				$('.adventure-log').prev()
				.append('<button clear="" ion-button="" small="" ng-reflect-small="" ng-reflect-clear="" class="log-handler button button-md button-default button-default-md button-small button-small-md button-md-primary" style="margin-top:0px;margin-left:15px;" onClick="logHandler.download()"><span class="button-inner"><div>Download</div></span></button>');
				$('.adventure-log').prev()
				.append('<button clear="" ion-button="" small="" ng-reflect-small="" ng-reflect-clear="" class="log-handler button button-md button-default button-default-md button-small button-small-md button-md-primary" style="margin-top:0px;margin-left:10px;" onClick="logHandler.clear()"><span class="button-inner"><div>Clear</div></span></button>');
			}
		}

		this.addEntry = function(data){
			this.log.unshift({
				ts: data.timestamp,
				c: data.category,
				d: data.text
			});

			if (this.log.length > 5000){
				this.log.pop();
			}
		}

		this.download = function(){
			var e = document.createElement('a');
			var d = new Date();
			var text = "";

			this.log.forEach(function(v){
				text += v.c+"\r\n"+(new Date(v.ts)).toLocaleString()+"\r\n"+v.d+"\r\n\r\n";
			});

			e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			e.setAttribute('download', "IdleLandAdventureLog_"+(d.getMonth()+1)+'-'+d.getDate()+'-'+d.getFullYear());
			e.style.display = 'none';
			document.body.appendChild(e);
			e.click();
			document.body.removeChild(e);
		}
	}

	window.logHandler = new LogHandler();

    function logTheLog(){
    	console.log("LogHandler init");

    	window.socket.on("data", function(data){
    		logHandler.loadUI();

    		if (data.event == "adventurelog"){
    			data.timestamp = new Date(data.timestamp);

    			logHandler.addEntry(data);
    		}
    	});

		logHandler.load();
    }

    setTimeout(logTheLog, 1000);
})();