// ==UserScript==
// @name            TUM eAccess Redirector
// @name:de         TUM eAccess Redirector
// @version         1.0.1.17
// @description     Automatically redirect to the proxified equivalent as provided by the libary of the Technische Universitaet Muenchen via the eAccess-System. TUM credentials required.
// @description:de  Userscript, dass auf einigen Seiten, mit denen die Universitätsbiblothek der Technischen Universität München kooperiert, die eAccess-Version aufruft.
// @author          Zeno Sewald
// @namespace       https://github.com/zsewa

// @match *://*.eaccess.ub.tum.de/*
// @match *://eaccess.ub.tum.de/*

// @match *://opac.ub.tum.de/InfoGuideClient.tumsis/*
// @match *://bvb-new-primo.hosted.exlibrisgroup.com/primo_library/libweb/action/search.do*vid=49BVB_TUM01_VU1*
// @match *://bvb-new-primo.hosted.exlibrisgroup.com/primo_library/libweb/action/dlSearch.do*vid=49BVB_TUM01_VU1*
// @match *://mediatum.ub.tum.de/*
// @match *://sfx.bib-bvb.de/*
// @match *://ezb.uni-regensburg.de/ezeit/*bibid=TUM*
// @match *://ezb.uni-regensburg.de/*bibid=TUM*
// @match *://ezb.uni-regensburg.de/index.phtml*bibid=TUM*
// @match *://rzblx1.uni-regensburg.de/ezeit/ezb.phtml*bibid=TUM*
// @match *://rzblx10.uni-regensburg.de/dbinfo/*
// @match *://dbis.uni-regensburg.de/dbinfo/dbliste.php*bibid=TUM*

// @match *://science.sciencemag.org/*
// @match *://www.sciencedirect.com/*
// @match *://www.nature.com/*

// @match *://*.thieme-connect.de/*
// @match *://link.springer.com/*
// @match *://*.springer.com/*/book/*

// @match *://apps.webofknowledge.com/*
// @match *://www.emeraldinsight.com/*
// @match *://www.degruyter.com/*
// @match *://ieeexplore.ieee.org/*
// @match *://onlinelibrary.wiley.com/*
// @match *://www.worldscientific.com/*
// @match *://ebooks.worldscinet.com/*
// @match *://*.tandfonline.com/*
// @match *://*.biochemj.org/*
// @match *://*.aappublications.org/*
// @match *://*.ovid.com/*
// @match *://*.scopus.com/*
// @match *://*.annualreviews.org/*
// @match *://*.thiemebilddatenbankanatomie.de/*
// @match *://*.jove.com/*
// @match *://*.jstor.org/*
// @match *://app.knovel.com/*
// @match *://tecfinder.wti.frankfurt.de/*
// @match *://*.gbv.de/*
// @match *://roempp.thieme.de/*
// @match *://*.cas.org/*
// @match *://stneasy.fiz-karlsruhe.de/*
// @match *://*.umwelt-online.de/*

// @match *://*.acs.org/*
// @match *://*.rsc.org/*
// @match *://*.gbv.de/*
// @match *://www.reaxys.com/*
// @match *://new.reaxys.com/*

// @match *://*.aacrjournals.org/*
// @match *://*.bmj.com/*
// @match *://www.hematologylibrary.org/*
// @match *://www.karger.com/*
// @match *://web.b.ebscohost.com/*
// @match *://search.ebscohost.com/*
// @match *://*.agu-hochschulen.de/*
// @match *://elibrary.asabe.org/*

// @match *://www.hanser-elibrary.com/*

// @match *://www.ami-informiert.de/*
// @match *://www.allthatstats.com/*
// @match *://www.oecd-ilibrary.org/*

// @match *://www.ams.org/*
// @match *://www.ems-ph.org/*
// @match *://*.siam.org/*
// @match *://zbmath.org/*
// @match *://proquest.tech.safaribooksonline.de/*
// @match *://www.zentralblatt-math.org/*

// @match *://error.incites.thomsonreuters.com/error/Error*DestApp=IC2ESI&*Error=IPError
// @match *://error.incites.thomsonreuters.com/error/Error*DestApp=IC2JCR&*Error=IPError
// @match *://login.webofknowledge.com/error/Error*Error=IPError*

// @match *://global.factiva.com/

// @match *://www.video2brain.com/*

