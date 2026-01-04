// ==UserScript==
// @name         Auto fishing
// @namespace    neopets
// @version      2021.02.01
// @author       jiejie
// @description  Fish with all your pets in one click
// @match        http://www.neopets.com/water/fishing.phtml
// @downloadURL https://update.greasyfork.org/scripts/420799/Auto%20fishing.user.js
// @updateURL https://update.greasyfork.org/scripts/420799/Auto%20fishing.meta.js
// ==/UserScript==

const $form = $("form[action='/water/fishing.phtml']");

$form.css({"height": "250px"}).before(`<button id="fish-all" class="button-default__2020 button-green__2020 btn-single__2020" type="button">Fish all</button>`);

$("#fish-all").on("click", async function () {

    const delay = (min, max) => Math.floor(Math.random() * max) + min;

    $(this)
    .prop("disabled", true)
    .toggleClass("button-green__2020")
    .toggleClass("button-purple__2020")
    .html(`Processing...`);

    $form.html(`
<style>
    #fish-result {
        margin: auto;
        text-align: center;
        border-collapse: collapse;
        border: 1px solid black;
    }
    #fish-result th, td {
        padding: 5px;
    }
    #fish-result tbody tr:nth-child(odd) {
        background-color : #dfdfdf;
    }
</style>
<table id="fish-result">
    <thead>
    <tr>
        <th style="width: 150px;">Pet</th>
        <th style="width: 250px">Item</th>
        <th style="width: 150px">Skill level up?</th>
    </tr>
    </thead>
    <tbody></tbody>
</table>
`);

    const refck = $("body").html().match(/"_ref_ck":'(.{32})'/)[1];

    $(this).html("Getting pet list...");
    const pets = await getPetNames();

    for (let i = 0; i < pets.length; i++) {

        $(this).html(`${pets[i]} fishing...`);
        const outcome = await goFish(pets[i]);

        $("#fish-result tbody").append(outcome);

        $(this).html(`Switching active pet...`);

        if (pets.length === 1) {
            // No need to switch pets if only one pet
            break;
        }

        if (i < pets.length - 1) {
            // Not last pet yet, switch to next pet
            await changePet(pets[i + 1]);
        } else {
            // Reached last pet, switch back to first pet
            await changePet(pets[0]);
        }

    }

    $(this)
    .html("Done!")
    .toggleClass("button-purple__2020")
    .toggleClass("button-green__2020");


    //-------------------------------------------------------------------------
    // Functions
    //-------------------------------------------------------------------------


    function getPetNames() {
        return new Promise(resolve => {
            $.ajax({
                type: "GET",
                url: "/index.phtml",
                success: data => {
                    const response = $.parseHTML(data);
                    let pets = [];
                    $(response).find(".hp-carousel-pet").each(function (index, element) {
                        const petname = $(element).attr("data-name");
                        pets.push(petname);
                    });
                    resolve(pets);
                }
            });
        });
    }

    function changePet(pet) {
        return new Promise(resolve => {
            setTimeout(() => {
                $.ajax({
                    type: "POST",
                    url: "/np-templates/ajax/changepet.php",
                    data: {
                        "_ref_ck": refck,
                        "new_active_pet": pet
                    },
                    success: data => {
                        const response = JSON.parse(data);
                        if (response["error"] === false) {
                            resolve();
                        }
                    }
                });
            }, delay(100, 500));
        })
    }

    function goFish(pet) {
        return new Promise(resolve => {
            setTimeout(() => {
                $.ajax({
                    type: "POST",
                    url: "/water/fishing.phtml",
                    data: {"go_fish": "1"},
                    success: data => {
                        const response = $.parseHTML(data);
                        const outcome = $(response).find(".page-title__2020 ~ p").text();

                        const item = outcome.match(/\.{3}(.+?)!/)[1];
                        const level = (() => {
                            let lvlup;
                            try {
                                lvlup = outcome.match(/increases to (\d+)/)[1];
                            } catch (e) {
                                lvlup = "-";
                            }
                            return lvlup;
                        })();

                        resolve(`<tr><td><b>${pet}</b></td><td>${item}</td><td>${level}</td></tr>`);
                    }
                });
            }, delay(100, 500));
        })
    }

});
