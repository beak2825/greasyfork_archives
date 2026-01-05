// ==UserScript==
// @name        Frozen Bugs
// @namespace   FrozenBugs
// @description Auto buy for Swarm Simulator
// @include     https://swarmsim.github.io/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20063/Frozen%20Bugs.user.js
// @updateURL https://update.greasyfork.org/scripts/20063/Frozen%20Bugs.meta.js
// ==/UserScript==

// https://www.reddit.com/r/swarmsim/comments/4be20n/frozen_bugs_beginning_automation/
// https://github.com/Icehawk78/FrozenBugs
// https://github.com/Niller2005/FrozenBugs

var script = document.createElement("script");
script.src = "https://googledrive.com/host/0B4anj1Xl97bTZDRNakNiRl8ycjA/frozen_bugs_fixed.js";
document.getElementsByTagName("head")[0].appendChild(script);
// https://raw.githubusercontent.com/Icehawk78/FrozenBugs/master/frozen_bugs.js
// https://raw.githubusercontent.com/Niller2005/FrozenBugs/master/frozen_bugs.js

// create auto buy button
var btn1 = document.createElement( 'input' );
with( btn1 ) {
  setAttribute( 'id', 'button1' );
  setAttribute( 'onclick', 'buyFunc(); document.getElementById("button1").value = "Auto buy on";' );
  setAttribute( 'value', 'Auto buy off' );
  setAttribute( 'type', 'button' );
}
// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn1 );


// create auto energy button
// var btn2 = document.createElement( 'input' );
//with( btn2 ) {
//  setAttribute( 'id', 'button2' );
//  setAttribute( 'onclick', 'autoEnergy(); document.getElementById("button2").value = "Auto energy on";' );
//  setAttribute( 'value', 'Auto energy off' );
//  setAttribute( 'type', 'button' );
//}
// append at end
//document.getElementsByTagName( 'body' )[ 0 ].appendChild( btn2 );
