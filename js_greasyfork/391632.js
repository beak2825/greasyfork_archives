// ==UserScript==
// @name         Oib.io Auto split press `
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391632/Oibio%20Auto%20split%20press%20%60.user.js
// @updateURL https://update.greasyfork.org/scripts/391632/Oibio%20Auto%20split%20press%20%60.meta.js
// ==/UserScript==
//player.army.v
//
( function ()
{
	'use strict';
	//Decode Lapa
	var decodeVar = [];
	var ArmyMaxLvl = 4;
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
			decodeVar[ 9 ].units[ k ].info_delay = 9999999;
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
		StackOibs: 220,
		MakeArmy: 222,
		FeedQueen: 221,
		SplitIobs: 192,
		ClearActions: 32,
		MoveAll: 79,
		HealIobs:186

    };
	var flag_ClearActions = false;
	var flag_FeedQueen = false;
	var flag_HealIobs = false;
	var flag_MakeArmy = false;
	var flag_MoveAll = false;
	var flag_SplitIobs = false;
	var flag_StackOibs = false;
	var spawner = setInterval( function ()
	{
		SendKey( spawn );
	}, 50 );
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
            SendKey( feed);
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
			SendKey( feed );
		}
		if ( flag_MoveAll == true )
		{
			SendKey( select_oibs );
			SendKey( split );
            SendKey( split );
            SendKey( split );
			SendKey( select_oibs );
			SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( select_oibs );
			SendRButton( xPos, yPos );

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
            SendKey( select_oibs );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( select_oibs );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( split );
            SendKey( select_oibs );
            SendRButton( xPos, yPos );
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