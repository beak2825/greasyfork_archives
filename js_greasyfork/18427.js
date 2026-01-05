// ==UserScript==
// @name         Reddit Robin Filter
// @namespace    http://kmcgurty.com
// @version      2.4
// @description  Filters comments. Works on usernames and messages.
// @author       Kmc - admin@kmcdeals.com
// @match        https://www.reddit.com/robin
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/18427/Reddit%20Robin%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/18427/Reddit%20Robin%20Filter.meta.js
// ==/UserScript==

//GM_deleteValue("filter_list");

//will click the grow button and type /count every 15 seconds (to prevent abandoning)
setInterval(function() {
    if($("#prevent-abandon")[0].checked){
        if($(".text-counter-input")[0].value == ""){
            $(".robin-chat--vote-continue").click();
            $(".text-counter-input")[0].value = "/count";
            $("input[type=submit]").click();
        }
    }
}, 15000);

//setup the default filter
var defaultFilter = ["voted to grow", "voted to stay", "voted to abandon"];
if (GM_getValue("filter_list") === undefined || typeof GM_getValue("filter_list") !== "object") GM_setValue("filter_list", defaultFilter);

//filtery things
function doFilter(div) {
    var filter = GM_getValue("filter_list");
    
    var messageDiv = $(div).find(".robin-message--message");
    var usernameDiv = messageDiv.parent().find(".robin--username");

    var silentDelete = $("#silent-delete")[0].checked;


    for (var i = 0; i < filter.length; i++) {
        var currentFilter = filter[i].toLowerCase();

        //messageDiv[0] is occasionally undefined?
        if (messageDiv[0] != undefined) {
            var message = messageDiv[0].innerHTML.toLowerCase();
            var matches = message.includes(currentFilter);

            if (matches) {
                deleteMessage(messageDiv, silentDelete);
            }
        }

        if(usernameDiv[0] != undefined){
            var username = usernameDiv[0].innerHTML.toLowerCase();
            var matches = username.includes(currentFilter);

            var silentDelete = $("#silent-delete")[0].checked;

            if (matches) {
                deleteMessage(messageDiv, silentDelete);
            }
        }
    }

    if (messageDiv[0] != undefined) {
        var message = messageDiv[0].innerHTML.toLowerCase();
        var isAscii = $("#remove-ascii")[0].checked && isAsciiArt(message);

        if (isAscii) {
            deleteMessage(messageDiv, silentDelete);
        }
    }
}

function parseURLs(messageDiv){
    var messageDiv = $(messageDiv).find(".robin-message--message")[0];

    if(messageDiv != undefined){
        var text = messageDiv.innerHTML;
        var parsedText = text.replace(/(\r\n|\r|\n)/g, '<br/>').replace(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi, "<a class='link' href='http://$3$4' target='_blank'>$3$4</a>");

        messageDiv.innerHTML = parsedText;
    }
}

function deleteMessage(messageDiv, silent){
    if(silent){
        messageDiv.parent().remove();
    } else {
        messageDiv.replaceWith(`
            <span class='deleted'>
                <a href="#" data-deleted="` + messageDiv[0].innerHTML + `">&#x3c;deleted&#x3e;</a>
            </span>
        `);
    }
}


function removeMaxMessages(){
    var maxMessages = parseInt($("#max-messages")[0].value);
    var numberOfMessages = $("#robinChatMessageList").children().length;

    if(numberOfMessages > maxMessages){
        var messages = $("#robinChatMessageList").children();
        
        for(var i = numberOfMessages; i > maxMessages; i--){
            if(messages[0] != undefined){
                messages[0].remove();
            }
        }
    }
}


