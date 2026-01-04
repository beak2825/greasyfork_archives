// ==UserScript==
// @name        Kukote
// @namespace   kukote
// @version     0.2.7
// @description Kukote is a simple plugin designed to enhance the functionality of UTAK. With Kukote installed, users of UTAK can enjoy a range of additional features that are not available with the basic version.
// @author      mac
// @match       https://utak.upd.edu.ph/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=edu.ph
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @license     GPLv3
// @run-at      document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/462935/Kukote.user.js
// @updateURL https://update.greasyfork.org/scripts/462935/Kukote.meta.js
// ==/UserScript==

$(document).ready(function () {

  var pagePath = window.location.pathname.split('/');
  var lastPath = pagePath.pop() || pagePath.pop(); // get the last segment, fallback to second-to-last if last segment is empty
  console.log(lastPath);

  if (lastPath === "forms") {
   setInterval(function() {
       location.reload();
   }, 20000); // 20000 milliseconds = 20 seconds
  };

  if (lastPath === "workflow-status") {
      $(".bulkactions").remove();
      findEmailAdd ();
  };

    function hideWorkflow () {
        const optionsToHide = ['1', '2', '3', '4', '5', '6', '7', '9', '11', '12', '13', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '27', '28', '29', '30', '31', '32', '33', '35', '36', '37', '38', '39', '41', '42', '43', '44', '45', '46', '47', '48', '51', '53', '54', '56', '58', '59', '60', '61', '62', '63', '64'];
        optionsToHide.forEach(function(option) {
            $("#gravityflow-form-select option[value='" + option + "']").hide();
        });
    };

    function hideWorkflowAdmin () {
        const optionsToHide = ['restart_workflow', 'send_to_step|697'];
        optionsToHide.forEach(function(option) {
            $("#gravityflow-admin-action option[value='" + option + "']").hide();
        });
    };

    function findEmailAdd () {
        // Find the email address inside the class "gravityflow-status-box-field"
        var emailAddressElement = $('.gravityflow-status-box-field').find('.gravityflow-status-box-field-value li');
        var emailAddressText = emailAddressElement.text().trim();
        var emailAddressMatch = emailAddressText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

        // Check if emailAddressMatch is not null
        if (emailAddressMatch !== null) {
            var emailAddress = emailAddressMatch[0];

            // Create a link with the email address
            var emailLink = $('<a>').attr({
                href: 'https://utak.upd.edu.ph/wp-admin/users.php?s=' + emailAddress,
                target: '_blank',
                style: 'text-decoration: none; color: #000'
            }).text(emailAddress);

            // Append the email link after the existing text
            emailAddressElement.html(emailAddressText.replace(emailAddress, emailLink.prop('outerHTML')));
        } else {
            console.log("Email address not found");
        }
    };

    //Disabled as of April 3, 2024 due to bug
    function sortWorkflow () {
      var options = $('#gravityflow-form-select option');
        options.detach().sort(function(a, b) {
            var aText = $(a).text().toUpperCase();
            var bText = $(b).text().toUpperCase();
            return (aText < bText) ? -1 : (aText > bText) ? 1 : 0;
        });
        $('#gravityflow-form-select').append(options);
    };


    GM_addStyle("body {background-color:} #site-header {border-bottom: 2rem solid; background:#000;} .primary-menu a, li.menu-item {border-right: none;} .primary-menu a:hover, .primary-menu a:focus, .primary-menu .current_page_ancestor {background: #343434;} button, .faux-button, .wp-block-button__link, .wp-block-file .wp-block-file__button, input[type=button], input[type=reset], input[type=submit], .bg-accent, .bg-accent-hover:hover, .bg-accent-hover:focus, :root .has-accent-background-color, .comment-reply-link {background-color: #000;} .entry-title {color: #000;} .primary-menu li.current-menu-item>a:hover, .primary-menu li.current-menu-item>.link-icon-wrapper>a:hover, .primary-menu li.current-menu-item>a:focus, .primary-menu li.current-menu-item>.link-icon-wrapper>a:focus {background: #eca62c45;} #post-body.columns-2 #postbox-container-1{width: 300px;}");

    hideWorkflow ();
    hideWorkflowAdmin ();



});