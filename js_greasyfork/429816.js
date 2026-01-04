// ==UserScript==
// @name        Empornium Nice Notifications
// @description Clickable notification alerts
// @namespace   Empornium Scripts
// @version     1.2.0
// @author      vandenium
// @grant       none
// @include     /^https://www\.empornium\.(me|sx|is)\/*/

// @downloadURL https://update.greasyfork.org/scripts/429816/Empornium%20Nice%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/429816/Empornium%20Nice%20Notifications.meta.js
// ==/UserScript==

// Changelog:
// Version 1.2.0
//  - Removing Forum Notifications update in 1.1.0
// Version 1.1.0
//  - Add forum subscription notifications
// Version 1.0.1
//  - Bugfix: Fix issue of applying to only first alert.
// Version 1.0.0
//  - Initial version.
// Todo:

const alertBarContainers = document.querySelectorAll('div#alerts div.alertbar');

// If no alertbar, exit.
if (alertBarContainers.length > 0) {
  const alertsContainer = document.querySelector('div#alerts');

  // Return individual RGB values from rgb string.
  function getRGB(str) {
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match ? {
      red: match[1],
      green: match[2],
      blue: match[3]
    } : {};
  }

  // Preserve notification bar color from style sheet.
  const computedStyle = window.getComputedStyle(alertBarContainers[0]);
  const originalAlertBackgroundColor = computedStyle.backgroundColor;
  const originalAlertColor = computedStyle.color;

  const rgb = getRGB(originalAlertBackgroundColor);
  const hoverAlertBackgroundColor = `rgb(${rgb.red * 1 - 50}, ${rgb.green * 1 - 50}, ${rgb.blue * 1 - 50})`;

  var css = `div#alerts a:hover{ background-color: ${hoverAlertBackgroundColor} !important;}`;
  var style = document.createElement('style');

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.querySelector('head').appendChild(style);

  // Update notification alerts style
  alertBarContainers.forEach(alertBar => {
    alertBar.classList.remove('alertbar');
  })

  const alerts = alertsContainer.querySelectorAll('a');

  alerts.forEach(alert => {
    alert.style.cssText = `
      width: 100%;
      background-color: ${originalAlertBackgroundColor};
      color: ${originalAlertColor};
      display: inline-block;
      vertical-align: middle;
      text-decoration: none;
      font-size: 14px;
      line-height: 25px;
      border-radius: 25px;
      margin: 5px;
      font-weight: bold;
    `;
  });
}
