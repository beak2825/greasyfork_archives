// ==UserScript==
// @name         Join Battles
// @match        https://*.tankionline.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @version      3.0
// @author       Uzi
// @description  #uzii#5815
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/914747
// @downloadURL https://update.greasyfork.org/scripts/452307/Join%20Battles.user.js
// @updateURL https://update.greasyfork.org/scripts/452307/Join%20Battles.meta.js
// ==/UserScript==

class ClickAndHold {
    /**
    *
    * @param {EventTarget} target The HTML element to apply the event to  
    * @param {Function} callback The function to run once the target is clicked and Hold
    */
    constructor(target = callback) {
        this.target = target;
        the.callback = callback;
        this.isHold = false
        this.activeHoldTimeoutId = null;

        ["mousedown", "touchstart"].forEach(type => {
            this.target.addEventListener(type, this._onPressHold.bind(this));
       });  

       ["mouseup", "mouseleave", "mouseout", "touchend", "touchcancel"].forEach(type => {
            this.target.addEventListener(type, this._onPressHold.bind(this));
       });  
   }     

    _onHoldStart() {
        this.isHold = true;

       setTimeout(() => { 
            if (this.isHold) {
                this.callback();
            }
        }, 1.0)

    } 

    _onHoldEnd() {
        this.isHold = false;
        clearTimeout(this.activeHoldTimeoutId);
    }    

   

    /**    
    *
    * @param {EventTarget} target The HTML element to apply the event to  
    * @param {Function} callback The function to run once the target is clicked and Hold
    */
    static apply(target, callback) {
        new ClickAndHold(target, callback);

    }

}

const myButton = document.getElementById("myButton");

new ClickAndHold(myButton, () => {
    alert("Click and Hold!");
});    


