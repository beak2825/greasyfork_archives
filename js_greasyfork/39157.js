// ==UserScript==
// @name        Asus router GUI fixer-upper
// @namespace   V@no
// @author      V@no
// @description fixes several annoyances in AsusWRT UI
// @include     http://router.asus.com/*
// @include     https://router.asus.com:8443/*
// @include     http://192.168.1.1/*
// @include     https://192.168.1.1/*
// @license     MIT
// @version     1.1
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39157/Asus%20router%20GUI%20fixer-upper.user.js
// @updateURL https://update.greasyfork.org/scripts/39157/Asus%20router%20GUI%20fixer-upper.meta.js
// ==/UserScript==


function $$(id)
{
	return document.getElementById(id);
}

var log = console.log;

function multiline(func, ws)
{
	func = func.toString();
	func = func.slice(func.indexOf("/*") + 2, func.lastIndexOf("*/")).split("*//*").join("*/");
	return ws ? func : func.replace(/[\n\t]*/g, "");
}
var css = document.createElement("style")
css.innerHTML = multiline(function(){/*
.monitor_qos_bg
{
	height: unset !important;
}
.table1px td > div:first-child
{
	height: unset !important;
}
.NM_radius_bottom_container
{
	height: 100% !important;
}
#statusframe
{
	height: 860px !important;
}
*/});

wait(function()
{
	if (typeof(validator) == "undefined")
		return;

	for(let i in _validator)
	{
		window.validator[i] = _validator[i];
	}
	return true;
}, 10000);

