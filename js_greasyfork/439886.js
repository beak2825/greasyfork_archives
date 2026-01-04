// ==UserScript==
// @name         Behance Follower
// @namespace    https://t.me/mntxxx
// @version      0.7
// @license MIT
// @description  Script that allows you to automatically subscribe to behance users 
// @author       Islam Morata
// @copyright    Islam Morata (https://greasyfork.org/users/167647)
// @include      *
// @exclude      https://behance.net/*
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?domain=behance.net
// @downloadURL https://update.greasyfork.org/scripts/439886/Behance%20Follower.user.js
// @updateURL https://update.greasyfork.org/scripts/439886/Behance%20Follower.meta.js
// ==/UserScript==


(function () {
  const PATH = document.location.pathname.includes("search");
  const BTN_FOLLOW = ".Users-followButton-_oK";
  const BTN_UNFOLLOW = ".Users-followButton-_oK.Btn-secondary-Ine";
  const NAME = ".e2e-UserSummary-displayName";
  const MAX_FOLLOW = 250;

  let status = (name) => {
    $("#status span").text(`${name}`)
}

  if (PATH == true) {

    // add "Start Follower" button
    $(".FilterBar-filters-KZV").append(`
    <div class='ProfileCard-interactionButton-zN5 ProfileCard-editButton-Hlb'>
    <a
      id='btn-start-follower'
      type='button'
      target='_self'
      role='button'
      class='Btn-button-CqT Btn-primary-wt8
              Btn-mediumLarge-EdB
              ProfileCard-buttonWrapper-CMp
              e2e-Profile-editProfileButton
      '
    >
      <div class='Btn-labelWrapper-_Re ProfileCard-buttonLabel-GYl'>
        <div class='Btn-label-QJi e2e-Btn-label'>Start Follower</div>
      </div>
    </a>
    </div>`);

    // add Status block
    $(".FilterBar-filters-KZV").append(`
    <div id='status' style="margin-left: 5px" class='ProfileCard-interactionButton-zN5 ProfileCard-editButton-Hlb'>
    <div
      class='Btn-button-CqT 
              Btn-mediumLarge-EdB
              ProfileCard-buttonWrapper-CMp
              e2e-Profile-editProfileButton
      '
    >
      <div class='Btn-labelWrapper-_Re ProfileCard-buttonLabel-GYl'>
        <div class='Btn-label-QJi e2e-Btn-label'>Status: <span>Waiting</span></div>
      </div>
    </div>
    </div>`);


    $("#btn-start-follower").on("click", function (event) {

        alert("Script is ready. Do not reload the page.")
    
    
        let intervalScroll = setInterval(() => {
            status("Loading")
            $(document).scrollTop(100000);
              if ($(`${BTN_FOLLOW}`).length >= MAX_FOLLOW) {
                clearInterval(intervalScroll);
                status("Working")
                let pnum = 0; // person number
                let inum = 0; // iteration number
                let follower = setInterval(() => {
        
                   let isFollowed = $(`${BTN_FOLLOW}`)[pnum]["className"].includes('Btn-secondary-Ine')
        
                   if (isFollowed == false) {
        
                    $(`${BTN_FOLLOW}:eq(${pnum})`).trigger("click");
                    console.log(`${pnum}: You've followed ${$(`${NAME}`)[pnum].innerText}`)
                    inum++;
                   }  else {
                    console.log(`${pnum}: You’re already following ${$(`${NAME}`)[pnum].innerText}`)
                   }
                   
                   pnum++;
                   
                   if(pnum > MAX_FOLLOW) {
                    $(document).scrollTop(100000);
                   }
               
                    if(inum > MAX_FOLLOW) {
                        status("Done")
                        clearInterval(follower);
                    }
        
                }, 5000)
        
              }
        }, 2500)
    
    });

  }
})();