// ==UserScript==
// @name        DTF.ru. Show me avatars (NEW)
// @namespace   https://github.com/TentacleTenticals
// @match       https://dtf.ru/*
// @grant       none
// @version     1.1
// @author      Tentacle Tenticals
// @description Показ аватарок пользователей, а также копирование ссылки на аватарку. Курсор на аватарку и Ctrl для её показа, или Ctrl+Shift для копирования URL ссылки в буфер обмена.
// @homepage https://github.com/TentacleTenticals/DTF-showAvatar
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443198/DTFru%20Show%20me%20avatars%20%28NEW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443198/DTFru%20Show%20me%20avatars%20%28NEW%29.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
  'use strict';
  
  window.addEventListener('load', run);
function run(){
  let css = document.createElement('style');
  css.textContent = `
   .searchmenuItem {
     display: block;
     background: white;
     color: black;
     border-radius: 3px;
     text-decoration: unset;
     border: unset;
     padding: 3px 10px 3px 10px;
     width: -webkit-fill-available;
     text-align: center;
     font-size: 12px;
     line-height: 12px;
   }
   .searchmenuItem:hover {
     background: rgb(213, 213, 239);
   }

   .srcSearch {
     min-width: 100px;
     min-height: 100px;
     max-height: 500px;
     background: rgb(45, 5, 66);
     position: fixed;
     display: grid;
     grid-template-columns: repeat(1, auto);
     gap: 4px;
     align-content: center;
     justify-content: center;
     align-items: center;
     justify-items: center;
     padding: 10px;
     border-radius: 3px;
     z-index: 1000;
   }`
  document.body.appendChild(css);

let mainFilter = new RegExp(`comment__avatar__image|content-header-author__avatar|subsite-card__avatar|v-header__cover|v-header-avatar|${document.querySelector("div[class='layout__right-column'] div[style^='background-image").className}`),
    commentsRightBarFilter = new RegExp(document.querySelector("div[class='layout__right-column'] div[style^='background-image").className),
    urlFixer = new RegExp(`.*(http[s]{0,1}:\/\/leonardo.osnova.io\/[a-zA-Z0-9-_]+)\/.+`),
    button1Pressed, button2Pressed, button3Pressed, hovered,
    
    // Настройки клавиш. Используйте Control/Shift/Alt/и т.п. НЕ используйте буквы алфавита, цифры, знаки.
    useButton1ForAvatarView = true, // Использовать (true), или не использовать (false) button1 для показа аватарки.
    button1 = 'Control', // Клавиша для показа аватарки.
    button2 = 'Shift', // Клавиша, используемая в сочетании клавиш для копирования URL аватарки в буфер обмена.
    button3 = 'Alt', // Клавиша для показа поискового меню.
    
    // Настройки максимального размера превью аватарки
    userAvatarSize = '400px', // Аватарка пользователя (комментарий).
    userProfileCoverSizeWidth = '990px', // Обложка пользователя в профиле (длина).
    userProfileCoverSizeHeight = '400px', // Обложка пользователя в профиле (ширина).
    userProfileAvatarSize = '400px', // Аватар пользователя в профиле.
    authorAvatarSizeHeader = '400px', // Аватарка подсайта статьи (хеадер).
    authorAvatarSizeFooter = '400px', // Аватарка автора статьи (футер).
    userAvatarSizeCommentsPanel = '250px', // Аватарка пользователя (боковая панель комментариев, aka "live-список" комментариев к статьям).
    
    // Настройка вида превью аватарки
    imageBorderRadius = '3px', // Закругление углов.
    imageBackgroundColor = 'rgba(0, 0, 0, 1)', // Фон превью. Необходим, если аватарка это png и т.п. без фона.
    imageBoxShadow = '0px 0px 6px 2px black', // Тень, оставляемая элементом превью аватарки.
    
    // Список поисковиков, что вы хотите использовать. use:true/false (использовать)/(не использовать).
    // Можно добавить абсолютно любой "поиск по картинкам", главное это получить правильную ссылку для его работы.
    // url: - URL ссылка для работы поиска. name: - как будет называться этот поиск в поисковом меню.
    searches = [
      {url:'http://saucenao.com/search.php?db=999&url=', name:'Saucenao', use:true},
      {url:'https://www.bing.com/images/search?view=detailv2&iss=sbi&FORM=SBIHMP&sbisrc=UrlPaste&q=imgurl:', name:'Bing', use:true},
      {url:'https://www.google.com/searchbyimage?site=search&image_url=', name:'Google', use:true},
      {url:'https://yandex.ru/images/search?rdrnd=296405&rpt=imageview&url=', name:'Yandex', use:true},
      {url:'http://tineye.com/search/?url=', name:'TinEye', use:true},
      {url:'http://iqdb.org/?url=', name:'IQDB', use:true}
    ];

   class A {
    constructor({name, searchUrl, targetUrl, elem}) {
      this.e=document.createElement('a');
      this.e.className=`searchmenuItem`
      this.e.textContent=name
      this.e.href=`${searchUrl}${targetUrl}`
      this.e.target='_blank'
      this.e.onclick = function(s){
        s.preventDefault()
        s.stopImmediatePropagation();
        window.open(s.target.href, '_blank');
      }
      elem.appendChild(this.e);
      return this.e;
    }
  }

  function check(s){
      if(!useButton1ForAvatarView){
          hovered = s.target;
          return (!button1Pressed && !button2Pressed && !button3Pressed);
      }
      if(useButton1ForAvatarView){
          hovered = s.target;
          return (button1Pressed && !button2Pressed && !button3Pressed);
      }
  }
  
  document.addEventListener('mouseover', hover, true);
  function hover(s){
      if(s.target.classList.value.match(mainFilter) && check(s)){
          if(!document.querySelector(`div[class='avatar-preview']`)){
              let img = new Image();
              if(s.target.classList.value.match(commentsRightBarFilter) || s.target.classList.value.match(`subsite-card__avatar|v-header-avatar|v-header__cover`)) img.src = s.target.style.backgroundImage.replace(urlFixer, '$1')
              else img.src = s.target.children[0].src.replace(urlFixer, '$1');
              let avatarPreview = document.createElement('div');
              avatarPreview.className = 'avatar-preview';
              avatarPreview.style.position = 'fixed';
              avatarPreview.style.zIndex = '1000';
          if(s.target.classList.value.match(/comment__avatar__image/)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 20}px`;
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 40}px`;
              img.style.maxWidth = userAvatarSize;
              img.style.maxHeight = userAvatarSize;
              img.style.width = '-webkit-fill-available';
              img.style.height = '-webkit-fill-available';
          }else
          if(s.target.classList.value.match(/v-header-avatar/)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 170}px`
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 20}px`
              img.style.maxWidth = userProfileAvatarSize;
              img.style.maxHeight = userProfileAvatarSize;
          }else
          if(s.target.classList.value.match(/v-header__cover/)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 300}px`
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 0}px`
              img.style.maxWidth = userProfileCoverSizeWidth;
              img.style.maxHeight = userProfileCoverSizeHeight;
          }else
          if(s.target.classList.value.match(/content-header-author__avatar/)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 25}px`;
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 40}px`;
              img.style.maxWidth = authorAvatarSizeHeader;
              img.style.maxHeight = authorAvatarSizeHeader;
          }else
          if(s.target.classList.value.match(/subsite-card__avatar/)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 35}px`;
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 50}px`;
              img.style.maxWidth = authorAvatarSizeFooter;
              img.style.maxHeight = authorAvatarSizeFooter;
          }else
          if(s.target.classList.value.match(commentsRightBarFilter)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 25}px`;
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 30}px`;
              img.style.maxWidth = userAvatarSizeCommentsPanel;
              img.style.maxHeight = userAvatarSizeCommentsPanel;
          }
            img.style.borderRadius = imageBorderRadius;
            img.style.backgroundColor = imageBackgroundColor;
            img.style.boxShadow = imageBoxShadow;
            s.target.parentNode.appendChild(avatarPreview);
            document.querySelector(`div[class='avatar-preview']`).appendChild(img);
          }
      }else
      if(s.target.classList.value.match(mainFilter) && !button1Pressed && !button2Pressed && button3Pressed) {
        if(!document.querySelector(`div[class='srcSearch']`) && hovered){
            console.log('Creating menu...');
            let menu = document.createElement('div');
            menu.className = 'srcSearch';
            if(s.target.classList.value.match(/v-header-avatar/)){
                menu.style.top = `${s.target.getBoundingClientRect().top + 120}px`;
                menu.style.left = `${s.target.getBoundingClientRect().left + 0}px`;
            }else
            {
                menu.style.top = `${s.target.getBoundingClientRect().top + 20}px`;
                menu.style.left = `${s.target.getBoundingClientRect().left + 20}px`;
            }
            hovered.parentNode.appendChild(menu);

            for(let i = 0; i < searches.length; i++){
                if(searches[i].use){
                  if(s.target.classList.value.match(commentsRightBarFilter) || s.target.classList.value.match(`subsite-card__avatar|v-header-avatar|v-header__cover`)) {
                      new A({
                        name: searches[i].name,
                        searchUrl: searches[i].url,
                        targetUrl: hovered.style.backgroundImage.replace(urlFixer, '$1'),
                        elem: menu
                      });
                  }
                  else {
                      new A({
                        name: searches[i].name,
                        searchUrl: searches[i].url,
                        targetUrl: hovered.children[0].src.replace(urlFixer, '$1'),
                        elem: menu
                      });
                       }
                }
            }
        }
      }else
      if(s.target.classList.value.match(mainFilter) && button1Pressed && button2Pressed && !button3Pressed){
        hovered = s.target;
          if(s.target.classList.value.match(commentsRightBarFilter) || s.target.classList.value.match(`subsite-card__avatar|v-header-avatar|v-header__cover`)) navigator.clipboard.writeText(s.target.style.backgroundImage.replace(urlFixer, '$1'))
          else navigator.clipboard.writeText(s.target.children[0].src.replace(urlFixer, '$1'));
          if(!document.querySelector(`div[class='avatar-link-copyed']`)){
          let alert = document.createElement('div');
          alert.className = 'avatar-link-copyed';
          alert.textContent = 'Ссылка на аватарку успешно скопирована';
          alert.style.position = 'fixed';
          alert.style.zIndex = '1000';
          if(s.target.classList.value.match(/v-header-avatar/)){
              alert.style.top = `${s.target.getBoundingClientRect().top + 60}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 0}px`;
          }else
          if(s.target.classList.value.match(/v-header__cover/)){
              alert.style.top = `${s.target.getBoundingClientRect().top + 300}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 0}px`;
          }else
          if(s.target.classList.value.match(/comment__avatar__image|content-header-author__avatar|subsite-card__avatar/)){
              alert.style.top = `${s.target.getBoundingClientRect().top - 25}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 20}px`;
          }else
          if(s.target.classList.value.match(commentsRightBarFilter)){
              alert.style.top = `${s.target.getBoundingClientRect().top - 25}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 20}px`;
          }else
          {
              alert.style.top = `${s.target.getBoundingClientRect().top + 300}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 0}px`;
          }
          alert.style.background = 'rgb(165 235 189)';
          alert.style.borderRadius = '3px';
          alert.style.padding = '3px';
          alert.style.color = 'rgb(0 0 0)';
          alert.style.fontSize = '12px';
          alert.style.lineHeight = '12px';
          alert.style.fontWeight = '500';
          alert.style.boxShadow = '0px 0px 6px 1px black';
          s.target.parentNode.appendChild(alert);
              setTimeout(() => {
                  if(document.querySelector(`div[class='avatar-link-copyed']`)){
                      document.querySelector(`div[class='avatar-link-copyed']`).remove();
                  }
              }, 2000);
          }
      }else
      if(!s.target.classList.value.match(mainFilter) && button1Pressed && !button2Pressed && !button3Pressed){
        hovered = false;
          if(document.querySelector(`div[class='avatar-preview']`)){
              document.querySelector(`div[class='avatar-preview']`).remove();
          }
      }else
      if(!s.target.classList.value.match(mainFilter) && !button1Pressed && !button2Pressed){
        hovered = false;
          if(!useButton1ForAvatarView){
              if(document.querySelector(`div[class='avatar-preview']`)){
                  document.querySelector(`div[class='avatar-preview']`).remove();
              }
          }
      }
  }
  document.addEventListener('keydown', kDown, true)
  function kDown(s){
      if(s.code === `${button1}Left`||s.code === `${button1}Right`||s.code === `${button1}`){
          button1Pressed = true;
        if(hovered){
          hovered.dispatchEvent(new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
          }));
        }
      }else
      if(s.code === `${button2}Left`||s.code === `${button2}Right`||s.code === `${button2}`){
          button2Pressed = true;
          if(hovered){
            hovered.dispatchEvent(new MouseEvent('mouseover', {
              view: window,
              bubbles: true,
              cancelable: true
            }));
          }
      }else
      if(s.code === `${button3}Left`||s.code === `${button3}Right`||s.code === `${button3}`){
          button3Pressed = true;
        if(hovered){
          hovered.dispatchEvent(new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
          }));
        }
      }
  }
  document.addEventListener('keyup', kUp, true)
  function kUp(s){
      if(s.code === `${button1}Left`||s.code === `${button1}Right`||s.code === `${button1}`){
          button1Pressed = false;
      }else
      if(s.code === `${button2}Left`||s.code === `${button2}Right`||s.code === `${button2}`){
          button2Pressed = false;
      }else
      if(s.code === `${button3}Left`||s.code === `${button3}Right`||s.code === `${button3}`){
          button3Pressed = false;
          if(document.querySelector(`div[class='srcSearch']`)){
              document.querySelector(`div[class='srcSearch']`).remove();
          }
      }
      if(document.querySelector(`div[class='avatar-preview']`)){
          document.querySelector(`div[class='avatar-preview']`).remove();
      }
  }
  ///
}
})();