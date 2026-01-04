// ==UserScript==
// @name         x-ui English translation
// @namespace    xui
// @version      1.1
// @description  Translation x-ui from Chinese to English
// @author       ntxinh
// @match        *://*/xui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=66.86
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477077/x-ui%20English%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/477077/x-ui%20English%20translation.meta.js
// ==/UserScript==

(function() {
    // 'use strict';

    // TODO: Change @match to your website

    // Thank dartraiden
    // Reference: https://greasyfork.org/en/scripts/379657-breed-bootloader-english-translation

    function findAndReplace(searchText, replacement, searchNode) {
		if (!searchText || typeof replacement === 'undefined') {
			// Throw error here if you want...
			return;
		}
		var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
			childNodes = (searchNode || document.body).childNodes,
			cnLength = childNodes.length;
		var excludes = 'html,head,style,title,link,meta,script,object,iframe';
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
        // Sort JSON (by reverse key length)
        var ts = {
            "确定要重启面板吗？点击确定将于 3 秒后重启，若重启后无法访问面板，请前往服务器查看面板日志信息": "Are you sure you want to restart the panel? Click OK to restart in 3 seconds. If you cannot access the panel after restarting, please go to the server to view the panel log information.",
            "必须以 '/' 开头，以 '/' 结尾，重启面板生效": "Must start with '/' and end with '/'. Restart the panel to take effect.",
            "填写一个 '/' 开头的绝对路径，重启面板生效": "Fill in an absolute path starting with '/' and restart the panel to take effect.",
            "以该模版为基础生成最终的 xray 配置文件": "Generate the final xray configuration file based on this template",
            "定时任务按照该时区的时间运行，重启面板生效": "The scheduled task runs according to the time in the time zone and will take effect after restarting the panel.",
            "采用Crontab定时格式,重启面板生效": "Using Crontab timing format,Restart the panel to take effect",
            "默认留空监听所有 IP，重启面板生效": "By default, it is left blank to monitor all IPs. It will take effect after restarting the panel.",
            "系统启动以来所有网卡的总上传流量": "Total upload traffic of all network cards since system startup",
            "系统启动以来所有网卡的总下载流量": "Total download traffic of all network cards since system startup",
            "请谨慎选择，旧版本可能配置不兼容": "Please choose carefully, older versions may be configured incompatibly",
            "登录时效已过，请重新登录": "The login time limit has expired, please log in again",
            "新用户名和新密码不能为空": "New username and new password cannot be empty",
            "没有特殊需求保持默认即可": "If there are no special requirements, just keep the default",
            "系统自启动以来的运行时间": "System uptime since startup",
            "安装中，请不要刷新此页面": "Installation in progress, please do not refresh this page",
            "原用户名或原密码错误": "The original username or password is wrong",
            "所有网卡的总上传速度": "Total upload speed for all network cards",
            "所有网卡的总下载速度": "Total download speed for all network cards",
            "面板证书公钥文件路径": "Panel certificate public key file path",
            "面板证书密钥文件路径": "Panel certificate key file path",
            "面板 url 根路径": "Panel url root path",
            "所有网卡的总连接数": "Total number of connections across all network cards",
            "点击你想切换的版本": "Click on the version you want to switch to",
            "用户名或密码错误": "wrong user name or password",
            "总上传 / 下载": "Total uploads/downloads",
            "确定要重置流量吗": "Are you sure you want to reset the traffic",
            "确定要删除入站吗": "Are you sure you want to delete the inbound",
            "TG提醒相关设置": "TG reminder related settings",
            "面板登录成功提醒": "Panel login successful reminder",
            "面板登录失败提醒": "Panel login failure reminder",
            "禁用不安全加密": "Disable insecure encryption",
            "留空则永不到期": "Leave blank to never expire",
            "启用电报机器人": "Enable telegram bot",
            "数据格式错误": "Data format error",
            "请输入用户名": "Please enter user name",
            "默认留空即可": "Leave it blank by default",
            "公钥文件路径": "publicKeyPath",
            "密钥文件路径": "keyPath",
            "面板监听端口": "Panel listening port",
            "重启面板生效": "Restart the panel to take effect",
            "请输入密码": "Please enter password",
            "表示不限制": "indicates no restriction",
            "电报机器人": "Telegram bot",
            "端口已存在": "Port already exists",
            "配置模版": "Configuration template",
            "获取版本": "Get version",
            "获取设置": "Get settings",
            "修改设置": "Modify settings",
            "修改用户": "Modify user",
            "重启面板": "Restart panel",
            "系统状态": "System status",
            "入站列表": "Inbound list",
            "目标地址": "Target address",
            "目标端口": "Target port",
            "密码认证": "Password authentication",
            "状态说明": "Description/Reason",
            "到期时间": "Expire date",
            "公钥内容": "publicKeyContent",
            "密钥内容": "keyContent",
            "面板设置": "Pannel settings",
            "退出登录": "Log out",
            "详细信息": "Details",
            "复制链接": "Copy Link",
            "复制成功": "Copied successfully",
            "入站数量": "Inbound quantity",
            "重置流量": "Reset traffic",
            "传输配置": "Transport configuration",
            "添加入站": "Add Inbound",
            "修改入站": "Modify Inbound",
            "删除入站": "Delete Inbound",
            "切换版本": "Switch version",
            "运行时间": "Operation hours",
            "系统负载": "System load",
            "是否切换": "Whether to switch",
            "保存配置": "Save configuration",
            "面板配置": "Panel configuration",
            "面板监听": "Panel monitoring",
            "用户设置": "User settings",
            "原用户名": "Original user name",
            "新用户名": "New user name",
            "相关设置": "Related settings",
            "通知时间": "Notification",
            "其他设置": "Other settings",
            "主机名称": "Host name",
            "节点名称": "Node name",
            "上行流量": "Inbound Up",
            "下行流量": "Inbound Down",
            "用户名": "Username",
            "总流量": "Total Traffic",
            "总用量": "Total dosage",
            "二维码": "QR Code",
            "无限制": "Unlimited",
            "无限期": "Unlimited duration",
            "流量↑": "Flow",
            "连接数": "Number of connections",
            "加载中": "Loading",
            "版本至": "version to",
            "原密码": "Old password",
            "新密码": "New Password",
            "分钟": "m",
            "小时": "h",
            "登录": "Log in",
            "安装": "Install",
            "成功": "Success",
            "失败": "Fail",
            "设置": "Set up",
            "确定": "Sure",
            "取消": "Cancel",
            "传输": "Transmission",
            "加密": "Encryption",
            "密码": "Password",
            "伪装": "Camouflage",
            "开启": "Turn on",
            "关闭": "Closure",
            "域名": "Domain name",
            "协议": "Protocol",
            "地址": "Address",
            "端口": "Port",
            "网络": "Network",
            "启用": "Enable",
            "额外": "Additional",
            "请求": "Request",
            "版本": "Version",
            "方法": "Method",
            "路径": "Path",
            "名称": "name",
            "响应": "Response",
            "状态": "State",
            "监听": "Monitor",
            "证书": "certificate",
            "其他": "Other",
            "操作": "Operate",
            "编辑": "Edit",
            "删除": "Delete",
            "查看": "Check",
            "备注": "Remark",
            "添加": "Add to",
            "修改": "Revise",
            "重置": "Reset",
            "内存": "Memory",
            "硬盘": "HardDisk",
            "切换": "Switch",
            "时区": "Title",
            "时间": "Time",
            "用户": "User",
            "秒": "s",
            "天": "d",
            "无": "None",
            "头": "header",
            "值": "value",
            "添 加": "Add to",
            "。": "."
        };
		for(var t in ts) {
			findAndReplace(t,ts[t]);
		}
		setTimeout(translate, 500);
	}

	setTimeout(translate, 500);
})();