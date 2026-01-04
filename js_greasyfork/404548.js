// ==UserScript==
// @name         Cosmetic Oib
// @name:ru     Cosmetic oib
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Plus ( + ) - Up color; Minus ( - ) - Down color; M - cosmetic shield; j - comsetic sword; n - ghost mode
// @description:ru Plus ( + ) - Up color; Minus ( - ) - Down color; M - cosmetic shield; j - comsetic sword; n - ghost mode
// @author       0days
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404548/Cosmetic%20Oib.user.js
// @updateURL https://update.greasyfork.org/scripts/404548/Cosmetic%20Oib.meta.js
// ==/UserScript==
( function ()
 {
    var Ghst = 0;
    var shieldgear = 0;
    var sworlgear = 0;
    var upcolor = 0;
    var downcolor = 0;
    var ScrptKeys = {
        GostMode: 78,
        Shield: 77,
        Sword: 74,
        UpColor: 187,
        DownColor: 189
    };
    var ShowInfo = setInterval ( function ()
    {
        for ( let i = 0; i < lapa10315mauve.lapa10277mauve.length; i++ )
        {
            if ( lapa10315mauve.lapa10277mauve[ i ] != undefined )
            {
                lapa10315mauve.lapa10277mauve[ i ].info_delay = 1;
            }
        }
    } );
    window.addEventListener( "keydown", CaptureKeyPress );
    function CaptureKeyPress ( a )
    {
        var players = lapa10279mauve;
        var i = 0;
        if ( a.keyCode == ScrptKeys.GostMode )
        {
            Ghst += 1;
            if ( Ghst >= 2 )
            {
                Ghst = 0;
            }
            if ( Ghst == 1 )
            {
                for ( i = 0; i < players.length; i++ ) {
                    if ( players[ i ] ) players[ i ].vuln = 1;
                }
            }
            if ( Ghst == 0 )
            {
                for ( i = 0; i < players.length; i++ ) {
                    if ( players[ i ] ) players[ i ].vuln = 0;
                }
            }
        }
        if ( a.keyCode == ScrptKeys.Shield )
        {
            shieldgear += 1;
            if ( shieldgear >= 5 )
            {
                shieldgear = 0;
            }
            if ( shieldgear < 5 )
            {
                players[ player.id ].shield = shieldgear;
            }
        }
        if ( a.keyCode == ScrptKeys.Sword )
        {
            sworlgear += 1;
            if ( sworlgear >= 5 )
            {
                sworlgear = 0;
            }
            if ( sworlgear < 5 )
            {
                players[ player.id ].sword = sworlgear;
            }
        }
        if ( a.keyCode == ScrptKeys.UpColor )
        {
            upcolor += 1;
            if ( upcolor >= 7 )
            {
                upcolor = 0;
            }
            if ( sworlgear < 7 )
            {
                players[ player.id ].color = upcolor;
            }
        }
        if ( a.keyCode == ScrptKeys.DownColor )
        {
            upcolor -= 1;
            if ( upcolor >= 7 )
            {
                upcolor = 0;
            }
            if ( upcolor < 0 )
            {
                upcolor = 6;
            }
            if ( sworlgear < 7 )
            {
                players[ player.id ].color = upcolor;
            }
        }
    }
})();