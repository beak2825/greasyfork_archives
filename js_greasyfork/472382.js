// ==UserScript==
// @name         diamond-community
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  钻石社区薅羊毛
// @author       You
// @match        https://in.iflytek.com/iflyteksns/forum/*
// @match        https://in.iflytek.com/*
// @icon         data:image/png;base64,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
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472382/diamond-community.user.js
// @updateURL https://update.greasyfork.org/scripts/472382/diamond-community.meta.js
// ==/UserScript==

//聚嗨吧链接
const highBarUrl = 'https://in.iflytek.com/iflyteksns/forum/web/special/3';
//点赞接口
const addDiggsUrl = 'https://in.iflytek.com/iflyteksns/forum/web/diggs/add';
//签到接口
const signUpUrl = 'https://in.iflytek.com/iflyteksns/forum/web/sign/save';
//提交评论接口
const submitCommentsUrl = 'https://in.iflytek.com/iflyteksns/forum/web/comment/submit';
//荣誉殿堂专区
const honorZoneUrl = 'https://in.iflytek.com/iflyteksns/forum/web/special/646';
//留言获取token接口
const commentTokenUrl = 'https://in.iflytek.com/iflyteksns/forum/web/token/getToken';
//获取用户信息接口
const getUserInfoUrl = 'https://in.iflytek.com/iflyteksns/forum/web/token/getBaseUserInfo';
//发帖接口
const postUrl = 'https://in.iflytek.com/iflyteksns/forum/web/snsDoc/save';
//灌水专用贴id
const waterId  = '128862';

//注册菜单
let menuList = [];
const initMenuData = {
     'removeIframe': { 'text': '关闭iframe', 'flag': true },
     'getAward': { 'text': '积分到手', 'flag': true },
     'dailyNews': { 'text': '每日新闻发帖', 'flag': true }
};
function syncSetting() {
     let settings = GM_getValue('settings');
     if (!settings) {
          settings = initMenuData;
          GM_setValue('settings', settings);
     } else {
          const keys = Object.keys(initMenuData);
          for (let i = 0; i < keys.length; i++) {
               if (!Object.keys(settings).includes(keys[i])) {
                    settings[keys[i]] = initMenuData[keys[i]]
               }
          }
          GM_setValue('settings', settings);
     }

     for (let menuId of menuList) {
          GM_unregisterMenuCommand(menuId);
     }
     menuList = [];

     for (const key in settings) {
          const setting = settings[key];
          if (key === 'removeIframe') {
               const menuText = `${setting.flag ? '🟢' : '⚪'}   ${setting.text}`;
               const menuId = GM_registerMenuCommand(menuText, () => {
                    settings[key].flag = !setting.flag;
                    GM_setValue('settings', settings);
                    syncSetting();
                    window.location.reload();
               })
               menuList.push(menuId);
          } else if (key === 'getAward') {
               const menuText = setting.text;
               const menuId = GM_registerMenuCommand(menuText, () => {
                    getAward();
               })
               menuList.push(menuId);
          } else if (key === 'dailyNews') {
               const menuText = setting.text;
               const menuId = GM_registerMenuCommand(menuText, () => {
                    dailyNews();
               })
               menuList.push(menuId);
          }
     }
}



// 内嵌页面改为跳转
function replaceIframeJump() {
     const diamondBtn = document.querySelector('.iflyui-menubox-menu > li:nth-child(5) > a');
     const setting = GM_getValue('settings');
     if (diamondBtn && setting.removeIframe.flag) {
          diamondBtn.setAttribute('href', 'https://in.iflytek.com/iflyteksns/forum/web/index');
     }
}

