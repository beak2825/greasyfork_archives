// ==UserScript==
// @name         * - Voice IN voice input trigger
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Improve Voice IN extension by dispatching input events 
// @author       Untiy16
// @license      MIT
// @match        *://*/*
// @exclude      https://www.atbmarket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=silpo.ua
// @require      https://raw.githubusercontent.com/Untiy16/links/master/jQueryMod-3.7.1-no-conflict.js#sha384=9Yrn245SmfrViewuGHURMDbyV8WnI+sZxpoY7qcliR+941oQoejbYA94IYy+L6jo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498309/%2A%20-%20Voice%20IN%20voice%20input%20trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/498309/%2A%20-%20Voice%20IN%20voice%20input%20trigger.meta.js
// ==/UserScript==

//https://dictanote.co/voicein - extetion site
'use strict';
(function($) {
    function dd(str){console.log(str)}
    const mode = 'append';//append, replace
    //-------------- TRIGGER VOICE INPUT SECTION START ---------------//
    let secondaryInterval = false;
    let voiceSearchValue = '';
    let mainInterval = setInterval(() => {
        let $q = $('input:focus').first();
        if ($q.length && $('#voicein_container').length && $($('#voicein_container')[0].shadowRoot).find('#voicein_voicebox').is(':visible')) {
            voiceSearchValue = $($('#voicein_container')[0].shadowRoot).find('#voicein_voicebox').text();
            if (!secondaryInterval) {
                secondaryInterval = setInterval(() => {
                    dd('voice input active')
                    if (!$($('#voicein_container')[0].shadowRoot).find('#voicein_voicebox').is(':visible')) {
                        dd('voice input done')
                        dd('q.value', $q.val());
                        dd('voiceSearchValue', voiceSearchValue);
                        clearInterval(secondaryInterval);
                        secondaryInterval = false;
                        dd(['$q.val()', $q.val()]);
                        dd(['$q[0].value', $q[0].value]);
                        setTimeout(function() {
                            if (!$q.val() && !$q[0].value){
                                if (mode === 'append') {
                                    dd(1)
                                    // $q.val($q.val() + voiceSearchValue);
                                    $q[0].value = $q[0].value + voiceSearchValue;
                                } else {
                                    dd(2)
                                    if ($q.val() !== voiceSearchValue) {
                                        $q.val(voiceSearchValue.trim());
                                    }
                                }
                                dd(mode)

                                voiceSearchValue = '';
                            }
                            $q.trigger('input').trigger('change');
                            $q[0].dispatchEvent(new Event('input', { bubbles: true }));
                            $q[0].dispatchEvent(new Event('change', { bubbles: true }));
                            
                        }, 300);

                    }

                }, 100);
            };
        }
    }, 500);
    //-------------- TRIGGER VOICE INPUT SECTION END ---------------//
})(jQueryMod);