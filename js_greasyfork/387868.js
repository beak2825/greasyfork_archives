// ==UserScript==
// @name         WebChat Widget v2 - AXA IE
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.axa.ie
// @include      https://www.axa.ie/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387868/WebChat%20Widget%20v2%20-%20AXA%20IE.user.js
// @updateURL https://update.greasyfork.org/scripts/387868/WebChat%20Widget%20v2%20-%20AXA%20IE.meta.js
// ==/UserScript==

// ***********************
// * Begin Configuration *
// ***********************
var environment = "mypurecloud.ie";
var orgId = "dd15c607-71d0-404d-b823-b295f3feb6e6"; // Purecloud France
//var deploymentKey = "be86c996-bfa5-4b9e-b5e9-2de1c1cf2fad";
var deploymentKey = "9910c63e-baef-4a58-8070-ebcc75f27588";
var queue = "AXA UK";
var buttonText = "Need assistance?";
var addressStreet = "1 rue Marie de Kerstrat";
var addressCity = "Thorigné-Fouillard";
var addressPostalCode = "35235";
var addressState = "Bretagne";
var phoneNumber = "+33680854089";
var phoneType = "Cell";
var customerId = "59606";
// *********************
// * End Configuration *
// *********************

(function() {
    'use strict';

    //advanced config
    function getAdvancedConfig() {
        return {
            form: {
                autoSubmit: false,
                firstname: 'Guy',
                lastname: 'Tarre',
                email: 'guy.tarre.demo@gmail.com',
                subject: ''
            },
            formJSON: {
                wrapper: '<table></table>',
                inputs: [
                    // Default fields
                    {
                        id: 'cx_webchat_form_firstname',
                        name: 'firstname',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'First Name'
                    },
                    {
                        id: 'cx_webchat_form_lastname',
                        name: 'lastname',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'Last Name'
                    },
                    {
                        id: 'cx_webchat_form_email',
                        name: 'email',
                        maxlength: '100',
                        placeholder: 'Optional',
                        label: 'Email'
                    },
                    {
                        id: 'cx_webchat_form_subject',
                        name: 'subject',
                        maxlength: '100',
                        placeholder: 'Optional',
                        label: 'Subject'
                    }
                ]
            }
        };
    }

    // Inject the scripts we need to execute chat
    var scriptB = document.createElement('script');
    scriptB.type = 'text/javascript';
    scriptB.async = true;
    scriptB.onload = function(){
        // remote script has loaded
        CXBus.configure({debug:false,pluginsPath:`https://apps.${environment}/widgets/9.0/plugins/`});
        CXBus.loadPlugin('widgets-core');
        const customPlugin = CXBus.registerPlugin('Custom');
        window._genesys = {
            widgets: {
                webchat: {
                    transport: {
                        type: 'purecloud-v2-sockets',
                        dataURL: `https://api.${environment}`,
                        deploymentKey : deploymentKey,
                        orgGuid : orgId,
                        interactionData: {
                            routing: {
                                targetType: 'QUEUE',
                                targetAddress: queue,
                                priority: 2
                            }
                        }
                    },
                    userData: {
                        //addressStreet: addressStreet,
                        //addressCity: addressCity,
                        //addressPostalCode: addressPostalCode,
                        //addressState: addressState,
                        //phoneNumber: phoneNumber,
                        //phoneType: phoneType,
                        //customerId: customerId,
                        // These fields should be provided via advanced configuration
                        firstName: 'Guy',
                        lastName: 'Tarre',
                        email: 'guy.tarre.demo@gmail.com',
                        subject: ''
                    }
                }
            }
        };

        var button = document.createElement("Button");
        button.innerHTML = buttonText;
        button.id = "btnStartChat";
        button.style = "top:270px;right:-15px;position:fixed;z-index:99999;padding:10px;transform: rotate(-90deg);";
        button.className = "btn btn-primary";
        //var topDiv = document.getElementsByClassName("hero-banner-content-wrapper defaqto-banner-content-wrapper container-fluid")[0];
        //topDiv.appendChild(button);
        document.body.appendChild(button);

        // **********

        // Setup the button click action to start the chat session
        document.getElementById("btnStartChat").onclick = function() {
            console.log('Chat clicked');
            customPlugin.command('WebChat.open', getAdvancedConfig());
        };
    };
    scriptB.src = `https://apps.${environment}/widgets/9.0/cxbus.min.js`;
    document.getElementsByTagName('head')[0].appendChild(scriptB);
    console.log("Chat script loaded");

    // AltoCloud
    //(function(a,t,c,l,o,u,d){a['_genesysJourneySdk']=o;a[o]=a[o]||function(){
    //(a[o].q=a[o].q||[]).push(arguments)},a[o].l=1*new Date();u=t.createElement(c),
    //d=t.getElementsByTagName(c)[0];u.async=1;u.src=l;u.charset='utf-8';d.parentNode.insertBefore(u,d)
    //})(window, document, 'script', 'https://apps.mypurecloud.ie/journey/sdk/js/web/v1/ac.js', 'ac');
    //ac('init', '334eca88-f072-4981-96a5-5f2ca16b6fbf', { region: 'euw1' });
    //ac('pageview');

})();