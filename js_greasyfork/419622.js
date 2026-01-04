// ==UserScript==
// @name         衢州干部教育网络学院辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  衢州干部教育网络学院自动学习视频获得学分。
// @author       You
// @match        http://www.qzce.gov.cn/play/play.aspx?course_id=*
// @match        http://www.qzce.gov.cn/play/right.aspx?id=*
// @match        http://www.qzce.gov.cn/Course*
// @match        https://www.qzce.gov.cn/default.aspx
// @match        https://www.qzce.gov.cn/Default.aspx
// @match        http://www.qzce.gov.cn/course/default.aspx*
// @match        https://www.qzce.gov.cn/login.aspx
// @match        http://www.qzce.gov.cn/course/default.aspx?txtvalue=&selecttype=coursetype&type=%u5355%u89c6%u9891&finish=true
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/419622/%E8%A1%A2%E5%B7%9E%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/419622/%E8%A1%A2%E5%B7%9E%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var settings = GMgetValue("Settings");
    console.log(settings);
    if (!settings) {
        settings = {
                    username: { value: "", name: "用户" },
                    password: { value: "", name: "密码" },
                }
    }

    console.log(settings);

    const baseUrl = "http://www.qzce.gov.cn";
    var cannotPlayArticles = GM_getValue("cannot_play_articles");
    if (!cannotPlayArticles) {
        cannotPlayArticles = [];
    }

    if (window.location.href.startsWith("http://www.qzce.gov.cn/play/play.aspx?course_id=")) {

        let iframe = document.getElementById("playframe");
        console.log(cannotPlayArticles);
        iframe.onload = function() {
            if (!iframe.contentDocument) {
                cannotPlayArticles.push(window.location.href.split("=")[1]);
                GM_setValue("cannot_play_articles", cannotPlayArticles);
                window.close();

                return;
            }
            getVideoObj(iframe.contentDocument).then((video) =>{
                if (!video) {
                    cannotPlayArticles.push(window.location.href.split("=")[1]);
                    GM_setValue("cannot_play_articles", cannotPlayArticles);
                    window.close();
                } else {
                    video.addEventListener("pause",function(){
                        console.log("paused")
                    })

                    video.addEventListener("ended",async function(){
                        console.log("ended")
                        window.close();
                    })
                }
            })
        }
    } else if (window.location.href.startsWith("http://www.qzce.gov.cn/course/default.aspx?txtvalue=&selecttype=coursetype&type=%u5355%u89c6%u9891&finish=true")) {
        window.onload = function() {
            let articles = getArticles();

            if (articles.length == 0) {
                gotoNextPage();
            } else {
                let articleNum = 0;
                doVideoStudy(articles,articleNum);
            }
        }
    } else if (window.location.href == "https://www.qzce.gov.cn/default.aspx" || window.location.href == "https://www.qzce.gov.cn/Default.aspx") {
        window.onload = function() {
            let loginButton = document.getElementsByName("ctl00$ctl00$cp$LoginButton0")[0];
            console.log(loginButton);
            if (!loginButton) {
                window.open("http://www.qzce.gov.cn/course/default.aspx?txtvalue=&selecttype=coursetype&type=%u5355%u89c6%u9891&finish=true");
            }
        }

    } else if (window.location.href.startsWith("https://www.qzce.gov.cn/login.aspx")) {
        if (settings) {
            document.getElementsByName("ctl00$cp$UserName0")[0].value = settings.username.value
            document.getElementsByName("ctl00$cp$Password0")[0].value = settings.password.value
            document.getElementsByName("ctl00$cp$LoginButton0")[0].click();
        }

    }

    /*let iframe = document.getElementById("playframe");
    iframe.onload = function() {
        var flashObj = iframe.contentDocument["flashObj"]
        console.log(flashObj)
        console.log("------------------")
        flashObj.Play()
    }*/


    // Your code here...

        // 加菜单====================================================================
    function addStyle(cssText) {
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }

    function GMgetValue(name, defaultValue) {
        return GM_getValue(name, defaultValue)
    }

    function GMsetValue(name, value) {
        GM_setValue(name, value)
    }


    /**
 * 主界面 组件
 */
    const comMain = {
        template: `<div id="crackVIPSet" ref="crackVIPSet" :style="styleTop">
<div id="nav">
<button >☑</button>
</div>
<div id="list">
<div style="position:relative;top:0px;">
<b v-for="(key,index) in Object.keys(settings)" :key="index">
<label>
{{settings[key].name}}:<input v-model="settings[key].value" type="text" style="width:90px;">
</label>
</b>
<b>
<label>
<input type="button" @click="changeSetting()" value="设定" align="center">
</b>
</label>
</div>
</div>

</div>`,
        data() {
            return {
                settings: settings,
                nav: 'settings',
                topOffset: 50,
            }
        },
        components: {
        },
        methods: {
            changeSetting() {
                GMsetValue("Settings", this.settings);
                console.log(this.settings);
            },

        },
        computed: {
            styleTop() {
                return `top:${this.topOffset}px;`;
            }
        },
        mounted: function() {

        }
    };

    /**
 * 主界面 CSS
 */
    addStyle(`
body{padding:0;margin:0}
/*
#crackVIPSet input[type=checkbox], input[type=checkbox]{display:none}
#crackVIPSet input[type=checkbox] + span:before,input[type=checkbox] + span:before{content:'☒';margin-right:5px}
#crackVIPSet input[type=checkbox]:checked + span:before, input[type=checkbox]:checked + span:before{content:'☑';margin-right:5px}
*/
#crackVIPSet{z-index:999999;position:fixed;display:grid;grid-template-columns:30px 150px;width:30px;height:150px;overflow:hidden;padding:5px 0 5px 0;opacity:0.4;font-size:12px}
#crackVIPSet button{cursor:pointer}
#crackVIPSet:hover{width:180px;height:450px;padding:5px 5px 5px 0;opacity:1}
#crackVIPSet #nav {display:grid;grid-auto-rows:50px 50px 200px;grid-row-gap:5px}
#crackVIPSet #nav [name=startStudy]:active{cursor:move}
#crackVIPSet #nav button{background:yellow;color:red;font-size:20px;padding:0;border:0;cursor:pointer;border-radius:0 5px 5px 0}
#crackVIPSet #list{overflow:auto;margin-left:2px}
#crackVIPSet #list b{display:block;cursor:pointer;color:#3a3a3a;font-weight:normal;font-size:14px;padding:5px;background-color:#ffff00cc;border-bottom:1px dashed #3a3a3a}
#crackVIPSet #list b:before{content:attr(data-icon);padding-right:5px}
#crackVIPSet #list b:first-child{border-radius:5px 5px 0 0}
#crackVIPSet #list b:last-child{border-radius:0 0 5px 5px}
#crackVIPSet #list b:hover{background-color:#3a3a3a;color:white}
`);


    Vue.prototype.$tele = new Vue();

    let crackApp = document.createElement("div");
    crackApp.id = "crackVIPSet";
    document.body.appendChild(crackApp);

    new Vue({
        el: "#crackVIPSet",
        render: h => h(comMain)
    });
})();


