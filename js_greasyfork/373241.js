// ==UserScript==
// @name          SUSTech_GPA
// @author        Edwardfang
// @namespace     http://github.com/edwardfang/sustech_gpa
// @description   SUSTech GPA plugin
// @match         *://jwxt.sustc.edu.cn/jsxsd/kscj/cjcx_list
// @match         *://jwxt.sustc.edu.cn/jsxsd/framework/main.jsp
// @match         *://jwxt.sustc.edu.cn/jsxsd/framework/xsMain.jsp
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @version       0.3.3
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/373241/SUSTech_GPA.user.js
// @updateURL https://update.greasyfork.org/scripts/373241/SUSTech_GPA.meta.js
// ==/UserScript==



function getTableData(){
	const userful_columns = ['等级制', '学分']
	const mapping = {'等级制':'grade', '学分':'credit'}
	let myRows = [];
	let $headers = $("table#dataList th");
	let $rows = $("table#dataList tbody tr").each(function(index) {
	  $cells = $(this).find("td");
	  myRows[index] = {};
	  $cells.each(function(cellIndex) {
	  	if ($headers[cellIndex].children.length == 1) {
	  		myRows[index]['select'] = $(this).find("input").eq(0).prop("checked");
	  	}else{
	  		column_name = $($headers[cellIndex]).html();
	  		if (userful_columns.includes(column_name)) {
	  			myRows[index][mapping[column_name]] = $(this).html();
	  		}
	  	}
	  });    
	});
	return myRows.slice(1);
};

function updateGPA(){
	const GPA_mapping_rules = {'A+':4, 'A':3.94, 'A-':3.85,
	 'B+':3.73, 'B':3.55, 'B-':3.32,'C+':3.09, 'C':2.78,
	  'C-':2.42,'D+':2.08, 'D':1.63, 'D-':1.15, 'F':0};
	let data = getTableData();
	const reducer = (info, cur) =>{
		// console.log(info);
		// console.log(cur);
		if (cur['grade'] != 'P' && cur['select'] == true) {
			let credit = parseInt(cur['credit']);
			info['total_credits'] += credit;
			info['total_points'] += GPA_mapping_rules[cur['grade']]*credit;
		}
		return info;
	}
	let init_info = {'total_credits': 0, 'total_points':0};
	let info = data.reduce(reducer, init_info)
	let final_gpa = info['total_points']/info['total_credits'];
	final_gpa = final_gpa.toFixed(2);
	$("p#gpa").text(`Selected GPA is ${final_gpa}.`);
	// console.log(final_gpa)
	//alert("Selected GPA is 4.0!");
};


function loadInGradePage(){
	$("table#dataList").find('th').eq(2).after('<th>\
		<input id="checkAll" type="checkbox" checked/>All</th>');
	$("table#dataList").find('th').eq(3).css("width", "40px");
	$('table#dataList').find('tr').each(function(){
        $(this).find('td').eq(2).after('<td><input name="subBox" \
        	type="checkbox" checked /></td>');
    });
    $("#checkAll").click(function() {
        $('input[name="subBox"]').prop("checked",this.checked);
        updateGPA();
    });
    let $subBox = $("input[name='subBox']");
    $subBox.click(function(){
        $("#checkAll").attr("checked",$subBox.length == $("input[name='subBox']:checked").length ? true : false);
        updateGPA();
    });
    $("table#dataList").before("<p id='gpa'>Selected GPA is</p>" );
    $("p#gpa").css("font-size", '20px').css('color', 'red');
    updateGPA();
}

function loadInIndexPage(){
	$("div.block10tex").text("GPA 查询");
	$("div.block10").parent().eq(0).attr('href', '/jsxsd/kscj/cjcx_list')
}

$(function(){
	let pathname = window.location.pathname;
	if (pathname == '/jsxsd/kscj/cjcx_list') {
		loadInGradePage();
	}else if(pathname == '/jsxsd/framework/main.jsp' ||
		pathname == '/jsxsd/framework/xsMain.jsp'
		){
		loadInIndexPage();
	}
});