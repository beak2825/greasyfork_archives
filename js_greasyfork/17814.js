// ==UserScript==
// @name          Linkify commit comments (perl5.git.perl.org)
// @namespace     [mauke]/perl5.git.perl.org
// @description   turn bug references into clickable links
// @match         http://perl5.git.perl.org/perl.git/commit/*
// @match         https://perl5.git.perl.org/perl.git/commit/*
// @match         http://perl5.git.perl.org/perl.git/commitdiff/*
// @match         https://perl5.git.perl.org/perl.git/commitdiff/*
// @grant         none
// @version       1.0.0
// @downloadURL https://update.greasyfork.org/scripts/17814/Linkify%20commit%20comments%20%28perl5gitperlorg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17814/Linkify%20commit%20comments%20%28perl5gitperlorg%29.meta.js
// ==/UserScript==

'use strict';

function xpath(expr, doc) {
    doc = doc || document;
    return doc.evaluate(expr, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

let ts = xpath('//*[name()="div" and (@class="page_body" or @class="header")]//text()');

for (let i = 0; i < ts.snapshotLength; ++i) {
    let t = ts.snapshotItem(i);
    let text = t.nodeValue;
    let prev = 0;
    let frag = document.createDocumentFragment();
    let re = /(?:#|(?:bug|perl)\s+(?:#|(?=\d{2})))(\d+)/ig;
    let m;
    while ((m = re.exec(text))) {
        let pre = text.slice(prev, m.index);
        if (pre !== '') {
            frag.appendChild(document.createTextNode(pre));
        }

        let a = document.createElement('a');
        a.href = 'http://rt.perl.org/rt3/Public/Bug/Display.html?id=' + m[1];
        a.appendChild(document.createTextNode(m[0]));
        frag.appendChild(a);

        prev = re.lastIndex;
    }
    if (!frag.hasChildNodes()) {
        continue;
    }
    let fin = text.slice(prev);
    if (fin !== '') {
        frag.appendChild(document.createTextNode(fin));
    }

    let p = t.parentNode;
    //p.insertBefore(frag, t.nextSibling);
    //p.removeChild(t);
    p.replaceChild(frag, t);
}
