// ==UserScript==
// @name        Extract all tweets from Twitter
// @name:ja     Extract all tweets from Twitter
// @namespace   https://greasyfork.org/ja/users/100769-atul-k
// @description Get all tweets from a tweeter timeline in one go. A button is provided in the navigation bar. Click the button, get the tweets in the textbox. Copy tweets and save locally. 
// @description:ja Get all tweets from a tweeter timeline in one go. A button is provided in the navigation bar. Click the button, get the tweets in the textbox. Copy tweets and save locally. 
// @include     https://twitter.com/*
// @include     https://twitter.com/*
// @author      atul k
// @version     0.5.0
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/27158/Extract%20all%20tweets%20from%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/27158/Extract%20all%20tweets%20from%20Twitter.meta.js
// ==/UserScript==
(function () {  

  var createButton = function () {
    var button = document.createElement('li');
    button.setAttribute('class', 'dm-nav');
    button.innerHTML = 
       ' <a data-original-title="" role="button" href="#"  data-placement="bottom"> ' +
        '  <span class="Icon Icon--dm Icon--large"></span> ' +
        '  <span class="text">Get Tweets</span> ' +
        '  <span class="dm-new"><span class="count-inner"></span></span> '  +
        '</a>';
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        var allTweets = $.map($('.tweet-text'), function(val) { return [$(val).text()]})
        var bigString = ""
        allTweets.forEach(function(e, i) {
            bigString += e + "\n\n"
        })
        //window.prompt("Copy to clipboard: Ctrl+C, Enter", bigString); 
        if (confirm(bigString) == true) {
            x = "sdf"
        } else {
            x = "You pressed Cancel!";
        }
      //alert(bigString);
    });
    button.addEventListener('mouseenter',function(){
      
    });
    button.addEventListener('mouseleave',function(){
      
    });
    return button;
  };
  
    var list = document.getElementById('global-actions');
    list.appendChild(createButton());
}) ();