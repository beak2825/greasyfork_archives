// ==UserScript==
// @name         Trading and Company Recruitment Script
// @namespace    http://eu.relentless.pw/SomewhereOverTheRainbow
// @version      0.4.4
// @description  Fill message date for new players!
// @author       You
// @include      *torn.com/messages.php*
// @include      *torn.com/laptop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27489/Trading%20and%20Company%20Recruitment%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/27489/Trading%20and%20Company%20Recruitment%20Script.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global
   GM_setValue, GM_getValue, $, jQuery, document, window, console, tinyMCE
 */
//this.$ = this.jQuery = jQuery.noConflict(true);
'use strict';

var yourUsername = "Hank";
var yourUserID = "1732212"; // Hank

setTimeout(function() {
    // console.log("Script loaded");
    // $(".content-title").css("color", "red");

    /* New */
    $('div#mailbox-main').after(
        "<div><button type=\"button\" id=\"noob\">New Player</button>" +
        "<button type=\"button\" id=\"recruitment\">R Recruitment</button>" +
        "<button type=\"button\" id=\"recruitment2\">R Recruit Factionless</button>" +
        "<button type=\"button\" id=\"URNoob\">UR Noob</button>" +
        "<button type=\"button\" id=\"CompanyRecruitment\">Company Recruitment</button>" +
                "<button type=\"button\" id=\"FreeRide\">FreeRide</button>"// +
    //    "<button type=\"button\" id=\"faction\">Faction</button>" +
    //    "<button type=\"button\" id=\"hof\">No HoF</button>"
    );

    var myUserLink = $('div.info-name > div.menu-info-row-value > a').attr('href');
    var linkRegex = /XID=(\d+)$/;
    var tempUserID = linkRegex.exec(myUserLink);
    console.log("myUserLink:", myUserLink);
    if (tempUserID !== undefined && tempUserID !== '') {
        yourUserID = tempUserID[1];
    }
    var myUserLinkName = $('div.info-name > div.menu-info-row-value > a').text();
    console.log("myUserLinkName:", myUserLinkName);
    if (myUserLinkName !== '') {
        yourUsername = myUserLinkName;
    }
    console.log("yourUserID:", yourUserID, "yourUsername:", yourUsername);
    var user = $('input#ac-search-1').val();
    console.log("user:", user);
    var regexID = /\[(\d+)\]$/;
    var userId = regexID.exec(user);
    var regexName = /^(.*) \[\d+\]$/;
    var theirName = regexName.exec(user);
    console.log("theirName:", theirName);
    var firstLine = '';
    if (theirName !== null) {
        firstLine = "<p><br />Hi " + theirName[1];
    }
    var yourImage = "<div style=\"text-align: center;\"><br /><a href=\"http://www.torn.com/" + yourUserID + "\"><img src=\"http://www.torn.com/sigs/6_" + yourUserID + ".png?v=1463490886869\" alt=\"\" /></a></div>";
    console.log("yourImage:", yourImage);
    $("i.info-icon,button#noob").click(function() {
        // console.log("Clicked");
        console.log("yourImage:", yourImage);
        $("input.subject").val("Welcome to Torn - we are here to help you!");
        noob += yourImage;
        tinyMCE.get('mailcompose').setContent(firstLine + noob);
        $('input.form-submit-send').click(function() {
            send_confirmation(userId);
        });
    });
    $("button#recruitment").click(function() {
        // console.log("Clicked");
        $("input.subject").val("We want you to join Relentless");
        tinyMCE.get('mailcompose').setContent(firstLine + rec);
        $('input.form-submit-send').click(function() {
            send_confirmation(userId);
        });
        });
    $("button#recruitment2").click(function() {
        // console.log("Clicked");
        $("input.subject").val("We want you to join Relentless");
        tinyMCE.get('mailcompose').setContent(firstLine + rec2);
        $('input.form-submit-send').click(function() {
            send_confirmation(userId);
        });
        });    
        $("button#FreeRide").click(function() {
        // console.log("Clicked");
        $("input.subject").val("Do you offer Free Rides?");
        tinyMCE.get('mailcompose').setContent(firstLine + FreeRide);
        $('input.form-submit-send').click(function() {
            send_confirmation(userId);
        });
        });
    $("button#CompanyRecruitment").click(function() {
        // console.log("Clicked");
        $("input.subject").val("Premium Option #4 recruiting Fitness Fanatics");
        tinyMCE.get('mailcompose').setContent(firstLine + comprec);
        $('input.form-submit-send').click(function() {
            send_confirmation(userId);
        });
    });
        $("button#URNoob").click(function() {
        // console.log("Clicked");
        $("input.subject").val("Unrelenting - Looking for new talent");
        tinyMCE.get('mailcompose').setContent(firstLine + URnoob);
        $('input.form-submit-send').click(function() {
            send_confirmation(userId);
        });
    });
}, 1000);

