// ==UserScript==
// @name         Wyciaganie coordow z mapy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  extracts coords from map
// @author       You
// @match        https://pl157.plemiona.pl/game.php?*screen=map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426425/Wyciaganie%20coordow%20z%20mapy.user.js
// @updateURL https://update.greasyfork.org/scripts/426425/Wyciaganie%20coordow%20z%20mapy.meta.js
// ==/UserScript==

const buttons_html = `
<div>
    <h1>Coords extract</h2>
    <button class="btn" id="getfreshdata" style="margin-left:2px;margin-right:2px;">
        Get fresh data
    </button>
    <!--<button class="btn" id="checkcoords" style="margin-left:2px;margin-right:2px;">
        Check coords
    </button>-->
    <button class="btn" id="wyciagnijCordy" style="margin-left:2px;margin-right:2px;">
        Extract coords
    </button>
</div>
<hr />
`;

const check_coords_html = `
<table class="table" style="width="100%;margin:auto;">
    <tr class="table-vis"><th>Paste coords here</th><th>Exclude players</th><th>OK coords</th><th>Ally villages</th><th>Morale <80%</th><th>Incorrect coords</th><tr>
    <tr class="table-vis"><th><textarea id="coords_check_textarea" rows = "20"></textarea></th><th><textarea id="exclude_players" rows = "20"></textarea></th><th><textarea id="coords_ok_textarea" rows = "20" readonly></textarea></th><th><textarea id="coords_ally_textarea" rows = "20" readonly></textarea></th><th><textarea id="coords_lowmorale_textarea" rows = "20" readonly></textarea></th><th><textarea id="coords_badcords_textarea" rows = "20" readonly></textarea></th><tr>
</table>
`;

$("#content_value").prepend(buttons_html);

