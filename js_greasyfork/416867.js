// ==UserScript==
// @name         Training School Tools
// @namespace    np
// @version      0.1
// @description  try to take over the world!
// @author       Eat_Wooloo_As_Mutton
// @match        http://www.neopets.com/pirates/academy.phtml?type=status*
// @match        http://www.neopets.com/island/training.phtml?type=status*
// @match        http://www.neopets.com/island/fight_training.phtml?type=status*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416867/Training%20School%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/416867/Training%20School%20Tools.meta.js
// ==/UserScript==

const PIN = 4365; // set to 0 if you don't have PIN enabled for SDB

const url = location.href;
const itemID = {
	"One Dubloon Coin": "12755",
	"Two Dubloon Coin": "12756",
	"Five Dubloon Coin": "12757",
	"Mau Codestone": "7458",
	"Tai-Kai Codestone": "7459",
	"Lu Codestone": "7460",
	"Vo Codestone": "7461",
	"Eo Codestone": "7462",
	"Main Codestone": "7463",
	"Zei Codestone": "7464",
	"Orn Codestone": "7465",
	"Har Codestone": "7466",
	"Bri Codestone": "7467",
	"Mag Codestone": "22208",
	"Vux Codestone": "22209",
	"Cui Codestone": "22210",
	"Kew Codestone": "22211",
	"Sho Codestone": "22212",
	"Zed Codestone": "22213"
};

//$("b:contains('Current Course Status')").after('<br><br><button id="completeAll" type="button">Complete all</button>');

const process_url = location.pathname.replace(/\/(?!.+\/)/g, "/process_");

// Get list of all pets and stats
let stats = {};
$("b").filter(function () {
	return this.innerHTML.includes(" (Level ");
}).each(function (index, element) {
	const petName = $(element).text().split(" (Level")[0];
	stats[petName] = {};
	$(element).parent().parent().next().find("b").each(function (index2, element2) {
		const stat = $(element2).text();
		switch (index2) {
			case 0: // Lvl
				stats[petName]["Lvl"] = parseInt(stat);
				break;
			case 1: // Str
				stats[petName]["Str"] = parseInt(stat);
				break;
			case 2: // Def
				stats[petName]["Def"] = parseInt(stat);
				break;
			case 3: // Mov
				stats[petName]["Mov"] = parseInt(stat);
				break;
			case 4: // Hp
				stats[petName]["Hp"] = parseInt(stat.split("/")[1]);
				break;
			default:
				return false;
		}
	});
});

// Create quick course table
let tableRows = '';
for (let pet in stats) {
	tableRows += '<!--' + pet + '--><tr> <td><input type="hidden" value="' + pet + '"><span>' + pet + '</span></td><td><input name="course-' + pet + '" type="radio" value="Level"> <br><b id="' + pet + '-stat-Lvl" style="color: green">' + stats[pet]["Lvl"] + '</b></td><td><input name="course-' + pet + '" type="radio" value="Strength"> <br><b id="' + pet + '-stat-Str">' + stats[pet]["Str"] + '</b></td><td><input name="course-' + pet + '" type="radio" value="Defence"> <br><b id="' + pet + '-stat-Def">' + stats[pet]["Def"] + '</b></td><td><input name="course-' + pet + '" type="radio" value="Agility"> <br><b id="' + pet + '-stat-Mov">' + stats[pet]["Mov"] + '</b></td><td><input name="course-' + pet + '" type="radio" value="Endurance"><br><b id="' + pet + '-stat-Hp">' + stats[pet]["Hp"] + '</b></td></tr>';
}
let courseTable = '<br><br><style>.courses{margin-left: auto; margin-right: auto; table-layout: fixed; width: 60%; border: 2px solid black; border-collapse: collapse; text-align: center;}.courses td, .courses th{border: 1px solid black; padding: 3px;}.courses tbody tr:nth-child(even){background-color: #e3e3e3}.courses input[type="radio"]{width: 20px; height: 20px; cursor: pointer;}</style><table class="courses"> <colgroup> <col span="1" style="width: 20%;"> <col span="5" style="width: 7%;"> </colgroup> <tbody> <tr style="background-color: #72bd80"> <th><b></b></th> <th><b>Lvl</b></th> <th><b>Str</b></th> <th><b>Def</b></th> <th><b>Mov</b></th> <th><b>Hp</b></th> </tr>' + tableRows + ' <tr id="checkall"> <td><b>Check All</b></td><td><input name="checkall" type="radio" class="checkall-Level" id="lvl-all"></td><td><input name="checkall" type="radio" class="checkall-Strength" id="str-all"></td><td><input name="checkall" type="radio" class="checkall-Defence" id="def-all"></td><td><input name="checkall" type="radio" class="checkall-Agility" id="mov-all"></td><td><input name="checkall" type="radio" class="checkall-Endurance" id="hp-all"></td></tr></tbody> <tfoot> <tr> <td colspan="6" style="text-align:center;"> <input type="button" id="train-all" value="Train Pets"> &nbsp;&nbsp; <input type="button" id="reset-all" value="Clear Form"> </td></tr></tfoot></table>';
$("b:contains('Current Course Status')").after(courseTable);
$("#checkall input").each(function (index, element) {
	const $this = $(element);
	const stat = $this.attr("class").split("-")[1];
	$this.on("change", function () {
		if ($this.prop("checked")) {
			$(":radio").filter(function () {
				return this.value === stat;
			}).each(function () {
				$(this).prop("checked", true);
			})
		}
	});
});
$("#reset-all").on("click", function () {
	$(".courses :radio").each(function (index, element) {
		$(element).prop("checked", false);
	});
});
$("#train-all").on("click", function () {
	$(".courses input").each(function (index, element) {
		$(element).prop("disabled", true); // disable all radio buttons
	});
	let training = [];
	$(".courses tbody").find("input:checked:not([name='checkall'])").each(function (index, element) {
		const pet = $(element).attr("name").split("-")[1];
		const stat = $(element).val();
		training.push([pet, stat]);
	});
	(async () => {
		$('<div style="position: fixed;padding: 5px; opacity: 0.6; width: 200px; text-align: left; right: 5px; top: 180px; background-color: #000099; color: #FFFFFF" id="start-result">Processing...</div>').appendTo("body");
		for (let i = 0; i < training.length; i++) {
			const pet = training[i][0];
			const stat = training[i][1];
			const result = await startCourse(pet, stat);
			console.log(result);
			$("#start-result").html("[" + (i + 1) + " / " + training.length + "]<br><br>" + result["Pet"] + " (" + result["Course"] + ") : " + "<br><br>" + result["Status"]);
		}
		location.reload();
	})();
});

