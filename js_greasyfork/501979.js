// ==UserScript==
// @license MIT
// @name        内容农场自动化sdk
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/7/28 14:38:11
// @downloadURL https://update.greasyfork.org/scripts/501979/%E5%86%85%E5%AE%B9%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%8C%96sdk.user.js
// @updateURL https://update.greasyfork.org/scripts/501979/%E5%86%85%E5%AE%B9%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%8C%96sdk.meta.js
// ==/UserScript==


const FarmEventMap = {
  // send by: aigc-platform | publish-platform
  notification: 'notification',
  cacheEvent: 'cache-event',
  reportPollStatus: 'report-poll-status',

  // send by: aigc-platform
  genVideoFeed: 'generate-video-feed',

  // send by: publish-platform
  actionFeed: 'action-feed',
  publishFeed: 'publish-feed',


  // send to: publish-platform
  publish: 'publish',
  fakeAction: 'fake-action',

  // send to: aigc-platform
  genVideo: 'generate-video',
}

const queryFactory = (selector) => () => document.querySelector(selector);

const eventList = [
  { id: 'click', name: 'Click', type: 'mouse-event' },
  { id: 'dblclick', name: 'Double Click', type: 'mouse-event' },
  { id: 'mouseup', name: 'Mouseup', type: 'mouse-event' },
  { id: 'mousedown', name: 'Mousedown', type: 'mouse-event' },
  { id: 'mouseenter', name: 'Mouseenter', type: 'mouse-event' },
  { id: 'mouseleave', name: 'Mouseleave', type: 'mouse-event' },
  { id: 'mouseover', name: 'Mouseover', type: 'mouse-event' },
  { id: 'mouseout', name: 'Mouseout', type: 'mouse-event' },
  { id: 'mousemove', name: 'Mousemove', type: 'mouse-event' },
  { id: 'focus', name: 'Focus', type: 'focus-event' },
  { id: 'blur', name: 'Blur', type: 'focus-event' },
  { id: 'input', name: 'Input', type: 'input-event' },
  { id: 'change', name: 'Change', type: 'event' },
  { id: 'touchstart', name: 'Touch start', type: 'touch-event' },
  { id: 'touchend', name: 'Touch end', type: 'touch-event' },
  { id: 'touchmove', name: 'Touch move', type: 'touch-event' },
  { id: 'touchcancel', name: 'Touch cancel', type: 'touch-event' },
  { id: 'keydown', name: 'Keydown', type: 'keyboard-event' },
  { id: 'keyup', name: 'Keyup', type: 'keyboard-event' },
  { id: 'submit', name: 'Submit', type: 'submit-event' },
  { id: 'wheel', name: 'Wheel', type: 'wheel-event' },
];

function getEventObj(name, params) {
  const eventType = eventList.find(({ id }) => id === name)?.type ?? '';
  let event;

  switch (eventType) {
    case 'mouse-event':
      event = new MouseEvent(name, { ...params, view: window });
      break;
    case 'focus-event':
      event = new FocusEvent(name, params);
      break;
    case 'touch-event':
      event = new TouchEvent(name, params);
      break;
    case 'keyboard-event':
      event = new KeyboardEvent(name, params);
      break;
    case 'wheel-event':
      event = new WheelEvent(name, params);
      break;
    case 'input-event':
      event = new InputEvent(name, params);
      break;
    default:
      event = new Event(name, params);
  }

  return event;
}

function simulateEvent(element, name, params) {
  const event = getEventObj(name, params);
  const useNativeMethods = ['focus', 'submit', 'blur'];

  if (useNativeMethods.includes(name) && element[name]) {
    element[name]();
  } else {
    element.dispatchEvent(event);
  }
}


const textFieldTags = ['INPUT', 'TEXTAREA'];
const modifierKeys = [
  { name: 'Alt', id: 1 },
  { name: 'Meta', id: 4 },
  { name: 'Shift', id: 8 },
  { name: 'Control', id: 2 },
];

