// ==UserScript==
// @name         小飞侠工具箱
// @namespace    https://weibo.com/u/1620231873
// @version      0.1.1
// @license      gpl-3.0
// @description  肖战顺顺利利，适用于微博等
// @author       小明DAYTOY
// @match        https://weibo.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/471705/%E5%B0%8F%E9%A3%9E%E4%BE%A0%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/471705/%E5%B0%8F%E9%A3%9E%E4%BE%A0%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    GM_addStyle(`
    .lite-menu-box {
        position: fixed;
        overflow: hidden;
        top: 3.8rem;
        right: .35rem;
        z-index: 9999;
    }
    .lite-menu {
        height: 50px;
        width: 50px;
        background-image: url('data:image/png;base64,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')
    }
    .lite-btn {
        font-size: .6875rem;
        height: 1.8rem;
        line-height: 1.8rem;
        text-align: center;
        background: white;
        border: 1px solid #c8c8c8;
    }
    .lite-dialog {
        position: fixed;
        width: 300px;
        height: 400px;
        top: 50%;
        left: 50%;
        margin-top: -200px;
        margin-left: -150px;
        background: white;
        border: 1px solid #c8c8c8;
        z-index: 996;
        text-align:center;
    }
    .lite-dialog-top {
        margin: 4px;
        margin-top: 5%;
    }
    .lite-dialog-textarea {
        width: 88%;
        height: 280px;
    }
    .lite-dialog-input {
        width: 88%;
    }
    .lite-dialog-btn {
        margin: 4px;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .highlight-liked {
        background-color: #99cf99;
    }
    .highlight-like {
        background-color: #cf9999;
    }
    .s-color-aqua {
        background-color: aqua;
    }
    .W_layer {
        color: #333;
        text-decoration: none;
        position: absolute;
        z-index: 9999;
      }
      .W_layer .content {
          position: relative;
          background: #fff;
          border-radius: 3px;
          border-top: 2px solid #fa7f40;
      }
      .W_layer .W_layer_title {
          border-bottom: 1px solid #f2f2f5;
          line-height: 38px;
          font-size: 14px;
          font-weight: 700;
          padding: 0 0 0 16px;
          vertical-align: middle;
      }
      .W_layer .WB_emotion {
          width: 512px;
          padding: 16px 0 0;
      }
      .W_layer .WB_emotion .emotion_list {
          margin: 0 -4px 0 0;
          padding: 0 0 10px 16px;
      }
      .WB_emotion .emotion_list {
          padding: 0 0 8px 19px;
          overflow: hidden;
      }
      .clearfix {
          display: block;
      }
      .W_layer .WB_emotion .emotion_list li {
          margin: 0 20px 10px 0;
      }
      .WB_emotion .emotion_list li {
          float: left;
          margin: 0 8px 8px 0;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
      }
      .WB_emotion .emotion_list li a {
          display: block;
          width: 100%;
          height: 100%;
      }
      .WB_emotion .emotion_list li img {
          width: 30px;
          height: 30px;
      }
      .W_layer .S_line1, .W_layer .W_btn_prev, .W_layer .W_btn_next, .W_layer .W_btn_b {
          border-color: #d9d9d9;
      }

      .S_line1, .W_btn_prev, .W_btn_next, .W_btn_b {
          border-color: #d9d9d9;
      }
      .WB_cardpage {
          border-top-style: solid;
          border-top-width: 1px;
      }
      .WB_cardpage .W_pages {
          padding: 4px 0;
      }

      .W_pages {
          text-align: center;
          letter-spacing: -0.31em;
          text-rendering: optimizespeed;
          white-space: nowrap;
      }
      .W_layer .S_line1, .W_layer .W_btn_prev, .W_layer .W_btn_next, .W_layer .W_btn_b {
          border-color: #d9d9d9;
      }

      .W_layer, .W_layer legend, .W_layer .W_input:focus, .W_layer .S_txt1, .W_layer .W_btn_b, .W_layer .SW_fun .S_func1 {
          color: #333;
          text-decoration: none;
      }
      .W_pages .prev {
          border-right-width: 1px;
          border-right-style: solid;
          margin-right: 20px;
          margin-right: 14px;
      }
      .W_pages .prev, .W_pages .next {
          width: 100px;
          height: 26px;
          line-height: 26px;
          padding: 0;
          margin: 0;
      }
      .W_pages .page {
          letter-spacing: normal;
          word-spacing: normal;
          text-rendering: auto;
          padding: 0 8px;
          margin: 0 5px 0;
          line-height: 20px;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
      }
      .W_layer .W_layer_close .ficon_close {
        position: absolute;
        z-index: 2;
        right: 12px;
        top: 9px;
        font-size: 18px;
    }
    `);
    const html = `<div id="likeDialog_1005" >
    <div node-type="outer" style="position: fixed; top: 0px; left: 0px; width: ${window.innerWidth}px; height: ${window.innerHeight}px; background: rgb(0, 0, 0); opacity: 0.3; z-index: 999;"></div>
    <div class="W_layer " style="top: 300px; left: 300px;"><div tabindex="0"></div>
      <div class="content" node-type="autoHeight">
        <div node-type="title" id="likeDialogTitle_1005" class="W_layer_title" style="cursor: move;">
          <input type="number" id="likeDialogMid_1005" placeholder="mid" value="4924869512790322"><br/>
          <input type="number" id="likeDialogCid_1005" placeholder="cid" value="4924870892978426"><br/>
          <button type="button" id="likeDialogBtn_1005">提交</button>
        </div>
        <div class="W_layer_close" id="likeDialogClose_1005"><a node-type="close" href="javascript:void(0);" class="W_ficon ficon_close S_ficon">X</a></div>
        <div node-type="inner" id="likeDialogContent_1005"></div>
      </div>
    </div>
  </div>
  `;
    const visi = function (id) {
        var x = document.getElementById(id);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    const createDivBtn = function (name, id, listener) {
        const btn = document.createElement("div");
        btn.innerHTML = name;
        btn.id = id;
        btn.classList.add("cursor-pointer");
        btn.classList.add("lite-btn");
        if (listener) btn.addEventListener('click', listener);
        btn.style.display = "block";
        return btn;
    }

    const ajLikeObjectBig = function(page, mid, cid) {
        console.log('\nhttp request params:', page, mid, cid);
        document.getElementById("log_btn").innerHTML = "loading";
        const url = `https://weibo.com/aj/like/object/big?ajwvr=6&page=${page}&object_id=${cid}&object_type=comment&commentmid=${mid}&_t=0&__rnd=${Date.now()}`;
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": navigator.userAgent
            },
            onload: function(response) {
                /*
                    "html": "",
                    "page": {
                        "totalpage": 3,
                        "pagenum": 1,
                        "pageRecNum": 30
                    },
                    "like_counts": 64
                 */
                console.log('http response status:', response.status);
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.code == '100000') {
                        document.getElementById('likeDialogTitle_1005').innerHTML = `${res.data.like_counts}人赞过此评论 (${res.data.page.pagenum}/${res.data.page.totalpage})`;
                        document.getElementById('likeDialogContent_1005').innerHTML = res.data.html;
                        setTimeout(() => {
                            const divs = document.querySelectorAll('#likeDialogContent_1005 a[action-type="nextPageOfLike"]');
                            // console.log(divs.length);
                            divs.forEach(e => {
                                const actiondata = e.getAttribute('action-data');
                                const matchs = actiondata.match(/page=\d+/);
                                if (matchs) {
                                    e.onclick = function() { ajLikeObjectBig(matchs[0].replace('page=',''), mid, cid) };
                                }
                            });
                            let users = '\n';
                            document.querySelectorAll('#likeDialogContent_1005 ul.emotion_list li a').forEach(e => {
                                const uid = e.href.replace("https://weibo.com/u/","").replace("https://weibo.com/","");
                                const name = e.querySelector('img').getAttribute('title')
                                users += `${name}(${uid})\n`;
                            });
                            console.log(users);
                            document.getElementById("log_btn").innerHTML = "completed";
                        }, 500);
                        //.replace('href="javascript:void(0);"',`href="javascript:void(0);" onclick="(function(event){alert(event.getAttribute('action-data'))})(this)"`);
                        /*
                    <a href="javascript:void(0);" class="page next S_txt1 S_line1" action-type="nextPageOfLike" action-data="page=2&amp;object_id=4924870892978426&amp;object_type=comment">下一页</a>
                    */

                    } else {
                        alert('code', res.code, res.msg);
                    }
                } catch (error) {
                    alert('error 001');
                    console.error(url);
                    console.error('http status', response.status);
                    console.error(response.responseText);
                }
            },
            onerror: function(response) {
                alert('error 002');
                console.error(url);
                console.error('http status', response.status);
                console.error(response.responseText);
            }
          });
    }

    const desktopCommentLikeFunction = function () {
        const hd = document.createElement("div");
        hd.classList.add("lite-menu");
        hd.classList.add("cursor-pointer");
        hd.addEventListener("click", function () {
            document.getElementById("div-page-group").style.display = "none";
        });
        const pageGroup = document.createElement("div");
        pageGroup.id = "div-page-group";
        pageGroup.appendChild(createDivBtn("💉注入", "click_inject_comment_btn", function() {
            const dialog = document.createElement("div");
            dialog.innerHTML = html;
            document.body.appendChild(dialog);
            document.getElementById('likeDialogClose_1005').onclick = function() { visi('likeDialog_1005'); };
            document.getElementById('likeDialogBtn_1005').onclick = function() {
                var mid = document.getElementById('likeDialogMid_1005');
                var cid = document.getElementById('likeDialogCid_1005');
                if (mid && cid) {
                    ajLikeObjectBig(1, mid.value, cid.value);
                } else {
                    alert('mid or cid not found ');
                }
            };
            document.getElementById("log_btn").innerHTML = "";
        }));
        pageGroup.appendChild(createDivBtn("", "log_btn", null));

        const box = document.createElement("div");
        box.id = "div-menu-box";
        box.classList.add("lite-menu-box");
        box.appendChild(hd);
        box.appendChild(pageGroup);
        document.querySelector("body").appendChild(box);
        const outer = document.querySelector("div[node-type='outer']");
        if(outer && outer.style) outer.style.zIndex = 999;
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach((node) => {
                    if(node.style && node.getAttribute("node-type") == "outer") node.style.zIndex = 999;
                })
            })
        }).observe(document.querySelector("body"), { childList: true });
    }

    const injectDom = function () {
        console.log("menu injectDom");
        if (window.location.href.includes("weibo.com")) {
            // && document.querySelector(".W_layer[id^='likeDialog_']")
            setTimeout(desktopCommentLikeFunction, 1000);
        } else {
            setTimeout(injectDom, 1000);
        }
    }
    injectDom();

    window.addEventListener("load", () => {
        //firefox does not always work.
        console.log("menu load");
    });
})();
