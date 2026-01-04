// ==UserScript==
// @name         bili cdn change
// @version      0.4.5
// @description  change bilivideo cdn
// @author       kuai
// @modified     nog
// @match        https://www.bilibili.com/*
// @grant        none
// @namespace https://greasyfork.org/users/69829
// @downloadURL https://update.greasyfork.org/scripts/426218/bili%20cdn%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/426218/bili%20cdn%20change.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let requestedDomain = {
        goodNode: new Set(),
        badNode: new Set(),
        switchedNode: new Set(),
        otherNode: new Set(),
    };
    window.requestedDomain = requestedDomain;

    const goodCdn = [
        // 'upos-sz-mirrorks3.bilivideo.com',
        // 'upos-sz-mirrorks3b.bilivideo.com',
        // 'upos-sz-mirrorks3c.bilivideo.com',
        // 'upos-sz-mirrorks32.bilivideo.com',
        // 'upos-sz-mirrorkodo.bilivideo.com',   //cdn for jp
        // 'upos-sz-mirrorkodob.bilivideo.com',
        // 'upos-sz-mirrorcos.bilivideo.com',
        // 'upos-sz-mirrorcosb.bilivideo.com',
        // 'upos-sz-mirrorbos.bilivideo.com',
        // 'upos-sz-mirrorwcs.bilivideo.com',
        // 'upos-sz-mirrorwcsb.bilivideo.com',
        /** 不限CROS, 限制UA */
         'upos-sz-mirrorhw.bilivideo.com',
        // 'upos-sz-mirrorhwb.bilivideo.com',
        // 'upos-sz-upcdnbda2.bilivideo.com',
        // 'upos-sz-upcdnws.bilivideo.com',
        // 'upos-sz-upcdntx.bilivideo.com',
        // 'upos-sz-upcdnhw.bilivideo.com',
        // 'upos-tf-all-js.bilivideo.com',
        // 'cn-hk-eq-bcache-01.bilivideo.com',
        // 'upos-hz-mirrorakam.akamaized.net',
    ];

    const setBuffer = async () => {
        if (window.dashPlayer) {
            if (window.dashPlayer.getStableBufferTime() !== 300) {
                window.dashPlayer.setStableBufferTime(300);
            }
        }
    };

    const putRequestedDomain = async (domain, from, nNode) => {
        switch (from) {
            case "goodNode":
                break;
            case "badNode":
                requestedDomain.switchedNode.add(nNode);
                break;
            case "otherNode":
                break;
        }
        requestedDomain[from].add(domain);
    };

    XMLHttpRequest.prototype.origin_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        let nUrl = url;
        if (/^https:\/\/[a-z.-\d]*bilivideo.com/i.test(url)) {
            let node = url.match(/(?<=^https:\/\/)[a-z.-\d]*(?=.bilivideo.com)/i)[0];
            if (goodCdn.includes(node)) {
                putRequestedDomain(node, "goodNode");
            } else {
                let nNode;
                if (requestedDomain.goodNode.size) {
                    const goodNodeList = Array.from(requestedDomain.goodNode);
                    nNode = goodNodeList[0];
                    putRequestedDomain(nNode, "goodNode");
                } else {
                    nNode = goodCdn[Math.floor(Math.random() * goodCdn.length)];
                    putRequestedDomain(node, "badNode", nNode);
                }
                nUrl = url.replace(/^https:\/\/[a-z.-\d]*bilivideo.com/i, "https://" + nNode);
            }
            setBuffer();
        } else {
            putRequestedDomain(url, "otherNode");
        }
        return this.origin_open(method, nUrl, async === undefined ? true : async, user, password);
    };

})();