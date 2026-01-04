// ==UserScript==
// @name		Padavan Tiếng Việt | 2.2.2.1
// @description	        Giao diện tiếng Việt cho Padavan
// @namespace	        Padavan_vi
// @version		2020.03.31
// @author		Darias
// @include		http://2.2.2.1/*
// @downloadURL https://update.greasyfork.org/scripts/399118/Padavan%20Ti%E1%BA%BFng%20Vi%E1%BB%87t%20%7C%202221.user.js
// @updateURL https://update.greasyfork.org/scripts/399118/Padavan%20Ti%E1%BA%BFng%20Vi%E1%BB%87t%20%7C%202221.meta.js
// ==/UserScript==

(function () {

	function findAndReplace(searchText, replacement, searchNode) {
		if (!searchText || typeof replacement === 'undefined') {
			// Throw error here if you want...
			return;
		}
		var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
			childNodes = (searchNode || document.body).childNodes,
			cnLength = childNodes.length;
		excludes = 'html,head,style,title,link,meta,script,object,iframe';
		while (cnLength--) {
			var currentNode = childNodes[cnLength];
			if (currentNode.nodeType === 1 && (',' + excludes + ',').indexOf(',' + currentNode.nodeName.toLowerCase() + ',') === -1) {
				arguments.callee(searchText, replacement, currentNode);
			}
			if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
				continue;
			}
			var parent = currentNode.parentNode,
				frag = (function(){
					var html = currentNode.data.replace(regex, replacement),
						wrap = document.createElement('div'),
						frag = document.createDocumentFragment();
					wrap.innerHTML = html;
					while (wrap.firstChild) {
						frag.appendChild(wrap.firstChild);
					}
					return frag;
				})();
			parent.insertBefore(frag, currentNode);
			parent.removeChild(currentNode);
		}
	}

	function translate() {
		var ts = {
		"扩展功能":"Chức năng mở rộng",
		"配置扩展环境":"Cấu hình mở rộng",
		"花生壳内网版":"Shell trên Web",
		"广告屏蔽功能":"Chặn quảng cáo",
		"搭建 Web 环境":"Môi trường Web",
		"搭建Web环境":"Môi trường Web",
		"开关":"Chuyển đổi",
		"Wifidog 是一款开源的用来实现无线认证的软件.":"WifiDog là một phần mềm nguồn mở để xác thực không dây.",
		"注意":" Chú ý",
		"你确定要执行Adbyby按钮功能吗？":"Bạn có muốn bật Chặn quảng cáo!",
		"Shadowsocks设置":"Cài đặt ShadowSocks",
		"有可能和 adbyby、ss 的防火墙规则冲突！":" Có thể xung đột với các quy tắc tường lửa của Chặn quảng cáo!",
		"状态查询页面：Wifidog status":"Xem trạng thái: Trạng thái WifiDog",
		"启用 Wifidog":"Kích hoạt WifiDog",
		"设置服务访问端口":"Cài cổng truy cập dịch vụ",
		"认证服务器地址":"Địa chỉ máy chủ xác thực",
		"认证服务器端口":"Cổng máy chủ xác thực",
		"认证服务器路径":"Đường dẫn máy chủ xác thực",
		"高级设置":"Cài đặt nâng cao",
		"网关 ID":"ID Cổng",
		"内部网卡":"Card mạng nội bộ",
		"外部网卡":"Card mạng ngoài",      
		"认证网关端口":"Cổng xác thực",
		"HTTP 最大连接数":"Số kết nối tối đa",
		"信任 MAC 地址":"Địa chỉ Mac tin cậy",
		"守护进程":"Chạy nền",
		"域名或者 IP 地址":"Tên miền hoặc địa chỉ IP",
		"80端口":"Cổng 80",

		"默认":"Mặc định: ",
		"。":".",
		};
		for(var t in ts) {
			findAndReplace(t,ts[t]);
		}
		setTimeout(translate, 500);
	}

	setTimeout(translate, 500);

})();