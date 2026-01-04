// ==UserScript==
// @name         采集店匠
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1
// @author       You
// @match        https://www.sheelves.com/search?q=loki
// @match        https://www.wuvyle.com/*
// @icon         https://www.google.com/s2/favicons?domain=sheelves.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432338/%E9%87%87%E9%9B%86%E5%BA%97%E5%8C%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/432338/%E9%87%87%E9%9B%86%E5%BA%97%E5%8C%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let s;
    function printA(){
        var a = document.querySelectorAll("[data-track-id]")
        a.forEach((i)=>{
            //图片链接a[0].dataset.srcset.split(",")[0].replace(/_360x.jpeg 48w/i,"_800x.jpeg")
            //商品名称 a[0].parentNode.href.match(/products\/(.*)_.*/i)[1].replace(/-/g, " ").toUpperCase()
            //价格：a[0].parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.match(/\d\d\.\d\d/i)[0]
            //b.push(i.alt + "," + i.src.replace("160w","960w"))})
            //if(i.dataset.srcset.split(",")[0]) var img = i.dataset.srcset.split(",")[0].replace(/_360x.jpeg 48w/i,"_800x.jpeg")
            try{
                //var img = i.querySelector("img").dataset.srcset.split(",")[0].replace(/_360x[_nw]*.jpeg 48w/i,"_800x.jpeg").replace("_180x","").replace("_180","").replace(" 180w","")
                //console.log("dataset:",i.querySelector('img').dataset.src)
                var img = i.querySelector('img').dataset.srcset.match(/.*?jpeg/)[0]
                img = img.replace("_180","").replace("//","https://")
                }catch(err){
                    img = i.querySelector('img').dataset.src.match(/.*?jpeg/)[0]
                    img = img.replace("_{width}","").replace("//","https://")
                }
            try{
                var name = i.dataset.trackName
            }catch(err){console.log("i2:",i);console.log("loading...")}
            var price = i.dataset.trackPrice
            //if(i.parentNode.href.match(/products\/(.*)_.*/i)[1]) var name = i.parentNode.href.match(/products\/(.*)_.*/i)[1].replace(/-/g, " ").toUpperCase()
            //if(i.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText) var price = i.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.match(/\d\d\.\d\d/i)[0]
            //b.push( name + "," + img + "," + price)
            //console.log( name + "," + img + "," + price)
            s += name + "," + img + "," + price + '\n'
        })
        console.log(s)
    }
    //var b = []

    var main = document.querySelector(".page_container")
    var div = document.createElement("div")
    var btn = document.createElement("button")
    main.parentNode.insertBefore(div, main)
    main.parentNode.insertBefore(btn, main)
    div.style.display = "none"
    div.style.position = "absolute"
    div.style.background = "white"
    div.style.paddingTop = "40px"
    div.style.zIndex = 999
    btn.innerText = "Toggle"
    btn.style.zIndex = 999999
    btn.style.position = "absolute"

    btn.onclick = ()=>(printA())
})();