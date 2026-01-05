// ==UserScript==
// @name        Amo - Ulepszacz Tawerny
// @namespace   bnf:2001
// @description Gadget pozwalający na wygodne zmiany w izbie/piwnicy na amorion.pl
// @author      B.N.F
// @include     *amorion.pl/start.php*
// @include     *147.135.199.206/start.php*
// @version     +6.03
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21629/Amo%20-%20Ulepszacz%20Tawerny.user.js
// @updateURL https://update.greasyfork.org/scripts/21629/Amo%20-%20Ulepszacz%20Tawerny.meta.js
// ==/UserScript==

////////////

var zNode       = document.createElement ('div');
zNode.innerHTML = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
				+ '<center>'
				+ '<p>Ulepszacz Tawerny'
				+ '<br>'
				+ 'v.+6.03'
				+ '<br>'
				+ '<br>'
				+ '<button id="myButton5" type="button">'
                + 'Wł.</button>'
				+ '&nbsp;'
				+ '<button id="myButton6" type="button">'
				+ 'Wył.</button></br><br>'
				+ 'Podgląd na piwnicę</br>'
				+ '<button id="myButton7" type="button">'
				+ 'Wł.</button>'
				+ '&nbsp;'
				+ '<button id="myButton8" type="button">'
				+ 'Wył.</button></br>'
				+ '</p></center>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//////////Podgląd Piwnicy

var pNode       = document.createElement ('div');
pNode.innerHTML = '<center>'
				+ '<input type="button" id="piwnicabtn" value="Odśwież" />'
				+ '<div style="float: right;"><input type="button" id="zamknijpbtn" value="X" /></div>'
				+ '</br>'
				+ '<iframe style="filter:invert" id="minipiwnica" src="http://amorion.pl/piwnica_msgs.php" scrolling="no"  width=420px height=440px ></iframe></center>'
                ;

pNode.setAttribute ('id', 'pContainer');
document.body.appendChild (pNode);

var defP = document.getElementById('pContainer');
    defP.style.display = 'none';

function reloadpiwnica() {
    document.getElementById('minipiwnica').src += '';
}
piwnicabtn.onclick = reloadpiwnica;



//////////

var UT2       = document.createElement('div');
UT2.innerHTML =      '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
	               + '<table id="UlepszaczTawerny" style="text-align: center; width="960px" height="50px" border="0" cellpadding="10" cellspacing="0" bgcolor="#000000";>'
  				   + '<tbody>'
    			   + '<tr>'
      			   + '<td valign="middle" style="width: 960px;">'
				   + '<button id="myButton" type="button" font color="black">'
                   + 'Zmień Okienko</button>&nbsp;'
				   + '<button id="myButton2" type="button" font color="black">'
				   + 'Wył. Odświeżanie</button>&nbsp;'
				   + '<button id="myButton3" type="button" font color="black">'
				   + 'Odśwież</button></center>'
				   + '<br><br>'
				   + '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'izba.php\')"><span style="color:#BBBBBB">Izba</span></a>'
				   + '&nbsp;'
				   + '<a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'piwnica.php\')"><span style="color:#BBBBBB">Piwnica</span></a>'
				   + '<div style="float: right;"><a style="color:#BBBBBB" href="#" onclick="Link(\'dynamic\', \'dramas.php\')"><span style="color:#BBBBBB">Sesje</span></a></div>'
				   + '</td>'
    			   + '</tr>'
  				   + '</tbody>'
				   + '</table>'
				   ;
UT2.setAttribute ('id', 'Ulepszacz');

var MiejscePodUT        = document.getElementById('logo');
	MiejscePodUT.parentNode.insertBefore(UT2, MiejscePodUT.nextSibling);

document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    var sOkno, nText;
    sOkno = document.getElementById('message');
    if (sOkno) {
	nText = document.createElement("textarea");
	nText.id = "message";
	nText.name = "msg";
	nText.cols = "62";
	nText.rows = "8";
	nText.maxlenght = "15000";
	sOkno.parentNode.replaceChild(nText, sOkno);
    }
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("myButton2").addEventListener (
    "click", ButtonClickAction2, false
);

function ButtonClickAction2 (zEvent2) {
    unsafeWindow.XMLHttpRequest = function() {}
	
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("myButton3").addEventListener (
    "click", ButtonClickAction3, false
);

function ButtonClickAction3 (zEvent3) {
	location.reload();
	
	
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("myButton5").addEventListener (
    "click", ButtonClickAction5, false
);

function ButtonClickAction5 (zEvent5) {
	var WlUT = document.getElementById('Ulepszacz');
    WlUT.style.display = 'inline';
	
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("myButton6").addEventListener (
    "click", ButtonClickAction6, false
);

function ButtonClickAction6 (zEvent6) {
	var WylUT = document.getElementById('Ulepszacz');
    WylUT.style.display = 'none';
	
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("myButton7").addEventListener (
    "click", ButtonClickAction7, false
);

function ButtonClickAction7 (zEvent7) {
	var WlP = document.getElementById('pContainer');
    WlP.style.display = 'inline';
    document.getElementById('minipiwnica').src += '';
	
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("myButton8").addEventListener (
    "click", ButtonClickAction8, false
);

function ButtonClickAction8 (zEvent8) {
	var WylP = document.getElementById('pContainer');
    WylP.style.display = 'none';
	
	document.getElementById ("myContainer").appendChild (zNode);
}

document.getElementById ("zamknijpbtn").addEventListener (
    "click", ButtonClickAction9, false
);

function ButtonClickAction9 (zEvent9) {
	var WylP = document.getElementById('pContainer');
    WylP.style.display = 'none';
	
	document.getElementById ("myContainer").appendChild (zNode);
}


GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    10px;
        right:                  2%;
        font-size:              20px;
        background:             black;
        border:                 3px outset white;
        opacity:                0.75;
        z-index:                222;
        padding:                10px 10px;
    }
    #pContainer {
        position:               fixed;
        bottom:                 10px;
        right:                  2%;
        font-size:              20px;
        background:             #ffffcc;
        border:                 3px outset white;
        opacity:                0.90;
        z-index:                222;
        padding:                10px 10px;
    }
    #myButton {
        cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
    }
	#myButton2 {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
	}
	#myButton3 {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
	}
	#myButton5 {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
	}
	#myButton6 {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
	}
    #myButton7 {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
	}
    #myButton8 {
		cursor:                 pointer;
        color:                  #BBBBBB;
		font-weight:            bold;
		background-color:       #000000;
		border:                 1px solid #B0B0B0;
	}
    #piwnicabtn {
    	cursor:                 pointer;
        color:                  black;
		font-weight:            bold;
		background-color:       White;
		border:                 1px solid #B0B0B0;
    
    }
    #zamknijpbtn {
    	cursor:                 pointer;
        color:                  black;
		font-weight:            bold;
		background-color:       White;
		border:                 1px solid #B0B0B0;
    
    }
    #myContainer p {
        color:             #B0B0B0;
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