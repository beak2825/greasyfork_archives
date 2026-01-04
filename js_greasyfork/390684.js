// ==UserScript==
// @name         block twitter account followers
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Blocking account followers. Might need to refresh the profile page.
// @author       You
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390684/block%20twitter%20account%20followers.user.js
// @updateURL https://update.greasyfork.org/scripts/390684/block%20twitter%20account%20followers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let csrf_token = document.cookie.replace(/(?:(?:^|.*;\s*)ct0\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let listOfFollowers = [];



    window.onload = window.setTimeout(()=>{init();}, 3000);   // workaround for onload fire too early


    function init(){
        initBlockActionButton('block followers', blockFollower);
        initBlockActionButton('unblock followers', unBlockFollower);
    }

    function initBlockActionButton(actionName, eventHandler){
        const profileDiv = document.getElementsByClassName('css-1dbjc4n r-ku1wi2 r-1j3t67a r-m611by')[0];
        const blockActionButton = document.createElement('a');
        const blockActionButtonContainer = document.createElement('div');
        let textNode = document.createTextNode(actionName);
        console.log('adding button:'+ actionName);
        blockActionButtonContainer.className = "css-1dbjc4n r-1joea0r";
        blockActionButton.className = 'css-4rbku5 css-18t94o4 css-901oao r-hkyrab r-1loqt21 r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-qvutc0';
        blockActionButton.appendChild(textNode);
        blockActionButton.setAttribute("style", "color:red");
        blockActionButton.addEventListener('click', (e)=>{
            if(window.confirm(actionName + '?')){
                const name = profilePageGetName();
                getIdFromName(name, eventHandler);
            }
        });
        blockActionButtonContainer.appendChild(blockActionButton);
        profileDiv.getElementsByClassName('css-1dbjc4n r-18u37iz')[4].appendChild(blockActionButtonContainer);
    }





    function profilePageGetName(){
  //TODO  return document.URL.replace(/(.com\/(.*)(\/|$))|^.*$/, $1);
          return document.URL.split('/').pop();             //this method find problem when url has the form of https://twitter.com/xxxxxx/with_replies
    }


    function getIdFromName(name, callback){
        const url = `https://api.twitter.com/graphql/r9YEJ2GN-KD15ihh_i5hMw/UserByScreenName?variables=%7B%22screen_name\
%22%3A%22${name}%22%2C%22withHighlightedLabel%22%3Atrue%7D`;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                const res = JSON.parse(xhr.response);
                getFollowers(res.data.user.rest_id,'-1',200, listOfFollowers, callback);
            }
        }
        xhr.open('GET',url);
        xhr.setRequestHeader('x-csrf-token', csrf_token);
        xhr.setRequestHeader('authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
        xhr.send();
    }



    function getFollowers(userID, cursorID, count, listOfFollowers, action){

        let url = `https://api.twitter.com/1.1/followers/list.json?include_profile_interstitial_type=1&include_blocking=1\
&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1\
&skip_status=1&cursor=${cursorID}&user_id=${userID}&count=${count}`;

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              let res = JSON.parse(xhr.response);
              let followers = res.users;
              let next_cursor_str = res.next_cursor_str;
              for (let i=0; i<followers.length; i++) {
                  listOfFollowers.push(followers[i].id_str);
                  action(followers[i].id_str);
              }
              if(next_cursor_str === '0'){alert('Action Completed!')}
              if(next_cursor_str !== '0'){
                  getFollowers(userID, next_cursor_str, count, listOfFollowers, action);
              }
          }
        };
        xhr.open('GET',url);
        xhr.setRequestHeader('x-csrf-token', csrf_token);
        xhr.setRequestHeader('authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
        xhr.setRequestHeader('x-twitter-active-user', 'yes');
        xhr.setRequestHeader('x-twitter-auth-type', 'OAuth2Session');
        xhr.setRequestHeader('x-twitter-client-language', 'en-GB');
        xhr.withCredentials = true;
        xhr.send();
    }

    function blockFollowers(listOfFollowers){
        for(let i=0; i<listOfFollowers.length; i++){
            let followerId = listOfFollowers[i];
            blockFollower(followerId);
        }
    }


    function blockFollower(followerId){
        let url = 'https://api.twitter.com/1.1/blocks/create.json';
        blockAction(url, followerId);
    }

    function unBlockFollower(followerId){
        let url = 'https://api.twitter.com/1.1/blocks/destroy.json';
        blockAction(url, followerId);
    }

    function blockAction(url, followerId){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4) {
                if(xhr.status.toString()[0] === '2'){console.log('Action Complete!');}
                else{
                    console.log('Action Failed');
                }
            }
        }
        xhr.open('POST',url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("x-csrf-token", csrf_token);
        xhr.setRequestHeader('authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
        xhr.setRequestHeader('x-twitter-active-user', 'yes');
        xhr.setRequestHeader('x-twitter-auth-type', 'OAuth2Session');
        xhr.setRequestHeader('x-twitter-client-language','en-GB');
        xhr.withCredentials = true;
        xhr.send(`user_id=${followerId}`);
    }
})();