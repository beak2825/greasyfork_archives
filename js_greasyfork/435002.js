// ==UserScript==
// @name         Selected Temple Names count
// @namespace    jones.clan
// @version      0.1
// @description  shows how many temple neames are selected displays it next to the check box
// @author       Ryan Jones, Trent Jones
// @match        https://www.familysearch.org/temple/*
// @icon         https://www.google.com/s2/favicons?domain=familysearch.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435002/Selected%20Temple%20Names%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/435002/Selected%20Temple%20Names%20count.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    var currentPath = document.URL;
    var interval;

    const setUpSpan = () =>{

     const headerElement = document.querySelectorAll('th');

        if(headerElement.length>1) {

            headerElement[1].style.transition = 'padding 0.5s linear';
            headerElement[1].style.paddingLeft = "68px";
            headerElement[1].insertAdjacentHTML('beforeend', '<span id="Trent:personCount" style="position: relative;left: -140px;font-weight: 100;top: -1px;color: #177C9C;" />');

            interval = setInterval(()=>{
                    if(currentPath!==document.URL) {
                        clearInterval(interval);
                        currentPath = document.URL;
                        setUpSpan();
                    } else {

                        const checkedLength = document.querySelectorAll('tbody tr input[type="checkbox"]:checked').length;
                        const spacer = checkedLength < 10 ? ' ' : '';

                        document.getElementById('Trent:personCount').replaceChildren(checkedLength>0?`${spacer}(${checkedLength})`:'');
                    }
            },100);
        }
        else{
            setTimeout(()=>{
                setUpSpan();
            },1000);
        }
    };

    setUpSpan();

})();