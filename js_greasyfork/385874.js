// ==UserScript==
// @name         Reddit - Advanced Remove
// @include      http*://*reddit.com/r/beermoney/comments/*
// @include      http*://*reddit.com/user/Mikazah/comments/*
// @include      http*://*reddit.com/message/*
// @grant        none
// @description  Makes things easier for moderators on reddit when removing things and notifies users of removal.
// @version 0.0.1.20190613022735
// @namespace https://greasyfork.org/users/309333
// @downloadURL https://update.greasyfork.org/scripts/385874/Reddit%20-%20Advanced%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/385874/Reddit%20-%20Advanced%20Remove.meta.js
// ==/UserScript==
// Current known problems:
//     1. The event listener on the remove link is removed regardless if the user hits the done button or not. It seems to be from reddit changing things.
//     2. Marking as spam doesn't remove it as spam. This functionality simply isn't implemented.
//     3. Missing buttons for /r/WorkOnline /r/beermoneyglobal /r/slavelabour etc.
//     4. Auto select age if account too new.
//     5. Half sec delay running automod. Something screwy is happening if I don't wait. Whichever remove is second doesn't fire.
//     6. Distinguish comment after making it.


(function() {
// If you would like to add a text box, follow the formatting ["What the button will say.", "What you want the comment to say."],
//                                    This formatting is:     [" ", " "],
// If you need to put a quote in, copy and paste these to use: “ ”
// All of reddit's formatting works as you would expect, except for enter lines. If you need an enter line, use \n.
//    For example: Hello\n\nI'm Joe.
//    Will show up like:
//        Hello
//
//        I'm Joe.

    // additionalReasons are only for the box that appears when hitting the report button. These are reasons that are needed for comments, but not necessarily for posts.
    var additionalReasons = [
                             ["Ref Hijacking", "Referral train hijacking is strictly prohibited. If you didn't sign up under the OP, don't be an asshole and steal someone else's place on the train. This includes posting your ref link when OP didn't post one."],
                             ["Asshole", "**Don't be an asshole.** This includes telling people to get a \"real job\" or to prostitute themselves."],
                             ["Vet GPT", "Newer GPT sites must be vetted by a mod or a user with flair prior to being posted. This is due to an increasing number of scammers."],
                         ];

    // removeReasons show up on all report areas. This includes the top and bottom buttons and the popup report box.
    var removeReasons = [
                         ["Sticky", "READ THE MAIN STICKY [“Most Common Beer Money Sites”.](https://www.reddit.com/r/beermoney/comments/ab0dyv/most_common_beer_money_sites_do_not_create/) Referral links/codes to these sites are not permitted. This includes new posts, comments, and asking people to pm you for one."],
                         ["FAQ", "[This question or concern is answered in our FAQ.](https://www.reddit.com/r/beermoney/wiki/index)"],
                         ["Non-Ref", "When posting a referral link/code, you must include a **CLICKABLE** non-referral link **right next to each referral link/code**. Each referral link may only be mentioned once per post/comment."],
                         ["More Info", "**Don’t just submit a referral link/code.** Make an informative post/comment, with information such as minimum payouts, payout options, type of work, etc. Be transparent about the average expected income, and how much of your income comes from referrals. Include the name of the site in the title of your post. Add flairs for countries. Showing proof of payment is encouraged. Don’t offer to pay people to sign up under your referral link."],
                         ["Not New", "Don’t resubmit ANY websites that have already been posted in 2019 without new and useful information to share with the community. [Search before you submit to see if someone has already posted about it in 2019.](https://www.reddit.com/r/beermoney/search?q=&restrict_sr=on&include_over_18=on&sort=new&t=all)"],
                         ["Ref w/ ?", "You are not permitted to include a referral link/code when asking a question."],
                         ["Age", "Your reddit account MUST be at least ONE MONTH old and have a reasonable amount of activity to post/comment referral links/codes."],
                         ["ToS", "Don't discuss anything illegal, fraudulent, or against the ToS of any site. This includes discussing VPN, VPS, Emulators, compensated Amazon reviews, etc."],
                         ["Not BM", "[This is not a beermoney topic.](https://www.reddit.com/r/beermoney/wiki/index#wiki_what_is_and_isn.27t_beermoney)"],
                         ["Crypto", "Crypto stuff is only allowed in the appropriate megathread."],
                         ["Spam", "Don’t spam. This includes referral links and links to your previous posts/comments. Posting links to discords (other than our own), blogs or YouTube videos is not permitted. Include all of the information in your post/comment."],
                        ];

    // These are boxes for you to write your own text in. If you need another one, it would be better to ask for help. These require some additional setting up to get them to work right.
    var textReasons = ["Search", "Other"]; // These are for text boxes

    var accessRequiredArray = document.getElementsByClassName('access-required');
    var chkBoxesAndLabels = CreateRemoveReasons(removeReasons, additionalReasons); // [ Chkboxes, LabelNodes[] ]
    var morecomments = document.getElementsByClassName('morecomments');
    var removeButtons = document.getElementsByClassName('removeButtons');
    var removeTextbox = document.getElementsByClassName('removeTextbox');


    ApplyStyling();

    var cNode = document.getElementById('siteTable');
    var pNode = document.getElementById('siteTable').parentElement;

    for(var e = 0; e < chkBoxesAndLabels[0].length; e++){
        pNode.parentNode.insertBefore(chkBoxesAndLabels[0][e], pNode);
    }
    pNode.insertBefore(chkBoxesAndLabels[1][1], cNode);
    cNode.parentNode.insertBefore(chkBoxesAndLabels[1][2], cNode.nextSibling);

    AddEventListeners();




//  Pre: The UI is generated
//  Post: Necessary event listeners are added.
//        Note: the popup listeners are down under CreatePopupRemoveReasons due to them being dynamically generated.
    function AddEventListeners(){
        var ckbox = document.getElementsByClassName('removeCheckboxes');
        var removeButtonsPopup = document.getElementsByClassName('removeButtonsPopup');

        for(var n = 0; n < removeButtons.length; n++){
            removeButtons[n].addEventListener('click', PostComment);
        }

        for(var n2 = 0; n2 < removeTextbox.length; n2++){
            removeTextbox[n2].addEventListener('blur', KeepTextboxesSame);
        }

        function AddRemoveLinkListeners() {
            morecomments = document.getElementsByClassName('morecomments');
            accessRequiredArray = document.getElementsByClassName('access-required');

            for(var n3 = 0; n3 < accessRequiredArray.length; n3++){
                var accessRequiredAttribute = accessRequiredArray[n3].getAttribute('onclick');
                if(accessRequiredArray){
                    if(accessRequiredArray[n3].innerHTML.indexOf('remove') >= 0){
                        accessRequiredArray[n3].addEventListener('click', CreatePopupRemoveReasons);
                    }
                }
            }
        }
        AddRemoveLinkListeners();

        for(var n4 = 0; n4 < morecomments.length; n4++){
            morecomments[n4].addEventListener('click', function(event){
                event.target.parentElement.parentElement.parentElement.parentElement.addEventListener('DOMSubtreeModified', AddRemoveLinkListeners);
            });
        }
    }




//  Pre: reportReasons and additionalReasons have been set.
//  Post: Return the styling string in <style> brackets.
    function ApplyStyling(){
        var styleNode = document.createElement('style');
        var styling = '.removeCheckboxes { display: none; }' +
            '.removeReasons label { background-color: #f5fff5; border-radius: 2px; padding: 2px; }';


        for(var s = 0; s < removeReasons.length + additionalReasons.length; s++){
            if(s > 0){
                styling += ', ';
            }
            styling += '#removeReason' + s + ':checked ~ .content .removeReasons label[for=removeReason' + s + ']';
        }
        styling += `, .checkedCheckbox{
                    background-color: #acffb1;
                    color: #000;
                    }
                    .removeLabel1 {
                    background-color: #fff;
                    border: 2px solid #404040;
                    position: absolute;
                    white-space: normal;
                    width: 200px;
                    }
                    .removeLabel1 button.removeButtons {
                    margin-top: 2px;
                    width: 100%;
                    }
                    .removeLabel1 input.removeTextbox {
                    margin-top: 2px;
                    width: 198px;
                    }
                    .removeLabel1 label {
                    border-radius: 0px;
                    display: inline-block;
                    width: 47%;
                    }
                    .removeButtonsPopup {
                    width: 50%;
                    }`;

        styleNode.type = 'text/css';
        styleNode.appendChild(document.createTextNode(styling));
        document.getElementsByTagName("head")[0].appendChild(styleNode);
    }




//  Pre: The UI has been created and the user has pressed a remove button
//  Post: A floating popup is added to where the remove button was pressed
    function CreatePopupRemoveReasons(event){
        var chkBoxes = document.querySelectorAll('.removeCheckboxes:checked');

        for(var cb = 0; cb < chkBoxes.length; cb++){
            chkBoxes[cb].checked = false;
        }

        event.target.parentElement.parentElement.append(chkBoxesAndLabels[1][0]);
        document.getElementsByClassName('removeButtonsPopup')[1].addEventListener('click', function(event){
            event.target.parentElement.style.display = 'inline-block';
            PostComment(event);
        });
        document.getElementById('cancelPopup').addEventListener('click', function(event){
            event.target.parentElement.style.display = 'none';
        });
    }




//  Pre: reportReasons and additionalReasons have been set.
//  Post: Returns a string of checkboxes and an array of three similar label groups inside of a div.
    function CreateRemoveReasons(removeReasons, additionalReasons){
        var checkboxes = new Array();
        var labels = '';
        var labelsDivLength = removeReasons.length;
        var optionsDiv = new Array();
        var textBoxes = '';

        var iNode;
        for(var i = 0; i < removeReasons.length; i++) {
            iNode = document.createElement('input');
            iNode.type = 'checkbox';
            iNode.className = 'removeCheckboxes';
            iNode.name = 'removeReason' + i.toString();
            iNode.id = 'removeReason' + i.toString();
            iNode.value = removeReasons[i][0];

            checkboxes.push(iNode);

//            checkboxes += '<input type="checkbox" class="removeCheckboxes" name="removeReason' + i.toString() + '" id="removeReason' + i.toString() + '" value="' + removeReasons[i][0] + '">';
            labels += '<label for="removeReason' + i.toString() + '">' + removeReasons[i][0] + '</label> ';
        }

        for(var i2 = 0; i2 < additionalReasons.length; i2++) {
            var pos = i2 + labelsDivLength;
            iNode = document.createElement('input');
            iNode.type = 'checkbox';
            iNode.className = 'removeCheckboxes';
            iNode.name = 'removeReason' + pos.toString();
            iNode.id = 'removeReason' + pos.toString();
            iNode.value = additionalReasons[i2][0];

            checkboxes.push(iNode);

//            checkboxes += '<input type="checkbox" class="removeCheckboxes" name="removeReason' + (labelsDivLength + i2).toString() + '" id="removeReason' + (labelsDivLength + i2).toString() + '" value="' + additionalReasons[i2][0] + '">';
            labels += '<label for="removeReason' + (labelsDivLength + i2).toString() + '" " class="removeReason' + (labelsDivLength + i2).toString() + '">' + additionalReasons[i2][0] + '</label> ';
        }

        for(var i3 = 0; i3 < textReasons.length; i3++){
            textBoxes += '<input type="text" class="removeTextbox" name="removeReasonText' + textReasons[i3] + '" placeholder="' + textReasons[i3] + '">';
        }

        var i4Node = document.createElement('div');
        i4Node.className = 'removeLabel1 removeReasons';
        i4Node.innerHTML = labels + textBoxes + '<button type="button" id="cancelPopup" class="removeButtonsPopup">Cancel</button>' + '<button type="button" id="confirmPopup" class="removeButtonsPopup">Done</button>';

        optionsDiv.push(i4Node);

        var i5Node;
        for(var i5 = 1; i5 <= 2; i5++) {
            i5Node = document.createElement('div');
            i5Node.idName = 'removeLabel' + (i5+1).toString();
            i5Node.className = 'removeReasons';
            i5Node.innerHTML = labels + textBoxes + '<button type="button" class="removeButtons removeFlatButtons">Done</button></div>';

            optionsDiv.push(i5Node);
        }

        return [checkboxes, optionsDiv];
    }




//  Pre: All of the UI Elements have been made. The eventListener is in place. The user has pressed the button indicating that they are ready to proceed. Checkboxes ids must end in a unique number.
//  Post: The stickied automod post is removed, if applicable. A comment is made using the indicated report reasons. The comment is stickied. The button eventlisteners are removed.
    function PostComment(event){
        var premsg = '#Your post/comment was removed for the following reason(s):\n\n----\n\n';
        var endmsg = '&nbsp;\n\n##[Please review the full list of rules.](/r/beermoney/wiki/rules)\n' +
            '####*Users who repeatedly break our rules will be permanently banned.*';

        var chkBoxes = document.querySelectorAll('.removeCheckboxes:checked');
        var txtBoxes = document.getElementsByClassName('removeTextbox');

        if(chkBoxes.length > 0 || textReasons.length > 0){
            var message = '';
            var num;

            for(var q = 0; q < chkBoxes.length; q++){
                num = parseInt(chkBoxes[q].id.substr(12, chkBoxes[q].id.length));    // Get the last character of the checked box id and turn it into an int.

                if(num < removeReasons.length){
                    message += removeReasons[num][1];
                }
                else {
                    message += additionalReasons[num-removeReasons.length][1];
                }
                message += '\n\n----\n\n';
            }

            for(var r = 0; r < textReasons.length; r++){
                if(txtBoxes[r].value !== ''){
                    switch(textReasons[r]) {
                        case "Search":
                            var searchTerm = document.getElementsByName('removeReasonTextSearch')[0].value.replace(/\s+/g, '+');
                            var searchURL = 'https://www.reddit.com/r/beermoney/search?q=' + searchTerm + '&restrict_sr=on&include_over_18=on&sort=new&t=all'
                            message += '[Your answer can be found by searching.](' + searchURL + ')';
                            break;
                        case "Other":
                            message += document.getElementsByName('removeReasonTextOther')[0].value;
                            break;
                    }
                    message += '\n\n----\n\n';
                }
            }

            if(event.target.classList.contains('removeFlatButtons') || event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id == 'siteTable'){
                for(var p = 0; p < removeButtons.length; p++){
                    removeButtons[p].removeEventListener('click', PostComment);
                }

                ClickOption(document.getElementById('siteTable').getElementsByClassName("yes"), 'remove');
                ClickOption(document.getElementById('siteTable').getElementsByClassName("yes"), 'lock');
                ClickOption(document.getElementById('siteTable').getElementsByClassName("big-mod-buttons"), 'remove');

                setTimeout(function() {
                    if(message !== ''){
                        document.getElementsByClassName('commentarea')[0].getElementsByTagName('textarea')[0].value = premsg + message + endmsg;
                        document.getElementsByClassName('commentarea')[0].getElementsByClassName('usertext-buttons')[0].getElementsByTagName('button')[0].click();
                    }

                    RemoveAutoMod();
                }, 400);

            }
            else if (event.target.id == 'confirmPopup'){
                document.getElementsByClassName('removeButtonsPopup')[1].removeEventListener('click', PostComment);
                if(message !== ''){
                    var classArray = document.getElementsByClassName('removeButtonsPopup')[0].parentElement.parentElement.parentElement.parentElement.getElementsByClassName("access-required");
                    for(var k = 0; k < classArray.length; k++){
                        if(classArray[k].parentElement.innerHTML.indexOf('data-event-action="' + 'comment') >= 0){
                            var p4 = classArray[k].parentElement.parentElement.parentElement.parentElement.getElementsByClassName('child')[0];

                            classArray[k].click();

                            p4.getElementsByTagName('textarea')[0].value = premsg + message + endmsg;
                            p4.getElementsByClassName('usertext-buttons')[0].getElementsByTagName('button')[0].click();
                        }
                    }
                }
                ClickOption(document.getElementsByClassName('removeButtonsPopup')[0].parentElement.parentElement.getElementsByClassName("yes"), 'remove');
            }
            else {
                event.target.addEventListener('click', PostComment);
            }
        }
    }




//  Pre: UI is generated and user has typed into one of the textboxes.
//  Post: All textboxes with the same name are given the same value.
    function KeepTextboxesSame(){
        var textboxesByName = document.getElementsByName(this.getAttribute('name'));
        for(var s = 0; s < textboxesByName.length; s++){
            textboxesByName[s].value = this.value;
        }
    }




//  Pre: The necessary array has been filled and the search term is defined.
//  Post: Clicks on the box.
//        Note: This only works on the options with a "yes" confirmation. I thought I had it working for everything, but it doesn't seem to be the case. Pulled from the unlock and remove script.
    function ClickOption(classArray, searchTerm){
        for(var j = 0; j < classArray.length; j++){
            var classElementAttribute = classArray[j].getAttribute('onclick');
            if(classElementAttribute){
                if(classElementAttribute.includes(searchTerm)){
                    if(classArray[j].parentElement.parentElement.innerHTML.indexOf('data-event-action="' + searchTerm) >= 0){
                        classArray[j].click();
                    }
                }
            }

            // Possibly might cause issues with removed comments... Maybe.
            else {
                var classArrayAs = classArray[0].getElementsByTagName("a");
                for(var j2 = 0; j2 < classArrayAs.length; j2++){
                    if(classArrayAs[j2].innerHTML.indexOf(searchTerm) >= 0){
                        classArrayAs[j2].click();
                    }
                }
            }
        }
    }




//  Pre: The UI is set. The user has selected the reasons (or no reasons) and has hit the Done button.
//  Post: The stickied automoderator comment will be removed.
    function RemoveAutoMod() {
        var stickiedPosts = document.getElementsByClassName("stickied comment");

        for(var k = 0; k < stickiedPosts.length; k++){
            var authors = stickiedPosts[k].getElementsByClassName("author");

            for(var l = 0; l < authors.length; l++){
                if(authors[l].innerHTML.indexOf("AutoModerator") >= 0){
                    ClickOption(stickiedPosts[k].getElementsByClassName("yes"), "remove");
                }
            }
        }
    }
})();