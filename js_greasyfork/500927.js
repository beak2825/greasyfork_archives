// ==UserScript==
// @name         Allegro Account Switcher
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Logowanie do właściwego konta w SalesCenter przed edycją oferty i modyfikacja przycisków zgłaszania błędów w Katalogu
// @author       Paweł Kaczmarek
// @match        https://salescenter.allegro.com/my-assortment*
// @match        https://salescenter.allegro.com/account/shared/switch
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/500927/Allegro%20Account%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/500927/Allegro%20Account%20Switcher.meta.js
// ==/UserScript==

//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWWWWNNNNNXKKOkxxxdooool:;,,;:;;;;,,,cdOOOOkookKNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWWNX0Okocc:::;;,,'',''''.......',,;;:;;lk0KXWKxxlcdOXWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWNNNKkolllccc:;;;:;,'..''.,:c::;,,;;;:clc,:k000OKOO0oldxO0XNWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWNXNN0dlclllcccccllodxkO0000kxkOOOOx:;,':dl,',xX00xk00KxdxdxO000KKNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNXNXOdc:::;;ccldk0XWWWMMMMMMMMMWKOO0KK0o,;c:,,;oKK000K0KXNXK0OOOkdodkKNWWWMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNNNNKkoc::;,',lkKNWMMMMMMMMMMMMMMMMMMWMNKX0ko;,,:coO0OKKKXXKXWMMWNK0OkddddxOKNNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWXXX0dc::;;,;lx0WMMMMMMMMMMMMMMMMMMMMMMMMMMN00X0occ;;x00XXXNNNNWMMMMMMWNXKOdolodOXNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWNNNKOdc::;',cxKWWWWMMMMMMMMMMMMMMMMMMMMWMMWWWWWNKK0x:;clOXXNKKNNNWMMMMMMMMMMWX0kdooxkOKNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNNNKkocc:;,,,ckXWWWWWMMMMMMMMMMMMMMMMMMMWWMWNWWXXNNWX0KOl:cxKKXNKXXNMWMMMMMMMMMWWWXOkO0KKOONMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNXK0xc::::,',lkNWMWWWMMMMMMMMMMMMMMMMMMMMMWWWX0XWNXXNNWX00x:,l0XXWWNXNWWWMMWWWMMMMWWWNNK0kOOxKMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWNWNOocc:::;'':xXWWMMMMMMMMMMMMMMMMMMMMMMMMMWWWNXKXKKNXXXNWKOko:ckNWWMWWNWNXWWWWWMMMWWWNNWWNOk0xkNMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWWNX0ko::cc:;,,;dKNWWWMWWWWWMMMMMMMMWMMMMMMMWWMWNNWWNNKKNNNNNNWKdxl:kNWWWWWWWWNNNNWWMMWNNNWWWNXXXXKkKWWWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNXKOo;,,;:::,',:dKWWWWWWNNNNWWWWMMMWWWWWWWWWWWWWXK00XXKKXXXXNXXNWKxocd0KKKNWWNXWMWNNNWWWNXXWMWWNXNNKxxkkOXNNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWKkxc;;:cllcc;'',l0NXNWWWWNNWMMWWWWWMMWWWWWWNNNWNKXKOOOK0O0K0OKNXKNWKdloooxXNWX0000NWNNWWWWXXNWNXKO0XXOdxkKNNNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNo,;:lcllllc:,':dk0KXNNXXNNNNWWWWWNWNNXXXKKKXXK000KKK0OOOkOOkxkO0KXN0oloclKWMWKk0KxONWNKKK0O0KKK00KXNNWWWWMWNXNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNxcc::;:lcc:,,:odkXXKOkkO00KXNWNXXXNX0xxkkxxdoloddodkkkxxdkxollodk0kxlcccdNWMW0kXN0x0WX00KKXNWWWMWWWWNNXXWWWNXNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWklc;;,:l:;,';llcdOkxdddddxxOKNXOddkxddddddoooddddloxOK0OkO0OkkO00000OxddONWMXk0WWN0OXWNXNMWWWWMWWWNXXNKKNWN00XWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXXXOl:c:,;ccc;;:oxooxxkxdxOOkkkOKK0Okxddxxxxxkkk00K000OOOxxddxkkkkO0XX0kkxloOXWN0k0NXKXKkKXKNMMMWWWWMWN0O0XNNXNXKXNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMMWOoxdc::::cc:c::odxdlloollooodddxddoddl::loc::coxxlldxxdxkdllloooxk0KKXK00KOxOXWXkx0Ox0KKOkXWNWMWNNWWWWWWNOKXKXN00XWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMXK00kocloooloollc;lddddooooddddoclxxkkkkkkO0O0000xc::lxOkOOOkkkdddxxxdxxdkXOkKNXKKkO0k00OXOkNNNWX0XWWWWXO0NX0XWKOKNNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMMXxolc,:ol;;;,;ldolol::c:,;,,,cxdloxdlcc:::cllc;codkkod0xccc:codkOOOO00xlo00oOWXdxOOKXKKN000k0NWNNKOKWWNN00XXNNK0KK00XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNx:ll:lc;::;;;'lxxdllloxxxdol:oxlooc:clooolcoxl;,:lk0Oo::coxOOkOOkdd00xdkKdlKMXkkO0NNKXWXKXXk0NNWNO0WWNNXKXKOKKO0OxOKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNOxxo::ccdc,:doldoddoxxoooldOock00o;cddo:;;;;lkxcloccxOxxxOOxloxOOOO0dckNOcdNXxxXKxOOxxOOkKNKk0WN0xxO0XNK0XNNWWNKO0OKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMW0xdo:locll,,:dxc';kOdlldxkkocxOldxc;ckOOdc,,,,okOkxdddk0kolcldoxO0KXkcxXdlKWko0WNKOdkOxkOXWWXx0XOO00KNWWWWNXKKXo,kK0XWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMMKOOxlokccl;,cxdxddxxkdlccodocoOkdc,;o0Okdoodddxdlooxxol:okkdxxxxxkxkx:ldcdKKlxX0kOOx0N0kxOO0XOd0WXOkO0kdoodoccxxllxkk0XWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMNkokx:cxoc:coc;dko,ckO0kxxko:o0x,.;;,:;;;::;;:::ccoOxoooooooodoooooddxdcoOXklxddOOddOXN0dkXK0OdkNNKXXK0x:..,cdldKXOddxOXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXOxl:::l:;;;:lxko:odl:;;;;;;xk:''.';,,::;cooxOkOOKXK0OkkkkxxkxxxxxdolclxXKdlokXKxcx00NNOokWWNXXKNWWWWWWXd:clxdckKOxodk0NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXK0d,,dxdxxd:':dO0K0kkOOOkdd:',.,c:;;:c:::;;::;,,,'.........,;::;;,'',:kKkxKNNOolOKOKNWOd0WNKXNWWWWWNXK0d::odccoc;okk0WMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXdodc;:;'''..':l:;;;,;;::;;'.':::,..'......... ....',;;;;:oxOK000Oxl:'..ckKXXkoldKOxkONNOOXKKWWNXK0Oxxdoddllddcll,cxxONMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXl';odl,....'',;,'..........',c:,'''.    ......',;clllooooodxkkkOKK0kdc,..;xKOxkKX0OOO0OOOOKNX0xooollclxKXxlol:cl,;okOKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXxc:cc::;;;:ooloxxl;col:'.  ...,;cl,. ...'...,;;,;:::::::;,:cccloxOO0Okxo;';ccclxOKKKKkoxkO0kollcclddodOKkc;;oo:c:';okKNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWMMMWXOolc;..:lc,',,:cddldxdo;..:lc:lc,....'.'.  .............'..',,;,:lldxO0K000OkkkO0KXNNXOdddolloxkOKK00KXk,','lkolc.'cx0NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWK00kdo;..:c;.;ccoloxdoold;.dK0d:'....',,'.              ..........';cloodkO0XNNXKKXXKKK0xdxxoc:;;lxxxkk0Xd',ccoxdxl..'ckNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMW0oclc;;;,:dlc;:cclxkxoc;cl'.;:;'...,,',';'.      ..........';::;;:;,,;;;;;:clddxxkO0KNNXXK0OOxol:cxKXxdxOKd';:;cxOxo;..,oKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMWKxcc:'';ll::loo;.'cdcclc:dx'...'...',,;,;c'   ....''''';:;,,;:::;,,,,''',,,,'.,:oxO0XXXNNNX0kOK0xlcxXNNNNNXx;,;,':Oxc:'..:kXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWNxccll;;oddl;llldc'cxldl;:dd...,:c;.,,,c:cl'.......',,,;;;;,,,:l;,;;:c:,.',,,;,,;cdkOKXNNWNXNXKKXXXXNNXKKNWNOl,,;.'xkl;...;dKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXxc:;:c,:odo:,,cxocodkOo:cxc.',';l:;:;,ccco;.'',,::;,,'....',,lxdolldxOxdoool:,',:odxk0XWWNWWWWXXXXXXNNXNWWNXOc''''coc;...'cxXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWW0o;..::..lxdl:;;;,;:ckklcdO;..''';:cl::oc:ol..',;cc:::;,',;clloxk00KXX0kxxddxxd:,;cldkO0XNWWWWWWNNNNNWNNWWWWWX0c..';;''...'ldOWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWN0o,.'lc''lxdlcc:coc,cxoocod'..';;,::c:lxl:dx;.',;;;,;:cccodddodxOKKK0Oxxxxlokkdodoldddxk0XNWWWWWWWWNNNNWWWWWWWNk;..''.....,odxNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNkc;,co:,,:oo:;,,:xOdllll:c:....,;,,;::cdo;lOo',ccllc::c:;coodk0K0OkdddkkoclxkxkOOxc;:cdkk0XWWWWWWWWWNNKKNWWWWWWKc........';dkxKMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMW0c,.'ldc,;ccl::llloddoolc:lo;....';'';,:ol;ckOc,;coollll:;:cclodxxdxkkkkoclddxkOOxoolc:cokKNWWWWWWWWWWWNNWWWWWWNKo........;lxkxOWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXx;..;doc:;;;clllolcclllcclclddc'..,,,;,:oc;:oOx;,:lodddol:;clollodxOOxdddoddoodxkxxxxooodKNNWWWWWWWWWWWWWWWWWWWN0c.......,:x00OkKMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNOd:'.:xo;:l:;cod:....',..';coccxdc,'',,':lc:clxkl',::loxxxxxdolc:coooodxkkOkxdoxxoollol:lkKXXNNWWWWWWWWXKNWWWWWN0l'.......;lx0KOkkKMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXkl;lclkxlc,'.'okxl:,',;....:lc:::lddl:,',::cc:lxl,..':oxO0KKK0OxloddxxkOOKXKOxkxlclllollldk0XXNNWWWWWWW0okXWWWNKl.........'ldO0xxxxXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXOl:lloo:..;o:,clxOxl;lxll:'''...';::lxdoc::cc::lc,...';lodk0KOkdlldxkOKXNXK0kdl,,dOO00OxooxO0KKXNWWWWWNd';x0XNWO;..........,okkxkxokNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNXXXNWMMMMMMMMMMMMMMMMN0xc;:lodl:;;cl,:coddl::xkoll,...  .,,',:lxxdol:;lo;....',;coddddoldxkO0XKK0kxxo;.'codxxdc:cdxO0KKXNNNNNO:',:ok0XO:...........lxOkxoox0MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWOl:;,;l0WMMMMMMMMMMMMMMMN0o,.:xxlc:c:';c;lxxo:;,oo:cdxdl;,'. ..'',:dkkkdlll;......,;:ccloloddkO0KOxxoc:;. ..',,'....;cdkO0KKNNKx,':cclloddc,..........'lkkkccdkNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWO;....',xWMMMMMMMMMMMMMMMNOc::cdxlc:c:,;oxxddxl;:oolxkdc;,;;;;,;c,.,dOxxdoddol:,...'',:c::coddxxxxoll:'.. ....'''......',;lddlc,...';ccol::ll,',........;dkKdo0kKMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMKl,''..''lXMMMMMMMMMMMMMMMXkoc:dOo;,:l:;ccx0xlolcdocoddlc:'.,,;lxkc..:ool:odooddol'...,:;;,:loddooc;;;'....,;;:c;,,;;:c;......  ..''',,',::::c:cc;'.......okdolOxdNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNx:;,''...;0MMMMMMMMMMMMMMMXo,;cxOo;;:cc;:lodc::;,;''odldlldlcc,',ldlll:. .;cldklcd:...'.,:::clllc:,'.....',;:c;''',,:c:;',c;.....;,';:,..',:ccc;ll;'......,dxllOd:OMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXd:,''....'xWMMMMMMMMMMMMMMW0xdddl:,,,...'cdool;',;;,,loldooo,.':ld:.':oo:...,lo:okl.....';,,;c:;,'''....,;:cc;',;,';;..':l:,.  ..',..;:,...,;loc:cc;,;;,''.cxkdol:xXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWOc;,''....'dWMMMMMMMMMMMMMMMMNKx:,,:oc'.,:cllllol;;cc,.;odkk;'ll;:;;c:',cko,,;cocoko'....''.',,,'........,::;:;,,,;:;'..,:;.............,,...':oollcc::c:;;,,ldxdoox0WMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXo;,'''.....oNMMMMMMMMMMMMMMMMMW0dl;;:cc,,col::;'..,:cc;.'od:.'o:,:;;coox0Xk;,;lxodko'......'''.,,....','.;c,';:;:cc;;:cclccllool::,,'........',:oolollll:;;;',lxkxxxONWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNx;''''......cOKKKKKKKXXXXKKKK0Okdcc,,:loodddl'.,,:c;,;:c;''ll,;oc':oc;:,';dkcckOxdxkd'.....','..,,....,:;',:;,:ccccc:;:ccllc:,,,................':olcllollcc;',;lxOxokKXXNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWOc''''.............''.''',''''...........;col;;okxxxo:;:llc:;odl:,.;:,::::;lkl.,cocckx,.....''..','...,;:;,,,,;cllccc::;'....              ......'':ol::cclol:,;,,cc;lkO0KKXNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMKl'''................................. ....  .....''''..;lcldc';l;.'dx;,:,.;kOc.',loldx:.....,''',,'..'clc;;:;,,:cc::cc;..       ... ..............',;ol;;:lol:,;:ccl::lxO000KXNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWx,.''......................................             .'ccodc,;dxox0d;,;col,.,::dd:ldc....';,,,;''..,clccl:,'.,:''::'.     .......................',,coccllc:c;:lllc:clxO0KKKXXXNWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM0;.................................  .. ......;;'.....     .;::;..'lxxkxoolll'.'cc:ddcldl....,;;:c;....;cccoo:'..,,';,'.............'.........''''''..''',lollc,;lllol:;clldO00O0XNWWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNo.....................................,cooc:::cc::;;'.....  .','.. .....';;,'.',;;:dc;lo:....'::ll;....;c:col,...',:;..'.....''...''',,'......',,;:;'.....'cdol;.:ccloc;;llcokOOO0XNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM0;...................................,xXX0kddc;;clc;:;',,.... ..'','.'...,lc,...,cloxdlooc....,::cc,....;::clc,'..';c,.,,'..,,'''..;;',;;;'..,,;:::c:;,.....,:lol''::;::;,:l::oxOOO0XNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd'.................................'cONKOO0xc;;;lo::c;';;'..  . .,',:,,,,:c;c:,;:c;,:odol:...',;;::'....,:::c;;,..,c:',:;'.';;',;'.,c:;c:,:;:c:cllccl:;:,...',';c,';c,';;',oc,';oOO0KNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMKc...............................,lk00K0ooxxo::ooooll:,;::;,....  .'''',,''.......'''......  .',,;;;,....';,;;,;,..;l:,;,,,''::;::;,,:c:lc;:::c::cclll:,:l;,,',:;:;.'cc,,,',ll,,';oxO0XNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM0;...........................';lk0KKXNNKkxdxlcool:::c:'';;::'',.........     .    ...''''......,;;;;'.......,,,;;..:c::;',;,;:cc::c;;:ldl:c:;;;::::cccc:;cc,,,,cll;..;lc,,',lc,,,,codxk0XXNWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWk,......................,:clxKKKXOxkO0Ok00xccdooc':l;'..',::,;;............',,,.....,::::,..',,,;,;;'.........';;.':::;'.'',:cccccl:,,;ll;:c;;;::::lc;:cc::;,,,,lo;'..:l,'';lc;'::;codddxxxkkkOO0XNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK:...................;lodOKK0OOO000KNK0dldodllkOkc,;;,'.,;,,,;:,...,::,,,...',,'......:l:;,'';:;;;,;:,..........''..:cc,..'',;;::::cc;';cc:,::;;;:c:clc:::cc:c:,';c,''.,c'.,:;;,..;:cloxocllc::lodOdlx0XNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWWMMMWWWWWWNWWMMMNd''..............';ck0kxdllxdodoox0XX0dlk0OKOoxOd::doc,';,''.,,'',clc;,c:...''''.....,lc::,,;;;,,;;::;,. ..........':c;...'''',;;;:;:c;':l:;;;::;,:cccc::::ll:cc'':;..'':,.,'',,'',clllodlcccldlcll::;;;cxXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWMWWWWWWWWWWWWWNWMMMKc............'cdk0KNNXXKOkk0xllccoOXNWNXNNKd:oxocc:oxd:,;'.''''';lol:,,c:...'','.....:lc;'.',,::,;:::;;............';,....,,,,,',,,:::;.'cl::;;;;;;;:::;:::coc:c:,,,...'::'...''.,:coddooccdl;;;clc;,,;;;cxKNWMWMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMWWWWWWWWWMMWNNNNNNWWWWWMMMk,...........,do:;;;cldkOXXXXOOKXNKOkkxdxxdkkd0Xxoo,:xo,',..'''';lccccccl;..'',;;'...'ccc;...'';c;;:cc;:,..............',,.,;,::;:,''::;'.,ll:::;,;:;;:;,;:;;:lllccc,....;;.....'..;looddlcd0klcdddxo,.cl:cloOKNWWMMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMWWWWWWWWWWWMMMMMMWNNNNNXNWMMMWo.....  ..'':xkoclllc;;;;:dO00KXXXX0Okdx0K0XNN0kdc'.',.''.'....;c;;::cooc,.',,;:c;''.':::,.',,',:;;:cc;cc,............';:,.,;,;:loc:,,:::,';ll:cc;';cc:c:;cl;,:lolodo;'..,'.....'..'lxdolldko::oxxdoclc;clccccdx0NWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMWNNNNNWWWWWX000KXWWWWNNNXXXNWWMMKc.....,:dxxO0OkOkxkO000Oko:;;lx00KNNNKOxoccllllol:;';lclc',:'..;::cclcll;;,,::;',,'''',::;'.,,.'::;;:c;cl:,..........,clc,.',,,,,:c::;;c::,,:lc:cl:,:c:cc;:cc::cllcoko;.'''......'',cxkdl::colcodo:lxkxc,:clc:lclkXNWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMWWWNWWWWXKXNNKkkkk0NNNKKXXXNWMMMWW0,..;:dOkd::dxxkxxxxxxxOOOOOko:;:lk0NNKXXKkc:okOkxoc:cdxc..';..,;,:clo;',,::;,;,..'.'..';c;,';:'':cc:::;:c::'.........:oo;...'''..',::;;;;;;,;cc:;cllcllc:::ccloolc:ldko'','.....'',codkko;',ldolllcoddc,,;,,;cccclkXKO0NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMWNWWMMMMWXKXNNN0kxddOXXNNNWMMMMMMMWNklcllldookkxxolxkxkKOdoodxxxkOOkl;,:xOk0XKKK0OdddkOxocll;..;o:,c,.,,cc'..,:c:,''.......',;;,,;:,',:cccc;,;;::'......'':oc'...''.....',;;;;,';;;cl:;:llcclc:::ccodocccldxl,''.....',:loxxkxdoooddc:oddl:::;;;;;:cclodxxdkXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMWWWMMMWWNXXXNNXXOdddxKWMMMWWWWMMWWWKkddlcodoclxdcoo;,::oOkkdocclodxkOOkl;,,:xKKXXKXOlloolccc:;,'',..,'.';:c;..,;:c:'''..'..';;,;;:c;',;;clll;';;cc'......',;;,'....''....''',;,,,',;;cl:::ccc:c:;;c:clddocclodl;'.....';cldddxxxkdooooxko;:ccl;';;,;::colc:cdKMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMWWWMMWX0KXXKXXXXXOxkkkKWWXKK00K0OkkOk:,::;;,:::c:::;,;,,:cc;cdxooxocclc:cl:'..,o00KN0O0kdlccc::ll:'.....;,.,,..'',;:;,,'.,'';:;;c:;c,.,'.:c::;',:cc;'..,,'.'.';. ..'''....';,',,''''''';;;;;::;;;,,:c;:ldolc::cdl,......,:codlllloodclxdc,;;,,''';,',;;;;,;;;lx0KKXWMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMWWNNX0O0KXXXXNNWWXOkkk0K0Okkkkkdc:;:c,'',,;:,..,;;,.,;.';cc:lodxocc;',,;;;;;;,...;d0000dc;;cc;,;;'......;'......'..''';,.,,';c;;:;,,.''..;:;,'..;cc:;'';,'..';'. .........';,',,'',,,,;,,;;;',;,,;;,,,,col;;:c:ldl,....';clodoc:;;ldo:;,,'',,':xxl;'''',:c;;:cdOKXXWMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMWNXXXXNNWWMMMMMMXOkkkOOO0KKOoccc::;,'.';;'...''..,,'',,..';;;:c;',:odc::clc;;;'...;oOkoll:;;'...',;,,'',...'..,:'.'''''.,;',:;,',,'.;,';::::....;;;:,.''..';,'...........',,,;:,';:c:cc;,:l:'',,,;;''';clollddlldo;..';coxxddoc,,cxxl,'';,',,:d0klol:'.';c:,:oKWMWMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMWWMMMMMMMMMMMMXkkkkkkO0Oxocldo;;::'.:c;'.';ll:::c,,cc,,,',;::::cd0Oo:ccclc;',,,,'.'::cc::;::::;:::::;,..',..;c:..,''''';,,;''',,,;:''c:,:c,...,,'::.....;;','..........';;,;c;',:cc:cc;,cl:,,,,,,;'.';lkkoldx:cdc,'';codxxolc;,:odc;,..,::;;:c:coc:;;lc,;;,oKNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMMMMMWKkkxo::oxoldooxo;,,''oOc',;;:cc;:;,,;;;;,',,;;:c:;l::c:;,,;;;,,',:c:'...;:cooc:::;,........,,.,cc;,;,,'.',;;;'','';;;',;'.;;'...,;',c,....';c,........'...;;,;::,,;;;;,::',::,;:,;:::;,;coxkocddlcc:;,;ldooxxoc;,:odl;''.',;;;;,',,',ccldc,,,ckXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMMMWWNXKkollclllc:oOd':do:'';ll;,;,,c:;::,';:;,;;;;:cllo:;:,:lloc,''',;,,;;:c;'....lxdl:;;,'....',;;;,';ll:,'''',,;:;,',..','''.',,'...,;;,,:,....;ol.............'',;,,'',;;;;,;,'',,;ccccccccooloxkolddo:;ccclooddxxl,,coddl,,:;'.',;:,'.;do;;c:,,;:d0NMMMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMMMWNX0xxkl,,;cdxxddllo:cl:,,,,'';;'';cc;:l::c:c;::,;:;;''..',cllllccc,'''',;;;,,,....',:lc::'......,;,..'';:;'''';;;:;'.''.'';:,,,.''..';cc;;;,. ..:c;'.............''''',:;::;::;::,',;ccllc;;clddodkkoloxl;;odlloddddl:;codxo,.;::lodc'',,:l:.':;;,,:okKNWMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMWN0Oxooodl;;;:loxdccc;;:lc:c:,;ll:.,cc;;oOxxl:ooxxoxkOO,...,lxl';coxo'....',;::,.''''....,co:'...................,::::;'''..,:;,''''....':l;;;;'..',,;'.,'..........''''';c::::;::;c:'';ccclc;':ccloddxdooloc:ldolldxdoc;;clodo,.;dddddl:ll;;:lc:ol'.,;:okKWMMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMMN0d:,;lcc;,,'',;;:;;;,',:;,:cccdxc,cc;,;ll:;,'.,;,':ccc,..';ldo':lc:c,.....'',,'..',::,'...':c;...................,::::;'..''','''.......':::::,.....'..',...........,,''',;cc;;::;;;,',:llll;',:c:ldxdoddoccclollccldd:,,,;clc,.';llc:dkl;..'ldoc;..''.;oOKWMMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMWKx:..;c;,'.,'',;,,;,;::,,cx0K0kxdc:lc;;:c;,:c:',:,'colcdl;;..''...':o;..;;''','..',:loc:;,....'.''.. ..... ........;::;,,'','..'..........,:ccc;... ....',............''''',;:;;,,:;::;,,:cll;'',:clodxloxdlc:clc:;;:ldl,',;:cc;,,,';oc,;;;'.':c:;,..'...;ld0WMMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMN0x:.:OOl,.',;;;;;;:oxkxcoOOdccc:::loc:col;'',,,::,:olooc;;c,';,;;c:,c:c:;dc,,;;,,;:;clc:;,'''....'.''............''';:;,',,,''.''..........,;::,'....'',;,'','.........',,,,;,,:::cccclc;,:cooc;,;cl:cdoldxdlclodocclccloc:ccloo;,,,',:;;::,';lc,;:,';,.,:cokKNMMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMNOo,c0Ollc;,';:;;;;;oOkoccll:;xxclool;,;:cc::::lOOdxOxOd';cclll:'.''.;ccc;oo::,.',,,'',,;'.',,,'.....'.......  ..',;'';;,'','.''..''...'......,;,....,,,:c,.':;.....''...'',;::;,:lc:cccol:::coxo;;:clccolldkxooxkOkoclllodddddxoc::,';;,;,..',;,.....,,';lccd0XNMMMMMMMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMMMMW0l:kOoolddc,.,;;;;:ooccll:c::ll::ccc;;;,,lxo,';lo:;::::cdxxxldxc,.''','',::,;c;.','',,'''',,'',;,...  .,,'...  ..,;;'',,,,,:,'.....'..........,'....,,,,;,',:;....''......''';c;,:c:;c::cooc:coxoc:cclllolcoxxoodxkxlcloolccldxdlcdxl,'..',..,'..,;,';;'.:dolx0KNMMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMW0dxOkOkdxkko;,,,,,;:cc::col::c:,:odc,cl;'';:;,l0klll:,'coc;,',;;:;cllxcckxo;.ll'''.''..',,,',,,,'.''..  ..''..   .';,..';:;:;,,....''..............';;'',',;,'........'....'',;::;c:;;:c::odcclodlccc:cloolloddoodkxolllodl:;:lxxlcoc'..'::,.'::,cl,.','';cdddx0XWMMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMMNKKKO0NXOOkxkdc:,..,;;,',:llllc:,,::'.,;,.. ...:docccc;'lkxo;;;..'..'',',cxkl:l;..'';,,',,;;,,,'.',,',,'.. ....... .',....';;'',,,...,,'............,:,.''';,..'.............''',,;:::;;:c::lolloollllccllodoloddodkkdlldooddolldxccc'.',.,;,',,'.''.,c,.,,cxxxxk0XWMMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMWXK0dxK0K000OOkkd:'',;'....,:loolc;,,'...',,''';oxl:c;,',ccc::ll:lo;;..cc;'.'',ll,.;:;:::;;,'.','..,:;,'.''.   ..,..  .'.  ...,'..,,'.';,............;;,.''';,.';'...''.'........'',;;;;;;:::clolloolllcclodxxllxxodxkkdcldoloddllxOkl';:,..,c,'c,',.'lo,.''cO0kxdx0XWMMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMMMXK0dclxdOXXNXKOkdoc:,,..'..';:;,;cc:;,:coolxko,...,;;;,,lxddddodoc,';;coll:. ..;odclo,';ccc:;'.'...';c:'......   ..... .,'.  ..''..,,'.','...........;:,.,,',;,,;'.......'........''',,;;;;;;cloolloollllcoxxkkddxxddxkkxlcllllddlodOx;';,,;,'.';'';.'c;....cKX0kdokKNWMMMMMMMMMMMMMMMMWK0
//0XMMMMMMMMMMMMMMWXKOocoOkox0OkOOxoool:,....,::'','.,:c;'',;,,;:::;,,okl,.,olllclodlcocll;:l:'....,:;;cl::::cc;...'...',::'........    ........  ..........';...........;c;',,;;,;;,,''.....'...........',,;;;;,;colloooollolldkkOOxdkxdxxxxdololccooolodl:;;::,,,','.'........c0XKOdxOKKXWMMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMWKOoccxkkxloOOkxoodl::c;....''.....';::;'....,;lxko,';;,':oodl:cc,,:;;:''oxxl'.',;;'.,:lxd;',,'...'''',;,'...........    ....'............';,.........':c;.',;:,',;,,,,'...............';;,;;;;;:lololoxdollllxkkkkxdxxodxxxkdoddlloooolllo:,;,'.,::,,....'..,l0KOxdk0KKKXWMMMMMMMMMMMMMMMK0
//0XMMMMMMMMMMMMMMNOxdlokddkooxkkxxolllcclc,.'.......;:,,;'......,cdl,.....,::c:::;'cdcc,..:ll;,',,;cccoxdoxd:,''.......'''...'...........    ..'''.......''',;'........'::,..,,;;,;cc;;;;'.....'''','..'';:;,;;:c::lollloxdlloooxkkxxxdxdodxxkOxoxxooxxolll;.';;,''..,'',..'',:d0KOloxOKKKKXWMMMMMMMMMMMMMMK0
//0XWMMWMMMMWMMWWKkkdcldOOxOxdxddxdxdooolclc;''...''';c;,,;;'....':oc,;cc;,::,::,..':ccc'.;dkko:'',,;cllcc::lxd;,'..'''.'''''''''.................,::;,'''''',c:''''.''',::;,,;;::::llc:;::,,,'',;;;;;,,,,;::;;;:cl:cllloodxdlodookkxxkxxkxddxxkOxdxxddkxdoooc;:cc:,',,',,,''cocx000xxOkxOXXKXWMMWWMMMMMMMMWK0
//KKXXKKKKKKKKKK0kxkxoldO0O00OOdoxddkkxxdooooollllllloooooxkocccloxkdlcclllooolccccloddolldkkxxxlldooddollolokOdlccloolclooooollllcllllllccccc:ccccoddollllllldollclllccoddoooooddoodxdooooooollooooooooooooodooooddddddxkxxkxddxxxkxkkkxkkxxxxkkOkxxxxxkkxxxxxxxddooodolloooxxdO000Ok0OkkK0000KKKKKKKKKKKKKKK

