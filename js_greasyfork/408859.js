// ==UserScript==
// @name           Beatport Open Key Display Addon
// @namespace      local
// @description    Appends the corresponding OpenKey Easymix code to the music key text in Beatport's now playing waveform display
// @author         Michael Newton
// @include        https://www.beatport.com/*
// @version 0.0.1.20210914023431
// @downloadURL https://update.greasyfork.org/scripts/408859/Beatport%20Open%20Key%20Display%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/408859/Beatport%20Open%20Key%20Display%20Addon.meta.js
// ==/UserScript==

// Rewrite a Beatport Top 100 page -- add key/bpm column -- works in Chrome / Firefox

// prettier-ignore
beatportKeyToCamelotKey = {
    'G♯ min': '6m',    'A♭ min':  '6m',    'B maj':  '6d',
    'D♯ min': '7m',    'E♭ min':  '7m',    'F♯ maj': '7d',     'G♭ maj':  '7d',
    'A♯ min': '8m',    'B♭ min':  '8m',    'C♯ maj': '8d',     'D♭ maj':  '8d',
    'F min':  '9m',                        'G♯ maj': '9d',     'A♭ maj':  '9d',
    'C min':  '10m',                       'D♯ maj': '10d',    'E♭ maj':  '10d',
    'G min':  '11m',                       'A♯ maj': '11d',    'B♭ maj':  '11d',
    'D min':  '12m',                       'F maj':  '12d',
    'A min':  '1m',                        'C maj':  '1d',
    'E min':  '2m',                        'G maj':  '2d',
    'B min':  '3m',                        'D maj':  '3d',
    'F♯ min': '4m',    'G♭ min': '4m',     'A maj':  '4d',
    'C♯ min': '5m',    'D♭ min': '5m',     'E maj':  '5d'
};
// prettier-ignore
document.head.insertAdjacentHTML('beforeend', [
        '<style>',
        '.buk-track-labels div { display: inline-block; width: 3em; }',
        '.buk-track-labels div:last-child { text-align: right; }',
        'li .buk-track-key div, li .buk-track-bpm { color: #fff; font: 600 1.177em/1.05 SourceSans; }',
        '.key1m, .key1d {color: #FE40EA !important;}',
        '.key2m, .key2d {color: #A35FF0 !important;}',
        '.key3m, .key3d {color: #3E89FA !important;}',
        '.key4m, .key4d {color: #00C6FA !important;}',
        '.key5m, .key5d {color: #00E7E7 !important;}',
        '.key6m, .key6d {color: #00D58F !important;}',
        '.key7m, .key7d {color: #3DEF3D !important;}',
        '.key8m, .key8d {color: #98FE00 !important;}',
        '.key9m, .key9d {color: #FED600 !important;}',
        '.key10m, .key10d {color: #F98C28 !important;}',
        '.key11m, .key11d {color: #FE642D !important;}',
        '.key12m, .key12d {color: #FC4949 !important;}',
        '@media screen and (min-width: 568px) { .Player__track-info-2 { margin-right: 1.5rem; } }',
        '.Player__track-info-2 { min-width: 12.5rem; }',
        '.standard-interior-tracks .buk-track-labels { width: 10%; }',
        '.standard-interior-tracks .buk-track-key { width: 8.556%; display: flex; flex-direction: row; flex-wrap: 100%; }',
        '.standard-interior-tracks .buk-track-key div { display: flex; flex-direction: column; flex-basis: 100%; flex: 1; }',
        '</style>'
    ].join('\n'));
