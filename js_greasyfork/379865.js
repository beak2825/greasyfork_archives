// ==UserScript==
// @name         马蜂窝获取价格
// @namespace  https://greasyfork.org/zh-CN/users/104201
// @version      1.2
// @description  马蜂窝产品获取价格，根据马蜂窝返回的Json整理成表格。一定不要用公司的网络抓取价格。否则公司无法访问马蜂窝。要用个人网络获取价格。mfwgetPrice.js
// @author       黄盐
// @include      *://www.mafengwo.cn/sales/detail/stock/detail?groupId=*
// @include      *://www.mafengwo.cn/sales/detail_partial/web_im?id=*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdn.bootcss.com/vue/2.6.6/vue.js
// require       file:///D:/nut/codes/mfwGetPrice.js
// @downloadURL https://update.greasyfork.org/scripts/379865/%E9%A9%AC%E8%9C%82%E7%AA%9D%E8%8E%B7%E5%8F%96%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/379865/%E9%A9%AC%E8%9C%82%E7%AA%9D%E8%8E%B7%E5%8F%96%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;
(function() {
  if(location.href.indexOf("sales/detail_partial") != -1){
    // 匹配 *://www.mafengwo.cn/sales/detail_partial/web_im?id=*
    const SPU = {
      // [产品ID, 晚数, 是1否0下线]
      "Hi目": {
        "企鹅": [[2325158, 1, 0], [2812114, 2, 0]],
        "横琴": [[2324307, 1, 0], [2812322, 2, 0]],
        "马戏": [[2323890, 1, 0], [2812322, 2, 0]],
        "迎海": [[5233179, 1, 0], [2812538, 2, 0]],
        "长隆": [[2332821, 1, 0], [2812614, 2, 0]],
        "熊猫": [[2378014, 1, 0], [2812642, 2, 0]],
        "香江": [[2712957, 1, 0], [2812692, 2, 0]]
      },
      "笨鸟": {
        "企鹅": [[2237569, 1, 0], [2814885, 2, 0]],
        "横琴": [[2237390, 1, 0], [2814747, 2, 0]],
        "马戏": [[2245898, 1, 0], [2816100, 2, 0]],
        "迎海": [[2317988, 1, 0], [2816299, 2, 0]],
        "长隆": [[2810520, 1, 0], [2237689, 2, 0]],
        "熊猫": [[2375856, 1, 0], [2812912, 2, 0]],
        "香江": [[2375856, 1, 1], [2812912, 2, 1]]
      },
      "欢乐": {
        "企鹅": [[2546602, 1, 0], [2809853, 2, 0]],
        "横琴": [[2549146, 1, 0], [2810473, 2, 0]],
        "马戏": [[2553054, 1, 0], [2799831, 2, 0]],
        "迎海": [[2553097, 1, 1], [2553097, 2, 1]],
        "长隆": [[2553475, 1, 0], [2852987, 2, 0]],
        "熊猫": [[2554083, 1, 0], [2884757, 2, 0]],
        "香江": [[2684795, 1, 0], [2684795, 2, 1]]
      },
      "漫游": {
        "企鹅": [[2787910, 1, 0], [2810815, 2, 0], [2374145, 1, 0]],
        "横琴": [[2812291, 1, 0], [2824663, 2, 0], [2375134, 1, 1]],
        "马戏": [[2983557, 1, 0], [2815000, 2, 0], [2375240, 1, 1], [2983594, 2, 0]],
        "迎海": [[2911057, 1, 0], [2967528, 2, 0], [2375240, 1, 1]],
        "长隆": [[2888979, 1, 0], [2949783, 2, 0], [2374915, 1, 1]],
        "熊猫": [[2844046, 1, 0], [2889360, 2, 0], [2387742, 1, 0], [2815122, 2, 0]],
        "香江": [[2981480, 1, 0], [2982006, 2, 0], [2387742, 1, 1]]
      },
      "要出发": {
        "企鹅": [[2573208, 1, 0], [2573208, 2, 1]],
        "横琴": [[2577627, 1, 0], [2577627, 2, 1]],
        "马戏": [[2589398, 1, 0], [2589398, 2, 1]],
        "迎海": [[2583112, 1, 0], [2583112, 2, 1]],
        "长隆": [[2552330, 1, 0], [2552330, 2, 1]],
        "熊猫": [[2559954, 1, 0], [2559954, 2, 1]],
        "香江": [[2672139, 1, 0], [2672139, 2, 1]]
      },
      "广之旅": {
        "企鹅": [[2207053, 1, 0], [2862211, 2, 0], [2890747, 1, 0]],
        "横琴": [[2201882, 1, 0], [2401404, 2, 0], [2709093, 1, 0]],
        "马戏": [[2201648, 1, 0], [2862366, 2, 0], [2709093, 1, 1]],
        "迎海": [[2384784, 1, 0], [2384784, 2, 1], [2384784, 1, 1]],
        "长隆": [[2969450, 1, 0], [2969450, 2, 1], [2969450, 1, 1]],
        "熊猫": [[2381795, 1, 0], [2381795, 2, 1], [2707494, 1, 0]],
        "香江": [[2881281, 1, 0], [2881281, 2, 1], [2889994, 1, 0]]
      },
      "蜗蜗游": {
        "企鹅": [[2712475, 1, 0], [5176448, 2, 0]],
        "横琴": [[2700017, 1, 0], [5177096, 2, 0]],
        "马戏": [[2712642, 1, 0], [5173490, 2, 0]],
        "迎海": [[2712642, 1, 1], [5173490, 2, 1]],
        "长隆": [[2715207, 1, 0], [5172892, 2, 0]],
        "熊猫": [[2710138, 1, 0], [5176623, 2, 0]],
        "香江": [[2703379, 1, 0], [5176884, 2, 0]]
      },
    };
    const bodyHtml = `
      <div id="mfwPrice">
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
      <iframe id="priceJson" :src="pricePage" frameborder="0" style="width: 1200px; height: 500px;"></iframe>
      </div>`;
    const CSS = `
      button{width: 20px; border: 1px dotted orange; border-radius: 5px; margin: 1px; cursor: pointer;}
      li{list-style: none;}
      a{ text-decoration: none; color: orange; }
      a:hover{ color:yellowgreen; }
      button:hover{ background: yellowgreen; }
      fieldset { border: 1px solid #aaa; border-radius: 10px; padding: 2px; }
      #linkDiv{ height: 200px; overflow: auto; }`;

    document.title = "马蜂窝-长隆系列价格";  //改标题
    GM_addStyle(CSS);  //  增加样式
    document.body.innerHTML = bodyHtml;  // 更新网页内容
    // 这个还差button disabled没有加上去
    new Vue({
      el: "#mfwPrice",
      data: {
        spuJson: SPU,
        pricePage: "",
        currentSPU: ""
      },
      methods: {
        pageLink: function(hid){
          return "http://www.mafengwo.cn/sales/" + hid + ".html";
        },
        // 获取并返回 所有的skuId
        getSkuIdsArray: function(productId=0){
          return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
              method: "GET",
              url: `http://www.mafengwo.cn/sales/detail/stock/info?groupId=${productId}`,
              timeout: 5000,
              responseType: 'json',
              onload: function(response){
                resolve(response.response.data.sku.map((item)=>{return item.id;}));
              },
              onerror: function(response, spu){
                console.log(response);
                console.log(productId+"拿不了价格");
                reject([]);
              }
            });
          });
        },
        upadatePricePage: async function(e){
          let groupId = e.target.title;
          let skuIds = await this.getSkuIdsArray(groupId);
          // console.log(skuIds);
          // 更新 iframe 链接
          this.pricePage = `http://www.mafengwo.cn/sales/detail/stock/detail?groupId=${groupId}&skuIds%5B%5D=${skuIds.join("&skuIds%5B%5D=")}`;
          // 更新iframe 标题
          let night = e.target.textContent,
          currentHotel = e.target.parentElement.parentElement.firstElementChild.textContent,
          currentspu = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
          this.currentSPU = `${currentspu}${currentHotel} ${night}晚 ${e.target.title}`;
        }
      }
    });

    // 提示切换个人wifi
    window.alert("不要用公司网络抓价格哦!!! ╮(╯▽╰)╭");

  }else{
    // 匹配 *://www.mafengwo.cn/sales/detail/stock/detail?groupId=*

    // 这里需要提供一个管理功能。对应的套餐进行编辑。这样就可以节省很多我的精力，GM_getValue 和 GM_setValue,用textarea 来编辑
    var cmpJson = {
      "企鹅1晚": [
                  ['HI目', '2325158', '27074329'],
                  ['笨鸟', '2237569', '3310983'],
                  ['欢乐', '2546602', '26955357'],
                  ['漫游', '2787910', '27188506'],
                  ['要出', '2573208', '7568712'],
                  ['广之', '2207053', '13737441'],
                  ['蜗蜗', '2712475', '18124402'],
                ],
      "横琴1晚": [
                  ['HI目', '2324307', '27802294'],
                  ['笨鸟', '2237390', '3318399'],
                  ['欢乐', '2549146', '26954951'],
                  // ['漫游', '2812291', '15895278'],
                  ['要出', '2577627', '7671699'],
                  ['广之', '2201882', '3512250'],
                  ['蜗蜗', '2700017', '18129827'],
                ],
      "马戏1晚": [
                  ['HI目', '2323890', '27641182'],
                  ['笨鸟', '2245898', '27588997'],
                  ['欢乐', '2553054', '7086348'],
                  // ['漫游', '2983557', '16488990'],
                  ['要出', '2589398', '7967538'],
                  ['广之', '2201648', '13819422'],
                  ['蜗蜗', '2712642', '18117745'],
                ],
      "迎海1晚": [
                  ['HI目', '5233179', '20290447'],
                  ['笨鸟', '2317988', '27041002'],
                  // ['漫游', '2911057', '16080365'],
                  ['要出', '2583112', '7746429'],
                  ['广之', '2384784', '3422151'],
                ],
      "长隆1晚": [
                  ['HI目', '2332821', '19148173'],
                  ['笨鸟', '2810520', '15259138'],
                  ['欢乐', '2553475', '7105998'],
                  // ['漫游', '2888979', '15841782'],
                  ['要出', '2552330', '11160174'],
                  ['蜗蜗', '2715207', '18137422'],
                ],
      "熊猫1晚": [
                  ['HI目', '2378014', '19212678'],
                  ['笨鸟', '2375856', '7027224'],
                  ['欢乐', '2554083', '7109925'],
                  // ['漫游', '2844046', '15269318'],
                  ['要出', '2559954', '7276485'],
                  ['广之', '2381795', '14284124'],
                  ['蜗蜗', '2710138', '18144051'],
                ],
      "香江": [
                  ['HI目', '2712957', '19260082'],
                  // ['欢乐', '2684795', '17201952'],
                  // ['漫游', '2981480', '16442628'],
                  ['要出', '2672139', '9805212'],
                  ['广之', '2881281', '14216879'],
                  ['蜗蜗', '2703379', '18148790'],
                ],
    };


    var Json2Arr = {
      DAYRANGE: 90,  //表头日期范围，从当天往后推多少天。
      D2MS: 1000 * 60 * 60 * 24,  //一天有多少毫秒
      c: null,  //列
      nowDay: new Date().getDate()
    };

    // 参数是日期Object
    Json2Arr.getFormatDate = function(dateObject){
      var nowDate = dateObject;
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
      var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      return year + "-" + month + "-" + date;      
    };

    Json2Arr.returnClumn = function(dateString){
      return (new Date(dateString) - new Date(Json2Arr.today)) / Json2Arr.D2MS;
    };

    Json2Arr.today = Json2Arr.getFormatDate(new Date()); //起始日期
    Json2Arr.dateArray = Array(Json2Arr.DAYRANGE).fill(null).map((v,i)=>{
      return Json2Arr.getFormatDate(new Date(new Date().setDate(Json2Arr.nowDay + i)));
    });

    // skuArr: json的sku数组， spu: 供应商名称
    Json2Arr.tranJson = function(skuArr, spu=null){
      let idName = [], spuArr=[];
      let nullArray = Array(skuArr.length).fill(null).map(()=>{
        return Array(Json2Arr.DAYRANGE).fill(null);
      });
      for(let i in skuArr){
        idName.push({id: skuArr[i].id, name: skuArr[i].name});  //套餐ID数组
        spuArr.push(spu);  // 供应商名称数组，主要用于同套餐比价
        for(let j in skuArr[i].calendar){
          Json2Arr.c = Json2Arr.returnClumn(skuArr[i].calendar[j].date);
          // foo.price 价格， foo.remain 库存。后面如果想要呈现库存数据，也可以很方便展示出来
          nullArray[i][Json2Arr.c] = [skuArr[i].calendar[j].price, skuArr[i].calendar[j].remain];
        }
      }
      // ID和套餐名称， 价格二维数组， 供应商数组
      return [idName, nullArray, spuArr];
    };

    var sourceDate = JSON.parse(document.body.textContent).data;
    
    var pncArr = Json2Arr.tranJson(sourceDate.sku);

    let tableHTML = `
      <table id="customers" class="naclTable">
      <tr><th v-if="spu[0]">供应商</th><th>套餐</th><th>套餐名称</th><th v-for="d in dateArray">{{d}}</th></tr>
      <tr v-for="sku,row in idName">
        <td v-if="spu[row]">{{spu[row]}}</td><td>{{sku.id}}</td><td>{{sku.name}}</td>
        <!-- 如果需要库存信息也很方便，下面改一下显示方式就可以了。 p[1]是库存 -->
        <td v-for="p in dateArray2D[row]">{{p ? p[0] : ""}}</td>
      </tr>
      </table>`;
    document.body.innerHTML = tableHTML;

    var vueTb = new Vue({
      el: "#customers",
      data: {
        dateArray: Json2Arr.dateArray,
        dateArray2D: pncArr[1],
        idName: pncArr[0],
        spu: pncArr[2]
      }
    });

    GM_addStyle(`
      body{margin:0;padding:0;}
      *{overflow:auto;white-space:nowrap;}
      .naclTable{font-family:"Trebuchet MS",Arial,Helvetica,sans-serif;width:100%;border-collapse:collapse;}
      .naclTable td,.naclTable th{font-size:1em;border:1px solid #98bf21;padding:3px 7px 2px 7px;}
      .naclTable th{font-size:1.1em;text-align:left;padding-top:5px;padding-bottom:4px;background-color:#A7C942;color:#ffffff;}
      .naclTable tr.alt td{color:#000000;background-color:#EAF2D3;}
      `);

    function getPricesBySkuid(productId=0, skuId=0, spu=null){
      return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
          method: "GET",
          // 生产链接
          url: `http://www.mafengwo.cn/sales/detail/stock/detail?groupId=${productId}&skuIds%5B%5D=${skuId}`,
          // 测试链接
          // url: `http://localhost:5000/?id=${skuId}`,
          timeout: 5000,
          responseType: 'json',
          onload: function(response){
            resolve(Json2Arr.tranJson(response.response.data.sku, spu));
          },
          onerror: function(response, spu){
            console.log(response);
            console.log(productId+"拿不了价格");
            reject([[{id:null,name:null}], [], [spu]]);
          }
        });
      });
    }
    function getCmpPrice(arr){
      let newArr = [[],[],[]];
      arr.map(async v=>{
        let tmp = await getPricesBySkuid(v[1], v[2], v[0]);
        newArr[0].push(tmp[0][0]); 
        newArr[1].push(tmp[1][0]); 
        newArr[2].push(tmp[2][0]); 
      });
       vueTb.dateArray2D = newArr[1];
       vueTb.idName = newArr[0];
       vueTb.spu = newArr[2];
    }

    GM_registerMenuCommand('企鹅1晚',()=>{getCmpPrice(cmpJson['企鹅1晚']);},'q');
    GM_registerMenuCommand('横琴1晚',()=>{getCmpPrice(cmpJson['横琴1晚']);},'h');
    GM_registerMenuCommand('马戏1晚',()=>{getCmpPrice(cmpJson['马戏1晚']);},'m');
    GM_registerMenuCommand('迎海1晚',()=>{getCmpPrice(cmpJson['迎海1晚']);},'y');
    GM_registerMenuCommand('长隆1晚',()=>{getCmpPrice(cmpJson['长隆1晚']);},'c');
    GM_registerMenuCommand('熊猫1晚',()=>{getCmpPrice(cmpJson['熊猫1晚']);},'x');
    GM_registerMenuCommand('香江',()=>{getCmpPrice(cmpJson['香江']);},'j');

  }


})();