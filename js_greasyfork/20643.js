// ==UserScript==
// @name           net.hr AdBlocker
// @description    AdBlocker za net.hr portal
// @namespace      http://tteskac.com.hr
// @author         Tomislav Teskač
// @version    	   0.2
// @include        http://net.hr/*
// @downloadURL https://update.greasyfork.org/scripts/20643/nethr%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/20643/nethr%20AdBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){

        var spans = getElementsByClassName("billboard", null, "div");
        for(var i = 0; i < spans.length; i++) {
            var span = spans[i];
            span.parentNode.removeChild(span);
        }

        spans = getElementsByClassName("wallpaper", null, "div");
        for(var i = 0; i < spans.length; i++) {
            var span = spans[i];
            span.parentNode.removeChild(span);
        }

        var spans = getElementsByClassName("banner", null, "div");
        for(var i = 0; i < spans.length; i++) {
            var span = spans[i];
            span.parentNode.removeChild(span);
        }

        var spans = getElementsByClassName("adsbygoogle", null, "ins");
        for(var i = 0; i < spans.length; i++) {
            var span = spans[i];
            span.parentNode.removeChild(span);
        }


    }, 1000);


})();



function getElementsByClassName(classname_, node, tagName)  {
    tagName=(typeof(tagName) === 'undefined')?"*":tagName;
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var classes = classname_.split(',');

    for(var cid in classes) {
    var classname = classes[cid];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName(tagName);
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    }

    return a;
}
