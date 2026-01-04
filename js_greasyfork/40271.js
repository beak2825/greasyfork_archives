// ==UserScript==
// @name         Gigya Console Script
// @author       Miguel Ángel Romero Lluch
// @include      https://console.gigya.com*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description  Script to improve Gigya Console view.
// @version      1.0.1
// @namespace https://greasyfork.org/users/NNNNN
// @downloadURL https://update.greasyfork.org/scripts/40271/Gigya%20Console%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/40271/Gigya%20Console%20Script.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {

    /**
     * Function to render all changes
     */
    function renderChanges() {
        setTimeout(function() {
            // .a-label--card   - font-size: 12px;
            // .a-link  - font-size: 12px;
            // .gigya-editor__label   - font-size: 12px;
            // .gigya-editor   - width: 400px;
            // .m-card-control__plain-text, .m-card-control__text-value   - font-size: 12px;
            // .m-card-control--multiselect .m-card-control__select-item-value   - font-size: 12px;
            // .a-control--datepicker .a-control__content    - font-size: 10px;
            // .gigya-editor__value    - font-size: 10px;
            // .o-ida-user-details__content-wrapper    -     min-width: 1000px;
            var obj = "";
            obj = $(".a-label--card");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"12px"});
            }

            obj = $(".card-title.a-title.a-title--card");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-weight":"bold"});
            }

            obj = $(".a-link");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"12px"});
            }

            obj = $(".gigya-editor__label");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"12px"});
            }

            obj = $(".gigya-editor");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"width":"470px"});
            }

            obj = $(".m-card-control__plain-text, .m-card-control__text-value");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"12px"});
            }

            obj = $(".m-card-control--multiselect .m-card-control__select-item-value");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"12px"});
            }

            obj = $(".a-control--datepicker .a-control__content");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"10px"});
            }

            obj = $(".gigya-editor__value");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"font-size":"10px"});
            }

            obj = $(".o-ida-user-details__content-wrapper");
            if (('undefined' !== typeof obj) && (obj) && (obj.length)) {
                obj.css({"min-width":"1050px"});
            }

            //obj.css({"background-color":"#ffd351", "border-color":"#ffd351", "color":"#594300"});
        }, 2000);
    }

    //Loop to set changes each n seconds
    //var intervalTime = setInterval(function() {
    //  if (/\bview=planning\b/.test(location.search) ) {
    renderChanges();
    //  }
    //},1000);

});
