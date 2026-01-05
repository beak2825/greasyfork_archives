// ==UserScript==
// @name          Linkify bug comments (rt.perl.org)
// @namespace     [mauke]/rt.perl.org
// @description   turn commit references into clickable links
// @match         http://rt.perl.org/*
// @match         https://rt.perl.org/*
// @grant         GM_xmlhttpRequest
// @version       1.0.2
// @downloadURL https://update.greasyfork.org/scripts/17813/Linkify%20bug%20comments%20%28rtperlorg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17813/Linkify%20bug%20comments%20%28rtperlorg%29.meta.js
// ==/UserScript==

'use strict';

const RT_TICKET = 'http://rt.perl.org/rt3/Public/Bug/Display.html?id=';

const GIT_BASE = 'http://perl5.git.perl.org';
const GIT_REPO = GIT_BASE + '/perl.git';
const GIT_COMMITDIFF = GIT_REPO + '/commitdiff/';

function search_git_for(s) {
    return GIT_REPO + '?a=search&h=HEAD&st=commit&s=' + encodeURIComponent(s);
}

function process_ranges_under(root, predicate, body, kont) {
    if (predicate(root)) {
        let range = document.createRange();
        range.selectNode(root);
        return body(range, kont);
    }

    let queue = [root];

    let loop_tree = function loop_tree() {
        while (queue.length) {
            let node = queue.shift();
            if (node.nodeType !== node.ELEMENT_NODE) {
                continue;
            }

            let loop_children = function loop_children(p) {
                while (p) {
                    if (!predicate(p)) {
                        queue.push(p);
                        p = p.nextSibling;
                        continue;
                    }

                    let range = document.createRange();
                    range.setStartBefore(p);
                    while (p.nextSibling && predicate(p.nextSibling)) {
                        p = p.nextSibling;
                    }
                    range.setEndAfter(p);
                    p = p.nextSibling;
                    return body(range, () => loop_children(p));
                }
                return loop_tree();
            };

            return loop_children(node.firstChild);
        }
        return kont();
    };
    return loop_tree();
}

function is_kinda_text(node) {
    return (
        node.nodeType === node.TEXT_NODE ||
        node.nodeType === node.ELEMENT_NODE && node.nodeName === 'BR'
    );
}

function replace_text_under(root, body, kont) {
    return process_ranges_under(
        root,
        is_kinda_text,
        function (range, kont_inner) {
            let synth = '';
            let frag = range.extractContents();
            for (let p = frag.firstChild; p; p = p.nextSibling) {
                synth += p.nodeType === p.TEXT_NODE ? p.nodeValue : '\0';
            }
            return body(synth, (x) => {
                range.insertNode(x);
                return kont_inner();
            });
        },
        kont
    );
}

