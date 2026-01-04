// ==UserScript==
// @name         csgoempire floater
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  check for low float items on the page
// @author       ShiniM0d0ri
// @match        https://csgoempire.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413112/csgoempire%20floater.user.js
// @updateURL https://update.greasyfork.org/scripts/413112/csgoempire%20floater.meta.js
// ==/UserScript==

//add webhook link
var webhook_link="https://discord.com/api/webhooks/xxxxxxxxxx"
//replace xx with your discord id
var discod_userid="<@xxxxxxxxxxxxxx>"

function beep() {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
            snd.play();
        }

function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

function sendMessage(msg) {
      var request = new XMLHttpRequest();
      request.open("POST", webhook_link);

      request.setRequestHeader('Content-type', 'application/json');

      var params = {
        //username: "",
        //avatar_url: "",
        content: msg
      }

      request.send(JSON.stringify(params));
}



window.addEventListener('keypress', function(e) {
    if(e.key==='1') {
        'use strict';

        // remove chatbox
        //document.getElementsByClassName("chat h-full z-30 chat--open")[0].remove();
        let mySet = new Set();
        let fv;
        var item_price=0;
        var count=0;
        async function main() {
            while(true){
                var i=0;
                console.log("running");
                fv=document.getElementsByClassName("wear-value");
                var wear=0;
                console.log(fv.length);
                for(i=0;i<fv.length;i++) {
                    if (fv[i]==='undefined') continue;
                    var string=fv[i].innerHTML.replace("~","");
                    wear=parseFloat(string).toFixed(3);
                    if((wear<0.05) || (0.07<wear && wear<0.11) || (0.15<wear && wear<0.19)) {
                        if(!mySet.has(wear)) {
                            beep();
                            await sleep(2000);
                            console.log(wear);
                            mySet.add(wear);
                            fv[i].style.background='red';
                        }
                    }
                }
                console.log(mySet);
                await sleep(4000);
                count++;
                if(count==50) {
                    count=0;
                    mySet.clear();
                }
            }
        }
        main();
    }
});


window.addEventListener('keypress', function(e) {
    'use strict';
    if(e.key==='2') {
        var textnode;
        var node;
        var items2=document.getElementsByClassName("item__name");
        var item_head=document.getElementsByClassName("item__head");
        var i=0;

        for (i=0;i<items2.length;i++) {
            if(items2[i].getElementsByTagName("a").length>0)
                continue;
            if(items2[i].innerText=="")
                continue;
            var wear=item_head[i].getElementsByClassName("item__quality");
            node = document.createElement("a");
            node.classList.add("text-xxs");
            node.classList.add("font-bold");
            node.classList.add("text-light-grey-1");


            var href="https://pricempire.com/search?q="+items2[i].innerText;
            if(items2[i].previousElementSibling==null);
            else
                href=href+" "+items2[i].previousElementSibling.innerText;
            href=href.replace("-"," ")
            if(item_head[i].innerText==="");
            else
            href=href+" "+wear[0].firstChild.innerText;

            node.setAttribute("href", href);
            node.setAttribute("target","_blank");
            textnode = document.createTextNode("Open");
            node.appendChild(textnode);
            node.style.backgroundColor = "blue";
            items2[i].appendChild(node);
            console.log(href);

            //items2[i].remove();
        }
    }
});


window.addEventListener('keypress', function(e) {
    'use strict';
    if(e.key==='3') {

        async function main() {
            var keyword=prompt("Enter keyword to hunt").toLowerCase()
            while(true) {
                console.log("searching: "+keyword);
                var balance=parseFloat(document.getElementsByClassName("balance")[0].outerText);
                var items3=document.getElementsByClassName("item--instant-withdraw");
                var k=0;
                for(k=0;k<items3.length;k++) {
                    var item_name3=(items3[k].getElementsByClassName("item__name")[0].previousElementSibling.innerText+" "+items3[k].getElementsByClassName("item__name")[0].innerText).toLowerCase();
                    var item_price3=parseFloat(items3[k].getElementsByClassName("item__price")[0].innerText.replace(",",""));
                    //if keyword found
                    if(item_price3<balance && item_name3.includes(keyword) ) {
                        console.log(item_name3+" found at "+item_price3);
                        console.log("available: "+balance+" coins");
                        beep();
                        items3[k].getElementsByTagName("img")[0].click();
                        await sleep(1000);
                        document.getElementsByClassName("trades-sidebar__foot")[0].lastChild.lastChild.click();
                        var msg=discod_userid+" go get your "+item_name3+" found at "+item_price3;
                        sendMessage(msg);
                        throw '';
                    }
                }
                await sleep(2000);
            }
        }
        main();
    }
});

//less percentage items
window.addEventListener('keypress', function(e) {
    'use strict';
    if(e.key==='4') {
        function less_pay(){
            console.log("running script #4")
            var p2p_items=document.getElementsByClassName("item item--trading");

            for(var i=0;i<p2p_items.length;i++) {
                var percent=parseInt(p2p_items[i].getElementsByTagName("button")[0].innerText);
                if (percent<=5) {
                    var wear_and_name=p2p_items[i].getElementsByClassName("px-2");
                    var float_value=parseFloat(wear_and_name[0].getElementsByClassName("wear-value")[0].innerText.replace("~","")).toFixed(3);
                    if (wear_and_name[1].innerText.includes("Rust Coat") || (float_value>0.300 && float_value<0.369))
                        continue;
                    var msg=discod_userid+" found "+wear_and_name[1].innerText+" "+wear_and_name[0].innerText+" at "+percent+"%";
                    sendMessage(msg);
                    clearInterval(stop_id);
                }
             }
        }
        var stop_id=setInterval(less_pay, 2000);
    }
});