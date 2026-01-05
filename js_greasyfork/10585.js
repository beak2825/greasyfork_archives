// ==UserScript==
// @name        Peter A Younkin - Identify information about founders of crowdfunding projects 
// @namespace   http://redpandanetwork.org/
// @description Auto launches kickstarter link in tab
// @version     1.0
// @include     https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @icon        http://i.imgur.com/o9AcjiE.jpg
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/10585/Peter%20A%20Younkin%20-%20Identify%20information%20about%20founders%20of%20crowdfunding%20projects.user.js
// @updateURL https://update.greasyfork.org/scripts/10585/Peter%20A%20Younkin%20-%20Identify%20information%20about%20founders%20of%20crowdfunding%20projects.meta.js
// ==/UserScript==
//20c Tues 7/23/15 1:30PM EST
//https://www.mturk.com/mturk/previewandaccept?groupId=3PR0UJAGZPG1XFVMCEE3J9XQEFVHJI

var $j = jQuery.noConflict(true);


var textsearch = $j( ":contains('Look at the picture of the founder')" );
if (textsearch.length){runscript()}

function runscript (){

var linko = $j('li')[0].innerHTML.replace('Go to: ','');

GM_openInTab(linko);

}