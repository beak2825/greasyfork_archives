// ==UserScript==
// @name        异世界动漫 功能优化
// @description 为异世界动漫进行界面优化，增加宽屏模式（默认启动），增加弹幕屏蔽词，增加集数点击记录
// @namespace   gqdmStyle
// @version     1.1.6
// @author      Yozo
// @match       https://www.gqdm.net/index.php/vod/play/*
// @match       https://www.gqdm.net/index.php/vod/detail/*
// @match       https://www.lldm.net/index.php/vod/play/*
// @match       https://www.lldm.net/index.php/vod/detail/*
// @match       https://bf.sbdm.cc/*
// @match       https://bf.mmiku.net/*
// @match       https://yozoscript.github.io/scriptsettings/gqdmStyle*
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @run-at      document-start
// @website     https://yozoscript.github.io/scriptsettings/gqdmStyle
// @homepage    https://yozoscript.github.io/scriptsettings/gqdmStyle
// @downloadURL https://update.greasyfork.org/scripts/451104/%E5%BC%82%E4%B8%96%E7%95%8C%E5%8A%A8%E6%BC%AB%20%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451104/%E5%BC%82%E4%B8%96%E7%95%8C%E5%8A%A8%E6%BC%AB%20%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

const DefaultList = [
    "蛙", "湾湾", "小日子", "美爹", "你们只(.*)吗", "剧透"
]
var BanList = GM_getValue('BanList', DefaultList)
var rootWidth = GM_getValue('rootWidth', 70)

