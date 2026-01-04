// ==UserScript==
// @name        GreasyFork: Better Webhook Info Page
// @namespace   UserScripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     0.1.7
// @author      CY Fung
// @license     MIT
// @description 9/21/2023, 3:18:06 PM
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/475798/GreasyFork%3A%20Better%20Webhook%20Info%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/475798/GreasyFork%3A%20Better%20Webhook%20Info%20Page.meta.js
// ==/UserScript==

(()=>{

  if(!location.pathname.includes('/users/webhook-info')) return;

  document.head.appendChild(document.createElement('style')).textContent=`

    #main-header ~ .width-constraint > .text-content:only-child > ul li {
      font-size: 0.88rem;
    }

    #main-header ~ .width-constraint > .text-content:only-child > ul a:first-child {
      display: block;
      font-size: 1rem;
      margin-top: 4px;
      text-decoration: none;
    }

    #main-header ~ .width-constraint > .text-content:only-child > ul a ~ a {
      color: #383855;
      text-decoration: none;
    }

    [dark] #main-header ~ .width-constraint > .text-content:only-child > ul a ~ a {
      color: #9898c9;
    }

    #main-header ~ .width-constraint > .text-content:only-child dt {
      font-weight: bold;
      color: #2376a0;
    }

    #main-header ~ .width-constraint > .text-content:only-child dd textarea {
      flex-grow: 1;
      height: 5.2rem;
      margin: 0px;
      padding: 8px;
      box-sizing: border-box;
    }

    #main-header ~ .width-constraint > .text-content:only-child dd form {
      display: flex;
      flex-direction: row;
      align-items: end;
      column-gap: 24px;
      row-gap: 8px;
      flex-wrap: wrap;
      max-width: calc(100% - 48px);
    }

    @media all and (min-width:300px) {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: end;
      column-gap: 24px;
      max-width: calc(100% - 48px);
    }


    #main-header ~ .width-constraint > .text-content:only-child h3 {
      margin-top: 18px;
      margin-left: 8px;
    }

    #main-header ~ .width-constraint > .text-content:only-child > ul {
      margin-bottom: 48px;
    }

    #main-header ~ .width-constraint > .text-content:only-child h3 ~ *:not(h3) {
      margin-left: 48px;
    }

    /* Basic Styling for Submit Inputs and Buttons */
    input[type="submit"], button {
      font-family: 'Arial', sans-serif;     /* Choose your preferred font-family */
      font-size: 10pt;
      color: #FFFFFF;     /* White text color */
      background-color: #007BFF;     /* Blue background color */
      border: none;
      border-radius: 5px;     /* Rounded corners */
      padding: 8px 16px;     /* Padding around text */
      cursor: pointer;     /* Hand cursor on hover */
      transition: background-color 0.3s ease;     /* Smooth background color transition */
      text-align: center;     /* Center the text */
      outline: none;     /* Remove browser default focus styles */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);     /* A subtle shadow for depth */
    }

    /* Hover effect */
    input[type="submit"]:hover, button:hover {
      background-color: #0056b3;     /* A slightly darker blue on hover */
    }

    /* Active (pressed) effect */
    input[type="submit"]:active, button:active {
      background-color: #004494;     /* Even darker blue when button is pressed */
    }

    /* Focus effect for accessibility */
    input[type="submit"]:focus, button:focus {
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);     /* A blue glow when button is focused */
    }


    dd textarea {

      border: 0;
      padding: 0;
      font-family: inherit;
      font-weight: 900;
      color: #a83710;
      font-size: inherit;
      appearance: none;
      border: none;
      outline: none; /* Removes the focus outline */
      resize: none; /* Prevents user resizing */
    }



/* For WebKit browsers like Safari and Chrome */
dd textarea::-webkit-input-placeholder {
    color: inherit; /* Ensures the placeholder text color matches the textarea text color */
}

/* Remove the inner shadow in WebKit renderings */
dd textarea:focus,
dd textarea:active {
    -webkit-box-shadow: none;
    box-shadow: none;
}

[dark] section>ul>li>b:nth-of-type(odd){
    color: #80ecd3;
}

[dark] section>ul>li>b:nth-of-type(even){
    color: #bfe6a0;
}

  `


  new Promise(r => {

    if (document.readyState !== 'loading') {
      r();
    } else {
      window.addEventListener("DOMContentLoaded", r, false);
    }
  }).then(() => {


    for(const elm of document.querySelectorAll('.text-content dd, .text-content dd textarea')){

      if( elm.nodeName !=='TEXTAREA' && elm.firstElementChild===null){
        let s = elm.textContent;
        if(s && typeof s ==='string' && s.includes('/users/') && s.includes('/webhook') && s.includes('https://')){
          let t = s.replace(/\/users\/(\d+)\-[^\/]+\//,'/users/$1/');
          t=t.replace(/https\:\/\/greasyfork\.org\/[-\w]+\/users\//, 'https://greasyfork.org/en/users/');
          elm.textContent = t;
        }

      }else if(typeof elm.value ==='string'){

        let s = elm.value;
        // Add a click event listener to the textarea
        elm.addEventListener('click', function() {
          if(window.getSelection()+"" === "")
            this.select();
        });
        elm.addEventListener('drag', function(evt){
          evt.preventDefault();
        });
        elm.addEventListener('drop', function(evt){
          evt.preventDefault();
        });
        elm.addEventListener('dragstart', function(evt){
          evt.preventDefault();
        });
        if(s && typeof s ==='string' && s.includes('/users/') && s.includes('/webhook') && s.includes('https://')){
          let t = s.replace(/\/users\/(\d+)\-[^\/]+\//,'/users/$1/');
          t=t.replace(/https\:\/\/greasyfork\.org\/[-\w]+\/users\//, 'https://greasyfork.org/en/users/');
          elm.value=t;



        }


      }
    }

  })


})()