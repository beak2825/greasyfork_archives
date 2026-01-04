// ==UserScript==
// @name        auto invuller smartschool
// @namespace   Violentmonkey Scripts
// @match       https://oauth.smartschool.be/OAuth/index/platformchooser*
// @grant       none
// @version     1.0
// @author      sudoShiba
// @description 13/03/2024, 14:33:33
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489725/auto%20invuller%20smartschool.user.js
// @updateURL https://update.greasyfork.org/scripts/489725/auto%20invuller%20smartschool.meta.js
// ==/UserScript==
document.getElementById("platformchooser_form__platform").value = "slhd.smartschool.be";
document.getElementById("platformchooserSubmitButton").disabled = false;
document.getElementById("platformchooserSubmitButton").click()