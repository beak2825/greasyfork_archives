// ==UserScript==
// @name         【统计当页数据】GreasyFork用户主页显示该用户发布脚本数目、所有脚本的今日总安装次数和迄今总安装次数 
// @name:zh-TW   GreasyFork用戶主頁顯示該用戶發佈腳本數目、所有腳本的今日總安裝次數和迄今總安裝次數
// @name:en         Displays the number of scripts published by the user, the total number of installations
// @description    在GreasyFork用户主页显示该用户发布脚本数目、所有脚本的今日总安装次数和迄今总安装次数。
// @description:en The GreasyFork user homepage displays the number of scripts published by the user, the total number of installations for all scripts today, and the total number of installations to date.
// @description:zh-tw GreasyFork用戶主頁顯示該用戶發佈腳本數目、所有腳本的今日總安裝次數和迄今總安裝次數。
// @name:cs          Zobrazuje počet skriptů publikovaných uživatelem, celkový počet instalací
// @description:cs    Domovská stránka uživatele GreasyFork zobrazuje počet skriptů publikovaných uživatelem, celkový počet instalací pro všechny skripty dnes a celkový počet instalací k dnešnímu dni.
// @name:da          Viser antallet af scripts, der er udgivet af brugeren, det samlede antal installationer
// @description:da    GreasyFork-brugerens hjemmeside viser antallet af scripts, der er udgivet af brugeren, det samlede antal installationer for alle scripts i dag og det samlede antal installationer til dato.
// @name:de          Zeigt die Anzahl der vom Benutzer veröffentlichten Skripte an, die Gesamtzahl der Installationen
// @description:de    Die GreasyFork-Benutzerhomepage zeigt die Anzahl der vom Benutzer veröffentlichten Skripte, die Gesamtzahl der Installationen für alle Skripte heute und die Gesamtzahl der Installationen bis heute.
// @name:eo          Montras la nombron de skriptoj publikigitaj de la uzanto, la tutan nombron de instalaĵoj
// @description:eo    La hejmpaĝo de uzanto de GreasyFork montras la nombron da skriptoj publikigitaj de la uzanto, la tutan nombron da instalaĵoj por ĉiuj skriptoj hodiaŭ, kaj la tutan nombron da instalaĵoj ĝis nun.
// @name:es          Muestra el número de scripts publicados por el usuario, el número total de instalaciones
// @description:es    La página de inicio del usuario de GreasyFork muestra el número de scripts publicados por el usuario, el número total de instalaciones para todos los scripts hoy y el número total de instalaciones hasta la fecha.
// @name:fi          Näyttää käyttäjän julkaisemien skriptien lukumäärän, kokonaisasennusmäärän
// @description:fi    GreasyFork-käyttäjän kotisivu näyttää käyttäjän julkaisemien skriptien lukumäärän, kaikkien skriptien kokonaisasennusmäärän tältä päivältä ja kokonaisasennusmäärän tähän päivämäärään mennessä.
// @name:fr          Affiche le nombre de scripts publiés par l'utilisateur, le nombre total d'installations
// @description:fr    La page d'accueil de l'utilisateur GreasyFork affiche le nombre de scripts publiés par l'utilisateur, le nombre total d'installations pour tous les scripts aujourd'hui et le nombre total d'installations à ce jour.
// @name:fr-CA       Affiche le nombre de scripts publiés par l'utilisateur, le nombre total d'installations
// @description:fr-CA    La page d'accueil de l'utilisateur GreasyFork affiche le nombre de scripts publiés par l'utilisateur, le nombre total d'installations pour tous les scripts aujourd'hui et le nombre total d'installations à ce jour.
// @name:he          מציג את מספר הסקריפטים שפורסמו על ידי המשתמש, את המספר הכולל של ההתקנות
// @description:he    דף הבית של משתמש GreasyFork מציג את מספר הסקריפטים שפורסמו על ידי המשתמש, את המספר הכולל של ההתקנות עבור כל הסקריפטים היום ואת המספר הכולל של ההתקנות עד כה.
// @name:hr          Prikazuje broj skripti koje je objavio korisnik, ukupan broj instalacija
// @description:hr    Početna stranica korisnika GreasyFork prikazuje broj skripti koje je objavio korisnik, ukupan broj instalacija za sve skripte danas i ukupan broj instalacija do danas.
// @name:hu          Megjeleníti a felhasználó által közzétett szkriptek számát, a telepítések teljes számát
// @description:hu    A GreasyFork felhasználói kezdőlapja megjeleníti a felhasználó által közzétett szkriptek számát, az összes szkript mai telepítéseinek teljes számát és a mai napig történt telepítések teljes számát.
// @name:id          Menampilkan jumlah skrip yang diterbitkan oleh pengguna, jumlah total instalasi
// @description:id    Beranda pengguna GreasyFork menampilkan jumlah skrip yang diterbitkan oleh pengguna, jumlah total instalasi untuk semua skrip hari ini, dan jumlah total instalasi hingga saat ini.
// @name:it          Mostra il numero di script pubblicati dall'utente, il numero totale di installazioni
// @description:it    La home page dell'utente GreasyFork mostra il numero di script pubblicati dall'utente, il numero totale di installazioni per tutti gli script oggi e il numero totale di installazioni fino ad oggi.
// @name:ja          ユーザーが公開したスクリプトの数、インストール総数を表示します
// @description:ja    GreasyForkのユーザーホームページに、ユーザーが公開したスクリプトの数、今日のすべてのスクリプトの総インストール数、およびこれまでの総インストール数を表示します。
// @name:ko          사용자가 게시한 스크립트 수, 총 설치 수 표시
// @description:ko    GreasyFork 사용자 홈페이지에 사용자가 게시한 스크립트 수, 오늘 모든 스크립트의 총 설치 수, 현재까지의 총 설치 수가 표시됩니다.
// @name:nb          Viser antall skript publisert av brukeren, totalt antall installasjoner
// @description:nb    GreasyFork-brukerens hjemmeside viser antall skript publisert av brukeren, totalt antall installasjoner for alle skript i dag, og totalt antall installasjoner til dags dato.
// @name:nl          Toont het aantal scripts dat door de gebruiker is gepubliceerd, het totale aantal installaties
// @description:nl    De GreasyFork-gebruikershomepage toont het aantal scripts dat door de gebruiker is gepubliceerd, het totale aantal installaties voor alle scripts vandaag en het totale aantal installaties tot nu toe.
// @name:pl          Wyświetla liczbę skryptów opublikowanych przez użytkownika, łączną liczbę instalacji
// @description:pl    Strona domowa użytkownika GreasyFork wyświetla liczbę skryptów opublikowanych przez użytkownika, łączną liczbę instalacji dla wszystkich skryptów dzisiaj i łączną liczbę instalacji do tej pory.
// @name:pt-BR       Exibe o número de scripts publicados pelo usuário, o número total de instalações
// @description:pt-BR    A página inicial do usuário GreasyFork exibe o número de scripts publicados pelo usuário, o número total de instalações para todos os scripts hoje e o número total de instalações até o momento.
// @name:ro          Afișează numărul de scripturi publicate de utilizator, numărul total de instalări
// @description:ro    Pagina principală a utilizatorului GreasyFork afișează numărul de scripturi publicate de utilizator, numărul total de instalări pentru toate scripturile de astăzi și numărul total de instalări până în prezent.
// @name:sk          Zobrazuje počet skriptov publikovaných používateľom, celkový počet inštalácií
// @description:sk    Domovská stránka používateľa GreasyFork zobrazuje počet skriptov publikovaných používateľom, celkový počet inštalácií pre všetky skripty dnes a celkový počet inštalácií k dnešnému dňu.
// @name:sr          Приказује број скрипти које је објавио корисник, укупан број инсталација
// @description:sr    Почетна страница корисника GreasyFork приказује број скрипти које је објавио корисник, укупан број инсталација за све скрипте данас и укупан број инсталација до данас.
// @name:sv          Visar antalet skript som publicerats av användaren, det totala antalet installationer
// @description:sv    GreasyFork-användarens hemsida visar antalet skript som publicerats av användaren, det totala antalet installationer för alla skript idag och det totala antalet installationer hittills.
// @name:tr          Kullanıcı tarafından yayınlanan komut dosyası sayısını, toplam kurulum sayısını görüntüler
// @description:tr    GreasyFork kullanıcı ana sayfası, kullanıcı tarafından yayınlanan komut dosyası sayısını, bugün tüm komut dosyaları için toplam kurulum sayısını ve bugüne kadarki toplam kurulum sayısını görüntüler.
// @name:ug          ئىشلەتكۈچى ئېلان قىلغان قوليازمىلارنىڭ سانى ، ئورنىتىشنىڭ ئومۇمىي سانى كۆرسىتىلدى
// @description:ug    GreasyFork ئىشلەتكۈچىنىڭ بېتىدە ئىشلەتكۈچى ئېلان قىلغان قوليازمىلارنىڭ سانى ، بۈگۈنكى بارلىق قوليازمىلارنىڭ ئومۇمىي ئورنىتىش سانى ۋە ھازىرغىچە بولغان ئورنىتىشنىڭ ئومۇمىي سانى كۆرسىتىلدى.
// @name:vi          Hiển thị số lượng tập lệnh được xuất bản bởi người dùng, tổng số lượt cài đặt
// @description:vi    Trang chủ người dùng GreasyFork hiển thị số lượng tập lệnh được xuất bản bởi người dùng, tổng số lượt cài đặt cho tất cả các tập lệnh hôm nay và tổng số lượt cài đặt cho đến nay.
// @name:zh          显示用户发布的脚本数量，所有脚本的今日总安装次数和迄今总安装次数
// @description:zh    在GreasyFork用户主页显示该用户发布脚本数目、所有脚本的今日总安装次数和迄今总安装次数。
// @name:zh-CN       显示用户发布的脚本数量，所有脚本的今日总安装次数和迄今总安装次数
// @description:zh-CN    在GreasyFork用户主页显示该用户发布脚本数目、所有脚本的今日总安装次数和迄今总安装次数。
// @name:zh-HK       顯示用戶發布的腳本數量，所有腳本的今日總安裝次數和迄今總安裝次數
// @description:zh-HK    在GreasyFork用戶主頁顯示該用戶發布腳本數目、所有腳本的今日總安裝次數和迄今總安裝次數。
// @name:zh-SG       显示用户发布的脚本数量，所有脚本的今日总安装次数和迄今总安装次数
// @description:zh-SG    在GreasyFork用户主页显示该用户发布脚本数目、所有脚本的今日总安装次数和迄今总安装次数。
// @name:zh-TW       GreasyFork用戶主頁顯示該用戶發佈腳本數目、所有腳本的今日總安裝次數和迄今總安裝次數
// @description:zh-TW    GreasyFork用戶主頁顯示該用戶發佈腳本數目、所有腳本的今日總安裝次數和迄今總安裝次數。
// @namespace      http://tampermonkey.net/
// @version        0.2.9.8
// @author         aspen138
// @match          https://greasyfork.org/*/users/*
// @grant          none
// @license        MIT
// @locale         en The GreasyFork user homepage displays the number of scripts published by the user, the total number of installations for all scripts today, and the total number of installations to date
// @locale         zh-CN GreasyFork用户主页显示该用户发布脚本数目、所有脚本的今日总安装次数和迄今总安装次数
// @locale         zh-TW GreasyFork用戶主頁顯示該用戶發佈腳本數目、所有腳本的今日總安裝次數和迄今總安裝次數
// @locale         ja   GreasyForkユーザーのホームページには、ユーザーが発行したスクリプトの数、すべてのスクリプトの今日の総インストール数、合計インストール数が表示されます。
// @locale         ko  GreasyFork 사용자 홈 페이지에는 해당 사용자가 게시한 스크립트 수, 모든 스크립트의 오늘 총 설치 횟수 및 현재 총 설치 횟수가 표시됩니다.
// @icon         https://greasyfork.org//vite/assets/blacklogo16-37ZGLlXh.png
// @downloadURL https://update.greasyfork.org/scripts/482623/%E3%80%90%E7%BB%9F%E8%AE%A1%E5%BD%93%E9%A1%B5%E6%95%B0%E6%8D%AE%E3%80%91GreasyFork%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA%E8%AF%A5%E7%94%A8%E6%88%B7%E5%8F%91%E5%B8%83%E8%84%9A%E6%9C%AC%E6%95%B0%E7%9B%AE%E3%80%81%E6%89%80%E6%9C%89%E8%84%9A%E6%9C%AC%E7%9A%84%E4%BB%8A%E6%97%A5%E6%80%BB%E5%AE%89%E8%A3%85%E6%AC%A1%E6%95%B0%E5%92%8C%E8%BF%84%E4%BB%8A%E6%80%BB%E5%AE%89%E8%A3%85%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482623/%E3%80%90%E7%BB%9F%E8%AE%A1%E5%BD%93%E9%A1%B5%E6%95%B0%E6%8D%AE%E3%80%91GreasyFork%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA%E8%AF%A5%E7%94%A8%E6%88%B7%E5%8F%91%E5%B8%83%E8%84%9A%E6%9C%AC%E6%95%B0%E7%9B%AE%E3%80%81%E6%89%80%E6%9C%89%E8%84%9A%E6%9C%AC%E7%9A%84%E4%BB%8A%E6%97%A5%E6%80%BB%E5%AE%89%E8%A3%85%E6%AC%A1%E6%95%B0%E5%92%8C%E8%BF%84%E4%BB%8A%E6%80%BB%E5%AE%89%E8%A3%85%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==



