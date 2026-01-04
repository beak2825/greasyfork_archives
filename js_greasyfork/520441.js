// ==UserScript==
// @name         Кураторы Москвы | by T. Juliuss
// @namespace    https://forum.blackrussia.online
// @version      1.9
// @description  author Timafei_Juliuss
// @author       T. Juliuss
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon  https://i.pinimg.com/474x/27/3e/6b/273e6b82c4744f66ebcd488ffb2a3d63.jpg
// @downloadURL https://update.greasyfork.org/scripts/520441/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D1%8B%20%7C%20by%20T%20Juliuss.user.js
// @updateURL https://update.greasyfork.org/scripts/520441/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D1%8B%20%7C%20by%20T%20Juliuss.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay СИТУАЦИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'РП ситуация одобрено',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#ff0000][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RolePlay ситуацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J01Pp8tF/20240402-135829.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: ODOBRENORP_PREFIX ,
	  status: false,
     },
    {
	  title: 'на доработке Недостаточно информации',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#dc00ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RolePlay ситуацию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][COLOR=#ff9400] НА ДОРАБОТКУ [/COLOR][/CENTER][/B]<br>'+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HkjKMBBv/download-4.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Недостаточно информации в содержании RP ситуации.[/SPOILER][/CENTER]<br>'+
        '[B][CENTER][B][CENTER][COLOR=#fffc00]На доработку дается 24 часа[/COLOR][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
      },
    {
        title: 'Не выполнена просьба',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#a400ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Не выполнены условия.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
	  title: 'Нет отыгровок',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#4600ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RolePlay ситуацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/c1mDrvbG/20240402-135511.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- В  RP ситуации отсутствуют отыгровки.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
	  title: 'Не по форме',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#4600ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RolePlay ситуацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/c1mDrvbG/20240402-135511.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- За неправильное или небрежное оформление, администрация имеет право дать отказ.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
	  title: 'Нет смысла',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#00d5ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RolePlay ситуацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/c1mDrvbG/20240402-135511.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещено выкладывать RP ситуации не имеющие смысловой нагрузки. Например: Находка миллиона долларов на улице.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
	  title: 'nonRP или PG',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#00ffd4][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RolePlay ситуацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/c1mDrvbG/20240402-135511.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- При создании RP ситуации вы должны учитывать физические и духовные параметры персонажей, участвующих в ситуации. Запрещено любое nonRP поведение и PG.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофицал.орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
     },
    {
	  title: 'Неофицальная Орг Одобрено',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#04ff00][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу Неофициальную RP организацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmZfN9wY/download-2.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: ODOBRENOORG_PREFIX,
	  status: false,
     },
    {
        title: 'Уже есть в офиц орг',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#a400ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Данная деятельность уже существует в официальной RP организации.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не выполнена просьба',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#a400ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Не выполнены условия.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
	  title: 'Не полный состав',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#f0ff00][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу Неофициальную RP организацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Для создания своей организации, её лидер должен иметь стартовый состав от 3+ человек, которые уже зарегистрированы на проекте.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix: OTKAZORG_PREFIX,
	  status: false,
     },
    {
	  title: 'Не читабельно',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#ffa700][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу Неофициальную RP организацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Оформление темы должно быть опрятным, если текст будет не читабелен, проверяющий вправе отклонить вашу заявку, переместив её в специальную тему.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix:  OTKAZORG_PREFIX,
	  status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#ff006f][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу Неофициальную RP организацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Название темы должно быть по форме "Название организации" | Дата создания.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix:  OTKAZORG_PREFIX,
	  status: false,
    },
    {
	  title: 'Неактив',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#26cbff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу Неофициальную RP организацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Неактив в топике организации более недели, он закрывается.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix:  OTKAZORG_PREFIX,
	  status: false,
    },
    {
	  title: 'Не по форме',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#fffc00][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу Неофициальную RP организацию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/L8dqdXcY/1621526767066.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimg.cc/fSWNK97q][img]https://i.postimg.cc/90ZQcPD2/IMG-2202.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Неофициальная RP организация составлена не по форме.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
       prefix:  OTKAZORG_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биография.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
	  title: 'РП биография Одобрено',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
        "[CENTER] Доброго времени суток уважаемый [COLOR=#00ffaf][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmZfN9wY/download-2.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
        title: 'Орф и пунктуац ошибки',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#5800ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Орфографические и пунктуационные ошибки[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Био от 1-го лица',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#00fbff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Биография должна быть написана от третьего лица персонажа.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Некоректный Nick Name',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#00fbff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {

        title: 'NonRolePlay NickName',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#ff1a00][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Биография скопирована',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#ff006f][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Биография личности',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#00ff34][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Недостаточно РП информации',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#4ec8ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Недостаточно РП информации[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не по форме био',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#a400ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Биография составлена не по форме.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'PG',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#f0ff00][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещено приписывание своему персонажу супер-способностей.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Заголовок не по форме',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#00ff3e][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. “[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
        {
        title: 'Ник не на русском',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#ff0053][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Пропаганда',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#4f00ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещена пропаганда религиозных или националистических взглядов или высказываний.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Дубликат',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#4f00ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Запрещено создавать более чем одной биографии для одного игрового аккаунта.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не выполнена требования',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#a400ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Не выполнены требования.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не игровые города',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#a400ff][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nrD0rjvm/1.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mgmvZ2BV/image.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7L4Ywt7Z/IMG-20240826-102240-457.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- В биографии используются не игровые города.[/SPOILER][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
        {
        title: 'На доработку детство ',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#00ff89][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][COLOR=#ff9400] НА ДОРАБОТКУ [/COLOR][/CENTER][/B]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HkjKMBBv/download-4.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Недостаточно РП информации в графе "Детство".[/SPOILER][/CENTER]<br>'+
        '[B][CENTER][B][CENTER][COLOR=#fffc00]На доработку дается 24 часа[/COLOR][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: false,
        },
    {
        title: 'На доработку Юность и Взрослая жизнь ',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#878787][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][COLOR=#ff9400] НА ДОРАБОТКУ [/COLOR][/CENTER][/B]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HkjKMBBv/download-4.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Недостаточно РП информации в графе "Юность и взрослая жизнь".[/SPOILER][/CENTER]<br>'+
        '[B][CENTER][B][CENTER][COLOR=#fffc00]На доработку дается 24 часа[/COLOR][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: false,
    },
        {
        title: 'На доработку Настоящее время ',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#ffc3c3][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
            '[B][CENTER][COLOR=#ff9400] НА ДОРАБОТКУ [/COLOR][/CENTER][/B]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HkjKMBBv/download-4.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Недостаточно РП информации в графе "Настоящее время".[/SPOILER][/CENTER]<br>'+
        '[B][CENTER][B][CENTER][COLOR=#fffc00]На доработку дается 24 часа[/COLOR][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: NARASSMOTRENIIORG_PREFIX,
      status: false,
        },
          {
        title: 'На доработку возраст ',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FHzbvKH3/2.png[/img][/url]<br>'+
		"[CENTER] Доброго времени суток уважаемый [COLOR=#00ff89][ICODE]{{ user.name }}[/ICODE][/COLOR] проверив вашу RP биографию, выношу вердикт:[/CENTER]<br><br>"+
        '[B][CENTER][COLOR=#ff9400] НА ДОРАБОТКУ [/COLOR][/CENTER][/B]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HkjKMBBv/download-4.gif[/img][/url]<br>'+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Sm0HVb/RLwzo.png[/img][/url]<br>'+
        '[B][CENTER][SPOILER]- Возраст не совподает с датой рождения.[/SPOILER][/CENTER]<br>'+
        '[B][CENTER][B][CENTER][COLOR=#fffc00]На доработку дается 24 часа[/COLOR][/CENTER]<br>'+
        "[CENTER][COLOR=#FFFFFF]Приятной игры на проекте[/COLOR] [B][COLOR=#000000]Black[/COLOR] [COLOR=#ff0000]Russia[/COLOR][/B][/CENTER]<br><br>",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: false,
        },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('На рассмотрение', 'pin');
    addButton('Закрыто', 'Zakrito');
    addButton('Вердикты', 'selectAnswer');

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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-11-21
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();