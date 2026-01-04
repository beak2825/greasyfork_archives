// ==UserScript==
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @name            Darkino Panel Modo
// @match           https://*.*.*/panel/admin/liens*
// @match           https://*.*.*/panel/posts/*/edit
// @match           https://*.*.*/panel/*
// @match           https://*.*.*/*
// @match           https://*.*.*.*/*
// @grant           none
// @version         1.4
// @author          Invincible812
// @description     Affiche en plus grand les tableau / Affiche-Masque le menu
// @supportURL      -
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/488624/Darkino%20Panel%20Modo.user.js
// @updateURL https://update.greasyfork.org/scripts/488624/Darkino%20Panel%20Modo.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  if(document.location.pathname.includes('panel')){
  // Récupérer l'élément
  var element = document.getElementsByClassName('fi-main-ctn w-screen flex-1 flex-col opacity-0')[0].children[1];

  // Accéder à la liste de classes
  var classes = element.classList;

  // Créer un tableau vide pour stocker les classes à supprimer
  var classesToRemove = [];

  // Boucler à travers les classes et ajouter celles à supprimer au tableau
  for (var i = 0; i < classes.length; i++) {
      if (classes[i] !== 'fi-main') {
          classesToRemove.push(classes[i]);
      }
  }

  // Supprimer les classes du tableau
  for (var i = 0; i < classesToRemove.length; i++) {
      element.classList.remove(classesToRemove[i]);
  }

//////////////////////////////////////////

  var sidebar = document.querySelector('.fi-sidebar');
  // Sélectionne l'élément parent dans lequel vous souhaitez insérer le bouton
  var parentElement = document.getElementsByClassName('flex h-16 items-center gap-x-4 bg-white px-4 shadow-sm ring-1 ring-gray-950/5 md:px-6 lg:px-8 dark:bg-gray-900 dark:ring-white/10')[0];

  // Crée un bouton pour réduire et restaurer le sidebar
  var toggleButton = document.createElement('button');
  toggleButton.textContent = 'Afficher/Masquer le menu';
  toggleButton.style.marginRight = 'auto'; // Place le bouton à gauche
  toggleButton.style.marginLeft = '10px'; // Ajoute un espacement après le bouton
  toggleButton.style.flexShrink = '0'; // Empêche le bouton de réduire lorsque le parent est réduit
  toggleButton.style.backgroundColor = '#ccc'; // Couleur de fond pour le bouton (à modifier selon vos préférences)
  toggleButton.style.border = 'none'; // Supprime la bordure du bouton
  toggleButton.style.cursor = 'pointer'; // Change le curseur au survol du bouton

  // Ajoute un écouteur d'événement pour le clic sur le bouton
  toggleButton.addEventListener('click', function() {
      // Vérifie si le sidebar est réduit ou non
      if (sidebar.style.width === '60px') {
          // Restaure la largeur normale du sidebar
          sidebar.style.width = ''; // Remarque : utilisez une chaîne vide pour supprimer le style en ligne
      } else {
          // Réduit la largeur du sidebar
          sidebar.style.width = '60px'; // Vous pouvez ajuster cette valeur selon vos préférences
      }
  });

  // Insère le bouton en premier dans l'élément parent
  parentElement.insertBefore(toggleButton, parentElement.firstChild);


    document.getElementsByClassName('fi-dropdown-header flex w-full gap-2 p-3 text-sm fi-color-gray fi-dropdown-header-color-gray')[0].insertAdjacentHTML('afterend', `
    <a href="/autopost">
  <div class="fi-dropdown-header flex w-full gap-2 p-3 text-sm fi-color-gray fi-dropdown-header-color-gray" bis_skin_checked="1">
    <svg class="fi-sidebar-item-icon h-6 w-6 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
    </svg>
    <span class="fi-dropdown-header-label flex-1 truncate text-start text-gray-700 dark:text-gray-200" style="">
    Ajouter un post
    </span>
</div></a>

<a href="/panel/my-articles/create">
  <div class="fi-dropdown-header flex w-full gap-2 p-3 text-sm fi-color-gray fi-dropdown-header-color-gray" bis_skin_checked="1">
    <svg class="fi-sidebar-item-icon h-6 w-6 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"></path>
</svg>
    <span class="fi-dropdown-header-label flex-1 truncate text-start text-gray-700 dark:text-gray-200" style="">
    Ajouter un post Manuellement
    </span>
</div></a>

<a href="/mylastcomments">
  <div class="fi-dropdown-header flex w-full gap-2 p-3 text-sm fi-color-gray fi-dropdown-header-color-gray" bis_skin_checked="1">
    <svg class="fi-sidebar-item-icon h-6 w-6 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"></path>
</svg>
    <span class="fi-dropdown-header-label flex-1 truncate text-start text-gray-700 dark:text-gray-200" style="">
    Cmts de mes liens
    </span>
</div></a>
`)

}
  ////

  if(!document.location.pathname.includes('panel')){
    document.getElementsByClassName('header-content-right')[0].children[0].insertAdjacentHTML('beforebegin', `<div class="header-element md:!px-[0.65rem] px-2 hs-dropdown !items-center ti-dropdown [--placement:bottom-left]" bis_skin_checked="1">
                      <button id="dropdown-profile" type="button" class="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent ">
                      <i class="bx bx-cog header-link-icon"></i><span class="font-semibold mb-0 leading-none text-[#536485] text ">PANEL MODO</span>
                      </button>
                      <div class="hs-dropdown-menu ti-dropdown-menu !-mt-3 border-0 w-[11rem] !p-0 border-defaultborder main-header-dropdown pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end hidden" aria-labelledby="dropdown-profile" bis_skin_checked="1" style="">

                          <ul class="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">
                              <li>
                                  <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/help-articles">
                                      <i class="ti ti-link-icon text-[1.125rem] me-2 opacity-[0.7]"></i>
                                      Aide sur les Articles                                        </a>
                              </li>

                                                                      <li>
                                      <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/posts">
                                          <i class="ti ti-file-text-ai text-[1.125rem] me-2 opacity-[0.7]"></i>

                                          Articles                                            </a>
                                  </li>
                                                                  <li>
                                  <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/admin/comments">
                                      <i class="ti ti-message text-[1.125rem] me-2 opacity-[0.7]"></i>
                                      Commentaires                                        </a>
                              </li>
                              <li>
                                  <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/links-reports">
                                      <i class="ti ti-flag text-[1.125rem] me-2 opacity-[0.7]"></i>
                                      Liens Rapportés                                        </a>
                              </li>
                              <li>
                                  <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/admin/users">

                                      <i class="ti ti-users text-[1.125rem] me-2 opacity-[0.7]"></i>
                                      Users </a>
                              </li>
                              <li>
                                  <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/admin/liens">
                                      <i class="ti ti-link text-[1.125rem] me-2 opacity-[0.7]"></i>

                                      Liens </a>
                              </li>

                                                                      <li>
                                      <a class="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex" href="/panel/admin-tickets">
                                          <i class="ti ti-ticket text-[1.125rem] me-2 opacity-[0.7]"></i>
                                          Tickets</a>
                                  </li>
                        </ul>
                      </div>
                  </div>`);
  }
});