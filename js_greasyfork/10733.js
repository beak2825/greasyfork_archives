// ==UserScript==
// @name        IP Check [KAT][Mod]
// @namespace   PXgamer
// @description Checks IPs against IPVoid
// @include     *kat.cr/user/*/ips/*
// @include     *kickass.to/user/*/ips/*
// @include     *kat.ph/user/*/ips/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10733/IP%20Check%20%5BKAT%5D%5BMod%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/10733/IP%20Check%20%5BKAT%5D%5BMod%5D.meta.js
// ==/UserScript==

$('.doublecelltable').before('<style>.btn {background:transparent linear-gradient(to bottom, #766843 0%, #645736 100%) repeat scroll 0% 0%; border:1px black solid; padding:3px; color:white; border-radius:4px;} #ip_address {border:1px black solid; border-radius:4px; padding:3px;} </style>');
$('.doublecelltable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > h2:nth-child(4)').before('<div id="a" align="center"><form class="form-inline top-bottom-space" role="form" target="_blank" action="http://www.ipvoid.com/" method="post" onsubmit=""> <input name="ip" class="form-control" id="ip_address" placeholder="Enter IP address..." type="text">        <button type="submit" class="btn btn-primary">Check IP</button>    </form>  </div>');