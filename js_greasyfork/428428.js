// ==UserScript==
// @name         Torn: Stats on Profile for Muttley
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show stats on profile page
// @author       Untouchable [1360035]
// @connect      tornstats.com
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        GM.xmlHttpRequest
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @connect      api.torn.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/428428/Torn%3A%20Stats%20on%20Profile%20for%20Muttley.user.js
// @updateURL https://update.greasyfork.org/scripts/428428/Torn%3A%20Stats%20on%20Profile%20for%20Muttley.meta.js
// ==/UserScript==

GM_addStyle ( `
.profile-wrapper.medals-wrapper {
  display:none;
}

table {
  table-layout:fixed;
  width:100%;
}

#finishing_hits > tbody > tr > td {
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

.green {
  color: darkgreen;
}

.red {
  color: red;
}

` );

(function () {
  "use strict";

  let apiKey = "wQBu82TZnq5xji2k";
  let uid = window.location.href.split("XID=")[1];
  let ts_api = `https://www.tornstats.com/api/v1/${apiKey}/spy/${uid}`;
  let str, def, dex, spd, tot;

  const requests = {
    get(url) {
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: url,
          onload: (response) => {
            try {
              resolve(JSON.parse(response.response));
            } catch (e) {
              resolve(response.response);
            }
          },
          onerror: (error) => reject(error),
        });
      });
    },
        post(url, data) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(data),
                    onload: response => {
                        try {
                            resolve(JSON.parse(response.response));
                        } catch(e) {
                            resolve(response.response);
                        }
                    },
                    onerror: error => reject(error)
                });
            });
        }
    };

    let getStatsEstimate = async function (uid,method) {

        const r = await requests.get('https://api.torn.com/user/' + uid + '?selections=profile,personalstats,crimes&key=' + apiKey);
        const r2 = await requests.post('https://script.google.com/macros/s/AKfycbwar1bX9_jg6i2JJDeGlMcVgPahcYykPd9fEBYrQDSEO7qiYDIm/exec', {
            key: 'tPDeqwqKZDA3Jias',
            [method]: JSON.stringify(r)
        });
        console.log(r2);
    };

  requests.get(ts_api).then((data) => {
    let spy = data.spy,
    str = nwc(spy.strength),
    spd = nwc(spy.speed),
    dex = nwc(spy.dexterity),
    def = nwc(spy.defense),
    tot = nwc(spy.total),
    dStr = delta(spy.deltaStrength),
    dSpd = delta(spy.deltaSpeed),
    dDex = delta(spy.deltaDexterity),
    dDef = delta(spy.deltaDefense),
    dTot = delta(spy.deltaTotal);
    console.log(data);

    waitForKeyElements('.personal-info',() => {

      $('.personal-info').parent().parent().children()[0].innerText = `TornStats Spy (${spy.difference})`;
      $(".personal-info")[0].innerHTML = "";

      let stats = `
        <ul class="info-table">
            <li>
                <div class="user-information-section">
                    <span class="bold">Strength</span>
                </div>
                <div class="user-info-value">
                    <table>
                      <tr>
                        <td><span>${str}</span></td>
                        <td><span class='${color(dStr)}'>${dStr}</span></td>
                      </tr>
                    </table>
                </div>
            </li>
            <li>
                <div class="user-information-section">
                    <span class="bold">Defense</span>
                </div>
                <div class="user-info-value">
                   <table>
                      <tr>
                        <td><span>${def}</span></td>
                        <td><span class='${color(dDef)}'>${dDef}</span></td>
                      </tr>
                    </table>
                </div>
            </li>
            <li>
                <div class="user-information-section">
                    <span class="bold">Speed</span>
                </div>
                <div class="user-info-value">
                   <table>
                      <tr>
                        <td><span>${spd}</span></td>
                        <td><span class='${color(dSpd)}'>${dSpd}</span></td>
                      </tr>
                    </table>
                </div>
            </li>
            <li>
                <div class="user-information-section">
                    <span class="bold">Dexterity</span>
                </div>
                <div class="user-info-value">
                   <table>
                      <tr>
                        <td><span>${dex}</span></td>
                        <td><span class='${color(dDex)}'>${dDex}</span></td>
                      </tr>
                    </table>
                </div>
            </li>
            <li>
                <div class="user-information-section">
                    <span class="bold">Total</span>
                </div>
                <div class="user-info-value">
                   <table>
                      <tr>
                        <td><span>${tot}</span></td>
                        <td><span class='${color(dTot)}'>${dTot}</span></td>
                      </tr>
                    </table>
                </div>
            </li>
        </ul>
              `;

      $(".personal-info")[0].innerHTML = stats;
    })
  });


  // Your code here...
})();

function color(c) {
    console.log(c);
  if(!c.indexOf("+")){
    return 'green';
  } else {
    return 'red';
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

function nwc(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function delta(x) {
    if(x == undefined){return;}
    let prefix = "";
    console.log(typeof x);
    if(x.toString().indexOf("-")){
      prefix = "+ ";
    }

    let output = prefix + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    output = output.replace("-","- ");

    return output;
}

//////////////////////////////////////////////////////////////////////////////////////////

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

//////////////////////////////////////////////////////////////////////////////////////////

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}








