// ==UserScript==
// @name         阿目价格快照
// @namespace    http://tampermonkey.net/aaa
// @version      1.0
// @description  存储价格，快速恢复价格
// @author       ╮(╯▽╰)╭
// @include      *://erp.himudidi.com/platform/product_list/id/*
// noframes
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        window.close
// @require      https://cdn.bootcss.com/vue/2.6.10/vue.min.js
// @require      https://unpkg.com/element-ui@2.13.0/lib/index.js
// @downloadURL https://update.greasyfork.org/scripts/394761/%E9%98%BF%E7%9B%AE%E4%BB%B7%E6%A0%BC%E5%BF%AB%E7%85%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/394761/%E9%98%BF%E7%9B%AE%E4%BB%B7%E6%A0%BC%E5%BF%AB%E7%85%A7.meta.js
// ==/UserScript==
// jshint esversion:6
const A = {
  setMotherCalendarURL: "http://erp.himudidi.com/product_calendar/set_calendar.html",
  setChildCalendarURL: "http://erp.himudidi.com/platform_product_calendar/set_calendar.html",
  getCalendarURL: "http://erp.himudidi.com/api/calendar/get",
  platformCode: {
    meituanVocation: '35',
    ctripVocation: '41',
    qunarVocation: '33',
    mafengwoVocation: '37'
  },

  // 设置价格日历，在调用这个函数之前，应该做好数据校验的工作
  // setCalendar: function ({productId, cost, stock, days}, callback) {
  setCalendar: function (dataJson, callback = null) {
    if(!dataJson.hasOwnProperty('product_id') || !(dataJson.days instanceof Array)){return false;}
    const dataProps = [
      //一般来说，cost 成本 和 stock 是一起的，用于母产品的设置
      // price 价格 用于只产品，会附带平台，还有状态status(利润/成本)
      // price_status, 1 利润, 2 售价
      'cost',           // 底价
      'stock',          // 库存
      'price',          // 价格
      'price_status',   // 利润或售价
    ];
    let postString = `product_id[]=${dataJson.product_id}`;
    if(dataJson.hasOwnProperty('platform_id')){
      postString += '&platform_id=' + dataJson.platform_id;
    }
    dataProps.map(v=>{
      if(dataJson.hasOwnProperty(v)){
        postString += `&items[0][${v}]=${dataJson[v]}`;
      }
    });
    try {
      postString += '&items[0][date][]=' + dataJson.days.join('&items[0][date][]=');

      GM_xmlhttpRequest({
        url: dataJson.hasOwnProperty('platform_id') ? this.setChildCalendarURL: this.setMotherCalendarURL,
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; boundary=&; charset=UTF-8' },
        responseType: "json",
        data: encodeURI(postString),
        onload: function (data) { if (callback) { callback(data, dataJson);} },
        onerror: function (data) { if (callback) { callback(data, dataJson);} }
      });
    } catch (error) {
      console.log("A.setCalendar Error:\n", dataJson, error);
    }

  }, 

  getCalendar: function(id, length=null, start=null){
    let postData = {
      id: id,  // 供应商商品id(阿目云平台产品ID)，必须
      length: length, // 长度，日期的长度，可空，接口默认30
      start: start,  // 开始日期，可空，默认当天
    };
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        url: this.getCalendarURL,
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; boundary=&; charset=UTF-8' },
        data: baseFunction.concatData(postData),
        responseType: "json",
        onload: function (data) { resolve(data.response); },
        onerror: function(data) { reject(data.response); }
      });
    });
  },

  // 产品价格日历，直接问价格，通过阿目云产品ID
  getPlatformCalendar: function(amuyunId, platform, startDate, endDate){
    let getPlatformCalendarURL = `http://erp.himudidi.com/platform_product_calendar/get_calendar/id/${amuyunId}/p_id/${this.platformCode[platform]}.html`;
    let postData = {
      start: startDate,
      end: endDate
    };
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        url: getPlatformCalendarURL,
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: baseFunction.concatData(postData),
        responseType: "json",
        onload: function (data) { resolve(data.response); },
        onerror: function(data) { reject(data.response); }
      });

    });
  }

  // A End
};

