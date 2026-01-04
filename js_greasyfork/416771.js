// ==UserScript==
// @name            WF ToolBox Lib Beta
// @namespace       WFTB_ns
// @version         0.1.2
// @description  When prema is present to offer his version for beta + classic editor and add the profile editor waze
// @description:fr  Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze
// @author          exolium
// @copyright       2015-2021 exolium
// @licence         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @description When prema is present to offer his version for beta + classic editor and add the profile editor waze
// ==/UserScript==

//============================== Options ================================//
var WFTB_Log_level = 5; // 0 = no log / 1 = error / 2 = warn / 3 = min log / 4 = Medium Log / 5 = high detail Log
var WFTB_targetblank = true;
var WFTB_use_layer = true;
var WFTB_button_beta = 'Beta';
var WFTB_button_prod = 'Prod';
var WFTB_button_editorprofil = 'Editor Profil β';
var WFTB_lang = WFTB_lang_en;

//============================== Var ====================================//
var WFTB_beta_editor_verify = false;
var WFTB_beta_editor = false;
var WFTB_profil = Array();
var WFTB_Settings = {};

//============================== URL ====================================//
var WFTB_URL_protocol = window.location.protocol + '//';
var WFTB_URL_Base = window.location.hostname;
var WFTB_URL_usergroups = WFTB_URL_protocol + WFTB_URL_Base + '/forum/ucp.php?i=167';
var WFTB_URL_UserProfil_URI = '/user/editor/';

//============================== Recherche ==============================//
var WFTB_search_base_url = '//a[contains(@href,\'editor-beta.waze.com\') or (@href,\'beta.waze.com\') or contains(@href,\'www.waze.com\')][contains(@href,\'editor\')]';
var WFTB_search_perma_layer = 'layers=w+';
var WFTB_search_usergroups_memberships = '//*[@id="ucp"]/div[1]/div/ul[2]';
var WFTB_search_usergroups_memberships_groups = ['//*[@id="ucp"]/div[1]/div/ul[2]/li','//*[@id="ucp"]/div[1]/div/ul[4]/li'];
var WFTB_search_usergroups_name = '';
var WFTB_search_usergroups_if_leadersheep = '//*[@id="ucp"]/div[1]/div/ul[1]/li/dl/dt';
var WFTB_search_Lang_Selector = '/html/body/div[3]/div[1]/div[6]/div';
var WFTB_search_linklist = '//*[@id="wrap"]/div[2]/div/ul[2]/li[2]';
var WFTB_search_addperma = '//*[@id="format-buttons"]/input[10]';

//============================== Bootstrap ==============================//
function WFTB_Bootstrap() {
 WFTB_Log('WFTB_Bootstrap', 4, 'Start');

 if (typeof unsafeWindow === "undefined") {
  unsafeWindow = (function () {
   var dummyElem = document.createElement('p');
   dummyElem.setAttribute('onclick', 'return window;');
   return dummyElem.onclick();
  }) ();
 }

 /* begin running the code! */
 WFTB_Log('WFTB_Bootstrap', 5, 'Init');
 unsafeWindow.onload = WFTB_Initialise();
 WFTB_Log('WFTB_Bootstrap', 5, document.getElementsByTagName('style')[0].innerHTML);
 WFTB_Log('WFTB_Bootstrap', 4, 'End');
}

//============================== Library : log ==========================//
function WFTB_Log(WFTB_L_function, WFTB_L_type, WFTB_L_text) {
 WFTB_L_text = 'Waze ' + GM_info.script.name + ' ' + GM_info.script.version + ' ' + WFTB_L_function + ' : ' + WFTB_L_text;

 switch(WFTB_L_type) {
  case 1 : // error
   if(WFTB_Log_level > 0) console.error(WFTB_L_text);
   break;
  case 2 : // warn
   if(WFTB_Log_level > 1) console.warn(WFTB_L_text);
   break;
  case 3 : // min log
   if(WFTB_Log_level > 2) console.info(WFTB_L_text);
   break;
  case 4 : // Medium Log
   if(WFTB_Log_level > 3) console.info(WFTB_L_text);
   break;
  case 5 : // high detail Log
   if(WFTB_Log_level > 4) console.info(WFTB_L_text);
   break;
  default: // no log
   return;
 }
}

//============================== WFTB_updatePerma ======================//
function WFTB_checkupdate() {
 WFTB_Log('WFTB_checkupdate', 4, 'End');

 WFTB_Log('WFTB_checkupdate', 5, 'WFTB_Settings.version=' + WFTB_Settings.version);
 WFTB_Log('WFTB_checkupdate', 5, 'GM_info.script.version=' + GM_info.script.version);

 if(WFTB_Settings.version != GM_info.script.version) {
  WFTB_Settings.version = GM_info.script.version;
  localStorage.WFTB_data = JSON.stringify(WFTB_Settings);
  WFTB_Log('WFTB_checkupdate', 5, JSON.stringify(WFTB_Settings));
 }

 if(WFTB_Settings.app_name != GM_info.script.name) {
  WFTB_Settings.app_name = GM_info.script.name;
  localStorage.WFTB_data = JSON.stringify(WFTB_Settings);
  WFTB_Log('WFTB_checkupdate', 5, JSON.stringify(WFTB_Settings));
 }

 WFTB_Log('WFTB_checkupdate', 4, 'End');
}

