// ==UserScript==
// @name Lowadi Бот - Обычный прогон
// @description Бот для обычного прогона
// @version 3.7
// @include http://www.lowadi.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace https://greasyfork.org/users/170579
// @downloadURL https://update.greasyfork.org/scripts/38417/Lowadi%20%D0%91%D0%BE%D1%82%20-%20%D0%9E%D0%B1%D1%8B%D1%87%D0%BD%D1%8B%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B3%D0%BE%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/38417/Lowadi%20%D0%91%D0%BE%D1%82%20-%20%D0%9E%D0%B1%D1%8B%D1%87%D0%BD%D1%8B%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B3%D0%BE%D0%BD.meta.js
// ==/UserScript==
 
 
Array.prototype.sum = function()
{
        for (var i=0, sum=0; i < this.length; sum += this[i++]);
        return sum;
}
 
var pauseMin=800;
var KCK_tarif = 20; // Тариф в экю. Если = 0, то не сортируется, остальные возможные значения от 20 экю.
 
// Опция для настройки количества дней при записи в КСК.
var KCK_option = 3;
/*
Возможные значения:
3 - 3 дня
10 - 10 дней
30 - 30 дней
60 - 60 дней
 */
 var intId;
 var intId2;
 if (window.self != window.top)
 {
    throw "stop";
 }
 
// Со страницы Мои Лошади - переход на следующую лошадку
if (/www.lowadi.com\/elevage\/chevaux\/\?elevage=all-horses/.test(window.location.href))
{
    // Если текущий завод - не "мои лошади" -  переходим на нужный завод
        if (GM_getValue('curElevage')!=null||GM_getValue('curElevage')!="all-horses") {window.location='http://www.lowadi.com/elevage/chevaux/?elevage='+GM_getValue('curElevage');}
    else {
                var pause=getRandomPause(2000);
                setTimeout(filterNoSleep,pause);
        }
}
// Страница завода
if (/www.lowadi.com\/elevage\/chevaux\/\?elevage=/.test(window.location.href))
{
    var el = GM_getValue('curElevage');
        if (new RegExp(el).test(window.location.href))
        {
                var pause=getRandomPause(2000);
                setTimeout(filterNoSleep,pause);
        }
}
 // Если конь свежекуплен, останавливаем скрипт
