// ==UserScript==
// @name         Linkformat
// @namespace    https://bytespeicher.org/
// @version      0.8
// @description  replace links in next line with links in () with only domain as text
// @author       mkzero + chaos
// @match        https://bytespeicher.org/wp-admin/post.php?post=*&action=edit
// @match        https://bytespeicher.org/wp-admin/post-new.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15861/Linkformat.user.js
// @updateURL https://update.greasyfork.org/scripts/15861/Linkformat.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';



var menu = document.getElementById('ed_toolbar'),
    newinput = document.createElement("input");

newinput.type = "button";
newinput.id = "qt_content_format_links";
newinput.className = "ed_button button button-small";
newinput.value = "Fix Links";
newinput.addEventListener('click',replace_text,true);
menu.appendChild(newinput);

function replace_text(){
    var i = 0, j = 0,
    lines = document.getElementById('content').innerHTML.split('\n'),
    newdoc = [],
    match = /(?:(http|ftp)(s|):\/\/)([a-z-.]+[a-z]+)/,
    link = /(href="|>)((http|ftp)(s|):\/\/)([a-z-.]+[a-z]+)/,
    excludeHosts = ['twitter.com'],
    fullLinkHosts = ['technikkultur-erfurt.de', 'bytespeicher.org'],
    hostname,
    fixAsterisk;

    fixAsterisk = function (c) {
        if (c.indexOf('>* ') > -1) {
                c = '* ' + c.replace('>* ', '>');
        }
        return c;
    };

    for (i = 0; i <= lines.length; i+=1) {
        if (match.test(lines[i]) && !link.test(lines[i]) && !(new RegExp(excludeHosts.join("|")).test(lines[i]))) {
            if (match.test(lines[i-1]) && !link.test(lines[i-1])) {
                newdoc[j] = fixAsterisk('<a href="' + lines[i] + '">' + lines[i] + '</a>');
                j += 1;
            } else if (!(new RegExp(fullLinkHosts.join('|')).test(lines[i]))) {
                hostname = match.exec(lines[i]);
                hostname = hostname[hostname.length - 1];
                newdoc[j-1] = lines[i-1].trimRight() + ' (<a href=' + lines[i] + '>' + hostname + '</a>)';
            } else {
                newdoc[j-1] = fixAsterisk('<a href=' + lines[i] + '>' + lines[i-1] + '</a>');
            }
        } else {
            newdoc[j] = lines[i];
            j += 1;
        }
    }
    
    document.getElementById('content').innerHTML = newdoc.join('\n');   
}
