// ==UserScript==
// @name        IsThereCouponForThis
// @name:en     IsThereCouponForThis
// @namespace   https://greasyfork.org/users/2205
// @description Отображает доступные купоны с помощью значка на странице магазина, на виджетах встроенных на форуме и в вишлисте.
// @description:en Show coupons available on game steam store page, on wishlist and on widgets embedded in steamcommunity discussions.
// @license     Apache-2.0
// @author      Rudokhvist
// @include     http://store.steampowered.com/*
// @include     https://store.steampowered.com/*
// @connect     pastebin.com
// @run-at      document-end
// @version     2.8
// @grant       GM.xmlhttpRequest
// @grant       GM_xmlhttpRequest
// @language    English
// @downloadURL https://update.greasyfork.org/scripts/38175/IsThereCouponForThis.user.js
// @updateURL https://update.greasyfork.org/scripts/38175/IsThereCouponForThis.meta.js
// ==/UserScript==
var debug = false;

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

//rate limiting
var getJSONRL = function(url, callback) {
  var Rate=1500; //ms between requests;
    var lastCall=localStorage.getItem ('ITCFTRateLimiter');
    if (lastCall!==null) {
      if ((parseInt(lastCall) + Rate) > Date.now()) {
        window.setTimeout(function(){
          getJSONRL(url,callback);
        },parseInt(lastCall)+Rate-Date.now());
      } else { //already time
        getJSON(url,callback);
        localStorage.setItem('ITCFTRateLimiter',Date.now());
      }
    } else { //first call ever
      getJSON(url,callback);
      localStorage.setItem('ITCFTRateLimiter',Date.now());
    }
};

var elemVisible =function( elem ) {
  if (elem===null) {
    return false;
  } else {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
  }
};

var processWishlist = function (subids,couponMap,container){
      var NewElement=document.createElement("span");
      NewElement.setAttribute("style","font-size:18px;text-align: center;cursor:default;border-radius: 2px 2px 2px; border: 1px solid; user-select: none !important; pointer-events:auto !important; line-height: 1; margin-left: 5px; margin-right: 5px;");
      NewElement.setAttribute("class","platform_img");
      NewElement.setAttribute("tag","coupondata");
      var foundcoupons=0;
      var foundlist="";
      if (subids.length == 0){
          if (debug) {console.log(' placeholder used');}
          NewElement.setAttribute("title","Getting data");
          var img = document.createElement("img");
          img.witdh = 16;
          img.height = 16;
          img.src = "https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif";
          NewElement.appendChild(img);
      } else {
      for (var m=0;m<subids.length;m++) {
        if (couponMap.has(subids[m])) {
          if (foundcoupons>0) {
            foundlist=foundlist+", ";
          }
          foundlist=foundlist+couponMap.get(subids[m]);
          foundcoupons++;
        }
      }
      if (foundcoupons>0) {
        NewElement.setAttribute("title","Coupons: "+foundlist);
        NewElement.appendChild(document.createTextNode("$"));
      } else {
        NewElement.setAttribute("title","No Coupons Found");
        NewElement.appendChild(document.createTextNode("X"));
      }
      }
      var showplace=container.getElementsByClassName('platform_icons')[0];
      if (showplace.querySelector('[tag="coupondata"]')!==null){
          showplace.removeChild(showplace.querySelector('[tag="coupondata"]'));
      }
        var newchild=showplace.appendChild(NewElement);
        newchild.addEventListener('touchstart', function() {
            this.classList.add('touched');
        }.bind(newchild));
};

var processWishlistRow = function(container,couponMap){
      if (container.querySelector('[tag="coupondata"]')!==null){
        return;
      }
      var subidContainer=container.querySelector('[name="subid"]');
      var subids=[];
      if (subidContainer===null) {
        if (debug) {console.log(new Date(Date.now()).toTimeString()+' We dont have subid for '+ container.getElementsByClassName('title')[0].innerText);}
        var appid=container.getAttribute('data-app-id');
        (function(appid,subids,couponMap,container){
        var cachedPackages=sessionStorage.getItem("ITCFTappid"+appid);
        if (cachedPackages===null) {
            if (debug) {console.log(new Date(Date.now()).toTimeString()+' Getting subids for '+ container.getElementsByClassName('title')[0].innerText);}
            processWishlist([],couponMap,container);
        getJSONRL('https://store.steampowered.com/api/appdetails?appids='+appid, function(err, data) {
          if (err !== null) {
            console.log(new Date(Date.now()).toTimeString()+' Something went wrong: ' + err);
          } else {
             subids.lenght=0;
             if (typeof(data[appid].data.packages)!=='undefined') {
               sessionStorage.setItem("ITCFTappid"+appid,data[appid].data.packages.toString());
             for (var w=0;w<data[appid].data.packages.length;w++){
               subids.push(data[appid].data.packages[w].toString());
             }
             if (debug) {console.log(new Date(Date.now()).toTimeString()+' Aquired subids for '+ container.getElementsByClassName('title')[0].innerText+" are: "+subids.toString());}
             processWishlist(subids,couponMap,container);
             } else {
               if (debug) {console.log(new Date(Date.now()).toTimeString()+' No subids aquired for '+ container.getElementsByClassName('title')[0].innerText);}
               //if no subid found - store empty line, to prevent further requests.
               //it will be cached only untill browser restart, so it's fine.
               sessionStorage.setItem("ITCFTappid"+appid,"");
               processWishlist([0],couponMap,container); //show "no coupons"
             }
          }
        });
        } else { //Cached subids
          subids.lenght=0;
          var packages=cachedPackages.split(",");
            for (var x=0;x<packages.length;x++){
               subids.push(packages[x]);
            }
            if (debug) {console.log(new Date(Date.now()).toTimeString()+' Cached subids for '+ container.getElementsByClassName('title')[0].innerText+" are: "+subids.toString());}
            processWishlist(subids,couponMap,container);
        }
        })(appid,subids,couponMap,container);
      } else {
        subids.push(subidContainer.value);
        processWishlist(subids,couponMap,container);
      }
}

