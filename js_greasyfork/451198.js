// ==UserScript==
// @name         用户成分指示器（修改自原神玩家指示器）
// @namespace    CoolBreeze.Ingredient.Indicator
// @version      0.1.3
// @description  B站视频评论区自动标注动态里有转发原神、王者荣耀、明日方舟、肖战抽奖的用户，可自行修改。原脚本作者xulaupuz
// @author       CoolBreeze
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @connect bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/451198/%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E4%BF%AE%E6%94%B9%E8%87%AA%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451198/%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E4%BF%AE%E6%94%B9%E8%87%AA%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEYWORDS = ['原神', '王者荣耀', '明日方舟', '肖战'];//要检测的关键词
  const CONTEMPT = ['原批', '农批', '粥批', '虾爬子'];//对这类有关键词用户的蔑称
  //上面两行可以根据情况自行增加删除。

  if (KEYWORDS.length != CONTEMPT.length) {
    console.error('keywords与contempt的长度不一致！');//要保证关键词与蔑称都有对应，长度不一样就报错
    return;
  }

  const CheckKeywords = setInterval(() => {
    let isOldVersion = false;

    //检测是否为旧版
    if ((document.getElementsByClassName('item goback')).length == 0) {
      isOldVersion = true;
    }

    //枚举评论区的回复
    let commentlist = document.getElementsByClassName('user' + (isOldVersion ? '' : '-name'));

    //如果评论区有回复则执行代码
    if (commentlist.length > 0) {
      //清除上一次的定时器
      clearInterval(CheckKeywords);
      commentlist.forEach(commentUserName => {
        let pid = isOldVersion ? commentUserName.children[0].href.replace(/[^\d]/g, "") : commentUserName.dataset.userId;
        let blogurl = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=${pid}`
        GM_xmlhttpRequest({
          method: "get",
          url: blogurl,
          data: '',
          headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
          },
          onload: function (res) {
            if (res.status === 200) {
              let tag = [];
              for (const item of JSON.parse(res.response).data.items) {
                try {
                  let richTextNodes = item.orig.modules.module_dynamic.desc.rich_text_nodes;//获取动态来源的文本
                  richTextNodes.forEach(node => {//遍历动态文本节点
                    let i = 0;
                    KEYWORDS.forEach(keyword => {//遍历关键词
                      let hasKeyword = !tag.includes(CONTEMPT[i]) && node.orig_text.includes(keyword); //是否检测到了关键词
                      let hasForward = node.orig_text.includes('抽奖') || node.orig_text.includes('转发');//是否检测到了抽奖转发
                      //如果想判断条件更加宽泛，那就去掉hasForward
                      if (hasKeyword && hasForward) {
                        tag.push(CONTEMPT[i]);//如果tag里面还没有并且检测到了关键词就加进去
                      }
                      ++i;
                    });
                  });
                }
                catch (err) {
                  continue;//脱了裤子放屁。。但是空一行不好看我就写上了
                }
              }
              if (tag.length > 0) {
                let userNameElement = document.createElement("span");
                userNameElement.innerHTML = `<span style='background-color:#F03;padding:3px;border-radius:5px;color:white;font-weight:bold'>警告：${tag}</span>`;
                commentUserName.appendChild(userNameElement);
              }
            }
          },
        });
      });
    }
  }, 2000)
})();