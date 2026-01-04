// ==UserScript==
// @name         网易云音乐听歌次数
// @namespace    http://tampermonkey.net/
// @version      3.0
// @match        https://music.163.com/
// @grant        none
// @description 具体听歌次数@2020/05/11
// @downloadURL https://update.greasyfork.org/scripts/403084/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%90%AC%E6%AD%8C%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/403084/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%90%AC%E6%AD%8C%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==
function getTimes(){
	// 检查是否已经完成
	var check=contentFrame.document.getElementsByClassName("times");
	if(check.length!=0){
		return;
	}
	// 检查能否获取数据
	var list=contentFrame.document.getElementsByClassName("bg");
	if(list.length==0){
		return;
	}
	// 初始化数组 d
	var d=[];
	for(var i=0;i<list.length;i++){
		d[i]=parseInt(list[i].style.width);
	}
	// 寻找最小单位 j
	var len=d.length;
	var j=d[len-1], id=0;
	for(i=len-1;i>=0;i--){
		j=Math.min(j,(d[i]-id)==0?100:d[i]-id);
		id=d[i];
	}
	// 最小单位无效
	var word='次'
	if(!(j>1)){
		word='%'
	}
	// 从末尾计算提高精度
	for(i=len-1;i>=0;i--){
		var p=d[i];
		// 四舍五入
		var n=Math.round(p/j);
		if(!(n>0)){
			return;
		}
		list[i].outerHTML+='<span class="times f-ff2">'+n+word+'</span>';
		// 调整最小单位
		j=p/n;
	}
	console.log('Calc Done')
}
//setInterval(getTimes,1000)

document.querySelector('#g_iframe').onload = function() {
	// iframe加载完毕以后执行操作
	console.log('iframe已加载完毕')
	getTimes()
	// 选择要观察变化的目标节点
	var targetNode = contentFrame.document.querySelector('#m-record');
	// 创建一个 observer 实例并指定回调函数
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			//console.log('内容发生了变化：', mutation);
			getTimes()
		});
	});

	// 配置观察选项
	var config = { attributes: true, childList: true, subtree: true };

	// 开始观察目标节点
	observer.observe(targetNode, config);
}