var renewWishlist = function(couponMap){
     var containers=document.getElementsByClassName('wishlist_row');
     for (var k=0;k<containers.length;k++) {
         processWishlistRow(containers[k],couponMap);
      var container=containers[k];
    }
};


+function(){
  var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
  var sheet=style.sheet;
  sheet.insertRule("[title] {	border-bottom: 1px dashed rgba(0, 0, 0, 0.2); border-radius:2px; position: relative; }",0);
  sheet.insertRule(".touched[title]:hover:after { position: absolute; bottom: 100%; left: -10%; content: attr(title); border: 1px solid rgba(0, 0, 0, 0.2); background-color: white; color: black !important; box-shadow: 1px 1px 3px; padding: 0.3em; z-index: 1; font-size: 11px !important;}",0);

  var couponMap = new Map();
  GM_xmlhttpRequest({
  method: "GET",
  url: "https://pastebin.com/raw/i8ri7Ne7",
  onload: function(response) {
       var couponlist = response.responseText;
       var couponlistlines = couponlist.split('\n');
       for (var i=1 ; i<couponlistlines.length ; i++) { //start from 1 line to exclude header
         if (couponlistlines[i].startsWith('=====')) break; //stop at first separator, to avoid double records
         var coupondata=couponlistlines[i].split('\t');
         if (coupondata.length>3) {
           var subids=coupondata[3].split(',');
           for (var j=0; j<subids.length; j++) {
             if (couponMap.has(subids[j])) {
                couponMap.set(subids[j],couponMap.get(subids[j])+", "+coupondata[0]);
             } else {
                couponMap.set(subids[j],coupondata[0]);
             }
           }

         }
       }
var timerId = window.setInterval(function WLReady() {
    if (!elemVisible(document.getElementById('throbber'))) {
     clearInterval(timerId);
    //store page
    var containers=document.getElementsByClassName('game_area_purchase_game');
    for (var k=0;k<containers.length;k++) {
      var container=containers[k];
      var subidcontainer=container.querySelector('[name="subid"]');
      if (subidcontainer!==null) {
        var subid=subidcontainer.value;
        var NewElement=document.createElement("span");
        NewElement.setAttribute("style","font-size:18px;text-align: center;cursor:default;border-radius: 2px 2px 2px; border: 1px solid; user-select: none !important; pointer-events:auto !important; line-height: 1; margin-left: 5px; margin-right: 5px;");
        NewElement.setAttribute("class","platform_img");
        if (couponMap.has(subid)){
          NewElement.setAttribute("title","Coupons: "+couponMap.get(subid));
          NewElement.appendChild(document.createTextNode("$"));
        } else {
          NewElement.setAttribute("title","No Coupons Found");
          NewElement.appendChild(document.createTextNode("X"));
        }
        var showplace=container.getElementsByClassName('game_area_purchase_platform')[0];
        var newchild=showplace.insertBefore(NewElement,showplace.firstChild);
        newchild.addEventListener('touchstart', function() {
            this.classList.add('touched');
        }.bind(newchild));
      }
    }
      //forum widgets
      var wcontainer=document.getElementById ('widget');
      if (wcontainer!==null) {
      subid=wcontainer.querySelector('[name="subid"]').value;
      NewElement=document.createElement("span");
      NewElement.setAttribute("style","font-size:18px;text-align: center;cursor:default;border-radius: 2px 2px 2px; border: 1px solid; user-select: none !important; pointer-events:auto !important;");
      NewElement.setAttribute("class","platform_img");
      if (couponMap.has(subid)){
        NewElement.setAttribute("title","Coupons: "+couponMap.get(subid));
        NewElement.appendChild(document.createTextNode("$"));
      } else {
        NewElement.setAttribute("title","No Coupons Found");
        NewElement.appendChild(document.createTextNode("X"));
      }
      showplace=wcontainer.getElementsByClassName('game_area_purchase_platform')[0];
      var newwchild=showplace.appendChild(NewElement);
      newwchild.addEventListener('touchstart', function() {
          this.classList.add('touched');
      }.bind(newwchild));
      }
    //wishlist
      if (document.getElementsByClassName('wishlist_row').length>0) {
          renewWishlist(couponMap);
          var mutationObserver = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                  mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
                      if (currentValue.nodeType == Node.ELEMENT_NODE) {
                          if (currentValue.className == 'wishlist_row'){
                              processWishlistRow(currentValue,couponMap);
                          }
                      }
                  });
              });
          });
          mutationObserver.observe(document.documentElement, {
              childList: true,
              subtree: true
          });
      }

    } //main work
   },100); //SetInterval
  },
  onerror: function() {
      console.log('Error.');
  }
});
}();