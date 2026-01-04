// ==UserScript==
// @name        block CCP propaganda tweets likers
// @namespace   https://eolstudy.com
// @version     4.5.7
// @description Block with love.
// @author      amormaid
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @exclude     https://twitter.com/account/*

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446191/block%20CCP%20propaganda%20tweets%20likers.user.js
// @updateURL https://update.greasyfork.org/scripts/446191/block%20CCP%20propaganda%20tweets%20likers.meta.js
// ==/UserScript==

/* Inspired by Twitter-Block-With-Love https://greasyfork.org/en/scripts/398540-twitter-block-with-love */

(_ => {
    // @require     https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js

    let timer_id
    function block_notice (message) {
      let btnNode = document.getElementById('block_root')
      if (!btnNode) {
        btnNode = document.createElement('div')
        btnNode.setAttribute('id', 'block_root')
      }

      btnNode.innerText = message
      btnNode.style.cssText = `
        position: fixed;
        left: calc(50% - 100px);
        top: calc(50vh - 60px);;
        width: 200px;
        height: 120px;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid #eaeaea;
        text-align: center;
        line-height: 120px;
        font-size: 16px;
      `
      document.body.append(btnNode)
      clearTimeout(timer_id)
      timer_id = setTimeout( () => {
        btnNode.parentNode.removeChild(btnNode)
      }, 5000)
    }


    class HTTPError extends Error {
        constructor(response, ...params) {
          // Pass remaining arguments (including vendor specific ones) to parent constructor
          super(...params);

          this.response = response;

          // Maintains proper stack trace for where our error was thrown (only available on V8)
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HTTPError);
          }

          this.name = 'HTTPError';
        }
    }

    // window.axios = {};
    const ajax = {};
    ['get','post','put','delete'].forEach(requestType => {
      ajax[requestType] = function (url, data){
        return fetch(`https://api.twitter.com${url}`, {
            headers: {
                // modify Content-Type for /1.1/blocks/create.json
                "Content-Type": requestType.toUpperCase() === 'POST' ? 'application/x-www-form-urlencoded' : "application/json",
                "Accept": "application/json",
                //"X-Requested-With": "XMLHttpRequest",
                // "X-CSRF-Token": token.content
                'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                'X-Twitter-Auth-Type': 'OAuth2Session',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': get_cookie('ct0')

            },
            method: requestType,
            mode: "cors",
            credentials: "include",
            body: requestType.toUpperCase() === 'POST' ? stringify(data) : JSON.stringify(data),
        })
          .then( async response=>{
              if (!response.ok) {
                  let data=await response.json();
                  response.data = data;
                  console.log(response);
                  throw new HTTPError(response, response.statusText);
              }
              return response;
          }).then(response=>{
              return response.json();
          }).then(jsonResponse => {
              return {data:jsonResponse};
          });
      }
    });


    function stringify(obj, sep, eq) {
        sep = sep || '&';
        eq = eq || '=';
        let str = "";
        for (var k in obj) {
            str += k + eq + decodeURIComponent(obj[k]) + sep
        }
        return str.slice(0, -1)
    };

    function parse(str) {
        var obj = new Object();
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            let index = strs[i].indexOf("=")
            obj[strs[i].slice(0, index)] = decodeURIComponent(strs[i].slice(index + 1));
        }
        return obj;
    }

    //解析url地址
    function getRequest() {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            return parse(str)
        }
    }

    function get_theme_color (){
      const close_icon = $('div[aria-label] > div[dir="auto"] > svg[viewBox="0 0 24 24"]')[0]
      return window.getComputedStyle(close_icon).color
    }

    async function sleep (ms = 50) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    function component_to_hex (c) {
      if (typeof(c) === 'string') c = Number(c)
      const hex = c.toString(16);
      return hex.length === 1 ? ("0" + hex) : hex;
    }

    function rgb_to_hex (r, g, b) {
      return "#" + component_to_hex(r) + component_to_hex(g) + component_to_hex(b);
    }

    function get_cookie (cname) {
      let name = cname + '='
      let ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; ++i) {
        let c = ca[i].trim()
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }

    function getStorage (name) {
      try {
        return window.JSON.parse(sessionStorage.getItem(name) || '[]')
      } catch (err) {
        sessionStorage.setItem(name, '[]')
        return []
      }
    }

    function setStorage (name, val) {
      sessionStorage.setItem(name, window.JSON.stringify(val))
    }

    function get_ancestor (dom, level) {
      for (let i = 0; i < level; ++i) {
        dom = dom.parent()
      }
      return dom
    }

    // const ajax = axios.create({
    //   baseURL: 'https://api.twitter.com',
    //   withCredentials: true,
    //   headers: {
    //     // 'User-Agent': '',
    //     'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    //     'X-Twitter-Auth-Type': 'OAuth2Session',
    //     'X-Twitter-Active-User': 'yes',
    //     'X-Csrf-Token': get_cookie('ct0')
    //   }
    // })

    // https://developer.twitter.com/en/docs/twitter-api/v1
    async function get_user_timeline (screen_name) {
      // https://api.twitter.com/1.1/statuses/user_timeline.json
      const tweets_list = await ajax.get(`/1.1/statuses/user_timeline.json?screen_name=${screen_name}&count=5000&stringify_ids=true`).then(
        res => res.data
      ) || []
      return tweets_list
    }
    // users this user is following
    async function get_friends (userId) {
      const cachedFriends = getStorage('friends')
      if (cachedFriends && cachedFriends.length) {
        return cachedFriends
      }
      const my_id = get_cookie('twid').replace('u%3D', '')
      const users = await ajax.get(`/1.1/friends/ids.json?user_id=${userId || my_id}&count=5000&stringify_ids=true`).then(
        res => res.data.ids
      ) || []
      // console.log('get_friends', users)
      setStorage('friends', window.JSON.stringify(users))
      return users
    }

    // users follow this user
    async function get_followers (userId) {
      const cachedUsers = getStorage('followers')
      if (cachedUsers && cachedUsers.length) {
        return cachedUsers
      }
      const my_id = get_cookie('twid').replace('u%3D', '')
      const users = await ajax.get(`/1.1/followers/ids.json?user_id=${userId || my_id}&count=5000&stringify_ids=true`).then(
        res => res.data.ids
      ) || []
      // console.log('get_followers', users)
      setStorage('followers', window.JSON.stringify(users))
      return users
    }

    async function get_list_menber (listId) {
      const cachedUsers = getStorage('ccpmember')
      if (cachedUsers && cachedUsers.length) {
        return cachedUsers
      }
      const users = await ajax.get(`/1.1/lists/members.json?list_id=${listId}&count=5000`).then(
        res => res.data.users
      )
      // console.log('get_list_menber', users)
      const newUsers =  (users || []).map(({ id_str }) => id_str)
      setStorage('ccpmember', window.JSON.stringify(newUsers))
      return newUsers
    }

    // https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/overview
    async function get_list_tweets(listId, tweets_number = 100, last_id) {
      const tweets_list_res = await ajax.get(`/1.1/lists/statuses.json?list_id=${listId}&include_rts=false&count=${tweets_number}${last_id ? `&max_id=${last_id}` : ''}`)
      // console.log('get_list_tweets res before ', last_id, ' is ',  tweets_list_res.data)
      return (tweets_list_res || {}).data || []
    }

    function get_tweet_id () {
      // https://twitter.com/any/thing/status/1234567/anything => 1234567/anything => 1234567
      return location.href.split('status/')[1].split('/')[0]
    }

    // function get_list_id () {
    //   // https://twitter.com/any/thing/lists/1234567/anything => 1234567/anything => 1234567
    //   return location.href.split('lists/')[1].split('/')[0]
    // }

    // fetch_likers and fetch_no_comment_retweeters need to be merged into one function
    async function fetch_likers (tweetId) {
      const users = await ajax.get(`/2/timeline/liked_by.json?tweet_id=${tweetId}`).then(
        res => res.data.globalObjects.users
      )

      let likers = []
      Object.keys(users).forEach(user => likers.push(user)) // keys of users are id strings
      return likers
    }

    // async function fetch_no_comment_retweeters (tweetId) {
    //   const users = (await ajax.get(`/2/timeline/retweeted_by.json?tweet_id=${tweetId}`)).data.globalObjects.users

    //   let targets = []
    //   Object.keys(users).forEach(user => targets.push(user))
    //   return targets
    // }

    // async function fetch_list_members (listId) {
    //   const users = (await ajax.get(`/1.1/lists/members.json?list_id=${listId}`)).data.users
    //   let members = []
    //   members = users.map(u => u.id_str)
    //   return members
    // }

    function block_user (id) {
      // ajax.post('/1.1/blocks/create.json', Qs.stringify({
      // ajax.post('/1.1/blocks/create.json', stringify({
      //   user_id: id
      // }), {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   }
      // })
      ajax.post('/1.1/blocks/create.json', {
        user_id: id
      })
    }

  //   function mute_user (id) {
  //     ajax.post('/1.1/mutes/users/create.json', Qs.stringify({
  //       user_id: id
  //     }), {
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       }
  //     })
  //   }


    async function get_list_likers_a (tweets_list = [], pre_id, tweets_number_max = 5,count = 0) {
      const max_tweets_per_request = 2
      // let tweets_list = []
      let last_id = pre_id

      if (tweets_list.length >= tweets_number_max) {
        return tweets_list
      }
      if (count >= 5) {
        return tweets_list
      }

      let new_list
      new_list = await get_list_tweets('1661581723006803968', max_tweets_per_request, last_id)
      // it is so wired, code has TDZ con not access new_list before initialize
      // console.log('pre_id is ', pre_id, new_list)
      // console.log('new_list', new_list)
      (new_list || []).forEach(list_item => {
        const {id} = list_item || {}
        last_id = id
        tweets_list.push(list_item)
      })
      return await get_list_likers(tweets_list, last_id, tweets_number_max, count + 1)
    }

    let last_id
    async function get_list_likers (tweets_number_max = 1000,) {
      const max_tweets_per_request = Math.min(85, tweets_number_max)
      let tweets_list = []
      // let last_id

      const query_times = Math.ceil(tweets_number_max/max_tweets_per_request)
      const promise_sequence = Array.from(new Array(query_times + 1)).reduce(async (acc, cur) => {
        // const pre_res = await acc || []
        const [, pre_res = []] =  await Promise.all([sleep(Math.ceil(Math.random() * 100)), acc])
        const last_tweet = (pre_res.slice(-1) || [])[0] || {}
        const {id} = last_tweet
        // console.log('pre_res ', pre_res)
        last_id = id
        tweets_list = [...tweets_list, ...pre_res]

        if (tweets_list.length >= tweets_number_max) {
          return  Promise.resolve()
        } else {
          const new_request = get_list_tweets('1661581723006803968', max_tweets_per_request, last_id)
          return new_request
        }
      }, Promise.resolve())
      await promise_sequence
      console.log('get_list_likers end')
      return tweets_list
    }

    let last_run
    let block_list_cache = []
    const block_like_threshlod = 50 // 99
    const block_number_per_batch = 60
    const query_tweets_number = 120 // 100

    // block_all_liker and block_no_comment_retweeters need to be merged
    async function block_all_pinker () {
      if (last_run && (new Date().getTime() - last_run < 30 * 1000)) {
        return block_notice('API limit, please wait')
      }
      block_notice('blocker running !')
      last_run = new Date().getTime()

      try {
        let likers = []

        // at likes page, block likes user
        if (window.location.href.match(/\d+\/likes$/)) {
          const tweetId = get_tweet_id()
          likers = await fetch_likers(tweetId)
        }



        if (!window.location.href.match(/\d+\/likes$/)) {
          let twetts_asemble = []
          // at home page, block list tweets likes user
          if (window.location.pathname.includes('lists/')) {
            // at list menber page, block member tweets likes user
            twetts_asemble = await get_user_timeline(window.location.pathname.replace('/', ''))
            console.log('get twetts_asemble ', twetts_asemble.length)
          } else {
            return
          }

          likers = await get_likers_by_tweet_list(twetts_asemble)

        }

        await block_action(likers)

        // likers.forEach(id => block_user(id))
        // last_run = null


      } catch (err) {
        console.error(err)
        // last_run = null
        block_notice('block failed')
      }
    }

    async function block_all_pinker_home () {
      last_run = last_run || (localStorage.getItem('last_run') - 0)
      if (last_run && (new Date().getTime() - last_run < 20 * 60 * 1000)) {
        return 
        // block_notice('API limit, please wait')
      }
      // block_notice('blocker running !')
      last_run = new Date().getTime()
      //   const tweetId = get_tweet_id()
      try {
        // at home page, block list tweets likes user

        const twetts_asemble = await get_list_likers(query_tweets_number)
        console.log('twetts_asemble  ', twetts_asemble.length)
        const likers = await get_likers_by_tweet_list(twetts_asemble)

        const pure_new_likers = await block_action(Array.from(new Set([...block_list_cache, ...likers])))

        block_list_cache = pure_new_likers.slice(block_number_per_batch)
        console.log('block_list_cache has ', block_list_cache.length, ' users')
        console.log(new Date().toLocaleString() + '\r\n\r\n')
        setTimeout(block_all_pinker_home, 20 * 60 * 1000)
        localStorage.setItem('last_run', new Date().getTime())
      } catch (err) {
        console.error(err)
        // last_run = null
        block_notice('block failed')
      } finally {

      }


    }

    async function get_likers_by_tweet_list(twetts_asemble) {
      let likers = []
      const promise_sequence = ([...twetts_asemble, {}]).reduce(async (acc, cur, index) => {
        const pre_res = await acc || []
        likers = [...likers, ...pre_res]
        // const last_tweet = (pre_res.slice(-1) || [])[0] || {}
        const {id_str, favorite_count} = cur
        // only query 100th ~ 200th tweet liker
        if (favorite_count > block_like_threshlod && id_str && index > 100) {
          const new_request = await fetch_likers(id_str)
          // console.log(cur, new_request, '\r\n\r\n\r\n')
          return new_request
        } else {
          return  Promise.resolve()
        }
      }, Promise.resolve())
      await promise_sequence
      console.log('find ', likers.length, ' pinkers in ', twetts_asemble.length, ' tweets')
      return likers
    }

    async function block_action(likers) {

      const [my_followers, my_friends, listMember] = await Promise.all([
        get_followers(),
        get_friends(),
        get_list_menber('1497432788634841089') // ccp propaganda list
      ])

      const newLikers = likers.filter(id => {
        const flag_a = !my_followers.includes(id)
        const flag_b = !my_friends.includes(id)
        const flag_c = !listMember.includes(id)
        return flag_a && flag_b && flag_c
      })

      const pure_new_likers = Array.from(new Set(newLikers || []))

      console.log('pure_new_likers ', pure_new_likers)
      const block_sequence = ([...pure_new_likers, '']).reduce(async (acc, cur, index) => {
        await Promise.all([sleep(Math.ceil(Math.random() * 100)), acc])
        // if (index === 80 || index === 350 || index === 700) {
        //   // limit 300 per minute
        //   await sleep(15 * 60 * 1000)
        // }
        let id = cur
        if (id && index < block_number_per_batch) {
          block_notice(`bocked ${index + 1} / ${pure_new_likers.length}`)
          const new_request = block_user(id)
          return new_request
        } else {
          return  Promise.resolve()
        }
      }, Promise.resolve())
      await block_sequence
      return pure_new_likers
    }



    function mount_button (parentDom, name, executer) {
      const btnNode = document.createElement('button')
      btnNode.innerText = name
      btnNode.style.cssText = `
        position: fixed;
        right: 0px;
        top: 5px;
      `
      btnNode.addEventListener('click', executer)
      parentDom.append(btnNode)
    }


    // function use_MutationObserver () {

    //   const targetNode = document.getElementById('react-root');
    //   // Options for the observer (which mutations to observe)
    //   const config = { attributes: true, childList: true, subtree: true };
    //   // Callback function to execute when mutations are observed
    //   const callback = (mutationList, observer) => {
    //     for (const mutation of mutationList) {

    //       if (mutation.type === 'childList' && mutation.target?.innerText?.includes('liked by')) {
    //         // console.log('mutation', mutation)
    //         const domList = Array.from(mutation.target.getElementsByTagName('h2'))
    //         const domTarget = domList.find(i => i.innerText === 'liked by')
    //         if (domTarget) {
    //           mount_button(domTarget, 'Block Pinker', block_all_pinker)
    //         }
    //       }
    //       // if (mutation.type === 'childList') {
    //       //   console.log('A child node has been added or removed.');
    //       // } else if (mutation.type === 'attributes') {
    //       //   console.log(`The ${mutation.attributeName} attribute was modified.`);
    //       // }
    //     }
    //   };
    //   const observer = new MutationObserver(callback)
    //   observer.observe(targetNode, config);
    // }

    if (window.top === window) {
      const mount_root = document.getElementsByTagName('body')[0]
      mount_button(mount_root, 'Block Pinker', block_all_pinker)
      setTimeout(block_all_pinker_home, 10 * 1000)
    }

    // setTimeout(block_all_pinker_home, 5 * 1000)
    // use_MutationObserver()
    // main()
  })()