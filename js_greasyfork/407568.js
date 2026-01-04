// ==UserScript==
// @name         See people who visited/liked your profile on Meetic for free
// @namespace    StephenP
// @version      1.2.3
// @description  See the profile of the people who visited or liked your profile on Meetic without having a premium account. 
// @author       StephenP
// @icon				 data:image/x-icon;base64,AAABAAEAICAQAAEABADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/F+0AhjnuAIlD7gCPUfAAoXDzALGI9AC5lvUAx6z3ANC69wDcyvoA49X6APDm/QD48/4A+fr+AP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANVMAAAAAAAAAAAAAAAAANrmbYwAAAAAAAAAAAAABSL3pneuEEAAAAAAAAAABat7bczi97aYQAAAAAAAAOd3IQgAAJIzeowAAAAAAA73XMQAAAAADfNswAAAAABjcUAAAAAAAAAXOgQAAAAA81gAAAAAAAAAAbcMAAAAAXbQzMzMxEzMzM0zVAAAAAG3tzM3cyZ3N3c3d5gAAAABu7d3d3dme7c3NzuUAAAAATLQzMznojpMzM0vUAAAAACvoEABc1E3FEAGNsgAAAAAGzaZZzYAY7IVq7WAAAAAAAGzt3sggAo3u3sYAAAAAAAADeZhBAAAEiZcwAAAAAAAAAAEAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @include      https://www.meetic.tld/d/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407568/See%20people%20who%20visitedliked%20your%20profile%20on%20Meetic%20for%20free.user.js
// @updateURL https://update.greasyfork.org/scripts/407568/See%20people%20who%20visitedliked%20your%20profile%20on%20Meetic%20for%20free.meta.js
// ==/UserScript==
var interval_0;
var interval_1;
var href="";
const r = /\d+/;
(function(){
  interval_1=setInterval(function(){startCheck();},200);
})();
function startCheck(){
  if(window.location.href!=href){
    clearInterval(interval_0);
    if(window.location.href.includes("d/activities/visits/received")){
      interval_0=setInterval(function(){getLikes("visits",1,0)},500);
    }
    else if(window.location.href.includes("d/activities/favorites/received")){
      interval_0=setInterval(function(){getLikes("favorites",1,0)},500);
    }
    href=window.location.href;
	}
}
function getLikes(interactionType,pageNum,pagesTot){
  try{
    if((document.getElementsByClassName("card-list").length>0)&&(pagesTot==0)){
        pagesTot=Math.trunc(document.getElementsByClassName("interactions-page-sub-title__label")[0].innerHTML.match(r)/50)+1;
    }
    if(pagesTot!=0){
      var accesstoken=getCookie("accesstoken");
      if(accesstoken!==""){
        clearInterval(interval_0);
        var domain='www'+window.location.href.slice(window.location.href.indexOf('.'),window.location.href.indexOf('/',8));
        var url='https://'+domain+'/apida/interactions?direction=received&include=members,interactions&list='+interactionType+'&page='+pageNum+'&per_page=50&scam=0&with_format_picture=medium_blurred,full,little,medium,four_fifth';
        GM.xmlHttpRequest({
          method: "GET",
          url: url,
          headers: {
            'Host': domain,
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://'+domain,
            'Authorization': 'Bearer '+accesstoken
          },
          onload: function(response) {
            try{
              var people=JSON.parse(response.responseText)['interactions'];
              if(people.length>0){
                interval_0=setInterval(function(){writeNames(people,domain,pageNum,pagesTot,interactionType)},1000);
              }
            }
            catch(err){
              console.log(err);
            }
          }
        });
      }
    }
  }
  catch(err){
    console.log(err);
  }
}
function getCookie(cname) {//function taken from w3schools
  try{
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
  }
  catch(err){
    console.log(err);
  }
}
function writeNames(people,domain,pageNum,pagesTot,interactionType){
  var page=document.getElementsByClassName("card-list");
  if(page.length>0){
    clearInterval(interval_0);
    page[0].style.display="none";
    page[0].style.height="auto";
    page[0].innerHTML="";
    var profileId="";
    var date="";
    var list='<table style="width: 100%"><tr style="font-weight: bold; height: 2em;"><td style="padding: 5px; text-align: right">Profile ID</td><td style="padding: 5px">Timestamp</td></tr>';
    for(var i=0;i<people.length;i++){
      try{
        profileId=people[i]['links']['sender'];
        date = new Date(people[i]['date']);
        list+='<tr><td style="padding: 5px; width: 50%; text-align: right';
        list+='"><a href="https://'+domain+'/d/profile-display/'+profileId+'">'+profileId+'</a></td><td style="padding: 5px">'+date.toLocaleString()+'</td></tr>';
      }
      catch(err){
        console.log(err);
      }
    }
    list+='</table>';
    page[0].innerHTML=list;
    if(pagesTot>1){
      var pgup = document.createElement("BUTTON");
      pgup.innerHTML = "+";
      var pgdown = document.createElement("BUTTON");
      pgdown.innerHTML = "-";
      var currentPage = document.createElement("SPAN");
      currentPage.innerHTML= pageNum+"/"+pagesTot;
      pgup.setAttribute("class","interaction-card__action-button");
      pgdown.setAttribute("class","interaction-card__action-button");
      pgup.style.display="inline";
      pgdown.style.display="inline";
      pgup.style.width="5rem";
      pgdown.style.width="5rem";
      if(pageNum<pagesTot){
        pgup.addEventListener('click',function(){getLikes(interactionType,pageNum+1,pagesTot)});
      }
      else{
        pgup.setAttribute("disabled",true);
      }
      if(pageNum>1){
        pgdown.addEventListener('click',function(){getLikes(interactionType,pageNum-1,pagesTot)});
      }
      else{
        pgdown.setAttribute("disabled",true);
      }
      var buttonsContainer=document.createElement("DIV");
      buttonsContainer.style.textAlign="center";
      buttonsContainer.style.padding="10px";
      currentPage.style.padding="10px";
      page[0].appendChild(buttonsContainer);
      buttonsContainer.appendChild(pgdown);
      buttonsContainer.appendChild(currentPage);
      buttonsContainer.appendChild(pgup);
    }
    page[0].style.display="block";
  }
}