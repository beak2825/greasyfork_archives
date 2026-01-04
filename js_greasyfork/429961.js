// ==UserScript==
// @name         pmdice

// @namespace    http://pmdice.com
// @version      0.1
// @description  auto-rolling. Alefa Barea
// @author       You
// @match        http://pmdice.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429961/pmdice.user.js
// @updateURL https://update.greasyfork.org/scripts/429961/pmdice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tienMin='0.0006';
            var heSoNhan =[1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

            var tiendanh=tienMin;
            var indexheSoNhan=1;
            setInterval(function(){
                document.querySelector('#mfInputAmount').value=tiendanh;
                document.querySelector('#btnplaymb').click();
                setTimeout(function(){
                    if(document.querySelector('.label-danger')!==null){
                        indexheSoNhan+=1;
                        tiendanh=tienMin*heSoNhan[indexheSoNhan];
                    }
                    if(document.querySelector('.label-success')!==null){
                         indexheSoNhan=1;
tiendanh=tienMin*heSoNhan[indexheSoNhan];


                    }

                }, 2000);
            }, 3000);
})();