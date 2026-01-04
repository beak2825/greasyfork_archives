// ==UserScript==
// @name     ONlovee: Private photos and advanced search FREE
// @name:it  ONlovee: foto private e ricerca avanzata GRATIS
// @description See all private photos of any user and use the paid advanced search FOR FREE
// @description:it Guarda tutte le foto private di qualsiasi utente e usa la ricerca avanzata a pagamento GRATIS
// @icon  data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAaCAMAAADhRa4NAAAAM1BMVEUAAADBACXBFSzDKDjGQUvMUFzPZm/Xf4fakpjnqbLktbjtyMzz1tv34uX26en++ff///8mU+7sAAAAAXRSTlMAQObYZgAAARZJREFUKM+FkluSxCAIRaOCii/Y/2oHMFVJTyczfBgNR7gCx7Et/Lbjw8Kj/eO+ENvFTK3CM+H+ukR44CNhn7yEWaTFN6AK1zxkwQPgGUg4Qxd+UuFrYVmDZaQ3IHVVIKv4IZ5K4g0I0Fhm8V+JyDPl5ucNIGUWgpI8HZN+Y9+a9yvnyswFVwfXw9WyysITAH2gAhUXayUU0OMHUFX/BsxjgAy8AZqNM7I0JAtuTxbpcAHJSohWaVMaFaAh3G6AbdHSaC6yCNV6sy4NpJdxKqQXiwPRhWzg2L3stZah4sAB7Q5vYHdTQ2u7dZk5bCCoxhsQy7SQPLJVja1OQfNNuEYKSmtU4KsXt6GNX9MUr7n+e6jfmNPxA9GVECCSSIGuAAAAAElFTkSuQmCC
// @namespace StephenP
// @author    StephenP
// @contributionURL https://nowpayments.io/donation/stephenpgreasyfork
// @version  1.0.2
// @grant    unsafeWindow
// @match    https://onlovee.com/*
// @match    https://onlovee.com/
// @license AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/432265/ONlovee%3A%20Private%20photos%20and%20advanced%20search%20FREE.user.js
// @updateURL https://update.greasyfork.org/scripts/432265/ONlovee%3A%20Private%20photos%20and%20advanced%20search%20FREE.meta.js
// ==/UserScript==
/*
    Copyright (C) 2021  StephenP

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
var pup;
var isMobile=false;
var isRunning=false;
var firstRun=true;
var url;
(function(){
  if(document.location.href.includes("onlovee.com/m/")){
    isMobile=true;
  }
  setInterval(setVariables,2000);
  setInterval(checkPageChanged,1000);
})();
function checkPageChanged(){
 if(document.location.href.toString().split("#")[0]!=url){
	if(document.readyState=="complete"){
    if((document.location.href.includes("display=profile"))||(document.location.href.includes("/m/profile_view.php"))){
    	loadPrivatePhotos();
    }
    url=document.location.href.toString().split("#")[0];
  }
 }
}
function checkPic(){
  let pics=document.getElementsByClassName("photo");
  let lastPic=pics[pics.length-1];
  if((lastPic.getAttribute("src").includes("private_photo")||(lastPic.getAttribute("src").includes("loader")))&&(!isRunning)){
    loadPrivatePhotos();
  }
}
function setVariables(){
  window.eval("window.isSuperPowers = 1;");
  window.eval("window.isVisibleMessages = 1;");
  window.eval("window.isCurUserSuperPowers = 1;");
  window.eval("window.userAllowedFeature['invisible_mode'] = 1;");
  window.eval("window.userAllowedFeature['3d_city'] = 1;");
  window.eval("window.userAllowedFeature['encounters'] =  1;");
  window.eval("window.userAllowedFeature['extended_search'] =  1;");
  window.eval("window.userAllowedFeature['audiochat'] =  1;");
  window.eval("window.userAllowedFeature['videochat'] =  1;");
  window.eval("window.userAllowedFeature['message_read_receipts'] =  1;");
  window.eval("window.userAllowedFeature['kill_the_ads'] =  1;");
  window.eval("window.userAllowedFeature['profile_visitors_paid'] =  1;");
  window.eval("window.userAllowedFeature['upload_image_chat_paid'] =  1;");
  window.eval("window.userAllowedFeature['site_access_paying'] =  1;");
}
function loadPrivatePhotos(){
  isRunning=true;
  if(firstRun){
    var popup=document.createElement("DIV");
    popup.innerHTML="<div id='popup' style='background-color: black; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-repeat: no-repeat; background-position: center center; background-size: contain;justify-content: center;display: none;align-items: center;'><img style='max-height: 100%;max-width: 100%;' src=''></div>";
    document.body.appendChild(popup);
    popup.addEventListener('click',hidePopup);
    pup=document.getElementById("popup");
  }
  var profileId=document.location.href.match(/([0-9])\w+/)[0];
  var photoThumbs;
  if(isMobile){
    photoThumbs=document.getElementsByClassName("item_cont");
  }
  else{
    photoThumbs=document.getElementsByClassName("profile_photo_frame");
  }
  for(let p of photoThumbs){
    let thumb=p.children[0].children[0];
    let photoId=thumb.id.match(/([0-9])\w+/)[0];
    if((thumb.getAttribute("src").includes("private"))||(thumb.getAttribute("data-src").includes("private"))){
      var photoUrlM;
      if(isMobile){
        photoUrlM=thumb.getAttribute("data-src").replace("impact_mobile_private_photo_mm.svg","photo/"+profileId+"_"+photoId+"_m.jpg");
      }
      else{
        photoUrlM=thumb.getAttribute("data-src").replace("impact_private_photo_m.png","photo/"+profileId+"_"+photoId+"_m.jpg");
      }
      thumb.setAttribute("data-src",photoUrlM);
      thumb.setAttribute("src",photoUrlM);
      console.log(thumb.getAttribute("src")+" is private");
      try{
        let photoScript=p.getElementsByTagName("SCRIPT")[0].innerHTML;
        photoScript=photoScript.replace("\'private\'","\'public\'");
        photoScript=photoScript.replace("\"private\"\:\"Y\"","\"private\"\:\"N\"");
        if(isMobile){
          photoScript=photoScript.replace("impact_mobile_private_photo_m.svg","photo\\/"+profileId+"_"+photoId+"_m.jpg");
          photoScript=photoScript.replace("impact_mobile_private_photo_s.svg","photo\\/"+profileId+"_"+photoId+"_s.jpg");
          photoScript=photoScript.replace("impact_mobile_private_photo_r.svg","photo\\/"+profileId+"_"+photoId+"_r.jpg");
          photoScript=photoScript.replace("impact_mobile_private_photo_b.svg","photo\\/"+profileId+"_"+photoId+"_b.jpg");
          photoScript=photoScript.replace("impact_mobile_private_photo_bm.svg","photo\\/"+profileId+"_"+photoId+"_bm.jpg");
        }
        else{
          photoScript=photoScript.replace("impact_private_photo_m.png","photo\\/"+profileId+"_"+photoId+"_m.jpg");
          photoScript=photoScript.replace("impact_private_photo_s.png","photo\\/"+profileId+"_"+photoId+"_s.jpg");
          photoScript=photoScript.replace("impact_private_photo_r.png","photo\\/"+profileId+"_"+photoId+"_r.jpg");
          photoScript=photoScript.replace("impact_private_photo_b.png","photo\\/"+profileId+"_"+photoId+"_b.jpg"); 
        }
        p.getElementsByTagName("SCRIPT")[0].innerHTML=photoScript; 
        if(isMobile){
          p.removeAttribute("href");
          p.removeAttribute("onclick");
        }
        p.children[0].removeAttribute("href");
        p.children[0].removeAttribute('onclick');
        p.children[0].addEventListener('click',showPopup);
      }
      catch(e){console.log(e);}
    }
  }
  isRunning=false;
  firstRun=false;
}
function hidePopup(){
  pup.style.display="none";
  pup.children[0].setAttribute("src","");
}
function showPopup(e){
  let url;
  if(e.target.hasAttribute("src")){
    url=e.target.getAttribute("src").replace("_m.","_bm.");
  }
  else{
    url=e.target.children[0].getAttribute("src").replace("_m.","_bm.");
  }
  pup.children[0].setAttribute("src",url);
  pup.style.display="flex";
}