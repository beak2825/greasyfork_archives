// ==UserScript==
// @name        setupCommands
// @license     MIT
// @namespace   rtonne
// @match       *://*/*
// @version     2.1
// @author      Rtonne
// @description Library that creates regular, toggle, and radio menu commands for userscript managers
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// ==/UserScript==

/**
 * Can be the only function of this library used externally.
 * @param {_Command[]} command_list
 */
async function setupCommands(command_list) {
  for (const command of command_list) {
    await _runCommandCheckFunctions(command);
  }
  for (const command of command_list) {
    await _registerCommand(command_list, command);
  }
}

/**
 * @typedef {_ButtonCommand | _ToggleCommand | _RadioCommandGroup} _Command
 */

/**
 * @typedef _ButtonCommand
 * @type {Object}
 * @property {"button"} type A string declaring what type of menu command this is.
 * @property {string} text The text displayed.
 * @property {() => void} clickFunction A function to be run when clicking the command.
 * @property {string} id The id of the command. Required so that if in place replacement is not supported it can be removed.
 * @property {string} [tooltip] The tooltip shown while the cursor hovers the command.
 * @property {boolean} [auto_close] If the userscript manager popup closes when the command is clicked. Its "false" by default.
 * @property {string} [access_key] A key shortcut for the command.
 */

/**
 * @typedef _ToggleCommand
 * @type {Object}
 * @property {"toggle"} type A string declaring what type of menu command this is.
 * @property {string} id The id of the toggle and the key for the value.
 * @property {string} text The text displayed.
 * @property {boolean} [default_value] The default value and toggle state. Its "false" and off by default.
 * @property {string} [tooltip] The tooltip shown while the cursor hovers the command.
 * @property {boolean} [auto_close] If the userscript manager popup closes when the toggle is clicked. Its "false" by default.
 * @property {string} [access_key] A key shortcut for the command.
 * @property {() => void} [uncheckedFunction] A function to be run when this command is unchecked. This will run once on startup if command is unchecked.
 * @property {() => void} [checkedFunction] A function to be run when this command is checked. This will run once on startup if command is checked
 */

/**
 * @typedef _RadioCommandGroup
 * @type {Object}
 * @property {"radio"} type
 * @property {string} id The key for the value.
 * @property {*} [default_value] The default value and which radio is checked by default. If not set or value does not correspond to a radio, no radio will be checked.
 * @property {_RadioCommand[]} radios
 *
 * @typedef _RadioCommand
 * @type {Object}
 * @property {string} text The text displayed.
 * @property {*} value The value that is set to the group's id when clicked.
 * @property {string} id The id of the command. Required so that if in place replacement is not supported it can be removed.
 * @property {string} [tooltip] The tooltip shown while the cursor hovers the command.
 * @property {boolean} [auto_close] If the userscript manager popup closes when the command is clicked. Its "false" by default.
 * @property {string} [access_key] A key shortcut for the command.
 * @property {() => void} [uncheckedFunction] A function to be run when another command in the group is checked. This will run once on startup if command is unchecked.
 * @property {() => void} [checkedFunction] A function to be run when this command is checked. This will run once on startup if command is checked
 */

// To check if in place command replacement is supported
// https://violentmonkey.github.io/api/gm/#gm_registermenucommand
const _can_replace_in_place =
  "test" === GM.registerMenuCommand("test", () => {}, { id: "test" });
GM.unregisterMenuCommand("test");

/**
 * @param {_Command[]} command_list The list of all commands (may be used to replace old commands).
 * @param {_Command} command
 */
