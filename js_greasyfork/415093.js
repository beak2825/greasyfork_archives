// ==UserScript==
// @name            WF ToolBox Beta
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYBBicLUdqBwAAAA1lJREFUWMPFl0tIVFEYx39nug46qE1DYoWU1KJAKZHEoEVRLhwXQUFGKG6CHpsy7KlEi/BJA7myxyKoGSKDAhfpwoIWQWJgQzNQQTZa9DJKKjTG0dPijDo6984cG6UPLsy9c875/8/3/oSUEl15FITuF8iBIQiNwOiY+u50QP5KKMoH9xZEWaH2kQgdAie9yPZukBHASLI4uqa2HBoPIBz2FAg0dyHrfRqgVjIBTdVwfg9iwQQKzyKDw4CN1GQKCtZC/yVEup04JnEEJibBdRj5+w+LKpnpEGpHuDLnkogjkHVo8cFjSXztQGTE+IVtvtqXChzg9x8oucCcG9tiHS44nCLCpApJItZLgsMKK45AvTd1h3MXw48bcO0IELZYZIN6H4yFYwicvI0kzWKDVDfTeVY51ZbDu8BXm4CEAQ13lRaElBJbFebBOAmXayDPBToJc0MulKyffX/wHPa1gdnlBDDlQxi9AesM5y6Guop/N8nerVC9E7xPTRQbgd4AGD1+pFWmexSEgRCsWaEHmGGH7IzZ99A36OyzNkOPH2kMDFkfGI5A8ZmojTWkugxuH1O/33yCTacgkeUGhsAIjSQ5Nc3chqYOHk1xL9/D5rNgXQGiGhoBY7qkLobcegLjYbj3LDk4qHKuH/kS9peq4mKtArjXpwc+s8Xp0AP3t0DncajZsXgaczrAyM+Bwa+JF77ywMbV0eoqAd16sSyx/+TngKjzSul5aL7AbsBrj2q3puXnuLKzjnz8Adsuqmgyk7oKMMq3IDxd5rmgsnQuOKg4j431RJK7HHYXQLffvHUrL0IkTsUTcP807C2Z/dQ/CG+/aDSbAj58h1O3oqawSsUAJ8rhSo95DtjXBt5aqNquPnX0ws3Hui5uDg5wwh1TDZsOICxruB2qr8D1KOjn0eihOo+w7pwbK9W/My1ZSxfy/J0EPUEEnNkw+sv6VrpNavNBOLdnHoGZTvgDSyoFeRBondXNHALjE5B7FPnrfzWl6Wnwrh2Rlb404KF2NRuYNqXToeHKhC9XEYV5SfL+QgaTPHXz+TMBZi4ngIw0eNmKaD6YuMNNKhHlcIFWpXbxL8PpWBgaOhc2nApD5ZaUh9O4Fi0A3X7kiyF4N388z4GideAuQpQV6CvpLyjrNaUqOdRiAAAAAElFTkSuQmCC
// @namespace       WFTB_ns
// @version         0.2.6
// @description  When perma is present to offer his version for beta + classic editor and add the profile editor waze and much more
// @description:fr  Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze et bien plus encore
// @author          exolium
// @match           http://*.waze.com/nex-forum/*
// @match           https://*.waze.com/new-forum/*
// @match           http://*.waze.com/forum/*
// @match           https://*.waze.com/forum/*
// @match           http://waze.com/nex-forum/*
// @match           https://waze.com/new-forum/*
// @match           http://waze.com/forum/*
// @match           https://waze.com/forum/*
// @exclude         http://*.waze.com/*user/*
// @exclude         https://*.waze.com/*user/*
// @exclude         http://waze.com/*user/*
// @exclude         https://waze.com/*user/*
// @exclude         https://www.waze.com/forum/ucp.php?i=164
// @require         https://greasyfork.org/scripts/416773-wf-toolbox-lib-i18n-label/code/WF%20ToolBox%20Lib%20i18n%20Label.js
// @require https://greasyfork.org/scripts/416771-wf-toolbox-lib-beta/code/WF%20ToolBox%20Lib%20Beta.js
// @copyright       2015-2021 exolium
// @licence         GNU GPL v2
// @license         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415093/WF%20ToolBox%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/415093/WF%20ToolBox%20Beta.meta.js
// ==/UserScript==

