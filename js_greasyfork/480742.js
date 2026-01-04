// ==UserScript==
// @name        Steam Comments Cleaner
// @namespace   https://greasyfork.org/en/users/961305-darkharden
// @match       https://steamcommunity.com/id/*/commenthistory
// @version     1.0.0
// @author      Created by Justman (steamcommunity.com/id/justman666). Fixed by Portal124 (moddb)
// @description A script that deletes all deletable comments posted from your  account
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480742/Steam%20Comments%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/480742/Steam%20Comments%20Cleaner.meta.js
// ==/UserScript==

// TO-DO

// 1. 6x6 comment function
// 2. Comment remover script - https://greasyfork.org/en/scripts/26473-steam-community-comments-remover
// 3. Rate Entire Activity Feed - https://steamcommunity.com/sharedfiles/filedetails/?id=1442281864 / https://steamcommunity.com/sharedfiles/filedetails/?id=1198512278
// 4. Centering text in info box / bios

(function () {
  "use strict";
  let version = GM_info.script.version;
  console.log(`Steam Comments Cleaner ${version}`);
  /*
    Execute this code on https://steamcommunity.com/my/commenthistory

    This is the newest version.

    Created by Justman (steamcommunity.com/id/justman666)
    Fixed by Portal124 (moddb)

    Idk why it isn't maintained anymore but the dev should really get on that or at least post a disclaimer :)
*/

  /*
    Changable constants
*/
  var FIRST_PAGE_TO_CLEAR = 1; // Number of first page to be cleared
  var LAST_PAGE_TO_CLEAR = -1; // Number of last page to clear. -1 if you need to delete all of them
  // Example (2, 2) will clear 2nd page only
  var PRINT_EXECUTED_COMMANDS = true; // Print everything script does (It's a lot)

  /*
    Constants
*/
  var COMMENTS_PAGE = "https://steamcommunity.com/my/commenthistory"; // URL to page with comments
  var FORUMS_JS_URL = ["https://steamcommunity.com/public/javascript/forums.js", "https://steamcommunity-a.akamaihd.net/public/javascript/forums.js", "https://community.edgecast.steamstatic.com/public/javascript/forums.js"]; // URL to page with forums.js
  var FORUM_JS_LOAD_TIMEOUT = 10000; // ms
  var USER_STEAM_PROFILE_URL = jQuery("#global_actions > a").attr("href").replace(/\/$/, ""); // https://steamcommunity.com/id/$ID
  var PAGE_REQUESTS_INTERVAL = 5500; // ms
  var TIMESTAMP_DIFF = 3; // Maximum difference between timestamps
  var REGEXP = {
    "body": /<body.{1,}?>([.\s\S]{1,})<\/body>/, // Body innerHTML (No depending on attributes)
    "link": /^(.{1,}?)(?:\?(.{1,}?))?$/, // Link -> url + data
    "initFTopic": /InitializeForumTopic\s?\([^"]+?(?:"[^"]+?"[^"]+?)+?[^"]+?\);/, // Protected from ); in quotes
    "initCThread": /InitializeCommentThread\s?\([^"]+?(?:"[^"]+?"[^"]+?)+?[^"]+?\);/, // Protected from ); in quotes
  };

  /*
    Utility
*/
  var pages_amount = jQuery(".pageLinks .pagelink:last").html(); // Amount of pages
  if (!pages_amount) {
    pages_amount = 1;
  } else {
    pages_amount = +pages_amount;
  }
  var pages = []; // Array with page bodies
  var comments = []; // Array with comments to clean

  var execute = function (
    txt // Replacer to eval to be able to see commands printed
  ) {
    if (PRINT_EXECUTED_COMMANDS) {
      console.log(txt);
    }
    eval(txt);
  };

  /*
    Functions
*/
  var loadPagesFrom = function (
    fromPageNumber,
    callback // Loading page body with comments and adding it to pages as div
  ) {
    if (fromPageNumber > pages_amount || (LAST_PAGE_TO_CLEAR != -1 && fromPageNumber > LAST_PAGE_TO_CLEAR)) {
      console.log("Loaded pages");
      console.log(pages);
      if (typeof callback == "function") {
        callback();
      }
      return;
    }
    console.log("Loading page #" + fromPageNumber);
    if (location.search.match(new RegExp("p=" + fromPageNumber)) || fromPageNumber == 1) {
      var elem = document.createElement("div");
      elem.innerHTML = document.body.innerHTML;
      pages.push(elem);
      console.log("Loaded page #" + fromPageNumber);
      loadPagesFrom(fromPageNumber + 1, callback);
      return;
    }

    var search = location.search.replace(/\?/, ""); // Delete first ? if it exists
    if (search) {
      // Search is not empty
      if (search.match(/p=[0-9]{1,}/)) {
        // Page number is already stated (it must be 1)
        search = search.replace(/p=[0-9]{1,}/, "p=" + fromPageNumber);
      } else {
        // No page number but have some search parameters
        search += "&p=" + fromPageNumber;
      }
    } else {
      // empty search
      search = "p=" + fromPageNumber;
    }
    jQuery.ajax({
      "success": function (data, status) {
        var inner = data.match(REGEXP.body)[1];
        var elem = document.createElement("div");
        elem.innerHTML = inner;
        pages.push(elem);
        console.log("    Loaded page #" + fromPageNumber);
        loadPagesFrom(fromPageNumber + 1, callback);
      },
      "fail": function () {
        console.error("    Steam Comments Cleaner -->Unable to load page");
      },
      "data": search,
      "method": "GET",
      "url": COMMENTS_PAGE,
    });
  };

  var loadURLsFrom = function (
    fromPageNumber,
    callback // Loading URLs and adding them to comments as objects
  ) {
    if (fromPageNumber > pages.length) {
      console.log("    Loaded URLs");
      console.log(comments);
      if (typeof callback == "function") {
        callback();
      }
      return;
    }
    jQuery(pages[fromPageNumber - 1])
      .find(".commenthistory_comment .comment_item_title a")
      .each(function (index, a) {
        var info = {}; // Info about comment
        var link = a.href;
        link = link.replace(/#/, "/"); // Getting rid of # (replacable with /)
        if (link.match(/\/discussions\//)) {
          info["isForum"] = true;
        } else {
          info["isForum"] = false;
        }
        var m = link.match(REGEXP.link);
        info["link"] = link; // Full link
        info["url"] = m[1]; // Link with no GET args
        info["data"] = m[2]; // GET args (key=val&key=val...)
        if (info["data"] && info["data"].match(/tscn=[0-9]{1,}/)) {
          info["timestamp"] = info["data"].match(/tscn=([0-9]{1,})/)[1]; // Timestamp
        }
        if (info["isForum"]) {
          if (info["data"] && info["data"].match(/tscn=/)) {
            info["isForumTopic"] = false;
          } else {
            info["isForumTopic"] = true;
          }
        }
        info["text"] = jQuery(a).closest(".commenthistory_comment").find(".comment_text").text().replace(/\s/g, "");
        comments.push(info);
      });
    console.log("    Loaded URLs from page #" + (fromPageNumber + FIRST_PAGE_TO_CLEAR - 1));
    loadURLsFrom(fromPageNumber + 1, callback);
  };

  var clearURLfromIndex = function (
    index,
    callback // Clearing comment form comments array by its index
  ) {
    if (index >= comments.length) {
      console.log("Cleared URLs");
      console.log(comments);
      if (typeof callback == "function") {
        window.location.hash = ""; // Removing previously set hash
        callback();
      }
      return;
    }
    window.location.hash = "#p0"; // Can't initialize Comment thread without this hash (Crutch ._ .)
    jQuery.ajax({
      "success": function (data, status) {
        try {
          comments[index]["html"] = document.createElement("div");
          comments[index]["html"].innerHTML = data;
          if (jQuery(comments[index]["html"]).find("#message").length) {
            throw new Error(jQuery(comments[index]["html"]).find("#message").text());
          }
          if (comments[index]["isForum"]) {
            var initFTopic = jQuery(comments[index]["html"]).find("script:contains(InitializeForumTopic)").html(); // Code to be executed
            initFTopic = initFTopic.match(REGEXP.initFTopic)[0]; // Getting main command
            execute(initFTopic);
            var initCThread = jQuery(comments[index]["html"]).find("script:contains(InitializeCommentThread)").html(); // Code to be executed
            initCThread = initCThread.match(REGEXP.initCThread)[0]; // Getting main command
            initCThread = initCThread.replace(/\{/, '{"no_paging": true, '); // Adding no paging to prevent error
            execute(initCThread);
            if (comments[index]["isForumTopic"]) {
              // Topic
              var deleteTopic = jQuery(comments[index]["html"]).find('.forum_op a[href*="DeleteTopic"]');
              var argument = jQuery(deleteTopic)
                .attr("href")
                .match(/\(([.\s\S]{1,}?)\)/)[1]
                .replace(/[\s'"]/g, "");
              new Ajax.Request(g_rgForumTopics[argument].GetActionURL("deletetopic"), {
                "method": "POST",
                "parameters": g_rgForumTopics[argument].ParametersWithDefaults(),
              });
            } else {
              // Message
              var messagesByUser = jQuery(comments[index]["html"])
                .find('.commentthread_comment .commentthread_comment_avatar a[href*="' + USER_STEAM_PROFILE_URL + '"]')
                .closest(".commentthread_comment"); // Messages on the page by user
              var ifFoundMessage = false;
              messagesByUser.each(function (i, message) {
                var text = jQuery(message).find(".commentthread_comment_text").text().replace(/\s/g, ""); // innerText of message
                var timestamp = jQuery(message).find(".commentthread_comment_timestamp").attr("data-timestamp"); // Timestamp of message
                if (text == comments[index]["text"] && Math.abs(+timestamp - +comments[index]["timestamp"]) < TIMESTAMP_DIFF) {
                  var deleteComment = jQuery(message).find('a[href*="DeleteComment"]').attr("href");
                  if (!deleteComment) {
                    throw new Error('\nWas unable to find "Delete" button. Possibly you can\'t delete message from this group\n');
                  }
                  deleteComment = deleteComment.replace(/javascript:/, "");
                  var args = deleteComment.match(/\(([.\s\S]{1,}?),([.\s\S]{1,}?)\)/); // Arguments
                  // args looks like: " 'STRING' ". It may have [\s'"] in it
                  execute("g_rgCommentThreads[" + args[1] + "].GetForumTopic().m_rgForumData.permissions.can_moderate = 1;"); // Need to prevent confirmation (execute is used just to be able to replace it with console.log. Also this is effective as we keep argument as it was at DeleteComment())
                  execute("g_rgCommentThreads[" + args[1] + "].DeleteComment(" + args[2] + ");");
                  ifFoundComment = true;
                  return false; // break
                }
              });
            }
          } else {
            // Comment
            if (comments[index]["url"].match(/\/id\//) && !jQuery(comments[index]["html"]).find(".commentthread_comments").length) {
              throw new Error("\nCan not delete comment. As profile owner locked his page and deleted you from friends\n");
            }
            var initCThread = jQuery(comments[index]["html"]).find("script:contains(InitializeCommentThread)").html(); // Code to be executed
            initCThread = initCThread.match(REGEXP.initCThread)[0]; // Getting main command
            initCThread = initCThread.replace(/\{/, '{"no_paging": true, '); // Adding no paging to prevent error
            execute(initCThread);
            var commentsByUser = jQuery(comments[index]["html"])
              .find('.commentthread_comment .commentthread_comment_avatar a[href*="' + USER_STEAM_PROFILE_URL + '"]')
              .closest(".commentthread_comment"); // Comments on the page by user
            var ifFoundComment = false;
            commentsByUser.each(function (i, comment) {
              var text = jQuery(comment).find(".commentthread_comment_text").text().replace(/\s/g, ""); // innerText of comment
              var timestamp = jQuery(comment).find(".commentthread_comment_timestamp").attr("data-timestamp"); // Timestamp of comment
              if (text == comments[index]["text"] && Math.abs(+timestamp - +comments[index]["timestamp"]) < TIMESTAMP_DIFF) {
                var deleteComment = jQuery(comment)
                  .find('a[href*="DeleteComment"]')
                  .attr("href")
                  .replace(/javascript:/, "");
                if (!deleteComment) {
                  throw new Error('\nWas unable to find "Delete" button\n');
                }
                execute(deleteComment);
                ifFoundComment = true;
                return false; // break
              }
            });
            if (!ifFoundComment) {
              throw new Error("\nWas unable to find users comment\n");
            }
          }
          console.log("Cleaned comment #" + (index + 1));
        } catch (e) {
          console.error("Steam Comments Cleaner --> Can not clean comment #" + (index + 1));
          console.error(comments[index]);
          console.error(e);
        }
        var nextTimeout = setTimeout(function () {
          clearURLfromIndex(index + 1, callback);
        }, PAGE_REQUESTS_INTERVAL);
      },
      "fail": function () {
        console.error("Steam Comments Cleaner --> Unable to send request");
      },
      "data": comments[index]["data"],
      "method": "GET",
      "url": comments[index]["url"],
    });
  };

  var loadForumJS = function (i, callback, onFail) {
    var timeout = setTimeout(function () {
      // Setting timeout as reject of load is not supported with getScript
      console.error("Steam Comments Cleaner --> Error occured loading forum.js #" + i + " - timeout");
      if (i + 1 < FORUMS_JS_URL.length) {
        // Still have some links
        console.error("Steam Comments Cleaner --> Trying next link");
        loadForumJS(i + 1, callback, onFail); // Trying another one
      } else {
        // Tryed everything
        console.error("Steam Comments Cleaner --> No links left");
        if (typeof onFail == "function") {
          onFail();
        }
      }
    }, FORUM_JS_LOAD_TIMEOUT);

    console.log("Steam Comments Cleaner --> Trying forum.js #" + i + ". Will try next in " + FORUM_JS_LOAD_TIMEOUT / 1000 + " seconds if this wont work");
    jQuery
      .getScript(FORUMS_JS_URL[i])
      .done(function () {
        // Require forum.js to delete forum messages
        // Needed script is loaded and no errors detected
        console.log("Steam Comments Cleaner --> Loaded forum.js #" + i);
        clearTimeout(timeout); // Stop timeout
        if (typeof callback == "function") {
          callback();
        }
      })
      .fail(function () {
        console.error("Steam Comments Cleaner --> Error occurred loading forum.js #" + i);
        console.error("Steam Comments Cleaner --> Trying next link");
        if (i + 1 < FORUMS_JS_URL.length) {
          loadForumJS(i + 1, callback, onFail); // Trying another one
        } else {
          if (typeof onFail == "function") {
            onFail();
          }
        }
      });
  };

  /*
    Main
*/

  loadForumJS(
    0,
    function () {
      console.log("Steam Comments Cleaner --> Starts here");
      console.log("profile_header_actions");
      function setCommentsCleanerButton() {
        const uploadCustomArtworkButtonContainer = document.createElement("div");
        uploadCustomArtworkButtonContainer.className = "rightbox";
        // Create Buttons
        uploadCustomArtworkButtonContainer.innerHTML = `
        <div class="profile_count_link addtocartbutton_Action_2ECxA CartBtn" style="margin-top:20px">
          <span class="clean-comments-link" href="#">Clean Comments</span>
        </div>
        `;
        // Grab mainContentsDiv element reference
        const uploadArtworkButtonReferenceParent = document.querySelector(".rightbox .content");
        const uploadArtworkButtonReferenceChild = document.querySelector(".rightbox .content > div:last-child");
        // Insert the Buttons
        uploadArtworkButtonReferenceParent.insertBefore(uploadCustomArtworkButtonContainer, uploadArtworkButtonReferenceChild);

        const buttonCommentsCleaner = document.querySelector(".clean-comments-link");
        buttonCommentsCleaner.addEventListener("click", () => {
          console.log("buttonCommentsCleaner clicked");
          loadCommentsCleaner();
        });
      }
      setTimeout(setCommentsCleanerButton, 0);

      function loadCommentsCleaner() {
        loadPagesFrom(FIRST_PAGE_TO_CLEAR, function () {
          loadURLsFrom(1, function () {
            clearURLfromIndex(0, function () {
              alert("Steam Comments Cleaner --> Done");
            });
          });
        });
      }
    },
    function () {
      alert("Steam Comments Cleaner --> Can not load forum.js!");
    }
  );
})();
