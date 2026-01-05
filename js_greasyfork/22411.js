// ==UserScript==
// @name         PageEditor
// @namespace    https://ardenxie.weebly.com
// @version      1.2
// @description  Allows you to edit web pages easily for taking fake screenshots or videos!
// @author       Arden Xie
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @copyright    2016 Arden Xie
// @icon         http://nationhost.co.uk/images/128x128/copy_page.png
// @downloadURL https://update.greasyfork.org/scripts/22411/PageEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/22411/PageEditor.meta.js
// ==/UserScript==

function edit(){
 document.body.contentEditable='true';
 document.designMode='on';
 void 0;
}
edit();