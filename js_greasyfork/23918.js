// ==UserScript==
// @name        ABP Digest: Open in pop-in
// @namespace   lainscripts_abp_digest_popin
// @description Opens reports in pop-in window.
// @include     *://reports.adblockplus.org/*
// @version     0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/23918/ABP%20Digest%3A%20Open%20in%20pop-in.user.js
// @updateURL https://update.greasyfork.org/scripts/23918/ABP%20Digest%3A%20Open%20in%20pop-in.meta.js
// ==/UserScript==
/* jshint esnext: true */
(()=>{
    'use strict';

    var inIframe = (function(){ try { return window.self !== window.top; } catch (ignore) { return true; } })();
    // attach styles before document displayed
    (function(style) {
        style.id = 'popinStyles';
        style.type = 'text/css';
        document.head.appendChild(style);

        style.sheet.insertRule('@keyframes spinnerFrames {0% {transform:rotate(0deg)} 100% {transform:rotate(-360deg)}}',0);
        style.sheet.insertRule('#popinSpinner svg {'+
                               ['animation: spinnerFrames linear 1s',
                                'animation-iteration-count: infinite',
                                'transform-origin: 50% 50%'].join(';')+'}', 0);
        style.sheet.insertRule('#popinBackground {'+
                               ['box-sizing: border-box',
                                'position: fixed',
                                'top: 0',
                                'left: 0',
                                'padding: 35px 40px',
                                'width: 100%',
                                'height: 100%',
                                'background-color: rgba(0,0,0,0.85)',
                                'z-index: 1000000',
                                'display: none'].join(';')+'}', 0);
        style.sheet.insertRule('#popinFrame {'+
                               ['position: relative',
                                'width: 100%',
                                'height: 100%',
                                'border: #aaa 2px solid',
                                'border-radius: 3px',
                                'background-color: rgba(0,0,0,0.33)',
                                'z-index: 1'].join(';')+'}', 0);
        style.sheet.insertRule('#popinSpinner {'+
                               ['position: fixed',
                                'top: 50%',
                                'left: 50%',
                                'margin-top: -50px',
                                'margin-left: -50px',
                                'width: 100px',
                                'height: 100px',
                                'z-index: 2'].join(';')+'}', 0);


        // modify navigation elements when various pages are loaded in the pop-in
        if (inIframe) {
            // make page cover the entire window height and reset padding with margin if someone changed them
            style.sheet.insertRule('html, body {'+['height: 100%',
                                                   'padding: 0!important',
                                                   'margin: 0!important'].join(';')+'}', 0);
            // let that status block at the top grow
            style.sheet.insertRule('#overview th, #overview td { max-width: none !important }', 0);
        }

    })(document.createElement('style'));

    function createSVGSpinner(out_radius, in_radius, width, number_of_lines, period, direction) {
        var num = number_of_lines, shift = out_radius + width / 2, step = 0;
        var nameSpace = 'http://www.w3.org/2000/svg';

        var svg = document.createElementNS(nameSpace, 'svg');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('x', '0px');
        svg.setAttribute('y', '0px');
        svg.setAttribute('width', (2 * shift) + 'px');
        svg.setAttribute('height', (2 * shift) + 'px');
        svg.setAttribute('style', ['stroke: #fff',
                                   'stroke-width: ' + width + 'px',
                                   'stroke-linecap: round'].join(';'));

        var g = document.createElementNS(nameSpace, 'g');
        svg.appendChild(g);

        var line;
        while (num--) {
            if (direction >= 0) step = num; else step = number_of_lines - num;
            line = document.createElementNS(nameSpace, 'line');
            line.setAttribute('x1', shift + Math.cos(2 * Math.PI / number_of_lines * num) * in_radius);
            line.setAttribute('y1', shift + Math.sin(2 * Math.PI / number_of_lines * num) * in_radius);
            line.setAttribute('x2', shift + Math.cos(2 * Math.PI / number_of_lines * num) * out_radius);
            line.setAttribute('y2', shift + Math.sin(2 * Math.PI / number_of_lines * num) * out_radius);
            line.setAttribute('stroke-opacity', 1 / (num + 1));
            g.appendChild(line);
        }
        return svg;
    }

    function popinObj() {
        /* jshint validthis: true */
        var _self = this;
        _self.childPopin = null;

        var spinner = document.createElement('div');
        spinner.appendChild(createSVGSpinner(45, 25, 10, 10, 1.8, -1));
        spinner.id = 'popinSpinner';

        var popin = document.createElement('div');
        popin.id = 'popinBackground';

        var ifrm = null;
        var openFrame = function (a) {
            var url = a.href;
            var ifr = document.createElement('iframe');
            ifr.id = 'popinFrame';
            ifr.onload = function() { spinner.style.zIndex = 0; };

            // Hide spinner if page keeps loading after a 5 seconds
            setTimeout(function() {
                if (popin.style.display === 'block')
                    spinner.style.zIndex = 0;
            }, 5000);

            ifr.src = url;
            return ifr;
        };

        popin.appendChild(spinner);
        document.body.appendChild(popin);

        _self.show = function (a) {
            document.body.style.overflowY = 'hidden';
            ifrm = openFrame(a);
            popin.appendChild(ifrm);
            popin.style.display = 'block';
        };

        _self.hide = function () {
            document.body.style.overflowY = 'auto';
            popin.removeAttribute('style');
            spinner.removeAttribute('style');
            ifrm.parentNode.removeChild(ifrm);
            ifrm = null;
        };

        popin.onclick = _self.hide;
    }

    document.addEventListener ("DOMContentLoaded", function() {
        document.popin = new popinObj();

        document.body.addEventListener('click', function(e) {
            var t = e.target;

            // handle only LMB clicks
            if (e.which !== 1)
                return;

            // try to drill up to an A element if present
            while (t.parentNode && !t.href)
                t = t.parentNode;

            // if user clicked a link - try to handle it properly
            if (t.href) {
                if (!inIframe && t.hostname === document.location.hostname) {
                    document.popin.show(t);
                    e.preventDefault();
                } else {
                    t.target = '_blank';
                }
            }
        });
    });
})();