// ==UserScript==
// @name         图书馆评论区
// @namespace    https://shequ.codemao.cn/user/438403
// @version      1.1.10
// @description  图书馆评论区接入
// @author       小鱼yuzifu
// @match        *://shequ.codemao.cn/*
// @icon         https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3
// @grant        GM_xmlhttpRequest
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/sweetalert/2.1.2/sweetalert.min.js
// @license      616 SB License
// ==/UserScript==

(function () {
  "use strict";
  function timestampToTime(timestamp) {
    timestamp = timestamp ? timestamp : null;
    let date = new Date(timestamp * 1000);
    let Y = date.getFullYear() + "-";
    let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
    let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    let m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }
  setInterval(() => {
    if (document.querySelector("div.index__novel-chapter___Avuy1") && !document.querySelector("#comment_container")) {
      $("div.index__novel-chapter___Avuy1").after(`
        <div id="comment_container">
          <div id="header">
            <i class="index__circle-label___1EBso" data-reactid=".0.0.3.3.0.1.1.0.2.0.2.0.0"></i>
            <p style="font-size:18px;"><span></span> 评论</p>
          </div>
        </div>
        <div id="comment_sender">
          <textarea id="content"></textarea>
          <button id="post">发表评论</button>
        </div>
        <style>
        @font-face{
          font-family: 'icomoon2';
          src: url('https://cdn-community.codemao.cn/community_frontend/fonts/icomoon.e025c6491ae7ebcfe7a1b43fc20cef0e.ttf');
        }
        #comment_container #header {
          display: flex;
          align-items: center;
          border-bottom: 1px dashed #e6e6e6;
          padding: 30px 0 10px;
        }
        #comment_container div[comment-id] .info img {
          width: 50px;
          height: 50px;
          border-radius: 100%;
          margin: 0 8px 0 0;
        }
        #comment_container div[comment-id] .info {
          margin: 0 0 15px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #comment_container div[comment-id] {
          padding: 25px 13px;
          border-bottom: 1px dashed #e6e6e6;
        }
        #page {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #page div {
          border: 1px solid #e6e6e6;
          height: 40px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          margin: 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        div[disable] {
          opacity: 0.5;
        }
        #comment_container .dock {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
        .like {
          cursor: pointer;
        }
        .icon-like_phone {
          font-family: icomoon2!important;
        }
        .icon-like_phone:before {
          content: "\\E945";
        }
        .like[active] {
          color: var(--main-color);
        }
        #comment_sender {
          margin: 30px 0 0 0;
        }
        #comment_sender textarea {
          width: 100%;
          border: 1px solid #e6e6e6;
          resize: none;
          min-height: 100px;
          border-radius: 4px;
          padding: 10px;
          overflow: hidden;
        }
        #comment_sender #post {
          float: right;
          padding: 10px 15px;
          background: var(--second-color);
          color: #e6e6e6;
          border-radius: 4px;
          margin: 10px 0;
          cursor: pointer;
        }
        .del {
          font-size: 12px;
          cursor: pointer;
        }
        </style>
      `);
      var textarea = document.querySelector("#content");

      textarea.addEventListener("input", function () {
        this.style.height = "102px";
        this.style.height = this.scrollHeight + "px";
      });

      $("#post").on("click", function () {
        console.log(document.querySelector("#content").value);
        $.ajax({
          type: "POST",
          url: `https://api.codemao.cn/api/fanfic/comments/${fanficID}`,
          contentType: "application/json;charset=UTF-8",
          xhrFields: {
            withCredentials: true,
          },
          data: JSON.stringify({
            content: html2Escape(document.querySelector("#content").value),
          }),
          dataType: "json",
          success: function (res) {
            if (document.querySelector("#num")) {
              upload_comment(parseInt(document.querySelector("#num").innerHTML) - 1);
            } else {
              upload_comment(0);
            }
            document.querySelector("#content").value = "";
          },
          error: function (res) {
            console.log(res.responseJSON);
          },
        });
      });

      function html2Escape(sHtml) {
        return sHtml.replace(/[<>&"]/g, function (c) {
          return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
        });
      }

      let fanficID = window.location.href.split("/").pop();
      let total_num = null;
      let total_page = null;

      function upload_comment(page) {
        $.ajax({
          type: "GET",
          url: `https://api.codemao.cn/api/fanfic/comments/list/${fanficID}?page=${page}&limit=10`,
          contentType: "application/json;charset=UTF-8",
          xhrFields: {
            withCredentials: true,
          },
          success: function (res) {
            console.log(res);
            $("#comment_container div[comment-id]").remove();
            $("#page").remove();
            let a = res.data.commentList;
            total_num = res.data["total_num"];
            total_page = res.data["total_page"];
            $("#comment_container #header p span").text(total_num);
            if (total_page > 1) {
              $("#comment_container").after(`
                <div id="page">
                  <div id="up" ${page + 1 == 1 ? "disable" : ""}>上一页</div>
                  <div id="num">${page + 1}</div>
                  <div id="down" ${page + 1 == total_page ? "disable" : ""}>下一页</div>
                </div>
                `);
            }
            $("#up:not(#up[disable])").on("click", function () {
              upload_comment(parseInt(document.querySelector("#num").innerHTML) - 2);
            });
            $("#down:not(#down[disable])").on("click", function () {
              upload_comment(parseInt(document.querySelector("#num").innerHTML));
            });
            $("#num").on("click", function () {
              swal(`请输入你要跳转到的页码（最多${total_page}页）`, {
                content: "input",
              }).then((value) => {
                if (value && parseInt(value) && parseInt(value) >= 1 && parseInt(value) <= total_page) {
                  upload_comment(parseInt(value - 1));
                }
              });
            });

            for (let i of a) {
              let b = document.createElement("div");
              b.innerHTML = i.content;
              for (let q of b.querySelectorAll("iframe,embed")) {
                q.parentNode.removeChild(q);
              }
              $("#comment_container").append(`
                  <div comment-id="${i.id}">
                    <div class="info">
                      <div>
                        <img src="${i["user_avatar"]}" />
                        <a target="_blank" href="https://shequ.codemao.cn/user/${i["user_id"]}"><span>${i.nickname}</span></a>
                      </div>
                      ${localStorage.getItem("user_id") == i["user_id"] ? "<div class='del'>删除</div>" : ""}
                    </div>
                    <div style="margin: 10px 0;">${b.innerHTML}</div>
                    <div class="dock">
                      <span style="opacity: 0.7;">${timestampToTime(i.create_time)}</span>
                      <div class="like" ${i.praised ? " active" : ""}>
                        <i class="icon-like_phone"></i>
                        <span>${i.praise_times}</span>
                      </div>
                    </div>
                  </div>
              `);
            }
            $(".like").on("click", function () {
              console.log(this.parentNode.parentNode.getAttribute("comment-id"), this.hasAttribute("active"));
              $.ajax({
                type: this.hasAttribute("active") ? "DELETE" : "POST",
                url: `https://api.codemao.cn/api/fanfic/comments/praise/${this.parentNode.parentNode.getAttribute("comment-id")}`,
                contentType: "application/json;charset=UTF-8",
                xhrFields: {
                  withCredentials: true,
                },
                success: function (res) {
                  if (document.querySelector("#num")) {
                    upload_comment(parseInt(document.querySelector("#num").innerHTML) - 1);
                  } else {
                    upload_comment(0);
                  }
                },
                error: function (res) {
                  console.log(res.responseJSON);
                },
              });
            });
            $(".del").on("click", function () {
              console.log(this.parentNode.parentNode.getAttribute("comment-id"));
              $.ajax({
                type: "DELETE",
                url: `https://api.codemao.cn/api/fanfic/comments/${this.parentNode.parentNode.getAttribute("comment-id")}`,
                contentType: "application/json;charset=UTF-8",
                xhrFields: {
                  withCredentials: true,
                },
                success: function (res) {
                  if (document.querySelector("#num")) {
                    upload_comment(parseInt(document.querySelector("#num").innerHTML) - 1);
                  } else {
                    upload_comment(0);
                  }
                },
                error: function (res) {
                  console.log(res.responseJSON);
                },
              });
            });
          },
          error: function (res) {
            console.log(res.responseJSON);
          },
        });
      }
      upload_comment(0);
    }
  }, 100);
})();
