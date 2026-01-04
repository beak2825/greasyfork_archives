// ==UserScript==
// @name         No more work on google classroom!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  It breaks your google classroom so now you have an excuse to not do work! (You can deactivate it)
// @author       iloverats1234
// @match        https://classroom.google.com/*
// @license                  MIT
// @compatible               chrome
// @compatible               firefox
// @compatible               opera
// @compatible               safari
// @compatible               microsoft edge
// @compatible               internet explorer
// @downloadURL https://update.greasyfork.org/scripts/456644/No%20more%20work%20on%20google%20classroom%21.user.js
// @updateURL https://update.greasyfork.org/scripts/456644/No%20more%20work%20on%20google%20classroom%21.meta.js
// ==/UserScript==
let fakeError=setInterval(function(){
    const phrases=[
        "Google has detected an error",
        "Error X000001 has occured,  reloading...",
        " Google has found an unexplainable problem with Classrooms. Error code X000001",
    ]
    setTimeout(function(){alert(phrases[Math.floor(Math.random() * phrases.length)]);location.reload();},2000)
    let classes_container=document.getElementsByClassName("JwPp0e")[0]
    classes_container.innerHTML="";
    document.getElementsByClassName("bg6sud")[0].innerText="";
    if(classes_container.innerHTML.includes("R4EiSb")==false){
        clearInterval(fakeError);
        document.getElementsByClassName("GmuOkf")[0].onclick=function(evt){
            evt.preventDefault();
            location.reload();
        }
        console.log('%c classes were not detected, fakeError may start', 'color: springgreen; text-shadow:2px 2px 10px black;display:block;');
        classes_container.innerHTML=`
<div id='container'>
<h1 id="title">oops..</h1><br/>
<p>An unexpected error has occured<br/>Please try again later...<p><br/>
<img id="error-img"><br/>
<a href="/">Retry</a>
</div>`;
 
 
        var container=document.getElementById("container");
        var title=document.getElementById("title");
        var img=document.getElementById("error-img");
        var imgs=[
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMEt3g7qRMG6sSQNGeIOLGss9NAEwqp2RJXw&usqp=CAU",
            "https://optinmonster.com/wp-content/uploads/2018/06/11-brilliant-404-pages-to-turn-lost-visitors-into-loyal-customers-2.png"
        ]
        container.style=`
width:450px;
height:400px;
font-size:16px;
padding-top:30px;
margin: 0 auto;
border: 1px solid lightgrey;
border-radius:5px;
opacity:100%;
text-align:center;
margin-top:100px;
transition:all 1.7s;
        `
        title.style=`
color:red;
font-size:30px;
margin-left:-10px;
margin-bottom:20px;
`
        img.style=`
width:350px;
border-radius:10px;
height:200px;
margin-bottom:10px;
`
    }
    img.src=imgs[Math.floor(Math.random()*imgs.length)]
},1700)
 
 
 
 
 
 
 
 