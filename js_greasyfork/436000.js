// ==UserScript==
// @name        alertsColoring
// @namespace   Violentmonkey Scripts
// @match       https://kaltura.app.opsgenie.com/alert/list#
// @version     1.1.5
// @author      vludanenkov
// @description updated 6/15/2022
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436000/alertsColoring.user.js
// @updateURL https://update.greasyfork.org/scripts/436000/alertsColoring.meta.js
// ==/UserScript==



GM_addStyle(".og-alert-item {margin-top: 0px !important; padding: 0px 2px 0px 2px !important; border-bottom: 1px !important;}");
GM_addStyle(".og-alert-item__main__tag-box {margin-top: 0px !important;}");
GM_addStyle(".og-alert-item__main__team-box {margin-top: 0px !important; padding: 0 !important; min-height: 14px !important;}");
GM_addStyle(".og-alert-item__left {margin-right: 2px !important;}");
GM_addStyle(".og-alert-item__numbers {margin-right: 4px !important;}");
GM_addStyle(".og-alert-item__main {padding-right: 4px !important;}");
GM_addStyle(".og-alert-item__right__action-box {height:14px!important; margin-top:2px !important;}");
GM_addStyle(".og-alert.og-alert-item__right__date{height:14px!important; margin-top:2px !important;}");

GM_addStyle(".og-advance-page__header {height:117px !important;}");
GM_addStyle(".og-advance-page__header__wrapper {padding-top:4px !important;}");
GM_addStyle(".og-advance-page__header__top {margin-bottom:0px !important;}");
GM_addStyle(".og-advance-page__header__query-box {margin-bottom:0px !important;}");

GM_addStyle(".og-advance-page__body__wrapper {padding: 0 5px !important;}");
GM_addStyle(".og-advance-page__body__saved-search {left: 0px !important; top: 111px !important}");
GM_addStyle(".og-advance-page__body__list {padding-left: 194px !important;}");


GM_addStyle(".og-advance-page__header__top__page-title b {font-size:12px !important;}");
GM_addStyle("button.primary {height:20px !important;line-height:20px !important}");
GM_addStyle("button.primary b {line-height:20px !important}");
GM_addStyle(".vue-og-dropdown.compact .vue-og-dropdown__button {height:20px !important;}");


var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o}),i.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1})},this},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t)})}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}c.call(this,e,t,r)},f},u=function(){function e(){var e={childList:!0,subtree:!0};return e}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t)})}function r(e,t){return l.matchesSelector(e,t.selector)}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r)},d},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);


// coloring
$(document).arrive(".og-tag", function() {
   if ($(this).html() == "<p>ovp</p>") {
     $(this).closest("a.og-alert-item").css('background-color', '#F1DEFF')
   }
});

$(document).arrive(".og-alert-item__main__title-box__title", function() {
   if ($(this).text().match(/VOD Proxy|Dotcom|Origin|DataLayer|Depleted|DataLayer/i)) {
      $(this).css({"border-style":"dotted","border-color":"OrangeRed"});
   }
   if ($(this).text().match(/\[FIRING:[2-3]\]/i)) {
      $(this).html($(this).html().replace(/(\[FIRING:[0-9]+\])/g,'<b style="color:brown">*$1*</b>'));
   }
});

$(document).arrive(".og-alert-item__main__title-box__title", function() {
   if ($(this).text().match(/VOD Proxy|Dotcom|Origin|DataLayer|Depleted|DataLayer/i)) {
      $(this).css({"border-style":"dotted","border-color":"OrangeRed"});
   }
   if ($(this).text().match(/\[FIRING:[4-9]\]/i)) {
      $(this).html($(this).html().replace(/(\[FIRING:[0-9]+\])/g,'<b style="color:crimson">*$1*</b>'));
   }
});

