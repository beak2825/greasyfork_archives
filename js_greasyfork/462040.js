// ==UserScript==
// @name        WPR Revive Request - torn.com
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/hospitalview.php*
// @match       https://www.torn.com/factions.php*
// @match       https://www.torn.com/profiles.php*
// @grant       none
// @version     1.4.1
// @author      Baskerville
// @license     MIT
// @description Send revive requests for your friends or enemies without leaving Torn
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/462040/WPR%20Revive%20Request%20-%20torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/462040/WPR%20Revive%20Request%20-%20torncom.meta.js
// ==/UserScript==

function getUser(){
  for(var s of document.querySelectorAll("script")){
    let n = s.getAttribute("name");
    if(n){
      let uid = s.getAttribute("uid");
      n += " [" + uid + "]";
      return n;
    }
  }
}

function make_rev_btn(user_name, user_url){
  let form = document.createElement('form');
  let s = document.createElement('input');
  s.type="submit";
  s.value="Revive!!!";
  s.style="border: 1px solid #888; background: #ddd; padding: 1em; color: red;";
  form.append(s);
  let a = document.createElement('input');
  a.type="text";
  a.name="username";
  a.value=getUser();
  a.style="display:none;";
  form.append(a);
  let c = a.cloneNode();
  c.name = "content";
  c.value = "<@&687143098186203156>Please revive " + user_name + " " + user_url;
  form.append(c);
  form.method="POST";
  form.action="https://tinyurl.com/tkpcceuv";
  form.target="_self"; // Replace this view
  form.id="reviveme";
  return form;
}

function getRev(){
  let profile = document.querySelector(".user-profile");
  if(profile){
    let user = profile.querySelector(".user");
    let user_url = window.location.href;
    if(user && !profile.querySelector("#reviveme")){
      let user_name = user.getAttribute("data-placeholder");
      console.log(user_name);
      let buttons = profile.querySelector(".buttons-list");
      let form=make_rev_btn(user_name, user_url)
      buttons.append(form);
      return true;
    }
  }
  return false; // Keep watching
}

function getRev2(){
  let profile = document.querySelector(".mini-profile-wrapper");
  if(profile){
    for(var a of profile.querySelectorAll("a")){
      if (a.href.includes("/profiles.php")){
        var user_url = a.href;
        var user_name = a.querySelector("span").innerHTML;
        break;
      }
    }
    if(user_name && !profile.querySelector("#reviveme")){
      console.log(user_name);
      let buttons = profile.querySelector(".buttons-list");
      let form=make_rev_btn(user_name, user_url)
      buttons.append(form);
    }
  }
  return false; // Keep watching
}


const disconnect = VM.observe(document.body, () => {
  // Find the target node
  getRev2();
  return getRev();
});