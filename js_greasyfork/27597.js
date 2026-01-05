// ==UserScript==
// @name         QV Redirect to login2
// @namespace    http://tampermonkey.net/
// @version      1.0.0.1
// @description  connects to QV each day
// @author       Tuval
// @match        https://login.external.hp.com/idp/SSO.saml2
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/27597/QV%20Redirect%20to%20login2.user.js
// @updateURL https://update.greasyfork.org/scripts/27597/QV%20Redirect%20to%20login2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = 'https://login.external.hp.com/idp/startSSO.ping?PartnerSpId=204160:Emp-Part_IdP&vsid=202220:QlikView:OT_win&TargetResource=https%3a%2f%2fg1w8858g.austin.hpicorp.net%3a443%2fQvAJAXZfc%2fopendoc.htm%3fdocument%3dGraphics%252fIndigo_Service_Dashboard.qvw%26host%3dQVS%2540HpiPro'
})();