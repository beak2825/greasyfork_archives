// ==UserScript==
// @name         BackOffice v3
// @namespace    http://tampermonkey.net/
// @version      3.4.1
// @description  Yeni bir BackOffice!
// @author       Menderes Acarsoy
// @match        https://bo.bo-2222eos-gbxc.com/player/financial/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=837bahsine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508804/BackOffice%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/508804/BackOffice%20v3.meta.js
// ==/UserScript==


/// DEĞİŞKENLER ///
var agent_id = document.querySelector("body > div.page-wrapper > div.page-header.navbar.navbar-fixed-top > div > div.top-menu > ul > li:nth-child(3) > a > span").innerText.split(" ")[0].replace("[", "").replace("]", "");
console.log("Agent ID: " + agent_id);
var agent_username = document.querySelector("body > div.page-wrapper > div.page-header.navbar.navbar-fixed-top > div > div.top-menu > ul > li:nth-child(3) > a > span").innerText.split(" ")[1];
console.log("Agent kullanıcı adı: " + agent_username);

var bo_saat = "";
var bo_saat_sa = "";
var bo_saat_dk = "";
var bo_saat_sn = "";
var interval = setInterval(function() {
    bo_saat = document.querySelector('#user-clock').innerText;
    if (bo_saat !== "Clock") {bo_saat_sa = bo_saat.split(":")[0]; bo_saat_dk = bo_saat.split(":")[1]; bo_saat_sn = bo_saat.split(":")[2]; clearInterval(interval);}
}, 1000);


var url = location.href;
var user_id = location.pathname.replace('/lifetime','').split('/').pop();
var user_name = document.querySelector('h3[style="margin: 0;"] > a').textContent.trim().split(") ")[1];
var user_type = "Bilinmiyor";
var name_surname = document.querySelector('.badge.badge-danger.note_info__counter').nextSibling.textContent.trim().replace("(","").replace(")","");
var risk_level = document.querySelector('h3[style="margin: 0;"] > span.player-profile-link').getAttribute('title').replace("Risk Level: ","");
var balance = document.querySelector('div[style="font-size: 15px; padding-top: 5px;"]').firstElementChild.firstElementChild.innerText;
var bonus = document.querySelector('div[style="font-size: 15px; padding-top: 5px;"]').lastElementChild.firstElementChild.innerText.trim().split(":")[0];
var balanceElement = document.querySelector('div[style="font-size: 15px; padding-top: 5px;"]').firstElementChild.firstElementChild;
var bonusElement = document.querySelector('div[style="font-size: 15px; padding-top: 5px;"]').lastElementChild.firstElementChild;

var gunler = ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"];
var kacinciGun = new Date().getDay();
var gun = gunler[kacinciGun];

var year = new Date().getFullYear();
var month = new Date().getMonth()+1;
var day = new Date().getDate();
var yday = new Date().getDate()-1;
var tomo = new Date().getDate()+1;
var paramFrom = "?from=" + year + "." + month + "." + day + ".00.00";
var paramFromYesterday = "?from=" + year + "." + month + "." + yday + ".00.00";
var paramTo= "&to=" + year + "." + month + "." + day + ".23.59";
var paramToTomo = "&to=" + year + "." + month + "." + tomo + ".23.59";

