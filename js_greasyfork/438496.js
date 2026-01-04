// ==UserScript==
// @name         REA Listing Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add link to property listing on REA
// @author       You
// @match        https://www.realestate.com.au/property-*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://realestate.com.au&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438496/REA%20Listing%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/438496/REA%20Listing%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main(){
        const LUT = {
            'alley': 	  'ally',
            'arcade': 	  'arc',
            'avenue': 	  'ave',
            'boulevard':  'bvd',
            'bypass':	  'bypa',
            'circuit':	  'cct',
            'close':	  'cl',
            'corner':	  'crn',
            'court':	  'ct',
            'crescent':	  'cres',
            'cul-de-sac': 'cds',
            'drive':	  'dr',
            'esplanade':  'esp',
            'green':	  'grn',
            'grove':	  'gr',
            'highway':	  'hwy',
            'junction':	  'jnc',
            'lane':	      'lane',
            'link':	      'link',
            'mews':	      'mews',
            'parade':	  'pde',
            'place':	  'pl',
            'ridge':	  'rdge',
            'road':	      'rd',
            'square':	  'sq',
            'street':	  'st',
            'terrace':	  'tce',
        }

        const $el = jQ('.property-info-address');
        const el = $el[0];
        const address = el.textContent;

        const [street, suburb, state_postcode] = address.split(', ');
        const streetArr = street.split(' ');

        const streetNumber = streetArr[0];
        streetArr[0] = streetNumber.replace(/(\d+)\/(\d+)/, 'unit-$1-$2')

        const streetType = streetArr[streetArr.length-1];
        const streetTypeAbr = LUT[streetType.toLowerCase()];
        streetArr[streetArr.length-1] = streetTypeAbr;
        const [state, postcode] = state_postcode.split(' ');

        const uriAddress = [...streetArr, suburb, state, postcode]
        .map(e => e.replace(' ', '-'))
        .join('-')
        .toLowerCase();

        const url = 'https://www.realestate.com.au/property/' + uriAddress;

        $el.wrap(jQ('<a href="' + url + '"></a>'));
    }

    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    // load jQuery and execute the main function
    addJQuery(main);
})();