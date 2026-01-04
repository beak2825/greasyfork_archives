// ==UserScript==
// @name         CKWraps unlock videos
// @namespace    StephenP
// @version      2.0.0
// @description  This script allows you to see all the videos on CKWraps.com without having a subscription.
// @author       StephenP
// @grant        none
// @icon         data:@file/gif;base64,R0lGODlhIAAgAKEAAAAAAP///wAAAAAAACH5BAEKAAEALAAAAAAgACAAAAJfjI+py+0Po5y02gNyvkl7zYHLNjJiAxhksCItyqaq3NGON79xtPUnZjP5YjpdbWhU8YDJ3eQ3Ct6aGAq1KoGanlfl0jmF2LQuqYJGrt1yYJSZafnI31wc547P6/f8SgEAOw==
// @match        https://ckwraps.com/videos*
// @match        https://ckwraps.com/search*
// @downloadURL https://update.greasyfork.org/scripts/421202/CKWraps%20unlock%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/421202/CKWraps%20unlock%20videos.meta.js
// ==/UserScript==
(function(){
  document.getElementsByClassName('alert alert-danger')[0].remove();
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      console.log(request);
      let parser = new DOMParser();
      let doc = parser.parseFromString(request.responseText, "text/html");
      var vt=doc.body.querySelectorAll('.row-eq-height .mb-3');
      var videos=document.querySelectorAll('.row-eq-height .mb-3');
      console.log(videos);
      var i;
      for(i=0;i<videos.length;i++){
        videos[i].addEventListener("click",requestVideo);
        videos[i].setAttribute("url",vt[i].firstElementChild.getAttribute("url"));
      }
    }
  };
  var m='GET';
  if(!document.location.href.includes("/search")){
  	request.open(m, document.location.href);
    request.send();
  }
  else{
    let _token=document.querySelector("[name=_token]").value;
    let query=document.getElementById("searchinput").value;
    let category=document.querySelector("#cat-select [selected]").value;
    m='POST';
    let data="_token="+_token+"&query="+query+"&category="+category;
    request.open(m, document.location.href);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.withCredentials = true;
    request.send(data);
  }
  
})();
function requestVideo(evt){
  evt.preventDefault();
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      var r=JSON.parse(request.responseText);
      console.log(r);
      
      var iframe=document.createElement("IFRAME");
      iframe.src=r.html.match(/https:\/\/[^"]+/);
      iframe.classList.add("card-img-top-v");
      iframe.setAttribute("frameborder","0");
      iframe.allowfullscreen=true;
      iframe.allow="autoplay; fullscreen; picture-in-picture"
      evt.target.parentNode.appendChild(iframe);
      evt.target.parentNode.firstElementChild.remove();
    }
  };
  var m='GET';
  var videoId=evt.target.parentNode.getAttribute("url").split("/");
  var embeddedURL="https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F"+videoId[videoId.length-1];
  request.open(m, embeddedURL);
  request.send();
}