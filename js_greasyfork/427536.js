// ==UserScript==
// @name         Bonus Calculator
// @version      1.0
// @include      https://pt.btschool.club/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @description  A script of calulating bonus
// @author       rsj
// @match        https://pt.btschool.club/*
// @namespace https://greasyfork.org/users/779978
// @downloadURL https://update.greasyfork.org/scripts/427536/Bonus%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/427536/Bonus%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function calc(T,S,N){
        var T0,N0,L,B0;
        T0=200;N0=7;B0=100;L=1000;
        var std=(1-1/Math.pow(10,T/T0))*(1+Math.sqrt(2)/Math.pow(10,(N-1)/(N0-1)));
        var A=std*S;
        var B=B0*2/Math.PI*Math.atan(A/L);
        return std;
    }
    function convertsize(size){
        if(size.indexOf("TB")!=-1) return size.substring(0,size.indexOf("TB"))*1024;
        if(size.indexOf("GB")!=-1) return size.substring(0,size.indexOf("GB"));
        if(size.indexOf("MB")!=-1) return size.substring(0,size.indexOf("MB"))/1024;
        if(size.indexOf("KB")!=-1) return size.substring(0,size.indexOf("KB"))/1024/1024;
        if(size.indexOf("B")!=-1) return size.substring(0,size.indexOf("B"))/1024/1024/1024;
        return 0;
    }
    function convertdate(date){
        var time=Date.parse(new Date());
        var curtime=Date.parse(new Date(date));
        var day=(time-curtime)/(1000*60*60*24*7);
        return day;
    }
    var torrents = $(".torrents > tbody > tr"),area = $(".torrents > tbody");
    var q=[],src=[];
    torrents.eq(0).find("> td").eq(2).after("<td id=\"delta_A\" class=\"colhead\"><a href='javascript:void(0)'>ΔA</a></td>");
    var rh = $("#delta_A");
    var head = torrents.eq(0);
    for(var i=1;i<torrents.length;i++){
        var torrent = torrents.eq(i);
        var rows = torrent.find("> td");
        var date = convertdate(rows.eq(3).find("span").attr("title"));
        var size = convertsize(rows.eq(4).text());
        var seeders = rows.eq(5).find("a").text();
        var bonus = calc(date,size,seeders);
        rows.eq(2).after("<td class=\"rowfollow\">"+(bonus*size).toFixed(4)+"</td>");
        var c={ content: torrent, number: bonus };
        q.push(c);
        src.push(c);
    }
    var sorted=0;
    q.sort(function(b,a){return a.number-b.number;});
    rh.get(0).addEventListener("click", function(){
        area.empty();
        area.append(head);
        if(sorted) for(i=0;i<src.length;i++) area.append(src[i].content);
        else for(i=0;i<q.length;i++) area.append(q[i].content);
        sorted=1-sorted;
    });
})();