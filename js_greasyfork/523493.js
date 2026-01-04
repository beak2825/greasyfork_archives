// ==UserScript==
// @name        Для кураторов форума | BLACK RUSSIA [83]
// @namespace    https://forum.blackrussia.online
// @version      2.74
// @description  По всем вопросам обращаться во ВКонтакте (@sqxoo)
// @author      Gene_Simmons
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/523493/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20BLACK%20RUSSIA%20%5B83%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/523493/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20BLACK%20RUSSIA%20%5B83%5D.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // [Отказано]
const ACCEPT_PREFIX = 8; // [Одобрено]
const CONSIDERATION_PREFIX = 2; // [На рассмотрении]
const TEX_PREFIX = 13; // [Техническому администратору]
const buttons2 = [
     {
      title: 'На рассмотрении ❓',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]~~~[/FONT]"+
         "[url=https://postimg.cc/bSd4Zgzp][img]https://i.postimg.cc/FzxvnC8d/z6-A9-GLJl185pqd5-HNqcl-L2-AYo4mkgf-BELVq-Dyw-B1-Aa-YW7dc-2-Ry-NEmu-Sr2-Md-Qg-Nz141qai7bk-Vf5-Wloolr-MWx-X9.webp[/img][/url]", 
      prefix: CONSIDERATION_PREFIX,
	  status: true,
    },
     {
      title: 'Тех ❗',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Ваша жалоба передана на рассмотрение технического специалиста[/FONT]"+
         "[url=https://postimg.cc/grTpKjC1][img]https://i.postimg.cc/Wb24TJXp/Pb-GBn-Z8-Gwk-IJYKb-SSZ8rlvj2leg-Ls-DJ4-TSeld-Zieo-Zf-Tjf-YRczz23-F2lv-Fp-Pm-Tdlmjrz1-KMF-et-UDGj-g-JV94-Io-1.webp[/img][/url]",
      prefix: TEX_PREFIX,
	  status: true,
    },
         {
      title: 'perm 🔥',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]На аккаунт игрока будет выдано наказание – [/COLOR][COLOR=rgb(255, 255, 255)]пермаментная блокировка аккаунта[/FONT]"+
         "[URL='https://postimg.cc/nC79mZ1B'][IMG]https://i.postimg.cc/SN16wx2T/ljf-Gtg-A6opc-LQ194pd-I1-Yx-Vbfx-VT5aw-Bag-Pue-Yh-Zfd-Hd-OW7-Oe1q-Do7-YJg-H3-Myg-CCv-AJsp-RQMa-T2o-Wofw-Pn-EHz.webp[/IMG][/URL]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    }, 
         {
      title: 'ban 🔥',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]На аккаунт игрока будет выдано наказание – [/COLOR][COLOR=rgb(255, 255, 255)]блокировка аккаунта[/FONT]"+
         "[URL='https://postimg.cc/nC79mZ1B'][IMG]https://i.postimg.cc/SN16wx2T/ljf-Gtg-A6opc-LQ194pd-I1-Yx-Vbfx-VT5aw-Bag-Pue-Yh-Zfd-Hd-OW7-Oe1q-Do7-YJg-H3-Myg-CCv-AJsp-RQMa-T2o-Wofw-Pn-EHz.webp[/IMG][/URL]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'warn 🔥',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]На аккаунт игрока будет выдано наказание – [/COLOR][COLOR=rgb(255, 255, 255)]предупреждение[/FONT]"+
         "[URL='https://postimg.cc/nC79mZ1B'][IMG]https://i.postimg.cc/SN16wx2T/ljf-Gtg-A6opc-LQ194pd-I1-Yx-Vbfx-VT5aw-Bag-Pue-Yh-Zfd-Hd-OW7-Oe1q-Do7-YJg-H3-Myg-CCv-AJsp-RQMa-T2o-Wofw-Pn-EHz.webp[/IMG][/URL]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'mute 🔥',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]На аккаунт игрока будет выдано наказание – [/COLOR][COLOR=rgb(255, 255, 255)]блокировка игрового чата[/FONT]"+
         "[URL='https://postimg.cc/nC79mZ1B'][IMG]https://i.postimg.cc/SN16wx2T/ljf-Gtg-A6opc-LQ194pd-I1-Yx-Vbfx-VT5aw-Bag-Pue-Yh-Zfd-Hd-OW7-Oe1q-Do7-YJg-H3-Myg-CCv-AJsp-RQMa-T2o-Wofw-Pn-EHz.webp[/IMG][/URL]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'jail 🔥',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]На аккаунт игрока будет выдано наказание – [/COLOR][COLOR=rgb(255, 255, 255)]заключение во ФСИН[/FONT]"+
         "[URL='https://postimg.cc/nC79mZ1B'][IMG]https://i.postimg.cc/SN16wx2T/ljf-Gtg-A6opc-LQ194pd-I1-Yx-Vbfx-VT5aw-Bag-Pue-Yh-Zfd-Hd-OW7-Oe1q-Do7-YJg-H3-Myg-CCv-AJsp-RQMa-T2o-Wofw-Pn-EHz.webp[/IMG][/URL]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отсутствуют д ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Отсутствуют доказательства нарушения[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Нарушений нет ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]При проверке доказательств нарушения не обнаружены[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
   	 {
      title: 'Неуважение ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Неуважительное отношение к администрации[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: '3-е лицо ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Жалоба не должна быть написана третьим лицом[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Нужно видео ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Для данного нарушения требуется видеодоказательство[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Мало д ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Доказательств недостаточно для выдачи наказания[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'нет /time ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]На доказательствах отсутствует /time[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Истёк срок подачи ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Срок подачи жалобы истёк[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Попробуйте другой хостинг ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Загрузите доказательство через другой хостинг[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Плохое качество ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Доказательство загружено в плохом качестве[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Imgur обрезает ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Imgur обрезает видеодоказательства. Воспользуйтесь YouTube[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Условия сделки не были обговорены ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Условия сделки не были обговорены заранее[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Имущество было возвращено ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Игрок вернул вам полученное имущество[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Игрок уже был наказан ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Игрок уже получал наказание за данное нарушение[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Отсутствуют тайм-коды ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Видеодоказательство большого размера. Отсутствуют тайм-коды[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Нерабочие д ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Доказательства невозможно открыть. Проверьте их на работоспособность[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'В логировании нет нарушения ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]При проверке логов сервера нарушений не найдено[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'д отредактированы ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Доказательства подверглись редактированию[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Составлено не по форме ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Ваша жалоба составлена не по форме[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Создано не по теме ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]При повторном создании тем не по теме раздела на ваш форумный аккаунт могут быть возложены ограничения[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Создано в другом разделе ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]Вы перепутали раздел для отправки жалобы.[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'д подделаны ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Доказательства были подделаны. В ближайшее время на ваш аккакнт будет выдана блоикровка[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Оскорбление в IC ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]За данные действия в IC-чат наказание не выдаётся[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
      title: 'Дублирование ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]При повторном дублировании жалобы на ваш форумный аккаунт могут быть возложены ограничения[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
];
const buttons = [
 
     {
      title: 'Одобрено ✅',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]~~~[/FONT]"+
         "[URL='https://postimg.cc/nC79mZ1B'][IMG]https://i.postimg.cc/SN16wx2T/ljf-Gtg-A6opc-LQ194pd-I1-Yx-Vbfx-VT5aw-Bag-Pue-Yh-Zfd-Hd-OW7-Oe1q-Do7-YJg-H3-Myg-CCv-AJsp-RQMa-T2o-Wofw-Pn-EHz.webp[/IMG][/URL]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано [другие причины для отказа] ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Биография нарушает правила написания RolePlay биографий[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	    status: false,
    },
     {
      title: 'На рассмотрении ❓',
      content:
         "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
         "[QUOTE][CENTER][COLOR=rgb(175, 238, 238)]~~~[/FONT]"+
         "[url=https://postimg.cc/bSd4Zgzp][img]https://i.postimg.cc/FzxvnC8d/z6-A9-GLJl185pqd5-HNqcl-L2-AYo4mkgf-BELVq-Dyw-B1-Aa-YW7dc-2-Ry-NEmu-Sr2-Md-Qg-Nz141qai7bk-Vf5-Wloolr-MWx-X9.webp[/img][/url]", 
      prefix: CONSIDERATION_PREFIX,
	  status: true,
    },
	 {
	     title: 'Перерассмотрение от ЗГКФ | ГКФ ⭐',
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Биография находится на повторном рассмотрении[/COLOR][/FONT]"+
         "[url=https://postimg.cc/bSd4Zgzp][img]https://i.postimg.cc/FzxvnC8d/z6-A9-GLJl185pqd5-HNqcl-L2-AYo4mkgf-BELVq-Dyw-B1-Aa-YW7dc-2-Ry-NEmu-Sr2-Md-Qg-Nz141qai7bk-Vf5-Wloolr-MWx-X9.webp[/img][/url]", 
      prefix: CONSIDERATION_PREFIX,
	  status: true,
    },
     {
      title: 'Копирование чужой биографии ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Полное или частичное копирование чужой биографии[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
}, 
{
     title: 'Составлено не по форме ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Биография составлена не по форме[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'У персонажа NonRP Nick ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]NonRP имя персонажа[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Дейстаия происходят не от 3-го лица ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Биография написана не от 3-го лица[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
    prefix: UNACCEPT_PREFIX,  
    status: false, 
    },
{
      title: 'Дублирование ⛔' ,
      content:  
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Повторная отправка рассмотреной биографии[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'PowerGaming в биографии ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]PowerGaming в биографии[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'MetaGaming в биографии ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]MetaGaming в биографии[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Создано в другом разделе ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Вы перепутали форумный раздел[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Использование ChatGPT ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Биография создана с помощью сторонних ресурсов[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Мало RP информации [детство] ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Малое количество RolePlay информации в разделе 'Детство'[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Мало RP информации [юность и взрослая жизнь] ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Малое количество RolePlay информации в разделе 'Юность и взрослая жизнь'[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Мало RP информации [настоящее время] ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Малое количество RolePlay информации в разделе 'Настоящее время'[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Мало RP информации [вся биография] ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Малое количество RolePlay информации во всей биографии[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Персонажу менее 18-ти лет ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Возраст персонажа менее 18-ти лет[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Имя в заголовке и биографии разные ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Имя персонажа в заголовке и биографии отличается[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
     title: 'Возраст в биографии разный ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Возраст в биографии отличается[/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Политический/национальный розжиг ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Биография затрагивает политику/религию/национальность[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Биография известной личности ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Биография известной личности/администратора/лидера[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    }, 
{
      title: 'Заговолок составлен не по форме ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Заголовок составлен не по форме[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'На аккаунте уже есть биография ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]На данном аккаунте уже имеется одобренная биография[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	     title: 'Большое количество ошибок ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Наличие большого количества орфографических/смысловых/пунктуационных ошибок[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	 {
	     title: 'Нет информации про семью ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Отсутствует информация про семью и родственников[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	     title: 'Нет информации про характер ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Отсутствует информация про характер персонажа[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	     title: 'Нет информации про внешность ⛔' ,
      content:
        "[QUOTE][CENTER][FONT=times new roman][COLOR=rgb(175, 238, 238)]❯ {{ greeting }}, уважаем(-ый/-ая) {{ user.mention }}"+
        "[QUOTE][CENTER][COLOR=rgb(178, 34, 34)]Примечание: [/COLOR][COLOR=rgb(255, 255, 255)]Отсутствует информация про внешность и описание персонажа[/COLOR][/FONT]"+
        "[url=https://postimg.cc/wtTHYktB][img]https://i.postimg.cc/Dz1zsjn1/Wg7-U3xji3-Su3-t-Mdp-FZQas8-Ex-Zki-Bt-I1zo2-bm-FHo-Alnzia-DW7-HUbh9e-UN4dn-OP91-Ttlg1x-SFLy7k-TLsqku1y-Jj.webp[/img][/url]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Биографии', 'selectAnswer');
    addButton('Жалобы', 'selectAnswer2');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите нужный шаблон для ответа:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
    $(`button#selectAnswer2`).click(() => {
      XF.alert(buttonsMarkup2(buttons2), null, 'Выберите нужный шаблон для ответа:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
        }
      });
    });
  });
 
  function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
    );
  }
 
  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
  .map(
  (btn, i) =>
    `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
  }
  
    function buttonsMarkup2(buttons) {
    return `<div class="select_answer2">${buttons
  .map(
  (btn, i) =>
    `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
  }
 
  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');
 
    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
  }
  
    function pasteContent2(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons2[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');
 
    if (send == true) {
      editThreadData(buttons2[id].prefix, buttons2[id].status);
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
  }
 
  function getThreadData() {
    const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
    const authorName = $('a.username').html();
    const hours = new Date().getHours();
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: () =>
        6 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 17 ?
        'Добрый день' :
        17 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
    };
  }
 
    function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
	if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
 
 
 
 
 if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }
 
 
function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	target_node_id: type,
	redirect_type: 'none',
	notify_watchers: 1,
	starter_alert: 1,
	starter_alert_reason: "",
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
  }),
}).then(() => location.reload());
}
 
function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
    }
})();