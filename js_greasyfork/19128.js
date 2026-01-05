// ==UserScript==
// @name          Bibliotik LibraryChecker
// @version       2.1.12
// @author        phracker ( fork of a script by munkybare )
// @namespace     https://bibliotik.org/users/27317
// @description   Check Overdrive libraries for request items.
// @include       /^https?://bibliotik\.me/(requests(/?.*)|.*/requests(/.*)?)/
// @require       https://code.jquery.com/jquery-2.2.3.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery-noty/2.3.8/packaged/jquery.noty.packaged.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/js/messenger.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/19128/Bibliotik%20LibraryChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/19128/Bibliotik%20LibraryChecker.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// var category_match = {
//   "Applications": "https://dl.dropboxusercontent.com/s/wuhqbdmacu5rfu3/Applications_match2.png",
//   "Audiobooks": "https://dl.dropboxusercontent.com/s/jsh958h8yh2ebj6/Audiobooks_match2.png",
//   "Articles": "https://dl.dropboxusercontent.com/s/9y5ukpvqjvpmjmh/Articles_match2.png",
//   "Ebooks": "https://dl.dropboxusercontent.com/s/q3r81n0a13643es/Ebooks_match2.png",
//   "Journals": "https://dl.dropboxusercontent.com/s/idkhcr547z3y2sv/Journals_match2.png",
//   "Comics": "https://dl.dropboxusercontent.com/s/jutqv12hux26sh4/Comics_match2.png",
//   "Magazines": "https://dl.dropboxusercontent.com/s/4sy0iwno3ibdwaq/Magazines_match2.png"
// };

var category_match = {
  "Applications": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCklEQVR42u2XUQ3EIAyGkTIJSODhBCChRi7BARImYRImAQlIQMLufyBZsixdN66QS47kexq0/2iB1jwZr+1NYDtApteAs3wiIPVy7qrDM+y3nBBYgD/5NjMCZsYWPY1vBgFM+9+z2Do3gsLkCeNcF+IELB0ELKN3wF+FoSg6z5IkjIoCgkTAJDC0Ag9chcAqWDdJBHjGQAHUkEPu6oabpQnUIGIG7rggSbbdCIcwHBmQaTs+7cf5joCp4cH6aQH6ISCQByRhAjTqGFo2fooXkf3mVUxaV3EAmxJRXPEqUS4fon9JNmYHeBEFxBtluatzA8gi52wz0d6Y+N2WfmvmevWHia945WN4e/4BzaFvW8P77h4AAAAASUVORK5CYII=",
  "Audiobooks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAYAAAAAwr0iAAAAuUlEQVR42u2UwQ0EIQhFpwRK8jAFUMI0ssl0YAmWZgmWwP4Dp8mwG8DEiyTvoiJfQA6PnfJh0EAH8qDrHh9hswMXI6hFB2VW8AokSM0Gb0CStNkvH7rHoCisayOfCa259RpAP/zIypqrJ4yGuxz+11tjOr5avo5GJjjiOAAFBNBLT7RI+mvmC7vL4EhbqJwRASUzQdMCkoOM1glQ2wL+3ofF+3FovgCbWw8sEyBbwBawBWwBywUsH8VfVpcFpy4XMf4AAAAASUVORK5CYII=",
  "Articles": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAVUlEQVR42u3QwQnAIAAEQUtIUbZljSlJ/e1TVJZAuIN9D1ypvfXD3tlTFgMQEAAHAdAQADq7FEQEQEQARARARABEAkAkgD4ALhcgQIAAAf4A3BdguwGI0GFaCUa/rgAAAABJRU5ErkJggg==",
  "Ebooks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAc0lEQVR4Ae3XVQHAIBQFUCLQaBqAQstIBJrM3ZngF/fz+yBtyquCNVU0tVJdB0w9tASFbrCyCiSL1MxjiUfj5R3rQYC8rarBJUaHypWBS2yxPqAKwC22Rf8G6RY72v8GvkgAASoAAQIECNC7UJ/pBLV/12prsTUNFbvSRAAAAABJRU5ErkJggg==",
  "Journals": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcBAMAAADy7KARAAAAD1BMVEUAAABE/31E/31E/31E/31AljHeAAAABHRSTlMAQIC/o1TdDAAAAEFJREFUeAFjgAAhE2dFEA3nugABWAjBhQghuAghFzRAhgCGoejWYjoM0+kQBkKCAaIUoZUBohthEgPMfCB32LkDAGyWRzF2l0OZAAAAAElFTkSuQmCC",
  "Comics": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAYAAAAAwr0iAAAA8klEQVR4AeWWZxXDMAyEBaEQCqEQugAEgoF0MQgEQzGEQAgEQ3Cz56Xqus577/trnU/yEKRt2M8z4owkI9xJmmEzIrlFVeHwZNKMpVZ4Ntgxg1gvzsfeErvLMMP4lCSXGVG1pleTqAYuAIzcIZCsnVh/2eyeUHxoxKDBlFyg904ImkgiEtrucTv8aCBxbwjC7U5HBoSoPPJhvVcbWP69AX4L+EPIPoaii3sRCRb1KtYNMB8jbOD+gnc8x9jZID7H+ZBgA6fOPyGhf8nA7nwVoed/SvGEYpjfchQ1SOVEe6qrfvsLxRfClDJ0J2FLOXZLIeoMRtdBXgO7/jsAAAAASUVORK5CYII=",
  "Magazines": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcBAMAAADy7KARAAAAMFBMVEUAAABE/31E/31E/31E/31E/31E/31E/31E/31E/31E/31E/31E/31E/31E/31E/33DZwqCAAAAD3RSTlMAQI+/gCAw31DPnxBwYO/vU85JAAAAjUlEQVR4AWP4//+zSSsDGEQ42///DxQAgqIABgY2dSADKgBUJcAIlEUS+P9J/z9cQNBpPoT9U0UGLMDAwN0F4q/YwMAIEQCCLf//ewMphACIGpYC342uQQRylevhYZrw/z9amP7/Dw9TNMAgKNii/B7C/mfkISgItoLtJIg/J4EBAaL+/1/KgAIip0IZAGvy4H/j6ynLAAAAAElFTkSuQmCC"
};

