// ==UserScript==
// @name        ECCB
// @namespace   InGame
// @match       https://www.dreadcast.net/Main
// @grant GM_addStyle
// @version     1.2
// @author      Isilin/Pelagia
// @date        26/02/2024
// @description Editeur de Commentaires de Conteneurs en Banque
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/488837/ECCB.user.js
// @updateURL https://update.greasyfork.org/scripts/488837/ECCB.meta.js
// ==/UserScript==

GM_addStyle(`
    #liste_stocks .nom_item {
      top: 28px !important;
    }

    .nm_description_item_named_bank {
      position: absolute;
      top: 45px;
      right: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      width: 160px;
      max-height: 50px;
    }

    .nm_description_item_named_bank span {
      max-height: 30px;
    }

    .nm_description_item_named_bank .btnTxt {
      min-width: 50px;
      max-width: 50px;
      left: unset !important;
      top: unset !important;
      margin-left: 0 !important;
      margin-top: 0 !important;
    }

    .nm_description_box {
      left: 97px;
      top: 20px;
      inline-size: 350px;
      max-height: 15px;
      overflow: hidden;
    }
`)

// ===== Core =====

function getDescription(index) {
  let jsonData = {}
  const data = localStorage.getItem('descriptionBankBags');
  if (data != null) {
    jsonData = JSON.parse(data);
  }
  return jsonData[index] || '';
}

function setDescription(index, description) {
  console.log(index);
  if (description != null && description.length > 0) {
    let jsonData = {}
    const data = localStorage.getItem('descriptionBankBags');
    if (data != null) {
      jsonData = JSON.parse(data);
    }
    jsonData[index] = description;
    console.log(JSON.stringify(jsonData));
    localStorage.setItem("descriptionBankBags",JSON.stringify(jsonData));
  }
}

// ===== Logic =====

function customDescription(index) {
  var input = prompt('Saisissez la description de votre coffre :', getDescription(index));
  if (input != null) {
    setDescription(index, input);
    $(`#nm_description_text_${index}`).text(input);
  }
}

// ===== UI =====
$(document).ready(function () {
  $(document).ajaxSuccess(function (e, xhr, opt) {
    if (opt.url.includes("Company/Account/View")) {
      for (var i = 1 ; i <= 10 ; ++i) {
        $(`.stock${i}`).append(`<div class="nm_description_item_named_bank" id="nm_edit_description_block_${i}"></div>`);
        $(`.stock${i}`).append(`<div class="nm_description_box" id="nm_description_text_${i}">${getDescription(i)}</div>`);
        $(`#nm_edit_description_block_${i}`).append(`<div class="btnTxt" style="top:19px;left:50%;margin-left:-48px;margin-top:-20px;" id="nm_edit_description_${i}">Editer</div>`);
        $(`#nm_edit_description_${i}`).click({index: i}, (event) => customDescription(event.data.index))
      }
    }
  });
});