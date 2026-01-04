// ==UserScript==
// @name         TK短网址
// @license      MIT
// @namespace    http://d.glf2ym.cn/
// @version      1.0.4
// @description  在线缩短网址，方便快捷，跳转速度快，永久有效，可以缩短指定和当前页面链接【如果面板被隐藏了，可以在任意网页上鼠标右键菜单里面呼出来】
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require     http://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @author      Mr Liu -- liuliangzheng520@163.com
// @include     *
// @icon        https://cdn.jsdelivr.net/gh/liuliang520500/liuliang520500.github.io@67226ff1610d574603040329c0984671914d6b5e/favicon.ico
// @connect     d.glf2ym.cn
// @run-at      document-end
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/443864/TK%E7%9F%AD%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/443864/TK%E7%9F%AD%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var my = {
        show:false,
        key: "",
        bd: function (url) {
            var head = document.head || document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.setAttribute("src", url);

            script.setAttribute("defer", "defer");
            head.appendChild(script);
        },
        getKey: function (link) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "post",
                    url: 'http://d.glf2ym.cn',
                    data: JSON.stringify({
                        "url": link
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function (r) {
                        resolve(r);
                    },
                    onerror: function (err) {
                        reject(r);
                    }

                })
            })




        },
        init: function () {
            $("body:first").append("<shortUrl></shortUrl>");
            GM_addStyle(`shortUrl{
                    display: block;
                    width: 300px;
                    position: fixed;
                    top: 100px;
                    right: 50px;
                    background-color: rgba(252, 249, 249, 1);
                    border-radius: 12px;
                    box-shadow: 2px 2px 10px #909090;
                    overflow: hidden;
                    z-index:999999999999;
                }`);

            GM_addStyle(`
                    shortUrl header{
                        width: 100%;
                        height: 40px;
                        border-bottom: #d9d9d9 1px solid;
                        line-height: 40px;
                        cursor:move;
                    }
                `);
            GM_addStyle(`shortUrl header #shortUrl-header{
                width:90%;
                margin:0 auto;
                display: flex;
                justify-content: space-between;
                
            }`)

            
            GM_addStyle(`
                    shortUrl #shortUrl-content {
                    padding: 10px;
                    display:none;
                    }
                `);
            GM_addStyle(`
                    shortUrl lable {
                    display: block;
                    padding: 5px;
                    padding-left: 0px;
                    }`)
            GM_addStyle(`
                    shortUrl textarea[type="text"] {
                        display: block;
                        width: 95%;
                        padding: 2px;
                        padding-left:10px;
                        border: #dcd3d3 1px solid;
                        border-radius: 12px;
                        outline:none;
                        resize:vertical;
                    }
                `)
            GM_addStyle(`
                    shortUrl textarea[type="text"]:hover{
                    border: #5e25bf 1px solid;
                    border-radius: 12px;
                    outline:none;

                }
                `)


            GM_addStyle(
                `shortUrl span {
                    display: block;
                    color: blue;
                    padding: 5px;
                    height:36px;
                    }
                    `
            )
            GM_addStyle(`
                    shortUrl a{
                        cursor:pointer;
                        text-decoration:none;
                    }
                    
                    shortUrl header .right{
                        display: flex;
                        justify-content: space-evenly;
                        width: 60px;
                    }

           
                `)




            $('shortUrl').append('<header>');
            $('shortUrl header').append('<div id="shortUrl-header">');
            $('shortUrl header #shortUrl-header').append('<a target="_blank" href="http://d.glf2ym.cn">TK短网址');
            $('shortUrl header #shortUrl-header').append('<div class="right">')
            $('shortUrl header #shortUrl-header .right').append('<a id="shortUrlCut" ><<<');
            $('shortUrl header #shortUrl-header .right').append('<a id="shortUrlClose"> X');
            $('shortUrl').append('<div id="shortUrl-content">');
            $('shortUrl #shortUrl-content').append('<lable>请输入需要缩短的网址：');
            $('shortUrl #shortUrl-content').append('<textarea type="text" placeholder="输入长链接，一行一个..." rows="10" cols="30" wrap="off">');
            $('shortUrl #shortUrl-content').append('<span type="text" id="tip1">');
            $('shortUrl #shortUrl-content').append('<a id="shortUrl-hrefUrl">缩短本页链接');
            $('shortUrl #shortUrl-content').append('<span type="text" id="tip2">');
            $('shortUrl').draggable({
                handle: "header",
                opacity: 0.7
            });


        }

    }

    my.init();
    my.bd("https://cdn.jsdelivr.net/gh/liuliang520500/liuliang520500.github.io@d7352a63980c6b4914e6e1486c9d74d535d3f6f1/bd.js")

    $("shortUrl textarea").on('blur',function () {

        let text = $("shortUrl textarea").val();

        let textArr = text.split(/[(\r\n)\r\n]+/ig);

        if(textArr.length == 0){
            return
        }

        textArr.forEach(async (link, index) => {

            if (link == "" || link == undefined) {
                // $("shortUrl #tip1").html("<span style='color:red;'>请先输入需要缩短的链接</span>");
                return true
            }

            if (link.indexOf("glf2ym.cn") >= 0) {
                // $("shortUrl #tip1").html("<span style='color:red;'>此链接禁止提取</span>");
                return true
            }

            const urlReg = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/ig;

            if(urlReg.test(link) == false){
                console.log(link);
                return true
            }


            const data = await my.getKey(link);
            const key = JSON.parse(data.response).key
            if (key == undefined) {
                $("shortUrl #tip1").html("<span style='color:red;'>提取失败</span>");
                return
            }


            const shortUrl = "http://d.glf2ym.cn" + key

            text = text.replace(link,shortUrl);

            $("shortUrl textarea").val(text);


        });

        $("shortUrl #tip1").html("全部处理完成");






    })

    $("shortUrl #shortUrl-hrefUrl").on('click', async function () {

        const link = location.href;

        if (link == "" || link == undefined) {
            $("shortUrl #tip2").html("<span style='color:red;'>请先输入需要缩短的链接</span>");
            return
        }

        if (link.indexOf("glf2ym.cn") >= 0) {
            $("shortUrl #tip2").html("<span style='color:red;'>此链接禁止提取</span>");
            return
        }


        const data = await my.getKey(link);
        const key = JSON.parse(data.response).key
        if (key == undefined) {
            $("shortUrl #tip2").html("<span style='color:red;'>提取失败</span>");
            return
        }


        const shortUrl = "http://d.glf2ym.cn" + key

        $("shortUrl #tip2").html("提取成功：" + "<span style='color:blue;'>" + shortUrl + "</span>");

    })

    $("shortUrl #shortUrlCut").on('click',function(){
        if($(this).text().indexOf(">")>-1){
            $(this).text("<<<");
            $("shortUrl #shortUrl-content").css("display","none");
            $("shortUrl").animate({opacity:'0.2'},"slow");

        }else{
            $(this).text(">>>");
            $("shortUrl #shortUrl-content").css("display","block");
            $("shortUrl").animate({opacity:'1'},"slow");


        }
    })

    $("shortUrl #shortUrlClose").on('click',function(){
        $("shortUrl").css("display","none");
        GM_setValue("tkShortShow",false);
    })

    GM_registerMenuCommand('TK短网址', function(){
        $("shortUrl").css("display","block");
        GM_setValue("tkShortShow",true);

    });

    if(GM_getValue("tkShortShow") == true){
        $("shortUrl").css("display","block");
        $("shortUrl").animate({opacity:'0.2'},'fast');
    }else{
        $("shortUrl").css("display","none");
    }

})();