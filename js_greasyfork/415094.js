// ==UserScript==
// @name            WF ToolBox
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYBBicLUdqBwAAAA1lJREFUWMPFl0tIVFEYx39nug46qE1DYoWU1KJAKZHEoEVRLhwXQUFGKG6CHpsy7KlEi/BJA7myxyKoGSKDAhfpwoIWQWJgQzNQQTZa9DJKKjTG0dPijDo6984cG6UPLsy9c875/8/3/oSUEl15FITuF8iBIQiNwOiY+u50QP5KKMoH9xZEWaH2kQgdAie9yPZukBHASLI4uqa2HBoPIBz2FAg0dyHrfRqgVjIBTdVwfg9iwQQKzyKDw4CN1GQKCtZC/yVEup04JnEEJibBdRj5+w+LKpnpEGpHuDLnkogjkHVo8cFjSXztQGTE+IVtvtqXChzg9x8oucCcG9tiHS44nCLCpApJItZLgsMKK45AvTd1h3MXw48bcO0IELZYZIN6H4yFYwicvI0kzWKDVDfTeVY51ZbDu8BXm4CEAQ13lRaElBJbFebBOAmXayDPBToJc0MulKyffX/wHPa1gdnlBDDlQxi9AesM5y6Guop/N8nerVC9E7xPTRQbgd4AGD1+pFWmexSEgRCsWaEHmGGH7IzZ99A36OyzNkOPH2kMDFkfGI5A8ZmojTWkugxuH1O/33yCTacgkeUGhsAIjSQ5Nc3chqYOHk1xL9/D5rNgXQGiGhoBY7qkLobcegLjYbj3LDk4qHKuH/kS9peq4mKtArjXpwc+s8Xp0AP3t0DncajZsXgaczrAyM+Bwa+JF77ywMbV0eoqAd16sSyx/+TngKjzSul5aL7AbsBrj2q3puXnuLKzjnz8Adsuqmgyk7oKMMq3IDxd5rmgsnQuOKg4j431RJK7HHYXQLffvHUrL0IkTsUTcP807C2Z/dQ/CG+/aDSbAj58h1O3oqawSsUAJ8rhSo95DtjXBt5aqNquPnX0ws3Hui5uDg5wwh1TDZsOICxruB2qr8D1KOjn0eihOo+w7pwbK9W/My1ZSxfy/J0EPUEEnNkw+sv6VrpNavNBOLdnHoGZTvgDSyoFeRBondXNHALjE5B7FPnrfzWl6Wnwrh2Rlb404KF2NRuYNqXToeHKhC9XEYV5SfL+QgaTPHXz+TMBZi4ngIw0eNmKaD6YuMNNKhHlcIFWpXbxL8PpWBgaOhc2nApD5ZaUh9O4Fi0A3X7kiyF4N388z4GideAuQpQV6CvpLyjrNaUqOdRiAAAAAElFTkSuQmCC
// @namespace       WFTB_ns
// @version         1.0.
// @description:en  When prema is present to offer his version for beta + classic editor and add the profile editor waze
// @description:fr  Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze
// @author          exolium
// @match           http://*.waze.com/forum/*
// @match           https://*.waze.com/forum/*
// @exclude         http://*.waze.com/*user/*
// @exclude         https://*.waze.com/*user/*
// @copyright       2015-2020 exolium
// @licence         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @description When prema is present to offer his version for beta + classic editor and add the profile editor waze
// @downloadURL https://update.greasyfork.org/scripts/415094/WF%20ToolBox.user.js
// @updateURL https://update.greasyfork.org/scripts/415094/WF%20ToolBox.meta.js
// ==/UserScript==

/* **************************************************************************** *
 * Info version : Alpha release      : 0.0.1.1, 0.1.1.1, 1.1.2.1,...
 * Info version : Beta release       :  0.0.1 ,  0.2.1 ,  1.1.1 ,...
 * Info version : Production release :   1.0  ,   1.1  ,   2.0  ,...
 * **************************************************************************** *
 * Thanks to beta tester and script developer who bring innovative ideas to me
 * myriades, sebiseba, d2, laurenthembord, laurenthembprd,....
 * **************************************************************************** */
