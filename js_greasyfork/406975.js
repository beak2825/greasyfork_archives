// ==UserScript==
// @name         Blackboard Mark Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix the padding to view marks on blackboard
// @author       Skye Eyks
// @match        https://myclassroom.cput.ac.za/webapps/bb-social-learning-BB5d0888eb02bcc/execute/mybb?cmd=display&toolId=MyGradesOnMyBb_____MyGradesTool
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406975/Blackboard%20Mark%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/406975/Blackboard%20Mark%20Viewer.meta.js
// ==/UserScript==

var mainFrame = null, frame = null, streamDetail = null;

function fixMark()
{
    mainFrame = document.getElementsByTagName("iframe");
    console.log(mainFrame);
    if(mainFrame.length > 0) mainFrame = mainFrame[0].contentWindow.document;
    else return;

    frame = mainFrame.getElementsByTagName("iframe");
    if(frame.length > 0) frame = frame[0].contentWindow.document;
    else return;

    streamDetail = frame.querySelector("#streamDetail");
    if(streamDetail != null) streamDetail.style.padding = "20px 35px 50px 35px";
    else return;
} setInterval(fixMark, 1000);