// Function to inject Chart.js from a CDN
const injectChartJs = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(script);
};


const plotDistribution = (data1, data2) => {
    // Ensure Chart.js has loaded
    if (typeof Chart === 'undefined') {
        setTimeout(() => plotDistribution(data1, data2), 500); // Retry after 500ms
        return;
    }

    // Create canvas for the chart
    const canvasHtml = '<canvas id="installDistributionCanvas" width="100" height="50"></canvas>';
    const userHeader = document.querySelector('#about-user h2');
    if (userHeader) {
        userHeader.insertAdjacentHTML('afterend', canvasHtml);
        const ctx = document.getElementById('installDistributionCanvas').getContext('2d');

        // Plot chart
        new Chart(ctx, {
            type: 'bar', // Change this to 'line', 'bar', etc. as needed
            data: {
                labels: data1.labels, // X-axis labels
                datasets: [{
                        label: 'Total Installs',
                        data: data1.values, // Y-axis data for Total Installs
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-1', // Associate this dataset with the first y-axis
                    },
                    {
                        label: 'Daily Installs',
                        data: data2.values, // Y-axis data for Daily Installs
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-2', // Associate this dataset with the second y-axis
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                            id: 'y-axis-1',
                            type: 'linear',
                            position: 'left', // This places the first y-axis on the left
                            beginAtZero: true,
                            // Additional customization for this axis
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            position: 'right', // This places the second y-axis on the right
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false, // Ensures grid lines from this axis do not overlap with the first axis
                            },
                            // Additional customization for this axis
                        }
                    ]
                }
            }
        });
    }
};


