// ==UserScript==
// @name          Atlassian JIRA - Inprovements, suggest branch name, logo link, etc
// @description   llll
// @include       https://jira.*
// @include       http://jira.*
// @match         https://track.*
// @match         https://track.namecheap.net/*
// @version       0.7
// @grant    GM_addStyle
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/206789
// @downloadURL https://update.greasyfork.org/scripts/435024/Atlassian%20JIRA%20-%20Inprovements%2C%20suggest%20branch%20name%2C%20logo%20link%2C%20etc.user.js
// @updateURL https://update.greasyfork.org/scripts/435024/Atlassian%20JIRA%20-%20Inprovements%2C%20suggest%20branch%20name%2C%20logo%20link%2C%20etc.meta.js
// ==/UserScript==

function waitForKeyElements(e,t,a,n){var o,r;(o=void 0===n?$(e):$(n).contents().find(e))&&o.length>0?(r=!0,o.each(function(){var e=$(this);e.data("alreadyFound")||!1||(t(e)?r=!1:e.data("alreadyFound",!0))})):r=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),c=l[i];r&&a&&c?(clearInterval(c),delete l[i]):c||(c=setInterval(function(){waitForKeyElements(e,t,a,n)},300),l[i]=c),waitForKeyElements.controlObj=l}


function main(jNode) {
    if($('body').hasClass('custom-script-applied')) return;

    // Generate Branch name
  
    const issueKey = $('[data-issue-key]', jNode).attr('data-issue-key');
    const title = $('#summary-val', jNode.parent()).text().trim();
    const type = $('#issuedetails #type-val').text().trim().toLowerCase()
    const branchPrefix = type
                            .replace('story', 'feat')
                            .replace('bug', 'fix');
    const branchTitle = title
                            .replace(/Dev\.[^.]+\./, '')
                            .replace(/([^\|\w\s\d]{1,})/g, ' ').trim()
                            .replace(/\s{1,}/gi, '-');
    const branch = `${branchPrefix}/${issueKey}_${branchTitle}`.substring(0, 40).replace(/(-|_)$/gi, '');

    $('.issue-header-content .aui-page-header-inner')
        .css('position','relative')
        .append(`<small style="position:absolute;top:0;right:0;display:block;">${branch}</small>`);


    // Set HP board link to logo href
    $('a[href*="MyJiraHome"]')
        .attr('href', 'https://track.namecheap.net/secure/RapidBoard.jspa?rapidView=1600&projectKey=SSLP&quickFilter=9855');

    // Hide backlog column
    const backlogSel = 'li.ghx-column:nth-of-type(1)';
    $(`<style>${backlogSel} { display: none }</style>` ).appendTo('head');
    $(`<dd><a role="button" href="#" class="js-quickfilter-button aui-button aui-button-link first" title="BACKLOG" resolved="" onclick="$('${backlogSel}').toggle()">_BL_</a></dd>`).insertAfter('#js-work-quickfilters dd:first');

    $('body').addClass('custom-script-applied');
}

bWaitOnce = true;
waitForKeyElements (
    ".aui-page-header-main:first",
    main
);