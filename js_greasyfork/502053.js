// ==UserScript==
// @name         上传用户
// @namespace    C_Zero.chaoxing.edit
// @version      1.0.0.3
// @description  批量上传用户(自用)
// @author       C_Zero
// @match        *://localhost:9001/dzaq-aq/web/LZBZPOST
// @match        *://eplat.dzky.cn/dzaq-aq/web/LZBZPOST
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502053/%E4%B8%8A%E4%BC%A0%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/502053/%E4%B8%8A%E4%BC%A0%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==
/**
 * 录入用户
 */
function inputUser({userCode, userName, postCode, postName}) {
	var config = {
		url: prefix + "/newSave",
		type: "post",
		dataType: "json",
		data: `postUserCodeListCode=${userCode}&postUserCodeListName=${userName}&postCode=${postCode}&postName=${postName}`,
		success: function (result) {
			console.log(result)
		}
	};
	$.ajax(config)
}

const userList = [
	{userCode:'3165',userName:'吴金涛',postCode:'WZKKZ',postName:'五职矿矿长'},
{userCode:'25202',userName:'柳华杰',postCode:'WZKKZ',postName:'五职矿矿长'},
{userCode:'2698',userName:'贾亮',postCode:'WZKKZ',postName:'五职矿矿长'},
{userCode:'1725',userName:'尚鹏',postCode:'WZKKZ',postName:'五职矿矿长'},
{userCode:'20230660',userName:'于衍达',postCode:'WZKKZ',postName:'五职矿矿长'}
]

function eachUser() {
	for (const user of userList) {
		inputUser(user);
	}
}

$(function () {
	setTimeout(function () {
		$('<a class="btn btn-warning" onclick="eachUser()"><i class="fa fa-plus">录入用户</i></a>').appendTo($('.layui-table-tool-temp')) 
	}, 2000)
	
})