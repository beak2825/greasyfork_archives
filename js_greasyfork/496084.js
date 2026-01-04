// ==UserScript==
// @name         BLACK RUSSIA || Скрипт для Руководства Сервера
// @namespace    https://forum.blackrussia.online
// @version      1.0.5
// @description  Специально для BlackRussia
// @author       A. Flyweather
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/496084/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/496084/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста, не создавайте дубликатов. Ожидайте ответа.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: true,
	},
        {
      title: 'У администратора было запрошено опровержение ',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]У администратора были запрошены доказательства на выданное наказании, ожидайте ответа.[SIZE=4]<br><br>"+
	'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: true,
	},
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Будет проведена беседа с админом',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена, с администратором будет проведена беседа по данному случаю.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена работа с админом',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена, с администратором будет проведена необходимая работа по данному случаю.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отсутствуют доказательства о нарушении администратора',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствуют доказательства о нарушении администратора.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Проверив опровержение администратора наказание было выдано верно ',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор, выдавший наказание, предоставил опровержение на ваше нарушение. Наказание, выданное Вам, было выдано верно.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Жалоба от 3-его лица',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=red]3.3.[/COLOR][COLOR=lavender]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[SIZE=4]<br><br>"+
	'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
            {
      title: 'Доказательства предоставлены не в первоначальном виде',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=red]3.7.[/COLOR][COLOR=lavender]Доказательства должны быть в первоначальном виде.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 1. Ваш Nick_Name [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 2.Nick_Name администратора<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 3.Дата выдачи/получения наказания:<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 4.Суть жалобы:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 5.Доказательство: <br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: '48 часов написания жалобы',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=red]3.1.[/COLOR][COLOR=lavender]Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Нету /time',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В предоставленных доказательствах отсутствует /time.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Признался в нарушении',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вы сами признались в своём нарушении.[SIZE=4]<br><br>"+
'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Смените IP',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Смените IP адрес, перезагрузив телефон / роутер.[SIZE=4] <br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
     {
      title: 'Вам в обжалования',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вам в раздел для обжалования наказаний.[SIZE=4] <br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
     {
      title: 'Подобная жалоба (ответ не был дан)',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы, ожидайте ответа в подобной жалобе. [SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней. <br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Подобная жалоба (ответ был дан)',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы,  ответ был дан в подобной жалобе. <br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней.[SIZE=4] <br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
             },
        {
      title: 'Жалоба в неадекватном формате',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба составлена в неадекватном формате, в подобном виде она рассмотрена не будет.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
         },
    {
      title: 'обж отказано',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В обжаловании вашего наказания отказано.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
        },
    {
      title: 'обж ЧСС отказано',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]На данный момент мы не готовы обжаловать ваш ЧС сервера, попробуйте подать повторную заявку на обжалование через некоторое время.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
             },
    {
      title: 'обж не подлежит',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Данное нарушение является слишком серьезным и не подлежит дальнейшему обжалованию.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'обж одобрено',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование одобрено, наказание будет снято, впредь не совершайте подобных ошибок.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
         },
    {
      title: 'обж ЧСС одобрено',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваш ЧС сервера будет снят, в обжаловании одобрено. [SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
        },
    {
      title: 'Наказание будет снижено',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше наказание будет снижено, впредь не совершайте подобных ошибок. <br><br>"+
		 '[B][CENTER][COLOR=#00FF00][ICODE]Решено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: RESHENO_PREFIX,
	  status: false,
         },
    {
      title: 'Обжалование на рассмотрении',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на рассмотрение, ожидайте ответа и не создавайте тем-дубликатов.[SIZE=4]<br><br>"+
	'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: true,
        },
    {
      title: 'Обж передано ГА',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша обжалование передано на рассмотрение [COLOR=red]Главному администратору[/COLOR], ожидайте ответа.[SIZE=4]<br><br>'+
'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Не по форме',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование составлено не по форме.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Смените IP адрес',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Смените IP адрес, перезагрузив роутер или телефон.[SIZE=4]<br><br>"+
		 '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Обжаловать nRp obman',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если вы хотите хотите обжаловать наказание за НонРП обман, Вы должны сами связаться с человеком, которого обманули.<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]После чего он должен написать на вас обжалование, прикрепив доказательства договора о возврате имущества, ссылку на жалобу, которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон.<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]По-другому Вы никак не сможете обжаловать наказание за НонРП обман.<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Возврат производится без моральной компенсации.<br><br>"+
		 '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Возврат имущества',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Аккаунт будет разблокирован на 24 часа, в течении этого времени, вы должны вернуть имущество игроку по договоренности , и прикрепить видеофиксацию сделки в данную тему. При отсутствии фрапса аккаунт будет заблокирован без возможности повторного обжалования. [SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: 123,
         },
    {
      title: 'Прикрепите ссылку на VK',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Прикрепите ниже ссылку на вашу страницу VK.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: 123,
    },
    {
      title: 'Смена Ника',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа для смены NickName.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'В жалобы на адм',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если Вы не согласны с выданным наказанием, то обратитесь в раздел «Жалобы на администрацию». [SIZE=4]<br><br>"+
		 '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Отсутствует ссылка на наказание',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Отсутствует ссылка на выданное Вам наказание.<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
         },
    {
      title: 'Ссылка на док-ва не работает',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ссылка на доказательства нерабочая или же не открывается, загрузите ваши доказательства на другой фото- / видеохостинг.<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
         },
    {
      title: 'Наказание от тех. специалиста',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вам было выдано наказание Техническим специалистом, Вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3002/']*Тык*[/URL]<br><br>"+
	'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
        prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Ошиблись сервером',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вы ошиблись сервером, переношу вашу тему в нужный раздел.<br><br>",
        status: 101,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'Вам в жалобы на игроков',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Обратитесь в раздел жалоб на игроков.[SIZE=4] <br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Главному администратору[/COLOR], ожидайте ответа.[SIZE=4]<br><br>'+
'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Передано ЗГА',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Зам. Главного администратора[/COLOR], ожидайте ответа.[SIZE=4]<br><br>'+
'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	    prefix: PINN_PREFIX,
        status: true,
    },
    {
      title: 'Передано Специальному администратору',
      content:
		"[B][CENTER][FONT=times new roman][COLOR=#DC143C]Приветствую вас, уважаемый (-ая) {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Специальной администрации[/COLOR], ожидайте ответа.[SIZE=4]<br><br>'+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Важно', 'Vajno');
    addButton('Команде Проекта', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Реализовано', 'Realizovano');
    addButton('Рассмотрено', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
  $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
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
 
    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
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
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 101){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
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