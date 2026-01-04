// ==UserScript==
// @name        Openings/Endings Enhancer - MAL
// @namespace   Search_Ops_Ends
// @version     26
// @description Click on the Play button to watch and listen the FULL OP/END directly on MAL! Click on the OP/END music number to search for the music title on youtube on a new tab.
// @author      hacker09
// @include     /^https:\/\/myanimelist\.net\/anime(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime)?$/
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/427466/OpeningsEndings%20Enhancer%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/427466/OpeningsEndings%20Enhancer%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var AllSongs; //Create a global variable

  if (document.querySelectorAll('span[class*="theme-song-index"]').length !== 0) //If there's at least one op/end NUMBER listed on the page
  { //Starts the if condition
    AllSongs = document.querySelectorAll('span[class*="theme-song-index"]'); //Change the AllSongs variable element
    console.log("AllSongs = " + document.querySelectorAll('span[class*=\"theme-song-index\"]')); //Shows a message in the console log for dev purposes
  } //Finishes the if condition
  else //If there are op/end play preview buttons listed on the page
  { //Starts the else condition
    AllSongs = document.querySelectorAll('.oped-preview-button'); //Change the AllSongs variable element
    console.log("AllSongs = " + document.querySelectorAll('.oped-preview-button')); //Shows a message in the console log for dev purposes
  } //Finishes the else condition

  if (AllSongs.length !== 0) //If there's at least one op/end listed on the page
  { //Starts the if condition
    var TimesExecuted = 0; //Creates a new variable

    window.onscroll = async function() { //Creates a new function to run when the page is scrolled
      TimesExecuted += 1; //Sum the amount of times that the page is scrolled
      if (TimesExecuted === 1) { //On the first time that the page is scrolled

        document.querySelectorAll("div.oped-video-button").forEach(a => a.parentNode.remove()); //Remove all video buttons
        document.querySelectorAll('div[class*="oped-preview-button"]').forEach(a => a.parentNode.style.display = 'none'); //Remove all video buttons

        const MoeID = await (await fetch('https://api.animethemes.moe/resource?filter[external_id]=' + location.pathname.split('/')[2] + '&filter[site]=myanimelist&include=anime')).json(); //Get the anime id on themes.moe

        const Data = await (await fetch('https://api.animethemes.moe/anime?filter[anime][id]=' + MoeID.resources[0].anime[0].id + '&include=animethemes.animethemeentries.videos,animethemes.song.artists')).json(); //Get the videos from theme.moe

        function OnClick(el, link) { //Creates a new function
          if (document.querySelector("video").style.display === 'none') { //If the video is hidden
            document.querySelector("video").src = link; //Add the video source url to the video
            el.src = "https://i.imgur.com/p66Ij4i.png"; //Change the btn to pause
            document.querySelector("video").style.display = ''; //Show the video
          } else { //If the video is being shown
            document.querySelector("video").src = ''; //Remove the video source url of the video
            el.src = "https://i.imgur.com/4qHDObk.png"; //Change the btn to play
            document.querySelector("video").style.display = 'none'; //Hides the video
          } //Finishes the else condition
        } //Finishes the onclick function

        document.querySelectorAll('div.di-t')[1].insertAdjacentHTML('afterEnd', `<video width="800" height="400" style="display:none;" controls autoplay></video>`); //Add the video on the page

        var MostElems = AllSongs; //Suppose that MAL has more ops/ends listed than the API and save MAL ops/ends to a variable

        if (Data.anime[0].animethemes.length > MostElems.length) { //Check if MAL really has more ops/ends listed than the API
          MostElems = Data.anime[0].animethemes; //Change the variable with the amount of videos in the API
          console.log('MostElems = ' + Data.anime[0].animetheme); //Shows a message in the console log for dev purposes
        } //Finishes the if condition

        var j = 0; //Create a new counter variable to correctly count the total amount of index Number and play buttons

        function AddBtn(APIindex, Spanindex) { //Creates a new function to add the play btn
          AllSongs[Spanindex].parentNode.parentNode.insertAdjacentHTML('beforeend', `<img id="PlayPause" title="${Data.anime[0].animethemes[APIindex].song.title}" src="https://i.imgur.com/4qHDObk.png" style="cursor:pointer; margin-left: 5px;" />`); //Add the play btn in front of the OP/END
          document.querySelectorAll("#PlayPause")[APIindex].onclick = function(e) { //When the play/pause img is clicked
            e.preventDefault(); //Stop YT from being opened
            e.stopPropagation(); //Stop YT from being opened
            OnClick(this, Data.anime[0].animethemes[APIindex].animethemeentries[0].videos[0].link.replace('api.', '')); //Call the OnClick function
          }; //Run the OnClick function on every play/pause btn when clicked
          j += 1; //Add +1 to the variable that holds the total amount of theme index Number and play buttons
        } //Finishes the function AddBtn

        MostElems.forEach(function(video, i) { //forEach video links in the API or forEach listed op/end on MAL

          if (AllSongs.length > i) //If the current looped video number isn't greater than the amount of ops/ends on MAL
          { //Starts the if condition

            if (Data.anime[0].animethemes.length > j && Data.anime[0].animethemes[j].type === 'OP' && AllSongs[i].parentNode.parentNode.parentNode.parentNode.parentNode.className.match('opnening') !== null) //If the current looped video number is an OP and the current video is an OP
            { //Starts the if condition
              AddBtn(j, i); //Add the play button
            } //Finishes the if condition
            if (Data.anime[0].animethemes.length > j && Data.anime[0].animethemes[j].type === 'ED' && AllSongs[i].parentNode.parentNode.parentNode.parentNode.parentNode.className.match('ending') !== null) //If the current looped video number is an END and the current video is an END
            { //Starts the if condition
              AddBtn(j, i); //Add the play button
            } //Finishes the if condition
          } //Finishes the if condition
          else //If the API has more Videos than MAL (Alternative Videos)
          { //Starts the else condition

            if (document.body.innerText.search("Alternative Themes") === -1) //If the header wasn't already added
            { //Starts the if condition
              document.querySelectorAll(".theme-songs")[1].insertAdjacentHTML('afterEnd', `<h2 id='AltThemes'>Alternative Themes</h2>`); //Add a header
            } //Finishes the if condition

            document.querySelector("#AltThemes").insertAdjacentHTML('afterEnd', `<span class='theme-song'>` + video.song.title + `<img id="PlayPause" src="https://i.imgur.com/4qHDObk.png" style="cursor:pointer; margin-left: 5px;" /></span><br>`); //Add the play btn in front of the OP/END
            document.querySelectorAll("#PlayPause")[j].onclick = function(e) { //When the play/pause img is clicked
              e.preventDefault(); //Stop YT from being opened
              e.stopPropagation(); //Stop YT from being opened
              OnClick(this, video.animethemeentries[0].videos[0].link.replace('api.', '')); //Call the OnClick function
            }; //Run the OnClick function on every play/pause btn when clicked
          } // //Finishes the else condition
        }); //Finishes the foreach function

        AllSongs.forEach(function(el) { //For each op/end
          var title = el.parentNode.parentNode.innerText.split(': '); //Save the op/end title on a variable

          if (title[1] !== undefined) //If there's a number: in front of the op/end title
          { //Starts the if condition
            title = title[1].split('(ep')[0].trim(); //Save the op/end title on a variable
          } //Finishes the if condition
          else //If there's no number: in front of the op/end title
          { //Starts the else condition
            title = title[0].split('(ep')[0].trim(); //Save the op/end title on a variable
          } //Finishes the else condition

          el.style.cursor = 'pointer'; //Make the op/end title element look like it's clickable

          el.onclick = function() //When the op/end title is clicked
          { //Starts the onclick function
            window.open('https://www.youtube.com/results?search_query=' + title, 'blank'); //Search the music title on youtube on a new tab
          }; //Finishes the onclick function

          el.onmouseout = function() //When the op/end title is unhovered
          { //Starts the onmouseout function
            this.style.color = ''; //Readd the default color
          }; //Finishes the onmouseout function

          el.onmouseover = function() //When the op/end title is hovered
          { //Starts the onmouseover function
            this.style.color = '#6386d5'; //Change the default text color to blue
          }; //Finishes the onmouseover function

        }); //Finishes the for each condition
      } //Finishes the if condition
    }; //Finishes the onscroll event listener
  } //Finishes the if condition
})();