// ==UserScript==
// @name         Behance Unfollower
// @namespace    https://t.me/mntxxx
// @version      0.3
// @license MIT
// @description  Script that allows you to automatically unfollow people on behance 
// @author       Islam Morata
// @copyright    Islam Morata
// @include    *
// @exclude      https://behance.net/*
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?domain=behance.net
// @downloadURL https://update.greasyfork.org/scripts/440640/Behance%20Unfollower.user.js
// @updateURL https://update.greasyfork.org/scripts/440640/Behance%20Unfollower.meta.js
// ==/UserScript==



(function () {
    const PATH = document.location.pathname.includes("following");
    const BTN_UNFOLLOW = ".js-action-follow";
    const MODAL_SCROLL = '.ScrollableModal-scrollableTarget-IZX'
    const MAX_UNFOLLOW = 500;
    const SCROLL_USERS = 2000;


    let scrollStop = () => {
      let сountOfSubscriptions = 0;
      for (let i = 0; i < $(".UserInfo-statRow-wH9  a").length; i++) {
        if($(".UserInfo-statRow-wH9 > .UserInfo-statColumn-NsR:first-child")[i].innerText == "Подписки") {
          сountOfSubscriptions = $(".UserInfo-statRow-wH9  a")[i].innerText.replace(/\s+/g, "") - 0;
        }
      }

      if(сountOfSubscriptions < SCROLL_USERS) {
        return сountOfSubscriptions - 1;
      } 
      else {
        return SCROLL_USERS;
      }

    }

    // id of users that cannot be unfollowed 
    let forbiddenId = [
      108096389, // tsokaev
      29933251, // veuzat
      147687927, // gmb
      646763755, // umalatov
      467728187, // morata
      17644167, // tatriev
      108096389, // nazir g
      132005473, // makhaury
      560977307, // nurkhan
      896073491, // hasu
      1130844783, // djota
      1776807 // tam aziev
    ]

    let userId = (id) => {
        return $(".user-follow")[id].getAttribute("data-followee") - 0;
    }

    let name = (id) => {
      return $(".e2e-ProfileRow-link")[id].innerText;
  }

  
    let status = (name) => {
      $("#status span").text(`${name}`)
  }
  
    if (PATH == true) {
        
      // add "Start Unfollower" button
      $(".FollowPopup-tabs-HCl").append(`
      <li id='unfollow' class='FollowPopup-tab-m9n'><a href='#' class='FollowPopup-anchor-Png'>Start Unfollower</a></li>`);

      // add Status block
      $(".FollowPopup-tabs-HCl").append(`
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
  
  
      $("#unfollow").on("click", function (event) {
  
          alert("Script is ready. Do not reload the page.")
      
      
          let intervalScroll = setInterval(() => {
              status("Loading")
              $(`${MODAL_SCROLL}`).scrollTop(99999999)


                if ($(`${BTN_UNFOLLOW}`).length >= scrollStop()) {
                  clearInterval(intervalScroll);
                  status("Working")
                  let pnum = scrollStop(); // person number
                  let inum = 0; // iteration number


                  let unfollower = setInterval(() => {
       
                     if (forbiddenId.includes(userId(pnum)) == false) {

                      $(`${BTN_UNFOLLOW}:eq(${pnum})`).trigger("click");
                      console.log(`${pnum}: You've unfollowed ${name(pnum)}`)
                      inum++;
                     } 

                     pnum--;

                      if(inum > MAX_UNFOLLOW) {
                          status("Done")
                          clearInterval(unfollower);
                      }
          
                  }, 3000)
          
                }
          }, 2500)
      
      });
  
    }
    
  })();








