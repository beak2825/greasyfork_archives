// ==UserScript==
// @name           BvS Scratchies - Hardcoded
// @namespace      BvS-Raaaak
// @version        4.06
// @history        4.06 Updated script for the new BvS domain (and for https)
// @history        4.05 Added a hardcoded copy of the shonuff strat (moo)
// @history        4.04 Hardcoded the claymore strat since the database went down (moo)
// @history        4.02 Added grant permissions (Updated by Channel28)
// @history        4.01 Removed dependance on E4X. (deprecated from Firefox 17. Never supported by Google Chrome)
// @history        4.00b Hotkey fix
// @history        4.00a Firefox 4 fix
// @history        4.00 Initial re-release (beta 3.00) [CCobo36]
// @history        4.00 Improved win chance, no more waiting time [CCobo36]
// @history        3.01 Added a button to move the GUI [TheSpy]
// @history        3.00 Initial re-release (beta 3.00) [TheSpy,North]
// @history        3.00.1 Improved the GUI (is now drag-able) [TheSpy]
// @history        3.00.2 Changed from functions to a single class [TheSpy]
// @history        3.00.3 Serverside optimizations [North]
// @history        2.08 Serverside and clientside optimizations [North]
// @history        2.07 Improved scratchy logic (no queries on won/lost&unfinished tickets) [North]
// @history        2.06 Removed images [TheSpy]
// @history        2.05 Updated with game update (removed randoms) [TheSpy]
// @history        2.04 Moved server [TheSpy]
// @history        2.03 Added yellow & green color for random spots [TheSpy]
// @history        2.02 Fixed 'text[1] is undefined' error [TheSpy]
// @history        2.01 Changed GET to POST [TheSpy]
// @history        2.00 Initial re-release (beta 2.00) [TheSpy]
// @history        1.00 Initial re-release (beta 1.00) [TheSpy,rveach]
// @description    Play the minigame Scratchies!
// @include        https://*animecubedgaming.com/billy/bvs/partyhouse.html
// @include        https://*animecubed.com/billy/bvs/partyhouse.html
// @include        http://*animecubedgaming.com/billy/bvs/partyhouse.html
// @include        http://*animecubed.com/billy/bvs/partyhouse.html
// @grant          GM_log
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27573/BvS%20Scratchies%20-%20Hardcoded.user.js
// @updateURL https://update.greasyfork.org/scripts/27573/BvS%20Scratchies%20-%20Hardcoded.meta.js
// ==/UserScript==

// server version
var serverVersion = "3.01";
var hotkeyEnable = false;


/*
	DOM Storage wrapper class (credits: http://userscripts.org/users/dtkarlsson)
	Constructor:
		var store = new DOMStorage({"session"|"local"}, [<namespace>]);
	Set item:
		store.setItem(<key>, <value>);
	Get item:
		store.getItem(<key>[, <default value>]);
	Remove item:
		store.removeItem(<key>);
	Get all keys in namespace as array:
		var array = store.keys();
*/
function DOMStorage(type, namespace) {
    var my = this;

    if (typeof(type) != "string")
        type = "session";
    switch (type) {
        case "local": my.storage = localStorage; break;
        case "session": my.storage = sessionStorage; break;
        default: my.storage = sessionStorage;
    }

    if (!namespace || typeof(namespace) != "string")
        namespace = "Greasemonkey";

    my.ns = namespace + ".";
    my.setItem = function(key, val) {
        try {
            my.storage.setItem(escape(my.ns + key), val);
        }
        catch (e) {
            GM_log(e);
        }
    },
        my.getItem = function(key, def) {
        try {
            var val = my.storage.getItem(escape(my.ns + key));
            if (val)
                return val;
            else
                return def;
        }
        catch (e) {
            return def;
        }
    }
    // Kludge, avoid Firefox crash
    my.removeItem = function(key) {
        try {
            my.storage.setItem(escape(my.ns + key), null);
        }
        catch (e) {
            GM_log(e);
        }
    }
    // Return array of all keys in this namespace
    my.keys = function() {
        var arr = [];
        var i = 0;
        do {
            try {
                var key = unescape(my.storage.key(i));
                if (key.indexOf(my.ns) == 0 && my.storage.getItem(key))
                    arr.push(key.slice(my.ns.length));
            }
            catch (e) {
                break;
            }
            i++;
        } while (true);
        return arr;
    }
}

// UI (credits: http://userscripts.org/users/dtkarlsson)
function Window(id, storage) {
    var my = this;
    my.id = id;
    my.offsetX = 0;
    my.offsetY = 0;
    my.moving = false;
    my.element = document.createElement("div");
    my.elementContainer = document.createElement("div");
    my.elementDrag = document.createElement("div");

    // Window dragging events
    my.drag = function(event) {
        if (my.moving) {
            my.elementContainer.style.left = (event.clientX - my.offsetX)+'px';
            my.elementContainer.style.top = (event.clientY - my.offsetY)+'px';
            event.preventDefault();
        }
    }
    my.stopDrag = function(event) {
        if (my.moving) {
            my.moving = false;
            var x = parseInt(my.elementContainer.style.left);
            var y = parseInt(my.elementContainer.style.top);
            if(x < 0) x = 0;
            if(y < 0) y = 0;
            storage.setItem(my.id + ".coord.x", x);
            storage.setItem(my.id + ".coord.y", y);
            my.elementContainer.style.opacity = 1;
            my.elementDrag.removeEventListener('mouseup', my.stopDrag, true);
            my.elementDrag.removeEventListener('mousemove', my.drag, true);
        }
    }
    my.startDrag = function(event) {
        if (event.button != 0) {
            my.moving = false;
            return;
        }
        my.offsetX = event.clientX - parseInt(my.elementContainer.style.left);
        my.offsetY = event.clientY - parseInt(my.elementContainer.style.top);
        my.moving = true;
        my.elementContainer.style.opacity = 0.75;
        event.preventDefault();
        my.elementDrag.addEventListener('mouseup', my.stopDrag, true);
        my.elementDrag.addEventListener('mousemove', my.drag, true);
    }

    my.elementContainer.id = id;
    my.elementDrag.className = "drag";
    my.elementDrag.innerHTML = "<img alt=\"MOVE\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFlTcEzraSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn9OuygAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuM6DpWdUAAABTSURBVChTbVFRFgAgBOP+l85IxHx4M2IkQk2XWVlyHSWJLjf/UHQOtoBBnSTy1R3Q4+4sjpry6DnV+yBK0ud8UEr+JWE2E0/XdA3zIHvNcWb+GQe/9ADpBBwp3wAAAABJRU5ErkJggg==\"/>";
    document.body.appendChild(my.elementContainer);
    my.elementContainer.appendChild(my.element);
    my.elementContainer.appendChild(my.elementDrag);
    my.elementDrag.addEventListener('mousedown', my.startDrag, true);

    if (storage.getItem(my.id + ".coord.x"))
        my.elementContainer.style.left = storage.getItem(my.id + ".coord.x") + "px";
    else
        my.elementContainer.style.left = "6px";
    if (storage.getItem(my.id + ".coord.y"))
        my.elementContainer.style.top = storage.getItem(my.id + ".coord.y") + "px";
    else
        my.elementContainer.style.top = "6px";
}

