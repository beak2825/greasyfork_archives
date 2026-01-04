// ==UserScript==
// @name         Project CrackRBLX
// @version      0.0.2
// @description  Lets break Roblox
// @author       EpicPlays 2
// @match        https://www.roblox.com/home*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace www.youtube.com/channel/UC8Rg04z0uAW69ykbaLIaMMg
// @downloadURL https://update.greasyfork.org/scripts/414548/Project%20CrackRBLX.user.js
// @updateURL https://update.greasyfork.org/scripts/414548/Project%20CrackRBLX.meta.js
// ==/UserScript==


if(Name) 
    console.log();
else{
    alert("Project CrackRBLX Loaded.");
    alert("Project CrackRBLX made by Dubstep Gaming. (Revived and edited by EpicPlays, and EpicPlays 2.) Taking credit for Project CrackRBLX will result in a Copyright Claim to be issued. You've been warned.");
    var WantsName = window.prompt("Hello There! What would you like me to call you?");
    window.localStorage.setItem("UserNamePCRBLX", WantsName);
    Name = window.localStorage.getItem("UserNamePCRBLX");
    alert("Hello, " + Name + ", Welcome to Project CrackRBLX!");
}



if(getStor("CrackedNumber")){
    console.log("Player has bought sht");
} else {
    window.localStorage.setItem("CrackedNumber", 0);
}

lel = function(cmd){
    cmd = window.prompt("Project CrackRBLX Command Bar");
    if (cmd == "SetRobux"){
        if (disRbx === true){
        disRbx = false;
        var newrbx = window.prompt("Please enter in a new balance!");
        window.localStorage.setItem("Robux", newrbx);
        Robux = window.localStorage.getItem("Robux");
        document.getElementById("nav-robux-amount").innerHTML = Robux;
        document.getElementById("nav-robux-balance").innerHTML = Robux;
        } else if (disRbx === false) {
        var nolrbx = window.prompt("Please enter in a new balance!");
        window.localStorage.setItem("Robux", nolrbx);
        Robux = window.localStorage.getItem("Robux");
        document.getElementById("nav-robux-amount").innerHTML = Robux;
        document.getElementById("nav-robux-balance").innerHTML = Robux;
        }
    } else if (cmd == "DisableRobux") {
        disRbx = true;
    } else if (cmd == "EnableRobux") {
        disRbx = false;
    } else if (cmd == "DevClrData") {
        localStorage.clear();
        alert("Cleared Data! Reloading page!");
        location.reload();
    } else if (cmd == "Youtube") {
        window.open('https://www.youtube.com/channel/UC6_WVW3H2xsp695BWIJy8Vg');
       
    } else if (cmd == "Details") {
        alert(
              "Project CrackRBLX by Home RBLX V0.0.2 Pre-Alpha"
              );
    }
};

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var filerefl=document.createElement("link");
        filerefl.setAttribute("rel", "stylesheet");
        filerefl.setAttribute("type", "text/css");
        filerefl.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}


if (disRbx === false) {
if (Robux){
    document.getElementById("nav-robux-amount").innerHTML = Robux;
    document.getElementById("nav-robux-balance").innerHTML = Robux;
} else {
    if(getStor("AwaitingFormat") == "true"){
        if(document.getElementById("game-detail-page")){
            var erm = window.prompt("Please enter in your balance.");
            window.localStorage.setItem("Robux", Roblox.NumberFormatting.abbreviatedFormat(Number(erm)));
            Robux = window.localStorage.getItem("Robux");
        }
    } else {
        if(document.getElementById("game-detail-page")){
            var e = window.prompt("What would you like your balance to be?");
            window.localStorage.setItem("Robux", Roblox.NumberFormatting.abbreviatedFormat(Number(e)));
            Robux = window.localStorage.getItem("Robux");
            document.getElementById("nav-robux-amount").innerHTML = Robux;
            document.getElementById("nav-robux-balance").innerHTML = Robux;
        } else {
            var e = window.prompt("What would you like your balance to be?");
            window.localStorage.setItem("Robux", e);
            Robux = window.localStorage.getItem("Robux");
            window.localStorage.setItem("AwaitingFormat", "true");
            alert("We're sorry! We were unable to reach the formatting service, so please go on a game page to make your balance visible");
        }
    }
}
}

