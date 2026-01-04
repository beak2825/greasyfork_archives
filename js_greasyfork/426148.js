// ==UserScript==
// @name         Rozsylacz rozpiski
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Wykorzystaj czas na coś ciekawego a nie rozsyłanie rozpisek Tymoteusza
// @author       You
// @match        https://*.plemiona.pl/*screen=memo*
// @match        https://*.plemiona.pl/*attackType=*
// @match        https://*.plemiona.pl/*try=confirm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426148/Rozsylacz%20rozpiski.user.js
// @updateURL https://update.greasyfork.org/scripts/426148/Rozsylacz%20rozpiski.meta.js
// ==/UserScript==

if (window.location.href.includes("attackType")) {
    fakeMin = Math.ceil(game_data.village.points * 0.01)
    catapultDestroy = parseInt(window.location.href.match(/cataputsDestroy\=\d{1,4}/)[0].replace("cataputsDestroy=",""))
    spear = parseInt($("#units_entry_all_spear").text().trim().replace("(","").replace(")",""))
    sword = parseInt($("#units_entry_all_sword").text().trim().replace("(","").replace(")",""))
    axe = parseInt($("#units_entry_all_axe").text().trim().replace("(","").replace(")",""))
    archer = parseInt($("#units_entry_all_archer").text().trim().replace("(","").replace(")",""))
    spy = parseInt($("#units_entry_all_spy").text().trim().replace("(","").replace(")",""))
    light = parseInt($("#units_entry_all_light").text().trim().replace("(","").replace(")",""))
    marcher = parseInt($("#units_entry_all_marcher").text().trim().replace("(","").replace(")",""))
    heavy = parseInt($("#units_entry_all_heavy").text().trim().replace("(","").replace(")",""))
    ram = parseInt($("#units_entry_all_ram").text().trim().replace("(","").replace(")",""))
    catapult = parseInt($("#units_entry_all_catapult").text().trim().replace("(","").replace(")",""))
    knight = parseInt($("#units_entry_all_knight").text().trim().replace("(","").replace(")",""))

    if (window.location.href.includes("attackType=burzak")) {
        fakeMin = 200
        spearFake = 0;
        swordFake = 0;
        axeFake = 0;
        archerFake = 0;
        spyFake = 0;
        lightFake = 0;
        marcherFake = 0;
        heavyFake = 0;
        ramFake = 0;
        catapultFake = 0;
        catapultDestroy = catapultDestroy > catapult ? catapult : catapultDestroy;
        catapultDestroy = catapultDestroy > 4 ? catapultDestroy - 4 : 0;
        catapultFake = catapultDestroy;
        if (catapultFake === 0) return false;
        while (fakeMin > 0 && light > 0) {
            lightFake = lightFake + 1;
            light = light - 1;
            fakeMin = fakeMin - 4;
        }
        while (fakeMin > 0 && axe > 0) {
            axeFake = axeFake + 1;
            axe = axe - 1;
            fakeMin = fakeMin - 1;
        }
        while (fakeMin > 0 && marcher > 0) {
            marcherFake = marcherFake + 1;
            marcher = marcher - 1;
            fakeMin = fakeMin - 5;
        }
        while (fakeMin > 0 && heavy > 0) {
            heavyFake = heavyFake + 1;
            heavy = heavy - 1;
            fakeMin = fakeMin - 6;
        }
        if (fakeMin > 0) return false;
        $("#unit_input_spear").val(spearFake);
        $("#unit_input_sword").val(swordFake);
        $("#unit_input_axe").val(axeFake);
        $("#unit_input_archer").val(archerFake);
        $("#unit_input_spy").val(spyFake);
        $("#unit_input_light").val(lightFake);
        $("#unit_input_marcher").val(marcherFake);
        $("#unit_input_heavy").val(heavyFake);
        $("#unit_input_ram").val(ramFake);
        $("#unit_input_catapult").val(catapultFake);

        setTimeout(()=>{$("#target_attack").trigger("click");return false;},500)
    }

    if (window.location.href.includes("attackType=off")) {
        light = light < 100 ? 0 : light - 100;
        ram = ram < 4 ? 0 : ram - 4;
        catapult = catapult < 4 ? 0 : catapult - 4;
        catapult = catapult > 96 ? 96 : catapult;
        spy = spy > 5 ? 5 : spy;
        $("#unit_input_axe").val(axe);
        $("#unit_input_light").val(light);
        $("#unit_input_marcher").val(marcher);
        $("#unit_input_ram").val(ram);
        $("#unit_input_catapult").val(catapult);
        $("#unit_input_spy").val(spy);
        $("#unit_input_knight").val(knight)
        if (ram > 5) setTimeout(()=>{$("#target_attack").trigger("click");return false;},500)
    }

    if (window.location.href.includes("attackType=burzak-zagroda") || window.location.href.includes("attackType=burzak-kuznia")) {
        light = light < 4 ? 0 : light - 4;
        //ram = ram < 4 ? 0 : ram - 4;
        catapult = catapult < 4 ? 0 : catapult - 4;
        spy = spy > 5 ? 5 : spy;
        $("#unit_input_light").val(light);
        $("#unit_input_catapult").val(catapult);
        $("#unit_input_spy").val(spy);
        if (catapult > 13) setTimeout(()=>{$("#target_attack").trigger("click");return false;},500)
    }

    if (window.location.href.includes("attackType=Ofoburzak")) {
        light = light < 100 ? 0 : light - 100;
        ram = ram < 4 ? 0 : ram - 4;
        catapult = catapult < 4 ? 0 : catapult - 4;
        //catapult = catapult > 46 ? 46 : catapult;
        spy = spy > 5 ? 5 : spy;
        $("#unit_input_axe").val(axe);
        $("#unit_input_light").val(light);
        $("#unit_input_marcher").val(marcher);
        $("#unit_input_ram").val(ram);
        $("#unit_input_catapult").val(catapult);
        $("#unit_input_spy").val(spy);
        if (ram > 5) setTimeout(()=>{$("#target_attack").trigger("click");return false;},500)
    }

    if (window.location.href.includes("attackType=szlachcic")) {
        light = light < 100 ? 0 : light - 100;
        szlachcice = parseInt(window.location.href.match(/szlachcice\=\d/)[0].replace('szlachcice=',''))
        miejscaOffWZagrodzie = axe + light*4 + marcher*5;
        proporcje = catapultDestroy / miejscaOffWZagrodzie;
        proporcje = proporcje > 1 ? 0.25 : proporcje;
        $("#content_value").prepend(`<div>
                                       ile ofa rozpisane:${catapultDestroy}<br>
                                       ile ofa jest:${miejscaOffWZagrodzie}<br>
                                       proporcje:${proporcje}<br>
                                    </div>`)
        light = parseInt(light * proporcje)
        $("#unit_input_light").val(light);
        axe = parseInt(axe * proporcje)
        $("#unit_input_axe").val(axe);
        marcher = parseInt(marcher * proporcje)
        $("#unit_input_marcher").val(marcher);
        $("#unit_input_snob").val(1);
        setTimeout(()=>{$("#target_attack").trigger("click");return false;},500)
    }
    if (window.location.href.includes("attackType=fejk")) {
        spearFake = 0;
        swordFake = 0;
        axeFake = 0;
        archerFake = 0;
        spyFake = 0;
        lightFake = 0;
        marcherFake = 0;
        heavyFake = 0;
        ramFake = 0;
        catapultFake = 0;
        if (catapult > 0) {
            catapultFake = 1;
            catapult = catapult - 1;
            fakeMin = fakeMin - 8;
        }
        if (catapultFake == 0 && ram > 0) {
            ramFake = 1;
            ram = ram - 1;
            fakeMin = fakeMin - 5;
        }
        if (catapultFake == 0 && ramFake == 0 ) {

            return false;
        }
        while (fakeMin > 0 && spy > 0) {
            spyFake = spyFake + 1;
            spy = spy - 1;
            fakeMin = fakeMin - 2;
        }
        while (fakeMin > 0 && light > 0) {
            lightFake = lightFake + 1;
            light = light - 1;
            fakeMin = fakeMin - 4;
        }
        while (fakeMin > 0 && marcher > 0) {
            marcherFake = marcherFake + 1;
            marcher = marcher - 1;
            fakeMin = fakeMin - 5;
        }
        while (fakeMin > 0 && heavy > 0) {
            heavyFake = heavyFake + 1;
            heavy = heavy - 1;
            fakeMin = fakeMin - 6;
        }
        while (fakeMin > 0 && axe > 0) {
            axeFake = axeFake + 1;
            axe = axe - 1;
            fakeMin = fakeMin - 1;
        }
        while (fakeMin > 0 && ram > 0) {
            ramFake = ramFake + 1;
            ram = ram - 1;
            fakeMin = fakeMin - 5;
        }
        while (fakeMin > 0 && catapult > 0) {
            catapultFake = catapultFake + 1;
            catapult = catapult - 1;
            fakeMin = fakeMin - 8;
        }
        while (fakeMin > 0 && spear > 0) {
            spearFake = spearFake + 1;
            spear = spear - 1;
            fakeMin = fakeMin - 1;
        }
        while (fakeMin > 0 && sword > 0) {
            swordFake = swordFake + 1;
            sword = sword - 1;
            fakeMin = fakeMin - 1;
        }
        while (fakeMin > 0 && archer > 0) {
            archerFake = archerFake + 1;
            archer = archer - 1;
            fakeMin = fakeMin - 1;
        }
        if (fakeMin > 0) return false;
        $("#unit_input_spear").val(spearFake);
        $("#unit_input_sword").val(swordFake);
        $("#unit_input_axe").val(axeFake);
        $("#unit_input_archer").val(archerFake);
        $("#unit_input_spy").val(spyFake);
        $("#unit_input_light").val(lightFake);
        $("#unit_input_marcher").val(marcherFake);
        $("#unit_input_heavy").val(heavyFake);
        $("#unit_input_ram").val(ramFake);
        $("#unit_input_catapult").val(catapultFake);
        setTimeout(()=>{$("#target_attack").trigger("click");return false;},500)
    }
}

