// ==UserScript==
// @name            WEvent ToolBox Beta
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYBBicLUdqBwAAAA1lJREFUWMPFl0tIVFEYx39nug46qE1DYoWU1KJAKZHEoEVRLhwXQUFGKG6CHpsy7KlEi/BJA7myxyKoGSKDAhfpwoIWQWJgQzNQQTZa9DJKKjTG0dPijDo6984cG6UPLsy9c875/8/3/oSUEl15FITuF8iBIQiNwOiY+u50QP5KKMoH9xZEWaH2kQgdAie9yPZukBHASLI4uqa2HBoPIBz2FAg0dyHrfRqgVjIBTdVwfg9iwQQKzyKDw4CN1GQKCtZC/yVEup04JnEEJibBdRj5+w+LKpnpEGpHuDLnkogjkHVo8cFjSXztQGTE+IVtvtqXChzg9x8oucCcG9tiHS44nCLCpApJItZLgsMKK45AvTd1h3MXw48bcO0IELZYZIN6H4yFYwicvI0kzWKDVDfTeVY51ZbDu8BXm4CEAQ13lRaElBJbFebBOAmXayDPBToJc0MulKyffX/wHPa1gdnlBDDlQxi9AesM5y6Guop/N8nerVC9E7xPTRQbgd4AGD1+pFWmexSEgRCsWaEHmGGH7IzZ99A36OyzNkOPH2kMDFkfGI5A8ZmojTWkugxuH1O/33yCTacgkeUGhsAIjSQ5Nc3chqYOHk1xL9/D5rNgXQGiGhoBY7qkLobcegLjYbj3LDk4qHKuH/kS9peq4mKtArjXpwc+s8Xp0AP3t0DncajZsXgaczrAyM+Bwa+JF77ywMbV0eoqAd16sSyx/+TngKjzSul5aL7AbsBrj2q3puXnuLKzjnz8Adsuqmgyk7oKMMq3IDxd5rmgsnQuOKg4j431RJK7HHYXQLffvHUrL0IkTsUTcP807C2Z/dQ/CG+/aDSbAj58h1O3oqawSsUAJ8rhSo95DtjXBt5aqNquPnX0ws3Hui5uDg5wwh1TDZsOICxruB2qr8D1KOjn0eihOo+w7pwbK9W/My1ZSxfy/J0EPUEEnNkw+sv6VrpNavNBOLdnHoGZTvgDSyoFeRBondXNHALjE5B7FPnrfzWl6Wnwrh2Rlb404KF2NRuYNqXToeHKhC9XEYV5SfL+QgaTPHXz+TMBZi4ngIw0eNmKaD6YuMNNKhHlcIFWpXbxL8PpWBgaOhc2nApD5ZaUh9O4Fi0A3X7kiyF4N388z4GideAuQpQV6CvpLyjrNaUqOdRiAAAAAElFTkSuQmCC
// @namespace       WEvent_ns
// @version         0.0.10
// @description:en  Added editor profile and other
// @description     Ajout du profile editor & co
// @require         https://greasyfork.org/scripts/439116-wf-global-lib/code/WF%20Global%20Lib.js
// @author          Exolium
// @match           http://*.waze.com/*/events/*
// @match           https://*.waze.com/*/events/*
// @copyright       2015-2022 Exolium
// @license         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425547/WEvent%20ToolBox%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/425547/WEvent%20ToolBox%20Beta.meta.js
// ==/UserScript==

/* **************************************************************************** *
 * Info version : Alpha release      : 0.0.1.1, 0.1.1.1, 1.1.2.1,...
 * Info version : Beta release       :  0.0.1 ,  0.2.1 ,  1.1.1 ,...
 * Info version : Production release :   1.0  ,   1.1  ,   2.0  ,...
 * **************************************************************************** *
 * Thanks to beta tester and script developer who bring innovative ideas to me
 * laurenthembord, laurenthembprd,....
 * *************************************************************************** */

//============================== Options ================================//
var WGL_Log_level = 5; // 0 = no log / 1 = error / 2 = warn / 3 = min log / 4 = Medium Log / 5 = high detail Log
var WEvent_targetblank = true;
var WEvent_button_editorprofil = 'Editor Profil A';
var WEvent_baseurl_profil = 'https://www.waze.com/forum/memberlist.php?mode=searchuser&username=';
var WEvent_regexp = '//*[@id="memberlist"]/tbody/tr[1]/td[1]/a[1]';
var WEvent_search_profil = Array();
var WEvent_search_profil_result = Array();

