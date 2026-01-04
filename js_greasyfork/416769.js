// ==UserScript==
// @name            WF ToolBox Lib Alpha
// @namespace       WFTB_ns
// @version         0.1.2.13
// @description  When perma is present to offer his version for beta + classic editor and add the profile editor waze and much more
// @description:fr  Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze et bien plus encore
// @author          exolium
// @copyright       2015-2022 exolium
// @licence         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @description When perma is present to offer his version for beta + classic editor and add the profile editor waze
// ==/UserScript==

//============================== Options ================================//
var WFTB_Log_level = 5; // 0 = no log / 1 = error / 2 = warn / 3 = min log / 4 = Medium Log / 5 = high detail Log
var WFTB_targetblank = true;
var WFTB_use_layer = true;
var WFTB_button_beta = 'Beta';
var WFTB_button_prod = 'Prod';
var WFTB_button_editorprofil = 'Editor Profil α';
var WFTB_lang = WFTB_lang_en;

//============================== Var ====================================//
var WFTB_beta_editor_verify = false;
var WFTB_beta_editor = false;
var WFTB_profil = Array();
var WFTB_Settings = {};
var WFTB_G_EditorsInformations = Array();


//============================== URL ====================================//
var WFTB_URL_protocol = window.location.protocol + '//';
var WFTB_URL_Base = window.location.hostname;
var WFTB_URL_usergroups = WFTB_URL_protocol + WFTB_URL_Base + '/forum/memberlist.php?mode=group&g=10';
var WFTB_URL_UserProfil_URI = '/user/editor/';

//============================== Recherche ==============================//
var WFTB_search_base_url = '//a[contains(@href,\'editor-beta.waze.com\') or (@href,\'beta.waze.com\') or contains(@href,\'www.waze.com\') or contains(@href,\'waze.com\')][contains(@href,\'editor\') OR contains(@href,\'editor)]';
var WFTB_search_perma_layer = 'layers=w+';
var WFTB_search_usergroups_memberships = '//*[@id="ucp"]/div[1]/div/ul[2]';
var WFTB_search_usergroups_memberships_groups = ['//*/div/table/tbody/tr/td[1]/a[1]','//*[@id="memberlist sort-table"]/tbody/tr/td[1]/a[1]'];
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

//============================== WFTB_checkupdate ======================//
function WFTB_checkupdate() {
 WFTB_Log('WFTB_checkupdate', 4, 'End');

 WFTB_Log('WFTB_checkupdate', 5, 'WFTB_Settings.version=' + WFTB_Settings.version);
 WFTB_Log('WFTB_checkupdate', 5, 'GM_info.script.version=' + GM_info.script.version);

 if(WFTB_Settings.version != GM_info.script.version) {
  WFTB_Settings.version = GM_info.script.version;
  localStorage.WFTB_settings = JSON.stringify(WFTB_Settings);
  WFTB_Log('WFTB_checkupdate', 5, JSON.stringify(WFTB_Settings));
 }

 if(WFTB_Settings.app_name != GM_info.script.name) {
  WFTB_Settings.app_name = GM_info.script.name;
  localStorage.WFTB_settings = JSON.stringify(WFTB_Settings);
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
 var WFTB_L_table = new Array();
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
 WFTB_Log('WFTB_Profil', 5, 'UserProfil link Create for ' + WFTB_L_UserName);

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

    // test si est beta tester
    /*for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_usergroup_memberships.length && !WFTB_beta_editor; WFTB_L_cpt++) {
     WFTB_beta_editor = WFTB_L_usergroup_memberships[WFTB_L_cpt].getElementsByTagName('a')[0] == 'WME beta testers';
     WFTB_Log('WFTB_is_beta_editor', 5, 'occurence ' + WFTB_L_cpt + ' texte ' + WFTB_L_usergroup_memberships[WFTB_L_cpt].getElementsByTagName('a')[0]);
    }

    // test si est leader du groupe
    if(WFTB_xpath(WFTB_search_usergroups_if_leadersheep, WFTB_usergroups_pg)[0].innerHTML == 'Leaderships') {
     WFTB_Log('WFTB_is_beta_editor', 5, 'You are on Group LeaderShips');
     WFTB_L_usergroup_memberships = WFTB_xpath(WFTB_search_usergroups_memberships_groups[1], WFTB_usergroups_pg);
     WFTB_Log('WFTB_is_beta_editor', 5, 'NB occurence ' + WFTB_L_usergroup_memberships.length);

     //
     for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_usergroup_memberships.length && !WFTB_beta_editor; WFTB_L_cpt++) {
      WFTB_beta_editor = WFTB_L_usergroup_memberships[WFTB_L_cpt].getElementsByTagName('a')[0].text == 'WME beta testers';
      WFTB_Log('WFTB_is_beta_editor', 5, 'Occurence ' + WFTB_L_cpt);
     }
    }*/
    WFTB_Log('WFTB_is_beta_editor', 5, ' WFTB_beta_editor');
    WFTB_updatePerma();
   }
  });
 }
 else WFTB_updatePerma();

 WFTB_Log('WFTB_is_beta_editor', 4, 'End');
}

