// ==UserScript==
// @name        AniList Edit Multiple Media Simultaneously
// @license     MIT
// @namespace   rtonne
// @match       https://anilist.co/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @version     1.0
// @author      Rtonne
// @description Adds the ability to select multiple manga/anime in your lists and act on them simultaneously
// @grant       GM.getResourceText
// @grant       GM.addStyle
// @require     https://update.greasyfork.org/scripts/496874/1387742/components.js
// @require     https://update.greasyfork.org/scripts/496875/1387743/helpers.js
// @resource    GLOBAL_CSS https://raw.githubusercontent.com/p-laranjinha/userscripts/master/AniList%20Edit%20Multiple%20Media%20Simultaneously/global.css
// @resource    PLUS_SVG https://raw.githubusercontent.com/p-laranjinha/userscripts/master/AniList%20Edit%20Multiple%20Media%20Simultaneously/plus.svg
// @resource    MINUS_SVG https://raw.githubusercontent.com/p-laranjinha/userscripts/master/AniList%20Edit%20Multiple%20Media%20Simultaneously/minus.svg
// @downloadURL https://update.greasyfork.org/scripts/496876/AniList%20Edit%20Multiple%20Media%20Simultaneously.user.js
// @updateURL https://update.greasyfork.org/scripts/496876/AniList%20Edit%20Multiple%20Media%20Simultaneously.meta.js
// ==/UserScript==

// REPLACE THE @require AND @resource WITH THE FOLLOWING DURING DEVELOPMENT
// AND REMEMBER TO UPDATE THE REQUIRES
// @require     components.js
// @require     helpers.js
// @resource    GLOBAL_CSS global.css
// @resource    PLUS_SVG plus.svg
// @resource    MINUS_SVG minus.svg

const GLOBAL_CSS = GM.getResourceText("GLOBAL_CSS");
GM.addStyle(GLOBAL_CSS);
const PLUS_SVG = GM.getResourceText("PLUS_SVG");
const MINUS_SVG = GM.getResourceText("MINUS_SVG");

let WAS_LAST_LIST_ANIME = false;

let current_url = null;
let new_url = null;

const url_regex =
  /^https:\/\/anilist.co\/user\/.+\/((animelist)|(mangalist))(\/.*)?$/;

