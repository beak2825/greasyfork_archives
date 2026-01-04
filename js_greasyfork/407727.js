// ==UserScript==
// @name         Watch Order & Adaptations Finder
// @namespace    Search for Live-Actions\Doramas\All Related Entries + Correct Watch Order + Copy Entry Title
// @version      55
// @description  See the franchise's correct watch order and all entries. Easily check if an entry has Live-Action/Dorama adaptations, and copy the entry or all franchise entries' title(s).
// @author       hacker09
// @include      https://myanimelist.net/forum/?topicid=1863965
// @include      https://myanimelist.net/editclub.php?cid=5450&action=details
// @include      /^https:\/\/myanimelist\.net\/((anime|manga)(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @exclude      https://myanimelist.net/anime/genre/*
// @exclude      https://myanimelist.net/anime/producer/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://myanimelist.net&size=64
// @run-at       document-end
// @connect      chiaki.site
// @connect      mydramalist.com
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/407727/Watch%20Order%20%20Adaptations%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/407727/Watch%20Order%20%20Adaptations%20Finder.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var hasRun = true; //Create a new variable
  async function Prog() { //Run the program
    if (document.hasFocus() && hasRun) //If the tab has focus and it's the first time the script runs
    { //Starts the if condition
      hasRun = false; //Change the var condition
      if (location.href === 'https://myanimelist.net/editclub.php?cid=5450&action=details' && document.querySelector(".header-profile-link").innerText.match(/hacker09|IridescentJaune|tsubasalover/)) { //If the user is on the [[ Live Action Adaptations ]] Edit Club page
        document.querySelectorAll('[id*="Relation"]').forEach((element, i) => { //ForEach list
          element.style.display = 'none'; //Hide all 3 lists
          element.insertAdjacentHTML('beforebegin', `<div class="toggle-icon${i}" style=" width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 10px solid black; cursor: pointer; display: inline-block; margin-right: 5px; "></div>`); //Create the toggle icon HTML string

          const toggleIcon = element.previousElementSibling; //Add the toggle icon

          toggleIcon.addEventListener('click', () => { //Add a click event listener to the toggle icon
            if (element.style.display === 'none') { //if the list is hidden
              element.style.display = ''; //Show the list
              // Change the triangle to point down
              toggleIcon.style.borderTop = '10px solid black';
              toggleIcon.style.borderBottom = '0';
              toggleIcon.style.borderLeft = '10px solid transparent';
              toggleIcon.style.borderRight = '10px solid transparent';
            } else { //If the list is visible
              element.style.display = 'none'; //Hide the list
              // Change the triangle to point right
              toggleIcon.style.borderTop = '10px solid transparent';
              toggleIcon.style.borderBottom = '10px solid transparent';
              toggleIcon.style.borderLeft = '10px solid black';
              toggleIcon.style.borderRight = '0';
            }
          });
        });

        document.querySelectorAll('[valign="top"]')[6].insertAdjacentHTML('beforeend', ` <div style="margin: 10px 0;"> <input type="text" id="SearchNum" placeholder="ID" style="padding: 5px;width: 57px;height: 7px;"> <button id="SearchBTN" style=" margin-top: 5px; background-color: #4065ba; border: none; color: #fff; cursor: pointer; font-size: 11px; padding: 4px 8px; ">Search</button> </div> `);

        // Add event listeners for search
        document.getElementById('SearchBTN').addEventListener('click', performSearch);
        document.getElementById('SearchBTN').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            performSearch();
          }
        });

        function performSearch() {
          event.preventDefault(); // Prevent default action
          document.querySelectorAll('[id*="Relation"]').forEach((element) => { //ForEach list
            element.style.display = ''; //Display all lists
          });
          document.querySelectorAll('a').forEach(link => {
            const onclickValue = link.getAttribute('onclick');
            const title = document.querySelectorAll("div[id*='rel']")
            if (onclickValue) {
              const uniqueNumbers = new Set(onclickValue.match(/\d+/g));
              if (uniqueNumbers.has(document.getElementById('SearchNum').value)) {
                link.parentNode.style.backgroundColor = 'cyan';
                link.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          });
        }

        document.querySelectorAll('[valign="top"]').forEach((el,i) => { //ForEach row
          if (document.querySelector(".header-profile-link").innerText.match(/IridescentJaune|tsubasalover/) && i !== 6) { //Show only the Club Relations
            el.parentNode.style.display = 'none'; //Hide everything besides the Club Relations
          }
        });
      } //Finishes the if condition

      if (location.href === 'https://myanimelist.net/forum/?topicid=1863965') { //If the user is on the Official Guidex Index
        $("b:contains('Guides available:')")[0].innerHTML = '<b style="font-weight: normal;">(Click on the letter you want to jump to.)</b><br><div style="cursor: pointer;"><b id="GoToA">Guides available: A</b> | <b id="GoToB">B</b> | <b id="GoToC">C</b> | <b id="GoToD">D</b> | <b id="GoToE">E</b> | <b id="GoToF">F</b> | <b id="GoToG">G</b> | <b id="GoToH">H</b> | <b id="GoToI">I</b> | <b id="GoToJ">J</b> | <b id="GoToK">K</b> | <b id="GoToL">L</b> | <b id="GoToM">M</b> | <b id="GoToN">N</b> | <b id="GoToO">O</b> | <b id="GoToP">P</b> | <b id="GoToQ">Q</b> | <b id="GoToR">R</b> | <b id="GoToS">S</b> | <b id="GoToT">T</b> | <b id="GoToU">U</b> | <b id="GoToV">V</b> | <b id="GoToW">W</b> | <b id="GoToX">X</b> | <b id="GoToY">Y</b> | <b id="GoToZ">Z</b><div> <style>#topBtn {display: block;position: fixed;bottom: 20px;right: 30px;z-index: 99;font-size: 18px;border: none;outline: none;background-color: #2e51a2;color: white;cursor: pointer;padding: 15px;border-radius: 4px;}</style><button onclick="document.documentElement.scrollTop = 0;" id="topBtn" title="Go to top" style="transform: rotate(90deg); display: block;">&lt;</button>'; //Adds a text and makes the letters clickable. Also adds a scroll to the top button on the page

        for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); ++i) { //For every charCode
          document.querySelector(`b#GoTo${String.fromCharCode(i)}`).onclick = () => document.querySelectorAll('b')[i - 36].scrollIntoView(); //Scroll the page until the letter can be seen
        } //Finishes the for condition
      } //Finishes the if condition
      else //If the user isn't on any Guide Index
      { //Starts the else condition

        const findButton = document.createElement("a"), copyButton = document.createElement("a"), chiakiButton = document.createElement("a"); //Creates an "a" element so the button will appear
        var ChiakiFranchiseTitle, ChiakiFranchiseTitleWithSymbols, MalClubText, ChiakiDocument, IMDBAsianWiki, hasAnime = '', ChiakiTextData = [], ChiakientryidSArray = [], MyDramaListText = ' and MyDramaList', MyDramaListCheck = '👍 Found on MyDramaList.'; //Create new global variables

        if (location.pathname.split('/')[1] === 'manga') { //If the user is in an manga entry
          const Relations = await (await fetch('https://api.jikan.moe/v4/' + location.href.split('/')[3] + '/' + location.pathname.match(/\d+/)[0] + '/relations')).json(); //Fetch
          hasAnime = Relations.data.flatMap(relation => relation.entry).find(entry => entry.type === "anime"); //Try getting 1 entry that is an anime
        } //Finishes the if condition

        var entryid = hasAnime !== undefined && hasAnime !== '' ? hasAnime.mal_id : location.pathname.match(/\d+/)[0]; //Get the anime id

        GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          method: "GET",
          url: 'https://chiaki.site/?/tools/watch_order/id/' + entryid,
          onload: (response) => { //Starts the onload event listener
            ChiakiDocument = new DOMParser().parseFromString(response.responseText, 'text/html'); //Parses the fetch response

            if (ChiakiDocument.querySelector("h2") !== null) { //Starts the if condition
              ChiakiFranchiseTitle = ChiakiDocument.querySelector("h2").innerText.split(' Watch Order')[0].replace(/[^a-zA-Z0-9]+/g, " ").trim(); //Get the anime title on the h2 element and remove the Watch Order text, symbols, and whitespaces
              ChiakiFranchiseTitleWithSymbols = ChiakiDocument.querySelector("h2").innerText.split(' Watch Order')[0].trim(); //Get the anime title on the h2 element (with symbols) and remove the Watch Order text, and whitespaces
            } //Finishes the if condition

            ChiakiDocument.querySelectorAll("span.uk-text-muted.uk-text-small").forEach((TextElement, i) => { //Loop through the elements
              ChiakientryidSArray.push(ChiakiDocument.querySelectorAll("span.uk-text-muted.uk-text-small > a:nth-child(1)")[i].href.match(/\d+/)[0]); //Add All Anime Links on chiaki to an Array

              const TotalRawDuration = TextElement.textContent.split("×")[1].split("|")[0].trim(); //Creates a variable to hold the total unprocessed times
              const ALLChiakiTitles = ChiakiDocument.querySelectorAll("span.wo_title")[i].innerText; //Creates a variable to get all the anime titles on the chiaki site
              const TotalEpisodes = TextElement.textContent.split("|")[2].match(/\d+|\?/g)[0]; //Creates a variable to hold the total episodes
              const EpisodeType = TextElement.textContent.split("|")[1].trim(); //Creates a variable to get the episode types
              var eps = ' eps'; //Create a variable called eps
              var Duration = ''; //Creates a blank variable
              var PerEp = ' per ep'; //Create a variable called PerEp
              if (TotalEpisodes === '1') { //If the entry has only 1 ep
                eps = ' ' + EpisodeType; //Change the variable called eps
                PerEp = ''; //Change the variable called PerEp
              } //Finishes the if condition
              if (EpisodeType !== 'TV') { //If the entry type isn't TV
                if (TotalEpisodes !== '1') { //If the entry doesn't have only 1 ep
                  eps = ' ' + EpisodeType + 's'; //Change the variable called eps
                } //Finishes the if condition
                Duration = ' of ' + TotalRawDuration + PerEp; //Defines the Duration variable if the episode type isn't TV
              } //Finishes the if condition
              ChiakiTextData.push(ALLChiakiTitles + ',, ' + TotalEpisodes + eps + Duration + ',\n'); //Add Everything to an Array
            }); //Finishes the for condition

          } //Finishes the onload event listener
        }); //Finishes the xmlHttpRequest

        GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          method: "GET",
          url: "https://mydramalist.com/search?q=" + (hasAnime !== undefined ? ChiakiFranchiseTitle : document.querySelector("[itemprop*='name']").innerText.split('\n')[0]) + '&adv=titles&ty=68,77,83,86',
          onload: (response) => { //Starts the onload event listener
            const MyDramaListDocument = new DOMParser().parseFromString(response.responseText, 'text/html'); //Parses the fetch response
            if (MyDramaListDocument.querySelector(".m-b-sm") === null) { //If MyDramaList did not return any results
              MyDramaListText = ''; //Display to the user that MyDramaList won't be opened if OK is clicked
              MyDramaListCheck = '✖ NOT Found on MyDramaList.'; //Display the confirmation that the anime doesn't have any adaptations found on MyDramaList
            } //Finishes the if condition
          } //Finishes the onload event listener
        }); //Finishes the xmlHttpRequest

        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(document.querySelector("[itemprop*='name']").innerText.split('\n')[0]); //Copy the entry title with symbols
        }); //Detect the single mouse click
        copyButton.addEventListener("dblclick", () => {
          navigator.clipboard.writeText(document.querySelector("[itemprop*='name']").innerText.split('\n')[0].replace(/[^a-zA-Z0-9]+/g, " ")); //Copy the entry title without symbols
        }); //Detect the double mouse click

        copyButton.addEventListener("contextmenu", (e) => { //Detect a mouse click
          hasAnime !== undefined ? navigator.clipboard.writeText(ChiakiTextData.join('').trim()) : ''; //Copy the array to the clipboard
          e.preventDefault(); //Don't show the right-click default context menu
        }); //Detect the mouse right click

        hasAnime !== undefined ? copyButton.setAttribute("title", "Click To Copy Entry Title (+ Symbols)\n2 Clicks To Copy Entry Title (Without Symbols)\n\nRight click to Copy ALL Anime Only Entry Titles on The Broadcast Order With EP Numbers, Entry Types and Duration Times") : copyButton.setAttribute("title", "1 Click To Copy Entry Title (+ Symbols)\n2 Clicks To Copy Entry Title (Without Symbols)"); //Detect a mouse hover on the button and shows an explanation text

        copyButton.setAttribute("style", "cursor: pointer;margin-left: 13px;height: 10px;width: 10px;background-size: cover;display: inline-block;transform: scale(1.8);vertical-align: top;margin-top: 7px;"); //The CSS for the copy button
        copyButton.style.backgroundImage = `url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/hIfOM22.png' : 'https://i.imgur.com/vU0m0ye.png'})`; //The copy button image

        findButton.addEventListener("click", async () => { //Detect the mouse click and search for the anime title
          if (location.pathname.split('/')[1] === 'manga' || confirm(`Search using:\n\nOK=Entry Title (${document.querySelector("[itemprop*='name']").innerText.split('\n')[0]})\n𝕮𝖆𝖓𝖈𝖊𝖑=𝔽𝕣𝕒𝕟𝕔𝕙𝕚𝕤𝕖 𝕋𝕚𝕥𝕝𝕖 (${ChiakiFranchiseTitle})`)) { //Show the confirmation alert box text
            ChiakiFranchiseTitle = document.querySelector("[itemprop*='name']").innerText.split('\n')[0]; //Change the Franchise title we got from Chiaki to the entry title (to search on mydramalist)
            ChiakiFranchiseTitleWithSymbols = document.querySelector("[itemprop*='name']").innerText.split('\n')[0]; //Change the Franchise title we got from Chiaki to the entry title (to search on the mal club)
          } //Finishes the if condition

          if ([...ChiakiDocument.querySelectorAll('span.uk-text-muted.uk-text-small')].find(el => el.innerText.includes('TV')) !== null) { //If the Franchise has at least 1 entry that the type is TV
            const response = await (await fetch('https://myanimelist.net/clubs.php?cid=5450')).text(); //Fetch

            new DOMParser().parseFromString(response, 'text/html').body.innerText.search(ChiakiFranchiseTitleWithSymbols) > -1 ? MalClubText = '👍 Found on the [[ Live Action Adaptations ]] MAL Club' : MalClubText = '✖ NOT found on the [[ Live Action Adaptations ]] MAL Club'; //If the title is found on the MALClub, display the confirmation whether or not the anime has adaptations found on the MALClub

            MyDramaListCheck.match('👍') !== null || MalClubText.match('👍') !== null ? IMDBAsianWiki = 'IMDB, AsianWiki' : IMDBAsianWiki = 'IMDB and AsianWiki'; //Change the IMDBAsianWiki variable depending on if mydramalist or the MAL club returned any results or not

            if (confirm('Franchise Title: ' + ChiakiFranchiseTitle + '\n\n' + MyDramaListCheck + '\n' + MalClubText + '\n\nDo you want to open ' + IMDBAsianWiki + MyDramaListText + ' to confirm that information and get more detailed info?')) { //Show the confirmation alert box text
              GM_openInTab("https://www.imdb.com/find?s=tt&q=" + ChiakiFranchiseTitle + "&ref_=nv_sr_sm"); //Open IMDB on a new tab
              GM_openInTab("https://asianwiki.com/index.php?title=Special%3ASearch&search=" + ChiakiFranchiseTitle); //Open AsianWiki on a new tab
              if (MyDramaListCheck.match('NOT') === null) { //If MyDramaList returned any results
                GM_openInTab("https://mydramalist.com/search?q=" + ChiakiFranchiseTitle + '&adv=titles&ty=68,77,83,86'); //Open MyDramaList on a new tab
              } //Open MyDramaList on a new tab only if any results were found on the website
            } //Finishes the if condition
          } //Finishes the if condition
          else { //If the anime doesn't have any entry type = TV
            alert("This Franchise doesn't even have any TV type entries, it's very likely that there are adaptations of any kind for this Franchise, so there's no need to search."); //Show a message to the user
          } //Finishes the else condition
        }); //Finishes the event listener

        findButton.setAttribute("title", "Search for Live-Actions/Doramas"); //Detects a mouse hover on the button and shows the text Find Live-Actions
        findButton.setAttribute("style", "cursor: pointer;margin-left: 15px;height: 10px;width: 10px;background-size: cover;display: inline-block;transform: scale(1.8);vertical-align: top;margin-top: 7px;"); //The CSS for the findButton
        findButton.style.backgroundImage = `url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/TEPmlyF.png' : 'https://i.imgur.com/2XQm3qI.png'})`; //The find button image

        function Append(element) { //Creates a new Append function
          document.querySelector(".title-english") === null ? document.querySelector("[itemprop*='name']").append(element) : document.querySelector(".title-english").previousElementSibling.parentNode.insertBefore(element, document.querySelector(".title-english").previousElementSibling); //Append depending on if the entry has an English title or not
        } //Finishes the Append function

        chiakiButton.addEventListener('mousedown', async function(e) { //Detects when the user middle clicks on the chiakiButton
          if (e.button === 1 && hasAnime !== undefined) //If the middle mouse button was clicked
          { //Starts the if condition
            e.preventDefault(); //Prevent the default middle button action from executing
            var IsBroadcast = false; //Check if the franchise should be watched using the broadcast order or not
            const response = await (await fetch('https://myanimelist.net/forum/?topicid=1890672')).text(); //Fetch
            const GuideIndexnewDocument = new DOMParser().parseFromString(response, 'text/html'); //Parses the fetch response
            const GuideIndexLinkElement = [...GuideIndexnewDocument.querySelectorAll('b')].find(el => el.innerText.includes('|' + entryid + '|')); //Gets the topic element that probably has the link of the Franchise and adds that to a variable

            const FinalArray = ChiakientryidSArray.filter(d => !GuideIndexnewDocument.querySelector(".body.clearfix").innerText.match(/(?<=\|\b)\d+/gi).includes(d)); //Get the ids that chiaki.site has and the Guide is missing
            const GuideMissingIds = document.createElement("div"); //Creates a div element
            GuideMissingIds.setAttribute("style", "font-size: 80%;display: none;"); //Set the CSS for the button
            FinalArray.forEach(function(entryid) { //For every anime id that the guide index is missing
              GuideMissingIds.innerHTML += GuideMissingIds.innerHTML = `<br><a href="https://myanimelist.net/anime/${entryid}">https://myanimelist.net/anime/${entryid}</a>`; //Add to the GuideMissingIds div a line break + the anime link with the link as text too
            }); //Finishes the foreach condition

            const condition = IsBroadcast === false && FinalArray.length !== 0 && FinalArray.length !== ChiakientryidSArray.length; //If the entry isn't broadcast and there's at least 1 missing id on the guide index, and if the guide index is not missing the same amount of total links that Chiaki has for the franchise
            const target = condition ? "_blank" : "_self"; //Open on a new tab or on the same tab depending on the condition

            if (GuideIndexLinkElement !== undefined) { //If the anime id was found on the guide index
              if (GuideIndexLinkElement.previousElementSibling.innerText.match('あ') !== null) { //If the anime name has the あ symbol in it on the guide index
                alert('Recommended watch order:\nBroadcast order.'); //Shows an alert
                IsBroadcast = true; //Check if the franchise should be watched using the broadcast order or not
                open("https://chiaki.site/?/tools/watch_order/id/" + entryid, target); //Opens the chiaki.site in a new tab
              } //Finishes the if condition
              else { //If the anime name doesn't have the あ symbol in it on the guide index
                alert('Recommended watch order:\nAEGC Guide Order.'); //Shows a text
                open(GuideIndexLinkElement.previousElementSibling.href, target); //Opens the GuideIndexLink in the a new tab
              } //Finishes the if condition
            } //Finishes the if condition
            else { //If the anime ID was NOT found on the guide index
              alert("Not found on the AEGC Club!\nOnly chiaki.site will be opened."); //Show a message
              open("https://chiaki.site/?/tools/watch_order/id/" + entryid, "_self"); //Open chiaki.site in a new tab
            } //Finishes the else condition

            if (condition) { //If the condition is met
              var LinksButton = document.createElement("button"); //Creates a button element
              LinksButton.innerHTML = 'Show AEGC Club Missing Links'; //Defines the element text
              LinksButton.setAttribute("style", "margin-left: 10px; background-color: red; color: white; font-weight: bold;"); //Set the CSS for the button
              LinksButton.onclick = function() { //Detects the mouse click on the Show Links Button
                if (GuideMissingIds.style.display === "none") { //If the Show missing links button is hidden
                  GuideMissingIds.style.display = ''; //Show the missing links button
                  LinksButton.innerHTML = 'Hide AEGC Club Missing Links'; //Defines the element text
                } else { //If the Show missing links button is being shown
                  GuideMissingIds.style.display = "none"; //Hide the missing links button
                  LinksButton.innerHTML = 'Show AEGC Club Missing Links'; //Defines the element text
                } //Finishes the else condition
              }; //Finishes the onclick event listener
              Append(LinksButton); //Display the button to show the IDs that chiaki.The site has, and the Guide is missing
              Append(GuideMissingIds); //Display the IDs that chiaki.site has and the Guide is missing
            } //Finishes the if condition

            if (GuideIndexLinkElement !== undefined && FinalArray.length === ChiakientryidSArray.length - 1) { //If the anime id was found on the guide index and the missing links are equal to all of the chiaki.site total links -1
              LinksButton.remove(); //Remove the button that shows the missing links
              const TwoFranchises = document.createElement("a"); //Creates an a element
              TwoFranchises.innerHTML = "<br>It seems that this entry is related to 2 Anime Franchises.<br>Both chiaki.site and the AEGC Club will be opened."; //Defines the element text
              TwoFranchises.setAttribute("style", "font-size: 80%;text-decoration: none;"); //Set the CSS for the button
              Append(TwoFranchises); //Append the NotFoundMessage close to the title element

              open("https://chiaki.site/?/tools/watch_order/id/" + entryid, "_self"); //Opens chiaki.site in the same tab to show all the related anime entries on MAL on the correct watch order for the anime franchise and specifies that chiaki.site should be opened on a new tab
            } //Finishes the if condition

            if (GuideIndexnewDocument.querySelector(".body.clearfix").innerText.match(new RegExp('(?:\\|' + entryid + '\\|)', 'gi')).length > 1) { //If 2 identical anime ids were found on the guide index
              const OtherFranchiseMessage = document.createElement("a"); //Creates an a element
              OtherFranchiseMessage.innerHTML = "<br>According to the AEGC club, this entry also has another related entry that chiaki.site considered as being from another franchise."; //Defines the element text
              OtherFranchiseMessage.setAttribute("style", "font-size: 80%;text-decoration: none;"); //Set the CSS for the button
              Append(OtherFranchiseMessage); //Append the OtherFranchiseMessage close to the title element
            } //Finishes the if condition
          } //Finishes the if condition
        }); //Finishes the mousedown event listener

        chiakiButton.addEventListener("click", () => { //Detect the mouse click
          open(hasAnime !== undefined ? "https://chiaki.site/?/tools/watch_order/id/" + entryid : "https://relatedanime.com/manga/" + entryid, "_self"); //Opens chiaki.site in the same tab to show all the related anime entries on MAL on the correct watch order for the anime franchise and specifies that chiaki.site should be opened on a new tab
        }); //Finishes the addEventListener click

        chiakiButton.addEventListener("contextmenu", (e) => { //Detect a mouse click
          open(hasAnime !== undefined ? "https://relatedanime.com/anime/" + entryid : "https://relatedanime.com/manga/" + entryid, "_self"); //Open relatedanime.com in the same tab to show all the related anime entries on MAL on the correct watch order for the anime franchise, including reading material
          e.preventDefault(); //Don't show the right-click default context menu
        }); //Detect the mouse right click

        chiakiButton.setAttribute("style", "cursor: pointer;margin-left: 15px;height: 10px;width: 10px;background-size: cover;display: inline-block;transform: scale(1.8);vertical-align: top;margin-top: 7px;"); //The CSS for the chiakiButton

        chiakiButton.setAttribute("title", hasAnime !== undefined ? "Click to see all related anime entries only on the Broadcast Watch Order\nMiddle Click to see all related anime entries only on the Broadcast/Chronological Watch Order\nRight Click to see all related entries on the Broadcast Watch Order. (Including reading material)" : "This franchise has no anime adaptations!\nClick to open relatedanime.com to show all related entries on the Broadcast Watch Order. (Including reading material)"); //Detects a mouse hover on the button and shows some text info

        chiakiButton.style.backgroundImage = `url(${hasAnime !== undefined ? 'https://i.imgur.com/i635kBp.png' : 'https://i.imgur.com/7tUhvqf.png'})`; //The chiaki.site/relatedanime.com button favicon
        Append(copyButton); //Append the button next to the title element
        Append(findButton); //Append the button next to the title element
        Append(chiakiButton); //Append the button next to the title element
      } //Finishes the else condition
    } //Finishes the Prog function
  } //Finishes the if condition
  Prog(); //Run the program
  window.addEventListener('focus', () => { Prog(); }, { once: true }); //Run the program when the tab gets focus
})(); //Finishes the whole function