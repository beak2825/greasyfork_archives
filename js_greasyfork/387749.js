// ==UserScript==
// @name         PlaylistLover
// @author       CennoxX
// @contact      cesar.bernard@gmx.de
// @namespace    https://greasyfork.org/users/21515
// @description  Love or Unlove song on last.fm in batch
// @version      0.1.8
// @match        https://write-box.appspot.com/?mode=lastfm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387749/PlaylistLover.user.js
// @updateURL https://update.greasyfork.org/scripts/387749/PlaylistLover.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var api_key="7bfc3993e87eb839bd1567bd2622dd56";
    var token;

    var username = localStorage.getItem('username');
    var sk = localStorage.getItem('sk');

    if (!sk){
        if (token=location.href.split("&token=")[1]){
            var data = "api_key="+api_key+"&method=auth.getsession&token="+token;
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'http://ws.audioscrobbler.com/2.0/?'+data+"&api_sig="+lfmmd5(data)+"&format=json",
                onload: function(response) {
                    if (response.responseText.length > 0) {
                        console.log(response.responseText);
                        var jsonObj = JSON.parse(response.responseText);
                        username = jsonObj.session.name;
                        localStorage.setItem('username', username);
                        sk = jsonObj.session.key;
                        localStorage.setItem('sk', sk);
                    }
                },
                onerror: function(response) {
                    console.log('Error in fetching contents: ' + response.responseText);
                }
            });
        }
        else
        {
            window.location.replace("https://www.last.fm/de/api/auth?api_key="+api_key+"&cb=https://write-box.appspot.com/?mode=lastfm");
        }
    }

    var loveButton = document.createElement("div");
    loveButton.id="love-button";
    loveButton.className="command";
    loveButton.title="Love all songs";
    loveButton.innerHTML="💗";
    loveButton.addEventListener("click", function() {requestLastfm("track.love");});

    var unloveButton = document.createElement("div");
    unloveButton.id="unlove-button";
    unloveButton.className="command";
    unloveButton.title="Unlove all songs";
    unloveButton.innerHTML="💔";
    unloveButton.addEventListener("click", function() {requestLastfm("track.unlove");});

    var navbar = document.getElementById('menu');
    navbar.insertBefore(loveButton, document.getElementById('new-button'));
    navbar.insertBefore(unloveButton, document.getElementById('new-button'));
    function requestLastfm(method){
        var songs = document.getElementById('editor').value.split('\n');
        songs.filter(i => i.includes("|")).forEach(s => {getSong(s)});
        function getSong(title) {
            var artist = title.split("|")[0];
            var track = title.split("|")[1].replace(/(\t💗|\t💔)/,"");
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key='+api_key+'&artist='+artist+'&track='+track+'&username='+username+'&format=json',
                onload: function(response) {
                    if (response.responseText.length > 0) {
                        var jsonObj = JSON.parse(response.responseText);
                        if (jsonObj.track && jsonObj.track.userplaycount > 0) {
                            console.log("request sent", method ,jsonObj.track.name,jsonObj.track.artist.name);
                            var artist = response.finalUrl.match(/artist=(.*?)&/)[1];
                            var track = response.finalUrl.match(/track=(.*?)&/)[1];
                            var reg = new RegExp(artist+"\\|"+track+".*");
                            document.getElementById("editor").value=document.getElementById("editor").value.replace(reg, jsonObj.track.artist.name+"|"+jsonObj.track.name);
                            songAction(jsonObj.track.name,jsonObj.track.artist.name, method);
                        }
                    }
                },
                onerror: function(response) {
                    console.log('Error in fetching contents: ' + response.responseText);
                }
            });
        }
        function songAction(track, artist, method) {
            var data = "api_key="+api_key+"&artist="+artist+"&method="+method+"&sk="+sk+"&track="+track;
            GM.xmlHttpRequest({
                method: 'POST',
                url: 'http://ws.audioscrobbler.com/2.0/',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                data: data+"&api_sig="+lfmmd5(data),
                onload: function(response) {
                    if (response.responseText.length > 0 && response.responseText.includes('<lfm status="ok" />')) {
                        var artist = data.match(/artist=(.*?)&/)[1];
                        var track = data.match(/track=(.*)/)[1];
                        var method = data.match(/method=(.*?)&/)[1];
                        var reg = new RegExp(artist+"\\|"+track+".*");
                        document.getElementById('editor').value=document.getElementById('editor').value.replace(reg, artist+"|"+track +(method=="track.love"?"\t💗":"") + (method=="track.unlove"?"\t💔":""));
                    }
                },
                onerror: function(response) {
                    console.log('Error in fetching contents: ' + response.responseText);
                }
            });
        }
    }
    function lfmmd5(f){for(var k=[],i=0;64>i;)k[i]=0|4294967296*Math.sin(++i%Math.PI);var c,d,e,h=[c=1732584193,d=4023233417,~c,~d],g=[],b=unescape(encodeURI(f=f.replace(/(=|&)/g,"")+atob("ZmY4MmMzNTkzZWI3Zjg5OGMzMjhjZmIwN2JiNjk2ZWM=")))+"\u0080",a=b.length;f=--a/4+2|15;for(g[--f]=8*a;~a;)g[a>>2]|=b.charCodeAt(a)<<8*a--;for(i=b=0;i<f;i+=16){for(a=h;64>b;a=[e=a[3],c+((e=a[0]+[c&d|~c&e,e&c|~e&d,c^d^e,d^(c|~e)][a=b>>4]+k[b]+~~g[i|[b,5*b+1,3*b+5,7*b][a]&15])<<(a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*a+b++%4])|e>>>-a),c,d])c=a[1]|0,d=a[2];for(b=4;b;)h[--b]+=a[b]}for(f="";32>b;)f+=(h[b>>3]>>4*(1^b++)&15).toString(16);return f};
})();