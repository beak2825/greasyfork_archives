// ==UserScript==
// @name         To Print xiaoeknow
// @namespace    Jalen.Z
// @version      0.4
// @description  删除小鹅通打印限制和遮盖的元素
// @author       Jalen
// @match      *.xiaoeknow.com/*
// @exclude      *.xiaoeknow.com/p/course/video/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454536/To%20Print%20xiaoeknow.user.js
// @updateURL https://update.greasyfork.org/scripts/454536/To%20Print%20xiaoeknow.meta.js
// ==/UserScript==

;(() =>{

    // Your code here...
    function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }}
    function removeElementsById(idName){
    var id = document.getElementById(idName);
    id.remove();
    }
    function removePrint(){
        const text = '@media print';

        for (const match of document.querySelectorAll('style')) {
        if (match.textContent.includes(text)) {
            let matches = match;
            matches.remove()
            <!--console.log(matches); -->
      }
}

    }
    function deleteElement() {
        removeElementsByClass("tabs-container is-fixed");
        removeElementsByClass("btn-menu");
        removeElementsByClass("market-invite-btn market-btn-wrt");
        removeElementsByClass("course_bottom_float_conatainer");
        removePrint();
        console.log("delete successfully");
    }
    setTimeout(deleteElement,3000);

    })();

