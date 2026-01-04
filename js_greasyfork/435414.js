// ==UserScript==
// @name         mihome4u.co.uk — Better UI
// @description  Improve the UI on the mihome4u.co.uk website.
// @author       Rafal Enden
// @namespace    https://github.com/rafenden
// @homepageURL  https://github.com/rafenden/userscripts/blob/master/mihome4u-better-ui
// @supportURL   https://github.com/rafenden/userscripts/issues
// @license      MIT
// @version      1.0
// @match        *://www.mihome4u.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435414/mihome4ucouk%20%E2%80%94%20Better%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/435414/mihome4ucouk%20%E2%80%94%20Better%20UI.meta.js
// ==/UserScript==

'use strict'

// Fix the button size.
document.querySelectorAll('.small.green.btn--set-timers').forEach(button => button.classList.remove('small'))

// Remove shadow.
document.querySelectorAll('#button_dial circle').forEach(svg => svg.setAttribute('filter', ''))

// Add favicon.
const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
link.type = 'image/x-icon'
link.rel = 'shortcut icon'
link.href = 'https://energenie4u.co.uk/favicon.ico'
document.querySelector('head').appendChild(link)

function applycss(css) {
  const head = document.getElementsByTagName('head')[0]
  const s = document.createElement('style')
  s.setAttribute('type', 'text/css')
  s.appendChild(document.createTextNode(css))
  head.appendChild(s)
}

applycss(`
body a.btn.btn-green, body #content form input[type=submit],
body #content #new-device #new-device-button a,
.pair-double-light-button,
.first-pairing-button {
  background: #5AB946; border: 0; border-radius: 0; box-shadow: none; border: 0; text-transform: uppercase;
}

.first-pairing-button { background-color: #D25D94; }

body #content #devices .device,
body #content .data-layout .data-container,
body #content .subdevice-selection .subdevice-type {
  box-shadow: none; background: none; border-radius: 0;
}

body #content #devices .device { margin-left: -5px; }

body #content #devices .device .subdevices, body #content #devices .device .advanced-info, body #content #devices .device .settings { margin-left: -10px; }

body #content #devices .device .advanced-info { margin-left: 0; }

body #content #devices .device .subdevices .subdevice, body #content .subdevice-selection .subdevice-type { border: 1px solid #dddddd; padding-bottom: 15px; }

a:hover, button:hover, input:hover, body #content #devices .device .subdevices .subdevice ul.actions li.usage:hover { opacity: 0.8 }

a:active, button:active, input:active, body #content #devices .device .subdevices .subdevice ul.actions li.usage:active { opacity: 0.4 }

input[type=text], input[type=password], input[type=number] { border: 1px solid #dddddd; }
input[type=text]:focus, input[type=password]:focus, input[type=number]:focus { border: 1px solid #aaa !important; opacity: 1; }

body #content form dl dd input { border: 1px solid #ddd; padding: 5px; }

body #content form dl dd input[type=checkbox] { vertical-align: middle; }

body #content .data-layout .data-container .value-list li, body #content .data-layout .data-container .value-list.half-size { box-shadow: none; }

body #content .data-layout .data-container { width: 478px; }

body #content #devices .device .subdevices .subdevice .power-switch-block .power-switch a.power-button.off {border-color: #e5b7b7;}

body #content #devices .device .subdevices .subdevice .power-switch-block .power-switch a.power-button.on { border-color: #c3e7bc; }

body #content #devices .device .subdevices .subdevice .power-switch-block .power-switch a.power-button { border-radius: 0; }

#dropshadow circle { display: none; }

body a.btn.btn-small { width: auto; padding: 10px; }

body #content .data-layout .data-container .big-pound-sign.positive { opacity: 0.1; }

body #content .timer-block .days-block .day-block, body #content .thermostat-override-block .days-block .day-block { background: #eee; cursor: pointer; border-color: #777679; }

body #content .timer-block .days-block .day-block.active, body #content .thermostat-override-block .days-block .day-block.active { background: #5AB946; color: white; }

.meter, .meter span.bar { border-radius: 0; background-image: none; }
`)