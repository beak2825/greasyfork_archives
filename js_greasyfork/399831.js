// ==UserScript==
// @name         wuhanmemo plugin
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  show the real link
// @author       404
// @match        http://wuhanmemo.com/
// @match        http://wuhanmemo.com/?page_id=230929
// @match        http://wuhanmemo.com/?page_id=230587
// @match        https://wuhanmemo.com/
// @match        https://wuhanmemo.com/?page_id=230929
// @match        https://wuhanmemo.com/?page_id=230587
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399831/wuhanmemo%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/399831/wuhanmemo%20plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = jQuery('.content-details').find('a');
    var linkMap = []; // key: index, value: {linkdoms: [], targetlink: string, title: string}
    links.each(function(){
        var jthis = jQuery(this);
        var index = parseInt(jthis.text());
        if(linkMap[index]){
            linkMap[index].linkdoms.push(jthis);
        } else {
            linkMap[index] = {linkdoms: [jthis]}
        }
    });
    var targetLink = links.eq(0).attr('href');
    jQuery.ajax({
        url: window.location.protocol.startsWith('https')? targetLink : targetLink.replace('https', 'http'),
        type: 'GET',
        success: function(res){
            // console.log(res);
            var detailWarp = jQuery(res);
            detailWarp.find('.et_pb_section.et_pb_section_0.et_section_regular').find('p').each(function(){
                var jthis = jQuery(this);
                // console.log(jthis.text());
                var match = jthis.text().match(/\[.+\]/);
                if(match){
                    var index = parseInt(match.input.replace(/\[|\]/g, ''));
                    var realhref = jthis.find('a').attr('href');
                    if(index < linkMap.length && linkMap[index]){
                        for(var i = 0; i < linkMap[index].linkdoms.length; i++){
                            linkMap[index].linkdoms[i].after(' <a href="' + realhref + '" target="_blank" style="color:gold;" title="直链 => ' + jthis.text() + '">Go_Link</a> ');
                            linkMap[index].targetlink = realhref;
                            linkMap[index].title = jthis.text();
                        }
                    }
                }

            })
        }

    });
})();