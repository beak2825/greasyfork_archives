// ==UserScript==
// @name Discord DM Fabricator
// @description quick and easy script to swap the username and pfp of your alt account in a dm to that of a person who's profile you can load to fabricate a dm conversation
// @license MIT
// @version 1.0.
// @namespace nololxd
// @match https://discord.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475918/Discord%20DM%20Fabricator.user.js
// @updateURL https://update.greasyfork.org/scripts/475918/Discord%20DM%20Fabricator.meta.js
// ==/UserScript==
const origionalSend = XMLHttpRequest.prototype.send;

async function getUserData(token, id) {
    let user = await fetch(`https://discord.com/api/v10/users/${id}`, {
        headers: {
            "Authorization": `${token}`
        }
    });
    user = await user.json();
    return {
        username: user.global_name,
        avatar: user.avatar
    };
};

function changeAvatar(oldurl, newurl) {
    var all = document.getElementsByTagName("*");
    for (var i = 0, max = all.length; i < max; i++) {
        if (all[i].tagName == "IMG" && all[i].src.includes(oldurl)) {
            size = all[i].src.split("?")[1];
            all[i].src = newurl + "?" + size;
        }
    }
}

function changeName(oldname, newname) {
    var all = document.getElementsByTagName("*");
    for (var i = 0, max = all.length; i < max; i++) {
        if (all[i].tagName == "SPAN" && all[i].innerHTML === (oldname)) {
            all[i].innerHTML = newname;
        }
    }
}

async function fabricate(oldid, newid) {
    let token = (webpackChunkdiscord_app.push([[''], {}, e => { m = []; for (let c in e.c) m.push(e.c[c]) }]), m).find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken();
    let oldAvatar = await getUserData(token, '747031537727569971');
    let newAvatar = await getUserData(token, '1154619346715422730');

    let oldurl = `https://cdn.discordapp.com/avatars/${oldid}/${oldAvatar.avatar}`;
    let newurl = `https://cdn.discordapp.com/avatars/${newid}/${newAvatar.avatar}.webp`;

    changeAvatar(oldurl, newurl);
    changeName(oldAvatar.username, newAvatar.username);
}


XMLHttpRequest.prototype.send = function () {
    if (this.__sentry_xhr_v2__?.url?.includes("/messages") && this.__sentry_xhr_v2__?.method === "POST") {

        let json = JSON.parse(arguments[0]);
        if (json.content.startsWith("!fabricate")) {
            origionalSend.apply(this, undefined);
            console.log("fabricating")
            fabricate(json.content.split(" ")[1], json.content.split(" ")[2]);
            setTimeout(() => {
                var all = document.getElementsByTagName("*");
                for (var i = 0, max = all.length; i < max; i++) {

                    if (all[i].innerHTML.includes("!fabricate") && all[i].tagName == "SPAN") {
                        parent = all[i].parentNode.parentNode.parentNode
                        all[i].innerHTML = "Conversation Fabricated 😈"
                        all[i].parentNode.style.backgroundColor = "green"
                        setTimeout(() => { parent.remove() }, 1300)

                    };
                };

                // get rid of clyde
                for (var i = 0, max = all.length; i < max; i++) {

                    if (all[i].role == "button" && all[i].innerHTML.includes("Dismiss message")) {

                        all[i].click()

                    };
                };
            }, 300);

            return;
        };
    };

    return origionalSend.apply(this, arguments);
};


