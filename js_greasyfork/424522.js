// ==UserScript==
// @name        YouTube Location
// @namespace   https://github.com/joshcangit
// @description Automatically changes location to preferred country.
// @author      joshcangit
// @homepageURL https://greasyfork.org/en/scripts/424522-youtube-location
// @version     1.7
// @include     *://youtube.com/*
// @include     *://*.youtube.com/*
// @exclude     *://youtube.com/embed/*
// @exclude     *://*.youtube.com/embed/*
// @downloadURL https://update.greasyfork.org/scripts/424522/YouTube%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/424522/YouTube%20Location.meta.js
// ==/UserScript==

const Cookie = function(cookieName, cookieDomain) {
    this.name = cookieName,
    this.domain = cookieDomain,
    this.read = function() {
        let data = document.cookie.match('(^|[^;]+)\\s*' + this.name + '\\s*=\\s*([^;]+)');
        return data ? data.pop() : null;
    }, // https://stackoverflow.com/a/25490531
    this.remove = function() {
        while (document.cookie.includes(this.name)) {
            document.cookie = encodeURIComponent(this.name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (this.domain ? "; domain=" + this.domain : "");
        }
    }, // https://stackoverflow.com/a/30387077
    this.edit = function(param, value) {
        let array = this.read().split('&');
        let fullstr = param+value;
        let index = array.findIndex(element => element.includes(param)); // https://stackoverflow.com/a/52124191
        if (index === -1) {
            array.push(fullstr);
        } else if (array[index] !== fullstr) {
            array[index] = fullstr;
        } else fullstr = null;
        this.string = array.join('&');
        return fullstr ? this : null;
    },
    this.update = function(input) {
        let string = this.string ? this.string : input;
        while (string) {
            document.cookie = encodeURIComponent(this.name) + '=' + string + (this.domain ? "; domain=" + this.domain : "");
            location.reload();
            string = null;
        }
    }
}

let regex = /[?&]gl=\w+(&tab=\w+)*/;
if (window.location.href.match(regex)) {
    let url = window.location.href.replace(regex, '');
    if (url) window.location.replace(url);
}

let cname = new Cookie('s_gl', '.youtube.com');
cname.remove(); // delete cookie
cname = null;

let cpref = new Cookie('PREF', '.youtube.com'); // cookie storing preferences
cpref.edit('gl=', 'US').update(); // overwrite cookie with country code
cpref = null;