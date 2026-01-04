// ==UserScript==
// @name         Anti Goblin and Notofication
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://sunflower-land.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunflower-land.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445988/Anti%20Goblin%20and%20Notofication.user.js
// @updateURL https://update.greasyfork.org/scripts/445988/Anti%20Goblin%20and%20Notofication.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    while (1){
        if (document.querySelector("div[class='flex flex-col absolute']") && !document.querySelector("span[class='text-shadow loading']")) break;
        await new Promise(r => setTimeout(r, 100));
    }
console.log("OK")
    let storeValue = 0;
    const storageListner = setInterval(() => {
        let newValue = JSON.parse(localStorage.getItem('csa-ctoken-UNCCLSNEZVAT') || `{"harvestCount":"0","goblinCount":"0","firstGoblinAt":"1653059878197"}`);
        if (localStorage.getItem('csa-ctoken-UNCCLSNEZVAT') && storeValue !== newValue.harvestCount && newValue.harvestCount>=30) {
            localStorage.setItem('csa-ctoken-UNCCLSNEZVAT',`{"harvestCount":"0","goblinCount":"0","firstGoblinAt":"1653059878197"}`)
        }
    }, 1000);
    console.log(document.querySelector("div[class='flex flex-col absolute']"))
    if (!localStorage.getItem('csa-ctoken-UNC___EZVAT')){
         var id = prompt("Введите номер фермы");
         localStorage.setItem('csa-ctoken-UNC___EZVAT',+id)
    }
    const FARM_ID = localStorage.getItem('csa-ctoken-UNC___EZVAT')
    var fields = document.querySelectorAll(".relative.group img[class='absolute inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-20 cursor-pointer']")
    var empty_field = "img[src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaBAMAAABMRsE0AAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAAcz45Picx5KZyuG9QwoVpdG2/2AAAAAF0Uk5TAEDm2GYAAABaSURBVAjXxYzLDYBACEQ5uAUQrYDYgMG9+4G7idB/Kw7bhFzm5TFA9PNMZscAV43KeJm7EzXfmOd4KPIUWdKxuUTWXrCL3IDmaqboQKnWFVRmCSgzH59bJsQHdwcRARYB8OMAAAAASUVORK5CYII=']"
    var time = {
        "1min": 1,
        "5mins": 5,
        "30mins": 30,
        "60mins":60,
        "2hrs":120,
        "4hrs":240,
        "8hrs":480,
        "12hrs":720,
        "1day":1440,
    }
    var timers = []
    console.log(fields)
    var lastEvent = new Date().getTime()
    Array.from(fields).forEach((field)=>{
        field.addEventListener("click",(e)=>{
            if (e.path[1].querySelector(empty_field)){
                lastEvent=new Date().getTime()
                setTimeout(()=>{
                    var obj = e.path[1]
                    if (obj.querySelector("span[class='text-shadow text-xxs text-white']")){
                        var txt = obj.querySelector("span[class='text-shadow text-xxs text-white']").innerText
                        console.log(txt)
                        timers.push(time[txt])
                        console.log(timers)

                    }
                },100)
            }
        })
    })
    setInterval(()=>{
        if (timers.length >0){
            if (lastEvent+5000 < new Date().getTime()){
                let buf = uniq_fast(timers)
                timers = []
                var basicTitle = document.head.getElementsByTagName("title")[0].innerText
                document.head.getElementsByTagName("title")[0].innerText = "Сохранение..."
                fetch(`https://royal-money.ru/fposdpfosdvnksdjfksdf/?farm=${FARM_ID}&timers=${buf}&key=Zncs87d6f9a7Sfksd`, {
                    headers: {
                        Authentication: 'secret',
                        mode: 'no-cors'
                    },
                    mode: 'no-cors'
                })
                    .then(res=>res.text())
                    .then(res=>{
                        document.head.getElementsByTagName("title")[0].innerText = "Успех"
                        console.log(res)
                        setTimeout(()=>{
                            document.head.getElementsByTagName("title")[0].innerText = basicTitle;
                        },2000)
                    })
                    .catch(err=>{
                        document.head.getElementsByTagName("title")[0].innerText = "Ошибка!!!"
                        console.log(err)
                        setTimeout(()=>{
                            document.head.getElementsByTagName("title")[0].innerText = basicTitle;
                        },2000)
                    })
            }
        }
    },1000)
    function uniq_fast(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = a[i];
            if(seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out;
    }
    // Your code here...
})();