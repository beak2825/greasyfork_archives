// ==UserScript==
// @name        QQ群成员导出
// @namespace   undefined
// @match       *://qun.qq.com/member.html
// @grant       none
// @version     1.0
// @author      dongye
// @description 2020/4/4 下午4:04:29
// @downloadURL https://update.greasyfork.org/scripts/399529/QQ%E7%BE%A4%E6%88%90%E5%91%98%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/399529/QQ%E7%BE%A4%E6%88%90%E5%91%98%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function(console) {
	//群和成员加载延迟，请求太快会被封端口
	groupTimeout = 5000;
	memberTimeout = 500;
	groupType = ['create', 'manage', 'join'];
	//groupType = ['create'];
	console.save = function(data, filename) {
	if (!data) {
		console.error('Console.save: No data');
		return
	}
	if (!filename) filename = 'console.json';
	if (typeof data === "object") {
		data = JSON.stringify(data, undefined, 4)
	}
	var blob = new Blob([data], {
		type: 'text/json'
	});
	e = document.createEvent('MouseEvents');
	a = document.createElement('a');
	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e)
};

getNowFormatDate = function() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + month + strDate;
        return currentdate;
};

getbkn = function() {
	//无用
	for (var e = $.cookie("skey"), t = 5381, n = 0, o = e.length; n < o; ++n)
		t += (t << 5) + e.charAt(n).charCodeAt();
	return 2147483647 & t
}

function loadMember(group, infoList){
	var url = "https://qun.qq.com/cgi-bin/qun_mgr/search_group_members"
	var groupInfo = {
		gc: group.gc,
		gn: group.gn,
		mems:[]
	};
	var hasNext = 1;
	var loading = 0;
	var defNum = 20;
	var count = 21;
	var st = 0;
	var end = st + defNum;
	// 回调处理接口返回的数据
	load()
	function q(e){
		groupInfo.mems = groupInfo.mems.concat(e.mems);
		count = e.count;
		hasNext = end >= count ? 0 : 1;
        st < count && (
			st = end + 1,
            end = st + defNum,
            end >= count && (end = count)
		);
		loading = 0;
		$('#memSch').html("成员加载：" + end + "/" + count);
		setTimeout(load, memberTimeout);
	}
	function load(){
		if (st < count && hasNext && !loading){
				data = {
					gc: groupInfo.gc,
					st: st,
					end: end,
					sort: 0
				};
				loading = 1;
				window.QunHandler.member.model.getMember(data, q);
		}
		else{
			infoList.push(groupInfo);
			console.log("完成加载: " + group.gn);
			setTimeout(loadData, groupTimeout);
		}
	}
}
loadData = function(){
	if (!myGroup){
		window.QunHandler.member.view.init();
	}
	if (typeIndex >= groupType.length){
		$('#groupSch').html('全部加载完成');
		$('#memSch').html("");
	}
	else {
		groupName = groupType[typeIndex];
		if (index >= myGroup[groupName].length){
			index = 0;
			typeIndex += 1;
			setTimeout(loadData, groupTimeout);
		}
		else{
			group = myGroup[groupName][index];
			loadMember(group, groupInfo[groupName]);
			num += 1;
			index += 1;
			groupNumber = Object.keys(gList).length;
			$('#groupSch').html('正在加载 '+ num + '/' + groupNumber +':' +group.gn);
		}
	}
}

groupInfo = {
	create: [],
	manage: [],
	join: []
};
index = 0;
num = 0;
typeIndex = 0;

downloadData = function(){
	console.save(groupInfo, 'group_memer-'+ getNowFormatDate() +'.json');
}

$(".group-tit").append('<a href="javascript:loadData();" onclick=""><i class="icon-r-job"></i> 加载数据</a>')
$(".group-tit").append('<span id="groupSch"></span>');
$(".group-tit").append('<span id="memSch"></span>');
$(".group-tit").append('<a href="javascript:downloadData();" onclick=""><i class="icon-r-ele"></i>下载数据</a>');

})(console);