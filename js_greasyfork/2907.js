// ==UserScript==
// @name        Jira Agile issue print style
// @namespace   http://github.com/mzedeler/gm-jira-agile-css
// @version     0.3
// @description Add css styles to make printing issues from Jira
// @match       https://notalib.atlassian.net/secure/RapidBoard.jspa?*view=planning*
// @copyright   2014, Michael Zedeler <michael@zedeler.dk>
// @resource css https://raw.githubusercontent.com/mzedeler/gm-jira-agile-css/master/gm-jira-agile-css.css
// @downloadURL https://update.greasyfork.org/scripts/2907/Jira%20Agile%20issue%20print%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/2907/Jira%20Agile%20issue%20print%20style.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('css'));

