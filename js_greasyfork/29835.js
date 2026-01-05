// ==UserScript==
// @name         Proxerrename
// @namespace    https://greasyfork.org/de/users/125009-novus4k
// @version      0.4
// @description  Einheitliche Kapitel- und Episodennamen auf proxer.me
// @author       Novus4K
// @include      https://www.proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://proxer.me/*
// @include      http://proxer.me/*
// @run-at       document-start
// lädt Anker
// @require      https://greasyfork.org/scripts/12981-proxer-userscript-anker/code/Proxer-Userscript-Anker.js?version=133025
// von Anker benötigt
// @grant       GM_setValue
// von Anker benötigt
// @grant       GM_getValue
// von Anker benötigt
// @grant        unsafeWindow
// @grant        GM_log
// @history     0.4 Anpassungen um mehre Serien zu verarbeiten
// @history     0.3 Erweiterung der Kapitel
// @history     0.2 Anpassung, an Anker Version 5.1 - Da andere Scripte mit Version 4.2 laufen.
// @history     0.1 Iitialisiert
// @downloadURL https://update.greasyfork.org/scripts/29835/Proxerrename.user.js
// @updateURL https://update.greasyfork.org/scripts/29835/Proxerrename.meta.js
// ==/UserScript==

//Mit Version 5.1 wurde die Aufrufmethode geändert, die Parameter wurden zu globalen Variablen.
//addAnkerMember('Proxerrename-Anker', 'Proxerrename', 3, proxerrename_actionControl, 'proxerrename', 1);
var anker_Modul_id = 'Proxerrename-Anker';
var anker_Modulname = 'Proxerrename';
var anker_Modus = 3;
var actionControl = proxerrename_actionControl;
var anker_Zusatz;

document.addEventListener('DOMContentLoaded', function(event) {
    addAnkerMember();
});

function proxerrename_actionControl(change){

    //Aufruf bei Initialisierung
    if(change ==="Initialisierung"){
        page();
    }
    //Aufgerufen, wenn User über die Oberfläche Script ein- oder ausschlatet
    else if(change === "User Eingabe"){
        //Den Namen der Speichervariable für den Status kann man nicht mehr selbst bestimmen.
        //Die Variable heißt jetzt immer "status" und hat die Zustände "on" oder "off".
        //Die Variable wird automatisch mit dem Status "on" initialisiert.
        if(GM_getValue("status") === "off"){
            // Ausgeschaltet

        } else {
            //Eingeschaltet
            page();
        }
    }
    // Aufruf bei Ajax von Proxer
    else if(change === "Ajax Aufruf"){
        page();
    }
}


function page() {

    if(window.location.pathname == '/info/2784/list'){

        fairytailpagemain();

    }  

    else if(window.location.pathname == '/info/2784/list/1'){

fairytailpageone();

}

    else if(window.location.pathname == '/info/2784/list/2'){

    fairytailpagetwo();    

    }  

    else if(window.location.pathname == '/info/2784/list/3'){

       fairytailpagethree();

    }

    else if(window.location.pathname == '/info/2784/list/4'){

        fairytailpagefour();

    }

    else if(window.location.pathname == '/info/2784/list/5'){

        fairytailpagefive();

    }
    else if(window.location.pathname == '/info/2784/list/6'){

         fairytailpagesix();

    }
    else{
    return;
    }
}

