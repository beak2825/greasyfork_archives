// ==UserScript==
// @name         Programma-peredach.com Time Zone Changer
// @namespace    https://violentmonkey.github.io/
// @version      1.4
// @description  Automatic selection of a TV guide for your time zone, instead of the default selection based on geolocation
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAMAAACZHrEMAAADAFBMVEUAov/////+9/f+4eH+7e3+5ub+3d3+8/MAAAAAAAAAAAAIAAAAAAAAAAAARAAIAAAACgCxpyzwDHcAAJgAAAA6AEUAXABvAEQAdwBsAG4AbwBkAGEAcwB0AFwAdgBnAF8AdQBkAGkAZQBiAF8AbABlAHUAXwA0ADEAMABwAC4AbgAAAGcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIcAAACY73Sp0ABsd7EAmO8AAAER5AAAdiwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOfIgviADYB64AznuY71x49gBcd7EAmO+uL4h5GAd7d7F2quDOe9hTyAAYB4cAzvvOfIh72AAUAM4AAACHU8gAAAcgAAAAmO8AAADwhAD9AJh3tUOC3J/vmAEHAJgAAACxeJsAAHcAAAAAzgCuL6AABwcBAAAAAAAAABUAAgAoAAB2LBIoKhgAIHbyAIf////O+2h72ACwAM4AmO+w4WPg5XcAd7AAAAAAAAAAAAA0AAAAmPApyGrwNHbEAJh2KcgAAAAAAAAAAADAAACcrLQAGAcAAAAAAACY8AwAQAAAAAAAAACY7/gAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAIBAQABB7UAAAC1JpAATAegAhoHri8AAAAAAgAAAAC1NtzWAAAAAWJLR0QB/wIt3gAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAhpJREFUeNrtmtG2hCAIRcE0//+P70trTbdRxIS0Wee8NZFuyUlAiSAIgiAIgiAIgt4i1qpgWWovqKxGYcJ3N0HTnotnlK4BTKWjIZYeGFJMmokw/C6YzQkmKsY95pgOGM2kmQrDjdaSI0xr5PuYY2xheC5MEBuLrjCNsQ86ptfNokVaCeZ6LzvDbNKkMXUMDS7LK8FERSBoCxPrJraOUX206pNmARieCZNrNtmWRbe21Gx4BZgwEyZUjIxZlCFA2SisBMNzYEJx0lizaCO1otVKMGElGHMWdUBdmDTLwPBiMJeFaX8Qhlq5Jk2EySvB8DaUYg/CUDvdA0y5rPQozO7umJ6Sxltg8uMwydsxXZWnd8CECTDR2TF9BcI3wIQpMNnXMZ11XGcYCIKgn1XpsxkPndbmf7+Ury6PfD3bskssFny+kaUr7VaYdjfCCkbcZFHuYBnCnFJbFUw9CrGA+SQHGhjBxgSGO2CSOwzrYcpzzRMmbSdVYIRvTx9MbZgdaSmZw9BSMPEuTHCAobsw5AnD68K0P3lrwoyvTYABzPN/7X0lGPaEoZ+FiQ+t2lQJgURSHUwcgDnO6p6f2GtHCrIEk66lWFLDRFYEwY1AciAGbp0GtYbpKkDeH41B3qTK4o5bm6p5qbMsD1pxIP8DnDTNC51tjTeQ+8rPilS+2llqTofY2r2SjqULq2zrBTTqAhAEQRAEQRAEQUR/ZWsXAuh2QsoAAAAASUVORK5CYII=
// @match        https://programma-peredach.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463616/Programma-peredachcom%20Time%20Zone%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/463616/Programma-peredachcom%20Time%20Zone%20Changer.meta.js
// ==/UserScript==

// Set your time zone number here by selecting it from the time zone table */
  var timezone_number = 1;

