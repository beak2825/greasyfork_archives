// ==UserScript==
// @name		BREED bootloader English translation
// @description	BREED bootloader for Xiaomi Mi Router 3G translation
// @namespace	breed_mi_r3g_en
// @version		20191018.1
// @author		LESHIY_ODESSA, dartraiden
// @include		http://192.168.1.1/*
// @downloadURL https://update.greasyfork.org/scripts/379657/BREED%20bootloader%20English%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/379657/BREED%20bootloader%20English%20translation.meta.js
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
		// The order matters - the shorter the string is, the lower it is, otherwise short strings will take precedence if they occur as part of long strings
		"如果超频后无法开机，请按住复位键再通电，系统将以默认频率启动":"If you cannot turn on the power after overclocking, press and hold the reset button and power on, the system will start at the default frequency",
		"设置当前刷入固件的类型，以便于在启动固件时设置特定的参数":"Set the type of current firmware so that specific parameters are set when the firmware is started.",
		"本产品仅供个人免费使用，禁止用于商业目的":"This product is for personal use only and is forbidden for commercial use.",
		"请选择正确的固件类型，错误选择可能损坏固件。":"Please select the correct firmware type, wrong selection may damage the firmware.",
		"本页面不会自动刷新，请自行检查是否重启成功。":"This page will not be automatically refreshed. Please check if the restart was successful",
		"同一时间只允许有一个备份任务":"Only one backup task is allowed at a time.",
		// For unknown reason, the string is not translated if it contains a value that must be a multiple of the size of the EEPROM, so string is split into two parts
		"EEPROM 大小是":"EEPROM size must be a multiple of",
		" 的整倍数":"",
		"以恢复出厂设置。":"to restore factory settings.",
		"更新完成，设备正在重启。本页面不会刷新，请手动检查设备状态。":"Restarting. This page will not be refreshed. Check the device status manually.",
		"正在更新固件，请耐心等待至进度条完成":"Updating firmware, please be patient until the progress bar is completed.",
		"警告：在操作进行过程中请不要断开电源":"WARNING: Do not turn off power during the operation.",
		"更新完成，2 秒后跳转到系统信息页面。":"Successfully completed, will jump to the «System information» page after 2 seconds",
		"操作完成，2 秒后跳转到系统信息页面。":"The operation is completed, will jump to the «System information» page after 2 seconds",
		"作完成，2 秒后跳转到系统信息页面。":"The operation is completed, will jump to the «System information» page after 2 seconds",
		"请选择一个有效的Firmware type":"Please select a valid firmware type.",
		"当前固件不是一个有效的 Padavan 固件。":"Current firmware is not a valid Padavan firmware.",
		"当前Firmware不是一个有效的 Padavan Firmware.":"Current firmware is not a valid Padavan firmware.",
		"单击按钮备份相应的数据":"Click the button to back up the corresponding data.",
		"按钮以重启路由":"button to restart router.",
		"正在擦除 编程器固件":"Erasing",
		"正在擦除 固件设置":"Erasing",
		"正在擦除 固件":"Erasing",
		"正在擦除 Bootloader":"Erasing",
		"正在擦除 EEPROM":"Erasing",
		"正在校验 编程器固件 擦除块":"Verifying erased blocks",
		"正在校验 固件 擦除块":"Verifying erased blocks",
		"正在校验 Bootloader 擦除块":"Verifying erased blocks",
		"正在校验 EEPROM 擦除块":"Verifying erased blocks",
		"正在写入 编程器固件":"Writing",
		"正在写入 固件":"Writing",
		"正在写入 Bootloader":"Writing",
		"正在写入 EEPROM":"Writing",
		"正在校验 编程器固件 数据":"Verifying data",
		"正在校验 固件 数据":"Verifying data",
		"正在校验 Bootloader 数据":"Verifying data",
		"正在校验 EEPROM 数据":"Verifying data",
		"MAC 地址已经被成功修改":"The MAC address has been successfully modified",
		"上传的 Bootloader 无效":"Bootloader is damaged or invalid.",
		"此固件不是小米 R3G 固件":"This firmware is not Xiaomi R3G firmware.",
		"编程器固件大小不合法，不能判定为有效的编程器固件。":"The dump size is incorrect and cannot be judged as valid dump.",
		"无法判断固件类型":"Unable to detect firmware type.",
		"文件已上传，请确认下方列出的信息":"The file has been uploaded, please confirm the information listed below.",
		"小米路由器 3G 原厂固件":"Stock firmware",
		"MAC 地址修改":"MAC addresses",
		"恢复出厂设置":"Factory Reset",
		"文件未找到":"Not found",
		"请求的页面不存在。":"The requested page does not exist.",
		"浏览器不支持 Ajax!":"The browser does not support AJAX!",
		"Breed 内部错误!":"Breed internal error!",
		"校验失败，请重试!":"The verification failed, please try again!",
		"擦除操作正在进行，请耐心等待至进度条完成":"The reset operation is in progress, please wait until the progress bar is completed.",
		"您选择的操作正在进行":"The operation you selected is in progress.",
		"保留现有 Bootloader":"Keep existing bootloader",
		"保留现有 EEPROM":"Keep existing EEPROM",
		"环境变量编辑":"Environment variables",
		"Breed Web 恢复控制台":"Breed Web Recovery Console",
		"通信错误":"Connection error",
		"小米路由器 3G 固件 1":"Partition 1",
		"小米路由器 3G 固件 2":"Partition 2",
		"小米 R3G 设置":"Settings",
		"配置已被成功更新。":"Settings has been successfully updated",
		"环境变量已被成功更新。":"Environment variables have been successfully updated",
		"Bdata 已被成功更新。":"Bdata has been successfully updated",
		"系统信息":"System information",
		"固件更新":"Firmware update",
		"更新确认":"Confirm update",
		"路由正在重启，请耐心等待。":"The router is restarting, please wait.",
		"路由正在重启":"Router is restarting",
		"固件启动设置":"Startup settings",
		"常规固件":"Regular firmware",
		"编程器固件":"Full dump",
		"小米 R3G Bdata":"Bdata",
		"自动重启":"Automatic restart",
		"正在等待":"Waiting",
		"闪存布局":"Flash layout",
		"RT6855/RT6856/MT7621 独立参数":"Independent parameters of RT6855/RT6856/MT7621",
		"固件类型":"Firmware type",
		"频率设置":"Overclocking",
		"固件备份":"Firmware backup",
		"操作正在进行":"Operation is in progress",
		"内存":"RAM",
		"单击":"Click",
		"以太网":"Ethernet",
		"时钟频率":"Frequency",
		"编译日期":"Build date",
		"文件名":"Filename",
		"大小":"Size",
		"MD5 校验":"MD5 sum",
		"版本":"Version",
		"类型":"Type",
		"固件":"Firmware",
		"上传":"Upload",
		"执行":"Execute",
		"字段":"Field",
		"值":"Value",
		"删除":"Delete",
		"添加":"Add",
		"保存":"Save",
		"修改":"Modify",
		"重启":"Restart",
		"关于":"About",
		"修订号":"Revision",
		"联系作者":"Contact author",
		"更新：":"Latest version: ",
		"更新":"Update",
		"错误":"Error",
		"提示":"Prompt",
		"返回":"Return",
		"。":".",
		};
		for(var t in ts) {
			findAndReplace(t,ts[t]);
		}
		setTimeout(translate, 500);
	}

	setTimeout(translate, 500);

})();
