// ==UserScript==
// @name            WF ToolBox Alpha
// @namespace       WFTB_ns
// @version         0.0.3.10
// @description:en  When prema is present to offer his version for beta + classic editor and add the profile editor waze
// @description:fr  Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze
// @author          exolium
// @match           http://*.waze.com/forum/*
// @match           https://*.waze.com/forum/*
// @exclude         http://*.waze.com/*user/*
// @exclude         https://*.waze.com/*user/*
// @copyright       2015-2016 exolium
// @licence         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @description When prema is present to offer his version for beta + classic editor and add the profile editor waze
// @downloadURL https://update.greasyfork.org/scripts/15896/WF%20ToolBox%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/15896/WF%20ToolBox%20Alpha.meta.js
// ==/UserScript==

/* **************************************************************************** *
 * Info version : Alpha release      : 0.0.1.1, 0.1.1.1, 1.1.2.1,...
 * Info version : Beta release       :  0.0.1 ,  0.2.1 ,  1.1.1 ,...
 * Info version : Production release :   1.0  ,   1.1  ,   2.0  ,...
 * **************************************************************************** *
 * Thanks to beta tester and script developer who bring innovative ideas to me
 * myriades, sebiseba, d2, laurenthembord,....
 * **************************************************************************** */

/* **************************************************************************** *
 * Release note :
 * - 0.0.3 Fixed chrome crash + fixed if link and no pseudo (patch before final release)
 * - 0.0.2 update Waze Editor Profil, add settings manager (not functional but the interface opens)
 * - 0.0.1 Start with restaure another script, add Waze Editor Profil
 */

//============================== Options ================================//
var WFTB_Log_level = 5; // 0 = no log / 1 = error / 2 = warn / 3 = min log / 4 = Medium Log / 5 = high detail Log
var WFTB_targetblank = true;
var WFTB_use_layer = true;
var WFTB_button_beta = 'Beta';
var WFTB_button_prod = 'Prod';
var WFTB_button_editorprofil = 'Editor Profil';

//============================== Var ====================================//
var WFTB_beta_editor_verify = false;
var WFTB_beta_editor = false;
var WFTB_profil = [];
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

