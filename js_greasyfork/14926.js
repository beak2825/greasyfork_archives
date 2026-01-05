// ==UserScript==
// @name           turkopticon-async
// @version        2016.05.12.1002
// @description    Review requesters on Amazon Mechanical Turk
// @author         feihtality
// @include        https://*.mturk.com/*
// @exclude        https://*.mturk.com/mturk/findhits?*hit_scraper
// @namespace      https://greasyfork.org/users/12709
// @downloadURL https://update.greasyfork.org/scripts/14926/turkopticon-async.user.js
// @updateURL https://update.greasyfork.org/scripts/14926/turkopticon-async.meta.js
// ==/UserScript==
/*jshint esnext:true*/

/*
 *
 * fork of 'turkopticon' by Lilly Irani and Six Silberman --
 * * turkopticon-async requests data from the Turkopticon servers asynchronously which improves
 *   performance and prevents the page from locking up until the request completes
 * * fixes flickering and other minor issues
 * * HIT Scraper-consistent coloring
 *
 */

// TODO: clean-up


(function() {
    'use strict';

    var TURKOPTICON_BASE = "https://turkopticon.ucsd.edu/";
    var API_BASE = "https://turkopticon.ucsd.edu/api/";
    var API_MULTI_ATTRS_URL = API_BASE + "multi-attrs.php?ids=";

    function makeXhrQuery(rai) {
        return new Promise( function(accept, reject) {
            var xhr = new XMLHttpRequest(), url = API_MULTI_ATTRS_URL + Object.keys(rai).join(',');
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.send();
            xhr.onload = e => accept(e.target.response);
            xhr.onerror = xhr.ontimeout = e => reject(e.target);
        }); }

    function ul(cl, inner) {
        return "<ul class='" + cl + "'>" + inner + "</ul>"; }

    function li(cl, inner) {
        return "<li class='" + cl + "'>" + inner + "</li>"; }

    function span(cl, inner) {
        return "<span class='" + cl + "'>" + inner + "</span>"; }

    function pad(word, space) {
        if (word.length >= space) { return word; }
        else { return word + '&nbsp;'.repeat(space - word.length); } }

    function long_word(word) {
        switch(word) {
            case "comm": return "communicativity";
            case "pay" : return "generosity";
            case "fair": return "fairness";
            case "fast": return "promptness"; } }

    function attr_html(n, i) {
        var bar = `<meter min="0.8" low="2.5" high="3.4" optimum="5" max="5" value=${i} style="width:120px"></meter>`;
        return pad(long_word(n), 15) + ": " + bar + "&nbsp;" + i + " / 5"; }

    function ro_html(attrs) {
        var rohtml = [];
        for (var attr of Object.keys(attrs))
            rohtml.push( li("attr", attr_html(attr, attrs[attr])) );
        rohtml.push(li("gray_link", "<a href='" + TURKOPTICON_BASE + "help#attr'>What do these scores mean?</a>"));
        return rohtml.join(''); }

    function nrs(rid, nrevs) {
        var str = "";
        if (typeof nrevs === 'undefined') {
            str = "<li>No reviews for this requester</li>"; }
        else { str = "<li>Scores based on <a href='" + TURKOPTICON_BASE + rid + "'>" + nrevs + " reviews</a></li>"; }
        return str; }

    function tos(tosflags) {
        return tosflags ? "<li>Terms of Service violation flags: " + tosflags + "</li>" : ''; }

    function rl(rid, name) {
        return "<li><a href='" + TURKOPTICON_BASE + "report?requester[amzn_id]=" + rid +
            "&requester[amzn_name]=" + name + "'>Report your experience with this requester &raquo;</a></li>"; }

    function insertInlineCss() {
        document.head.appendChild(document.createElement('STYLE')).innerHTML =
           ".tob, .tom { list-style-type: none; padding-left: 0; }\n"
           + ".tob { float: left; cursor:default; margin-right:5px; }\n"
           + ".tob > .tom { display: none; position: absolute; background-color: #ebe5ff; border: 1px solid #aaa; padding: 5px; margin:0; z-index:10; }\n"
           + ".tob:hover > .tom { display: block; }\n"
           + ".tob > li { border: 1px solid #9db9d1; background-color: #ebe5ff; color: #00c; padding: 3px 3px 1px 3px; }\n"
           + ".tob > li.toc { color: #f33; }\n"
           + ".tom > li { line-height:14px; font-size:12px; }\n"
           //+ "@media screen and (-webkit-min-device-pixel-ratio:0) { \n .tob { margin-top: -5px; } \n}\n"
           + ".attr { font-family: Monaco, Courier, monospace; color: #333; }\n"
           + ".bar { font-size: 0.6em; }\n"
           + ".gray_link { margin-bottom: 15px; }\n"
           + ".gray_link a { color: #666; }";}

    function insertDropDowns(rai, resp) {
        for(var rid in rai) {
            if (rai.hasOwnProperty(rid)) {
                for(var i = 0; i < rai[rid].length; i++) {
                    var td = rai[rid][i].node;
                    td.innerHTML = dropDown(resp[rid], rid) + ' ' + td.innerHTML; } } } }

    function getAnchors() {
        var a = {}, id, name,
            add = (id,obj) => id in a ? a[id].push(obj) : a[id] = [ obj ],
            fns = [ function() {
                    [].forEach.call(document.querySelectorAll('.requesterIdentity'), v => {
                        id = v.parentNode.href.match(/Id=([^&]+)/)[1]; name = v.textContent;
                        add(id, { name:name, node:v.parentNode });
                    });
                    if (!Object.keys(a).length) throw 0;
                }, function() {
                    var node = document.querySelector('a[id|="requester.tooltip"]').parentNode.nextElementSibling;
                    id = document.querySelector('input[name=requesterId]').value;
                    name = document.querySelector('input[name=prevRequester]').value;
                    add(id, { name:name, node:node });
                }, function() {
                    [].forEach.call(document.querySelectorAll('span.requester-column > a[href^=h]'), v => {
                        id = v.href.match(/Id=([^&]+)/)[1]; name = v.textContent;
                        add(id, { name:name, node:v });
                    });
                } ];
        for (var fn of fns) try { fn(); break; } catch(e) {}
        return Object.keys(a).length && a;
    }
    var TO = function(id, nodeObj, dataObj) {
        dataObj = dataObj || {};
        var avg = 'attrs' in dataObj ? _getSimpleWeightedAverage(dataObj.attrs) : 0;
        function _getSimpleWeightedAverage(attrs){
            var n = 0, d = 0, weights = { comm:1, pay:3, fair:3, fast:1 };
            for (var attr of Object.keys(attrs)) {
                n += attrs[attr] * weights[attr];
                d += weights[attr];
            }
            return (n/d).toFixed(3);
        }
        function _getColor(num) { return (!num || dataObj.reviews < 5) ? '#657b83' : num > 4 ? '#6ffa3c'  : num > 3 ? '#d9fc35' : num > 2 ? '#fbde2d' : '#fa6f50'; }
        function _makeSvg() {
            var svg = mdom.makeNS('svg', { height:20, width:20 }),
                path = mdom.makeNS('path', { fill:_getColor(avg), d:'M10 0c-5.52 0-10 4.48-10 10 0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zm4.22 5.38c1.34 0 2.41 0.42 3.22 1.25 0.81 0.83 1.22 2.02 1.22 3.5 0 1.47-0.39 2.61-1.19 3.44-0.8 0.83-1.88 1.25-3.22 1.25-1.36 0-2.45-0.42-3.25-1.25-0.8-0.83-1.19-1.95-1.19-3.41 0-0.93 0.13-1.71 0.41-2.34 0.21-0.46 0.49-0.88 0.84-1.25 0.36-0.37 0.76-0.63 1.19-0.81 0.57-0.24 1.23-0.37 1.97-0.37zm-12.47 0.16h7.25v1.56h-2.72v7.56h-1.84v-7.56h-2.69v-1.56zm12.5 1.44c-0.76 0-1.38 0.26-1.84 0.78-0.46 0.52-0.69 1.29-0.69 2.34 0 1.03 0.21 1.81 0.69 2.34 0.48 0.53 1.11 0.81 1.84 0.81 0.73 0 1.31-0.28 1.78-0.81 0.47-0.53 0.72-1.32 0.72-2.37 0-1.05-0.23-1.83-0.69-2.34-0.46-0.51-1.05-0.75-1.81-0.75z' });
            svg.appendChild(path);
            return svg;
        }
        function _makeInfoPanel() {
            var main = mdom.make('ul', { class: 'tom' }), html = [];
            if ('attrs' in dataObj) html.push(ro_html(dataObj.attrs));
            html.push(nrs(id, dataObj.reviews));
            html.push(tos(dataObj.tos_flags));
            html.push(rl(id,nodeObj[0].name));
            main.innerHTML = html.join('');
            return main;
        }
        return { insertBefore: node => {
            var _node = node[0] ? node[0].node : node;
            var s = mdom.make('span', { class: 'tob', style:_node.parentNode.tagName === 'TD' ? 'margin-top:-3px' : '' });
            s.appendChild(_makeSvg());
            s.appendChild(_makeInfoPanel());
            if (node instanceof Array) node.forEach((v,i) => i > 0 ? v.node.parentNode.insertBefore(s.cloneNode(true), v.node) : v.node.parentNode.insertBefore(s,v.node));
            else node.parentNode.insertBefore(s, node);
        } };
    },
        mdom = (function(){
            function make(el,attrs) { return setAttributes(document.createElement(el),attrs); }
            function makeNS(el,attrs) { return setAttributes(document.createElementNS('http://www.w3.org/2000/svg',el),attrs); }
            function setAttributes(el,attrs) {
                for (var a of Object.keys(attrs)) el.setAttribute(a, attrs[a]);
                return el;
            }
            return { make:make, makeNS:makeNS, setAttributes:setAttributes };
        })();

    console.log('toa hook');
    insertInlineCss();
    var anchors = getAnchors();
    if (!anchors) return;

    makeXhrQuery(anchors).then(function(r) {
        for (var id of Object.keys(r)) TO(id, anchors[id], r[id]).insertBefore(anchors[id]);
    }, err => console.warn(err.statusText, err));

})();