function send_confirmation(userId) {
    try {
        // console.log(response.datasets[i]);
        var message = [];
       console.log("userID:", userId);
       message.push(parseInt(userId[1]));
        var messageUrl = "http://eu.relentless.pw/messages.php";
        $.ajax({
           url: messageUrl,
           type: 'POST',
           data: JSON.stringify(message),
           crossDomain: true,
           success: function(data, textStatus, jqXHR) {
               console.log("textStatus: "  + textStatus);
           }
       }).done(function(response) {
           console.log("Done");
           console.log(response);
       }).fail(function(response) {
           console.log("Error");
            console.log(response);
        });
    } catch (error) {
        console.log(error);
    }
}

var noob = ",<br /><br />";
noob += "<p><span class=\"bold\">Keep reading. This guide will earn you $20,000,000 and 15 free donator days.</span></p>";
noob += "<p></p>";
noob = "<p>These <em><strong>quick steps</strong></em> are tailored for newly signed up players, ";
noob += "and is based on being lvl 1 at age 0 with 20 new player refills available. &nbsp;Whilst ";
noob += "this guide is proven, occasionally a player might overdose which will require them to start ";
noob += "the process again from the start.<br><br></p>";
noob += "<p>You should also use up your nerve regularly for advice on appropriate crimes refer to ";
noob += "<a href=\"http://www.torn.com/forums.php#/p=threads&amp;f=61&amp;t=15928248&amp;b=0&amp;a=0&amp;start=0\" ";
noob += "target=\"_blank\">Nash's Guide to Nerve Bar</a>. <br><br>By following these quick steps below my ";
noob += "calculations indicate you could have as much as 29,000 stats by end of Day 2, and Level 15 from ";
noob += "as soon as Day 3!&nbsp;<br><br><br></p>";

noob += "<h1>Part 1: Getting&nbsp;Ready to Train</h1>";
noob += "<p><br><strong>1.</strong>&nbsp;Obtain Donator Status, A Goodie Bag and the&nbsp;";
noob += "<a href=\"http://www.torn.com/userbar.php?string=The%20Socialist&amp;color=0&amp;bg=1&amp;footer=223\" ";
noob += "target=\"_blank\"><img src=\"http://www.torn.com/userbar.php?string=The%20Socialist&amp;color=0&amp;bg=1&amp;footer=223\" ";
noob += "alt=\"\"></a>&nbsp;honor by reaching level 5 in Torn Lite (";
noob += "<a href=\"https://apps.facebook.com/thetorncity\" target=\"_blank\">Facebook Torn</a>).&nbsp;";
noob += "Here is how you do it in 30 minutes!<br><strong><br></strong>First - Invite 100 friends ";
noob += "to play torn (sending invite is all that was needed)<br>";
noob += "<a href=\"https://i.gyazo.com/2ba42f7ee77c4ec7664aa9eea8d8d3c1.png\" target=\"_blank\">";
noob += "<img src=\"https://i.gyazo.com/2ba42f7ee77c4ec7664aa9eea8d8d3c1.png\" alt=\"\" width=\"600\">";
noob += "</a><br>Second - Increase nerve bar to 25<br>";
noob += "<a href=\"https://i.gyazo.com/7f33292cf67c01e7f0e36c3da6439337.png\" target=\"_blank\">";
noob += "<img src=\"https://i.gyazo.com/7f33292cf67c01e7f0e36c3da6439337.png\" alt=\"\" width=\"598\" height=\"794\"></a>";
noob += "<br>Third - Do first crime (Search the streets for cash) until level 3. Make sure you post ";
noob += "on your Facebook wall when prompted for more points. Make sure you use your points on ";
noob += "refills for nerve.<br><br>Fourth - &nbsp;From level 3 to 5 do the second crime (Sell copied DVD's), ";
noob += "again using points to refill nerve.&nbsp;<br><br>";

