// ==UserScript==
// @name            Steam Guide Subscribe All
// @author          popiazaza
// @namespace       popiazaza
// @home-url        https://github.com/popiazaza/Steam-Guide-Subscribe-All
// @homepageURL     https://github.com/popiazaza/Steam-Guide-Subscribe-All
// @description     Subscribe all guides in the page from Steam workshop in 1 click
// @version         1.7
// @include         https://steamcommunity.com/id/*/myworkshopfiles/?section=guides*
// @include         https://steamcommunity.com/profiles/*/myworkshopfiles/?section=guides*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/372234/Steam%20Guide%20Subscribe%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/372234/Steam%20Guide%20Subscribe%20All.meta.js
// ==/UserScript==

function dota2workshopsubnext(loaded = 0, subscribe = true) {
  if (
    jQuery(".pagebtn.disabled").length &&
    jQuery(".pagebtn.disabled:first").text() == ">"
  ) {
    if (subscribe) {
      ShowAlertDialog(
        "Success!",
        "You have subsribed to " + loaded + " guides!"
      ).done(function () {
        window.location = "?section=guides";
      });
    } else {
      ShowAlertDialog(
        "Success!",
        "You have unsubsribed to " + loaded + " guides!"
      ).done(function () {
        window.location = "?section=guides";
      });
    }
  } else {
    jQuery(".pagebtn").each(function () {
      if (jQuery(this).text() == ">" && jQuery(this).attr("href")) {
        var thislocation = jQuery(this)
          .attr("href")
          .replace(/&d2wg_all=(\d*)/, "");
        thislocation = thislocation.replace(/&d2wg_un=(\d*)/, "");
        if (subscribe) {
          window.location = thislocation + "&d2wg_all=" + loaded;
        } else {
          window.location = thislocation + "&d2wg_un=" + loaded;
        }
      }
    });
  }
}
function dota2workshopbackfirst(subscribe = true) {
  thislocation = window.location.href.replace(/&p=(\d*)/, "");
  if (subscribe) {
    window.location = thislocation + "&d2wg_all=" + 999999;
  } else {
    window.location = thislocation + "&d2wg_un=" + 999999;
  }
}
function dota2workshopsubnownuke() {
  //dota2workshopsubnow(999999);
  dota2workshopbackfirst();
}
function dota2workshopunsubnow() {
  dota2workshopsubnow(0, false);
}
function dota2workshopunsubnownuke() {
  //dota2workshopsubnow(999999,false);
  dota2workshopbackfirst(false);
}
function dota2workshopsubnow(d2wg_all = 0, subscribe = true) {
  var guideList = [];
  var subscribedList = [];

  jQuery("script").each(function () {
    var guidematch = jQuery(this)
      .html()
      .match(/SharedFileBindMouseHover\( "(.*?)", true, (.*?) \);/);
    if (guidematch) {
      var guidedetail = JSON.parse(guidematch[2].replace(/(\r\n|\n|\r)/gm, ""));
      guideList.push(guidedetail.id);
      subscribedList[guidedetail.id] = guidedetail.user_subscribed;
    }
  });

  var i = 0,
    loaded = 0,
    package = 0,
    total = guideList.length,
    modal = ShowBlockingWaitDialog(
      "Executing…",
      "Please wait until all requests finish. Ignore all the errors, let it finish."
    );

  for (; i < total; i++) {
    guideid = guideList[i];
    //function below doesn't work because steam doesn't support it yet
    //if( subscribedList[ guideid ] )
    //{
    //	loaded++;
    //	continue;
    //}

    if (subscribe) {
      var subscribeurl = "//steamcommunity.com/sharedfiles/subscribe";
    } else {
      var subscribeurl = "//steamcommunity.com/sharedfiles/unsubscribe";
    }

    jQuery
      .post(subscribeurl, {
        appid: 570,
        id: guideid,
        sessionid: g_sessionID,
      })
      .always(function () {
        loaded++;

        modal.Dismiss();

        if (loaded >= total) {
          if (d2wg_all) {
            if (d2wg_all !== 999999) {
              loaded = d2wg_all + loaded;
            }
            if (subscribe) {
              dota2workshopsubnext(loaded);
            } else {
              dota2workshopsubnext(loaded, false);
            }
          } else {
            if (subscribe) {
              ShowAlertDialog(
                "Success!",
                "You have subsribed to " + loaded + " guides!"
              ).done(function () {
                location.reload();
              });
            } else {
              ShowAlertDialog(
                "Success!",
                "You have unsubsribed to " + loaded + " guides!"
              ).done(function () {
                location.reload();
              });
            }
          }
        } else {
          modal = ShowBlockingWaitDialog(
            "Executing…",
            "Loaded <b>" + loaded + "</b>/" + total + "."
          );
        }
      });
  }
}

(function () {
  if (location.search.split("d2wg_all=")[1]) {
    dota2workshopsubnow(parseInt(location.search.split("d2wg_all=")[1]));
  } else if (location.search.split("d2wg_un=")[1]) {
    dota2workshopsubnow(parseInt(location.search.split("d2wg_un=")[1]), false);
  }
  jQuery(".followStatsBlock").append(
    '<a href="javascript:void(0);" id="dota2workshopsuball" class="btn_darkblue_white_innerfade btn_medium"><span>Subscribe all on this page</span></a>'
  );
  document
    .getElementById("dota2workshopsuball")
    .addEventListener("click", dota2workshopsubnow, false);
  jQuery(".followStatsBlock").append(
    '<br><br><a href="javascript:void(0);" id="dota2workshopsuballnuke" class="btn_darkblue_white_innerfade btn_medium"><span>Subscribe all from this person</span></a>'
  );
  document
    .getElementById("dota2workshopsuballnuke")
    .addEventListener("click", dota2workshopsubnownuke, false);
  jQuery(".followStatsBlock").append(
    '<br><br><a href="javascript:void(0);" id="dota2workshopunsuball" class="btn_darkblue_white_innerfade btn_medium"><span>Unsubscribe all on this page</span></a>'
  );
  document
    .getElementById("dota2workshopunsuball")
    .addEventListener("click", dota2workshopunsubnow, false);
  jQuery(".followStatsBlock").append(
    '<br><br><a href="javascript:void(0);" id="dota2workshopunsuballnuke" class="btn_darkblue_white_innerfade btn_medium"><span>Unsubscribe all from this person</span></a>'
  );
  document
    .getElementById("dota2workshopunsuballnuke")
    .addEventListener("click", dota2workshopunsubnownuke, false);
})();