const baseFunction = {
  // xhr中，json 转化为 form data 格式
  json2formData: function(jsonObj){

  },
  concatData: function(dataJson){
    let dataString = '';
    for (let i in dataJson) {
      dataString += `${i}=${dataJson[i]}&`;
    }
    return dataString.slice(0, -1);
  }
};

/* nacl.js 
 * author: NaCl 黄盐
 * mail: woolition@gmail.com
 * last-modify: 2019-6-9
 */
/* jshint esversion:6 */
var Nacl = (function(){
  let O = {};
  /* 基本的查找元素方法 */
  O.q = function(cssSelector){
    return document.querySelector(cssSelector);
  };
  O.qs = function(cssSelector){
    return document.querySelectorAll(cssSelector);
  };
  /* 格式化日期 */
  O.formatDate = (date, offset=0, spliter='-')=>{
    if(!(new Date(date) instanceof Date)) {
      console.log("NaCl Hint: 传入日期有问题");
      return;
    }
    let t = new Date(new Date(date).getTime() + 86400000*offset);
    // yyyy-mm-dd
    return `${t.getFullYear()}${spliter}${t.getMonth()+1 >9 ? t.getMonth()+1 : '0'+(t.getMonth()+1)}${spliter}${t.getDate() >9 ? t.getDate() : '0'+t.getDate()}`;
  };

  /* 格式化时间，在日期基础上扩展 */
  O.formatTime = function(date,spliter=':'){
    if(!(new Date(date) instanceof Date)) {
      console.log("NaCl Hint: 传入日期有问题");
      return;
    }
    let t = new Date(date);
    return `${O.formatDate(date)} ${t.getHours()>9 ? t.getHours() : '0'+t.getHours()}${spliter}${t.getMinutes()>9 ? t.getMinutes() : '0'+t.getMinutes()}${spliter}${t.getSeconds()>9 ? t.getSeconds() : '0'+t.getSeconds()}`;
  };
  
  /* 进入全屏 */
  O.fullScreen = function(cssSelector){
    let ele = document.querySelector(cssSelector) || document.documentElement;
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullScreen) {
      ele.webkitRequestFullScreen();
    }
  };
  /* 退出全屏 */
  O.exitFullscreen = function (cssSelector) {
    let ele = document.querySelector(cssSelector) || document.documentElement;
    if (ele.exitFullscreen) {
        ele.exitFullscreen();
    } else if (ele.mozCancelFullScreen) {
        ele.mozCancelFullScreen();
    } else if (ele.webkitCancelFullScreen) {
        ele.webkitCancelFullScreen();
    }
  };
 
  /* 简单克隆，一般json对象复制应该没有问题 */
  O.cloneJsonObject = function(obj){
    return JSON.parse(JSON.stringify(obj));
  };

  return O;
})();// jshint esversion:6
$ = unsafeWindow.jQuery;
const getData = {
  // 获得要存储的套餐的ID
  getPackagesIds: function () {
    let pkgsArray = [];
    let res = $("div#tablelist input[name='ids[]']:checked").map((i,v)=>{
      pkgsArray.push(v.value);
    });
    return pkgsArray.length ? pkgsArray : [];
  },

  getPricesJson: function(packageIds, length = 90){
    return new Promise(async(resolve,reject)=>{
      if(!packageIds.length){return {};}
      let pricesJson = {};
      let startDate = Nacl.formatDate(new Date());
      let endDate = Nacl.formatDate(new Date(), length);
      for(let i = 0; i<packageIds.length; i++ ){
        pricesJson[packageIds[i]] = await A.getPlatformCalendar(packageIds[i], 'meituanVocation', startDate, endDate);
      }

      resolve(pricesJson);
    });
  }

};// jshint esversion:6
const multiPrice = {
  sortAmuyunJson: function (d) {
    let priceArray = [], dayArray = [];
    let daysIndex = null;
    let today = Nacl.formatDate(new Date());
    for (let day in d) {
      try {
        if (d[day].hasOwnProperty('data') && day >= today) {
          if (priceArray.indexOf(d[day].platform_data.sell) > -1) {
            daysIndex = priceArray.indexOf(d[day].platform_data.sell);
            dayArray[daysIndex].push(day);
          } else {
            priceArray.push(d[day].platform_data.sell);
            daysIndex = priceArray.indexOf(d[day].platform_data.sell);
            dayArray.push([day]);
          }
        }
      } catch (error) {
        console.log(day, error);
      }
    }

    // console.log(priceArray, dayArray, 'sortAmuyunJson');
    return {priceArray, dayArray};
    // return{
    //   priceArray
    // }
    // d.map(v=>{
    //   console.log(v);
    // });
  }
};// jshint esversion:6
// Intros 作为索引，长期常驻内存，可以从 Shot 重新生成
// GM_addStyle(GM_getResourceText('elementUICss'));
$("head").append(`<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">`);
GM_addStyle(`#app{width: 100%; height: auto; z-index: 2000; position: absolute; top: 0; background:lightblue; display: block; padding: 1em;}`);

