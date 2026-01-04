// ==UserScript==
// @name         newtoki(manatoki) viewer & downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  newtoki(manatoki) viewer & downloader & adblock & more!
// @author       You
// @include        http*://manatoki*
// @include        http*://newtoki*
// @grant GM_download
// @downloadURL https://update.greasyfork.org/scripts/415252/newtoki%28manatoki%29%20viewer%20%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/415252/newtoki%28manatoki%29%20viewer%20%20downloader.meta.js
// ==/UserScript==
// adblock
$('.hd_pops').remove()  
$('.board-tail-banner').remove()
$('.basic-banner.row.row-10').remove()
let linklist = localStorage.getItem('clickedlist'); // get clicked element
// append download button
var sendBtn = document.createElement("button");
sendBtn.className = "btn btn-warning";
sendBtn.style.zIndex = "3";
sendBtn.style.position = "fixed";
sendBtn.style.bottom = "0";
sendBtn.style.right = "0";
sendBtn.innerText = "download";
let clicked, clickedlist = JSON.parse(localStorage.getItem("clickedlist"));
if (clickedlist == null) {  
    clickedlist = []
    console.log("welcome")
}
// check whether user is at viewpage 
if (!$("[class ='view-content1']")[0]) {
    document.getElementById("main-banner-view").appendChild(sendBtn);
    let m = clickedlist.some(function (item) {
        return item[0] === document.URL
    });
    if (m == false) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        clickedlist.push([document.URL, dateTime])
        localStorage.setItem("clickedlist", JSON.stringify(clickedlist))
        console.log(clickedlist)
    }
    else {
        console.log("you've visited")
    }
}

if ($("[class ='view-content1']")[0]){
    for (let i=0; i < clickedlist.length; i ++) {
        // console.log(typeof clickedlist[i])
        if ($('a[href*="' + clickedlist[i][0] + '"]')[0]){
            $('a[href*="' + clickedlist[i][0] + '"]')[0].style.color = "blue"
            $('a[href*="' + clickedlist[i][0] + '"]')[0].text += "("+clickedlist[i][1]+")";
        }
    }
    console.log(clickedlist)
    // let linkBtn = $("[class='item-subject']")
    // // $(document).on('click', 'a', false);
    // linkBtn.click(function (e) {
    //     console.log(e.target.getAttribute("href"))
    //     clicked = e.target.getAttribute("href")
    //     if (clickedlist.includes(clicked) == false){
    //         clickedlist.push(clicked)
    //     }
    //     // clicked.style.color = "blue";
    //     console.log(clickedlist)
    //     window.localStorage.setItem("clickedlist", JSON.stringify(clickedlist))    
    // });
}
var regex = /\d+/g, mnum = (parent.window.location.pathname != "/") ? parent.window.location.pathname.match(regex)[0] : 0;
console.log(mnum)
// get page title and manga number
sendBtn.onclick = function() {
    // let canvas = $("img[src*='/data/file/comic'][src*="+mnum+"]").not("img[src*='thumb']")
    var title = document.getElementsByClassName('page-desc')[0].innerHTML
    let canvas = $("img[src*='/data/']").not("img[src*='thumb']"), loadimg = $('img[src$="/img/loading-image.gif"]'), countedword = {}
    // check if loading is completed
    if (loadimg.length <= 1) {
        // get every image which contains '/data/' and classify with parentNode inside the object
        for (let i = 0; i < canvas.length; i++) {
            var word = canvas[i].parentNode
            if (countedword[word.className] == undefined) {
                countedword[word.className] = 1;
            } else {
                countedword[word.className] += 1;
            }
        }
        //get the manga image from the object
        let a = 0, viewdiv = Object.keys(countedword)[1]
        console.log(viewdiv);
        console.log(countedword)
        // download every manga images every 0.3 sec
        for (let i = 0; i < canvas.length; i++) {
            (function(x) {
                setTimeout(function() {
                    let word = canvas[i].parentNode
                    if (word.className == viewdiv) {
                        a += 1
                        var blob = canvas[i].currentSrc
                        let arg = {
                            url: blob,
                            name: title + a
                        };
                        GM_download(arg)
                    }
                }, 300 * x);
            })(i);
        }
    } else {
        alert("wait for loading...")
    }
};
