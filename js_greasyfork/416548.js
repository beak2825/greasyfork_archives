// ==UserScript==
// @name           Training School Tools
// @namespace      neopets
// @version        2021.01.17
// @description    Faster navigation on training pages
// @author         wtmeow
// @match          http://www.neopets.com/pirates/academy.phtml?type=status*
// @match          http://www.neopets.com/island/training.phtml?type=status*
// @match          http://www.neopets.com/island/fight_training.phtml?type=status*
// @require        https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416548/Training%20School%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/416548/Training%20School%20Tools.meta.js
// ==/UserScript==

const PIN = "0"; // set to "0" if you don't have PIN enabled for SDB

const url = location.href;
const itemID = {
    "One Dubloon Coin" : "12755",
    "Two Dubloon Coin" : "12756",
    "Five Dubloon Coin" : "12757",
    "Mau Codestone" : "7458",
    "Tai-Kai Codestone" : "7459",
    "Lu Codestone" : "7460",
    "Vo Codestone" : "7461",
    "Eo Codestone" : "7462",
    "Main Codestone" : "7463",
    "Zei Codestone" : "7464",
    "Orn Codestone" : "7465",
    "Har Codestone" : "7466",
    "Bri Codestone" : "7467",
    "Mag Codestone" : "22208",
    "Vux Codestone" : "22209",
    "Cui Codestone" : "22210",
    "Kew Codestone" : "22211",
    "Sho Codestone" : "22212",
    "Zed Codestone" : "22213"
};

const process_url = location.pathname.replace(/\/(?!.+\/)/g, "/process_");

const getTime = () => $("#nst").html().replace(/ NST/g, "");

// Get list of all pets and stats
let stats = {};
$("b").filter(function () {
    return this.innerHTML.includes(" (Level ")
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
            case 5:
                return false;
            default:
                return false;
        }
    });
});

// Add floating div
$(`<div id="quick-links-show" class="floating-box" style="display: none; width: auto;"><div style="color: #ffff00; text-align:right;"><span style="cursor: pointer;" id="floating-show">Show</span></div></div><div id="quick-links" class="floating-box"><div style="color: #ffff00; text-align:right;"><span style="cursor: pointer;" id="floating-hide">Hide</span></div><div style="font-size: 150%; text-align: center;">Quick links</div><br><br><button id="completeAll-button" class="quickButton">Complete all courses</button><br><button id="getAll-button" class="quickButton">Get all items</button><br><button id="payAll-button" class="quickButton">Pay all courses</button><div id="floating-results" style="letter-spacing: 0.03em;"></div></div>`).appendTo("body");
$("#floating-hide").on("click", function () {
    $("#quick-links").hide(300);
    $("#quick-links-show").show(300);
});
$("#floating-show").on("click", function () {
    $("#quick-links-show").hide(300);
    $("#quick-links").show(300);
});

// Add table
$("b:contains('Current Course Status')").after(`
<style>
    .courses {
        margin-left: auto;
        margin-right: auto;
        table-layout: fixed;
        width: 60%;
        border: 2px solid black;
        border-collapse: collapse;
        text-align: center;
    }

    .courses td, .courses th {
        border: 1px solid black;
        padding: 3px;
    }

    .courses tbody tr:nth-child(even) {
        background-color: #e3e3e3
    }

    .courses input[type="radio"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .floating-box {
        text-align: left;
        position: fixed;
        padding: 10px;
        opacity: 95%;
        width: 230px;
        right: 5px;
        top: 200px;
        background-color: #3c3f41;
        color: #FFFFFF;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        border-radius: 10px;
    }

    .quickButton {
        width: 100%;
        padding: 5px;
        border-radius: 10px;
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: 12px;
    }
</style>
<table id="courseTable" class="courses" style="display:none;">
    <colgroup>
        <col span="1" style="width: 20%;">
        <col span="5" style="width: 7%;">
    </colgroup>
    <tbody>
    <tr id="tableHeader" style="background-color: #72bd80">
        <th><b>Pet</b></th>
        <th><b>Lvl</b></th>
        <th><b>Str</b></th>
        <th><b>Def</b></th>
        <th><b>Mov</b></th>
        <th><b>Hp</b></th>
    </tr>
    <tr id="checkall">
        <td><b>Check All</b></td>
        <td><input name="checkall" type="radio" class="checkall-Level" id="lvl-all"></td>
        <td><input name="checkall" type="radio" class="checkall-Strength" id="str-all"></td>
        <td><input name="checkall" type="radio" class="checkall-Defence" id="def-all"></td>
        <td><input name="checkall" type="radio" class="checkall-Agility" id="mov-all"></td>
        <td><input name="checkall" type="radio" class="checkall-Endurance" id="hp-all"></td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="6" style="text-align:center;">
            <input type="button" id="train-all" value="Train Pets"> &nbsp;&nbsp;
            <input type="button" id="reset-all" value="Clear Form">
        </td>
    </tr>
    </tfoot>
</table>
`);