// 添加查看点赞数按钮
function addGetLikeBtn() {
     GM_addStyle(`.quickReply2{visibility: hidden;opacity: 0; cursor: pointer;width:40px;height:40px;position: fixed;right:50%;margin-right: -650px; bottom:0px;background:#fff url(../images/aft-scroll-top.png) no-repeat center;background-size:18px;border-radius: 4px; z-index: 10;cursor: pointer;box-shadow: 0 2px 20px 0 #DDDDDD; background-image: url("https://in.iflytek.com/iflyteksns/template/1/default/files/images/dianzan.png");}`);
     GM_addStyle(`.distance-body .quickReply2{bottom: 192px;visibility: visible;opacity: 1;}`)
     $('a.quickReply.trans').after(`<a class="quickReply2 trans" href="javascript:;"></a>`);
     $('.quickReply2').bind('click', getLikesTop);
}

//获取某个帖子的点赞数
async function getLikesTop() {
     const iframe = document.getElementById('main_iframe');
     const currentLocation = iframe ? iframe.contentWindow.location : window.location;
     const postUrl = 'https://in.iflytek.com/iflyteksns/forum/web/snsDoc/detail/';
     if (currentLocation.href.startsWith(postUrl)) {
          var index = layer.load(1, {
               shade: [0.2, '#fff'] //0.1透明度的白色背景
          });
          const pathname = currentLocation.pathname;
          const path = pathname.endsWith('/') ? pathname.substring(0, pathname.lastIndexOf('/')) : pathname;
          const postId = path.substring(path.lastIndexOf('/') + 1);
          const total = $('.page .page-info span:first em').text();
          const pageSize = 20;
          const pages = Math.ceil(total / pageSize);
          let results = [];
          for (let i = 1; i <= pages; i++) {
               await sleep(3);
               const page = await doAjax(`${postUrl}${postId}?page=${i}`, '', 'get');
               const replyList = $('.plate-table', page);
               const result = parseHtml(replyList);
               results.push(...result);
          }
          //1.去除楼主（默认第一个）
          results.splice(0, 1);
          results = results.filter(x => x.like);
          //2.点赞数倒序
          results.sort((a, b) => {
               return b.like - a.like;
          });
          //3.只要前50
          results.splice(50);
          for (let i = 0; i < results.length; i++) {
               results[i].top = i + 1;
          }
          let html = `<table style="width: 100%; text-align: center">
                         <tr>
                              <th>排名</th>
                              <th>昵称</th>
                              <th>点赞数</th>
                         </tr>`;
          for (const item of results) {
               html += `<tr>
                              <td>${item.top}</td>
                              <td>${item.name}</td>
                              <td>${item.like}</td>
                         </tr>`;
          }
          html += `</table>`;
          layer.close(index);
          layer.open({
               type: 1,
               skin: 'layui-layer-rim', //加上边框
               area: ['420px', '240px'], //宽高
               resize: true,
               content: html
          });
     }
}

const parseHtml = (list) => {
     let results = [];
     for (let i = 0; i < list.length; i++) {
          const element = list.eq(i);
          let name = element.find('.p1 span').text().trim();
          let like = element.find('em span').text();
          results.push({ "name": name, "like": like });
     }
     return results;
}

//积分到手
async function getAward() {
     const iframe = document.getElementById('main_iframe');
     const currentLocation = iframe ? iframe.contentWindow.location : window.location;
     if (!currentLocation.href.startsWith('https://in.iflytek.com/iflyteksns/forum/web/index')) {
          layer.alert('请返回首页使用');
          return;
     }
     var index = layer.load(1, {
          shade: [0.2, '#fff'] //0.1透明度的白色背景
     });
     //每日签到 1*3
     console.log('开始签到');
     await signUp();
     console.log('签到完成');
     //每天6次点赞 6*1
     await sleep(5);
     console.log('开始点赞')
     await dailyDiggs();
     console.log('点赞完成');
     //每日3次投票 3*1
     //帖子回复 5*4
     // console.log('开始普通帖子评论');
     // await normalReply();
     // console.log('普通帖子评论完成');
     //发帖 4*4
     //专题回复 5*4
     // await sleep(2 * 60 + 1);
     // console.log('开始专题帖子评论');
     // await specialReply();
     // console.log('专题帖子评论完成');

     //v1.2.0 回复整合到一起，优化耗时
     console.log('开始评论');
     await allReply();
     console.log('评论完成');
     layer.close(index);
     layer.msg('积分到手！');
}

