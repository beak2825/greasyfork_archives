// ==UserScript==
// @name         XjKJKDEDJKE
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *https://brainly.in*
// @grant         GM.xmlHttpRequest
// @grant       GM_addStyle


// @downloadURL https://update.greasyfork.org/scripts/406759/XjKJKDEDJKE.user.js
// @updateURL https://update.greasyfork.org/scripts/406759/XjKJKDEDJKE.meta.js
// ==/UserScript==



/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
GM.xmlHttpRequest({
  method: "GET",
  url: "https://brainly.in/api/28/api_global_rankings/view/0/1",
  headers: {
    "User-Agent": "Chrome/83.0.4103.116",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var responseXML = null;
    // Inject responseXML into existing Object (only appropriate for XML content).
    if (!response.responseXML) {
      responseXML = new DOMParser()
        .parseFromString(response.responseText, "text/xml");
    }
var data = JSON.parse(response.responseText);
var firstuser = {points:data.data[0].value,nick:data.users_data[0].nick, id:data.users_data[0].id, rank:data.users_data[0].ranks.names[0]};
var seconduser = {points:data.data[1].value,nick:data.users_data[1].nick, id:data.users_data[1].id, rank:data.users_data[1].ranks.names[0]};
var thirduser = {points:data.data[2].value,nick:data.users_data[2].nick, id:data.users_data[2].id,rank:data.users_data[2].ranks.names[0]};


var zNode       = document.createElement ('div');
zNode.innerHTML = '<span class="sg-button__icon"><div class="sg-icon sg-icon--adaptive sg-icon--x24"><svg class="sg-icon__svg"><use xlink:href="#icon-settings"></use></svg></div></span><button class="sg-box sg-box--no-border sg-box brn-white-background-box-light-gray" id="myButton" type="button">'
                + 'Check Daily Ranking</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
zNode.setAttribute ('class', 'sg-box sg-box--no-border sg-box brn-white-background-box-light-gray');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
   var zNode       = document.createElement ('p');
    var href1 = "/profile/"+firstuser.nick+"-"+firstuser.id;
    var href2 = "/profile/"+seconduser.nick+"-"+seconduser.id;
    var href3 = "/profile/"+thirduser.nick+"-"+thirduser.id;

    zNode.innerHTML = '<p><a style="background-color:Gold;" href="'+href1+'">'+firstuser.nick+'</a>-'+firstuser.points+' points '+firstuser.rank+'</p><br><p><a style="background-color:Orange;" href="'+href2+'">'+seconduser.nick+'</a>-'+seconduser.points+' points '+seconduser.rank+'</p><br><p><a style="background-color:Gray;" href="'+href3+'">'+thirduser.nick+'</a>-'+thirduser.points+' points '+thirduser.rank+'</p>';
    document.getElementById ("myContainer").appendChild (zNode);

}




//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    8px;
        right:                  16px;
        font-size:              20px;
        background:             #ebf2f7;
        border:                 none;
        margin:                 5px;
        opacity:                0.9;
        z-index:                222;
        padding:                40px 40px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  black;
        background:             #ebf2f7;
        font-size:              15px;

    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}}});