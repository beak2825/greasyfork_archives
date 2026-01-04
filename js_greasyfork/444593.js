// ==UserScript==
// @name         TwitterTool
// @namespace    http://tampermonkey.net/
// @version      1.0.12
// @description  自用Twitter小工具
// @author       QGX
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444593/TwitterTool.user.js
// @updateURL https://update.greasyfork.org/scripts/444593/TwitterTool.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //自动关注开关
    let openGz = true;
    //自动打开推文开关;
    let openTw = true;

    let doMain = "https://twitter.com"
    let tws = [
        "/sougenco/status/1523256399609819136","/sougenco/status/1522901560493101056"
    ]

    let gzs = [
        "GoodBunny_NFT","Champz_NFT","kryztelle123",
        "LexisR24","mandaK747",
        //"Copeluck","Broloveu","AnaCicala3","0x_parada","LH19940125"
        //,"H679974","LnitaLL","shleyaV","cocokenla","0x_Peter","s4ullivan_lyly","P19940211","Jinyuooo","Lrdvyc","Canmilly1",
        //"XarrieLu","Fe_ly_Pa","changeKKy","Christ_birds","MOON_birdS_","DaviadTay","Kanillh","WbbieK","DebbieMecham7 ","parne3l","DeniseMire5 ","ScScScmScn","DmvMarie20 ","gateokex","mars82561","Catina84532063",
        //"Lois277","mui7_mu","Weilyb3r","can_ToyLi","sha_dow36","Mavyrice","JarmaBan","Pologoy","Sawn_0x","kali_lly","Mar111vell","Kyo_okop","00la_al0","KJkari4","Lavone0_0","N_A_N_C_Y_APE","Gtnavyc","Josoph3Say","Taiwanhoko",
        //"tianna9_tianay","Rosiriy","Jan_boke","Por_cake7","7Henriet","Elsa787","eason_singer","FBCSherill","account3742","1_o_0_1CXK"


        //"qgx_dev", "LifeQGame","QG11111","YingZKing","DongDong_MC","cml66621"
        //"jiuyou00319127", "jingchangchen","SonyaWa68435858", "jiuyou07", "Stephan01423701",
        //"xisz6042", "gfge9389", "chenzh025",
        //"OnitamaNFT","renrensama1015", "sougenco", "AVAworld_NFT", "anticollective_"
    ]
    //关注列表
    // let gzs = [
    //   "QGX82830804", "chen66681822113", "QG11111", "dongdon65396015",
    // "Michell89083131","Michell74923038","NancyGraber14","Michell28227160","Miranda20421751",
    //"PamelaJ77671334","NormaGa69944299","NicoleW45365639","NicoleR24324567","Rebecca16773983"
    //]

    //评论
    let pingluns = [
        ""
    ]

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


    //url接码
    function decodeText(txt) {
        var query = txt.replace("\r", "").split("\n"),
            type = 'decode', method = 'encodeURI';
        if (query.length) {
            var theFunction = {
                "encodeURI": { "encode": encodeURI, "decode": decodeURI },
                "encodeURIComponent": { "encode": encodeURIComponent, "decode": decodeURIComponent }
            }, result = new Array();
            for (var i = 0; i < query.length; i++) {
                result.push(theFunction[method][type](query[i]));
            }
            return result.join("\n");
        }
        return txt;
    }

    //自动关注
    async function autoguanzhu() {
        console.log("开始自动关注");
        if (openGz) {
            await sleep(4000);
            let z = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1w6e6rj.r-1wtj0ep > div.css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs > div:nth-child(3) > div > div")
            let a = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1w6e6rj.r-1wtj0ep > div.css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs > div:nth-child(2) > div > div")
            if (a) {
                a.click()
            } else if (z) {
                z.click()
            } else {
                setTimeout(autoguanzhu, 4000);
                return
            }
            await sleep(2000);
            window.close()
        }
    }

    function keyboardInput(dom, st) {
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: st,
            dataTransfer: null,
            isComposing: false
        });
        dom.value = st;
        dom.dispatchEvent(evt);
    };
    //光标位置一直在最前面的问题
    function keepLastIndex(obj) {
        var range
        if (window.getSelection) {
            //ie11 10 9 ff safari
            obj.focus(); //解决ff不获取焦点无法定位问题
            range = window.getSelection(); //创建range
            range.selectAllChildren(obj); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
        } else if (document.selection) {
            //ie10 9 8 7 6 5
            range = document.selection.createRange(); //创建选择对象
            //var range = document.body.createTextRange();
            range.moveToElementText(obj); //range定位到obj
            range.collapse(false); //光标移至最后
            range.select();
        }
    }

    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("mousedown",true,true,window,0,
            1000, 500, 1000, 500,false,false,false,false,0,null);
    //let ke = document.createEvent("keydown");
    //var ke = new Event("keypress", {"bubbles":true, "cancelable":false, keyCode: 13});

    //推文自动处理
    async function autotw(a1 = false, a2 = false,a3 = false) {
        console.log("开始自动推文出来");
        if (openTw) {

            document.querySelector("#id__2pqeygom8wf > div:nth-child(3) > div > div > div > div")
            await sleep(1000);
            let like = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div:nth-child(1) > article > div > div > div > div:nth-child(3) > div:nth-child(6) > div > div:nth-child(3) > div > div > div > div")
            if (like && !a1) {
                console.log("推文点喜欢！");
                like.click()
                like.dispatchEvent(e);
                await sleep(1000);
                a1 = true
            }

            let retweet = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div:nth-child(1) > article > div > div > div > div:nth-child(3) > div:nth-child(6) > div > div:nth-child(2) > div > div > div > div")
            if (retweet && !a2) {
                console.log("推文点转推！");
                retweet.click()
                await sleep(1000);
                retweet.dispatchEvent(e);
                await sleep(1000);
                let retweetBtn = document.querySelector("#layers > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-14lw9ot.r-z2wwpe.r-1upvrn0.r-j2cz3j.r-1udh08x.r-u8s1d > div > div > div > div")
                if (retweetBtn) retweetBtn.click();
                retweetBtn.dispatchEvent(e);
                await sleep(2000);
                a2 = true
            }
            let pinglun =document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div:nth-child(1) > div > div:nth-child(1) > article > div > div > div > div:nth-child(3) > div:nth-child(6) > div > div:nth-child(1) > div > div > div > div")
            if (pinglun && !a3) {
                console.log("评论！");
                pinglun.click()
                pinglun.dispatchEvent(e);
                await sleep(3000);


                let input = document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-rsyp9y.r-1pjcn9w.r-htvplk.r-1udh08x.r-1potc6q > div > div > div > div.css-1dbjc4n.r-iphfwy > div > div:nth-child(2) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-184en5c > div > div > div > div > div > div > div > div > div > label > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > div > div > div > div > div > div")
                let txt = '<div data-contents="true"><div class="" data-block="true" data-editor="62mqu" data-offset-key="b32vi-0-0"><div data-offset-key="b32vi-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span style="color: rgb(29, 155, 240);"><span data-offset-key="b32vi-0-0"><span data-text="true">@cml66621</span></span></span><span data-offset-key="b32vi-1-0"><span data-text="true"> </span></span><span style="color: rgb(29, 155, 240);"><span data-offset-key="b32vi-2-0"><span data-text="true">@jingchangchen</span></span></span><span data-offset-key="b32vi-3-0"><span data-text="true"> </span></span><span style="color: rgb(29, 155, 240);"><span data-offset-key="b32vi-4-0"><span data-text="true">@ASAPether</span></span></span><span data-offset-key="b32vi-5-0"><span data-text="true"> good luck</span></span></div></div></div>'
                if (input) {
                     // input.innerHTML = txt
                    // await sleep(1000);
                    // //keyboardInput(input,"a")
                    // let x = document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1habvwh.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-rsyp9y.r-1pjcn9w.r-htvplk.r-1udh08x.r-1potc6q > div > div > div > div.css-1dbjc4n.r-iphfwy > div > div:nth-child(2) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-184en5c > div > div > div > div > div > div > div > div > div > label > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > div > div > div > div.DraftEditor-editorContainer > div")
                    // let evt = document.createEvent('HTMLEvents');
                    // evt.initEvent('input', true, true);
                    // input.dispatchEvent(evt)
                    // x.dispatchEvent(evt)
                    // var event = document.createEvent('Event')
                    // event.initEvent('keydown', true, false)   //注意这块触发的是keydown事件，在awx的ui源码中bind监控的是keypress事件，所以这块要改成keypress
                    // event = Object.assign(event, {
                    // ctrlKey: false,
                    // metaKey: false,
                    // altKey: false,
                    // which: 65,
                    // keyCode: 65,
                    // key: 'a',
                    // code: 'a'
                    // })
                    // input.focus()
                    // input.dispatchEvent(event)
                    // x.focus()
                    // x.dispatchEvent(event)
                    a3 = true
                }
            }
            await sleep(3000);
            if (a1 && a2 && a3) {
                console.log("推文处理结束！");
                return
            } else {
                setTimeout(autotw, 2000, a1, a2, a3);
                return
            }
        }
    }

    //打开链接
    async function openUrl(status) {
        if (status == 1) {
            console.log(1111);
            gzs.forEach(async x => {
                await window.open(doMain + "/" + x);
                await sleep(2000);
            });
            return
        } else if (status == 2) {
            console.log(2222);
            tws.forEach(async x => {
                await window.open(doMain + x);
                await sleep(2000);
            });
            return
        }
    }

    function qinit() {
        let url = window.location.href;
        //
        if (url.indexOf("/home") > -1) {
            if (openGz) openUrl(1)
            if (openTw) openUrl(2)
        }
        if (openGz) {
            console.log("开始自动关注")
            //自动关注处理
            for (let index = 0; index < gzs.length; index++) {
                const element = gzs[index];
                // let reg = eval("/"+element+"$/")
                let reg = new RegExp(element + "$")
                console.log("X当前url:" + url + ",搜索值:" + element)
                if (reg.test(url)) {
                    autoguanzhu()
                    break;
                }
                // X当前url:https://twitter.com/dongdon65396015,搜索值:dongdon65396015

            }
        }
        if (openTw) {
            console.log("开始推文处理")
            //推文处理
            for (let k = 0; k < tws.length; k++) {
                const x = tws[k];
                console.log("Z当前url:" + url + ",搜索值:" + x)
                if (url.indexOf(x) > -1) {
                    autotw()
                    break;
                }
            }
        }

    }
    setTimeout(qinit, 5000);
    // Your code here...
})();