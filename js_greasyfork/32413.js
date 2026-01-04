// ==UserScript==
// @name         Conquête check duels interdits
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  meh
// @author       Thathanka iyothanka
// @match        https://fr11.the-west.fr/admin.php?screen=duel_log
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32413/Conqu%C3%AAte%20check%20duels%20interdits.user.js
// @updateURL https://update.greasyfork.org/scripts/32413/Conqu%C3%AAte%20check%20duels%20interdits.meta.js
// ==/UserScript==

(function() {
    $('#attacker_id').click();
    $('input[name="search"]').val("43480;996723;715958;1052437;1049108;1048088;1050153;5678;971033;1050208;265187;255577;827317;1052015;1049876;954952;861784;1051332;1043307;951385;884720;262864;1032056;1032757;1046211;432562;1050273;59048;1004074;1033224;1031029;425479;1051515;301895;859549;848659;282118;504360;279527;654419;748291;870448;447467;580921;1051824;10673;1035227;523488;1033548;199018;820296;1046169;1001361;1050160;1050409;811148;170779;1031473;1050229;1050159;26143;888814;1050165;25619;681500;30996;912031;7482;1000969;779193;7007;1046212;307432;832596;197229;1041536;1050205;1034888;1050169;969128;153409;64509;197509;944031;55701;471617;901470;207986;588907;1037301;941921;58959;268300;807074;872187");

    var protection1 = ['laulaulol','Gilardi','Mick Jagger','Spartan5','Erakiod','shéraphina','williamthacker','Hildoceras','nagchampa','Clint Mille','Shayleen','mghribi','metalian69','Robert Mac Clum','Romantok','Pacha8059','Oscea','Sherlocked','killing','blatar','*Golgoth*','krikri72','TheLittleDwarf','wendy grey','blue ace','Bernier879','Mary Popps','tofp1','Diamella','Sakari Luyana','Eto Demerzel','Don Cristobal','arnoldbrice19','la becasse','Tchicha','Fenella','2Rpac','Gérard le fromager','Charles Dexter Ward','le k','*Fauve*','*Tex*','YulBrynner','Dr Law','Richardson','free63'];
    var protection2 = ['Johnny OHanlan','Joeletueur','crumpet*','sephirothis','lmorel','GreenStylzZ','Tmeuns','ddeniss','Roger le Charcutier','Thaïs','momo le destructeur','Azhure SunSoar','Florfou','oursdur1','Kate Quantrill','FRITILAIRE','zepenforce','Maveriick','Jack lawson','valecourt','Nazarick','Mélusine33','poprocker','shun-belly','zaref','gerard de suresnes','krissdv','fifi brindacier','mic le bon','La Tigresse','Dr.jeco','Säde','GriGri96','*AppleCraft*','Red.hot','garlupus','bigdragonball','El Coyote Tequila','SLAD','Kuynt','-simplet-','bérangère lapoissonnière','carribouh','MAUDIT CASTOR','lexa00','N3XUS39'];
    var protection3 = ['laulaulol','Gilardi','Mick Jagger','Spartan5','Erakiod','shéraphina','williamthacker','Hildoceras','nagchampa','Clint Mille','Shayleen','mghribi','metalian69','Robert Mac Clum','Romantok','Pacha8059','Oscea','Sherlocked','killing','blatar','*Golgoth*','krikri72','TheLittleDwarf','Johnny OHanlan','Joeletueur','crumpet*','sephirothis','lmorel','GreenStylzZ','Tmeuns','ddeniss','Roger le Charcutier','Thaïs','momo le destructeur','Azhure SunSoar','Florfou','oursdur1','Kate Quantrill','FRITILAIRE','zepenforce','Maveriick','Jack lawson','valecourt','Nazarick','Mélusine33','poprocker'];
    var protection4 = ['shun-belly','zaref','gerard de suresnes','krissdv','fifi brindacier','mic le bon','La Tigresse','Dr.jeco','Säde','GriGri96','*AppleCraft*','Red.hot','garlupus','bigdragonball','El Coyote Tequila','SLAD','Kuynt','-simplet-','bérangère lapoissonnière','carribouh','MAUDIT CASTOR','lexa00','N3XUS39','wendy grey','blue ace','Bernier879','Mary Popps','tofp1','Diamella','Sakari Luyana','Eto Demerzel','Don Cristobal','arnoldbrice19','la becasse','Tchicha','Fenella','2Rpac','Gérard le fromager','Charles Dexter Ward','le k','*Fauve*','*Tex*','YulBrynner','Dr Law','Richardson','free63'];

    $('tr[id*="log_"]:not([id*="wear"])').each(function() {
        var attacker_name = $(this.cells[2]).text();
        var defender_name = $(this.cells[4]).text();
        console.log(attacker_name + ' | ' + defender_name);
        if (((protection1.indexOf(attacker_name) !== -1) && (protection1.indexOf(defender_name) !== -1)) || ((protection2.indexOf(attacker_name) !== -1) && (protection2.indexOf(defender_name) !== -1)) || ((protection3.indexOf(attacker_name) !== -1) && (protection3.indexOf(defender_name) !== -1)) || ((protection4.indexOf(attacker_name) !== -1) && (protection4.indexOf(defender_name) !== -1))) {
            $(this).css({
                "color": "red",
                "font-weight": "bold"
            });
        }
    });
})();