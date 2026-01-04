// ==UserScript==
// @name         Twitch Sound Alerts
// @namespace    http://kkkk.cf/
// @version      1337
// @description  Plays sound on word/username
// @author       33kk
// @match        https://www.twitch.tv/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/389437/Twitch%20Sound%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/389437/Twitch%20Sound%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your username
    var username = '';
    // Get notification when people say any of this
    var words = [];
    // You will always get notification from theese users
    var usernames = [];
    // Users you dont want sound notifications from ('username' refers to you)
    var blacklist = [username];
    // Audio on user message or word
    var audio = 'https://cdn.ffzap.com/sounds/wow.mp3';
    // Audio on mention
    var audioMention = 'https://cdn.ffzap.com/sounds/brainpower.mp3';
    // Volume (not sure if it works)
    var volume = 0.15;

    /*
     * arrive.js
     * https://github.com/uzairfarooq/arrive
     * MIT licensed
     */
    var Arrive=(function(window,$,undefined){"use strict";if(!window.MutationObserver||typeof HTMLElement==='undefined'){return;}var arriveUniqueId=0;var utils=(function(){var matches=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(elem,selector){return elem instanceof HTMLElement&&matches.call(elem,selector)},addMethod:function(object,name,fn){var old=object[name];object[name]=function(){if(fn.length==arguments.length){return fn.apply(this,arguments)}else if(typeof old=='function'){return old.apply(this,arguments)}}},callCallbacks:function(callbacksToBeCalled,registrationData){if(registrationData&&registrationData.options.onceOnly&&registrationData.firedElems.length==1){callbacksToBeCalled=[callbacksToBeCalled[0]]}for(var i=0,cb;(cb=callbacksToBeCalled[i]);i+=1){if(cb&&cb.callback){cb.callback.call(cb.elem,cb.elem)}}if(registrationData&&registrationData.options.onceOnly&&registrationData.firedElems.length==1){registrationData.me.unbindEventWithSelectorAndCallback.call(registrationData.target,registrationData.selector,registrationData.callback)}},checkChildNodesRecursively:function(nodes,registrationData,matchFunc,callbacksToBeCalled){for(var i=0,node;(node=nodes[i]);i+=1){if(matchFunc(node,registrationData,callbacksToBeCalled)){callbacksToBeCalled.push({callback:registrationData.callback,elem:node})}if(node.childNodes.length>0){utils.checkChildNodesRecursively(node.childNodes,registrationData,matchFunc,callbacksToBeCalled)}}},mergeArrays:function(firstArr,secondArr){var options={},attrName;for(attrName in firstArr){if(firstArr.hasOwnProperty(attrName)){options[attrName]=firstArr[attrName]}}for(attrName in secondArr){if(secondArr.hasOwnProperty(attrName)){options[attrName]=secondArr[attrName]}}return options},toElementsArray:function(elements){if(typeof elements!=="undefined"&&(typeof elements.length!=="number"||elements===window)){elements=[elements]}return elements}}})();var EventsBucket=(function(){var EventsBucket=function(){this._eventsBucket=[];this._beforeAdding=null;this._beforeRemoving=null};EventsBucket.prototype.addEvent=function(target,selector,options,callback){var newEvent={target:target,selector:selector,options:options,callback:callback,firedElems:[]};if(this._beforeAdding){this._beforeAdding(newEvent)}this._eventsBucket.push(newEvent);return newEvent};EventsBucket.prototype.removeEvent=function(compareFunction){for(var i=this._eventsBucket.length-1,registeredEvent;(registeredEvent=this._eventsBucket[i]);i-=1){if(compareFunction(registeredEvent)){if(this._beforeRemoving){this._beforeRemoving(registeredEvent)}var removedEvents=this._eventsBucket.splice(i,1);if(removedEvents&&removedEvents.length){removedEvents[0].callback=null}}}};EventsBucket.prototype.beforeAdding=function(beforeAdding){this._beforeAdding=beforeAdding};EventsBucket.prototype.beforeRemoving=function(beforeRemoving){this._beforeRemoving=beforeRemoving};return EventsBucket})();var MutationEvents=function(getObserverConfig,onMutation){var eventsBucket=new EventsBucket(),me=this;var defaultOptions={fireOnAttributesModification:false};eventsBucket.beforeAdding(function(registrationData){var target=registrationData.target,observer;if(target===window.document||target===window){target=document.getElementsByTagName("html")[0]}observer=new MutationObserver(function(e){onMutation.call(this,e,registrationData)});var config=getObserverConfig(registrationData.options);observer.observe(target,config);registrationData.observer=observer;registrationData.me=me});eventsBucket.beforeRemoving(function(eventData){eventData.observer.disconnect()});this.bindEvent=function(selector,options,callback){options=utils.mergeArrays(defaultOptions,options);var elements=utils.toElementsArray(this);for(var i=0;i<elements.length;i+=1){eventsBucket.addEvent(elements[i],selector,options,callback)}};this.unbindEvent=function(){var elements=utils.toElementsArray(this);eventsBucket.removeEvent(function(eventObj){for(var i=0;i<elements.length;i+=1){if(this===undefined||eventObj.target===elements[i]){return true}}return false})};this.unbindEventWithSelectorOrCallback=function(selector){var elements=utils.toElementsArray(this),callback=selector,compareFunction;if(typeof selector==="function"){compareFunction=function(eventObj){for(var i=0;i<elements.length;i+=1){if((this===undefined||eventObj.target===elements[i])&&eventObj.callback===callback){return true}}return false}}else{compareFunction=function(eventObj){for(var i=0;i<elements.length;i+=1){if((this===undefined||eventObj.target===elements[i])&&eventObj.selector===selector){return true}}return false}}eventsBucket.removeEvent(compareFunction)};this.unbindEventWithSelectorAndCallback=function(selector,callback){var elements=utils.toElementsArray(this);eventsBucket.removeEvent(function(eventObj){for(var i=0;i<elements.length;i+=1){if((this===undefined||eventObj.target===elements[i])&&eventObj.selector===selector&&eventObj.callback===callback){return true}}return false})};return this};var ArriveEvents=function(){var arriveDefaultOptions={fireOnAttributesModification:false,onceOnly:false,existing:false};function getArriveObserverConfig(options){var config={attributes:false,childList:true,subtree:true};if(options.fireOnAttributesModification){config.attributes=true}return config}function onArriveMutation(mutations,registrationData){mutations.forEach(function(mutation){var newNodes=mutation.addedNodes,targetNode=mutation.target,callbacksToBeCalled=[],node;if(newNodes!==null&&newNodes.length>0){utils.checkChildNodesRecursively(newNodes,registrationData,nodeMatchFunc,callbacksToBeCalled)}else if(mutation.type==="attributes"){if(nodeMatchFunc(targetNode,registrationData,callbacksToBeCalled)){callbacksToBeCalled.push({callback:registrationData.callback,elem:targetNode})}}utils.callCallbacks(callbacksToBeCalled,registrationData)})}function nodeMatchFunc(node,registrationData,callbacksToBeCalled){if(utils.matchesSelector(node,registrationData.selector)){if(node._id===undefined){node._id=arriveUniqueId++}if(registrationData.firedElems.indexOf(node._id)==-1){registrationData.firedElems.push(node._id);return true}}return false}arriveEvents=new MutationEvents(getArriveObserverConfig,onArriveMutation);var mutationBindEvent=arriveEvents.bindEvent;arriveEvents.bindEvent=function(selector,options,callback){if(typeof callback==="undefined"){callback=options;options=arriveDefaultOptions}else{options=utils.mergeArrays(arriveDefaultOptions,options)}var elements=utils.toElementsArray(this);if(options.existing){var existing=[];for(var i=0;i<elements.length;i+=1){var nodes=elements[i].querySelectorAll(selector);for(var j=0;j<nodes.length;j+=1){existing.push({callback:callback,elem:nodes[j]})}}if(options.onceOnly&&existing.length){return callback.call(existing[0].elem,existing[0].elem)}setTimeout(utils.callCallbacks,1,existing)}mutationBindEvent.call(this,selector,options,callback)};return arriveEvents};var LeaveEvents=function(){var leaveDefaultOptions={};function getLeaveObserverConfig(){var config={childList:true,subtree:true};return config}function onLeaveMutation(mutations,registrationData){mutations.forEach(function(mutation){var removedNodes=mutation.removedNodes,callbacksToBeCalled=[];if(removedNodes!==null&&removedNodes.length>0){utils.checkChildNodesRecursively(removedNodes,registrationData,nodeMatchFunc,callbacksToBeCalled)}utils.callCallbacks(callbacksToBeCalled,registrationData)})}function nodeMatchFunc(node,registrationData){return utils.matchesSelector(node,registrationData.selector)}leaveEvents=new MutationEvents(getLeaveObserverConfig,onLeaveMutation);var mutationBindEvent=leaveEvents.bindEvent;leaveEvents.bindEvent=function(selector,options,callback){if(typeof callback==="undefined"){callback=options;options=leaveDefaultOptions}else{options=utils.mergeArrays(leaveDefaultOptions,options)}mutationBindEvent.call(this,selector,options,callback)};return leaveEvents};var arriveEvents=new ArriveEvents(),leaveEvents=new LeaveEvents();function exposeUnbindApi(eventObj,exposeTo,funcName){utils.addMethod(exposeTo,funcName,eventObj.unbindEvent);utils.addMethod(exposeTo,funcName,eventObj.unbindEventWithSelectorOrCallback);utils.addMethod(exposeTo,funcName,eventObj.unbindEventWithSelectorAndCallback)}function exposeApi(exposeTo){exposeTo.arrive=arriveEvents.bindEvent;exposeUnbindApi(arriveEvents,exposeTo,"unbindArrive");exposeTo.leave=leaveEvents.bindEvent;exposeUnbindApi(leaveEvents,exposeTo,"unbindLeave")}if($){exposeApi($.fn)}exposeApi(HTMLElement.prototype);exposeApi(NodeList.prototype);exposeApi(HTMLCollection.prototype);exposeApi(HTMLDocument.prototype);exposeApi(Window.prototype);var Arrive={};exposeUnbindApi(arriveEvents,Arrive,"unbindAllArrive");exposeUnbindApi(leaveEvents,Arrive,"unbindAllLeave");return Arrive})(window,typeof jQuery==='undefined'?null:jQuery,undefined);
    $(document).ready(function() {
        var notif = document.createElement('audio');
        notif.setAttribute('src', audio);
        notif.volume = volume;
        var notifMen = document.createElement('audio');
        notifMen.setAttribute('src', audioMention);
        notifMen.volume = volume;
        $(document).arrive('.chat-line__message, .chat-line', function(el) {
            console.log(el);
            var user = $(el).find('.chat-line__username').text().toLowerCase();
            var message = $(el).find('span.message').text().toLowerCase();
            if (blacklist.length > 0 && new RegExp(blacklist.join("|")).test(user)) {
                console.log("bl")
                return;
            }
          	if (message.includes(username)) {
                notifMen.play();
            }
            else if (usernames.length > 0 && (new RegExp(usernames.join("|")).test(message) || new RegExp(usernames.join("|")).test(user))) {
                notif.play();
            }
            else if (words.length > 0 && new RegExp(words.join("|")).test(message)) {
                notif.play();
            }
            
        });
    });
})();