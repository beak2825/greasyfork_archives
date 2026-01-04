// ==UserScript==
// @name        Keep the tracklist in plaintext
// @namespace   Violentmonkey Scripts
// @match       https://rateyourmusic.com/release/*
// @grant       none
// @version     1.2
// @author      AnotherBubblebath
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @license     MIT
// @description Gives a button that allows you to remove the link to songs in the tracklist in favor of plaintext.
// @downloadURL https://update.greasyfork.org/scripts/546981/Keep%20the%20tracklist%20in%20plaintext.user.js
// @updateURL https://update.greasyfork.org/scripts/546981/Keep%20the%20tracklist%20in%20plaintext.meta.js
// ==/UserScript==

if (document.querySelectorAll('#my_track_ratings > #track_ratings > .track') && document.querySelectorAll('.tracklist_title > a').length > 0 && document.querySelectorAll('#my_track_ratings > #track_ratings > .track').length > 0){
  const checkboxForTracklist = document.createElement('input');
  checkboxForTracklist.type = 'checkbox';
  checkboxForTracklist.setAttribute('id', 'tracklistCheckbox');

  const label = document.createElement('label');
  label.innerText = 'Disable Tracklist Links: ';
  label.setAttribute('for', 'tracklistCheckbox');
  label.style.color = '#a8aeba'
  const labelMobile = label.cloneNode(true);

  //For later use when it comes to unlinkTracklist() and linkTracklist()
  var tracksTracklist = document.querySelectorAll('.hide-for-small .track');
  var tracksTrackListMobile = document.querySelectorAll('#tracks_mobile > .track');
  var tracksRating = document.querySelectorAll('#my_track_ratings > #track_ratings > .track');

  //1.2 update: catches the issue where it wont unlink the last track if there's no time on the release.
  var tracklistLength = tracksTracklist.length;
  if (document.querySelectorAll('.tracklist_total').length > 0){
    tracklistLength--;
  }

  //Gets the tracklist hrefs if checkbox is unchecked.
  var tracklistLinks = [''];
  for (let i = 0; i < document.querySelectorAll('#my_track_ratings > #track_ratings > .track').length; i++){
      tracklistLinks[i] = document.querySelectorAll('#my_track_ratings > #track_ratings > .track')[i].querySelector('.song').getAttribute('href');
  }

  if (localStorage.getItem('tracklistLinkEnable') != null){ //Sets the state of the Checkbox;
    if (localStorage.getItem('tracklistLinkEnable') == 'true'){
      checkboxForTracklist.checked = true;
      unlinkTracklist();
    }
    else if (localStorage.getItem('tracklistLinkEnable') == 'false'){
      checkboxForTracklist.checked = false;
    }
    else{
      console.log('an erorr has occured');
    }
  }
  else{ //Adds item to the local storage if it doesn't exist.
    localStorage.setItem('tracklistLinkEnable', 'false');
    checkboxForTracklist.checked = false;
  }

  //Appending both buttons to their respective labels
  label.appendChild(checkboxForTracklist);
  const checkboxForTracklistMobile = checkboxForTracklist.cloneNode(true);

  //This is to change the attributes for labelMobile since it is looking at the PC label, not the mobiel label.
  checkboxForTracklistMobile.setAttribute('id', 'tracklistCheckboxMobile');
  labelMobile.setAttribute('for', 'tracklistCheckboxMobile');
  labelMobile.appendChild(checkboxForTracklistMobile)

  //Gives the event listeners to both checklists.
  setCheckboxEventListener(checkboxForTracklist);
  setCheckboxEventListener(checkboxForTracklistMobile);

  //Append the labels to the right places
  document.querySelector('.hide-for-small > .section_tracklisting > .release_page_header').after(label);
  document.querySelector('.show-for-small > .section_tracklisting > .release_page_header').after(labelMobile);
}

function setCheckboxEventListener(checkbox){
  checkbox.addEventListener('change', function (event) { //Detects whenever the checkbox is checked or not.
    if (checkbox.checked == true){
      localStorage.setItem('tracklistLinkEnable', 'true')
      unlinkTracklist();
    }
    else {
      localStorage.setItem('tracklistLinkEnable', 'false')
      linkTracklist();
    }
  });
}

function unlinkTracklist(){
  for (let i = 0; i < tracklistLength; i++){
    let songs = tracksTracklist[i].querySelectorAll('.song');
    let songsMobile = tracksTracklist[i].querySelectorAll('.song');
    for (let j = 0; j < songs.length; j++){
      songs[j].style.pointerEvents = 'none';
      songsMobile[j].style.pointerEvents = 'none';
      songs[j].removeAttribute('href');
      songsMobile[j].removeAttribute('href');
      songs[j].style.color = '#dbe0e9';
      songsMobile[j].style.color = '#dbe0e9';
    }
  }
  for (let i = 0; i < tracksRating.length; i++){
    if (tracksRating[i].querySelector('.song')){
      tracksRating[i].querySelector('.song').style.pointerEvents = 'none';
      tracksRating[i].querySelector('.song').removeAttribute('href');
      tracksRating[i].querySelector('.song').style.color = '#dbe0e9';
    }
  }
}

function linkTracklist(){
  for (let i = 0; i < tracklistLength; i++){
    let songs = tracksTracklist[i].querySelectorAll('.song');
    let songsMobile = tracksTracklist[i].querySelectorAll('.song');
    for (let j = 0; j < songs.length; j++){
      songs[j].style.pointerEvents = 'auto';
      songsMobile[j].style.pointerEvents = 'auto';
      songs[j].setAttribute('href', tracklistLinks[i]);
      songsMobile[j].setAttribute('href', tracklistLinks[i]);
      songs[j].style.color = '#84c5fb';
      songsMobile[j].style.color = '#84c5fb';
    }
  }
  for (let i = 0; i < tracksRating.length; i++){
    if (tracksRating[i].querySelector('.song')){
      tracksRating[i].querySelector('.song').style.pointerEvents = 'auto';
      tracksTracklist[i].querySelector('.song').setAttribute('href', tracklistLinks[i]);
      tracksRating[i].querySelector('.song').style.color = '#84c5fb';
    }
  }
}