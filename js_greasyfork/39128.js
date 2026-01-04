// ==UserScript==
// @name         Alis-True.Ju Mod
// @namespace    http://tampermonkey.net/
// @version      0.63
// @description  Alis Assistant
// @author       Julien
// @match        http://alis.io/
// @icon         http://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Vg_development_icon.svg/240px-Vg_development_icon.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39128/Alis-TrueJu%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/39128/Alis-TrueJu%20Mod.meta.js
// ==/UserScript==

     //Getting all elements
     var UserName = document.getElementById("nick").value;
     $("#lvl").ready(function () {
         Interval = setInterval(function(){ lvlGetter(); }, 4500);
         function lvlGetter() {
             LvL = lvl.innerHTML;
             Xp = document.getElementById("ownxp").innerHTML;
             CoinCount = document.getElementById("coinamount").innerHTML;
             welcomeAlert();
             ProfileImage = document.getElementById("skinurl").value;
             AccountLoader();
         }
     });
/*#######*/
     function welcomeAlert() {
         swal('Welcome back ' + UserName + ', it`s nice to see you :)\n\nYour current stats are:\nlvl: ' + LvL + '\n' + Xp + '\nCoins: ' + CoinCount);
         clearInterval(Interval);
     }
/*Setting up the menu (open and close functions added)*/
     $("body").prepend('<div id="hi">True.Ju Menu</div>');
     var divlo = document.getElementById("hi");
     divlo.style.position = "absolute";
     divlo.style.zIndex = "99999";
     divlo.style.color= "white";
     divlo.style.marginTop = "35px";
     divlo.style.marginLeft = "10px";
     $("body").prepend('<div id="MenuLayer"><p id="MenuTitle">Menu</p></div>');
     let MenuLayer = document.getElementById("MenuLayer");
     let MenuTitle = document.getElementById("MenuTitle");
     MenuLayer.style.display = "none";
     MenuLayer.style.position = "absolute";
     MenuLayer.style.width = "100%";
     MenuLayer.style.height = "100vh";
     MenuLayer.style.zIndex = "99999";
     MenuLayer.style.backgroundColor = "rgba(0,0,0,.75)";
     MenuTitle.style.display = "none";
     MenuTitle.style.width = "7%";
     MenuTitle.style.color = "white";
     MenuTitle.style.margin = "65px";
     MenuTitle.style.fontSize = "35px";
     MenuTitle.style.borderLeft = "thick solid #0000FF";
     MenuTitle.style.paddingLeft = "25px";
     divlo.onmouseover = function () {
     MenuLayer.style.display = "block";
     divlo.style.display = "none";
     MenuTitle.style.display = "block";
     };
     MenuTitle.onclick = function () {
     MenuLayer.style.display = "none";
     divlo.style.display = "block";
     };
/*Menu content and style*/
     $("#MenuLayer").append('<div id="MenuPanel"></div>');
     let MenuPanel = document.getElementById("MenuPanel");
     MenuPanel.style.position = "absolute";
     MenuPanel.style.width = "40%";
     MenuPanel.style.left = "30%";
     MenuPanel.style.top = "100px";
     MenuPanel.style.height = "600px";
     MenuPanel.style.color = "#666";
     MenuPanel.style.backgroundColor = "#212121";
/*Setting up the menu selection*/
    $("#MenuPanel").append('<div id="Account"><center>Account</center></div>');
    let Account = document.getElementById("Account");
    Account.style.borderLeft = "thick solid #0000FF";
    Account.style.margin = "50px";
    Account.style.fontSize = "32px";
    Account.style.paddingLeft = "7.5px";
    Account.style.fontWeight = "700";
    Account.style.transition = "1s";
    Account.style.width = "0px";
    Account.onmouseover = function () {
        Account.style.backgroundColor = "#0000FF";
        Account.style.color = "white";
        Account.style.opacity = ".55";
        Account.style.width = "140px";
    };
    Account.onmouseout = function () {
        Account.style.backgroundColor = "";
        Account.style.color = "#666";
        Account.style.width = "0px";
    };
