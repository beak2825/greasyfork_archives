// ==UserScript==
// @name         9gag tagger
// @namespace    http://9gag.com
// @include      http://9gag.com/gag/*
// @version      0.5
// @changelog    Try and fool the censoring system.
// @description  Tag all the people!
// @author       flufflz
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/25232/9gag%20tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/25232/9gag%20tagger.meta.js
// ==/UserScript==

(function() {
    var savedTaglist = getSavedValues("tagList");
    var nextAntiCensor = getSavedValues("antiCensor");
    console.error(nextAntiCensor);
    if (!nextAntiCensor)
        nextAntiCensor = 0;

    // If no delete button exists it's not our post. Maybe we should allow it for other posts though?
    // Update: I'll allow this for now.
     $(window).load(function(){
    // if(document.getElementsByClassName("badge-item-delete hide")[0])
        //return;

    var oPopup, oPostButton, newElement;
    oPopup = '                                                              \
                <div id="gmPopupContainer">                                                   \
                    <form>                                                                    \
                        <input type="text" placeholder="Insert all names you wish to tag here. Separate them by an empty space. Example: flufflz name2 name3 name4" id="gmTextBox"> \
                                                                                              \
                        <p id="myNumberSum">&nbsp;</p>                                        \
                        <button id="gmStartTagBtn" type="button">Start tagging</button>  \
                        <button id="gmCloseDlgBtn" type="button">Cancel</button>         \
                    </form>                                                                   \
                </div>                                                                        \
            ';

    oPostButton = document.getElementsByClassName("cmnt-btn size-30 submit-comment badge-post-trigger")[0];
    if (oPostButton) {
        newElement = oPostButton.cloneNode(true);
        newElement.id = "tag_button";
        newElement.text = "Tag";
        newElement.onclick = function()
        {
            if(document.getElementById("gmPopupContainer"))
            {
                $("#gmPopupContainer").show();
                return;
            }

            $("body").append ( oPopup );

            if(savedTaglist)
               document.getElementById("gmTextBox").value = savedTaglist;

            //--- Use jQuery to activate the dialog buttons.
            $("#gmStartTagBtn").click ( function () {
                $("#gmPopupContainer").hide();
                var sNames = document.getElementById("gmTextBox").value.replace(/ +(?= )/g,'');
                saveValues("tagList", sNames);
                setTimeout(function() {
                    startTagging(sNames, nextAntiCensor);
                }, 500);
            } );

            $("#gmCloseDlgBtn").click ( function () {
                $("#gmPopupContainer").hide ();
            } );
        };
        oPostButton.parentNode.insertBefore(newElement, oPostButton.nextSibling);
    } else{ return; }
    });

    function startTagging(sNames, antiCensor) {
      // Actual name array. Replace my name with actual names and fill it as much as you like.
        this.aNames = [];
        this.aNames = sNames.split(" ");
        this.aNames = shuffle(this.aNames);

        // Remove duplicate @s
        for(var i = 0; i < this.aNames.length; ++i)
        {
            while(this.aNames[i].charAt(0) === '@')
                this.aNames[i] = this.aNames[i].slice(1);
        }

        // You don't need to touch anything down there. Just let it do it's magic.
        this.oTextBox = document.getElementsByClassName("post-text-area badge-post-textarea focus");
        this.oSubmitButton = document.getElementsByClassName("cmnt-btn size-30 submit-comment badge-post-trigger");
        this.iCommentsPresent = document.getElementsByClassName("comment-entry badge-comment").length;
        this.iCommentsPosted = 0;

        this.iFailedAttempts = 0;

        // The censor system detects us if we don't randomize things a bit. I'll try to explain as good as I can so you can extend this.
        // Example object:
        // {
        //      leading : "(",         // values here will be put -before- the name
        //      trailing: ")"          // values here will be put -after- the name
        // }
        // In this example we filled both, leading and trailing. This will lead to a combination of both. In this case the output would be "( @name )"
        
        this.aRandAdditions = [{leading : "(", trailing : ")"}, {leading : "[", trailing : "]"}, {leading : "{", trailing : "}"}, {leading : "Tag:"}, {leading : "Tagging:"}, {leading : "Tag"}, {leading : "Tagging"}, {leading : "Tag."}, {leading : "Tagging."}, {trailing : "tagged!"}, {trailing : "tagged"}];
        if(antiCensor > this.aRandAdditions.length)
            antiCensor = 0;
        this.antiCensor = antiCensor;
        createNewPost();
    }

    // We might trigger a spam filter if we use the same pattern every single time
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function createNewPost() {
        if(this.aNames.length > 0)
        {
            var that = this;
            var leading = "";
            var trailing = "";
            if(this.aRandAdditions[this.antiCensor].leading)
                leading = this.aRandAdditions[this.antiCensor].leading + " ";
            if(this.aRandAdditions[this.antiCensor].trailing)
                trailing = " " + this.aRandAdditions[this.antiCensor].trailing;
            
            this.sNextNames = leading + "@";
            for(var i = 0; i <= 2; ++i)
            {
                this.sNextNames = (this.sNextNames + this.aNames.pop() + trailing);
                if(this.aNames.length === 0 || i === 2)
                    break;
                this.sNextNames = (this.sNextNames + "\n" + leading + "@");
            }

            this.oTextBox[0].value = this.sNextNames;
            setTimeout(function() {
                that.oSubmitButton[0].click();
            }, 100);
            ++this.iCommentsPosted;
            setTimeout(function() {
                checkComments(that);
            }, 500);
        } else {
            console.error("this.antiCensor");
            saveValues("antiCensor", this.antiCensor + 1);
        }
    }

    function waitSomeMore(that) {
        setTimeout(function() {
            checkComments(that);
        }, 500);
    }

    function checkComments(that) {
        setTimeout(function() {
            if(that.iFailedAttempts > 20)
                throw new Error("Waited too long for new comment to appear. We most likely lost track of it for some reason.");

            if(document.getElementsByClassName("comment-entry badge-comment").length === (that.iCommentsPresent + that.iCommentsPosted))
            {
                that.iFailedAttempts = 0;
                createNewPost();
            } else {
                ++that.iFailedAttempts;
                waitSomeMore(that);
            }
        }, 200);
    }

    function getSavedValues(field) {
        return GM_getValue(field);
    }

    function saveValues(field, values) {
        return GM_setValue(field, values);
    }

    GM_addStyle ( "                                                 \
    #gmPopupContainer {                                         \
        position:               fixed;                          \
        top:                    30%;                            \
        left:                   20%;                            \
        padding:                2em;                            \
        background:             powderblue;                     \
        border:                 3px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        border:                 1px outset buttonface;          \
    }                                                           \
" );
})();