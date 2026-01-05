// ==UserScript==
// @name            wykopDeSpoilerator2
// @description     Odkrywa spoilery na wykopie
// @version         2017.05.09.2335
// @author          opsomh
// @namespace       https://greasyfork.org/users/30-opsomh
// @grant           none
// @include         http://www.wykop.pl/*
// @include         https://www.wykop.pl/*
// @downloadURL https://update.greasyfork.org/scripts/5179/wykopDeSpoilerator2.user.js
// @updateURL https://update.greasyfork.org/scripts/5179/wykopDeSpoilerator2.meta.js
// ==/UserScript==

var main = function(){
"use strict";

function showSpoiler(context){
    $('.showSpoiler', context).each(function(){
        $(this).hide().next("code").show().addClass('spoilerBody');
    })
}

var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
        $(mutation.addedNodes).each(function(){
            showSpoiler(this);
        })
    })
})

var target = $('#itemsStream, #owncontent').get(0);

showSpoiler(target);

observer.observe(target, {'childList': true, 'subtree': true});
}

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);

