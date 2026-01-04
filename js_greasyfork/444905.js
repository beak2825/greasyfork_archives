// ==UserScript==
// @name         OmniSupervisor page help
// @namespace   DavidShang
// @description  Setup default OmniSupervisor page size// @namespace   https://github.com/WindrunnerMax/TKScript
// @version     1.0.0
// @author      dshang@ciandt.com
// @match        https://*.lightning.force.com/*
// @license     GPL License
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/444905/OmniSupervisor%20page%20help.user.js
// @updateURL https://update.greasyfork.org/scripts/444905/OmniSupervisor%20page%20help.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let elm
    let currentPage
    let pageSize = localStorage.getItem('sf_omnisupervisor_pagesize') ?? 10

    var id = setInterval(function(){
        currentPage = document.querySelector('.selectedListItem')
        if(currentPage != null && currentPage.innerText != "Select..." && currentPage.innerText != "Omni Supervisor"){
            clearInterval(id)
        }
        elm = document.querySelector('.pagerPageSize select')
        if(elm != null){
            elm.addEventListener('change',function(){
                localStorage.setItem('sf_omnisupervisor_pagesize',elm.value)
            })
            elm.value = pageSize
            var event = document.createEvent('HTMLEvents');
            event.initEvent('change', true, true);
            elm.dispatchEvent(event);
            clearInterval(id)
        }
    },300)
})();
