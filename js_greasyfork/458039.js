// ==UserScript==
// @name         Facebook Search Data Automation
// @namespace    http://tampermonkey.net/
// @version      2.65
// @description  Extract Data that match the criteria from Facebook Search Page
// @author       Doncha1009
// @match        https://www.facebook.com/search/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458039/Facebook%20Search%20Data%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/458039/Facebook%20Search%20Data%20Automation.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.addEventListener("load", async function()
    {
        const delay = ms => new Promise(res => setTimeout(res, ms));
 
        console.log("starting in 120 seconds...");
 
        await delay(120000);
 
        /*const datum = new Date("2023-1-31");
        const sadasnji = new Date();
        if(sadasnji > datum){
            console.log("The trial expired, if you could pay on this Paypal and not on Fiverr because Fiverr takes a big share: https://www.paypal.com/paypalme/Donca1009");
            return;
        }*/
 
        console.log("starting...");
        let DateFirstBoundary = promptForDate("Enter a first date boundary (e.g. June 8, 2010):")
        let DateSecondBoundary = promptForDate("Enter a second date boundary (e.g. June 8, 2010):")
 
        let sviRezultati = "Buisness Name,Phone Number,Address,Website,Facebook,Creation Date, Category, Email\n";
        let lista_ljudi = document.getElementsByClassName("x193iq5w x1xwk8fm")[0].children;
        let lista = [];
        //for petlja da prodje kroz sve klase da nadje samo url biznis strana
        for(let i = 0; i < lista_ljudi.length - 1; i++)
        {
            lista[i] = lista_ljudi[i].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("href")
        }
 
        /*lista[0] = "https://www.facebook.com/profile.php?id=100082873075641";
        lista[1] = "https://www.facebook.com/profile.php?id=100083414017433";
        lista[2] = "https://www.facebook.com/profile.php?id=100084155977753";
        lista[3] = "https://www.facebook.com/profile.php?id=100085804250570";
        lista[4] = "https://www.facebook.com/profile.php?id=100088170301246";
        lista[5] = "https://www.facebook.com/profile.php?id=100086963957020";
        lista[6] = "https://www.facebook.com/profile.php?id=100087732184149";
        lista[7] = "https://www.facebook.com/profile.php?id=100087661926233";
        lista[8] = "https://www.facebook.com/profile.php?id=100087007830841";
        lista[9] = "https://www.facebook.com/profile.php?id=100082819498005";
        lista[10] = "https://www.facebook.com/BensMowingAndHandyman";
        lista[11] = "https://www.facebook.com/profile.php?id=100089776776088";
        lista[12] = "https://www.facebook.com/profile.php?id=100083271615586";
        lista[13] = "https://www.facebook.com/profile.php?id=100085593604065";
        lista[14] = "https://www.facebook.com/profile.php?id=100085593604065";
        lista[15] = "https://www.facebook.com/profile.php?id=100082588638460";
        lista[16] = "";*/
 
 
 
        //await delay(5000);
        console.log("The number of buisness pages: " + lista.length);
        let pauzaBr = 1;
        for(let i = 0; i < lista.length - 1; i++)
        {
            if(i == pauzaBr * 50) { pauzaBr++; await delay(10000); saveData(sviRezultati, "foundData.csv"); } // ceka pola sata da facebook ne bi blokirao
            let url = lista[i];
            //console.log(url)
 
            let datum, broj_telefona, adresa;
            console.log("starting " + i + " company");
 
            await delay(4000);
            let windowNovi = window.open(url); // za svaku biznis stranu otvori window
            await delay(8000);
            this.self.focus();
 
            let pageSource = windowNovi.document.getElementsByTagName("html")[0].innerHTML;
 
            if(pageSource.contains('page_creation_date":{"text":'))
                datum = getPageCreationDate(pageSource);
            else
            {
                //console.log("Za " + url + ":  upao je za: About");
                let indexAbout = pageSource.indexOf('"section_type":"ABOUT"'); // izvlaci about link za novi window
                let stringTemp = pageSource.substring(indexAbout + 22, indexAbout + 150);
                stringTemp = stringTemp.slice(stringTemp.indexOf('"url":"') + 7, stringTemp.length - 1);
                stringTemp = stringTemp.slice(0, stringTemp.indexOf('","'));
                stringTemp += "_profile_transparency"; // da bi uslo odmah za datum
                stringTemp = stringTemp.replaceAll("\\/", "/"); // zamenjuje \/ sa /
 
                await delay(4000);
                windowNovi.close();
                let windowNoviji = window.open(stringTemp);
                await delay(8000);
                this.self.focus();
 
                let pageSource2 = windowNoviji.document.getElementsByTagName("html")[0].innerHTML;
                //console.log(pageSource2);
 
                await delay(4000);
                windowNoviji.close();
 
                datum = getPageCreationDate2(pageSource2);
            }
            //console.log("Datum: " + datum);
            broj_telefona = getPhoneNumber(pageSource);
            //console.log("Broj Telefona: " + broj_telefona);
            adresa = getCountryName(pageSource);
            //console.log("Ime zemlje:" + adresa);
 
            if(datum == -1 || broj_telefona == -1 || adresa == -1){ // da li su ispravni
                //console.log("Nije dobar jer je datum: " + datum + ", broj telefona: " + broj_telefona + ", adresa: " + adresa);
            }
            else
            {
                if(adresa.indexOf("&gt") != -1)
                    adresa = adresa.slice(adresa.indexOf("&gt") + 8, adresa.length - 1);
 
                let imeBiznisa = getBuisnessName(pageSource);
                let kategorija = getBuisnessCategory(pageSource);
                //console.log("Ime zemlje Biznisa:" + imeBiznisa);
                let website = getBuisnessWebsite(pageSource);
                if(website == -1 || !website.contains("http"))
                    website = "There is no website";
                else
                    website = website.replaceAll("\\/", "/");
 
                let email = getBuisnessEmail(pageSource);
                console.log("company matches the criteria: " + imeBiznisa + "  ");
 
                sviRezultati += '"' + imeBiznisa + '",' + broj_telefona + "," + '"' + adresa + '","' + website + '","' +  url + '","' + datum + '","' + kategorija + '","' + email + '",' + "\n";
            }
            await delay(4000);
            windowNovi.close();
            await delay(4000);
 
        }
 
        saveData(sviRezultati, "foundData.csv");
 
        function promptForDate(promptString) {
            let dateString = prompt(promptString);
            let dateObject = new Date(Date.parse(dateString));
            return dateObject;
        }
        function getPageCreationDate(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('page_creation_date":{"text":');
            let stringDatuma = pageSource.substring(leviDeoIndex + 28, leviDeoIndex + 68);
            //console.log(stringDatuma);
            if(stringDatuma.contains("2022")){
                stringDatuma = stringDatuma.slice(stringDatuma.indexOf(' - ') + 3, stringDatuma.indexOf('"},'));
                let datum = new Date(Date.parse(stringDatuma));
                if(isBetweenDates(datum))
                {
                    if(stringDatuma.contains(`\\u`))
                        return stringDatuma.split("\\u")[1];
                    return stringDatuma;
                }
                else
                    return -1;
            }
            return -1;
        }
        function getPageCreationDate2(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"},"field_type":"creation_date"');
            let stringDatuma = pageSource.substring(leviDeoIndex - 20, leviDeoIndex + 1);
            stringDatuma = stringDatuma.slice(stringDatuma.indexOf('":"') + 3, stringDatuma.length - 1);
            let datum = new Date(Date.parse(stringDatuma));
            if(isBetweenDates(datum))
                return stringDatuma;
            return -1;
        }
        function isBetweenDates(dateObjectPage) {
            let timeCurrentPage = dateObjectPage.getTime();
            let timeFirst = DateFirstBoundary.getTime();
            let timeSecond = DateSecondBoundary.getTime();
            return (timeCurrentPage > timeFirst && timeCurrentPage < timeSecond);
        }
        function getPhoneNumber(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"formatted_phone_number":"');
            let stringBrojaTelefona = pageSource.substring(leviDeoIndex + 26, leviDeoIndex + 46);
            if(stringBrojaTelefona.contains("null") || stringBrojaTelefona[4] != '4')
            {
                let leviDeoIndex = pageSource.indexOf('dir="auto">+61 4');
                stringBrojaTelefona = pageSource.substring(leviDeoIndex + 11, leviDeoIndex + 46);
                if(leviDeoIndex == -1 || stringBrojaTelefona.contains("null"))
                    return -1;
 
                return stringBrojaTelefona.slice(0, stringBrojaTelefona.indexOf('</'))
            }
            else
                return stringBrojaTelefona.slice(1, stringBrojaTelefona.indexOf('","'));
        }
        function getCountryName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"full_address":');
            let stringImenaZemlje = pageSource.substring(leviDeoIndex + 14, leviDeoIndex + 164);
            if(!stringImenaZemlje.contains("Australia"))
            {
                //<div class="xzsf02u x6prxxf xvq8zen x126k92a x12nagc"><span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u" dir="auto">
                let leviDeoIndex = pageSource.indexOf('x1a2a7pz x1heor9g xt0b8zv" role="button" tabindex="0"><span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u" dir="auto">');
                stringImenaZemlje = pageSource.substring(leviDeoIndex + 232, leviDeoIndex + 300);
                if(leviDeoIndex == -1 || !stringImenaZemlje.contains("Australia"))
                    return -1;
                return stringImenaZemlje.slice(0, stringImenaZemlje.indexOf('</')).replaceAll("\\n", " ");
            }
            else
                return stringImenaZemlje.slice(2, stringImenaZemlje.indexOf("Australia") + 9).replaceAll("\\n", " ");
        }
        function getBuisnessName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"meta":{"title":"');
            let imeBiznisa = pageSource.substring(leviDeoIndex + 17, leviDeoIndex + 70);
            //console.log("Ime biznisa neobradjeno:" + imeBiznisa);
            imeBiznisa = imeBiznisa.slice(0, imeBiznisa.indexOf('","')).split("|")[0];
            if(imeBiznisa.contains(`\\u`))
                imeBiznisa = imeBiznisa.replaceAll(`\\u`, "'s ");
            return imeBiznisa;
        }
        function getBuisnessWebsite(pageSource)
        {
            let buisnessWebsite = "";
            let leviDeoIndex = pageSource.indexOf('"website":');
            if(leviDeoIndex != -1) // ako postoji
            {
                buisnessWebsite = pageSource.substring(leviDeoIndex + 10, leviDeoIndex + 70);
                //console.log(buisnessWebsite);
                return buisnessWebsite.slice(0, buisnessWebsite.indexOf('","'));
            }
            // ako ne postoji
            leviDeoIndex = pageSource.indexOf('<span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x1qq9wsj x1yc453h" dir="auto">');
            if(leviDeoIndex == -1)
                return -1;
            buisnessWebsite = pageSource.substring(leviDeoIndex + 188, leviDeoIndex + 220);
            //console.log(buisnessWebsite);
            return buisnessWebsite.slice(0, buisnessWebsite.indexOf('<'));
        }
        function getBuisnessCategory(pageSource)
        {
            if(pageSource.contains('"category_name":"'))
            {
                let leviDeoIndex = pageSource.indexOf('"category_name":"');
                let kategorija = pageSource.substring(leviDeoIndex + 17, leviDeoIndex + 68);
                return kategorija.slice(0, kategorija.indexOf('","')).replaceAll("\\/", "&");
            }
            else if (pageSource.contains('"text":"Page '))
            {
                let leviDeoIndex = pageSource.indexOf('"text":"Page');
                let kategorija = pageSource.substring(leviDeoIndex + 19, leviDeoIndex + 100);
                return kategorija.slice(0, kategorija.indexOf('"}')).replaceAll("\\/", "&");;
            }
            return "There is no given category";
        }
        function getBuisnessEmail(pageSource)
        {
            let buisnessEmail = "";
            let leviDeoIndex = pageSource.indexOf('@gmail.com');
            if(leviDeoIndex != -1) {
                buisnessEmail = pageSource.substring(leviDeoIndex - 100, leviDeoIndex + 11);
                return buisnessEmail.slice(buisnessEmail.indexOf('>') + 1, buisnessEmail.length - 1);
            }
            // ako nije gmail
            leviDeoIndex = pageSource.lastIndexOf('@');
            buisnessEmail = pageSource.substring(leviDeoIndex -30, leviDeoIndex + 30);
            buisnessEmail = buisnessEmail.slice(buisnessEmail.indexOf('>') + 1, buisnessEmail.indexOf('<'));
            if(leviDeoIndex == -1 || !buisnessEmail.contains(".") || !buisnessEmail.contains("@"))
                return "Email cannot be extracted";
            return buisnessEmail;
        }
        function saveData(data, fileName) {
            console.log("Saving data to " + fileName);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var blob = new Blob([data], {type: "octet/stream"});
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    });
 
})();