// ==UserScript==
// @name         Pixilart Texture Pack
// @namespace    http://tampermonkey.net/
// @version      2025-07-12
// @description  Change Pixilart's look into this theme
// @author       Shroomgus
// @match        https://www.pixilart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546155/Pixilart%20Texture%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/546155/Pixilart%20Texture%20Pack.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent = `
    .ic_a {
    height: 35px !important;
    width: 35px !important;
    padding: 5px !important;
    background-size: 100% 100%; !important;}

  .ic_a.home {
    background-image: url(https://i.imgur.com/0IxQyB4.png);
     }

     .ic_a.explore {
    background-image: url(https://i.imgur.com/t8a6024.png);
     }

     .ic_a.comics {
    background-image: url(https://i.imgur.com/LNIZNma.png);
     }

     .ic_a.challenges_b {
    background-image: url(https://i.imgur.com/7oweAQa.png);
     }

     .ic_a.mobile {
    background-image: url(https://i.imgur.com/DzRxrZl.png);
     }

     .navbar {
    height: initial;
    background-color: rgb(37,58,94) ;
    border-bottom: 3px solid black;
    border-color: rgba(79,143,186,255);
    }

    .card-content.card-normal {
    border: 3px solid black;
    border-color: #3c5e8b;
    border-radius: 25px;
    }

    .card {
    border-radius: 25px;
    border: 3px solid black;
    }

   body.dk {
   background-color: rgba(23,32,56,255) ;
   }

   .navbar-nav.rt .nav-icon-inline .nav-link.navbar-create-acount,.navbar-nav.rt .nav-icon-inline .nav-link.navbar-drawing {
    background: #4f8fba;
    }

    .navbar-nav.rt .nav-icon-inline .nav-link.navbar-create-acount:hover,.navbar-nav.rt .nav-icon-inline .nav-link.navbar-drawing:hover {
    color: #fff;
    box-shadow: none;
    background: linear-gradient(90deg,#2d9bea,#4f8fba)
    }

   .navbar-painter {
   background: #75a743;
   }
   .navbar-nav .drawing-btn-upload {
   background: #da863e;
   }
}`
    document.head.appendChild(style);

    function addOutline(element) {
        element.style.setProperty("border", "3px solid black", "important");
        element.style.setProperty("border-color", "rgba(60,94,139,255)", "important");
        element.style.setProperty("border-radius", "25px", "important");
        element.parentElement.style.setProperty("border-radius", "25px", "important");
        element.children[0].style.setProperty("border-radius", "25px", "important");


    };

    // adding the font
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Tiny5&display=swap';
    document.head.appendChild(link3);

    document.body.style.fontFamily = "'Tiny5', sans-serif";
    //
    // removing text from the navigator bar buttons
    const iconBar = document.getElementsByClassName("navbar-nav rt right-align")[0];
    for (const icon of iconBar.children) {
        icon.children[0].children[1].remove();
    }
    //
    // changing the theme colors
    const colors = document.body.style;
    colors.setProperty("--bg-main", "#172038");
    colors.setProperty("--bg-sec", "#253a5e");
    colors.setProperty("--bg-ltr", "#3c5e8b");
    colors.setProperty("--dk-primary-outline", "#3c5e8b");
    colors.setProperty("--bg-ltrh", "#2e4875")
    //
    // changing the card items property
    window.addEventListener("load", () => {
        const activityFeed = document.getElementById("activity-feed");
        for (const thing of activityFeed.children) {
            if (thing.matches(".activity-links-wrapper.mb-3.d-flex.align-items-center")){
                //
            } else{
                addOutline(thing);
            }
        }
   });

   window.addEventListener("load", () => {
       const SPCollumns = document.querySelectorAll("div.sdw");
       for (const SPCollumn of SPCollumns) {
           for (const SP of SPCollumn.children) {
               addOutline(SP);
           }
       }

   });

})();