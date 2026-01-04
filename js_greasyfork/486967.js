// ==UserScript==
// @name         Повестка_Признание
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Весточке пришла повесточка!
// @match        https://catwar.su/ls?new*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486967/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%BA%D0%B0_%D0%9F%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/486967/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%BA%D0%B0_%D0%9F%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {

        const select = document.createElement('input');
        select.style.marginTop = '10px';
        select.value = 'Отправить повестку';
        select.type = 'button';

        select.addEventListener("click", function() {
            var text = `[table=0][tr][td][color=transparent]**[/color][/td][td]Гражданину, проживающему по адресу:
Озёрная вселенная, Северный клан[/td][/tr][/table]
[center][b]Повестка[/b][/center]
В соответствии с Федеральным законом "О воинской обязанности и военной службе" Вы подлежите первоначальной постановке на воинский учет и обязаны в срочном порядке явиться в военный комиссариат Северного клана по адресу: [b][u][url=https://catwar.su/blog230706]https://catwar.su/blog230706[/url][/u][/b].
При себе иметь персональный идентификатор пользователя (ID), адрес личной страницы в социальной сети ВКонтакте, скриншоты уровня боевых умений.

[center][b]Военный комиссар гвардейского батальона «Север»
[/b][table=0][tr][td]М.П.[color=transparent]**[/color][/td][td][img]https://i.ibb.co/Hqv0ymd/0a686b10ede9.png[/img][/td][td][color=transparent]*[/color]Признание[/td][/tr]
[tr][td] [/td][td][size=8](подпись)[/size][/td][/tr][/table][/center]
[hr]
[center][b]О Б Я З А Н Н О С Т И
гражданина, подлежащего первоначальной постановке на воинский учет.[/b][/center]
1. В соответствии с Федеральным законом "О воинской обязанности и военной службе" граждане, подлежащие первоначальной постановке на воинский учет, обязаны явиться по повестке военного комиссариата на заседание комиссии по постановке на воинский учет, имея при себе документы, указанные в повестке.

2. В случае неявки без уважительной причины гражданина по повестке военного комиссариата на мероприятия, связанные с первоначальной постановкой на воинский учет, он привлекается к ответственности в соответствии с законодательством Северного клана.

Уважительной причиной неявки по вызову (повестке) военного комиссариата, при условии документального подтверждения, являются:
[ul][li]Технические неполадки, связанные с утратой работоспособности;[/li][li]Наличие уровня боевых умений, недостаточного для поступления на службу;[/li][li]Препятствие, возникшее в результате действия непреодолимой силы, или иное обстоятельство, не зависящее от воли гражданина;[/li][li]Иные причины, признанные уважительными комиссией по постановке граждан на воинский учет или судом.[/li][/ul]
По истечению действия уважительной причины граждане являются в военный комиссариат немедленно без дополнительного вызова.`.replace(/\n/g, '\[br]');
            var tema = `читать в срочном порядке`;

            event.stopPropagation();
            textarea.value = text;
            subjectInput.value = tema;
        });

        const textarea = document.querySelector('textarea[name="text"]');
        const subjectInput = document.querySelector('input[name="subject"]');
        const sendButton = document.querySelector('#submit');

        textarea.parentNode.insertBefore(select, textarea.nextSibling);
    }, 500);
})();