// @match *://dl.acm.org/*

// @require https://code.jquery.com/jquery-3.3.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/21778/TUM%20eAccess%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/21778/TUM%20eAccess%20Redirector.meta.js
// ==/UserScript==

/*
This file is licenced under a MIT licence.

Copyright 2016 - 2019 Zeno Sewald <zsewa@outlook.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
not working (external access permitted):
UPTODATE ://www.uptodate.com/
Chemical abstracts http://webcsd.ccdc.cam.ac.uk
DIN-Normen etc. ://tum.eresearchcenter.eu
Emerald http://www.emeraldgrouppublishing.com

not working:
Thieme PDF https://profile.thieme.de/HTML/sso/ejournals/login.htm?type=default&subsidiary=www.thieme-connect.de&hook_url=https%3A%2F%2Fwww.thieme-connect.de%2Fproducts%2Febooks%2Fpdf%2F10.1055%2Fb-0034-93621.pdf
*/

function core(mode) {

  var domain = location.href;
  var hostname = document.location.hostname;
  GM_setValue('last_domain_hostname', hostname);
  GM_setValue('last_domain', domain);

  //special rules - bugfixes
  //Reaxys
  if (domain.indexOf('www.reaxys.com/reaxys/session.do') != -1) {
    var domain = 'https://www-reaxys-com.eaccess.ub.tum.de/reaxys/secured/search.do';
  }
  //Essential science indicators Thomas Reuters InCites
  if (hostname == 'error.incites.thomsonreuters.com' && domain.indexOf('error.incites.thomsonreuters.com/error/Error?DestApp=IC2ESI') != -1) {
    var domain = 'https://esi.incites.thomsonreuters.com/IndicatorsAction.action';
  }
  //Journal Citation Reports Thomas Reuters InCites
  if (hostname == 'error.incites.thomsonreuters.com' && domain.indexOf('error.incites.thomsonreuters.com/error/Error?DestApp=IC2JCR') != -1) {
    var domain = 'https://jcr.incites.thomsonreuters.com/JCRJournalHomeAction.action';
  }
  //WebofScience/WebofKnowledge Login Pages
  if (hostname == 'login.webofknowledge.com') {
    var domain = 'https://apps.webofknowledge.com/';
  }

  switch (mode) {
    case 1:
      //confirmation mode
      if (window.confirm("Redirect to TUM eAccess?")) {
        void(window.document.location.replace('https://eaccess.ub.tum.de/login?url=' + domain));
      }
      break;
    case 2:
      //html page mode
      var html = '<center><img src="http://www.ub.tum.de/files/eacessbutton.jpg" height="40" width="40"></div><br><br>Resource is reloaded via TUM eAccess...<br><br>You are redirected form ' + window.location.hostname + ' to the fitting resource in the TUM eAccess system. Login may be required.<br><br>To change the behavior of this userscript open it in your Tapermonkey or Greasemonkey extention. You can specify a mode there.<br><br><br><br><br><br>Thanks for using TUM eAccess Redirector.</center>';
      document.write(html);
      void(location.href = 'https://eaccess.ub.tum.de/login?url=' + domain); //default way to reload via eacess
      break;
    default:
      //default mode - silent
      void(window.document.location.replace('https://eaccess.ub.tum.de/login?url=' + domain));
  }
}

function set_usermode(value) {
  GM_setValue('eAccess_reloader_mode', value);
}

function excludeme(hostname_passed) {
  var hostname_temp = hostname_passed;
  var excluseme_userexclude_temp = GM_getValue('eAccess_reloader_userexclude', []);
  if (excluseme_userexclude_temp.indexOf(hostname_temp) == -1) {
    excluseme_userexclude_temp += ',' + hostname_temp;
  }
  GM_setValue('eAccess_reloader_userexclude', excluseme_userexclude_temp);
  excludeme_show();
}

function excludeme_edit() {
  var ex_temp = GM_getValue('eAccess_reloader_userexclude', []);
  var ex_temp_new = prompt('Ändern Sie etwas und klicken Sie OK. Wollen Sie doch nichts ändern, beenden Sie mit Abbrechen. Aktuelle Ausnahmen: ', ex_temp);
  if (ex_temp_new !== null) {
    GM_setValue('eAccess_reloader_userexclude', ex_temp_new);
  }
  excludeme_show();
}