let daysArray = getDaysArray(Nacl.formatDate(new Date()), 120);
let elTableHTML = elTableTemplate(daysArray);


$('body').append(`
<div id="app" v-show="isShow">
<el-button-group>
  <el-button type="primary" icon="el-icon-edit" @click="panel='create'">新快照</el-button>
  <el-button type="primary" icon="el-icon-notebook-2" @click="panel='manage'">管理快照</el-button>
  <el-button type="primary" icon="el-icon-close" @click="isShow=0">关闭</el-button>
</el-button-group>
<div v-show="panel=='create'" style="padding:1em 2em;">
    <el-input v-model="form.name" placeholder="快照 名称" size="small"></el-input>
    <el-input v-model="form.note" placeholder="快照 说明" size="small"></el-input>
    <el-date-picker
      v-model="form.daysRange"
      :picker-options="pickerOptions"
      value-format="yyyy-MM-dd"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="small">
    </el-date-picker>
    <el-radio-group v-model="form.platform" size="small">
      <el-radio-button :label="35">美团</el-radio-button>
      <el-radio-button :label="33">去哪儿</el-radio-button>
      <el-radio-button :label="37">马蜂窝</el-radio-button>
      <el-radio-button :label="41">携程</el-radio-button>
    </el-radio-group>
    <br/>
    <el-button @click="preview" type="primary" icon="el-icon-view">预览</el-button>
    <el-button @click="saveShot" type="primary" >保存</el-button>
    <el-button @click="redoShot" type="info">重做</el-button>
</div>

<div v-show="panel=='manage'">
  <el-table
    :data="shotIntros"
    style="width:100% margin:1em 0;"
    max-height="300"
    border
    size="small"
    highlight-current-row="true">
    <el-table-column
      fixed
      prop="name"
      label="名称"
      width="300">
    </el-table-column>
    <el-table-column
      prop="note"
      label="备注"
      width="300">
    </el-table-column>
    <el-table-column label="操作" width="120">
      <template v-slot="scope">
        <el-button @click.native.prevent="deleteShot(scope.$index,shotIntros)" type="text">移除</el-button>
        <el-button @click.native.prevent="prewviewShot(scope.$index,shotIntros)" type="text">预览</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="daysRange"
      label="日期"
      width="110">
    </el-table-column>
    <el-table-column
      prop="timestamp"
      label="时间"
      width="110">
    </el-table-column>
    
  </el-table>
</div>

${elTableHTML}
</div>


`);


