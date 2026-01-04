// ==UserScript==
// @name         Roblox Homepage Image Back
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add the Roblox homepage avatar headshot back.
// @author       You
// @match        https://www.roblox.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446834/Roblox%20Homepage%20Image%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/446834/Roblox%20Homepage%20Image%20Back.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var section = document.querySelector(".container-header");
    var fchprm = fetch("https://users.roblox.com/v1/users/authenticated", {credentials:"include"});

    function generateimg(id, user) {
        var fchimg = fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=true`);
        fchimg.then(function(res) {
            if (res.ok) {
                var json = res.json().then(function(val) {
                    var actval = val.data[0];
                    if (actval.imageUrl) {
                        var newa = document.createElement("a");
                        newa.href = `/users/${id}/profile`;
                        section.parentNode.appendChild(newa);

                        var imgurl = actval.imageUrl;
                        var newimg = document.createElement("img");
                        newimg.src = imgurl;
                        newimg.style = "float:left;background:#d4d4d4;border-radius:100%";
                        newa.prepend(newimg);

                        var head = section.children[0];
                        head.style = "line-height: 4;margin-left: 18%;";
                        head.innerText = user;
                        newa.append(head);
                    }
                });
            }
        });
    }

    fchprm.then(function(res){
        if (res.ok) {
            var json = res.json().then(function(val) {
                if (val) {
                    if (val.id && val.displayName) {
                        var userid = val.id;
                        var dispname = val.displayName;
                        generateimg(userid, dispname);
                    }
                }
            });
        }
    });
})();