noob += "<a href=\"https://localtvwqad.files.wordpress.com/2015/04/stop-sign.jpg\" target=\"_blank\">";
noob += "<img style=\"display: block; margin-left: auto; margin-right: auto;\" ";
noob += "src=\"https://localtvwqad.files.wordpress.com/2015/04/stop-sign.jpg\" alt=\"\" width=\"280\" height=\"188\"></a>";
noob += "<br><br><h2>Don't have your new player refills?<br><br></h2>";
noob += "<p><strong>I would recommend restarting, the increased stat gains by using 20 noob refills ";
noob += "will increase training results by 400%. <br><br>If you&nbsp;use my &nbsp;referral code:&nbsp;";
noob += "<a href=\"http://www.torn.com/" + yourUserID + "\" target=\"_blank\">http://www.torn.com/" + yourUserID + "</a>";
noob += ",&nbsp;I will give you an additional $3,000,000 for your Goodie Bag. ";
noob += "<a href=\"http://www.torn.com/wiki/NewAccount\" target=\"_blank\">To restart view this</a>.<br>";
noob += "<br><br></strong>Fifth - When you reach level 5. Input your ";
noob += "torn ID you will be rewarded with 15 days of donator status on Torn.com, a Goodie Bag and&nbsp;";
noob += "<a href=\"http://www.torn.com/userbar.php?string=The%20Socialist&amp;color=0&amp;bg=1&amp;footer=223\" ";
noob += "target=\"_blank\"><img src=\"http://www.torn.com/userbar.php?string=The%20Socialist&amp;color=0&amp;bg=1&amp;footer=223\" ";
noob += "alt=\"\"></a>&nbsp;honor. <strong>You should only input your torn ID if you still have all your new player refills.<br></strong><br></p>";

