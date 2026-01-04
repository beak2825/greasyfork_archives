// ==UserScript==
// @name        Google 09'-11' Favicon
// @version     1.1
// @author      valerie moon
// @namespace   https://greasyfork.org/en/users/1328377-valerie-moon
// @description Brings back the old favicon for google.
// @icon        https://greasyfork.org/system/screenshots/screenshots/000/002/575/original/Google_Favicon_%282012_-_2015%29.png?1447968978

// @include     http*://www.google.*
// @include     http*://webcache.googleusercontent.*
// @include     http*://images.google.*
// @include     http*://google.com/photos*
// @include     http*://books.google.*
// @include     http*://support.google.*
// @include     http*://accounts.google.*
// @include     http*://myaccount.google.*
// @include     http*://aboutme.google.*
// @include     http*://googleblog.blogspot.*
// @include     http*://cse.google.*

// @exclude     http*://www.google.com/cloudprint*
// @exclude     http*://www.google.com/calendar*
// @exclude     http*://www.google.com/intl/*/drive*
// @exclude     http*://www.google.com/earth*
// @exclude     http*://www.google.com/finance*
// @exclude     http*://www.google.com/maps*
// @exclude     http*://www.google.com/voice*
// @grant       none
// @support     rschneider@engineer.com
// @license     CC BY-NC 4.0 License (Creative Commons Attribution, NonCommercial 4.0 International) - http://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/499704/Google%2009%27-11%27%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/499704/Google%2009%27-11%27%20Favicon.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('type', 'image/x-icon');
icon.setAttribute('rel', 'icon');

icon.setAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGnRFWHRTb2Z0d2FyZQBQYWludC5ORVQgdjMuNS4xMDD0cqEAAAM5SURBVDhPTZN9TNVVGMefey62ZCTwh21NLdbKTGOtzeLlSqQtFqymzdRoU7cs/8le/urFbi3BS2GpmEaCvbJ2E3MGFOidhZVa5BioCytI3rIk7xW4F3b1+rvcT8/vWFt/PHvOOTvft+d3fgKIk4TOvmFy1gZJe+gTqvafIpVKkoiOcbS4kB6PcMUYpkS0DHHdj+raxUrSQS/DsspDyKoQZl0nM574mt//ilmS+M89nM9I/xfstd0liEgag0YQF+w4DrdsaEPWdSDru5Hy76j84rQlVg4GS0pIiIekV2wfV6KwkgwombgX3PL52zGrf8Cs78A8foxV27rUoWNJzi5fxqQq/udiQsF/6rrXeJWAKdyqaDyNLA+R9uQJzGPfUF7TwZSLvgw/3j6P72+4hua52bTlZNOZNc3ad2cjfUMXrcpINM68Da3Io4eZsTpEqPucPa9r3sOc53OQd/Pw1hYh7/iYXn0PhU/lsmVBJnLbmo/Y334GlWMsluDjI/30Dl+06oFDdUjFHXjrfXh3FyK1eXhqC/Ds0PXOYjxvLEFmrtxL1tL3WfJckM0N7XbybvYjvT9hXrwJ2XM3UpeH1Ct41yJbsj0fz5YiJbhXHZQ3MHvFp1xb9iHZD+5mYCRq1Yci55hb/wiyK9eqmvd8us63EWS7gpVAqnV/c+k28td8wMrXWni25lu6e0ctgTvYcCxMyd6n8WzNVfuq7IL/T7BZK3j4JOFR/RI6sCvjPYycbaK/u5ZLExeunulLKw0+oyTzNbcq1vgwbxUgbyphQMuNPPH3Sbqa8hloSuePVmH4gOFM43yikd/sTH4ZGeS6qmIFF+B9exGmWpUDmn+T1mVnks5gHmNfCanjBudoOvH26VzYJ/Q1lV2NoyK37lihmRciWzVCVRHTNt2PvKoEsUg/vzbM4lIoi2gog1hrJuMtmUx+OYvzn98JiQniToo5gTIF6jADi7Wri9fvQ15RJ04yxcDBtUQ+y2C8+XqiLTMtOLrvRkaP+e0cGk8cxPvCXXgq9T1UaBRXeaPWy+rC/s6TEcLH/Yy1LSXa/ID2h4l37SThxDk11M/sl0oVsBDjV7DfVdbhbVysUOQfPFOSQg11AUoAAAAASUVORK5CYII=');

head.appendChild(icon);
