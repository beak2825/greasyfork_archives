// ==UserScript==
// @name        Remove LinkedIn Try Premium button
// @namespace   nickpapoutsis
// @description Removes Try Premium button in LinkedIn
// @include     http*://www.linkedin.com/*
// @version     1.0
// @grant       none
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAFXRFWHRDcmVhdGlvbiBUaW1lADYvMjQvMDn2wWvjAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M0BrLToAAAAY9QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWJ+8Upq2DFJ4BklsVJu4CU1zCU5zTpWyV5+7DlN4B0twB0tvCU50C1mEC1+NDFF3DGWWDmSRD2iYEFV5EmuaE1d7FGeTFVp9FWGKFW2cGFyAGHCeGmCDG3OgHWKFHnWiIGSHIXikI2iLJHumJmuNKG6PKH2oK3CSK4CrLnSVLoOtL2iDMHaXMYavM3maNHOQNIixNXaUNnycN4uzOX6eOX+fOo21O3SLPIKiPY2yPY2zPZC3PoqtP4WkP42xQJO5QoinQ5W7RYuqRpi9SIOfSI+sSZu/S5KvS5OwTJ3BTpe6T6DDUYGXUpq2UqPFVZy5VabHV566WKjJWafHW4eaW6vLXaHAYa7NYqC+Yq3MY6LBZ6K9aq7Kbq3Hc7LMdJindbjTgbTLhL/VicDXi6u5j8TZornErL7GuMbNxdDVy9ng1dzg19fX2tra3Nzc3ODh3t7e5ubm6Ojo6urq7e3t7+/v8fHx9PT09vb2+fn5+/v7/f39/////8EcrgAAABN0Uk5TAAEFBgcSFxiGh4+a1Nra4+Pm6f7wNSIAAAFdSURBVDjLrZM7T8NAEIS/tTfOA0hogIqHgJKWv4BA8HNB/AsaKjoEgoKHCDKKbdZ3RxEHUHKWKJhmdJrRzu7enQC93gkxXJYlCCyfjjpJRPf2fvGB0D9b84WPGJJ+8nxeKNlqUUUTnHVXsyLleDAJIRRPuaZhDnW2fqNM62/sk78tFCk8iisBhjB8WUxxKN4DCBDp1KM4B5CPeHeRRlEsA7iLDoKhOA/wBKxjb9Dv5TVkK+mswtRwBFyxfQj5+KAPk4fXrDHU9azJGhPobAEs7ZUFUJPgzcxMRMTsVkQGIiIiumtm9jOFAG5Kk1t2BtBxTYSfN4wfGS7BwDV7WDBcw93W9IhHCfMGB+OGCfOrnm18xv5PhkjEN/t/iXDpz+X/JjzgEDYz2vF5r3hLW3XnUSYjazVojlIVibTowSpUSs1Eol8vhKoUSVLpdOMlQmXBKTRvqgUiItKqhhC+ALfVx6MKijHaAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/28424/Remove%20LinkedIn%20Try%20Premium%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/28424/Remove%20LinkedIn%20Try%20Premium%20button.meta.js
// ==/UserScript==

// Credit for code goes to SO

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
document.getElementById("spotlight-one-nav-item").remove();