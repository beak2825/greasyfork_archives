// ==UserScript==
// @name        Steam Checkout Save Address Unchecked.
// @description Sets save address checkbox to unticked by default.
// @license     GPLv3
// @namespace   StupidWeasel/SteamCheckout/SteamCheckoutSaveAddressUnchecked
// @include     /^https?://store\.steampowered\.com/checkout/.*$/
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26770/Steam%20Checkout%20Save%20Address%20Unchecked.user.js
// @updateURL https://update.greasyfork.org/scripts/26770/Steam%20Checkout%20Save%20Address%20Unchecked.meta.js
// ==/UserScript==

/*
    Steam Checkout Save Address Unchecked - A GreaseMonkey script for the Steam Store
    Copyright (C) 2017 Alex "StupidWeasel" Bolton

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
function byID(id){
  return document.getElementById(id);  
}
var SaveAddressCheckbox = byID("save_my_address");
if(SaveAddressCheckbox){
    SaveAddressCheckbox.checked = false;
}