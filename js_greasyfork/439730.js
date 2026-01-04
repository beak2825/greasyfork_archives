// ==UserScript==
// @name         Notifications blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skutečně nejlepší deaktivátor notifikací, aby vás nic nerušilo
// @author       You
// @match        https://oliva.uhk.cz/*
// @license MIT
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439730/Notifications%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/439730/Notifications%20blocker.meta.js
// ==/UserScript==


const answers = [
  {
    "Číslo otázky": 195,
    "Otázka": "Advanced Vector Extension implementuje 256 bitové registry v technologii Sandy Bridge.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 134,
    "Otázka": "Advanced Vector Extension implmentuje 256 bitové registry v technologii Sandy Bridge.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 173,
    "Otázka": "Advanced Vector Extension znamená, že procesory pracují s 256 bitovými operandy v jednom taktu",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 168,
    "Otázka": "Aritmeticko-logická jednotka, slouží k provádění vybraných výpočtů s operandy, které jsou načteny z operační paměti",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 1,
    "Otázka": "Aritmeticko-logická jednotka, slouží k provádění veškerých výpočtů s operandy, které jsou načteny z operační paměti.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 21,
    "Otázka": "AUX Power obsahuje",
    "Odpověď": "Dva vodiče 3,3V",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 24,
    "Otázka": "AUX Power obsahuje",
    "Odpověď": "Tři vodiče COM",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 25,
    "Otázka": "AUX Power obsahuje",
    "Odpověď": "Jeden vodič +5 V",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 72,
    "Otázka": "Binárně zakódované informace jsou na CD uloženy na spirálové stopě.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 66,
    "Otázka": "Binárně zakódované informace jsou na CD uloženy v soustředných kružnicích.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 36,
    "Otázka": "BIOS JE:",
    "Odpověď": "Program uložený v paměti ROM",
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 163,
    "Otázka": "Cluster je nejmenší logickou datovou jednotkou na disku.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 114,
    "Otázka": "Čas nutný k pohybu hlav nad určitou stopu se nazývá?",
    "Odpověď": "Doba vystavení",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 147,
    "Otázka": "DD3 paměti používají standardní napětí 1,5V.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 142,
    "Otázka": "DDR2 mají oproti DDR dvojnásobnou vnitřní frekvenci.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 122,
    "Otázka": "Doba nutná k dotočení stopy na daný sektor se nazývá?",
    "Odpověď": "Doba čekání",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 189,
    "Otázka": "Doba vyjadřující rychlost, s níž disk vyhledá data se nazývá? ",
    "Odpověď": "Přístupová doba",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 143,
    "Otázka": "DRAM je paměť tvořena kondenzátory, které v nabitém stavu představuje 0 a ve vybitém stavu 1",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 106,
    "Otázka": "DVI je založen na paralelním formátu a používá Treansition Minimized Differential Signaling.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 93,
    "Otázka": "DVI je založen na paralelním formátu a používá Treeansition minimized Differential Signaling.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 80,
    "Otázka": "DVI je založen na sériovém formátu a používá Treansition Minimized Differential Signaling.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 148,
    "Otázka": "EEPROM je paměť mazatelná elektrickými impulsy.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 141,
    "Otázka": "EPROM je paměť, do které lze opakované zapisovat. Informace je kódována pomocí elektrického náboje. Smazání záznamu se provádí pomocí elektrického pole.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 42,
    "Otázka": "Extended Memory Specification je systém využívaný pro pířmé adresování nestránkované paměti Extended",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 86,
    "Otázka": "GPU dokáží za jeden takt vytvořit jeden texel.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 81,
    "Otázka": "Grafické karty se k základní desce připojují prostřednictvím AGP nebo PCIe.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 104,
    "Otázka": "Grafické karty se k základní desce připojují prostřednictvím IDE.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 83,
    "Otázka": "Grafické karty se k základní desce připojují prostřenictvím Seriál ATA III.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 107,
    "Otázka": "Hlavním úkolem GPU je zajišťování tvorby obrazu.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 116,
    "Otázka": "Hlavním úkolem řadiče pevného disku je organizace vlastního zápisu a čtení dat prostřednictvím kódování nebo dekódování.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 117,
    "Otázka": "Hlavním úkolem řadiče pevného disku je ve spolupráci se sběrnicí zajistit přenos dat mezi diskem a mikroprocesorem.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 190,
    "Otázka": "Hlavním úkolem řadiče pevného disku je správné nastavení hlav",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 165,
    "Otázka": "Hodnoty 0000 v poli FAT tabulky značí prázdný (nepoužitý) cluster.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 178,
    "Otázka": "Charakteristickým znakem mikroarchitektury AMD Phemon je, že každé jádro je vybaveno vlastní pamětí první a druhé úrovně.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 130,
    "Otázka": "Charakteristickým znakem mikroarchitektury AMD Phemon je, že řadič paměti se skládá ze dvou nezávsislých 64 bitových řadičů",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 133,
    "Otázka": "Charakteristickým znakem mikroarchitektury AMD Phemon je, že všechny čtyři jádra mají sdílenou paměť druhé a třetí úrovně.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 139,
    "Otázka": "Informace v paměti ROM musí zůstat zapsané i po vypnutí počítače.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 14,
    "Otázka": "Jedna racková jednotka je 1,75 palce (44,45 mm) [1] a označuje se zkratkou \"U\" (např. \"1U\", \"2U\",….). Udává šířku zařízení umisťovaného do racku nebo celkovou výšku racku.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 2
  },
  {
    "Číslo otázky": 17,
    "Otázka": "Jedna racková jednotka je 1,75 palce (44.45 mm) a označuje se zkratkou \"U\" (např. \"1U\", \"2U\", …) Udává výšku zařízení umišťoveného do racku nebo celkovou výšku racku.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 2
  },
  {
    "Číslo otázky": 2,
    "Otázka": "Jedna z nejznámějších architektur počítače se nazývá:",
    "Odpověď": "Von Neumannova architektura",
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 135,
    "Otázka": "Jednotka správy paměti je umístěna mezi adresami generovanými programem a skutečnými adresami v operační paměti. Dnes se již nepoužívá.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 33,
    "Otázka": "Jumpery, které využíváme pro nastavení vybraných parametrů základní desky mají stav ON a OFF",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 166,
    "Otázka": "Kód zavaděče je v MBR uložen na adrese:",
    "Odpověď": "\"0000\"",
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 46,
    "Otázka": "Kooperativní multitasking se vyznačuje tím, že čas procesoru je operačním systémem přidělen jednomu programu, který jej má v držení tak dlouho, dokud jej sám nevrátí.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 32,
    "Otázka": "Kopie Jumpery, které využíváme pro nastavení vybraných parametrů základní desky je skupina pinů, jejichž vzájemným propojením nastavuji požadované vlastnosti.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 39,
    "Otázka": "Které vlastnosti ovlivňuje základní deska",
    "Odpověď": "Integrované řadiče pevných disků\nTyp mikroprocesoru\nPoužitý BIOS\n",
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 171,
    "Otázka": "Které vlastnosti ovlivňuje základní deska",
    "Odpověď": "Integrované řadiče pevných disků\n- Typ mikroprocesoru\n- Použitý BIOS\n- VELIKOST OPERAČNÍ PAMĚTI",
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 61,
    "Otázka": "Laserový paprsek je u magnetooptických disků používán jen při čtení.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 70,
    "Otázka": "Laserový paprsek je u magnetooptických disků používán při čtení i zápisu.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 198,
    "Otázka": "MBR u PC kopatibilních s platformou IBM PC je umístěn program pro zavedení operačního programu, který si může uživatel upravit podle svých potřeb.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 164,
    "Otázka": "Metasoubory NTFS jsou soubory v nichž je zaznamenána organizace dat v clusterech.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 188,
    "Otázka": "Mezi atributy S.M.A.R.T. patří",
    "Odpověď": "Spin Up Time\n- Raw Read Error Rate\n",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 125,
    "Otázka": "Mezi atributy S.M.A.R.T. patří:",
    "Odpověď": "Power On Hours Count\nStart \/ Stop Count\n",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 179,
    "Otázka": "Mezi externí sběrnicí a mikroporcesorem pracuje dělička, která převádí rychlejší externí takt na nižší interní frekvenci mikroporcesoru",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 128,
    "Otázka": "Mezi externí sběrnicí a mikroprocesorem pracuje násobička, která převádí pomalejší externí takt na vyšší interní frekvenci mirkoprocesoru",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 94,
    "Otázka": "Mezi charakteristické znaky GPU patří:",
    "Odpověď": "Maximální teoretický texel fill-rate\nPočet texelů vytvořených v jedné pipline za jeden takt\nPočet texturovacích pipelines\n",
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 20,
    "Otázka": "Mezi řídíci signály zdrojů ATX 12V patří i PS-ON#, který zapínající všechny napěťové okruhy (+3,3V, +5V, +12).",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 30,
    "Otázka": "Mezi řídící signály zdrojů ATX12V patří i PS-ON#, který zapínající všechny napěťové okruhy (+3,3V, +5V, +12V).",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 26,
    "Otázka": "Mezi řídící signály zdrojů ATX12V patří i PWR_KO, který slouží k vypnutí všech napěťových okruhů",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 169,
    "Otázka": "Mezi řídicí signály zdrojů ATX12V patří i PWR_OK, který slouží ke kontrole napěťových okruhů ",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 185,
    "Otázka": "Mezi základní valstnosti USB patří:",
    "Odpověď": "Podpora až pět úrovní zařízení\n- Zařízení může být až 5 metrů od rozbočovače\n",
    "Obrázek": null,
    "Test číslo": 7
  },
  {
    "Číslo otázky": 194,
    "Otázka": "Mikroarchitektura Sandy Bridge je předchůdce mikroarchitektury Nehalem a Core Microarchitecture.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 174,
    "Otázka": "Mikroarchitektura Sandy Bridge je předchůdce mikroarchitektury Nehalem a Core Microarchitecture. ",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 127,
    "Otázka": "Mikroarchitekturu Intel Core Microarchitecture nalezneme u procesorů:",
    "Odpověď": "Intel Core Duo\nIntel Core 2 Quad",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 105,
    "Otázka": "Množství přenesených dat mezi GPU a operační pamětí je limitováno frekvencí a šířkou sběrnice.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 109,
    "Otázka": "Množství přenesených dat mezi GPU a operační pamětí je limitováno jen frekvencí sběrnice.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 89,
    "Otázka": "Množství přenesených dat mezi GPU a operační pamětí je limitováno jen šířkou sběrnice.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 103,
    "Otázka": "Množství přenesených dat mezi GPU a operační pamětí je limitováno jen šířkou sběrnice.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 153,
    "Otázka": "MPT obsahuje seznam všech fyzických oddílů disku.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 154,
    "Otázka": "MPT obsahuje umístění zaváděcích sektorů jednotlivých disků.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 43,
    "Otázka": "Multitasking se v praxi realizuje tak, že dochází k rychlému přepínání mezi běžícími programy.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 162,
    "Otázka": "Na dynamických discích můžeme vytvářet svazky několika typů.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 53,
    "Otázka": "Na obrázku je schéma zapojení konektorů USB. Jednotlivé piny mají funkci:",
    "Odpověď": "Černá je GND\nBílá je DATA -\nZelená je DATA +\nČervená je +5V",
    "Obrázek": "Obrázky!A1",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 115,
    "Otázka": "Na obrázku je schématická struktura disku. \nČást označená písmenem se nazývá:\n",
    "Odpověď": "A - Plotna\nC - Čtecí a zapisovací hlava\nE - Cylindr\nF – Sektor\n",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 40,
    "Otázka": "Na obrázku je ukázán výpis obsazenípamětí",
    "Odpověď": "Konvenční paměť - obsazení I\/O zařízení",
    "Obrázek": "Obrázky!A24",
    "Test číslo": 9
  },
  {
    "Číslo otázky": 41,
    "Otázka": "Na obrázku je ukázána adresace:",
    "Odpověď": "Rezervované paměti",
    "Obrázek": "Obrázky!A57",
    "Test číslo": 9
  },
  {
    "Číslo otázky": 197,
    "Otázka": "Na obrázku je znározněna topologie PCIe. Blok (2) je bridge.",
    "Odpověď": true,
    "Obrázek": "Obrázky!A1",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 196,
    "Otázka": "Na obrázku je znázorněna anatomie komunikace základní desky s okolím. Pod polem ?(2) je část:",
    "Odpověď": "Lokální sběrnice",
    "Obrázek": "Obrázky!A110",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 49,
    "Otázka": "Na obrázku je znázorněna anatomie komunikace základní desky s okolím. Pod polem? (1) je část:",
    "Odpověď": "Operační paměť",
    "Obrázek": "Obrázky",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 51,
    "Otázka": "Na obrázku je znázorněna anatomie komunikace základní desky s okolím. Pod polem? (1) je část:",
    "Odpověď": "Operační paměť",
    "Obrázek": "Obrázky!A110",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 48,
    "Otázka": "Na obrázku je znázorněna anatomie komunikace základní desky s okolím. Pod polem? (4) je část:",
    "Odpověď": "Mikroprocesor",
    "Obrázek": "Obrázky",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 54,
    "Otázka": "Na obrázku je znázorněna anatomie komunmikace základní desky s okolím. Pod polem ?(1) je část:",
    "Odpověď": "Operační paměť",
    "Obrázek": "Obrázky!A1",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 56,
    "Otázka": "Na obrázku je znázorněna komunikace od Intelu s FSB a North Bridge. Pod blokem ?(1) je North Bridge.",
    "Odpověď": false,
    "Obrázek": "Obrázky!A1",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 52,
    "Otázka": "Na obrázku je znázorněna komunikace od Intelu s FSB North Bridge. Pod blokem?(1) je South Bridge.",
    "Odpověď": true,
    "Obrázek": "Obrázky!A126",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 57,
    "Otázka": "Na obrázku je znázorněna logika zpojení:",
    "Odpověď": "AGP",
    "Obrázek": "Obrázky!A1",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 58,
    "Otázka": "Na obrázku je znázorněna topologie Pcle. Blok (1) je Mikroprocesor.",
    "Odpověď": true,
    "Obrázek": "Obrázky!A1",
    "Test číslo": 7
  },
  {
    "Číslo otázky": 3,
    "Otázka": "Na obrázku je znázorněna:",
    "Odpověď": "Von Neumannova architektura",
    "Obrázek": "Obrázky!A3",
    "Test číslo": 1
  },
  {
    "Číslo otázky": 4,
    "Otázka": "Na obrázku je znázorněna:",
    "Odpověď": "Harwardská architektura",
    "Obrázek": "Obrázky!A13",
    "Test číslo": 1
  },
  {
    "Číslo otázky": 87,
    "Otázka": "Na obrázku je znázorněno schéma grafické karty. Jak se nazývá funkční blok označený ?(1).",
    "Odpověď": "GPU",
    "Obrázek": "Obrázky!A242",
    "Test číslo": 13
  },
  {
    "Číslo otázky": 91,
    "Otázka": "Na obrázku je znázorněno schéma grafické karty. Jak se nazývá funkční blok označený ?(2)",
    "Odpověď": "Paměť",
    "Obrázek": "Obrázky!A242",
    "Test číslo": 13
  },
  {
    "Číslo otázky": 85,
    "Otázka": "Na obrázku je znázorněno schéma grafické karty. Jak se nazývá funkční blok označený ?(3)",
    "Odpověď": "RAMDAC",
    "Obrázek": "Obrázky!A242",
    "Test číslo": 13
  },
  {
    "Číslo otázky": 76,
    "Otázka": "Na obrázku jsou uvedeny zvětšeniny záznamů na optických médiích. Jaké médium je pod písmenem B?",
    "Odpověď": "DVD",
    "Obrázek": "Obrázky!A227",
    "Test číslo": 12
  },
  {
    "Číslo otázky": 77,
    "Otázka": "Na obrázku jsou uvedeny zvětšeniny záznamů na optických médiích. Jaké médium je pod písmenem C?",
    "Odpověď": "Blue-ray",
    "Obrázek": "Obrázky!A227",
    "Test číslo": 12
  },
  {
    "Číslo otázky": 60,
    "Otázka": "Na obrázku jsou uvedeny zvětšniny záznamů na optických médiích. Jeké médium je pod písmenem A?",
    "Odpověď": "CD",
    "Obrázek": "Obrázky!A227",
    "Test číslo": 12
  },
  {
    "Číslo otázky": 137,
    "Otázka": "NetBurst je mikroarchitektura pro procesory AMD od verze KB",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 55,
    "Otázka": "North Bridge s procesorem u technologie Intel komunikuje pomocí FSB.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 7
  },
  {
    "Číslo otázky": 176,
    "Otázka": "O dnešních mikroprocesorech a jich přerušení platí:",
    "Odpověď": "Každé přerušení je identifikováno číslem\n Využívají systém vektorové přerušení",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 172,
    "Otázka": "O instrukční sadě je pravdivé tvrzení.",
    "Odpověď": "U nových mikroprocesorů obsahuje instrukce pro koordinaci viceprocesorového prostředí\n- Instrukčí sada nově obsahuje instrukce pro grafiku\n- Instrukčí sada nově obsahuje instrukce pro přehrávání videa\n- Instrukčí sada nově obsahuje instrukce pro generování zvuku\n- Instrukčí sada obsahuje několik systémových instrukcí\n- Instrukční sada obsahuje instrukce pro řízení programu\n",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 158,
    "Otázka": "O MFT je správné tvrzení:",
    "Odpověď": "Jedná se o hlavní tabulku souborů\nMFT je souborem",
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 193,
    "Otázka": "O systému přerušení platí:",
    "Odpověď": "Tabulka vektorů přerušení je uložena v paměti\nKaždé přerušení je jednoznačně identifikováno číslem\nVektor přerušení ukazuje na místo v paměti s obslužným programem",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 136,
    "Otázka": "O technologii Turbo Boost 2.0 platí:",
    "Odpověď": "Obvod PCU dokáže krátkodobě přetaktovat procesor nad rámec maximální hodnoty\nJe implementován v mikroarchitektuře Intel Snady Bridge",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 35,
    "Otázka": "Obvody základní desky určeny hlavně pro podporu mikroprocesoru a sběrnic",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 34,
    "Otázka": "Obvody základní desky výhradně určeny pro podporu mikroprocesoru a sběrnic",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 197,
    "Otázka": "Operační paměť a South Bridge jsou u technologie Intel přímo propojeny s FSB.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 7
  },
  {
    "Číslo otázky": 5,
    "Otázka": "Operační paměť plní u počítače roli:",
    "Odpověď": "Jsou zde uloženy opkódy",
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 6,
    "Otázka": "Operační paměť plní u počítače roli:",
    "Odpověď": " K dočasné či trvalé úschově dat, se kterými výpočty probíhají",
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 7,
    "Otázka": "Opkódy jednotlivých strojových instrukcí, které jsou načítány do řadiče, na základě jejichž hodnot řídí celý počítač jsou uloženy na HDD.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 8,
    "Otázka": "Opkódy jednotlivých strojových instrukcí, které jsou načítány do řadiče, na základě jejichž hodnot řídí celý počítač jsou uloženy operační paměti.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 187,
    "Otázka": "Paměť je využívána:",
    "Odpověď": "Pro uložení adres I\/O zařízení\n- Operační systém\n- BIOS HW zařízení\n- Uživatelskými aplikacemi\n",
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 140,
    "Otázka": "Paměť ROM se využívá pro",
    "Odpověď": "Uložení BIOSU",
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 146,
    "Otázka": "Paměti DDR pracují tak, že přenášejí data jak na náběžné tak sestupné hraně.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 75,
    "Otázka": "Paměťové karty určené do PCMCIA používají technologii NAND.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 9,
    "Otázka": "Paralelně se vznikem Von Neumannovy architektury byla vyvíjena architektura konkurenční pod názvem:",
    "Odpověď": "Harwardská architektura",
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 118,
    "Otázka": "Pevný disk se skládá z:",
    "Odpověď": "Média, na němž jsou uložena data\nMechaniku pro pohyb hlav\n",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 100,
    "Otázka": "Pixel, představuje nejmenší skupinu svítících bodů na monitoru v bitmapové grafice.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 108,
    "Otázka": "Pixel, představuje nejmenší skupinu svítících bodů na monitoru v bitmapové grafice.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 19,
    "Otázka": "Po standardní značení jednotlivých napěťových úrovní platí:",
    "Odpověď": "\"+\" 12V se značí žlutou barvou",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 177,
    "Otázka": "Pod pojmem vnější šířka mikroporcesoru je chápána schopnost zpracovat najednou učité množství informace. ",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 129,
    "Otázka": "Pod pojmem vnitřní šířka mikroprocesoru je chápána schopnost zpracovat najednou určité množství informací.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 131,
    "Otázka": "Pojmem přerušení je myšlen signál, který vysílá hardwardové zařízení případně software.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 181,
    "Otázka": "Poměr mezi vnější a vnitřní frekvencí je:",
    "Odpověď": "Pevně určen a nelze jej měnit",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 45,
    "Otázka": "Preemtivní multitasking byl využíván např. operačním systémem Windows98. Dnes se využívá Kooperativní multitasking např. Windows7.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 121,
    "Otázka": "Prekompenzace je systém ochrany ovlivňování zápisu dat geometrií disku.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 144,
    "Otázka": "Primární paměť je využívána mikroprocesorem pro odkládání programů.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 200,
    "Otázka": "Princip grafického režimu lze popsat tak, že na obrazovce je rozprostřena matice svítících bodů, jejichž zhasínáním se vykreslí požadovaný text.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 98,
    "Otázka": "Princip grafického režimu lze popsat tak, že na obrzaovce je rozprostřena matice bodů, jejichž rozsvícením se vykreslí požadovaný text.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 79,
    "Otázka": "Princip pamětí typu flash jsou dovozeny od pamětí EEPROM.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 71,
    "Otázka": "Princip paměti typu flash jsou odvozeny od paměti EMPROM.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 119,
    "Otázka": "Princip prekompenzace spočívá v tom, že řadič počítá s pohybem dipólů a posouvá ZÁPISNÉ impulsy po směru předpokládaných přitažlivých sil.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 120,
    "Otázka": "Princip prekompenzace spočívá v tom, že řadič počítá s pohybem dipólů a posouvá ZAPISOVANÉ impulsy po směru předpokládaných přitažlivých sil.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 124,
    "Otázka": "Princip ZBR spočívá v rozdělení plochy povrchu disku na zóny. Každá zóna má pak jiný počet sektorů.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 123,
    "Otázka": "Princip zone bit recording spočívá v rozdělení plochy povrchu disku do jedné zóny, pro zachování stejného počtu sektorů.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 44,
    "Otázka": "Pro adresování konvenční paměti je využíván systém XMS.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 175,
    "Otázka": "Pro architekturu Intel Nehalem neplatí: ",
    "Odpověď": "Podporuje až 6 řadičů",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 99,
    "Otázka": "Pro HDMI je charakteristické",
    "Odpověď": "Slouží pro přenos nekomprimovaného obrazového a zvukového signálu v digitálním tvaru.",
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 82,
    "Otázka": "Pro HDMI je charakteristické:",
    "Odpověď": "Slouží pro přenos nekomprimovaného obrazového a zvukovéjho signálu v digitálním tvaru\nVyužívá konektro A, která mmá 19 pinů\nVyužívá konektor B, která má 29 pinů",
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 88,
    "Otázka": "Pro HDMI je charakteristické:",
    "Odpověď": "Slouží pro přenos nekomprimovanmého obrazového a zvukového signálu v digitálním tvaru.",
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 111,
    "Otázka": "Pro kódování MFM je charakteristické:",
    "Odpověď": "Vymezení datovému signálu přenou délku\nPočet shodných bitů řadič rozpoznává podle doby trvání stejného magnetického toku\n\n",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 126,
    "Otázka": "Pro kódování RLL je charakteristické:",
    "Odpověď": "Pomocí řadiče dochází k přepočítání ukládané posloupnosti na novou kombinaci 0 a 1\nV porovnání s MFM potřebuje pro uložení stejné informace jen jednu třetinu kapacity disku\n",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 184,
    "Otázka": "Pro mikroarchitekturu Intel Core Duo jsou typické vlastnosti:",
    "Odpověď": "Wide Dynamic Execution\n- Smart Memory Access\n- Advanced Digital Media Boost\n",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 183,
    "Otázka": "Pro mikroarchitekturu NetBurst jsou typické vlastnosti:",
    "Odpověď": "Hyperpipelining\n- Rapid Execution Engine\n- Sběrnice FSB\n",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 101,
    "Otázka": "Pro paralelní spolupráci dvou grafických karet nVidia se využívá řešení CrossFire",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 27,
    "Otázka": "Pro standardní značení jednotlivých napěťových úrovní platí:",
    "Odpověď": "\"+\" 5 V se znační červenou barvou",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 31,
    "Otázka": "Pro standardní značení jednotlivých napěťových úrovní platí:",
    "Odpověď": "\"+\" 12V se značí žlutou barvou",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 170,
    "Otázka": "Pro standardní značení jednotlivých napěťových úrovní platí: ",
    "Odpověď": "Zem se značí černou",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 180,
    "Otázka": "Procesorová sběrnice QuickPath:",
    "Odpověď": "Podporuje sério-paralelní přenos typu point-to-point\n- Má vyhrazený zvláštní kanál pro datový otk každým směrem\n- Podporuje rychlost až 25GB\/s\n",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 47,
    "Otázka": "Programy OS DOS mohly standardně používat paměť nad 1024 KB",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 9
  },
  {
    "Číslo otázky": 145,
    "Otázka": "PROM paměť je podobná paměti ROM, ale informace nezapisuje výrobce, ale uživatel pomocí programátoru ROM.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 8
  },
  {
    "Číslo otázky": 199,
    "Otázka": "Prvních 16 záznamů vMFT je určeno pro metasoubory.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 156,
    "Otázka": "Prvních 8% disku je u NTFS vyčleněno pro růst MFT.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 73,
    "Otázka": "Při čtení dat z magnetooptického disku je nutné překonat tzv. Curierovu teplotu.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 69,
    "Otázka": "Při čtení dat z magnetooptického disku je založeno na tzv. Kerrově jevu.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 63,
    "Otázka": "Při čtení dat zvukovéo kompaktního dsku zachován princip Constatnt Linear Velocity",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 191,
    "Otázka": "Při fyzickém formátování je disk rozděleln na stopy a sektory. ",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 102,
    "Otázka": "Při paralelní spolupráci dvou grafických karet nVidia se využívá řešení Scalable Link Interface.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 16,
    "Otázka": "Rack Unit (U) je jednotka míry používaná v informačních technolgiích k opisu výšky zařízení určeného pro upevnění v racku šíře 19 nebo 23 palců",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 2
  },
  {
    "Číslo otázky": 15,
    "Otázka": "Rack Unit (zkratka U nebo méně častěju RU) je jednotka míry používaná v informačních technologiích k popisu šířky zařízení určeného pro upevnění c racku šíře 19 enbo 23 palců.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 2
  },
  {
    "Číslo otázky": 97,
    "Otázka": "RAMDAC je analogově digitální převodník.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 95,
    "Otázka": "RAMDAC je digitálně analogový převodník",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 92,
    "Otázka": "RAMDAC převádí analogový signál na digitální, který pak vstupuje do monitoru.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 110,
    "Otázka": "RAMDAC převádí digitální signál na analogový, který pak vstupuje do monitoru.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 132,
    "Otázka": "Signál přerušení je vysílán z důvodu získání pozornosti mikroprocesoru pro daný software či hardware.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 155,
    "Otázka": "Souborový systém NTFS již nepoužívá zastaralý systém ukládání dat do clusterů",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 161,
    "Otázka": "Správné tvrzení o koncepsi NTFS je:",
    "Odpověď": "Jsou zde uloženy informace o jménu, velikkosti a poloze fragmentů souborů\nV MFT je zmínka o všech souborech na disku\nKoncepce datových toků v NTFS je univerzální",
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 28,
    "Otázka": "Starší zdroje používané u desek AT přiváděly napětí na základní desku pomocí devítipólových konektorů P8 a P9.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 29,
    "Otázka": "Starší zdroje používané u desk AT přiváděly napětí na základní desku pomocí šestipólových konektorů P8 a P9.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 59,
    "Otázka": "Systémová sběrnice komunikuje s obvody základní desky.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 7
  },
  {
    "Číslo otázky": 149,
    "Otázka": "Tabulka primárních oddílů je v MBR uložen na adrese:",
    "Odpověď": "01BE",
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 182,
    "Otázka": "Technologie Advanced Smart Cache slouží pro optimalizaci s pamětí cache L2.",
    "Odpověď": " PRAVDA",
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 185,
    "Otázka": "Technologie Hyper Transport je řetězová. To znamená že:",
    "Odpověď": "Využívá mosty a switche\n- Jednotlivé prvky jsou tvořeny tunely\n",
    "Obrázek": null,
    "Test číslo": 7
  },
  {
    "Číslo otázky": 96,
    "Otázka": "Texel je elementární struktura skládající se z několika pixelů.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 90,
    "Otázka": "Texel je elementární struktura, pomocí nichž je pak složen jeden pixel.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 68,
    "Otázka": "U DVD je tloušťka nosné vrstvy 0,6 mm.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 78,
    "Otázka": "U DVD je tloušťka nosné vrstvy 1,2 mm.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 62,
    "Otázka": "U mříižkové paměti probíhá čtení i zápis po stránkách",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 64,
    "Otázka": "U mřížkové paměti probíhá mazání po blocích.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 67,
    "Otázka": "U mřížkové paměti se nejmenší adresovatelná jednotka nazývá page.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 50,
    "Otázka": "U technologie Intel ze South Bridge vychází:",
    "Odpověď": "Sériové porty\nSběrnice PCI",
    "Obrázek": null,
    "Test číslo": 7
  },
  {
    "Číslo otázky": 167,
    "Otázka": "V Harwardské architektuře je oproti Von Neumannově paměť rozdělelna na paměť pro programy a paměť pro data. ",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 152,
    "Otázka": "V MBR PC kompatiblních s platformou IBM PC je umístěn BIOS.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 160,
    "Otázka": "V MBR u PC kompatibilních s platformou IBM PC je umíštěno rozdělení disku na logické oddíly.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 150,
    "Otázka": "V MBR u PC kompatibilních s platformou IBM PC umístěn zavděč operačního systému",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 159,
    "Otázka": "V polích tabulky FAT mohout být uvedeny:",
    "Odpověď": "FFF7 vadný cluster\nČísla následujících clusterů\nFFFF koncové clustery",
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 10,
    "Otázka": "V Harwardské architektuře je oproti Von Neumannově integrován řadič do ALU.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 18,
    "Otázka": "Ve skříních typu Berabome se nachází jen zdroj, základní deska a chladící systém.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 2
  },
  {
    "Číslo otázky": 11,
    "Otázka": "Ve Von Neumannově architektuře jsou v operační paměti uschovány jak programy, tak data, se kterými program pracuje.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 151,
    "Otázka": "Velikost MBR u PC kompatibilních s platformou IBM PC má velikost 512 bajtů.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 84,
    "Otázka": "Velikot pixelu je ovlivněna typem monitoru.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 13
  },
  {
    "Číslo otázky": 138,
    "Otázka": "Vnitřní frekvence mirkoprocesoru je rovna frekvenci, kterou udává generátor taktů na základní desce",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 6
  },
  {
    "Číslo otázky": 112,
    "Otázka": "Z fyzikálního hlediska je každý bit na pevném disku přednastavován dvojicí miniaturních dipólů zapsaných do magnetického povrchu disku, jejichž vzájemné natočení určuje, zda jde o hodnotu 0 nebo 1.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 113,
    "Otázka": "Z fyzikálního hlediska je každý bit na pevném disku představován miniaturním dipólem zapsaným do magnetického povrchu disku",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 12,
    "Otázka": "Z paměti je vždy do řadiče načtena jedna programová instrukce a řadič na základě obsahu této instrukce, tj. konkrétního povelu, řídí další moduly.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 13,
    "Otázka": "Z paměti jsou do řadiče načteny všechny programové instrukce najednou a řadič na základě obsahu těchto instrukcí, tj. konkrétních sad povelů řídí další moduly.",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 1
  },
  {
    "Číslo otázky": 37,
    "Otázka": "Základní desky typu BTX byly navrženy proto, aby řešily problém s chlazením u desek typu ATX",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 38,
    "Otázka": "Základní desky typu BTX předcházely desky ATX a měli horší chlazení",
    "Odpověď": false,
    "Obrázek": null,
    "Test číslo": 4
  },
  {
    "Číslo otázky": 157,
    "Otázka": "Základní disky lze rozdělit až na 8 nezávisle primárních oddílů.",
    "Odpověď": " Nepravda",
    "Obrázek": null,
    "Test číslo": 11
  },
  {
    "Číslo otázky": 65,
    "Otázka": "Záznam na magnetooptický disk je prováděn změnou magnetizace vhodného materiálu.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  },
  {
    "Číslo otázky": 22,
    "Otázka": "Zdroje AT dodávaly napětí o úrovni:",
    "Odpověď": "12 a 5 V",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 23,
    "Otázka": "Zdroje ATX dodávaly napětí o úrovni",
    "Odpověď": "12,5 a 3,3 V",
    "Obrázek": null,
    "Test číslo": 3
  },
  {
    "Číslo otázky": 192,
    "Otázka": "Zkratka MTBF zamená. ",
    "Odpověď": "Střední dobu mezi chybami",
    "Obrázek": null,
    "Test číslo": 10
  },
  {
    "Číslo otázky": 74,
    "Otázka": "Zvětšení kapacity disku Blue-ray bylo dosaženo zmenšením šířky stopy a délky pitů.",
    "Odpověď": true,
    "Obrázek": null,
    "Test číslo": 12
  }
];

(function () {
  const showbar = document.createElement("p");
  showbar.style.position = "fixed"
  showbar.style.bottom = "10px";
  showbar.style.right = "10px"
  showbar.style.zIndex = "100000000"
  showbar.style.color = "black"
  showbar.style.background = "white"



  showbar.innerHTML = "ahoj"
  document.body.appendChild(showbar);



  showbar.style.display = "none";


  let barshow = false;
  document.body.onkeypress = function (event) {
    var x = event.key;



  //  console.log(x);
    if (x == "f") {
      barshow = !barshow;
      showbar.style.display = barshow ? "block" : "none";
    }
  }

  let showanswers = "";
  document.onclick = function ({ target }) {
  //  console.log(target.innerText)
    const questions = answers.map(v => v['Otázka']);
  //  console.log(questions, target.innerText)
    showanswers = answers.filter(({ title, ans }) => title === target.innerText).sort()[0]
    let qindex = findBestMatch(target.innerText, questions).bestMatchIndex
    showanswers = answers[qindex]['Odpověď'];
    // showbar.innerHTML = showanswers.split('\n').join('<br>');
          showbar.innerHTML = typeof showanswers === 'string' ? ( showanswers.indexOf('\n') > 0 ? showanswers.split('\n').join('<br>') : showanswers) : showanswers;



    //console.log(showanswers)
  }

  function compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, '')
    second = second.replace(/\s+/g, '')



    if (!first.length && !second.length) return 1;                   // if both are empty strings
    if (!first.length || !second.length) return 0;                   // if only one is empty string
    if (first === second) return 1;                                    // identical
    if (first.length === 1 && second.length === 1) return 0;         // both are 1-letter strings
    if (first.length < 2 || second.length < 2) return 0;             // if either is a 1-letter string



    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram)
        ? firstBigrams.get(bigram) + 1
        : 1;



      firstBigrams.set(bigram, count);
    };



    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram)
        ? firstBigrams.get(bigram)
        : 0;



      if (count > 0) {
        firstBigrams.set(bigram, count - 1);
        intersectionSize++;
      }
    }



    return (2.0 * intersectionSize) / (first.length + second.length - 2);
  }



  function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');



    const ratings = [];
    let bestMatchIndex = 0;



    for (let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = compareTwoStrings(mainString, currentTargetString)
      ratings.push({ target: currentTargetString, rating: currentRating })
      if (currentRating > ratings[bestMatchIndex].rating) {
        bestMatchIndex = i
      }
    }




    const bestMatch = ratings[bestMatchIndex]


    return { ratings, bestMatch, bestMatchIndex };
  }



  function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string') return false;
    if (!Array.isArray(targetStrings)) return false;
    if (!targetStrings.length) return false;
    if (targetStrings.find(s => typeof s !== 'string')) return false;
    return true;
  }

  // Your code here...
})();
