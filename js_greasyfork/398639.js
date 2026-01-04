// ==UserScript==
// @name         Oib.io Rhodium's Moo Macro
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Hello
// @author       You
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398639/Oibio%20Rhodium%27s%20Moo%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/398639/Oibio%20Rhodium%27s%20Moo%20Macro.meta.js
// ==/UserScript==
//player.army.v
//
( function ()
{
	'use strict';
	//Decode Lapa
	var decodeVar = [];
	var ArmyMaxLvl = 5;
	for ( var l = 0; 40000 > l; l++ )
	{
		var decode = "lapa" + l + "mauve";
		try
		{
			if ( typeof window[ decode ] != "undefined" )
			{
				decodeVar.push( window[ decode ] );
				console.log( decode );
			}
		}
		catch ( err )
		{
			console.log( err.message );
		}
	}

	function loop ()
	{
		player.select.split = true;
		player.select.feed = true;
		player.select.regroup = true;
		for ( var k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			decodeVar[ 9 ].units[ k ].info_delay = 9;
		}
	}
	setInterval( loop );
	// Control Keys
	var spawn = 49; //1
	var regroup = 50; //2
	var split = 51; //3
	var feed = 52; //4
	var spell = 53; //5
	var camera = 82; //r
	var select_oibs = 86; //v
	var select_queen = 66; //b
	var xPos = 0; //Mouse Position
	var yPos = 0; //Mouse Position
	//Script Keys
	//  space 32
	//  l     76
	//  k     75
	//  i     73
	//  o     79
	//  p     80
	//  u     85
	var ScrptKeys = {
        AutoSpawn: 60,
		StackOibs: 36,
		MakeArmy: 76,
		FeedQueen: 31,
		SplitIobs: 33,
		ClearActions: 32,
		MoveAll: 34,
		HealIobs: 85,
        PPbot: 77,
	};
    var flag_PPbot = false;
    var flag_AutoSpawn = false;
	var flag_ClearActions = false;
	var flag_FeedQueen = false;
	var flag_HealIobs = false;
	var flag_MakeArmy = false;
	var flag_MoveAll = false;
	var flag_SplitIobs = false;
	var flag_StackOibs = false;
	var IntervalKeyHandle = setInterval( function ()
	{
		if ( flag_MakeArmy == true )
		{
			var k = 0;
			var iobarray = [];
			setTimeout( () =>
			{
				player.select.clean();
			}, 1 );
			//aquire my units
			for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
			{
				if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
				{
					iobarray.push( decodeVar[ 9 ].units[ k ] );
				}
			}
			//separate low level ones
			for ( k = 0; k < iobarray.length; k++ )
			{
				if ( iobarray[ k ].level < ArmyMaxLvl )
				{
					player.select.units.push( iobarray[ k ] );
				}
			}
			decodeVar[ 1 ][ "regroup" ]();
		}
		if ( flag_StackOibs == true )
		{
			SendKey( select_queen );
			SendRButton( xPos, yPos );
			SendKey( camera );
		}
		if ( flag_FeedQueen == true )
		{
			SendKey( select_oibs );
			SendKey( feed );
		}
		if ( flag_MoveAll == true )
		{
			SendKey( select_oibs );
			SendRButton( xPos, yPos );
			SendKey( select_queen );
			SendRButton( xPos, yPos );
			SendKey( camera );
		}
		if ( flag_HealIobs == true )
		{
			var MinHealth = Infinity;
			var MinLevel = Infinity;
			//split bigger
			var MyIobs = [];
			var IobIndexMinLife = -1;
			var IobIndexMinLevel = -1;
			//Get My Iobs
			for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
			{
				if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
				{
					MyIobs.push( decodeVar[ 9 ].units[ k ] );
				}
			}
			// - determine min health
			for ( let index = 0; index < MyIobs.length; index++ )
			{
				if ( MinHealth > MyIobs[ index ].life && MyIobs[ index ].level >= 3 )
				{
					MinHealth = MyIobs[ index ].life;
					IobIndexMinLife = index;
				}
			}
			player.select.clean();
			for ( let index = 0; index < MyIobs.length; index++ )
			{
				if ( MyIobs[ index ].level <= 2 )
				{
					player.select.units.push( MyIobs[ index ] );
				}
			}
			player.select.units.push( MyIobs[ IobIndexMinLife ] );
			decodeVar[ 1 ][ "regroup" ]();
		}
	}, 1 );

	function CaptureKeyPress ( a )
	{
		if ( a.keyCode == ScrptKeys.StackOibs )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
			SendKey( select_oibs );
			SendKey( feed );
			SendKey( select_queen );
			SendKey( camera );
			SendRButton( xPos, yPos );
			flag_StackOibs = true;
			return
		}
		if ( a.keyCode == ScrptKeys.MakeArmy )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
			flag_StackOibs = false;
			if ( flag_MakeArmy == true )
			{
				flag_MakeArmy = false;
				return
			}
			if ( flag_MakeArmy == false )
			{
				player.select.clean();
				flag_MakeArmy = true;
				return
			}
		}
		if ( a.keyCode == ScrptKeys.HealIobs )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
			flag_StackOibs = false;
			if ( flag_HealIobs == true )
			{
				flag_HealIobs = false;
				return
			}
			if ( flag_HealIobs == false )
			{
				player.select.clean();
				flag_HealIobs = true;
				return
			}
		}
		if ( a.keyCode == ScrptKeys.FeedQueen )
		{
			flag_ClearActions = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
			flag_StackOibs = false;
			if ( flag_FeedQueen == true )
			{
				flag_FeedQueen = false;
				return
			}
			if ( flag_FeedQueen == false )
			{
				flag_FeedQueen = true;
				return
			}
		}
		if ( a.keyCode == ScrptKeys.SplitIobs )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
			flag_StackOibs = false;
			player.select.clean();
			SelectHighLevel();
			decodeVar[ 1 ][ "split" ]();
			SelectHighLevel();
			decodeVar[ 1 ][ "split" ]();
		}
		if ( a.keyCode == ScrptKeys.ClearActions )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
			flag_StackOibs = false;
			return
		}
		if ( a.keyCode == ScrptKeys.MoveAll )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_SplitIobs = false;
			flag_StackOibs = false;
			if ( flag_MoveAll == true )
			{
				flag_MoveAll = false;
				return
			}
			if ( flag_MoveAll == false )
			{
				flag_MoveAll = true;
				return
			}
		}
	}
	var captureMousePos = function ( event )
	{
		xPos = event.clientX;
		yPos = event.clientY;
	}
	/*
	var onMousedown = function ( e )
	{
		if ( e.which === 1 ) //LeftMouse
		{
			SendKey( select_queen );
			SendRButton( xPos, yPos );
			SendKey( camera );
		}
		else if ( e.which === 3 ) // RightMouse
		{
			SendKey( select_oibs );
			SendRButton( xPos, yPos );
			SendKey( camera );
		}
	}
	*/
	function SelectHighLevel ()
	{
		player.select.clean();
		//split bigger
		var iobarray = [];
		var splitiob = [];
		for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
			{
				iobarray.push( decodeVar[ 9 ].units[ k ] );
			}
		}
		for ( k = 0; k < iobarray.length; k++ )
		{
			if ( iobarray[ k ].level > ArmyMaxLvl )
			{
				splitiob.push( iobarray[ k ] );
			}
		}
		if ( splitiob.length == 0 )
		{
			return false
		}
		else
		{
			for ( k = 0; k < splitiob.length; k++ )
			{
				if ( splitiob[ k ].level > ArmyMaxLvl )
				{
					player.select.units.push( splitiob[ k ] );
				}
			}
			return true
		}
	}

	function SendKey ( k )
	{
		var ev = new KeyboardEvent( 'keydown',
			{
				'keyCode': k,
				'which': k
			} );
		window.dispatchEvent( ev );
		ev = new KeyboardEvent( 'keyup',
			{
				'keyCode': k,
				'which': k
			} );
		window.dispatchEvent( ev );
	}

	function SendRButton ( x, y )
	{
		var ev = new window.MouseEvent( "mouseup",
			{
				clientX: x,
				clientY: y,
				button: 2
			} );
		window.dispatchEvent( ev );
	}

	function SendLButton ( x, y )
	{
		var ev = new window.MouseEvent( "mouseup",
			{
				clientX: x,
				clientY: y,
				button: 1
			} );
		window.dispatchEvent( ev );
	}
	window.addEventListener( "keydown", CaptureKeyPress );
	window.addEventListener( "mousemove", captureMousePos );
	//window.addEventListener( "mousedown", onMousedown );
} )();
var ifrm = document.createElement("iframe");
ifrm.setAttribute("src", "about:blank");
ifrm.style.width = window.outerWidth-10;
ifrm.style.height = window.outerHeight/3*2;
ifrm.style.display = 'none';
document.body.appendChild(ifrm);
var win = ifrm.contentWindow;
window.de = win.dispatchEvent;
var spawn = setKey(49); //6
var regroup = setKey(50); //0
var split = setKey(51); //7
var feed = setKey(52); //8
var spell = setKey(53); //5
var select_oibs = setKey(86); //v
var select_queen = setKey(66);//b
var automine = false;
var autospawn= false;
var autospell = false;
var autofuse = false;
var oibminecnt = false;
var f = 220;
var backslash = 70;
var autofeed = false;
var autosplit = false;
var x = 1, y = 1;
var Keys = {interval:80,autospawn:54,mine:70,setkey:27,split:200}
var tima = setInterval(autoing, Keys.interval);
var rainbow = 100000
var rainbowtick = setInterval(rainbowxp, 100);
function rainbowxp(){
    rainbow += 1111;
    LOADER.COLOR_BAR = "#" + rainbow;
    DRAW.XP_COLOR = "#" + rainbow;
    DRAW.XP_REST_COLOR = "#080808";
    if (rainbow >= 161616){
        rainbow = 100000;
    }}