noob += "Thanks to&nbsp;<a href=\"http://www.torn.com/profiles.php?XID=1925544\" ";
noob += "target=\"_blank\">TheTornographer</a> [1925544] for coming up with the original concept for step ";
noob += "1 above.<strong><br><br><a href=\"https://i.gyazo.com/fe6e6dad97afb0090a3cc06ace2ae4d6.png\" ";
noob += "target=\"_blank\"><img src=\"https://i.gyazo.com/fe6e6dad97afb0090a3cc06ace2ae4d6.png\" alt=\"\"></a>";
noob += "</strong><br><br><strong>2</strong>. Now that you have Donator status, your energy bar will ";
noob += "have a max at 150, and will regenerate 5 energy every 10 minutes. During this time whilst ";
noob += "the energy bar is regenerating you need to do the below:<br><br>First - Sell the Goodie Bag. ";
noob += "You can do this via trade chat my advice is to sell it for $18,000,000 for a quick sale, ";
noob += "or you can open a <a href=\"http://www.torn.com/trade.php#step=start&amp;userID=" + yourUserID + "\" ";
noob += "target=\"_blank\">trade with " + yourUsername + "</a>&nbsp;and I will give you the $20,000,000 ";
noob += "(Referrals of " + yourUsername + " get $23,000,000)!<br><br>Second - ";
noob += "<a href=\"http://www.torn.com/properties.php?step=rentalmarket#/property=12\" ";
noob += "target=\"_blank\">Rent a Castle (2650+ Happy)</a>&nbsp;for a maximum of 3&nbsp;days or you ";
noob += "can share one through marriage you can easily get a spouse by being&nbsp;Female ";
noob += "(you can change from <a href=\"http://www.torn.com/preferences.php\" target=\"_blank\">";
noob += "Male to Female</a>&nbsp;for $50,000) and either advertising on the ";
noob += "<a href=\"http://www.torn.com/forums.php#!p=threads&amp;f=22&amp;t=15909418&amp;b=0&amp;a=0&amp;start=580\" ";
noob += "target=\"_blank\">forums</a>&nbsp;or in the ";
noob += "<a href=\"http://www.torn.com/personals.php#!p=main\" target=\"_blank\">personals</a>. ";
noob += "If you rent a castle without a spouse the cost for 3 days will be around $500,000.<br>";
noob += "<a href=\"http://blog.novarad.net/wp-content/uploads/2013/07/helpful_tips-297x300.jpg\" ";
noob += "target=\"_blank\"><img src=\"https://ripcurlsurfsup.files.wordpress.com/2015/01/helpful-tips.jpg\" ";
noob += "alt=\"\" width=\"50\" height=\"49\"></a>If you want to accelerate your stat growth then you may ";
noob += "want to consider renting a 5025 Happy Private Island. To do this you will need to purchase a ";
noob += "<a href=\"https://www.torn.com/donator.php\" target=\"_blank\">donator pack</a>, you can ";
noob += "<a href=\"http://www.torn.com/trade.php#step=start&amp;userID=" + yourUserID + "\" target=\"_blank\">";
noob += "trade this to " + yourUsername + "</a>&nbsp;for $24,500,000.<br><br>Third - Purchase 3 Xanax, 1 Ecstasy, ";
noob += "100 boxes of tissues (also available for purchase from ";
noob += "<a href=\"http://www.torn.com/shops.php?step=bitsnbobs\" target=\"_blank\">Bits and Bobs</a>), ";
noob += "48 boxes of big boxes of chocolates and 5&nbsp;Erotic DVD's from the ";
noob += "<a href=\"http://www.torn.com/imarket.php#/p=market&amp;cat=melee-weapon\" target=\"_blank\">item market</a>";
noob += "&nbsp;and 25 points from the <a href=\"http://www.torn.com/pmarket.php\" target=\"_blank\">point market</a>. ";
noob += "This will cost around $17,500,000<br>";
noob += "<a href=\"http://blog.novarad.net/wp-content/uploads/2013/07/helpful_tips-297x300.jpg\" target=\"_blank\">";
noob += "<img src=\"https://ripcurlsurfsup.files.wordpress.com/2015/01/helpful-tips.jpg\" alt=\"\" width=\"50\" height=\"49\"></a>";
noob += "If you want to&nbsp;have the maximum amount of happy then and&nbsp;you can afford to ";
noob += "do so then purchase an additional Erotic DVD. This will boost your happy, increasing your gym gains. ";
noob += "You need to use ONE after using the tissues but before eating the chocolates.<br><br>Fourth - ";
noob += "<a href=\"http://www.torn.com/properties.php\" target=\"_blank\">Hire all staff possible</a>&nbsp;and ";
noob += "<a href=\"http://www.torn.com/item.php\" target=\"_blank\">use all the boxes of tissues</a>&nbsp;";
noob += "(this will regenerate your happy up to a maximum of 20%), then&nbsp;";
noob += "<a href=\"http://www.torn.com/item.php\" target=\"_blank\">eat all the&nbsp;big boxes of ";
noob += "chocolates</a>&nbsp;to raise your happy by a further 1680.<br><br>";
noob += "<a href=\"http://blog.novarad.net/wp-content/uploads/2013/07/helpful_tips-297x300.jpg\" ";
noob += "target=\"_blank\"><img src=\"https://ripcurlsurfsup.files.wordpress.com/2015/01/helpful-tips.jpg\" ";
noob += "alt=\"\" width=\"50\" height=\"49\"></a>There is no need to pay property upkeep yet. You have ";
noob += "30 days to pay the property upkeep before your maximum happiness begins to reduce.<br><br></p>";
noob += "<p><strong>3.</strong>&nbsp;The next step involves resending the last seasonal newsletter, ";
noob += "you do this by accessing your <a href=\"http://www.torn.com/preferences.php\" target=\"_blank\">";
noob += "player preferences</a>. Click email subscriptions and then click \"Resend Seasonal Newsletter\". ";
noob += "This will send you the last seasonal newsletter even if it was issued 3 months before you registered. ";
noob += "Newsletters contain an energy boost, normally around 250 Energy. Once you have received the newsletter ";
noob += "(can take up to 24 hours) you have completed this step. DO NOT USE THE LINK IN THE NEWSLETTER YET. ";
noob += "<br><br>Thanks to <a href=\"http://www.torn.com/profiles.php?XID=864688\" target=\"_blank\">";
noob += "McNeo [864688]</a>&nbsp;for coming up with Step 3 &amp; 15.</p><p><strong>4.</strong>&nbsp;";
noob += "Allow your energy to regenerate to 150.<br><br>&nbsp;";
noob += "<a href=\"https://i.gyazo.com/79e60bad827ed0bca1b31c790a18c4bc.png\" target=\"_blank\">";
noob += "<img src=\"https://i.gyazo.com/79e60bad827ed0bca1b31c790a18c4bc.png\" alt=\"\"></a>";
noob += "<br><br><strong>5.</strong>&nbsp;Once your energy is at 150 begin Stacking, refer to&nbsp;";
noob += "<a href=\"http://www.torn.com/forums.php#!p=threads&amp;f=61&amp;t=15927204&amp;b=0&amp;a=0&amp;start=2\" ";
noob += "target=\"_blank\">Premium Option 1 Training&nbsp;Method</a>, you will not lose your energy even if ";
noob += "you go over the maximum of 150. Stacking is the term used for raising your energy above 150, ";
noob += "you do this by taking drugs or boosters. In this case I suggest you stack to 900 by ";
noob += "using Xanax, this will take 24 hours to achieve, as you cannot take your next Xanax until ";
noob += "the drug cooldown has ended from the previous one. Each Xanax will give you 250 Energy.";

