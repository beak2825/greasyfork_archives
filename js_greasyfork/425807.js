// ==UserScript==
// @name        Whoogle - Number Results
// @namespace   r-a-y/whoogle/number
// @description Number search results on select Whoogle instances.
// @version     1.0.0
// @grant       none
// @match       https://whoogle.sdf.org/search*
// @license     GPL v3
// @downloadURL https://update.greasyfork.org/scripts/425807/Whoogle%20-%20Number%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/425807/Whoogle%20-%20Number%20Results.meta.js
// ==/UserScript==
 
let results = document.querySelectorAll("#main > div a h3 div"),
    currPage = 0,
    params = (new URL(document.location)).searchParams;

if ( params.get( 'start' ) ) {
  currPage = +params.get( 'start' );
}

for ( let i = 0, len = results.length; i < len; ++i ) {
  let newSpan    = document.createElement( "span" );
  newSpan.setAttribute( "style", "float:left; font-weight:600; font-size:.9em !important; display:inline-block; margin-top:1px; margin-right:5px;" );
 
  let newContent = document.createTextNode( ( currPage + i + 1 ) + ". ");
  newSpan.appendChild( newContent );
 
  results[i].insertBefore( newSpan, results[i].firstChild );
}