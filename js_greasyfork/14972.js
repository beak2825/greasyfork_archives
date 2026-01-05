// ==UserScript==
// @name        Wanikani Procrastination Annihilation
// @namespace   mempo
// @description Hides the forums until you've completed some reviews
// @include     https://www.wanikani.com/*
// @version     1.2.3.4
// @grant       none  
// @downloadURL https://update.greasyfork.org/scripts/14972/Wanikani%20Procrastination%20Annihilation.user.js
// @updateURL https://update.greasyfork.org/scripts/14972/Wanikani%20Procrastination%20Annihilation.meta.js
// ==/UserScript==

  console.log('started Wanikani Procrastination Annihilation BETA');
  
  var currentTime = new Date().getTime();
  var debug = false; //TODO: change into method for 1-refresh-reinit
  var initialSettings =  ({
    'apiKey': "",
    'lastUnlock': 0,
    'lastReviewAmount': 0,
    'unlockPercentage': 0.5,
    'onLockDown': false,
    'resetTime': 1800000, //Half hour: 30min * 60sec * 1000ms
    'offset': 30
  });

  //console.log(initialSettings);
  //$.jStorage = unsafeWindow.$.jStorage;


  var settings = $.jStorage.get('WPA_Settings');
  console.log(settings);
  
  if(settings === null){ //not initialized yet
    console.log('#### no settings found');
    
    if (window.location.href.indexOf('account') != - 1) {
          initialSettings.apiKey = "" + retrieveAPIkey();
          settings = initialSettings;
          console.log('@@@@@' + initialSettings.apiKey);
    } else {
          var okcancel = confirm('Wanikani Procrastination Annihilation has no API key entered!\nPress OK to go to your settings page and retrieve your API key!');
          if (okcancel == true) {
              window.location = 'https://www.wanikani.com/settings/account';
              return;
          }
    }
    
    
    $.jStorage.set('WPA_Settings', JSON.stringify(settings));
    console.log('settings loaded in jstorage');
    
    //GO BACK TO DASHBOARD
    window.location = 'https://www.wanikani.com/dashboard';
    return;

    /* TODO: find a way to look up API key without leaving dashboard
    var settingsHTML = $.get( "https://www.wanikani.com/settings/account.html", function(html) {
         retrieveAPIkey(html);
      })
      .fail(function() {
        alert( "WPA error: The API key could not be located" );
      });
      
     */
    
  }else{
    settings = $.parseJSON(settings);
    console.log("##### found the settings!");
  }
  
  console.log('//////////////////////////////');
  console.log('apiKey is ' + settings.apiKey);
  console.log('lastUnlock is ' + settings.lastUnlock);
  console.log('lastReviewAmount is ' + settings.lastReviewAmount);
  console.log('onLockDown is ' + settings.onLockDown);
  console.log('//////////////////////////////');

  
/*********************************************************************************
*                                                                                *
*                                    checkPageRedirection                        *
*                                                                                *
**********************************************************************************/
  
  if (window.location.href.indexOf('chat') != -1 || window.location.href.indexOf('community') != -1) {
      if(settings.onLockDown === true){
          alert("I'm very sorry, but the forums are on lockdown. Complete some reviews to unlock them!");
          window.location = 'https://www.wanikani.com/review';
      }else {
          console.log("well go on, the forums are unlocked!");
      }
  }
      
  if (window.location.href.indexOf('dashboard') != -1 || window.location.href === "https://www.wanikani.com/") {
      displaySettings();
      checkLockDown();
  }

/* TODO: for next update
  if (window.location.href.indexOf('review/session') != -1) {
      console.log('doing reviews!');
    
    var currentReviewAmount = $.jStorage.get('activeQueue').length + $.jStorage.get('reviewQueue').length;
    console.log("//////////total amount of reviews at start is: " + currentReviewAmount);
    $.jStorage.listenKeyChange('completedCount', function(){
      var currentCompletedAmount  = $.jStorage.get('completedCount');
      if(currentCompletedAmount >= (1 - settings.unlockPercentage) * currentCompletedAmount){
        console.log('§§§§§§§§ Did sufficient amount of reviews! Forums unlocked');
        $('#summary-button').after('<div id="forum-unlocked-message"><h2>Forums unlocked!</h2></div>');
      }
    });
  }
*/

