// ==UserScript==
// @name messageBackground
// @description Adds a text background fixing the invisible gradient on some themes
// @description:ru Добавляет фон для некоторого текста, исправляя невидимый градиент в некоторых темах
// @namespace https://gitlab.com/darkrise/hikanime-scripts
// @match https://anichat.ru
// @grant none
// @version 0.31
// @icon https://shikme.ru/default_images/icon.png
// @downloadURL https://update.greasyfork.org/scripts/409165/messageBackground.user.js
// @updateURL https://update.greasyfork.org/scripts/409165/messageBackground.meta.js
// ==/UserScript==

const transparency = {
  "0": "00",
  "5": "0D",
  "10": "1A",
  "15": "26",
  "20": "33",
  "25": "40",
  "30": "4D",
  "35": "59",
  "40": "66",
  "45": "73",
  "50": "80",
  "55": "8C",
  "60": "99",
  "65": "A6",
  "70": "B3",
  "75": "BF",
  "80": "CC",
  "85": "D9",
  "90": "E6",
  "95": "F2",
  "100": "FF"
};

const genStyle = (color, strength) =>
  `.chat_message,.my_text .username,.user_lm_data .username{position:relative;padding:0 .3rem;background-color:${color}${transparency[strength]}}.cright.pheight,.my_text{z-index:1}.pheight{z-index:2}.wrap_right_data{z-index:3}.panel_bar{z-index:4}.crheight{z-index:5}.username.gradient-text::after{content:"";position:absolute;width:100%;height:100%;top:0;left:0;background-color:${color}${transparency[strength]};z-index:-1}.chat_message,.my_text .username,.my_text .username.gradient-text::after,.user_lm_data .username,.user_lm_data .username.gradient-text::after{border-radius:1rem}.chat_message{display:inherit}`;

window.addEventListener("load", () => {
  const options = JSON.parse(window.localStorage.getItem("messageOverlay")) || {
    color: "#000000",
    strength: 50
  };
  const el = document.createElement("style");
  el.type = "text/css";
  el.id = "messageOverlayStyle";
  el.appendChild(
    document.createTextNode(genStyle(options.color, options.strength))
  );
  document.head.appendChild(el);
  document.getElementById("chat_left_menu").innerHTML +=
    '<div class="list_element left_item"><div id="messageOverlayOptions" class=left_item_in><i id=messageOverlayOptionsIcon class="fa fa-tint menui"></i> Фон сообщений</div></div>';
  document.addEventListener("click", ({ target: { id } }) => {
    if (["messageOverlayOptions", "messageOverlayOptionsIcon"].includes(id)) {
      document.getElementById(
        "large_modal_content"
      ).innerHTML = `<div class="modal_wrap_top modal_top" id="modal_top_profile"><div class="cancel_modal profile_close"><i class="fa fa-times"></i></div></div><div class="pad_box"><div class="boom_form"><div class="chat_settings"><p class="label">Цвет фона</p><input id="overlayColorInput" type="color" value="${options.color}"></div><div class=сhat_settings><p class=label>Затемнение фона (<span id=messageOverlayStrengthSpan>${options.strength}</span>%)</p><input id=messageOverlayStrengthInput type=range min=0 max=100 step=5 value=${options.strength} style=width:100%></div></div></div>`;
      document.getElementById("large_modal").style.display = "block";
      document
        .getElementById("overlayColorInput")
        .addEventListener("change", ({ target: { value } }) => {
          document.getElementById("messageOverlayStyle").innerHTML = genStyle(
            value,
            options.strength
          );
          options.color = value;
          setTimeout(() => {
            window.localStorage.setItem(
              "messageOverlay",
              JSON.stringify(options)
            );
          }, 1000);
        });
      document
        .getElementById("messageOverlayStrengthInput")
        .addEventListener("input", ({ target: { value } }) => {
          document.getElementById("messageOverlayStyle").innerHTML = genStyle(
            options.color,
            value
          );
          document.getElementById(
            "messageOverlayStrengthSpan"
          ).innerHTML = value;
          options.strength = value;
          setTimeout(() => {
            window.localStorage.setItem(
              "messageOverlay",
              JSON.stringify(options)
            );
          }, 1000);
        });
    }
  });
});