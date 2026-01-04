// ==UserScript==
// @name         Codemao CSS Beautify
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      Apache Software License
// @description  对编程猫社区的css进行美化!
// @author       ReducedRadius(flytothehighest)
// @match        https://shequ.codemao.cn/*
// @icon         https://www.google.cn/s2/favicons?sz=64&domain=codemao.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473295/Codemao%20CSS%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/473295/Codemao%20CSS%20Beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
     (function(){
    var style = document.createElement("style");
    style.innerHTML = `
    @keyframes load{
      0%{
        filter:blur(3px) brightness(1.2)
      }

      100%{
       filter:blur(0px) brightness(1)
      }
    }
    .r-discover-c-workcard--work_item:hover,.r-home-c-work_card--work_card:hover,.r-home-c-community_star--user_recommend_item:hover{
        transform:scale(1.05)
    }
    .r-work_shop--img{
        border-radius:2px;
    }
    img,image,.r-community-r-detail--user_head,.c-navigator--avatar,.c-avatar_border--avatar_border,.r-work_shop-r-details--preview,.c-work_card--work_img,.r-discover-c-workcard--work_img{
      border-radius:7px;
      animation-name:load;
      animation-play-state:running;
      animation-duration:.8s
    }
    input[type="radio"]{
      accent-color:lightblue;
    }
    input{
      border-radius:1.8px
    }
    textarea,input{
        caret-color:var(--main-color)
    }
    *::selection{
        background-color:var(--main-color);
        color:white
    }

    a:hover{
      transition: all .4s !important
    }
    .c-comment-c-comment_item--author_link{
      color:var(--highlight-color) !important
    }
    .c-navigator--dropdown-wrap{
       background-color:var(--main-color) !important;
    }
    .c-navigator--dropdown-wrap > li > a,.c-navigator--dropdown-wrap > li > span{
       color:white !important;
    }
    .c-navigator--cont > a > *{
       color:white !important;
    }
    .c-navigator--cont > a > *:hover{
     color:black
    }
    .c-navigator--cont{
      background-color:var(--main-color) !important
    }
     .c-navigator--item:hover{
       background-color:var(--second-color) !important;
    }
    .c-navigator--dropdown-wrap > li >a:hover{
      background-color:var(--second-color) !important;
    }
    .c-navigator--navigator{
      opacity:.9 !important;
      backdrop-filter:blur(38px) brightness(2)
    }
    `
   document.head.appendChild(style);
    
})()
    // Your code here...
})();