//============================== Library : Version type ========================//
function WFTB_version(){
 var return_version;
 var WFTB_version_prod = new RegExp("^(?:[0-9]{1,10}\.){1}[0-9]{1,10}$");
 var WFTB_version_beta = new RegExp("^(?:[0-9]{1,10}\.){2}[0-9]{1,10}$");
 var WFTB_version_alpha = new RegExp("^(?:[0-9]{1,10}\.){3}[0-9]{1,10}$");

 if (WFTB_version_alpha.test(WFTB_Settings.version)) {
  WFTB_Log_level = 5;
  return 'alpha';
 } else if (WFTB_version_beta.test(WFTB_Settings.version)) {
  WFTB_Log_level = 3;
  return 'beta';
 } else if (WFTB_version_prod.test(WFTB_Settings.version)) {
  WFTB_Log_level = 1;
  return 'prod';
 } else return false;
}

//============================== Library : WFTB_insertAfter ============//
function WFTB_insertAfter(WFTB_L_element, WFTB_L_target) {
 WFTB_Log('WFTB_insertAfter', 4, 'Start');
 WFTB_L_target.parentNode.insertBefore(WFTB_L_element, WFTB_L_target.nextSibling);
 WFTB_Log('WFTB_insertAfter', 4, 'End');
}

//============================== Library : xpath ========================//
function WFTB_xpath(WFTB_L_query, WFTB_L_element) {
 WFTB_Log('WFTB_xpath', 4, 'Start');

 var WFTB_L_result = document.evaluate(WFTB_L_query, WFTB_L_element, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
 var WFTB_L_table = new Array()
 var WFTB_L_cpt = 0;

 for (WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_result.snapshotLength; WFTB_L_cpt++) WFTB_L_table.push(WFTB_L_result.snapshotItem(WFTB_L_cpt));
 WFTB_Log('WFTB_xpath', 4, 'End');
 return WFTB_L_table;
}

function WFTB_single_xpath(WFTB_L_query, WFTB_L_element) {
 WFTB_Log('WFTB_single_xpath', 4, 'Start');
 var WFTB_L_elmFirstResult = document.evaluate(WFTB_L_query, WFTB_L_element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
 WFTB_Log('WFTB_single_xpath', 4, 'End');
 return WFTB_L_elmFirstResult;
}

//============================== Waze Userprofil ==========================//
function WFTB_AddUserProfil() {
 WFTB_Log('WFTB_AddUserProfil', 4, 'Start');

 // Insert UserProfil
 var WFTB_L_LST_A = document.getElementsByTagName('a');
 var WFTB_L_LST_UserA = Array();
 var WFTB_L_cpt = 0;
 var WFTB_L_patt_vp = new RegExp('mode=viewprofile');
 var WFTB_L_patt_nologin = new RegExp('waze\.com\/');
 var WFTB_L_LinkList = Array();
 var WFTB_L_Profil;

 if(WFTB_L_patt_vp.test(window.location.href)) {
  WFTB_L_LinkList = WFTB_xpath('//*[@id="viewprofile"]/div[1]/div/dl/dd[1]/span', document);
  WFTB_Log('WFTB_AddUserProfil', 5, 'xpath linklist ' + WFTB_L_LinkList.length);

  // Add
  if(WFTB_L_LinkList.length == 1) {
   WFTB_Log('WFTB_AddUserProfil', 5, 'xpath pseudo ' + WFTB_L_LinkList[0].innerHTML);
   WFTB_insertAfter(WFTB_Profil(WFTB_L_LinkList[0].innerHTML, WFTB_L_LinkList[0].style.color, 'fr'), WFTB_L_LinkList[0]);
  }
 } else {
  // Extract Userprofil login
  WFTB_Log('WFTB_AddUserProfil', 5, 'url de la page ' + window.location.href);

  if(WFTB_L_LST_A.length > 0) {
   for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_LST_A.length; WFTB_L_cpt++) {
    try {
     if(!WFTB_L_patt_nologin.test(WFTB_L_LST_A[WFTB_L_cpt].innerHTML))if(WFTB_L_patt_vp.test(WFTB_L_LST_A[WFTB_L_cpt].href)) WFTB_L_LST_UserA.push(WFTB_L_LST_A[WFTB_L_cpt]);
    }
    catch(e) {
     WFTB_Log('WFTB_AddUserProfil', 2, 'Vive les tag A sans href');
    }
   }
  }
  // Add Editor Userprofil
  if(WFTB_L_LST_UserA.length > 0) {
   for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_LST_UserA.length; WFTB_L_cpt++) {
   WFTB_L_Profil = WFTB_Profil(WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML, WFTB_L_LST_UserA[WFTB_L_cpt].style.color, 'fr');
   WFTB_Log('WFTB_AddUserProfil', 2, 'href=' + WFTB_L_Profil.href + ' et InnerHTML=' + WFTB_L_Profil.innerHTML + ' WFTB_L_Profil ' + WFTB_L_LST_UserA[WFTB_L_cpt]);
   WFTB_insertAfter(WFTB_L_Profil, WFTB_L_LST_UserA[WFTB_L_cpt]);
   }
  }
 }
 WFTB_Log('WFTB_AddUserProfil', 4, 'End');
}

