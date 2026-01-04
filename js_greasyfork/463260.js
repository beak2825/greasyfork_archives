// ==UserScript==
// @name         Tostes mods
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom profile pics & help with every single lesson 😋
// @author       GSRHackZ
// @match        https://www.ixl.com/*
// @icon         https://image.flaticon.com/icons/svg/972/972217.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463260/Tostes%20mods.user.js
// @updateURL https://update.greasyfork.org/scripts/463260/Tostes%20mods.meta.js
// ==/UserScript==

const header = document.getElementsByClassName("box-site-nav-func")[0];
const profPics = document.getElementsByClassName("user-avatar")
const current=document.getElementsByClassName("user-nav-current-user")[0];
const init=document.getElementsByClassName("lk-profile-settings")[0];
const body = document.body;
const testImg = document.createElement("img");
current.style="display:flex;align-items:center;";
body.append(testImg);
let imgs = [],img,currentImg;
if(localStorage.getItem("imgs")!==null){
    imgs = JSON.parse(localStorage.getItem("imgs"));
}
if(localStorage.getItem("currImg")!==null){
    setImg(localStorage.getItem("currImg"));
}


init.innerText = "Profile, Settings, & Customization";

init.addEventListener("click",function(){
    setTimeout(function(){
        let imgsBox = document.getElementsByClassName("noborder nobkrnd spacertop")[0];
        if(imgs.length>0){
            imgsBox.innerHTML=`<h1 style="font-size:20px;">IXL ModZ By GSRHackZ</h1><br>`;
            imgsBox.style="width:100%;height:auto;padding:5px;padding-top: 25px;text-align:center;"
            for(let i=0;i<imgs.length;i++){
                let imgDisplay = document.createElement("div");
                imgDisplay.innerHTML=`<img class="imGsr" style="width:100%;height:100%;" src=${imgs[i]} />`
                imgDisplay.style=`
                width:120px;
                height:120px;
                border-radius:50%;
                overflow:hidden;
                display:flex;
                align-items:center;
                justify-content:center;
                margin:15px;
                float:left;
                cursor:pointer;
                transition:.6s;
                `
                imgsBox.append(imgDisplay)
            }
            let imGsr = document.getElementsByClassName("imGsr");
            for(let i=0;i<imGsr.length;i++){
                imGsr[i].addEventListener("mouseover",function(){
                    this.parentElement.style.boxShadow="2px 2px 8px grey"
                })
                imGsr[i].addEventListener("mouseleave",function(){
                    this.parentElement.style.boxShadow="none"
                })
                imGsr[i].addEventListener("click",function(){
                    setImg(this.src);
                    picked(imGsr);
                })
                let del = document.createElement("button");
                del.className="delImg";
                del.innerText="X"
                del.style="font-weight:500;position:absolute;margin-top:-100px;margin-right:-80px;color:red;background:white;outline:none;border:none;border-radius:50%;box-shadow:1px 1px 10px grey;display:flex;align-items:center;justify-content:center;"
                imGsr[i].parentElement.append(del)
            }
            picked(imGsr);
            if(document.getElementsByClassName("resetImgs")[0]==undefined){
                let resetBtn = document.createElement("button");
                resetBtn.className="resetImgs";
                resetBtn.innerText="Reset 🗑";
                resetBtn.style=`
            font-size:15px;
            padding:.46em 1.5em .54em;
            min-width:135px;
            box-sizing:border-box;
            border:none transparent;
            text-decoration:none;
            background: red;
            color:white;
            border-radius:5px;
            -webkit-font-smoothing:antialiased;
            transition: .1s linear box-shadow;
            display: inline-block;
            line-height: normal;
            white-space:nowrap;
            font: 400 13.3333px Arial;
            -webkit-writing-mode: horizontal-tb !important;
            zoom: 1;
            vertical-align: baseline;
            text-align:center;
            -webkit-user-drag: none;
            float:left;
            margin:10px;
            `;
                let ft = document.getElementsByClassName("ft")[0];
                ft.append(resetBtn)
                let reset = document.getElementsByClassName("resetImgs")[0];
                reset.addEventListener("click",function(){
                    let ask = confirm("This will remove all your saved images. Click ok to continue.")
                    if(ask){
                        localStorage.removeItem("imgs");
                        localStorage.removeItem("currImg");
                        location.reload();
                    }
                })
            }
            let x = document.getElementsByClassName("delImg");
            for(let i=0;i<x.length;i++){
                x[i].addEventListener("click",function(){
                    imgs.splice(i,1)
                    this.parentElement.remove();
                    localStorage.setItem("imgs",JSON.stringify(imgs));
                })
            }
        }
        else{
            imgsBox.children[0].innerText="Saved images will appear here. You have no images. Please save some."
        }
    },450)
})

