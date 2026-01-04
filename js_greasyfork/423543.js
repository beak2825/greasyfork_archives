    // ==UserScript==
    // @name                LOC 屏蔽个人空间diy_style
    // @namespace discuz
    // @version      0.1
    // @description  屏蔽hostloc花里胡哨的个人空间css
    // @include        http*://www.hostloc.com/*
   // @include        http*://hostloc.com/*
    // @include        http*://*.hostloc.com/*
// @downloadURL https://update.greasyfork.org/scripts/423543/LOC%20%E5%B1%8F%E8%94%BD%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4diy_style.user.js
// @updateURL https://update.greasyfork.org/scripts/423543/LOC%20%E5%B1%8F%E8%94%BD%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4diy_style.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        for(var stylesheet of document.styleSheets){
        if(stylesheet.ownerNode.id ==='diy_style'){
                    for(var i=stylesheet.cssRules.length-1;i>=0 ;i--){
                            stylesheet.deleteRule(i);
                    }
                    break;
            }
    }
    })();