/**
 * 签到
 */
async function signUp() {
     await doAjax(signUpUrl, '', 'post');
}

async function dailyDiggs() {
     const userId = await getWebUserId(sessionStorage.getItem("userId"));
     const maxCounts = 6;
     let posts = [];
     let page = 1;
     const enablePost = await queryEnablePost(page, posts, maxCounts, userId);
     await sleep(5);
     await addDiggs(enablePost, userId);
}

async function sleep(time) {
     return new Promise((resolve, reject) => {
          setTimeout(() => {
               resolve()
          }, time * 1000)
     })
}

async function normalReply() {
     await reply('block');
}

async function specialReply() {
     await reply('special');
}

async function reply(specialType) {
     await sleep(5);
     let url = '';
     let formData = new FormData();
     formData.append('sortType', 'publishDate');
     if (specialType === 'block') {
          formData.append('queryContent', '');
     }
     formData.append('page', 1);
     if (specialType === 'block') {
          url = highBarUrl;
     }
     if (specialType === 'special') {
          url = honorZoneUrl;
     }
     const postPage = await doAjaxForm(url, formData);
     //不包含置顶的
     const aTag = $('.crackling-ul.clearfix li .title:not(:has(.span1)) a', postPage);
     for (let j = 0; j < 5; j++) {
          let sleepTime = (j % 3 === 0 && j !== 0) ? 2 * 60 + 1 : 5;
          await sleep(sleepTime);
          const pathname = aTag.eq(j).attr('href');
          const path = pathname.endsWith('/') ? pathname.substring(0, pathname.lastIndexOf('/')) : pathname;
          const postId = path.substring(path.lastIndexOf('/') + 1);
          const textHtml = '<p>jg<br/></p>';
          await ensure(postId, textHtml, 0, 0, specialType);
     }
}

/**
 * 按最新发帖获取荣誉殿堂前5个帖子
 */
async function getSpecialPostIds(){
     let url = honorZoneUrl;
     let formData = new FormData();
     formData.append('sortType', 'publishDate');
     formData.append('queryContent', '');
     formData.append('page', 1);
     const postPage = await doAjaxForm(url, formData);
     //不包含置顶的
     const aTag = $('.crackling-ul.clearfix li .title:not(:has(.span1)) a', postPage);
     //遍历aTag中href属性中最后一个斜杠后的数字，输出数组并取前5个元素返回
     const aTagArr = [];
     for(let i=0; i< aTag.length; i++){
         const pathname = aTag.eq(i).attr('href');
         let postId = pathname.substring(pathname.lastIndexOf('/')+1);
         aTagArr.push({'type':'special', 'postId': postId});
     }
     return aTagArr.slice(0,5);
}

function getNormalPostIds(){
     return new Array(5).fill({'type':'block', 'postId': waterId});
}


async function allReply() {
     let specialPostIds = await getSpecialPostIds();
     let nomalPostIds = getNormalPostIds();
     let postIds = specialPostIds.concat(nomalPostIds);
     for (let i = 0; i < postIds.length; i++) {
          const element = postIds[i];
          let sleepTime = (i % 3 === 0 && i !== 0) ? 2 * 60 + 1 : 5;
          await sleep(sleepTime);
          const textHtml = '<p><span style="color: rgb(55, 61, 65); font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, sans-serif; font-size:15px; text-wrap: wrap; background-color: rgb(255, 255, 255);">完美的讯飞由你创造</span></p>';
          await ensure(element.postId, textHtml, 0, 0, element.type);
     }
}

