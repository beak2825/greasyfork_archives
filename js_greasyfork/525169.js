// ==UserScript==
// @name        New script s
// @namespace   Violentmonkey Scripts
// @match       *://sploop.io/*
// @grant       none
// @version     1.0
// @author      -
// @license     mit
// @description I am vague to give it a name and are grinder the text below
// @description 27/1/2025, 17:31:27
// @downloadURL https://update.greasyfork.org/scripts/525169/New%20script%20s.user.js
// @updateURL https://update.greasyfork.org/scripts/525169/New%20script%20s.meta.js
// ==/UserScript==

// Insert the music player container into the body of the page
const container = document.createElement('div');
container.id = 'musicContainer';
container.style = `
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 10px;
  z-index: 10000;
  color: white;
  font-family: Arial, sans-serif;
  font-size: 14px;
  max-width: 200px;
`;
document.body.appendChild(container);

// Create a title
const title = document.createElement('h3');
title.textContent = 'Music Player';
title.style = 'margin: 0 0 10px 0; text-align: center;';
container.appendChild(title);

// Create a select dropdown for songs
const select = document.createElement('select');
select.id = 'songSelect';
select.style = 'width: 100%; margin-bottom: 10px;';
container.appendChild(select);

// Add songs to the select dropdown (only with "Song {number}")
const songs = [
  { id: 'r_1LUSn25J4', name: 'Song 1', lyrics: 'Hello, is it me you\'re looking for?' },
  { id: '1_t2pQqkmtg', name: 'Song 2', lyrics: 'I see you driving ’round town with the girl I love' },
  { id: 'anLOn1B-6Ns', name: 'Song 3', lyrics: 'First things first, I\'ll say all the words inside my head' },
  { id: 'qlzcHe_gusE', name: 'Song 4', lyrics: 'Shoes on, get up in the morn’ cup of milk, let’s rock and roll' },
  { id: 'Inf4tDEgyYw', name: 'Song 5', lyrics: 'I want it, I got it' },
  { id: 'J_Jt3VOVpoI', name: 'Song 6', lyrics: 'The club isn’t the best place to find a lover' },
  { id: 'OVh0bMNSFss', name: 'Song 7', lyrics: 'I got my peaches out in Georgia (Oh yeah, s**t)' },
  { id: 'riqwrGoklj8', name: 'Song 8', lyrics: 'Baby girl, I’ll be your man' },
  { id: 'w-sQRS-Lc9k', name: 'Song 9', lyrics: 'I’m not fazed, only here to sin' },
  { id: 'ELCVwv1T-aE', name: 'Song 10', lyrics: 'White shirt now red, my bloody nose' },
  { id: 'z9nHtotESH4', name: 'Song 11', lyrics: 'Seasons change and our love went cold' },
  { id: 'R_BFdeFtWC8', name: 'Song 12', lyrics: 'Astro, yeah, Sun is down, freezin’ cold' },
  { id: 'kvHvxKHYMBA', name: 'Song 13', lyrics: 'I got the eye of the tiger, a fighter' },
  { id: '9Zj0JOHJR-s', name: 'Song 14', lyrics: 'I found a love, to carry more than just my secrets' },
  { id: 'Qx2gvHjNhQ0', name: 'Song 15', lyrics: 'I love it when you call me señorita' },
  { id: 'n8X9_MgEdCg', name: 'Song 16', lyrics: 'So baby, pull me closer in the backseat of your Rover' },
  { id: '9bZkp7q19f0', name: 'Song 17', lyrics: 'Oppa Gangnam Style!' },
  { id: 'uZQNC3awICU', name: 'Song 18', lyrics: 'When I’m without you so insecure' },
  { id: 'ih2xubMaZWI', name: 'Song 19', lyrics: 'Lately I’ve been, I’ve been losing sleep' },
  { id: 'oC-GflRB0y4', name: 'Song 20', lyrics: 'And the players gonna play, play, play, play, play' },
  { id: 'bPs0xFd4skY', name: 'Song 21', lyrics: 'Found you when your heart was broke' },
  { id: 'wJnBTPUQS5A', name: 'Song 22', lyrics: 'Thank you, next' },
  { id: 'HIza2rY23Tk', name: 'Song 23', lyrics: 'I’m gonna live like tomorrow doesn’t exist' },
  { id: '8vJiSSAMNWw', name: 'Song 24', lyrics: 'I want your love and I want your revenge' }
];

songs.forEach((song) => {
  const option = document.createElement('option');
  option.value = song.id;
  option.textContent = song.name;
  select.appendChild(option);
});

// Control buttons
const playButton = document.createElement('button');
playButton.textContent = '▶️ Play';
playButton.style = 'width: 48%; margin-right: 2%;';
container.appendChild(playButton);

const stopButton = document.createElement('button');
stopButton.textContent = '⏹️ Stop';
stopButton.style = 'width: 48%;';
container.appendChild(stopButton);

// Player container (hidden)
const playerContainer = document.createElement('div');
playerContainer.id = 'musicPlayer';
playerContainer.style = 'display: none;';
container.appendChild(playerContainer);

// Create subtitle container (floating at the center of the screen)
const subtitlesContainer = document.createElement('div');
subtitlesContainer.id = 'subtitles';
subtitlesContainer.style = `
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
  z-index: 10001;
  display: none;
`;
document.body.appendChild(subtitlesContainer);

// Load YouTube API
const script = document.createElement('script');
script.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(script);

// Global variable for the player
let player;

// Initialize the player when the API is ready
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('musicPlayer', {
    height: '0',
    width: '0',
    videoId: '',
    events: {
      onReady: () => console.log('YouTube Player Ready'),
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          playButton.textContent = '▶️ Play';
          subtitlesContainer.style.display = 'none'; // Hide subtitles when finished
        }
      }
    }
  });
};

// Play button functionality
playButton.addEventListener('click', () => {
  const selectedSongId = select.value;
  const song = songs.find(song => song.id === selectedSongId);

  if (player && selectedSongId) {
    player.loadVideoById(selectedSongId);
    player.playVideo();
    playButton.textContent = '⏸️ Pause';

    // Show subtitles during playback
    subtitlesContainer.style.display = 'block';
    displayLyrics(song.lyrics);
  }
});

// Function to display lyrics word by word
function displayLyrics(lyrics) {
  let words = lyrics.split(' ');
  let index = 0;

  // Clear previous subtitles
  subtitlesContainer.textContent = '';

  // Update subtitle every 1 second
  let interval = setInterval(() => {
    if (index < words.length) {
      subtitlesContainer.textContent += words[index] + ' ';
      index++;
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

// Stop button functionality
stopButton.addEventListener('click', () => {
  if (player) {
    player.stopVideo();
    playButton.textContent = '▶️ Play';
    subtitlesContainer.style.display = 'none'; // Hide subtitles when stopped
  }
});
