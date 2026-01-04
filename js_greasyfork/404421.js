// KG_ComplexityPanel

// ==UserScript==
// @name           KG_ComplexityPanel
// @version        0.2
// @namespace      klavogonki
// @author         NoNe
// @description    Show the complexity of the text in the race
// @include        https://klavogonki.ru/g/*
// @include        http://klavogonki.ru/g/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/404421/KG_ComplexityPanel.user.js
// @updateURL https://update.greasyfork.org/scripts/404421/KG_ComplexityPanel.meta.js
// ==/UserScript==

function embed() {
    var COMPLEXITY_TEXT = [
        "СУПЕР РЕКОРДНЫЙ ТЕКСТ",    // < 1
        "РЕКОРДНЫЙ ТЕКСТ",          // < 2
        "очень лёгкий текст",       // < 3
        "лёгкий текст",             // < 4
        "нормальный текст",         // < 5
        "нормальный текст",         // < 6
        "текст сложней нормального",// < 7
        "сложноватый текст",        // < 8
        "сложный текст",            // < 9
        "очень сложный текст",      // < 10
        "очень сложный текст",      // < 11
        "крайне сложный текст",     // < 12
        "крайне сложный текст",     // < 13
        "мега сложный текст",       // < 14
        "мега сложный текст",       // < 15
        "текст - жесть",            // < 16
        "текст - жесть",            // < 17
        "запредельная сложность"    // < 18
       ];

    // 2 letters combinations for the Russian language, ordered by their frequency. Only the first 791 most common combinations are included.
    // The rest will get the worst coefficient.
    var SYLLABLES = "тостнанопонеконираеналроовголипркаосерреотволаолтатьонваореллоеттеомодзавеилриатдеанлеогесдальитактиемасмеойсяныдообскмо" +
        "инчежесеамазтрмикиависвиедбысоманнимарсьчтслегнурутвбовыдииевсизейивикпеокэтхооеадожчабемушеспаяихияудкрочсидневчиляылкузнсапаты" +
        "дуульншиутнящежитсеесвыйрыопозекмнидаетуусичглужлуятлсвнийыеымезгабребтныхиражмыжадруюьсснлюпиечгднтбугрииахрярнабжнаюссучачьквл" +
        "ньумчноиугапывцеплщизвбиепгиешсмашблсуцишазджддвошбактврукицагайртежпуялупклдлвуурытоязолытккенсубещысянушвшдыувцаютишиггуйсшьох" +
        "хатяехядндчуьшзирьшкющибшлбягеясдьнквзземязыьюзуямзмрврмышиюкндснцухщайнявлнунбнюдркрсьефилкиоецпырдсычкущллржсрдяацзрзгузфоиаюб" +
        "счргязлжеоксвягнижшнджьяащвтоойтвкзлипдкящощхнуефебщхишовдтлыршувпзяоюсдчьыбьмжуфаршмлпяхрмпквяхнгцоофяецыбсынхвсхеяыкищаивьдцоц" +
        "якфрйднчьзрхыпычйчауафзбючмсюсяжзкэлпньтбъяюсюрлцущунюхулгеювмдттдеарюнщзьхлуабкмкгкэнчшдпеиыдэкъеыгтчйкммррячрплчъятттпштеуяржк" +
        "ягжоьцуйэрьбптоупппкоэйшефифрчрбмьсшяяюрхерцлднрызлткцсбдммбчоймбхпьддцвфлфущнжчьгзжнфтмюньчэмьдьицкпсдшйокжуятцйцтюхмсцйлуивввч" +
        "бвдчяцмряйхсэйдхщьюзаоккрзябыжмгсэтбсфюкбмвхюмнзмчэсмэжьчлбьяпьфлпффрэжбюлдбэдвцнвгчуэвгиулбяилмхтюцдздгшвоаюжьврфсжэвкэнжьодюсг" +
        "съмцююдъэпрщлздэыягвюшббэфюглвчргсфтаэкззсггшпуфтщйруошмжсззпчмвтхфыюхгтзъааяшбюбдэгуцйеншбжгмлэыцкшйзхэмфнбвщжрфстэлштъпцбшзтжл" +
        "иэнхйвшрыщьщжжтгкмжгйфтшэхзчтфвънлыивблхсзнэйбйабэлфэшхшьпэзюпкгжмпшбтзцйгчвгэмтйхбзмюйяэбтзфьзюшцюйфюйпкпмъюабцпюхьювкхгбщрхъвэ" +
        "пэчмзшмзбчууфнцзкдлщчжхгфэыумщгюфгкюгшжюшюбгнъщоцлццфммхюикъкбцнпбнмцмйикьнплъюепфъюдфлрьхцсмшкчххюфьркфжтмдвжзэцрхкфчгхсщюэшсцд" +
        "ччхчгпфбеэхдшээямжжэяугзшхвюйщфяжцээйюгфпвхпэожвчэтжцп";

    // Complexity weight for each character. Russian letters and special characters use different formulas, so even if you
    // see the same weights for some Russian letter and some special character, they will contribute different final weights.
    var CHAR_WEIGHTS = {
        "а": 105,   "б": 142,   "в": 119,   "г": 140,   "д": 125,   "е": 105,   "ж": 153,   "з": 142,   "и": 107,   "й": 150,
        "к": 122,   "л": 117,   "м": 122,   "н": 108,   "о": 100,   "п": 126,   "р": 118,   "с": 115,   "т": 110,   "у": 127,
        "ф": 155,   "х": 157,   "ц": 175,   "ч": 145,   "ш": 160,   "щ": 180,   "ъ": 200,   "ы": 140,   "ь": 137,   "э": 183,
        "ю": 167,   "я": 135,   "\n": 0.3,  " ": 0.3,   ".": 2.0,   ",": 2.5,   "!": 4.0,   "?": 3.0,   ":": 4.0,   ";": 4.5,
        "\"": 7.0,  "«": 5.0,   "»": 5.0,   "'": 9.0,   "_": 8.0,   "%": 8.0,   "—": 5.0,   "–": 5.0,   "-": 5.0,   "(": 5.0,
        ")": 5.0,   "*": 7.0,   "=": 7.0,   "+": 7.0,   "№": 5.0,   "#": 9.0,   "$": 9.0,   "&": 9.0,   "/": 9.0,   "\\": 10.0,
        "|": 10.0,  "<": 11.0,  ">": 11.0,  "@": 11.0,  "[": 11.0,  "]": 11.0,  "^": 11.0,  "~": 11.0,  "`": 11.0,  "{": 11.0,
        "}": 11.0,  "0": 5.0,   "1": 5.0,   "2": 5.0,   "3": 5.0,   "4": 5.0,   "5": 5.0,   "6": 5.0,   "7": 5.0,   "8": 5.0,
        "9": 5.0
    };

    // Spectrum canvas settings
    var CANVAS_HEIGHT = 12;
    var CANVAS_OPACITY  = 0.65;

    // This is the upper threshold for the spectrum complexity. Everything up will be pure red.
    var MAX_SPECTRUM_COMPLEXITY = 310;

    // This is the bottom threshold for the spectrum complexity. Everything down will be pure green.
    var MIN_SPECTRUM_COMPLEXITY = 120;

    var SPECTRUM_COMPLEXITY_RANGE = MAX_SPECTRUM_COMPLEXITY - MIN_SPECTRUM_COMPLEXITY;

    // If character is not found, then it will be treated as a special character with the given weight
    var UNKNOWN_CHAR_WEIGHT = 15.0;

    // All Russian letters, with the exception of the first one, in the word will get such default weight
    var DEFAULT_LETTER_WEIGHT = 100;

    // Characters for Russian language.
    var ALPHABETICAL_CHARACTERS = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

    // If letter is a capital, we add such a number to its weight
    var CAPITAL_WEIGHT = 200.0;

    // If the some word has number of capitals more than this value, then we stop apply CAPITAL_COEF, because user will likely use Caps key
    var CAPS_LENGTH = 4;

    // If character is not part of Russian letters, we multiply weight by this number
    var SPECIAL_CHARACTER_COEF = 200.0;

    // Whole word's weight will get coefficient multiplied depending on its size. Longer words are harder to type.
    // If a word has only a single letter, then it will take longer to type it, because it doesn't have keys combination
    // with other letters.
    var WORD_LENGTH_COEF = [2.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];

    // Dictionary with 2 letters combinations and their frequency orders. We use associative array for search, because it is much faster (if it is hot),
    // than other approaches: String#indexOf, RegExp, Array#indexOf.
    var dictionary = {};

    // A flag for preventing clone panel creation:
    var initialized = false;

    // Saving the original prototype method:
    var proxied = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            try {
                var json = JSON.parse(this.responseText);
                if ('text' in json) {
                    createPanel(json.text.text);
                }
            } catch (e) {}
        }.bind(this));
        return proxied.apply(this, [].slice.call(arguments));
    };

    function createPanel (text) {
        if (initialized) {
            return false;
        }

        initialized = true;
        prepareDictionary();

        var complexityObject = getComplexity(text);
        var complexity = complexityObject.complexity.toFixed(2);

        var params = document.getElementById("params");
        if (params) {
            // We use wrapper only as a workaround to support KTS custom styles.
            // KTS changes panel style by ID. We use "statistics" ID, which is also used by another panel.
            // HTML 5 allows duplicate IDs. They just need to be in different subtrees. I don't like
            // such approach, but I fear it's the only way for now, unless we ask KTS developer to
            // include some lines into img/apply.js file.
            var wrapper = document.createElement("div");
            wrapper.id = "complexity-panel";

            var elem = document.createElement("div");
            elem.style.setProperty("background", "none repeat scroll 0 0 #F8F4E6", null);
            elem.style.setProperty("margin-top", "10px", null);
            elem.style.setProperty("margin-bottom", "10px", null);
            elem.id = "statistics";

            wrapper.appendChild(elem);
            params.parentNode.insertBefore(wrapper, params.nextSibling);

            elem.innerHTML = '<div class="r tl" title="v1.4"><div class="tr"><div class="bl"><div class="br"><div class="rc">' +
                '<h4>Прогноз сложности</h4>' +

                '<div><span style="font-size:17px;font-weight:bold;color:#333">' + (complexity >= 0 ? complexity.slice(0, -3) : '') + '</span>' +
                '<span style="font-size:14px;font-weight:bold;color:#666">' + (complexity >= 0 ? '.' + complexity.slice(-2) : 'N/A')+ '</span>' +
                '&nbsp;−&nbsp;' + (complexity >= 0 ? getComplexityText(complexity) : 'неприменимо к данному заезду') +

                '</div><div style="margin:10px 0 4px;background-color:white"id="spectrumCanvas"/>' +
                '</div></div></div></div></div>';

            // Add spectrum canvas to the panel
            if (complexity >= 0) {
                var spectrum = complexityObject.spectrum;
                smoothArray(spectrum, 10);

                var canvasDiv = document.getElementById("spectrumCanvas");

                var canvasElem = getSpectrumCanvas(spectrum, canvasDiv.clientWidth, CANVAS_HEIGHT);
                if (canvasElem != null) {
                    canvasDiv.appendChild(canvasElem);
                }
            }
        }
    }

    function prepareDictionary() {
        for (var i = 0; i < SYLLABLES.length; i += 2) {
            dictionary[SYLLABLES.substr(i, 2)] = i / 2;
        }
    }

    function getWordLengthCoef(length) {
        return WORD_LENGTH_COEF[(length < WORD_LENGTH_COEF.length) ? length - 1 : WORD_LENGTH_COEF.length - 1];
    }

    function getComplexityText(complexity) {
        var position = Math.floor(complexity);
        return COMPLEXITY_TEXT[(position < COMPLEXITY_TEXT.length) ? position : COMPLEXITY_TEXT.length - 1];
    }

    // Return string complexity and its spectrum. Return -1 for the complexity, if it can't be applied to the string.
    function getComplexity(str) {
        var complexity = 0.0;
        var wordLength = 0;
        var wordComplexity = 0;
        var capsLength = 0;
        var prevChar = "";
        var unknownCharNum = 0;
        var spectrum = [];
        var pos = 0;
        var wordComplexityPerCharacter, j;

        // Replace all "ё" occurrences to "е".
        str = str.split("ё").join("е");

        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            var charLowerCase = char.toLowerCase();
            var weight;

            if (ALPHABETICAL_CHARACTERS.indexOf(charLowerCase) != -1) {
                // Alphabetical character
                wordLength++;

                if (wordLength === 1) {
                    // First letter in a word will get weight depending on its frequency
                    weight = CHAR_WEIGHTS[charLowerCase];
                } else {
                    // All the following letters in the word will get default weight. Their final weight will depend on the letters combination frequency.
                    weight = DEFAULT_LETTER_WEIGHT;
                }

                // All letters in the word, starting from the second, will apply coefficient depending on the 2 letters frequency
                if (wordLength > 1) {
                    var n = dictionary[prevChar + charLowerCase];
                    if (n == null) {
                        n = -3.75; // This is minimum value, which can be achieved by the following formula
                    }

                    // Such formula returns 2 letters frequency in the decimal logarithmic scale, e.g. "0" - most common, "-1",
                    // if frequency is 10 times less. Formula is a polynomial interpolation based on the experimental selection.
                    var syllableDifficulty = -7e-9 * Math.pow(n, 3) + 7e-6 * Math.pow(n, 2) - 0.0059 * n;

                    // Increase weight based on the difficulty
                    weight *= Math.pow(1 - syllableDifficulty, 1.3);
                }

                // Capitals are harder to type
                var isLowerCase = char === charLowerCase;
                if (!isLowerCase) {
                    capsLength++;

                    if (capsLength < CAPS_LENGTH) {
                        weight += CAPITAL_WEIGHT;
                    }
                } else {
                    capsLength = 0;
                }

                wordComplexity += weight;
                prevChar = charLowerCase;

            } else {
                // Special character (not part of Russian letters)

                // If we reached the end of the word, we need to calculate final word's weight depending on its length
                if (wordLength > 0) {
                    wordComplexity *= getWordLengthCoef(wordLength);
                    complexity += wordComplexity;
                    wordComplexityPerCharacter = wordComplexity / wordLength;

                    for(j = 0; j < wordLength; j++) {
                        spectrum[pos++] = wordComplexityPerCharacter;
                    }
                }

                wordComplexity = 0;
                capsLength = 0;
                wordLength = 0;

                weight = CHAR_WEIGHTS[charLowerCase];
                if (weight == null) {
                    weight = UNKNOWN_CHAR_WEIGHT;
                    unknownCharNum++;
                }

                weight *= SPECIAL_CHARACTER_COEF;
                complexity += weight;

                spectrum[pos++] = weight;
            }
        }

        // If text doesn't finish with the special character, we need to add last word's weight
        if (wordLength > 0) {
            wordComplexity *= getWordLengthCoef(wordLength);
            complexity += wordComplexity;

            wordComplexityPerCharacter = wordComplexity / wordLength;

            for(j = 0; j < wordLength; j++) {
                spectrum[pos++] = wordComplexityPerCharacter;
            }
        }

        // Complexity is per character
        if (str.length > 0) {
            complexity /= str.length;
        } else {
            return {complexity: 0, spectrum: spectrum};
        }

        // if number of unknown characters is more than 10%, then complexity value is inconsistent
        if (unknownCharNum / str.length > 0.1) {
            return {complexity: -1, spectrum: spectrum};
        }

        // Divide by theoretical complexity minimum in order to start our reference frame for complexity from 1
        complexity /= 160;
        if (complexity < 1) {
            complexity = 1;
        }

        complexity -= 1;
        complexity *= 20; // Scale complexity to readable values, so ~10 is close to usual hard complexity

        return {
            complexity: complexity,
            spectrum: spectrum
        };
    }

    // Function smooths (blurs) 1D array using flat convolution buffer. Algorithm complexity is O(N + power).
    function smoothArray(array, power) {
        var smoothedValue = 0;
        var fractions = [];
        var coef = 2 * power + 1;

        for (var i = 0; i < array.length + power; i++) {
            if (i >= coef) {
                smoothedValue -= fractions[i % coef];
            }

            if (i < array.length) {
                var value = array[i];
                smoothedValue += value;
                fractions[i % coef] = value;
            }

            if (i >= power) {
                var factor;

                if (i < array.length) {
                    factor = Math.min(i + 1, coef);
                } else {
                    factor = coef + array.length - i - 1;
                }

                array[i - power] = smoothedValue / factor;
            }
        }
    }

    // Function returns canvas with the given width and height. We paint spectrum on the canvas using values in the array.
    // Lowest values will be green. Middle will be yellow. Highest will be red.
    function getSpectrumCanvas(array, width, height) {
        var canvas = document.createElement('canvas');
        if (!canvas || !canvas.getContext) {
            // We are very sorry for our dinosaurs. God bless them.
            return null;
        }

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }

        var ctx = canvas.getContext("2d");
        // Too opaque spectrum burns eyes
        ctx.globalAlpha = CANVAS_OPACITY;
        // We need to scale to the given canvas width
        ctx.scale(width / array.length, 1);

        var r, g;
        for (var i = 0; i < array.length; i++) {
            // Apply the thresholds
            var value = Math.min(Math.max(array[i], MIN_SPECTRUM_COMPLEXITY), MAX_SPECTRUM_COMPLEXITY);

            // Scale complexity to 0 - 255 range
            var complexity = Math.floor(255 * (value - MIN_SPECTRUM_COMPLEXITY) / SPECTRUM_COMPLEXITY_RANGE);

            // Calculate red and green components. Blue will be always 0.
            r = Math.min(complexity * 2, 255);
            g = Math.min(2 * (255 - complexity), 255);

            // Paint vertical line
            ctx.strokeStyle="rgb(" + r + "," + g + ",0)";
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        return canvas;
    }
}

var inject = document.createElement("script");
inject.setAttribute("type", "text/javascript");
inject.appendChild(document.createTextNode("(" + embed + ")()"));
document.body.appendChild(inject);