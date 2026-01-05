// ==UserScript==
// @name          lock unso ko hien gi het
// @version       2.1
// @namespace      P
// @description    fuck unso n get $
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=unsolved
// @downloadURL https://update.greasyfork.org/scripts/28301/lock%20unso%20ko%20hien%20gi%20het.user.js
// @updateURL https://update.greasyfork.org/scripts/28301/lock%20unso%20ko%20hien%20gi%20het.meta.js
// ==/UserScript==

var strHTML = document.body.innerHTML;
var yourTime = new Date();

var PageTitleNotification = {Vars:
                             {
        OriginalTitle: document.title,
        Interval: null
    },    
    On: function(notification, intervalSpeed)
    {
        var _this = this;
        _this.Vars.Interval = setInterval(function()
        {
             document.title = (_this.Vars.OriginalTitle == document.title)? notification
                                 : _this.Vars.OriginalTitle;
        }, (intervalSpeed) ? intervalSpeed : 1000);
    },
    Off: function()
    {
        clearInterval(this.Vars.Interval);
        document.title = this.Vars.OriginalTitle;
    }
}



if((strHTML.indexOf("ERROR_QUEUE_EMPTY") < 0) & strHTML.indexOf("HTTP ERROR 500")<0)
{}
else { 
 window.setTimeout(function(){window.location.reload() ;},3500) ;
} 
return;