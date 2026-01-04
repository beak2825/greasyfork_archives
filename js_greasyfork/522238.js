// ==UserScript==
// @name         MZ Tactics Selector (Old)
// @namespace    douglaskampl
// @version      old
// @description  Adds a dropdown menu with overused tactics and lets you save your own tactics for quick access later on.
// @author       Douglas Vieira
// @match        https://www.managerzone.com/?p=tactics
// @match        https://www.managerzone.com/?p=national_teams&sub=tactics&type=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://unpkg.com/jssha@3.3.0/dist/sha256.js
// @require      https://unpkg.com/i18next@21.6.3/i18next.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522238/MZ%20Tactics%20Selector%20%28Old%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522238/MZ%20Tactics%20Selector%20%28Old%29.meta.js
// ==/UserScript==

GM_addStyle(`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');

  @keyframes modalFadeIn {
    0% {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes modalFadeOut {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
  }
  
  .swal2-popup.swal-mz-popup {
    background: #1a1f36;
    border-radius: 12px;
    padding: 24px;
    width: 95%;
    max-width: 400px;
    text-align: center;
    transform-origin: center center;
  }

  .swal2-popup.swal-mz-popup.modalFadeIn {
    animation: modalFadeIn 0.4s ease-out forwards;
  }

  .swal2-popup.swal-mz-popup.modalFadeOut {
    animation: modalFadeOut 0.4s ease-in forwards;
  }

  .swal2-title.swal-mz-title {
    color: #e5e7eb;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .swal2-html-container.swal-mz-html-container {
    color: #94a3b8;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    margin: 12px 0;
  }

  .swal2-input.swal-mz-input,
  .swal2-textarea.swal-mz-input {
    display: block;
    background: #2a3146;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #e5e7eb;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    margin: 12px auto;
    padding: 8px 12px;
    width: 80%;
    max-width: 300px;
    box-sizing: border-box;
    resize: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    text-align: left;
  }

  .swal2-textarea.swal-mz-input {
    height: 200px !important;
  }

  .swal2-input.swal-mz-input:focus,
  .swal2-textarea.swal-mz-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  .swal2-validation-message.swal-mz-validation {
    background: #292524;
    color: #fecaca;
    font-size: 13px;
    margin: 8px 0;
    padding: 8px;
  }

  .swal2-actions.swal-mz-actions {
    margin: 24px 0 0;
    gap: 8px;
  }

  .swal2-container .swal2-actions button.swal2-styled.swal-mz-confirm,
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-cancel {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    padding: 10px 20px !important;
    border-radius: 6px !important;
    margin: 0 !important;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease !important;
    border: none !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
    transform: translateY(0) !important;
    min-width: 100px !important;
    cursor: pointer;
  }

  .swal2-container .swal2-actions button.swal2-styled.swal-mz-confirm {
    background: #4f46e5 !important;
    color: white !important;
  }

  .swal2-container .swal2-actions button.swal2-styled.swal-mz-confirm:hover {
    background: #4338ca !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2) !important;
  }

  .swal2-container .swal2-actions button.swal2-styled.swal-mz-cancel {
    background: #374151 !important;
    color: #e5e7eb !important;
  }

  .swal2-container .swal2-actions button.swal2-styled.swal-mz-cancel:hover {
    background: #4b5563 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2) !important;
  }

  .swal2-container .swal2-actions button.swal2-styled:focus {
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3) !important;
    outline: none !important;
  }
`);