if (window.location.href.includes("screen=memo"))
    $("#content_value").prepend(`<div><textarea placeholder="tutaj wklej rozkazy z rozpiski" style="width:99%" id="daneRozpiski"></textarea><br><br>Co będzie wysłane:<table id="doWykonania" class="table"></table><br><br><button id="dzialaj" class="btn">Zascheduluj ataki</button><br>&nbsp;</div>`);

if (window.location.href.includes("try=confirm")) {
    village = window.location.href.match(/village\=\d{1,8}/)[0].replace("village=","")
    timediff = localStorage.getItem("timediff_"+village)
    celkatapult = localStorage.getItem("celkatapult_"+village)
    if (celkatapult !== 'null' && celkatapult !== null && typeof (celkatapult) !== 'undefined') {
        celkatapult = $("option:contains('"+celkatapult+"')").val()
        $("select").first().val(celkatapult);
    }
    szlachcice = parseInt(localStorage.getItem("szlachcice_"+village))
    if (szlachcice == 2) {
        $("#troop_confirm_train").trigger('click');
        $('tr.units-row input[data-unit="axe"]').val( $('tr.units-row').first().find('.unit-item-axe').text().trim())
        $('tr.units-row input[data-unit="light"]').val( $('tr.units-row').first().find('.unit-item-light').text().trim())
    }
    if (szlachcice == 3) {
        $("#troop_confirm_train").trigger('click');
        $("#troop_confirm_train").trigger('click');
        $('tr.units-row input[data-unit="axe"]').val( $('tr.units-row').first().find('.unit-item-axe').text().trim())
        $('tr.units-row input[data-unit="light"]').val( $('tr.units-row').first().find('.unit-item-light').text().trim())
    }
    if (szlachcice == 4) {
        $("#troop_confirm_train").trigger('click');
        $("#troop_confirm_train").trigger('click');
        $("#troop_confirm_train").trigger('click');
        $('tr.units-row input[data-unit="axe"]').val( $('tr.units-row').first().find('.unit-item-axe').text().trim())
        $('tr.units-row input[data-unit="light"]').val( $('tr.units-row').first().find('.unit-item-light').text().trim())
    }
    if (timediff !== null) {
        setTimeout(()=>{
            localStorage.removeItem("timediff_"+village)
            localStorage.removeItem("celkatapult_"+village)
            if (timediff > 0) timediff = 0;
            defaultTime = Math.floor(Timing.getCurrentServerTime()) + parseInt(Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration)*1000
            date = new Date(new Date(defaultTime) - timediff);
            originalArrival = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate())).slice(-2) + 'T' + ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + (date.getSeconds())).slice(-2) + '.' + (date.getUTCMilliseconds())
            $("#content_value").prepend(`<div>
            Attack to be scheduled<br>
            Time difference: ${timediff}<br>
            Attack time: ${originalArrival}<br>
            </div>`);
            $("#input_date").val(formatDate(date))
            $("#input_time").val(getTimeFromDate(date))

            $("#arrTime").trigger('click')
        },1500)
    }
}

