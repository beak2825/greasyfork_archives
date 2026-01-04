// ==UserScript==
// @name         csdn只看文章和評論
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  awful ads
// @author       ppdesu
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367984/csdn%E5%8F%AA%E7%9C%8B%E6%96%87%E7%AB%A0%E5%92%8C%E8%A9%95%E8%AB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/367984/csdn%E5%8F%AA%E7%9C%8B%E6%96%87%E7%AB%A0%E5%92%8C%E8%A9%95%E8%AB%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    //clear the aside
    setTimeout(()=>{

        var lists = [
            "header",
            "aside",
            ".csdn-toolbar",
            ".recommend-box",
            ".pulllog-box",
            ".tool-box",
            ".unlogin-box",
            ".edu-promotion"
        ];

        for(var i=0;i<lists.length;i++)
        {
            var ele = document.querySelector(lists[i]);
            console.log(lists[i]);
            if(ele != null)
            {
                ele.parentNode.removeChild(ele);
            }
            else
            {
                console.log(lists[i] + "aside query failed!");
                return;
            }
        }
        console.log("botton ads processing");
        function remove_bottom_ads()
        {
            var listsall = [
                "iframe"
            ];
            console.log("processing iframe");
            for(i=0;i<listsall.length;i++)
            {
                ele = document.querySelectorAll(listsall[i]);
                if(ele == null)continue;
                //while(ele.length==1)
                //{
                for(var j=0;j<ele.length;j++)
                {
                    console.log("remove iframe"+j);
                    if(ele[j] != null)
                    {
                        ele[j].parentNode.removeChild(ele[j]);
                    }
                }
                //ele = document.querySelectorAll(listsall[i]);
                //}
            }
        }
        var index = 0;
        var timeid = setInterval(()=>{
            remove_bottom_ads();
            index = index + 1;
            if(index >=20)
                clearInterval(timeid);
        },1000);
        //alert("executed!");

        var obj = document.querySelector("a#btn-readmore.btn.btn-red-hollow");
        if(obj!=null)
            obj.click();
    },10);
})();