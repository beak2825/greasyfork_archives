// ==UserScript==
// @name         Auto fake
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?*screen=place*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/417329/Auto%20fake.user.js
// @updateURL https://update.greasyfork.org/scripts/417329/Auto%20fake.meta.js
// ==/UserScript==

/* changelog
  3.4 - dodany opcjonalny delay pomiedzy atakami

*/


schedule = get_schedule();
console.log(schedule);

const html = `
<div>
    <h2>Auto fejki</h2>
    <br>
    <button class="btn" id="start_auto">ATART AUTO</button>&nbsp;&nbsp;&nbsp;
    <button class="btn" id="stop_auto">STOP AUTO</button>&nbsp;&nbsp;&nbsp;
    <button class="btn" id="setup">SETUP</button>&nbsp;&nbsp;&nbsp;
    <button class="btn" id="test">TEST SINGLE CLICK</button>
</div>
`;

const command_scheduler = `
    <div>
        Dodaj nowy atak:<br>
        <textarea id="linia_z_rozpiski" style="width:90%;" rows="4"></textarea><br>
        <button class="btn" id="add_to_schedule">Dodaj</button>
        <br>
        <hr>
        <br>
        <table class="table" style="width:100%;">
            <tr>
                <th>Czas dodania</th>
                <th>Typ</th>
                <th>Czas wyjścia</th>
                <th>Link</th>
                <th>Usuń</th>
            <tr>
            <tbody id="wiersze">
            </tbody>
        <table>
    </div>
`

const counter = `<div>`

const setup = `
    <div >
        <h1>Ustaw Fejki<input type="button" class="btn right" value="Zapisz" id="saveSetup" style="font-size:20px;"><span class="right">&nbsp;&nbsp;&nbsp;</span></h1><br>

        <h3>Ustaw czas:</h3>
        <table >
            <tr>
                <td>
                    Dzień początkowy:
                </td>
                <td>
                    <input type="number" id="startDay" value="1" style="width:100px">
                <td>
            </tr>
            <tr>
                <td>
                    Dzień końcowy:
                </td>
                <td>
                    <input type="number" id="endDay" value="31"  style="width:100px">
                <td>
            </tr>
            <tr>
                <td>
                    Godzina początkowa:
                </td>
                <td>
                    <input type="time" id="startHour"  style="width:100px">
                <td>
            </tr>
            <tr>
                <td>
                    Godzina końcowa:
                </td>
                <td>
                    <input type="time" id="endHour"  style="width:100px">
                <td>
            </tr>
        </table>

        <br><h3>Wybierz jednostki:</h3>
        <div style="width:800px"><table class="table wybor_jednostek">
        <tr>
            <th>Jednostka</th><th>Uwzględnij</th><th>Maksymalna ilość</th>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_spear.png"</img></th><td align="center"><input type="checkbox" class="spear"></td><td><input type="number" class="spear"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_sword.png"</img></th><td align="center"><input type="checkbox" class="sword"></td><td><input type="number" class="sword"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_axe.png"</img></th><td align="center"><input type="checkbox" class="axe"></td><td><input type="number" class="axe"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_archer.png"</img></th><td align="center"><input type="checkbox" class="archer"></td><td><input type="number" class="archer"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_spy.png"</img></th><td align="center"><input type="checkbox" class="spy"></td><td><input type="number" class="spy"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_light.png"</img></th><td align="center"><input type="checkbox" class="light"></td><td><input type="number" class="light"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_marcher.png"</img></th><td align="center"><input type="checkbox" class="marcher"></td><td><input type="number" class="marcher"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_heavy.png"</img></th><td align="center"><input type="checkbox" class="heavy"></td><td><input type="number" class="heavy"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_ram.png"</img></th><td align="center"><input type="checkbox" class="ram"></td><td><input type="number" class="ram"></td>
        </tr>
        <tr>
            <th align="center"><img style="margin-left:auto;margin-right:auto;display: block" src="https://dspl.innogamescdn.com/asset/a22f065/graphic/unit/unit_catapult.png"</img></th><td align="center"><input type="checkbox" class="catapult"></td><td><input type="number" class="catapult"></td>
        </tr>

        </table></div>
        <br><h3>Wypełnij wojska do maksymalnej ilości (np do burzaków): <input type="checkbox" id="fillExact"></input></h3>
        <div>
            <br>
            <h3>Nie powtarzaj ataków (zaatakowana wioska zostanie wyrzucona z puli wiosek): <input type="checkbox" id="noDuplicates"></input></h3>
        </div>
        <div>
            <br>
            <h3>Wstaw przerwe pomiedzy atakami od <input type="number" id="delayMinStart"></input> do <input type="number" id="delayMinEnd"></input> minut</h3>
        </div>
        <div>
            <br>
            <h3>Cele:</h3>
            <textarea rows="10" style="width:90%;" id="coords"></textarea>
        </div>
    </div>
`