if ((labelColumnHeader = document.querySelector('.bucket-track-header-meta p.bucket-track-header-col.buk-track-key'))) {
    labelColumnHeader.innerHTML = '<div>BPM</div><div class>KEY</div>';
    Array.from(document.querySelectorAll('li.bucket-item p.buk-track-key')).forEach((label, i) => {
        if ((info = window.Playables && window.Playables.tracks && window.Playables.tracks[i])) {
            label.innerHTML = `<div>${info.bpm}</div><div class="key${beatportKeyToCamelotKey[info.key]}">${beatportKeyToCamelotKey[info.key]}</div>`;
        }
    });
    // Array.from(document.querySelectorAll('.buk-track-key')).forEach((label, i) => {
    //     if ((info = window.Playables && window.Playables.tracks && window.Playables.tracks[i])) {
    //         label.innerHTML = `<div>${info.bpm}</div><div class="key${beatportKeyToCamelotKey[info.key]}">${beatportKeyToCamelotKey[info.key]}</div>`;
    //     }
    // });
}
if ((labelColumnHeader = document.querySelector('.interior-release-tracks .bucket-track-header-col.buk-track-key'))) {
    labelColumnHeader.innerHTML = '<div class>KEY</div>';
    Array.from(document.querySelectorAll('li p.buk-track-key')).forEach((label, i) => {
        if ((info = window.Playables && window.Playables.tracks && window.Playables.tracks[i])) {
            label.innerHTML = `<div class="key${beatportKeyToCamelotKey[info.key]}">${beatportKeyToCamelotKey[info.key]}</div>`;
        }
    });
}

var nowPlaying = document.getElementById("player2");
nowPlaying.addEventListener('load', function (){ 
    var newtext = "";
    var bs=document.querySelectorAll('.track-key');
    var textcase = trim(bs[0].innerHTML);
    switch (textcase){
      case 'A min': newtext = '1m'; break;
      case 'C maj': newtext = '1d'; break;
      case 'E min': newtext = '2m'; break;
      case 'G maj': newtext = '2d'; break;
      case 'B min': newtext = '3m'; break;
      case 'D maj': newtext = '3d'; break;
      case 'F\u266f min': newtext = '4m'; break;
      case 'G\u266d min': newtext = '4m'; break;
      case 'A maj': newtext = '4d'; break;
      case 'C\u266f min': newtext = '5m'; break;
      case 'D\u266d min': newtext = '5m'; break;
      case 'E maj': newtext = '5d'; break;
      case 'G\u266f min': newtext = '6m'; break;
      case 'A\u266d min': newtext = '6m'; break;
      case 'B maj': newtext = '6d'; break;
      case 'D\u266f min': newtext = '7m'; break;
      case 'E\u266d min': newtext = '7m'; break;
      case 'F\u266f maj': newtext = '7d'; break;
      case 'G\u266d maj': newtext = '7d'; break;
      case 'A\u266f min': newtext = '8m'; break;
      case 'B\u266d min': newtext = '8m'; break;
      case 'C\u266f maj': newtext = '8d'; break;
      case 'D\u266d maj': newtext = '8d'; break;
      case 'F min': newtext = '9m'; break;
      case 'G\u266f maj': newtext = '9d'; break;
      case 'A\u266d maj': newtext = '9d'; break;
      case 'C min': newtext = '10m'; break;
      case 'D\u266f maj': newtext = '10d'; break;
      case 'E\u266d maj': newtext = '10d'; break;
      case 'G min': newtext = '11m'; break;
      case 'A\u266f maj': newtext = '11d'; break;
      case 'B\u266d maj': newtext = '11d'; break;
      case 'D min': newtext = '12m'; break;
      case 'F maj': newtext = '12d'; break;
     default:
        newtext =  "*";
    }                     
     if (textcase.indexOf(" - ") < 1) {
        bs[0].innerHTML = textcase + " - " + newtext;
     }
  // debug ----->        alert("mdata2: " + bs[0].innerHTML);
    },
  true);
function trim(s)
{
  var l=0; var r=s.length -1;
  while(l < s.length && s[l] == ' ')
  {l++; }
  while(r > l && s[r] == ' ')
  {r-=1;}
  return s.substring(l, r+1);
}
