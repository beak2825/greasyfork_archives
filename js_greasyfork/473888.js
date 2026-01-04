// ==UserScript==
// @name         CF darker theme
// @namespace    CFdarkTheme
// @author       sprudra5001
// @version      0.1
// @description  Appends custom CSS rules to a specific CSS file.
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/473888/CF%20darker%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/473888/CF%20darker%20theme.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function basicStyle() {
    GM_addStyle(`
    :root {
      /* Currently sticking with theme02 */
      --bgColor: hsla(206, 70.69%, 4%);
      --bgColorDark: hsl(202, 70%, 14%);
      --roundBoxColor: hsl(204, 65%, 9%);
      --headColor: hsl(208, 44%, 79%);
      --textColorPrim: hsla(32, 87%, 80%, 0.74)  ; /* hsla(32, 90%, 79%, 0.93)  ; */
      /* a white-green alt for text #a0aea4  */
      /* best alt is grey #afafaf */
      --textColorScnd: ;  
      --textColorSecondary: ;
      --greyTextColor: #dfd57c ;
      --anyLinkColor: hsl(279deg 36% 75%) ;
      --linkColor: hsl(212deg 60% 77%) ;
      --borderColor: hsla(208, 41%, 47%, 0%) ;
      --boxColor: hsl(202, 80%, 8%) ;
      --hoverBgColor: #195a55 ;
      --highlightColor: #212152 ;
      --boxTxtColor: ;
    }


    /* 
    :root {
      --bgColor: hsl(205, 65%, 6%) ;
      --bgColorDark: hsl(200, 80%, 17%) ; 
      --boxColor: hsl(202, 80%, 9%) ;

      --borderColor: hsla(208, 41%, 47%, 0%) ;

      --textColorPrim: hsla(37, 90%, 79%, 0.93) hsla(34, 98%, 86%, 0.93);
      --headColor: hsl(210, 45%, 60%) ;
      --anyLinkColor: hsl(250, 60%, 79%) ;

      --hoverBgColor: #195a55 ;

    }

    */


    /* START Here Universal Formatting */

      body:not(.wysiwyg), 
      img{
        opacity: 0.95 ;
      }

      body img {
        opacity: 0.8;
      }

      body,   
      .bottom-links,
      .datatable td:not(.dark),
      .datatable td:not(.dark) div.dark,
      .datatable th,
      .datatable > div, /* the heading Problems on /problemset page */
      #facebox .content
      {
        background: var(--bgColor) ;
        background-color: var(--bgColor) ;
      }


      /* sets bgcolor of all elements with .dark class */
      .dark,
      body .new-comments-box {
        background-color: var(--bgColorDark) !important ;
      }
      
      div.topic .title p,
      div.roundbox.sidebox div.caption.titled,
      div.roundbox.sidebox table tr:nth-child(2) span /* problem page-> FINISHED */
      {
        color: var(--headColor) !important;
      }

      /* for all grey texts directly inside divs */
      div {
        color: khaki;
      }

      .roundbox * ,
      div.topic .ttypography *,
      div.ttypography *,
      div.topic .info,
      div.topic div:nth-child(n + 4),
      .bottom-links,
        .datatable td:not(.dark),
        .datatable td:not(.dark) div.dark,
        .datatable th,
        .datatable > div, /* the heading Problems on /problemset page */
        #facebox .content{
        color: var(--textColorPrim);
      }

      .main-info div {
        color: var(--textColorPrim) !important ;
      } 

      /* for higher font-weight */
      .problem-statement .title,
      div.topic .info {
        font-weight: 600;
      }

    /* STOPS Here Universal Formatting */





    /* START Here Link Stuff */
      a:visited {
        /* color: hsl(270, 70%, 65%); */
        color: var(--anyLinkColor) ;
        /* try this: hsl(279, 56%, 73%) */
        color:#e086db ;
        color:#ba6cffe3 ;
        /* color:hsla(320, 67%, 67.5%) ; */
      }

      a:link {
        text-decoration-thickness: 0.15rem;
        text-underline-offset: 0.15rem;
        /* color: hsl(217deg 74% 67%) ; */
        color: var(--linkColor) ;
        /* try this: hsl(212.5, 65.9%, 74%) */
        color:#beb6f2 ;
        color:#d984b9 ;
        color:#9e91f3 ;   /*changed here*/
        /* color:hsl(273.5, 80%, 76%) ; */

      }

      /* links inside blogs */
      div.topic div.ttypography a {
        color: #4D87C7 ;
        color: #62b4b7 ;
      }  

    /* STOPS Here Link Stuff */





    /* START Here Roundbox Stuff */

    div.roundbox-lb,
    div.roundbox-lt,
    div.roundbox-rb,
    div.roundbox-rt{
      height : 0px ;
      width : 0px ;
    }

        /* introducing gap in sidebar  */
    body #sidebar {
      margin-right: 0.25em;
    }

    body #sidebar .roundbox {
      margin-bottom: 2em ;
    }

    body .roundbox {
      border: 2px solid hsl(204, 75%, 7%);
      position: relative ;
      border-radius: 1.5rem ;
      background-color: var(--roundBoxColor) ;


      /* changing opacity first shadow adds a black line */
      
      box-shadow: -4px -4px 15px -8px hsl(204, 55%, 4%), 
                  3px 6px 10px 4px black,
                  0px 8px 12px rgb(0 0 0 / 79%);
    }

    body .roundbox .bottom-links {
      border-radius: 0px 0px 6px 6px ;
      font-family: arial;
      font-size: 1.1rem;
      border-top: 2px solid #0f506f;
      background-color: var(--boxColor);
      padding: .45em ;
    }


    body .roundbox .titled {
      padding-top: 0.3em ;
      border-bottom: 1px solid var(--borderColor) ;
    }



    body .roundbox .rtable td,
    body .roundbox .rtable th {
      border: 1px solid var(--borderColor) ;
      border-right: none;
      border-top: none;
      padding: 4px;
      text-align: center;
      font-size: .9em
    }

    /* STOPS Here Roundbox Stuff */



    /* START Here Green color */
    .left-meta ul :nth-child(2) span,
    span[data-commentrating]:not([data-commentrating ^= "-"]):not([data-commentrating ^= "0"]) .commentRating span
    {
      /* outline: 2px red solid ; */
      color: #00ff00e0 !important ;
      color: #adff2fde !important ;
    }


    div.topic .meta .left-meta ul li img {
      opacity: 0.75 ;
    }

    div .vote-for-comment img {
      opacity: 0.5 !important ; 
    }

    /* enhance recent-actions-sidebox readability */
    body .roundbox.sidebox a[class ^= "rated"]{
      font-size: 1.1em !important;
    }



    /* STOPS Here Green color */








    /* ---------------------------------------------------- */
    /* Newer changes */

    /* added font color for the top bar at landing page */
    div .menu-box li *{
      font-weight: 800 ;
      color: var(--textColorPrim) ;
    }


    /* increased the font wweigght of recent actions table links */
    /* enhances visibility of links */
    div .roundbox:not(.menu-box) .recent-actions a:link:not( .rated-user){
      /* outline: 2px red solid ; */
      font-weight: 600;
    }
    /* alternative to above  */

    /* div .roundbox .recent-actions a:link:not( .rated-user) {
      outline: 2px red solid ;
      font-weight: 600 ;
    } */

    div.alert.alert-warning {
      border-color: #000000 ;
      background-color: #093d2fa6;
      color: #dabd71 ;
    }

    `);
  }

  let boxStyle = `
    .topic .content {
      border-left: 4px dashed #054b78e0 ;
    }
  `
  
  let communityTheme = `
    .rated-user.user-black {
      font-weight: regular !important;
    }

    .rated-user.user-gray {
      color: lightslategrey !important;
    }

    .rated-user.user-green {
      color: hsla(141,85%,44%,0.91) !important ;
    }

    .rated-user.user-cyan {
      color: darkturquoise !important ;
    }

    .rated-user.user-blue {
      color: #2596fd !important ;
    }

    .rated-user.user-violet {
      color: #e75ce2 !important ;
    }

    .rated-user.user-orange {
      color: hsl(32, 93%, 47%) !important;
    }

    .rated-user.user-legendary::first-letter {
      color: #ffffffd9 !important;
    }

    .rated-user.user-admin {
      color: #ffffffd9 !important ;
      font-weight: bold !important;
    }

    .rated-user.user-admin::first-letter{
      color: #fb2727 !important;
      font-weight: bolder !important;
        
    }

    .rated-user.user-red {
      color: #fb2727 !important
    }

    .rated-user.user-legendary {
      color: #fb2727 !important
    }

  `

  function addStyles () {
    GM_addStyle(boxStyle) ;
    GM_addStyle(communityTheme) ;
  }


  function basicScript() {
  // https://stackoverflow.com/a/47406751

  
    /* --- blog posts author textColor -> white --- */

    const myElement = document.querySelector('#pageContent > div > div h3 > a');
    // console.log(myElement);
    if ( myElement ){
      myElement.style.color = 'ghostwhite';
    }



    /* --- change bgColor if it's' #EAF4FF --- */

    const nodeList = document.querySelectorAll('#header .lang-chooser > div');
    //  console.log(nodeList.length) ;
    nodeList.forEach(node => {
      //  console.log(node) ;
      const backgroundColor = window.getComputedStyle(node).backgroundColor;
      if (backgroundColor === 'rgb(234, 244, 255)') {
        //  console.log("found one");
          // Replace the background color
          node.style.backgroundColor = '#093d2fa6'; // Replace with your desired replacement color
          node.style.color = '#dabd71' ;
          node.style.padding = '0.75em 0.75em';
          node.style.marginTop = '0.6em';
          node.style.marginBottom = '0.6em';
          node.style.textShadow = '0 1px 0 rgb(255 255 255 / 60%)';
          node.style.borderRadius = '4px';

          //  change font-weight of links
          const regularLink = document.querySelector('#header .lang-chooser > div:nth-child(3) a') ;
          if (regularLink){
            regularLink.style.fontWeight = '500' ;
          }
        }
    });

  }
  
  function check(changes, observer) { 
      if(document.querySelector('div')) {
          observer.disconnect();
          // actions to perform after #mySelector is found
          basicStyle() ;
          addStyles() ;

          document.addEventListener('DOMContentLoaded', function() {
            basicScript() ;
        });
      
      }
  }
  (new MutationObserver(check)).observe(document, {childList: true, attributes: true, characterData: true, subtree: true});

  


})() ;
