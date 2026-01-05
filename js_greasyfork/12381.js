// ==UserScript==
// @name           New Blank
// @description Blank Name
// @version       0.1
// @include       *
// @icon        https://cdn2.iconfinder.com/data/icons/animals/48/Panda.png  
// @author        Blank
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/12381/New%20Blank.user.js
// @updateURL https://update.greasyfork.org/scripts/12381/New%20Blank.meta.js
// ==/UserScript==

var ele = document.getElementsByTagName('*');
for (var f = 0; f < ele.length; f++){
    if(ele[f].children.length == 0){
        ele[f].setAttribute('title', ele[f].tagName + '['+Array.prototype.slice.call(document.getElementsByTagName(ele[f].tagName)).indexOf(ele[f])+']');
    }
}
