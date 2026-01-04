// ==UserScript==
// @name         Atlassian Jira Add Copy Title Action
// @namespace    chancetop
// @version      0.0.6
// @description  Copy issue code & title .
// @author       Neal Xu
// @match        https://wonder.atlassian.net/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418426/Atlassian%20Jira%20Add%20Copy%20Title%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/418426/Atlassian%20Jira%20Add%20Copy%20Title%20Action.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var executeCount = 0;
    var autoAddInterval = setInterval(addCopyBtn, 1000);

    function addCopyBtn(){
        //simple handle
        if(executeCount++ > 10) {
            clearInterval(autoAddInterval);
        }
        if(document.querySelector('#jira-issue-header-actions > div > div div.neal_copy_btn') != null) return;
        let groupContainer = document.querySelector('#jira-issue-header-actions > div > div');
        //clone node
        let copyBtnDiv = document.createElement("div");
        copyBtnDiv.innerHTML = '<div class="neal_copy_btn"><div ><div><div><button type="button" class="css-q68uj"><span class="css-j8fq0c"><span class="css-noix33"><span role="img" aria-label="Give feedback"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></span></span></span></button></div></div></div></div>'
        copyBtnDiv.onclick = function(){            
            let currentIssue = document.querySelector('#jira-issue-header > div > div > div > div div[data-test-id="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"] a').innerText;
            let parentIssue = document.querySelector('#jira-issue-header > div > div > div > div div[data-test-id="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-parent-issue-container"] span');
            let title = document.querySelector('#jira-frontend > div > div > div  h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]').innerText;
            let content = (parentIssue? parentIssue.innerText + ' / ' : '') + currentIssue + ' ' + title;
            copyText(content);
        }
        groupContainer.appendChild(copyBtnDiv);
    }
    function copyText(content){
        let fakeElem = document.createElement('textarea');
        // Move element out of screen horizontally
        fakeElem.style.position = 'absolute';
        fakeElem.style.left = '-9999px';
        fakeElem.style.fontSize = '12pt';
        // Reset box model
        fakeElem.style.border = '0';
        fakeElem.style.padding = '0';
        fakeElem.style.margin = '0';

        fakeElem.setAttribute('readonly', '');
        fakeElem.value = content;

        document.body.appendChild(fakeElem);
        fakeElem.select();
        document.execCommand('copy');
    }
})();