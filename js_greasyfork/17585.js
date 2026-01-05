// ==UserScript==
// @name        Hide Run Times
// @namespace   Youtube
// @description Hides the Run Times for youtube GDQs
// @include     *://www.youtube.com/*
// @version     1.05
// @author      joe40001
// @downloadURL https://update.greasyfork.org/scripts/17585/Hide%20Run%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/17585/Hide%20Run%20Times.meta.js
// ==/UserScript==





function GM_main () {

	var titleString = "";
	var repString = "a";
	var index = -1;

//titleString = document.getElementsByName("title")[0].getAttribute("content");

	function removeRunTime() {


var badClass = document.getElementsByClassName("ytp-title-link");
			var tds = badClass[0].getElementsByTagName('span');
			var overflowPreventor = 0;
			var newTitle = tds[1].innerHTML
			
		


	//var newTitle = document.title;
		//var newTitle = document.getElementsByName("title")[0].getAttribute("content");
//console.log( " N " + newTitle + " T " + titleString + " R " + repString);
		if(titleString !== newTitle && newTitle !== repString){

			titleString = newTitle;
			index = -1;
			for(var i = 0; i < 10; i++){
				if(index==-1 || ( (titleString.indexOf(":"+i) != -1) && (titleString.indexOf(":"+i) < index) ) ){
					index= titleString.indexOf(":"+i);
				}
			}
		}
//console.log( " 2N " + newTitle + " T " + titleString + " R " + repString);
	
		
		if(index != -1){
                        var titleString2=titleString;
                        if(titleString.indexOf("&")!=-1){
                           var titleString2 = titleString.substr(0,titleString.indexOf("&amp;"))+"&"+titleString.substr(titleString.indexOf("&amp;")+5);
                           index = index-4;
                        }

			var startS = titleString2.substr(index-3).indexOf(" ")+index-2;
			var endS = titleString2.substr(index).indexOf(" ");
			repString = titleString2.substr(0,startS)+"??:??:??"+titleString2.substr(index+endS);
			document.title = repString;
			
			
			
			var queryString = '[content="'+titleString2+'"]';
			var tds = document.querySelectorAll(queryString);
			var overflowPreventor = 0;
			for (var i = 0; i<tds.length; i++) {
				var subLink =  tds[i].getAttribute("content");
				tds[i].setAttribute("content", repString);
			}
			var queryString = '[title="'+titleString2+'"]';
			var tds = document.querySelectorAll(queryString);
			var overflowPreventor = 0;
			for (var i = 0; i<tds.length; i++) {
				var subLink =  tds[i].getAttribute("title");
				tds[i].setAttribute("title", repString);
				if(tds[i].innerHTML.indexOf(titleString)!=-1 || tds[i].innerHTML.indexOf(titleString2)!=-1){
					tds[i].innerHTML=repString;
				}
			}



			var badClass = document.getElementsByClassName("ytp-title-link");
			var tds = badClass[0].getElementsByTagName('span');
			var overflowPreventor = 0;
			for (var i = 0; i<tds.length; i++) {
	                        if(tds[i].innerHTML.indexOf(titleString)!=-1 || tds[i].innerHTML.indexOf(titleString2)!=-1){
					tds[i].innerHTML=repString;
				}
			}
		}
	}

	


removeRunTime();
	setTimeout(500,removeRunTime());
	setTimeout(1000,removeRunTime());
	setTimeout(1500,removeRunTime());
	setTimeout(2000,removeRunTime());
	setTimeout(3000,removeRunTime());
	setTimeout(10000,removeRunTime());



	window.stateChanged = function (state) {
		
			removeRunTime();
	setTimeout(500,removeRunTime());
	setTimeout(1000,removeRunTime());
	setTimeout(1500,removeRunTime());
	setTimeout(2000,removeRunTime());
	setTimeout(3000,removeRunTime());
	setTimeout(10000,removeRunTime());
			
		
    }

    window.onYouTubePlayerReady = function (playerId) {
        /*-- playerId is not being set by Youtube. Use
            hard-coded id (movie_player) instead.
        */
        var playerNode  = document.getElementById ("movie_player");
        if (playerNode) {
            /*--- Note, inside onYouTubePlayerReady ONLY, the YouTube API
                seems to override addEventListener. Hence the nonstandard
                parameters.
            */
            playerNode.addEventListener ('onStateChange', 'stateChanged');

            console.log ('GM: Listener installed just fine.');
        }
        else
            console.error ("GM: Player node not found!");
    }
}

addJS_Node (null, null, GM_main);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}