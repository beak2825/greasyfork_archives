// ==UserScript==
// @name         Danbooru Tags Select to Export (EDITED)
// @version      0.2.12   
// @description  Select specified tags and copy to clipboard, for Stable Diffusion WebUI or NovelAI to use.
// @author       FSpark/ScriptAnon
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
// @grant        GM_setClipboard
// @grant        GM_notification
// @license AGPL-3.0/MIT
// @namespace https://greasyfork.org/users/972837
// @downloadURL https://update.greasyfork.org/scripts/453380/Danbooru%20Tags%20Select%20to%20Export%20%28EDITED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453380/Danbooru%20Tags%20Select%20to%20Export%20%28EDITED%29.meta.js
// ==/UserScript==

(function () {
   'use strict';

    let Container = document.createElement('div');
    Container.id = "tags-exporter-container";
    Container.innerHTML =`<button  id="select_all">Select All</button>
<button  id="select_none">Select None</button>
<button  id="invert_select">Invert Select</button>
<button  id="export">Export</button>
`;

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

   let hot_key = "`"; // edit to change hotkey
   let remove_commas = false; // set to false to include commas
   let remove_underscores = true; // set to false to include underscore
   let remove_parentheses = true; // set to false to include parentheses

if (window.location.href.includes("/danbooru.donmai.us") || window.location.href.includes("/aibooru.online") || window.location.href.includes("/booru.allthefallen.moe"))
{
    get_dan_tags();
}

if (window.location.href.includes("/gelbooru.com"))
{
    get_gel_tags();
}

if (window.location.href.includes("/e621.net"))
{
    get_e621_tags();
}

if (window.location.href.includes("/e926.net"))
{
    get_e926_tags();
}

if (window.location.href.includes("/rule34.paheal.net"))
{
    get_rule34paheal_tags();
}

if (window.location.href.includes("/rule34.xxx")||(window.location.href.includes("/lolibooru.moe")))
{
    get_rule34xxx_tags();
};

if (window.location.href.includes("/furry.booru.org")||(window.location.href.includes("/tbib.org")))
{
get_furrybooru_tags();
}
   function get_gel_tags() {
       insertAfter( Container, document.querySelector("#container > section"));
      let elms = ["tag-type-general", "tag-type-character", "tag-type-metadata", "tag-type-artist", "tag-type-copyright"];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
                   let chk = document.createElement('input');
                   chk.type="checkbox";
                   chk.name="general-tags";
                   chk.value=e.children[1].textContent.replaceAll("_"," ");
                   e.insertBefore(chk,e.children[0]);
         })
      });
   }

   function get_dan_tags() {
       insertAfter( Container, document.querySelector("#tag-list"));
      let elms = ["general-tag-list", "character-tag-list", "meta-tag-list", "artist-tag-list", "copyright-tag-list"];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            if (e.tagName == "UL") {
               Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                   let chk = document.createElement('input');
                   chk.type="checkbox";
                   chk.name="general-tags";
                   console.log(s.parentNode);
                   console.log(s.parentNode.dataset);
                   chk.value=s.parentNode.dataset.tagName.replaceAll("_"," ");
                   s.parentNode.insertBefore(chk,s.parentNode.firstChild);
               })
            }
         })
      });
   }

   function get_e621_tags() {
       insertAfter( Container, document.querySelector("#tag-list"));
      let elms = ["artist-tag-list", "species-tag-list", "general-tag-list"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            if (e.tagName == "UL") {
               Array.from(e.getElementsByClassName("search-tag")).forEach(s => {

                   let chk = document.createElement('input');
                   chk.type="checkbox";
                   chk.name="general-tags";
                   chk.value=s.textContent.replaceAll("_"," ");
                   s.parentNode.insertBefore(chk,s.parentNode.firstChild);
               })
            }
         })
      });
   }

   function get_e926_tags() {
       insertAfter( Container, document.querySelector("#tag-list"));
      let elms = ["artist-tag-list", "copyright-tag-list", "character-tag-list", "species-tag-list", "general-tag-list","lore-tag-list"];
      let iprompt = [];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            if (e.tagName == "UL") {
               Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                   let chk = document.createElement('input');
                   chk.type="checkbox";
                   chk.name="general-tags";
                   chk.value=s.textContent.replaceAll("_"," ");
                   s.parentNode.insertBefore(chk,s.parentNode.firstChild);
               })
            }
         })
      });
   }

   function get_rule34paheal_tags() {
       insertAfter( Container, document.querySelector("#Post_Controlsleft > h3"));
      let elms = ["tag_name_cell"];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
            Array.from(e.getElementsByClassName("tag_name")).forEach(s => {
                let elm = s.parentNode.parentNode.firstChild;
                   let chk = document.createElement('input');
                   chk.type="checkbox";
                   chk.name="general-tags";
                   chk.value=s.textContent.replaceAll("_"," ");
                   s.parentNode.parentNode.insertBefore(chk,elm);
            })
         })
      });
   }

   function get_furrybooru_tags() {
       insertAfter( Container, document.querySelector("#tag-sidebar"));
      let elms = ["tag-type-general", "tag-type-character", "tag-type-metadata", "tag-type-artist", "tag-type-copyright"];
      elms.forEach(tag => {
         Array.from(document.getElementsByClassName(tag)).forEach(e => {
             //console.log(e);
             let chk = document.createElement('input');
             chk.type="checkbox";
             chk.name="general-tags";
             console.log(e.children[0].textContent);
             chk.value=e.children[0].textContent.replaceAll("_"," ");
             e.insertBefore(chk,e.children[0]);
         })
      });
   }
       function get_rule34xxx_tags() {
      let elm = document.getElementById("tag-sidebar");
      let pattern = /(^\d)|(\s)|([[A-Za-z])/g;
      let iprompt = [];
           insertAfter( Container, elm);
      let children = elm.children;
      Array.from(children).forEach(li => {
          console.log(li);

          if (li.innerText == "Character" || li.innerText == "Artist" || li.innerText == "General")
          {
          } else
          {
              var tag = li.innerText.replace("?", "").trim();
              var tagarray = tag.match(pattern).toString().replaceAll(",", "").trim();
              let chk = document.createElement('input');
              chk.type="checkbox";
              chk.name="general-tags";
              chk.value=tagarray.replaceAll("_"," ");
              li.insertBefore(chk,li.firstChild)
          }
      });
   }

            document.getElementById("select_all").onclick=function(){
        var items=document.getElementsByName("general-tags");
        for(var i=0;i<items.length;i++){
            items[i].checked=true;

        }
    };

    document.getElementById("select_none").onclick=function(){
        var items=document.getElementsByName("general-tags");
        for(var i=0;i<items.length;i++){
            items[i].checked=false;

        }
    };

    document.getElementById("invert_select").onclick=function(){
        var items=document.getElementsByName("general-tags");
        for(var i=0;i<items.length;i++){
            items[i].checked==true?items[i].checked=false:items[i].checked=true;

        }
    };

    document.getElementById("export").onclick=function(){
        let tags=[]
        document.querySelectorAll("[name='general-tags']:checked").forEach((e)=>{tags.push(e.value)})
        let res=tags.join(", ")
        GM_setClipboard(res)
        GM_notification(`${tags.length} tag(s) were copied.`,"Danbooru Tags Exporter")
    };

})();