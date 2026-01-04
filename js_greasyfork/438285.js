// ==UserScript==
// @name         Google Classroom Fake Error
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fake Error (No Need To Do Work!!)
// @author       Anthony Chavez
// @match        https://classroom.google.com/*
// @grant        none
// @license                  MIT
// @compatible               chrome
// @compatible               firefox
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/438285/Google%20Classroom%20Fake%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/438285/Google%20Classroom%20Fake%20Error.meta.js
// ==/UserScript==
let fakeError=setInterval(function(){
    const phrases=[
        "Trying To Fix Errror....",
        "Error X4j#r has occured,  reloading...",
        "(Fatal Error Has Occured) Error Code: #X0000",
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