$(document.body).on('click', '#getfreshdata', () => {
    a = new Promise(resolve => $.ajax({
        url: 'https://' + game_data.world + '.plemiona.pl/map/village.txt',
        success: response => {
            villages = []
            response = response.split('\n')
            console.log(response)
            response.forEach(element => {
                if (element == '') return false;
                village = element.split(',')
                villages.push({
                    coords: village[2] + "|" + village[3],
                    player_id: village[4]
                })
            })
            resolve();
        },
        cache: false
    }));
    b = new Promise(resolve => $.ajax({
        url: 'https://' + game_data.world + '.plemiona.pl/map/tribe.txt',
        success: response => {
            players = []
            response = response.split('\n')
            response.forEach(element => {
                if (element == '') return false;
                player = element.split(',')
                players.push({
                    id: player[0],
                    name: decodeURIComponent(player[1]).replace(/\+/g, ' '),
                    tribe_id: player[2],
                    villages: parseInt(player[3]),
                    points: parseInt(player[4]),
                    rank: parseInt(player[5])
                })
            })
            console.log(players);
            resolve();
        },
        cache: false
    }));
    c = new Promise(resolve => $.ajax({
        url: 'https://' + game_data.world + '.plemiona.pl/map/ally.txt',
        success: response => {
            tribes = []
            response = response.split('\n')
            response.forEach(element => {
                if (element == '') return false;
                tribe = element.split(',')
                tribes.push({
                    id: tribe[0],
                    name: decodeURIComponent(tribe[1]).replace(/\+/g, ' '),
                    short_name: decodeURIComponent(tribe[2]).replace(/\+/g, ' '),
                    members: parseInt(tribe[3]),
                    villages: parseInt(tribe[4]),
                    points_40: parseInt(tribe[5]),
                    points_all: parseInt(tribe[6]),
                    rank: parseInt(tribe[7])
                })
            })
            console.log(tribes);
            resolve();
        },
        cache: false
    }));

    Promise.all([a, b, c]).then(val => {
        a = `559|708 560|702 561|700 561|704 561|708 562|698 562|699 562|703 562|704 562|705 562|706 562|708 563|701 564|699 564|700 564|708 565|699 565|703 565|706 565|709 566|700 566|702 567|701 567|703 567|712 568|698 568|702 568|705 568|707 568|709 569|703 569|709 569|710 570|702 570|708 570|712 571|705 572|702 572|708 572|709 572|710 573|703 573|711 574|702 574|704 574|708 574|709 574|711 558|694 558|700 558|704 558|705 558|707 561|693 562|692 562|694 562|695 562|696 562|697 563|692 563|693 566|692 568|696 568|697 570|697 571|696 560|624 560|628 560|633 560|635 561|636 561|638 562|627 562|635 562|637 562|638 563|625 563|626 563|635 563|637 563|638 564|634 564|639 565|624 565|628 565|633 565|634 565|636 566|626 566|632 566|633 566|639 567|627 567|629 567|631 567|633 567|636 567|638 567|639 568|631 569|627 569|629 569|630 569|635 570|624 570|627 570|628 570|631 570|635 570|637 570|638 571|627 571|629 571|632 571|635 571|636 571|637 572|633 572|636 572|637 573|629 573|630 573|631 537|601 538|605 539|601 539|602 540|601 540|602 541|600 541|602 542|600 542|601 543|601 543|602 543|606 543|607 544|600 544|603 545|600 551|594 551|595 551|596 551|597 552|597 553|595 554|595 554|596 554|599 555|594 555|597 555|598 555|599 556|594 556|595 556|596 556|597 556|598 556|600 557|594 557|598 557|601 558|594 558|601 558|605 559|598 559|600 559|601 559|608 560|595 560|597 560|600 560|602 560|606 561|595 561|596 561|597 561|600 561|601 561|603 561|604 562|596 562|600 562|601 562|603 562|604 562|605 562|609 563|596 563|597 563|598 563|599 564|598 564|599 565|594 565|596 565|600 565|607 537|556 537|560 537|561 537|564 537|565 537|567 537|569 538|555 538|556 538|559 538|560 538|563 538|567 538|568 539|554 539|556 539|558 539|559 539|561 540|557 540|563 540|565 540|566 541|563 541|568 542|559 542|560 542|561 542|563 542|569 543|559 543|560 543|561 543|564 543|566 544|554 544|557 544|559 544|564 544|568 544|569 545|557 545|560 545|566 545|567 546|554 546|555 546|557 546|564 546|565 546|568 547|556 547|557 547|561 547|562 547|566 547|567 548|554 548|558 548|559 548|561 548|568 549|562 549|564 549|565 549|569 550|560 550|562 550|563 550|564 550|567 551|556 551|559 551|566 551|567 551|569 552|559 552|562 552|566 552|569 510|527 511|526 511|527 511|529 512|527 512|529 512|531 513|527 513|528 514|525 515|525 515|527 515|528 515|530 515|533 516|523 516|525 517|524 517|528 517|533 518|528 518|532 519|523 519|524 520|521 520|524 520|533 520|535 520|536 521|522 521|524 521|532 521|534 522|521 522|524 522|525 522|526 522|528 522|530 522|533 522|535 523|526 523|529 523|532 523|533 524|522 524|526 524|530 524|534 525|521 525|523 525|527 512|500 513|499 513|509 515|501 516|501 516|505 516|506 517|499 517|503 518|499 518|500 518|502 518|503 518|504 519|499 519|500 519|505 520|499 520|500 520|502 520|503 520|504 521|499 521|509 521|511 521|514 522|505 522|510 522|511 522|513 523|499 523|507 523|509 523|510 523|512 524|499 524|503 524|504 524|509 524|514 525|509 525|512 495|496 496|491 496|497 497|498 500|490 501|491 503|491 504|496 505|490 505|491 505|492 506|491 507|490 508|497 509|490 509|492 510|490 510|491 510|493 517|497 518|494 518|498 519|495 519|498 520|495 520|498 521|495 522|495 523|495 523|496 524|494 524|496 525|493 525|495 525|496 526|494 526|497 527|497 528|493 528|496 529|493 529|499 530|499 532|493 536|494 536|495 537|495 541|494 541|495 542|494 542|495 543|497 544|495 545|494 545|495 545|496 547|494 548|495 548|500 548|503 549|495 549|497 549|499 549|500 550|496 550|498 550|500 551|496 551|497 551|498 551|502 551|503 552|501 552|502 552|509 553|495 553|498 553|499 553|500 553|502 553|507 554|496 554|502 555|497 555|500 556|495 556|501 556|502 556|505 556|507 557|497 557|500 557|507 558|496 558|498 558|499 558|500 558|501 558|504 559|495 559|496 559|497 559|498 559|501 559|509 560|497 560|500 560|507 561|497 561|498 561|499 561|500 561|506 561|509 562|500 562|501 562|507 562|508 563|495 563|499 563|503 563|505 563|506 564|496 564|497 564|500 564|504 564|509 564|510 565|495 565|499 565|500 565|501 565|504 565|510 566|495 566|497 566|498 566|499 566|505 566|508 566|509 567|506 564|511 566|514 566|515 567|515 567|521 568|509 568|511 568|517 569|508 569|509 569|510 569|516 569|519 569|520 570|507 570|509 570|513 570|514 571|514 571|515 572|511 572|512 572|514 572|516 572|519 572|520 573|510 573|521 574|506 574|508 574|510 574|511 574|520 575|507 576|509 576|511 576|516 576|521 577|506 577|511 577|518 556|519 556|521 556|531 556|534 558|521 558|525 558|527 559|520 559|524 559|525 559|528 559|529 560|523 560|524 560|533 561|524 561|527 561|533 562|526 562|527 562|531 563|524 564|523 565|525 565|526 566|524 567|526 567|531 567|532 567|533 567|534 568|524 568|532 569|524 569|530 570|522 570|523 570|526 570|530 570|532 570|533 570|534 571|527 571|529 571|530 571|533 571|534 552|542 553|538 554|532 554|537 554|538 554|542 554|543 554|544 555|530 555|531 555|538 555|542 555|544 555|545 556|538 556|541 556|542 557|538 557|542 557|543 558|538 558|543 559|539 559|540 559|541 560|537 560|538 560|543 561|536 561|539 561|541 561|543 562|536 562|540 562|541 562|544 563|536 563|537 563|539 543|553 544|552 545|551 545|553 547|551 548|550 549|549 549|552 551|550 551|553 552|550 552|552 552|553 553|547 554|546 555|546 555|550 593|552 593|553 593|556 593|559 593|563 593|564 593|566 593|567 594|566 595|558 595|559 595|564 595|566 595|567 596|557 596|558 596|559 596|562 596|563 596|567 597|555 597|559 597|560 597|561 597|562 597|563 597|564 598|561 598|562 599|552 599|555 599|556 599|566 599|567 600|554 600|567 601|554 601|555 602|552 602|553 602|561 603|553 603|554 604|554 604|557 604|558 605|557 605|558 607|558 608|553 608|555 564|535 564|536 565|536 566|535 566|536 570|535 572|526 572|528 572|529 572|531 572|532 572|533 572|535 573|523 573|525 573|527 573|528 573|531 573|532 573|533 574|523 574|524 574|526 574|530 574|531 574|532`
        c = [];
        b = a.split(' ').forEach(element => {
            sv = villages.find(village => village.coords == element)
            pl = players.find(player => player.id == sv.player_id)
            if (typeof (pl) !== 'undefined') if (pl.points > 740000) c.push(element)
        })
        console.log(c.join(' '))
        UI.SuccessMessage('Pobrano najnowsze pliki!')
    });
})

