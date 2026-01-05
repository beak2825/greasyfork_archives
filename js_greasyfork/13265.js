// ==UserScript==
// @name         CSW textbox auto-focuser
// @namespace    mobiusevalon.tibbius.com
// @version      0.1
// @description  Does what it says on the tin
// @author       Mobius Evalon
// @include      /^https{0,1}:\/\/ops.cielo24.com\/mediatool\/transcription\/jobs.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13265/CSW%20textbox%20auto-focuser.user.js
// @updateURL https://update.greasyfork.org/scripts/13265/CSW%20textbox%20auto-focuser.meta.js
// ==/UserScript==

var textarea = document.getElementById("plaintext_edit");
if(textarea !== undefined) textarea.focus();