var toplamYatirimTutar = parseInt(document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(3) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(1) > td:nth-child(2)").innerText.trim());
var toplamYatirimAdet = parseInt(document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(3) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerText.trim());
var toplamCekimTutar = parseInt(document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(3) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(1) > td:nth-child(6)").innerText.trim());
var toplamCekimAdet = parseInt(document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(3) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(2) > td:nth-child(6)").innerText.trim());
var toplamBonusTutar = parseInt(document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(3) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(1) > td:nth-child(3)").innerText.trim());
var toplamBonusAdet = parseInt(document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(3) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.trim());
var toplamKayip = toplamYatirimTutar - toplamCekimTutar;

var addButtonElement = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(2) > div:nth-child(1) > div > div.portlet-body > form > div:nth-child(3) > div:nth-child(1) > div > button");
var addButtonAltiElement = document.querySelectorAll(".form-actions.border-top-none")[0];
var removeButtonElement = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(2) > div:nth-child(1) > div > div.portlet-body > form > div:nth-child(3) > div:nth-child(2) > div > button");
var removeButtonAltiElement = document.querySelectorAll(".form-actions.border-top-none")[1];
var amountInputElement = document.querySelector('input[name="amount"]');
var transactiontTypeElement = document.querySelector('#transaction_type');
var bonusDescriptionElement = document.querySelector('textarea[name="description"]');

var withdrawID = new Set();
var etki = new Set();
var wonBet = new Map();
var cashout = new Map();
var rollback = new Map();
var kuponkt = false;

var from = "";
var to = "";
var aynigun = true;

var ilkgun = 0;
var songun = 0;

var urlX = url.split('?')[1];
var urlParams = new URLSearchParams(urlX);

urlParams.forEach(function(value, key) {
    if (key === "from") {from = value.split(".")[2]} else {to = value.split(".")[2]}
});

if (from !== to) {aynigun = false; ilkgun = from; songun = to}



transactiontTypeElement.addEventListener('change', function() {
    if (this.value === "bonus") {
        addButtonElement.classList.remove("green-meadow");
        addButtonElement.classList.add("purple");
    } else {
        addButtonElement.classList.remove("purple");
        addButtonElement.classList.add("green-meadow");
    }
});


if (bonusDescriptionElement) {
    bonusDescriptionElement.addEventListener('input', function() {
        if (this.value.includes("sans") || this.value.includes("şans") || this.value.includes("jest")) { transactiontTypeElement.value = "bonus"; transactiontTypeElement.dispatchEvent(new Event("change")) }
        if (this.value.includes("tg slot") || this.value.includes("tg spor")) { amountInputElement.value = "200"; transactiontTypeElement.value = "bonus"; transactiontTypeElement.dispatchEvent(new Event("change")) }
        if (this.value === "etki") { transactiontTypeElement.value = "withdraw"; transactiontTypeElement.dispatchEvent(new Event("change")) }
        if (this.value === "") { transactiontTypeElement.value = "choose"; transactiontTypeElement.dispatchEvent(new Event("change")) }
    });
}


if (amountInputElement) {
    amountInputElement.addEventListener('input', function() {
        this.value = this.value.replace(" ","").replace(",","").replace("tl","").replace("TL","").replace("₺","").replace("..",".").trim();
        if (!this.value.startsWith("0")) { this.value = this.value.replace(".","") }
        if (this.value.startsWith("001")) { this.value = "0.01" }

        var amount = this.value;

        if (amount.length !== 0) {
            if (amount === "0.01") {addButtonElement.textContent = amount; transactiontTypeElement.value = "other"; transactiontTypeElement.dispatchEvent(new Event("change")); bonusDescriptionElement.focus();}
            else {addButtonElement.textContent = duzelt(amount);}

        } else {
            addButtonElement.textContent = "Add";
        }

    });
}


var blinkElement = document.createElement('style');
var blinkCSS = '@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } } .blink { animation: blink 1s infinite; }';
blinkElement.innerHTML = blinkCSS;
document.head.appendChild(blinkElement);

var alertifyCSS = document.createElement('link');
alertifyCSS.setAttribute('rel','stylesheet');
alertifyCSS.setAttribute('href','https://cdn.jsdelivr.net/npm/alertifyjs/build/css/alertify.min.css');
document.head.appendChild(alertifyCSS);

var alertifyJS = document.createElement('script');
alertifyJS.setAttribute('src','https://cdn.jsdelivr.net/npm/alertifyjs/build/alertify.min.js');
document.head.appendChild(alertifyJS);


function duzelt(deger, olsunmu) {
    let abc = String(deger);
    //console.log(abc)

    if (abc.charAt(abc.length - 3) === '.') {

        let tamKisim = abc.split(".")[0];
        let ondalikKisim = abc.split(".")[1];

        let tam = tamKisim.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        let ondalik = tam + "," + ondalikKisim;

        if (olsunmu && ondalikKisim && ondalikKisim !== "00") {
            //console.log(ondalik)
            return ondalik;
        } else {
            //console.log(tam)
            return tam;
        }

    } else {
        //console.log(abc.replace(/\B(?=(\d{3})+(?!\d))/g, "."))
        return abc.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

}


function date(tarih) {
    let dmy = tarih.split(" ")[0];
    let dd = dmy.split("/")[0];
    let mm = dmy.split("/")[1];
    let yyyy = dmy.split("/")[2];
    let sonuc = yyyy + "." + mm + "." + dd;

    if (tarih.includes(" ")) {let zaman = tarih.split(" ")[1]; let saat = zaman.split(":")[0]; let dakika = zaman.split(":")[1]; let saniye = zaman.split(":")[2]; sonuc = sonuc + "." + saat + "." + dakika + "." + saniye;}
    else {sonuc = sonuc + ".00.00.00";}

    return sonuc;
}


function veriCek(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}


var oran = "";
var gunsonuAktif = false;
document.title = user_name;
/////////////////////////////////////////////////////////////////////

/// TODAY SEÇ ///
if(!location.href.includes('from') && !location.href.includes('lifetime')) {

    var hour = new Date().getHours();
    if (hour === 23) {window.location.replace(url.split("?")[0] + paramFrom + paramToTomo); return;}
    if (hour === 0 || hour === 1 || hour === 2 || hour === 3) {window.location.replace(url.split("?")[0] + paramFromYesterday + paramTo); return;}

    window.location.replace(url + paramFrom + paramTo);
    return;
}
//////////////////////


/// KOPYALA BUTONU ///
var htmlToCopy = "<a href='https://bo.bo-2222eos-gbxc.com/player/financial/" + user_id + "'>" + user_name + "</a> (" + name_surname + ")";

var copyButton = document.createElement("i");
copyButton.className = "fa fa-copy";
copyButton.style.cursor = "pointer";
copyButton.style.marginLeft = "5px";
copyButton.title = "Kopyala";

copyButton.onclick = function() {

    const clipboardItem = new ClipboardItem({
        "text/plain": new Blob(
            [htmlToCopy],
            { type: "text/plain" }
        ),
        "text/html": new Blob(
            [htmlToCopy],
            { type: "text/html" }
        ),
    });

    navigator.clipboard.write([clipboardItem]);

};


var copyElement = document.querySelector('.badge.badge-danger.note_info__counter').nextSibling;
copyElement.parentElement.insertBefore(copyButton, copyElement.nextSibling);
//////////////////////


/// REMOVE CREDITS BUTONLARI ///
if (agent_username === "menderesacarsoy") {
    var removecredits_button10 = document.createElement("button");
    removecredits_button10.setAttribute("remove-credits", "10");
    removecredits_button10.style.marginTop = "10px";
    removecredits_button10.style.display = "inline-block";
    removecredits_button10.textContent = "10";
    removeButtonAltiElement.appendChild(removecredits_button10);

    var removecredits_button20 = document.createElement("button");
    removecredits_button20.setAttribute("remove-credits", "20");
    removecredits_button20.style.marginTop = "10px";
    removecredits_button20.style.marginLeft = "10px";
    removecredits_button20.style.display = "inline-block";
    removecredits_button20.textContent = "20";
    removeButtonAltiElement.appendChild(removecredits_button20);

    var removecredits_button50 = document.createElement("button");
    removecredits_button50.setAttribute("remove-credits", "50");
    removecredits_button50.style.marginTop = "10px";
    removecredits_button50.style.marginLeft = "10px";
    removecredits_button50.style.display = "inline-block";
    removecredits_button50.textContent = "50";
    removeButtonAltiElement.appendChild(removecredits_button50);

    var removecredits_button100 = document.createElement("button");
    removecredits_button100.setAttribute("remove-credits", "100");
    removecredits_button100.style.marginTop = "10px";
    removecredits_button100.style.marginLeft = "10px";
    removecredits_button100.style.display = "inline-block";
    removecredits_button100.textContent = "100";
    removeButtonAltiElement.appendChild(removecredits_button100);

    var removecredits_button200 = document.createElement("button");
    removecredits_button200.setAttribute("remove-credits", "200");
    removecredits_button200.style.marginTop = "10px";
    removecredits_button200.style.marginLeft = "10px";
    removecredits_button200.style.display = "inline-block";
    removecredits_button200.textContent = "200";
    removeButtonAltiElement.appendChild(removecredits_button200);

    var removecredits_button500 = document.createElement("button");
    removecredits_button500.setAttribute("remove-credits", "500");
    removecredits_button500.style.marginTop = "10px";
    removecredits_button500.style.marginLeft = "10px";
    removecredits_button500.style.display = "inline-block";
    removecredits_button500.textContent = "500";
    removeButtonAltiElement.appendChild(removecredits_button500);

    var removecredits_button1000 = document.createElement("button");
    removecredits_button1000.setAttribute("remove-credits", "1000");
    removecredits_button1000.style.marginTop = "10px";
    removecredits_button1000.style.marginLeft = "10px";
    removecredits_button1000.style.display = "inline-block";
    removecredits_button1000.textContent = "1000";
    removeButtonAltiElement.appendChild(removecredits_button1000);


    [removecredits_button10, removecredits_button20, removecredits_button50, removecredits_button100, removecredits_button200, removecredits_button500, removecredits_button1000].forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();

            var removeCreditsValue = parseInt(button.getAttribute("remove-credits"), 10);

            if (amountInputElement.value) {
                amountInputElement.value = parseInt(amountInputElement.value, 10) + removeCreditsValue;
            } else {
                amountInputElement.value = removeCreditsValue;
            }

            transactiontTypeElement.value = "other";
            transactiontTypeElement.dispatchEvent(new Event("change"));
            bonusDescriptionElement.value = "x";
        });
    });
}
//////////////////////


// ****************************************************************************************************** //
if(!location.href.includes('lifetime')) {

    /// SON 2 GÜN --- SON 2 AY --- SON 3 AY --- SON 6 AY --- BU YIL EKLE ////
    var option_last2days = document.createElement("option");
    option_last2days.value = "last_two";
    option_last2days.text = "Last 2 Days";

    var yesterdayOption = document.querySelector("select[name='set_date_period'] option[value='yesterday']");
    yesterdayOption.parentNode.insertBefore(option_last2days, yesterdayOption.nextSibling);


    var option_last2mo = document.createElement("option");
    option_last2mo.value = "last_2months";
    option_last2mo.text = "Last 2 Months";

    var lastmonthOption = document.querySelector("select[name='set_date_period'] option[value='last_month']");
    lastmonthOption.parentNode.insertBefore(option_last2mo, lastmonthOption.nextSibling);


    var option_last3mo = document.createElement("option");
    option_last3mo.value = "last_3months";
    option_last3mo.text = "Last 3 Months";

    var last2monthsOption = document.querySelector("select[name='set_date_period'] option[value='last_2months']");
    last2monthsOption.parentNode.insertBefore(option_last3mo, last2monthsOption.nextSibling);


    var option_last6mo = document.createElement("option");
    option_last6mo.value = "last_6months";
    option_last6mo.text = "Last 6 Months";

    var last3monthsOption = document.querySelector("select[name='set_date_period'] option[value='last_3months']");
    last3monthsOption.parentNode.insertBefore(option_last6mo, last3monthsOption.nextSibling);


    var option_lastyear = document.createElement("option");
    option_lastyear.value = "this_year";
    option_lastyear.text = "This Year";

    var last6monthsOption = document.querySelector("select[name='set_date_period'] option[value='last_6months']");
    last6monthsOption.parentNode.insertBefore(option_lastyear, last6monthsOption.nextSibling);



    var sElement = document.querySelector("select[name='set_date_period']");

    sElement.addEventListener("change", function() {
        var selectedValue = sElement.value;
        if (selectedValue === "last_two") {
            window.location.replace(url.split("?")[0] + paramFromYesterday + paramTo);

        } else if (selectedValue === "this_year") {
            window.location.replace(url.split("?")[0] + "?from=" + date("01/01/" + year));

        } else if (selectedValue === "last_2months") {
            let currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - 2);
            currentDate.setDate(1);

            let d = currentDate.getDate();
            let m = currentDate.getMonth() + 1;
            let y = currentDate.getFullYear();

            d = d < 10 ? '0' + d : d;
            m = m < 10 ? '0' + m : m;

            let last3 = `${d}/${m}/${y}`;

            window.location.replace(url.split("?")[0] + "?from=" + date(last3));
        } else if (selectedValue === "last_3months") {
            let currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - 3);
            currentDate.setDate(1);

            let d = currentDate.getDate();
            let m = currentDate.getMonth() + 1;
            let y = currentDate.getFullYear();

            d = d < 10 ? '0' + d : d;
            m = m < 10 ? '0' + m : m;

            let last3 = `${d}/${m}/${y}`;

            window.location.replace(url.split("?")[0] + "?from=" + date(last3));
        } else if (selectedValue === "last_6months") {
            let currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - 6);
            currentDate.setDate(1);

            let d = currentDate.getDate();
            let m = currentDate.getMonth() + 1;
            let y = currentDate.getFullYear();

            d = d < 10 ? '0' + d : d;
            m = m < 10 ? '0' + m : m;

            let last3 = `${d}/${m}/${y}`;

            window.location.replace(url.split("?")[0] + "?from=" + date(last3));
        }
    });
    //////////////////////


    /// RISK LEVEL KONTROL ///
    if(risk_level === "Very High") {
        document.querySelectorAll("a[href*='goto/" + user_id + "']")[0].setAttribute("style","font-weight:bold;color:red");
    }

    if(risk_level === "High") {
        document.querySelectorAll("a[href*='goto/" + user_id + "']")[0].setAttribute("style","font-weight:bold;color:#e7736f");
    }

    if(risk_level === "V.I.P.") {
        document.querySelectorAll("a[href*='goto/" + user_id + "']")[0].setAttribute("style","font-weight:bold;color:purple");
    }

    if(risk_level === "Normal") {
        document.querySelectorAll("a[href*='goto/" + user_id + "']")[0].setAttribute("style","font-weight:bold;color:#f3a900");
    }
    //////////////////////////


    /// BAKİYE VE BONUS RENKLENDİRME ///
    if(balance > 10) {
        balanceElement.setAttribute("style","font-weight:bold;color:red");
        balanceElement.textContent = duzelt(balanceElement.textContent, false);
    }

    if(bonus > 10) {
        bonusElement.setAttribute("style","font-weight:bold;color:red");
        bonusElement.textContent = duzelt(bonusElement.textContent, true);
    }
    ////////////////////////////


    /// PAYMENT REPORTS VE WALLET TRANSACTIONS OTOMATİK AÇMA //
    document.getElementsByClassName("tools")[0].click();
    document.getElementsByClassName("tools")[1].click();
    ////////////////////////////////////////////////////



/// NOTLARI GÖSTER ///
    var ilkbonusnot = false;

    document.querySelectorAll(".portlet-title")[2].querySelector(".caption.title_top").innerText = "NOTES";

    var degisecekElement = document.querySelectorAll('.form-body .row .table.table-striped.table-bordered.table-hover')[0];
    degisecekElement.querySelector("thead").remove()
    degisecekElement.querySelector("tbody").remove()

    var turuncusayfa = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.page-title > h3 > i.fa.fa-sticky-note-o.note_info.font-yellow-casablanca");
    turuncusayfa.style.display = "none";

    var notesCountElement = document.querySelector('body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.page-title > h3 > span.badge.badge-danger.note_info__counter');
    notesCountElement.style.marginLeft = "15px";
    notesCountElement.style.fontWeight = "bold";

    var notesBottomElement = document.querySelector("#note");

    var headerNotesElement = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(2) > div:nth-child(2) > div > div.portlet-title > div");
    headerNotesElement.appendChild(notesCountElement);



//     const observerNotesCallback = function(mutationsList, observerNotes) {
//         for(let mutation of mutationsList) {

//             if (mutation.type === 'characterData' || mutation.type === 'childList') {
//                 notYukle();
//             }

//         }
//     };

//     const observerNotes = new MutationObserver(observerNotesCallback);

//     const cfgNotes = {
//         characterData: true,
//         subtree: true,
//         childList: true
//     };

//     observerNotes.observe(notesCountElement, cfgNotes);



var öncekiText = "All (0)";

setInterval(() => {
    var observerElement = document.querySelector("#note > div.portlet-body > div.mt-radio-inline > label:nth-child(1)");
    var mevcutText = observerElement.textContent.trim();
    //console.log('ÖNCEKİ: ', öncekiText);

    if (mevcutText !== öncekiText) {
        //console.warn('DEĞİŞTİ: ', mevcutText);
        öncekiText = mevcutText;
        console.log('Not sayısı:', notesCountElement.innerText);
        notYukle();
    }

}, 1000);