async function ensure(docId, textHtml, forbidden, anonymous, specialType) {
     //获取token
     let token = await getWebToken(docId);
     let sessionUserId = await getWebUserId(sessionStorage.getItem("userId"));
     let parm = {
          text: textHtml,
          forbidden: forbidden,
          anonymous: anonymous,
          fid: docId,
          specialType: specialType,
          token: token,
          sessionUserId: sessionUserId
     };
     const result = await doAjax(submitCommentsUrl, parm, 'post');
     console.log(result);
}

/**
 * 聚嗨吧点赞
 * @param {*} page 
 * @param {*} posts 
 * @param {*} maxCounts 
 * @param {*} userId 
 */
async function queryEnablePost(page, posts, maxCounts, userId) {
     await sleep(2);
     let formData = new FormData();
     formData.append('sortType', 'publishDate');
     formData.append('queryContent', '');
     formData.append('page', page);
     const postPage = await doAjaxForm(highBarUrl, formData);
     const postLikeBnts = $('.conte.clearfix .operate.fr em:nth-child(3):not(.active)', postPage);
     for (let j = 0; j < postLikeBnts.length; j++) {
          const clickFunction = postLikeBnts.eq(j).attr('onclick');
          const params = clickFunction.match(/\(([^)]*)\)/)[1];
          const postId = params.split(',')[0];
          const type = params.split(',')[1];
          posts.push({ 'postId': postId, 'type': type });
          if (posts.length >= maxCounts) {
               break;
          }
     }
     if (posts.length < maxCounts) {
          await queryEnablePost(page + 1, posts, maxCounts, userId);
     } else {
          return posts;
     }
}

async function addDiggs(posts, userId) {
     for (let i = 0; i < posts.length; i++) {
          await sleep(5);
          const param = {
               'id': posts[i].postId,
               'type': posts[i].type,
               'sessionUserId': userId
          }
          const result = await doAjax(addDiggsUrl, param, 'post');
          console.log(result);
     }
}

async function getWebUserId(sessionUserId) {
     let userId = '';
     if (sessionUserId == '' || sessionUserId == null || sessionUserId == undefined || sessionUserId == 'null') {
          const result = await doAjax(getUserInfoUrl, '', 'post');
          if (result.flag) {
               userId = result.data.id;
               sessionStorage.setItem("userId", userId);
               return userId;
          }
     } else {
          return sessionUserId;
     }
}

async function getWebToken(data) {
     let token = '';
     let param = { data: data };
     const result = await doAjax(commentTokenUrl, param, 'post');
     if (result.flag) {
          token = result.data;
     }
     return token;
}
//  `modelId=17 
//  &docType=1 帖子类型 1:普通贴
//  &id= 编辑用
//  &doc_type_radio=1 帖子类型 1:普通贴
//  &title=%E6%AF%8F%E6%97%A5%E6%96%B0%E9%97%BB 标题需要urlencode()
//  &specialId=3 板块 3:聚嗨吧 
//  &tagId=11 标签 11:其他
//  &rewardPoint=0
//  &clobs_text= 富文本内容
//  &closeComment=0 是否关闭评论
//  &maxSelected=1
//  &voteOption=
//  &voteOption=
//  &voteOption=
//  &endDate=2023-08-03+16%3A38
//  &visible=1
//  &voteOptions=
//  &resultVisible=
//  &ruleType=1
//  &floorTailNum=
//  &robNum=
//  &includeContent=
//  &startTime=2023-08-04+10%3A00%3A00
//  &endTime=2023-08-07+10%3A00%3A00
//  &redirect=view
//  &draft=false
//  &sessionUserId=
//  &editorValue=%3Cp%3E1111111%3C%2Fp%3E`
/**
 * 
 * @param {*} docType 帖子类型 1:普通贴
 * @param {*} title 标题
 * @param {*} specialId 板块 3:聚嗨吧
 * @param {*} tagId 标签 11:其他
 * @param {*} content 正文
 * @param {*} closeComment 是否关闭评论 0:否,1是
 * @param {*} draft 是否草稿 boolean
 * @param {*} userId 用户id
 */