const keyDefinitions = {
  0: { keyCode: 48, key: '0', code: 'Digit0' },
  1: { keyCode: 49, key: '1', code: 'Digit1' },
  2: { keyCode: 50, key: '2', code: 'Digit2' },
  3: { keyCode: 51, key: '3', code: 'Digit3' },
  4: { keyCode: 52, key: '4', code: 'Digit4' },
  5: { keyCode: 53, key: '5', code: 'Digit5' },
  6: { keyCode: 54, key: '6', code: 'Digit6' },
  7: { keyCode: 55, key: '7', code: 'Digit7' },
  8: { keyCode: 56, key: '8', code: 'Digit8' },
  9: { keyCode: 57, key: '9', code: 'Digit9' },
  Power: { key: 'Power', code: 'Power' },
  Eject: { key: 'Eject', code: 'Eject' },
  Abort: { keyCode: 3, code: 'Abort', key: 'Cancel' },
  Help: { keyCode: 6, code: 'Help', key: 'Help' },
  Backspace: { keyCode: 8, code: 'Backspace', key: 'Backspace' },
  Tab: { keyCode: 9, code: 'Tab', key: 'Tab' },
  Numpad5: {
    keyCode: 12,
    shiftKeyCode: 101,
    key: 'Clear',
    code: 'Numpad5',
    shiftKey: '5',
    location: 3,
  },
  NumpadEnter: {
    keyCode: 13,
    code: 'NumpadEnter',
    key: 'Enter',
    text: '\r',
    location: 3,
  },
  Enter: { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
  '\r': { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
  '\n': { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
  ShiftLeft: { keyCode: 16, code: 'ShiftLeft', key: 'Shift', location: 1 },
  ShiftRight: { keyCode: 16, code: 'ShiftRight', key: 'Shift', location: 2 },
  ControlLeft: {
    keyCode: 17,
    code: 'ControlLeft',
    key: 'Control',
    location: 1,
  },
  ControlRight: {
    keyCode: 17,
    code: 'ControlRight',
    key: 'Control',
    location: 2,
  },
  AltLeft: { keyCode: 18, code: 'AltLeft', key: 'Alt', location: 1 },
  AltRight: { keyCode: 18, code: 'AltRight', key: 'Alt', location: 2 },
  Pause: { keyCode: 19, code: 'Pause', key: 'Pause' },
  CapsLock: { keyCode: 20, code: 'CapsLock', key: 'CapsLock' },
  Escape: { keyCode: 27, code: 'Escape', key: 'Escape' },
  Convert: { keyCode: 28, code: 'Convert', key: 'Convert' },
  NonConvert: { keyCode: 29, code: 'NonConvert', key: 'NonConvert' },
  Space: { keyCode: 32, code: 'Space', key: ' ' },
  Numpad9: {
    keyCode: 33,
    shiftKeyCode: 105,
    key: 'PageUp',
    code: 'Numpad9',
    shiftKey: '9',
    location: 3,
  },
  PageUp: { keyCode: 33, code: 'PageUp', key: 'PageUp' },
  Numpad3: {
    keyCode: 34,
    shiftKeyCode: 99,
    key: 'PageDown',
    code: 'Numpad3',
    shiftKey: '3',
    location: 3,
  },
  PageDown: { keyCode: 34, code: 'PageDown', key: 'PageDown' },
  End: { keyCode: 35, code: 'End', key: 'End' },
  Numpad1: {
    keyCode: 35,
    shiftKeyCode: 97,
    key: 'End',
    code: 'Numpad1',
    shiftKey: '1',
    location: 3,
  },
  Home: { keyCode: 36, code: 'Home', key: 'Home' },
  Numpad7: {
    keyCode: 36,
    shiftKeyCode: 103,
    key: 'Home',
    code: 'Numpad7',
    shiftKey: '7',
    location: 3,
  },
  ArrowLeft: { keyCode: 37, code: 'ArrowLeft', key: 'ArrowLeft' },
  Numpad4: {
    keyCode: 37,
    shiftKeyCode: 100,
    key: 'ArrowLeft',
    code: 'Numpad4',
    shiftKey: '4',
    location: 3,
  },
  Numpad8: {
    keyCode: 38,
    shiftKeyCode: 104,
    key: 'ArrowUp',
    code: 'Numpad8',
    shiftKey: '8',
    location: 3,
  },
  ArrowUp: { keyCode: 38, code: 'ArrowUp', key: 'ArrowUp' },
  ArrowRight: { keyCode: 39, code: 'ArrowRight', key: 'ArrowRight' },
  Numpad6: {
    keyCode: 39,
    shiftKeyCode: 102,
    key: 'ArrowRight',
    code: 'Numpad6',
    shiftKey: '6',
    location: 3,
  },
  Numpad2: {
    keyCode: 40,
    shiftKeyCode: 98,
    key: 'ArrowDown',
    code: 'Numpad2',
    shiftKey: '2',
    location: 3,
  },
  ArrowDown: { keyCode: 40, code: 'ArrowDown', key: 'ArrowDown' },
  Select: { keyCode: 41, code: 'Select', key: 'Select' },
  Open: { keyCode: 43, code: 'Open', key: 'Execute' },
  PrintScreen: { keyCode: 44, code: 'PrintScreen', key: 'PrintScreen' },
  Insert: { keyCode: 45, code: 'Insert', key: 'Insert' },
  Numpad0: {
    keyCode: 45,
    shiftKeyCode: 96,
    key: 'Insert',
    code: 'Numpad0',
    shiftKey: '0',
    location: 3,
  },
  Delete: { keyCode: 46, code: 'Delete', key: 'Delete' },
  NumpadDecimal: {
    keyCode: 46,
    shiftKeyCode: 110,
    code: 'NumpadDecimal',
    key: '\u0000',
    shiftKey: '.',
    location: 3,
  },
  Digit0: { keyCode: 48, code: 'Digit0', shiftKey: ')', key: '0' },
  Digit1: { keyCode: 49, code: 'Digit1', shiftKey: '!', key: '1' },
  Digit2: { keyCode: 50, code: 'Digit2', shiftKey: '@', key: '2' },
  Digit3: { keyCode: 51, code: 'Digit3', shiftKey: '#', key: '3' },
  Digit4: { keyCode: 52, code: 'Digit4', shiftKey: '$', key: '4' },
  Digit5: { keyCode: 53, code: 'Digit5', shiftKey: '%', key: '5' },
  Digit6: { keyCode: 54, code: 'Digit6', shiftKey: '^', key: '6' },
  Digit7: { keyCode: 55, code: 'Digit7', shiftKey: '&', key: '7' },
  Digit8: { keyCode: 56, code: 'Digit8', shiftKey: '*', key: '8' },
  Digit9: { keyCode: 57, code: 'Digit9', shiftKey: '(', key: '9' },
  KeyA: { keyCode: 65, code: 'KeyA', shiftKey: 'A', key: 'a' },
  KeyB: { keyCode: 66, code: 'KeyB', shiftKey: 'B', key: 'b' },
  KeyC: { keyCode: 67, code: 'KeyC', shiftKey: 'C', key: 'c' },
  KeyD: { keyCode: 68, code: 'KeyD', shiftKey: 'D', key: 'd' },
  KeyE: { keyCode: 69, code: 'KeyE', shiftKey: 'E', key: 'e' },
  KeyF: { keyCode: 70, code: 'KeyF', shiftKey: 'F', key: 'f' },
  KeyG: { keyCode: 71, code: 'KeyG', shiftKey: 'G', key: 'g' },
  KeyH: { keyCode: 72, code: 'KeyH', shiftKey: 'H', key: 'h' },
  KeyI: { keyCode: 73, code: 'KeyI', shiftKey: 'I', key: 'i' },
  KeyJ: { keyCode: 74, code: 'KeyJ', shiftKey: 'J', key: 'j' },
  KeyK: { keyCode: 75, code: 'KeyK', shiftKey: 'K', key: 'k' },
  KeyL: { keyCode: 76, code: 'KeyL', shiftKey: 'L', key: 'l' },
  KeyM: { keyCode: 77, code: 'KeyM', shiftKey: 'M', key: 'm' },
  KeyN: { keyCode: 78, code: 'KeyN', shiftKey: 'N', key: 'n' },
  KeyO: { keyCode: 79, code: 'KeyO', shiftKey: 'O', key: 'o' },
  KeyP: { keyCode: 80, code: 'KeyP', shiftKey: 'P', key: 'p' },
  KeyQ: { keyCode: 81, code: 'KeyQ', shiftKey: 'Q', key: 'q' },
  KeyR: { keyCode: 82, code: 'KeyR', shiftKey: 'R', key: 'r' },
  KeyS: { keyCode: 83, code: 'KeyS', shiftKey: 'S', key: 's' },
  KeyT: { keyCode: 84, code: 'KeyT', shiftKey: 'T', key: 't' },
  KeyU: { keyCode: 85, code: 'KeyU', shiftKey: 'U', key: 'u' },
  KeyV: { keyCode: 86, code: 'KeyV', shiftKey: 'V', key: 'v' },
  KeyW: { keyCode: 87, code: 'KeyW', shiftKey: 'W', key: 'w' },
  KeyX: { keyCode: 88, code: 'KeyX', shiftKey: 'X', key: 'x' },
  KeyY: { keyCode: 89, code: 'KeyY', shiftKey: 'Y', key: 'y' },
  KeyZ: { keyCode: 90, code: 'KeyZ', shiftKey: 'Z', key: 'z' },
  MetaLeft: { keyCode: 91, code: 'MetaLeft', key: 'Meta', location: 1 },
  MetaRight: { keyCode: 92, code: 'MetaRight', key: 'Meta', location: 2 },
  ContextMenu: { keyCode: 93, code: 'ContextMenu', key: 'ContextMenu' },
  NumpadMultiply: {
    keyCode: 106,
    code: 'NumpadMultiply',
    key: '*',
    location: 3,
  },
  NumpadAdd: { keyCode: 107, code: 'NumpadAdd', key: '+', location: 3 },
  NumpadSubtract: {
    keyCode: 109,
    code: 'NumpadSubtract',
    key: '-',
    location: 3,
  },
  NumpadDivide: { keyCode: 111, code: 'NumpadDivide', key: '/', location: 3 },
  F1: { keyCode: 112, code: 'F1', key: 'F1' },
  F2: { keyCode: 113, code: 'F2', key: 'F2' },
  F3: { keyCode: 114, code: 'F3', key: 'F3' },
  F4: { keyCode: 115, code: 'F4', key: 'F4' },
  F5: { keyCode: 116, code: 'F5', key: 'F5' },
  F6: { keyCode: 117, code: 'F6', key: 'F6' },
  F7: { keyCode: 118, code: 'F7', key: 'F7' },
  F8: { keyCode: 119, code: 'F8', key: 'F8' },
  F9: { keyCode: 120, code: 'F9', key: 'F9' },
  F10: { keyCode: 121, code: 'F10', key: 'F10' },
  F11: { keyCode: 122, code: 'F11', key: 'F11' },
  F12: { keyCode: 123, code: 'F12', key: 'F12' },
  F13: { keyCode: 124, code: 'F13', key: 'F13' },
  F14: { keyCode: 125, code: 'F14', key: 'F14' },
  F15: { keyCode: 126, code: 'F15', key: 'F15' },
  F16: { keyCode: 127, code: 'F16', key: 'F16' },
  F17: { keyCode: 128, code: 'F17', key: 'F17' },
  F18: { keyCode: 129, code: 'F18', key: 'F18' },
  F19: { keyCode: 130, code: 'F19', key: 'F19' },
  F20: { keyCode: 131, code: 'F20', key: 'F20' },
  F21: { keyCode: 132, code: 'F21', key: 'F21' },
  F22: { keyCode: 133, code: 'F22', key: 'F22' },
  F23: { keyCode: 134, code: 'F23', key: 'F23' },
  F24: { keyCode: 135, code: 'F24', key: 'F24' },
  NumLock: { keyCode: 144, code: 'NumLock', key: 'NumLock' },
  ScrollLock: { keyCode: 145, code: 'ScrollLock', key: 'ScrollLock' },
  AudioVolumeMute: {
    keyCode: 173,
    code: 'AudioVolumeMute',
    key: 'AudioVolumeMute',
  },
  AudioVolumeDown: {
    keyCode: 174,
    code: 'AudioVolumeDown',
    key: 'AudioVolumeDown',
  },
  AudioVolumeUp: { keyCode: 175, code: 'AudioVolumeUp', key: 'AudioVolumeUp' },
  MediaTrackNext: {
    keyCode: 176,
    code: 'MediaTrackNext',
    key: 'MediaTrackNext',
  },
  MediaTrackPrevious: {
    keyCode: 177,
    code: 'MediaTrackPrevious',
    key: 'MediaTrackPrevious',
  },
  MediaStop: { keyCode: 178, code: 'MediaStop', key: 'MediaStop' },
  MediaPlayPause: {
    keyCode: 179,
    code: 'MediaPlayPause',
    key: 'MediaPlayPause',
  },
  Semicolon: { keyCode: 186, code: 'Semicolon', shiftKey: ':', key: ';' },
  Equal: { keyCode: 187, code: 'Equal', shiftKey: '+', key: '=' },
  NumpadEqual: { keyCode: 187, code: 'NumpadEqual', key: '=', location: 3 },
  Comma: { keyCode: 188, code: 'Comma', shiftKey: '<', key: ',' },
  Minus: { keyCode: 189, code: 'Minus', shiftKey: '_', key: '-' },
  Period: { keyCode: 190, code: 'Period', shiftKey: '>', key: '.' },
  Slash: { keyCode: 191, code: 'Slash', shiftKey: '?', key: '/' },
  Backquote: { keyCode: 192, code: 'Backquote', shiftKey: '~', key: '`' },
  BracketLeft: { keyCode: 219, code: 'BracketLeft', shiftKey: '{', key: '[' },
  Backslash: { keyCode: 220, code: 'Backslash', shiftKey: '|', key: '\\' },
  BracketRight: { keyCode: 221, code: 'BracketRight', shiftKey: '}', key: ']' },
  Quote: { keyCode: 222, code: 'Quote', shiftKey: '"', key: "'" },
  AltGraph: { keyCode: 225, code: 'AltGraph', key: 'AltGraph' },
  Props: { keyCode: 247, code: 'Props', key: 'CrSel' },
  Cancel: { keyCode: 3, key: 'Cancel', code: 'Abort' },
  Clear: { keyCode: 12, key: 'Clear', code: 'Numpad5', location: 3 },
  Shift: { keyCode: 16, key: 'Shift', code: 'ShiftLeft', location: 1 },
  Control: { keyCode: 17, key: 'Control', code: 'ControlLeft', location: 1 },
  Alt: { keyCode: 18, key: 'Alt', code: 'AltLeft', location: 1 },
  Accept: { keyCode: 30, key: 'Accept' },
  ModeChange: { keyCode: 31, key: 'ModeChange' },
  ' ': { keyCode: 32, key: ' ', code: 'Space' },
  Print: { keyCode: 42, key: 'Print' },
  Execute: { keyCode: 43, key: 'Execute', code: 'Open' },
  '\u0000': { keyCode: 46, key: '\u0000', code: 'NumpadDecimal', location: 3 },
  a: { keyCode: 65, key: 'a', code: 'KeyA' },
  b: { keyCode: 66, key: 'b', code: 'KeyB' },
  c: { keyCode: 67, key: 'c', code: 'KeyC' },
  d: { keyCode: 68, key: 'd', code: 'KeyD' },
  e: { keyCode: 69, key: 'e', code: 'KeyE' },
  f: { keyCode: 70, key: 'f', code: 'KeyF' },
  g: { keyCode: 71, key: 'g', code: 'KeyG' },
  h: { keyCode: 72, key: 'h', code: 'KeyH' },
  i: { keyCode: 73, key: 'i', code: 'KeyI' },
  j: { keyCode: 74, key: 'j', code: 'KeyJ' },
  k: { keyCode: 75, key: 'k', code: 'KeyK' },
  l: { keyCode: 76, key: 'l', code: 'KeyL' },
  m: { keyCode: 77, key: 'm', code: 'KeyM' },
  n: { keyCode: 78, key: 'n', code: 'KeyN' },
  o: { keyCode: 79, key: 'o', code: 'KeyO' },
  p: { keyCode: 80, key: 'p', code: 'KeyP' },
  q: { keyCode: 81, key: 'q', code: 'KeyQ' },
  r: { keyCode: 82, key: 'r', code: 'KeyR' },
  s: { keyCode: 83, key: 's', code: 'KeyS' },
  t: { keyCode: 84, key: 't', code: 'KeyT' },
  u: { keyCode: 85, key: 'u', code: 'KeyU' },
  v: { keyCode: 86, key: 'v', code: 'KeyV' },
  w: { keyCode: 87, key: 'w', code: 'KeyW' },
  x: { keyCode: 88, key: 'x', code: 'KeyX' },
  y: { keyCode: 89, key: 'y', code: 'KeyY' },
  z: { keyCode: 90, key: 'z', code: 'KeyZ' },
  Meta: { keyCode: 91, key: 'Meta', code: 'MetaLeft', location: 1 },
  '*': { keyCode: 106, key: '*', code: 'NumpadMultiply', location: 3 },
  '+': { keyCode: 107, key: '+', code: 'NumpadAdd', location: 3 },
  '-': { keyCode: 109, key: '-', code: 'NumpadSubtract', location: 3 },
  '/': { keyCode: 111, key: '/', code: 'NumpadDivide', location: 3 },
  ';': { keyCode: 186, key: ';', code: 'Semicolon' },
  '=': { keyCode: 187, key: '=', code: 'Equal' },
  ',': { keyCode: 188, key: ',', code: 'Comma' },
  '.': { keyCode: 190, key: '.', code: 'Period' },
  '`': { keyCode: 192, key: '`', code: 'Backquote' },
  '[': { keyCode: 219, key: '[', code: 'BracketLeft' },
  '\\': { keyCode: 220, key: '\\', code: 'Backslash' },
  ']': { keyCode: 221, key: ']', code: 'BracketRight' },
  "'": { keyCode: 222, key: "'", code: 'Quote' },
  Attn: { keyCode: 246, key: 'Attn' },
  CrSel: { keyCode: 247, key: 'CrSel', code: 'Props' },
  ExSel: { keyCode: 248, key: 'ExSel' },
  EraseEof: { keyCode: 249, key: 'EraseEof' },
  Play: { keyCode: 250, key: 'Play' },
  ZoomOut: { keyCode: 251, key: 'ZoomOut' },
  ')': { keyCode: 48, key: ')', code: 'Digit0' },
  '!': { keyCode: 49, key: '!', code: 'Digit1' },
  '@': { keyCode: 50, key: '@', code: 'Digit2' },
  '#': { keyCode: 51, key: '#', code: 'Digit3' },
  $: { keyCode: 52, key: '$', code: 'Digit4' },
  '%': { keyCode: 53, key: '%', code: 'Digit5' },
  '^': { keyCode: 54, key: '^', code: 'Digit6' },
  '&': { keyCode: 55, key: '&', code: 'Digit7' },
  '(': { keyCode: 57, key: '(', code: 'Digit9' },
  A: { keyCode: 65, key: 'A', code: 'KeyA' },
  B: { keyCode: 66, key: 'B', code: 'KeyB' },
  C: { keyCode: 67, key: 'C', code: 'KeyC' },
  D: { keyCode: 68, key: 'D', code: 'KeyD' },
  E: { keyCode: 69, key: 'E', code: 'KeyE' },
  F: { keyCode: 70, key: 'F', code: 'KeyF' },
  G: { keyCode: 71, key: 'G', code: 'KeyG' },
  H: { keyCode: 72, key: 'H', code: 'KeyH' },
  I: { keyCode: 73, key: 'I', code: 'KeyI' },
  J: { keyCode: 74, key: 'J', code: 'KeyJ' },
  K: { keyCode: 75, key: 'K', code: 'KeyK' },
  L: { keyCode: 76, key: 'L', code: 'KeyL' },
  M: { keyCode: 77, key: 'M', code: 'KeyM' },
  N: { keyCode: 78, key: 'N', code: 'KeyN' },
  O: { keyCode: 79, key: 'O', code: 'KeyO' },
  P: { keyCode: 80, key: 'P', code: 'KeyP' },
  Q: { keyCode: 81, key: 'Q', code: 'KeyQ' },
  R: { keyCode: 82, key: 'R', code: 'KeyR' },
  S: { keyCode: 83, key: 'S', code: 'KeyS' },
  T: { keyCode: 84, key: 'T', code: 'KeyT' },
  U: { keyCode: 85, key: 'U', code: 'KeyU' },
  V: { keyCode: 86, key: 'V', code: 'KeyV' },
  W: { keyCode: 87, key: 'W', code: 'KeyW' },
  X: { keyCode: 88, key: 'X', code: 'KeyX' },
  Y: { keyCode: 89, key: 'Y', code: 'KeyY' },
  Z: { keyCode: 90, key: 'Z', code: 'KeyZ' },
  ':': { keyCode: 186, key: ':', code: 'Semicolon' },
  '<': { keyCode: 188, key: '<', code: 'Comma' },
  _: { keyCode: 189, key: '_', code: 'Minus' },
  '>': { keyCode: 190, key: '>', code: 'Period' },
  '?': { keyCode: 191, key: '?', code: 'Slash' },
  '~': { keyCode: 192, key: '~', code: 'Backquote' },
  '{': { keyCode: 219, key: '{', code: 'BracketLeft' },
  '|': { keyCode: 220, key: '|', code: 'Backslash' },
  '}': { keyCode: 221, key: '}', code: 'BracketRight' },
  '"': { keyCode: 222, key: '"', code: 'Quote' },
  SoftLeft: { key: 'SoftLeft', code: 'SoftLeft', location: 4 },
  SoftRight: { key: 'SoftRight', code: 'SoftRight', location: 4 },
  Camera: { keyCode: 44, key: 'Camera', code: 'Camera', location: 4 },
  Call: { key: 'Call', code: 'Call', location: 4 },
  EndCall: { keyCode: 95, key: 'EndCall', code: 'EndCall', location: 4 },
  VolumeDown: {
    keyCode: 182,
    key: 'VolumeDown',
    code: 'VolumeDown',
    location: 4,
  },
  VolumeUp: { keyCode: 183, key: 'VolumeUp', code: 'VolumeUp', location: 4 },
};

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value'
).set;
function reactJsEvent(element, value) {
  if (!element._valueTracker) return;

  const previousValue = element.value;
  nativeInputValueSetter.call(element, value);
  element._valueTracker.setValue(previousValue);
}

function formEvent(element, data) {
  if (data.type === 'text-field') {
    const currentKey = /\s/.test(data.value) ? 'Space' : data.value;
    const { key, keyCode, code } = keyDefinitions[currentKey] || {
      key: currentKey,
      keyCode: 0,
      code: `Key${currentKey}`,
    };

    simulateEvent(element, 'input', {
      inputType: 'insertText',
      data: data.value,
      bubbles: true,
      cancelable: true,
    });

    simulateEvent(element, 'keydown', {
      key,
      code,
      keyCode,
      bubbles: true,
      cancelable: true,
    });
    simulateEvent(element, 'keyup', {
      key,
      code,
      keyCode,
      bubbles: true,
      cancelable: true,
    });
  }

  simulateEvent(element, 'input', {
    inputType: 'insertText',
    data: data.value,
    bubbles: true,
    cancelable: true,
  });

  if (data.type !== 'text-field') {
    element.dispatchEvent(
      new Event('change', { bubbles: true, cancelable: true })
    );
  }
}
async function inputText({ data, element, isEditable }) {
  element?.focus();
  element?.click();
  const elementKey = isEditable ? 'textContent' : 'value';

  if (data.delay > 0 && !document.hidden) {
    for (let index = 0; index < data.value.length; index += 1) {
      if (elementKey === 'value') reactJsEvent(element, element.value);

      const currentChar = data.value[index];
      element[elementKey] += currentChar;

      formEvent(element, {
        type: 'text-field',
        value: currentChar,
        isEditable,
      });

      await delay({ ms: data.delay });
    }
  } else {
    if (elementKey === 'value') reactJsEvent(element, element.value);

    element[elementKey] += data.value;

    formEvent(element, {
      isEditable,
      type: 'text-field',
      value: data.value[0] ?? '',
    });
  }

  element.dispatchEvent(
    new Event('change', { bubbles: true, cancelable: true })
  );

  element?.blur();
}

async function handleFormElement(element, data) {
  const textFields = ['INPUT', 'TEXTAREA'];
  const isEditable =
    element.hasAttribute('contenteditable') && element.isContentEditable;

  if (isEditable) {
    if (data.clearValue) element.innerText = '';

    await inputText({ data, element, isEditable });
    return;
  }

  if (data.type === 'text-field' && textFields.includes(element.tagName)) {
    if (data.clearValue) {
      element?.select();
      reactJsEvent(element, '');
      element.value = '';
    }

    await inputText({ data, element });
    return;
  }

  element?.focus();

  if (data.type === 'checkbox' || data.type === 'radio') {
    element.checked = data.selected;
    formEvent(element, { type: data.type, value: data.selected });
  } else if (data.type === 'select') {
    let optionValue = data.value;

    const options = element.querySelectorAll('option');
    const getOptionValue = (index) => {
      if (!options) return element.value;

      let optionIndex = index;
      const maxIndex = options.length - 1;

      if (index < 0) optionIndex = 0;
      else if (index > maxIndex) optionIndex = maxIndex;

      return options[optionIndex]?.value || element.value;
    };

    switch (data.selectOptionBy) {
      case 'first-option':
        optionValue = getOptionValue(0);
        break;
      case 'last-option':
        optionValue = getOptionValue(options.length - 1);
        break;
      case 'custom-position':
        optionValue = getOptionValue(+data.optionPosition - 1 ?? 0);
        break;
      default:
    }

    if (optionValue) {
      element.value = optionValue;
      formEvent(element, data);
    }
  }

  element?.blur();
}

/**
 * type: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'video/mp4' | 'video/webm' | 'video/ogg' | 'audio/mpeg' | 'audio/ogg' | 'audio/wav' | 'audio/webm'
 */
function base64ToBlob(base64, type = 'video/mp4') {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type });
}

