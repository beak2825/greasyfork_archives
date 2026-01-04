// ==UserScript==
// @name         Bouncer Destination Expiry Times
// @version      1.5
// @description  Shows expiry times of all munzees in a treehouse or skyland. Powered by CuppaZee
// @author       sohcah
// @match        https://www.munzee.com/m/*/*
// @match        https://www.munzee.com/m/*/*/
// @grant        none
// @namespace https://greasyfork.org/users/398283
// @downloadURL https://update.greasyfork.org/scripts/393905/Bouncer%20Destination%20Expiry%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/393905/Bouncer%20Destination%20Expiry%20Times.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($('.pin')[0].src.includes('treehouse')||$('.pin')[0].src.includes('skyland')) {
        var x = location.pathname.split('/');
        $.get(`https://server.cuppazee.app/munzee/bouncers?munzee=${x[3]}&username=${x[2]}&from=destination_expiry_1.5`,function(data){
            let i = 0;
            for(var unicorn of Array.from($('.unicorn'))) {
                let bouncer = data.data[i]
                unicorn.innerHTML = `${i==0?`<a href="https://cuppazee.app/munzee/${x[2]}/${x[3]}"><img src="https://server.cuppazee.app/logo.png" style="height:48px;"/></a><br><br>`:''}<img style="height: 32px;" src="${bouncer.munzee_logo}">Hosting <a href="${bouncer.unicorn_munzee.code}">${bouncer.unicorn_munzee.friendly_name}</a> by <a href="/m/${bouncer.unicorn_munzee.creator_username}">${bouncer.unicorn_munzee.creator_username}</a>! <span title="${moment(bouncer.good_until*1000).format()}">Expires in ${moment.duration(bouncer.good_until*1000-Date.now()).humanize()} (${moment(bouncer.good_until*1000).format('LTS')})</span>`
                i++
            }
        })
    }
})();