async function posting(docType, title, specialId, tagId, content, closeComment, draft, userId) {
     let now = dayjs();
     let endDate = now.format('YYYY-MM-DD HH:mm');
     let startTime = now.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
     let endTime = now.add(4, 'day').format('YYYY-MM-DD HH:mm:ss');
     endDate = encodeURIComponent(endDate);
     startTime = encodeURIComponent(startTime);
     endTime = encodeURIComponent(endTime);
     title = encodeURIComponent(title);
     content = encodeURIComponent(content);
     const param = `modelId=17&docType=${docType}&id=&doc_type_radio=${docType}&title=${title}&specialId=${specialId}&tagId=${tagId}&rewardPoint=0&clobs_text=${content}&closeComment=${closeComment}&maxSelected=1&voteOption=&voteOption=&voteOption=&endDate=${endDate}&visible=1&voteOptions=&resultVisible=&ruleType=1&floorTailNum=&robNum=&includeContent=&startTime=${startTime}&endTime=${endTime}&redirect=view&draft=${draft}&sessionUserId=${userId}&editorValue=${content}`;
     const result = await doAjax(postUrl, param, 'post');
     console.log(result);
}

async function dailyNews() {
     const str = await doGMRequest('https://v2.alapi.cn/api/zaobao?token=AAP8j2YGeqJ44t2f&format=json', '', 'get');
     const result = JSON.parse(str);
     if (result.code === 200) {
          const imgSrc = result.data.image;
          const content = `<p><img src="${imgSrc}" title="" alt="每日新闻"/></p>`;
          const nowDate = dayjs().format('YYYY-MM-DD');
          const userId = await getWebUserId(sessionStorage.getItem('userId'));
          await posting(1, `60s读懂世界-${nowDate}`, 3, 11, content, 0, false, userId);
     }
}

async function doAjax(url, param, type) {
     // 定义一个Promise对象
     return await new Promise(function (resolve, reject) {
          $.ajax({
               url: url,
               type: type,
               data: param,
               success: function (data) {
                    // 将后端返回的数据放入Promise对象中,从而将回调函数从success中剥离出来
                    resolve(data);
               },
               complete: function (data) {
                    // 当请求完成之后,data是一个对象,存储着状readyState,responseJSON,status等各种信息
                    // const {status} = data;
                    // console.log(`请求成功,状态码为${status}`);
               },
               error: function (request, textStatus, errorThrown) {
                    // 当请求发送错误,例如服务器内部错误的时候,将相关信息放入Promise的reject对象中
                    reject(request);
               }
          });
     });
}

async function doAjaxForm(url, param) {
     // 定义一个Promise对象
     return await new Promise(function (resolve, reject) {
          $.ajax({
               url: url,
               type: 'post',
               data: param,
               contentType: false,
               processData: false,
               success: function (data) {
                    // 将后端返回的数据放入Promise对象中,从而将回调函数从success中剥离出来
                    resolve(data);
               },
               complete: function (data) {
                    // 当请求完成之后,data是一个对象,存储着状readyState,responseJSON,status等各种信息
                    // const {status} = data;
                    // console.log(`请求成功,状态码为${status}`);
               },
               error: function (request, textStatus, errorThrown) {
                    // 当请求发送错误,例如服务器内部错误的时候,将相关信息放入Promise的reject对象中
                    reject(request);
               }
          });
     });
}

async function doGMRequest(url, param, type) {
     return await new Promise(function (resolve, reject) {
          GM_xmlhttpRequest({
               method: type,
               url: url,
               data: param,
               onload: function (res) {
                    if (res.status === 200) {
                         resolve(res.response);
                    } else {
                         reject(res);
                    }
               },
               onerror: function (err) {
                    reject(err);
               }
          });
     });
}
(function () {
     'use strict';
     syncSetting();
     replaceIframeJump();
     addGetLikeBtn();
})();