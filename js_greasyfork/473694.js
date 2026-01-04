// ==UserScript==
// @name           user comfort for the classicalguitardelcamp forum
// @namespace      XXX
// @description    Increases user comfort on the Delcamp CG forum. It makes all text dark, and reverses the silly mangling of commercial domain names.
// @match          https://*.classicalguitardelcamp.com/*
// @match          https://*.guitareclassiquedelcamp.com/*
// @match          https://*.chitarraclassicadelcamp.com/*
// @match          https://*.guitarraclasicadelcamp.com/*
// @match          http://*.classicalguitardelcamp.com/*
// @match          http://*.guitareclassiquedelcamp.com/*
// @match          http://*.chitarraclassicadelcamp.com/*
// @match          http://*.guitarraclasicadelcamp.com/*
// @exclude        http://userscripts.org/scripts/review/*
// @exclude        http://userscripts.org/scripts/edit/*
// @exclude        http://userscripts.org/scripts/edit_src/*
// @exclude        https://userscripts.org/scripts/review/*
// @exclude        https://userscripts.org/scripts/edit/*
// @exclude        https://userscripts.org/scripts/edit_src/*
// @copyright      René J.V. Bertin
// @version        1.0.1
// @icon           https://www.classicalguitardelcamp.com/favicon.ico
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @downloadURL https://update.greasyfork.org/scripts/473694/user%20comfort%20for%20the%20classicalguitardelcamp%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/473694/user%20comfort%20for%20the%20classicalguitardelcamp%20forum.meta.js
// ==/UserScript==
(function () {
    //
    // userscript for the classicalguitardelcamp forum
    //
    'use strict';

    // make all text almost black:
//    document.querySelectorAll('p, ul, ol, h1, h2, h3, h4').forEach(elem => {elem.style.color = '#000'});
//    /* Dark Mode# */(function () {document.head.appendChild(document.createElement('style')).innerHTML = '* {background-color: #efffef !important; color: #000 !important;}';})();
    document.querySelectorAll('*').forEach(elem => elem.style.color = '#010');

    // remove a few buttons from the phpBB message editor that are only for "more mortals":
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }

    addGlobalStyle('[name="addbbcode24"],[name="addbbcode28"]{display:none}');

    // punycode conversion adapted from https://stackoverflow.com/a/301287/1460868
    // See also https://stackoverflow.com/a/76955769/1460868 .
    //Javascript Punycode converter derived from example in RFC3492.
    //This implementation is created by some@domain.name and released into public domain
    var punycode = new function Punycode() {
        // This object converts to and from puny-code used in IDN
        //
        // punycode.ToASCII ( domain )
        //
        // Returns a puny coded representation of "domain".
        // It only converts the part of the domain name that
        // has non ASCII characters. I.e. it dosent matter if
        // you call it with a domain that already is in ASCII.
        //
        // punycode.ToUnicode (domain)
        //
        // Converts a puny-coded domain name to unicode.
        // It only converts the puny-coded parts of the domain name.
        // I.e. it dosent matter if you call it on a string
        // that already has been converted to unicode.
        //
        //
        this.utf16 = {
            // The utf16-class is necessary to convert from javascripts internal character representation to unicode and back.
            decode:function(input){
                var output = [], i=0, len=input.length,value,extra;
                while (i < len) {
                    value = input.charCodeAt(i++);
                    if ((value & 0xF800) === 0xD800) {
                        extra = input.charCodeAt(i++);
                        if ( ((value & 0xFC00) !== 0xD800) || ((extra & 0xFC00) !== 0xDC00) ) {
                            throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
                        }
                        value = ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
                    }
                    output.push(value);
                }
                return output;
            },
            encode:function(input){
                var output = [], i=0, len=input.length,value;
                while (i < len) {
                    value = input[i++];
                    if ( (value & 0xF800) === 0xD800 ) {
                        throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
                    }
                    if (value > 0xFFFF) {
                        value -= 0x10000;
                        output.push(String.fromCharCode(((value >>>10) & 0x3FF) | 0xD800));
                        value = 0xDC00 | (value & 0x3FF);
                    }
                    output.push(String.fromCharCode(value));
                }
                return output.join("");
            }
        }

        //Default parameters
        var initial_n = 0x80;
        var initial_bias = 72;
        var delimiter = "\x2D";
        var base = 36;
        var damp = 700;
        var tmin=1;
        var tmax=26;
        var skew=38;
        var maxint = 0x7FFFFFFF;

        // decode_digit(cp) returns the numeric value of a basic code
        // point (for use in representing integers) in the range 0 to
        // base-1, or base if cp is does not represent a value.

        function decode_digit(cp) {
            return cp - 48 < 10 ? cp - 22 : cp - 65 < 26 ? cp - 65 : cp - 97 < 26 ? cp - 97 : base;
        }

        //** Bias adaptation function **
        function adapt(delta, numpoints, firsttime ) {
            var k;
            delta = firsttime ? Math.floor(delta / damp) : (delta >> 1);
            delta += Math.floor(delta / numpoints);

            for (k = 0; delta > (((base - tmin) * tmax) >> 1); k += base) {
                    delta = Math.floor(delta / ( base - tmin ));
            }
            return Math.floor(k + (base - tmin + 1) * delta / (delta + skew));
        }

        // Main decode
        this.decode=function(input,preserveCase) {
            // Dont use utf16
            var output=[];
            var case_flags=[];
            var input_length = input.length;

            var n, out, i, bias, basic, j, ic, oldi, w, k, digit, t, len;

            // Initialize the state:

            n = initial_n;
            i = 0;
            bias = initial_bias;

            // Handle the basic code points: Let basic be the number of input code
            // points before the last delimiter, or 0 if there is none, then
            // copy the first basic code points to the output.

            basic = input.lastIndexOf(delimiter);
            if (basic < 0) basic = 0;

            for (j = 0; j < basic; ++j) {
                if(preserveCase) case_flags[output.length] = ( input.charCodeAt(j) -65 < 26);
                if ( input.charCodeAt(j) >= 0x80) {
                    throw new RangeError("Illegal input >= 0x80");
                }
                output.push( input.charCodeAt(j) );
            }

            // Main decoding loop: Start just after the last delimiter if any
            // basic code points were copied; start at the beginning otherwise.

            for (ic = basic > 0 ? basic + 1 : 0; ic < input_length; ) {

                // ic is the index of the next character to be consumed,

                // Decode a generalized variable-length integer into delta,
                // which gets added to i. The overflow checking is easier
                // if we increase i as we go, then subtract off its starting
                // value at the end to obtain delta.
                for (oldi = i, w = 1, k = base; ; k += base) {
                        if (ic >= input_length) {
                            throw RangeError ("punycode_bad_input(1)");
                        }
                        digit = decode_digit(input.charCodeAt(ic++));

                        if (digit >= base) {
                            throw RangeError("punycode_bad_input(2)");
                        }
                        if (digit > Math.floor((maxint - i) / w)) {
                            throw RangeError ("punycode_overflow(1)");
                        }
                        i += digit * w;
                        t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                        if (digit < t) { break; }
                        if (w > Math.floor(maxint / (base - t))) {
                            throw RangeError("punycode_overflow(2)");
                        }
                        w *= (base - t);
                }

                out = output.length + 1;
                bias = adapt(i - oldi, out, oldi === 0);

                // i was supposed to wrap around from out to 0,
                // incrementing n each time, so we'll fix that now:
                if ( Math.floor(i / out) > maxint - n) {
                    throw RangeError("punycode_overflow(3)");
                }
                n += Math.floor( i / out ) ;
                i %= out;

                // Insert n at position i of the output:
                // Case of last character determines uppercase flag:
                if (preserveCase) { case_flags.splice(i, 0, input.charCodeAt(ic -1) -65 < 26);}

                output.splice(i, 0, n);
                i++;
            }
            if (preserveCase) {
                for (i = 0, len = output.length; i < len; i++) {
                    if (case_flags[i]) {
                        output[i] = (String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);
                    }
                }
            }
            return this.utf16.encode(output);
        };

        this.ToUnicode = function ( domain ) {
            var protocol = '';
            if (domain.startsWith('https://')) {
                protocol = 'https://';
                domain = domain.substring(8);
            } else if (domain.startsWith('http://')) {
                protocol = 'http://';
                domain = domain.substring(7);
            }
            var ua = domain.split('/');
            domain = ua[0];
            var urlpath = ua.slice(1);
            var domain_array = domain.split(".");
            var out = [];
            for (var i=0; i < domain_array.length; ++i) {
                var s = domain_array[i];
                out.push(
                    s.match(/^xn--/) ?
                    punycode.decode(s.slice(4)) :
                    s
                );
            }
            var result = protocol + out.join(".") + '/' + urlpath.join('/');
            return result;
        }
    }();
///////////////////

// unmangling childishness:
// https://greasyfork.org/en/scripts/10976-replace-text-on-webpages/code
    // ==UserScript==
    // @name           Replace Text On Webpages
    // @namespace      http://userscripts.org/users/23652
    // @description    Replaces text on websites. Now supports wildcards in search queries. Won't replace text in certain tags like links and code blocks
    // @include        http://*
    // @include        https://*
    // @include        file://*
    // @exclude        http://userscripts.org/scripts/review/*
    // @exclude        http://userscripts.org/scripts/edit/*
    // @exclude        http://userscripts.org/scripts/edit_src/*
    // @exclude        https://userscripts.org/scripts/review/*
    // @exclude        https://userscripts.org/scripts/edit/*
    // @exclude        https://userscripts.org/scripts/edit_src/*
    // @copyright      JoeSimmons
    // @version        1.1.0
    // @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
    // ==/UserScript==
    function unmangle_and_growup() {
        /*
            NOTE:
                You can use \\* to match actual asterisks instead of using it as a wildcard!
                The examples below show a wildcard in use and a regular asterisk replacement.
        */

        var words = {
            ///////////////////////////////////////////////////////
            // Syntax: 'Search word' : 'Replace word',
            ///////////////////////////////////////////////////////
            'face book' : 'facebook',
            'goo gle' : 'google',
            'insta gram' : 'instagram',
            'e - b a y' : 'ebay',
            't h o m a n n' : 'thomann',
        };

        //////////////////////////////////////////////////////////////////////////////
        // This is where the real code is
        // Don't edit below this
        //////////////////////////////////////////////////////////////////////////////
        var regexs = [], replacements = [],
            tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
            rIsRegexp = /^\/(.+)\/([gim]+)?$/,
            word, text, texts, i, userRegexp;
        // RJVB
        var urlRegexs = [], urlReplacements = [];

        // prepareRegex by JoeSimmons
        // used to take a string and ready it for use in new RegExp()
        function prepareRegex(string) {
            return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
        }
        function REreplacer (fullMatch) {
            return fullMatch === '\\*' ? '*' : '[^ ]*';
        };

        // function to decide whether a parent tag will have its text replaced or not
        function isTagOk(tag) {
            return tagsWhitelist.indexOf(tag) === -1;
        }
        delete words['']; // so the user can add each entry ending with a comma,
                          // I put an extra empty key/value pair in the object.
                          // so we need to remove it before continuing
        // convert the 'words' JSON object to an Array
        for (word in words) {
            if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
                userRegexp = word.match(rIsRegexp);

                // add the search/needle/query
                if (userRegexp) {
                    regexs.push(
                        new RegExp(userRegexp[1], 'g')
                    );
                } else {
                    regexs.push(
                        new RegExp(prepareRegex(word).replace(/\\?\*/g, REreplacer), 'g')
                    );
                    // RJVB: version for URLs. It seems that Chromium gives us encoded URLs
                    // and Firefox decoded URLs, so we need to test for both.
                    // Push the regex for the encoded form of the current word:
                    urlRegexs.push(
                        new RegExp(prepareRegex(encodeURI(word)).replace(/\\?\*/g, REreplacer), 'g')
                    );
                    urlReplacements.push( words[word] );
                    // For Firefox, the verbatim word?!
                    urlRegexs.push(
                        new RegExp(prepareRegex(word).replace(/\\?\*/g, REreplacer), 'g')
                    );
                    urlReplacements.push( words[word] );
                }

                // add the replacement
                replacements.push( words[word] );
            }
        }
        // add my own dot obfuscator to the start so we replace it first:
        urlRegexs.unshift(new RegExp(prepareRegex('•').replace(/\\?\*/g, REreplacer), 'g'));
        urlReplacements.unshift('.');

        // do the replacement
        texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
        for (i = 0; text = texts.snapshotItem(i); i += 1) {
            if ( isTagOk(text.parentNode.tagName) ) {
                regexs.forEach(function (value, index) {
                    var newtext = text.data.replace( value, replacements[index] );
                    if (newtext !== text.data) {
                        text.data = newtext;
                    }
                });
            }
        }
        texts = "";

        // RJVB: also do the same replacements in the URLs
        var links = document.getElementsByTagName('a');
        for (i = 0; i < links.length; i++) {
            if (links[i].href !== "") {
                var link = /[\/\.]xn--/.test(links[i].href) ?
                    punycode.ToUnicode(links[i].href)
                : links[i].href;
                urlRegexs.forEach(function (value, index) {
                    var newlink = link.replace( value, urlReplacements[index] );
                    if (newlink !== link) {
                        links[i].href = newlink;
                    }
                });
            }
        }
        links = "";
    }

    unmangle_and_growup();
// end-unmangling

}());