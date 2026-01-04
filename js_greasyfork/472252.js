// ==UserScript==
// @name     Yad2 mark ads as seen
// @include  https://*.yad2.co.il/*
// @grant    GM_addStyle
// @description Add remarks to ads
// @run-at   document-start
// @namespace https://greasyfork.org/users/838639
// @version 0.0.1.20230918100523
// @downloadURL https://update.greasyfork.org/scripts/472252/Yad2%20mark%20ads%20as%20seen.user.js
// @updateURL https://update.greasyfork.org/scripts/472252/Yad2%20mark%20ads%20as%20seen.meta.js
// ==/UserScript==

var remarks = {
'2y6o1r5p': 'tma 38',
'md7dfpng': 'pinui binui',
'f2cho5wb': 'pinui binui',
'fmgwtb9e': 'pinui binui',
'7xuo0gxq': 'pinui binui',
'afu5zri1': 'pinui binui',
'kd6fw6dy': 'pinui binui',
'g2aqfhqo': 'can only see 1.09',
'8jdhycel': 'half underground',
'xhxwnm6b': 'weird landord',
'pkfykeoy': 'two main streets, jabotinsky and namir',
'yu1qfnmw': 'too expensive',
'qblcmo86': 'pinui binui',
'ci7le1uw': 'pinui binui',
'rczzjs1n': 'fourth floor',
'a9vq6onu': 'tma 38, sneaky realtor',
'pdscg2l0': 'three months', 
'x0ckdamb': 'facing arlozorov',
'nucbadbj': 'pre TMA',
'x9hhtsya': 'facing namir',
'sw9g8fhy': 'pinui binui',
'fc40o6ln': 'main street',
'9ryq9k3z': 'pinui binui',
'x4kzf8fj': 'third floor',
'h5wn4tqh': 'no stove',
'jev70rbt': 'pinui binui',
'xzdy4l6c': 'third floor no elev',
};

for (const [key, value] of Object.entries(remarks)) {
    GM_addStyle ( `
        [item-id="${key}"] .subtitle {
            visibility: hidden;
            position: relative;
        }
        [item-id="${key}"] .subtitle:after {
            visibility: visible;
            position: absolute;
            top: 0;
            left: 0;
            content: "${value}";
            text-decoration-line: underline;
            text-align: right;
        }
` );
}