let inp = document.createElement("input");
inp.style=`
width:200px;
border:.5px solid lightgrey;
box-shadow:.5px .5px .5px grey;
border-radius:5px;
padding:5px;
padding-left:6px;
color:grey;
outline:none;
margin:10px;
transition:.6s;
`;
inp.placeholder="Add Profile Picture...";
inp.addEventListener("blur",function(){
    this.style.letterSpacing="0px";
    this.style.color="grey"
    this.style.border=".5px solid lightgrey"
    this.style.boxShadow=".5px .5px .5px grey;"
    if(!this.value.trim().length>0){
        this.value="";
    }
})
inp.addEventListener("focus",function(){
    this.style.letterSpacing="1px";
    this.style.color="#00affa"
    this.style.border="1px solid #00affa"
    this.style.boxShadow=".5px .5px .5px #00affa;"
    if(!this.value.trim().length>0){
        this.value="";
    }
})
inp.addEventListener("keyup",function(evt){
    if(evt.keyCode==13){
        if(inp.value.trim().length>0){
            img = inp.value;
            filter(inp,testImg,img);
        }
    }

})
if(profPics[0]!==undefined){
    header.append(inp)
}





function picked(imgs){
    for(let i=0;i<imgs.length;i++){
        if(imgs[i].src==currentImg){
            imgs[i].parentElement.style.border="2px solid springgreen";
        }
        else{
            imgs[i].parentElement.style.border="2px solid transparent";
        }
    }
}

function many(func,times){
    for(let i=0;i<times;i++){
        eval(func)
    }
}
function filter(inp,elem,src){
    elem.src=src;
    elem.onload = function(){
        save(src)
        inp.value="";
    }
    elem.onerror = function(){
        console.clear();
        console.log("Cleared annoying IXL error msg...🤦‍♂️");
        alert("You have received this error for one or all of these reasons: \n\n1. Invalid Img Address 🙈\n\n2. IXL does not allow images that aren't coming driectly from google. Please use images only from google Images. 😋 \n\n Please try again...");
        inp.value="";
    }
}
function save(img){
    if(!imgs.includes(img)){
        imgs.push(img);
        localStorage.setItem("imgs",JSON.stringify(imgs));
    }
    setImg(img)
}
function setImg(src){
    for(let i=0;i<profPics.length-1;i++){
        profPics[i].src=src;
        profPics[i].style="margin-top:-3px;border-radius:50%;display:flex;justify-content:center;align-items:center;width:45px;height:45px;";
    }
    currentImg = src;
    localStorage.setItem("currImg",currentImg);
}

let isClicked=false;

const methods=[
    {
        'name':'Youtube',
        'url':'https://www.youtube.com/results?search_query=',
        'img':'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQxvNnYVOApJlNiBES9skleujV-jwsAQ7KlcA&usqp=CAU'
    },
    {
        'name':'Google',
        'url':'https://www.google.com/search?q=',
        'img':'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS_cun8R9jHc3KznCx3CLskWUG-YrkNT8SLgA&usqp=CAU'
    },
    {
        'name':'Khan Academy',
        'url':'https://www.khanacademy.org/search?search_again=1&page_search_query=',
        'img':'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTpKdFRxBPuuwLl4lSpQa4TPnz4tDilNNHXlQ&usqp=CAU'
    }
];

if(document.getElementsByClassName("take-a-break")!==undefined){
    let check=document.getElementsByClassName("take-a-break")[0];
    let lesson=document.getElementsByClassName("breadcrumb-skill-name")[0].innerText;
    check.innerHTML="<button id='help-btn' style='border:1px solid #7ebb00;width:55px;padding:5px;opacity:56%;outline:none;border-radius:100px;transition:.6s;'>Help</button>";
    let help=document.getElementById("help-btn");
    help.onmouseover=function(){
        help.style.opacity="100%";
    }
    help.onmouseout=function(){
        help.style.opacity="56%";
    }
    help.addEventListener('click',function(){
        if(!isClicked){
            this.innerText="Close";
            isClicked=true;
            let box=document.createElement('div');
            box.setAttribute('id','box-help')
            box.style="background:white;display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;z-index:5;width:200px;height:425px;padding:5px;border:1px solid lightgray;border-radius:10px;right:0;margin-top:175px;margin-right:50px;";
            document.body.append(box);
            box.innerHTML=methods.map(method => {
                return `
                       <a style="outline:none;border:none;" target="_Blank" href="${method.url+lesson}">
                         <img style="height:140px;object-fit:contain;outline:none;border:none;" title=${method.name} src=${method.img} alt="${method.name}"/>
                      </a>
                `;
            }).join('');
        }
        else{
            isClicked=false;
            this.innerText="Help"
            document.getElementById("box-help").remove();
        }
    })
}
