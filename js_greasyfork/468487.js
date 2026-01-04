// ==UserScript==
// @name         星图达人画像
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  星图扩展工具
// @author       siji-Xian
// @match        *://www.xingtu.cn/ad/creator/market
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/468487/%E6%98%9F%E5%9B%BE%E8%BE%BE%E4%BA%BA%E7%94%BB%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468487/%E6%98%9F%E5%9B%BE%E8%BE%BE%E4%BA%BA%E7%94%BB%E5%83%8F.meta.js
// ==/UserScript==

(function () {
  "use strict"; 
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出画像";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "white",
    background: "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
    borderRadius: "34px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 20px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick);

  function appendDoc() {
    const likeComment = document.querySelector(".operations");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  //message.js
  let loadingMsg = null;

  //目标数据
  let target_data_param = null;

  (function listen() {
    var origin = {
      open: XMLHttpRequest.prototype.open,
      send: XMLHttpRequest.prototype.send,
    };
    XMLHttpRequest.prototype.open = function (a, b) {
      this.addEventListener("load", replaceFn);
      origin.open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (a, b) {
      origin.send.apply(this, arguments); 
    };
    function replaceFn(obj) {
      if (
        this?._url?.slice(0, 40) == "/gw/api/gsearch/search_for_author_square"
      ) {
        target_data_param = JSON.parse(this._data);
      }
    }
  })();

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }
   //获取aadvid
   const aadvid = getQueryVariable("aadvid");


  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  async function fetchFun(url, data, requestOptions = getRequestOptions) {  
    const params = new URLSearchParams(data).toString();  
    try {  
      const response = await fetch(`${url}?${params}`, requestOptions);  
      if (response.ok) {  
        let result;  
        try {  
          result = await response.json();  
        } catch (error) {  
          throw new Error(`响应不能被解析为JSON: ${error.message}`);  
        }  
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

  async function getProportion(num,all) {
    let allNum = all.reduce((a, b) => {
      return +a + +b?.distribution_value;
    }, 0);

    return num/allNum
  }

  //获取达人列表
  async function task_list(page) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let {startPage, endPage} = page
    let data = [];
    var myHeaders = new Headers();
    myHeaders.append("authority", "www.xingtu.cn");
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
    myHeaders.append("agw-js-conv", "str");
    myHeaders.append("content-type", "application/json");
    const postRequestOptions = {
      method: "POST",
      body: '',
      headers: myHeaders,
      redirect: "follow",
    };
    for (let i = startPage; i <= endPage; i++) {
      target_data_param.page_param.page = i;
      postRequestOptions.body = JSON.stringify(target_data_param)
      const targetPromise = await fetchFun(
        "https://www.xingtu.cn/gw/api/gsearch/search_for_author_square",
        {},
        postRequestOptions
      );
      data.push(targetPromise.authors)
    }
    let dataList = data.flat()
    let portraitData = [];
    for (let i = 0; i < dataList.length; i++) {
      let data = {
        o_author_id: dataList[i].attribute_datas.id.toString(),
        platform_source:1,
        author_type:1
      }
      let data2 = {
        o_author_id: dataList[i].attribute_datas.id.toString(),
        platform_source:1,
        platform_channel:1,
        industry_id:0
      }
      const targetPromise = await fetchFun(
        "https://www.xingtu.cn/gw/api/data_sp/get_author_fans_distribution",
        data
      );
      const targetPromise2 = await fetchFun(
        "https://www.xingtu.cn/gw/api/data_sp/check_author_display",
        data2
      )
      const targetPromise3 = await fetchFun(
        "https://www.xingtu.cn/gw/api/data_sp/author_link_struct",
        data2
      )

      portraitData.push({key:dataList[i].attribute_datas.nick_name,value:new Map(targetPromise.distributions.map(v =>[v.type_display,v])),value2:targetPromise2,value3:targetPromise3.link_struct})
    }

    let expData = await Promise.all(
      portraitData.map(async v=>{
        let city_level_data = v.value.get("城市等级分布")
        let age = v.value.get("年龄分布")
        let phone = v.value.get("设备品牌分布")
        let ecom_big8_audience = v.value.get("八大人群分布")
        let sex = v.value.get("性别分布")

        let city_level_data_list = new Map(city_level_data.distribution_list.map(v =>[v.distribution_key,v.distribution_value])) 
        let age_list = new Map(age.distribution_list.map(v =>[v.distribution_key,v.distribution_value])) 
        let phone_list = new Map(phone.distribution_list.map(v =>[v.distribution_key,v.distribution_value])) 
        let ecom_big8_audience_list = new Map(ecom_big8_audience.distribution_list.map(v =>[v.distribution_key,v.distribution_value])) 
        let sex_list = new Map(sex.distribution_list.map(v =>[v.distribution_key,v.distribution_value])) 

        let yuntu_city_level1_proportion = await getProportion(city_level_data_list.get('一线'),city_level_data.distribution_list)
        let yuntu_city_level2_proportion = await getProportion(city_level_data_list.get('二线'),city_level_data.distribution_list)
        let age24_30_proportion = await getProportion(age_list.get('24-30'),age.distribution_list)
        let age31_40_proportion = await getProportion(age_list.get('31-40'),age.distribution_list)
        let iphone = await getProportion(phone_list.get("iPhone"),phone.distribution_list)
        let ecom_big8_audience_1_proportion = await getProportion(ecom_big8_audience_list.get('新锐白领'),ecom_big8_audience.distribution_list)
        let ecom_big8_audience_2_proportion = await getProportion(ecom_big8_audience_list.get('精致妈妈'),ecom_big8_audience.distribution_list)
        let ecom_big8_audience_3_proportion = await getProportion(ecom_big8_audience_list.get('资深中产'),ecom_big8_audience.distribution_list)
        let ecom_big8_audience_4_proportion = await getProportion(ecom_big8_audience_list.get('小镇青年'),ecom_big8_audience.distribution_list)
        let ecom_big8_audience_5_proportion = await getProportion(ecom_big8_audience_list.get('Z世代'),ecom_big8_audience.distribution_list)
        let female = await getProportion(sex_list.get('female'),sex.distribution_list)
        let link_cnt = v.value2.link_cnt
        let follower = v.value2.follower
        let profundityUser = v.value2.link_cnt? v?.value3[5]?.value - v?.value3[1]?.value : 0

        return {
          name: v.key,
          yuntu_city_level1_proportion,
          yuntu_city_level2_proportion,
          age24_30_proportion,
          age31_40_proportion,
          iphone,
          ecom_big8_audience_1_proportion,
          ecom_big8_audience_2_proportion,
          ecom_big8_audience_3_proportion,
          ecom_big8_audience_4_proportion,
          ecom_big8_audience_5_proportion,
          female,
          link_cnt,
          follower,
          profundityUser
        }
      })
    )

    expExcel(expData)
  }

  function expExcel(e) {

    let contrast = {
      name: "name",
      一线城市占比: "yuntu_city_level1_proportion",
      二线城市占比: "yuntu_city_level2_proportion",
      '24-30': "age24_30_proportion",
      '31-40': "age31_40_proportion",
      iphone: "iphone",
      新锐白领: "ecom_big8_audience_1_proportion",
      精致妈妈: "ecom_big8_audience_2_proportion",
      资深中产: "ecom_big8_audience_3_proportion",
      小镇青年: "ecom_big8_audience_4_proportion",
      Z世代: "ecom_big8_audience_5_proportion",
      女性占比: "female",
      月连接用户数: "link_cnt",
      粉丝数:"follower",
      月深度用户数:"profundityUser"
    };
    

    let option = {};
    option.fileName = `达人画像`; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    try {
        let res = prompt("页码，例: 1,2 （起始页和结束页中间用英文逗号分隔）");
        if (res) {
          let [startPage, endPage] = res.split(",");
          startPage = parseInt(startPage);
          endPage = parseInt(endPage);
          if (isNaN(startPage) || isNaN(endPage) || endPage < startPage) {
            throw new Error("页码格式错误！");
          }
          task_list({ startPage, endPage });
        }
      } catch (err) {
        Qmsg.error(err.message);
      }
  }
})();