wait(function()
{
	if (typeof(showDropdownClientList) == "undefined")
		return;

	let _showDropdownClientList = showDropdownClientList,
			_removeClient = removeClient;

	window.showDropdownClientList = function showDropdownClientList (_callBackFun, _callBackFunParam, _interfaceMode, _containerID, _pullArrowID, _clientState)
	{
		_showDropdownClientList.apply(null, arguments);
		let s = $$(_containerID).querySelectorAll("strong[onclick]");
		for(let i = 0; i < s.length; i++)
		{
			s[i].setAttribute("onclick", s[i].getAttribute("onclick").replace(/_clientlist_offline\'\)/, "_clientlist_offline\',event)"));
		}
		function fixTitle(id)
		{
			let a = $$(id);
			if (!a)
				return;

			a = a.getElementsByTagName("a");

			for (let i = 0; i < a.length; i++)
			{
				let ip = clientList[a[i].id].ip;
				if (ip == "offline")
					continue;

				a[i].title = ip + "\n" + a[i].title;
			}
		}
		fixTitle(_containerID + "_clientlist_online");
		fixTitle(_containerID + "_clientlist_offline");
	}

	window.removeClient = function removeClient(_mac, _controlObj, _controlPanel, e)
	{
		if (!window.event)
			window.event = e;

		if (window.event)
		{
			window.event.stopPropagation();
			window.event.preventDefault();
			window.event.stopImmediatePropagation();
		}
		return _removeClient.apply(null, arguments);
	}
	return true;
}, 10000);

wait(function()
{
	if (typeof(generateDetailTable) == "undefined")
		return;

	let _generateDetailTable = generateDetailTable;
	window.generateDetailTable = function generateDetailTable (data)
	{
		_generateDetailTable.apply(null, arguments);

log(clientList);
	if ($$("detail_info_table"))
	{
		let list = $$("detail_info_table").children;
		for(let i = 1; i < list.length; i++)
		{
			let div = list[i].getElementsByTagName("div")[2],
					c = clientList[div.innerHTML];
			if (!c)
				continue;

			div.innerHTML = c.name;
			div.title = c.ip + "\n" + c.mac;
		}
	}
		function fixDiv(id)
		{
			let a = $$(id);
			if (!a)
				return;

			a = a.getElementsByTagName("a");

			for (let i = 0; i < a.length; i++)
			{
				let ip = clientList[a[i].id].ip;
				if (ip == "offline")
					continue;

				a[i].title = ip + "\n" + a[i].title;
			}
		}
	}
	return true;
}, 10000);


wait(function()
{
	let div = $$("clientlist_viewlist_content");
	if (!div)
		return;

	div.removeAttribute("onselectstart");
	return true;
}, 10000);

function func()
{
	let ad = $$("p180-root");
	if (ad)
		ad.parentNode.removeChild(ad);

	document.getElementsByTagName("head")[0].appendChild(css);
	document.body.onselectstart = null;
}

if (document.readyState != "loading")
	func();
else
	document.addEventListener("DOMContentLoaded", func ,true);

function collectInfo(data){
for(i=0;i<data.length;i++){
var mac = data[i][0];
var ip = ""
var hit = data[i][1];
var name = "";
if(clientList[mac]){
name = (clientList[mac].nickName == "") ? clientList[mac].name : clientList[mac].nickName;
ip = clientList[mac].ip;
}
else{
name = mac;
}
hit_count_all += parseInt(hit);
info_bar.push(mac);
info_bar[mac] = new targetObject(ip, name, hit, mac);
}
generateBarTable();
}

var _validator = {
	checkKey: function(e)
	{
		//for Mac + Safari, let 'Command + A'(C, V, X) can work
		return (e.metaKey || e.ctrlKey) && [65, 67, 86, 88, 97, 99, 118, 120, 122].indexOf(e.keyCode ? e.keyCode : e.which) != -1;
	},
	isHWAddr: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		var i, j;
		if (this.isFunctionButton(event))
		{
			return true;
		}

		if ((keyPressed > 47 && keyPressed < 58) || (keyPressed > 64 && keyPressed < 71) || (keyPressed > 96 && keyPressed < 103))
		{ //Hex
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == ':')
				{
					j++;
				}
			}
			if (j < 5 && i >= 2)
			{
				if (o.value.charAt(i - 2) != ':' && o.value.charAt(i - 1) != ':')
				{
					o.value = o.value + ':';
				}
			}
			return true;
		}
		else if (keyPressed == 58 || keyPressed == 13)
		{ //symbol ':' & 'ENTER'
			return true;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		else
		{
			return false;
		}
	},
	isNumberFloat: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed == 46) || (keyPressed > 47 && keyPressed < 58))
			return true;
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		else
			return false;
	},
	isNegativeNumber: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed == 45) || (keyPressed > 47 && keyPressed < 58))
			return true;
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		else
			return false;
	},
	isNumber: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if (keyPressed > 47 && keyPressed < 58)
		{
			/*if (keyPressed==48 && o.value.length==0){ //single 0
      return false;
      }*/
			return true;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		else
		{
			return false;
		}
	},
	isIPAddr: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		var i, j;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed > 47 && keyPressed < 58))
		{
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (j < 3 && i >= 3)
			{
				if (o.value.charAt(i - 3) != '.' && o.value.charAt(i - 2) != '.' && o.value.charAt(i - 1) != '.')
				{
					o.value = o.value + '.';
				}
			}
			return true;
		}
		else if (keyPressed == 46)
		{
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (o.value.charAt(i - 1) == '.' || j == 3)
			{
				return false;
			}
			return true;
		}
		else if (keyPressed == 13)
		{ // 'ENTER'
			return true;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		return false;
	},
	isIPAddrPlusNetmask: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		var i, j;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed > 47 && keyPressed < 58))
		{
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (j < 3 && i >= 3)
			{
				if (o.value.charAt(i - 3) != '.' && o.value.charAt(i - 2) != '.' && o.value.charAt(i - 1) != '.')
				{
					o.value = o.value + '.';
				}
			}
			return true;
		}
		else if (keyPressed == 46)
		{
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (o.value.charAt(i - 1) == '.' || j == 3)
			{
				return false;
			}
			return true;
		}
		else if (keyPressed == 47)
		{
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (j < 3)
			{
				return false;
			}
			return true;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		return false;
	},
	isIPRange: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		var i, j;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed > 47 && keyPressed < 58))
		{ // 0~9
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (j < 3 && i >= 3)
			{
				if (o.value.charAt(i - 3) != '.' && o.value.charAt(i - 2) != '.' && o.value.charAt(i - 1) != '.')
					o.value = o.value + '.';
			}
			return true;
		}
		else if (keyPressed == 46)
		{ // .
			j = 0;
			for (i = 0; i < o.value.length; i++)
			{
				if (o.value.charAt(i) == '.')
				{
					j++;
				}
			}
			if (o.value.charAt(i - 1) == '.' || j == 3)
			{
				return false;
			}
			return true;
		}
		else if (keyPressed == 42)
		{ // *
			return true;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		return false;
	},
	isPortRange: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed > 47 && keyPressed < 58))
		{ //0~9
			return true;
		}
		else if (keyPressed == 58 && o.value.length > 0)
		{
			for (var i = 0; i < o.value.length; i++)
			{
				var c = o.value.charAt(i);
				if (c == ':' || c == '>' || c == '<' || c == '=')
					return false;
			}
			return true;
		}
		else if (keyPressed == 44)
		{ //"�? can be type in first charAt ::: 0220 Lock add"
			if (o.value.length == 0)
				return false;
			else
				return true;
		}
		else if (keyPressed == 60 || keyPressed == 62)
		{ //">" and "<" only can be type in first charAt ::: 0220 Lock add
			if (o.value.length == 0)
				return true;
			else
				return false;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		return false;
	},
	isPortlist: function(o, event)
	{
		var keyPressed = event.keyCode ? event.keyCode : event.which;
		if (this.isFunctionButton(event))
		{
			return true;
		}
		if ((keyPressed > 47 && keyPressed < 58) || keyPressed == 32)
		{
			return true;
		}
		else if (this.checkKey(event))
		{ //for Mac + Safari, let 'Command + A'(C, V, X) can work
			return true
		}
		else
		{
			return false;
		}
	},
};

