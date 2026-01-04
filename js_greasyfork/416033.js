// ==UserScript==
// @name         Oib Hackz
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  try to take over the world!
// @author       gcn
// @match        http://*oib.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416033/Oib%20Hackz.user.js
// @updateURL https://update.greasyfork.org/scripts/416033/Oib%20Hackz.meta.js
// ==/UserScript==

( function ()
{
    var ScrptKeys =
    {
        mine: 69,
        autospawn: 54,
        moveall: 81,
        nuke: 76,
        nukemode: 77,
        heal: 85,
        split: 73,
        aimbot: 84,
        aimbotmode: 78,
        feed: 192,
        stackoibs: 74,
        alpha: 56,
        alpha2: 57,
        nukelvlup: 187,
        SpecialKey: 89,
        nukelvldown: 189,
        chatbot: 113,
        tooglebot: 90,
        botheal: 16,
        botspell: 9,
        botfeed: 77,
        botfriend: 188,
        botmove: 220,
    };
    var MousePos =
    {
        x: 0,
        y: 0
    };

    var GlobalContinue = false;
    var spawn = 0;
    var AimbotTarget = new Object();
    var Internet_Stress = 15;
    var NukeLevel = 0;
    var Nukelevel = 2;
    var alpha = 0;
    var playera = 0;
    var Aimbotmode = 0;
    var NukeMode = 0;
    var ToggleBot = 0;
    var chatbotactive = 0;
    var chatbottext = "";
    var chatbotname = ".Dot";
    var chatbotcolor = 0;
    var chatbotclass = 0;
    var chatbot = undefined;
    var AllOibs = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49 ];
    var OibsAndQueen = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49 ];
    var LastCommandSent = new Date()
    .getTime();
    window.addEventListener( "keydown" , CaptureKeyPress );
    window.addEventListener( "keyup" , CaptureKeyPress );
    window.addEventListener( "mousemove" , captureMousePos );

    function CaptureKeyPress ( a )
    {
        if ( game[_0x8969("0x9c")][_0x8969("0x9")][_0x8969("0x126")][_0x8969("0x9")][_0x8969("0x25")] == PIXGUI_INPUT_OUT )
        {
            if ( a.keyCode == ScrptKeys.botfeed && a.type == "keydown" )
            {
                botfeed += 1;

                if ( botfeed >= 2 )
                {
                    botfeed = 0;
                }
            }

            if ( a.keyCode == ScrptKeys.botfriend && a.type == "keydown" )
            {
                botfriend += 1;

                if ( botfriend >= 2 )
                {
                    botfriend = 0;
                }
            }

            if ( a.keyCode == ScrptKeys.botheal && a.type == "keydown" )
            {
                bot.postMessage("SendHealer");

                if ( player.crown == 3 )
                {
                    lapa10233mauve.skill_1();
                }
            }

            if ( a.keyCode == ScrptKeys.botspell && a.type == "keydown" )
            {
                bot.postMessage("SendWitch");

                if ( player.crown == 4 )
                {
                    lapa10233mauve.skill_1();
                }
            }

            if ( a.keyCode == ScrptKeys.chatbot && a.type == "keydown" )
            {
                chatbotactive += 1;

                if ( chatbotactive >= 2 )
                {
                    chatbotactive = 0;
                }

                if ( chatbotactive == 1 )
                {
                    chatbotconnect();
                }

                else
                {
                    chatbot.close();
                }
            }

            if ( a.keyCode == ScrptKeys.autospawn && a.type == "keydown" )
            {
                spawn += 1;

                if ( spawn >= 2 )
                {
                    spawn = 0;
                }
            }

            if ( a.keyCode == ScrptKeys.alpha && a.type == "keydown" )
            {
                alpha += 1;

                if ( alpha >= 2 )
                {
                    alpha = 0;
                }

                if ( alpha == 1 )
                {
                    for ( var i = 0; i < lapa10279mauve.length; i++ ) {
                        if ( lapa10279mauve[ i ] ) lapa10279mauve[ i ].vuln = true;
                    }
                }
                else
                {
                    for ( i = 0; i < lapa10279mauve.length; i++ ) {
                        if ( lapa10279mauve[ i ] ) lapa10279mauve[ i ].vuln = false;
                    }
                }
            }

            if ( a.keyCode == ScrptKeys.alpha2 && a.type == "keydown" )
            {
                playera += 1;

                if ( playera >= 2 )
                {
                    playera = 0;
                }

                if ( playera == 1 )
                {
                    lapa10279mauve[ player.id ].vuln = true;
                }
                else
                {
                    lapa10279mauve[ player.id ].vuln = false;
                }
            }

            if ( a.keyCode == ScrptKeys.nukelvlup && a.type == "keydown" )
            {
                Nukelevel += 1;
            }

            if ( a.keyCode == ScrptKeys.nukelvldown && a.type == "keydown" )
            {
                Nukelevel -= 1;

                if ( Nukelevel <= 2 )
                {
                    Nukelevel = 2;
                }
            }

            if ( a.keyCode == ScrptKeys.nukemode && a.type == "keydown" )
            {
                NukeMode += 1;

                if ( NukeMode >= 2 )
                {
                    NukeMode = 0;
                }
            }

            if ( a.keyCode == ScrptKeys.aimbotmode && a.type == "keydown" )
            {
                Aimbotmode += 1;

                if ( Aimbotmode >= 2 )
                {
                    Aimbotmode = 0;
                }
            }

            if ( a.keyCode == ScrptKeys.togglebot && a.type == "keydown" )
            {
                ToggleBot += 1;

                if ( ToggleBot >= 2 )
                {
                    ToggleBot = 0;
                }
            }

            if ( a.keyCode == ScrptKeys.nuke )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    Makearmy();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.heal )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    Healarmy();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.mine )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    Mine();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.feed )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    Feed();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.split && a.type == "keydown" )
            {
                Splitbigger();
            }

            if ( a.keyCode == ScrptKeys.aimbot )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    AimbotTarget = undefined;
                    Aimbot();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.SpecialKey )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    SpecialFunction();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.stackoibs )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    Stackoibs();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }

            if ( a.keyCode == ScrptKeys.moveall )
            {
                if ( a.type == "keydown" && GlobalContinue == false )
                {
                    GlobalContinue = true;
                    Moveallwide();
                }
                if ( a.type == "keyup" && GlobalContinue == true )
                {
                    GlobalContinue = false;
                }
            }
        }
    }

    function Mine ()
    {
        lapa10233mauve[ _0x8969( "0x79" ) ][ _0x8969( "0x84" ) ]( JSON.stringify( [ 2, OibsAndQueen ] ) );
        lapa10233mauve[ _0x8969( "0x79" ) ][ _0x8969( "0x84" ) ]( JSON.stringify( [ 3, MousePos.x - player.cam.rx, MousePos.y - player.cam.ry, [ 0 ] ] ) );
        setTimeout ( () =>
        {
            lapa10233mauve[ _0x8969( "0x79" ) ][ _0x8969( "0x84" ) ]( JSON.stringify( [ 3, MousePos.x - player.cam.rx, MousePos.y - player.cam.ry, [ 0 ] ] ) );
        } , 160 );

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Mine();
            } , 160 );
        }
    }
    function Moveallwide ()
    {
        lapa10233mauve[ _0x8969( "0x79" ) ][ _0x8969("0x84") ]( JSON.stringify( [ 3, MousePos.x - player.cam.rx, MousePos.y - player.cam.ry, AllOibs ] ) );
        lapa10233mauve[ _0x8969( "0x79" ) ][ _0x8969( "0x84" ) ]( JSON.stringify( [ 3, MousePos.x - player.cam.rx, MousePos.y - player.cam.ry, [ 0 ] ] ) );
        setTimeout ( () =>
        {
            lapa10233mauve[ _0x8969( "0x79" ) ][ _0x8969( "0x84" ) ]( JSON.stringify( [ 3, MousePos.x - player.cam.rx, MousePos.y - player.cam.ry, [ 0 ] ] ) );
        } , 50 );

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Moveallwide();
            } , 1 );
        }
    }
    function Healarmy ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var MinHealth = Infinity;
        var MinLevel = Infinity;
        var OibMinLife = -1;
        var OibMinLevel = -1;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs_Nukelevel = new Array();
        var My_Oibs_LowLevel = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        if ( GameOibs[ k ].level < NukeLevel )
                        {
                            My_Oibs_LowLevel.push ( GameOibs[ k ] );
                        }

                        else
                        {
                            My_Oibs_Nukelevel.push ( GameOibs[ k ] );
                        }
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        sortByKey( My_Oibs_LowLevel, "oid" );
        sortByKey( My_Oibs_Nukelevel, "life" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            player.select.clean();

            for ( var i = 0; i < My_Oibs_Nukelevel.length; i++ )
            {
                if ( MinHealth > My_Oibs_Nukelevel[ i ].life && My_Oibs_Nukelevel[ i ].level >= NukeLevel - 2 )
                {
                    MinHealth = My_Oibs_Nukelevel[ i ].life;
                    OibMinLife = i;
                }
            }

            player.select.clean();

            if ( My_Oibs_Nukelevel[ OibMinLife ] != undefined )
            {
                for ( var l = 0; l < My_Oibs_LowLevel.length; l++ )
                {
                    player.select.units.push ( My_Oibs_LowLevel[ l ] );
                }

                player.select.units.push ( My_Oibs_Nukelevel[ OibMinLife ] );
                lapa10233mauve.regroup();
                player.select.clean();
            }

        }

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Healarmy();
            }, 1 );
        }
    }
    function Feed ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            player.select.clean();

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                if ( My_Queen.life < botlvl * My_Queen.level )
                {
                    player.select.lapa10165mauve();
                    lapa10233mauve.split();
                    lapa10233mauve.feed();
                    setTimeout ( () =>
                    {
                        player.select.lapa10165mauve();
                        lapa10233mauve.feed();
                    } , 50 );
                }

                else
                {
                    /*
                    player.select.clean();
                    player.select.units.push ( My_Oibs[ k ] );
                    FCallMoveOib ( My_Queen );
                    */
                    player.select.lapa10165mauve();
                    lapa10233mauve.feed();
                }
            }
        }

        player.select.lapa10166mauve();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Feed();
            } , 1 );
        }
    }
    function Aimbot ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var players = lapa10279mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens.push ( GameOibs[ k ] );
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        var Mpos = TranslateMouse();

        if ( AimbotTarget == undefined )
        {
            if ( Aimbotmode == 0 )
            {
                for ( j = 0; j < Enemy_Queens.length; j++ )
                {
                    if ( MinDistance > GetDistance ( ( Enemy_Queens[ j ].x ), ( Enemy_Queens[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) ) )
                    {
                        MinDistance = GetDistance ( ( Enemy_Queens[ j ].x ), ( Enemy_Queens[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) );
                        AimbotTarget = Enemy_Queens[ j ];
                    }
                }
            }
            if ( Aimbotmode == 1 )
            {
                for ( j = 0; j < Enemy_oibs.length; j++ )
                {
                    if ( MinDistance > GetDistance ( ( Enemy_oibs[ j ].x ), ( Enemy_oibs[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) ) )
                    {
                        MinDistance = GetDistance ( ( Enemy_oibs[ j ].x ), ( Enemy_oibs[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) );
                        AimbotTarget = Enemy_oibs[ j ];
                    }
                }
            }
        }

        sortByKey ( My_Oibs, "life" );
        sortByKey ( My_Oibs, "level" );
        var diffX = 0;
        var diffY = 0;
        var angle = 0;
        var nPos =
        {
            x: 0,
            y: 0
        };
        var radius = 400;
        var levelSplit = 2;

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            if ( AimbotTarget != new Object() && AimbotTarget != undefined )
            {

                for ( k = 0; k < My_Oibs.length; k++ )
                {
                    if ( My_Oibs[ k ].level > 1 )
                    {
                        levelSplit = My_Oibs[ k ].level;
                        k = My_Oibs.length;
                    }
                }

                for ( k = 0; k < My_Oibs.length; k++ )
                {
                    if ( My_Oibs[ k ].level == levelSplit )
                    {
                        setTimeout ( () =>
                        {
                            player.select.lapa10165mauve();
                            lapa10233mauve.split();
                        }, 160 );
                    }

                    if ( My_Oibs[ k ].level <= NukeLevel )
                    {
                        radius = 10;
                        diffX = My_Oibs[ k ].x - AimbotTarget.x;
                        diffY = My_Oibs[ k ].y - AimbotTarget.y;
                        angle = Math.atan2 ( diffY, diffX );
                        nPos.x = Math.round ( AimbotTarget.x - radius * Math.cos ( angle ) );
                        nPos.y = Math.round ( AimbotTarget.y - radius * Math.sin ( angle ) );
                        player.select.lapa10165mauve();
                        FCallMoveOib ( nPos );
                    }

                    else
                    {
                        radius = 10;
                        diffX = My_Oibs[ k ].x - AimbotTarget.x;
                        diffY = My_Oibs[ k ].y - AimbotTarget.y;
                        angle = Math.atan2 ( diffY, diffX );
                        nPos.x = Math.round ( AimbotTarget.x - radius * Math.cos ( angle ) );
                        nPos.y = Math.round ( AimbotTarget.y - radius * Math.sin ( angle ) );
                        player.select.lapa10165mauve();
                        FCallMoveOib ( nPos );
                    }
                }
            }
        }

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Aimbot();
            }, 1 );
        }
    }
    function Stackoibs ()
    {
        var distance = 0;
        var j = 0;
        var k = 0;
        var My_Oibs = new Array();
        var Big_Oib = new Object();
        var EneMy_Oibs = new Array();
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; lapa10315mauve.lapa10277mauve.length > k; k++ )
        {
            if ( lapa10315mauve.lapa10277mauve[ k ] != undefined )
            {
                if ( lapa10315mauve.lapa10277mauve[ k ].id == player.id && lapa10315mauve.lapa10277mauve[ k ].queen == false )
                {
                    My_Oibs.push ( lapa10315mauve.lapa10277mauve[ k ] );
                }

                if ( lapa10315mauve.lapa10277mauve[ k ].id != player.id && lapa10315mauve.lapa10277mauve[ k ].queen == false )
                {
                    EneMy_Oibs.push ( lapa10315mauve.lapa10277mauve[ k ] );
                }
            }
        }

        for ( k = 0; k < My_Oibs.length; k++ )
        {
            if ( k == 0 )
            {
                Big_Oib = My_Oibs[ k ];
            }

            else
            {
                if ( My_Oibs[ k ].level > Big_Oib.level )
                {
                    Big_Oib = My_Oibs[ k ];
                }
            }
        }

        sortByKey ( My_Oibs, "oid" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                player.select.clean();
                player.select.units.push ( Big_Oib );
                FCallMove();
                player.select.clean();
                player.select.lapa10165mauve();
                lapa10233mauve.regroup();

                setTimeout ( () =>
                {
                    player.select.lapa10165mauve();
                    lapa10233mauve.regroup();
                    player.select.clean();
                } , 160 );

            }

            player.select.clean();

        }

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Stackoibs();
            }, 1 );
        }
    }
    function SpecialFunction ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                SpecialFunction();
            } , 1 );
        }
    }
    function Splitbigger ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            player.select.clean();

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                if ( My_Oibs[ k ].level > NukeLevel )
                {
                    player.select.units.push( My_Oibs[ k ] );
                }
            }

            lapa10233mauve.split();

        }

        player.select.clean();

    }

    function Makearmy ()
    {
        player.select.clean();
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Oibs_LowLevel = new Array();
        var My_Oibs_Nukelevel = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );

                        if ( GameOibs[ k ].level < NukeLevel )
                        {
                            My_Oibs_LowLevel.push ( GameOibs[ k ] );
                        }

                        if ( GameOibs[ k ].level == NukeLevel )
                        {
                            My_Oibs_Nukelevel.push ( GameOibs[ k ] );
                        }
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            if ( NukeMode == 0 )
            {
                for ( k = 0; k < My_Oibs_LowLevel.length; k++ )
                {
                    player.select.units.push ( My_Oibs_LowLevel[ k ] );
                }

                lapa10233mauve.regroup();
                MoveOibsToQueen();

            }

            else
            {
                var selected = 0;

                for ( k = 0; k < My_Oibs_LowLevel.length; k++ )
                {
                    selected++;
                    player.select.units.push ( My_Oibs_LowLevel[ k ] );

                    if ( selected > 1 )
                    {
                        selected = 0;
                        lapa10233mauve.regroup();
                        player.select.clean();
                    }
                }
            }

        }

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Makearmy();
            }, 1 );
        }
    }

    function MoveOibsToQueen ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Oibs_LowLevel = new Array();
        var My_Oibs_Nukelevel = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSnt = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );

                        if ( GameOibs[ k ].level < NukeLevel )
                        {
                            My_Oibs_LowLevel.push ( GameOibs[ k ] );
                        }

                        if ( GameOibs[ k ].level == NukeLevel )
                        {
                            My_Oibs_Nukelevel.push ( GameOibs[ k ] );
                        }
                    }
                }

                else
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        for ( k = 0; k < My_Oibs.length; k++ )
        {
            player.select.clean();
            player.select.units.push ( My_Oibs[ k ] );
            FCallMoveOib( My_Queen );
            player.select.clean();
        }
    }

    function chatbotconnect ()
    {
        var b = undefined;
        var die = 0;

        if ( Object.entries( ui ).length == 77 )
        {
            b = Object.entries( ui )[ 49 ][ 1 ].info.choice;
        }

        else
        {
            b = Object.entries( ui )[ 48 ][ 1 ].info.choice;
        }

        chatbot = new WebSocket( "ws://" + lapa10233mauve.lapa10387mauve[ b ].i + ":" + lapa10233mauve.lapa10387mauve[ b ].p );

        chatbot.onmessage =
        function ( b )
        {
            if ( 0 == 0 )
                if ( "string" == typeof b.data ) switch ( b = JSON.parse( b.data ), b[ 0 ] )
                {
                    case 0:
                        chatbottext = b[ 2 ];
                        if ( chatbottext.charAt( 0 ) == "." )
                        {
                            chatbottext = chatbottext.slice( 1 );

                            if ( chatbottext == "help" )
                            {
                                chatbot.send( JSON.stringify( [ 0, "Commands: help <page>, whomade, givemacro, level <lvl>, nou, lapa" ] ) );
                            }

                            if ( chatbottext == "help 2" )
                            {
                                chatbot.send( JSON.stringify( [ 0, "Commands: bun, ppmode <1 - 2>, color <0 - 5>, class <0 - 5>, die" ] ) );
                            }

                            if ( chatbottext == "whomade" )
                            {
                                chatbot.send( JSON.stringify( [ 0, ".Dot by u" ] ) );
                            }

                            if ( chatbottext == "nou" )
                            {
                                chatbot.send( JSON.stringify( [ 0,"no u" ] ) );
                            }

                            if ( chatbottext == "secret" )
                            {
                                chatbot.send( JSON.stringify( [ 0, "OOOH you found a secret command? :o" ] ) );
                            }

                            if ( chatbottext == "die" )
                            {
                                chatbot.close();
                                chatbot.open();
                                chatbot.send( JSON.stringify( [ 0, "dead :(" ] ) );
                            }

                            if ( chatbottext == "lapa" )
                            {
                                chatbot.close();
                                lapasend();
                            }

                            if ( chatbottext == "bun" )
                            {
                                chatbot.close();
                                moove1send();
                            }

                            if ( chatbottext == "ppmode 1" )
                            {
                                chatbot.close();
                                moove2send();
                            }

                            if ( chatbottext == "ppmode 2" )
                            {
                                chatbot.close();
                                moove3send();
                            }

                            if ( chatbottext.slice ( 0, 5 ) == "color" )
                            {
                                chatbotcolor = chatbottext.slice ( 6 );

                                chatbotcolor++;
                                chatbotcolor--;

                                if ( chatbotcolor - chatbotcolor > -1 < 6 )
                                {
                                    chatbot.close();
                                    chatbot.send( JSON.stringify( [ "" + chatbotname + "", "" + chatbotcolor + "", 0, "" + chatbotclass + "", 0, 0, 14 ] ) );
                                }

                                if ( chatbotcolor - chatbotcolor < 0 && chatbotcolor >= 6 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "Thats not a number -.-" ] ) );
                                }
                            }

                            if ( chatbottext.slice ( 0, 5 ) == "class" )
                            {
                                chatbotclass = chatbottext.slice ( 6 );

                                chatbotclass++;
                                chatbotclass--;

                                if ( chatbotclass - chatbotclass > -1 < 6 )
                                {
                                    chatbot.close();
                                    chatbot.send( JSON.stringify( [ "" + chatbotname + "", "" + chatbotcolor + "", 0, "" + chatbotclass + "", 0, 0, 14 ] ) );
                                }

                                if ( chatbotclass - chatbotclass < 0 && chatbotclass >= 6 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "Thats not a number -.-" ] ) );
                                }
                            }

                            if ( chatbottext == "givemacro" )
                            {
                                var say = Math.round( Math.random() * 5 );
                                if ( say == 0 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "no" ] ) );
                                }

                                if ( say == 1 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "NO" ] ) );
                                }

                                if ( say == 2 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "no noob" ] ) );
                                }

                                if ( say == 3 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "hmmmmm NO" ] ) );
                                }

                                if ( say == 4 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "nope xd" ] ) );
                                }

                                if ( say == 5 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "n0 :(" ] ) );
                                }
                            }

                            if ( chatbottext.slice( 0, 5 ) == "level" )
                            {
                                var levelspawned = chatbottext.slice( 6 );
                                var level = chatbottext.slice( 6 );

                                levelspawned = Math.round( ( level / 4 ) + 0.499999999999999 );
                                level++;
                                level--;

                                if ( level - level != 1 && level <= 0 )
                                {
                                    chatbot.send( JSON.stringify( [ 0, "Thats not a number -.-" ] ) );
                                }

                                else
                                {
                                    chatbot.send( JSON.stringify( [ 0, "If you were level " + level + ", Youd spawn level " + levelspawned + " oibs." ] ) );
                                }
                            }
                        }
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                }

                else
                {
                    var d = new Uint8Array( b.data );

                    switch ( d[ 0 ] )
                    {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                        case 5:
                            break;
                        case 6:
                            break;
                        case 7:
                            break;
                        case 8:
                            break;
                        case 20:
                            break;
                        case 21:
                            break;
                        case 22:
                            break;
                        case 23:
                            break;
                        case 24:
                            break;
                        case 25:
                            break;
                        case 26:
                            break;
                        case 27:
                            break;
                        case 28:
                    }
                }
        };

        chatbot.onopen = function ()
        {
            chatbot.send( JSON.stringify( [ "" + chatbotname + "", "" + chatbotcolor + "", 0, "" + chatbotclass + "", 0, 0, 14 ] ) );
            chatbot.send( JSON.stringify( [ 0, "" + chatbotname + " activated" ] ) );
        }

        chatbot.onclose = function ()
        {
            if ( chatbotactive == 1 )
            {
                chatbotconnect();
            }

            else
            {
                chatbot = undefined;
            }
        }
    }

    function lapasend ()
    {
        var b = undefined;

        if ( Object.entries( ui ).length == 77 )
        {
            b = Object.entries( ui )[ 49 ][ 1 ].info.choice;
        }

        else
        {
            b = Object.entries( ui )[ 48 ][ 1 ].info.choice;
        }

        var fakebot = new WebSocket( "ws://" + lapa10233mauve.lapa10387mauve[ b ].i + ":" + lapa10233mauve.lapa10387mauve[ b ].p );

        fakebot.onopen = function ()
        {
            fakebot.send( JSON.stringify( [ "LapaMauve", 3, 0, 0, 0, 0, 14 ] ) );
            fakebot.send( JSON.stringify( [ 0, "hi i do updates... sometimes..." ] ) );
            fakebot.close();
        };
    }

    function moove1send ()
    {
        var b = undefined;

        if ( Object.entries( ui ).length == 77 )
        {
            b = Object.entries( ui )[ 49 ][ 1 ].info.choice;
        }

        else
        {
            b = Object.entries( ui )[ 48 ][ 1 ].info.choice;
        }

        var fakebot = new WebSocket( "ws://" + lapa10233mauve.lapa10387mauve[ b ].i + ":" + lapa10233mauve.lapa10387mauve[ b ].p );

        fakebot.onopen = function ()
        {
            fakebot.send( JSON.stringify( [ "Moove", 3, 0, 0, 0, 0, 14 ] ) );
            fakebot.send( JSON.stringify( [ 0,"\u25b3 .Dot is kicked [4 minutes] \u25b3" ] ) );
            fakebot.close();
        };
    }

    function moove2send ()
    {
        var b = undefined;

        if ( Object.entries( ui ).length == 77 )
        {
            b = Object.entries( ui )[ 49 ][ 1 ].info.choice;
        }

        else
        {
            b = Object.entries( ui )[ 48 ][ 1 ].info.choice;
        }

        var fakebot = new WebSocket( "ws://" + lapa10233mauve.lapa10387mauve[ b ].i + ":" + lapa10233mauve.lapa10387mauve[ b ].p );

        fakebot.onopen = function ()
        {
            fakebot.send( JSON.stringify( [ "Moove", 3, 0, 0, 0, 0, 14 ] ) );
            fakebot.send( JSON.stringify( [ 0,"\u25b3 PP mode enabled \u25b3" ] ) );
            fakebot.close();
        };
    }

    function moove3send ()
    {
        var b = undefined;

        if ( Object.entries( ui ).length == 77 )
        {
            b = Object.entries( ui )[ 49 ][ 1 ].info.choice;
        }

        else
        {
            b = Object.entries( ui )[ 48 ][ 1 ].info.choice;
        }

        var fakebot = new WebSocket( "ws://" + lapa10233mauve.lapa10387mauve[ b ].i + ":" + lapa10233mauve.lapa10387mauve[ b ].p );

        fakebot.onopen = function ()
        {
            fakebot.send( JSON.stringify( [ "Moove", 3, 0, 0, 0, 0, 14 ] ) );
            fakebot.send( JSON.stringify( [ 0,"\u25b3 PP mode disabled \u25b3" ] ) );
            fakebot.close();
        };
    }

    var bot = new BroadcastChannel('sendtobot');
    var botsend = new BroadcastChannel('recievefrombot');
    var LastCommandSentBot = new Date()
    .getTime();
    var Internet_StressBot = 30;
    var BotBotlvl = 0;
    var botfeed = 0;
    var botfriend = 0;
    var botmove = 0;
    var BotBotsend = setInterval ( function ()
    {
        if ( ToggleBot != 0 )
        {
            if ( player.can_skill_1 == true )
            {
                botsend.postMessage("(bot heal - shift) (bot spell - tab)");
            }

            else
            {
                botsend.postMessage(50);
            }
        }

        if ( ToggleBot == 1 )
        {
            var k = 0;
            var Enemy_Queens = new Array();
            var Enemy_oibs = new Array();
            var My_Oibs = new Array();
            var My_Queen = new Object();
            var GameOibs = lapa10315mauve.lapa10277mauve;

            for ( k = 0; k < GameOibs.length; k++ )
            {
                if ( GameOibs[ k ] != undefined )
                {
                    if ( GameOibs[ k ].id == player.id )
                    {
                        if ( GameOibs[ k ].queen == true )
                        {
                            My_Queen = GameOibs[ k ];
                        }

                        else
                        {
                            My_Oibs.push( GameOibs[ k ] );
                        }
                    }

                    else

                    {
                        if ( GameOibs[ k ].queen == true )
                        {
                            Enemy_Queens = GameOibs[ k ];
                        }

                        else
                        {
                            Enemy_oibs.push( GameOibs[ k ] );
                        }
                    }
                }
            }

            bot.postMessage (
            {
                My_Queen1: My_Queen,
                MousePos1: MousePos,
                X1: player.cam.rx,
                Y1: player.cam.ry,
                Delay: Internet_StressBot,
                heallvl: botlvl,
                friend: botfriend,
                btfeed: botfeed,
            } );
        }
    } );

    var botbot = setInterval (
        function ()
        {
            if ( botfriend == 1 )
            {
                FriendThem();
            }

            if ( ToggleBot == 0 )
            {
                bot.onmessage = function ( ev )
                {
                    function FCallMoveOibBot ()
                    {
                        var X = ev.data.MousePos1.x
                        var Y = ev.data.MousePos1.y
                        var CamDifferenceX = player.cam.rx - ev.data.X1;
                        var CamDifferenceY = player.cam.ry - ev.data.Y1;
                        var PosBackUp =
                        {
                            x: ( X + CamDifferenceX ).toString(),
                            y: ( Y + CamDifferenceX ).toString()
                        };
                        lapa10233mauve[ _0x8969( "0xd7" ) ] (
                        {
                            x: parseInt( PosBackUp.x, 10 ),
                            y: parseInt( PosBackUp.y, 10 )
                        } );
                    }

                    if ( ev.data == "SendHealer" )
                    {
                        if ( player.crown == 3 )
                        {
                            lapa10233mauve.skill_1();
                        }
                    }

                    if ( ev.data == "SendWitch" )
                    {
                        if ( player.crown == 4 )
                        {
                            lapa10233mauve.skill_1();
                        }
                    }

                    if ( ev.data != "SendHealer" && ev.data != "SendWitch" )
                    {
                        if ( ev.data.My_Queen1.life < ev.data.My_Queen1.level * ( BotBotlvl / 3.5 ) )
                        {
                            lapa10233mauve.skill_1();
                        }

                        if ( Internet_StressBot !== ev.data.Delay )
                        {
                            Internet_StressBot = ev.data.Delay;
                        }

                        if ( BotBotlvl !== ev.data.heallvl )
                        {
                            BotBotlvl = ev.data.heallvl;
                        }

                        if ( botfriend !== ev.data.friend )
                        {
                            botfriend = ev.data.friend;
                        }

                        if ( botfeed !== ev.data.btfeed )
                        {
                            botfeed = ev.data.btfeed;
                        }

                        var k = 0;
                        var Enemy_Queens = new Array();
                        var Enemy_oibs = new Array();
                        var My_Oibs = new Array();
                        var My_Queen = new Object();
                        var GameOibs = lapa10315mauve.lapa10277mauve;
                        var CmdSntBot = new Date()
                        .getTime();

                        for ( k = 0; k < GameOibs.length; k++ )
                        {
                            if ( GameOibs[ k ] != undefined )
                            {
                                if ( GameOibs[ k ].id == player.id )
                                {
                                    if ( GameOibs[ k ].queen == true )
                                    {
                                        My_Queen = GameOibs[ k ];
                                    }

                                    else
                                    {
                                        My_Oibs.push ( GameOibs[ k ] );
                                    }
                                }

                                else

                                {
                                    if ( GameOibs[ k ].queen == true )
                                    {
                                        Enemy_Queens = GameOibs[ k ];
                                    }

                                    else
                                    {
                                        Enemy_oibs.push ( GameOibs[ k ] );
                                    }
                                }
                            }
                        }

                        if ( Internet_StressBot < CmdSntBot - LastCommandSentBot )
                        {
                            LastCommandSentBot = new Date()
                            .getTime();

                            if ( botfeed == 1 )
                            {
                                lapa10233mauve.lapa10165mauve();
                                lapa10233mauve.split();
                                lapa10233mauve.feed();
                                player.select.lapa10166mauve();

                                setTimeout ( () =>
                                {
                                    lapa10233mauve.lapa10165mauve();
                                    lapa10233mauve.feed();
                                    player.select.lapa10166mauve();
                                } , 50 );

                                player.select.lapa10166mauve();
                                player.focus_selected();
                                FCallMoveOib ( ev.data.My_Queen1 );
                            }

                            if ( botmove == 1 )
                            {
                                player.select.lapa10166mauve();
                                player.focus_selected();
                                FCallMoveOib ( ev.data.My_Queen1 );
                            }
                        }
                    }
                };

                botsend.onmessage = undefined;
            }

            else
            {
                if ( ToggleBot == 1 )
                {
                    bot.onmessage = undefined;
                    botsend.onmessage = function ( evv )
                    {
                        player.army.m = evv.data
                    };
                }
            }
        } );

    function FriendThem ()
    {
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var CmdSntBot = new Date()
        .getTime();

        for ( k = 0; k < GameOibs.length; k++ )
        {
            if ( GameOibs[ k ] != undefined )
            {
                if ( GameOibs[ k ].id == player.id )
                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        My_Queen = GameOibs[ k ];
                    }

                    else
                    {
                        My_Oibs.push ( GameOibs[ k ] );
                    }
                }

                else

                {
                    if ( GameOibs[ k ].queen == true )
                    {
                        Enemy_Queens = GameOibs[ k ];
                    }

                    else
                    {
                        Enemy_oibs.push ( GameOibs[ k ] );
                    }
                }
            }
        }

        for ( k = 0; k < Enemy_Queens.length; k++ )
        {
            if ( lapa10279mauve[ player.id ].nickname == lapa10279mauve[ Enemy_Queens[ k ].id ].nickname )
            {
                if ( lapa10279mauve[ Enemy_Queens[ k ].id ].friend == 0 )
                {
                    lapa10279mauve[ Enemy_Queens[ k ].id ].friend = 1;
                    lapa10233mauve.send_friendly ( Enemy_Queens[ k ].id );
                }
            }
        }
    }

    var ShowInfo = setInterval ( function ()
    {
        for ( let i = 0; i < lapa10315mauve.lapa10277mauve.length; i++ )
        {
            if ( lapa10315mauve.lapa10277mauve[ i ] != undefined )
            {
                lapa10315mauve.lapa10277mauve[ i ].info_delay = 1.5;
            }
        }
    } );

    var Autospawn = setInterval ( function ()
    {
        if ( spawn == 1 )
        {
            lapa10233mauve.lapa10167mauve();
        }
    } );

    var NukeOibs = setInterval ( function ()
    {
        var My_Queen = new Object();

        for ( let i = 0; lapa10315mauve.lapa10277mauve.length > i; i++ )
        {
            if ( lapa10315mauve.lapa10277mauve[ i ] != undefined )
            {
                if ( lapa10315mauve.lapa10277mauve[ i ].id == player.id && lapa10315mauve.lapa10277mauve[ i ].queen == true )
                {
                    My_Queen = lapa10315mauve.lapa10277mauve[ i ];
                }
            }
        }

        NukeLevel = Math.round( ( My_Queen.level / 4 ) + 0.499999999999999 + Nukelevel );
    } );

    var botlvl = setInterval ( function ()
    {
        if ( player.crown == 0 )
        {
            botlvl = 60;
        }
        if ( player.crown == 1 )
        {
            botlvl = 40;
        }
        if ( player.crown == 2 )
        {
            botlvl = 75;
        }
        if ( player.crown == 3 )
        {
            botlvl = 40;
        }
        if ( player.crown == 4 )
        {
            botlvl = 40;
        }
        if ( player.crown == 5 )
        {
            botlvl = 30;
        }
    } );

    function sortByKey ( array, key )
    {
        return array.sort ( function ( a, b )
        {
            var x = a[ key ];
            var y = b[ key ];
            return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
        } );
    }

    function TranslateMouse ()
    {
        var pos =
        {
        x:
            Math.abs ( player.cam.rx - MousePos.x ),
        y:
            Math.abs ( player.cam.ry - MousePos.y )
        };
        return pos;
    }

    function captureMousePos ( event )
    {
        MousePos.x = event.clientX;
        MousePos.y = event.clientY;
    }

    function GetDistance ( x, y, x2, y2 )
    {
        var d = Math.sqrt ( Math.pow ( x - x2, 2 ) + Math.pow ( y - y2, 2 ) );
        return d;
    }

    function FCallMove ()
    {
        var PosBackUp =
        {
        x:
            MousePos.x.toString(),
        y:
            MousePos.y.toString()
        };
        lapa10233mauve[ _0x8969 ( "0xd7" ) ] (
        {
        x: parseInt ( PosBackUp.x, 10 ),
        y: parseInt ( PosBackUp.y, 10 )
        } );
    }

    function FCallMovePos ( x1, y1 )
    {
        var a =
        {
        x:
            player.cam.rx,
        y:
            player.cam.ry
        };
        var b =
        {
        x:
            x1 + a.x,
        y:
            y1 + a.y
        };
        var PosBackUp =
        {
        x:
            b.x.toString(),
        y:
            b.y.toString()
        };
        lapa10233mauve[ _0x8969 ( "0xd7" ) ] (
        {
        x: parseInt( PosBackUp.x, 10 ),
        y: parseInt( PosBackUp.y, 10 )
        } );
    }

    function FCallMoveOib ( r )
    {
        var a =
        {
        x:
            player.cam.rx,
        y:
            player.cam.ry
        };
        var b =
        {
        x:
            r.x + a.x,
        y:
            r.y + a.y
        };
        var PosBackUp =
        {
        x:
            b.x.toString(),
        y:
            b.y.toString()
        };
        lapa10233mauve[ _0x8969 ( "0xd7" ) ] (
        {
        x: parseInt ( PosBackUp.x, 10 ),
        y: parseInt ( PosBackUp.y, 10 )
        } );
    }
} ) ();