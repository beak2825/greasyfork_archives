// ==UserScript==
// @name         Markdown Preview in txti
// @namespace    https://gist.github.com/AeonFr/f44a8b6f175d059f8328638a6a30ce4d
// @version      0.1
// @description  When EDITING a txti (txti.es/*/edit) in txti.es you should be able to preview your changes (a toggle preview button appears)
// @author       Francisco Cano
// @match        http://txti.es/*/edit
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/1.3.0/showdown.min.js
// @downloadURL https://update.greasyfork.org/scripts/23191/Markdown%20Preview%20in%20txti.user.js
// @updateURL https://update.greasyfork.org/scripts/23191/Markdown%20Preview%20in%20txti.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function _(selector){
        return document.querySelector(selector);
    }
    window.addEventListener('load', function(){
        initMarkdownPreview();
    });
    var converter = false;
    function initMarkdownPreview(){
        if( _('#content-input') ){
            var elt = document.createElement('div'),
                converter =  new showdown.Converter();
            elt.id = 'content-preview';
            elt.style.display = 'none';
            _('#create-a-txti').insertBefore(elt, _('#content-input'));
            var contentToMarkdownPreviewer = function(){
                var result = converter.makeHtml(  _('#content-input').value );
                elt.innerHTML = result;
            };
            _('#content-input').addEventListener('keyup', contentToMarkdownPreviewer);
            // Fire the conversion the first time, when page is loaded
            contentToMarkdownPreviewer();
            var elt2 = document.createElement('div');
            elt2.innerHTML = '<a href="content-input" action="toggle-preview">Toggle Preview</a>';
            _('#create-a-txti').insertBefore(elt2, _('#content-preview'));
            elt2.addEventListener('click', function(e){
                e.preventDefault();
                if ( _('#content-input').style.display != 'none' ){
                    _('#content-input').style.display = 'none';
                    _('#content-preview').style.display = 'block';
                }else{
                    _('#content-input').style.display = 'block';
                    _('#content-preview').style.display = 'none';
                }
            });
        }
    }
})();