//============================== Create Editor Profil Link ==========================//
function WFTB_Profil(WFTB_L_UserName, WFTB_L_UserColor, WFTB_L_Lang) {
 WFTB_Log('WFTB_Profil', 4, 'Start');
 var WFTB_L_ProfilLink = document.createElement('a');

 //
 if(WFTB_L_Lang !== undefined) var FTB_L_Lang = '';
 WFTB_L_ProfilLink.href = WFTB_URL_protocol + WFTB_URL_Base + '/' + WFTB_L_Lang + WFTB_URL_UserProfil_URI + WFTB_L_UserName;

 //
 if(WFTB_targetblank) WFTB_L_ProfilLink.setAttribute('target', '_blank');
 WFTB_L_ProfilLink.setAttribute('title', 'Voir le profil éditeur de ' + WFTB_L_UserName);
 WFTB_L_ProfilLink.className = 'username-coloured';
 WFTB_L_ProfilLink.style.marginLeft = '5px';
 WFTB_L_ProfilLink.style.fontSize = '0.7em';
 if(WFTB_L_UserColor !== undefined) WFTB_L_ProfilLink.style.color = WFTB_L_UserColor;
 WFTB_L_ProfilLink.innerHTML = '(' + WFTB_button_editorprofil + ')';
 WFTB_Log('WFTB_updatePerma', 5, 'UserProfil link Create for ' + WFTB_L_UserName);

 WFTB_Log('WFTB_Profil', 4, 'End');
 return WFTB_L_ProfilLink;
}

//============================== Is Beta Editor =========================//
function WFTB_is_beta_editor() {
 WFTB_Log('WFTB_is_beta_editor', 4, 'Start');
 var WFTB_L_cpt = 0;
 var WFTB_L_usergroup_memberships;

 //
 if(!WFTB_beta_editor_verify) {
  GM_xmlhttpRequest({
   method: "GET",
   url: WFTB_URL_usergroups,
   headers: {
    "User-Agent": "Mozilla/5.0",
   },
   onload: function(responseDetails) {
    WFTB_Log('WFTB_is_beta_editor', 5, 'Load Userlist page');
    var WFTB_usergroups_pg = document.createElement('div');
    WFTB_usergroups_pg.innerHTML = responseDetails.responseText;
    WFTB_L_usergroup_memberships = WFTB_xpath(WFTB_search_usergroups_memberships_groups[0], WFTB_usergroups_pg);
    WFTB_Log('WFTB_is_beta_editor', 5, 'nb occurence ' + WFTB_L_usergroup_memberships.length);

    //
    for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_usergroup_memberships.length && !WFTB_beta_editor; WFTB_L_cpt++) {
     WFTB_beta_editor = WFTB_L_usergroup_memberships[WFTB_L_cpt].getElementsByTagName('a')[0].text == 'WME beta testers';
     WFTB_Log('WFTB_is_beta_editor', 5, 'occurence ' + WFTB_L_cpt);
    }

    //
    if(WFTB_xpath(WFTB_search_usergroups_if_leadersheep, WFTB_usergroups_pg)[0].innerHTML == 'Leaderships') {
     WFTB_Log('WFTB_is_beta_editor', 5, 'You are on Group LeaderShips');
     WFTB_L_usergroup_memberships = WFTB_xpath(WFTB_search_usergroups_memberships_groups[1], WFTB_usergroups_pg);
     WFTB_Log('WFTB_is_beta_editor', 5, 'NB occurence ' + WFTB_L_usergroup_memberships.length);

     //
     for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_usergroup_memberships.length && !WFTB_beta_editor; WFTB_L_cpt++) {
      WFTB_beta_editor = WFTB_L_usergroup_memberships[WFTB_L_cpt].getElementsByTagName('a')[0].text == 'WME beta testers';
      WFTB_Log('WFTB_is_beta_editor', 5, 'Occurence ' + WFTB_L_cpt);
     }
    }
    WFTB_Log('WFTB_is_beta_editor', 5, ' WFTB_beta_editor');
    WFTB_updatePerma();
   }
  });
 }
 else WFTB_updatePerma();

 WFTB_Log('WFTB_is_beta_editor', 4, 'End');
}

//=======================================================================//