// ==UserScript==
// @name         补答案审核+抢题检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baichuanweb.com/produce/myTask
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/418777/%E8%A1%A5%E7%AD%94%E6%A1%88%E5%AE%A1%E6%A0%B8%2B%E6%8A%A2%E9%A2%98%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418777/%E8%A1%A5%E7%AD%94%E6%A1%88%E5%AE%A1%E6%A0%B8%2B%E6%8A%A2%E9%A2%98%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        var div1 = document.createElement("div");
        div1.style.fontSize = "18px";
        div1.style.float = "left";
        var div2 = document.createElement("div");
        div2.style.fontSize = "18px";
        div2.style.float = "right";
        setTimeout(function(){
            document.getElementsByClassName("data-cont")[0].appendChild(div1);
            document.getElementsByClassName("data-cont")[0].appendChild(div2);
		},100);
        var b = true;
        var x ;
        setInterval(function(){
            axios.get("https://www.baichuanweb.com/editzuoye/api/submitreceiveproject?type=book_acheck&token=edbee97f03c5d8a06cea528c32d059a5").then(function (response) {
                div1.innerText = response.data.errInfo;
                console.log(response.data.errInfo);
            }).catch(function (error) {
                //console.log(error);
                div1.innerText = error;
            });
            axios.get("https://www.baichuanweb.com/bcproduceowapi/project/getmyprojectlist").then(function (response) {
                //console.log(response.data.data.list.length)
                if(response.data.data.list.length > 0){
                   var id = response.data.data.list[0].id;
                    if(response.data.data.list[0].doable == 0){
                        div2.innerText = "正在抢 " + id + " 当前同时抢" + response.data.data.list.length + "个";
                    }else{
                        //div2.innerText = "本次抢了" + response.data.data.list.length + "个";
                        var inte = response.data.data.list.length;
                        axios.get("https://www.baichuanweb.com/editzuoye/moduleapi/getbookanswercheckcontent?pid="+id+"&page=1&pagenum=33&ischeck=0").then(function (response) {
                            var num = response.data.data.num;
                            if(b == true){
                                x = response.data.data.num;
                                //console.log(num)
                                b = false;
                            }
                            if(num == 0){
                                b = true;
                            }
                            div2.innerText = "共"+ inte +"个 id = " + id + " 共有 " + x + " 道题,还剩下 " + num + " 未做";
                        });
                    }
                }else {
                    div2.innerText = "正在抢...";
                }

            });
        },100);


        /*
        var x = false;
        setInterval(function(){
            axios.get("https://www.baichuanweb.com/bcproduceowapi/project/getmyprojectlist").then(function (response) {
                if(x == false && response.data.data.list.length != 0 && response.data.data.list[0].doable == 1){
                    let audio = document.createElement('audio');
                    audio.src = "http://www.0dutv.com/plug/down/up2.php/102425546.mp3";
                    audio.autoplay = "autoplay";
                    document.body.appendChild(audio);
                    //audio.play();
                    audio.onended = function(){
                        audio.play();
                    }
                    x = true;
                }
            });
        },2000);
        */
    };
    // Your code here...
})();