(function() {
  'use strict';
  let isShireActive = true;
  function frodo() {
    isShireActive = !isShireActive;
    samwise();
    if (!isShireActive) {
      GM_setValue('ringDestroyed', true);
    }
  }
  function samwise() {
    const button = document.getElementById('toggleScriptButton');
    if (button) {
      button.textContent = isShireActive ? 'Skrypt WŁĄCZONY' : 'Skrypt WYŁĄCZONY';
      button.style.backgroundColor = isShireActive ? '#4CAF50' : '#f44336';
    }
  }
  function pippin() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleScriptButton';
    toggleButton.textContent = isShireActive ? 'Skrypt WŁĄCZONY' : 'Skrypt WYŁĄCZONY';
    toggleButton.style.backgroundColor = isShireActive ? '#4CAF50' : '#f44336';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.fontSize = '14px';
    toggleButton.addEventListener('click', frodo);
    document.body.appendChild(toggleButton);
  }
  function gandalf() {
    pippin();
    if (isShireActive) {
      legolas();
      gimli();
      gandalfnaspeedzie();
    }
  }
  function legolas() {
    new MutationObserver(() => {
      gimli();
      gandalfnaspeedzie();
    }).observe(document.body, { childList: true, subtree: true });
  }
  function gimli() {
    if (isShireActive) {
      nowyShire('edytuj');
      nowyShire('wystaw podobną');
    }
  }
  function nowyShire(buttonText) {
    const buttons = Array.from(document.querySelectorAll('a[href*="offer"][target="_blank"]'))
      .filter(button => button.textContent.includes(buttonText));
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const operationCompleted = button.dataset.operationCompleted === 'true';
        if (!operationCompleted) {
          event.preventDefault();
          event.stopPropagation();
          GM_setValue('editButtonURL', button.href);
          button.dataset.operationCompleted = 'true';

          const isWystawPodobna = button.textContent.includes('wystaw podobną');
          GM_setValue('isWystawPodobna', isWystawPodobna);

          aragorn();
          button.style.fontWeight = 'bold';
          button.style.color = 'green';

          const intervalId = setInterval(() => {
            if (!GM_getValue('isMordorOpen', false)) {
              clearInterval(intervalId);
              setTimeout(() => {
                button.click();
              }, 1000);
            }
          }, 500);

          setTimeout(() => {
            button.dataset.operationCompleted = 'false';
          }, 20000);
        }
      });
    });
  }
  function aragorn() {
    const accountInfoElement = document.querySelector('div[data-testid="accountInfo"] span');
    if (accountInfoElement) {
      const accountInfoValue = accountInfoElement.textContent.trim();
      GM_setValue('accountInfoValue', accountInfoValue);
      GM_setValue('isMordorOpen', true);
      window.open('https://salescenter.allegro.com/account/shared/switch', '_blank', 'height=200,width=400');
    }
  }
  function boromir() {
    const isMordorOpen = GM_getValue('isMordorOpen', false);
    if (isMordorOpen) {
      const accountInfoValue = GM_getValue('accountInfoValue', '').trim();
      setTimeout(() => {
        const accountSwitchers = document.querySelectorAll('div[aria-labelledby="accountSwitcher"]');
        let found = false;
        accountSwitchers.forEach(accountSwitcher => {
          const span = accountSwitcher.querySelector('label span');
          if (span && span.textContent.trim() === accountInfoValue) {
            const input = accountSwitcher.querySelector('input');
            if (input) {
              input.click();
              found = true;
              setTimeout(() => {
                const proceedButton = document.querySelector('button');
                if (proceedButton && proceedButton.textContent.includes("Przejdź dalej")) {
                  proceedButton.click();
                  GM_setValue('isMordorOpen', false);
                  setTimeout(() => {
                    window.close();
                  }, 200);
                }
              }, 1000);
            }
          }
        });
      }, 1000);
    }
  }
  function gandalfnaspeedzie() {
    const reportButtons = document.querySelectorAll('button[disabled][href*="/report/"]');
    reportButtons.forEach((button) => {
      const originalHref = button.getAttribute('href');
      const reportId = originalHref.split('/report/')[1];
      const newHref = `https://allegro.pl/moje-allegro/sprzedaz/produkt/zglos-blad/${reportId}`;
      button.removeAttribute('disabled');
      button.setAttribute('href', newHref);

      button.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(newHref, '_blank');
      });
    });
    document.querySelectorAll('div[data-testid="tip-anchor"] span').forEach(span => {
      if (span.classList.contains('mlmm_5r')) {
        span.classList.remove('mlmm_5r');
      }
    });
  }
  GM_registerMenuCommand('Toggle Allegro Account Switcher', frodo);
  if (window.location.href.includes('https://salescenter.allegro.com/my-assortment')) {
    gandalf();
  } else if (window.location.href.includes('https://salescenter.allegro.com/account/shared/switch')) {
    boromir();
  }
})();
