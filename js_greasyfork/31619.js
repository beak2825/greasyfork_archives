// ==UserScript==
// @name         Steemit Post Vote Slider and Past Payout Monetizer
// @namespace    https://steemit.com/@alexpmorris
// @version      0.17
// @description  enables slider for steemians with at least 72SP, and allows monetizing posts after 7 days via comments!
// @author       @alexpmorris
// @source       https://github.com/alexpmorris/SteemitPostVoteSliderAndPastPayoutMonetizer
// @match        https://steemit.com/*
// @grant        none
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.0/jquery.scrollTo.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/31619/Steemit%20Post%20Vote%20Slider%20and%20Past%20Payout%20Monetizer.user.js
// @updateURL https://update.greasyfork.org/scripts/31619/Steemit%20Post%20Vote%20Slider%20and%20Past%20Payout%20Monetizer.meta.js
// ==/UserScript==

// to avoid conflicts if using "Hide Resteems" (HR) with "Steemit Post Vote Slider and Past Payout Monetizer" (SPVS),
// TamperMonkey *must load* HR first (ie. "Settings -> Position" should be lower for HR than for SPVS)!

// For those with sub-100 SP, you must still use caution when voting more frequently,
// lest you receive the dreaded "Bandwidth Limit Exceeded" notification!  For more information:
// https://steemit.com/witness-category/@timcliff/new-accounts-don-t-have-enough-sp-to-fully-interact-with-the-blockchain-should-witnesses-update-the-max-block-size-discussion
// https://steemit.com/witness/@ausbitbank/ausbitbank-witness-update-17-7-17-sbd-interest-changed-to-1

