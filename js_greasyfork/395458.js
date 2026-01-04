// ==UserScript==
// @name         Доп меню Полезные ссылки
// @version      0.4.4
// @description  ///
// @author       Yandex
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk*
// @include      https://taximeter-admin.taxi.yandex-team.ru/invite*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkb*
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=sts
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=identity
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/395458/%D0%94%D0%BE%D0%BF%20%D0%BC%D0%B5%D0%BD%D1%8E%20%D0%9F%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/395458/%D0%94%D0%BE%D0%BF%20%D0%BC%D0%B5%D0%BD%D1%8E%20%D0%9F%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8.meta.js
// ==/UserScript==

const navBar = document.querySelector('.nav'),
      newList = document.createElement('li'),
      menuList = document.createElement('ul')

/*navBar.childNodes[1].remove()
navBar.childNodes[2].remove()
navBar.childNodes[3].remove()
navBar.childNodes[5].remove()
navBar.childNodes[7].remove()*/

navBar.append(newList)
const list = `
<li><a href="" target="_blank" id="dkk-dropright">ДКК<span style = "float: right">▶</span></a></li>
<li><a href="" target="_blank" id="dkvu-dropright">ДКВУ<span style = "float: right">▶</span></a></li>
<li><a href="" target="_blank" id="sts-dropright">СТС<span style = "float: right">▶</span></a></li>
<li><a href="" target="_blank" id="dkb-dropright">ДКБ<span style = "float: right">▶</span></a></li>
<li><a href="" target="_blank" id="dkp-dropright">ДКП<span style = "float: right">▶</span></a></li>
<li><a href="" target="_blank" id="bio-dropright">Биометрия<span style = "float: right">▶</span></a></li>
`
newList.className = 'dropdown'
newList.innerHTML = `
<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">Полезные ссылки<span class="caret"></span></a>
<ul class="dropdown-menu">
${list}
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/1CqAV47t4APx-qKv310w4TKYJfU9Ki7zUClHWougfvQ0" target="_blank">🏋️‍Кто? Где? Когда?</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1UHhY-6axL1TPqpHrB29_qC-eIt2jt2iCbVarpNzVXQ4/edit#gid=2023740064" target="_blank">🏋️‍Кто? Где? Когда? АНТИФРОД</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/1OD0EUxIzN2e9bcIIy3s2ZhGHAKeqlunGIS3X4Du2V50/edit#gid=2000876873" target="_blank">🚴‍График группы</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1UHhY-6axL1TPqpHrB29_qC-eIt2jt2iCbVarpNzVXQ4/edit#gid=2023740064" target="_blank">🚴‍График группы АНТИФРОД</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Dobro-pozhalovat-v-komandu-DK-JaT/" target="_blank">🎉Команда Я.Такси</a></li>
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/" target="_blank">🎉Команда Я.Такси АНТИФРОД</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://wiki.yandex-team.ru/HR/KadrovyjjUchet/Otpusk/#raspredelenieotpuskapovyxodnymdnjam" target="_blank">✈️Как пойти в отпуск</a></li>
<li><a href="https://forms.yandex-team.ru/surveys/20940/" target="_blank">📋Форма оформления отпуска</a></li>
<li><a href="https://forms.yandex-team.ru/surveys/21689/" target="_blank">📋Форма монетизации отпуска</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://wiki.yandex-team.ru/HR/Spravka/" target="_blank">📬Заказ справок(2НДФЛ и пр.)</a></li>
<li><a href="https://mail.yandex-team.ru/" target="_blank">💌Я.team Почта</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Ustanovka-rasshirenijj/" target="_blank">🚀Установка скриптов</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/index.html" target="_blank">🔐Иструкции по установке</a></li>
<li><a href="https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/change-password-outstaff.html" target="_blank">🔐Смена пароля Ниагара</a></li>
<li><a href="https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/vpn-rutoken.html" target="_blank">🔐Установка Рутокен</a></li>
<li><a href="https://cache-mskm910.cdn.yandex.net/download.yandex.ru/wiki/EXT/catalinavpnrutoken.htm" target="_blank">🔐Установка Рутокен: MacOS Catalina</a></li>
</ul>`

navBar.append(menuList)
menuList.className = 'dropdown-menu'

