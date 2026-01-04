// ==UserScript==
// @name     				Github dashboard sidebar right
// @author  				a-wing
// @version  				1.1
// @grant    				none
// @include  				https://github.com/
// @include  				https://github.com/*dashboard*
// @namespace https://greasyfork.org/users/186363
// @description Github dashboard UI sidebar right
// @downloadURL https://update.greasyfork.org/scripts/368168/Github%20dashboard%20sidebar%20right.user.js
// @updateURL https://update.greasyfork.org/scripts/368168/Github%20dashboard%20sidebar%20right.meta.js
// ==/UserScript==

document.querySelector('.dashboard-sidebar')?document.querySelector('.dashboard-sidebar').style.cssFloat = 'right':null;
