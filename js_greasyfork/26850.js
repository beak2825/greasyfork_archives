// ==UserScript==
// @name        Reddit Sidebar Collapser
// @namespace   dudo
// @include     https://*.reddit.com*
// @version     1
// @grant       GM_addStyle
// @run-at      document-start
// @description:en Collapses sidebar and adds button to toggle it's visibility
// @description Collapses sidebar and adds button to toggle it's visibility
// @downloadURL https://update.greasyfork.org/scripts/26850/Reddit%20Sidebar%20Collapser.user.js
// @updateURL https://update.greasyfork.org/scripts/26850/Reddit%20Sidebar%20Collapser.meta.js
// ==/UserScript==

GM_addStyle(`
body > .content {
margin-right: 0px !important;
}

.side {
	position: fixed;
	right: 0;
	z-index: 555;
	overflow-y: auto;
	height: auto;
	top: 40px;
	bottom: 0px;
	overflow-x: hidden;
	border-left: 2px solid #969696 !important;
	border-radius: 5px;
	border-top: 2px solid #969696 !important;
  width: 330px;
  //transition: 0.3s ease-in-out;
  padding: 5px !important;
  margin: 0 !important;
  display:none;
}

#toggleside {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTJDBGvsAAAAsElEQVQ4T62TzQmEMBCFPaUG6/FkYQuCYAfpY0+Cp4UFC7AAQbAJ972QCctgdHb18EFm8t7LD0nhvXfgAWawGaGWHseAJjb/oWHAGosKsLZALT0rC0nTojOCLw1i8xdSgKYHIyi/entkA2RHEzgKSQFcUUwa7kQbhaDh4CnFDi+gjULQZCeA+QiaAbyB+RJlRS04474Aeco10KIc1NITnvKVz9QygN+5A0tsWqAWHu8+a69IkjjajnAAAAAASUVORK5CYII=");
  background-size: 16px 16px;
  width: 16px;
  height: 16px;
  display: inline-block;
  //padding: 3px;
  position: fixed;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: #9C9C9C;
  opacity: 0.7;
}
#toggleside:hover {
  opacity: 1;
}
.res-floater-visibleAfterScroll {
	right: 28px !important;
}
.sideHidden {
display: none !important;
//opacity: 0;
//padding: 0px !important;
//border: 0px !important;
//width:0px;
//transition: 0.2s ease-in-out;
}
            `);
document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

function DOM_ContentReady () {

GM_addStyle(`
.side {
display:block;
}
`);
var toggleSideBt = document.createElement("div");
toggleSideBt.setAttribute('id','toggleside');
toggleSideBt.title = "toggle sidebar";
toggleSideBt.onclick = function(){showhide();};
document.body.appendChild(toggleSideBt)

function showhide()
{
  var sidebar = document.querySelector(".side");
  var visible = sidebar.className.indexOf("sideHidden") === -1;

  if(visible)
    {
      sidebar.className += " sideHidden";
    }
  else
    {
      sidebar.className = sidebar.className.replace(" sideHidden","");
    }

}

showhide();
}