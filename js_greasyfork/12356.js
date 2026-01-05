// Copyright 2015 Marco Trevisan (Treviño) <mail@3v1n0.net>
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License version 3, as published
// by the Free Software Foundation.
//
// ==UserScript==
// @name        CI Train IRC nick fix
// @namespace   3v1n0.net
// @version     0.1
// @description Use my IRC nickname on Ubuntu ci-train
// @include     http*://requests.ci-train.ubuntu.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.2.3/jquery.min.js
// @require     https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12356/CI%20Train%20IRC%20nick%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/12356/CI%20Train%20IRC%20nick%20fix.meta.js
// ==/UserScript==

var MY_LP_NICK = '3v1n0'
var MY_IRC_NICK = 'Trevinho'

waitForKeyElements('input[name="landers"]', function(landers_inputs) {
  for (var i = 0; i < landers_inputs.length; ++i)
    landers_inputs[i].value = landers_inputs[i].value.replace(new RegExp("\\b"+MY_LP_NICK+"\\b", 'g'), MY_IRC_NICK)
});

waitForKeyElements('a[href="#/user/'+MY_LP_NICK+'"]', function(my_links) {
  for (var i = 0; i < my_links.length; ++i)
    my_links[i].href = my_links[i].href.replace(MY_LP_NICK, MY_IRC_NICK)
});
