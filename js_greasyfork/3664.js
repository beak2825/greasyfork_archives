// ==UserScript==
// @name Erepublik Messages Blocker
// @namespace Mike Ontry
// @description Hide unwanted messages from Erepublik citizens
// @version 1.3
// @include http://www.erepublik.com/en/main/messages-inbox
// @include http://www.erepublik.com/en/main/messages-paginated/*
// @namespace https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/3664/Erepublik%20Messages%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/3664/Erepublik%20Messages%20Blocker.meta.js
// ==/UserScript==
var block = new Array("6162038"); //Insert new IDs to block here. (var block = new Array("6162038", "12341234", "12341234", "123412341234");)
var lis;
var tdata;
var link;
var messnum;
var html;

function blockCit(){
lis = document.getElementsByTagName('tr');
for(var l = 0; l < lis.length; l++)
{
for(var t = 0; t < block.length; t++)
{
tdata = lis[l].getElementsByTagName('td');
html = lis[l].innerHTML;
if(html.search(block[t]) != -1)
{
link = tdata[1].getElementsByTagName('a');
messnum = (link[0].href).split("messages-read/");
lis[l].style.color = "white"; //Change text color here
lis[l].style.background = "#8C1B1B"; //Change background color here
tdata[0].innerHTML = '<a class="fluid_blue_light_medium" target="reportpopup" onclick="windowOpener(450, 520, this.target, this.href); return false;" href="http://www.erepublik.com/en/tickets/report/' + messnum[1] + '/private_message_abuse"><span>Report</span></a>';
tdata[1].innerHTML = 'THIS MESSAGE IS FROM A BLOCKED CITIZEN!';
}
}
}
}

blockCit();

window.setInterval(function(){
blockCit();
}, 1);
