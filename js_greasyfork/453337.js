// ==UserScript==
// @name        薪酬统计
// @namespace   Violentmonkey Scripts
// @match       https://ehr.vanke.com/
// @match       http://10.100.10.57:7777/
// @grant       none
// @version     1.6.6
// @author      Hut
// @require     https://unpkg.com/petite-vue
// @require     https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @description 2022/10/11 14:15:19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453337/%E8%96%AA%E9%85%AC%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/453337/%E8%96%AA%E9%85%AC%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const { createApp } = PetiteVue;

    const root = document.createElement('div');
    root.class = 'wx_draw_wrap';
    root.innerHTML = `
    <div v-show="!popup" class="wx_draw" @click="open">薪酬统计</div>

    <div v-if="popup" class="wx_popup">
      <div class="wx_mask" @click="popup = false"></div>

      <div class="wx_main">
        <div class="wx_header">
          <div>薪酬统计</div>
          <div class="wx_score">获取到人员数量：{{ data?.ET_JSON.length }}</div>
        </div>

        <div class="wx_body">
          <div class="wx_options">
          数据来源：
          <select v-model="dataResource">
              <option style="display:none"></option>
              <option value="service">服务器</option>
                  <option value="local">本地文件</option>
            </select>
               &nbsp;&nbsp;
               <span v-if="dataResource=='service'">
            <select v-model="organization">
              <option style="display:none"></option>
              <option v-for="org in organiztionList" v-bind:value="org.OBJID">{{org.STEXT}}</option>
            </select>
            &nbsp;&nbsp;
            <input type="month" v-model="month" placeholder="请选择月份">&nbsp;&nbsp;
                 查询数据来源：
                     <select v-model="IV_FLAG">
              <option style="display:none"></option>
              <option value="1">系统实时数据</option>
                         <option value="2">系统归档数据</option>
            </select>&nbsp;&nbsp;
            </span>
                <span v-if="dataResource=='local'" style="height:27px">
                  <input type="file" placeholder="请选择文件" @change="fileChange($event)">&nbsp;&nbsp;
                </span>
            <input type="checkbox" v-model="isServiceCentre" placeholder="请选择月份" v-bind:value="true">按服务中心类别统计&nbsp;&nbsp;
            <div @click="statistics()">统计</div>
            <span v-if="errorMessage" style="color:red">&nbsp;&nbsp;{{errorMessage}}</span>
          </div>

          <div class="content-row" v-for="item in result">
            <div class="content-title">{{item.name}}</div>
             <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>专业</th>
                    <th>人数</th>
                    <th v-for="calc in calcItems" v-bind:style="{'background-color':calc.minus?'red':''}">{{calc.name}}</th>
                    <th>人力成本</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in item.value">
                    <td>{{ row.projectName }}</td>
                    <td>{{ row.type }}</td>
                    <td>{{ row.items.length }}</td>
                    <td v-for="data in row.data">{{ data.value }}</td>
                  </tr>
                </tbody>
            </table>
          </div>

          <div v-if="result.length > 0" style="margin-top:10px">
            <div class="wx_options">
              <input v-model="userName" placeholder="请输入想要查询的人员">&nbsp;&nbsp;
              <select v-model="position" allowClear >
              <option style="display:none"></option>
              <option v-for="p in positionList" v-bind:value="p">{{p}}</option>

            </select>&nbsp;&nbsp;    <div @click="position=null;userName=null">清空</div>&nbsp;&nbsp;
              <div @click="statisticsingle()">查询</div>
            </div>
          </div>

          <div class="content-row" v-for="item in userResult">
            <div class="content-title">{{item.name}}</div>
             <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>专业</th>
                    <th>人数</th>
                    <th v-for="calc in calcItems" v-bind:style="{'background-color':calc.minus?'red':''}">{{calc.name}}</th>
                    <th>人力成本</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in item.value">
                    <td>{{ row.projectName }}</td>
                    <td>{{ row.type }}</td>
                    <td>{{ row.items.length }}</td>
                    <td v-for="data in row.data">{{ data.value }}</td>
                  </tr>
                </tbody>
            </table>
          </div>

          <div class="wx_loading" v-if="loading">
            <svg class="circular" viewBox="25 25 50 50">
              <circle class="path" cx="50" cy="50" r="20" fill="none" />
            </svg>
          </div>
        </div>

        <div class="wx_footer">
          <div class="wx_confirm wx_btn" @click="exportFunc">导出</div>
          <div class="wx_confirm wx_btn" @click="popup = false">关闭</div>
        </div>
      </div>
    </div>
  `;


    document.body.appendChild(root); // 插入DOM

    // petite-vue init初始化
    createApp({
        popup: false,
        loading: false,
        month:null,
        organization:null,
        errorMessage:null,
        userName:null,
      position:null,
        data: null,
        result:[],
        userResult:[],
        IV_FLAG:'1',
        organiztionList:[],
      positionList:[],
        isServiceCentre:false,
        dataResource:'service',
        excelData:[],
        calcItems:[
            {
                name:'岗位责任工资',
                key:'1040'
            },
            {
                name:'值班费',
                key:'1090'
            },
            {
                name:'基础工资',
                key:'1060'
            },
            {
                name:'固定加班费',
                key:'1080'
            },
            {
                name:'夜间补助',
                key:'1353'
            },
            {
                name:'岗位津贴',
                key:'1356'
            },
            {
                name:'证件津贴',
                key:'1358'
            },
            {
                name:'年终奖（税前）',
                key:'4079'
            },
            {
                name:'0267奖金（税前）',
                key:'4083'
            },
            {
                name:'基层员工奖励基金',
                key:'1352'
            },
            {
                name:'推荐奖励',
                key:'1360'
            },
            {
                name:'考核（激励）',
                key:'2315'
            },
            {
                name:'150% 加班费',
                key:'2150'
            },
            {
                name:'200% 加班费',
                key:'2200'
            },
            {
                name:'300% 加班费',
                key:'2300'
            },
            {
                name:'课酬',
                key:'1354'
            },
            {
                name:'过节费（税前）',
                key:'4059'
            },
            {
                name:'通讯费',
                key:'1382'
            },
            {
                name:'补发餐费',
                key:'2319'
            },
            {
                name:'补发餐费（不折算）',
                key:'2320'
            },
            {
                name:'计件计薪',
                key:'1410'
            },
            {
                name:'佣金/提成（合并计税）',
                key:'1351'
            },
            {
                name:'职务津贴',
                key:'8030'
            },
            {
                name:'O序列司龄工资(年度起发)',
                key:'8060'
            },
            {
                name:'O序列司龄工资(半年起发)',
                key:'8070'
            },
            {
                name:'税前补项',
                key:'1310'
            },
            {
                name:'事假/旷工扣款',
                key:'1141',
                minus:true
            },
            {
                name:'O1体系事假',
                key:'9020',
                minus:true
            },
            {
                name:'O1体系事假超额',
                key:'9021',
                minus:true
            },
            {
                name:'O1离职到岗月事假扣',
                key:'9080',
                minus:true
            },
            {
                name:'O1体系病假',
                key:'9010',
                minus:true
            },
            {
                name:'O1体系病假超额',
                key:'9011',
                minus:true
            },
            {
                name:'O1离职到岗月病假扣',
                key:'9070',
                minus:true
            },
            {
                name:'税前扣项',
                key:'1320',
                minus:true
            },
            {
                name:'迟到/早退5-15分钟扣款',
                key:'1110',
                minus:true
            },
            {
                name:'迟到/早退15分钟-2小时扣款',
                key:'1120',
                minus:true
            },
            {
                name:'贺仪奠仪',
                key:'6022'
            },
            {
                name:'税后扣项',
                key:'1340',
                minus:true
            },
            {
                name:'欠款抵消',
                key:'6203'
            },
            {
                name:'星级津贴',
                key:'1357'
            },
            {
                name:'离职补偿金',
                key:'6001'
            },
            {
                name:'考核（负激励）',
                key:'2316',
                minus:true
            },
            {
                name:'养老补缴金额（公司）',
                key:'6023'
            },
            {
                name:'养老补退金额（公司）',
                key:'6029',
                minus:true
            },
            {
                name:'养老保险雇主实缴',
                key:'314'
            },
            {
                name:'失业补缴金额（公司）',
                key:'6026'
            },
            {
                name:'失业补退金额（公司）',
                key:'6032',
                minus:true
            },
            {
                name:'失业保险雇主实缴',
                key:'324'
            },
            {
                name:'医疗补缴金额（公司）',
                key:'6024'
            },
            {
                name:'医疗补退金额（公司）',
                key:'6030',
                minus:true
            },
            {
                name:'医疗保险雇主实缴',
                key:'334'
            },
            {
                name:'工伤补缴金额（公司）',
                key:'6025'
            },
            {
                name:'工伤补退金额（公司）',
                key:'6031',
                minus:true
            },
            {
                name:'工伤保险雇主实缴',
                key:'344'
            },
            {
                name:'生育保险雇主实缴',
                key:'354'
            },
            {
                name:'住房补缴金额（公司）',
                key:'6028'
            },
            {
                name:'住房公积金保险雇主实交',
                key:'363'
            },
            {
                name:'回算正数',
                key:'6201'
            },
            {
                name:'回算负数',
                key:'6202',
                minus:true
            }
        ],
        serviceCalcItems:[
            {
                name:'未休假期折算',
                key:'1380'
            },{
                name:'病假扣款',
                key:'1150',
                minus:true
            },{
                name:'反算金额',
                key:'552'
            },{
                name:'基本工资',
                key:'1010'
            }
        ],
        async open(){
            this.getOrganiztion();
            this.popup = true;
        },
        async getOrganiztion(){
            const res = await fetch('https://ehr.vanke.com/ehr-service/infoMaint/base?searchCriterias=%5B%7B%22fieldName%22:%22IV_PERNR%22,%22value%22:%22%22,%22valueType%22:%22USER%22,%22operator%22:%22EQ%22%7D,%7B%22fieldName%22:%22IV_PAGECODE%22,%22value%22:%22RPT%22,%22valueType%22:%22STRING%22,%22operator%22:%22EQ%22%7D,%7B%22fieldName%22:%22IV_FUNCODE%22,%22value%22:%22PY003%22,%22valueType%22:%22STRING%22,%22operator%22:%22EQ%22%7D%5D&type=10033', {
                headers: {
                    cookie: document.cookie
                },
                method: 'get',
                credentials: 'include'
            }).then((res) => res.json());
            this.organiztionList = res.IT_DATA[0].ORGEH;
        },
        async fileChange(e){
            console.log(e)
            for (let file of e.target.files) {
                let reader = new FileReader();
              let that = this;
                reader.readAsBinaryString(file);
                reader.onload = function (evt) {

                    let data = evt.target.result;
                    let workbook = XLSX.read(data, {
                        type: 'binary'
                    }) // 以二进制流方式读取得到整份excel表格对象
                    let buildings = []; // 存储获取到的数据
                    let fromTo = '';
                    // 遍历每张表读取
                    for (let sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            fromTo = workbook.Sheets[sheet]['!ref'];
                            buildings = buildings.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                            // break; // 如果只取第一张sheet表，就取消注释这行
                        }
                    }
                    console.log(buildings)
                    that.excelData = buildings;
                    let calcItemsAll = that.calcItems.concat(that.serviceCalcItems);
                  let format = [];
                  buildings.forEach(data => {
                    let wageJson = {};
                    Object.keys(data).forEach(key => {
                      let temp = calcItemsAll.find(x => x.name == key);
                      if(key == '一级职能'){
                        temp = {
                          name:'一级职能',
                          key:'ZGWZY'
                        }
                      }
                      if(temp){
                        wageJson[temp.key] = data[key];
                      }
                    })
                    format.push({WAGE_JSON:JSON.stringify(wageJson)})
                  })
                    that.data = {ET_JSON:format}
                  console.log('excel',that.data)
                };
            }
        },
        async statistics() {
            if(this.dataResource == 'service'){
                if(!this.organization) return this.errorMessage = '请选择组织';
                if(!this.month) return this.errorMessage = '请选择月份';
                console.log(this.month);
                console.log(this.organization);
            }

            if(this.dataResource == 'local'){
                if(!this.excelData) return this.errorMessage = '请上传文件';
            }

            console.log(this.isServiceCentre);
            this.calcItems = this.calcItems.filter(x => !this.serviceCalcItems.some(y => y.key == x.key));
            if(this.isServiceCentre){
                this.calcItems = this.calcItems.concat(this.serviceCalcItems)
            }
            this.errorMessage = null;

            this.loading = true;
            if(this.dataResource == 'service'){
                         this.data = null;
                const params = {
                    "searchCriterias":[
                        {"fieldName":"IV_ORGEH","operator":"EQ","value":this.organization,"valueType":"LIST"},
                        {"fieldName":"IV_PERNR","operator":"EQ","value":[],"valueType":"LIST"},
                        {"fieldName":"IV_ENAME","operator":"EQ","value":[],"valueType":"LIST"},
                        {"fieldName":"IV_ABKRS","operator":"EQ","value":[],"valueType":"LIST"},
                        {"fieldName":"IV_PERIOD_B","operator":"EQ","value":this.month.replace('-','')},
                        {"fieldName":"IV_PERIOD_E","operator":"EQ","value":this.month.replace('-','')},
                        {"fieldName":"IV_ZSCKJ","operator":"EQ","value":"1"},
                        {"fieldName":"IV_ZSCBY","operator":"EQ","value":"2;","valueType":"LIST"},
                        {"fieldName":"IV_ZSCGS","operator":"EQ","value":"1"},
                        {"fieldName":"IV_USER","operator":"EQ","value":"","valueType":"USER"},
                        {"fieldName":"IV_MOLGA","operator":"EQ","value":"28","valueType":"STRING"},
                        {"fieldName":"IV_BAREA","operator":"EQ","value":"B","valueType":"STRING"},
                        {"fieldName":"IV_SPRAS","operator":"EQ","value":"1","valueType":"STRING"},
                        {"fieldName":"IV_PAGECODE","operator":"EQ","value":"RPT","valueType":"STRING"},
                        {"fieldName":"IV_FUNCODE","operator":"EQ","value":"PY002","valueType":"STRING"},
                        {"fieldName":"IV_FLAG","operator":"EQ","value":this.IV_FLAG,"valueType":"STRING"},
                        {"fieldName":"IV_SUM","operator":"EQ","value":"Y","valueType":"STRING"}
                    ]
                }
                console.log(params)
                const res = await fetch('https://ehr.vanke.com/ehr-service/api/report/base?type=10010', {
                    headers: {
                        cookie: document.cookie
                    },
                    body:JSON.stringify(params),
                    method: 'post',
                    credentials: 'include'
                }).then((res) => res.json());
                this.data = res;
            }

            console.log(this.data)
            this.result = [];
          this.positionList = []
            let originResult = [];
            this.data.ET_JSON.forEach(item => {
                let json = JSON.parse(item.WAGE_JSON);
                let type = json.ZGWZY == '' || !json.ZGWZY?'离职':json.ZGWZY;
                let parent = originResult.find(x => x.type == type);
              if(json.ZZW && !this.positionList.find(x => x ==json.ZZW)){
                this.positionList.push(json.ZZW)
              }
                if(!parent){
                    originResult.push({
                        type:type,
                        items:[json],
                        projectName:json.ZZD_2,
                        data:[]
                    })
                }else{
                    parent.items.push(json)
                }
            })
            console.log(originResult)
            this.caculate(originResult)
            this.result.push({
                name:'合并前原始数据统计',
                value:originResult
            })
            let combineResult = [];
            let tips = '';
            if(!this.isServiceCentre) {
                combineResult = JSON.parse(JSON.stringify(originResult)).filter(x => x.type.indexOf('安全') != -1 || x.type.indexOf('安防') != -1 || x.type.indexOf('机电') != -1);
                let target = combineResult.find(x => x.type.indexOf('安全') != -1 || x.type.indexOf('安防') != -1);
                if(target){
                    originResult.forEach(item => {
                        if(item.type.indexOf('安全') == -1 && item.type.indexOf('安防') == -1 && item.type.indexOf('机电') == -1){
                            target.items = target.items.concat(item.items)
                        }
                    })
                }


                combineResult.forEach(item => {
                    item.data = [];
                    let diff = item.items.filter(x => x.PTEXT.indexOf('残障') != -1);
                    item.items = item.items.filter(x => x.PTEXT.indexOf('残障') == -1);
                    if(diff.length > 0){
                        tips += `  已排除残障人员：${diff.map(x => x.ENAME)},隶属岗位：${item.type}`
          }
                })
            }else{
                combineResult = [{
                    type:'全部',
                    items:[],
                    projectName:null,
                    data:[]
                }];
                JSON.parse(JSON.stringify(originResult)).forEach(item => {
                    combineResult[0].items = combineResult[0].items.concat(item.items);
                    combineResult[0].projectName = item.projectName;
                })
            }

            this.caculate(combineResult)
            this.result.push({
                name:'合并后数据统计'+ tips,
                value:combineResult
            })

            console.log(this.result)
            this.loading = false;
        },
        async statisticsingle(){
            if(!this.userName && !this.position) return;
            this.userResult = [];
            let list = JSON.parse(JSON.stringify(this.result[0].value));
            list = list.filter(x => x.items.some(y => y.ENAME?.replace(/\s*/g,"") == this.userName?.replace(/\s*/g,"") || y.ZZW?.replace(/\s*/g,"") == this.position?.replace(/\s*/g,"")));
            list.forEach(item => item.items = item.items.filter(x => x.ENAME?.replace(/\s*/g,"") == this.userName?.replace(/\s*/g,"") || x.ZZW?.replace(/\s*/g,"") == this.position?.replace(/\s*/g,"")));
            list.forEach(item => item.data = []);
            console.log(JSON.parse(JSON.stringify(list)))
            this.caculate(list);
            this.userResult.push({
                name:this.userName + ' 数据统计',
                value:list
            })
        },
        async caculate(data){
            data.forEach(item => {
                this.calcItems.forEach(calc => {
                    let value = item.items.length > 1 ? item.items.map(x => x[calc.key]).reduce((pre, cur) => {
                        return this.getValue(pre) + this.getValue(cur)
                    }): this.getValue(item.items[0][calc.key]);
                    value = value.toFixed?value.toFixed(2):null;
                    if(calc.minus) value = -value;
                    item.data.push({
                        value:value,
                        ...calc
                    })
                })
                let total = item.data.map(x => x.value).reduce((pre, cur) => {
                    return this.getValue(pre) + this.getValue(cur)
                });
                total = total.toFixed?total.toFixed(2):null;
                item.data.push({
                    key:'total',
                    name:'人力成本',
                    value:total
                })
            })
            console.log(data)
        },
        getValue(value){
            return isNaN(parseFloat(value))?0:parseFloat(value)
        },
        async exportFunc(){
            // 列标题
            let str = '<tr><td>项目名称</td><td>专业</td><td>人数</td>';
            this.calcItems.forEach(item => str+= item.minus?`<td style="background-color:red">${item.name}</td>`:`<td>${item.name}</td>`)
            str+= '<td>人力成本</td></tr>'
            // 循环遍历，每行加入tr标签，每个单元格加td标签
            this.result[1].value.forEach(item => {
                str+='<tr>';
                str+=`<td>${ item.projectName + '\t'}</td>`;
                str+=`<td>${ item.type + '\t'}</td>`;
                str+=`<td>${ item.items.length + '\t'}</td>`;
                item.data.forEach(data => {
                    str+=`<td>${ data.value + '\t'}</td>`;
                })
                str+='</tr>';
            })
            // Worksheet名
            const worksheet = 'Sheet1'
            const uri = 'data:application/vnd.ms-excel;base64,';

            // 下载的表格模板数据
            const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
            // 下载模板
            window.location.href = uri + window.btoa(unescape(encodeURIComponent(template)));
        }
    }).mount();

    // 处理样式
    const style = `
    .wx_draw_wrap {
      box-sizing: border-box;
      position: fixed;
      top: 50%;
      left: 0px;
      z-index: 888888;
      margin-top: -20px;
    }
    .wx_draw {
      box-sizing: border-box;
      position: fixed;
      top: 50%;
      left: 0px;
      z-index: 888888;
      width: 40px;
      height: 40px;
      line-height: 16px;
      font-size: 12px;
      padding: 4px;
      background-color: rgb(232, 243, 255);
      border: 1px solid rgb(232, 243, 255);
      color: rgb(30, 128, 255);
      text-align: center;
      overflow: hidden;
      cursor: pointer;
    }
    .wx_popup {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
    }
    .wx_mask {
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
    }
    .wx_main {
      position: absolute;
      left: 50%;
      top: 50%;
      min-width: 520px;
      width: max-content;
      max-width:90%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 4px;
    }
    .wx_main .wx_header {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      padding: 0 16px;
      border-bottom: 1px solid #999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #000;
      font-weight: 400;
    }
    .wx_score {
      font-size: 12px;
      font-size: #00a100;
    }
    .wx_main .wx_body {
      padding: 16px;
      border-bottom: 1px solid #999;
      position: relative;
      width:100%;
      overflow:auto;
    }
    .content-title{
      color:red;
    }
    .wx_main .wx_options {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .wx_main .wx_options input{
      border: 1px solid #ddd;
    }
    .wx_main .wx_options div {
      width: 80px;
      text-align: center;
      height: 24px;
      line-height: 24px;
      background-color: rgb(232, 243, 255);
      border: 1px solid #c9d4e3;
      color: rgb(30, 128, 255);
      cursor: pointer;
      border-radius: 2px;
    }
    .wx_main .wx_body p {
      margin: 0 0 8px;
    }
    .wx_body table {
      width: 100%;
      text-align: center;
      border-left: 1px solid #ccc;
      border-top: 1px solid #ccc;
    }
    .wx_body table th,
    .wx_body table td {
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      line-height: 20px;
    }
    .wx_body table th {
      line-height: 28px;
      min-width: 100px;
    }
    .wx_main .wx_body img {
      vertical-align: middle;
      width: 40px;
      height: 40px;
    }
    .wx_main .wx_footer {
      padding: 12px 16px;
      text-align: right;
    }
    .wx_btn {
      display: inline-block;
      width: 48px;
      cursor: pointer;
      text-align: center;
      height: 20px;
      line-height: 20px;
      background-color: rgb(232, 243, 255);
      border: 1px solid #c9d4e3;
      color: rgb(30, 128, 255);
      border-radius: 2px;
    }
    .wx_loading {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      background: rgba(0,0,0,0.1);
    }
    .wx_loading .circular {
      height: 42px;
      width: 42px;
      -webkit-animation: loading-rotate 2s linear infinite;
      animation: loading-rotate 2s linear infinite;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -21px;
      margin-left: -21px;
    }
    .wx_loading .path {
      -webkit-animation: loading-dash 1.5s ease-in-out infinite;
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: #409eff;
      stroke-linecap: round;
    }
    @keyframes loading-rotate {
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes loading-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
      }
    }
  `;

    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
})();
