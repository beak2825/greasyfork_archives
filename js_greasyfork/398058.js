// ==UserScript==
// @name         SBS Mathquill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use math formula input box instead of plain input box
// @author       You
// @match        https://sbsprobability.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398058/SBS%20Mathquill.user.js
// @updateURL https://update.greasyfork.org/scripts/398058/SBS%20Mathquill.meta.js
// ==/UserScript==

var DOMURL = null;

function replaceInputMQ(element) {
    function createInputMQ() {
        console.log('Input replaced');
        var MQ = MathQuill.getInterface(2);
        var latexField = MQ.MathField(preview, {
            handlers: {
                edit: function() {
                    input.setAttribute('data-value', latexField.latex());
                    input.value = '_';
                    submit.removeAttribute('disabled');
                    submit.classList.remove('disabled');
                }
            }
        });
    }
    var input = element.getElementsByClassName('mleditor-elem-input')[0];
    input.style = 'display: none';
    var preview = element.getElementsByClassName('preview_content')[0];
    var submit = element.getElementsByClassName('input_submit')[0];
    preview.innerHTML = null;
    preview.style = 'min-width:10em;';
    preview.classList.remove('empty');
    createInputMQ();
}

function onNodeChange() {
    if (DOMURL === window.location.toString()) return;
    DOMURL = window.location.toString();
    console.log('Changes detected');
    var inputs = document.getElementsByClassName('input_body');
    if (!inputs) return;
    for (var i = 0; i < inputs.length; i++) {
        replaceInputMQ(inputs[i]);
    }
}

(function() {
    'use strict';

    var injectNode = document.createElement('link');
    injectNode.setAttribute('rel', 'stylesheet');
    injectNode.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css');
    document.body.append(injectNode);
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js', function () {
        // install observer
        var observer = new MutationObserver(onNodeChange);
        var config = { attributes: false, childList: true, subtree: true };
        var targetNode = document.getElementById('main');
        observer.observe(targetNode, config);
    });
})();
