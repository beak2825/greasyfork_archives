// ==UserScript==
// @name        Like/Follow
// @autor       Dany Thill (SyfuxX)
// @namespace   http://androidhelp24.jimdo.com
// @description Like or Follow all posts or people on the Wall with only one click.
// @include     http://facebook.com
// @include     http://facebook.com/*
// @include     http://www.facebook.com
// @include     http://www.facebook.com/*
// @include     https://facebook.com/*
// @include     https://facebook.com
// @include     https://www.facebook.com/*
// @include     https://www.facebook.com
// @include     http://twitter.com/*
// @include     http://www.twitter.com/*
// @include     https://twitter.com/*
// @include     https://www.twitter.com/*
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15975/LikeFollow.user.js
// @updateURL https://update.greasyfork.org/scripts/15975/LikeFollow.meta.js
// ==/UserScript==

/* 
This Script is Copyright secured.
Copyright © 2016 AndroidHelp24
*/

// ==facebookLikeButton==

// facebook Like button create
var btnFbLike = document.createElement( 'input' );
with( btnFbLike ) {
  setAttribute( 'type', 'button' );
  setAttribute( 'value', 'Like' );
  setAttribute( 'onclick', 'javascript: var inputs = document.getElementsByClassName("_48-k UFILikeLink"); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }' );
  setAttribute( 'style', 'position: fixed; top: 55px; left: 10px; font-weight: bold; font-size: 12px; font-family: calibri; color: white; black; border: 1px solid; border-radius: 25px; background-color: rgb(70, 98, 158); padding: 2px 5px 2px 5px;' )
}

// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnFbLike );

// ==/facebookLikeButton==

// ==facebookAddPeopleButton==

// facebook addPeople button create
var btnFbAdd = document.createElement( 'input' );
with( btnFbAdd ) {
  setAttribute( 'type', 'button' );
  setAttribute( 'value', 'Add' );
  setAttribute( 'onclick', 'javascript: var inputs = document.getElementsByClassName("_42ft _4jy0 FriendRequestAdd addButton _4jy3 _4jy1 selected _51sy"); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }' );
  setAttribute( 'style', 'position: fixed; top: 55px; left: 50px; font-weight: bold; font-size: 12px; font-family: calibri; color: white; border: 1px solid; border-radius: 25px; background-color: rgb(70, 98, 158); padding: 2px 5px 2px 5px;' )
}

// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnFbAdd );

// ==/facebookAddPeopleButton==


// ==twitterLikeButton==

// twitter Like button create
var btnTwitterLike = document.createElement( 'input' );
with( btnTwitterLike ) {
  setAttribute( 'type', 'button' );
  setAttribute( 'value', 'Like' );
  setAttribute( 'onclick', 'javascript: var inputs = document.getElementsByClassName("ProfileTweet-actionButton js-actionButton js-actionFavorite"); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }' );
  setAttribute( 'style', 'position: fixed; top: 85px; left: 10px; font-weight: bold; font-size: 12px; font-family: calibri; color: white; border: 1px solid; border-radius: 25px; background-color: rgb(85, 172, 238); padding: 2px 5px 2px 5px;' )
}

// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTwitterLike );

// ==/twitterLikeButton==

// ==twitterFollowButton==

// twitter Follow button create
var btnTwitterFollow = document.createElement( 'input' );
with( btnTwitterFollow ) {
  setAttribute( 'type', 'button' );
  setAttribute( 'value', 'Follow' );
  setAttribute( 'onclick', 'javascript: var inputs = document.getElementsByClassName("user-actions-follow-button js-follow-btn follow-button btn"); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }' );
  setAttribute( 'style', 'position: fixed; top: 85px; left: 50px; font-weight: bold; font-size: 12px; font-family: calibri; color: white; border: 1px solid; border-radius: 25px; background-color: rgb(85, 172, 238); padding: 2px 5px 2px 5px;' )
}

// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTwitterFollow );

// ==/twitterFollowButton==

// ==infoButton==

// info button create
var btnInfo = document.createElement( 'span' );
with( btnInfo ) {
  innerHTML = "<a href='http://androidhelp24.jimdo.com' target='_blank' style='text-decoration: none;'> Info </a>"
  setAttribute( 'style', 'position: fixed; top: 115px; left: 10px; font-weight: bold; font-size: 12px; font-family: calibri; color: rgb(70, 98, 158); border: 1px solid; border-color: rgb(70, 98, 158); border-radius: 25px; background-color: white; padding: 2px 10px 2px 10px;')
}

// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnInfo );

// ==/infoButton==

// ==versionText==

var versionText = document.createElement( 'span' );
with( versionText ) {
  innerHTML = "<span>Version: 0.2</span>"
  setAttribute( 'style', 'position: fixed; top: 115px; left: 55px; font-weight: bold; font-size: 12px; font-family: calibri; color: rgb(70, 98, 158); border: 1px solid; border-color: rgb(70, 98, 158); border-radius: 25px; background-color: white; padding: 2px 10px 2px 10px;')
}

// append at end
document.getElementsByTagName( 'body' )[ 0 ].appendChild( versionText );

// ==/versionText==

// Einfügen erlauben