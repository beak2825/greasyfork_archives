// ==UserScript==
// @name         Torn: Special Ammo Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show progress towards special ammo used
// @author       Untouchable [1360035]
// @match        https://www.torn.com/page.php?sid=ammo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412219/Torn%3A%20Special%20Ammo%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412219/Torn%3A%20Special%20Ammo%20Helper.meta.js
// ==/UserScript==

const colors = true; // Grey out completed categories

GM_addStyle ( `
table {
  table-layout:fixed;
  width:100%;
}

#special-ammo > tbody > tr > td {
  padding:5px
}

/*
table, td {
  border: 1px solid black;
  border-collapse: collapse;
} */

td {
  width: 16.6%
}

.incomplete {

}

.complete {
  color: #d3d3d3;
}

` );

(function() {
    'use strict';

    let apiKey = localStorage.getItem('uapikey');
    if(apiKey === null) {
        apiKey = '';
        while(apiKey !== null && apiKey.length != 16) {
            apiKey = prompt("Please enter a valid Torn API key");
        }
        if(apiKey !== null && apiKey.length == 16) {
            localStorage.setItem('uapikey', apiKey);
        }
    }

    fetch('https://api.torn.com/user/?selections=personalstats&key=' + apiKey)
        .then(response => response.json())
        .then(data => {

          let ps = data.personalstats;

          let hr = '#ammoroot > div > div.bodyWrap___2WxC7';

          let hits_req = getHitsReq(data.personalstats);

          $(hr).before(
              `
                 <div id="special-ammo-hits-title" class="title-black top-round" role="heading" aria-level="5">
                 Special Ammo Used - ${hits_req}
                 <div class="clear"></div>
                 </div>

                 <div class="cont-gray bottom-round content" style="padding:5px">
                   <table id="special-ammo">
                     <tr>
                       <td class="` + getStatus(ps.hollowammoused) + `" title="">Hollow Point: </td>
                       <td class="` + getStatus(ps.hollowammoused) + `">${nwc(ps.hollowammoused)}</td>
                       <td class="` + getStatus(ps.tracerammoused) + `" title="">Tracer: </td>
                       <td class="` + getStatus(ps.tracerammoused) + `">${nwc(ps.tracerammoused)}</td>
                       <td class="` + getStatus(ps.piercingammoused) + `" title="">Piercing: </td>
                       <td class="` + getStatus(ps.piercingammoused) + `">${nwc(ps.piercingammoused)}</td>
                       <td class="` + getStatus(ps.incendiaryammoused) + `" title="">Incindiary: </td>
                       <td class="` + getStatus(ps.incendiaryammoused) + `">${nwc(ps.incendiaryammoused)}</td>
                     </tr>
                   </table>
                 </div>
                 <br>
              `
          );

    });

})();

//////////////////////////////////////////////////////////////////////////////////////////

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

//////////////////////////////////////////////////////////////////////////////////////////

function getHitsReq(stats) {
    let hitsReq = 0;
    let categories = 0;

    if(stats.hollowammoused < 2500){
      hitsReq = hitsReq + (2500 - stats.hollowammoused);
      categories++;
    }

    if(stats.tracerammoused < 2500){
      hitsReq = hitsReq + (2500 - stats.tracerammoused);
      categories++;
    }

    if(stats.piercingammoused < 2500){
      hitsReq = hitsReq + (2500 - stats.piercingammoused);
      categories++;
    }

    if(stats.incendiaryammoused < 2500){
      hitsReq = hitsReq + (2500 - stats.incendiaryammoused);
      categories++;
    }


    let ret = nwc(hitsReq) + " hits required in " + categories + " categories";

    return ret;

}

//////////////////////////////////////////////////////////////////////////////////////////

function nwc(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//////////////////////////////////////////////////////////////////////////////////////////

function getStatus(hits){

  if(!colors) {
    return "";
  }

  if(hits >= 2500){
    return "complete";
  } else {
    return "incomplete";
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
