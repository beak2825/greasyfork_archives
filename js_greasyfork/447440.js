// ==UserScript==
// @name         twitter following export
// @namespace    twitter@following
// @version      0.2
// @description  twitter followings export
// @author       fun
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/447440/twitter%20following%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/447440/twitter%20following%20export.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let authorizationCode = `Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA`;

  function wait(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function getUserMeta(user) {
    if (user.__typename != "User") return null;
    const {
      screen_name,
      entities,
      created_at,
      followers_count,
      friends_count,
      description,
      location,
      verified,
      statuses_count,
      profile_image_url_https,
      following,
      name,
    } = user.legacy;
    return {
      avatar: profile_image_url_https,
      userId: user.rest_id,
      created_at,
      description,
      followers_count,
      friends_count,
      location,
      verified,
      name,
      screen_name,
      statuses_count,
      following,
      url:
        entities.url && entities.url.urls.length
          ? entities.url.urls[0].expanded_url
          : null,
    };
  }

  class TwitterAPIHelper {
    static async fetchInfo(id) {
      const variables = encodeURIComponent(
        `{"screen_name":"${id}","withSafetyModeUserFields":true,"withSuperFollowsUserFields":false}`
      );
      const req = await fetch(
        "https://twitter.com/i/api/graphql/B-dCk4ph5BZ0UReWK590tw/UserByScreenName?variables=" +
          variables,
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
            authorization: authorizationCode,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": getCookie("ct0"),
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
          },
          referrer: "https://twitter.com/avinash_81",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      const info = await req.json();
      console.log(info);
      if (!info.data.user) return null;
      return info.data.user && getUserMeta(info.data.user.result);
    }

    static async getFollowing(id, count = 20) {
      // const csfrToken = getCookie('ct0');
      const args = {
        userId: "" + id + "",
        count: count,
        withTweetQuoteCount: false,
        includePromotedContent: false,
        withSuperFollowsUserFields: true,
        withUserResults: true,
        withNftAvatar: false,
        withBirdwatchPivots: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withSuperFollowsTweetFields: true,
      };
      const data = encodeURIComponent(JSON.stringify(args));
      // const authorizationCode = this.authorization;
      if (authorizationCode == null) {
        throw new Error("please open twitter");
      }
      const req = await fetch(
        "https://twitter.com/i/api/graphql/Fl6SSu1BCrwN6m-rLacKqg/Following?variables=" +
          data,
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
            authorization: authorizationCode,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": getCookie("ct0"),
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
          },
          referrer: "https://twitter.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      const followings = await req.json();
      // console.log(followings);
      const items =
        followings.data.user.result.timeline.timeline.instructions.find(
          (_) => _.type == "TimelineAddEntries"
        );
      // console.log(items);
      const users = items.entries
        .filter((_) => _.content.entryType == "TimelineTimelineItem")
        .map((_) => {
          const userItem = _.content.itemContent.user_results.result;
          const parsedMeta = getUserMeta(userItem);
          return {
            ...parsedMeta,
            sortIndex: _.sortIndex,
          };
        });
      return users;
    }

    static async getFollowers(id, count = 20, cursor = null) {
      const args = {
        userId: id,
        count: 20,
        cursor,
        includePromotedContent: false,
        withSuperFollowsUserFields: true,
        withDownvotePerspective: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withSuperFollowsTweetFields: true,
      };

      const features = encodeURIComponent(
        JSON.stringify({
          dont_mention_me_view_api_enabled: true,
          interactive_text_enabled: true,
          responsive_web_uc_gql_enabled: false,
          vibe_tweet_context_enabled: false,
          responsive_web_edit_tweet_api_enabled: false,
          standardized_nudges_misinfo: false,
          responsive_web_enhance_cards_enabled: false,
        })
      );

      const data = encodeURIComponent(JSON.stringify(args));
      if (authorizationCode == null) {
        throw new Error("please open twitter");
      }
      const req = await fetch(
        "https://twitter.com/i/api/graphql/Fl6SSu1BCrwN6m-rLacKqg/Followers?variables=" +
          data +
          "&features=" +
          features,
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
            authorization: authorizationCode,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": getCookie("ct0"),
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
          },
          referrer: "https://twitter.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      const followings = await req.json();
      // console.log(followings);
      const items =
        followings.data.user.result.timeline.timeline.instructions.find(
          (_) => _.type == "TimelineAddEntries"
        );
      // console.log(items);
      const cursors = items.entries
        .filter((_) => _.content.entryType == "TimelineTimelineCursor")
        .reduce((all, item) => {
          all[item.content.cursorType] = item.content.value;
          return all;
        }, {});
      const users = items.entries
        .filter((_) => _.content.entryType == "TimelineTimelineItem")
        .map((_) => {
          const userItem = _.content.itemContent.user_results.result;
          const parsedMeta = getUserMeta(userItem);
          return {
            ...parsedMeta,
            sortIndex: _.sortIndex,
          };
        });
      return {
        users,
        cursors,
      };
    }

    static async getTweetActionUsers(
      tweetId,
      count = 20,
      type = "Retweeters",
      cursor = null
    ) {
      const args = {
        tweetId,
        count,
        cursor,
        includePromotedContent: true,
        withSuperFollowsUserFields: true,
        withDownvotePerspective: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withSuperFollowsTweetFields: true,
      };
      //   userId: id,
      //   count: 20,
      //   cursor,
      //   includePromotedContent: false,
      //   withSuperFollowsUserFields: true,
      //   withDownvotePerspective: false,
      //   withReactionsMetadata: false,
      //   withReactionsPerspective: false,
      //   withSuperFollowsTweetFields: true,
      // };

      const features = encodeURIComponent(
        JSON.stringify({
          dont_mention_me_view_api_enabled: true,
          interactive_text_enabled: true,
          responsive_web_uc_gql_enabled: false,
          vibe_tweet_context_enabled: false,
          responsive_web_edit_tweet_api_enabled: false,
          standardized_nudges_misinfo: false,
          responsive_web_enhance_cards_enabled: false,
        })
      );

      const data = encodeURIComponent(JSON.stringify(args));
      if (authorizationCode == null) {
        throw new Error("please open twitter");
      }

      const endpoint =
        type === "Favoriters"
          ? "RMoTahkos95Jcdw-UWlZog"
          : "qVWT1Tn1FiklyVDqYiOhLg";
      const req = await fetch(
        `https://twitter.com/i/api/graphql/${endpoint}/${type}?variables=` +
          data +
          "&features=" +
          features,
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
            authorization: authorizationCode,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": getCookie("ct0"),
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
          },
          referrer: "https://twitter.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      const followings = await req.json();
      // console.log(followings);
      const instructions =
        type === "Retweeters"
          ? followings.data.retweeters_timeline.timeline.instructions
          : followings.data.favoriters_timeline.timeline.instructions;
      const items = instructions.find((_) => _.type == "TimelineAddEntries");
      // console.log(items);
      const cursors = items.entries
        .filter((_) => _.content.entryType == "TimelineTimelineCursor")
        .reduce((all, item) => {
          all[item.content.cursorType] = item.content.value;
          return all;
        }, {});
      const users = items.entries
        .filter((_) => _.content.entryType == "TimelineTimelineItem")
        .map((_) => {
          const userItem = _.content.itemContent.user_results.result;
          const parsedMeta = getUserMeta(userItem);
          return {
            ...parsedMeta,
            sortIndex: _.sortIndex,
          };
        });
      return {
        users,
        cursors,
      };
    }
  }

  class LSStore {
    async get(key) {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    }

    async set(key, value) {
      return localStorage.setItem(key, JSON.stringify(value));
    }
  }

  async function getUsers(value, type = "followers") {
    let userInfo = null;
    if (type === "followers") {
      userInfo = await TwitterAPIHelper.fetchInfo(value);
    }
    console.log("userInfo", userInfo);
    let cursors = null;
    let userPools = [];
    for (let index = 0; index < Infinity; index++) {
      let result = null;
      if (type === "followers") {
        result = await TwitterAPIHelper.getFollowers(
          userInfo.userId,
          20,
          cursors ? cursors.Bottom : null
        );
      } else {
        result = await TwitterAPIHelper.getTweetActionUsers(
          value,
          20,
          type,
          cursors ? cursors.Bottom : null
        );
      }

      printLog(`正在导出第 ${index + 1} 页`);
      cursors = result.cursors;
      console.log("result", result);

      if (result.users.length === 0) break;
      if (userPools.length > 20 && type === "followers") {
        userPools.shift();
      }
      userPools.push(result.users);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 8 * 1000);
      });
    }

    printLog(`完成`);

    download(
      []
        .concat(
          [
            [
              "userId",
              "name",
              "screen_name",
              "created_at",
              "followers_count",
              "url",
              "link",
            ].join(","),
          ],
          userPools
            .reduce((all, users) => {
              users.forEach((_) => {
                all.push(_);
              });
              return all;
            }, [])
            .map((_) => {
              return [
                _.userId,
                `"${_.name}"`,
                _.screen_name,
                _.created_at,
                //   description,
                _.followers_count,
                //   friends_count,
                //   location,
                //   verified,

                //   statuses_count,
                //   following,
                _.url,
                `https://twitter.com/${_.screen_name}`,
              ].join(",");
            })
        )
        .join("\n"),
      [type, "-", value, ".csv"].join(""),
      "text/plain"
    );

    //   return userPools;
  }

  let wrapper = document.createElement("div");

  let backup = document.createElement("div");

  backup.innerHTML = `<div><span id="bMSG"></span></div>
<div style="text-align: center;"></div>  `;

  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function printLog(msg) {
    tip.innerText = msg;
  }

  backup.setAttribute(
    "style",
    "display:none; background: white; color: black; font-size: 13px; padding: 10px 10px 15px 10px;"
  );

  //   backup.appendChild(tip);
  const title = document.createElement("h2");
  title.innerHTML = "粉丝导出";

  title.setAttribute("style", "font-size: 15px;color: black;margin: 15px 0;");
  wrapper.appendChild(title);
  wrapper.appendChild(backup);

  document.body.appendChild(wrapper);
  wrapper.setAttribute(
    "style",
    `position: fixed;
    border-radius: 3px;
    background: white;
    top: 80px;
    right: 20px;
    z-index: 100000;
    padding:10px 15px;
text-align: center;
border: 1px solid #eee;
    border-radius: 5px;
   `
  );

  let started = false;

  let allButtons = [];
  function showAll() {
    allButtons.forEach((btn) => {
      btn.style.display = "block";
    });
  }

  function hideAll() {
    allButtons.forEach((btn) => {
      btn.style.display = "none";
    });
  }

  function createExport(name, type) {
    let btn = document.createElement("button");
    wrapper.appendChild(btn);
    btn.innerHTML = name;
    btn.setAttribute(
      "style",
      `border-radius: 0.166667rem; display: block; font-weight: bold; color: #444; margin:0 auto; padding: 5px 14px;font-size: 13px;text-align: center;border: 1px solid #cfcfcf;margin-top: 3px; cursor: pointer;  margin-bottom: 7px;`
    );
    btn.addEventListener("click", async () => {
      if (started) {
        alert("started");
        return;
      }
      started = true;
      hideAll();
      backup.style.display = "block";
      //   indicator.style.display = "inline-block";
      const tabTile = document.querySelector('[property="al:android:url"]');
      if (!tabTile) {
        alert("user not found");
        return;
      }
      const exportValue =
        type === "followers"
          ? document
              .querySelector('[property="al:android:url"]')
              .content.split("screen_name=")[1]
          : document
              .querySelector('[property="al:android:url"]')
              .content.split("status?id=")[1];
      console.log("getUsers", exportValue, type);
      await getUsers(exportValue, type);
      started = false;
      showAll();
      //   indicator.style.display = "none";
    });

    allButtons.push(btn);
  }
  let tip = document.getElementById("bMSG");
  //   let indicator = document.getElementById("bIndicator");

  createExport("导出早期关注", "followers");
  createExport("导出转推", "Retweeters");
  createExport("导出喜欢", "Favoriters");
})();