$(document.body).on('click', "#test", () => {
    single_step()
})

$(document.body).on('click', "#saveSetup", () => {
    wybrane_jednostki = [];
    $(".wybor_jednostek input[type='checkbox']").each((index, elem) => {
        if (elem.checked === true) {
            max = $('input.' + elem.className + '[type="number"]').val()
            jednostka = elem.className
            if (max !== '' && max !== null) jednostka = elem.className + ':' + max
            wybrane_jednostki.push(jednostka)
        }
    })
    nie_wybrane_jednostki = [];
    $(".wybor_jednostek input[type='checkbox']").each((index, elem) => {
        if (elem.checked === false) {
            max = $('input.' + elem.className + '[type="number"]').val()
            jednostka = '"'+elem.className + '":99999';
            nie_wybrane_jednostki.push(jednostka)
        }
    })
    nie_wybrane_jednostki = JSON.parse("{"+nie_wybrane_jednostki.join(",")+"}")
    wybrane_jednostki = wybrane_jednostki.join(',')
    localStorage.setItem("HERMITOWSKIE_FEJKI", JSON.stringify({
        omitNightBonus: 'false',
        days: `${$("#startDay").val()}-${$("#endDay").val()}`,
        intervals: `${$("#startHour").val()}-${$("#endHour").val()}`,
        fillWith: wybrane_jednostki,
        fillExact: `${$("#fillExact")[0].checked}`,
        safeguard:nie_wybrane_jednostki
    }))
    COORDS = $("#coords").val().match(/\d{3}\|\d{3}/g)
    localStorage.setItem("COORDS", JSON.stringify(COORDS))
    localStorage.setItem("NO_DUPLICATES", $("#noDuplicates")[0].checked)
    localStorage.setItem("DELAYMINSTART",$("#delayMinStart").val())
    localStorage.setItem("DELAYMINEND",$("#delayMinEnd").val())
})

var data = {};
data.skip = localStorage.getItem('skip') + '';
data.auto = localStorage.getItem('auto') + '';
data.nRand = parseInt(2000 * (Math.random() + 1));

$(document).ready(() => {
    $("#content_value").prepend(html);
})

if (data.auto == '1') {
    console.log('auto run');
    if ($(document.body).find(".captcha").length > 0) { localStorage.setItem('auto', '0'); localStorage.setItem('skip', '0'); }
    single_step();
}

function wait(n) {
    return new Promise(resolve => setTimeout(() => resolve('done'), parseInt(n)))
}

async function single_step() {

    const slow = await wait(500);
    if (data.skip == '1') {
        localStorage.setItem('skip', '0');
        const slow = await wait(data.nRand);
        $(".arrowRight").click()
        $(".groupRight").click()
        return false;
    }
    if ($(".troop_confirm_go").length == 0) {
        noDuplicates = localStorage.getItem("NO_DUPLICATES") === 'true';
        HermitowskieFejki = JSON.parse(localStorage.getItem('HERMITOWSKIE_FEJKI'));
        coords = localStorage.getItem('COORDS');
        coords = JSON.parse(coords).join(' ');
        console.log(coords)
        if (coords == null || coords == '') {
            localStorage.setItem('auto', '0');
            localStorage.setItem('skip', '0');
            alert("Nie ma więcej wiosek do zaatakowania.");
            return false;
        }
        HermitowskieFejki.coords = coords
        var a = $.getScript('https://media.innogamescdn.com/com_DS_PL/skrypty/HermitowskieFejki.v3.js', function () {
            setTimeout(() => {
                if ($(".target-input-field").val() != '') {
                    if (noDuplicates) {
                        HermitowskieFejki.coords = HermitowskieFejki.coords.split(' ');
                        coords = $(".target-input-field").val();
                        index = HermitowskieFejki.coords.indexOf(coords);
                        if (index > -1) {
                            HermitowskieFejki.coords.splice(index, 1);
                        }
                        localStorage.setItem("COORDS", JSON.stringify(HermitowskieFejki.coords))
                    }
                    coords = $(".target-input-field").val();
                    $("#target_attack").click()
                } else {
                    $(".arrowRight").click()
                    $(".groupRight").click()
                    return false;
                }
            }, 500);
        });
    }
    if ($(".troop_confirm_go").length > 0) {
        delayMinStart = parseInt(localStorage.getItem("DELAYMINSTART"))
        delayMinEnd = parseInt(localStorage.getItem("DELAYMINEND"))
        localStorage.setItem('skip', '1')
        a = $('.troop_confirm_go').filter((i,e) => $(e).css('display') !== 'none')[0]
        const slow = await wait(data.nRand);
        //console.log(delayMinStart,delayMinEnd)
        //return
        if (delayMinStart && delayMinEnd) {
            waitingTime = getRandomTime(delayMinStart, delayMinEnd)
            $("#content_value").prepend(`<div>Czekam <span id="waitingTime">${waitingTime}</span> sekund do wyslania ataku</div>`)
            setInterval(()=>{
                waitingTime = waitingTime - 1
                $(document.body).find("#waitingTime").text(waitingTime)
                if (waitingTime < 0) {
                    a.click();
                    return false;
                }
            },1000)
        } else {
            a.click();
            return false;
        }
        
    }
}


