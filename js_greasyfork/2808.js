// ==UserScript==
// @name       Gamefaqs Quick PM
// @namespace  N-eil
// @version    0.9
// @description  PM from within topic in gamefaqs 
// @include *.gamefaqs.com/boards/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/2808/Gamefaqs%20Quick%20PM.user.js
// @updateURL https://update.greasyfork.org/scripts/2808/Gamefaqs%20Quick%20PM.meta.js
// ==/UserScript==

var key; //Gfaqs has a hidden field called "key" that is required to be filled with a certain code(different for each user) in order to post/edit/pm

if(document.getElementsByName('key').length) //Look for the key on the page: quickposting is enabled
{
    key = document.getElementsByName('key')[0].value;
	addLinks();    
}
else 
{
    $.post("/boards/post.php?board=" + boardID + "&topic=" + topicID, {}).done(function(response){ //Otherwise, look for the key requesting a separate post message page
        key = response.match(/key" value="([^"]*)"/)[1];
        addLinks();
    });
}
//If neither method can find the key, don't bother adding the quick PM links since they cannot function properly


function addLinks(){
    var username = $(".board_nav a:first").html();
    username = username.substring(0,username.indexOf('(')-1);
    
    var $details = $(".msg_stats_left")
    ,	displayLeft = true;
    
    if (!$details.length){ //If nothing was found, they must have user details displayed above the message
        $details = $(".msg_stats");
        displayLeft = false;
    }
    
    $details.each(function(index, el) {
        var $el = $(el);
        if (!($el.html().match(username)))
        { //Posts without your username are from other users, and they can be PM'd 
            var pmLink = $("<a> PM </a>");   
            pmLink.click(function() {showPMWindow($el.find("a.name").html());});
            $el.append(pmLink);
        }
            
    });
}

function createPopup(text){
	$("#popup-window").remove();
	var $window = $("<div id='popup-window'> " + text + " </div>")
		.css("left", "30%")
		.css("top","30%")
		.css("position", "fixed")
		.toggleClass("reg_dialog", true);
    $("body").prepend($window);
	return $window; 
}

function showPMWindow(name) {
    var $PMWindow = createPopup("Send a PM to " + name)
    ,   $subject = $("<div>Subject: <input type='text' maxlength='100' /></div>")
    ,   $message = $("<div><textarea rows ='" + Math.floor($(window).height() / 45) + "' cols='80' maxlength='1024'></textarea></div>");
    
    var $send = $("<button style='margin: 5px;'>Send</button>").click(function() {sendPM(name, $subject.find("input").val(), $message.find("textarea").val()); setTimeout(function() {$PMWindow.remove();},5000);})
    ,   $cancel = $("<button style='margin: 5px;'>Cancel</button>").click(function() {$PMWindow.remove();});
    
    $PMWindow.append($subject).append($message).append($send).append($cancel);
}

function sendPM(name, subject, message) {
    name = name.slice(3,-4);
    $.post('/pm/new', {key: key, to: name, subject: subject, message: message, submit: 'Quick PM'}).done(function(){$("#popup-window textarea").val("PM sent.");});
}