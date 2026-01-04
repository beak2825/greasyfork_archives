// ==UserScript==
// @name         Узнать номер клиента
// @namespace    https://github.com/
// @version      1.3.5
// @description  Позволяет узнать номер клиента по ID
// @author       Macho_Muchcho
// @match        */pvz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445816/%D0%A3%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%20%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/445816/%D0%A3%D0%B7%D0%BD%D0%B0%D1%82%D1%8C%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%20%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B0.meta.js
// ==/UserScript==
async function findNum() {
var p = prompt('ID клиента? Чаще всего это цифры в адресной строке сверху', )
var e = await (await fetch(`${new URL(window.location.href).origin}/api/employee/info`)).json(),
t = await (await fetch(`https://wbaex.space/wb/antiexciseusers.php?clientID=${e.id}`)).json();
if (t.status == 'ok') {
    var s = await (await fetch(`${new URL(window.location.href).origin}/api/user/${p}`)).json()
    alert('ФИО: ' + s.userName + ' Номер: ' + s.phone)
} else if (t.status == 'error') {
    alert('Недоступно для данного ID')
}
}
findNum()