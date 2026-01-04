// ==UserScript==
// @name         Oib Hackz
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Hello
// @author       You
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401383/Oib%20Hackz.user.js
// @updateURL https://update.greasyfork.org/scripts/401383/Oib%20Hackz.meta.js
// ==/UserScript==
//player.army.v
//
(function(){
    window.onload = function() { // Set some stuff to make the game look nicer
        window.DRAW.EASE_DELAY = 0.25;
        window.DRAW.GROUND_COLOR_DARKER = "#000022";
        window.DRAW.BORDER_MINIMAP_COLOR = "#261A49";
        window.DRAW.GAUGE_QUEEN_DISPLAY = 0.9999999999999999;
        window.DRAW.GAUGE_WIDTH = 64;
    }
    //Decode Lapa
    var decodeVar = [];
	var ArmyMaxLvl = 5;
    var MinLvlHeal = 3;
    var PPstage = 0;
    var PPotherstage = 0;
    var PPlvl1 = 6;
    var PPlvl2 = 5;
    var MinPPlvl = 3;
    var MediumPPlvl = 5;
    var Oib2PPlvl = 4;
    var PPnewlvl = 5;
    var Wait = 160;
	for (var l = 0; 40000 > l; l++){
		var decode = "lapa" + l + "mauve";
        try {
            if (typeof window[decode] != "undefined"){
                decodeVar.push(window[decode]);
                console.log(decode);
            }
        }
		catch (err){
            console.log(err.message);
		}
	}

	function loop (){
        player.select.split = true;
        player.select.feed = true;
        player.select.regroup = true;
		for (var k = 0; decodeVar[9].units.length > k; k++){
			decodeVar[9].units[k].info_delay = 9;
		}
	}
	setInterval(loop);
	// Control Keys
	var spawn = 49; //1
	var regroup = 50; //2
	var split = 51; //3
	var feed = 52; //4
	var spell = 53; //5
	var camera = 82; //r
	var select_oibs = 86; //v
	var select_queen = 66; //b
    var clearactions = 46; //space
    var healiobs = 85;
	var xPos = 0; //Mouse Position
	var yPos = 0; //Mouse Position
    var mPos = {
        x: xPos,
        y: yPos,
    };
    var MyQueen = new Object();
	//Script Keys
	var ScrptKeys = {
		MakeArmy: 76,
		FeedQueen: 48,
		SplitIobs: 33,
		ClearActions: 32,
        CleanActions: 46,
		MoveAll: 34,
		HealIobs: 85,
        PPbot: 75,
        PPbot2: 73,
        RegroupIobs: 55,
        AutoHeal: 57,
        MaxArmyLvlPlus: 187,
        MaxArmyLvlMinus: 189,
        StackIobs: 69,
        HorizontalLine: 81,
        Spawndown: 49,
        MakeBase: 113,
	};
    var flag_PPbot1 = false;
	var flag_ClearActions = false;
	var flag_FeedQueen = false;
	var flag_HealIobs = false;
	var flag_MakeArmy = false;
	var flag_MoveAll = false;
	var flag_SplitIobs = false;
    var flag_RegroupIobs = true;
    var flag_PPbot2 = false;
    var flag_Autoheal = false;
    var MaxArmyLvlplus = false;
    var MaxArmyLvlMinus = false;
    var StackIobs = false;
    var HorizontalLine = false;
    var Make_Base = false;
	var IntervalKeyHandle = setInterval(function(){
        if (flag_Autoheal == true){
            SendKey(spell);
        }
		if (flag_MakeArmy == true){
			var k = 0;
			var iobarray = [];
			setTimeout( () =>
			{
                SendKey(select_queen);
			}, 1 );
			//aquire my units
			for (k = 0; decodeVar[9].units.length > k; k++){
                if (decodeVar[9].units[k].id == player.id && decodeVar[9].units[k].queen == false && decodeVar[9].units[k].life > 0){
                    iobarray.push(decodeVar[9].units[k]);
                }
            }
			//separate low level ones
			for (k = 0; k < iobarray.length; k++){
				if (iobarray[k].level < ArmyMaxLvl){
					player.select.units.push(iobarray[k]);
				}
			}
			decodeVar[1]["regroup"]();
		}
        if (flag_RegroupIobs == true)
        {
            SendKey(select_oibs);
            SendKey(regroup);
            SendKey(select_queen);
        }
		if (flag_FeedQueen == true)
		{
			SendKey(select_oibs);
			SendKey(feed);
            SendKey(select_queen);
		}
		if (flag_MoveAll == true)
		{
            SendKey(select_oibs);
            SendRButton(xPos, yPos);
			SendKey(select_queen);
			SendRButton(xPos, yPos);
		}
		if (flag_HealIobs == true)
		{
			var MinHealth = Infinity;
			var MinLevel = Infinity;
			//split bigger
			var MyIobs = [];
			var IobIndexMinLife = -1;
			var IobIndexMinLevel = -1;
			//Get My Iobs
			for (k = 0; decodeVar[9].units.length > k; k++){
				if (decodeVar[9].units[k].id == player.id && decodeVar[9].units[k].queen == false && decodeVar[9].units[k].life > 0){
					MyIobs.push(decodeVar[9].units[k]);
				}
			}
			// - determine min health
			for (let index = 0; index < MyIobs.length; index++){
				if (MinHealth > MyIobs[index].life && MyIobs[index].level >= MinLvlHeal){
					MinHealth = MyIobs[index].life;
					IobIndexMinLife = index;
				}
			}
			player.select.clean();
			for (let index = 0; index < MyIobs.length; index++){
				if (MyIobs[index].level < MinLvlHeal){
					player.select.units.push(MyIobs[index]);
				}
			}
			player.select.units.push(MyIobs[IobIndexMinLife]);
			decodeVar[1]["regroup"]();
		}
        if (HorizontalLine == true)
        {
            SendKey(spawn);
            SendKey(select_oibs);
            SendKey(xPos = 1, yPos);
        }
        if (flag_PPbot1 == true)
        {
            PPstage++;
            if (PPstage == 1){
                if (player.army.v > 2){
                    SelectHighLevelPP();
                    deocodeVar[1]["split"]();
                    flag_HealIobs = true;
                    SendRButton(798, 558);
                    flag_HealIobs = false;
                }
                if (player.army.v > 1){
                    PPstage++;
                }
            }
            if (PPstage == 2){
                if (player.army.v > 3){
                    SelectMinLevelPP();
                    decodeVar[1]["regroup"]();
                }
                if (player.army.v > 2){
                    PPstage++;
                }
            }
            if (PPstage == 3){
                if (player.army.v > 4){
                SelectNewLevelPP();
                }
                if (player.army.v > 3){
                    SendKey(select_oibs);
                    decodeVar[1]["regroup"]();
                    PPstage++;
                }
                if (PPstage == 4){
                    if (player.army.v > 3){
                        flag_HealIobs = true;
                        flag_HealIobs = false;
                        }
                    if (player.army.v > 2){
                        flag_HealIobs = true;
                        flag_HealIobs = false;
                    }
                    PPstage = 1;
                }
            }
        }
            /*
            if (player.army.v > 2)
            {
                SelectMinLevelPP();
                decodeVar[1]["regroup"]();
                SelectOibLevelPP();
                SendRButton(258, 322);
            }
            if (player.army.v > 4)
            {
                SelectNewLevelPP(1);
            }
            */
            //Vars
/*
            var PPstage1 = false;
            var Movequeen = true;
            var Moveoib = false;
            var Moveoib2 = false;
            //Move uints
            if (Movequeen == true)
            {
                SendKey(select_queen);
                SendRButton(1, 4999);
                Movequeen = false;
                Moveoib = true;
                            }
            if (Moveoib == true)
            {
                SelectHighLevelPP();
                SendRButton(208, 558);
                Moveoib = false;
                PPstage1 = true;
                           }
            //PP sstages
            if (PPstage1 == true)
            {
                player.army.m = "PP stage 1";
                SelectHighLevelPP(1);
                decodeVar[1]["split"]();
                flag_HealIobs = true;
                SendRButton (798, 558);
                decodeVar[1]["split"](3);
                flag_HealIobs = false;
                PPstage1 = false;
            }
        }*/
        if (flag_PPbot2 == true)
        {
            PPotherstage++;
            if (PPotherstage == 1){
                if (player.army.v > 3){
                    SelectMinLevelPP();
                    decodeVar[1]["regroup"]();
                }
                if (player.army.v > 2){
                    PPotherstage++;
                }
                if (PPotherstage == 2){
                    SelectOibLevelPP();
                    if (player.army.v > 1){
                        PPotherstage++;
                    }
                }
                if (PPotherstage == 3){
                    if (player.army.v > 3){
                        SelectMinLevelPP();
                        decodeVar[1]["regroup"]();
                    }
                    if (player.army.v > 2){
                        SelectHighLevelPP();
                    }
                    if (player.army.v > 1){
                        PPotherstage++;
                    }
                }
                if (PPotherstage == 4){
                    if (player.army.v > 3){
                        SendKey(select_oibs);
                        SendKey(regroup);
                    }
                    if (player.army.v > 2){
                        SendKey(select_oibs);
                        SendKey(regroup);
                    }
                    if (player.army.v > 1){
                        PPotherstage++;
                    }
                }
            }
            /*
            if (player.army.v > 2)
            {
                SelectMinLevelPP();
                decodeVar[1]["regroup"]();
                SelectOibLevelPP(1);
                SendRButton(554, 311);
            }
            var PPothstage1 = true;
            var Moveothqueen = true;
            var Moveothoib = false;
            var Moveothoib2 = false;
            if (Moveothqueen == true)
            {
                SendKey(select_queen);
                SendRButton(808, 4999);
                Moveothqueen = false;
                Moveothoib = true;
                            }
            if (Moveothoib == true)
            {
                SendKey(select_oibs);
                SendRButton(798, 558);
                Moveothoib = false;
                PPothstage1 = true;
                           }
            if (PPothstage1 == true)
            {
                player.army.m = "PP other stage 1";
                if (player.army.v >= 3)
                {
                    SelectMinLevelPP();
                    decodeVar[1]["regroup"]();
                    SendRButton(554, 311);
                }
                SelectHighLevelPP(9);
                decodeVar[1]["split"](1);
                flag_HealIobs = true;
                SendRButton(208, 558);
                decodeVar[1]["split"](7);
                flag_HealIobs = false;
                PPothstage1 = false;
        }*/
        }
        if (Make_Base == true)
        {
            SelectHighLevel();
            SendRButton(250, 499);
        }
	}, 1 );

	function CaptureKeyPress ( a )
    {
        if(a.keyCode == ScrptKeys.MakeBase)
        {
            flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
            if (Make_Base == true)
            {
                player.army.m = "1";
                Make_Base = false;
                return
            }
            if (Make_Base == false)
            {
                player.army.m = "Make base";
                Make_Base = true;
                return
            }
        }
        if (a.keyCode == ScrptKeys.MaxArmyLvlPlus)
        {
            ArmyMaxLvl++;
            MinLvlHeal++;
            player.army.m = "Army lvl " + ArmyMaxLvl + " ( Min lvl heal " + MinLvlHeal + " )";
            if (flag_MakeArmy == true)
            {
                player.army.m = "Make army ( level " + ArmyMaxLvl + " )";
            }
            if (flag_HealIobs == true)
            {
                player.army.m = "Heal oibs ( Min lvl " + MinLvlHeal + " )";
            }
        }
        if (a.keyCode == ScrptKeys.MaxArmyLvlMinus)
        {
            ArmyMaxLvl--;
            MinLvlHeal--;
            player.army.m = "Army lvl " + ArmyMaxLvl + " ( Min lvl heal " + MinLvlHeal + " )";
            if (ArmyMaxLvl <= 4) {
                ArmyMaxLvl = 4;
                }
            if (MinLvlHeal <= 2)
            {
                MinLvlHeal = 2;
            }
            if (flag_MakeArmy == true)
            {
                player.army.m = "Make army ( level " + ArmyMaxLvl + " )";
            }
            if (flag_HealIobs == true)
            {
                player.army.m = "Heal oibs ( Min lvl " + MinLvlHeal + " )";
            }
        }
        if (a.keyCode == ScrptKeys.HorizontalLine)
        {
            flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            if (HorizontalLine == true)
            {
                HorizontalLine = false;
                player.army.m = "1";
                return
            }
            if (HorizontalLine == false)
            {
                HorizontalLine = true;
                player.army.m = "Horizontal line";
                return
            }
        }
        if (a.keyCode == ScrptKeys.AutoHeal)
        {
            if ( flag_Autoheal == true )
			{
				flag_Autoheal = false;
                player.army.m = "Auto heal or auto spell oibs off";
				return
			}
			if ( flag_Autoheal == false )
			{
				flag_Autoheal = true;
                player.army.m = "Auto heal oibs (angel)/ auto spell oibs (witch) on";
				return
			}
        }
        if ( a.keyCode == ScrptKeys.RegroupIobs )
        {
            flag_ClearActions = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_PPbot1 = false;
            flag_FeedQueen = false;
            StackIobs = false;
            HorizontalLine = false;
			if ( flag_RegroupIobs == true )
			{
				flag_RegroupIobs = false;
                player.army.m = "1";
				return
			}
			if ( flag_RegroupIobs == false )
			{
				flag_RegroupIobs = true;
                player.army.m = "Regroup oibs";
				return
			}
        }
        if ( a.keyCode == ScrptKeys.PPbot2 )
        {
            flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_RegroupIobs = false;
            flag_PPbot1 = false;
            StackIobs = false;
            HorizontalLine = false;
            if ( flag_PPbot2 == true )
			{
				flag_PPbot2 = false;
                player.army.m = "1";
				return
			}
			if ( flag_PPbot2 == false )
			{
				player.select.clean();
				flag_PPbot2 = true;
                player.army.m = "PP bot 2 turned on"
				return
			}
        }
        if ( a.keyCode == ScrptKeys.PPbot )
        {
            flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
            if ( flag_PPbot1 == true )
			{
				flag_PPbot1 = false;
                player.army.m = "1";
				return
			}
			if ( flag_PPbot1 == false )
			{
				player.select.clean();
				flag_PPbot1 = true;
                player.army.m = "PP bot turned on"
				return
			}
        }
		if ( a.keyCode == ScrptKeys.MakeArmy )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
			if ( flag_MakeArmy == true )
			{
				flag_MakeArmy = false;
                player.army.m = "1";
				return
			}
			if ( flag_MakeArmy == false )
			{
				player.select.clean();
				flag_MakeArmy = true;
                player.army.m = "Make army ( level " + ArmyMaxLvl + " )";
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
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
			if ( flag_HealIobs == true )
			{
				flag_HealIobs = false;
                player.army.m = "1";
				return
			}
			if ( flag_HealIobs == false )
			{
				player.select.clean();
				flag_HealIobs = true;
                player.army.m = "Heal oibs ( Min lvl " + MinLvlHeal + " )"
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
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
			if ( flag_FeedQueen == true )
			{
				flag_FeedQueen = false;
                player.army.m = "1";
				return
			}
			if ( flag_FeedQueen == false )
			{
				flag_FeedQueen = true;
                player.army.m = "Feed queen";
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
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
            player.army.m = "Split bigger"
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
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
            player.army.m = "1";
			return
		}
        if ( a.keyCode == ScrptKeys.CleanActions )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_MoveAll = false;
			flag_SplitIobs = false;
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
            player.army.m = "1";
			return
		}
		if ( a.keyCode == ScrptKeys.MoveAll )
		{
			flag_ClearActions = false;
			flag_FeedQueen = false;
			flag_HealIobs = false;
			flag_MakeArmy = false;
			flag_SplitIobs = false;
            flag_PPbot1 = false;
            flag_RegroupIobs = false;
            flag_PPbot2 = false;
            StackIobs = false;
            HorizontalLine = false;
			if ( flag_MoveAll == true )
			{
				flag_MoveAll = false;
                player.army.m = "1";
				return
			}
			if ( flag_MoveAll == false )
			{
				flag_MoveAll = true;
                player.army.m = "Move all";
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
//stop action
    function stopDefAction(evt){
    evt.preventdefault();
    }
    //PP functions
    //select high level pp
    function SelectHighLevelPP ()
	{
		player.select.clean();
        var k = 0;
		var iobarray = [];
		var selectiob = [];
		for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
			{
				iobarray.push( decodeVar[ 9 ].units[ k ] );
			}
		}
		for ( k = 0; k < iobarray.length; k++ )
		{
			if ( iobarray[ k ].level >= PPlvl1 )
			{
				selectiob.push( iobarray[ k ] );
			}
		}
		if ( selectiob.length == 0 )
		{
			return false
		}
		else
		{
			for ( k = 0; k < selectiob.length; k++ )
			{
				if ( selectiob[ k ].level >=PPlvl1 )
				{
					player.select.units.push( selectiob[ k ] );
				}
			}
			return true
		}
	}
    //select medium lvl pp

        function SelectMediumLevelPP ()
	{
player.select.clean();
        var k = 0;
		var iobarray = [];
		var selectiob = [];
		for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
			{
				iobarray.push( decodeVar[ 9 ].units[ k ] );
			}
		}
		for ( k = 0; k < iobarray.length; k++ )
		{
			if ( iobarray[ k ].level == MediumPPlvl )
			{
				selectiob.push( iobarray[ k ] );
			}
		}
		if ( selectiob.length == 0 )
		{
			return false
		}
		else
		{
			for ( k = 0; k < selectiob.length; k++ )
			{
				if ( selectiob[ k ].level == MediumPPlvl )
				{
					player.select.units.push( selectiob[ k ] );
				}
			}
		}
    }
    //select min lvl pp
            function SelectMinLevelPP ()
	{
		player.select.clean();
        var k = 0;
		var iobarray = [];
		var selectiob = [];
		for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
			{
				iobarray.push( decodeVar[ 9 ].units[ k ] );
			}
		}
		for ( k = 0; k < iobarray.length; k++ )
		{
			if ( iobarray[ k ].level <= MinPPlvl )
			{
				selectiob.push( iobarray[ k ] );
			}
		}
		if ( selectiob.length == 0 )
		{
			return false
		}
		else
		{
			for ( k = 0; k < selectiob.length; k++ )
			{
				if ( selectiob[ k ].level <= MinPPlvl )
				{
					player.select.units.push( selectiob[ k ] );
				}
			}
			return true
		}
	}
    //select new lvl pp
                function SelectOibLevelPP ()
	{
		player.select.clean();
        var k = 0;
		var iobarray = [];
		var selectiob = [];
		for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
			{
				iobarray.push( decodeVar[ 9 ].units[ k ] );
			}
		}
		for ( k = 0; k < iobarray.length; k++ )
		{
			if ( iobarray[ k ].level == Oib2PPlvl )
			{
				selectiob.push( iobarray[ k ] );
			}
		}
		if ( selectiob.length == 0 )
		{
			return false
		}
		else
		{
			for ( k = 0; k < selectiob.length; k++ )
			{
				if ( selectiob[ k ].level == Oib2PPlvl )
				{
					player.select.units.push( selectiob[ k ] );
				}
			}
			return true
		}
	}
    //select new level
                    function SelectNewLevelPP ()
	{
		player.select.clean();
        var k = 0;
		var iobarray = [];
		var selectiob = [];
		for ( k = 0; decodeVar[ 9 ].units.length > k; k++ )
		{
			if ( decodeVar[ 9 ].units[ k ].id == player.id && decodeVar[ 9 ].units[ k ].queen == false && decodeVar[ 9 ].units[ k ].life > 0 )
			{
				iobarray.push( decodeVar[ 9 ].units[ k ] );
			}
		}
		for ( k = 0; k < iobarray.length; k++ )
		{
			if ( iobarray[ k ].level == PPnewlvl )
			{
				selectiob.push( iobarray[ k ] );
			}
		}
		if ( selectiob.length == 0 )
		{
			return false
		}
		else
		{
			for ( k = 0; k < selectiob.length; k++ )
			{
				if ( selectiob[ k ].level == PPnewlvl )
				{
					player.select.units.push( selectiob[ k ] );
				}
			}
			return true
		}
	}
    //end
	function SelectHighLevel ()
	{
		player.select.clean();
		//split bigger
        var k = 0;
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
//move oibs to queen
    function MoveOibToQueen(r){
        xPos = MyQueen;
        yPos = MyQueen;
        SendRButton(xPos, yPos);
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
    var linesize = 10;
    function MoveOibLine(r, k)
    {
        var a = {
            x: player.cam.rx,
            y: player.cam.ry
        };
        var b = {
            x: r.x - (player.army.v * (linesize / 2)) + (k * linesize),
            y: r.y
        };
         var PosBackUp = {
            x: b.x.toString(),
            y: b.y.toString()
        };
        SendRButton({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }
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
var spawn = setKey(49); //1
var regroup = setKey(50); //2
var split = setKey(51); //3
var feed = setKey(52); //4
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