noob += "<br><br><br></p><h1>Part 2: Training<br><br></h1><p><strong>6.</strong>&nbsp;Once you have ";
noob += "the 900 Energy and you DO NOT have a Drug or Booster cool down. Please ensure the server ";
noob += "time is :01, :16, :31, :46 before beginning your train. To start use the 5&nbsp;Erotic ";
noob += "DVD\'s followed by an ecstasy. Assuming you don\'t overdose on the ecstasy you will have ";
noob += "approximately 30,000&nbsp;happy available. You will have until :15, :30, :45 or :00 server ";
noob += "time before your happy returns to the maximum. This gives us a maximum of 14 minutes ";
noob += "to do a heap of clicking!<br><br></p><p><strong>7.</strong>&nbsp;Join ";
noob += "<strong>Premier Fitness</strong> ($10) and train 60 times (300&nbsp;Energy) ";
noob += "on Strength.<br><br><a href=\"http://www.torn.com/images/v2/gym/gym_logos/_1.png\" ";
noob += "target=\"_blank\"><img src=\"http://www.torn.com/images/v2/gym/gym_logos/_1.png\" ";
noob += "alt=\"\"></a><br><strong><br>8.</strong> <strong>Average Joes Gym</strong> should ";
noob += "now be unlocked, you should now join ($100) and activate it. Train 100 times ";
noob += "(500E)&nbsp;on defense.<br>";
noob += "<a href=\"https://i.gyazo.com/c42003524cf8cc7da59bc2d3f22ceaff.png\" target=\"_blank\">";
noob += "<img src=\"http://www.torn.com/images/v2/gym/gym_logos/_2.png\" alt=\"\" width=\"167\" ";
noob += "height=\"113\"></a><br><strong><br>9.</strong> <strong>Woody\'s Workout Gym</strong> ";
noob += "should now be unlocked, you should now join ($250) and activate it. Train the remaining ";
noob += "energy (350 including your <a href=\"http://www.torn.com/points.php\" target=\"_blank\">";
noob += "energy refill you get for exchanging 25 points</a>) on Dexterity.&nbsp;<br>";
noob += "<a href=\"https://i.gyazo.com/0459fe990ede0fe9df86c101ea7a51b8.png\" target=\"_blank\">";
noob += "<img src=\"http://www.torn.com/images/v2/gym/gym_logos/_3.png\" alt=\"\" width=\"167\" ";
noob += "height=\"113\"></a></p><p><strong>10.</strong>&nbsp;Using your new player refills one at ";
noob += "a time <strong>on energy</strong> we need to use a further 650E on Dexterity.&nbsp;</p>";
noob += "<p><strong>11.</strong>&nbsp;<strong>Beach Bod\'s Gym</strong> should now be unlocked, ";
noob += "you should now join ($500) and activate it. Use&nbsp;a further 750E from your new player ";
noob += "refills on Strength.<br><a href=\"https://i.gyazo.com/16265998223a6a7cff890385a543bc91.png\" ";
noob += "target=\"_blank\"><img src=\"http://www.torn.com/images/v2/gym/gym_logos/_4.png\" alt=\"\" ";
noob += "width=\"167\" height=\"113\"></a></p><p><strong>12.</strong>&nbsp;Use a further 500E on ";
noob += "defense from your new player refills.&nbsp;</p><p><strong>13.</strong>&nbsp;Use a further ";
noob += "700E on speed&nbsp;from your new player refills.</p><p><strong>14</strong>.";
noob += "<strong>Silver&nbsp;Gym</strong> should now be unlocked, you should now join ($1000) and ";
noob += "activate it. Train 60 times (300E)&nbsp;on speed.&nbsp;<br>";
noob += "<a href=\"https://i.gyazo.com/905b44f6f8467376122bd9565206c00f.png\" target=\"_blank\">";
noob += "<img src=\"http://www.torn.com/images/v2/gym/gym_logos/_5.png\" alt=\"\" width=\"167\" ";
noob += "height=\"113\"><br><br></a><strong>15. </strong><a href=\"http://www.torn.com/logout.php?rfc=959\" ";
noob += "target=\"_blank\">Log out from Torn</a>. Access your email and view the seasonal newsletter. ";
noob += "Use the link provided to login back to Torn this will give you around 250 Energy ";
noob += "(depending on the newsletter). Train this on Speed. At this point your training ";
noob += "is complete.<br><a href=\"http://www.torn.com/logout.php?rfc=959\" target=\"_blank\">";

