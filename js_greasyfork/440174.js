// ==UserScript==
// @name        4plebs Thread Image Downloader
// @namespace   Violentmonkey Scripts
// @match       https://archive.4plebs.org/*/thread/*
// @grant       GM_download
// @grant       GM_registerMenuCommand
// @version     1.0
// @license     The Unlicense
// @author      ImpatientImport
// @description Download all images individually in a thread with original filenames (by default). Optional thread API button, for development purposes.
// @downloadURL https://update.greasyfork.org/scripts/440174/4plebs%20Thread%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/440174/4plebs%20Thread%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // Constants for later reference
  const top_of_thread = document.getElementsByClassName("post_controls")[0];
  const thread_URL = document.URL;
  const url_path = new URL(thread_URL).pathname;
  const url_path_split = url_path.toString().split('/')
  const thread_board = url_path_split[1];
  const thread_num = url_path_split[3];
  const api_url = "https://archive.4plebs.org/_/api/chan/thread/?board=" + thread_board + "&num=" + thread_num; // important
  
  /* EDIT BENEATH THIS LINE */
  
  // User preferences
  var indiv_button_enabled = true;
  
  var api_button_enabled = false;
  
  var keep_original_filenames = true;
  
  /* EDIT ABOVE THIS LINE */

  
  // Individual thread image downloader button
  
  var indiv_dl_btn;
  var indiv_dlbtn_elem;
  if (indiv_button_enabled){
    indiv_dl_btn = document.createElement('a');
    indiv_dl_btn.id = "indiv_btn";
    indiv_dl_btn.classList.add("btnr", "parent"); 
    indiv_dl_btn.innerText = "Indiv DL";
    top_of_thread.append(indiv_dl_btn);

    indiv_dlbtn_elem = document.getElementById("indiv_btn");
  }
  
  // API button for getting the JSON of a thread in a new tab
  
  var api_btn;
  var api_btn_elem;
  if (api_button_enabled){
    api_btn = document.createElement('a');
    api_btn.id = "api_btn";
    api_btn.href = api_url;
    api_btn.target = "new";
    api_btn.classList.add("btnr", "parent"); 
    api_btn.innerText = "Thread API";
    top_of_thread.append(api_btn);

    api_btn_elem = document.getElementById("api_btn");
  }
  
  // Retrieves media from the thread (in JSON format)
  // If OP only, ignore posts, else get posts
  function retrieve_media(thread_obj) {
    var media_arr = [];
    var media_fnames = [];
    var return_value = [];

    const OP = thread_obj[thread_num].op.media;
    //console.log(OP); // debug

    media_arr.push(OP.media_link);
    media_fnames.push(OP.media_filename);

    // Boolean, checks if posts are present in thread
    const posts_exist = thread_obj[thread_num].posts != undefined;

    if (posts_exist) {
      const thread_posts = thread_obj[thread_num].posts;
      const post_nums = Object.keys(thread_posts);
      const posts_length = post_nums.length;

      //Adds all post image urls and original filenames to the above arrays
      for (let i = 0; i < posts_length; i++) {

        //equivalent to: thread[posts][post_num][media]
        var temp_media_post = thread_posts[post_nums[i]].media;

        //if media exists,
        if (temp_media_post !== null) {
          //then push media to arrays
          media_arr.push(temp_media_post.media_link)
          
          if (keep_original_filenames){
            media_fnames.push(temp_media_post.media_filename);
            
            //console.log(temp_media_post.media_filename); //debug
          }
          else{
            media_fnames.push(temp_media_post.media_orig);
            
            //console.log(temp_media_post.media_orig); //debug
          }

        }
      }
    }

    // Adds the media link array with the media filenames array into the final return
    return_value[0] = media_arr;
    return_value[1] = media_fnames;
    
    for (var i=0; i<media_arr.length; i++){
      //console.log(media_fnames[i] + " "+ media_arr[i]); //debug
      
      GM_download(media_arr[i], media_fnames[i]);
    }  

  }

  // Gets the JSON file for the 4plebs thread with the API
  async function get_4plebs_thread() {
    const API_response = await fetch(api_url);
    const JSON_file = await API_response.json();
    //console.log(JSON_file); // debug
    retrieve_media(JSON_file);
  }

  GM_registerMenuCommand("Download all thread images individually", get_4plebs_thread);
  
  
  // Download thread button event listener(s)
  
  indiv_dlbtn_elem.addEventListener("click", get_4plebs_thread);
    
})();