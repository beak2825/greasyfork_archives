// ==UserScript==
// @name         QV Redirect to login
// @namespace    http://tampermonkey.net/
// @version      1.0.0.12
// @description  connects to QV each day
// @author       Tuval
// @match        https://login.external.hp.com/idp/startSSO.ping?PartnerSpId=204160:Emp-Part_IdP&vsid=202220:QlikView:OT_win&TargetResource=https%3a%2f%2fg1w8858g.austin.hpicorp.net%3a443%2fQvAJAXZfc%2fopendoc.htm%3fdocument%3dGraphics%252fIndigo_Service_Dashboard.qvw%26host%3dQVS%2540HpiPro
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/27555/QV%20Redirect%20to%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/27555/QV%20Redirect%20to%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var a_ref = $("td:contains('Email')").find("a").attr('href');
  window.location.href = a_ref; 
})();