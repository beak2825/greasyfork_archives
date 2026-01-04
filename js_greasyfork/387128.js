// ==UserScript==
// @name         Zendesk Events - Highlight tag changes
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Tal Admon (tal.admon@cloudinary.com)
// @match        https://*.zendesk.com/agent/tickets/*/events
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/387128/Zendesk%20Events%20-%20Highlight%20tag%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/387128/Zendesk%20Events%20-%20Highlight%20tag%20changes.meta.js
// ==/UserScript==

(function() {
    'use strict';
//    this.$ = this.jQuery = jQuery.noConflict(true);
    window.addEventListener('load', function() {

    jQuery('.audit-events .Change .info').each(function(){
        var _type = jQuery(this).find('label').text().trim()
        if (_type == 'Tags') {
            var _hl = jQuery(this).find('label').html();
            var _ht = jQuery(this).clone().children().remove().end().html();
            var _hd = jQuery(this).find('del').html();
            var _hv = jQuery(this).find('div.via').html();

            var _v = jQuery(this).clone().children().remove().end().text().trim().split(' ')
            _v = _v.filter(function(e){return e!=''});
            //console.log(_v);
            var _d = jQuery(this).find('del').text().trim().split(' ');
            //console.log(_d);
            var _added = _v.filter(function(e){ return !_d.includes(e) });
            var _deleted = _d.filter(function(e){ return !_v.includes(e) });

            //console.log(_added);

            _added.forEach(function(e){
                _ht = _ht.replace(e,'<b style="color:green;">'+e+'</b>')
                //console.log(e);
            })
            _deleted.forEach(function(e){
                _hd = _hd.replace(e,'<b style="color:red;">'+e+'</b>')
                //console.log(e);
            })
            console.log(_hl);
            jQuery(this).html('<label>'+_hl+'</label>'+_ht+'<del>'+_hd+'</del><div class="via">'+_hv+'</div>');
        }
    })
    }, false);
})();