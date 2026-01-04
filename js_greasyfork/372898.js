// ==UserScript==
// @name         SGK Asil Belges
// @namespace    http://tampermonkey.net/
// @version      4
// @description  try to take over the world!
// @author       You
// @include      https://ebildirge.sgk.gov.tr/*
// @include      https://uyg.sgk.gov.tr/*
// @grant        none
// @run-at       document-idle
// @esversion  6
// @downloadURL https://update.greasyfork.org/scripts/372898/SGK%20Asil%20Belges.user.js
// @updateURL https://update.greasyfork.org/scripts/372898/SGK%20Asil%20Belges.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    debugger;
    window.BaslikVarMi = BaslikVarMi;
    window.TikDelay = 200;

    LoginSayfasinda();
    MufredatSayfasinda();
    IptalKisileriSecSayfasinda();
})();

function BaslikVarMi(baslik)
{
    let centers = document.querySelectorAll("center");
    let found = false;
    for(let i = 0; i < centers.length; i++) {
        if(centers[i].innerText.includes(baslik)) {
            return true;
        }
    }
    return false;
}

function IptalKisileriSecSayfasinda()
{
    if(!BaslikVarMi("İptal")){
        return;
    }
    if(!BaslikVarMi("İşlemi Yapılacak Sigortalı Bilgileri Giriş")){
        return;
    }

    // Gradient background sayfayı inanılmaz yavaşlatıyor
    document.querySelectorAll('table.gradienttable td').forEach(e => { e.style.background = 'white' });

    // TC Listesi yapıştırarak seçim yaptıran kutu
    let kutu = document.createElement("textarea");
    kutu.id = "edKisiler";
    kutu.style.position = "fixed";
    kutu.placeholder = "Seçilecek TC'leri buraya yapıştır. Sonra ENTER'a bas. XML dosyasını da buraya sürükle bırak yapabilirsin.";
    kutu.title = "Seçilecek TC'leri buraya yapıştır. Sonra ENTER'a bas. XML dosyasını da buraya sürükle bırak yapabilirsin.";
    kutu.style.top = "117px";
    kutu.style.left = "80%";
    kutu.style.width = "200px";
    kutu.style.height = "180px";
    kutu.style.border = "2px green solid";
    document.body.appendChild(kutu);

    kutu.addEventListener('input', function() {
        clickit(this.value);
    });
}

// Kutuya yapıştırılan TC numaralarını tabloda bul ve ilk sütundaki checkbox'ı checked yap.
function clickit(tcs)
{
	tcs = tcs.trim();
	let listTcs = tcs.split("\n");

	let allTcs = document.getElementsByTagName('span');

	for(let j = 0; j < listTcs.length; j++)
	{
		var tc = listTcs[j];
		for(var i=0; i < allTcs.length; i++)
		{
			if(allTcs[i].innerText == tc)
			{
				allTcs[i].parentElement.previousElementSibling.previousElementSibling.previousElementSibling.children[0].checked = true;
			}
		}
	}
}

// En kullanışlı özelliğimiz: Login sayfasına yapıştırma kutusu ekle.
function LoginSayfasinda()
{
    let username = document.getElementById("kullaniciIlkKontrollerGiris_username");
    let yersizUser = document.getElementById("userLogin_basvuru_tcKimlikNo");
    let eskiEkran = document.getElementById("isyeri_guvenlik");
    if(username === null && yersizUser === null && eskiEkran === null){
        return;
    }

    let kutu = document.createElement("textarea");
    kutu.id = "edPass";
    kutu.style.position = "fixed";
    kutu.style.top = "140px";
    kutu.style.left = "20px";
    kutu.style.width = "100px";
    kutu.style.height = "100px";
    kutu.style.backgroundColor = "#ccffcc";
    kutu.style.border = "2px green solid";
    kutu.placeholder = "Excel'den buraya şifre yapıştır";
    document.body.appendChild(kutu);
    kutu.focus();

    kutu.addEventListener('input', function() {
        ParsePass(this.value);
    });
}

function ParsePass(text)
{
    if(text === ""){
        return;
    }

    let parts = text.match(/[^\s-]+/g);
    if(parts.length !== 4){
        return;
    }

    var username = document.getElementById("kullaniciIlkKontrollerGiris_username");
    let yersizUser = document.getElementById("userLogin_basvuru_tcKimlikNo");

    var userEk = null;
    var sistemSifresi = null;
    var isyeriSifresi = null;
    if(yersizUser !== null){
        username = document.getElementById("userLogin_basvuru_tcKimlikNo");
        userEk = document.getElementById("userLogin_basvuru_isyeriKodu");
        sistemSifresi = document.getElementById("userLogin_basvuru_sistemSifre");
        isyeriSifresi = document.getElementById("userLogin_basvuru_isyeriSifre");
    }
    else if(username !== null){
        username = document.getElementById("kullaniciIlkKontrollerGiris_username");
        userEk = document.getElementById("kullaniciIlkKontrollerGiris_isyeri_kod");
        sistemSifresi = document.getElementById("kullaniciIlkKontrollerGiris_password");
        isyeriSifresi = document.getElementById("kullaniciIlkKontrollerGiris_isyeri_sifre");
    }
    else{
        username = document.getElementsByName("j_username")[0];
        userEk = document.getElementsByName("isyeri_kod")[0];
        sistemSifresi = document.getElementsByName("j_password")[0];
        isyeriSifresi = document.getElementsByName("isyeri_sifre")[0];
    }

    username.value = parts[0];
    userEk.value = parts[1];
    sistemSifresi.value = parts[2];
    isyeriSifresi.value = parts[3];

    var captcha1 = document.getElementById("kullaniciIlkKontrollerGiris_isyeri_guvenlik");
    var captcha2 = document.getElementById("userLogin_captchaStrLogin");
    var captcha3 = document.getElementById("isyeri_guvenlik");
    var captcha4 = document.getElementById("userLogin_captchaStr");

    var captcha = captcha1 || captcha2 || captcha3 || captcha4;
    captcha.focus();
    captcha.addEventListener('input', BuyukHarf);
}

