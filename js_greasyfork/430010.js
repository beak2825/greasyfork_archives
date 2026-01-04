// ==UserScript==
// @name         Fullmet
// @namespace    honami
// @version      0.06
// @description  Enables HTML5 video controls on Google Meet's in-meeting video presentation. 
// @author       lee.wp14
// @source       https://github.com/leewp14/Fullmet
// @supportURL   https://github.com/leewp14/Fullmet/issues
// @match        https://meet.google.com/*
// @grant        none
// @runat        document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/430010/Fullmet.user.js
// @updateURL https://update.greasyfork.org/scripts/430010/Fullmet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // global variables
    var honami_FullmetNode = null;
    var honami_FullmetInlineStyle = '';
    honami_FullmetInlineStyle += "video{pointer-events: initial !important;}";  // video
    honami_FullmetInlineStyle += ".uAzxg{pointer-events: none;} .uAzxg div{pointer-events: all;}";  // participant tooltip
    var honami_FullmetClassDelay = 2000;

    // internal variables
    var honamiInternals_debug_enabled = false;
    var honamiInternals_debug_label = '[DEBUG] leewp14/Fullmet';

    honamiInternals_debug('script started');
    honami_init();
    honami_injectStyle();
    setInterval(honami_videoNode_injectClass, honami_FullmetClassDelay);
    honamiInternals_debug('script ended');

    // functions
    function honami_init(){
        // create style element
        honamiInternals_debug('exec honami_init()');

        honami_FullmetNode = document.createElement('style');
        honami_FullmetNode.id = 'honami_FullmetNode';
        honami_FullmetNode.innerHTML = honami_FullmetInlineStyle;
        
        honamiInternals_debug('exit honami_init()');
    }

    function honami_injectStyle(){
        // inject style element
        honamiInternals_debug('exec honami_injectStyle()');
        
        if(honami_FullmetNode && document.body){
            document.body.appendChild(honami_FullmetNode);
        }

        honamiInternals_debug('exit honami_injectStyle()');
    }

    function honami_videoNode_injectClass(){
        // set 'controls' attribude to video elements
        honamiInternals_debug('exec honami_videoNode_injectClass()');
        var videoNode = document.getElementsByTagName('video');
        if(videoNode){
            for(var i = 0; i < videoNode.length; i++){
                var videoNodePointer = videoNode[i];
                if(!videoNodePointer.hasAttribute('controls')){
                    videoNodePointer.setAttribute('controls', '');
                }
            };
        }
        honamiInternals_debug('exit honami_videoNode_injectClass()');
    }

    // internal functions
    function honamiInternals_debug(type){
        // log debugging messages
        if(honamiInternals_debug_enabled){
            console.log(honamiInternals_debug_label + ': ' + type ?? 'undefined action');
        }
    }

})();