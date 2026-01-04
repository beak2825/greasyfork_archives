// ==UserScript==
// @name         360软件宝库显示真实下载地址
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  【重要更新】已全局支持下载解析，不限于首页、分类、详情页等
// @author       AN drew
// @match        *://baoku.360.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       docuemnt-end
// @downloadURL https://update.greasyfork.org/scripts/431489/360%E8%BD%AF%E4%BB%B6%E5%AE%9D%E5%BA%93%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%AE%9E%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/431489/360%E8%BD%AF%E4%BB%B6%E5%AE%9D%E5%BA%93%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%AE%9E%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==


function getLink(appid)
{
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://q.soft.360.cn/get_download_url.php?soft_ids="+appid,
        headers: {
            //"User-Agent": "",// If not specified, navigator.userAgent will be used.
            "Accept": "*/*"// If not specified, browser defaults will be used.
        },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }
            //上面是发送get请求获取xml数据

            //var xmltext=response.responseText;
            var parser=new DOMParser();
            var xmlDoc=parser.parseFromString(response.responseText,"text/xml");
            //var x=xmlDoc.getElementsByTagName("softs");

            if(xmlDoc.getElementsByTagName("durls").length>0)
            {
                var pdown=xmlDoc.getElementsByTagName("softs")[0].getElementsByTagName("durls")[0].childNodes[0].nodeValue;//解析获取那个xml中pdown节点的数据
                var str=pdown.substring(pdown.indexOf("|http"),);//分割文本
                var n=str.split("|")
                var downlink=new Array();//存放地址，理论上应该够用了
                for(var i=0;i<n.length;i++)
                {
                    if(n[i]!="")
                    {
                        if(n[i].indexOf(";") > -1)
                        {
                            let t=n[i].split(";");
                            for(let x=0; x<t.length; x++)
                            {
                                downlink.push(t[x]);
                            }
                        }
                        else
                        {
                            downlink.push(n[i]);
                        }
                    }
                }
                console.log(downlink)
                showLinks(downlink);
            }
            else if(xmlDoc.getElementsByTagName("durls").length==0)
            {
                //alert("没有解析到软件链接，请下载其他软件");
                var otherdownlink=new Array();

                if($('.ordinary-btn').length>0)
                {
                    //window.open($('.ordinary-btn').attr('href')); //新页面下载
                    //window.location.href=$('.ordinary-btn').attr('href'); //当前页面下载
                    //$('.ordinary-btn').get(0).click(); //普通下载

                    otherdownlink.push($('.ordinary-btn').attr('href'));
                }
                else
                {
                    //window.open($('li[sid="'+appid+'"] .preventSit a').attr('href')); //新页面下载
                    //window.location.href=$('li[sid="'+appid+'"] .preventSit a').attr('href'); //当前页面下载，可能多个链接导致404
                    //$('li[sid="'+appid+'"] .preventSit a').click(); //跳转详情页

                    let preventSitURL=$('li[sid="'+appid+'"] .preventSit a').attr('href');
                    if(preventSitURL.indexOf(";") > -1)
                    {
                        let t=preventSitURL.split(";");
                        for(let x=0; x<t.length; x++)
                        {
                            otherdownlink.push(t[x]);
                        }
                    }
                    else
                    {
                        otherdownlink.push(preventSitURL);
                    }
                }
                showLinks(otherdownlink);
                return;
            }
        }
    });

}

