// ==UserScript==
// @name          www.indianadriver.com Enable Continue
// @namespace     www.indianadriver.com Enable Continue
// @description   www.indianadriver.com Enable Continue (Ignores Read Timer)
// @shortcutKeys  [Ctrl + `] Activate Absolute Right Click Mode To Force Remove Any Type Of Protection
// @author        KurariaHunter
// @version       1.2
// @include       https://www.indianadriver.com/course-area/topic.php
// @homepageURL   https://greasyfork.org/en/scripts/23772
// @icon          https://image.ibb.co/jXPFd5/cursor_128.png
// @compatible    Chrome Google Chrome + Tampermonkey
// @license       BSD
// @copyright     KurariaHunter, All Right Reserved (2017-Jul-25)
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/31746/wwwindianadrivercom%20Enable%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/31746/wwwindianadrivercom%20Enable%20Continue.meta.js
// ==/UserScript==

$(".btn_continue").removeAttr("disabled");
