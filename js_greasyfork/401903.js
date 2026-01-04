// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      2.2
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo. Gasegamer(modification)
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @icon         https://raw.githubusercontent.com/slaggo/CrittersPlus/master/icon.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401903/Critters%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/401903/Critters%2B.meta.js
// ==/UserScript==

var jokes = [
    {"j":"What do you call a hamster in a tophat?","p":"Abrahamster Lincoln!"},
    {"j":"Where does a hamster go for vacation?","p":"Hamsterdam!"},
    {"j":"What do you call a hamster with no legs?","p":"A furball!"},
    {"j":"What do you call a hamster that can't run in a wheel?","p":"Hamateur."},
    {"j":"Why was the hamster upset with his job?","p":"It didn't pay enough celery."},
    {"j":"What do you call a hamster with three legs?","p":"Hamputee."},
    {"j":"What happens when two snails get into a fight?","p":"They slug it out!"},
    {"j":"Why is the snail the strongest animal?","p":"Because he carries a house on his back!"},
    {"j":"How do snails make important calls?","p":"On shell phones."},
    {"j":"What kind of car does a raccoon drive?","p":"A furrari."},
    {"j":"Three guys stranded on a desert island find a magic lantern containing a genie, who grants them each one wish.","p":"The first guy wishes he was off the island and back home. The second guy wishes the same. The third guy says: ‘I’m lonely. I wish my friends were back here."}
]

// Code for delay function

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

// Runs on page load