function notYukle() {
    document.querySelectorAll(".mt-radio")[0].querySelector("input").click();

    //var pages = document.querySelector("#pagination > ul");
    //var pagesCount = document.querySelectorAll("#pagination > ul > li").length;
    var notes = document.querySelector("ul.notes.feeds");

    degisecekElement.innerHTML = "";
    degisecekElement.append(notes);

    var notlar = notes.querySelectorAll("li");

    notlar.forEach(function(not) {

        if (not.style.display === "none") {not.style.display = "";}

        if (not.textContent.trim().toLowerCase().includes("deal") ||
            not.textContent.trim().toLowerCase().includes("değal") ||
            not.textContent.trim().toLowerCase().includes("%")
           ) {

            if (!ilkbonusnot) {
                not.style.borderStyle = "solid";
                not.style.borderColor = "red";
                ilkbonusnot = true;
            }

            not.querySelector("div.col1 > div > div.cont-col2 > div > span:nth-child(2)").style.color = "red";
            not.querySelector("div.col1 > div > div.cont-col2 > div > span:nth-child(2)").style.fontWeight = "bold";

        } else if (not.textContent.trim().toLowerCase().includes("bonus")) {

            not.querySelector("div.col1 > div > div.cont-col2 > div > span:nth-child(2)").style.color = "red";
            not.querySelector("div.col1 > div > div.cont-col2 > div > span:nth-child(2)").style.fontWeight = "bold";
        }

    });
}


notesBottomElement.style.visibility = "hidden";
//////////////////////



    /// LIFETIME SAYFASI ///
//     var kayitTarihi = "";
//     var lifetimeYatirim = "";
//     var lifetimeCekim = "";
//     var lifetimeFark = "";

//     source = 'https://bo.bo-2222eos-gbxc.com/player/financial/' + user_id + '/lifetime';

//     veriCek(source, function(responseText) {
//         var tempDiv = document.createElement('div');
//         tempDiv.innerHTML = responseText;

//         kayitTarihi = tempDiv.querySelector("div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(1) > div:nth-child(2) > div > div.portlet-body > table > tbody > tr > td").innerText;
//         lifetimeYatirim = tempDiv.querySelector("div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(2) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerText;
//         lifetimeCekim = tempDiv.querySelector("div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(2) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(2) > td:nth-child(6)").innerText;
//         lifetimeFark = parseInt(lifetimeYatirim) - parseInt(lifetimeCekim);
//         //console.log(lifetimeYatirim + " - " + lifetimeCekim);


// //     //-------------------- LIFETIME YATIRIM VE ÇEKİM ------------------------------------------- // @BERK
//             var brElement_lifetime_1 = document.createElement("br");
//             var brElement_lifetime_2 = document.createElement("br");
//             var brElement_lifetime_3 = document.createElement("br");
//             var brElement_lifetime_4 = document.createElement("br");
//             var brElement_lifetime_5 = document.createElement("br");
//             var brElement_lifetime_6 = document.createElement("br");

//             var newspanElement_lifetimeYatirim = document.createElement("span");
//             newspanElement_lifetimeYatirim.setAttribute("style", "font-weight: bold; color: darkgreen; font-size: 14px");
//             newspanElement_lifetimeYatirim.textContent = "Lifetime Yatırım: " + duzelt(lifetimeYatirim);
//             addButtonAltiElement.appendChild(brElement_lifetime_1);
//             addButtonAltiElement.appendChild(brElement_lifetime_2);
//             addButtonAltiElement.appendChild(newspanElement_lifetimeYatirim);

//             var newspanElement_lifetimeCekim = document.createElement("span");
//             newspanElement_lifetimeCekim.setAttribute("style", "font-weight: bold; color: red; font-size: 14px");
//             newspanElement_lifetimeCekim.textContent = "Lifetime Çekim: " + duzelt(lifetimeCekim);
//             addButtonAltiElement.appendChild(brElement_lifetime_3);
//             addButtonAltiElement.appendChild(brElement_lifetime_4);
//             addButtonAltiElement.appendChild(newspanElement_lifetimeCekim);

//             var newspanElement_lifetimeFark = document.createElement("span");
//             newspanElement_lifetimeFark.setAttribute("style", "font-weight: bold; color: darkblue; font-size: 14px");
//             newspanElement_lifetimeFark.textContent = "Lifetime Fark: " + duzelt(lifetimeFark);
//             addButtonAltiElement.appendChild(brElement_lifetime_5);
//             addButtonAltiElement.appendChild(brElement_lifetime_6);
//             addButtonAltiElement.appendChild(newspanElement_lifetimeFark);
// //     //------------------------------------------------------------------------------------



//         //------------ YENİ ÜYE KONTROLÜ --------------- //
//         var kayitTarihiElement = document.querySelector('body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.page-title > h3 > small > b');
//         //var brElement_kayitTarihi_1 = document.createElement('br');
//         //kayitTarihiElement.parentNode.insertBefore(brElement_kayitTarihi_1, kayitTarihiElement.nextSibling);

//         var spanElement_kayitTarihi_1 = document.createElement('span');
//         spanElement_kayitTarihi_1.setAttribute("style", "padding-left: 20px");

//         var boldElement_kayitTarihi_1 = document.createElement('b');

//         var newspanElement_kayitTarihi = document.createElement('span');
//         newspanElement_kayitTarihi.setAttribute("style", "font-weight: bold; color: red; font-size: 14px");
//         newspanElement_kayitTarihi.classList.add("blink");

//         spanElement_kayitTarihi_1.textContent = "Kayıt Tarihi: ";
//         boldElement_kayitTarihi_1.innerHTML = "<a href='https://bo.bo-2222eos-gbxc.com/player/financial/" + user_id + "?from=" + date(kayitTarihi) + "' style='color:black'><u>" + kayitTarihi + "</u></a>";
//         spanElement_kayitTarihi_1.appendChild(boldElement_kayitTarihi_1);

//         var today = year + "-" + String(month).padStart(2, '0') + "-" + String(day).padStart(2, '0');
//         var yesterday = year + "-" + String(month).padStart(2, '0') + "-" + String(yday).padStart(2, '0');
//         var kayitTarihi2 = kayitTarihi.split("/")[2] + "-" + kayitTarihi.split("/")[1] + "-" + kayitTarihi.split("/")[0]

//         var kayitTarihi3 = new Date(kayitTarihi2);
//         var todayX = new Date(today);
//         var farkX = todayX.getTime() - kayitTarihi3.getTime();
//         var farkXX = farkX / (1000 * 3600 * 24);

//         //console.log(today);
//         //console.log(yesterday);
//         //console.log(kayitTarihi2);
//         //console.log(farkXX);

//         if(kayitTarihi2 === today) {
//             newspanElement_kayitTarihi.textContent = " BUGÜN";
//             console.log("Bugün kayıt olmuş!");
//         } else if(kayitTarihi2 === yesterday) {
//             newspanElement_kayitTarihi.textContent = " DÜN";
//             console.log("Dün kayıt olmuş!");
//         } else if (farkXX <= 7) {
//             newspanElement_kayitTarihi.textContent = " NEW";
//             console.log("Yeni kayıt!");
//         }

