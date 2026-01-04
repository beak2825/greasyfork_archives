// ==UserScript==
// @name         Vinerri Faction Message Display
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Places a Vinerri Tactic note using tampermonkey gm method
// @author       King-5t3n [2156450]
// @match        https://www.torn.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465464/Vinerri%20Faction%20Message%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/465464/Vinerri%20Faction%20Message%20Display.meta.js
// ==/UserScript==
// to modify the current tactic visit: https://docs.google.com/spreadsheets/d/1_WqEyAp2-OV5kEVAD9Xzx4xDnDNzVRiThhY31PH8kOo/edit#gid=0
(function() {
    'use strict';
    let file = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQU8qBQl6-sXkLF5nX5DwL4SmC2s4MA9XI9vSWrI2T0BF3Qd743EgQ-vjwB9hR48rbx8e6zgFlo94v/pub?gid=0&single=true&output=csv"
    let $ = unsafeWindow.jQuery;
    var Faction = 'not found'
    try{
    $("#body > div.ToolTipPortal").hide();
    document.querySelector("#icon9-sidebar").focus();
    Faction = document.querySelector("#body > div.ToolTipPortal > div > div.tooltip___kaDlx > p").innerHTML.toString();
    document.querySelector("#icon9-sidebar").blur()
    if(Faction.includes('Vinerri')){Faction = 'Vinerri'}else{Faction = 'not found'}
       }
    
    catch{

    try{$("#body > div.ToolTipPortal").hide()
    document.querySelector("#icon74-sidebar").focus()
    Faction = document.querySelector("#body > div.ToolTipPortal > div > div.tooltip___kaDlx > p").innerHTML.toString()
    document.querySelector("#icon74-sidebar").blur()
    if(Faction.includes('Vinerri')){Faction = 'Vinerri'}else{Faction = 'not found'}
       }

    catch{$("#body > div.ToolTipPortal").hide()
    document.querySelector("#icon81-sidebar").focus()
    Faction = document.querySelector("#body > div.ToolTipPortal > div > div.tooltip___kaDlx > p").innerHTML.toString()
    document.querySelector("#icon81-sidebar").blur()
    if(Faction.includes('Vinerri')){Faction = 'Vinerri'}else{Faction = 'not found'}
         }
    }


    if(Faction == 'Vinerri'){
    $(".content-title > .page-head-delimiter").hide();
    GM_xmlhttpRequest({
  method: "GET",
  url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQU8qBQl6-sXkLF5nX5DwL4SmC2s4MA9XI9vSWrI2T0BF3Qd743EgQ-vjwB9hR48rbx8e6zgFlo94v/pub?gid=0&single=true&output=csv",
  onload: function(response){$('h4#skip-to-content.left').append('<h4 id="forumlink" style="position:absolute;  font-size:15px; color:red; " ><a  href="https://www.torn.com/factions.php?step=your#/" style="color:red;">'+this.responseText+'</a></h4>');
                             if(this.responseText == 'Turtle Tactic Live'){document.getElementById("forumlink").innerHTML = '<a style="color:#172291;" href="https://www.torn.com/forums.php#p=threads&f=999&t=16329187&b=1&a=8836">'+this.responseText+'</a>';
                                                                          }
                             if(this.responseText == 'Slow Chain Tactic Live'){document.getElementById("forumlink").innerHTML = '<a style="color:#172291;" href="https://www.torn.com/forums.php#/p=threads&f=999&t=16329194&b=1&a=8836">'+this.responseText+'</a>';}
                                                                              }
                        });
                        }


  else{
  $('h4#skip-to-content.left').append('<h4 id="forumlink" style="position:absolute;  font-size:15px; color:red; " ><a  href="https://www.torn.com/factions.php?step=your#/" style="color:red;">Vinerri members only'+Faction+'</a></h4>');
  }
}

)();