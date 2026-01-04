// ==UserScript==
// @name        No SPAM en Disqus
// @version     1.0
// @description Elimina/oculta comentarios spam mediante palabras clave
// @author      Amir Torrez
// @license     CC BY-NC-SA 4.0 
// @namespace   https://greasyfork.org/users/433508
// @match       *://disqus.com/*
// @grant       none
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/480367/No%20SPAM%20en%20Disqus.user.js
// @updateURL https://update.greasyfork.org/scripts/480367/No%20SPAM%20en%20Disqus.meta.js
// ==/UserScript==

function unChapuzator()
{
  // Palabras claves para ocultar comentarios
  const CONT_SPAM = [
    "pole", "Legal y válida", "https://uploads.disquscdn.com/images/a3f04816379cd0dcd88b29c969241d8419f45cc08cc91159ff1404dab7fc9efe.jpg"
  ];

  // true = Reemplazar el comentario con un mensaje
  // false = Eliminar el comentario
  const CONT_SHOW = true;

  // Estilo CSS para el contenido a "ocultar"
  const CONT_STYLE = "background:#F08080;text-align:center;font-size:20px;padding:10px;color:#fff;";

  // Contenido con el cual reemplazar el comentario
  const CONT_TEXT = "SPAM";



  const COMMENTS = document.getElementsByClassName("post-message");

  for (let i = 0; i < COMMENTS.length; i++)
  {

    let post = COMMENTS[i].firstChild;
    let cont = post.firstChild;

    if (CONT_SPAM.some(v => cont.innerHTML.includes(v)))
    {
      if(CONT_SHOW === true)
      {
        COMMENTS[i].closest('.post-content').style = CONT_STYLE;
        COMMENTS[i].closest('.post-content').innerHTML = CONT_TEXT;
      }
      else
      {
          COMMENTS[i].closest('.post-content').style = "display:none";
      }

    }

  }

}

document.addEventListener('DOMNodeInserted', unChapuzator, false);