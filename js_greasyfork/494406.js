// ==UserScript==
// @name         YandexAntiAdvertisement
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description:ru  Скрывает из результатов поиска яндекса ссылки на сайты, помеченные как реклама
// @description  Hides avertisement sites results from search results in yandexserch machine
// @author       Kloshar
// @match        https://ya.ru/*
// @match        https://yandex.ru/*
// @match        https://yandex.com/*
// @icon         data:image/gif;base64,R0lGODlhEAAQAO4AANHR0cAxMcLCwccuLr4qKqSkpNbW1spISNBUVLSfoKKhocU+PtmFhrw5OdV7e8gyM87OzsXFxb6+vrkXGLUjJK2trccWFs5PT4lERchFRYpHSLZPT5ZYWJFYWM9bW9JYWchXV81TVMdRUs5VVq8WFsEtLrIcHbkWF7kYGaooKLgnJ7ohIrgpKalAQMw6OspCQs1AQKE2N8k0NMgWFsQ6OtNdXaqfn6KdnaagoLukpK2hoZWUlJKRkaeXl5+dnZmZmdW9vbi4uNDCwtra2srKysGurqioqLOvr8yxsbCwr4+Li8tkZc9jZGxnZ9ZrbM5oaYRhYcxfX89hYnZkY8tiYsx/gNh9faqAgYiFhdeDg89sbKNsbHJtbdR8fJR0dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkKAF8ALAAAAAAQABAAAAeygF+Cg18aHYSIggclKSIZBAeJX1YygkqCCVUDDoQMLolBXy8WDIMDgwaCEl8ICF+nX09MgwCCRRcfglJaXwSEtQkHNYS+E4QGOQ0eiCdfKINDQAsgQhUFCoLGAYNIC1E6RhURBYLbDiOCNE5fAEkFEj84IV2CD1kwS4IAEBACPBwPCM1oMEgAkQhHtpBItIKKIBs9rrQwgYGQghtQYlAIwIKCig1emiDygYXLlGMCdgwKBAA7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494406/YandexAntiAdvertisement.user.js
// @updateURL https://update.greasyfork.org/scripts/494406/YandexAntiAdvertisement.meta.js
// ==/UserScript==
(function()
 {
    'use strict';
    console.log('!!! ', document.readyState);

    if (document.readyState === 'complete') //проверяем статус загрузки страницы и если она загружена, то сразу выполняем функции
    {
        hidePopupWindow(); //удаляет предложение установить яндекс-браузер
        hideAdvertismentBlocks(); //удаляет рекламные блоки в поиске яндекс
        hideAdvertismentBlocksPromo(); //удаляет рекламные блоки в поиске яндекс promo
        hideAdvertismentBlocksInImages(); //удаляет рекламные блоки в яндекс картинках
        hideRightSideBlock(); //удаляет рекламные блоки в блоке справа от результатов
    }
    else //или вешаем обработчики на полную загрузку страницы
    {
        window.addEventListener("load", hidePopupWindow, true); //удаляет предложение установить яндекс-браузер
        window.addEventListener("load", hideAdvertismentBlocks, true); //удаляет рекламные блоки в поиске яндекс
        window.addEventListener("load", hideAdvertismentBlocksPromo, true); //удаляет рекламные блоки в поиске яндекс promo
        window.addEventListener("load", hideAdvertismentBlocksInImages, true); //удаляет рекламные блоки в яндекс картинках
        window.addEventListener("load", hideRightSideBlock, true); //удаляет рекламные блоки в блоке справа от результатов
    }
    window.addEventListener("scroll", hideAdvertismentBlocksInImages); //прослушиваем прокрутку страницы, так как при первой загрузке страницы рекламные блоки не добавляются

    function hideRightSideBlock(){
        var ad_blocks = document.querySelectorAll('div#search-result-aside'); //выбираем все рекламные блоки по атрибуту
        //console.log(ad_blocks);
        for(let i = 0; i < ad_blocks.length; i++) //обрабатываем все рекламные блоки на странице
            {
                ad_blocks[i].style.display = 'none'; //скрываем только сам рекламный блок
                //console.log("Элемент скрыт: " + ad_blocks[i]);
            }
    }
    function hidePopupWindow()
    {
        var element = document.querySelector('body'); //тело страницы
        for(let d of element.children) //перебор всех узлов тела
        {
            //console.log(d.nodeName.toUpperCase() == "DIALOG", d.nodeName, d.className.includes('simple-popup'));
            if(d.className.includes('simple-popup')) element.removeChild(d); //удаляем узел с диалогом
        }
    }
    function hideAdvertismentBlocksInImages()
    {
        //console.log('В блоке hideAdvertismentBlocksInImages');
        var ad_blocks = document.querySelectorAll('div[aria-label="Рекламный баннер"]'); //выбираем все рекламные блоки по атрибуту
        //console.log(ad_blocks);
        //по мере прокрутки страницы количество рекламных блоков будет расти
        if(ad_blocks.length > 0) //если блоки найдены
        {
            //console.log(ad_blocks.length);
            for(let i = 0; i < ad_blocks.length; i++) //обрабатываем все рекламные блоки на странице
            {
                var par = ad_blocks[i].parentNode;
                //console.log(par);
                //par.style.display = 'none'; //скрываем целиком родительский блок (не работает для div class="AdvMastHead")
                ad_blocks[i].style.display = 'none'; //скрываем только сам рекламный блок
            }
        }
    } //end function hideAdvertismentBlocksInImages()
    function hideAdvertismentBlocks()
    {
        //console.log('Event fired');
        try //блок поиска проплаченных ссылок
        {
            //console.log("В блоке try");
            const li_elements = document.querySelector('ul#search-result').querySelectorAll('li'); //выбираем все списки с id=search-result, потом из них ищем все элементы списка в найденом списке
            //console.log("Lenght of li_elements is:", li_elements.length); //получили 19 элементов списка
            //надо обаботать все элементы списка
            for(let i = 0; i < li_elements.length; i++)
            {
                const li_elem = li_elements[i]; //первый элемент списка
                //console.log(i + " " + li_elem); //порядковый номер и название элемента
                let firstDiv = li_elem.querySelector('div'); //получаем вложенный элемент (единственный)
                //console.log("firstDiv: ", firstDiv); //сам элемент
                //проверка на существование блока и наличия у него вложенного элемента
                if(firstDiv != null && firstDiv.childNodes.length > 1)
                {
                    //console.log("Lenght of firstDiv.childNodes is: ", firstDiv.childNodes.length); //количество потомков
                    let nextDiv = firstDiv.querySelector('div.Organic-Subtitle');
                    //console.log('nextDiv=', nextDiv);
                    if(nextDiv) //проверка на null
                    {
                        //console.log('ok');
                        var spans = nextDiv.querySelectorAll('div, span'); //находит все div и span
                        //надо обработать все на значения
                        for(let k = 0; k < spans.length; k++)
                        {
                            //console.log(spans.length + spans[k].textContent); //содержимое спана или div
                            if(spans[k].textContent == "Реклaма" || spans[k].textContent == "Pеклама" || spans[k].textContent == "Peкламa" || spans[k].textContent == "Реклама" || spans[k].textContent == "Промо") //варианты написания разными символами
                            {
                                //console.log("Элемент скрыт: " + spans[k].textContent);
                                //console.log(typeof(spans[k].textContent));
                                //console.log(spans[k].textContent == "Реклaма");
                                li_elem.style.backgroundColor = "gray";
                                //li_elem.style.visibility = 'hidden'; //скрывает, но оставляет пустое место
                                li_elem.style.display = 'none'; //скрывает со смещением видимых элементов вверх
                            }
                            else
                            {
                                //console.log("Элемент не скрыт: " + spans[k].textContent);
                            }
                        }
                    }
                }
            }
        } //end try //блок поиска проплаченных ссылок
        catch(ex)
        {
            //console.log(ex)
        }
    } //end function hideAdvertismentBlocks()
    function hideAdvertismentBlocksPromo()
    {
        //console.log('Event fired');
        try //блок поиска проплаченных ссылок
        {
            //console.log("В блоке try");
            const li_elements = document.querySelector('ul#search-result').querySelectorAll('li'); //выбираем все списки с id=search-result, потом из них ищем все элементы списка в найденом списке
            //console.log("Lenght of li_elements is:", li_elements.length); //получили 19 элементов списка
            //надо обаботать все элементы списка
            for(let i = 0; i < li_elements.length; i++)
            {
                const li_elem = li_elements[i]; //первый элемент списка
                //console.log(i + " " + li_elem); //порядковый номер и название элемента
                let firstDiv = li_elem.querySelector('div'); //получаем вложенный элемент (единственный)
                //console.log("firstDiv: ", firstDiv); //сам элемент
                //проверка на существование блока и наличия у него вложенного элемента
                if(firstDiv != null && firstDiv.childNodes.length > 1)
                {
                    //console.log("Lenght of firstDiv.childNodes is: ", firstDiv.childNodes.length); //количество потомков
                    //let nextDiv = firstDiv.querySelector('div');
                    let nextDiv = firstDiv;
                    if(nextDiv) //проверка на null
                    {
                        //console.log('ok');
                        var spans = nextDiv.querySelectorAll('div, span'); //находит все div и span
                        //надо обработать все на значения
                        for(let k = 0; k < spans.length; k++)
                        {
                            //console.log(spans.length + spans[k].textContent); //содержимое спана или div
                            if(spans[k].textContent == "Промо") //варианты написания разными символами
                            {
                                console.log("Элемент скрыт: " + spans[k].textContent);
                                console.log(typeof(spans[k].textContent));
                                console.log(spans[k].textContent == "Промо");
                                li_elem.style.backgroundColor = "gray";
                                //li_elem.style.visibility = 'hidden'; //скрывает, но оставляет пустое место
                                li_elem.style.display = 'none'; //скрывает со смещением видимых элементов вверх
                            }
                            else
                            {
                                //console.log("Элемент не скрыт: " + spans[k].textContent);
                            }
                        }
                    }
                }
            }
        } //end try //блок поиска проплаченных ссылок
        catch(ex)
        {
            console.log(ex)
        }
    } //end function hideAdvertismentBlocksPromo()
})();