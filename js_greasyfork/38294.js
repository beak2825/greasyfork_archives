// ==UserScript==
// @name         AWS Console Improved
// @description  Smaller navigation menu and fonts. Shorter service names.
// @author       Skilling
// @version      0.1
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/169956
// @downloadURL https://update.greasyfork.org/scripts/38294/AWS%20Console%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/38294/AWS%20Console%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var css = `
  * {
    -webkit-font-smoothing: antialiased;
  }

  table tr th div[__gwt_header^="header-gwt-uid-"] div,
  table tr th[__gwt_header^="header-gwt-uid-"] div,
  #gwt-debug-distributionsTable table th div div {
    font-size: 12px;
    font-family: Arial;
  }

  table tr td div[__gwt_cell^="cell-gwt-uid-"],
  #gwt-debug-distributionsTable table tr td div {
    font-size: 11px;
    font-family: Arial;
  }

  .gwt-ListBox[multiple] { height: 500px; }
  .gwt-TextArea { height: 200px !important; }

  #awsgnav #nav-logo {
    width: 40px !important;
    margin-left: 35px !important;
    margin-right: 25px !important;
  }
  #awsgnav .nav-menu .nav-elt-label,
  #awsgnav .service-link .service-label {
    font-size: 13px;
    font-family: Arial;
  }
  #awsgnav #nav-servicesMenu .nav-elt-label,
  #awsgnav #nav-shortcutBar { padding-left: 0; }
  #awsgnav #nav-shortcutBar .service-link { margin-left: 0; }
  #awsgnav #nav-menu-right { padding-right: 0; }
`,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

  style.type = 'text/css';

  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);

  //
  // BEGIN
  // Make AWS Console shortcuts take up less space
  // by James Ducker (https://gist.github.com/jamesinc/9bec28bac4f57743c3bdb4f1e531a0d9)
  //

  var replaceLabel = function (item) {
    switch (item.innerHTML) {
      case 'Relational Database Service':
        item.innerHTML = 'RDS';
        break;
      case 'Elastic Container Service':
        item.innerHTML = 'ECS';
        break;
      case 'Database Migration Service':
        item.innerHTML = 'DMS';
        break;
      case 'Simple Email Service':
        item.innerHTML = 'SES';
        break;
      case 'Simple Notification Service':
        item.innerHTML = 'SNS';
        break;
      case 'Simple Queue Service':
        item.innerHTML = 'SQS';
        break;
      case 'Certificate Manager':
        item.innerHTML = 'SSL';
        break;
    }
  };

  document.querySelectorAll('.service-label').forEach(replaceLabel);

  window.dispatchEvent(new Event('resize'));

  //
  // Make AWS Console shortcuts take up less space
  // END
  //
})();