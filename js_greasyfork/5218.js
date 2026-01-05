// ==UserScript==
// @name		Batbox tweaks
// @namespace	harry
// @version		0.6.0
// @include		https://www2.rit.edu/BatBOX/timeTrack/index.jsp*
// @include		https://www2.rit.edu/BatBOX/timeTrack/addProjectHours.jsp*
// @description	make batbox less sucky, makes select list of projects more usable, can enter time using only numbers and it will convert
// @downloadURL https://update.greasyfork.org/scripts/5218/Batbox%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/5218/Batbox%20tweaks.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
	var script = document.createElement("script"),
		s2 = document.createElement("script");

	script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
	s2.setAttribute("src", "https://twcstaff.rit.edu/impact/assets/hb_core/js/jquery/chosen/chosen.jquery.min.js");
	
	script.addEventListener('load', function() {
		document.body.appendChild(s2);
	}, false);
	
	s2.addEventListener('load', function() {
		var s3 = document.createElement("script");
		s3.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(s3);
	}, false);
	
	document.body.appendChild(script);
}
function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement('style');
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}
addStyleSheet('@import "https://twcstaff.rit.edu/impact/assets/hb_core/js/jquery/chosen/chosen.css";');

// the guts of this userscript
function main() {
    var indexUrl = 'https://www2.rit.edu/BatBOX/timeTrack/index.jsp',
        isIndex = (document.URL.substring(0, indexUrl.length).toLowerCase() == indexUrl.toLowerCase()),
        timeTrackUrl = 'https://www2.rit.edu/BatBOX/timeTrack/addProjectHours.jsp',
        isTimeTrack = ! isIndex && (document.URL.substring(0, timeTrackUrl.length).toLowerCase() == timeTrackUrl.toLowerCase());
    
	if (isTimeTrack) {
        $('input[type="text"]').bind('change', function(e) {
            var me = $(this),
                val = me.val(),
                h, m, ampm;

            if ($.isNumeric(val) && (val.length <= 4)) {
                if (val.length == 1 || val.length == 2) {
                    h = val;
                    m = '00';
                } else if (val.length == 3) {
                    h = val.substr(0, 1);
                    m = val.substr(1);
                } else if (val.length == 4) {
                    h = val.substr(0, 2);
                    m = val.substr(2);
                }

                if (h < 8 || h == 12) {
                    ampm = 'PM';
                } else {
                    ampm = 'AM';
                }
                me.val(h+':'+m+ampm);
                me.trigger('change');
            }

        });
    } else if (isIndex) {
        var projectsForm = $('body').find('form:eq(1)'),
            projectsList = projectsForm.find('select'),
            mainCon = projectsForm.closest('td'),
            cookieName = 'batbox_recent_sites',
            recentSites, recentSitesArr, recentSiteRows = [],
            recentSitesCon, foundSitesArr = [],
            formatTimer;

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



        recentSites = $.cookie(cookieName);

        if (recentSites) {
            recentSitesArr = recentSites.split(',');

            projectsList.children().each(function() {
                var me = $(this),
                    id = me.val(),
                    text = me.text();

                if (inArray(id, recentSitesArr) && !inArray(id, foundSitesArr)) {
                    recentSiteRows.push($('<li><a href="./addProjectHours.jsp?project='+id+'">'+text+'</a> - <a href="#" class="remove" data-id="'+id+'">remove</a></li>'));
                    foundSitesArr.push(id);
                }
            });
        }

        if (recentSiteRows.length > 0) {
            var listChildren;
            
            recentSitesCon = $('<ul></ul>').css({'margin':'15px 0'});
            recentSitesCon.append(recentSiteRows);
            mainCon.prepend(recentSitesCon).prepend('<div>Recent Projects</div>');

            recentSitesCon.find('a.remove').on('click', function(e) {
                var me = $(this),
                    id = me.data('id'),
                    index;

                e.preventDefault(); 

                arr = recentSites.split(',');
                index = $.inArray(id, arr);
                arr.splice(index, 1);
                recentSites = arr.join(',');
                $.cookie(cookieName, recentSites, { expires: 365 });

                me.closest('li').remove();
            });
            
            listChildren = recentSitesCon.children().get();
            listChildren.sort(function(a, b) {
                return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
            });
            $.each(listChildren, function(idx, itm) { recentSitesCon.append(itm); });
        }

        projectsForm.submit(function(e) {
            var id = projectsList.val(),
                arr = [];

            if (recentSites) {
                arr = recentSites.split(',');
            }

            arr.push(id);
            arr = uniqueArray(arr);

            $.cookie(cookieName, arr.join(','), { expires: 365 });

            return true;
        });
    }
    
    $('select').chosen({search_contains:true});
}


// load jQuery and execute the main function
addJQuery(main);
