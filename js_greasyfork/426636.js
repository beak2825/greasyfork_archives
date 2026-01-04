// ==UserScript==
// @name         Send Deployment Email
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://bamboo.ambrygen.com/deploy/viewDeploymentVersion.action*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/426636/Send%20Deployment%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/426636/Send%20Deployment%20Email.meta.js
// ==/UserScript==

const toEmail = `DeploymentRequests <DeploymentRequests@ambrygen.com>`;
const ccEmails = `Claudio Bryla <cbryla@ambrygen.com>; Kevin Wu <kwu@ambrygen.com>; Susanna Victor <svictor@ambrygen.com>; Tanya Alshuk <talshuk@ambrygen.com>`;
const projectName = $(' div.aui-item.version-details-panel > dl > dd:nth-child(8) > a').text();
const buildName = $('h1.has-version-status').text();
const releaseName = buildName.split('/')[1].split('-')[0];
const deploymentDocumentLink = `https://confluence.ambrygen.com/display/${projectName}/${releaseName}+Deployment+Notes`;
const emailSubject = `${projectName} deployment to staging`;
const emailBody = `Hello Deployers.
Please deploy latest ${projectName} build (${buildName}) to staging.

${window.location.href}

Deployment documentation:
${deploymentDocumentLink}

Please, let me know if there are any questions.
Thanks.
`;


const addGlobalStyle = css => {
    const head = document.getElementsByTagName('head')[0];
    if(head) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
}

const addFormHandler = () => {
    $(document).on('click',`#send-deployment-email`,function(event){
        event.preventDefault();
        event.stopPropagation();
        const params = new URLSearchParams({
            subject: emailSubject,
            to: toEmail,
            cc: ccEmails,
            body: emailBody
        });
       GM_openInTab(`mailto:${toEmail}?${params.toString().replace(/\+/g, ' ')}`);
    });
}

const createEmailButton = () => `
    <button id="send-deployment-email" class="aui-button send-deployment-email" title="Send deployment Email" style="margin-right: 10px" type="submit">
       <span class="aui-icon aui-icon-small aui-iconfont-email">Send Deployment Email</span>
       Send Deployment Email
    </button>
`;

(function() {
    'use strict';
    $('.aui-page-header-actions>.aui-buttons').prepend(createEmailButton());
    addFormHandler();
})();