// Using observer to run script whenever the body changes
// because anilist doesn't reload when changing page
const observer = new MutationObserver(async () => {
  try {
    new_url = window.location.href;

    // Because anilist doesn't reload on changing url
    // we have to allow the whole website and check here if we are in a list
    if (!url_regex.test(new_url)) {
      return;
    }

    // If we have actions in the banner, it's not our list and can't edit it
    if (
      (await waitForElements(".banner-content .actions"))[0].children.length > 0
    ) {
      return;
    }

    setupButtons();
    setupForm();
  } catch (err) {
    console.error(err);
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

async function setupButtons() {
  const entries = await waitForElements(".entry, .entry-card");

  // If the url is different we are in a different list
  // Or if the list length is different, we loaded more of the same list
  if (
    current_url === new_url &&
    entries.length ===
      document.querySelectorAll(".rtonne-anilist-multiselect-addbutton").length
  ) {
    return;
  }

  current_url = new_url;

  let isCard = false;
  if (entries.length > 0 && entries[0].classList.contains("entry-card")) {
    isCard = true;
  }
  entries.forEach((entry) => {
    const cover = entry.querySelector(".cover");

    // We return if the item already has a select button so
    // there isn't an infinite loop where adding a button triggers
    // the observer which adds more buttons
    if (entry.querySelector(".rtonne-anilist-multiselect-addbutton")) return;

    const add_button = document.createElement("div");
    add_button.className = "rtonne-anilist-multiselect-addbutton edit";
    add_button.innerHTML = PLUS_SVG;
    // I'm appending the buttons to the cards in a different place so I can have them above long titles
    if (isCard) {
      entry.append(add_button);
    } else {
      cover.querySelector(".edit").after(add_button);
    }
    const remove_button = document.createElement("div");
    remove_button.className = "rtonne-anilist-multiselect-removebutton edit";
    remove_button.innerHTML = MINUS_SVG;
    add_button.after(remove_button);

    add_button.onclick = () => {
      entry.className += " rtonne-anilist-multiselect-selected";
    };

    remove_button.onclick = () => {
      entry.classList.remove("rtonne-anilist-multiselect-selected");
    };
  });
}

async function setupForm() {
  // Check if the form needs to be made/remade
  const [container] = await waitForElements(".filters-wrap");
  const is_list_anime = document
    .querySelector(".nav.container > a[href$='animelist']")
    .classList.contains("router-link-active");
  const previous_forms = document.querySelectorAll(
    ".rtonne-anilist-multiselect-form"
  );
  const previous_helps = document.querySelectorAll(
    ".rtonne-anilist-multiselect-form-help"
  );
  if (previous_forms.length > 0) {
    // In case we end up with multiple forms because of asynchronicity, remove the extra ones
    if (previous_forms.length > 1) {
      for (let i = 0; i < previous_forms.length - 1; i++) {
        previous_forms[i].remove();
        previous_helps[i].remove();
      }
    }
    // If we change from anime to manga or vice versa, redo the form
    if (WAS_LAST_LIST_ANIME !== is_list_anime) {
      for (let i = 0; i < previous_forms.length; i++) {
        previous_forms[i].remove();
        previous_helps[i].remove();
      }
    } else {
      return;
    }
  }
  WAS_LAST_LIST_ANIME = is_list_anime;

  // Choose what status and score to use in the form
  let status_options = [
    "Reading",
    "Plan to read",
    "Completed",
    "Rereading",
    "Paused",
    "Dropped",
  ];
  if (is_list_anime) {
    status_options = [
      "Watching",
      "Plan to read",
      "Completed",
      "Rewatching",
      "Paused",
      "Dropped",
    ];
  }

  let score_step = 1,
    score_max;
  const [element_with_score_type] = await waitForElements(
    ".content.container > .medialist"
  );
  if (element_with_score_type.classList.contains("POINT_10_DECIMAL")) {
    score_step = 0.5;
    score_max = 10;
  } else if (element_with_score_type.classList.contains("POINT_100")) {
    score_max = 100;
  } else if (element_with_score_type.classList.contains("POINT_10")) {
    score_max = 10;
  } else if (element_with_score_type.classList.contains("POINT_5")) {
    score_max = 5;
  } else {
    // if (element_with_score_type.classList.contains("POINT_3"))
    score_max = 3;
  }

  // Create the form container
  let previous_form = document.querySelector(
    ".rtonne-anilist-multiselect-form"
  );
  if (previous_form) {
    return;
  }
  const form = document.createElement("div");
  form.className = "rtonne-anilist-multiselect-form";
  form.style.display = "none";
  container.append(form);

  // We get custom_lists and advanced_scores after creating the form so we can do it only once
  let custom_lists = [];
  while (true) {
    const first_media_id = Number(
      document
        .querySelector(".entry .title > a, .entry-card .title > a")
        .href.split("/")[4]
    );
    const custom_lists_response = await getDataFromEntries(
      [first_media_id],
      "customLists"
    );
    if (custom_lists_response.errors) {
      const error_message = `An error occurred while getting the available custom lists. Please look at the console for more information. Do you want to retry or cancel the request?`;
      if (await createErrorPopup(error_message)) {
        document.body.className += " rtonne-anilist-multiselect-form-failed";
        return;
      }
    } else {
      custom_lists = custom_lists_response.data[0]
        ? Object.keys(custom_lists_response.data[0])
        : [];
      break;
    }
  }
  let advanced_scores = [];
  while (true) {
    const first_media_id = Number(
      document
        .querySelector(".entry .title > a, .entry-card .title > a")
        .href.split("/")[4]
    );
    const is_advanced_scores_enabled = await isAdvancedScoringEnabled();
    if (is_advanced_scores_enabled.errors) {
      const error_message = `An error occurred while getting if advanced scores are enabled. Please look at the console for more information. Do you want to retry or cancel the request?`;
      if (await createErrorPopup(error_message)) {
        document.body.className += " rtonne-anilist-multiselect-form-failed";
        return;
      }
    } else if (
      (is_list_anime && is_advanced_scores_enabled.data.anime) ||
      (!is_list_anime && is_advanced_scores_enabled.data.manga)
    ) {
      const advanced_scores_response = await getDataFromEntries(
        [first_media_id],
        "advancedScores"
      );
      if (advanced_scores_response.errors) {
        const error_message = `An error occurred while getting the available advanced scores. Please look at the console for more information. Do you want to retry or cancel the request?`;
        if (await createErrorPopup(error_message)) {
          document.body.className += " rtonne-anilist-multiselect-form-failed";
          return;
        }
      } else {
        advanced_scores = advanced_scores_response.data[0]
          ? Object.keys(advanced_scores_response.data[0])
          : [];
        break;
      }
    } else {
      break;
    }
  }

  // Create the form contents
  const help = document.createElement("div");
  help.className = "rtonne-anilist-multiselect-form-help";
  help.innerHTML =
    "ⓘ Because values can be empty, there are 2 ways to enable them. The first one is via an Enable checkbox;" +
    " the second one is using indeterminate checkboxes, where a dark square and strikethrough text means they're not enabled." +
    "<br>ⓘ Batch updating is done whenever possible. The following cases require individual updates:" +
    " choosing some but not all advanced scores; choosing one or more custom lists; adding or removing from favourites; deleting.";
  help.style.width = "100%";
  help.style.paddingTop = "20px";
  help.style.fontSize = "smaller";
  help.style.display = "none";
  form.after(help);

  const status_container = document.createElement("div");
  status_container.id = "rtonne-anilist-multiselect-status-input";
  status_container.className =
    "rtonne-anilist-multiselect-has-enabled-checkbox";
  form.append(status_container);
  const status_label = document.createElement("label");
  status_label.innerText = "Status";
  status_container.append(status_label);
  const status_enabled_checkbox = createCheckbox(status_container, "Enabled");
  const status_input = createSelectInput(status_container, status_options);

  const score_container = document.createElement("div");
  score_container.id = "rtonne-anilist-multiselect-score-input";
  score_container.className = "rtonne-anilist-multiselect-has-enabled-checkbox";
  form.append(score_container);
  const score_label = document.createElement("label");
  score_label.innerText = "Score";
  score_container.append(score_label);
  const score_enabled_checkbox = createCheckbox(score_container, "Enabled");
  const score_input = createNumberInput(score_container, score_max, score_step);

  /** @type {HTMLInputElement[]} */
  let advanced_scores_enabled_checkboxes = [];
  /** @type {HTMLInputElement[]} */
  let advanced_scores_inputs = [];
  if (advanced_scores.length > 0) {
    for (const advanced_score of advanced_scores) {
      const advanced_score_container = document.createElement("div");
      advanced_score_container.className =
        "rtonne-anilist-multiselect-has-enabled-checkbox";
      form.append(advanced_score_container);
      const advanced_score_label = document.createElement("label");
      advanced_score_label.innerHTML = `${advanced_score} <small>(Advanced Score)</small>`;
      advanced_score_label.style.wordBreak = "break-all";
      advanced_score_container.append(advanced_score_label);
      advanced_scores_enabled_checkboxes.push(
        createCheckbox(advanced_score_container, "Enabled")
      );
      advanced_scores_inputs.push(
        createNumberInput(advanced_score_container, 100, 0)
      );
    }
  }

  /**
   * Collection of progress inputs.
   * Changes depending on if the list is for anime or manga.
   * @type {{
   *  episode_enabled_checkbox: HTMLInputElement,
   *  episode_input: HTMLInputElement,
   *  rewatches_enabled_checkbox: HTMLInputElement,
   *  rewatches_input: HTMLInputElement,
   * } | {
   *  chapter_enabled_checkbox: HTMLInputElement,
   *  chapter_input: HTMLInputElement,
   *  volume_enabled_checkbox: HTMLInputElement,
   *  volume_input: HTMLInputElement,
   *  rereads_enabled_checkbox: HTMLInputElement,
   *  rereads_input: HTMLInputElement,
   * }}
   */
  const progress_inputs = (() => {
    const result = {};
    if (is_list_anime) {
      const episode_container = document.createElement("div");
      episode_container.id = "rtonne-anilist-multiselect-episode-input";
      episode_container.className =
        "rtonne-anilist-multiselect-has-enabled-checkbox";
      form.append(episode_container);
      const episode_label = document.createElement("label");
      episode_label.innerText = "Episode Progress";
      episode_container.append(episode_label);
      result.episode_enabled_checkbox = createCheckbox(
        episode_container,
        "Enabled"
      );
      result.episode_input = createNumberInput(episode_container);

      const rewatches_container = document.createElement("div");
      rewatches_container.id = "rtonne-anilist-multiselect-rewatches-input";
      rewatches_container.className =
        "rtonne-anilist-multiselect-has-enabled-checkbox";
      form.append(rewatches_container);
      const rewatches_label = document.createElement("label");
      rewatches_label.innerText = "Total Rewatches";
      rewatches_container.append(rewatches_label);
      result.rewatches_enabled_checkbox = createCheckbox(
        rewatches_container,
        "Enabled"
      );
      result.rewatches_input = createNumberInput(rewatches_container);
    } else {
      const chapter_container = document.createElement("div");
      chapter_container.id = "rtonne-anilist-multiselect-episode-input";
      chapter_container.className =
        "rtonne-anilist-multiselect-has-enabled-checkbox";
      form.append(chapter_container);
      const chapter_label = document.createElement("label");
      chapter_label.innerText = "Chapter Progress";
      chapter_container.append(chapter_label);
      result.chapter_enabled_checkbox = createCheckbox(
        chapter_container,
        "Enabled"
      );
      result.chapter_input = createNumberInput(chapter_container);

      const volume_container = document.createElement("div");
      volume_container.id = "rtonne-anilist-multiselect-episode-input";
      volume_container.className =
        "rtonne-anilist-multiselect-has-enabled-checkbox";
      form.append(volume_container);
      const volume_label = document.createElement("label");
      volume_label.innerText = "Volume Progress";
      volume_container.append(volume_label);
      result.volume_enabled_checkbox = createCheckbox(
        volume_container,
        "Enabled"
      );
      result.volume_input = createNumberInput(volume_container);

      const rereads_container = document.createElement("div");
      rereads_container.id = "rtonne-anilist-multiselect-rewatches-input";
      rereads_container.className =
        "rtonne-anilist-multiselect-has-enabled-checkbox";
      form.append(rereads_container);
      const rereads_label = document.createElement("label");
      rereads_label.innerText = "Total Rereads";
      rereads_container.append(rereads_label);
      result.rereads_enabled_checkbox = createCheckbox(
        rereads_container,
        "Enabled"
      );
      result.rereads_input = createNumberInput(rereads_container);
    }
    return result;
  })();

  const start_date_container = document.createElement("div");
  start_date_container.id = "rtonne-anilist-multiselect-start-date-input";
  start_date_container.className =
    "rtonne-anilist-multiselect-has-enabled-checkbox";
  form.append(start_date_container);
  const start_date_label = document.createElement("label");
  start_date_label.innerText = "Start Date";
  start_date_container.append(start_date_label);
  const start_date_enabled_checkbox = createCheckbox(
    start_date_container,
    "Enabled"
  );
  const start_date_input = createDateInput(start_date_container);

  const finish_date_container = document.createElement("div");
  finish_date_container.id = "rtonne-anilist-multiselect-finish-date-input";
  finish_date_container.className =
    "rtonne-anilist-multiselect-has-enabled-checkbox";
  form.append(finish_date_container);
  const finish_date_label = document.createElement("label");
  finish_date_label.innerText = "Finish Date";
  finish_date_container.append(finish_date_label);
  const finish_date_enabled_checkbox = createCheckbox(
    finish_date_container,
    "Enabled"
  );
  const finish_date_input = createDateInput(finish_date_container);

  const notes_container = document.createElement("div");
  notes_container.id = "rtonne-anilist-multiselect-notes-input";
  notes_container.className = "rtonne-anilist-multiselect-has-enabled-checkbox";
  form.append(notes_container);
  const notes_label = document.createElement("label");
  notes_label.innerText = "Notes";
  notes_container.append(notes_label);
  const notes_enabled_checkbox = createCheckbox(notes_container, "Enabled");
  const notes_input = createTextarea(notes_container);

  /** @type {HTMLInputElement|null} */
  let hide_from_status_list_checkbox;
  /** @type {HTMLInputElement[]} */
  let custom_lists_checkboxes = [];
  if (custom_lists.length > 0) {
    const custom_lists_container = document.createElement("div");
    custom_lists_container.id = "rtonne-anilist-multiselect-custom-lists-input";
    form.append(custom_lists_container);
    const custom_lists_label = document.createElement("label");
    custom_lists_label.innerText = "Custom Lists";
    custom_lists_container.append(custom_lists_label);

    for (const custom_list of custom_lists) {
      custom_lists_checkboxes.push(
        createIndeterminateCheckbox(custom_lists_container, custom_list)
      );
    }

    const custom_lists_separator = document.createElement("div");
    custom_lists_separator.style.width = "100%";
    custom_lists_separator.style.marginBottom = "6px";
    custom_lists_separator.style.borderBottom =
      "solid 1px rgba(var(--color-text-lighter),.3)";
    custom_lists_container.append(custom_lists_separator);
    hide_from_status_list_checkbox = createIndeterminateCheckbox(
      custom_lists_container,
      "Hide from status lists"
    );
  }

  const other_actions_container = document.createElement("div");
  other_actions_container.id = "rtonne-anilist-multiselect-other-actions-input";
  form.append(other_actions_container);
  const other_actions_label = document.createElement("label");
  other_actions_label.innerText = "Other Actions";
  other_actions_container.append(other_actions_label);
  const private_checkbox = createIndeterminateCheckbox(
    other_actions_container,
    "Private"
  );
  const favourite_checkbox = createIndeterminateCheckbox(
    other_actions_container,
    "Favourite"
  );
  const delete_checkbox = createCheckbox(other_actions_container, "Delete");

  const deselect_all_button = createDangerButton(form, "Deselect All Entries");

  const confirm_button = createButton(form, "Confirm");
  new MutationObserver(() => {
    if (
      delete_checkbox.checked ||
      status_enabled_checkbox.checked ||
      (advanced_scores.length > 0 &&
        advanced_scores_enabled_checkboxes.some((e) => e.checked)) ||
      score_enabled_checkbox.checked ||
      (is_list_anime &&
        (progress_inputs.episode_enabled_checkbox.checked ||
          progress_inputs.rewatches_enabled_checkbox.checked)) ||
      (!is_list_anime &&
        (progress_inputs.chapter_enabled_checkbox.checked ||
          progress_inputs.volume_enabled_checkbox.checked ||
          progress_inputs.rereads_enabled_checkbox.checked)) ||
      start_date_enabled_checkbox.checked ||
      finish_date_enabled_checkbox.checked ||
      notes_enabled_checkbox.checked ||
      (custom_lists.length > 0 &&
        (custom_lists_checkboxes.some((e) => !e.indeterminate) ||
          !hide_from_status_list_checkbox.indeterminate)) ||
      !private_checkbox.indeterminate ||
      !favourite_checkbox.indeterminate
    ) {
      confirm_button.style.display = "unset";
    } else {
      confirm_button.style.display = "none";
    }
  }).observe(form, {
    childList: true,
    subtree: true,
    attributeFilter: ["class"],
  });

  const currently_selected_label = document.createElement("label");
  currently_selected_label.style.alignSelf = "center";
  currently_selected_label.style.color = "rgb(var(--color-blue))";
  form.append(currently_selected_label);

  deselect_all_button.onclick = () => {
    const selected_entries = document.querySelectorAll(
      ".entry.rtonne-anilist-multiselect-selected, .entry-card.rtonne-anilist-multiselect-selected"
    );
    for (const entry of selected_entries) {
      entry.classList.remove("rtonne-anilist-multiselect-selected");
    }
  };

  confirm_button.onclick = () => {
    let action_list = "";
    let values_to_be_changed = {};
    if (!delete_checkbox.checked) {
      if (status_enabled_checkbox.checked) {
        action_list += `<li>Set <u>Status</u> to <b>${status_input.value}</b>.</li>`;
        switch (status_input.value) {
          case "Reading":
          case "Watching":
            values_to_be_changed.status = "CURRENT";
            break;
          case "Plan to read":
            values_to_be_changed.status = "PLANNING";
            break;
          case "Completed":
            values_to_be_changed.status = "COMPLETED";
            break;
          case "Rereading":
          case "Rewatching":
            values_to_be_changed.status = "REPEATING";
            break;
          case "Paused":
            values_to_be_changed.status = "PAUSED";
            break;
          case "Dropped":
            values_to_be_changed.status = "DROPPED";
            break;
        }
      }
      if (score_enabled_checkbox.checked) {
        action_list += `<li>Set <u>Score</u> to <b>${score_input.value}</b>.</li>`;
        values_to_be_changed.score = Number(score_input.value);
      }
      if (advanced_scores.length > 0) {
        // Create array with advanced_scores.length count of null
        values_to_be_changed.advancedScores = Array.from(
          { length: advanced_scores.length },
          () => null
        );
        for (let i = 0; i < advanced_scores.length; i++) {
          if (advanced_scores_enabled_checkboxes[i].checked) {
            action_list += `<li>Set the <u>${advanced_scores[i]}</u> <u>Advanced Score</u> to <b>${advanced_scores_inputs[i].value}</b>.</li>`;
            values_to_be_changed.advancedScores[i] = Number(
              advanced_scores_inputs[i].value
            );
          }
        }
      }
      if (is_list_anime) {
        if (progress_inputs.episode_enabled_checkbox.checked) {
          action_list += `<li>Set <u>Episode Progress</u> to <b>${progress_inputs.episode_input.value}</b>.</li>`;
          values_to_be_changed.progress = Number(
            progress_inputs.episode_input.value
          );
        }
        if (progress_inputs.rewatches_enabled_checkbox.checked) {
          action_list += `<li>Set <u>Total Rewatches</u> to <b>${progress_inputs.rewatches_input.value}</b>.</li>`;
          values_to_be_changed.repeat = Number(
            progress_inputs.rewatches_input.value
          );
        }
      } else {
        if (progress_inputs.chapter_enabled_checkbox.checked) {
          action_list += `<li>Set <u>Chapter Progress</u> to <b>${progress_inputs.chapter_input.value}</b>.</li>`;
          values_to_be_changed.progress = Number(
            progress_inputs.chapter_input.value
          );
        }
        if (progress_inputs.volume_enabled_checkbox.checked) {
          action_list += `<li>Set <u>Volume Progress</u> to <b>${progress_inputs.volume_input.value}</b>.</li>`;
          values_to_be_changed.progressVolume = Number(
            progress_inputs.volume_input.value
          );
        }
        if (progress_inputs.rereads_enabled_checkbox.checked) {
          action_list += `<li>Set <u>Total Rereads</u> to <b>${progress_inputs.rereads_input.value}</b>.</li>`;
          values_to_be_changed.repeat = Number(
            progress_inputs.rereads_input.value
          );
        }
      }
      if (start_date_enabled_checkbox.checked) {
        const date = {
          year: start_date_input.value.split("-")[0],
          month: start_date_input.value.split("-")[1],
          day: start_date_input.value.split("-")[2],
        };

        if (!date.year || !date.month || !date.day) {
          action_list += `<li>Set <u>Start Date</u> to <b>nothing</b>.</li>`;
          values_to_be_changed.startedAt = {};
        } else {
          action_list += `<li>Set <u>Start Date</u> to <b>${start_date_input.value}</b>.</li>`;
          values_to_be_changed.startedAt = date;
        }
      }
      if (finish_date_enabled_checkbox.checked) {
        const date = {
          year: finish_date_input.value.split("-")[0],
          month: finish_date_input.value.split("-")[1],
          day: finish_date_input.value.split("-")[2],
        };

        if (!date.year || !date.month || !date.day) {
          action_list += `<li>Set <u>Finish Date</u> to <b>nothing</b>.</li>`;
          values_to_be_changed.completedAt = {};
        } else {
          action_list += `<li>Set <u>Finish Date</u> to <b>${finish_date_input.value}</b>.</li>`;
          values_to_be_changed.completedAt = date;
        }
      }
      if (notes_enabled_checkbox.checked) {
        action_list += `<li>Set <u>Notes</u> to <b>${notes_input.value}</b>.</li>`;
        values_to_be_changed.notes = notes_input.value;
      }
      if (custom_lists.length > 0) {
        for (let i = 0; i < custom_lists.length; i++) {
          if (!custom_lists_checkboxes[i].indeterminate) {
            if (!values_to_be_changed.customLists) {
              values_to_be_changed.customLists = [];
            }
            if (custom_lists_checkboxes[i].checked) {
              action_list += `<li>Add to the <b>${custom_lists[i]}</b> <u>Custom List</u>.</li>`;
              values_to_be_changed.customLists.push(custom_lists[i]);
            } else {
              action_list += `<li>Remove from the <b>${custom_lists[i]}</b> <u>Custom List</u>.</li>`;
            }
          }
        }
        if (!hide_from_status_list_checkbox.indeterminate) {
          if (hide_from_status_list_checkbox.checked) {
            action_list += `<li><u><b>Hide</b> from status lists.</u></li>`;
            values_to_be_changed.hiddenFromStatusLists = true;
          } else {
            action_list += `<li><u><b>Show</b> on status lists.</u></li>`;
            values_to_be_changed.hiddenFromStatusLists = false;
          }
        }
      }
      if (!private_checkbox.indeterminate) {
        if (private_checkbox.checked) {
          action_list += `<li>Set as <u><b>Private</b></u>.</li>`;
          values_to_be_changed.private = true;
        } else {
          action_list += `<li>Set as <u><b>Public</b></u>.</li>`;
          values_to_be_changed.private = false;
        }
      }
      if (!favourite_checkbox.indeterminate) {
        if (favourite_checkbox.checked) {
          action_list += `<li><b>Add</b> to <u>Favourites</u>.</li>`;
          values_to_be_changed.favourite = true;
        } else {
          action_list += `<li><b>Remove</b> from <u>Favourites</u>.</li>`;
          values_to_be_changed.favourite = false;
        }
      }
    } else {
      values_to_be_changed.delete = true;
      action_list += `<li><u><b>Delete</b></u>.</li>`;
    }

    const initial_selected_entries = document.querySelectorAll(
      ".rtonne-anilist-multiselect-selected"
    );
    const confirm_popup_button = createConfirmPopup(
      "Are you sure?",
      `You're about to do the following actions to <b><u>${
        initial_selected_entries.length
      } entr${initial_selected_entries.length > 1 ? "ies" : "y"}</u></b>:
      ${action_list}`
    );

    confirm_popup_button.onclick = async () => {
      // It is possible to select the same entry more than once if they're on multiple lists
      // so we need to remove duplicates
      let { selected_entries } = Array.from(initial_selected_entries).reduce(
        (accumulator, currentValue) => {
          const url = currentValue.querySelector(".title > a").href;
          if (accumulator.urls.indexOf(url) < 0) {
            accumulator.urls.push(url);
            accumulator.selected_entries.push(currentValue);
          }
          return accumulator;
        },
        { selected_entries: [], urls: [] }
      );

      // Content is in yet another function so I can do stuff after it returns anywhere
      const success = await (async () => {
        let is_cancelled = false;
        const {
          popup_wrapper,
          popup_cancel_button,
          changePopupTitle,
          changePopupContent,
          closePopup,
        } = createUpdatableCancelPopup("Processing the request...", "");
        popup_wrapper.onclick = popup_cancel_button.onclick = () => {
          is_cancelled = true;
        };

        let media_ids = [];
        for (const entry of selected_entries) {
          const media_id = Number(
            entry.querySelector(".title > a").href.split("/")[4]
          );
          media_ids.push(media_id);
        }
        let ids_response;
        while (true) {
          ids_response = await getDataFromEntries(media_ids, "id");
          if (ids_response.errors) {
            const error_message = `${ids_response.data.length}/${selected_entries.length} IDs were successfully obtained. Please look at the console for more information. Do you want to retry or cancel the request?`;
            if (await createErrorPopup(error_message)) {
              closePopup();
              return false;
            }
          } else {
            break;
          }
        }
        const ids = ids_response.data;

        if (values_to_be_changed.delete) {
          for (let i = 0; i < selected_entries.length && !is_cancelled; i++) {
            const entry_title = selected_entries[i]
              .querySelector(".title > a")
              .innerText.trim();
            changePopupContent(
              createEntryPopupContent(
                `Deleting: <b>${entry_title}</b>`,
                selected_entries[i].querySelector(".image").style
                  .backgroundImage,
                i + 1,
                selected_entries.length
              )
            );
            while (true) {
              const delete_response = await deleteEntry(ids[i]);
              if (delete_response.errors) {
                const error_message = `An error occurred while deleting <b>${entry_title}</b>. Please look at the console for more information. Do you want to retry or cancel the request?`;
                if (await createErrorPopup(error_message)) {
                  closePopup();
                  return false;
                }
              } else {
                break;
              }
            }
          }
          closePopup();
          return true;
        }
        if (values_to_be_changed.favourite !== undefined) {
          let is_favourite_response;
          while (true) {
            is_favourite_response = await getDataFromEntries(
              media_ids,
              "isFavourite"
            );
            if (is_favourite_response.errors) {
              const error_message = `An error occurred while getting info to edit favourites. Please look at the console for more information. Do you want to retry or cancel the request?`;
              if (await createErrorPopup(error_message)) {
                closePopup();
                return false;
              }
            } else {
              break;
            }
          }
          for (let i = 0; i < selected_entries.length && !is_cancelled; i++) {
            const entry_title = selected_entries[i]
              .querySelector(".title > a")
              .innerText.trim();
            if (
              values_to_be_changed.favourite !== is_favourite_response.data[i]
            ) {
              changePopupContent(
                createEntryPopupContent(
                  `${
                    values_to_be_changed.favourite
                      ? "Adding to favourites"
                      : "Removing from favourites"
                  }: <b>${selected_entries[i]
                    .querySelector(".title > a")
                    .innerText.trim()}</b>`,
                  selected_entries[i].querySelector(".image").style
                    .backgroundImage,
                  i + 1,
                  selected_entries.length
                )
              );
              while (true) {
                let toggle_favourite_response;
                if (is_list_anime) {
                  toggle_favourite_response = await toggleFavouriteForEntry({
                    animeId: media_ids[i],
                  });
                } else {
                  toggle_favourite_response = await toggleFavouriteForEntry({
                    mangaId: media_ids[i],
                  });
                }
                if (toggle_favourite_response.errors) {
                  const error_message = `An error occurred while <b>${entry_title}</b> was being ${
                    values_to_be_changed.favourite ? "added to" : "removed from"
                  } favourites. Please look at the console for more information. Do you want to retry or cancel the request?`;
                  if (await createErrorPopup(error_message)) {
                    closePopup();
                    return false;
                  }
                } else {
                  break;
                }
              }
            }
          }
        }

        // Adding/removing from custom lists requires more meddling.
        // If some but not all custom lists have been chosen further processing is required.
        // array.every() returns true if array is empty so we need to check that.
        /** @type {void | string[][]} */
        let all_processed_custom_lists;
        if (
          custom_lists_checkboxes.some((checkbox) => !checkbox.indeterminate) &&
          !(
            custom_lists_checkboxes.length > 0 &&
            custom_lists_checkboxes.every((checkbox) => !checkbox.indeterminate)
          )
        ) {
          let custom_lists_response;
          while (true) {
            custom_lists_response = await getDataFromEntries(
              media_ids,
              "customLists"
            );
            if (custom_lists_response.errors) {
              const error_message = `An error occurred while getting custom lists. Please look at the console for more information. Do you want to retry or cancel the request?`;
              if (await createErrorPopup(error_message)) {
                closePopup();
                return false;
              }
            } else {
              break;
            }
          }
          all_processed_custom_lists = [];
          for (let i = 0; i < selected_entries.length && !is_cancelled; i++) {
            changePopupContent(
              createEntryPopupContent(
                `Getting the custom lists of: <b>${selected_entries[i]
                  .querySelector(".title > a")
                  .innerText.trim()}</b>`,
                selected_entries[i].querySelector(".image").style
                  .backgroundImage,
                i + 1,
                selected_entries.length
              )
            );
            let processed_custom_lists = [];
            let entry_custom_lists = custom_lists_response.data[i];
            for (let j = 0; j < custom_lists.length; j++) {
              if (!custom_lists_checkboxes[j].indeterminate) {
                if (custom_lists_checkboxes[j].checked) {
                  processed_custom_lists.push(custom_lists[j]);
                }
              } else {
                if (entry_custom_lists[custom_lists[j]]) {
                  processed_custom_lists.push(custom_lists[j]);
                }
              }
            }
            all_processed_custom_lists.push(processed_custom_lists);
          }
        }

        // Using advanced scores requires more meddling.
        // If some but not all advanced scores have been chosen further processing is required.
        // array.every() returns true if array is empty so we need to check that.
        /** @type {void | string[][]} */
        let all_processed_advanced_scores;
        const some_but_not_all_advanced_scores =
          advanced_scores_enabled_checkboxes.some(
            (checkbox) => checkbox.checked
          ) &&
          !(
            advanced_scores_enabled_checkboxes.length > 0 &&
            advanced_scores_enabled_checkboxes.every(
              (checkbox) => checkbox.checked
            )
          );
        if (some_but_not_all_advanced_scores) {
          let advanced_scores_response;
          while (true) {
            advanced_scores_response = await getDataFromEntries(
              media_ids,
              "advancedScores"
            );
            if (advanced_scores_response.errors) {
              const error_message = `An error occurred while getting advanced scores. Please look at the console for more information. Do you want to retry or cancel the request?`;
              if (await createErrorPopup(error_message)) {
                closePopup();
                return false;
              }
            } else {
              break;
            }
          }
          all_processed_advanced_scores = [];
          for (let i = 0; i < selected_entries.length && !is_cancelled; i++) {
            changePopupContent(
              createEntryPopupContent(
                `Getting the advanced scores of: <b>${selected_entries[i]
                  .querySelector(".title > a")
                  .innerText.trim()}</b>`,
                selected_entries[i].querySelector(".image").style
                  .backgroundImage,
                i + 1,
                selected_entries.length
              )
            );
            let processed_advanced_scores = [];
            let entry_advanced_scores = Object.values(
              advanced_scores_response.data[i]
            );
            for (let j = 0; j < advanced_scores.length; j++) {
              if (advanced_scores_enabled_checkboxes[j].checked) {
                processed_advanced_scores.push(
                  values_to_be_changed.advancedScores[j]
                );
              } else {
                processed_advanced_scores.push(entry_advanced_scores[j]);
              }
            }
            all_processed_advanced_scores.push(processed_advanced_scores);
          }
        }

        // If any custom lists or some but not all advanced scores have been chosen, we require individual updates.
        if (
          custom_lists_checkboxes.some((checkbox) => !checkbox.indeterminate) ||
          some_but_not_all_advanced_scores
        ) {
          const values = { ...values_to_be_changed };
          for (let i = 0; i < selected_entries.length && !is_cancelled; i++) {
            changePopupContent(
              createEntryPopupContent(
                `Updating: <b>${selected_entries[i]
                  .querySelector(".title > a")
                  .innerText.trim()}</b>`,
                selected_entries[i].querySelector(".image").style
                  .backgroundImage,
                i + 1,
                selected_entries.length
              )
            );
            while (true) {
              if (all_processed_custom_lists) {
                values.customLists = all_processed_custom_lists[i];
              }
              if (all_processed_advanced_scores) {
                values.advancedScores = all_processed_advanced_scores[i];
              }
              const update_response = await updateEntry(ids[i], values);
              if (update_response.errors) {
                const entry_title = selected_entries[i]
                  .querySelector(".title > a")
                  .innerText.trim();
                const error_message = `An error occurred while updating <b>${entry_title}</b>. Please look at the console for more information. Do you want to retry or cancel the request?`;
                if (await createErrorPopup(error_message)) {
                  closePopup();
                  return false;
                }
              } else {
                break;
              }
            }
          }
          closePopup();
          return true;
        }

        // Don't batch update if not required
        if (
          status_enabled_checkbox.checked ||
          score_enabled_checkbox.checked ||
          (advanced_scores.length > 0 &&
            advanced_scores_enabled_checkboxes.every((e) => e.checked)) ||
          (is_list_anime &&
            (progress_inputs.episode_enabled_checkbox.checked ||
              progress_inputs.rewatches_enabled_checkbox.checked)) ||
          (!is_list_anime &&
            (progress_inputs.chapter_enabled_checkbox.checked ||
              progress_inputs.volume_enabled_checkbox.checked ||
              progress_inputs.rereads_enabled_checkbox.checked)) ||
          start_date_enabled_checkbox.checked ||
          finish_date_enabled_checkbox.checked ||
          notes_enabled_checkbox.checked ||
          (custom_lists.length > 0 &&
            !hide_from_status_list_checkbox.indeterminate) ||
          !private_checkbox.indeterminate
        ) {
          changePopupContent(
            "Updating all the entries at once. Not possible to cancel."
          );
          while (true) {
            const batch_update_response = await batchUpdateEntries(
              ids,
              values_to_be_changed
            );
            if (batch_update_response.errors) {
              const error_message = `An error occurred while batch updating. Please look at the console for more information. Do you want to retry or cancel the request?`;
              if (await createErrorPopup(error_message)) {
                closePopup();
                return false;
              }
            } else {
              break;
            }
          }
        }

        closePopup();
        return true;
      })();

      if (success) {
        const finished_popup_button = createConfirmPopup(
          "Done!",
          "The request has finished. Do you want to refresh?"
        );
        finished_popup_button.onclick = () => window.location.reload();
      }
    };
  };

  new MutationObserver(() => {
    const selected_entries = document.querySelectorAll(
      ".rtonne-anilist-multiselect-selected"
    ).length;
    currently_selected_label.innerHTML = `You have <b><u>${selected_entries}</u></b> entr${
      selected_entries > 1 ? "ies" : "y"
    } selected.`;
    if (selected_entries > 0) {
      form.style.display = "flex";
      help.style.display = "block";
    } else {
      form.style.display = "none";
      help.style.display = "none";
    }
  }).observe(document.querySelector(".lists"), {
    childList: true,
    subtree: true,
    attributeFilter: ["class"],
  });
}
