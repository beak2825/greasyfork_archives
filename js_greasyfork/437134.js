// ==UserScript==
// @name Page Overscroll
// @namespace -
// @version 0.4
// @description creates element to make page overscrollable.
// @author NotYou
// @include *
// @compatible Chrome 4.0
// @compatible Edge 9.0
// @compatible Firefox 3.5
// @compatible Safari 3.2
// @compatible Opera 9.6
// @grant none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/437134/Page%20Overscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/437134/Page%20Overscroll.meta.js
// ==/UserScript==

/*

﹀ Change Log ﹀

0.4 Version:
- jQuery to Pure JS

0.3 Version:
- Anti Feauture Information
- Less CSS

0.2 Version:
- Less usseless text in CSS
- Shorter HTML code
- Compatible info

*/

document.querySelector('body').insertAdjacentHTML('beforeend',`
<div id=overscroll><style>
#overscroll {padding: 0px 0px 100%}
</style></div>
`)