window.addEventListener('load', function() {


    // Sets the theme to dark if browser supports webstorage
    var hamsterSprites =world.data.critters[0].Sprites;
 
    var chatBar = document.getElementsByClassName("input-group")[0];
    var chatBox = document.getElementsByClassName("row justify-content-center")[1];
    var jokeBtnHTML = `<span class="input-group-btn"><button id="jokebtn" class="btn btn-success">Joke</button></span>`;
    var clapBtnHTML = `<span class="input-group-btn"><button id="clapbtn" class="btn btn-warning">Clap</button></span>`;
    var balloonoffBtnHTML = `<span class="input-group-btn"><button id="balloonoffbtn" class="btn btn-info">Chat Balloons On/Off</button></span>`;
    var nametagsonoffBtnHTML = `<span class="input-group-btn"><button id="nametagsonoffbtn" class="btn btn-info">Name Tags On/Off</button></span>`;
    var freeitemBtnHTML = `<span class="input-group-btn"><button id="freeitembtn" class="btn btn-warning">FreeItem</button></span>`;
    var darkmodeBtnHTML = `<span class="input-group-btn"><button id="darkmodebtn" class="btn btn-secondary">DarkMode</button></span>`;
    var racoonBtnHTML = `<span class="input-group-btn"><button id="racoonbtn" class="btn btn-secondary">Racoon</button></span>`;
    var lizardBtnHTML =  `<span class="input-group-btn"><button id="lizardbtn" class="btn btn-success">Lizard</button></span>`;
    var beaverBtnHTML = `<span class="input-group-btn"><button id="beaverbtn" class="btn btn-primary">Beaver</button></span>`
    var hamsterBtnHTML = `<span class="input-group-btn"><button id="hamsterbtn" class="btn btn-danger">Hamster</button></span>`;
    var itemsBtnHTML =  `<input type="text" id="myText" value="ItemId of the item you want.">`;
     var itemInventoryBtnHTML =  `<input type="text" id="itemwanted" value="ItemId of the item you have.">`;
    var ChangeItem =  `<span class="input-group-btn"><button id="changebtn" class="btn btn-danger">Change Item</button></span>`;
    chatBar.insertAdjacentHTML('beforeend', jokeBtnHTML);
    chatBar.insertAdjacentHTML('beforeend', clapBtnHTML);    
    chatBar.insertAdjacentHTML('afterend', balloonoffBtnHTML);
    chatBar.insertAdjacentHTML('afterend', nametagsonoffBtnHTML);
    chatBar.insertAdjacentHTML('afterend', hamsterBtnHTML);
    chatBar.insertAdjacentHTML('afterend', beaverBtnHTML);
    chatBar.insertAdjacentHTML('afterend', racoonBtnHTML);
    chatBar.insertAdjacentHTML('afterend', lizardBtnHTML);
    chatBar.insertAdjacentHTML('afterend', darkmodeBtnHTML);
    chatBar.insertAdjacentHTML('afterend', freeitemBtnHTML);
    chatBar.insertAdjacentHTML('afterend', itemInventoryBtnHTML);

    chatBar.insertAdjacentHTML('afterend', ChangeItem);
    chatBar.insertAdjacentHTML('afterend', itemsBtnHTML);

    function sendJoke() {
        document.getElementById("inputMessage").value="";
        var joke = jokes[(Math.floor(Math.random() * jokes.length))]; // Retrieve random joke from variable
        world.sendMessage(joke.j); // Send the first part of the joke
        delay(function(){
            world.sendMessage(joke.p); // Send the punchline
        }, 5000 ); // end delay
    }

    function sendClap() {
        var message = document.getElementById("inputMessage").value;
        document.getElementById("inputMessage").value="";
        message = message.split(" ").join(" 👏 ");
        message = "👏" + message + "👏";
        console.log(message);
        world.sendMessage(message);
    }

    function balloonoff() {
        document.getElementById("inputMessage").value="";
        world.sendMessage("/balloons"); // Turn chat balloons off
    }

    function nametagsonoff() {
        document.getElementById("inputMessage").value="";
        world.sendMessage("/nicknames"); // Turn name tags on/off
    }
    function freeitem() {
        document.getElementById("inputMessage").value="";
        world.sendCode("freeitem"); // Get free item
    }
    function darkmode()
    {
         document.getElementById("inputMessage").value="";
        world.sendMessage("/darkmode");
    }

    function racoonchange()
    {
        document.getElementById("inputMessage").value="";
    world.data.critters[0].Sprites = world.data.critters[1].Sprites
    }
    function lizardchange(){
          document.getElementById("inputMessage").value="";
   world.data.critters[0].Sprites = world.data.critters[3].Sprites
    }
     function beaverchange(){
          document.getElementById("inputMessage").value="";
   world.data.critters[0].Sprites = world.data.critters[2].Sprites
    }
        function hamsterchange()
    {
        document.getElementById("inputMessage").value="";
        world.data.critters[0].Sprites = hamsterSprites;
    }

   function itemId()
    {
       var x = document.getElementById("myText").value;
        var y = document.getElementById("itemwanted").value;
         world.data.items.Directions[y] =  world.data.items.Directions[x];
    }


    var jokeBtn = document.querySelector ("#jokebtn");
    if (jokeBtn) {
        jokeBtn.addEventListener ("click", sendJoke, false);
    }
    var clapBtn = document.querySelector ("#clapbtn");
    if (clapBtn) {
        clapBtn.addEventListener ("click", sendClap, false);
    }

    var balloonoffBtn = document.querySelector ("#balloonoffbtn");
    if (balloonoffBtn) {
        balloonoffBtn.addEventListener ("click", balloonoff, false);
    }

    var nametagsonoffBtn = document.querySelector ("#nametagsonoffbtn");
    if (nametagsonoffBtn) {
        nametagsonoffBtn.addEventListener ("click", nametagsonoff, false);
    }

     var freeitemBtn = document.querySelector ("#freeitembtn");
    if (freeitemBtn) {
        freeitemBtn.addEventListener ("click", freeitem, false);
    }
    var darkmodeBtn = document.querySelector("#darkmodebtn");
    if (darkmodeBtn) {
        darkmodeBtn.addEventListener ("click", darkmode, false);
    }
    var racoonBtn = document.querySelector("#racoonbtn");
    if(racoonBtn){
     racoonBtn.addEventListener ("click", racoonchange, false);
    }

    var lizardBtn = document.querySelector("#lizardbtn");
    if(lizardBtn){
     lizardBtn.addEventListener ("click", lizardchange, false);
    }

    var beaverBtn = document.querySelector("#beaverbtn");
    if(beaverBtn){
     beaverBtn.addEventListener ("click", beaverchange, false);
    }
    var hamsterBtn = document.querySelector("#hamsterbtn");
    if(hamsterBtn){
     hamsterBtn.addEventListener ("click", hamsterchange, false);
    }
    var ItemIdBtn = document.querySelector("#changebtn");
    if(ItemIdBtn){
     ItemIdBtn.addEventListener("click", itemId, false);
    }

}, false);
