// ==UserScript==
// @name         Display Category
// @namespace    displaycategory.zero.torn
// @version      0.3
// @description  adds a display button
// @author       -zero [2669774]
// @match        https://www.torn.com/displaycase.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471771/Display%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/471771/Display%20Category.meta.js
// ==/UserScript==

const api = '';

var items = {};

var wrapper = `
<ul id="categoriesList" class="clearfix ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">

<li class="left ui-state-default ui-corner-top categoriesItemZero" data-type="all">
    <a class="all-category-icon ui-tabs-anchor" i-data="i_192_56_29_29">
    </a>
</li>

<li class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero" data-type="Primary">
    <a class="primary-category-icon ui-tabs-anchor" i-data="i_221_56_29_29">
    </a>
</li>

<li class="d-width t-width m-width left ui-state-disabled ui-corner-top ui-tabs-active ui-state-active categoriesItemZero" data-type="Secondary">
    <a class="secondary-category-icon ui-tabs-anchor" title="Secondary" i-data="i_250_56_29_29">
    </a>
</li>

<li class="t-width m-width active left ui-state-disabled ui-corner-top categoriesItemZero" data-type="Melee">
    <a class="melee-category-icon ui-tabs-anchor" data-info="Melee" title="Melee" i-data="i_279_56_29_29">
    </a>
</li>

<li data-type="Temporary" class="d-width t-width m-width left >
    <a href= categoriesItemZero" #temporary-items"="" title="Temporary">

</li>

<li data-type="Defensive" class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="armour-category-icon ui-tabs-anchor" title="Armor">
    </a>
</li>

<li data-type="Clothing" class="d-width t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="clothes-category-icon ui-tabs-anchor" title="Clothing">
    </a>
</li>

<li data-type="Medical" class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="medical-category-icon ui-tabs-anchor">
    </a>
</li>

<li data-type="Drug" class="d-width t-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="drugs-category-icon ui-tabs-anchor">
    </a>
</li>

<li data-type="Energy Drink" class="m-first t-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="energy-d-category-icon ui-tabs-anchor" data-info="Energy Drink" data-title="Energy Drink" title="Energy Drink">
    </a>
</li>

<li data-type="Alcohol" class="d-width t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="alcohol-category-icon ui-tabs-anchor">
    </a>
</li>

<li data-type="Candy" class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero" data-loaded="0">
    <a class="candy-category-icon ui-tabs-anchor" data-info="Candy" data-title="Candy" title="Candy">
    </a>
</li>

<li data-type="Booster" class="d-width m-width left ui-state-disabled ui-corner-top categoriesItemZero" data-loaded="0">
    <a class="boosters-category-icon ui-tabs-anchor">
    </a>
</li>

<li data-type="Enhancer" class="t-first m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="enhancers-category-icon ui-tabs-anchor">
    </a>
</li>

<li data-type="Supply Pack" class="d-width t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="supply-pck-category-icon ui-tabs-anchor" data-info="Supply Pack" data-title="Supply Packs" title="Supply Packs">
    </a>
</li>

<li data-type="Electronic" class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="electrical-category-icon ui-tabs-anchor" data-info="Electronic" i-data="i_598_56_29_29">
    </a>
</li>

<li data-type="Jewelry" class="d-width t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="jewelry-category-icon ui-tabs-anchor" data-info="Jewelry" data-title="Jewelry" title="Jewelry" i-data="i_627_56_29_29">
    </a>
</li>

<li data-type="Flower" class="t-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="flowers-category-icon ui-tabs-anchor" <="" a="" i-data="i_656_56_29_29">
</a></li><li data-type="Plushie" class="m-first d-width t-width left ui-state-disabled ui-corner-top categoriesItemZero"><a class="plushies-category-icon ui-tabs-anchor" i-data="i_714_56_29_29">
    </a>
</li>

<li data-type="Artifact" class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="artifacts-category-icon ui-tabs-anchor" i-data="i_743_56_29_29">
    </a>
</li>

<li data-type="Special" class="d-width t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="special-category-icon ui-tabs-anchor" i-data="i_772_56_29_29">
    </a>
</li>

<li data-type="Other" class="t-width m-width left ui-state-disabled ui-corner-top categoriesItemZero">
    <a class="miscellaneous-category-icon ui-tabs-anchor" i-data="i_801_56_29_29">
    </a>
</li>

<li data-type="Car" class="d-width t-width m-width left ui-state-disabled ui-corner-top  categoriesItemZero">
    <a class="cars-category-icon ui-tabs-anchor" data-info="Car" i-data="i_830_56_29_29">
    </a>
</li>

<li data-type="Virus" class="t-width m-width left ui-state-disabled ui-corner-top  categoriesItemZero">
    <a class="viruses-category-icon ui-tabs-anchor" <="" a="" i-data="i_859_56_29_29">
</a></li><li data-type="Book" class="t-width m-width left ui-state-disabled ui-corner-top  categoriesItemZero"><a class="books-category-icon ui-tabs-anchor" data-info="Book" <="" a="" i-data="i_888_56_29_29">
</a></li><li data-type="Collectible" class="m-width left ui-state-disabled ui-corner-top  categoriesItemZero"><a class="collectibles-category-icon ui-tabs-anchor">
    </a>
</li>

</ul>

`;

function insert() {
    if ($(".display-cabinet > li").length == 0){
        setTimeout(insert, 500);
        return;

    }

    if ($("#categoriesList").length == 0){
        $('.content-title').after(wrapper);
    }


    


    $(".display-cabinet > li").each(function () {
        if (!$(this).attr("title")){
            return;
        }
        let nameL = $(this).attr("title").split(" - ");
        let name = "";
        if (nameL.length > 0) {
            if (nameL.length > 2) {
                name = nameL.slice(0, -1).join(" - ");
            }
            else {
                name = nameL[0];
            }
        }
        if ($(`li[data-type="${items[name]}"]`).length > 0) {
            if ($(`li[data-type="${items[name]}"]`).hasClass("ui-state-disabled")) {
                $(`li[data-type="${items[name]}"]`).addClass("ui-state-default");
                $(`li[data-type="${items[name]}"]`).removeClass("ui-state-disabled");

            }

        }
    });


    $(".categoriesItemZero:not(.ui-state-disabled)").on("click", function () {
        let type = $(this).attr("data-type");
        show(type);

    });
    sort();
}

async function getItems() {
    const data = await $.getJSON(`https://api.torn.com/torn/?selections=items&key=${api}`);

    for (let index in data.items) {
        items[data.items[index].name] = data.items[index].type;
    }
    console.log(items);
    insert();

}


function sort(a,b){
    var mylist = $('.display-cabinet');
    var listitems = mylist.children('li').get();

    listitems.sort(function(a, b) {
        var stat_a = $(a).attr("title") || "";
        var stat_b = $(b).attr("title") || "";




        return stat_a.toUpperCase().localeCompare(stat_b.toUpperCase());
    })
    $.each(listitems, function(idx, itm) { mylist.append(itm); });



}



function show(type) {
    $(".display-cabinet > li").each(function () {
        if (!$(this).attr("title")){
            //  console.log($(this));
           

            return;
        }
        let nameL = $(this).attr("title").split(" - ");
        let name = "";
        if (nameL.length > 0) {
            if (nameL.length > 2) {
                name = nameL.slice(0, -1).join(" - ");
            }
            else {
                name = nameL[0];
            }
        }


        if ((items[name] && items[name] == type) || type=="all") {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });


}
getItems();

$(window).on('hashchange', function (e) {
    insert();
});