var PC = {
    confirmSub: function(sessionName){
        if(window.sessionStorage.getItem(sessionName)){
            window.localStorage.setItem("Subbed", "true");
        }
    }
};

var PCa = [
    ChangeRbx = function ChangeRbx(a, userchange){
        if(userchange === true){
            var newrbx = window.prompt("Please enter in a new balance!");
            if(document.getElementById("game-detail-page")){
            window.localStorage.setItem("Robux", Roblox.NumberFormatting.abbreviatedFormat(parseFloat(newrbx)));
            Robux = window.localStorage.getItem("Robux");
            window.localStorage.setItem("AwaitingFormat", "false");
            }
        } else {
            if(document.getElementById("game-detail-page")){
            window.localStorage.setItem("Robux", Roblox.NumberFormatting.abbreviatedFormat(parseFloat(a)));
            Robux = window.localStorage.getItem("Robux");
            window.localStorage.setItem("AwaitingFormat", "false");
            }
        }
    },
    PCalert = function alert(msg, prompt){
        alert("[Project CrackRBLX]: " + msg);
    },
    log = function log(msg, error){
        if(error){
            console.log("[Project CrackRBLX][ERROR]: " + msg);
            return msg;
        } else {
            console.log("[Project CrackRBLX]: " + msg);
        }
    },
    PCprompt = function prompt(msg){
        return window.prompt("[Project CrackRBLX]: "+msg);
    },
    createSession = function createSession(ses, val){
        return window.localStorage.setItem(ses, val);
    },
    terminateSession = function terminateSession(ses){
        window.localStorage.removeItem(ses);
    },
    this.updateStat = function updateStat(stat, ses, name){
        if(window.localStorage.getItem(ses)){
            window.localStorage.setItem(stat, window.localStorage.getItem(ses));
            if(name){
            [name] = ses;
            }
        } else {
            var err = PC.log("updateStat couldnt find Session!");
            PC.alert("An error has occured! Please report this error: " + err);
        }
    },
    getStat = function getStat(stat){
        if(window.localStorage.getItem(stat)){
            return window.localStorage.getItem(stat);
        } else {
            var err = PC.log("getStat couldnt find the Stat: " + stat);
            PC.alert("An error has occured! Please report this error: " + err);
        }
    },
    isStat = function isStat(stat, what){
        if(window.localStorage.getItem(stat) == what){
            return true;
        } else {
            return false;
        }
    },
    promptSubscribe = function promptSubscribe(){
        if(window.localStorage.getItem("Subscribed")){
            if(window.localStorage.getItem("Subscribed") == "false"){
                var ytwin = window.open("https://www.youtube.com/channel/UCfBnqZgxIcfsaO0559vuEpg", "SubToNilam", "width=200,height=100");
                ytwin.document.body.setAttribute("onload", "function(){ if(document.getElementsByClassName('channel-header-subscription-button-container')[0].children[0]['data-is-subscribed']){ alert('You are already subscribed! Thank You!'); window.localStorage.setItem('issubed', 'true'); } else { document.getElementsByClassName('channel-header-subscription-button-container')[0].children[0].addEventListener('click', function(){ alert('Thank You for Subscribing!'); window.localStorage.setItem('issubed', 'true'); }); }");
                var i;
                for(i = 0; i < 25; i++){
                    setTimeout(function(){ console.log(i); }, 4000);
                    if(i >= 25){
                        if(ytwin){
                        if(ytwin.localStorage.getItem("issubbed") == "true"){
                        ytwin.close();
                        PC.alert("Thank you for subscribing to Nilam! Subscription Progress: 50%");
                        ytwin = window.open("https://www.youtube.com/channel/UCfBnqZgxIcfsaO0559vuEpg", "SubToNilam", "width=200,height=100");
                        ytwin.document.body.setAttribute("onload", "function(){ if(document.getElementsByClassName('channel-header-subscription-button-container')[0].children[0]['data-is-subscribed']){ alert('You are already subscribed! Thank You!'); window.localStorage.setItem('issubed', 'true'); } else { document.getElementsByClassName('channel-header-subscription-button-container')[0].children[0].addEventListener('click', function(){ alert('Thank You for Subscribing!'); window.localStorage.setItem('issubed', 'true'); }); }");
                        var x;
                        for(x = 0; x < 25; x++){
                        setTimeout(function(){ console.log(i); }, 4000);
                        if(i >= 25){
                        if(ytwin){
                        if(ytwin.localStorage.getItem("issubbed") == "true"){
                        ytwin.close();
                        PC.alert("Thank you for subscribing to Dubstep! Subscription Progress: COMPLETE!");
                        PC.createSession("Sub", "true");
                        PC.updateStat("Subscribed", "Sub");
                        PC.terminateSession("Sub");
                        }
                        }
                        }
                        }
                        }
                        }
                    }
                }
            }
        }
    },
    displayError = function displayError(error){
        var err = PC.log(error, "");
        PC.alert("ERROR: A error has occured! Please report the following message: "+err);
    },
    createStorage = function createStorage(stname, val){
        if(window.localStorage.getItem(stname)){
            var err = PC.log("createStorage tried to create a existing storage! DETAILS: name='"+stname+"' value='"+val+"'", "");
            PC.alert("ERROR: A error has occured! Please report the following message: "+err);
        } else {
            return window.localStorage.setItem(stname, val);
        }
    },
    terminateStorage = function terminateStorage(stname){
        if(window.localStorage.getItem(stname)){
            window.localStorage.removeItem(stname);
        } else {
            PC.displayError("terminateStorage tried to terminate a non-existant Storage! Details: "+stname);
        }
    }];


