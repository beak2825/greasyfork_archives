// ==UserScript==
// @name        Forum Spoilers Hider - MAL
// @namespace   HideForumSpoilers
// @version     12
// @description Hides the title of forum topics that aren't episodes/chapters discussion topics on anime/manga pages to avoid spoilers. Hover the mouse over the Forum Topic title to see the original title.
// @author      hacker09
// @match       https://myanimelist.net/forum/
// @include     /^https:\/\/myanimelist\.net\/(forum\/)?(\/)?(anime|manga|subboard=(1|4))?(id=)?(\.php\?id=)?\/?(\d+)?\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/426485/Forum%20Spoilers%20Hider%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/426485/Forum%20Spoilers%20Hider%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var EntryType, EntryID, StoredEntryIDsArray, StoredEntryIDsRegex; //Makes these variables global

  document.querySelector('[href*="forum/?_location=mal_h_m"]').href = document.querySelector('[href*="forum/?_location=mal_h_m"]').href.split('?')[0]; //Change the forum link so that we can remove the right side menus on the main forum page

  if (location.pathname.split('/')[1].match(/anime|manga/) !== null | location.href.match(/animeid=|mangaid=/) !== null) //If the user is on an anime/manga, or on the Anime/Manga Discussions Board page
  { //Starts the if condition

    if (location.pathname.split('/')[1].match(/anime|manga/) !== null) //If the user is on an anime or manga page
    { //Starts the if condition
      GM_registerMenuCommand("Hide This on Series Discussions!", HideThis); //Adds an option to the menu
      function HideThis() //Creates a function to Hide This on Series Discussions
      { //Starts the HideThis function

        EntryID = location.pathname.match(/\d+/)[0]; //Store the Entry ID

        if (location.pathname.split('/')[1] === 'anime') //If the opened url is an anime entry page
        { //Starts the if condition
          EntryType = 'animeid='; //Add a value to the variable
        } //Finishes the if condition
        else //If the opened url is an manga entry page
        { //Starts the else condition
          EntryType = 'mangaid='; //Add a value to the variable
        } //Finishes the else condition

        if (confirm('To hide only this specific entry on the Series Discussion forum click on OK\n\nTo hide all franchise entries related to this entry on the Series Discussion forum click on Cancel')) //Show the confimation alert box text
        { //Starts the if condition
          GM_setValue(EntryType + EntryID, 'Hide'); //Get and save the entry id as a variable
        } //Finishes the if condition
        else //If the user want's to write the franchise title
        { //Starts the else condition
          var UserInput = prompt('Write the Franchise title you want to hide on the Series Discussion forum and click on OK\n\nThe Franchise title must be written in the exact same way it MAL writes it!\Example: Shingeki no Kyojin: The Final Season\nMust be written as Shingeki no Kyojin\n\nIn this case any entries with "Shingeki no Kyojin" on the anime/manga title will be hidden on the Series Discussion forum'); //Gets the user input
          GM_setValue(UserInput, 'Hidden Franchise Title'); //Defines the variable as the UserInput
        } //Finishes the else condition
      } //Finishes the HideThis function
    } //Finishes the if condition

    setTimeout(function() { //Starts the settimeout function

      var TopicTilesElement = document.querySelector("#forumTopics > tbody").querySelectorAll('td:nth-child(2) > a,strong'); //If the user is an anime or manga page
      if (location.href.match(/animeid=|mangaid=/) !== null) //If the user is on the Anime/Manga Discussions forum subboard page
      { //Starts the if condition
        TopicTilesElement = Array.from(document.querySelectorAll("#forumTopics > tbody > tr > td:nth-child(2) > a,strong")).filter(e => !e.innerText.includes("Sticky:")); //If the user is on the page https://myanimelist.net/forum/?animeid= or on the page https://myanimelist.net/forum/?mangaid=
      } //Finishes the if condition

      TopicTilesElement.forEach(function(el) { //For each forum topic title
        var OriginalTopicTitle = el.innerText; //Save the topic title to a variable

        if (el.innerText.match(/Episode|Chapter \d+ Discussion/) === null) //If the topic title isn't an episode or chapter discussion topic
        { //Starts the if condition

          if (el.tagName === 'STRONG') //If the topic title element is = 'strong'
          { //Starts the if condition
            el.style.cursor = 'pointer'; //Make the forum topic title look like it's clickable
          } //Finishes the if condition

          el.onmouseover = function() { //When the text 'Hidden Title' is hovered
            el.innerText = OriginalTopicTitle; //Show the real topic title
          }; //Finishes the onmouseover event listener

          el.innerText = 'Hidden Title'; //Change all non chapter/episode discussion topics title text to 'Hidden Title'

          el.onmouseout = function() { //When the real topic title stop being hovered
            el.innerText = 'Hidden Title'; //Hide the real topic title again
          }; //Finishes the onmouseout event listener
        } //Finishes the if condition
      }); //Finishes the foreach condition
    }, 3000); //Finishes the settimeout function
  } //Finishes the if condition

  if (location.href === 'https://myanimelist.net/forum/') //If the user is on the forum page
  { //Starts the if condition
    document.querySelectorAll("div.forum-side-block")[2].remove(); //Hide the right side Anime Series Discussion topics
    document.querySelectorAll("div.forum-side-block")[2].remove(); //Hide the right side Manga Series Discussion topics

    document.querySelectorAll("div.forum-side-block").forEach(function(ELone) { //For the Popular New Topics and the Recent Posts

      ELone.querySelectorAll("li.forum-post.clearfix").forEach(function(ELtwo) { //For each forum topic row

        var Element = ELtwo.querySelectorAll("span.information.di-ib.fs10.fn-grey4")[0]; //Saves the row bottom info element
        var TopicTitleElement = Element.parentNode.querySelector("a.title"); //Save the topic title element to a variable
        var OriginalTopicTitle = TopicTitleElement.innerText; //Save the topic title to a variable

        if (Element.innerText.match('Series Discussion') !== null && TopicTitleElement.innerText.match(/Episode|Chapter \d+ Discussion/) === null) //If the topic title is from the Series Discussion forum and If the topic title isn't an episode or chapter discussion topic
        { //Starts the if condition

          TopicTitleElement.onmouseover = function() { //When the text 'Hidden Title' is hovered
            TopicTitleElement.innerText = OriginalTopicTitle; //Show the real topic title
          }; //Finishes the onmouseover event listener

          TopicTitleElement.innerText = 'Hidden Title'; //Change all non chapter/episode discussion topics title text to 'Hidden Title'

          TopicTitleElement.onmouseout = function() { //When the real topic title stop being hovered
            TopicTitleElement.innerText = 'Hidden Title'; //Hide the real topic title again
          }; //Finishes the onmouseout event listener
        } //Finishes the if condition
      }); //Finishes the foreach condition
    }); //Finishes the foreach condition

  } //Finishes the if condition

  if (location.href.match('subboard=') !== null) //If the user is on a forum subboard page
  { //Starts the if condition

    StoredEntryIDsArray = []; //Creates a new blank array
    GM_listValues().forEach(a => StoredEntryIDsArray.push(a)); //Add all Entry IDs and types on tampermonkey to the array
    StoredEntryIDsRegex = new RegExp(StoredEntryIDsArray.join('|')); //Create a new variable and regex containing all the values saved on tampermonkey and replace the , separator with the or $| regex symbols

    document.querySelectorAll("#forumTopics > tbody > tr > td:nth-child(2)  > i > a,strong").forEach(async function(el) { //For each forum topic title

      if ((el.tagName !== 'STRONG' && el.href.match(StoredEntryIDsRegex) !== null && StoredEntryIDsRegex.toLocaleString() !== '/(?:)/') | el.parentElement.innerText.match(StoredEntryIDsRegex) !== null) //If the current topic url Entry id and type matches an Entry id and type that is stored on tampermonkey, and if the Regex contains 1 or more Entry ids and If the topic is from an specific entry id or entry title
      { //Starts the if condition

        var TopicTitleElement = el.parentElement.parentNode.querySelectorAll("#forumTopics > tbody > tr > td:nth-child(2) > a,strong")[0]; //Save the topic title element to a variable
        var OriginalTopicTitle = TopicTitleElement.innerText; //Save the topic title to a variable

        if (OriginalTopicTitle.match(/Episode|Chapter \d+ Discussion/) === null) //If the topic title isn't an episode or chapter discussion topic
        { //Starts the if condition

          if (TopicTitleElement.tagName === 'STRONG') //If the topic title element is = 'strong'
          { //Starts the if condition
            TopicTitleElement.style.cursor = 'pointer'; //Make the forum topic title look like it's clickable
          } //Finishes the if condition

          TopicTitleElement.onmouseover = function() { //When the text 'Hidden Title' is hovered
            TopicTitleElement.innerText = OriginalTopicTitle; //Show the real topic title
          }; //Finishes the onmouseover event listener

          setTimeout(function() { //Starts the settimeout function
            TopicTitleElement.innerText = 'Hidden Title'; //Change all non chapter/episode discussion topics title text to 'Hidden Title'
          }, 0); //Finishes the settimeout function

          TopicTitleElement.onmouseout = function() { //When the real topic title stop being hovered
            TopicTitleElement.innerText = 'Hidden Title'; //Hide the real topic title again
          }; //Finishes the onmouseout event listener
        } //Finishes the if condition

      } //Finishes the if condition
    }); //Finishes the foreach condition
  } //Finishes the if condition
})();