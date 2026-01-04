// ==UserScript==
// @name         HTPC--Sonarr DOM scanner
// @namespace    SPENGLER Scripts
// @version      0.3.5
// @description  Add show links from Sonarr to NZBgeek
// @author       SPENGLER
// @match        *://*:8989/*
// @match        *://*:*/sonarr/*
// @match        *://htpc:8989/sonarr/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js#sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410004/HTPC--Sonarr%20DOM%20scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/410004/HTPC--Sonarr%20DOM%20scanner.meta.js
// ==/UserScript==

// fix jQuery error messages
//var $ = window.jQuery;
//OR
//var $ = window.$;

// global variables/functions
var nzb_icon =       "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";
var piratebay_icon = "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";
var I337x_icon =     "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIaSURBVDhPxZHPaxNREMdn3ttko6GCKIUiaSu2ghbS3rwIErCg2JOSQzwIXjzo1V6kEqpIT/UuHgpKPagIioievHgRDKZo8EfbQBpoK0oa3WSTze6b8b10TRr8A/qBt7PDm+93Z2Zh18Ewwnpm7ILVt+8moGACjLSc6sLgo8/z5q58aTxlHxiYA2nFQMiY2iw9HXiQnzF3wjwMvud8bNUcqQJ/glQwJqP2tV/p0UOczQrLjl9FIU4g4jj4zVG/6X4IZV2DoWdrRb/hTGPge6YHGYke9mTkfPnL45Nox6aYuV3n16q3E8cyL9qJpjOCQRfhxsXji2DvzbDQ3kxlQLkl431JEY1B0GwUrOrvyf7F3EYo6XZg0C1yEHhz5LcqTKaLWELYe5IoLSCvEQTrq/M7xYYeA8Pgk+In5bn3pRZpRxCWBHK2wPu+9D5RGX4YlnX4z8AsTdrxhBErtwZ+eQVaxQKQ++fgssrtD8s69OzAUDrbP6mX9pKbblQfAKVARCJmP+b61tDberZdGNLTAZ8ZsdGrX1eVH1F2HSBSeRL46t8f0PFyKWUfaSchPQar7to5Ij6NQgKjAEV0F1nN6Fg3S9VjJVoBXOF0WoaSrsHyKXtEq+7oV2G+qM9XBvv1cOrGEhO/MTshMw7i9Mrm86lt1Q4DZE5a0mrqRvM6LRDTvaPvaj9xdpZAiAUiymnTvCXlN2SY2FbtPgB/AYKF9gUD0o9+AAAAAElFTkSuQmCC";
var pageContext = ''; // start blank to trigger first donPatch
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}
function getTime(){
  var now = new Date();
  var hours = now.getHours();
  var mins = now.getMinutes();
  var seconds = now.getSeconds();
  return (hours+":"+mins+":"+seconds+"");
}
function getBodyHTML() {
  localStorage.setItem('body',$('body').html());
}
function domPatch() {
  if(pageContext != window.location.pathname) { // only run if URL changes
    pageContext = window.location.pathname; // pages of interest: /sonarr/wanted/missing | /sonarr/series/<show-name>
    var ShowTitle = null;
    var EpisodeID = null;
    var TraktTV_btn = null;
    var TraktTV_ID = null;
    var NZBgeek_ID_URL = 'https://nzbgeek.info/geekseek.php?tvid=<TraktTV_ID>';
    var NZBgeek_TXT_URL = 'https://nzbgeek.info/geekseek.php?browseageordervar=desc&moviesgeekseek=1&browsecategory=5000&browseincludewords=<txtSearch>';
    var PirateBay_URL = 'https://www1.thepiratebay3.to/s/0/1/0?q=<SHOW+TITLE>&category=205';
    var I337x_URL = 'https://1337x.to/search/<SHOW+TITLE>/1/';

    // series viewer
    if (pageContext.match('/sonarr/series/*') || pageContext.match('/series/*')) {
      ShowTitle = replaceAll(pageContext,'-',' ').replace('/sonarr/series/','').replace('/series/','');
      TraktTV_btn = $('#page').find('a[href^="http://trakt.tv/"]');
      TraktTV_ID = TraktTV_btn.attr('href');
      TraktTV_ID = TraktTV_ID.replace('http://trakt.tv/search/tvdb/','').replace('?id_type=show','');
      
      // NZBGeek
      NZBgeek_ID_URL = NZBgeek_ID_URL.replace('<TraktTV_ID>',TraktTV_ID);
      TraktTV_btn.parent().append('<a href="'+NZBgeek_ID_URL+'" class="label label-info" style="background-color:orange;">NZBgeek</a> ');
      
      // PirateBay
      PirateBay_URL = PirateBay_URL.replace('<SHOW+TITLE>',replaceAll(ShowTitle,' ','+'));
      TraktTV_btn.parent().append('<a href="'+PirateBay_URL+'" class="label label-info" style="background-color:orange;">PirateBay</a> ');
            
      // 1337x
      I337x_URL = I337x_URL.replace('<SHOW+TITLE>',replaceAll(ShowTitle,' ','+'));
      TraktTV_btn.parent().append('<a href="'+I337x_URL+'" class="label label-info" style="background-color:orange;">1337x</a> ');
            
      $('#getBodyHTML').text(TraktTV_ID); // just for tracing
    }
    
    // wanted viewer
    if (pageContext.match('/sonarr/wanted/missing') || pageContext.match('/wanted/missing')) {
      $('#getBodyHTML').text('wanted'); // just for tracing
      var parentTable;
      $('#page').find("td.episode-status-cell").each(function(){
        parentTable = !parentTable ? $(this).parent().parent().parent() : parentTable;
      });
      // parentTable.attr('data-mike','update');
      var tableRow;
      parentTable.find('tbody tr').each(function(){
        tableRow = $(this);
        ShowTitle = tableRow.find("td.series-title-cell").text().trim();
        EpisodeID = tableRow.find("td.episode-number-cell").text().trim();
        var txtSearch = replaceAll(replaceAll(ShowTitle," ","+"),"'","")+'+s'+EpisodeID.replace('x','e');
        var htmSearch = ''+
            ' <a href="' + NZBgeek_TXT_URL.replace('<txtSearch>',txtSearch) + '"><img src="data:image/png;base64,'+nzb_icon+'" height="16"></img></a> ' +
            ' <a href="' + PirateBay_URL.replace('<SHOW+TITLE>',txtSearch) + '"><img src="data:image/png;base64,'+piratebay_icon+'" height="16"></img></a>' +
            ' <a href="' + I337x_URL.replace('<SHOW+TITLE>',txtSearch) + '"><img src="data:image/png;base64,'+I337x_icon+'" height="16"></img></a>';
        tableRow.find("td.episode-status-cell").append(htmSearch);
      })
    }
  }
}
var looper = setInterval(domPatch,1000);


$( document ).ready(function() {
  //$('body').prepend('<div><button id="getBodyHTML" style="background-color:orange;">BUTTON HERE</button></div>');
  //$('#getBodyHTML').click(function(){ getBodyHTML(); });
});