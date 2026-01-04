// ==UserScript==
// @name        Amo - Cheater - Normal
// @namespace   bnf:2001
// @description Cheaty na Amo. Korzystasz na własną odpowiedzialność
// @author      B.N.F
// @include     *amorion.pl/start.php*
// @version     3.28-Normal
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406526/Amo%20-%20Cheater%20-%20Normal.user.js
// @updateURL https://update.greasyfork.org/scripts/406526/Amo%20-%20Cheater%20-%20Normal.meta.js
// ==/UserScript==


var Cheater       = document.createElement('div');
Cheater.innerHTML =  '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
	               + '<table id="Cheater Menu" style="text-align: left; width="960px" height="30px" border="0" cellpadding="5" cellspacing="0" bgcolor="#000000";>'
  				   + '<tbody>'
    			   + '<tr>'
      			   + '<td valign="middle" style="width: 960px;">'
				   + '<button id="myyButton" type="button" font color="black">'
                   + 'Usuń Limit Znaków</button>'
				   + '</td>'
    			   + '</tr>'
  				   + '</tbody>'
				   + '</table>'
				   ;
Cheater.setAttribute ('id', 'Cheater');

var MiejscePodCheater        = document.getElementById('main');
	MiejscePodCheater.parentNode.insertBefore(Cheater, MiejscePodCheater);
var Chukryty = document.getElementById('Cheater');
    Chukryty.style.display = 'none';

var xNode       = document.createElement ('div');
xNode.innerHTML = '<center>'
				+ '<p>Cheater'
				+ '<br>'
				+ 'v.3.28 - Normal'
				+ '<br>'
				+ '<br>'
				+ '<button id="CheatOn" type="button">'
                + 'Wł.</button>'
				+ '&nbsp;'
				+ '<button id="CheatOff" type="button">'
				+ 'Wył.</button></p>'
				+ '<br>'
				+ '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'inventory.php?napraw_uzywane\')"><span style="color:#BBBBBB">Napraw Ekwipunek</span></a>'
				+ '<br>'
				+ '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'hospital.php?action=heal\');"><span style="color:#BBBBBB">Ulecz</span></a>'
                + '<br>'
                + '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'hospital.php?action=ressurect\');"><span style="color:#BBBBBB">Wskrześ</span></a>'
                + '<br>'
                + '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'battle.php?action=monster\');"><span style="color:#BBBBBB">Lista Potworów</span></a>'
                + '<br><br>'
				+ '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'inventory.php?napraw_uzywane\');Link(\'dynamic\', \'hospital.php?action=heal\');"><span style="color:#BBBBBB">Pełna Gotowość</span></a>'
                + '<br>'
				+ '</center>'
                ;
xNode.setAttribute ('id', 'myyContainer');
document.body.appendChild (xNode);

// Reklamy //
var NoweMenu       = document.createElement('div');
NoweMenu.id 	   = "menu";
NoweMenu.innerHTML = '<table style="text-align: left; width: 960px;" border="0" cellpadding="0" cellspacing="0">'
  				   + '<tbody>'
    			   + '<tr>'
      			   + '<td><div id="statystyki" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/statystyki.png" onmouseover="AlterImgMenu(\'statystyki\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'statystyki\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'stats.php\')"></div></td>'
      			   + '<td><div id="bogactwa" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/bogactwa.png" onmouseover="AlterImgMenu(\'bogactwa\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'bogactwa\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'wealth.php\')"></div></td>'
      			   + '<td><div id="ekwipunek" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/ekwipunek.png" onmouseover="AlterImgMenu(\'ekwipunek\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'ekwipunek\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'inventory.php\')"></div></td>'
      			   + '<td><div id="klan" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/klan.png" onmouseover="AlterImgMenu(\'klan\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'klan\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'klany.php?view=my\')"></div></td>'
      			   + '<td><div id="premium" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/premium.png" onmouseover="AlterImgMenu(\'premium\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'premium\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'premin.php\')"></div></td>'
                   + '<td><div id="pamietnik" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/pamietnik.png" onmouseover="AlterImgMenu(\'pamietnik\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'pamietnik\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'notatnik.php\')"></div></td>'
     			   + '<td><div id="opcje" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/opcje.png" onmouseover="AlterImgMenu(\'opcje\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'opcje\', \'gui/button_off.png\')" onclick="Link(\'dynamic\', \'account.php\')"></div></td>'
                   + '<td><div id="wyloguj" class="menubutton" style="background: url(http://amorion.pl/gui/button_off.png);"><img src="gui/wyloguj.png" onmouseover="AlterImgMenu(\'wyloguj\', \'gui/button_on.png\')" onmouseout="AlterImgMenu(\'wyloguj\', \'gui/button_off.png\')" onclick="Go(\'logout.php?did=403\')"></div></td>'
    			   + '</tr>'
  				   + '</tbody>'
				   + '</table>'
	
var RekMenu        = document.getElementById('main');
	RekMenu.parentNode.replaceChild(NoweMenu, RekMenu);
// End Reklamy//

document.getElementById ("myyButton").addEventListener (
    "click", ButtonClickActions, false
);

function ButtonClickActions (xEvent) {
	var sList, nList;
	sList = document.getElementById('list');
    if (sList) {
	nList = document.createElement("textarea");
	nList.id = "list";
	nList.name = "body";
	nList.cols = "60";
	nList.rows = "20";
	sList.parentNode.replaceChild(nList, sList);
    }
	document.getElementById ("myyContainer").appendChild (xNode);
}

document.getElementById ("CheatOn").addEventListener (
    "click", ButtonClickActionCON, false
);

function ButtonClickActionCON (xEvent2) {
	var WlCh = document.getElementById('Cheater');
    WlCh.style.display = 'inline';
	
	document.getElementById ("myyContainer").appendChild (xNode);
}

document.getElementById ("CheatOff").addEventListener (
    "click", ButtonClickActionCOFF, false
);

function ButtonClickActionCOFF (xEvent3) {
	var WylCh = document.getElementById('Cheater');
    WylCh.style.display = 'none';
	
	document.getElementById ("myyContainer").appendChild (xNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myyContainer {
        position:               absolute;
        top:                    10px;
        left:                   2%;
        background:             #000000;
        border:                 3px outset white;
        opacity:                0.75;
        z-index:                222;
        padding:                5px 5px;
    }
    #myyButton {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
    }
    #CheatOn {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
    }
    #CheatOff {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
    }
    #myyContainer p {
		color:					#B0B0B0;
		cursor:					default;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}