// ==UserScript==
// @name         NNuo企业列表
// @namespace    1355032088@qq.com
// @version      2.3
// @description  快捷地通过企业名称进行登录
// @author       Jc
// @license MIT
// @match        https://u.nuonuo.com/Contents/usercenter/allow/login/login.jsp*
// @match        https://u.jss.com.cn/Contents/usercenter/allow/login/login.jsp*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @grant    GM_addStyle
// @grant    GM_getResourceURL
// @grant    GM_listValues
// @grant    GM.getResourceUrl
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @grant    GM_registerMenuCommand
// @grant    unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/453618/NNuo%E4%BC%81%E4%B8%9A%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453618/NNuo%E4%BC%81%E4%B8%9A%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

!function () {
    let AllData = {
        menuText:"企业列表",
        panel_title:"企业列表",
        panel_title_Recommend:"常用企业",
        panel_title_Login:"用户登录",
        panel_title_QyInfo:"企业信息",
        searchText:"查询",
        recommendNum:15,//推荐企业数量
        loginName:"登录",
        mainButtonName1:"添加企业",
        cancelName:"关闭",
        userInfo:{
        },
        qyList:[]
}
if (typeof (GM) === "undefined") {
    // 这个是ViolentMonkey的支持选项
    GM = {};
    GM.setValue = GM_setValue;
    GM.getValue = GM_getValue;
  }
    initLoginPop();
    initUserInfo().then((rs)=>{LoadList().then((rs)=>{ShowList()})});//加载企业列表HTML
    InsertListButton();//增加"企业列表"按钮
    function initUserInfo(){
        return new Promise((rs,rj)=>{//初始化用户数据和企业数据
            Promise.all([GM.getValue("userInfo")]).then(function (data){
                let res = data[0]
                if (res && (res !== 'undefined' && res !== 'null')) {
                    try {//本地用户和服务器端用户保存时间做对比,时间不一样就从服务器获取企业列表放在本地
                        AllData.userInfo=res;
                        let userLocal = res;
                        if(userLocal.GUID&&userLocal.Account&&userLocal.Password){
                            Promise.all([userLogin(userLocal.Account,userLocal.Password)]).then(function (data0){
                                let userServer = data0[0]
                                console.log(data0)
                                console.log("LocalModifiedTime:"+userLocal.ModifiedTime)
                                console.log("ServerModifiedTime:"+userServer.ModifiedTime)
                                if(userLocal.ModifiedTime>=userServer.ModifiedTime){
                                Promise.all([GM.getValue("qyList")]).then(function (data1){
                                    console.log("data1")
                                    console.log(data1)
                                    let res1 = data1[0]
                                    if (res1 && (res1 !== 'undefined' && res1 !== 'null')) {
                                        let qyList = res1;
                                        AllData.qyList=res1;
                                        console.log("直接加载qyList")
                                        rs();
                                    }else{
                                        //获取企业列表
                                        console.log("通过账号信息获取qyList|addList")
                                        NNSetValue("userInfo",userServer)
                                    AllData.userInfo = userServer
                                    let userLocal = AllData.userInfo;
                                        qyList(userLocal.GUID).then((res)=>{rs();})
                                    }
                                })
                                }else{
                                    //获取企业列表
                                        console.log("通过账号信息获取qyList|refreshList")
                                    NNSetValue("userInfo",userServer)
                                    AllData.userInfo = userServer
                                    let userLocal = AllData.userInfo;
                                        qyList(userLocal.GUID).then((res)=>{rs();})
                                }
                            })
                        }else{
                            //弹出登录框
                            console.log("没有GUID,需要弹出登录框")
                            rj();
                        }
                    } catch (e) {
                        console.log(e)
                        rj();
                    }
                }else{
                    //弹出登录框
                    console.log("没有userInfo,需要弹出登录框")
                    rj();
                }
            })
        })
    }
    function InsertListButton() {
          if (document.querySelector("#myList") === null) {
            try {
              let parent = document.querySelector(".m-logo");
              //parent.style = "width: auto;";
              let userAdiv = document.createElement("div");
              userAdiv.className ="f-fl x-hydl myList";
              userAdiv.innerHTML = `<input type='submit' class='myListButton' value='${ AllData.menuText}'/>`;
              parent.append(userAdiv);
              document.querySelector(".myList .myListButton").addEventListener("click", function(e) {
                return NNtoggleList(e);
              }, true);
            } catch (e) {
            }
          }
        }
    var tableQylistAll = {tableQylist:"",tableQylist_Recommend:""};
    function LoadList(){//加载企业列表数据
        return new Promise((rs,rj)=>{
            console.log("LoadList")
            console.log(AllData.qyList)
            let res = AllData.qyList
            if (res && (res !== 'undefined' && res !== 'null')) {
                //拼接企业列表数据
                tableQylistAll.tableQylist=buildList(res);
                //推荐企业排序并拼接
                let heatRes=res;
                tableQylistAll.tableQylist_Recommend=buildListHeat(heatRes);
                rs();
            }
        })
    }
    function buildList(res){
        let returnList="";
        if (res && (res !== 'undefined' && res !== 'null')) {
            let res0=res.sort((x,y)=>{return y.id - x.id});
            res0.forEach(function(e,i){//拼接企业列表数据
                if(i%3==0){
                    if(e==null&&i!=0){ returnList +=`</tr>`;}
                    returnList +=`<tr>
                        <td style="float: left;display: contents;">
                        <div class="qyInfo listQyInfo" title="名称:${e.taxName}&#10;税号:${e.taxNo}" qyId="${e.id}" qyHeat="${e.heat}" qyTaxNo="${e.taxNo}" qyPassword="${e.password}">
                        <span style="overflow: hidden;display: block;">${e.taxName}</span></div>
                        <div class="qyEdit listQyEdit" qyId="${e.id}"><svg t="1663573976098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2385" width="20" height="20">
                <path d="M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z" p-id="2386">
                </path>
                <path d="M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z" p-id="2387">
                </path>
                </svg></div>
                        </td>`
                }
                if(i%3==1){
                    if(e==null){ returnList +=`</tr>`;}
                    returnList +=`<td style="float: left;display: contents;">
                        <div class="qyInfo listQyInfo" title="名称:${e.taxName}&#10;税号:${e.taxNo}" qyId="${e.id}" qyHeat="${e.heat}" qyTaxNo="${e.taxNo}" qyPassword="${e.password}">
                        <span style="overflow: hidden;display: block;">${e.taxName}</span></div>
                        <div class="qyEdit listQyEdit" qyId="${e.id}"><svg t="1663573976098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2385" width="20" height="20">
                <path d="M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z" p-id="2386">
                </path>
                <path d="M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z" p-id="2387">
                </path>
                </svg></div>
                        </td>`
                }
                if(i%3==2){
                    if(e==null){ returnList +=`</tr>`;}
                    returnList +=`<td style="float: left;display: contents;">
                        <div class="qyInfo listQyInfo" title="名称:${e.taxName}&#10;税号:${e.taxNo}" qyId="${e.id}" qyHeat="${e.heat}" qyTaxNo="${e.taxNo}" qyPassword="${e.password}">
                        <span style="overflow: hidden;display: block;">${e.taxName}</span></div>
                        <div class="qyEdit listQyEdit" qyId="${e.id}"><svg t="1663573976098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2385" width="20" height="20">
                <path d="M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z" p-id="2386">
                </path>
                <path d="M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z" p-id="2387">
                </path>
                </svg></div>
                        </td>`
                }
            })
        }
        return returnList;
    }
    function buildListHeat(res){
        let returnList="";
        if (res && (res !== 'undefined' && res !== 'null')) {
            let res0=res.sort((x,y)=>{return y.heat - x.heat});
            res0=res0.slice(0,AllData.recommendNum);
            res0.forEach(function(e,i){
                returnList +=`<tr>
                <td style="float: left;display: contents;">
                <div class="qyInfo" title="名称:${e.taxName}&#10;税号:${e.taxNo}" qyId="${e.id}" qyHeat="${e.heat}" qyTaxNo="${e.taxNo}" qyPassword="${e.password}">
                <span style="overflow: hidden;display: block;">${e.taxName}</span></div>
                <div class="qyEdit" qyId="${e.id}"><svg t="1663573976098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2385" width="20" height="20">
                <path d="M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z" p-id="2386">
                </path>
                <path d="M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z" p-id="2387">
                </path>
                </svg></div>
                </td>
                </tr>`
            })
        }
        return returnList;
    }
    function searchQy(){
        let keyword = document.querySelector("input[name='searchQy']").value;
        let tempList=AllData.qyList;
        let searchList=[];
        tempList.forEach(function(e,i){
            if(e.taxName.indexOf(keyword)>-1||e.taxNo.indexOf(keyword)>-1){
                searchList.push(e);
            }
        })
        refreshTable("#tableQylist",searchList);
    }
    function refreshTable(tableName,res){
        if (document.body !== null && document.querySelector(tableName) !== null) {
            let Container = document.querySelector(tableName);
            Container.innerHTML =buildList(res);
            document.querySelectorAll(".listQyInfo").forEach(function(dom){
            dom.addEventListener("click", function(e) {
                        return selectQy(e);
                    }, true)
        });
        document.querySelectorAll(".listQyEdit").forEach(function(dom){
                    dom.addEventListener("click", function(e) {
                        //弹出企业编辑框
                        return qyInfoPop("edit",dom.getAttribute("qyId"));
                    }, true)
                });
        }
    }
    function ShowList() {// 如果不存在的话，那么自己创建一个
        console.log("ShowList")
        let loginState="";
        let logOffState="";
        let showText="";
        if(AllData.userInfo.Account!=""){
            loginState="display:none";
            logOffState="display:block";
            showText="|退出登录"
        }else{
            loginState="display:block";
            logOffState="display:none";
        }
        let tableQylist=tableQylistAll.tableQylist;
        let tableQylist_Recommend=tableQylistAll.tableQylist_Recommend;
        let htmlContent=`<div class="nn-content nn-mainContent" style="display: none;">
                <div class="nn-header" style="padding:10px 30px;">
                <!------------账户信息/搜索-------------->
                <span style="font-size: 14px;line-height: 24px;">你好,</span><span style="font-size: 14px;line-height: 24px;">${AllData.userInfo.Name}</span>
                <span id="nn-loginUserButton" style="font-size: 14px;line-height: 24px;color:blue;cursor:pointer;${logOffState}">${showText}</span>
                <input name="searchQy" id="searchQyTextBox" type="text" style="margin:0 30px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
                <span id="nn-searchbutton" class="nn-Button nn-lightButton" style="margin: 0" title="${ AllData.searchText}">${ AllData.searchText}</span>
                </div>
                <div class="nn-main" style="max-height:70vh;">
                <!------------推荐企业-------------->
                <fieldset class="list-main nn-qyListRecommend" style="display:block;overflow: auto;width: 300px;float:left;min-height:150px;">
                  <legend class="iframe-father">
                       <span style="color: #4e71f2;-webkit-tap-highlight-color: #4e71f2;font-size: 14px;font-weight: bold;">${AllData.panel_title_Recommend}</span>
                  </legend>
                    <table id="tableQylistHeat">
                    ${tableQylist_Recommend}
                    </table>
                  </fieldset>
                  <!------------企业列表-------------->
                  <fieldset class="list-main nn-qyList" style="display:block;overflow: auto;width: 1000px;float:left;min-height:150px;">
                  <legend class="iframe-father">
                       <span style="color: #4e71f2;-webkit-tap-highlight-color: #4e71f2;font-size: 14px;font-weight: bold;">${AllData.panel_title}</span>
                  </legend>
                    <table id="tableQylist">
                    ${tableQylist}
                    </table>
                  </fieldset>
                </div>
                <!------------保存、取消按钮-------------->
                <div id="nn-footer">
                  <span id="nn-cancelList" class="nn-Button" style="padding:2px 10px;" title="${ AllData.cancelName}">${ AllData.cancelName}</span>
                  <span id="nn-savebutton" class="nn-Button nn-lightButton" title="${ AllData.mainButtonName1}" style="float: right;padding:2px 10px;">${ AllData.mainButtonName1}</span>
                </div>
              </div>`;
          if (document.body !== null && document.querySelector("#nn-container") === null) {
            let Container = document.createElement('div');
            Container.id = "nn-container";
            Container.innerHTML =htmlContent;
            document.body.appendChild(Container);
          }else
          {
              let Container=document.querySelector("#nn-container");
              Container.innerHTML =htmlContent;
          }
        try {
            addListListener();
        } catch (e) {
            console.log(e);
        }
    }
    function addListListener(){
        document.querySelectorAll(".qyInfo").forEach(function(dom){
            dom.addEventListener("click", function(e) {
                        return selectQy(e);
                    }, true)
        });
        document.querySelectorAll(".qyEdit").forEach(function(dom){
                    dom.addEventListener("click", function(e) {
                        //弹出企业编辑框
                        return qyInfoPop("edit",dom.getAttribute("qyId"));
                    }, true)
                });
        //查询企业
        document.querySelector("#nn-searchbutton").addEventListener("click", function(e) {
                    return searchQy();
                }, true);
        document.querySelector("body .nn-mainContent,body .nn-qyInfoContent").addEventListener('click', function(e) {
                  e.stopPropagation(); // 阻止点击自身的时候关闭
              }, false);
        //退出用户
        document.querySelector("#nn-loginUserButton").addEventListener("click", function(e) {
            return userLogOff();
        }, true);
        //添加企业
        document.querySelector("#nn-savebutton").addEventListener("click",function(e){
            console.log("添加企业")
            return qyInfoPop("add");
        },true);
        document.querySelector("body").addEventListener('click', function(e) {
                  safeFunction(() => {
                  if (document.querySelector(".nn-mainContent").style.display === 'flex') {
                    document.querySelector(".nn-mainContent").style.display = 'none';
                }
              })
              }, false);
        document.querySelector("#nn-cancelList").addEventListener("click", function(e) {
            return NNtoggleList(e);
        }, true);
    }
    function initLoginPop(){
        console.log("initLoginPop")
        let htmlContent=`<div class="nn-content nn-loginContent" style="display: none;">
                <div class="nn-header" style="padding:10px 30px;">
                </div>
                <div class="nn-main" style="margin: 0 auto;">
                <!------------账号密码-------------->
                <fieldset class="info-main" style="display:block;max-height: 200px;overflow: auto;width: 270px;float:left;min-height:120px;">
                  <legend class="iframe-father">
                       <span style="color: #4e71f2;-webkit-tap-highlight-color: #4e71f2;font-size: 14px;font-weight: bold;">${AllData.panel_title_Login}</span>
                  </legend>
                  <div style="margin: 15px 5px;">
<span style="font-size:16px;">账号</span>
<input  id="nn-account" name="nn-account" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
</div>
<div style="margin: 15px 5px;">
<span style="font-size:16px;">密码</span>
<input  id="nn-password" name="nn-password" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
                  </div>
                  </fieldset>
                  </div>
                <!------------保存、取消按钮-------------->
                <div id="nn-footer">
                  <span id="nn-cancelLogin" class="nn-Button" title="${ AllData.cancelName}">${ AllData.cancelName}</span>
                  <span id="nn-Login" class="nn-Button nn-lightButton" title="${ AllData.loginName}" style="float: right;">${ AllData.loginName}</span>
                </div>
              </div>`;
          if (document.body !== null && document.querySelector("#nn-loginPop") === null) {
            let Container = document.createElement('div');
            Container.id = "nn-loginPop";
            Container.innerHTML =htmlContent;
            document.body.appendChild(Container);
          }else
          {
              let Container=document.querySelector("#nn-loginPop");
              Container.innerHTML =htmlContent;
          }
        try {
                //addListListener();
            document.querySelector("#nn-Login").addEventListener("click", function(e) {
                let ac=document.querySelector("input[name='nn-account']").value
                let pw=document.querySelector("input[name='nn-password']").value
                if(ac!=""&&pw!=""){
                    return userLogin(ac,pw).then((rs)=>{
                    NNSetValue("userInfo",rs)
                    AllData.userInfo = rs
                    let userLocal = AllData.userInfo;
                    qyList(userLocal.GUID).then((rs)=>{LoadList().then((rs)=>{ShowList();NNtoggleLogin();NNtoggleList();})});
                },(rj)=>{alert(rj);false;});}else{
                    alert("账号密码不能为空")
                }
              }, true);
            document.querySelector("body .nn-loginContent").addEventListener('click', function(e) {
              e.stopPropagation(); // 阻止点击自身的时候关闭
            }, false);
              document.querySelector("body").addEventListener('click', function(e) {
              safeFunction(() => {
                if (document.querySelector(".nn-loginContent").style.display === 'flex') {
              document.querySelector(".nn-loginContent").style.display = 'none';
            }
              })
            }, false);
            document.querySelector("#nn-cancelLogin").addEventListener("click", function(e) {
                return NNtoggleLogin(e);
              }, true);
            } catch (e) {
              console.log(e);
            }
    }
    function qyInfoPop(func,id){
        console.log("qyInfoPop")
        let qyInfo={
            "id": 0,
            "taxName": "",
            "taxNo": "",
            "password": "",
            "heat": 0,
            "pUserGUID": AllData.userInfo.GUID,
            "isdeleted": 0
        }
        let mainButtonName="保存"
        let delButtonName="删除"
        let editButtonState="display:none"
        if(func=="add"){
            mainButtonName="添加"
        }else{
            editButtonState="display:block"
        }
        if(id){
            qyInfo=AllData.qyList.find((item)=>item.id==id)
        }
        let htmlContent=`<div class="nn-content nn-qyInfoContent" style="display: flex;">
                <div class="nn-header" style="padding:10px 30px;">
                </div>
                <div class="nn-main" style="margin: 0 auto;">
                <!------------企业信息-------------->
                <fieldset class="info-main" style="display:block;max-height: 400px;overflow: auto;width: 270px;float:left;min-height:120px;">
                  <legend class="iframe-father">
                       <span style="color: #4e71f2;-webkit-tap-highlight-color: #4e71f2;font-size: 14px;font-weight: bold;">${AllData.panel_title_QyInfo}</span>
                  </legend>
                  <div style="margin: 15px 5px;display:none;">
<span style="font-size:16px;">序号</span>
<input  id="nn-qyId" name="nn-qyId" value="${qyInfo.id}" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
</div>
                  <div style="margin: 15px 5px;">
<span style="font-size:16px;">名称</span>
<input  id="nn-qyName" name="nn-qyName" value="${qyInfo.taxName}" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
</div>
                  <div style="margin: 15px 5px;">
<span style="font-size:16px;">税号</span>
<input  id="nn-qyAccount" name="nn-qyAccount" value="${qyInfo.taxNo}" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
</div>
<div style="margin: 15px 5px;">
<span style="font-size:16px;">密码</span>
<input  id="nn-qyPassword" name="nn-qyPassword" value="${qyInfo.password}" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
                  </div>
                  <div style="margin: 15px 5px;${editButtonState};">
<span style="font-size:16px;">热度</span>
<input  id="nn-qyHeat" name="nn-qyHeat" value="${qyInfo.heat}" type="text" style="margin:0 20px;width:174px;height:20px;border: 2px groove #ddd;-moz-border-radius: 3px;border-radius: 3px;"></input>
                  </div>
                  </fieldset>
                  </div>
                <!------------保存、取消按钮-------------->
                <div id="nn-footer">
                  <span id="nn-cancelQy" class="nn-Button" title="${ AllData.cancelName}">${ AllData.cancelName}</span>
                  <span id="nn-delQy" class="nn-Button" style="${editButtonState}" title="${ delButtonName}">${ delButtonName}</span>
                  <span id="nn-actQy" class="nn-Button nn-lightButton" title="${ mainButtonName}" style="float: right;">${ mainButtonName}</span>
                </div>
              </div>`;
          if (document.body !== null && document.querySelector("#nn-qyInfoPop") === null) {
            let Container = document.createElement('div');
            Container.id = "nn-qyInfoPop";
            Container.innerHTML =htmlContent;
            document.body.appendChild(Container);
          }else
          {
              let Container=document.querySelector("#nn-qyInfoPop");
              Container.innerHTML =htmlContent;
          }
        try {
                //addListListener();
            document.querySelector("#nn-actQy").addEventListener("click", function(e) {
                let id=document.querySelector("input[name='nn-qyId']").value
                let nm=document.querySelector("input[name='nn-qyName']").value
                let ac=document.querySelector("input[name='nn-qyAccount']").value
                let pw=document.querySelector("input[name='nn-qyPassword']").value
                let heat=document.querySelector("input[name='nn-qyHeat']").value
                if(ac!=""&&pw!=""&&nm!=""){
                    if(func=="add"){
                        return qyAdd(nm,ac,pw).then((rs)=>{
                            let userLocal = AllData.userInfo;
                            //把新增企业插入企业列表的头部
                            qyList(userLocal.GUID).then((rs)=>{LoadList().then((rs)=>{NNtoggleQyInfo();ShowList();NNtoggleList();})},(rj)=>alert(rj));
                        },(rj)=>{alert(rj);false;});
                }else{
                    return qyEdit(id,heat,nm,ac,pw).then((rs)=>{
                        let userLocal = AllData.userInfo;
                        qyList(userLocal.GUID).then((rs)=>{LoadList().then((rs)=>{NNtoggleQyInfo();ShowList();NNtoggleList();})},(rj)=>alert(rj));
                    },(rj)=>{alert(rj);false;});
                }
                }else{
                    alert("企业信息不全")
                }
            }, true);
            document.querySelector("#nn-delQy").addEventListener("click", function(e) {
                let id=document.querySelector("input[name='nn-qyId']").value
                return removeQy(id).then((rs)=>{LoadList().then((rs)=>{NNtoggleQyInfo();ShowList();NNtoggleList();})},(rj)=>alert(rj));
            }, true)
            document.querySelector("body .nn-qyInfoContent").addEventListener('click', function(e) {
              e.stopPropagation(); // 阻止点击自身的时候关闭
            }, false);
//               document.querySelector("body").addEventListener('click', function(e) {
//               safeFunction(() => {
//                 if (document.querySelector(".nn-qyInfoContent").style.display === 'flex') {
//               document.querySelector(".nn-qyInfoContent").style.display = 'none';
//             }
//               })
//             }, false);
            document.querySelector("#nn-cancelQy").addEventListener("click", function(e) {
                return NNtoggleQyInfo(e);
              }, true);
            } catch (e) {
              console.log(e);
            }
    }
    function NNtoggleList(e) {
        console.log("开关企业列表")
        if(e){
          e.stopPropagation();
        }
          // 显示？隐藏设置界面
          setTimeout(function() {
              if (document.body !== null && document.querySelector("#nn-container") === null) {
                  //弹出登录框
                  NNtoggleLogin()
              }else{
                  if (document.querySelector(".nn-mainContent").style.display === 'none') {
                      document.querySelector(".nn-mainContent").style.display = 'flex';
                  }else{
                      document.querySelector(".nn-mainContent").style.display = 'none'
                  }
              }
          }, 100);
        return false;
        }
    function NNtoggleLogin(e) {
          // 显示？隐藏设置界面
    console.log("开关登录框")
          setTimeout(function() {
                  if (document.querySelector(".nn-loginContent").style.display === 'none') {
                      document.querySelector(".nn-loginContent").style.display = 'flex';
                  }else{
                      document.querySelector(".nn-loginContent").style.display = 'none'
                  }
          }, 100);
        return false;
        }
    function NNtoggleQyInfo(e) {
          // 显示？隐藏设置界面
    console.log("开关企业信息框")
          setTimeout(function() {
                  if (document.querySelector(".nn-qyInfoContent").style.display === 'none') {
                      document.querySelector(".nn-qyInfoContent").style.display = 'flex';
                  }else{
                      document.querySelector(".nn-qyInfoContent").style.display = 'none'
                  }
          }, 100);
        return false;
        }
    function ShowPopWindow(arr,callback){
        let content="";
        if (document.body !== null && document.querySelector("#nn-container") === null) {
            let removeDom=document.querySelector(".nn-popWindow");
            if(removeDom!==null){
                removeDom.remove();
            }
            let Container = document.createElement('div');
            Container.id = "nn-popWindow";
            Container.innerHTML =
              `<div id="nn-popWindow">
                ${content}
              </div>`;
            try {
              //addlistenor
            } catch (e) {
              console.log(e);
            }
          }
    }
    function selectQy(e){
        let qyTaxNo="";
        let qyPassword="";
        let qyId="";
        let qyHeat="";
        if(e.target.tagName=="DIV"){
            qyTaxNo=e.target.getAttribute("qyTaxNo");
            qyPassword=e.target.getAttribute("qyPassword");
            qyId=e.target.getAttribute("qyId");
            qyHeat=e.target.getAttribute("qyHeat");
        }else{
            qyTaxNo=e.target.parentNode.getAttribute("qyTaxNo");
            qyPassword=e.target.parentNode.getAttribute("qyPassword");
            qyId=e.target.parentNode.getAttribute("qyId");
            qyHeat=e.target.parentNode.getAttribute("qyHeat");
        }
        document.querySelector("input[name='username']").value=qyTaxNo;
        document.querySelector("input[name='password']").value=qyPassword;
        qyEdit(qyId,parseInt(qyHeat)+1,"","","").then((rs)=>{
        let userLocal = AllData.userInfo;
        qyList(userLocal.GUID).then((rs)=>{LoadList().then((rs)=>{ShowList();})},(rj)=>alert(rj));
        },(rj)=>{alert(rj);false;})
    }
    //api
    var apiUrl="http://60.191.9.66:3500";
    //var apiUrl="http://198.198.198.179:233";
    function userLogin(ac,pw){
        console.log("userLogin")
        return new Promise((rs,rj)=>{
        GM_xmlhttpRequest({
            url:`${apiUrl}/api/NuoQyList/userLogin`,
            method :"POST",
            data:`{
"userAccount":"${ac}",
"userPassword":"${pw}"
}`,
            headers: {
                "Content-type": "application/json"
            },
            onload:function(xhr){
                let res = JSON.parse(xhr.responseText)
                if(res.StatusCode==200){
                rs(res.Data)}else{
                    rj(res.Info)
                }
            }
        })
            })
    }
    function qyList(guid){
        console.log("getQyList");
        return new Promise((rs,rj)=>{
            GM_xmlhttpRequest({
                url:apiUrl+"/api/NuoQyList/qyList",
                method :"POST",
                data:`{
"userGUID":"${guid}"
}`,
                headers: {
                    "Content-type": "application/json"
                },
                onload:function(xhr){
                    let res = JSON.parse(xhr.responseText)
                    if(res.StatusCode==200){
                    NNSetValue("qyList",res.Data)
                    AllData.qyList = res.Data
                    rs()}else{
                        rj(res.Info)
                    }
                }
            })
        });
    }
    function qyEdit(id,heat,taxName,taxNo,password){
        return new Promise((rs,rj)=>{
        GM_xmlhttpRequest({
        url:apiUrl+"/api/NuoQyList/qyEdit",
        method :"POST",
        data:`{
    "id":${id},
    "taxName": "${taxName}",
    "taxNo": "${taxNo}",
    "password":"${password}",
    "heat":${heat},
    "pUserGUID":"${AllData.userInfo.GUID}"
}`,
        headers: {
            "Content-type": "application/json"
        },
        onload:function(xhr){
            console.log("qyEdit")
            let res = JSON.parse(xhr.responseText)
            if(res.StatusCode==200){
            let dataTemp=AllData.qyList;
            console.log(AllData.qyList);
            dataTemp.forEach(function(e,i){
                if(e.id==id){
                    dataTemp.splice(i,1,res.Data);console.log("修改企业:"+e.taxName);return;
                }
            })
            console.log(dataTemp);
            NNSetValue("qyList",dataTemp)
            AllData.qyList = dataTemp
            rs()}else{
            rj(res.Info)
            }
        }
    });})
    }
    function qyAdd(taxName,taxNo,password){
        return new Promise((rs,rj)=>{
        GM_xmlhttpRequest({
        url:apiUrl+"/api/NuoQyList/qyAdd",
        method :"POST",
        data:`{
    "taxName": "${taxName}",
    "taxNo": "${taxNo}",
    "password":"${password}",
    "pUserGUID":"${AllData.userInfo.GUID}"
}`,
        headers: {
            "Content-type": "application/json"
        },
        onload:function(xhr){
            console.log("qyAdd")
            let res = JSON.parse(xhr.responseText)
            if(res.StatusCode==200){
            AllData.qyList.unshift(res.Data);
            NNSetValue("qyList",AllData.qyList);
            rs()}else{
                rj(res.Info)
            }
        }
    });
        })
    }
    function removeQy(id){
        return new Promise((rs,rj)=>{
        GM_xmlhttpRequest({
        url:apiUrl+"/api/NuoQyList/qyDelete",
        method :"POST",
        data:`{
    "id": "${id}",
    "pUserGUID":"${AllData.userInfo.GUID}"
}`,
        headers: {
            "Content-type": "application/json"
        },
        onload:function(xhr){
            console.log("removeQy")
            let res = JSON.parse(xhr.responseText)
            if(res.StatusCode==200){
            let dataTemp=AllData.qyList;
            dataTemp.forEach(function(e,i){
                if(e.id==id){
                    dataTemp.splice(i,1);console.log("删除企业:"+e.taxName);return;
                }
            })
            AllData.qyList=dataTemp;
            NNSetValue("qyList",AllData.qyList);
                rs()}else{
                rj(res.Info)
                }
        }
    });
        })
    }
    function safeFunction(func, failCb) {
    try {
      func();
    } catch (e) {
      failCb && failCb()
    }
  }
    function userLogOff(){//用户注销(清除用户数据)
        AllData.userInfo={}
        AllData.qyList=[]
        NNSetValue("userInfo",{})
        NNSetValue("qyList",[])
        location.reload();
    }
    //存储操作
    function NNSetValue(key, value) {
      GM.setValue(key, value);
//       if(key === 'userInfo'){
//         if (value) localStorage.NNUserInfo = value;
//       }
//         if(key === 'qyList'){
//         if (value) localStorage.NNQyList = value;
//       }
    }
    //脚本配置
    //GM_registerMenuCommand('脚本重置 - 修复脚本', function() {
    //  GM_setValue('Config', '{}');
    //  localStorage.setItem('NNConfig', '{}');
    //  location.reload();
    //});
    //样式
    function RAFInterval(callback, period = 50, runNow = false) {
        var shouldFinish = false
        var int_id = null
        if(runNow) {
          shouldFinish = callback()
          if (shouldFinish) return
        }
        int_id = setInterval(() => {
          shouldFinish = callback()
          shouldFinish && clearInterval(int_id)
        }, period)
      }
    function NN_addStyle(css, className, addToTarget, isReload = false, initType = "text/css") { // 添加CSS代码，不考虑文本载入时间，只执行一次-无论成功与否，带有className
        RAFInterval(async () => {
            let addTo = document.querySelector(addToTarget);
            if (typeof (addToTarget) === "undefined"){
            addTo = (document.head || document.body || document.documentElement);
            }
            let cssNode = document.createElement("style");
            if (className != null) cssNode.className = className;

            cssNode.setAttribute("type", initType);
            cssNode.appendChild(document.createTextNode(css))

            try {
              addTo.appendChild(cssNode);
            } catch (e) {
              console.log(e.message);
            }
            return true;
        }, 20, true);
      }
    /*"自定义"按钮效果*/
    NN_addStyle(`.myList .myListButton{display:inline-block;line-height:1.5;background:#FB7617;color:#fff;font-weight:700;font-size:14px;
          text-align:center;padding:6px;border:2px solid #E5E5E5;border-radius: 6px;position: absolute;top: 0.8rem;}
          .myList .myListButton:hover{background:#FB7617 !important;color:#fff;cursor:pointer;border:2px solid #ffb17a;}`,
            "myListButton");
    /*"自定义"列表效果*/
    NN_addStyle(`#nn-container,#nn-loginPop,#nn-qyInfoPop{position: fixed;top: 4.5vw;right: 0;width:100%;}"`);
    NN_addStyle(`.nn-content{
    flex-direction:column;
    padding: 0;
    width: 92rem;
    margin: 0 auto;
    -moz-border-radius: 3px;
    border-radius: 3px;
    /*border: 1px solid #A0A0A0;*/
    -webkit-box-shadow: -2px 2px 5px rgb(0 0 0 / 30%);
    -moz-box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
    box-shadow: -2px 2px 5px rgb(0 0 0 / 30%);}"`);
    NN_addStyle(`.nn-loginContent{
    width: 22%;
    background-color:#fff;
    }`)
    NN_addStyle(`.nn-qyInfoContent{
    width: 22%;
    background-color:#fff;
    }`)
    NN_addStyle(`.nn-content>div{
    display:flex;
    padding: 5px;
    border: 1px solid white;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #F2F2F7;
    background: -moz-linear-gradient(top,#FCFCFC,#F2F2F7 100%);
    background: -webkit-gradient(linear,0 0,0 100%,from(#FCFCFC),to(#F2F2F7));}"`);
    NN_addStyle(`.nn-main fieldset{
    border: 2px groove #ddd;
    -moz-border-radius: 3px;
    border-radius: 3px;
    padding: 4px 9px 6px 9px;
    margin: 2px;
    display: block;
    width: auto;
    height: auto;`);
    NN_addStyle(`.nn-qyListRecommend{flex:1;}`);
    NN_addStyle(`.nn-qyList{flex:3;}`);
    NN_addStyle(`.nn-Button{
    background-color: #fff;
    height: 24px;
    width: 48px;
    margin:5px;
    line-height: 24px;
    border-radius: 6px;
    display: inline-block;
    text-align: center;
    margin-top: 18px;
    border: #aaa solid 1px;
    cursor:pointer;`);
    NN_addStyle(`.nn-lightButton{
    color: #fff;
    background-color: #4e71f2;`);
    NN_addStyle(`.list-main tr{
    font-size:14px;`);
    NN_addStyle(`.list-main td{
    width:23.2em;`);
    NN_addStyle(`.list-main td .qyInfo{
    width:15rem;
    box-shadow: 0px 0px 5px 2px rgb(0 0 0 / 15%);
    -webkit-box-shadow: 0px 0px 5px 2px rgb(0 0 0 / 15%);
    padding: 6px;
    margin: 7px;
    display:inline-block;
    white-space: nowrap;
    overflow:hidden;
    cursor:pointer;`);
    NN_addStyle(`.list-main td .qyInfo:hover span{
    white-space: normal;
    word-break: break-all;
    color: #fff;`);
    NN_addStyle(`.list-main td .qyInfo:hover{
    background-color: #4e71f2;
    `);
    NN_addStyle(`.list-main td .qyEdit:hover{
    background-color: #4e71f2;
    `);
    NN_addStyle(`.list-main td .qyEdit:hover svg{
    fill: #fff;
    `);
    NN_addStyle(`.list-main td .qyEdit{
    width:20px;
    box-shadow: 0px 0px 5px 2px rgb(0 0 0 / 15%);
    -webkit-box-shadow: 0px 0px 5px 2px rgb(0 0 0 / 15%);
    padding: 3px;
    margin: 7px;
    display:inline-block;
    white-space: nowrap;
    overflow:hidden;
    cursor:pointer;`);
    //NN_addStyle(`.list-main{position:absolute;}"`);
}();


