// ==UserScript==
// @name     obfuscateObsceneLexicon
// @name:en    obfuscateObsceneLexicon
// @name:ru    замена обсценных слов
// @namespace operationsWithObsceneLexicon
// @description:en When entering something in textarea of russian-speaking room, this script replace cyrillic letters in roots of obscene words on similar unicode symbol, correctly displayed on browser and not containing control characters of unicode. Made by 060uDy_qpuJIbTp (https://www.kongregate.com/accounts/060uDy_qpuJIbTp) for russian-speaking room ("Room: Московский Кремль") on Kongregate (www.kongregate.com).
// @description:ru Этот скрипт при вводе текста в русскоговорящей комнате заменяет буквы в корнях матерных слов на похожие символы юникода, правильно отображаемые в браузере и не содержащие управляющие символы юникода. Сделано 060uDy_qpuJIbTp (https://www.kongregate.com/accounts/060uDy_qpuJIbTp) для русскоговорящей комнаты ("Room: Московский Кремль") на Kongregate (www.kongregate.com).
// @author      060uDy_qpuJIbTp
// @version  1.0.1
// @grant    none
// @include https://www.kongregate.com/*
// @include http://www.kongregate.com/*
// @run-at      document-end
// @description When entering something in textarea of russian-speaking room, this script replace cyrillic letters in roots of obscene words on similar unicode symbol, correctly displayed on browser and not containing control characters of unicode. Made by 060uDy_qpuJIbTp (https://www.kongregate.com/accounts/060uDy_qpuJIbTp) for russian-speaking room ("Room: Московский Кремль") on Kongregate (www.kongregate.com).
// @downloadURL https://update.greasyfork.org/scripts/370382/obfuscateObsceneLexicon.user.js
// @updateURL https://update.greasyfork.org/scripts/370382/obfuscateObsceneLexicon.meta.js
// ==/UserScript==


/*
made by 060uDy_qpuJIbTp (https://www.kongregate.com/accounts/060uDy_qpuJIbTp) for russian-speaking room ("Room: Московский Кремль") on www.kongregate.com

https://pastebin.com/uZG3823z

*/

window.addEventListener("load", pageFullyLoaded_);

