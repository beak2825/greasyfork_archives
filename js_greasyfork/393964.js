// ==UserScript==
// @name         Typeracer - don't delete typed text
// @version      0.0.0
// @description  Don't delete correctly typed words in TypeRacer. Useful for context-dependent speech recognition users.
// @match        *://play.typeracer.com/*
// @namespace    https://greasyfork.org/users/410786
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393964/Typeracer%20-%20don%27t%20delete%20typed%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/393964/Typeracer%20-%20don%27t%20delete%20typed%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function assert(cond) {
        if(!cond)
            throw new Error("Assertion failed!");
    }

    const keydownevent= document.createEvent("KeyboardEvent");
    var initMethod = typeof keydownevent.initKeyboardEvent !== 'undefined' ?
        "initKeyboardEvent" : "initKeyEvent";

    keydownevent[initMethod](
        "keydown", // event type: keydown, keyup, keypress
        true,      // bubbles
        true,      // cancelable
        window,    // view: should be window
        false,     // ctrlKey
        false,     // altKey
        false,     // shiftKey
        false,     // metaKey
        0,         // keyCode: unsigned long - the virtual key code, else 0
        0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
    );

    function work(y){ // y = old input box
        if(y.nextElementSibling===null||
           y.nextElementSibling.tagName.toLowerCase()!=='textarea'){

            const x=document.createElement('textarea'); // new input box
            x.classList.add('txtInput');
            x.style.height = '6em';
            y.parentNode.appendChild(x);

            /* // Unused code: keep track of changes in y value to compute shift value
            let lastyval=x.value=y.value;
            assert(lastyval==='');
            y.addEventListener('change',function(event){
                if(y.value===lastyval)
                    return;
                assert(y.value==='');
                lastyval=y.value;
                if(y.disabled){
                    x.value=''
                }
            }); */

            x.addEventListener('keyup',function(event){
                if(y.disabled){
                    x.value='';
                    return;
                }
                const beforeitem=document.querySelector('span[unselectable=on]');
                const shift=(beforeitem===null||beforeitem.innerText.slice(-1)!==' ' ? 0 :
                             beforeitem.innerText.length);
                // There are at most 4 such items. The first one may be already-shifted
                // or going-to-type (if shift = 0). Relies on TypeRacer always split on
                // spaces and the already-shifted span ends with a space.
                y.value=x.value.substr(shift);
                y.dispatchEvent(keydownevent);
            })

            y.addEventListener('focus',function(event){
                event.preventDefault();
                x.focus();
                setTimeout(function(){x.focus();},0); // why is this necessary?
            })
        }

        const x=y.nextElementSibling;
        assert(x.tagName.toLowerCase()==='textarea');
        if(y.disabled){
            x.style.display='none';
            y.style.visibility='';
            y.style.height='';
        }else{
            x.style.display='';
            y.style.visibility='hidden';
            y.style.height='0px';
        }
    }

    new MutationObserver(function(mutations){
        for(const mutation of mutations){
            //for(const node of mutation.addedNodes){
            const node=mutation.target;
            if(node.tagName&&node.tagName.toLowerCase()==='input'&&
               node.classList.contains('txtInput')){
                work(mutation.target);
            }
            //}
        }
    }).observe(document.body, {childList:true,subtree:true,attributes:true});

    const y=document.querySelector('input.txtInput');
    if(y!==null)
        work(y);
})();