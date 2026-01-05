// ==UserScript==
// @name        Gaia - Guild Member Donations
// @namespace   gaiautils
// @author       Knight Yoshi (http://www.gaiaonline.com/p/7944809)
// @description  Iterate the guild member pages and collect their donations, display the donations at the end  
// @match        http://*.gaiaonline.com/guilds/memberlist/1/leveldesc/id.*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/2300/Gaia%20-%20Guild%20Member%20Donations.user.js
// @updateURL https://update.greasyfork.org/scripts/2300/Gaia%20-%20Guild%20Member%20Donations.meta.js
// ==/UserScript==
function goldDonations() {
    return new goldDonations.extend.init();
}

goldDonations.extend = goldDonations.prototype;

goldDonations.total = goldDonations.extend.total = 0;
goldDonations.next = goldDonations.extend.next = document.querySelector('ul.pagination').children[4].children[0];

goldDonations.iterate = goldDonations.extend.iterate = function() {
    var user = document.querySelectorAll('.guild_username');
    $.each(user, function(idx, username) {
        var donation = username.nextElementSibling.nextElementSibling;
        if(!donation.classList.contains('guild_donate')) {
            goldDonations.total = goldDonations.total + Number(donation.innerHTML.replace(/,/g, ''));
        }
        if(idx === (user.length - 1)) {
            goldDonations.loadnext();
        }
    });
}

goldDonations.loadnext = goldDonations.extend.loadnext = function() {
    if(!goldDonations.next.classList.contains('inactive')) {
        $.ajax({
            type: 'GET',
            url: goldDonations.next.href,
            cache: false, 
            success: function(data) {
                var html = $.parseHTML(data);
                $.each(html, function(idx, node) {
                    if(node.id === 'content') {
                        document.querySelector('#content').innerHTML = node.innerHTML;
                        goldDonations.iterate();
                        goldDonations.next = document.querySelector('ul.pagination').children[4].children[0];
                    }
                });
            }
        });
    } else {
        alert(goldDonations.total);
    }
}

goldDonations.init = goldDonations.extend.init = function() {
    goldDonations.iterate();
}

var confirmed = confirm('Get Member Donations?');
if(confirmed) {
    goldDonations();
}
