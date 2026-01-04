const code2Kana = {
    "Digit3": "あ", "KeyE": "い", "Digit4": "う", "Digit5": "え", "Digit6": "お",
    "KeyT": "か", "KeyG": "き", "KeyH": "く", "Quote": "け", "KeyB": "こ",
    "KeyX": "さ", "KeyD": "し", "KeyR": "す", "KeyP": "せ", "KeyC": "そ",
    "KeyQ": "た", "KeyA": "ち", "KeyZ": "つ", "KeyW": "て", "KeyS": "と",
    "KeyU": "な", "KeyI": "に", "Digit1": "ぬ", "Comma": "ね", "KeyK": "の",
    "KeyF": "は", "KeyV": "ひ", "Digit2": "ふ", "Equal": "へ", "Minus": "ほ",
    "KeyJ": "ま", "KeyN": "み", "Backslash": "む", "Slash": "め", "KeyM": "も",
    "Digit7": "や", "Digit8": "ゆ", "Digit9": "よ",
    "KeyO": "ら", "KeyL": "り", "Period": "る", "Semicolon": "れ", "IntlRo": "ろ",
    "Digit0": "わ", "KeyY": "ん",
    "IntlYen": "ー", "BracketLeft": "゛", "BracketRight": "゜",
    "Space": "＿",
    "Escape": ""
}

const code2ShiftKana = {
    "Digit3": "ぁ", "KeyE": "ぃ", "Digit4": "ぅ", "Digit5": "ぇ", "Digit6": "ぉ",
    "KeyZ": "っ", "Digit7": "ゃ", "Digit8": "ゅ", "Digit9": "ょ", "Digit0": "を",
    "Comma": "、", "Period": "。", "Slash": "・", "BracketRight": "「", "Backslash": "」"
};



Object.defineProperty(KeyboardEvent.prototype, "kana", {
    get() {
      return this.shiftKey && code2ShiftKana[this.code] ? code2ShiftKana[this.code] : code2Kana[this.code];
    }
});

Object.defineProperty(KeyboardEvent.prototype, "char", {
    get() {
      return this.key === " " ? "_" : this.key === "Escape" ? "" : this.key;
    }
});