// ==UserScript==
// @name        SFSC direct download link
// @description create direct download links in SFSC 
// @version     1.3
// @grant       none
// @include     https://suse.lightning.force.com/*
// @namespace   https://greasyfork.org/users/438027
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/396061/SFSC%20direct%20download%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/396061/SFSC%20direct%20download%20link.meta.js
// ==/UserScript==
document.addEventListener( 'click', function() {
    var i;
        for (i=0;i<=this.links.length;i++) {
                find_attachment_link(this.links[i]);
    }
  },  true
);

function find_attachment_link(link) {
  if (link.href.match(/\/ContentDocument\/.*view$/)) {
    var id = link.href.match(/\/ContentDocument\/(.*)\/view$/);
    link.href="https://suse.my.salesforce.com/sfc/servlet.shepherd/document/download/"+id[1]+"?operationContext=S1";
  }
  if (link.className==="forceBreadCrumbItem") {
        if(link.title.match(/^[0-9]{8,}/)) {
                var parentOL = link.parentElement.parentElement;
                if (parentOL.childElementCount == 2) {
                        if (parentOL.parentElement.nextSibling.title=="Attachments") {
                                parentOL.parentElement.nextSibling.innerHTML+=" for "+link.title;
                        }
                        var newtitle="SFSC"+link.title+"_";
                        var newLI = parentOL.appendChild(document.createElement('li'));
                        newLI.setAttribute("class", "slds-breadcrumb__item slds-line-height--reset");
                        var newSPAN1 = newLI.appendChild(document.createElement('span'));
                        var newSPAN2 = newLI.appendChild(document.createElement('span'));
                        newSPAN1.innerHTML="&nbsp;&nbsp;";
                        newSPAN2.setAttribute("class", "forceBreadCrumbItem uiOutputText");
                        newSPAN2.innerHTML=newtitle;
                }
        }
  }
}