const collectAndPlotData = () => {
    // Assuming you have a way to collect individual install counts
    const totalInstallData = {
        labels: [], // Populate with script names or identifiers
        values: [] // Populate with corresponding install counts
    };

    const dailyInstallData = {
        labels: [], // Populate with script names or identifiers
        values: [] // Populate with corresponding install counts
    };

    var totalInstalls_selector = '#user-script-list-section dd.script-list-total-installs > span';
    var array_totalInstall = Array.from(document.querySelectorAll(totalInstalls_selector)).map(el => (parseInt(el.textContent.replace(/,/g, ''), 10) || 0));
    var dailyInstalls_selector = '#user-script-list-section dd.script-list-daily-installs > span';
    var array_dailyInstalls = Array.from(document.querySelectorAll(dailyInstalls_selector)).map(el => (parseInt(el.textContent.replace(/,/g, ''), 10) || 0))
    var scriptTitle_selector = '#user-script-list-section article > h2 > a.script-link';
    var array_scriptTitle = Array.from(document.querySelectorAll(scriptTitle_selector)).map(el => el.text)


    for (let i = 0; i < array_totalInstall.length; i++) {
        // totalInstallData.labels.push(`Script ${i+1}`);
        // dailyInstallData.labels.push(`Script ${i+1}`);
        totalInstallData.labels.push(array_scriptTitle[i]);
        dailyInstallData.labels.push(array_scriptTitle[i]);
        totalInstallData.values = array_totalInstall;
        dailyInstallData.values = array_dailyInstalls;
    }
    plotDistribution(totalInstallData, dailyInstallData);
};




