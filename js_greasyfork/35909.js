// ==UserScript==
// @name         Guild member list
// @namespace    guildmemberlist
// @version      0.1
// @description  title
// @match        http://www.neopets.com/guilds/guild_members.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35909/Guild%20member%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/35909/Guild%20member%20list.meta.js
// ==/UserScript==

var guildID = -1;
var pages = -1;
var currentPage = 1;
var pagesLoaded = 0;
var allNames = [];

$('document').ready(function(){
  //alert(window.location.href);
  guildID = window.location.href.split("id=")[1].split("&")[0];
  //alert(guildID);
  var rows = $('.content > table > tbody > tr > .content > table > tbody > tr');
  pages = parseInt($(rows[rows.length - 3]).text().split(" of ")[1].trim());
  //alert(pages);
  //var namesOnPage = $('#content .content .content table tbody tr a[href*="randomfriend.phtml?user="] b');
  //alert(namesOnPage.length)
  $('#main > #content').append('<button id="getpages">Get all members</button>');
  $('#getpages').click(function(){$('#getpages').remove();getPage()});
});

function getPage() {
  $.ajax({
    url: "http://www.neopets.com/guilds/guild_members.phtml?id=" + guildID + "&page_number=" + currentPage
  }).error(function(){
    alert("An error occurred while fetching data");
    return;
  }).success(function(data){
    //alert(data);
    var namesOnPage = $('#content .content .content table tbody tr a[href*="randomfriend.phtml?user="] b', data);
    //alert(namesOnPage.length)
    for (var i = 0; i < namesOnPage.length; i++) {
      //alert($(namesOnPage)[i].text());
      if (allNames.indexOf($(namesOnPage[i]).text().trim()) === -1) {
        allNames.push($(namesOnPage[i]).text().trim());
      }
    }
    //allDone();
    pagesLoaded++;
    if (pagesLoaded >= pages) {
      allDone();
    }
  });
    if (currentPage < pages) {
      currentPage++;
      getPage();
    } else {
      //alert("done");
    }
}

function allDone() {
  //alert("done");
  //alert(JSON.stringify(allNames));
  var nameString = "";
  for (var i = 0; i < allNames.length; i++) {
    nameString += allNames[i] + "\n";
  }
  //alert(nameString);
  $('#main > #content').append('<textarea style="width: 990px; height: 300px;">' + nameString + '</textarea>');
}