// ==UserScript==
// @name         Remove osu! avatar
// @namespace    osu
// @version      1.6
// @description  Removes your osu avatar on the website
// @author       Magnus Cosmos
// @include      https://osu.ppy.sh/*
// @grant        none
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/431985/Remove%20osu%21%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/431985/Remove%20osu%21%20avatar.meta.js
// ==/UserScript==

function getCookie(name) {
    var value = `; ${document.cookie}`;
    var parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}

function RemoveAvatar(Event) {
    var prompt = confirm("Are you sure you want to remove your avatar?");
    if (prompt != true) {
        return;
    }
    var xsrf_token = getCookie("XSRF-TOKEN");
    fetch("https://osu.ppy.sh/home/account/avatar", {
        method: "post",
        credentials: "same-origin",
        headers: new Headers({
            "x-requested-with": "XMLHttpRequest",
            "x-csrf-token": xsrf_token
        })
    }).then((response) => {
        if (response.status < 300) {
            var avatar_list = document.querySelectorAll(".js-current-user-avatar");
            for (var i = 0; i < avatar_list.length; i++) {
                avatar_list[i].style.backgroundImage = 'url("https://osu.ppy.sh/images/layout/avatar-guest.png")';
            }
        }
    });

}

function stringToHtml(string) {
    var temp = document.createElement('template');
    temp.innerHTML = string;
    return temp.content.firstElementChild;
}

(function() {
    $(document).ready(function(){
        var current = null;
        setInterval(function(){
            if(current != document.body){
                current = document.body;
                var pathname = window.location.pathname;
                if (pathname == "/home/account/edit") {
                    var avatar = document.querySelector("#avatar > div.account-edit > div.account-edit__input-groups > div.account-edit__input-group > div.account-edit-entry.account-edit-entry--avatar.js-account-edit-avatar");
                    var test = stringToHtml(`
    <label class='btn-osu-big btn-osu-big--account-edit btn-osu-big--danger'>
        <div class='btn-osu-big__content'>
            <div class='btn-osu-big__left'>
                remove avatar
            </div>
            <div class='btn-osu-big__icon'>
                <i class='fas fa-trash'></i>
            </div>
        </div>
    </label>`);
                    test.style.marginLeft = "5px";
                    test.addEventListener("click", RemoveAvatar, false);
                    avatar.insertBefore(test, avatar.children[2]);
                }
            }
        }, 200);
    });
})();