var isKuan = false
var exec = async function () {
    'use strict';
    if (location.host == "www.gqdm.net" || location.host == "gqdm.net" || location.host == "www.lldm.net" || location.host == "lldm.net"){
        if (location.href.startsWith("https://www.gqdm.net/index.php/vod/play/id/") || location.href.startsWith("https://www.lldm.net/index.php/vod/play/id/")) {
            rootWidth = GM_getValue('rootWidth', 70)
            window.window.addEventListener('message', function(event) {
                if (event.data == "kuanping") {
                    if (!isKuan) {
                        isKuan = true
                        if (document.getElementsByClassName("right_row fr hidden_xs hidden_mi").length > 0) {
                            document.getElementsByClassName("container")[0].setAttribute("style", `width:${rootWidth}%;`)
                            document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].setAttribute("style", document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].getAttribute("style") + "display:none;")
                            document.getElementsByClassName("left_row fl")[0].setAttribute("style", "width: 100%;")
                            document.getElementsByClassName("left_row fl")[0].children[0].setAttribute("style", "height: 100%;")
                            document.getElementsByClassName("MacPlayer embed-responsive")[0].style.setProperty("padding-block", "92px 56%")
                            document.getElementsByClassName("MacPlayer embed-responsive")[0].style.removeProperty("padding-bottom")
                        }

                        if (document.getElementById("root")) {
                            document.getElementById("root").setAttribute("style", "width: 85%;")
                            document.getElementById("ageframediv").attributes[1].value = "width: 85%;"
                            document.getElementsByClassName("MacPlayer embed-responsive embed-responsive-16by9")[0].style.setProperty("padding-top", "56%")
                        }
                    } else {
                        isKuan = false
                        if (document.getElementsByClassName("right_row fr hidden_xs hidden_mi").length > 0) {
                            document.getElementsByClassName("container")[0].removeAttribute("style")
                            document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].setAttribute("style", document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].getAttribute("style").replace("display:none;",""))
                            document.getElementsByClassName("left_row fl")[0].removeAttribute("style")
                            document.getElementsByClassName("left_row fl")[0].children[0].removeAttribute("style")
                            document.getElementsByClassName("MacPlayer embed-responsive")[0].style.setProperty("padding-bottom", "56.25%")
                            document.getElementsByClassName("MacPlayer embed-responsive")[0].style.removeProperty("padding-block")
                        }

                        if (document.getElementById("root")) {
                            document.getElementById("root").removeAttribute("style")
                            document.getElementById("ageframediv").attributes[1].value = "width: 980px; height: 540px;"
                            document.getElementsByClassName("MacPlayer embed-responsive embed-responsive-16by9")[0].style.setProperty("padding-top", "45%")
                        }
                    }
                } else if (event.data == "openBanSetting") {
                    window.open("https://yozoscript.github.io/scriptsettings/gqdmStyle/")
                }
            })
            window.window.postMessage("kuanping")

            let vid = location.href.split("/")[7];
            let sid = location.href.split("/")[11].split(".")[0];
            GM_setValue("videoRecord" + vid + "_" + sid, 1);
        } else if (location.href.startsWith("https://www.gqdm.net/index.php/vod/detail/id/") || location.href.startsWith("https://www.lldm.net/index.php/vod/detail/id/")) {
            let vid = location.href.split("/")[7].split(".")[0];
            for (let i = 0; i < document.getElementsByClassName("content_playlist clearfix")[1].childElementCount; i++) {
                let child = document.getElementsByClassName("content_playlist clearfix")[1].children[i].firstChild;
                let sid = child.href.split("/")[11].split(".")[0];
                if (GM_getValue("videoRecord" + vid + "_" + sid, 0) > 0) {
                    child.setAttribute("style", "color: #787878;background: #464646;")
                }
            }
        }

    }
    else if (location.host == "bf.sbdm.cc" || location.host == "bf.mmiku.net"){
        BanList = GM_getValue('BanList', DefaultList)
        setInterval(() => {
            BanList = GM_getValue('BanList', DefaultList)
        }, 30000)
        domChange("player", () => {
          var pp = document.getElementById("player_pause")
          if(pp) pp.setAttribute("style", "display: none;")
        })

        var danmakuI = setInterval(() => {
            if (document.getElementsByClassName("leleplayer-danmaku").length <= 0) return
            console.log("danmaku obversing")
            clearInterval(danmakuI)
            domChangeClass("leleplayer-danmaku", (target) => {
                for (let i = 0; i < target.children.length; i++ ) {
                    let inner = target.children[i].innerText
                    if (inner) {
                        let hasbw = false
                        for(let bw in BanList) {
                            if (inner.match(BanList[bw])) {
                                hasbw = true
                                break
                            }
                        }
                        if (hasbw) {
                            target.removeChild(target.children[i])
                        }
                    }
                }
            })
        }, 100)

        var btnI = setInterval(() => {
            if (!$("#enterhzh").length) return
            clearInterval(btnI)

            $("#enterhzh").after(`<button id="enterkuan" class="leleplayer-icon leleplayer-full-in-icon" data-balloon="宽屏模式" data-balloon-pos="up">
                <span class="leleplayer-icon-content"><svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="#E6E6E6" fill-rule="evenodd">
                  <!-- <path d="M17 4a2 2 0 012 2v11h-2V6.8a.8.8 0 00-.8-.8H4.8a.8.8 0 00-.794.7L4 6.8v8.4a.8.8 0 00.7.794l.1.006H18v2H4a2 2 0 01-2-2V6a2 2 0 012-2h13z"></path> -->
                  <rect id="huazhonghua" x="2.5" y="5" width="16" height="12" rx="1" style=" fill-opacity:0;stroke-width:2;stroke:white"></rect>
                  <rect id="huazhonghua" x="7" y="8" width="7" height="6" rx="1"></rect>
                  </g></svg></span>
                </button>`)
            document.getElementById("enterkuan").onclick = () => {
                window.parent.postMessage("kuanping", "*")
            }
            $("button.leleplayer-comment-setting-icon").after(`<button id="setBanlist" class="leleplayer-icon leleplayer-comment-setting-icon" data-balloon="屏蔽词设置" data-balloon-pos="up">
            <span class="leleplayer-icon-content"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><circle cx="11" cy="11" r="2"></circle>
            <path d="M19.164 8.861L17.6 8.6a6.978 6.978 0 00-1.186-2.099l.574-1.533a1 1 0 00-.436-1.217l-1.997-1.153a1.001 1.001 0 00-1.272.23l-1.008 1.225a7.04 7.04 0 00-2.55.001L8.716 2.829a1 1 0 00-1.272-.23L5.447 3.751a1 1 0 00-.436 1.217l.574 1.533A6.997 6.997 0 004.4 8.6l-1.564.261A.999.999 0 002 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 001.228 2.075l-.558 1.487a1 1 0 00.436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 002.272 0l1.04 1.263a1 1 0 001.272.23l1.997-1.153a1 1 0 00.436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 00.835-.986V9.847a.999.999 0 00-.836-.986zM11 15a4 4 0 110-8 4 4 0 010 8z"></path>
            </svg></span>
        </button>`)
            document.getElementById("setBanlist").onclick = () => {
                window.parent.postMessage("openBanSetting", "*")
            }
        })
    }
}
var exec2 = async function () {
    'use strict';
    BanList = GM_getValue('BanList', DefaultList)
    rootWidth = GM_getValue('rootWidth', 70)

    if (location.host == "yozoscript.github.io"){
        while(!unsafeWindow.mdui){
           console.debug('cannot find mdui, wait one second')
           await sleep(1000)
        }
        const $ = mdui.$

        var banstr = BanList.join(';')
        $('#banListStr')[0].value = banstr
        $('#banListStr')[0].style.height = "inherit"

        $('#rootWidth')[0].value = rootWidth

        $('#saveBtn').on('click', e => {
            if (!$('form')[0].checkValidity()){
                mdui.snackbar('保存失败，请检查格式或漏填')
                return
            }
            var list = $('#banListStr')[0].value.replaceAll("；",";").replaceAll("\n",";").split(';')
            list = uniq(list.filter((x) => {if (x == null || x.length == 0) return false; return true;}))
            GM_setValue('BanList', list)
            $('#banListStr')[0].value = list.join(';')
            var width = parseInt(($('#rootWidth')[0].value).toString())
            GM_setValue('rootWidth', width)
            mdui.snackbar('保存成功')
        })
    }
}
var exec3 = async function () {
    'use strict';
    if (location.host == "www.gqdm.net" || location.host == "gqdm.net" || location.host == "www.lldm.net" || location.host == "lldm.net"){
        if (location.href.startsWith("https://www.gqdm.net/index.php/vod/play/id/") || location.href.startsWith("https://www.lldm.net/index.php/vod/play/id/")) {
            let vid = location.href.split("/")[7];
            let sid = location.href.split("/")[11].split(".")[0];
            GM_setValue("videoRecord" + vid + "_" + sid, 1);
        } else if (location.href.startsWith("https://www.gqdm.net/index.php/vod/detail/id/") || location.href.startsWith("https://www.lldm.net/index.php/vod/detail/id/")) {
            let vid = location.href.split("/")[7].split(".")[0];
            var _ex = setInterval(() => {
                if (document.getElementsByClassName("content_playlist clearfix").length > 1) {
                    clearInterval(_ex);
                    for (let i = 0; i < document.getElementsByClassName("content_playlist clearfix")[1].childElementCount; i++) {
                        let child = document.getElementsByClassName("content_playlist clearfix")[1].children[i].firstChild;
                        let sid = child.href.split("/")[11].split(".")[0];
                        if (GM_getValue("videoRecord" + vid + "_" + sid, 0) > 0) {
                            child.setAttribute("style", "color: #787878;background: #464646;")
                        }
                    }
                }
            }, 100);
        }

    }
}
onload = () => {
    exec();
}
exec2().catch(console.error);
exec3().catch(console.error);

function domChange(domId, callback, runIm) {
    // select the target node
    var target = document.getElementById(domId);
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (callback) callback();
        });
    });
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    // later, you can stop observing
    //observer.disconnect();
    if (runIm && callback) callback();
}
function domChangeClass(domClass, callback, runIm) {
    // select the target node
    var target = document.getElementsByClassName(domClass)[0];
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (callback) callback(target);
        });
    });
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    // later, you can stop observing
    //observer.disconnect();
    if (runIm && callback) callback(target);
}

async function sleep(ms){
   return new Promise((res,) => setTimeout(res,ms))
}
function uniq(array) {
    let temp = [];
    let index = [];
    let l = array.length;
    for(let i = 0; i < l; i++) {
        for(let j = i + 1; j < l; j++){
            if (array[i] === array[j]){
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}