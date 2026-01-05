// ==UserScript==
// @name          Qlock
// @version       2.1
// @description   lock
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=unsolved
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=vehicles
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=property
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=android_snapad
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=ios_snapad
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=wttone
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=normal
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=suspicious
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=prohibited
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=qa
// @namespace https://greasyfork.org/users/110837
// @downloadURL https://update.greasyfork.org/scripts/30112/Qlock.user.js
// @updateURL https://update.greasyfork.org/scripts/30112/Qlock.meta.js
// ==/UserScript==

var strHTML = document.body.innerHTML;
var yourTime = new Date();

/*var PageTitleNotification = {Vars:
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
}*/



if((strHTML.indexOf("ERROR_QUEUE_EMPTY") < 0) & strHTML.indexOf("HTTP ERROR 500")<0)
{}
else { 
 window.setTimeout(function(){window.location.reload() ;},3000) ;
} 

var str = strHTML;
var n = str.search("nhất");
/*if(n>0)
{
    alert(n);
    str = str.replace("nhất");
}*/
return;