var publishedScriptsNumber = 0;

(function() {
    'use strict';

    const sumInstalls = (selector) => Array.from(document.querySelectorAll(selector))
        .reduce((sum, el) => sum + (parseInt(el.textContent.replace(/,/g, ''), 10) || 0), 0);

    const displayTotals = (daily, total) => {
        const userHeader = document.querySelector('#about-user h2');
        const language = document.documentElement.lang; // Get the current language of the document

        let dailyInstallsText = '';
        let totalInstallsText = '';

        // Determine the text based on the current language
        switch (language) {
            case 'en':
                publishedScriptsNumber = `Number of published scripts: ${publishedScriptsNumber}`;
                dailyInstallsText = `Total daily installations for all scripts: ${daily}`;
                totalInstallsText = `Total installations to date for all scripts: ${total}`;
                break;
            case 'zh-CN':
                publishedScriptsNumber = `已发布脚本总数：${publishedScriptsNumber}`;
                dailyInstallsText = `该用户所有脚本的今日总安装次数：${daily}`;
                totalInstallsText = `该用户所有脚本的迄今总安装次数：${total}`;
                break;
            case 'zh-TW':
                publishedScriptsNumber = `已發布腳本總數：${publishedScriptsNumber}`;
                dailyInstallsText = `該用戶所有腳本的今日總安裝次數：${daily}`;
                totalInstallsText = `該用戶所有腳本的迄今總安裝次數：${total}`;
                break;
            case 'ja':
                publishedScriptsNumber = `公開されたスクリプトの合計：${publishedScriptsNumber}`;
                dailyInstallsText = `本日の全スクリプトの合計インストール回数：${daily}`;
                totalInstallsText = `全スクリプトの累計インストール回数：${total}`;
                break;
            case 'ko':
                publishedScriptsNumber = `게시된 스크립트 총 수: ${publishedScriptsNumber}`;
                dailyInstallsText = `해당 사용자의 모든 스크립트에 대한 오늘의 총 설치 횟수: ${daily}`;
                totalInstallsText = `해당 사용자의 모든 스크립트에 대한 총 설치 횟수: ${total}`;
                break;
                // ... add other languages if needed
            default:
                publishedScriptsNumber = `Number of published scripts: ${publishedScriptsNumber}`;
                dailyInstallsText = `Total daily installations for all scripts: ${daily}`;
                totalInstallsText = `Total installations to date for all scripts: ${total}`;
        }

        if (userHeader) {
            userHeader.insertAdjacentHTML('afterend', `
            <dib>${publishedScriptsNumber}</div>
            <div>${dailyInstallsText}</div>
            <div>${totalInstallsText}</div>
        `);
        }
    };
    // const dailyInstallsSum = sumInstalls('dd.script-list-daily-installs > span');
    // const totalInstallsSum = sumInstalls('dd.script-list-total-installs > span');
    const dailyInstallsSum = sumInstalls('#user-script-list-section dd.script-list-daily-installs > span');
    const totalInstallsSum = sumInstalls('#user-script-list-section dd.script-list-total-installs > span');

    (function() {
        var list = document.querySelector('ol#user-script-list.script-list.showing-all-languages');
        if (list) {
            var items = list.querySelectorAll('li');
            publishedScriptsNumber = items.length;
        } else {
            console.log('没有找到指定的OL元素');
        }
    })();

    displayTotals(dailyInstallsSum, totalInstallsSum);

    // Call this function at the appropriate place in your script, after the DOM is ready
    injectChartJs();
    collectAndPlotData();
})();