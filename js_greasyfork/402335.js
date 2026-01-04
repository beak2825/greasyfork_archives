// ==UserScript==
// @name         RoboSum
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculates how much I spent on Robofun
// @author       Hamid
// @match        https://www.robofun.ro/comenzi
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/402335/RoboSum.user.js
// @updateURL https://update.greasyfork.org/scripts/402335/RoboSum.meta.js
// ==/UserScript==

var script_link = "https://greasyfork.org/hu/scripts/402335-robosum/code/RoboSum.user.js";

var roboSum = 0;

GetTotals();

function GetTotals(){
  var list = document.getElementsByTagName('li');
  for (var i = list.length-1; i >=0 ; i--) {
      if(ContainsTotal(list[i].innerHTML)){
          var regex = /\d{3,}/ig;
          var result = list[i].innerHTML.match(regex);
          if(null != result) {
              for(var k=0; k<result.length;k++){
                 // console.log(result[k]);
                  roboSum = parseInt(roboSum)+parseInt(result[k]);
                  //console.log(roboSum);
              }
          }
       }
  }
  DisplaySum(roboSum);
}

function DisplaySum(strSum){
  var list = document.getElementsByTagName('h3');
  for (var i = list.length-1; i >=0 ; i--) {
      if(ContainsIstoric(list[i].innerHTML)){
          list[i].innerHTML += " (" + strSum + " RON)";
      }
  }
}
function ContainsTotal(strComp){
    var regex = /Total: /ig;
    var result = strComp.match(regex);
    if(null != result) return true;
    return false;
}
function ContainsIstoric(strComp){
    var regex = /Istoric Comenzi/ig;
    var result = strComp.match(regex);
    if(null != result) return true;
    return false;
}

function updateCheck(forced) {
    if ((forced) || (parseInt(GM_getValue('SUC_last_update', '0')) + 86400000 <= (new Date().getTime()))) // Checks once a day (24 h * 60 m * 60 s * 1000 ms)
    {
        try
        {
            GM_xmlhttpRequest(
                {
                    method: 'GET',
                    url: script_link,
                    headers: {'Cache-Control': 'no-cache'},
                    onload: function(resp)
                    {
                        var local_version, remote_version, rt, script_name;

                        rt=resp.responseText;
                        GM_setValue('SUC_last_update', new Date().getTime()+'');
                        var re = /@version\s*(.*?)\s/m;
                        remote_version=parseFloat(re.exec(rt)[1]);
                        local_version=parseFloat(GM_getValue('SUC_current_version', '-1'));
                        if(local_version!=-1)
                        {
                            script_name = (/@name\s*(.*?)\s*$/m.exec(rt))[1];
                            GM_setValue('SUC_target_script_name', script_name);
                            if (remote_version > local_version)
                            {
                                if(confirm('There is an update available for the Greasemonkey script "'+script_name+'."\nWould you like to go to the install page now?'))
                                {
                                    GM_openInTab(script_link);
                                    GM_setValue('SUC_current_version', remote_version);
                                }
                            }
                        }
                        else
                            GM_setValue('SUC_current_version', remote_version+'');
                    }
                });
        }
        catch (err)
        {
            if (true)
                alert('An error occurred while checking for updates:\n'+err);
        }
    }
}


updateCheck();