function fairytailpagemain(){

        document.getElementById('listTitleen1').innerHTML = "Kapitel 1 | Lucy and Natsu";
        document.getElementById('listTitleen2').innerHTML = "Kapitel 2 | The Master Appears!";
        document.getElementById('listTitleen3').innerHTML = "Kapitel 3 | The Salamander, the Monkey and the Bull";
        document.getElementById('listTitleen4').innerHTML = "Kapitel 4 | Stellar Spirit of the Canis Minor";
        document.getElementById('listTitleen5').innerHTML = "Kapitel 5 | Daybreak";
        document.getElementById('listTitleen6').innerHTML = "Kapitel 6 | Infiltrating the Duke of Evaroo's Mansion!";
        document.getElementById('listTitleen7').innerHTML = "Kapitel 7 | The Weak Point of a Mage";
        document.getElementById('listTitleen8').innerHTML = "Kapitel 8 | Lucy vs. the Duke of Evaroo";
        document.getElementById('listTitleen9').innerHTML = "Kapitel 9 | Dear Kaby";
        document.getElementById('listTitleen10').innerHTML = "Kapitel 10 | Armored Mage";
        document.getElementById('listTitleen11').innerHTML = "Kapitel 11 | Natsu Is on the Train";
        document.getElementById('listTitleen12').innerHTML = "Kapitel 12 | Cursed Song";
        document.getElementById('listTitleen13').innerHTML = "Kapitel 13 | Shinigami Laughs Twice";
        document.getElementById('listTitleen14').innerHTML = "Kapitel 14 | Titania";
        document.getElementById('listTitleen15').innerHTML = "Kapitel 15 | Fairies in the Wind";
        document.getElementById('listTitleen16').innerHTML = "Kapitel 16 | Capture Kageyama!!";
        document.getElementById('listTitleen17').innerHTML = "Kapitel 17 | The Maiden's Magic";
        document.getElementById('listTitleen18').innerHTML = "Kapitel 18 | Flame and Wind";
        document.getElementById('listTitleen19').innerHTML = "Kapitel 19 | Impossible. You Can't Win, Natsu";
        document.getElementById('listTitleen20').innerHTML = "Kapitel 20 | In Order to Live Strong";
        document.getElementById('listTitleen21').innerHTML = "Kapitel 21 | The Strongest Team!!";
        document.getElementById('listTitleen22').innerHTML = "Kapitel 22 | Natsu vs. Erza";
        document.getElementById('listTitleen23').innerHTML = "Kapitel 23 | Crime and Punishment";
        document.getElementById('listTitleen24').innerHTML = "Kapitel 24 | Second Floor";
        document.getElementById('listTitleen25').innerHTML = "Kapitel 25 | Cursed Island";
        document.getElementById('listTitleen26').innerHTML = "Kapitel 26 | Is the Moon Out?";
        document.getElementById('listTitleen27').innerHTML = "Kapitel 27 | Deliora";
        document.getElementById('listTitleen28').innerHTML = "Kapitel 28 | Moon Drip";
        document.getElementById('listTitleen29').innerHTML = "Kapitel 29 | Gray and Lyon";
        document.getElementById('listTitleen30').innerHTML = "Kapitel 30 | Continuation of the Dream";
        document.getElementById('listTitleen31').innerHTML = "Kapitel 31 | Fearful Poison Poison Jelly";
        document.getElementById('listTitleen32').innerHTML = "Kapitel 32 | Natsu vs. Yuuka the Surge";
        document.getElementById('listTitleen33').innerHTML = "Kapitel 33 | Close? A Door to the Bull";
        document.getElementById('listTitleen34').innerHTML = "Kapitel 34 | Sword of Judgement";
        document.getElementById('listTitleen35').innerHTML = "Kapitel 35 | Do Whatever You Want!";
        document.getElementById('listTitleen36').innerHTML = "Kapitel 36 | Ur";
        document.getElementById('listTitleen37').innerHTML = "Kapitel 37 | The Blue Bird";
        document.getElementById('listTitleen38').innerHTML = "Kapitel 38 | Eternal Magic";
        document.getElementById('listTitleen39').innerHTML = "Kapitel 39 | The Truth Is a Sorrowful Blade of Ice";
        document.getElementById('listTitleen40').innerHTML = "Kapitel 40 | Final Battle on Garuna Island";
        document.getElementById('listTitleen41').innerHTML = "Kapitel 41 | Devil's Roar";
        document.getElementById('listTitleen42').innerHTML = "Kapitel 42 | The Arc of Time";
        document.getElementById('listTitleen43').innerHTML = "Kapitel 43 | Burst";
        document.getElementById('listTitleen44').innerHTML = "Kapitel 44 | The Villagers' Secret";
        document.getElementById('listTitleen45').innerHTML = "Kapitel 45 | Reach the Sky";
        document.getElementById('listTitleen46').innerHTML = "Kapitel 46 | Tear";
        document.getElementById('listTitleen47').innerHTML = "Kapitel 47 | Phantom Lord";
        document.getElementById('listTitleen48').innerHTML = "Kapitel 48 | Human Laws";
        document.getElementById('listTitleen49').innerHTML = "Kapitel 49 | All Good Things Come to an End";
        document.getElementById('listTitleen50').innerHTML = "Kapitel 50 | Lucy Heartphilia";

}