async function _registerCommand(command_list, command) {
  if (command.type === "radio") {
    const checked_radio_value = await GM.getValue(
      command.id,
      command.default_value
    );
    for (const radio of command.radios) {
      if (radio.value === checked_radio_value) {
        const text_prefix = "🞊 ";
        GM.registerMenuCommand(text_prefix + radio.text, () => {}, {
          id: radio.id,
          title: radio.tooltip,
          accessKey: radio.access_key,
          autoClose: radio.auto_close !== undefined && radio.auto_close,
        });
      } else {
        const text_prefix = "🞅 ";
        GM.registerMenuCommand(
          text_prefix + radio.text,
          () => _radioCommand(command_list, command, radio.value),
          {
            id: radio.id,
            title: radio.tooltip,
            accessKey: radio.access_key,
            autoClose: radio.auto_close !== undefined && radio.auto_close,
          }
        );
      }
    }
  } else if (command.type === "toggle") {
    let text_prefix;
    if (await GM.getValue(command.id, command.default_value)) {
      text_prefix = "🞕 ";
    } else {
      text_prefix = "🞎 ";
    }
    GM.registerMenuCommand(
      text_prefix + command.text,
      () => _toggleCommand(command_list, command),
      {
        id: command.id,
        title: command.tooltip,
        accessKey: command.access_key,
        autoClose: command.auto_close !== undefined && command.auto_close,
      }
    );
  } else if (command.type === "button") {
    GM.registerMenuCommand(command.text, command.clickFunction, {
      id: command.id,
      title: command.tooltip,
      accessKey: command.access_key,
      autoClose: command.auto_close !== undefined && command.auto_close,
    });
  }
}

/**
 * The callback to be added to the GM.registerCommand of RadioCommand.
 * @param {_Command[]} command_list The list of all commands (may be used to replace old commands).
 * @param {_RadioCommandGroup} command The group of the command being checked.
 * @param {string} value The value of the RadioCommand being checked.
 */
async function _radioCommand(command_list, command, value) {
  await GM.setValue(command.id, value);
  _runCommandCheckFunctions(command);
  if (_can_replace_in_place) {
    await _registerCommand(command_list, command);
  } else {
    // If we can't replace commands, we need to remove them all, then re-add them
    _unregisterCommands(command_list);
    for (const command of command_list) {
      await _registerCommand(command_list, command);
    }
  }
}

/**
 * The callback to be added to the GM.registerCommand of ToggleCommand
 * @param {_Command[]} command_list The list of all commands (may be used to replace old commands).
 * @param {_ToggleCommand} command The command being toggled.
 */
async function _toggleCommand(command_list, command) {
  await GM.setValue(
    command.id,
    !(await GM.getValue(command.id, command.default_value))
  );
  _runCommandCheckFunctions(command);
  if (_can_replace_in_place) {
    await _registerCommand(command_list, command);
  } else {
    // If we can't replace commands, we need to remove them all, then re-add them
    _unregisterCommands(command_list);
    for (const command of command_list) {
      await _registerCommand(command_list, command);
    }
  }
}

/**
 * @param {_Command[]} command_list
 */
function _unregisterCommands(command_list) {
  for (const command of command_list) {
    if (command.type === "radio") {
      for (const radio of command.radios) {
        GM.unregisterMenuCommand(radio.id);
      }
      continue;
    }
    GM.unregisterMenuCommand(command.id);
  }
}

/**
 * Runs the required uncheckedFunction() or checkedFunction() of the command.
 * @param {_Command} command
 */
async function _runCommandCheckFunctions(command) {
  if (command.type === "toggle") {
    if (await GM.getValue(command.id, command.default_value)) {
      if (command.checkedFunction) {
        command.checkedFunction();
      }
    } else {
      if (command.uncheckedFunction) {
        command.uncheckedFunction();
      }
    }
  } else if (command.type === "radio") {
    const value = await GM.getValue(command.id, command.default_value);
    for (const radio of command.radios) {
      if (value === radio.value) {
        if (radio.checkedFunction) {
          radio.checkedFunction();
        }
      } else {
        if (radio.uncheckedFunction) {
          radio.uncheckedFunction();
        }
      }
    }
  }
}
