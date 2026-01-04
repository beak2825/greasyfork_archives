// ==UserScript==
// @name         Mentions Only
// @namespace    https://www.youtube.com/c/NurarihyonMaou/
// @version      1.2
// @description  Only Mentions
// @author       NurarihyonMaou
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/452621/Mentions%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/452621/Mentions%20Only.meta.js
// ==/UserScript==

let url = "https://anilist.co/graphql";
const x_csrf_token = $("head script:contains('window.al_token')")
  .text()
  .split(/[“"”]+/g)[1];
let hasNextPage = false;
let variables = {page: 1};

let filters;

let allNotifications;

function timeSince(date) {

  date = date*1000;

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}


async function sendQuery(query, variables = {}) {
    let dataToReturn;

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-csrf-token": x_csrf_token,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

    await fetch(url, options)
      .then(handleResponse)
      .then(handleData)
      .catch(handleError);

    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleData(data) {
      return (dataToReturn = data);
    }

    function handleError(error) {
      console.error(error);
      return false;
    }
    return dataToReturn;
  }

    (function init() {
        filters = document.getElementsByClassName("filter-group");
        if (filters.length > 0) {

    $("div.filter-group").append(`<div data-v-119352f9="" class="link">Mentions</div>`);

    $("div.link").click(function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    let query = `{Page { notifications(type:ACTIVITY_MENTION){...on ActivityMentionNotification{
        activityId
      context
      createdAt
      user{
        name
        avatar{
            large
        }
      }
    }
    }}}
    `;

    $("body div").on('click', '.link:contains("Mentions")', async function(){
        let notifications = await sendQuery(query);
        notifications = notifications.data.Page.notifications;

        allNotifications = notifications;
        variables.page++;
        let ogNotification = $("div.notifications").children("div.notification");



        allNotifications.forEach((notification, index) => {

            if(ogNotification[index])
                $(ogNotification[index]).replaceWith(`<div data-v-6c4dd492="" data-v-119352f9="" class="notification"><!----> <a data-v-6c4dd492="" href="/user/${notification.user.name}/"
                class="avatar" style="background-image: url(&quot;${notification.user.avatar.large}&quot;);"></a> <div data-v-6c4dd492="" class="details">
                <div data-v-6c4dd492=""><a data-v-6c4dd492="" href="/activity/${notification.activityId}" class="link">
                ${notification.user.name}
                <span data-v-6c4dd492="" class="context"> ${notification.context}</span></a></div> <div data-v-6c4dd492="" class="time"><time data-v-6c4dd492=""
                datetime="${notification.createdAt}" title="${new Date(notification.createdAt*1000)}">${timeSince(new Date(notification.createdAt))}</time></div></div></div>`);
            else
                $("div.notifications").append(`<div data-v-6c4dd492="" data-v-119352f9="" class="notification"><!----> <a data-v-6c4dd492="" href="/user/${notification.user.name}/"
                class="avatar" style="background-image: url(&quot;${notification.user.avatar.large}&quot;);"></a> <div data-v-6c4dd492="" class="details">
                <div data-v-6c4dd492=""><a data-v-6c4dd492="" href="/activity/${notification.activityId}" class="link">
                ${notification.user.name}
                <span data-v-6c4dd492="" class="context">${notification.context}</span></a></div> <div data-v-6c4dd492="" class="time"><time data-v-6c4dd492=""
                datetime="${notification.createdAt}" title="${new Date(notification.createdAt*1000)}">${timeSince(new Date(notification.createdAt))}</time></div></div></div>`);

        });
    });

            $(window).scroll(async function() {

    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        let query = `query ($page: Int)
        {Page (page: $page){
            pageInfo{
              hasNextPage
              } notifications(type:ACTIVITY_MENTION){...on ActivityMentionNotification{
            activityId
          context
          createdAt
          user{
            name
            avatar{
                large
            }
          }
        }
        ...on ActivityMessageNotification{
            activityId
          context
          createdAt
          user{
            name
            avatar{
                large
            }
          }
        }
        }}}`;

        let notifications = await sendQuery(query, variables);
        let ogNotification = $("div.notifications").children("div.notification");

        notifications = notifications.data.Page.notifications;

        allNotifications = $.merge(allNotifications, notifications);


        //hasNextPage = notifications.data.Page.pageInfo.hasNextPage;

        allNotifications.forEach((notification, index) => {

                 console.log(timeSince(new Date(notification.createdAt)));
            if(ogNotification[index])
                $(ogNotification[index]).replaceWith(`<div data-v-6c4dd492="" data-v-119352f9="" class="notification"><!----> <a data-v-6c4dd492="" href="/user/${notification.user.name}/"
                class="avatar" style="background-image: url(&quot;${notification.user.avatar.large}&quot;);"></a> <div data-v-6c4dd492="" class="details">
                <div data-v-6c4dd492=""><a data-v-6c4dd492="" href="/activity/${notification.activityId}" class="link">
                ${notification.user.name}
                <span data-v-6c4dd492="" class="context"> ${notification.context}</span></a></div> <div data-v-6c4dd492="" class="time"><time data-v-6c4dd492=""
                datetime="${notification.createdAt}" title="${new Date(notification.createdAt*1000)}">${timeSince(new Date(notification.createdAt))}</time></div></div></div>`);
            else
                $("div.notifications").append(`<div data-v-6c4dd492="" data-v-119352f9="" class="notification"><!----> <a data-v-6c4dd492="" href="/user/${notification.user.name}/"
                class="avatar" style="background-image: url(&quot;${notification.user.avatar.large}&quot;);"></a> <div data-v-6c4dd492="" class="details">
                <div data-v-6c4dd492=""><a data-v-6c4dd492="" href="/activity/${notification.activityId}" class="link">
                ${notification.user.name}
                <span data-v-6c4dd492="" class="context"> ${notification.context}</span></a></div> <div data-v-6c4dd492="" class="time"><time data-v-6c4dd492=""
                datetime="${notification.createdAt}" title="${new Date(notification.createdAt*1000)}">${timeSince(new Date(notification.createdAt))}</time></div></div></div>`);

        });

        variables.page++;

    }
});


 } else {
            setTimeout(init, 0);
        }
    })();