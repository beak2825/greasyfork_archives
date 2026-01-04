// ==UserScript==
// @name         ScrollMacro Sploop.io v2
// @namespace    none
// @version      2
// @description  With this script, you can quickly scroll through the store with caps! When you click on the buttons, the store will automatically open and scroll the ScrollBar to the desired header ! Keys: B-BerserkerGear, C-BoostHat, T-CrystalGear, V-ImmunityGear.
// @author       00100110#6361
// @match        *://sploop.io/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/432965/ScrollMacro%20Sploopio%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/432965/ScrollMacro%20Sploopio%20v2.meta.js
// ==/UserScript==
(() => {
    'use strict'

    let sleep = (ms) => new Promise(resolve => { setTimeout(() => resolve(), ms) })

    let first_title_mode = true,
        last_title_mode = false,
        oldDate = Date.now()

    // Set Event KeyDown...
    document.addEventListener('keydown', (event) => {
        // Open Bind_Key_Menu...
        if (event.code === "Escape") {
            if ($('#bind-key-menu').css('display') == 'none') $('#bind-key-menu').animate({top: 'show'}, 100)
            else $('#bind-key-menu').animate({top: 'hide'}, 100)
        }
    })

    // Create Bind_Key_Menu...
    const html_MenuCode = `
<div id="bind-key-menu">
    <div id="block-bind">
        <Text>Crystral: <input type="text" id="crystalBind" onKeyPress=SupressInput(event); oncontextmenu="return false" style="width: 75px;" value="KeyT" class="inputTxt"></Text>
        <br>
        <Text>Berserker: <input type="text" id="berserkerBind" onKeyPress=SupressInput(event); oncontextmenu="return false" style="width: 75px;" value="KeyB" class="inputTxt"></Text>
        <br>
        <Text>Boost: <input type="text" id="boostBind" onKeyPress=SupressInput(event); oncontextmenu="return false" style="width: 75px;" value="KeyC" class="inputTxt"></Text>
        <br>
        <Text>Immunity: <input type="text" id="immunityBind" onKeyPress=SupressInput(event); oncontextmenu="return false" style="width: 75px;" value="KeyV" class="inputTxt"></Text>
    </div>
</div>
<style>
    Text {
        font-size: 22px;
        color: #fff;
        text-shadow: rgb(20 20 20) 4px 0px 0px, rgb(20 20 20) 3.87565px 0.989616px 0px, rgb(20 20 20) 3.51033px 1.9177px 0px, rgb(20 20 20) 2.92676px 2.72656px 0px, rgb(20 20 20) 2.16121px 3.36588px 0px, rgb(20 20 20) 1.26129px 3.79594px 0px, rgb(20 20 20) 0.282949px 3.98998px 0px, rgb(20 20 20) -0.712984px 3.93594px 0px, rgb(20 20 20) -1.66459px 3.63719px 0px, rgb(20 20 20) -2.51269px 3.11229px 0px, rgb(20 20 20) -3.20457px 2.39389px 0px, rgb(20 20 20) -3.69721px 1.52664px 0px, rgb(20 20 20) -3.95997px 0.56448px 0px, rgb(20 20 20) -3.97652px -0.432781px 0px, rgb(20 20 20) -3.74583px -1.40313px 0px, rgb(20 20 20) -3.28224px -2.28625px 0px, rgb(20 20 20) -2.61457px -3.02721px 0px, rgb(20 20 20) -1.78435px -3.57996px 0px, rgb(20 20 20) -0.843183px -3.91012px 0px, rgb(20 20 20) 0.150409px -3.99717px 0px, rgb(20 20 20) 1.13465px -3.8357px 0px, rgb(20 20 20) 2.04834px -3.43574px 0px, rgb(20 20 20) 2.83468px -2.82216px 0px, rgb(20 20 20) 3.44477px -2.03312px 0px, rgb(20 20 20) 3.84068px -1.11766px 0px, rgb(20 20 20) 3.9978px -0.132717px 0px;
    }

    #block-bind {
        width: 100%;
        height: auto;
        padding: 8px;
        background: rgba(0, 0, 0, 0.25);
        box-shadow: inset 0 5px 0 rgb(20 20 20 / 40%);
        border-radius: 15px;
        border: 5px solid #141414;
    }

    #bind-key-menu {
        text-align: left;
        padding: 20px;
        padding-top: 50px;
        position: absolute;
        display: none;
        background: rgba(0, 0, 0, 0.25);
        bottom: 35%;
        left: 39.9%;
        border-radius: 15px;
        width: 325px;
        height: 250px;
        border: 5px solid #141414;
        box-shadow: inset 0 4px 0 #4e5645, inset 0 -4px 0 #384825, 0px 2px 0 5px rgb(20 20 20 / 30%), 0px 0px 0 15px rgb(20 20 20 / 10%);
    }

    .inputTxt {
        text-shadow: rgb(20 20 20) 4px 0px 0px, rgb(20 20 20) 3.87565px 0.989616px 0px, rgb(20 20 20) 3.51033px 1.9177px 0px, rgb(20 20 20) 2.92676px 2.72656px 0px, rgb(20 20 20) 2.16121px 3.36588px 0px, rgb(20 20 20) 1.26129px 3.79594px 0px, rgb(20 20 20) 0.282949px 3.98998px 0px, rgb(20 20 20) -0.712984px 3.93594px 0px, rgb(20 20 20) -1.66459px 3.63719px 0px, rgb(20 20 20) -2.51269px 3.11229px 0px, rgb(20 20 20) -3.20457px 2.39389px 0px, rgb(20 20 20) -3.69721px 1.52664px 0px, rgb(20 20 20) -3.95997px 0.56448px 0px, rgb(20 20 20) -3.97652px -0.432781px 0px, rgb(20 20 20) -3.74583px -1.40313px 0px, rgb(20 20 20) -3.28224px -2.28625px 0px, rgb(20 20 20) -2.61457px -3.02721px 0px, rgb(20 20 20) -1.78435px -3.57996px 0px, rgb(20 20 20) -0.843183px -3.91012px 0px, rgb(20 20 20) 0.150409px -3.99717px 0px, rgb(20 20 20) 1.13465px -3.8357px 0px, rgb(20 20 20) 2.04834px -3.43574px 0px, rgb(20 20 20) 2.83468px -2.82216px 0px, rgb(20 20 20) 3.44477px -2.03312px 0px, rgb(20 20 20) 3.84068px -1.11766px 0px, rgb(20 20 20) 3.9978px -0.132717px 0px;
        cursor: text;
        color: #fff;
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        text-align: center;
        outline: 0;
        display: inline-block;
        border: none;
        border: 5px solid rgba(0, 0, 0, 0);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        transition: all 1s;
    }
</style>
<script>
    function SupressInput($event) {
        $event.preventDefault();
    }
    let use = false,
        codeKey, use2 = false,
        codeKey2, use3 = false,
        codeKey3, use4 = false,
        codeKey4
    document.getElementById("boostBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#boostBind").val("Select")
            use = true
        }
        if (e.button == 2) {
            $("#boostBind").val("...")
            use = false
        }
    })
    document.getElementById("boostBind").addEventListener('keydown', e => {
        if ($("#boostBind").focus()) {
            if (use) {
                use = false
                codeKey = (e.code).toString()
                $("#boostBind").val(codeKey)
            }
        }
    })
    document.getElementById("immunityBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#immunityBind").val("Select")
            use2 = true
        }
        if (e.button == 2) {
            $("#immunityBind").val("...")
            use2 = false
        }
    })
    document.getElementById("immunityBind").addEventListener('keydown', e => {
        if ($("#immunityBind").focus()) {
            if (use2) {
                use2 = false
                codeKey2 = (e.code).toString()
                $("#immunityBind").val(codeKey2)
            }
        }
    })
    document.getElementById("berserkerBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#berserkerBind").val("Select")
            use3 = true
        }
        if (e.button == 2) {
            $("#berserkerBind").val("...")
            use3 = false
        }
    })
    document.getElementById("berserkerBind").addEventListener('keydown', e => {
        if ($("#berserkerBind").focus()) {
            if (use3) {
                use3 = false
                codeKey3 = (e.code).toString()
                $("#berserkerBind").val(codeKey3)
            }
        }
    })
    document.getElementById("crystalBind").addEventListener("mousedown", e => {
        if (e.button == 0) {
            $("#crystalBind").val("Select")
            use4 = true
        }
        if (e.button == 2) {
            $("#crystalBind").val("...")
            use4 = false
        }
    })
    document.getElementById("crystalBind").addEventListener('keydown', e => {
        if ($("#crystalBind").focus()) {
            if (use4) {
                use4 = false
                codeKey4 = (e.code).toString()
                $("#crystalBind").val(codeKey4)
            }
        }
    })
</script>
`

    // Add Menu In HTML Body...
    $("body").append(html_MenuCode)

    // Get Element Hat Store...
    let getElement = [document.getElementById("hat-menu"), document.getElementById("hat_menu_content")]

    // Set Event KeyDown...
    document.addEventListener('keydown', (event) => ScrollKeys(event))

    // Create Reaction Event Click...
    let ScrollKeys = (event) => {

        // If the elements are visible...
        if ($('.chat-container').css('display') == "block" ||
            $('#clan-menu').css('display') == "block" ||
            $('#bind-key-menu').css('display') == "block") return null

        // Keys Equip hats...
        switch (event.code) {
                // Crystral Gear...
            case $("#crystalBind").val():
                getElement[0].style.display = "flex"
                getElement[1].scrollTo(0, 75)
                break

                // Berserker Gear...
            case $("#berserkerBind").val():
                getElement[0].style.display = "flex"
                getElement[1].scrollTo(0, 0)
                break

                // Boost Hat...
            case $("#boostBind").val():
                getElement[0].style.display = "flex"
                getElement[1].scrollTo(0, 220)
                break

                // Immunity Gear...
            case $("#immunityBind").val():
                getElement[0].style.display = "flex"
                getElement[1].scrollTo(0, 185)
                break
        }
    }

    // Duble Click Event...
    getElement[0].addEventListener('dblclick', function (e) {
        getElement[0].style.display = "none"
    })

    // Change Title Name...
    let change_Title = (first = 500, second = 1000, third = 1500, fourth = 1950, time = 2000) => {
        if (Date.now() - oldDate >= time) {
            if (first_title_mode) {
                sleep(first).then(function() {
                    document.title = "Scr________."
                })
                sleep(second).then(function() {
                    document.title = "Scroll_____.."
                })
                sleep(third).then(function() {
                    document.title = "ScrollMac__..."
                })
                sleep(fourth).then(function() {
                    document.title = "ScrollMacro...."
                    first_title_mode = false
                    last_title_mode = true
                })
            } else if (last_title_mode) {
                sleep(first).then(function() {
                    document.title = "ScrollMacro."
                })
                sleep(second).then(function() {
                    document.title = "ScrollMacro.."
                })
                sleep(third).then(function() {
                    document.title = "ScrollMacro..."
                })
            }
            oldDate = Date.now()
        }
    }
    window.onload = function() {
        setInterval(change_Title, 0.1)
    }
})()