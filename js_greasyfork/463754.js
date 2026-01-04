// ==UserScript==
// @name            Fuck awesomeopensource.com
// @description     Add direct links to Github repositories when browsing awesomeopensource.com
// @icon            https://i.ibb.co/vw2zQSh/fuck-awesome.png
// @namespace       https://github.com/peterrauscher
// @match	    *://awesomeopensource.com/projects/*
// @grant           none
// @version         1.0.1
// @downloadURL https://update.greasyfork.org/scripts/463754/Fuck%20awesomeopensourcecom.user.js
// @updateURL https://update.greasyfork.org/scripts/463754/Fuck%20awesomeopensourcecom.meta.js
// ==/UserScript==

window.onload = () => {
  Array.from(document.querySelectorAll(".aos_project_container .aos_project_title a")).forEach((e) => {
    e.href = e.href.replace("https://awesomeopensource.com/project", "https://github.com");
  });
}