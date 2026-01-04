// ==UserScript==
// @name         Black 10 Script by J.Murphy (PINK)
// @namespace    https://forum.blackrussia.online/
// @version      3.1.6
// @description  Скрипт для Руководства сервера by J.Murphy
// @author       Куратор администрации Joseph Murphy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/532576/Black%2010%20Script%20by%20JMurphy%20%28PINK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532576/Black%2010%20Script%20by%20JMurphy%20%28PINK%29.meta.js
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
        title: '----------------------------------------------------------| Жалобы на администратора |---------------------------------------------------------',
        content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
        title: '| Запрос доказательств |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=pink][ICODE] Запрошу у администратора все необходимые доказательства и предоставлю вам ответ, как только получу информацию.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER] [COLOR=pink][ICODE] Ожидайте ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=pink][ICODE] Приятной игры на нашем сервере  [/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
        title: '| Взято на рассмотрение |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
          "[CENTER][COLOR=pink][ICODE] Ваше жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа в ближайшее время. Мы просим воздержаться от создания дубликатов данной темы. Благодарим за понимание.[/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE]Ожидайте ответа[/ICODE][/COLOR][/CENTER]<br><br>"+
          '[CENTER] [COLOR=pink][ICODE] Приятной игры на нашем сервере  [/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
        title: '| Администратор прав |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Администратор предоставил все необходимые доказательства, подтверждающие правомерность решения. На основании представленных материалов наказание было назначено верно и в соответствии с правилами.[/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
        title: '| НАрушений от администратора нет |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE]По итогам рассмотрения вашей жалобы нарушений со стороны администратора не выявлено. Действия администратора соответствуют установленным правилам и регламенту сервера.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: '| Меры к администратору |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE] После тщательной проверки поданной жалобы в отношении администратора будут приняты меры. Благодарим вас за информацию. [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
        title: '| Меры к администратору и снятие наказания |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] После тщательного рассмотрения вашей жалобы было принято решение о применении строгих мер в отношении администратора. Ваше наказание будет снято. Благодарим вас за предоставленную информацию [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

         {
        title: '| Меры к куратору форума |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE] К куратору форума будут приняты меры. Благодарим вас за информацию [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
          {
        title: '| Меры к куратору форума и снятие наказаний |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE] В отношении куратора форума будут приняты строгие меры, и ваше наказание будет снято. Благодарим за ваше обращение![/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

          {
        title: '| Ответ в прошлой жалобе |',
        content:
      "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Ответ на вашу жалобу уже был дан в предыдущей теме. Пожалуйста, ознакомьтесь с ним там.[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
       '[CENTER] [COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
            {
        title: '| Недостаточно доказательств |',
        content:
      "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE] В вашей жалобе недостаточно доказательств для ее рассмотрения. Пожалуйста, предоставьте дополнительные сведения, такие как скриншоты, видеодоказательства и тд.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
       '[CENTER] [COLOR=RED][ICODE] Отказано[/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
        title: '| Передано ЗГА |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Ваша жалоба передана на рассмотрение Заместителю Главного Администратора. Он детально изучит ситуацию и примет соответствующее решение. Пожалуйста, ожидайте его ответа. [/ICODE][/COLOR][/CENTER]<br><br>"+
         '[CENTER] [COLOR=pink][ICODE] Приятной игры на нашем сервере[/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
        title: '| Передано ГА |',
        content:
          "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Ваша жалоба передана на рассмотрение Главному Администратору. Он тщательно изучит все детали и примет взвешенное решение. Пожалуйста, ожидайте его ответа. [/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=pink][ICODE]  Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: GA_PREFIX,
        status: true,
    },
              {
        title: '| Передано ЗГА | ГА |',
        content:
  "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Ваша жалоба передана на рассмотрение Главному Администратору и Заместителю Главного Администратора. Один из них тщательно изучит все обстоятельства и примет решение в соответствии с правилами. Пожалуйста, ожидайте их ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
         '[CENTER] [COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
    },
        {
        title: '| Передано СА |',
        content:
         "[CENTER][COLOR=YELLOW][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=YELLOW][ICODE]Ваша жалоба передана на рассмотрение Специальной Администрации. Один из ее представителей тщательно изучит все обстоятельства и примет решение[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=YELLOW][ICODE]Ответ может занять более 48 часов. [/ICODE][/COLOR][/CENTER]<br><br>"+
         '[CENTER] [COLOR=YELLOW][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: SPEC_PREFIX,
        status: true,
    },
           {
        title: '| КФ прав |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE]После проверки жалобы, поданной на вас другим игроком, было принято решение, что куратор форума вынес наказание справедливо и в соответствии с правилами[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
     {
        title: '| ОТСУТСТВУЕТ ОКНО БЛОКИРОВКИ АККАУНТА|',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE]В вашей жалобе отсутствует скриншот окна блокировки аккаунта[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },

           {
        title: '| Отсутствуют доказательства|',
        content:
   "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE]В вашей жалобе отсутствуют необходимые доказательства. Пожалуйста, загрузите их на хостинги, например YouTube, Imgur, Япикс и другие, и прикрепите ссылку для дальнейшего рассмотрения. [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },

 {
        title: '| Жалоба не по форме |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE]Ваша жалоба составлена не по форме. Ознакомьтесь, пожалуйста, с правилами составления жалобы закрепленные в этом разделе[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано [/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
              {
        title: '| Загрузите доказательства на фото - видеохостинги |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Для рассмотрения вашей жалобы все доказательства должны быть загружены на доступные хостинги, такие как YouTube, Imgur, Япикс и другие. Просьба предоставлять ссылки, открытые для просмотра [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
            {
        title: '| ДУБЛИРОВАНИЕ ТЕМ|',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Прекратите дублировать темы. Если вы продолжите, ваш форумный аккаунт будет заблокирован на 3 дня и более [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
  {
        title: '| Отсутствует TIME |',
        content:
  "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER][COLOR=pink][ICODE]В вашей жалобе отсутствует необходимая информация — команда /time[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR] [/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
           {
        title: '| ОШИБКА СЕРВЕРОМ |',
        content:
   "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE]Вы ошиблись сервером. Пожалуйста, подайте жалобу в нужном разделе вашего сервера [/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
             {
        title: '| НЕКАЧЕСТВЕННЫЕ ДОКАЗАТЕЛЬСТВА|',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Ваши доказательства предоставлены в плохом качестве. Пожалуйста, пересоздайте жалобу и загрузите материалы в более высоком качестве для корректного рассмотрения. [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
                 {
        title: '| ОФФТОП |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Ваша тема не относится к разделу Жалобы на администрацию. Пожалуйста, разместите свой вопрос или жалобу в соответствующем разделе для правильного рассмотрения.[/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
        {
        title: '| ПЕРЕМЕЩЕНО В ЖАЛОБЫ НА ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратится в раздел Жалобы на технических специалистов[/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: WAIT_PREFIX,
        status: false,
        thread: ZB_TECH,
    },
           {
        title: '| ПЕРЕМЕЩЕНО В ТЕХНИЧЕСКИЙ РАЗДЕЛ |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Ваша жалоба была перемещена в технический раздел нашего сервера для дальнейшего рассмотрения и решения.[/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]На рассмотрении [/ICODE][/COLOR] [/CENTER]',
        prefix: WAIT_PREFIX,
        status: false,
        thread: TECH,
    },
           {
        title: '| ОБРАТИТЕСЬ В ТЕХНИЧЕСКИЙ РАЗДЕЛ |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Для рассмотрения вашей жалобы, пожалуйста, обратитесь в технический раздел [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,

    },
                {
        title: '| ОБРАТИТЕСЬ В ЖАЛОБЫ НА ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ|',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Для рассмотрения вашей жалобы, пожалуйста, обратитесь в раздел Жалобы на технических специалистов [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
 {
        title: '| ФРАПС ОТВЕТНЫЙ ДМ |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Доказательства были предоставлены администратором, и наказание было вынесено верно. Если вы утверждаете, что DM был ответными, пожалуйста, предоставьте соответствующие доказательства, чтобы мы могли пересмотреть решение.[/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

  {
        title: '| ПРОШЛО БОЛЕЕ 48 ЧАСОВ |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Ваша жалоба отклонена, так как с момента выдачи наказания прошло 48 часов [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
{
        title: '| Отсутствует скриншот выдачи наказаний |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] В вашей жалобе отсутствует скриншот выдачи наказания. Пожалуйста, прикрепите необходимые доказательства для дальнейшего рассмотрения [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
  {
        title: '| НАПРАВИТЬ В РАЗДЕЛ ОБЖАЛОВАНИЕ |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
      "[CENTER][COLOR=pink][ICODE] Вы ошиблись разделом, подайте обжалование в раздел Обжалование наказаний [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE] Закрыто [/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

   {
        title: '| ОБЖАЛОВАНИЕ ПЕРЕМЕЩЕНО |',
        content:
        "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE] Ваше обжалование перемещено в раздел Обжалование наказаний. Ожидайте ответа. [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix:  WAIT_PREFIX,
        status: false,
         thread: OBJ,
    },
     {
        title: '| Жалоба от 3-его лица |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Ваша жалоба отклонена, так как она составлена от третьего лица. Жалобы принимаются только от непосредственного участника ситуации[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },


    {
        title: '| Доказательства отредактированы |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Предоставленные доказательства были изменены, поэтому ваша жалоба отклонена. Прикрепите исходное видео для повторного рассмотрения.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
   {
        title: '| В жалобе нецензурные и оскорбительные слова|',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Ваша жалоба отклонена, так как в ней содержатся оскорбительные и нецензурные выражения. Пожалуйста, оформите жалобу корректно, соблюдая правила общения.[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
   {
        title: '| Доказательства не открываются |',
        content:
         "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=pink][ICODE]Ваша жалоба отклонена, так как предоставленные доказательства не открываются. Пожалуйста, загрузите их повторно в доступном формате[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

 {
        title: '| Смена наказания |',
        content:
  "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER][COLOR=pink][ICODE]Ваше наказание будет заменено на другое[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

 {
        title: '| Отсутствует ссылка |',
        content:
  "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER][COLOR=pink][ICODE]Предоставьте ссылку на вашу жалобу для дальнейшего рассмотрения[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },

 {
        title: '| Подделка доказательств |',
        content:
  "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
     "[CENTER][COLOR=pink][ICODE]Ваша жалоба отклонена, так как доказательства были подделаны. Ваш форумный аккаунт будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
        "[CENTER][COLOR=pink][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
    '[CENTER] [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR] [/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
        title: '| Бан по IP |',
        content:
     "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/ICODE][/COLOR][/CENTER]<br><br>"+
         "[CENTER][COLOR=pink][ICODE]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет[/ICODE][/COLOR][/CENTER]<br><br>"+
        '[CENTER] [COLOR=RED][ICODE]Приятной игры на нашем сервере.[/ICODE][/COLOR] [/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
    {
        title: '----------------------------------------------------------------| Обжалование |---------------------------------------------------------------',
        content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
        {

	  title: '| Одобрить |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше обжалование одобрено и ваше наказание будет полностью снято [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},
    {

	  title: '| Отказать |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]В обжаловании отказано  [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {

	  title: '| Игрок вернул ущерб |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},
        {

	  title: '| Снизить наказание до минимальных мер |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше наказание будет снижено до минимальных мер [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},
        {

	  title: '| Снизить до 30 дней |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше наказание будет снижено до 30 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},

  {

	  title: '| Снизить до 15 дней |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше наказание будет снижено до 15 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},
        {

	  title: '| Снизить до 7 дней |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше наказание будет снижено до 7 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},
{

	  title: '| Обжалованию не подлежит |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE] Данное наказание не подлежит обжалованию [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| грубое нарушение |',
	  content:
  "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
	"[CENTER][COLOR=pink][ICODE]В обжаловании отказано. Так как ваше наказание было слишком грубым. (Например: большое количество нарушенных правил сервреа, грубое нарушение с вашей стороны и т.д.)[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Отказано,закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

    {
	  title: '| Обжалование нонрп обман |',
	  content:
	"[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
			"[CENTER][COLOR=pink][ICODE]Если вы хотите хотите обжаловать наказание за НонРП обман вы должны сами связаться с человеком, которого обманули,После чего он должен написать на вас обжалование прикрепив доказательства договора о возврате имущества,ссылку на жалобу которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон,По другому вы никак не сможете обжаловать наказание за НонРП обман [/ICODE][/COLOR][/CENTER]<br><br>"+
	  		'[CENTER][COLOR=RED][ICODE]Отказано, закрыто.[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Обжалование ник |',
	  content:
"[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваш аккаунт будет разблокирован ровно на 24 часа, если в течении 24 часа вы не смените свой никнейм, то вы будете заново заблокированы, для смены ника используйте /mm 10, доказательство прикрепить сюда.[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Ожидаю вашего ответа[/ICODE][/COLOR] [/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: '| Запрос ссылки вк |',
	  content:
		"[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Прикрепите ссылку на ваш Вконтакте.[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][Color=RED] [ICODE] Ожидаю вашего ответа.[/ICODE][/COLOR] [/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Обжалование ппв |',
	  content:
		"[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][Color=pink] [ICODE] Восстановите пароль через группу в ВК и пересоздайте жалобу. Также приложите скриншот из ВК, что вы изменили пароль, но не забудьте замазать сам пароль.[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {

	  title: '| Не осознали вину |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE] В обжалование отказано, в данный момент мы не уверены что вы осознали свой поступок [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
          {

	  title: '| Не готовы пойти на встречу |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE] В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},


    {

	  title: '| Отстутствуют доказательства |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE] В вашем обжаловании отсутствуют доказательства[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{

	  title: '| Отписал не тот игрок|',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE] Вам в профиле написал не тот игрок которого вы обманули[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{

	  title: '| Отстутствует скрин окна бана |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]В вашем обжаловании отсутствует скриншот окна блокировки аккаунта[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{

	  title: '| Дублирование тем |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Если вы дальше будете дублировать темы в данном разделе, то ваш форумный аккаунт будет заблокирован[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

  {

	  title: '| Дублирование тем |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваши доказательства подделаны, форумный аккаунт будет заблокирован[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {

	  title: '| Уже есть мин. наказание |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Вам итак выдано минимальное наказание за нарушение[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

	{
	  title: 'Обжалование не по форме',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR].<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {

	  title: '| Направить в раздел жб на адм |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обраться в раздел жалоб на администрацию[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
   {

	  title: '| Доказательство в соц сети|',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur)[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {

	  title: '| Ошиблись сервером |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Вы ошиблись сервером. Подайте обжалование в разделе своего форума[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {

	  title: '| NRP обман 24 часа |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Аккаунт будет разблокирован. если в течении 24-ех часов ущерб не будет возмещён владельцу согласно вашей договоренности акканут будет заблокирован навсегда[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Вы должны прислать видео доказательство возврата имущества в данную тему[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {

	  title: '| Игрок вернул ущерб |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет [/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR] [/CENTER]',
	  prefix:  ACCEPT_PREFIX,
	  status: false,
	},
     {

	  title: '| Мут/джаил |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше наказание не столь строгое для обжалования.[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {

	  title: '| оффтоп |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваша тема никак не отностится к разделу обжалования наказаний[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR] [/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {

	  title: '| Передать ГА |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше обжалование передано Главному администратору[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=YELLOW][ICODE]Ожидайте ответа[/ICODE][/COLOR] [/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {

	  title: '| Передать CА |',
	  content:
		 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		"[CENTER][COLOR=pink][ICODE]Ваше обжалование передано Специальной администрации[/ICODE][/COLOR][/CENTER]<br><br>"+
		'[CENTER][COLOR=YELLOW][ICODE]Ожидайте ответа[/ICODE][/COLOR] [/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
	},

         {
        title: '----------------------------------------------------------------|Жалобы на игроков|---------------------------------------------------------------',
        content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
title: '| ОСКОРБЛЕНИЕ РОДНИ 7 ДНЕЙ |',
content:
 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
 "[CENTER][COLOR=pink][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки аккаунта на 7 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
 "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=GREEN][ICODE] Одобрено  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
 {
title: '| ОСКОРБЛЕНИЕ РОДНИ 15 ДНЕЙ |',
content:
 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
 "[CENTER][COLOR=pink][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки аккаунта на 15 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
 "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=GREEN][ICODE] Одобрено  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
          {
title: '| УПОМИНАНИЕ РОДНИ 120 МУТ |',
content:
 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
 "[CENTER][COLOR=pink][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки игрового чата на 120 минут [/ICODE][/COLOR][/CENTER]<br><br>"+
 "[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=GREEN][ICODE] Одобрено  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},

        {
title: '| НОН РП ОБМАН |',
content:
 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER][COLOR=pink][ICODE] После проверки вашей жалобы было установлено, что игрок нарушил пункт 2.05 общих правил сервера, касающийся нон-РП обмана. В связи с этим, аккаунт игрока будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=GREEN][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| СТОРОННЕЕ ПО |',
content:
 "[CENTER][COLOR=pink][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER][COLOR=pink][ICODE] После проверки вашей жалобы было установлено, что игрок нарушил пункт 2.22 общих правил сервера, связанный с использованием читов. В связи с этим, игрок будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER][COLOR=GREEN][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=pink][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
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