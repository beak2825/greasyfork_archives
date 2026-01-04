// ==UserScript==
// @name        4chan Archive Image Downloader
// @namespace   Violentmonkey Scripts
// @match       https://archive.4plebs.org/*/thread/*
// @match       https://desuarchive.org/*/thread/*
// @match       https://boards.fireden.net/*/thread/*
// @match       https://archived.moe/*/thread/*
// @match       https://thebarchive.com/*/thread/*
// @match       https://archiveofsins.com/*/thread/*
// @match       https://archive.alice.al/*/thread/*
// @match       https://arch.b4k.co/*/thread/*
// @match       https://archive.palanq.win/*/thread/*
// @grant       GM_download
// @grant       GM_registerMenuCommand
// @version     1.4.2
// @license     The Unlicense
// @author      ImpatientImport
// @description 4chan archive thread image downloader for general use across many foolfuuka based imageboards. Downloads all images individually in a thread with original filenames (by default). Optional thread API button, for development purposes.
// @downloadURL https://update.greasyfork.org/scripts/440266/4chan%20Archive%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/440266/4chan%20Archive%20Image%20Downloader.meta.js
// ==/UserScript==

/* EDIT BELOW THIS LINE */

// User preferences
var indiv_button_enabled = true;

var api_button_enabled = false;

var keep_original_filenames = true; // Prioritized above archive_filenames

var archive_filenames = true; // Only used if keep_original_filenames is false. If so, archive names will be saved; otherwise, 4chan names will be saved.

var confirm_download = true;

var download_limit = 3000; // speed in milliseconds to delay

var named_poster_media_download_only = false;

var named_poster_tag_in_filename = false; // Only used if named_poster_media_download_only is true

/* EDIT ABOVE THIS LINE */


