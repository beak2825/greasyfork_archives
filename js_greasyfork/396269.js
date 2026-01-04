// ==UserScript==
// @name         þorn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  torn js library
// @author       Xradiation
// @grant        none
// ==/UserScript==

'use strict';
//windows rightalt+<
//mac ??
var þ = (function () {

    'use strict';

    //methods object
    var ç = {};

    ç.test = (function(x){
        var µ = {};
        µ.localStorage = function(){
            try {
                localStorage.fluffyunicorn = 'f';
                localStorage.removeItem('fluffyunicorn');
                return true;
            } catch(e) {
                return false;
            }
        }

        µ.sessionStorage =function(){
            try {
                sessionStorage.fluffyunicorn = 'f';
                sessionStorage.removeItem('fluffyunicorn');
                return true;
            } catch(e) {
                return false;
            }
        }

        µ.version = function(){
            return 'thorn 0.1';

        }

        return µ;
    })()

    ç.encode = function(text, key, mode){
        var letters = (mode)?'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''):'ZYXWVUTSRQPONMLKJIHGFEDCBA9876543210zyxwvutsrqponmlkjihgfedcba'.split('');
        key = (typeof key == 'number')? key.toString():key;
        var textArr=text.split('');
        var keyArr=key.split('');
        var z=0;
        let coded =[];
        textArr.forEach(function(item){
            let indexTemp= letters.indexOf(item) + parseInt(keyArr[z]);
            let index= indexTemp-letters.length*parseInt(indexTemp/letters.length);
            coded.push(letters[index]);
            (z>=(keyArr.length -1))?z=0:z++;
        });
        return coded.join('');
    }
    return ç;

})();
var thorn = þ;

//so i can test it in console
window.þ=þ;
window.thorn = thorn;