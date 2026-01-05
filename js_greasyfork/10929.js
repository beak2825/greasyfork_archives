// ==UserScript==
// @name           AwfulPeople
// @namespace      https://bifrost.me
// @version        1.2
// @description    Tagging users on the Something Awful forums
// @icon           https://i.imgur.com/umzk8d9.png
// @include        https://forums.somethingawful.com/showthread.php*
// @grant          GM_addStyle
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10929/AwfulPeople.user.js
// @updateURL https://update.greasyfork.org/scripts/10929/AwfulPeople.meta.js
// ==/UserScript==

var names, labels;

//Dummy labels to populate localstorage on first run
if(localStorage.getItem('apFirstRun') != '1') {
    names = ["MonsterDunk"];
    labels = ["Jeff Gerstmann"];

    localStorage.setItem('names',JSON.stringify(names));
    localStorage.setItem('labels',JSON.stringify(labels));
    localStorage.setItem('apFirstRun','1');
}

if(localStorage.getItem('apFirstRun') == '1') {
    names = JSON.parse(localStorage.getItem('names'));
    labels = JSON.parse(localStorage.getItem('labels'));
}

$(window).on('load', function(){
    GM_addStyle('span.apLabel {color: green; background: black;} ' +
            '.apBtn {cursor: pointer; width: 12px;} ' +
            '.bbc-block blockquote {color: black;}');

    //Counter for which user's post each button is attached to
    var u = 0;

    var usrBtns = $('.postdate');

    $('.author ').each(function(){
        var poster = $(this).text();

        var labelBtn = document.createElement("img");
        genBtn(labelBtn);

        $(labelBtn).appendTo(usrBtns[u]);
        u = u + 1;

        for (var i in names) {
            if (names[i] == poster){
                $('<span class="apLabel">' + labels[i] + '</span>').insertAfter(this);
            }
        }
    });

    function genBtn(btnElement) {
        btnElement.setAttribute('src', 'https://i.imgur.com/umzk8d9.png');
        btnElement.setAttribute('class','apBtn');
        btnElement.setAttribute('title', 'Add user label');
        btnElement.setAttribute('id','ap' + u);
        btnElement.addEventListener('click', addLabel, false);
    }

    function addLabel() {
        //Get user that you're labeling (this is probably terrible)
        var user = $('.author').eq($(this).attr('id').slice(2));
        var userName = user.text();
        var newLabel = prompt("Enter label for " + userName + ": (OK with no text to delete existing)");

        if(newLabel !== null) {
            replaceLabel(userName);

            //Add new name/label pair and update localstorage
            if(newLabel !== "") {
                names.push(userName);
                labels.push(newLabel);
            }
            localStorage.setItem('names',JSON.stringify(names));
            localStorage.setItem('labels',JSON.stringify(labels));

            //Remove any old label and add new
            $(user).siblings('.apLabel').remove();
            $('<span class="apLabel">' + newLabel + '</span>').insertAfter(user);
        }
    }

    function replaceLabel(poster) {
        for (let i = 0; i < names.length; i++) {
            if (names[i] == poster) {
                names.splice(i,1);
                labels.splice(i,1);
            }
        }
    }
});