function checkSubBtns(){
    if(document.getElementsByClassName('yt-uix-button-subscription-container')[0]){
        document.getElementsByClassName('yt-uix-button-subscription-container')[0].addEventListener('click', actSub);
    }
}

function hehe(){
    console.log(PCa);
}
document.getElementById("nav-blog").parentElement.innerHTML = "<div class='g-ytsubscribe' data-channelid='UCfBnqZgxIcfsaO0559vuEpg' data-layout='default' data-count='hidden'></div>";
document.getElementById("nav-shop").parentElement.innerHTML = "<div class='g-ytsubscribe' data-channelid='UCczEqb0kp0Wor9frH1cR5QA' data-layout='default' data-count='hidden'></div>";
var btn = document.createElement("IMG");
btn.setAttribute("src", "http://i.imgur.com/LlQM9GO.png");
btn.setAttribute("style", "position: fixed; top: 8px;");
btn.setAttribute("onclick", "lel();");
document.getElementsByClassName("navbar-right")[0].children[0].appendChild(btn);

function PurchaseItem(){
    var item = document.getElementsByClassName('PurchaseButton')[0];
    var buy = document.getElementById('confirm-btn');
    var itemStat = window.location.href.slice(31);
    var itemPrice = document.getElementsByClassName("text-robux-lg")[0].innerHTML;
    var itemImage = document.getElementsByClassName('thumbnail-span')[0].children[0].src;
    var itemName = document.getElementsByClassName('item-name-container')[0].children[0].innerHTML;
    window.localStorage.setItem("CrackedItem"+getStor("CrackedNumber"), itemStat);
    window.localStorage.setItem("CrackedItemPrice"+getStor("CrackedNumber"), itemPrice);
    window.localStorage.setItem("CrackedItemImage"+getStor("CrackedNumber"), itemImage);
    window.localStorage.setItem("CrackedItemName"+getStor("CrackedNumber"), itemName);
    window.localStorage.setItem("CrackedNumber", Number(getStor("CrackedNumber"))+1);
    document.getElementsByClassName("item-name-container")[0].children[1].innerHTML = document.getElementsByClassName("item-name-container")[0].children[1].innerHTML + s;
    item.removeAttribute("class");
    item.parentElement.removeChild(item);
    document.getElementsByClassName('alert-success')[0].setAttribute("style", "top: 35px");
    setTimeout(function(){ document.getElementsByClassName('alert-success')[0].setAttribute("style", "top: -8px"); }, 3000);
}

    if(window.location.href.slice(31) == CrackedThangs){
        var item = document.getElementsByClassName('PurchaseButton')[0];
        var buy = document.getElementById('confirm-btn');
        document.getElementsByClassName("item-name-container")[0].children[1].innerHTML = document.getElementsByClassName("item-name-container")[0].children[1].innerHTML + s;
        item.removeAttribute("class");
        item.parentElement.removeChild(item);
    }

