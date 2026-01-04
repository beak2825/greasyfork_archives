// ==UserScript==
// @name        Various Button Features For Spriteclub.TV
// @namespace   http://tampermonkey.net/
// @version     1.055
// @description None
// @author      You
// @match       https://mugen.spriteclub.tv/character?id=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/372766/Various%20Button%20Features%20For%20SpriteclubTV.user.js
// @updateURL https://update.greasyfork.org/scripts/372766/Various%20Button%20Features%20For%20SpriteclubTV.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var statElem = Array.from(document.querySelectorAll('.stat-elem'));
    var filtered = [];
    var tempBlue = "";
    var tempRed = "";
    var blueSplit = [];
    var tempStatElem = [];
    var exactMatch;
    var i = 0;
    var charID = 0;
    var CharName = document.querySelector('.character-name').textContent;

    function removeMatch() {
        tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));
        for (i = 0; i < tempStatElem.length; i += 1) {
            if (tempStatElem[i].querySelector('.matches-session').textContent.indexOf("Exhib") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-bluename').textContent.indexOf(" / ") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-redname').textContent.indexOf(" / ") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-bluename').textContent.indexOf(" ⇒ ") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            }
        }
    }

    function keep1v1Exhib() {
        tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));
        for (i = 0; i < tempStatElem.length; i += 1) {
            if (tempStatElem[i].querySelector('.matches-bluename').textContent.indexOf(" / ") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-redname').textContent.indexOf(" / ") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-bluename').textContent.indexOf(" ⇒ ") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            }
        }
    }
    
    function ShowOnly1v1Exhib() {
        tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));        
        for (i = 0; i < tempStatElem.length; i += 1) {
            if (tempStatElem[i].querySelector('.matches-session').textContent.indexOf("Exhib") === -1)
            {
                tempStatElem[i].setAttribute('style', "display:none");
            }
            else if (tempStatElem[i].querySelector('.matches-bluename').textContent.indexOf(" / ") !== -1)
            {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-redname').textContent.indexOf(" / ") !== -1)
            {
                tempStatElem[i].setAttribute('style', "display:none");
            } else if (tempStatElem[i].querySelector('.matches-bluename').textContent.indexOf(" ⇒ ") !== -1)
            {
                tempStatElem[i].setAttribute('style', "display:none");
            }
        }
    }
    
    function ShowOnlyLoss() {
        tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));        
        for (i = 0; i < tempStatElem.length; i += 1) {
            if (tempStatElem[i].querySelector('.sc-orange') === null)
            {
                tempStatElem[i].setAttribute('style', "display:none");
            }
            
        }
    }

    function restoreDisplay() {
        tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));
        for (i = 0; i < tempStatElem.length; i += 1) {
            tempStatElem[i].setAttribute('style', 'display:table-row');
        }
    }

    function hidePrelims() {
        tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));
        for (i = 0; i < tempStatElem.length; i += 1) {
            if (tempStatElem[i].querySelector('.matches-session').textContent.indexOf("Prelim") !== -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            }
        }
    }

	function showDebut() {
	    tempStatElem = Array.from(document.querySelectorAll('.stat-elem'));
        for (i = 0; i < tempStatElem.length; i += 1) {
            if (tempStatElem[i].querySelector('.matches-session').textContent.indexOf("Debut") === -1) {
                tempStatElem[i].setAttribute('style', "display:none");
            }
		}
	}


    

    function PlaceCharLeftSide() {
        filtered = Array.from(document.querySelectorAll('.stat-elem')).reverse();
        for (i = 0; i < filtered.length; i += 1) {                        
            tempBlue = filtered[i].querySelector(".matches-bluename").textContent;
            tempRed = filtered[i].querySelector(".matches-redname").textContent;
            if (tempBlue.indexOf(" / ") === -1 && tempRed.indexOf(" / ") === -1 && tempBlue.indexOf(" ⇒ ") === -1)
            {
                if (tempBlue !== CharName) 
                {
                    filtered[i].querySelector(".matches-redname").textContent = tempBlue;
                    filtered[i].querySelector(".matches-bluename").textContent = tempRed;
                }                
            }
            else if (tempBlue.indexOf(CharName) === -1)
            {
                filtered[i].querySelector(".matches-redname").textContent = tempBlue;
                filtered[i].querySelector(".matches-bluename").textContent = tempRed;                
            }
            // Edge case for similar names
            else if (tempBlue.indexOf(" / ") !== -1) 
            {
                blueSplit = tempBlue.split(" / ");
                exactMatch = false;
                for (j = 0; j < blueSplit.length; j++)
                {
                   if (blueSplit[j] === CharName) exactMatch = true;
                }
                if (exactMatch === false) 
                {
                    filtered[i].querySelector(".matches-redname").textContent = tempBlue;
                    filtered[i].querySelector(".matches-bluename").textContent = tempRed;                    
                }

            }
            else if (tempBlue.indexOf(" ⇒ ") !== -1) 
            {
                blueSplit = tempBlue.split(" ⇒ ");
                exactMatch = false;
                for (var j = 0; j < blueSplit.length; j++)
                {
                   if (blueSplit[j] === CharName) exactMatch = true;
                }
                if (exactMatch === false) 
                {
                    filtered[i].querySelector(".matches-redname").textContent = tempBlue;
                    filtered[i].querySelector(".matches-bluename").textContent = tempRed;                    
                }

            }
        }
    }

    if (true) {
        var keepExhib = document.createElement('button');
        keepExhib.textContent = "Show Only 1v1 (Keep Exhibs)";
        keepExhib.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px; margin-left:5px;";
        keepExhib.onclick = keep1v1Exhib;
        document.querySelector('#list-label').appendChild(keepExhib);

        var buttonRemove = document.createElement('button');
        buttonRemove.textContent = "Show Only 1v1 (Hide Exhibs)";
        buttonRemove.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px;";
        buttonRemove.onclick = removeMatch;
        document.querySelector('#list-label').appendChild(buttonRemove);	

        var buttonExhib1V1 = document.createElement('button');
        buttonExhib1V1.textContent = "Show Only 1v1 Exhibs";
        buttonExhib1V1.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px;";
        buttonExhib1V1.onclick = ShowOnly1v1Exhib;
        document.querySelector('#list-label').appendChild(buttonExhib1V1);	
        
        var buttonShowLoss = document.createElement('button');
        buttonShowLoss.textContent = "Show Losses";
        buttonShowLoss.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px;";
        buttonShowLoss.onclick = ShowOnlyLoss;
        document.querySelector('#list-label').appendChild(buttonShowLoss);	

		var buttonShowDebut = document.createElement('button')
		buttonShowDebut.textContent = "Show Debuts"
		buttonShowDebut.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px;";
		buttonShowDebut.onclick = showDebut;
		document.querySelector('#list-label').appendChild(buttonShowDebut);

        var hidePrelimsButton = document.createElement('button');
        hidePrelimsButton.textContent = "Hide Preliminaries";
        hidePrelimsButton.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px;";
        hidePrelimsButton.onclick = hidePrelims;
        document.querySelector('#list-label').appendChild(hidePrelimsButton);

        var restoreDisplayButton = document.createElement('button');
        restoreDisplayButton.textContent = "Unhide Matches";
        restoreDisplayButton.style = "width:100px; height:40px; color:black; font-size:12px; margin-right:5px;";
        restoreDisplayButton.onclick = restoreDisplay;
        document.querySelector('#list-label').appendChild(restoreDisplayButton);
    }

    PlaceCharLeftSide();
})();
