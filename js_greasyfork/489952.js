// ==UserScript==
// @name         小助手
// @namespace    https://www.kujiale.cn/
// @version      2.2
// @description  test
// @author       zz
// @match        https://*.kujiale.com/*
// @match        https://*.kujiale.cn/*
// @connect      www.kujiale.com
// @connect      www.kujiale.cn
// @connect      gitee.com
// @grant        GM_xmlhttpRequest
// @grant GM_cookie
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_setClipboard
// @grant GM_log
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/489952/%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/489952/%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
const RETRY = 3; // 移动分类重试次数，官方系统有分类显示问题，所以本脚步移动到指定文件夹时会多试几次
let popupVue;
let loading;
let debug = true;
const userList = [];
let currentUser = {};
function consoleLog(...content){
   if(debug) console.log(...content);
}
function log(content){
    const currentTime = new Date(new Date().setHours(new Date().getHours() + 8)).toISOString().replace("Z", " ").replace("T", " ");
     if(popupVue) {
         popupVue.log = currentTime + content + "\n" + popupVue.log;
    }
}
function setProgess(progesss){
    if(popupVue) {
        popupVue.progress = progesss;
    }
}
function showWarning(msg, type="success"){
     popupVue && popupVue.$notify({
         message: msg,
         type
     });
}
function disbaleClosePopup(disable){
    if(popupVue) {
        popupVue.closeViaDimmer = !disable;
        popupVue.closeable = !disable;
    }
}
function showLoading(show){
    if(!loading && popupVue && show){
        loading = popupVue.$loading();
    }
    if(show && loading) {
        disbaleClosePopup(true);
        loading.loadingText = "正在操作中，请不要切换和刷新页面……";
        window.onbeforeunload = function(e){
            e.returnValue = "正在操作中，是否要离开";
        }
    }
    if(!show && loading) {
        disbaleClosePopup(false);
        loading.close();
        loading = null;
        window.onbeforeunload = null;
    }


}
Date.prototype.Format = function (fmt) { // author: meizz
     var o = {
        "M+":  this.getMonth() + 1, // 月份
        "d+":  this.getDate(), // 日
        "h+":  this.getHours(), // 小时
        "m+":  this.getMinutes(), // 分
        "s+":  this.getSeconds(), // 秒
        "q+": Math.floor(( this.getMonth() + 3) / 3), // 季度
        "S":  this.getMilliseconds() // 毫秒
    };
     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, ( this.getFullYear() + "").substr(4 - RegExp.$1.length));
     for ( var k in o){
         if ( new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
     }
     return fmt;
}
function wait(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}
function createCateName(userInfo) {
    if(userInfo.email) return userInfo.email;
    return new Date().Format("yyyy-MM-dd") + "_" + userInfo.userName || "0";
}
function dateToTimestamp(date){
    return Date.parse(date);
}
function Request(url, method, opt = {}) {
    Object.assign(opt, {
        url,
        timeout: 10000,
        method: method
    })

    return new Promise((resolve, reject) => {
        opt.onerror = opt.ontimeout = reject
        opt.onload = resolve
        GM_xmlhttpRequest(opt)
    })
}
function getDesignList(page, cookie){
    return Request(`https://www.kujiale.cn/api/mydesign/list/v4?page=${page}&num=18&showtotalpage=true&showpresent=true&keyword=&sort=2&categoryId=&includeChildren=0&sourceType=1`,"GET",{
        anonymous:  true,
        cookie:cookie,
    }).then(res=>{
        consoleLog(res.response);
        return JSON.parse(res.response)["d"];
    });
}
function getDesignListV2(page, cookie){
    return Request(`https://www.kujiale.com/saas-design/api/design/list`,"POST",{
        anonymous:  true,
        headers: {
            "Content-Type": "application/json",
        },
        cookie:cookie,
        data: JSON.stringify({"keyword":"","tagIds":[],"start":(page-1) * 30,"num":30})
    }).then(res=>{
        consoleLog(res.response);
        return JSON.parse(res.response)["d"];
    });
}
function updateDesignStatue(obsdesignid, cookie) {
    consoleLog(`updateDesignStatue ${obsdesignid}`);
    return Request(`https://www.kujiale.cn/designex/api/design/updateDesignAttrPrivateStatus?obsdesignid=${obsdesignid}&status=0`,"POST",{
        anonymous:  true,
        cookie:cookie,
    }).then(res=>{
        consoleLog(res);
        // {"c":"0","m":""}
        return JSON.parse(res.response);
    });
}
function getCategoryList(){
    return Request(`https://www.kujiale.cn/yuncore/api/category/list`,"GET",{
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res=>{
        consoleLog(res.response);
        return JSON.parse(res.response).d;
    });
}
async function addCategory(cateName){
    consoleLog(`addCategory ${cateName}`);
    const cateList = await getCategoryList();
    const cate = cateList.find(function (item, index, arr) {
        return item.name == cateName;
    });
    if(cate) return cate.obsId;
    return Request(`https://www.kujiale.cn/yuncore/api/category`,"POST",{
        data: JSON.stringify({"name":cateName,"level":0}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res=>{
        consoleLog(res);
        return JSON.parse(res.response).d;
    });
}
async function mvToCate(obsPlanId, obsTagId, retry=RETRY){
    consoleLog(`mvToCate ${obsPlanId} ${obsTagId} retry[${retry}]`);
    let move = await Request(`https://www.kujiale.cn/yuncore/api/plan/category?obsPlanId=${obsPlanId}&obsTagId=${obsTagId}`,"POST",{
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res=>{
        consoleLog(res.response);
        return JSON.parse(res.response).c == "0";
    });
    if(retry-1==0){
        return move;
    } else {
        return mvToCate(obsPlanId, obsTagId, retry-1);
    }

}
async function copyToCate(obsDesignId, obsTagId){
    consoleLog(`copyToCate ${obsDesignId} => ${obsTagId}`);
    const copyRes = await Request(`https://www.kujiale.cn/design-manage/api/design/copy`,"POST",{
        data: JSON.stringify({"obsDesignId":obsDesignId}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res=>{
        consoleLog(`copyToCate ${obsDesignId} => ${obsTagId} response: ${res.response}`);
        if(!JSON.parse(res.response).d) {
            consoleLog(`copyToCate ${obsDesignId} => ${obsTagId} 失败`);
            log(`导入失败:${JSON.parse(res.response).m}`);
            return {};
        }
        return JSON.parse(res.response).d;
    });
    if(!obsTagId) {
        return false;
    }
    if(!copyRes.obsCopiedPlanId) {
        return false;
    }
    await wait(500);
    return mvToCate(copyRes.obsCopiedPlanId, obsTagId);
}

async function copyAllV2(userInfo,startDate,endDate,copyCateName,operate){
    //if(currentUser.userType == 2 && userInfo.userType == 3) return showWarning("个人用户无法复制企业用户的方案！", "warning");
    let startTime;
    let endTime;
    if(startDate && startDate != ""){
        startTime = dateToTimestamp(startDate);
    }
    if(endDate && endDate != ""){
        endTime = dateToTimestamp(endDate);
    }
    if(startTime && endTime && startTime >= endTime){
        return showWarning("起始日期应该小于结束日期！", "warning");
    }
    log(`准备操作${userInfo.email}的设计方案`);
    consoleLog(`${userInfo.cookie} startDate:${startDate} endDate:${endDate}`);
    const cookie = userInfo.cookie;
    let curPage = 1;
    let totalPage = 1;
    let designList;
    try{
        designList = await getDesignListV2(curPage, cookie);
    } catch(e) {
        userInfo.copyStatus = "danger";
        userInfo.copyResult = `账号可能失效`;
        log(`${userInfo.email}的设计方案获取失败，请重试或尝试重新登陆账号${userInfo.email}！`);
        consoleLog(e);
        return false;
    }
    consoleLog(designList);
    if(designList["result"].length === 0) {
        userInfo.copyStatus = "warning";
        userInfo.copyResult = `方案列表空`;
        consoleLog("目标的方案列表是空的");
        log(`${userInfo.email}的设计方案是空的！！！`);
        return false;
    }
    showLoading(true);
    totalPage = Math.ceil(designList.totalCount/30);

    // 公开方案
    let count = 1;
    let success = 0;
    do{
        consoleLog(`正在公开第${curPage}页，总共${totalPage}页`);
        log(`正在公开第${curPage}页，总共${totalPage}页`);
        for(let i=0; i<designList["result"].length; i++){
            let simpleDesigns = designList["result"][i];
            if(startTime && simpleDesigns.modifiedTime < startTime) continue;
            if(endTime && simpleDesigns.modifiedTime > endTime) continue;
            log(`正在公开第${count}个方案`);
            const obsdesignid = simpleDesigns.obsDesignId;
            const statueRes = await updateDesignStatue(obsdesignid, cookie);
            if(statueRes["c"]=="0") success++;
            await wait(500);
            count++;
        }
        setProgess(Math.round(curPage/totalPage * 100));
        curPage = curPage + 1;
        if(curPage > totalPage) break;
        designList = await getDesignListV2(curPage, cookie);
    } while(curPage <= totalPage);
    log(`公开${userInfo.email}的方案结束，成功${success}/${count-1}个`);
    userInfo.copyStatus = "success";
    userInfo.copyResult = `公开${success}个`;

    if(operate != "复制") {
        showLoading(false);
        return;
    }
    if(copyCateName && copyCateName == ""){
       copyCateName = createCateName(userInfo);
    }
    const cateName = copyCateName;
    const obsTagId = await addCategory(cateName);
    consoleLog(`${cateName}=>${obsTagId}`);
    count = 1;
    success = 0;
    curPage = 1;
    designList = await getDesignListV2(curPage, cookie);
    setProgess(0);
    do{
        consoleLog(`正在复制第${curPage}页，总共${totalPage}页`);
        log(`正在复制第${curPage}页，总共${totalPage}页`);
        for(let i=0; i<designList["result"].length; i++){
            let simpleDesigns = designList["result"][i];
            if(startTime && simpleDesigns.modifiedTime < startTime) continue;
            if(endTime && simpleDesigns.modifiedTime > endTime) continue;
            log(`正在复制第${count}个方案`);
            const obsdesignid = simpleDesigns.obsDesignId;
            const copyRes = await copyToCate(obsdesignid, obsTagId);
            copyRes && success++;
            count++;
            await wait(500);
        }
        setProgess(Math.round(curPage/totalPage * 100));
        curPage = curPage + 1;
        if(curPage > totalPage) break;
        designList = await getDesignListV2(curPage, cookie);
    } while(curPage <= totalPage);
    showLoading(false);
    consoleLog(`复制方案完成，请查看${cateName}文件夹`);
    showWarning(`复制${userInfo.email}的方案结束`);
    log(`复制${userInfo.email}的方案结束，成功复制${success}/${count-1}个，请查看${cateName}文件夹，如有分类问题一般是官方系统导致，可手动再移动一次`);
    userInfo.copyStatus = "success";
    userInfo.copyResult = `复制${success}个`;
}
function getUserInfo(cookie) {
    return Request(`https://www.kujiale.cn/api/info/global`,"POST",{
        cookie:cookie,
    }).then(res=>{
        consoleLog(res);
        const response = JSON.parse(res.response);
        if(!response || !response.user) {
            return {};
        }
        return response.user;
    });
}
function createOpenPanelButton(){
    consoleLog("createOpenPanelButton");
    return `
   <div id="btnOpenPanel" style="position: relative;"><div><a class="start-design-btn gs-btn-fill" rel="noopener nofollow" @click="showPopup">打开小助手</a></div></div>
   `;
}

function createPopup(){
    return `
 <template id="my-popup">
    <am-popup :is-show.sync="popupVisible" :close-via-dimmer.sync="closeable" style="minWidth:800px;">
        <am-popup-header title="小助手2.2" :closeable.sync="closeable"></am-popup-header>
        <am-popup-body>
           <am-tag color="primary">当前用户：{{currentUser.userName}} - {{currentUser.email}}</am-tag>
           <am-tag color="primary">{{currentUser.userType==2? "个人用户":"企业用户"}}</am-tag>
           <table class="am-table am-table-bd am-table-striped admin-content-table">
            <thead>
            <tr>
              <th><am-checkbox v-model="checkAll" @change="checkAllChanged(checkAll)" label="全选"></am-checkbox>用户</th><th>导入到</th><th>操作</th><th>状态</th>
            </tr>
            </thead>
            <tbody>


             <tr v-for="(userInfo, index) in userList" :key="userInfo.obsUserId">
              <td><am-checkbox v-model="userInfo.copyfrom" :label="userInfo.email"></am-checkbox>({{userInfo.userType==2? "个人用户":"企业用户"}})</td>
              <td>
                <am-input-group>
                    <am-input-label slot="prepend">文件夹</am-input-label>
                    <am-input v-model="userInfo.copyCateName" placeholder="请输入文件夹名称"></am-input>
                </am-input-group>
              </td>
              <td>
                <am-checkbox v-model="userInfo.openDesign" :label="userInfo.email" :show-label="false"></am-checkbox>公开
                <am-checkbox v-model="userInfo.copyDesign" :label="userInfo.email" :show-label="false"></am-checkbox>复制
                <!-----<button type="button" class="am-btn am-btn-primary" @click="copy(userInfo)">导入</button>---->
                <!-----<button type="button" class="am-btn am-btn-danger" @click="deleteUser(userInfo.obsUserId)">移除</button>---->
              </td>
              <td>
                <am-tag :color="userInfo.copyStatus">{{userInfo.copyResult}}</am-tag>
              <td>
             </tr>
            </tbody>
           </table>
        <am-progress :is-show.sync="progressVisible" :progress="progress" :showProgress="false" :striped="true" :active="true"></am-progress>
        <am-button color="primary" @click="switchAccount()">添加账号</am-button>
        <am-button color="primary" @click="mutilCopy()">批量操作</am-button>
        <am-code scrollable="true" syntax="shell">{{log}}</am-code>
        免责声明: 本工具数据均来自互联网，请遵守相关法律法规，请勿用于非法用途，如涉嫌违法违规均与开发者无关!!!
      </am-popup-body>
    </am-popup>

</template>
`

}

async function switchAccount(){
    let avator = document.querySelector("#gsNav > div.nav-row.fixed-cont.nav-bottom.J_navBottom > div > div > div.right-bottom-action > div.status-bar.J_gsNavStatusBar > div > div:nth-child(4) > div > div");
    if(!avator) avator = document.querySelector("#gsNav > div.nav-row.fixed-cont.nav-bottom.J_navBottom > div > div.right-bottom-action > div.status-bar.J_gsNavStatusBar > div > div:nth-child(6) > div > div");
    if(!avator) {
        return showWarning("请点击头像切换账号!", "warning");
    }
    avator.click();
    await wait(500);
    const switchBtn = document.querySelector(".Footer-switch-account-btn_36d4d");
    switchBtn.click();
    await wait(500);
    const switchBtn2 = document.querySelector("body > div.sc-gsnTZi.hDsbsv > div > div:nth-child(2) > button");
    switchBtn2.click();
}

async function openLoginPanel(){
    const btn = document.querySelector("#gsNav > div.nav-row.fixed-cont.nav-bottom.J_navBottom > div > div.right-bottom-action > div.nav-btns.J_gsNavBtns > button.my-design-btn.gs-btn-line");
    if(!btn) {
        return;
    }
    btn.click();
}

function loadCss(url){
    var link = document.createElement('link');
    link.type='text/css';
    link.rel='stylesheet';
    link.href=url;
    document.head.appendChild(link);
}
function loadJS(url, callback) {
    var script = document.createElement('script');
    var fn = callback || function() {};
    script.type = 'text/javascript';
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        script.onload = function() {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
function main(){
    const navTab = document.querySelector("#gsNav > div.nav-row.fixed-cont.nav-bottom.J_navBottom > div > div.right-bottom-action > div.nav-btns.J_gsNavBtns");
    const body = document.querySelector("body");
    consoleLog("start");
    var strCookies = document.cookie;
    consoleLog(strCookies);

    GM_cookie.list({name: "qunhe-jwt"}, async (cookie, error) => {
        if(error) {
            consoleLog(error);
            consoleLog("请先登陆并刷新首页");
            return;
        } else {
            const jwtCookie = `${cookie[0].name}=${cookie[0].value}`;
            consoleLog(jwtCookie);
            strCookies = strCookies + ";" + jwtCookie;
        }

        const userInfo = await getUserInfo(strCookies);
        consoleLog(userInfo);
        userInfo.cookie = strCookies;
        currentUser = userInfo;
        GM_setValue(userInfo.obsUserId, {
            userInfo
        });

        const userIdList = GM_listValues();
        consoleLog(userIdList);
        for(let i=0; i<userIdList.length;i++){
            if(userIdList[i] == currentUser.obsUserId){
                continue;
            }
            const user = GM_getValue(userIdList[i]);
            user.userInfo.startDate = "";
            user.userInfo.endDate = "";
            user.userInfo.copyStatus = "success";
            user.userInfo.copyResult = "--";
            user.userInfo.copyfrom = false;
            user.userInfo.openDesign = true;
            user.userInfo.copyDesign = true;
            user.userInfo.copyCateName = createCateName(user.userInfo);
            userList.push(user.userInfo);
        }
        body.insertAdjacentHTML('beforeend', createPopup());

    });

}
(function() {
    'use strict';
    loadCss("https://unpkg.com/amaze-vue/dist/amaze-vue.css");
    loadJS("https://lib.baomitu.com/vue/2.7.7/vue.min.js");
    loadJS("https://unpkg.com/amaze-vue/dist/amaze-vue.js");
    main();
    window.onload=async ()=>{
        const navTab = document.querySelector("#gsNav > div.nav-row.fixed-cont.nav-bottom.J_navBottom > div > div > div.right-bottom-action > div.nav-btns.J_gsNavBtns");
        navTab.insertAdjacentHTML('beforeend', createOpenPanelButton());

        popupVue = new Vue({
            el: '#my-popup',
            data() {
                return {
                    currentUser,
                    userList,
                    popupVisible: false,
                    progress: 0,
                    progressVisible: false,
                    closeable: true,
                    log: ``,
                    checkAll:false,
                }
            },
            methods: {
                checkAllChanged(){
                    consoleLog("全选:" + this.checkAll);
                    for(let i=0; i<this.userList.length;i++){
                        this.userList[i].copyfrom = this.checkAll;
                    }
                },
                copyUserDesign(obsUserId,startDate,endDate,copyCateName) {
                    this.progressVisible = true;
                    this.progress = 0;
                    const user = GM_getValue(obsUserId);
                    consoleLog(user);
                    copyAllV2(user.userInfo, startDate, endDate, copyCateName);
                },
                copy(userInfo) {
                    this.progressVisible = true;
                    this.progress = 0;
                    consoleLog(userInfo);
                    copyAllV2(userInfo, "", "", userInfo.copyCateName);
                },
                async mutilCopy(){
                    consoleLog(this.userList);
                    let count = 0;
                    for(let i=0; i<this.userList.length;i++){
                        this.progressVisible = true;
                        this.progress = 0;
                        if(this.userList[i].copyfrom) {
                            count++;
                            let operate = "";
                            if(this.userList[i].copyDesign) {
                                this.userList[i].openDesign = true;
                                operate = "复制";
                            } else if(this.userList[i].openDesign) {
                                operate = "公开";
                            }

                            if(operate != "") {
                                await copyAllV2(this.userList[i], "", "", this.userList[i].copyCateName, operate);
                            } else {
                                log(`${this.userList[i].email}未勾选任何操作！`);
                            }
                        }
                    }
                    if(count ==0 ) showWarning("请先勾选账号!", "warning");
                },
                deleteUser(obsUserId) {
                },
                async switchAccount(){
                    this.popupVisible = false;
                    await wait(500);
                    switchAccount();
                },
            },
              computed: {
                  userTypeName() {
                      return this.currentUser.userType == 2 ? '个人用户' : '企业用户'
                  }
              }
        });
        new Vue({
            el: '#btnOpenPanel',
            methods: {
                showPopup() {
                    if(!currentUser.obsUserId) {
                        showWarning("未检测到账号，请刷新或者登陆!", "warning");
                        openLoginPanel();
                        return;
                    }
                    popupVue.popupVisible = true;
                }
            }
        });
    }
})();