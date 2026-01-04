// ==UserScript==
// @name         志愿时数导出脚本
// @namespace    信息青大队办公室 2022-5-6
// @version      2.2
// @description  一个用来导出信息志愿者时数的脚本
// @author       某不愿透露姓名的青办负责人
// @match        https://vms.zyh365.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444547/%E5%BF%97%E6%84%BF%E6%97%B6%E6%95%B0%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444547/%E5%BF%97%E6%84%BF%E6%97%B6%E6%95%B0%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
	// 创建事件触发按钮
	var btn = document.createElement("button")
	btn.innerHTML = '点击执行'
	document.body.style.position = 'relative'
	document.body.appendChild(btn)
	btn.style.position = 'fixed'
	btn.style.left = '100px'
	btn.style.top = '100px'
    btn.style.zIndex = 999

	// 创建点击事件
	btn.addEventListener('click', () => {

		// ***********修改区域*******************
		var startTime = new Date('2021-1-1 17:0:0')	// 开始时间
		var endTime = new Date('2021-6-30 17:0:0')	// 结束时间
		var blackList = ['屈强', '白海金', '何继东', '胡群勇', '兰少云', '张欣蕊', '孟繁友']	// 管理员黑名单
        var count = 0
		var flag = true
		// *************************************

		var cheatUser = []
		var data = []
		var timespan = endTime.getFullYear() - startTime.getFullYear()
		// 默认浏览器为ie7以上
		var ajax = new XMLHttpRequest()


		// 1.获取学院青大队id
		function getTeamId() {
			ajax.onreadystatechange = async function () {
				if (ajax.readyState == 4 && this.status == 200) {
					let teamId = JSON.parse(ajax.responseText)[0].id
					// console.log(teamId);
					getGradeId(teamId)
				} else if (ajax.readyState == 4 && this.status == 404) {
					alert('服务器信息获取失败，请检查网络环境！！！\n无法解决请联系qq2407491760')
				}
			}
			ajax.open('POST', '/sys/department/tree.do', false)
			ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			trySend()

		}
		// 2.获取青大队组织下各年级段id
		function getGradeId(teamId) {
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && this.status == 200) {
					// console.log(JSON.parse(ajax.responseText))
					JSON.parse(ajax.responseText).forEach(item => {
						var gradeObj = {
							children: []
						}
						gradeObj.name = item.text
						// gradeObj.id = item.id
						getClassId(item.id, gradeObj)
						data.push(gradeObj)
					})
				} else if (ajax.readyState == 4 && this.status == 404) {
					alert('服务器信息获取失败，请检查网络环境！！！\n无法解决请联系qq2407491760')
				}
			}
			ajax.open('POST', '/sys/department/tree.do', false)
			ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			trySend('id=' + teamId)

		}
		// 3.获得班级的id
		function getClassId(gradeId, gradeObj) {
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && this.status == 200) {
					// console.log(JSON.parse(ajax.responseText))
					JSON.parse(ajax.responseText).forEach(item => {
						let classObj = {
							children: []
						}
						classObj.name = item.text
						getStuId(item.id, classObj)
						gradeObj.children.push(classObj)
					})
				} else if (ajax.readyState == 4 && this.status == 404) {
					alert('服务器信息获取失败，请检查网络环境！！！\n无法解决请联系qq2407491760')
				}
			}
			ajax.open('POST', '/sys/department/tree.do', false)
			ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			trySend('id=' + gradeId)
		}
		// 4.查询班级个人id
		function getStuId(classId, classObj) {
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && this.status == 200) {
					// console.log(JSON.parse(ajax.responseText))
					JSON.parse(ajax.responseText).rows.forEach(item => {
						let stuObj = {}
                        console.log(item.name)
						stuObj.name = item.name
						flag = true
						getStuDur(item._id, stuObj)
						getStuCredit(item._id, stuObj, startTime.getFullYear())
						// 实现跨年查询
						if (timespan > 0) {
							for (let i = 1; i <= timespan; i++) {
								getStuCredit(item._id, stuObj, startTime.getFullYear() + i)
							}
						}
						classObj.children.push(stuObj)
					})
				} else if (ajax.readyState == 4 && this.status == 404) {
					alert('服务器信息获取失败，请检查网络环境！！！\n无法解决请联系qq2407491760')
				}
			}
			ajax.open('POST', '/volunteer/list.do', false)
			ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			trySend('parentId=' + classId + '&range=all&page=1&rows=999&sort=creditduration&order=desc')
		}
		// 5.1 查询个人荣誉时数
		function getStuDur(stuId, stuObj) {
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && this.status == 200) {
					// console.log(JSON.parse(ajax.responseText))
					let durationTime = 0
					let cheatTime1 = 0
					JSON.parse(ajax.responseText).rows.forEach(item => {
						if (item.createtime >= +startTime && item.createtime <= +endTime) {
							// 验证黑名单
							if(blackList.indexOf(item.username) < 0) {
								durationTime += item.value
							} else {
								// 统计参与人数
								if(flag) {
									flag = false
									count++
								}
								cheatTime1 += item.value
							}
						}
					})
					stuObj.durationTime = durationTime
					stuObj.cheatTime1 = cheatTime1
				} else if (ajax.readyState == 4 && this.status == 404) {
					alert('服务器信息获取失败，请检查网络环境！！！\n无法解决请联系qq2407491760')
				}
			}
			ajax.open('POST', '/volunteer/hisDuration_list.do', false)
			ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			trySend('volunteerid=' + stuId + '&status=10&page=1&rows=999')
		}

		// 5.2 查询个人信用时数
		function getStuCredit(stuId, stuObj, year) {
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && this.status == 200) {
					// console.log(JSON.parse(ajax.responseText))
					let creditTime = 0
					let cheatTime2 = 0
					JSON.parse(ajax.responseText).rows.forEach(item => {
						if (item.finish_time >= +startTime && item.finish_time <= +endTime) {
							if(blackList.indexOf(item.actname) < 0) {
								creditTime += item.value
							} else {
								if(flag) {
									flag = false
									count++
								}
								cheatTime2 += item.value
							}
						}
					})
					stuObj.creditTime = creditTime
					stuObj.cheatTime2 = cheatTime2
				} else if (ajax.readyState == 4 && this.status == 404) {
					alert('服务器信息获取失败，请检查网络环境！！！\n无法解决请联系qq2407491760')
				}
			}
			ajax.open('POST', '/volunteer/creditDuration_list.do', false)
			ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			trySend('volunteerid=' + stuId + '&title=&year=' + year + '&page=1&rows=999')
		}

		// 7. 创建html模板并提供下载
		function downloadHtml(data) {
			var html =
				`
<!DOCTYPE html>
<html lang="zh">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js"></script>
		<title></title>
		<style type="text/css">
			td,th {
				width: 100px;
				text-align: center;
				padding: 5px;
			}
		</style>
	</head>
	<body>
		<div id="app">
			<table cellspacing="0">
				<tr>
					<th>班级</th>
					<th>姓名</th>
					<th>荣誉时数</th>
					<th>信用时数</th>
					<th>共计</th>
					<th>刷取时数</th>
				</tr>
			</table>
			<div v-for="(item1, index1) in json" :key="index1">
				<table cellspacing="0" v-for="(item2, index2) in item1.children" :key="index2">
					<tr v-for="(item3, index3) in item2.children" :key="index3">
						<td>{{ item2.name }}</td>
						<td>{{ item3.name }}</td>
						<td>{{ item3.durationTime | round }}</td>
						<td>{{ item3.creditTime | round }}</td>
						<td>{{ (item3.durationTime + item3.creditTime) | round }}</td>
						<td>{{ (item3.cheatTime1 + item3.cheatTime2) | round }}</td>
					</tr>
				</table>
			</div>
		</div>
		<script type="text/javascript">
			var vue = new Vue({
				el: '#app',
				data: {
					json: ${data}
				},
				filters: {
					round(n) {
						return Math.round(n*10)/10
					}
				}
			})
		</script>
	</body>
</html>
`
			// 创建a标签用于下载
			var eleLink = document.createElement('a');
			eleLink.download = '志愿者时数.html';
			eleLink.style.display = 'none';
			// 字符内容转变成blob地址
			var blob = new Blob([html]);
			eleLink.href = URL.createObjectURL(blob);
			// 触发点击
			document.body.appendChild(eleLink);
			eleLink.click();
			// 然后移除
			document.body.removeChild(eleLink);
		}

		// 执行函数
		function run() {
			getTeamId()
			downloadHtml(JSON.stringify(data))
			// console.log(data)
		    console.log('共计' + count + '人存在黑名单加分情况')
		}

		// 调用执行函数
		run()

		// *******************函数封装******************* //

		// 检查请求是否发送成功 @param 发给服务器参数
		function trySend(param) {
			try {
				if (param) {
					ajax.send(param)
				} else {
					ajax.send()
				}
			} catch (e) {
				alert('服务器请求失败，请检查网络环境后刷新重试！！！')
			}
		}


	})

})();
