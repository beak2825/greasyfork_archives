// ==UserScript==
// @name         Minds UI Improvements
// @namespace    http://www.minds.com/
// @version      0.8
// @description  Shows comments on the right hand side of the page.
// @author       You
// @match        https://www.minds.com/newsfeed/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/367779/Minds%20UI%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/367779/Minds%20UI%20Improvements.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(`
.myp {
    padding: 5px;
    background: #FFFFFF;
    border-radius: 3px;
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    word-break: break-word;
    border: 1px solid #e8e8e8;
}
.tagged {
    border: 1px solid #e8e8e8;
    width: 100%;
    padding: 5px;
    border-radius: 3px;
    background: #EEEEFF;
}
.mytime {
    margin-right: 5px;
    color: #4690df;
    font-style: normal;
    font-size: .8em;
}
.myimg {
    max-width: 40%;
    max-height: 100px;
    margin: 0px;
    margin-right: 15px;
    border-radius: 3px;
}
.mya {
    text-decoration: none;
}
.m-newsfeed--boost-sidebar {
    max-width: initial !important;
    right: 50px !important;
    width: 45%;
}
.m-newsfeed--feed {
    margin-left: 20px !important;
    width: 50% !important;
}
.m-newsfeed--sidebar,
.m-boost-rotator-item,
.m-boost-console-link,
.m-boost-rotator-tools
{
   display: none !important;
}
`);

function formatComment(n) {
    console.log(n)

    let title = n.entity.title;
    if (title === false) {
        title = n.entity.message;
    }
    if (title === false && n.entity.remind_object !== undefined) {
        title = n.entity.remind_object.message;
    }
    if (title === "") {
        title = "[empty]";
    }

    let img = n.entity.thumbnail_src;
    if ((img == false || img == undefined) && n.entity.custom_data !== false) {
        img = n.entity.custom_data[0].src;
    }
    if ((img == false || img == undefined) && n.entity.remind_object !== undefined) {
        img = n.entity.remind_object.thumbnail_src;
    }

    let ret = '<i class="mytime">' + getTime(n) + '</i> ' +
        '<a class="mya" target="_blank" href="https://www.minds.com/' + n.from.username + '">' + n.from.username + '</a>' +
        ' on ' +
        '<a class="mya" target="_blank" href="https://www.minds.com/newsfeed/' + n.entity.guid + '">' + title + '</a>' +
        '<p class="myp">';
console.log(img);
    if (img !== false && img !== undefined) {
        img = encodeURI(img);
        ret += '<img class="myimg" src="https://cdn.minds.com/api/v2/media/proxy?src=' + img + '">';
    }
    if (n.description !== false) {
        ret += n.description;
    }
    ret += '</p>';

    return ret;
}

function formatGroupActivity(n) {
    let img = n.entity.thumbnail_src;
    if (img == false && n.entity.custom_data[0] !== undefined) {
        img = n.entity.custom_data[0].src;
    }

    let ret = '<i class="mytime">' + getTime(n) + '</i> ' +
        '<a class="mya" target="_blank" href="https://www.minds.com/' + n.from.username + '">' + n.from.username + '</a>' +
        ' in group ' +
        '<a class="mya" target="_blank" href="https://www.minds.com/newsfeed/' + n.entity.guid + '">' + n.params.group.name + '</a>' +
        '<p class="myp">';

    if (img !== false) {
        ret += '<img class="myimg" src="' + img + '">';
    }
    if (n.description !== false) {
        ret += n.description;
    }
    ret += '</p>';

    return ret;
}

function formatTag(n) {
    let description = n.entity.description;
    if (description == false || description == undefined) {
        description = n.description;
    }
    let guid = n.entity.parent_guid;
    if (guid == false || guid == undefined) {
        guid =  n.entity.guid;
    }
    let ret = '<i class="mytime">' + getTime(n) + '</i> ' +
        '<a class="mya" target="_blank" href="https://www.minds.com/' + n.from.username + '">' + n.from.username + '</a> ' +
        '<a class="mya" target="_blank" href="https://www.minds.com/newsfeed/' + guid + '">tagged you</a>' +
        '<p class="tagged">' +
        description +
        '</p>';
    return ret;
}

function getTime(n) {
    let time = new Date(n.time_created * 1000);
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return time.toLocaleDateString("en-US", options);
}

function showNotifications() {
    getNotifications(function(response) {
        let target = $('.m-newsfeed--boost-sidebar')[0];
        target.innerHTML = "";
        let nn = response.notifications;
        for (var i = 0; i < nn.length; i++) {
            var n = nn[i];

            if (n.notification_view === "group_activity") {
                target.innerHTML += formatGroupActivity(n);
            } else
            if (n.notification_view === "comment") {
                target.innerHTML += formatComment(n);
            } else
            if (n.notification_view === "tag") {
                target.innerHTML += formatTag(n);
            } else {
                //console.log(n);
            }
        }
    });
}

function getNotifications(callback) {
    return http('GET', 'api/v1/notifications/all?limit=100', null, callback);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

function http(method, url, payload, callback) {
    $.ajax({
            method: method,
            url: url,
            headers: {
                'x-xsrf-token': getCookie('XSRF-TOKEN')
            }
        })
        .done(function(ret) {
            callback(ret);
        });
}

showNotifications();
setInterval(showNotifications, 5 * 1000);
