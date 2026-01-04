// ==UserScript==
// @name         John 3:16
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  @관리자
// @author       John 3:16
// @match        https://board.namu.wiki/b/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @grant        none
// @license      CC BY-NC-SA 2.0
// @downloadURL https://update.greasyfork.org/scripts/497356/John%203%3A16.user.js
// @updateURL https://update.greasyfork.org/scripts/497356/John%203%3A16.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let phraseName = '';
    let option = 0;

    function makeHTMLPhrase(style, phrase, option = 0) {
        let openTag = "<div style=\"" + style + "\">";
        let closeTag = "</div>";
        let adminname;
        if(option == 0) adminname = ['@Colorless', '@rabit99', '@Yor', '@Resolver', '@Care'];
        else adminname = ['@관리자'];
        let result = phrase.replaceAll("@관리자", "<u><span style=\"font-family: 'Noto Sans CJK KR'\">" + adminname[~~(Math.random() * adminname.length)] + "</span></u>");
        var phraseTitle = phrase.substring(phrase.lastIndexOf('('), phrase.lastIndexOf(')')+1);
        result = result.replace(phraseTitle, "<span style='font-size:90%'>" + phraseTitle + "</span>");
        return openTag + result + closeTag;
    }

    function write(phraseName, option = 0) {
        let phrase;
        if(phraseName == "john") {
            phrase = [
                "Sic enim Deus dilexit @관리자, ut Filium suum unigenitum daret: ut omnis qui credit in eum, non pereat, sed habeat vitam æternam.(Joannes 3:16)",
                "For God so loved @관리자 that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.(John 3:16)",
                "Porque de tal manera amó Dios @관리자, que dio a su Hijo unigénito, para que todo aquel que cree en él no se pierda, sino que tenga vida eterna.(Juan 3:16)",
                "Denn so sehr hat Gott @관리자 geliebt, dass er seinen eingeborenen Sohn gab, damit jeder, der an ihn glaubt, nicht verloren gehe, sondern ewiges Leben habe.(Johannes 3:16)",
                "Car Dieu a tant aimé @관리자 qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.(Jean 3:16)",
                "Porque Deus amou @관리자 de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.(João 3:16)",
                "For så høyt har Gud elsket @관리자 at han ga sin enbårne Sønn, for at hver den som tror på ham, ikke skal fortapes, men ha evig liv.(Johannes 3:16)",
                "Want God had @관리자 zo lief dat hij zijn enige Zoon gaf, opdat iedereen die in hem gelooft niet verloren gaat maar eeuwig leven heeft.(Johannes 3:16)",
                "Sillä niin on Jumala rakastanut @관리자, että hän antoi ainokaisen Poikansa, ettei yksikään, joka häneen uskoo, hukkuisi, vaan hänellä olisi iankaikkinen elämä.(Johannes 3:16)",
                "Poiché Dio ha tanto amato @관리자 da dare il suo unigenito Figlio, affinché chiunque crede in lui non perisca ma abbia vita eterna.(Giovanni 3:16)",
                "Fiindcă atât de mult a iubit Dumnezeu @관리자, că a dat pe singurul Lui Fiu, pentru ca oricine crede în El să nu piară, ci să aibă viaţa veşnică.(Ioan 3:16)",
                "Perquè Déu va estimar tant @관리자 que va donar el seu Fill únic, perquè qui creu en ell no es perdi, sinó que tingui vida eterna.(Joan 3:16)",
                "Albowiem tak Bóg umiłował @관리자, że dał swego jednorodzonego Syna, aby każdy, kto w Niego wierzy, nie zginął, ale miał życie wieczne.(Jana 3:16)",
                "Ty så älskade Gud @관리자 att han gav sin enfödde Son, för att den som tror på honom inte ska gå förlorad utan ha evigt liv.(Joh 3:16)",
                "Því svo elskaði Guð @관리자 að hann gaf son sinn eingetinn, til þess að hver sem á hann trúir glatist ekki heldur hafi eilíft líf.(Jóhannes 3:16)",
                "Çünkü Tanrı @관리자'yı o kadar sevdi ki, biricik Oğlunu verdi; öyle ki, ona inananlar yok olmasın, sonsuz yaşama sahip olsunlar.(Yuhanna 3:16)",
                "Neboť Bůh tak miloval @관리자, že dal svého jediného Syna, aby žádný, kdo v něho věří, nezahynul, ale měl život věčný.(Jan 3:16)",
                "Sapagkat gayon na lamang ang pag-ibig ng Diyos kay @관리자 kaya ibinigay niya ang kanyang kaisa-isang Anak, upang ang sinumang sumampalataya sa kanya ay hindi mapahamak kundi magkaroon ng buhay na walang hanggan.(Juan 3:16)",
                "Mert Isten úgy szerette @관리자, hogy egyszülött Fiát adta, hogy aki hisz benne, el ne vesszen, hanem örök élete legyen.(János 3:16)",
                "Jer Bog je toliko ljubio @관리자 da je dao svog jedinorođenog Sina da nijedan koji u njega vjeruje ne propadne, nego da ima život vječni.(Ivan 3:16)",
                "Lebo Boh tak miloval @관리자, že dal svojho jednorodeného Syna, aby nikto, kto v neho verí, nezahynul, ale mal večný život (Ján 3:16)"
            ];
        } else if(phraseName == "roman") {
            phrase = [
                "Commendat autem caritatem suam Deus in @관리자: quoniam cum adhuc peccatores essemus, secundum tempus.(Romans 5:8)",
                "But God demonstrates his own love for @관리자 in this: While we were still sinners, Christ died for @관리자.(Roman 5:8)",
                "Mas Dios muestra su amor para con @관리자, en que siendo aún pecadores, Cristo murió por @관리자.(Romanos 5:8)",
                "Gott aber beweist seine Liebe zu @관리자 dadurch, dass Christus für @관리자 starb, als wir noch Sünder waren.(Römer 5:8)",
                "Mais Dieu démontre son propre amour pour @관리자 en ceci : alors que nous étions encore pécheurs, Christ est mort pour @관리자.(Romain 5:8)",
                "Mas Deus demonstra seu próprio amor por @관리자 nisto: Enquanto éramos ainda pecadores, Cristo morreu por @관리자.(Romanos 5:8)",
                "Men Gud viser sin egen kjærlighet til @관리자 i dette: Mens vi ennå var syndere, døde Kristus for @관리자.(Rom 5:8)",
                "Maar God toont zijn eigen liefde voor @관리자 hierin: Terwijl wij nog zondaars waren, stierf Christus voor @관리자.(Romeinen 5:8)",
                "Mutta Jumala osoittaa omaa rakkauttaan @관리자 kohtaan tässä: Kun olimme vielä syntisiä, Kristus kuoli @관리자:n puolesta.(Room. 5:8)",
                "Ma Dio dimostra il suo amore per @관리자 in questo: mentre eravamo ancora peccatori, Cristo morì per @관리자.(Romani 5:8)",
                "Dar Dumnezeu își demonstrează propria dragoste pentru @관리자 în aceasta: Pe când eram încă păcătoși, Hristos a murit pentru @관리자. (Romani 5:8)",
                "Però Déu demostra el seu propi amor per @관리자 en això: Quan encara érem pecadors, Crist va morir per @관리자.(Romans 5:8).",
                "Ale Bóg okazuje swoją miłość do @관리자 w ten sposób: Gdy byliśmy jeszcze grzesznikami, Chrystus umarł za @관리자.(Rzymian 5:8)",
                "Men Gud visar sin egen kärlek till @관리자 i detta: Medan vi fortfarande var syndare, dog Kristus för @관리자.(Rom 5:8)",
                "En Guð sýnir eigin kærleika til @관리자 í þessu: Meðan við vorum enn syndarar, dó Kristur fyrir @관리자.(Rómverjabréfið 5:8)",
                "Fakat Tanrı @관리자'ya olan sevgisini şununla gösterir: Biz hâlâ günahkarken, Mesih @관리자 için öldü.(Romalı 5:8)",
                "Ale Bůh prokazuje svou vlastní lásku k @관리자 v tomto: Když jsme byli ještě hříšníci, Kristus zemřel za @관리자. (Římanům 5:8)",
                "Ngunit ipinakita ng Diyos ang kanyang sariling pagmamahal kay @관리자 dito: Noong tayo ay makasalanan pa, si Kristo ay namatay para kay @관리자.(Roma 5:8)",
                "De Isten a saját szeretetét mutatja @관리자 iránt: Amikor még bűnösök voltunk, Krisztus meghalt @관리자ért. (Róma 5:8)",
                "Ali Bog pokazuje svoju ljubav prema @관리자 ovime: Dok smo još bili grešnici, Krist je umro za @관리자.(Rimljanima 5:8)",
                "Ale Boh dokazuje svoju vlastnú lásku k @관리자 v tomto: Kým sme boli ešte hriešnici, Kristus zomrel za @관리자.(Rímskym 5:8)"
            ];
        }

        let selectedPhrase = phrase[~~(Math.random() * phrase.length)];
        console.log(selectedPhrase);
        let background = ["linear-gradient(90deg, #00c3ff,#ffff1c)", "linear-gradient(90deg, #FF1818,#FFD93D)", "linear-gradient(90deg, #573391,#C65D7B)",
                          "linear-gradient(90deg, #b621fe, #1fd1f9)", "linear-gradient(90deg, #B9C6EF,#D2D2D2)"];
        let color = ["white", "white", "white", "white", "white"];
        let clridx = ~~(Math.random() * background.length);
        let style = "background:" + background[clridx] + "; font-size:19.2px; font-family:'Sitka Text'; font-weight:700; color:" + color[clridx] + "; text-shadow:1.5px 1.5px 1.5px #333; margin:0 auto; padding:14px";
        return makeHTMLPhrase(style, selectedPhrase, option);
    }

    document.querySelector('.write-area > .subtitle').innerHTML =
        "<button type='button' id='john' style='font-size:18px; border:1px solid #333; padding:3px'>요한복음 3:16</button> " +
        "<button type='button' id='roman' style='font-size:18px; border:1px solid #333; padding:3px'>로마서 5:8</button> " +
        "<button type='button' id='admin' style='font-size:18px; background-color:#eeeeee; border:1px solid #333; padding:3px'>@관리자</button>";

    document.querySelectorAll('.write-area > .subtitle > button').forEach(function(e) {
        e.onclick = function() {
            console.log(e.id + " " + option);
            if(e.id == 'admin') {
                option = ~option;
                if(option != 0) document.querySelector('#admin').style.backgroundColor = '#eeff88';
                else document.querySelector('#admin').style.backgroundColor = '#eeeeee';
            } else {
                phraseName = e.id;
                document.querySelector('.write-area > .input-wrapper .fr-element.fr-view').innerHTML = write(phraseName, option);
            }
        }
    });
})();