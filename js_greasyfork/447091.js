// ==UserScript==
// @name         Canvas Quiz Tooltip + Antidetect
// @namespace    https://enotech.hu
// @version      1.0
// @license MIT
// @description  Provides answers to quiz questions based on text selection & prevent canvas to detect blur and focus events.
// @author       enony
// @include      *canvas*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447091/Canvas%20Quiz%20Tooltip%20%2B%20Antidetect.user.js
// @updateURL https://update.greasyfork.org/scripts/447091/Canvas%20Quiz%20Tooltip%20%2B%20Antidetect.meta.js
// ==/UserScript==

// ----- OPTIONS -----
const options = {
  antiDetectActive: true,
  toolTipActive: true,
  toolTipBlockSelectColor: true,
  toolTipCSS: `tooltip {
    position: fixed;
    max-width: 150px;
    max-height: 200px;
    display: none;
    color: #2D3B45;
    background: #fff;
    z-index: 9999;
    padding: 8px 10px;
    font-size: .7rem;
    font-weight: normal;
    line-height: 1.5;
    border: 1px solid #AAA;
    word-break: break-all;
    overflow-y: auto;
    opacity: .3;
}

tooltip::-webkit-scrollbar {
    width: 8px;
}
tooltip::-webkit-scrollbar-track {
    background: transparent; 
}
tooltip::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: #d4d4d4;
    border-radius: 8px;
    border: 2px solid transparent;
}
tooltip:focus {
    outline: none;
}`,
  toolTipItemsURL: "https://enotech.hu/adatbazis/adatbazis.json",
};

// ----- ITEMS -----

