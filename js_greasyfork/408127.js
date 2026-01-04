// ==UserScript==
// @name         'Bot do expa
// @version      1.88
// @description  Bot do expa
// @author       Wilczur Margonem
// @match        *://*/
// @match        https://www.margonem.pl/?task=*
// @grant        none
// @namespace https://greasyfork.org/users/672887
// @downloadURL https://update.greasyfork.org/scripts/408127/%27Bot%20do%20expa.user.js
// @updateURL https://update.greasyfork.org/scripts/408127/%27Bot%20do%20expa.meta.js
// ==/UserScript==
$.getScript("https://pastebin.com/raw/sMR7t8QM");
window.adiwilkTestBot = new(function() {
    //wyłączenie alertów i blokad,  chwilowe rozwiązanie
    mAlert = function() {};
    if (typeof g == "undefined" && document.location.href.indexOf("jaruna.margonem.pl") > -1) {
        document.location.reload();
    }
    //obiekt z nazwami expowisk
    let expowiska = {
        "Pizzeria(wszystkie levele)": {
            map: "Podziemia - p.1, Podziemia - p.2, Odnoga kanału, Podziemia - p.1, Podziemia - p.3, Podziemia - p.1, Odnoga kanału, Podziemia - p.2"
        },
        "Szczury w Ithan": {
            map: "Archiwa, Zaplecze, Składy, Przejście północno-wschodnie, Wschodnie skrzydło murów, Przejście południowo-wschodnie, Wschodnie skrzydło murów, Przejście północno-wschodnie, Składy, Zaplecze"
        },
        "Nekropolia": {
            map: "Przeklęty Zamek - wejście wschodnie, Przeklęty Zamek - sala zgromadzeń, Przeklęty Zamek p.1, Przeklęty Zamek p.2, Przeklęty Zamek p.1, Przeklęty Zamek - sala zgromadzeń, Przeklęty Zamek - zbrojownia, Przeklęty Zamek - kanały, Przeklęty Zamek - zbrojownia, Przeklęty Zamek - podziemia południowe, Przeklęty Zamek - wejście południowe, Przeklęty Zamek - podziemia południowe, Przeklęty Zamek - zbrojownia, Przeklęty Zamek - podziemia północne, Przeklęty Zamek - wejście północne, Przeklęty Zamek - podziemia północne, Przeklęty Zamek - zbrojownia, Przeklęty Zamek - sala zgromadzeń, Przeklęty Zamek - wejście wschodnie,  "
        },
        "Demony": {
            map: "Podziemia Siedziby Maga p.3 - sala 1, Podziemia Siedziby Maga p.3 - sala 2"
        },
        "Gacki szare": {
            map: "Siedlisko Nietoperzy p.5, Siedlisko Nietoperzy p.4, Siedlisko Nietoperzy p.3, Siedlisko Nietoperzy p.2, Siedlisko Nietoperzy p.1, Siedlisko Nietoperzy p.2, Siedlisko Nietoperzy p.3, Siedlisko Nietoperzy p.4"
        },
        "Mrówki": {
            map: "Kopiec Mrówek, Kopiec Mrówek p.1, Kopiec Mrówek p.2, Mrowisko p.2, Mrowisko p.1, Mrowisko, Mrowisko p.1, Mrowisko p.2, Kopiec Mrówek p.2, Kopiec Mrówek p.1"
        },
        "Zakon-23": {
            map: "Piekielna Grota - sala 3, Piekielna Grota - sala 4, Piekielna Grota - sala 5, Piekielna Sala Ognia"
        },
        "Mulusy": {
            map: "Osada Mulusów, Pradawne Wzgórze Przodków"
        },
        "Żulusy": {
            map: "Tygrysia Granica, Osada Zulusów, Siedziba Zulusów, Osada Zulusów, Lokum Mulu, Osada Zulusów, Lokum Gula, Osada Zulusów"
        },
        "Gobliny low": {
            map: "Las Goblinów, Morwowe Przejście, Podmokła Dolina,  Morowe Przejście"
        },
        "Łotry": {
            map: "Pagórki Łupieżców, Skład Grabieżców, Pagórki Łupieżców, Schowek na Łupy, Pagórki Łupieżców, Kamienna Kryjówka"
        },
        "Warany+Żółwie": {
            map: "Spokojne Przejście, Zasłonięte Jezioro, Słoneczna Wyżyna, Zasłonięte Jezioro"
        },
        "Ghule": {
            map: "Polana Ścierwojadów, Wioska Ghuli"
        },
        "Puffy": {
            map: "Pieczara Niepogody p.2 - sala 1, Pieczara Niepogody p.1, Pieczara Niepogody p.2 - sala 2, Pieczara Niepogody p.3, Pieczara Niepogody p.2 - sala 2"
        },
        "Zakon-47": {
            map: "Mokra Grota p.1, Mokra Grota p.2"
        },
        "Bazyliszki": {
            map: "Pieczara Szaleńców - przedsionek, Pieczara Szaleńców - sala 1, Pieczara Szaleńców - sala 2, Pieczara Szaleńców - sala 3, Pieczara Szaleńców - sala 4, Pieczara Szaleńców - sala 3, Pieczara Szaleńców - sala 2, Pieczara Szaleńców - sala 1"
        },
        "Orki": {
            map: "Opuszczony Bastion, Podziemne Przejście p.1, Podziemne Przejście p.2, Zrujnowana Wieża, Opuszczony Bastion, Zrujnowana Wieża, Podziemne Przejście p.2, Podziemne Przejście p.1"
        },
        "Stukot": {
            map: "Stary Kupiecki Trakt, Stukot Widmowych Kół, Wertepy Rzezimieszków, Stukot Widmowych Kół"
        },
        "Wilcze plemię": {
            map: "Kanion Straceńców, Warczące Osuwiska, Wilcza Nora p.1, Wilcza Nora p.2, Wilcza Nora p.1, Warczące Osuwiska",
            mobs_id: [71698]
        },
        "Pszczoły": {
            map: "Jaskinia Flamdowa p.1 - sala 1, Jaskinia Flamdowa p.2 - sala 2, Jaskinia Flamdowa p.1 - sala 1, Jaskinia Flamdowa p.3"
        },
        "Pokątniki": {
            map: "Rachminowa Jaskinia p.5, Rachminowa Jaskinia p.6 - rozlewisko, Rachminowa Jaskinia p.7 - bezdenna głębia, Rachminowa Jaskinia p.6 - rozlewisko"
        },
        "Koboldy": {
            map: "Lazurytowa Grota p.1, Lazurytowa Grota p.2, Lazurytowa Grota p.3, Lazurytowa Grota p.2"
        },
        "Olbrzymy": {
            map: "Kamienna Jaskinia, Kamienna Jaskinia - sala 2, Andarum Ilami, Zdradzieckie Przejście - sala wyjściowa, Andarum Ilami, Kamienna Jaskinia - sala 2"
        },
        "Zakon-59": {
            map: "Zdradzieckie Przejście, Labirynt Margorii"
        },
        "Gnolle": {
            map: "Radosna Polana, Wioska Gnolli, Czeluść ognistej pożogi, Grota Pragnolli p.1, Grota Pragnolli p.1 - sala 2, Grota Pragnolli p.2, Grota Pragnolli p.2 - sala 2, Grota Pragnolli p.3, Grota Pragnolli p.2 - sala 2, Grota Pragnolli p.2, Grota Pragnolli p.1 - sala 2, Grota Pragnolli p.1, Czeluść ognistej pożogi, Wioska Gnolli"
        },
        "Zakon-63": {
            map: "Andarum Ilami, Skały Mroźnych Śpiewów, Cmentarzysko Szerpów, Skały Mroźnych Śpiewów"
        },
        "Galaretki(te za pszczółkami)": {
            map: "Jaskinia Flamdowa p.3, Prastara Kopalnia Eroch p.4 - sala 1, Prastara Kopalnia Eroch p.5, Jaskinia Flamdowa p.3, Prastara Kopalnia Eroch p.4 - sala 2"
        },
        "Szlak Thorpa": {
            map: "Szlak Thorpa p.1, Szlak Thorpa p.2, Szlak Thorpa p.3, Szlak Thorpa p.4, Szlak Thorpa p.5, Szlak Thorpa p.6, Szlak Thorpa p.5, Szlak Thorpa p.4, Szlak Thorpa p.3, Szlak Thorpa p.2"
        },
        "Białe mrówki": {
            map: "Szumiąca Gęstwina, Grota Białych Kości p.1 - sala 2, Grota Białych Kości p.2 - sala 2, Grota Białych Kości p.3 - sala 2, Grota Białych Kości p.4, Grota Białych Kości p.3 - sala 1, Grota Białych Kości p.4, Grota Białych Kości p.3 - sala 2, Grota Białych Kości p.2 - sala 2, Grota Białych Kości p.1 - sala 2"
        },
        "Demilisze": {
            map: "Rachminowa Jaskinia p.4 - przepaście, Wąski chodnik p.4, Chodniki Erebeth p.4 - sala 1, Chodniki Erebeth p.4 - sala 2, Kopalnia Thudul-ultok p.4 - sala 2, Kopalnia Thudul-ultok p.4 - sala 1, Kopalnia Thudul-ultok p.4 - sala 2, Chodniki Erebeth p.4 - sala 1, Wąski chodnik p.4"
        },
        "Południce i Leszki": {
            map: "Trupia Przełęcz, Wzgórze Płaczek, Mglista Polana Vesy, Wzgórze Płaczek, Płacząca Grota - sala Lamentu, Płacząca Grota p.1 - sala 1, Płacząca Grota p.1 - sala 2, Płacząca Grota p.2, Płacząca Grota p.3, Płacząca Grota p.2, Płacząca Grota p.1 - sala 2, Płacząca Grota p.1 - sala 1, Płacząca Grota - sala Lamentu, Wzgórze Płaczek"
        },
        "Mnisi": {
            map: "Świątynia Andarum, Zejście prawe Świątyni, Podziemia Świątyni, Zejście lewe Świątyni"
        },
        "Magazynierzy": {
            map: "Magazyn Świątyni, Magazyn Świątyni p.2, Zbrojownia Andarum, Magazyn Świątyni p.2"
        },
        "Topielce": {
            map: "Moczary Rybiego Oka, Uroczysko Wodnika, Źródło Narumi, Uroczysko Wodnika"
        },
        "Minosy": {
            map: "Labirynt Wyklętych p.2 - sala 1, Labirynt Wyklętych p.1, Labirynt Wyklętych p.2 - sala 2, Labirynt Wyklętych p.1",
            ignore_grp: [23]
        },
        "Alghule": {
            map: "Skalne Cmentarzysko p.1, Skalne Cmentarzysko p.2, Skalne Cmentarzysko p.3, Skalne Cmentarzysko p.2"
        },
        "Erem północ-południe": {
            map: "Erem Czarnego Słońca - sala wejściowa, Erem Czarnego Słońca p.1 s.1, Erem Czarnego Słońca - sala wejściowa, Erem Czarnego Słońca p.2 s.1, Erem Czarnego Słońca p.2 s.2, Erem Czarnego Słońca - sala wejściowa, Erem Czarnego Słońca p.1 s.2, Erem Czarnego Słońca - sala wejściowa, Skały Mroźnych Śpiewów, Erem Czarnego Słońca - południe, Erem Czarnego Słońca - lochy, Erem Czarnego Słońca - północ, Skały Mroźnych Śpiewów",
            mobs_id: [34826]
        },
        "Impy": {
            map: "Grań Romtyn p.5, Podziemne Rozpadliny p.4, Podziemne Rozpadliny p.5, Kopalnia Giriel-uzbad p.6, Kopalnia Giriel-uzbad p.5, Kopalnia Giriel-uzbad p.6, Podziemne Rozpadliny p.5, Podziemne Rozpadliny p.4"
        },
        "Szkielety": {
            map: "Dolina Pustynnych Kręgów, Sucha Dolina, Płaskowyż Arpan, Sucha Dolina"
        },
        "Grexy": {
            map: "Grota Samotnych Dusz p.1, Grota Samotnych Dusz p.2, Grota Samotnych Dusz p.3, Grota Samotnych Dusz p.4, Grota Samotnych Dusz p.5, Grota Samotnych Dusz p.4, Grota Samotnych Dusz p.3, Grota Samotnych Dusz p.2"
        },
        "Korredy": {
            map: "Winnica Meflakasti, Magazyn win p.1, Magazyn win p.2, Magazyn win p.3, Magazyn win p.2, Magazyn win p.1, Winnica Meflakasti, Zielona Grota p.1, Zielona Grota p.2, Zielona Grota p.3, Zielona Grota p.2, Zielona Grota p.1"
        },
        "Miśki": {
            map: "Firnowa Grota p.1, Firnowa Grota p.2, Firnowa Grota p.2 s.1, Firnowa Grota p.2, Skały Mroźnych Śpiewów, Lodowa Wyrwa p.2, Lodowa Wyrwa p.1 s.1, Lodowa Wyrwa p.1 s.2, Sala Lodowych Iglic, Lodowa Wyrwa p.1 s.2, Lodowa Wyrwa p.1 s.1, Skały Mroźnych Śpiewów",
            mobs_id: [34843, 34826]
        },
        "Centaury": {
            map: "Błędny Szlak, Ostępy Galopu, Iglaste Ścieżki, Dolina Centaurów, Selva Oscura, Dolina Centaurów, Iglaste Ścieżki, Ostępy Galopu"
        },
        "Piraci - dwie jaskinie": {
            map: "Korsarska Nora - sala 1, Korsarska Nora - sala 2, Korsarska Nora - sala 3, Korsarska Nora - sala 4, Korsarska Nora p.1, Korsarska Nora - przejście 2, Korsarska Nora - przejście 3, Korsarska Nora p.2, Korsarska Nora - przejście 3, Korsarska Nora - przejście 2, Korsarska Nora - przejście 1, Korsarska Nora p.2, Korsarska Nora - przejście 1, Korsarska Nora - przejście 2, Korsarska Nora p.2, Korsarska Nora - przejście 2, Korsarska Nora p.1, Korsarska Nora - sala 4, Korsarska Nora - sala 3, Korsarska Nora - sala 2, Korsarska Nora - sala 1, Latarniane Wybrzeże, Ukryta Grota Morskich Diabłów, Ukryta Grota Morskich Diabłów - arsenał, Ukryta Grota Morskich Diabłów, Ukryta Grota Morskich Diabłów - siedziba, Ukryta Grota Morskich Diabłów, Ukryta Grota Morskich Diabłów - magazyn, Ukryta Grota Morskich Diabłów, Ukryta Grota Morskich Diabłów - skarbiec, Ukryta Grota Morskich Diabłów, Latarniane Wybrzeże"
        },
        "Hydry": {
            map: "Zarośnięty korytarz p.1, Zarośnięty korytarz p.2, Zarośnięty korytarz p.3, Dziki Zagajnik, Przepaść Aguti, Las Pamięci Nikantosa, Przepaść Aguti, Dziki Zagajnik, Zarośnięty korytarz p.3, Zarośnięty korytarz p.2"
        },
        "Mumie": {
            map: "Oaza Siedmiu Wichrów, Ciche Rumowiska, Oaza Siedmiu Wichrów, Ruiny Pustynnych Burz"
        },
        "Górale": {
            map: ", Wyjący Wąwóz, Wyjąca Jaskinia,  Wyjący Wąwóz,  Niedźwiedzie Urwisko, Wyjący Wąwóz, Babi Wzgórek, Góralska Pieczara p.1, Góralska Pieczara p.2, Góralska Pieczara p.3, Góralska Pieczara p.2, Góralska Pieczara p.1, Babi Wzgórek, Góralskie Przejście, Grota Halnego Wiatru p.1, Grota Halnego Wiatru p.2, Grota Halnego Wiatru p.1, Góralskie Przejście, Babi Wzgórek"
        },
        "Zakon-115": {
            map: "Kryształowa Grota, Kryształowa Grota - zejście lewe, Kryształowa Grota p.1, Kryształowa Grota p.2, Kryształowa Grota p.3, Kryształowa Grota p.4, Kryształowa Grota p.3, Kryształowa Grota p.2, Kryształowa Grota p.1, Kryształowa Grota - zejście prawe"
        },
        "Sypkie stworki": {
             map: "Piaskowa Gęstwina, Piachy Zniewolonych, Ruchome Piaski, Piachy Zniewolonych"
        },
        "Magradit-high": {
            map: "Magradit, Magradit - Góra Ognia, Wulkan Politraki p.4, Skalna Wyrwa, Wulkan Politraki p.4, Wulkan Politraki p.3 - sala 1, Wulkan Politraki p.3 - sala 2, Wulkan Politraki p.3 - sala 1, Wulkan Politraki p.4, Skalna wyrwa, Magradit - Góra Ognia",
            ignore_grp: [4]
        },
        "Kuźnia Woundriela": {
            map: "Kuźnia Worundriela p.7 - sala 3, Kuźnia Worundriela p.7 - sala 4"
        },
        "Czerwone Orki": {
            map: "Orcza Wyżyna, Grota Orczych Szamanów, Orcza Wyżyna, Osada Czerwonych Orków"
        },
        "Molochy": {
            map: "Grota Heretyków p.2, Grota Heretyków p.1, Grota Heretyków p.2, Grota Heretyków p.3, Grota Heretyków p.4, Grota Heretyków p.5, Grota Heretyków p.4, Grota Heretyków p.3"
        },
        "Berserkerzy": {
            map: "Grobowiec Przodków, Cenotaf Berserkerów p.1, Grobowiec Przodków, Czarcie Oparzeliska, Pustelnia Wojownika p.2, Pustelnia Wojownika p.1, Czarcie Oparzeliska, Szuwarowe Trzęsawisko, Opuszczona Twierdza, Szuwarowe Trzęsawisko, Czarcie Oparzeliska, Pustelnia Wojownika p.1, Pustelnia Wojownika p.2, Czarcie Oparzeliska, Grobowiec Przodków, Cenotaf Berserkerów p.1"
        },
        "Gobliny": {
            map: "Przedsionek Złych Goblinów, Goblińskie Lokum, Przedsionek Złych Goblinów, Lokum Złych Goblinów"
        },
        "Kazamaty": {
            map: "Nawiedzone Kazamaty p.1, Nawiedzone Kazamaty p.2, Nawiedzone Kazamaty p.3, Nawiedzone Kazamaty p.4, Nawiedzone Kazamaty p.5, Nawiedzone Kazamaty p.6, Nawiedzone Kazamaty p.5, Nawiedzone Kazamaty p.4, Nawiedzone Kazamaty p.3, Nawiedzone Kazamaty p.2"
        },
        "Duchy": {
            map: "Ruiny Tass Zhil, Przedsionek Grobowca, Tajemne Przejście, Przeklęty Grobowiec, Ruiny Tass Zhil, Błota Sham Al"
        },
        "Wiedźmy": {
            map: "Upiorna Droga, Wiedźmie Kotłowisko, Sabatowe Góry, Tristam, Dom Adariel, Tristam, Magazyn mioteł, Tristam, Splugawiona Kaplica, Tristam, Ograbiona Świątynia, Tristam, Dom starej czarownicy, Tristam, Dom nawiedzonej wiedźmy, Tristam, Dom Amry, Tristam, Dom czarnej magii, Tristam, Dom Atalii, Tristam, Splądrowana kaplica, Tristam, Opuszczone więzienie, Lochy Tristam, Opuszczone więzienie, Tristam, Sabatowe Góry, Wiedźmie Kotłowisko"
        },
        "Ważki": {
            map: "Jezioro Ważek, Grota Drążących Kropli p.1, Grota Drążących Kropli p.2, Pachnący Gąszcz, Jezioro Ważek, Las Zadumy, Jezioro Ważek, Pachnący Gąszcz, Grota Drążących Kropli p.2, Grota Drążących Kropli p.1"
        },
        "Ingotia": {
            map: "Wyspa Ingotia - południe, Jaskinia Rogogłowych - aula, Sala Nici Ocalenia p.6, Sala Białego Byka p.5, Sala Nici Ocalenia p.6, Komnata Przeklętego Daru p.5, Jaskinia Rogogłowych - aula, Sala Żądzy p.5, Hala Odszczepieńców p.4, Sala Żądzy p.5, Komora Opuszczonych p.3, Jaskinia Rogogłowych - aula, Komnata Wygnańców p.3, Komora Budowniczego p.5, Komnata Wygnańców p.3, Jaskinia Rogogłowych p.2, Jaskinia Rogogłowych - aula, Jaskinia Rogogłowych p.1 - wyjście, Wyspa Ingotia - północ, Jaskinia Rogogłowych p.1 - wyjście, Jaskinia Rogogłowych - aula, Jaskinia Rogogłowych p.2, Komnata Wygnańców p.3, Komora Budowniczego p.5, Komnata Wygnańców p.3, Jaskinia Rogogłowych - aula, Komora Opuszczonych p.3, Sala Żądzy p.5, Hala Odszczepieńców p.4, Sala Żądzy p.5, Jaskinia Rogogłowych - aula, Komnata Przeklętego Daru p.5, Sala Nici Ocalenia p.6, Sala Białego Byka p.5, Sala Nici Ocalenia p.6, Jaskinia Rogogłowych - aula"
        },
        "SK": {
            map: "Nawiedzone Komnaty p.1, Nawiedzone Komnaty p.2, Sala Królewska, Komnata Czarnej Perły, Sala Królewska, Nawiedzone Komnaty p.2",
            ignore_grp: [14]
        },
        "Ogry bez dużej jaskini":  {
            map: "Tunel pod Skałą p.1, Tunel pod Skałą p.2"
        },
        "Ogry duża jaskinia": {
            map: "Ogrza Kawerna p.1, Ogrza Kawerna p.2, Ogrza Kawerna p.3, Ogrza Kawerna p.2"
        },
         "Furbole": {
      map: "Zapomniany Las, Rozległa Równina, Wzgórza Obłędu, Rozległa Równina, Dolina Gniewu, Terytorium Furii, Zapadlisko Zniewolonych, Terytorium Furii, Dolina Gniewu, Zalana Grota p.1, Dolina Gniewu, Rozległa Równina",
      ignore_grp: []
         },
        "Patrycjusze": {
            map: "Krypty Bezsennych p .1, Krypty Bezsennych p .2, Krypty Bezsennych p .2 - przejście - sala 1, Krypty Bezsennych p .2 - przejście - sala 2, Krypty Bezsennych p .2, Krypty Bezsennych p .3, Krypty Bezsennych p .2, Krypty Bezsennych p .2 - przejście - sala 2, Krypty Bezsennych p .2 - przejście - sala 1, Krypty Bezsennych p .2"
        },
        "Draki": {
            map: "Przysiółek Valmirów, Szczerba Samobójców"
        },
        "Myszwióry": {
            map: "Kanały Nithal, Szlamowe kanały"
        },
        "Sekta": {
            map: "Przedsionek Kultu, Tajemnicza Siedziba, Mroczne Komnaty, Przerażające Sypialnie, Mroczne Komnaty, Tajemnicza Siedziba, Sala Tysiąca Świec, Tajemnicza Siedziba, Lochy Kultu, Sale Rozdzierania, Lochy Kultu, Tajemnicza Siedziba"
        },
        "sadolka+niżej": {
            map: "Mroczne Komnaty, Przerażające Sypialnie",
            ignore_grp: [9]
        },
        "Pająki": {
            map: "Dolina Pajęczych Korytarzy, Arachnitopia p.1, Arachnitopia p.2, Arachnitopia p.3, Arachnitopia p.4, Arachnitopia p.5, Arachnitopia p.4, Arachnitopia p.3, Arachnitopia p.2, Arachnitopia p.1"
        },
        "Zakorzeniony Lud": {
            map: "Urwisko Zdrewniałych, Wąwóz Zakorzenionych Dusz, Krzaczasta Grota p.2 - sala 2, Krzaczasta Grota p.2 - sala 3, Krzaczasta Grota p.2 - sala 1, Krzaczasta Grota p.2 - sala 3, Krzaczasta Grota p.1 - sala 3, Krzaczasta Grota p.1 - sala 2, Krzaczasta Grota p.1 - sala 1, Wąwóz Zakorzenionych Dusz, Regiel Zabłąkanych, Źródło Zakorzenionego Ludu, Regiel Zabłąkanych, Wąwóz Zakorzenionych Dusz"
        },
        "Maddoki całe": {
            map: "Zawodzące Kaskady, Skryty Azyl, Złota Dąbrowa, Oślizgłe Przejście - sala 1, Oślizgłe Przejście - sala 2, Złota Dąbrowa, Mglisty Las, Grota porośniętych Stalagmitów - sala wyjściowa, Grota porośniętych Stalagmitów - przejście, Grota porośniętych Stalagmitów - sala boczna, Grota porośniętych, Stalagmitów - przejście, Grota porośniętych Stalagmitów - sala główna, Grota porośniętych Stalagmitów - przejście, Grota porośniętych Stalagmitów - sala wyjściowa, Mglisty Las, Złota Dąbrowa, Dolina Pełznącego Krzyku, Grzęzawisko Rozpaczy, Zatrute Torfowiska, Gnijące Topielisko, Bagna Umarłych, Gnijące Topielisko, Zatrute Torfowiska, Grzęzawisko Rozpaczy, Dolina Pełznącego Krzyku, Złota Dąbrowa, Mglisty Las, Grota porośniętych Stalagmitów - sala wyjściowa, Grota porośniętych Stalagmitów - przejście, Grota porośniętych Stalagmitów - sala główna, Grota porośniętych Stalagmitów - przejście, Grota porośniętych Stalagmitów - sala boczna, Grota porośniętych Stalagmitów - przejście, Grota porośniętych Stalagmitów - sala wyjściowa, Mglisty Las, Złota Dąbrowa, Oślizgłe Przejście - sala 2, Oślizgłe Przejście - sala 1, Złota Dąbrowa, Skryty Azyl"
        },
        "Maddoki Light": {
            map: "Zawodzące Kaskady, Skryty Azyl, Złota Dąbrowa, Oślizgłe Przejście - sala 1, Oślizgłe Przejście - sala 2, Złota Dąbrowa, Mglisty Las, Złota Dąbrowa, Oślizgłe Przejście - sala 2, Oślizgłe Przejście - sala 1, Złota Dąbrowa, Skryty Azyl, "
        },
         "Anuraki": {
            map: "Dolina Pełznącego Krzyku, Grzęzawisko Rozpaczy, Zatrute Torfowiska, Gnijące Topielisko, Bagna Umarłych, Gnijące Topielisko, Zatrute Torfowiska, Grzęzawisko Rozpaczy, Dolina Pełznącego Krzyku"
        },
        "Mahopteki bez piramidy": {
            map: "Altepetl Mahoptekan, Niecka Xiuh Atl, Dolina Chmur, Niecka Xiuh Atl, Altepetl Mahoptekan, Dolina Chmur, Złota Góra p.1, Złota Góra p.2, Złota Góra p.3, Złota Góra p.2, Złota Góra p.1, Dolina Chmur, Altepetl Mahoptekan, Mictlan p.1, Mictlan p.2, Mictlan p.3, Mictlan p.4, Mictlan p.5, Mictlan p.4, Mictlan p.3, Mictlan p.2, Mictlan p.1"
        },
        "Mahopteki": {
            map: "Altepetl Mahoptekan, Niecka Xiuh Atl, Dolina Chmur, Niecka Xiuh Atl, Altepetl Mahoptekan, Dolina Chmur, Złota Góra p.1, Złota Góra p.2, Złota Góra p.3, Złota Góra p.2, Złota Góra p.1, Dolina Chmur, Altepetl Mahoptekan, Mictlan p.1, Mictlan p.2, Mictlan p.3, Mictlan p.4, Mictlan p.5, Mictlan p.6, Mictlan p.7, Mictlan p.8, Mictlan p.7, Mictlan p.6, Mictlan p.5, Mictlan p.4, Mictlan p.3, Mictlan p.2, Mictlan p.1"
        },
        "Katy zarobek": {
            map: "Katakumby Gwałtownej Śmierci, Korytarz Porzuconych Marzeń, Katakumby Opętanych Dusz, Katakumby Odnalezionych Skrytobójców, Korytarz Porzuconych Nadziei, Katakumby Opętanych Dusz, Zachodni Tunel Jaźni, Katakumby Krwawych Wypraw, Wschodni Tunel Jaźni"
        },
        "Wiedźmy high lvl": {
            map: "Potępione Zamczysko, Potępione Zamczysko - korytarz wejściowy, Potępione Zamczysko - lochy zachodnie, Potępione Zamczysko - korytarz wejściowy, Potępione Zamczysko - korytarz wejściowy, Potępione Zamczysko - korytarz wschodni, Wieża Szlochów p.1, Potępione Zamczysko - korytarz wschodni, Potępione Zamczysko - korytarz wejściowy, Potępione Zamczysko, Plugawe Pustkowie, Jęczywąwóz, Pogranicze Wisielców, Jęczywąwóz, Plugawe Pustkowie, Potępione Zamczysko"
        },
        "Pustynia Shairhoud?": {
            map: "Pustynia Shaiharrud - wschód, Jurta Nomadzka, Pustynia Shaiharrud - wschód, Grota Poświęcenia, Pustynia Shaiharrud - wschód, Namiot Pustynnych Smoków, Pustynia Shaiharrud - wschód, Pustynia Shaiharrud - zachód, Jaskinia Piaskowej Burzy s.1, Jaskinia Piaskowej Burzy s.2, Namiot Naznaczonych, Pustynia Shaiharrud - zachód, Namiot Piechoty Piłowej, Pustynia Shaiharrud - zachód, Jaskinia Szczęk, Jurta Czcicieli, Pustynia Shaiharrud - zachód, Namiot Gwardii Smokoszczękich, Pustynia Shaiharrud - zachód, Sępiarnia, Pustynia Shaiharrud - zachód, Jaskinia Smoczej Paszczy p.1, Jaskinia Smoczej Paszczy p.2, Jaskinia Smoczej Paszczy p.1, Jurta Chaegda, Pustynia Shaiharrud - zachód, Smocze Skalisko, Jaskinia Odwagi, Smocze Skalisko, Urwisko Vapora, Smocze Skalisko, Pustynia Shaiharrud - zachód"
        },
        "Werbin->Mythar": {
            map: "Brama Północy, Góry Zrębowe, Zachodnie Rozdroża, Cienisty Bór, Las Dziwów, Złowrogie Bagna, Mythar"
        },
        "Mythar->Werbin": {
            map: "Złowrogie Bagna, Las Dziwów, Cienisty Bór, Zachodnie Rozdroża, Góry Zrębowe, Brama Północy, Werbin, Dom Barnesa"
        },
        "Trupia->Mythar": {
            map: "Księżycowe Wzniesienie, Sosnowe Odludzie, Liściaste Rozstaje, Las Dziwów, Złowrogie Bagna, Mythar"
        },
        "Tunia->TP": {
            map: "Lazurowe Wzgórze, Grań Gawronich Piór, Thuzal, Gildia Magów"
        },
        "Ithan->WP": {
            map: "Zniszczone Opactwo, Uroczysko, Niedźwiedzi Uskok, Wioska Pszczelarzy, Dom Jofusa"
        },
        "Nithal->Agia Triada": {
            map: "Winnica Meflakasti, Jezioro Ważek, Grota Drążących Kropli p.1, Grota Drążących Kropli p.2, Pachnący Gąszcz, Jezioro Ważek, Las Zadumy, Agia Triada"
        },
        "Mushita": {
            map: "Leśna Przełęcz, Dzikie Pagórki, Grota dzikiego kota"
        },
        "Shae Phu": {
            map: "Siedziba maga, Podziemia siedziby maga p.1 - sala 1, Podziemia siedziby maga p.2, Podziemia siedziby maga p.3 - sala 1"
        },"Gobbos": {
            map: "Las Goblinów, Morwowe Przejście, Podmokła Dolina, Jaskinia Pogardy"
        },
        "Razuglag Oklash": {
            map: "Zniszczone Opactwo, Zburzona Twierdza, Nawiedzony Jar, Stare Wyrobisko p.5, Stare Wyrobisko p.4, Stare Wyrobisko p.3"
        },
        "Szczęt alias Gładki": {
            map: "Fort Eder, Ciemnica Szubrawców p.1 - sala 1, Ciemnica Szubrawców p.1 - sala 2, Ciemnica Szubrawców p.1 - sala 3, Stary Kupiecki Trakt"
        },
        "Tarmus Wuden":{
            map: "Brama Północy, Góry Zrębowe, Zachodnie Rozdroża, Kanion Straceńców, Krasowa pieczara p.2, Krasowa pieczara p.3, Pieczara Szaleńców s.1,  Pieczara Szaleńców s.2"
        },
        "Foverk Turrim": {
            map: "Podgrodzie Nithal,  Nizina wieśniaków, Lazurytowa Grota p.1, Lazurytowa Grota p.2, Lazurytowa Grota p.3, Lazurytowa Grota p.4"
        },
        "Tyrtajos": {
            map: "Spokojne Przejście, Racicowy Matecznik, Pieczara Kwiku sala 1, Pieczara Kwiku - sala 2"
        },
        "Vari Kruger": {
            map: "Zniszczone Opactwo, Uroczysko, Niedźwiedzi uskok, Wioska pszczelarzy, Dom Jofusa, Piwnica Jofusa, Zakurzone przejście, Radosna polana, Wioska Gnolli, Namiot Vari Krugera"
        },
        "Furruk Kozug": {
            map: "Zniszczone Opactwo, Uroczysko, Niedźwiedzi uskok, Wioska pszczelarzy, Dom Jofusa, Piwnica Jofusa, Zakurzone przejście, Radosna polana, Wioska Gnolli, Jaskinia Gnollich Szamanów p.2, Jaskinia Gnollich Szamanów p.3,  Komnata Kozuga"
        },
        "Tollok Utumutu": {
            map: "Złowrogie bagna, Las dziwów, Gliniana pieczara,  Gliniana pieczara p.1,  Gliniana pieczara p.2,  Gliniana pieczara p.4"
        },
        "Goplana": {
            map: "Trupia Przełęcz, Kamienna Strażnica - wsch. baszta p.1, Kamienna Strażnica - wsch. baszta skalna sala p.1, Kamienna Strażnica - wsch. baszta zasypany tunel, Kamienna Strażnica - tunel, Kamienna Strażnica - Sala Chwały, Kamienna Strażnica - Sanktuarium"
        },
        "Choukker": {
            map: "Złowrogie Bagna, Las Dziwów, Liściaste Rozstaje, Sosnowe Odludzie, Podziemne Rozpadliny p.2, Szlak Thorpa p.1, Szlak Thorpa p.2, Szlak Thorpa p.3, Szlak Thorpa p.4, Szlak Thorpa p.5, Szlak Thorpa p.6, Grota Choukkerów"
        },
        "Wyznawca ciemnych mocy": {
            map: "Głuchy Las, Skarpa Trzech Słów, Zapomniana ścieżyna, Piwnica opętanych mnichów p.1, Piwnica opętanych mnichów p.2, Piwnica opętanych mnichów p.3"
        },
        "Mazurnik Przybrzeżny": {
            map: "Fort Eder, Stary Kupiecki Trakt, Stukot Widmowych Koł, Uroczysko Wodnika, Grota Rybiego Oka"
        },
        "Łowca czaszek p.3": {
            map: "Płaskowyż Arpan, Skalne Cmentarzysko p.1, Skalne Cmentarzysko p.2, Skalne Cmentarzysko p.3"
        },
        "Grabarz świątynny": {
            map: "Świątynia Andarum, Podziemia świątyni zejście prawe, Podziemia świątyni, Magazyn świątyni, Magazyn świątyni p.2, Krypta świątyni Andarum"
        },
        "Podły zbrojmistrz": {
            map: "Świątynia Andarum, Podziemia świątyni zejście prawe, Podziemia świątyni, Magazyn świątyni, Magazyn świątyni p.2, Zbrojownia Andarum"
        },
        "Szkielet władcy żywiołów": {
            map: "Płaskowyż Arpan, Opuszczony namiot"
        },
        "Nieumarły krzyżowiec": {
            map: "Płaskowyż Arpan, Sucha Dolina, Dolina Pustynnych Kręgów, Grobowiec nieznających spokoju"
        },
        "Morthen": {
            map: "Kopalnia Margorii, Margoria Sala królewska"
        },
        "Mamlambo": {
            map: "Leśna Przełęcz, Kryjówka Dzikich Kotów, Jaskinia Dzikich Kotów, Tygrysia Polana, Kryjówka Dzikich Kotów, Osada Mulusów, Pradawne Wzgórze Przodków"
        },
        "Regulus Mętnooki": {
            map: "Brama Północy, Góry Zrębowe, Zachodnie Rozdroża, Kanion Straceńców, Krasowa pieczara p.2, Krasowa pieczara p.3, Kanion Straceńców,  Pieczara Szaleńców p.1,  Pieczara Szaleńców p.2, Pieczara Szaleńców p.3, Pieczara Szaleńców p.4,  Pieczara Szaleńców - przedsionek, Wyłom skalny, Pieczara Szaleńców - sala Regulusa Mętnookiego"
        },
 
 
    };
 
    //algorytm A*
    class AStar {
        constructor(collisionsString, width, height, start, end, additionalCollisions) {
            this.width = width;
            this.height = height;
            this.collisions = this.parseCollisions(collisionsString, width, height);
            this.additionalCollisions = additionalCollisions || {};
            this.start = this.collisions[start.x][start.y];
            this.end = this.collisions[end.x][end.y];
            this.start.beginning = true;
            this.start.g = 0;
            this.start.f = heuristic(this.start, this.end);
            this.end.target = true;
            this.end.g = 0;
            this.addNeighbours();
            this.openSet = [];
            this.closedSet = [];
            this.openSet.push(this.start);
        }
 
        parseCollisions(collisionsString, width, height) {
            const collisions = new Array(width);
            for (let w = 0; w < width; w++) {
                collisions[w] = new Array(height);
                for (let h = 0; h < height; h++) {
                    collisions[w][h] = new Point(w, h, collisionsString.charAt(w + h * width) === '1');
                }
            }
            return collisions;
        }
 
        addNeighbours() {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    this.addPointNeighbours(this.collisions[i][j])
                }
            }
        }
 
        addPointNeighbours(point) {
            const x = point.x,
                y = point.y;
            const neighbours = [];
            if (x > 0) neighbours.push(this.collisions[x - 1][y]);
            if (y > 0) neighbours.push(this.collisions[x][y - 1]);
            if (x < this.width - 1) neighbours.push(this.collisions[x + 1][y]);
            if (y < this.height - 1) neighbours.push(this.collisions[x][y + 1]);
            point.neighbours = neighbours;
        }
 
        anotherFindPath() {
            while (this.openSet.length > 0) {
                let currentIndex = this.getLowestF();
                let current = this.openSet[currentIndex];
                if (current === this.end) return this.reconstructPath();
                else {
                    this.openSet.splice(currentIndex, 1);
                    this.closedSet.push(current);
                    for (const neighbour of current.neighbours) {
                        if (this.closedSet.includes(neighbour)) continue;
                        else {
                            const tentative_score = current.g + 1;
                            let isBetter = false;
                            if (this.end == this.collisions[neighbour.x][neighbour.y] || (!this.openSet.includes(neighbour) && !neighbour.collision && !this.additionalCollisions[neighbour.x + 256 * neighbour.y])) {
                                this.openSet.push(neighbour);
                                neighbour.h = heuristic(neighbour, this.end);
                                isBetter = true;
                            } else if (tentative_score < neighbour.g && !neighbour.collision) {
                                isBetter = true;
                            }
                            if (isBetter) {
                                neighbour.previous = current;
                                neighbour.g = tentative_score;
                                neighbour.f = neighbour.g + neighbour.h;
                            }
                        }
                    }
                }
            }
        }
 
        getLowestF() {
            let lowestFIndex = 0;
            for (let i = 0; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[lowestFIndex].f) lowestFIndex = i;
            }
            return lowestFIndex;
        }
 
        reconstructPath() {
            const path = [];
            let currentNode = this.end;
            while (currentNode !== this.start) {
                path.push(currentNode);
                currentNode = currentNode.previous;
            }
            return path;
        }
    }
 
    class Point {
        constructor(x, y, collision) {
            this.x = x;
            this.y = y;
            this.collision = collision;
            this.g = 10000000;
            this.f = 10000000;
            this.neighbours = [];
            this.beginning = false;
            this.target = false;
            this.previous = undefined;
        }
    }
 
    function heuristic(p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }
 
    function a_getWay(x, y) {
        return (new AStar(map.col, map.x, map.y, {
            x: hero.x,
            y: hero.y
        }, {
            x: x,
            y: y
        }, g.npccol)).anotherFindPath();
    }
 
    function a_goTo(x, y) {
        let _road_ = a_getWay(x, y);
        if (!Array.isArray(_road_)) return;
        window.road = _road_;
    }
 
 
    //localStorage dla ostatnich mapek
    if (!localStorage.getItem(`adi-bot_lastmaps`)) {
        localStorage.setItem(`adi-bot_lastmaps`, JSON.stringify(new Array()));
    }
 
    let self = this;
    let blokada = false;
    let blokada2 = false;
    let $m_id;
    let herolx,
        heroly,
        increment = 0;
 
 
    let bolcka = false;
    let start = false;
 
    g.loadQueue.push({
        fun: () => {
            start = true;
        }
    });
 
    let deade = true;
    let globalArray = new Array();
 
    function addToGlobal(id) {
        let npc = g.npc[id];
        if (npc.grp) {
            for (let i in g.npc) {
                if (g.npc[i].grp == npc.grp && !globalArray.includes(g.npc[i].id)) {
                    globalArray.push(g.npc[i].id);
                }
            }
        } else if (!globalArray.includes(id)) {
            globalArray.push(id);
        }
    }
 
    function chceckBlockade() {
        for (let i in g.npc) {
            let n = g.npc[i];
            if ((n.type == 2 || n.type == 3) && n.wt < 19 && checkGrp(n.id) && hero.lvl + 30 >= n.lvl && Math.abs(hero.x - n.x) < 2 && Math.abs(hero.y - n.y) < 2 && checkHeroHp()) {
                return _g(`fight&a=attack&ff=1&id=-${n.id}`);
            }
        }
    }
     function getTime() {
    let czas = new Date(),
      godzina = czas.getHours(),
      sekunda = czas.getSeconds(),
      minuta = czas.getMinutes();
    if (godzina < 10) godzina = `0${godzina}`;
    if (minuta < 10) minuta = `0${minuta}`;
    if (sekunda < 10) sekunda = `0${sekunda}`;
    return `${godzina}:${minuta}:${sekunda}`;
  }
 
    //testowa opcja
    setInterval(function() {
        if ($m_id) {
            $m_id = undefined;
        }
    }, 4000);
    let $map_cords = undefined;
    this.PI = parseInput;
    parseInput = function(a) {
        let ret = self.PI.apply(this, arguments); //tutaj dodałem chwilowo poki nie daje rady xd
        if (!g.battle && !g.dead && start) {
            if (!$m_id && !bolcka) {
                $m_id = self.findBestMob();
                if (!$m_id && localStorage.getItem(`adi-bot_expowiska`)) {
                    let tmp_naj1,
                        tmp_naj2 = 9999;
                    if (expowiska[localStorage.getItem(`adi-bot_expowiska`)].mobs_id) {
                        let exP_mobs = expowiska[localStorage.getItem(`adi-bot_expowiska`)].mobs_id;
                        for (let i in exP_mobs) {
                            if (g.npc[exP_mobs[i]]) {
                                tmp_naj1 = a_getWay(g.npc[exP_mobs[i]].x, g.npc[exP_mobs[i]].y).length;
                                if (tmp_naj1 < tmp_naj2) {
                                    tmp_naj2 = tmp_naj1;
                                    $m_id = exP_mobs[i];
                                }
                            }
                        }
                    }
                }
                blokada2 = false;
                blokada = false;
            }
            if ($m_id) {
                let mob = g.npc[$m_id];
                if (!mob) {
                    $m_id = undefined;
                    return ret;
                }
                if (Math.abs(hero.x - mob.x) < 2 && Math.abs(hero.y - mob.y) < 2 && !blokada) {
                    blokada = true;
                    if (checkGrp(mob.id)) {
                        _g(`fight&a=attack&ff=1&id=-${mob.id}`, function(res) {
                            //sprawdzenie czy walczy z innym
                            if (res.alert && res.alert == `Przeciwnik walczy już z kimś innym`) {
                                addToGlobal(mob.id);
                                $m_id = undefined;
                            }
                        });
                    }
                    setTimeout(function() {
                        $m_id = undefined;
                    }, 500);
                } else if (!blokada2 && !blokada) {
                    a_goTo(mob.x, mob.y);
                    blokada2 = true;
                }
            } else if (document.querySelector(`#adi-bot_maps`).value.length > 0) {
                //g.gwIds - obiekt id mapy i kordy -> 1: `1.13`
                //g.townname - obiekt id mapy i nazwa -> 1: `Ithan`
                $map_cords = self.findBestGw();
                if ($map_cords && !bolcka) {
                    if (hero.x == $map_cords.x && hero.y == $map_cords.y) {
                        _g(`walk`);
                    } else {
                        a_goTo($map_cords.x, $map_cords.y);
                        bolcka = true;
                        setTimeout(function() {
                            bolcka = false;
                        }, 2000);
                    }
                }
            }
 
            if (heroly == hero.y && herolx == herolx) {
                increment++;
                if (increment > 4) {
                    chceckBlockade();
                    increment = 0;
                    $m_id = undefined;
                    $map_cords = undefined;
                    bolcka = false;
                }
            } else {
                heroly = hero.y;
                herolx = hero.x;
                increment = 0;
            }
        }
 
        //wylogowanie po dedzie na główną
        if (g.dead && deade) {
            deade = false;
            sendInfoToDiscord(`Padłem na ${hero.lvl}${hero.prof} - ${getTime()}`);
            document.location.href = `http://margonem.pl`;
        }
 };
    document.addEventListener("keyup", async function (e) {
      if (
        e.target.tagName != "INPUT" &&
        e.target.tagName != "TEXTAREA" &&
        e.which == 90 &&
        !g.battle
      ) {
        if (!g.engineStopped && parseInput !== window.adiwilkTestBot.PI) {
          window.adiwilkTestBot.copyPI = parseInput;
          parseInput = window.adiwilkTestBot.PI;
          a_goTo(hero.x, hero.y);
          message("Bot zatrzymany");
        } else {
          parseInput = window.adiwilkTestBot.copyPI;
          message("Bot uruchomiony");
        }
      }
    });
    function checkGrp(id) {
        if (g.npc[id].grp) { //tutaj
            if (!checke2(g.npc[id].grp) || (expowiska[localStorage.getItem(`adi-bot_expowiska`)].ignore_grp && expowiska[localStorage.getItem(`adi-bot_expowiska`)].ignore_grp.includes(g.npc[id].grp))) {
                return false;
            }
        }
        return true;
    }
 
    function checke2(grpid) {
        for (let i in g.npc) {
            if (g.npc[i].grp == grpid && g.npc[i].wt > 19) {
                return false;
            }
        }
        return true;
    }
 
    function checkHeroHp() {
        if (hero.hp / hero.maxhp * 100 > 70) {
            return true;
        }
        return false;
    }
 
    this.findBestMob = function() {
        let b1,
            b2 = 9999,
            id;
        for (let i in g.npc) {
            let n = g.npc[i];
            let xxx;
            let min;
            let max;
            if (document.querySelector(`#adi-bot_mobs`).value.indexOf(`-`) > -1) {
                xxx = document.querySelector(`#adi-bot_mobs`).value.split(`-`);
                min = parseInt(xxx[0]);
                max = parseInt(xxx[1]);
            }
 
            if ((n.type == 2 || n.type == 3) && xxx && n.lvl <= max && n.lvl >= min && checkGrp(n.id) && !globalArray.includes(n.id) && n.wt < 20) {
                b1 = a_getWay(n.x, n.y);
                if (b1 == undefined) continue;
                if (b1.length < b2) {
                    b2 = b1.length;
                    id = n.id;
                }
            }
        }
        return id;
    }
 
    if (!localStorage.getItem(`alksjd`)) {
        localStorage.setItem(`alksjd`, 0);
    }
 
    this.findBestGw = function() {
        let obj,
            txt = document.querySelector(`#adi-bot_maps`).value.split(`, `),
            inc = parseInt(localStorage.getItem(`alksjd`));
 
        for (let i in g.townname) {
            //bo admini daja podwojna spacje w nazwach mapy??????
            if (txt[inc] == g.townname[i].replace(/ +(?= )/g, '')) {
                let c = g.gwIds[i].split(`.`);
                if (a_getWay(c[0], c[1]) == undefined) continue;
                obj = {
                    x: c[0],
                    y: c[1]
                };
            }
            if (obj) {
                return obj;
            }
        }
        inc++;
        if (inc > txt.length) {
            inc = 0;
        }
        localStorage.setItem(`alksjd`, parseInt(inc));
    }
 
    this.initHTML = function() {
        //localStorage pozycji
        if (!localStorage.getItem(`adi-bot_position`)) {
            let tmpobj = {
                x: 0,
                y: 0
            }
            localStorage.setItem(`adi-bot_position`, JSON.stringify(tmpobj));
        }
        let position = JSON.parse(localStorage.getItem(`adi-bot_position`));
 
        //boxy
        let box = document.createElement(`div`);
        box.id = `adi-bot_box`;
        box.setAttribute(`tip`, `Złap i przenieś :)`);
 
        let input1 = document.createElement(`input`);
        input1.type = `text`;
        input1.id = `adi-bot_mobs`;
        input1.classList.add(`adi-bot_inputs`);
        input1.setAttribute(`tip`, `Wprowadź lvl mobków w postaci np. '50-70'`);
        box.appendChild(input1);
 
        let input2 = document.createElement(`input`);
        input2.type = `text`;
        input2.id = `adi-bot_maps`;
        input2.classList.add(`adi-bot_inputs`);
        input2.setAttribute(`tip`, `Wprowadź nazwy map`);
        box.appendChild(input2);
 
        let select = document.createElement(`select`);
        select.id = `adi-bot_list`;
        select.classList.add(`adi-bot_inputs`);
        select.setAttribute(`tip`, `Wybierz expowisko, aby dodatek wpisał mapy za Ciebie`);
        for (let i = 0; i < Object.keys(expowiska).length; i++) {
            let option = document.createElement(`option`);
            option.setAttribute(`value`, Object.keys(expowiska)[i]);
            option.text = Object.keys(expowiska)[i];
            select.appendChild(option);
        }
        box.appendChild(select);
 
        document.body.appendChild(box);
 
        let style = document.createElement(`style`);
        style.type = `text/css`;
        let css = `
            #adi-bot_box {
               position: absolute;
               border: 2px solid #660066;
              padding: 5px;
              text-align: center;
               background:black;
               cursor: grab;
               left: ${position.x}px;
               top: ${position.y}px;
              width: auto;
               height: auto;
               z-index: 390;
             }
            .adi-bot_inputs {
                -webkit-box-sizing: content-box;
                -moz-box-sizing: content-box;
                box-sizing: content-box;
                margin: 0 auto;
                margin-bottom: 3px;
                padding: 2px;
                cursor: pointer;
                border: 2px solid #f76f6f;
                -webkit-border-radius: 5px;
                border-radius: 5px;
                font: normal 16px/normal "Times New Roman", Times, serif;
                color: rgba(0,142,198,1);
                -o-text-overflow: clip;
                text-overflow: clip;
                background: rgba(234,227,227,1);
                -webkit-box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2) inset;
                box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2) inset;
                text-shadow: 1px 1px 0 rgba(255,255,255,0.66) ;
                display: block;
              }
              input[id=adi-bot_mobs] {
                  text-align: center;
              }
              #adi-bot_blessingbox {
                  border: 1px solid red;
                  background: gray;
                  height: 32px;
                  width: 32px;
                  margin: 0 auto;
              }
        `;
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
 
        //localStorage dla mobów i mapek
        if (localStorage.getItem(`adi-bot_mobs`)) {
            input1.value = localStorage.getItem(`adi-bot_mobs`);
        }
        if (localStorage.getItem(`adi-bot_maps`)) {
            input2.value = localStorage.getItem(`adi-bot_maps`);
        }
        if (localStorage.getItem(`adi-bot_expowiska`)) {
            if (expowiska[localStorage.getItem(`adi-bot_expowiska`)]) {
                select.value = localStorage.getItem(`adi-bot_expowiska`);
            }
        }
        //listenery
        input1.addEventListener(`keyup`, () => {
            localStorage.setItem(`adi-bot_mobs`, input1.value);
        });
        input2.addEventListener(`keyup`, () => {
            localStorage.setItem(`adi-bot_maps`, input2.value);
        });
        select.addEventListener(`change`, () => {
            localStorage.setItem(`adi-bot_expowiska`, select.value);
            input2.value = expowiska[select.value].map;
            localStorage.setItem(`adi-bot_maps`, input2.value);
            localStorage.setItem(`alksjd`, 0);
            message(`Zapisano expowisko "${select.value}"`);
        });
 
        $(`#adi-bot_box`).draggable({
            stop: () => {
                let tmpobj = {
                    x: parseInt(document.querySelector(`#adi-bot_box`).style.left),
                    y: parseInt(document.querySelector(`#adi-bot_box`).style.top)
                }
                localStorage.setItem(`adi-bot_position`, JSON.stringify(tmpobj));
                message(`Zapisano pozycję`);
            }
        });
    }
    this.initHTML();
})()