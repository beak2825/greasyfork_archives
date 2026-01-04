// ==UserScript==
// @name         星图达人批量建联(达人广场)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  星图扩展工具
// @author       siji-Xian
// @match        *://www.xingtu.cn/ad/creator/market
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.co
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      *
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/504740/%E6%98%9F%E5%9B%BE%E8%BE%BE%E4%BA%BA%E6%89%B9%E9%87%8F%E5%BB%BA%E8%81%94%28%E8%BE%BE%E4%BA%BA%E5%B9%BF%E5%9C%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504740/%E6%98%9F%E5%9B%BE%E8%BE%BE%E4%BA%BA%E6%89%B9%E9%87%8F%E5%BB%BA%E8%81%94%28%E8%BE%BE%E4%BA%BA%E5%B9%BF%E5%9C%BA%29.meta.js
// ==/UserScript==


(function () {
  "use strict";
  GM_addStyle(`
    .qmsg.qmsg-wrapper{position:fixed;top:20px;left:0;z-index:1010;width:100%;pointer-events:none;color:rgba(0,0,0,0.55);font-size:13px;font-variant:tabular-nums;font-feature-settings:"tnum"}.qmsg .qmsg-item{padding:8px;text-align:center;animation-duration:.3s}.qmsg .qmsg-item .qmsg-content{text-align:left;position:relative;display:inline-block;padding:10px 12px;background:#fff;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);pointer-events:all;max-width:80%;min-width:80px}.qmsg .qmsg-item .qmsg-content [class^=qmsg-content-]{display:flex;align-items:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qmsg .qmsg-item .qmsg-content [class^=qmsg-content-] .qmsg-icon{display:inline-block;height:16px}.qmsg .qmsg-item .qmsg-content [class^=qmsg-content-] .qmsg-icon:first-child{margin-right:8px}.qmsg .qmsg-item .qmsg-content [class^=qmsg-content-] .qmsg-icon-close{cursor:pointer;color:rgba(0,0,0,0.45);transition:color .3s;margin-left:6px}.qmsg .qmsg-item .qmsg-content [class^=qmsg-content-] .qmsg-icon-close:hover>svg path{stroke:#555}.qmsg .qmsg-item .qmsg-content [class^=qmsg-content-] .qmsg-count{display:inline-block;position:absolute;left:-8px;top:-8px;color:#fff;font-size:12px;text-align:center;height:16px;line-height:16px;border-radius:3px;min-width:16px;animation-duration:.3s}.qmsg .qmsg-item .qmsg-content-info{color:#909399}.qmsg .qmsg-item .qmsg-content-info .qmsg-count{background-color:#909399}.qmsg .qmsg-item .qmsg-content-warning{color:#e6a23c}.qmsg .qmsg-item .qmsg-content-warning .qmsg-count{background-color:#e6a23c}.qmsg .qmsg-item .qmsg-content-error{color:#f56c6c}.qmsg .qmsg-item .qmsg-content-error .qmsg-count{background-color:#f56c6c}.qmsg .qmsg-item .qmsg-content-success{color:#67c23a}.qmsg .qmsg-item .qmsg-content-success .qmsg-count{background-color:#67c23a}.qmsg .qmsg-item .qmsg-content-loading{color:#409eff}.qmsg .qmsg-item .qmsg-content-loading .qmsg-count{background-color:#409eff}.qmsg .animate-turn{animation:MessageTurn 1s linear infinite}@keyframes MessageTurn{0%{transform:rotate(0deg)}25%{transform:rotate(90deg)}50%{transform:rotate(180deg)}75%{transform:rotate(270deg)}100%{transform:rotate(360deg)}}@keyframes MessageMoveOut{0%{max-height:150px;padding:8px;opacity:1}to{max-height:0;padding:0;opacity:0}}@keyframes MessageMoveIn{0%{transform:translateY(-100%);transform-origin:0 0;opacity:0}to{transform:translateY(0);transform-origin:0 0;opacity:1}}@keyframes MessageShake{0%,100%{transform:translateX(0px);opacity:1}25%,75%{transform:translateX(-4px);opacity:.75}50%{transform:translateX(4px);opacity:.25}}
    .bg_btn{
      display: inline-block;
      padding: 0 10px;
      height: 28px;
      line-height: 28px;
      border-radius: 3px;
      background-color: #0b91cf;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      margin-left: 15px;
    }
    .bg_icon{
        margin-left: 5px;
        cursor: pointer;
    }
    .bg_icon:hover ~ .bg_tip{
        opacity: 1;
    }
    .bg_tip{
      opacity: 0; 
      position: absolute;
      line-height: 28px;
      width: 280px;
      padding: 0 10px;
      background-color: #fff;
      border-radius: 3px;
      border: 1px solid #ddd;
      right: 160px;
      transition: all 0.3s;
    }
    `)
  // 网络请求
  async function fetchFun(url, requestOptions) {
    try {
      const response = await fetch(`${url}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Fetch failed: ${response.status}`);
      }
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000
      });
      throw error;
    }
  }

  // 跨域网络请求
  const request = function(mothed, url, param){  
    console.log(mothed, url, param);
    return new Promise(function(resolve, reject){
      //使用GM.xmlHttpRequest将数据提交到后端服务器
      GM.xmlHttpRequest({
        method: mothed,
        url: url,
        data: JSON.stringify(param),
        headers: {
          "Content-Type": "application/json",
        },
        onload: function (response) {
          let res = JSON.parse(response.responseText);
          if (res?.code == 990 || res?.code == "990") {
            loadingMsg.close();
            Qmsg.success('自动建联成功，请前往核力星推查看建联状态～');
            resolve(res);
          }else{
            loadingMsg.close();
            Qmsg.error(res?.msg);
            reject(res);
          }
        },
        onerror: function (response) {
          reject(response.status);
        },
      });
    })
  };

  // 弹窗组件
  function inlyModelComponent_login(){
    let _this = this
    this.loadingMsg = null;
    //展示弹窗
    this.showModel = () =>{
      $("#inly_model").css({display:'block'})
      setTimeout(() => {
        $("#inly_model").css({opacity:1})
      }, 0);
    }

    //关闭弹窗
    this.closeModel = function(){
      $("#inly_model").css({opacity:0})
      setTimeout(() => {
        document.getElementById('inly_model').style.display = 'none'
      }, 500);
    }

    //原生阻止冒泡
    this.stopPropagation= function(e){
      e = e|| window.event;
      if (e.stopPropagation) {
        e.stopPropagation()
      } else {
        e.cancelBubble = true
      }
    };

    const htmlModel = `
    <div style="transition: opacity .5s; opacity: 0; position:absolute;top: 0;left: 0;width: 100vw;height: 100vh;background-color:rgba(0,0,0,0.2);z-index: 888;display: 
    none;" id="inly_model">
      <div id="inly_box" style="position:absolute;top:50%;left: 50%;transform: translate(-50%, -100%);height: 200px;width: 350px;background-color: #fff;border-radius: 10px;display: flex;justify-content: center;align-items: center;">
        <div style="position: absolute;left: 10px;top: 10px;font-size: 14px;">请输入验证码</div>
          <form action="" method="post" id="form1" style="width: 70%;" >
            <p style="margin: 30px 0;font-size: 14px;">验证码: <input type="text" name="name" style="background-color: rgba(255,255,255,0.2);border:0px;border-bottom: 1px solid #999;"/></p>
            <button id='inly_submit' style="border: 0px; background-color:#0087c8;color: #fff;height: 28px;width: 50px; border-radius: 5px;">验证</button>
          </form>
      </div>
    </div>
    `
    //添加弹窗到body节点
    $("body").append(htmlModel);

    //点击空白处关闭弹窗
    $("#inly_model").click(function(event){
      _this.closeModel()
      _this.stopPropagation()
      return false;
    });

    //阻止冒泡
    $("#inly_box").click(function(event){
      _this.stopPropagation()
      return false;
    });
    //登录按钮事件
    $("#inly_submit").click(function(e){ 
      var name_1=$("input[name='name']").val();   //获取
      openReq(name_1);
      _this.closeModel()
      _this.stopPropagation()
      return false; 
    })
  }
  
  //初始化弹窗组件
  const inly_login = new inlyModelComponent_login();

  //message.js
  let loadingMsg = null;

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "批量自动建联"; //按钮内容
  button.className = 'bg_btn';
  button.addEventListener("click", urlClick); //监听按钮点击事件

  var icon = document.createElement("div"); //创建一个icon
  icon.className = 'bg_icon';
  icon.innerHTML = `<svg t="1724125161755" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5099" width="14" height="14"><path d="M514.048 54.272q95.232 0 178.688 36.352t145.92 98.304 98.304 145.408 35.84 178.688-35.84 178.176-98.304 145.408-145.92 98.304-178.688 35.84-178.176-35.84-145.408-98.304-98.304-145.408-35.84-178.176 35.84-178.688 98.304-145.408 145.408-98.304 178.176-36.352zM515.072 826.368q26.624 0 44.544-17.92t17.92-43.52q0-26.624-17.92-44.544t-44.544-17.92-44.544 17.92-17.92 44.544q0 25.6 17.92 43.52t44.544 17.92zM567.296 574.464q-1.024-16.384 20.48-34.816t48.128-40.96 49.152-50.688 24.576-65.024q2.048-39.936-8.192-74.752t-33.792-59.904-60.928-39.936-87.552-14.848q-62.464 0-103.936 22.016t-67.072 53.248-35.84 64.512-9.216 55.808q1.024 26.624 16.896 38.912t34.304 12.8 33.792-10.24 15.36-31.232q0-12.288 7.68-30.208t20.992-34.304 32.256-27.648 42.496-11.264q46.08 0 73.728 23.04t25.6 57.856q0 17.408-10.24 32.256t-26.112 28.672-33.792 27.648-33.792 28.672-26.624 32.256-11.776 37.888l1.024 38.912q0 15.36 14.336 29.184t37.888 14.848q23.552-1.024 37.376-15.36t12.8-32.768l0-24.576z" p-id="5100"></path></svg>`

  var text = document.createElement("div"); //创建一段文字
  text.textContent = "点击批量建联后，自动添加达人微信，添加结果请在核力星推中的业务管理>达人建联中查看。"
  text.className = 'bg_tip';

  function appendDoc() {
    const likeComment = document.querySelector(".operations");
    if (likeComment) {
      likeComment.append(button); //把按钮加入到 x 的子节点中
      likeComment.append(icon); //把按钮加入到 x 的子节点中
      likeComment.append(text); //把按钮加入到 x 的子节点中
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  let target_data = null;
  let user_data = null;
  

  function listen() {
    var origin = {
      open: XMLHttpRequest.prototype.open,
      send: XMLHttpRequest.prototype.send
    }
    XMLHttpRequest.prototype.open = function(a, b) {
      this.addEventListener('load', replaceFn)
      origin.open.apply(this, arguments)
    }
    XMLHttpRequest.prototype.send = function(a, b) {
      origin.send.apply(this, arguments)
    }
    function replaceFn(obj) {
      if (
        this?._url?.slice(0, 40) ==
        "/gw/api/gsearch/search_for_author_square"
      ) {
        let data = JSON.parse(obj?.target?._data);
        let res = JSON.parse(obj?.target?.response);
        let headers = this._reqHeaders;
        target_data = { data, res ,headers};
      }
      
    }
  }
  listen()


  //获取达人数据
  async function getData(e) {
    // 获取总记录数
    const totalCount = e.res.pagination.total_count;
   
    const limit = 20; // 每页请求20条数据
    let page = 1; // 从第一页开始
    const target_data = { data: { result: [] } };
  
    // 请求参数
    const baseParams = e.data;
  
    // 发送请求并获取数据
    while ((page - 1) * limit < totalCount) {
      try {
        // 更新请求参数中的 page
        baseParams.page_param.page = page;
  
        // 发送请求
        const raw = JSON.stringify(baseParams);
        const postRequestOptions = {
          method: "POST",
          headers: e.headers,
          redirect: "follow",
        };
        const result = await fetchFun(
          "https://www.xingtu.cn/gw/api/gsearch/search_for_author_square",
          {
            ...postRequestOptions,
            body: raw,
          }
        );
  
        // 处理请求结果
        if (result) {
          target_data.data.result.push(...result.authors);
        }
  
        // 增加页码
        page += 1;
  
        // 等待2秒
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`请求失败: ${error.message}`);
        break; // 遇到错误时终止请求
      }
    }
    let data = target_data.data.result.map((item) => {
      return {
        kol_name: item.attribute_datas.nick_name,
        platform_uid: item.attribute_datas.id,
      }
    });
    return data;
  }

  // 输入密钥
  async function urlClick() {
    if (target_data) {
      const totalCount = target_data.res.pagination.total_count;
    // 大于500条数据时，提示用户
      if (totalCount > 500) {
        Qmsg.warning("筛选后达人数量不得超过500！");
        return;
      }
      inly_login.showModel()
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请刷新页面重试！");
    }
  }

  // 发送请求
  async function openReq(key){
    // 获取用户信息
    let account_id = document.querySelector(".copy-text").childNodes[0].textContent;
    let account_name = document.querySelector(".navigator-user__nickname.text-ellipsis").innerHTML;
    console.log(account_id,account_name);

    loadingMsg = Qmsg.loading("正在采集达人数据，请勿操作！");
    console.log(key);
    let kols = await getData(target_data);
    let param = {
      kols,
      verification:key,
      account_id,
      account_name,
    }
    let res = await request('POST',"http://gitlab.yinlimedia.com:8970/admin/xingtu/kol_batch_link_info/batch_save",param)
    console.log(res);
  }
})();