/* **************************************************************************** *
 * Info version : Alpha release      : 0.0.1.1, 0.1.1.1, 1.1.2.1,...
 * Info version : Beta release       :  0.0.1 ,  0.2.1 ,  1.1.1 ,...
 * Info version : Production release :   1.0  ,   1.1  ,   2.0  ,...
 * **************************************************************************** *
 * Thanks to beta tester and script developer who bring innovative ideas to me
 * myriades, sebiseba, d2, laurenthembord, laurenthembprd,....
 * **************************************************************************** */

/* **************************************************************************** *
 * Release note :
 * - 0.0.4.0 Start externalisation of generic vars & fonction
 * - 0.0.3.13 fix perma beta <> prod
 * - 0.0.3 Fixed chrome crash + fixed if link and no pseudo (patch before final release)
 * - 0.0.2 update Waze Editor Profil, add settings manager (not functional but the interface opens)
 * - 0.0.1 Start with restaure another script, add Waze Editor Profil
 */

WFTB_lang=WFTB_lang_fr;

//============================== WFTB_Initialise =======================//
function WFTB_Initialise() {
 WFTB_Log('WFTB_Initialise', 4, 'Start');

 /**/
 if(typeof localStorage.user === 'undefined'){
  WFTB_Log('WFTB_Initialise', 5, 'Initialise localstorage WFTB_data');
 } else WFTB_profil = JSON.parse(localStorage.user);

 if(typeof localStorage.WFTB_data === 'undefined') {
  localStorage.setItem('WFTB_data', '{"app_name":"' + GM_info.script.name + '", "version":"' + GM_info.script.version + '","lang":"' + navigator.language + '"}');

  WFTB_Log('WFTB_Initialise', 5, 'Initialise localstorage WFTB_data');
 }
 else WFTB_Log('WFTB_Initialise', 5, 'localstorage WFTB_data already exist... Restaure Settings');
 WFTB_Log('WFTB_Initialise', 5, 'WFTB_data.length=' + localStorage.WFTB_data.length);


 /**/
 WFTB_Settings = JSON.parse(localStorage.WFTB_data);
 WFTB_checkupdate();

 WFTB_Log('WFTB_Initialise', 5, 'WFTB_data.length=' + typeof localStorage.WFTB_data);
 WFTB_Log('WFTB_Initialise', 5, 'WFTB_data app_name ' + WFTB_Settings.app_name);
 WFTB_Log('WFTB_Initialise', 5, 'app_version ' + WFTB_Settings.version);
 WFTB_Log('WFTB_Initialise', 5, 'lang localstorage ' + WFTB_Settings.lang);

 if(WFTB_profil.login) WFTB_Log('WFTB_Initialise', 5, 'username : ' + WFTB_profil.message);
 else WFTB_Log('WFTB_Initialise', 'warn', 'username : Anonymous');

 //
 WFTB_is_beta_editor();
 WFTB_AddUserProfil();
 WFTB_settings();
 WFTB_version();
 WFTB_add_bbcode16_with_perma();

 WFTB_Log('WFTB_Initialise', 4, 'End');
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
  WFTB_L_postlinkList[WFTB_L_cpt].href = WFTB_L_postlinkList[WFTB_L_cpt].href.replace('https\:\/\/waze.com', 'https\:\/\/www.waze.com');

  // modification http(s)://waze.com en http(s)://www.waze.com
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
 if(WFTB_beta_editor) {
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
 }

 //WFTB_Log('WFTB_updatePerma', 4, ret );

 WFTB_Log('WFTB_updatePerma', 4, 'End');
}

