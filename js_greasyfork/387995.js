// ==UserScript==
// @name         Keyboard Display Script
// @namespace    http://tampermonkey.net/
// @version      0.25.4.5
// @description  shows keyboard inputs on screen
// @author       Oki and meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387995/Keyboard%20Display%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/387995/Keyboard%20Display%20Script.meta.js
// ==/UserScript==

/**************************
   Keyboard Display Script
**************************/
(function() {
    window.addEventListener('load', function() {

        //Only display the keyboard if either in a Game or Replay
        if (typeof Game != "undefined" || typeof Replayer != "undefined") {
                var nameR = Math.floor(Math.random() * (2 - 0 + 1) + 0)
                var names = ['jez', 'oki', 'mep']
                
                
                //positioning stuff: fiddle around with the positioning

                //in game
                let gameLeft = -300
                let gameTop = 100

                //replays
                let replayRight = 200
                let replayTop = 200

                
                //names[nameR] is replacable with a string

            //labels are    0     1     2          3
            var labels = ['180','SD', 'HD',      'CCW',
                          //4     5     6     7    8    9
                          'HL', 'CW', names[nameR], '<', 'v', '>']

            let kbdisplay = {left:7,right:9,sd:1,hd:2,ccw:3,cw:5,hold:4,180:0,reset:6,new:8}

            //each number here corresponds to the label of the corresponding number (ex: 180 is set to 0 so label 0 will be highlighted when 180 key is pressed
            //make sure that each number in `kbdisplay` is unique and points to the right label


            //don't scroll to the bottom

            //nothing important after
            //          left right  sd hd ccw cw hold 180 reset new
            //order is: [6,    8,   1,  2, 3,  5,  4,  0] (.22)
            //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.23)
            //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.24)
            //order is: [7,    9,   8,  2, 5,  6,  1,  4,   0    3] (.24.1)
            //order is: [7,    9,   8,  3, 5,  6,  2,  4,   0    1] (.24.2)
            //0.25 added crap ton of variables, maybe use dictionary instead?
            //0.25.1 enum


            //var highlight = [[6,2],[8,2],[6,0],[8,0],[3,2],[5,2],[0,2],[2,2],[1,2],,[4,2]][this['actions'][this['ptr']]["a"]] //reference




            if (typeof getParams != "function") {
                var getParams = a => {
                    var params = a.slice(a.indexOf("(") + 1);
                    params = params.substr(0, params.indexOf(")")).split(",");
                    return params
                }
            }
            if (typeof trim != "function") {
                var trim = a => {
                    a = a.slice(0, -1);
                    a = a.substr(a.indexOf("{") + 1);
                    return a
                }
            }

            //Create the "keyboard holder". It's a div positioned where the keyboard will be, but it doesnt contain anything yet.
            var kbhold = document.createElement("div");
            kbhold.id = "keyboardHolder";
            kbhold.style.position = "absolute"
            //Im trying to position it relative to the main canvas (this doesnt really work well...)
            kbhold.style.left = (myCanvas.getBoundingClientRect().left + gameLeft) + "px";
            kbhold.style.top = (myCanvas.getBoundingClientRect().top + gameTop) + "px";

            //Helper method for keyboards in replays
            if (typeof Replayer != "undefined" && typeof Game == "undefined") {
                Replayer["pressKey"] = function(num, type) {
                    //console.log(num)
                    //type: 0=release 1=down 2=press
                    //Highlights the corresponding key
                    //gets array of all "kbkey" classes and takes cell "num" and hightlights it
                    document.getElementsByClassName("kbkey")[num].style.backgroundColor = type ? "lightgoldenrodyellow" : ""
                    if (type == 2) {
                        //from replay data you dont really know how long a key has been pressed. im using 100ms as a default
                        setTimeout(x => {
                            document.getElementsByClassName("kbkey")[num].style.backgroundColor = ""
                        }, 20)
                    }

                }
                //positions the keyboard holder differently for replays (thanks to meppydc)
                kbhold.style.left = (myCanvas.getBoundingClientRect().right + replayRight) + "px";
                kbhold.style.top = (myCanvas.getBoundingClientRect().top + replayTop) + "px";
            }

            document.body.appendChild(kbhold);


            //(important)
            //this is what is pasted into the keyboard holder and makes up the entire visual keyboard.
            //(i decompressed and tidied it up a bit)
            //basically it's a table consisting of 2 rows and 6 columns
            //maybe read up on css tables if you wanna add new cells

            //nah


            f = `

<style>
#kbo {text-align:center;position: absolute;font-size:15px;}
#kbo .tg {border-collapse:collapse;border-spacing:0;color:red;}
#kbo .tg td{padding:10px 5px;border-style:solid;border-width:2px;}
#kbo .tg th{padding:10px 5px;border-style:solid;border-width:2px;}
#kbo .tg .tg-wp8o{border-color:#000000;border:inherit;}
#kbo .tg .tg-tc3e{border-color:#34ff34;}
#kbo .tg .tg-jy2k{border-color:#f8a102;}
#kbo .tg .tg-p39m{border-color:#f8ff00;}
#kbo .kbkey {background-color:black;}
</style>

<div id=\"kbo\"><div id=\"kps\"></div>
<table class=\"tg\">
	<tr>
		<td class=\"tg-tc3e kbkey\">${labels[0]}</td>
		<td class=\"tg-tc3e kbkey\">${labels[1]}</td>
		<td class=\"tg-tc3e kbkey\">${labels[2]}</td>
		<td class=\"tg-wp8o\"></td>
		<td class=\"tg-jy2k kbkey\">${labels[3]}</td>
		<td class=\"tg-wp8o\"></td>
	</tr>
	<tr>
		<td class=\"tg-p39m kbkey\">${labels[4]}</td>
		<td class=\"tg-p39m kbkey\">${labels[5]}</td>
		<td class=\"tg-p39m kbkey\">${labels[6]}</td>
		<td class=\"tg-jy2k kbkey\">${labels[7]}</td>
		<td class=\"tg-jy2k kbkey\">${labels[8]}</td>
		<td class=\"tg-jy2k kbkey\">${labels[9]}</td>
	</tr>
</table>
</div>
`
            keyboardHolder.innerHTML = f

            //keyboard if in game (not replays)********************************************************************************************************************************
            if (typeof Game != "undefined") {

                document['addEventListener']('keydown', press);
                document['addEventListener']('keyup', press);

                function press(e) {
                    if (~Game['set2ings'].indexOf(e.keyCode)) {

                        //lol

                        //console.log(Game['set2ings'])//displays the keycodes of your controls
                        // left right sd hd ccw cw hold 180
                        //(important)
                        //listens to pressed keys and highlights the corresponsing div.
                        //the magic array converts between the actions and the div that is highlighted.
                        //If you change the order of the boxes, you might also have to adjust the numbers in this array
                        //           left right sd hd ccw cw hold 180 reset new
                        //order is: [6,    8,   1,  2, 3,  5,  4,  0] (.22 order)
                        //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.23 order)
                        //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.24 order)
                        //order is: [7,    9,   8,  2, 5,  6,  1,  4,   0    3] (.24.1 order)
                        //order is: [7,    9,   8,  3, 5,  6,  2,  4,   0    1] (.24.2 order)
                        var corresponding = [kbdisplay.left, kbdisplay.right, kbdisplay.sd, kbdisplay.hd, kbdisplay.ccw, kbdisplay.cw, kbdisplay.hold, kbdisplay['180'], kbdisplay.reset, kbdisplay.new][Game['set2ings'].indexOf(e.keyCode)]
                        document.getElementsByClassName("kbkey")[corresponding].style.backgroundColor = ["lightgoldenrodyellow", ""][+(e.type == "keyup")]
                    }
                }

                //This saves the settings array (which maps all actions in jstris to their keycodes) to a global variable for me to use (called Game['se2ings'])
                //resets every time a new game is started
                var set2ings = Game['prototype']['readyGo'].toString()
                set2ings = "Game['set2ings']=this.Settings.controls;" + trim(set2ings)
                Game['prototype']['readyGo'] = new Function(set2ings);

                //calculates kps from kpp and pps and writes it into the kps element
                var updateTextBarFunc = Game['prototype']['updateTextBar'].toString()
                updateTextBarFunc = trim(updateTextBarFunc) + ";kps.innerHTML='KPS: '+(this.getKPP()*this.placedBlocks/this.clock).toFixed(2)"
                Game['prototype']['updateTextBar'] = new Function(updateTextBarFunc);
            } else {

                //else: we're in a replay********************************************************************************************************************************

                var website = "jstris.jezevec10.com"
                var url = window.location.href
                var parts = url.split("/")

                if (parts[3] == "replay" && parts[2].endsWith(website)) {

                    //making a web request for the sole purpose of getting the DAS that was used for the replay
                    //(can be done more elegantly)
                    fetch("https://" + parts[2] + "/replay/data?id=" + (parts.length == 6 ? (parts[5] + "&live=1") : (parts[4])))
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(jsonResponse) {
                            var das = jsonResponse.c.das
                            var playT = Replayer['prototype']['playUntilTime'].toString()
                            var playTparams = getParams(playT);


                            //going though the list of actions done in the replay, and translating that into the timings for highlighting the divs
                            //i dont rememer how exactly i did this but it's not pretty
                            var insert1 = `
			kps.innerHTML="KPS: "+(this.getKPP()*this.placedBlocks/(this.clock/1000)).toFixed(2)
			this["delayedActions"] = []
			for (var i = 0; i < this["actions"].length; i++) {
				var action = JSON.parse(JSON.stringify(this["actions"][i]));
				if(action.a == 2 || action.a == 3){
					action.t = (action.t-` + das + `)>0 ? (action.t-` + das + `) : 0
				}
				this["delayedActions"].push(action)
			}

			this["delayedActions"].sort(function(a, b) {
    			return a.t - b.t;
			});

			var oldVals = [this["timer"],this["ptr"]]

			while (` + playTparams[0] + ` >= this['delayedActions'][this['ptr']]['t']) {
			    if (this['ptr']) {
			        this['timer'] += (this['delayedActions'][this['ptr']]['t'] - this['delayedActions'][this['ptr'] - 1]['t']) / 1000
			    };
			    if(this['delayedActions'][this['ptr']]["a"] == 2){
			    	Replayer["pressKey"](${kbdisplay.left},1)
			    }
				if(this['delayedActions'][this['ptr']]["a"] == 3){
			    	Replayer["pressKey"](${kbdisplay.right},1)
			    }

			    this['ptr']++;
			    if (this['delayedActions']['length'] === this['ptr']) {
			        this['reachedEnd'] = true;
			        break
			    }
			};

			this["timer"] = oldVals[0]
			this["ptr"] = oldVals[1]`


                            //this maps a specific action (this['actions'][this['ptr']]["a"]) to what to do with the divs
                            //the list of what action code equals what action is in that one harddrop forum post
                            //for example, if you DAS_LEFT then left will be held down.
                            //You might also adjust the numbers here (the first number in the pairs. remap them the same as in the magic array)
                            var insert2 = `
			var highlight = [[${kbdisplay.left},2],[${kbdisplay.right},2],[${kbdisplay.left},0],[${kbdisplay.right},0],[${kbdisplay.ccw},2],[${kbdisplay.cw},2],[${kbdisplay['180']},2],[${kbdisplay.hd},2],[${kbdisplay.sd},2],,[${kbdisplay.hold},2]][this['actions'][this['ptr']]["a"]]
			if(highlight){
				Replayer["pressKey"](...highlight)
			};
			`

                            playT = playT.replace(";", insert1 + ";")
                            playT = playT.replace("1000};", "1000};" + insert2)
                            Replayer['prototype']['playUntilTime'] = new Function(...playTparams, trim(playT));

                        //i hate myself - Oki
                        //I heard jez whips Oki - meppydc
                        //I hate myself as well once it stopped working when I did basically nothing - meppydc
                        //typing var names sucks - meppydc
                        //typos make me sad - meppydc
                        });
                }
            }
        }
    });
})();