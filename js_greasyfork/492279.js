// ==UserScript==
// @name         Old Tumblr Dasboard (Backup)
// @namespace    http://tampermonkey.net/
// @version      17.8
// @description  OTD Backup Tampermonkey
// @author       Pixiel
// @license      N/A
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492279/Old%20Tumblr%20Dasboard%20%28Backup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492279/Old%20Tumblr%20Dasboard%20%28Backup%29.meta.js
// ==/UserScript==
GM_addStyle(`

/*Reblogicon quick fix*/
footer > div.yTb5J.DUvqr > div > div.rEGcu.tprzO.fYhK7 > div > div > div > div.K9Yy8 > div.rNL9q > div > span > span > a > .j4akp
{width: 24px;
    height: 24px;}
footer > div.yTb5J.DUvqr > div > div.rEGcu.tprzO.fYhK7 > div > div > div > div.K9Yy8
{    align-items: center;}

.pIHsl {
    color: transparent
}
/*No Go ad-free today button*/
.HOjIH {
    display: none;
}
/*sidebar ad block*/
.ohi9S {
    display: none
}
/*No premium button*/
.ACnga > .gLEjz > .yVZYV > .YjoFC > .YjoFC {
    Display: none
}
/*premium perks button*/
.ACnga > .gLEjz:has(.yVZYV) {
    Display: block;
    position: fixed;
    top: 93%
}
/*Mini premium perks button*/
.qrljl {
    display: none !important
}
.VVqTC {
    padding: 8px 10px;
}
#base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > .FZkjV:has(.Qihwb), #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(3):has(.Qihwb), #base-container > div.D5eCV > div > div._3xgk.ZN00W > div > div.e1knl > aside > .FZkjV:has(.Qihwb), #base-container > div.D5eCV > div > div._3xgk.ZN00W > div > div.e1knl > aside > div:nth-child(3):has(.Qihwb) {
    display: none
}
@media (min-width: 990px) {
    /*To remove the stiky header now go to the bottom of the userstyle!*/
    @media (max-width: 1161.3px) {
        /*Reorders the Icons in the header*/
        /*COMMUNITIES UPDATE - REMOVE IF YOU DONT HAVE COMMUNITIES PAGES YET*/
        /*Communities*/
        .gM9qK > span.ZQMrc:nth-of-type(1) {
            order: 3 !important;
        }
        /*Activity*/
        .gM9qK > span.ZQMrc:nth-of-type(2) {
            order: 8 !important;
        }
        /*Chat*/
        .gM9qK > span.ZQMrc:nth-of-type(3) {
            order: 7 !important;
        }
        /*Accounts*/
        .gM9qK > span.ZQMrc:nth-of-type(4) {
            order: 15 !important;
        }
        /*shop*/
        .gM9qK > span.ZQMrc:nth-of-type(5) {
            order: 5 !important;
        }
    }
    /*Accounts*/
    ul li.IYrO9, ul li.g8SYn {
        order: 13;
        Display: block
    }
    @media (max-width: 1161.3px) {
        /*Accounts*/
        .gM9qK > span.ZQMrc:nth-of-type(3) {
            order: 13;
        }
    }
    /*Home*/
    /*old*/
    ul li.g8SYn[title="Home"], ul li.g8SYn[title="Welcome"], ul li.g8SYn[title="ホーム"], ul li.g8SYn[title="Pano"], ul li.g8SYn[title="Inicio"], ul li.g8SYn[title="Главная"], ul li.g8SYn[title="Strona główna"], ul li.g8SYn[title="Início"], ul li.g8SYn[title="홈"], ul li.g8SYn[title="主页"], ul li.g8SYn[title="首頁"], ul li.g8SYn[title="主頁"], ul li.g8SYn[title="Beranda"], ul li.g8SYn[title="होम"], ul li.g8SYn[title="Accueil"], /*new*/
    ul li.IYrO9[title="Home"], ul li.IYrO9[title="Welcome"], ul li.IYrO9[title="ホーム"], ul li.IYrO9[title="Pano"], ul li.IYrO9[title="Inicio"], ul li.IYrO9[title="Главная"], ul li.IYrO9[title="Strona główna"], ul li.IYrO9[title="Início"], ul li.IYrO9[title="홈"], ul li.IYrO9[title="主页"], ul li.IYrO9[title="首頁"], ul li.IYrO9[title="主頁"], ul li.IYrO9[title="Beranda"], ul li.IYrO9[title="होम"], ul li.IYrO9[title="Accueil"] {
        order: 1;
    }
    /*Explore*/
    ul li.g8SYn[title="Explore"], ul li.g8SYn[title="Entdecken"], ul li.g8SYn[title="Esplora"], ul li.g8SYn[title="探索"], ul li.g8SYn[title="Keşfet"], ul li.g8SYn[title="Explorar"], ul li.g8SYn[title="Обзор"], ul li.g8SYn[title="Odkrywaj"], ul li.g8SYn[title="Verkennen"], ul li.g8SYn[title="둘러보기"], ul li.g8SYn[title="发现"], ul li.g8SYn[title="Jelajah"], ul li.g8SYn[title="एक्सप्लोर करें"], ul li.g8SYn[title="Explorer"], /*new*/
    ul li.IYrO9[title="Explore"], ul li.IYrO9[title="Entdecken"], ul li.IYrO9[title="Esplora"], ul li.IYrO9[title="探索"], ul li.IYrO9[title="Keşfet"], ul li.IYrO9[title="Explorar"], ul li.IYrO9[title="Обзор"], ul li.IYrO9[title="Odkrywaj"], ul li.IYrO9[title="Verkennen"], ul li.IYrO9[title="둘러보기"], ul li.IYrO9[title="发现"], ul li.IYrO9[title="Jelajah"], ul li.IYrO9[title="एक्सप्लोर करें"], ul li.IYrO9[title="Explorer"] {
        order: 2;
    }
    /*Patio*/
    ul li.g8SYn[title="Patio"], ul li.IYrO9[title="Patio"] {
        order: 3;
    }
    .G16Pk {
        Display: none;
    }
    /*If you want to hide the patio button,
        remove the " /* " around display: none; */
    ul li.IYrO9[title="Patio"], .KTRcB:has(.B1L2M[aria-label="Patio"]), ul li.g8SYn[title="Patio"], .KTRcB:has(.B1L2M[aria-label="Patio"]) {
        /*display: none */
    }
    /*"patio feedback?" button */
    .sebgd {
        display: none;
    }
    /*Communities*/
    ul li.g8SYn[title="Communities"], ul li.g8SYn[title="Communitys"], ul li.g8SYn[title="Communautés"], ul li.g8SYn[title="Community"], ul li.g8SYn[title="コミュニティ"], ul li.g8SYn[title="Topluluklar"], ul li.g8SYn[title="Comunidades"], ul li.g8SYn[title="Сообщества"], ul li.g8SYn[title="Społeczności"], ul li.g8SYn[title="Community's"], ul li.g8SYn[title="커뮤니티"], ul li.g8SYn[title="社区"], ul li.g8SYn[title="社群"], ul li.g8SYn[title="समुदाय"], ul li.g8SYn[title="Komunitas"], /*new*/
    ul li.IYrO9[title="Communities"], ul li.IYrO9[title="Communitys"], ul li.IYrO9[title="Communautés"], ul li.IYrO9[title="Community"], ul li.IYrO9[title="コミュニティ"], ul li.IYrO9[title="Topluluklar"], ul li.IYrO9[title="Comunidades"], ul li.IYrO9[title="Сообщества"], ul li.IYrO9[title="Społeczności"], ul li.IYrO9[title="Community's"], ul li.IYrO9[title="커뮤니티"], ul li.IYrO9[title="社区"], ul li.IYrO9[title="社群"], ul li.IYrO9[title="समुदाय"], ul li.IYrO9[title="Komunitas"] {
        order: 4;
    }
    /*If you've hidden any other icons to the right of Communities
 OR don't have xkit choose one below and remove the " /* " around it */
    /*Hidden 1 icon OR no New Xkit button*/
    /*      #community_button.TRX6J.UyyJb[aria-expanded="true"] > .EvhBA.tDT48 {
          right: 383px !important; }
        #community_subnav {
          right: 390px !important;
            }
*/
    /*Hidden 2 icons*/
    /*      #community_button.TRX6J.UyyJb[aria-expanded="true"] > .EvhBA.tDT48 {
          right: 330px !important; }

        #community_subnav {
          right: 290px !important;
            }
*/
    /*Hidden 3 icons*/
    /*     #community_button.TRX6J.UyyJb[aria-expanded="true"] > .EvhBA.tDT48 {
          right: 276px !important; }

        #community_subnav {
          right: 240px !important;
            }
 */
    /*Shop*/
    @media (min-width: 1161.4px) {
        .gM9qK > span.ZQMrc:nth-of-type(3) {
            order: 5;
            Display: block
        }
    }
    .gM9qK > span.ZQMrc:nth-of-type(4) {
        order: 5;
        Display: block
    }
    /*Inbox*/
    ul li.g8SYn[title="Inbox"], ul li.g8SYn[title="Posteingang"], ul li.g8SYn[title="Mailbox"], ul li.g8SYn[title="Posta"], ul li.g8SYn[title="受信箱"], ul li.g8SYn[title="Gelen Kutusu"], ul li.g8SYn[title="Bandeja de entrada"], ul li.g8SYn[title="Входящие"], ul li.g8SYn[title="Skrzynka odbiorcza"], ul li.g8SYn[title="Caixa de entrada"], ul li.g8SYn[title="수신함"], ul li.g8SYn[title="收件箱"], ul li.g8SYn[title="收件匣"], ul li.g8SYn[title="Kotak Masuk"], ul li.g8SYn[title="इनबॉक्स"], ul li.g8SYn[title="Boîte de réception"], /*new*/
    ul li.IYrO9[title="Inbox"], ul li.IYrO9[title="Posteingang"], ul li.IYrO9[title="Mailbox"], ul li.IYrO9[title="Posta"], ul li.IYrO9[title="受信箱"], ul li.IYrO9[title="Gelen Kutusu"], ul li.IYrO9[title="Bandeja de entrada"], ul li.IYrO9[title="Входящие"], ul li.IYrO9[title="Skrzynka odbiorcza"], ul li.IYrO9[title="Caixa de entrada"], ul li.IYrO9[title="수신함"], ul li.IYrO9[title="收件箱"], ul li.IYrO9[title="收件匣"], ul li.IYrO9[title="Kotak Masuk"], ul li.IYrO9[title="इनबॉक्स"], ul li.IYrO9[title="Boîte de réception"] {
        order: 6 !important;
    }
    /*Chat*/
    .gM9qK > span.ZQMrc:nth-of-type(2) {
        order: 7;
    }
    /*Activity*/
    .gM9qK > span.ZQMrc:nth-of-type(1) {
        order: 8;
    }
    /*Settings*/
    ul li.g8SYn[title="Settings"], ul li.g8SYn[title="Einstellungen"], ul li.g8SYn[title="Impostazioni"], ul li.g8SYn[title="設定"], ul li.g8SYn[title="Ayarlar"], ul li.g8SYn[title="Configuración"], ul li.g8SYn[title="Настройки"], ul li.g8SYn[title="Ustawienia"], ul li.g8SYn[title="Preferências"], ul li.g8SYn[title="Configurações"], ul li.g8SYn[title="Instellingen"], ul li.g8SYn[title="설정"], ul li.g8SYn[title="设置"], ul li.g8SYn[title="設定"], ul li.g8SYn[title="Pengaturan"], ul li.g8SYn[title="सेटिंग"], ul li.g8SYn[title="Paramètres"], /*new*/
    ul li.IYrO9[title="Settings"], ul li.IYrO9[title="Einstellungen"], ul li.IYrO9[title="Impostazioni"], ul li.IYrO9[title="設定"], ul li.IYrO9[title="Ayarlar"], ul li.IYrO9[title="Configuración"], ul li.IYrO9[title="Настройки"], ul li.IYrO9[title="Ustawienia"], ul li.IYrO9[title="Preferências"], ul li.IYrO9[title="Configurações"], ul li.IYrO9[title="Instellingen"], ul li.IYrO9[title="설정"], ul li.IYrO9[title="设置"], ul li.IYrO9[title="設定"], ul li.IYrO9[title="Pengaturan"], ul li.IYrO9[title="सेटिंग"], ul li.IYrO9[title="Paramètres"] {
        order: 9;
    }
    /*Domain*/
    ul li.g8SYn[title="Get a domain"], ul li.g8SYn[title="Domain kaufen"], ul li.g8SYn[title="Ottieni domini"], ul li.g8SYn[title="ドメインを取得"], ul li.g8SYn[title="Alan adını kap"], ul li.g8SYn[title="Compra un dominio"], ul li.g8SYn[title="Получить домен"], ul li.g8SYn[title="Uzyskaj domenę"], ul li.g8SYn[title="Obtém um domínio"], ul li.g8SYn[title="Obtenha um domínio"], ul li.g8SYn[title="Gebruik een domein"], ul li.g8SYn[title="도메인 사용하기"], ul li.g8SYn[title="获取一个域名"], ul li.g8SYn[title="取得一個網域"], ul li.g8SYn[title="取得網域"], ul li.g8SYn[title="Dapatkan domain"], ul li.g8SYn[title="एक डोमेन लें"], ul li.g8SYn[title="Obtenez un domaine"], ul li.g8SYn[title="Ottieni dominio"] {
        order: 0;
        Display: None;
    }
    /*Ad Free*/
    ul li.g8SYn[title="Go Ad-Free"], ul li.g8SYn[title="Go Ad Free"], ul li.g8SYn[title="Weg mit Werbung"], ul li.g8SYn[title="Surf without ads"], ul li.g8SYn[title="Vai senza pubblicità"], ul li.g8SYn[title="広告なし機能"], ul li.g8SYn[title="Reklamlardan Kurtul"], ul li.g8SYn[title="Tumblr sin anuncios"], ul li.g8SYn[title="Убрать рекламу"], ul li.g8SYn[title="Przejdź na Tumblr bez reklam"], ul li.g8SYn[title="Navega sem anúncios"], ul li.g8SYn[title="Navegar sem anúncios"], ul li.g8SYn[title="Browsen zonder advertenties"], ul li.g8SYn[title="광고 없이 보기"], ul li.g8SYn[title="设为无广告"], ul li.g8SYn[title="選用無廣告"], ul li.g8SYn[title="設定無廣告"], ul li.g8SYn[title="Bebas Iklan"], ul li.g8SYn[title="ऐड-फ़्री हो जाएँ"], ul li.g8SYn[title="Surfez sans pub"] {
        order: 0;
        Display: none;
    }
    /*Xkit*/
    .tab_xkit.iconic.tab {
        order: 12;
    }
    /*Patio*/
    .sebgd {
        width: 144px;
        position: fixed;
        left: 119px;
        top: 4px;
        padding: 12px 16px;
    }
    @media (min-width: 1018px) {
        .hXNpI {
            -moz-column-gap: 8px;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 4px;
            display: flex;
        }
        .hXNpI .COENx {
            text-align: center;
            font-size: inherit !important;
        }
    }
}
@media (min-width: 0px) {
    /*search pages fix*/
    .AZJHD > a {
        color: RGB(var(--blue));
        border: 2px solid RGB(var(--blue));
        box-sizing: border-box;
        background-color: transparent;
        border-radius: 40px;
        margin-right: 10px;
        padding: 8px 18px;
        font-size: 1rem;
    }
    .sCpg2 {
        display: none
    }
    .XnHBL[aria-selected=true], .uK3uY[aria-selected=true], .IOzqC[aria-selected=true], .KHdL0[aria-selected=true], .iMbDn[aria-selected=true] {
        background-color: rgba(var(--blue)) !important;
    }
}
@media (min-width: 990px) {
    .So6RQ.YSitt.a5_oh > .ge_yK > .c79Av {
        border-bottom: 1px solid rgba(var(--black), .13);
        padding: 6px 0px;
    }
    .wGzWf {
        background-color: transparent;
        color: var(--chrome-fg-secondary);
    }
    .Du368 {
        position: static;
        font-family: var(--font-family);
        color: rgba(var(--white-on-dark), .65);
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 100vw;
        margin-bottom: 11px;
        padding-top: 5px;
        font-size: 1.125rem;
        font-weight: 700;
        line-height: 20px;
        display: flex;
    }
    .e1knl > aside > .ajWB3:nth-child(4) {
        margin: 0px 8px 20px !important;
    }
    .ajWB3 {
        background-color: var(--chrome-panel);
        border: 1px solid var(--chrome-panel-border);
        border-radius: 3px;
        flex-direction: column;
        margin: 0px 8px 16px;
        display: flex;
    }
    .UphzF {
        font-family: var(--font-family);
        color: var(--chrome-fg);
        border-bottom: 1px solid var(--chrome-panel-border);
        margin-bottom: 8px;
        padding: 15px;
        font-size: 1.125rem;
        font-weight: 700;
        line-height: 1.33333;
    }
    .WBEbJ {
        text-align: center;
        border-top: 1px solid var(--chrome-panel-border);
        color: var(--accent);
        font-family: var(--font-family);
        width: 100%;
        margin-top: 8px;
        padding: 16px 0px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
        display: block;
    }
    .xlt1t {
        padding: 0;
    }
    .c9lq9 ._3xgk.Ril26:has(.Du368) {
        padding-top: 57px !important;
    }
    .c9lq9 ._3xgk.Ril26:has(.Du368) > .gPQR5 > .e1knl aside {
        padding-top: 7px;
    }
    .zn53i.EF4A5.ZWGnP {
        background-color: transparent;
        color: RGB(var(--deprecated-accent));
        border: none;
    }
    .u8J1W > div > .zn53i.EF4A5.ZWGnP > .D4GNf {
        font-family: var(--font-family);
        border-radius: 3px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
    }
    div.ngnqP.tMsyD > div > div.RIcm_ > div > button > .D4GNf {
        font-family: var(--font-family);
        color: var(--color-primary-link);
        font-size: .875rem;
        font-weight: 700;
        line-height: 1.42857;
        text-decoration: none;
    }
    .Ut4iZ.l6TJ6 > .SbeG8 > .zn53i.EF4A5.ZWGnP > .D4GNf {
        font-family: var(--font-family);
        color: var(--color-primary-link);
        font-size: .875rem;
        font-weight: 700;
        line-height: 1.42857;
        text-decoration: none;
    }
    .wtNDp > .Ut4iZ.l6TJ6 > .SbeG8:last-child {
        padding-right: 5px;
    }
    div.ngnqP.tMsyD > div > div.l4Qpd > div.cPL5a.zmkgk > div.W0XIT > div.d7ZC6, .u8J1W .wVZAK .hIUaH {
        font-family: var(--font-family);
        color: RGB(var(--white-on-dark));
        font-size: .875rem;
        font-weight: 700;
        line-height: 1.42857;
    }
    div.ngnqP.tMsyD > div > div.l4Qpd > div.y8wKa > div.nZ9l5.Cqt6p.C5tPL > a > div > div > div > img, div.ngnqP.tMsyD > div > div.l4Qpd > div.y8wKa > div.nZ9l5.Cqt6p.C5tPL > a > div, div.ngnqP.tMsyD > div > div.l4Qpd > div.y8wKa > div.nZ9l5.Cqt6p.QS4mY > a > div, div.ngnqP.tMsyD > div > div.l4Qpd > div.y8wKa > div.nZ9l5.Cqt6p.QS4mY > a > div > div > div > img {
        width: 37px !important;
        height: 37px !important;
    }
    .u8J1W .ZqH9E {
        width: 64px;
        height: 37px;
        display: block;
        overflow: hidden;
    }
    .u8J1W .wVZAK .M523y {
        font-family: var(--font-family);
        text-overflow: ellipsis;
        -webkit-hyphens: none;
        hyphens: none;
        color: rgba(var(--white-on-dark), .65);
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.42857;
        overflow: hidden;
    }
    .u8J1W .wVZAK .p_IvR {
        font-size: inherit;
        font-family: var(--font-family);
        font-weight: 600;
        line-height: inherit;
    }
    .u8J1W .ZqH9E {
        border-radius: 3px;
    }
    .u8J1W > div {
        text-align: right;
        align-items: center;
        padding-right: 18.5px;
        display: flex;
        position: relative;
    }
    .zn53i.EF4A5.ZWGnP:hover {
        background-color: transparent;
    }
    .u8J1W {
        box-sizing: border-box;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        padding: 6px 8px 6px 8px;
        display: flex;
        position: relative;
        border-radius: 0
    }
    .rGtDT {
        border-radius: 0
    }
    .ngnqP.tMsyD {
        padding: 5.5px 5px 5.5px 15px;
        border-radius: 0
    }
    ._25lo .y8wKa {
        min-height: 37px;
    }
    div.ngnqP.tMsyD > div > div.l4Qpd > div.cPL5a.zmkgk > div.x66yu {
        color: rgba(var(--white-on-dark), .65)
    }
    .m2Bdx {
        align-items: center;
    }
    div.ngnqP.tMsyD > div > div.RIcm_ > .w6x4o {
        padding: 4px 5px 4px 0px;
    }
    .l4Qpd {
        align-items: center;
        column-gap: 10px
    }
    div.ngnqP.tMsyD > div > div.l4Qpd > div.cPL5a.zmkgk > div.x66yu {
        font-family: var(--font-family);
        text-overflow: ellipsis;
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.42857;
        overflow: hidden;
    }
    .u8J1W .MgGEG {
        overflow-wrap: break-word;
        word-wrap: break-word;
        -webkit-hyphens: auto;
        hyphens: auto;
        vertical-align: middle;
        outline: none;
        flex-grow: 1;
        gap: 10px;
        align-items: center;
        text-decoration: none;
        display: flex;
    }
    [role="tablist"] > .hmJK7 {
        padding: 7px 0px 9px 0px;
    }
    /*related tags big icon */
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > .c79Av:nth-child(1) > .u8J1W {
        color: RGB(var(--white-on-dark));
        box-sizing: border-box;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        padding: 10px;
        display: flex;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > .c79Av:nth-child(1) > .u8J1W > .MgGEG, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > .c79Av:nth-child(1) > .u8J1W > .MgGEG > .ZqH9E {
        background-position: 50%;
        background-size: cover;
        border-radius: 7px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 120px;
        list-style: none;
        display: flex;
        position: relative;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > a > div.ZqH9E > div img {
        mask-image: linear-gradient(to bottom, rgba(0, 0, 0, .95), rgba(0, 0, 0, .28));
        background-image: linear-gradient(#7f7f7f00, rgba(0, 0, 0, .8));
        background-color: #404f64 !important;
        height: 120px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > a > div.ZqH9E > .HsI7c {
        padding-bottom: 0px !important;
        height: 120px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > a > div.ZqH9E {
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(13, 13, 13, .81));
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > .c79Av:nth-child(1) > .u8J1W > .MgGEG > .wVZAK {
        background-position: 50%;
        background-size: cover;
        border-radius: 7px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        line-height: 1;
        padding-top: 6.5px;
        list-style: none;
        display: flex;
        position: absolute;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > a > div.wVZAK > div.hIUaH {
        color: #fff;
        text-align: center;
        font-size: 18px;
        line-height: 44px;
        font-weight: 500
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > a > div.wVZAK > div.M523y {
        color: #fff;
        text-align: center;
        font-size: 14px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > div {
        padding: 2px 0 0 0;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > div > button {
        color: RGB(var(--navy));
        background-color: RGB(var(--deprecated-accent));
        border-radius: 3px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
        width: 100%;
        padding: 8px 20.5px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.xlt1t > div:nth-child(1) > div.u8J1W > div > button > span {
        font-family: var(--font-family);
        border-radius: 3px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
    }
    /*NEW Replies UI (08/24)*/
    .k31gt a.PtAFq {
        text-decoration: underline;
    }
    /*Hide the Reply to reply button, you can still reply with the '...' icon*/
    .TRX6J.NcZPX {
        display: block
    }
    .As9E4.Tg_iZ, .As9E4 {
        background-color: RGB(var(--white));
        border: 1px solid rgba(var(--black), .25);
        border-radius: 10px;
        flex-direction: column;
        margin-right: 33px;
        padding: 8px 12px;
        width: auto;
    }
    .As9E4:has(.VcWAj.jYM9A), .As9E4.Tg_iZ:has(.VcWAj.jYM9A) {
        min-width: 108px;
    }
    .As9E4.Tg_iZ.gDV3_, .As9E4.gDV3_ {
        background-color: RGB(var(--white));
    }
    .Rnjfn.Tg_iZ, .Rnjfn {
        width: 100%
    }
    .N4a8t {
        margin-left: 44px;
    }
    .N4a8t .Up4z9 {
        text-decoration: underline;
    }
    .N4a8t:has(.MI6Q7) {
        margin-bottom: 20px;
    }
    .N4a8t .ifclM, .N4a8t .Up4z9.Up4z9 {
        margin-bottom: 12px;
    }
    .N4a8t .Up4z9 {
        margin: 0
    }
    .N4a8t .Up4z9, .N4a8t .ifclM {
        font-family: var(--font-family);
        color: var(--hide-replies);
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.42857;
        display: block;
    }
    .Dx_DM.cjxpN, .Dx_DM.cjxpN.WRQyC {
        width: calc(100% - var(--post-padding) - 32px - 8px);
        background-color: rgba(var(--black), .05);
        border: 0;
        border-radius: 8px;
        flex: 1;
        margin-left: 8px;
        padding: 0px 10px;
        display: flex;
    }
    .ER5ZX.jnBLU {
        border-bottom: 0px solid rgba(var(--black), .13);
    }
    .cjxpN .x2Npm {
        padding: 6px 0 10px;
    }
    .v6i4P.cjxpN.GZPMx {
        --icon-color-primary: rgba(var(--black), .65);
    }
    .Rnjfn > .nyRXA > .BPf9u > .BPf9u > .TRX6J[aria-label="More options"], .Rnjfn.Tg_iZ > .nyRXA > .BPf9u > .BPf9u > .TRX6J[aria-label="More options"] {
        position: absolute;
        right: 0%;
        top: 0%;
    }
    .MI6Q7:not(:hover) > .As9E4 > .Rnjfn > .nyRXA > .BPf9u > .BPf9u > .TRX6J[aria-label="More options"] > span > svg, .MI6Q7:not(:hover) > .As9E4.Tg_iZ > .Rnjfn.Tg_iZ > .nyRXA > .BPf9u > .BPf9u > .TRX6J[aria-label="More options"] > span > svg {
        opacity: 0;
    }
    .Rnjfn > .nyRXA > .BPf9u > .BPf9u > .TRX6J[aria-label="More options"] > span > svg, .Rnjfn.Tg_iZ > .nyRXA > .BPf9u > .BPf9u > .TRX6J[aria-label="More options"] > span > svg {
        --icon-color-primary: rgba(var(--black), 0.60) !important;
    }
    .rEGcu.d5zR_.fYhK7.MPC_3, .rEGcu.tprzO.fYhK7.MPC_3 {
        padding-left: 16px;
        padding-right: 16px;
    }
    .MI6Q7 {
        padding: 0;
        margin-bottom: 12px;
    }
    .rbSdL {
        margin-top: 8px;
        margin-right: 12px;
    }
    .v6i4P.cjxpN {
        align-self: auto;
        padding-bottom: 0
    }
    .SLpX8.pcAYQ {
        text-decoration: underline;
    }
    .As9E4:has(.VcWAj.jYM9A), .As9E4.zEhTP.Tg_iZ {
        border: 1px solid RGB(var(--deprecated-accent));
        padding-top: 28px;
    }
    .jYM9A {
        background-color: transparent;
        color: RGB(var(--deprecated-accent));
        margin-right: .3rem;
    }
    .VcWAj.jYM9A {
        padding: 0 0px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        margin-bottom: 2px;
        font-size: .78125rem;
        font-weight: 700;
        line-height: 1.52;
        position: absolute;
        top: 8.8px;
    }
    .WuiH9 {
        vertical-align: middle;
        margin-right: 5px;
        margin-left: 0px;
    }
    .VcWAj.jYM9A > .BPf9u {
        display: block
    }
    .Dx_DM.WRQyC {
        background-color: rgba(var(--black), .05);
        border: 0;
        border-radius: 8px;
        flex-direction: column;
        flex: 1;
        margin-left: 8px;
        padding: 2px 16px;
        display: flex;
        overflow: hidden;
    }
    .v6i4P.GZPMx {
        --icon-color-primary: rgba(var(--black), .65);
    }
    .Dx_DM .u5dEF > .v6i4P {
        position: absolute;
        right: 0;
        display: flex;
        height: 100%;
        align-items: center;
        padding-bottom: 0px
    }
    .ER5ZX > .OQjMh {
        padding-right: 30px;
    }
    .ER5ZX {
        border-bottom: 0px solid rgba(var(--black), .13);
    }
    /*Fixes Some of the changes to the Activity Menu*/
    .ybmTG.ufrME > div.DxQ0f.AzqQv.P4LH6:has(.jBtpD) {
        transform: translate3d(-82.8px, 49px, 0px) !important;
    }
    .mCR4G a {
        color: rgba(var(--black), .65) !important;
    }
    .vlkFO {
        height: 30px;
        padding-top: 0px;
        padding-bottom: 0px;
    }
    .wvij3 {
        background-color: RGB(var(--white));
        border-top: 1px solid rgba(var(--black), .13);
    }
    .dJyeE[aria-selected=true], .lUKCu .SAqxs .BG5X8[aria-selected=true] {
        border-radius: 0px;
        color: RGB(var(--accent));
        box-shadow: inset 0px -2px 0px RGB(var(--accent));
        background-color: RGB(var(--white));
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > div > div > .AZJHD > a {
        border: 0px
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > div > div > div > .dJyeE.NJkFM, .lUKCu .SAqxs .BG5X8 {
        flex-grow: 1;
        padding: 8px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > div > div > div > .dJyeE.NJkFM:focus, #glass-container > div > div > div.jBtpD > div.lUKCu > div > div > div > div >.dJyeE.NJkFM:hover, .lUKCu .SAqxs .BG5X8:focus, .lUKCu .SAqxs .BG5X8:hover {
        background-color: RGB(var(--white));
        border-radius: 0px;
        outline: none;
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > header > div > span > span > button > span > svg {
        --icon-color-primary: rgba(var(--black), 0.65) !important;
    }
    .lUKCu header {
        font-family: var(--font-family);
        box-sizing: border-box;
        background-color: var(--content-panel);
        border-bottom: 1px var(--content-tint-strong) solid;
        border-radius: 3px 3px 0 0;
        justify-content: space-between;
        width: 100%;
        padding: 12px 12px 8px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
        display: flex;
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > header > div > span > span > button > span > div.wKEBn > div > div, #glass-container > div > div > div.jBtpD > div.lUKCu > header > div > span > span > button > span > div.wKEBn > div > div > div > div > img {
        width: 25px !important;
        height: 25px !important;
    }
    #glass-container > div > div > div.G75qL.lSS47 {
        display: none;
    }
    .lUKCu .SAqxs {
        flex-wrap: wrap;
        gap: 6px;
    }
    #glass-container > div > div > div.jBtpD > div.pclKV > div:has(.Gt2Q9) > .Gt2Q9, #glass-container > div > div > div.jBtpD > div.pclKV > div:nth-child(1) > div.kYovr {
        background-color: rgba(var(--black), .07);
    }
    #glass-container > div > div > div.jBtpD > div.pclKV > div > .Gt2Q9 {
        padding: 8px 16px 8px
    }
    .lUKCu .SAqxs {
        padding: 0px
    }
    [role="tablist"] > .hmJK7 {
        padding: 0;
        flex-wrap: wrap;
        gap: 6px;
    }
    .ePmxL {
        display: flex;
        flex-direction: column;
        padding: 0px
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > button:nth-child(1) > span {
        position: relative;
        visibility: hidden;
        width: 52.7px
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > button:nth-child(1) > span:after {
        content: "All";
        visibility: visible;
        position: absolute;
        left: 16.1px;
        top: 0;
    }
    [role="tablist"] > .hmJK7 {
        display: flex;
        flex-direction: column;
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > .ePmxL > div[role="tablist"] > div > .AZJHD > a {
        margin-right: 0px
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > .ePmxL > div[role="tablist"] > div > .AZJHD {
        flex: 0 0 auto;
        display: flex;
        flex-wrap: wrap;
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > div > div > div > .dJyeE.NJkFM, #glass-container > div > div > div.jBtpD > div.lUKCu > div > div > div > .AZJHD > a {
        margin-right: 0
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > .ePmxL > div[role="tablist"] > div > .AZJHD a {
        font-family: var(--font-family);
        color: rgba(var(--black), .65);
        flex-grow: 1;
        padding: 8px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
    }
    a[id="all"] > .Ncp30 {
        width: 52.7px;
        display: flex;
        justify-content: center;
    }
    a[id="mentions"] {
        padding-left: 1px !important;
        padding-right: 9.6px !important;
    }
    a[id="reblogs"] {
        padding-left: 0px !important;
        padding-right: 8.5px !important;
    }
    a[id="replies"] {
        padding-right: 10.9px !important;
    }
    div > .AZJHD > .dJyeE.NJkFM:nth-child(1) {
        padding: 5px !important;
        flex: 0 0 auto;
        color: RGB(var(--accent)) !important;
        flex-grow: 0 !important;
        padding-left: 4px !important;
    }
    #glass-container > div > div > div.jBtpD > div.OAANM > a {
        height: 30px;
        padding-top: 0px;
        padding-bottom: 0px;
        border-top: 1px solid rgba(var(--black), .13);
        flex-shrink: 0;
        border-radius: 0px;
        background: RGB(var(--white));
    }
    .OAANM {
        padding: 0px;
    }
    #glass-container > div > div > div.jBtpD > div.OAANM > a > span {
        font-family: var(--font-family);
        color: rgba(var(--black), .65);
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: .78125rem;
        font-weight: 700;
        line-height: 1.52;
        text-decoration: none;
        display: flex;
    }
    /*transparent images*/
    .xhGbM {
        background-color: transparent;
    }
    /*mini activity fix notes section*/
    .AZJHD:after {
        display: none
    }
    .fX6PY {
        color: var(--chrome-fg-secondary);
        gap: 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0 0 20px;
    }
    .fX6PY .NIHUh {
        font-family: var(--font-family);
        color: RGB(var(--white-on-dark));
    }
    .lUKCu > .ePmxL {
        border-bottom: 0px;
    }
    #glass-container > div > div > div.jBtpD > div.lUKCu > div > button:nth-child(1) {
        padding: 5px;
        flex: 0 0 auto;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.pK05E > div.fX6PY > div.pt6zA > div > div > div {
        display: none
    }
    .lUKCu {
        display: flex;
        flex-direction: column;
    }
    .LMFDf {
        background-color: transparent;
    }
    /*Removes weird blue icon in posts replies*/
    button.ykm3O.lRHNZ.F_5SW, .ykm3O.F_5SW {
        color: inherit !important;
        padding: 10px;
    }
    .ykm3O.jTUmS.F_5SW, .ykm3O.ztxCq.F_5SW, .ykm3O._vT58.F_5SW, .ykm3O.lRHNZ.F_5SW {
        border-bottom-color: RGB(var(--blue));
        background: inherit !important;
    }
    .ykm3O {
        border-bottom: 2px solid transparent;
        border-radius: 0px;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        min-width: 60px;
        padding: 10px;
        display: flex;
    }
    .poThh {
        padding: 0px var(--post-padding);
    }
    .ykm3O.lRHNZ.F_5SW svg use {
        --icon-color-primary: RGB(var(--blue));
    }
    .ykm3O._vT58.F_5SW.F_5SW svg use {
        --icon-color-primary: RGB(var(--green));
    }
    .ykm3O.ztxCq.F_5SW svg use {
        --icon-color-primary: RGB(var(--red));
    }
    .ykm3O.jTUmS.F_5SW svg use {
        --icon-color-primary: RGB(var(--purple));
    }
    .ykm3O svg {
        height: 18px;
        width: 18px;
    }
    .RmVjB {
        gap: 0px;
    }
    .DP33z {
        width: 25px;
        height: 25px;
    }
    .hfc9Y > div > span > span > button, .gAoFY {
        Margin-right: 10px
    }
    /*Unhides Messenger Chat Box*/
    .cwvO0 {
        z-index: 100;
    }
    /*Resizes Messenger Chat Box*/
    .j17Mp, .j17Mp.be6E9 {
        width: 400px !important;
        height: calc(100vh - 32px) !important;
        max-height: 560px !important;
    }
    .YOf31.FLoBV {
        position: static;
    }
    .XJ7bf.Wx4xZ, .XJ7bf.Wx4xZ > .BjErQ, .yrINf, .wttFd, .FtjPK {
        border-radius: 3px !important;
    }
    /*Moves the following / for you / your tags*/
    .Dk06o, .Dk06o.X4W3M {
        margin-top: 0px;
        margin-left: 0px;
        margin-right: 0px;
        order: 2;
        z-index: 1;
        position: relative !important;
        top: 0 !important;
        transition: none !important;
    }
    .O4V_R {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .wttFd {
        order: 1;
    }
    .Evcyl, .j8ha0 {
        width: 100%;
        order: 3;
    }
    /*resizes communities icon
       #community_button > span > div.kn4U3 > svg {
            width: 25px !important;
            height: 24px !important;
        } */
    #community_subnav {
        right: 390px;
    }
    #community_button > span > div.a132D > span.jF6A2 {
        margin-left: -21px;
    }
    #community_button > span > div.a132D > span.jF6A2 > .jpu7k.jDcIV.SmqzX.D0OOd.XnKJk {
        left: -15px
    }
    [aria-label="Communities"] > span > div.kn4U3 > .jpu7k.jDcIV.D0OOd.XnKJk {
        display: var(--hide-com-number)
    }
    /*Queue test*/
    .So6RQ.YSitt > .ge_yK > article > div > .jn3oa, .So6RQ.YSitt > .ge_yK > .c79Av > article > div > .jn3oa {
        align-self: flex-start;
        top: 0px;
        padding-right: 10px;
        color: RGB(var(--white-on-dark), 0.6);
        pointer-events: none;
        position: absolute;
        left: -85px;
        font-size: 0.63rem;
        width: 60px;
        line-break: auto;
        height: 82px;
        font-weight: 700 !important;
        line-height: 1.6;
    }
    .So6RQ.YSitt > .ge_yK > article > .SirwX, .So6RQ.YSitt > .ge_yK > .c79Av > article > .SirwX {
        height: 0px;
        padding: 0px
    }
    .So6RQ.RFqS2.YSitt > .ge_yK > .c79Av > article > div.SirwX > .jn3oa:first-line, .So6RQ.RFqS2.YSitt > .ge_yK > article > div > .jn3oa:first-line, .So6RQ.YSitt > .ge_yK > .c79Av > article > div > .jn3oa:first-line {
        font-size: 1.09rem;
        text-transform: uppercase;
        color: RGB(var(--white-on-dark));
    }
    .So6RQ.YSitt > .ge_yK > article > div > .jn3oa:first-line, .So6RQ.YSitt > .ge_yK > .c79Av > article > div > .jn3oa:first-line {
        font-size: 1.05rem;
        text-transform: uppercase;
        color: RGB(var(--white-on-dark));
    }
    .ge_yK > div > article > div > .jn3oa > .b1E_e, .ge_yK > div > article > div.SirwX > .jn3oa > .b1E_e > svg use, .So6RQ.YSitt > .ge_yK > article > div > .jn3oa > .b1E_e, .So6RQ.YSitt > .ge_yK > article > .SirwX .b1E_e svg use {
        --icon-color-primary: RGB(var(--white-on-dark), 0.6) !important;
        position: absolute;
        top: 50px;
    }
    .ge_yK > div > article > div > .jn3oa > .b1E_e, .ge_yK > div > article > div.SirwX > .jn3oa > .b1E_e > svg, .So6RQ.YSitt > .ge_yK > article > div > .jn3oa > .b1E_e, .So6RQ.YSitt > .ge_yK > article > .SirwX .b1E_e svg {
        height: 14.5px !important;
        width: 14.5px !important;
    }
    /*To revert the queue dates back to the NEW version, paste this code below into a new Userstyle without the "/* " */
    /*

        .SirwX .jn3oa {

    font-family: var(--font-family) !important;

    color: RGB(var(--black)) !important;

    text-transform: initial !important;

    width: auto !important;

    max-width: 128px !important;

    margin-top: 6px !important;

    margin-bottom: 4px !important;

    position: initial !important;

    margin-left: 8px !important;

        height: auto !important;

    font-size: .875rem !important;

    font-weight: 700 !important;

        Left: 0px !important;

    line-height: 1.42857 !important;

    overflow: hidden !important;

}     .So6RQ.YSitt > .ge_yK > article > div > .jn3oa:first-line, .So6RQ.YSitt > .ge_yK > .c79Av > article > div > .jn3oa:first-line {font-size: .875rem !important;

        text-transform: none !important;

         color: RGB(var(--black)) !important;

       }



    .So6RQ.YSitt > .ge_yK > article > div > .jn3oa > .b1E_e, .So6RQ.YSitt > .ge_yK > article > .SirwX .b1E_e svg {

    height: 18px !important;

    width: 18px !important;

}



    .So6RQ.YSitt > .ge_yK > article > div > .jn3oa > .b1E_e, .So6RQ.YSitt > .ge_yK > article > .SirwX .b1E_e svg use {

    --icon-color-primary: RGB(var(--black)) !important;

    position: initial;

    top: 50px;

}



    .So6RQ.YSitt > .ge_yK > article > .SirwX, .So6RQ.YSitt > .ge_yK > .c79Av > article > .SirwX {

    height: 32px !important;

    padding: 12px 0 !important;

    }

        */
    /*Fixes the no-icons / Moved icons update AGAIN AGAIN*/
    .l8iwp.NENaP, .gPQR5 > .lSyOz, .gPQR5.ah4XU > .lSyOz.t8f_N {
        max-width: 625px;
        min-width: 625px;
        margin-left: -76px;
    }
    .l8iwp.NENaP {
        flex-direction: column;
        width: 100%;
        display: flex;
        align-items: flex-end;
    }
    .lSyOz > .l8iwp.NENaP > .Dk06o.X4W3M {
        width: 100% !important;
        Order: 1 !important
    }
    .lSyOz > .l8iwp.NENaP > div:nth-of-type(2), .lSyOz > .l8iwp.NENaP >.kOFpP {
        order: 2
    }
    div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > .qgvik {
        visibility: hidden;
    }
    .l8iwp.NENaP, .gPQR5.pTaNm > .lSyOz, .gPQR5.pTaNm.ah4XU > .lSyOz.t8f_N {
        max-width: 2080px;
        min-width: 650px;
        margin-left: -40px;
    }
    .ZkG01 ._3xgk.ZN00W, .c9lq9 ._3xgk.Ril26 {
        margin-left: 73px!important;
    }
    .D5eCV div.ZkG01 div._3xgk.ZN00W div.gPQR5.FGfuE.ah4XU.t8f_N div.e1knl, .D5eCV div.c9lq9 div._3xgk.Ril26 div.gPQR5.FGfuE.ah4XU.t8f_N div.e1knl {
        min-width: 315px;
    }
    div._3xgk div.RkANE.r1Zq6 div.DCCfo.ZmMA3 div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.j8ha0 div.zAlrA div div.So6RQ.YSitt.norecommended-done.xpostblock-done div.ge_yK div.c79Av article.FtjPK.r0etU.hMVn9 header.BjErQ.PpzOx div.q4Pce.J_Wh8 div.ZJdm4 div.ffqNn div.WJ6ij, div.c9lq9 div._3xgk div.RkANE.r1Zq6 div.DCCfo.ZmMA3 div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.j8ha0 div.zAlrA div div.So6RQ.YSitt.norecommended-done.xpostblock-done div.ge_yK div.c79Av article.FtjPK.r0etU.hMVn9 header.BjErQ.PpzOx div.q4Pce.J_Wh8 div.ZJdm4 div.ffqNn div.WJ6ij {
        margin: 0px;
    }
    div.hyiL2 > .USr9U > div:not(:nth-last-child(2)) > div > div > div > article > div.qYXF9 > footer > div > div.MCavR > div:nth-child(2):has(.TRX6J[aria-label="Share"]) {
        margin-left: 10px;
    }
    #base-container > div.D5eCV > div > div._3xgk.ZN00W > div > div.lSyOz.t8f_N > main > div.j8ha0 > div.sortableContainer > div > div > article > div.SirwX > div, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.SirwX > div {
        margin-left: 18px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.kOFpP > div > div.zAlrA > div > div > div > div > article > header > div.q4Pce.J_Wh8, div > .FtjPK > header > div.q4Pce.J_Wh8 > div.ZJdm4 > div.ffqNn > div.WJ6ij, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .FtjPK > header > div.q4Pce.J_Wh8 > div.ZJdm4 > div.ffqNn > div.WJ6ij, .NLCTe > div > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.q4Pce.J_Wh8 > div.ZJdm4 > div.ffqNn > div.WJ6ij, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.q4Pce.J_Wh8 > div.ZJdm4 > div.ffqNn > div.WJ6ij, main > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.q4Pce.J_Wh8 > div.ZJdm4 > div.ffqNn > div.WJ6ij {
        margin: 4px;
    }
    /*tagged*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.kOFpP > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH, /*Communities*/
    .pvWan > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH, /*Blogview*/
    main > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH, /*Drafts*/
    main > div.j8ha0 > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .FtjPK > .BjErQ > div.RYkKH, /*Queue*/
    main > div.j8ha0 > div > .So6RQ.YSitt > .ge_yK > article > header > div.RYkKH, /*Likes*/
    .NLCTe > div > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH, /*Patchfix?*/
    main > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH, .NLCTe > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH, /*dashboard 31/03/2025*/
      #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa, 
#base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa {
        align-self: flex-start;
        top: 0px;
        padding-right: 10px;
        color: RGB(var(--white-on-dark));
        height: 100%;
        position: absolute;
        left: -85px;
        display: flex;
        flex-direction: column;
    }
    /*headerfix*/
    .DEkbl > .cPL5a > .m2Bdx > .l4Qpd {
        overflow: visible
    }
    .DEkbl:hover .mYcfU {
        background-color: transparent;
    }
    .DEkbl {
        position: static;
    }
    .DEkbl .mYcfU {
        height: 64px
    }
    .iIlsP {
        display: none
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div > div, div.D5eCV div.c9lq9 div._3xgk div.RkANE.r1Zq6 div.DCCfo div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt, .W0XIT {
        overflow: visible;
        -moz-column-gap: 3px;
        flex-direction: row;
        align-items: center;
        column-gap: 3px;
        display: flex;
    }
    .IdTf7.Xlq_h .DPB5d {
        -webkit-mask-image: none;
        mask-image: none;
    }
    .L2HBn .d7ZC6, .n_fvx .d7ZC6, .cJ1ik .d7ZC6, .W0XIT > .d7ZC6 {
        color: RGB(var(--black));
        font-family: var(--font-family);
        font-size: .875rem;
        word-wrap: break-word;
        -webkit-hyphens: auto;
        hyphens: auto;
        font-weight: 700;
        line-height: 1.125rem;
    }
    .l4Qpd > .zmkgk {
        justify-content: flex-start;
    }
    .m2Bdx.pLL0g.PCzZt > .l4Qpd > .cPL5a {
        box-sizing: border-box;
        display: flex;
        align-content: center;
        justify-content: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .RIcm_ {
        -moz-column-gap: 4px;
        flex-grow: 0;
        flex-shrink: 0;
        align-items: center;
        column-gap: 4px;
        display: flex;
        justify-content: flex-end;
    }
    .x66yu {
        flex-direction: row;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
    }
    .cPL5a > .PCzZt .x66yu {
        color: rgba(var(--black), .65);
        font-family: var(--font-family);
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.125rem;
        text-transform: lowercase;
    }
    .PCzZt .x66yu a {
        font-weight: 700;
    }
    ._7Vla9 .cPL5a, .l4Qpd > .cPL5a {
        font-family: var(--font-family);
        box-sizing: border-box !important;
        width: 100%;
        max-width: 540px;
        padding-left: 3px;
        padding-top: 8px;
        padding-bottom: 6px;
        border-radius: 8px 8px 0 0;
    }
    .l4Qpd > .cPL5a, .DEkbl > .cPL5a {
        font-family: var(--font-family);
        box-sizing: border-box !important;
        width: 100%;
        max-width: 540px;
        padding-left: 3px;
        padding-top: 8px;
        padding-bottom: 6px;
        border-radius: 8px 8px 0 0;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    /*search page follow*/
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK div.LaNUG div div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt {
        max-width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK div.LaNUG div div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.cPL5a.QCWsQ.zmkgk div.W0XIT div.d7ZC6 span.BPf9u span.BPf9u {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK div.LaNUG div div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        column-gap: 4px;
        display: flex;
    }
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK div.LaNUG div div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5 {
        padding: 10px 2px;
    }
    /*search page header*/
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl.rtjhW div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.cJ1ik div.l4Qpd {
        max-width: 78%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl.rtjhW div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.cJ1ik div.l4Qpd div.cPL5a.QCWsQ.zmkgk div.W0XIT div.d7ZC6 {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl.rtjhW div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.cJ1ik div.l4Qpd div.cPL5a.QCWsQ.zmkgk {
        max-height: 47px
    }
    .m2Bdx.pLL0g.cJ1ik > .l4Qpd > .cPL5a {
        align-items: flex-start;
    }
    /*blockpost pinned header*/
    #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah {
        position: absolute;
        top: 33px;
        left: 57px
    }
    #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header:has(.QOpFt time) > div > div.Pl0ah {
        position: absolute;
        top: 33px;
        left: 57px;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div.Pl0ah, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(div.QOpFt time) > div.Pl0ah {
        position: absolute;
        top: 38px;
        left: 17px;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div:has(.F2bKK) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt {
        position: absolute;
        top: 46px;
        left: 118px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div {
        flex-direction: column-reverse
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(div.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span {
        display: block
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header:has(.F2bKK) > div:has(div.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span::before {
        position: absolute;
        top: 41.5px;
        left: 106px;
        display: block !important
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header:has(.F2bKK) > div:has(div.QOpFt time) {
        font-family: var(--font-family);
        box-sizing: border-box !important;
        max-width: 540px;
        padding-left: 3px;
        padding-top: 8px;
        padding-bottom: 36.5px;
        max-height: 36px;
        min-height: 22px;
        border-radius: 8px 8px 0 0;
    }
    #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .f5mVe > div.Evcyl > div.zAlrA > .rZlUD.KYCZY.F4Tcn > div > div > div > article > header > div:has(div.QOpFt time) {
        font-family: var(--font-family);
        box-sizing: border-box !important;
        max-width: 540px;
        padding-left: 3px;
        padding-top: 11px;
        padding-bottom: 0px;
        max-height: 36px;
        min-height: 22px;
        border-radius: 8px 8px 0 0;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > .f5mVe > div.Evcyl > div.zAlrA > .rZlUD.KYCZY.F4Tcn > div > div > .c79Av > .FtjPK > .DEkbl:has(div.QOpFt time) {
        padding-bottom: 22.5px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div > div.RIcm_ > button {
        margin-top: -11.5px
    }
    #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.Pl0ah) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.RIcm_ > button, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article> header > div:has(.Pl0ah) > div.m2Bdx.pLL0g.PCzZt > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div:has(.QOpFt time) > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.Pl0ah) > div.m2Bdx.pLL0g.PCzZt > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.Pl0ah) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk {
        margin-top: -20px
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div:nth-child(3) > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > .CtNGM, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK) > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > .CtNGM {
        display: none
    }
    /*shorter badges*/
    #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span {
        max-width: 145px;
        overflow: auto
    }
    #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span {
        max-width: 273px;
        overflow: auto;
    }
    #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT > span {
        max-width: 290px;
        overflow: auto;
    }
    div:has(.W9hfZ):has(.QOpFt time) > .W0XIT {
        max-width: 267px;
    }
    .W0XIT {
        max-width: 363px;
    }
    .W0XIT .Kkrh1 {
        overflow: auto
    }
    /*text gap*/
    .k31gt:first-child {
        margin-top: 7px
    }
    /*timestamps code*/
    #base-container > div.D5eCV > div > div._3xgk.VsR8V.f_ziq.Ril26 > div > div.lSyOz > main > div > div.hyiL2 > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk {
        flex-direction: column;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div:has(.QOpFt time), div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ:has(.F2bKK), div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ:has(.QOpFt time) {
        padding-top: 4px!important;
        padding-bottom: 4px !important
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt {
        position: absolute;
        top: 33px;
        left: 61px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt {
        position: absolute;
        top: 35px;
        left: 61px;
    }
    #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt {
        left: 164px !important;
    }
    #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > span::before {
        display: none
    }
    #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header:has(.F2bKK) > div:has(.QOpFt time) > div.m2Bdx.pLL0g.PCzZt > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > .CtNGM, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header:has(.F2bKK) > div:has(.QOpFt time) > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.NB_7e > .CtNGM {
        position: absolute;
        top: 35.5px;
        left: 149px;
        display: block !important
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt {
        position: absolute;
        top: 33px;
        left: 58px;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu > div.QOpFt {
        position: absolute;
        top: 46px;
        left: 19px;
        margin-top: -6px;
    }
    div.x66yu > div.QOpFt > time::after, div.x66yu > div.QOpFt > time::before {
        font-size: var(--timestampfont);
        padding-top: 1px
    }
    div.x66yu > div.QOpFt time {
        font-family: var(--font-family) !important;
        font-size: var(--timestampfont);
        font-weight: 500 !important;
        line-height: 1.125rem !important;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button {
        margin-top: -19.5px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div> div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div:has(.QOpFt time) > div.RIcm_ > button {
        margin-top: -20.5px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd:has(.QOpFt time), #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(.QOpFt time) > div > div.l4Qpd, #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd, #glass-container > div > div > div.xm3hr.raBdW.KwKKC.u10SL > div.I41Le.q5M3M.u10SL > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd:has(.QOpFt time) > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd:has(.QOpFt time) {
        margin-top: -6px;
        padding-bottom: 14px
    }
    /*timestamps code*/
    .cJ1ik .zmkgk, .PCzZt .RIcm_, .m2Bdx.pLL0g.PCzZt > .l4Qpd > .zmkgk {
        max-height: 36px;
        min-height: 22px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.xlt1t > div > div.ngnqP.tMsyD > div > div.RIcm_ {
        min-height: 44px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div> div > div > div > article > header > div > div > div.RIcm_ > button {
        padding: 0px
    }
    .zn53i.EF4A5.r21y5 {
        background-color: transparent
    }
    #glass-container div.Lq1wm div.yKniX div.xm3hr.raBdW.KwKKC.u10SL div.I41Le.q5M3M.u10SL div.DCCfo.kXP4L div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ {
        display: inline-flex;
        justify-items: start;
        justify-content: space-between;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div, #base-container div.D5eCV div.c9lq9 div._3xgk.Ril26 div.gPQR5 div.lSyOz main.UX61Y.YcUec div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl div.cPL5a.Afu4V.QCWsQ, 
    #base-container > div.D5eCV > div.c9lq9 > div._3xgk.Ril26 > div.gPQR5 > div.lSyOz > main > div.Evcyl > div.zAlrA > div.rZlUD.KYCZY.W45iW > div.So6RQ.YSitt > div.ge_yK > div.c79Av > article.FtjPK > header.DEkbl > div.cPL5a.Afu4V.QCWsQ:has(.D4GNf),
     #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > .ge_yK > .c79Av > .FtjPK > .DEkbl > .cPL5a.Afu4V.QCWsQ:has(.D4GNf),
#base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div.zAlrA > .rZlUD.F4Tcn > div > .ge_yK > .c79Av > .FtjPK > .DEkbl > .cPL5a.Afu4V.QCWsQ:has(.D4GNf), #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div.zAlrA > .rZlUD.F4Tcn > div > .ge_yK > .c79Av > div > .FtjPK > .DEkbl > .cPL5a.Afu4V.QCWsQ:has(.D4GNf) {
        display: inline-grid;
        justify-items: start;
        align-items: center;
        justify-content: space-between;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div> div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div {
        display: inline-grid;
        justify-items: start;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 8px;
    }
    .DEkbl > .cPL5a > .m2Bdx {
        -moz-column-gap: 0px;
        flex-direction: row;
        align-items: flex-start;
        column-gap: 4px;
        display: flex;
        width: 100%;
        align-content: center;
        flex-wrap: wrap;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT, #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT {
        padding-right: 1px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT:has(.R7jci.Kkrh1), #base-container div#glass-container div.Lq1wm div.yKniX div.xm3hr.raBdW.KwKKC.u10SL div.I41Le.q5M3M.u10SL div.DCCfo.kXP4L div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.cPL5a.QCWsQ.zmkgk div.W0XIT, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT:has(.R7jci.Kkrh1), #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.W0XIT:has(.R7jci.Kkrh1) {
        padding-right: 0px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.RIcm_, article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk > div.x66yu {
        padding-left: 2.8px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.RIcm_, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_, article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.RIcm_ {
        max-height: 100%;
        height: 44px;
        align-items: center;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.RIcm_ > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div > div > div.RIcm_ > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.RIcm_ > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.RIcm_ > span, main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ > span.BPf9u, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > div> article > header > div > div > div.RIcm_ > span, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.RIcm_ > span,
    #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > header > div > div > div.RIcm_ > span {
        position: absolute;
        right: 11.9px;
        top: 12.5px;
    }
    article div.VDRZ4 div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ > span.BPf9u, article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.RIcm_ > span {
        position: absolute;
        right: 11.9px;
        top: 10px;
    }
    div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.y8wKa {
        min-height: 22px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div, div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ {
        padding-top: 2px;
        padding-bottom: 2px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.Q55_h > div > div > article > .DEkbl.rtjhW, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9, article > div.VDRZ4 > div > span > div > div._7Vla9, article > div.LaNUG > div > div > span > div > div._7Vla9 {
        box-sizing: border-box;
        padding-top: 1px;
        padding-bottom: 1px;
        position: relative;
        padding-left: 13px;
    }
    /*search header*/
    #base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl.rtjhW {
        box-sizing: border-box;
        padding-top: 1px;
        padding-bottom: 1px;
        position: relative;
        padding-left: 13px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.Q55_h > div > div > article > header > .cPL5a.Afu4V.QCWsQ {
        height: 50px;
        padding-top: 0.9px;
        padding-bottom: 1px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.Q55_h > div > div > article > .DEkbl.rtjhW {
        padding-left: 7px;
        padding-right: 6px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.Q55_h > div > div > article > header > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk {
        padding-top: 1.8px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.Q55_h > div > div > article > header > div > div > div.l4Qpd {
        column-gap: 11px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div:nth-child(5) > div.Q55_h > div > div > article > header > div > div > div.RIcm_ > span > span > .giozV.Li_00 {
        padding: 9px 8px 8px 8px;
    }
    div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ span.BPf9u span.BPf9u button.VmbqY.r21y5.Li_00.giozV.EF4A5, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.RIcm_ > span > span > button {
        padding: 9.2px 8px 8px 8px;
    }
    .l4Qpd {
        align-items: center;
        column-gap: 10px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk, article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.cPL5a.QCWsQ.zmkgk {
        padding-left: 0px;
    }
    /*follow button padding*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5, #base-container div.D5eCV div.c9lq9 div._3xgk.Ril26 div.gPQR5.FGfuE.iTX1z div.lSyOz main.O4V_R div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5, #base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK div.LaNUG div div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button {
        padding: 2.7px 0 0 !important;
        height: 100%;
        align-items: center;
    }
    /*follow button*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button > span, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.RIcm_ > button > span, main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5 span.D4GNf, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5 span.D4GNf, #root div div#base-container div.D5eCV div.c9lq9 div._3xgk.VsR8V.f_ziq.Ril26 div.gPQR5.pTaNm div.lSyOz main.UX61Y div.Evcyl.W0qvx div.hyiL2 div.USr9U div div.So6RQ.i4aRn.YSitt div.ge_yK div.c79Av article.FtjPK div.LaNUG div div.Qb2zX span div.u2tXn div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.RIcm_ button.VmbqY.r21y5.Li_00.zn53i.EF4A5 span.D4GNf, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.RIcm_ > button > span, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button > .D4GNf,
     #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.RIcm_ > button > .D4GNf {
        font-family: var(--font-family);
        color: var(--color-primary-link);
        font-size: .875rem;
        font-weight: 700;
        line-height: 1.42857;
        text-decoration: none;
    }
    .zn53i.EF4A5.r21y5:hover {
        outline: none;
        text-decoration: underline;
        background-color: transparent;
        text-decoration-color: var(--color-primary-link);
    }
    /*pinned post*/
    .l4Qpd > .cPL5a, .DEkbl > .cPL5a:has(.Pl0ah) {
        font-family: var(--font-family);
        box-sizing: border-box !important;
        width: 100%;
        max-width: 540px;
        padding-left: 3px;
        padding-top: 2.7px;
        padding-bottom: 0px;
        border-radius: 8px 8px 0 0;
        justify-content: center;
        align-items: stretch;
        display: flex;
    }
    .Afu4V {
        gap: 0px;
    }
    .tOKgq {
        margin-top: 20px
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header:has(.Pl0ah) {
        padding-bottom: 10px;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div.Pl0ah, div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah {
        font-family: var(--font-family);
        font-size: .78125rem;
        font-weight: 400;
        color: RGB(var(--deprecated-accent));
        grid-row: 2;
    }
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div.Pl0ah > svg, div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah > svg, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah > svg {
        --icon-color-primary: RGB(var(--deprecated-accent)) !important;
        height: 14px;
        width: 14px;
    }
    #base-container > div> div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div.Pl0ah > p>span:after, div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah > .F2bKK>span:after, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah > .F2bKK>span:after {
        content: " Post";
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article:has(.UF4Vo) > header > div, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK > button) {
        font-family: var(--font-family);
        box-sizing: border-box !important;
        width: 100%;
        max-width: 540px;
        padding-left: 3px;
        padding-top: 2.7px;
        padding-bottom: 0px;
        border-radius: 8px 8px 0 0;
        justify-content: center !important;
        align-items: stretch !important;
        display: flex !important;
        flex-direction: column;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article:has(.UF4Vo) > header > div > div.Pl0ah, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div:has(.F2bKK > button) > div.Pl0ah {
        font-size: .875rem;
        font-family: var(--font-family-modern);
        color: var(--content-fg-secondary);
        flex-direction: row;
        align-items: center;
        column-gap: 6px;
        padding: 2px;
        font-weight: 350;
        line-height: 1.25rem;
        display: flex;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article:has(.UF4Vo) > header > div > div.Pl0ah > .F2bKK > span:after, #base-container > div> div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div.Pl0ah > p:has(button)>span:after, div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah > .F2bKK:has(button)>span:after, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div.Pl0ah > .F2bKK:has(button)>span:after {
        content: " ";
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div > div > div.l4Qpd > div.y8wKa, #base-container div.D5eCV div.c9lq9 div._3xgk div.RkANE.r1Zq6 div.DCCfo div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.y8wKa {
        min-height: 22px
    }
    /*minipost icons*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.y8wKa figure.NmEJh.IdTf7.WHBEq.pPM64, div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.y8wKa figure.NmEJh.IdTf7.WHBEq.pPM64 div.DPB5d span.BPf9u span.BPf9u a.BSUG4 div.HsI7c img.S8Dii.RoN4R.tPU70, /*search tags*/
    div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.y8wKa figure.NmEJh.IdTf7.WHBEq.pPM64, div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article div div span div div._7Vla9 div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt div.l4Qpd div.y8wKa figure.NmEJh.IdTf7.WHBEq.pPM64 div.DPB5d span.BPf9u span.BPf9u a.BSUG4 div.HsI7c > img, #base-container > div.D5eCV > div > div._3xgk.VsR8V.f_ziq.Ril26 > div > div.lSyOz > main > div > div.hyiL2 > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, #base-container > div.D5eCV > div > div._3xgk.VsR8V.f_ziq.Ril26 > div > div.lSyOz > main > div > div.hyiL2 > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, /*blogview*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.VDRZ4 > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.Q55_h > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > div > div.Q55_h > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > div.LaNUG > div > div > span > div > div._7Vla9 > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img {
        width: 32px !important;
        height: 32px !important;
    }
    /*tagged*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.kOFpP > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH > div > span > span > a > div > div > div > img, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.kOFpP > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH > div > span > span > a > div, /*Communities*/
    .pvWan > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > .ESMam.ntiBu > div img, .pvWan > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, /*Blogview*/
    main > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > .ESMam.ntiBu > div img, main > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, /*Drafts*/
    main > div.j8ha0 > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .FtjPK > .BjErQ > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > .ESMam.ntiBu > div img, main > div.j8ha0 > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .FtjPK > .BjErQ > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, /*Likes*/
    .NLCTe > div > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, .NLCTe > div > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > div.ESMam.ntiBu > div > img, /*Queue*/
    main > div.j8ha0 > div > .So6RQ.YSitt > .ge_yK > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > .ESMam.ntiBu > div img, main > div.j8ha0 > div > .So6RQ.YSitt > .ge_yK > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > div.ESMam.ntiBu > div > img, /*Patchfix?*/
    main > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > .ESMam.ntiBu > div img, main > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > div > a > .j4akp, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > div > a > .j4akp > div.ESMam.ntiBu > div > img, /*likespatchfux*/
    .NLCTe > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp, .NLCTe > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5 > .BPf9u > span > a > .j4akp > div.ESMam.ntiBu > div > img, /*dashboard 31/03/2025*/
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img,
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img,
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
           #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
        
            #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img,
       #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
        
        #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div  > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure > div.DPB5d > span > span > a > div > img,
        #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure{
        width: 64px !important;
        height: 64px !important;
    }
    .NmEJh.pPM64 {
        --border-radius: 3px;
    }
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.j8ha0 > div.sortableContainer > div > div > article > header > div, #glass-container div.Lq1wm div.yKniX div.xm3hr.raBdW.KwKKC.u10SL div.I41Le.q5M3M.u10SL div.DCCfo.kXP4L div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ, #base-container div.D5eCV div.c9lq9 div._3xgk div.RkANE.r1Zq6 div.DCCfo div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ {
        display: inline-grid;
        justify-items: start;
        align-items: center;
        justify-content: space-between;
    }
    #base-container div#glass-container div.Lq1wm div.yKniX div.xm3hr.raBdW.KwKKC.u10SL div.I41Le.q5M3M.u10SL div.DCCfo.kXP4L div.pKQCB div.Q05ZE main.gp1sd div.EYjNC div.qN8sP div.Evcyl div.zAlrA div div.So6RQ.YSitt div.ge_yK div.c79Av article.FtjPK.r0etU header.DEkbl div.cPL5a.Afu4V.QCWsQ div.m2Bdx.pLL0g.PCzZt {
        overflow: visible;
        -moz-column-gap: 3px;
        flex-direction: row;
        align-items: center;
        column-gap: 3px;
        display: flex;
    }
    /*tagged*/
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.kOFpP > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH > div, /*Communities*/
    .pvWan > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5, /*Blogview*/
    main > div.Evcyl > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5, /*Drafts*/
    main > div.j8ha0 > div.zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .FtjPK > .BjErQ > div.RYkKH > .nZ9l5, /*Likes*/
    .NLCTe > div > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5, main > .j8ha0 > .zAlrA > .rZlUD > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5, /*queue*/
    main > div.j8ha0 > div > .So6RQ.YSitt > .ge_yK > article > header > div.RYkKH > .nZ9l5, /*Patchfix?*/
    main > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > div.RYkKH > .nZ9l5, .NLCTe > div.Evcyl > div > div > .So6RQ.YSitt > .ge_yK > .c79Av > article > header > .RYkKH > .nZ9l5,
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div> div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > main > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, 
    #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.lSyOz > div > div.Evcyl > div.zAlrA > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure, 
    #base-container > div.D5eCV > .c9lq9 > div._3xgk.Ril26 > .gPQR5.FGfuE.iTX1z > div.lSyOz > .O4V_R > div.Evcyl > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure,
    #base-container > div > div > div > div._3xgk.jB5sp.Ril26 > div > div > div.Ownyk > div.pvWan > div.Evcyl > div.zAlrA > div > div > div > div > div > article > header > div > div > div.l4Qpd > div.y8wKa > figure {
        pointer-events: auto;
        top: 55px;
        transition: top .25s;
        position: -webkit-sticky;
        position: sticky;
    }
    #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH > div > span > span > a > div, #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH > div > span > span > a > div > div.ESMam.ntiBu > div > img {
        width: 32px !important;
        height: 32px !important;
    }
    #base-container > div.D5eCV > div > div._3xgk > div > div > div > div.Q05ZE > main > div > div > div > div.zAlrA > div > div > div > div > article > header > div.RYkKH {
        top: 0px;
        color: RGB(var(--white-on-dark));
        pointer-events: none;
        height: 100%;
        position: inherit;
        left: 0px;
    }
    /*mini-icons*/
    .Coaf7 {
        background: RGB(var(--black));
        padding: 1px;
        width: 30px !important;
        height: 30px !important;
        bottom: -5px !important;
        right: -5px !important;
    }
    .Coaf7 img {
        width: 30px !important;
        height: 30px !important;
    }
    .lSyOz:has(.R0TWs) > main > div > div > div > div > .FtjPK > [class="BjErQ PpzOx"] > .RYkKH > div > span > span > a > .Coaf7.ESMam.ntiBu.i5aqv {
        background: RGB(var(--white));
        padding: 1px;
        width: 16px !important;
        height: 16px !important;
        bottom: -5px !important;
        right: -5px !important;
    }
    .lSyOz:has(.R0TWs) > main > div > div > div > div > .FtjPK > [class="BjErQ PpzOx"] > .RYkKH > div > span > span > a > .Coaf7.ESMam.ntiBu.i5aqv img {
        width: 16px !important;
        height: 16px !important
    }
    /*Makes the Menu close (by expanding the size of the button)
This fix is a bit breaky so if you have issues let me know*/
    #community_button.TRX6J.UyyJb[aria-expanded="true"], #account_button.TRX6J.UyyJb[aria-expanded="true"] {
        left: 0;
        position: fixed;
        border-bottom: 0;
        z-index: 600;
        top: 0px;
    }
    #community_button.TRX6J.UyyJb[aria-expanded="true"] > .EvhBA.tDT48 {
        top: 1.5px;
        right: 436px;
        position: absolute;
    }
    #account_button.TRX6J.UyyJb[aria-expanded="true"] > .EvhBA.tDT48 {
        top: 6.5px;
        right: 67px;
        position: absolute;
    }
    .TRX6J:focus > .EvhBA {
        outline: none;
    }
    /*Removes the weird border lines*/
    .FA5JM {
        border-right: 0;
        position: absolute;
    }
    .l8iwp.NENaP, .c9lq9 ._3xgk.Ril26:has(.Du368) > .gPQR5 .lSyOz, .gPQR5.FGfuE .lSyOz {
        border-right: 0 !important;
    }
    .Mw2UR:focus-within .oPa7v.Qqfho {
        color: RGB(var(--black));
        background-color: RGB(var(--white));
        box-shadow: RGB(var(--deprecated-accent)) 0px 0px 0px 2px inset;
        outline: none;
    }
    /*reverts search box on collections*/
    .oPa7v, .QI77K .R3rx5 {
        color: rgba(var(--white-on-dark), .65) !important;
        background-color: rgba(var(--white-on-dark), .25) !important;
        border-radius: 3px;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        transition: background-color .25s;
        display: flex;
        position: relative;
        overflow: hidden;
        border: none;
        height: 34px !important;
    }
    .QI77K .R3rx5 > input {
        font-size: 1rem;
    }
    @media (max-width: 1163px) {
        /*Collections Search - Smallscreen*/
        .G6PED {
            position: relative;
            top: -42px;
            z-index: 99;
            left: -51.35vw;
            width: 415px;
        }
        .oeL0C {
            color: rgba(var(--white-on-dark), .65);
            background-color: rgba(var(--white-on-dark), .25);
            border-radius: 3px;
            justify-content: space-between;
            align-items: center;
            width: 57.83%;
            transition: background-color .25s;
            display: flex;
            position: relative;
            overflow: hidden;
            border: none;
        }
        .EqbwV {
            font-family: var(--font-family);
            color: inherit;
            background-color: transparent;
            border: none;
            outline: none;
            width: 100%;
            padding-left: 13px;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            order: 2
        }
        .oeL0C:focus-within {
            color: RGB(var(--black));
            background-color: RGB(var(--white));
        }
        .oeL0C .OgtUb > svg {
            order: 1
        }
        .OgtUb svg {
            --icon-color-primary: rgba(var(--white-on-dark), .65);
        }
        .OgtUb:focus-within svg {
            --icon-color-primary: rgba(var(--black), .65);
        }
        .L4V2r.EqbwV::placeholder {
            color: rgba(var(--white-on-dark), .65);
            opacity: 1;
        }
        .oeL0C > input:focus::-webkit-input-placeholder {
            color: #B4B4B4;
            opacity: 1;
        }
        .zVES4 {
            margin: 0
        }
    }
    @media (min-width: 1161.3px) {
        /*Collections Search - widescreen*/
        .G6PED {
            position: relative;
            top: -42px;
            z-index: 99;
            left: -46.1vw;
            width: 415px;
        }
        .oeL0C {
            color: rgba(var(--white-on-dark), .65);
            background-color: rgba(var(--white-on-dark), .25);
            border-radius: 3px;
            justify-content: space-between;
            align-items: center;
            width: 90.4%;
            transition: background-color .25s;
            display: flex;
            position: relative;
            overflow: hidden;
            border: none;
        }
        .EqbwV {
            font-family: var(--font-family);
            color: inherit;
            background-color: transparent;
            border: none;
            outline: none;
            width: 100%;
            padding-left: 13px;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            order: 2
        }
        .oeL0C:focus-within {
            color: RGB(var(--black));
            background-color: RGB(var(--white));
        }
        .oeL0C .OgtUb > svg {
            order: 1
        }
        .OgtUb svg {
            --icon-color-primary: rgba(var(--white-on-dark), .65);
        }
        .OgtUb:focus-within svg {
            --icon-color-primary: rgba(var(--black), .65);
        }
        .L4V2r.EqbwV::placeholder {
            color: rgba(var(--white-on-dark), .65);
            opacity: 1;
        }
        .oeL0C > input:focus::-webkit-input-placeholder {
            color: #B4B4B4;
            opacity: 1;
        }
        .zVES4 {
            margin: 0
        }
        /*Moves the search bar - Fullscreen + No Sticky*/
        .N5wJr {
            position: absolute !important;
            top: -73px !important;
            z-index: 99 !important;
            right: 46vw !important;
            width: 415px !important;
        }
        .N5wJr.bM94w, .N5wJr.npgoI {
            position: absolute !important;
            left: calc(-792.5px - 47.5px) !important;
            top: -88px !important;
            z-index: 99 !important;
            width: 399px !important;
        }
    }
    .gPQR5.pTaNm > div > aside > .N5wJr.bM94w, .gPQR5.pTaNm.FGfuE.iTX1z > div > .N5wJr.npgoI {
        left: var(--headerfix);
    }
    .zmjaW {
        display: none
    }
    @media (max-width: 1163px) {
        /*Moves the search bar - Smallscreen + No Sticky*/
        .N5wJr {
            position: absolute;
            left: -655px;
            top: -73px;
            z-index: 99;
            width: 280px;
        }
        .N5wJr.bM94w {
            position: absolute;
            left: -605px;
            top: -88px;
            z-index: 99;
            width: 280px;
        }
    }
    div.Hfsqc {
        margin-top: 0px;
        padding-left: 8px;
        padding-right: 8px
    }
    @media (min-width: 1161.3px) {
        /*Moves the search bar on search pages - Fullscreen + No Sticky*/
        .N5wJr.Hfsqc, .N5wJr.X7vaQ {
            position: absolute;
            left: -223.5px;
            top: -48px;
            z-index: 99;
            width: 414.8px;
        }
    }
    @media (max-width: 1163px) {
        /*Moves the search bar on search pages - Smallscreen + No Sticky*/
        .N5wJr.Hfsqc, .N5wJr.X7vaQ {
            position: absolute;
            left: -40px;
            top: -48px;
            z-index: 99;
            width: 340px;
        }
    }
    @media (min-width: 1161.3px) {
        /*Moves the search bar on collections pages - Fullscreen + No Sticky*/
        .N5wJr.QI77K {
            position: absolute;
            left: -782px;
            top: -86px;
            z-index: 99;
            width: 399px;
        }
    }
    @media (max-width: 1163px) {
        /*Moves the search bar on collections pages - Smallscreen + No Sticky*/
        .N5wJr.QI77K {
            position: absolute;
            left: -600px;
            top: -86px;
            z-index: 99;
            width: 264px;
        }
    }
    /*Removes border under icons when menu is active*/
    .IYrO9.XuIoh {
        border-bottom: 0
    }
    /*Moves the user icons*/
    .FtjPK .AD_w7 .JZ10N.y0ud2 {
        top: calc(50px + var(--dashboard-tabs-header-height, 0px))
    }
    /*Nudges the dashboard back into place*/
    .c9lq9 ._3xgk.Ril26:has(.Du368) > .gPQR5, .gPQR5.FGfuE, .gPQR5.ah4XU {
        margin: -7px !important;
        padding-top: 31px!important;
        position: relative;
    }
    .hAFp3, .XZFs6 .WIYYp .wvu3V, .XZFs6 {
        padding-left: 20px;
        padding-right: 20px
    }
    .tOKgq .m5KTc {
        margin: 0 20px;
    }
    .ZkG01 ._3xgk.ZN00W, .c9lq9 ._3xgk.Ril26 {
        padding-top: 50px;
    }
    /* com/username links positioning*/
    .RkANE.r1Zq6 {
        padding-top: 55px;
        margin: 40px auto 0;
    }
    .FtjPK.hMVn9, .wttFd.g77C_ {
        border-radius: 3px!important;
    }
    /*Check out these blocks sidebar*/
    .c9lq9 ._3xgk.Ril26:has(.Du368) > .gPQR5 .e1knl, .gPQR5.FGfuE .e1knl, .gPQR5.ah4XU .e1knl {
        padding-left: 9px !important;
        padding-top: 14px !important;
    }
    .D5eCV div.ZkG01 div._3xgk.ZN00W div.gPQR5.FGfuE.ah4XU.t8f_N div.e1knl, .D5eCV div.c9lq9 div._3xgk.Ril26 div > div.e1knl {
        min-width: 320px;
    }
    .PwJi6 {
        width: 99.9%;
    }
    .Q55_h .QfN0z {
        justify-content: center;
        padding: 0 7px;
        display: flex;
    }
    .oNZY7 {
        width: 100%;
        max-width: 310px;
    }
    /*^ for masonry-view searches*/
    .gPQR5.pTaNm.ah4XU {
        max-width: 1601px
    }
    /*fix for notes in masonry view if using post-block*/
    .gstmW {
        min-width: 85px
    }
    .ZkG01 ._3xgk.VsR8V.f_ziq, .c9lq9 ._3xgk.VsR8V.f_ziq {
        padding-left: 50px
    }
    /*notes fix

.tOKgq .m5KTc:not(:has(.y56NR), :has([aria-label="Delete"]), :has(.ePsyd)) {

    border-top: 1px solid rgba(var(--black), .13);

}*/
    /*Moves the Buttons back to the Header*/
    .ZkG01 .h_Erh, .c9lq9 .h_Erh {
        flex-basis: 228px;
        flex-basis: 0px;
        margin-right: 0px !important;
        position: absolute;
        top: 0;
        height: 54px;
        width: 100%;
        border-bottom: 1px solid rgba(var(--white-on-dark), .13);
        background-color: RGB(var(--navy));
    }
    /*Creates the header bar*/
    .FA5JM {
        width: 100% !important;
        max-width: 100% !important;
        height: 54px !important;
    }
    /*Positions and organises the buttons*/
    .FA5JM .NkkDk .gM9qK {
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
        position: absolute;
        z-index: 90;
        right: 80px;
        justify-content: end;
        align-items: center;
        justify-items: end;
        align-content: center;
        width: 100%;
    }
    .FA5JM .NkkDk {
        padding-bottom: 0px !important;
        height: 54px !important;
        overflow-x: visible !important;
        overflow-y: visible !important;
        justify-content: center !important;
    }
    .IYrO9 .tDT48 {
        justify-content: flex-start !important;
        flex-direction: row !important;
    }
    /*Resizes the button icons & Spaces them*/
    .IYrO9 .kn4U3 svg {
        width: 22px !important;
        height: 21px !important;
    }
    @media (max-width: 1161.5px) {
        .IYrO9 .kn4U3 {
            position: absolute;
            align-items: center;
        }
        .IYrO9 .tDT48 {
            justify-content: center !important;
        }
    }
    .gM9qK > .IYrO9, .gM9qK > .ZQMrc {
        width: 53px;
    }
    .a132D {
        width: 0
    }
    .jGgIg {
        border-top: none !important;
        display: flex !important;
        top: 0 !important;
        position: absolute !important;
        padding: 10px 16px 12px !important;
        justify-content: flex-end !important;
        height: 54px !important;
        align-content: center !important;
        align-items: center !important;
    }
    /*Moves the notification number icons back into place*/
    .a132D > .jF6A2 > .jpu7k.jDcIV.SmqzX.D0OOd.XnKJk > .VSvbe {
        min-width: 23px;
        height: 22px;
        border: 2px solid RGB(var(--navy))!important;
        font-size: .78125rem;
        left: -29px;
        top: -9px;
        border-style: none;
        position: relative;
        font-family: var(--font-family) !important;
        font-weight: 700 !important;
        color: var(--badge-text) !important;
    }
    .jpu7k.D0OOd.XnKJk > .VSvbe {
        font-size: .78125rem;
        border-style: none;
        position: relative;
        font-family: var(--font-family) !important;
        font-weight: 700 !important;
        color: var(--badge-text) !important;
    }
    /*notif smallview*/
    .tDT48 > .kn4U3 > .jpu7k.jDcIV.D0OOd.XnKJk {
        border: none !important
    }
    .tDT48 > .kn4U3 > .jpu7k.jDcIV.D0OOd.XnKJk > .VSvbe {
        min-width: 23px;
        height: 22px;
        border: 2px solid RGB(var(--navy))!important;
        font-size: .78125rem;
        left: -2px;
        border-style: none;
        position: relative;
        font-family: var(--font-family) !important;
        font-weight: 700 !important;
        color: var(--badge-text) !important;
    }
    .FA5JM .jDcIV:not(.SmqzX) {
        border: 2px solid RGB(var(--navy)) !important;
        border-style: none;
        min-width: 23px;
        height: 22px;
        top: -9.5px;
        left: 13px;
    }
    /*Revers notifications*/
    .TZgeO {
        font-family: var(--font-family);
        background-color: RGB(var(--white));
        gap: 12px;
        padding: 16px;
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.42857;
        display: flex;
        position: relative;
    }
    .pclKV > div, .MjEPb.K9dA1 > div {
        border-top: 1px solid rgba(var(--black), .13);
    }
    .MjEPb {
        box-sizing: border-box;
        border-radius: 6px;
    }
    .MjEPb.K9dA1 {
        background-color: RGB(var(--white));
    }
    .eToRo {
        color: RGB(var(--black));
    }
    .EOr4z {
        border-left: 3px solid rgba(var(--black), .25);
        overflow-wrap: anywhere;
        padding-left: 10px;
    }
    .Gt2Q9 {
        font-family: var(--font-family);
        color: rgba(var(--black), .65);
        justify-content: space-between;
        align-items: center;
        padding: 5px 15px;
        font-size: .78125rem;
        font-weight: 400;
        line-height: 1.52;
        display: flex;
    }
    .k53ko {
        font-family: var(--font-family);
        font-size: .78125rem;
        font-weight: 400;
        line-height: 1.52;
    }
    /*Hides the icon text*/
    .IYrO9 .ZC1wz, .IYrO9.g8SYn .ZC1wz, .HHKOH {
        Display: none;
    }
    .xkit--react nav #xkit_button > button > p {
        Display: none;
    }
    svg.xkit-mutual-icon {
        vertical-align: text-bottom;
        height: 1rem;
    }
    @media (max-width: 1162px) {
        /*Moves the Tumblr Logo*/
        .Gav7q {
            justify-content: center !important;
            padding: 0px !important;
            display: flex !important;
            left: 96px !important;
            position: absolute !important;
            padding-bottom: 2px !important;
        }
    }
    @media (min-width: 1162px) {
        /*Moves the Tumblr Logo*/
        .Gav7q {
            justify-content: center !important;
            padding: 0px !important;
            display: flex !important;
            position: absolute !important;
            left: 100px !important;
        }
    }
    /*Resizes the create a post button*/
    .jGgIg .ML6ef {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        margin-left: 18px !important;
        font-size: 0!important;
        margin-right: 2px !important;
        max-width: 45px !important;
        border-radius: 3px !important;
        height: 32px !important;
    }
    .jGgIg .ML6ef svg {
        margin-left: 7px
    }
    /*Displays Text ONLY in the menus*/
    .jL4Qq:not([hidden]) .tDT48 .a132D .ZC1wz, .jL4Qq:not([hidden]) .ZC1wz, .PsDsm:not([hidden]) .ZC1wz {
        display: contents !important
    }
    /*Adds the Spacers back into the menu and moves Log Out button*/
    .jL4Qq > .IYrO9 .lXFLr button {
        font-family: var(--font-family);
        background-color: rgba(var(--black), .07);
        box-sizing: border-box;
        z-index: 1;
        justify-content: space-between;
        align-items: center;
        width: 100% !important;
        height: 30px;
        top: 0px;
        font-size: .900rem;
        color: rgba(var(--black), .65);
        font-weight: 400;
        line-height: 1.5;
        display: flex;
        flex-direction: row-reverse;
        position: absolute;
    }
    #account_subnav > li:nth-child(1) {
        display: block !important;
    }
    #account_subnav > li:nth-child(2) {
        display: block !important;
    }
    #account_subnav > li:nth-child(3) {
        display: block !important;
    }
    #account_subnav > li:nth-child(4) {
        display: block !important;
    }
    #account_subnav > li:nth-child(3) > div > span.ZC1wz > button > span:before {
        visibility: visible;
        content: "Account";
        position: absolute;
        left: 10px;
    }
    #account_subnav > li:nth-child(4) > div > span.ZC1wz > button > span {
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.42857;
    }
    /*Moves the account icon back up when active*/
    #settings_button.TRX6J.UyyJb[aria-expanded="true"], #account_button.TRX6J.UyyJb[aria-expanded="true"] {
        top: -5px
    }
    .IYrO9 .UyyJb {
        text-align: left;
        width: 100%;
        height: 100%;
    }
    .pBLQq.pvZtw, .FA5JM .NkkDk .h8SQv {
        background-color: rgba(var(--black), .07);
        margin: 0 0px;
        padding: 12px 16px;
        font-size: .900rem;
        box-sizing: border-box;
        z-index: 1;
        height: 40px;
        justify-content: space-between;
        align-items: center;
        font-weight: 400;
        color: rgba(var(--black), .65) !important;
    }
    .gD5c2 {
        font-family: var(--font-family);
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
    }
    #account_subnav.jL4Qq {
        padding-top: 35px !Important;
        width: 240px;
    }
    .a132D, .ywBwc .a132D {
        padding: 8px 0;
    }
    .kbIQf > .jpu7k .jDcIV .SmqzX .D0OOd .XnKJk {
        color: rgba(var(--black), .65);
        text-align: right;
        margin-left: 5px;
    }
    /*Moves the menu so it appears over the top and not contained in the header*/
    .jL4Qq {
        margin-bottom: 5px;
        padding: 0;
        top: 53px;
        position: fixed;
        z-index: 1000;
        overflow-x: hidden;
        border-radius: 3px;
        max-height: calc(100vh - 88px);
        overflow-y: auto;
        box-shadow: 0 0 15px rgba(0, 0, 0, .5);
        Right: 17px;
    }
    /*Changes the colour of the Menus (this is set to tumblr Original Blue
    you may need to change it with other colour pallets)*/
    #account_subnav > li.IZU9t > ul > li > div > div > div > a > div > div.QK2Zh > div.gLEkw, .jL4Qq > .IYrO9, .xstzY, .yElCb, .XstzY .kbIQf li a {
        color: inherit !important;
    }
    .KXYTk .fTJAC, .IYrO9 .jF6A2, .XstzY .kbIQf li a .dTeP6 {
        color: rgba(var(--black), .65)!important
    }
    .jL4Qq {
        background: RGB(var(--white));
        color: RGB(var(--black)) !important;
        border: 1px solid rgba(var(--white-on-dark), .13);
    }
    .a132D {
        font-family: var(--font-family);
        color: RGB(var(--black));
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
    }
    .jL4Qq > .IYrO9 > .tDT48 > .a132D > .jF6A2 {
        font-family: var(--font-family);
        color: rgba(var(--black), .65);
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.5;
        display: inline-block;
    }
    /*Changes menu font size*/
    .IYrO9 {
        cursor: pointer;
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.333;
        list-style-type: none;
        display: flex;
    }
    /*Resizes the settings menu*/
    #settings_subnav:not([hidden]) {
        width: 228px;
        height: 426px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    /*Adjusts Menu's padding layout*/
    .jL4Qq > .IYrO9 .tDT48, .jL4Qq > .IYrO9 .lXFLr button {
        min-height: 35px;
        padding: 1px 20px 0 10px;
        width: 240px;
        padding-left: 20px;
    }
    #base-container > div.D5eCV > div > div._3xgk.ZN00W > div > div.e1knl > aside > .MV1bs.x8N5H > div.j1I7U > .So6RQ.YSitt, #base-container > div.D5eCV > div > div._3xgk.Ril26 > div > div.e1knl > aside > .MV1bs.x8N5H > div.j1I7U > .So6RQ.YSitt {
        margin-bottom: 2px;
    }
    .m8mN_.CWSOV {
        display: none;
    }
    .IYrO9 .tDT48, .IYrO9 .lXFLr button {
        padding: 8px 16px;
    }
    
    
    
    
    /* If you wish to remove the sticky header and have it stay in place,
    remove all the text between this and ''Sticky header End''
    you will need to redo this any time you update the style!

    Unfortunately a fixed header is a bit buggy so remove at your own risk!*/
    /*Sticky Header*/
    .ZkG01 .h_Erh, .c9lq9 .h_Erh {
        z-index: 99 !important;
        position: fixed !important;
    }
    @media (min-width: 1161.3px) {
        /*Moves the search bar - Fullscreen + Sticky*/
        .N5wJr, .zmjaW {
            position: fixed !important;
            left: 125px !important;
            top: 1px !important;
            z-index: 99 !important;
            width: 415px !important;
        }
        .N5wJr.bM94w {
            position: fixed !important;
            left: 125px !important;
            top: -7px !important;
            z-index: 99 !important;
            width: 399px !important;
        }
        .N5wJr.X7vaQ {
            left: 133px !important;
            top: 9px !important;
            width: 399px !important;
        }
        .G6PED {
            position: fixed !important;
            top: 8px !important;
            z-index: 99;
            left: 133px !important;
            width: 415px;
        }
    }
    @media (max-width: 1161.3px) {
        /*Moves the search bar - Smallscreen + Sticky*/
        .N5wJr, .zmjaW {
            position: fixed !important;
            left: 45px !important;
            top: 0px !important;
            z-index: 99 !important;
            width: 280px !important;
        }
        .N5wJr.bM94w {
            position: fixed !important;
            left: 53px !important;
            top: -7px !important;
            z-index: 99 !important;
            width: 280px !important;
        }
        .N5wJr.X7vaQ {
            left: 54px !important;
            top: 9px !important;
        }
        .G6PED {
            position: fixed !important;
            top: 8px !important;
            z-index: 99;
            left: 53px !important
        }
    }
    .X7vaQ {
        margin-top: 0px;
        padding-top: 14px;
        padding-left: 8px;
        padding-right: 8px;
    }
    .FtjPK .AD_w7 .JZ10N.y0ud2 {
        top: calc(55px + var(--dashboard-tabs-header-height, 0px))!important;
    }
    .N5wJr.QI77K {
        top: 9px !important;
        left: 133px !important;
        width: 399px !important;
    }
    /*Sticky Header End*/
    
    
    
    
}
}
`);