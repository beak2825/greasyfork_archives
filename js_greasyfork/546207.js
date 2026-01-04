// ==UserScript==
// @name         Fancy Text Data Library
// @namespace    fancy-text-library
// @version      1.0
// @description  Biblioteca de datos para texto decorativo, ASCII mojis y efectos glitch
// @author       FancyText-Author
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // DATOS CONVERTIDOS
    const DATA = {
        FANCY_TEXT_MAPS: {
            'script': { 'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵', 'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏', '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫' },
            'fraktur': { 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ', 'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷', '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟩', '8': '𝟪', '9': '𝟡' },
            'monospace': { 'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉', 'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿' },
            'bold': { 'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵' },
            'italic': { 'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡', 'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻' }
        },
        
        ASCII_MOJIS: {
            'Saludos y Caras': ['(•◡•)/', '(* ^ ω ^)', '(´ ∀ ` *)', '(─‿‿─)', '(⌒‿⌒)', '(*¯︶¯*)', '(o^▽^o)', '٩(◕‿◕｡)۶', '＼(٥⁀▽⁀ )／', '(*°▽°*)', '╰(▔∀▔)╯', 'ヽ(>∀<☆)ノ', '(✧ω✧)', '(´｡• ᵕ •｡`)', '( ´ ▽ ` )', '(￣▽￣)', '( ´ ω ` )', '(*´▽`*)', '٩(｡•́‿•̀｡)۶', '(*¯ ³¯*)', '( ´ ▽ ` )ﾉ', '( ´ ▽ ` )b', '(^▽^)', '(￣ω￣)', '(*•ω•*)', 'σ(≧ε≦σ)'],
            'Shrugs y Duda': ['¯\\\\_(ツ)_/¯', '┐( ´ д ` )┌', 'ヽ(ー_ー)ノ', '┐(￣ヘ￣)┌', '┐( ´ , ` )┌', 'ʅ(°_°)ʃ', '┐(￣～￣)┌', 'ლ(ಠ_ಠლ)', '┐(˘_˘)┌', 'ლ(¯ロ¯"ლ)', '┐( ´･_･`)┌', '┐(\'～` )┌'],
            'Amor y Afecto': ['(｡♥‿♥｡)', '(´ ε ` )♡', '(´• ω •`) ♡', '(ღ˘⌣˘ღ)', '♥( ´ ▽ ` )ﾉ', '(♡ >ω< ♡)', '(´,,•ω•,,)♡', '(´ ω `♡)', '(´｡• ᵕ •｡`) ♡', '( ´･ω･)ﾉ(._.`)', '(づ￣ ³￣)づ', '( T_T)＼(^-^ )', '(づ ◕‿◕ )づ', '(づ｡◕‿‿◕｡)づ', '(づ ￣ ³￣)づ', '(*＾3＾)/～♡', '(ﾉ´ з `)ノ', '(´ε｀ )', '(´,,•ω•,,)'],
            'Tristeza y Llanto': ['( ´•︵•` )', '(｡•́︿•̀｡)', '(T_T)', '( ; ω ; )', '(个_个)', '(ಥ_ಥ)', '(╥_╥)', '(o; T ω T)o', '｡･ﾟﾟ*(>д<)*ﾟﾟ･｡', '( ; _ ; )', '(ノ_<。)', '(´-ω-`)', '( T ... T )', '( ; ´ - ` A``)', '(´ ` )'],
            'Enojo y Frustración': ['(＃`Д´)', '( ` ω ´ )', 'ヽ( `д´*)ノ', '( `ε´ )', '(＃`д´)', '(・`ω´・)', '( ` ´ )', '( ` A ´ )ﾉ', '(＃`д´)ﾉ', '(＃`皿´)', '(凸`д´)凸', '(╯`□´)╯', '(╯`д´)╯', '(╯°□°）╯︵ ┻━┻', '┬─┬ノ( `Д´ノ)', '(-`д´-)', '(눈_눈)', '(￣^￣)', '( ` , ´ )', '(￣ ￣)'],
            'Animales': ['(￣(ｴ)￣)', '( ´(oo)` )', '(=`ω´=)', 'ଲ(ⓛ ω ⓛ)ଲ', '(^=◕ᴥᴥ^)', 'ଲ(ⓛ ω ⓛ)ଲ', '(V) (;,;) (V)', '(V) (･ω･) (V)', '<コ:彡', '～>`)～～～', '～<`)))彡', 'くコ:彡', '／(･ × ･)＼', '(´・(oo)・`)', '(´(oo)`)', '(^._.^)ﾉ', '( : ౦ ‸ ౦ : )', '(U・x・U)', '三|*´ω`)ﾉ', '(´・(oo)・`)', 'ଲ(ⓛ ω ⓛ)ଲ'],
            'Especiales y Otros': ['(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '( O . O )', '(°°)～', '( ☉_☉)', '(⊙_⊙)', '(⊙_⊙)', '(￣д￣)', '(ノ°▽°)ノ', '(☞ﾟ∀ﾟ)☞', '☜(ﾟ∀ﾟ☜)', '┗( T_T )┛', '(☞ﾟヮﾟ)☞', '♪~ ᕕ(ᐛ)ᕗ', 'ᕕ( ᐛ )ᕗ', 'ヾ(⌐■_■)ノ♪', '＼(ﾟｰﾟ＼)', '(／ﾟｰﾟ)／', '(～￣▽￣)～', '(～o￣3￣)～', '(￣ω￣)', '~( ´ ` )~', '( ´ｰ`)', '( ´_ゝ`)', '(￣。￣)', '(￣～￣)', '(*￣m￣)', '( ´_ゝ`)', '(￣～￣)', '(￣。￣)', '(￣(ｴ)￣)ﾉ']
        },

        GLITCH_TEXT_STRINGS: {
            'weird': '𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙𒈙',
            'corrupted': '░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓██▓▒░░▒▓█',
            'glitch': '𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫',
            'distorted': 'ஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔஔ',
            'wow': '꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅',
        'nyan': '┈┈╭━━━━━━╮☆\n┈┈┃╳╳╳▕╲▂▂╱▏\n┈┈┃╳╳╳▕    ▏▍▕▍▏   ┊☆\n╰━┫╳╳╳▕▏    ╰┻╯    ┊\n┈┈┃╳╳╳╳╲▂▂╱\n☆┊╰┳┳━━┳┳╯┊┊☆',
        'pika': '  ▼￣＞―＜￣▼            \n   /  ๑⚈ ․̫ ⚈๑)⚡⚡\n  (   ｜つ   づ)',
        'tiger': '┈┈▕▔╲┈┈┈╱▔▏┈┈\n┈┈▕┃╲▔▔▔╲┃▏┈┈\n┈┈╱┊┳👁╮╭👁┳▏┈┈\n┈╱┊╲┊▔┊┊▔┊▏┈┈\n╱┊┊▕┊╱◥◤╲┊▏┈┈\n┊┊┊┊╲╲╱╲╱╱┈┈┈\n┊┊┊┊┊▔▔▔▔▏┈┈┈',
        'cool cat': '┈┈┈┈┈┈^  ^ \n┈┈┈┈┈┈(•ㅅ•)☆\n    ＿ノ ヽ ノ＼  __\n /    `/ ⌒Ｙ⌒ Ｙ    ヽ\n(     (三ヽ人     /        |',
        'hi box': '⠀⠀⠀⠀/)＿/)☆ Hello~\n⠀⠀／(๑^᎑^๑)っ ＼\n／|￣∪￣ ￣ |＼／\n⠀|＿＿_＿＿|／'
        }
    };
    
    // FUNCIONES DE UTILIDAD CORREGIDAS
    window.LIBRERIA_DATOS = {
        // Obtener todos los datos de forma segura
        getData: function() {
            try {
                return JSON.parse(JSON.stringify(DATA));
            } catch (error) {
                console.error('❌ Error al obtener datos:', error);
                return {};
            }
        },
        
        // Filtrar datos con diferentes tipos de filtros
        parseData: function(filter) {
            try {
                if (typeof filter === 'function') {
                    const result = {};
                    for (const [key, value] of Object.entries(DATA)) {
                        if (typeof value === 'object' && value !== null) {
                            result[key] = {};
                            for (const [subKey, subValue] of Object.entries(value)) {
                                if (Array.isArray(subValue)) {
                                    result[key][subKey] = subValue.filter(filter);
                                } else if (typeof subValue === 'object' && subValue !== null) {
                                    result[key][subKey] = {};
                                    for (const [itemKey, itemValue] of Object.entries(subValue)) {
                                        if (filter(itemValue)) {
                                            result[key][subKey][itemKey] = itemValue;
                                        }
                                    }
                                } else if (filter(subValue)) {
                                    result[key][subKey] = subValue;
                                }
                            }
                        } else if (filter(value)) {
                            result[key] = value;
                        }
                    }
                    return result;
                } else if (typeof filter === 'string' || filter instanceof RegExp) {
                    const regex = filter instanceof RegExp ? filter : new RegExp(filter, 'i');
                    return this.parseData(item => regex.test(String(item)));
                }
                return this.getData();
            } catch (error) {
                console.error('❌ Error al filtrar datos:', error);
                return {};
            }
        },
        
        // Obtener elemento aleatorio de toda la biblioteca
        getRandomItem: function() {
            try {
                const allItems = [];
                
                // Recolectar caracteres fancy
                for (const [mapName, charMap] of Object.entries(DATA.FANCY_TEXT_MAPS)) {
                    for (const [char, fancyChar] of Object.entries(charMap)) {
                        allItems.push({ 
                            type: 'fancy_char', 
                            style: mapName, 
                            char: char, 
                            fancyChar: fancyChar 
                        });
                    }
                }
                
                // Recolectar ASCII mojis
                for (const [category, mojis] of Object.entries(DATA.ASCII_MOJIS)) {
                    for (const moji of mojis) {
                        allItems.push({ 
                            type: 'ascii_moji', 
                            category: category, 
                            moji: moji 
                        });
                    }
                }
                
                // Recolectar strings glitch
                for (const [type, text] of Object.entries(DATA.GLITCH_TEXT_STRINGS)) {
                    allItems.push({ 
                        type: 'glitch_text', 
                        glitchType: type, 
                        text: text 
                    });
                }
                
                if (allItems.length === 0) {
                    console.warn('⚠️ No hay elementos disponibles');
                    return null;
                }
                
                const randomIndex = Math.floor(Math.random() * allItems.length);
                return allItems[randomIndex];
            } catch (error) {
                console.error('❌ Error al obtener elemento aleatorio:', error);
                return null;
            }
        },
        
        // Buscar por ID específico
        findById: function(id) {
            try {
                if (typeof id !== 'string' || id.trim() === '') {
                    console.warn('⚠️ ID debe ser una cadena no vacía');
                    return null;
                }
                
                const idLower = id.toLowerCase().trim();
                
                // Buscar en mapas de texto fancy
                if (DATA.FANCY_TEXT_MAPS[idLower]) {
                    return { 
                        type: 'fancy_map', 
                        id: idLower, 
                        data: DATA.FANCY_TEXT_MAPS[idLower] 
                    };
                }
                
                // Buscar en categorías de ASCII mojis (coincidencia exacta)
                if (DATA.ASCII_MOJIS[id]) {
                    return { 
                        type: 'ascii_category', 
                        id: id, 
                        data: DATA.ASCII_MOJIS[id] 
                    };
                }
                
                // Buscar en strings glitch
                if (DATA.GLITCH_TEXT_STRINGS[idLower]) {
                    return { 
                        type: 'glitch_string', 
                        id: idLower, 
                        data: DATA.GLITCH_TEXT_STRINGS[idLower] 
                    };
                }
                
                // Búsqueda por coincidencia parcial en categorías ASCII
                for (const [category, mojis] of Object.entries(DATA.ASCII_MOJIS)) {
                    if (category.toLowerCase().includes(idLower)) {
                        return { 
                            type: 'ascii_category_partial', 
                            id: category, 
                            data: mojis 
                        };
                    }
                }
                
                console.warn(`⚠️ No se encontró elemento con ID: ${id}`);
                return null;
            } catch (error) {
                console.error('❌ Error al buscar por ID:', error);
                return null;
            }
        },
        
        // Convertir texto a estilo fancy
        convertText: function(text, style) {
            try {
                if (!text || typeof text !== 'string') {
                    console.warn('⚠️ Texto debe ser una cadena no vacía');
                    return '';
                }
                
                const targetStyle = style || 'bold';
                
                if (!DATA.FANCY_TEXT_MAPS[targetStyle]) {
                    console.warn(`⚠️ Estilo "${targetStyle}" no disponible. Usando texto original.`);
                    return text;
                }
                
                return text.split('').map(char => 
                    DATA.FANCY_TEXT_MAPS[targetStyle][char] || char
                ).join('');
            } catch (error) {
                console.error('❌ Error al convertir texto:', error);
                return text || '';
            }
        },
        
        // Obtener mojis por categoría específica
        getMojisByCategory: function(category) {
            try {
                if (!category || typeof category !== 'string') {
                    console.warn('⚠️ Categoría debe ser una cadena no vacía');
                    return [];
                }
                
                const result = DATA.ASCII_MOJIS[category];
                if (!result) {
                    console.warn(`⚠️ Categoría "${category}" no encontrada`);
                    return [];
                }
                
                return [...result]; // Copia del array
            } catch (error) {
                console.error('❌ Error al obtener mojis por categoría:', error);
                return [];
            }
        },
        
        // Obtener texto glitch específico
        getGlitchText: function(type) {
            try {
                if (!type || typeof type !== 'string') {
                    console.warn('⚠️ Tipo debe ser una cadena no vacía');
                    return '';
                }
                
                const result = DATA.GLITCH_TEXT_STRINGS[type];
                if (result === undefined) {
                    console.warn(`⚠️ Tipo de glitch "${type}" no encontrado`);
                    return '';
                }
                
                return result;
            } catch (error) {
                console.error('❌ Error al obtener texto glitch:', error);
                return '';
            }
        },
        
        // Obtener lista de estilos disponibles
        getAvailableStyles: function() {
            try {
                return Object.keys(DATA.FANCY_TEXT_MAPS);
            } catch (error) {
                console.error('❌ Error al obtener estilos:', error);
                return [];
            }
        },
        
        // Obtener lista de categorías de mojis
        getMojiCategories: function() {
            try {
                return Object.keys(DATA.ASCII_MOJIS);
            } catch (error) {
                console.error('❌ Error al obtener categorías:', error);
                return [];
            }
        },
        
        // Obtener tipos de glitch disponibles
        getGlitchTypes: function() {
            try {
                return Object.keys(DATA.GLITCH_TEXT_STRINGS);
            } catch (error) {
                console.error('❌ Error al obtener tipos de glitch:', error);
                return [];
            }
        }
    };
    
    // Exponer datos globalmente para compatibilidad
    window.DATA_ARRAY = DATA;
    window.FANCY_TEXT_MAPS = DATA.FANCY_TEXT_MAPS;
    window.ASCII_MOJIS = DATA.ASCII_MOJIS;
    window.GLITCH_TEXT_STRINGS = DATA.GLITCH_TEXT_STRINGS;
    
    // Calcular estadísticas y mostrar información de carga
    try {
        const totalFancyChars = Object.keys(DATA.FANCY_TEXT_MAPS).reduce((sum, style) => 
            sum + Object.keys(DATA.FANCY_TEXT_MAPS[style]).length, 0
        );
        
        const totalMojis = Object.keys(DATA.ASCII_MOJIS).reduce((sum, category) => 
            sum + DATA.ASCII_MOJIS[category].length, 0
        );
        
        const totalGlitchStrings = Object.keys(DATA.GLITCH_TEXT_STRINGS).length;
        const totalElements = totalFancyChars + totalMojis + totalGlitchStrings;
        
        console.log('🎉 ===== FANCY TEXT LIBRARY CARGADA =====');
        console.log(`📚 Total de elementos: ${totalElements}`);
        console.log(`🎨 Caracteres fancy: ${totalFancyChars} (${Object.keys(DATA.FANCY_TEXT_MAPS).length} estilos)`);
        console.log(`😀 ASCII mojis: ${totalMojis} (${Object.keys(DATA.ASCII_MOJIS).length} categorías)`);
        console.log(`✨ Strings glitch: ${totalGlitchStrings} tipos`);
        console.log('🚀 Biblioteca lista para usar: window.LIBRERIA_DATOS');
        console.log('==========================================');
    } catch (error) {
        console.error('❌ Error al calcular estadísticas:', error);
    }

})();