//         spanElement_kayitTarihi_1.appendChild(newspanElement_kayitTarihi);
//         kayitTarihiElement.parentNode.insertBefore(spanElement_kayitTarihi_1, kayitTarihiElement.nextSibling);
//     });
    //---------------------------------------------------------------------------------

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// ÖZEL BİLGİLENDİRME ///
    var infoElement = "";

    //------------ ÜYE TİPİ --------------- //
    var sporElement = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(4) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(2) > td:nth-child(2)");
    var slotElement = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(4) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(3) > td:nth-child(2)");
    var canliElement = document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.financial > div.portlet.light.bordered > div.portlet-body.form > div > div:nth-child(4) > div > div > div.portlet-body > div > table > tbody > tr:nth-child(4) > td:nth-child(2)");

    var spor = sporElement ? parseInt(sporElement.innerText) : 0;
    var slot = slotElement ? parseInt(slotElement.innerText) : 0;
    var canli = canliElement ? parseInt(canliElement.innerText) : 0;

    if (spor > 0 && slot === 0 && canli === 0) {
        console.log ("Üye türü: Sporcu")
        user_type = "Sporcu";
    } else if (slot > 0 && spor === 0 & canli === 0) {
        console.log ("Üye türü: Slotçu")
        user_type = "Slotçu";
    } else if (canli > 0 && spor === 0 & slot === 0) {
        console.log("Üye türü: Canlı Casinocu")
        user_type = "Canlı Casinocu";
    } else if (slot > 0 && canli > 0 && spor === 0) {
        console.log("Üye türü: Slot & Canlı Karışık")
        user_type = "Slot & Canlı Karışık";
    } else if (spor > 0 && slot > 0 || canli > 0) {
        console.log("Üye türü: Spor & Casino Karışık")
        user_type = "Spor & Casino Karışık";
    } else if (spor === 0 && slot === 0 && canli === 0) {
        console.log("Üye türü: Bilinmiyor")
        user_type = "Bilinmiyor";
    }
    //---------------------------------------------------------------------------------

    function infoGuncelle() {
        infoElement = document.querySelector("#DataTables_Table_1 > thead > tr:nth-child(1) > th:nth-child(1)");

        if (infoElement) {
            infoElement.removeAttribute("class");
            infoElement.setAttribute("class","text-right");
            infoElement.innerText = user_type + " | Bakiye: " + duzelt(balance, false);

            //             if (balance >= 50) {
            //               toplamKayip = toplamKayip - balance;
            //             }

            if (toplamKayip > 0) {
                infoElement.innerText += "\nYatırım: " + duzelt(toplamYatirimTutar, false) + " | Çekim: " + duzelt(toplamCekimTutar, false) + " | Kayıp: " + duzelt(toplamKayip, false);
            } else if (toplamKayip < 0) {
                infoElement.innerText += "\nYatırım: " + duzelt(toplamYatirimTutar, false) + " | Çekim: " + duzelt(toplamCekimTutar, false) + " | " + duzelt(Math.abs(toplamKayip), false) + " TL kârda!";
            } else if (toplamKayip === 0) {
                infoElement.innerText += "\nYatırım: " + duzelt(toplamYatirimTutar, false) + " | Çekim: " + duzelt(toplamCekimTutar, false) + " | Kayıp: YOK";
            }
        }
    }

    infoGuncelle();
    ///////////////////////////////////////////////////////////////////////////////////


    /// AÇIK KUPON KONTROL ///
    var open_bets = 0;
    source = 'https://bo.bo-2222eos-gbxc.com/player/bets/' + user_id;

    veriCek(source, function(responseText) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = responseText;

        open_bets =tempDiv.querySelector('.table-event-info tbody tr:first-child td:nth-child(2)').textContent.trim()
        console.log("Açık kupon: " + open_bets);
        kuponkt = true;

        var brElement_openBets_1 = document.createElement("br");
        var brElement_openBets_2 = document.createElement("br");
        var newspanElement_openBets = document.createElement("span");

        newspanElement_openBets.setAttribute("style", "font-weight: bold; color: red; font-size: 24px");
        newspanElement_openBets.classList.add("blink");
        newspanElement_openBets.textContent = open_bets + " tane açık kuponu var!";

        if(open_bets >= 1) {
            addButtonAltiElement.appendChild(brElement_openBets_1);
            addButtonAltiElement.appendChild(brElement_openBets_2);
            addButtonAltiElement.appendChild(newspanElement_openBets);
            infoElement.innerText += "\n" + open_bets + " tane açık kuponu var!";
        }
    });
    //////////////////////////////////////////


    /// TABLOLARDA 200 SATIR GÖSTERME ///
    var selectElement = document.querySelector('select[name="DataTables_Table_1_length"]');
    var optionElement = selectElement.querySelector('option[value="200"]');

    setTimeout(function() {
        selectElement.value = "200";
        var event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
    }, 333);

    infoGuncelle();
    ///////////////////////////////////////////



    /// REMOVE CREDTIS GİZLE ///
    var parentElement = document.getElementById("DataTables_Table_1_length");

    var checkboxRC = document.createElement("input");
    checkboxRC.setAttribute("type", "checkbox");
    checkboxRC.setAttribute("id", "checkboxRemoveCredits");
    checkboxRC.style.width = "15px";
    checkboxRC.style.height = "15px";
    checkboxRC.style.marginLeft = "10px";
    checkboxRC.style.display = "none";

    var labelRC = document.createElement("label");
    labelRC.setAttribute("for", "checkboxRemoveCredits");
    labelRC.setAttribute("id", "labelRemoveCredits")
    labelRC.textContent = "Remove Credits Gizle";
    labelRC.style.fontFamily = "Calibri";
    labelRC.style.fontSize = "16px";
    labelRC.style.marginLeft = "3px";
    labelRC.style.display = "none";


    parentElement.appendChild(checkboxRC);
    parentElement.appendChild(labelRC);

    // ----------------------------------

    var checkBoxElement = document.getElementById("checkboxRemoveCredits");

    checkBoxElement.addEventListener("change", function() {
        var rows = document.querySelectorAll("#DataTables_Table_1 tbody tr:not([style*='background-color: black'])");

        rows.forEach(function(row) {
            var td = row.querySelector("td:nth-child(2)");

            if (checkboxRC.checked &&
                td.innerText.trim() === "Remove Credits"
               ) {
                row.style.display = "none";

            } else if (!checkboxRC.checked &&
                       td.innerText.trim() === "Remove Credits"
                      ) {
                row.style.display = "";
            }
        });
    });
    ///////////////////////////////////



    /// TABLODAKİ GİZLİ ELEMANLARI GÖSTER ///
    var parentElement2 = document.getElementById("DataTables_Table_1_length");

    var checkboxHide = document.createElement("input");
    checkboxHide.setAttribute("type", "checkbox");
    checkboxHide.setAttribute("id", "checkboxHides");
    checkboxHide.style.width = "15px";
    checkboxHide.style.height = "15px";
    checkboxHide.style.marginLeft = "10px";
    checkboxHide.style.display = "none";

    var labelHide = document.createElement("label");
    labelHide.setAttribute("for", "checkboxHides");
    labelHide.setAttribute("id", "labelHides")
    labelHide.textContent = "Gizlenenleri Göster";
    labelHide.style.fontFamily = "Calibri";
    labelHide.style.fontSize = "16px";
    labelHide.style.marginLeft = "3px";
    labelHide.style.display = "none";


    parentElement2.appendChild(checkboxHide);
    parentElement2.appendChild(labelHide);

    // ----------------------------------

    var checkBoxElement2 = document.getElementById("checkboxHides");

    checkBoxElement2.addEventListener("change", function() {
        var rows2 = document.querySelectorAll("#DataTables_Table_1 tbody tr:not([style*='background-color: black'])");

        rows2.forEach(function(row2) {
            var td2 = row2.querySelector("td:nth-child(2)");

            if (checkboxHide.checked &&
                td2.innerText.trim() === "WonBet" ||
                td2.innerText.trim() === "Cashout" ||
                td2.innerText.trim() === "RollbackBet" ||
                td2.innerText.trim() === "Deposit (Request)" ||
                td2.innerText.trim() === "Deposit (Cancel)" ||
                td2.innerText.trim() === "Withdraw (Request)"
               ) {
                row2.style.display = "";

            } else if (!checkboxHide.checked) {
                var trigger = document.querySelector("#DataTables_Table_1 tbody");
                var newRow = document.createElement('tr');
                newRow.innerHTML = "<td colspan='12'></td>";
                tableTransactionsElement.appendChild(newRow);
                tableTransactionsElement.removeChild(newRow);
            }
        });
    });
    ///////////////////////////////////




    ///// WALLET TRANSACTIONS TABLOSU///////
    document.querySelector("#DataTables_Table_1").classList.remove("table-hover");

    var source = "";

    var tableTransactionsElement = document.querySelector("#DataTables_Table_1 tbody");

    var observerTransactions = new MutationObserver(function(mutationsList, observer) {

        if (selectElement.value === "200") {

            var rowsTransactions = document.querySelectorAll("#DataTables_Table_1 tbody tr:not([style*='display: none']):not([style*='background-color: black'])");

            if (rowsTransactions[0].querySelector("td:nth-child(3)")) {

                var kt = rowsTransactions[0].querySelector("td:nth-child(3)").textContent.substring(0, 2);;
                let onceki = null;
                var depID = 0;
                var cekID = 0;

                rowsTransactions.forEach(function(rowTransactions) {

                    var type = rowTransactions.querySelector("td:nth-child(2)");
                    var islem = type.innerText.trim();


                    ///// TABLODA 2 GÜN ARASINA ÇİZGİ KOY ///////////////
                    if (!aynigun) {
                        if (onceki !== null) {

                            var tarih = rowTransactions.cells[2].textContent.substring(0, 2);

                            if (tarih !== kt) {

                                observerTransactions.disconnect();

                                if (!onceki.nextElementSibling.querySelector("td[colspan='11']") &&
                                    onceki.style.display !== "none" &&
                                    islem !== "Deposit (Cancel)" &&
                                    islem !== "Deposit (Request)" &&
                                    islem !== "WonBet" &&
                                    islem !== "Cashout") {

                                    var tarihayrac = document.createElement("tr");
                                    tarihayrac.setAttribute("style", "background-color: black");
                                    tarihayrac.innerHTML = "<td></td><td colspan='11'></td>";
                                    rowTransactions.parentNode.insertBefore(tarihayrac, onceki.nextSibling);
                                }

                                kt = tarih;
                                observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);
                            }


                        }

                        onceki = rowTransactions;
                    }
                    /////////////////////////////////////////////////////////////////


                    var tabloTarih = rowTransactions.cells[2];
                    var mainEksi = rowTransactions.cells[5];
                    var mainArti = rowTransactions.cells[6];
                    var mainFinal = rowTransactions.cells[7];
                    var bonusEksi = rowTransactions.cells[8];
                    var bonusArti = rowTransactions.cells[9];
                    var bonusFinal = rowTransactions.cells[10];

                    var aciklama = "";
                    var cekimID = "";
                    var betID = "";

                    switch (islem) {
                        case "Deposit (OK)":
                        case "Deposit (Manual)":
                            rowTransactions.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
                            mainArti.style.textDecoration = 'underline';

                            observerTransactions.disconnect();
                            tabloTarih.innerHTML = "<a href='https://bo.bo-2222eos-gbxc.com/player/financial/" + user_id + "?from=" + date(tabloTarih.textContent) + "' style='color:black'><u>" + tabloTarih.textContent + "</u></a>";
                            observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);

                            //----------------- BONUS OTOMATİK HESAPLA -----------------
                            var tutar = 0;
                            var bonusOran = 0;
                            var bonusTutar = 0;
                            var bonusTuru = "";
                            var bonusAmount = 0;
                            var targetAmount = 0;
                            var carpan = 0;
                            var minOdd = 0;
                            var description = "";


                            //observerTransactions.disconnect();

                            var mainEksi_cbox = rowTransactions.cells[5];
                            mainEksi_cbox.classList.remove("text-right");
                            mainEksi_cbox.classList.add("text-center");
                            if (!mainEksi_cbox.querySelector('input[type="checkbox"]')) {
                                var checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.style.transform = 'scale(1.5)';

                                depID = depID+1;
                                checkbox.id = depID;
                                checkbox.classList.add("deposit");
                                checkbox.setAttribute('data-deposit-amount', parseInt(duzelt(mainArti.textContent.trim(), false).replace(".","")));
                                mainEksi_cbox.appendChild(checkbox);
                            }

                            //observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);

                            var mainArti_click = rowTransactions.cells[6];
                            mainArti_click.textContent = duzelt(mainArti_click.textContent.trim(), false);
                            mainArti_click.style.cursor = "pointer";

                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            if (!mainArti_click.dataset.listenerAdded) {

                                mainArti_click.addEventListener("click", function() {
                                    if (gunsonuAktif) {return;}

                                    var depAmount = parseInt(mainArti_click.textContent.trim().replace(".",""));
                                    oran = prompt("Bonus oranı? (%):", "");

                                    if (oran === "slot" || oran === "st") {
                                        bonusTutar = (depAmount * 25) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "slot";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "slot 30" || oran === "st 30" || oran === "sfd" || oran === "hgs") {
                                        bonusTutar = (depAmount * 30) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "slot 30 first dep";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "slot 100" || oran === "st 100" || oran === "hgs 100") {
                                        bonusTutar = (depAmount * 100) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "slot 100 first dep";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "cc") {
                                        bonusTutar = (depAmount * 10) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "cc";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "spor" || oran === "sr") {
                                        bonusTutar = (depAmount * 20) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "spor";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "vegas" || oran === "vg") {
                                        bonusTutar = (depAmount * 50) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "vegas";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "dc" || oran === "dsc") {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        bonusTutar = (depAmount * 25) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "dc";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "dc 30" || oran === "dfd" || oran === "dcfd" || oran === "dscfd") {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        bonusTutar = (depAmount * 30) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "dc 30 first dep";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "dgs" || oran === "dcgs" || oran === "dscgs") {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        bonusTutar = (depAmount * 25) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "dc gün sonu";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "dc20" || oran === "dc 20" || oran === "dca") {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        bonusTutar = (depAmount * 20) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "dc 20";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "gdc" || oran === "dcg" || oran === "gece dc" || oran === "dc gece") {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        bonusTutar = (depAmount * 30) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "dc gece";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "dc cc" || oran === "cc dc" ) {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        if (gun === "cumartesi" || gun === "pazar") {
                                            bonusTutar = (depAmount * 20) / 100;
                                        } else {
                                            bonusTutar = (depAmount * 15) / 100;
                                        }

                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "dc cc";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "mpay slot" || oran === "slot mpay" || oran === "mslot" || oran === "slotm") {
                                        bonusTutar = (depAmount * 30) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "mpay slot %30";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "mpay spor" || oran === "spor mpay" || oran === "mspor" || oran === "sporm") {
                                        bonusTutar = (depAmount * 25) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "mpay spor %25";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "mpay dc" || oran === "dc mpay" || oran === "mdc" || oran === "dcm") {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        bonusTutar = (depAmount * 30) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "mpay dc %30";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "gece slot" || oran === "slot gece" || oran === "gslot" || oran === "slotg") {
                                        bonusTutar = (depAmount * 30) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "gece slot";
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran === "slot pazar" || oran === "pazar slot" || oran === "pslot" || oran === "slotp") {
                                        var bns = "";
                                        if (depAmount <= 3999) {
                                            bonusTutar = (depAmount * 30) / 100;
                                            bns = "30";
                                        } else if (depAmount >= 4000 && depAmount <= 9999) {
                                            bonusTutar = (depAmount * 35) / 100;
                                            bns = "35";
                                        } else if (depAmount >= 10000) {
                                            bonusTutar = (depAmount * 40) / 100;
                                            bns = "40";
                                        }

                                        amountInputElement.value = Math.floor(bonusTutar);
                                        bonusDescriptionElement.value = "slot " + bns + " " + gun;
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran !== null && oran !== "" && oran.startsWith("deal ") || oran.startsWith("d ")) {
                                        bonusOran = oran.split(" ")[1];
                                        bonusTutar = (depAmount * bonusOran) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);

                                        bonusDescriptionElement.value = oran.replace("d ", "deal ");
                                        transactiontTypeElement.value = "bonus";

                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});

                                    } else if (oran !== null && oran !== "" && oran.startsWith("dc deal ") || oran.startsWith("dcd ")) {
                                        if (balance >= 20) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        } else if (balance >= (depAmount * 5) / 100) {
                                            alertify.alert('HATA', 'Bakiye mevcut!');
                                            return;
                                        }

                                        if (oran.startsWith("dc deal")) {
                                            bonusOran = oran.split(" ")[2];
                                            bonusDescriptionElement.value = oran;
                                        } else {
                                            bonusOran = oran.split(" ")[1];
                                            bonusDescriptionElement.value = oran.replace("dcd ", "dc deal ");
                                        }

                                        bonusTutar = (depAmount * bonusOran) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        transactiontTypeElement.value = "bonus";

                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});



                                        // ÖRNEK:   =500 dc / dsc
                                        // ÖRNEK:   =500 dgs / dcgs / dscgs
                                        // ÖRNEK:   =500 mdc / dcm
                                        // ÖRNEK:   =500 dcd 25
                                    } else if (oran !== null && oran !== "" && oran.startsWith("=")) {
                                        //bonusTutar = oran.split("-")[0].replace("=", "");
                                        //bonusDescriptionElement.value = oran.split("-")[1];

                                        bonusTutar = oran.split(" ")[0].replace("=", "").replace(".", "");
                                        amountInputElement.value = Math.floor(bonusTutar);

                                        bonusDescriptionElement.value = oran.split(" ").slice(1).join(" ")
                                            .replace("dc20", "dc 20")
                                            .replace("dca", "dc 20")
                                            .replace("dgs", "dc gün sonu")
                                            .replace("dcgs", "dc gün sonu")
                                            .replace("dscgs", "dc gün sonu")
                                            .replace("mdc", "mpay dc %30")
                                            .replace("dcm", "mpay dc %30")
                                            .replace("dcd", "dc deal");
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});



                                        // ÖRNEK:   !1200 dc / dsc
                                        // ÖRNEK:   !1200 dc20 / dca
                                        // ÖRNEK:   !1200 dgs / dcgs / dscgs
                                        // ÖRNEK:   !1200 mdc / dcm
                                        // ÖRNEK:   !1200 dcd 25
                                    } else if (oran !== null && oran !== "" && oran.startsWith("!")) {
                                        //tutar = oran.split("-")[0].replace("!", "").replace(".", "");
                                        //bonusOran = oran.split("-")[1].replace("%", "");
                                        //bonusTutar = (tutar * bonusOran) / 100;
                                        //amountInputElement.value = Math.floor(bonusTutar);
                                        //bonusDescriptionElement.value = oran.split("-")[2];
                                        //transactiontTypeElement.value = "bonus";

                                        tutar = oran.split(" ")[0].replace("!", "").replace(".", "");
                                        bonusTuru = oran.split(" ").slice(1).join(" ");

                                        if (bonusTuru === "dc" || bonusTuru === "dsc") {
                                            bonusTutar = (tutar * 25) / 100;
                                            amountInputElement.value = Math.floor(bonusTutar);

                                            bonusDescriptionElement.value = "dc";
                                            transactiontTypeElement.value = "bonus";

                                        } else if (bonusTuru === "dc20" || bonusTuru === "dca") {
                                            bonusTutar = (tutar * 20) / 100;
                                            amountInputElement.value = Math.floor(bonusTutar);

                                            bonusDescriptionElement.value = "dc20";
                                            transactiontTypeElement.value = "bonus";

                                        } else if (bonusTuru === "dgs" || bonusTuru === "dcgs" || bonusTuru === "dscgs") {
                                            bonusTutar = (tutar * 25) / 100;
                                            amountInputElement.value = Math.floor(bonusTutar);

                                            bonusDescriptionElement.value = "dc gün sonu";
                                            transactiontTypeElement.value = "bonus";

                                        } else if (bonusTuru === "mdc" || bonusTuru === "dcm" ) {
                                            bonusTutar = (tutar * 30) / 100;
                                            amountInputElement.value = Math.floor(bonusTutar);

                                            bonusDescriptionElement.value = "mpay dc %30";
                                            transactiontTypeElement.value = "bonus";

                                        } else if (bonusTuru.startsWith("dcd ") || bonusTuru.startsWith("dc deal ")) {
                                            bonusOran = bonusTuru.split(" ").pop();
                                            bonusTutar = (tutar * bonusOran) / 100;
                                            amountInputElement.value = Math.floor(bonusTutar);

                                            bonusDescriptionElement.value = bonusTuru.replace("dcd", "dc deal");
                                            transactiontTypeElement.value = "bonus";

                                        }

                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});



                                        // ÖRNEK:   *dc mdc
                                    } else if (oran !== null && oran !== "" && oran.startsWith("*")) {
                                        var yanlisbonus = oran.replace("*", "").trim().split(" ")[0];
                                        var yanlisbonusOran = 0;
                                        var yanlisTutar = 0;
                                        var dogrubonus = oran.replace("*", "").trim().split(" ")[1];;
                                        var dogrubonusOran = 0;
                                        var dogruTutar = 0;
                                        var dogruAciklama = "";
                                        var fark = 0;


                                        if (yanlisbonus === "dc20" || yanlisbonus === "dca") {yanlisbonusOran = 20; yanlisTutar = (depAmount * yanlisbonusOran) / 100;}
                                        else if (yanlisbonus === "dc" || yanlisbonus === "dsc") {yanlisbonusOran = 25; yanlisTutar = (depAmount * yanlisbonusOran) / 100;}
                                        else if (yanlisbonus === "slot" || yanlisbonus === "st") {yanlisbonusOran = 25; yanlisTutar = (depAmount * yanlisbonusOran) / 100;}
                                        else if (yanlisbonus === "spor" || yanlisbonus === "sr") {yanlisbonusOran = 20; yanlisTutar = (depAmount * yanlisbonusOran) / 100;}
                                        else if (yanlisbonus.startsWith("dcd")) {yanlisbonusOran = parseInt(yanlisbonus.replace("dcd", "")); yanlisTutar = (depAmount * yanlisbonusOran) / 100;}
                                        else if (yanlisbonus.startsWith("d")) {yanlisbonusOran = parseInt(yanlisbonus.replace("d", "")); yanlisTutar = (depAmount * yanlisbonusOran) / 100;}
                                        else if (yanlisbonus === "pslot" || yanlisbonus === "slotp")
                                        {
                                            if (depAmount <= 3999) {
                                                yanlisbonusOran = 30;
                                                yanlisTutar = (depAmount * yanlisbonusOran) / 100;
                                            } else if (depAmount >= 4000 && depAmount <= 9999) {
                                                yanlisbonusOran = 35;
                                                yanlisTutar = (depAmount * yanlisbonusOran) / 100;
                                            } else if (depAmount >= 10000) {
                                                yanlisbonusOran = 40;
                                                yanlisTutar = (depAmount * yanlisbonusOran) / 100;
                                            }
                                        }


                                        if (dogrubonus === "sfd" || dogrubonus === "slot30" || dogrubonus === "hgs") {dogrubonusOran = 30; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "slot 30 first dep";}
                                        else if (dogrubonus === "slot100" || dogrubonus === "hgs100") {dogrubonusOran = 100; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "slot 100 first dep";}
                                        else if (dogrubonus === "mslot" || dogrubonus === "slotm") {dogrubonusOran = 30; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "mpay slot";}
                                        else if (dogrubonus === "mspor" || dogrubonus === "sporm") {dogrubonusOran = 25; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "mpay spor";}
                                        else if (dogrubonus === "gslot" || dogrubonus === "slotg") {dogrubonusOran = 30; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "gece slot";}
                                        else if (dogrubonus === "vegas" || dogrubonus === "vg") {dogrubonusOran = 50; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "vegas";}
                                        else if (dogrubonus === "slot" || dogrubonus === "st") {dogrubonusOran = 25; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "slot";}
                                        else if (dogrubonus === "dc" || dogrubonus === "dsc") {dogrubonusOran = 25; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "dc";}
                                        else if (dogrubonus === "mdc" || dogrubonus === "dcm") {dogrubonusOran = 30; dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = "mpay dc";}
                                        else if (dogrubonus.startsWith("dcd")) {dogrubonusOran = parseInt(dogrubonus.replace("dcd", "")); dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = dogrubonus.replace("dcd", "dc deal ");}
                                        else if (dogrubonus.startsWith("d")) {dogrubonusOran = parseInt(dogrubonus.replace("d", "")); dogruTutar = (depAmount * dogrubonusOran) / 100; dogruAciklama = dogrubonus.replace("d", "deal ");}
                                        else if (dogrubonus === "pslot" || dogrubonus === "slotp")
                                        {
                                            if (depAmount <= 3999) {
                                                dogrubonusOran = 30;
                                                dogruTutar = (depAmount * dogrubonusOran) / 100;
                                                dogruAciklama = "slot " + dogrubonusOran + " " + gun;

                                            } else if (depAmount >= 4000 && depAmount <= 9999) {
                                                dogrubonusOran = 35;
                                                dogruTutar = (depAmount * dogrubonusOran) / 100;
                                                dogruAciklama = "slot " + dogrubonusOran + " " + gun;

                                            } else if (depAmount >= 10000) {
                                                dogrubonusOran = 40;
                                                dogruTutar = (depAmount * dogrubonusOran) / 100;
                                                dogruAciklama = "slot " + dogrubonusOran + " " + gun;
                                            }
                                        }

                                        fark = dogruTutar - yanlisTutar;

                                        if (dogrubonus === yanlisbonus) {alert("Yanlış bonus ile doğru bonus aynı olamaz!"); return;}
                                        else if (dogrubonusOran < yanlisbonusOran || dogruTutar < yanlisTutar) {alert("Doğru bonus, yanlış bonustan daha az olamaz! "); return;}
                                        else if (dogrubonusOran === yanlisbonusOran)
                                        {
                                            amountInputElement.value = "0.01";
                                            bonusDescriptionElement.value = dogruAciklama;
                                            transactiontTypeElement.value = "other";
                                            transactiontTypeElement.dispatchEvent(new Event("change"));
                                            window.scrollTo({top: 0, behavior: 'smooth'});
                                        }
                                        else if (dogruTutar > yanlisTutar)
                                        {
                                            amountInputElement.value = fark;
                                            bonusDescriptionElement.value = dogruAciklama + " / düzeltme";
                                            transactiontTypeElement.value = "bonus";
                                            transactiontTypeElement.dispatchEvent(new Event("change"));
                                            window.scrollTo({top: 0, behavior: 'smooth'});

                                            //alert("Yanlış bonus oranı: %" + yanlisbonusOran + " oran üzerinden " + yanlisTutar + " TL yüklenmiştir\n" +
                                            //"Doğru bonus oranı: %" + dogrubonusOran + " oran üzerinden " + dogruTutar + " TL yüklenmesi gerekiyor\n" +
                                            //"Aradaki fark: " + fark + " TL");
                                        }


                                    } else if (oran !== null && oran !== "" && oran.startsWith("%")) {
                                        bonusOran = parseInt(oran.split(" ")[0].replace("%", ""));
                                        bonusAmount = Math.floor((depAmount * bonusOran) / 100);

                                        if (oran.split(" ")[1].includes("x") || oran.split(" ")[1].includes("X")) {
                                            carpan = parseInt(oran.split(" ")[1].replace("x", "").replace("X", ""));
                                            targetAmount = bonusAmount * carpan;

                                            minOdd = oran.split(" ")[2].replace(",", ".");

                                        } else {
                                            carpan = parseInt(oran.split(" ")[2].replace("x", "").replace("X", ""));
                                            targetAmount = bonusAmount * carpan;

                                            minOdd = oran.split(" ")[1].replace(",", ".");
                                        }


                                        description = oran.replace("%","%25").replace(" ","%20");
                                        window.open("https://bo.bo-2222eos-gbxc.com/player/bonus/" + user_id +
                                                    "?bonusAmount=" + String(bonusAmount) + "&targetAmount=" + String(targetAmount) + "&minOdd=" + minOdd + "&description=" + description, '_blank').focus();



                                    } else if (oran !== null && oran !== "" && oran === "spor 40" || oran === "çspor" || oran === "sporç") {
                                        bonusAmount = Math.floor((depAmount * 40) / 100);
                                        targetAmount = bonusAmount * 10;
                                        description = "spor%2040";
                                        window.open("https://bo.bo-2222eos-gbxc.com/player/bonus/" + user_id +
                                                    "?bonusAmount=" + String(bonusAmount) + "&targetAmount=" + String(targetAmount) + "&minOdd=1.95&description=" + description, '_blank').focus();


                                    } else if (oran !== null && oran !== "" && oran === "spor 100" || oran === "hg spor") {
                                        bonusAmount = Math.floor((depAmount * 100) / 100);
                                        targetAmount = bonusAmount * 10;
                                        description = "spor%20100%20first%20dep";
                                        window.open("https://bo.bo-2222eos-gbxc.com/player/bonus/" + user_id +
                                                    "?bonusAmount=" + String(bonusAmount) + "&targetAmount=" + String(targetAmount) + "&minOdd=1.90&description=" + description, '_blank').focus();


                                    } else if (oran !== null && oran !== "" && !isNaN(oran) && oran <= 100) {
                                        bonusTutar = (depAmount * parseInt(oran)) / 100;
                                        amountInputElement.value = Math.floor(bonusTutar);
                                        transactiontTypeElement.value = "bonus";
                                        transactiontTypeElement.dispatchEvent(new Event("change"));
                                        amountInputElement.dispatchEvent(new Event("input"));
                                        addButtonElement.classList.remove("green-meadow");
                                        addButtonElement.classList.add("purple");
                                        window.scrollTo({top: 0, behavior: 'smooth'});
                                    }

                                });

                                mainArti_click.dataset.listenerAdded = "true";
                            }
                            ///////////////////////////////////////////////////////////////////////////
                            break;

                        case "Withdraw (OK)":
                            rowTransactions.style.backgroundColor = "rgba(255, 0, 0, 0.2)";

                            mainEksi.textContent = duzelt(mainEksi.textContent.trim(), false);
                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            /// ÇEKİM TUTAR DÜZELTME ///
                            aciklama = rowTransactions.cells[11].innerText.trim();
                            cekimID = aciklama.substring(aciklama.indexOf("Payment ID:") + 12).split(',')[0];
                            withdrawID.add(cekimID);

                            if (!rowTransactions.dataset.listenerAdded) {

                                source = 'https://bo.bo-2222eos-gbxc.com/reports/payments/paymentInfo/' + cekimID;

                                veriCek(source, function(responseText) {
                                    var tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = responseText;

                                    var cekimTutar = tempDiv.querySelector('div > div.portlet.light.bordered > div > div > div:nth-child(3) > div > div.detail > ul > li > div.desc').textContent.trim();

                                    var mainEksi_cekim = rowTransactions.cells[5];
                                    mainEksi_cekim.innerText = cekimTutar;

                                    var mainArti_cbox = rowTransactions.cells[6];
                                    mainArti_cbox.classList.remove("text-right");
                                    mainArti_cbox.classList.add("text-center");
                                    if (!mainArti_cbox.querySelector('input[type="checkbox"]')) {
                                        var checkbox2 = document.createElement("input");
                                        checkbox2.type = "checkbox";
                                        checkbox2.checked = true;
                                        checkbox2.style.display = "none";
                                        checkbox2.style.transform = 'scale(1.5)';

                                        cekID = cekID+1;
                                        checkbox2.id = cekID;
                                        checkbox2.classList.add("withdraw");
                                        checkbox2.setAttribute('data-withdraw-amount', duzelt(cekimTutar, false).replace(".",""));
                                        mainArti_cbox.appendChild(checkbox2);
                                    }

                                });

                                rowTransactions.dataset.listenerAdded = "true";
                            }


                            break;
                            ////////////////////////////////////////////////////////////////////////////////////////////////


                            /// ÇEKİM İPTAL MESAJI ///
                        case "Withdraw (Cancel)":
                            aciklama = rowTransactions.cells[11].innerText.trim();
                            cekimID = aciklama.substring(aciklama.indexOf("Payment ID:") + 12).split(',')[0];
                            withdrawID.add(cekimID);

                            mainArti.textContent = duzelt(mainArti.textContent.trim(), false);
                            mainEksi.textContent = duzelt(mainEksi.textContent.trim(), false);
                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            observerTransactions.disconnect();
                            tabloTarih.innerHTML = "<a href='https://bo.bo-2222eos-gbxc.com/player/financial/" + user_id + "?from=" + date(tabloTarih.textContent) + "' style='color:black'><u>" + tabloTarih.textContent + "</u></a>";
                            observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);

                            var type_cekim = rowTransactions.cells[1];
                            type_cekim.style.cursor = "pointer";
                            type_cekim.style.textDecoration = "underline";

                            if (!type_cekim.dataset.listenerAdded) {

                                type_cekim.addEventListener("click", function() {

                                    source = 'https://bo.bo-2222eos-gbxc.com/reports/payments/paymentInfo/' + cekimID;

                                    veriCek(source, function(responseText) {
                                        var tempDiv = document.createElement('div');
                                        tempDiv.innerHTML = responseText;

                                        var sebepElement = tempDiv.querySelector('div > div.portlet.light.bordered > div > div > div:nth-child(2) > div > div.detail > ul > li.payment_list > div.desc.payment_ellipsis');
                                        var sebepElement2 = tempDiv.querySelector('div > div.portlet.light.bordered > div > div > div.col-md-12 > table > tbody > tr:nth-child(7) > td.text-center');
                                        var sebep = ""

                                        if (sebepElement) {
                                            sebep = sebepElement.innerText;
                                        } else if (sebepElement2) {
                                            sebep = sebepElement2.innerText;
                                        } else {
                                            sebep = "N/A";
                                        }

                                        observerTransactions.disconnect();

                                        if (!rowTransactions.nextElementSibling.querySelector("td[colspan='12']")) {
                                            var newRow = document.createElement("tr");
                                            newRow.innerHTML = "<td colspan='12'><b>" + sebep + "</b></td>";
                                            rowTransactions.parentNode.insertBefore(newRow, rowTransactions.nextSibling);

                                            newRow.addEventListener("dblclick", function() {
                                                newRow.style.display = "none";
                                            });
                                        } else {
                                            rowTransactions.nextElementSibling.removeAttribute("style");
                                        }

                                        observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);
                                    });

                                });

                                type_cekim.dataset.listenerAdded = "true";
                            }

                            break;
                            ///////////////////////////////////////////////////////////////////////////////////////////////////////////


                        case "Withdraw (Request)":
                            rowTransactions.style.backgroundColor = "rgba(255,165,0, 0.2)";

                            mainEksi.textContent = duzelt(mainEksi.textContent.trim(), false);
                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            var rowTo = rowTransactions.cells[4];
                            aciklama = rowTransactions.cells[11].innerText.trim();
                            cekimID = aciklama.substring(aciklama.indexOf("Payment ID:") + 12).split(',')[0];

                            if (withdrawID.has(cekimID)) {
                                rowTransactions.style.display = "none";
                                checkboxHide.style.display = "";
                                labelHide.style.display = "";
                                rowTransactions.classList.add("hd")
                                document.getElementById("labelHides").textContent = "Gizlenenleri Göster (" + document.querySelectorAll("tr.hd").length + ")";

                                // WD REQUEST İÇİN WD DURUMUNU GÖSTERME
                            } else {
                                //                                 source = 'https://bo.bo-2222eos-gbxc.com/reports/payments/paymentInfo/' + cekimID;

                                //                                 veriCek(source, function(responseText) {
                                //                                     var tempDiv = document.createElement('div');
                                //                                     tempDiv.innerHTML = responseText;

                                //                                     var statusElement = tempDiv.querySelector('div > div.portlet.light.bordered > div > div > div:nth-child(2) > div > div.detail > ul > li > div.desc');
                                //                                     var status = "";

                                //                                     if (statusElement) {
                                //                                         status = statusElement.innerText;
                                //                                     } else {
                                //                                         status = "N/A";
                                //                                     }

                                //                                     rowTo.innerText = status;

                                //                                 });
                            }

                            break;


                            /// BAHİS KUPONU RENKLENDİRME ///
                        case "PlaceBet":
                            aciklama = rowTransactions.cells[11].innerText.trim();
                            betID = aciklama.split(" ")[2].trim();

                            if (mainEksi.textContent !== "") {mainEksi.textContent = duzelt(mainEksi.textContent.trim(), false);}
                            if (mainFinal.textContent !== "") {mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);}
                            if (bonusEksi.textContent !== "") {bonusEksi.textContent = duzelt(bonusEksi.textContent.trim(), false);}
                            if (bonusFinal.textContent !== "") {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            var type_placebet = rowTransactions.cells[1];

                            if (wonBet.has(betID)) {
                                type_placebet.innerText = type_placebet.innerText + " (+" + wonBet.get(betID) + ")";
                                type_placebet.setAttribute("style","color:Green; font-weight:bold");
                            } else if (cashout.has(betID)) {
                                type_placebet.innerText = type_placebet.innerText + " (+" + cashout.get(betID) + ")";
                                type_placebet.setAttribute("style","color:DeepSkyBlue; font-weight:bold");
                            } else if (rollback.has(betID)) {
                                type_placebet.innerText = type_placebet.innerText + " [RB] (-" + rollback.get(betID) + ")";
                                type_placebet.setAttribute("style","color:Blue; font-weight:bold");
                            } else if (kuponkt && open_bets === 0) {
                                type_placebet.setAttribute("style","color:Red; font-weight:bold");
                            }



                            //                         source = 'https://bo.bo-2222eos-gbxc.com/bet/profile/' + betID;

                            //                         veriCek(source, function(responseText) {
                            //                             var tempDiv = document.createElement('div');
                            //                             tempDiv.innerHTML = responseText;

                            //                             var status = tempDiv.querySelector('div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.bet > div.portlet.light.bordered > div > div.row > div:nth-child(2) > div > div.detail > ul > li:nth-child(3) > div.desc').textContent.trim();

                            //                             var type_placebet = rowTransactions.cells[1];

                            //                             if (status === "Open") {
                            //                                 type_placebet.setAttribute("style","font-weight:bold")
                            //                                 type_placebet.classList.add("blink");
                            //                             } else if (status === "Won") {
                            //                                 type_placebet.setAttribute("style","color:LimeGreen")
                            //                             } else if (status === "Lost") {
                            //                                 type_placebet.setAttribute("style","color:Red")
                            //                             } else if (status === "Cashout") {
                            //                                 type_placebet.setAttribute("style","color:DeepSkyBlue")
                            //                             }
                            //                         });

                            break;
                            ///////////////////////////////////////////////////////////////////////////////////////////////////////////

                        case "Manual Bonus":
                        case "Created Bonus":
                            aciklama = rowTransactions.cells[11].innerText.trim();
                            if (aciklama.includes("şans") || aciklama.includes("sans") || aciklama.includes("şns") || aciklama.includes("sns")) {
                                rowTransactions.style.backgroundColor = "rgba(155, 0, 255, 0.4)";
                            } else {
                                rowTransactions.style.backgroundColor = "rgba(0, 0, 255, 0.3)";
                            }


                            observerTransactions.disconnect();
                            tabloTarih.innerHTML = "<a href='https://bo.bo-2222eos-gbxc.com/player/financial/" + user_id + "?from=" + date(tabloTarih.textContent) + "' style='color:black'><u>" + tabloTarih.textContent + "</u></a>";
                            observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);

                            mainArti.textContent = duzelt(mainArti.textContent.trim(), false);
                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);
                            bonusArti.textContent = duzelt(bonusArti.textContent.trim(), false);
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            break;

                        case "Withdraw (Manual)":
                            aciklama = rowTransactions.cells[11].innerText.trim();
                            mainEksi.textContent = duzelt(mainEksi.textContent.trim(), false);
                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}

                            rowTransactions.style.backgroundColor = "rgba(220, 20, 60, 0.5)";

                            if (aciklama === "etki") {
                                rowTransactions.cells[5].setAttribute("style","font-weight:bold;");
                                rowTransactions.cells[11].setAttribute("style","font-weight:bold");
                                rowTransactions.cells[11].classList.add("blink");

                                var etkiSaat = rowTransactions.cells[2].innerText.trim().split(" ")[1];

                                if (!etki.has(etkiSaat)) {
                                    var etkiTutar = parseInt(mainEksi.textContent.replace(".","").trim());
                                    toplamYatirimTutar = toplamYatirimTutar - etkiTutar;
                                    toplamCekimTutar = toplamCekimTutar - etkiTutar;
                                    console.warn(duzelt(etkiTutar, false) + " TL etki tespit edildi.\nToplam yatırımdan ve toplam çekimden " + duzelt(etkiTutar, false) + " TL düşüldü!");


                                    etki.add(etkiSaat);
                                    infoGuncelle();
                                }
                            }

                            break;

                        case "Closed Bonus":
                            rowTransactions.style.backgroundColor = "rgba(75, 0, 125, 0.3)";
                            break;

                        case "Add Credits":
                        case "Remove Credits":
                            if (mainArti.textContent !== "") {mainArti.textContent = duzelt(mainArti.textContent.trim(), false);}
                            if (mainEksi.textContent !== "") {mainEksi.textContent = duzelt(mainEksi.textContent.trim(), false);}
                            if (bonusFinal.textContent === "N/A") {bonusFinal.textContent = "0";} else {bonusFinal.textContent = duzelt(bonusFinal.textContent.trim(), false);}
                            mainFinal.textContent = duzelt(mainFinal.textContent.trim(), false);

                            if (islem === "Remove Credits") {
                                rowTransactions.classList.add("rc");
                                document.getElementById("labelRemoveCredits").textContent = "Remove Credits Gizle (" + document.querySelectorAll("tr.rc").length + ")";

                                checkboxRC.style.display = "";
                                labelRC.style.display = ""
                            }

                            break;

                        case "WonBet":
                        case "Cashout":
                        case "RollbackBet":
                        case "Deposit (Request)":
                        case "Deposit (Cancel)":
                            rowTransactions.style.display = "none";
                            checkboxHide.style.display = "";
                            labelHide.style.display = "";

                            rowTransactions.classList.add("hd")
                            document.getElementById("labelHides").textContent = "Gizlenenleri Göster (" + document.querySelectorAll("tr.hd").length + ")";


                            if (islem === "WonBet") {
                                aciklama = rowTransactions.cells[11].innerText.trim();
                                betID = aciklama.split(" ")[2].trim();

                                if (mainArti.innerText !== "") {
                                    if (!rollback.has(betID) && !wonBet.has(betID)) {
                                        wonBet.set(betID, duzelt(mainArti.innerText.trim()));
                                    }
                                } else {
                                    if (!rollback.has(betID) && !wonBet.has(betID)) {
                                        wonBet.set(betID, duzelt(bonusArti.innerText.trim()));
                                    }
                                }

                            } else if (islem === "Cashout") {
                                aciklama = rowTransactions.cells[11].innerText.trim();
                                betID = aciklama.split(" ")[2].trim();

                                if (mainArti.innerText !== "") {
                                    if (!cashout.has(betID)) {
                                        cashout.set(betID, duzelt(mainArti.innerText.trim()));
                                    }
                                } else {
                                    if (!cashout.has(betID)) {
                                        cashout.set(betID, duzelt(bonusArti.innerText.trim()));
                                    }
                                }

                            } else if (islem === "RollbackBet") {
                                aciklama = rowTransactions.cells[11].innerText.trim();
                                betID = aciklama.split(" ")[2].trim();

                                if (mainEksi.innerText !== "") {
                                    if (!rollback.has(betID)) {
                                        rollback.set(betID, duzelt(mainEksi.innerText.trim()));
                                    }
                                } else {
                                    if (!rollback.has(betID)) {
                                        rollback.set(betID, duzelt(bonusEksi.innerText.trim()));
                                    }
                                }
                            }

                            break;

                        default:
                            break;
                    }

                });

            }



            // GÜN SONU DC HESAPLAMA //
            let totalDepositAmount = 0;
            let totalWithdrawAmount = toplamCekimTutar;
            let gunsonukayip = 0;

            var infoElement_gunsonu = document.querySelector("#DataTables_Table_1 > thead > tr:nth-child(1) > th:nth-child(4)");
            var infoElement_gunsonu2 = document.querySelector("body > table.component_datatable_wallet.table.table-striped.table-bordered.dataTable.no-footer.fixedHeader-floating > thead > tr:nth-child(1) > th:nth-child(4)");


            function bonus() {
                if (totalDepositAmount <= 0) {return;}

                var bonusTutar = 0;
                var bonusOran = 0;
                var oran = prompt("Bonus oranı? (%):", "");

                if (oran === null && oran === "") {return;}

                if (gunsonukayip !== parseInt(infoElement_gunsonu.innerText.replace("Toplam kayıp", "").replace(".", ""))) { gunsonukayip = parseInt(infoElement_gunsonu.innerText.replace("Toplam kayıp", "").replace(".", "")); }

                if (oran === "dc") {
                    if (balance >= 20) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    } else if (balance >= (totalDepositAmount * 5) / 100) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    }

                    bonusTutar = (gunsonukayip * 25) / 100;
                    amountInputElement.value = Math.floor(bonusTutar);
                    bonusDescriptionElement.value = "dc";
                    transactiontTypeElement.value = "bonus";
                    transactiontTypeElement.dispatchEvent(new Event("change"));
                    amountInputElement.dispatchEvent(new Event("input"));
                    addButtonElement.classList.remove("green-meadow");
                    addButtonElement.classList.add("purple");
                    window.scrollTo({top: 0, behavior: 'smooth'});

                } else if (oran === "dc20" || oran === "dc 20") {
                    if (balance >= 20) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    } else if (balance >= (totalDepositAmount * 5) / 100) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    }

                    bonusTutar = (gunsonukayip * 20) / 100;
                    amountInputElement.value = Math.floor(bonusTutar);
                    bonusDescriptionElement.value = "dc20";
                    transactiontTypeElement.value = "bonus";
                    transactiontTypeElement.dispatchEvent(new Event("change"));
                    amountInputElement.dispatchEvent(new Event("input"));
                    addButtonElement.classList.remove("green-meadow");
                    addButtonElement.classList.add("purple");
                    window.scrollTo({top: 0, behavior: 'smooth'});

                } else if (oran === "dgs" || oran === "dcgs") {
                    if (balance >= 20) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    } else if (balance >= (totalDepositAmount * 5) / 100) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    }

                    bonusTutar = (gunsonukayip * 25) / 100;
                    amountInputElement.value = Math.floor(bonusTutar);
                    bonusDescriptionElement.value = "dc gün sonu";
                    transactiontTypeElement.value = "bonus";
                    transactiontTypeElement.dispatchEvent(new Event("change"));
                    amountInputElement.dispatchEvent(new Event("input"));
                    addButtonElement.classList.remove("green-meadow");
                    addButtonElement.classList.add("purple");
                    window.scrollTo({top: 0, behavior: 'smooth'});

                } else if (oran !== null && oran !== "" && oran.startsWith("dc deal ") || oran.startsWith("dcd ")) {
                    if (balance >= 20) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    } else if (balance >= (totalDepositAmount * 5) / 100) {
                        alertify.alert('HATA', 'Bakiye mevcut!');
                        return;
                    }

                    if (oran.startsWith("dc deal")) {
                        bonusOran = oran.split(" ")[2];
                        bonusDescriptionElement.value = oran;
                    } else {
                        bonusOran = oran.split(" ")[1];
                        bonusDescriptionElement.value = oran.replace("dcd ", "dc deal ");
                    }

                    bonusTutar = (gunsonukayip * bonusOran) / 100;
                    amountInputElement.value = Math.floor(bonusTutar);
                    transactiontTypeElement.value = "bonus";

                    transactiontTypeElement.dispatchEvent(new Event("change"));
                    amountInputElement.dispatchEvent(new Event("input"));
                    addButtonElement.classList.remove("green-meadow");
                    addButtonElement.classList.add("purple");
                    window.scrollTo({top: 0, behavior: 'smooth'});

                } else if (oran !== null && oran !== "" && !isNaN(oran) && oran <= 100) {
                    bonusTutar = (gunsonukayip * parseInt(oran)) / 100;
                    amountInputElement.value = Math.floor(bonusTutar);
                    transactiontTypeElement.value = "bonus";

                    transactiontTypeElement.dispatchEvent(new Event("change"));
                    amountInputElement.dispatchEvent(new Event("input"));
                    addButtonElement.classList.remove("green-meadow");
                    addButtonElement.classList.add("purple");
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }

            }



            const checkDeposit = document.querySelectorAll('.deposit');
            checkDeposit.forEach(function(checkboxD) {
                checkboxD.addEventListener('change', function() {

                    const depositAmount = parseInt(this.getAttribute('data-deposit-amount'));
                    if (this.checked) {
                        totalDepositAmount += depositAmount;
                    } else {
                        totalDepositAmount -= depositAmount;
                    }
                    gunsonukayip = totalDepositAmount - totalWithdrawAmount;

                    const cb = document.querySelectorAll('.withdraw');
                    if (totalDepositAmount <= 0) {
                        cb.forEach(function(cbx) {cbx.style.display = "none";});
                    } else {
                        cb.forEach(function(cbx) {cbx.style.display = "";});
                    }

                    if (infoElement_gunsonu) {
                        infoElement_gunsonu.removeAttribute("class");
                        infoElement_gunsonu.setAttribute("class","text-center");
                        infoElement_gunsonu.setAttribute("style", "color:red");

                        if (gunsonukayip > 0) {
                            infoElement_gunsonu.innerText = "Toplam kayıp\n" + duzelt(gunsonukayip, false);
                            infoElement_gunsonu.style.cursor = "pointer";

                            gunsonuAktif = true;
                            const dep = document.querySelectorAll('td[data-listener-added="true"]');
                            dep.forEach(function(dp) {dp.style.textDecoration = ""; dp.style.cursor = "";});

                            if (!infoElement_gunsonu.dataset.listenerAdded) {
                                infoElement_gunsonu.addEventListener("click", bonus);
                                infoElement_gunsonu.dataset.listenerAdded = "true";
                            }

                        } else {
                            infoElement_gunsonu.innerText = "";
                            infoElement_gunsonu.style.cursor = "default";

                            gunsonuAktif = false;
                            const dep = document.querySelectorAll('td[data-listener-added="true"]');
                            dep.forEach(function(dp) {dp.style.textDecoration = "underline"; dp.style.cursor = "pointer";});
                        }
                    }


                    if (infoElement_gunsonu2) {
                        infoElement_gunsonu2.removeAttribute("class");
                        infoElement_gunsonu2.setAttribute("class","text-center");
                        infoElement_gunsonu2.setAttribute("style", "color:red");

                        if (gunsonukayip > 0) {
                            infoElement_gunsonu2.innerText = "Toplam kayıp\n" + duzelt(gunsonukayip, false);
                            infoElement_gunsonu2.style.cursor = "pointer";

                            gunsonuAktif = true;
                            const dep = document.querySelectorAll('td[data-listener-added="true"]');
                            dep.forEach(function(dp) {dp.style.textDecoration = ""; dp.style.cursor = "";});

                            if (!infoElement_gunsonu2.dataset.listenerAdded) {
                                infoElement_gunsonu2.addEventListener("click", bonus);
                                infoElement_gunsonu2.dataset.listenerAdded = "true";
                            }

                        } else {
                            infoElement_gunsonu2.innerText = "";
                            infoElement_gunsonu2.style.cursor = "default";

                            gunsonuAktif = false;
                            const dep = document.querySelectorAll('td[data-listener-added="true"]');
                            dep.forEach(function(dp) {dp.style.textDecoration = "underline"; dp.style.cursor = "pointer";});
                        }
                    }


                });
            });


            const checkWithdraw = document.querySelectorAll('.withdraw');
            checkWithdraw.forEach(function(checkboxW) {
                checkboxW.addEventListener('change', function() {

                    const withdrawAmount = parseInt(this.getAttribute('data-withdraw-amount'));
                    if (this.checked) {
                        totalWithdrawAmount += withdrawAmount;
                    } else {
                        totalWithdrawAmount -= withdrawAmount;
                    }
                    gunsonukayip = totalDepositAmount - totalWithdrawAmount;


                    if (infoElement_gunsonu) {
                        infoElement_gunsonu.removeAttribute("class");
                        infoElement_gunsonu.setAttribute("class","text-center");
                        infoElement_gunsonu.setAttribute("style", "color:red");

                        if (gunsonukayip > 0) {
                            infoElement_gunsonu.innerText = "Toplam kayıp\n" + duzelt(gunsonukayip, false);
                            infoElement_gunsonu.style.cursor = "pointer";

                            if (!infoElement_gunsonu.dataset.listenerAdded) {
                                infoElement_gunsonu.addEventListener("click", bonus);
                                infoElement_gunsonu.dataset.listenerAdded = "true";
                            }

                        } else {
                            infoElement_gunsonu.innerText = "";
                            infoElement_gunsonu.style.cursor = "default";
                        }
                    }


                    if (infoElement_gunsonu2) {
                        infoElement_gunsonu2.removeAttribute("class");
                        infoElement_gunsonu2.setAttribute("class","text-center");
                        infoElement_gunsonu2.setAttribute("style", "color:red");

                        if (gunsonukayip > 0) {
                            infoElement_gunsonu2.innerText = "Toplam kayıp\n" + duzelt(gunsonukayip, false);
                            infoElement_gunsonu2.style.cursor = "pointer";

                            if (!infoElement_gunsonu2.dataset.listenerAdded) {
                                infoElement_gunsonu2.addEventListener("click", bonus);
                                infoElement_gunsonu2.dataset.listenerAdded = "true";
                            }

                        } else {
                            infoElement_gunsonu2.innerText = "";
                            infoElement_gunsonu2.style.cursor = "default";
                        }
                    }


                });
            });
            // GÜN SONU DC HESAPLAMA //

        }

    });


    var observerConfigTransactions = { childList: true, subtree: true };
    observerTransactions.observe(tableTransactionsElement, observerConfigTransactions);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
// ****************************************************************************************************** //





/// ÇEKİM KONTROL /// @NEŞET
//   var addButtonElement_2 = document.querySelectorAll(".form-actions.border-top-none")[0];
//   var brElement_toplamCekim_1 = document.createElement("br");
//   var brElement_toplamCekim_2 = document.createElement("br");
//   var newspanElement_toplamCekim = document.createElement("span");
//   newspanElement_toplamCekim.setAttribute("style", "font-weight: bold; color: darkblue; font-size: 24px");
//   newspanElement_toplamCekim.classList.add("blink");
//   newspanElement_toplamCekim.textContent = toplamCekimAdet + " tane toplamda " + toplamCekimTutar + "₺ çekim işlemi var!";
//   if(toplamCekimAdet >= 1) {
//    addButtonElement_2.appendChild(brElement_toplamCekim_1);
//    addButtonElement_2.appendChild(brElement_toplamCekim_2);
//    addButtonElement_2.appendChild(newspanElement_toplamCekim);
//   }
//////////////////////////////////////