function recup_phpbbprofil(WEvent_L_Pseudo) {
  var WEvent_L_url = '';
  //var WEvent_L_profil_pg = '';
  var WEvent_mk_forumprofilelement = document.createElement('a');
  WEvent_mk_forumprofilelement.text = ' (profil forum)';

    WGL_Log ('recup_phpbbprofil', 5, 'url search ' + WEvent_baseurl_profil + WEvent_L_Pseudo);

  GM_xmlhttpRequest({
   method: "GET",
   url: WEvent_baseurl_profil + WEvent_L_Pseudo,
   headers: {
    "User-Agent": "Mozilla/5.0",
   },
   onload: function(responseDetails) {
    WGL_Log ('recup_phpbbprofil', 5, 'Load Usersearch page');
    var WEvent_L_profil_pg = document.createElement('div');
    WEvent_L_profil_pg.innerHTML = responseDetails.responseText;
    WEvent_search_profil_result = WGL_xpath(WEvent_regexp, WEvent_L_profil_pg);
    WGL_Log ('recup_phpbbprofil', 5, 'nb occurence ' + WEvent_search_profil_result.length);
    //WEvent_mk_forumprofilelement.href=WEvent_search_profil_result[0].href;
    if(WEvent_search_profil_result.length > 0) {
     WGL_Log ('recup_phpbbprofil', 5, ' url WEvent_search_profil_result[0].href = ' + WEvent_search_profil_result[0].href);
     WEvent_L_url = WEvent_search_profil_result[0].href;
      WEvent_mk_forumprofilelement.href=' https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=' + WEvent_search_profil_result[0].href.split('=')[2];
      WEvent_mk_forumprofilelement.target = '_blank';
      //WEvent_mk_forumprofilelement.href=WEvent_search_profil_result[0];
      WGL_Log ('recup_phpbbprofil', 5, ' url split 1 = ' + WEvent_search_profil_result[0].href.split('=')[2]);
      WGL_Log ('recup_phpbbprofil', 5, ' url WEvent_L_url = ' + WEvent_L_url);
      //
      WGL_Log ('recup_phpbbprofil', 5, ' WEvent_beta_editor');
    } else WEvent_mk_forumprofilelement.text = ' (pas de profil forum)';
    //return ' <a href="' + WEvent_L_url + '"> (profil forum)</a>';
    //return WEvent_L_url;
   }
  });

  //GL_Log('recup_phpbbprofil', 5, ' url WEvent_L_url = ' + WEvent_L_url);

  //return ' <a href="' + WEvent_L_url + '" target="_blank"> (profil forum)</a>';
  WGL_Log ('recup_phpbbprofil', 5, ' WEvent_search_profil_result.length = ' + WEvent_search_profil_result.length)
  return WEvent_mk_forumprofilelement;
}

//================================ Vars ======================================//
var WEvent_beta_editor_verify = false;
var WEvent_beta_editor = false;
var WEvent_profil = Array();
var WEvent_Settings = {};
var WEvent_search = '//*[contains(@class, \'mte-user__name\')]';

//================================ Code ======================================//
(function() {
  'use strict';
  var WEvent_L_result = WGL_xpath(WEvent_search, document);
  var WEvent_L_usersearch = '';
  //recup_phpbbprofil('exolium');
  for(var WEvent_L_cpt = 0; WEvent_L_cpt < WEvent_L_result.length; WEvent_L_cpt++) {
   WEvent_L_usersearch = WEvent_L_result[WEvent_L_cpt].innerHTML;
   WEvent_L_result[WEvent_L_cpt].innerHTML = '<a target="_blank" href="https://www.waze.com/fr/user/editor/' + WEvent_L_result[WEvent_L_cpt].innerHTML + '"> ' + WEvent_L_result[WEvent_L_cpt].innerHTML + '</a>';
   WEvent_L_result[WEvent_L_cpt].appendChild(recup_phpbbprofil(WEvent_L_usersearch));
  }
})();

//============================================================================//