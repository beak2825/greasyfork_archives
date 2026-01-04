// ==UserScript==
// @name         Old VK design
// @namespace    only for real men
// @version      1.3.3
// @description  [DEPRECATED] Returns old VK design for PC after 9 october 2020 update.
// @author       lenchik-lox
// @include      *://vk.com/*
// @include      *://vkontakte.ru/*
// @include      *://vk.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418689/Old%20VK%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/418689/Old%20VK%20design.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.once) {
        return;
    }

    var gobno = document.querySelector('body.new_header_design').className, i=0;
    document.querySelector('body.new_header_design').className = gobno.replace("new_header_design","");
    var timer = setInterval(function(){
        try{
          document.querySelector('body.new_header_design').className = gobno.replace("new_header_design","");
        }catch(e){}
        try{
          document.querySelector('head > link[href="https://st3-13.vk.com/css/al/common.33b8fc60ebb70a678c51.css"]')?.remove();
          document.querySelectorAll('.top_audio_player_btn')?.forEach((el)=>{el.children[0].style.color = "var(--light_blue_100)"});
          document.querySelector('.TopHomeLink>svg>path[fill="#2787F5"]')?.remove();
          if (document.querySelector('#oldVk')) {
            return;
          }
          var st = document.createElement('style');
          st.id = "oldVk";
          st.innerText = `
          #ts_input::placeholder {
              color: var(--light_blue_100) !important;
          }
          #ts_input {
            color:var(--light_blue_100) !important;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIuOTIiPjxwYXRoIG9wYWNpdHk9Ii4xIiBkPSJNMCAwSDE2VjE2SDB6Ii8+PHBhdGggZD0iTTYuNSAxYTUuNSA1LjUgMCAwIDEgNC4zODMgOC44MjNsMy44OTYgMy45YS43NS43NSAwIDAgMS0xLjA2MSAxLjA2bC0zLjg5NS0zLjlBNS41IDUuNSAwIDEgMSA2LjUgMXptMCAxLjVhNCA0IDAgMSAwIDAgOCA0IDQgMCAwIDAgMC04eiIgZmlsbD0iIzgxOGM5OSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg==");
            background-color: var(--blue_600) !important;
          }
          .TopNavBtn__profileName {
            color:var(--white) !important;
          }
          .TopHomeLink>svg {
             width:48px !important;
            height:48px !important;
          }
          .#top_profile_link > div.TopNavBtn__profileName {
            color:var(--light_blue_100) !important;
          }
          .top_audio_player_title {
            color:var(--light_blue_100) !important;
          }
          .top_audio_player_btn {
            color:var(--light_blue_100) !important;
          }
          .TopNavBtn .TopNavBtn__icon {
            color:var(--text_link) !important;
          }

          `;
          document.head.append(st);
      }catch(e){console.error(e);}
    },3000);
    window.once = true;
})();