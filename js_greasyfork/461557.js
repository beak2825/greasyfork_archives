// ==UserScript==
// @name        FAbolous
// @version     1.3.5
// @description FAbolouss
// @author      ScriptAdam
// @namespace   ScriptAdam
// @license     MIT
// @include     https://*/game.php?*screen=am_farm*
// @icon        https://img.icons8.com/cotton/64/000000/pacman.png
// @downloadURL https://update.greasyfork.org/scripts/461557/FAbolous.user.js
// @updateURL https://update.greasyfork.org/scripts/461557/FAbolous.meta.js
// ==/UserScript==

const timer = (ms) => new Promise((res) => setTimeout(res, ms))

let cool = true
loadPages()
reworkUi()
prepMenu()
enableKeys()

function loadPages() {
    let numberOfPages = $(".paged-nav-item").length / 2
    for (let i = 1; i < numberOfPages; i++) {
        $.ajax({
            url: document.URL + "&order=distance&dir=asc&Farm_page=" + i,
            success: function (data) {
                $(data).find("#plunder_list tr:gt(1)").appendTo("#plunder_list")
            },
            async: false,
        })
    }
}

function reworkUi() {
    document
        .querySelectorAll("#plunder_list_nav")
        .forEach((nav) => nav.remove())
}

function prepMenu() {
    let menu = `
	<div class="server_info" style="cursor: progress; font-size: 13px; width: 50%; margin: auto; display: flex;
    justify-content: space-evenly;">
		<a class="vis" id="farm">Farm</a>
		<span >|</span>
    <b><i class="vis" style="font-size: 10px;" id="count"></i></b>
    <span >|</span>
		<a class="vis" id="ram">Wall</a>
	</div>
	`
    document
        .getElementById("content_value")
        .insertAdjacentHTML("afterbegin", menu)

    document.getElementById("count").innerText = $(
        "#plunder_list tr:gt(1)"
    ).length
    document.getElementById("farm").addEventListener("click", farm)
    document.getElementById("ram").addEventListener("click", getWalls)
}

// barb.cells[1] -> green || yellow || red || blue
// barb.cells[2] -> loot/0 || loot/1
// barb.cells[6] -> wall info
// barb.cells[7] -> distance
// A <- 8 | B <- 9 | C <- 10
// document.getElementById("light").innerText < 4
async function farm() {
    document.getElementById("farm").removeEventListener("click", farm)
    document.getElementById("farm").innerText = "Plundering barbarians!"
    let barbs = $("#plunder_list tr:gt(1)")
    for (const barb of barbs) {
        if (
            (barb.cells[1].innerHTML.includes("green") ||
                barb.cells[1].innerHTML.includes("blue")) &&
            (barb.cells[6].innerText == 0 || barb.cells[6].innerText == "?") &&
            document.getElementById("light").innerText > 3 && barb.cells[7].innerText <= 24
        ) {
            if (barb.cells[2].innerHTML.includes("loot/0")) {
                barb.cells[8].firstElementChild.click()
            } else {
                barb.cells[9].firstElementChild.click()
            }
            document.getElementById("count").innerText--
            await timer(199)
        }
    }
    changeVillage()
}

function enableKeys() {
    let barbs = $("#plunder_list tr:gt(1)")
    let i = 0
    window.onkeypress = (e) => {
        // q: 113, e: 101, a: 97, d: 100, s: 115, z: 122, x: 120, c: 99, v: 118
        if (cool) {
            switch (e.keyCode) {
                case 97: // a
                    document.getElementById("village_switch_left").click()
                    break
                case 100: // d
                    document.getElementById("village_switch_right").click()
                    break
                case 113: // q
                    document.getElementById("farm").click()
                    break
                case 101: // e
                    document.getElementById("ram").click()
                    break
                case 122: // z
                    barbs[i++].cells[8].firstElementChild.click()
                    break
                case 120: // x
                    barbs[i++].cells[9].firstElementChild.click()
                    break
                case 99: // c
                    barbs[i++].cells[10].firstElementChild.click()
                    break
                case 115: // s
                    barbs[i++].cells[7].innerText = "-"
                    break
            }
            cooldown(199)
        }
    }
}

function cooldown(ms) {
    document.getElementById("count").innerText--
    cool = false
    setTimeout(function () {
        cool = true
    }, ms)
}

async function changeVillage() {
    document.getElementById("farm").innerText = "Next?"
    document.getElementById("farm").addEventListener("click", () => {
        document.getElementById("village_switch_right").click()
    })
    await timer(1000)
    if (localStorage.fauto == 1) document.getElementById("farm").click()
}

function getWalls() {
    let barbs = $("#plunder_list tr:gt(1)")
    for (const barb of barbs) {
        if (
            (barb.cells[1].innerHTML.includes("green") ||
                barb.cells[1].innerHTML.includes("blue")) &&
            (barb.cells[6].innerText == 0 || barb.cells[6].innerText == "?")
        )
            barb.remove()
    }
    document.getElementById("ram").removeEventListener("click", getWalls)
    document.getElementById("ram").innerText = "Ram them down!"
    document.getElementById("ram").addEventListener("click", clearWalls)
}

async function clearWalls() {
    let barbs = $("#plunder_list tr:gt(1)")
    for (const barb of barbs) {
        barb.cells[11].firstElementChild.click()
        await timer(500)
        switch (barb.cells[6].innerText) {
            case "1":
                document
                    .getElementsByClassName("troop_template_selector")[1]
                    .click()
                break
            case "2":
                document
                    .getElementsByClassName("troop_template_selector")[2]
                    .click()
                break
            case "3":
                document
                    .getElementsByClassName("troop_template_selector")[3]
                    .click()
                break
            case "4":
                document
                    .getElementsByClassName("troop_template_selector")[4]
                    .click()
                break
            default:
                document
                    .getElementsByClassName("troop_template_selector")[2]
                    .click()
        }
        await timer(500)
        document.getElementById("target_attack").click()
        await timer(1000)
        document.getElementById("troop_confirm_submit").click()
        await timer(500)
    }
}
