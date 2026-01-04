// ==UserScript==
// @name         VRChat Web Analytic
// @namespace    e1on
// @version      1.24
// @description  Adds the ability to view members of the worlds as well as sending messages to friends.
// @author       e1on
// @match        https://vrchat.net/*
// @grant        https://vrchat.net/*
// @include      /.*?:\/\/.*?vrchat.*?\..*?(home|world|launch|api).*?/
// @include      *://www.vrchat.net
// @include      *://www.vrchat.com
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/377266/VRChat%20Web%20Analytic.user.js
// @updateURL https://update.greasyfork.org/scripts/377266/VRChat%20Web%20Analytic.meta.js
// ==/UserScript==

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

var cookieAuth = getCookie("auth");
var xhr = new XMLHttpRequest();

if (cookieAuth != 'undefined') {

	history.pushState = ( f => function pushState(){
	var ret = f.apply(this, arguments);
	window.dispatchEvent(new Event('pushState'));
	window.dispatchEvent(new Event('locationchange'));
	return ret;
	})(history.pushState);
	history.replaceState = ( f => function replaceState(){
	var ret = f.apply(this, arguments);
	window.dispatchEvent(new Event('replaceState'));
	window.dispatchEvent(new Event('locationchange'));
	return ret;
	})(history.replaceState);
	window.addEventListener('popstate',()=>{
	window.dispatchEvent(new Event('locationchange'))
	});

	// Смена url
	window.addEventListener('locationchange', function(){

		var path = location.pathname.split('/');

		// world card
		if ((typeof path[2] !== "undefined") && (path[2] == 'world')) {
			if ((typeof path[3] !== "undefined")) {

				var worldData = {};
				// get world info
				xhr.open("GET", "/api/1/worlds/"+path[3], true);
				xhr.onload = function (){
					worldData = JSON.parse(xhr.responseText);
					getAllUsers(worldData);
				}
				xhr.send(null);

			}
		}


        // sleep time expects milliseconds
        function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        // Usage!
        sleep(2000).then(() => {
            // send message
            if ((typeof path[2] !== "undefined") && (path[2] == 'user')) {
                if ((typeof path[3] !== "undefined")) {

                    var userId = path[3];
                    renderMessageForm(userId);

                }
            }
        });



	});

}

var data = {}; // instanceId => users

function getAllUsers (worldData) {
	if (worldData['instances'] !== 'undefined') {

		worldData['instances'].forEach(function(item, i, arr) {

			// get users info
			xhr.open("GET", "/api/1/worlds/"+worldData['id']+"/"+item[0], false);
			xhr.onload = function (){
				data[item[0]] = JSON.parse(xhr.responseText)['users'];
			}
			xhr.send(null);

		});

		render(worldData['id']);

	}
}

// слабонервным не смотреть
function render (worldId) {
$(document).ready(function() {
var BreakException = {};
try {
	Object.keys(data).forEach(function (item){
			var el = $('a[href="vrchat://launch?ref=vrchat.com&id='+worldId+':'+item+'"]');

			if (el.length){
				data[item].forEach(function (item,i,arr){
					el.after('<a href="/home/user/'+item['id']+'" target="_blank" style="display: inline-block;font-size: 12px;width: 130px;text-align: center;background: #333333;border: 1px solid #333333;margin-bottom: 5px;"><img src="'+item['currentAvatarImageUrl']+'">'+item['displayName']+'</a>');
				});
			} else {
				render(worldId);
				throw BreakException;
				return;
			}
	});
	data={};
} catch (e) {
  if (e !== BreakException) throw e;
}
});
}

function renderMessageForm (userId) {
$(document).ready(function() {


    var el = $('h3[class="subheader"]');
    console.log(el);

    if (el.length){
        el.after('<input type="text" style="display: inline-block;width: 80%;" id="message" class="form-control" placeholder="Send message" value=""><button id="sendMessage" type="button" class="btn btn-primary">Send</button>');
    }

});
}

    $(document).on("click", "#sendMessage", function () {
        console.log("click");
        $.ajax({
            url: 'https://vrchat.net/api/1/user/'+ location.pathname.split('/')[3] +'/notification',
            type: 'POST',
            data:{ type: "message", message: $("#message").val()},
            success: alert("[OK] Message sent successfully!")
        });
    });