// Create quick course table
let tableRows = ``;
for (let pet in stats) {
    const thisPet = stats[pet];
    const withinLvlRange =
        url.includes("island/fight_training") || // Only pets >= Lv250 will appear on the page anyway
        url.includes("island/training") && thisPet["Lvl"] <= 250 ||
        url.includes("pirates/academy") && thisPet["Lvl"] <= 40;
    if ($(`b:contains(${pet})`).text().includes("is not on a course") &&
        withinLvlRange === true) {
        tableRows += `
            <!--${pet}-->
            <tr>
                <td>
                    <input type="hidden" value="${pet}">
                    <span>${pet}</span>
                </td>
                <td>
                    <input name="course-${pet}" type="radio" value="Level">
                    <br>
                    <b id="${pet}-stat-Lvl" style="color: green">${thisPet["Lvl"]}</b>
                </td>
                <td>
                    <input name="course-${pet}" type="radio" value="Strength">
                    <br>
                    <b id="${pet}-stat-Str">${thisPet["Str"]}</b>
                </td>
                <td>
                    <input name="course-${pet}" type="radio" value="Defence">
                    <br>
                    <b id="${pet}-stat-Def">${thisPet["Def"]}</b></td>
                <td>
                    <input name="course-${pet}" type="radio" value="Agility">
                    <br>
                    <b id="${pet}-stat-Mov">${thisPet["Mov"]}</b></td>
                <td>
                    <input name="course-${pet}" type="radio" value="Endurance">
                    <br>
                    <b id="${pet}-stat-Hp">${thisPet["Hp"]}</b>
                </td>
            </tr>`;
    }
}
if (tableRows !== ``) {
    $("#courseTable").show();
    $("#tableHeader").after(tableRows);
    $("#checkall input").each(function (index, element) {
        const $this = $(element);
        const stat = $this.attr("class").split("-")[1];
        $this.on("change", function () {
            if ($this.prop("checked")) {
                $(":radio").filter(function () {
                    return this.value === stat;
                }).each(function () {
                    $(this).prop("checked", true);
                });
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
            print(`[1 / ${training.length}]<br><br>Processing...`)
            for (let i = 0; i < training.length; i++) {
                const pet = training[i][0];
                const stat = training[i][1];
                const result = await startCourse(pet, stat);
                console.log(result);
                print(`[${i + 1} / ${training.length}]<br><br>${result["Pet"]} (${result["Course"]}) : <br><br>${result["Status"]}`);
            }
            location.replace(url);
        })();
    });
}

// Replace complete course button
const forms = $("form[action*='process_']"); // get all available "Complete course!" forms
for (let i = 0; i < forms.length; i++) {
    let petName = forms.eq(i).find("input[name='pet_name']").val();
    let completeButton = forms.eq(i).find(":submit[value='Complete Course!']");
    completeButton.replaceWith(`<button id="complete-${petName}" class="completeButton" type="button">Complete!</button>`);
    $(`#complete-${petName}`).on("click", function () {
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
                const codestone = $(element).text();
                items.push(codestone);
            });
        }
        if (url.includes("/pirates/")) {
            const dubloon = $(element).parentsUntil("table").eq(2).find("b").text();
            items.push(dubloon);
        }
        (async () => $(this).html(await getItemsFromSDB(items)))();
    });
});

/********************************
 *
 * All quick links
 *
 ********************************/

// Get all items
let getAllItems = [];
$(".getItems").each(function (index, element) {
    // Codestones
    if (url.includes("/island/")) {
        $(element).next("p").find("b:contains('Codestone')").each(function (index2, element2) {
            const codestone = $(element2).text();
            getAllItems.push(codestone);
        });
    }
    // Dubloons
    if (url.includes("/pirates/")) {
        const dubloon = $(element).parent().parent().parent().find("b:contains('Dubloon Coin')").html();
        getAllItems.push(dubloon);
    }
});