function wait(cond, i)
{
	if (!wait._map)
		wait._map = new Map();

	if (wait._map.has(cond))
		i = wait._map.get(cond) - 1

	wait._map.set(cond, i);

	if (!i)
		return false;

	if (cond())
	{
		wait._map.delete(cond);
		return false;
	}

	return setTimeout(function()
	{
		return wait(cond);
	}, 0)
}

//TrafficAnalyzer_Statistic.asp
wait(function()
{
	if (!("draw_pie_chart" in window))
		return;

	__get_client_info = window.get_client_info;
	__draw_pie_chart = window.draw_pie_chart;
	__get_client_used_apps_info = window.get_client_used_apps_info;
	eval(get_client_used_apps_info.toString().replace("parseInt((app_traffic/total_traffic)*100);", "(app_traffic/total_traffic)*100;"));
	window.get_client_info = function()
	{
		return _get_client_info.apply(__get_client_info, arguments);
	}
	window.get_client_used_apps_info = function()
	{
		return get_client_used_apps_info.apply(__get_client_used_apps_info, arguments);
	}
	window.draw_pie_chart = function()
	{
		return _draw_pie_chart.apply(__draw_pie_chart, arguments);
	}
	return true;

	function _get_client_info(list_info, type)
	{
		var code = "";
		var match_flag = 0;
		var temp_array = new Array();
		if (type == "router")
			code = "<option value='all' selected>All Clients</option>";
		else
			code = "<option value='all' selected>All apps</option>";
		top5_client_array = [];
		top5_app_array = [];
		for (i = 0; i < list_info.length; i++)
		{
			if (type == "router")
			{
				for (j = 0; j < clientList.length; j++)
				{
					if (all_client_traffic[i][0] == clientList[j])
					{
						match_flag = 1;
						clientList[clientList[j]].totalTx = all_client_traffic[i][1];
						clientList[clientList[j]].totalRx = all_client_traffic[i][2];
						break;
					}
				}
				if (match_flag == 1)
				{
					var clientName = getClientCurrentName(all_client_traffic[i][0]);
					code += "<option value=" + all_client_traffic[i][0] + ">" + clientName + "</option>";
					if (i < 6)
					{
						top5_client_array[i] = all_client_traffic[i][0];
						top5_client_array[all_client_traffic[i][0]] = {
							"mac": all_client_traffic[i][0],
							"name": clientName,
							"tx": all_client_traffic[i][1],
							"rx": all_client_traffic[i][2]
						};
					}
else
{
top5_client_array[top5_client_array[5]].tx += all_client_traffic[i][1]
top5_client_array[top5_client_array[5]].rx += all_client_traffic[i][2]
}
				}
				else
				{
					code += "<option value=" + all_client_traffic[i][0] + ">" + all_client_traffic[i][0] + "</option>";
					if (i < 6)
					{
						top5_client_array[i] = all_client_traffic[i][0];
						top5_client_array[all_client_traffic[i][0]] = {
							"mac": all_client_traffic[i][0],
							"name": all_client_traffic[i][0],
							"tx": all_client_traffic[i][1],
							"rx": all_client_traffic[i][2]
						};
					}
else
{
top5_client_array[top5_client_array[5]].tx += all_client_traffic[i][1]
top5_client_array[top5_client_array[5]].rx += all_client_traffic[i][2]
}
				}
				match_flag = 0;
				total_clients_array[i] = all_client_traffic[i][0];
				total_clients_array[all_client_traffic[i][0]] = {
					"mac": all_client_traffic[i][0],
					"name": all_client_traffic[i][0],
					"tx": all_client_traffic[i][1],
					"rx": all_client_traffic[i][2]
				};
			}
			else
			{
				code += "<option value=" + all_app_traffic[i][0].replace(/\s/g, '_') + ">" + all_app_traffic[i][0] + "</option>";
				if (i < 6)
				{
					top5_app_array[i] = all_app_traffic[i][0];
					top5_app_array[all_app_traffic[i][0]] = {
						"name": all_app_traffic[i][0],
						"tx": all_app_traffic[i][1],
						"rx": all_app_traffic[i][2]
					};
				}
else
{
top5_app_array[top5_app_array[5]].tx += all_app_traffic[i][1]
top5_app_array[top5_app_array[5]].rx += all_app_traffic[i][2]
}
			total_apps_array[i] = all_app_traffic[i][0];
				total_apps_array[all_app_traffic[i][0]] = {
					"mac": all_app_traffic[i][0],
					"name": all_app_traffic[i][0],
					"tx": all_app_traffic[i][1],
					"rx": all_app_traffic[i][2]
				};
			}
if (i == 5)
{
if (top5_client_array[top5_client_array[5]])
{
	top5_client_array["others"] = top5_client_array[top5_client_array[5]]
	top5_client_array["others"].mac = "others"
	top5_client_array["others"].name = "others"
	delete top5_client_array[top5_client_array[5]];
	top5_client_array[5] = "others";
}
if (top5_app_array[top5_app_array[5]])
{
	top5_app_array["others"] = top5_app_array[top5_app_array[5]]
	top5_app_array["others"].mac = "others"
	top5_app_array["others"].name = "others"
	delete top5_app_array[top5_app_array[5]];
	top5_app_array[5] = "others";
}
}
		}
if (total_apps_array.length)
total_apps_array.others = top5_app_array.others;
if (total_clients_array.length)
total_clients_array.others = top5_client_array.others

window.total_clients_array = total_clients_array;
window.top5_client_array = top5_client_array;
window.top5_app_array = top5_app_array;
window.total_apps_array = total_apps_array;
		if (type == "router")
			draw_pie_chart(list_info, top5_client_array, type); //list_info : all_client_traffic
		else
			draw_pie_chart(list_info, top5_app_array, type); //list_info : all_app_traffic
		document.getElementById('client_option').innerHTML = code;
	}


	function _draw_pie_chart(list_info, top5_info, type)
	{
		var percent = 0;
		var percent_others = 100;
		var client_traffic = 0;
		var client_traffic_others = 0;
		var total_client_traffic = 0;
		var client_traffic_display = new Array();
		var pieData = [];
		var code = "";
		for (i = 0; i < list_info.length; i++)
		{
			if (document.getElementById('traffic_option').value == "both")
			{
				total_client_traffic += list_info[i][1] + list_info[i][2];
if (i > 4)
client_traffic_others += list_info[i][1] + list_info[i][2]
			}
			else if (document.getElementById('traffic_option').value == "down")
			{
				total_client_traffic += list_info[i][2];
if (i > 4)
client_traffic_others += list_info[i][2]
			}
			else
			{
				total_client_traffic += list_info[i][1];
if (i > 4)
client_traffic_others += list_info[i][1]
			}
		}
		if (top5_info == "")
		{
			pieData = [
			{
				unit: "",
				label: "No Data",
				value: 0,
				color: "#B3645B",
				percent: 100,
				id: "0"
			}];
			code = '<div style="width:110px;word-wrap:break-word;padding-left:5px;background-color:#B3645B;margin-right:-10px;border-top-left-radius:10px;border-bottom-left-radius:10px;">No Client</div>';
		}
		else
		{
			for (i = 0; i < top5_info.length && i < 6; i++)
			{
				if (document.getElementById('traffic_option').value == "both")
				{
					if (i < 5)
					{
						client_traffic = list_info[i][1] + list_info[i][2];
					}
/*
					else
					{
						client_traffic_others += list_info[i][1] + list_info[i][2];
					}
*/
				}
				else if (document.getElementById('traffic_option').value == "down")
				{
					if (i < 5)
					{
						client_traffic = list_info[i][2];
					}
/*
					else
					{
						client_traffic_others += list_info[i][2];
					}
*/
				}
				else
				{
					if (i < 5)
					{
						client_traffic = list_info[i][1];
					}
/*
					else
					{
						client_traffic_others += list_info[i][1];
					}
*/
				}
				if (i < 5)
				{
percent = (client_traffic / total_client_traffic) * 100;
					percent_others -= percent;
				}
				else
				{
					percent = percent_others;
				}
				if (percent < 1)
					percent = 1;
				client_traffic_display = translate_traffic(client_traffic);
				if (i == 5)
				{
				client_traffic_display = translate_traffic(client_traffic_others);
					var temp = {
						label: "Others",
						percent: percent,
						value: client_traffic_display[0],
						unit: client_traffic_display[1],
						color: color[i],
						id: top5_info[i]
					};
				}
				else
				{
					var temp = {
						label: top5_info[top5_info[i]].name,
						percent: percent,
						value: client_traffic_display[0],
						unit: client_traffic_display[1],
						color: color[i],
						id: top5_info[i]
					};
				}
				pieData.push(temp);
				if (i == 0)
					code += '<div onclick=\'change_top5_clients(\"' + i + '\",\"' + type + '\");\' style="width:110px;word-wrap:break-word;padding-left:5px;background-color:' + color[i] + ';margin-right:-10px;border-top-left-radius:10px;line-height:30px;cursor:pointer">' + top5_info[top5_info[i]].name + '</div>';
				else if (i == 5)
					code += '<div onclick=\'change_top5_clients(\"' + i + '\",\"' + type + '\");\' style="width:110px;word-wrap:break-word;padding-left:5px;background-color:' + color[i] + ';margin-right:-10px;border-bottom-left-radius:10px;line-height:30px;cursor:pointer">Others</div>';
				else if (i != 6)
					code += '<div onclick=\'change_top5_clients(\"' + i + '\",\"' + type + '\");\' style="width:110px;word-wrap:break-word;padding-left:5px;background-color:' + color[i] + ';margin-right:-10px;line-height:30px;cursor:pointer">' + top5_info[top5_info[i]].name + '</div>';
			}
		}
		document.getElementById('top5_client_banner').innerHTML = code;
		if (pie_flag != undefined)
			pie_flag.destroy();
		pie_obj.Pie(pieData, pieOptions);
	}


}, 10000)
