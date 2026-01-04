// ==UserScript==
// @name        Frenschan Thread Image Downloader
// @namespace   Violentmonkey Scripts
// @match       https://*.frenschan.com/*/res/*.html
// @match       https://*.frenschan.org/*/res/*.html
// @grant       GM_download
// @grant       GM_registerMenuCommand
// @version     1.2.1
// @license     The Unlicense
// @author      ImpatientImport
// @description Downloads all images individually in a frenschan thread with original filenames (by default).
// @downloadURL https://update.greasyfork.org/scripts/443435/Frenschan%20Thread%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/443435/Frenschan%20Thread%20Image%20Downloader.meta.js
// ==/UserScript==


/* EDIT BELOW THIS LINE */

// User preferences

var download_limit = 3000; // speed in milliseconds to delay

/* EDIT ABOVE THIS LINE */


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {
  'use strict';
  
  // Constants for later reference
  const top_of_thread = document.getElementsByClassName("intro")[0];
  const thread_URL = document.URL;
  const tinyboard_site = thread_URL.toString().split('/')[2];
  const url_path = new URL(thread_URL).pathname;
  const url_path_split = url_path.toString().split('/')
  const thread_board = url_path_split[1];
  const thread_num = url_path_split[3].split(".")[0];
  
  const json_url = "https://"+ tinyboard_site + "/"+ thread_board +"/res/"+ thread_num + ".json"; // important
  
  var media_arr=[], media_fnames=[];
  
  // Gets the JSON file for the Tinyboard thread
  async function get_archive_thread() {
    const site_response = await fetch(json_url);
    const JSON_file = await site_response.json();
    console.log(JSON_file); // debug
    retrieve_media(JSON_file);
    download_images();
  }
  
  // Retrieves media from the thread (in JSON format)
  function retrieve_media(thread_obj) {
    
    const posts_exist = thread_obj.posts != undefined;

    if (posts_exist) {
      const thread_posts = thread_obj.posts;
      //const post_nums = Object.keys(thread_posts);
      const posts_length = thread_posts.length;
      
      for (let i = 0; i < posts_length; i++) {
        
          if(thread_posts[i].tim != null && thread_posts[i].ext != "deleted"){
            media_arr.push("https://" + tinyboard_site + "/" + thread_board + "/src/" + thread_posts[i].tim + thread_posts[i].ext );
            media_fnames.push(thread_posts[i].filename + thread_posts[i].ext);
            
            //in case of more than one image in post
            var extra = thread_posts[i].extra_files
            if(extra != null){
              
              for (let j=0; j < extra.length; j++){
                media_arr.push("https://" + tinyboard_site + "/" + thread_board + "/src/" + extra[j].tim + extra[j].ext );
                media_fnames.push(extra[j].filename + extra[j].ext);
              }
              
            }
            
            
          }
        
      }
      
    }
    
  }
    
  async function download_images(){

    for (var i=0; i<media_arr.length; i++){

      await sleep(download_limit);
      
      console.log(media_arr[i]);

      GM_download(media_arr[i], media_fnames[i]) // downloads images
      
    }
  }
  
  GM_registerMenuCommand("Download all thread images individually", get_archive_thread);
  
  var indiv_dl_btn;
  var indiv_dlbtn_elem;
  indiv_dl_btn = document.createElement('a');
  indiv_dl_btn.id = "indiv_btn";
  indiv_dl_btn.innerText = "[Download Images]";
  top_of_thread.append(indiv_dl_btn);
  indiv_dlbtn_elem = document.getElementById("indiv_btn");
  indiv_dl_btn.addEventListener("click", get_archive_thread);
  
})();