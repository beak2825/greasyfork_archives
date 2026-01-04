// ==UserScript==
// @name        	Steam Error Widget Helper
// @namespace   	https://greasyfork.org/users/2205
// @description	 	For error widgets shows steamdb.info link and game name (if possible).
// @author          Rudokhvist
// @include     	http://store.steampowered.com/*
// @include     	https://store.steampowered.com/*
// @run-at      	document-end
// @version     	1.4
// @language        English
// @connect         api.steampowered.com
// @connect         steamcommunity.com
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39492/Steam%20Error%20Widget%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/39492/Steam%20Error%20Widget%20Helper.meta.js
// ==/UserScript==

var appid;

var getName = function(url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
                   //console.log(response);
                   if (response.status === 200) {
                       let res = /<title>(.+)\s::\s(.+)<\/title>/.exec(response.response);
                       let name = null;
                       if (res != null) {
                           name = res[2].trim();
                           if (name === "Steam Community") {
                               name = res[1].trim()
                           }
                       }
                       callback(name)

                   } else {
                         callback(null);
                   }
        },
        onerror: function() {
           console.log('Error.');
        },
        ontimeout: function() {
           console.log('Error.');
        }
    });

};

//rate limiting
var getNameRL = function(url, callback) {
  var Rate=1500; //ms between requests;
    var lastCall=localStorage.getItem ('ITCFTRateLimiter');
    if (lastCall!==null) {
      if ((parseInt(lastCall) + Rate) > Date.now()) {
        window.setTimeout(function(){
          getNameRL(url,callback);
        },parseInt(lastCall)+Rate-Date.now());
      } else { //already time
        getName(url,callback);
        localStorage.setItem('ITCFTRateLimiter',Date.now());
      }
    } else { //first call ever
      getName(url,callback);
      localStorage.setItem('ITCFTRateLimiter',Date.now());
    }
};

+function(){

      //forum widgets
      var wcontainer=document.getElementById ('widget');
      if (wcontainer!==null) {
        var appimagecontainers=wcontainer.getElementsByClassName('capsule');
        if (appimagecontainers.length===0) {
            appid=window.location.href.match(/(http.{0,1}:\/\/store\.steampowered\.com\/)(.*)\/(\d+)(.*)/)[3];
              getNameRL('https://steamcommunity.com/app/'+appid, function(gamename) {
              let ImageElement = document.createElement("img");
              ImageElement.setAttribute("style","margin:5px;float:right");
              ImageElement.setAttribute("src","https://cdn.akamai.steamstatic.com/steam/apps/"+appid+"/capsule_184x69.jpg")
              wcontainer.appendChild(ImageElement);
	          let NewElement=document.createElement("div");
              NewElement.setAttribute("class","desc");
              let NameElement=NewElement.appendChild(document.createElement("p"));
              NameElement.setAttribute("style","font-size: 20px !important; line-height: 28px !important");
              let SteamUrlElement=NameElement.appendChild(document.createElement("a"));
              SteamUrlElement.setAttribute("style", "color: #898a8c !important;");
              SteamUrlElement.setAttribute("href","https://store.steampowered.com/app/"+appid);
              SteamUrlElement.setAttribute("target","_blank");
              if (gamename===null) {
                SteamUrlElement.appendChild(document.createTextNode("Unknown app "+appid));
              } else {
                SteamUrlElement.appendChild(document.createTextNode(gamename));
              }
              let UrlElement=NewElement.appendChild(document.createElement("a"));
              UrlElement.setAttribute("href","https://steamdb.info/app/"+appid);
              UrlElement.setAttribute("style","color: #898a8c !important; text-decoration: underline !important; line-height: 20px !important");
              UrlElement.setAttribute("target","_blank");
              UrlElement.appendChild(document.createTextNode("View on Steam Database ("+appid+")"));
              let showplace=wcontainer.appendChild(NewElement);
          });
        }
      }
}();