$(document).arrive(".og-alert-item__main__title-box__title", function() {
   if ($(this).text().match(/VOD Proxy|Dotcom|Origin|DataLayer|Depleted|DataLayer/i)) {
      $(this).css({"border-style":"dotted","border-color":"OrangeRed"});
   }
   if ($(this).text().match(/\[FIRING:[1-9]{1}[0-9]+\]/i)) {
      $(this).html($(this).html().replace(/(\[FIRING:[0-9]+\])/g,'<b style="color:red">*$1*</b>'));
   }
});

$(document).arrive(".og-tag", function() {
   if ($(this).html() == "<p>ott</p>") {
     $(this).closest("a.og-alert-item").css('background-color', '#FFDFAD')
   }
});

$(document).arrive(".og-tag", function() {
   if ($(this).html().match(/vfp2|vfp1/)) {
     $(this).closest("a.og-alert-item").css('background-color', '#C992A0')
   }
});

$(document).arrive(".og-tag", function() {
   if ($(this).html() == "<p>irp1</p>") {
     $(this).closest("a.og-alert-item").css('background-color', '#C992B0')
   }
});


$(document).arrive(".og-tag", function() {
   if ($(this).html() == "<p>reinvent</p>") {
     $(this).closest("a.og-alert-item").css('background-color', '#D66ADE')
   }
});

$(document).arrive(".og-tag", function() {
   if ($(this).html() == "<p>pitch</p>") {
     $(this).closest("a.og-alert-item").css('background-color', '#ADBCDB')
   }
});

$(document).arrive(".og-tag", function() {
   // if ($(this).html() == "<p>newrow</p>") {
   if ($(this).html().match(/newrow|kme/)) {
     $(this).closest("a.og-alert-item").css('background-color', '#BAF1C9')
   }
});

$(document).arrive(".og-tag", function() {
   // if ($(this).html() == "<p>newrow</p>") {
   if ($(this).html().match(/ppf/)) {
     $(this).closest("a.og-alert-item").css('background-color', '#87CEEB')
   }
});

$(document).arrive(".og-alert-item__main__title-box__title", function() {
   if ($(this).text().match(/VOD Proxy|Dotcom|Origin/)) {
     $(this).css('border-style', 'dotted');
   }
});


$(document).arrive(".og-tag", function() {
   if ($(this).html() == "<p>working hours</p>") {
     $(this).css('background-color', '#FFAB00')
   }
});


document.arrive(".og-tag", function() {
    if (($(this).html() == "<p>Heartbeat</p>") || ($(this).html() == "<p>heartbeat</p>")) {
      text = $(this).parent().parent()[0].textContent.toLowerCase()                 
      if ((text.includes('prom')) || (text.includes('thanos'))) {
        console.log($(this).parent().parent()[0].querySelector('.og-alert-item__main__title-box__title'))
        $($(this).parent().parent()[0].querySelector('.og-alert-item__main__title-box__title')).css({'border-style': 'dotted', 'border-color': '#ff9066'})
      }  
    }
});

GM_addStyle(".og-alert-item__main__team-box {display:contents !important;}");
            
$(document).arrive(".og-alert-item__main__team-box", function() {
   $(this).parent().find(".og-alert-item__main__tag-box").prepend($(this))
});


$(document).arrive(".og-alert-item__main__title-box__title", function() {
   $(this).html($(this).html().replace("[FIRING:1]", ""));
});

GM_addStyle(".og-alert-item__right__status-box {display:contents !important;}");


$(document).arrive(".og-alert-item__right__status-box", function() {
   $(this).parent().find(".og-alert-item__right__action-box").prepend($(this))
});

GM_addStyle(".og-alert-item__right__status-box__status .og-lozenge {width: 35px !important; padding: 0 4px !important}");

GM_addStyle(".alert-button {padding: 0 2px !important;}");



$(document).arrive(".alert-numbers__label", function() {         
   $(this).attr("data-content", $(this).text());
});

GM_addStyle('b.alert-numbers__label:not([data-content="x1"]):not(.has-tooltip) {background-color: tomato;color:black;}');