let priceShotView = new Vue({
  el: '#app',
  methods: {
    // 创建快照
    saveShot() {
      this.form.timestamp = new Date().getTime();
      let checkResult = checkData(this.form, this.rawPkgsPrice);
      if(checkResult.status){
        let createResult = createShot(this.form, this.rawPkgsPrice);
        if(createResult[0]){
          this.updateShotIntros();
          this.noti('success', createResult[1], '创建快照');
        }else{
          this.noti('error', createResult[1], '创建快照');
        }
      }else{
        this.noti('error', checkResult.msg, '检查数据错误');
      }
    },
    // 删除快照
    deleteShot(idx, shotArray){
      this.$confirm(`确定删除【${shotArray[idx].name}】吗？`, '删除快照', {confirmButtonText:'确定',cancelButtonText:'取消',type: 'warning'})
        .then(()=>{
          let Intros = GM_getValue("Intros", {});
          let Shot = GM_getValue("Shot", {});
          delete Intros[shotArray[idx].name];
          delete Shot[shotArray[idx].name];
          GM_setValue("Intros", Intros);
          GM_setValue("Shot", Shot);
          this.updateShotIntros();
        })
        .catch(()=>{});
    },
    // 预览保存的快照
    async prewviewShot(idx, shotIntros){
      let Shot = GM_getValue("Shot");
      let shot = Shot[shotIntros[idx].name];
      let endDate = shot.intro.daysRange[1];
      let today = Nacl.formatDate(new Date());
      if(endDate <= today){
        this.$confirm(`【${shotIntros[idx].name}】过期了，删了吧？`, "删除过期项目", {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.deleteShot(idx, shotIntros);
        }
        ).catch();
      }
      let startDate = (shot.intro.daysRange[0] > Nacl.formatDate(new Date())) ? shot.intro.daysRange[0] : Nacl.formatDate(new Date());
      let len = (new Date(this.form.daysRange[1]).getTime() - new Date(this.form.daysRange[0]).getTime()) / (1000*60*60*24);
      let daysArray = getDaysArray(startDate, len);
      let tableData = await this.transferPkgs(shot.raw, daysArray);
      Vue.set(this, 'tableData', tableData);
      // this.form.selectedPkgs = shot.intro.selectedPkgs;
      this.form = shot.intro;
      this.rawPkgsPrice = shot.raw;
      this.noti('success', 'OK', '快照预览');
    },
    // 恢复1个套餐的价格，恢复后的状态是设为卖价
    recover1pkg(idx, tableData){
      recover1pkgPrice(tableData[idx].id, this.form.platform, this.rawPkgsPrice[tableData[idx].id]);
    },
    // 调到套餐日历
    junm2calendar(idx, tableData){
      let calendarUrl = `http://erp.himudidi.com/platform_product_calendar/index/id/${tableData[idx].id}/p_id/${this.form.platform}.html`;
      window.open(calendarUrl, '_black');
    },
    noti(type, message, title='') {
      this.$notify({ title, message, type });
    },
    // 恢复原始状态
    redoShot() {
      this.form = {
        name: '',
        note: '',
        platform: 35,
        daysRange: [Nacl.formatDate(new Date()), Nacl.formatDate(new Date(), 30)],
        timestamp: new Date().getTime(),
        selectedPkgs: []
      },
      this.rawPkgsPrice = {};
      this.tableData = [];
    },
    // 切换面板的是否可见
    show() { this.isShow = !this.isShow; },
    // 创建之前预览
    async preview(){
      let selectedPkgs = await getData.getPackagesIds();
      this.form.platform = getPlatformCode();
      this.form.selectedPkgs = selectedPkgs;
      this.rawPkgsPrice = await getData.getPricesJson(this.form.selectedPkgs);
      let daysArray = getDaysArray(this.form.daysRange[0], this.daysLength);
      let c = await this.transferPkgs(this.rawPkgsPrice, daysArray);
      Vue.set(this, 'tableData', c);
    },
    // 阿目云抓过来的数据，转成适合 elementUI table 展示的数据，转换1个套餐
    transfer1pkg(id, rawData, daysArray) {
      return new Promise((resolve, reject) => {
        let elePkgRow = { id };
        for (let i = 0; i <= daysArray.length; i++) {
          if (rawData.hasOwnProperty(daysArray[i])) {
            if (rawData[daysArray[i]].hasOwnProperty('platform_data')) {
              elePkgRow[daysArray[i]] = parseInt(rawData[daysArray[i]].platform_data.sell);
            } else {
              elePkgRow[daysArray[i]] = parseInt(rawData[daysArray[i]].data.price);
            }
          } else {
            elePkgRow[daysArray[i]] = '';
          }
        }
        resolve(elePkgRow);
      })
    },
    // 转换多个套餐
    transferPkgs(rawData, daysArray) {
      return new Promise(async (resolve, reject) => {
        let pkgArray = [];
        for (let i in rawData) {
          pkgArray.push(await this.transfer1pkg(i, rawData[i], daysArray));
        }
        resolve(pkgArray);
      })
    },
    // 更新【管理快照】列表的数据
    updateShotIntros(){
      let Intros = GM_getValue("Intros", {});
      let shotIntros = Object.keys(Intros).map((v)=>{
        return {
          name: Intros[v].name,
          note: Intros[v].note,
          daysRange: Intros[v].daysRange.join('~'),
          timestamp: Nacl.formatTime(Intros[v].timestamp)
        }
      });
      this.shotIntros = shotIntros;
    }
  },
  computed: {
    daysLength(){
      const D2MS = 1000*60*60*24;
      return (new Date(this.form.daysRange[1]).getTime() - new Date(this.form.daysRange[0]).getTime()) / D2MS;
    },
    isShotTableshow(){
      return this.form.selectedPkgs.length;
    }
  },
  mounted: function(){
    this.updateShotIntros();
  },
  data() {
    return {
      form: {
        name: '',
        note: '',
        platform: 35,
        daysRange: [Nacl.formatDate(new Date()), Nacl.formatDate(new Date(), 30)],
        timestamp: new Date().getTime(),
        selectedPkgs: []
      },
      rawPkgsPrice: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      panel: 'create',
      isShow: 0,
      tableData: [],
      shotIntros: []
    }
  }
})

