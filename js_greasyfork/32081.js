// ==UserScript==
// @name         Worker Queue Open All
// @namespace    https://github.com/Kadauchi
// @version      1.0.0
// @description  MTurk Crowd @Drwho10
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/tasks*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/32081/Worker%20Queue%20Open%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/32081/Worker%20Queue%20Open%20All.meta.js
// ==/UserScript==

$(`.btn-group.tasks-control`)
  .parent()
  .append(`<button type="button" class="btn btn-primary" style="margin-left: 10px;">Open All</button>`)
  .click(e=> $(`a[href^="/projects/"]:visible`).each((i, el) => window.open(el.href)));