$("#getAll-button").on("click", function () {
    if (!getAllItems.length) {
        window.alert("No items to retrieve!");
        return false;
    }
    $(this).prop("disabled", true);
    let printItems = {};
    for (let i = 0; i < getAllItems.length; i++) {
        if (!printItems[getAllItems[i]]) {
            printItems[getAllItems[i]] = 0;
        }
        printItems[getAllItems[i]]++;
    }
    const itemList = JSON.stringify(printItems).replace(/,/g, "<br>").replace(/[{}"']/g, "").replace(/:(\d)/g, " (x$1)");
    (async () => {
        $(this).html(await getItemsFromSDB(getAllItems));
        print(`<span style="color:#00ffff">[${getTime()}]</span><br><br>Retrieved items:<br><br>${itemList}<br><br><span style="color: #ffff00; font-size: 80%">If some ${url.includes("/island/") ? "codestones" : "dubloons"} were not retrieved, you may not have enough in your Safety Deposit Box.</span>`);
    })();
});

// Complete all courses
$("#completeAll-button").on("click", function () {
    const numButtons = $(".completeButton").length;
    if (!numButtons) {
        window.alert("No courses to complete!");
        return false;
    }
    $(this).prop("disabled", true);
    print(`<span style="color:#00ffff">[${getTime()}]</span><br><br>Processing...`);
    (async () => {
        let printText = `<span style="color:#00ffff">[${getTime()}]</span><br><br>`;
        for (let i = 0; i < numButtons; i++) {
            const thisButton = $(".completeButton")[i];
            const petName = $(thisButton).attr("id").split("-")[1];
            const {pet, stat, bonus} = await completeCourse(thisButton, petName);
            printText += `${pet} : <span style="color: #00ff00">+${bonus}</span> ${stat}<br>`;
        }
        print(printText);
    })();
});

// Pay all courses
$("#payAll-button").on("click", function () {
    let payees = [];
    if (url.includes("/island/training.phtml")) {
        $("a[href*='process_training.phtml']").each(function (index, element) {
            const pet = $(element).attr("href").split("name=")[1];
            payees.push(pet);
        });
    } else if (url.includes("/pirates/academy.phtml")) {
        $(":submit[value='Pay']").each(function (index, element) {
            const pet = $(element).prev().prev().val();
            payees.push(pet);
        });
    } else if (url.includes("/island/fight_training.phtml")) {
        $("a[href*='process_fight_training.phtml?type=pay']").each(function (index, element) {
            const pet = $(element).attr("href").split("name=")[1];
            payees.push(pet);
        });
    }
    if (payees.length) {
        $(this).prop("disabled", true);
        (async () => {
            for (let i = 0; i < payees.length; i++) {
                const pet = payees[i];
                // print(`[${i + 1} / ${payees.length}]<br><br>${pet} (Paying...)`);
                const status = await payCourse(pet);
                print(`[${i + 1} / ${payees.length}]<br><br>${pet} (${status})`);
            }
            location.replace(url);
        })();
    } else {
        window.alert("No courses to pay!");
    }
});

/********************************
 *
 * Functions
 *
 *******************************/

function print(data = ``) {
    $("#floating-results").html(`<br><hr><br>${data}`);
}

function payCourse(pet) {
    return new Promise(resolve => {
        $.ajax({
            type : "GET",
            url : `${process_url}?type=pay&pet_name=${pet}`,
            success : data => {
                resolve(`<span style="color: #00ff00">Success</span>`);
            },
            error : data => {
                resolve(`<span style="color: #ff0000">Error</span>`);
            }
        });
    })
}

function completeCourse(element, pet) {
    return new Promise(resolve => {
        const $this = $(element);
        $this.prop("disabled", true);
        let response = {};
        $.ajax({
            type : "POST",
            url : process_url,
            // async : false,
            data : {
                "type" : "complete",
                "pet_name" : pet
            },
            success : (data, status) => {
                let stat = data.match(/increased (\w+)/)[1] || "error";
                let bonus = data.includes("SUPER BONUS") ? parseInt(data.match(/SUPER BONUS - You went up (\d+) points/)[1]) : 1;
                response = {
                    "pet" : pet,
                    "stat" : stat,
                    "bonus" : bonus,
                    "status" : status
                };
                let result = stat === "error" ? "error" : `<b style="color:green">Course complete!</b><br><br><span>+${bonus} ${stat}</span><br><br><button id="repeat-${pet}" type="button">Repeat this course</button>`;
                $this.parent().parent().find("b:contains('Course Finished')").replaceWith(result);
                if (document.getElementById(`repeat-${pet}`)) {
                    $(`#repeat-${pet}`).on("click", function () {
                        $(this).prop("disabled", true);
                        (async () => {
                            const result = await startCourse(pet, stat);
                            $(this).html(result["Status"]);
                            setTimeout(function () {
                                location.replace(url);
                            }, 1000);
                        })();
                    });
                }
                resolve(response);
            }
        });
    })
}

function startCourse(pet, course) {
    return new Promise(resolve => {
        setTimeout(() => {
            $.ajax({
                type : "POST",
                url : process_url,
                // async : false,
                data : {
                    "type" : "start",
                    "course_type" : course,
                    "pet_name" : pet
                },
                success : data => {
                    let error = data.includes("Error:") ? `Error: ${data.split("<b>Error: </b>")[1].split("</div>")[0]}` : "Successful";
                    resolve({
                        "Pet" : pet,
                        "Course" : course,
                        "Status" : error
                    });
                }
            });
        }, 1500);
    })
}

function getItemsFromSDB(array) {
    return new Promise(resolve => {
        console.log(array);
        let postData = {};
        let itemCount = {};
        for (let i = 0; i < array.length; i++) {
            let id = itemID[array[i]];
            if (!itemCount[id]) {
                itemCount[id] = 0;
            }
            itemCount[id]++;
        }
        for (let item in itemCount) {
            if (itemCount[item] > 0) {
                postData[`back_to_inv[${item}]`] = itemCount[item];
            }
        }
        postData["category"] = "0";
        postData["offset"] = "0";
        if (PIN && PIN !== "0") {
            postData["pin"] = PIN.toString();
        }
        $.ajax({
            type : "POST",
            url : "/process_safetydeposit.phtml?checksub=scan",
            // async : false,
            data : postData,
            success : data => {
                let error = data.includes("Error:") ? `Error: ${data.split("<b>Error: </b>")[1].split("</div>")[0]}` : "Successful";
                resolve(error);
            }
        });
    })
}