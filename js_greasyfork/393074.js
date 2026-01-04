// ==UserScript==
// @name         Jira Compact Daily Scrum Board
// @namespace    https://xrspace.atlassian.net/
// @version      0.1
// @description  Show more cards and hide some unnecessary information for daily scrum.
// @author       Aska Lee
// @include      https://xrspace.atlassian.net/secure/RapidBoard.jspa?*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393074/Jira%20Compact%20Daily%20Scrum%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/393074/Jira%20Compact%20Daily%20Scrum%20Board.meta.js
// ==/UserScript==


GM_addStyle(`
    #ghx-header.contains-breadcrumbs {
        display: none;
    }
    
    .ghx-issue {
      padding: 5px;
    }
    
    div > section:nth-child(2) {
        display: none;
    }
    
    /* hide card type and priority */
    .ghx-stat-1 {
        display: none;
    }
    
    /* hide issue key */
    .ghx-issuekey-pkey {
        display: none;
    }
    
    .ghx-issuekey-number {
        color: red;
    }
    .ghx-issuekey-number::after {
        content: "#";
    }
      
    /* put card ID and assignee on the top-right corner */
    .ghx-stat-fields {
        position: absolute;
        top: -20px;
        right: 0;
    }
`);