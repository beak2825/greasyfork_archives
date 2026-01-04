// ==UserScript==
// @name         Get Booru Tags (Edited)
// @namespace    https://github.com/onusai/
// @version      0.12
// @description  Press the [`] tilde key under ESC to open a prompt with all tags
// @author       Onusai#6441/ScriptAnon
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @match        https://danbooru.donmai.us/posts/*
// @match        https://e621.net/posts/*
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @match        https://rule34.paheal.net/post/view/*
// @match        https://furry.booru.org/index.php?page=post&s=view&id=*
// @match        https://e926.net/posts/*
// @match        https://booru.allthefallen.moe/posts/*
// @match        https://tbib.org/index.php?page=post&s=view&id=*
// @match        https://aibooru.online/posts/*
// @match        https://lolibooru.moe/post/show/*
// @match        https://infinibooru.moe/post/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453304/Get%20Booru%20Tags%20%28Edited%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453304/Get%20Booru%20Tags%20%28Edited%29.meta.js
// ==/UserScript==

(function () {
   'use strict';


   let hot_key = "`"; // edit to change hotkey
   let remove_commas = false; // set to false to include commas
   let remove_underscores = true; // set to false to include underscore
   let remove_parentheses = true; // set to false to include parentheses


   $(document).on('keydown', (event) => {
      if (event.key == hot_key) {
         let tags = null;
         if (window.location.href.includes("/gelbooru.com")) tags = get_gel_tags();
         else if (window.location.href.includes("/danbooru.donmai.us")) tags = get_dan_tags();
         else if (window.location.href.includes("/e621.net")) tags = get_e621_tags();
         else if (window.location.href.includes("/rule34.xxx")) tags = get_rule34xxx_tags();
         else if (window.location.href.includes("/rule34.paheal.net")) tags = get_rule34paheal_tags();
         else if (window.location.href.includes("/furry.booru.org")) tags = get_furrybooru_tags();
         else if (window.location.href.includes("/e926.net")) tags = get_e926_tags();
         else if (window.location.href.includes("/booru.allthefallen.moe")) tags = get_dan_tags();
         else if (window.location.href.includes("/tbib.org")) tags = get_furrybooru_tags();
         else if (window.location.href.includes("/aibooru.online")) tags = get_dan_tags();
         else if (window.location.href.includes("/lolibooru.moe")) tags = get_rule34xxx_tags();
         else if (window.location.href.includes("/infinibooru.moe")) tags = get_infinibooru_tags();

         if (tags != null) {
            for (var i = 0; i < tags.length; i++) {
               if (remove_underscores) tags[i] = tags[i].replace("_", " ");
               else tags[i] = tags[i].replace(" ", "_");
            }
            let fprompt = tags.join(", ");
            if (remove_commas) fprompt = fprompt.replaceAll(",", "");
            if (remove_parentheses) fprompt = fprompt.replaceAll("(", "").replaceAll(")", "")
            prompt("Prompt: " + tags.length + " tags\nTo check token length go to: https://beta.openai.com/tokenizer", fprompt);
         }
      }
   })

   function get_gel_tags() {
      let elms = ["tag-type-general", "tag-type-character", "tag-type-metadata", "tag-type-artist", "tag-type-copyright"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            iprompt.push(e.children[1].textContent);
         })
      });
      return iprompt;
   }

   function get_dan_tags() {
      let elms = ["general-tag-list", "character-tag-list", "meta-tag-list", "artist-tag-list", "copyright-tag-list"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            if (e.tagName == "UL") {
               Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                  iprompt.push(s.textContent);
               })
            }
         })
      });
      return iprompt;
   }

   function get_e621_tags() {
      let elms = ["artist-tag-list", "species-tag-list", "general-tag-list", "artist-tag-list"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            if (e.tagName == "UL") {
               Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                  iprompt.push(s.textContent);
               })
            }
         })
      });
      return iprompt;
   }

   function get_rule34paheal_tags() {
      let elms = ["tag_name_cell"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            Array.from(e.getElementsByClassName("tag_name")).forEach(s => {
               iprompt.push(s.innerHTML);
            })
         })
      });
      return iprompt;
   }

   function get_rule34xxx_tags() {
      let elm = document.getElementById("tag-sidebar");
      let pattern = /(^\d)|(\s)|([[A-Za-z])/g;
      let iprompt = [];

      let children = elm.children;
      Array.from(children).forEach(li => {
         var tag = li.innerText.replace("?", "").trim();
         var tagarray = tag.match(pattern).toString().replaceAll(",", "").trim();
         iprompt.push(tagarray);
         iprompt = iprompt.filter(item => item !== "Copyright");
         iprompt = iprompt.filter(item => item !== "Artist");
         iprompt = iprompt.filter(item => item !== "General");
         iprompt = iprompt.filter(item => item !== "Character");
      });
      return iprompt;
   }

   function get_furrybooru_tags() {
      let elms = ["tag-type-general", "tag-type-character", "tag-type-metadata", "tag-type-artist", "tag-type-copyright"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            iprompt.push(e.children[0].textContent);
         })
      });
      return iprompt;
   }

   function get_e926_tags() {
      let elms = ["artist-tag-list", "species-tag-list", "general-tag-list", "artist-tag-list"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            if (e.tagName == "UL") {
               Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                  iprompt.push(s.textContent);
               })
            }
         })
      });
      return iprompt;
   }

   function get_infinibooru_tags() {
      let elm = document.getElementsByClassName("compact-tags");
      let textcontent = elm[0].textContent;
      let iprompt = [];
      let tagarray = textcontent.split(' ');
      tagarray.forEach(e => {
         iprompt.push(e.replace("_", " ").replace("_", " ").replace("_", " "));
      })
      return iprompt;
   }

})();