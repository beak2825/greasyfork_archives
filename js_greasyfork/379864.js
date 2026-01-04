// ==UserScript==
// @name         去哪儿获取价格
// @namespace  https://greasyfork.org/zh-CN/users/104201
// @version      1.1
// @description  根据去哪儿返回的价格 JSON 数据整理出价格表  qunarGetPrice.js
// @author       黄盐
// @include      *://*.package.qunar.com/api/duplicateProduct/teamPrice.json?pId=*
// @include      *://*.package.qunar.com/user/detail.jsp?*id=*
// @include      *://*.package.qunar.com/dsp/zamplus/recommend.json?pid=110
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require       https://cdn.bootcss.com/vue/2.6.6/vue.js
// @downloadURL https://update.greasyfork.org/scripts/379864/%E5%8E%BB%E5%93%AA%E5%84%BF%E8%8E%B7%E5%8F%96%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/379864/%E5%8E%BB%E5%93%AA%E5%84%BF%E8%8E%B7%E5%8F%96%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;
//这个后面考虑添加一个输入框，输入日历模式产品的ID，就可以获取产品的价格
(function() {
  // 获取套餐名称和ID
  if(location.href.indexOf("user/detail.jsp?") > -1){
    // 用单独的div把套餐ID和套餐名称显示出来
    function addDiv(){
      var tcDiv = document.createElement('DIV');
      tcDiv.id = "tcDiv";
      tcDiv.style.cssText = `font-size:1.5em; font-family:"微软雅黑";position:fixed;top:0px;right:100px;background:white;z-index:9999;padding:15px;border:1px dashed gray;border-radius:10px;`;
      document.body.appendChild(tcDiv);
      var innerHTML = "<span style='font-size:2em; cursor:pointer; background:#ff222290; padding:3px;border-radius:5px;' onclick='this.parentElement.parentElement.removeChild(this.parentElement);''>×</span><br />";
      document.querySelectorAll("a.pack.js-taocan-item,a.more-pack").forEach(v=>{
        innerHTML +=`<span>${v.dataset.subid}     ${v.textContent.replace(/\s/g, "")}</span><br />`;
      });
      tcDiv.innerHTML = innerHTML;
    }
    GM_registerMenuCommand("套餐ID", addDiv, "a");
  }
  // 在 *://*.package.qunar.com/dsp/zamplus/recommend.json?pid=110 页面构建列表
  else if(location.href.indexOf("dsp/zamplus/recommend.json") > -1){
    const CSS = `
      button{border: 1px dotted orange; border-radius: 5px; margin: 1px; cursor: pointer;}
      li{list-style: none;}
      a{ text-decoration: none; color: orange; }
      a:hover{ color:yellowgreen; }
      button:hover{ background: yellowgreen; }
      fieldset { border: 1px solid #aaa; border-radius: 10px; padding: 2px; }
      fieldset>span>span{white-space: nowrap;}
      #linkDiv{ height: 200px; overflow: auto; }
      /*需要对价的产品按钮颜色标记出来*/
      /*"企鹅": */
       /*Hi目*/button[title="2970305265"],
       /*途牛*/button[title="1379746"],
       /*要出发*/button[title="1119951236"],
       /*自由行*/button[title="4090036039"],
       /*欢乐*/button[title="1909440043"],
       /*新视界*/button[title="2668328679"],
      /*"马戏": */
       /*Hi目*/button[title="2417300128"],
       /*途牛*/button[title="1280506006"],
       /*要出发*/button[title="2263339879"],
       /*自由行*/button[title="3358297818"],
       /*欢乐*/button[title="3601933456"],
       /*新视界*/button[title="3012046747"],
      /*"横琴": */
       /*Hi目*/button[title="1440738262"],
       /*途牛*/button[title="603200908"],
       /*要出发*/button[title="1086674270"],
       /*自由行*/button[title="471775043"],
       /*欢乐*/button[title="100312527"],
       /*新视界*/button[title="1706491351"],
      /*"迎海": */
        /*// 没有欢乐*/
       /*Hi目*/button[title="1759183252"],
       /*途牛*/button[title="1934518466"],
       /*要出发*/button[title="1226965570"],
       /*自由行*/button[title="782636163"],
       /*新视界*/button[title="2638123252"],
      /*"长隆": */
       /*Hi目*/button[title="2797668378"],
       /*途牛*/button[title="3628531124"],
       /*要出发*/button[title="3784912780"],
       /*自由行*/button[title="3837441410"],
       /*欢乐*/button[title="758130578"],
       /*新视界*/button[title="2821768354"],
      /*"熊猫": */
        /*// 没有熊猫的套餐*/
       /*Hi目*/button[title="1968959658"],
       /*途牛*/button[title="386490342"],
       /*要出发*/button[title="2806460147"],
       /*自由行*/button[title="1964230841"],
       /*欢乐*/button[title="1545438080"],
       /*新视界*/button[title="1833781186"],
      /*"香江": */
        /*// 没有特价自由行的套餐，没有欢乐*/
       /*Hi目*/button[title="1143145654"],
       /*途牛*/button[title="3438472615"],
       /*要出发*/button[title="2453196364"],
       /*新视界*/button[title="610579135"]
       {background: #3879D990;}`;
    const bodyHtml = `
      <div id="qunarPrice">
        <div id="linkDiv">
          <fieldset v-for="spu,spuName in spuJson">
            <legend>{{spuName}}</legend>
            <span v-for="hotelArr,hotelName in spu">
              <b>{{hotelName}}</b>
              <span v-for="hArr in hotelArr" v-if="!hArr[2]">
                <button :title="hArr[0]" @click="upadatePricePage">{{hArr[1]}}</button><a :href="pageLink(hArr[0])" target="_blank">▶</a>
              </span>
            </span>
          </fieldset>
        </div>
        <h3 id="hotel">{{currentSPU}}</h3>
      <iframe id="priceJson" :src="pricePage" frameborder="0" style="width: 100%; height: 350px;"></iframe>
      </div>`;
    const SPU = {
      // [产品ID, 晚数, 是1否0下线]
      "Hi目": {
         "企鹅": [
           [2970305265, "1晚2晚", 0],
           [1272220433, "1晚2晚", 0],
           [2069545896, "2大1小1晚2晚", 0],
           [2820010062, "美食套餐", 0],
           [139401309, "美食套餐2", 0],
           [698016390, "1晚探险房", 0],
         ],
         "横琴": [
           [1440738262, "1晚2晚", 0],
           [4083351114, "2大1小1晚2晚", 0],
           [1389834760, "1晚", 0],
           [3563120989, "1晚美食套餐", 0],
         ],
         "马戏": [
           [2417300128, "1晚2晚", 0],
           [3593415727, "1晚美食套餐", 0],
           [2716675874, "2大1小1晚2晚", 0],
           [72165621, "2晚", 0],
           [4143490597, "美食套餐", 0],
         ],
         "迎海": [
           [1759183252, "1晚2晚", 0]
         ],
         "长隆": [
           [2797668378, "1晚2晚", 0]
         ],
         "熊猫": [
           [1968959658, "1晚2晚", 0],
           [2085541947, "2人1晚2晚", 0]
         ],
         "香江": [
           [1143145654, "1晚2晚", 0]
         ]
      },
      "途牛": {
        "企鹅": [[1379746, "1晚", 0], [650769909, "2晚", 0]],
        "横琴": [[603200908, "1晚", 0], [3888795721, "2晚", 0]],
        "马戏": [[1280506006, "1晚", 0], [3046869694, "2晚", 0]],
        "迎海": [[1934518466, "1晚", 0], [57695038, "2晚", 0]],
        "长隆": [[3628531124, "1晚", 0], [1026906401, "2晚", 0]],
        "熊猫": [[386490342, "1晚", 0], [4176140715, "2晚", 0]],
        "香江": [[3438472615, "1晚", 0], [3586934066, "2晚", 0]]
      },
      "特价自由行": {
        "企鹅": [[4090036039, "1晚", 0], [1359365711, "2晚", 0]],
        "横琴": [[471775043, "1晚", 0], [2794492517, "2晚", 0]],
        "马戏": [[3358297818, "1晚", 0], [1457136397, "2晚", 0]],
        "迎海": [[782636163, "1晚", 0], [2665937927, "2晚", 0]],
        "长隆": [[3837441410, "1晚", 0], [3100022445, "2晚", 0]],
        "熊猫": [[1964230841, "1晚", 0], [2593287534, "2晚", 0]],
        "香江": [[3794356819, "1晚", 0], [1952061896, "2晚", 0]],
        "珠海": [[1728435933, "2大1小亲子套餐集合", 0]],
      },
      "欢乐": {
        "企鹅": [[1909440043, "1晚", 0]],
        "横琴": [[100312527, "1晚", 0]],
        "马戏": [[3601933456, "1晚", 0]],
        "迎海": [[2553097, "1晚", 0]],
        "长隆": [[758130578, "1晚", 0]],
        "熊猫": [[1545438080, "1晚", 0]]
      },
      "新视界(生意人)": {
        "企鹅": [[2668328679, "1晚", 0], [3374653192, "2晚", 0]],
        "横琴": [[1706491351, "1晚", 0], [372931069, "2晚", 0]],
        "马戏": [[3012046747, "1晚", 0], [1922454029, "2晚", 0]],
        "迎海": [[2638123252, "1晚", 0], [506305848, "2晚", 0]],
        "长隆": [[2821768354, "1晚", 0], [1356981538, "2晚", 0]],
        "熊猫": [[1833781186, "1晚", 0], [4251807307, "2晚", 0]],
        "香江": [[610579135, "1晚", 0], [404277879, "2晚", 0]]
      },
      "要出发": {
        "企鹅": [[1119951236, "1晚2晚", 0]],
        "横琴": [[1086674270, "1晚2晚", 0]],
        "马戏": [[2263339879, "1晚2晚", 0]],
        "迎海": [[1226965570, "1晚2晚", 0]],
        "长隆": [[3784912780, "1晚2晚", 0]],
        "熊猫": [[2806460147, "1晚2晚", 0]],
        "香江": [[2453196364, "1晚2晚", 0]]
      }
      };

    GM_addStyle(CSS);
    document.title = `去哪儿-长隆系列价格`;
    document.body.innerHTML = bodyHtml;
    // 这个还差button disabled没有加上去
    new Vue({
      el: "#qunarPrice",
      data: {
        spuJson: SPU,
        pricePage: "",
        currentSPU: ""
      },
      methods: {
        pageLink: function(hid){
          return "https://caab4.package.qunar.com/user/detail.jsp?abt=a&id=" + hid;
        },
        upadatePricePage: function(e){
          // 更新 iframe 链接
          this.pricePage = `https://dyly3.package.qunar.com/api/duplicateProduct/teamPrice.json?pId=${e.target.title}&month=${new Date().getFullYear()}-${(new Date().getMonth()+1)>9 ? new Date().getMonth()+1 : '0' + (new Date().getMonth()+1)}`;
          // console.log(this.pricePage);
          // 更新iframe 标题
          let night = e.target.textContent,
          currentHotel = e.target.parentElement.parentElement.firstElementChild.textContent,
          currentspu = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
          this.currentSPU = `${currentspu}-${currentHotel} ${night} ${e.target.title}`;
        }
      }
    });
  }
  // 在 价格json页面整理生成价格表格
  else{
    // 套餐对比数组
var cmpJson = {
      "企鹅": [
        ["Hi目", "2970305265", "4237760351"],
        ["途牛", "1379746", "1423162105"],
        ["要出发", "1119951236", "1136035466"],
        ["自由行", "4090036039", "3607929711"],
        ["欢乐", "1909440043", "4142145660"],
        ["新视界", "2668328679", "2819181750"],
      ],
      "马戏": [
        ["Hi目", "2417300128", "3706068425"],
        ["途牛", "1280506006", "1811929430"],
        ["要出发", "2263339879", "384860555"],
        ["自由行", "3358297818", "2748100946"],
        ["欢乐", "3601933456", "867880067"],
        ["新视界", "3012046747", "977067071"],
      ],
      "横琴": [
        ["Hi目", "1440738262", "3511862297"],
        ["途牛", "603200908", "606590215"],
        ["要出发", "1086674270", "2335295578"],
        ["自由行", "471775043", "1697360870"],
        ["欢乐", "100312527", "1286671932"],
        ["新视界", "1706491351", "3271397152"],
      ],
      "迎海": [
        // 没有欢乐
        ["Hi目", "1759183252", "1465817851"],
        ["途牛", "1934518466", "897852983"],
        ["要出发", "1226965570", "675112734"],
        ["自由行", "782636163", "2054943142"],
        ["新视界", "2638123252", "2633072904"],
      ],
      "长隆": [
        ["Hi目", "2797668378", "3056342887"],
        ["途牛", "3628531124", "1292622221"],
        ["要出发", "3784912780", "2325026645"],
        ["自由行", "3837441410", "3296574361"],
        ["欢乐", "758130578", "3348732555"],
        ["新视界", "2821768354", "1604109416"],
      ],
      "熊猫": [
        // 没有熊猫的套餐
        ["Hi目", "1968959658", "3262269056"],
        ["途牛", "386490342", "2373900273"],
        ["要出发", "2806460147", "953697231"],
        ["自由行", "1964230841", "2172589690"],
        ["欢乐", "1545438080", "1152946280"],
        ["新视界", "1833781186", "2882994415"],
      ],
      "香江": [
        // 没有特价自由行的套餐，没有欢乐
        ["Hi目", "1143145654", "2204666075"],
        ["途牛", "3438472615", "331236073"],
        ["要出发", "2453196364", "393505288"],
        ["新视界", "610579135", "3527804850"],
      ],
    };

    var Json2Arr = {
      D2MS : 1000 * 60 * 60 * 24, //一天有多少毫秒
      DAYRANGE : 65, //假设返回日期最大跨度是65天
      dateArray : [], //日期数组
      nowDay: new Date().getDate(),
      //这里假设最多是20个套餐，如果有超出25个套餐的情况，这里再修改
      groups: [
        "套餐一", "套餐二", "套餐三", "套餐四", "套餐五",
        "套餐六", "套餐七", "套餐八", "套餐九", "套餐十",
        "套餐十一", "套餐十二", "套餐十三", "套餐十四", "套餐十五",
        "套餐十六", "套餐十七", "套餐十八", "套餐十九", "套餐二十",
        "套餐二十一", "套餐二十二", "套餐二十三", "套餐二十四", "套餐二十五"
      ]
    };
    //返回格式化日期
    Json2Arr.getFormatDate = function(dateObject) {
      var nowDate = dateObject;
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
      var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      return year + "-" + month + "-" + date;
    };
    Json2Arr.today = Json2Arr.getFormatDate(new Date()); //起始日期
    //表头日期数组
    Json2Arr.dateArray = Array(Json2Arr.DAYRANGE).fill(null).map((v,i)=>{
      return Json2Arr.getFormatDate(new Date(new Date().setDate(Json2Arr.nowDay + i)));
    });
    //根据日期，看看应该房子在哪一列。返回列号
    Json2Arr.returnClumn = function(txt) {
      return (new Date(txt) - new Date(Json2Arr.today)) / Json2Arr.D2MS;
    };
   
    Json2Arr.tranJson = function(dataObj, sup=null){
      let tcId = [], tcTitle = [], supArr = [], tcNum = 0, c, r;
      // 找到套餐最多的日期, 获取套餐ID和标题
      for(let i in dataObj){
        if(dataObj[i].length > tcNum){ 
          tcNum = dataObj[i].length;
          for(let j in dataObj[i]){
            r = Json2Arr.groups.indexOf(dataObj[i][j].group);
            tcTitle[r] = dataObj[i][j].subTitle;
            tcId[r] = dataObj[i][j].team3TypeId;
            supArr.push(sup);
          }
        }
      }
      // 填充数组，假设是20×DAYRANGE 宽度
      let tmpArray = Array(tcNum).fill(null).map(()=>{return Array(Json2Arr.DAYRANGE).fill(null);});
      for(let i in dataObj){
        c = Json2Arr.returnClumn(i);
        for(let j in dataObj[i]){
          r = Json2Arr.groups.indexOf(dataObj[i][j].group);
          //taocanPrice 价格, count 库存
          tmpArray[r][c] = [dataObj[i][j].taocanPrice || dataObj[i][j].adultPrice, dataObj[i][j].count];
        }
      }
      return [tmpArray, tcTitle, tcId, supArr];
    };

    // 页面数据内容
    var D = JSON.parse(document.body.textContent);
    var pnsData = Json2Arr.tranJson(D.data);
    console.log(pnsData);
    GM_setValue(
      location.href.match(/\d{6,12}/g)[0],
        {
          "t": new Date().toLocaleString(),
          "idArr": pnsData[2],
          "pnsArr": pnsData[0],
          "titleArr": pnsData[1]
        });

    let tableHTML = `
      <table id="customers">
      <tr><th v-for="th in thArray" v-if="th[1]">{{th[0]}}</th><th v-for="d in dateArray">{{d}}</th></tr>
      <tr v-for="t,tk in subTitles">
        <td v-if="sups[tk]">{{sups[tk]}}</td><td>{{groups[tk]}}</td><td>{{tcIds[tk]}}</td><td>{{t}}</td>
        <!-- 如果这里后面需要库存信息，
        把p ? p[0] : "" 改成 p ? p[0]+'('+p[1]+')': "" 就可以了,
        又或者，存储一个 flag， 用于判断显示信息多少 -->
        <td v-for="p in dateArray2D[tk]">{{p ? p[0] : ""}}</td>
      </tr>
      </table>`;
    document.body.innerHTML = tableHTML;
    var vueTb = new Vue({
      el: "#customers",
      data: {
        thArray: [["供应商",0], ["套餐",1], ["套餐ID",1], ["套餐名称",1]],
        dateArray: Json2Arr.dateArray,
        subTitles: pnsData[1],
        tcIds: pnsData[2],
        groups: Json2Arr.groups,
        sups: pnsData[3],
        dateArray2D: pnsData[0]
      }
    });
    GM_addStyle(`
      body{margin:0;padding:0;}
      *{overflow:auto;white-space:nowrap;}
      #customers{font-family:"Trebuchet MS",Arial,Helvetica,sans-serif;width:100%;border-collapse:collapse;}
      #customers td,#customers th{font-size:1em;border:1px solid #0088A4;padding:3px 7px 2px 7px;}
      #customers th{font-size:1.1em;text-align:left;padding-top:5px;padding-bottom:4px;background-color:#00AFC7;color:#ffffff;}
      #customers tr.alt td{color:#000000;background-color:#EAF2D3;}
    `);

    // 查询元素在数组中的索引值
    Array.prototype.indexOf = function (value) {
      let index = -1;
      for (let i = 0; i < this.length; i++) {
        if (this[i] == value) {
          index = i;
          break;
        }
      }
      return index;
    };

    function getPricesByTid(productId=0, tid=0, sup=null){
      let nullObj = { "t": null, "idArr": [], "pnsArr": [], "titleArr": [] };
      let tmp = GM_getValue(productId, nullObj);
      // console.log(tmp);
      try {
        let index = tmp.idArr.indexOf(tid);
        return [
          tmp.t, // 获取价格时间
          sup, // 供应商信息
          productId, //产品ID
          tid,  // 套餐ID
          tmp.titleArr[index], // 套餐标题
          tmp.pnsArr[index], //该套餐的价格库存
        ];
      } catch(e) {
        console.log(e);
      }
    }

    function getCmpPrice(arr){
      let newArr = [[],[],[],[],[],[]];
      arr.map(v=>{
        let tmp = getPricesByTid(v[1], v[2], v[0]);
        newArr[0].push(tmp[0]);  //价格获取时间
        newArr[1].push(tmp[1]);  //供应商
        newArr[2].push(tmp[2]);  //产品id
        newArr[3].push(tmp[3]);  //套餐id
        newArr[4].push(tmp[4]);  //套餐标题
        newArr[5].push(tmp[5]);  //套餐价格库存
      });

      vueTb.thArray = [["供应商",1], ["报价时间",1], ["套餐ID",1], ["套餐名称",1]];
      vueTb.subTitles = newArr[4];
      vueTb.dateArray2D = newArr[5];
      vueTb.tcIds = newArr[3];
      vueTb.sups = newArr[1];
      vueTb.groups = newArr[0];
    }

    GM_registerMenuCommand('企鹅',()=>{getCmpPrice(cmpJson['企鹅']);},'q');
    GM_registerMenuCommand('马戏',()=>{getCmpPrice(cmpJson['马戏']);},'m');
    GM_registerMenuCommand('横琴',()=>{getCmpPrice(cmpJson['横琴']);},'h');
    GM_registerMenuCommand('迎海',()=>{getCmpPrice(cmpJson['迎海']);},'y');
    GM_registerMenuCommand('长隆',()=>{getCmpPrice(cmpJson['长隆']);},'c');
    GM_registerMenuCommand('熊猫',()=>{getCmpPrice(cmpJson['熊猫']);},'p');
    GM_registerMenuCommand('香江',()=>{getCmpPrice(cmpJson['香江']);},'x');

  }
})();