noob += "<br><br><br></a></p><h1>Part 3: Power&nbsp;Leveling&nbsp;to 15</h1><p><br><br>";
noob += "<strong>16.</strong>&nbsp;If you don\'t already have a weapon and some Armour, ";
noob += "you should obtain some. Refer to my ";
noob += "<a href=\"http://www.torn.com/forums.php#!p=threads&amp;f=61&amp;t=15962475&amp;b=0&amp;a=0\" ";
noob += "target=\"_blank\">Hank\'s Guide to Armour and Weapons</a>&nbsp;for detailed information. ";
noob += "If you are limited in budget buy a Macana and a full set of leather armour.<br><br></p>";
noob += "<p><strong>17.</strong> With a good start on your stats and equipped with some Armour and ";
noob += "a weapon you can now begin&nbsp;power leveling targets until you reach level 15.&nbsp;</p>";
noob += "<p><strong><em>REMEMBER</em> for maximum experience gain always leave them after you land ";
noob += "the finishing blow!&nbsp;<br><br></strong></p><table><tbody><tr><td>Finishing Method</td>";
noob += "<td>Experience Gain</td><td>Target Hospital Time</td><td>Other Benefits</td></tr><tr>";
noob += "<td>Leave</td><td>100%</td><td>20-40 minutes</td><td>None</td></tr><tr><td>Mug</td>";
noob += "<td>55-60%</td><td>10-25 minutes</td><td>Stealing Cash from Target</td></tr><tr>";
noob += "<td>Hospitalize</td><td>40%</td><td>150-300 minutes</td><td>Respect Gain if your faction ";
noob += "is at war with the faction of the target</td></tr></tbody></table><p><strong>";
noob += "<iframe ";
noob += "src=\"https://docs.google.com/spreadsheets/d/19CtPZr1UJTF8L-daj6twK75II8vwaquaAirXB83Its8/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false\"";
noob += "style=\"width: 700px; height: 800px;\"></iframe><br><br>A few helpful hints<br><br></strong>First: ";
noob += "Using a Xanax will give you 10 additional attacks, but it will reduce your battle stats ";
noob += "by 35% for the duration of the drug cool down.<br><br>Second: Once you are close to ";
noob += "level 15 you should rent a private island with an airstrip. At this point, if you ";
noob += "work hard you should be able to sustain the costs of above average training. ";
noob += "Refer to ";
noob += "<a href=\"http://www.torn.com/forums.php#/p=threads&amp;f=61&amp;t=15927204&amp;b=0&amp;a=0&amp;start=0\" ";
noob += "target=\"_blank\">Hank\'s Training Guide</a>&nbsp;for all the available options.<br><br>Third: ";
noob += "Once your level 5 you should access to the Duke Mission \"<strong>New Kid on the ";
noob += "Block&nbsp;Easy</strong>\". This mission requires you to defeat any five players. ";
noob += "Incorporating this into your power leveling can as they say kill two birds with ";
noob += "one stone.</p><div align=\"center\"><br><strong>I\'m always looking for feedback ";
noob += "on this guide, please help me improve it by offering constructive feedback.&nbsp;</strong></div>";



