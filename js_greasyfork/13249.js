// ==UserScript==
// @name        PM Reminder Pt.1
// @namespace   PXgamer
// @description Remind yourself you forgetful piece of shit
// @include     *kat.cr/user/*/moderation/*
// @include     *kickass.to/user/*/moderation/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13249/PM%20Reminder%20Pt1.user.js
// @updateURL https://update.greasyfork.org/scripts/13249/PM%20Reminder%20Pt1.meta.js
// ==/UserScript==

var t = $('h1.nickname').html();
t = t.split('<span')[0];
t = t.trim();
$('div.buttonsline:nth-child(1)').append('<a href="https://kat.cr/messenger/dialog/' + t + '"><button id="sendPM" style="display:inline;" class="siteButton bigButton"><span>SEND PM</span></button></a> ');

$('#sendPM').parent().after(`
<select name="fakerType" class="mtSel" id="fakerType" style="width:130px;">
   <option value="Fakers">Fakers</option>
   <option value="0">5.79</option>
   <option value="1">Photo Faker</option>
   <option value="2">DJ Faker</option>
</select>
<select name="actionType" class="mtSel" id="actionType" style="width:170px;">
  <option value="Actions">Actions</option>
  <option value="0">Removed comment(s)</option>
  <option value="1">Removed torrent(s)</option>
  <option value="2">Removed UL status</option>
</select>
<select name="userIssueType" class="mtSel" id="userIssueType" style="width:125px;">
  <option value="Issue Type">Issue Type</option>
  <option value="0">Rep abuser</option>
  <option value="1">Cheevo abuser</option>
  <option value="2">Spammer</option>
  <option value="3">GPlus</option>
</select>
`);

$('.mtSel').one('click', function openMT() {
  $('#main').show();
}
)

var template_faker = [
  `5.79 faker
Proof: `,
  `UL Request:
[quote]Hi kat Admins . grin It's my pleasure to be in this site . My name is condora I'm 26 years old . I'm a photographer . I have alot of pictures With heigh quality . I also have alot of hd films . I Want to be a uploader . My films are : terminator[/quote]

And another...
Dupe accounts:
https://kat.cr/user/TeamOMD/
https://kat.cr/user/KiiMou1/
https://kat.cr/user/tolosaboula/
https://kat.cr/user/toriso/
https://kat.cr/user/condor23/

Same UL request, same IP.`,
  `UL Request:
[quote]hey, i am ** , resident of **Club in Berlin and i would like to upload some of my best house and underground music for all the fans![/quote]

And another...
Dupe accounts:
https://kat.cr/user/djKkammy/
https://kat.cr/user/djSc00tt/
https://kat.cr/user/M00nDj/
https://kat.cr/user/V00d0Dj/
https://kat.cr/user/DjDaark/
https://kat.cr/user/BlackhatDjs/
https://kat.cr/user/CrazyDjSolo/

Same UL request, same IP.`
];

var template_action = [
  `Removed comments on undownloaded torrents.`,
  `Removed torrent(s):

Reason: `,
  `Removed uploader status due to: `
]

var template_userIssueType = [
  `Rep abuser.
Proof: `,
  `Achievement abuser.
Proof: `,
  `Spammer.
Proof: `,
  `Posting malicious GPlus links:

[quote]Working Activator here - https://plus.google.com/103623234181507656191/posts/cqnfX6Xr79i[/quote]
https://www.virustotal.com/en/file/9eab07677f29549c9803ad9f0ad4caf65b4a2837cef7b1a1c5e639dc56331e69/analysis/1445710504/`
]

$(document).delegate('#fakerType', 'change', function faker() {
  type = $("select[id='fakerType'] option:selected").val();
  if (type !== 'Fakers') {
    type = template_faker[type];
    $('textarea.comareajs:nth-child(4)').val(type);
  }
})

$(document).delegate('#actionType', 'change', function action() {
  type = $("select[id='actionType'] option:selected").val();
  if (type !== 'Actions') {
    type = template_action[type];
    $('textarea.comareajs:nth-child(4)').val(type);
  }
})

$(document).delegate('#userIssueType', 'change', function issue() {
  type = $("select[id='userIssueType'] option:selected").val();
  if (type !== 'Issue Type') {
    type = template_userIssueType[type];
    $('textarea.comareajs:nth-child(4)').val(type);
  }
})
