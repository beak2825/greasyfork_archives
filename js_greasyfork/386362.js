// ==UserScript==
// @name         Gitlab
// @namespace    https://git.anybotics.com
// @version      0.11
// @description  Add useful buttons to the navigation bar. Check squash commits by default.
// @author       Samuel Bachmann
// @match        https://git.anybotics.com/*
// @match        https://code.anymal.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386362/Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/386362/Gitlab.meta.js
// ==/UserScript==

$("head").prepend(
    '<link '
  + 'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" '
  + 'rel="stylesheet" type="text/css">'
);

$(document).ready(function () {
  var $username = $('.header-user-dropdown-toggle').attr('href').substring(1);
  $('<li id="ta-issue-author"><a class="dashboard-shortcuts-issues-author" href="/dashboard/issues?author_username=' + $username + '"><i class="fas fa-portrait fa-lg"></i></a></li>').insertAfter($('li.user-counter .dashboard-shortcuts-issues').parent());
  $('<li id="ta-mr-reviewer"><a href="/dashboard/merge_requests?scope=all&utf8=%E2%9C%93&state=opened&reviewer_username=' + $username + '"><i class="fas fa-user-check fa-lg"></i></a></li>').insertAfter($('li.user-counter .dashboard-shortcuts-merge_requests').parent());
  $('<li id="ta-mr-author"><a href="/dashboard/merge_requests?author_username=' + $username + '" aria-describedby="tooltip340864"><i class="fas fa-user fa-lg"></i></a></li>').insertAfter($('li.user-counter .dashboard-shortcuts-merge_requests').parent());
  var loc = window.location;
  if (loc.hostname == 'git.anybotics.com') {
    $('<li id="ta-board"><a href="https://git.anybotics.com/anybotics/anybotics/-/boards/7?scope=all&utf8=%E2%9C%93&state=opened&assignee_username=' + $username + '"><i class="fas fa-columns fa-lg"></a></li>').insertBefore($('li.user-counter .dashboard-shortcuts-issues').parent());
  } else if (loc.hostname == 'code.anymal.com') {
    $('<li id="ta-board"><a href="https://code.anymal.com/anymal-research/anymal_research/-/boards/2?scope=all&utf8=%E2%9C%93&state=opened&assignee_username=' + $username + '"><i class="fas fa-columns fa-lg"></a></li>').insertBefore($('li.user-counter .dashboard-shortcuts-issues').parent());
  }

  function triggerSquashMr() {
    var $checkboxSquashMr1 = $('input[name="squash"][type="checkbox"]');
    setTimeout(function() {
      if (!$checkboxSquashMr1.prop("checked")) {
        $checkboxSquashMr1.trigger('click');
      }
    }, 500);

    var $checkboxSquashMr2 = $('#merge_request_squash');
    setTimeout(function() {
      if (!$checkboxSquashMr2.prop("checked")) {
        $checkboxSquashMr2.trigger('click');
      }
    }, 500);
  }

  function triggerDeleteSourceBranch() {
    var $checkboxDeleteSourceBranch = $('#remove-source-branch-input');
    setTimeout(function() {
      if (!$checkboxDeleteSourceBranch.prop("checked")) {
        $checkboxDeleteSourceBranch.prop("checked", true);
      }
    }, 500);
  }

  triggerSquashMr();
  triggerDeleteSourceBranch();

  function triggerIncludeDescription() {
    var $checkbox2 = $('#include-description');
    setTimeout(function() {
      $('.js-mr-widget-commits-count button[aria-label="Expand"]').trigger('click');
      if (!$checkbox2.prop("checked")) {
        $checkbox2.trigger('click');
      }
    }, 500);
  };

  function modifiedCallback() {
    triggerSquashMr();
    triggerDeleteSourceBranch();
    triggerIncludeDescription();
  }

  // Only for imported MRs.
  if (loc.hostname == 'git.anybotics.com' && window.location.href.includes('merge_requests')) {
    if ($('.git-merge-container span').attr('data-original-title').startsWith('anymal_research') ||
        $('.git-merge-container span').attr('data-original-title').startsWith('github')) {
      triggerIncludeDescription();

      // Add mutation observer.
      var observer = new MutationObserver(modifiedCallback);
      var targetNode = document.body;
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  }
});
