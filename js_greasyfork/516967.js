// ==UserScript==
// @name         VMware CDS 存储池链接修复
// @namespace    https://github.com/HegeKen
// @version      2024-11-12
// @description  Fixing the VMware CDS links
// @author       HegeKen
// @license MIT
// @match        https://softwareupdate.vmware.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vmware.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516967/VMware%20CDS%20%E5%AD%98%E5%82%A8%E6%B1%A0%E9%93%BE%E6%8E%A5%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/516967/VMware%20CDS%20%E5%AD%98%E5%82%A8%E6%B1%A0%E9%93%BE%E6%8E%A5%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Get all <li> elements
        const listItems = document.querySelectorAll('li');
        // Iterate over each <li> element
        listItems.forEach(function(li) {
            // Get all <a> elements within the current <li>
            const links = li.getElementsByTagName('a');
            // Iterate over each <a> element within the <li>
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                if (link.href.indexOf('vmw-desktop') !== -1){
                  continue;}
                else{
                  link.href = link.href.replace('https://softwareupdate.vmware.com/cds/','https://softwareupdate.vmware.com/cds/vmw-desktop/')
                }
            }
        });
    });
})();