function autoing(){
    if(autospawn) action(spawn);
    if(automine){
        automine = false;
        action(select_oibs);
        action(feed);
        action(select_queen);
        mouseClick();
    }
    function split(){
        if(autosplit){
            autosplit = false;
            action(select_oibs);
            action(split);
            mouseClick();
        }
}
}
function KeyCheck(a){
    if(a.keyCode==Keys.autospawn){
        autospawn = !autospawn;
    }
    if(a.keyCode==Keys.mine){
        automine = true;
    }
    if(a.KeyCode==Keys.split){
        autosplit = true;
    }
    if(a.keyCode==Keys.setkey){
        if (!a.metaKey) {
            a.preventDefault();
        }
        setKeys();
    }
//   }
}
window.addEventListener("keydown",KeyCheck,true);
var captureMousePos = function(event){
              x = event.clientX;
    y = event.clientY;
}
window.addEventListener("mousemove", captureMousePos, true)
function setKeys(){
    try{
        var keys = prompt("Change Keys, values in keycodes",JSON.stringify(Keys).replace(/^\7{+|\}+$/g, ''));
        if(keys === null) return;
        JSON.parse('{'+keys+'}');
        if(k.interval){
            Keys.interval = k.interval;
            clearInterval(tima);
            tima = setInterval(ohno, Keys.interval);
        }
        if(k.autospawn)
            Keys.autospawn = k.autospawn;
        if(k.mine)
            Keys.mine = k.mine;
        if(k.split)
            Keys.split = k.split;
        if(k.setkey)
            Keys.setkey = k.setkey;
    }
    catch(err){confirm("Error" + err.message);}
}
function setKey(k){
    var ev = new win.Event("keydown");
    ev.keyCode = k;
    return ev;
}
function action(a){
    window.de(a);
}
function mouseClick(){
    var ev = new win.MouseEvent("mouseup",{clientX:x,clientY:y,button:2})
    action(ev);
}

alert('nControls :n6 - autospawn ,n\ - automine')