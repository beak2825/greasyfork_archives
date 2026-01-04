// ==UserScript==
// @name         Better Buttons To Edit Anime/Manga Information
// @namespace    Better Buttons To Edit Anime Information
// @version      14
// @description  The script removes the actual "Edit Anime/Manga Information" drop down menu, and replaces that with Better Buttons To edit the Anime/Manga information.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/((anime|manga)(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407729/Better%20Buttons%20To%20Edit%20AnimeManga%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/407729/Better%20Buttons%20To%20Edit%20AnimeManga%20Information.meta.js
// ==/UserScript==

(async function() {
  var MarginLeft = -7; //Creates a new variable
  const $ = window.jQuery; //Defines That The Symbol $ Is A jQuery
  const id = location.pathname.match(/\d+/)[0]; //Get the entry id
  var type, remove, sourceortype, airingdatesorpubdates, ratingorchapvol; //Create new variables
  const CSSPart = 'height: 10px; width: 10px; background-size: cover; display: inline-block; transform: scale(1.8); vertical-align: top; margin-top: -10px;'; //Store parts of the CSS codes

  location.pathname.split('/')[1] === 'anime' ? (type = 'aid', remove = 'anime', sourceortype = 'source', airingdatesorpubdates = 'airingdates', ratingorchapvol = 'rating') : (type = 'mid', remove = 'manga', sourceortype = 'type', airingdatesorpubdates = 'pubdates', ratingorchapvol = 'chapvol'); //Set up the variables

  document.getElementsByClassName('js-' + remove + '-edit-info-button')[0].remove(); //Remove the default Edit Anime/Manga Information Button

  const BroadCastButton = '<a href="/dbchanges.php?aid=' + id + '&t=broadcast" target="_blank" title="Edit Anime BroadCast" class="BetterBTN" id="BroadCastButton" style="margin-left: 420px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/Qtr7ckM.png' : 'https://i.imgur.com/1TA8f0M.png'});"></a>`; //Create a BTN const
  const ProducersButton = '<a href="/dbchanges.php?aid=' + id + '&t=producers" target="_blank" title="Edit Anime Producers" class="BetterBTN" id="ProducersButton" style="margin-left: 400px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/tncXsk9.png' : 'https://i.imgur.com/X8b0lhp.png'});"></a>`; //Create a BTN const
  const RatingButton = '<a href="/dbchanges.php?' + type + "=" + id + "&t=" + ratingorchapvol + '" target="_blank" title="Edit Anime Rating" class="BetterBTN" id="RatingButton" style="margin-left: 380px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/Kf803n2.png' : 'https://i.imgur.com/ouIcJ0L.png'});"></a>`; //Create a BTN const
  const RelationsButton = '<a href="/dbchanges.php?' + type + "=" + id + '&t=relations" target="_blank" title="Edit Anime Relations" class="BetterBTN" id="RelationsButton" style="margin-left: 357px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/ErLd0nD.png' : 'https://i.imgur.com/7tWTGSx.png'});"></a>`; //Create a BTN const
  const SourceButton = '<a href="/dbchanges.php?' + type + "=" + id + "&t=" + sourceortype + '" target="_blank" title="Edit Anime Source" class="BetterBTN" id="SourceButton" style="margin-left: 335px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/Ha6bhYe.png' : 'https://i.imgur.com/wv414uC.png'});"></a>`; //Create a BTN const
  const AiringDatesButton = '<a href="/dbchanges.php?' + type + "=" + id + "&t=" + airingdatesorpubdates + '" target="_blank" title="Edit Anime Airing Dates" class="BetterBTN" id="AiringDatesButton" style="margin-left: 313px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/8KJdVd9.png' : 'https://i.imgur.com/9j8Jkyc.png'});"></a>`; //Create a BTN const
  const BackgroundButton = '<a href= "/dbchanges.php?' + type + "=" + id + '&t=background" target="_blank" title="Edit Anime Background" class="BetterBTN" id="BackgroundButton" style="margin-left: 290px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/TA49IXP.png' : 'https://i.imgur.com/nglIeUs.png'});"></a>`; //Create a BTN const
  const AlternativeTitlesButton = '<a href="/dbchanges.php?' + type + "=" + id + '&t=alternative_titles" target="_blank" title="Edit Anime Alternative Titles" class="BetterBTN" id="AlternativeTitlesButton" style="margin-left: 270px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/dKTM3vZ.png' : 'https://i.imgur.com/YDcRsLh.png'});"></a>`; //Create a BTN const
  const SynopsisButton = '<a href="/dbchanges.php?' + type + "=" + id + '&t=synopsis" target="_blank" title="Edit Anime Synopsis" class="BetterBTN" id="SynopsisButton" style="margin-left: 250px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/JnL17QZ.png' : 'https://i.imgur.com/G41CHJZ.png'});"></a>`; //Create a BTN const
  const PictureButton = '<a href="/dbchanges.php?' + type + "=" + id + '&t=pic" target="_blank" title="Edit Anime Picture" class="BetterBTN" id="PictureButton" style="margin-left: 228px; ' + CSSPart + ` background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/dorhKZG.png' : 'https://i.imgur.com/fzxCO0C.png'});"></a>`; //Create a BTN const
  const DurationButton = '<a href="/dbchanges.php?aid=' + id + '&t=duration" target="_blank" title="Edit Anime Duration" class="BetterBTN" id="DurationButton" style="margin-left: 205px; ' + CSSPart + ` margin-top: -9px; background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/s0bc70x.png' : 'https://i.imgur.com/U9qigWi.png'});"></a>`; //Create a BTN const

  const Infoh2Elem = [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("h2")].find(info => info.outerHTML.includes("Information")); //Save the information div element
  Infoh2Elem.insertAdjacentHTML("afterbegin", '<br>'); //Add a space before the Information h2 header

  const BTNsArray = [BroadCastButton, ProducersButton, RatingButton, RelationsButton, SourceButton, AiringDatesButton, BackgroundButton, AlternativeTitlesButton, SynopsisButton, PictureButton, DurationButton]; //Creates an array of BTNs
  BTNsArray.forEach(function(BTNs) { //ForEach button in the array
    document.querySelector('.header-right').parentElement.insertAdjacentHTML("beforeend", BTNs); //Add the BTNs on the page
    Infoh2Elem.insertAdjacentHTML("afterbegin", BTNs); //Add the BTNs on the page
  }); //Finishes the ForEach function

  if (type === 'mid') //If the user is on a manga entry
  { //Starts the if condition
    MarginLeft = 5; //Centralize the icons
    document.querySelectorAll("#SourceButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Type")); //Change txt on mouse hover
    document.querySelectorAll("#PictureButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Picture")); //Change txt on mouse hover
    document.querySelectorAll("#SynopsisButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Synopsis")); //Change txt on mouse hover
    document.querySelectorAll("#RelationsButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Relations")); //Change txt on mouse hover
    document.querySelectorAll("#BackgroundButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Background")); //Change txt on mouse hover
    document.querySelectorAll("#AiringDatesButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Publishing Dates")); //Change txt on mouse hover
    document.querySelectorAll("#RatingButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Chapters/Volumes")); //Change txt on mouse hover
    document.querySelectorAll("#RatingButton").forEach(BTN => BTN.style.backgroundImage = `url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/UoGgWiw.png' : 'https://i.imgur.com/py5QNtd.png'}`); //Change rating BTN IMG
    document.querySelectorAll("#AlternativeTitlesButton").forEach(BTN => BTN.setAttribute("title", "Edit Manga Alternative Titles")); //Change txt on mouse hover
    document.querySelectorAll("#BroadCastButton,#ProducersButton,#DurationButton").forEach(BTN => BTN.setAttribute("style", "display: none !important;")); //Hide BTNs
  } //Finishes the if condition

  document.querySelectorAll(".BetterBTN").forEach(function(BTNs, i) { //ForEach Information BTNs
    if (i > 10) { //Only for the Information BTNs
      BTNs.style.marginLeft = MarginLeft + 'px'; //Gradualy increase the left margin
      BTNs.style.display = 'block'; //Change the display mode
      MarginLeft += 22; //Increase the left margin
    } //Finishes the if condition
  }); //Finishes the ForEach loop

  function Format(el, href) { //Creates a function to add the link elements
    if ($(el).length > 0) { //If the element exists
      if ($(el).parent().html().match(/span>\s+?None\sfound,/)) //If the element is none found
      { //Starts the if condition
        $(el).parent().html($(el).parent().html().replace(/span>\s+?None\sfound,[\s\S]+?$/, 'span> Unknown')); //Add a none found span element
      } //Finishes the if condition
      var text = $('span', $(el).parent()).first().text().replace(/:$/, ''); //Save the element text to an array
      $(el).empty().append(`<a href="${href}" target="_blank">${text}</a>`).append(':'); //Add a link to the element and the text for the element
    } //Finishes the if condition
  } //Finishes the Format function

  if ($('#addtolist ~ h2:contains(Alternative Titles)').length > 0) { //If the Alternative Titles element exists
    $('#addtolist ~ h2:contains(Alternative Titles)').prepend('<a href="/dbchanges.php?' + location.href.split('/')[3] + 'id=' + id + '&t=alternative_titles" class="floatRightHeader" target="_blank">Edit</a>'); //Add an edit button next to it
  } //Finishes the if condition
  if (type === 'aid') { //If the entry is an anime
    Format('span.dark_text:contains(Aired:)', '/dbchanges.php?aid=' + id + '&t=airingdates'); //Call the Format function
    Format('span.dark_text:contains(Broadcast:)', '/dbchanges.php?aid=' + id + '&t=broadcast'); //Call the Format function
    Format('span.dark_text:contains(Producers:)', '/dbchanges.php?aid=' + id + '&t=producers'); //Call the Format function
    Format('span.dark_text:contains(Licensors:)', '/dbchanges.php?aid=' + id + '&t=producers'); //Call the Format function
    Format('span.dark_text:contains(Studios:)', '/dbchanges.php?aid=' + id + '&t=producers'); //Call the Format function
    Format('span.dark_text:contains(Source:)', '/dbchanges.php?aid=' + id + '&t=source'); //Call the Format function
    Format('span.dark_text:contains(Duration:)', '/dbchanges.php?aid=' + id + '&t=duration'); //Call the Format function
    Format('span.dark_text:contains(Rating:)', '/dbchanges.php?aid=' + id + '&t=rating'); //Call the Format function
  } else { //If the entry is manga
    Format('span.dark_text:contains(Type:)', '/dbchanges.php?mid=' + id + '&t=type'); //Call the Format function
    Format('span.dark_text:contains(Volumes:)', '/dbchanges.php?mid=' + id + '&t=chapvol'); //Call the Format function
    Format('span.dark_text:contains(Chapters:)', '/dbchanges.php?mid=' + id + '&t=chapvol'); //Call the Format function
    Format('span.dark_text:contains(Published:)', '/dbchanges.php?mid=' + id + '&t=pubdates'); //Call the Format function
  } //Finishes the else condition
})();