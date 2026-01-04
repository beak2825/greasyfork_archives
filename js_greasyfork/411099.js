// ==UserScript==
// @name         2ch delete post with rerply
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       You
// @include http://2ch.hk/*/res/*
// @include https://2ch.hk/*/res/*
// @grant        none
// @description Добавляет кнопку для удаления постов с ответами на 2ch.hk.
// @downloadURL https://update.greasyfork.org/scripts/411099/2ch%20delete%20post%20with%20rerply.user.js
// @updateURL https://update.greasyfork.org/scripts/411099/2ch%20delete%20post%20with%20rerply.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let counterDeletePost = 0;
  const post = document.querySelectorAll(".post");

  function createButton() {
    const button = document.createElement("button");
    button.innerText = "Удалить ветку ❎";
    button.id = "__button_del";

    button.style.marginLeft = "8px";
    button.style.cursor = "pointer";
    button.style.border = "1px solid #bbb";
    button.style.font = "bold 80% arial, helvetica, sans-serif";
    button.style.color = "#555";
    button.style.borderRadius = "10px";

    return button;
  }

  for (let i = 1; i < post.length; i++) {
    const button = createButton();
    post[i].firstElementChild.append(button);
  }

  function del(numberPost) {
    const replyPost = document.querySelector(`#post-${numberPost}`);
    //существует ли пост, или уже удалили?
    if (replyPost) {
      const reply = replyPost.querySelectorAll(
        ".post__refmap > .post-reply-link"
      );
      //рекурсией проходимся по всем постам с ответами
      for (let i = 0; i < reply.length; i++) {
        del(reply[i].innerText.match(/\d+/)[0]);
      }
      //удаляем элементы ответа в постах
      const allReplyElem = document.querySelectorAll(
        `.post-reply-link[data-num="${numberPost}"]`
      );
      for (let i = 0; i < allReplyElem.length; i++) {
        allReplyElem[i].remove();
      }

      replyPost.remove();
      counterDeletePost += 1;
    }
  }

  function deletePostWithResponse() {
    const { target } = event;
    if (target.id === "__button_del") {
      const post = target.offsetParent.querySelector(".postbtn-reply-href")
        .innerText;
      del(post);
      $alert(`Постов удалено: ${counterDeletePost}`);
      counterDeletePost = 0;
    }
  }

  document.querySelector("#posts-form").onclick = deletePostWithResponse;

  //наблюдатель за новыми постами
  const fromThreads = document.querySelector(".thread");

  const observer = new MutationObserver((mutationRecords) => {
    for (const key of mutationRecords) {
      if (key.addedNodes.length > 0) {
        let button = key.addedNodes[0].querySelector("#__button_del");
        if (!button) {
          button = createButton();
          key.addedNodes[0].querySelector(".post__details").append(button);
        }
      }
    }
  });
  observer.observe(fromThreads, { childList: true });
})();