if (/www.lowadi.com\/elevage\/chevaux\/cheval\?id=[0-9]+\&message=acheter/.test(window.location.href))
{
        throw "stop";
}
// Страница лошади
if (/\/elevage\/chevaux\/cheval\?id=/.test(window.location.href))
{
        // Записываем номер завода
        saveElevageId();
        // Если конь старше 30ти
        //if (window.content.wrappedJSObject.chevalAge>359)
        if (window.content.wrappedJSObject.chevalAge>359||window.content.chevalAge>359)
    {
                // Следующий конь
                var  pause=getRandomPause(200);
                setTimeout(prev,pause);
                throw "stop";
    }
        // Запись в КСК
        if (/elevage\/chevaux\/centreInscription\?id=/.test(document.body.innerHTML))
    {
                // Нажатие на кнопку
                pause=pause+getRandomPause(200);
                setTimeout(eqCenterReg,pause);
                throw "stop";
    }
        // Если конь не уложен спать
                var d = document.getElementById('boutonPanser');
                if (document.getElementById('countDownWakeUp')==null||d.outerHTML.indexOf('/doGroom') !== -1)
                {
                        // ORProg();
                        usualProg();
                        // TrainingProg();
                        throw "stop";
                }
                else {
                        window.location='http://www.lowadi.com/elevage/chevaux/';
                }
}
// Выжеребка (страница)
if (/www.lowadi.com\/elevage\/chevaux\/choisirNoms\?jument=/.test(window.location.href))
{
    if (document.body.innerHTML.indexOf('femelle.png') !== -1)
    {
                document.getElementById('poulain-1').setAttribute('value','Коб');
    }
    else document.getElementById('poulain-1').setAttribute('value','Жер');
    var d = document.getElementsByTagName('button');
    if (d[0].getAttribute('type')=='submit')
    {
                d[0].click();
        history.back();
    }
}
// Запись в КСК
if (/www.lowadi.com\/elevage\/chevaux\/centreInscription\?id=/.test(window.location.href))
{
        // Выставление дней
        var pause=0;
        pause=pause+getRandomPause(400);
        setTimeout(eqCenterReg2,pause);
        // Запись
        var pause1=pause+getRandomPause(400);
        setTimeout(eqCenterReg3,pause1);
        // Проверка результата
        var pause2=pause1+getRandomPause(4000);
        setTimeout(eqCenterReg4,pause2);
}
// Магазин
if (window.location.href == 'http://www.lowadi.com/marche/eleveur')
{
        var id = ".//*[@id='page-contents']/table/tbody/tr/td[1]/table/tbody/tr/td[1]/a";
        document.evaluate(id, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
}
// Магазин - продать
if (window.location.href == 'http://www.lowadi.com/marche/eleveurVendre')
{
    if (document.getElementById('sale147'))
        {
       
                var sel  = document.getElementById('sale147');
        sel.options[sel.options.length-1].selected=true;
                var d = document.getElementById('soumettre147');
                if (d.hasAttribute('onclick')) {d.click();}
                history.go(-2);
    }
}
 
// Программа обычного прогона
function  usualProg()
{
        // Если надо родить
        if (document.body.innerHTML.indexOf('/elevage/chevaux/mettreBas?jument=') != -1)
        {
                var d=document.getElementById('reproduction-body-content').childNodes[3].getElementsByTagName('a');
        d[0].removeAttribute('onclick');
        d[0].click();
                return;
    }
        var pause=0;
        // Урок
    pause=pause+getRandomPause(400);
        if (document.body.innerHTML.indexOf('boutonMissionEquus') != -1)        {
                setTimeout(buttonClickId,pause,'boutonMissionEquus');
        }
        if (document.body.innerHTML.indexOf('boutonMissionMontagne') != -1)     {
                setTimeout(buttonClickId,pause,'boutonMissionMontagne');
        }
        if (document.body.innerHTML.indexOf('boutonMissionForet') != -1)        {
                setTimeout(buttonClickId,pause,'boutonMissionForet');
        }
        if (document.body.innerHTML.indexOf('boutonMissionPlage') != -1)        {
                setTimeout(buttonClickId,pause,'boutonMissionPlage');
        }
    // Корм
    var pause1 = pause + getRandomPause(1000);
    setTimeout(giveFood, pause1);
    // Чистка
    var pause2 = pause1 + getRandomPause(400);
    setTimeout(buttonClickId, pause2, 'boutonPanser');
        // Если энергии <20
        var en = document.getElementById('energie').textContent;
        if (en < 20)
        {
                // Ласка
                var pause5 = pause2+getRandomPause(200);
                setTimeout(buttonClickId,pause5,'boutonCaresser');
        }
    // Спать
    var pause3=pause2+getRandomPause(400);
    setTimeout(buttonClickId,pause3,'boutonCoucher');
    // Следующий
    var  pause4=pause3+getRandomPause(400);
    setTimeout(prev,pause4);
}
// Рост ОРками
function  ORProg()
{
        if (document.body.innerHTML.indexOf('/elevage/chevaux/mettreBas?jument=') != -1)
    {
                var d=document.getElementById('reproduction-body-content').childNodes[3].getElementsByTagName('a');
        d[0].removeAttribute('onclick');
        d[0].click();
                return;
    }
        var pause=0;
    // Урок
    pause=pause+getRandomPause(400);
    setTimeout(buttonClickId,pause,'boutonLesson');
    // Корм
    var pause1=pause+getRandomPause(1000);
    setTimeout(doEatNorm,pause1);
    // Чистка
    var pause2=pause1+getRandomPause(400);
    setTimeout(buttonClickId,pause2,'boutonPanser');
        // Если энергии <20
        var en = document.getElementById('energie').textContent;
        if (en<20)
        {
                // Ласка
                var pause5 = pause2+getRandomPause(200);
                setTimeout(buttonClickId,pause5,'boutonCaresser');
        }
    // Спать
    var pause3=pause2+getRandomPause(400);
    setTimeout(buttonClickId,pause3,'boutonCoucher');
    // Следующий
    var  pause4=pause3+getRandomPause(400);
    setTimeout(OR,pause4);
}
 
// Программа с "умной" тренировкой
function TrainingProg()
{
        // Если надо родить
        if (document.body.innerHTML.indexOf('/elevage/chevaux/mettreBas?jument=') != -1)
        {
                var d=document.getElementById('reproduction-body-content').childNodes[3].getElementsByTagName('a');
        d[0].removeAttribute('onclick');
        d[0].click();
                return;
    }
        var pause=0;
        // Чистка
        pause=pause+getRandomPause(400);
        setTimeout(buttonClickId,pause,'boutonPanser');
        // Трен-ка до 10 энергии
        var pause1 = pause+getRandomPause(1000);
        setTimeout(Skill_Choosing,pause1,'10');
       
                // Ласка, если надо
                var pause5 = pause1+getRandomPause(200);
                setTimeout(enCheck,pause5,'20');
                // Пить, если надо
                var pause6 = pause5+getRandomPause(200);
                setTimeout(enCheck2,pause6,'20');
       
        // Корм
        var pause2=pause1+getRandomPause(1000);
    setTimeout(doEatNorm,pause2);
        // Спать
        var pause3=pause2+getRandomPause(400);
    setTimeout(buttonClickId,pause3,'boutonCoucher');
    // Следующий
    var  pause4=pause3+getRandomPause(400);
    setTimeout(prev,pause4);
}
 
// Проверка уровня энергии и ласка
function enCheck(En)
{
        if (window.content.wrappedJSObject.chevalEnergie<En)
        {
                buttonClickId('boutonCaresser');
        }
}
// Проверка уровня энергии и пить
function enCheck2(En)
{
        if (window.content.wrappedJSObject.chevalEnergie<En)
        {
                buttonClickId('boutonBoire');
        }
}
 
// Запись в КСК
function eqCenterReg() {
    if (document.body.innerHTML.indexOf('cheval-inscription') !== -1)    {
                // Нажимаем на кнопку
        var d=document.getElementById('cheval-inscription').firstChild;
        if (d!==null){d.click();}
    }
}
function eqCenterReg2() {
        var i = KCK_option;
		// Максимальный тариф
		document.querySelector( '#tarif' ).click();
		setTimeout(function() { document.querySelector("#tarif option[value='" + String(KCK_tarif) + "']").selected = true; }, 50);
        setTimeout(function() { document.querySelector("#cheval-centre-inscription button[type*='submit']").click(); }, 150);
		// // Выставляем кол-во дней (Сортировка по цене)
                // if (i==3) {
                // document.querySelector( 'a[onclick*="tarif2"]' ).click();
        // }
                // if (i==10) {
                // document.querySelector( 'a[onclick*="tarif3"]' ).click();
        // }
                // if (i==30) {
                // document.querySelector( 'a[onclick*="tarif4"]' ).click();
        // }
                // if (i==60) {
                // document.querySelector( 'a[onclick*="tarif5"]' ).click();
        // }
}
function eqCenterReg3() {
    // Запись в первый
        var sel = 'button[onclick*="duree='+KCK_option+'"]';
    document.querySelector( sel ).click();
}
function eqCenterReg4() {
   // Проверка результата
   // Если не записано, записать
        if (/message=centreOk/.test(window.location.href)!=true) {location.reload();}
}
// "Умная тренировка"
function Skill_Choosing(minEn){
        // Если конь старше 2х
    var dom = window.content.wrappedJSObject;
        if (dom.chevalAge>23&&dom.chevalEnergie>minEn&&dom.chevalMoral>90&&dom.chevalSante>95)
    {
                // Запретить упрощенное обучение
                var d = document.getElementById('training-head-title');
                if (d.outerHTML.indexOf('Запретить упрощенное обучение') !== -1)
                {
                        d.childNodes[1].click();
                }
                var i = 0;
                var cof;
                do
                {
                        var arr = [dom.enduranceGenetique, dom.vitesseGenetique, dom.dressageGenetique, dom.galopGenetique, dom.trotGenetique, dom.sautGenetique];
                        if (arr.sum()<=0) {alert('Тренировки завершены');i=5;return;}
                        // alert(Math.max.apply(Math,arr)+" "+arr.indexOf(Math.max.apply(Math,arr)));
                        switch (arr.indexOf(Math.max.apply(Math,arr)))
                        {
                                case 0:
                                        if (dom.e1<100)
                                        {
                                                // Тренируем выносливость до минимума энергии
                                                cof = Math.floor((dom.chevalEnergie-minEn)/8);
                                                // Для слайдеров
                                                if (document.body.innerHTML.indexOf('id="trainingEnduranceSlider"') !== -1)
                                                {
                                                        var spans=document.getElementById('trainingEnduranceSlider').getElementsByClassName('drop ui-droppable');
                                                        spans[cof].click();
                                                        subm=true;
                                                }
                                                // Для выпадающих списков
                                                else
                                                {
                                                        document.getElementById('entrainementEnduranceDuration').options[cof].selected=true;
                                                }
                                                // Нажимаем на кнопку
                                                var d = document.getElementById('entrainementEndurance');
                                                if (d.hasAttribute('onsubmit')) {d.onsubmit();}
                                                return;
                                        }
                                        else
                                        {
                                                // Обновляем значения массива
                                                dom.enduranceGenetique = 0;
                                        }
                                        break
                                case 1:
                                        // Скорость
                                        if (dom.e2<100)
                                        {
                                                cof = Math.floor((dom.chevalEnergie-minEn)/8);
                                                if (document.body.innerHTML.indexOf('id="trainingVitesseSlider"') !== -1)
                                                {
                                                        var spans=document.getElementById('trainingVitesseSlider').getElementsByClassName('drop ui-droppable');
                                                        spans[cof].click();
                                                        subm=true;
                                                }
                                                else
                                                {
                                                        document.getElementById('entrainementVitesseDuration').options[cof].selected=true;
                                                }
                                                var d = document.getElementById('entrainementVitesse');
                                                if (d.hasAttribute('onsubmit')) {d.onsubmit();}
                                                return;
                                        }
                                        else {dom.vitesseGenetique = 0;}
                                        break
                                case 2:
                                        // Выездка
                                        if (dom.e3<100)
                                        {
                                                cof = Math.floor((dom.chevalEnergie-minEn)/5);
                                                if (document.body.innerHTML.indexOf('id="trainingDressageSlider"') !== -1)
                                                {
                                                        var spans=document.getElementById('trainingDressageSlider').getElementsByClassName('drop ui-droppable');
                                                        spans[cof].click();
                                                        subm=true;
                                                }
                                                else
                                                {
                                                        document.getElementById('entrainementDressageDuration').options[cof].selected=true;
                                                }
                                                var d = document.getElementById('entrainementDressage');
                                                if (d.hasAttribute('onsubmit')) {d.onsubmit();}
                                                return;
                                        }
                                        else {dom.dressageGenetique = 0;}
                                        break
                                case 3:
                                        // Галоп
                                        if (dom.e4<100)
                                        {
                                                cof = Math.floor((dom.chevalEnergie-minEn)/7);
                                                if (document.body.innerHTML.indexOf('id="trainingGalopSlider"') !== -1)
                                                {
                                                        var spans=document.getElementById('trainingGalopSlider').getElementsByClassName('drop ui-droppable');
                                                        spans[cof].click();
                                                        subm=true;
                                                }
                                                else
                                                {
                                                        document.getElementById('entrainementGalopDuration').options[cof].selected=true;
                                                }
                                                var d = document.getElementById('entrainementGalop');
                                                if (d.hasAttribute('onsubmit')) {d.onsubmit();}
                                                return;
                                        }
                                        else {dom.galopGenetique = 0;}
                                        break
                                case 4:
                                        // Рысь
                                        if (dom.e5<100)
                                        {
                                                cof = Math.floor((dom.chevalEnergie-minEn)/7);
                                                if (document.body.innerHTML.indexOf('id="trainingTrotSlider"') !== -1)
                                                {
                                                        var spans=document.getElementById('trainingTrotSlider').getElementsByClassName('drop ui-droppable');
                                                        spans[cof].click();
                                                        subm=true;
                                                }
                                                else
                                                {
                                                        document.getElementById('entrainementTrotDuration').options[cof].selected=true;
                                                }
                                                var d = document.getElementById('entrainementTrot');
                                                if (d.hasAttribute('onsubmit')) {d.onsubmit();}
                                                return;
                                        }
                                        else {dom.trotGenetique = 0;}
                                        break
                                case 5:
                                        // Прыжки
                                        if (dom.e6<100)
                                        {
                                                cof = Math.floor((dom.chevalEnergie-minEn)/7);
                                                if (document.body.innerHTML.indexOf('id="trainingSautSlider"') !== -1)
                                                {
                                                        var spans=document.getElementById('trainingSautSlider').getElementsByClassName('drop ui-droppable');
                                                        spans[cof].click();
                                                        subm=true;
                                                }
                                                else
                                                {
                                                        document.getElementById('entrainementSautDuration').options[cof].selected=true;
                                                }
                                                var d = document.getElementById('entrainementSaut');
                                                if (d.hasAttribute('onsubmit')) {d.onsubmit();}
                                                return;
                                        }
                                        else {dom.sautGenetique = 0;}
                                        break
                        }
                        i++;
                }
                while (i!==5);
        }
        else {PlayGames(minEn);}
}
// Игры
function PlayGames(minEn){
 
        // Если конь старше 2х
    var dom = window.content.wrappedJSObject;
        if (dom.chevalAge>7&&dom.chevalAge<17&&dom.chevalEnergie>minEn&&dom.chevalMoral>80&&dom.chevalSante>95)
    {
   
                // Тренируем выносливость до минимума энергии
                cof = Math.floor((dom.chevalEnergie-minEn)/7);
                // Для слайдеров
                if (document.body.innerHTML.indexOf('id="centerPlaySlider"') !== -1)
                {
                        var spans=document.getElementById('centerPlaySlider').getElementsByClassName('drop ui-droppable');
                        spans[cof].click();
                        subm=true;
                }
                // Для выпадающих списков
                else
                {
                        document.getElementById('formCenterPlay').getElementsByTagName('select')[0].options[cof].selected=true;
                }
               
                // Нажимаем на кнопку
                document.getElementById('formCenterPlaySubmit').click();
                return;
        }
}
function giveFood() {
		// Выясняем нормы
		var hay = foodToGive(0);
		var oats = foodToGive(1);
		if (hay + oats == 0) return;
	setTimeout(function() { document.querySelector('#boutonNourrir').click(); }, 10);
	var feedingPause = 100;
		// Для слайдеров
		if (document.querySelector('#haySlider') !== null) {
			feedingPause = feedingPause + 100;
      setTimeout(function() { document.querySelector('#haySlider li[data-number*="' + String(hay) + '"]').click(); }, feedingPause); // Клик по кнопке "Корм"
		}
  if (document.querySelector('#oatsSlider') !== null) {
			feedingPause = feedingPause + 100;
    setTimeout(function() { document.querySelector('#oatsSlider li[data-number*="' + String(oats) + '"]').click(); }, feedingPause + 50);
		}
	
		// Для выпадающего меню
		if (window.content.toString().indexOf('id="feedingHay"') !== -1) {
			feedingPause = feedingPause + 100;
      setTimeout(function() { document.querySelector('#feedingHay').click(); }, feedingPause - 50);
			// Выставление значения программно
  setTimeout(function() { document.querySelector("#feedingHay option[value='" + String(hay) + "']").selected = true; }, feedingPause);
    }
		if (window.content.toString().indexOf('id="feedingOats"') !== -1) {
			feedingPause = feedingPause + 100;
      setTimeout(function() { document.querySelector('#feedingOats').click(); }, feedingPause - 50);
  		setTimeout(function() { document.querySelector("#feedingOats option[value='" + String(oats) + "']").selected = true; }, feedingPause);
		}
		feedingPause = feedingPause + 200;
		setTimeout(function() { document.querySelector('#feed-button').click(); }, feedingPause);
}

function foodToGive(index){ // index: 0 - сено, 1 - зерно
		var string, given, norm, id, result;
		if (index == 1 && document.querySelector('#oatsSlider') == null) return;
		if (document.querySelector('#haySlider') !== null) {
			var el = document.querySelectorAll("#feeding span[class='float-right']")[index];
			string = el.textContent;
			given = string.substring(0, string.indexOf('/'));
			norm = string.substring(string.indexOf('/') + 1, string.length);
			result = parseInt(trim(norm)) - parseInt(trim(given));
		} else { // Для выпадающего меню
			string = document.querySelectorAll("#feeding tr[class='dashed']")[index].textContent;
			given = string.substring(string.indexOf(' '), string.indexOf('/'));
			norm = string.substring(string.indexOf('/') + 1, string.length);
			result = parseInt(trim(norm)) - parseInt(trim(given));
		}
		
		if (document.body.textContent.toString().indexOf('недостат') !== -1 && index == 0) result = 20 - given;
		if (document.body.textContent.toString().indexOf('толст') !== -1) result = 0;
		
    return result;
	}
// Удаление пробелов
function trim(str, chars){
        return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars){
        chars = chars || "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars){
        chars = chars || "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}
// Случайное число
function getRandomPause(min){
        var max = min*2;
        var rand = Math.random() * (max - min) + min;
        rand = rand + pauseMin; // Увеличиваем время каждой паузы на минимальное значение
        return rand;
}
// Нажатие кнопки по ее ИД
function buttonClickId(id){
var d=document.getElementById(id);
    if(d!==null&&d.hasAttribute("onclick")){d.click();}
}
// Предыдущий
function prev(){
    var d = document.getElementById('nav-previous');
    if(d !== null && d.hasAttribute("href")){ d.click(); }
}
// Рост ОР
function OR(){
    var d=document.getElementById('age');
    if(d!==null&&d.hasAttribute("onsubmit")){d.onsubmit();}
}
// Записываем номер завода
function saveElevageId(){
        var id = ".//*[@id='col-center']"; // X-Path элемента страницы со ссылкой на завод
        // Вырезаем номер завода:
        var href = document.evaluate(id, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (href!=null)
        {
                var regex =/elevage=([0-9]+)/;
                var elNum=href.outerHTML.match(regex);
                // Если номера завода в ссылке нет, то конь содержится в "Мои лошади"
                if (elNum != null) {elNum = elNum[1];}
                // Записываем номер завода в память
                GM_setValue('curElevage',elNum);
        }
}
function filterNoSleep(){
        var regex =/\/elevage\/chevaux\/cheval\?id=[0-9]+/;
        var href=document.body.innerHTML.match(regex);
        if (href!=null||document.getElementById('all-horsesBlocRecherche'))
        {
                clearInterval(intId);
                // Отфильтровать не уложенных на сон
                document.getElementById('linkBlocRecherche').click();
                document.getElementById('horseSearchLink-criteres').click();
                document.getElementById('horseSearchAgeComparaisonC').click();
                document.getElementById('horseSearchAge').value=30;
                document.getElementById('horseSearchCoucheCheckbox').click();
                document.getElementById('horseSearchCoucheCheckbox').click();
                document.getElementById('horseSearchSubmit').click();
                var pause=getRandomPause(1500);
                intId = setInterval(lastPageOfHorses,pause);
        }
}
// Переходим на последнюю страницу
function lastPageOfHorses(){
        if(document.getElementById('searchHorseInstance').parentNode.innerHTML.indexOf('pageNumbering') !== -1)
        {
                document.getElementById('searchHorseInstance').nextSibling.firstChild.firstChild.lastChild.firstChild.click();
        }
        var pause=getRandomPause(1500);
        intId = setInterval(lastHorseHref,pause);
        if(document.getElementById('tabs-breedings').innerHTML.indexOf('messageBoxInline') !== -1)
        {
                clearInterval(intId);
                GM_setValue('logout', 2);
                goToElevage();
        }
}
// Перейти к последней лошади в заводе
function lastHorseHref(){
        var regex =/\/elevage\/chevaux\/cheval\?id=[0-9]+/g;
        var hrefArr=document.body.innerHTML.match(regex);
        if (hrefArr[hrefArr.length-1]!=null) {clearInterval(intId); window.location = 'http://www.lowadi.com'+hrefArr[hrefArr.length-1];}
        if(document.getElementById('tabs-breedings').innerHTML.indexOf('messageBoxInline') !== -1)
        {
                clearInterval(intId);
                GM_setValue('logout', 2);
                goToElevage();
        }
}