const dkk = `
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/newpajaDKK/" target="_blank">ДКК.📜Инструкция</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1be3SlWKLG3bJvaqVa05W5nfb9lpWQm39VPwWK3S11fY/edit#gid=0" target="_blank">ДКК.🚘Стороннее брендирование</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/105n_r5-vZNYPEnj6aZN6hlaPDhtCyjcIFqJekns-jns/edit#gid=1434986116" target="_blank">ДКК.📝Шаблоны</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1gmzDLI9Wpz_0THrukfRSEP-90JQBZkNkAIlpckZd2u4/edit#gid=588237143" target="_blank">ДКК.📝Шаблоны МО</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report" target="_blank">ДКК.🧐Статфэйс</a></li>
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Rezultaty-moderacijj-gruppy-DK/#gruppadkk" target="_blank">ДКК.🔮Модерация</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/1iDSP4fP3A1TB8vEZcUGrbNZktW6PzfhIt6g7VAGq8pw/edit#gid=4147072" target="_blank">ДКК.🤨Оспорь модератора</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1WUn-rB98h4B5APj4m5GmYXwX6-BmB4K8J7lxNKD7bVg/edit?userstoinvite=kristina.strom1991@gmail.com&ts=5d8b67c0#gid=0" target="_blank">ДКК.🤨Оспорь модератора МО</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/1Iv9Vif-rT43mfErUprxev-0P84JW0mIoi54Uo2667y0/edit#gid=643648608" target="_blank">ДКК.🚧Сводная</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1lJcxEMXXLUIWX-vRU87q4fHK-393XFs7agFdWtUtf7s/edit#gid=1954777152" target="_blank">ДКК.🚧Сводная МО</a></li>
<li role="separator" class="divider"></li>
<li role="separator" class="divider"></li>
<li><a href="tg://resolve?domain=kigoshina">ДКК.✉️Игошина Ксения</a></li>`,
      dkvu = `
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/ocheredi/%D0%A0%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D0%94%D0%9A%D0%92%D0%A3/" target="_blank">ДКВУ.📜Инструкция</a></li>
<li><a href="https://wiki.yandex-team.ru/Quality/%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%B0-%D0%B4%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8F-%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0-%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81.%D0%A2%D0%B0%D0%BA%D1%81%D0%B8/%D0%AD%D0%BD%D1%86%D0%B8%D0%BA%D0%BB%D0%BE%D0%BF%D0%B5%D0%B4%D0%B8%D1%8F-%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D1%85-%D1%83%D0%B4%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D0%B5%D1%80%D0%B5%D0%BD%D0%B8%D0%B9/" target="_blank">ДКВУ.🔖Энциклопедия ВУ</a></li>
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/u/" target="_blank">ДКВУ.🗑️Поддельные ВУ</a></li>
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/BUXAREST/" target="_blank">ДКВУ.💎Бухарест</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/1fOELnScMSthfDX_8jfUiFOed-VsWfi2XKf3fvWRpack/edit?pli=1#gid=488560279" target="_blank">ДКВУ.📝Шаблоны</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1fOELnScMSthfDX_8jfUiFOed-VsWfi2XKf3fvWRpack/edit?pli=1#gid=1873057603" target="_blank">ДКВУ.📝Шаблоны Бухареста</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=DKVU&qc_type=_total_&qc_type=dkvu_block&qc_type=dkvu_invite&qc_type=dkvu_regular&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&_period_distance=1" target="_blank">ДКВУ.🧐Статфэйс</a></li>
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/moderacija/" target="_blank">ДКВУ.🔮Модерация</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1RrjEs8oV0nu0gwvMCsgNxUeHMtkVth8xzPRl2VqCVgE/edit#gid=0" target="_blank">ДКВУ.🤨Оспорь модератора</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://docs.google.com/spreadsheets/d/1axLBjr_5sWMqvN7meanTprxHfzjo7o-65sdPP6CpxpY/edit#gid=0" target="_blank">ДКВУ.🍔🚽🛏️График обедов</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1HQKsqE2JNo0n-5p3lgb2-bfJDgBVbNWA-uhtxhImRwI/edit#gid=0" target="_blank">ДКВУ.🛡️Таблица "Стаж"</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1vvFUumbEziG8vG02yYK6Byq3SRPAAJOnEAXPhrMHpJ4/edit#gid=1444237713" target="_blank">ДКВУ.🔧Подработка</a></li>
<li role="separator" class="divider"></li>
<li><a href="tg://resolve?domain=rozaliyaja">ДКВУ.✉️Атласова Роза</a></li>
<li><a href="tg://resolve?domain=CheckDriverExpBot">ДКВУ.⚙️Бот для проверки стажа</a></li>`,
      //<li><a href="tg://resolve?domain=@Romanova_Dariya">ДКБ.✉️Дарья Романова</a></li>
      sts = `
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/STS/" target="_blank">СТС.📜Инструкция</a></li>
<li><a href="https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=sts&qc_type=sts_block&qc_type=sts_city&qc_type=sts_city_level&qc_type=sts_country&qc_type=sts_invite&qc_type=sts_regular&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&sort_field=assessor_login&sort_reverse=&_period_distance=1" target="_blank">СТС.🧐Статфэйс</a></li>
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/moderacija/#gruppasts" target="_blank">СТС.🔮Модерация</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1Xr-tQBTUQ0Y5Jx6C3dD1ozmU3_IIPs6szqZuUO_oZyQ/" target="_blank">СТС.🤨Оспорь модератора</a></li>
<li><a href="https://b2b.avtocod.ru/login" target="_blank">СТС.🚧Автокод В2В</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1SmHti5jlsQ77vFpDR8skZPU-B-5EAy_QecKicVciLmg/edit#gid=0" target="_blank">СТС.🚀Установка скриптов</a></li>
<li role="separator" class="divider"></li>
<li><a href="tg://resolve?domain=Nayatsoy">СТС.✉️Анастасия Цой</a></li>`,
      dkb = `
<li><a href="https://wiki.yandex-team.ru/quality/gruppa-distancionnogo-kontrolja-kachestva-jandeks.taksi/dkb-2.0/proverka-stikerov/" target="_blank">ДКБ.📜Инструкция</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1CODtCRbptFqangR65boN3Hed7KVImWlVyCjsE5J3Ow0/edit?pli=1#gid=135251859" target="_blank">ДКБ.📝Шаблоны</a></li>
<li><a href="https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=DKB+booster&qc_type=DKB+chair&qc_type=branding&qc_type=branding_country&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&sort_field=qc_ids&sort_reverse=1&ncrnd=7571&_period_distance=1" target="_blank">ДКБ.🧐Статфэйс</a></li>
<li><a href="https://wiki.yandex-team.ru/Quality/Gruppa-distancionnogo-kontrolja-kachestva-Jandeks.Taksi/Rezultaty-moderacijj-gruppy-DK/#gruppadkb" target="_blank">ДКБ.🔮Модерация</a></li>
<li role="separator" class="divider"></li>
<li><a href="tg://resolve?domain=@Romanova_Dariya">ДКБ.✉️Дарья Романова</a></li>`,
      dkp = `
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/ocheredi/dkp/" target="_blank">ДКП.📜Инструкция</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/1pDKj4AVsRBCWjjQuPVclC4AR_sOR_s35KhjPdsqPuw4/edit#gid=526847230" target="_blank">ДКП.📝Шаблоны</a></li>
<li><a href="https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=_in_table_&qc_type=identity&qc_type=identity_block&qc_type=identity_country&assessor_login=_in_table_&resolution=_total_&city=_total_&_incl_fields=qc_ids&sort_field=assessor_login&sort_reverse" target="_blank">ДКП.🧐Статфэйс</a></li>
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/moderacija/" target="_blank">ДКП.🔮Модерация</a></li>
<li><a href="https://docs.google.com/spreadsheets/d/16HD_c-suVbXhnLh1bhyQdTTxoYfZibtxY4uDk-YLY8U/edit#gid=0" target="_blank">ДКП.🤨Оспорь модератора</a></li>
<li role="separator" class="divider"></li>
<li><a href="tg://resolve?domain=RoyalS94">ДКП.✉️Мария Ву</a></li>`,
      bio = `
<li><a href="https://wiki.yandex-team.ru/taxisecurity/podgruppa-distancionnogo-kontrolja-dokumentov/ocheredi/biometrija/" target="_blank">Биометрия.📜Инструкция</a></li>
<li role="separator" class="divider"></li>
<li><a href="https://yang.yandex-team.ru/signup" target="_blank">Янг.🚀Регистрация в Янге</a></li>
<li><a href="https://yang.yandex-team.ru/tasks" target="_blank">Янг.⚙️Таски</a></li>
`

