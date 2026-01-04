// ==UserScript==
// @name         Jidelna
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Script na zobrazovani nahledu jidel na strava.vda.cz
// @author       sirluky
// @include      http://strava.isstct.cz/*
// @include      https://strava.isstct.cz/*
// @include      http://strava.vda.cz/*
// @include      https://strava.vda.cz/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390302/Jidelna.user.js
// @updateURL https://update.greasyfork.org/scripts/390302/Jidelna.meta.js
// ==/UserScript==

(function () {
    //"use strict";
    let downloadedWeek = ""
    let globalJidloData;

    const datumstart = document.querySelector('[name="content:filterDateForm:startDate"]');
    const jmeno = $(`[title="Zprávy od jídelny"]`).next().text();
    let nick = $(`[title="Zprávy od jídelny"]`).next().attr('title');
    var pm = nick.indexOf(': ');
    nick = nick.slice(pm+2,nick.length);
    console.log(jmeno,nick)
    if (datumstart && datumstart.value !== "01.01.2000") {
        document.querySelector('[name="content:filterDateForm:startDate"]').value = "01.01.2000";
        $('[name="content:filterDateForm:endDate"]').next("input").click();
    } else {
        let jidlah = [];
        let jidlo = {};
        let datarow = $(".mouseOutRow").first();
        while (datarow.length) {
            let o = datarow.next().find("td").get();
            const obj = {
                datum: o[0],
                varianta: o[1],
                popis: o[2],
                objednano: o[3],
                vydejna: o[4],
                ks: o[5],
                vydano: o[6],
                cena: o[7]
            };

            jidlah.push(jidlo);
            datarow = datarow.next();
        }

        console.log(jidlah);
    }


    function getWeekData(){
    let day = document.querySelector('.KalTable.Kal5 div').textContent;
    let year = new Date().getYear();
    let month = new Date().getMonth()+1;
    let date = new Date(year,month,day);

        function getMonday(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        }

         date = getMonday(date);

         //console.log(date);
        let den = date.getDate() + ""
        let mesic = date.getMonth() + "";
        let finaldate =  (den.length > 1 ? den : "0" + den) + '.' + (mesic.length > 1 ? mesic : "0" + mesic) + '.'

        return finaldate;
    }

    function fetchNewData(){
        fetch('https://woolen-actress.glitch.me/?tyden=' + getWeekData()).then(data => data.json()).then(data => {
            globalJidloData = data;
            downloadedWeek = getWeekData();
        });
    }
    fetchNewData()

    setInterval(e => {
        data = globalJidloData;
        if(getWeekData() != downloadedWeek){
            fetchNewData();
        }
          if(!document.querySelector('div > div .image') && globalJidloData && getWeekData() == downloadedWeek){
      let day = document.querySelector('.KalTable.Kal5 div').textContent;
    let year = new Date().getYear();
    let month = new Date().getMonth()+1;
    let date = new Date(year,month,day);

         let jden =data.filter(d => d.den == (getDenName(date.getDay()) ));
        var o1 = jden.find(d => d.popis == 'oběd 1:');
        var [t1,t2] = document.querySelector(' div > div:nth-child(1) > span > span:nth-child(2)').textContent.split('/')
       t1 = '<a style="color:darkgreen;" href="' + 'http://www.vda.cz' + jden.find(d => d.popis == 'polévka:').link + '">' + t1 + '</a>';

        t2 = '/<a href="' + 'http://www.vda.cz' + o1.link + '">' + t2 + '</a> '  + '<br><img style="width:150px" src="' + 'http://www.vda.cz' + o1.link + '">';


        document.querySelector(' div > div:nth-child(1) > span > span:nth-child(2)').innerHTML = t1+t2;
        var o1 = jden.find(d => d.popis == 'oběd 2:');
        var [t1,t2] = document.querySelector(' div > div:nth-child(2) > span > span:nth-child(2)').textContent.split('/')
        t2 = '/<a href="' + 'http://www.vda.cz' + o1.link + '">' + t2 + '</a>' + '<br><img style="width:150px" src="' + 'http://www.vda.cz' + o1.link + '">';
                     t1 = '<a style="color:darkgreen;" href="' + 'http://www.vda.cz' + jden.find(d => d.popis == 'polévka:').link + '">' + t1 + '</a>' ;


        document.querySelector(' div > div:nth-child(2) > span > span:nth-child(2)').innerHTML = t1+t2;
        var o1 = jden.find(d => d.popis == 'oběd 3:');
                 if(document.querySelector(' div > div:nth-child(3) > span > span:nth-child(2)')) {
                    [t1,t2] = document.querySelector(' div > div:nth-child(3) > span > span:nth-child(2)').textContent.split('/')
        t2 = '/<a class="image" href="' + 'http://www.vda.cz' + o1.link + '">' + t2 + '</a>' + '<br><img style="width:150px" src="' + 'http://www.vda.cz' + o1.link + '">';
                            t1 = '<a style="color:darkgreen;" href="' + 'http://www.vda.cz' + jden.find(d => d.popis == 'polévka:').link + '">' + t1 + '</a>';

        document.querySelector(' div > div:nth-child(3) > span > span:nth-child(2)').innerHTML = t1+t2;
                 }}},1000)


    //document.querySelector("#mainContext > table > tbody > tr > td.noPrint > table > tbody").onclick = triggerimageshow
    function triggerimageshow(){
        const data = globalJidloData;
        setTimeout(() => {
             if(!document.querySelector('#mainContext > div.blockUI.blockMsg.blockElement')){



             }else {
triggerimageshow()
            }
        },1000);

    }


function getDenName(denvtydnu = new Date().getDay()) {
    switch (denvtydnu) {
        case 1:
            return 'Pondělí';
        case 2:
            return 'Úterý';
        case 3:
            return 'Středa';
        case 4:
            return 'Čtvrtek';
        case 5:
            return 'Pátek';
    }
}

    // Your code here...
})();