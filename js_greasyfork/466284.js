// ==UserScript==
// @name     Twitch collector
// @version  1.0
// @grant    none
// @description  Automatic twitch chests collector
// @match    https://www.twitch.tv/*
// @icon     https://seeklogo.com/images/T/twitch-logo-4931D91F85-seeklogo.com.png
// @author   Maslosz
// @license  MIT
// @namespace https://greasyfork.org/users/1078504
// @downloadURL https://update.greasyfork.org/scripts/466284/Twitch%20collector.user.js
// @updateURL https://update.greasyfork.org/scripts/466284/Twitch%20collector.meta.js
// ==/UserScript==

function repeatSearching(){
  if(document.querySelectorAll('.ScCoreButtonSuccess-sc-ocjdkq-5')[0]!=undefined||document.querySelectorAll('.ScCoreButtonSuccess-sc-ocjdkq-5')[0]!=null){
document.querySelectorAll('.ScCoreButtonSuccess-sc-ocjdkq-5')[0].click()
  
  
}
  setTimeout(repeatSearching,500)
}
repeatSearching();