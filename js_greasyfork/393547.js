// ==UserScript==
// @name       Glitch Support Dark Mode
// @namespace  SUPPORT-DARK-MODE
// @version    0.2
// @match      https://support.glitch.com/*
// @description your friendly dark screen for support.glitch.com
// @downloadURL https://update.greasyfork.org/scripts/393547/Glitch%20Support%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/393547/Glitch%20Support%20Dark%20Mode.meta.js
// ==/UserScript==

// var jQ = 3
//variables
//#d6d4d4

var body = document.getElementsByTagName("body")[0];
var center = document.createElement("center");
var hr = document.createElement("hr");
var brk = document.createElement("br");
var dark = document.createElement("button");
var light = document.createElement("button");
var style = document.createElement("style");
var div = document.createElement("div");
var settings = document.createElement("button");
var modal = document.createElement("div");

var title = document.getElementById("topic-title");
var category = document.getElementsByClassName("category-name");
var user = document.getElementsByClassName("username");

var isLight = false;
var isDark = false;

// specifying IDs so that I can declare styles

div.setAttribute("class", "slidecontainer");
dark.setAttribute("id", "dark");
light.setAttribute("id", "light");
settings.setAttribute("id", "settings");
modal.setAttribute("id", "myModal");
modal.setAttribute("class", "modal");

//child appends

center.appendChild(hr);
center.appendChild(dark);
center.appendChild(light);
center.appendChild(settings);
center.appendChild(brk);
center.appendChild(div);
document.body.appendChild(modal);

body.appendChild(center);

document.head.appendChild(style);

// Setting innerHTML content

dark.innerHTML = "dark";
light.innerHTML = "light";
settings.innerHTML = "⚙"
div.innerHTML = '<input type="range" min="0" max="170" value="0" class="slider" id="backValue">'
modal.innerHTML = `<div class="modal-content"><span class="close">&times;</span><p>Some text in the Modal..</p></div>`

var slider = document.getElementById("backValue");

//Document Event Listener

dark.addEventListener("click", function() {
  __a("DARK");
});
light.addEventListener("click", function() {
  __a("LIGHT");
});

// Functions defining what to do...

function darkstyles() {
  style.innerHTML = `
    
    
.slider {
  -webkit-appearance: none;
  width: 40%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  display: none;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4545CC;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4545CC;
  cursor: pointer;
}
    
    body {
      background-color: black;
      color: white;
    }

    .fancy-title {
      color: white;
    }

    #topic-title h1 a {
      color: white;
    }

    .category-name {
      color: white;
    }

    .username {
      color: white;
    }

    #light {
      border: solid #4545CC 2px;
      color: #4545CC;
      fill: #4545CC;
      background: white;
      height: 30px;
      border-radius: 5px;
      transition: top 0.2s ease;
      position: relative;
      top: 0;
      vertical-align: middle;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: bold;
      margin-bottom: 40px;
    }

    #dark {
      border: solid white 2px;
      color: white;
      fill: #4545CC;
      background: #4545CC;
      height: 32px;
      border-radius: 5px;
      transition: top 0.2s ease;
      position: relative;
      top: 0;
      vertical-align: middle;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: bold;
      margin-bottom: 40px;
      margin-right: 10px;
    }

    #settings {
      border: solid white 2px;
      color: white;
      fill: #4545CC;
      background: #4545CC;
      height: 32px;
      border-radius: 5px;
      transition: top 0.2s ease;
      position: relative;
      top: 0;
      vertical-align: middle;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: bold;
      margin-bottom: 40px;
      margin-right: 10px;
    }

    .topic-list-main-link a.title, .topic-list .main-link a.title, .latest-topic-list-item .main-link a.title {
      color: white;
    }

    blockquote {
      background-color: black;
    }

    aside.quote .title {
      background-color: black;
    }

    .topic-map {
      color: white;
      border-radius: 5px;
      background-color: black;
    }

    .map {
      border-radius: 5px;
      color: white;
      background-color: black;
    }

    .topic-map h3 {
      color: white;
      background-color: black;
    }

    .names span a {
      color: #d6d4d4;
    }

    .discourse-tag.simple, .discourse-tag.simple:visited, .discourse-tag.simple:hover {
      color: #d6d4d4;
    }

    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content/Box */
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 80%; /* Could be more or less, depending on screen size */
    }

    /* The Close Button */
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }

  `;
}

