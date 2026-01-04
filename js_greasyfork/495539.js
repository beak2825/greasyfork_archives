// ==UserScript==
// @name     LiteKing Auto Spinner
// @namespace https://liteking.io/
// @version  1.0
// @description  Automatización de spinner en LiteKing
// @match https://tronking.io/games.php*
// @match https://liteking.io/*
// @match https://dogeking.io/games.php*
// @grant    none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495539/LiteKing%20Auto%20Spinner.user.js
// @updateURL https://update.greasyfork.org/scripts/495539/LiteKing%20Auto%20Spinner.meta.js
// ==/UserScript==

(function() {
  let intervalId; // Variable para almacenar el ID del intervalo
  let countdownIntervalId; // Variable para almacenar el ID del intervalo de cuenta regresiva

  // Función para hacer clic en el enlace del juego
  function clickGameLink() {
    const gameLink = document.querySelector('section a.menu_link i');
    if (gameLink) {
      gameLink.click();
    }
  }

  // Función para hacer clic en el botón de spinner
  function clickSpinnerButton() {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent.trim() === 'Free Spins: 1') {
        button.click();
        // Refrescar la página después de 5 segundos
        setTimeout(function() {
          location.reload();
        }, 20000);
        break; // Hacer clic en el primer botón que coincide y salir del bucle
      }
    }
  }

  // Función para realizar los pasos grabados
  function performSteps() {
    clickGameLink(); // Hacer clic en el enlace del juego

    // Iniciar cuenta regresiva
    let timeRemaining = 3600; // 1 hora en segundos
    updateCountdown(timeRemaining);
    countdownIntervalId = setInterval(function() {
      timeRemaining--;
      updateCountdown(timeRemaining);
      if (timeRemaining <= 0) {
        clearInterval(countdownIntervalId);
      }
    }, 4000); // Actualizar el contador cada segundo

    // Esperar unos segundos antes de hacer clic en el botón de spinner
    setTimeout(function() {
      clickSpinnerButton(); // Hacer clic en el botón de spinner
    }, 30000); // Tiempo de espera en milisegundos
  }

  // Función para actualizar el contador regresivo
  function updateCountdown(timeRemaining) {
    const countdownContainer = document.getElementById('countdown-container');
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    countdownContainer.textContent = `Próxima acción en: ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
  }

  // Función para iniciar el script
  function startScript() {
    performSteps(); // Iniciar las acciones inmediatamente
    intervalId = setInterval(performSteps, 3600000); // 3600000 milisegundos = 1 hora
    localStorage.setItem('scriptState', 'running'); // Almacenar el estado del script
  }

  // Función para detener el script
  function stopScript() {
    clearInterval(intervalId);
    clearInterval(countdownIntervalId);
    console.log('Script detenido');
    localStorage.setItem('scriptState', 'stopped'); // Almacenar el estado del script
  }

  // Crear elementos HTML para los botones y el contador regresivo
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '10px';
  container.style.left = '10px';
  container.style.zIndex = '9999';

  const startButton = document.createElement('button');
  startButton.textContent = 'Iniciar Script';
  startButton.addEventListener('click', function() {
    startScript();
    localStorage.setItem('scriptState', 'running');
  });

  const stopButton = document.createElement('button');
  stopButton.textContent = 'Detener Script';
  stopButton.addEventListener('click', function() {
    stopScript();
    localStorage.setItem('scriptState', 'stopped');
  });

  const countdownContainer = document.createElement('div');
  countdownContainer.id = 'countdown-container';
  countdownContainer.textContent = 'Próxima acción en: 1 hora';

  // Agregar elementos al contenedor
  container.appendChild(startButton);
  container.appendChild(stopButton);
  container.appendChild(countdownContainer);

  // Insertar el contenedor en el cuerpo del documento
  document.body.appendChild(container);

  // Ejecutar el script al cargar la página
  startScript();

})();
