// ==UserScript==
// @name         Wanikani Integrated Dashboard Overhaul Settings
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Settings Panel to modify the Dashboard Overhaul
// @author       ToastedRice
// @include      /^https?://(www|preview).wanikani.com/(dashboard)?/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403932/Wanikani%20Integrated%20Dashboard%20Overhaul%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/403932/Wanikani%20Integrated%20Dashboard%20Overhaul%20Settings.meta.js
// ==/UserScript==

(function() {

    // Add your fonts here!
    let fonts = [
        // Fonts that Wanikani uses
        'Arial',
        'FontAwesome',
        '"Helvetica Neue"',
        'Helvetica',
        'Noto Sans JP',
        '"Open Sans"',
        'sans-serif',
        'Source Sans Pro',

        // Default Windows fonts
        "Meiryo, メイリオ",
        "MS PGothic, ＭＳ Ｐゴシック, MS Gothic, ＭＳ ゴック",
        "MS PMincho, ＭＳ Ｐ明朝, MS Mincho, ＭＳ 明朝",
        "Yu Gothic, YuGothic",
        "Yu Mincho, YuMincho",

        // Default OS X fonts
        "Hiragino Kaku Gothic Pro, ヒラギノ角ゴ Pro W3",
        "Hiragino Maru Gothic Pro, ヒラギノ丸ゴ Pro W3",
        "Hiragino Mincho Pro, ヒラギノ明朝 Pro W3",

        // Common Linux fonts
        "Takao Gothic, TakaoGothic",
        "Takao Mincho, TakaoMincho",
        "Sazanami Gothic",
        "Sazanami Mincho",
        "Kochi Gothic",
        "Kochi Mincho",
        "Dejima Mincho",
        "Ume Gothic",
        "Ume Mincho",


        // Other Japanese fonts people use.
        // You might want to try some of these!
        "04KanjyukuGothic",
        "07YasashisaAntique",
        "851MkPOP",
        "A-OTF Shin Maru Go Pro",
        "aoyagireisyosimo2, AoyagiKouzanFont2OTF",
        "AppliMincho",
        "ArmedBanana",
        "aquafont",
        "'chifont+', chifont",
        "Chihaya Jyun",
        "ChihayaGothic",
        "cinecaption",
        "Corporate Logo Medium",
        "Corporate Logo Rounded",
        "DartsFont",
        "EPSON 行書体Ｍ",
        "EPSON 正楷書体Ｍ",
        "EPSON 教科書体Ｍ",
        "EPSON 太明朝体Ｂ",
        "EPSON 太行書体Ｂ",
        "EPSON 丸ゴシック体Ｍ",
        "FangSong",
        "FC-Flower",
        "GenEi Antique Pv5",
        "GenEi Nombre",
        "GenEi Web Honmon",
        "HakusyuGyosyoPro_kk",
        "HakusyuKaisyoExtraBold_kk",
        "HakusyuKaisyo_kk",
        "HakusyuReisyo_kk",
        "Honoka Antique-Kaku",
        "HonyaJi-Re",
        "Hosofuwafont",
        "JK Gothic M",
        "nagayama_kai",
        "Nchifont+",
        "Pomeranian",
        "Purisa",
        "RiiTegakiFude",
        "santyoume-font",
        "ShokakiSarariGyotai",
        "SoukouMincho",
        "Togalite",
        "umeboshi"
    ];
    let lesson = [0,0,0];
    let review = [0,0,0];
    let fetched = [false,false];

    function lesson_text() {return $('.lessons-and-reviews__lessons-button span')}
    function review_text() {return $('.lessons-and-reviews__reviews-button span')}

    window.window.addEventListener('load', check_fonts);

    if (window.wkof)
    {
        wkof.include('Menu,Settings');
        wkof.ready('Menu,Settings')
            .then(load)
            .then(install_menu)
            .then(install_css)
            .then(update_font);
    }
    else if (confirm('WK IDBO requires Wanikani Open Framework.\n\nDo you want to be forwarded to the installation instructions?')) {
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    };

    // ================================================================================================================
    // Checks if fonts exist on system/browser/website. Function waits for page to load before proceeding to allow fonts time to be imported.

    function check_fonts()
    {
        let available = isFontAvailable(fonts);
        fonts = fonts.filter((font,i) => available[i]);
        fonts.forEach((font,i) => {font = font.replace(/'?"?/g,''); fonts[i] = font.charAt(0).toUpperCase() + font.slice(1)});
        fonts = fonts.sort();
    }

    // ================================================================================================================
    // Loads settings and setting defaults

    function load()
    {
        lesson_text().on('DOMSubtreeModified', fetch_lesson_details)
        review_text().on('DOMSubtreeModified', fetch_review_details)

        let default_settings =
            {
                style: 'jp_simple',
                font: 'Arial',
                font_weight: 5,
                font_size: 14.0,
                separator: 'space',
                size: 5,
                offset: 0,
            }
        return wkof.Settings.load('idbo_settings', default_settings);
    }

    // ================================================================================================================
    // Scans text for r/k/v counts

    function parse_details(input, output)
    {
        let rad = input.search('部');
        let kan = input.search('漢');
        let voc = input.search('語');
        if (rad==-1) rad = 0;
        if (kan==-1) kan = rad;
        if (voc==-1) voc = kan;
        output[0] = parseInt(input.substring(0,rad).replace(/\D/g,''),10);
        output[1] = parseInt(input.substring(rad,kan).replace(/\D/g,''),10);
        output[2] = parseInt(input.substring(kan,voc).replace(/\D/g,''),10);
    }

    // ================================================================================================================
    // Retrieves lesson r/k/v text

    function fetch_lesson_details()
    {
        if (lesson_text().text() && !fetched[0])
        {
            fetched[0] = true;
            parse_details(lesson_text().text(), lesson);
            update_lesson_details();
        }
    }

    // ================================================================================================================
    // Retrieves review r/k/v text

    function fetch_review_details()
    {
        if (review_text().text() && !fetched[1])
        {
            fetched[1] = true;
            parse_details(event.target.innerText, review);
            update_review_details();
        }
    }

    // ================================================================================================================
    // Updates both lesson and review r/k/v text

    function update_details()
    {
        update_lesson_details();
        update_review_details();
    }

    // ================================================================================================================
    // Updates review r/k/v text

    function update_lesson_details()
    {
        if (fetched[0]) lesson_text().html(detail_text(lesson))
    }

    // ================================================================================================================
    // Updates lesson r/k/v text

    function update_review_details()
    {
        if (fetched[1]) review_text().html(detail_text(review))
    }

    // ================================================================================================================
    // Adds menu entry to script menu list.

    function install_menu()
    {
        var menu =
            {
                name: 'integrated_dashboard_overhaul_settings',
                submenu: 'Settings',
                title: 'Integrated Dashboard Overhaul',
                on_click: open_menu
            };
        wkof.Menu.insert_script_link(menu);
    }

    // ================================================================================================================
    // Opens the script menu. Updates preview upon any changes.

    function open_menu()
    {
        var submenu =
        {
            script_id: 'idbo_settings',
            title:     'Integrated Dashboard Overhaul',
            pre_open:   update_preview,
            on_save:    update_font,
            on_cancel:  update_font,
            on_close:   update_font,
            content:
            {
                preview:
                {
                    type:  'html',
                    label: 'Preview:',
                    html:  '<div class="idbo-preview"><div>Lessons</div><span id="idbo-preview">' + preview().replace(/\n/g, "<br />") + '</span></div>'
                },

                font:
                {
                    type:     'dropdown',
                    label:    'Font:',
                    default:  'Arial',
                    on_change: update_preview,
                },

                font_size:
                {
                    type:     'number',
                    label:    'Font Size:',
                    default:  14,
                    min:       4,
                    max:      44,
                    on_change: update_preview,
                },

                font_weight:
                {
                    type:      'number',
                    label:     'Font Weight:',
                    hover_tip: 'Change how "bold" the font is from 1-9. Most fonts will only have 2 available weights',
                    default:   5,
                    min:       1,
                    max:       9,
                    on_change: update_preview,
                },

                style:
                {
                    type:      'list',
                    label:     'Appearance',
                    hover_tip: 'Choose the appearance of your lesson/review counts',
                    default:   'jp_simple',
                    on_change: function(value) { document.getElementById('idbo-preview').innerText = preview() },
                    content:
                    {
                        classic:    preview('classic'),
                        eng_simple: preview('eng_simple'),
                        eng_full:   preview('eng_full'),
                        jp_simple:  preview('jp_simple'),
                        jp_full:    preview('jp_full'),
                        hiragana:   preview('hiragana'),
                        katakana:   preview('katakana'),
                    }
                },

                separator:
                {
                    type:      'dropdown',
                    label:     'Subject Separator',
                    hover_tip: 'Choose symbol to separate subjects. Some symbols will not show up in some fonts',
                    default:   ' ',
                    on_change: function(value) { document.getElementById('idbo-preview').innerText = preview(); update_preview(); },
                    content:
                    {
                        space:  '(space)',
                        slash:  '/',
                        line:   '|',
                        plus:   '+',
                        dash:   '-',
                        long:   'ー',
                        tilde:  '~',
                        bullet: '•',
                        maru:   '・',
                        heart:  '♥',
                        spade:  '♠',
                        diam:   '♦',
                        club:   '♣',
                        tri:    '‣',
                        ast:    '*',
                        star:   '★',
                        star1:  '☆',
                        star2:  '✦',
                        star3:  '✧',
                        star4:  '✸',
                        sun:    '☀',
                        sun2:   '☼',
                        moon:   '☾',
                        cloud:  '☁',
                        umbrl:  '☂',
                        comma:  ',',
                        colon:  ':',
                        semi:   ';',
                        newline:'(new line) - Stack subjects vertically.'
                    }
                },

                size:
                {
                    type: 'number',
                    label: 'Border Size',
                    hover_tip: 'Enlarge or shrink the border. Default size is 5',
                    default: 5,
                    min: 0,
                    max: 20,
                    on_change: update_preview,
                },

                offset:
                {
                    type: 'number',
                    label: 'Vertical Offset',
                    hover_tip: 'Will shift the text up and down. Useful if font is not centered.',
                    default: 0,
                    min: -5 - wkof.settings.idbo_settings.size,
                    max: 5 + wkof.settings.idbo_settings.size,
                    on_change: update_preview,
                },
            }
        }
        submenu.content.font.content = fonts.reduce(function(output, value) {output[value] = value; return output;}, {});
        new wkof.Settings(submenu).open();
    }

    // ================================================================================================================
    // Generates preview text for settings panel

    function preview(style)
    {
        let rad = get_radical_style(style || wkof.settings.idbo_settings.style)
        let kan = get_kanji_style  (style || wkof.settings.idbo_settings.style)
        let voc = get_vocab_style  (style || wkof.settings.idbo_settings.style)
        let sep = get_separator();

        style = style?style:wkof.settings.idbo_settings.style;

        if (style == 'classic') return (12+34+56).toString();
        return 12+rad + sep + 34+kan + sep + 56+voc;
    }

    // ================================================================================================================
    // Generates r/k/v details text

    function detail_text(data)
    {
        if (data[0] + data[1] + data[2] == 0) return '0';

        let style = wkof.settings.idbo_settings.style
        let rad = get_radical_style(style || wkof.settings.idbo_settings.style)
        let kan = get_kanji_style  (style || wkof.settings.idbo_settings.style)
        let voc = get_vocab_style  (style || wkof.settings.idbo_settings.style)
        let sep = get_separator();
        if (sep == '\n') sep = '<br \\>';

        if (style == 'classic') return data[0]+data[1]+data[2];

        let output = '';
        output += data[0] ? data[0] + rad : '';
        output += ((data[0] && data[1]) || (data[0] && data[2])) ? sep : '';
        output += data[1] ? data[1] + kan : '';
        output += (data[1] && data[2]) ? sep : '';
        output += data[2] ? data[2] + voc : '';
        return output;
    }

    // ================================================================================================================
    // Converts settings separator into actual symbol for separator

    function get_separator(sep)
    {
        switch(sep || wkof.settings.idbo_settings.separator)
        {
            case 'space':   return ' '; break;
            case 'slash':   return '/'; break;
            case 'line':    return '|'; break;
            case 'plus':    return '+'; break
            case 'dash':    return '-'; break;
            case 'long':    return 'ー'; break;
            case 'tilde':   return '~'; break;
            case 'bullet':  return '•'; break;
            case 'maru':    return '・'; break;
            case 'tri':     return '‣'; break;
            case 'ast':     return '*'; break;
            case 'heart':   return '♥'; break;
            case 'spade':   return '♠'; break;
            case 'diam':    return '♦'; break;
            case 'club':    return '♣'; break;
            case 'star':    return '★'; break;
            case 'star1':   return '☆'; break;
            case 'star2':   return '✦'; break;
            case 'star3':   return '✧'; break;
            case 'star4':   return '✸'; break;
            case 'sun':     return '☀'; break;
            case 'sun2':    return '☼'; break;
            case 'moon':    return '☾'; break;
            case 'cloud':   return '☁'; break;
            case 'umbrl':   return '☂'; break;
            case 'comma':   return ','; break;
            case 'colon':   return ':'; break;
            case 'semi':    return ';'; break;
            case 'newline': return '\n'; break;
        }
    }

    // ================================================================================================================
    // Retrieves appropriate text for radical

    function get_radical_style(style)
    {
        switch(style || wkof.settings.idbo_settings.style)
        {
            case 'eng_full':   return ' Radical';
            case 'eng_simple': return 'R';
            case 'jp_full':    return '部首';
            case 'jp_simple':  return '部';
            case 'hiragana':   return ' ぶしゅ';
            case 'katakana':   return ' ブシュ';
        }
    }

    // ================================================================================================================
    // Retrieves appropriate text for kanji

    function get_kanji_style(style)
    {
        switch(style || wkof.settings.idbo_settings.style)
        {
            case 'eng_full':   return ' Kanji';
            case 'eng_simple': return 'K';
            case 'jp_full':    return '漢字';
            case 'jp_simple':  return '漢';
            case 'hiragana':   return ' かんじ';
            case 'katakana':   return ' カンジ';
        }
    }

    // ================================================================================================================
    // Retrieves appropriate text for vocab

    function get_vocab_style(style)
    {
        switch(style || wkof.settings.idbo_settings.style)
        {
            case 'eng_full':   return ' Vocabulary';
            case 'eng_simple': return 'V';
            case 'jp_full':    return '単語';
            case 'jp_simple':  return '語';
            case 'hiragana':   return ' たんご';
            case 'katakana':   return ' タンゴ';
        }
    }

    // ================================================================================================================
    // Installs text css styles

    function install_css()
    {
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
        <style id="IDBO Font CSS"></style>
        <style id="IDBO Font Preview CSS"></style>`
        );
        update_font();
        update_preview();
    }

    // ================================================================================================================
    // Updates lesson/review detail font

    function update_font()
    {
        let settings = wkof.settings.idbo_settings;
        document.getElementById('IDBO Font Preview CSS').innerHTML = `
        .lessons-and-reviews__button span
        {
            font-weight: ` + (settings.font_weight * 100) + ` !important;
            font-family: ` + settings.font + ` !important;
            font-size: `   + settings.font_size + `px!important;
            padding: ` + (settings.size - settings.offset) + `px ` +
                         (settings.size + 5) + `px ` +
                         (settings.size + settings.offset) + `px !important;
            padding-top: 5px !important;
            padding-bottom: 5px !important;
            text-align: end !important;
        }`;
        update_details();
    }

    // ================================================================================================================
    // Updates the font in the preview

    function update_preview()
    {
        let settings = wkof.settings.idbo_settings;
        document.getElementById('IDBO Font Preview CSS').innerHTML = `
        #wkof_ds #idbo_settings_style
        {
            font-family: ` + settings.font + `;
        }
        .idbo-preview
        {
            display: block;
            cursor: pointer;
            position: relative;
            top: 0px;
            left: 0px;
            float: right;
            width: 380px;
            height: 149.6px;
            margin: 0px 0px 10px !important;
            background-color: #FF00AA;
            background-image: url(https://cdn.wanikani.com/assets/dashboard/buttons/bg_lessons-25-f813c200a3639f27d8bf9a84c0512db19c69b80701abfe18c9d961a353b2900f.png);
            background-repeat: no-repeat;
            background-size: auto 150px;
            background-position: center;
            border-radius: 5px;
            color: #FFF;
            line-height: 1;
            box-shadow: inset 0 -3px 1px rgba(0,0,0,0.2), inset 0 3px 1px rgba(0,0,0,0);
            transition: box-shadow 100ms;
        }
        .idbo-preview span
        {
            font-family: ` + settings.font + `;
            font-size: `   + settings.font_size + `px;
            font-weight: ` + settings.font_weight * 100 + `;
            padding: ` + (settings.size - settings.offset) + `px ` +
                         (settings.size + 5) + `px ` +
                         (settings.size + settings.offset) + `px !important;
            border-radius: 15px;
            border-color: #FFF;
            background-color: #FFF;
            color: #FF00AA;
            width: fit-content;
            position: absolute;
            bottom: 12px;
            right: 12px;
        }
        .idbo-preview div
        {
            position:absolute;
            bottom: 16px;
            left: 16px;
            font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 18px;
            font-weight: bold;
        }`;
    }

    // ================================================================================================================
    // Tests to see whether or not the font exists by checking the width of the output.

    function isFontAvailable (font) {
        var testString  = '~iomw-—l~ツ亻';
        var containerId = 'is-font-available-container';

        var fontArray = font instanceof Array;

        if (!fontArray) {
            font = [ font ];
        }

        var fontAvailability = [];

        var containerSel = '#' + containerId;
        var spanSel      = containerSel + ' span';

        var familySansSerif = 'sans-serif';
        var familyMonospace = 'monospace, monospace';
        // Why monospace twice? It's a bug in the Mozilla and Webkit rendering engines:

        // DOM:
        $('body').append('<div id="' + containerId + '"></div>');
        $(containerSel).append('<span></span>');
        $(spanSel).append(document.createTextNode(testString));

        // CSS:
        $(containerSel).css('visibility', 'hidden');
        $(containerSel).css('position', 'absolute');
        $(containerSel).css('left', '-9999px');
        $(containerSel).css('top', '0');
        $(containerSel).css('font-weight', 'bold');
        $(containerSel).css('font-size', '200px !important');

        jQuery.each( font, function (i, v) {
            $(spanSel).css('font-family', v + ',' + familyMonospace );
            var monospaceFallbackWidth = $(spanSel).width();
            var monospaceFallbackHeight = $(spanSel).height();

            $(spanSel).css('font-family', v + ',' + familySansSerif );
            var sansSerifFallbackWidth = $(spanSel).width();
            var sansSerifFallbackHeight = $(spanSel).height();

            fontAvailability[i] = true
            && monospaceFallbackWidth == sansSerifFallbackWidth
            && monospaceFallbackHeight == sansSerifFallbackHeight;
        } );

        $(containerSel).remove();

        if (!fontArray && fontAvailability.length == 1) {
            fontAvailability = fontAvailability[0];
        }

        return fontAvailability;
    }
})();