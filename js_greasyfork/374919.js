// ==UserScript==
// @name         USW_harvard
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @match        https://scholar.googleusercontent.com/scholar.bib?*
// @match        https://scholar.google.com.hk/*
// @match        https://scholar.google.com/*
// @match        https://scholar.google.co.uk/*
// @match        https://scholar.google.com.tw/*
// @grant 		 GM_setClipboard
// @grant        GM_notification

// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374919/USW_harvard.user.js
// @updateURL https://update.greasyfork.org/scripts/374919/USW_harvard.meta.js
// ==/UserScript==
$(document).ready(function(){
if(window.location.href.indexOf("https://scholar.googleusercontent.com/scholar.bib?") > -1) {
var string_ = $("pre").text()

string_ = string_.replace(/\{\\\"u\}/g,"ü")

string_ = string_ .split("\n")
var important_name_list = []
var temp_arr = {}
function get_data(dataname){
	return temp_arr[dataname]
}

function parse_items(content){
	var content_arr = content.split("=")
	var item_key = content_arr[0].replace("  ","")
	var item_get = content_arr[1].replace("{","").replace("},","").replace("}","")


	return [item_key,item_get]

}

function check_type(line){
	if (line.indexOf("@book")!= -1) {
		return "BOOK"
	}
	if (line.indexOf("@article")!= -1) {
		return "ARTICLE"
	}
}

var _type = check_type(string_[0])

for (var i = 0; i < string_.length; i++) {
	if (i != 0 && string_[i].indexOf("=")!=-1) {

		var result = parse_items(string_[i])
		temp_arr[result[0]] = result[1]

	}


}

var name_string = ''

console.log(temp_arr)
function parse_name(name){
	console.log(name)
	if (name == " others") {
		return ''
	}
	var name_arr = name.split(",")
	var important_name = name_arr[0]
	important_name_list.push(important_name)
	var not_important_name = name_arr[1]
	var res = important_name+","+" "
	not_important_name_arr = not_important_name.split(" ")
	for (var i = 0; i < not_important_name_arr.length; i++) {
		if (not_important_name_arr[i]!="") {
			res+=not_important_name_arr[i][0]+". "
		}
	}
	return res
}


var name_arr = get_data("author").split("and")
var name_res = ""
console.log(name_arr)
for (var i = 0; i < name_arr.length; i++) {
	name_res += parse_name(name_arr[i])
	if(name_res != ''){
	
	if (i==name_arr.length-1) {

	}else{
		if ((i == name_arr.length-2 && name_arr[name_arr.length-1] != ' others' ) || (i== name_arr.length-3 && name_arr[name_arr.length-1] == ' others'  )) {
			name_res += ", & "
		}else{
			name_res += ", "
		}

	}
	}
}

name_res = name_res.replace(/.\s,/g,".,")

var final_output = ""
if (_type == "BOOK") {
	final_output += name_res + "(" +get_data("year") +") " +"<i>" + get_data("title")+"</i>. " +""+ get_data("publisher")+""

}

if (_type == "ARTICLE") {
	final_output += name_res + "(" +get_data("year") +") " +"‘" + get_data("title")+"’, " +"<i>"+ get_data("journal")+"</i>"
	if (get_data("volume") && get_data("number") && get_data("pages")) {
		final_output +=", "+get_data("volume")+ "(" + get_data("number") + ")"+", "+"pp. "+get_data("pages").replace("-","")
	} else{
		"."
	}

}

$("body").append("<h3>Inline</h3>")
$("body").append("<div id='inline_list'></div>")
$("body").append("<h3>ref list</h3>")
$("body").append("<div id='reflist'></div>")
$("#reflist").append(final_output)
//$("#reflist").append("<span class='copy-tool'  data='output' style='font-weight: bold;cursor:pointer;color:#AD48FF'>\t\tcopy</span>")
function get_inline_important_name(){
	console.log("im-name",important_name_list)
	if (important_name_list.length>=4) {
		return important_name_list[0] + " et al. ("+get_data("year")+")"
	}
	if(important_name_list.length == 1){
		return important_name_list[0] +" ("+get_data("year")+")"
	}
	var res = ''

	for (var i = 0; i < important_name_list.length; i++) {
		if (i == important_name_list.length - 2 ) {
			res+=important_name_list[i]+" and "
		}else{
		if (i==0 && important_name_list.length!=2){
			res+= important_name_list[i]+", "
		}else{
			res+= important_name_list[i]
		}}
	}
	res+=" ("+get_data("year")+")"
	return res
}

var inline_style_1 = get_inline_important_name()

var inline_style_2 =  "(" + get_inline_important_name().replace(" ("+get_data("year")+")","") + ", " +get_data("year")+")"

$("#inline_list").append(inline_style_1)
//$("#inline_list").append("<span class='copy-tool'  data='inline1' style='font-weight: bold;cursor:pointer;color:#AD48FF'>\t\tcopy</span>")
$("#inline_list").append("<br />"+"OR"+"<br />")
$("#inline_list").append(inline_style_2)
//$("#inline_list").append("<span class='copy-tool'  data='inline2' style='font-weight: bold;cursor:pointer;color:#AD48FF'>\t\tcopy</span>")
function chrome_notification_c(mystring) {
	window.focus();
	var notificationDetails = {
		text: mystring,
		title: '剪贴板',
		timeout: 0,
		onclick: function() {
			window.focus();
		},
	};
	GM_notification(notificationDetails);
}
$('.copy-tool').click(function(){
        data=$(this).attr("data")
        console.log(data)
        if (data == "output") {
        	data = final_output
        }
        if (data == "inline1") {
        	data = inline_style_1
        }
        if (data == "inline2") {
        	data = inline_style_2
        }
         console.log(data)
        GM_setClipboard(data)
		chrome_notification_c("已经复制到剪贴板")

})

}


if(window.location.href.indexOf("https://scholar.google.co.uk/scholar?") > -1 || window.location.href.indexOf("https://scholar.google.com.hk/scholar?") > -1|| window.location.href.indexOf("https://scholar.google.com.tw/scholar?") > -1 || window.location.href.indexOf("https://scholar.google.com/scholar?") > -1) {

$("#gs_res_sb_yyl").append('<li class="gs_ind"><a href="'+window.location.href+'&as_ylo=2010'+'">2010 以後</a></li>')
$("#gs_res_sb_yyl").append('<li class="gs_ind"><a href="'+window.location.href+'&as_ylo=2000'+'">2000 以後</a></li>')




console.log($(".gs_rt a"))
var c_links = []

for (var i = 0; i < $(".gs_rt a").length; i++) {
	c_links.push($(".gs_rt a").eq(i).attr("href"))
}

console.log(c_links)

for (var i = 0; i < $(".gs_ri > .gs_fl").length; i++) {
	$(".gs_ri > .gs_fl").eq(i).prepend('<a href="'+"http://sci-hub.tw/"+c_links[i]+'" class="sci_hub">Sci-Hub</a>')
}


}


})



