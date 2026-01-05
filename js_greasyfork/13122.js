// ==UserScript==
// @name        KAT - Insert From Album
// @namespace   IFA
// @version     1.00
// @description Insert an image from an existing album
// @include      https://*kat.cr/*
// @downloadURL https://update.greasyfork.org/scripts/13122/KAT%20-%20Insert%20From%20Album.user.js
// @updateURL https://update.greasyfork.org/scripts/13122/KAT%20-%20Insert%20From%20Album.meta.js
// ==/UserScript==

var target = document.querySelector('#fancybox-close');
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
      if (mutation.target.style.display === "inline")
      {
          console.log("observed");
          $('<div>Select from album: <select id="albumSelector"><option selected="selected" style="display:none;" disabled>Choose an album from the list</option></select></div></br>').insertAfter(".switcherBox");
          $.ajax(
          {
              type: 'GET',
              url: 'https://kat.cr/user/' + $("span.usernameProfile").text() + '/albums/',
              success: function(data) 
              {
                  var html = data.html;
                  var count = 0;
                  var start = html.indexOf('<div style="margin: 20px 0;">');
                  if (start != -1)
                  {
                      var end = html.indexOf('<div class="clear">', start);
                      html = html.substring(start, end);
                      var regex = /ka-red"><\/i><\/a>\s+<a href="\/user\/[^\/]+\/album\/(\d+)\/" .+ title="(.+)">/g; 
                      var match;
                      while ((match = regex.exec(html)) !== null) 
                      {
                          count++;
                          $('<option value="' + match[1] + '">' + match[2] + '</option>').appendTo("#albumSelector");
                      }
                  }
                  if (count == 0) { $("#albumSelector").parent().remove(); }
                  observer.disconnect();
                  $("#albumSelector").change(getImages);
              },
              error: function (responseData, textStatus, errorThrown) 
              {
                  alert('GET failed.');
              }
          });
          
      }
  });
});
 
// configuration of the observer:
var config = { attributes: true};
 
$(".bbedit-image").click(function()
{    
    observer.observe(target, config); 
});

function getImages()
{
    var album = $(this).val();
    $("fancybox-content div .pages").attr("baseurl", "/image/select/album/" + album + "/");
    var temp = $("#fancybox-content div .pages a:eq(1)");
    $(temp).attr("rel", "nofollow");
    $(temp).attr("href", "/image/select/album/" + album + "/");
    $(temp).removeClass("active");
    $(temp).click();    
}