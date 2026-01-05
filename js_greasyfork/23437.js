// ==UserScript==
// @name        fixagito
// @namespace   fixagito
// @include     https://ephinea.pioneer2.net/drop-charts/ultimate/
// @version     1
// @grant       none
// @author      Code written by Jake, arrays edited by falkenjeff
// @description Modifies Ephinea drop charts to include version numbers for some of the items.
// @downloadURL https://update.greasyfork.org/scripts/23437/fixagito.user.js
// @updateURL https://update.greasyfork.org/scripts/23437/fixagito.meta.js
// ==/UserScript==
 
var agitoindex = 0;
var flowensindex = 0;
var dbsindex = 0;
var agitos = ["Agito 1975", "Agito 1975", "Agito 1975", "Agito 1975", "Agito 1975", "Agito 1975", 
              "Agito 1975", "Agito 1975", "Agito 1977", "Agito 1983", "Agito 1980", 
              "Agito 1977", "Agito 1980", "Agito 1975", "Agito 1977", "Agito 1980", "Agito 1991", 
             "Agito 1975", "Agito 1983", "Agito 1983", "Agito 1983", "Agito 1991", "Agito 1991"];

var flowens = ["Flowen's Sword 3064", "Flowen's Sword 3079", "Flowen's Sword 3083", "Flowen's Sword 3073", "Flowen's Sword 3060", 
               "Flowen's Sword 3067", "Flowen's Sword 3082", "Flowen's Sword 3084", "Flowen's Sword 3077"];

var dbs = ["DB's Saber 3062", "DB's Saber 3073", "DB's Saber 3075", "DB's Saber 3069", "DB's Saber 3069", 
           "DB's Saber 3077", "DB's Saber 3067", "DB's Saber 3070", "DB's Saber 3064"];
 
var bolds = document.getElementsByTagName('b');
 
//Agitos loop
for (i=0; i < bolds.length; i++)
{
  if (bolds[i].innerHTML.match(/Agito/)) {
    bolds[i].innerHTML = agitos[agitoindex];
    agitoindex++;
  }
  if(agitoindex >= agitos.length) {
      break;
  }
 
}

//Flowens loop
for (i=0; i < bolds.length; i++)
{
  if (bolds[i].innerHTML.match(/Flowen's Sword/)) {
    bolds[i].innerHTML = flowens[flowensindex];
    flowensindex++;
  }
  if(flowensindex >= flowens.length) {
      break;
  }
 
}

//DBs loop
for (i=0; i < bolds.length; i++)
{
  if (bolds[i].innerHTML.match(/DB's Saber/)) {
    bolds[i].innerHTML = dbs[dbsindex];
    dbsindex++;
  }
  if(dbsindex >= dbs.length) {
      break;
  }
 
}