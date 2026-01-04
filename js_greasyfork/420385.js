// ==UserScript==
// @name         Created Date
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://*/products/*
// @match        https://*/*/products/*
// @match        https://*/*/*/products/*
// @match        dearverde.com/*
// @match        https://www.chicme.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420385/Created%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/420385/Created%20Date.meta.js
// ==/UserScript==

(function() {
    let n = document.createElement("p")
    n.style.textAlign = "center"
    n.style.fontWeight = "bolder"
    n.style.width = "100%"
    n.style.background = "#222222"
    n.style.color = "#fff"
    n.style.position = "fixed"
    n.style.top = "180px"
//    n.style.left = "300px"
    n.style.zIndex = "9999"
    n.style.opacity = "0.35"
    n.innerText = "查询不到"
    n.addEventListener('click', function(){
      n.style.display = "none"
    })
    setTimeout(()=>{
      n.style.display = "none"
    },4000)
    let body = document.getElementsByTagName("body")
    body[0].parentNode.insertBefore(n, body[0])
    let res = null
    if (document.querySelector("#ProductJson-product-template") != null) {
        let data = document.querySelector("#ProductJson-product-template").innerText
        res = /created_at.*(\d{4}-\d\d-\d\d)/.exec(data);
        //alert(res[1]);console.log(res[1])
    } else if (document.querySelector("[data-product]") != null) {
        let doc = document.querySelector("[data-product]");let data = doc.attributes["data-product"].value;res = /created_at.*(\d{4}-\d\d-\d\d)/.exec(data);
        //alert(res[1]);console.log(res[1])
    } else {
        let data = document.documentElement.outerHTML
        res = /created_at.*(\d{4}-\d\d-\d\d)/.exec(data);
        if (res==null){
            let date = /product.*createDate.*?(\d{13})/.exec(data);
            //console.log("timestamp:",date)
            date = new Date(parseInt(date[1]))
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
            res = [0,date]
            console.log(date)
        }
    }
    if (res[1]) n.innerText = res[1]

/*
    function timetrans(date){
        var tdate = new Date(date);//如果date为13位不需要乘1000
        var Y = tdate.getFullYear() + '-';
        var M = (tdate.getMonth()+1 < 10 ? '0'+(tdate.getMonth()+1) : tdate.getMonth()+1) + '-';
        var D = (tdate.getDate() < 10 ? '0' + (tdate.getDate()) : tdate.getDate()) + ' ';
        var h = (tdate.getHours() < 10 ? '0' + tdate.getHours() : tdate.getHours()) + ':';
        var m = (tdate.getMinutes() <10 ? '0' + tdate.getMinutes() : tdate.getMinutes()) + ':';
        var s = (tdate.getSeconds() <10 ? '0' + tdate.getSeconds() : tdate.getSeconds());
        return Y+M+D+h+m+s;
    }
*/
})();