// ==UserScript==
// @name         GGn Freeleechifier
// @namespace    https://greasyfork.org/users/1130260
// @version      1.4
// @description  Keeps your ratio in check
// @author       Gazellion
// @match        https://gazellegames.net/torrents.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482978/GGn%20Freeleechifier.user.js
// @updateURL https://update.greasyfork.org/scripts/482978/GGn%20Freeleechifier.meta.js
// ==/UserScript==
(function() {
  'use strict';
  var useFreeleechTokens = true; //uses freeleech tokens as fallback if the given torrent isnt freeleech
  var hidePartialFL = false; //controls whether partial fl labels are displayed or not
  var convertPartialFL = true; //convert from % off to x DL for partial freeleech
  var torrents = document.querySelectorAll('tr[id^="torrent"][class="group_torrent"]'); //gets each individual torrent row
  for (const torrent of torrents)
  {
    var freeleech_label = torrent.querySelector('strong[class$="freeleech_label"]'); //gets the freeleech label of the torrent
    if (freeleech_label !== null) //if the torrent has any sort of freeleech status on it
    {
      if (freeleech_label.innerHTML == "Personal Freeleech!" || freeleech_label.innerHTML == "Freeleech!")
      {
        continue; //go to next torrent, do nothing
      }
      else if (freeleech_label.innerHTML == "Freeleech (0x DL)!" || freeleech_label.innerHTML == "Low-Seed Freeleech!")
      {
        torrent.querySelector('a[title="Use a FL Token"]').remove(); //remove FL button
        torrent.innerHTML = torrent.innerHTML.replace('|', ''); //fix formatting
      }
      else if (freeleech_label.innerHTML.endsWith("% off!")) //if partial freeleech
      {
        if (useFreeleechTokens)
        {
          torrent.querySelector('a[title="Download"]').remove(); //remove DL button
          torrent.innerHTML = torrent.innerHTML.replace('|', ''); //fix formatting
          torrent.querySelector('a[title="Use a FL Token"]').innerHTML = "DL"; //rename FL button to DL
        }
        if (hidePartialFL) //if partial freeleech labels should be removed
        {
          torrent.querySelector('strong[class="partial_freeleech_label"]').remove(); //remove partial fl label
          if (torrent.querySelector('em[class$="link_label"]') !== null) //if there's a link label
          {
            torrent.innerHTML = torrent.innerHTML.replace(' - ', ''); //fix formatting
          }
          else
          {
            torrent.innerHTML = torrent.innerHTML.replace(', ]', ']'); //fix formatting
          }
        }
        else if (convertPartialFL) //if the partial fl label should be converted
        {
          torrent.querySelector('strong[class$="freeleech_label"]').innerHTML = (1 - parseFloat(freeleech_label.innerHTML)/100) + "x DL"; //convert from % off to x DL
        }
      }
      else //if we dont know the freeleech type (for debugging purposes)
      {
        console.log("Unexpected Freeleech Type: " + freeleech_label);
      }
    }
    else if (useFreeleechTokens) //if the torrent has no freeleech label
    {
      torrent.querySelector('a[title="Download"]').remove(); //remove DL button
      torrent.innerHTML = torrent.innerHTML.replace('|', ''); //fix formatting since the DL button is removed
      torrent.querySelector('a[title="Use a FL Token"]').innerHTML = "DL"; //change FL button to say DL
    }
  }
})();