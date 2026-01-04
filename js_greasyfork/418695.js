// ==UserScript==
// @name         messagesFilter
// @namespace    https://github.com/yegorgunko/shikme-tools
// @version      0.22
// @description  Set custom chat background
// @author       Dark Rise
// @match        https://anichat.ru
// @icon         https://shikme.ru/default_images/icon.png?v=1528136794
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418695/messagesFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/418695/messagesFilter.meta.js
// ==/UserScript==
{
  document.head.innerHTML +=
    "<style>.filtered-messages-container{overflow:auto;height:394px}</style>";
  document.getElementById("chat_left_menu").innerHTML +=
    "<div class='list_element left_item'><div id='messagesFilterOptions' class=left_item_in><i id='messagesFilterOptionsIcon' class='fa fa-filter menui'></i> Фильтр</div></div>";
  document.addEventListener("click", ({ target: { id } }) => {
    if (["messagesFilterOptions", "messagesFilterOptionsIcon"].includes(id)) {
      document.getElementById(
        "large_modal_content"
      ).innerHTML = `<div class="modal_wrap_top modal_top" id="modal_top_profile"><div class="cancel_modal profile_close"><i class="fa fa-times"></i></div></div><div class="pad_box"><div class="boom_form"><div class="chat_settings"><p class="label">Никнейм</p><input id="filterNicknameInput" class="full_input" type="text"></div><ul class="filtered-messages-container" id="filteredMessages"></ul></div></div>`;
      document.getElementById("large_modal").style.display = "block";
      const filterNicknameInput = document.getElementById(
        "filterNicknameInput"
      );
      filterNicknameInput.focus();
      filterNicknameInput.addEventListener("input", ({ target: { value } }) => {
        const filteredMessages = document.getElementById("filteredMessages");
        filteredMessages.innerHTML = "";
        for (const message of document.getElementById("chat_logs_container")
          .children) {
          if (
            value &&
            message
              .getElementsByClassName("my_text")[0]
              .getElementsByClassName("username")[0]
              .innerHTML.toLowerCase()
              .includes(value.trim().toLowerCase())
          ) {
            filteredMessages.prepend(message.cloneNode(true));
          }
        }
      });
    }
  });
};
