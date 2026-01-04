// ==UserScript==
// @name         Bridder
// @namespace    https://github.com/raisandesu/Bridder
// @version      2.0
// @description  Twitter(X)のロゴを青い鳥に変更します。
// @author       raisandesu
// @match        https://twitter.com/*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/472754/Bridder.user.js
// @updateURL https://update.greasyfork.org/scripts/472754/Bridder.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const xLogo =
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
  const oldLogo =
    "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";

  const documentLogo =
    "M17.9686 10.1623L26.7065 0H24.6358L17.0488 8.82382L10.9891 0H4L13.1634 13.3432L4 24H6.07069L14.0827 14.6817L20.4822 24H27.4714L17.9686 10.1623ZM15.1326 13.4607L14.2041 12.132L6.81679 1.55961H9.99723L15.9589 10.0919L16.8873 11.4206L24.6368 22.5113H21.4564L15.1326 13.4607Z";
  const yellowCheck =
    "M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z";

  var LastTweetID = "";
  var replacedIcon = false;

  function ShowLabel(Source) {
    var labelField = document.getElementsByClassName(
      "css-1dbjc4n r-1d09ksm r-1471scf r-18u37iz r-1wbh5a2"
    );
    if (labelField.length) {
      if (document.getElementById("RTSL_base") == null) {
        var base = document.createElement("span");
        base.setAttribute("id", "RTSL_base");
        labelField[0].appendChild(base);
        Incorporate(document.getElementById("RTSL_base"));
      } else {
        let base = document.getElementById("RTSL_base");
        base.innerHTML = "";
        Incorporate(document.getElementById("RTSL_base"));
      }
    }

    function Incorporate(base_ele) {
      let body = document.body;
      let style = window.getComputedStyle(body);
      let colorvalue = style.getPropertyValue("background-color");
      let themeClass;
      switch (colorvalue) {
        case "rgb(255, 255, 255)":
          themeClass = "r-14j79pv";
          break;
        case "rgb(21, 32, 43)":
          themeClass = "r-115tad6";
          break;
        case "rgb(0, 0, 0)":
          themeClass = "r-1bwzh9t";
          break;
        default:
          themeClass = "r-14j79pv";
          break;
      }
      var ele = document.createElement("span");
      ele.setAttribute("aria-hidden", "true");
      ele.classList.add(
        "css-901oao",
        "css-16my406",
        "r-1q142lx",
        "r-poiln3",
        "r-bcqeeo",
        "r-s1qlax",
        "r-qvutc0",
        themeClass
      );
      ele.innerHTML = `<span class="r-1tl8opc css-901oao css-16my406 r-bcqeeo r-qvutc0">·</span>`;
      base_ele.appendChild(ele);
      var div = document.createElement("div");
      div.style.display = "none";
      div.id = "sourcetmp";
      div.innerHTML = Source;
      document.body.appendChild(div);
      let sourceLabel = document
        .getElementById("sourcetmp")
        .getElementsByTagName("a")[0].textContent;
      document.body.removeChild(div);
      var sourcelabelfield = document.createElement("a");
      sourcelabelfield.href =
        "https://help.twitter.com/using-twitter/how-to-tweet#source-labels";
      sourcelabelfield.setAttribute("rel", "noopener noreferrer nofollow");
      sourcelabelfield.setAttribute("target", "_blank");
      sourcelabelfield.setAttribute("role", "link");
      sourcelabelfield.classList.add(
        "css-4rbku5",
        "css-18t94o4",
        "css-901oao",
        "css-16my406",
        "r-1loqt21",
        "r-poiln3",
        "r-bcqeeo",
        "r-1jeg54m",
        "r-qvutc0",
        themeClass
      );
      sourcelabelfield.innerHTML = `<span class="r-1tl8opc css-901oao css-16my406 r-bcqeeo r-qvutc0">${sourceLabel}</span>`;
      base_ele.appendChild(sourcelabelfield);
    }
  }

  //Return Tweet Label
  function GetTweetSource(tweetID) {
    function isKeyExists(obj, key) {
      if (obj[key] == undefined) {
        return false;
      } else {
        return true;
      }
    }

    const urlbase =
      "https://api.twitter.com/graphql/NNiD2K-nEYUfXlMwGCocMQ/TweetDetail";
    var query = encodeURI(
      `?variables={"focalTweetId":"${tweetID}","referrer":"home","controller_data":"DAACDAABDAABCgABCEAABEoCAAEKAAKAQAAAAAEBAAoACW6ei3WtrtOeCAALAAAABA8ADAMAAAAQAQACSgQAQAgAAQEAAABAgAoAEDHty/9MMBA1AAAAAA==","with_rux_injections":false,"includePromotedContent":true,"withCommunity":true,"withQuickPromoteEligibilityTweetFields":true,"withBirdwatchNotes":true,"withSuperFollowsUserFields":true,"withDownvotePerspective":false,"withReactionsMetadata":false,"withReactionsPerspective":false,"withSuperFollowsTweetFields":true,"withVoice":true,"withV2Timeline":true}&features={"responsive_web_twitter_blue_verified_badge_is_enabled":true,"responsive_web_graphql_exclude_directive_enabled":false,"verified_phone_label_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"vibe_api_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":false,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":false,"interactive_text_enabled":true,"responsive_web_text_conversations_enabled":false,"responsive_web_enhance_cards_enabled":false}`
    );
    var url = urlbase + query;
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.setRequestHeader(
      "authorization",
      "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
    );
    request.setRequestHeader("x-csrf-token", cookie.getByName("ct0"));
    var gt = cookie.getByName("gt");
    if (gt.length) {
      request.setRequestHeader("x-guest-token", gt);
    } else {
      request.withCredentials = true;
    }
    request.onreadystatechange = function () {
      if (request.readyState != 4) {
      } else if (request.status != 200) {
      } else {
        var result = request.responseText;
        let parse_data = JSON.parse(result);
        let instructions =
          parse_data["data"]["threaded_conversation_with_injections_v2"][
            "instructions"
          ];
        for (let i = 0; i < instructions.length; i++) {
          if (instructions[i].type == "TimelineAddEntries") {
            for (let j = 0; j < instructions[i].entries.length; j++) {
              if (
                instructions[i].entries[j]["content"]["entryType"] ==
                  "TimelineTimelineItem" &&
                instructions[i].entries[j].entryId == `tweet-${tweetID}`
              ) {
                if (
                  isKeyExists(
                    instructions[i].entries[j]["content"]["itemContent"][
                      "tweet_results"
                    ]["result"],
                    "tweet"
                  )
                ) {
                  ShowLabel(
                    instructions[i].entries[j]["content"]["itemContent"][
                      "tweet_results"
                    ]["result"]["tweet"]["source"]
                  );
                } else {
                  ShowLabel(
                    instructions[i].entries[j]["content"]["itemContent"][
                      "tweet_results"
                    ]["result"]["source"]
                  );
                }
                break;
              }
            }
            break;
          }
        }
      }
    };
    request.send(null);
  }

  var cookie = {
    getObj: function () {
      var cookie = document.cookie;
      var cookieObj = {};
      if (!!cookie) {
        Array.prototype.forEach.call(cookie.split(";"), function (c) {
          var array = [c][0].split("=").map(function (a) {
            return a.trim();
          });
          var key = ~c.indexOf("=") ? unescape(array[0]) : "";
          var val = ~c.indexOf("=") ? unescape(array[1]) : unescape(array[0]);
          if (!cookieObj.hasOwnProperty(key)) {
            cookieObj[key] = [val];
          } else {
            cookieObj[key].push(val);
          }
        });
      }
      return cookieObj;
    },
    getByName: function (name) {
      var ret = [];
      var cookieObj = this.getObj();
      if (cookieObj.hasOwnProperty(name)) {
        ret = cookieObj[name];
      }
      return ret;
    },
  };

  function isNumber(n) {
    var num = parseInt(n, 10);
    return !isNaN(parseInt(n)) && isFinite(n);
  }

  const returnTweetLabel = () => {
    setInterval(function () {
      if (
        document.getElementsByClassName(
          "css-1dbjc4n r-1d09ksm r-1471scf r-18u37iz r-1wbh5a2"
        ).length
      ) {
        var CurrentURL = location.href;
        if (CurrentURL.includes("twitter.com/")) {
          var question_index = CurrentURL.indexOf("?");
          if (question_index > 0) {
            var st_index = CurrentURL.indexOf("status/") + 7;
            var q_index = CurrentURL.indexOf("?");
            var status_id_str = CurrentURL.substring(st_index, q_index);
            if (isNumber(status_id_str) && !(status_id_str == LastTweetID)) {
              GetTweetSource(status_id_str);
              LastTweetID = status_id_str;
            }
          } else {
            var st_index = CurrentURL.indexOf("status/") + 7;
            var status_id_str = CurrentURL.slice(st_index);
            if (isNumber(status_id_str) && !(status_id_str == LastTweetID)) {
              GetTweetSource(status_id_str);
              LastTweetID = status_id_str;
            }
          }
        }
      } else {
        LastTweetID = -1;
      }
    }, 300);
  };

  const fixLogo = () => {
    document.querySelectorAll("svg").forEach((container) => {
      const path = container.querySelector(`path[d='${xLogo}']`);
      if (
        container.classList[0] == "r-1nao33i" &&
        container.classList[1] == "r-4qtqp9" &&
        container.classList[2] == "r-yyyyoo" &&
        container.classList[3] == "r-lwhw9o"
      ) {
        if (path) {
          path.style.fill = "none";
          path.style.stroke = "rgb(0, 0, 0)";
          path.style.paintOrder = "fill";
          path.setAttribute(
            "d",
            "M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
          );
        }
      } else {
        if (path) {
          path.style.color = "rgb(29, 155, 240)";
          path.setAttribute("d", oldLogo);
        }
      }
    });

    document.querySelectorAll("svg").forEach((container) => {
      const path = container.querySelector(
        `path[d='M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z']`
      );

      if (path) {
        path.setAttribute(
          "d",
          "M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"
        );
      }
    });

    document.querySelectorAll("svg").forEach((container) => {
      const path = container.querySelector(
        `path[d='M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z']`
      );

      const pathFilled = container.querySelector(
        `path[d='M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z']`
      );

      try {
        try {
          if (pathFilled != null) {
            pathFilled.setAttribute(
              "d",
              "M12 1.696.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696ZM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5Z"
            );
          }
        } catch {}

        if (path) {
          path.style.fill = "#fff";
          path.setAttribute("fill-rule", "nonzero");
          path.setAttribute(
            "d",
            "M 12 9 c -2.209 0 -4 1.791 -4 4 s 1.791 4 4 4 s 4 -1.791 4 -4 s -1.791 -4 -4 -4 z m 0 6 c -1.105 0 -2 -0.895 -2 -2 s 0.895 -2 2 -2 s 2 0.895 2 2 s -0.895 2 -2 2 z m 0 -13.304 L 0.622 8.807 l 1.06 1.696 L 3 9.679 V 19.5 C 3 20.881 4.119 22 5.5 22 h 13 c 1.381 0 2.5 -1.119 2.5 -2.5 V 9.679 l 1.318 0.824 l 1.06 -1.696 L 12 1.696 z M 19 19.5 c 0 0.276 -0.224 0.5 -0.5 0.5 h -13 c -0.276 0 -0.5 -0.224 -0.5 -0.5 V 8.429 l 7 -4.375 l 7 4.375 V 19.5 z"
          );
        }
      } catch {}
    });

    document.querySelectorAll("svg").forEach((container) => {
      const filter = container.querySelector(
        `g[filter="url(#filter0_d_40_56253)"]`
      );
      const path = container.querySelector(`path[d='${documentLogo}']`);
      if (path) {
        path.style.fill = "rgb(29, 155, 240)";
        path.setAttribute("d", oldLogo);
      }
      if (filter) {
        filter.removeAttribute("filter");
      }
    });

    if (
      document.querySelector("body").style.backgroundColor !=
      "rgb(255, 255, 255)"
    ) {
      document.querySelectorAll("svg.r-yyyyoo").forEach((container) => {
        if (
          container.getAttribute("aria-label") == "認証済みアカウント" ||
          container.getAttribute("data-testid") == "verificationBadge"
        ) {
          container.style.color = "white";
        }

        if (
          container.getAttribute("aria-label") == "認証済みアカウント" ||
          container.getAttribute("data-testid") == "verificationBadge"
        ) {
          container.querySelectorAll("g").forEach(async (element) => {
            if (
              element.querySelector("path").getAttribute("d") ==
              "M12.05 2.056c-.568-.608-1.532-.608-2.1 0l-1.393 1.49c-.284.303-.685.47-1.1.455L5.42 3.932c-.832-.028-1.514.654-1.486 1.486l.069 2.039c.014.415-.152.816-.456 1.1l-1.49 1.392c-.608.568-.608 1.533 0 2.101l1.49 1.393c.304.284.47.684.456 1.1l-.07 2.038c-.027.832.655 1.514 1.487 1.486l2.038-.069c.415-.014.816.152 1.1.455l1.392 1.49c.569.609 1.533.609 2.102 0l1.393-1.49c.283-.303.684-.47 1.099-.455l2.038.069c.832.028 1.515-.654 1.486-1.486L18 14.542c-.015-.415.152-.815.455-1.099l1.49-1.393c.608-.568.608-1.533 0-2.101l-1.49-1.393c-.303-.283-.47-.684-.455-1.1l.068-2.038c.029-.832-.654-1.514-1.486-1.486l-2.038.07c-.415.013-.816-.153-1.1-.456zm-5.817 9.367l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
            ) {
              element
                .querySelector("path")
                .setAttribute(
                  "d",
                  "M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                );
              element.querySelector("path").setAttribute("fill", "white");
            }
          });
        }

        if (
          container.getAttribute("aria-label") == "認証済みアカウント" ||
          container.getAttribute("data-testid") == "verificationBadge"
        ) {
          container.querySelectorAll("g").forEach(async (element) => {
            if (element.querySelector("linearGradient") != null) {
              while (element.firstChild) {
                element.removeChild(element.firstChild);
              }

              const whiteBadgePath = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              whiteBadgePath.setAttribute("fill", "white");
              whiteBadgePath.setAttribute(
                "d",
                "M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
              );
              await element.append(whiteBadgePath);
            }
          });
        }
      });
    }
  };

  const fixIcon = () => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "https://abs.twimg.com/favicons/twitter.ico";
  };

  const fixTitle = () => {
    setInterval(function () {
      if (document.title == "X") {
        document.title = "Twitter";
      }

      if (document.title.includes("/ X")) {
        document.title = document.title.replace("/ X", "/ Twitter");
      }

      if (document.title.includes("ポスト / ")) {
        document.title = document.title.replace("ポスト / ", "ツイート / ");
      }

      if (document.title.includes("Xユーザーの")) {
        var replaceUser = document.title.replace(
          "さん: ",
          "さんはTwitterを利用しています: "
        );
        var replaceX = replaceUser.replace("Xユーザーの", "");
        document.title = replaceX;
      }
    }, 1);
  };

  const redirect = () => {
    setInterval(function () {
      if (window.location.pathname == "/i/verified-orgs-signup") {
        window.history.back();
      }

      if (window.location.pathname == "/i/verified-choose") {
        window.history.back();
      }

      if (window.location.pathname == "/i/premium_sign_up") {
        window.history.back();
      }
    }, 200);
  };

  const fixText = () => {
    setInterval(function () {
      document
        .querySelectorAll(
          ".css-4rbku5.css-18t94o4.css-1dbjc4n.r-1habvwh.r-1loqt21.r-6koalj.r-eqz5dr.r-16y2uox.r-1ny4l3l.r-oyd9sg.r-13qz1uu"
        )
        .forEach((container) => {
          if (container.getAttribute("aria-label") == "認証済み組織") {
            container.remove();
          }
        });

      document
        .querySelectorAll(
          ".css-4rbku5.css-18t94o4.css-1dbjc4n.r-1habvwh.r-1loqt21.r-6koalj.r-eqz5dr.r-16y2uox.r-1ny4l3l.r-oyd9sg.r-13qz1uu"
        )
        .forEach((container) => {
          if (container.getAttribute("aria-label") == "プレミアム") {
            container.remove();
          }
        });

      try {
        document
          .querySelectorAll(
            ".css-4rbku5.css-18t94o4.css-1dbjc4n.r-1habvwh.r-1loqt21.r-6koalj.r-eqz5dr.r-16y2uox.r-1ny4l3l.r-oyd9sg.r-13qz1uu"
          )
          .forEach((container) => {
            if (container.getAttribute("aria-label") != "認証済み組織") {
              document.querySelectorAll("a").forEach((container2) => {
                if (container2.getAttribute("href") == "/i/premium_sign_up") {
                  container2.remove();
                }
              });
            }
          });
      } catch {}

      try {
        if (
          document.querySelector("aside").getAttribute("aria-label") ==
          "プレミアムにサブスクライブ"
        ) {
          document.querySelector("aside").parentElement.remove();
        }
      } catch {}

      document.querySelectorAll("*").forEach((container) => {
        if (container.textContent === "© 2023 X Corp.") {
          container.textContent = "© 2023 Twitter Inc.";
        }

        if (
          container.textContent ===
          "Earn a living on X by letting anyone subscribe to you for monthly content."
        ) {
          if (window.navigator.language == "ja") {
            container.textContent =
              "サブスクライバー向けのコンテンツを毎月配信して、Twitterで生計を立てます。";
          } else {
            container.textContent =
              "Earn a living on Twitter by letting anyone subscribe to you for monthly content.";
          }
        }

        if (
          container.textContent === "Post your reply!" &&
          container.classList.contains("public-DraftEditorPlaceholder-inner")
        ) {
          container.textContent = "Tweet your reply";
        }

        if (
          container.textContent === "返信をポスト" &&
          container.classList.contains("public-DraftEditorPlaceholder-inner")
        ) {
          container.textContent = "返信をツイート";
        }

        if (
          container.textContent === "別のポストを追加してください。" &&
          container.classList.contains("public-DraftEditorPlaceholder-inner")
        ) {
          container.textContent = "別のツイートを追加してください。";
        }
      });

      document
        .querySelectorAll(
          ".css-901oao.css-1hf3ou5.r-115tad6.r-1tl8opc.r-n6v787.r-16dba41.r-1cwl3u0.r-bcqeeo.r-qvutc0"
        )
        .forEach((container) => {
          if (container.textContent.includes(" posts")) {
            container.textContent = container.textContent.replace(
              " posts",
              " 件のツイート"
            );
          }
        });

      document
        .querySelectorAll(
          ".css-1dbjc4n.r-1loqt21.r-6koalj.r-1ny4l3l.r-ymttw5.r-1f1sjgu.r-o7ynqc.r-6416eg"
        )
        .forEach((container) => {
          if (container.getAttribute("data-testid") == "trend") {
            container
              .querySelectorAll(
                ".css-901oao.css-16my406.r-1tl8opc.r-bcqeeo.r-qvutc0"
              )
              .forEach((elements) => {
                if (elements.textContent.includes("posts")) {
                  elements.textContent = elements.textContent.replace(
                    "posts",
                    "件のツイート"
                  );
                }
              });
          }
        });

      document
        .querySelectorAll(".css-901oao.css-16my406.r-1tl8opc.r-bcqeeo.r-qvutc0")
        .forEach((container) => {
          try {
            if (
              container
                .closest(".css-1dbjc4n.r-6gpygo.r-14gqq1x")
                .getAttribute("data-testid") == "UserName"
            )
              return;
          } catch {}

          try {
            if (
              container
                .closest(
                  ".css-4rbku5.css-901oao.css-1hf3ou5.r-vlxjld.r-1tl8opc.r-adyw6z.r-b88u0q.r-135wba7.r-bcqeeo.r-1vvnge1.r-qvutc0"
                )
                .getAttribute("role") == "heading"
            )
              return;
          } catch {}

          try {
            if (
              container
                .closest(
                  ".css-18t94o4.css-1dbjc4n.r-1ny4l3l.r-ymttw5.r-1f1sjgu"
                )
                .getAttribute("data-testid") == "UserCell" ||
              container
                .closest(
                  ".css-18t94o4.css-1dbjc4n.r-1ny4l3l.r-ymttw5.r-1f1sjgu"
                )
                .getAttribute("data-testid") == "TypeaheadUser"
            )
              return;
          } catch {}

          try {
            if (
              container
                .closest(
                  ".css-901oao.r-vlxjld.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0"
                )
                .getAttribute("data-testid") == "tweetText"
            )
              return;
          } catch {}

          try {
            if (
              container
                .closest(
                  ".css-901oao.css-cens5h.r-vlxjld.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0"
                )
                .getAttribute("data-testid") == "tweetText"
            )
              return;
          } catch {}

          try {
            if (
              container
                .closest(
                  ".css-901oao.css-16my406.css-cens5h.r-115tad6.r-1tl8opc.r-n6v787.r-b88u0q.r-1cwl3u0.r-bcqeeo.r-qvutc0"
                )
                .getAttribute("data-testid") == "socialContext"
            ) {
            }
          } catch {
            try {
              if (container.closest("article")) return;
            } catch {}
          }

          if (
            (container.textContent === "Premium" ||
              container.textContent === "プレミアム") &&
            window.location.href !== "https://twitter.com/premium"
          ) {
            container.textContent = "Twitter Blue";
          }

          if (container.textContent === "X Premium") {
            container.textContent = "Twitter Blue";
          }

          if (container.textContent === "長いポスト") {
            container.textContent = "長いツイート";
          }

          if (
            container.textContent ===
            "ポストの編集、ブックマークフォルダ、その他の新機能など、すでに提供されているすべてのPremiumの機能を利用できます"
          ) {
            container.textContent =
              "ツイートの編集、ブックマークフォルダ、その他の新機能など、すでに提供されているすべてのBlueの機能を利用できます";
          }

          if (
            container.textContent ===
            "このアカウントは、Xが公式に認証している組織アカウントです。"
          ) {
            container.textContent =
              "このアカウントは、Twitterが公式に認証している組織アカウントです。";
          }

          if (
            container.textContent ===
            "電話番号が認証済みのプレミアムユーザーには、承認後、青いチェックマークが付きます。"
          ) {
            container.textContent =
              "電話番号が認証済みのTwitter Blueユーザーには、承認後、青いチェックマークが付きます。";
          }

          if (container.textContent === "このアカウントは、Xの") {
            container.textContent = "このアカウントは、Twitterの";
          }

          if (container.textContent === "ポストを編集") {
            container.textContent = "ツイートを編集";
          }

          if (
            container.textContent ===
            "30分以内であれば投稿を5回まで編集できます。"
          ) {
            container.textContent =
              "30分以内であればツイートを5回まで編集できます。";
          }

          if (
            container.textContent ===
            "長さが最大25,000文字の投稿、返信、引用を作成できます。"
          ) {
            container.textContent =
              "長さが最大25,000文字のツイート、返信、引用を作成できます。";
          }

          if (container.textContent === "さんの新しいポスト通知") {
            container.textContent = "さんの新しいツイート通知";
          }

          if (
            container.textContent === "さんがあなたのポストをいいねしました"
          ) {
            container.textContent = "さんがあなたのツイートをいいねしました";
          }

          if (
            container.textContent === "さんがあなたのポストをリポストしました"
          ) {
            container.textContent =
              "さんがあなたのツイートをリツイートしました";
          }

          if (container.textContent === "ポストアナリティクスを表示") {
            container.textContent = "ツイートアナリティクスを表示";
          }

          if (container.textContent === "ポストアナリティクス") {
            container.textContent = "ツイートアナリティクス";
          }

          if (container.textContent === "プレミアムにサブスクライブ") {
            container.textContent = "Twitter Blueにサブスクライブ";
          }

          if (
            container.textContent ===
            "プレミアムまたは認証済み組織にサブスクライブしている"
          ) {
            container.textContent =
              "Twitter Blueまたは認証済み組織にサブスクライブしている";
          }

          if (
            container.textContent ===
            "過去3ヶ月間のポストに対するインプレッションが500万件以上"
          ) {
            container.textContent =
              "過去3ヶ月間のツイートに対するインプレッションが500万件以上";
          }

          if (
            container.textContent ===
            "過去3ヶ月間のポストに対するインプレッションが500万件以上"
          ) {
            container.textContent =
              "過去3ヶ月間のツイートに対するインプレッションが500万件以上";
          }

          if (container.textContent === "あなたのポスト") {
            container.textContent = "あなたのツイート";
          }

          if (container.textContent === "ポストに関連する情報を管理します。") {
            container.textContent = "ツイートに関連する情報を管理します。";
          }

          if (
            container.textContent ===
            "ポストするメディアをセンシティブな内容を含むものとして設定する"
          ) {
            container.textContent =
              "ツイートするメディアをセンシティブな内容を含むものとして設定する";
          }

          if (
            container.textContent ===
            "オンにすると、センシティブな内容を表示しない利用者に対して、ポストした画像や動画がセンシティブな内容を含むものとしてマークされます。"
          ) {
            container.textContent =
              "オンにすると、センシティブな内容を表示しない利用者に対して、ツイート   した画像や動画がセンシティブな内容を含むものとしてマークされます。";
          }

          if (container.textContent === "ポストに位置情報を追加する") {
            container.textContent = "ツイートに位置情報を追加する";
          }

          if (
            container.textContent ===
            "ポストに追加された位置情報をすべて削除する"
          ) {
            container.textContent =
              "ツイートに追加された位置情報をすべて削除する";
          }

          if (
            container.textContent ===
            "ポストに追加された位置情報をすべて削除しますか？"
          ) {
            container.textContent =
              "ツイートに追加された位置情報をすべて削除しますか？";
          }

          if (
            container.textContent ===
            "ポストに追加した位置情報ラベルはX.com、X for iOS、X for Androidに表示されなくなります。この変更が適用されるまで時間がかかることがあります。"
          ) {
            container.textContent =
              "ツイートに追加した位置情報ラベルはTwitter Web App、Twitter for iOS、Twitter for Androidに表示されなくなります。この変更が適用されるまで時間がかかることがあります。";
          }

          if (container.textContent === "ポスト") {
            container.textContent = "ツイート";
          }

          if (container.textContent === "リポスト") {
            container.textContent = "リツイート";
          }

          if (container.textContent === "ポストする") {
            container.textContent = "ツイートする";
          }

          if (container.textContent.includes("件のポスト")) {
            container.textContent = container.textContent.replace(
              " 件のポスト",
              " 件のツイート"
            );
          }

          if (container.textContent.includes("ポスト")) {
            container.textContent = container.textContent.replace(
              "ポスト",
              "ツイート"
            );
          }

          if (container.textContent.includes("長いポスト")) {
            container.textContent = container.textContent.replace(
              "長いポスト",
              "長いツイート"
            );
          }

          if (container.textContent.includes("Xアカウント")) {
            container.textContent = container.textContent.replace(
              "Xアカウント",
              "Twitterアカウント"
            );
          }

          if (container.textContent.includes("Xで")) {
            container.textContent = container.textContent.replace(
              "Xで",
              "Twitterで"
            );
          }

          if (container.textContent.includes("Xの")) {
            container.textContent = container.textContent.replace(
              "Xの",
              "Twitterの"
            );
          }

          if (container.textContent.includes("Xが")) {
            container.textContent = container.textContent.replace(
              "Xが",
              "Twitterが"
            );
          }

          if (container.textContent.includes("Xと")) {
            container.textContent = container.textContent.replace(
              "Xと",
              "Twitterと"
            );
          }

          if (container.textContent.includes("Xに")) {
            container.textContent = container.textContent.replace(
              "Xに",
              "Twitterに"
            );
          }

          if (
            container.textContent ===
            "プレミアムに含まれている特典を確認し、設定を管理しましょう"
          ) {
            container.textContent =
              "Blueに含まれている特典を確認し、設定を管理しましょう";
          }

          if (container.textContent === "Xアクティビティ") {
            container.textContent = "Twitterアクティビティ";
          }

          if (container.textContent === "Reposts") {
            container.textContent = "件のリツイート";
          }

          if (container.textContent === "リポストしたユーザー") {
            container.textContent = "リツイートしたユーザー";
          }

          if (container.textContent.includes("さんがポストしました")) {
            container.textContent = "さんがツイートしました";
          }
        });
    }, 1);
  };

      new MutationObserver(fixLogo).observe(document.body, {
        childList: true,
        subtree: true,
      });

      fixLogo();
      fixIcon();
      redirect();
      fixTitle();
      fixText();
      returnTweetLabel();
})();
