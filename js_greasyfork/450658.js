// ==UserScript==
// @name         Anti Rickroll
// @version      0.2
// @description  STOP RICKROLLS
// @author       Bumblebee
// @match        https://*/*
// @grant        none
// @namespace https://greasyfork.org/users/954012
// @downloadURL https://update.greasyfork.org/scripts/450658/Anti%20Rickroll.user.js
// @updateURL https://update.greasyfork.org/scripts/450658/Anti%20Rickroll.meta.js
// ==/UserScript==
(function(){
    console.log("Anti-Rickroll: Injected Script.");
    var link = window.location.href.toString();
    if(link.includes("?dontblock=true")==true) return console.log("Ignoring Link \n Reason: ?dontblock=true");
    if(link.toLowerCase().includes("anti-rickroll")==true) return console.log("Ignoring link \n Reason: anit-rickroll");
    function doSomething() {
        console.log("Anti-Rickroll: Content Loaded")
        console.log("Anit Rickroll: "+link);

        var title = document.title.toLowerCase();
        console.log("Anti-Rickroll Log: Title :: "+title)
        var html = `<!DOCTYPE html>
<html>
<head>
<title>Anti-Rickroll</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<link rel="icon" type="image/x-icon" href="https://Anti-Rickroll.bumblebee13.repl.co/rick.png?width=413&height=413">
<style>
body,h1 {font-family: "Raleway", sans-serif}
body, html {height: 100%}
.bgimg {
  background-image: url('https://cdn.wallpapersafari.com/10/27/vU1V6Z.jpg');
  min-height: 100%;
  background-position: center;
  background-size: cover;
}
</style>
</head>
<body>

<div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
  <div class="w3-display-topleft w3-padding-large w3-xlarge">
    Anti-Rickroll
  </div>
  <div class="w3-display-middle">
    <h1 class="w3-jumbo w3-animate-top">RickRoll Detected!</h1>
    <hr class="w3-border-grey" style="margin:auto;width:40%">
    <p class="w3-large w3-center">
    Link: <strong>${link}</strong><br><br>
    Title: <strong>${title}</strong><br><br>
    <a href="${link}?dontblock=true"><button class="w3-button w3-black w3-hover-grey">Continue</button></a>
    </p>
  </div>
  <div class="w3-display-bottomleft w3-padding-large">
    <strong>
    Powered By: <a href="https://Anti-Rickroll.bumblebee13.repl.co" target="_blank">Anti Rickroll</a><br>
    Made By: <a href="#bumblebee" target="_blank">Bumblebee</a>
    </strong>
  </div>
</div>

</body>
</html>
`
        function chkRick(title){
            console.log("Anti-Rickroll Log: Checklink Function Fired!")

            var a = false;
            if ((title.indexOf("rickroll") !== -1)==true){a=true;}
            else if ((title.indexOf("rick roll") !== -1)==true){a=true;}
            else if ((title.indexOf("never gonna give you up") !== -1)==true){a=true;}
            else {a=false}
            if ((title.indexOf("google search") !== -1)){a=false}
            return a;
        }

        var data = chkRick(title);
        if(data==true){
            console.log("Anti-Rickroll Log: Is a Rickroll")
            document.documentElement.innerHTML=html;
        }
        else{
            console.log("Anti-Rickroll Log: Is Not a Rickroll")
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doSomething);
    } else {
        doSomething();
    }
    window.addEventListener('DOMContentLoaded', (event) => {
        console.log("Anti-Rickroll: Content Loaded")
        var link = window.location.href.toString();
        console.log("Anit Rickroll: "+link);
        if(link.includes("?dontblock=true")==true) return console.log("Ignoring Link \n Reason: ?dontblock=true");
        if(link.toLowerCase().includes("anti-rickroll")==true) return console.log("Ignoring link \n Reason: anit-rickroll");

        var title = document.title.toLowerCase();
        console.log("Anti-Rickroll Log: Title :: "+title)
        var html = `<!DOCTYPE html>
<html>
<head>
<title>Anti-Rickroll</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<link rel="icon" type="image/x-icon" href="https://Anti-Rickroll.bumblebee13.repl.co/rick.png?width=413&height=413">
<style>
body,h1 {font-family: "Raleway", sans-serif}
body, html {height: 100%}
.bgimg {
  background-image: url('https://cdn.wallpapersafari.com/10/27/vU1V6Z.jpg');
  min-height: 100%;
  background-position: center;
  background-size: cover;
}
</style>
</head>
<body>

<div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
  <div class="w3-display-topleft w3-padding-large w3-xlarge">
    Anti-Rickroll
  </div>
  <div class="w3-display-middle">
    <h1 class="w3-jumbo w3-animate-top">RickRoll Detected!</h1>
    <hr class="w3-border-grey" style="margin:auto;width:40%">
    <p class="w3-large w3-center">
    Link: <strong>${link}</strong><br><br>
    Title: <strong>${title}</strong><br><br>
    <a href="${link}?dontblock=true"><button class="w3-button w3-black w3-hover-grey">Continue</button></a>
    </p>
  </div>
  <div class="w3-display-bottomleft w3-padding-large">
    <strong>
    Powered By: <a href="https://Anti-Rickroll.bumblebee13.repl.co" target="_blank">Anti Rickroll</a><br>
    Made By: <a href="#bumblebee" target="_blank">Bumblebee</a>
    </strong>
  </div>
</div>

</body>
</html>
`
        function chkRick(title){
            console.log("Anti-Rickroll Log: Checklink Function Fired!")

            var a = false;
            if ((title.indexOf("rickroll") !== -1)==true){a=true;}
            else if ((title.indexOf("rick roll") !== -1)==true){a=true;}
            else if ((title.indexOf("never gonna give you up") !== -1)==true){a=true;}
            else {a=false}
            if ((title.indexOf("google search") !== -1)){a=false}
            return a;
        }

        var data = chkRick(title);
        if(data==true){
            console.log("Anti-Rickroll Log: Is a Rickroll")
            document.documentElement.innerHTML=html;
        }
        else{
            console.log("Anti-Rickroll Log: Is Not a Rickroll")
        }
    })
})();