// ==UserScript==
// @name         jawz Chad Topaz
// @version      1.0
// @description  something useful
// @author       jawz
// @match		 https://www.mturkcontent.com/dynamic/hit?assignmentId=*
// @require      http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/19145/jawz%20Chad%20Topaz.user.js
// @updateURL https://update.greasyfork.org/scripts/19145/jawz%20Chad%20Topaz.meta.js
// ==/UserScript==

var first = $('li:contains(First name:)').text().replace('First name: ', '');
var last = $('li:contains(Last name:)').text().replace('Last name:', '');
var institution = $('li:contains(Institution:)').text().replace('Institution:', '');

var url = 'https://www.google.com/search?q=' + first + last + institution;
        if (url.indexOf('google') > -1)
            url = url.replace(/&/g, '%26').replace(/'/g, '%27').replace(/#/g, '%23');
        var windowLeft = window.screenX;
        var windowTop = window.screenY;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight + 47;
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";
   
        var popup = window.open(url, 'remote', 'height=' + windowHeight + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
        window.onbeforeunload = function (e) { 
            alert('test');
            popup.close();
            
        };
