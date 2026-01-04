// ==UserScript==
// @name         Increase Gemini chat width
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Increase Gemini chat box width to 100%
// @author       ȼaptain-jøhn-søap-mactavish
// @license      MIT
// @match        https://gemini.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536918/Increase%20Gemini%20chat%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/536918/Increase%20Gemini%20chat%20width.meta.js
// ==/UserScript==
(
    function()
    {
        'use strict';

        // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
        function runWhenReady
        (
        ReadySelector,
         Callback
        )
        {
            var NumAttempts=0;

            var TryNow=function()
            {
                var Elem=document.querySelector(ReadySelector);

                if(Elem)
                {
                    Callback(Elem);
                }
                else
                {
                    NumAttempts++;

                    if(NumAttempts>=34)
                    {
                        console.warn(`Width script: giving up after 34 attempts. Could not find: ${ReadySelector}`);
                    }
                    else
                    {
                        setTimeout
                        (
                            TryNow,
                            250*Math.pow(1.1,NumAttempts)
                        );
                    }
                }
            };

            TryNow();
        }

        // Function to apply width adjustment to the elements returned by the getElementsCallback
        function applyWidth
        (
        GetElementsCallback
        )
        {
            const Elements=GetElementsCallback();

            for(let i=0;i<Elements.length;i++)
            {
                Elements[i].style.setProperty('max-width','100%','important');
            }
        }

        // Generic function to observe mutations and apply width adjustments
        function observeMutations
        (
        GetElementsCallback
        )
        {
            const Observer=new MutationObserver
            (
                function(Mutations)
                {
                    let EventRegistrationCount=0;

                    Mutations.forEach
                    (
                        function(Mutation)
                        {
                            if(Mutation.type==='childList')
                            {
                                EventRegistrationCount++;
                            }
                        }
                    );

                    if(EventRegistrationCount>0)
                    {
                        applyWidth(GetElementsCallback);
                    }
                }
            );

            Observer.observe
            (
                document.documentElement,
                {
                    childList: true,
                    subtree: true
                }
            );
        }

        // Check the domain and apply the corresponding logic
        const Hostname=window.location.hostname;

        if(Hostname === 'gemini.google.com')
        {
            const GetElements = () => document.querySelectorAll('.conversation-container, .input-area-container, .ng-star-inserted');

            runWhenReady
            (
                '.conversation-container, .input-area-container, .ng-star-inserted',
                function()
                {
                    applyWidth(GetElements);
                    observeMutations(GetElements);
                }
            );
        }
    }
)();