$(document.body).on('click', '#single', () => single_step())
$(document.body).on('click', '#start_auto', () => { localStorage.setItem('auto', '1'); localStorage.setItem('skip', '0');; single_step(); })
$(document.body).on('click', '#stop_auto', () => { localStorage.setItem('auto', '0'); localStorage.setItem('skip', '0'); })
$(document.body).on('click', '#setup', () => {
    Dialog.show('setup', setup)
    HERMITOWSKIE_FEJKI = JSON.parse(localStorage.getItem("HERMITOWSKIE_FEJKI"))
    if (HERMITOWSKIE_FEJKI === null) HERMITOWSKIE_FEJKI = { days: '1-31', intervals: "08:00-22:59", fillWith: 'axe,light,spy,ram,catapult,marcher', fillExact: 'false' }
    days = HERMITOWSKIE_FEJKI.days.split("-")
    intervals = HERMITOWSKIE_FEJKI.intervals.split("-")
    if (intervals[0] === null || intervals[0] === '') intervals[0] = "08:00"
    if (intervals[1] === null || intervals[1] === '') intervals[1] = "22:59"
    wybrane_jednostki = HERMITOWSKIE_FEJKI.fillWith.split(",")
    wybrane_jednostki.forEach(element => {
        jednostka = element.split(":")
        $("input." + jednostka[0] + "[type='checkbox']")[0].checked = true
        if (jednostka.length > 1) $("input." + jednostka[0] + "[type='number']").val(jednostka[1])
    })
    $("#startDay").val(days[0])
    $("#endDay").val(days[1])
    $("#startHour").val(intervals[0])
    $("#endHour").val(intervals[1])
    $("#fillExact")[0].checked = HERMITOWSKIE_FEJKI.fillExact == "true"
    coords = JSON.parse(localStorage.getItem('COORDS'));
    if (coords !== null) coords = coords.join(' ')
    $("#coords").val(coords)
    $("#noDuplicates")[0].checked = localStorage.getItem("NO_DUPLICATES") === 'true'
    $("#delayMinStart").val(localStorage.getItem("DELAYMINSTART"))
    $("#delayMinEnd").val(localStorage.getItem("DELAYMINEND"))
})
$(document.body).on('click', '#command_scheduler', () => {
    Dialog.show('command_scheduler', command_scheduler);
    $("#popup_box_command_scheduler").css("width", "1400px");
    show_schedule();
})
$(document.body).on('click', '#add_to_schedule', () => {
    line = { time_added: new Date() };
    dane = $("#linia_z_rozpiski").val().split('\n');
    if (dane[0].search(/Wyślij fejk/)) line.typ = 'fejk';
    line.time_go = dane[1].match(/\d{2}:\d{2}:\d{2}/)[0];
    line.url = dane[2].match(/(?:(?!\]).)*/)[0].replace('[url=', '');
    schedule.push(line);
    console.log(schedule);
    set_schedule();
})



function get_schedule() {
    return localStorage.getItem('scheduled_commands') ? JSON.parse(localStorage.getItem('scheduled_commands')) : [];
}

function set_schedule() {
    localStorage.setItem('scheduled_commands', JSON.stringify(schedule));
}

function show_schedule() {
    $("#wiersze").html('');
    schedule.forEach((line, index) => {
        nowyWiersz = `<tr style="border-style: dotted;border-width: 2px;"><td>${line.time_added}</td><td>${line.typ}</td><td>${line.time_go}</td><td>${line.url}</td><td><button class="btn" style="margin-top: 5px;" forid="${index}">Usuń</button></td></tr>`;
        $("#wiersze").append(nowyWiersz);
    })
}

function getRandomTime(min, max) {
  return Math.floor((Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)) * 60);
}

