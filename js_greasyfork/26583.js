// ==UserScript==
// @name         Twitch bot detector
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Запрашивает у api twitch.tv количество зрителей и юзеров в чате, сравнивает показатели и выводит над чатом
// @author       Андрей Д
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/26583/Twitch%20bot%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/26583/Twitch%20bot%20detector.meta.js
// ==/UserScript==

var viewers = 0;
var chatters = 0;

var xhr = new XMLHttpRequest();

function connect(channel_name){
    var theUrl = 'https://api.twitch.tv/kraken/streams/'+channel_name+'?client_id=4umt9oxqvmgc7zrx4fl9kqt7tp62xok';
$.ajax({
        url: theUrl,
        dataType: "jsonp",
        success: function( response ) {
            var viewerlist = response.stream.viewers;
            viewers = viewerlist;
            if(viewerlist !== ""){
                console.log('#######################################'+'\nЗрителей '+viewers);
            }else{
                  console.log("Не могу получить чаттеров");
            }
        }
    });
}

function chat (name){
var theUrl = 'https://tmi.twitch.tv/group/user/'+name+'/chatters';
$.ajax({
        url: theUrl,
        dataType: "jsonp",
        success: function( response ) {
            var viewerlist = response.data.chatter_count;
            chatters = viewerlist;
            if(viewerlist !== ""){
                console.log('#######################################'+'\nВ чате '+chatters);
            }else{
                  console.log('#######################################'+'\nНе могу получить чаттеров');
            }
        }
    });
}

function alg (view, chat) {

	return chat / view * 100;
}

function push(text){
    //document.getElementsByClassName('room-title').innerHTML += text;
    document.getElementsByClassName('room-title')[0].innerHTML += text;
}

//docReady(function() {
$(window).load(function(){
    console.log('#######################################'+'\nВыделяем имя стримера..');
    var twitchname;
    //var name1 = document.getElementsByClassName("links_group");
    var name1 = window.location.href;
    twitchname = name1.substr(22);
    /////
console.log('#######################################'+'\nЗагрузка..');
setTimeout(function(){
	connect(twitchname);
    chat(twitchname);
    setTimeout(function(){
        //alert('\nЗрителей '+viewers+ '\nВ чате '+chatters+ '\nДоля '+alg(viewers,chatters).toFixed(1));
        push(' ## Доля '+alg(viewers,chatters).toFixed(1) + ' ##');
    console.log('#######################################'+'\nДоля '+alg(viewers,chatters).toFixed(1));
    }, 5000);
}, 5000);
})();


