// ==UserScript==
// @name        Hack Forums - Multi Quote
// @namespace   Doctor Blue
// @description Adds a multiquote button to the post management buttons.
// @include     *hackforums.net/showthread.php?tid=*
// @require     https://cdn.jsdelivr.net/jquery/1.10.2/jquery-1.10.2.min.js
// @require     https://cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js
// @version     0.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11650/Hack%20Forums%20-%20Multi%20Quote.user.js
// @updateURL https://update.greasyfork.org/scripts/11650/Hack%20Forums%20-%20Multi%20Quote.meta.js
// ==/UserScript==

// Prevent conflicts with other userscripts
var $j = $.noConflict(true)

// Add the button to post management buttons
var $posts = $j('table[id*="post_"] .bitButton:contains("Quote")')
  .after(' <a class="bitButton multiquote" href="javascript:void(0)">Quote+</a>')

// Restyle the multiquote insert message
$j('#quickreply_multiquote')
  .css('background-color', '#777777')
  .css('border', '1px #CCCCCC dashed')

// Parse the multiquote cookie
function getQuotes() {
  var quotes = $j.cookie('multiquote')
  return (quotes === undefined ? new Array() : quotes.split('|'))
}

// Change button text to Q- if post is already being quoted on load
function quoteInit() {
  var quotes = getQuotes()
  $j('.multiquote').text('Quote+')
  quotes.forEach(function(pid) {
    $j('#post_' + pid + ' .multiquote').text('Quote-')
  })
}

// Retrieve the quoted content
function fetchQuoteText() {
  Thread.spinner = new ActivityIndicator("body", {image: imagepath + "/spinner_big.gif"})
  $j.get('/xmlhttp.php?action=get_multiquoted&load_all=1', function(data) {
    console.log("Inserting text")
    var olddata = $j('#message').val()
    $j('#message').val(olddata + data)
    Thread.spinner.destroy()
    Thread.spinner = ""
    clearQuotes()
  })
}

function clearQuotes() {
  $j.removeCookie('multiquote', {path: '/', domain: '.hackforums.net'})
  $j('#quickreply_multiquote').hide()
  quoteInit()
}

// Set all buttons to Q+ after inserting
$j('#quickreply_multiquote > span > a[href*="load_all_quotes"]')
  .prop('onclick', null).off('click') // Remove MyBB handler

$j('#quickreply_multiquote > span > a[href*="load_all_quotes"]').on('click', function(event) {
    console.log("Inserting quotes")
    $j('.bitButton.multiquote').text('Quote+')
    fetchQuoteText()
    event.preventDefault()
  })

$j('.bitButton.multiquote').on('click', function(event) {
  // Get the post id (Dunno why parentsUntil doesn't work here)
  var pid = $j(this).parent().parent().parent().parent().parent().attr('id').substr(5)
  var quotes = getQuotes()
  
  // Remove the quote if it's already there, add it if it isn't
  var i = $j.inArray(pid, quotes)
  if(i !== -1) { // Remove quote if found
    quotes.splice(i, 1)
    $j(this).text("Quote+")
  } else { // Add quote if not found
    quotes.push(pid)
    $j(this).text("Quote-")
  }

  // Update the cookie
  if(quotes.length > 0) {
    $j('#quickreply_multiquote').show()
    $j.cookie('multiquote', quotes.join('|'), {expires: 365, path: '/', domain: '.hackforums.net'})
  } else {
    $j('#quickreply_multiquote').hide()
    $j.removeCookie('multiquote', {path: '/', domain: '.hackforums.net'})
  }
})