/*
  * Set items in JSON format:
    [
        {
            question: "Question1",
            answer: ["Answer1"],
        },
        {
            question: "Question2",
            answer: ["Answer2"],
        }
    ]
  */
    const items = [
        {
          question: "Monoton-e a különbség művelet (operátor)?",
          answer: ["nem"],
        },
        {
          question: "Monoton-e a metszet művelet (operátor)?",
          answer: ["igen"],
        },
        {
          question:
            "Hány különböző módon reprezentálható egy reláció-előfordulás (az attribútumok és sorok sorrendjét figyelembe véve), ha az előfordulásnak m attribútuma és n sora van?",
          answer: ["m! * n!"],
        },
        {
          question:
            "Tegyük fel, hogy az R relációnak n, az S relációnak pedig m sora van. Adjuk meg a következő kifejezések eredményeiben keletkezhető sorok maximális és minimális számát.",
          answer: [
            "R |X| S sorainak lehetséges maximális száma: n*m",
            "R |X| S sorainak lehetséges minimális száma: 0 / üres",
            "ΠL(R) - S sorainak lehetséges maximális száma: n",
            "ΠL(R) - S sorainak lehetséges minimális száma: 0 / üres",
            "Ha R és S sorai különböznek, R U S sorainak lehetséges maximális száma: n+m",
            "(Ha R és S sorai különböznek, R U S sorainak lehetséges minimális száma: n+m)",
            "R U S sorainak lehetséges minimális száma (ha nincs kikötve, hogy a sorok különböznek): max(n,m) (A kvízben ez kell!!!)",
          ],
        },
        {
          question:
            "A lekérdezésfában a csúcsokból kiinduló él vagy élek miket kötnek velük össze?",
          answer: [
            "Vagy az eredeti teljes lekérdezés bemenet-relációit, vagy pedig a csúcsban szereplő művelethez képest korábban végrehajtott művelete(ke)t.",
            "A csúcsban szereplő művelet operandusát vagy operandusait.",
          ],
        },
        {
          question:
            "A relációs adatmodell kapcsán mi NEM számít atomi értéknek az alábbiak közül?",
          answer: ["halmaz, tömb"],
        },
        {
          question:
            "Tegyük fel, hogy egy cégnél az iratokat egy olyan szobában gyűjtik, ahol a szoba ajtaján egy lyuk van vágva, ahová az iratokért felelős dolgozó egyszerűen csak bedobja a dokumentumokat. Tekinthető-e hétköznapi értelemben adatbázisnak az így összegyűjtött iratok összessége?",
          answer: ["nem"],
        },
        {
          question:
            "Tegyük fel, hogy egy egyetemen az oktatókról (személyi igazolvány-szám, név, lakcím, tanszék neve, bér) és a tanszékekről (név, tanszékvezető, cím) az információkat két külön excel fájlban tárolják. Hétköznapi értelemben adatbázis lesz-e?",
          answer: ["igen"],
        },
        {
          question: "Lehet-e kulcs a név, város, szakma...",
          answer: ["nem"],
        },
        {
          question: "Lehet-e kulcs az album neve, sorszám...",
          answer: [
            "igen, de ez azon is múlik, hogy a „valóvilágot” hogyan modellezzük",
          ],
        },
        {
          question:
            "Melyek lehetnek a nullérték jelentései a relációk soraiban az alábbiak közül?",
          answer: ["hiányzó érték, értelmetlen érték, visszatartott érték"],
        },
        {
          question: "Milyen logikai értékek vannak megengedve az SQL-ben?",
          answer: ["TRUE, FALSE, UNKNOWN"],
        },
        {
          question: "Mikor kerül egy sor be az eredménybe egy lekérdezéskor (WHERE)?",
          answer: ["Ha WHERE záradék TRUE értéket ad."],
        },
        {
          question:
            "Ha egy értéket (NULL értéket is beleszámítva) NULL-lal hasonlítunk, milyen logikai értéket kapunk?",
          answer: ["UNKNOWN"],
        },
        {
          question: "Adott egy adatbázisséma, Letöltő, Cikk, Kiad",
          answer: ["Igaz"],
        },
        {
          question: "Adott egy adatbázisséma, Szeret, Felszolg, Látogat",
          answer: ["Hamis"],
        },
        {
          question:
            "Adott egy tábla: Az alábbiak közül válassza ki a számokhoz tartozó helyes fogalmakat!",
          answer: ["1: attribútum, 2: mező, 3: előfordulás, 4: sor"],
        },
        {
          question:
            "Adott az alábbi Artist tábla: Mi lesz az alábbi lekérdezés eredménye? SELECT * FROM Artist WHERE year < 1992 OR year >= 1992;",
          answer: ["üres eredményhalmaz lesz"],
        },
        {
          question:
            "Adott az R |X| S természetes összekapcsolás és az R |X|C S théta-összekapcsolás. A C feltétel az összes olyan A attribútumra, amely az R-ben és S-ben is szerepel, tartalmazza R.A = S.A egyenlőséget. Mi a különbség a két összekapcsolás között?",
          answer: [
            "R |X| S természetes összekapcsolás esetében az összekapcsolásban az egyenlőségen összekapcsolódó oszlop párok közül csak az egyik oszlop és annak értékei jelennek meg.",
            "R |X|C S théta-összekapcsolásban az egyenlőség révén összekapcsolódó attribútumok és értékeik, amelyek egyenlőek, kétszer jelennek meg.",
          ],
        },
        {
          question:
            "Adott a Hallgatók(név, cím) relációséma. Az alábbi választási lehetőségek közül melyik lekérdezés eredményében szerepelnek biztosan azok és csak azok a hallgatók, akiknek a neve ‘R` betűvel kezdődik, és a nevük utolsó előtti karaktere ‘z`?",
          answer: ["SELECT * FROM Hallgatók WHERE név LIKE `R%z_`;"],
        },
        {
          question:
            "Melyik tanult záradékokban szerepelhetnek az összesítő (aggregáló) függvények? (Az alkérdésektől eltekintve, az ORDER BY záradékon kívül.)",
          answer: ["A SELECT és a HAVING záradékokban"],
        },
        {
          question: "Mi a külső összekapcsolás jellemzője?",
          answer: [
            "A külső összekapcsolás megőrzi az úgynevezett lógó sorokat, NULL értékkel helyettesítve a hiányzó értékeket",
          ],
        },
        {
          question:
            "A HAVING feltételére vonatkozó megszorítások (az alkérdésen kívül):",
          answer: [
            "(ugyanazok, mint SELECT-nél)",
            "Összesítések szerepelhetnek itt, amelyekben egy összesítési operátort alkalmazunk egy attribútumra vagy egy attribútumot tartalmazó kifejezésre.",
            "Csak a GROUP BY záradékban is megtalálható attribútumok jelenhetnek meg összesítési operátor nélkül.",
          ],
        },
        {
          question: "Mire szolgál a DISTINCT függvény egy összesítésen belül?",
          answer: [
            "Ennek használatával az összesítések előállítása előtt az érintett oszlopból a duplikátumokat kihagyjuk.",
          ],
        },
        {
          question:
            "A SELECT listára és az összesítésekre vonatkozó szabályok: (Ha összesítés is szerepel a lekérdezésben.)",
          answer: [
            "Összesítések szerepelhetnek itt, amelyekben egy összesítési operátort alkalmazunk egy attribútumra vagy egy attribútumot tartalmazó kifejezésre.",
            "Csak a GROUP BY záradékban is megtalálható attribútumok jelenhetnek meg összesítési operátor nélkül.",
          ],
        },
        {
          question: "Mi az eredménye a HAVING záradéknak?",
          answer: [
            "Ha egy csoport nem teljesíti a HAVING után megadott feltételt, nem lesz benne az eredményben.",
          ],
        },
        {
          question:
            "Sorolja fel a tanult, lehetséges összesítő (aggregáló) függvényeket! Nagybetűkkel adja meg a válaszokat!",
          answer: ["MIN, MAX, SUM, COUNT, AVG"],
        },
        {
          question:
            "Mi a különbség az elsődleges kulcs (PRIMARY KEY) és az egyedi értékű kulcs (UNIQUE) fogalma között:",
          answer: [
            "Az elsődleges kulcs egyetlen attribútuma sem kaphat NULL értéket. Az egyedi értékű kulcs megszorításnál szerepelhetnek NULL értékek egy soron belül akár több is.",
            "Egy relációhoz egyetlen elsődleges kulcs tartozhat és több egyedi értékű kulcs megszorítás.",
          ],
        },
        {
          question: "Relációk létrehozására melyik SQL résznyelv szolgál?",
          answer: ["Data Definition Language (DDL)"],
        },
        {
          question: "Soroljon fel néhány, megadható attribútum típust",
          answer: [
            "egész szám - INT / INTEGER",
            "valós szám - FLOAT / REAL",
            "rögzített hosszúságú sztring n karakter hosszú - CHAR(n)",
            "változó hosszúságú sztring legfeljebb n karakter hosszú - VARCHAR(n)",
            "naptári nap - DATE",
            "idő - TIME",
          ],
        },
        {
          question:
            "Válassza ki azokat a tanult, standard (!) SQL utasításokat az alábbiak közül, amelyekkel egy tranzakciót be lehet fejezni!",
          answer: ["ROLLBACK, COMMIT"],
        },
        {
          question: "Melyek igazak a tranzakciókra az alábbiak közül?",
          answer: [
            "Adatbázis lekérdezéseket, módosításokat tartalmazó folyamat",
            "Az általuk tartalmazott utasítások egy “értelmes egészt” alkotnak",
          ],
        },
        {
          question:
            "Miért hasznosak a triggerek? (Válassza ki az összes kapcsolódó választ!)",
          answer: [
            "Az attribútum- és oszlop-alapú (sorra vonatkozó) megszorítások ellenőrzése egyszerűbb (tudjuk mikor történik), mint a globális megszorításoké, ám ezekkel nem tudunk mindent kifejezni.",
            "A triggerek esetén a felhasználó mondja meg, hogy egy megszorítás mikor kerüljön ellenőrzésre.",
            "A globális megszorításokkal sok mindent le tudunk írni, az ellenőrzésük azonban gondot jelenthet.",
          ],
        },
        {
          question: "A globális megszorításokra melyek igazak az alábbiak közül?",
          answer: [
            "Csak beszúrásnál és módosításnál ellenőrzi a rendszer",
            "Deklarációjuk “CREATE ASSERTION <név> CHECK (<feltétel>);” alakban történik.",
            "Az adatbázissémához tartoznak a relációsémákhoz és nézetekhez tartozóan",
            "A feltétel tetszőleges táblára és oszlopra hivatkozhat az adatbázissémából",
          ],
        },
        {
          question:
            "Válassza ki a sor-alapú (sorra vonatkozó) megszorítások tulajdonságait az alábbiak közül!",
          answer: [
            "Deklarációjuk a tábla létrehozásánál “CHECK (feltétel)” alakú (relációs)-séma elemként történik (az attribútumok, a kulcsok és az idegen kulcsok deklarációja után).",
            "Egy ilyen megszorítás feltételében más relációk attribútumai csak alkérdésben jelenhetnek meg.",
            "Egy ilyen megszorítás feltételében tetszőleges oszlop és reláció szerepelhet bizonyos limitációval.",
            "Csak beszúrásnál és módosításnál ellenőrzi a rendszer",
          ],
        },
        {
          question: "Válassza ki az alábbiak közül az összes megszorítás típust!",
          answer: [
            "Idegen kulcs",
            "Érték alakú (attribútum-alapú) megszorítás",
            "Sor-alapú (sorra vonatkozó) megszorítás",
            "Globális megszorítás",
          ],
        },
        {
          question:
            "Válassza ki az alábbiak közül az összes igaz állítást az attribútum alapú megszorításokra!",
          answer: [
            "A feltételben csak az adott attribútum neve szerepelhet, más attribútumok (más relációk attribútumai is) csak alkérdésben szerepelhetnek",
            "Egy tábla létrehozásakor az attribútum deklarációjához kell hozzáadni CHECK(<feltétel>) alakban.",
            "Egy adott oszlop értékeire vonatkozóan tudunk ellenőrzőkérdéseket definiálni.",
            "Az attribútum alapú megszorítást séma elemként kell megadni.",
          ],
        },
        {
          question:
            "Mit jelent a felesleges (redundáns) adat a relációs adatmodell tervezésénél?",
          answer: [
            "Azt, hogy kikövetkeztethető a többi adatból, (főleg) a funkcionális függőségekből.",
          ],
        },
        {
          question:
            "Miként lehet meghatározni a Boyce-Codd normálformát? Jelölje be az összes jó választ az alábbiak közül!",
          answer: [
            "R reláció Boyce-Codd normálformában van, ha minden X->Y olyan funkcionális függőségre R-ben, amelynél Y nem része X-nek, X szuperkulcs.",
            "R reláció Boyce-Codd normálformában van, ha minden X->Y nemtriviális funkcionális függőségre R-ben X szuperkulcs.",
          ],
        },
        {
          question: "Mit jelentenek az anomáliák?",
          answer: [
            "Módosítási anomália - egy adat egy előfordulását megváltoztatjuk, más előfordulásait azonban nem",
            "Törlési anomália - törléskor olyan adatot is elveszítünk, amit nem szeretnénk",
            "Beszúrási anomália - nem tudunk tetszőleges adatot nyilvántartásba venni, ha nem ismert egy másik adat, amivel a tárolandó adat kapcsolatban áll.",
          ],
        },
        {
          question:
            "Ha vesszük a funkcionális függőségek geometriai reprezentációját (egy reláció összes lehetséges előfordulásaihoz kapcsolódóan), akkor mi lesz igaz A->B és B->C, valamint A->C funkcionális függőség régióira?",
          answer: [
            "A->C-hez kapcsolódó régió tartalmazni fogja A->B és B->C régiók metszetét",
          ],
        },
        {
          question:
            "Adott egy R(A,B,C,D) reláció és a rá vonatkozó AD->B, B->C és C->A funkcionális függőségek. Tegyük fel, hogy R relációt felbontottuk S(A,C) és T(A,B,D) relációkra. Igaz-e, hogy B->A is fennáll a T(A,B,D) reláción?",
          answer: ["Igaz"],
        },
        {
          question:
            "Tegyük fel, hogy az alábbi R(A,B,C) relációt szétvágjuk az alábbi R1 (A,C) és R2 (B,C) relációkra. Veszteségmentes lesz-e a keletkező relációk összekapcsolása?",
          answer: ["Igaz"],
        },
        {
          question:
            "Legyen X és Y az R relációnak az attribútumhalmazai, illetve A egy attribútuma. Igaz-e, hogy az XY ->A funkcionális függőség az X ->A funkcionális függőségből minden esetben következik?",
          answer: ["Igaz"],
        },
        {
          question:
            "Ha r = ΠR1 (r) |X| ... |X| ΠRk (r) teljesül, akkor az előbbi összekapcsolásra azt mondjuk, hogy veszteségmentes. Itt r egy R sémájú relációt jelöl. ΠRi(r) jelentése: r sorai az Ri attribútumaira projektálva. Mit kell a fentinél igazából megvizsgálni?",
          answer: [
            "ΠR1(r) |X| ... |X| ΠRk(r) ⊆ teljesül-e, mert a másik irány mindig fennáll.",
            "A kérdés igazából az, hogy kapunk-e más extra sorokat a különböző sorok vetületeinek összekapcsolásával, amelyek nem voltak benne eredetileg az előfordulásban.",
          ],
        },
        {
          question:
            "Tegyük fel, hogy egy Y attribútumhalmazra alkalmazzuk a lezárási algoritmust és az jön ki, hogy Y+ az összes attribútumot tartalmazza. Mi igaz Y-ra?",
          answer: ["Y biztosan egy szuperkulcs."],
        },
        {
          question:
            "Egy R(A1,...,An) relációt, amikor felbontunk kisebb relációkra: S(B1,...,Bm) és T(C1,...,Ck), akkor az alábbiak közül melyek igazak?",
          answer: [
            "A T megegyezik az R-nek C1 ,...,Ck attribútumokra való vetületével.",
            "Az S megegyezik az R-nek B1 ,...,Bm attribútumokra való vetületével.",
            "B1 ,…,Bm és C1 ,...,Ck együttesen az összes A1 ,...,An attribútumot kiadják, de ez nem jelenti azt, hogy {B1 ,...,Bm} ∩ {C1 ,...,Ck} =∅",
          ],
        },
        {
          question:
            "Igaz-e az Armstrong-axiómák alapján, hogy ha AB->CD adott, akkor ABE->CDE is teljesül? (Tegyük fel, hogy az A,B,C,D,E valamely R reláció attribútumai.)",
          answer: ["Igaz"],
        },
        {
          question:
            "A funkcionális függőségek jobboldalainak szétvágására van általános szabály",
          answer: ["(baloldalal szétvágására nincs)"],
        },
        {
          question:
            "K az R reláció kulcsa, … Fejezze be a mondatot az összes helyes módon az alábbi választási lehetőségek közül!",
          answer: [
            "ha K funkcionálisan meghatározza R attribútumait, de K-ból bárhogy hagyunk el egy attribútumot az már nem fogja funkcionálisan meghatározni R attribútumait.",
            "ha nem lehet két olyan R-beli sor, amelyek K attribútumain megegyeznek, valamint nincs olyan valódi részhalmaza K-nak, amely funkcionálisan meghatározná R összes többi attribútumát.",
          ],
        },
        {
          question:
            "Válassza ki az alábbiak közül a hangolási szakértő által végzet adatbázis hangolásának (database tuning) összes lehetségés lépését!",
          answer: [
            "A tervező átad egy minta lekérdezés terhelést (query load) a szakértőnek",
            "Valakik véletlenszerűen lekérdezéseket választanak a korábban végrehajtottak közül, és ezt a lekérdezés terhelési kimutatást (query load) átadják a szakértőnek.",
            "A szakértő létrehozza a szerinte fontos indexeket (a lekérdezés terhelési kimutatás (query load) alapján)",
            "A szakértő megvizsgálja a létrehozott indexek hatását (pl. a lekérdezés optimalizáló valóban használja-e ezeket, illetve javul-e a lekérdezések végrehajtási ideje).",
          ],
        },
        {
          question: "Melyek igazak az alábbiak közül az indexekre?",
          answer: [
            "Kereséseket, lekérdezések végrehajtását gyorsító adatszerkezetek, segédstruktúrák",
            "Több mezőre, attribútumra is lehet indexet készíteni.",
          ],
        },
        {
          question: "Melyek igazak az alábbiak közül a nézettáblákra?",
          answer: [
            "Van virtuális és materializált nézettábla is",
            "Van virtuális és materializált nézettábla is",
          ],
        },
        {
          question:
            "R-nek legyenek A,B és C az attribútumai. Feltéve, hogy csak A kulcs, hány szuperkulcsa van R-nek?",
          answer: ["4 (2 n-1 , n = 3)"],
        },
        {
          question: "A többértékű függőségre (TÉF) vonatkozó szabályok",
          answer: [
            "Ha X ->->Y és Z jelöli az összes többi (azaz X-en és Y-on kívüli) attribútum halmazát, akkor X ->->Z.",
            "A TÉF baloldala nem felbontható",
            "Minden funkcionális függőség TÉF",
            "A TÉF jobboldala nem felbontható",
          ],
        },
        {
          question:
            "A 3NF Megszünteti a funkcionális függőségekből eredő redundanciát",
          answer: ["Hamis"],
        },
        {
          question: "Mit jelent a függőségek megőrzése?",
          answer: [
            "A vetített relációk segítségével is kikényszeríthetők az előre megadott függőségek.",
          ],
        },
        {
          question:
            "Létezhet-e olyan R reláció, amely BCNF-ben van, de nincs 4NF-ben?",
          answer: ["Igaz"],
        },
        {
          question: "3NF Megszünteti a többértékű függőségekből eredő redundanciát",
          answer: ["Hamis"],
        },
        {
          question:
            "A többértékű függőség (TÉF) meghatározása, definíciója (válassza ki az összes helyes választ):",
          answer: [
            "az R reláció fölött X ->->Y teljesül: ha bármely két sorra, amelyek megegyeznek az X minden attribútumán, az Y attribútumaihoz tartozó értékek felcserélhetőek, azaz a keletkező két új sor R-beli lesz.",
            "az R reláció fölött X ->->Y teljesül: ha X minden értéke esetén az Y -hoz tartozó értékek függetlenek az R-X-Y értékeitől.",
          ],
        },
        {
          question:
            "BCNF Megszünteti a funkcionális függőségekből eredő redundanciát",
          answer: ["Igaz"],
        },
        {
          question: "4NF Megszünteti a funkcionális függőségekből eredő redundanciát",
          answer: ["Igaz"],
        },
        {
          question: "4NF Megszünteti a többértékű függőségekből eredő redundanciát",
          answer: ["Igaz"],
        },
        {
          question: "BCNF Megszünteti a többértékű függőségekből eredő redundanciát",
          answer: ["Hamis"],
        },
        {
          question: "3NF megőrzi a funkcionális függőségeket",
          answer: ["Igaz"],
        },
        {
          question:
            "Miként lehet meghatározni a 3. normálformát (3NF)? Jelölje be az összes jó választ az alábbiak közül!",
          answer: [
            "X->A megsérti 3NF-t akkor és csak akkor, ha X nem szuperkulcs és A nem prím (elsődleges attribútum).",
            "R reláció 3. normálformában van, ha minden X->Y nemtriviális funkcionális függőségre R-ben X szuperkulcs, vagy jobb oldala csak elsődleges attribútumokat tartalmaz.",
            "R reláció 3. normálformában van, ha minden X->Y nemtriviális funkcionális függőségre R-ben X szuperkulcs, vagy jobb oldala csak olyan attribútumokat tartalmaz, amelyekre igaz, hogy legalább egy kulcsnak elemei",
          ],
        },
        {
          question: 'Mi az "Egyed-kapcsolat modell"?',
          answer: ["Segítségével az adatbázissémát vázolhatjuk fel"],
        },
        {
          question:
            "Mit jelent az E/K diagramon, hogy ha A egyedhalmaz és B egyedhalmaz között van egy kapcsolat és a lekerekített nyíl van B-nél (azaz A-ból B-be mutat a lekerekített nyíl, másik irányba nem mutat semmilyen nyíl)?",
          answer: [
            "minden A halmazbeli entitás pontosan egy entitáshoz kapcsolódhat a B egyedhalmazbó",
          ],
        },
        {
          question:
            "(Mit jelent az E/K diagramon, hogyha A egyedhalmaz és B egyedhalmaz között van egy kapcsolat és a lekerekített nyíl van B-nél (azaz A-ból B-be mutat a lekerekített nyíl)?",
          answer: [
            "minden A halmazbeli entitásnak pontosan egy párja van a B egyedhalmazból)",
          ],
        },
        {
          question:
            "Mi igaz az Egyed-kapcsolat modellel kapcsolatos alosztályokra (részosztályokra)?",
          answer: [
            "Ha egy entitás (egyed) szerepel egy alosztályban (részosztályban), akkor szerepel az ősosztály(ok)ban is",
          ],
        },
        {
          question:
            "Az egyed(entitás)-kapcsolat diagramoknál melyek igazak a kapcsolatokra, illetve jelölésükre az alábbiak közül?",
          answer: [
            "A kapcsolatoknak is lehetnek attribútumai.",
            "Valamely egy-egy kapcsolat esetén minden egyes entitás (egyed) legfeljebb egyetlen másik entitáshoz (egyedhez) kapcsolódhat.",
            "A sok-egy kapcsolat “egy oldalát” egy nyíl jelzi.",
          ],
        },
        {
          question:
            "Melyek a tervezési technikák, ökölszabályok egyed (entitás) kapcsolat modell esetében az alábbiak közül?",
          answer: [
            "A gyenge egyedhalmazok óvatos használata",
            "Ne használjunk egyedhalmazt, ha egy attribútum éppúgy megfelelne a célnak.",
            "Redundancia elkerülése",
          ],
        },
        {
          question:
            "Helytelen tervezés-e ha a focista egyedhalmaznál a focista neve, TAJ száma, klubja attribútumok mellett a klubja címét, mint a focista egyedhalmaz egy ráadás attribútumát is tároljuk",
          answer: ["Igaz"],
        },
        {
          question: "Milyen kapcsolat köti össze az egyedhalmazt az alosztályaival?",
          answer: ["“az-egy” kapcsolat"],
        },
        {
          question:
            "Mit jelent az E/K diagramon, hogy ha A egyedhalmaz, B egyedhalmaz és C egyedhalmaz között van egy ternáris kapcsolat és nyíl mutat a C-be?",
          answer: [
            "A kapcsolathalmazban egy sornál az A és B egyedhalmazokhoz tartozó elemek együttese egyértelműen meghatározza a C egyedhalmazhoz tartozó elemet.",
          ],
        },
        {
          question:
            "Az alábbiak közül milyen feltételek vonatkozhatnak egy egyedhalmazra?",
          answer: [
            "A “sok” végén szerepel egy sok-egy kapcsolatnak",
            "Egy egyedhalmaz hasonló egyedek (entitások) kollekciója",
            "Többnek kell lennie, mint egy egyszerű név, azaz legalább egy nem kulcs attribútumának lennie kell.",
          ],
        },
        {
          question:
            "Adott az alábbi E/K diagram (demonstrátor: itt olyan hallgatót jelent, aki oktatásban is részt vesz):",
          answer: [""],
        },
        {
          question:
            "Át szeretnénk írni az ősosztályt és az alosztályt relációsémává. Az alábbiak közül mikor hasznos az objektumorientált megközelítés?",
          answer: [
            "A “programtervező informatikus MSc szakos demonstrátorok által oktatott tantárgyakat” visszaadó lekérdezés esetén hasznos",
          ],
        },
        {
          question:
            "Át szeretnénk írni az ősosztályt és az alosztályt relációsémává. Az alábbiak közül mikor hasznos az E/K stylemegközelítés?",
          answer: [
            "A “programtervező informatikus MSc szakos összes hallgató nevét” visszaadó lekérdezés esetén hasznos",
          ],
        },
        {
          question:
            "Az alábbi közül melyik egy gyenge egyedhalmazra vonatkozó szabály?",
          answer: [
            "A támogató kapcsolat(ok)nak kerek nyílban kell végződniük az egy oldalon (azaz minden entitásnak (egyednek) a gyenge egyedhalmazból pontosan egy egyedhez kell kapcsolódnia a támogató egyedhalmazból)",
          ],
        },
        {
          question:
            "Az alábbiak közül válassza ki azokat, amelyek egy egyed (entitás)-kapcsolat modell relációsémává történő átírásának szabályai!",
          answer: [
            "Gyenge egyedhalmazok esetében a kapott relációhoz hozzá kell még venni azokat az attribútumokat, amelyek egyértelműen azonosítják az egyedhalmazt.",
            "Egy kapcsolatnak szintén egy relációt feleltetünk meg, melynek neve a kapcsolat neve, attribútumai pedig a kapcsolatban résztvevő egyedhalmazok kulcsai. Amennyiben két attribútum neve megegyezne, egyiket értelemszerűen át kell neveznünk",
            "Egy egyedhalmaznak egy reláció felel meg, melynek neve megegyezik az egyedhalmaz nevével, attribútumai az egyedhalmaz attribútumai.",
          ],
        },
        {
          question:
            "A TÉF-ek esetén fel lehet-e általános szabályként bontani a jobb oldalakat, mint ahogy FF-ek esetén?",
          answer: ["Hamis"],
        },
        {
          question:
            "Melyek az alábbiak közül az egyed(entitás)-kapcsolat diagram, modell főbb alkotórészei, alapfogalmai?",
          answer: ["Egyedhalmazok", "Attribútumok", "Kapcsolathalmazok"],
        },
        {
          question:
            "Tegyük fel, hogy A egyedhalmaz és B egyedhalmaz között van egy kapcsolat és lekerekített nyíl van B-nél az E/K diagramon (azaz A-ból B-be mutat a lekerekített nyíl). Tanult módon van-e lehetőség másik jelölést használni a lekerekített nyíl helyett?",
          answer: ["Igaz"],
        },
        {
          question:
            "Előfordulhat-e olyan E/K diagram, ahol egy egy gyenge egyedhalmaz egy másik gyenge egyedhalmazhoz kapcsolódik?",
          answer: ["Igaz"],
        },
        {
          question:
            "Az ORACLE esetében hol történik egy típus metódusának a definíciója az alábbiak közül?",
          answer: ["CREATE TYPE BODY"],
        },
        {
          question:
            "Adja meg az UDT felhasználásával, mint sortípussal való relációk deklarálásának módját! Csak nagybetűket használjon!",
          answer: ["CREATE TABLE <táblanév> OF <UDT neve>;"],
        },
        {
          question: "Mit jelentenek az objektum-relációs hivatkozások (References)?",
          answer: [
            "egy mutató egy felhasználó által definiált adattípusú (UDT) objektumra",
            "objektum azonosítónak (OID) is hívják objektum-orientált rendszerekben (azaz ahhoz nagyon hasonló fogalom)",
          ],
        },
        {
          question:
            "Melyik lekérdezés adja vissza az alábbiak közül Joe kocsmájában árult sörök listáját olvasható formában?",
          answer: [
            "SELECT DEREF(ss.beer) FROM Sells ss WHERE ss.bar.name = `Joe``s Bar`;",
          ],
        },
        {
          question: "Melyek igazak az alábbiak közül a beágyazott táblákra?",
          answer: [
            "A létrehozásánál a megfelelő utasításokban a “CREATE TABLE...NESTED TABLE...STORE AS…;” kulcsszavak szerepelnek.",
            "Megengedi, hogy a sorok egyes komponensei teljes relációk legyenek",
          ],
        },
        {
          question: "Mikre lehet használni a “CAST” parancsot az alábbiak közül?",
          answer: [
            "Beágyazott táblák létrehozásánál használhatjuk",
            "A MULTISET operátorral együtt használva valamilyen objektumok halmazát beágyazott relációvá tudjuk alakítani.",
          ],
        },
        {
          question:
            "Felhasználó által definiált adattípusok (User Defined Types, UDT) használati módjai:",
          answer: ["sortípus", "egy reláció attribútumának a típusa (oszloptípus)"],
        },
        {
          question:
            "Ha egy relációs táblát egy sortípus segítségével, mint sémával definiáltunk (az elemeinek felsorolása helyett), akkor ORACLE esetén mit kell használni az alábbiak közül, hogy egy darab sort be tudjunk szúrni a táblába?",
          answer: ["típuskonstruktor", "INSERT"],
        },
        {
          question:
            "CREATE TYPE MenuType AS ( bar REF BarType, beer REF BeerType, price FLOAT ); CREATE TABLE Sells OF MenuType;",
          answer: [""],
        },
        {
          question:
            "CREATE TYPE BarType AS ( name CHAR(20), addr CHAR(20) ); SELECT * FROM Bars; Milyen a sorok formátuma az eredményben az alábbi példák közül?",
          answer: ["BarType(`Joe`s Bar`, `Maple St.`)"],
        },
        {
          question:
            "Az alábbiak közül válassza ki, hogy mire való a PRAGMA RESTRICT_REFERENCES a metódus deklarációjakor!",
          answer: [
            "ezzel lehet kontrollálni, hogy milyen „mellékhatásai” vannak a metódusnak",
          ],
        },
        {
          question:
            "CREATE TABLE Drinkers ( name CHAR(30), addr AddrType, favBeer BeerType ); Melyik SELECT kérdés ad értelmes eredményt az alábbiak közül?",
          answer: ["SELECT dd.favBeer.name FROM Drinkers dd"],
        },
        {
          question:
            'ORACLE esetében az alábbiak közül mikre lehet használni a "." (pont) karaktert a SELECT záradékban?',
          answer: [
            "például egy objektum valamely mezőjének elérésére",
            "például arra, amire SQL-99-ben a generátor való",
            "például egy metódus használatára, ha az objektum neve után szerepel",
          ],
        },
        {
          question: "DTD-ben IDREF-k létrehozatalának módja:",
          answer: [
            "Egy F elem az IDREF attribútum segítségével hivatkozhat egy másik elemre annak ID attribútumán keresztül",
            "Az IDREFS típusú attribútummal több másik elemre is hivatkozhat",
          ],
        },
        {
          question:
            "!!! A DTD-nél az attribútumokról szóló leírásoknál az alábbiak közül milyen típusok adhatók meg?",
          answer: ["CDATA, ID, IDREF, IDREFS"],
        },
        {
          question:
            "Az alábbiak közül melyikkel lehet több megszorítást előírni az XML dokumentumok sémájára?",
          answer: ["XML séma"],
        },
        {
          question:
            "Milyen attribútumnév-érték pár megadásával lehet kifejezni az XML sémánál azt a multiplicitást, amelyre a DTD-nél a " *
            " szimbólumot kellett használni?",
          answer: ['minOccurs = "0" és maxOccurs = "unbounded"'],
        },
        {
          question: "DTD elemek (DTD ELEMENT) megadásának formalizmusa",
          answer: [
            "A levelek (szöveges elemek) típusa #PCDATA (Parsed Character DATA ).",
            "Egy-egy elem leírása az elem nevét és zárójelek között az alelemek megadását jelent",
            "Az elemek megadása magában foglalja az alelemek sorrendjét és multiplicitását",
          ],
        },
        {
          question:
            "Mit értünk jól formált XML alatt? Az összes jó választ adja meg az alábbiak közül!",
          answer: [
            "megengedi, hogy önálló tageket vezessünk be",
            "Minden nyitó tagnek megvan a záró párja",
            "Nem hiányzik a deklaráció: <?xml … ?>",
          ],
        },
        {
          question:
            "Milyen attribútumnév-érték pár megadásával lehet kifejezni az XML sémánál azt a multiplicitást, amelyre a DTD-nél a " +
            " szimbólumot kellett használni?",
          answer: ['minOccurs = "1" és maxOccurs = "unbounded"'],
        },
        {
          question: 'Melyek igazak a "TABLE" függvényre az alábbiak közül?',
          answer: [
            "A kimeneteként kapott relációt a FROM záradékban lehet alkalmazni",
            "Egy beágyazott táblát hagyományos relációvá lehet konvertálni az alkalmazásával",
          ],
        },
        {
          question: "Milyen attribútumnév-érték pár megadásával lehet kifejezni az XML sémánál azt a multiplicitást, amelyre a DTD-nél a \"?\" szimbólumot kellett használni?",
          answer: ["minOccurs = \"0\" és maxOccurs = \"1\""],
        },
        {
          question: "DTD-ben ID-k létrehozatalának módja:",
          answer: ["Adjunk meg egy E elemet és egy A attribútumát, aminek típusa: ID.", "Amikor az E elemet (<E >) egy XML dokumentumba használjuk, az ID típusú A attribútumának egy máshol nem szereplő értéket kell adnunk."],
        },
        {
          question: "Az alábbiak közül mire igaz az, hogy XML lekérdező nyelv?",
          answer: ["SQL, XQuery"],
        },
        {
          question: "Hogyan jelöljük az attribútumokat az utakban (XML)?",
          answer: ["Az attribútumokat a @ jel jelöli, ez után következik az attribútum neve"],
        },
        {
          question: "Az XPath/XQuery adatmodell, komponensei, fogalmai:",
          answer: ["a relációk megfelelője ebben a tételek (item) listája (sequence)", "egy tétel lehet: csomópont", "egy tétel lehet: egyszerű érték", "a bemenet, a köztes lépések eredményeit és a végeredményt is tételek listájaként kezeljük"],
        },
        {
          question: "Az XQuery nyelv jellemzése, és tulajdonságai",
          answer: ["a tételek listája adatmodellt használja", "egy SQL-hez hasonló lekérdezőnyelv, ami XPath kifejezéseket használ", "egy funkcionális nyelv"],
        },
        {
          question: "Mi az alapértelmezett (default) tengely és meghatározása?",
          answer: ["A default tengely a child::", "A default tengely az összes gyermekét veszi az aktuális pontoknak"],
        },
        {
          question: "/zzzz/yyyy/aaa[. < 10000]. Ez a kifejezés minek a megfogalmazására szolgál?",
          answer: ["A /zzzz/yyyy/aaa elem értéke (belseje) kisebb, mint 10000"],
        },
        {
          question: "LET záradék sajátosságai, jellemzése:",
          answer: ["let <változó> := <kifejezés>", "a változók $ jellel kezdődnek", "a változó értéke tételek listája lesz, ez a lista a kifejezés eredménye", "a záradék hatására nem indul el ciklus"],
        },
        {
          question: "Mit értünk FLWR (vagy FLWOR, flower) kifejezések alatt? (Válassza ki az összes releváns opciót!)",
          answer: ["Egy vagy több for és/vagy let záradék", "opcionálisan egy where záradék", "order-by záradék előzheti meg a return záradékot", "Végül egy return záradék"],
        },
        {
          question: "Mire használható az XPath?",
          answer: ["Navigációs útvonalakat lehet megadni a dokumentumban.", "Segítségével az XML dokumentumokat járhatjuk be."],
        },
        {
          question: "Milyen elemekből áll egy útkifejezés eredménye, ha attribútummal végződik?",
          answer: ["A lista atomi típusú elemekből áll (pl. sztringekből)"],
        },
        {
          question: "Mire szolgálnak ezek az összehasonlító műveletek << és >>.",
          answer: ["Dokumentumbeli sorrend szerinti összehasonlítás"],
        },
        {
          question: "Az E elem esetében a data függvény használatával mit kapunk meg? (data(E))",
          answer: ["Az E elem értékét"],
        },
        {
          question: "Döntsük el, hogy létezik-e olyan E és F kifejezés, hogy az every $x in E satisfies F kifejezés igaz, de a some $x in E satisfies F hamis? (Adja meg az összes jó választ!)",
          answer: ["Nem létezik ilyen E és F kifejezés", "Nem, mert ha E összes értéke kielégíti F-t, akkor biztosan létezik legalább egy érték E-ben, amelyik kielégíti F-t."],
        },
        {
          question: "FOR záradék sajátosságai, jellemzése:",
          answer: ["for <változó> in <kifejezés>", "a változók $ jellel kezdődnek", "változója egy ciklusban sorra bejárja a kifejezés eredményének összes tételét", "az utána megadott részek tehát minden egyes tételre végrehajtódnak egyszer"],
        },
        {
          question: "Melyek jellemzik az alábbiak közül az OLTP rendszereket?",
          answer: ["Rövid, egyszerű, gyakran feltett kérdések", "A kérdések viszonylag kevés sort adnak vissza válaszként."],
        },
        {
          question: "Mi az a REVOKE?",
          answer: ["Ez által visszavonódnak az általunk kiadott jogosultságok"],
        },
        {
          question: "Mit jelent a ‘lefúrás’ (“Drill-Down”)?",
          answer: ["egy összesítés lebontása alkotóelemeire", "egy aggregálás lebontása alkotóelemeire"],
        },
        {
          question: "Melyek jellemzők az alábbiak közül a tanult, tipikus adattárház szervezési architektúrára?",
          answer: ["Az áruházláncok egyes áruházai OLTP szinten dolgoznak, és a helyi adatbázisaikat éjszakánként feltöltik a központi adattárházba", "Az adatelemzők az adattárházat OLAP elemzésekre használják fel"],
        },
        {
          question: "Adattárházban mely állítások igazak a ténytáblákra?",
          answer: ["Az attribútumai között vannak dimenzió attribútumok, amelyek a dimenzió táblák kulcsai (Idegen kulcsok)", "Az attribútumai között vannak függő attribútumok, amelyek a sorban a dimenzió attribútumok által meghatározott értékek"],
        },
        {
          question: "Nem lehet visszavonni REVOKE-kal az adott jogosultságnak, jogosultságoknak az engedélyezési képességét",
          answer: ["Hamis"],
        },
        {
          question: "Az adatkocka (Data Cube) szerkezete:",
          answer: ["az adatkocka egy pontja, amelynek koordinátái egy vagy több “*” értéket tartalmaznak, összesítődnek azon dimenziók fölött, melyek, amelyek koordinátái tartalmaznak “*” értéket", "mindegyik dimenziót kiegészítjük “*” értékkel"],
        },
        {
          question: "Melyek azok az adatbázis “objektumok” (“adatbáziselemek”) az alábbiak közül, amelyekre megadhatók jogosultságok?",
          answer: ["relációs táblák", "nézetek", "materializált nézetek", "attribútumok"],
        },
        {
          question: "miért van szükség grant diagramokra?",
          answer: ["egy csúcsnál számít, hogy a felhasználó tulajdonos-e", "egy csúcsnál számít, hogy van-e grant option", "áttekinthetőség miatt szükséges", "ez egy gráf, amelynek csúcsai atomi értékek vagy objektumok, az élek címkéi attribútumnevek, kapcsolatok"],
        },
        {
          question: "Mit jelent a ‘felgörgetés’ (“Roll-Up”)?",
          answer: ["aggregálás egy vagy több dimenzió mentén"],
        },
        {
          question: "Melyek jellemzik az alábbiak közül az OLAP (On-line Analytical Processing) rendszereket?",
          answer: ["általában az adatbázis nagyobb részét érintik az idetartozó tranzakciók", "kisebb számú, de összetett lekérdezések jellemzik, amelyek órákig is futhatnak.", "a lekérdezések nem igénylik az abszolút időben pontos adatbázist"],
        },
        {
          question: "Válassza ki az adattárház sajátosságait, tipikus jellemzőit",
          answer: ["Gyakran az analitikus lekérdezések végett hozzák létre", "Egyetlen egy közös adatbázisba....", "Módszere: periodikus aktualizálás, gyakran éjszaka"],
        }
      ];
      