function excludeme_show() {
  var exc = GM_getValue('eAccess_reloader_userexclude', []);
  if (exc == []) {
    var text = 'leer';
  } else {
    var text = '';
  }
  alert('Ausnahmnen: ' + text + exc);
  return true;
}

function excludeme_delete(element, security) {
  if (security) {
    var ex_temp = GM_getValue('eAccess_reloader_userexclude', []);
    var ex_temp_new = ex_temp.replace(',' + element, '');
    GM_setValue('eAccess_reloader_userexclude', ex_temp_new);
    excludeme_show();
  }
}

function excludeme_reset(security) {
  if (security) {
    var excluseme_userexclude_temp = []; //reset via decommenting
    GM_setValue('eAccess_reloader_userexclude', excluseme_userexclude_temp);
  }
}

function markaseaccess() {
  GM_addStyle('.eAccess_userscript_created_content { all: initial; font-family: sans-serif; font-size: small; color: white; z-index:9000; float:true; bottom:0; right:1.5%; position:fixed; float: left; padding: 5px 10px; background: #3070b3; -webkit-border-top-left-radius: 8px; -webkit-border-top-right-radius: 8px; -moz-border-radius-topleft: 8px; -moz-border-radius-topright: 8px; border-top-left-radius: 8px; border-top-right-radius: 8px;}');
  $("body").prepend('<div class="eAccess_userscript_created_content"><a style="color: white;" target="_blank" href="https://login.eaccess.ub.tum.de/login">Redirected by TUMeR</div>');

  $('.eAccess_userscript_created_content').hover(
    /*in*/
    function() {
      eAccess_userscript_created_content_old_html = $(this).html();
      $(this).html('<div class="eAccess_userscript_created_content"><a style="color: white;" target="_blank" href="https://login.eaccess.ub.tum.de/login">Redirected by TUM eAccess Redirector</a><br><br><div style="color: white; text-align: right; cursor: pointer;" class="eAccess_userscript_created_content_hide">&nbsp;x&nbsp;(HIDE THIS)</div></div>');
      $('.eAccess_userscript_created_content_hide').on('click', function() {
        $('.eAccess_userscript_created_content').hide();
      });
    },
    /*out*/
    function() {
      $(this).html(eAccess_userscript_created_content_old_html);
    }
  );
}