/* Time zone table
#     Timezone           city_id      querySelector
1     UTC+0                96         #tab-utc > div:nth-child(1) > a:nth-child(1)
2     UTC+1                95         #tab-utc > div:nth-child(1) > a:nth-child(3)
3     МСК-1 / UTC+2        13         #tab-utc > div:nth-child(1) > a:nth-child(5)
4     МСК+0 / UTC+3        14         #tab-utc > div:nth-child(1) > a:nth-child(7)
5     МСК+1 / UTC+4        15         #tab-utc > div:nth-child(1) > a:nth-child(9)
6     МСК+2 / UTC+5        16         #tab-utc > div:nth-child(1) > a:nth-child(11)
7     МСК+3 / UTC+6        17         #tab-utc > div:nth-child(1) > a:nth-child(13)
8     МСК+4 / UTC+7        18         #tab-utc > div:nth-child(1) > a:nth-child(15)
9     МСК+5 / UTC+8        19         #tab-utc > div:nth-child(1) > a:nth-child(17)
10    МСК+6 / UTC+9        20         #tab-utc > div:nth-child(1) > a:nth-child(19)
11    МСК+7 / UTC+10       21         #tab-utc > div:nth-child(1) > a:nth-child(21)
12    МСК+8 / UTC+11       22         #tab-utc > div:nth-child(1) > a:nth-child(23)
13    МСК+9 / UTC+12       23         #tab-utc > div:nth-child(1) > a:nth-child(25)
14    UTC-1                111        #tab-utc > div:nth-child(2) > a:nth-child(1)
15    UTC-2                112        #tab-utc > div:nth-child(2) > a:nth-child(3)
16    UTC-3                113        #tab-utc > div:nth-child(2) > a:nth-child(5)
17    UTC-4                114        #tab-utc > div:nth-child(2) > a:nth-child(7)
18    UTC-5                115        #tab-utc > div:nth-child(2) > a:nth-child(9)
19    UTC-6                116        #tab-utc > div:nth-child(2) > a:nth-child(11)
20    UTC-7                117        #tab-utc > div:nth-child(2) > a:nth-child(13)
21    UTC-8                118        #tab-utc > div:nth-child(2) > a:nth-child(15)
22    UTC-9                119        #tab-utc > div:nth-child(2) > a:nth-child(17)
23    UTC-10               120        #tab-utc > div:nth-child(2) > a:nth-child(19)
24    UTC-11               121        #tab-utc > div:nth-child(2) > a:nth-child(21)
25    UTC-12               122        #tab-utc > div:nth-child(2) > a:nth-child(23)   */

// If you wish, you can set your geolocation here by selecting it from the row below */
  let cou = '%3F';
/*
US
EU
GB
DE
FR
NL
PL
SE
RU
%3F = ?
*/

// Set the value of custom settings as activated, so that the script works properly
   var user_settings = 'activated';

// Set your time zone on the page
  if (timezone_number == 1) {
      var city_id = '96';
  } else if (timezone_number == 2) {
      var city_id = '95';
  } else if (timezone_number == 3) {
      var city_id = '13';
  } else if (timezone_number == 4) {
      var city_id = '14';
  } else if (timezone_number == 5) {
      var city_id = '15';
  } else if (timezone_number == 6) {
      var city_id = '16';
  } else if (timezone_number == 7) {
      var city_id = '17';
  } else if (timezone_number == 8) {
      var city_id = '18';
  } else if (timezone_number == 9) {
      var city_id = '19';
  } else if (timezone_number == 10) {
      var city_id = '20';
  } else if (timezone_number == 11) {
      var city_id = '21';
  } else if (timezone_number == 12) {
      var city_id = '22';
  } else if (timezone_number == 13) {
      var city_id = '23';
  } else if (timezone_number == 14) {
      var city_id = '111';
  } else if (timezone_number == 15) {
      var city_id = '112';
  } else if (timezone_number == 16) {
      var city_id = '113';
  } else if (timezone_number == 17) {
      var city_id = '114';
  } else if (timezone_number == 18) {
      var city_id = '115';
  } else if (timezone_number == 19) {
      var city_id = '116';
  } else if (timezone_number == 20) {
      var city_id = '117';
  } else if (timezone_number == 21) {
      var city_id = '118';
  } else if (timezone_number == 22) {
      var city_id = '119';
  } else if (timezone_number == 23) {
      var city_id = '120';
  } else if (timezone_number == 24) {
      var city_id = '121';
  } else if (timezone_number == 25) {
      var city_id = '122';
  }

// A Function to Set a Cookie
function setCookie(cName, cValue) {
  const domain = "domain=programma-peredach.com";
  document.cookie = cName + "=" + cValue + ";" + domain + ";";
}

// A Function to Get a Cookie
function getCookie(cName) {
  let Name = cName + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(Name) == 0) {
      return c.substring(Name.length, c.length);
    }
  }
  return "";
}

// A Function that Checks if a Cookie is set
function checkCookie() {
  let user = getCookie("user_settings");
  if (user != "") {
 // Remember to open the console (Press F12)
    console.error("Сookies with custom user settings are set!");
  } else {
 // Apply setCookie
    setCookie('city_id', city_id);
    setCookie('cou', cou);
    setCookie('user_settings', user_settings);
    location.reload();
  }
}

// Check if Сookies are set and if not, set a Сookie with custom user settings
checkCookie();