$(document.body).on('keyup','#daneRozpiski',(event)=>{
    zastTab = window.location.href.match(/t\=\d{1,20}/);
    t = zastTab !== null ? "&"+zastTab[0] : "";
    currentServerTime = new Date(Timing.getCurrentServerTime());
    dane = event.currentTarget.value.split('\n\n')
    dane = dane.map(element=>{
        random = parseInt(Math.random() * 120000)
        type = "brak setupu";
        if (element.includes("Wyślij fejk")) type = "fejk";
        if (element.includes("Wyślij atak (Taran)")) type = "off";
        if (element.includes("Wyślij atak (Katapulta-Zagroda)")) type = "burzak-zagroda";
        if (element.includes("Wyślij atak (Katapulta-Kuźnia)")) type = "burzak-kuznia";
        if (element.includes("[b]OFF[/b]")) type = "off";
        if (element.includes("[b]Burzak[/b]")) type = "burzak";
        if (element.includes("[b]SZLACHCIC[/b]")) type = "szlachcic";
        if (element.includes("Wyślij atak (Szlachcic)")) type = "szlachcic";
        if (element.includes("Wyślij atak (Ofoburzak)")) type = "Ofoburzak";
        catapults = type === "burzak" ? parseInt(element.match(/Katapulty\-\d{1,4}/)[0].replace('Katapulty-','')) : (type === "szlachcic" && element.match(/Off\-\d{1,4}\,/) !== null  ? parseInt(element.match(/Off\-\d{1,4}\,/)[0].replace('Off-','').replace(',')) : (element.includes("Wyślij atak (Szlachcic)") ? 99999 : 0));
        catapults = type === "burzak-zagroda" || type === "burzak-kuznia" ? 200 : catapults;
        celkatapult = type === "burzak" ? element.match(/Katapulty.*b\]/)[0].replace(/Katapulty\-\d{1,4}/,'').replace("[b]","").replace("[/b]","").trim() : null;
        celkatapult = type === "burzak-zagroda" ? 'Zagroda' : celkatapult;
        celkatapult = type === "burzak-kuznia" ? 'Kuźnia' : celkatapult;
        dataAtaku = element.match(/\d{2,4}(\-|\.)\d{2}(\-|\.)\d{2,4}/)[0]
        dataAtaku = dataAtaku.match(/\d{2}\.\d{2}\.\d{4}/) !== null ? dataAtaku.substring(6,10) + "-" + dataAtaku.substring(3,5) + "-" + dataAtaku.substring(0,2) : dataAtaku;
        return {
            original_command: element,
            command_type: type,
            commandMinSendTime: new Date(dataAtaku + " " + element.match(/\d{2}\:\d{2}\:\d{2}/)[0]),
            timeDiff: (currentServerTime - new Date(dataAtaku + " " + element.match(/\d{2}\:\d{2}\:\d{2}/)[0])) - random,
            catapults: catapults,
            url: element.match(/https.*target\=\d{1,8}/)[0]+"&attackType="+type+"&cataputsDestroy="+catapults+t,
            village: element.match(/village\=\d{1,8}/)[0].replace("village=",""),
            celkatapult : celkatapult,
            szlachcice: element.includes("Wyślij atak (Szlachcic)") ? 4 : (type === "szlachcic" ? 1 : 0)
        };
    })
    tableHtml = `<tr><th>Link</th><th>Wioska Id</th><th>Wysłanie za</th><th>Typ ataku</th><th>Oryginalny link</th></tr>`
    dane.forEach(dana=>{
        minus = dana.timeDiff > 0 ? "-" : "";
        zostalo = Math.abs(dana.timeDiff)
        formatujZostalo = minus + " " +new Date(zostalo).toISOString().substr(11, 8)
        tableHtml += `<tr><td><a href="${dana.url}">Rozkaz</a></td><td>${dana.village}</td><td>${formatujZostalo}</td><td>${dana.command_type}</td><td><a href="${dana.url.replace("attackType","")}">Rozkaz</a></td></tr>`
    })
    $("#doWykonania").html(tableHtml)
})

