// ==UserScript==
// @name        DTF.ru. Show me avatars. Without button press for avatar showing
// @namespace   Violentmonkey Scripts
// @match       https://dtf.ru/*
// @grant       none
// @version     1.3.1
// @author      Tentacle Tenticals
// @description Показ аватарок пользователей, а также копирование ссылки на аватарку. Курсор на аватарку и Ctrl для её показа, или Ctrl+Shift для копирования URL ссылки в буфер обмена.
// @homepage https://github.com/TentacleTenticals/DTF-showAvatar
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443134/DTFru%20Show%20me%20avatars%20Without%20button%20press%20for%20avatar%20showing.user.js
// @updateURL https://update.greasyfork.org/scripts/443134/DTFru%20Show%20me%20avatars%20Without%20button%20press%20for%20avatar%20showing.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
    
  window.addEventListener('load', run)

  function run(){
  console.log('Loaded!');
  let mainFilter = new RegExp(`comment__avatar|content-header-author__avatar|subsite-card__avatar|v-header__cover|v-header-avatar|${document.querySelector("div[class='layout__right-column'] div[style^='background-image").className}`),
    commentsRightBarFilter = new RegExp(document.querySelector("div[class='layout__right-column'] div[style^='background-image").className),
    ctrlPressed, shiftPressed, hovered,
    // Настройки максимального размера превью аватарки
    userAvatarSize = '400px', // Аватарка пользователя (комментарий)
    userProfileCoverSizeWidth = '990px', // Обложка пользователя в профиле (длина)
    userProfileCoverSizeHeight = '400px', // Обложка пользователя в профиле (ширина)
    userProfileAvatarSize = '400px', // Аватар пользователя в профиле
    authorAvatarSizeHeader = '400px', // Аватарка подсайта статьи (хеадер)
    authorAvatarSizeFooter = '400px', // Аватарка автора статьи (футер)
    userAvatarSizeCommentsPanel = '250px'; // Аватарка пользователя (боковая панель комментариев, aka "live-список" комментариев к статьям)
  document.addEventListener('mouseover', hover, true);
  function hover(s){
    /* Аватарка пользователя в комментарии / Аватарка автора статьи в хеадере (шапке) / Аватарка автора статьи в футере (конце статьи) / 
  Аватарка пользователя в комментарии в 'live-списке' комментариев справа */
      if(s.target.classList.value.match(mainFilter) && !ctrlPressed && !shiftPressed){
        hovered = s.target;
          if(!document.querySelector(`div[class='avatar-preview']`)){
              let img = new Image();
              img.src = s.target.style.backgroundImage.replace(/.+(http.+)\/-\/scale.+/, '$1');
              let avatarPreview = document.createElement('div');
              avatarPreview.className = 'avatar-preview';
              avatarPreview.style.position = 'fixed';
              avatarPreview.style.zIndex = '1000';
          if(s.target.classList.value.match(/comment__avatar/)){
              avatarPreview.style.top = `${s.target.getBoundingClientRect().top + 20}px`;
              avatarPreview.style.left = `${s.target.getBoundingClientRect().left + 40}px`;
              img.style.maxWidth = userAvatarSize;
              img.style.maxHeight = userAvatarSize;
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
            img.style.borderRadius = '3px';
            img.style.backgroundColor = 'rgb(0, 0, 0)';
            img.style.boxShadow = '0px 0px 6px 2px black';
            s.target.parentNode.appendChild(avatarPreview);
            document.querySelector(`div[class='avatar-preview']`).appendChild(img);
          }
      }else
      if(s.target.classList.value.match(mainFilter) && ctrlPressed && shiftPressed){
        hovered = s.target;
          navigator.clipboard.writeText(s.target.style.backgroundImage.replace(/.+(http.+)\/-\/scale.+/, '$1'));
          if(!document.querySelector(`div[class='avatar-link-copyed']`)){
          let alert = document.createElement('div');
          alert.className = 'avatar-link-copyed';
          alert.textContent = 'Ссылка на аватарку успешно скопирована';
          alert.style.position = 'fixed';
          alert.style.zIndex = '1000';
          if(s.target.classList.value.match(/v-header-avatar|v-header__cover/)){
              alert.style.top = `${s.target.getBoundingClientRect().top + 300}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 0}px`;
          }else
          if(s.target.classList.value.match(/comment__avatar|content-header-author__avatar|subsite-card__avatar/)){
              alert.style.top = `${s.target.getBoundingClientRect().top - 25}px`;
              alert.style.left = `${s.target.getBoundingClientRect().left + 20}px`;
          }else
          if(s.target.classList.value.match(commentsRightBarFilter))
          {
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
      if(!s.target.classList.value.match(mainFilter) && ctrlPressed && !shiftPressed){
        hovered = false;
          if(document.querySelector(`div[class='avatar-preview']`)){
              document.querySelector(`div[class='avatar-preview']`).remove();
          }
      }else
      if(!s.target.classList.value.match(mainFilter) && ctrlPressed && !shiftPressed){
        hovered = false;
          if(document.querySelector(`div[class='avatar-preview']`)){
              document.querySelector(`div[class='avatar-preview']`).remove();
          }
      }else
      if(!s.target.classList.value.match(mainFilter) && !ctrlPressed && !shiftPressed){
        hovered = false;
          if(document.querySelector(`div[class='avatar-preview']`)){
            document.querySelector(`div[class='avatar-preview']`).remove();
        }
      }
  }
  document.addEventListener('keydown', kDown, true)
  function kDown(s){
      if(s.code === 'ControlLeft'||s.code === 'ControlRight'){
          ctrlPressed = true;
        if(hovered){
          hovered.dispatchEvent(new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
          }));
        }
      }else
      if(s.code === 'ShiftLeft'||s.code === 'ShiftRight'){
          shiftPressed = true;
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
      if(s.code === 'ControlLeft'||s.code === 'ControlRight'){
          ctrlPressed = false;
      }else
      if(s.code === 'ShiftLeft'||s.code === 'ShiftRight'){
          shiftPressed = false;
      }
      if(document.querySelector(`div[class='avatar-preview']`)){
          document.querySelector(`div[class='avatar-preview']`).remove();
      }
  }
}
})();