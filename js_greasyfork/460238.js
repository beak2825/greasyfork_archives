// ==UserScript==
// @name         Transliteration of Georgian
// @namespace    https://greasyfork.org/users/1029228
// @version      0.12
// @description  Adds transliteration to all text nodes containing Georgian letters. Press a button in the bottom right corner of the page, or use a command in the Tampermonkey menu. Cyrillic transliteration is supported in addition to Latin.
// @author       watxum
// @match        http*://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAbJJREFUOE+tk7GrQXEUx7+39CwoYcAiC4MMMiiDTcog3YRdyiClTK9elrsYFOIPMJmklJEiJZMkA1kMBrPkiu7rd8RzS1ev985y657z+/y+53t+h5Mk6QvAJ4AP/C7OAAROkiTx1eHxeAybzQar1aqEPTOA9KoiEAggk8kgkUgo6vo/wPF4RL1ex2q1QiQSQblcRjqdlimoVCqUY63d46GAJVg3qVQK3W4X7XabgM8txONxGAwGNBoNOeBwOECn02G/38NoNOJyucBisaBarcoAu90Ofr8f2WwW+XyeIKRAFEV4PB5MJhNotVpK3AuZAtaW3W6HSqXCer2G1+vFaDSC2+2+AZSmEAqFoNfrcTqdoFarqTQcDiMYDCKXy70HRKNRAkynU7hcLlyvV7q5WCwiFovdAL1eD61WC81m8yHm+R0w90ulEt26XC5hMpnQ6XSoJQLUajUMBgNy/h4+nw+FQgE8z9Ov7XaL2WwGs9lMHnAc92PicDgEGxEzSKPR0DSYafP5nL5K8TCRPRrmLHO/3+8jmUxCEIS36yVbpsVigc1mA6fTCYfD8fYwAFqmP63zNzNe4MPEsD5EAAAAAElFTkSuQmCC
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460238/Transliteration%20of%20Georgian.user.js
// @updateURL https://update.greasyfork.org/scripts/460238/Transliteration%20of%20Georgian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isInline(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
        }

        if (inlineTags.includes(node.tagName)) {
            return true;
        } else if (blockTags.includes(node.tagName)) {
            return false;
        }

        return null;
    }

    function doesBlockHaveMoreText(node) {
        for (let currentNode = node.parentNode; currentNode; currentNode = currentNode.parentNode) {
            if (currentNode.textContent.trim() !== node.textContent.trim()) {
                return true;
            }
            if (!isInline(currentNode)) {
                return false;
            }
        }
        return false;
    }

    function getAllTextNodes() {
        let treeWalker = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
        let nodes = [];
        let node;
        while ((node = treeWalker.nextNode())) {
            nodes.push(node);
        }
        return nodes.filter((node) => !wrapper.contains(node));
    }

    function initSettings() {
        if (!GM_getValue('target')) {
            GM_setValue('target', 'latin');
            GM_setValue('separator', 'auto');
            GM_setValue('showButton', 'always');
            GM_setValue('showButtonInFrames', false);
            GM_setValue('runOnLoad', false);
        }

        if (GM_getValue('showButtonInFrames') === undefined) {
            GM_setValue('showButtonInFrames', false);
        }
    }

    function removeTransliteration() {
        [...document.querySelectorAll('.transliterationOfGeorgian-transliteration')]
            .forEach((el) => {
                el.remove();
            });
    }

    function convertString(georgian, target) {
        return georgian
            .split('')
            .map((letter) => conversions[target][letter] || letter)
            .join('');
    }

    function convert() {
        removeTransliteration();
        if (!wrapper || !wrapper.parentNode) {
            addToDom();
        }
        getAllTextNodes()
            .filter((node) => node.textContent.match(georgianRegexp))
            .forEach((node) => {
                let newNode = document.createElement('span');
                newNode.className = 'transliterationOfGeorgian-transliteration';

                let prefix = '';
                let postfix = '';
                if (
                    GM_getValue('separator') === 'br'
                    || (
                        GM_getValue('separator') === 'auto'
                        && !doesBlockHaveMoreText(node)
                        // && node.parentNode.tagName !== 'A'
                    )
               ) {
                    prefix = document.createElement('br');
                } else {
                    prefix = ' [';
                    postfix = ']';
                }

                newNode.append(
                    prefix,
                    convertString(node.textContent.trim(), GM_getValue('target')),
                    postfix
                );

                // Add a space if the converted node ends with spaces.
                if (postfix && node.textContent.match(/\s+$/)) {
                    newNode.append(' ');
                }

                node.after(newNode);
            });
    }

    function toggleTransliteration() {
        if (document.querySelector('.transliterationOfGeorgian-transliteration')) {
            removeTransliteration();
        } else {
            convert();
        }
    }

    function saveSettings() {
        [...document.querySelectorAll('.transliterationOfGeorgian-setting')].forEach((input) => {
            if (input.type === 'checkbox' || input.checked) {
                GM_setValue(
                    input.name.split('-').slice(-1)[0],
                    input.type === 'checkbox' ? input.checked : input.value
                );
            }
        });
        if (document.querySelector('.transliterationOfGeorgian-transliteration')) {
            convert();
        }
    }

    function toggleSettings() {
        if (!wrapper || !wrapper.parentNode) {
            addToDom();
        }
        settings.style.display = settings.style.display === '' ? 'none' : '';
    }

    function addToDom() {
        settings = document.createElement('div');
        settings.className = 'transliterationOfGeorgian-settings';
        settings.innerHTML = `
<div class="transliterationOfGeorgian-settings-group">
  Target script<br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-target-latin"
    value="latin"
    name="transliterationOfGeorgian-setting-target"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-target-latin">Latin (<a href="https://en.wikipedia.org/wiki/Romanization_of_Georgian#Transliteration_table" target="_blank">national system</a>)</label><br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-target-fahnrich"
    value="fahnrich"
    name="transliterationOfGeorgian-setting-target"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-target-fahnrich">Latin (<a href="https://en.wiktionary.org/wiki/Project:Georgian_transliteration" target="_blank">Fähnrich</a>)</label><br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-target-cyrillic"
    value="cyrillic"
    name="transliterationOfGeorgian-setting-target"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-target-cyrillic">Cyrillic (but Ჰ = h and ყ = q')</label><br>
  <div class="transliterationOfGeorgian-setting-helpText">Note that ejective consonants have ' or dot (for example, ტ = t' or ṭ) while aspirated consonants have no ' or dot (for example, თ = t). See <a href="https://www.georgian-alphabet.com/en/lesson10.php" target="_blank">the table of ejective and aspirated consonants</a>.</div>
</div>
<div class="transliterationOfGeorgian-settings-group">
  Transliteration separator<br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-separator-br"
    value="br"
    name="transliterationOfGeorgian-setting-separator"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-separator-br">Line break</label><br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-separator-brackets"
    value="brackets"
    name="transliterationOfGeorgian-setting-separator"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-separator-brackets">Brackets []</label><br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-separator-auto"
    value="auto"
    name="transliterationOfGeorgian-setting-separator"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-separator-auto">Line break for blocks of text, brackets for in-line elements</label><br>
</div>
<div class="transliterationOfGeorgian-settings-group">
  Show the "Toggle transliteration" button<br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-showButton-always"
    value="always"
    name="transliterationOfGeorgian-setting-showButton"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-showButton-always">On all sites with Georgian letters</label><br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-showButton-dotGe"
    value="dotGe"
    name="transliterationOfGeorgian-setting-showButton"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-showButton-dotGe">On .ge sites</label><br>
  <input
    type="radio"
    id="transliterationOfGeorgian-setting-showButton-never"
    value="never"
    name="transliterationOfGeorgian-setting-showButton"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-showButton-never">Nowhere</label><br>
  <div class="transliterationOfGeorgian-setting-helpText">You can always use a command in the Tampermonkey menu.</div>
</div>
<div class="transliterationOfGeorgian-settings-group">
  <input
    type="checkbox"
    id="transliterationOfGeorgian-setting-showButtonInFrames"
    value="showButtonInFrames"
    name="transliterationOfGeorgian-setting-showButtonInFrames"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-showButtonInFrames">Show the "Toggle transliteration" button in frames (pages inside pages)</label><br>
</div>
<div class="transliterationOfGeorgian-settings-group">
  <input
    type="checkbox"
    id="transliterationOfGeorgian-setting-runOnLoad"
    value="runOnLoad"
    name="transliterationOfGeorgian-setting-runOnLoad"
    class="transliterationOfGeorgian-setting"
  > <label for="transliterationOfGeorgian-setting-runOnLoad">Transliterate on page load</label><br>
  <div class="transliterationOfGeorgian-setting-helpText">If the button is hidden, transliteration will not be performed.</div>
</div>
`;

        let button = document.createElement('a');
        button.textContent = 'Toggle transliteration';
        button.className = 'transliterationOfGeorgian-button';
        button.onclick = toggleTransliteration;

        let settingsButton = document.createElement('a');
        settingsButton.textContent = '⚙️';
        settingsButton.className = 'transliterationOfGeorgian-button';
        settingsButton.onclick = toggleSettings;

        let buttonWrapper;
        if (
            (
                GM_getValue('showButton') === 'always'
                || (GM_getValue('showButton') === 'dotGe' && location.hostname.endsWith('.ge'))
            )
            && (
                window.self === window.top
                || (
                    GM_getValue('showButtonInFrames')

                    // Never show in small frames like Facebook's share button
                    && window.innerWidth * window.innerHeight < 10000
                )
            )
        ) {
            buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'transliterationOfGeorgian-buttonWrapper';
            buttonWrapper.append(button, settingsButton);
        }

        wrapper = document.createElement('div');
        wrapper.id = 'transliterationOfGeorgian-wrapper';
        wrapper.append(settings);
        if (buttonWrapper) {
            wrapper.append(buttonWrapper);
        }
        document.body.append(wrapper);

        toggleSettings();

        ['target', 'separator', 'showButton', 'showButtonInFrames', 'runOnLoad'].forEach((setting) => {
            [...document.querySelectorAll(`[name="transliterationOfGeorgian-setting-${setting}"]`)]
                .forEach((input) => {
                    if (
                        (input.type === 'radio' && GM_getValue(setting) === input.value)
                        || (input.type === 'checkbox' && GM_getValue(setting))
                    ) {
                        input.checked = true;
                    }
                });
        });

        [...document.querySelectorAll('.transliterationOfGeorgian-setting')].forEach((input) => {
            input.onclick = saveSettings;
        });

        if (GM_getValue('runOnLoad') && buttonWrapper) {
            convert();
        }

        GM_addStyle(`
#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper {
    all: revert;
    position: fixed;
    z-index: 9999999;
    bottom: 0.5em;
    right: 0.5em;
    font-size: 14px;
    line-height: normal !important;
    font-family: sans-serif !important;
    text-align: left;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper * {
    all: revert;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-settings {
    width: 400px;
    color: #222;
    background-color: #f8f8f8;
    padding: 0.75em 1em;
    border: 1px solid #ccc;
    border-radius: 3px;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-settings-group {
    margin: 0.5em 0;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-settings-group:first-child {
    margin-top: 0;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-settings-group:last-child {
    margin-bottom: 0;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-setting-helpText {
    font-size: 85%;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-buttonWrapper {
    width: max-content;
    margin: 0 0 0 auto;
    border: 1px solid #ccc;
    background-color: #f4f4f4;
    opacity: 0.67;
    border-radius: 3px;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-buttonWrapper:hover {
    opacity: 1;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-settings + .transliterationOfGeorgian-buttonWrapper {
    margin-top: 0.5em;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper a {
    cursor: pointer;
    font-family: sans-serif !important;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-button {
    display: inline-block;
    padding: 0.25em 0.5em;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-button + .transliterationOfGeorgian-button {
    padding-left: 0;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-button {
    color: #666;
}

#transliterationOfGeorgian-wrapper#transliterationOfGeorgian-wrapper .transliterationOfGeorgian-button:hover {
    color: #222;
}
`);
    }

    let blockTags = [
        'BLOCKQUOTE', 'DD', 'DIV', 'DL', 'DT', 'FIGURE', 'FIGCAPTION', 'FORM', 'H1', 'H2', 'H3',
        'H4', 'H5', 'H6', 'HR', 'INPUT', 'LI', 'OL', 'P', 'PRE', 'TABLE', 'TBODY', 'TR', 'TH', 'TD',
        'UL',
    ];
    let inlineTags = [
        'A', 'ABBR', 'B', 'BIG', 'BR', 'CENTER', 'CITE', 'CODE', 'DEL', 'EM', 'FONT', 'I', 'IMG',
        'INS', 'KBD', 'Q', 'S', 'SAMP', 'SMALL', 'SPAN', 'STRIKE', 'STRONG', 'SUB', 'SUP', 'TIME',
        'TT', 'U', 'VAR',

        'OPTION', // 'OPTION' is a block element, but it doesn't support line breaks
    ];

    let conversions = {
        latin: {
            "ა": "a",
            "ბ": "b",
            "გ": "g",
            "დ": "d",
            "ე": "e",
            "ვ": "v",
            "ზ": "z",
            "თ": "t",
            "ი": "i",
            "კ": "k'",
            "ლ": "l",
            "მ": "m",
            "ნ": "n",
            "ო": "o",
            "პ": "p'",
            "ჟ": "zh",
            "რ": "r",
            "ს": "s",
            "ტ": "t'",
            "უ": "u",
            "ფ": "p",
            "ქ": "k",
            "ღ": "gh",
            "ყ": "q'",
            "შ": "sh",
            "ჩ": "ch",
            "ც": "ts",
            "ძ": "dz",
            "წ": "ts'",
            "ჭ": "ch'",
            "ხ": "kh",
            "ჯ": "j",
            "ჰ": "h",
        },
        fahnrich: {
            "ა": "a",
            "ბ": "b",
            "გ": "g",
            "დ": "d",
            "ე": "e",
            "ვ": "v",
            "ზ": "z",
            "თ": "t",
            "ი": "i",
            "კ": "ḳ",
            "ლ": "l",
            "მ": "m",
            "ნ": "n",
            "ო": "o",
            "პ": "ṗ",
            "ჟ": "ž",
            "რ": "r",
            "ს": "s",
            "ტ": "ṭ",
            "უ": "u",
            "ფ": "p",
            "ქ": "k",
            "ღ": "ɣ",
            "ყ": "q̇",
            "შ": "š",
            "ჩ": "č",
            "ც": "с",
            "ძ": "ʒ",
            "წ": "c̣",
            "ჭ": "č̣",
            "ხ": "x",
            "ჯ": "ǯ",
            "ჰ": "h",
        },
        cyrillic: {
            "ა": "а",
            "ბ": "б",
            "გ": "г",
            "დ": "д",
            "ე": "э",
            "ვ": "в",
            "ზ": "з",
            "თ": "т",
            "ი": "и",
            "კ": "к'",
            "ლ": "л",
            "მ": "м",
            "ნ": "н",
            "ო": "o",
            "პ": "п'",
            "ჟ": "ж",
            "რ": "р",
            "ს": "с",
            "ტ": "т'",
            "უ": "у",
            "ფ": "п",
            "ქ": "к",
            "ღ": "гх",
            "ყ": "q'",
            "შ": "ш",
            "ჩ": "ч",
            "ც": "ц",
            "ძ": "дз",
            "წ": "ц'",
            "ჭ": "ч'",
            "ხ": "х",
            "ჯ": "дж",
            "ჰ": "h",
        },
    };

    let georgianRegexp = new RegExp('[' + Object.keys(conversions.latin).join('') + ']');

    let settings;
    let wrapper;

    // Always add menu items, even if there is no Georgian text in sight - it might be loaded
    // asynchronically.
    GM_registerMenuCommand('Toggle transliteration', () => {
        toggleTransliteration();
    }, 'a');
    GM_registerMenuCommand('Toggle settings', () => {
        toggleSettings();
    }, 'a');

    initSettings();

    if (!document.body.innerHTML.match(georgianRegexp)) return;

    addToDom();
})();