if(document.URL.includes('inventory') === true){
    for(i=0;i<Number(getStor('CrackedNumber'));i++){
        if(getStor('CrackedItem'+i)){
            var span = document.createElement("SPAN");
            span.innerHTML = m;
            document.getElementById('assetsItems').appendChild(span);
            span.children[0].children[0].children[0].children[0].children[1].src = getStor('CrackedItemImage'+i);
            span.children[0].children[0].children[0].children[1].innerHTML = getStor('CrackedItemName'+i);
            span.children[0].children[0].children[0].children[1].title = getStor('CrackedItemName'+i);
            span.getElementsByClassName('item-card-price')[0].removeChild(span.getElementsByClassName('item-card-price')[0].getElementsByClassName('text-label')[0]);
            span.getElementsByClassName('item-card-price')[0].children[0].setAttribute('class', 'icon-robux-16x16');
            span.getElementsByClassName('item-card-price')[0].children[1].setAttribute('class', 'text-robux ng-binding');
            span.getElementsByClassName('item-card-price')[0].children[1].innerHTML = getStor('CrackedItemPrice'+i);
            span.getElementsByClassName('item-card-link')[0].href = "http://www.roblox.com/catalog/"+getStor('CrackedItem'+i);
        }
    }
}

function start(){
    if (document.URL.includes("catalog") === true){
    console.log("E");
    var item = document.getElementsByClassName('PurchaseButton')[0];
    var buy = document.getElementById('confirm-btn');
    var price = document.getElementsByClassName('text-robux-lg')[0];
    item.addEventListener('click', PurchaseItem);
    getBoughtItems();
    console.log("F");
    } else if(document.URL.includes("promocodes") === true) {
        var id = document.getElementById("pin");
        var gotnil = window.localStorage.getItem("GotNilam");
        Roblox.GameCard.redeemCode = function(){
            console.log("HUE");
            if(id.value == "Nilam1s4Realz"){
                console.log("HUE HUE");
                if (gotnil == "false"){
                console.log("HUE HUE HYPE");
                var bar = document.getElementById("success").removeAttribute("style");
                alert("PCRBLX CODE REDEEMED");
                document.getElementById("SuccessMessage").innerHTML = "Redeemed Free Robux Reset!";
                var newrbx = window.prompt("Please enter in a new balance!");
                window.localStorage.setItem("GotNilam", "true");
                window.localStorage.setItem("AwaitingFormat", "true");
                window.localStorage.setItem("Robux", newrbx);
                Robux = window.localStorage.getItem("Robux");
                }
            }
        };
    }
}


loadjscssfile("https://apis.google.com/js/platform.js", "js"); //dynamically load and add this .js file
start();
setTimeout(checkSubBtns, 2000)