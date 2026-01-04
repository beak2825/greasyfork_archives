// ==UserScript==
// @name         [fatcat] VIP视频破解去广告
// @version      1.7
// @description  主流视频平台VIP，Safari使用userscripts进行安装即可，适配iPad、iPhone。更换解析点方便，不定期更新解析点
// @author       暴走的肥猫

// @include      *://*.youku.com/*
// @include      *://*.iqiyi.com/*
// @include      *://*.le.com/*
// @include      *://v.qq.com/*
// @include      *://m.v.qq.com/*
// @include      *://*.tudou.com/*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.baofeng.com/*
// @include      *://*.pptv.com/*
// @connect      sd.xiumi.us
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant    	 GM_deleteValue
// @grant        GM_openInTab
// @grant        GM.getValue
// @grant        GM.setValue
// @grant    	 GM.deleteValue
// @grant        GM.openInTab
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @run-at       document-start
// @charset		 UTF-8
// @noframes
// @namespace https://greasyfork.org/users/911798
// @downloadURL https://update.greasyfork.org/scripts/445813/%5Bfatcat%5D%20VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445813/%5Bfatcat%5D%20VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {

    'use strict';
    function Tool() {
        this.GMgetValue = function(name, value) {
            if (typeof GM_getValue === "function") {
                return new Promise(function(resolve, reject) {
                    resolve(GM_getValue(name, value));
                })
            } else {
                return new Promise(function(resolve, reject) {
                    resolve(GM.getValue(name, value));
                })
            }
        };
        this.GMsetValue = function(name, value) {
            if (typeof GM_setValue === "function") {
                return GM_setValue(name, value);
            } else {
                return GM.setValue(name, value);
            }
        };
        this.GMdeleteValue = function(name) {
            if (typeof GM_deleteValue === "function") {
                return new Promise(function(resolve, reject) {
                    resolve(GM_deleteValue(name));
                })
            } else {
                return new Promise(function(resolve, reject) {
                    resolve(GM.deleteValue(name));
                })
            }
        };
        this.GMopenInTab = function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        };
        this.request = function(mothed, url, param) {
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    url: url,
                    method: mothed,
                    data: param,
                    onload: function(response) {
                        var status = response.status;
                        var playurl = "";
                        if (status == 200 || status == '200') {
                            var responseText = response.responseText;
                            resolve({
                                "result": "success",
                                "data": responseText
                            });
                        } else {
                            reject({
                                "result": "error",
                                "data": null
                            });
                        }
                    }
                });
            })
        };
    }


    const tool = new Tool();
    const window_url = window.location.href;
    const window_host = window.location.host;


    //第一次检测有无使用的配置记录
    function startCheckData() {
        tool.GMgetValue("config").then(config => {
            if (config) {
                return config;
            } else {
                return new Promise((resolve, reject) => {
                    tool.request("GET",
                                 "https://sd.xiumi.us/xmi/pd/1ma6P/35fecff480a403c1767c35e4f8ec0326.json",
                                 null)
                        .then(data => {
                        var node = $(JSON.parse(data.data).$appendix.htmlForPreview);
                        var arr = eval("([" + node.text() + "])");
                        var getConfig = {
                            accessPoints: arr,
                            activeIndex: 0
                        };
                        tool.GMsetValue("config", getConfig);
                        resolve(getConfig);
                    })
                })
            }
        }).then(config => {
            tool.GMgetValue("config").then(config => {

                if(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
                    createDom(config.accessPoints);
                    bindFunction();
                    specialFuncsBefore().then(()=>{playInIframe(config.activeIndex);return;}).then(()=>{specialFuncsAfter();return;});
                }else{
                    $(document).ready(function(){
                        createDom(config.accessPoints);
                        bindFunction();
                    specialFuncsBefore().then(()=>{playInIframe(config.activeIndex);return;}).then(()=>{specialFuncsAfter();return;});
                    })
                }
            });
        })
    }
    startCheckData();

    function createDom(arr) {
        var dom = $(
            '<style type="text/css">#fatcatMain:hover .allPoints {display: block!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{-webkit-box-shadow:none;border-radius:10px}::-webkit-scrollbar-thumb{border-radius:10px;background:rgba(0,0,0,0.3);-webkit-box-shadow:none}.accessPoint{display:flex;flex-wrap:wrap;justify-content:flex-start}.accessPoint>span{text-align:center;width:49px;line-height:1;padding:7px;color:white;border-radius:4px;border:1px solid white;font-size:12px;text-overflow:ellipsis;overflow:hidden;display:inline-block;white-space:nowrap;margin:5px}.activePoint{border:1px solid transparent!important;background-color:#f7681f;box-shadow:rgb(44 156 141)0px 3px 5px}.refreshPoints{text-align:center;height:14px;width:14px;line-height:1;padding:0;color:white;border-radius:50%;border:1px solid white;font-size:12px;text-overflow:ellipsis;overflow:hidden;display:block;white-space:nowrap;margin:0 4px 5px auto}.fatcatButtons{}.fatcatButtons>span{transform:scale(1);border-radius:50%;width:45px;height:45px;background:linear-gradient(to top right,rgba(129,215,14,1)0%,rgba(46,159,248,1)100%);color:white;font-size:21px;display:inline-grid;text-align:center;margin-left:15px;vertical-align:middle;line-height:2.1}</style><div id="fatcatMain"style="user-select: none; font-family: sans-serif; position: fixed;bottom: 16px;left: 16px;display: inline-block;width: auto;z-index: 999999999;line-height: 1;cursor: default;"><div class="allPoints"style="transform: scale(1); display: none;"><div style="border-radius: 12px;width: 300px;background: linear-gradient( to top right, rgba(129,215,14,1) 0%, rgba(46,159,248,1) 100%);padding: 10px;overflow: overlay;max-height: 25vh;"><div class="refreshPoints">↺</div><div class="accessPoint"></div></div><div style="border: 8px solid transparent;width: 0px;height: 0px;border-top-color: #7cd42c;transform: translate(22px);margin-bottom: 10px;"></div></div><span class="mainVIPIcon"style="border-radius: 12px;width: 60px;height: 60px;background: linear-gradient( to top right, rgba(129,215,14,1) 0%, rgba(46,159,248,1) 100%);color: white;font-size: 20px;font-weight: bolder;display: inline-grid;place-content: center;vertical-align: middle;">VIP</span><span class="fatcatButtons"style=" "><span style="font-size: 31px;line-height: 1.3;">↺</span><span style="font-size: 21px;line-height: 2.1;transform: rotateY(180deg);">➜</span><span style="font-size: 21px;line-height: 2.1;">➜</span><span style="font-size: 21px;line-height: 2.1;transform: rotateY(180deg);">⎋</span></span></div>'
        );
        $("body").append(dom);
        var allPoints = "",
            i;
        for (i in arr) {
            allPoints += ("<span>" + arr[i].name + "</span>");
        };
        $(".accessPoint").html(allPoints);
    }

    function waitforNode(node){
        return new Promise((resolve,reject)=>{
            var setIn=setInterval(function(){
                if($(node).length){
                    resolve($(node));
                    clearInterval(setIn);
                }
            },200)
            });
    }

    function specialFuncsBefore(){
        let hostBindFunc={
            "v.qq.com":async function(){
                return;
            },
            "m.v.qq.com":async function(){
                return;
            },
            "www.iqiyi.com":async function(){
                return;
            },
        };
        return new Promise((resolve,reject)=>{
            if(hostBindFunc[window_host]){
              hostBindFunc[window_host]().then(()=>{resolve()});
            }else{resolve()};
        });
    }

      function specialFuncsAfter(){
          function blockAD(){
            return  new Promise(async (resolve,reject)=>{
                await waitforNode('video');
                $('video').each(function(){
                    $(this)[0].addEventListener('playing', function () {
                        $(this)[0].pause();
                        console.log($(this));
                        $(this).attr('src','none').attr('autoplay','false').attr('preload','none');
                    });
                    $(this).remove();
                });

                var body = $('body');
                var observer = new MutationObserver(mutations=>{
                   $('video').each(function(){
                    $(this)[0].addEventListener('playing', function () {
                        $(this)[0].pause();
                        console.log($(this));
                        $(this).attr('src','none').attr('autoplay','false').attr('preload','none');
                        $(this).remove();
                    });
                });
                });
                var  options = {
                  'childList': true,
                    'subtree':true
                };
                observer.observe(body[0], options);
                resolve();
                });
          };
        let hostBindFunc={
            "v.qq.com":async function(){
                var allEpisodes=await waitforNode('[_stat="videolist:click"]>[_stat="videolist:click"]');
                allEpisodes.each(function(){
                    $(this).click(function(){
                        window.location.href=$(this)[0].href;
                    })
                });
                return;
            },
            "m.v.qq.com":async function(){
                var playerDom=await waitforNode('[data-modid="player"]');
                playerDom.width("100vw").height("56.5vw");
                var allEpisodes=await waitforNode("li.item>a[title]");
                allEpisodes.each(function(){
                    $(this).click(function(){
                        window.location.href=$(this)[0].href;
                    })
                });
                return;
            },
            "www.iqiyi.com":async function(){
                var allEpisodes=await waitforNode('.select-item');
                var nowURL=window.location.href;
                function waitforURLChange(){
                    return new Promise((resolve,reject)=>{
                        var setIn=setInterval(function(){
                            if(window.location.href!=nowURL){
                                resolve(window.location.href);
                                clearInterval(setIn);
                            }
                        },100);
                    });
                };
                allEpisodes.each(function(){
                    $(this).click(function(){
                       waitforURLChange().then(url=>{window.location.reload();});
                    })
                });
                return;
            },
        };
        return new Promise((resolve,reject)=>{
            if(hostBindFunc[window_host]){
                blockAD();
              hostBindFunc[window_host]().then(()=>{resolve()});
            }else{blockAD();resolve();};
        });
    }


    function playInIframe(index) {
        const iframePlayerNodes = {
            "v.qq.com": "#player,#mod_player",
            "m.v.qq.com": '[data-modid="player"]',
            "www.iqiyi.com": "#flashbox",
            "m.iqiyi.com":".m-video-player-wrap",
            "v.youku.com": "#player",
            "m.youku.com": "#playerBox",
            "w.mgtv.com": "#mgtv-player-wrap",
            "www.mgtv.com": "#mgtv-player-wrap",
            "m.mgtv.com":".video-area",
            "tv.sohu.com": "#player",
            "film.sohu.com": "#playerWrap",
            "www.le.com": "#le_playbox",
            "video.tudou.com": ".td-playbox",
            "v.pptv.com": "#pptv_playpage_box",
            "vip.pptv.com": ".w-video",
            "www.wasu.cn": "#flashContent",
            "www.acfun.cn": "#ACPlayer",
            "vip.1905.com": "#player",
            "play.tudou.com": "#player"
        };
        $(".accessPoint").children().removeClass("activePoint");
        $(".accessPoint").children().eq(index).addClass("activePoint");
        tool.GMgetValue("config").then(async function(config){
            var tempConfig = config;
            tempConfig.activeIndex = index;
            tool.GMsetValue("config", tempConfig);
            var src = config.accessPoints[tempConfig.activeIndex].url + window_url;
            var playerDom=await waitforNode(iframePlayerNodes[window_host]);
            if($('[name="fatcatVIP"]').length==0){
            playerDom.append(
                '<iframe name="fatcatVIP" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen="true" style="height:100%;width:100%;z-index:9999999;position:absolute;top:0;left:0;" src="' +
                src + '"></iframe>');}else{
            $('[name="fatcatVIP"]').attr("src",src);
            }
        });
    }

    function bindFunction() {
        $(".accessPoint").children().click(function() {
            playInIframe($(this).index());
        })

        $(".refreshPoints").click(function() {
            //get from xiumi
            tool.GMdeleteValue("config").then(() => {
                $("#fatcatMain").remove();
                return;
            }).then(() => {
                startCheckData();
            });
        })

        $(".fatcatButtons").children().eq(0).bind("click touchstart",function() {
            //refresh HTML
            tool.GMgetValue("config").then(config => {
                playInIframe(config.activeIndex);
            })
        })

        $(".fatcatButtons").children().eq(1).bind("click",function() {
            //select prev
            tool.GMgetValue("config").then(config => {
                if (config.activeIndex == 0) {
                    playInIframe(config.accessPoints.length-1);
                } else {
                    playInIframe(config.activeIndex - 1);
                }
            });
        })

        $(".fatcatButtons").children().eq(2).bind("click",function() {
            //select next
            tool.GMgetValue("config").then(config => {
                if (config.activeIndex == config.accessPoints.length-1) {
                    playInIframe(0);
                } else {
                    playInIframe(config.activeIndex + 1);
                }
            })
        })

        $(".fatcatButtons").children().eq(3).click(function() {
            tool.GMopenInTab($('[name="fatcatVIP"]').attr("src"), {
                active: true,
                setParent: true
            })
        });
    }
})();