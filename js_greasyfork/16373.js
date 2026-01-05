// ==UserScript==
// @name         RIT webhosting tweaks
// @namespace    http://claws.rit.net/
// @version      0.2.5
// @description  fix it yo
// @author       You
// @match        https://claws.rit.edu/webhosting/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16373/RIT%20webhosting%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/16373/RIT%20webhosting%20tweaks.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';



// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

// the guts of this userscript
function main() {
	$(document).ready(function() {
        var indexUrl = 'https://claws.rit.edu/webhosting/index.php',
            indexUrl1 = 'https://claws.rit.edu/webhosting/',
            siteInfoUrl = 'https://claws.rit.edu/webhosting/siteinfo.php',
            isIndex = (document.URL.substring(0, indexUrl.length).toLowerCase() == indexUrl.toLowerCase() || document.URL.toLowerCase() == indexUrl1.toLowerCase()),
            isSiteInfo = (!isIndex && document.URL.substring(0, siteInfoUrl.length).toLowerCase() == siteInfoUrl.toLowerCase()),
            commitsStagingUrl = 'https://claws.rit.edu/webhosting/commitstaging.php',
            isCommitsStaging = (!isIndex && !isSiteInfo && document.URL.substring(0, commitsStagingUrl.length).toLowerCase() == commitsStagingUrl.toLowerCase()),
            commitsProdUrl = 'https://claws.rit.edu/webhosting/commitproduction.php',
            isCommitsProd = (!isIndex && !isSiteInfo && !isCommitsStaging && document.URL.substring(0, commitsProdUrl.length).toLowerCase() == commitsProdUrl.toLowerCase());
        
/*
 * JS shift click checkboxes
 * 
 * Copyright (c) 2008 John Sutherland <john@sneeu.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
(function(b){b.fn.shiftClick=function(){var c,d=b(this);this.each(function(){b(this).click(function(e){if(e.shiftKey){var a=d.index(c),f=d.index(this);e=Math.max(f,a);var g=c.checked;for(a=Math.min(f,a);a<e;a++)d[a].checked=g}else c=this})})}})(jQuery);

        /*!
         * jQuery Cookie Plugin v1.3
         * https://github.com/carhartl/jquery-cookie
         *
         * Copyright 2011, Klaus Hartl
         * Dual licensed under the MIT or GPL Version 2 licenses.
         * http://www.opensource.org/licenses/mit-license.php
         * http://www.opensource.org/licenses/GPL-2.0
         */
        (function(e,h,k){function l(b){return b}function m(b){return decodeURIComponent(b.replace(n," "))}var n=/\+/g,d=e.cookie=function(b,c,a){if(c!==k){a=e.extend({},d.defaults,a);null===c&&(a.expires=-1);if("number"===typeof a.expires){var f=a.expires,g=a.expires=new Date;g.setDate(g.getDate()+f)}c=d.json?JSON.stringify(c):String(c);return h.cookie=[encodeURIComponent(b),"=",d.raw?c:encodeURIComponent(c),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+
        a.domain:"",a.secure?"; secure":""].join("")}c=d.raw?l:m;a=h.cookie.split("; ");f=0;for(g=a.length;f<g;f++){var j=a[f].split("=");if(c(j.shift())===b)return b=c(j.join("=")),d.json?JSON.parse(b):b}return null};d.defaults={};e.removeCookie=function(b,c){return null!==e.cookie(b)?(e.cookie(b,null,c),!0):!1}})(jQuery,document);

        
        if (isIndex) {
            var projectsTable = $('#hostingsitetable'),
                mainCon = $('#sitenav'),
                cookieName = 'rit_webhosting_recent_sites',
                recentSites, recentSitesArr, recentSiteRows = [],
                recentSitesCon;
            
            setTimeout(function() {
                $('#hostingsitetable_filter').find('input').focus();
            }, 200);
            
            $('#maincontent > div.mainbox').css('width', '700px');
            $('#hostingsitetable').css('width', '100%');
            
            recentSites = $.cookie(cookieName);
        
            if (recentSites) {
                recentSitesArr = recentSites.split(',');

                projectsTable.children('tbody').children().each(function() {
                    var me = $(this),
                        td = me.children(':eq(1)'),
                        username = td.text();

                    if (inArray(username, recentSitesArr)) {
                        var clone = me.clone(),
                            children = clone.children(),
                            sitePath = children.eq(2);
                        
                        children.last().remove();
                        children.first().append('<div class="site-path">'+sitePath.text()+'</div>');
                        sitePath.remove();
                        clone.append('<td><a href="#" class="remove" data-id="'+username+'">remove</a></td>');
                        recentSiteRows.push(clone);
                    }
                });
            }

            if (recentSiteRows.length > 0) {
                var con = $('<div class="mainbox" style="float: left; margin-left: 30px;"><div class="header"><div class="caption">Recent Sites</div></div></div>');
                recentSitesCon = $('<table id="recent-sites"></table>');
                recentSitesCon.append(recentSiteRows);
                con.append(recentSitesCon);
                $('#maincontent').after(con);

                recentSitesCon.find('a.remove').on('click', function(e) {
                    var me = $(this),
                        username = me.data('id'),
                        parCon = me.closest('.mainbox'),
                        index, arr;

                    e.preventDefault(); 

                    arr = recentSites.split(',');
                    index = $.inArray(username, arr);
                    arr.splice(index, 1);
                    recentSites = arr.join(',');
                    $.cookie(cookieName, recentSites, { expires: 365 });

                    me.closest('tr').remove();
                    
                    if (parCon.find('tr').length == 0) {
                        parCon.remove();
                    }
                });
            }

            projectsTable.children('tbody').children().find('a').on('click', function(e) {
                var username = $(this).closest('tr').children(':eq(1)').text(),
                    arr = [];

                if (recentSites) {
                    arr = recentSites.split(',');
                }

                arr.push(username);
                arr = uniqueArray(arr);

                $.cookie(cookieName, arr.join(','), { expires: 365 });
            });
        } else if (isSiteInfo) {
            $('#sitequotatable').find('.readOnly:gt(1)').each(function(e) {
                var me = $(this),
                    pb = $('<progress max="100" value="0"></progress>'),
                    t1 = me.text(),
                    i1 = t1.indexOf('('),
                    i2 = t1.indexOf('%');
                
                pb.val(t1.substring(i1+1, i2-1));
                
                me.append(pb);
            });
        } else if (isCommitsStaging || isCommitsProd) {
            var resultsCon = $('#results'),
                checkboxCount = 0;
            
            resultsCon.find('input[type=checkbox]').shiftClick();
            resultsCon.find('legend').each(function() {
                var me = $(this),
                    link = $('<a href="#" class="toggle showing">-</a>');
                
                me.prepend(link);
                
                link.on('click', function(e) {
                    var me = $(this),
                        ul = me.closest('fieldset').children('ul');
                    
                    e.preventDefault();
                    
                    if (me.hasClass('showing')) {
                        ul.hide();
                        me.removeClass('showing');
                        me.text('+');
                    } else {
                        ul.show();
                        me.addClass('showing');
                        me.text('-');
                    }
                });
            });
            
            setInterval(function() {
                var c1 = resultsCon.find('input[type="checkbox"]');
                
                if (c1.length != checkboxCount) {
                    c1.shiftClick();
                    checkboxCount = c1.length;
                }
            }, 1000);
        }
        
        
        function inArray(needle, haystack) {
            var i = haystack.length;
            
            while (i--) {
                if (haystack[i] == needle) return true;
            }
            
            return false;
        }
        function uniqueArray(arr) {
            var u = {}, a = [];
            for (var i = 0, l = arr.length; i < l; ++i) {
                if (!u.hasOwnProperty(arr[i])) {
                    a.push(arr[i]);
                    u[arr[i]] = 1;
                }
            }
            return a;
        }
        
        
	});
}

// load jQuery and execute the main function
//addJQuery(main);
main();