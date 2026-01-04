// ==UserScript==
// @name         腾讯课堂自动献花
// @namespace    https://liuyuhong.ml
// @version      0.1
// @description  try to take over the world!
// @author       LiuYuHong
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402790/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%8C%AE%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/402790/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%8C%AE%E8%8A%B1.meta.js
// ==/UserScript==
(function() {
    var i =1;
    var p = document.createElement("button");
    setTimeout(()=>{document.querySelector("#toolbar").appendChild(p);document.querySelector("#toolbar > button:nth-child(6)").setAttribute('id','lyh');},3000);
    setInterval(function(){
        i++;
        /*document.querySelector("#toolbar > button:nth-child(4)").setAttribute('class','toolbar-icon')*/
        document.querySelector("#toolbar > button:nth-child(4)").click();
        document.getElementById("lyh").innerHTML = i;
    },3000)
})();
