// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license ur mum
// @downloadURL https://update.greasyfork.org/scripts/437415/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/437415/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let ret_link= function(elements){
        if(elements.length==0){
            console.log('A')
            return 0;
        }
        else if(elements.tagName=='A'){
            console.log('B')
            return elements;
        }
        else{
            console.log('C')
            if(elements.constructor.name=='HTMLCollection'){
                return ret_link(elements[0])
            }
            index=0;
            for(let i=0; i<elements.childNodes.length; ++i){
                if(elements.childNodes[i].tagName=='A'){
                    index=i;
                    break
                }
                if(elements.childNodes[i].tagName=='DIV'){
                    index=i;
                }

            }
            return ret_link(elements.childNodes[index]);
        }
    }

    let linkno=1;
    let search_results = document.querySelectorAll('.g')
    for(let i=0; i<search_results.length; ++i){
        if(search_results[i].className=='g'){
            search_results[i].children[0].outerText='a'
        }
    }
})();