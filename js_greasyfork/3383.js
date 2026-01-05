// ==UserScript==
// @name        RedditRaffle
// @namespace   redditraffle
// @description Choses a list of winners by certain criteria
// @include     http://www.reddit.com/r/*/comments/*
// @include     https://www.reddit.com/r/*/comments/*
// @include     http://old.reddit.com/r/*/comments/*
// @include     https://old.reddit.com/r/*/comments/*
// @include     http://new.reddit.com/r/*/comments/*
// @include     https://new.reddit.com/r/*/comments/*
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3383/RedditRaffle.user.js
// @updateURL https://update.greasyfork.org/scripts/3383/RedditRaffle.meta.js
// ==/UserScript==

var link,
    url,
    winner_count,
    author_exclude,
    keyword_included,
    keyword_excluded,
    karma_link,
    karma_comment,
    age = 0.,
    total_comments,
    comments = [],
    more = [],
    more_lock = false,
    parse_lock = false,
    names = [],
    chosen = [],
    userinfo,
    query_timeout,
    connection_count = 0,
    url_base = new URL(window.location.href).origin;

function render_results() {
    progress.innerHTML = "Rendering:";
    var html = [];
    html.push("<!doctype html><meta charset=\"utf-8\" /><title>Raffle results</title>" +
              "<style>table{overflow:hidden;border:1px solid #d3d3d3;background:#fefefe;" +
              "width:70%;margin:5% auto 0;-moz-border-radius:5px;-webkit-border-radius:5px;" +
              "border-radius:5px;-moz-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);" +
              "-webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);}th,td{text-align:center;}" +
              "th{padding:14px 22px;text-shadow: 1px 1px 1px #fff;background:#e8eaeb;}" +
              "td{border-top:1px solid #e0e0e0;border-right:1px solid #e0e0e0;}" +
              "tr:nth-child(odd) td{background:#f6f6f6;}td:last-child{border-right:none;" +
              "text-align:left;padding:8px 18px;}</style><table><tr><th>No.</th><th>User</th>" +
              "<th>Comment</th></tr>");
    var winner_length = Math.min(winner_count, chosen.length);
    for(var i = 0; i < winner_length; i++) {
        html.push("<tr><td>" + (i + 1) + ".</td><td><a href=\"" + url_base + "/user/" +
                  chosen[i].author + "\">" + chosen[i].author + "</a></td><td>");
        html.push(chosen[i].body_html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
        html.push("<br /><a href=\"" + url + chosen[i].id + "\">Show</a></td><tr>");
    }
    html.push("</table>");
    progress.innerHTML = "<a href=\"" + URL.createObjectURL(new Blob(html, {type : 'text/html'})) +
                         "\" target=\"_new\">Show results</a>";
}

function query_users() {
    if(more_lock || parse_lock) return;
    var query_interval = window.setInterval(function() {
        if(chosen.length >= winner_count || !comments.length) {
            window.clearInterval(query_interval);
            render_results();
            return;
        }
        if(connection_count > 10) return;
        var comment = comments.splice(Math.floor(Math.random() * comments.length), 1)[0];
        if(comment === undefined ||
           comment.body.toLowerCase().indexOf(keyword_included) < 0 ||
           (keyword_excluded && !(comment.body.toLowerCase().indexOf(keyword_excluded) < 0)) ||
           (author_exclude && comment.author === author_exclude) ||
           !(names.indexOf(comment.author) < 0))
            return;
        if(age || karma_link || karma_comment) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if(this.status == 200) {
                        connection_count--;
                        userinfo = JSON.parse(this.responseText).data;
                        if((!age || userinfo.created_utc <= age) &&
                           userinfo.link_karma >= karma_link &&
                           userinfo.comment_karma >= karma_comment &&
                           chosen.length < winner_count &&
                           names.indexOf(userinfo.name) < 0) {
                            names.push(userinfo.name);
                            chosen.push(comment);
                            progress.innerHTML = "Querying Users: " + chosen.length + "/" + winner_count;
                        }
                    } else {
                        connection_count--;
                				console.log("Server returned status " + this.status);
                    }
                }
            };
    				request.open('GET', url_base + '/user/' + comment.author + '/about.json', true);
    				request.send();
            connection_count++;
        } else {
            names.push(comment.author);
            chosen.push(comment);
            progress.innerHTML = "Querying Users: " + chosen.length + "/" + winner_count;
        }
    }, 100);
}

function add_comment(comment) {
    comments.push(comment);
    if(comment.replies && comment.replies.kind === "Listing")
        parse_listing(comment.replies.data.children);
}

function add_more(children) {
    more.push.apply(more, children);
    if(!more_lock) parse_more();
}

function parse_more() {
    if(!more.length) {
        more_lock = false;
        query_users();
        return;
    }
    more_lock = true;
    var children = more.splice(0, 20);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 200) {
                parse_listing(JSON.parse(this.responseText).json.data.things);
                progress.innerHTML = "Parsing Comments: " + comments.length + "/" + total_comments;
                parse_more();
            } else {
                more.push.apply(more, children);
                console.log("Server returned status " + this.status);
                parse_more();
            }
        }
    };
    request.open('GET', url_base + '/api/morechildren.json?link_id=' + link + '&api_type=json&children=' + children.join(), true);
    request.send();
}

