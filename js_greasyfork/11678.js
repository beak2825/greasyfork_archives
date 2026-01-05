// ==UserScript==
// @name        Hack Forums - Unclutter
// @namespace   Doctor Blue
// @description Removes statistics nobody gives a fuck about to make the postbit slimmer
// @include     *hackforums.net*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11678/Hack%20Forums%20-%20Unclutter.user.js
// @updateURL https://update.greasyfork.org/scripts/11678/Hack%20Forums%20-%20Unclutter.meta.js
// ==/UserScript==

// Prevent conflicts with other userscripts
$j = $.noConflict(true)

function forumdisplay() {
  // Compile regular expressions


  // Get all the thread rows
  var $threads = $j('tr:has(.forumdisplay_sticky), tr:has(.forumdisplay_regular)')
  console.log($threads.length)

  // Adjust row height
  $threads.css('height', '33px')
  $j('.quick_jump')
    .css('position', 'relative')
    .css('bottom', '2px')
  
  // Remove page list
  $threads.find('div > span > .smalltext').remove()
  
  // Put author to the right of title instead of under
  $threads.find('.author')
    .removeClass('smalltext')
    .css('display', 'inline-block')
    .before(' - ')
  
  // Remove line break from last post column
  $threads.find('.lastpost').each(function() {
    var split = $j(this).html().split("<br>")
    console.log(split[1] + " - " + split[0])
    $j(this).html(split[1] + " - " + split[0])
  })
}
function showthread() {
  // Compile regular expressions
  var rxReputation = new RegExp("(Reputation: .*?</a>)")
  var rxPrestige = new RegExp("(Prestige: [0-9]+?)")
  var rxWarning = new RegExp("(Warning Level: .*?</a>)")

  // Resize avatar to a maximum of 50x50 pixels
  $j('.post_avatar  img')
    .css('max-height', '50px')
    .css('max-width', '50px')
    .removeAttr('height')
    .removeAttr('width')

  // Remove userstars
  $j('.userstars').remove()

  // Put userbar's alt text before usertitle
  $j('.post_author').each(function() {
    var $userbar = $j(this).find('img[src*="groupimages"]')
    var usergroup = $j($userbar).attr('alt')

    // Replace some group names
    switch(usergroup) {
      case undefined: usergroup = "Regular"; break;
      case "HF l33t": usergroup = "L33T"; break;
      case "HF Ub3r": usergroup = "UB3R"; break;
      case "HF 3p1c": usergroup = "3P1C"; break;
      case "HF Writers": usergroup = "Writer"; break;
      case "Mentors": usergroup = "Mentor"; break;
      case "Administrators": usergroup = "Administrator"; break;
    }
    if(usergroup == undefined) usergroup = "Regular" 
    $j($userbar).remove()
    $j(this).find('span.smalltext').prepend(usergroup + " - ")
  })

  // Remove all stats except reputation and warning level
  $j('.post_author_info').each(function() {
    // Extract interesting statistics
    var reputation = $j(this).html().match(rxReputation)
    if(reputation === null) reputation = $j(this).html().match(rxPrestige) // Get prestige if staff/admin
    reputation = reputation[1]
    var warning = $j(this).html().match(rxWarning)[1]

    // Combine and insert
    $j(this).html(reputation + "<br />\n" + warning)
  })

  // Replace online/offline/away icons
  $j('img[src*="buddy_online"]').attr('src', 'https://shellsec.pw/images/modern_blue/buddy_online.png')
  $j('img[src*="buddy_offline"]').attr('src', 'https://shellsec.pw/images/modern_blue/buddy_offline.png')
  $j('img[src*="buddy_away"]').attr('src', 'https://shellsec.pw/images/modern_blue/buddy_offline.png')
  $j('img[src*="buddy"]')
    .css('position', 'relative')
    .css('bottom', '7px')
}

if(window.location.href.indexOf("forumdisplay.php") != -1) forumdisplay() // comment out to not change forumdisplay
if(window.location.href.indexOf("showthread.php") != -1) showthread()