/**/
    $("#MenuPanel").append('<div id="Hats"><center>Hats<center></div>');
    let Hats = document.getElementById("Hats");
    Hats.style.borderLeft = "thick solid #0000FF";
    Hats.style.margin = "50px";
    Hats.style.fontSize = "32px";
    Hats.style.paddingLeft = "7.5px";
    Hats.style.fontWeight = "700";
    Hats.style.transition = "1s";
    Hats.style.width = "0px";
    Hats.onmouseover = function () {
        Hats.style.backgroundColor = "#0000FF";
        Hats.style.color = "white";
        Hats.style.opacity = ".55";
        Hats.style.width = "140px";
    };
    Hats.onmouseout = function () {
        Hats.style.backgroundColor = "";
        Hats.style.color = "#666";
        Hats.style.width = "0px";
    };
/*Creating the Account Tab*/
    $("#MenuLayer").append('<div id="AccountTab"><center><p id="AccountTitle">Account</p></center></div>');
        let AccountTab = document.getElementById("AccountTab");
        AccountTab.style.position = "absolute";
        AccountTab.style.display = "none";
        AccountTab.style.width = "40%";
        AccountTab.style.left = "30%";
        AccountTab.style.top = "100px";
        AccountTab.style.height = "600px";
        AccountTab.style.color = "#666";
        AccountTab.style.backgroundColor = "#212121";
        let AccountTitle = document.getElementById("AccountTitle");
        AccountTitle.style.color = "red";
        AccountTitle.style.fontSize = "30px";
        $("#AccountTab").prepend('<p id="AccountExit">Exit</p>');
        let AccountExit = document.getElementById("AccountExit");
        AccountExit.style.fontSize = "20px";
        AccountExit.style.marginLeft = "10px";
        AccountExit.style.marginTop = "10px";
/*Creating the Account Tab opening and closing function*/
    Account.onclick = function () {
        AccountTab.style.display = "block";
    };
    AccountExit.onclick = function () {
        AccountTab.style.display = "none";
    };
/*Creating the Hats Tab*/
    $("#MenuLayer").append('<div id="HatsTab"><center><p id="HatTitle">Hats</p></center></div>');
        let HatsTab = document.getElementById("HatsTab");
        HatsTab.style.display = "none";
        HatsTab.style.position = "absolute";
        HatsTab.style.width = "40%";
        HatsTab.style.left = "30%";
        HatsTab.style.top = "100px";
        HatsTab.style.height = "600px";
        HatsTab.style.color = "#666";
        HatsTab.style.backgroundColor = "#212121";
        let HatTitle = document.getElementById("HatTitle");
        HatTitle.style.color = "red";
        $("#HatsTab").prepend('<p id="HatsExit">Exit</p>');
            let HatsExit = document.getElementById("HatsExit");
            HatsExit.style.fontSize = "20px";
            HatsExit.style.marginLeft = "10px";
            HatsExit.style.marginTop = "10px";
/*Creating the Hats Tab opening and closing function*/
    Hats.onclick = function () {
        HatsTab.style.display = "block";
    };
    HatsExit.onclick = function () {
        HatsTab.style.display = "none";
    };
