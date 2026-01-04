// ==UserScript==
// @name         XEROX AIMBOT
// @namespace    http://tampermonkey.net/
// @version      2025-03-01
// @description  free code (no buy) in 10 likes
// @author       skibidi sigma
// @match        https://www.starve.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=starve.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528438/XEROX%20AIMBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/528438/XEROX%20AIMBOT.meta.js
// ==/UserScript==

const correctPassword = "9441";

function checkPassword() {
    const input = prompt("Введите пароль от XEROX:");

    if (input === correctPassword) {
        alert("Правильно! Пропускаем на сайт.");
        // Действие после успешного ввода пароля
        // Например, показ содержимого сайта
        document.getElementById('content').style.display = 'block';
    } else {
        alert("Пароль неверный!");
        checkPassword(); // Повторяем запрос пароля
    }
}

// Запускаем проверку пароля
checkPassword();

// Предположим, что у вас есть массив игроков
let players = [
  { name: 'Player1', x: 100, y: 200 },
  { name: 'Player2', x: 300, y: 400 },
  // Добавьте больше игроков, если необходимо
];

// Функция для вычисления расстояния между двумя точками
function distanceBetween(player1, player2) {
  return Math.sqrt(
    Math.pow(player1.x - player2.x, 2) +
    Math.pow(player1.y - player2.y, 2)
  );
}

// Функция для нахождения ближайшего игрока
function findClosestPlayer(currentPlayer) {
  let closestPlayer = null;
  let minDistance = Infinity;

  for (let i = 0; i < players.length; i++) {
    if (players[i].name !== currentPlayer.name) {
      const dist = distanceBetween(currentPlayer, players[i]);
      if (dist < minDistance) {
        minDistance = dist;
        closestPlayer = players[i];
      }
    }
  }

  return closestPlayer;
}

// Пример использования
const myPlayer = { name: 'MyPlayer', x: 150, y: 250 };
const nearestPlayer = findClosestPlayer(myPlayer);
console.log(`Ближайший игрок: ${nearestPlayer.name}`);
// Функция обработки события получения урона
function onPlayerDamage(player, damageAmount) {
    // Восстановление здоровья
    const healAmount = 50; // Количество восстанавливаемого здоровья
    player.health += healAmount;

    // Ограничение, чтобы здоровье не превышало максимальное значение
    if (player.health > player.maxHealth) {
        player.health = player.maxHealth;
    }
}

// Регистрация обработчика события получения урона
game.on('playerDamaged', onPlayerDamage);

