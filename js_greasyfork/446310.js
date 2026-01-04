// ==UserScript==
// @name         牛客学校显示
// @namespace    https://www.nowcoder.com/
// @version      0.2
// @description  牛客网 展示 学校
// @author       YYForReal
// @match        https://www.nowcoder.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446310/%E7%89%9B%E5%AE%A2%E5%AD%A6%E6%A0%A1%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/446310/%E7%89%9B%E5%AE%A2%E5%AD%A6%E6%A0%A1%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
        setTimeout(() => {
            var focus_tags = document.getElementsByClassName("feed-hd-info");
            //定位用户框
            var user_boxes = document.getElementsByClassName("module-box feed-item-mod");
            for(let i=0;i<user_boxes.length;i++){
                (()=>{
                    let a = i;
                    var user_links = user_boxes[a].firstChild.firstChild.firstChild;
                    var link = user_links.href;
                    //找到用户主页的链接
                    console.log(link);
                    setTimeout(()=>{
                        //请求
                        var xhr = new XMLHttpRequest();
                        //console.log(link);
                        xhr.open("GET", link);
                        xhr.send();
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    let htmltext = xhr.responseText;
                                    //console.log(htmltext);
                                    //正则截取
                                    let reg = new RegExp('<li><i class="icon-profile-edu"></i>([\u4E00-\u9FA5]|\s*|[\uFE30-\uFFA0]|\s*|[a-z|A-Z])*\s*</li>');
                                    let school_tag = htmltext.match(reg)[0].substring(36);
                                    var school_name = school_tag.substring(0,school_tag.length - 5);
                                    console.log(school_name);//拿到学校名
                                    var node = document.createElement("span");
                                    node.innerText = school_name;
                                    focus_tags[a].firstChild.appendChild(node);
                                } else {
                                    console.log("error");
                                }
                            }
                        }
                    },a*2000);

                })()
            }

        }, 1000);

})();