function addsettingstodom() {
  var settings_html1 = '\
<div class="container">\
<div class="row">\
<br>\
<p><h3>Die folgenden Zeilen werden durch ein Userscript produziert und verschwinden bei dessen Deinstallation.<br>Dieser Teil der Webseite ist nur für Sie sichtbar.</h3></p>\
<h2>Einstellungen des TUM eAccess Redirector Userscripts</h2>\
Das "TUM eAccess Redirector Userscript" überprüft die URL aufgerufener Seiten und läd diese über die proxyfizierte Version neu.<br>Das Userscript basiert auf der Funktion des Bookmarklets, automatisiert jedoch den Ablauf.\
<br><br>\
<div class="row"><div class="eight columns"><h2> Einstellungen </h2><form><b>Modus:</b> Das Script kann in 3 verschieden Modi ausgefürt werden. Dies wirk sich auf das Verhalten aus.<br><br><fieldset><div class="csc-mailform-field"><label for="modeselect">Modus (aktuell: <b>';

  var settings_html2 = '</b>)</a></label><select name="modeselect" size="3" style="width: 500px"> <option id="userscript_opt_0">Mode 0 (Standard): Automatische Weiterleitung ohne Meldungen</option> <option id="userscript_opt_1">Mode 1 (Confirmation): Vor dem Weiterleiten IMMER fragen (außer Ausnahmen)</option> <option id="userscript_opt_2">Mode 2 (Hinweis): Automatische Weiterleitung mit kurzzeitiger Meldung</option></select></div></fieldset></form></div></div>\
<b>Ausnahmen:</b> Das Script leitet auf viele über eAccess erreichbare Seiten um. Sollten Sie das bei bestimmten Seiten NICHT wünschen klicken sie folgenden Link und geben Sie den Hostnamen ein.<br>Geben Sie z.B. statt der URL "http://link.springer.com/content" Folgendes ein: "link.springer.com". Aber z.B.: "www.reaxys.com".<br><br><a id="userscript_add_exeption">Weiterleitungs-Ausnahme hinzufügen</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="userscript_show_exeptions">Ausnahmen ansehen</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="userscript_delete_exeptions">Ausnahmen löschen</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="userscript_edit_exeptions">Ausnahmen manuell bearbeiten (Achtung: Profimodus!)</a><br>\
<br><br><h2>Vielen Dank, dass Sie den TUM eAccess Redirector nutzen</h2><br></div></div>\
</div>\
<div class="three columns"><div class="content-box content-box--heavy content-box--green"><div class="csc-header csc-header-n1"><h4 class="csc-firstHeader">TUM eAccess Redirector</h4></div><p class="bodytext"><a target="_blank" title="Installationsseite" href="https://greasyfork.org/de/scripts/21778-tum-eaccess-redirector" class="external-link-new-window">Installationsseite</a><br>Version: 1.0.1.x<br>Autor: zsewa<!--<br><a href="mailto:eaccess@ub.tum.de">Email an Entwickler</a>--></p></div>\
';

  $("body").append(settings_html1 + GM_getValue('eAccess_reloader_mode', '0') + settings_html2);
  $("#userscript_opt_0").click(function() {
    set_usermode(0);
    alert('Mode ' + GM_getValue('eAccess_reloader_mode', 0) + ' wurde gesetzt.');
    location.reload();
  });
  $("#userscript_opt_1").click(function() {
    set_usermode(1);
    alert('Mode ' + GM_getValue('eAccess_reloader_mode', 0) + ' wurde gesetzt.');
    location.reload();
  });
  $("#userscript_opt_2").click(function() {
    set_usermode(2);
    alert('Mode ' + GM_getValue('eAccess_reloader_mode', 0) + ' wurde gesetzt.');
    location.reload();
  });

  $("#userscript_add_exeption").click(function() {
    var link_exclude = prompt('Bitte einen Hostnamen eingeben. Z.B. ' + GM_getValue('last_domain_hostname', 'www.reaxys.com'));
    excludeme(link_exclude);
  });
  $("#userscript_show_exeptions").click(function() {
    excludeme_show();
  });
  $("#userscript_edit_exeptions").click(function() {
    excludeme_edit();
  });
  $("#userscript_delete_exeptions").click(function() {
    excludeme_reset(confirm('Wollen Sie wirklich ALLE Ausnahmen entfernen?'));
    excludeme_show();
  });
}

(function() {
  'use strict';
  //store userscript version for prompt at major updates
  var thisVersion = GM_info.script.version;
  GM_setValue('last_version', thisVersion);

  GM_registerMenuCommand('[TUMeR] Edit exeptions', function() {
    excludeme_edit();
  });
  var usermode = GM_getValue('eAccess_reloader_mode', 0);

  var hostname = document.location.hostname;

  var userexclude = GM_getValue('eAccess_reloader_userexclude', []);

  if (hostname.indexOf('eaccess.ub.tum.de') == -1) {
    if (userexclude.indexOf(hostname) == -1) {
      core(usermode);
    } else {
      var host_inner = hostname;
      GM_registerMenuCommand('[TUMeR] Don\'t exclude ' + host_inner, function() {
        excludeme_delete(host_inner, confirm('Wollen Sie ' + host_inner + ' wirklich aus den Ausnahmen entfernen?'));
        window.location.reload();
      });
      GM_registerMenuCommand('[TUMeR] Redirect this time', function() {
        core(0);
      });
    }
  } else {
    var domain = location.href;
    if (domain.indexOf('https://login.eaccess.ub.tum.de/menu') != -1 || domain.indexOf('https://login.eaccess.ub.tum.de/login') != -1 || domain.indexOf('http://eaccess.ub.tum.de/menu') != -1 || domain.indexOf('https://eaccess.ub.tum.de/menu') != -1 || domain.indexOf('https://eaccess.ub.tum.de/login') != -1 || domain.indexOf('http://eaccess.ub.tum.de/login') != -1) {
      addsettingstodom();
    } else {
      markaseaccess();
      var last_domain240 = GM_getValue('last_domain');
      var last_dom_host240 = GM_getValue('last_domain_hostname', 0);
      GM_registerMenuCommand('[TUMeR] Exclude ' + last_domain240, function() {
        excludeme(last_dom_host240);
        window.location.href = last_domain240;
      });
      //$("#userscript_eAccess_redirector_created_site_link").click(function() {  });
    }
  }

})();
