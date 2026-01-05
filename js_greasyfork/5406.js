// ==UserScript==
// @name           imgur to mirror
// @version		   0.2
// @description    Replaces all imgur links and pictures with mirror links
// @include        *://*/*
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/5406/imgur%20to%20mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/5406/imgur%20to%20mirror.meta.js
// ==/UserScript==

var a = document.getElementsByTagName('a');
for (i=0;i<a.length;i++) {
    p = /imgur\.com\/([A-Za-z0-9]+\.+[A-Za-z0-9]+)/;
    res = p.exec(a[i]);
    
    if (res!=null) {
        a[i].href = 'http://i.filmot.org/' + res[1];
    }
}

var p = document.getElementsByTagName('img');
for (i=0;i<p.length;i++) {
    src = /imgur\.com\/([A-Za-z0-9\/]+\.+[A-Za-z0-9]+)/;
    res = src.exec(p[i].src);
    
    if (res!=null) {
        p[i].src = 'http://i.filmot.org/' + res[1];
    }
}

var url = document.URL;
reg = /imgur\.com\/([A-Za-z0-9]+\.+[A-Za-z0-9]+)?/;
res = reg.exec(url);

if (res!=null) {
    if (res[1] != null)
    	location.replace("http://filmot.org/" + res[1]);
    else
        location.replace("http://filmot.org/");
}
    