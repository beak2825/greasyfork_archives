// ==UserScript==
// @name         论语网站js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Pikaqian
// @license      =P
// @match        https://lunyu.5000yan.com/
// @icon         https://5000yan.com/templets/default/lunyu/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430712/%E8%AE%BA%E8%AF%AD%E7%BD%91%E7%AB%99js.user.js
// @updateURL https://update.greasyfork.org/scripts/430712/%E8%AE%BA%E8%AF%AD%E7%BD%91%E7%AB%99js.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style=document.createElement("style"),background
    style.textContent=`
    #newElement{
    display:block;
    position:fixed;
    background-color:#fff;
    width:264px;
    height:500px;
    top:5px;
    padding:10px;
    transition:0.3s;
    right:-400px;
    overflow: auto;
    }::-webkit-scrollbar {
  display: none;
  }
    #background{
    display:block;
    position:fixed;
    background-color:#fff;
    width:264px;
    height:500px;
    transition:0.5s
    }
    #out_title{
    color: #000;
    display: block;
    position: fixed;
    z-index: 1;
    font-weight: 1000;
    transform: translate(10px,5px)
    }
    #out_content{
    color:#000;
    display: block;
    position: fixed;
    z-index: 1;
    width:246px;
    transition: 0.2s;
    font-size:15px;
    transform: translate(10px,50px)
    }
    #line{
    display:block;
    position:fixed;
    background-color:#000;
    width:249px;
    opacity:0.5;
    transform: translate(7px, 37px);
    z-index:1;
    height:1.5px
    }
    `
    document.body.appendChild(style)
    function addRightButton(){
        var newElement=document.createElement("div")
        newElement.id="newElement"
        document.body.appendChild(newElement)


        var line = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        line.setAttribute('viewbox', '0 0 24 24');
        line.setAttribute('width', '24px');
        line.setAttribute('height', '24px');
        line.id = 'line';
        document.getElementById("newElement").appendChild(line);



        var background=document.createElement("background")
        background.type="text"
        var out_title=document.createElement("out_title")
        out_title.id="out_title"
        var title=document.createTextNode("句子翻译");

        var out_content=document.createElement("out_content")
        out_content.id="out_content"
        var content=document.createTextNode("222");
        out_content.style.top="10px"

        document.getElementById("newElement").appendChild(out_title);
        document.getElementById("newElement").appendChild(out_content);
        document.getElementById("out_title").appendChild(title);
        document.getElementById("out_content").appendChild(content);

        background.setAttribute("aria-hidden","true");
        background.setAttribute('viewbox', '0 0 24 24');
        background.id = 'background';
        document.getElementById("newElement").appendChild(background);
    }
    addRightButton()

    window.addEventListener('contextmenu',function(event){
        if(event.ctrlKey==true&&event.target.parentNode.parentNode.className=="shouye"){
            var event_href=event.target.href
            GM_xmlhttpRequest({
                method: "GET",
                url: event_href,
                headers:{
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67"
                },
                onload: function(res) {
                    if(res.status === 200){
                        console.log('成功')
                        var p=res.responseText
                        //console.log(p)
                        var first=p.match('name="description"').index
                        var last=p.match('<title>').index
                        var translate=p.substring(first+28,last-6)
                        //console.log(translate)

                        document.getElementById("out_content").style.opacity="0"
                        setTimeout(function(){
                            document.getElementById("out_content").innerText=translate
                        },150)
                        setTimeout(function(){
                            document.getElementById("out_content").style.opacity="1"
                        },150)
                        document.getElementById('background').href=event_href
                        var back=document.getElementById("newElement")
                        back.style.transform="translateX(-420px)"
                    }
                    else{
                        console.log('失败')
                        console.log(res)
                        //fail()
                    }
                }
            })
            event.preventDefault()
        }
    })
    window.addEventListener('click',function(e){
        if(e.target.id=='background'){
            window.open(e.target.href,'_blank')
        }
    })
})();