// ----- QUIZ TOOLTIP -----
if (options.toolTipActive) {
  let toolTip = document.createElement("tooltip");
  toolTip.innerHTML = "";
  toolTip.setAttribute("tabindex", 0);
  document.body.appendChild(toolTip);
  injectCSS(options.toolTipCSS);
  if (options.toolTipBlockSelectColor) {
    injectCSS(
      `::selection {background: rgba(0, 0, 0, 0);} ::-moz-selection {background: rgba(0, 0, 0, 0);}`
    );
  }

  window.addEventListener("click", function (e) {
    //Reset text on click
    if (toolTip.innerHTML != "") {
      toolTip.innerHTML = "";
      toolTip.style.display = "none";
      toolTip.style.color = "#2D3B45";
    }
    //If text is selected, search items for matches
    if (window.getSelection().toString() != "") {
      let foundCount = 0;
      for (let item of items) {
        if (
          item.question.toString().includes(window.getSelection().toString())
        ) {
          toolTip.innerHTML += `<b>${++foundCount}. ${item.question}:<b><br>`;
          for (const answer of item.answer) {
            toolTip.innerHTML += `· ${answer}<br>`;
          }
        } else if (window.getSelection().toString().includes(item.question)) {
          toolTip.innerHTML += `<b>${++foundCount}. ${item.question}:<b><br>`;
          for (const answer of item.answer) {
            toolTip.innerHTML += `· ${answer}<br>`;
          }
        }
      }
      //If no results are found
      if (toolTip.innerHTML == "") {
        toolTip.innerHTML = "No results";
        toolTip.style.color = "red";
      }
      toolTip.style.left = e.clientX + 10 + "px";
      toolTip.style.top = e.clientY + 10 + "px";
      toolTip.style.display = "block";
      toolTip.focus();
    }
  });

  window.addEventListener("mousemove", function (e) {
    if (toolTip.innerHTML != "") {
      toolTip.style.left = e.clientX + 10 + "px";
      toolTip.style.top = e.clientY + 10 + "px";
    }
  });
}

// ----- CANVAS ANTIDETECT -----
if (options.antiDetectActive) {
  // Creating our new addEventListener override
  Window.prototype.addEventListenerOverride = Window.prototype.addEventListener;
  //Overriding addEventListener function to block focus & blur events
  Window.prototype.addEventListener = (a, b, c) => {
    if (a == "focus" || a == "blur") {
      console.info(
        "%c[Prevented]" + `%c Canvas '${a}' event detection`,
        "color: green",
        "color: inherit"
      );
    } else {
      addEventListenerOverride(a, b, c);
    }
  };
}

function injectCSS(css) {
  let el = document.createElement("style");
  el.type = "text/css";
  el.innerText = css;
  document.head.appendChild(el);
}
