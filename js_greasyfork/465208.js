// ==UserScript==
// @name         快云搜
// @namespace    https://kyunso.com
// @version      1.0.2
// @author       yiso
// @match        https://*.aliyundrive.com/*
// @match        https://pan.quark.cn/*
// @match        https://movie.douban.com/*
// @icon         https://yiso.fun/static/img/logo.png
// @description  将快云搜 集成到 各种网盘官网上 让搜索更高效、更便捷;同时为了资源的丰富性本插件会把你浏览过的云盘分享链接同步到服务端做缓存方便下次搜索 介意请勿安装1.0以及后续版本！！！ 安装0.3版本以下即可 感谢您的支持与理解
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @connect      *
// @grant        unsafeWindow
// @connect      192.168.1.100
// @connect      aliyundrive.com
// @connect      127.0.0.1
// @antifeature tracking
// @connect localhost
// @license huhuice

// @downloadURL https://update.greasyfork.org/scripts/465208/%E5%BF%AB%E4%BA%91%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/465208/%E5%BF%AB%E4%BA%91%E6%90%9C.meta.js
// ==/UserScript==
(function() {
    'use strict';
    unsafeWindow = unsafeWindow || window;
    var $ = $ || window.$;
    //当前浏览器的地址
    let url = window.location.href
    if (url.includes('https://www.aliyundrive.com/drive', 0)) {
        setTimeout(function() {
            aliHomeButtonHeader();
        },
                   1000)

    } else if (url.includes('aliyundrive.com/s/', 0)) {
        setTimeout(function() {
            aliShareButtonHeader();
        },
                   1000)
    } else if (url.includes("https://pan.quark.cn/list", 0)) {
        setTimeout(function() {
            quarkHomeButtonHeader();
        },
                   1000)
    } else if (url.includes("https://pan.quark.cn/s", 0)) {
        setTimeout(function() {
            quarkShareButtonHeader();
        },
                   1000)
    } else if (url.includes("https://movie.douban.com/subject", 0)) {
        setTimeout(function() {
            doubanButtonHeader();
        },
                   1000)
    }

    /**
     *alihome页导航栏按钮
     */
    function aliHomeButtonHeader() {
        let header = document.querySelector('header');
        if (header == null) {
            setTimeout(function() {
                aliHomeButtonHeader();
            },
                       1000)
        }
        setAliYunYiSo(header);
    }

    /**
     *quarkhome页导航栏按钮
     */
    function quarkHomeButtonHeader() {
        let header = document.querySelector(".SectionHeaderController--section-header-left--1nc208f");
        if (header == null) {
            setTimeout(function() {
                quarkHomeButtonHeader();
            },
                       1000)
        }
        setQuarkYiSo(header);
    }

    /**
     *夸克分享按钮
     */
    function quarkShareButtonHeader() {
        let header = document.querySelector(".CommonHeader--container--LPZpeBK")

        if (header == null) {
            setTimeout(function() {
                quarkShareButtonHeader();
            },
                       1000)
        }
        setQuarkYiSo(header);
    }

    /**
     *豆瓣跳转按钮
     */
    function doubanButtonHeader() {
        let content = document.getElementById('content') ;
        let header = content.querySelector("h1")

        if (header == null) {
            setTimeout(function() {
                doubanButtonHeader();
            },
                       1000)
        }
        setDouban(header);
    }

    /**
     *豆瓣按钮处理
     */
    function setDouban(header) {
        let searchKey = header.querySelector("span").textContent.split(" ")[0];
        if (searchKey == null || searchKey == undefined || searchKey == '') {
            alert('请输入搜索关键词');
            return;
        }
        let div = document.createElement('span');
        div.innerHTML = "<a title='点击打开快云搜 搜索此资源'  href=`http://192.168.1.100:8090/query_hit?keyword=${searchKey}&indexName=search&fields=title,detailed,productDesc` target='blank'><img width='45' height='45'  src='https://bj.bcebos.com/baidu-rmb-video-cover-1/3dfb790034043ada1d1bd6146fb77c46.jpeg'/></a>";
        header.insertBefore(div, header.children[2]);

    }

    /**
     *扔瓶子按钮
     */

    function bottleButton() {
        let lists = document.querySelectorAll('.tbody--3Y4Fn .tr-wrapper--3qYK2');
        if (lists == null) {
            setTimeout(function() {
                bottleButton();
            },
                       1000)
        }
        sendBottleButton(lists);
    }

    /**
     *扔瓶子逻辑
     */
    function sendBottleButton(lists) {

        lists.forEach(function(item, index) {
            console.log(item);
            let div = document.createElement('div');
            div.innerHTML = "<button class='yisoButton' style='width: 100px;height: 38px;color:white;background-color:#446dff;border-radius: 3px;border-width: 0;margin: 0;outline: none;font-size: 17px;text-align: center;cursor: pointer;margin-right:2cm;'>快云搜</button>";

            item.insertBefore(div, item.children[4]);
        });

    }

    /**
     * 阿里云结果集展示
     */
    function showAliList(fileList, searchKey) {

        let html = '<div class="ant-modal-root ant-modal-Link"><div class="ant-modal-mask"></div><div tabindex="-1" class="ant-modal-wrap" role="dialog"><div role="document" class="ant-modal modal-wrapper--2yJKO" style="width: 666px;"><div class="ant-modal-content"><div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle1">' + '找到<span style=\"color: red;\">' + searchKey + '</span>相关资源如下 若为空，请更换关键词</div></div><div class="ant-modal-body"><div class="icon-wrapper--3dbbo"><span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--33bP0 icon--d-ejA"><svg class="closed" viewBox="0 0 1024 1024"><use xlink:href="#PDSClose"></use></svg></span></div>';

        html += '<div class="" style="height: 40px;"> <span style=\"color: #D3D3D3;\">选中下方资源列表 点击即可打开,介于性能问题只返回了前10条数据,如需更多点击下方完整版按钮<br> 点击任意空白处关闭搜索内容弹出框，如需别的网盘资源点击完整版访问</span></div>';
        html += '<div class="item-list" style="padding: 20px; height: 410px; overflow-y: auto;">';
// 列表

        fileList.forEach(function(item, index) {
            html += '<p>' + (++index) + '：' + '<a class="aliClick" href=' + item.source.url + '>' + item.source.title + '</a>' + '</p><br> ';
        });
        html += '</div></div><div class="ant-modal-footer"><div class="footer--1r-ur"><div class="buttons--nBPeo">';
        html += '<button class="button--2Aa4u primary--3AJe5 small---B8mi appreciation">快云搜完整版</button></div>';
   //     html += '<p>更多精彩功能正在开发中,比如：选中资源直接保存到云盘....</p>';
        $("body").append(html);

        $(".icon-wrapper--3dbbo").one("click",
                                      function() {
            $(".ant-modal-Link").remove();
        });

        $(".aliClick").one("click",
                           function(event) {
            event.preventDefault();
            var id = $(this).attr('href');
            console.log(id);
           // const i= id.indexOf("?");
            //const decryptedurl=id.substring(0,i)
            //const  url=  encryption(decryptedurl)
            window.open(url, "_blank");
        });
        $(".ant-modal-wrap").on("click",
                                function(event) {
            if ($(event.target).closest(".ant-modal-content").length == 0) {
                $(".ant-modal-Link").remove();
            }
        });
        $(".ant-modal-Link .appreciation").on("click",
                                              function() {
            window.open(`http://192.168.1.100:5500/kyunso/index.html`, "_blank");
        });

    }
    const encryption = (encrypted) => {
        let key = CryptoJS.enc.Utf8.parse("4OToScUFOaeVTrHE");
        let iv = CryptoJS.enc.Utf8.parse("9CLGao1vHKqm17Oz"); // 偏移量：规定的是key前15位
        console.log(encrypted)
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(encrypted) },
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );
        return decrypted.toString(CryptoJS.enc.Utf8);
    }


    /**
     * 获取分享按钮
     */
    function getButton() {

        return document.querySelector('button');
    }

    /**
     * 分享页面初始化快云搜
     */
    function aliShareButtonHeader() {
        sendUrl();
        let header = document.querySelector('.banner--3rtM_');
        if (header == null) {
            setTimeout(function() {
                aliShareButtonHeader();
            },
                       1000)
        }
        setAliYunYiSo(header);
    }

    /**
     * 阿里云快云搜初始化
     */
    function setAliYunYiSo(header) {
        let div = document.createElement('div');
        div.innerHTML = "<div><input id='yisoInput' value='' type='text' style='width: 260px;height: 38px;' placeholder='输入关键词快云搜一下即刻到达'/>&nbsp;&nbsp;&nbsp;<button class='yisoButton' style='width: 100px;height: 38px;color:white;background-color:#446dff;border-radius: 3px;border-width: 0;margin: 0;outline: none;font-size: 17px;text-align: center;cursor: pointer;margin-right:2cm;margin-left: 4px;'>快云搜</button></div>";
        header.insertBefore(div, header.children[1]);
        let yiso = document.querySelector('.yisoButton');

        yiso.addEventListener('click',() =>{
            let searchKey = document.getElementById("yisoInput").value;
            if (searchKey == null || searchKey == undefined || searchKey == '') {
                alert('请输入搜索关键词');
                return;
            }
            GM_xmlhttpRequest({
                method: "get",
                url: `http://192.168.1.100:8090/query_hit?keyword=${searchKey}&indexName=search&fields=title,detailed,productDesc`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(r) {
                    console.log('快云搜');
                    let resultJson = JSON.parse(r.response);
                    console.log(resultJson)
                    // console.log("结果"+JSON.stringify(resultJson));
                    console.log(r.status)
                    if (r.status === 200) {
                        if (r.status === 200) {
                            //alert(resultJson.msg);
                            //return;
                        }
                        showAliList(resultJson, searchKey);
                    } else {
                        alert('系统异常，请稍微再试');
                    }
                }
            });

        });
    }

    /**
     *  夸克搜索框
     *  @param header
     */
    function setQuarkYiSo(header) {
        let div = document.createElement('div');
        div.innerHTML = "<div style='margin-left: 200px'><input id='yisoInput' value='' type='text' style='width: 260px;height: 38px; margin-top: 26px;margin-right: 116px' placeholder='输入关键词快云搜一下即刻到达'/>&nbsp;&nbsp;&nbsp;<button class='yisoButton' style='width: 100px;height: 38px;color:white;background-color:#446dff;border-radius: 3px;border-width: 0;margin: 0;outline: none;font-size: 17px;text-align: center;cursor: pointer;margin-right:2cm;margin-left: 253px;margin-top: -38px;position:absolute;'>快云搜</button></div>";
        header.insertBefore(div, header.children[1]);
        let yiso = document.querySelector('.yisoButton');
        yiso.addEventListener('click', () =>{
            let searchKey = document.getElementById("yisoInput").value;
            if (searchKey == null || searchKey == undefined || searchKey == '') {
                alert('请输入搜索关键词') ;
                return;
            }
            GM_xmlhttpRequest({
                method: "get",
                url: `http://192.168.1.100:8090/query_hit?keyword=${searchKey}&indexName=search&fields=title,detailed,productDesc`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
               onload: function(r) {
                    console.log('快云搜');
                    let resultJson = JSON.parse(r.response);
                    console.log(resultJson)
                    // console.log("结果"+JSON.stringify(resultJson));
                    console.log(r.status)
                    if (r.status === 200) {
                        if (r.status === 200) {
                            //alert(resultJson.msg);
                            //return;
                        }
                        showQuarkList(resultJson, searchKey);
                    } else {
                        alert('系统异常，请稍微再试');
                    }
                }
            });

        });
    }

    /**
     * 夸克结果集展示
     */
    function showQuarkList(fileList, searchKey) {
        let html = '<div class="ant-modal-root ant-modal-Link"><div class="ant-modal-mask"></div><div tabindex="-1" class="ant-modal-wrap" role="dialog"><div role="document" class="ant-modal modal-wrapper--2yJKO" style="width: 666px;"><div class="ant-modal-content"><div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle1">' + '找到<span style=\"color: red;\">' + searchKey + '</span>相关资源如下 若为空，请更换关键词</div></div><div class="ant-modal-body"><div class="icon-wrapper--3dbbo"></div>';
        //let html='<div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle0">移动到...</div></div>';
        html += '<div class="" style="height: 40px; margin-left: 20px; "> <span style=\"color: red;\">选中下方资源列表 点击即可打开,介于性能问题只返回了前10条数据,如需更多点击下方完整版按钮<br> 点击任意空白处关闭搜索内容弹出框，如需别的网盘资源点击完整版访问</span></div>';
        html += '<div class="item-list" style="padding: 20px; height: 410px; overflow-y: auto;">';

        fileList.forEach(function(item, index) {
            html += '<p>' + (++index) + '：' + '<a class="aliClick" href=' + item.source.url + '>' + item.source.title + '</a>' + '</p><br> ';
        });
        html += '</div></div><div class="ant-modal-footer"><div class="create-share-footer"><div class="btn-wrap">';
        html += '<button class="ant-btn btn-file btn-file-primary  ant-btn-primary" style="margin-left: 20px;">快云搜完整版</button></div>';
     //   html += '<p>更多精彩功能正在开发中,比如：选中资源直接保存到云盘....</p>';
        $("body").append(html);

        $(".icon-wrapper--3dbbo").one("click",
                                      function() {
            $(".ant-modal-Link").remove();
        });

        $(".aliClick").one("click",
                           function(event) {
            event.preventDefault();
            var id = $(this).attr('href');
            console.log(id);
         //   const i= id.indexOf("?");
       //     const decryptedurl=id.substring(0,i)
       //     const  url=  encryption(decryptedurl)
            window.open(url, "_blank");
        });
        $(".ant-modal-wrap").on("click",
                                function(event) {
            if ($(event.target).closest(".ant-modal-content").length == 0) {
                $(".ant-modal-Link").remove();
            }
        });
        $(".ant-modal-Link .ant-btn-primary").on("click",
                                                 function() {
            window.open(`http://192.168.1.100:5500/kyunso/index.html`, "_blank");
        });

    }

    /**
     *   获取一个随机数
     *  @param n -- 长度
     */

    function getCode(n) {
        let all = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
        let b = "";
        for (let i = 0; i < n; i++) {
            let index = Math.floor(Math.random() * 62);
            b += all.charAt(index);

        }
        return b;
    }

    /**
     *  睡眠函数
     *  @param numberMillis -- 要睡眠的毫秒数
     */
    function sleep(numberMillis) {
        let now = new Date();
        let exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime) return;
        }
    }

    function sendUrl() {
        if (url.length === 41) {
            getShareInfo();
        }
    }


    function getShareInfo(){
        let i=url.lastIndexOf("/");
        let shareId=url.slice(i+1);
        let dto = '{"share_id":"'+shareId+'"}';
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous',
            headers: {
                "Content-Type": "application/json",
            },
            data:dto,
            onload: function(r) {
                let resultJson = JSON.parse(r.response);
                if(resultJson.creator_id!=null&&resultJson.creator_id!=''&&resultJson.creator_id!=undefined){
                    sssss(r.response)
                }
            }
        });
    }

    function sssss(ss){
        var dto=new FormData();
        dto.append("info",ss);
        dto.append("url",url);
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://192.168.1.100:8090/',
            data:dto,
            onload: function(r) {
                let resultJson = JSON.parse(r.response);
                console.log(resultJson)
            }
        });
    }

    // Your code here...
})();