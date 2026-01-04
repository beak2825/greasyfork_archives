// ==UserScript==
// @name        Literotica Downloader BetaFix [DEPRECATED]
// @description Single page HTML download for Literotica with improved readability. [DEPRECATED] Use this instead: https://greasyfork.org/en/scripts/423700-literotica-downloader
// @namespace   literotica_downloader_beta
// @include     https://www.literotica.com/stories/memberpage.php*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     2.1.1.fix-DEPRECATED
// @author      Improved by a random redditor and fixed for new "beta" site by someone else, originally by Patrick Kolodziejczyk
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/421420/Literotica%20Downloader%20BetaFix%20%5BDEPRECATED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/421420/Literotica%20Downloader%20BetaFix%20%5BDEPRECATED%5D.meta.js
// ==/UserScript==

$(document).ready(function () {
  // Creating style for a download icon
  GM_addStyle('.icon-download {background-image: url("https://marcoceppi.github.io/bootstrap-glyphicons/img/glyphicons-halflings.png");     background-position: -120px -24px;cursor: pointer;cursor: hand;    background-repeat: no-repeat;    display: inline-block;    height: 14px;    line-height: 14px;    vertical-align: text-bottom;    width: 14px;}'
  );
  // Function used to return content as a file for the user.
  function saveTextAsFile(textToWrite, fileNameToSaveAs)
  {
    var textFileAsBlob = new Blob([textToWrite], {
      type: 'text/javascript'
    });
    var downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';
    /*if (window.webkitURL !== null)
    {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else//*/
    {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      //downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }
  // Function parsing all pages to get the storie based
  function getContentOfStoie(baseURL) {
    var remote;
    $.ajax({
      url: baseURL,
      type: 'GET',
      async: false,
      success: function (data) {
        if ($(data).find('.l_bL').size()) {
          remote = $(data).find('.aa_ht').html() + getContentOfStoie($(data).find('.l_bL') [0].href);
        } else {
          remote = $(data).find('.aa_ht').html();
        }
      }
    });
    return remote;
  }
  function getABookForSerieDiv(myDiv) {
    var title = $.trim(myDiv.text().split(':') [0]);
    var author = $('.contactheader').text();
    alert("Starting building file for "+title +" of "+author+".\nPlease wait...");
    var book = '<html>\n<head>\n<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">\n';
    book += '<title>' + title + '</title>';
    book += '<meta content="' + author + '" name="author">';
    book += '</head>\n<body style="background-color:#333333; color: #EEEEEE; font-family: Helvetica,Arial,sans-serif; width: 60%; margin: 0 auto; line-height: 1.5em; font-size:2.2em; padding: 50px 0 50px 0;">';
    function addChapter(element, index, array) {
      if ($(this).find('a').size() > 0) {
        var description = $($(this).find('td') [1]).text();
        book += '<h1 class=\'chapter\' style="line-height: 1.4em;">' + description + '</h1>';
        var link = $($(this).find('a') [0]);
        book += getContentOfStoie(link.attr('href'));
      }
    }
    myDiv.nextUntil('.ser-ttl,.root-story').each(addChapter);
    saveTextAsFile(book, author + ' - ' + title + '.html');
  }
 function getABookForStoryDiv(myDiv) {
    var title = $.trim($($(myDiv).find('td')[0]).text().split('(')[0]);
    var author = $('.contactheader').text();
    var book = '<html>\n<head>\n<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">\n';
    book += '<title>' + title + '</title>';
    book += '<meta content="' + author + '" name="author">';
    book += '</head>\n<body style="background-color:#333333; color: #EEEEEE; font-family: Helvetica,Arial,sans-serif; width: 70%; margin: 0 auto; line-height: 1.5em; font-size:2.2em; padding: 50px 0 50px 0;">';
      if ($(myDiv).find('a').size() > 0) {
        var description = $($(myDiv).find('td') [1]).text();
        book += '<h1 class=\'chapter\' style="line-height: 1.4em;">' + description + '</h1>';
        var link = $($(myDiv).find('a') [0]);
        book += getContentOfStoie(link.attr('href'));
      }

    saveTextAsFile(book, author + ' - ' + title + '.html');
  }
  $('.ser-ttl td:nth-child(1)').prepend('<span class=\'icon-download\'></span>');
   $('.ser-ttl td:nth-child(1)').click(function()  {
  getABookForSerieDiv($(this).parent());
});
  $('.root-story td:nth-child(1), .sl td:nth-child(1)').prepend('<span class=\'icon-download\'></span>');
$('.root-story td:nth-child(1), .sl td:nth-child(1)').click(function()  {
  getABookForStoryDiv($(this).parent());
});
});
