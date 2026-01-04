// ==UserScript==
// @name         FB Group Admin Remastered
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Delete user or ban - 
// @author       0x0001, onrdrsy
// @match        https://www.facebook.com/
// @grant        GM_xmlhttpRequest
// @include      https://www.facebook.com/*

// @edits onrdrsy
// @downloadURL https://update.greasyfork.org/scripts/372087/FB%20Group%20Admin%20Remastered.user.js
// @updateURL https://update.greasyfork.org/scripts/372087/FB%20Group%20Admin%20Remastered.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //if (location.pathname.startsWith("/groups/")) {
         unsafeWindow.removeUser = function(group, user, ban) {
        var fb_dtsg = document.querySelector("[name=fb_dtsg]").value;
        var data = `fb_dtsg=${fb_dtsg}&confirm=true&ban_user=${ban === true ? 1 : 0}&__user=${user}`;
        var commentEl = document.querySelector(`[data-user="${user}"]`).closest(".UFIComment");
        console.log("Send data", data);
        fetch(`https://www.facebook.com/ajax/groups/remove_member/?group_id=${group}&memberid=${user}&source=profile_browser`,{
            method:"POST",
            credentials:"same-origin",
            mode:"cors",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept":"application/json"
            }),
            body: `fb_dtsg=${fb_dtsg}&confirm=true&ban_user=${ban === true ? 1 : 0}&__user=${user}`,
        }).then(res => {
            console.log(res);
            if (commentEl) {
                commentEl.parentElement.style.transition = "all .2s ease";
                commentEl.parentElement.style.opacity = "0.5";
            }
        })
            .catch(err => {
            console.log(err);
            if (commentEl) {
                commentEl.parentElement.style.backgroundColor = "rgba(255, 99, 71, 0.48)";
            }

        });
        /*GM_xmlhttpRequest ( {
            method: 'POST',
            url: `https://www.facebook.com/ajax/groups/members/remove.php?group_id=${group}&uid=${user}&is_undo=0&source=profile_browser&dpr=1`,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept":"application/json"
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log("User remove", res);
                } else {
                    console.log("User not remove", res.status);
                }
            }
        });*/
    };

    unsafeWindow.getGroupId = function(target) {
        if (document.location.pathname.startsWith('/groups')) {
            return document.querySelector("[property='al:ios:url']").content.match(/id=\d+/g)[0].replace("id=","");
        } else {
            return target.closest('.fbUserPost').querySelector('[href^="/groups"]').dataset.hovercard.match(/id=\d+/g)[0].replace("id=","");
        }
        // return location.pathname.match(/groups\/(\w+)/g)[0].replace('groups/', '');
        // return location.pathname.match(/\d+/g)[0];
    };

    unsafeWindow.deleteUser = function(e) {
        e.preventDefault();
        unsafeWindow.removeUser(getGroupId(e.target), e.target.dataset.user, false);
    };

    unsafeWindow.banUser = function(e) {
        e.preventDefault();
        unsafeWindow.removeUser(getGroupId(e.target), e.target.dataset.user, true);
    };
    unsafeWindow.check = function() {
        document.querySelectorAll(".UFICommentActions").forEach(item => {
            if (item.previousSibling.querySelector(".UFICommentActorName").classList.contains("extok") === false) {
                var userid = item.previousSibling.querySelector(".UFICommentActorName").dataset.hovercard.match(/id=\w+/g)[0].replace("id=","");
                var p = document.createElement("span");
                p.style.float = "right";
                p.innerHTML += `<a href="#" data-user="${userid}" onClick="window.deleteUser(event)">Kick</a><span role="presentation" aria-hidden="true"> · </span><a href="#" data-user="${userid}" onClick="window.banUser(event)">Ban</a>`;
                item.append(p);
                item.previousSibling.querySelector(".UFICommentActorName").classList.add('extok');
            }
        });
    };

    setInterval(function(){
        unsafeWindow.check();
    }, 5000);
    unsafeWindow.check();
//}
})();