//============================== WFTB_updatePerma ======================//
function WFTB_updatePerma() {
 WFTB_Log('WFTB_updatePerma', 4, 'Start');

 var WFTB_L_postlinkList = document.getElementsByClassName("postlink");
 var WFTB_L_WME_links = [];
 var WFTB_L_href = '';
 var WFTB_L_text = '';
 var WFTB_L_newURL = '';
 var WFTB_L_title = '';
 var WFTB_L_cpt = 0;
 var WFTB_L_patt_editor = new RegExp('\/editor\/?');
 var WFTB_L_patt_user = new RegExp('\/user\/editor\/');
 var WFTB_L_patt_wazeurl = new RegExp('http(|s)\:\/\/((editor-|)beta|www)\.waze\.com');

 // Extraire les permas
 for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_postlinkList.length; WFTB_L_cpt++) {
  WFTB_Log('WFTB_updatePerma', 5, 'Perma : '+WFTB_L_postlinkList[WFTB_L_cpt]);

  // modification http(s)://waze.com en http(s)://www.waze.com
  WFTB_L_postlinkList[WFTB_L_cpt].href = WFTB_L_postlinkList[WFTB_L_cpt].href.replace('https\:\/\/waze.com', 'https\:\/\/www.waze.com');
  WFTB_L_postlinkList[WFTB_L_cpt].innerHTML = WFTB_L_postlinkList[WFTB_L_cpt].innerHTML.replace('https\:\/\/waze.com', 'https\:\/\/www.waze.com');
  WFTB_L_href = WFTB_L_postlinkList[WFTB_L_cpt].getAttribute('href');

  // suite
  if(WFTB_targetblank) WFTB_L_postlinkList[WFTB_L_cpt].setAttribute('target', '_blank');
  if(!WFTB_L_patt_editor.test(WFTB_L_href) || WFTB_L_patt_user.test(WFTB_L_href) || !WFTB_L_patt_wazeurl.test(WFTB_L_href) ) continue;
  WFTB_L_WME_links.push(WFTB_L_postlinkList[WFTB_L_cpt]);
  WFTB_Log('WFTB_updatePerma', 5, 'Extract Perma');
  WFTB_L_postlinkList[WFTB_L_cpt].href = WFTB_L_postlinkList[WFTB_L_cpt].href.replace('https\:\/\/editor-beta.waze.com', 'https\:\/\/beta.waze.com');
  WFTB_L_postlinkList[WFTB_L_cpt].innerHTML = WFTB_L_postlinkList[WFTB_L_cpt].innerHTML.replace('https\:\/\/editor-beta.waze.com', 'https\:\/\/beta.waze.com');
 }

 // Traitrer les permas
 //if(WFTB_beta_editor) {
   for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_WME_links.length; WFTB_L_cpt++) {
   WFTB_L_href = WFTB_L_WME_links[WFTB_L_cpt].getAttribute('href');
   WFTB_L_patt_editor = new RegExp('www');
   WFTB_Log('WFTB_updatePerma', 5, 'Convert URL : ' + WFTB_L_WME_links[WFTB_L_cpt]);

   // Préparer le permas
   if(WFTB_L_patt_editor.test(WFTB_L_href)) {
    WFTB_L_text = WFTB_button_beta;
    WFTB_L_title = WFTB_label_OiBE[WFTB_lang];
    WFTB_L_newURL = WFTB_L_href.replace(WFTB_L_patt_editor, 'beta');
    WFTB_Log('WFTB_updatePerma', 5, 'Convert to beta : ' + WFTB_L_newURL);
   } else {
    WFTB_L_text = WFTB_button_prod;
    WFTB_L_title = WFTB_label_OiPE[WFTB_lang];
    WFTB_L_newURL = WFTB_L_href.replace(/beta/, 'www');
    WFTB_Log('WFTB_updatePerma', 5, 'Convert to prod : ' + WFTB_L_newURL);
   }

   // Installer le permas
   var WFTB_htmlA = document.createElement('a');
   WFTB_htmlA.href = WFTB_L_newURL;
   if(WFTB_targetblank) WFTB_htmlA.setAttribute('target', '_blank');
   WFTB_htmlA.setAttribute('title', WFTB_L_title);
   WFTB_htmlA.className = 'postlink';
   WFTB_htmlA.style.marginLeft = '5px';
   WFTB_htmlA.innerHTML = '(' + WFTB_L_text + ')';
   WFTB_Log('WFTB_updatePerma', 5, 'Add Perma');
   WFTB_insertAfter(WFTB_htmlA, WFTB_L_WME_links[WFTB_L_cpt]);
   WFTB_insertAfter(document.createTextNode(" "), WFTB_L_WME_links[WFTB_L_cpt]);
  }
 //}

 //WFTB_Log('WFTB_updatePerma', 4, ret );

 WFTB_Log('WFTB_updatePerma', 4, 'End');
}

//=======================================================================//