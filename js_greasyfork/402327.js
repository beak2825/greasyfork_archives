// ==UserScript==
// @name BiliBili过滤器
// @description BiliBili哔哩哔哩B站屏蔽与相应关键词有关的视频与直播。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 6.5.2
// @include *t.bilibili.com*
// @include *www.bilibili.com*
// @include *live.bilibili.com*
// @include *space.bilibili.com*
// @exclude *message.bilibili.com*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/402327/BiliBili%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/402327/BiliBili%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==
$(document).ready(function(){
    var i, c, fl, fk, x, a, b, mo = 0,
        glzs = 0,
        ver=0;
    console.log("BiliBili过滤器");

    function debugx() {
        glzs++;
        $(".xfsz_sz").text(glzs);
        return 1; // 1 显示log； 0 隐藏log
    }
    var toObj = (arr) => {
        var obj = {};
        for (var temp in arr) {
            obj[arr[temp]] = true;
        }
        return obj;
    };
    var toArr = (obj) => {
        var arr = [];
        for (var temp in obj) {
            arr.push(temp);
        }
        return arr;
    };
    var together = (a, b) => {
        for (var temp = 0; temp < b.length; temp++) {
            if (b[temp] != null && b[temp] != "" && b[temp] != "null" && b[temp].length < 40) {
                a.push(b[temp] + "");
            }
        }
    };
    var getUniq = (arr) => Array.from(new Set(arr))
    //dd 都屏蔽， bt 只屏蔽标题， zz 只屏蔽up主  gz 屏蔽个人页面和动态的标题
    var dd = GM_getValue("dd", new Array(""));
    var bt = GM_getValue("bt", new Array(""));
    var zz = GM_getValue("zz", new Array(""));
    var gz = GM_getValue("gz", new Array(""));
    var ddx = new Array();
    var btx = new Array();
    var zzx = new Array();
    var gzx = new Array();
    let glc = new Array(ddx, btx, zzx, gzx)
    let glcx = new Array(dd, bt, zz, gz)
    let nglc = new Array();
    let ml = new Array("dd", "bt", "zz", "gz")
    let xfz = 0;
    together(ddx, dd);
    together(btx, bt);
    together(zzx, zz);
    together(gzx, gz);

    function bc() {
        //保存
        for (var i = 0; i < 4; i++) {
            glc[i] = getUniq(glc[i]);
            glcx[i] = new Array();
            together(glcx[i], glc[i]);
            GM_setValue(ml[i], glcx[i]);
            glc[i] = new Array();
            together(glc[i], glcx[i]);
        }
        dd = glc[0].concat();
        bt = glc[1].concat();
        zz = glc[2].concat();
        gz = glc[3].concat();
        bt.push.apply(bt, dd);
        zz.push.apply(zz, dd);
    }
    bc();

    //主页推荐
    function gltjzy() {
        let x;
        let sytj = 0;
        sytj = Math.floor($(".rcmd-box-wrap").width() / $(".video-card-reco").width()) * 2;
        //console.log("数量:  ",sytj)
        $(".video-card-reco").each(function (index, element) {
            $(this).show();
        });
        $(".bili-video-card .bili-video-card__info--ad").each(function (index, element) {
            if (debugx()) console.log("主页推荐过滤广告 " + "\t" +  $(this).parent().parent().parent().parent().parent().parent().text())
            $(this).parent().parent().parent().parent().parent().parent().remove();
            return false;
        });
        for (x = 0; x < zz.length; x++) {
            if (zz[x] != "") {
                $(".video-card-reco .info-box .info .up").each(function (index, element) {
                    if ($(this).text().indexOf(zz[x]) > -1) {
                        if (debugx()) console.log("主页推荐过滤作者 " + "\t" + zz[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().hide();
                        return false;
                    }
                });
                $(".bili-video-card .bili-video-card__info--author").each(function (index, element) {
                    if ($(this).text().indexOf(zz[x]) > -1) {
                        if (debugx()) console.log("主页过滤作者 " + "\t" + zz[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().parent().parent().remove();
                        return false;
                    }
                });
            }
        }
        for (x = 0; x < bt.length; x++) {
            if (bt[x] != "") {
                $(".video-card-reco .info-box .info .title").each(function (index, element) {
                    if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                    if ($(this).text().indexOf(bt[x]) > -1) {
                        if (debugx()) console.log("主页推荐过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().hide();
                    }
                });
                $(".bili-video-card .bili-video-card__info--tit").each(function (index, element) {
                    if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                    if ($(this).text().indexOf(bt[x]) > -1) {
                        if (debugx()) console.log("主页过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().remove();
                    }
                });

            }
        }
        x = 0;
        $(".video-card-reco").each(function (index, element) {
            if ($(this).is(":hidden")) return;
            x++;
            if (x > sytj) $(this).hide();
        });
    }
    $(".rcmd-box-wrap .change-btn,.recommended-container .feed-roll-btn .roll-btn").click(function () {
        ver=0;
        setTimeout(function () {
            gltjzy();
        }, 500);
        setTimeout(function () {
            gltjzy();
        },4000);
    })
    //新版主页推荐
    function gltjzy2() {
        for (x = 0; x < zz.length; x++) {
            if (zz[x] != "") {
                $("#i_cecream > main > section> div.recommend-container__2-line > div > div.bili-video-card__wrap.__scale-wrap > div > div > div > a > span.bili-video-card__info--author").each(function (index, element) {
                    if ($(this).text().indexOf(zz[x]) > -1) {
                        if (debugx()) console.log("主页推荐过滤作者 " + "\t" + zz[x] + " :\t" + $(this).parent().parent().parent().parent().parent().text())
                        $(this).parent().parent().parent().parent().parent().hide();
                        return false;
                    }
                });
            }
        }
        for (x = 0; x < bt.length; x++) {
            if (bt[x] != "") {
                $("#i_cecream > main > section> div.recommend-container__2-line > div > div.bili-video-card__wrap.__scale-wrap > div > div > h3.bili-video-card__info--tit").each(function (index, element) {
                    if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                    if ($(this).text().indexOf(bt[x]) > -1) {
                        if (debugx()) console.log("主页推荐过滤标题 " + "\t" + bt[x] + " :\t" + $(this).parent().parent().parent().parent().text())
                        $(this).parent().parent().parent().parent().hide();
                    }
                });
            }
        }
    }
    $("div.roll-btn-wrap .roll-btn").click(function () {
        ver=1;
        setTimeout(function () {
            gltjzy2();
        }, 500);
    })

    //频道推荐
    function gltjpd() {
        let x
        $(".game-groom-box-m .game-groom-m").show();
        for (x = 0; x < zz.length; x++) {
            if (zz[x] != "") {
                $(".game-groom-m .num .author").each(function (index, element) {
                    // element == this
                    if ($(this).text().indexOf(zz[x]) > -1) {
                        if (debugx()) console.log("过滤作者 " + "\t" + zz[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().hide();
                        return false;
                    }
                });
            }
        }
        for (x = 0; x < bt.length; x++) {
            if (bt[x] != "") {
                $(".game-groom-box-m .game-groom-m .title").each(function (index, element) {
                    if ($(this).parent().parent().is(":hidden")) return;
                    // element == this
                    if ($(this).text().indexOf(bt[x]) > -1) {
                        if (debugx()) console.log("过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                        $(this).parent().parent().hide();
                    }
                });
            }
        }
    }
    $(".game-groom-box-m .rec-btn.next,.game-groom-box-m .rec-btn.prev").click(function () {
        gltjpd();
    })

    function glyc() {
        var islast=0;
        if (mo == 1) { //主页
            $(".bili-video-card .bili-video-card__info--ad").each(function (index, element) {
                if (debugx()) console.log("主页推荐过滤广告 2 " + "\t" +  $(this).parent().parent().parent().parent().parent().parent().text())
                $(this).parent().parent().parent().parent().parent().parent().remove();
                return false;
            });
        }
        for (x = 0; x < zz.length; x++) {
            if (x== zz.length-1){islast=1};
            if (zz[x] != "") {
                if (mo == 1) { //主页
                    $(".bili-video-card .bili-video-card__info--author").each(function (index, element) {
                        if ($(this).text().indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("主页过滤作者 " + "\t" + zz[x] + " :\t" + $(this).text())
                            $(this).parent().parent().parent().parent().parent().parent().remove();
                            return false;
                        }
                    });
                    if (ver==0){
                        fl = document.evaluate('//div[@class="live-card"]/a/div[@class="up"]/div[@class="txt"]/p[@class="name" and contains(text(),"' + zz[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (fl.snapshotLength) {
                            for (i = fl.snapshotLength - 1; i > -1; i--) {
                                if (debugx()) console.log("主页作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl.snapshotItem(i).remove();
                            }
                        }
                        fl = document.evaluate('//div[@class="zone-list-box storey-box"]/div[@class="video-card-common"]/a[@class="up" and contains(text(),"' + zz[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (fl.snapshotLength) {
                            for (i = fl.snapshotLength - 1; i > -1; i--) {
                                if (debugx()) console.log("主页作者 2" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl.snapshotItem(i).remove();
                            }
                        }
                    }else{
                        //new
                        $(`div.live-card-body > div.bili-live-card > div.bili-live-card__wrap.__scale-wrap > a > div.bili-live-card__info > div.bili-live-card__info--text > div.bili-live-card__info--uname > span:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(zz[x]) > -1) {
                                if (debugx()) console.log("主页作者 3" + "\t" + zz[x] + " :\t" + $(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().parent().parent().remove();
                            }
                        })
                        $(`div.video-card-body > div.bili-video-card > div.bili-video-card__wrap.__scale-wrap > div > div > p > a > span.bili-video-card__info--author:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(zz[x]) > -1) {
                                if (debugx()) console.log("主页作者 4" + "\t" + zz[x] + " :\t" + $(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().parent().parent().remove();
                            }
                        })
                        $(`#i_cecream > main > section div.video-card-body > div > div.bili-video-card__wrap.__scale-wrap > div > div > div > a > span.bili-video-card__info--author:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(zz[x]) > -1) {
                                if (debugx()) console.log("主页作者 5" + "\t" + zz[x] + " :\t" + $(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().parent().parent().remove();
                            }
                        })


                    }
                }
                if (mo == 2) { //频道
                    $(`div.bili-video-card > div > div > div > p > a > span.bili-video-card__info--author`).each(function(){
                        if ($(this).text().indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("频道作者  1" + "\t" + zz[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().parent().parent().remove();
                        }
                    })
                $(".bili-video-card .bili-video-card__info--author").each(function (index, element) {
                    if ($(this).text().indexOf(zz[x]) > -1) {
                        if (debugx()) console.log("频道作者 2" + "\t" + zz[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().parent().parent().remove();
                        return false;
                    }
                });
                }
                if (mo == 3) { //视频
                    fl = document.evaluate('//div[@class="rec-list"]/div[@class="video-page-card"]/div[@class="card-box"]/div[@class="info"]/div[@class="count up"]/a[contains(text(),"' + zz[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("视频作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    $(`#reco_list > div.rec-list > div.video-page-card-small > div > div.info > div.upname > a > span`).each(function(){
                        if ($(this).text().indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("视频作者 2" + "\t" + zz[x] + " :\t" + $(this).parent().parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().parent().remove();
                        }
                    })
                }
                if (mo == 6) { //直播
                    fl = document.evaluate('//div[@class="room-ctnr w-100"]/div[@class="room-card-wrapper p-relative dp-i-block"]/a/div[@class="card-info-ctnr"]/div[@class="text-info-ctnr body-bg p-relative dp-i-block v-middle"]/div[@class="room-anchor card-text p-relative"]/span[contains(text(),"' + zz[x] + '")]/../../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("直播作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    $(`#app div.room-ctnr > div > a > div.card-info-ctnr > div.text-info-ctnr.body-bg.p-relative.dp-i-block.v-middle > div.room-anchor.card-text.p-relative > span`).each(function(){
                        if ($(this).text().indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("直播作者 2" + "\t" + zz[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().parent().remove();
                        }
                    })
                    $(`div.index_1Jokt5rg > div > a > div.Item_2A9JA1Uf > div.Item_2onI5dXq > div.Item_1Cr59yf9 > div.Item_29AwQRu5 > div.Item_QAOnosoB:not([lv])`).each(function(){
                        if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                        if ($(this).text().indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("直播作者 3" + "\t" + zz[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().parent().parent().remove();
                        }
                    })

                }
                if (mo == 7) { //在线列表up主
                    fl = document.evaluate('//div[@class="online-list"]/div[@class="ebox"]/div[@class="dlo"]/a[contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("在线作者 1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    fl = document.querySelectorAll("#app > div.popular-video-container.popular-list > div > ul > div > div.video-card__info > div > span.up-name > span");
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("热门作者 1" + "\t" + zz[x] + " :\t" + fl[i].parentNode.parentNode.parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div.rank-container > div.rank-list-wrap > ul > li > div > div.info > div > a > span.up-name");
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("热门作者 2" + "\t" + zz[x] + " :\t" + fl[i].parentNode.parentNode.parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div.popular-video-container.weekly-list > div:nth-child(2) > div > div > div.video-card__info > div > span.up-name > span");
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("热门作者 3" + "\t" + zz[x] + " :\t" + fl[i].parentNode.parentNode.parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div > ul > div > div > div.video-card__info > div > span.up-name > span");
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("热门作者 4" + "\t" + zz[x] + " :\t" + fl[i].parentNode.parentNode.parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div.popular-video-container.popular-list > div > ul > div > div.video-card__info > div > span.up-name > span");
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(zz[x]) > -1) {
                            if (debugx()) console.log("热门作者 5" + "\t" + zz[x] + " :\t" + fl[i].parentNode.parentNode.parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.parentNode.remove();
                        }
                    }

                }
                fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="video-card-common"]/a[@class="up"]/i[contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("作者1" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
                fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common ex-card-common"]/a[@class="ex-up"]/i[contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("作者2" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
                fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common ex-card-common"]/a[contains(text(),"' + zz[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("作者3" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
                fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="article-card"]/div/a[@class="up" and contains(text(),"' + zz[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("作者4" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
                fl = document.evaluate('//div[@class="groom-box-m clearfix"]/div[@class="groom-module"]/a/div[@class="card-mark"]/p[@class="author"  and contains(text(),"' + zz[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("作者6" + "\t" + zz[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
            }
        }
        islast=0;
        for (x = 0; x < bt.length; x++) {
            if (x== bt.length-1){islast=1};
            if (bt[x] != "") {
                if (mo == 1) { //主页
                    $(".bili-video-card .bili-video-card__info--tit").each(function (index, element) {
                        if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                        if ($(this).text().indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("主页过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                            $(this).parent().parent().parent().parent().remove();
                        }
                    });
                    if (ver==0){
                        fl = document.evaluate('//div[@class="live-card"]/a/div[@class="up"]/div[@class="txt"]/p[@class="desc" and contains(text(),"' + bt[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (fl.snapshotLength) {
                            for (i = fl.snapshotLength - 1; i > -1; i--) {
                                if (debugx()) console.log("主页 标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl.snapshotItem(i).remove();
                            }
                        }

                        fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="video-card-common"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (fl.snapshotLength) {
                            for (i = fl.snapshotLength - 1; i > -1; i--) {
                                if (debugx()) console.log("主页 标题 2" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl.snapshotItem(i).remove();
                            }
                        }
                        fl = document.evaluate('//div[@class="zone-list-box storey-box"]/div[@class="video-card-common"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (fl.snapshotLength) {
                            for (i = fl.snapshotLength - 1; i > -1; i--) {
                                if (debugx()) console.log("主页 标题 3" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl.snapshotItem(i).remove();
                            }
                        }
                        fl = document.evaluate('//div[@class="zone-list-box"]/div[@class="article-card"]/div/a[@class="title" and contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (fl.snapshotLength) {
                            for (i = fl.snapshotLength - 1; i > -1; i--) {
                                if (debugx()) console.log("主页 标题 4" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl.snapshotItem(i).remove();
                            }
                        }
                        fl = document.querySelectorAll("#ranking-all > div > ul.rank-list.hot-list > li > a")
                        for (i = fl.length - 1; i > -1; i--) {
                            if (fl[i].innerText.indexOf(bt[x]) > -1) {
                                if (debugx()) console.log("主页 标题 5" + "\t" + bt[x] + " :\t" + fl[i].parentElement.innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl[i].parentElement.remove();
                            }
                        }
                        fl = document.querySelectorAll("div.rank-list > div > a > p")
                        for (i = fl.length - 1; i > -1; i--) {
                            if (fl[i].innerText.indexOf(bt[x]) > -1) {
                                if (debugx()) console.log("主页 标题 6" + "\t" + bt[x] + " :\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                                fl[i].parentElement.parentElement.remove();
                            }
                        }
                    }else{
                        //new
                        $(`div.live-card-body > div.bili-live-card > div.bili-live-card__wrap.__scale-wrap > a > div.bili-live-card__info > div.bili-live-card__info--text > h3.bili-live-card__info--tit > span:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(bt[x]) > -1) {
                                if (debugx()) console.log("主页 标题 7" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().parent().parent().remove();
                            }
                        })
                        $(`div.video-card-body > div.bili-video-card > div.bili-video-card__wrap.__scale-wrap > div > div > a > h3.bili-video-card__info--tit:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(bt[x]) > -1) {
                                if (debugx()) console.log("主页 标题 8" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().parent().remove();
                            }
                        })
                        $(`ul[class^='bili-rank'] > li > div > a > div > h3:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(bt[x]) > -1) {
                                if (debugx()) console.log("主页 标题 9" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().remove();
                            }
                        })
                        $(`#i_cecream > main > section > div > div.video-card-body > div > div.bili-video-card__wrap.__scale-wrap > div > div > h3.bili-video-card__info--tit:not([lv])`).each(function(){
                            if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                            if ($(this).text().indexOf(bt[x]) > -1) {
                                if (debugx()) console.log("主页 标题 10" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                                $(this).parent().parent().parent().parent().remove();
                            }
                        })
                    }
                }
                if (mo == 2) { //频道
                    fl = document.evaluate('//div[@class="storey-box clearfix"]/div[@class="spread-module"]/a/p[@class="t" and contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("频道标题 2 " + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    fl = document.querySelectorAll("div.rank-list-wrap > ul > li")
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("频道标题 3" + "\t" + bt[x] + " :\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl[i].remove();
                        }
                    }
                    fl = document.evaluate('//div[@class="groom-box-m clearfix"]/div[@class="groom-module"]/a/div[@class="card-mark"]/p[@class="title"  and contains(text(),"' + bt[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("频道标题 4" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    $(`div.bili-video-card > div > div > div > a > h3`).each(function(){
                        if ($(this).text().indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("频道标题  5" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().parent().remove();
                        }
                    })
                $(".bili-video-card .bili-video-card__info--tit").each(function (index, element) {
                    if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                    if ($(this).text().indexOf(bt[x]) > -1) {
                        if (debugx()) console.log("频道过滤标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().remove();
                    }
                });
                $(".bili-rank-list-video__item .rank-video-card__info--tit").each(function (index, element) {
                    if ($(this).parent().parent().parent().parent().is(":hidden")) return;
                    if ($(this).text().indexOf(bt[x]) > -1) {
                        if (debugx()) console.log("频道排名标题 " + "\t" + bt[x] + " :\t" + $(this).text())
                        $(this).parent().parent().parent().parent().remove();
                    }
                });

                }
                if (mo == 3) { //视频
                    fl = document.evaluate('//div[@class="rec-list"]/div[@class="video-page-card"]/div[@class="card-box"]/div[@class="info"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("视频标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    $(`#reco_list > div.rec-list > div.video-page-card-small > div > div.info > a > p.title`).each(function(){
                        if ($(this).text().indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("视频标题 2" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().remove();
                        }
                    })
                }
                if (mo == 4) { //
                    $(".small-item .title").each(function (index, element) {
                        if ($(this).parent().is(":hidden")) return;
                        gz.forEach(x => {
                            if (x != "") {
                                if ($(this).text().indexOf(x) > -1) {
                                    $(this).parent().hide();
                                    if (debugx()) console.log("个人空间 标题", x, " ：", $(this).text());
                                }
                            }
                        })
                    });
                }
                if (mo == 6) { //直播
                    fl = document.evaluate('//div[@class="room-ctnr w-100"]/div[@class="room-card-wrapper p-relative dp-i-block"]/a/div[@class="card-info-ctnr"]/div[@class="text-info-ctnr body-bg p-relative dp-i-block v-middle"]/span[contains(text(),"' + bt[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("直播标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    $(`div.index_1Jokt5rg > div > a > div.Item_2A9JA1Uf > div.Item_2onI5dXq > div.Item_1Cr59yf9 > div.Item_2GEmdhg6:not([lv])`).each(function(){
                        if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                        if ($(this).text().indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("直播标题 2" + "\t" + bt[x] + " :\t" + $(this).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().parent().remove();
                        }
                    })
                    $(`div.index_1Jokt5rg > div > a > div.Item_2A9JA1Uf > div.Item_3ysKErMC > div.Item_SI0N7ecx:not([lv])`).each(function(){
                        if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                        if ($(this).text().indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("直播分类 1" + "\t" + bt[x] + " :\t" + $(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                            $(this).parent().parent().parent().parent().remove();
                        }
                    })

                }
                if (mo == 7) { //在线热门列表标题
                    fl = document.evaluate('//div[@class="online-list"]/div[@class="ebox"]/a[1]/p[contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--) {
                            if (debugx()) console.log("在线标题 1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                    fl = document.querySelectorAll("#app > div.popular-video-container.popular-list > div > ul > div > div.video-card__info > p")
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("热门标题 1" + "\t" + bt[x] + " :\t" + fl[i].parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div.rank-container > div.rank-list-wrap > ul > li > div > div.info > a")
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("热门标题 2" + "\t" + bt[x] + " :\t" + fl[i].parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div.popular-video-container.weekly-list > div:nth-child(2) > div > div > div > div.video-card__info > p")
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("热门标题 3" + "\t" + bt[x] + " :\t" + fl[i].parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div > ul > div > div > div.video-card__info > p")
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("热门标题 4" + "\t" + bt[x] + " :\t" + fl[i].parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.remove();
                        }
                    }
                    fl = document.querySelectorAll("div.popular-video-container.popular-list > div > ul > div > div.video-card__info > p")
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(bt[x]) > -1) {
                            if (debugx()) console.log("热门标题 5" + "\t" + bt[x] + " :\t" + fl[i].parentNode.parentNode.innerText.replace(/\s\s/g, " "));
                            fl[i].parentNode.parentNode.remove();
                        }
                    }

                }
                //视频标题
                fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common"]/a[@class="title" and contains(text(),"' + bt[x] + '")]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("标题1" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
                fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common"]/a[@class="title"]/span[contains(text(),"' + bt[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("标题2" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
                fl = document.evaluate('//div[@class="ext-box"]/div[@class="video-card-common ex-card-common"]/div/a/p[contains(text(),"' + bt[x] + '")]/../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                if (fl.snapshotLength) {
                    for (i = fl.snapshotLength - 1; i > -1; i--) {
                        if (debugx()) console.log("标题3" + "\t" + bt[x] + " :\t" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl.snapshotItem(i).remove();
                    }
                }
            }
        }
        //动态
        islast=0;
        for (x=0;x<gz.length;x++) {
            if (x==gz.length-1){islast=1;}
            if (gz[x] != "") {
                if (mo == 5) {
                    fl = document.querySelectorAll("#app > div > div.container > div > div > div > div > div.center-box > a");
                    for (i = fl.length - 1; i > -1; i--) {
                        if (fl[i].innerText.indexOf(gz[x]) > -1) {
                            if (debugx()) console.log("动态标题 ", gz[x] + "\t" + "\t:" + "\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl[i].parentElement.parentElement.parentElement.remove();
                        }
                    }

                }
                fl = document.querySelectorAll("div.dynamic-panel-popover div.video-list > a > div > div > div.center-box > a");
                for (i = fl.length - 1; i > -1; i--) {
                    if (fl[i].innerText.indexOf(gz[x]) > -1) {
                        if (debugx()) console.log("动态标题 1", gz[x] + "\t" + "\t:" + "\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl[i].parentElement.parentElement.parentElement.parentElement.remove();
                    }
                }
                fl = document.querySelectorAll("div.header-content-panel > div > a > div > div > div.center-box > a");
                for (i = fl.length - 1; i > -1; i--) {
                    if (fl[i].innerText.indexOf(gz[x]) > -1) {
                        if (debugx()) console.log("动态标题 2", gz[x] + "\t" + "\t:" + "\t" + fl[i].innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        fl[i].parentElement.parentElement.parentElement.parentElement.remove();
                    }
                }
                $(`div.bili-header__bar > ul.right-entry > li:nth-child(4) > div > div > div > div.header-tabs-panel__content > div.header-content-panel > div > a > div > div > div.header-dynamic__box--center > a:not([lv])`).each(function(){
                    if (islast && $(this).text().length>0){$(this).attr("lv","1");}
                    if ($(this).text().indexOf(gz[x]) > -1) {
                        if (debugx()) console.log("动态标题 3" + "\t" + gz[x] + " :\t" + $(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
                        $(this).parent().parent().parent().parent().remove();
                    }
                })
            }
        }
        return true;
    }

    var wz = location.href;
    var kj = 3000;
    var xh;
    if ((wz.indexOf("live.bilibili.com") > -1 && wz.split(".com/")[1]!="all" && wz.split(".com/")[1].length > 0 &&  wz.split(".com/")[1].split("/")[1].length <1)) {
        return
    }
    //mo 模式 1主页 2频道 3视频 4个人页面 5动态 6直播 7在线热门
    var mode = ['', '主页', '频道', '视频', '个人页面', '动态', '直播', '在线热门'];
    if (wz.split("bilibili.com")[1].length < 2) {
        kj = 30000;
        mo = 1;
        ver=document.querySelector("#reportFirst2 > div.bypb-window > div");
        if (ver==null){console.log("新版主页");ver=1}else{console.log("旧版主页");ver=0}
    }
    if (wz.indexOf("/v/") > -1 || wz.indexOf("guochuang/") > -1) {
        kj = 3000;
        mo = 2;
    }
    if ((wz.indexOf("video/") > -1 && wz.indexOf("online.html") < 0) || wz.indexOf("play/") > -1) {
        kj = 10000;
        mo = 3;
    }
    if (wz.indexOf("space.bilibili.com") > -1) {
        kj = 2000;
        mo = 4;
    }
    if (wz.indexOf("t.bilibili.com") > -1) {
        kj = 3000;
        mo = 5;
    }
    if (wz.indexOf("live.bilibili.com") > -1) {
        kj = 6000;
        mo = 6;
    }
    if (wz.indexOf("online.html") > -1 || wz.indexOf("popular") > -1 || wz.indexOf("/rank/") > -1) {
        kj = 5000;
        mo = 7;
    }
    if (mo == 0) return;
    if (mo == 3) {
        console.log("模式 ", mo, ' ', mode[mo], ' ', kj, '   ', location.href);
        setTimeout(glyc, kj);
    } else {
        console.log("模式 ", mo, ' ', mode[mo], ' ', kj, '   ', location.href);
        if ( ver==0 ) { gltjzy(); } else { gltjzy2(); }
        gltjpd();
        setTimeout(()=>{glyc()}, 3000);
        setInterval(()=>{glyc()}, kj);
    }

    //--------------左下角按钮--设置界面-------------
    let wdstyle = document.createElement('style');
    wdstyle.innerHTML = `
.xfsz {
transition: all 0.3s;
    height:120px;
    width: 120px;
    position: fixed;
    z-index: 10;
    opacity: 0;
    left: 0px;
    bottom: 0px;
  }
  .xfsz:hover{
    opacity: 1;
  }
  .xfck {
    display: none;
    background: #222;
    width: 700px;
    height: 640px;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 99999;
    border: solid 3px #000000;
  }
  .xfsc {
    background: #444;
    right: 20px;
    border-radius: 35px;
    margin-bottom: 13px;
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
    border: solid 5px #444;
    white-space: nowrap;
    float: left;
  }
  .xfsc:hover {
    background: #000;
    border: solid 5px #000;
  }
  .xfan {
    width: 100px;
    height: 40px;
  }
  .xfyy {
    overflow: auto;
    width: 700px;
    height: 430px;
    margin: auto;
  }
  #xf_sr {
    width: 580px;
    height: 32px;
    margin: auto;
  }
  #xf_dc {
    margin-left: 40px;
    margin-right: 40px;
  }
  .xfgb {
    position: absolute;
    right: 3px;
    top: 3px;
    cursor: pointer;
    font-size: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .xfgb:hover {
    background: #f00;
  }
  .tabbox ul {
    list-style: none;
    display: table;
    margin: 0;
    padding-left: 70px;
    width: 1000px;
  }
  .tabbox ul li {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border: 1px solid #aaccff;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
  }

  .tabbox ul li:hover{
    background-color: #111;
    color: white;
    font-weight: bold;
  }
  .tabbox ul li.active {
    background-color: #004f69;
    color: white;
    font-weight: bold;
  }
  .xfan,
  #xf_sr {
    background: #333;
    color: #ddd;
  }
  .xfan:hover,
  #xf_sr:focus {
    background: #111;
    color: #fff;
  }


.xfsz_an {
pointer-events:auto;
    left: 10px;
    bottom:10px;
cursor: pointer;
 --glow-color: rgb(217, 176, 255);
 --glow-spread-color: rgba(191, 123, 255, 0.781);
 --enhanced-glow-color: rgb(231, 206, 255);
 --btn-color: rgb(100, 61, 136);
 border: 3px solid var(--glow-color);
 color: var(--glow-color);
 font-size: 16px;
 font-weight: bold;
 background-color: var(--btn-color);
 border-radius: 50%;
 text-align: center;
 outline: none;
 box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
 text-shadow: 0 0 .5em var(--glow-color);
 position:absolute;
 display: block;
 transition: all 0.3s;
     width:40px;
    height:40px;
    line-height: 40px;
}

.xfsz_an:hover {
 color: var(--btn-color);
 background-color: var(--glow-color);
 box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 2em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
}

.xfsz_an:active {
 box-shadow: 0 0 0.6em .25em var(--glow-color),
        0 0 2.5em 2em var(--glow-spread-color),
        inset 0 0 .5em .25em var(--glow-color);
}
  `;
    let wddiv = `
<div class="xfsz">
    <div class="xfsz_an xfsz_sz" title="过滤设置">0</div>

</div>
<div class="xfck">
    <div>BiliBili过滤设置 前三者作用于主页、频道、直播推荐 最后一项用于个人主页与动态推荐</div>
    <div class="xfgb">X
    </div>
    <div>
        <textarea type="text" name="textfield" id="xf_sr" width="auto"></textarea>
        <br>
        不同过滤词用英文 , 分隔；导入会清空已有的，替换为导入的，导入空白等于删除全部过滤词。
        <br>
        <input type="submit" name="submit" id="xf_zj" class="xfan" value="增加">
        <input type="submit" name="submit" id="xf_dc" class="xfan" value="导出">
        <input type="submit" name="submit" id="xf_dr" class="xfan" value="导入">
    </div>
    <div class="tabbox">
        　　<ul>
            　　　　<li class="active">标题+up主</li>
            　　　　<li>标题</li>
            　　　　<li>up主</li>
            　　　　<li>个人页面+动态推荐</li>
            　　</ul>
        <br>
        <div class="xfyy"></div>
    </div>
</div>
`;
    document.body.appendChild(wdstyle);
    setTimeout(() => {
        document.querySelector("body").innderHTML += wddiv;
        $(wddiv).appendTo($("body"));
        //关闭
        $(".xfgb").click(function () {
            $(".xfck").toggle();
        })
        $(".xfsz_an").click(function () {
            $(".xfck").toggle();
        });

        $(".tabbox ul li").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            //获取选中元素的下标
            var index = $(this).index();
            $(this).parent().siblings().children().eq(index).addClass("active")
                .siblings().removeClass("active");
            xfz = index;
            sc();
        })
        //删除
        function sc() {
            $(".xfyy").empty();
            glc[xfz].forEach(glcc => {
                let a = document.createElement("span");
                $(a).text(glcc).addClass("xfsc");
                $(a).click(function () {
                    glc[xfz] = glc[xfz].filter(item => {
                        return item != $(a).text();
                    })
                    if (mo == 4) {
                        $(".small-item").show();
                    }
                    bc();
                    sc();
                })
                $(a).appendTo($(".xfyy"));
            });
        }
        sc();

        //增加
        $("#xf_zj").click(function () {
            nglc = $("#xf_sr").val().split(",");
            together(glc[xfz], nglc);
            glc[xfz] = getUniq(glc[xfz]);
            bc();
            sc();
            $("#xf_sr").val("")
        });

        //导出
        $("#xf_dc").click(function () {
            let s = "";
            glc[xfz].forEach((x) => {
                s += x + ","
            })
            $("#xf_sr").val(s).select();
        });
        //导入
        $("#xf_dr").click(function () {
            glc[xfz] = $("#xf_sr").val().split(",");
            bc();
            sc();
            $("#xf_sr").val("");
        });
        $('.xfsz').click(e => {
            $('.xfsz').hide();
            $(document.elementFromPoint(e.clientX, e.clientY)).trigger("click");
            $('.xfsz').show();
        });
        $(".xfsz_an").hover(function(){
            $(".xfsz").unbind('click');
        }, function(){
            $(".xfsz").unbind('click').click(e => {
                $('.xfsz').hide();
                $(document.elementFromPoint(e.clientX, e.clientY)).trigger("click");
                $('.xfsz').show();
            });
        });
        function glsjy() {

        }
    }, 1000);
});