function lightstyles() {
  style.innerHTML = `

    body {
      background-color: white;
      color: black;
    }

    .fancy-title {
      color: black;
    }

    .category-name {
      color: black;
    }

    .username {
      color: black;
    }

    #light {
      border: solid #4545CC 2px;
      color: #4545CC;
      fill: #4545CC;
      background: white;
      height: 30px;
      border-radius: 5px;
      transition: top 0.2s ease;
      position: relative;
      top: 0;
      vertical-align: middle;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: bold;
      margin-bottom: 40px;
    }

    #dark {
      border: solid white 2px;
      color: white;
      fill: #4545CC;
      background: #4545CC;
      height: 32px;
      border-radius: 5px;
      transition: top 0.2s ease;
      position: relative;
      top: 0;
      vertical-align: middle;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: bold;
      margin-bottom: 40px;
      margin-right: 10px;
    }

    #settings {
      border: solid white 2px;
      color: white;
      fill: #4545CC;
      background: #4545CC;
      height: 32px;
      border-radius: 5px;
      transition: top 0.2s ease;
      position: relative;
      top: 0;
      vertical-align: middle;
      cursor: pointer;
      text-transform: uppercase;
      font-family: monospace;
      font-weight: bold;
      margin-bottom: 40px;
      margin-right: 10px;
    }

    .topic-list-main-link a.title, .topic-list .main-link a.title, .latest-topic-list-item .main-link a.title {
      color: black;
    }

    blockquote {
      background-color: #f9f9f9;
    }

    aside.quote .title {
      background-color: #f9f9f9;
    }

    .topic-map {
      color: black;
      border-radius: 5px;
      background-color: #e9e9e9;
    }

    .map {
      border-radius: 5px;
      color: black;
      background-color: #e9e9e9;
    }

    .topic-map h3 {
      color: black;
      background-color: #e9e9e9;
    }

    .names span a {
      color: #646464;
    }

    .discourse-tag.simple, .discourse-tag.simple:visited, .discourse-tag.simple:hover {
      color: #646464;
    }

    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content/Box */
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 80%; /* Could be more or less, depending on screen size */
      border-radius: 9px;
    }

    /* The Close Button */
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
`;
}

//mode function
function __a(mode) {
  switch (mode) {
    case "DARK":
      darkstyles();
      slider.style.display = "block";
      var darkBackColor = localStorage.getItem("rgbvalues");
      if (darkBackColor == "") {
        console.error("No localstorage!");
      } else {
        document.body.style.backgroundColor = "rgb(0, 0, " + darkBackColor + ")";
      }
      isDark = true;
      isLight = false
      break;

    case "LIGHT":
      lightstyles();
      slider.style.display = "none";
      isDark = false;
      isLight = true;
      document.body.style.backgroundColor = "white";
      break;
  }
}

// Styles for the button

style.innerHTML = `

#light {
  border: solid #4545CC 2px;
  color: #4545CC;
  fill: #4545CC;
  background: white;
  height: 30px;
  border-radius: 5px;
  transition: top 0.2s ease;
  position: relative;
  top: 0;
  vertical-align: middle;
  cursor: pointer;
  text-transform: uppercase;
  font-family: monospace;
  font-weight: bold;
  margin-bottom: 40px;
  margin-right: 10px;
}

#dark {
  border: solid white 2px;
  color: white;
  fill: #4545CC;
  background: #4545CC;
  height: 32px;
  border-radius: 5px;
  transition: top 0.2s ease;
  position: relative;
  top: 0;
  vertical-align: middle;
  cursor: pointer;
  text-transform: uppercase;
  font-family: monospace;
  font-weight: bold;
  margin-bottom: 40px;
  margin-right: 10px;
}

#settings {
  border: solid white 2px;
  color: white;
  fill: #4545CC;
  background: #4545CC;
  height: 32px;
  border-radius: 5px;
  transition: top 0.2s ease;
  position: relative;
  top: 0;
  vertical-align: middle;
  cursor: pointer;
  text-transform: uppercase;
  font-family: monospace;
  font-weight: bold;
  margin-bottom: 40px;
  margin-right: 10px;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

`;

slider.oninput = function() {
  let rgbValue = this.value;
  console.log(rgbValue);
  if (isDark) {
    document.body.style.backgroundColor = "rgb(0, 0, " + rgbValue + ")"; 
    localStorage.setItem("rgbvalues", rgbValue);
  } else {
    document.body.style.backgroundColor = "white";
  }
}

var modalbox = document.getElementById("myModal");
var btn = document.getElementById("settings");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modalbox.style.display = "block";
}

span.onclick = function() {
  modalbox.style.visiblity = "hidden";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modalbox.style.display = "none";
  }
}