$(document.body).on('click',"#dzialaj",()=>{
    $("#dzialaj").prop('disabled',true)
    removedOldLocalStorage()
    dane = dane.filter(a=>a.command_type !== 'brak setupu')
    szlachcice = dane.filter(a=>a.command_type === 'szlachcic')
    dane = dane.filter(a=>a.command_type !== 'szlachcic')
    szlachciceNew = [];
    szlachcice.forEach(szlachcic=>{
        szukana = szlachciceNew.find(a=>a.village=szlachcic.village)
        if(typeof szukana === 'undefined') {
            szlachciceNew.push({...szlachcic})
        } else {
            szukana.szlachcice = szukana.szlachcice+1;
            szukana.catapults = szukana.catapults+szlachcic.catapults;
            //szukana.url = szukana.url.replace(/cataputsDestroy\=\d{1,5}/,"cataputsDestroy="+szukana.catapults)
        }
    })
    szlachciceNew.forEach(a=>a.url = a.url+"&szlachcice="+a.szlachcice)
    dane = [...dane,...szlachciceNew];

    interval = setInterval(()=>{
        if (dane.length === 0) {
            clearInterval(interval);
            return false;
        }
        dana = dane.shift()
        localStorage.setItem("timediff_"+dana.village,dana.timeDiff)
        if (celkatapult !== null) localStorage.setItem("celkatapult_"+dana.village,dana.celkatapult)
        localStorage.setItem("szlachcice_"+dana.village,dana.szlachcice)
        window.open(dana.url, '_blank')
    },5000)
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



function getTimeFromDate(date) {
    var d = new Date(date);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    if (hours < 10 ) hours = "0"+hours
    if (minutes < 10 ) minutes = "0"+minutes
    if (seconds < 10 ) seconds = "0"+seconds
    return hours+":"+minutes+":"+seconds
}

function removedOldLocalStorage() {
    localStorageSize = localStorage.length;
    keysToBeRemoved = []
    for (n=0;n<localStorageSize;n++) {
        if (localStorage.key(n).includes("timediff_") || localStorage.key(n).includes("celkatapult_") || localStorage.key(n).includes("szlachcice_"))
            keysToBeRemoved.push(localStorage.key(n))
    }
    keysToBeRemoved.forEach(a=>localStorage.removeItem(a))
}




