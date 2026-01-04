// ==UserScript==
// @name        Rename pornhub downloads
// @description Rename pornhub downloads to include quality, uploader, title, and view key
// @license     Creative Commons BY-NC-SA
// @include     https://www.pornhubpremium.com/view_video.php?viewkey=*
// @include     *://*.phprcdn.com/*
// @encoding    utf-8
// @grant       GM_download
// @noframes
// @run-at      document-end
// @nocompat    Chrome
// @namespace   https://greasyfork.org/users/45933
// @version 0.1.20
// @downloadURL https://update.greasyfork.org/scripts/408514/Rename%20pornhub%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/408514/Rename%20pornhub%20downloads.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// TODO: get pornstar list
function getPermissiveNormalize(s) {
    'use strict';
    // Note: MUST strip "?"
    return s.normalize('NFKD').replace(/[^\w\s`~!@#$%^&*()+=[\]{}|;:'"<,>.-]/g, '_');
}

function xPathResultToSingleNode(x, context) {
    'use strict';
    if (!x) {
        alert("NULL xPathResult! " + context);
    }
    let first = x.iterateNext();
    if (!first) {
        alert("No xPathResult node! " + context);
        return;
    }
    let second = x.iterateNext();
    if (second != null) {
        alert("xPathResult had second node! [" + second + " ] " + context);
    }
    return first;
}

function xPathResultToFirstNode(x, context) {
    'use strict';
    if (!x) {
        alert("NULL xPathResult! " + context);
    }
    let first = x.iterateNext();
    if (!first) {
        alert("No xPathResult node! " + context);
        return;
    }
    return first;
}

var decodeEntities = (function() {
    'use strict';
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities (str) {
        if(str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            str = str.replace(/&thinsp;/g, ' ');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();

function logIfChanged(prev, curr, desc, do_alert) {
    'use strict';
    if (prev != curr) {
        let arr = [ desc, "[", prev, prev.length, "]=>[", curr, curr.length, "]" ];
        let message = arr.join(' ');
        console.log(message);
        if (do_alert) {
            alert(message);
        }
    }
}

function logIfNotChanged(prev, curr, desc, do_alert) {
    'use strict';
    if (prev == curr) {
        let arr = [ desc, "[", prev, prev.length, "]=>[", curr, curr.length, "]" ];
        let message = arr.join(' ');
        console.log(message);
        if (do_alert) {
            alert(message);
        }
    }
}


function normalize(s) {
    'use strict';
    var prev = s;
    // HTML entities can mess with things (especially because of '#')
    s = decodeEntities(s);
    logIfChanged(prev, s, "Warning! HTML Entities:");
    prev = s;

    // '/' messes with directory
    // '?' somehow causes failures
    // Causes Download failures:
    //    '|'
    //    '"'
    //    ':'
    //    '~'
    //    '*'
    s = s.replace(/[?\/|":~*]/g, '_');
    logIfChanged(prev, s, "Warning! Bad Characters=>'_':", false);
    prev = s;

    // Weird characters that cause problems; replace with whitespace
    let invalid = decodeEntities("&#8203;&thinsp;&#8299;");
    s = s.replace(new RegExp('[' + invalid + ']', 'g'), ' ', false);
    logIfChanged(prev, s, "Warning! Invalid Characters=>' ':", false);
    prev = s;

    // '#' prevents totcmd from launching but useful, so turn into "No."
    s = s.replace(/[#]/g, 'No.');
    logIfChanged(prev, s, "Warning! #=>No.:", false);
    prev = s;

    let interesting = s.replace(/[\[\]\n]/g, '_');
    logIfChanged(s, interesting, "Preemptive warning; may cause problems with scripts", true);

    // Normalize whitespace
    s = s.replace(/\s+/g, ' ');

    // Print unexpected chars:
    let weird = new RegExp("[^a-zA-Z0-9 ]");
    if (s.match(weird)) {
        console.log('[' + s + '] has weird characters:');
        for (let i = 0; i < s.length; i++) {
            if (s[i].match(weird)) {
                console.log('[' + i + '] = [' + s[i] + '] code = ' + s.charCodeAt(i) + ', codePoint (first?) = ' + s[i].codePointAt(0) + '|');
            }
        }
    }

    return s;
}

function getViewKeyInternal() {
    'use strict';

    var rgxp = /viewkey=(\w+)/;

    //<link rel="canonical" href="https://www.pornhubpremium.com/view_video.php?viewkey=10198633" />
    let linkResult = document.evaluate('//link[@rel="canonical" and @href and contains(@href, "?viewkey=")]/@href', document, null, XPathResult.ANY_TYPE, null);
    let linkHref = xPathResultToFirstNode(linkResult);
    let linkHrefText = linkHref.value;
    let match = rgxp.exec(linkHrefText);

    let key1 = null;
    let key2 = null;
    if (match) {
        key1 = match[1];
    }

    // Try actual URL
    match = rgxp.exec(window.location.href);
    if (match) {
        key2 = match[1];
    }
    logIfChanged(key1, key2, "Comparing viewKey from xpath and url", true);
    if (!key1 || !key2 || !key1.length || key1 != key2) {
        alert('Failed to find viewkey');
        return "viewkey";
    }
    return key1;
}

function getViewKey() {
    'use strict';
    let str = getViewKeyInternal();
    console.info("view key =", str);
    return str;
}

function getTitleInternal() {
    'use strict';
    let docTitle = decodeEntities(document.title);
    let prev = docTitle;
    docTitle = docTitle.replace(/ - Pornhub$/, '');
    docTitle = docTitle.replace(/ - Pornhub\.com$/, '');
    //logIfNotChanged(prev, docTitle, "Did not find end of title correctly", true);

    let spanWithTitle = document.evaluate('//h1[@class="title"]/span', document, null, XPathResult.ANY_TYPE, null);
    let node = xPathResultToSingleNode(spanWithTitle);
    let nodeTitle = decodeEntities(node.innerHTML);

    docTitle = docTitle.replace(/\s\s*/g, ' ');
    nodeTitle = nodeTitle.replace(/\s\s*/g, ' ');
    logIfChanged(docTitle, nodeTitle, "Comparing doc title and xpath title", true);

    let title = nodeTitle;
    if (!docTitle || !nodeTitle || docTitle != nodeTitle || !title.length) {
        alert('Failed to find title');
        return "Untitled";
    }
    return title;
}

function getTitle() {
    'use strict';
    let str = getTitleInternal();
    let normal = normalize(str);
    if (str != normal) {
        console.info("Title not normalized: [", str, "] => [", normal, "]; using normalized");
    }
    return normal;
}

// WARNING: lots of things are explicitly unknown.  Need to find that somehow instead of error.
function getUsernameInternal() {
    'use strict';

    // <span class="usernameBadgesWrapper"><a rel="nofollow" href="/users/zoip1000"  class="bolded">zoip1000</a></span>
    var infos = document.getElementsByClassName("video-info-row");
    if (!infos.length) {
        alert('Failed to find username1');
        return ['Unknown', 'Unknown'];
    }
    if (!infos[0].classList.contains("userRow")) {
        return ['Unknown', 'Unknown'];
    }
    var wrappers = infos[0].getElementsByClassName("usernameBadgesWrapper");
    if (!wrappers.length) {
        wrappers = infos[0].getElementsByClassName("usernameWrap");
    }
    if (!wrappers.length) {
        alert('Failed to find username2');
        return ['Unknown', 'Unknown'];
    }
    var wrapper = wrappers[0];
    var anchors = wrapper.getElementsByTagName("a");
    if (!anchors.length) {
        var span_usernames = wrapper.getElementsByClassName("username");
        if (span_usernames.length != 1 ||
            span_usernames[0].tagName != 'SPAN' ||
            !span_usernames[0].innerText ||
            (span_usernames[0].innerText != 'Unknown' && span_usernames[0].innerText != 'unknown')
           )
        {
            alert('Failed to find username3');
        }
        return ['Unknown', 'Unknown'];
    }
    let anchor = anchors[0];

    var attrib = anchor.getAttribute("href");
    if (attrib) {
        let match = /^\/(users|channels|model|pornstar)\/([^/]*)$/.exec(attrib);
        if (match) {
            return [match[1], match[2]];
        }
    }

    if (anchor.innerHTML) {
        let guess = anchor.innerHTML.toString();
        alert('Failed to find username4, from [' + attrib + ']; guessing [' + guess + ']');
        return [guess, guess];
    }
    alert('Failed to find username5');
    return ['Unknown', 'Unknown'];
}

function getUsername() {
    'use strict';
    const [type, name] = getUsernameInternal();
    let normal_name = normalize(name);
    if (name != normal_name) {
        console.info("Username not normalized: [", name, "] => [", normal_name, "]; using normalized");
        return [type, normal_name];
    }
    return [type, name];
}

function stringKbpsToMbps(x) {
    'use strict';
    // x is a string of Kbps (origially ???K). The "K" is assumed to already be stripped
    let num = parseInt(x);
    if (num) {
        return (num / 1000) + "Mbps";
    }
    alert('Failed to find rate');
    return "";
}

function urlToQuality(url) {
    'use strict';
    console.log("urlToQuality(", url, ");");
    if (url == '/devices/vr/oculus-rift') {
        // ignore non-video
        return '';
    }
    var fname_r = /^.*\/([^/?]+)([?].*|$)/.exec(url);
    if (!fname_r) {
        alert('Failed to find fname quality for url [' + url + ']');
        return "SomeP";
    }
    var fname = fname_r[1];
    let regexps = [
        /(2160)P_(\d+)[Kk]/,
        /(1440)P_(\d+)[Kk]/,
        /(1080)P_(\d+)[Kk]/,
        /(720)P_(\d+)[Kk]/,
        /(480)P_(\d+)[Kk]/,
        /(240)P_(\d+)[Kk]/,
        /(2160)P/,
        /(1440)P/,
        /(1080)P/,
        /(720)P/,
        /(480)P/,
        /(240)P/,
        /(2160)_(\d+)[Kk]/,
        /(1440)_(\d+)[Kk]/,
        /(1080)_(\d+)[Kk]/,
        /(720)_(\d+)[Kk]/,
        /(480)_(\d+)[Kk]/,
        /(240)_(\d+)[Kk]/,
        /(2160)/,
        /(1440)/,
        /(1080)/,
        /(720)/,
        /(480)/,
        /(240)/
    ];
    for (let i = 0; i < regexps.length; i++) {
        let r = regexps[i];
        let match = r.exec(fname);
        if (match) {
            let quality = match[1] + "P";
            console.log("Matches: [", match[0], "] [", match[1], "] [", match[2], "]");
            if (match.length > 2) {
                let rate = match[2];
                rate = rate.replace(/\d+$/, stringKbpsToMbps);
                if (rate) {
                    quality += "_" + rate;
                }
            } else {
                alert('Failed to find rate for url [' + url + '] => fname [' + fname_r + ']');
            }
            return quality;
        }
    }
    alert('Failed to find quality for url [' + url + '] => fname [' + fname_r + ']');
    return "SomeP";
}

function getPremium() {
    'use strict';
    // This is idiotic.  Both normal and premium videos have the exact same thing, but one has an id called videoTitle.
    var stupid = document.getElementById("videoTitle");
    if (stupid) {
        // Is premium
        return "_P "; // Should sort sooner
    } else {
        // I don't know how to warn cause absence is how to detect this.do this in a negative fashion; I can't do an error here.
        return "";
    }
}

function getIsVR() {
    'use strict';
    return !!document.getElementById("vrList") || !!document.getElementById("vrWrap");
    // I don't know how to warn cause absence is how to detect this.do this in a negative fashion; I can't do an error here.
}

(function() {
    'use strict';

    var viewKey = getViewKey();
    var title = getTitle();
    const [type, username] = getUsername();
    var premium = getPremium();
    var isVR = getIsVR();

    console.log("***Determined",
                'viewKey=[',viewKey,
                '] title=[',title,
                '] type=[',type,
                '] username=[',username,
                '] premium=[',premium,
                '] isVR=[',isVR,
                ']'
               );
    var downloads = document.getElementsByClassName("downloadBtn");
    // Getting length == 0 is how to detect "Download disabled/$$$" so can't alert here
    for (let i = 0; i < downloads.length; i++) {
        let download = downloads[i];
        if (download.tagName != 'A' || !download.hasAttribute("href")) {
            console.log('Failed;',
                        'tagName=[', download.tagName,
                        '] hasAttribute("href")=[', download.hasAttribute("href"),
                        ']');
            alert("Failed to modify download; see console");
            continue;
        }
        let href = download.getAttribute("href");
        let quality = urlToQuality(href);
        let filename = "pornhub_downloads/";
        if (isVR) {
            filename += "vr/";
        }
        if (username == "Unknown") {
            if (type != "Unknown") {
                alert('Username unknown but type=[' + type + ']');
            }
            filename += quality + "/";
        } else {
            filename += type + '/';
            filename += username + "/";
        }
        filename += premium;
        filename += title;
        filename += " by " + username;
        filename += " " + quality;
        filename += " key=" + viewKey + ".mp4";

        console.log("***Setting download for",
                    'url=[',href,
                    '] filename=[',filename,
                    ']'
                   );
        download.onclick = () => {
            var arg = {
                url: href,
                name: filename,
                onerror: function (error) {
                    console.log("Error downloading " + href + ":");
                    console.log(error);
                    alert("Error downloading (check console) " + filename);
                }
            };
            var result= GM_download(arg);
            console.log(result);
            return false;
        };
    }
})();