(function() {
  'use strict';

  // Constants for later reference
  const top_of_thread = document.getElementsByClassName("post_controls")[0];
  const thread_URL = document.URL;
  const archive_site = thread_URL.toString().split('/')[2];
  const url_path = new URL(thread_URL).pathname;
  const url_path_split = url_path.toString().split('/')
  const thread_board = url_path_split[1];
  const thread_num = url_path_split[3];


  // checking URL console
  /*
  console.log(url_path_split);
  console.log(url_path);
  console.log(thread_URL);
  console.log(thread_URL.toString().split('/')[2]);
  */

  const api_url = "https://" + archive_site + "/_/api/chan/thread/?board=" + thread_board + "&num=" + thread_num; // important
  //console.log(api_url)

  // Individual thread image downloader button

  var indiv_dl_btn;
  var indiv_dlbtn_elem;
  var indivOriginalStyle;
  var indivOrigStyles;
  if (indiv_button_enabled){
    indiv_dl_btn = document.createElement('a');
    indiv_dl_btn.id = "indiv_btn";
    indiv_dl_btn.classList.add("btnr", "parent");
    indiv_dl_btn.innerText = "Indiv DL";
    top_of_thread.append(indiv_dl_btn);

    indiv_dlbtn_elem = document.getElementById("indiv_btn");
    indivOriginalStyle = window.getComputedStyle(indiv_dl_btn);

    indivOrigStyles = {
      backgroundColor: indivOriginalStyle.backgroundColor,
      color: indivOriginalStyle.color,
    }
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


  function displayButton (elem){
    console.log(elem);

    var current_style = window.getComputedStyle(elem).backgroundColor;
    //console.log(current_style); // debug

    var next_style;

    const button_original_text = {"indiv_btn": "Indiv DL"};

    const button_original_styles = {"indiv_btn": indivOrigStyles};

    const confirmStyles = {
      backgroundColor: 'rgb(255, 64, 64)', // Coral Red
      color:"white",
    }

    const processingStyles = {
      backgroundColor: 'rgb(238, 210, 2)', // Safety Yellow
      color:"black",
    }

    const doneStyles = {
      backgroundColor: 'rgb(46, 139, 87)', // Sea Green
      color:"white",

    }

    const originalStyles = {
      backgroundColor: button_original_styles[elem.id].backgroundColor, // Original, clear
      color: button_original_styles[elem.id].color,

    }

    // Button style switcher
    switch (current_style) {
      case 'rgba(0, 0, 0, 0)': // Original color
        next_style = confirmStyles;
        elem.innerText = "Confirm?";
        break;

      case 'rgb(255, 64, 64)': // Confirm color
        next_style = processingStyles;
        elem.innerText = "Processing";
        break;

      case 'rgb(238, 210, 2)': // Processing color
        next_style = doneStyles;
        elem.innerText = "Done";
        break;

      case 'rgb(46, 139, 87)': // Done Color
        next_style = originalStyles;
        elem.innerText = button_original_text[elem.id];
        break;

    }

    Object.assign(elem.style, next_style);
  }


  // Retrieves media from the thread (in JSON format)
  // If OP only, ignore posts, else get posts
  function retrieve_media(thread_obj) {
    var media_arr = [];
    var media_fnames = [];
    var return_value = [];

    const OP = thread_obj[thread_num].op.media;
    //console.log(OP); // debug

    //If OP is a massive OP,
    var OP_filename = (keep_original_filenames) ? OP.media_filename : OP.media_orig;
    OP_filename = (!keep_original_filenames && archive_filenames) ? OP.media : OP_filename;
    OP_filename = (named_poster_tag_in_filename && named_poster_media_download_only) ? String(thread_obj[thread_num].op.name+"_-_"+OP_filename) : OP_filename;
    var OP_media_link = (OP.media_link == null) ? OP.remote_media_link : OP.media_link;
    if (!named_poster_media_download_only || named_poster_media_download_only && thread_obj[thread_num].op.name != "Anonymous") {
      media_arr.push(OP_media_link);
      media_fnames.push(OP_filename);
    }

    // Boolean, checks if posts are present in thread
    const posts_exist = thread_obj[thread_num].posts != undefined;

    if (posts_exist) {
      const thread_posts = thread_obj[thread_num].posts;
      const post_nums = Object.keys(thread_posts);
      const posts_length = post_nums.length;

      //Adds all post image urls and original filenames to the above arrays
      for (var i = 0; i < posts_length; i++) {

        //equivalent to: thread[posts][post_num][media]
        var temp_media_post = thread_posts[post_nums[i]].media;

        //if media exists (and is from a named poster [non-anonymous poster] if option true),
        //then push media to arrays
        if (temp_media_post !== null && (!named_poster_media_download_only || named_poster_media_download_only && thread_posts[post_nums[i]].name != "Anonymous") ) {

          var working_media_link = (temp_media_post.media_link == null) ? temp_media_post.remote_media_link : temp_media_post.media_link
          var correct_media_fname = (keep_original_filenames) ? temp_media_post.media_filename : temp_media_post.media_orig;
          correct_media_fname = (!keep_original_filenames && archive_filenames) ? temp_media_post.media : correct_media_fname;
          correct_media_fname = (named_poster_tag_in_filename && named_poster_media_download_only) ? String(thread_posts[post_nums[i]].name+"_-_"+correct_media_fname) : correct_media_fname;


          //console.log(working_media_link); //debug
          //console.log(correct_media_fname); //debug

          media_arr.push(working_media_link)
          media_fnames.push(correct_media_fname);

        }
      }
    }

    // Adds the media link array with the media filenames array into the final return
    return_value[0] = media_arr;
    return_value[1] = media_fnames;

    /*
    var count;

    function download_with_scope(){
      GM_download(media_arr[count], media_fnames[count]) // downloads images
    }
    */

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

    async function download_images(){

      for (var i=0; i<media_arr.length; i++){
        //console.log(media_fnames[i] + " "+ media_arr[i]); //debug
        //console.log(download_limit); //debug

        await sleep(download_limit);

        GM_download(media_arr[i], media_fnames[i]) // downloads images

      }
    }

    download_images();


    if(confirm_download){
      displayButton(indiv_dlbtn_elem);
      setTimeout(displayButton(indiv_dlbtn_elem), 3000);
    }

  }

  // Gets the JSON file for the thread with the API
  async function get_archive_thread() {
    const API_response = await fetch(api_url);
    const JSON_file = await API_response.json();
    console.log(JSON_file); // debug
    retrieve_media(JSON_file);
  }

    // Controls what the individual download button does upon being clicked
  function indivDownload(){
    displayButton(indiv_dlbtn_elem);

    // Wait for user to confirm zip if didn't click fast enough for double-click
    setTimeout(function(){
      if (window.getComputedStyle(indiv_dl_btn).backgroundColor == 'rgb(255, 64, 64)'){
        indiv_dl_btn.removeEventListener("click", displayButton);
        indiv_dl_btn.addEventListener("click", get_archive_thread);

        // If user does not confirm, reset the button back to original
        setTimeout(function(){
          indiv_dl_btn.removeEventListener("click", get_archive_thread);
          indiv_dl_btn.addEventListener("click", displayButton);
          Object.assign(indiv_dlbtn_elem.style, indivOrigStyles);
          indiv_dl_btn.innerText = "Indiv DL";
        }, 5000);

      }
    }, 501);

  }

  GM_registerMenuCommand("Download all thread images individually", get_archive_thread);


  // Download thread button event listener(s)
  if(confirm_download){
    indiv_dlbtn_elem.addEventListener("click", indivDownload);
    indiv_dlbtn_elem.addEventListener("dblclick", get_archive_thread);
  }
  else{
    indiv_dlbtn_elem.addEventListener("click", get_archive_thread);
  }

})();