//============================== WFTB_Initialise =======================//
function WFTB_Initialise() {
 WFTB_Log('WFTB_Initialise', 4, 'Start');

 /**/
 WFTB_profil = JSON.parse(localStorage.user);

 if(typeof localStorage.WFTB_data === 'undefined') {
  localStorage.setItem('WFTB_data', '{"app_name":"' + GM_info.script.name + '",'
                                   + '"version":"' + GM_info.script.version + '",'
                                   + '"lang":"' + navigator.language + '"}');

  WFTB_Log('WFTB_Initialise', 5, 'Initialise localstorage WFTB_data');
 }
 else WFTB_Log('WFTB_Initialise', 5, 'localstorage WFTB_data already exist... Restaure Settings');
 WFTB_Log('WFTB_Initialise', 5, 'WFTB_data.length=' + localStorage.WFTB_data.length);


 /**/
 WFTB_Settings = JSON.parse(localStorage.WFTB_data);
 WFTB_checkupdate();

 WFTB_Log('WFTB_Initialise', 5, 'WFTB_data.length=' + typeof localStorage.WFTB_data);
 WFTB_Log('WFTB_Initialise', 5, 'WFTB_data app_name ' + WFTB_Settings.app_name);
 WFTB_Log('WFTB_Initialise', 5, 'lang localstorage ' + WFTB_Settings.lang);
 WFTB_Log('WFTB_Initialise', 5, 'lang nav ' + navigator.language);

 if(WFTB_profil.login)WFTB_Log('WFTB_Initialise', 5, 'username : ' + WFTB_profil.message);
 else WFTB_Log('WFTB_Initialise', 'warn', 'username : Anonymous');

 //
 WFTB_is_beta_editor();
 WFTB_AddUserProfil();
 WFTB_settings();

 WFTB_Log('WFTB_Initialise', 4, 'End');
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
//============================== WFTB_updatePerma ======================//
function WFTB_updatePerma() {
 WFTB_Log('WFTB_updatePerma', 4, 'Start');

 var WFTB_L_postlinkList = document.getElementsByClassName("postlink");
 var WFTB_L_WME_links = [];
 var WFTB_L_href = '';
 var WFTB_L_text = '';
 var WFTB_L_newURL = '';
 var WFTB_L_title = '';
 var WFTB_L_patt_editor = new RegExp('\/editor\/');
 var WFTB_L_patt_user = new RegExp('\/user\/editor\/');
 var WFTB_L_cpt = 0;
 var WFTB_L_patt_wazeurl = new RegExp('http(|s)\:\/\/((editor-|)beta|www)\.waze\.com');


 // Extraire les permas
 for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_postlinkList.length; WFTB_L_cpt++) {
  WFTB_L_href = WFTB_L_postlinkList[WFTB_L_cpt].getAttribute('href');
  //WFTB_L_patt_editor = new RegExp('\/editor\/');
  //WFTB_L_patt_user = new RegExp('\/user\/editor\/');
  if(WFTB_targetblank) WFTB_L_postlinkList[WFTB_L_cpt].setAttribute('target', '_blank');
  if(!WFTB_L_patt_editor.test(WFTB_L_href) || WFTB_L_patt_user.test(WFTB_L_href) || !WFTB_L_patt_wazeurl.test(WFTB_L_href) ) continue;
  WFTB_L_WME_links.push(WFTB_L_postlinkList[WFTB_L_cpt]);
  WFTB_Log('WFTB_updatePerma', 5, 'Extract Perma');
  WFTB_L_postlinkList[WFTB_L_cpt].href = WFTB_L_postlinkList[WFTB_L_cpt].href.replace('https\:\/\/editor-beta.waze.com', 'https\:\/\/beta.waze.com');
  WFTB_L_postlinkList[WFTB_L_cpt].innerHTML = WFTB_L_postlinkList[WFTB_L_cpt].innerHTML.replace('https\:\/\/editor-beta.waze.com', 'https\:\/\/beta.waze.com');
 }

 // Traitrer les permas
 if(WFTB_beta_editor) for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_WME_links.length; WFTB_L_cpt++) {
  WFTB_L_href = WFTB_L_WME_links[WFTB_L_cpt].getAttribute('href');
  WFTB_L_patt_editor = new RegExp('www');
  WFTB_Log('WFTB_updatePerma', 5, 'Convert URL : ' + WFTB_L_WME_links[WFTB_L_cpt]);

  // Préparer le permas
  if(WFTB_L_patt_editor.test(WFTB_L_href)) {
   WFTB_L_text = WFTB_button_beta;
   WFTB_L_title = 'Ouvrir dans l\'éditeur beta';
   WFTB_L_newURL = WFTB_L_href.replace(WFTB_L_patt_editor, 'beta');
   WFTB_Log('WFTB_updatePerma', 5, 'Convert to beta : ' + WFTB_L_newURL);
  } else {
   WFTB_L_text = WFTB_button_prod;
   WFTB_L_title = 'Ouvrir dans l\'éditeur public';
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

 //var ret = document.body.innerHTML.replace('https\:\/\/editor-beta.waze.com', 'https\:\/\/beta.waze.com');
 //document.body.innerHTML = ret;
 //WFTB_Log('WFTB_updatePerma', 4, ret );

 WFTB_Log('WFTB_updatePerma', 4, 'End');
}

//============================== Is Beta Editor =========================//
function WFTB_is_beta_editor() {
 WFTB_Log('WFTB_is_beta_editor', 4, 'Start');
 var WFTB_L_cpt = 0;
 var WFTB_L_usergroup_memberships;

 //
 if(!WFTB_beta_editor_verify)
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
 else WFTB_updatePerma();

 WFTB_Log('WFTB_is_beta_editor', 4, 'End');
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

  if(WFTB_L_LST_A.length > 0) for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_LST_A.length; WFTB_L_cpt++) {
   try {
    if(!WFTB_L_patt_nologin.test(WFTB_L_LST_A[WFTB_L_cpt].innerHTML))if(WFTB_L_patt_vp.test(WFTB_L_LST_A[WFTB_L_cpt].href)) WFTB_L_LST_UserA.push(WFTB_L_LST_A[WFTB_L_cpt]);
   }
   catch(e) {
    WFTB_Log('WFTB_AddUserProfil', 2, 'Vive les tag A sans href');
   }
  }

  // Add Editor Userprofil
  if(WFTB_L_LST_UserA.length > 0) for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_LST_UserA.length; WFTB_L_cpt++) {
   WFTB_L_Profil = WFTB_Profil(WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML, WFTB_L_LST_UserA[WFTB_L_cpt].style.color, 'fr');
   WFTB_Log('WFTB_AddUserProfil', 2, 'href=' + WFTB_L_Profil.href + ' et InnerHTML=' + WFTB_L_Profil.innerHTML + ' WFTB_L_Profil ' + WFTB_L_LST_UserA[WFTB_L_cpt]);
   WFTB_insertAfter(WFTB_L_Profil, WFTB_L_LST_UserA[WFTB_L_cpt]);
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

//============================== Popup Settings Manager ========================//
function WFTB_settings() {
 WFTB_Log('WFTB_Settings', 4, 'Start');

 var WFTB_L_SettingsName = 'WF Toolbox Settings';
 var WFTB_L_text = WFTB_Settings.app_name + ' ' + WFTB_Settings.version + ' - Settings Manager';
 var WFTB_L_title = WFTB_L_text + '\nFirefox : [Alt] [Shift] + AccessKey\nChrome : [Alt] + AccessKey\nAccessKey :\n - W : Open Settings Manager \n - Q : Close Settings Manager ';
 var WFTB_L_sbm = document.createElement('div');
 var WFTB_L_sbm_title = document.createElement('div');
 var WFTB_L_sbm_content = document.createElement('div');
 var WFTB_L_sbm_footer = document.createElement('div');
 var WFTB_L_sbm_footer_a_close = document.createElement('a');
 var WFTB_L_sbm_open_link_tab = document.createElement('li');
 var WFTB_L_sbm_open_link_tab_a = document.createElement('a');
 var WFTB_L_sbm_open_link_tab_a_span = document.createElement('span');
 var WFTB_L_sbm_open_link_listlink = document.createElement('a');
 var WFTB_L_sbm_style = '';
 var WFTB_L_sbm_height = '80%';
 var WFTB_L_sbm_width = '80%';
 var WFTB_L_LinkList = '';

 //
 WFTB_L_sbm.id = 'wftb_settings_box';
 WFTB_L_sbm.setAttribute('style','border: 2px solid #333;');
 WFTB_L_sbm.style.display = 'none';
 WFTB_L_sbm.style.position = 'absolute';
 if(window.innerWidth > 960) WFTB_L_sbm.style.left = (window.innerWidth / 2 - 430) + 'px';
 else WFTB_L_sbm.style.left = '50px';
 WFTB_L_sbm.style.top = '150px';
 WFTB_L_sbm.style.height = '420px';
 WFTB_L_sbm.style.width = '860px';
 WFTB_L_sbm.style.textAlign = 'center';
 WFTB_L_sbm.style.backgroundColor = '#FFFFFF';

 //
 WFTB_L_sbm_title.id = 'wftb_settings_title';
 WFTB_L_sbm_title.setAttribute('style','height: 20px; background-color: #0177b3; border-bottom: 1px solid #666; vertical-align: middle; font-weight: bold; font-size: 12px; line-height: 1.7;');
 WFTB_L_sbm_title.style.color = '#ffffff';
 WFTB_L_sbm_title.innerHTML = WFTB_L_text;

 //
 WFTB_L_sbm_content.id = 'wftb_settings_box_content';
 WFTB_L_sbm_content.style.height = '378px';
 WFTB_L_sbm_content.style.backgroundColor = '#e1ebf2';
 WFTB_L_sbm_content.appendChild(document.createTextNode('Comming Sooooon'));
 WFTB_L_sbm_content.appendChild(document.createElement('br'));
 WFTB_L_sbm_content.appendChild(document.createTextNode('Width : ' + window.innerWidth));
 WFTB_L_sbm_content.appendChild(document.createElement('br'));
 WFTB_L_sbm_content.appendChild(document.createTextNode('Height : ' + window.innerHeight));

 //
 WFTB_L_sbm_footer.id = 'wftb_settings_box_footer';
 WFTB_L_sbm_footer.setAttribute('style','height: 20px; border-top: 1px solid #666; font-weight: bold; font-size: 12px; line-height: 1.7;');
 WFTB_L_sbm_footer.style.height = '20px';
 WFTB_L_sbm_footer.style.backgroundColor = 'rgb(126, 167, 187)';

 //
 WFTB_L_sbm_footer_a_close.id='wftb_settings_close';
 WFTB_L_sbm_footer_a_close.setAttribute('accesskey','q');
 WFTB_L_sbm_footer_a_close.href = 'javascript:void(0)';
 WFTB_L_sbm_footer_a_close.title = WFTB_L_title;
 WFTB_L_sbm_footer_a_close.innerHTML = 'Fermer';

 //
 WFTB_L_sbm_footer.appendChild(WFTB_L_sbm_footer_a_close);

 //
 WFTB_L_sbm_open_link_listlink.id = 'wftb_settings_open_ll';
 WFTB_L_sbm_open_link_listlink.href = 'javascript:void(0)';
 WFTB_L_sbm_open_link_listlink.setAttribute('accesskey','w');
 WFTB_L_sbm_open_link_listlink.title = WFTB_L_title;
 WFTB_L_sbm_open_link_listlink.innerHTML = WFTB_L_SettingsName;

 //
 WFTB_L_sbm.appendChild(WFTB_L_sbm_title);
 WFTB_L_sbm.appendChild(WFTB_L_sbm_content);
 WFTB_L_sbm.appendChild(WFTB_L_sbm_footer);

 //
 WFTB_Log('WFTB_Settings', 5, '************************');
 WFTB_Log('WFTB_Settings', 5, document.getElementsByTagName('style')[0].innerHTML);
 WFTB_Log('WFTB_Settings', 5, '************************');
 document.getElementsByTagName('style')[0].innerHTML = document.getElementsByTagName('style')[0].innerHTML + WFTB_L_sbm_style;
 WFTB_Log('WFTB_Settings', 5, document.getElementsByTagName('style')[0].innerHTML);
 WFTB_Log('WFTB_Settings', 5, '************************');

 //
 document.body.appendChild(WFTB_L_sbm);

 //
 WFTB_L_sbm_open_link_tab_a.id = 'wftb_settings_open_lt';
 WFTB_L_sbm_open_link_tab_a.title = WFTB_L_title;
 WFTB_L_sbm_open_link_tab_a.href = 'javascript:void(0)';

 //
 WFTB_L_sbm_open_link_tab_a_span.innerHTML = WFTB_L_SettingsName;

 //
 WFTB_L_sbm_open_link_tab_a.appendChild(WFTB_L_sbm_open_link_tab_a_span);
 WFTB_L_sbm_open_link_tab.appendChild(WFTB_L_sbm_open_link_tab_a);

 // Add "WF Toolbox Settings" link on tab to User Control Panel
 WFTB_Log('WFTB_Settings', 5, document.getElementById('tabs'));
 if(document.getElementById('tabs') !== null) document.getElementById('tabs').getElementsByTagName('ul')[0].appendChild(WFTB_L_sbm_open_link_tab);

 // Search ListLink
 WFTB_L_LinkList = WFTB_xpath(WFTB_search_linklist, document);
 WFTB_Log('WFTB_Settings', 5, 'xpath linklist ' + WFTB_L_LinkList.length);

 // Add "WF Toolbox Settings" link on linklist
 if(WFTB_L_LinkList.length == 1) {
  WFTB_L_LinkList[0].appendChild(document.createTextNode(" • "));
  WFTB_L_LinkList[0].appendChild(WFTB_L_sbm_open_link_listlink);
 }

 // Add event onclic to "Close" link
  document.getElementById('wftb_settings_close').onclick = function() {
  document.getElementById('wftb_settings_box').style.display = 'none';
 };

 // Add event onclic to "WF Toolbox Settings" link on tab to User Control Panel
 if(document.getElementById('tabs') !== null) document.getElementById('wftb_settings_open_lt').onclick = function() {
  document.getElementById('wftb_settings_box').style.display = 'block';
 };

 // Add event onclic to "WF Toolbox Settings" link on Link List
 if(WFTB_L_LinkList.length == 1) document.getElementById('wftb_settings_open_ll').onclick = function() {
  document.getElementById('wftb_settings_box').style.display = 'block';
 };

 unsafeWindow.onkeyup = function(WFTB_L_evt) {
  WFTB_L_evt = WFTB_L_evt || window.event;


  //
  if (WFTB_L_evt.keyCode == 27) {
   document.getElementById('wftb_settings_box').style.display = 'none';
   WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeyup : ' + WFTB_L_evt.keyCode + ' (Escape / Echap)');
  } else {
   WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeyup : ' + WFTB_L_evt.keyCode);
  }
 };

 unsafeWindow.onkeypress = function(WFTB_L_evt) {
  WFTB_L_evt = WFTB_L_evt || window.event;


  //
  if (WFTB_L_evt.keyCode == 27) {
   document.getElementById('wftb_settings_box').style.display = 'none';
   WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeypress : ' + WFTB_L_evt.keyCode + ' (Escape / Echap)');
  } else {
   WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeypress : ' + WFTB_L_evt.keyCode);
  }
 };

 unsafeWindow.onresize = function() {
  WFTB_Log('WFTB_Settings', 5, 'onresize even');
  WFTB_settings_update();
 };

 WFTB_Log('WFTB_Settings', 4, 'End');
}
//============================== WFTB_settings_update ==========================//
function WFTB_settings_update() {
 WFTB_Log('WFTB_settings_update', 4, 'Start');

 WFTB_L_sbm = document.getElementById('wftb_settings_box');
 if(WFTB_L_sbm === null) return;

 if(window.innerWidth > 960) WFTB_L_sbm.style.left = (window.innerWidth / 2 - 430) + 'px';
 else WFTB_L_sbm.style.left = '50px';

 WFTB_Log('WFTB_settings_update', 4, 'End');
}

//============================== Library : log ==========================//
function WFTB_Log(WFTB_L_function, WFTB_L_type, WFTB_L_text) {
 WFTB_L_text = 'Waze ' +  GM_info.script.name
        + ' ' + GM_info.script.version
        + ' ' + WFTB_L_function
        + ' : ' + WFTB_L_text;

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

//============================== Start WFTB ============================//
WFTB_Bootstrap();
//============================== End ====================================//