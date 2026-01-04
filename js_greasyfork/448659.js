// ==UserScript==
// @name         answers.unity $$anonymous$$ Fix
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.0
// @description  fixes persistent text issue of '$$anonymous$$' replacing 'M' everywhere
// @include      https://answers.unity.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://greasyfork.org/scripts/447533-findandreplacedomtext-v-0-4-6/code/findAndReplaceDOMText%20v%20046.js?version=1074625
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=unity.com
// @downloadURL https://update.greasyfork.org/scripts/448659/answersunity%20%24%24anonymous%24%24%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/448659/answersunity%20%24%24anonymous%24%24%20Fix.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    findAndReplaceDOMText(document.body, {
        find: '$$anonymous$$',
        replace: 'M'
    }
                         );

})(jQuery);