var rec = ",<br /><br /></p><p>Chedburn recently released the new faction upgrade trees which heavily favours larger factions and those who were heavily upgraded prior to the update, to fully upgrade 6 specialist branches its anticipated a faction will require 40,000,000 respect. We are the faction in Torn with the most respect, and we feel we are the best placed to lead the pack for a long period of time as far as specials are concerned. </p>";

rec += "<br /></p><p>I noticed you are in a faction with less respect, and I’m sure you have ties to it. However If you are interested in having access to the best specials in Torn you really should consider applying to Relentless These are just some of the things you can expect: </p>";
rec += "<ul><li>the best specials in Torn;</li>";
rec += "<li>a faction that enjoys a good war;</li>";
rec += "<li>knowledgeable, team minded players;</li>";
rec += "<li>a faction that is part of the Subversive Alliance and Forged Through War alliance;</li>";
rec += "<li>a range of private API legal scripts to improve your game play;</li>";
rec += "<li>an organized leadership engaged with its membership;</li>";
rec += "<li>a proud faction who likes to laugh and share game knowledge so everyone succeeds &amp; has fun.</li>";
rec += "</ul><br />";

rec += "<p>I did not seek you out randomly: were selective in our recruitment. Always looking for players whose statistics show a dedication to their accounts growth, while also being a team player. If you make the leap, I believe you will find yourself a valued member in a dynamic team of like-minded players.</p>";


rec += "<br /><p>So are you up for a fun challenge, and want to be part of a faction on the rise with a leadership group actively willing to embrace change? Then look no further, mail me with any questions you might have or send an <a href=\"https://testmoz.com/656684\">application</a>&nbsp;to our faction.</p>";

var rec2 = ",<br /></p><p>I came across your profile and noticed you were factionless. I am looking to recruit active and Xanax using players with a minimum of 1,000,000,000 total battle stats to join our team.</p>";

rec2 += "<br /></p><p>If you are interested, please reply so we can discuss further.</p>";





    var comprec = ",<br /></p><p><br>My name is Hank and I have a <u>10 star</u> Fitness Center called Premium Option Number 4. I seeked you out because you have a reputation around these corners for being a bit of a bruiser. You know one of those thugs with the bicceps the size of tree trunks who likes to pick up men.. and throw them around a bit...</p>";
