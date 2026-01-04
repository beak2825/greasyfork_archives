// ==UserScript==
// @name         test
// @namespace    lzt
// @version      0.6
// @description  расширение для форума lolzteam
// @author       MeloniuM
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468312/test.user.js
// @updateURL https://update.greasyfork.org/scripts/468312/test.meta.js
// ==/UserScript==

let i = 0;
let turn = true;
let data;
while(turn){
    data = XenForo.ajax('/conversations/', {'page': i});
    console.log(data);
    if (data.templateHtml == ""){
        turn = false;
        console.log('done');
    }else{
        i++;
        console.log(i);
        $(data.templateHtml).each(function( index ) {
            XenForo.ajax('/conversations/'+ $( this ).attr('data-cid') +'/insert-reply', {'message_html': '<p>test message</p>'})
        });
        
    }
}