(function () {
  "use strict";

  console.log("[MZ Tactics Selector] Iniciando script...");

  const SWAL_CONSTANTS = {
    ICONS: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning'
    },
  };
  console.log("[MZ Tactics Selector] SWAL_CONSTANTS carregadas:", SWAL_CONSTANTS);

  const SWAL_CUSTOM_CLASS = {
    popup: 'swal-mz-popup',
    title: 'swal-mz-title',
    htmlContainer: 'swal-mz-html-container',
    input: 'swal-mz-input',
    validationMessage: 'swal-mz-validation',
    actions: 'swal-mz-actions',
    confirmButton: 'swal-mz-confirm',
    cancelButton: 'swal-mz-cancel',
    closeButton: 'swal-mz-close'
  };
  console.log("[MZ Tactics Selector] SWAL_CUSTOM_CLASS definida:", SWAL_CUSTOM_CLASS);

  const showAlert = async (options) => {
    console.log("[showAlert] Exibindo alerta com opções:", options);
    const defaultOptions = {
      customClass: SWAL_CUSTOM_CLASS,
      buttonsStyling: true,
      showClass: {
        popup: 'swal-mz-popup modalFadeIn'
      },
      hideClass: {
        popup: 'modalFadeOut'
      },
      allowOutsideClick: true,
      allowEscapeKey: true
    };

    if (options.customClass) {
      options.customClass = { ...SWAL_CUSTOM_CLASS, ...options.customClass };
    }

    return Swal.fire({
      ...defaultOptions,
      ...options
    });
  };

  const showSuccessMessage = async (title, text) => {
    console.log("[showSuccessMessage] Título:", title, "Texto:", text);
    return showAlert({
      title,
      text,
      icon: SWAL_CONSTANTS.ICONS.SUCCESS
    });
  };

  const showErrorMessage = async (title, text) => {
    console.log("[showErrorMessage] Título:", title, "Texto:", text);
    return showAlert({
      title,
      text,
      icon: SWAL_CONSTANTS.ICONS.ERROR
    });
  };

  let dropdownMenuTactics = [];

  const defaultTacticsDataUrl =
    "https://u18mz.vercel.app/mz/userscript/tactics/json/defaultTactics.json";
  console.log("[MZ Tactics Selector] defaultTacticsDataUrl =", defaultTacticsDataUrl);

  let activeLanguage;

  const baseFlagUrl = "https://raw.githubusercontent.com/lipis/flag-icons/d6785f2434e54e775d55a304733d17b048eddfb5/flags/4x3/";
  const languages = [
    { code: "en", name: "English", flag: `${baseFlagUrl}gb.svg` },
    { code: "pt", name: "Português", flag: `${baseFlagUrl}br.svg` },
    { code: "zh", name: "中文", flag: `${baseFlagUrl}cn.svg` },
    { code: "sv", name: "Svenska", flag: `${baseFlagUrl}se.svg` },
    { code: "no", name: "Norsk", flag: `${baseFlagUrl}no.svg` },
    { code: "da", name: "Dansk", flag: `${baseFlagUrl}dk.svg` },
    { code: "es", name: "Español", flag: `${baseFlagUrl}ar.svg` },
    { code: "pl", name: "Polski", flag: `${baseFlagUrl}pl.svg` },
    { code: "nl", name: "Nederlands", flag: `${baseFlagUrl}nl.svg` },
    { code: "id", name: "Bahasa Indonesia", flag: `${baseFlagUrl}id.svg` },
    { code: "de", name: "Deutsch", flag: `${baseFlagUrl}de.svg` },
    { code: "it", name: "Italiano", flag: `${baseFlagUrl}it.svg` },
    { code: "fr", name: "Français", flag: `${baseFlagUrl}fr.svg` },
    { code: "ro", name: "Română", flag: `${baseFlagUrl}ro.svg` },
    { code: "tr", name: "Türkçe", flag: `${baseFlagUrl}tr.svg` },
    { code: "ko", name: "한국어", flag: `${baseFlagUrl}kr.svg` },
    { code: "ru", name: "Русский", flag: `${baseFlagUrl}ru.svg` },
    { code: "ar", name: "العربية", flag: `${baseFlagUrl}sa.svg` },
  ];
  console.log("[MZ Tactics Selector] Lista de idiomas suportados:", languages);

  const strings = {
    addButton: "",
    addWithXmlButton: "",
    deleteButton: "",
    renameButton: "",
    updateButton: "",
    clearButton: "",
    resetButton: "",
    importButton: "",
    exportButton: "",
    usefulLinksButton: "",
    aboutButton: "",
    tacticNamePrompt: "",
    addAlert: "",
    deleteAlert: "",
    renameAlert: "",
    updateAlert: "",
    clearAlert: "",
    resetAlert: "",
    importAlert: "",
    exportAlert: "",
    deleteConfirmation: "",
    updateConfirmation: "",
    clearConfirmation: "",
    resetConfirmation: "",
    invalidTacticError: "",
    noTacticNameProvidedError: "",
    alreadyExistingTacticNameError: "",
    tacticNameMaxLengthError: "",
    noTacticSelectedError: "",
    duplicateTacticError: "",
    noChangesMadeError: "",
    invalidImportError: "",
    modalContentInfoText: "",
    modalContentFeedbackText: "",
    usefulContent: "",
    tacticsDropdownMenuLabel: "",
    languageDropdownMenuLabel: "",
    errorTitle: "",
    doneTitle: "",
    confirmationTitle: "",
    deleteTacticConfirmButton: "",
    cancelConfirmButton: "",
    updateConfirmButton: "",
    clearTacticsConfirmButton: "",
    resetTacticsConfirmButton: "",
    addConfirmButton: "",
    xmlValidationError: "",
    xmlParsingError: "",
    xmlPlaceholder: "",
    tacticNamePlaceholder: ""
  };

  const elementStringKeys = {
    add_tactic_button: "addButton",
    add_tactic_with_xml_button: "addWithXmlButton",
    delete_tactic_button: "deleteButton",
    rename_tactic_button: "renameButton",
    update_tactic_button: "updateButton",
    clear_tactics_button: "clearButton",
    reset_tactics_button: "resetButton",
    import_tactics_button: "importButton",
    export_tactics_button: "exportButton",
    about_button: "aboutButton",
    tactics_dropdown_menu_label: "tacticsDropdownMenuLabel",
    language_dropdown_menu_label: "languageDropdownMenuLabel",
    info_modal_info_text: "modalContentInfoText",
    info_modal_feedback_text: "modalContentFeedbackText",
    useful_links_button: "usefulLinksButton",
    useful_content: "usefulContent",
  };

  let infoModal;
  let usefulLinksModal;

  const tacticsBox = document.getElementById("tactics_box");
  console.log("[initialize] tacticsBox:", tacticsBox);

  const tacticsPreset = document.getElementById("tactics_preset");
  console.log("[initialize] tacticsPreset:", tacticsPreset);

  const outfieldPlayersSelector = ".fieldpos.fieldpos-ok.ui-draggable:not(.substitute):not(.goalkeeper):not(.substitute.goalkeeper), .fieldpos.fieldpos-collision.ui-draggable:not(.substitute):not(.goalkeeper):not(.substitute.goalkeeper)";
  const goalkeeperSelector = ".fieldpos.fieldpos-ok.goalkeeper.ui-draggable";
  const formationTextSelector = "#formation_text";
  const tacticSlotSelector = ".ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active.invalid";
  const minOutfieldPlayers = 10;
  const maxTacticNameLength = 50;

  async function initialize() {
    console.log("[initialize] Verificando se tacticsBox existe e se é futebol...");
    if (tacticsBox) {
      activeLanguage = getActiveLanguage();
      console.log("[initialize] Idioma ativo detectado:", activeLanguage);

      i18next
        .init({
          lng: activeLanguage,
          resources: {
            [activeLanguage]: {
              translation: await (
                await fetch(
                  `https://u18mz.vercel.app/mz/userscript/tactics/json/lang/${activeLanguage}.json`
                )
              ).json(),
            },
          },
        })
        .then(() => {
          console.log("[initialize] i18next carregado com sucesso para:", activeLanguage);
          const tacticsSelectorDiv = createTacticsSelectorDiv();

          if (isFootball()) {
            console.log("[initialize] É futebol, inserindo tacticsSelectorDiv...");
            insertAfterElement(tacticsSelectorDiv, tacticsBox);
          } else {
            console.log("[initialize] Não é futebol, abortando inserção...");
          }

          const firstRow = createRow("tactics_selector_div_first_row");
          const secondRow = createRow("tactics_selector_div_second_row");

          appendChildren(tacticsSelectorDiv, [
            firstRow,
            secondRow,
            createHiddenTriggerButton(),
          ]);

          setUpFirstRow();
          setUpSecondRow();

          fetchTacticsFromGMStorage()
            .then((data) => {
              console.log("[initialize] Táticas obtidas do storage ou JSON:", data);
              const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");

              tacticsDropdownMenu.addEventListener('click', function () {
                console.log("[tacticsDropdownMenu] Clicou no dropdown. Valor atual:", this.value);
                if (this.value) {
                  handleTacticsSelection(this.value);
                }
              });

              dropdownMenuTactics = data.tactics;
              dropdownMenuTactics.sort((a, b) => {
                return a.name.localeCompare(b.name);
              });

              addTacticsToDropdownMenu(tacticsDropdownMenu, dropdownMenuTactics);

              tacticsDropdownMenu.addEventListener("change", function () {
                console.log("[tacticsDropdownMenu] onChange disparado. Valor selecionado:", this.value);
                handleTacticsSelection(this.value);
              });
            })
            .catch((err) => {
              console.error("Couldn't fetch data from json: ", err);
            });

          setModals();
          updateTranslation();
        });
    } else {
      console.log("[initialize] tacticsBox não encontrado. Script inativo nesta página.");
    }
  }

  window.addEventListener("load", function () {
    console.log("[MZ Tactics Selector] Window onload disparado. Chamando initialize...");
    initialize().catch((err) => {
      console.error("Init error: ", err);
    });
  });

  // _____Tactics Dropdown Menu_____

  function createTacticsDropdownMenu() {
    console.log("[createTacticsDropdownMenu] Criando dropdown de táticas...");
    const dropdown = document.createElement("select");
    setUpDropdownMenu(dropdown, "tactics_dropdown_menu");
    appendChildren(dropdown, [createPlaceholderOption()]);
    return dropdown;
  }

  function createHiddenTriggerButton() {
    console.log("[createHiddenTriggerButton] Criando botão oculto para tática 5-3-2...");
    const button = document.createElement("button");
    button.id = "hidden_trigger_button";
    button.textContent = "";
    button.style.visibility = "hidden";

    button.addEventListener("click", function () {
      console.log("[createHiddenTriggerButton] Botão oculto clicado. Ajustando tacticsPreset para 5-3-2...");
      tacticsPreset.value = "5-3-2";
      tacticsPreset.dispatchEvent(new Event("change"));
    });

    return button;
  }

  async function fetchTacticsFromGMStorage() {
    console.log("[fetchTacticsFromGMStorage] Iniciando leitura das táticas via GM_getValue...");
    const storedTactics = GM_getValue("ls_tactics");
    if (storedTactics) {
      console.log("[fetchTacticsFromGMStorage] Táticas encontradas no GM Storage:", storedTactics);
      return storedTactics;
    } else {
      console.log("[fetchTacticsFromGMStorage] Nenhuma tática local. Buscando JSON padrão...");
      const jsonTactics = await fetchTacticsFromJson();
      storeTacticsInGMStorage(jsonTactics);
      return jsonTactics;
    }
  }

  async function fetchTacticsFromJson() {
    console.log("[fetchTacticsFromJson] Iniciando fetch de:", defaultTacticsDataUrl);
    const response = await fetch(defaultTacticsDataUrl);
    const result = await response.json();
    console.log("[fetchTacticsFromJson] Táticas obtidas do JSON:", result);
    return result;
  }

  function storeTacticsInGMStorage(data) {
    console.log("[storeTacticsInGMStorage] Armazenando táticas localmente:", data);
    GM_setValue("ls_tactics", data);
  }

  function addTacticsToDropdownMenu(dropdown, tactics) {
    console.log("[addTacticsToDropdownMenu] Adicionando táticas ao dropdown...");
    for (const tactic of tactics) {
      const option = document.createElement("option");
      option.value = tactic.name;
      option.text = tactic.name;
      dropdown.appendChild(option);
    }
    console.log("[addTacticsToDropdownMenu] Táticas adicionadas com sucesso.");
  }

  function handleTacticsSelection(tactic) {
    console.log("[handleTacticsSelection] Tática selecionada:", tactic);
    const outfieldPlayers = Array.from(
      document.querySelectorAll(outfieldPlayersSelector)
    );
    console.log("[handleTacticsSelection] Jogadores de linha detectados:", outfieldPlayers.length);

    const selectedTactic = dropdownMenuTactics.find(
      (tacticData) => tacticData.name === tactic
    );

    if (selectedTactic) {
      console.log("[handleTacticsSelection] Tática encontrada no array local:", selectedTactic);
      if (outfieldPlayers.length < minOutfieldPlayers) {
        console.log("[handleTacticsSelection] Menos de 10 jogadores em campo, disparando hiddenTriggerButton...");
        const hiddenTriggerButton = document.getElementById("hidden_trigger_button");
        hiddenTriggerButton.click();
        setTimeout(() => rearrangePlayers(selectedTactic.coordinates), 1);
      } else {
        rearrangePlayers(selectedTactic.coordinates);
      }
    }
  }

  function rearrangePlayers(coordinates) {
    console.log("[rearrangePlayers] Reposicionando jogadores com coords:", coordinates);
    const outfieldPlayers = Array.from(
      document.querySelectorAll(outfieldPlayersSelector)
    );

    findBestPositions(outfieldPlayers, coordinates);

    for (let i = 0; i < outfieldPlayers.length; ++i) {
      outfieldPlayers[i].style.left = coordinates[i][0] + "px";
      outfieldPlayers[i].style.top = coordinates[i][1] + "px";
      removeCollision(outfieldPlayers[i]);
    }

    removeTacticSlotInvalidStatus();
    updateFormationText(getFormation(coordinates));
  }

  function findBestPositions(players, coordinates) {
    console.log("[findBestPositions] Ordenando arrays de jogadores e coords para correspondência...");
    players.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));
    coordinates.sort((a, b) => a[1] - b[1]);
  }

  function removeCollision(player) {
    if (player.classList.contains("fieldpos-collision")) {
      console.log("[removeCollision] Removendo class collision de player:", player);
      player.classList.remove("fieldpos-collision");
      player.classList.add("fieldpos-ok");
    }
  }

  function removeTacticSlotInvalidStatus() {
    const slot = document.querySelector(tacticSlotSelector);
    if (slot) {
      console.log("[removeTacticSlotInvalidStatus] Removendo status 'invalid' do slot...");
      slot.classList.remove("invalid");
    }
  }

  function updateFormationText(formation) {
    console.log("[updateFormationText] Formação calculada:", formation);
    const formationTextElement = document.querySelector(formationTextSelector);
    formationTextElement.querySelector(".defs").textContent = formation.defenders;
    formationTextElement.querySelector(".mids").textContent = formation.midfielders;
    formationTextElement.querySelector(".atts").textContent = formation.strikers;
  }

  function getFormation(coordinates) {
    let strikers = 0;
    let midfielders = 0;
    let defenders = 0;

    for (const coo of coordinates) {
      const y = coo[1];
      if (y < 103) {
        strikers++;
      } else if (y <= 204) {
        midfielders++;
      } else {
        defenders++;
      }
    }
    console.log("[getFormation] strikers:", strikers, "midfielders:", midfielders, "defenders:", defenders);
    return { strikers, midfielders, defenders };
  }

  // _____Add new tactic_____

  function createAddNewTacticButton() {
    console.log("[createAddNewTacticButton] Criando botão de adicionar tática...");
    const button = document.createElement("button");
    setUpButton(button, "add_tactic_button", strings.addButton);

    button.addEventListener("click", function () {
      addNewTactic().catch(console.error);
    });

    return button;
  }

  async function addNewTactic() {
    console.log("[addNewTactic] Disparado...");
    const outfieldPlayers = Array.from(
      document.querySelectorAll(outfieldPlayersSelector)
    );
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");

    const tacticCoordinates = outfieldPlayers.map((player) => [
      parseInt(player.style.left),
      parseInt(player.style.top),
    ]);
    console.log("[addNewTactic] Coords coletadas:", tacticCoordinates);

    if (!validateTacticPlayerCount(outfieldPlayers)) {
      console.log("[addNewTactic] Falha na contagem de players, tática inválida.");
      return;
    }

    const tacticId = generateUniqueId(tacticCoordinates);
    console.log("[addNewTactic] ID gerado para a nova tática:", tacticId);

    const isDuplicate = await validateDuplicateTactic(tacticId);
    if (isDuplicate) {
      console.log("[addNewTactic] Tática duplicada. Exibindo mensagem de erro...");
      await showErrorMessage(strings.errorTitle, strings.duplicateTacticError);
      return;
    }

    const result = await showAlert({
      title: strings.tacticNamePrompt,
      input: 'text',
      inputValue: '',
      inputValidator: (value) => {
        if (!value) {
          return strings.noTacticNameProvidedError;
        }
        if (value.length > maxTacticNameLength) {
          return strings.tacticNameMaxLengthError;
        }
        if (dropdownMenuTactics.some((t) => t.name === value)) {
          return strings.alreadyExistingTacticNameError;
        }
      },
      showCancelButton: true,
      confirmButtonText: strings.addConfirmButton,
      cancelButtonText: strings.cancelConfirmButton
    });

    const tacticName = result.value;
    if (!tacticName) {
      console.log("[addNewTactic] Criação de tática cancelada pelo usuário ou sem nome válido.");
      return;
    }

    const tactic = {
      name: tacticName,
      coordinates: tacticCoordinates,
      id: tacticId,
    };

    console.log("[addNewTactic] Salvando nova tática no storage:", tactic);
    await saveTacticToStorage(tactic);
    addTacticsToDropdownMenu(tacticsDropdownMenu, [tactic]);
    dropdownMenuTactics.push(tactic);

    const placeholderOption = tacticsDropdownMenu.querySelector('option[value=""]');
    if (placeholderOption) {
      placeholderOption.remove();
    }

    if (tacticsDropdownMenu.disabled) {
      tacticsDropdownMenu.disabled = false;
    }

    tacticsDropdownMenu.value = "";
    tacticsDropdownMenu.value = tactic.name;

    const changeEvent = new Event('change', { bubbles: true });
    tacticsDropdownMenu.dispatchEvent(changeEvent);

    handleTacticsSelection(tactic.name);
    await showSuccessMessage(strings.doneTitle, strings.addAlert.replace("{}", tactic.name));
  }

  function validateTacticPlayerCount(outfieldPlayers) {
    console.log("[validateTacticPlayerCount] Verificando contagem de jogadores em campo...");
    const isGoalkeeper = document.querySelector(goalkeeperSelector);

    outfieldPlayers = outfieldPlayers.filter(
      (player) => !player.classList.contains("fieldpos-collision")
    );
    console.log("[validateTacticPlayerCount] Jogadores de linha sem colisão:", outfieldPlayers.length);

    if (outfieldPlayers.length < minOutfieldPlayers || !isGoalkeeper) {
      console.log("[validateTacticPlayerCount] Falhou. Menos de 10 jogadores ou sem goleiro.");
      showErrorMessage(strings.errorTitle, strings.invalidTacticError);
      return false;
    }
    return true;
  }

  async function validateDuplicateTactic(id) {
    console.log("[validateDuplicateTactic] Checando duplicação para ID:", id);
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    const isDup = tacticsData.tactics.some((tactic) => tactic.id === id);
    console.log("[validateDuplicateTactic] Já existe duplicado?", isDup);
    return isDup;
  }

  async function saveTacticToStorage(tactic) {
    console.log("[saveTacticToStorage] Salvando tática:", tactic);
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    tacticsData.tactics.push(tactic);
    await GM_setValue("ls_tactics", tacticsData);
  }

  // _____Delete tactic_____

  function createDeleteTacticButton() {
    console.log("[createDeleteTacticButton] Criando botão de excluir tática...");
    const button = document.createElement("button");
    setUpButton(button, "delete_tactic_button", strings.deleteButton);

    button.addEventListener("click", function () {
      deleteTactic().catch(console.error);
    });

    return button;
  }

  async function deleteTactic() {
    console.log("[deleteTactic] Disparado...");
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const selectedTactic = dropdownMenuTactics.find(
      (tactic) => tactic.name === tacticsDropdownMenu.value
    );

    if (!selectedTactic) {
      console.log("[deleteTactic] Nenhuma tática selecionada para exclusão...");
      await showErrorMessage(strings.errorTitle, strings.noTacticSelectedError);
      return;
    }

    console.log("[deleteTactic] Tática selecionada:", selectedTactic);
    const result = await showAlert({
      text: strings.deleteConfirmation.replace("{}", selectedTactic.name),
      icon: SWAL_CONSTANTS.ICONS.WARNING,
      showCancelButton: true,
      confirmButtonText: strings.deleteTacticConfirmButton,
      cancelButtonText: strings.cancelConfirmButton
    });

    if (!result.isConfirmed) {
      console.log("[deleteTactic] Usuário cancelou a exclusão.");
      return;
    }

    console.log("[deleteTactic] Prosseguindo com exclusão no GM Storage...");
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    tacticsData.tactics = tacticsData.tactics.filter(
      (tactic) => tactic.id !== selectedTactic.id
    );
    await GM_setValue("ls_tactics", tacticsData);

    dropdownMenuTactics = dropdownMenuTactics.filter(
      (tactic) => tactic.id !== selectedTactic.id
    );

    const selectedOption = Array.from(tacticsDropdownMenu.options).find(
      (option) => option.value === selectedTactic.name
    );
    tacticsDropdownMenu.remove(selectedOption.index);

    if (tacticsDropdownMenu.options[0]?.disabled) {
      tacticsDropdownMenu.selectedIndex = 0;
    }

    await showSuccessMessage(strings.doneTitle, strings.deleteAlert.replace("{}", selectedTactic.name));
  }

  // _____Rename tactic_____

  function createRenameTacticButton() {
    console.log("[createRenameTacticButton] Criando botão de renomear tática...");
    const button = document.createElement("button");
    setUpButton(button, "rename_tactic_button", strings.renameButton);

    button.addEventListener("click", function () {
      renameTactic().catch(console.error);
    });

    return button;
  }

  async function renameTactic() {
    console.log("[renameTactic] Disparado...");
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const selectedTactic = dropdownMenuTactics.find(
      (tactic) => tactic.name === tacticsDropdownMenu.value
    );

    if (!selectedTactic) {
      console.log("[renameTactic] Nenhuma tática selecionada para renomear...");
      await showErrorMessage(strings.errorTitle, strings.noTacticSelectedError);
      return;
    }

    const oldName = selectedTactic.name;
    console.log("[renameTactic] Renomeando tática de:", oldName);

    const result = await showAlert({
      title: strings.tacticNamePrompt,
      input: 'text',
      inputValue: oldName,
      inputValidator: (value) => {
        if (!value) {
          return strings.noTacticNameProvidedError;
        }
        if (value.length > maxTacticNameLength) {
          return strings.tacticNameMaxLengthError;
        }
        if (value !== oldName && dropdownMenuTactics.some((t) => t.name === value)) {
          return strings.alreadyExistingTacticNameError;
        }
      },
      showCancelButton: true,
      confirmButtonText: strings.updateConfirmButton,
      cancelButtonText: strings.cancelConfirmButton
    });

    const newName = result.value;
    if (!newName) {
      console.log("[renameTactic] Renomeação cancelada ou sem nome válido.");
      return;
    }

    console.log("[renameTactic] Novo nome definido:", newName);
    const selectedOption = Array.from(tacticsDropdownMenu.options).find(
      (option) => option.value === selectedTactic.name
    );

    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    tacticsData.tactics = tacticsData.tactics.map((tactic) => {
      if (tactic.id === selectedTactic.id) {
        tactic.name = newName;
      }
      return tactic;
    });

    await GM_setValue("ls_tactics", tacticsData);

    dropdownMenuTactics = dropdownMenuTactics.map((tactic) => {
      if (tactic.id === selectedTactic.id) {
        tactic.name = newName;
      }
      return tactic;
    });

    selectedOption.value = newName;
    selectedOption.textContent = newName;

    await showSuccessMessage(strings.doneTitle, strings.renameAlert.replace("{}", oldName).replace("{}", newName));
  }

  // _____Update tactic_____

  function createUpdateTacticButton() {
    console.log("[createUpdateTacticButton] Criando botão de atualizar tática...");
    const button = document.createElement("button");
    setUpButton(button, "update_tactic_button", strings.updateButton);

    button.addEventListener("click", function () {
      updateTactic().catch(console.error);
    });

    return button;
  }

  async function updateTactic() {
    console.log("[updateTactic] Disparado...");
    const outfieldPlayers = Array.from(
      document.querySelectorAll(outfieldPlayersSelector)
    );
    console.log("[updateTactic] Jogadores de linha em campo:", outfieldPlayers.length);

    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const selectedTactic = dropdownMenuTactics.find(
      (tactic) => tactic.name === tacticsDropdownMenu.value
    );

    if (!selectedTactic) {
      console.log("[updateTactic] Nenhuma tática selecionada para update...");
      await showErrorMessage(strings.errorTitle, strings.noTacticSelectedError);
      return;
    }

    const updatedCoordinates = outfieldPlayers.map((player) => [
      parseInt(player.style.left),
      parseInt(player.style.top),
    ]);

    console.log("[updateTactic] Coords atualizadas:", updatedCoordinates);

    const newId = generateUniqueId(updatedCoordinates);
    console.log("[updateTactic] Novo ID gerado:", newId);

    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    const validationOutcome = await validateDuplicateTacticWithUpdatedCoord(
      newId,
      selectedTactic,
      tacticsData
    );
    console.log("[updateTactic] Resultado da validação de duplicado:", validationOutcome);

    switch (validationOutcome) {
      case "unchanged":
        console.log("[updateTactic] Nenhuma mudança foi feita nas coords.");
        await showErrorMessage(strings.errorTitle, strings.noChangesMadeError);
        return;
      case "duplicate":
        console.log("[updateTactic] Tática duplicada.");
        await showErrorMessage(strings.errorTitle, strings.duplicateTacticError);
        return;
      case "unique":
        console.log("[updateTactic] ID único, prosseguindo...");
        break;
      default:
        return;
    }

    const result = await showAlert({
      text: strings.updateConfirmation.replace("{}", selectedTactic.name),
      icon: SWAL_CONSTANTS.ICONS.WARNING,
      showCancelButton: true,
      confirmButtonText: strings.updateConfirmButton,
      cancelButtonText: strings.cancelConfirmButton
    });

    if (!result.isConfirmed) {
      console.log("[updateTactic] Usuário cancelou update.");
      return;
    }

    console.log("[updateTactic] Aplicando coords atualizadas e ID no GM Storage...");
    for (const tactic of tacticsData.tactics) {
      if (tactic.id === selectedTactic.id) {
        tactic.coordinates = updatedCoordinates;
        tactic.id = newId;
      }
    }

    for (const tactic of dropdownMenuTactics) {
      if (tactic.id === selectedTactic.id) {
        tactic.coordinates = updatedCoordinates;
        tactic.id = newId;
      }
    }

    await GM_setValue("ls_tactics", tacticsData);
    await showSuccessMessage(strings.doneTitle, strings.updateAlert.replace("{}", selectedTactic.name));
  }

  async function validateDuplicateTacticWithUpdatedCoord(
    newId,
    selectedTac,
    tacticsData
  ) {
    if (newId === selectedTac.id) {
      return "unchanged";
    } else if (tacticsData.tactics.some((tac) => tac.id === newId)) {
      return "duplicate";
    } else {
      return "unique";
    }
  }

  // _____Clear tactics_____

  function createClearTacticsButton() {
    console.log("[createClearTacticsButton] Criando botão de limpar táticas...");
    const button = document.createElement("button");
    setUpButton(button, "clear_tactics_button", strings.clearButton);

    button.addEventListener("click", function () {
      clearTactics().catch(console.error);
    });

    return button;
  }

  async function clearTactics() {
    console.log("[clearTactics] Disparado...");
    const result = await showAlert({
      text: strings.clearConfirmation,
      icon: SWAL_CONSTANTS.ICONS.WARNING,
      showCancelButton: true,
      confirmButtonText: strings.clearTacticsConfirmButton,
      cancelButtonText: strings.cancelConfirmButton
    });

    if (!result.isConfirmed) {
      console.log("[clearTactics] Usuário cancelou limpeza de táticas.");
      return;
    }

    console.log("[clearTactics] Limpando as táticas do GM Storage...");
    await GM_setValue("ls_tactics", { tactics: [] });
    dropdownMenuTactics = [];

    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    tacticsDropdownMenu.innerHTML = "";
    tacticsDropdownMenu.disabled = true;

    await showSuccessMessage(strings.doneTitle, strings.clearAlert);
  }

  // _____Reset tactics_____

  function createResetTacticsButton() {
    console.log("[createResetTacticsButton] Criando botão de reset de táticas...");
    const button = document.createElement("button");
    setUpButton(button, "reset_tactics_button", strings.resetButton);

    button.addEventListener("click", function () {
      resetTactics().catch(console.error);
    });

    return button;
  }

  async function resetTactics() {
    console.log("[resetTactics] Disparado...");
    const result = await showAlert({
      text: strings.resetConfirmation,
      icon: SWAL_CONSTANTS.ICONS.WARNING,
      showCancelButton: true,
      confirmButtonText: strings.resetTacticsConfirmButton,
      cancelButtonText: strings.cancelConfirmButton
    });

    if (!result.isConfirmed) {
      console.log("[resetTactics] Usuário cancelou reset de táticas.");
      return;
    }

    console.log("[resetTactics] Buscando táticas padrão...");
    const response = await fetch(defaultTacticsDataUrl);
    const data = await response.json();
    const defaultTactics = data.tactics;

    await GM_setValue("ls_tactics", { tactics: defaultTactics });
    dropdownMenuTactics = defaultTactics;

    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    tacticsDropdownMenu.innerHTML = "";
    tacticsDropdownMenu.appendChild(createPlaceholderOption());
    addTacticsToDropdownMenu(tacticsDropdownMenu, dropdownMenuTactics);
    tacticsDropdownMenu.disabled = false;

    await showSuccessMessage(strings.doneTitle, strings.resetAlert);
  }

  // _____Import/Export_____

  function createImportTacticsButton() {
    console.log("[createImportTacticsButton] Criando botão de importar táticas...");
    const button = document.createElement("button");
    setUpButton(button, "import_tactics_button", strings.importButton);

    button.addEventListener("click", function () {
      importTactics().catch(console.error);
    });

    return button;
  }

  function createExportTacticsButton() {
    console.log("[createExportTacticsButton] Criando botão de exportar táticas...");
    const button = document.createElement("button");
    setUpButton(button, "export_tactics_button", strings.exportButton);
    button.addEventListener("click", exportTactics);
    return button;
  }

  async function importTactics() {
    console.log("[importTactics] Disparado...");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async function (event) {
      const file = event.target.files[0];
      console.log("[importTactics] Arquivo selecionado:", file);

      const reader = new FileReader();
      reader.onload = async function (event) {
        let importedData;
        try {
          importedData = JSON.parse(event.target.result);
          console.log("[importTactics] JSON parse bem-sucedido.");
        } catch (e) {
          console.error("[importTactics] Erro no JSON parse:", e);
          await showErrorMessage(strings.errorTitle, strings.invalidImportError);
          return;
        }

        if (!importedData || !Array.isArray(importedData.tactics)) {
          console.error("[importTactics] JSON inválido ou sem array tactics.");
          await showErrorMessage(strings.errorTitle, strings.invalidImportError);
          return;
        }

        const importedTactics = importedData.tactics;
        console.log("[importTactics] Táticas importadas:", importedTactics);

        let existingTactics = await GM_getValue("ls_tactics", { tactics: [] });
        existingTactics = existingTactics.tactics;

        const mergedTactics = [...existingTactics];
        for (const importedTactic of importedTactics) {
          if (!existingTactics.some((tactic) => tactic.id === importedTactic.id)) {
            mergedTactics.push(importedTactic);
          }
        }

        console.log("[importTactics] Táticas mescladas:", mergedTactics);
        await GM_setValue("ls_tactics", { tactics: mergedTactics });

        mergedTactics.sort((a, b) => a.name.localeCompare(b.name));
        dropdownMenuTactics = mergedTactics;

        const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
        tacticsDropdownMenu.innerHTML = "";
        tacticsDropdownMenu.append(createPlaceholderOption());
        addTacticsToDropdownMenu(tacticsDropdownMenu, dropdownMenuTactics);
        tacticsDropdownMenu.disabled = false;

        await showSuccessMessage(strings.doneTitle, strings.importAlert);
      };

      reader.readAsText(file);
    };

    input.click();
  }

  function exportTactics() {
    console.log("[exportTactics] Disparado...");
    const tactics = GM_getValue("ls_tactics", { tactics: [] });
    console.log("[exportTactics] Táticas obtidas para exportar:", tactics);
    const tacticsJson = JSON.stringify(tactics);
    const blob = new Blob([tacticsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tactics.json";

    const onFocus = () => {
      console.log("[exportTactics] Foco retornado à janela, revogando URL e exibindo mensagem de sucesso.");
      window.removeEventListener('focus', onFocus);
      URL.revokeObjectURL(url);
      showSuccessMessage(strings.doneTitle, strings.exportAlert);
    };

    window.addEventListener('focus', onFocus, { once: true });
    link.click();
  }

  // _____Import as XML Button_____

  function createAddNewTacticWithXmlButton() {
    console.log("[createAddNewTacticWithXmlButton] Criando botão de adicionar tática via XML...");
    const button = document.createElement("button");
    setUpButton(button, "add_tactic_with_xml_button", strings.addWithXmlButton);

    button.addEventListener("click", function () {
      addNewTacticWithXml().catch(console.error);
    });

    return button;
  }

  async function addNewTacticWithXml() {
    console.log("[addNewTacticWithXml] Disparado...");
    const result = await showAlert({
      title: strings.addWithXmlButton,
      html:
        `<textarea id="swal-xml-input" class="swal2-textarea swal-mz-input" placeholder="${strings.xmlPlaceholder}" style="height: 200px;"></textarea>` +
        `<input id="swal-name-input" class="swal2-input swal-mz-input" placeholder="${strings.tacticNamePlaceholder}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: strings.addConfirmButton,
      cancelButtonText: strings.cancelConfirmButton,
      preConfirm: () => {
        const xml = document.getElementById('swal-xml-input').value;
        const name = document.getElementById('swal-name-input').value;
        console.log("[addNewTacticWithXml] Dados do modal => XML:", xml, "Name:", name);

        if (!xml) {
          Swal.showValidationMessage(strings.xmlValidationError);
          return false;
        }
        if (!name) {
          Swal.showValidationMessage(strings.noTacticNameProvidedError);
          return false;
        }
        if (name.length > maxTacticNameLength) {
          Swal.showValidationMessage(strings.tacticNameMaxLengthError);
          return false;
        }
        if (dropdownMenuTactics.some((t) => t.name === name)) {
          Swal.showValidationMessage(strings.alreadyExistingTacticNameError);
          return false;
        }
        return { xml, name };
      },
    });

    if (!result.value) {
      console.log("[addNewTacticWithXml] Cancelado ou sem dados válidos.");
      return;
    }

    try {
      const { xml, name } = result.value;
      console.log("[addNewTacticWithXml] Convertendo XML => JSON...");

      const newTactic = await convertXmlToTacticJson(xml, name);
      const tacticId = generateUniqueId(newTactic.coordinates);

      console.log("[addNewTacticWithXml] Novo ID gerado a partir do XML:", tacticId);
      const isDuplicate = await validateDuplicateTactic(tacticId);
      if (isDuplicate) {
        console.log("[addNewTacticWithXml] Tática duplicada (XML)!");
        await showErrorMessage(strings.errorTitle, strings.duplicateTacticError);
        return;
      }

      newTactic.id = tacticId;
      await saveTacticToStorage(newTactic);

      const tacticsDropdownMenu = document.getElementById('tactics_dropdown_menu');
      addTacticsToDropdownMenu(tacticsDropdownMenu, [newTactic]);
      dropdownMenuTactics.push(newTactic);

      tacticsDropdownMenu.value = newTactic.name;
      handleTacticsSelection(newTactic.name);

      await showSuccessMessage(strings.doneTitle, strings.addAlert.replace('{}', newTactic.name));
    } catch (error) {
      console.error('Error adding tactic as XML:', error);
      await showErrorMessage(strings.errorTitle, strings.xmlParsingError);
    }
  }

  async function convertXmlToTacticJson(xmlString, tacticName) {
    console.log("[convertXmlToTacticJson] Parsing XML...");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      console.error("[convertXmlToTacticJson] XML inválido (parsererror detectado).");
      throw new Error('Invalid XML');
    }

    const posElements = Array.from(xmlDoc.getElementsByTagName('Pos'));
    const normalPosElements = posElements.filter(el => el.getAttribute('pos') === 'normal');

    const coordinates = normalPosElements.map(el => {
      const x = parseInt(el.getAttribute('x'));
      const y = parseInt(el.getAttribute('y'));
      const htmlLeft = x - 7;
      const htmlTop = y - 9;
      return [htmlLeft, htmlTop];
    });

    console.log("[convertXmlToTacticJson] Coords obtidas do XML:", coordinates);
    return {
      name: tacticName,
      coordinates: coordinates,
    };
  }

  // _____Useful Links Button_____

  function createUsefulLinksButton() {
    console.log("[createUsefulLinksButton] Criando botão de Links úteis...");
    const button = document.createElement("button");
    setUpButton(button, "useful_links_button", strings.usefulLinksButton);

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleModal(usefulLinksModal);
    });

    return button;
  }

  function createUsefulLinksModal() {
    console.log("[createUsefulLinksModal] Criando modal de Links úteis...");
    const modal = document.createElement("div");
    setUpModal(modal, "useful_links_modal");

    const modalContent = createUsefulLinksModalContent();
    modal.appendChild(modalContent);

    return modal;
  }

  function createUsefulLinksModalContent() {
    console.log("[createUsefulLinksModalContent] Montando conteúdo do modal de Links úteis...");
    const modalContent = document.createElement("div");
    styleModalContent(modalContent);

    const usefulContent = createUsefulContent();

    const hrefs = new Map([
      ["gewlaht - BoooM", "https://www.managerzone.com/?p=forum&sub=topic&topic_id=11415137&forum_id=49&sport=soccer"],
      ["honken91 - taktikskola", "https://www.managerzone.com/?p=forum&sub=topic&topic_id=12653892&forum_id=4&sport=soccer"],
      ["peto - mix de dibujos", "https://www.managerzone.com/?p=forum&sub=topic&topic_id=12196312&forum_id=255&sport=soccer"],
      ["The Zone Chile", "https://www.managerzone.com/thezone/paper.php?paper_id=18036&page=9&sport=soccer"],
    ]);
    const usefulLinksList = createLinksList(hrefs);

    modalContent.appendChild(usefulContent);
    modalContent.appendChild(usefulLinksList);

    return modalContent;
  }

  function createUsefulContent() {
    const usefulContent = document.createElement("p");
    usefulContent.id = "useful_content";
    usefulContent.textContent = strings.usefulContent;
    return usefulContent;
  }

  function createLinksList(hrefs) {
    console.log("[createLinksList] Criando lista de links...");
    const list = document.createElement("ul");

    hrefs.forEach((href, title) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = href;
      link.textContent = title;
      listItem.appendChild(link);
      list.appendChild(listItem);
    });

    return list;
  }

  function setUsefulLinksModal() {
    console.log("[setUsefulLinksModal] Adicionando modal de links úteis ao body...");
    usefulLinksModal = createUsefulLinksModal();
    document.body.appendChild(usefulLinksModal);
  }

  // _____About button_____

  function createAboutButton() {
    console.log("[createAboutButton] Criando botão 'Sobre'...");
    const button = document.createElement("button");
    setUpButton(button, "about_button", strings.aboutButton);

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleModal(infoModal);
    });

    return button;
  }

  function createInfoModal() {
    console.log("[createInfoModal] Criando modal 'Sobre'...");
    const modal = document.createElement("div");
    setUpModal(modal, "info_modal");

    const modalContent = createModalContent();
    modal.appendChild(modalContent);

    return modal;
  }

  function createModalContent() {
    console.log("[createModalContent] Montando conteúdo do modal 'Sobre'...");
    const modalContent = document.createElement("div");
    styleModalContent(modalContent);

    const title = createTitle();
    const infoText = createInfoText();
    const feedbackText = createFeedbackText();

    modalContent.appendChild(title);
    modalContent.appendChild(infoText);
    modalContent.appendChild(feedbackText);

    return modalContent;
  }

  function createTitle() {
    const title = document.createElement("h2");
    title.id = "info_modal_title";
    title.textContent = "MZ Tactics Selector";
    title.style.fontSize = "24px";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "20px";
    return title;
  }

  function createInfoText() {
    const infoText = document.createElement("p");
    infoText.id = "info_modal_info_text";
    infoText.innerHTML = strings.modalContentInfoText;
    return infoText;
  }

  function createFeedbackText() {
    const feedbackText = document.createElement("p");
    feedbackText.id = "info_modal_feedback_text";
    feedbackText.innerHTML = strings.modalContentFeedbackText;
    return feedbackText;
  }

  function setInfoModal() {
    console.log("[setInfoModal] Adicionando modal 'Sobre' ao body...");
    infoModal = createInfoModal();
    document.body.appendChild(infoModal);
  }

  // _____Audio button_____

  const createAudioButton = () => {
    console.log("[createAudioButton] Criando botão de áudio...");
    const button = document.createElement("button");
    setUpButton(button, "audio_button", "🔊");

    const audioUrls = [
      "https://ia801901.us.archive.org/31/items/corp.-palm-mall-01-palm-mall/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20-%2003%20Special%20Discount.mp3",
      "https://ia801901.us.archive.org/31/items/corp.-palm-mall-01-palm-mall/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20-%2004%20First%20Floor.mp3",
      "https://ia801901.us.archive.org/31/items/corp.-palm-mall-01-palm-mall/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20-%2006%20Second%20Floor.mp3",
      "https://ia801901.us.archive.org/7/items/palm-mall-mars-remastered/%E7%8C%AB%20%E3%82%B7%20Corp.%20%26%20SEPHORA%E8%84%B3%E3%83%90%E3%82%A4%E3%83%96%E3%82%B9%20-%20Palm%20Mall%20Mars%20%28remastered%29%20-%2006%20Second%20floor-%20%ED%99%98%EB%8C%80%20%26%20%EC%9D%8C%EC%95%85.mp3",
      "https://ia801901.us.archive.org/7/items/palm-mall-mars-remastered/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20Mars%20%28remastered%29%20-%2001%20%E3%82%B9%E3%82%AD%E3%83%9D%E3%83%BC%E3%83%AB%E7%A9%BA%E6%B8%AFPlaza.mp3",
      "https://ia801901.us.archive.org/7/items/palm-mall-mars-remastered/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20Mars%20%28remastered%29%20-%2009%20Sembikiya%20Restaurant.mp3",
      "https://ia804504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2001%20FORUM%20%E6%B6%88%E8%B2%BB%E8%80%85-kuluttaja-.mp3",
      "https://ia904504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2002%20Pelican%20Self%20Storage%20-Tilaa%20Kaikelle-.mp3",
      "https://ia904504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2003%20%E8%B2%B7%E3%81%86%40JUMBO%20-Kauppakeskus-.mp3",
      "https://ia904504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2005%20Hesburger%20%E6%98%A0%E7%94%BB%E9%A4%A8%20-hampurilainen-.mp3",
      "https://ia804504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2006%20%E9%83%BD%E5%B8%82%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0%20Consumer%20-kahvi-.mp3",
    ];

    const audios = audioUrls.map(url => new Audio(url));

    let isPlaying = false;
    let currentAudio = null;

    button.addEventListener("click", function () {
      console.log("[audio_button] Botão de áudio clicado, isPlaying=", isPlaying);
      if (!isPlaying) {
        currentAudio = playRandomAudio(audios);
        isPlaying = true;
      } else {
        pauseAudio(currentAudio);
        isPlaying = false;
      }
      updateAudioIcon(button, isPlaying);
    });

    return button;
  };

  const playRandomAudio = (audios) => {
    console.log("[playRandomAudio] Tocando áudio aleatório...");
    if (audios.length === 0) {
      console.log("[playRandomAudio] Lista de áudio vazia, nada para reproduzir.");
      return;
    }

    const randomIdx = Math.floor(Math.random() * audios.length);
    const activeAudio = audios.splice(randomIdx, 1)[0];

    playAudio(activeAudio, audios);
    return activeAudio;
  };

  const playAudio = (currAudio, audios) => {
    console.log("[playAudio] Iniciando reprodução do áudio atual...");
    currAudio.play();
    currAudio.onended = function () {
      console.log("[playAudio] Áudio finalizou. Iniciando próximo...");
      playRandomAudio(audios);
    };
  };

  const pauseAudio = (audio) => {
    if (audio) {
      console.log("[pauseAudio] Pausando áudio atual e resetando tempo...");
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const updateAudioIcon = (button, isPlaying) => {
    button.textContent = isPlaying ? "⏸️" : "🔊";
  };

  // _____Language Dropdown Menu_____

  function createLanguageDropdownMenu() {
    console.log("[createLanguageDropdownMenu] Criando dropdown de idiomas...");
    const dropdown = document.createElement("select");
    setUpDropdownMenu(dropdown, "language_dropdown_menu");

    for (const lang of languages) {
      const option = document.createElement("option");
      option.value = lang.code;
      option.textContent = lang.name;
      if (lang.code === activeLanguage) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    }

    dropdown.addEventListener("change", function () {
      console.log("[languageDropdownMenu] onChange disparado. Novo idioma:", this.value);
      changeLanguage(this.value).catch(console.error);
    });

    return dropdown;
  }

  async function changeLanguage(languageCode) {
    try {
      console.log("[changeLanguage] Mudando idioma para:", languageCode);
      const translationDataUrl = `https://u18mz.vercel.app/mz/userscript/tactics/json/lang/${languageCode}.json`;
      const translations = await (await fetch(translationDataUrl)).json();

      i18next.changeLanguage(languageCode);
      i18next.addResourceBundle(languageCode, "translation", translations);

      GM_setValue("language", languageCode);

      updateTranslation();

      const language = languages.find((lang) => lang.code === languageCode);
      if (language) {
        const flagImage = document.getElementById("language_flag");
        flagImage.src = language.flag;
      }
    } catch (err) {
      console.error(err);
    }
  }

  function updateTranslation() {
    console.log("[updateTranslation] Atualizando strings com i18n...");
    for (const key in strings) {
      strings[key] = i18next.t(key);
    }

    for (const id in elementStringKeys) {
      const element = document.getElementById(id);
      if (id === "info_modal_info_text" || id === "info_modal_feedback_text") {
        element.innerHTML = strings[elementStringKeys[id]];
      } else {
        element.textContent = strings[elementStringKeys[id]];
      }
    }
  }

  function getActiveLanguage() {
    let language = GM_getValue("language");
    if (!language) {
      let browserLanguage = navigator.language || "en";
      browserLanguage = browserLanguage.split("-")[0];
      const languageExists = languages.some(
        (lang) => lang.code === browserLanguage
      );
      language = languageExists ? browserLanguage : "en";
    }
    console.log("[getActiveLanguage] Idioma ativo:", language);
    return language;
  }

  function isFootball() {
    const element = document.querySelector("div#tactics_box.soccer.clearfix");
    return !!element;
  }

  function appendChildren(parent, children) {
    children.forEach((ch) => {
      parent.appendChild(ch);
    });
  }

  function insertAfterElement(something, element) {
    element.parentNode.insertBefore(something, element.nextSibling);
  }

  function createTacticsSelectorDiv() {
    console.log("[createTacticsSelectorDiv] Criando div principal para o seletor de táticas...");
    const div = document.createElement("div");
    setUpTacticsSelectorDiv(div);
    return div;
  }

  function setUpTacticsSelectorDiv(div) {
    div.id = "tactics_selector_div";
    div.style.width = "100%";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "stretch";
    div.style.marginTop = "6px";
    div.style.marginLeft = "6px";
  }

  function createRow(id) {
    const row = document.createElement("div");
    row.id = id;
    row.style.display = "flex";
    row.style.justifyContent = "flex-start";
    row.style.flexWrap = "wrap";
    row.style.width = "96%";
    return row;
  }

  function setUpFirstRow() {
    console.log("[setUpFirstRow] Configurando a primeira linha (dropdowns)...");
    const firstRow = document.getElementById("tactics_selector_div_first_row");
    firstRow.style.display = "flex";
    firstRow.style.justifyContent = "space-between";
    firstRow.style.width = "77%";

    const tacticsDropdownMenuLabel = createDropdownMenuLabel(
      "tactics_dropdown_menu_label"
    );
    const tacticsDropdownMenu = createTacticsDropdownMenu();
    const tacticsDropdownGroup = createLabelDropdownMenuGroup(
      tacticsDropdownMenuLabel,
      tacticsDropdownMenu
    );

    const languageDropdownMenuLabel = createDropdownMenuLabel(
      "language_dropdown_menu_label"
    );
    const languageDropdownMenu = createLanguageDropdownMenu();
    const languageDropdownGroup = createLabelDropdownMenuGroup(
      languageDropdownMenuLabel,
      languageDropdownMenu
    );

    appendChildren(firstRow, [tacticsDropdownGroup, languageDropdownGroup]);
    appendChildren(languageDropdownGroup, [createFlagImage()]);
  }

  function setUpSecondRow() {
    console.log("[setUpSecondRow] Configurando a segunda linha (botões)...");
    const secondRow = document.getElementById("tactics_selector_div_second_row");

    const addNewTacticBtn = createAddNewTacticButton();
    const addNewTacticWithXmlBtn = createAddNewTacticWithXmlButton();
    const deleteTacticBtn = createDeleteTacticButton();
    const renameTacticBtn = createRenameTacticButton();
    const updateTacticBtn = createUpdateTacticButton();
    const clearTacticsBtn = createClearTacticsButton();
    const resetTacticsBtn = createResetTacticsButton();
    const importTacticsBtn = createImportTacticsButton();
    const exportTacticsBtn = createExportTacticsButton();
    const usefulLinksBtn = createUsefulLinksButton();
    const aboutBtn = createAboutButton();
    const audioBtn = createAudioButton();

    appendChildren(secondRow, [
      addNewTacticBtn,
      addNewTacticWithXmlBtn,
      deleteTacticBtn,
      renameTacticBtn,
      updateTacticBtn,
      clearTacticsBtn,
      resetTacticsBtn,
      importTacticsBtn,
      exportTacticsBtn,
      usefulLinksBtn,
      aboutBtn,
      audioBtn,
    ]);
  }

  function createDropdownMenuLabel(labelId) {
    console.log("[createDropdownMenuLabel] Criando label de dropdown com id:", labelId);
    const label = document.createElement("span");
    setUpDropdownMenuLabel(label, labelId, strings.languageDropdownMenuLabel);
    return label;
  }

  function createLabelDropdownMenuGroup(label, dropdown) {
    const group = document.createElement("div");
    group.style.display = "flex";
    group.appendChild(label);
    group.appendChild(dropdown);
    return group;
  }

  function setUpDropdownMenu(dropdown, id) {
    dropdown.id = id;
    dropdown.style.fontSize = "12px";
    dropdown.style.fontFamily = "Montserrat, sans-serif";
    dropdown.style.border = "none";
    dropdown.style.borderRadius = "6px";
    dropdown.style.backgroundColor = "#11112e";
    dropdown.style.color = "#e5e4e2";
    dropdown.style.padding = "3px 6px";
    dropdown.style.margin = "6px 0 6px 6px";
    dropdown.style.cursor = "pointer";
    dropdown.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    dropdown.style.outline = "none";
    dropdown.style.transition = "background-color 0.3s";

    dropdown.onmouseover = function () {
      dropdown.style.backgroundColor = "#334d77";
    };
    dropdown.onmouseout = function () {
      dropdown.style.backgroundColor = "#11112e";
    };
    dropdown.onfocus = function () {
      dropdown.style.outline = "2px solid #334d77";
    };
    dropdown.onblur = function () {
      dropdown.style.outline = "none";
    };
  }

  function setUpDropdownMenuLabel(description, id, textContent) {
    description.id = id;
    description.textContent = textContent;
    description.style.fontFamily = "Montserrat, sans-serif";
    description.style.fontSize = "13px";
    description.style.color = "#11112e";
    description.style.margin = "6px 0 12px 6px";
  }

  function setUpButton(button, id, textContent) {
    button.id = id;
    button.classList.add('mzbtn');
    button.textContent = textContent;
    button.style.fontFamily = "Montserrat, sans-serif";
    button.style.fontSize = "12px";
    button.style.color = "#e5e4e2";
    button.style.backgroundColor = "#11112e";
    button.style.padding = "4px 8px";
    button.style.marginLeft = "6px";
    button.style.marginTop = "6px";
    button.style.cursor = "pointer";
    button.style.border = "none";
    button.style.borderRadius = "6px";
    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    button.style.fontWeight = "500";
    button.style.transition = "background-color 0.3s, transform 0.3s";

    button.onmouseover = function () {
      button.style.backgroundColor = "#334d77";
      button.style.transform = "scale(1.05)";
    };
    button.onmouseout = function () {
      button.style.backgroundColor = "#11112e";
      button.style.transform = "scale(1)";
    };
    button.onfocus = function () {
      button.style.outline = "2px solid #334d77";
    };
    button.onblur = function () {
      button.style.outline = "none";
    };
  }

  function setModals() {
    console.log("[setModals] Configurando modais (Info e UsefulLinks)...");
    setInfoModal();
    setUsefulLinksModal();
    setUpModalsWindowClickListener();
  }

  function setUpModalsWindowClickListener() {
    console.log("[setUpModalsWindowClickListener] Adicionando eventListener global para esconder modais...");
    window.addEventListener("click", function (event) {
      if (usefulLinksModal.style.display === "block" && !usefulLinksModal.contains(event.target)) {
        hideModal(usefulLinksModal);
      }
      if (infoModal.style.display === "block" && !infoModal.contains(event.target)) {
        hideModal(infoModal);
      }
    });
  }

  function toggleModal(modal) {
    console.log("[toggleModal] Alternando exibição do modal...");
    if (modal.style.display === "none" || modal.style.opacity === "0") {
      showModal(modal);
    } else {
      hideModal(modal);
    }
  }

  function showModal(modal) {
    modal.style.display = "block";
    setTimeout(function () {
      modal.style.opacity = "1";
    }, 0);
  }

  function hideModal(modal) {
    modal.style.opacity = "0";
    setTimeout(function () {
      modal.style.display = "none";
    }, 500);
  }

  function setUpModal(modal, id) {
    modal.id = id;
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.zIndex = "1";
    modal.style.left = "50%";
    modal.style.top = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.5s ease-in-out";
  }

  function styleModalContent(content) {
    content.style.backgroundColor = "#fefefe";
    content.style.margin = "auto";
    content.style.padding = "20px";
    content.style.border = "1px solid #888";
    content.style.width = "80%";
    content.style.maxWidth = "500px";
    content.style.borderRadius = "10px";
    content.style.fontFamily = "Montserrat, sans-serif";
    content.style.textAlign = "center";
    content.style.color = "#000";
    content.style.fontSize = "16px";
    content.style.lineHeight = "1.5";
  }

  function createPlaceholderOption() {
    console.log("[createPlaceholderOption] Criando option placeholder para dropdown...");
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    return placeholderOption;
  }

  function createFlagImage() {
    console.log("[createFlagImage] Criando imagem de bandeira para o dropdown de idiomas...");
    const img = document.createElement("img");
    img.id = "language_flag";
    img.style.height = "15px";
    img.style.width = "25px";
    img.style.margin = "9px 0 6px 6px";
    const activeLang = languages.find((lang) => lang.code === activeLanguage);
    if (activeLang) {
      img.src = activeLang.flag;
    }
    return img;
  }

  function generateUniqueId(coordinates) {
    console.log("[generateUniqueId] Gerando ID único com base nas coords...");
    const sortedCoordinates = coordinates.sort(
      (a, b) => a[1] - b[1] || a[0] - b[0]
    );

    const coordString = sortedCoordinates
      .map((coord) => `${coord[1]}_${coord[0]}`)
      .join("_");

    return sha256Hash(coordString);
  }

  function sha256Hash(str) {
    console.log("[sha256Hash] Hashing string =>", str);
    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(str);
    const hash = shaObj.getHash("HEX");
    return hash;
  }

  console.log("[MZ Tactics Selector] Script concluído, aguardando eventos...");
})();

/* Ljubljana */
