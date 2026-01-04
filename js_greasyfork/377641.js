// ==UserScript==
// @name         Marosia Visual Enhancer
// @version      0.2
// @description  This script modifies the look of the main play pages of Marosia to allow for the elements to use more of the monitor's real estate.
// @author       AniCator
// @match        https://www.marosia.com/play.php
// @grant        none
// @copyright       2019, AniCator (http://www.anicator.com)
// @license			MIT
// @namespace       http://www.anicator.com
// @downloadURL https://update.greasyfork.org/scripts/377641/Marosia%20Visual%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/377641/Marosia%20Visual%20Enhancer.meta.js
// ==/UserScript==

var hilight_emotes = function(i) {return "<span class='mar_emote'>" + i + "</span>";};

var hilight_quotes = function(i, a) {
    // There are several styles of emotes that vary by region.  If you enable them all, you will probably get a mis-identified emote on occasion, sorry!
    // To enable one, remove from the "//" beginning of the line.  To Disable, put a // at the beginning of the line.

    console.log(a);

    // *Paired Astrisks*
	a = a.replace(/\*[^<>]*?\*/g,hilight_emotes);

    // *Quotes*
    a = a.replace(/\"[^<>]*?\"/g,hilight_emotes);

    // -Paired Dashes-
	a = a.replace(/-[^<>]*?-/g,hilight_emotes);

    // #Paired Hashtags#
	a = a.replace(/#[^<>]*?#/g,hilight_emotes);

    return '<span style="color:#FFFFFF">' + a + '</span>';
};

var EventObjects = [];
var EventsList = document.getElementById('event-list');
var GameEvents = EventsList.getElementsByClassName('play-event');

(function() {
    get_old_events();

    var StyleEdit = document.createElement('style');
    StyleEdit.type = 'text/css';
    StyleEdit.innerHTML = ".container { width:100% !important; min-width:100% !important; } .play-column-side {width:10%;} .play-columns .col-md-6 { width:80%; }";
    StyleEdit.innerHTML += ".mar_emote {color:#77FF11;}";

    document.getElementsByTagName('head')[0].appendChild(StyleEdit);

    var ParseGameEvent = function( GameEvent )
	{
        var Status = GameEvent.getAttribute("status");
        if(Status === null)
        {
            console.log(GameEvent);
            var Body = GameEvent.getElementsByClassName('panel-body')[0];
            if(typeof Body !== 'undefined')
            {
                console.log(Body);
                if(Body.innerHTML !== 'undefined')
                {
                    Body.style.background = "black";
                    Body.innerHTML = Body.innerHTML.replace(/([\s\S]*)/g,hilight_quotes);
                }
            }

            GameEvent.setAttribute("status", "processed");
        }
	}

	var MaximumEventCount = -1;
	var ParsingInterval = 100;
	var EntriesPerParse = 20;
	var QueueEvents = function(limit){
		for(var i = 0; i < GameEvents.length && i != limit; i+=1)
		{
			EventObjects.push(GameEvents[i]);
		}
        console.log(EventObjects.length);
	};

	var ParseEvents = function(){
		var GameEvents = EventObjects.splice(0, EntriesPerParse);
		GameEvents.forEach(GameEvent => {
			ParseGameEvent(GameEvent);
		});
	};

    QueueEvents(MaximumEventCount);
	setInterval(ParseEvents,ParsingInterval);

    var EnableByNameOriginal = function(t){ console.log("Failed to hook.");};
    var EnableByNameNew = function(t){
        EnableByNameOriginal(t);
        if(t == 'loadEvents')
        {
            GameEvents = EventsList.getElementsByClassName('play-event');
            QueueEvents(MaximumEventCount);
            console.log("Load event.");
        }
    };
	if(typeof unsafeWindow === 'undefined')
	{
		if(typeof enable_by_name !== 'undefined')
		{
			EnableByNameOriginal = enable_by_name;

            enable_by_name = function(t){
			EnableByNameNew(t);
		};
		}
	}
	else
	{
		EnableByNameOriginal = unsafeWindow.enable_by_name;

        unsafeWindow.enable_by_name = function(t){
			EnableByNameNew(t);
		};
	}
})();