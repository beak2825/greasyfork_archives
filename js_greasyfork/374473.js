// ==UserScript==
// @name         UNFOLLOW ALL
// @namespace    https://twitter.com
// @version      0.2
// @description  UNFOLLOW ALL IN ONE CLICK ON TWITTER
// @author       Sultan Alrefaei
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374473/UNFOLLOW%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/374473/UNFOLLOW%20ALL.meta.js
// ==/UserScript==

var state = true;
var isFollowing = false;
var isCounter = false;
const btnStyle = "position: fixed; z-index: 10000;"
                + "top: 80px; left: -116px;"
                + "background-color: #e0245e;"
                + "color: white; padding: 10px;"
                + "border-radius: 20px;"
                + "box-shadow: 0px 1px 5px #00000052;"
                + "border-radius: 0 20px 20px 0;"
                + "border: none;"
                + "padding-left: 25px;"
                + "padding-right: 15px";

window.onload = ()=>{
    if (location.href.includes("/following")){
        if (document.getElementById("btnRetweet") == null){
            createUIBTN();
        }
    }
};

setInterval( ()=>{
    if (document.getElementById("btnRetweet") != null){
        var following = document.getElementsByClassName("including") || document.getElementsByClassName("following");
        if (following.length != 0){
            document.getElementById("btnRetweet").innerHTML = "Unfollowing All <span style='padding-left: 6px;'>" + following.length + "</span>";
            isCounter = true;
        }else{
            if (!isCounter){
                if (document.getElementById("btnRetweet").innerHTML.includes("Unfollowing All 0")){
                    document.getElementById("btnRetweet").innerHTML = "Unfollowing All 0";
                }
            }
        }
    }
    if (!location.href.includes("/following")){
        if (document.getElementById("btnRetweet") != null){
            document.getElementById("btnRetweet").remove();
        }
    }else{
        if (state){
            if (document.getElementById("btnRetweet") == null){
                createUIBTN();
                state = false;
            }
        }else{
            state = true;
        }
    }
}, 100);

const createUIBTN = () =>{
    var following = document.getElementsByClassName("including") || document.getElementsByClassName("following");
    const btn = document.createElement("button");
    btn.setAttribute("id", "btnRetweet");
    btn.setAttribute("style", btnStyle);
    btn.addEventListener("click", e =>{
        var following = document.getElementsByClassName("including") || document.getElementsByClassName("following");
        if (following.length != 0){
            if (confirm("Are you sure?")) {
                remvoeRetweet();
            } else {
                return false;
            }
        }
    });
    btn.addEventListener("mouseenter", e =>{
        if (following.length == 0){
            e.target.style.left = "-116px";
            e.target.style.cursor = "default";
        }else{
            e.target.style.cursor = "pointer";
            e.target.style.left = "0";
        }
    });
    btn.addEventListener("mouseleave", e =>{
        e.target.style.left = "-116px";
        var following = document.getElementsByClassName("including") || document.getElementsByClassName("following");
        if (following.length == 0){
            e.target.style.cursor = "default";
        }else{
            e.target.style.cursor = "pointer";
        }
    })
    btn.innerHTML = "Unfollowing All <span style='padding-left: 6px;'>" + following.length + "</span>";
    document.body.appendChild(btn);
};

const remvoeRetweet = () =>{
    var following = document.getElementsByClassName("including") || document.getElementsByClassName("following");
    var time = setInterval( ()=> {
        if (following.length != 0){
            for (var f = 0; f < following.length; f++){
                following[f].children[1].click();
            }
            isFollowing = true;
        }else{
            if (following.length == 0 && isFollowing){
                setTimeout( ()=>{
                    location.reload();
                }, 500);
            }
            clearInterval(time);
        }
    }, 100);
};