// ==UserScript==
// @name         Bilibili-AID
// @namespace    pastezhu.blog.fc2blog.us
// @version      0.4.0
// @description  Display BILIBILI AID
// @author       Tealeaf
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430413/Bilibili-AID.user.js
// @updateURL https://update.greasyfork.org/scripts/430413/Bilibili-AID.meta.js
// ==/UserScript==

(function(window) {
    'use strict';

    const table = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    let tr = {};
    for (let i = 0; i < 58; ++i) {
        tr[table[i]] = BigInt(i);
    }

	const xor_code = BigInt(23442827791579);
	const msk_code = BigInt(2251799813685247);

	function swap(x,a,b) {
        return x.substring(0,a)+x[b]+x.substring(a+1,b)+x[a]+x.substring(b+1);
	}

    function dec(x) {
		x = swap(x, 3, 9);
		x = swap(x, 4, 7);
        let r = BigInt(0);
        for (let i = 3; i < x.length; i++) {
            r = r * BigInt(58) + tr[x[i]];
        }
		r = (r & msk_code) ^ xor_code;
        return 'av' + r.toString(10);
    }

    function bv2av(x) {
        if (!x.match("www.bilibili.com")) return [null, null];
        if (x.includes('/watchlater/')) return [null, null];
        const avs = x.match(/[aA][vV][0-9]+/g);
        if (avs) {
            for (const av of avs) {
                return [av, x.substring(0, x.indexOf(av)) + av];
            }
        }
        const bvs = x.match(/[bB][vV][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/g);
        if (bvs) {
            for (const bv of bvs) {
                var av = dec(bv);
                return [av, x.substring(0, x.indexOf(bv)) + av];
            }
        }
        return [null, null];
    }

    var oav = null;
    var display = function() {
        const [av, avhref] = bv2av(window.location.href);
        if (oav !== av || !(document.getElementById('aid'))) {
            console.log("show aid", av);
            var $text = document.getElementById('aid');
            if ($text == null) {
                var $av = document.createElement('span');
                var $link = document.createElement('a');
                $link.setAttribute('target', '_blank');
                $link.style.marginLeft = '3px';
                $link.innerText = '(^-^)';
                $text = document.createElement('span');
                $text.setAttribute('id', 'aid');
                $text.setAttribute('class', 'view item');
                $text.style.marginRight = '1rem';
                $text.append($av, $link);
                var $parent = document.querySelector('.video-info-meta > .video-info-detail-list');
                if ($parent != null) {
                    $parent.insertBefore($text, $parent.children[0]);
                }
            }
            var $ref = $text.getElementsByTagName('span')[0];
            $ref.innerText = av;
            $ref = $text.getElementsByTagName('a')[0];
            $ref.setAttribute('href', avhref);
            oav = av;
        }
        setTimeout(display, 1000);
    }
    setTimeout(display, 1000);
})(window);
