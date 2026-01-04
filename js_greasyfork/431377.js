// ==UserScript==
// @match        https://telex.hu/*
// @match        https://444.hu/*
// @match        https://hvg.hu/*
// @match        https://disqus.com/*
// @match        https://www.origo.hu/*
// @match        https://www.blikk.hu/*
// @match        https://index.hu/*
// @match        https://velvet.hu/*
// @name         Bübüke
// @namespace    null
// @license      MIT
// @version      1.0
// @description  Társadalmi félszegségek
// @author       gidiigekau
// @match        https://*/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431377/B%C3%BCb%C3%BCke.user.js
// @updateURL https://update.greasyfork.org/scripts/431377/B%C3%BCb%C3%BCke.meta.js
// ==/UserScript==
 
'use strict';
 
var $ = window.jQuery;
 
String.prototype.bubukefiltej = function(){
    return this.replace(/Zs/g,'S')
        .replace(/zs/g,'s')
        .replace(/ssz/g,'ss')
        .replace(/Sz/g,'Cs')
        .replace(/sz/g,'cs')
        .replace(/[ae]z/ig,'$&s')
        .replace(/R/g,'J')
        .replace(/r/g,'j')
        .replace(/ás/g, 'ács')
        .replace(/ly/g, 'j')
        .replace(/C/g, 'T')
        .replace(/c/g, 't')
        .replace(/ts/g, 'cs')
        .replace(/azs ([aáeéiíoóöőuúüű]+?)/g, 'a zs$1')
        .replace(/ [a]zst/ig,' $&at')
        .replace(/ [e]zst/ig,' $&et');
}
 
function bubuke(){
    $('body :not([data-tita]):not(script):not(style):not(img):not(noscript)').contents().each(function(i) {
        if (i > 10000) {
            return false;
        }
        if(this.nodeType === 3){
            if(!$(this).parents('.textarea').length){
                $(this).parent().attr('data-tita', 1);
                this.nodeValue = this.nodeValue.bubukefiltej();
            }
        }
    });
    setTimeout(function(){bubuke();},5000);
}
 
$(document).on('click.post_action_button','.post-action__button',function(e){
    var ta = $(e.target).parents('.textarea-wrapper').find('.textarea p');
    ta.text(ta.text().bubukefiltej());
});
 
$(document).ready(function(){
    bubuke();
});