function showLinks(downlink)
{
    var $box =$('<div id="box">'+
                '<span id="closeBtn">'+
                '<svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1126" width="28" height="28"><path d="M512.3 63.9c-247.2 0-447.6 200.4-447.6 447.6S265.1 959 512.3 959s447.6-200.4 447.6-447.6S759.5 63.9 512.3 63.9z m201.4 591.4c15.9 15.9 15.9 41.7 0 57.5-15.9 15.9-41.7 15.9-57.5 0L512.3 569 368.4 712.8c-15.9 15.9-41.7 15.9-57.5 0-15.9-15.9-15.9-41.7 0-57.5l143.9-143.9-143.9-143.8c-15.9-15.9-15.9-41.7 0-57.5 15.9-15.9 41.7-15.9 57.5 0L512.3 454l143.8-144c15.9-15.9 41.7-15.9 57.5 0 15.9 15.9 15.9 41.7 0 57.5L569.8 511.4l143.9 143.9z" fill="#d81e06" p-id="1127"></path></svg>'+
                '</span>'+
                '</div>');
    $("body").append($box);

    for(var i=0;i<downlink.length;i++)
    {
        var link = "<div class='downloadTag'>下载地址"+(i+1)+":</div><br><a href=\""+downlink[i]+"\">"+downlink[i]+"</a><br>"
        $("#box").append($(link));
    }

    $("#box").fadeIn("fast");
    //获取页面文档的高度
    var docheight = $(document).height();
    //追加一个层，使背景变灰
    $("body").append("<div id='greybackground'></div>");
    $("#greybackground").css({"opacity":"0.5","height":docheight});

    var screenwidth,screenheight,mytop,getPosLeft,getPosTop
    screenwidth = $(window).width();
    screenheight = $(window).height();
    //获取滚动条距顶部的偏移
    mytop = $(document).scrollTop();
    //计算弹出层的left
    getPosLeft = screenwidth/2 - 260;
    //计算弹出层的top
    getPosTop = screenheight/2 - 150;
    //css定位弹出层
    $("#box").css({"left":getPosLeft,"top":getPosTop+mytop});
    //当浏览器窗口大小改变时...
    $(window).resize(function(){
        screenwidth = $(window).width();
        screenheight = $(window).height();
        mytop = $(document).scrollTop();
        getPosLeft = screenwidth/2 - 260;
        getPosTop = screenheight/2 - 150;
        $("#box").css({"left":getPosLeft,"top":getPosTop+mytop});
    });

    //当拉动滚动条时...
    $(window).scroll(function(){
        screenwidth = $(window).width();
        screenheight = $(window).height();
        mytop = $(document).scrollTop();
        getPosLeft = screenwidth/2 - 260;
        getPosTop = screenheight/2 - 150;
        $("#box").css({"left":getPosLeft,"top":getPosTop+mytop});
    });

    //点击关闭按钮
    $("#closeBtn").click(function() {
        $("#box").remove();
        //删除变灰的层
        $("#greybackground").remove();
        return false;
    });

}

(function() {
    'use strict';

    GM_addStyle(`
    * {margin:0; padding:0;}
    #box {display:none;position:absolute;width:520px;height:300px;z-index:100001;background:#fff;word-break:break-all; word-wrap:break-word; background:linear-gradient(to bottom, rgb(222,226,232), rgb(234,243,253)); box-shadow:4px 4px 8px rgba(51,51,51,.5); border:1px solid #898989;}
    #box img {height:25px; width:25px}
    #box a {font-size:15px; display:block; padding: 0px 16px 0px 16px}
    #box .downloadTag {margin-top:30px; font-size:20px; padding: 0px 16px 0px 16px; font-family:"Microsoft YaHei","simsun", Arial, Helvetica, sans-serif}
    #closeBtn {position:absolute;right:10px;top:10px;cursor:pointer; width:25px; height:25px}
    #greybackground {background:#000;display:block;z-index:100000;width:100%;position:absolute;top:0;left:0;}
    .banner{display:none!important}
    .hot{display:none!important}
    .container{margin:90px auto!important}
    .pagination{display:none!important}
    .guide{display:none!important}
    .cooperationList{display:none!important}
    .specialListTitle.indexNormalTitle{display:none!important}
    .specialList.indexList.indexNormalList{display:none!important}
    `)

    //更换网页图标
    $('head').append('<link rel="icon" href="https://s2.loli.net/2023/04/28/J5he2BPRsmC6tSF.png">')

    //点击链接弹出窗口
    var timer1 = setInterval(function(){
        if( $(".js-btn-download").length>0)
        {
            $(".js-btn-download").off('click');
            $(".js-btn-download").click(function(){
                let appid = $(this).attr("data-softid");
                getLink(appid);
                return false;
            });
            clearInterval(timer1);
        }
    },500);

    var timer2 = setInterval(function(){
        if(  $(".safe-btn-download").length>0)
        {
            $(".safe-btn-download").off('click');
            $(".safe-btn-download").click(function(){
                let appid = $(this).attr("data-softid");
                getLink(appid);
                return false;
            });
            clearInterval(timer2);
        }
    },500);

    var timer3 = setInterval(function(){
        if( $(".safeDownloadButton").length>0)
        {
            $(".safeDownloadButton").off('click');
            $(".safeDownloadButton").click(function(){
                let appid = $(this).attr("cid");
                getLink(appid);
                return false;
            });
            clearInterval(timer3);
        }
    },500);


    var timer4 = setInterval(function(){
        if( $(".soft-safedown").length>0)
        {
            $(".soft-safedown").off('click');
            $(".soft-safedown").click(function(){
                let appid = $(this).attr("data-softid");
                getLink(appid);
                return false;
            });
            clearInterval(timer4);
        }
    },500);

})();
