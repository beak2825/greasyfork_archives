// ==UserScript==
// @name         Wa Online Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36847/Wa%20Online%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/36847/Wa%20Online%20Checker.meta.js
// ==/UserScript==

setTimeout(function() {
alert("Just Loaded");

	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.textContent = '(' + checkState + ')();';
	document.body.appendChild(script);
		setInterval(checkState, 1000);
     var online = {};
				function checkState() {
                    function sendnot(theTitle,theBody) {
                    var options = {
                    body: theBody,
                    };
                    var n = new Notification(theTitle,options);
                    }
			//console.log('Checking State');
			window.Store.Presence.toArray().forEach(function(c) {
				if (!c || !c.id)
					return console.log("eror1");
                if(c.id.search("g.us") != -1 || c.id.search("broadcast") != -1) {
                    return;
                }
var contacts = Store.Contact.toJSON();
				if (!c.isSubscribed) {
					c.subscribe();
					//console.log('Subscribing for ' + c.id);
				}

				if (c.isOnline === undefined)
					return console.log("eror2");

				if (online[c.id] != c.isOnline) {
					online[c.id] = c.isOnline;
                           for (let id in contacts) {
                               if(contacts[id].id === undefined) { /*console.log("working!"); */ continue; } else {
                               if(contacts[id].id.search("g.us") != -1 || contacts[id].id.search("broadcast") != -1) {
                                   continue;
                               }
                               }
                          var con_namr = contacts[id].name ? contacts[id].name : id;
                       if(contacts[id].id == c.id) {
                           if(c.isOnline === true) {
                               if(con_namr == "here") {
                             sendnot("There is someone online!",con_namr + 'is' +c.isOnline);
                               }
                            console.log(con_namr + 'is' +c.isOnline + " " + c.id);
                           } else {
                               //console.log(c.id + "" + con_namr);
                           }
                        }
                      }

					var change = {
						id: c.id,
						online: c.isOnline,
						time: parseInt(new Date().getTime() / 1000)
					};
					//parentWindow.postMessage({type: 'wa_presence_update', value: change}, '*');
					//console.log('Presence update:' + change);
				}
			});
		}
    }, 5000);