// ==UserScript==
// @name            WF Global Lib
// @version         0.0.1.1
// @author          Exolium
// @copyright       2015-2022 Exolium
// @description     Global library for all scripts that need it. Primary purpose, to serve Exolium's WazeForum scripts, but can be used by those who need it.
// @description:fr  Bibliothèque globale pour tous les scripts qui en ont besoin. But premier, servir aux scripts WazeForum d'Exolium, mais peut être utiliser par ceux qui en ont besoin.
// @licence         GNU GPL v2
// @grant           GM_xmlhttpRequest
// ==/UserScript==


//================================ Library : xpath ===========================//

function WGL_xpath(WGL_L_query, WGL_L_element) {
 WGL_Log('WGL_xpath', 4, 'Start');

 var WGL_L_result = document.evaluate(WGL_L_query, WGL_L_element, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
 var WGL_L_table = new Array();
 var WGL_L_cpt = 0;

 for (WGL_L_cpt = 0; WGL_L_cpt < WGL_L_result.snapshotLength; WGL_L_cpt++) WGL_L_table.push(WGL_L_result.snapshotItem(WGL_L_cpt));
 WGL_Log('WGL_xpath', 4, 'End');
 return WGL_L_table;
}

function WGL_single_xpath(WGL_L_query, WGL_L_element) {
 WGL_Log('WGL_single_xpath', 4, 'Start');
 var WGL_L_elmFirstResult = document.evaluate(WGL_L_query, WGL_L_element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
 WGL_Log('WGL_single_xpath', 4, 'End');
 return WGL_L_elmFirstResult;
}

//================================= Library : log ============================//
function WGL_Log(WGL_L_function, WGL_L_type, WGL_L_text) {
 WGL_L_text = 'Waze ' + GM_info.script.name + ' ' + GM_info.script.version + ' ' + WGL_L_function + ' : ' + WGL_L_text;

 switch(WGL_L_type) {
  case 1 : // error
   if(WGL_Log_level > 0) console.error(WGL_L_text);
   break;
  case 2 : // warn
   if(WGL_Log_level > 1) console.warn(WGL_L_text);
   break;
  case 3 : // min log
   if(WGL_Log_level > 2) console.info(WGL_L_text);
   break;
  case 4 : // Medium Log
   if(WGL_Log_level > 3) console.info(WGL_L_text);
   break;
  case 5 : // high detail Log
   if(WGL_Log_level > 4) console.info(WGL_L_text);
   break;
  default: // no log
   return;
 }
}
//============================================================================//