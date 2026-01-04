// ==UserScript==
// @name         美团评论过滤1
// @namespace    https://windliang.wang/
// @version      2.2
// @description  过滤美团学城、话题评论区中的1
// @author       windliang
// @match        https://123.sankuai.com/huati/*
// @match        https://km.sankuai.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424169/%E7%BE%8E%E5%9B%A2%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A41.user.js
// @updateURL https://update.greasyfork.org/scripts/424169/%E7%BE%8E%E5%9B%A2%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A41.meta.js
// ==/UserScript==

(function () {
    const commentPattKey = "commentPatt";
    const commentPattSetting = GM_getValue(commentPattKey);
    let commentPatt = />\s*(1+|收到|已读)\s*<\/p>/;
    if (commentPattSetting) {
        const setting = [...commentPattSetting];
        if (commentPattSetting.indexOf("1") !== -1) {
            setting.push("1+");
        }
        commentPatt = new RegExp(`>\\s*(${setting.join("|")})\\s*<\\/p>`);
    }
    const titlePattKey = "titlePatt";
    const titlePattSetting = GM_getValue(titlePattKey);
    const titlePatt =
        titlePattSetting && titlePattSetting.length && titlePattSetting[0]
            ? new RegExp(`${titlePattSetting.join("|")}`)
            : null;
    console.log(commentPatt, commentPattSetting);
    console.log(titlePatt, titlePattSetting);
    const getNewResponse = {
        "km.sankuai.com": async function (response) {
            const apiUrl = /.*\/api\/comment\/\d+.*/;
            if (apiUrl.test(response.url)) {
                const responseClone = response.clone();
                let res = await responseClone.json();
                if (!res.data.commentModels) {
                    return response;
                }
                res.data.commentModels = res.data.commentModels.filter(
                    (item) => {
                        if (item.subComments) {
                            item.subComments = item.subComments.filter(
                                (comment) =>
                                    !commentPatt.test(comment.commentContent)
                            );
                            item.subComments = item.subComments;
                        }
                        if (
                            commentPatt.test(item.commentContent) &&
                            (!item.subComments || item.subComments.length === 0)
                        ) {
                            return false;
                        }
                        return true;
                    }
                );
                res = JSON.stringify(res);
                const responseNew = new Response(res, response);
                return responseNew;
            } else {
                return response;
            }
        },
        "123.sankuai.com": async function (response) {
            if (response.url.indexOf("/huati/api/answer/list") !== -1) {
                const responseClone = response.clone();
                let res = await responseClone.json();
                res.data.pageList = res.data.pageList.filter((item) => {
                    if (item.commentList) {
                        item.commentList = item.commentList.filter(
                            (comment) => !commentPatt.test(comment.content)
                        );
                    }
                    if (
                        commentPatt.test(item.body) &&
                        (!item.commentList || item.commentList.length === 0)
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                });
                if (
                    res.data.pageList.length === 0 &&
                    res.data.page.pageNo < res.data.page.totalPageCount
                ) {
                    res.data.pageList.push({
                        id: 256280,
                        videos: {},
                        questionId: 37829,
                        body: "<p>10条连续的1会自动生成当前评论，不然就不能点击加载更多了，发现此插件有问题可以大象戳我</p>",
                        likeCount: 0,
                        commentCount: 0,
                        creator: {
                            id: "n9NEVW3o",
                            mis: "wangliang39",
                            name: "windliang",
                            email: null,
                            org: "0000",
                            orgId: "0000",
                            dxUid: 1807766347,
                            avatar: "https://s3plus-img.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec/profile12/f9e5ddaa-7f06-4f35-862d-7b289a5beaa3_200_200",
                            phone: null,
                            role: 1,
                            dimission: true,
                            tenantId: "1",
                            zoneIds: null,
                        },
                        like: false,
                        questionZoneId: 4,
                        anonymous: 0,
                        zoneAnonymous: 0,
                        createTime: 1617029693000,
                        updateTime: 1617029693000,
                        commentList: [],
                        status: 0,
                        questionWebUrl:
                            "http://123.sankuai.com/huati/question/37829",
                    });
                }
                res = JSON.stringify(res);
                const responseNew = new Response(res, response);
                return responseNew;
                // 评论的回复
            } else if (response.url.indexOf("/huati/api/comment/list") !== -1) {
                const responseClone = response.clone();
                let res = await responseClone.json();
                res.data.pageList = res.data.pageList.filter(
                    (item) => !commentPatt.test(item.content)
                );
                res = JSON.stringify(res);
                const responseNew = new Response(res, response);
                return responseNew;
            } else {
                return response;
            }
        },
    };
    const createDialog = () => {
        let dom = document.createElement("div");
        dom.innerHTML = `
   <div class="wrap" id="mutli-dialog" style="z-index:9999">
  <div class="dialog">
  <div class="header">
    <div class="title">美团学城、话题评论区过滤自定义关键词</div>
    <svg id="close-icon" class="close" width="18" height="18" viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.01 8.996l7.922-7.922c.086-.086.085-.21.008-.289l-.73-.73c-.075-.074-.208-.075-.29.007L9 7.984 1.077.062C.995-.02.863-.019.788.055l-.73.73c-.078.078-.079.203.007.29l7.922 7.92-7.922 7.922c-.086.086-.085.212-.007.29l.73.73c.075.074.207.074.29-.008l7.92-7.921 7.922 7.921c.082.082.215.082.29.008l.73-.73c.077-.078.078-.204-.008-.29l-7.921-7.921z">
      </path>
    </svg>
  </div>
  <div class=content>
    <div class="names">
      <div class="label">评论区关键词设置，等于下边的任意关键词的评论将会被屏蔽（输入评论区关键词，以逗号分隔）</div>
      <div class="input">
        <textarea id="input-names" placeholder="输入评论区关键词，以逗号分隔" rows="6" cols="40" style="width: 99%; resize:none;"
          ></textarea>
      </div>
    </div>
    <div class="names">
      <div class="label">话题标题关键词设置，标题包含下边的任意关键词的帖子将会被屏蔽（输入话题标题关键词，以逗号分隔）</div>
      <div class="input">
        <textarea id="input-title" placeholder="输入话题标题关键词，以逗号分隔" rows="6" cols="40" style="width: 99%; resize:none;"
          ></textarea>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="confirm" id="confirm-button">保存</div>
  </div>
  </div>
  </div>
  `;

        const style = document.createElement("style");

        const heads = document.getElementsByTagName("head");

        style.setAttribute("type", "text/css");

        style.innerHTML = `
  .wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding-top: 100px;
  font-family: "mp-quote", -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  }

  .dialog {
  width: 600px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 4px;
  padding: 30px;
  }

  .header {
  display: flex;
  align-items: center;
  }

  .title {
  color: #353535;
  font-size: 14px;
  line-height: 1.6;
  }

  .close {
  margin-left: auto;
  cursor: pointer;
  }

  .footer {
  display: flex;
  margin-top: 20px;
  }

  .confirm {
  margin-left: auto;
  cursor: pointer;
  font-weight: 400;
  line-height: 36px;
  height: 36px;
  font-size: 14px;
  letter-spacing: 0;
  border-radius: 4px;
  background-color: #07c160;
  color: #fff;
  min-width: 96px;
  text-align: center;
  }

  .names {
  margin-top: 20px;
  }

  .label {
  color: #353535;
  }

  .input {
  margin-top: 5px;
  }

  .permissions {
  margin-top: 20px;
  }

  .item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  color: #1a1b1c;
  font-size: 15px;
  align-items: center;
  }

  .permissions-name {}

  .permissions-switch {
  margin-left: auto;
  }

  label {
  display: block;
  vertical-align: middle;
  }

  label,
  input,
  select {
  vertical-align: middle;
  }

  .mui-switch {
  width: 52px;
  height: 31px;
  position: relative;
  border: 1px solid #dfdfdf;
  background-color: #fdfdfd;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  border-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;
  }

  .mui-switch:before {
  content: '';
  width: 29px;
  height: 29px;
  position: absolute;
  top: 0px;
  left: 0;
  border-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .mui-switch:checked {
  border-color: #64bd63;
  box-shadow: #64bd63 0 0 0 16px inset;
  background-color: #64bd63;
  }

  .mui-switch:checked:before {
  left: 21px;
  }

  .mui-switch.mui-switch-animbg {
  transition: background-color ease 0.4s;
  }

  .mui-switch.mui-switch-animbg:before {
  transition: left 0.3s;
  }

  .mui-switch.mui-switch-animbg:checked {
  box-shadow: #dfdfdf 0 0 0 0 inset;
  background-color: #64bd63;
  transition: border-color 0.4s, background-color ease 0.4s;
  }

  .mui-switch.mui-switch-animbg:checked:before {
  transition: left 0.3s;
  }

  .mui-switch.mui-switch-anim {
  transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
  }

  .mui-switch.mui-switch-anim:before {
  transition: left 0.3s;
  }

  .mui-switch.mui-switch-anim:checked {
  box-shadow: #64bd63 0 0 0 16px inset;
  background-color: #64bd63;
  transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
  }

  .mui-switch.mui-switch-anim:checked:before {
  transition: left 0.3s;
  }
  `;

        heads[0].append(style);
        document.getElementsByTagName("body")[0].append(dom);
    };
    let hasCreatDialog = false;
    const initData = () => {
        const inputNames = document.getElementById("input-names");
        console.log("ylog:409-fada3d-commentPattSetting", commentPattSetting);
        if (commentPattSetting) {
            inputNames.value = commentPattSetting.join(",");
        } else {
            inputNames.value = "1,收到,已读";
        }

        const inputTitle = document.getElementById("input-title");
        if (titlePattSetting) {
            inputTitle.value = titlePattSetting.join(",");
        }
    };
    const dialogOps = () => {
        if (!hasCreatDialog) {
            createDialog();
            hasCreatDialog = true;
        } else {
            const muliDialog = document.getElementById("mutli-dialog");
            muliDialog.hidden = false;
            initData();
            return;
        }
        const muliDialog = document.getElementById("mutli-dialog");
        const closeDialog = () => {
            muliDialog.hidden = true;
        };
        const closeButton = document.getElementById("close-icon");
        closeButton.addEventListener("click", closeDialog, false);

        const confirmButton = document.getElementById("confirm-button");

        const confirmDialogClick = async () => {
            const inputNames = document.getElementById("input-names");
            const names = inputNames.value
                .split(/[，,]/g)
                .map((item) => item.trim());
            console.log(names);
            GM_setValue(commentPattKey, names);
            const inputTitle = document.getElementById("input-title");
            const title = inputTitle.value
                .split(/[，,]/g)
                .map((item) => item.trim());
            console.log(title);
            GM_setValue(titlePattKey, title);
            muliDialog.hidden = true;
            location.reload();
        };

        confirmButton.addEventListener("click", confirmDialogClick, false);

        initData();
    };
    GM_registerMenuCommand("美团评论标题过滤设置", dialogOps);
    const originFetch = fetch;
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
            const domain = response.url.match(reg)[2];
            if (getNewResponse[domain]) {
                return getNewResponse[domain](response);
            } else {
                return response;
            }
        });
    };
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            const urls = [
                "/questions/actions/latest-web",
                "/huati/api/v2/questions/actions/recommend-web",
                "/huati/api/v2/questions/actions/latest",
            ];

            if (urls.some((item) => arguments[1].indexOf(item) !== -1)) {
                console.log("拦截url：", arguments[1]);
                const xhr = this;
                const getter = Object.getOwnPropertyDescriptor(
                    XMLHttpRequest.prototype,
                    "response"
                ).get;
                Object.defineProperty(xhr, "response", {
                    get: () => {
                        let result = getter.call(xhr);
                        try {
                            const res = JSON.parse(result);
                            const before = res.data.pageList.length;
                            res.data.pageList = res.data.pageList.filter(
                                (item) =>
                                    !titlePatt || !titlePatt.test(item.title)
                            );
                            return JSON.stringify(res);
                        } catch (e) {
                            return result;
                        }
                    },
                });
                Object.defineProperty(xhr, "responseText", {
                    get: () => {
                        let result = getter.call(xhr);
                        try {
                            const res = JSON.parse(result);
                            const before = res.data.pageList.length;
                            res.data.pageList = res.data.pageList.filter(
                                (item) =>
                                    !titlePatt || !titlePatt.test(item.title)
                            );
                            console.log(
                                "过滤",
                                before - res.data.pageList.length,
                                "条数据"
                            );
                            return JSON.stringify(res);
                        } catch (e) {
                            return result;
                        }
                    },
                });
            }

            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();