comprec += "<br><img src=\"https://i.gyazo.com/af5fb7dd20babff14ce91598b11e91e0.jpg\" alt=\"\"><br>";
comprec += "<br>Did you know once you achieve the passive perks in Education, Law or Medical you keep those perks whether or not you work in those starter jobs?  You should definitely consider joining Premium Option #4, we could do with someone of your ilk who knows how to pull hard.. you know on the rowing machine? Anyway people might learn a thing or two from you on pulling and picking up heavy things.<br>";
comprec += "<br>I offer a small token wage and access to a range of great specials plus 10 job points daily. I'm sure thats more than attractive already, but i can also offer free waxing and tanning services from our centre manager.<br><br>";
comprec += "Fitness Center Specials";
comprec += "<ul><li>Healthy Mind - 30 minute education time reduction (1 jp)</li>";
comprec += "<li>Goal Oriented - 50% reduction of happiness loss in gym</li>";
comprec += "<li>Roid Rage - Strength (1 jp)</li>";
comprec += "<li>Athlete - +3% life regeneration per tick</li>";
comprec += "<li>Training Regime - +3% gym gains</li>";
comprec += "</ul>";

comprec += "<p><br>By now i'm sure you are trying to find me and maybe try and bruise me up a bit. <strong>But if you really want to join then you should apply by clicking this <a href=\"http://www.torn.com/joblist.php#!p=corpinfo&ID=24397\">link</a>.</strong></p><br>";

comprec += "Hank<br>";
comprec += "Premium Option #4";

    var FreeRide = ",<br /></p><p><br>Sitting in your carnie trailer smoking a toke, you hear a knock on the aluminium door.</p>";
FreeRide += "You open the door, and see a guy standing there in nothing more than a cropped hawain shirt and dirty underpants.";
FreeRide += "he says 'I hear you offer Free Rides?'";
FreeRide += "<br><img src=\"http://www.mansanity.com/wordpress//home/content/m/a/n/mansanity/html/wordpress/wp-content/uploads/HLIC/06d7c3181b561ec368002c2c56716614.jpg\" alt=\"\"><br>";
FreeRide += "<br>you reply 'My doctor says I cant be giving away rides for free anymore, something to do with diabetes'.<br>";
FreeRide += "<br>he replies 'My name is Hank, and I can pay you $100,000 per free ride. If this is of interested please put on your saddle and lets rides. I currently need around 45 more free rides, but please check before doing anymore than 10'.<br><br>";

FreeRide += "Hank<br>";
FreeRide += "Premium Option #4";

var URnoob = ",<br /></p><p>I came across your profile because your player statistics matched the key indicators I look for in new players. We strongly believe in developing new players we have created new player specific training and leveling guides which will get you climbing the ranks of torn so much quicker.</p>";

URnoob += "<br>Maybe you have heard of <a href=\"http://www.torn.com/forums.php#!p=threads&f=61&t=15927204&b=0&a=0&start=0\"><strong>Hanks Training Guide for Druggies<strong></a> or <a href=\"http://www.torn.com/forums.php#!p=threads&f=61&t=15927057&b=0&a=0&start=0\"><strong>Hanks Power Levelling Guide to 15<strong></a>? Well Hank created them especially for Relentless and Unrelenting members to use. Our mentors are fully versed in these guides and will assist you in your journey to becoming a top torn criminal.";

URnoob += "<br><img src=\"http://i29.tinypic.com/rhtppu.jpg\" alt=\"\"><br>";
URnoob += "Why else should you consider us? ";
URnoob += "<ul>";
URnoob += "<li>We are a established faction with great specials such as +10% Gym Gains, -50% Drug Addiction, -10% Education Length, +7 Travel items and more.;</li>";
URnoob += "<li>As we are a top warring faction very few factions will attack us, we have made a reputation for ourselves by fighting out of our league. Don't think by joining Unrelenting this soon into your Torn journey that you will spend the entire time in hospital because you wont.;</li>";
URnoob += "<li>We have a lively chat, we are a social faction.</li>";
URnoob += "<li>All members are exempt from war participation until they hit level 15 and have 100,000 total battle stats. We have an awesome peer to peer mentor program that will get you developing your stats, income and status in torn so much quicker than usual. Once you have completed the mentor program you will be allowed to participate in our war periods, earning respect not only for the faction but gaining many related medals and awards in the process.</li>";
URnoob += "</ul><br>";

URnoob += "<p><strong>If this sounds of interest please reply so I can ask you a few questions to see whether you're the right fit for us.</strong></p>";