function FloatingScratchy() {
    var my = this;

    my.scratchy = "";
    my.pickCount = 0;
    my.bestPick = "";
    my.superPicked = false;
    my.query = new Array();

    // Tick and Scratch (browser)
    my.browserScript = "//<![CDATA["
        + "function tickAndScratch() {"
        + "   document.getElementById(\"cb0\").checked = true;"
        + "   document.getElementById(\"cb1\").checked = true;"
        + "   document.getElementById(\"cb2\").checked = true;"
        + "   document.getElementById(\"cby0\").checked = true;"
        + "   document.forms.namedItem(\"mainform2\").submit();"
        + "}"
        + "function UpdateSpot(className, count, prize) {"
        + "   if(className.length == count.length) {"
        + "      for(i = 0; i &lt; className.length; i++) {"
        + "         var td = document.getElementById(\"sid\" + i);"
        + "         td.className = className[i];"
        + "         td.innerHTML = \"[\" + count[i] + \"]\";"
        + "      }"
        + "      var span = document.getElementById(\"prize\");"
        + "      span.innerHTML = prize;"
        + "   }"
        + "}"
        + "//]]>";

    my.window = new Window("bvsScratchy", scratchySettings);

    // style
    GM_addStyle("#bvsScratchy {border: 2px solid #953704; position: fixed; z-index: 100; color: #000000; background-color: #EDD2A7; padding: 4px; text-align: left; min-width: 240px; min-height: 32px;} #bvsScratchy, #bvsScratchy * {font-size: 12px; font-family: arial;} #bvsScratchy dl {margin: 0; padding: 0;} #bvsScratchy dt {margin: 0; padding-top: 5px; font-size: 12px;} #bvsScratchy dd {margin: 0; padding: 0; font-size: 18px;} #bvsScratchy a {color: #A10000; font-weight: bold;} #bvsScratchy .drag {cursor: move; position:absolute; top: 5px; right:5px;} .high { font-weight: bold; color: #FFFF00; text-decoration: blink; } .mhigh { font-weight: bold; color: #00FF00; } .normal { font-weight: bold; } .mlow { font-weight: bold; color: #FF0000; } .low { font-weight: bold; color: #7F0000; text-decoration: line-through; } .special { font-weight: bold; border: 1px dotted white; background-color: #333;}");

    // get player's name
    my.playerName = function() {
        try {
            return document.evaluate("//input[@name='player' and @type='hidden']", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.value;
        }
        catch (e) {
            return "none";
        }
    }

    // parse the ticket
    my.parseImages = function() {
        try {
            var shown = new Array();
            var fail = false;

            var images = document.evaluate("//form[@name='mainform2']//img[contains(@src, '/billy/layout/scratch')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for(var i = 0; i < images.snapshotLength; i++) {
                var img = images.snapshotItem(i);
                var src = img.src;

                var visible = !/scratchspot.jpg$/i.test(src);
                var xSpot = /[^\d]X.jpg$/.test(src);
                var bonus = i >= 20;

                if(visible && !xSpot)
                    my.pickCount++;

                if(visible && !xSpot && bonus)
                    my.superPicked = true;

                if(xSpot)
                    shown.push(i);

                if(!visible){
                    my.scratchy += "-";
                }else{
                    switch(src[src.indexOf("scratch") + 7]){
                        case 'S':
                            my.scratchy += "S";
                            break;
                        case 'J':
                            my.scratchy += "B";
                            break;
                        case 'P':
                            my.scratchy += "P";
                            break;
                        case 'N':
                            my.scratchy += "L";
                            break;
                        case '1':
                            my.scratchy += "1";
                            break;
                        case '2':
                            my.scratchy += "2";
                            break;
                        case '3':
                            my.scratchy += "3";
                            break;
                    }

                    if(!xSpot && !bonus) {
                        if(my.bestPick == "")
                            my.bestPick = my.scratchy[i];
                        else if(my.bestPick != my.scratchy[i])
                            fail = true;
                    }
                }
            }

            // If billy bonus choosen and nothing else, go for claymore
            if (my.pickCount == 1 && my.superPicked == true && /B/.exec(my.scratchy.substr(20)) )
            {
                my.bestPick = "B";
            }



            if(fail)
                my.bestPick = "F";
            else if(my.bestPick == "")
                my.bestPick = "S";

            if(shown.length > 0 && my.pickCount == 0)
                scratchySettings.setItem(my.playerName() + ".show", shown.join());
        }
        catch(e) {
            alert("Exception caught!\n\nError name: " + e.name + "\nError message: " + e.message);
        }

    }

    // used to create the bloodline string
    my.hiddenSpots = function(n) {
        var temp = "";
        for(var i = 0; i<n; i++)
            temp += "-";
        return temp;
    }

    // create bloodline string
    my.getBloodline = function() {
        var bloodline;
        var lsShow = scratchySettings.getItem(my.playerName() + ".show").split(",");
        var show = [];

        for(var i = 0; i<lsShow.length; i++){
            show.push(parseInt(lsShow[i]));
        }

        if(lsShow.length == 0)
            bloodline = my.hiddenSpots(25);
        else{
            bloodline = my.hiddenSpots(show[0]) + my.scratchy[show[0]];
            if(lsShow.length == 1)
                bloodline += my.hiddenSpots(24-show[0]);
            if(lsShow.length == 2)
                bloodline += my.hiddenSpots(show[1]-show[0]-1) + my.scratchy[show[1]] + my.hiddenSpots(24-show[1]);
        }

        return bloodline;
    }

    // add a script
    my.addBrowserScript = function(script) {
        var head = document.getElementsByTagName("head")[0];
        var node = document.createElement("script");
        node.type = "text/javascript";
        node.innerHTML = script;
        head.appendChild(node);
    }

    // send a xml HTTP request
    my.queryServer = function(query) {
        try {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://bvs.ecansol.com/scratchies.php",
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "text/xml",
                    "Content-type": "application/x-www-form-urlencoded"
                },
                data: encodeURI(query),
                onerror: function(response) {
                    alert("BvS Scratchies failed!");
                },
                onload: function(response) {
                    try {
                        // Re-enable the hotkey
                        hotkeyEnable = true;

                        var text = response.responseText.split("|");
                        var suc = 0;
                        try {
                            suc = parseInt(text[0]);
                        }
                        catch(e) {
                            suc = -1;
                        }
                        switch(suc) {
                            case 1: {
                                my.update(4, text[1]);
                            } break;
                            case 2: {
                                my.update(1, text[1]);
                            } break;
                            default: {
                                alert("Error!\n\n" + response.responseText);
                            } break;
                        }
                    }
                    catch(e) {
                        alert("Exception caught!\n\nError name: " + e.name + "\nError message: " + e.message);
                    }
                }
            });
        }
        catch(e) {
            alert("Exception caught!\n\nError name: " + e.name + "\nError message: " + e.message);
        }
    }

    /*
	// Update the strategy information in DOM storage
	my.updateStrategy = function(event) {

		var objAnchor = event.target;
		var strategy_url = objAnchor.getAttribute("stratLocation");

		alert("Updating from: " + strategy_url);
		GM_xmlhttpRequest({
			method: "POST",
			url: strategy_url,
			headers: {
				"User-Agent": "Mozilla/5.0",
				"Accept": "text/xml",
				"Content-type": "application/x-www-form-urlencoded"
			},
			onload: function(response) {
				var stratArray = response.responseText.split("\n");

				var scratchySettings = new DOMStorage("local", "BvSScratchies");

				var i=0;
				for (i=0; i<95; i++)
				{
					var temp = stratArray[i].split("#");
					var bloodline = temp[0];
					var infostring = temp[1];
					scratchySettings.setItem(bloodline, infostring);
				}
				alert("Strategy Update Complete");
			}
		});
	}
    */

    my.updateStrategy = function(event) {

        var objAnchor = event.target;
        var strat = objAnchor.getAttribute("strat");

        if (strat === 'claymore') {
            stratData = {
                "BvSScratchies.--------------------1-1--": "50,18,236,522,5952,5021,23,91219~50,0,0,80,1025,851,15,30423&12,19,50,4597&2,6,80,5151&6,14,1025,10660&4,10,851,10015~0,18,6,0,65,42,9,1524&3,7,6,234&1,17,18,311&2,3,65,532&8,13,42,447~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,98,178,1976,1680,7,30400&5,12,98,4476&3,4,178,5331&8,14,1976,10547&10,19,1680,10046~0,0,132,264,2886,2448,15,28872&2,4,132,4320&1,12,264,4851&0,8,2886,10131&13,17,2448,9570",
                "BvSScratchies.--------------------1--1-": "47,16,235,507,6028,5036,21,91420~47,0,0,84,1013,842,12,30515&5,7,47,4630&16,17,84,5177&0,14,1013,10694&14,17,842,10014~0,16,6,0,67,37,3,1544&5,18,6,211&15,19,16,320&8,19,67,544&0,1,37,469~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,100,168,2044,1694,14,30399&12,17,100,4682&0,15,168,5232&0,8,2044,10741&8,9,1694,9744~0,0,129,255,2904,2463,11,28962&8,13,129,4357&14,18,255,4874&2,16,2904,10173&3,9,2463,9558",
                "BvSScratchies.--------------------1---1": "50,15,228,476,6030,4946,14,91280~50,0,228,0,0,0,21,14000&11,13,50,4716&3,11,5,220&0,0,0,0&10,15,94,4631&6,12,129,4433~0,15,0,476,0,0,22,15749&6,11,81,5274&3,17,15,310&0,0,0,0&7,12,158,5173&2,19,237,4992~0,0,0,0,6030,0,23,32185&2,17,1032,10711&2,9,61,539&0,0,0,0&2,18,2042,10789&9,12,2895,10146~0,0,0,0,0,4946,23,29346&11,13,821,9719&1,12,38,453&0,0,0,0&0,11,1648,9696&6,8,2439,9478",
                "BvSScratchies.--------------------11---": "47,14,217,569,5997,5135,22,91251~47,0,0,83,1001,859,4,30433&14,19,47,4601&3,11,83,5157&5,19,1001,10577&2,7,859,10098~0,14,5,0,61,47,13,1529&0,11,5,245&3,19,14,294&5,19,61,491&4,18,47,499~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,86,174,2058,1718,6,30424&7,10,86,4497&0,12,174,5234&1,17,2058,10601&4,9,1718,10092~0,0,126,312,2877,2511,15,28865&8,11,126,4347&3,12,312,4871&8,10,2877,10161&17,18,2511,9486",
                "BvSScratchies.---------------------1-1-": "49,15,224,485,5964,5121,20,91253~49,0,0,85,1029,867,14,30380&0,18,49,4534&5,18,85,5262&4,7,1029,10588&10,17,867,9996~0,15,6,0,63,43,1,1534&7,19,6,232&16,19,15,303&5,6,63,540&12,14,43,459~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,80,166,2064,1760,6,30451&1,7,80,4464&8,17,166,5147&10,11,2064,10758&10,13,1760,10082~0,0,138,234,2808,2451,11,28888&14,18,138,4348&16,19,234,4883&3,4,2808,10063&1,17,2451,9594",
                "BvSScratchies.---------------------1--1": "47,15,217,523,5912,5118,22,91372~47,0,0,87,993,856,0,30459&5,7,47,4607&1,10,87,5260&4,9,993,10622&7,10,856,9970~0,15,6,0,67,41,16,1516&5,9,6,211&17,19,15,305&0,2,67,531&0,6,41,469~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,82,178,1978,1728,12,30454&2,18,82,4563&0,6,178,5201&4,9,1978,10583&7,17,1728,10107~0,0,129,258,2874,2493,12,28943&0,17,129,4321&5,15,258,4863&14,17,2874,10075&7,16,2493,9684",
                "BvSScratchies.---------------------11--": "45,15,261,486,6025,5043,20,91304~45,0,0,82,1020,852,8,30427&12,14,45,4570&1,10,82,5212&10,15,1020,10610&5,7,852,10035~0,15,5,0,68,42,6,1512&2,4,5,239&7,14,15,293&4,7,68,548&1,10,42,432~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,88,176,2054,1704,9,30450&2,15,88,4534&0,17,176,5155&3,16,2054,10716&6,11,1704,10045~0,0,168,228,2883,2445,15,28915&9,13,168,4318&1,14,228,4908&0,11,2883,10141&2,11,2445,9548",
                "BvSScratchies.----------------------1-1": "51,16,261,459,6029,5104,15,91359~51,0,261,0,0,0,23,13709&3,12,51,4580&6,16,5,226&0,0,0,0&9,13,112,4595&0,3,144,4308~0,16,0,459,0,0,21,15526&5,19,78,5216&8,16,16,312&0,0,0,0&1,10,162,5157&0,7,219,4841~0,0,0,0,6029,0,23,32019&13,19,1059,10682&3,7,62,535&0,0,0,0&4,7,2040,10682&13,17,2868,10120~0,0,0,0,0,5104,23,30105&10,19,843,10029&10,12,41,462&0,0,0,0&17,18,1772,10022&1,11,2448,9592",
                "BvSScratchies.----------------------11-": "72,17,258,477,6069,5112,15,91379~72,0,258,0,0,0,20,13693&9,12,72,4555&4,14,6,226&0,0,0,0&12,16,102,4588&5,12,150,4324~0,17,0,477,0,0,21,15542&9,11,85,5176&2,12,17,295&0,0,0,0&2,8,158,5152&0,9,234,4919~0,0,0,0,6069,0,24,31987&9,13,1003,10615&4,17,67,546&0,0,0,0&4,17,2068,10731&17,18,2931,10095~0,0,0,0,0,5112,24,30157&0,17,868,10041&5,6,41,455&0,0,0,0&0,9,1734,10014&2,11,2469,9647",
                "BvSScratchies.-----------------------11": "57,17,229,460,6149,5094,13,91227~57,0,229,0,0,0,22,13665&12,15,57,4552&0,10,5,242&0,0,0,0&2,19,104,4489&1,7,120,4382~0,17,0,460,0,0,21,15474&8,10,81,5179&0,7,17,300&0,0,0,0&2,16,154,5136&7,14,225,4859~0,0,0,0,6149,0,22,31895&8,12,1005,10624&3,4,65,525&0,0,0,0&11,19,2172,10624&1,11,2907,10122~0,0,0,0,0,5094,20,30193&9,19,826,9935&7,8,42,454&0,0,0,0&0,19,1694,10140&7,15,2532,9664",
                "BvSScratchies.------------------------B": "225,18,0,777,10189,8615,5,182649~225,0,0,0,0,0,24,27580&7,12,225,27580&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,18,0,777,0,0,22,31104&0,0,0,0&0,15,18,465&11,17,204,15402&7,12,258,7941&11,17,315,7296~0,0,0,0,10189,0,21,63762&0,0,0,0&4,13,94,799&15,18,2924,31966&0,14,2950,15884&2,10,4221,15113~0,0,0,0,0,8615,22,60203&0,0,0,0&3,19,55,661&6,9,2430,30085&4,16,2542,15113&2,12,3588,14344",
                "BvSScratchies.-----------------------B-": "206,20,0,741,10206,8534,7,182526~206,0,0,0,0,0,23,27395&5,12,206,27395&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,20,0,741,0,0,20,31184&0,0,0,0&8,14,20,481&4,8,212,15604&14,18,220,7780&5,11,309,7319~0,0,0,0,10206,0,24,63664&0,0,0,0&13,16,91,787&5,16,2922,31934&13,14,2948,15807&14,18,4245,15136~0,0,0,0,0,8534,24,60283&0,0,0,0&1,17,60,712&1,2,2431,29973&3,4,2482,15190&2,5,3561,14408",
                "BvSScratchies.----------------------B--": "201,19,0,759,10666,8517,14,182690~201,0,0,0,0,0,22,27734&8,18,201,27734&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,19,0,759,0,0,23,31169&0,0,0,0&0,18,19,458&11,15,208,15453&15,19,236,7990&1,18,315,7268~0,0,0,0,10666,0,24,64579&0,0,0,0&7,8,97,825&18,19,2953,32312&0,1,2984,16198&18,19,4632,15244~0,0,0,0,0,8517,21,59208&0,0,0,0&3,7,55,650&0,1,2399,29547&10,18,2466,14809&12,13,3597,14202",
                "BvSScratchies.---------------------B---": "200,21,0,771,10184,8616,13,182604~200,0,0,0,0,0,21,27368&2,19,200,27368&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,21,0,771,0,0,20,31063&0,0,0,0&4,15,21,490&4,7,209,15438&0,14,232,7782&8,11,330,7353~0,0,0,0,10184,0,22,63643&0,0,0,0&3,4,89,800&11,17,2887,31660&10,11,2984,15975&4,16,4224,15208~0,0,0,0,0,8616,20,60530&0,0,0,0&0,7,57,659&9,15,2466,30232&0,10,2514,15216&2,7,3579,14423",
                "BvSScratchies.--------------------B----": "203,21,0,756,10424,8484,14,182595~203,0,0,0,0,0,20,27604&6,18,203,27604&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,21,0,756,0,0,23,31542&0,0,0,0&16,18,21,460&0,12,213,15855&3,15,222,7799&5,10,321,7428~0,0,0,0,10424,0,24,64261&0,0,0,0&0,1,93,817&18,19,2941,32157&9,19,3022,16125&18,19,4368,15162~0,0,0,0,0,8484,22,59188&0,0,0,0&4,7,59,683&4,13,2389,29520&3,17,2478,14858&7,12,3558,14127",
                "BvSScratchies.-------------------B-----": "12,3,73,57,349,303,21,4460~12,0,0,6,42,37,2,868&17,19,12,109&1,15,6,156&11,18,42,304&7,13,37,299~0,3,1,0,5,5,7,45&12,19,1,2&2,13,3,14&4,6,5,15&6,18,5,14~0,0,19,11,82,72,13,1817&0,19,19,213&2,16,11,328&9,16,82,635&0,12,72,641~0,0,20,16,94,78,6,875&13,19,20,87&9,18,16,142&3,8,94,323&0,3,78,323~0,0,33,24,126,111,18,855&4,19,33,99&6,15,24,161&3,9,126,304&6,11,111,291",
                "BvSScratchies.-------------------L-----": "8,4,50,89,1591,658,17,10045~8,0,50,0,0,0,23,1550&2,10,8,321&0,16,2,13&5,11,11,608&1,2,16,308&5,13,21,300~0,4,0,89,0,0,21,1781&9,15,12,347&5,15,4,23&2,15,18,727&7,13,26,338&3,5,33,346~0,0,0,0,1591,0,22,3187&6,19,198,621&6,19,11,31&8,19,385,1284&8,19,418,625&1,19,579,626~0,0,0,0,0,658,20,3527&2,10,80,687&1,16,6,31&0,10,147,1385&1,16,164,733&5,8,261,691",
                "BvSScratchies.-------------------P-----": "8,4,52,85,678,1313,23,9566~8,0,0,10,97,158,14,1928&1,18,8,288&4,9,10,358&3,12,97,742&17,19,158,540~0,4,2,0,10,6,10,98&6,13,2,25&3,14,4,21&5,9,10,35&9,19,6,17~0,0,11,18,165,315,10,3826&5,14,11,592&7,14,18,717&9,17,165,1415&2,19,315,1102~0,0,18,24,166,336,7,1886&5,15,18,306&6,15,24,344&1,13,166,663&8,19,336,573~0,0,21,33,240,498,1,1828&0,6,21,287&2,10,33,329&4,18,240,647&9,19,498,565",
                "BvSScratchies.-------------------S-----": "6,5,29,154,393,333,22,5025~6,0,0,21,52,39,18,1005&3,5,6,175&4,19,21,130&11,13,52,369&2,8,39,331~0,5,1,0,7,5,9,66&1,5,1,9&6,19,5,16&10,11,7,23&1,4,5,18~0,0,8,36,96,77,3,2044&5,11,8,304&4,19,36,275&1,4,96,739&2,15,77,726~0,0,8,40,88,80,18,960&0,11,8,138&8,19,40,147&4,12,88,346&3,10,80,329~0,0,12,57,150,132,4,950&5,17,12,144&12,19,57,126&1,5,150,338&0,13,132,342",
                "BvSScratchies.------------------B------": "12,3,81,58,357,293,22,4490~12,0,0,6,42,43,9,883&2,18,12,94&2,6,6,150&8,12,42,310&0,17,43,329~0,3,2,0,6,3,0,49&18,19,2,7&3,14,3,10&8,12,6,20&3,5,3,12~0,0,19,13,84,70,10,1818&11,18,19,186&0,15,13,335&12,16,84,697&8,9,70,600~0,0,24,18,102,78,7,920&15,18,24,99&6,10,18,156&12,17,102,346&3,12,78,319~0,0,36,21,123,99,4,820&6,18,36,94&1,16,21,157&5,13,123,304&0,17,99,265",
                "BvSScratchies.------------------L------": "9,4,43,94,1548,661,20,10217~9,0,0,12,213,82,6,2135&8,15,9,336&12,19,12,373&16,18,213,681&7,11,82,745~0,4,2,0,17,7,19,106&3,14,2,15&0,4,4,23&7,18,17,32&1,5,7,36~0,0,11,18,364,147,14,4000&8,16,11,654&4,11,18,725&5,18,364,1236&2,17,147,1385~0,0,12,28,390,170,13,2066&1,9,12,320&6,17,28,356&1,18,390,656&3,15,170,734~0,0,18,36,564,255,17,1910&4,13,18,309&5,10,36,340&9,18,564,609&1,15,255,652",
                "BvSScratchies.------------------P------": "7,4,43,91,703,1366,22,9554~7,0,0,12,88,170,9,1904&11,13,7,304&2,7,12,355&15,19,88,674&15,18,170,571~0,4,2,0,9,11,7,91&4,9,2,10&1,9,4,19&8,13,9,30&5,18,11,32~0,0,9,18,164,331,11,3850&6,7,9,576&7,9,18,695&9,15,164,1406&2,18,331,1173~0,0,14,28,172,332,8,1859&0,12,14,292&2,17,28,333&0,3,172,685&13,18,332,549~0,0,18,33,270,522,10,1850&1,4,18,291&2,6,33,319&5,6,270,665&4,18,522,575",
                "BvSScratchies.------------------S------": "5,5,38,161,398,337,22,5114~5,0,0,20,45,36,16,970&2,8,5,158&14,18,20,150&5,14,45,339&3,14,36,323~0,5,1,0,8,4,8,64&0,9,1,8&16,18,5,12&9,16,8,28&0,5,4,16~0,0,7,38,96,78,0,2055&16,17,7,304&5,18,38,260&2,13,96,746&1,13,78,745~0,0,12,46,102,90,12,1030&2,17,12,163&0,18,46,131&1,3,102,376&7,16,90,360~0,0,18,57,147,129,6,995&5,19,18,168&10,18,57,130&4,16,147,349&5,13,129,348",
                "BvSScratchies.-----------------B-------": "13,3,70,49,364,309,4,4366~13,0,70,0,0,0,24,475&15,17,13,104&15,17,2,4&17,18,15,186&12,17,20,84&9,17,33,97~0,3,0,49,0,0,23,776&0,7,6,160&1,18,3,14&0,1,9,317&10,12,16,158&9,11,18,127~0,0,0,0,364,0,23,1605&0,14,47,314&2,13,5,17&12,18,87,664&9,18,96,308&3,11,129,302~0,0,0,0,0,309,24,1510&0,11,37,302&0,2,3,10&6,12,69,579&2,12,80,331&5,18,120,288",
                "BvSScratchies.-----------------L-------": "8,5,47,95,1498,640,22,10124~8,0,0,13,180,77,3,2015&1,14,8,346&4,13,13,377&17,19,180,592&1,15,77,700~0,5,2,0,14,5,13,97&5,7,2,17&4,6,5,24&10,17,14,30&0,18,5,26~0,0,10,22,368,147,9,4034&10,14,10,646&1,19,22,723&11,17,368,1255&2,19,147,1410~0,0,14,24,384,174,14,2023&3,18,14,339&3,16,24,353&11,17,384,622&4,16,174,709~0,0,21,36,552,237,0,1955&1,4,21,330&5,18,36,361&14,17,552,592&2,5,237,672",
                "BvSScratchies.-----------------P-------": "7,4,43,85,684,1394,24,9525~7,0,0,11,79,169,12,1882&2,3,7,299&3,5,11,338&0,4,79,663&7,17,169,582~0,4,2,0,8,10,7,82&3,5,2,8&1,15,4,17&3,8,8,32&13,17,10,25~0,0,9,20,165,316,5,3798&4,12,9,579&12,18,20,667&14,18,165,1397&7,17,316,1155~0,0,14,24,180,368,13,1946&2,8,14,313&9,11,24,318&7,9,180,722&12,17,368,593~0,0,18,30,252,531,11,1817&1,8,18,278&9,13,30,296&7,8,252,678&4,17,531,565",
                "BvSScratchies.-----------------S-------": "6,4,41,152,392,338,22,5006~6,0,0,20,52,49,18,1068&7,19,6,168&14,17,20,150&0,10,52,378&3,12,49,372~0,4,2,0,5,4,16,62&0,12,2,9&9,17,4,17&2,4,5,20&7,9,4,16~0,0,8,36,94,77,0,2023&1,19,8,304&14,17,36,289&14,16,94,730&18,19,77,700~0,0,10,42,100,88,15,990&2,3,10,138&8,17,42,136&7,12,100,381&3,12,88,335~0,0,21,54,141,120,15,863&4,5,21,137&13,17,54,116&11,19,141,319&5,10,120,291",
                "BvSScratchies.----------------B--------": "12,3,74,59,338,333,20,4414~12,0,0,7,45,35,10,871&12,16,12,88&2,3,7,166&1,5,45,332&0,4,35,285~0,3,2,0,6,4,17,44&13,16,2,5&1,19,3,11&9,15,6,16&6,12,4,12~0,0,19,12,79,69,3,1762&16,17,19,205&13,14,12,336&5,17,79,618&1,6,69,603~0,0,20,16,82,78,3,899&0,16,20,95&8,17,16,190&5,6,82,290&10,11,78,324~0,0,33,24,126,147,7,838&15,16,33,91&0,18,24,141&6,17,126,288&1,11,147,318",
                "BvSScratchies.----------------L--------": "8,4,47,98,1507,637,20,10077~8,0,0,13,198,81,17,2067&4,9,8,336&5,9,13,366&6,16,198,649&9,13,81,716~0,4,2,0,14,8,1,107&11,19,2,17&9,19,4,18&6,16,14,36&3,17,8,36~0,0,10,18,356,162,2,3981&3,11,10,593&1,3,18,738&0,16,356,1224&13,19,162,1426~0,0,14,22,366,164,2,2003&3,11,14,332&11,15,22,342&4,16,366,616&0,17,164,713~0,0,21,45,573,222,15,1919&10,13,21,313&4,9,45,330&3,16,573,613&0,19,222,663",
                "BvSScratchies.----------------P--------": "9,4,42,77,693,1289,7,9491~9,0,42,0,0,0,24,1492&2,11,9,301&0,14,1,16&12,14,9,575&3,4,14,300&0,10,18,300~0,4,0,77,0,0,22,1685&4,6,10,307&10,11,4,22&9,12,17,689&6,18,20,350&14,19,30,317~0,0,0,0,693,0,24,3500&2,14,84,703&11,13,7,25&0,14,160,1378&4,13,190,745&12,14,252,649~0,0,0,0,0,1289,24,2814&0,16,155,553&1,16,13,29&15,16,321,1132&13,16,338,566&8,16,462,534",
                "BvSScratchies.----------------S--------": "5,4,37,158,402,328,21,4979~5,0,0,21,53,40,6,1022&4,9,5,161&7,16,21,139&1,19,53,380&7,12,40,342~0,4,1,0,5,5,15,53&0,7,1,7&2,16,4,14&6,12,5,15&9,19,5,17~0,0,8,35,91,77,14,2011&0,2,8,306&15,16,35,268&11,19,91,773&4,10,77,664~0,0,10,48,94,86,8,991&7,10,10,157&2,16,48,135&0,1,94,373&4,9,86,326~0,0,18,54,159,120,12,902&2,15,18,147&14,16,54,128&2,3,159,318&6,14,120,309",
                "BvSScratchies.---------------B---------": "14,3,55,48,382,329,17,4473~14,0,55,0,0,0,20,409&4,15,14,100&8,15,1,4&9,15,14,154&0,15,16,82&8,15,24,69~0,3,0,48,0,0,24,827&5,14,6,167&1,16,3,11&0,11,10,332&5,16,14,170&0,8,18,147~0,0,0,0,382,0,22,1668&0,5,43,323&1,18,5,13&8,14,84,660&4,13,112,351&0,5,138,321~0,0,0,0,0,329,20,1569&7,19,43,325&2,16,3,12&3,19,70,622&5,18,84,300&3,13,129,310",
                "BvSScratchies.---------------L---------": "9,4,49,98,1515,656,21,10144~9,0,0,13,197,79,8,2056&17,18,9,362&5,9,13,376&15,19,197,618&10,19,79,700~0,4,2,0,9,7,5,92&0,14,2,16&4,9,4,18&0,15,9,19&9,18,7,39~0,0,11,19,366,149,0,4024&3,13,11,595&2,16,19,713&15,18,366,1248&1,9,149,1468~0,0,12,24,370,172,0,2032&4,13,12,330&7,11,24,372&12,15,370,600&12,13,172,730~0,0,24,42,573,249,3,1940&5,8,24,287&2,13,42,356&15,18,573,624&1,12,249,673",
                "BvSScratchies.---------------P---------": "9,3,47,86,667,1344,24,9553~9,0,0,11,86,159,11,1900&2,4,9,322&7,13,11,337&1,9,86,695&6,15,159,546~0,3,2,0,8,12,19,100&0,3,2,18&4,5,3,21&2,3,8,32&6,15,12,29~0,0,9,18,158,343,0,3858&3,13,9,593&8,18,18,718&3,10,158,1384&13,15,343,1163~0,0,12,24,178,356,5,1911&1,3,12,289&1,12,24,344&2,14,178,695&2,15,356,583~0,0,24,33,237,474,13,1784&2,10,24,290&14,17,33,319&2,9,237,643&15,17,474,532",
                "BvSScratchies.---------------S---------": "5,5,30,151,392,331,24,5011~5,0,0,19,50,47,9,1053&3,18,5,162&4,15,19,127&1,11,50,382&13,17,47,382~0,5,1,0,5,6,0,62&1,8,1,13&15,17,5,10&4,17,5,20&5,13,6,19~0,0,7,34,85,76,1,1956&0,6,7,314&8,15,34,272&4,7,85,708&12,18,76,662~0,0,10,44,108,76,5,1007&2,3,10,147&9,15,44,149&6,8,108,383&7,10,76,328~0,0,12,54,144,126,2,933&11,12,12,125&1,15,54,123&11,17,144,339&3,6,126,346",
                "BvSScratchies.--------------B----------": "13,3,79,56,364,307,23,4543~13,0,0,7,49,42,10,928&1,14,13,107&7,9,7,170&17,18,49,323&8,15,42,328~0,3,2,0,5,5,17,52&7,14,2,5&7,18,3,13&10,16,5,15&5,19,5,19~0,0,20,11,82,73,12,1813&2,14,20,196&6,9,11,327&7,10,82,647&3,8,73,643~0,0,24,14,96,76,8,901&3,14,24,92&4,10,14,154&0,15,96,352&5,9,76,303~0,0,33,24,132,111,10,849&14,16,33,104&3,18,24,145&1,17,132,314&2,17,111,286",
                "BvSScratchies.--------------L----------": "7,4,50,100,1562,634,24,10248~7,0,0,13,197,85,8,2070&10,16,7,332&4,13,13,382&9,14,197,653&3,11,85,703~0,4,3,0,15,6,2,107&6,7,3,17&1,4,4,24&6,14,15,33&15,17,6,33~0,0,13,19,396,148,19,4095&3,16,13,605&11,12,19,761&9,14,396,1287&3,9,148,1442~0,0,16,26,396,164,18,2060&1,10,16,341&2,17,26,347&10,14,396,656&6,8,164,716~0,0,18,42,558,231,6,1916&3,16,18,316&12,17,42,338&10,14,558,578&1,2,231,684",
                "BvSScratchies.--------------P----------": "9,4,49,78,661,1290,21,9203~9,0,0,10,81,159,18,1809&10,16,9,343&11,17,10,324&0,9,81,617&13,14,159,525~0,4,2,0,7,10,4,84&16,19,2,17&9,15,4,15&2,9,7,27&11,14,10,25~0,0,10,18,154,307,4,3695&8,17,10,609&6,16,18,696&1,17,154,1296&14,19,307,1094~0,0,16,20,176,322,7,1815&5,12,16,267&1,15,20,311&5,6,176,670&1,14,322,567~0,0,21,30,243,492,12,1800&1,6,21,272&0,18,30,335&6,17,243,663&9,14,492,530",
                "BvSScratchies.--------------S----------": "7,5,30,144,426,349,12,5130~7,0,30,0,0,0,21,809&15,19,7,173&0,11,1,8&1,17,6,313&8,10,8,157&4,19,15,158~0,5,0,144,0,0,24,672&6,14,18,124&11,14,5,12&14,18,31,262&6,14,38,137&13,14,57,137~0,0,0,0,426,0,21,1901&5,9,56,392&1,13,4,15&7,18,96,745&1,10,108,373&16,19,162,376~0,0,0,0,0,349,22,1748&4,6,40,337&0,1,3,13&0,8,78,701&4,7,90,368&4,9,138,329",
                "BvSScratchies.-------------B-----------": "12,4,77,52,357,299,24,4434~12,0,0,7,50,40,17,923&5,13,12,97&6,7,7,147&2,14,50,352&0,11,40,327~0,4,1,0,5,4,5,46&6,13,1,4&11,14,4,15&8,9,5,16&0,19,4,11~0,0,19,11,80,69,2,1758&5,13,19,192&14,19,11,335&11,17,80,623&0,10,69,608~0,0,24,16,96,78,19,899&7,13,24,92&10,15,16,183&9,16,96,334&4,17,78,290~0,0,33,18,126,108,14,808&2,13,33,92&4,19,18,149&7,18,126,288&6,17,108,279",
                "BvSScratchies.-------------L-----------": "8,4,52,99,1542,601,20,10049~8,0,0,14,189,84,12,2016&0,17,8,323&1,11,14,331&6,13,189,632&0,15,84,730~0,4,2,0,13,7,12,101&6,10,2,16&0,6,4,25&3,13,13,30&5,11,7,30~0,0,10,20,390,147,5,4061&3,12,10,674&0,2,20,673&1,13,390,1273&2,10,147,1441~0,0,16,26,398,144,14,1999&5,10,16,341&12,15,26,312&4,13,398,673&0,7,144,673~0,0,24,39,552,219,9,1872&8,18,24,302&12,19,39,319&2,13,552,596&0,1,219,655",
                "BvSScratchies.-------------P-----------": "9,4,45,79,703,1284,17,9550~9,0,45,0,0,0,24,1530&3,5,9,325&0,9,1,12&5,8,12,599&3,12,14,296&1,8,18,298~0,4,0,79,0,0,21,1697&6,15,10,331&4,16,4,20&1,7,16,671&0,14,20,354&18,19,33,321~0,0,0,0,703,0,23,3512&1,16,92,744&7,8,7,28&4,8,163,1389&7,12,186,703&8,11,255,648~0,0,0,0,0,1284,23,2811&2,13,154,554&10,13,12,29&13,16,310,1110&7,13,322,565&6,13,486,553",
                "BvSScratchies.-------------S-----------": "6,6,34,153,407,327,21,5041~6,0,0,17,49,45,7,1004&2,16,6,165&4,13,17,125&5,12,49,373&3,11,45,341~0,6,1,0,6,6,19,70&1,18,1,6&10,13,6,18&0,8,6,20&1,15,6,26~0,0,6,37,97,71,5,1983&0,14,6,328&13,15,37,250&11,14,97,750&2,6,71,655~0,0,12,42,108,88,15,1035&2,16,12,159&13,16,42,142&12,16,108,378&7,19,88,356~0,0,15,57,147,117,4,949&6,17,15,162&5,13,57,118&1,12,147,350&0,15,117,319",
                "BvSScratchies.------------B------------": "13,3,63,51,356,337,8,4416~13,0,63,0,0,0,23,440&12,14,13,97&0,12,1,3&12,14,16,177&6,12,22,80&3,12,24,83~0,3,0,51,0,0,24,789&0,10,7,160&3,19,3,13&6,17,10,311&3,16,16,163&9,17,18,142~0,0,0,0,356,0,22,1556&0,1,44,309&1,10,5,14&1,10,80,630&2,18,86,319&4,15,141,284~0,0,0,0,0,337,22,1631&4,14,39,329&2,7,4,11&7,17,73,639&0,3,86,314&0,10,135,338",
                "BvSScratchies.------------L------------": "10,4,45,81,1532,638,5,10090~10,0,45,0,0,0,22,1621&2,11,10,326&2,16,2,14&14,17,10,653&0,11,12,310&8,19,21,318~0,4,0,81,0,0,24,1807&10,15,11,371&4,7,4,21&3,6,18,704&0,9,22,355&1,11,30,356~0,0,0,0,1532,0,22,3193&0,12,187,603&0,12,16,42&12,19,376,1280&1,12,386,637&4,12,567,631~0,0,0,0,0,638,22,3469&2,9,80,720&3,4,7,22&8,18,141,1330&13,19,158,701&2,8,252,696",
                "BvSScratchies.------------P------------": "9,4,47,87,688,1339,22,9584~9,0,0,13,94,162,5,1929&10,13,9,315&6,14,13,354&7,14,94,720&12,15,162,540~0,4,1,0,9,9,11,86&0,13,1,14&1,15,4,19&3,9,9,33&2,12,9,20~0,0,11,19,164,327,14,3848&1,16,11,611&0,6,19,685&2,11,164,1424&6,12,327,1128~0,0,14,22,172,352,1,1924&7,9,14,324&9,18,22,339&0,15,172,661&11,12,352,600~0,0,21,33,249,489,16,1797&4,18,21,266&3,4,33,322&2,4,249,638&6,12,489,571",
                "BvSScratchies.------------S------------": "5,5,33,150,389,333,24,5002~5,0,0,22,52,36,3,1000&11,14,5,166&4,12,22,149&4,16,52,374&1,16,36,311~0,5,1,0,6,6,15,69&0,3,1,14&12,14,5,13&5,9,6,19&5,8,6,23~0,0,10,34,91,73,7,2006&17,19,10,322&5,12,34,278&9,11,91,706&3,19,73,700~0,0,10,40,108,86,13,1026&3,7,10,154&0,12,40,143&0,18,108,373&9,16,86,356~0,0,12,54,132,132,17,901&4,15,12,129&12,19,54,109&1,15,132,325&0,18,132,338",
                "BvSScratchies.-----------B-------------": "13,3,74,56,335,331,22,4433~13,0,0,7,45,42,12,902&11,14,13,90&8,15,7,135&4,17,45,340&7,17,42,337~0,3,2,0,5,5,2,53&11,16,2,6&8,15,3,11&4,16,5,14&1,15,5,22~0,0,18,11,79,68,17,1760&3,11,18,199&3,10,11,316&0,4,79,636&1,8,68,609~0,0,24,14,86,84,2,877&10,11,24,89&10,16,14,165&10,19,86,305&9,16,84,318~0,0,30,24,120,132,15,841&4,11,30,86&6,12,24,156&7,12,120,294&7,9,132,305",
                "BvSScratchies.-----------L-------------": "9,4,53,88,1471,626,20,10064~9,0,0,10,199,80,10,1959&7,14,9,327&2,18,10,331&1,11,199,647&2,4,80,654~0,4,3,0,14,6,5,98&2,14,3,12&0,19,4,19&10,11,14,37&4,15,6,30~0,0,11,18,362,142,3,4014&9,18,11,629&10,14,18,752&7,11,362,1244&13,19,142,1389~0,0,12,24,380,170,13,2061&3,12,12,327&5,12,24,377&2,11,380,632&17,19,170,725~0,0,27,36,516,228,6,1932&2,8,27,332&4,10,36,368&2,11,516,579&1,2,228,653",
                "BvSScratchies.-----------P-------------": "9,4,48,86,701,1333,21,9545~9,0,0,11,95,161,9,1928&1,17,9,292&1,18,11,334&2,16,95,739&6,11,161,563~0,4,2,0,7,12,16,87&12,17,2,12&3,17,4,12&4,7,7,30&11,15,12,33~0,0,10,18,163,324,6,3754&2,17,10,582&4,10,18,666&0,5,163,1365&0,11,324,1141~0,0,12,24,184,350,8,1941&0,17,12,280&1,2,24,356&3,18,184,735&6,11,350,570~0,0,24,33,252,486,19,1835&4,13,24,308&15,16,33,319&0,7,252,665&1,11,486,543",
                "BvSScratchies.-----------S-------------": "5,5,36,144,382,324,21,4981~5,0,0,19,50,44,8,1013&2,14,5,156&11,18,19,145&2,7,50,374&12,13,44,338~0,5,2,0,7,5,10,78&2,14,2,12&6,11,5,17&3,7,7,25&3,5,5,24~0,0,9,32,91,66,14,1946&3,15,9,314&6,11,32,263&7,9,91,741&0,13,66,628~0,0,10,36,96,86,13,985&10,15,10,150&11,12,36,129&15,19,96,352&0,15,86,354~0,0,15,57,138,123,19,959&0,6,15,154&5,11,57,132&3,4,138,346&5,9,123,327",
                "BvSScratchies.----------B--------------": "12,3,81,59,352,300,22,4434~12,0,0,6,52,40,16,914&3,10,12,97&14,18,6,155&3,18,52,355&3,18,40,307~0,3,2,0,6,3,8,50&4,10,2,8&1,4,3,14&1,17,6,16&13,19,3,12~0,0,17,13,81,71,7,1718&4,10,17,177&6,18,13,291&1,17,81,646&14,19,71,604~0,0,26,16,84,72,1,895&10,19,26,104&4,12,16,191&2,14,84,311&9,13,72,289~0,0,36,24,129,114,11,857&7,10,36,79&15,16,24,165&3,16,129,293&3,14,114,320",
                "BvSScratchies.----------L--------------": "8,4,47,95,1568,647,23,10138~8,0,0,13,191,84,5,2092&2,19,8,361&13,15,13,395&10,17,191,624&0,17,84,712~0,4,1,0,12,10,7,104&0,12,1,19&13,15,4,19&8,10,12,31&0,6,10,35~0,0,10,20,393,154,18,4028&2,6,10,629&7,14,20,730&10,11,393,1291&2,16,154,1378~0,0,12,26,408,174,19,2027&5,11,12,296&9,13,26,347&9,10,408,673&2,16,174,711~0,0,24,36,564,225,17,1887&2,4,24,296&1,11,36,332&10,19,564,602&0,2,225,657",
                "BvSScratchies.----------P--------------": "9,4,50,79,702,1236,8,9479~9,0,50,0,0,0,23,1526&1,7,9,305&0,4,1,8&12,17,11,605&2,15,14,299&9,18,24,309~0,4,0,79,0,0,22,1756&11,15,11,350&6,9,4,29&1,18,16,699&14,19,22,327&9,17,30,351~0,0,0,0,702,0,21,3507&5,13,88,719&0,16,7,28&3,9,164,1407&0,15,176,683&9,15,267,670~0,0,0,0,0,1236,22,2690&10,11,163,578&2,10,9,25&2,10,286,1019&10,19,304,544&10,18,474,524",
                "BvSScratchies.----------S--------------": "5,6,33,146,374,344,22,5016~5,0,0,18,47,45,4,983&1,19,5,158&10,14,18,121&15,18,47,357&0,12,45,347~0,6,1,0,6,5,15,54&0,2,1,11&6,10,6,12&0,13,6,16&1,17,5,15~0,0,7,36,94,79,0,2067&2,9,7,325&9,10,36,299&12,17,94,760&6,11,79,683~0,0,10,38,92,92,13,969&6,8,10,158&10,11,38,124&1,19,92,356&4,11,92,331~0,0,15,54,135,123,6,943&13,14,15,137&3,10,54,136&7,12,135,332&8,15,123,338",
                "BvSScratchies.---------B---------------": "13,3,71,53,347,296,21,4426~13,0,0,7,47,36,2,900&9,19,13,101&5,11,7,163&17,18,47,346&8,19,36,290~0,3,2,0,6,4,4,52&2,9,2,5&7,13,3,12&0,11,6,17&0,13,4,18~0,0,17,11,78,69,0,1735&9,19,17,176&1,6,11,318&4,19,78,622&1,4,69,619~0,0,22,14,90,76,5,884&6,9,22,86&7,19,14,152&12,17,90,331&4,7,76,315~0,0,30,21,126,111,15,855&9,16,30,96&10,11,21,166&1,6,126,299&11,16,111,294",
                "BvSScratchies.---------L---------------": "8,5,46,80,1526,633,0,10054~8,0,46,0,0,0,21,1579&4,11,8,304&1,18,1,10&6,15,10,646&3,12,14,321&3,11,21,298~0,5,0,80,0,0,24,1890&5,15,11,377&8,17,5,28&4,11,17,767&4,8,22,366&6,16,30,352~0,0,0,0,1526,0,22,3094&1,9,184,599&9,10,12,29&4,9,352,1211&9,10,402,634&9,11,576,621~0,0,0,0,0,633,22,3491&1,4,85,726&3,4,6,30&8,16,141,1352&11,14,164,692&14,18,237,691",
                "BvSScratchies.---------P---------------": "9,4,47,86,682,1343,23,9614~9,0,0,10,96,163,12,1919&2,14,9,291&5,14,10,340&5,13,96,729&9,19,163,559~0,4,3,0,9,8,15,102&10,13,3,16&1,12,4,23&1,7,9,40&3,9,8,23~0,0,8,19,149,329,17,3799&0,12,8,594&12,19,19,746&4,12,149,1305&9,13,329,1154~0,0,12,24,170,360,3,1945&0,19,12,291&5,12,24,336&8,10,170,695&8,9,360,623~0,0,24,33,258,483,18,1849&3,13,24,283&11,16,33,340&0,13,258,685&9,17,483,541",
                "BvSScratchies.---------S---------------": "6,5,34,153,367,320,21,5006~6,0,0,20,53,43,19,1025&7,18,6,151&9,17,20,141&0,11,53,414&5,17,43,319~0,5,2,0,6,4,18,60&7,16,2,12&9,13,5,17&12,13,6,15&3,11,4,16~0,0,8,35,88,72,2,1984&13,14,8,316&9,11,35,286&4,5,88,719&13,18,72,663~0,0,12,38,88,84,10,1011&4,18,12,169&9,14,38,147&12,19,88,344&5,7,84,351~0,0,12,60,132,117,8,926&5,10,12,135&2,9,60,141&2,15,132,325&13,14,117,325",
                "BvSScratchies.--------B----------------": "12,4,79,55,355,302,24,4482~12,0,0,6,45,42,0,873&8,16,12,92&6,15,6,153&1,13,45,335&6,16,42,293~0,4,2,0,5,4,17,47&5,8,2,7&4,12,4,12&13,16,5,11&3,13,4,17~0,0,18,11,85,77,4,1831&0,8,18,187&14,16,11,352&6,11,85,651&0,12,77,641~0,0,20,14,88,74,19,878&8,10,20,101&2,11,14,170&1,15,88,329&7,11,74,278~0,0,39,24,132,105,1,853&4,8,39,95&9,16,24,158&10,13,132,315&3,11,105,285",
                "BvSScratchies.--------L----------------": "8,5,47,84,1545,624,14,10082~8,0,47,0,0,0,24,1639&1,18,8,327&1,10,1,12&10,15,12,671&4,18,16,317&2,4,18,312~0,5,0,84,0,0,20,1881&6,11,13,391&10,12,5,19&4,17,16,770&1,13,22,375&3,19,33,326~0,0,0,0,1545,0,24,3150&4,8,188,622&0,8,14,34&8,13,372,1267&8,17,392,609&7,8,579,618~0,0,0,0,0,624,24,3412&12,17,80,680&3,5,6,28&1,15,143,1329&1,5,164,723&1,6,231,652",
                "BvSScratchies.--------P----------------": "8,4,49,82,676,1350,23,9637~8,0,0,11,88,161,19,1963&3,6,8,309&5,10,11,359&13,18,88,725&0,8,161,570~0,4,2,0,8,10,3,106&0,6,2,21&13,16,4,23&16,17,8,36&6,8,10,26~0,0,10,18,164,316,12,3841&10,15,10,578&9,13,18,697&1,7,164,1426&8,19,316,1140~0,0,16,20,170,338,9,1897&13,15,16,282&4,16,20,350&14,18,170,689&0,8,338,576~0,0,21,33,246,525,1,1830&4,7,21,287&14,18,33,326&4,19,246,669&7,8,525,548",
                "BvSScratchies.--------S----------------": "5,7,30,148,390,328,20,5047~5,0,0,22,47,41,2,1057&1,10,5,185&8,19,22,142&3,12,47,372&0,17,41,358~0,7,2,0,5,5,0,65&11,17,2,11&7,8,7,14&1,5,5,19&5,9,5,21~0,0,6,32,85,81,0,1986&16,18,6,319&2,8,32,286&4,16,85,689&3,14,81,692~0,0,10,40,112,78,17,977&5,12,10,167&1,8,40,141&4,11,112,353&0,2,78,316~0,0,12,54,141,123,19,962&1,17,12,146&8,17,54,122&1,3,141,347&11,16,123,347",
                "BvSScratchies.-------B-----------------": "12,3,72,57,339,297,24,4412~12,0,0,9,48,38,8,924&7,13,12,100&0,17,9,173&6,18,48,343&9,12,38,308~0,3,2,0,4,5,6,43&1,7,2,6&0,12,3,10&3,16,4,10&3,15,5,17~0,0,18,13,80,65,1,1780&7,10,18,198&8,11,13,362&3,15,80,648&5,17,65,572~0,0,22,14,90,78,12,836&7,18,22,91&9,17,14,162&2,17,90,309&2,14,78,274~0,0,30,21,117,111,9,829&7,16,30,91&12,14,21,151&6,19,117,303&17,19,111,284",
                "BvSScratchies.-------L-----------------": "11,4,44,85,1626,652,4,10204~11,0,44,0,0,0,21,1582&2,9,11,337&0,1,1,17&0,1,9,600&9,13,16,340&0,12,18,288~0,4,0,85,0,0,20,1839&0,17,11,367&0,9,4,23&5,17,19,727&3,11,22,367&16,18,33,355~0,0,0,0,1626,0,23,3267&7,11,199,635&1,7,13,31&6,7,396,1288&7,18,430,663&3,7,588,650~0,0,0,0,0,652,23,3516&1,5,80,682&0,19,7,36&18,19,147,1409&10,15,160,688&6,8,258,701",
                "BvSScratchies.-------P-----------------": "8,4,45,79,695,1297,18,9578~8,0,45,0,0,0,23,1532&0,5,8,316&4,8,2,16&1,12,10,615&6,8,12,319&4,15,21,266~0,4,0,79,0,0,20,1729&14,15,13,355&0,2,4,19&5,14,16,666&5,15,20,335&4,14,30,354~0,0,0,0,695,0,22,3482&10,14,94,736&0,9,10,39&12,13,159,1385&8,16,186,696&13,19,246,626~0,0,0,0,0,1297,20,2835&7,19,154,538&6,7,8,21&6,7,313,1129&7,15,330,578&4,7,492,569",
                "BvSScratchies.-------S-----------------": "5,5,30,147,366,331,20,5031~5,0,0,20,47,40,13,991&1,12,5,167&7,11,20,132&4,10,47,345&0,18,40,347~0,5,1,0,6,5,10,61&4,6,1,6&7,18,5,18&12,13,6,21&16,17,5,16~0,0,7,33,90,77,5,2032&4,10,7,323&7,12,33,267&6,9,90,739&2,15,77,703~0,0,10,40,94,92,5,1050&0,3,10,179&7,18,40,145&0,8,94,362&0,10,92,364~0,0,12,54,129,117,13,897&2,15,12,142&7,10,54,116&1,2,129,320&5,15,117,319",
                "BvSScratchies.------B------------------": "13,3,78,53,345,308,21,4438~13,0,0,6,47,39,10,887&2,6,13,99&4,13,6,151&9,19,47,326&1,18,39,311~0,3,1,0,3,4,5,36&3,6,1,3&0,2,3,10&0,3,3,8&9,14,4,15~0,0,19,11,84,73,0,1784&5,6,19,202&10,17,11,303&2,10,84,672&9,12,73,607~0,0,28,12,82,78,4,883&6,15,28,92&0,3,12,151&0,14,82,314&7,10,78,326~0,0,30,24,129,114,3,848&6,18,30,106&11,13,24,175&5,16,129,303&13,14,114,264",
                "BvSScratchies.------L------------------": "7,4,52,92,1516,644,24,10173~7,0,0,12,182,81,1,2031&0,16,7,310&8,11,12,399&5,6,182,598&0,4,81,724~0,4,2,0,9,6,8,90&12,19,2,22&15,16,4,16&1,6,9,21&17,18,6,31~0,0,11,20,392,155,19,4102&12,14,11,626&5,8,20,727&6,11,392,1327&10,16,155,1422~0,0,12,24,372,168,13,1982&1,17,12,296&0,18,24,371&6,17,372,609&9,16,168,706~0,0,27,36,561,234,0,1968&5,15,27,306&2,10,36,364&6,16,561,627&2,8,234,671",
                "BvSScratchies.------P------------------": "8,4,46,91,692,1318,23,9510~8,0,0,13,95,145,18,1897&0,9,8,317&10,11,13,371&2,10,95,718&6,12,145,491~0,4,2,0,8,10,8,97&1,19,2,23&2,5,4,23&2,11,8,29&6,13,10,22~0,0,10,17,158,323,19,3783&4,13,10,649&4,18,17,680&3,7,158,1306&1,6,323,1148~0,0,16,22,170,348,4,1907&12,17,16,331&0,1,22,337&3,8,170,668&5,6,348,571~0,0,18,39,261,492,19,1826&4,9,18,293&1,11,39,313&14,15,261,663&5,6,492,557",
                "BvSScratchies.------S------------------": "5,6,32,159,396,340,22,5059~5,0,0,20,48,45,13,990&9,18,5,176&0,6,20,141&3,8,48,331&4,16,45,342~0,6,1,0,6,5,2,63&0,14,1,8&6,18,6,13&11,13,6,23&8,9,5,19~0,0,6,36,94,82,9,2033&0,8,6,300&6,12,36,266&3,13,94,767&16,18,82,700~0,0,10,40,98,82,3,995&0,11,10,157&6,11,40,130&8,9,98,370&8,19,82,338~0,0,15,63,150,126,1,978&18,19,15,148&6,16,63,136&10,13,150,359&0,13,126,335",
                "BvSScratchies.-----B-------------------": "12,4,80,55,362,308,22,4426~12,0,0,8,44,40,7,900&5,16,12,103&9,17,8,176&8,17,44,310&0,13,40,311~0,4,1,0,5,4,13,34&0,5,1,4&7,18,4,8&11,19,5,10&0,4,4,12~0,0,19,12,84,71,16,1798&5,19,19,198&4,14,12,322&2,19,84,679&0,3,71,599~0,0,24,14,94,82,10,903&5,14,24,104&8,15,14,157&15,19,94,350&12,17,82,292~0,0,36,21,135,111,11,791&2,5,36,83&1,4,21,147&2,18,135,293&12,19,111,268",
                "BvSScratchies.-----L-------------------": "7,4,57,94,1553,634,24,10165~7,0,0,13,192,81,12,2073&6,14,7,349&7,16,13,371&5,14,192,636&1,6,81,717~0,4,1,0,13,8,9,78&0,3,1,13&4,16,4,21&5,11,13,22&1,2,8,22~0,0,13,21,368,151,1,4077&4,12,13,668&10,19,21,719&5,16,368,1239&6,7,151,1451~0,0,16,24,416,160,13,1989&8,11,16,306&11,14,24,351&0,5,416,662&17,18,160,670~0,0,27,36,564,234,8,1948&17,19,27,317&0,18,36,348&1,5,564,620&1,3,234,663",
                "BvSScratchies.-----P-------------------": "9,4,48,87,684,1316,24,9482~9,0,0,9,94,170,13,1887&1,4,9,302&7,14,9,330&1,15,94,683&5,17,170,572~0,4,2,0,7,10,1,80&0,8,2,15&6,11,4,14&0,8,7,26&0,5,10,25~0,0,9,17,157,316,1,3710&10,12,9,563&14,17,17,670&13,16,157,1385&5,19,316,1092~0,0,16,28,168,316,4,1936&0,2,16,316&6,16,28,343&6,19,168,703&5,12,316,574~0,0,21,33,258,504,14,1869&0,8,21,288&8,11,33,328&8,12,258,690&5,19,504,563",
                "BvSScratchies.-----S-------------------": "6,4,34,152,392,346,23,5031~6,0,0,21,52,42,2,1007&9,17,6,154&5,9,21,124&14,15,52,385&6,19,42,344~0,4,1,0,7,5,18,64&0,12,1,5&5,19,4,12&11,13,7,22&3,15,5,25~0,0,7,34,90,81,0,2000&11,12,7,319&4,5,34,245&2,6,90,709&11,12,81,727~0,0,14,40,108,98,6,1037&8,9,14,158&1,5,40,142&0,10,108,385&9,11,98,352~0,0,12,57,135,120,2,923&0,1,12,139&3,5,57,123&14,15,135,341&6,17,120,320",
                "BvSScratchies.----B--------------------": "13,3,80,57,362,311,24,4565~13,0,0,8,47,40,19,863&4,5,13,90&7,10,8,153&2,17,47,328&6,17,40,292~0,3,2,0,6,4,10,48&3,4,2,3&13,15,3,19&8,11,6,15&6,13,4,11~0,0,19,14,90,76,9,1892&4,19,19,203&13,15,14,353&0,11,90,711&6,12,76,625~0,0,26,14,90,80,6,892&4,5,26,97&5,8,14,174&3,5,90,308&10,19,80,313~0,0,33,21,129,111,19,870&4,11,33,94&1,13,21,165&1,17,129,313&1,11,111,298",
                "BvSScratchies.----L--------------------": "9,5,52,83,1627,638,9,10152~9,0,52,0,0,0,24,1591&3,13,9,293&1,7,1,14&7,8,11,633&16,19,16,312&16,19,24,339~0,5,0,83,0,0,21,1840&11,15,10,392&12,16,5,27&7,16,18,673&13,19,22,381&0,5,33,367~0,0,0,0,1627,0,22,3237&4,12,194,625&0,4,16,38&4,5,379,1283&2,4,396,626&4,12,642,665~0,0,0,0,0,638,21,3484&3,6,82,723&3,19,8,40&2,19,142,1364&10,19,172,705&3,6,234,652",
                "BvSScratchies.----P--------------------": "8,4,46,89,666,1302,24,9434~8,0,0,11,86,171,7,1930&14,19,8,307&9,11,11,332&2,9,86,717&4,11,171,574~0,4,2,0,8,11,14,105&5,18,2,21&3,10,4,23&2,5,8,36&4,18,11,25~0,0,9,21,156,314,6,3728&3,5,9,611&17,19,21,676&0,19,156,1331&2,4,314,1110~0,0,14,24,170,338,13,1899&7,19,14,258&12,15,24,331&1,19,170,700&4,9,338,610~0,0,21,33,246,468,0,1772&5,19,21,267&6,15,33,325&7,14,246,653&4,5,468,527",
                "BvSScratchies.----S--------------------": "6,6,31,152,403,331,21,4983~6,0,0,18,48,44,18,990&7,14,6,149&4,11,18,140&7,12,48,355&11,17,44,346~0,6,1,0,4,4,19,48&0,11,1,11&4,9,6,9&1,15,4,12&1,17,4,16~0,0,7,35,92,76,5,1959&15,18,7,288&4,7,35,271&2,8,92,697&10,17,76,703~0,0,8,42,106,84,10,1012&3,16,8,145&4,6,42,142&1,2,106,372&5,18,84,353~0,0,15,57,153,123,3,974&11,15,15,144&1,4,57,138&1,12,153,376&12,19,123,316",
                "BvSScratchies.---B---------------------": "14,3,75,55,361,317,22,4487~14,0,0,7,43,38,15,861&3,6,14,101&0,10,7,160&4,10,43,312&9,13,38,288~0,3,2,0,6,3,9,43&3,13,2,5&10,16,3,13&0,13,6,16&4,10,3,9~0,0,17,12,80,71,13,1799&3,7,17,174&0,12,12,355&6,17,80,652&12,17,71,618~0,0,20,18,94,88,19,915&0,3,20,103&5,12,18,164&6,8,94,331&7,17,88,317~0,0,36,18,138,117,7,869&3,19,36,99&6,11,18,151&9,17,138,317&10,13,117,302",
                "BvSScratchies.---L---------------------": "9,4,50,85,1503,634,21,10052~9,0,0,11,193,76,2,1998&7,11,9,321&7,18,11,368&3,7,193,595&11,17,76,714~0,4,2,0,11,5,13,96&4,16,2,18&5,10,4,25&3,17,11,27&0,7,5,26~0,0,10,19,365,154,2,4068&1,14,10,646&5,13,19,724&3,8,365,1258&0,10,154,1440~0,0,14,22,352,162,7,1972&2,17,14,318&11,14,22,358&1,3,352,589&4,6,162,707~0,0,24,33,582,237,6,1918&10,14,24,287&1,5,33,341&3,17,582,616&12,15,237,674",
                "BvSScratchies.---P---------------------": "8,4,42,92,690,1323,24,9609~8,0,0,10,87,168,19,1912&12,17,8,291&13,16,10,340&1,11,87,710&3,4,168,571~0,4,2,0,9,11,6,97&14,16,2,13&2,7,4,27&10,16,9,34&3,13,11,23~0,0,10,18,163,323,5,3834&2,16,10,650&7,12,18,689&15,19,163,1339&3,13,323,1156~0,0,12,22,170,344,1,1940&8,9,12,303&0,6,22,345&4,7,170,692&3,5,344,600~0,0,18,42,261,477,19,1826&4,9,18,275&2,6,42,319&11,14,261,688&1,3,477,544",
                "BvSScratchies.---S---------------------": "5,5,31,153,381,350,23,4979~5,0,0,22,49,43,4,960&11,14,5,172&3,8,22,129&12,14,49,327&2,18,43,332~0,5,2,0,4,5,17,48&15,19,2,9&3,15,5,10&1,18,4,13&13,16,5,16~0,0,7,34,87,78,1,1980&13,19,7,301&3,17,34,275&4,11,87,704&10,15,78,700~0,0,10,40,106,80,18,1001&1,11,10,142&3,10,40,146&2,17,106,384&8,12,80,329~0,0,12,57,135,144,8,990&5,6,12,147&1,3,57,143&4,9,135,356&4,19,144,344",
                "BvSScratchies.--B----------------------": "13,3,73,57,350,304,24,4470~13,0,0,8,50,39,5,964&2,11,13,124&7,9,8,181&6,8,50,347&9,10,39,312~0,3,1,0,5,4,10,42&2,8,1,3&6,9,3,14&5,14,5,15&6,11,4,10~0,0,19,14,80,65,15,1785&2,13,19,196&5,17,14,311&16,19,80,661&3,14,65,617~0,0,20,14,86,88,6,876&2,10,20,85&3,15,14,159&5,18,86,316&7,12,88,316~0,0,33,21,129,108,9,803&2,16,33,91&8,10,21,149&13,18,129,288&3,10,108,275",
                "BvSScratchies.--L----------------------": "8,4,49,95,1525,646,23,10108~8,0,0,12,204,81,3,2026&0,6,8,330&4,15,12,360&2,6,204,657&5,9,81,679~0,4,2,0,17,7,13,104&0,19,2,17&5,11,4,20&2,3,17,33&4,9,7,34~0,0,11,19,371,152,9,4059&10,12,11,625&18,19,19,729&2,11,371,1265&13,15,152,1440~0,0,18,28,378,166,11,2020&7,15,18,329&7,16,28,358&2,17,378,610&10,13,166,723~0,0,18,36,555,240,5,1899&0,7,18,287&7,11,36,349&2,16,555,590&14,18,240,673",
                "BvSScratchies.--P----------------------": "8,4,52,88,681,1290,21,9560~8,0,0,11,91,161,4,1881&5,9,8,316&1,13,11,307&1,5,91,713&2,17,161,545~0,4,2,0,7,10,0,88&6,11,2,18&4,16,4,17&6,18,7,29&2,17,10,24~0,0,10,19,158,333,4,3856&1,3,10,577&10,17,19,703&6,7,158,1408&2,11,333,1168~0,0,16,22,170,330,10,1920&5,19,16,307&6,16,22,339&6,14,170,687&2,4,330,587~0,0,24,36,255,456,10,1815&11,15,24,287&11,12,36,306&4,18,255,679&1,2,456,543",
                "BvSScratchies.--S----------------------": "5,5,30,161,396,337,22,5085~5,0,0,19,59,44,5,1023&11,16,5,162&2,12,19,122&6,10,59,376&11,14,44,363~0,5,1,0,6,6,12,62&5,15,1,7&2,19,5,14&5,7,6,21&4,13,6,20~0,0,6,39,92,78,18,2040&0,5,6,314&2,13,39,274&13,14,92,749&4,19,78,703~0,0,8,46,104,86,11,1018&1,6,8,177&2,12,46,130&16,19,104,366&10,17,86,345~0,0,15,57,135,123,14,942&7,12,15,152&2,10,57,119&10,13,135,331&9,17,123,340",
                "BvSScratchies.-B-----------------------": "14,3,69,45,372,313,0,4474~14,0,69,0,0,0,21,480&1,12,14,106&1,8,1,5&1,18,15,177&1,5,20,100&1,4,33,92~0,3,0,45,0,0,22,798&2,14,7,150&2,11,3,9&3,12,8,322&3,15,12,165&4,14,18,152~0,0,0,0,372,0,24,1669&2,5,54,359&17,19,6,18&14,18,87,658&2,13,96,321&13,14,129,313~0,0,0,0,0,313,24,1527&13,16,39,320&2,14,3,11&5,13,74,618&11,15,80,271&7,19,117,307",
                "BvSScratchies.-L-----------------------": "9,4,46,86,1572,642,15,10235~9,0,46,0,0,0,23,1644&2,17,9,376&0,3,1,20&10,13,10,640&4,11,14,308&0,8,21,300~0,4,0,86,0,0,24,1840&0,18,10,363&0,4,4,32&0,4,16,712&6,9,24,371&10,18,36,362~0,0,0,0,1572,0,21,3234&1,3,202,661&1,18,18,38&1,16,393,1293&1,3,392,629&1,14,567,613~0,0,0,0,0,642,22,3517&2,9,82,684&6,16,8,33&3,4,146,1413&9,17,166,736&0,4,240,651",
                "BvSScratchies.-P-----------------------": "8,5,41,85,684,1290,24,9486~8,0,0,11,88,162,9,1942&15,19,8,313&5,15,11,363&8,12,88,697&1,7,162,569~0,5,2,0,10,8,12,91&3,14,2,17&9,18,5,19&5,19,10,31&1,7,8,24~0,0,9,20,157,314,12,3766&5,7,9,591&3,10,20,661&13,17,157,1382&1,16,314,1132~0,0,12,24,180,344,13,1937&2,17,12,316&4,7,24,330&4,11,180,704&1,10,344,587~0,0,18,30,249,462,0,1750&7,13,18,282&3,7,30,304&14,15,249,655&1,2,462,509",
                "BvSScratchies.-S-----------------------": "6,5,28,151,392,337,20,4892~6,0,0,16,51,43,6,977&15,18,6,155&1,9,16,124&2,11,51,373&7,10,43,325~0,5,1,0,6,5,18,55&0,12,1,6&1,10,5,11&7,13,6,20&3,17,5,18~0,0,7,34,88,75,14,1910&13,18,7,315&1,7,34,242&8,11,88,694&0,15,75,659~0,0,8,44,106,88,18,1001&0,2,8,156&1,11,44,117&0,16,106,387&4,9,88,341~0,0,12,57,141,126,6,949&0,18,12,164&0,1,57,112&8,9,141,330&8,16,126,343",
                "BvSScratchies.B------------------------": "13,3,78,59,377,330,21,4612~13,0,0,8,48,34,17,888&0,6,13,103&9,15,8,145&3,8,48,348&8,11,34,292~0,3,1,0,5,4,17,39&0,3,1,5&12,18,3,7&3,9,5,17&4,8,4,10~0,0,20,11,88,74,4,1808&0,17,20,198&6,7,11,329&6,18,88,674&8,18,74,607~0,0,24,16,92,80,6,930&0,16,24,102&4,8,16,176&2,3,92,347&5,16,80,305~0,0,33,24,144,138,11,947&0,10,33,105&1,2,24,187&1,9,144,338&7,17,138,317",
                "BvSScratchies.L------------------------": "9,4,42,98,1651,664,16,10684~9,0,42,0,0,0,22,1680&5,7,9,359&2,4,1,11&1,4,9,654&3,10,14,339&8,17,18,317~0,4,0,98,0,0,21,1909&3,7,13,379&10,17,4,22&9,15,17,761&8,13,26,376&1,7,42,371~0,0,0,0,1651,0,24,3373&0,18,206,669&0,10,13,28&0,12,387,1319&0,7,460,744&0,3,585,613~0,0,0,0,0,664,23,3722&1,17,86,720&1,13,5,21&11,17,157,1511&4,11,182,770&6,18,234,700",
                "BvSScratchies.P------------------------": "8,4,52,89,731,1354,23,10165~8,0,0,12,95,171,16,2059&2,12,8,327&7,9,12,389&3,8,95,754&0,18,171,589~0,4,2,0,8,9,15,98&7,13,2,11&2,16,4,26&5,14,8,31&0,3,9,30~0,0,11,18,173,342,15,4060&5,16,11,649&14,19,18,732&11,17,173,1459&0,2,342,1220~0,0,18,26,182,334,17,2001&15,18,18,344&10,19,26,315&4,10,182,754&0,16,334,588~0,0,21,33,273,498,6,1947&9,19,21,318&12,17,33,347&12,13,273,721&0,2,498,561",
                "BvSScratchies.S------------------------": "6,6,32,157,383,338,20,5283~6,0,0,19,52,47,9,1090&2,12,6,179&0,11,19,146&7,11,52,385&4,14,47,380~0,6,1,0,6,4,4,66&1,2,1,13&0,3,6,14&1,14,6,23&7,13,4,16~0,0,7,36,96,78,17,2110&8,13,7,345&0,11,36,279&4,11,96,782&4,15,78,704~0,0,12,42,100,80,8,1027&1,7,12,173&0,10,42,142&2,10,100,378&15,19,80,334~0,0,12,60,129,129,12,990&2,9,12,173&0,19,60,141&2,16,129,342&9,13,129,334"
            };
        } else if (strat === 'shonuff') {
            stratData = {
                "BvSScratchies.------------------------B":"225,18,0,776,10167,8593,5,182182~225,0,0,0,0,0,24,27510&7,12,225,27510&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,18,0,776,0,0,22,31017&0,0,0,0&0,15,18,463&2,15,203,15358&7,12,258,7922&11,17,315,7274~0,0,0,0,10167,0,20,63599&0,0,0,0&15,19,86,803&7,11,2874,31590&2,8,2956,15973&13,15,4251,15233~0,0,0,0,0,8593,22,60056&0,0,0,0&3,19,55,660&6,9,2426,30019&4,16,2536,15071&2,12,3576,14306",
                "BvSScratchies.-----------------------11":"57,17,229,460,6141,5086,13,90995~57,0,229,0,0,0,22,13621&12,15,57,4536&0,10,5,242&0,0,0,0&2,19,104,4477&1,7,120,4366~0,17,0,460,0,0,21,15431&8,10,81,5160&0,7,17,299&0,0,0,0&2,16,154,5125&7,14,225,4847~0,0,0,0,6141,0,22,31828&8,12,1002,10594&3,4,65,525&0,0,0,0&11,19,2170,10606&1,11,2904,10103~0,0,0,0,0,5086,20,30115&9,19,822,9905&7,8,42,453&0,0,0,0&0,19,1690,10116&7,15,2532,9641",
                "BvSScratchies.-----------------------B-":"202,20,0,781,10587,8418,14,182074~202,0,0,0,0,0,23,27716&12,18,202,27716&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,20,0,781,0,0,20,31527&0,0,0,0&7,8,20,460&5,12,215,15667&4,5,236,7910&8,15,330,7490~0,0,0,0,10587,0,24,64408&0,0,0,0&13,18,99,827&18,19,2942,32089&8,11,2974,16082&18,19,4572,15410~0,0,0,0,0,8418,20,58423&0,0,0,0&4,13,50,663&13,19,2366,29146&8,17,2444,14658&3,13,3558,13956",
                "BvSScratchies.----------------------1-1":"51,15,258,459,6017,5092,15,91155~51,0,258,0,0,0,23,13674&3,12,51,4563&6,16,5,225&0,0,0,0&9,13,112,4587&0,3,141,4299~0,15,0,459,0,0,21,15485&5,19,78,5204&8,16,15,310&0,0,0,0&1,10,162,5145&0,7,219,4826~0,0,0,0,6017,0,23,31954&13,19,1055,10656&3,7,62,534&0,0,0,0&4,7,2038,10660&13,17,2862,10104~0,0,0,0,0,5092,23,30042&10,19,841,10012&10,12,41,462&0,0,0,0&17,18,1768,10000&1,11,2442,9568",
                "BvSScratchies.----------------------11-":"72,17,258,477,6052,5095,15,91159~72,0,258,0,0,0,20,13660&9,12,72,4542&4,14,6,225&0,0,0,0&12,16,102,4580&5,12,150,4313~0,17,0,477,0,0,21,15506&9,11,85,5163&2,12,17,295&0,0,0,0&2,8,158,5142&0,9,234,4906~0,0,0,0,6052,0,24,31911&9,13,999,10585&4,17,67,544&0,0,0,0&4,17,2064,10714&17,18,2922,10068~0,0,0,0,0,5095,24,30082&0,17,867,10015&5,6,41,453&0,0,0,0&0,9,1724,9990&2,11,2463,9624",
                "BvSScratchies.----------------------B--":"200,19,0,747,10630,8611,18,182210~200,0,0,0,0,0,22,27345&8,14,200,27345&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,19,0,747,0,0,23,31038&0,0,0,0&0,14,19,443&17,19,208,15472&5,6,218,7763&1,2,321,7360~0,0,0,0,10630,0,24,63787&0,0,0,0&8,14,90,802&14,19,2943,31896&0,11,2968,16023&14,19,4629,15066~0,0,0,0,0,8611,23,60040&0,0,0,0&6,16,55,690&4,19,2437,30004&5,17,2468,15069&0,5,3651,14277",
                "BvSScratchies.---------------------1--1":"47,15,216,523,5933,5094,22,91123~47,0,0,87,991,854,0,30387&5,7,47,4593&1,10,87,5243&4,9,991,10602&7,10,854,9949~0,15,6,0,67,41,16,1511&5,9,6,210&17,19,15,304&0,2,67,529&0,6,41,468~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,84,178,2016,1712,0,30361&6,19,84,4577&6,12,178,5199&14,18,2016,10586&1,13,1712,9999~0,0,126,258,2859,2487,12,28864&0,17,126,4310&5,15,258,4855&14,17,2859,10052&7,16,2487,9647",
                "BvSScratchies.---------------------1-1-":"48,15,224,485,5951,5107,20,90999~48,0,0,85,1028,865,14,30297&0,18,48,4521&5,18,85,5249&4,7,1028,10564&10,17,865,9963~0,15,6,0,63,43,1,1533&7,19,6,232&16,19,15,303&5,6,63,539&12,14,43,459~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,80,166,2064,1754,6,30379&1,7,80,4454&8,17,166,5138&10,11,2064,10738&10,13,1754,10049~0,0,138,234,2796,2445,11,28790&14,18,138,4325&16,19,234,4869&9,10,2796,10027&1,17,2445,9569",
                "BvSScratchies.---------------------11--":"45,15,258,486,6016,5035,20,91107~45,0,0,82,1019,851,8,30366&12,14,45,4558&1,10,82,5201&10,15,1019,10592&5,7,851,10015~0,15,5,0,68,41,6,1508&2,4,5,239&7,14,15,292&4,7,68,548&1,10,41,429~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,88,176,2052,1704,9,30381&2,15,88,4520&0,17,176,5143&3,16,2052,10691&6,11,1704,10027~0,0,165,228,2877,2439,15,28852&9,13,165,4311&1,14,228,4895&0,11,2877,10120&2,11,2439,9526",
                "BvSScratchies.---------------------B---":"200,21,0,768,10157,8601,13,182145~200,0,0,0,0,0,21,27295&2,19,200,27295&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,21,0,768,0,0,20,30979&0,0,0,0&4,15,21,489&4,7,208,15397&2,5,230,7763&8,11,330,7330~0,0,0,0,10157,0,22,63488&0,0,0,0&3,4,89,798&11,17,2884,31585&10,11,2972,15933&2,8,4212,15172~0,0,0,0,0,8601,22,60383&0,0,0,0&0,7,56,673&11,12,2445,30284&5,8,2446,14927&5,10,3654,14499",
                "BvSScratchies.--------------------1---1":"44,15,230,511,5995,5024,22,91038~44,0,0,80,993,833,4,30427&1,18,44,4523&9,15,80,5287&10,12,993,10586&0,12,833,10031~0,15,5,0,67,40,3,1538&1,14,5,239&14,17,15,302&2,12,67,549&2,4,40,448~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,90,170,2016,1706,16,30276&2,10,90,4507&6,12,170,5174&3,13,2016,10616&6,11,1706,9979~0,0,135,261,2919,2445,15,28797&3,17,135,4274&9,12,261,4880&0,4,2919,10105&12,16,2445,9538",
                "BvSScratchies.--------------------1--1-":"46,16,232,513,6010,5030,22,91165~46,0,0,85,1000,844,12,30412&5,7,46,4608&9,17,85,5150&6,15,1000,10518&13,18,844,10136~0,16,6,0,71,43,16,1520&8,11,6,215&7,12,16,304&0,10,71,541&9,17,43,460~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,76,200,2014,1692,18,30350&6,9,76,4552&11,14,200,5129&6,15,2014,10646&7,8,1692,10023~0,0,150,228,2925,2451,6,28883&5,14,150,4379&0,13,228,4863&13,19,2925,9948&3,4,2451,9693",
                "BvSScratchies.--------------------1-1--":"50,18,236,522,5939,5016,23,91005~50,0,0,80,1024,851,15,30354&12,19,50,4580&2,6,80,5138&6,14,1024,10640&4,10,851,9996~0,18,6,0,62,42,17,1522&1,16,6,229&1,9,18,286&3,12,62,560&13,19,42,447~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,98,178,1970,1678,7,30324&5,12,98,4463&3,4,178,5322&8,14,1970,10520&10,19,1678,10019~0,0,132,264,2883,2445,15,28805&2,4,132,4309&1,12,264,4837&0,8,2883,10109&13,17,2445,9550",
                "BvSScratchies.--------------------11---":"47,14,217,566,5968,5126,22,91019~47,0,0,82,999,858,4,30360&14,19,47,4585&3,11,82,5149&5,19,999,10554&2,7,858,10072~0,14,5,0,60,47,13,1521&0,11,5,243&3,19,14,294&5,19,60,489&4,18,47,495~0,0,0,0,0,0,19,0&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,0,86,172,2050,1716,6,30346&7,10,86,4492&0,12,172,5219&1,17,2050,10571&4,9,1716,10064~0,0,126,312,2859,2505,15,28792&8,11,126,4338&3,12,312,4863&8,10,2859,10127&17,18,2505,9464",
                "BvSScratchies.--------------------B----":"203,21,0,753,10406,8461,14,182154~203,0,0,0,0,0,20,27535&6,18,203,27535&0,0,0,0&0,0,0,0&0,0,0,0&0,0,0,0~0,21,0,753,0,0,23,31477&0,0,0,0&16,18,21,459&0,12,213,15823&3,15,222,7785&5,10,318,7410~0,0,0,0,10406,0,24,64096&0,0,0,0&0,1,93,815&6,18,2931,32066&9,19,3020,16087&18,19,4362,15128~0,0,0,0,0,8461,22,59046&0,0,0,0&4,7,59,680&4,13,2387,29466&3,17,2472,14817&7,12,3543,14083",
                "BvSScratchies.-------------------B-----":"12,3,73,57,349,303,21,4452~12,0,0,6,42,37,2,867&17,19,12,109&1,15,6,156&11,18,42,303&7,13,37,299~0,3,1,0,5,5,7,45&12,19,1,2&2,13,3,14&4,6,5,15&6,18,5,14~0,0,19,11,82,72,13,1813&0,19,19,211&2,16,11,327&9,16,82,634&0,12,72,641~0,0,20,16,94,78,6,874&13,19,20,87&9,18,16,142&3,8,94,323&0,3,78,322~0,0,33,24,126,111,18,853&4,19,33,99&6,15,24,160&3,9,126,304&6,11,111,290",
                "BvSScratchies.-------------------L-----":"8,4,50,89,1586,658,17,10025~8,0,50,0,0,0,23,1548&2,10,8,321&0,16,2,13&5,11,11,607&1,2,16,307&5,13,21,300~0,4,0,89,0,0,21,1778&9,15,12,347&5,15,4,23&2,15,18,725&7,13,26,337&3,5,33,346~0,0,0,0,1586,0,22,3181&6,19,197,620&6,19,11,31&8,19,384,1283&8,19,418,623&1,19,576,624~0,0,0,0,0,658,20,3518&2,10,80,687&1,16,6,31&0,10,147,1379&1,16,164,732&5,8,261,689",
                "BvSScratchies.-------------------P-----":"8,4,51,86,683,1303,20,9546~8,0,0,11,91,157,8,1902&5,10,8,317&10,16,11,338&6,17,91,702&1,19,157,545~0,4,1,0,9,8,6,80&0,1,1,12&11,15,4,19&8,12,9,30&11,19,8,19~0,0,10,18,155,324,6,3827&12,13,10,606&3,14,18,710&12,14,155,1336&1,19,324,1175~0,0,16,24,176,334,1,1931&6,16,16,309&3,10,24,336&2,9,176,701&6,19,334,585~0,0,24,33,252,480,15,1806&0,16,24,297&12,13,33,287&5,11,252,676&17,19,480,546",
                "BvSScratchies.-------------------S-----":"6,5,29,154,408,330,22,5009~6,0,0,21,51,39,18,1002&3,5,6,174&4,19,21,130&11,13,51,368&2,8,39,330~0,5,1,0,7,5,9,65&1,5,1,9&6,19,5,16&10,11,7,23&1,4,5,17~0,0,8,36,96,76,3,2036&5,11,8,302&4,19,36,275&1,4,96,737&2,15,76,722~0,0,8,40,104,78,8,957&7,14,8,157&6,19,40,129&7,10,104,344&2,5,78,327~0,0,12,57,150,132,4,949&5,17,12,144&12,19,57,126&1,5,150,337&0,13,132,342",
                "BvSScratchies.------------------B------":"12,3,81,58,357,293,22,4478~12,0,0,6,42,43,9,881&2,18,12,93&2,6,6,150&8,12,42,310&0,17,43,328~0,3,2,0,6,3,0,49&18,19,2,7&3,14,3,10&8,12,6,20&3,5,3,12~0,0,19,13,84,70,10,1812&11,18,19,186&0,15,13,333&12,16,84,695&8,9,70,598~0,0,24,18,102,78,7,918&15,18,24,99&6,10,18,156&12,17,102,346&3,12,78,317~0,0,36,21,123,99,4,818&6,18,36,93&1,16,21,157&5,13,123,303&0,17,99,265",
                "BvSScratchies.------------------L------":"9,4,43,94,1543,661,20,10198~9,0,0,12,213,82,6,2132&8,15,9,336&12,19,12,373&16,18,213,681&7,11,82,742~0,4,2,0,17,7,19,106&3,14,2,15&0,4,4,23&7,18,17,32&1,5,7,36~0,0,11,18,363,147,14,3993&8,16,11,653&4,11,18,722&5,18,363,1235&2,17,147,1383~0,0,12,28,386,170,13,2060&1,9,12,319&6,17,28,355&1,18,386,652&3,15,170,734~0,0,18,36,564,255,17,1907&4,13,18,308&5,10,36,340&9,18,564,609&1,15,255,650",
                "BvSScratchies.------------------P------":"7,4,43,93,697,1337,20,9529~7,0,0,12,98,158,5,1900&0,17,7,316&7,12,12,322&10,12,98,711&14,18,158,551~0,4,2,0,8,9,10,90&8,19,2,13&3,17,4,24&2,3,8,32&1,18,9,21~0,0,12,17,166,319,6,3736&4,9,12,563&1,16,17,637&12,17,166,1402&12,18,319,1134~0,0,14,28,176,356,11,1948&8,19,14,304&9,16,28,336&8,16,176,707&4,18,356,601~0,0,15,36,249,495,5,1855&1,14,15,288&0,10,36,347&1,12,249,656&16,18,495,564",
                "BvSScratchies.------------------S------":"5,5,38,161,398,337,22,5101~5,0,0,20,45,36,16,965&2,8,5,157&14,18,20,150&5,14,45,338&3,14,36,320~0,5,1,0,8,4,8,63&0,9,1,8&16,18,5,12&9,16,8,28&0,5,4,15~0,0,7,38,96,78,0,2051&16,17,7,302&5,18,38,260&2,13,96,746&1,13,78,743~0,0,12,46,102,90,12,1028&2,17,12,162&0,18,46,131&1,3,102,375&7,16,90,360~0,0,18,57,147,129,6,994&5,19,18,168&10,18,57,130&4,16,147,349&5,13,129,347",
                "BvSScratchies.-----------------B-------":"13,3,70,49,362,309,4,4354~13,0,70,0,0,0,24,474&15,17,13,103&15,17,2,4&17,18,15,186&12,17,20,84&9,17,33,97~0,3,0,49,0,0,23,773&0,7,6,160&1,18,3,14&0,1,9,316&10,12,16,157&9,11,18,126~0,0,0,0,362,0,23,1599&0,14,47,314&2,13,5,17&12,18,87,663&9,18,94,305&3,11,129,300~0,0,0,0,0,309,24,1508&0,11,37,300&0,2,3,10&6,12,69,579&2,12,80,331&5,18,120,288",
                "BvSScratchies.-----------------L-------":"8,5,47,95,1496,640,22,10107~8,0,0,13,180,77,3,2014&1,14,8,346&4,13,13,377&17,19,180,592&1,15,77,699~0,5,2,0,14,5,13,97&5,7,2,17&4,6,5,24&10,17,14,30&0,18,5,26~0,0,10,22,368,147,9,4028&10,14,10,646&1,19,22,721&11,17,368,1254&2,19,147,1407~0,0,14,24,382,174,14,2019&3,18,14,338&3,16,24,353&11,17,382,619&4,16,174,709~0,0,21,36,552,237,0,1949&1,4,21,328&5,18,36,360&14,17,552,591&2,5,237,670",
                "BvSScratchies.-----------------P-------":"7,4,43,85,694,1391,24,9514~7,0,0,11,89,168,4,1881&14,18,7,296&8,10,11,346&11,15,89,695&1,17,168,544~0,4,2,0,8,10,7,82&3,5,2,8&1,15,4,17&3,8,8,32&13,17,10,25~0,0,9,20,165,316,5,3795&4,12,9,579&12,18,20,666&14,18,165,1396&7,17,316,1154~0,0,14,24,180,366,13,1942&2,8,14,313&9,11,24,318&7,9,180,720&12,17,366,591~0,0,18,30,252,531,11,1814&1,8,18,278&9,13,30,294&7,8,252,677&4,17,531,565",
                "BvSScratchies.-----------------S-------":"6,4,41,152,392,337,22,4997~6,0,0,20,52,48,18,1063&7,19,6,168&14,17,20,150&0,10,52,375&3,12,48,370~0,4,2,0,5,4,16,62&0,12,2,9&9,17,4,17&2,4,5,20&7,9,4,16~0,0,8,36,94,77,0,2021&1,19,8,302&14,17,36,289&14,16,94,730&18,19,77,700~0,0,10,42,100,88,15,988&2,3,10,138&8,17,42,135&7,12,100,381&3,12,88,334~0,0,21,54,141,120,15,863&4,5,21,137&13,17,54,116&11,19,141,319&5,10,120,291",
                "BvSScratchies.----------------B--------":"12,3,71,60,342,333,20,4406~12,0,0,7,45,35,10,870&12,16,12,88&2,3,7,166&1,5,45,331&0,4,35,285~0,3,2,0,6,4,17,44&13,16,2,5&1,19,3,11&9,15,6,16&6,12,4,12~0,0,16,13,83,69,19,1758&12,16,16,185&11,12,13,305&10,14,83,673&4,8,69,595~0,0,20,16,82,78,3,897&0,16,20,95&8,17,16,190&5,6,82,288&10,11,78,324~0,0,33,24,126,147,7,837&15,16,33,91&0,18,24,141&6,17,126,288&1,11,147,317",
                "BvSScratchies.----------------L--------":"8,4,56,87,1442,624,22,10048~8,0,0,11,187,80,17,2034&3,15,8,312&8,19,11,382&8,16,187,630&1,7,80,710~0,4,3,0,13,6,11,113&0,7,3,22&6,18,4,29&9,16,13,29&2,8,6,33~0,0,10,19,361,151,1,3949&3,18,10,594&5,10,19,705&0,16,361,1239&8,17,151,1411~0,0,16,24,374,156,9,2086&0,1,16,337&4,19,24,376&3,16,374,638&5,8,156,735~0,0,27,33,507,231,5,1866&12,17,27,283&7,15,33,338&0,16,507,565&0,13,231,680",
                "BvSScratchies.----------------P--------":"7,4,50,82,705,1371,19,9457~7,0,50,0,0,0,21,1510&7,9,7,286&1,5,1,13&13,15,13,618&6,12,12,304&7,14,24,289~0,4,0,82,0,0,23,1695&7,15,11,334&2,5,4,19&7,17,16,686&14,18,22,345&5,6,33,311~0,0,0,0,705,0,23,3420&0,7,89,690&14,15,7,32&0,14,157,1328&4,9,176,694&6,17,276,676~0,0,0,0,0,1371,23,2832&10,16,176,579&14,16,9,25&1,16,312,1109&16,18,334,562&12,16,540,557",
                "BvSScratchies.----------------S--------":"6,4,32,151,397,327,22,4963~6,0,0,19,53,43,6,1022&1,3,6,145&1,16,19,134&1,2,53,372&5,7,43,371~0,4,2,0,6,5,8,56&7,17,2,9&15,16,4,12&2,7,6,23&4,9,5,12~0,0,7,33,91,80,7,1976&6,14,7,310&12,16,33,272&4,15,91,712&4,13,80,682~0,0,8,42,106,88,1,1008&3,6,8,176&3,16,42,119&17,18,106,369&10,13,88,344~0,0,15,57,141,111,2,901&10,19,15,136&8,16,57,125&12,17,141,336&14,19,111,304",
                "BvSScratchies.---------------B---------":"14,3,55,48,382,327,17,4463~14,0,55,0,0,0,20,407&4,15,14,99&8,15,1,4&9,15,14,154&0,15,16,82&8,15,24,68~0,3,0,48,0,0,24,826&5,14,6,167&1,16,3,11&0,11,10,331&5,16,14,170&0,8,18,147~0,0,0,0,382,0,21,1665&1,18,44,319&0,5,6,22&2,14,83,652&5,10,102,339&5,7,147,333~0,0,0,0,0,327,20,1565&7,19,42,324&2,16,3,12&3,19,69,619&5,18,84,300&3,13,129,310",
                "BvSScratchies.---------------L---------":"9,4,46,98,1523,654,21,10120~9,0,0,13,197,79,8,2050&17,18,9,360&5,9,13,374&15,19,197,618&10,19,79,698~0,4,2,0,9,7,5,92&0,14,2,16&4,9,4,18&0,15,9,19&9,18,7,39~0,0,11,19,380,147,10,4016&6,11,11,648&6,19,19,718&5,15,380,1247&0,5,147,1403~0,0,12,24,370,172,0,2028&4,13,12,328&7,11,24,370&12,15,370,600&12,13,172,730~0,0,21,42,567,249,3,1934&4,14,21,286&2,13,42,354&11,15,567,622&1,12,249,672",
                "BvSScratchies.---------------P---------":"9,3,41,86,679,1334,24,9533~9,0,0,11,86,159,11,1898&2,4,9,322&7,13,11,337&1,9,86,694&6,15,159,545~0,3,2,0,8,12,19,100&0,3,2,18&4,5,3,21&2,3,8,32&6,15,12,29~0,0,9,18,158,343,0,3849&3,13,9,592&8,18,18,718&3,10,158,1378&13,15,343,1161~0,0,12,24,178,352,5,1907&1,3,12,289&1,12,24,344&2,14,178,695&2,15,352,579~0,0,18,33,249,468,1,1779&6,12,18,273&0,9,33,302&2,16,249,661&0,15,468,543",
                "BvSScratchies.---------------S---------":"5,5,30,151,392,331,24,5002~5,0,0,19,50,47,9,1052&3,18,5,162&4,15,19,126&1,11,50,382&13,17,47,382~0,5,1,0,5,6,0,62&1,8,1,13&15,17,5,10&4,17,5,20&5,13,6,19~0,0,7,34,85,76,1,1953&0,6,7,313&8,15,34,272&4,7,85,706&12,18,76,662~0,0,10,44,108,76,5,1002&2,3,10,146&9,15,44,149&6,8,108,381&7,10,76,326~0,0,12,54,144,126,2,933&11,12,12,125&1,15,54,123&11,17,144,339&3,6,126,346",
                "BvSScratchies.--------------B----------":"13,3,79,56,361,307,23,4530~13,0,0,7,48,42,10,924&1,14,13,107&7,9,7,169&5,18,48,321&8,15,42,327~0,3,2,0,5,5,17,52&7,14,2,5&7,18,3,13&10,16,5,15&5,19,5,19~0,0,20,11,82,73,12,1808&2,14,20,195&6,9,11,326&7,10,82,644&3,8,73,643~0,0,24,14,94,76,8,900&3,14,24,92&4,10,14,154&0,15,94,351&5,9,76,303~0,0,33,24,132,111,10,846&14,16,33,104&3,18,24,144&1,17,132,314&2,17,111,284",
                "BvSScratchies.--------------L----------":"7,4,50,100,1559,634,24,10224~7,0,0,13,197,85,8,2067&10,16,7,331&4,13,13,381&9,14,197,653&3,11,85,702~0,4,3,0,15,6,2,107&6,7,3,17&1,4,4,24&6,14,15,33&15,17,6,33~0,0,13,19,396,148,19,4088&3,16,13,605&11,12,19,759&9,14,396,1285&3,9,148,1439~0,0,16,26,396,164,18,2055&1,10,16,339&2,17,26,346&10,14,396,655&6,8,164,715~0,0,18,42,555,231,6,1907&3,16,18,315&12,17,42,338&10,14,555,575&10,16,231,679",
                "BvSScratchies.--------------P----------":"9,4,50,76,665,1300,21,9190~9,0,0,10,81,159,18,1807&10,16,9,343&11,17,10,323&13,19,81,616&13,14,159,525~0,4,2,0,7,10,4,84&16,19,2,17&9,15,4,15&2,9,7,27&11,14,10,25~0,0,11,16,158,320,3,3686&7,10,11,544&5,16,16,687&2,5,158,1318&8,14,320,1137~0,0,16,20,176,322,7,1815&5,12,16,267&1,15,20,311&5,6,176,670&1,14,322,567~0,0,21,30,243,489,12,1798&1,6,21,272&0,18,30,335&6,17,243,662&9,14,489,529",
                "BvSScratchies.--------------S----------":"7,5,30,144,426,348,12,5120~7,0,30,0,0,0,21,806&15,19,7,172&0,11,1,8&1,17,6,313&8,10,8,156&4,19,15,157~0,5,0,144,0,0,24,671&6,14,18,124&11,14,5,12&14,18,31,262&6,14,38,136&13,14,57,137~0,0,0,0,426,0,21,1898&5,9,56,391&1,13,4,15&7,18,96,743&1,10,108,373&16,19,162,376~0,0,0,0,0,348,22,1745&4,6,40,337&0,1,3,13&0,8,77,698&4,7,90,368&4,9,138,329",
                "BvSScratchies.-------------B-----------":"12,4,77,52,356,299,24,4424~12,0,0,7,50,40,17,920&5,13,12,97&6,7,7,147&2,14,50,351&0,11,40,325~0,4,1,0,4,4,11,45&3,13,1,4&5,14,4,14&7,16,4,11&1,6,4,16~0,0,19,11,80,69,2,1756&5,13,19,192&14,19,11,335&11,17,80,622&0,10,69,607~0,0,24,16,96,78,19,897&7,13,24,92&10,15,16,182&9,16,96,334&4,17,78,289~0,0,33,18,126,108,14,806&2,13,33,92&4,19,18,148&7,18,126,287&6,17,108,279",
                "BvSScratchies.-------------L-----------":"8,4,52,99,1541,601,20,10028~8,0,0,14,189,84,12,2009&0,17,8,322&1,11,14,330&6,13,189,630&0,15,84,727~0,4,2,0,13,7,12,101&6,10,2,16&0,6,4,25&3,13,13,30&5,11,7,30~0,0,10,20,389,147,5,4053&3,12,10,674&0,2,20,673&1,13,389,1268&2,10,147,1438~0,0,16,26,398,144,14,1997&5,10,16,340&12,15,26,312&4,13,398,673&0,7,144,672~0,0,24,39,552,219,9,1868&8,18,24,302&12,19,39,318&2,13,552,595&0,1,219,653",
                "BvSScratchies.-------------P-----------":"9,4,45,79,700,1281,17,9533~9,0,45,0,0,0,24,1526&3,5,9,325&0,9,1,12&5,8,12,597&3,12,14,295&1,8,18,297~0,4,0,79,0,0,21,1695&6,15,10,330&4,16,4,20&1,7,16,670&0,14,20,354&18,19,33,321~0,0,0,0,700,0,23,3506&1,16,92,743&7,8,7,28&7,11,163,1385&7,12,186,703&8,11,252,647~0,0,0,0,0,1281,23,2806&2,13,154,553&10,13,12,29&13,16,310,1108&7,13,322,564&6,13,483,552",
                "BvSScratchies.-------------S-----------":"6,6,32,153,408,331,21,5029~6,0,0,17,49,45,7,1001&2,16,6,165&4,13,17,125&5,12,49,372&3,11,45,339~0,6,1,0,6,6,19,70&1,18,1,6&10,13,6,18&0,8,6,20&1,15,6,26~0,0,6,37,96,71,5,1976&0,14,6,327&13,15,37,247&11,14,96,749&2,6,71,653~0,0,10,42,110,92,8,1034&4,16,10,146&7,13,42,139&2,14,110,388&4,14,92,361~0,0,15,57,147,117,4,948&6,17,15,162&5,13,57,118&1,12,147,350&0,18,117,318",
                "BvSScratchies.------------B------------":"13,3,63,51,356,335,8,4405~13,0,63,0,0,0,23,440&12,14,13,97&0,12,1,3&12,14,16,177&6,12,22,80&3,12,24,83~0,3,0,51,0,0,24,789&0,10,7,160&3,19,3,13&6,17,10,311&3,16,16,163&9,17,18,142~0,0,0,0,356,0,22,1551&0,1,44,309&1,10,5,14&1,10,80,627&2,18,86,318&4,15,141,283~0,0,0,0,0,335,21,1625&6,9,43,351&3,19,5,17&0,5,73,632&5,9,88,323&17,18,126,302",
                "BvSScratchies.------------L------------":"10,4,45,81,1529,638,5,10069~10,0,45,0,0,0,22,1619&2,11,10,324&2,16,2,14&14,17,10,653&0,11,12,310&8,19,21,318~0,4,0,81,0,0,24,1802&10,15,11,371&4,7,4,21&3,6,18,701&0,9,22,354&1,11,30,355~0,0,0,0,1529,0,21,3183&12,13,198,622&12,17,12,29&12,14,382,1304&0,12,382,624&2,12,555,604~0,0,0,0,0,638,22,3465&2,9,80,719&3,4,7,22&8,18,141,1328&13,19,158,700&2,8,252,696",
                "BvSScratchies.------------P------------":"9,4,47,87,684,1337,22,9567~9,0,0,13,94,162,5,1926&10,13,9,314&6,14,13,354&7,14,94,718&12,15,162,540~0,4,1,0,9,9,11,86&0,13,1,14&1,15,4,19&3,9,9,33&2,12,9,20~0,0,11,19,163,327,14,3841&1,16,11,611&0,6,19,684&2,11,163,1422&6,12,327,1124~0,0,14,22,172,350,1,1918&7,9,14,323&9,18,22,339&0,15,172,659&11,12,350,597~0,0,21,33,246,489,16,1796&4,18,21,266&3,4,33,322&2,4,246,637&6,12,489,571",
                "BvSScratchies.------------S------------":"5,5,30,151,385,333,24,4995~5,0,0,22,52,36,3,999&11,14,5,165&4,12,22,149&4,16,52,374&1,16,36,311~0,5,1,0,6,6,15,69&0,3,1,14&12,14,5,13&5,9,6,19&5,8,6,23~0,0,7,35,87,73,3,2003&5,11,7,330&0,12,35,260&11,16,87,706&2,19,73,707~0,0,10,40,108,86,13,1025&3,7,10,154&0,12,40,143&0,18,108,373&9,16,86,355~0,0,12,54,132,132,17,899&4,15,12,128&12,19,54,109&1,15,132,325&0,18,132,337",
                "BvSScratchies.-----------B-------------":"13,3,74,56,333,331,22,4418~13,0,0,7,44,42,12,898&11,14,13,90&8,15,7,134&2,7,44,339&7,17,42,335~0,3,2,0,5,5,2,53&11,16,2,6&8,15,3,11&4,16,5,14&1,15,5,22~0,0,18,11,78,68,17,1755&3,11,18,199&3,10,11,316&0,4,78,632&1,8,68,608~0,0,24,14,86,84,2,872&10,11,24,89&10,16,14,165&10,19,86,301&9,16,84,317~0,0,30,24,120,132,15,840&4,11,30,86&6,12,24,156&7,12,120,293&7,9,132,305",
                "BvSScratchies.-----------L-------------":"9,4,53,88,1471,626,20,10038~9,0,0,10,199,80,10,1952&7,14,9,326&2,18,10,329&1,11,199,646&2,4,80,651~0,4,3,0,14,6,5,98&2,14,3,12&0,19,4,19&10,11,14,37&4,15,6,30~0,0,11,18,362,142,3,4004&9,18,11,629&10,14,18,749&7,11,362,1241&13,19,142,1385~0,0,12,24,380,170,13,2056&3,12,12,326&5,12,24,375&2,11,380,632&17,19,170,723~0,0,27,36,516,228,6,1928&2,8,27,332&4,10,36,368&2,11,516,578&2,10,228,650",
                "BvSScratchies.-----------P-------------":"9,4,48,86,698,1333,21,9525~9,0,0,11,95,161,9,1926&1,17,9,292&1,18,11,334&2,16,95,737&6,11,161,563~0,4,2,0,7,12,16,87&12,17,2,12&3,17,4,12&4,7,7,30&11,15,12,33~0,0,10,18,163,324,6,3741&2,17,10,578&4,10,18,663&0,5,163,1362&0,11,324,1138~0,0,12,24,184,350,8,1940&0,17,12,280&1,2,24,355&3,18,184,735&6,11,350,570~0,0,24,33,249,486,19,1831&4,13,24,308&15,16,33,318&0,7,249,663&1,11,486,542",
                "BvSScratchies.-----------S-------------":"5,5,34,144,385,330,21,4961~5,0,0,19,50,44,8,1012&2,14,5,156&11,18,19,145&2,7,50,373&12,13,44,338~0,5,2,0,7,5,10,78&2,14,2,12&6,11,5,17&3,7,7,25&3,5,5,24~0,0,7,32,94,72,6,1937&2,10,7,320&11,14,32,249&9,10,94,724&13,18,72,644~0,0,10,36,96,86,13,980&10,15,10,150&11,12,36,127&15,19,96,351&0,15,86,352~0,0,15,57,138,123,19,954&0,6,15,154&5,11,57,131&3,4,138,343&5,9,123,326",
                "BvSScratchies.----------B--------------":"12,3,81,59,352,300,22,4423~12,0,0,6,52,40,16,911&3,10,12,96&14,18,6,155&3,18,52,353&3,18,40,307~0,3,2,0,6,3,8,50&4,10,2,8&1,4,3,14&1,17,6,16&13,19,3,12~0,0,17,13,81,71,7,1713&4,10,17,176&6,18,13,291&1,17,81,645&14,19,71,601~0,0,26,16,84,72,1,893&10,19,26,104&4,12,16,189&2,14,84,311&9,13,72,289~0,0,36,24,129,114,11,856&7,10,36,79&15,16,24,165&3,16,129,292&3,14,114,320",
                "BvSScratchies.----------L--------------":"8,4,47,95,1563,647,23,10116~8,0,0,13,189,84,5,2086&2,19,8,361&13,15,13,394&0,10,189,622&0,17,84,709~0,4,1,0,12,10,7,104&0,12,1,19&13,15,4,19&8,10,12,31&0,6,10,35~0,0,10,20,392,154,18,4017&2,6,10,626&7,14,20,728&10,11,392,1286&2,16,154,1377~0,0,12,26,406,174,19,2024&5,11,12,295&9,13,26,347&9,10,406,671&2,16,174,711~0,0,24,36,564,225,17,1885&2,4,24,295&1,11,36,331&10,19,564,602&0,2,225,657",
                "BvSScratchies.----------P--------------":"9,4,50,79,701,1232,8,9457~9,0,50,0,0,0,23,1520&1,7,9,304&0,4,1,8&12,17,11,602&2,15,14,297&9,18,24,309~0,4,0,79,0,0,22,1755&11,15,11,350&6,9,4,29&1,18,16,698&14,19,22,327&9,17,30,351~0,0,0,0,701,0,21,3500&5,13,88,717&0,16,7,28&1,13,163,1404&0,15,176,682&9,15,267,669~0,0,0,0,0,1232,22,2682&10,16,162,575&2,10,9,25&2,10,285,1017&5,10,302,541&10,18,474,524",
                "BvSScratchies.----------S--------------":"5,6,33,146,373,338,22,5001~5,0,0,18,46,44,4,979&1,19,5,157&10,14,18,121&15,18,46,355&0,11,44,346~0,6,1,0,6,5,15,54&0,2,1,11&6,10,6,12&0,13,6,16&1,17,5,15~0,0,7,36,94,79,0,2060&2,9,7,324&9,10,36,297&12,17,94,758&6,11,79,681~0,0,10,38,92,90,13,967&6,8,10,158&10,11,38,124&1,19,92,356&4,11,90,329~0,0,15,54,135,120,6,941&13,14,15,137&3,10,54,136&7,12,135,332&3,8,120,336",
                "BvSScratchies.---------B---------------":"13,3,71,53,347,296,21,4413~13,0,0,7,47,36,2,899&9,19,13,101&5,11,7,163&17,18,47,346&15,19,36,289~0,3,2,0,6,4,4,52&2,9,2,5&7,13,3,12&0,11,6,17&0,13,4,18~0,0,17,11,78,69,0,1731&9,19,17,176&1,6,11,317&4,19,78,620&1,4,69,618~0,0,22,14,90,76,5,882&6,9,22,85&7,19,14,151&12,17,90,331&4,7,76,315~0,0,30,21,126,111,11,849&7,9,30,104&10,15,21,146&4,16,126,309&15,16,111,290",
                "BvSScratchies.---------L---------------":"8,5,46,80,1526,633,0,10033~8,0,46,0,0,0,21,1574&4,11,8,304&1,18,1,10&6,15,10,644&3,12,14,321&3,11,21,295~0,5,0,80,0,0,24,1885&5,15,11,376&8,17,5,28&4,11,17,767&4,8,22,363&6,16,30,351~0,0,0,0,1526,0,22,3086&1,9,184,597&9,10,12,29&4,9,352,1209&9,10,402,630&9,11,576,621~0,0,0,0,0,633,22,3488&1,4,85,724&3,4,6,30&8,16,141,1352&11,14,164,691&14,18,237,691",
                "BvSScratchies.---------P---------------":"9,4,47,86,682,1341,23,9592~9,0,0,10,96,161,12,1913&2,14,9,291&5,14,10,340&5,13,96,727&9,19,161,555~0,4,3,0,9,8,15,101&10,13,3,16&1,12,4,23&1,7,9,39&3,9,8,23~0,0,8,19,149,329,17,3793&0,12,8,593&12,19,19,744&4,12,149,1303&9,13,329,1153~0,0,12,24,170,360,3,1940&0,19,12,291&5,12,24,335&8,10,170,694&8,9,360,620~0,0,24,33,258,483,18,1845&3,13,24,283&11,16,33,339&0,13,258,683&9,17,483,540",
                "BvSScratchies.---------S---------------":"6,5,34,153,367,320,21,4996~6,0,0,20,53,43,19,1023&7,18,6,151&9,17,20,141&0,11,53,413&5,17,43,318~0,5,2,0,6,4,18,58&7,16,2,12&9,13,5,16&12,13,6,15&3,16,4,15~0,0,8,35,88,72,2,1980&13,14,8,316&9,11,35,286&4,5,88,717&13,18,72,661~0,0,12,38,88,84,10,1010&4,18,12,169&9,14,38,146&12,19,88,344&5,7,84,351~0,0,12,60,132,117,8,925&5,10,12,135&2,9,60,141&2,15,132,325&13,14,117,324",
                "BvSScratchies.--------B----------------":"12,4,79,55,355,302,24,4475~12,0,0,6,45,42,0,873&8,16,12,92&6,15,6,153&1,13,45,335&6,16,42,293~0,4,2,0,5,4,17,47&5,8,2,7&4,12,4,12&13,16,5,11&3,13,4,17~0,0,18,11,85,77,4,1828&0,8,18,187&14,16,11,352&6,11,85,649&0,12,77,640~0,0,20,14,88,74,19,876&8,10,20,101&2,11,14,170&1,15,88,328&10,15,74,277~0,0,39,24,132,105,1,851&4,8,39,95&9,16,24,157&10,13,132,315&3,11,105,284",
                "BvSScratchies.--------L----------------":"8,5,47,84,1542,621,14,10064~8,0,47,0,0,0,24,1636&10,16,8,326&1,10,1,12&10,15,12,671&4,18,16,316&2,4,18,311~0,5,0,84,0,0,20,1879&6,11,13,391&10,12,5,19&4,17,16,769&1,13,22,375&3,19,33,325~0,0,0,0,1542,0,24,3146&4,8,188,622&0,8,14,34&8,13,372,1266&8,17,392,609&7,8,576,615~0,0,0,0,0,621,24,3403&12,17,80,679&3,5,6,28&1,15,143,1325&1,5,164,722&1,6,228,649",
                "BvSScratchies.--------P----------------":"8,4,49,81,682,1352,23,9618~8,0,0,11,88,161,19,1956&3,6,8,308&5,10,11,357&13,18,88,722&2,8,161,569~0,4,2,0,8,10,3,105&0,6,2,21&13,16,4,23&16,17,8,36&6,8,10,25~0,0,10,17,170,318,18,3834&3,7,10,581&1,12,17,694&4,9,170,1399&5,8,318,1160~0,0,16,20,170,338,9,1895&13,15,16,282&4,16,20,349&14,18,170,688&0,8,338,576~0,0,21,33,246,525,1,1828&4,7,21,287&14,18,33,326&4,19,246,669&7,8,525,546",
                "BvSScratchies.--------S----------------":"5,7,30,148,388,328,20,5030~5,0,0,22,47,41,2,1056&1,10,5,185&8,19,22,142&3,12,47,372&0,17,41,357~0,7,2,0,5,5,0,65&11,17,2,11&7,8,7,14&1,5,5,19&5,9,5,21~0,0,6,32,85,81,0,1980&16,18,6,319&2,8,32,285&12,17,85,686&3,14,81,690~0,0,10,40,110,78,17,971&5,12,10,166&1,8,40,141&4,11,110,350&0,2,78,314~0,0,12,54,141,123,19,958&1,17,12,146&8,17,54,121&1,3,141,346&11,16,123,345",
                "BvSScratchies.-------B-----------------":"12,3,72,57,339,297,24,4400~12,0,0,9,48,38,8,922&7,13,12,100&0,17,9,172&6,18,48,343&9,12,38,307~0,3,2,0,4,5,6,43&1,7,2,6&0,12,3,10&3,16,4,10&3,15,5,17~0,0,18,13,80,65,1,1777&7,10,18,198&8,11,13,360&3,15,80,647&5,17,65,572~0,0,22,14,90,78,12,832&7,18,22,91&9,17,14,160&2,17,90,308&2,14,78,273~0,0,30,21,117,111,9,826&7,16,30,91&12,14,21,150&12,17,117,301&17,19,111,284",
                "BvSScratchies.-------L-----------------":"10,4,44,85,1621,652,4,10179~10,0,44,0,0,0,21,1578&2,9,10,334&0,1,1,17&0,1,9,599&9,13,16,340&0,12,18,288~0,4,0,85,0,0,20,1833&0,17,11,366&0,9,4,23&5,17,19,726&3,11,22,365&16,18,33,353~0,0,0,0,1621,0,23,3259&7,11,199,634&1,7,13,31&6,7,396,1285&7,18,428,660&3,7,585,649~0,0,0,0,0,652,23,3509&1,5,80,680&0,19,7,36&18,19,147,1407&10,15,160,687&6,8,258,699",
                "BvSScratchies.-------P-----------------":"8,4,41,77,720,1330,2,9558~8,0,41,0,0,0,23,1510&17,19,8,281&0,4,2,17&0,4,9,648&8,13,12,299&3,6,18,265~0,4,0,77,0,0,21,1706&5,13,10,327&9,13,4,18&6,8,19,718&0,4,18,327&9,15,30,316~0,0,0,0,720,0,23,3485&8,13,96,721&6,16,8,23&12,13,159,1392&1,15,190,709&10,12,267,640~0,0,0,0,0,1330,20,2857&7,10,170,570&7,8,8,18&6,7,316,1124&7,9,344,577&7,13,492,568",
                "BvSScratchies.-------S-----------------":"5,5,30,147,366,331,20,5021~5,0,0,20,47,40,13,988&1,12,5,167&7,11,20,131&4,10,47,344&0,18,40,346~0,5,1,0,6,5,10,61&4,6,1,6&7,18,5,18&12,13,6,21&16,17,5,16~0,0,7,33,90,77,5,2026&4,10,7,322&7,12,33,266&6,9,90,738&2,15,77,700~0,0,10,40,94,92,5,1050&0,3,10,179&7,18,40,145&0,8,94,362&0,10,92,364~0,0,12,54,129,117,13,896&2,15,12,141&7,10,54,116&1,2,129,320&5,15,117,319",
                "BvSScratchies.------B------------------":"13,3,73,55,386,309,24,4434~13,0,0,6,48,46,19,906&6,15,13,108&4,5,6,153&15,17,48,335&5,15,46,310~0,3,2,0,4,2,2,33&6,7,2,5&8,9,3,9&4,15,4,11&0,8,2,8~0,0,16,12,83,71,13,1752&6,10,16,197&3,11,12,291&18,19,83,642&4,15,71,622~0,0,22,16,86,82,3,905&5,6,22,92&8,15,16,161&14,18,86,339&0,14,82,313~0,0,33,21,165,108,5,838&0,6,33,104&0,9,21,140&10,16,165,335&15,17,108,259",
                "BvSScratchies.------L------------------":"7,4,52,92,1516,639,24,10149~7,0,0,12,182,81,1,2026&0,16,7,309&8,11,12,397&5,6,182,597&0,4,81,723~0,4,2,0,9,6,8,90&12,19,2,22&15,16,4,16&1,6,9,21&17,18,6,31~0,0,11,20,392,154,19,4094&12,14,11,623&5,8,20,726&6,11,392,1325&10,16,154,1420~0,0,12,24,372,164,13,1976&1,17,12,296&0,18,24,369&6,17,372,609&9,16,164,702~0,0,27,36,561,234,0,1963&5,15,27,306&2,10,36,364&6,16,561,626&2,8,234,667",
                "BvSScratchies.------P------------------":"8,4,46,91,692,1318,23,9495~8,0,0,13,95,145,18,1895&0,9,8,316&10,11,13,371&2,10,95,717&6,12,145,491~0,4,2,0,8,10,8,97&1,19,2,23&2,5,4,23&2,11,8,29&6,13,10,22~0,0,10,17,158,323,19,3778&4,13,10,649&4,18,17,680&3,7,158,1304&1,6,323,1145~0,0,16,22,170,348,4,1902&12,17,16,330&0,1,22,336&3,8,170,667&5,6,348,569~0,0,18,39,261,492,19,1823&4,9,18,293&1,11,39,313&14,15,261,662&5,6,492,555",
                "BvSScratchies.------S------------------":"5,6,32,159,396,340,22,5051~5,0,0,20,48,45,13,989&9,18,5,176&0,6,20,141&3,8,48,331&4,16,45,341~0,6,1,0,6,5,2,63&0,14,1,8&6,18,6,13&11,13,6,23&8,9,5,19~0,0,6,36,94,82,9,2028&0,8,6,300&6,12,36,266&3,13,94,765&16,18,82,697~0,0,10,40,98,82,3,994&0,11,10,157&6,11,40,130&8,9,98,370&8,19,82,337~0,0,15,63,150,126,1,977&18,19,15,148&6,16,63,136&10,13,150,358&0,13,126,335",
                "BvSScratchies.-----B-------------------":"12,4,80,55,362,299,22,4415~12,0,0,8,44,40,7,899&5,16,12,103&9,17,8,176&8,17,44,309&0,13,40,311~0,4,1,0,5,4,13,34&0,5,1,4&7,18,4,8&11,19,5,10&0,4,4,12~0,0,19,12,84,71,16,1795&5,19,19,198&4,14,12,322&2,19,84,676&0,3,71,599~0,0,24,14,94,76,15,902&5,18,24,100&1,13,14,172&10,19,94,345&4,16,76,285~0,0,36,21,135,108,11,785&2,5,36,82&1,4,21,145&2,18,135,292&12,19,108,266",
                "BvSScratchies.-----L-------------------":"7,4,57,94,1550,633,24,10145~7,0,0,13,192,81,12,2070&6,14,7,348&7,16,13,371&5,14,192,634&1,6,81,717~0,4,1,0,13,8,9,77&0,3,1,12&4,16,4,21&5,11,13,22&1,2,8,22~0,0,13,21,367,150,1,4069&4,12,13,667&10,19,21,719&5,8,367,1235&6,7,150,1448~0,0,16,24,414,160,13,1984&8,11,16,304&11,14,24,351&0,5,414,660&17,18,160,669~0,0,27,36,564,234,8,1945&17,19,27,317&0,18,36,346&1,5,564,620&1,3,234,662",
                "BvSScratchies.-----P-------------------":"9,4,48,83,689,1340,24,9462~9,0,0,9,94,170,13,1882&1,4,9,302&7,14,9,329&1,15,94,681&5,17,170,570~0,4,2,0,7,10,1,80&0,8,2,15&6,11,4,14&0,8,7,26&0,5,10,25~0,0,9,17,156,316,1,3702&10,12,9,563&14,17,17,667&10,12,156,1380&5,19,316,1092~0,0,16,24,174,340,0,1929&2,4,16,282&10,17,24,346&1,3,174,712&5,12,340,589~0,0,21,33,258,504,14,1869&0,8,21,288&8,11,33,328&8,12,258,690&5,19,504,563",
                "BvSScratchies.-----S-------------------":"6,4,30,154,377,338,23,5014~6,0,0,21,51,42,2,1000&9,17,6,152&5,9,21,123&14,15,51,383&6,19,42,342~0,4,1,0,7,5,18,63&0,12,1,5&5,19,4,12&11,13,7,22&3,15,5,24~0,0,7,34,90,81,0,1995&11,12,7,318&4,5,34,245&2,6,90,708&11,12,81,724~0,0,10,42,94,90,15,1033&9,19,10,176&5,16,42,143&2,12,94,354&2,13,90,360~0,0,12,57,135,120,2,923&0,1,12,139&3,5,57,123&14,15,135,341&6,17,120,320",
                "BvSScratchies.----B--------------------":"13,3,84,55,356,306,24,4551~13,0,0,8,47,39,19,859&4,5,13,90&7,10,8,152&2,17,47,326&6,17,39,291~0,3,2,0,6,4,10,48&3,4,2,3&13,15,3,19&8,11,6,15&6,13,4,11~0,0,23,12,84,74,17,1887&0,4,23,221&0,9,12,342&3,16,84,694&1,13,74,630~0,0,26,14,90,78,6,888&4,5,26,97&5,8,14,174&3,5,90,306&1,7,78,311~0,0,33,21,129,111,19,869&4,11,33,93&1,13,21,165&1,17,129,313&1,11,111,298",
                "BvSScratchies.----L--------------------":"9,5,52,83,1627,638,9,10125~9,0,52,0,0,0,24,1585&3,13,9,292&1,7,1,14&7,8,11,630&16,19,16,312&16,19,24,337~0,5,0,83,0,0,21,1837&11,15,10,391&12,16,5,27&7,16,18,673&13,19,22,380&0,5,33,366~0,0,0,0,1627,0,22,3232&4,12,194,625&0,4,16,38&4,5,379,1282&2,4,396,622&4,12,642,665~0,0,0,0,0,638,20,3471&3,5,84,693&10,19,7,31&1,19,153,1402&7,11,166,695&6,14,228,650",
                "BvSScratchies.----P--------------------":"8,4,46,89,666,1302,24,9418~8,0,0,11,86,171,7,1925&14,19,8,307&9,11,11,330&2,9,86,716&4,11,171,572~0,4,2,0,8,11,14,104&5,18,2,21&3,10,4,22&2,5,8,36&4,18,11,25~0,0,9,21,156,314,6,3724&3,5,9,610&17,19,21,676&0,19,156,1329&2,4,314,1109~0,0,14,24,170,338,13,1896&7,19,14,257&12,15,24,331&1,19,170,700&4,9,338,608~0,0,21,33,246,468,0,1769&5,19,21,266&6,15,33,325&7,14,246,651&4,5,468,527",
                "BvSScratchies.----S--------------------":"6,6,31,151,403,331,21,4975~6,0,0,18,48,44,18,987&7,14,6,148&4,11,18,139&7,12,48,355&11,17,44,345~0,6,1,0,4,4,19,47&0,11,1,11&4,9,6,9&1,15,4,11&1,17,4,16~0,0,7,34,92,76,5,1957&15,18,7,288&4,7,34,270&2,8,92,697&10,17,76,702~0,0,8,42,106,84,10,1010&3,16,8,145&4,6,42,141&1,2,106,372&5,18,84,352~0,0,15,57,153,123,3,974&11,15,15,144&1,4,57,138&1,12,153,376&12,19,123,316",
                "BvSScratchies.---B---------------------":"14,3,75,55,361,317,22,4476~14,0,0,7,43,38,15,861&3,6,14,101&0,10,7,160&4,10,43,312&9,13,38,288~0,3,2,0,6,3,9,43&3,13,2,5&10,16,3,13&0,13,6,16&4,10,3,9~0,0,17,12,80,71,13,1793&3,7,17,171&0,12,12,354&6,17,80,651&12,17,71,617~0,0,20,18,94,88,19,913&0,3,20,103&5,12,18,164&6,8,94,329&7,17,88,317~0,0,36,18,138,117,7,866&3,19,36,99&6,11,18,150&9,17,138,317&10,13,117,300",
                "BvSScratchies.---L---------------------":"9,4,50,85,1501,631,21,10028~9,0,0,11,191,76,2,1994&7,11,9,321&7,18,11,367&3,7,191,592&11,17,76,714~0,4,2,0,11,5,13,96&4,16,2,18&5,10,4,25&3,17,11,27&0,7,5,26~0,0,10,19,365,154,2,4058&1,14,10,644&5,13,19,722&3,8,365,1254&0,10,154,1438~0,0,14,22,352,162,7,1967&2,17,14,317&11,14,22,357&1,3,352,588&4,6,162,705~0,0,24,33,582,234,6,1913&10,14,24,285&1,5,33,341&3,17,582,615&12,15,234,672",
                "BvSScratchies.---P---------------------":"8,4,42,92,690,1322,24,9594~8,0,0,10,87,168,19,1911&12,17,8,290&13,16,10,340&1,11,87,710&3,4,168,571~0,4,2,0,9,11,6,97&14,16,2,13&2,7,4,27&10,16,9,34&3,13,11,23~0,0,10,18,163,322,5,3826&2,16,10,648&7,12,18,688&15,19,163,1337&3,13,322,1153~0,0,12,22,170,344,1,1935&8,9,12,303&0,6,22,344&4,7,170,690&3,5,344,598~0,0,18,42,261,477,19,1825&4,9,18,275&2,6,42,319&11,14,261,687&1,3,477,544",
                "BvSScratchies.---S---------------------":"5,5,31,153,381,350,23,4973~5,0,0,22,49,43,4,959&11,14,5,172&3,8,22,129&12,14,49,327&2,18,43,331~0,5,2,0,4,5,17,48&15,19,2,9&3,15,5,10&1,18,4,13&13,16,5,16~0,0,7,34,87,78,1,1980&13,19,7,301&3,17,34,275&4,11,87,704&10,15,78,700~0,0,10,40,106,80,18,999&1,11,10,142&3,10,40,146&2,17,106,382&8,12,80,329~0,0,12,57,135,144,8,987&5,6,12,147&1,3,57,143&4,9,135,354&4,19,144,343",
                "BvSScratchies.--B----------------------":"13,3,72,57,350,304,24,4461~13,0,0,8,50,39,5,964&2,11,13,124&7,9,8,181&6,8,50,347&9,10,39,312~0,3,1,0,5,4,10,42&2,8,1,3&6,9,3,14&5,14,5,15&6,11,4,10~0,0,18,14,80,65,15,1779&2,13,18,192&5,17,14,309&16,19,80,661&3,14,65,617~0,0,20,14,86,88,6,874&2,10,20,85&3,15,14,158&5,18,86,315&7,12,88,316~0,0,33,21,129,108,9,802&2,16,33,91&8,10,21,149&13,18,129,287&3,10,108,275",
                "BvSScratchies.--L----------------------":"9,4,43,91,1528,623,20,10085~9,0,0,10,179,80,11,1963&10,16,9,286&0,10,10,356&2,6,179,610&1,18,80,711~0,4,2,0,15,7,12,111&4,10,2,12&6,14,4,25&2,16,15,36&6,13,7,38~0,0,11,19,383,150,0,4079&5,9,11,657&12,17,19,718&2,19,383,1322&11,13,150,1382~0,0,12,26,366,152,11,1976&5,8,12,308&4,5,26,377&0,2,366,616&9,14,152,675~0,0,18,36,585,234,13,1956&0,10,18,299&0,16,36,334&2,4,585,632&3,14,234,691",
                "BvSScratchies.--P----------------------":"8,4,52,88,690,1284,21,9534~8,0,0,11,91,160,4,1874&5,9,8,316&1,13,11,307&1,5,91,710&2,17,160,541~0,4,2,0,7,10,0,88&6,11,2,18&4,16,4,17&6,18,7,29&2,17,10,24~0,0,10,19,167,331,17,3845&12,18,10,610&4,10,19,703&7,14,167,1423&2,13,331,1109~0,0,16,22,170,330,10,1918&5,19,16,307&6,16,22,338&6,14,170,686&2,4,330,587~0,0,24,36,255,453,10,1809&11,15,24,285&11,12,36,306&4,18,255,676&1,2,453,542",
                "BvSScratchies.--S----------------------":"5,5,30,161,396,337,22,5067~5,0,0,19,59,44,5,1017&11,16,5,162&2,12,19,121&6,10,59,373&11,14,44,361~0,5,1,0,6,6,12,62&5,15,1,7&2,19,5,14&5,7,6,21&4,13,6,20~0,0,6,39,92,78,18,2036&0,5,6,314&2,13,39,273&13,14,92,747&4,19,78,702~0,0,8,46,104,86,11,1014&1,6,8,176&2,12,46,130&16,19,104,365&10,17,86,343~0,0,15,57,135,123,14,938&7,12,15,151&2,10,57,118&10,13,135,331&9,19,123,338",
                "BvSScratchies.-B-----------------------":"14,3,69,45,372,312,0,4470~14,0,69,0,0,0,21,480&1,12,14,106&1,8,1,5&1,18,15,177&1,5,20,100&1,4,33,92~0,3,0,45,0,0,22,797&2,14,7,150&2,11,3,9&3,12,8,322&3,15,12,164&4,14,18,152~0,0,0,0,372,0,24,1667&2,5,54,357&17,19,6,18&14,18,87,658&2,13,96,321&13,14,129,313~0,0,0,0,0,312,24,1526&13,16,39,320&2,14,3,11&5,13,73,617&11,15,80,271&7,19,117,307",
                "BvSScratchies.-L-----------------------":"9,4,46,86,1568,639,15,10205~9,0,46,0,0,0,23,1639&2,17,9,374&0,3,1,20&10,13,10,639&4,11,14,307&0,8,21,299~0,4,0,86,0,0,24,1835&0,18,10,363&0,4,4,32&0,4,16,711&6,9,24,368&10,18,36,361~0,0,0,0,1568,0,21,3226&1,3,201,659&1,18,17,37&1,16,393,1289&1,3,390,628&1,14,567,613~0,0,0,0,0,639,24,3505&2,19,77,685&7,10,5,25&14,17,150,1452&6,12,152,685&3,4,255,658",
                "BvSScratchies.-P-----------------------":"8,5,38,85,685,1301,24,9465~8,0,0,11,88,162,9,1937&15,19,8,312&5,15,11,361&8,12,88,697&1,7,162,567~0,5,2,0,10,8,12,91&3,14,2,17&9,18,5,19&5,19,10,31&1,7,8,24~0,0,9,20,161,313,3,3758&2,15,9,587&10,12,20,697&13,17,161,1361&1,4,313,1113~0,0,12,24,180,344,13,1934&2,17,12,314&4,7,24,330&4,11,180,703&1,10,344,587~0,0,15,30,246,474,15,1745&4,18,15,259&3,17,30,307&0,14,246,649&1,19,474,530",
                "BvSScratchies.-S-----------------------":"6,5,28,151,392,337,20,4884~6,0,0,16,51,43,6,974&15,18,6,154&1,9,16,124&2,11,51,372&7,10,43,324~0,5,1,0,6,5,18,55&0,12,1,6&1,10,5,11&7,13,6,20&3,17,5,18~0,0,7,34,88,75,14,1909&13,18,7,315&1,7,34,242&8,11,88,694&0,15,75,658~0,0,8,44,106,88,18,999&0,2,8,155&1,11,44,117&0,16,106,386&4,9,88,341~0,0,12,57,141,126,6,947&0,18,12,164&0,1,57,112&8,9,141,329&8,16,126,342",
                "BvSScratchies.B------------------------":"13,3,78,59,371,330,21,4602~13,0,0,8,48,34,17,887&0,6,13,103&9,15,8,145&3,8,48,348&8,11,34,291~0,3,1,0,5,4,17,39&0,3,1,5&12,18,3,7&3,9,5,17&4,8,4,10~0,0,20,11,82,74,17,1802&0,15,20,207&4,18,11,341&8,12,82,641&2,14,74,613~0,0,24,16,92,80,6,928&0,16,24,102&4,8,16,175&2,3,92,347&5,16,80,304~0,0,33,24,144,138,11,946&0,10,33,105&1,2,24,186&1,9,144,338&7,17,138,317",
                "BvSScratchies.L------------------------":"8,4,51,103,1615,656,21,10663~8,0,0,13,199,77,14,2124&4,8,8,382&5,17,13,390&0,17,199,653&6,13,77,699~0,4,2,0,11,6,4,100&5,18,2,14&3,8,4,25&0,8,11,26&1,15,6,35~0,0,10,22,394,156,14,4296&7,11,10,650&2,10,22,800&0,13,394,1347&4,7,156,1499~0,0,18,26,414,174,19,2105&9,16,18,338&2,8,26,383&0,5,414,661&5,6,174,723~0,0,21,42,597,243,7,2038&6,15,21,334&1,16,42,371&0,15,597,646&17,18,243,687",
                "BvSScratchies.P------------------------":"8,4,52,89,729,1352,23,10146~8,0,0,12,95,171,16,2057&2,12,8,326&7,9,12,389&3,8,95,754&0,18,171,588~0,4,2,0,8,9,15,98&7,13,2,11&2,16,4,26&5,14,8,31&0,3,9,30~0,0,11,18,173,342,15,4052&5,16,11,645&14,19,18,732&11,17,173,1455&0,2,342,1220~0,0,18,26,180,332,17,1997&15,18,18,344&10,19,26,315&4,10,180,751&0,16,332,587~0,0,21,33,273,498,6,1942&9,19,21,318&12,17,33,344&12,13,273,719&0,2,498,561",
                "BvSScratchies.S------------------------":"6,6,32,157,383,336,20,5277~6,0,0,19,52,47,9,1089&2,12,6,179&0,11,19,146&7,11,52,385&4,14,47,379~0,6,1,0,6,4,4,66&1,2,1,13&0,3,6,14&1,14,6,23&7,13,4,16~0,0,7,36,96,78,17,2109&8,13,7,345&0,11,36,279&4,11,96,782&8,10,78,703~0,0,12,42,100,78,8,1025&1,7,12,172&0,10,42,142&2,10,100,378&6,15,78,333~0,0,12,60,129,129,12,988&2,9,12,172&0,19,60,141&2,16,129,342&9,13,129,333",
            };
        } else {
            alert("Strat data unavailable, sorry.");
            return;
        }
        for (var name in stratData) {
            localStorage[name] = stratData[name];
        }
        alert('done');
    }

    // Build the html for a given stats object
    my.htmlStrategy = function(stats) {

        // Initialize the html string
        var html = "";

        // Initialize item names and winnings
        var item_list     = new Array("Claymore", "ShoNuff", "26 Buckets", "Goldens", "Yomas", "Supers");
        var winnings_list = new Array(stats.claymore, stats.shonuff, stats.buckets, stats.golden, stats.yoma, stats.super);

        // Build the Info table
        html += "<div><b>Aggregate Winnings:<b> &nbsp &nbsp (" + stats.numcards + " tickets)<br><table>";

        var i;
        for (i=0;i<6;i++) {
            html += "<tr><td><b>" + item_list[i] + ":</b></td>";
            html += "<td>" + winnings_list[i] + "<td>("
                + Math.round(winnings_list[i] * 100.0 * 1000/ stats.numcards)/1000 + "%)</td></tr>";
        }

        html += "</table></div>";

        return html;
    }

    // Scratch suggested strategy spot and build html for popup statistics
    my.doStrategy = function() {

        var scratchySettings = new DOMStorage("local", "BvSScratchies");

        // Get the strategy data
        var info = scratchySettings.getItem(my.getBloodline(), "Error Code GAMMA").split("~");

        // Extract All info about the first scratch
        var first  = new Object();
        var second = new Object();
        var final  = new Object();

        first.info = info[0].split(",");
        first.claymore = first.info[0];
        first.shonuff  = first.info[1];
        first.buckets  = first.info[2];
        first.golden   = first.info[3];
        first.yoma     = first.info[4];
        first.super    = first.info[5];
        first.spot     = parseInt(first.info[6]);
        first.numcards = first.info[7];

        switch (my.scratchy[first.spot]) {
            case '-' :
                // Mark the next scratch spot and return the html for first object
                document.getElementById("cb" + (first.spot > 19 ? "y" + (first.spot - 20) : first.spot) ).checked=true;
                return my.htmlStrategy(first);
                break;

            case 'B' : second.info = info[1]; break;
            case 'S' : second.info = info[2]; break;
            case 'L' : second.info = info[3]; break;
            case 'P' : second.info = info[4]; break;

            case '1' : second.info = info[3]; break;
            case '2' : second.info = info[4]; break;
            case '3' : second.info = info[5]; break;
        }

        if (second.info) {
            // Break down info string as before and proceed
            second.info = second.info.split("&");

            second.claymore = second.info[0].split(",")[0];
            second.shonuff  = second.info[0].split(",")[1];
            second.buckets  = second.info[0].split(",")[2];
            second.golden   = second.info[0].split(",")[3];
            second.yoma     = second.info[0].split(",")[4];
            second.super    = second.info[0].split(",")[5];
            second.spot     = parseInt(second.info[0].split(",")[6]);
            second.numcards = second.info[0].split(",")[7];

            // Scratch second spots if necessary
            switch (my.scratchy[second.spot])
            {
                case '-' :
                    // Mark the next scratch spot and return html for second object
                    document.getElementById("cb" + (second.spot > 19 ? "y" + (second.spot - 20) : second.spot) ).checked=true;
                    return my.htmlStrategy(second);
                    break;

                case 'B' : final.info = second.info[1]; break;
                case 'S' : final.info = second.info[2]; break;
                case 'L' : final.info = second.info[3]; break;
                case 'P' : final.info = second.info[4]; break;

                case '1' : final.info = second.info[3]; break;
                case '2' : final.info = second.info[4]; break;
                case '3' : final.info = second.info[5]; break;
            }

            // Legacy: Manually scratch billy bonus if necessary
            if (second.spot > 19 && my.getBloodline()[second.spot] == 'B')
                document.getElementById("cb" + (second.spot > 19 ? "y" + (second.spot - 20) : second.spot) ).checked=true;

            // Finally scratch final spots if necessary
            if (final.info)
            {
                // Scratch the Last two spots
                final.spot0 = parseInt(final.info.split(",")[0]);
                final.spot1 = parseInt(final.info.split(",")[1]);
                final.numcards = parseInt(final.info.split(",")[3]);

                document.getElementById("cb" + (final.spot0 > 19 ? "y" + (final.spot0 - 20) : final.spot0) ).checked=true;
                document.getElementById("cb" + (final.spot1 > 19 ? "y" + (final.spot1 - 20) : final.spot1) ).checked=true;

                // Set the winnings for final
                final.claymore = 0;
                final.shonuff  = 0;
                final.buckets  = 0;
                final.golden   = 0;
                final.yoma     = 0;
                final.super    = 0;

                if (my.scratchy[first.spot] == 'B' && my.scratchy[second.spot] == 'B')
                    final.claymore = parseInt(final.info.split(",")[2]);
                else if (my.scratchy[first.spot] == 'S' && my.scratchy[second.spot] == 'S')
                    final.shonuff = parseInt(final.info.split(",")[2]);
                else if (my.scratchy[Math.min(first.spot,second.spot)] == 'B')
                    final.buckets = parseInt(final.info.split(",")[2]);
                else if (my.scratchy[Math.min(first.spot,second.spot)] == 'S')
                    final.golden = parseInt(final.info.split(",")[2]);
                else if (my.scratchy[Math.min(first.spot,second.spot)] == 'L')
                    final.yoma = parseInt(final.info.split(",")[2]);
                else if (my.scratchy[Math.min(first.spot,second.spot)] == 'P')
                    final.super = parseInt(final.info.split(",")[2]);

                return my.htmlStrategy(final);
            }
        }

    }

    // update the layer
    my.update = function(success, text) {

        var html = "";
        switch(success) {
            case 0: { // init
                html = "Loading. Please wait...";
            } break;
            case 1: { // query returned
                alert("Error Code BACON: unreachable code");
            } break;
            case 2: { // failed
                html = "Ticket Failed.<br/><a href=\"javascript:tickAndScratch();\">Scratch Spots &gt;</a>";
            } break;
            case 3: { // won
                html = "Ticket Won.<br/><a href=\"javascript:document.forms.namedItem('mainform2').submit();\">Get New Ticket &gt;</a>";
            } break;
            case 4: { // message
                html = text;
            } break;
        }

        // Links for updating strategy.txt file
        html =  '<b>Select a strategy:</b>' +
            '<br /><a strat="shonuff" href="javascript:void(0)" id="aStratShonuff">Maximum Shonuff &gt;</a> ' +
            '<br /><a strat="claymore" href="javascript:void(0)" id="aStratClaymore">Maximum Claymore &gt;</a>' +
            '<br /><a strat="value" href="javascript:void(0)" id="aStratRyo">Maximum Ryo Value &gt;</a>' +
            '<br /><a strat="count" href="javascript:void(0)" id="aStratWin">Maximum Win Chance &gt;</a>' +
            '<br /><br />' +
            html;

        my.window.element.innerHTML = html;

        // Add events to strategy links for greasemonkey function callback
        document.getElementById("aStratShonuff" ).addEventListener("click", my.updateStrategy, true);
        document.getElementById("aStratClaymore").addEventListener("click", my.updateStrategy, true);
        document.getElementById("aStratRyo"     ).addEventListener("click", my.updateStrategy, true);
        document.getElementById("aStratWin"     ).addEventListener("click", my.updateStrategy, true);
    }

    my.update(0);
    my.addBrowserScript(my.browserScript);
    my.parseImages();

    if(my.scratchy.length == 25) {
        if(my.bestPick != "F" && my.pickCount < 4) {
            // Use Enhanced algorithm from local DOM storage
            var html = my.doStrategy();
            hotkeyEnable = true;
            my.update(4,html);
        }
        else if (my.bestPick == "F" && my.pickCount == 4) {
            // Send query to server for failed ticket
            my.query.push("scratchy=" + my.scratchy);
            my.query.push("bloodline=" + my.getBloodline());
            my.query.push("bestPick=" + my.bestPick);
            my.query.push("show=" + scratchySettings.getItem(my.playerName() + ".show"));
            my.query.push("superPicked=" + my.superPicked);
            my.query.push("player=" + my.playerName());
            my.query.push("version=" + serverVersion);
            //my.queryServer(my.query.join("&"));
        }
        else{
            if(my.pickCount < 4) {
                // Failed ticket which needs remaining spots scratched
                document.getElementById("cb0").checked = true;
                document.getElementById("cb1").checked = true;
                document.getElementById("cb2").checked = true;
                document.getElementById("cby0").checked = true;
                hotkeyEnable = true;
                my.update(2);
            }
            else {
                // Winning ticket
                hotkeyEnable = true;
                my.update(3);
            }
        }
    }
}

var headerText = document.evaluate("//font/font/b[text()='Scratchy Tickets']/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if(headerText != null && headerText.snapshotLength == 1) {
    var scratchySettings = new DOMStorage("local", "BvSScratchies");
    var scratchyWindow = new FloatingScratchy();
}

// Hotkey listeners

function KeyCheck(event) {
    var KeyID = event.keyCode;

    // Enter Key OR S Key
    if (hotkeyEnable && (KeyID == 13 || KeyID == 83))
        document.forms.namedItem("mainform2").submit();
}

document.documentElement.addEventListener("keyup", KeyCheck, true);