/*Creating the Account content*/
    function AccountLoader() {
        /*Profile Image: ProfileImage*/
        /*Profile Name: ProfileName*/
        $("#AccountTab").append('<img id="ProfileImageS" src=""/>');
        let ProfileImageS = document.getElementById("ProfileImageS");
        ProfileImageS.src = ProfileImage;
        ProfileImageS.style.width = "120px";
        ProfileImageS.style.marginLeft = "25px";
        ProfileImageS.style.height = "auto";
        ProfileImageS.style.borderRadius = "100px";
        ProfileImageS.style.display = "inline-block";
        $("#AccountTab").append('<p id="ProfileName"></p><div id="StatsBtn" type="button">Show Stats</div>');
        let ProfileNameS = document.getElementById("ProfileName");
        let StatsBtn = document.getElementById("StatsBtn");
        ProfileNameS.innerHTML = UserName;
        ProfileNameS.style.display = "inline-block";
        ProfileNameS.style.marginLeft = "20px";
        ProfileNameS.style.verticalAlign = "top";
        StatsBtn.style.width = "110px";
        StatsBtn.style.height = "40px";
        StatsBtn.style.borderLeft = "thick solid #0000FF";
        StatsBtn.style.paddingLeft = "10px";
        StatsBtn.style.marginLeft = "20px";
        StatsBtn.style.marginTop = "20px";
        StatsBtn.style.backgroundColor = "";
        StatsBtn.style.lineHeight = "40px";
        StatsBtn.style.fontSize = "20px";
        StatsBtn.style.color = "white";
        StatsBtn.onmouseover = function () {
            StatsBtn.style.borderLeft = "thick solid rgb(22, 96, 160)";
        };
        StatsBtn.onmouseout = function () {
            StatsBtn.style.borderLeft = "thick solid #0000FF";
        };
        StatsBtn.onclick = function () {
            AccountTab.style.display = "none";
            MenuLayer.style.display = "none";
            divlo.style.display = "block";
            swal('Your current stats are:\nlvl: ' + LvL + '\n' + Xp + '\nCoins: ' + CoinCount);
        };
        $("#AccountTab").append('<div id="ChangeSkinBtn" type="button">Change your skin</div>');
        let ChangeSkinBtn = document.getElementById("ChangeSkinBtn");
        ChangeSkinBtn.style.width = "200px";
        ChangeSkinBtn.style.height = "40px";
        ChangeSkinBtn.style.borderLeft = "thick solid #0000FF";
        ChangeSkinBtn.style.paddingLeft = "10px";
        ChangeSkinBtn.style.marginLeft = "20px";
        ChangeSkinBtn.style.marginTop = "20px";
        ChangeSkinBtn.style.backgroundColor = "";
        ChangeSkinBtn.style.lineHeight = "40px";
        ChangeSkinBtn.style.fontSize = "20px";
        ChangeSkinBtn.style.color = "white";
        ChangeSkinBtn.style.display = "inline-block";
        ChangeSkinBtn.onmouseover = function () {
            ChangeSkinBtn.style.borderLeft = "thick solid rgb(22, 96, 160)";
        };
        ChangeSkinBtn.onmouseout = function () {
            ChangeSkinBtn.style.borderLeft = "thick solid #0000FF";
        };
        $("#AccountTab").append('<input id="skinUrlInput" type="text" placeholder="Url goes here..."/><div id="UrlChangeBtn">Change</div>');
        let skinUrlInput = document.getElementById("skinUrlInput");
        let UrlChangeBtn = document.getElementById("UrlChangeBtn");
        skinUrlInput.style.display = "none";
        UrlChangeBtn.style.display = "none";
        UrlChangeBtn.style.borderLeft = "thick solid #0000FF";
        UrlChangeBtn.style.marginLeft = "20px";
        UrlChangeBtn.style.paddingLeft = "10px";
        UrlChangeBtn.style.fontSize = "20px";
        UrlChangeBtn.style.fontWeight = "600";
        ChangeSkinBtn.onclick = function () {
            skinUrlInput.style.display = "inline-block";
            UrlChangeBtn.style.display = "inline-block";
        };
        UrlChangeBtn.onclick = function () {
            let skinUrl = document.getElementById("skinUrlInput").value;
            if(skinUrl != "") {
                document.getElementById("skinurl").style.blur = "";
                document.getElementById("skinurl").value = skinUrl;
                document.getElementById("profilepic").src = skinUrl;
                skinUrlInput.style.display = "none";
                UrlChangeBtn.style.display = "none";
                AccountTab.style.display = "none";
                MenuLayer.style.display = "none";
                divlo.style.display = "block";
            }
        };
    }