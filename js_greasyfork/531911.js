// ==UserScript==
// @name         Dodaj Przycisk Premii
// @namespace    http://cdn.zimon.space/
// @version      1.0.9
// @description  Przycisk premii
// @author       Zimon
// @match        *://lspd.state-majestic.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @license MIT
// @history      1.0.0 Pierwsza wersja
// @downloadURL https://update.greasyfork.org/scripts/531911/Dodaj%20Przycisk%20Premii.user.js
// @updateURL https://update.greasyfork.org/scripts/531911/Dodaj%20Przycisk%20Premii.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let globalneDanePremii = [];

    const MAX_KWOTA_PREMII = 250000;
    const MIN_KWOTA_PREMII = 15000;

    function przetworzPlik(zawartosc) {
        const linie = zawartosc.split('\n').filter(linia => linia.trim() !== '');

        const startIndex = linie[0].includes('staticId;amount;comment') ? 1 : 0;

        const przetworzoneDane = [];

        for (let i = startIndex; i < linie.length; i++) {
            const linia = linie[i].trim();
            if (linia === '') continue;

            const elementy = linia.split(';');

            if (elementy.length >= 3) {
                const staticId = elementy[0];
                const amount = elementy[1];
                let comment = elementy[2];

                comment = usunCudzyslow(comment);

                przetworzoneDane.push({
                    staticId: staticId,
                    amount: amount,
                    comment: comment
                });
            }
        }

        return przetworzoneDane;
    }

    function usunCudzyslow(tekst) {
        if (!tekst) return tekst;

        return tekst.replace(/['"''""]/g, '');
    }

    function symulujWpisywanie(element, wartosc) {
        element.focus();
        element.click();

        element.value = '';

        let tekst = String(wartosc);
        if (typeof wartosc === 'string') {
            tekst = usunCudzyslow(tekst);
        }

        element.value = tekst;

        element.dispatchEvent(new Event('focus', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function formatujKomentarz(staryKomentarz, nowyKomentarz) {
        let nowyTekst = nowyKomentarz;

        staryKomentarz = usunCudzyslow(staryKomentarz);
        nowyTekst = usunCudzyslow(nowyTekst);

        if (nowyTekst.startsWith("Premia ")) {
            nowyTekst = nowyTekst.substring(7);
        }

        return staryKomentarz + " + " + nowyTekst;
    }

    function sprawdzCzyWyjatek(komentarz) {
        const komentarzMaleLitery = (komentarz || '').toLowerCase();
        return komentarzMaleLitery.includes("hc") || komentarzMaleLitery.includes("leader");
    }

    function ograniczKwote(kwota, komentarz) {
        const kwotaLiczbowa = parseInt(kwota);

        if (sprawdzCzyWyjatek(komentarz)) {
            return kwotaLiczbowa;
        }

        if (kwotaLiczbowa > MAX_KWOTA_PREMII) {
            return MAX_KWOTA_PREMII;
        }
        
        if (kwotaLiczbowa < MIN_KWOTA_PREMII) {
            return MIN_KWOTA_PREMII;
        }

        return kwotaLiczbowa;
    }

    function pokazPytanieOZastapienie(uid, obecnaKwota, nowaKwota, obecnyKomentarz, nowyKomentarz, callback) {
        obecnyKomentarz = usunCudzyslow(obecnyKomentarz);
        nowyKomentarz = usunCudzyslow(nowyKomentarz);

        const sumowanieKwoty = parseInt(obecnaKwota) + parseInt(nowaKwota);
        const ograniczonaKwota = ograniczKwote(sumowanieKwoty, nowyKomentarz);
        const ograniczonaNowaKwota = ograniczKwote(nowaKwota, nowyKomentarz);

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#0c2657';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.zIndex = '10000';
        modal.style.width = '400px';

        const tytul = document.createElement('h3');
        tytul.textContent = `Dla UID: ${uid} jest wpisana premia o kwocie ${obecnaKwota}`;
        modal.appendChild(tytul);

        const tresc = document.createElement('p');
        if ((sumowanieKwoty !== ograniczonaKwota) && !sprawdzCzyWyjatek(nowyKomentarz)) {
            if (sumowanieKwoty < MIN_KWOTA_PREMII) {
                tresc.innerHTML = `Po dodaniu kwoty z pliku wyjdzie <span style="text-decoration: line-through;">${sumowanieKwoty}</span> <strong>${ograniczonaKwota}</strong> (zwiększone do minimum). Czy chcesz zmienić premię?`;
            } else {
                tresc.innerHTML = `Po dodaniu kwoty z pliku wyjdzie <span style="text-decoration: line-through;">${sumowanieKwoty}</span> <strong>${ograniczonaKwota}</strong> (ograniczone do maksimum). Czy chcesz zmienić premię?`;
            }
        } else {
            tresc.textContent = `Po dodaniu kwoty z pliku wyjdzie ${ograniczonaKwota}. Czy chcesz zmienić premię?`;
        }
        modal.appendChild(tresc);

        if (sprawdzCzyWyjatek(nowyKomentarz)) {
            const wyjatekInfo = document.createElement('p');
            wyjatekInfo.textContent = "Uwaga: Ta premia jest wyjątkiem (HC lub Leader) - limit kwoty nie obowiązuje";
            wyjatekInfo.style.color = "#007bff";
            wyjatekInfo.style.fontWeight = "bold";
            modal.appendChild(wyjatekInfo);
        }

        const wlasnaKwotaKontener = document.createElement('div');
        wlasnaKwotaKontener.style.marginTop = '15px';
        wlasnaKwotaKontener.style.marginBottom = '15px';

        const etykieta = document.createElement('label');
        etykieta.textContent = 'Lub wprowadź własną kwotę premii:';
        etykieta.style.display = 'block';
        etykieta.style.marginBottom = '5px';
        wlasnaKwotaKontener.appendChild(etykieta);

        const wlasnaKwota = document.createElement('input');
        wlasnaKwota.type = 'number';
        wlasnaKwota.value = ograniczonaNowaKwota;
        wlasnaKwota.style.width = '100%';
        wlasnaKwota.style.padding = '5px';
        wlasnaKwota.style.boxSizing = 'border-box';
        wlasnaKwotaKontener.appendChild(wlasnaKwota);

        modal.appendChild(wlasnaKwotaKontener);

        const przyciski = document.createElement('div');
        przyciski.style.display = 'flex';
        przyciski.style.justifyContent = 'space-between';
        przyciski.style.marginTop = '20px';

        const nie = document.createElement('button');
        nie.className = 'btn-primary';
        nie.textContent = 'Nie';
        nie.style.padding = '8px 15px';
        nie.onclick = function () {
            modal.remove();
            callback(false);
        };
        przyciski.appendChild(nie);

        const wlasna = document.createElement('button');
        wlasna.className = 'btn-primary';
        wlasna.textContent = 'Użyj własnej';
        wlasna.style.padding = '8px 15px';
        wlasna.onclick = function () {
            const wartoscWlasna = wlasnaKwota.value;
            modal.remove();
            const ograniczonaWlasna = sprawdzCzyWyjatek(nowyKomentarz) ?
                wartoscWlasna :
                Math.min(parseInt(wartoscWlasna), MAX_KWOTA_PREMII);
            callback(true, ograniczonaWlasna);
        };
        przyciski.appendChild(wlasna);

        const tak = document.createElement('button');
        tak.className = 'btn-primary';
        tak.textContent = 'Tak (suma)';
        tak.style.padding = '8px 15px';
        tak.onclick = function () {
            modal.remove();
            callback(true, ograniczonaKwota);
        };
        przyciski.appendChild(tak);

        const zakoncz = document.createElement('button');
        zakoncz.className = 'btn-primary';
        zakoncz.textContent = 'Zakończ';
        zakoncz.style.padding = '8px 15px';
        zakoncz.style.backgroundColor = '#d9534f';
        zakoncz.style.marginLeft = '10px';
        zakoncz.onclick = function () {
            modal.remove();
            callback(false, null, true);
        };
        przyciski.appendChild(zakoncz);

        modal.appendChild(przyciski);

        document.body.appendChild(modal);
    }

    async function wypelnijFormularz(dane) {
        let licznikWypelnionych = 0;

        for (const rekord of dane) {
            const poleKwoty = document.querySelector(`.form-control.premia-input[data-uid="${rekord.staticId}"]`);
            const poleKomentarza = document.querySelector(`.form-control.komentarz-input[data-uid="${rekord.staticId}"]`);

            if (poleKwoty) {
                const obecnaKwota = poleKwoty.value.trim();
                const obecnyKomentarz = poleKomentarza ? poleKomentarza.value.trim() : '';

                const ograniczonaKwotaZPliku = ograniczKwote(rekord.amount, rekord.comment);

                if (obecnaKwota && obecnaKwota !== '0' && obecnaKwota !== '0.00') {
                    try {
                        const decyzja = await new Promise(resolve => {
                            pokazPytanieOZastapienie(
                                rekord.staticId,
                                obecnaKwota,
                                ograniczonaKwotaZPliku,
                                obecnyKomentarz,
                                rekord.comment,
                                (czyZastapic, nowaWartoscKwoty, czyZakonczyc) => {
                                    if (czyZakonczyc) {
                                        resolve({ zakonczyc: true });
                                        return;
                                    }

                                    if (czyZastapic) {
                                        symulujWpisywanie(poleKwoty, nowaWartoscKwoty);

                                        if (poleKomentarza) {
                                            const nowyKomentarz = formatujKomentarz(obecnyKomentarz, rekord.comment);
                                            symulujWpisywanie(poleKomentarza, nowyKomentarz);
                                        }

                                        licznikWypelnionych++;
                                    }
                                    resolve({ zakonczyc: false });
                                }
                            );
                        });

                        if (decyzja.zakonczyc) {
                            break;
                        }
                    } catch (error) {
                    }
                } else {
                    symulujWpisywanie(poleKwoty, ograniczonaKwotaZPliku);

                    if (poleKomentarza) {
                        const czystyKomentarz = usunCudzyslow(rekord.comment);
                        symulujWpisywanie(poleKomentarza, czystyKomentarz);
                    }

                    licznikWypelnionych++;
                }
            }
        }

        alert(`Wypełniono ${licznikWypelnionych} rekordów z ${dane.length} wczytanych.`);
    }

    function utworzInterfejsUploadu() {
        const istniejacyInterfejs = document.getElementById('interfejsUploadu');
        if (istniejacyInterfejs) {
            istniejacyInterfejs.remove();
        }

        // Główny kontener (całe okno)
        const kontenerGlowny = document.createElement('div');
        kontenerGlowny.id = 'interfejsUploadu';
        kontenerGlowny.style.position = 'fixed';
        kontenerGlowny.style.top = '50%';
        kontenerGlowny.style.left = '50%';
        kontenerGlowny.style.transform = 'translate(-50%, -50%)';
        kontenerGlowny.style.backgroundColor = '#0c2657';
        kontenerGlowny.style.color = 'white';
        kontenerGlowny.style.borderRadius = '5px';
        kontenerGlowny.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        kontenerGlowny.style.zIndex = '9999';
        kontenerGlowny.style.width = '90%';
        kontenerGlowny.style.maxWidth = '1000px';
        kontenerGlowny.style.height = 'auto';
        kontenerGlowny.style.maxHeight = '85vh';
        kontenerGlowny.style.display = 'flex';
        kontenerGlowny.style.flexDirection = 'column';
        kontenerGlowny.style.padding = '0';
        kontenerGlowny.style.overflow = 'hidden';

        // Nagłówek
        const naglowekKontener = document.createElement('div');
        naglowekKontener.style.padding = '20px 20px 0 20px';
        naglowekKontener.style.backgroundColor = '#0c2657';
        naglowekKontener.style.position = 'sticky';
        naglowekKontener.style.top = '0';
        naglowekKontener.style.zIndex = '3';

        const naglowek = document.createElement('h3');
        naglowek.textContent = 'Dodaj premie';
        naglowek.style.marginTop = '0';
        naglowek.style.color = 'white';
        naglowekKontener.appendChild(naglowek);

        // Zakładki
        const zakladki = document.createElement('div');
        zakladki.style.display = 'flex';
        zakladki.style.marginBottom = '0';
        zakladki.style.borderBottom = '1px solid #444';
        zakladki.style.position = 'sticky';
        zakladki.style.top = '0';
        zakladki.style.backgroundColor = '#0c2657';
        zakladki.style.zIndex = '2';

        const zakladkaPliku = document.createElement('div');
        zakladkaPliku.textContent = 'Wczytaj z pliku';
        zakladkaPliku.style.padding = '10px 15px';
        zakladkaPliku.style.cursor = 'pointer';
        zakladkaPliku.style.backgroundColor = '#0c2657';
        zakladkaPliku.style.borderBottom = '2px solid #007bff';
        zakladkaPliku.dataset.zakladka = 'plik';

        const zakladkaReczna = document.createElement('div');
        zakladkaReczna.textContent = 'Wprowadź ręcznie';
        zakladkaReczna.style.padding = '10px 15px';
        zakladkaReczna.style.cursor = 'pointer';
        zakladkaReczna.style.backgroundColor = '#0c2657';
        zakladkaReczna.dataset.zakladka = 'reczne';

        zakladki.appendChild(zakladkaPliku);
        zakladki.appendChild(zakladkaReczna);
        naglowekKontener.appendChild(zakladki);
        
        kontenerGlowny.appendChild(naglowekKontener);

        // Kontener dla treści (przewijalny)
        const trescKontener = document.createElement('div');
        trescKontener.style.flex = '1';
        trescKontener.style.overflowY = 'auto';
        trescKontener.style.padding = '20px';
        trescKontener.style.maxHeight = 'calc(85vh - 140px)'; // Wysokość minus nagłówek i footer

        // Kontener dla zawartości zakładek
        const zawartoscZakladek = document.createElement('div');
        zawartoscZakladek.id = 'zawartoscZakladek';
        trescKontener.appendChild(zawartoscZakladek);

        // Zawartość dla zakładki pliku
        const zawartoscPliku = document.createElement('div');
        zawartoscPliku.id = 'zawartoscPliku';

        const opisPliku = document.createElement('p');
        opisPliku.textContent = 'Wybierz plik tekstowy z danymi o premiach. Każda linia powinna zawierać dane oddzielone średnikami (;).';
        opisPliku.style.color = 'white';
        zawartoscPliku.appendChild(opisPliku);

        const limitInfo = document.createElement('p');
        limitInfo.innerHTML = `<strong>Uwaga:</strong> Kwoty premii są automatycznie ograniczane do ${MAX_KWOTA_PREMII} oraz zwiększane do minimum ${MIN_KWOTA_PREMII}, z wyjątkiem premii HC i Leader.`;
        limitInfo.style.color = '#ffcc00';
        limitInfo.style.fontStyle = 'italic';
        zawartoscPliku.appendChild(limitInfo);

        const quoteInfo = document.createElement('p');
        quoteInfo.innerHTML = `<strong>Uwaga:</strong> Cudzysłowy w komentarzach będą automatycznie usuwane podczas importu.`;
        quoteInfo.style.color = '#ffcc00';
        quoteInfo.style.fontStyle = 'italic';
        zawartoscPliku.appendChild(quoteInfo);

        const inputPliku = document.createElement('input');
        inputPliku.type = 'file';
        inputPliku.accept = '.txt,.csv';
        inputPliku.style.display = 'block';
        inputPliku.style.marginBottom = '15px';
        inputPliku.style.color = 'white';
        zawartoscPliku.appendChild(inputPliku);

        // Zawartość dla zakładki ręcznego wprowadzania
        const zawartoscReczna = document.createElement('div');
        zawartoscReczna.id = 'zawartoscReczna';
        zawartoscReczna.style.display = 'none';

        const opisReczny = document.createElement('p');
        opisReczny.textContent = 'Wprowadź dane o premiach ręcznie. Każda linia powinna być w formacie: staticId;kwota;komentarz';
        opisReczny.style.color = 'white';
        zawartoscReczna.appendChild(opisReczny);

        const limitInfoReczne = document.createElement('p');
        limitInfoReczne.innerHTML = `<strong>Uwaga:</strong> Kwoty premii są automatycznie ograniczane do ${MAX_KWOTA_PREMII} oraz zwiększane do minimum ${MIN_KWOTA_PREMII}, z wyjątkiem premii HC i Leader.`;
        limitInfoReczne.style.color = '#ffcc00';
        limitInfoReczne.style.fontStyle = 'italic';
        zawartoscReczna.appendChild(limitInfoReczne);

        const przykladReczny = document.createElement('p');
        przykladReczny.innerHTML = `<strong>Przykład:</strong><br>123456;50000;Premia za patrolowanie<br>654321;75000;Premia za HC`;
        przykladReczny.style.color = '#cccccc';
        przykladReczny.style.fontStyle = 'italic';
        przykladReczny.style.fontSize = '0.9em';
        zawartoscReczna.appendChild(przykladReczny);

        const textareaReczna = document.createElement('textarea');
        textareaReczna.style.width = '100%';
        textareaReczna.style.height = '150px';
        textareaReczna.style.marginBottom = '15px';
        textareaReczna.style.padding = '10px';
        textareaReczna.style.backgroundColor = '#1a3b78';
        textareaReczna.style.color = 'white';
        textareaReczna.style.border = '1px solid #2c4f8c';
        textareaReczna.placeholder = 'staticId;kwota;komentarz\nstaticId;kwota;komentarz';
        zawartoscReczna.appendChild(textareaReczna);

        const przyciskAnalizuj = document.createElement('button');
        przyciskAnalizuj.className = 'btn-primary';
        przyciskAnalizuj.textContent = 'Analizuj dane';
        przyciskAnalizuj.style.marginBottom = '15px';
        przyciskAnalizuj.onclick = function() {
            const zawartosc = textareaReczna.value;
            if (!zawartosc.trim()) {
                alert('Wprowadź dane do analizy!');
                return;
            }
            
            const dane = przetworzPlik(zawartosc);
            globalneDanePremii = dane;
            
            podgladKontener.style.display = 'block';
            podgladKontener.innerHTML = '<h4 style="color: white;">Wczytane dane:</h4>';
            
            // Powiększ kontener po analizie
            kontenerGlowny.style.height = '85vh';
            
            const licznik = document.createElement('p');
            licznik.textContent = `Wczytano ${dane.length} rekordów`;
            licznik.style.fontWeight = 'bold';
            licznik.style.color = 'white';
            podgladKontener.appendChild(licznik);
            
            // Tabela z danymi
            const tabela = document.createElement('table');
            tabela.style.width = '100%';
            tabela.style.borderCollapse = 'collapse';
            tabela.style.color = 'white';
            tabela.style.tableLayout = 'fixed';
            
            // Definiowanie szerokości kolumn
            const kolumnySzerokosc = {
                'ID': '15%',
                'Kwota': '15%',
                'Komentarz': '55%',
                'Limit': '15%'
            };
            
            // Tworzenie nagłówka tabeli
            const naglowek = document.createElement('thead');
            const wierszNaglowka = document.createElement('tr');
            wierszNaglowka.style.backgroundColor = '#0c2657';
            
            ['ID', 'Kwota', 'Komentarz', 'Limit'].forEach(tekst => {
                const th = document.createElement('th');
                th.textContent = tekst;
                th.style.border = '1px solid #444';
                th.style.padding = '8px';
                th.style.textAlign = 'left';
                th.style.backgroundColor = '#0c2657';
                th.style.width = kolumnySzerokosc[tekst];
                wierszNaglowka.appendChild(th);
            });
            naglowek.appendChild(wierszNaglowka);
            tabela.appendChild(naglowek);
            
            // Tworzenie treści tabeli
            const cialoTabeli = document.createElement('tbody');
            dane.forEach((rekord, index) => {
                const wiersz = document.createElement('tr');
                wiersz.style.backgroundColor = index % 2 === 0 ? '#0a1f45' : '#0c2657';
                
                const tdId = document.createElement('td');
                tdId.textContent = rekord.staticId;
                tdId.style.border = '1px solid #444';
                tdId.style.padding = '8px';
                wiersz.appendChild(tdId);
                
                const tdKwota = document.createElement('td');
                tdKwota.textContent = rekord.amount;
                tdKwota.style.border = '1px solid #444';
                tdKwota.style.padding = '8px';
                wiersz.appendChild(tdKwota);
                
                const tdKomentarz = document.createElement('td');
                tdKomentarz.textContent = usunCudzyslow(rekord.comment);
                tdKomentarz.style.border = '1px solid #444';
                tdKomentarz.style.padding = '8px';
                tdKomentarz.style.wordBreak = 'break-word';
                wiersz.appendChild(tdKomentarz);
                
                const tdLimit = document.createElement('td');
                if (sprawdzCzyWyjatek(rekord.comment)) {
                    tdLimit.textContent = "Brak limitu (wyjątek)";
                    tdLimit.style.color = "#4caf50";
                } else if (parseInt(rekord.amount) > MAX_KWOTA_PREMII) {
                    tdLimit.textContent = `Ograniczone do ${MAX_KWOTA_PREMII}`;
                    tdLimit.style.color = "#ff9800";
                } else if (parseInt(rekord.amount) < MIN_KWOTA_PREMII) {
                    tdLimit.textContent = `Zwiększone do ${MIN_KWOTA_PREMII}`;
                    tdLimit.style.color = "#ff9800";
                } else {
                    tdLimit.textContent = "OK";
                    tdLimit.style.color = "#4caf50";
                }
                tdLimit.style.border = '1px solid #444';
                tdLimit.style.padding = '8px';
                wiersz.appendChild(tdLimit);
                
                cialoTabeli.appendChild(wiersz);
            });
            tabela.appendChild(cialoTabeli);
            
            podgladKontener.appendChild(tabela);
            
            importuj.disabled = false;
        };
        zawartoscReczna.appendChild(przyciskAnalizuj);

        zawartoscZakladek.appendChild(zawartoscPliku);
        zawartoscZakladek.appendChild(zawartoscReczna);

        const podgladKontener = document.createElement('div');
        podgladKontener.id = 'podgladDanych';
        podgladKontener.style.border = '1px solid #444';
        podgladKontener.style.padding = '10px';
        podgladKontener.style.marginBottom = '15px';
        podgladKontener.style.display = 'none';
        podgladKontener.style.color = 'white';
        trescKontener.appendChild(podgladKontener);

        kontenerGlowny.appendChild(trescKontener);

        // Footer zawsze na dole
        const footerContainer = document.createElement('div');
        footerContainer.style.position = 'sticky';
        footerContainer.style.bottom = '0';
        footerContainer.style.left = '0';
        footerContainer.style.width = '100%';
        footerContainer.style.backgroundColor = '#0c2657';
        footerContainer.style.padding = '15px 20px';
        footerContainer.style.zIndex = '3';
        footerContainer.style.borderTop = '1px solid #354f7e';
        footerContainer.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.1)';
        
        const przyciski = document.createElement('div');
        przyciski.style.display = 'flex';
        przyciski.style.justifyContent = 'space-between';

        const anuluj = document.createElement('button');
        anuluj.className = 'btn-primary';
        anuluj.textContent = 'Anuluj';
        anuluj.onclick = function () {
            kontenerGlowny.remove();
        };
        przyciski.appendChild(anuluj);

        const importuj = document.createElement('button');
        importuj.className = 'btn-primary';
        importuj.textContent = 'Importuj dane';
        importuj.disabled = true;
        importuj.onclick = function () {
            kontenerGlowny.remove();
            wypelnijFormularz(globalneDanePremii);
        };
        przyciski.appendChild(importuj);

        footerContainer.appendChild(przyciski);
        kontenerGlowny.appendChild(footerContainer);

        // Obsługa przełączania zakładek
        zakladkaPliku.addEventListener('click', function() {
            zakladkaPliku.style.borderBottom = '2px solid #007bff';
            zakladkaReczna.style.borderBottom = 'none';
            zawartoscPliku.style.display = 'block';
            zawartoscReczna.style.display = 'none';
            podgladKontener.style.display = 'none';
            importuj.disabled = true;
            globalneDanePremii = [];
            
            // Zresetuj wysokość kontenera
            kontenerGlowny.style.height = 'auto';
            trescKontener.style.maxHeight = 'calc(85vh - 140px)';
        });

        zakladkaReczna.addEventListener('click', function() {
            zakladkaReczna.style.borderBottom = '2px solid #007bff';
            zakladkaPliku.style.borderBottom = 'none';
            zawartoscReczna.style.display = 'block';
            zawartoscPliku.style.display = 'none';
            podgladKontener.style.display = 'none';
            importuj.disabled = true;
            globalneDanePremii = [];
            
            // Zresetuj wysokość kontenera
            kontenerGlowny.style.height = 'auto';
            trescKontener.style.maxHeight = 'calc(85vh - 140px)';
        });

        inputPliku.addEventListener('change', function (e) {
            const plik = e.target.files[0];
            if (plik) {
                const czytnik = new FileReader();
                czytnik.onload = function (e) {
                    const zawartosc = e.target.result;
                    const dane = przetworzPlik(zawartosc);

                    globalneDanePremii = dane;

                    podgladKontener.style.display = 'block';
                    podgladKontener.innerHTML = '<h4 style="color: white;">Wczytane dane:</h4>';
                    
                    // Powiększ kontener po wczytaniu danych
                    kontenerGlowny.style.height = '85vh';
                    
                    const licznik = document.createElement('p');
                    licznik.textContent = `Wczytano ${dane.length} rekordów`;
                    licznik.style.fontWeight = 'bold';
                    licznik.style.color = 'white';
                    podgladKontener.appendChild(licznik);

                    // Tabela z danymi
                    const tabela = document.createElement('table');
                    tabela.style.width = '100%';
                    tabela.style.borderCollapse = 'collapse';
                    tabela.style.color = 'white';
                    tabela.style.tableLayout = 'fixed';
                    
                    // Definiowanie szerokości kolumn
                    const kolumnySzerokosc = {
                        'ID': '15%',
                        'Kwota': '15%',
                        'Komentarz': '55%',
                        'Limit': '15%'
                    };
                    
                    // Tworzenie nagłówka tabeli
                    const naglowek = document.createElement('thead');
                    const wierszNaglowka = document.createElement('tr');
                    wierszNaglowka.style.backgroundColor = '#0c2657';
                    
                    ['ID', 'Kwota', 'Komentarz', 'Limit'].forEach(tekst => {
                        const th = document.createElement('th');
                        th.textContent = tekst;
                        th.style.border = '1px solid #444';
                        th.style.padding = '8px';
                        th.style.textAlign = 'left';
                        th.style.backgroundColor = '#0c2657';
                        th.style.width = kolumnySzerokosc[tekst];
                        wierszNaglowka.appendChild(th);
                    });
                    naglowek.appendChild(wierszNaglowka);
                    tabela.appendChild(naglowek);
                    
                    // Tworzenie treści tabeli
                    const cialoTabeli = document.createElement('tbody');
                    dane.forEach((rekord, index) => {
                        const wiersz = document.createElement('tr');
                        wiersz.style.backgroundColor = index % 2 === 0 ? '#0a1f45' : '#0c2657';
                        
                        const tdId = document.createElement('td');
                        tdId.textContent = rekord.staticId;
                        tdId.style.border = '1px solid #444';
                        tdId.style.padding = '8px';
                        wiersz.appendChild(tdId);
                        
                        const tdKwota = document.createElement('td');
                        tdKwota.textContent = rekord.amount;
                        tdKwota.style.border = '1px solid #444';
                        tdKwota.style.padding = '8px';
                        wiersz.appendChild(tdKwota);
                        
                        const tdKomentarz = document.createElement('td');
                        tdKomentarz.textContent = usunCudzyslow(rekord.comment);
                        tdKomentarz.style.border = '1px solid #444';
                        tdKomentarz.style.padding = '8px';
                        tdKomentarz.style.wordBreak = 'break-word';
                        wiersz.appendChild(tdKomentarz);
                        
                        const tdLimit = document.createElement('td');
                        if (sprawdzCzyWyjatek(rekord.comment)) {
                            tdLimit.textContent = "Brak limitu (wyjątek)";
                            tdLimit.style.color = "#4caf50";
                        } else if (parseInt(rekord.amount) > MAX_KWOTA_PREMII) {
                            tdLimit.textContent = `Ograniczone do ${MAX_KWOTA_PREMII}`;
                            tdLimit.style.color = "#ff9800";
                        } else if (parseInt(rekord.amount) < MIN_KWOTA_PREMII) {
                            tdLimit.textContent = `Zwiększone do ${MIN_KWOTA_PREMII}`;
                            tdLimit.style.color = "#ff9800";
                        } else {
                            tdLimit.textContent = "OK";
                            tdLimit.style.color = "#4caf50";
                        }
                        tdLimit.style.border = '1px solid #444';
                        tdLimit.style.padding = '8px';
                        wiersz.appendChild(tdLimit);
                        
                        cialoTabeli.appendChild(wiersz);
                    });
                    tabela.appendChild(cialoTabeli);
                    
                    podgladKontener.appendChild(tabela);
                    
                    importuj.disabled = false;
                };
                czytnik.readAsText(plik);
            }
        });

        document.body.appendChild(kontenerGlowny);
    }

    function dodajPrzyciskPremii() {
        setTimeout(function () {
            const divTotals = document.querySelector('div.totals');
            if (!divTotals) {
                return;
            }

            const naszPrzyciskId = 'dodajPremiePrzycisk';
            if (document.getElementById(naszPrzyciskId)) {
                return;
            }

            const przycisk = document.createElement('button');
            przycisk.className = 'btn-primary';
            przycisk.id = naszPrzyciskId;
            przycisk.textContent = 'Dodaj automatycznie premie';
            przycisk.style.marginRight = '10px';
            przycisk.style.marginBottom = '10px';

            przycisk.addEventListener('click', function (e) {
                e.preventDefault();
                utworzInterfejsUploadu();
            });

            divTotals.parentNode.insertBefore(przycisk, divTotals);
        }, 0);
    }

    function generujPlikiPremii() {
        const premie = zbierzPremieZFormularza();

        if (premie.length === 0) {
            alert("Nie znaleziono żadnych premii do zapisania!");
            return;
        }

        const naglowek = "staticId;amount;comment";

        let sumaKwot = 0;
        let plikIndex = 1;
        let plikDane = [naglowek];

        const MAX_SUM = 10000000;

        for (const premia of premie) {
            const kwota = parseInt(premia.amount);

            if (sumaKwot + kwota > MAX_SUM && plikDane.length > 1) {
                zapiszDoPliku(plikDane.join('\n'), `premie_${plikIndex}.txt`);

                plikIndex++;
                plikDane = [naglowek];
                sumaKwot = 0;
            }

            plikDane.push(`${premia.staticId};${premia.amount};${premia.comment}`);
            sumaKwot += kwota;
        }

        if (plikDane.length > 1) {
            zapiszDoPliku(plikDane.join('\n'), `premie_${plikIndex}.txt`);
        }

        alert(`Wygenerowano ${plikIndex} plików z premiami.`);
    }

    function zapiszDoPliku(tresc, nazwaPliku) {
        try {
            const blob = new Blob([tresc], { type: 'text/plain;charset=utf-8' });

            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = nazwaPliku;

            document.body.appendChild(link);

            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            alert(`Wystąpił błąd podczas zapisywania pliku: ${error.message}`);
        }
    }

    function zbierzPremieZFormularza() {
        const premie = [];

        const poleKwoty = document.querySelectorAll('.form-control.premia-input');

        poleKwoty.forEach(pole => {
            const uid = pole.getAttribute('data-uid');
            const kwota = pole.value.trim();

            if (kwota && kwota !== '0' && kwota !== '0.00') {
                const poleKomentarza = document.querySelector(`.form-control.komentarz-input[data-uid="${uid}"]`);
                const komentarz = poleKomentarza ? poleKomentarza.value.trim() : '';

                premie.push({
                    staticId: uid,
                    amount: kwota,
                    comment: komentarz
                });
            }
        });

        return premie;
    }

    function podmienPrzyciskCSV() {
        setTimeout(function () {
            const przyciskCSV = document.getElementById('exportCSV');

            if (!przyciskCSV) {
                return;
            }

            const oryginalnyTekst = przyciskCSV.textContent;

            przyciskCSV.textContent = 'Generuj pliki premii';

            const nowyPrzycisk = przyciskCSV.cloneNode(true);
            przyciskCSV.parentNode.replaceChild(nowyPrzycisk, przyciskCSV);

            nowyPrzycisk.addEventListener('click', function (e) {
                e.preventDefault();
                generujPlikiPremii();
            });

        }, 0);
    }

    function usunPrzyciski() {
        setTimeout(function () {
            const przyciskiDoUsuniecia = [
                'addCommentButton',
                'resetSort',
                'sortStatus'
            ];

            let licznikUsunietych = 0;

            przyciskiDoUsuniecia.forEach(id => {
                const przycisk = document.getElementById(id);
                if (przycisk) {
                    przycisk.remove();
                    licznikUsunietych++;
                }
            });
        }, 0);
    }

    function init() {
        dodajPrzyciskPremii();

        podmienPrzyciskCSV();

        usunPrzyciski();

        const observer = new MutationObserver(function (mutations) {
            const divTotals = document.querySelector('div.totals');
            const naszPrzycisk = document.getElementById('dodajPremiePrzycisk');
            const przyciskCSV = document.getElementById('exportCSV');

            const przyciskiDoUsuniecia = ['addCommentButton', 'resetSort', 'sortStatus'];
            let przyciskiIstnieja = false;

            przyciskiDoUsuniecia.forEach(id => {
                if (document.getElementById(id)) {
                    przyciskiIstnieja = true;
                }
            });

            if (divTotals && !naszPrzycisk) {
                dodajPrzyciskPremii();
            }

            if (przyciskCSV && przyciskCSV.textContent !== 'Generuj pliki premii') {
                podmienPrzyciskCSV();
            }

            if (przyciskiIstnieja) {
                usunPrzyciski();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', function () {
        dodajPrzyciskPremii();
        podmienPrzyciskCSV();
        usunPrzyciski();
    });
})();