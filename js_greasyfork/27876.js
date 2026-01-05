// ==UserScript==
// @name         man html toc
// @namespace    http://www.yurenchen.com/
// @version      0.1
// @description  add toc sidebar for man2html page
// @author       yurenchen
// @match        https://community.openvpn.net/openvpn/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27876/man%20html%20toc.user.js
// @updateURL https://update.greasyfork.org/scripts/27876/man%20html%20toc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //make toc sidebox
    var box_st='<div id="toc" style="position: fixed; right: -1px; top: -38px; background: white; padding: 19px; border: 1px solid #cecece; width: 431px; height: 100%;">';
    var box_ed='</div>';
    var html=wikipage.innerHTML;
    html=html.replace(/<hr[ /]*>\s*(<a name="index">[\s\S]*?<hr[ /]*>)/, '<hr>'+box_st+'$1'+box_ed);
    wikipage.innerHTML=html;

    //adjust body position
    document.body.style.cssText='margin: 0px; padding: 0;  width: initial; right: 474px; position: absolute;';

})();