// ==UserScript==
// @name         Periscope fake check
// @namespace    https://volafile.org/user/saltboy
// @version      1.0
// @description  Checks periscope stream for fakes
// @author       saltboy
// @match        https://www.pscp.tv/*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381344/Periscope%20fake%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/381344/Periscope%20fake%20check.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var source = document.getElementsByName('twitter:text:broadcast_source')[0].getAttribute('content');
 
    if (source === 'producer') {
        createFakeAlert();
    } else {
        createInfoBox();
    }
 
    function createFakeAlert() {
        var box = document.createElement('div');
        box.id = 'AlertBox';
        box.textContent = "Fake detected: The source of this video is 'producer', so they might be using a video. ";
        document.body.appendChild( box );
    }
 
    function createInfoBox() {
        var box = document.createElement('div');
        box.id = 'InfoBox';
        box.textContent = source;
        document.body.appendChild( box );
    }
 
    GM_addStyle(`
        #AlertBox {
            color: #fff;
            border: 2px solid #f00;
            position: absolute;
            top: 78px;
            right: 8px;
            max-width: 400px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 30px;
            min-height: 32px;
            padding: 6px 20px;
            font-size: 14px;
        }
 
        #InfoBox {
            color: #fff;
            position: absolute;
            top: 78px;
            right: 8px;
            max-width: 400px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 30px;
            min-height: 32px;
            padding: 6px 17px;
            font-size: 14px;
        }
    `);
})();