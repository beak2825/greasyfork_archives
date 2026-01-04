// ==UserScript==
// @name         Aliexpress Warehouse Changer
// @namespace    
// @version      0.2
// @description  Let's you choose warehowse!
// @author       You
// @match        *://*.aliexpress.com/wholesale*
// @match        *://*.aliexpress.com/category*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437566/Aliexpress%20Warehouse%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/437566/Aliexpress%20Warehouse%20Changer.meta.js
// ==/UserScript==

/*global $*/
/*jshint esversion: 8 */

(function() {
    'use strict';
    //var $;

    // Your code here...
    (async () => {
        await import('https://code.jquery.com/jquery-2.2.4.min.js')
        // Library ready
        //console.log($('.nav-breadcrumb'));
        //$( '<a class="_xawcx_whs" data-warehouse="PL" href="' + window.location.href + '&shipFromCountry=PL">From Poland</a> - <a href="' + window.location.href + '&shipFromCountry=CZ">From Checz</a>' ).insertBefore( ".nav-breadcrumb" );
        $([
            '<a class="_xawcx_whs_clr" href="javascript:void(0)">x Clear</a>',
            '<a class="_xawcx_whs" data-warehouse="PL" href="javascript:void(0)">Poland</a>',
            '<a class="_xawcx_whs" data-warehouse="CZ" href="javascript:void(0)">Checz</a>' ,
            '<a class="_xawcx_whs" data-warehouse="CN" href="javascript:void(0)">China</a>' ,
            '<a class="_xawcx_whs" data-warehouse="RU" href="javascript:void(0)">Russia</a>' ,
            '<a class="_xawcx_whs" data-warehouse="ES" href="javascript:void(0)">Spain</a>',
            '<a class="_xawcx_whs" data-warehouse="FR" href="javascript:void(0)">France</a>',
            '<a class="_xawcx_whs" data-warehouse="US" href="javascript:void(0)">USA</a>'
        ].join(' - ')).insertBefore( ".nav-breadcrumb" );

        $('._xawcx_whs').click(function(){
            var whs = $(this).attr('data-warehouse');
            localStorage.setItem('whs', whs);

            //console.log($(this));
            window.location.href = window.location.href + '&shipFromCountry=' + whs;
        });

        $('._xawcx_whs_clr').click(function(){
            localStorage.removeItem('whs');

            //console.log($(this));
            window.location.href = window.location.href + '&shipFromCountry=';
        });

        var getAllUrlParams = (url) => {

            // get query string from url (optional) or window
            var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

            // we'll store the parameters here
            var obj = {};

            // if query string exists
            if (queryString) {

                // stuff after # is not part of query string, so get rid of it
                queryString = queryString.split('#')[0];

                // split our query string into its component parts
                var arr = queryString.split('&');

                for (var i = 0; i < arr.length; i++) {
                    // separate the keys and the values
                    var a = arr[i].split('=');

                    // set parameter name and value (use 'true' if empty)
                    var paramName = a[0];
                    var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                    // (optional) keep case consistent
                    //paramName = paramName.toLowerCase();
                    //if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                    // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                    if (paramName.match(/\[(\d+)?\]$/)) {

                        // create key if it doesn't exist
                        var key = paramName.replace(/\[(\d+)?\]/, '');
                        if (!obj[key]) obj[key] = [];

                        // if it's an indexed array e.g. colors[2]
                        if (paramName.match(/\[\d+\]$/)) {
                            // get the index value and add the entry at the appropriate position
                            var index = /\[(\d+)\]/.exec(paramName)[1];
                            obj[key][index] = paramValue;
                        } else {
                            // otherwise add the value to the end of the array
                            obj[key].push(paramValue);
                        }
                    } else {
                        // we're dealing with a string
                        if (!obj[paramName]) {
                            // if it doesn't exist, create property
                            obj[paramName] = paramValue;
                        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                            // if property does exist and it's a string, convert it to an array
                            obj[paramName] = [obj[paramName]];
                            obj[paramName].push(paramValue);
                        } else {
                            // otherwise add the property
                            obj[paramName].push(paramValue);
                        }
                    }
                }
            }

            return obj;
        }
        console.log('getAllUrlParams', getAllUrlParams().shipFromCountry, typeof(getAllUrlParams().shipFromCountry));

        if((localStorage.getItem('whs') || '').length > 0 && typeof(getAllUrlParams().shipFromCountry) == 'undefined'){
            window.location.href = window.location.href + '&shipFromCountry=' + localStorage.getItem('whs');
            console.log('ADD URL WHS');
        }else{
            console.log('DO NOT ADD URL WHS');
        }

        // regular check if page changed
        setInterval(() => {
            if((localStorage.getItem('whs') || '').length > 0 && typeof(getAllUrlParams().shipFromCountry) == 'undefined'){
                window.location.href = window.location.href + '&shipFromCountry=' + localStorage.getItem('whs');
                console.log('ADD URL WHS');
            }
        }, 1000);


    })();

})();