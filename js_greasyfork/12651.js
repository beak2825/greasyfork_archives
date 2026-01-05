// ==UserScript==
// @name  - Eagle Eye - Are the two people in the photos the same person? - $0.04 
// @description Does some stuff.
// @version 1.0
// @author DCI
// @namespace http://www.redpandanetwork.org
// @icon https://dl.dropboxusercontent.com/u/353548/rpav.jpg
// @include https://www.mturkcontent.com/*
// @require http://code.jquery.com/jquery-latest.min.js
// @groupId 38KT5K3J4K2S7GOD7PEP7UNZ2VTJQH&isPreviousIFrame=true&prevRequester=PandaAlert
// @frameurl https://www.mturkcontent.com/dynamic/hit?assignmentId=34HJIJKLP6BWQQ0RYEGNLH8RN22V45&hitId=3YLTXLH3DFLABYTX17M5KUXTJ9WPHT&workerId=ALQPGVQZEZSUE&turkSubmitTo=https%3A%2F%2Fwww.mturk.com 
// @downloadURL https://update.greasyfork.org/scripts/12651/-%20Eagle%20Eye%20-%20Are%20the%20two%20people%20in%20the%20photos%20the%20same%20person%20-%20%24004.user.js
// @updateURL https://update.greasyfork.org/scripts/12651/-%20Eagle%20Eye%20-%20Are%20the%20two%20people%20in%20the%20photos%20the%20same%20person%20-%20%24004.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

var textsearch = $j( ":contains('If a photo is missing or the photo is not of a person')" );
if (textsearch.length){runscript()}

function runscript(){
    
     var pitchers = document.getElementsByTagName('img');
    for (var f = 0; f < pitchers.length; f++){
        pitchers[f].hide();}




}