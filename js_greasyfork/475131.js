// ==UserScript==
// @name        Script by CryptoXSS
// @namespace   https://github.com/CryptoXSS/
// @version     1.0.2
// @author      CryptoXSS
// @match       *://gota.io/*
// @icon        https://i.imgur.com/ejxjYj4.gif
// @license MIT
// @description  Es Un script sencillo, lo que hace es poner caracteres aleatorios fuera de los corchetes.
// @downloadURL https://update.greasyfork.org/scripts/475131/Script%20by%20CryptoXSS.user.js
// @updateURL https://update.greasyfork.org/scripts/475131/Script%20by%20CryptoXSS.meta.js
// ==/UserScript==


let interval;

document.addEventListener("keydown", function(event) {
  if (event.code === "KeyF") {
    if (!interval) {
      interval = setInterval(run, 1000);
      alert("Activado");
    } else {
      clearInterval(interval);
      interval = null;
      alert("Desactivado");
    }
  }
});



function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let result = "";
  const length = 10; // Puedes ajustar la longitud de caracteres raros según tu preferencia

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function run() {
  console.log("Changing skin");
  const inputElement = document.getElementsByClassName("gota-input")[0];
  const currentInputValue = inputElement.value;

  // Buscar corchetes "[" y "]"
  const startIndex = currentInputValue.indexOf("[");
  const endIndex = currentInputValue.indexOf("]");

  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    const contentBeforeBrackets = currentInputValue.slice(0, startIndex + 1);
    const contentInsideBrackets = currentInputValue.slice(startIndex + 1, endIndex);
    const contentAfterBrackets = currentInputValue.slice(endIndex + 1);

    // Generar una cadena aleatoria para reemplazar el contenido antes de los corchetes
    const newContentBeforeBrackets = generateRandomString();

    // Reemplazar el contenido antes de los corchetes y agregar un espacio
    const modifiedValue = `${newContentBeforeBrackets} [${contentInsideBrackets}]${contentAfterBrackets}`;

    inputElement.value = modifiedValue;
  } else {
    // Si no hay corchetes en el input, no se realiza ningún cambio
    // Puedes agregar aquí tu lógica adicional si es necesario
  }
}




