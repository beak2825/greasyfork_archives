// gpt，使用GM_listValues和GM_getValue函数，获取所有保存的键值对为一个对象
// 获取所有保存的键值对并组成一个对象
function savedJson(prefix = 'savedResponse_') {
	let savedData = {};
	let keys = GM_listValues();
	keys.forEach(key => {
		let value = GM_getValue(key);
		savedData[key] = value;
	});
	// 将savedData对象下载为一个json文件
	downloadFunc(savedData, prefix)
}

function downloadFunc(params, prefix) {
	// 创建一个 JSON 字符串
	let jsonData = JSON.stringify(params);
	// 创建一个新的 Blob 对象
	let blob = new Blob([jsonData], {
		type: 'application/json'
	});
	// 创建一个临时 URL，用于下载 JSON 文件
	let url = URL.createObjectURL(blob);
	// 创建一个隐藏的链接
	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;

	let currentDate = new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace(/[-T:/]/g, ''); // 获取当前日期和时间
	a.download = prefix + currentDate + '.json'; // 文件名包含当前日期和时间 // gpt，'savedResponse这里加上当前的日期和时间.json'


	document.body.appendChild(a);

	a.onclick = (e) => {
		e.stopPropagation();
	}
	// 触发点击事件来下载文件
	a.click();
	// 释放 URL 对象
	URL.revokeObjectURL(url);
}


// clearSavedData 函数用于执行清空操作
function clearSavedData() {
	// 获取所有保存的键值对
	let keys = GM_listValues();

	// 遍历所有键并删除对应的值
	keys.forEach(key => {
		GM_deleteValue(key);
	});

	// 提示用户清空完成（可选）
	// alert('保存的响应数据已清空');
	GM_notification({
		title: '数据已清空',
		text: '保存的数据已清空',
		timeout: 3000 // 通知显示时间，单位为毫秒
	});
}