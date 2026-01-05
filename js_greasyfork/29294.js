// ==UserScript==
// @name VK Скорость музыки
// @namespace VKPLRATE
// @description Добавляет на vk.com скорость воспроизведения музыки.
// @include https://vk.com/*
// @grant none
// @version 1.13
// @supportURL alexshiry1@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/29294/VK%20%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D1%8C%20%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/29294/VK%20%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D1%8C%20%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B8.meta.js
// ==/UserScript==

var allowsetval=false;

range=document.createElement("span"); //Создание элемента span
range.innerHTML='Playback rate:<input type=range min=0.5 max=2 step=0.01 class="pl_rate"><span class="pl_rateval">1</span>'; //Присваивание основных компонентов
range.style.position='fixed';// Стили
range.id="pl_rate_container";
range.style.bottom='0';
range.style.left='0';
range.style.zIndex='99999999';
if(location.href.search(/widget/)==-1){//Если не виджет
    document.body.append(range);// Добавление в конец body
}


window.addEventListener('load',function(){//Событие на полную загрузку страницы
  if(localStorage.getItem('plrate')!==undefined){
    range.querySelector('input').value=parseFloat(localStorage.getItem('plrate'));//Восстановление значения из localstorage
  }else{
    range.querySelector('input').value=1;//Если нет значения, то значение по умолчанию 1 (нормальная скорость)
  }
  allowsetval=true;
});

setInterval(function(){//Проверка через каждые 0,1 сек.
    if(allowsetval===true){
  try{
  if(getAudioPlayer()._impl._currentAudioEl.playbackRate!=range.querySelector('input').value){//Если скорость в аудиоплеере не совпадает со скоростью ползунка
    getAudioPlayer()._impl._currentAudioEl.playbackRate=range.querySelector('input').value;//Присвоить новую скорость
    localStorage.setItem('plrate',range.querySelector('input').value);//Сохранить новую скорость в localstorage
      document.querySelector('.pl_rateval').innerText=range.querySelector('input').value;//Отобразить значение скорости рядом с ползунком
  }
    }catch(e){}//Подавление ошибки
    }
},100);