$(document.body).on('click', '#checkcoords', () => {
    if (typeof (villages) == 'undefined') {
        UI.ErrorMessage('Pobierz pliki.');
        return false;
    }
    Dialog.show('check_coords', check_coords_html);
    $("#popup_box_check_coords").css('width', '1200px');
});



$(document.body).on('click', '#wyciagnijCordy', () => {
    if (typeof (villages) == 'undefined') {
        UI.ErrorMessage('Pobierz pliki.');
        return false;
    }
    wrogowie = []
    Object.keys(TWMap.allyRelations).forEach(a => {
        if (TWMap.allyRelations[a] === 'enemy') wrogowie.push(a)
    })
    wyciagnijCordyHtml = `
    <div id="popup_box_check_coords">
        X start<br><input id="xStart" value="550"><br>
        X koniec<br><input id="xEnd" value="560"><br>
        Y start<br><input id="yStart" value="560"><br>
        Y koniec<br><input id="yEnd" value="580"><br>
    </div>
    <br><br>
    <div>Wrogowie:<br>${listEnemies()}</div>
    <br>
    <button id="aktualizuj">Szukaj</button><br>
    <textarea style="width:95%" id="coords" rows="20"></textarea>
    `;
    Dialog.show('check_coords', wyciagnijCordyHtml);
    $("#popup_box_check_coords").css('width', '1200px');
});

