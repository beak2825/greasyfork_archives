// ==UserScript==
// @name         РЎРєСЂРїРёС‚ РґР»СЏ Р Рџ Р±РёРѕРіСЂР°С„РёР№ |  Black Russia UFA
// @namespace    https://forum.blackrussia.online
// @version      2.1.0
// @description  BLACK RUSSIA | UFA
// @author       R.Morozovae
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://i.postimg.cc/y69KrYVx/s-B6-DMyb-HTGRVxo-FPGQEg-LHGZ-V0-VLPIUh-DKZFg-U2-Gngi-F5-HA-Jj-I0vpt8qr-Hwk-UYSBg-ZNkyt-UNDE8-Mh-Qh6a-Yth-A.jpg
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/498121/%D0%A0%D0%8E%D0%A0%D1%94%D0%A1%D0%82%D0%A0%D1%97%D0%A0%D1%91%D0%A1%E2%80%9A%20%D0%A0%D2%91%D0%A0%C2%BB%D0%A1%D0%8F%20%D0%A0%20%D0%A0%D1%9F%20%D0%A0%C2%B1%D0%A0%D1%91%D0%A0%D1%95%D0%A0%D1%96%D0%A1%D0%82%D0%A0%C2%B0%D0%A1%E2%80%9E%D0%A0%D1%91%D0%A0%E2%84%96%20%7C%20%20Black%20Russia%20UFA.user.js
// @updateURL https://update.greasyfork.org/scripts/498121/%D0%A0%D0%8E%D0%A0%D1%94%D0%A1%D0%82%D0%A0%D1%97%D0%A0%D1%91%D0%A1%E2%80%9A%20%D0%A0%D2%91%D0%A0%C2%BB%D0%A1%D0%8F%20%D0%A0%20%D0%A0%D1%9F%20%D0%A0%C2%B1%D0%A0%D1%91%D0%A0%D1%95%D0%A0%D1%96%D0%A1%D0%82%D0%A0%C2%B0%D0%A1%E2%80%9E%D0%A0%D1%91%D0%A0%E2%84%96%20%7C%20%20Black%20Russia%20UFA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const UNACCEPT_PREFIX = 4; // РїСЂРµС„РёРєСЃ РѕС‚РєР°Р·Р°РЅРѕ
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const CLOSE_PREFIX = 7; // РїСЂРµС„РёРєСЃ Р·Р°РєСЂС‹С‚Рѕ
  const buttons = [
    {
      title: "б…  б…  б…  б…  б…  б…  б… в Ђв Ђ в Ђв Ђб…  б… б… б… б… СЂРї Р±РёРѕРіСЂР°С„РёРё б… б… в Ђв Ђв Ђ в Ђб…  б…  б…  б…  б…  б…  ",
      dpstyle:
        "oswald: 3px; color: #fff; background: #7d09dc; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317",
    },
    {
      title: "Р Рџ Р±РёРѕРіСЂР°С„РёСЏ РћРґРѕР±СЂРµРЅРѕ",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00][ICODE]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - РћРґРѕР±СЂРµРЅРѕ.[/ICODE][/COLOR][/CENTER]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РћСЂС„ Рё РїСѓРЅРєС‚СѓР°С† РѕС€РёР±РєРё",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№.[/URL][/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]РћСЂС„РѕРіСЂР°С„РёС‡РµСЃРєРёРµ Рё РїСѓРЅРєС‚СѓР°С†РёРѕРЅРЅС‹Рµ РѕС€РёР±РєРё.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Р‘РёРѕ РѕС‚ 3-РіРѕ Р»РёС†Р°",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/threads/tyumen-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.6220012/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]Р‘РёРѕРіСЂР°С„РёСЏ РѕС‚ 3-РіРѕ Р»РёС†Р°.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Р”Р°С‚Р° СЂРѕР¶РґРµРЅРёСЏ РЅРµРєРѕСЂСЂРµРєС‚РЅР°",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]Р”Р°С‚Р° СЂРѕР¶РґРµРЅРёСЏ РЅРµРєРѕСЂСЂРµРєС‚РЅР°.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РРЅС„РѕСЂРјР°С†РёСЏ РЅРµ СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓРµС‚ РІСЂРµРјРµРЅРё",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]РРЅС„РѕСЂРјР°С†РёСЏ РІ РїСѓРЅРєС‚Р°С… РЅРµ СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓРµС‚ РІСЂРµРјРµРЅРЅС‹Рј СЂР°РјРєР°Рј.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Р’РѕР·СЂР°СЃС‚ РЅРµ СЃРѕРІРїР°Р»",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]Р’РѕР·СЂР°СЃС‚ РЅРµ СЃРѕРІРїР°РґР°РµС‚ СЃ РґР°С‚РѕР№ СЂРѕР¶РґРµРЅРёСЏ.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РЎР»РёС€РєРѕРј РјРѕР»РѕРґ",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]РќРµРєРѕСЂСЂРµРєС‚РµРЅ РІРѕР·СЂР°СЃС‚ (СЃР»РёС€РєРѕРј РјРѕР»РѕРґ).[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Р‘РёРѕРіСЂР°С„РёСЏ СЃРєРѕРїРёСЂРѕРІР°РЅР°",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/threads/tyumen-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.6220012/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]Р‘РёРѕРіСЂР°С„РёСЏ СЃРєРѕРїРёСЂРѕРІР°РЅР°.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ Р Рџ РёРЅС„РѕСЂРјР°С†РёРё",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ Р Рџ РёРЅС„РѕСЂРјР°С†РёРё.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РќРµ РїРѕ С„РѕСЂРјРµ bio",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/threads/tyumen-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.6220012/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]Р‘РёРѕРіСЂР°С„РёСЏ РЅРµ РїРѕ С„РѕСЂРјРµ.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РќРµРєРѕСЂСЂРµРєС‚ РЅР°С†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]РќРµРєРѕСЂСЂРµРєС‚РЅР°СЏ РЅР°С†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РќРµ РґРѕРїРѕР»РЅРёР»Рё",
      dpstyle:
        "border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
        "[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Р’С‹ РЅРµ РґРѕРїРѕР»РЅРёР»Рё СЃРІРѕСЋ RolePlay Р‘РёРѕРіСЂР°С„РёСЋ [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]РћС‚РєР°Р·Р°РЅРѕ[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
        "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹ РЅР°[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Р—Р°РіРѕР»РѕРІРѕРє РЅРµ РїРѕ С„РѕСЂРјРµ bio",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Р”РѕР±СЂРѕРіРѕ РІСЂРµРјРµРЅРё СЃСѓС‚РѕРє СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00]Р’Р°С€Р° RolePlay Р±РёРѕРіСЂР°С„РёСЏ Р±С‹Р»Р° РїСЂРѕРІРµСЂРµРЅР° Рё РїРѕР»СѓС‡Р°РµС‚ СЃС‚Р°С‚СѓСЃ - [COLOR=#FF0000]РћС‚РєР°Р·Р°РЅРѕ.[/COLOR]<br>[COLOR=#FFFF00]РЈР±РµРґРёС‚РµР»СЊРЅР°СЏ РїСЂРѕСЃСЊР±Р° РѕР·РЅР°РєРѕРјРёС‚СЊСЃСЏ[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']СЃ РїСЂР°РІРёР»Р°РјРё РЅР°РїРёСЃР°РЅРёСЏ RolePlay Р±РёРѕРіСЂР°С„РёР№[/URL].[/CENTER]<br>" +
        "[CENTER][COLOR=#FFFF00]РџСЂРёС‡РёРЅР° РѕС‚РєР°Р·Р°: [COLOR=#FFFFFF]Р—Р°РіРѕР»РѕРІРѕРє С‚РµРјС‹ РЅРµ РїРѕ С„РѕСЂРјРµ.[/B][/COLOR]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]РџСЂРёСЏС‚РЅРѕР№ РёРіСЂС‹.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Р—Р°РіСЂСѓР·РєР° СЃРєСЂРёРїС‚Р° РґР»СЏ РѕР±СЂР°Р±РѕС‚РєРё С€Р°Р±Р»РѕРЅРѕРІ
    $(`body`).append(
      `<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`
    );

    // Р”РѕР±Р°РІР»РµРЅРёРµ РєРЅРѕРїРѕРє РїСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹

    addButton("Р Рџ Р‘РРћР“Р РђР¤РРрџ‘•", "Answer");
    // РџРѕРёСЃРє РёРЅС„РѕСЂРјР°С†РёРё Рѕ С‚РµРјРµ
    const threadData = getThreadData();

    $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
    $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
    $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));

    $(`button#Answer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, `Р’С‹Р±РµСЂРёС‚Рµ РѕС‚РІРµС‚:`);
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() =>
            pasteContent(id, threadData, true)
          );
        } else {
          $(`button#answers-${id}`).click(() =>
            pasteContent(id, threadData, false)
          );
        }
      });
    });
  });

  function addButton(name, id) {
    $(".button--icon--reply").before(
      `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button--primary button ` +
          `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`
      )
      .join("")}</div>`;
  }

  function pasteContent(id, data = {}, send = false) {
    const templl = Handlebars.compile(buttons[id].content);
    if ($(`.fr-element.fr-view p`).text() === ``)
      $(`.fr-element.fr-view p`).empty();

    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view p`).append(templl(data));
    $(`a.overlay-titleCloser`).trigger(`click`);

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  function getThreadData() {
    const authorID = $("a.username")[0].attributes["data-user-id"].nodeValue;
    const authorName = $("a.username").html();
    const hours = new Date().getHours();
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: () =>
        4 < hours && hours <= 11
          ? "Р”РѕР±СЂРѕРµ СѓС‚СЂРѕ"
          : 11 < hours && hours <= 15
          ? "Р”РѕР±СЂС‹Р№ РґРµРЅСЊ"
          : 15 < hours && hours <= 21
          ? "Р”РѕР±СЂС‹Р№ РІРµС‡РµСЂ"
          : "Р”РѕР±СЂРѕР№ РЅРѕС‡Рё",
    };
  }

  function editThreadData(prefix, pin = false) {
    // РџРѕР»СѓС‡Р°РµРј Р·Р°РіРѕР»РѕРІРѕРє С‚РµРјС‹, С‚Р°Рє РєР°Рє РѕРЅ РЅРµРѕР±С…РѕРґРёРј РїСЂРё Р·Р°РїСЂРѕСЃРµ
    const threadTitle = $(".p-title-value")[0].lastChild.textContent;

    if (pin == false) {
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
          prefix_id: prefix,
          title: threadTitle,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    }
    if (pin == true) {
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
          prefix_id: prefix,
          title: threadTitle,
          discussion_open: 1,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    }
    if (prefix == UNACCEPT_PREFIX) {
      moveThread(prefix, 1174);
    }
    if (prefix == ACCEPT_PREFIX) {
      moveThread(prefix, 1172);
    }
  }

  function moveThread(prefix, type) {
    // РџРµСЂРµРјРµС‰РµРЅРёРµ С‚РµРјС‹ РІ СЂР°Р·РґРµР» РѕРєРѕРЅС‡Р°С‚РµР»СЊРЅС‹С… РѕС‚РІРµС‚РѕРІ
    const threadTitle = $(".p-title-value")[0].lastChild.textContent;

    fetch(`${document.URL}move`, {
      method: "POST",
      body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        target_node_id: type,
        redirect_type: "none",
        notify_watchers: 1,
        starter_alert: 1,
        starter_alert_reason: "",
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: "json",
      }),
    }).then(() => location.reload());
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach((i) => formData.append(i[0], i[1]));
    return formData;
  }
})();