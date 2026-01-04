// ==UserScript==
// @name         Auto Deca answer
// @namespace    https://greasyfork.org/zh-CN/scripts/453593-auto-deca-answer
// @version      1.1
// @license      GNU LGPLv3
// @description  Deca daily quest answer input automatically ，save your time for searching.
// @run-at       document-end
// @author       clown(clownvay@gmail.com)
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        *deca.art/decagon/dxp*
// @require https://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/453593/Auto%20Deca%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/453593/Auto%20Deca%20answer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function(){
        const imgNode = $('img[alt="Deca - Name that NFT art"]');
        const imgSrc =decodeURIComponent($(imgNode).attr('src'));
        const tokenId = imgSrc.match(/\d+(?=\?)/)[0];
        $.get(`https://token.artblocks.io/${tokenId}`,function(res){
            const answer=res.name.split('#')[0];
            $('#submission').attr('value',answer);
        })
    },5000)

})();