function listEnemies() {
    a=''
    wrogowie.forEach(wrog=>{
        szukana = tribes.find(tribe=>tribe.id === wrog)
        if (typeof szukana !== 'undefined')
        a += tribes.find(tribe=>tribe.id === wrog).name+'<br>'
    })
    return a;
}

function extractCoords() {
    villages_extended = villages.map(a=>{
        coords = a.coords.split("|")
        return {
            coords:a.coords,
            X: parseInt(coords[0]),
            Y: parseInt(coords[1])
        }
    })
    minX = parseInt($("#xStart").val())
    maxX = parseInt($("#xEnd").val())
    minY = parseInt($("#yStart").val())
    maxY = parseInt($("#yEnd").val())
    searchedVillages = villages_extended.filter(a=>a.X >= minX && a.X <= maxX && a.Y >= minY && a.Y <= maxY).map(a=>a.coords)
    $("#coords").val(searchedVillages.join(" "))
}

$(document.body).on('click',"#aktualizuj",()=>{
    extractCoords()
})


$(document.body).on('change keyup', '#coords_check_textarea', () => {
    ok_coords = [];
    ally_villages = [];
    bad_morale = [];
    incorrect_coords = [];
    exclude_players = $('#exclude_players').val().split('\n')
    coords = $('#coords_check_textarea').val().split(/[ ,\n]+/);
    coords.forEach(element => {
        v = villages.find(village => village.coords == element);
        if (typeof (v) == 'undefined') {
            incorrect_coords.push(element);
            return false;
        } else {
            p = players.find(player => player.id == v.player_id)
            if (typeof (p) == 'undefined') {
                ok_coords.push(element);
                return false;
            } else {
                e = exclude_players.find(player => player == p.name)
                if (typeof (e) != 'undefined') return false;
                if (TWMap['allyRelations'][p.tribe_id] == 'partner') {
                    ally_villages.push(element);
                    return false;
                }
                console.log()
                if ((parseFloat(p.points) / parseFloat(game_data.player.points)) * 3 + 0.3 < 0.8) {
                    bad_morale.push(element);
                    return false;
                }

                ok_coords.push(element);
            }

        }
    });
    $("#coords_ok_textarea").val(ok_coords.join(' '));
    $("#coords_ally_textarea").val(ally_villages.join(' '));
    $("#coords_lowmorale_textarea").val(bad_morale.join(' '));
    $("#coords_badcords_textarea").val(incorrect_coords.join(' '));
})

$(document.body).on('change keyup', '#exclude_players', () => $("#coords_check_textarea").trigger('keyup'))