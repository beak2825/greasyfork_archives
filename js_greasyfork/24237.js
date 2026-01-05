// ==UserScript==
// @name         jQuery Element Logger para chrome v.54+
// @description  Añade la funcionalidad de Log al navegador Chrome, desparacida a partir de la version 54
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Divisadero LABS
// @match        http*://*/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/24237/jQuery%20Element%20Logger%20para%20chrome%20v54%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/24237/jQuery%20Element%20Logger%20para%20chrome%20v54%2B.meta.js
// ==/UserScript==


window.logManager =  {
    debug:false,
    trigger:localStorage.getItem('dsd_logmanager') || "LOAD",
    triggerDictionary: ["ALWAYS","READY","LOAD","NEVER"],
    setTrigger:function(moment){
        if(this.triggerDictionary.indexOf(moment) > -1){
            localStorage.setItem('dsd_logmanager',moment);
            this.trigger = moment;
            this.executeTrigger();
        }else{
            console.error('Error logManager: Not a valid trigger. Possible Values ["ALWAYS","READY","LOAD","NEVER"]');
            return false;
        }
    },
    executeTrigger: function(){
        switch(this.trigger){
            case "ALWAYS":
                this.debug = true;
                break;
            case "READY":
                var _self = this;
                document.addEventListener('DOMContentLoaded', function() {
                    _self.debug = true;
                });
                break;
            case "LOAD":
                var _self = this;
                window.addEventListener('load', function() {
                    _self.debug = true;
                });
                break;
            case "NEVER":
                this.debug = false;
                break;
        }
    },
    log:function(){
        if(this.debug){
            console.log.apply(this,arguments);
        }
    }
};
logManager.executeTrigger();
var jQueryInterval = setInterval(function(){
    if(window.jQuery){
        clearInterval(jQueryInterval);
        (function($) {
            var jQueryInit = $.fn.init;

            $.fn.init = function(arg1, arg2, rootjQuery){
                var jQueryShit = new jQueryInit(arg1, arg2, rootjQuery);
                for(var i = 0; i < jQueryShit.length; i++){
                    logManager.log(jQueryShit[i]);
                }
                return jQueryShit;
            };
        })(jQuery);
    }
},100);
// After 5 seconds of not jQuery loaded the interval is removed
setTimeout(function(){clearInterval(jQueryInterval);},5000);