// Replace complete course button
let forms = $("form[action*='process_']"); // get all available "Complete course!" forms
for (let i = 0; i < forms.length; i++) {
	let petName = forms.eq(i).find("input[name='pet_name']").val();
	let completeButton = forms.eq(i).find(":submit[value='Complete Course!']");
	completeButton.replaceWith('<button id="complete-' + petName + '" type="button">Complete!</button>');
	$("#complete-" + petName).on("click", function () {
		$(this).prop("disabled", true);
		completeCourse(this, petName);
	});
}

// Add button to get dubloons/codestones from SDB
// codestone
$("a[href*='_training.phtml?type=pay&pet_name=']").each(function (index, element) {
	//let petName = $(element).attr("href").split("&pet_name=")[1];
	let $p = $(element).next("p");
	$p.before('<br><button class="getItems" type="button">Get items from SDB</button>');
});
// dubloon
$("b:contains(' Dubloon Coin')").each(function (index, element) {
	$(element).parent().parent().before('<tr><td style="text-align: center" colspan="2"><button class="getItems" type="button">Get from SDB</button></td></tr>');
});
// Handler
$(".getItems").each(function (index, element) {
	$(element).on("click", function () {
		$(this).prop("disabled", true);
		let items = [];
		if (url.includes("/island/")) {
			$(element).next("p").find("b:contains('Codestone')").each(function (index, element) {
				let codestone = $(element).text();
				items.push(codestone);
			});
		}
		if (url.includes("/pirates/")) {
			let dubloon = $(element).parentsUntil("table").eq(2).find("b").text();
			items.push(dubloon);
		}
		console.log(items);
		(async () => $(this).html(await getItemsFromSDB(items)))();
	});
});

/* --------------------- Functions --------------------- */

function completeCourse(element, pet) {
	const $this = $(element);
	$.ajax({
		type: "POST",
		url: process_url,
		async: false,
		data: {
			"type": "complete",
			"pet_name": pet
		},
		success: function (data, status) {
			let stat = data.match(/increased (\w+)/)[1] || "error";
			let bonus = data.includes("SUPER BONUS") ? parseInt(data.match(/SUPER BONUS - You went up (\d+) points/)[1]) : 1;
			console.log({
				"pet": pet,
				"status": status,
				"stat": stat,
				"bonus": bonus
			});
			//console.log(data);
			let result = stat === "error" ? "error" : '<b style="color:green">Course complete!</b><br><br><span>+' + bonus + ' ' + stat + '</span><br><br><button id="repeat-' + pet + '" type="button">Repeat this course</button>';
			$this.parent().parent().html(result);
			if (document.getElementById("repeat-" + pet)) {
				$("#repeat-" + pet).on("click", function () {
					$(this).prop("disabled", true);
					startCourse(pet, stat)
				});
			}
		}
	});
}

function startCourse(pet, course) {
	return new Promise(resolve => {
		setTimeout(function () {
			$.ajax({
				type: "POST",
				url: process_url,
				async: false,
				data: {
					"type": "start",
					"course_type": course,
					"pet_name": pet
				},
				success: function (data) {
					let error = data.includes("Error:") ? "Error: " + data.split("<b>Error: </b>")[1].split("</div>")[0] : "successful";
					resolve({
						"Pet": pet,
						"Course": course,
						"Status": error
					});
				}
			});
		}, 1500);
	})
}

function getItemsFromSDB(array) {
	return new Promise(resolve => {
		let postData = {};
		let itemCount = {};
		for (let i = 0; i < array.length; i++) {
			let id = itemID[array[i]];
			if (!itemCount[id]) {
				itemCount[id] = 0;
			}
			itemCount[id]++;
			for (let item in itemCount) {
				if (itemCount[item] > 0) {
					postData["back_to_inv[" + id + "]"] = itemCount[item];
				}
			}
		}
		postData["category"] = "0";
		postData["offset"] = "0";
		if (PIN) {
			postData["pin"] = PIN.toString();
		}
		$.ajax({
			type: "POST",
			url: "/process_safetydeposit.phtml?checksub=scan",
			async: false,
			data: postData,
			success: function (data) {
				resolve("Done!");
			}
		});
	})
}