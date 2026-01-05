// ==UserScript==
// @name OCN High Contrast Theme
// @description Javascript portion of the OCN Theme, OCN HIGH CONTRAST
// @namespace nope
// @include http://www.overclock.net/*
// @version 1
// @grant none
// @require http://code.jquery.com/jquery-1.6.4.js
// @downloadURL https://update.greasyfork.org/scripts/14775/OCN%20High%20Contrast%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/14775/OCN%20High%20Contrast%20Theme.meta.js
// ==/UserScript==

//Notification Restore
(function() {
$("<style type='text/css'> .jcounter { background-color:#399C41; display:inline-block; height:15px; min-width:15px; text-align:center; font-size:10px; line-height:15px; color:#FFF; border-radius:2px; } .jpadder { display:inline-block; height:15px; min-width:15px; text-align:center; font-size:10px; line-height:15px; color:#FFF; border-radius:2px; background-color:transparent; } </style>").appendTo("head");
$("<style type='text/css'> .jncontainer { position:absolute; right:48px; height:38px; display:inline-block; top:27px; } .fixed-scroll-breakpoint .jncontainer { top:8px; } </style>").appendTo("head");
$("<style type='text/css'> .jlink { font-size:12px; display:block !important; height:18px !important; color:#FFF !important; text-align:right !important; } .search-bar-outer, .ui-header-fixed ul#main-nav .search > a { right:165px !important; } .ui-header-fixed li.profile .user-avatar .notification-counter, .ui-header-fixed ul#main-nav li.messages, .ui-header-fixed ul#main-nav li.subscriptions { display:none; } </style>").appendTo("head");
var privateMessagesCount = $(".messages .notification-counter").first().text().replace(/\s+/, "");
var subscriptionsCount = $(".subscriptions .notification-counter").first().text().replace(/\s+/, "");
var notificationModule = $("<li/>", {
class: "jncontainer",
css: {
"height": "35px"
}
});
var messagesContainer = $("<a/>", {
href: "http://www.overclock.net/messages",
text: "Private Messages ",
class: "jlink",
css: {
"display": "block"
}
});
var messagesCounter = $("<span/>", {
text: privateMessagesCount,
class: "jcounter"
});
var subsContainer = $("<a/>", {
href: "http://www.overclock.net/users/subscriptions/",
text: "Subscriptions ",
class: "jlink",
css: {
"display": "block"
}
});
var subsCounter = $("<span/>", {
text: subscriptionsCount,
class: "jcounter"
});
if(privateMessagesCount > 0) messagesContainer.append(messagesCounter); else messagesContainer.append($("<span/>", { class:"jpadder", text: "" }));
if(subscriptionsCount > 0) subsContainer.append(subsCounter); else subsContainer.append($("<span/>", { class:"jpadder", text: "" }));
notificationModule.append(messagesContainer);
notificationModule.append(subsContainer);
notificationModule.insertBefore($("#main-nav .profile"));
})();

//New Modern Favicon
(function() {
    var link = document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href =  'data:image/png;base64,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%3D';
    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(link, head.firstChild);
})();

//High Res Avatar
var highres  = $(".profile .user-avatar a img").attr("src").replace("32x32px-LL", "120x120px-LS");
$(".profile .user-avatar a img").attr("src", highres);