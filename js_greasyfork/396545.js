// ==UserScript==
// @name         GGn Steam Portrait Cover Tooltip
// @namespace    https://greasyfork.org/
// @version      0.3.7
// @description  Shows a tooltip suggesting a steam portrait cover image if available
// @author       lucianjp
// @license      Unlicense
// @icon         https://gazellegames.net/favicon.ico
// @supportURL   https://gazellegames.net/forums.php?action=viewthread&threadid=20638&postid=1478606#post1478606
// @match        https://gazellegames.net/torrents.php?id*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396545/GGn%20Steam%20Portrait%20Cover%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/396545/GGn%20Steam%20Portrait%20Cover%20Tooltip.meta.js
// ==/UserScript==

const isValidUrl = function(str){
  const regexp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return regexp.test(str);
};

const getImageSrc = function(src){
  try{
    return src.includes('/image.php') ? decodeURIComponent(new URL(src).searchParams.get('i')) || src : src;
  } catch (e) {
    return src;
  }
};

(function() {
  const $cover = document.querySelector('#content .sidebar>.box_albumart>.head+p');
  const $img = $cover.querySelector('img');
  const imgWidth = getComputedStyle($img).getPropertyValue('min-width') !== '0px' ? getComputedStyle($img).getPropertyValue('min-width') : getComputedStyle($img).getPropertyValue('max-width');
  const $steam = document.querySelector('#content .sidebar #weblinksdiv a[title="Steam"]');
  const steamId = $steam ? /\d+/.exec($steam.href)[0] : undefined;
  var broken = false;

  if($cover && steamId){
    const tooltipId = 'tooltip_steam';
    const $tooltip = document.createElement('div');
    $tooltip.id = tooltipId;
    $tooltip.classList.add('center');
    let $elem = $tooltip.appendChild(document.createElement('div'));
    $elem = $elem.appendChild(document.createElement('h3'));
    $elem.innerHTML = 'Steam Cover';
    $elem = $tooltip.appendChild(document.createElement('div'));
    $elem = $elem.appendChild(document.createElement('img'));
    $elem.setAttribute("referrerpolicy","no-referrer");
    $elem.style = `max-width: ${imgWidth};`;
    $elem.onerror = function(){
      broken = true;
    };
    $elem.src = `https://steamcdn-a.akamaihd.net/steam/apps/${steamId}/library_600x900_2x.jpg`;
    $elem.onclick = function(){
      lightbox.init(this,220);
    };
    $elem = $tooltip.appendChild(document.createElement('div'));
    $elem = $elem.appendChild(document.createElement('button'));
    $elem.onclick = function(){
      let reqPTP = new XMLHttpRequest();
      reqPTP.open("GET", `imgup.php?img=${$tooltip.querySelector('img').src}`, true);
      reqPTP.onload = function(){
        if (isValidUrl(this.responseText) && this.responseText != "http://i.imgur.com/?error.jpg") {
          const newCover = this.responseText;
          const params = [
            "action=takeimagesedit",
            `groupid=${new URLSearchParams(new URL(window.location.href).search).get('id')}`,
            "categoryid=1",
            `image=${encodeURIComponent(this.responseText)}`
          ];
          [...document.querySelectorAll('#content .screenshots_div .screenshots a>img')].forEach($screen => {
            params.push(`screens%5B%5D=${encodeURIComponent(getImageSrc($screen.src))}`);
          });
          let http = new XMLHttpRequest();
          http.open("POST", "torrents.php", true);
          http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          http.onload = function() {
            $img.src = newCover;
            $($cover).tooltipster('destroy');
            $cover.title = '';
          }
          http.send(params.join('&'));
          $tooltip.querySelector('button').parentNode.textContent = '[✓]';
        } else {
          $tooltip.querySelector('button').parentNode.innerHTML = 'ERROR';
        }
      };
      reqPTP.onerror = function () {
        $tooltip.querySelector('button').parentNode.innerHTML = 'ERROR';
      };
      reqPTP.send(null);
    };
    $elem.textContent = 'Replace!';

    if(!broken){
      $($cover).tooltipster({
        position: getComputedStyle(document.querySelector('#content .sidebar')).getPropertyValue('float') === 'right' ? 'left' : 'right',
        interactive: true,
        content:$($tooltip),
        interactiveTolerance: 500,
        fixedWidth: Number(/\d+/.exec(imgWidth)),
        speed: 100,
        delay: 0,
        functionBefore: function(origin, continueTooltip) {
          if(broken){
            origin.tooltipster('destroy');
            origin.get(0).title = '';
            return;
          }
          continueTooltip();
        }
      });
    }
  }
})()
