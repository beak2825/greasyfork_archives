// ==UserScript==
// @name         X-Interactive Teamleader Styling
// @description  Add X-Interactive style to teamleader
// @author       DuctTape
// @version      0.5
// @match        https://mijn.x-interactive.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x-interactive.nl
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1217891
// @downloadURL https://update.greasyfork.org/scripts/479961/X-Interactive%20Teamleader%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/479961/X-Interactive%20Teamleader%20Styling.meta.js
// ==/UserScript==

GM_addStyle ( `
#container-1010-innerCt {
  background-color: #D30000 !important;
}

.app-leftnav-item.g-tip.selectedtab {
  background-color: #D30000 !important;
}

.app-leftnav .app-leftnav-main > li.selectedtab span.text {
  border-left: 3px solid #D30000 !important;
}

.textlink, .skin-infini strong, .skin-ticketshome tr.ticketrow strong {
  color: #D30000 !important;
}

.skin-linkbutton.green, .smalllabel-active {
  background-color: #D30000 !important;
  border-color: #D30000 !important;
}

.skin-togglebar.x-toolbar-default .x-btn-pressed {
  background-color: #D30000 !important;
}

.skin-planner .item {
  background-color: #D30000 !important;
  border-color: #D30000 !important;
}

.skin-filter .filter.active .label .caption {
  color: #D30000 !important;
}

.skin-mastertab {
  margin-top: 5px;
  background-color: #D30000 !important;
}

.skin-mastertab-items .skin-mastertab-item {
  background-color: #D30000 !important;
}

.skin-linkbutton.selected  {
  background-color: #D30000 !important;
  border-color: #D30000 !important;
}

.skin-mastertab-items .skin-mastertab-item.current a {
  color: #FFF;
}

.skin-mastertab-items .skin-mastertab-item a {
  color: #FFF;
}

li.skin-mastertab-item.current {
  border-bottom: 3px solid #ab0202 !important;
}

.skin-appdlg > .header {
  background-color: #D30000 !important;
}

.skin-form .x-field:not(.x-form-type-checkbox) .x-form-field {
  border: 1px solid #ddd;
  border-bottom: none;
  padding: 5px;
}

.icon[style*="background-image:url(/img/32/gift.png)"] {
  background-size: 24px;
}

.icon[style*='background-image:url(/img/32/notify.png)'] {
  margin-top: 3px;
}

.pln-task-duration {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}
` );