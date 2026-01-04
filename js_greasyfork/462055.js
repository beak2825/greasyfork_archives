// ==UserScript==
// @name         mt-download-delete-bookmark
// @namespace    mt-del-bm
// @version      0.1
// @description  批量下载收藏种子,之后删除种子收藏，测试pt网站的mt站点正常可用，其他网站如果是兼容NexusPHP 站点 ，可以在源码自己添加匹配网址，23-3-18，download torrent,delete bookmark
// @author       zip11guge
// @match        https://kp.m-team.cc/*.php?inclbookmarked=1&allsec=1&incldead=0
// @icon64         data:image/x-icon;base64,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
// @run-at      document-end
// @grant        GM_download
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/462055/mt-download-delete-bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/462055/mt-download-delete-bookmark.meta.js
// ==/UserScript==

(function() {

    'use strict';

    //   @require     file://gh\js\mt-pt\mt.js

    //~~~~~~~~~~Add button3 ~~~~~~~~~~~


    let mybtn = document.createElement('button');
    document.body.appendChild(mybtn);

    mybtn.id = 'my-btn';
    mybtn.innerHTML = `下载种子bookmark
<style>
#my-btn {
    /* position设置为fixed，固定位置，即使窗口滚动位置不变 */
    position: fixed;
    top: 100px;
    left: 30px;
    width: 150px;
}
</style>`

        // download torrent ~ start ~~~~~~~~~~~~~~~~~~~~~
    mybtn.onclick = function () {

        //输入-开始 download pic-link

        let ks1 = prompt("输入-第一个收藏的-图片链接-pic-link");
        let bknum = ckimg(ks1);

        console.log("bknum-st:"+bknum);

        // 输入-结束 download pic-link

        let js1 = prompt("输入-最后一个收藏的-图片链接pic-link");
        console.log(js1);
        let bknum_ed = ckimg(js1);

        console.log("bknum-ed:"+bknum_ed);

        // download
        down_torrent(bknum,bknum_ed);

        //del bookmark
        delbm(bknum,bknum_ed);

        alert("种子下载开始-torrent download start");

    }


     function sleep1(time) {
        time*=1000
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }



    // 下载种子文件

    async function down_torrent(qdnum,bmnum){

        var i;

        // bookmark start num
        // qdnum

        // bookmark end num


        //var bmnum = tp1.length

        var xy1 = null

        for (i = qdnum; i <= bmnum ; i++) {

            xy1 = document.querySelector('a[id="bookmark'+ i + '"]').previousElementSibling;;
            // css选择 收藏 bookmark (上一个元素 a )下载连接

            console.log("torrent-link:"+xy1.href);
            // 收藏网址

            // torrent name -------
            // title    parent > previous
            let wztt = xy1.parentNode.previousElementSibling;
            // firstChild dom
            wztt = wztt.firstChild;

            console.log(wztt.title);

            // a > title
            let tmz1 = wztt.title

            // titele  abc-123
            tmz1 = tmz1.replace(/[^a-zA-Z0-9-]/g,'')


            tmz1 = "[M-TEAM]" + tmz1 + ".torrent";
            // torrent name  end ------

            //点击 下载 收藏

            // 异步延时-sleep
            await sleep1(3);

            // download  .torrent
            GM_download(xy1.href,tmz1);

            


        }
    }

    // ~~~~~~button3~~~~~~ end




    // check bookmark number----start

    var button2 = document.createElement("button");

    //按钮 属性
    button2.id = "id002";
    button2.textContent = "查询bookmark序号";
    button2.style.width = "140px";
    button2.style.height = "20px";
    button2.style.align = "center";

    //~~~~~~~~~~Add Button2 ~~~~~~~~~~~

    //查找  上一页的 元素
    var b2 = document.getElementsByClassName('gray')[0];

    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    console.log("button2 对象:",b2);

    //添加 子元素
    b2.appendChild(button2);

    //~~~~~~~~~end~~~~~~~

    button2.onclick = function (){

        //输入-开始删除收藏-序号
        var ks1 = prompt("输入-img-link*");
        console.log(ks1);

        // input img.src ,serach bookmark number
        var bknum = ckimg(ks1)

        //alert(bknum)

        // input = book  mark number

        var ip1 = document.querySelector("#searchinput")
        ip1.value = bknum
    }

    // check img number

    function ckimg(imglk) {

        //css选择 全部 小缩略图
        var tp1 = document.querySelectorAll('.torrentimg>a>img');

        // img number
        console.log("img number:"+tp1.length)

        var i;

        // bookmark start num
        // qdnum

        // bookmark end num

        var bmnum = tp1.length



        for (i = 0; i < bmnum ; i++) {


            //console.log("img.src: "+tp1[i].src);

            // 收藏网址

            //输入网址 = 查询网址
            if(imglk == tp1[i].src) {

                //得到 bookmark 编号
                console.log("img.src: "+tp1[i].src);
                return i
            }


        }
    }

    // ~~~~~~~~end button2 ~~~~~~~~~~~~



    // ~~~ Button ~~~~ delete bookmark---- start

    var button = document.createElement("button");

    //按钮 属性
    button.id = "id001";
    button.textContent = "删除收藏";
    button.style.width = "120px";
    button.style.height = "20px";
    button.style.align = "center";



    //~~~~~~~~~~Add Button ~~~~~~~~~~~

    //查找  上一页的 元素
    var x = document.getElementsByClassName('gray')[0];

    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    console.log("button 对象:",x);

    //添加 子元素
    x.appendChild(button);

    //~~~~~~~~~end~~~~~~~




    button.onclick = function (){


        //输入-开始 del download pic-link

        let ks1 = prompt("输入-开始收藏-pic-link");
        let bknum = ckimg(ks1)

        console.log("bknum-st:"+bknum);

        // 输入-结束 del download pic-link

        let js1 = prompt("输入-结束pic-link");
        console.log(js1);
        let bknum_ed = ckimg(js1)

        console.log("bknum-ed:"+bknum_ed);

        // delete bookmark

        delbm(bknum,bknum_ed)

    }





// del mt bookmark ---start---

    function delbm(qdnum,bmnum) {

        // delete bookmark

        var tp1 = document.querySelectorAll('.torrentimg');
        //css选择 全部 小缩略图
        console.log("img number:"+tp1.length)

        var i;

        // bookmark start num
        // qdnum

        // bookmark end num


        //var bmnum = tp1.length

        for (i = qdnum; i <= bmnum ; i++) {

            var xy1 = document.querySelector('a[id="bookmark'+ i + '"]');
            //css选择 全部 收藏 bookmark

            console.log(xy1.href);
            // 收藏网址

            xy1.click();

            //点击 删除 收藏
        }
    }

})();

