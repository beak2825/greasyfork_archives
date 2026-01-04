// ==UserScript==
// @name         勋章保存展示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  先在背包保存勋章页面元素，然后在商城可以看到展示
// @author       You
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=my
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469963/%E5%8B%8B%E7%AB%A0%E4%BF%9D%E5%AD%98%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469963/%E5%8B%8B%E7%AB%A0%E4%BF%9D%E5%AD%98%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    'use strict';
    if (location.href == `https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=my`) {
        let btn = document.createElement('button');
        btn.textContent = '保存';
        btn.addEventListener('click', () => {
            save()
        });
        document.querySelector("#medalid_f > div.my_fenlei > div.my_biaoti").appendChild(btn)
    }
    if (location.href == `https://www.gamemale.com/wodexunzhang-showxunzhang.html`
        && (localStorage.getItem("my_fenlei") != null) && (localStorage.getItem("my_fenlei") != undefined)) {
        var my_fenlei = localStorage.getItem("my_fenlei")
        var div = new DOMParser().parseFromString(my_fenlei, 'text/html').documentElement;
        var e = document.getElementById("medalid_f")
        e.appendChild(div)
    }

})();


function save() {
    let result = null
    let Timely = ["送情书", "丢肥皂", "千杯不醉", "灵光补脑剂", "遗忘之水", "萨赫的蛋糕", "神秘商店贵宾卡", "变骚喷雾", "没有梦想的咸鱼", "闪光糖果盒", "茉香啤酒", "炼金之心", "黑暗交易", "水泡术", "召唤古代战士", "祈祷术", "吞噬魂魄", "咆哮诅咒", "霍格沃茨五日游", "石肤术", "雷霆晶球", "思绪骤聚", "『户口本: Lv7+』", "『户口本: Lv2-6』", "『日心说』"]
    $.ajax({
        type: "get",
        url: "https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=my",
        cache: false,
        async: false,//同步请求
        dataType: "text",
        success: function (data) {   // data是形参名，代表返回的数据
            var dom = document.createElement('div');
            dom.innerHTML = data;
            let my_fenlei = dom.getElementsByClassName("my_fenlei")[0]
            let mybloks = my_fenlei.getElementsByClassName("myfldiv clearfix")[0]//子节点为myblock
            let numTocheck = mybloks.childNodes.length
            //遍历
            for(let i=0;(i<numTocheck)&&(mybloks.children[i]!=undefined)&&(mybloks.children[i]!=null);i++){//神秘越界
                let medalName = mybloks.children[i].children[0].children[1].children[0].innerHTML
                if(Timely.indexOf(medalName) > -1){
                    //清除限时勋章
                    mybloks.children[i].remove(); i--;
                }
            }
            localStorage.setItem("my_fenlei", my_fenlei.outerHTML)
            alert(`保存成功`)
            result = my_fenlei;


        },
        error: function (error) {
            console.log(error);
            result = error
        }
    });
    return result;
}
