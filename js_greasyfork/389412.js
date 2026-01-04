// ==UserScript==
// @name         Imgur Link Fixer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Removes spaces from imgur links
// @author       AColdFloor
// @match        https://imgur.com/a/*
// @include      https://imgur.com/gallery/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389412/Imgur%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/389412/Imgur%20Link%20Fixer.meta.js
// ==/UserScript==
function onElementInserted(containerSelector, elementSelector, callback) {

    var onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var elements = $(mutation.addedNodes).find(elementSelector);
                for (var i = 0, len = elements.length; i < len; i++) {
                    callback(elements[i]);
                }
            }
        });
    };

    var target = $(containerSelector)[0];
    var config = { childList: true, subtree: true };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(onMutationsObserved);
    observer.observe(target, config);

}

onElementInserted('body', '.post-image-description', function(element) {
    var description = $(element);
    var text = description.text();
    $(description.text().match(/(https?:\/\/[^\s].+)/gm)).each(function(i,a){
        var spaced = a;
        var fixed = a.replace(/\s/gm, '');
        var newLink = "<a target=\"_BLANK\" class=\"previewPlease\"href=\""+fixed+"\">"+fixed+"</a>";
        text = text.replace(spaced,newLink);
    });
    description.html(text);
})

$( document ).ready(function() {
    $(".post-image-description").each(function(){
        var description = $(this);
        var text = description.text();
        $(description.text().match(/(https?:\/\/[^\s].+)/gm)).each(function(i,a){
            var spaced = a;
            var fixed = a.replace(/\s/gm, '');
            var newLink = "<a target=\"_BLANK\" class=\"previewPlease\"href=\""+fixed+"\">"+fixed+"</a>";
            text = text.replace(spaced,newLink);
        });
        description.html(text);
    });
});