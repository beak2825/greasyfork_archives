// ==UserScript==
// @name         NaziGramatical
// @namespace    http://nazigramatical.x10.bz/
// @version      0.6
// @description  Correcção ortográfica e gramatical automática em português europeu.
// @author       NaziGramatical
// @match        https://www.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @connect      nazigramatical.x10.bz
// @resource     pt.dic http://nazigramatical.x10.bz/pt.dic
// @downloadURL https://update.greasyfork.org/scripts/25136/NaziGramatical.user.js
// @updateURL https://update.greasyfork.org/scripts/25136/NaziGramatical.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var parsedRules = [];
    var lastReplace = {count: 0};
    var dicWordsCache = {};
    var dic = false;
    var lastCheck = 0;
    var undos = 0;
    var disabled = false;

    var log = function () { /*console.log.apply(this, arguments);*/ };

    var loadRules = function () {
        var savedRules = GM_getValue('rules', []);
        for (var i = 0; i < savedRules.length; i++) {
            var regs = savedRules[i][0].match(/\/(.+)\/([^/]+)/);
            parsedRules.push([new RegExp(regs[1], regs[2]), savedRules[i][1]]);
        }
    };

    var dicWordExistsCS = function (word) {
        var time = Date.now();
        var result;
        if (dicWordsCache[word] !== undefined) result = dicWordsCache[word];
        else {
            result = (dic.indexOf("\n" + word + "\n") != -1);
        }
        log('Dic search: ' + word + ' Time: ' + (Date.now() - time) + ' ms. Result: ' + result);
        return result;
    };
    var dicWordExists = function (word) {
        if (dicWordExistsCS(word)) return true;
        var wordLC = word.toLowerCase();
        return word != wordLC && dicWordExistsCS(wordLC);
    };

    var dicCheckSentence = function (str) {
        var words = str.match(/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]{3,}/g);
        if (words) {
            for (var i = 0; i < words.length; i++) {
                if (!dicWordExists(words[i])) return false;
            }
        }
        return true;
    };

    var saveRules = function () {
        var savedRules = [];
        for (var i = 0; i < parsedRules.length; i++) {
            if (typeof parsedRules[i][1] != 'string') continue;
            savedRules.push([parsedRules[i][0].toString(), parsedRules[i][1]]);
        }
        GM_setValue('rules', savedRules);
    };

    var replaceMultiple = function (str, a, b) {
        for (var i = 0; i < a.length; i++) str = str.replace(a[i], b[i]);
        return str;
    };

    var regexGroups = function (regex) {
        return regex.replace(/\\pL/g, '[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]')
            .replace(/\\pBL/g, '(?<=^|[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ])')
            .replace(/\\pBR/g, '(?=$|[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ])')
            .replace(/\\pV/g, '[aeiouáâãéêíóôõúÁÂÃÉÊÍÓÔÕÚ]')
            .replace(/\\pVE/g, '(?:e|é|ê)')
            .replace(/\\pC/g, '[b-df-hj-np-tv-zçÇ]')
            .replace(/\\pNUM/g, '(?:[0-9]+(?:[,.][0-9]+)?|uma?|dois|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quinze|dezasseis|dezassete|dezoito|dezanove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem|duzentos|trezentos|quatrocentos|quinhentos|seiscentos|setecentos|oitocentos|novezentos|mil)');
    };

    var parseRules = function (rules) {
        var parsedRules = [];
        for (var i = 0; i < rules.length; i++) {
            var rule = regexGroups(rules[i][0].toString());
            var replace = (typeof rules[i][1] == 'string') ?
                '$1' + rules[i][1].replace(/\$(\d+)/g, function (match, p1) { return '$' + (Number(p1) + 1); }) :
            (function (cb) {
                return (function () {
                    var args = [];
                    for (var i = 0; i < arguments.length; i++) args.push(arguments[i] ? arguments[i] : '');
                    var r = cb([args[1] ? args[0].substr(1) : args[0]].concat(args.slice(2, -2)));
                    return r ? args[1] + r : '';
                });
            })(rules[i][1]);
            var flags = '';
            var regs = rule.match(/^\/(.+)\/(.*?)$/);
            if (regs) {
                rule = regs[1];
                flags = regs[2];
            }
            var regs = rule.match(/^\(\?<([!=])(.+?)\)(.+)/);
            if (regs) {
                //log('Lookbehind rule:', rule);
                if (regs[1] == '=') rule = '(^|[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]|'+regs[2]+')' + regs[3] + '(?=[^]$)';
                if (regs[1] == '!') {
                    if (/[^a-zA-Z0-9 ]/.test(regs[2])) {
                        log('Ignored imparsable rule with lookbehind:', rule);
                        continue;
                    }
                    rule = '(?!'+ regs[2] +')(.{'+regs[2].length+'}|^.{0,'+(regs[2].length-1)+'})' + regs[3] + '(?=[^]$)';
                }
                //log('Lookbehind rule parsed:', rule);
            }
            else if (/\(\?</.test(rule)) {
                //log('Ignored rule with lookbehind:', rule);
                continue;
            }
            else rule = '(^|[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ])' + rule + '(?=[^]$)';
            if (!flags) flags = 'i';
            parsedRules.push([new RegExp(rule, flags), replace]);
        }
        //log("ParsedRules: ", parsedRules);
        return parsedRules;
    };

    var isEnglish = function (text) {
        var regs = text.match(/(?:^| )(the|is|was|are|be|were|been|did|to|of|and|in|that|have|had|i|it|not|on|with|he|you|at|this|but|his|by|from|they|we|say|her|she|or|an|will|my|one|all|would|there|their|what|up|out|if|about|who|get|which|go|when|make|can|like|time|just|him|know|take|people|into|year|your|good|some|could|them|see|other|than|then|now|look|only|its|over|think|also|back|after|two|how|our|work|first|well|way|even|new|want|because|any|these|give|day|most|thanks?)(?=$|[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ])/ig);
        var count = regs ? regs.length : 0;
        if (count) {
            var words = text.match(/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ\'-]+/g);
            log("English words: "+count+" Total words: "+words.length+" Ratio: "+(count/words.length));
            return count / words.length > 0.1;
        }
        log("No English words found.");
        return false;
    };

    var isPortuguese = function (text) {
        var words = text.match(/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]{2,}/g);
        var errors = 0;
        if (words) {
            words = words.slice(-10);
            for (var i = 0; i < words.length; i++) {
                if (!dicWordExists(words[i])) errors++;
            }
            log("Portuguese words: "+(words.length - errors)+" Total words: "+words.length+" Non Portuguese Ratio: "+(errors / words.length));
            return errors / words.length <= 0.25;
        }

        return false;
    };

    var checkLanguage = function (text) {
        text = text.replace(/https?:\/\/[^ )]+/g, '');
        text = text.replace(/[ru]\/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ0-9_-]+/g, '');
        text = text.replace(/«.+?»/g, '');
        text = text.replace(/".+?"/g, '');
        text = text.replace(/\*\*(.+?)\*\*/g, '$1'); // remove bold
        text = text.replace(/\*.+?\*/g, '');
        text = text.replace(/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ-]+[^]$/, ''); // remove last word (including compound words)
        // get last 10 words longer than 2 chars
        var match = text.match(/([a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]+[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]+([a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]{1,1}[^a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]+)?){0,10}$/);
        if (!match) log('Error: no match on checkLanguage:', text);
        else text = match[0];
        log('checkLanguage', text);
        return isPortuguese(text);
        //return !isEnglish(text) && isPortuguese(text);
    };

    var scanLine = function (line) {
        log(`scanline: "${line}"`);
        var result = '';
        for (var i = 0; i < parsedRules.length; i++) {
            result = checkWord(line, parsedRules[i][0], parsedRules[i][1]);
            if (result) break;
        }
        log(`result: "${result}"`);
        //hyphenated word
        var match = (result || line).match(/^(.+-)([a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ]+[^])$/);
        if (match) {
            var result2 = scanLine(match[1]);
            if (result2) result = result2 + match[2];
        }
        return result;
    };

    var fixCase = function (str1, str2) {
        //log(`fixCase: "${str1}" "${str2}"`);
        var isUpperCase = function (s) { return (s == s.toUpperCase()); };
        var isLowerCase = function (s) { return (s == s.toLowerCase()); };
        var toTitleCase = function (s) { return s.charAt(0).toUpperCase() + s.substr(1); };
        var isTitleCase = function (s) { return (s == toTitleCase(s)); };

        if (isLowerCase(str1)) return str2;
        if (isUpperCase(str1)) return str2.toUpperCase();
        if (isTitleCase(str1)) return toTitleCase(str2);
        return str2;
    };

    var checkWord = function (line, regex, replace) {
        //log("Line: '"+line+"' Regex: "+regex+" Replace: "+replace);
        if (regex.test(line)) {
            var match = line.match(regex);
            var index = match.index ? match.index + 1 : 0;
            var replaced = line.replace(regex, replace).slice(index, -1);
            //log(`replaced: '${replaced}'`);
            if (replaced) {
                log("Line: '"+line+"'");
                log("Regex: "+regex+" Replace: "+replace+" Match:", match);
                replaced = fixCase(line.slice(index, -1), replaced);
                //log(`replaced: '${replaced}'`);
                //log('check correction:', dicCheckSentence(replaced));
                return line.slice(0, index) + replaced + line.slice(-1);
            }
        }
    };

    var removeDiacritics = function (str) {
        (function(a, b) { for (var i = 0; i < a.length; i++) str = str.replace(new RegExp(a[i], 'g'), b[i]); })(
            ['á', 'â', 'é', 'ê', 'í', 'ó', 'ô', 'ú', 'Á', 'Â', 'É', 'Ê', 'Í', 'Ó', 'Ô', 'Ú'],
            ['a', 'a', 'e', 'e', 'i', 'o', 'o', 'u', 'A', 'A', 'E', 'E', 'I', 'O', 'O', 'U']);
        return str;
    };

    var tryCorrection = function (w1, w2) {
        log(`tryCorrection "${w1}" "${w2}"`);
        if (!dicWordExists(w1) && dicWordExists(w2)) return w2;
    };

    document.addEventListener('input', function (e) {
        if (disabled) return;
        if (!dic) {
            dic = {};
            setTimeout(function () {
                var time = Date.now();
                dic = "\n"+GM_getResourceText('pt.dic')+"\n";
                log('Loaded dic in ' + (Date.now() - time) + ' ms.');
            }, 100);
            return;
        }
        lastReplace.count++;
        var input = e.target;
        var text = input.value;
        if (!text) return; // no text
        var sep = text.substr(input.selectionEnd - 1, 1);
        if (/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ-]/.test(sep)) return;
        var left = text.substr(0, input.selectionEnd);
        var leftLines = left.match(/.+(\n+|$)/g);
        var line = leftLines.pop();
        var right = text.substring(input.selectionEnd, text.length);
        if (/^ *>/.test(line)) return; // quotes
        if (/https?:\/\/[^ )]+[^]$/.test(line)) return; // urls
        if (/[ru]\/[a-zA-ZáâãéêíóôõúçÁÂÃÉÊÍÓÔÕÚÇ0-9_-]+[^]$/.test(line)) return; // users/subs
        if (/«[^»]+[^]$/.test(line)) return; // quoted
        if (/^[^"]*"[^"]*([^"]*"[^"]*"[^"]*)*[^]$/.test(line)) return; // quoted
        if (/^[^*]*\*[^*]*([^*]*\*[^*]*\*[^*]*)*[^]$/.test(line.replace(/\*\*.+?\*\*/g, ''))) return; // italic
        if (!checkLanguage(left)) return;
        lastCheck = Date.now(); // prevent cleanup
        log(`Checking: "${line}"`);
        var result = scanLine(line);
        if (!result) return;
        lastReplace = {input: input, value: input.value, selectionEnd: input.selectionEnd, count: 0};
        log('Replacing "'+line+'" with "'+result+'"');
        line = result;
        leftLines.push(line);
        left = leftLines.join('');
        input.value = left + right;
        input.selectionEnd = left.length;
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.keyCode == 90) {
            if  (!(lastReplace.count--)) {
                log("NaziGramatical: Undo.");
                lastReplace.input.value = lastReplace.value;
                lastReplace.input.selectionEnd = lastReplace.selectionEnd;
                if (++undos == 2 && confirm('The spellchecker will be disabled in this page.')) disabled = true;
                e.preventDefault();
            }
            lastReplace.count--;
        }
    });

    // update rules
    if (Date.now() - GM_getValue('rulesTime', 0) > GM_getValue('updateInterval', 0) * 1000) {
        log("NaziGramatical: Updating rules.");
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://nazigramatical.x10.bz/rules.php',
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                parsedRules = parsedRules.concat(parseRules(data.rules));
                GM_setValue('updateInterval', Math.min(604800, data.updateInterval));
                GM_setValue('dic.index', data.dic);
                saveRules();
                log("NaziGramatical: Rules updated. Next update: "+data.updateInterval+" secs.");
            }
        });
        GM_setValue('rulesTime', Date.now());
    }
    // load stored rules
    else loadRules();

    // static rules
    (function () {
        var rules = [
            [/(\pL*[áâéêíóôú]\pL*)(mente|zinh[ao]s?)/, function (r) { return removeDiacritics(r[1]) + r[2]; }], //sózinho, sómente
            [/(in)?d([ei])s(\pL{3,})/, function (r) { return tryCorrection(r[0], r[1] + (r[2] == 'e' ? 'dis' : 'des') + r[3]); }], //destraído, distoar
            [/(\pL+i)ss(es?)/, function (r) { return tryCorrection(r[0], r[1]+'c'+r[2]); }], //chatisse
            [/(\pL*[aeiou])([íú])([zlr])/, function (r) { return tryCorrection(r[0], r[1]+removeDiacritics(r[2])+r[3]); }], //saír
            [/(\pL*)([áâéêíóôú])([zlr])/, function (r) { return tryCorrection(r[0], r[1]+removeDiacritics(r[2])+r[3]); }], //metêr, cristál
            [/(\pL*[^aeiou])([áéíóúâêô])(\pC+[aeo](?:s|m|ns)?)/, function (r) { return tryCorrection(r[0], r[1]+removeDiacritics(r[2])+r[3]); }], //fála, páras
            [/(\pL*[^aeiou])([íú])(s|m|ns)?/, function (r) { return tryCorrection(r[0], r[1]+removeDiacritics(r[2])+r[3]); }], //perú, patíns
            //[/([aeiou])([iu]?\pC+[aeiou][oea]s?)/, function (r) { return tryCorrection(r[0], r[1]+removeDiacritics(r[2])+r[3]); }],
            [/(\pL+)a([eo]s?)/, function (r) { return tryCorrection(r[0], r[1]+'ã'+r[2]); }], //mao, mae, maos, maes
            [/(\pL+)o(es?)/, function (r) { return tryCorrection(r[0], r[1]+'õ'+r[2]); }], //poe, poes
            [/(\pL+)c[aã]([eo]s?)/, function (r) { return tryCorrection(r[0], r[1]+'çã'+r[2]); }], //bêncao, bêncão, bêncaos, bêncãos, opcoes, opcões
            [/(\pL+)c[oõ](es?)/, function (r) { return tryCorrection(r[0], r[1]+'çõ'+r[2]); }], //licoes, licões,
            [/(\pL*\pV)[cp]([tcç]\pV\pL*)/, function (r) { return tryCorrection(r[0], (r[1] + r[2]).replace(/m(?=[cçt])/i, 'n')); }], // inflacção
            // enclise
            [/(((\pL+)([aeiouô]))([srz]))-([oa]s?)(?!-)/, function (r) {
                if (dicWordExists(r[1])) {
                    var replace = '';
                    if (r[1] == 'quer') replace = 'quere-' + r[6];
                    else if (r[5] == 's') {
                        replace = r[2] + '-l' + r[6];
                    }
                    else {
                        replace = r[3] + r[4].replace('a', 'á').replace('e', 'ê').replace('o', 'ô') + '-l' + r[6];
                    }
                    return replace;
                }
            }],
            // hyphen
            [/(\pL{2,}?)(s?)-(\pL+)/, function (r) {
                if (!dicWordExists(r[1] + r[2]) || !dicWordExists(r[3])) {
                    var left = r[1].slice(0, -1) + removeDiacritics(r[1].slice(-1)) + r[2];
                    var word = left + (/[aeiou]$/i.test(left) && /^[sr][aeiouáâãéêíóôõú]/i.test(r[3]) ? r[3].replace(/^([sr])/, '$1$1') : r[3]);
                    if (dicWordExists(word)) return word;
                }
                else if (
                    (/^(contra|extra|auto|neo|proto|pseudo)$/i.test(r[1]+r[2]) && !/^[aeiouáâãéêíóôõúhrs]/i.test(r[3])) ||
                    (/^(anti|arqui|semi)$/i.test(r[1]+r[2]) && !/^[iíhrs]/i.test(r[3])) ||
                    (/^(ante|entre|sobre)$/i.test(r[1]+r[2]) && !/^h/i.test(r[3])) ||
                    (/^(hiper|inter|super)$/i.test(r[1]+r[2]) && !/^[hr]/i.test(r[3])) ||
                    (/^(com|mal)$/i.test(r[1]+r[2]) && !/^[aeiouáâãéêíóôõúh]/i.test(r[3]))
                ) {
                    var word = r[1]+r[2]+r[3];
                    if (dicWordExists(word)) return word;
                }
            }],
            // brute force
            [/(\pL+)/, function (r) {
                if (!dicWordExists(r[0])) {
                    var time = Date.now();
                    var rule = replaceMultiple(r[0], [/a/gi, /e/gi, /i/gi, /o/gi, /u/gi, /c/gi], ['[aáâã]', '[eéê]', '[ií]', '[oóôõ]', '[uú]', '[cç]']);
                    var regex = new RegExp('\\n' + rule + '\\n', 'gi');
                    var match = dic.match(regex);
                    log('Possible matches:', match, 'Time took:', Date.now() - time);
                    if (match && match.length == 1) return match[0].replace(/\n/g, '');
                }
            }]
        ];
        parsedRules = parsedRules.concat(parseRules(rules));
    })();

    // clean dictionary when it's not needed anymore
    setInterval(function () {
        if (Date.now() - lastCheck > 25000) {
            dic = false;
        }
    }, 10000);
})();