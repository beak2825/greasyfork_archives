// ==UserScript==
// @name         Login
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Sign in page
// @author       Brad Culwell
// @match        http://signin.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24547/Login.user.js
// @updateURL https://update.greasyfork.org/scripts/24547/Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
var name;
function getCookie(cname) {
    name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
    function deleteCookie(name) {
        document.cookie = name+"=;";
    }
    if(getCookie("username") !== ""){
        name = getCookie("username");
        correct();
    }
    var dele = document.getElementsByTagName("frameset")[0];
    dele.parentNode.removeChild(dele);
    main();
    function main(){
    

    document.getElementsByTagName("html")[0].innerHTML = //
        `
        <head>
          <style>
            body {
              background-color: #131313;
            }
            #butt {
              background-color: #131313;
              color: white;
              border: 2px solid;
              border-color: #212121;
              padding: 5px;
            }
            #butt:hover {
              cursor: pointer;
              background-color: #202020;
            }
            #logo {
              width: 150px;
              height: 150px;
              border: 5px solid;
              border-color: #101010;
              border-radius: 60px;
            }
            #txt {
              color: white;
              padding-left:5px;
              padding-right: 5px;
              padding-top: 3px;
              padding-bottom: 3px;
              border: 5px solid;
              border-radius: 10px;
              border-color: #181818;
              background-color: #212121;
            }
            .inp:focus{
              outline:none;
            }
            #sign-in {
              margin-top: 200;
            }
          </style>
        </head>
        <body>
          <div id="sign-in"style="text-align: center;">
            <img id="logo" src="https://lh3.googleusercontent.com/6FYRk4I4mgHOX7gYnHVf1OoEPXTdEWbWZ9n8t_GhnBpVdMXrOVy0bn3LCtr1-NCmrfPAqihoZQ=w2400-h1350-rw-no"></img><br><br>
            <input class="inp" placeholder="Enter Username" id="txt"/><br><br>
            <button class="inp" type="button" id="butt">Login</button>
          </div>
        </body>
        `;
    document.getElementById("txt")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementById("butt").click();
        }
    });
    var name;
    document.getElementById("butt").addEventListener("click", clicked);
    function clicked() {
        if(document.getElementById("txt").value == "Beastwick18"){
            name = "Beastwick18";
            document.cookie = "username="+name+";";
            correct();
        }else if(document.getElementById("txt").value == "Peytony"){
            name = "Peytony";
            document.cookie = "username="+name+";";
            correct();
        }
    }
    }
    function correct() {
        document.getElementsByTagName("html")[0].innerHTML = //
        `
        <head>
          <style>
            body {
              background-color: #131313;
            }
            #con {
              margin-top: 10px;
            }
            .inp:focus{
              outline:none;
            }
            #account {
              width: 92px;
              float: right;
            }
            #sign-out {
              font-size: 20px;
              font-family: sans-serif;
              background-color: #131313;
              color: white;
              border: 2px solid;
              border-color: #212121;
              padding: 5px;
            }
            #sign-out:hover {
              cursor: pointer;
              background-color: #202020;
            }
            #headd {
              height: 47px;
              border-bottom: 3px solid;
              border-color: #101010;
            }
            #title {
              width: 91.11px;
              float: left;
            }
            #header {
              font-family: sans-serif;
              font-weight: bold;
              color: white;
              font-size: 40;
            }
            #sign-in {
              margin-top: 319;
            }
            #welcome {
              width: 310;
              margin-left: auto;
              margin-right: auto;
            }
            #add {
              width: 60px;
              height: 60px;
              background-color: #050505;
              position:absolute;
              bottom:0;
              right:0;
              margin-right: 10px;
              margin-bottom: 10px;
              border-radius: 100px;
              text-align: center;
            }
            #add:hover {
              cursor: pointer;
              background-color: #101010;
            }
            h {
              float: inherit;
              font-size: 30px;
              color: white;
              font-family: sans-serif;
            }
            #plus {
              user-select: none;
              position: relative;
              top: 25%;
              transform: translateY(-50%);
            }
          </style>
        </head>
        <body>
          <div id="main">
            <div id="headd">
              <div id="title">
                <h id="header">Main</h>
              </div>
              <div id="account">
                <button class="inp" type="button" id="sign-out">Sign Out</button>
              </div>
              <div id="welcome"></div>
            </div>
            <div id="content"></div>
            <div id="add">
              <h id="plus">+</h>
            </div>
          </div>
        </body>
        `;
        document.getElementById("add").addEventListener("click", addA);
        document.getElementById("sign-out").addEventListener("click", signout);
        if(name !== ""){
            document.getElementById("welcome").innerHTML = //
            `
             <h>Welcome, `+ getCookie("username") +`</h>
            `;
        }else{
            alert("Broken");
        }
    }
    function addA() {
        var site = prompt("Site: ");
        var img = prompt("Img: ");
        document.getElementById("content").innerHTML = //
        `
         <a id="con" href="`+site+`"><img src="`+img+`"></a>
        `;
    }
    function signout(){
        deleteCookie("username");
        main();
    }
})();