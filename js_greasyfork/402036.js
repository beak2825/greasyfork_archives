// ==UserScript==
// @name         roshpit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  肉山谷拍卖装备比价辅助
// @author       vk
// @match        https://www.roshpit.ca/market/my_sales
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/402036/roshpit.user.js
// @updateURL https://update.greasyfork.org/scripts/402036/roshpit.meta.js
// ==/UserScript==

    // Your code here...

(function () {
    'use strict';

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#down_video_btn{color:#fa7d3c;}');

    //删除第二步多出来的flashy元素
    $(document.getElementsByClassName("flashy")).remove();
    document.getElementById("list-item-button").parentNode.id = "diyige";
    document.getElementById("auction-list-box").parentNode.id = "dierge";
    document.getElementById("diyige").parentNode.id = "dilingge";
    document.getElementById("diyige").style.width = "20%"
    document.getElementById("dierge").style.width = "35%"
    document.getElementById("dilingge").style.width = "95%"

    var down_btn_html = document.createElement("div");
    down_btn_html.id = "down_btn_html";
    down_btn_html.style ="background-color: black;position:relative;width: 36%;top: 30px;display:inline-block;height:12vh;"
    down_btn_html.className = "sbbbb";
    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.champions_container>div");
    ul_tag.append(down_btn_html);
    var oDiv = document.getElementById("down_btn_html");
    oDiv.onclick = function(){
        var childs = down_btn_html.childNodes;
        for(var i = childs .length - 1; i >= 0; i--) {
            down_btn_html.removeChild(childs[i]);
        }
        oDiv.InnerHTML= "";
        var item = document.evaluate("//div[@id='ability1']//p[@id='tooltip_title']", document).iterateNext().innerHTML;
        item = item.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "")
        var url1 = "https://www.roshpit.ca/market/item_class_search?query="+item
        url1.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "")
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url1,true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(this.readyState !== 4)  return;
            if(this.status === 200) {
                var tt = this.responseText;
                var ttt = tt.match(/data-item-id="(\S*)"/)[1];
                var url2 = "https://www.roshpit.ca/market/auction_search?roshpit_item="+ttt
                var xhr2 = new XMLHttpRequest();
                xhr2.open("GET", url2,true);
                xhr2.send();
                xhr2.onreadystatechange = function() {
                    if(this.readyState !== 4)  return;
                    if(this.status === 200) {
                        var tt2 = xhr2.responseText;
                        var tag = $("div.champions_container>div>div.sbbbb");
                        tag.append(tt2);
                        var del = document.querySelectorAll("#down_btn_html a span")
                        for(var i = del .length - 1; i >= 0; i--) {
                            del[i].parentNode.removeChild(del[i]);
                        }
                    }
                }
            }
        }
    }
})();