//============================== Popup Settings Manager ========================//
function WFTB_settings() {
 WFTB_Log('WFTB_Settings', 4, 'Start');

 var WFTB_L_SettingsName = 'WF Toolbox Settings';
 var WFTB_L_text = WFTB_Settings.app_name + ' ' + WFTB_Settings.version + ' - ' + WFTB_label_setting_manager [WFTB_lang];
 var WFTB_L_title = WFTB_L_text + WFTB_help_oc_setting[WFTB_lang];
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
 var WFTB_L_setting_tab = document.createElement('table'); //wftb_settings_box_content

 //
 WFTB_L_sbm.id = 'wftb_settings_box';
 WFTB_L_sbm.setAttribute('style','border: 2px solid #333;z-index: 10;');
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
 WFTB_L_sbm_content.appendChild(document.createTextNode('Comming Sooooon ' + WFTB_version()));
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
 WFTB_L_sbm_footer_a_close.innerHTML = WFTB_label_close[WFTB_lang];

 //
 WFTB_L_sbm_footer.appendChild(WFTB_L_sbm_footer_a_close);

 //
 WFTB_L_sbm_open_link_listlink.id = 'wftb_settings_open_ll';
 WFTB_L_sbm_open_link_listlink.href = 'javascript:void(0)';
 WFTB_L_sbm_open_link_listlink.setAttribute('accesskey','w');
 WFTB_L_sbm_open_link_listlink.title = WFTB_L_title;
 WFTB_L_sbm_open_link_listlink.innerHTML = WFTB_L_SettingsName;

 //
 WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
 WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
 WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
 WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
 WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
 WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
 WFTB_L_sbm_content.appendChild(WFTB_L_setting_tab);
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
 if(document.getElementById('tabs') !== null) {
   document.getElementById('wftb_settings_open_lt').onclick = function() {
    document.getElementById('wftb_settings_box').style.display = 'block';
  };
 }

 // Add event onclic to "WF Toolbox Settings" link on Link List
 if(WFTB_L_LinkList.length == 1) {
  document.getElementById('wftb_settings_open_ll').onclick = function() {
   document.getElementById('wftb_settings_box').style.display = 'block';
  };
 }
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

//============================== WFTB_add_bbcode16_with_perma ==========================//
function WFTB_add_bbcode16_with_perma(){
  WFTB_Log('WFTB_add_bbcode16_with_perma', 4, 'Start');
  var WFTB_L_bbc16_w_perma = document.createElement('input');
  var WFTB_L_bbc16 = WFTB_xpath(WFTB_search_addperma, document);

  if (bbtags[bbtags.length-1]!='[/url]') bbtags.push('[url=]','[/url]');

  WFTB_Log('WFTB_add_bbcode16_with_perma', 4, 'WFTB_L_bbc16.length=' + WFTB_L_bbc16.length);
  if(WFTB_L_bbc16.length == 1) {
   WFTB_L_bbc16_w_perma.type = 'button';
   WFTB_L_bbc16_w_perma.className = 'button2';
   WFTB_L_bbc16_w_perma.name = 'addbbcode16_plus';
   WFTB_L_bbc16_w_perma.value = 'URL=';
   WFTB_L_bbc16_w_perma.style = 'text-decoration: underline; width: 40px';
   WFTB_L_bbc16_w_perma.onclick = function() {
    bbstyle(bbtags.length-2);
   };

   WFTB_insertAfter(WFTB_L_bbc16_w_perma,WFTB_L_bbc16[0]);
   WFTB_insertAfter(document.createTextNode(" "),WFTB_L_bbc16[0]);
 }
 WFTB_Log('WFTB_add_bbcode16_with_perma', 4, 'End');
}

//============================== WFTB_settings_update ==========================//
function WFTB_settings_update() {
 var WFTB_L_sbm;

 WFTB_Log('WFTB_settings_update', 4, 'Start');

 WFTB_L_sbm = document.getElementById('wftb_settings_box');
 if(WFTB_L_sbm === null) return;

 if(window.innerWidth > 960) WFTB_L_sbm.style.left = (window.innerWidth / 2 - 430) + 'px';
 else WFTB_L_sbm.style.left = '50px';

 WFTB_Log('WFTB_settings_update', 4, 'End');
}


//============================== Start WFTB ============================//
WFTB_Bootstrap();
//============================== End ====================================//
