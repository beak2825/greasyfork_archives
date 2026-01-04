// ==UserScript==
// @name DART-Bux Compiler
// @version 1.8
// @description For viewing the debateart.com DART-Bux blockchain
// @author Perussi
// @match *://www.debateart.com/forum/topics/2664/*
// @grant none
// @namespace https://greasyfork.org/users/128061
// @downloadURL https://update.greasyfork.org/scripts/390162/DART-Bux%20Compiler.user.js
// @updateURL https://update.greasyfork.org/scripts/390162/DART-Bux%20Compiler.meta.js
// ==/UserScript==

var vUrl = 0;
var aa = 0;
var ab = 0;
var mvz = 0;
var hopper = 0;
var posts = 0;
var shed = 0;
var pgOpt = 0;
var db = 0;
var dis = ["#4","#5","#6","#8","#9","#10"];
var unam = 0;
var done = 0;

function tPage(){
    window.location.assign(window.location.pathname+"?page=2__DAB_Code:\u203D2^"+pgOpt+"\u203D");
}

function ePage(){
    window.location.assign("https://www.debateart.com/forum/topics/2664/dart-bux-blockchain-thread?page="+(shed[0]+1)+"__DAB_Code:\u203D"+(shed[0]+1)+"^"+pgOpt+"\u203D");
}

function dPage(){
    window.location.assign("https://www.debateart.com/forum/topics/2664/dart-bux-blockchain-thread?page="+shed[0]+"__DAB_Code:\u203D"+shed[0]+"^"+pgOpt+"\u203Ddone");
}

