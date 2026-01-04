// ==UserScript==
// @name        HWM MailToTemplate
// @namespace   Zeleax
// @description В новом письме заполняет тему и текст сообщения из URL
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com)\/(sms-create.php\?mailto=.*)/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31084/HWM%20MailToTemplate.user.js
// @updateURL https://update.greasyfork.org/scripts/31084/HWM%20MailToTemplate.meta.js
// ==/UserScript==
// Пример использования: https://www.heroeswm.ru/sms-create.php?mailto=MyFriend&subject=Моя тема письма&msg=Мой текст письма
var url=window.location.href;

res=/&subject=([^&.]+)/.exec(url);
if(subjectText=res[1]) document.getElementsByName("subject")[0].setAttribute('value',decodeURI(subjectText));

res=/&msg=([^&.]+)/.exec(url);
if((msgText=res[1]) && (msgEl = document.getElementsByName("msg")[0])) msgEl.innerHTML=decodeURI(msgText);

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
