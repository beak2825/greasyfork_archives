// ==UserScript==
// @name         Roblox-Friends-List-Fix
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Fixes friends lists for users located in countries where the friends list is hidden.
// @author       matas3535
// @homepage     https://github.com/matas3535/roblox-friends-list-fix
// @supportURL   https://github.com/matas3535/roblox-friends-list-fix/issues
// @match        https://www.roblox.com/*
// @match        https://roblox.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542652/Roblox-Friends-List-Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/542652/Roblox-Friends-List-Fix.meta.js
// ==/UserScript==
//
(function()
{
    'use strict';
    //
    const original_fetch = window.fetch;
    const original_open = XMLHttpRequest.prototype.open;
    const original_send = XMLHttpRequest.prototype.send;
    //
    window.fetch = function(...args)
    {
        return original_fetch.apply(this, args).then(response =>
        {
            const url = args[0];
            //
            if (typeof url === 'string' && url.includes('apis.roblox.com/access-management/v1/upsell-feature-access?featureName=MustHideConnections'))
            {
                return response.clone().json().then(data =>
                {
                    const new_data =
                    {
                        ...data,
                        access: "Denied"
                    };
                    //
                    return new Response(JSON.stringify(new_data), 
                    {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            };
            //
            return response;
        });
    };
    //
    XMLHttpRequest.prototype.open = function(method, url, ...args)
    {
        this._url = url;
        //
        return original_open.apply(this, [method, url, ...args]);
    };
    //
    XMLHttpRequest.prototype.send = function(...args)
    {
        if (this._url && this._url.includes('apis.roblox.com/access-management/v1/upsell-feature-access?featureName=MustHideConnections'))
        {
            const original_state_change = this.onreadystatechange;
            //
            this.onreadystatechange = function()
            {
                if (this.readyState === 4 && this.status === 200)
                {
                    try
                    {
                        const data = JSON.parse(this.responseText);
                        //
                        const new_data =
                        {
                            ...data,
                            access: "Denied"
                        };
                        //
                        Object.defineProperty(this, 'responseText',
                        {
                            value: JSON.stringify(new_data),
                            writable: false
                        });
                        //
                        Object.defineProperty(this, 'response',
                        {
                            value: JSON.stringify(new_data),
                            writable: false
                        });
                    }
                    catch (eggsception)
                    {
                        console.error('Invalid response override:', eggsception);
                    };
                };
                //
                if (original_state_change)
                {
                    original_state_change.apply(this, arguments);
                };
            };
        };
        //
        return original_send.apply(this, args);
    };
    //
    console.log('Loaded');
})();