window.onload = function letThereBeLight(){
    vUrl = window.location.href;
    mvz = 0;
    shed = [0,[]];
    hopper = "no code";
    if(vUrl.substring(vUrl.length-4,vUrl.length) !== "done"){
    for(aa = 0; aa < vUrl.length; aa++){
        if(vUrl.substring(aa,aa+9) === "DAB_Code:" && mvz === 0){
            aa += 9;
            hopper = "";
            mvz = 1;
        }
        if(mvz === 1){
            hopper += vUrl.charAt(aa);
        }
    }
    if(hopper !== "no code"){
        hopper = hopper.slice(9,hopper.length-9);
        shed[0] = "";
        for(aa = 0; aa < hopper.length; aa++){
            if(hopper.charAt(aa) !== "^"){
                shed[0] += hopper.charAt(aa);
            } else {
                aa += hopper.length;
            }
        }
        hopper = hopper.slice(shed[0].length+1,hopper.length);
        Number(shed[0]);
    }

    posts = [];
    unam = [];
    for(aa = 0; aa < document.getElementsByClassName("forum-topic-show__forum-post__text").length; aa++){
        unam[aa] = document.getElementsByClassName("forum-topic-show__forum-post__author-username-link")[aa].children[0].innerHTML.slice(1,document.getElementsByClassName("forum-topic-show__forum-post__author-username-link")[aa].children[0].innerHTML.length-1);
        mvz = 1;
        for(ab = 0; ab < dis.length; ab++){
            if(document.getElementsByClassName("forum-topic-show__forum-post__anchor")[aa].innerText === dis[ab]){
                mvz = 0;
            }
        }
        for(ab = 0; ab < document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].innerHTML.length; ab++){
            if(document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].innerHTML.charAt(ab) === ":" && document.getElementsByClassName("forum-topic-show__forum-post__author-username-link")[aa].children[0].innerHTML !== " A-R-O-S-E "){
                mvz = 0;
            }
        }
        if(mvz === 1){
            if(document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].children[0] && document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].children[0].innerHTML !== "" && document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].children[0].innerHTML !== "<br>"){
                posts[aa] = document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].children[0].innerHTML;
            } else {
                posts[aa] = document.getElementsByClassName("forum-topic-show__forum-post__text")[aa].children[0].innerHTML;
            }
        }
    }
    for(aa = 0; aa < posts.length; aa++){
        mvz = "";
        if(posts[aa]){
            for(ab = 0; ab < posts[aa].length; ab++){
                if(posts[aa].substring(ab,ab+6) === "</div>" && 2 < ab){
                    ab += posts[aa].length;
                    posts[aa] = posts[aa].slice(6,posts[aa].length);
                } else {
                    mvz += posts[aa].charAt(ab);
                }
            }
        }
        posts[aa] = mvz;
    }
    for(aa = posts.length-1; -1 < aa; aa--){
        if(posts[aa]){
            if(posts[aa].charAt(0) !== "‽"){
                posts.splice(aa,1);
                unam.splice(aa,1);
            }
        } else {
            posts.splice(aa,1);
            unam.splice(aa,1);
        }
    }
    for(aa = 0; aa < posts.length; aa++){
        mvz = [0,1,["",""],""];
        if(posts[aa].charAt(1) === ":"){
            mvz[1] = 0;
        }
        for(ab = 0; ab < posts[aa].length; ab++){
            if(mvz[1] === 0){
                if(mvz[0] === 1 && posts[aa].charAt(ab) !== "‽"){
                    mvz[2][1] += posts[aa].charAt(ab);
                }
                if(mvz[0] === 0 && 1 < ab && posts[aa].charAt(ab) !== "‽"){
                    if(posts[aa].charAt(ab) === ":"){
                        mvz[0] = 1;
                    } else {
                        mvz[2][0] += posts[aa].charAt(ab);
                    }
                }
                if(posts[aa].charAt(ab) === "‽" && 0 < ab){
                    mvz[0] = 2;
                }
                if(mvz[0] === 2){
                    if(posts[aa].charAt(ab) === "0" || posts[aa].charAt(ab) === "1" || posts[aa].charAt(ab) === "2" || posts[aa].charAt(ab) === "3" || posts[aa].charAt(ab) === "4" || posts[aa].charAt(ab) === "5" || posts[aa].charAt(ab) === "6" || posts[aa].charAt(ab) === "7" || posts[aa].charAt(ab) === "8" || posts[aa].charAt(ab) === "9"){
                        mvz[3] += posts[aa].charAt(ab);
                    }
                }
            }
            if(mvz[1] === 1){
                if(posts[aa].charAt(ab) !== "‽" && mvz[0] === 0){
                    mvz[2][0] += posts[aa].charAt(ab);
                }
                if(mvz[0] === 1){
                    if(posts[aa].charAt(ab) === "0" || posts[aa].charAt(ab) === "1" || posts[aa].charAt(ab) === "2" || posts[aa].charAt(ab) === "3" || posts[aa].charAt(ab) === "4" || posts[aa].charAt(ab) === "5" || posts[aa].charAt(ab) === "6" || posts[aa].charAt(ab) === "7" || posts[aa].charAt(ab) === "8" || posts[aa].charAt(ab) === "9"){
                        mvz[3] += posts[aa].charAt(ab);
                    }
                }
                if(mvz[0] === 1 && posts[aa].charAt(ab) === "-"){
                    shed[1][shed[1].length] = aa;
                    ab += posts[aa].length;
                }
                if(posts[aa].charAt(ab) === "‽" && 0 < ab && mvz[0] === 0){
                    mvz[2][1] = unam[aa];
                    mvz[4] = mvz[2][0];
                    mvz[2][0] = mvz[2][1];
                    mvz[2][1] = mvz[4];
                    mvz[0] = 1;
                }
            }
        }
        Number(mvz[3]);
        posts[aa] = [mvz[2][0],mvz[2][1],mvz[3]];
    }
    for(aa = posts.length-1; -1 < aa; aa--){
        for(ab = 0; ab < shed[1].length; ab++){
            if(aa === shed[1][ab]){
                posts.splice(aa,1);
            }
        }
    }

    pgOpt = "";
    if(hopper !== "no code"){
      pgOpt = hopper+":";
    }
    for(aa = 0; aa < posts.length; aa++){
      if(aa !== posts.length-1){
        pgOpt += posts[aa][0]+">"+posts[aa][1]+">"+posts[aa][2]+":";
      } else {
        pgOpt += posts[aa][0]+">"+posts[aa][1]+">"+posts[aa][2];
      }
    }

    mvz = "";
    for(aa = 0; aa < document.getElementsByClassName("forum-topic-show__total-posts-number")[0].children[0].innerHTML.length; aa++){
        if(document.getElementsByClassName("forum-topic-show__total-posts-number")[0].children[0].innerHTML.charAt(aa) !== ","){
            mvz += document.getElementsByClassName("forum-topic-show__total-posts-number")[0].children[0].innerHTML.charAt(aa);
        }
    }
    Number(mvz);
    if(hopper !== "no code" && Math.ceil(mvz/25) !== 1){
        if(Math.ceil(Number(document.getElementsByClassName("forum-topic-show__forum-post__anchor")[0].innerText.slice(1,document.getElementsByClassName("forum-topic-show__forum-post__anchor")[0].innerText.length))/25) !== Math.ceil(mvz/25)){
           ePage();
           return;
        }
    }
    if(hopper === "no code"){
      tPage();
      return;
    }
    //document.getElementsByClassName("forum-topic-show__forum-post__text")[0].children[0].innerHTML = hopper;
    dPage();
    }
};