// 创建价格列表的Vue模板
function elTableTemplate(daysArray) {
  let ths = `<el-table-column prop="id" label="套餐ID" width="180" fixed> </el-table-column>`;
  for (let i = 0; i < daysArray.length; i++) {
    ths += `<el-table-column prop="${daysArray[i]}" label="${daysArray[i].slice(5)}" width="70"> </el-table-column>`;
  }
  let ourterHTML = `<el-table id="shotTable" :data="tableData" style="width:100%; margin:1em 0;" border max-height="300px" v-show="isShotTableshow" size="small" highlight-current-row="true">
    ${ths}
    <el-table-column fixed="right" label="操作" width="120">
      <template v-slot="scope">
        <el-button @click.native.prevent="recover1pkg(scope.$index, tableData)" type="text" size="small">恢复</el-button>
        <el-button @click.native.prevent="junm2calendar(scope.$index, tableData)" type="text" size="small">价格日历</el-button>
      </template>
    </el-table-column>
  </el-table>`
  return ourterHTML;
}
// 给定日期范围，返回一个日期数组
function getDaysArray(start, len=90) {
  let daysArray = new Array(len + 1).fill(0).map((v, i) => {
    return Nacl.formatDate(start, i);
  });
  return daysArray;
}

// 创建快照
function createShot(intro, raw){
  try {
    let Intros = GM_getValue('Intros', {});
    let Shot = GM_getValue('Shot', {});
    Intros[intro.name] = intro;
    Shot[intro.name] = {intro, raw};
    GM_setValue('Intros', Intros);
    GM_setValue('Shot', Shot);
    return [true, '创建成功'];
  } catch (error) {
    return [false, '创建快照出错:' + error];
  }
}
// 检查数据
function checkData(intro, raw){
  let Intros = GM_getValue('Intros', {});
  if(!intro.name){return {status:false, msg: '项目名称不能为空'}}
  else if(Intros.hasOwnProperty(intro.name)){
    return{
      status: false,
      msg: '项目名重复,请更改'
    }
  }else if(!intro.selectedPkgs.length){
    return {
      status: false,
      msg: '套餐数量不能是0'
    }
  }else if(!Object.keys(raw).length){
    return {
      status: false,
      msg: '价格抓取没成功，再试一次'
    }
  }else{
    return {
      status: true,
      msg: '没问题'
    };
  }

}

// 恢复1个套餐的价格
function recover1pkgPrice(packageId, platform, oneAmuPriceJson){
  let {priceArray, dayArray} = multiPrice.sortAmuyunJson(oneAmuPriceJson);
  console.log(priceArray,dayArray, 'recover1pkgPrice');
  // return;
  for (let i in priceArray) {
    A.setCalendar({
      product_id: packageId,
      platform_id: platform,
      price_status: 2,  // 2是设定为售价的模式
      price: priceArray[i],
      // stock: 5,
      // cost: 200,
      // days: ['2019-12-23', '2019-12-24', '2019-12-25']
      days: dayArray[i]
    }, (d) => { console.log(d); });
  }
}

// 获取平台代码
function getPlatformCode(){
  return parseInt($('select[name=id]').val());
}


// 触发功能按钮
$("#setCost").parent().append('<a title="创建价格快照" id="newPriceShot" class="btn btn-default">价格快照</a>');
$('#newPriceShot').on('click', async () => {
  priceShotView.show();
});
