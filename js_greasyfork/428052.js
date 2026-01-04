// ==UserScript==
// @name         Analiza rozpiski
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Analizuje rozpiske
// @author       You
// @match        https://*.plemiona.pl/*screen=ally*
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428052/Analiza%20rozpiski.user.js
// @updateURL https://update.greasyfork.org/scripts/428052/Analiza%20rozpiski.meta.js
// ==/UserScript==



$("#content_value").prepend(`<div><h2>Wklej rozpiske</h2><textarea rows="4" id="rozpiska" style="width:95%"></textarea></div><br><table class="vis"><colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup><tbody id="doWykonania"></tbody></table>`)

$(document.body).on('change','#rozpiska',(event)=>{
    dane = event.currentTarget.value.split('\n\n')
    dane = dane.map(element=>{
        random = parseInt(Math.random() * 120000)
        type = "brak setupu";
        if (element.includes("Wyślij fejk")) type = "inny";
        if (element.includes("Wyślij atak (Taran)")) type = "off";
        if (element.includes("Wyślij atak (Katapulta-Zagroda)")) type = "burzak-zagroda";
        if (element.includes("Wyślij atak (Katapulta-Kuźnia)")) type = "burzak-kuznia";
        if (element.includes("[b]OFF[/b]")) type = "off";
        if (element.includes("[b]Burzak[/b]")) type = "inny";
        if (element.includes("[b]SZLACHCIC[/b]")) type = "inny";
        if (element.includes("Wyślij atak (Szlachcic)")) type = "inny";
        if (element.includes("Wyślij atak (Ofoburzak)")) type = "Ofoburzak";
        dataAtaku = element.match(/\d{2,4}(\-|\.)\d{2}(\-|\.)\d{2,4}/)[0]
        dataAtaku = dataAtaku.match(/\d{2}\.\d{2}\.\d{4}/) !== null ? dataAtaku.substring(6,10) + "-" + dataAtaku.substring(3,5) + "-" + dataAtaku.substring(0,2) : dataAtaku;
        wioska = parseInt(element.match(/village\=\d{1,20}/)[0].replace("village=",""))
        cel = parseInt(element.match(/target\=\d{1,20}/)[0].replace("target=",""))
        return {
            original_command: element,
            command_type: type,
            commandMinSendTime: new Date(dataAtaku + " " + element.match(/\d{2}\:\d{2}\:\d{2}/)[0]),
            wioska:wioska,
            cel:cel
        };
    })

    a = new Promise(resolve => $.ajax({
        url: 'https://' + game_data.world + '.plemiona.pl/map/village.txt',
        success: response => {
            villages = []
            response = response.split('\n')
            //console.log(response)
            response.forEach(element => {
                if (element == '') return false;
                village = element.split(',')
                villages.push({
                    id: parseInt(village[0]),
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
            response.forEach((element,index) => {

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
            //console.log(players);
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
            //console.log(tribes);
            resolve();
        },
        cache: false
    }));

    Promise.all([a, b, c]).then(val => {
        //console.log('dane sciagniete')
        dane = dane.map(element=>{
            wioska = villages.find(a => a.id === element.wioska)
            gracz = players.find(a => a.id === wioska.player_id)
            return {
                ...element,
                gracz: gracz.name,
                gracz_id: wioska.player_id,
                coords:wioska.coords
            };
        })
        //tableHtml = `<tr><th>Link</th><th>Wioska Id</th><th>Wysłanie za</th><th>Typ ataku</th><th>Oryginalny link</th></tr>`;
        //dane.forEach(dana=>{
        //    tableHtml += `<tr><td><a href="${dana.url}">Rozkaz</a></td><td>${dana.village}</td><td></td><td>${dana.command_type}</td><td><a href="${dana.url}">Rozkaz</a></td></tr>`
        //});
        lista_wszystkich_rozkazow = [];
        zbior_wiosek = new Set();
        dane.forEach(element=>{

            zbior_wiosek.add(element.cel);

            szukana = lista_wszystkich_rozkazow.filter(a=> a.gracz === element.gracz && a.cel === element.cel)

            if (szukana.length > 0) {
                //console.log('obecne wartosci',szukana)
                if (element.command_type === 'off') szukana[0].off = szukana[0].off + 1;
                if (element.command_type === 'inny') szukana[0].inny = szukana[0].inny + 1;
            } else {
                cel_wioska = wioska = villages.find(a => a.id === element.cel)
                off = element.command_type === 'off' ? 1 : 0;
                inny = element.command_type === 'inny' ? 1 : 0;
                lista_wszystkich_rozkazow.push({gracz:element.gracz,cel:element.cel,off:off,inny:inny,wyslany_off:0,wyslany_inne:0,coords:cel_wioska.coords})
            }
        })
        zbior_wiosek = Array.from(zbior_wiosek)
        wszystkie_rozkazy = []
        zbior_wiosek.forEach(element=>{
            readCommands(element)
        })

        wszystkie_rozkazy.forEach(element=>{
            szukana = lista_wszystkich_rozkazow.filter(a=> a.gracz === element.nick && a.cel === element.cel)
            if (szukana.length > 0) {
                //console.log('obecne wartosci',szukana)
                if (element.typ === 'off') szukana[0].wyslany_off = szukana[0].wyslany_off + 1;
                if (element.typ === 'inny') szukana[0].wyslany_inne = szukana[0].wyslany_inne + 1;
            }
        })

        wszystkie_ofy = 0;
        wszystkie_inne = 0;
        wszystkie_wyslane_ofy = 0;
        wszystkie_wyslane_inne = 0;
        tableHtml = `<tr><th align="center">Coordy</th><th align="center">Gracz</th><th align="center">Ofy</th><th align="center">Fejki/burzaki</th></tr>`;
        lista_wszystkich_rozkazow.forEach(dana=>{
            off_back = dana.wyslany_off < dana.off ? 'Salmon' : 'SpringGreen';
            inne_back = dana.wyslany_inne < dana.inny ? 'Salmon' : 'SpringGreen';
            tableHtml += `<tr><td align="center">${dana.coords}</td><td align="center">${dana.gracz}</td><td align="center" style="background-color:${off_back}">${dana.wyslany_off}/${dana.off}</td><td align="center" style="background-color:${inne_back}">${dana.wyslany_inne}/${dana.inny}</td></tr>`
            wszystkie_ofy = dana.off + wszystkie_ofy
            wszystkie_inne = dana.inny + wszystkie_inne
            wszystkie_wyslane_ofy = dana.wyslany_off + wszystkie_wyslane_ofy
            wszystkie_wyslane_inne = dana.wyslany_inne + wszystkie_wyslane_inne
        });
        tableHtml += `<tr><th colspan="2" style="text-align:center"><b>SUMA</b></th><th style="text-align:center"><b>${wszystkie_wyslane_ofy}/${wszystkie_ofy}</b></th><th style="text-align:center"><b>${wszystkie_wyslane_inne}/${wszystkie_inne}</b></th></tr>`
        $("#doWykonania").html(tableHtml)
    })



})


function readCommands(village) {
    ajax = $.ajax({
        type:"POST",
        async:false,
        url:'https://'+game_data.world+'.plemiona.pl/game.php?screen=info_village&id='+village,
        success: html => {
            html = $(html)
            rozkazy = []
            html.find("#commands_outgoings").find('tr.command-row').each((index,element)=>{
                element = $(element)
                rozkaz = element.find('td').first().text().trim().split(":")
                //console.log(rozkaz)
                nick = rozkaz.length > 1  ? rozkaz[0] : game_data.player.name
                typ = (element.html().includes("attack_large")) ? 'off' : 'inny'
                wszystkie_rozkazy.push({nick:nick,typ:typ,cel:village})
            })
        }
    })
    return ajax
}