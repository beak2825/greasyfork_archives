// ==UserScript==
// @name        Add Link To Remove Old/Crowded Reddit Posts
// @namespace   AddLinkToRemoveOldCrowdedRedditPosts
// @description Add a link on Reddit tab bar to remove posts on front page or subreddit in N number of pages which are older than N hours or has more than N number of comments.
// @include     https://www.reddit.com/*
// @version     1.1.1
// @author      jcunews
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27060/Add%20Link%20To%20Remove%20OldCrowded%20Reddit%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/27060/Add%20Link%20To%20Remove%20OldCrowded%20Reddit%20Posts.meta.js
// ==/UserScript==


//increase this wait time if subsequent page processing didn't work.
//for proper use, after the page has been loaded, the link won't show after before period.
//i.e. when network is slow
var networkWaitTime = 500; //time in milliseconds


setTimeout(function() {
  if (!document.querySelector(".content > .spacer > .sitetable .hide-button")) return;
  var ele = document.createElement("SCRIPT");
  ele.innerHTML = "(" + (function() {

    //*** settings start ***
    var maxAge      = 17; //in hours
    var maxComments = 1000;
    var maxNumPages = 2;
    //*** settings end ***

    //initialize variables
    var config = JSON.parse(sessionStorage.removeOldCrowdedPosts || "{}"), index = -1;
    var postsToHide, link, indicatorCurtain, indicatorMessagePanel;
    config.pageCount = config.pageCount || 0;
    //prepare posts removal indicator message
    indicatorCurtain = document.createElement("DIV");
    indicatorCurtain.style.cssText = "position: fixed; z-index: 99; left: 0; top: 0; right: 0; bottom: 0; opacity: 0.66; background: black";
    indicatorMessagePanel = document.createElement("DIV");
    indicatorMessagePanel.style.cssText = "position: fixed; z-index: 100; left: 30%; top: 40%; right: 30%; background: red; color: white; text-align: center; line-height: 3em; font-size: 20pt; font-weight: bold";
    indicatorMessagePanel.textContent = "Hiding posts...";

    //add the link if not already added
    function addLink() {
      var tabmenu = document.querySelector("#header-bottom-left .tabmenu");
      if (!tabmenu || link) return;
      link = document.createElement("A");
      link.textContent = "Remove Old/Crowded";
      link.style.marginLeft = "3ex"
      link.href = "javascript:void(0)";
      link.onclick = startRemovePosts;
      tabmenu.appendChild(link);
    }

    //check whether to process next page or not
    function checkForNextPage() {
      config.pageCount--;
      sessionStorage.removeOldCrowdedPosts = JSON.stringify(config);
      if (config.pageCount) {
        //there are more pages to process. click the next-page link
        var link = document.querySelector(".sitetable .next-button a");
        if (link) {
          link.click();
        }
      } else {
        //no more page to process. add the link
        addLink();
        document.body.removeChild(indicatorMessagePanel);
        document.body.removeChild(indicatorCurtain);
      }
    }

    //remove the posts
    function removePosts() {
      var posts = document.querySelectorAll(".content > .spacer > .sitetable > .thing");
      var time = (new Date()).valueOf(), maxAgeMs = maxAge*3600000;
      var i, postTime, comments, link;

      //add matching posts in current page into hide-list
      postsToHide = [];
      for (i = posts.length-1; i >= 0; i--) {
        //get post's time
        postTime = parseInt(posts[i].getAttribute("data-timestamp"));
        //get post's number of comments
        comments = parseInt(posts[i].querySelector(".comments").textContent.match(/\d+/)[0]);
        //main decision
        if (((time-postTime) > maxAgeMs) || (comments > maxComments)) {
          //add post's hide link into hide-list
          link = posts[i].querySelector(".hide-button a");
          if (link) {
            postsToHide.push(link);
          }
        }
      }
      if (postsToHide.length) {
        //has post(s) to hide. show posts removal indicator message
        document.body.appendChild(indicatorCurtain);
        document.body.appendChild(indicatorMessagePanel);
        //hide the first post in the hide-list
        postsToHide.splice(0, 1)[0].click();
      } else {
        //no post to hide. check for next page
        checkForNextPage();
      }
    }

    //start removing posts
    function startRemovePosts() {
      if (!navigator.onLine) {
        alert("Web browser is offline.");
        return;
      }
      config.pageCount = maxNumPages;
      sessionStorage.removeOldCrowdedPosts = JSON.stringify(config);
      removePosts();
    }

    //setup network-post callback
    window._change_state = window.change_state;
    window.change_state = function(e, t, n, i, s) {
      var _s = s, link;
      if ((t === "hide") && (n === window.hide_thing)) {
        s = function() {
          if (postsToHide.length) {
            //has more post(s) to hide. hide the next one in the hide-list
            postsToHide.splice(0, 1)[0].click();
          } else {
            //all hide network requests has completed. check for next page
            checkForNextPage();
          }
          if (_s) {
            return _s.apply(this, arguments);
          }
        };
      }
      return window._change_state(e, t, n, i, s);
    };

    //check whether posts removal is in effect
    if (config.pageCount) {
      //posts removal is in effect. process it
      removePosts();
    } else {
      //posts removal is not in effect, or no more pages to process. add the link
      addLink();
    }

  }).toString() + ")()";
  document.head.appendChild(ele);
}, networkWaitTime);
