// ==UserScript==
// @name        chatango redirect
// @namespace   2pichubros_chatango
// @description redirects to html or flash automatically
// @include     /(http|https):\/\/.*?\.chatango.com\/$/
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11191/chatango%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/11191/chatango%20redirect.meta.js
// ==/UserScript==
blacklist = []; //Add users/chats that you would not like to have redirected here
url = window.location.href;
user = url.split(".")[0].split("://")[1]
mode = "html5"; //set to either html5 or flash depending on what you want to redirect to
if (blacklist.indexOf(user) >= 0){
  console.log("redirect in blacklist... passing")
  return "Blocked"
}
else{
  if (mode == "html5"){
    mode = "?js"
  }
  else if (mode == "flash"){
    mode = "?flash"
  }
  window.location.href = window.location.href+mode;
}
