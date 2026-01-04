// ==UserScript==
// @name         绯月布局调整
// @namespace    http://tampermonkey.net/
// @version      1.3.9
// @description  显示用户名称,压缩楼层,头像屏蔽,首页布局调整
// @author       aotmd
// @match        https://bbs.kfmax.com/*
// @match        https://kfmax.com/*
// @match        https://kf.miaola.work/*
// @match        https://bbs.9shenmi.com/*
// @match        https://bbs.kfpromax.com/*
// @grant        none
// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/433751/%E7%BB%AF%E6%9C%88%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/433751/%E7%BB%AF%E6%9C%88%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
let setting = {
    /*↓主题内样式↓*/
    压缩楼层: true,
    头像屏蔽: false,
    /*↓首页样式↓*/
    隐藏背景更改图片: false,
    不加边框: false,
    隐藏顶栏图片: false,
    去除奇怪的底色以及奇怪的样式: true,
};
(function () {
    addLoadEvent(() => {
        window.setTimeout(() => {
            let elementNodeListOf = document.querySelectorAll(".indexlbtc > a");
            for (let i = 0; i < elementNodeListOf.length; i++) {
                let uname=elementNodeListOf[i].getAttribute("uname");
                if(uname!=null){
                    let spanElement = document.createElement('span');
                    spanElement.className="indexlbtc_u";
                    elementNodeListOf[i].appendChild(spanElement);
                    spanElement.appendChild(document.createTextNode(uname));
                }
            }
        }, 0);
    });

    addStyle(`
        span.indexlbtc_u {
            display: inline-block;
            float: left;
            width: 80px;
            /*dtext-align: center;*/
            overflow: visible;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        span.indexlbtc_s {
            width: 70px!important;
        }
        span.indexlbtc_t {
            width: 450px!important;
        }
        .indexlbtc {
            line-height: normal;
        }
    `);
    addStyle(`
        /*布局打回原形*/
        .indexlbtc a {
            letter-spacing: unset!important;
            line-height: unset!important;
            height: unset!important;
            /*display: unset!important;*/
            box-shadow: 0px 0px 0px 1px #CCCCCC;
            font-weight: unset;
            border-radius: unset;
        }
        .rightboxa {
            line-height: normal!important;
            /*border: initial!important;*/
            border: 1px #CCCCCC solid;
            margin-left: 5px;
            margin-right: 5px;
        }
        a.k_butt.k_blk {
            border: unset!important;
        }
    `);
    if (setting.压缩楼层){
        addStyle(`
            /*楼层压缩*/
            div[style*="min-height:280px"],div[style*="min-height: 280px"] {
                min-height: auto!important;
            }
            .readidms {
                height: auto;
            }
            /*缩短头像高度*/
            .readidmstop {
                height: auto;
                line-height: initial;
            }
        `);
    }
    if (setting.头像屏蔽){
        addStyle(`
            /*头像屏蔽*/
            .readidmstop {
                display: none;
            }
        `)
    }
    if (setting.隐藏背景更改图片){
        addStyle(`
            /*背景修改图片隐藏*/
            a.rightbox2 {
                display: none;
            }
        `);
    }
    if (setting.不加边框){
        addStyle(`
            .indexlbtc a {
                display: unset!important;
                box-shadow: unset;
            }
            .rightboxa {
                border: initial!important;
            }
        `);
    }
    if (setting.隐藏顶栏图片){
        addStyle(`
            div[style*="text-align:center;height:182px;"] {
                display: none;
            }
        `)
    }
    if (setting.去除奇怪的底色以及奇怪的样式){
        addStyle(`
            /*边框重复*/
            input.k_inpu.k_blk.k_ansma[name*="pwuser"], input.k_butt.k_blk.k_ansma[name*="submit"] {
                border-top-style: none;
            }
            /*底色去除*/
            .k_ale {
                background-color: transparent;
            }
            /*边框去除*/
            span.k_butt.k_blk.k_anbig.k_butt_green {
                border: unset;
            }
            /*重新染色*/
            .k_lh40 {
                background-color: #8899FF;
                padding: 5px;
            }
            /*调整顶栏阴影*/
            .drow[style*="box-shadow:1px 1px 2px 2px"] {
            box-shadow: 0px 2px 4px 0px #999999!important;
            }
            /*分割线取消*/
            .line {
                display: none;
            }
            /*多余的空取消*/
            table[height*="60"] {
                height: 0;
            }
            /*中间栏下移*/
            .dcol[style*="width:620px;"] {
                margin-top: 6px;
            }
        `);
    }
    /**
     * 添加浏览器执行事件
     * @param func 无参匿名函数
     */
    function addLoadEvent(func) {
        let oldOnload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                try {
                    oldOnload();
                } catch (e) {
                    console.log(e);
                } finally {
                    func();
                }
            }
        }
    }

    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
})();