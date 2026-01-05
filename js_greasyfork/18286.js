// ==UserScript==
// @name         Twitch - Images Link to Image
// @version      1.0
// @description  Convert the url images to the real images!
// @author       iMaarC
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/34746
// @downloadURL https://update.greasyfork.org/scripts/18286/Twitch%20-%20Images%20Link%20to%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/18286/Twitch%20-%20Images%20Link%20to%20Image.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

setInterval(function(){ 

    var img = [".png",".jpg",".gif",".jpeg"];
    var message = document.getElementsByClassName("message");
    
    for(var i = 0; i < message.length; i++){
        if(message[i].parentNode.tagName == 'LI'){
            for(var j = 0; j < img.length; j++){
                if(message[i].children.length != 0){
                    for(var x = 0; x < message[i].children.length; x++){
                        if(message[i].children[x].innerText.indexOf(img[j]) > -1){
                            var imgUrl = message[i].children[x].innerText;
                            message[i].children[x].innerHTML = "";
                            message[i].children[x].innerHTML += "<img src='" + imgUrl +"'></img>"
                        }  
                    }
                }
            }
        }
        else
        {
            console.log("Error - ImgToLink");
        }
    }
}, 500);
                                                         