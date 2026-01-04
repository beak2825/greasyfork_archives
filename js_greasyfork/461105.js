// ==UserScript==
// @author   ss
// @name ARL删除增强
// @description     用于ARL前端未实现的删除功能
// @namespace AceScript Scripts
// @match https://**/taskList/*
// @grant none
// @version 1.0.
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461105/ARL%E5%88%A0%E9%99%A4%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461105/ARL%E5%88%A0%E9%99%A4%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


window.onload = function() {
	//初始化
	console.log('加载脚本');
	var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	//UI
	button.id = "id001";
	button.textContent = "删除";
	button.style.color = "#FFFFFF"
	button.style.width = "60px";
	button.style.height = "32px";
	button.style.textAlign = 'center';
	button.style.lineHeight = 0
	button.style.background = "#00C5DC"
	button.style.border = 0;
	button.style.margin = "0px 0px 0px 16px";
	button.style.padding = "0px 15px"

	//    let originList = ["站点", "子域名", "IP", "SSL证书", "服务", "文件泄露", "URL信息", "风险", "服务（python）", "C段", "nuclei", "指纹统计"]

	//根据选项调整需要访问的删除节点
	//绑定按键点击功能
	button.onclick = function() {
            const token = localStorage.getItem('token');
			var idList = []
			var listIdTmp = document.getElementsByClassName('ant-table-row-level-0')
				//标签名
				//console.log(document.getElementsByClassName('ant-tabs-nav-animated')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent)
			var tempStr = document.getElementsByClassName('ant-tabs-nav-animated')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent;


			listIdTmp.forEach(function(tempList) {
				//id列
				// console.log(document.getElementsByClassName('ant-table-row-level-0'))
				//提取id
				//console.log(item.getAttribute('data-row-key'));
				//复选框状态
				// console.log(document.getElementsByClassName('ant-table-row-level-0')[0].getElementsByClassName('ant-table-selection-column')[0].getElementsByClassName('ant-checkbox-input')[0].checked)

				if (tempList.getElementsByClassName('ant-table-selection-column')[0].getElementsByClassName('ant-checkbox-input')[0].checked) {
					idList.push(tempList.getAttribute('data-row-key'))
				}
			});

             if(idList.length <1){
                 alert('请勾选需要删除的条目');
                 return;

             }
			//console.log("idList:" + idList)

			switch (tempStr.split(" ")[0]) {

				case '站点':
					post("/api/site/delete", idList,token);
					break;
				case '子域名':
					post("/api/domain/delete", idList,token);
					break;
				case 'IP':
					post("/api/ip/delete", idList,token);
					break;
				case 'SSL证书':
					post("/api/cert/delete", idList,token);
					break;
				case '文件泄露':
					post("/api/fileleak/delete", idList,token);
					break;
				case 'nuclei':
					post("/api/nuclei_result/delete", idList,token);

					break;
				case '指纹统计':
					post("/api/fingerprint/delete", idList,token);

					break;
				default:
					alert('无此API');

			};


		}
		//添加按钮
	var tmp = document.getElementsByClassName('item');
	var x = tmp[tmp.length - 1];
	x.appendChild(button);


	function post(url, idList,token ){

		// console.log(url+","+idList)
        const obj = {_id:idList}

		fetch(url, {
				method: 'POST',
				body: JSON.stringify(obj),
				headers: {
					'Content-Type': 'application/json',
                    'Token': `${token}`
				}
			})
			.then(response => response.json())
			.then(data => console.log(idList))
			.catch(error => console.error(error));

            alert('删除完毕');
	}


};