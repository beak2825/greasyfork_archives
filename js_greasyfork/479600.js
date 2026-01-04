// ==UserScript==
// @name         人人贷自动划扣
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动划扣50，成功即微信server酱推送提醒
// @author       Bor1s
// @license      MIT
// @match        https://amp.creditcloud.com/case/mergeCase*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/479600/%E4%BA%BA%E4%BA%BA%E8%B4%B7%E8%87%AA%E5%8A%A8%E5%88%92%E6%89%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/479600/%E4%BA%BA%E4%BA%BA%E8%B4%B7%E8%87%AA%E5%8A%A8%E5%88%92%E6%89%A3.meta.js
// ==/UserScript==

let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/vue/2.7.9/vue.min.js";
document.documentElement.appendChild(script);
let link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.href = "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
document.documentElement.appendChild(link);
let elscript = document.createElement('script');
elscript.setAttribute('type', 'text/javascript');
elscript.src = "https://unpkg.com/element-ui/lib/index.js";
document.documentElement.appendChild(elscript);
window.onload = function () {
    var btn = document.createElement('button');
    btn.innerText = '😉';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.left = '50%';
    btn.style.zIndex = '99';
    document.body.appendChild(btn);

    let text = `
    <style>
		.container {
			height: 745px;
            background-color:#ECECF1;
		}

		.aside {
			margin: 20px 0 0 20px;
			background-color: #f5f5f5;
			padding: 20px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
		}

		.aside .el-input {
			margin-bottom: 10px;
		}

		.aside .el-button {
			margin: 20px auto;
		}

		.main {
			padding: 20px;
			box-sizing: border-box;
		}

		.card {
			padding: 20px;
		}

		.table {
			width: 100%;
		}

		.empty {
			text-align: center;
			margin-top: 20px;
		}
	</style>
		<div id="appaa">
			<el-container class="container">
				<!-- 左侧布局 -->
				<el-aside width="200px" class="aside">
					<el-button style="margin:20px auto;" type="primary" @click="getList">获取列表</el-button>
                    <el-input v-model="input" placeholder="请输入内容"></el-input>
					<el-button style="margin:20px auto;" type="primary" @click="start">开始执行</el-button>
					<el-button style="margin:20px auto;" type="primary" @click="end">停止执行</el-button>
					<el-button style="margin:20px auto;" type="primary" @click="exportToExcel">导出结果</el-button>
					<el-input v-model="sKey" placeholder="请输入推送key"></el-input>
				</el-aside>

				<!-- 右侧布局 -->
				<el-container>
					<el-main class="main">
						<el-card class="card">
							<el-table height="550" border :data="list" v-if="list.length > 0" class="table">
								<el-table-column label="序号" type="index"></el-table-column>
                                <el-table-column label="id" prop="acctno"></el-table-column>
								<el-table-column label="姓名" prop="name"></el-table-column>
								<el-table-column label="时间" prop="time"></el-table-column>
								<el-table-column prop="result" label="结果" width="100"
									:filters="[{ text: '成功', value: 'SUCCESS' }, { text: '失败', value: 'FAILURE' }]"
									:filter-method="filterTag" filter-placement="bottom-end">
									<template slot-scope="scope">
										<el-tag :type="scope.row.result === 'FAILURE' ? 'danger' : 'success'"
											disable-transitions>{{scope.row.result}}</el-tag>
									</template>
								</el-table-column>
							</el-table>
							<div v-else class="empty">请先获取列表数据</div>
						</el-card>
					</el-main>
				</el-container>
			</el-container>
		</div>
  `;

    var el = document.createElement('div');
    el.innerHTML = text;
    //el.style.display = "none";
    el.style.position = 'fixed';
    el.style.width = "60%";
    //el.style.height = "100%"
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = 'translate(-50%, -50%)';
    el.style.opacity = '0';
    el.style.zIndex = '10';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);

    new Vue({
        el: '#appaa',
        data: {
            username: '',
            list: [],
            token: '',
            num: 0,
            input: 0,
            sKey: ''
        },
        mounted() {
            const savedKey = localStorage.getItem('myKey');
            if (savedKey) {
                this.inputKey = savedKey;
            }
        },
        methods: {
            //获取列表
            getList() {
                document.querySelector("#appaa > section > section > main > div > div > .empty").innerText = "加载中~请等亿等~"
                this.username = JSON.parse(localStorage.getItem("youxin-ceres-user")).userInfo.userName;
                //this.getToken();
                this.token = JSON.parse(localStorage.getItem("youxin-ceres-user")).token;
                if (this.username == null || this.username == undefined || this.username == "") {
                    this.$message({
                        type: 'error',
                        message: '登录了吗？好厚米'
                    });
                    return
                }
                fetch("https://amp.creditcloud.com/api/v3/product-customer/progress", {
                    "headers": {
                        "authorization": this.token
                    }
                }).then(ress => { return ress.json() }).then(res => {
                    //获取到最大列表
                    this.num = res.data.total
                    localStorage.setItem('num', res.data.total)
                    if (this.num > 0) {
                        //如果大于1000则要分次请求
                        if (this.num > 1000) {
                            fetch("https://amp.creditcloud.com/api/v3/product-customer/self/page?pageNum=1&pageSize=1000&order=%7B%7D", {
                                "headers": {
                                    "accept": "application/json, text/plain, */*",
                                    "accept-language": "zh-CN,zh;q=0.9",
                                    "authorization": this.token,
                                    "content-type": "application/json",
                                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "no-cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-username": this.username
                                },
                                "referrer": "https://amp.creditcloud.com/case/mergeCase",
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": "{\"pageNum\":1,\"pageSize\":1000,\"order\":{},\"assetCategorys\":[],\"assetTypeCodes\":[],\"storeStatus\":null,\"id\":null,\"registeredCities\":[],\"registeredCitiesShow\":[],\"acctNo\":null,\"partnerUserId\":null,\"custName\":null,\"collOrg\":[],\"collector\":[],\"idNo\":null,\"startOverDueDays\":null,\"endOverDueDays\":null,\"mobilePhone\":null,\"statusCodes\":[],\"startOverDueAmt\":null,\"endOverDueAmt\":null,\"functionCodes\":[],\"startRemainPrincipal\":null,\"endRemainPrincipal\":null,\"label\":null,\"lastCollTimeEnd\":null,\"lastCollTimeStart\":null,\"consignmentBeginDateEnd\":null,\"consignmentBeginDateStart\":null,\"consignmentEndDateStart\":null,\"consignmentEndDateEnd\":null,\"lastRepaymentTimeStart\":null,\"lastRepaymentTimeEnd\":null,\"residentialCities\":[],\"residentialCitiesShow\":[],\"updatePredictiveCalloutActive\":null,\"lastInboundStatus\":null}",
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            }).then(response => response.json())
                                .then(data => {
                                    for (var i = 0; i < 1000; i++) {
                                        this.list.push({
                                            name: data.data.list[i].name,
                                            acctno: data.data.list[i].defaultAcctNo
                                        });
                                    }
                                    fetch("https://amp.creditcloud.com/api/v3/product-customer/self/page?pageNum=2&pageSize=" + (this.num - 1000) + "&order=%7B%7D", {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "accept-language": "zh-CN,zh;q=0.9",
                                            "authorization": this.token,
                                            "content-type": "application/json",
                                            "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                            "sec-ch-ua-mobile": "?0",
                                            "sec-ch-ua-platform": "\"Windows\"",
                                            "sec-fetch-dest": "empty",
                                            "sec-fetch-mode": "no-cors",
                                            "sec-fetch-site": "same-origin",
                                            "x-username": this.username
                                        },
                                        "referrer": "https://amp.creditcloud.com/case/mergeCase",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "body": "{\"pageNum\":2,\"pageSize\":" + (this.num - 1000) + ",\"order\":{},\"assetCategorys\":[],\"assetTypeCodes\":[],\"storeStatus\":null,\"id\":null,\"registeredCities\":[],\"registeredCitiesShow\":[],\"acctNo\":null,\"partnerUserId\":null,\"custName\":null,\"collOrg\":[],\"collector\":[],\"idNo\":null,\"startOverDueDays\":null,\"endOverDueDays\":null,\"mobilePhone\":null,\"statusCodes\":[],\"startOverDueAmt\":null,\"endOverDueAmt\":null,\"functionCodes\":[],\"startRemainPrincipal\":null,\"endRemainPrincipal\":null,\"label\":null,\"lastCollTimeEnd\":null,\"lastCollTimeStart\":null,\"consignmentBeginDateEnd\":null,\"consignmentBeginDateStart\":null,\"consignmentEndDateStart\":null,\"consignmentEndDateEnd\":null,\"lastRepaymentTimeStart\":null,\"lastRepaymentTimeEnd\":null,\"residentialCities\":[],\"residentialCitiesShow\":[],\"updatePredictiveCalloutActive\":null,\"lastInboundStatus\":null}",
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    }).then(res1 => res1.json())
                                        .then(data1 => {
                                            //push进数组里
                                            for (var j = 0; j < this.num - 1000; j++) {
                                                this.list.push({
                                                    name: data1.data.list[j].name,
                                                    acctno: data1.data.list[j].defaultAcctNo
                                                });
                                            }
                                        });
                                });
                        } else {
                            fetch("https://amp.creditcloud.com/api/v3/product-customer/self/page?pageNum=1&pageSize=" + this.num + "&order=%7B%7D", {
                                "headers": {
                                    "accept": "application/json, text/plain, */*",
                                    "accept-language": "zh-CN,zh;q=0.9",
                                    "authorization": this.token,
                                    "content-type": "application/json",
                                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "no-cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-username": this.username
                                },
                                "referrer": "https://amp.creditcloud.com/case/mergeCase",
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": "{\"pageNum\":1,\"pageSize\":" + this.num + ",\"order\":{},\"assetCategorys\":[],\"assetTypeCodes\":[],\"storeStatus\":null,\"id\":null,\"registeredCities\":[],\"registeredCitiesShow\":[],\"acctNo\":null,\"partnerUserId\":null,\"custName\":null,\"collOrg\":[],\"collector\":[],\"idNo\":null,\"startOverDueDays\":null,\"endOverDueDays\":null,\"mobilePhone\":null,\"statusCodes\":[],\"startOverDueAmt\":null,\"endOverDueAmt\":null,\"functionCodes\":[],\"startRemainPrincipal\":null,\"endRemainPrincipal\":null,\"label\":null,\"lastCollTimeEnd\":null,\"lastCollTimeStart\":null,\"consignmentBeginDateEnd\":null,\"consignmentBeginDateStart\":null,\"consignmentEndDateStart\":null,\"consignmentEndDateEnd\":null,\"lastRepaymentTimeStart\":null,\"lastRepaymentTimeEnd\":null,\"residentialCities\":[],\"residentialCitiesShow\":[],\"updatePredictiveCalloutActive\":null,\"lastInboundStatus\":null}",
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            }).then(response => response.json())
                                .then(data => {
                                    for (var i = 0; i < this.num; i++) {
                                        this.list.push({
                                            name: data.data.list[i].name,
                                            acctno: data.data.list[i].defaultAcctNo
                                        });
                                    }
                                })
                        }

                    }
                })

            },
            //开始执行
            async start() {
                try {
                    await this.$confirm('请确认账户名，否则算别人绩效哦！', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '等哈，我再看看',
                        type: 'warning'
                    });
                    const num = this.num;

                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                    const performFetch = async () => {
                        if (this.input >= num) {
                            return; // 结束递归
                        }

                        const response = await fetch("https://amp.creditcloud.com/api/api/v2/account/deduct", {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "zh-CN,zh;q=0.9",
                                "authorization": this.token,
                                "content-type": "application/json;charset=UTF-8",
                                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-auth-token": "",
                                "x-username": this.username
                            },
                            "referrer": "https://amp.creditcloud.com/case/mergeCase",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": "{\"acctNo\":\"" + this.list[this.input].acctno + "\",\"repayType\":\"IN_REPAY\",\"period\":[],\"amount\":\"50\"}",
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });

                        const data = await response.json();

                        await delay(10000); // 等待10秒
                        const extraResponse = await fetch("https://amp.creditcloud.com/api/account-records/puhui-pull?acctNo=" + this.list[this.input].acctno, {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "zh-CN,zh;q=0.9",
                                "authorization": this.token,
                                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-auth-token": "",
                                "x-username": this.username
                            },
                            "referrer": "https://amp.creditcloud.com/case/mergeCase",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": null,
                            "method": "GET",
                            "mode": "cors",
                            "credentials": "include"
                        });

                        const res = await fetch("https://amp.creditcloud.com/api/account-records/puhui?pageNum=1&pageSize=1&acctNo=" + this.list[this.input].acctno + "&billState=", {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "zh-CN,zh;q=0.9",
                                "authorization": this.token,
                                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-auth-token": "",
                                "x-username": this.username
                            },
                            "referrer": "https://amp.creditcloud.com/case/mergeCase",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": null,
                            "method": "GET",
                            "mode": "cors",
                            "credentials": "include"
                        });

                        const data1 = await res.json();
                        this.$set(this.list[this.input], 'time', data1.data.list[0].actualPayDate);
                        this.$set(this.list[this.input], 'result', data1.data.list[0].billState);
                        await delay(900); // 等待0.9秒

                        this.input++; // 增加 i 的值，进入下一次循环
                        performFetch(); // 执行下一次的第一个 fetch 请求
                    };

                    performFetch(); // 执行第一次的第一个 fetch 请求
                } catch (error) {
                    this.$message({
                        type: 'info',
                        message: '我就知道你这家伙填错了！'
                    });
                }
            },
            //假停止
            end() {
                this.$message({
                    type: 'error',
                    message: '呜呜别管我啦，我做完再下班'
                });
            },
            //导出excel
            exportToExcel() {
                this.$message({
                    type: 'error',
                    message: '导出失败，因为我还没做这个功能'
                });
            },

            //获取令牌
            getToken() {
                fetch("https://umami.ktjr.com/api/collect", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site"
                    },
                    "referrer": "https://amp.creditcloud.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": "{\"type\":\"pageview\",\"payload\":{\"website\":\"39b8204f-cc34-4296-a85f-ef19f98979bc\",\"hostname\":\"amp.creditcloud.com\",\"screen\":\"1920x1080\",\"language\":\"zh-CN\",\"url\":\"/login\",\"referrer\":\"https://amp.creditcloud.com/welcome\"}}",
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "omit"
                }).then(response => response.text())
                    .then(data => {
                        this.token = data
                        console.log(this.token)
                    });
            },
            //过滤结果
            filterTag(value, row) {
                return row.result === value;
            }
        }
    });
    var isHidden = true;
    el.style.transition = 'opacity 0.3s ease-in-out';
    btn.addEventListener('click', function () {
        if (isHidden) {
            // 如果 div 已隐藏，则显示它
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            isHidden = false;
            btn.innerText = '😁';
        } else {
            // 如果 div 可见，则隐藏它
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            isHidden = true;
            btn.innerText = '😉';
        }
    });

};