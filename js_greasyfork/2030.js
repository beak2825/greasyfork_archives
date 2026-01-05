// ==UserScript==
// @name           Direct ppomppu
// @namespace      https://greasyfork.org/users/2425
// @description    뽐뿌에서 외부링크를 클릭하면 경유주소로 연결돼 쇼핑몰 바로접속이 해제되는 문제가 있습니다. 이 스크립트는 링크를 항상 다이렉트로 연결해줍니다.
// @include        http://*.ppomppu.co.kr/*
// @include        http://ppomppu.co.kr/*
// @include        https://*.ppomppu.co.kr/*
// @include        https://ppomppu.co.kr/*
// @author         anonymous
// @version        1.5
// @grant          none
// @run-at         document-end
// @id             fix@ppomppu
// @license        public domain
// @downloadURL https://update.greasyfork.org/scripts/2030/Direct%20ppomppu.user.js
// @updateURL https://update.greasyfork.org/scripts/2030/Direct%20ppomppu.meta.js
// ==/UserScript==


/*
var anchors=[{href:'http://s.ppomppu.co.kr/?idno=etc_info_26868&target=aHR0cHM6Ly9hZGRvbnMubW96aWxsYS5vcmcva28vZmlyZWZveC9hZGRvbi9ncmVhc2Vtb25rZXk=&encode=on'},
             {href:'http://s.ppomppu.co.kr/?idno=etc_info_26868&encode=on&target=aHR0cHM6Ly9hZGRvbnMubW96aWxsYS5vcmcva28vZmlyZWZveC9hZGRvbi9ncmVhc2Vtb25rZXk='},
             {href:'http://s.ppomppu.co.kr/?idno=etc_info_26868&target=http://www.ppomppu.co.kr/zboard/view.php?id=etc_info&no=26868'}];
*/
var anchors = document.getElementsByTagName('a');


Array.from(anchors).forEach(el => {
    if(!el.href || !el.href.match(/https?:\/\/s.ppomppu.co.kr\S*target=/) )
        return;

    var regexp;
    if (el.href.match(/&encode=on/)) {
        regexp = /target=([^&#]*)/g;
        while (match=regexp.exec(el.href))
            target = match[1];

        var decoded = atob(decodeURIComponent(target.replace(/\\/g,'')));
        // use dummy textarea to decode HTML entities
        // http://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
        var dummyel = document.createElement('textarea');
        dummyel.innerHTML = decoded;
        el.href = dummyel.innerText;
    }
    else {
        regexp = /target=([^]*)/g;
        while (match=regexp.exec(el.href))
            target = match[1];
        el.href = target;
    }

});
