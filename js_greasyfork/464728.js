// ==UserScript==
// @name         THE_ZOO
// @namespace    zero.paddington.torn
// @version      0.1
// @description  pastes html message
// @author       -zero [2669774]
// @match        https://www.torn.com/messages.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464728/THE_ZOO.user.js
// @updateURL https://update.greasyfork.org/scripts/464728/THE_ZOO.meta.js
// ==/UserScript==

// Change the message below with your message
// Kepp the message inside ``

var message = `<div style="background-color: #041a41; color: white; padding-top: 20px;"><a href="https://www.torn.com/factions.php?step=profile&amp;ID=15151#/" target="_blank"><img src="https://i.imgur.com/iE8Wr1m.png" style="display: block; margin-left: auto; margin-right: auto; margin-bottom: 20px;" /></a>
<div style="padding: 0px 20px 20px 20px;">
<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 18px;">Looking to settle down in a fun place?</span><br /> <span style="font-size: 22px; font-weight: bold;">The ZOO is the faction for you! </span></div>
<p style="font-size: 18px;">We have <span style="font-weight: bold; color: #e8bf6b;">big goals</span> and the <span style="font-weight: bold; color: #e8bf6b;">ambition</span> to achieve them, let us teach you Torn while you help us reach our goals!</p>
<p>Our fluffy yet sometimes vicious resident animals want new players to come visit The ZOO and share a giggle or two in our faction chat. We have a fast paced schedule with lots of wars and chains in which everyone gets to participate (regardless of your stats or age, there's always something you can help with), however we do take reasonable breaks for training purposes as well.</p>
<p>Welcoming all active players to pay us a visit, we're happy to provide coaching to those who need it. We have a well-stocked armory full of weapons, armor, beer, candy, medical items, and drugs free for our members to use.</p>
<div style="margin-left: 10px; margin-top: 20px; margin-bottom: 20px;">
<p style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #e8bf6b;">Main requirements</p>
<br />
<ul>
<li>Active daily</li>
<li>Sign up on our faction torn stats</li>
<li>Participate in faction wars and chains</li>
<li>Train hard with 2 xan a day</li>
</ul>
<br />
<p style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #e8bf6b;">Perks you get for joining us</p>
<br />
<ul>
<li style="list-style-color: green;">Steadfast 11% (on monthly rotation str+dex or def+spd)</li>
<li>Nerve +25</li>
<li>Crime exp +18%</li>
<li>Reduce drug side effects 30%</li>
<li>Drug addiction -50%</li>
<li>OD chance -30%</li>
<li>+10 travel items</li>
<li>... and more!</li>
</ul>
</div>
<p>Happy to answer any questions you might have if you want to come visit us. <b>Tho be warned:</b> once you get to meet us, you might not want to leave o.o</p>
<p><strong><span style="color: #e8bf6b;">Apply&nbsp;<a href="https://www.torn.com/factions.php?step=profile&amp;ID=15151#/" target="_blank" style="color: #e8bf6b; text-decoration: underline;">here</a>!</span></strong></p>
</div>
</div>`;




// DO NOT CHANGE ANYTHING BELOW THIS
var url = window.location.href;

const button = `<button id = 'zero-paste'>PASTE</button>`;

function insert(){
    console.log('checking');
    if ($('.mailbox-container').length > 0){
        $('.content-title').append(button);
        $('#zero-paste').on('click', paste);
        console.log('inserted');

    }
    else{
        setTimeout(insert,500);
    }
}

function paste(){
    var iframe = document.getElementById('mailcompose_ifr');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    innerDoc.querySelector("#tinymce").innerHTML = message;
}

$(window).on('hashchange', function(e){
    url = window.location.href;
    if (url.includes('p=compose')){
        setTimeout(insert,500);
    }
});



if (url.includes('p=compose')){
    insert();
}