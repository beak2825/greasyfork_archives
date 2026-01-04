// ==UserScript==
// @name         Blackboard sidekick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script for blackboard
// @author       Diotima
// @match        https://online.manchester.ac.uk/webapps/blackboard/content/listContent.jsp?course_id=*
// @grant        none
// @license      MIT 
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/452715/Blackboard%20sidekick.user.js
// @updateURL https://update.greasyfork.org/scripts/452715/Blackboard%20sidekick.meta.js
// ==/UserScript==

ImportCss();
ScriptWithJquery();

function ImportCss() {
    var jqueryScriptBlock = document.createElement('style');
    jqueryScriptBlock.type = 'text/css';
    jqueryScriptBlock.innerHTML = "#play {position:fixed;bottom:50%;left:1px;border:1px solid gray;padding:3px;width:12px;font-size:12px;cursor:pointer;border-radius: 3px;}";
    document.getElementsByTagName('head')[0].appendChild(jqueryScriptBlock);
   ntms.widget._AutoTimer.prototype._static.MIN_INTERVAL_MS=0
}

function autoplay(){
    $(document.body).append("<div id='play'>PLAY</div>");
}