function BuyukHarf(e)
{
    this.value = this.value.toUpperCase();
}

function MufredatSayfasinda()
{
    if(!BaslikVarMi("MÜFREDAT KARTI")){
        return;
    }

    let btPrim = document.createElement("input");
    btPrim.type = "button";
    btPrim.value = "Primlere Bak";
    btPrim.id = "btPrim";
    btPrim.onclick = PrimBak;
    btPrim.style.position = "fixed";
    btPrim.style.top = "135px";
    btPrim.style.left = "22px";
    btPrim.style.width = "222px";
    btPrim.style.height = "30px";
    btPrim.style.border = "1px green solid";
    document.body.appendChild(btPrim);

    let btCopy1 = document.createElement("input");
    btCopy1.type = "button";
    btCopy1.value = "Tabloyu Kopyala";
    btCopy1.id = "btCopy1";
    btCopy1.onclick = TabloyuKopyala;
    btCopy1.style.position = "fixed";
    btCopy1.style.top = "170px";
    btCopy1.style.left = "22px";
    btCopy1.style.width = "222px";
    btCopy1.style.height = "30px";
    btCopy1.style.border = "1px green solid";
    document.body.appendChild(btCopy1);
}

function PrimBak() {
    let secim = document.getElementById("secim");
    secim.selectedIndex = 1;
    secim.dispatchEvent(new Event("change"));
    let secimSekli = document.getElementById("muf_secim");
    secimSekli.selectedIndex = 1;
    secimSekli.dispatchEvent(new Event("change"));

    let donem1 = document.getElementById("secimBelirle_donem_yil_ay_index_bas");
    let min = "999999";
    let current = "";
    let index = 0;
    for(let i = 1; i < donem1.getElementsByTagName('option').length; i++)
    {
        current = donem1.options[i].text.replace("/", "");
        if(current < min) {
            min = current;
            index = i;
        }
        if(current < "201103") {
            break;
        }
    }
    donem1.selectedIndex = index;

    let donem2 = document.getElementById("secimBelirle_donem_yil_ay_index_bit");
    donem2.selectedIndex = 1;

    document.getElementById('secimBelirle_0').click();
}

function TabloyuKopyala() {
    let divMufredat = document.getElementById('mufredatTablo');
    let butunSatirlar = Array.from(divMufredat.getElementsByTagName('tr'));
    let text = "<table><tr>";
    let basliklar = Array.from(butunSatirlar[1].getElementsByTagName('th'));
    basliklar.forEach((th) => {
        text += th.outerHTML;
    });
    text += '<th></th><th>TOPLAM:</th>';
    text += '<th>=TOPLA.ÇARPIM(K2:K20000; --(E2:E20000="A"); --(F2:F20000 = 1); --(H2:H20000 <> 5510); --(A2:A20000 = "AKTİF")) + TOPLA.ÇARPIM(K2:K20000; --(E2:E20000="E"); --(F2:F20000 = 1); --(H2:H20000 <> 5510); --(A2:A20000 = "AKTİF")) - TOPLA.ÇARPIM(K2:K20000; --(SAĞDAN(H2:H20000; 4) = "6486"); --(E2:E20000 = "I"); --(A2:A20000 = "AKTİF"))</th>';
    text += '<th>=SUMPRODUCT(K2:K20000; --(E2:E20000="A"); --(F2:F20000 = 1); --(H2:H20000 <> 5510); --(A2:A20000 = "AKTİF")) + SUMPRODUCT(K2:K20000; --(E2:E20000="E"); --(F2:F20000 = 1); --(H2:H20000 <> 5510); --(A2:A20000 = "AKTİF")) - SUMPRODUCT(K2:K20000; --(RIGHT(H2:H20000; 4) = "6486"); --(E2:E20000 = "I"); --(A2:A20000 = "AKTİF"))</th>';
    text += '</tr>';

    butunSatirlar.forEach((tr) => {
        if(!tr.attributes.onclick) {
            return;
        }
        let onclickText = tr.attributes.onclick.value;
        let trimmed = onclickText.replace("bilgiGoster(", "").replace(')', '');
        let parts = trimmed.split(',');
        if(parts[5] == " 'D'") {
            text += tr.outerHTML;
        }
    });

    text += "</table>";
    copyText(text);
}

function copyText(text) {
  var textArea = document.createElement("textarea");

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '10em';
  textArea.style.height = '10em';
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
}