var Random_ = {
    
    getRandomInt: function(min, max) /* min = 0, max = 999999999999999 || 2147483647*/
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

function getGlobalRegExp(find){
    return new RegExp(find, 'g');
}

function replaceAll(str_, find, replace) {
    return str_.replace(getGlobalRegExp(find), replace);
}

/*    [original_letter, [letters_for_replace...]] */

/* all: */

var letters = [
    ["А", ["Ӑ", "Ӓ", "Α"]],
    ["Б", ["Ҕ"]],
    ["В", ["ϐ", "Β"]],
    ["Г", ["Ӷ", "Ѓ", "Ґ", "Ғ", "Ӻ", "Γ"]],
    ["Д", ["Ꚉ", "Ꚁ"]],
    ["Е", ["Ҽ", "Ҿ", "Ε"]],
    ["Ж", ["Җ", "Ӂ"]],
    ["З", ["Ҙ", "Ѯ", "Ӟ", "Ӡ", "Ȝ"]],
    ["И", ["Ͷ"]],
    ["Й", ["Ҋ"]],
    ["К", ["Қ", "Ќ", "Ҝ", "Ҟ", "Ҡ", "Κ"]],
    ["Л", ["Ӆ", "Ԓ", "Λ"]],
    ["М", ["Ӎ", "Ϻ", "Μ"]],
    ["Н", ["Ң", "Ҥ", "Ӈ", "Ӊ", "Ԋ", "Η"]],
    ["О", ["Ӧ", "Ο"]],
    ["П", ["Ԥ", "Π"]],
    ["Р", ["Ҏ", "Ρ", "Ⲣ"]],
    ["С", ["Ҫ", "Ҁ", "Ϲ"]],
    ["Т", ["Ҭ", "Ͳ", "Τ", "Ƭ", "Ț"]],
    ["У", ["Ӯ", "Ӱ", "Ӳ"]],
    ["Ф", ["Φ"]],
    ["Х", ["Ҳ", "Ӽ", "Ӿ", "Χ", "᙭", "Ⲭ"]],
    ["Ц", ["Ꚏ"]],
    ["Ч", ["Ҷ", "Ҹ", "Ӌ", "Ӵ"]],
    ["Ш", ["Ⲽ", "Ɯ"]],
    ["Щ", ["Ꚗ"]],
    ["Ъ", []],
    ["Ы", ["Ӹ"]],
    ["Ь", ["Ꙏ"]],
    ["Э", ["Ӭ"]],
    ["Ю", ["ꀒ", "ꆉ"]],
    ["Я", []],
    ["а", ["ӓ", "ӑ", "α", "ɑ"]],
    ["б", ["ҕ"]],
    ["в", ["β"]],
    ["г", ["ӷ", "ѓ", "ґ", "ғ", "ӻ"]],
    ["д", ["ꚉ", "ꚁ"]],
    ["е", ["ҽ", "ҿ", "ε"]],
    ["ж", ["җ", "ӝ"]],
    ["з", ["ҙ", "ѯ", "ӟ", "ӡ", "ȝ"]],
    ["и", ["ᴎ", "ͷ"]],
    ["й", ["ҋ", "ӣ"]],
    ["к", ["қ", "ќ", "ҡ", "κ"]],
    ["л", ["ӆ", "ԓ"]],
    ["м", ["ӎ", "ϻ"]],
    ["н", ["ң", "ҥ", "ӈ", "ӊ", "ԋ"]],
    ["о", ["ӧ", "ο"]],
    ["п", ["ԥ", "π"]],
    ["р", ["ҏ", "ρ", "ⲣ"]],
    ["с", ["ҫ", "ϲ"]],
    ["т", ["ҭ"]],
    ["у", ["ў", "ӳ"]],
    ["ф", ["ϕ", "ȹ"]],
    ["х", ["ҳ", "ӽ", "ӿ", "χ", "ⲭ"]],
    ["ц", ["ꚏ"]],
    ["ч", ["ҷ", "ҹ", "ӌ", "ӵ"]],
    ["ш", ["ⲽ", "ɯ"]],
    ["щ", ["ꚗ", "ꗌ"]],
    ["ъ", ["ꙏ","ᕹ"]],
    ["ы", ["ӹ"]],
    ["ь", ["Ⱃ"]],
    ["э", ["ӭ"]],
    ["ю", ["ꀒ", "ꆉ"]],
    ["я", ["ᴙ"]]
];


/* minimal: */
/*
var letters = [
    ["А", ["Α"]],
    ["Б", ["Ƃ"]],
    ["В", ["Β"]],
    ["Г", ["Γ"]],
    ["Д", ["Ꚉ", "Ꚁ"]],
    ["Е", ["Ε"]],
    ["Ж", ["Җ", "Ӂ"]],
    ["З", ["Ӡ", "Ȝ"]],
    ["И", ["Ͷ"]],
    ["Й", ["Ҋ"]],
    ["К", ["Κ"]],
    ["Л", ["Λ"]],
    ["М", ["Μ"]],
    ["Н", ["Η"]],
    ["О", ["Ο"]],
    ["П", ["Π"]],
    ["Р", ["Ρ"]],
    ["С", ["Ϲ"]],
    ["Т", ["Τ"]],
    ["У", ["Ӯ", "Ӱ", "Ӳ"]],
    ["Ф", ["Φ"]],
    ["Х", ["Χ"]],
    ["Ц", ["Ꚏ"]],
    ["Ч", ["Ҷ", "Ҹ", "Ӌ", "Ӵ"]],
    ["Ш", ["Ɯ"]],
    ["Щ", ["Ꚗ"]],
    ["Ъ", []],
    ["Ы", ["Ӹ"]],
    ["Ь", ["Ƅ", "Ꙏ"]],
    ["Э", ["Ӭ"]],
    ["Ю", ["ꀒ", "ꆉ"]],
    ["Я", []],
    ["а", ["α", "ɑ"]],
    ["б", ["ҕ", "ƃ"]],
    ["в", ["β"]],
    ["г", ["ӷ", "ґ"]],
    ["д", ["ꚉ", "ꚁ"]],
    ["е", ["ҽ"]],
    ["ж", ["җ", "ӝ"]],
    ["з", ["ӡ", "ȝ"]],
    ["и", ["ᴎ"]],
    ["й", ["ӣ"]],
    ["к", ["κ"]],
    ["л", ["ӆ", "ԓ"]],
    ["м", ["ӎ", "ϻ"]],
    ["н", ["ң", "ҥ", "ӊ", "ԋ"]],
    ["о", ["ο"]],
    ["п", ["π"]],
    ["р", ["ρ"]],
    ["с", ["ϲ"]],
    ["т", ["ҭ"]],
    ["у", ["ў", "ӳ"]],
    ["ф", ["ϕ", "ȹ"]],
    ["х", ["ҳ", "ӽ", "ӿ", "χ"]],
    ["ц", ["ꚏ"]],
    ["ч", ["ҷ", "ҹ", "ӌ", "ӵ"]],
    ["ш", ["ɯ"]],
    ["щ", ["ꚗ"]],
    ["ъ", ["ꙏ","ᕹ"]],
    ["ы", ["ӹ"]],
    ["ь", ["Ⱃ"]],
    ["э", ["ӭ"]],
    ["ю", ["ꀒ", "ꆉ"]],
    ["я", ["ᴙ"]]
];
*/

var obscene_roots = [
    "ху[ийеё]",
    "(на|по)х",
    "хрен",
    "хер",
    "хул[иеь]",
    "п[ие]д[ао]р",
    "п[иеё]зд",
    "бл",
    "[её]б",
    "жоп",
    "муд",
    "сра",
    "с[еёи]р",
    "с[оа]с",
    "член",
    "сса",
    "сик",
    "кук",
    "г[оа]вн",
    "убл",
    "манд",
    "фиг",
    "л[ао][хш]",
    "г[ао]нд",
    "елд",
    "залуп",
    "п[её]р[дн]*",
    "бзд",
    "дрист",
    "дер",
    "идио",
    "ан",
    "ваг",
    "др[юо]ч",
    "я[ий][цч]",
    "трах",
    "сн[ао]ш",
    "г[ао]м",
    "ге[ейи]",
    "дилд",
    "дод",
    "д[ао]лб",
    "су[кч]"
];

function findObscene(str)
{
    var obsceneContains = false;
    for(var i = 0; !obsceneContains && i < obscene_roots.length; i++)
    {
        obsceneContains = str.match(new RegExp(obscene_roots[i]));
    }
    return obsceneContains;
}

function obfuscate(str)
{
    for(var i = 0; i < letters.length; i++)
    {
        var lettersForReplace = letters[i][1];
        var lettersForReplaceAmount = lettersForReplace.length;
        if(lettersForReplaceAmount > 0)
        {
            var replace_ = "";
            if(lettersForReplaceAmount == 1){
                replace_ = lettersForReplace[0];
            }
            else
            {
                var indx_letter = Random_.getRandomInt(0, lettersForReplaceAmount - 1);
                replace_ = lettersForReplace[indx_letter];
            }
            str = replaceAll(str, letters[i][0], replace_);
        }
    }
    return str;
}

function obfuscateObscene(str)
{
    var new_str_ = str;
    var str_for_find = str.toLocaleLowerCase();
    for(var i = 0; i < obscene_roots.length; i++)
    {
        finded_ = str_for_find.match(new RegExp(obscene_roots[i]));
        if(finded_ !== null)
        {
            for(var j = 0; j < finded_.length; j++)
            {
                new_str_ = new_str_.replace(finded_[j], obfuscate(finded_[j]));
            }
        }
    }
    return new_str_;
}



function actionWithSavePosition(chat_input, action)
{
    var selectionStart_ = chat_input.selectionStart;
    var selectionEnd_ = chat_input.selectionEnd;
    
    action();
    
    chat_input.setSelectionRange(selectionStart_, selectionEnd_);
}

function oninputObfuscateHandler()
{
    function obfuscateRussianChat(){ russianChatInput.value = obfuscateObscene(russianChatInput.value); }
    actionWithSavePosition(russianChatInput, obfuscateRussianChat);
}

var chatLoadedChecker;
var russianChatInput;

function chatLoadedCheck()
{
    var chats_inputs = document.querySelectorAll("textarea.chat_input");
    russianChatInput = chats_inputs[2];
    if(russianChatInput != undefined)
    {
        clearInterval(chatLoadedChecker);
        russianChatInput.oninput = oninputObfuscateHandler;
    }
}

function pageFullyLoaded_()
{
    chatLoadedChecker = setInterval(chatLoadedCheck, 1000);
}