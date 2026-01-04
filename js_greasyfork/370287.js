// ==UserScript==
// @name         Discogs ratings export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.discogs.com/release/stats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370287/Discogs%20ratings%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/370287/Discogs%20ratings%20export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.includes("release/stats/")){
        var releaseId = window.location.href.split("/stats/")[1];
        var fiveRaters = '';

        var userNames = document.getElementsByClassName("linked_username");
        var ratings = document.getElementsByClassName("rating rating_read_only");
        var numOfRaters = ratings.length;
        var currentRating = 0;

        //iterate across raters to get ratings and store if five
        for (var i = 0; i < numOfRaters; i++){
            currentRating = ratings[i].getAttribute('data-value');

            if(currentRating == 5){
                fiveRaters+=userNames[i].innerText+',';
            }
        }

        //store data
        save(releaseId,fiveRaters);
    }
})();

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function save(id, t)
{
  var notes=window.localStorage.discogsRatings;
  if(!notes){
    notes=[];
  }
  else{
    notes=JSON.parse(notes);
  }

  var noteExisted=false;
  for(var i=0; i<notes.length; i++)
  {
    if(notes[i].id === id)
    {
      notes[i].comment=t;
      noteExisted=true;
      break;
    }
  }
  if(!noteExisted)
  {
    notes.push({id:id, comment:t});
  }

  window.localStorage.discogsRatings=JSON.stringify(notes);
    //alert(window.localStorage.discogsRatings);
}
