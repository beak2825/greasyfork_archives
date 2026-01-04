// ==UserScript==
// @name         百度搜索去广告
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  小庄的脚本园
// @author       zjazn
// @match        *://*.baidu.com/*
// @match        *://*.*.baidu.com/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @run-at       document-start
// @match        <$URL$>
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436707/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/436707/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(function () {
    var i = 0;
    //脚本框架-自建
    function $(str, two, three,four) {
        let ctl = {
            //给元素添加一个监听事件
            listen: function (event, fun) {
                for (var i = 0; i < objs.length; i++) {
                    objs[i].addEventListener(event, fun);
                }

            },
            //当存在元素且length大于或等于count时返回true
            exist: function (count) {
                return (objs[0] != null) && objs.length >= count;
            },

            css: function (style_str) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null) {
                        objs[i].style = style_str
                    }
                }
                return ctl;
            },
            //将指针转向指定对象的n父对象
            father: function (second, vt) {
                let fathers = objs;
                for (var j = 0; j < second; j++) {
                    var new_father = [];
                    for (var i = 0; i < fathers.length; i++) {

                        new_father[new_father.length] = fathers[i].parentNode;//获取a的父节点；
                    }
                    fathers = new_father;
                }
                objs = fathers;
                console.log("最终父节点：", objs);
                return ctl;
            },
            //排除父子关系
            exfs: function () {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i].querySelectorAll(str.split(",")[0]).length > 0) {
                        objs.splice(i, 1);
                        //console.log("存在",objs);
                    }

                }
                return ctl;
            },
            //fun1是tab离开时调用， fun2是tab回到时调用
            tab: function (fun1, fun2) {
                document.addEventListener('visibilitychange', function () { //浏览器切换事件
                    if (document.visibilityState == 'hidden') { // 离开当前tab标签
                        if (fun1 != null) {
                            fun1();
                        }
                    } else { // 回到当前tab标签
                        if (fun2 != null) {
                            fun2();
                        }
                    }
                });
            },
            //timeout_time当不活跃超过时间,fun1是超时调用的函数,fun2是重新活跃时调用的 & 且内部又使用了节能机制
            inactive: function (timeout_time, fun1, fun2) {

                var tor_box = null;
                var is_continue = false;
                document.onmousemove = function () {
                    if (tor_box != null) {
                        clearTimeout(tor_box)
                    }
                    if (is_continue) {
                        fun2()
                        is_continue = false;
                    }
                    tor_box = setTimeout(function () {
                        fun1();
                        is_continue = true;
                    }, timeout_time)
                }
            },
            timeor_mean: function (timeout_time, torx, fun1, fun2) {

                //start的节能系统

                var is_start = false;
                if (torx != null) {
                    is_start = true;
                }
                //隐式节能模式
                $().tab(function () {
                    console.log("离开了");
                    fun1()
                    //clearInterval(tor)
                    is_start = false;
                }, function () {
                    console.log("重新活了");
                    fun2()
                    //start()
                    is_start = true;
                })
                //显式节能模式
                $().inactive(timeout_time, function () {
                    console.log("不活跃了");
                    fun1()
                    //clearInterval(tor)
                    is_start = false;
                }, function () {
                    console.log("重新活跃");
                    if (!is_start) {
                        fun2()
                        //start()
                        is_start = true;
                    }
                });
            },
            html: function(between_block="") {
               var html_text = ""
               for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null) {
                        html_text += objs[i].innerHTML
                        html_text += between_block
                    }
                }
                return html_text;
            }



        }
        if (str == null) return ctl;
        //安全调用函数
        function scall(fun,bfun) {
             if((typeof fun) == "function") {
                fun()
             }else {
                if((typeof bfun) == "function") {
                   bfun
                }
             }
        }
        if ((typeof str) == "function") {
            var n = 0;
            var timeout = setInterval(function () {
                //关键代码开始
                if (two != null) {
                    if ($(two).exist(three == null ? 0 : three)) {
                        //当找到指定特定的节点且满足个数时调用
                        str();
                        clearInterval(timeout);
                    }else {
                        //当找不到指定特定的节点且不满足个数时调用,在这里不能关闭timeout定时器,且如果four参数是一个函数不但要调用还意味着要关闭定时器，但注意此时已经足够内容加载完成了
                        if((typeof four) == "function") {
                            four()
                            clearInterval(timeout)
                        }
                    }
                } else {
                    //当第二个参数为null时调用,且此时第一个参数是函数
                    str()
                    clearInterval(timeout);
                }
                //关键代码结束
                n++
                if (n > 12500) {
                    clearInterval(timeout);
                }

            }, 40)
            return;
        }

        let objs = [];
        let objs_str = str.split(",");

        for (var i = 0; i < objs_str.length; i++) {
            var inter = document.querySelectorAll(objs_str[i]);
            for (var j = 0; j < inter.length; j++) {
                objs[objs.length] = inter[j];
            }
        }

        return ctl;
    }







    function slide(top_length, left_length) {
        window.scrollTo({ top: top_length, left: left_length, behavior: 'smooth' })
    }


    var tor = null;
    var start = function () {
        tor = setInterval(function () {
            console.log("打扫或监督中！");
            //关键代码开始
            //开始清理百度搜索广告
            try {
                Array.from(
                    document.querySelectorAll('#content_left>div'))
                    .forEach(el =>
                        />广告</.test(el.innerHTML) && el.parentNode.removeChild(el)
                    )
                ct++;
            } catch (e) { }

            //清理百度搜索广告完毕
            //美化样式
            $("#content_right,#bottom-ads-container,.qbleftdown,.qb-side,#aside ,#fresh-share-exp-e,.task-panel-entrance,.wgt-like,.task-list-button,.wgt-bottom-union,.jump-goto-star,.task-panel-entrance,.wgt-like,#side").css("display:none");
            $(".c-container").exfs().css("margin-bottom: 30px;border-left: 5px solid #4dc86f; padding-left:20px; ");

        }, 80);


    }

    //清理其它百度系广告
    $(start, ".c-container", 10)
    //tor的节能模式
    $().timeor_mean(5000, tor, function () {
        clearInterval(tor)
    }, function () {
        start()
    })
    $(function () {
        $(".qb-section,.main-content").css("width:100%");
        $("#qb-content").css("width:100%");
        $(".content").css("border-left:3px solid #4dc86f;padding: 30px; margin: 15px 0px");
        $(".qbleftdown,.answerlist,.task-list-button,.jump-goto-star,#qb-side,#wgt-left-promo,.task-panel-entrance").css("display:none")
        $("#wgt-like").css("display:block;height:0px");

        $(".task-panel-entrance").css("display:block;height:0px");
        $("#format-exp").css("border-left:5px solid #4dc86f; padding: 30px ; margin: 15px 0px")
        $(".list-icon").css("background:red")
        $("#ui-tooltip-0").css("display:block;height:0px; padding:0px; margin:0px;opacity: 0")

    })
    //清理百度文库
    /*$(function() {
        var integrityurl = window.location.href;
        if(integrityurl.indexOf("https://wenku.baidu.com/view/") > -1) {
            console.log("开始过滤")
            var text_open = setInterval(function(){
                $(function(){
                    document.getElementsByClassName("read-all")[0].click();
                    console.log("点击了展开")
                },".read-all",1)
            },1000)

            var st = 4000;
            var ot = 800;
            var count = st/ot;
            var toor = setInterval(function(){
                slide(document.body.scrollHeight*(((st/ot)-count)/(st/ot)),0)
                count--
                count=count<0?0:count
            },ot)
            setTimeout(function(){

                slide(99999999999999999,0) //确保能滑到最下面
                setTimeout(function(){
                    clearInterval(text_open)
                    clearInterval(toor)
                    //如果找得到 .doc-title-wrap>.ppt 就是一个ppt文档
                    $(function() {
                        console.log("这是一个ppt文档!")
                        document.body.innerHTML = "<div id='box' style='width:100%'>"+$("#reader-container>*").html()+"</div>"
                    },".doc-title-wrap>.ppt",1,function(timeout) {
                        console.log("这不是一个ppt文档!")

                        document.body.innerHTML = "<div id='box' style='width:100%'>"+$("#reader-container").html()+"</div>"
                    })

                    $(".ppt-image-wrap>*").css("display:block;width:100%")
                    $(".ppt-image-wrap").css("display:block;margin:10px 4%")
                    slide(0,0)
                    $(".hx-warp").css("display:none")

                },3000)
            },st)
        }
    },".doc-title,#reader-container,.wk-logo-icon",1)*/






})();
