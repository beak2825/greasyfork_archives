// ==UserScript==
// @name eMikill AnimeFire Mod
// @namespace http://tampermonkey.net/
// @version 0.3
// @description Modificação para o site AnimeFire feita por Mikill
// @author Mikill
// @match https://animefire.net/*
// @icon https://animefire.net/uploads/cmt/317030_1688556659.webp
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469757/eMikill%20AnimeFire%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/469757/eMikill%20AnimeFire%20Mod.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let overlay = null;
  let colorInput = null;
  let okButton = null;

  function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function clearHTML() {
    document.documentElement.innerHTML = '';
    location.reload();
  }

  function removeCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function switchOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      overlay.style.zIndex = '9998';

      let closeButton = document.createElement('button');
      closeButton.innerHTML = 'X';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.width = '30px';
      closeButton.style.height = '30px';
      closeButton.style.fontSize = '16px';
      closeButton.style.fontWeight = 'bold';
      closeButton.style.color = 'white';
      closeButton.style.backgroundColor = 'red';
      closeButton.addEventListener('click', closeHUD);
      overlay.appendChild(closeButton);

      let buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'absolute';
      buttonContainer.style.top = '50%';
      buttonContainer.style.left = '50%';
      buttonContainer.style.transform = 'translate(-50%, -50%)';

      let changeColorButton = createButton('Mudar InputColor do Fundo', switchColorInput);
      buttonContainer.appendChild(changeColorButton);

      let changeBackgroundButton = createButton('Mudar Fundo', switchBackgroundInput);
      buttonContainer.appendChild(changeBackgroundButton);

       let siteAcesso = createButton('Abrir Site', handleClicksiteAcesso);
       buttonContainer.appendChild(siteAcesso);

      let convertPlayerButton = createButton('Converter Player', transformPlayer);
      buttonContainer.appendChild(convertPlayerButton);

      let originalButton = createButton('Fundo Original', resetBackground);
      buttonContainer.appendChild(originalButton);

      colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.style.display = 'none';
      buttonContainer.appendChild(colorInput);

      okButton = document.createElement('button');
      okButton.innerHTML = 'OK';
      okButton.style.display = 'none';
      okButton.style.width = '40px';
      okButton.style.height = '20px';
      okButton.addEventListener('click', applyColor);
      buttonContainer.appendChild(okButton);

      overlay.appendChild(buttonContainer);
      document.body.appendChild(overlay);
    } else {
      closeHUD();
    }
  }

  function createButton(text, onClick) {
    let button = document.createElement('button');
    button.innerHTML = text;
    button.style.display = 'block';
    button.style.width = '200px';
    button.style.height = '40px';
    button.style.marginBottom = '10px';
    button.addEventListener('click', onClick);
    return button;

}

  function handleClicksiteAcesso() {
    window.open('https://mikill73.github.io/AnimeFireMod/', '_blank');
  }

  function closeHUD() {
    overlay.parentNode.removeChild(overlay);
    overlay = null;
  }
function transformPlayer() {
  let videoElements = document.querySelectorAll('video');

  if (videoElements.length > 0) {
    videoElements.forEach(videoElement => {
      let videoLink = videoElement.getAttribute('src');

      if (videoLink) {
        console.log('Player Link:', videoLink);
        window.open(videoLink, '_blank').focus();
      } else {
        console.log('Link de player não encontrado.');
      }
    });
  } else {
    console.log('Nenhum elemento de vídeo encontrado.');
  }
}

transformPlayer();


  function switchColorInput() {
    if (colorInput.style.display === 'none') {
      colorInput.style.display = 'block';
      okButton.style.display = 'block';
    } else {
      colorInput.style.display = 'none';
      okButton.style.display = 'none';
    }
  }

  function switchBackgroundInput() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', handleFileUpload);
    input.click();
  }

  function handleFileUpload(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
      let imageDataURL = e.target.result;
      document.body.style.backgroundImage = 'url(' + imageDataURL + ')';
      localStorage.setItem('backgroundImage', imageDataURL);
    };

    reader.readAsDataURL(file);
  }

  function applyColor() {
    let selectedColor = colorInput.value;
    document.body.style.backgroundColor = selectedColor;
    setCookie('background', selectedColor);
    colorInput.style.display = 'none';
    okButton.style.display = 'none';
  }

  function resetBackground() {
    document.body.style.backgroundColor = '';
    removeCookie('background');
    localStorage.removeItem('backgroundImage');
    location.reload();
  }

  let menuButton = null;

  function loadBackgroundFromLocalStorage() {
    let backgroundImage = localStorage.getItem('backgroundImage');
    if (backgroundImage) {
      document.body.style.backgroundImage = 'url(' + backgroundImage + ')';
    }

    let cacheCookie = getCookie('cache');
    let prmtCookie = getCookie('prmt');

    if (cacheCookie && prmtCookie) {
if (!menuButton) {
  menuButton = document.createElement('button');
  menuButton.innerHTML = '[ MENU ]';
  menuButton.style.position = 'fixed';
  menuButton.style.top = '0px';
  menuButton.style.left = '2px';
  menuButton.style.zIndex = '9998';
  menuButton.style.padding = '10px 20px';
  menuButton.style.fontSize = '16px';
  menuButton.style.fontWeight = 'bold';
  menuButton.style.border = 'none';
  menuButton.style.borderRadius = '20px';
  menuButton.style.color = 'white';
  menuButton.style.backgroundColor = '#21D3FF';

  menuButton.addEventListener('click', function() {
    switchOverlay();
  });

  document.body.appendChild(menuButton);
      }
    } else {
      if (menuButton) {
        menuButton.parentNode.removeChild(menuButton);
        menuButton = null;
      }
    }
  }

  setInterval(loadBackgroundFromLocalStorage, 2000);
})();