function xpath(expr, doc) {
    doc = doc || document;
    return doc.evaluate(expr, doc, () => 'http://www.w3.org/1999/xhtml', XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

function autolink(text, kont_outer) {
    let re = function () {

        let bug_re = (
            '(?:' +
                '\\b' +
                '(?:' +
                    'bug' +
                '|' +
                    'fix\\w*' +
                '|' +
                    'perl' +
                ')' +
            ')?' +
            '[\\0\\s]+' +
            '#' +
            // $1
            '(' +
                '\\d{2,}' +
            ')' +
            '\\b'
        );

        let commit_re = (
            // $2
            '(' +
                '\\b' +
                '(?:' +
                    'as' +
                '|' +
                    'by' +
                '|' +
                    'commit' +
                '|' +
                    'in' +
                '|' +
                    'of' +
                '|' +
                    'with' +
                ')' +
                '[\\0\\s]+' +
            '|' +
                '[(:\\0]' +
                '[\\0\\s]*' +
            ')' +
            // $3
            '(' +
                '[\\da-f]{4,}' + '\\b' +
                '(?:' +
                    '[\\0\\s]*' +
                    '(?:' +
                        ',' +
                    '|' +
                        '(?:' +
                            ',' +
                            '[\\0\\s]*' +
                        ')?' +
                        '(?:' +
                            'and' +
                        '|' +
                            'or' +
                        ')' +
                        '[\\0\\s]' +
                    ')' +
                    '[\\0\\s]*' +
                    '[\\da-f]{4,}' + '\\b' +
                ')*' +
            ')'
        );

        let p4id_re = (
            // $4
            '(' +
                'applied' +
                '[\\0\\s]+' +
                'as' +
                '[\\0\\s]+' +
            '|' +
                'change' +
                '[\\0\\s]*' +
            ')' +
            // $5
            '(' +
                '#' + '\\d{2,}' + '\\b' +
            ')'
        );

        return new RegExp([bug_re, commit_re, p4id_re].join('|'), 'ig');
    }();

    let prev = 0;
    let frag = document.createDocumentFragment();

    function autotext_from(t, a, z) {
        let chunk = t.slice(a, z);
        let pieces = chunk.match(/[^\0]+|\0/g) || [];
        for (let p of pieces) {
            let x = p === '\0'
                ? document.createElement('br')
                : document.createTextNode(p)
            ;
            frag.appendChild(x);
        }
    }

    function autotext(to) {
        autotext_from(text, prev, to);
    }

    function step(kont) {
        let m = re.exec(text);
        if (!m) {
            return kont();
        }
        autotext(m.index + (m[2] || m[4] || '').length);

        let link_url, link_text;
        let kont_local = function () {
            let a = document.createElement('a');
            a.href = link_url;
            a.appendChild(document.createTextNode(link_text));
            frag.appendChild(a);

            prev = re.lastIndex;
            return step(kont);
        };

        if (m[1]) {
            link_url = RT_TICKET + m[1];
            link_text = m[0];
        } else if (m[3]) {
            if (/^[\da-fA-F]+$/.test(m[3])) {
                link_url = GIT_COMMITDIFF + m[3];
                link_text = m[3];
            } else {
                let t = m[3];
                let p = 0;
                let re2 = /\b[\da-fA-F]{4,}\b/g;
                let m2;
                while ((m2 = re2.exec(t))) {
                    autotext_from(t, p, m2.index);
                    let a = document.createElement('a');
                    a.href = GIT_COMMITDIFF + m2[0];
                    a.appendChild(document.createTextNode(m2[0]));
                    frag.appendChild(a);
                    p = re2.lastIndex;
                }
                autotext_from(t, p, t.length);
                prev = re.lastIndex;
                return step(kont);
            }
        } else {
            let srch = search_git_for('@' + m[5].substr(1));
            return GM_xmlhttpRequest({
                method:             'GET',
                synchronous:        false,
                url:                srch,
                responseType:       'document',
                onreadystatechange: function (r) {
                    if (r.readyState !== 4) return;
                    link_text = m[5];
                    link_url = srch;
                    if (r.status === 200 && typeof r.response === 'object') {
                        let results = xpath(
                            '//h:table[@class="commit_search"]' +
                            '//h:tr' +
                                '[h:td/h:span[@class="match"][not(following-sibling::text())]]' +
                            '/h:td[@class="link"]' +
                            '/h:a[text()="commitdiff"][last()]',
                            r.response
                        );
                        if (results && results.snapshotLength === 1) {
                            let base = (/^\w+:\/\/[^\/]+/.exec(r.finalUrl) || [GIT_BASE])[0];
                            link_url = results.snapshotItem(0).href.replace(/^(?=\/)/, () => base);
                        }
                    }
                    return kont_local();
                },
            });
        }

        return kont_local();
    }

    step(function () {
        autotext(text.length);
        return kont_outer(frag);
    });
}

let roots = document.querySelectorAll('div.messagebody');
for (let root of roots) {
    replace_text_under(root, autolink, () => {});
}