async function getVideoDuration(blob) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(blob);
    video.onloadedmetadata = function () {
      resolve(video.duration);
    };
  });
}

function base64ArrayToBlob(base64List, type = 'video/mp4') {
  try {
    const totalLen = base64List.reduce((acc, base64, idx) => {
      const binStr = atob(base64);
      base64List[idx] = binStr;
      return acc + binStr.length;
    }, 0);
    let resArr = new Uint8Array(totalLen);
    let j = 0;
    base64List.forEach((binStr) => {
      const len = binStr.length;
      for (let i = 0; i < len; i++, j++) {
        resArr[j] = binStr.charCodeAt(i);
      }
    });
    return new Blob([resArr], { type });
  } catch (e) {
    console.error('出错了出错了', e);
    throw new Error('base64ArrayToBlob error');
  }
}

async function getFile(path, maxDuration = Infinity) {
  const mime = 'video/mp4';
  const filename = `${Date.now()}.mp4`
  let blob;
  if (Array.isArray(path)) {
    const base64Chunks = path;
    blob = base64ArrayToBlob(base64Chunks);
  } else if (path.startsWith('http')) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(response.statusText);
    blob = await response.blob();
  } else {
    const base64 = path;
    blob = base64ToBlob(base64);
  }
  const duration = await getVideoDuration(blob);
  if (duration > maxDuration) {
    throw new Error(`视频时长超出限制, 最大为${maxDuration.toFixed(2)}秒`);
  }
  let fileObject = new File([blob], filename, { type: mime });
  return fileObject;
};

