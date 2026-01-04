// ==UserScript==
// @name         Black 10 Scripts
// @namespace    https://forum.blackrussia.online/
// @version      3.1.2
// @description  Скрипт для Руководства сервера by J.Murphy
// @author       Santiago Jackovic Кушнир продакшн представляет
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/531772/Black%2010%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/531772/Black%2010%20Scripts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ACCEPT_PREFIX = 8; // префикс одобрено
    const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
    const GA_PREFIX = 12 // главному администратору
    const SPEC_PREFIX = 11 // спец админу
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
	const NO_PREFIX = 0;

    const ZB_TECH = 1191;
    const TECH = 488;
    const ZB_PLAYER = 470;
    const ZB_LEADER = 469;
    const OBJ = 471;

    const buttons = [
    {
        title: '----------------------------------------------------------|Жалобы на администратора|---------------------------------------------------------',
        content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
        title: '| Запрос доказательств |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Запрошу у администратора все необходимые доказательства и предоставлю вам ответ, как только получу информацию.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Ожидайте ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
        title: '| Взято на рассмотрение |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Ваше жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа в ближайшее время. Мы просим воздержаться от создания дубликатов данной темы. Благодарим за понимание.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Ожидайте ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
        title: '| Администратор прав |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Администратор предоставил все необходимые доказательства, подтверждающие правомерность решения. На основании представленных материалов наказание было назначено верно и в соответствии с правилами.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто.  [/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
        title: '| НАрушений от администратора нет |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE]По итогам рассмотрения вашей жалобы нарушений со стороны администратора не выявлено. Действия администратора соответствуют установленным правилам и регламенту сервера.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто  [/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: '| Меры к администратору |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] После тщательной проверки поданной жалобы в отношении администратора будут приняты строгие меры. Благодарим вас за информацию. [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто  [/ICODE][/COLOR] [/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
        {
        title: '| Меры к администратору и снятие наказания |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] После тщательного рассмотрения вашей жалобы было принято решение о применении строгих мер в отношении администратора. Ваше наказание будет снято. Благодарим вас за предоставленную информацию [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто  [/ICODE][/COLOR] [/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
    },

          {
        title: '| Ответ в прошлой жалобе |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER] [COLOR=AQUA][ICODE] Ответ на вашу жалобу уже был дан в предыдущей теме. Пожалуйста, ознакомьтесь с ним там.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
       '[CENTER] [COLOR=RED][ICODE] Отказано, закрыто [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
            {
        title: '| Недостаточно доказательств |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] В вашей жалобе недостаточно доказательств для ее рассмотрения. Пожалуйста, предоставьте дополнительные сведения, такие как скриншоты, видеодоказательства и тд.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
       '[CENTER] [COLOR=RED][ICODE] Отказано [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
        title: '| Передано ЗГА |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER] [COLOR=AQUA][ICODE]Ваша жалоба передана на рассмотрение Заместителю Главного Администратора. Он детально изучит ситуацию и примет соответствующее решение. Пожалуйста, ожидайте его ответа. [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
        title: '| Передано ГА |',
        content:
          "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER] [COLOR=AQUA][ICODE] Ваша жалоба передана на рассмотрение Главному Администратору. Он тщательно изучит все детали и примет взвешенное решение. Пожалуйста, ожидайте его ответа. [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: GA_PREFIX,
        status: true,
    },
              {
        title: '| Передано ЗГА | ГА |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER] [COLOR=AQUA][ICODE]Ваша жалоба передана на рассмотрение Главному Администратору и Заместителю Главного Администратора. Один из них тщательно изучит все обстоятельства и примет решение в соответствии с правилами. Пожалуйста, ожидайте их ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
        {
        title: '| Передано СА |',
        content:
         "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER] [COLOR=AQUA][ICODE]Ваша жалоба передана на рассмотрение Специальной Администрации. Один из ее представителей тщательно изучит все обстоятельства и примет решение в соответствии[/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER] [COLOR=AQUA][ICODE]Ответ может занять более 48 часов. [/ICODE][/COLOR][/CENTER]<br><br>"+
         '[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: SPEC_PREFIX,
        status: true,
    },
           {
        title: '| КФ прав |',
        content:
         "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER] [COLOR=AQUA][ICODE]После проверки жалобы, поданной на вас другим игроком, было принято решение, что куратор форума вынес наказание справедливо и в соответствии с правилами.[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
        title: '| отсутствует скриншот окна блокировки аккаунта |',
        content:
  "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER] [COLOR=AQUA][ICODE]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },

           {
        title: '| Отсутствуют доказательства|',
        content:
  "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER] [COLOR=AQUA][ICODE]В вашей жалобе отсутствуют необходимые доказательства. Пожалуйста, загрузите их на хостинги, например YouTube, Imgur, Япикс и другие, и прикрепите ссылку для дальнейшего рассмотрения. [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },

 {
        title: '| Жалоба не по форме |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER] [COLOR=AQUA][ICODE]Ваша жалоба составлена не по форме. Ознакомьтесь, пожалуйста, с правилами составления жалобы закрепленные в этом разделе[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
              {
        title: '| Загрузите доказательства на фото - видеохостинги |',
        content:
         "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER] [COLOR=AQUA][ICODE]Для рассмотрения вашей жалобы все доказательства должны быть загружены на доступные хостинги, такие как YouTube, Imgur, Япикс и другие. Просьба предоставлять ссылки, открытые для просмотра [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
           {
        title: '| Дублирование темы |',
        content:
 "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER] [COLOR=AQUA][ICODE]Прекратите дублировать темы. Если вы продолжите, ваш форумный аккаунт будет заблокирован на 3 дня и более[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Закрыто [/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
  {
        title: '| Отсутствует TIME |',
        content:
 "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER] [COLOR=AQUA][ICODE]В вашей жалобе отсутствует необходимая информация — команда /time[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER] [COLOR=AQUA][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Жалоба оффтоп',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ваша тема никак не отностится к разделу жалобы на администрацию.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

    {
        title: 'Наказание за форум',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Игрок написал на вас жалобу, исходя из этой жалобы вам было выдано наказание.[/CENTER]<br><br>" +
        "[CENTER]Проверю верность вредикта куратора форума, ожидайте ответа.[/CENTER]<br><br>" +
        '[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
        prefix: PIN_PREFIX,
        status: true,
    },
  
    {
        title: '| В ЖАЛОБЫ НА ТЕХ СПЕЦИАЛИСТОВ |',
        content:
        "[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратится в раздел Жалобы на технических специалистов[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=AQUA][ICODE] Закрыто.  [/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: true,
        thread: ZB_TECH,
    },
   
 

    {
        title: 'Ошиблись сервером',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: '| НЕКАЧЕСТВЕННЫЕ ДОКАЗАТЕЛЬСТВА',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве[/CENTER]<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

    {
        title: '| Фрапс на ответный дм |',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Доказательства были предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
        "[CENTER]Если Dm и вправду был ответным вы должны предоставить доказательства[/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/CENTER]<br><br>" +
        "[CENTER]Переподайте жалобу с прикреплёнными доказательствами[/CENTER]<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
 
   


    {
        title: 'направить в Технический раздел',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в технический раздел.[/CENTER]<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Более 48 часов',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'отсутствует скриншот выдачи наказания.',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе отсутствует скриншот выдачи наказания.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

 
    {
        title: 'Направить в раздел Обжалование',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалование наказаний.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Снять админа',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Администратор будет снят со своего поста.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Беседа с кф',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]С куратором форума будет проведена беседа, ваша жалоба будет перерассмотрена.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Наказать кф',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Куратор форума будет наказан, ваша жалоба будет перерассмотрена.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Жалоба от 3 лица',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ваша жалоба составлена от 3-го лица.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Жб с редактом',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Доказательства должны быть без обрезок/замазок.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Оскорбительная жалоба',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит.<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Некликабельная ссылка',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ссылка на ваше доказательство не кликабельная, создайте новую тему с нормальной ссылкой.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Не работают доказательства',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ссылка на ваше доказательство не работает, создайте новую тему с нормальной ссылкой.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
  
    {
        title: 'Смена наказания',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ваше наказание будет заменено на другое.[/CENTER]<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Снять наказание',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ваше наказание снято.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Нету ссылки на жб',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Нужно предоставить ссылку на вашу жалобу.<br><br>" +
        "[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
   
    {
        title: 'Подделка докв',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
         {
        title: 'Бан по IP',
        content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/CENTER]<br><br>" +
        "[CENTER]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет.<br><br>" +
        '[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
    {
        title: '----------------------------------------------------------------|Жалобы на игроков|---------------------------------------------------------------',
        content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
title: '| ОСКОРБЛЕНИЕ РОДНИ 7 ДНЕЙ |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки аккаунта на 7 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=GREEN][ICODE] Одобрено  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
         {
title: '| ОСКОРБЛЕНИЕ РОДНИ 15 ДНЕЙ |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки аккаунта на 15 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=GREEN][ICODE] Одобрено  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
         {
title: '| упоминание 120 минут |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки игрового чата на 120 минут [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=GREEN][ICODE] Одобрено  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},

        {
title: '| НОН РП ОБМАН |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было установлено, что игрок нарушил пункт 2.05 общих правил сервера, касающийся нон-РП обмана. В связи с этим, аккаунт игрока будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| СТОРОННЕЕ ПО |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было установлено, что игрок нарушил пункт 2.22 общих правил сервера, связанный с использованием читов. В связи с этим, игрок будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},

];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if(id > 0) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
} else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
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

function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

    if(send == true){
        editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].thread);
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
4 < hours && hours <= 11
? 'Доброе утро'
: 11 < hours && hours <= 15
? 'Добрый день'
: 15 < hours && hours <= 21
? 'Добрый вечер'
: 'Доброй ночи',
};
}

function editThreadData(prefix, pin = false, thread = 0) {
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
    }
    if(pin == true){
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }

    if(thread != 0) {
        moveThread(prefix, thread)
    }

}

function moveThread(prefix, type) {
	// Перемещение темы
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
})();