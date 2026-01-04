// ==UserScript==
// @name         MTG Scryfall edit search
// @namespace    http://scryfall.com/
// @version      1.0
// @description  This Tampermonkey script adds an "Edit" link near the search field when you're looking the card list. Click it to automatically collect the data in the search field, open the Advanced Search and precompile its fields using the collected data.
// @author       www.mephit.it@gmail.com
// @match        https://scryfall.com/*
// @match        https://www.scryfall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392587/MTG%20Scryfall%20edit%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/392587/MTG%20Scryfall%20edit%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.pathname !== '/advanced') {

        const $searchForm = $('form.header-search');
        if (!$searchForm.length) return;

        const $editAnchor = $('<a href="#">Edit</a>').css({color: 'rgba(255,255,255,0.8)', marginLeft: '1em', marginRight: '1em'});
        $searchForm.after($editAnchor);

        $editAnchor.on('click', function(event){
            location.href = '/advanced' + location.search;

        });

        return;
    }

    const params = new URLSearchParams(location.search);
    const o = {};
    for (let [key, value] of params.entries()) o[key] = value;

    function match(str, regex) {

        const result = [];
        let m;

        while ((m = regex.exec(str)) !== null) {
            const res = [];
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) regex.lastIndex++;

            // The result ca be accessed through the `m`-variable.
            m.forEach(match => { res.push(match); });

            result.push(res);
        }

        return result.length ? result : null;

    }

    if (o.q) {

        const nameArray          = [];    const $nameField          = $('#name');
        const textArray          = [];    const $textField          = $('#oracle');
        const typeArray          = [];    const $typeField            = $('#type');
        let   typePartial        = false; const $typePartialField     = $('#type_partial');
        let   colorsPartial      = false; const $colorsPartialField   = $('#colors_partial');
//        let   colorsStrict       = false; const $colorsStrictField    = $('#colors_strict');
//        let   colorsMulti        = false; const $colorsMultiField     = $('#colors_multicolored');
        let   colorsCompare      = '';    const $colorsCompareField   = $('#color_comparison');
        let   setArray           = [];    const $setField             = $('#set');
        let   setNotArray        = [];
        let   blockArray         = [];    const $blockField           = $('#block');
        let   blockNotArray      = [];
        const colors             = {};
        const commander          = {};
        let   statsLen           = 0;
        const formatStatusArray  = [];
        const formatArray        = [];
        const criteriaArray      = [];    const $criteriaField        = $('#is');
        let   criteriaPartial    = false; const $criteriaPartialField = $('#is_partial');
        let   pricesLen          = 0;
        const artistArray        = [];    const $artistField          = $('#artist');
        const flavorArray        = [];    const $flavorField          = $('#flavor');
        const loreArray          = [];    const $loreField            = $('#lore');
        const langArray          = [];    const $langField            = $('#language');

        const groups = [[]];

        o.q.split(/[\s+]/).forEach(function(word){
            if (word.indexOf('(') === 0) {
                groups.push([]);
                groups[groups.length - 1].push(word.slice(1));
            } else if (word.indexOf(')') === word.length - 1) {
                groups[groups.length - 1].push(word.slice(0,-1));
            } else {
                groups[groups.length - 1].push(word);
            }
        });

        groups.forEach(function(group){
            group.forEach(function(word){
                if (word === 'OR') {
                    if (group[0].indexOf('type:') === 0) { typePartial = true; return; }
                    if (group[0].indexOf('color=') === 0) { colorsPartial = true; return; }
                    if (group[0].indexOf('color>=') === 0) { colorsPartial = true; return; }
                    if (group[0].indexOf('color<=') === 0) { colorsPartial = true; return; }
                    if (group[0].indexOf('rarity:') === 0) { return; }
                    if (group[0].indexOf('set:') === 0) { return; }
                    if (group[0].indexOf('block:') === 0) { return; }
                    if (group[0].indexOf('is:') === 0) { criteriaPartial = true; return; }
                }
                if (word === 'AND') {
                    if (group[0].indexOf('-color=') === 0) { return; }
                    if (group[0].indexOf('-color>=') === 0) { return; }
                    if (group[0].indexOf('-color<=') === 0) { return; }
                }

                const statsTerms = ['cmc','pow','tou','loy'];
                const pricesTerms = ['usd','eur','tix'];
                const regex = /^(cmc|pow|tou|loy|usd|eur|tix)([\!=<>]{1,2})(\d+)$/;
                let str = '', strLen = 0, matches = null;
                console.log('word',word);
                switch(true){
                    case (word.indexOf('oracle:') === 0):
                        textArray.push(word.slice('oracle:'.length));
                        break;
                    case (word.indexOf('-oracle:') === 0):
                        textArray.push('-' + word.slice('-oracle:'.length));
                        break;
                    case (word.indexOf('type:') === 0):
                        typeArray.push(word.slice('type:'.length));
                        break;
                    case (word.indexOf('-type:') === 0):
                        typeArray.push('-' + word.slice('-type:'.length));
                        break;
//                    case (word.indexOf('-type:') === 0):
//                        typeArray.push('-' + word.slice('-type:'.length));
//                        break;
                    case ((/^(-?)color(=|>=|<=)(.*)/g).test(word)):
                        matches = match(word, /^(-?)color(=|>=|<=)(.*)/g);
                        str = matches[0][3];
                        strLen = str.length;
                        for ( let i = 0; i < strLen; i++ ) {
                            const k = str[i];
                            colors[k] = !matches[0][1];
                        }
                        colorsCompare = matches[0][2];
                        break;
/*
                    case (word.indexOf('color=') === 0):
                        str = word.slice('color='.length);
                        strLen = str.length;
                        for ( let i = 0; i < strLen; i++ ) {
                            const k = str[i];
                            if (k === 'M') colorsMulti = true;
                            else colors[k] = true;
                        }
                        break;
                    case (word.indexOf('-color=') === 0):
                        str = word.slice('-color='.length);
                        strLen = str.length;
                        for ( let i = 0; i < strLen; i++ ) {
                            const k = str[i];
                            if (k === 'M') colorsMulti = false;
                            else colors[k] = false;
                        }
                        break;
*/
                    case (word.indexOf('commander:') === 0):
                        str = word.slice('commander:'.length);
                        strLen = str.length;
                        for ( let i = 0; i < strLen; i++ ) commander[str[i]] = true;
                        break;
                    case (word.indexOf('legal:') === 0):
                        formatArray.push(word.slice('legal:'.length));
                        formatStatusArray.push('legal');
                        break;
                    case (word.indexOf('restricted:') === 0):
                        formatArray.push(word.slice('restricted:'.length));
                        formatStatusArray.push('restricted');
                        break;
                    case (word.indexOf('banned:') === 0):
                        formatArray.push(word.slice('banned:'.length));
                        formatStatusArray.push('banned');
                        break;
                    case (word.indexOf('rarity:') === 0):
                        $('input[name="rarity[]"][value="'+word.slice('rarity:'.length)+'"]').prop('checked', true);
                        break;
                    case (word.indexOf('mana:') === 0):
                        $('#mana').val(word.slice('mana:'.length));
                        break;
                    case (word.indexOf('set:') === 0):
                        setArray.push(word.slice('set:'.length));
                        break;
//                    case (word.indexOf('-set:') === 0):
//                        setNotArray.push(word.slice('-set:'.length));
//                        break;
                    case (word.indexOf('block:') === 0):
                        blockArray.push(word.slice('block:'.length));
                        break;
                    case (word.indexOf('-block:') === 0):
                        blockNotArray.push(word.slice('-block:'.length));
                        break;
                    case (word.indexOf('unique:') === 0):
                        if (word.slice('unique:'.length) === 'prints') $('#unroll_search').prop('checked', true);
                        break;
                    case (word.indexOf('include:') === 0):
                        if (word.slice('include:'.length) === 'extras') $('#include_extras').prop('checked', true);
                        break;
                    case (word.indexOf('is:') === 0):
                        criteriaArray.push(word.slice('is:'.length));
                        break;
                    case (word.indexOf('artist:') === 0):
                        artistArray.push(word.slice('artist:'.length));
                        break;
                    case (word.indexOf('flavor:') === 0):
                        flavorArray.push(word.slice('flavor:'.length));
                        break;
                    case (word.indexOf('lore:') === 0):
                        loreArray.push(word.slice('lore:'.length));
                        break;
                    case (word.indexOf('lang:') === 0):
                        langArray.push(word.slice('lang:'.length));
                        break;
                    default:
                        matches = regex.exec(word);
                        if (matches) {
                            const [full, key, op, value] = matches;
                            if (statsTerms.includes(key)) {
                                const i = ++statsLen;
                                setTimeout(()=>{
                                    $('#stat_' + i).val(key);
                                    $('#stat_' + i + '_mode').val(op);
                                    $('#stat_' + i + '_value').val(value).trigger('change');
                                }, i * 10);
                            } else if (pricesTerms.includes(key)) {
                                const i = ++pricesLen;
                                setTimeout(()=>{
                                    $('#price_' + i).val(key);
                                    $('#price_' + i + '_mode').val(op);
                                    $('#price_' + i + '_value').val(value).trigger('change');
                                }, i * 10);
                            }
                        } else if (word.indexOf(':') === -1) {
                            nameArray.push(word); return;
                        }

                        break;
                }
            });
        });

//        let colorsYes = 0, colorsNo = 0;
        for(let [key, value] of Object.entries(colors)) {
            $('input[name="color[]"][value="'+key+'"]').prop('checked', value);
//            value ? colorsYes++ : colorsNo++;
        }
//        colorsStrict = colorsYes + colorsNo === 6;
        $colorsCompareField.val(colorsCompare);

        for(let [key, value] of Object.entries(commander)) {
            $('input[name="identity[]"][value="'+key+'"]').prop('checked', value);
        }

        formatStatusArray.forEach((value, i) => {
            setTimeout(()=>{$('#format_status_' + (i+ 1)).val(value);},5000);
        });

        formatArray.forEach((value, i) => {
            $('#format_' + (i+ 1)).val(value).trigger('change');
        });

        $nameField.val(nameArray.join(' '));
        $textField.val(textArray.join(' '));

        $typeField.val(typeArray.map( v => v.replace(/^-/,'') ));
        $typeField.trigger('change');
        typeArray.forEach( v => { if (v[0]==='-') $typeField.next().find(`.select2-polarity[data-item="${v.slice(1)}"]`).click() ; } );

        $typePartialField.prop('checked', typePartial);
        $colorsPartialField.prop('checked', colorsPartial);
//        $colorsMultiField.prop('checked', colorsMulti);
//        $colorsStrictField.prop('checked', colorsStrict);

        $setField.val(setArray);
        $setField.trigger('change');
//        setArray.forEach( v => { if (v[0]==='-') $setField.next().find(`.select2-polarity[data-item="${v.slice(1)}"]`).click() ; } );

        $blockField.val(blockArray);
        $blockField.trigger('change');
        blockArray.forEach( v => { if (v[0]==='-') $blockField.next().find(`.select2-polarity[data-item="${v.slice(1)}"]`).click() ; } );

        $criteriaField.val(criteriaArray);
        $criteriaField.trigger('change');
        criteriaArray.forEach( v => { if (v[0]==='-') $criteriaField.next().find(`.select2-polarity[data-item="${v.slice(1)}"]`).click() ; } );
        $criteriaPartialField.prop('checked', criteriaPartial);

        $artistField.val(artistArray.join(' '));
        $flavorField.val(flavorArray.join(' '));
        $loreField.val(loreArray.join(' '));
        $langField.val(langArray.join(' '));

    }

    if (!o.as) o.as = 'full';
    $('#as').val(o.as);

    if (!o.order) o.order = 'cmc';
    $('#order').val(o.order).after(`<select class="form-input auto" name="dir" id="dir">
        <option value="asc">Asc (not working yet)</option>
        <option value="desc">Desc (not working yet)</option>
    </select>`);


})();