function doVideoStudy(articles, articleNum) {
    console.log("doVideoStudy() start")
    var win = window.open("/play/redirect.aspx?id=" + articles[articleNum].url.split("=")[1]);
    var timer = setInterval(async function() {
        if(win.closed) {
            articleNum++;
            clearInterval(timer);
            if (articleNum < articles.length) {
                doVideoStudy(articles, articleNum);
            } else {
                gotoNextPage();
            }
        }
    },10000);
    console.log("doVideoStudy() end")
}

function gotoNextPage() {
    /*let pageNo = parseInt(document.getElementById("ctl00$ctl00$ctl00$cp$cp$cp$AspNetPager1_input").value);
    pageNo++;
    console.log(pageNo)
    document.getElementById("ctl00$ctl00$ctl00$cp$cp$cp$AspNetPager1_input").value = pageNo;
    let goButton = document.getElementById("ctl00$ctl00$ctl00$cp$cp$cp$AspNetPager1_btn");
    goButton.click();*/
$('div a').each(function() {
                //this.click();
                if (this.innerText == "下页") {
                    console.log("下页")
                    this.click();
                }
                // console.log(this.innerText);
            });
}

function getArticles() {
    console.log("getArticles() start")
    let articles = [];

    var table=document.getElementById("ctl00_ctl00_ctl00_cp_cp_cp_gvCourse");
    var rows=table.rows;
    var cannotPlayArticles = GM_getValue("cannot_play_articles") || []
    for(var i=1;i<rows.length;i++) {
        let article = {};
        let row = rows[i];
        /*if ($(row.cells[0]).find("input[type='checkbox']").attr('disabled') == 'disabled') {
            continue;
        }*/

        var url = $(row.cells[1]).find("a").attr('href');
        if (contains(cannotPlayArticles, url.split("=")[1])) {
            continue;
        }
        console.log($(row.cells[3]).text().trim());
        if (parseFloat($(row.cells[3]).text().trim()) > 0.6) {
            continue;
        }
        article = {
            title: $(row.cells[1]).find("a").attr('title'),
            url: url
        }

        articles.push(article);
    }

    console.log(articles);
    console.log("getArticles() end")
    return articles;

}

function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

async function getVideoObj(doc = document) {
    console.log("getVideoObj() start")

    //let ifr = doc.querySelector("iframe");
    console.log(doc);
    let video;
    let retryNum = 5;
    while (!video) {
        try {
            video = doc.getElementsByTagName("video")[0]
        } catch(e) {}
        console.log(video)
        if (video) {
            break;
        }
        retryNum--;
        if (retryNum == 0) {
            break;
        }
        await sleep(10000);
    }

    console.log("getVideoObj() end")
    return video;
}

function sleep(ms) {
    return new Promise((resolve) => {
        var timer = setTimeout(resolve, ms)
        });
}