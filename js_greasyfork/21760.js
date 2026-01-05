// ==UserScript==
// @name         Qobuz Country Switcher
// @namespace    https://greasyfork.org/en/scripts/21760-qobuz-country-switcher
// @version      1.0
// @description  Relocates the country selector menu to just above the album list or just below the cover artwork, and remaps the menu URLs from their countries' homepages to the current page's equivalent page in each country/language.
// @author       newstarshipsmell
// @include      /https?://(www.)?qobuz\.com/[a-z]{2}-[a-z]{2}/(album|interpreter|label|genre)/.+/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21760/Qobuz%20Country%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/21760/Qobuz%20Country%20Switcher.meta.js
// ==/UserScript==

//function GM_addStyle(' !important');
var pagePath = window.location.pathname.replace(/^\/[a-z]{2}-[a-z]{2}\//, '');
var countryMenu = document.querySelector('#country-shop');
storeLinks = countryMenu.getElementsByTagName('a');
for (var i = 1, len = storeLinks.length; i < len; i++)
  storeLinks[i].href = storeLinks[i].href + pagePath;
var newPosition = document.querySelector(/^album\//.test(pagePath) ? '.action' : '#search-tree');
//var newPosition = document.querySelector(/^album\//.test(pagePath) ? '#item' : '.page-header');
newPosition.parentNode.insertBefore(countryMenu,newPosition);

/*
If the GM_addStyle line is enabled with the necessary custom CSS added to override the site CSS that styles the dropdown menu to open upwards, then remove the first
var newPosition line and remove the // from the line below it, and the dropdown menu should insert itself below the breadcrumb (the "You are here:" row.)

CSS URL: http://www.qobuz.com/minify/g=a8c31b2815754fcffe71e0d766285022.css

Country dropdown element page source:
<div id="country-shop" class="btn-group dropup">
    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
        <i class="user-zone icon-country gb"></i>
        United Kingdom        <span class="caret"></span>
    </a>

            <div class="dropdown-menu">
            <ul class="countries">
                                    <li class="icon-country at">
                                                    <a href="http://www.qobuz.com/at-de/interpreter/esa-pekka-salonen/download-streaming-albums">Austria</a>
                                            </li>
                                    <li class="icon-country be multi">
                                                    <span>Belgium</span>
                            <div>
                                                                                                        <a href="http://www.qobuz.com/be-fr/interpreter/esa-pekka-salonen/download-streaming-albums" title="Belgium&nbsp;– Français">Français</a>
                                                                                                        <a href="http://www.qobuz.com/be-nl/interpreter/esa-pekka-salonen/download-streaming-albums" title="Belgium&nbsp;– Nederlands">Nederlands</a>
                                                            </div>
                                            </li>
                                    <li class="icon-country ch multi">
                                                    <span>Switzerland</span>
                            <div>
                                                                                                        <a href="http://www.qobuz.com/ch-de/interpreter/esa-pekka-salonen/download-streaming-albums" title="Switzerland&nbsp;– Deutsch">Deutsch</a>
                                                                                                        <a href="http://www.qobuz.com/ch-fr/interpreter/esa-pekka-salonen/download-streaming-albums" title="Switzerland&nbsp;– Français">Français</a>
                                                            </div>
                                            </li>
                                    <li class="icon-country de">
                                                    <a href="http://www.qobuz.com/de-de/interpreter/esa-pekka-salonen/download-streaming-albums">Germany</a>
                                            </li>
                                    <li class="icon-country es">
                                                    <a href="http://www.qobuz.com/es-en/interpreter/esa-pekka-salonen/download-streaming-albums">Spain</a>
                                            </li>
                                    <li class="icon-country fr">
                                                    <a href="http://www.qobuz.com/interpreter/esa-pekka-salonen/download-streaming-albums">France</a>
                                            </li>
                                    <li class="icon-country gb">
                                                    <a href="http://www.qobuz.com/gb-en/interpreter/esa-pekka-salonen/download-streaming-albums">United Kingdom</a>
                                            </li>
                                    <li class="icon-country ie">
                                                    <a href="http://www.qobuz.com/ie-en/interpreter/esa-pekka-salonen/download-streaming-albums">Ireland</a>
                                            </li>
                                    <li class="icon-country lu multi">
                                                    <span>Luxembourg</span>
                            <div>
                                                                                                        <a href="http://www.qobuz.com/lu-de/interpreter/esa-pekka-salonen/download-streaming-albums" title="Luxembourg&nbsp;– Deutsch">Deutsch</a>
                                                                                                        <a href="http://www.qobuz.com/lu-fr/interpreter/esa-pekka-salonen/download-streaming-albums" title="Luxembourg&nbsp;– Français">Français</a>
                                                            </div>
                                            </li>
                                    <li class="icon-country nl">
                                                    <a href="http://www.qobuz.com/nl-nl/interpreter/esa-pekka-salonen/download-streaming-albums">Netherlands</a>
                                            </li>
                            </ul>
        </div>
    </div>
*/