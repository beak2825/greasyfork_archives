// ==UserScript==
// @name              ASI and Routine in representation
// @version 	      1.2.2024051303
// @description       Adds age, routine and Asi to the players of the National teams
// @author            Andrizz aka Banana aka Jimmy il Fenomeno (team ID = 3257254) in collaboration with wojtekkl (team ID = 1355208)
// @namespace         http://trophymanager.com
// @include           *trophymanager.com/national-teams/*
// @exclude           *trophymanager.com/national-teams/*/squad/*
// 
// @grant			  none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/373829/ASI%20and%20Routine%20in%20representation.user.js
// @updateURL https://update.greasyfork.org/scripts/373829/ASI%20and%20Routine%20in%20representation.meta.js
// ==/UserScript==

addASItoTable();

function addASItoTable() {
    $(".column2_a").width("450px"); // shorten central box
    $(".column3_a").width("326px"); // enlarge right box
    const tableHeaders = '<tr><td class="align_center player_no"><b>No.</b></td><td><b>姓名</b></td><td class="align_center"><b>位置</b></td><td class="align_center"><b>年龄</b></td><td class="align_center"><b>经验</b></td><td class="align_center"><b>SI</b></td></tr>';
    $(".column3_a .zebra tbody:first-of-type").prepend(tableHeaders);
    let tableRow = $('.column3_a .zebra tr:not(:first-of-type)'); // get each row
    $(tableRow).each(function(index) {
        let playerID = $(this).find('a').attr('player_link');
        $(this).append('<td align="center"; class="AGE"></td>'); // create the new columns
        $(this).append('<td align="center"; class="ROU"></td>');
        $(this).append('<td align="right"; class="ASI"></td>');
        var NewName = $(this).find("td:eq(1)").find("a"); // get each player's name
        $.post("/ajax/tooltip.ajax.php",{async:false,"player_id":playerID},function(data){ // get each player's info
            var data = JSON.parse(data);
            let Age = data.player.age;
            let Months = data.player.months;
            let ROUvalue = data.player.routine;
            let ASIvalue = data.player.skill_index;
            $('.column3_a .zebra tr:nth-of-type('+ (index+2) + ') .AGE').html(Age+"."+Months); // add new infos to the corresponding columns
            $('.column3_a .zebra tr:nth-of-type('+ (index+2) + ') .ROU').html(ROUvalue);
            $('.column3_a .zebra tr:nth-of-type('+ (index+2) + ') .ASI').html(ASIvalue);});
        });
}