// ==UserScript==
// @name         scheduleUitls
// @namespace    http://tampermonkey.net/
// @version      3.11.5
// @description  排班数据同步专用工具箱测试更改
// @author       You
// @match        andon.oa.com/micro/base/system-admin/schedule*
// @match        andon.woa.com/micro/base/system-admin/schedule*
// @match        s.xinrenxinshi.com/attendance*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/427817/scheduleUitls.user.js
// @updateURL https://update.greasyfork.org/scripts/427817/scheduleUitls.meta.js
// ==/UserScript==

(function() {
	Date.prototype.format = function(fmt) {
		var o = {
			"M+" : this.getMonth()+1,	//月份
			"D+" : this.getDate(),	//日
			"h+" : this.getHours(),	//小时
			"m+" : this.getMinutes(),	//分
			"s+" : this.getSeconds()	//秒
		};
		if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return fmt;
	}
	const config = {
		addStyle(text){//添加样式表到页面
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML=text;
			document.getElementsByTagName('head').item(0).appendChild(style);
		},
		getQueryStr(name){//获取url中的参数
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return unescape(r[2]); return null;
		},
		async ajax(d) { //网络请求
			let cg = {headers: {'Content-Type': d['Content-Type']||'application/json'},method: d.type || 'GET'};
			if(d.headers){
				for (let s in d.headers) {
					cg.headers[s] = d.headers[s];
				}
			}
			if (d.cookie) cg.credentials = "include";
			if (d.type == 'POST') cg.body = d.body||JSON.stringify(d.data || {});
			return (await fetch(d.url, cg)).json();
		},
		async createUl(option){//创建右侧工具栏
			if(!option) return;
			let body = document.getElementsByTagName('body')[0];
			let ul = document.createElement('ul');
			ul.setAttribute('class', 'tools-ul');
			option.forEach((e,i)=>{
				let li = document.createElement('li');
				if(e.html){//自定义
					li.innerHTML = e.html;
					li.className = e.className||"input-li";
				}else{//默认按钮
					li.textContent = e.name;
				}
				li.onclick = e.func?e.func:async function(){
					if(!e.url) return;
					let url = e.url;
					if(e.url && e.url.indexOf('{{uin}}')>-1){//链接有uin则去获取
						await config.getUserInfo();
					}
					if(e.url.indexOf('{{uin}}')>-1) url = url.replace('{{uin}}',config.userinfo.uin);
					window.open(url);
				}
				ul.appendChild(li);
			});
			body.appendChild(ul);
		},
		async allRun(){//开始运行
			for(let e of this.allPages){
				if(location.href.indexOf(e.path) > -1){
					config.addStyle(config.commonCss+e.css);//写入页面样式表
					this.createUl(e.ulOption);//创建右侧工具栏
					e.js();//执行对应的js脚本
					break;
				}
			}
		},
		getStaEndDate(date){//获取特定时间月份或当前月的起止日期(无入参则为当前月)
			let ym = (date||new Date()).format('YYYY-MM');
			let arr = ym.split('-');
			let day = new Date(arr[0], arr[1], 0).getDate();
			return {sta:`${ym}-01`,end:`${ym}-${day<10?('0'+day):day}`};
		},
		commonCss:`
			::-webkit-scrollbar {width: 5px;height: 10px;}
			::-webkit-scrollbar-thumb {border-radius: 5px;-webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);background: rgba(0, 0, 0, 0.2);}
			::-webkit-scrollbar-track {-webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);border-radius: 0;background: rgba(0, 0, 0, 0.1);}
			ul.tools-ul {position: fixed;right: 0;top: 20px;margin: 20px;z-index: 999;list-style: none;padding: 0;font-size: 13px;}
			ul.tools-ul li {cursor: pointer;background: #fff;padding: 5px;border: 1px solid #9E9E9E;margin-bottom: 10px;transition: .3s;border-radius: 5px;line-height: 1rem;text-align: center;}
			ul.tools-ul li:not(.input-li):hover {color: #fff;background: #FF5722;border-color: #FF9800;}
			ul.tools-ul input {border: 0;padding: 5px;width: 130px;}
			ul.tools-ul input[type=date] {padding: 3px 5px;}
			ul.tools-ul li.input-li {padding: 0;}
		`,
		allPages:[{
			path:'micro/base/system-admin/schedule',
			css:`
			`,
			async js(){
				$('body').append(`
				<div id="app-u">
					<div style="position: fixed; z-index: 999;max-width: 150px; top:0; right:0; padding-right: 10px; margin-top: 50px; text-align: right;overflow: auto;max-height: 100vh;" >
						<div :span="24" style="margin-bottom: 10px;">
              <input type="date" :value="date.sta" @input="date.sta = $event.target.value" placeholder="开始日期" />
						</div>
						<div :span="24" style="margin-bottom: 10px;">
              <input type="date" :value="date.end" @input="date.end = $event.target.value" placeholder="结束日期" />
						</div>
						<div :span="24" style="margin-bottom: 10px;">
              <button type="primary" size="mini" @click="AutoTime=1" plain round>{{tips}}</button>
						</div>
					</div>
				</div>
				`)
				new Vue({
					el:'#app-u',
					data(){
						return {
							date:config.getStaEndDate(),
							AutoTime:30*60,//设定定时器任务为30分钟
							normWork: {}, //标准早班对象
							code_name: {}, //排班对应排班码
							err:[],//安灯未定义班次
							printArr:[],//打印对象
							resultData:{},//需要保存的数据对象
							doing:false,//是否执行中
							andonData:{},//安灯查询结果缓存区
						};
					},
					computed:{
						tips(){
							return this.doing?`执行中(${-this.AutoTime}秒)...`:`剩${Math.floor(this.AutoTime/60)}分${this.AutoTime%60}秒后执行`;
						},
						dateList(){//自动计算的日期列表
							let list = [];
							if(this.date.sta && this.date.end){
								let start = new Date(this.date.sta),end = new Date(this.date.end);
								while (start <= end) {
									list.push(start.format('YYYY-MM-DD'));
									start = new Date(start.setDate(start.getDate() + 1)); //当前时间+一天
								}
							}
							return list;
						}
					},
					async created(){
						setInterval(async()=>{
							this.AutoTime --;
							if(this.AutoTime == 0 && !this.doing) {
								this.doing = true;
								await this.start();
								this.AutoTime = 30*60;
								this.doing = false;
							}
						},1000);//一秒一次
					},
					methods:{
						async start() { //开始函数
							this.err = {},this.andonData = {},this.printArr = [],this.resultData = {}; //清空值
							let pbData = await config.ajax({url: 'https://forget-1302428365.ap-shanghai.app.tcloudbase.com/getPbData'}); //获取排班人员和排班对应表信息
							this.code_name = pbData.pbCode; //写入排班对应排班码
							this.dateList.map(v=>{//组合法定工作日和法定休息日
								let day = new Date(v).getDay()
								this.normWork[v] = pbData.legalHoliday[v]?false:pbData.legalWorkingday[v]?true:(day==0||day==6)?false:true
							})
							await Promise.all(pbData.pbInfo.map((nowU)=>{return this.setOneUserPb(nowU)}));//批量组装数据
							let doDate = new Date().format('YYYY-MM-DD hh:mm:ss');//执行时间为当前时间
							if(Object.keys(this.err).length == 0){//没有异常班次可导入覆盖
								if(Object.keys(this.resultData).length > 0){
									let req = await config.ajax({url:'https://forget-1302428365.ap-shanghai.app.tcloudbase.com/setPbData',data:{userData:this.resultData},type:'POST'});
									let tips = `${doDate} => 已执行导入${this.printArr.length}人的排班数据。`;
									//this.$message({message: tips,type: 'success',duration:0,showClose:true});
                  alert(tips)
									console.log('%c'+tips,'color:#409eff;font-weight:800',this.printArr,req);
								}else{
									//this.$message({showClose: true,message: '无任何班次调整，无需同步。'});
                  alert("无任何班次调整，无需同步。")
									console.log(`%c${doDate} => 无任何班次调整，无需同步。`,'color:green');
								}
							}else{
								//this.$message({message: '有新的安灯排班码，请及时处理。',type: 'error',duration:0,showClose:true});
                alert("有新的安灯排班码，请及时处理。")
								console.log(`%c${doDate} => 有新的安灯排班码，请处理。`,'color:red',this.err);
							}
						},
						async setOneUserPb(nowU){//写入某一个用户的排班数据
							let nowUserObj = {};
							for (let date of this.dateList) {//遍历需要处理的日期
								let value = '',oldPb = (nowU.pbData&&nowU.pbData[date])||{};//新班次和旧班次
								if(this.isDateIn(date,{sta:nowU.work.start,end:nowU.work.end})){//日期在在职时间范围内
									if(nowU.pb.type=='zdy' && this.isDateIn(date,{sta:nowU.pb.start,end:nowU.pb.end})){//自定义班次
										value = this.normWork[date]?nowU.pb.value:'休';
									}else if(nowU.pb.type=='andon' && this.isDateIn(date,{sta:nowU.pb.start,end:nowU.pb.end})){//日期在安灯排班时间范围内
										value = await this.getAdonPb(nowU.vName||nowU.pName,date);//获取安灯班次
									}else{//其它情况取默认早班班次
										value = this.normWork[date]?'早':'休';
									}
								}
								if(!oldPb.changeUser && oldPb.value !== value){//旧班次未被强制修改且有变化
									nowUserObj[date] = {value};//写入需要修改的班次
								}
							}
							if(Object.keys(nowUserObj).length > 0){//存在需要修改的值，才写入
								this.printArr.push({name:nowU.name,pName:nowU.vName||nowU.pName||'',...nowUserObj});//需要打印的对象
								this.resultData[nowU._id] = nowUserObj;//写入
							}
						},
						async getAdonPb(pname,date){//根据p账号和日期获取查询日期的安灯排班数据
							let value = '休';//默认休
							if(!this.andonData[pname]){
								let {data} = await config.ajax({url: `/admin/api/ticket/schedules?start=${this.dateList[0]}&end=${this.dateList[this.dateList.length-1]}&page=1&limit=15&user_id[]=${pname}&query_type=normal`});
								this.andonData[pname] = data.data[pname]?data.data[pname].schedules:{};
							}
							let newPbObj = this.andonData[pname][date];
							if(newPbObj && newPbObj.work_id){//存在安灯排班则根据班次码转换
                newPbObj.work_id = newPbObj.work_id.replace('\n','') //兼容错误回车符
                if(!newPbObj.work_id) return value; //班次不存在（为休）提前结束
								value = this.code_name[newPbObj.work_id];
								if(!value){
									if(this.err[newPbObj.work_id]){
										this.err[newPbObj.work_id].push({[pname]:newPbObj});//有未知安灯班次，需要处理
									}else{
										this.err[newPbObj.work_id] = [{[pname]:newPbObj}];
									}
								}
							}
							return value;
						},
						isDateIn(date,dateObj){//判断日期是否在范围内
              let _date = date + ' 00:00:00'
							let result = dateObj.sta && (new Date(_date) >= new Date(dateObj.sta) || dateIsEq(_date,dateObj.sta));//开始时间存在且判断时间大于开始时间
							if(result && dateObj.end){//满足开始时间判断，且有结束时间才判断结束范围
								result = new Date(_date) <= new Date(dateObj.end) || dateIsEq(_date,dateObj.end);//判断时间小于等于结束时间
							}
							return result;
              function dateIsEq(a,b){
                return new Date(a).format('YYYY-MM-DD') == new Date(b).format('YYYY-MM-DD')
              }
						}
					}
				});
			}
		},{
			path:'s.xinrenxinshi.com/attendance',
			css:`
			`,
			async js(){
				$('body').append(`
				<div id="app-u">
					<el-row style="position: fixed; z-index: 10;max-width: 150px; top:0; right:0; padding-right: 10px; margin-top: 50px; text-align: right;overflow: auto;max-height: 100vh;" >
						<el-col :span="24" style="margin-bottom: 10px;">
							<el-date-picker v-model="yearmo" type="month" value-format="yyyyMM" placeholder="处理年月" style="width: 100%;" > </el-date-picker>
						</el-col>
						<el-col :span="24" style="margin-bottom: 10px;">
							<el-tooltip class="item" effect="dark" content="点击立即执行" placement="left-start">
								<el-button type="primary" size="mini" @click="AutoTime=1" plain round>{{tips}}</el-button>
							</el-tooltip>
						</el-col>
					</el-row>
				</div>
				`)
				new Vue({
					el:'#app-u',
					data(){
						return {
							yearmo:new Date().format('YYYYMM'),//年月
							id_code:{},//通过id匹配排版码
							name_code:{},//通过name匹配排版码
							AutoTime:10*60,//时间
							doing:false,//是否执行中
							csrfToken:'',
							planId:'240106',
							userList:[],//用户列表
						};
					},
					computed:{
						tips(){
							return this.doing?`执行中(${-this.AutoTime}秒)...`:`剩${Math.floor(this.AutoTime/60)}分${this.AutoTime%60}秒后执行`;
						},
						userNo_pbData(){
							let obj = {};
							for (let user of this.userList) {//便遍历需要导入的数据
								obj[user.userNo] = user;
							}
							return obj;
						}
					},
					async created(){
						setInterval(async()=>{
							this.AutoTime --;
							if(this.AutoTime == 0 && !this.doing) {
								this.doing = true;
								await this.start();
								this.AutoTime = 10*60;
								this.doing = false;
							}
						},1000);//一秒一次
					},
					methods:{
						async _post(url,param){//薪人薪事专用post
							let body = `data=${encodeURIComponent(JSON.stringify(param))}`;
							return config.ajax({url: url,type:'POST',cookie:true,headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-CSRF-TOKEN':this.csrfToken},body}); //请求
						},
						async lzFun(){//离职信息同步
							let dateStr = `${this.yearmo.slice(0,4)}-${this.yearmo.slice(4)}-01`;
							let dateObj = config.getStaEndDate(new Date(dateStr));
							let lzParam = {
								'type': 2,
								'startDate': dateObj.sta,
								'endDate': dateObj.end,
								'order[0][field]': 'dismissionDate',
								'order[0][dir]': 'asc',
								'start': 0,
								'length': 100,
								'search[value]': 'keyword=&departmentId=&gender=&hireType=&regularState=&bindStatus=&accountStatus=&subjection=&city=&contractId=&contractType=&contractStatus=',
								'search[regex]': false
							}
							let laBody = '';
							for (let key in lzParam) {
								laBody+=`${encodeURIComponent(key)}=${encodeURIComponent(lzParam[key])}&`;
							}
							let {data} = await config.ajax({url: '/employee/service/ajax-get-employee-list',type:'POST',cookie:true,headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-CSRF-TOKEN':this.csrfToken},body:laBody}); //请求
							data = data ? data : []
              let saveData = {}, change=false;
							for (let s of data) {
								let nowUser = this.userNo_pbData[s.jobNumber];
								if(nowUser && (nowUser.work.isJob || new Date(nowUser.work.end).format('YYYY-MM-DD')!=s.dismissionDate)){//如果离职列表的同学在排班系统还在职或者离职日期不对
									change = true;
									saveData[nowUser._id] = {work:{isJob:false,end:s.dismissionDate}};
									nowUser.work.isJob = false;//本地缓存也随之更新
									nowUser.work.end = s.dismissionDate;//本地缓存也随之更新
								}
							}
							if(change){//有新同学离职就执行保存逻辑
								console.log(saveData);
								//执行保存写入逻辑
								let req = await config.ajax({url:'https://forget-1302428365.ap-shanghai.app.tcloudbase.com/setPbData',data:{isJobData:saveData},type:'POST'});
								console.log(req);
							}
						},
            async qjFun(){//请假信息同步
              let qjParam = {
                'start': 0,
                'length': 100,
                'yearmo': this.yearmo,
                'search[value]': `departmentId=&hireType=&rankId=&jobId=&regularState=&subjection=&city=&warnType=&situation=5&keyword=`,
                'search[regex]': false
              }
              let qjBody = '';
              for (let key in qjParam) {
              	qjBody+=`${encodeURIComponent(key)}=${encodeURIComponent(qjParam[key])}&`;
              }
              let {data} = await config.ajax({url: '/attendance/service/ajax-get-attendance-list',type:'POST',cookie:true,headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-CSRF-TOKEN':this.csrfToken},body:qjBody}); //请求
              data = data ? data : []
              let saveData = {}, change=false;
              for (let s of data) {
              	let nowUser = this.userNo_pbData[s.employeeJobNumber];
                let pbData = {}
                for(let key in s){
                  let dateStr = key.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
                  if(`${key}`.includes(this.yearmo) && s[key].statusKeys == '5' && nowUser.pbData[dateStr].value !== '事'){//请假未修改成事
                    pbData[dateStr] = {value: '事'}
                  }
                }
                if(Object.keys(pbData).length){
                  saveData[nowUser._id] = pbData;
                  nowUser.pbData = {...nowUser.pbData, ...pbData}//更新本地缓存
                }
              }
              if(Object.keys(saveData).length){//需要保存
              	//执行保存写入逻辑
              	let req = await config.ajax({url:'https://forget-1302428365.ap-shanghai.app.tcloudbase.com/setPbData',data:{userData:saveData},type:'POST'});
              	console.log(req);
              }
            },
						async start() { //开始函数
							try{
								this.csrfToken = await config.ajax({url: '/support/service/storm/ajax-get-predata?ssotoken='}).then(res=>res.data.csrfToken); //获取token

								this.userList = await config.ajax({url: 'https://forget-1302428365.ap-shanghai.app.tcloudbase.com/getPbData'}).then(res=>res.pbInfo); //获取新排班数据

								//await this.lzFun();//同步所选月离职信息
                
                await this.qjFun();//同步所选月请假信息

								let clockSettings = await this._post('/attShift/service/basics/ajax-get-shift-list',{shiftName:"",labelIds:[],page:1,pageNo:1,pageSize:1000}).then(res=>res.data.list);
								for (let code of clockSettings) {//遍历排班码
									this.id_code[code.clockShiftId] = code;
									this.name_code[code.name] = code;
								}

								let reportData = await this._post('/attShift/service/employeeSchedule/ajax-get-employee-scheduling',{planId:this.planId,yearmo:this.yearmo,shiftType:1,shiftPeriod:2,searchKeyword:"",pageNo:1,pageSize:500,total:1,notSchedulingStaff:0}).then(res=>res.data.reportData);

								this.id_code['0'] = {clockShiftId:'0',name: '休'};this.name_code['休'] = {clockShiftId:'0',name: '休'};//休班次ID为0

								let scheduling = [], workDaysLengths = [], userNames = [];
								for (let user of reportData) {
									if(!this.userNo_pbData[user.jobNumber]) continue;//跳过工号不存在的人
									let {pbData,work,isOvertime,visaFree} = this.userNo_pbData[user.jobNumber];
									let isChange = false;
									for (let key in user) {
										if(user[key].approvalInfo){
											let dateStr = `${key.slice(0,4)}-${key.slice(4,6)}-${key.slice(6,8)}`;//获取日期字符串
											if(!pbData[dateStr]) continue;//跳过不存在班次信息的日期
											let name = pbData[dateStr].value;//获取新班次名称
											if(pbData[dateStr].overtime) name = '休';//加班的强制改休
											else if(pbData[dateStr].visaFree && name!='休') name = '不打卡';//免签、有班次的改不打卡
                      else if(pbData[dateStr].adjustRest) name = '不打卡';//调休的改不打卡
											if(name && name !='休'){//因薪人薪事更新而兼容新的排班码变化
                        if(new Date(dateStr+' 00:00:00') < new Date('2024-01-08 00:00:00') && (name.includes('夜') || name.includes('晚'))) name = '不打卡' //小夜、大夜由于居家所以强制不打卡
												name += '-公有云排班-二线';
											}
                      if(!this.name_code[name] && name) return this.$message({message: `班次${name}不存在，请检查`,type: 'error',duration:0,showClose:true});
											let clockShiftId = name?this.name_code[name].clockShiftId:'';//获取新班次id
											if(clockShiftId != user[key].clockShiftId){//排班有变化
												scheduling.push({employeeId: user.employeeId, dateKey: key, shiftDetailDTO: {id: clockShiftId||'-1'}});//无班次为-1
												isChange = true;//有改动
											}
										}
									}
									if(isChange){//有改动则写入
										workDaysLengths.push({employeeId: user.employeeId});
										userNames.push(user.employeeName);
									}
								}
								let doDate = new Date().format('YYYY-MM-DD hh:mm:ss');
								if(scheduling.length > 0){
									let saveData = {planId:this.planId,yearmo:this.yearmo,payAttendanceType:0,shiftSaveDTOList:scheduling,shiftCycleList:[],workHoursLength:[],workDaysLength:[]};
									let result = await this._post('/attShift/service/employeeSchedule/ajax-save-employee-day-scheduling',saveData);

									let tips = `${doDate} => 已执行导入${workDaysLengths.length}人共${scheduling.length}条排班数据。`;
									this.$message({message: tips,type: 'success',duration:0,showClose:true});
									console.log('%c'+tips,'color:#409eff;font-weight:800',userNames,result.message);
								}else{
									this.$message({showClose: true,message: '无任何班次调整，无需同步。'});
									console.log(`%c${doDate} => 无任何班次调整，无需同步。`,'color:green');
								}
							}catch(e){
								console.log(e);
								this.$message({message: `程序异常，请重试或者联系颜吉军【${e.message}】`,type: 'error',duration:0,showClose:true});
							}
						}
					}
				});
			}
		}]
	}
	config.allRun();
})();