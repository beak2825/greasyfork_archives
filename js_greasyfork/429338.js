// ==UserScript==
// @name         Open with VSCode
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  Support Open Remote Repo in GitHub Code menu!
// @author       Sanonz <sanonz@126.com>
// @match        https://github.com/*/*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @homepage     https://sanonz.github.io
// @supportURL   https://github.com/sanonz
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429338/Open%20with%20VSCode.user.js
// @updateURL https://update.greasyfork.org/scripts/429338/Open%20with%20VSCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function renderEditor() {
        renderItem({
            name: 'Open with Editor',
            isNewTab: true,
            url: `https://github.dev${location.pathname}`,
            icon: {
                width: 16,
                height: 16,
                viewBox: '0 0 400 400',
                path: 'M35.587 25.574 C 26.887 34.274,22.366 85.319,28.408 106.640 C 29.808 111.581,30.362 115.990,29.639 116.436 C 22.375 120.926,6.586 153.361,2.311 172.577 C -1.702 190.614,-0.380 242.019,4.623 262.483 C 23.337 339.024,75.772 372.234,183.814 375.971 C 333.315 381.142,400.042 329.514,399.989 208.709 C 399.973 171.788,393.448 148.895,375.953 124.378 L 369.021 114.663 371.179 105.378 C 378.038 75.873,372.074 26.678,361.310 23.977 C 349.211 20.940,315.376 33.668,289.736 50.901 L 277.128 59.375 269.292 57.047 C 230.073 45.401,175.046 45.086,133.396 56.269 L 122.262 59.259 109.633 50.951 C 77.787 29.999,43.062 18.098,35.587 25.574 M199.219 174.024 C 215.547 173.970,243.672 173.640,261.719 173.291 C 297.764 172.594,302.347 173.496,314.439 183.671 C 360.164 222.146,353.423 307.996,302.675 333.490 C 257.998 355.934,129.596 354.142,90.730 330.533 C 37.291 298.070,45.173 192.813,102.426 174.343 C 108.963 172.234,114.738 172.025,139.844 172.986 C 156.172 173.611,182.891 174.078,199.219 174.024 M115.787 201.123 C 100.709 208.550,93.908 238.122,102.705 258.007 C 117.257 290.906,150.790 276.028,150.686 236.719 C 150.615 210.124,133.322 192.485,115.787 201.123 M265.858 201.088 C 262.979 202.507,258.887 206.290,256.767 209.495 C 233.925 244.011,263.236 295.935,289.886 268.166 C 314.409 242.614,294.482 186.985,265.858 201.088 M176.563 301.563 C 164.758 313.367,192.597 331.661,210.156 323.639 C 224.183 317.230,229.788 307.913,223.438 301.563 C 219.132 297.257,215.495 297.640,208.594 303.125 C 205.350 305.703,201.482 307.813,200.000 307.813 C 198.518 307.813,194.650 305.703,191.406 303.125 C 184.505 297.640,180.868 297.257,176.563 301.563'
            }
        });
    }

    function renderGitpod() {
        renderItem({
            name: 'Open with Gitpod',
            isNewTab: true,
            url: `https://gitpod.io/#${location.href}`,
            icon: {
                width: 14.4,
                height: 16,
                viewBox: '0 0 36 40',
                path: 'M21.388,1.992a3.98,3.98,0,0,1-1.452,5.392L8.3,14.118a1,1,0,0,0-.5.868v10.57a1,1,0,0,0,.5.868l9.209,5.33a.975.975,0,0,0,.978,0l9.209-5.33a1,1,0,0,0,.5-.868V18.983l-8.278,4.731a3.876,3.876,0,0,1-5.316-1.5,3.979,3.979,0,0,1,1.481-5.384L27.928,10.06A5.413,5.413,0,0,1,36,14.835V26.359a7.539,7.539,0,0,1-3.742,6.531L21.685,39.009a7.345,7.345,0,0,1-7.369,0L3.742,32.89A7.539,7.539,0,0,1,0,26.359V14.184A7.539,7.539,0,0,1,3.742,7.653L16.064.521A3.876,3.876,0,0,1,21.388,1.992Z'
            }
        });
    }

    function renderVScode() {
        renderItem({
            name: 'Open with VSCode',
            url: `vscode://github.remotehub/open?url=${encodeURIComponent(location.href)}`,
            icon: {
                width: 16,
                height: 16,
                viewBox: '0 0 1024 1024',
                path: 'M746.222933 102.239573l-359.799466 330.820267L185.347413 281.4976 102.2464 329.864533l198.20544 182.132054-198.20544 182.132053 83.101013 48.510293 201.076054-151.558826 359.799466 330.676906 175.527254-85.251413V187.4944z m0 217.57952v384.341334l-255.040853-192.177494z'
            }
        });
    }

    function render() {
        renderEditor();
        renderGitpod();
        renderVScode();
    }

    function getListNode() {
        return document.querySelector('[data-target="get-repo.modal"] > ul');
    }

    function createListItem() {
        var li = document.createElement('li');
        li.className = 'Box-row Box-row--hover-gray p-3 mt-0';

        return li;
    }

    function createAnchor(href) {
        var a = document.createElement('a');
        a.className = 'd-flex flex-items-center color-fg-default text-bold no-underline';
        a.rel = 'nofollow';
        a.href = href;

        return a;
    }

    function createIcon(options) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', options.width);
        svg.setAttribute('height', options.height);
        svg.setAttribute('viewBox', options.viewBox);
        svg.setAttribute('version', '1.1');
        svg.setAttribute('class', 'octicon mr-3');
        svg.setAttribute('aria-hidden', 'true');

        var path = document.createElementNS(svg.namespaceURI, 'path');
        path.setAttribute('d', options.path);
        svg.appendChild(path);

        return svg;
    }

    function createText(text) {
        return document.createTextNode(text);
    }

    function createItem(options) {
        var li = createListItem();
        var a = createAnchor(options.url);
        var svg = createIcon(options.icon);
        var text = createText(options.name);

        if (options.isNewTab) {
            a.target = '_blank';
        }

        a.appendChild(svg);
        a.appendChild(text);
        li.appendChild(a);

        return li;
    }

    function renderItem(options) {
        var ul = getListNode();
        var li = createItem(options);
        var ref = ul.querySelector('li[data-platforms]') || ul.children[ul.children.length - 1];

        ul.insertBefore(li, ref);
    }

    window.addEventListener('pjax:complete', function(evt) {
        const pathnames = location.pathname.substr(1).split('/');
        if (pathnames.length === 2) {
            render();
        }
    });

    render();
})();