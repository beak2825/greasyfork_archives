// ==UserScript==
// @name         Hijack RARBG PopUps
// @icon	 https://www.rarbgproxy.to/favicon.ico
// @namespace    https://github.com/Hacksign/configs/blob/master/firefox/plugins/greasemonkey/rarbg.user.js
// @version      0.2
// @description  Prevent rarbg from popping up annoying ad pages
// @author       Hacksign
// @match        https://rarbg.to/*
// @include      https://www.rarbg.to/*
// @include      https://rarbgprx.org/*
// @include      https://www.rarbgprx.org/*
// @include      https://proxyrarbg.org/*
// @include      https://www.proxyrarbg.org/*
// @include      https://rarbgunblocked.org/*
// @include      https://www.rarbgunblocked.org/*
// @include      https://rarbgaccess.org/*
// @include      https://www.rarbgaccess.org/*
// @include      https://rarbgaccessed.org/*
// @include      https://www.rarbgaccessed.org/*
// @include      https://rarbgcore.org/*
// @include      https://www.rarbgcore.org/*
// @include      https://rarbgdata.org/*
// @include      https://www.rarbgdata.org/*
// @include      https://rarbgenter.org/*
// @include      https://www.rarbgenter.org/*
// @include      https://rarbgget.org/*
// @include      https://www.rarbgget.org/*
// @include      https://rarbggo.org/*
// @include      https://www.rarbggo.org/*
// @include      https://rarbgindex.org/*
// @include      https://www.rarbgindex.org/*
// @include      https://rarbgmirror.org/*
// @include      https://www.rarbgmirror.org/*
// @include      https://rarbgmirrored.org/*
// @include      https://www.rarbgmirrored.org/*
// @include      https://rarbgp2p.org/*
// @include      https://www.rarbgp2p.org/*
// @include      https://rarbgproxied.org/*
// @include      https://www.rarbgproxied.org/*
// @include      https://rarbgproxies.org/*
// @include      https://www.rarbgproxies.org/*
// @include      https://rarbgproxy.org/*
// @include      https://www.rarbgproxy.org/*
// @include      https://rarbgproxy.to/*
// @include      https://www.rarbgproxy.to/*
// @include      https://rarbgto.org/*
// @include      https://www.rarbgto.org/*
// @include      https://rarbgtor.org/*
// @include      https://www.rarbgtor.org/*
// @include      https://rarbgtorrents.org/*
// @include      https://www.rarbgtorrents.org/*
// @include      https://rarbgunblock.org/*
// @include      https://www.rarbgunblock.org/*
// @include      https://rarbgway.org/*
// @include      https://www.rarbgway.org/*
// @include      https://rarbgweb.org/*
// @include      https://www.rarbgweb.org/*
// @include      https://unblockedrarbg.org/*
// @include      https://www.unblockedrarbg.org/*
// @include      https://rarbg2018.org/*
// @include      https://www.rarbg2018.org/*
// @include      https://rarbg2019.org/*
// @include      https://www.rarbg2019.org/*
// @include      https://rarbg2020.org/*
// @include      https://www.rarbg2020.org/*
// @include      https://rarbg2021.org/*
// @include      https://www.rarbg2021.org/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/376565/Hijack%20RARBG%20PopUps.user.js
// @updateURL https://update.greasyfork.org/scripts/376565/Hijack%20RARBG%20PopUps.meta.js
// ==/UserScript==

(function() {
    window.addEventListener(
        'beforescriptexecute',
        function(e) {
            if(e.target.src.match(/[a-f0-9]{32}\.js$/)){
                e.preventDefault();
                e.stopPropagation();
                window.removeEventListener(e.type, arguments.callee, true);
            }
        },
        true
    );
})();
