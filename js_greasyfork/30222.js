// ==UserScript==
// @name         Go to empty queue
// @namespace    https://github.com/Kadauchi
// @version      1.0.0
// @description  Goes to the empty queue page after you have fininshed all assigned tasks
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30222/Go%20to%20empty%20queue.user.js
// @updateURL https://update.greasyfork.org/scripts/30222/Go%20to%20empty%20queue.meta.js
// ==/UserScript==

const submitted = $(`.mturk-alert-content:contains(The HIT has been successfully submitted.)`);
if (submitted) window.location.href = `https://worker.mturk.com/tasks`;
