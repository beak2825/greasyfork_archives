// ==UserScript==
// @name         Oib: aimbot
// @name:ru      Oib: aimbot
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Just a script :)
// @description:ru  Just a script :)
// @author       0days
// @match        http://*oib.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404686/Oib%3A%20aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/404686/Oib%3A%20aimbot.meta.js
// ==/UserScript==
( function ()
 {
    var ScrptKeys =
    {
        aim: 69,
        aimmode: 113,
        runaway: 88,
        runawayradiusplus: 187,
        runawayradiusminus: 189
    };
    var MousePos =
    {
        x: 0,
        y: 0
    };
    var LastCommandSent = new Date()
    .getTime();
    var Internet_Stress = 15;
    var AimMode = 0;
    var RunAway = 0;
    var Radius = 425;
    var GlobalContinue = false;
    var AimTarget = new Object();
    var lapas = [];
    function CaptureKeyPress ( a )
    {
        if ( a.keyCode == ScrptKeys.aim )
        {
            if ( a.type == "keydown" && GlobalContinue == false )
            {
                GlobalContinue = true;
                AimTarget = undefined;
                Aim();
            }
            if ( a.type == "keyup" && GlobalContinue == true )
            {
                GlobalContinue = false;
            }
        }
        if ( a.keyCode == ScrptKeys.aimmode && a.type == "keydown" )
        {
            AimMode += 1;
            if ( AimMode >= 2 )
            {
                AimMode = 0;
            }
            if ( AimMode == 0 )
            {
                player.army.v = "Aimbot mode: Attack queens";
            }
            if ( AimMode == 1 )
            {
                player.army.v = "Aimbot mode: Attack oibs";
            }
        }
        if ( a.keyCode == ScrptKeys.runaway && a.type == "keydown" )
        {
            RunAway += 1;
            if ( RunAway >= 2 )
            {
                RunAway = 0;
            }
        }
        if ( a.keyCode == ScrptKeys.runawayradiusplus && a.type == "keydown" )
        {
            Radius++;
            player.army.v = "avoid raidus " + Radius + "";
        }
        if ( a.keyCode == ScrptKeys.runawayradiusminus && a.type == "keydown" )
        {
            Radius--;
            player.army.v = "avoid raidus " + Radius + "";
        }
    }
    window.addEventListener( "keydown" , CaptureKeyPress );
    window.addEventListener( "keyup" , CaptureKeyPress );
    function Aim ()
    {
        lapa10233mauve.lapa10182mauve.send( new Uint8Array( [ 0 ] ) );
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

        if ( AimMode == 0 )
        {
            var Mpos = Enemy_Queens[ j ];
        }
        if ( AimMode == 1 )
        {
            Mpos = Enemy_oibs[ j ]
        }

        if ( AimTarget == undefined )
        {
            if ( AimMode == 0 )
            {
                for ( j = 0; j < Enemy_Queens.length; j++ )
                {
                    if ( MinDistance > GetDistance ( ( Enemy_Queens[ j ].x ), ( Enemy_Queens[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) ) )
                    {
                        MinDistance = GetDistance ( ( Enemy_Queens[ j ].x ), ( Enemy_Queens[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) );
                        AimTarget = Enemy_Queens[ j ];
                    }
                }
            }

            if ( AimMode == 1 )
            {
                for ( j = 0; j < Enemy_oibs.length; j++ )
                {
                    if ( MinDistance > GetDistance ( ( Enemy_oibs[ j ].x ), ( Enemy_oibs[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) ) )
                    {
                        MinDistance = GetDistance ( ( Enemy_oibs[ j ].x ), ( Enemy_oibs[ j ].y ), Math.abs ( Mpos.x ), Math.abs ( Mpos.y ) );
                        AimTarget = Enemy_oibs[ j ];
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
                    lapa10233mauve.split();
                }

                if ( My_Oibs[ k ].level <= 2 )
                {
                    radius = 410;
                    diffX = My_Oibs[ k ].x - AimTarget.x;
                    diffY = My_Oibs[ k ].y - AimTarget.y;
                    angle = Math.atan2 ( diffY, diffX );
                    nPos.x = Math.round ( AimTarget.x - radius * Math.cos ( angle ) );
                    nPos.y = Math.round ( AimTarget.y - radius * Math.sin ( angle ) );
                    player.select.lapa10165mauve();
                    FCallMoveOib ( nPos );
                }

                else
                {
                    radius = 410;
                    diffX = My_Oibs[ k ].x - AimTarget.x;
                    diffY = My_Oibs[ k ].y - AimTarget.y;
                    angle = Math.atan2 ( diffY, diffX );
                    nPos.x = Math.round ( AimTarget.x - radius * Math.cos ( angle ) );
                    nPos.y = Math.round ( AimTarget.y - radius * Math.sin ( angle ) );
                    player.select.lapa10165mauve();
                    FCallMoveOib ( nPos );
                }
            }
        }

        player.select.clean();

        if ( GlobalContinue == true )
        {
            setTimeout ( () =>
            {
                Aim();
            }, 1 );
        }
    }
    function Run_away ()
    {
        var j = 0;
        var k = 0;
        var MinDistance = 100;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = lapa10315mauve.lapa10277mauve;
        var Oibs = new Array();

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
                }
                if ( GameOibs[ k ].id != player.id )
                {
                    if ( lapa10279mauve[ player.id ].nickname != lapa10279mauve[ GameOibs[ k ].id ].nickname )
                    {
                        if ( lapas[ 9 ].mode == 1 )
                        {
                            if ( lapa10279mauve[ player.id ].color == lapa10279mauve[ GameOibs[ k ].id ].color ) {}

                            else
                            {
                                Oibs.push( GameOibs[ k ] );
                            }
                        }

                        else
                        {
                            Oibs.push( GameOibs[ k ] );
                        }
                    }
                }
            }
        }

        var Mpos = My_Queen;
        var dist = 0;

        for ( j = 0; j < Oibs.length; j++ )
        {
            if ( j == 0 )
            {
                AimTarget = Oibs[ j ];
            }

            else
            {
                if ( GetDistance( ( Oibs[ j ].x), ( Oibs[ j ].y ), Math.abs( Mpos.x ), Math.abs( Mpos.y ) ) < GetDistance( ( AimTarget.x ), ( AimTarget.y ), Math.abs( Mpos.x ), Math.abs( Mpos.y ) ) )
                {
                    AimTarget = Oibs[ j ];
                }
            }
        }

        var diffX = 0;
        var diffY = 0;
        var angle = 0;
        var radius = 0;
        var nPos =
        {
            x: 0,
            y: 0
        };

        radius = Radius;

        MinDistance = Math.abs( radius );

        if ( MinDistance > GetDistance( ( AimTarget.x ), ( AimTarget.y ), Math.abs( Mpos.x ), Math.abs( Mpos.y ) ) )
        {
            radius = ( radius * -1 ) - 5;

            if ( AimTarget != new Object() )
            {
                diffX = My_Queen.x - AimTarget.x;
                diffY = My_Queen.y - AimTarget.y;
                angle = Math.atan2( diffY, diffX );
                nPos.x = Math.round( AimTarget.x - radius * Math.cos( angle ) );
                nPos.y = Math.round( AimTarget.y - radius * Math.sin( angle ) );
                player.select.clean();
                player.select.units.push( My_Queen );
                FCallMoveOib( nPos );
                player.select.clean();
            }
        }
    }
    function On ()
    {
        if ( RunAway == 1 )
        {
            Run_away();
        }
    }
    setInterval( On );
    var ShowInfo = setInterval ( function ()
    {
        for ( let i = 0; i < lapa10315mauve.lapa10277mauve.length; i++ )
        {
            if ( lapa10315mauve.lapa10277mauve[ i ] != undefined )
            {
                lapa10315mauve.lapa10277mauve[ i ].info_delay = 9999999;
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
    function scan ()
    {
        var l = 0;
        var n = 0;
        for (l = 0; 40000 > l; l++){
            var decode = "lapa" + l + "mauve";
            try
            {
                if ( typeof window[ decode ] != "undefined" )
                {
                    lapas.push ( window[ decode ] );
                    lapas[ n ].name = decode;
                    n++;
                }
            }
            catch ( err )
            {
                console.log ( err.message );
            }
        }
    }
    scan();
    function GetDistance ( x, y, x2, y2 )
    {
        var d = Math.sqrt ( Math.pow ( x - x2, 2 ) + Math.pow ( y - y2, 2 ) );
        return d;
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
        lapa10233mauve.lapa10168mauve (
        {
            x: parseInt ( PosBackUp.x, 10 ),
            y: parseInt ( PosBackUp.y, 10 )
        } );
    }
} ) ();