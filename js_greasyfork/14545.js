// ==UserScript==
// @name        Lily Luna Potter
// @description “The scar had not pained Harry for nineteen years. All was well.”
// @namespace   http://tripu.info/
// @version     0.1.0
// @include     http*://elespanol.com*
// @include     http*://www.elespanol.com*
// @license     GNU General Public License v3.0 only
// @license     https://spdx.org/licenses/GPL-3.0.html
// @supportURL  http://tripu.info/
// @author      tripu
// @downloadURL https://update.greasyfork.org/scripts/14545/Lily%20Luna%20Potter.user.js
// @updateURL https://update.greasyfork.org/scripts/14545/Lily%20Luna%20Potter.meta.js
// ==/UserScript==

'use strict'

var yes = function() { return true  }
var no  = function() { return false }

jeef.debug = true
jeeiSite.hp.Wizard.prototype.isMuggle      = no
jeeiSite.hp.Wizard.prototype.isGryffindor  = yes
jeeiSite.hp.Wizard.prototype.isRavenclaw   = yes
jeeiSite.hp.Wizard.prototype.isHufflepuff  = yes
jeeiSite.hp.Wizard.prototype.isSlytherin   = yes
jeeiSite.hp.Wizard.prototype.isParselMouth = yes