function dropMenu(el, depart) {
    let positionDropright = el.getBoundingClientRect(),
        positionList = newList.getBoundingClientRect()
    menuList.innerHTML = depart
    menuList.style.left = positionDropright.left + positionDropright.width + 'px'
    menuList.style.display = 'block'
    menuList.style.right = (positionList.x - positionList.width) + 'px'
    menuList.style.top = positionDropright.y + 'px'
    menuList.style.width = '300px'
}
const offMenu = () => {
    menuList.style.display = 'none'
}

function blockEvent(el, html) {
    //запрещение переходов из общего меню
    document.getElementById(el).addEventListener('click', (event) => event.preventDefault())
    //
    document.getElementById(el).addEventListener('mouseover', function () {
        dropMenu(this, html)
    })
    document.getElementById(el).addEventListener('mouseout', offMenu)
}
//ДКК
blockEvent('dkk-dropright', dkk)
//ДКВУ
blockEvent('dkvu-dropright', dkvu)
//СТС
blockEvent('sts-dropright', sts)
//ДКБ
blockEvent('dkb-dropright', dkb)
//ДКП
blockEvent('dkp-dropright', dkp)
//Биометрия
blockEvent('bio-dropright', bio)
//Общее
menuList.addEventListener('mouseover', () => menuList.style.display = 'block')
menuList.addEventListener('mouseout', () => menuList.style.display = 'none')