function insertDependencies() {
  // animate.min.css
  // ss = document.createElement('style');
  // ss.setAttribute('type','text/css');
  // document.head.appendChild(ss);
  /*
    Theme urls:
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-theme-flat.min.css
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-theme-ice.min.css
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-theme-block.min.css
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-theme-air.min.css
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-theme-future.min.css

      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-spinner.min.css
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger.min.css
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/js/messenger-theme-flat.min.js
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/js/messenger-theme-future.min.js
      https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/js/messenger.min.js
  */
  var stylesheet_urls = new Array(
    'https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-spinner.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/css/messenger-theme-future.min.css'
  );
  for (var i = stylesheet_urls.length - 1; i >= 0; i--) {
    var ss_url = stylesheet_urls[i];
    var ss = document.createElement('link');
    ss.setAttribute('rel', 'stylesheet');
    ss.setAttribute('type', 'text/css');
    ss.setAttribute('href', ss_url);
    document.head.appendChild(ss);
  };
  var script_urls = new Array(
    'https://cdnjs.cloudflare.com/ajax/libs/messenger/1.5.0/js/messenger.min.js'
  );
  for (var i = script_urls.length - 1; i >= 0; i--) {
    var sc_url = script_urls[i];
    var sc = document.createElement('script');
    sc.setAttribute('type', 'text/javascript');
    sc.setAttribute('src', sc_url);
    document.head.appendChild(sc);
  };
};
var matches = new Array;
var misses = new Array;
$(function(){
  insertDependencies();
  console.log("Inserted dependencies");
  Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'future'
  }
  var path = window.location.pathname,
  inputFieldLibraries, GMSavedLibraries;

  // Load saved settings if they exist
  if (typeof GM_getValue('GMSavedLibraries') !== 'undefined') {
    console.log("Loading saved settings");
    GMSavedLibraries = GM_getValue('GMSavedLibraries').split(',');
    inputFieldLibraries = GMSavedLibraries.join(',');
  }
  else {
    console.log("No saved settings");
    inputFieldLibraries = 'Case Sensitive,Library 1,Library 2';
    GMSavedLibraries = inputFieldLibraries.split(',');
  }
  // Check and run different parts of the script on appropriate pages
  // Main request page
  if(/^\/requests(?:\/)?$/.test(path)) {
    console.log("Main request page");
    var searchForm = $('form[name="searchform"]');
    // Input field for users libraries
    $('tbody', searchForm).prepend('<tr><td class="Flabel"><label for="libraryOptions">Libraries:</label></td><td class="Ffield"> <input id="libraryOptions" type="text" value="" name="libraryOptions" size="95"><button id="setLibraryOptions" value="Set" type="button" role="button">Set</button><td></tr><br>');
    $('#libraryOptions').val(inputFieldLibraries);
    $('#setLibraryOptions').click(function() {
      GM_setValue('GMSavedLibraries', $('#libraryOptions').val());
    });
    checkLibraries(GMSavedLibraries);
  }
  // Single request page (description)
  if(/^\/requests\/[0-9]+(?:\/)?$/.test(path)) {
    console.log("Single request page");
    var matchedLibrary;
    var matchedLibraries = [];
    // #todo: Need something smart here... maybe add jquery objects to array.
    for (var i = 0; i < GMSavedLibraries.length; i++) {
      matchedLibrary = $('a').filter(function(index) { return $(this).text() == GMSavedLibraries[i]; });
      if (matchedLibrary.text() !== '') {
        matchedLibrary.css({ 'background-color': '#464646', 'color': '#FFFFFF' });
        matchedLibraries.push(matchedLibrary.clone());
      }
    }
    if (matchedLibraries.length > 0) {
      $('#description').prepend('<br>');
      $.each(matchedLibraries, function(i) {
        $('#description').prepend(this.append('<br>'));
      });
      $('#description').prepend('<strong>Your libraries:</strong><br>');
    }
  }
  // Categories
  if(/^\/\w+\/[0-9]+\/requests(?:\/)?$/.test(path)) {
    checkLibraries(GMSavedLibraries);
  }
  for (var i = $('span[class="title"] a').length - 1; i >= 0; i--) {
    $('span[class="title"] a')[i].textContent = $('span[class="title"] a')[i].textContent.replace(/\W*Related titles:$/,'');
  };
  // Can be used on pages which follow the same table structure
  function checkLibraries(libraries) {
    var num_complete = 0;
    $('a[href$="/tags/20911"]').each(function(index) {
      var tableRow =$(this).parents().eq(2),
      title = $('span[class="title"] a', tableRow),
      statusCell = tableRow.children().eq(0),
      categoryImage = $('td img', tableRow)[0];
      GM_xmlhttpRequest({
        method: "GET",
        url: title.attr('href'),
        onload: function(response) {
          // Easy way to transform the responseText into a jQuery object
          var responseObject = $(response.responseText);
          var matchedLibraryLink;
          var libraryWasFound = false;
          for (var i = 0; i < libraries.length; i++) {
            matchedLibraryLink = $('a', responseObject).filter(function(index) { return $(this).text() == libraries[i]; });
            if (matchedLibraryLink.text() == libraries[i]) {
              console.log('Match: ' + title.text().replace(/\W+/,' ') + ' @ '+ matchedLibraryLink.text());
              libraryWasFound = true;
            }
          }
          if (libraryWasFound) {
            statusCell.css({ 'opacity': 0.95 });
            tableRow.css({
              '-webkit-filter': 'brightness(160%)'
            });
            // tableRow.class = tableRow.class + ' od_match';
            // tableRow.addClass('animated infinite pulse');
            categoryImage.src = category_match[categoryImage.title];
            matches.push(tableRow);
          }
          else {
            statusCell.css({ 'opacity': 0.35 });
            misses.push(tableRow);
          }
        }
      });
    });
  }
});