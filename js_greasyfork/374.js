// ==UserScript==
// @name        Twitch Plays Pokemon - Command Filtering & Spamming Tool
// @namespace   butt
// @description Adds tools to your chatbox for spamming chat and filtering out commands from chat.
// @include     http://www.twitch.tv/twitchplayspokemon
// @include     http://beta.twitch.tv/twitchplayspokemon
// @include     http://www.twitch.tv/twitchplayspokemon/chat?popout=&secret=safe
// @include     http://beta.twitch.tv/twitchplayspokemon/chat?popout=&secret=safe
// @version     1.12
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/374/Twitch%20Plays%20Pokemon%20-%20Command%20Filtering%20%20Spamming%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/374/Twitch%20Plays%20Pokemon%20-%20Command%20Filtering%20%20Spamming%20Tool.meta.js
// ==/UserScript==

function tppmain() {
var $ = window.$;

function setUpTheShit(){
    var spamhandle;
    var counterHandle;
    
    var autoSpam = true;
    var slowMode = true;
    var autoInterval = 30; //starting interval between spams
    var fastInterval = 6; //Guess at minimum interval that won't get you b&
    //var randomInterval = 30; //a random value up to this will be added to each timer
    var lastSpamTime = 0;
    var lastLastSpamTime = 0;
    var timeConfirmedSlow = timeSecs();
    var tryTime = 100; //seconds to wait before testing whether the room's slow again
    var timeBuffer = 2; //seconds to add to intervals, to avoid sending too fast

    var stretchLetters = "aeioufjlmnrswy"; //Letters that can be randomly stretched
    var maxStretch = 12; //maximum extra letters to add
    
    var tooFastRegex = /This room is in slow mode and you are sending messages too quickly\. You will be able to talk again in (\d+) seconds\./;
    var genericTooFastRegex = /Your message was not sent because you are sending messages too quickly\./;
    var identicalRegex = /Your message was not sent because it is identical to the previous one you sent, less than (\d+) seconds ago\./;
    var slowModeRegex = /This room is now in slow mode\. You may send messages every (\d+) seconds/;
    var r9kRegex = /This room is in r9k mode and the message you attempted to send is not unique\.\sSee http:\/\/bit\.ly\/bGtBDf for more details\./;
    var bannedRegex = /You are banned from talking in twitchplayspokemon for (\d+) more seconds./;
    var inputRegex = /^((up|down|left|right|a|b|start|select|anarchy|democracy|wait|l|r|(\d+,\d+)|(!bet.+)?)(\+)?)+$/i;
    
    // Add buttons and shit
    $(".chat-interface").append('<div id="muh-controls" style="position:absolute;top:115px;padding:5px;"><label style="display:inline" for="dubs">Filter Inputs </label><input type="checkbox" id="dubs" checked><label style="display:inline" for="randomize"> Randomize Spam </label><input type="checkbox" id="randomize" checked><div><label for="spam-radio" style="display:inline">Spam: </label> <input type="radio" id="spam-radio" name="spam-radio" value="manual" title="Set spam intervals manually.">Manual  <input type="radio" name="spam-radio" value="auto" title="Auto mode parses the chat to determine optimal intervals automatically.">Auto  <input type="radio" name="spam-radio" value="none" checked title="Disable spamming.">  None </div><div><label for="spam-text" style="display:inline">Text </label><input type="text" id="spam-text" value="guys we need to beat misty"></div><div><label for="spam-interval" style="display:inline">Interval(secs) </label><input type="text" id="spam-interval" value="32" style="width:50px"><span id="spam-counter"></span><span id="spam-notice" style="color:green"> You spammed!</span></div></div>');
    $(".chat-interface").css("bottom", "80px");

    // FILTERING
    var showAll = false;
    $("#dubs").click( function() {
        showAll = !showAll;
    } );

    function randomChecked() {
        return ( $("#randomize:checked").size() > 0 ); 
    }
    
    amShit = function (str) {
        return str.match(inputRegex);
    };
    var addMessage = App.Room.prototype.addMessage;
    
    window.adminMsgs = new Array();
    App.Room.prototype.addMessage = function (anus) {
        if (showAll || !amShit($.trim(anus.message.toLowerCase()))) {
            addMessage.call(this, anus);
        } 
        if(anus.style === "admin") {
            window.adminMsgs.push(anus);
            //console.log(anus.message);
            handleAdminMsg(anus);
        }
    };
    
    handleAdminMsg = function(msg) {
        var tooFastBy, slowModeTime, identicalTime;

        //Only read admin messages in auto-spam mode
        if(!autoSpam) return;

        //Catch if we posted too fast
        if( (tooFastBy = tooFastRegex.exec(msg.message)) !== null ) {
            tooFastBy = parseInt(tooFastBy[1]);
            //Post again after time
            spamIn(tooFastBy);
            tooFastTime = lastSpamTime - lastLastSpamTime;
            enterSlowMode(tooFastTime + tooFastBy);
            console.log("Too fast by " + tooFastBy);
        }
        else if(msg.message.match(genericTooFastRegex)) {
            setAutoInterval(autoInterval * 2);
            console.log("Generically too fast!");
        }
        else if(msg.message.match(r9kRegex)) {
            if( randomChecked() ) {
                spamIn(1);
            }
            console.log("r9k-blocked");
        }
        else if( (identicalTime = identicalRegex.exec(msg.message)) !== null) {
            //Does this mean we're in slow mode? Let's assume yes.
            identicalTime = parseInt(identicalTime[1]);
            tooFastTime = lastSpamTime - lastLastSpamTime;
            canSpamIn = identicalTime - tooFastTime;
            spamIn(canSpamIn);
            if( !randomChecked() ) {
                enterSlowMode(identicalTime); //If input not randomized, gotta slow down
            }
            console.log("Identical message! Time:"+identicalTime+". Only waited: "+tooFastTime+". Resend in " + canSpamIn); //30-0-30??
        }
        else if( (slowModeTime = slowModeRegex.exec(msg.message)) !== null) {
            slowModeTime = parseInt(slowModeTime[1]);
            //Update auto-timer
            enterSlowMode(slowModeTime);
            console.log("Entered slow mode!");
        }
        else if( (bannedTime = bannedRegex.exec(msg.message)) !== null) {
            bannedTime = parseInt(bannedTime[1]);
            //Try not spamming so fast
            if(autoInterval == fastInterval) {
                fastInterval += 3;
                console.log("Increasing fast interval to "+fastInterval);
            }
            spamIn(bannedTime);
            enterSlowMode(30);
            console.log("b& for " + bannedTime);
        }
        else {
            console.log(msg.message);
        }
    }
    
    enterSlowMode = function(time) {
        if(time > fastInterval){
            slowMode = true;
            setAutoInterval(time);
        }
        else {
            setAutoInterval(fastInterval);
        }
        timeConfirmedSlow = timeSecs();
    }

    function setAutoInterval(time) {
        time = Math.floor(time);
        autoInterval = time;
        if(autoSpam){
            $("input#spam-interval").val(time + timeBuffer);
        }
    }

    //Returns new spam interval in seconds
    decideInterval = function() {
        var timeSinceConfirmedSlow = (timeSecs() - timeConfirmedSlow);
        if(slowMode && timeSinceConfirmedSlow > tryTime) {
            console.log("Checking if still slow...");
            slowMode = false;
            setAutoInterval(fastInterval);
        }

        //Randomize interval
        //if(autoInterval == fastInterval) {
            //addToInterval = Math.floor( Math.random() * randomInterval );
            //return autoInterval + addToInterval;
        //}
        return autoInterval;
    }
        
    
    // SPAMMING
    $("#spam-notice").hide();
    
    function spam(){
        var textbox = $(".chat-interface .textarea-contain textarea");
        var old_shit = textbox.val();
        var text = $("#spam-text").val().toString(); 
        if( !amShit(text) && $("#randomize:checked").size() > 0) {
            text = randomize(text);
        }
        textbox.val(text); 
        
        textbox.focus().blur();
        $(".send-chat-button button")[0].click();
        lastLastSpamTime = lastSpamTime;
        lastSpamTime = timeSecs();
        
        $("#spam-notice").show();
        $("#spam-notice").fadeOut(3000);
        textbox.val(old_shit);
        
        var interval =  autoSpam ? decideInterval() : parseInt($("#spam-interval").val());
        spamIn(interval);
    }

    //randomly elongates vowels in string
    function randomize(str) {
        var indices = new Array();
        for(i=0; i < str.length; i++) {
            ch = str[i].toLowerCase();
            if (stretchLetters.indexOf(ch) != -1) {
                indices.push(i);
            }
        }
        if(indices.length == 0) return str;
        
        var indA = indices[Math.floor( Math.random() * indices.length )];
        var indB = indices[Math.floor( Math.random() * indices.length )];
        if(indB < indA) {temp = indA; indA = indB; indB = temp;} //B is the higher index
        var duplicateABy = Math.floor( Math.random() * (maxStretch) + 1);
        var extraStringA = str[indA].repeat(duplicateABy);
        var duplicateBBy = Math.floor( Math.random() * (maxStretch) + 1);
        var extraStringB = str[indB].repeat(duplicateBBy);
        if(indB == indA) extraStringB = "";
        return str.slice(0,indA) + extraStringA + str.slice(indA, indB) + extraStringB + str.slice(indB);
    }

    
    //sets timer to spam, in seconds
    function spamIn(interval) {
        if(autoSpam) interval += timeBuffer;
        interval = Math.floor(interval);
        clearTimeout(spamhandle);
        spamhandle = setTimeout(spam, interval * 1000);
        counter($("#spam-counter"), interval);
    }
    
    //Returns "manual", "auto", or "none" based on radio buttons
    function getSpamMode() {
        return $("input:radio[name=spam-radio]:checked").val();
    }
    
    $("input:radio[name=spam-radio]").change(function(){
        var timeSince = timeSecs() - lastSpamTime;

        if(getSpamMode() === "manual") {
            autoSpam = false;
            $("input#spam-interval").removeAttr("disabled");
            clearTimeout(spamhandle);
            var interval = parseInt($("#spam-interval").val());
            if(timeSince < interval) {
                spamIn(interval - timeSince);
            }
            else spam();
        }
        else if(getSpamMode() === "auto") {
            autoSpam = true;
            $("input#spam-interval").attr("disabled", "true");
            clearTimeout(spamhandle);
            setAutoInterval(autoInterval);
            if(timeSince < autoInterval) {
                spamIn(autoInterval - timeSince);
            }
            else spam();
        }
        else if(getSpamMode() === "none") {
            autoSpam = false;
            $("input#spam-interval").removeAttr("disabled");
            clearTimeout(spamhandle);
            clearTimeout(counterHandle);
            $("#spam-counter").hide();
        }
    });
    
    //sets counter, in seconds
    function counter($el, n) {
        $("#spam-counter").show();
        clearTimeout(counterHandle);
        (function loop() {
            $el.html(n);
            if (n--) {
                counterHandle = setTimeout(loop, 1000);
            }
        })();
    }

    function timeSecs() {
        var deito = new Date();
        return deito.getTime() / 1000;
    }
    
    //Need this for chrome
    String.prototype.repeat = function( num ) {
    	return new Array( num + 1 ).join( this );
	}
    
    $(window).resize();
}

function loopydoo (){
    if ( typeof($) == "function" && document.readyState == 'complete' && $("div.chat-interface").size() > 0 ) {
        setUpTheShit();
    }
    else {
        setTimeout(loopydoo, 500);
    }
}

loopydoo();

}

//Inject dat shit nigga aaawwww yiss
var script = document.createElement('script');
script.textContent = '(' + tppmain.toString() + ')();';
document.body.appendChild(script);
