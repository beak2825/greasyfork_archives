// ==UserScript==
// @name         WarBot - Asissts
// @namespace    ApocScripts
// @version      1.2
// @grant        GM_addStyle
// @description  Sends an assist requests to the WarBot disc bot
// @author       TheApocalypse [1066798]
// @grant        GM_xmlhttpRequest
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/469584/WarBot%20-%20Asissts.user.js
// @updateURL https://update.greasyfork.org/scripts/469584/WarBot%20-%20Asissts.meta.js
// ==/UserScript==
const apikey = "--YOUR API HERE--";
 
function parsePage(){
$(".title___rhtB4").after("<button class=\"astwb torn-btn btn-dark-bg\">Request Assist</button>&nbsp;&nbsp;");
$(".astwb").click(function(){
    var enemy = getID();
    var member = getUser();
    const memberData = "";
        member.then((a) => {
            var dataWB = {user: a, enemy: enemy, key: apikey, method: "assist"};
            dataWB = JSON.stringify(dataWB);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://80.64.217.73:2003",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: dataWB,
                    dataType: 'json',
                    success: function(response){ console.log( response ); }
                } );
        });
 
});
 
};
 
function getID(){
    var userID = GetURLParameter('user2ID');
    return userID;
}
 
async function getUser(){
    var userID = "";
    try {
    let userStatsWB = await getStats(userID);
       return userStatsWB;
 
    } catch (error) {
        console.log('Error:', error);
    }
 
}
 
function getStats(userID){
   return $.post( "https://api.torn.com/user/"+userID+"?selections=profile,discord&key="+apikey);
}
 
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
parsePage();