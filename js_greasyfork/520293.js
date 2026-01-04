// ==UserScript==
// @name Thisvid CSS STYLING
// @namespace thisvid.com-css
// @version 2.3
// @description CSS STYLES
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/520293/Thisvid%20CSS%20STYLING.user.js
// @updateURL https://update.greasyfork.org/scripts/520293/Thisvid%20CSS%20STYLING.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `



@document url-prefix("https://thisvid.com/") {

    .main > .container {
        max-width: unset !important;
    }

    .sidebarInactive {
        color: unset !important;
    }

    .sidebar {
        border-left: 2px solid #0ef0e5;
        background: #16181B;
        padding: 10px;
        z-index: 100;
    }

    .drawerRight {
        right: -18% !important;
        transition: ease-in-out .6s all;
        border-left: 2px solid #0ef0e5;
    }

    .sidebarBtn {
        padding: 5px 0px;
        margin: 30px 6px 0 8px;
        box-sizing: border-box;
        height: 29px;
        background: #2f2f2f;
        font-size: 12px;
        color: #acacac;
        border: none;
        border-radius: 4px;
        display: inline-block;
        cursor: pointer;
        position: absolute;
        outline: 0 none;
        text-align: center;
        vertical-align: top;
        text-decoration: none;
        font-weight: 700;
        width: 30px;
        float: right;

    }

    .sidebarBtn:hover {
        background: #3f3f3f;
    }

    .sidebarBtn > .material-icons {
        color: #0ef0e5;
    }


    .content {
        padding-right: unset !important;
        margin-right: -260px !important;
    }

    /*.header-bottom > .container {
        display: inline-block !important;
        min-width: 1300px !important;
    }*/

    #list_videos_common_videos_list > .headline {
    padding: 0 10px;
    }


    .thumbs-items {
        text-align: left;
        width: 100%;
        margin: 0 auto;
    }



    .thumbs-items a {
        margin: 4px;
        width: 47%;
        position: relative;
        background: #262626;
        border-bottom: 3px solid;
        display: inline-block;
    }


    .tabset > a:nth-child(1),
    .tab-content > #tab1 {
        display: none !important;
    }

    .tab-content > #tab2 {
        display: block !important;
    }





    footer {
        display: none !important;
    }




    .blockBtn {
        position: absolute;
        top: 31px;
        right: 5px;
        z-index: 1;
        opacity: .6;
        transition: .3s all ease;
    }
    .blockBtn:hover {
        opacity: 1.0;
        transition: .3s all ease;
    }





    .tumbpu {
        transition: 1s ease all;
        background: #262626;
        border-bottom: 3px solid;
    }

    .tumbpu .title {
        background: #262626;
        /*border-bottom: 3px solid;*/
    }


    /*.tumbpu:hover {*/
    /*    transform:scale(2);*/
    /*  z-index: 30;*/
        
    /*  transition: 1s ease all;*/
    /*}*/

    .enlarge {
        transform:scale(2);
        z-index: 30;
        
        position: relative;
        height: 154px;
    }

    .pushright {
      left: 150px !important;
    }

    .pushleft {
      right: 150px !important;
      z-index: 100000 !important;
    }

    .thumbs-items a:hover img {
        opacity: 1.0 !important;
    }


    .tumbpu .percent,
    .tumbpu .likes,
    .tumbpu .info {
        display: none !important;
    }







    .duration {
        font-weight: 700;
    }


    .underOne .duration {
        color: #904340 !important;
    }
    .superShort .duration {
        color: #f2923a !important;
    }
    .short .duration {
        color: #f2c65f !important;
    }
    .decent .duration {
        color: #b9d577 !important;
    }
    .long .duration {
        color: #62b7c7 !important;
    }


    .underOne {
        border-bottom-color: #904340 !important;
    }
    .superShort {
        border-bottom-color: #f2923a !important;
    }
    .short {
        border-bottom-color: #f2c65f !important;
    }
    .decent {
        border-bottom-color: #b9d577 !important;
    }
    .long {
        border-bottom-color: #62b7c7 !important;
    }



    .underOne .title {
        border-bottom-color: #904340 !important;
    }
    .superShort .title {
        border-bottom-color: #f2923a !important;
    }
    .short .title {
        border-bottom-color: #f2c65f !important;
    }
    .decent .title {
        border-bottom-color: #b9d577 !important;
    }
    .long .title {
        border-bottom-color: #62b7c7 !important;
    }




    .cursorRest {
        width: 25px;
        height: calc(100vh - 20px);
        position: fixed;
        top: 20px;
        background: #fff;
        opacity: .25;
        z-index: 12;
    }
    .cursorRest.left {
        left: 0;
    }
    .cursorRest.right {
        right: 0;
    }

    .privateHide {
        display: none !important;
    }



    #list_videos_common_videos_list > .container {
        display: none !important;
    }


    .pagination {
        margin: 0px 0px 120px !important;
    }



    .welcome {
        display: none;
    }

     .icons {
        display: inline-block;
        font-size: 4px;
        height: 20px;
        width: 20px;
    }

    .ico_bar {
        height: 2px;
    }

    .mobile-btn {
        padding: 6px 7px 5px 7px;
        /*margin-left: 10px;*/
        max-height: 30px;
    }

    .logo {
        display: none !important;
    }

    .header-top .container::before {

    }

    .header-top {
        /*padding-left: 8px;*/
    }

    .header-top,
    .header-bottom {
        display: inline-block;
    }

    .header .container {
        display: inline-block;
    }

    .nav-header {
        float: right !important;
        display: block;
        width: 100%;
        max-width: 333px;
    }

    .search-form {
        float: left !important;
    }


    video {
        z-index: 100;
    }

    .main-nav.open {
        width: auto !important;
        left: -90px !important;
        right: -10px !important;
        box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.4) !important;
        border: thin solid rgb(79, 79, 79) !important;
    }










    /* fallback */
    @font-face {
      font-family: 'Material Icons';
      font-style: normal;
      font-weight: 400;
      src: url("//fonts.gstatic.com/s/materialicons/v30/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2") format('woff2');
    }

    .material-icons {
          font-family: 'Material Icons';
          font-weight: normal;
          font-style: normal;
          font-size: 20px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }


}`;
if (location.href.startsWith("https://thisvid.com/")) {
  css += `

      .main > .container {
          max-width: unset !important;
      }

      .sidebarInactive {
          color: unset !important;
      }

      .sidebar {
          border-left: 2px solid #0ef0e5;
          background: #16181B;
          padding: 10px;
          z-index: 100;
      }

      .drawerRight {
          right: -18% !important;
          transition: ease-in-out .6s all;
          border-left: 2px solid #0ef0e5;
      }

      .sidebarBtn {
          padding: 5px 0px;
          margin: 30px 6px 0 8px;
          box-sizing: border-box;
          height: 29px;
          background: #2f2f2f;
          font-size: 12px;
          color: #acacac;
          border: none;
          border-radius: 4px;
          display: inline-block;
          cursor: pointer;
          position: absolute;
          outline: 0 none;
          text-align: center;
          vertical-align: top;
          text-decoration: none;
          font-weight: 700;
          width: 30px;
          float: right;

      }

      .sidebarBtn:hover {
          background: #3f3f3f;
      }

      .sidebarBtn > .material-icons {
          color: #0ef0e5;
      }


      .content {
          padding-right: unset !important;
          margin-right: -260px !important;
      }

      /*.header-bottom > .container {
          display: inline-block !important;
          min-width: 1300px !important;
      }*/

      #list_videos_common_videos_list > .headline {
      padding: 0 10px;
      }


      .thumbs-items {
          text-align: left;
          width: 100%;
          margin: 0 auto;
      }



      .thumbs-items a {
          margin: 4px;
          width: 47%;
          position: relative;
          background: #262626;
          border-bottom: 3px solid;
          display: inline-block;
      }


      .tabset > a:nth-child(1),
      .tab-content > #tab1 {
          display: none !important;
      }

      .tab-content > #tab2 {
          display: block !important;
      }





      footer {
          display: none !important;
      }




      .blockBtn {
          position: absolute;
          top: 31px;
          right: 5px;
          z-index: 1;
          opacity: .6;
          transition: .3s all ease;
      }
      .blockBtn:hover {
          opacity: 1.0;
          transition: .3s all ease;
      }





      .tumbpu {
          transition: 1s ease all;
          background: #262626;
          border-bottom: 3px solid;
      }

      .tumbpu .title {
          background: #262626;
          /*border-bottom: 3px solid;*/
      }


      /*.tumbpu:hover {*/
      /*    transform:scale(2);*/
      /*  z-index: 30;*/
          
      /*  transition: 1s ease all;*/
      /*}*/

      .enlarge {
          transform:scale(2);
          z-index: 30;
          
          position: relative;
          height: 154px;
      }

      .pushright {
        left: 150px !important;
      }

      .pushleft {
        right: 150px !important;
        z-index: 100000 !important;
      }

      .thumbs-items a:hover img {
          opacity: 1.0 !important;
      }


      .tumbpu .percent,
      .tumbpu .likes,
      .tumbpu .info {
          display: none !important;
      }







      .duration {
          font-weight: 700;
      }


      .underOne .duration {
          color: #904340 !important;
      }
      .superShort .duration {
          color: #f2923a !important;
      }
      .short .duration {
          color: #f2c65f !important;
      }
      .decent .duration {
          color: #b9d577 !important;
      }
      .long .duration {
          color: #62b7c7 !important;
      }


      .underOne {
          border-bottom-color: #904340 !important;
      }
      .superShort {
          border-bottom-color: #f2923a !important;
      }
      .short {
          border-bottom-color: #f2c65f !important;
      }
      .decent {
          border-bottom-color: #b9d577 !important;
      }
      .long {
          border-bottom-color: #62b7c7 !important;
      }



      .underOne .title {
          border-bottom-color: #904340 !important;
      }
      .superShort .title {
          border-bottom-color: #f2923a !important;
      }
      .short .title {
          border-bottom-color: #f2c65f !important;
      }
      .decent .title {
          border-bottom-color: #b9d577 !important;
      }
      .long .title {
          border-bottom-color: #62b7c7 !important;
      }




      .cursorRest {
          width: 25px;
          height: calc(100vh - 20px);
          position: fixed;
          top: 20px;
          background: #fff;
          opacity: .25;
          z-index: 12;
      }
      .cursorRest.left {
          left: 0;
      }
      .cursorRest.right {
          right: 0;
      }

      .privateHide {
          display: none !important;
      }



      #list_videos_common_videos_list > .container {
          display: none !important;
      }


      .pagination {
          margin: 0px 0px 120px !important;
      }



      .welcome {
          display: none;
      }

       .icons {
          display: inline-block;
          font-size: 4px;
          height: 20px;
          width: 20px;
      }

      .ico_bar {
          height: 2px;
      }

      .mobile-btn {
          padding: 6px 7px 5px 7px;
          /*margin-left: 10px;*/
          max-height: 30px;
      }

      .logo {
          display: none !important;
      }

      .header-top .container::before {

      }

      .header-top {
          /*padding-left: 8px;*/
      }

      .header-top,
      .header-bottom {
          display: inline-block;
      }

      .header .container {
          display: inline-block;
      }

      .nav-header {
          float: right !important;
          display: block;
          width: 100%;
          max-width: 333px;
      }

      .search-form {
          float: left !important;
      }


      video {
          z-index: 100;
      }

      .main-nav.open {
          width: auto !important;
          left: -90px !important;
          right: -10px !important;
          box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.4) !important;
          border: thin solid rgb(79, 79, 79) !important;
      }










      /* fallback */
      @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url("//fonts.gstatic.com/s/materialicons/v30/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2") format('woff2');
      }

      .material-icons {
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 20px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }


  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
