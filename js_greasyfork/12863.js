// ==UserScript==
// @name            IRON Nation Audit
// @namespace       
// @description     Submit nation stats to our server
// @version         1.0
// @author          Ryahn (gfxdeadlysniper@gmail.com) 
// @include         *://*.cybernations.net/nation_drill_display.asp?Nation_ID=*
// @exclude         file://*
// @grant           Cookies
// @downloadURL https://update.greasyfork.org/scripts/12863/IRON%20Nation%20Audit.user.js
// @updateURL https://update.greasyfork.org/scripts/12863/IRON%20Nation%20Audit.meta.js
// ==/UserScript==
var title = 'Manual IRON Nation Audit';
var inter = 15;
var nationPageText = /Private Nation Messages/;
var allianceText = /Financial</;
var allicanceAffiliation = /Independent Republic Of Orange Nations/;
var rank = /(Pending)/;
var loca = window.location.href;
var updatestring = '&update=1';
var serverURL =  'http://45.55.173.93/iron/parse.php';

var body = document.body;
body.addEventListener('contextmenu', initMenu, false);
var menu = body.appendChild(document.createElement('menu'));
menu.outerHTML = '<menu type="context" id="mymenu">' +
    '\t<menuitem label="' + title + '" icon="data:image/png;base64 ,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD9/f0H/Pv7Gfn4+Cj49/cr+fj4KPv6+x79/PwS/f39Dvz8/BX8/PwV/fz8Ev39/Qz8/PwV+/v7HPz8/Bj9/f0M9vX1MOnm51Lf3Nxi19DQdN3V1m7y8PA+9/b2MPTz8zjw7u5C9PLzOPj39yv29PQz7errSuzp6kz29PQz9vX1MNzZ2mWvoqKofh4e/4AAAP+AAAD/hBQU/9G/v43g3t5gv62un4AAAP/Uvr6N3tvbZLaxsZSBGBj/gAAA/+Ti4lq0sLCXfRER/38MDP+OZWXjiWRk44ETE/+BCgr/xb29i56JicGAAAD/t5ubs6+rq5tjKCn/gAAA/4AAAP/Qzc11flpb6oAAAP+2kpK75OLiWtjV1Wu4np6ujjg4/7epqaOOeHjPgAAA/49sbN1yYWHdewIC/30EBP+AAAD/w7+/h3Y7O/+AAAD/4tbXa/j29i7z8fE88O7uQuro6E3LyMh8gWlq24AAAP9oP0D/cBgY/3sDA/9wLy//gAAA/8bCw4N2PT3/gAAA/+HV1W739vYw9PPzOPLw8D7s6epMycbGfmxSU+qAAAD/bSAg/4AAAP9uNjf/dkFB/4AAAP/T0NBxiWxs24AAAP+rfn7N4t/fXtvX2GfGsrKbrHd30LisrZxfREX1gAAA/38AAP+BGxv/rqipnH1ISfqAAAD/5+XlVLy3uI58HBz/fgUF/39CQv+BS0z4gQ8P/4IMDP/BuLmRdFtc5YAAAP+AAQH/xbS0mcbCw4OLWlrtgAAA//j39yrh3t9evra2k4AxMf9/CAj/gAEB/4kmJ//Zycp+4N7eYLGgoKuCEhL/rHJy0+/t7UTg3d1gsY6Pv4gZGf/9/f0K+Pf3Ku3r7Ejk4uJa4+DgXOrn51Dz8fE8+Pb2LvXz9DXu7O1G8e7vQvj29i75+Pgo9fP0NfLw8D739vYw////AP39/QH9/f0P+/r6Hvr5+ST6+foi/Pv7Gf38/BL9/f0O/Pz8Ffz8/Bj9/PwS/f39Cv39/Qz8/PwU/fz8FP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAP//AAD//wAA//8AAMCIAACAAAAAjAAAAB+AAAAfgAAAjAAAAIAAAADBjAAA//8AAP//AAD//wAA//8AAA=="></menuitem>' +
    '</menu>';
document.querySelector('#mymenu menuitem').addEventListener('click', nationSearch, false);

function initMenu(aEvent) {
    // Executed when user right click on web page body
    // aEvent.target is the element you right click on
    var node = aEvent.target;
    var item = document.querySelector('#mymenu menuitem');
    body.setAttribute('contextmenu', 'mymenu');
}

nationSearch();
setInterval(nationSearch, inter * 60 * 1000);

function nationSearch() {
    // Test the text of the body element against our regular expression.
    if (nationPageText.test(document.body.innerHTML)) {
        console.log('inside 1st if');
        //Check if they are in NpO
        if (allianceText.test(document.body.innerHTML) && 
			allicanceAffiliation.test(document.body.innerHTML) &&
			(!rank.test(document.body.innerHTML))) {
            console.log('inside 2nd if');
            // If update in URL, Update    

            function sendMessage(data, isReloadNeeded) {
                var httpRequest = new XMLHttpRequest();
                httpRequest.open('POST', serverURL, true);
                httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                httpRequest.send('source=' + encodeURIComponent(data));
                if (isReloadNeeded) {
                    var newURL = loca.replace(updatestring, "");
                    window.location.href = newURL + updatestring;
                }
            }

            var next = localStorage.getItem('next');
            console.log(next);
            if (next == null || next == undefined || localStorage.getItem('next') < new Date().getTime()) {
                // Debugging
                //alert(next + ' ' + inter + ' ' + new Date().getTime());
                localStorage.setItem('next', new Date().getTime() + inter * 1000 * 60); // Iter minutes @ 10000
                var isReloadNeeded = (null == next);
                sendMessage(document.body.outerHTML, isReloadNeeded);
            } else if (loca.indexOf(updatestring) >= 0) {
                sendMessage(document.body.outerHTML);
            }
        }
    }
}