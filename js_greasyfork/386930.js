// ==UserScript==
// @name         Reassign buttons for RuleFlow
// @version      0.1
// @description  try to take over the world!
// @author       TB
// @match        https://ruleflow.moravia.com/Home/Open/*
// @grant        none
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/386930/Reassign%20buttons%20for%20RuleFlow.user.js
// @updateURL https://update.greasyfork.org/scripts/386930/Reassign%20buttons%20for%20RuleFlow.meta.js
// ==/UserScript==


var ruleId = window.location.href.match(/\/(\d+)/)[1];

var reassignToMeHTML = '<a href="/Home/Reassign/' + ruleId + '?targetAssignee=AnnaVa" role="button" class="btn btn-default" id="reassignAnna" data-tooltipeditor="" data-original-title="">Reassign to AnnaVa</a>';
var reassignToMichalHTML = '<a href="/Home/Reassign/' + ruleId + '?targetAssignee=michalr" role="button" class="btn btn-default" id="reassignMichal" data-tooltipeditor="" data-original-title="">Reassign to Michal</a>';

var parent = document.querySelector("#clone").parentElement;
var anna = document.createElement("a");
anna.innerHTML = reassignToMeHTML;
parent.prepend(anna);

var michal = document.createElement("a");
michal.innerHTML = reassignToMichalHTML;
parent.prepend(michal);