/**
 * 上传文件，到Input[type="file"],
 */
async function _upload({ element, filePaths, maxSize, maxDuration }) {
  if (!filePaths || filePaths.length === 0)
    throw new Error('filePaths is required');
  if (!element)
    throw new Error('Element not found');

  const filesPromises = await Promise.all(filePaths.map((pathIt) => getFile(pathIt, maxDuration)));
  const dataTransfer = filesPromises.reduce((acc, file) => {
    if (file.size > maxSize) {
      throw new Error(`文件大小超出限制, 最大为${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }
    acc.items.add(file);
    return acc;
  }, new DataTransfer());

  // injectFiles(element, dataTransfer.files);
  const notFileTypeAttr = element.getAttribute('type') !== 'file';

  if (element.tagName !== 'INPUT' || notFileTypeAttr) return;

  element.files = dataTransfer.files;
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * 获取指定日期的后的第n天的日期
 * @returns // 2024-03-27
 */
function getNthDayLater({ date, n }) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return formatDate({ date: d });
}

/**
 *
 * @param {*} date 要对比的时间（Date类型）
 * @returns {isNextMonth: boolean, days: number}
 */
function diffNow(date) {
  const now = new Date();
  const diff = date - now;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const isNextMonth = date.getMonth() > now.getMonth();
  return {
    isNextMonth: isNextMonth,
    days: d,
  }
}

/**
 * 模拟input改变
 */
function triggerInputEventForReact({ element, value = '' } = {}) {
  // react版本
  const inputTypes = [
    window.HTMLInputElement,
    window.HTMLSelectElement,
    window.HTMLTextAreaElement,
  ];
  // only process the change on elements we know have a value setter in their constructor
  if (inputTypes.indexOf(element.__proto__.constructor) > -1) {
    const setValue = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
    const event = new Event('input', { bubbles: true });
    setValue.call(element, value);
    element.dispatchEvent(event);
  }
};

/**
 * 模拟点击
 */
function simulateClickElement({ element }) {
  const eventOpts = { bubbles: true, view: window };

  element.dispatchEvent(new MouseEvent('mousedown', eventOpts));
  element.dispatchEvent(new MouseEvent('mouseup', eventOpts));

  if (element.click) {
    element.click();
  } else {
    element.dispatchEvent(new PointerEvent('click', { bubbles: true }));
  }

  element.focus?.();
}

async function ensureInTargetPage({
  data,
  targetUrl,
  matchStrategy = 'startsWith',
  retryInterval = 1000 } = {}) {

  return new Promise(async (resolve, reject) => {
    const originalEvent = data;
    originalEvent.payload.retryTime = originalEvent.payload.retryTime || 0;
    const cacheEvent = {
      event: FarmEventMap.cacheEvent,
      payload: originalEvent,
    }

    if (originalEvent.payload.retryTime >= 2) {
      cacheEvent.payload.retryTime += 1;
      return window.ipc.sendToHost({
        event: originalEvent.event,
        payload: { success: false, data, msg: '打不开相应页面' }
      })
    }
    cacheEvent.payload.retryTime += 1;

    let isInTargetPage = false;
    if (typeof matchStrategy === 'function') {
      isInTargetPage = await matchStrategy();
    } else if (matchStrategy === 'exact') {
      isInTargetPage = window.location.href === targetUrl;
    } else if (matchStrategy === 'includes') {
      isInTargetPage = window.location.href.includes(targetUrl);
    } else if (matchStrategy === 'startsWith') {
      isInTargetPage = window.location.href.startsWith(targetUrl);
    }

    if (!isInTargetPage) {
      console.log('not in target page, retrying...{isInTargetPage}', isInTargetPage);
      cacheEvent.payload._debug = { matchStrategy: matchStrategy.toString(), targetUrl, currentUrl: window.location.href }
      window.ipc.sendToHost(cacheEvent)
      await delay({ ms: retryInterval });
      window.location.href = targetUrl;
    }
    resolve(1);
  });
}


function _proxyXhr({ targetUrl, processBody, processParams, callback }) {
  if (XMLHttpRequest.proxyAlready) {
    return;
  }
  XMLHttpRequest.proxyAlready = true;

  const defaultProcessParams = (args) => {
    const [bodyStr] = args;
    const body = JSON.parse(bodyStr);
    args[0] = JSON.stringify(processBody(body));
    return args;
  };

  processParams = processParams || defaultProcessParams;

  // 代理xhr请求，更改请求参数
  (function (open, send) {
    let xhrOpenRequestUrl;  // capture method and url
    let xhrSendResponseUrl; // capture request body
    let responseData;       // captured response

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      xhrOpenRequestUrl = url;
      open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (data) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {

          if (this.responseURL.includes(targetUrl)) {
            responseData = JSON.parse(this.responseText);
            callback(responseData, this.responseURL);
          }
        }
      }, false);
      let args = arguments;
      if (xhrOpenRequestUrl.includes(targetUrl)) {
        args = processParams(arguments, xhrOpenRequestUrl);
      }
      send.apply(this, args);
    }

  })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)

}

function _proxyFetch({ targetUrl, processBody, processParams, callback }, bodyKey = 'body') {
  if (window.fetch.proxyAlready) {
    return;
  }
  window.fetch.proxyAlready = true;
  const defaultProcessParams = (args) => {
    const [url, data = {}] = args;
    body = data[bodyKey];
    let newBody = processBody(JSON.parse(body));
    args[1].body = JSON.stringify(newBody);
    return args;
  };
  processParams = processParams || defaultProcessParams;
  // 代理fetch请求，更改请求参数
  window.fetch = new Proxy(window.fetch, {
    apply(target, thisArg, args) {
      const [url] = args;
      const needProcess = url.includes(targetUrl);
      if (needProcess) {
        processParams(args);
      }
      return Reflect.apply(target, thisArg, args).then((response) => {
        if (needProcess) {
          const copy = response.clone();
          copy.json().then((res) => {
            callback(res, url);
          });
        }
        return response;
      }).catch((err) => {
        callback(err);
      });;
    }
  });
}

// 实现一个上报心跳的class
class KeepAliveManager {

  constructor({ getDataToReport, platform }) {
    this.execCount = 0;
    const defaultCb = (a) => a;
    this.getDataToReport = getDataToReport || defaultCb;
    this.platform = platform;
  }

  async poll() {
    await automa.delay({ ms: 800 });
    const { platform } = this;
    const { changed, payload } = await this.getDataToReport({ platform }, this.execCount);
    this.execCount++;
    if (changed) {
      window.ipc.sendToHost({ event: FarmEventMap.reportPollStatus, payload })
    }
    this.poll();
  }

  start() {
    this.poll();
  }

}


/**
 * 延时
 * @returns Promise
 */
function delay({ ms = 500 } = {}) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 轮询直到条件满足
 * @returns Promise<string>
 */
async function waitUntil({ condition = () => true, timeout = 8000, interval = 500 } = {}) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (condition()) {
      return true;
    }
    await delay({ ms: interval });
  }
  return false;
}

const automa = {
  ensureInTargetPage,
  getKeepAliveInstance(...args) {
    return new KeepAliveManager(...args);
  },
  /**
   * 等待直到条件满足
   * @param {condition} 条件函数, 一直等待直到条件函数返回true
   * @returns Promise
   */
  waitUntil: async ({ condition, timeout, interval }) => {
    return await waitUntil({ condition, timeout, interval });
  },
  /**
   * 延时函数
   * @param {ms} 延时时间，单位(s)
   * @returns Promise
   */
  delay: async ({ ms }) => {
    return await delay({ ms });
  },
  /**
   * 代理xhr请求
   * @param {targetUrl} 要代理的url
   * @param {processBody} 处理请求体的函数
   * @param {processParams} 处理请求参数的函数
   * @param {callback} 请求完成后的回调函数
   */
  proxyXhr: async ({ targetUrl, processBody, processParams, callback }) => {
    return await _proxyXhr({ targetUrl, processBody, processParams, callback });
  },
  /**
   * 代理fetch请求
   * @param {targetUrl} 要代理的url
   * @param {processBody} 处理请求体的函数
   * @param {processParams} 处理请求参数的函数
   * @param {callback} 请求完成后的回调函数
   */
  proxyFetch: async ({ targetUrl, processBody, processParams, callback }) => {
    return await _proxyFetch({ targetUrl, processBody, processParams, callback });
  },
  /**
   * 查找元素
   * @param {selector} 要查找的元素选择器，可以是选择器字符串或者函数
   * @param {timeout} 超时时间
   * @param {msg} 找不到元素时的提示信息
   * @returns 返回找到的元素
   */
  querySelector: async ({ selector, timeout = 8000, msg = '找不到相应的元素' } = {}) => {
    const isFunc = typeof selector === 'function';
    const queySelectorFn = isFunc ? selector : () => document.querySelector(selector);
    const exist = await automa.waitUntil({ condition: queySelectorFn, timeout })
    if (!exist) {
      throw new Error(`${msg} 选择器:${selector}`);
    }
    return queySelectorFn();
  },
  /**
   * 输入 （input, textarea）
   * @param {selector} 要输入的元素选择器
   * @param {value} 要输入的值
   */
  input: async ({ selector, value }) => {
    const element = await automa.querySelector({ selector });
    const automaData = {
      selector,
      selected: true,
      clearValue: true,
      selectOptionBy: 'value',
      optionPosition: '1',
      type: 'text-field',
      value,
      delay: 0,
    }
    triggerInputEventForReact({ element, value });
    handleFormElement(element, automaData);
  },
  /**
   * 点击元素
   * @param {selector}: 要点击元素的选择器
   * @param {timeout}: 超时时间
   * @param {msg}: 找不到元素时的提示信息
   * @param {delay}: 找到节点后延迟{delay}秒点击
   */
  click: async ({ selector, timeout, msg, delay }) => {
    const element = await automa.querySelector({ selector, timeout, msg });
    if (delay) {
      await automa.delay({ ms: delay });
    }
    simulateClickElement({ element });
  },
  /**
   * 上传文件
   * @param {selector}: 上传文件的input选择器
   * @param {path}: 文件路径（即base64文本）
   * @param {successPredicate}: 成功条件，类型为function
   * @param {msg}: 上传失败时的提示信息
   * @param {maxSize}: 上传文件的最大大小
   * @param {maxDuration}: 上传视频的最大时长
   */
  upload: async ({ selector, path, successPredicate, msg, maxSize = Infinity, maxDuration = Infinity } = {}) => {
    const element = await automa.querySelector({ selector, msg: '找不到上传文件元素' });
    _upload({ element, filePaths: [path], maxSize, maxDuration });
    if (successPredicate) {
      const success = await waitUntil({ condition: successPredicate, timeout: 120 * 1000, interval: 1000 });
      if (!success) {
        msg = msg || '上传文件失败, 成功条件' + successPredicate;
        throw new Error(msg);
      }
    }
  },
};

const sleep = delay;


async function replaceNew2Self() {
  let links = document.querySelectorAll('a[target="_blank"]');
  for (curLink of links) {
    curLink.setAttribute('target', '_self');
  }
}


function getCookie(key) {
  const cookieObj = document.cookie.split(';').reduce((acc, cur) => {
    const [k, v] = cur.split('=');
    acc[k.trim()] = v;
    return acc;
  }, {});
  return cookieObj[key];
}

function getCookieList() {
  return document.cookie.split(';').map((cur) => {
    const [k, v] = cur.split('=');
    return k.trim();
  });
}

function list1MinusList2(list1, list2) {
  const set1 = new Set(list1);
  const set2 = new Set(list2);
  return new Set([...set1].filter(x => !set2.has(x)));
}

// async function caseDouyin(selector = '.zone-container') {
//   const labels = ['emo', '情感', '李诞', '文案', '@DOU+小助手']
//   // const element = document.querySelector(selector);
//   for (let l of labels) {
//     await automa.input({ selector, value: `#${l}` })
//     const itemSelector = `.mention-suggest-item-container--1I-xu .tag--A0IFC`;
//     const exist = await automa.waitUntil({ condition: () => document.querySelector(itemSelector), timeout: 2000 });
//     if (exist) {
//       automa.click({ selector: itemSelector })
//     }
//   }
//   console.log('finished...');
// }

// (async () => {
//   await caseDouyin();
// })();

window.automa = automa;
