// ==UserScript==
// @name         Paidlikes auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Like/follow automatically on Facebook, opne auto on paidlikes
// @author       LOLO
// @match        *://www.facebook.com/watch/?v=*
// @match        *://www.facebook.com/*/posts/*/
// @match        *://www.facebook.com/*/photos/*
// @match        *://www.facebook.com/*/
// @match		 		 *://paidlikes.de/memberarea/likes_campaigns
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/393866/Paidlikes%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/393866/Paidlikes%20auto.meta.js
// ==/UserScript==


(function() {

	if(document.location.toString().includes('paidlikes.de/memberarea/likes_campaigns')){

      var links;
      var second = [];

      var $tabManager = $('.js-like-tab-manager');
      var $tabContents = $tabManager.find('*[data-tab-content-for-typ-id]');
      var $loadButtons = $tabContents.find('.js-load-likes-first-time');

      for(var i=0;i<$loadButtons.length;i++){
        $loadButtons[i].click();
      }

      setTimeout(function(){ links = document.querySelectorAll('tr[data-campaign-id][class=available-like]'); open(); }, 50000); //50 secs

      //setTimeout(function(){ location.reload(); }, 1800000); //30 min


      function open(){
          var campaigns = [];

          for(var i=0;i < links.length;i++){
              if(links[i] == ""){continue;}else{
                  campaigns.push(links[i].getAttribute("data-campaign-id"));
                  second.push(links[i]);
              }
          }

          for(var i=0;i<campaigns.length;i++){
              var url = "https://paidlikes.de/memberarea/linkToCampaign/"+campaigns[i];
              window.open(url);
              setTimeout(function(){ check(); }, 300 * 1000); //5 min
          }
      }

      function check(){
          var btns = document.querySelectorAll('*[class="btn-for-like-refresh js-refresh-like-table"]');
          for(var i=0;i<btns.length;i++){
              btns[i].click();
          }
          setTimeout(function(){
              var templinks = document.querySelectorAll('tr[data-campaign-id][class=available-like]');
              var len = templinks.length;
              if(len > 0){
                  links = [];
                  for(i=0;i<len;i++){
                      for(var a=0;a < links.length;a++){
                          if(templinks[i] == links[i]){
                              templinks[i] == "";
                          }
                      }
                  }
                  for(var x=0;x<len;x++){
                      if(templinks[x] != ""){
                          links += templinks[x];
                      }
                  }
                  open();
              }

          }, 5 * 60 * 1000); //5min

      }
    
    }else{

      var normalmatches = ["/watch/?v=","/posts/","/photos/"];

      function checknormal(){
          for(var i=0;i<normalmatches.length;i++){
              if(window.location.href.split(normalmatches[i]).length > 1){
                  return true;
              }
          }
          return false;
      }

      window.onload = function () {

          if (checknormal()){
              normal();
          }else if(window.location.href.split("facebook.com/").length > 1){
              fanpage();
          }else{
              alert("Error wrong location");
          }
      }


      function normal(){
          var aTags = document.querySelectorAll('a[aria-pressed="false"]');
          if(aTags.length < 1){setTimeout(function(){window.close();}, 1000);}
          var searchText = "Gefällt mir";
          for (var i = 0; i < aTags.length; i++){
              if (aTags[i].textContent == searchText){
                  aTags[i].click();
                  break;
              }
          }

          setTimeout(function(){window.close();}, 1000);
          setTimeout(function(){window.location="https://forceclose.netlify.com/";}, 1100);
      }

      function fanpage(){
          var likebtn = document.getElementsByClassName('likeButton');
          if(likebtn[0]){
              likebtn[0].click();
          }
          setTimeout(function(){window.close();}, 1000);
          setTimeout(function(){window.location="https://forceclose.netlify.com/";}, 1100);
      }
    
    }

})();