//checks for a new message, and then calls doFilter();
createObserver();
function createObserver() {
    var target = $('#robinChatMessageList')[0];

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var messageDiv = mutation.addedNodes[0];
            
            if(messageDiv != undefined){
                doFilter(messageDiv);
                parseURLs(messageDiv);
            }

            removeMaxMessages();
        });
    });

    // configuration of the observer:
    var config = { childList: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

//ty to fam
//http://stackoverflow.com/questions/8746882/jquery-contains-selector-uppercase-and-lower-case-issue
//makes :contains case-insensitive
jQuery.expr[':'].Contains = function(a, i, m) { return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; };

//also thanks to this guy
//http://stackoverflow.com/questions/147824/how-to-find-whether-a-particular-string-has-unicode-characters-esp-double-byte
function isAsciiArt(s) { // "art"
    return /[^\u0000-\u00ff]/.test(s);
}

createEventListeners();
function createEventListeners(){
    $(document.body).on("click", ".filter-img#filter-remove", function(event){
        var filterList = GM_getValue("filter_list");
        var word = event.currentTarget.getAttribute("data-word");
        var index = filterList.indexOf(word);

        filterList.splice(index, 1);
        
        GM_setValue("filter_list", filterList);

        event.currentTarget.parentElement.outerHTML = "";
    });

    $(document.body).on("click", ".filter-img#filter-create", function(){
        var newWord = window.prompt("Enter a new filter to add");
        if(newWord != null){
            appendWordToList(newWord);

            var newFilterList = GM_getValue("filter_list");
            newFilterList.push(newWord);
            GM_setValue("filter_list", newFilterList);
        }
    });
    
    $(document.body).on("click", ".deleted a", function(event){
        event.preventDefault();
        var element = event.toElement;

        element.outerHTML = $(element).attr("data-deleted");
    });
}

//everything below is html/css stuff

createHTML();
function createHTML(){
    var html = `
    <div>
        <div>Create word or username filters below by clicking the green +. Message /u/kmcgurty1 for help.</div>
        <label><input id="remove-ascii" type="checkbox" checked>&nbsp;Remove ascii art</label><br>
        <label><input id="silent-delete" type="checkbox" checked>&nbsp;Silently delete</label><br>
        <label><input id="prevent-abandon" type="checkbox" checked>&nbsp;Prevent abandonment</label><br>
        <label><input id="max-messages" type="number" value="150" style="width: 3em">&nbsp;Max messages to keep</label>
        <div class="filter-list">
            <div class="item-wrapper">
                <div class="filter-img" id="filter-create"></div>
            </div>
        </div>
    </div>
    `;

    $("div[role=main]").after(html);

    var filterList = GM_getValue("filter_list");

    for (var i = 0; i < filterList.length; i++) {
        appendWordToList(filterList[i]);
    }

    createButton = ``;
}

function appendWordToList(word){
    var html = `
        <div class="item-wrapper">
            <div class="filter-word">` + word + `</div>
            <div class="filter-img" id="filter-remove" data-word="` + word + `" ></div>
        </div>
    `;

    $(html).insertBefore(".item-wrapper:last");
}

var css = `
.deleted a{
    color: rgba(0,0,0, .4);
}

div input{
    display: inline-block;    
    vertical-align: bottom; 
}

.filter-word{
    color: black;
    height: 25px;
    padding-right: 10px;
}

.filter-img{
    cursor:  pointer;
    width: 15px;
    height: 15px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    
}

.filter-img#filter-create{
    height: 25px;
    width: 25px;
    background-image: url(https://i.imgur.com/nw1I62o.png);
}

.filter-img#filter-remove{
    background-image: url(https://i.imgur.com/3bYSOxq.png);
}

.item-wrapper{
    display: inline-block;
    background-color: rgb(235, 235, 235);
    border: 4px solid rgba(20, 20, 20, .7);
    border-radius: 5px;
    padding: 2px;
    margin: 4px;
}

.item-wrapper div{
    vertical-align: middle;
    display: table-cell;
}

.filter-list{
    font: normal small verdana,arial,helvetica,sans-serif;
    line-height: 1em;
    margin: 5px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

a.link{
    color: blue;
}

a.link:link {
    color: #0000EE;
}

a:hover{
    text-decoration: underline;
}
`;

GM_addStyle(css);