(function() {
    'use strict';

    var minVests = 150000;  // approximately 72 SP
    var postCutOffDays = 6.25;  // 6.5 seems too close to 12hr "window"???
    var currentPostAgeInDays = 0;
    var altCommentElem = null;
    var altCommentProps = null;
    var altCommentState = null;
    var postAuthor = "";
    var altPostMode = false;
    var lastPathStr = "";
    var lastQueryStr = "";
    var totPosts = 0;
    var lastVoteTm = 0;
    var lastNotifyTm = 0;
    var lastChkTm = 0;

    window.FindReact = function(dom) {
        for (var key in dom) {
            if (key.startsWith("__reactInternalInstance$")) {
                var compInternals = dom[key]._currentElement;
                var compWrapper = compInternals._owner;
                var comp = compWrapper._instance;
                return comp;
            }
        }
        return null;
    };

    function triggerRefresh(cnt) {
        if ((cnt===null) || (cnt !== totPosts)) {
            totPosts = cnt;
            lastPathStr="";
        }
    }

    function urlCheckFunction() {
        if (lastPathStr !== location.pathname || lastQueryStr !== location.search ||
            lastPathStr === null || lastQueryStr === null) {
            var tickCountTm = new Date().getTime();
            if ((lastChkTm === 0) || (tickCountTm-lastChkTm < 750)) {  // allows a bit more time for AJAX responses to update DOM
                if (lastChkTm === 0) lastChkTm = tickCountTm;
                return;
            } else lastChkTm = 0;
            lastPathStr = location.pathname;
            lastQueryStr = location.search;
            updatePostVoteButtons();
        }
    }

    var steemitURLCheckTimer = setInterval (function() { urlCheckFunction(); }, 250);

    waitForKeyElements ("#posts_list", domCreateHooks);

    function domCreateHooks() {
        //to capture ajax additions to feeds
        var elem = $("#posts_list").parent();
        $(elem).unbind('DOMSubtreeModified.pvs');
        $(elem).on('DOMSubtreeModified.pvs', "div", function () {
            triggerRefresh($("#posts_list ul").length);
        });
        lastPathStr="";
    }

    $(document).click(function (event) {
        if (!$(event.target).parents("#tmpVoteSlider").length) {
            $("#tmpVoteSlider").remove();
        }
    });

    function updatePostVoteButtons() {

        currentPostAgeInDays = 0;
        altCommentElem = null;
        altCommentProps = null;
        altCommentState = null;
        postAuthor = "";

        $("#tmpVoteSlider").remove();

        $(".Voting__button-up svg g circle").attr('fill','rgb(255,255,200)');

        $(".PostFull .Voting__button-up").each( function() {
           var props = FindReact(this).props;
           postAuthor = props.author;
           if (currentPostAgeInDays === 0) {
               if (props.post_obj._root.nodes[3].nodes[1].entry[1] == "0.000 SBD") currentPostAgeInDays = -1; else {
                   var postDays = (new Date() - new Date(props.post_obj._root.nodes[8].nodes[2].entry[1])) / 86400000;
                   if (postDays > 0) currentPostAgeInDays = postDays;
               }
           }
        } );

        if (postAuthor === "") {
            $(".PostsList__summaries .Voting__button-up a").on("click",function(e) {
                return handle_vote_click(e, this);
            });
            console.log("SteemitPostVote: processNewPage [postSummary]");
            return;
        }
        console.log("SteemitPostVote: processNewPage [fullPost]");

        $(".PostFull .Voting__button-up a").on("click",function(e) {
            if (altCommentState !== null) altPostMode = true; else altPostMode = false;
            return handle_vote_click(e, this);
        });

        var tickCountTm = new Date().getTime();

        $(".Post_comments .Voting__button-up").each( function() {
           var state = FindReact(this).state;
           var props = FindReact(this).props;
           var isDeclinedPayout = (currentPostAgeInDays < 0) && (props.post_obj._root.nodes[3].nodes[1].entry[1] != "0.000 SBD");
           var isExpiredPayout = (currentPostAgeInDays > postCutOffDays);
           if ((altCommentState === null) && ((state.myVote === null) || (state.myVote === 0)) &&
               (props.author === postAuthor) && (isExpiredPayout || isDeclinedPayout) ) {
               var postDays = (new Date() - new Date(props.post_obj._root.nodes[8].nodes[2].entry[1])) / 86400000;
               if (postDays < postCutOffDays) {
                   altCommentElem = this;
                   altCommentState = state;
                   altCommentProps = props;
                   if ((tickCountTm-lastVoteTm > 2500) && (tickCountTm-lastNotifyTm > 2500)) {
                       lastNotifyTm = new Date().getTime();
                       var alertType = "";
                       if (isExpiredPayout) alertType = "POST EXPIRED"; else alertType = "DECLINED PAYOUT";
                       console.log("SteemitPostVote: "+alertType+", alternate comment target found!");
                       if (isExpiredPayout) alertType = "PostExpired"; else alertType = "PostDeclinedPayout";
                       $.notify(alertType+": Found Comment to UpVote Instead!",{globalPosition:"top left",className:"info"});
                   }
               }
           }
        } );
        $(".Post_comments .Voting__button-up a").on("click",function(e) {
            altPostMode = false;
            return handle_vote_click(e, this);
        });

        if ((currentPostAgeInDays > postCutOffDays) && (altCommentState === null)) {
            if ((tickCountTm-lastVoteTm > 2500) && (tickCountTm-lastNotifyTm > 2500)) {
                lastNotifyTm = new Date().getTime();
                console.log("SteemitPostVote: POST EXPIRED, no alternate targets found");
                //$.notify("PostExpired",{globalPosition:"top left",className:"info"});
            }
        }

    }

  function handle_vote_click(e, obj) {
      console.log("handle_vote_click [tryAltPostComment="+altPostMode+"]");

      var react_obj = obj;
      var retries = 0;
      while ((retries <= 2) && (!props || !props.vote)) {
          var state = FindReact(react_obj).state;
          var props = FindReact(react_obj).props;
          if (!props.vote) {
              retries++;
              react_obj = react_obj.offsetParent;
          }
      }

      if (props.net_vesting_shares < minVests) return true;

      e.stopPropagation();
      window.reactProps = props;
      window.reactState = state;

      $("#tmpVoteSlider").remove();

      //unvote
      if ((state.myVote !== null) && (state.myVote !== 0)) {
          //if alternate comment exists, scroll there instead
          if (altPostMode) {
              var postOverlayElem = $("#post_overlay");
              if ($(postOverlayElem).length === 0) $('html,body').scrollTo($(altCommentElem),100,{offset:-150}); else
                  $(postOverlayElem).scrollTo($(altCommentElem),100,{offset:-75});
              return false;
          }
          props.myVote = state.myVote;
          props.vote(0,props);
          lastVoteTm = new Date().getTime();
          //props.myVote = null;
          //state.myVote = 0;
          triggerRefresh();
          return false;
      }

      var newSlider = $('<div id="tmpVoteSlider" class="FoundationDropdown undefined dropdown-pane is-open"><div class="Voting__adjust_weight"><a href="#" class="confirm_weight" title="Upvote"><span class="Icon chevron-up-circle Icon_2x" style="display: inline-block; width: 2rem; height: 2rem;"><svg enable-background="new 0 0 33 33" version="1.1" viewBox="0 0 33 33" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Chevron_Up_Circle"><circle cx="16" cy="16" r="15" stroke="#121313" fill="none"></circle><path d="M16.699,11.293c-0.384-0.38-1.044-0.381-1.429,0l-6.999,6.899c-0.394,0.391-0.394,1.024,0,1.414 c0.395,0.391,1.034,0.391,1.429,0l6.285-6.195l6.285,6.196c0.394,0.391,1.034,0.391,1.429,0c0.394-0.391,0.394-1.024,0-1.414 L16.699,11.293z" fill="#121313"></path></g></svg></span></a><div class="weight-display">0%</div><div class="rangeslider rangeslider-horizontal"><div class="rangeslider__fill" style="width: 44px;"></div><div class="rangeslider__handle" style="margin-left:10px;"></div></div><button class="Voting__adjust_weight_close close-button" type="button"><span aria-hidden="true" class="">×</span></button></div></div>');
      $(obj).parent().append(newSlider);

      if (localStorage.getItem('steemitVoteWeight') === null) localStorage.setItem('steemitVoteWeight',10000);
      var vw = Math.round(localStorage.getItem('steemitVoteWeight') / 100);
      $("#tmpVoteSlider").find('.weight-display').html(vw + "%");
      vw = vw / 0.5555555555555555556;
      $(".rangeslider__handle").css({left:vw+'px'});
      $(".rangeslider__fill").width(vw+15+'px');

      $(".close-button").on("click",function(e) { $("#tmpVoteSlider").remove(); e.stopPropagation(); triggerRefresh(); });

      $(".confirm_weight").on("click",function(e) {
          e.stopPropagation();
          var pctVote = Math.round(localStorage.getItem('steemitVoteWeight')/100);
          var useProps = reactProps;
          var alertType = "";
          if (altPostMode) {
              useProps = altCommentProps;
              altCommentState.showWeight = true;
              useProps.username = reactProps.username;
              useProps.loggedin = reactProps.loggedin;
              useProps.post_obj = reactProps.post_obj;
              if (currentPostAgeInDays > 0) alertType = "ExpiredPost"; else alertType = "DeclinedPayout";
              console.log("SteemitPostVote: Perform "+alertType+" UpVote ["+pctVote+"%]");
          } else console.log("SteemitPostVote: Perform UpVote ["+pctVote+"%]");
          var sliderParent = $("#tmpVoteSlider").parent();
          $("#tmpVoteSlider").remove();
          useProps.vote(pctVote*100,useProps);
          lastVoteTm = new Date().getTime();
          if (altPostMode) {
              var postOverlayElem = $("#post_overlay");
              if ($(postOverlayElem).length === 0) $('html,body').scrollTo($(altCommentElem),100,{offset:-150}); else
                  $(postOverlayElem).scrollTo($(altCommentElem),100,{offset:-75});
              $(altCommentElem).notify("UpVoted a Comment at "+pctVote+"%",{position:"top",className:"success"});
              if (currentPostAgeInDays > 0) alertType = "PostExpired"; else alertType = "PostDeclinedPayout";
              $.notify(alertType+": UpVoted a Comment at "+pctVote+"%",{globalPosition:"top left",className:"success"});
          } else $(sliderParent).notify("UpVoted at "+pctVote+"%",{position:"top",className:"success"});
          triggerRefresh();
          return false;
      });

      function slider_click(e, obj) {
          var parentOffset = $(obj).parent().offset();
          var x = e.pageX - parentOffset.left - 112;
          if (x < 1) x = 1;
          if (x > 180) x = 180;
          $(".rangeslider__fill").width(x+15+'px');
          var vw = Math.round(x*55.55555555555555556/100);
          $("#tmpVoteSlider").find('.weight-display').html(vw + "%");
          vw = vw / 0.5555555555555555556;
          $(".rangeslider__handle").css({left:vw-10+'px'});
          localStorage.setItem('steemitVoteWeight',Math.round(x*55.55555555555555556));
      }

      $('.rangeslider-horizontal').mousemove(function(e){
           if (e.buttons) slider_click(e, this);
      });

      $('.rangeslider-horizontal').click(function(e){
           slider_click(e, this);
      });

      $('.rangeslider__handle').draggable({
          axis: "x",
          cursor: "move",
          drag: function( event, ui ) {
              ui.position.top = 5;
              if (ui.position.left < 1) ui.position.left = 1;
              if (ui.position.left > 180) ui.position.left = 180;
              $(".rangeslider__fill").width(ui.position.left+15+'px');
              var vw = Math.round(ui.position.left*55.55555555555555556/100);
              $("#tmpVoteSlider").find('.weight-display').html(vw + "%");
          },
          start: function(event, ui) {
              var vw = Math.round(localStorage.getItem('steemitVoteWeight') / 55.55555555555555556);
              ui.position.left = vw;
              $(".rangeslider__fill").width(ui.position.left+15+'px');
          },
          stop: function(event, ui) {
              localStorage.setItem('steemitVoteWeight',Math.round(ui.position.left*55.55555555555555556));
          }
      });

      return false;

  }

})();