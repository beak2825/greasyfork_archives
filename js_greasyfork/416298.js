// ==UserScript==
// @name         let the madness begin
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  try to take over the world!
// @author       sslr3o0
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416298/let%20the%20madness%20begin.user.js
// @updateURL https://update.greasyfork.org/scripts/416298/let%20the%20madness%20begin.meta.js
// ==/UserScript==

( function ()
{
    var ScrptKeys =
    {
        AttackNearby: 73,
        HealQueen: 85,
        SetQueenHealth: 48,
        MakeNuke: 76,
        HealNuke: 75,
        MoveArmyToPoint: 77,
        Aimbot: 78,
        MoveAllPoint: 79,
        MoveAllWide: 192,
        Autospawn: 54,
        NukeLevel_Plus: 187,
        NukeLevel_Minus: 189,
        SetRingsize_3: 222,
        SetRingsize_5: 186
    };
    var MousePos =
    {
        x: 0,
        y: 0
    };
    var LastCommandSent = new Date()
    .getTime();
    var Global_ContinueScript = false;
    var spawnoibs = false;
    var splitbigger = false;
    var Internet_Stress = 15;
    var NukeLevel = 4;
    var ringsize = 5;
    var ringangle = 0;
    var Autospawn = 0;
    var AimbotTarget = new Object();
    var My_QueenMaxHealth = 100;
    window.addEventListener ( "keydown", CaptureKeyPress );
    window.addEventListener ( "keyup", CaptureKeyPress );
    window.addEventListener ( "mousemove", captureMousePos );
    function CaptureKeyPress ( a )
    {
        if ( a.keyCode == ScrptKeys.AttackNearby )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                AttackNearby();
            }
            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.HealQueen )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                HealQueen();
            }
            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.HealNuke )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                HealNuke();
            }
            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.SetQueenHealth && a.type == "keydown" )
        {
            SetQueenHealth();
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_2 && a.type == "keydown" )
        {
            NukeLevel = 2;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_3 && a.type == "keydown" )
        {
            NukeLevel = 3;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_4 && a.type == "keydown" )
        {
            NukeLevel = 4;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_5 && a.type == "keydown" )
        {
            NukeLevel = 5;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_6 && a.type == "keydown" )
        {
            NukeLevel = 6;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_7 && a.type == "keydown" )
        {
            NukeLevel = 7;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_8 && a.type == "keydown" )
        {
            NukeLevel = 8;
        }

        if ( a.keyCode == ScrptKeys.SetNukelevel_9 && a.type == "keydown" )
        {
            NukeLevel = 9;
        }

        if ( a.keyCode == ScrptKeys.SetRingsize_3 && a.type == "keydown" )
        {
            ringsize = 3;
        }

        if ( a.keyCode == ScrptKeys.SetRingsize_5 && a.type == "keydown" )
        {
            ringsize = 5;
        }

        if ( a.keyCode == ScrptKeys.NukeLevel_Plus && a.type == "keydown" )
        {
            NukeLevel += 1;
        }

        if ( a.keyCode == ScrptKeys.NukeLevel_Minus && a.type == "keydown" )
        {
            NukeLevel -= 1;

            if ( NukeLevel <= 1 )
            {
                NukeLevel = 2;
            }
        }

        if ( a.keyCode == ScrptKeys.Autospawn && a.type == "keydown" )
        {
            Autospawn += 1;

            if ( Autospawn >= 2 )
            {
                Autospawn = 0;
            }
        }

        if ( a.keyCode == ScrptKeys.MakeNuke )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                MakeNuke();
            }

            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.MoveAllPoint )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                MoveAllPoint();
            }

            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.MoveAllWide )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                FocusCameraQueen();
                Global_ContinueScript = true;
                MoveAllWide();
            }

            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.Aimbot )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                AimbotTarget = undefined;
                Aimbot();
            }

            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }

        if ( a.keyCode == ScrptKeys.MoveArmyToPoint )
        {
            if ( a.type == "keydown" && Global_ContinueScript == false )
            {
                Global_ContinueScript = true;
                MoveArmyToPoint();
            }

            if ( a.type == "keyup" && Global_ContinueScript == true )
            {
                Global_ContinueScript = false;
            }
        }
    }
    function AttackNearby ()
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

        var NearOibs = new Array();
        NearOibs = [];
        var DistanceWary = 300;
        var tempdistance = 0;
        var Flag_AttackOib = false;

        for ( k = 0; k < Enemy_oibs.length; k++ )
        {
            tempdistance = GetDistance ( Enemy_oibs[ k ].x, Enemy_oibs[ k ].y, My_Queen.x, My_Queen.y );

            if ( tempdistance < DistanceWary )
            {
                NearOibs.push ( Enemy_oibs[ k ] );
                Flag_AttackOib = true;
            }
        }

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                player.select.units.push ( My_Oibs[ k ] );
            }

            lapa10233mauve.feed();
            player.select.clean();

            setTimeout ( function ()
            {
                player.select.clean();
                player.select.units.push ( My_Queen );
                FCallMove();
                player.select.clean();
            } , 160 );
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                AttackNearby();
            }, 1 );
        }
    }
    function HealQueen ()
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

        sortByKey ( My_Oibs, "level" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();
            player.select.clean();

            var HealthDifference = My_QueenMaxHealth - My_Queen.life;

            if ( HealthDifference > 0 )
            {

                for ( k = 0; k < My_Oibs.length; k++ )
                {
                    player.select.units.push ( My_Oibs[ k ] );
                    HealthDifference -= My_Oibs[ k ].life;
                }

                lapa10233mauve.feed();
                player.select.clean();

                if ( HealthDifference <= 0 )
                {
                    k = My_Oibs.length;
                }
            }

            else
            {
                for ( j = 0; j < My_Oibs.length; j++ )
                {
                    if ( My_Oibs[ j ].x != My_Queen.x && My_Oibs[ j ].y != My_Queen.y )
                    {
                        player.select.clean();
                        player.select.units.push ( My_Oibs[ j ] );
                        FCallMoveOib ( My_Queen );
                        player.select.clean();
                    }
                }

                for ( j = 0; j < My_Oibs.length; j++ )
                {
                    player.select.clean();
                    player.select.units.push ( My_Oibs[ j ] );
                }

                FCallMoveOib ( My_Queen );
                player.select.clean();
            }
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                HealQueen();
            }, 1 );
        }
    }
    function SetQueenHealth ()
    {
        var k = 0;
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
                        My_QueenMaxHealth = GameOibs[ k ].life;
                        k = GameOibs.length;
                    }
                }
            }
        }
    }
    function HealNuke ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
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

        sortByKey ( My_Oibs_Nukelevel, "life" );
        sortByKey ( My_Oibs_LowLevel, "uid" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            for ( k = 0; k < My_Oibs_Nukelevel.length; k++ )
            {
                if ( My_Oibs_Nukelevel[ k ] != undefined )
                {
                    for ( j = 0; j < My_Oibs_LowLevel.length; j++ )
                    {
                        player.select.units.push ( My_Oibs_LowLevel[ j ] );
                    }

                    player.select.units.push ( My_Oibs_Nukelevel[ k ] );
                    lapa10233mauve.regroup();
                    player.select.clean();
                }
            }
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                HealNuke();
            }, 1 );
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
                        My_Oibs.push ( GameOibs[ k ] );

                        if ( GameOibs[ k ].level < NukeLevel )
                        {
                            My_Oibs_LowLevel.push ( GameOibs[ k ] );
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

        var Mpos = TranslateMouse();

        if ( AimbotTarget == undefined )
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
                    player.select.units.push ( My_Oibs[ k ] );
                }

                lapa10233mauve.split();
                player.select.clean();

                if ( My_Oibs[ k ].level >= 1 )
                {
                    radius = 410;
                    diffX = My_Oibs[ k ].x - AimbotTarget.x;
                    diffY = My_Oibs[ k ].y - AimbotTarget.y;
                    angle = Math.atan2 ( diffY, diffX );
                    nPos.x = Math.round ( AimbotTarget.x - radius * Math.cos ( angle ) );
                    nPos.y = Math.round ( AimbotTarget.y - radius * Math.sin ( angle ) );
                    setTimeout ( function ()
                    {
                        player.select.clean();
                        player.select.lapa10165mauve();
                        FCallMoveOib ( nPos );
                        player.select.clean();
                    } , 160 );
                }
            }
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                Aimbot();
            }, 1 );
        }
    }
    function MakeNuke ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
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
                        My_Oibs.push ( GameOibs[ k ] );

                        if ( GameOibs[ k ].level < NukeLevel )
                        {
                            My_Oibs_LowLevel.push ( GameOibs[ k ] );
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

        sortByKey ( My_Oibs_LowLevel, "uid" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            for ( j = 0; j < My_Oibs.length; j++ )
            {
                if ( My_Oibs[ j ].level > NukeLevel )
                {
                    player.select.units.push ( My_Oibs[ j ] );
                }
            }

            lapa10233mauve.split();
            player.select.clean();

            for ( k = 0; k < My_Oibs_LowLevel.length; k++ )
            {
                player.select.units.push ( My_Oibs_LowLevel[ k ] );
            }

            lapa10233mauve.regroup();
            player.select.clean();
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                MakeNuke();
            }, 1 );
        }
    }
    function MoveAllPoint ()
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
            player.select.units = My_Oibs;
            FCallMove();
            player.select.clean();

            setTimeout ( function ()
            {
                player.select.clean();
                player.select.units.push ( My_Queen );
                FCallMove();
                player.select.clean();
            } , 160 );
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                MoveAllPoint();
            }, 1 );
        }
    }
    function MoveAllWide ( Mine, Enemy )
    {
        var l = 0;
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
                    if ( GameOibs[k].queen == true )
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

        sortByKey ( My_Oibs, "level" );
        sortByKey ( My_Oibs, "life" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                player.select.clean();
                player.select.units.push ( My_Oibs[ k ] );
                FCallMoveOibRing ( My_Queen, k );
                player.select.clean();
            }

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                player.select.clean();
                player.select.units.push ( My_Oibs[ k ] );
            }

            FCallMoveOibRing ( My_Queen, k );
            player.select.clean();
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                MoveAllWide();
            } , 1 );
        }
    }
    function MoveArmyToPoint ()
    {
        var distance = 0;
        var j = 0;
        var k = 0;
        var My_Oibs = new Array();
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

        sortByKey ( My_Oibs, "level" );

        if ( Internet_Stress < CmdSnt - LastCommandSent )
        {
            LastCommandSent = new Date()
            .getTime();

            var Big_Oib = new Object();

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

            for ( k = 0; k < My_Oibs.length; k++ )
            {
                player.select.units.push ( My_Oibs[ k ] );
                player.select.units.push ( Big_Oib );
            }

            lapa10233mauve.regroup();
            player.select.clean();

            setTimeout ( function ()
            {
                player.select.clean();
                player.select.units.push ( Big_Oib );
                FCallMove();
                player.select.clean();
            } , 160 );
        }

        if ( Global_ContinueScript == true )
        {
            setTimeout ( function ()
            {
                MoveArmyToPoint();
            }, 1 );
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
    function FocusCameraQueen ()
    {
        SendKey ( 66 );
        SendKey ( 82 );
    }
    function AutoSpawn ()
    {
        if ( Autospawn == 1 )
        {
            SendKey ( 49 );
        }
    }
    setInterval ( AutoSpawn );
    function SendKey ( k )
    {
        var ev = new KeyboardEvent ( 'keydown',
        {
        'keyCode': k,
        'which': k
        } );
        window.dispatchEvent ( ev );
        ev = new KeyboardEvent ( 'keyup',
        {
        'keyCode': k,
        'which': k
        } );
        window.dispatchEvent ( ev );
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
    function FCallRadiusMove ( Mine, Enemy )
    {
        var diffX = 0;
        var diffY = 0;
        var angle = 0;
        var My_Queen = new Object;
        var nPos =
        {
            x: 0,
            y: 0
        };
        var radius = 100;
        var degrees = 20
        diffX = Mine.x - Enemy.x;
        diffY = Mine.y - Enemy.y;
        angle = Math.atan2 ( diffY, diffX ) + 20;
        nPos.x = Math.round ( Enemy.x - radius * Math.cos ( angle ) );
        nPos.y = Math.round ( Enemy.y - radius * Math.sin ( angle ) );
        player.select.clean();
        player.select.units.push ( Mine );
        FCallMoveOib ( nPos );
        player.select.clean();
    }
    function FCallMoveOibRing ( r, k )
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
            r.x + a.x + ( Math.cos ( ( ( k / 50 ) * 6.43 ) + ringangle ) * ( 50 * ringsize ) ),
        y:
            r.y + a.y + ( Math.sin ( ( ( k / 50 ) * 6.43 ) + ringangle ) * ( 50 * ringsize ) )
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