/*********************************************************************************
*                                                                                *
*                                    save Settings                               *
*                                                                                *
**********************************************************************************/

if(!debug){
  $(window).unload(function(){
      $.jStorage.set('WPA_Settings', JSON.stringify(settings));
      console.log('WPA: saved settings');
  });
}else{
  $.jStorage.deleteKey('WPA_Settings');
}

  
/*********************************************************************************
*                                                                                *
*                                    checkLockDown                               *
*                                                                                *
**********************************************************************************/
  



function checkLockDown(){
  console.log('inside checklockdown function');
  console.log('resettime is ' + settings.resetTime);
  console.log('difference in time is '+ (currentTime - settings.lastUnlock) );
  
  var currentReviewAmount = 0;
  
  $.getJSON('https://www.wanikani.com/api/user/'+ settings.apiKey +'/study-queue', function(data){
      setTimeout(function() {
      if(data.error){
          alert("API Error: "+data.error.message);
      }else{
          currentReviewAmount = data.requested_information.reviews_available;
          console.log("current amount of reviews is " + currentReviewAmount);
          console.log("last amount of reviews is " + settings.lastReviewAmount);
          console.log("time to reset is " + ((settings.lastUnlock + settings.resetTime) < currentTime));
                
                
               if(!settings.onLockDown){ //Unlocked
                   if((settings.lastUnlock + settings.resetTime) < currentTime){
                        if(currentReviewAmount > settings.offset){
                            lockForums(currentReviewAmount);
                        }else{
                            console.log('reviews < offset');
                            showForums();
                        }
                    }else {
                        showForums();
                        if(currentReviewAmount < settings.lastReviewAmount){
                            settings.lastReviewAmount = currentReviewAmount;
                        }
                    }
                 
                } else { //Locked
                  if(currentReviewAmount <= (settings.lastReviewAmount * (1-settings.unlockPercentage))) { //Locked && Reviews DONE
                    unlockForums(currentTime,currentReviewAmount);
                  }else{ //Locked && Reviews TODO
                    hideForums();
                    console.log('not done enough reviews yet');
                  }


                }

              } 
	    }, 0);
	});
}

/////////////////////////

function retrieveAPIkey() { 
  var apiKey;
  apiKey = document.getElementById('user_api_key').value;
  alert('API key was set to: ' + apiKey);
  if (apiKey) {
    return apiKey;
  }
}

function displaySettings() {
    
$('section.forum-topics-list').after(
                '<section id="proc">'+
                '  <style id="proc_style"></style>'+
                '  <p class="showOnLockDown">Sorry, the forums are on lockdown. Complete some reviews before you can socialize again.</p> ' +
//                '  <a id="proc_settings-lnk" class="link">[settings]</a>'+
                '</section>'
);
}

function lockForums(currentReviewAmount){
  settings.lastReviewAmount = currentReviewAmount;
  settings.onLockDown = true;
  console.log('locked forums');
  console.log('currentReviews are ' + currentReviewAmount);
  hideForums();
}

function unlockForums(currentTime,currentReviewAmount){
  settings.onLockDown = false;
  settings.lastUnlock = currentTime;
  settings.lastReviewAmount = currentReviewAmount;

  console.log('unlocked forums');
  console.log('last review amount is ' + currentReviewAmount);
  console.log('last unlock is ' + currentTime);

  
  showForums();
}

function hideForums(){
  var forumPanels = document.getElementsByClassName("forum-topics-list");
  forumPanels[0].style.display = "none";
  if(forumPanels.length === 2){
    forumPanels[1].style.display = "none";
  }
  
  document.getElementsByClassName("showOnLockDown")[0].style.display = "block";
}

function showForums(){ 
  var forumPanels = document.getElementsByClassName("forum-topics-list");
  forumPanels[0].style.display = "block";
  if(forumPanels.length === 2){
    forumPanels[1].style.display = "block";
  }
  document.getElementsByClassName("showOnLockDown")[0].style.display = "none";

}
