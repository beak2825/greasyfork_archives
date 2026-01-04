// ==UserScript==
// @name         打开评阅
// @namespace    http://your.homepage/
// @version      0.4
// @description  enter something useful
// @author       You
// @include        */mod/forum/view.php?id=*
// @include        *customscripts/mod/forum/score.php?uid=*
// @include        *customscripts/mod/forum/review.php?id=*
// @grant        none
// @grant  unsafeWindow
// @require https://greasyfork.org/scripts/408223-%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E8%AF%84%E9%98%85/code/%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E8%AF%84%E9%98%85.js?version=834092
// @downloadURL https://update.greasyfork.org/scripts/408211/%E6%89%93%E5%BC%80%E8%AF%84%E9%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/408211/%E6%89%93%E5%BC%80%E8%AF%84%E9%98%85.meta.js
// ==/UserScript==
function loadalert(){
    var url = window.location.href;
    if(url.indexOf('/mod/forum/view.php?id=')>=0)
    {
        var zong=  $('#newdiscussionform').find('a').attr('href');
        if(zong)
            window.open(zong);
    }
    if(url.indexOf('customscripts/mod/forum/review.php?id=')>=0)    
        OpenAll();
    if(url.indexOf('customscripts/mod/forum/score.php?uid=')>=0) {
        var f= LTPY();
    }
    
}
loadalert();