function fairytailpageone(){

        document.getElementById('listTitleen1').innerHTML = "Kapitel 1 | Lucy and Natsu";
        document.getElementById('listTitleen2').innerHTML = "Kapitel 2 | The Master Appears!";
        document.getElementById('listTitleen3').innerHTML = "Kapitel 3 | The Salamander, the Monkey and the Bull";
        document.getElementById('listTitleen4').innerHTML = "Kapitel 4 | Stellar Spirit of the Canis Minor";
        document.getElementById('listTitleen5').innerHTML = "Kapitel 5 | Daybreak";
        document.getElementById('listTitleen6').innerHTML = "Kapitel 6 | Infiltrating the Duke of Evaroo's Mansion!";
        document.getElementById('listTitleen7').innerHTML = "Kapitel 7 | The Weak Point of a Mage";
        document.getElementById('listTitleen8').innerHTML = "Kapitel 8 | Lucy vs. the Duke of Evaroo";
        document.getElementById('listTitleen9').innerHTML = "Kapitel 9 | Dear Kaby";
        document.getElementById('listTitleen10').innerHTML = "Kapitel 10 | Armored Mage";
        document.getElementById('listTitleen11').innerHTML = "Kapitel 11 | Natsu Is on the Train";
        document.getElementById('listTitleen12').innerHTML = "Kapitel 12 | Cursed Song";
        document.getElementById('listTitleen13').innerHTML = "Kapitel 13 | Shinigami Laughs Twice";
        document.getElementById('listTitleen14').innerHTML = "Kapitel 14 | Titania";
        document.getElementById('listTitleen15').innerHTML = "Kapitel 15 | Fairies in the Wind";
        document.getElementById('listTitleen16').innerHTML = "Kapitel 16 | Capture Kageyama!!";
        document.getElementById('listTitleen17').innerHTML = "Kapitel 17 | The Maiden's Magic";
        document.getElementById('listTitleen18').innerHTML = "Kapitel 18 | Flame and Wind";
        document.getElementById('listTitleen19').innerHTML = "Kapitel 19 | Impossible. You Can't Win, Natsu";
        document.getElementById('listTitleen20').innerHTML = "Kapitel 20 | In Order to Live Strong";
        document.getElementById('listTitleen21').innerHTML = "Kapitel 21 | The Strongest Team!!";
        document.getElementById('listTitleen22').innerHTML = "Kapitel 22 | Natsu vs. Erza";
        document.getElementById('listTitleen23').innerHTML = "Kapitel 23 | Crime and Punishment";
        document.getElementById('listTitleen24').innerHTML = "Kapitel 24 | Second Floor";
        document.getElementById('listTitleen25').innerHTML = "Kapitel 25 | Cursed Island";
        document.getElementById('listTitleen26').innerHTML = "Kapitel 26 | Is the Moon Out?";
        document.getElementById('listTitleen27').innerHTML = "Kapitel 27 | Deliora";
        document.getElementById('listTitleen28').innerHTML = "Kapitel 28 | Moon Drip";
        document.getElementById('listTitleen29').innerHTML = "Kapitel 29 | Gray and Lyon";
        document.getElementById('listTitleen30').innerHTML = "Kapitel 30 | Continuation of the Dream";
        document.getElementById('listTitleen31').innerHTML = "Kapitel 31 | Fearful Poison Poison Jelly";
        document.getElementById('listTitleen32').innerHTML = "Kapitel 32 | Natsu vs. Yuuka the Surge";
        document.getElementById('listTitleen33').innerHTML = "Kapitel 33 | Close? A Door to the Bull";
        document.getElementById('listTitleen34').innerHTML = "Kapitel 34 | Sword of Judgement";
        document.getElementById('listTitleen35').innerHTML = "Kapitel 35 | Do Whatever You Want!";
        document.getElementById('listTitleen36').innerHTML = "Kapitel 36 | Ur";
        document.getElementById('listTitleen37').innerHTML = "Kapitel 37 | The Blue Bird";
        document.getElementById('listTitleen38').innerHTML = "Kapitel 38 | Eternal Magic";
        document.getElementById('listTitleen39').innerHTML = "Kapitel 39 | The Truth Is a Sorrowful Blade of Ice";
        document.getElementById('listTitleen40').innerHTML = "Kapitel 40 | Final Battle on Garuna Island";
        document.getElementById('listTitleen41').innerHTML = "Kapitel 41 | Devil's Roar";
        document.getElementById('listTitleen42').innerHTML = "Kapitel 42 | The Arc of Time";
        document.getElementById('listTitleen43').innerHTML = "Kapitel 43 | Burst";
        document.getElementById('listTitleen44').innerHTML = "Kapitel 44 | The Villagers' Secret";
        document.getElementById('listTitleen45').innerHTML = "Kapitel 45 | Reach the Sky";
        document.getElementById('listTitleen46').innerHTML = "Kapitel 46 | Tear";
        document.getElementById('listTitleen47').innerHTML = "Kapitel 47 | Phantom Lord";
        document.getElementById('listTitleen48').innerHTML = "Kapitel 48 | Human Laws";
        document.getElementById('listTitleen49').innerHTML = "Kapitel 49 | All Good Things Come to an End";
        document.getElementById('listTitleen50').innerHTML = "Kapitel 50 | Lucy Heartphilia";

}
function fairytailpagetwo(){

        document.getElementById('listTitleen51').innerHTML = "Kapitel 51 | Giant Shadow";
        document.getElementById('listTitleen52').innerHTML = "Kapitel 52 | 15 Minutes";
        document.getElementById('listTitleen53').innerHTML = "Kapitel 53 | Blazing Battle";
        document.getElementById('listTitleen54').innerHTML = "Kapitel 54 | Phantom Mk2";
        document.getElementById('listTitleen55').innerHTML = "Kapitel 55 | So No One Sees the Tears";
        document.getElementById('listTitleen56').innerHTML = "Kapitel 56 | A Flower Blooms in the Rain";
        document.getElementById('listTitleen57').innerHTML = "Kapitel 57 | Fair-Weather Charm";
        document.getElementById('listTitleen58').innerHTML = "Kapitel 58 | There Is Always Someone Better";
        document.getElementById('listTitleen59').innerHTML = "Kapitel 59 | Inspire";
        document.getElementById('listTitleen60').innerHTML = "Kapitel 60 | Wings of Fire";
        document.getElementById('listTitleen61').innerHTML = "Kapitel 61 | The Two Dragon Slayers";
        document.getElementById('listTitleen62').innerHTML = "Kapitel 62 | When the Fairy Fell";
        document.getElementById('listTitleen63').innerHTML = "Kapitel 63 | Now We're Even";
        document.getElementById('listTitleen64').innerHTML = "Kapitel 64 | The Best Guild";
        document.getElementById('listTitleen65').innerHTML = "Kapitel 65 | Fairy Law";
        document.getElementById('listTitleen66').innerHTML = "Kapitel 66 | Like-Minded";
        document.getElementById('listTitleen67').innerHTML = "Kapitel 67 | My Decision";
        document.getElementById('listTitleen68').innerHTML = "Kapitel 68 | Goodbye";
        document.getElementById('listTitleen69').innerHTML = "Kapitel 69 | Next Generation";
        document.getElementById('listTitleen70').innerHTML = "Kapitel 70 | Frederick & Yanderica";
        document.getElementById('listTitleen71').innerHTML = "Kapitel 71 | A Night in Impatiens";
        document.getElementById('listTitleen72').innerHTML = "Kapitel 72 | The Star That Will Never Return to the Sky";
        document.getElementById('listTitleen73').innerHTML = "Kapitel 73 | Year 781 • Blue Pegasus";
        document.getElementById('listTitleen74').innerHTML = "Kapitel 74 | Celestial Spirit King";
        document.getElementById('listTitleen75').innerHTML = "Kapitel 75 | Dream of a Butterfly";
        document.getElementById('listTitleen76').innerHTML = "Kapitel 76 | The Tower of Heaven";
        document.getElementById('listTitleen77').innerHTML = "Kapitel 77 | Jellal";
        document.getElementById('listTitleen78').innerHTML = "Kapitel 78 | Heaven Over There";
        document.getElementById('listTitleen79').innerHTML = "Kapitel 79 | Siegrain's Decision";
        document.getElementById('listTitleen80').innerHTML = "Kapitel 80 | Joan of Arc";
        document.getElementById('listTitleen81').innerHTML = "Kapitel 81 | The Voice in the Darkness";
        document.getElementById('listTitleen82').innerHTML = "Kapitel 82 | Howling at the Moon";
        document.getElementById('listTitleen83').innerHTML = "Kapitel 83 | Find the Way";
        document.getElementById('listTitleen84').innerHTML = "Kapitel 84 | Natsu-Cat Fight!!";
        document.getElementById('listTitleen85').innerHTML = "Kapitel 85 | Heaven's Game";
        document.getElementById('listTitleen86').innerHTML = "Kapitel 86 | Rock of Succubus";
        document.getElementById('listTitleen87').innerHTML = "Kapitel 87 | Lucy vs. Juvia";
        document.getElementById('listTitleen88').innerHTML = "Kapitel 88 | Natsu Becomes a Meal";
        document.getElementById('listTitleen89').innerHTML = "Kapitel 89 | Armor Around a Heart";
        document.getElementById('listTitleen90').innerHTML = "Kapitel 90 | Ikaruga";
        document.getElementById('listTitleen91').innerHTML = "Kapitel 91 | One Woman! The Decisive Outfit";
        document.getElementById('listTitleen92').innerHTML = "Kapitel 92 | Destiny";
        document.getElementById('listTitleen93').innerHTML = "Kapitel 93 | Pray to the Sacred Light";
        document.getElementById('listTitleen94').innerHTML = "Kapitel 94 | One Person";
        document.getElementById('listTitleen95').innerHTML = "Kapitel 95 | Sleeping Beauty Warrior";
        document.getElementById('listTitleen96').innerHTML = "Kapitel 96 | Meteor";
        document.getElementById('listTitleen97').innerHTML = "Kapitel 97 | A Life as a Shield";
        document.getElementById('listTitleen98').innerHTML = "Kapitel 98 | Dragon Force";
        document.getElementById('listTitleen99').innerHTML = "Kapitel 99 | Titania Falls";
        document.getElementById('listTitleen100').innerHTML = "Kapitel 100 | To Tomorrow!";

}
function fairytailpagethree(){

        document.getElementById('listTitleen101').innerHTML = "Kapitel 101 | Rage Within the Red Earth";
        document.getElementById('listTitleen102').innerHTML = "Kapitel 102 | Walk Strong";
        document.getElementById('listTitleen103').innerHTML = "Kapitel 103 | Home";
        document.getElementById('listTitleen104').innerHTML = "Kapitel 104 | Best Friend";
        document.getElementById('listTitleen105').innerHTML = "Kapitel 105 | That Man, Laxus";
        document.getElementById('listTitleen106').innerHTML = "Kapitel 106 | The Harvest Festival";
        document.getElementById('listTitleen107').innerHTML = "Kapitel 107 | The Battle of Fairy Tail";
        document.getElementById('listTitleen108').innerHTML = "Kapitel 108 | Go-cheen";
        document.getElementById('listTitleen109').innerHTML = "Kapitel 109 | Friendly Fire for Friendship's Sake";
        document.getElementById('listTitleen110').innerHTML = "Kapitel 110 | Resign";
        document.getElementById('listTitleen111').innerHTML = "Kapitel 111 | Four Members Remaining";
        document.getElementById('listTitleen112').innerHTML = "Kapitel 112 | Bombing Runs and Sword Dances";
        document.getElementById('listTitleen113').innerHTML = "Kapitel 113 | Thunder Palace";
        document.getElementById('listTitleen114').innerHTML = "Kapitel 114 | Love Breaks Down Walls";
        document.getElementById('listTitleen115').innerHTML = "Kapitel 115 | Regulus (The Light of the Lion)";
        document.getElementById('listTitleen116').innerHTML = "Kapitel 116 | Cana vs. Juvia";
        document.getElementById('listTitleen117').innerHTML = "Kapitel 117 | Satan's Halo";
        document.getElementById('listTitleen118').innerHTML = "Kapitel 118 | Gentle Words";
        document.getElementById('listTitleen119').innerHTML = "Kapitel 119 | Attack! The Great Kardia Cathedral";
        document.getElementById('listTitleen120').innerHTML = "Kapitel 120 | Mystogan";
        document.getElementById('listTitleen121').innerHTML = "Kapitel 121 | My Chance to Take the Top Seat, Right?";
        document.getElementById('listTitleen122').innerHTML = "Kapitel 122 | The Lonely Thunder Clap";
        document.getElementById('listTitleen123').innerHTML = "Kapitel 123 | Double Dragon";
        document.getElementById('listTitleen124').innerHTML = "Kapitel 124 | Triple Dragon";
        document.getElementById('listTitleen125').innerHTML = "Kapitel 125 | Face of a Devil, Heart of an Angel";
        document.getElementById('listTitleen126').innerHTML = "Kapitel 126 | Stand up!!!!";
        document.getElementById('listTitleen127').innerHTML = "Kapitel 127 | Sacrifice for Justice";
        document.getElementById('listTitleen128').innerHTML = "Kapitel 128 | Fantasia";
        document.getElementById('listTitleen129').innerHTML = "Kapitel 129 | But Even So, I'll...";
        document.getElementById('listTitleen130').innerHTML = "Kapitel 130 | Love & Lucky";
        document.getElementById('listTitleen131').innerHTML = "Kapitel 131 | Nirvana";
        document.getElementById('listTitleen132').innerHTML = "Kapitel 132 | Allies, Unite!";
        document.getElementById('listTitleen133').innerHTML = "Kapitel 133 | 12 vs. 6";
        document.getElementById('listTitleen134').innerHTML = "Kapitel 134 | Oración Seis Appears!";
        document.getElementById('listTitleen135').innerHTML = "Kapitel 135 | Priestess of the Sky";
        document.getElementById('listTitleen136').innerHTML = "Kapitel 136 | Coffin";
        document.getElementById('listTitleen137').innerHTML = "Kapitel 137 | The Girl and the Ghosts";
        document.getElementById('listTitleen138').innerHTML = "Kapitel 138 | Didn't Count On...";
        document.getElementById('listTitleen139').innerHTML = "Kapitel 139 | Dead Grand Prix";
        document.getElementById('listTitleen140').innerHTML = "Kapitel 140 | Slow Speed World";
        document.getElementById('listTitleen141').innerHTML = "Kapitel 141 | Light";
        document.getElementById('listTitleen142').innerHTML = "Kapitel 142 | Darkness";
        document.getElementById('listTitleen143').innerHTML = "Kapitel 143 | Celestial Spirit Brawl";
        document.getElementById('listTitleen144').innerHTML = "Kapitel 144 | Pretty Voice";
        document.getElementById('listTitleen145').innerHTML = "Kapitel 145 | Memories of Jellal";
        document.getElementById('listTitleen146').innerHTML = "Kapitel 146 | You Are Free";
        document.getElementById('listTitleen147').innerHTML = "Kapitel 147 | Guild of Hope";
        document.getElementById('listTitleen148').innerHTML = "Kapitel 148 | March of Destruction";
        document.getElementById('listTitleen149').innerHTML = "Kapitel 149 | The Super Aerial Battle!! Natsu vs. Cobra";
        document.getElementById('listTitleen150').innerHTML = "Kapitel 150 | Dragon's Roar"; 

}
function fairytailpagefour(){

        document.getElementById('listTitleen151').innerHTML = "Kapitel 151 | Annihilation of Six Demons?!";
        document.getElementById('listTitleen152').innerHTML = "Kapitel 152 | Jura the Tenth Saint";
        document.getElementById('listTitleen153').innerHTML = "Kapitel 153 | Counter Attack in the Middle of the Night";
        document.getElementById('listTitleen154').innerHTML = "Kapitel 154 | Your Words Especially";
        document.getElementById('listTitleen155').innerHTML = "Kapitel 155 | Last Man";
        document.getElementById('listTitleen156').innerHTML = "Kapitel 156 | Zero";
        document.getElementById('listTitleen157').innerHTML = "Kapitel 157 | From Heaven's Steed to the Fairies";
        document.getElementById('listTitleen158').innerHTML = "Kapitel 158 | The Door to Memory";
        document.getElementById('listTitleen159').innerHTML = "Kapitel 159 | The Flame of Guilt";
        document.getElementById('listTitleen160').innerHTML = "Kapitel 160 | The Power of Emotion";
        document.getElementById('listTitleen161').innerHTML = "Kapitel 161 | Fight for Right";
        document.getElementById('listTitleen162').innerHTML = "Kapitel 162 | I'm by Your Side";
        document.getElementById('listTitleen163').innerHTML = "Kapitel 163 | The Scarlet Sky";
        document.getElementById('listTitleen164').innerHTML = "Kapitel 164 | A Guild of One";
        document.getElementById('listTitleen165').innerHTML = "Kapitel 165 | Wendy the Fairy Girl";
        document.getElementById('listTitleen166').innerHTML = "Kapitel 166 | Black Dragon";
        document.getElementById('listTitleen167').innerHTML = "Kapitel 167 | The Vanishing Town";
        document.getElementById('listTitleen168').innerHTML = "Kapitel 168 | Earth-land";
        document.getElementById('listTitleen169').innerHTML = "Kapitel 169 | Edolas";
        document.getElementById('listTitleen170').innerHTML = "Kapitel 170 | Fairy Hunting";
        document.getElementById('listTitleen171').innerHTML = "Kapitel 171 | Faust";
        document.getElementById('listTitleen172').innerHTML = "Kapitel 172 | The Key to Hope";
        document.getElementById('listTitleen173').innerHTML = "Kapitel 173 | Fireball";
        document.getElementById('listTitleen174').innerHTML = "Kapitel 174 | Revelation";
        document.getElementById('listTitleen175').innerHTML = "Kapitel 175 | Welcome Home";
        document.getElementById('listTitleen176').innerHTML = "Kapitel 176 | Extalia";
        document.getElementById('listTitleen177').innerHTML = "Kapitel 177 | Fly to Your Friends!";
        document.getElementById('listTitleen178').innerHTML = "Kapitel 178 | Because I'm By Your Side";
        document.getElementById('listTitleen179').innerHTML = "Kapitel 179 | Code ETD";
        document.getElementById('listTitleen180').innerHTML = "Kapitel 180 | Erza vs. Erza";
        document.getElementById('listTitleen181').innerHTML = "Kapitel 181 | Full Out Attack of the Edolas Royal Forces";
        document.getElementById('listTitleen182').innerHTML = "Kapitel 182 | It's People's Lives, Right?!!!";
        document.getElementById('listTitleen183').innerHTML = "Kapitel 183 | Monster Academy";
        document.getElementById('listTitleen184').innerHTML = "Kapitel 184 | For the Pride of the Great Celestial River";
        document.getElementById('listTitleen185').innerHTML = "Kapitel 185 | Ice Boy";
        document.getElementById('listTitleen186').innerHTML = "Kapitel 186 | My Cat";
        document.getElementById('listTitleen187').innerHTML = "Kapitel 187 | Chain Cannon of the Doomsday Dragon";
        document.getElementById('listTitleen188').innerHTML = "Kapitel 188 | One Wing";
        document.getElementById('listTitleen189').innerHTML = "Kapitel 189 | The Boy From Back Then";
        document.getElementById('listTitleen190').innerHTML = "Kapitel 190 | Dragon Sense";
        document.getElementById('listTitleen191').innerHTML = "Kapitel 191 | Three-Man Cell";
        document.getElementById('listTitleen192').innerHTML = "Kapitel 192 | Won't Run Anymore";
        document.getElementById('listTitleen193').innerHTML = "Kapitel 193 | To Be Alive";
        document.getElementById('listTitleen194').innerHTML = "Kapitel 194 | I'm Standing Right Here";
        document.getElementById('listTitleen195').innerHTML = "Kapitel 195 | King of a New World";
        document.getElementById('listTitleen196').innerHTML = "Kapitel 196 | Demon God Dragneel";
        document.getElementById('listTitleen197').innerHTML = "Kapitel 197 | Bye-Bye Fairy Tail";
        document.getElementById('listTitleen198').innerHTML = "Kapitel 198 | The Wings to Tomorrow";
        document.getElementById('listTitleen199').innerHTML = "Kapitel 199 | Lisanna";
        document.getElementById('listTitleen200').innerHTML = "Kapitel 200 | He Who Snuffs Out Life";

}
function fairytailpagefive (){

        document.getElementById('listTitleen201').innerHTML = "Kapitel 201 | Trial";
        document.getElementById('listTitleen202').innerHTML = "Kapitel 202 | Best Partner";
        document.getElementById('listTitleen203').innerHTML = "Kapitel 203 | Eight Roads";
        document.getElementById('listTitleen204').innerHTML = "Kapitel 204 | Who Is the Lucky One?";
        document.getElementById('listTitleen205').innerHTML = "Kapitel 205 | Natsu vs. Gildarts";
        document.getElementById('listTitleen206').innerHTML = "Kapitel 206 | To Continue Down This Path";
        document.getElementById('listTitleen207').innerHTML = "Kapitel 207 | Mest";
        document.getElementById('listTitleen208').innerHTML = "Kapitel 208 | Predator of Death";
        document.getElementById('listTitleen209').innerHTML = "Kapitel 209 | The Black Wizard";
        document.getElementById('listTitleen210').innerHTML = "Kapitel 210 | Stupid Gajeel";
        document.getElementById('listTitleen211').innerHTML = "Kapitel 211 | Kawazu and Yomazu";
        document.getElementById('listTitleen212').innerHTML = "Kapitel 212 | Soul of Iron";
        document.getElementById('listTitleen213').innerHTML = "Kapitel 213 | One of the Seven Kin";
        document.getElementById('listTitleen214').innerHTML = "Kapitel 214 | Makarov on the Attack";
        document.getElementById('listTitleen215').innerHTML = "Kapitel 215 | Makarov vs. Hades";
        document.getElementById('listTitleen216').innerHTML = "Kapitel 216 | The Essence of Magic";
        document.getElementById('listTitleen217').innerHTML = "Kapitel 217 | Lost Magic";
        document.getElementById('listTitleen218').innerHTML = "Kapitel 218 | Fire Dragon vs. Fire God";
        document.getElementById('listTitleen219').innerHTML = "Kapitel 219 | The Dragon God's Gleaming Flame";
        document.getElementById('listTitleen220').innerHTML = "Kapitel 220 | Fairy Sisters";
        document.getElementById('listTitleen221').innerHTML = "Kapitel 221 | The Great Magic World";
        document.getElementById('listTitleen222').innerHTML = "Kapitel 222 | Arc of Incarnation";
        document.getElementById('listTitleen223').innerHTML = "Kapitel 223 | The Human Gate";
        document.getElementById('listTitleen224').innerHTML = "Kapitel 224 | The Ambition of Zoldio";
        document.getElementById('listTitleen225').innerHTML = "Kapitel 225 | The Open Seam";
        document.getElementById('listTitleen226').innerHTML = "Kapitel 226 | A Curse of Vengeance";
        document.getElementById('listTitleen227').innerHTML = "Kapitel 227 | Lucy Fire";
        document.getElementById('listTitleen228').innerHTML = "Kapitel 228 | Rain Soaked the 13th Woman";
        document.getElementById('listTitleen229').innerHTML = "Kapitel 229 | Dead End of Despair";
        document.getElementById('listTitleen230').innerHTML = "Kapitel 230 | Tears of Love and Vitality";
        document.getElementById('listTitleen231').innerHTML = "Kapitel 231 | The One Who Ends It";
        document.getElementById('listTitleen232').innerHTML = "Kapitel 232 | The Word I Couldn't Say";
        document.getElementById('listTitleen233').innerHTML = "Kapitel 233 | Fairy Glitter";
        document.getElementById('listTitleen234').innerHTML = "Kapitel 234 | The Boy Who Watches the Sea";
        document.getElementById('listTitleen235').innerHTML = "Kapitel 235 | The Sirius Tree";
        document.getElementById('listTitleen236').innerHTML = "Kapitel 236 | Erza vs. Azuma";
        document.getElementById('listTitleen237').innerHTML = "Kapitel 237 | What Kind of Guild Is This";
        document.getElementById('listTitleen238').innerHTML = "Kapitel 238 | At One Time";
        document.getElementById('listTitleen239').innerHTML = "Kapitel 239 | The Freezing Warrior";
        document.getElementById('listTitleen240').innerHTML = "Kapitel 240 | Gray vs. Ultear";
        document.getElementById('listTitleen241').innerHTML = "Kapitel 241 | The Power of Life";
        document.getElementById('listTitleen242').innerHTML = "Kapitel 242 | Acnologia";
        document.getElementById('listTitleen243').innerHTML = "Kapitel 243 | Errors and Experience";
        document.getElementById('listTitleen244').innerHTML = "Kapitel 244 | The Peal of Thunder";
        document.getElementById('listTitleen245').innerHTML = "Kapitel 245 | The Man Without the Mark";
        document.getElementById('listTitleen246').innerHTML = "Kapitel 246 | The Region of the Depths";
        document.getElementById('listTitleen247').innerHTML = "Kapitel 247 | Just Look How Close";
        document.getElementById('listTitleen248').innerHTML = "Kapitel 248 | Dawn on Sirius Island";
        document.getElementById('listTitleen249').innerHTML = "Kapitel 249 | Magic Is Alive";
        document.getElementById('listTitleen250').innerHTML = "Kapitel 250 | Zeref Awakened";

}
function fairytailpagesix (){

	document.getElementById('listTitleen251').innerHTML = "Kapitel 251 | The Right to Love";
        document.getElementById('listTitleen252').innerHTML = "Kapitel 252 | To You Prideful Brats";
        document.getElementById('listTitleen253').innerHTML = "Kapitel 253 | Let's Join Hands";
        document.getElementById('listTitleen254').innerHTML = "Kapitel 254 | Fairy Tail, X791";
        document.getElementById('listTitleen255').innerHTML = "Kapitel 255 | Fairy Sphere";
        document.getElementById('listTitleen256').innerHTML = "Kapitel 256 | Seven Empty Years";
        document.getElementById('listTitleen257').innerHTML = "Kapitel 257 | Father's Seven Years";
        document.getElementById('listTitleen258').innerHTML = "Kapitel 258 | Saber Tooth";
        document.getElementById('listTitleen259').innerHTML = "Kapitel 259 | Porlyusica";
        document.getElementById('listTitleen260').innerHTML = "Kapitel 260 | And We're Going to Aim for the Top";
        document.getElementById('listTitleen261').innerHTML = "Kapitel 261 | Magic Singularity";
        document.getElementById('listTitleen262').innerHTML = "Kapitel 262 | Song of the Celestials";
        document.getElementById('listTitleen263').innerHTML = "Kapitel 263 | Crime Sorcière";
        document.getElementById('listTitleen264').innerHTML = "Kapitel 264 | Only the Amount of Time Lost";
        document.getElementById('listTitleen265').innerHTML = "Kapitel 265 | Crocus, The Capital of Blooming Flowers";
        document.getElementById('listTitleen266').innerHTML = "Kapitel 266 | Sky Labyrinth";
        document.getElementById('listTitleen267').innerHTML = "Kapitel 267 | A New Guild";
        document.getElementById('listTitleen268').innerHTML = "Kapitel 268 | The Secret Weapon, Team B";
        document.getElementById('listTitleen269').innerHTML = "Kapitel 269 | Fade into the Silence";
        document.getElementById('listTitleen270').innerHTML = "Kapitel 270 | Night of Falling Stars";
        document.getElementById('listTitleen271').innerHTML = "Kapitel 271 | Lucy vs. Flare";
        document.getElementById('listTitleen272').innerHTML = "Kapitel 272 | Graceful Defeat";
        document.getElementById('listTitleen273').innerHTML = "Kapitel 273 | Olga of the Black Lightning";
        document.getElementById('listTitleen274').innerHTML = "Kapitel 274 | Bad Omen";
        document.getElementById('listTitleen275').innerHTML = "Kapitel 275 | Drunken Hawk";
        document.getElementById('listTitleen276').innerHTML = "Kapitel 276 | Chariot";
        document.getElementById('listTitleen277').innerHTML = "Kapitel 277 | Socks";
        document.getElementById('listTitleen278').innerHTML = "Kapitel 278 | Elfman vs. Bacchus";
        document.getElementById('listTitleen279').innerHTML = "Kapitel 279 | A Door Sunken into Darkness";
        document.getElementById('listTitleen280').innerHTML = "Kapitel 280 | Kagura vs. Yukino";
        document.getElementById('listTitleen281').innerHTML = "Kapitel 281 | Grudges Wrapped in the Curtain of Night";
        document.getElementById('listTitleen282').innerHTML = "Kapitel 282 | Ten Keys and Two Keys";
        document.getElementById('listTitleen283').innerHTML = "Kapitel 283 | Natsu vs. Saber Tooth";
        document.getElementById('listTitleen284').innerHTML = "Kapitel 284 | Pandemonium";
        document.getElementById('listTitleen285').innerHTML = "Kapitel 285 | MPF";
        document.getElementById('listTitleen286').innerHTML = "Kapitel 286 | Laxus vs. Alexei";
        document.getElementById('listTitleen287').innerHTML = "Kapitel 287 | True Family";
        document.getElementById('listTitleen288').innerHTML = "Kapitel 288 | Wendy vs. Sherria";
        document.getElementById('listTitleen289').innerHTML = "Kapitel 289 | Tiny Fists";
        document.getElementById('listTitleen290').innerHTML = "Kapitel 290 | The Night Our Feelings Intersect";
        document.getElementById('listTitleen291').innerHTML = "Kapitel 291 | Naval Battle";
        document.getElementById('listTitleen292').innerHTML = "Kapitel 292 | Thoughts Joined as One";
        document.getElementById('listTitleen293').innerHTML = "Kapitel 293 | A Gift for You of Perfume";
        document.getElementById('listTitleen294').innerHTML = "Kapitel 294 | Battle of the Dragon Slayers";
        document.getElementById('listTitleen295').innerHTML = "Kapitel 295 | Sting and Lector";
        document.getElementById('listTitleen296').innerHTML = "Kapitel 296 | Natsu vs. Twin Dragons";
        document.getElementById('listTitleen297').innerHTML = "Kapitel 297 | The Girl's Face He Saw";
        document.getElementById('listTitleen298').innerHTML = "Kapitel 298 | Exciting Ryuzetsu Land";
        document.getElementById('listTitleen299').innerHTML = "Kapitel 299 | Lone Journey";
        document.getElementById('listTitleen300').innerHTML = "Kapitel 300 | Where the Dragon Souls Sleep";

}