function parse_listing(listing) {
    var listingLength = listing.length;
    for(var child = 0; child < listingLength; child++) {
        if (listing[child].kind === 't1')
            add_comment(listing[child].data);
        else if (listing[child].kind === 't3') {
            link = listing[child].data.name;
            author_exclude = form.elements.author_exclude.checked ? listing[child].data.author : "";
            total_comments = listing[child].data.num_comments;
            progress.innerHTML = "Parsing Comments: 0/" + total_comments;
        }
        else if (listing[child].kind === 'more')
            add_more(listing[child].data.children);
    }
}

function do_raffle() {
    progress.innerHTML = "Parsing Comments:";
    winner_count = parseInt(form.elements.winner_count.value) || 20;
    keyword_included = form.elements.keyword_included.value.toLowerCase();
    keyword_excluded = form.elements.keyword_excluded.value.toLowerCase();
    karma_link = parseInt(form.elements.karma_link.value) || 0;
    karma_comment = parseInt(form.elements.karma_comment.value) || 0;
    if(form.elements.age.value) {
        var date = new Date(),
            number = parseInt(form.elements.age.value) || 0;
        switch(form.elements.age_type.value) {
            case "y":
                date.setFullYear(date.getFullYear() - number);
                break;
            case "d":
                date.setDate(date.getDate() - number);
                break;
            default:
                date.setMonth(date.getMonth() - number);
        }
        age = date.getTime()/1000;
    }
    url = window.location.href;
    if(!(url.indexOf("?") < 0)) {
        url = url.substring(0, url.indexOf("?"));
    }
    parse_lock = true;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 200) {
                var things = JSON.parse(this.responseText),
                    thingsLength = things.length;
                for(var thing = 0; thing < thingsLength; thing++)
                    if (things[thing].kind === 'Listing')
                        parse_listing(things[thing].data.children);
                parse_lock = false;
                query_users();
            } else {
                console.log("Server returned status " + this.status);
            }
        }
    };
    request.open('GET', url + '.json?limit=500', true);
    request.send();
}


var style = document.createElement('style');
style.type = 'text/css';
document.head.appendChild(style);
style.sheet.insertRule("#raffle_form input[type=text] {\
    width:265px;\
    border:1px solid #DBDADA;\
    border-radius:2px;\
    font-size:14px;\
    font-style:italic;\
    padding:4px;\
}", 0);
style.sheet.insertRule("#raffle_form button {\
    border:1px solid #DBDADA;\
    border-radius:2px;\
    font-size:14px;\
    font-style:italic;\
    padding:4px;\
    margin:4px;\
    background:#EBEBEB;\
    color:#141414;\
}", 1);
style.sheet.insertRule("#raffle_form a {\
    color:blue;\
    text-decoration:underline;\
}", 2);


var form = document.createElement("form");
form.id = "raffle_form";
form.innerHTML = "<ul class=\"content\">\
<li><input type=\"text\" placeholder=\"Number of Winners\" name=\"winner_count\" /></li>\
<li><input type=\"text\" placeholder=\"Comments containing\" name=\"keyword_included\" /></li>\
<li><input type=\"text\" placeholder=\"Comments not containing\" name=\"keyword_excluded\" /></li>\
<li><input type=\"text\" placeholder=\"Required Link Karma\" name=\"karma_link\" /></li>\
<li><input type=\"text\" placeholder=\"Required Comment Karma\" name=\"karma_comment\" /></li>\
<li>\
<input type=\"text\" placeholder=\"Age\" name=\"age\" style=\"width: 190px;\"></input>\
<select name=\"age_type\">\
<option value=\"d\">days</option>\
<option value=\"m\" selected=\"selected\">month</option>\
<option value=\"y\">years</option>\
</select>\
</li>\
<li>\
<button class=\"save\" type=\"button\">Raffle</button>\
<input type=\"checkbox\" name=\"author_exclude\" id=\"author_exclude\" checked=\"checked\"/>\
<label for=\"author_exclude\">Exclude Author</label>\
</li>\
<li><span id=\"raffle_progress\"></span></li>\
</ul>";

var progress = form.querySelector("#raffle_progress");
form.querySelector("button").addEventListener("click", do_raffle, true);

// old design
if(document.querySelector("div.side")) {
    var spacer = document.createElement("div"),
        sidecontentbox = document.createElement("div");
    spacer.classList.add("spacer");
    sidecontentbox.classList.add("sidecontentbox");
    spacer.appendChild(sidecontentbox);
    sidecontentbox.innerHTML = "<div class=\"title\"><h1>Raffle</h1></div>";
    sidecontentbox.appendChild(form);
    document.querySelector("div.side").appendChild(spacer);
}

// new design
else {
    var template_container = document.evaluate("//div[text()=\"Community Details\"]/..", document, null, XPathResult.ANY_TYPE, null).iterateNext(),
        sidebar = template_container.parentNode,
        container = document.createElement("div"),
        title = document.createElement("div"),
        content = document.createElement("div");
    container.classList = template_container.classList;
    container.appendChild(title);
    container.appendChild(content);
    title.classList = template_container.children[0].classList;
    title.innerHTML = "Raffle";
    content.classList = template_container.children[1].classList;
    content.appendChild(form);
    setTimeout(() => {sidebar.insertBefore(container, sidebar.children[2]);}, 400);
}