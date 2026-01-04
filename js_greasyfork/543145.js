// ==UserScript==
// @name         FB Account Autoisi - ig muhbs01
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Isi nama, tanggal lahir, jenis kelamin, dan password otomatis di form pendaftaran Facebook
// @match        *://*.facebook.com/r.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543145/FB%20Account%20Autoisi%20-%20ig%20muhbs01.user.js
// @updateURL https://update.greasyfork.org/scripts/543145/FB%20Account%20Autoisi%20-%20ig%20muhbs01.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==== NAMA ACAK ====
const namaDepanList = [
"Ishma", "Rey", "Dinda", "Ayu", "Rizky", "Putri", "Dian", "Asep", "Budi", "Fajar",
"Indah", "Nanda", "Aulia", "Dewi", "Intan", "Hafidz", "Siska", "Farah", "Zaki", "Bayu",
"Anggi", "Wulan", "Rahma", "Iqbal", "Lia", "Novi", "Rina", "Tika", "Hana", "Taufik",
"Anisa", "Galih", "Kiki", "Fahri", "Salma", "Maya", "Elisa", "Tia", "Yoga", "Doni",
"Fani", "Rafi", "Aldi", "Raka", "Dian", "Tasya", "Arif", "Nina", "Rico", "Acha",
"Ajeng", "Yuni", "Diva", "Gita", "Mega", "Lutfi", "Raihan", "Arsy", "Meli", "Dhea",
"Yusuf", "Vira", "Eka", "Nia", "Zahra", "Nando", "Kevin", "Rizal", "Rehan", "Vian",
"Rian", "Randy", "Nova", "Aliya", "Citra", "Laras", "Reza", "Salsabila", "Laila", "Damar",
"Arum", "Amel", "Dito", "Zidan", "Felix", "Tari", "Faisal", "Tomi", "Derry", "Davin",
"Romi", "Aiman", "Hilmi", "Yana", "Amar", "Cahya", "Luki", "Seno", "Andra", "Agung",
"Via", "Yuniar", "Ines", "Syifa", "Rasya", "Rara", "Nana", "Dara", "Rizki", "Dewan",
"Rendra", "Tyo", "Anin", "Bella", "Nindy", "Ilham", "Gilang", "Ikhsan", "Bima", "Derry",
"Aditya", "Rai", "Yosua", "Umar", "Nizar", "Cici", "Eli", "Kirana", "Sekar", "Jihan",
"Alif", "Mikha", "Vika", "Sinta", "Soni", "Nuri", "Okta", "Alvina", "Vito", "Nindy",
"Juna", "Najwa", "Tasya", "Aqila", "Dafa", "Ardian", "Azka", "Aurel", "Delia", "Tiara",
"Abrar", "Natasya", "Ziva", "Haikal", "Nadhifa", "Keisha", "Abid", "Khansa", "Fahira", "Iqra",
"Bilal", "Shafa", "Lana", "Syakir", "Arina", "Najib", "Dzakwan", "Zharfan", "Naila", "Rayhan",
"Shakira", "Rahman", "Jihan", "Rafiq", "Hani", "Salwa", "Habib", "Zayna", "Shafira", "Maulana",
"Syahrul", "Hanif", "Mirza", "Elfa", "Taslim", "Aska", "Faza", "Rasya", "Yumna", "Irfan",
"Aysha", "Akmal", "Aqil", "Alvan", "Afifah", "Arfan", "Naura", "Syarif", "Azzam", "Ajmal"
];
const namaBelakangList = [
"Reyvanka", "Saputra", "Permata", "Sari", "Mahendra", "Wulandari", "Santoso", "Setiawan", "Ramadhan", "Nugraha",
"Wijaya", "Putra", "Handayani", "Sasmita", "Gunawan", "Herlambang", "Rahardian", "Sutrisno", "Kusuma", "Anggraini",
"Yuliani", "Ariyanti", "Suwandi", "Fadilah", "Pratama", "Hartono", "Susanto", "Siregar", "Hasibuan", "Tambunan",
"Sinaga", "Manullang", "Pasaribu", "Simanjuntak", "Napitupulu", "Tobing", "Saragih", "Hutapea", "Panjaitan", "Nasution",
"Subroto", "Basuki", "Rachman", "Iskandar", "Kurniawan", "Wijayanti", "Hardian", "Sukmawati", "Syahputra", "Utomo",
"Mulyadi", "Sudirman", "Lestari", "Pranata", "Wijoyo", "Agustina", "Kristanto", "Kristina", "Kartika", "Yuliana",
"Astuti", "Andayani", "Putri", "Mahardika", "Aditya", "Rosyid", "Habibi", "Ismail", "Mukhtar", "Fauzan",
"Saputro", "Ardiansyah", "Ridwan", "Bakhtiar", "Farhan", "Sopian", "Hamzah", "Syahrani", "Yusup", "Zulfikar",
"Isnaeni", "Sulistyo", "Winata", "Setiono", "Ramdhan", "Khoirul", "Teguh", "Marlina", "Sofyan", "Rohman",
"Farida", "Susilawati", "Afandi", "Wicaksono", "Gunadi", "Azhari", "Darwis", "Muliawan", "Sabirin", "Barmawi",
"Yunus", "Komarudin", "Rusdi", "Ali", "Hidayat", "Nurdin", "Sani", "Bakrie", "Syamsudin", "Muchtar",
"Ramli", "Fitria", "Maulana", "Arsyad", "Abidin", "Sulaiman", "Hudaya", "Rasyid", "Azis", "Ruslan",
"Kusnadi", "Imran", "Mardiana", "Subagyo", "Soegiharto", "Poernomo", "Waskito", "Budiman", "Soekarno", "Soeharto",
"Hakim", "Hakiki", "Wijanarko", "Irawan", "Zamzami", "Nugroho", "Winarno", "Aryanto", "Yulianto", "Firmansyah",
"Triana", "Ernawati", "Sutanto", "Endang", "Jatmiko", "Purwanto", "Sutrisna", "Laksono", "Alamsyah", "Kuswandono",
"Supriyadi", "Halim", "Suharto", "Wibowo", "Jauhari", "Rozaq", "Salim", "Assegaf", "Wulandari", "Yusran",
"Rachmawati", "Hermawan", "Putrawan", "Baskoro", "Hendrawan", "Maulana", "Adnan", "Kusumo", "Damayanti", "Martono",
"Adiwijaya", "Sungkono", "Tanjung", "Damanik", "Pane", "Lubis", "Harahap", "Siagian", "Napitulu", "Sibarani",
"Sitompul", "Nainggolan", "Panggabean", "Simatupang", "Sihombing", "Sarumpaet", "Simbolon", "Girsang", "Siahaan", "Sinambela",
"Siagian", "Marbun", "Tobing", "Lumbantoruan", "Ritonga", "Sidabutar", "Simanjorang", "Sianturi", "Pakpahan", "Tanjung"
];

function randomNama(list) {
    return list[Math.floor(Math.random() * list.length)];
}

const fullName = `${randomNama(namaDepanList)} ${randomNama(namaBelakangList)}`;
    const password = "xmas0321";

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 300);
    }

    waitForElement('input[name="firstname"]', input => input.value = fullName.split(" ")[0]);
    waitForElement('input[name="lastname"]', input => input.value = fullName.split(" ")[1]);
    waitForElement('input[name="reg_passwd__"]', input => input.value = password);
    waitForElement('select[name="birthday_day"]', sel => sel.value = Math.floor(Math.random() * 28 + 1));
    waitForElement('select[name="birthday_month"]', sel => sel.value = Math.floor(Math.random() * 12 + 1));
    waitForElement('select[name="birthday_year"]', sel => sel.value = Math.floor(Math.random() * (2003 - 1990 + 1)) + 1990);

    waitForElement('input[name="sex"]', () => {
        const radios = document.querySelectorAll('input[name="sex"]');
        const random = Math.floor(Math.random() * radios.length);
        if (radios[random]) radios[random].checked = true;
    });

    setTimeout(() => {
        const submitBtn = document.querySelector('button[name="websubmit"]');
        if (submitBtn) submitBtn.click();
    }, 3000);
})();