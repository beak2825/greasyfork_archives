// ==UserScript==
// @name           PineappleeaHacker
// @namespace      https://pineappleea.github.io/
// @description    替换页面中的github链接改为下载地址直连
// @include        https://pineappleea.github.io/*
// @version 0.0.1.202211242021
// @downloadURL https://update.greasyfork.org/scripts/424922/PineappleeaHacker.user.js
// @updateURL https://update.greasyfork.org/scripts/424922/PineappleeaHacker.meta.js
// ==/UserScript==

var sites = [
    {
        domain: 'pineappleea.github.io',
        handler: function() {
            var source_link_node = document.getElementsByClassName('scrollbox')[0].getElementsByTagName('a');
          for(var i =0;i< source_link_node.length;i++)
          {
            var ti = source_link_node[i].text.replace('Yuzu EA ','') ;
            var dl ="https://github.com/pineappleEA/pineapple-src/releases/download/EA-"+ ti+ "/Windows-Yuzu-EA-"+ti+".zip" 
            source_link_node[i].setAttribute('href',dl);

          }
        }
    }
    
];

var url = document.URL;
var i, site;
for (i = 0; i < sites.length; i += 1) {
    site = sites[i];
    if (url.indexOf(site.domain) != -1) {
        site.handler();
        break;
    }
}
