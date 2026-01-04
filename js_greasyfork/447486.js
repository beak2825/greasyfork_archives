// ==UserScript==
// @name OGame: Resources on Transit
// @namespace https://greasyfork.org/en/users/932886-alexey-tokar
// @description OGame: Displays resources on transit
// @version 1.1
// @creator Alexey Tokar
// @license MIT
// @include https://*.ogame.gameforge.com/game/index.php*
// @downloadURL https://update.greasyfork.org/scripts/447486/OGame%3A%20Resources%20on%20Transit.user.js
// @updateURL https://update.greasyfork.org/scripts/447486/OGame%3A%20Resources%20on%20Transit.meta.js
// ==/UserScript==

var strFunc = (function(){
    var createNode = function( value, pos ) {
        var metalnode = document.getElementById('resources_metal').parentNode;
        var metalspan = document.createElement('SPAN');
        var metaltxt = document.createTextNode( Number(value).toLocaleString() )

        metalspan.appendChild(metaltxt);
        metalspan.setAttribute("style","position: absolute;    bottom: -35px;    left: " + pos + "%;    width: 170%;color:#AB7AFF;");
        metalnode.appendChild(metalspan);
    }

    var mvmnts = $('.icon_movement_reserve .tooltip' );
    var metal = 0;
    var crys = 0;
    var dey = 0;

    for ( var m of mvmnts ) {
        var fields = $( "tr .value", $.parseHTML( m['title'] ) ).slice(-3);
        metal += parseInt( fields[0].innerHTML.replaceAll(".",""));
        crys += parseInt( fields[1].innerHTML.replaceAll(".",""));
        dey += parseInt( fields[2].innerHTML.replaceAll(".",""));
    }

    createNode( metal, "-50" );
    createNode( crys, "60" );
    createNode( dey, "170" );

}).toString();

var script = document.createElement("script");
script.setAttribute("type","text/javascript");
script.text = "(" + strFunc + ")();";
document.body.appendChild(script);

