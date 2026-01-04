// ==UserScript==
// @name         DuelingNexus Deck Editor Revamp
// @namespace    https://duelingnexus.com/
// @version      0.9.1
// @description  Revamps the deck editor search feature.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/editor/*
// @downloadURL https://update.greasyfork.org/scripts/389658/DuelingNexus%20Deck%20Editor%20Revamp.user.js
// @updateURL https://update.greasyfork.org/scripts/389658/DuelingNexus%20Deck%20Editor%20Revamp.meta.js
// ==/UserScript==

// TODO: separate search by name/eff
// TODO: rehash sort function

const EXT = {
    RESULTS_PER_PAGE: 30,
    MIN_INPUT_LENGTH: 1,
    SEARCH_BY_TEXT: true,
    MAX_UNDO_RECORD: 30,
    DECK_SIZE_LIMIT: null,
    Search: {
        cache: [],
        current_page: 1,
        max_page: null,
        per_page: null,
        messages: [],
    },
    // contents defined later
    EDIT_API: {}
};
window.EXT = EXT;
const FN = {
    compose: function (f, g) {
        return function (...inputs) {
            return f(g(...inputs));
        }
    },
    hook: function (f, h, g) {
        return function (...inputs) {
            let fv = f(...inputs);
            let gv = g(...inputs);
            return h(fv, gv);
        }
    },
    not: function (x) {
        return !x;
    },
    or: function (x, y) {
        return x || y;
    },
    and: function (x, y) {
        return x && y;
    },
    add: function (x, y) {
        return x + y;
    },
    fold: function (f, xs, seed = 0) {
        return xs.reduce(f, seed);
    },
    sum: function (xs) {
        return FN.fold(FN.add, xs);
    },
    // I heard you like obfuscation
    xor: function (x, y) {
        return x ? y ? 0 : 1 : y;
    },
};
window.FN = FN;

const TokenTypes = {
    OPERATOR: Symbol("TokenTypes.OPERATOR"),
    OPEN_PAREN: Symbol("TokenTypes.OPEN_PAREN"),
    CLOSE_PAREN: Symbol("TokenTypes.CLOSE_PAREN"),
    WHITESPACE: Symbol("TokenTypes.WHITESPACE"),
    EXPRESSION: Symbol("TokenTypes.EXPRESSION"),
    UNKNOWN: Symbol("TokenTypes.UNKNOWN"),
};
class SearchInputToken {
    constructor(raw, type, position) {
        this.raw = raw;
        this.type = type;
        this.position = position;
    }
    
    isWhiteSpace() {
        return this.type === TokenTypes.WHITESPACE;
    }
    
    isData() {
        return this.type === TokenTypes.EXPRESSION;
    }
    
    isOperator() {
        return this.type === TokenTypes.OPERATOR;
    }
    
    isOpenParenthesis() {
        return this.type === TokenTypes.OPEN_PAREN;
    }
    
    isCloseParenthesis() {
        return this.type === TokenTypes.CLOSE_PAREN;
    }
    
    toString() {
        // let repr = "Token[ ";
        // repr += this.position.toString().padStart(2);
        // repr += ":";
        // repr += this.type.toString().padEnd(32);
        // repr += JSON.stringify(this.raw);
        // repr += " ]";
        
        // return repr;
        
        return "SearchInputToken(" + JSON.stringify(this.raw) + ", " + this.type.toString() + ", " + this.position + ")";
    }
    
    inspect() {
        return this.toString();
    }
}
class SearchInputParser {
    constructor(input) {
        this.input = input;
        this.tokens = [];
        this.index = 0;
    }
    
    get running() {
        return this.index < this.input.length;
    }
    
    step() {
        let slice = this.input.slice(this.index);
        for(let [regex, type] of SearchInputParser.RULES) {
            let match = slice.match(regex);
            if(match && match.length) {
                match = match[0];
                if(type === TokenTypes.UNKNOWN) {
                    throw new Error("Unknown token(" + this.index + "): \"" + match + '"');
                }
                this.tokens.push(new SearchInputToken(match, type, this.index));
                this.index += match.length;
                break;
            }
        }
    }
    
    parse() {
        while(this.running) {
            this.step();
        }
    }
    
    static parse(text) {
        let inst = new SearchInputParser(text);
        inst.parse();
        return inst.tokens;
    }
    
    static parseSignificant(text) {
        return SearchInputParser.parse(text).filter(token => !token.isWhiteSpace());
    }
}
SearchInputParser.RULE_EXPRESSION = /^((?:[&=]|[!><]=?)\s*)?("(?:[^"]|"")*"|\S+?\b)/;
SearchInputParser.RULES = [
    [/^\s+/, TokenTypes.WHITESPACE],
    [/^\(/, TokenTypes.OPEN_PAREN],
    [/^\)/, TokenTypes.CLOSE_PAREN],
    [/^\b(?:OR|AND)\b|,/, TokenTypes.OPERATOR],
    [SearchInputParser.RULE_EXPRESSION, TokenTypes.EXPRESSION],
    [/^./, TokenTypes.UNKNOWN],
];

// higher = tighter
const OPERATOR_PRECEDENCE = {
    "AND":  100,
    "OR":   50,
};

class SearchInputShunter {
    constructor(input) {
        this.tokens = SearchInputParser.parseSignificant(input);
        this.index = 0;
        this.operatorStack = [];
        this.outputQueue = [];
    }

    static parseValue(raw) {
        let wholeMatch = raw.match(SearchInputParser.RULE_EXPRESSION);
        if(wholeMatch !== null) {
            let [ match, comp, value ] = wholeMatch;
            // default to = for comparison
            raw = (comp || "=") + value;
        }
        
        raw = raw.replace(/"((?:[^"]|"")*)"/g, function (match, inner) {
            // undouble escapes
            return inner.replace(/""/g, '"');
        });
        
        return raw;
    }
    
    get operatorStackTop() {
        return this.operatorStack[this.operatorStack.length - 1];
    }
    
    get running() {
        return this.index < this.tokens.length;
    }
    
    parseToken(token) {
        if(token.isData()) {
            // idc if this is impure shunting procedures, it works!
            let modifiedToken = new SearchInputToken(SearchInputShunter.parseValue(token.raw), token.type, token.position);
            this.outputQueue.push(modifiedToken);
        }
        else if(token.isOpenParenthesis()) {
            this.operatorStack.push(token);
        }
        else if(token.isCloseParenthesis()) {
            while(this.operatorStackTop && !this.operatorStackTop.isOpenParenthesis()) {
                this.outputQueue.push(this.operatorStack.pop());
            }
            if(this.operatorStackTop && this.operatorStackTop.isOpenParenthesis()) {
                this.operatorStack.pop();
            }
            else {
                throw new Error("Unbalanced parentheses");
            }
        }
        else if(token.isOperator()) {
            let currentPrecedence = OPERATOR_PRECEDENCE[token.raw];
            while(this.operatorStackTop && OPERATOR_PRECEDENCE[this.operatorStackTop.raw] > currentPrecedence) {
                this.outputQueue.push(this.operatorStack.pop());
            }
            this.operatorStack.push(token);
        }
    }
    
    shunt() {
        for(let token of this.tokens) {
            this.parseToken(token);
        }
        while(this.operatorStackTop) {
            this.outputQueue.push(this.operatorStack.pop());
        }
    }
    
    static parseSections(text) {
        let shunter = new SearchInputShunter(text);
        shunter.shunt();
        return shunter.outputQueue;
    }
}

let onStart = function () {
    // minified with https://kangax.github.io/html-minifier/
    const ADVANCED_SETTINGS_HTML_STRING = `
        <div id=rs-ext-advanced-search-bar>
          <button id=rs-ext-monster-toggle class="engine-button engine-button-default">monster</button>
          <button id=rs-ext-spell-toggle class="engine-button engine-button-default">spell</button>
          <button id=rs-ext-trap-toggle class="engine-button engine-button-default">trap</button>
          <button id=rs-ext-sort-toggle class="engine-button engine-button-default rs-ext-right-float">sort</button>
          <div id=rs-ext-advanced-pop-outs>
            <div id=rs-ext-sort class="rs-ext-shrinkable rs-ext-shrunk">
              <table id=rs-ext-sort-table class=rs-ext-table>
                <tr>
                  <th>Sort By</th>
                  <td>
                    <select class=rs-ext-input id=rs-ext-sort-by>
                      <option>Name</option>
                      <option>Level</option>
                      <option>ATK</option>
                      <option>DEF</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Sort Order</th>
                  <td>
                    <select class=rs-ext-input id=rs-ext-sort-order>
                      <option>Ascending</option>
                      <option>Descending</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Stratify?</th>
                  <td><input type=checkbox id=rs-ext-sort-stratify checked></td>
                </tr>
              </table>
            </div>
            <div id=rs-ext-spell class="rs-ext-shrinkable rs-ext-shrunk">
              <table>
                <tr>
                  <th>Spell Card Type</th>
                  <td>
                    <select id=rs-ext-spell-type>
                      <option></option>
                      <option>Normal</option>
                      <option>Quick-play</option>
                      <option>Field</option>
                      <option>Continuous</option>
                      <option>Ritual</option>
                      <option>Equip</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Limit</th>
                  <td><input class=rs-ext-input id=rs-ext-spell-limit></td>
                </tr>
              </table>
            </div>
            <div id=rs-ext-trap class="rs-ext-shrinkable rs-ext-shrunk">
              <table>
                <tr>
                  <th>Trap Card Type</th>
                  <td>
                    <select id=rs-ext-trap-type>
                      <option></option>
                      <option>Normal</option>
                      <option>Continuous</option>
                      <option>Counter</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Limit</th>
                  <td><input class=rs-ext-input id=rs-ext-trap-limit></td>
                </tr>
              </table>
            </div>
            <div id=rs-ext-monster class="rs-ext-shrinkable rs-ext-shrunk">
              <table class="rs-ext-left-float rs-ext-table"id=rs-ext-link-arrows>
                <tr>
                  <th colspan=3>Link Arrows</th>
                </tr>
                <tr>
                  <td><button class=rs-ext-toggle-button>↖</button></td>
                  <td><button class=rs-ext-toggle-button>↑</button></td>
                  <td><button class=rs-ext-toggle-button>↗</button></td>
                </tr>
                <tr>
                  <td><button class=rs-ext-toggle-button>←</button></td>
                  <td><button class=rs-ext-toggle-button id=rs-ext-equals>=</button></td>
                  <td><button class=rs-ext-toggle-button>→</button></td>
                </tr>
                <tr>
                  <td><button class=rs-ext-toggle-button>↙</button></td>
                  <td><button class=rs-ext-toggle-button>↓</button></td>
                  <td><button class=rs-ext-toggle-button>↘</button></td>
                </tr>
              </table>
              <div id=rs-ext-monster-table class="rs-ext-left-float rs-ext-table">
                <table>
                  <tr>
                    <th>Category</th>
                    <td>
                      <select class=rs-ext-input id=rs-ext-monster-category>
                        <option></option>
                        <option>Normal</option>
                        <option>Effect</option>
                        <option>Ritual</option>
                        <option>Fusion</option>
                        <option>Synchro</option>
                        <option>Xyz</option>
                        <option>Pendulum</option>
                        <option>Link</option>
                        <option>Leveled</option>
                        <option>Extra Deck</option>
                        <option>Non-Effect</option>
                        <option>Gemini</option>
                        <option>Flip</option>
                        <option>Spirit</option>
                        <option>Toon</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Ability</th>
                    <td>
                      <select id=rs-ext-monster-ability class=rs-exit-input>
                        <option></option>
                        <option>Tuner</option>
                        <option>Toon</option>
                        <option>Spirit</option>
                        <option>Union</option>
                        <option>Gemini</option>
                        <option>Flip</option>
                        <option>Pendulum</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Type</th>
                    <td>
                      <select id=rs-ext-monster-type class=rs-ext-input>
                        <option></option>
                        <option>Aqua</option>
                        <option>Beast</option>
                        <option>Beast-Warrior</option>
                        <option>Cyberse</option>
                        <option>Dinosaur</option>
                        <option>Dragon</option>
                        <option>Fairy</option>
                        <option>Fiend</option>
                        <option>Fish</option>
                        <option>Insect</option>
                        <option>Machine</option>
                        <option>Plant</option>
                        <option>Psychic</option>
                        <option>Pyro</option>
                        <option>Reptile</option>
                        <option>Rock</option>
                        <option>Sea Serpent</option>
                        <option>Spellcaster</option>
                        <option>Thunder</option>
                        <option>Warrior</option>
                        <option>Winged Beast</option>
                        <option>Wyrm</option>
                        <option>Zombie</option>
                        <option>Creator God</option>
                        <option>Divine-Beast</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Attribute</th>
                    <td>
                      <select id=rs-ext-monster-attribute class=rs-ext-input>
                        <option></option>
                        <option>DARK</option>
                        <option>EARTH</option>
                        <option>FIRE</option>
                        <option>LIGHT</option>
                        <option>WATER</option>
                        <option>WIND</option>
                        <option>DIVINE</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Limit</th>
                    <td><input class=rs-ext-input id=rs-ext-monster-limit></td>
                  </tr>
                  <tr>
                    <th>Level/Rank/Link Rating</th>
                    <td><input class=rs-ext-input id=rs-ext-level></td>
                  </tr>
                  <tr>
                    <th>Pendulum Scale</th>
                    <td><input class=rs-ext-input id=rs-ext-scale></td>
                  </tr>
                  <tr>
                    <th>ATK</th>
                    <td><input class=rs-ext-input id=rs-ext-atk></td>
                  </tr>
                  <tr>
                    <th>DEF</th>
                    <td><input class=rs-ext-input id=rs-ext-def></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div id=rs-ext-spacer></div>
        </div>
    `;
    
    const ADVANCED_SETTINGS_HTML_ELS = jQuery.parseHTML(ADVANCED_SETTINGS_HTML_STRING);
    ADVANCED_SETTINGS_HTML_ELS.reverse();
    
    // minified with cssminifier.com
    const ADVANCED_SETTINGS_CSS_STRING = "#rs-ext-advanced-search-bar{width:100%}.rs-ext-toggle-button{width:3em;height:3em;background:#ddd;border:1px solid #000}.rs-ext-toggle-button:hover{background:#fff}button.rs-ext-selected{background:#00008b;color:#fff}button.rs-ext-selected:hover{background:#55d}.rs-ext-left-float{float:left}.rs-ext-right-float{float:right}.rs-ext-shrinkable{transition-property:transform;transition-duration:.3s;transition-timing-function:ease-out;height:auto;background:#ccc;width:100%;transform:scaleY(1);transform-origin:top;overflow:hidden;z-index:10000}.rs-ext-shrinkable>*{margin:10px}#rs-ext-monster,#rs-ext-spell,#rs-ext-trap,#rs-ext-sort{background:rgba(0,0,0,.7)}.rs-ext-shrunk{transform:scaleY(0);z-index:100}#rs-ext-advanced-pop-outs{position:relative}#rs-ext-advanced-pop-outs>.rs-ext-shrinkable{position:absolute;top:0;left:0}#rs-ext-monster-table th,#rs-ext-sort-table th{text-align:right}.rs-ext-table{padding-right:5px}#rs-ext-spacer{height:0;transition:height .3s ease-out}#rs-ext-sort{transition-property:top,transform}.engine-button[disabled],.engine-button:disabled{cursor:not-allowed;background:rgb(50,0,0);color:#a0a0a0;font-style:italic;}.rs-ext-card-entry-table button,.rs-ext-fullwidth-wrapper{width:100%;height:100%;}.rs-ext-card-entry-table{border-collapse:collapse;}.rs-ext-card-entry-table tr,.rs-ext-card-entry-table td{height:100%;}.editor-search-description{white-space:normal;}#editor-menu-spacer{width:15%;}.engine-button{cursor:pointer;}@media (min-width:1600px){.editor-search-result{font-size:1em}.editor-search-card{width:12.5%}.editor-search-banlist-icon{width:5%}.editor-search-result{width:100%}}.rs-ext-table-button{padding:8px;text-align:center;border:1px solid #AAAAAA;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.rs-ext-table-button:active{padding:8px 7px 8px 9px;}.rs-ext-flex{display:flex;width:100%;justify-content:space-between}.rs-ext-flex input{width:48%;}input::placeholder{font-style:italic;text-align:center;}";
    
    // disable default listener (Z.Pb)
    $("#editor-search-text").off("input");
    
    // VOLATILE FUNCTIONS, MAY CHANGE AFTER A MAIN UPDATE
    
    /* reload cards until pendulum hotfix */
    // const CARD_LIST = X;
    const CARD_LIST = {};
    const CardObject = function (a) {
        this.id = a.id;
        this.A = a.als || 0;
        this.za = a.sc || [];
        this.type = a.typ || 0;
        this.attack = a.atk || 0;
        this.i = a.def || 0;
        var b = a.lvl || 0;
        this.race = a.rac || 0;
        this.H = a.att || 0;
        this.level = b & 0xFF;
        this.lscale = (b >> 24) & 0xFF;
        this.rscale = (b >> 16) & 0xFF;
    };
    
    const CARD_LIST_VERSION = 84;
    const readCards = function (a) {
        jQuery.ajaxSetup({
            beforeSend: function(a) {
                a.overrideMimeType && a.overrideMimeType("application/json")
            }
        });
        jQuery.getJSON(h(`data/cards.json?v=${CARD_LIST_VERSION}`), function(b) {
            for (let card of b.cards) {
                CARD_LIST[card.id] = new CardObject(card);
            }
            // NOTE: different request from the above
            jQuery.getJSON(h(`data/cards_en.json?v=${CARD_LIST_VERSION}`), function(b) {
                for (let card of b.texts) {
                    let other = CARD_LIST[card.id];
                    if (other) {
                        other.name = card.n;
                        other.description = card.d;
                        other.ra = card.s || [];
                        other.Z = qa(other.name);
                    }
                }
                if(a) {
                    a();
                }
            })
        })
    };
    
    readCards();
    
    const TYPE_HASH = bg;
    const TYPE_LIST = Object.values(TYPE_HASH);
    
    const ATTRIBUTE_MASK_HASH = Yf;
    
    const ATTRIBUTE_HASH = {};
    for(obfs in ATTRIBUTE_MASK_HASH) {
        let attr = ag[obfs].toUpperCase();
        ATTRIBUTE_HASH[attr] = ATTRIBUTE_MASK_HASH[obfs];
    }
    
    const attributeOf = function (cardObject) {
        return cardObject.H;
    }
    
    const makeSearchable = function (name) {
        return name.replace(/ /g, "")
                   .toUpperCase();
    }
    
    const searchableCardName = function (id_or_card) {
        let card;
        if(typeof id_or_card === "number") {
            card = CARD_LIST[id_or_card];
        }
        else {
            card = id_or_card;
        }
        let searchable = makeSearchable(card.name);
        // cache name
        if(!card.searchName) {
            card.searchName = searchable;
        }
        return searchable;
    }
    
    const monsterType = function (card) {
        return Ef[card.race];
    }
    // U provides a map
    // (a.type & U[c]) => (Vf[U[c]])
    const monsterTypeMap = {};
    for(let key in Wf) {
        let value = Wf[key];
        monsterTypeMap[value] = parseInt(key, 10);
    }
    window.monsterTypeMap = monsterTypeMap;
    
    const allowedCount = function (card) {
        // card.A = the source id (e.g. for alt arts)
        // card.id = the actual id
        return Vf(card.A || card.id);
    }
    const clearVisualSearchOptions = function () {
        return Z.Db();
    }
    const isPlayableCard = function (card) {
        // internally checks U.U - having that bit means its not a playable card
        // (reserved for tokens, it seems)
        return Z.ua(card);
    }
    const sanitizeText = function (text) {
        // qa - converts to uppercase and removes:
        //      newlines, hyphens, spaces, colons, and periods
        return qa(text);
    }
    const cardCompare = function (cardA, cardB) {
        return Z.fa(cardA, cardB);
    }
    const shuffle = function (list) {
        return Z.Nb(list);
    }
    // clears the visual state, allowing editing to take place
    const clearVisualState = function () {
        Z.pa();
    }
    // restores the visual state
    const restoreVisualState = function () {
        Z.ma();
    }
    const lastElement = function (arr) {
        return arr[arr.length - 1];
    }
    // modified from https://stackoverflow.com/a/6969486/4119004
    const escapeRegex = function (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    const previewCard = Cc;
    
    // corresponds to EDIT_LOCATION where save was clicked
    // EXT.EDIT_API.SAVED_INDEX = 0;
    // const saveDeck = function () {
        // Z.Ob();
        // $("#editor-save-button").addClass("engine-button-disabled");
        // $.post("api/update-deck.php", {
            // id: window.Deck.id,
            // deck: JSON.stringify({
                // main: window.Deck.main,
                // extra: window.Deck.extra,
                // side: window.Deck.side
            // })
        // }, function(a) {
            // a.success || "no_changes" === a.error ? $("#editor-save-button").text("Saved!").delay(2E3).queue(function() {
                    // $(this).removeClass("engine-button-disabled").text("Save").dequeue()
                // }) :
                // $("#editor-save-button").text("Error while saving: " + a.error).delay(5E3).queue(function() {
                    // $(this).removeClass("engine-button-disabled").text("Save").dequeue()
                // })
        // }, "json");
    // }
    // EXT.EDIT_API.save = saveDeck;
    // re-attach listener
    // let saveButton = document.getElementById("editor-save-button");
    // $(saveButton).unbind();
    // saveButton.addEventListener("click", saveDeck);
    // capture page beforeunload
    // window.addEventListener("beforeunload", function (ev) {
        // if(EXT.EDIT_API.SAVED_INDEX !== EXT.EDIT_API.EDIT_LOCATION) {
            // ev.preventDefault(); // PREFERED METHOD (not supported universally)
            // return event.returnValue = ""; // deprecated
        // }
        // return null;
    // });
    
    const engineButton = function (content, id = null) {
        let button = makeElement("button", id, content);
        button.classList.add("engine-button", "engine-button-default");
        return button;
    }
    
    // Z.Ba = function() {
        // if(Z.selection) {
            // console.log("tick");
            // Z.selection.css("left", Z.Ib + 3).css("top", Z.Jb + 3);
        // }
    // };
    // reimplements Z.la
    const banlistIcons = {
        3: null,
        2: "banlist-semilimited.png",
        1: "banlist-limited.png",
        0: "banlist-banned.png",
    };
    const addCardToSearchWithButtons = function (cardId) {
        let card = CARD_LIST[cardId];
        let template = $(Z.Lb);
        template.find(".template-name").text(card.name);
        l(template.find(".template-picture"), card.id);
        if (card.type & U.L) {
            template.find(".template-if-spell").remove();
            template.find(".template-level").text(card.level);
            template.find(".template-atk").text(card.attack);
            template.find(".template-def").text(card.i);
            // Df - object indexed by powers of 2 containg *type* information
            // card.race = type
            template.find(".template-race").text(Ef[card.race]);
            // Ef - object indexed by powers of 2 containing *attribute* information
            // card.H = attribute
            template.find(".template-attribute").text(Ff[card.H]);
        }
        else {
            template.find(".template-if-monster").remove();
            var types = [];
            for (let n of Object.values(U)) {
                if(card.type & n) {
                    types.push(Wf[n]);
                }
            }
            template.find(".template-types").text(types.join("|"));
        }
        template.data("id", card.id);
        template.mouseover(function () {
            previewCard($(this).data("id"));
        });
        template.mousedown(function (a) {
            // left mouse - move card to tooltip
            if (1 == a.which) {
                let id = $(this).data("id");
                Z.ya(id);
                return false;
            }
            // right mouse - do nothing (allow contextmenu to trigger)
            if (3 == a.which) {
                return false;
            }
        });
        let addThisCard = function (el, destination = null) {
            let id = $(el).data("id");
            let card = CARD_LIST[id];
            // deduce destination
            if(!destination) {
                destination = "main";
                if (card.type & U.S || card.type & U.T || card.type & U.G || card.type & U.C) {
                    destination = "extra";
                }
            }
            addCard(id, destination, -1);
            return false;
        }
        template.on("contextmenu", function () {
            return addThisCard(this);
        });
        /* BANLIST TOKEN GENERATION */
        var banlistIcon = template.find(".editor-search-banlist-icon");
        let limitStatus = allowedCount(card);
        if(limitStatus !== 3) {
            banlistIcon.attr("src", "assets/images/" + banlistIcons[limitStatus]);
        }
        else {
            banlistIcon.remove();
        }
        let container = $("<table width=100% class=rs-ext-card-entry-table><tr><td width=74%></td><td width=13% class=rs-ext-table-button>Add to Main</td><td width=13% class=rs-ext-table-button>Add to Side</td></tr></table>");
        let [ cardTd, mainTd, sideTd ] = container.find("td");
        
        cardTd.append(...template);
        
        // let mainDeckAdd = engineButton("Add to Main");
        mainTd.addEventListener("click", function () {
            addThisCard(template);
        });
        // mainTd.append(mainDeckAdd);
        
        // let sideDeckAdd = engineButton("Add to Side");
        sideTd.addEventListener("click", function () {
            addThisCard(template, "side");
        });
        // sideTd.append(sideDeckAdd);
        
        Z.xa.append(container);
    }
    
    const addCardToSearch = function (card) {
        // return Z.la(card);
        return addCardToSearchWithButtons(card);
    }
    
    // interaction stuff
    const pluralize = function (noun, count, suffix = "s", base = "") {
        return noun + (count == 1 ? base : suffix);
    }
    
    // card identification stuff
    const isToken               = (card) => card.type & monsterTypeMap["Token"];
    
    const isTrapCard            = (card) => card.type & monsterTypeMap["Trap"];
    const isSpellCard           = (card) => card.type & monsterTypeMap["Spell"];
    const isRitualSpell         = (card) => isSpellCard(card) && (card.type & monsterTypeMap["Ritual"]);
    const isContinuous          = (card) => card.type & monsterTypeMap["Continuous"];
    const isCounter             = (card) => card.type & monsterTypeMap["Counter"];
    const isField               = (card) => card.type & monsterTypeMap["Field"];
    const isEquip               = (card) => card.type & monsterTypeMap["Equip"];
    const isQuickPlay           = (card) => card.type & monsterTypeMap["Quick-Play"];
    const isSpellOrTrap         = (card) => isSpellCard(card) || isTrapCard(card);
    
    const nonNormalSpellTraps   = [isContinuous, isQuickPlay, isField, isCounter, isEquip, isRitualSpell];
    const isNormalSpellOrTrap   = (card) =>
        isSpellOrTrap(card)
        && !nonNormalSpellTraps.some(cond => cond(card));
    
    const isNormalMonster       = (card) => card.type & monsterTypeMap["Normal"];
    const isEffectMonster       = (card) => card.type & monsterTypeMap["Effect"];
    const isMonster             = (card) => !isTrapCard(card) && !isSpellCard(card);
    const isNonEffectMonster    = (card) => !isEffectMonster(card);
    const isFusionMonster       = (card) => card.type & monsterTypeMap["Fusion"];
    const isRitualMonster       = (card) => isMonster(card) && (card.type & monsterTypeMap["Ritual"]);
    const isSynchroMonster      = (card) => card.type & monsterTypeMap["Synchro"];
    const isTunerMonster        = (card) => card.type & monsterTypeMap["Tuner"];
    const isLinkMonster         = (card) => card.type & monsterTypeMap["Link"];
    const isGeminiMonster       = (card) => card.type & monsterTypeMap["Dual"];
    const isToonMonster         = (card) => card.type & monsterTypeMap["Toon"];
    const isFlipMonster         = (card) => card.type & monsterTypeMap["Flip"];
    const isSpiritMonster       = (card) => card.type & monsterTypeMap["Spirit"];
    const isXyzMonster          = (card) => card.type & monsterTypeMap["Xyz"];
    const isPendulumMonster     = (card) => card.type & monsterTypeMap["Pendulum"];
    
    const isExtraDeckMonster = (card) => [
        isFusionMonster,
        isSynchroMonster,
        isXyzMonster,
        isLinkMonster
    ].some(fn => fn(card));
    
    const isLevelMonster = (card) => isMonster(card) && !isLinkMonster(card) && !isXyzMonster(card);
    
    // non-ritual main deck monster
    const isBasicMainDeckMonster  = (card) => isMonster(card) && !isRitualMonster(card) && !isExtraDeckMonster(card);
    
    let kindMap = {
        "TRAP": isTrapCard,
        "SPELL": isSpellCard,
        "MONSTER": isMonster,
        "CONT": isContinuous,
        "CONTINUOUS": isContinuous,
        "COUNTER": isCounter,
        "FIELD": isField,
        "EQUIP": isEquip,
        "QUICK": isQuickPlay,
        "QUICKPLAY": isQuickPlay,
        "NORMAL": isNormalMonster,
        "NORMALST": isNormalSpellOrTrap,
        "EFFECT": isEffectMonster,
        "NONEFF": isNonEffectMonster,
        "NONEFFECT": isNonEffectMonster,
        "FUSION": isFusionMonster,
        "RITUAL": isRitualMonster,
        "RITUALST": isRitualSpell,
        "TUNER": isTunerMonster,
        "LINK": isLinkMonster,
        "SYNC": isSynchroMonster,
        "SYNCHRO": isSynchroMonster,
        "DUAL": isGeminiMonster,
        "GEMINI": isGeminiMonster,
        "TOON": isToonMonster,
        "FLIP": isFlipMonster,
        "SPIRIT": isSpiritMonster,
        "XYZ": isXyzMonster,
        "PENDULUM": isPendulumMonster,
        "PEND": isPendulumMonster,
        "LEVELED": isLevelMonster,
        "EXTRA": isExtraDeckMonster,
    };
    
    
    const allSatisfies = function (tags, card) {
        return tags.every(tag => tag(card));
    }
    
    const defaultSearchOptionState = function () {
        clearVisualSearchOptions();
    };
    
    const displayResults = function () {
        defaultSearchOptionState();
        if(EXT.Search.cache.length !== 0) {
            replaceTextNode(currentPageIndicator, EXT.Search.current_page);
            let startPosition = (EXT.Search.current_page - 1) * EXT.Search.per_page;
            let endPosition = Math.min(
                EXT.Search.cache.length,
                startPosition + EXT.Search.per_page
            );
            for(let i = startPosition; i < endPosition; i++) {
                addCardToSearch(EXT.Search.cache[i].id);
            }
        }
        clearChildren(infoBox);
        for(let container of EXT.Search.messages) {
            let [kind, message] = container;
            let color, symbol;
            switch(kind) {
                case STATUS.ERROR:
                    color = GUI_COLORS.HEADER.FAILURE;
                    symbol = SYMBOLS.ERROR;
                    break;
                
                case STATUS.SUCCESS:
                    color = GUI_COLORS.HEADER.SUCCESS;
                    symbol = SYMBOLS.SUCCESS;
                    break;
                
                case STATUS.NEUTRAL:
                default:
                    color = GUI_COLORS.HEADER.NEUTRAL;
                    symbol = SYMBOLS.INFO;
                    break;
            }
            let symbolElement = document.createElement("span");
            let messageElement = document.createElement("span");
            
            appendTextNode(symbolElement, symbol);
            symbolElement.style.padding = "3px";
            appendTextNode(messageElement, message);
            
            let alignTable = document.createElement("table");
            alignTable.style.backgroundColor = color;
            alignTable.style.padding = "2px";
            alignTable.appendChild(makeElement("tr"));
            alignTable.children[0].appendChild(makeElement("td"));
            alignTable.children[0].children[0].appendChild(symbolElement);
            alignTable.children[0].appendChild(makeElement("td"));
            alignTable.children[0].children[1].appendChild(messageElement);
            
            infoBox.appendChild(alignTable);
        }
    }
    
    const STATUS = { ERROR: 0, NEUTRAL: -1, SUCCESS: 1 };
    const addMessage = function (kind, message) {
        EXT.Search.messages.push([kind, message]);
    }
    
    const initializeMessageContainer = function () {
        EXT.Search.messages = [];
    }
    // gui/dom manipulation stuff
    const clearChildren = function (el) {
        while(el.firstChild) {
            el.removeChild(el.firstChild);
        }
        return true;
    }
    const appendTextNode = function (el, text) {
        let textNode = document.createTextNode(text);
        el.appendChild(textNode);
        return true;
    }
    const makeElement = function (name, id = null, content = null, opts = {}) {
        let el = document.createElement(name);
        if(id !== null) {
            el.id = id;
        }
        if(content !== null) {
            appendTextNode(el, content);
        }
        for(let [key, val] of Object.entries(opts)) {
            el[key] = val;
        }
        return el;
    }
    const HTMLTag = function (tag, id, classes, ...children) {
        let el = makeElement(tag, id);
        if(classes) {
            el.classList.add(...classes);
        }
        for(let child of children) {
            el.appendChild(child);
        }
        return el;
    }
    const replaceTextNode = function (el, newText) {
        clearChildren(el);
        appendTextNode(el, newText);
    }
    const NO_SELECT_PROPERTIES = [
        "-webkit-touch-callout",
        "-webkit-user-select",
        "-khtml-user-select",
        "-moz-user-select",
        "-ms-user-select",
        "user-select",
    ];
    // TODO: select based on browser?
    const noSelect = function (el) {
        NO_SELECT_PROPERTIES.forEach(property => {
            el.style[property] = "none";
        });
    }
    
    const GUI_COLORS = {
        HEADER: {
            NEUTRAL: "rgba(0,   0,   0,   0.7)",
            SUCCESS: "rgba(0,   150, 0,   0.7)",
            FAILURE: "rgba(150, 0,   0,   0.7)"
        }
    };
    const SYMBOLS = {
        SUCCESS: "✔",
        INFO: "🛈",
        ERROR: "⚠",
    };
    
    let styleHeaderNeutral = function (el) {
        el.style.background = GUI_COLORS.HEADER.NEUTRAL;
        el.style.fontSize = "16px";
        el.style.padding = "3px";
        el.style.marginBottom = "10px";
    }
    
    // https://stackoverflow.com/a/30832210/4119004
    const download = function promptSaveFile (data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
    
    /* TODO: allow larger deck sizes */
    
    /*
    let deckSizes = {
        "main":  [   40,    60,   100],
        "extra": [   10,    15,    25],
        "side":  [   10,    15,    25],
    };
    // if length > corresponding cell in deckSizes, pad by this much
    let cardMargins = {
        "main":  [ -3.6, -4.05, -6.00],
        "extra": [ -3.6, -4.05, -6.00],
        "side":  [ -3.6, -4.05, -6.00],
    };
    Z.Aa = function (a) {
        var padding = "0";
        // let 
        if(Z[a].length > ("main" == a ? 80 : 25)) {
            // padding = "main" == a ? "-4.05%" : "-4.72%";
            padding = "-6.0%";
        }
        else if(Z[a].length > ("main" == a ? 60 : 15)) {
            padding = "main" == a ? "-4.05%" : "-4.72%";
        }
        else if(Z[a].length > ("main" == a ? 40 : 10)) {
            padding = "-3.6%";
        }
        if (Z.ha[a] !== padding) {
            Z.ha[a] = padding;
            for (var c = 0; c < Z[a].length; ++c) Z[a][c].css("margin-right", padding);
        }
    },
    */
    
    /* UNDO / REDO */
    // const addCardSilent = Z.O;
    const addCardSilent = function(a, destination, c, d) {
        let card = X[a];
        if (card && !isToken(card)) {
            let toMainDeck = destination === "main";
            let toExtraDeck = destination === "extra";
            let isExtra = isExtraDeckMonster(card);
            let sizeLimit = EXT.DECK_SIZE_LIMIT || toMainDeck ? 60 : 15;
            let isInvalidLocation = (
                   isExtra && toMainDeck
                || !isExtra && toExtraDeck
                || Z[destination].length >= sizeLimit
                // cannot have more than 3 copies!
                || Z.Eb(card.A ? card.A : card.id) >= 3
            );
            
            if (!isInvalidLocation) {
                g = Z[destination];
                var k = $("#editor-" + destination + "-deck");
                d = $("<img>").css("margin-right", Z.ha[destination]).addClass("editor-card-small");
                l(d, a);
                d.mouseover(function() {
                    previewCard($(this).data("id"));
                });
                d.mousedown(function(a) {
                    if (1 == a.which) {
                        a = $(this).data("id");
                        var b = $(this).data("location"),
                            c = $(this).parent().children().index($(this));
                        Z.P(b, c);
                        Z.ya(a);
                        return false
                    }
                    if (3 == a.which) return false
                });
                d.mouseup(function(a) {
                    if (1 == a.which && Z.selection) {
                        a = $(this).data("location");
                        var b = $(this).parent().children().index($(this));
                        addCard(Z.selection.data("id"), a, b);
                        Z.aa();
                        return false
                    }
                });
                d.on("contextmenu", function() {
                    var a = $(this).data("location"),
                        b = $(this).parent().children().index($(this));
                    Z.P(a, b);
                    return false
                });
                d.data("id", a);
                d.data("alias", card.A);
                d.data("location", destination); 
                if(c === -1) {
                    k.append(d);
                    g.push(d);
                }
                else {
                    if(0 === c && 0 == k.children().length) {
                        k.append(d)
                    }
                    else {
                        k.children().eq(c).before(d);
                        g.splice(c, 0, d);
                    };
                }
                g = allowedCount(card);
                3 !== g ? (a = 2 === g ? "banlist-semilimited.png" : 1 === g ? "banlist-limited.png" : "banlist-banned.png", a = $("<img>").attr("src", "assets/images/" + a), d.data("banlist", a), $("#editor-banlist-icons").append(a)) : d.data("banlist", null);
                Z.Aa(destination);
                Z.N(destination)
            }
        }
    };
    const removeCardSilent = Z.P;
    const addCard = function (...args) {
        addCardSilent(...args);
        addEditPoint();
    };
    Z.O = addCard;
    EXT.EDIT_API.addCard = addCard;
    EXT.EDIT_API.addCardSilent = addCardSilent;
    
    const removeCard = function (...args) {
        removeCardSilent(...args);
        addEditPoint();
    };
    Z.P = removeCard;
    EXT.EDIT_API.removeCard = removeCard;
    EXT.EDIT_API.removeCardSilent = removeCardSilent;
    
    const deepCloneArray = function (arr) {
        return arr.map ? arr.map(deepCloneArray) : arr;
    };
    const isRawObject = (obj) => typeof obj === "object";
    const deepEquals = function (left, right) {
        if(left.map && right.map) {
            if(left.length !== right.length) {
                return false;
            }
            return left.every((e, i) => deepEquals(e, right[i]));
        }
        else {
            if(isRawObject(left) && isRawObject(right)) {
                let leftEntries = Object.entries(left).sort();
                let rightEntries = Object.entries(right).sort();
                return deepEquals(leftEntries, rightEntries);
            }
            return left === right;
        }
    };
    const mapIDs = function (arr) {
        return arr.map(e => e.data("id"));
    };
    const currentDeckState = function () {
        return {
            main: mapIDs(Z.main),
            extra: mapIDs(Z.extra),
            side: mapIDs(Z.side)
        };
    }
    const clearLocation = function (location) {
        while(Z[location].length) {
            removeCardSilent(location, 0);
        }
    };
    const clearDeck = function () {
        for (let location of ["main", "extra", "side"]) {
            clearLocation(location);
        }
    };
    
    // for use in undo/redo - replaces the current state with the new state
    /*
               TypeError: Z[c][e].appendTo is not a function engine.min.js:144:115
                ma https://duelingnexus.com/script/engine.min.js?v=187:144
                restoreVisualState debugger eval code:387
                updateDeckState debugger eval code:933
                undo debugger eval code:987

    */
    const updateDeckState = function (newState) {
        let state = currentDeckState();
        clearVisualState();
        overMainExtraSide((contents, location) => {
            if(deepEquals(contents, newState[location])) {
                // console.warn("EXT.EDIT_API.updateDeckState - new and old sections for " + location + " are equal, not updating");
                return;
            }
            clearLocation(location);
            for (let id of newState[location]) {
                addCardSilent(id, location, -1);
            }
        });
        restoreVisualState();
    };
    EXT.EDIT_API.updateDeckState = updateDeckState;
    EXT.EDIT_API.currentDeckState = currentDeckState;
    EXT.EDIT_API.EDIT_HISTORY = [ currentDeckState() ];
    EXT.EDIT_API.EDIT_LOCATION = 0;
    
    const addEditPoint = function () {
        let state = currentDeckState();
        let previousState = lastElement(EXT.EDIT_API.EDIT_HISTORY);
        
        // do not add a duplicate entry
        if(previousState && deepEquals(state, previousState)) {
            return false;
        }
        
        // remove all entries past the current edit location
        if(EXT.EDIT_API.EDIT_LOCATION >= EXT.EDIT_API.EDIT_HISTORY.length) {
            EXT.EDIT_API.EDIT_HISTORY.splice(EXT.EDIT_API.EDIT_LOCATION);
        }
        
        // add the state
        EXT.EDIT_API.EDIT_HISTORY.push(state);
        
        // remove a state from the front if we have too many
        if(EXT.EDIT_API.EDIT_HISTORY.length > EXT.MAX_UNDO_RECORD) {
            EXT.EDIT_API.EDIT_HISTORY.shift();
        }
        
        // update the edit location
        EXT.EDIT_API.EDIT_LOCATION = EXT.EDIT_API.EDIT_HISTORY.length - 1;
        
        // we can no longer redo, but now we can undo
        undoButton.disabled = false;
        redoButton.disabled = true;
        
        return true;
    };
    
    EXT.EDIT_API.addEditPoint = addEditPoint;
    
    const undo = function () {
        // we can't undo if there's nothing behind us
        if(EXT.EDIT_API.EDIT_LOCATION === 0) {
            console.warn("EXT.EDIT_API.undo function failed - nothing to undo!");
            return false;
        }
        
        // we moved back one
        EXT.EDIT_API.EDIT_LOCATION--;
        
        // refresh the deck state
        updateDeckState(EXT.EDIT_API.EDIT_HISTORY[EXT.EDIT_API.EDIT_LOCATION]);
        
        // we can now redo
        redoButton.disabled = false;
        
        // disable the undo button if there is nothing left to undo
        if(EXT.EDIT_API.EDIT_LOCATION === 0) {
            undoButton.disabled = true;
        }
        
        return true;
    }
    EXT.EDIT_API.undo = undo;
    
    const redo = function () {
        // if we're at the front, we can't redo
        if(EXT.EDIT_API.EDIT_LOCATION === EXT.EDIT_API.EDIT_HISTORY.length - 1) {
            console.warn("EXT.EDIT_API.redo function failed - nothing to redo!");
            return false;
        }
        
        // move forward once
        EXT.EDIT_API.EDIT_LOCATION++;
        
        // refresh the deck state
        updateDeckState(EXT.EDIT_API.EDIT_HISTORY[EXT.EDIT_API.EDIT_LOCATION]);
        
        // we can now undo
        undoButton.disabled = false;
        
        // disable the redo button if there is nothing left to redo
        if(EXT.EDIT_API.EDIT_LOCATION === EXT.EDIT_API.EDIT_HISTORY.length - 1) {
            redoButton.disabled = true;
        }
        
        return true;
    }
    EXT.EDIT_API.redo = redo;
    
    /* reimplementing nexus buttons with edit history enabled */
    const clear = function () {
        clearVisualState();
        overMainExtraSide((contents, location) => {
            Z[location] = [];
        });
        restoreVisualState();
        addEditPoint();
    }
    EXT.EDIT_API.clear = clear;
    
    // reset listener for editor's clear button
    let clearButton = document.getElementById("editor-clear-button");
    $(clearButton).unbind();
    clearButton.addEventListener("click", clear);
    
    const overMainExtraSide = function (it) {
        for(let name of ["main", "extra", "side"]) {
            it(Z[name], name);
        }
    };
    
    // sorts everything
    const sort = function () {
        clearVisualState();
        // for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            // var c = a[b];
            // Z[c].sort(function(a, b) {
                // return Z.fa(X[a.data("id")], X[b.data("id")])
            // });
            // Z.N(c);
        // }
        overMainExtraSide((contents, location) => {
            contents.sort((c1, c2) => 
                Z.fa(X[c1.data("id")], X[c2.data("id")])
            );
            Z.N(location);
        });
        restoreVisualState();
        addEditPoint();
    };
    
    // reset listener for editor's sort button
    let sortButton = document.getElementById("editor-sort-button");
    $(sortButton).unbind();
    sortButton.addEventListener("click", sort);
    
    const shuffleAll = function () {
        clearVisualState();
        overMainExtraSide((contents, location) => {
            Z.Nb(contents);
            Z.N(location);
        });
        restoreVisualState();
        addEditPoint();
    }
    
    let shuffleButton = document.getElementById("editor-shuffle-button");
    $(shuffleButton).unbind();
    shuffleButton.addEventListener("click", shuffleAll);
    
    // code for Export readable
    const countIn = function (arr, el) {
        return arr.filter(e => e === el).length;
    }

    const namesOf = function (el) {
        let names = [...el.children].map(e => CARD_LIST[$(e).data("id")].name);
        let uniq = [...new Set(names)];
        return uniq.map(name =>
            `${countIn(names, name)}x ${name}`
        );
    }

    const outputDeck = function () {
        let decks = {
            Main: "editor-main-deck",
            Extra: "editor-extra-deck",
            Side: "editor-side-deck",
        };
        
        return Object.entries(decks).map(([key, value]) =>
            [key + " Deck:", ...namesOf(document.getElementById(value))]
            .join("\n")
        ).join("\n--------------\n");
    }
    
    /* UPDATE PAGE STRUCTURE */
    // add new buttons
    
    let editorMenuContent = document.getElementById("editor-menu-content");
    
    let undoButton = makeElement("button", "rs-ext-editor-export-button", "Undo");
    undoButton.classList.add("engine-button", "engine-button", "engine-button-default");
    appendTextNode(editorMenuContent, " ");
    editorMenuContent.appendChild(undoButton);
    undoButton.disabled = true;
    
    undoButton.addEventListener("click", undo);
    
    let redoButton = makeElement("button", "rs-ext-editor-export-button", "Redo");
    redoButton.classList.add("engine-button", "engine-button", "engine-button-default");
    appendTextNode(editorMenuContent, " ");
    editorMenuContent.appendChild(redoButton);
    redoButton.disabled = true;
    
    redoButton.addEventListener("click", redo);
    
    let exportButton = makeElement("button", "rs-ext-editor-export-button", "Export .ydk");
    exportButton.classList.add("engine-button", "engine-button", "engine-button-default");
    exportButton.title = "Export Saved Version of Deck";
    appendTextNode(editorMenuContent, " ");
    editorMenuContent.appendChild(exportButton);
    
    exportButton.addEventListener("click", function () {
        let lines = [
            "#created by RefinedSearch plugin"
        ];
        for(let kind of ["main", "extra", "side"]) {
            let header = (kind === "side" ? "!" : "#") + kind;
            lines.push(header);
            // TODO: add option to use card.A rather than card.id
            lines.push(...Deck[kind]);
        }
        let message = lines.join("\n");
        download(message, Deck.name + ".ydk", "text");
    });
    
    let exportRawButton = makeElement("button", "rs-ext-editor-export-button", "Export Readable");
    exportRawButton.classList.add("engine-button", "engine-button", "engine-button-default");
    exportRawButton.title = "Export Human Readable Version of Deck";
    appendTextNode(editorMenuContent, " ");
    editorMenuContent.appendChild(exportRawButton);
    
    exportRawButton.addEventListener("click", function () {
        let message = outputDeck();
        download(message, Deck.name + ".txt", "text");
    });
    
    // add options tile
    let optionsArea = makeElement("div", "options-area"); /* USES NEXUS DEFAULT CSS/ID */
    let options = makeElement("button", "rs-ext-options");
    options.classList.add("engine-button", "engine-button", "engine-button-default");
    let cog = makeElement("i");
    cog.classList.add("fa", "fa-cog");
    options.appendChild(cog);
    appendTextNode(options, " Options");
    optionsArea.appendChild(options);
    
    // TODO: implement option toggle area
    // document.body.appendChild(optionsArea);
    
    let optionsWindow; /* USES NEXUS DEFAULT CSS/ID */
    let overflowDeckSizeElement;
    //;
    // makeElement("div", "options-window")
    optionsWindow = HTMLTag("div", "options-window", null,
        HTMLTag("p", null, null,
            overflowDeckSizeElement = makeElement("input", "rs-ext-decksize-overflow", { type: "checkbox" }),
            makeElement("label", null, "Enable deck overflow", { for: overflowDeckSizeElement.id })
        )
    );
    // TODO: add this
    
    // add css
    let rsExtCustomCss = makeElement("style", null, ADVANCED_SETTINGS_CSS_STRING);
    document.head.appendChild(rsExtCustomCss);
    
    let searchText = document.getElementById("editor-search-text");
    
    // info box
    let infoBox = makeElement("div");
    // let infoMessage = makeElement("span", "rs-ext-info-message");
    // infoBox.appendChild(document.createTextNode("🛈 "));
    // infoBox.appendChild(infoMessage);
    
    styleHeaderNeutral(infoBox);
    searchText.parentNode.insertBefore(infoBox, searchText);
    
    // advanced search settings
    for(let el of ADVANCED_SETTINGS_HTML_ELS) {
        searchText.parentNode.insertBefore(el, searchText);
    }
    
    // page navigation bar
    let navigationHolder = makeElement("div", "rs-ext-navigation");
    let leftButton = makeElement("button", "rs-ext-navigate-left", "<");
    let rightButton = makeElement("button", "rs-ext-navigate-right", ">");
    for(let button of [leftButton, rightButton]) {
        button.classList.add("engine-button");
        button.classList.add("engine-button-default");
    }
    leftButton.style.margin = rightButton.style.margin = "5px";
    let pageInfo = makeElement("span", null, "Page ");
    let currentPageIndicator = makeElement("span","rs-ext-current-page", "X");
    let maxPageIndicator = makeElement("span", "rs-ext-max-page", "X");
    pageInfo.appendChild(currentPageIndicator);
    appendTextNode(pageInfo, " of ");
    pageInfo.appendChild(maxPageIndicator);
    
    navigationHolder.appendChild(leftButton);
    navigationHolder.appendChild(pageInfo);
    navigationHolder.appendChild(rightButton);
    
    styleHeaderNeutral(navigationHolder);
    navigationHolder.style.textAlign = "center";
    noSelect(navigationHolder);
    
    searchText.parentNode.insertBefore(navigationHolder, searchText);
    
    // wire event listeners for advanced search settings
    let toggleButtonState = function () {
        let isSelected = this.classList.contains("rs-ext-selected");
        if(isSelected) {
            this.classList.remove("rs-ext-selected");
        }
        else {
            this.classList.add("rs-ext-selected");
        }
        updateSearchContents();
    };
    [...document.querySelectorAll(".rs-ext-toggle-button")].forEach(el => {
        el.addEventListener("click", toggleButtonState.bind(el));
    });
    
    let monsterTab = document.getElementById("rs-ext-monster");
    let spellTab = document.getElementById("rs-ext-spell");
    let trapTab = document.getElementById("rs-ext-trap");
    let sortTab = document.getElementById("rs-ext-sort");
    
    let spacer = document.getElementById("rs-ext-spacer");
    
    // returns `true` if the object is visible, `false` otherwise
    let toggleShrinkable = function (target, state = null) {
        let isShrunk = state;
        if(isShrunk === null) {
            isShrunk = target.classList.contains("rs-ext-shrunk");
        }
        if(isShrunk) {
            spacer.classList.add("rs-ext-activated");
            target.classList.remove("rs-ext-shrunk");
            return true;
        }
        else {
            spacer.classList.remove("rs-ext-activated");
            target.classList.add("rs-ext-shrunk");
            return false;
        }
        // equiv. `return isShrunk;`, changed for clarity
    }
    
    let createToggleOtherListener = function (target, ...others) {
        return function () {
            let wasShrunk = toggleShrinkable(target);
            if(wasShrunk) {
                others.forEach(other => other.classList.add("rs-ext-shrunk"));
            }
            updateSearchContents();
        }
    };
    
    document.getElementById("rs-ext-monster-toggle")
            .addEventListener("click", createToggleOtherListener(monsterTab,  spellTab,   trapTab));
    document.getElementById("rs-ext-spell-toggle")
            .addEventListener("click", createToggleOtherListener(spellTab,    monsterTab, trapTab));
    document.getElementById("rs-ext-trap-toggle")
            .addEventListener("click", createToggleOtherListener(trapTab,     monsterTab, spellTab));
    
    
    document.getElementById("rs-ext-sort-toggle").addEventListener("click", function () {
        toggleShrinkable(sortTab);
    });
    
    const currentSections = function () {
        return [monsterTab, spellTab, trapTab, sortTab].filter(el => !el.classList.contains("rs-ext-shrunk")) || null;
    }
    
    const updatePaddingHeight = function () {
        let sections = currentSections();
        let height = FN.sum(sections.map(section => section.clientHeight));
        spacer.style.height = height + "px";
        // update top position of sort, if necessary
        if(!sortTab.classList.contains("rs-ext-shrunk")) {
            sortTab.style.top = (height - sortTab.clientHeight) + "px";
        }
    }
    let interval = setInterval(updatePaddingHeight, 1);
    console.info("Interval started. ", interval);
    
    const LINK_ARROW_MEANING = {
        "Bottom-Left":      0b000000001,
        "Bottom-Middle":    0b000000010,
        "Bottom-Right":     0b000000100,
        "Center-Left":      0b000001000,
        // "Center-Middle":    0b000010000,
        "Center-Right":     0b000100000,        
        "Top-Left":         0b001000000,
        "Top-Middle":       0b010000000,
        "Top-Right":        0b100000000,
    };
    
    const UNICODE_TO_LINK_NUMBER = {
        "\u2196":   LINK_ARROW_MEANING["Top-Left"],
        "\u2191":   LINK_ARROW_MEANING["Top-Middle"],
        "\u2197":   LINK_ARROW_MEANING["Top-Right"],
        "\u2190":   LINK_ARROW_MEANING["Center-Left"],
        // no center middle
        "\u2192":   LINK_ARROW_MEANING["Center-Right"],
        "\u2199":   LINK_ARROW_MEANING["Bottom-Left"],
        "\u2193":   LINK_ARROW_MEANING["Bottom-Middle"],
        "\u2198":   LINK_ARROW_MEANING["Bottom-Right"],
        
        // meaningless
        "=":        0b0,    
    };
    const convertUnicodeToNumber = function (chr) {
        return UNICODE_TO_LINK_NUMBER[chr] || 0;
    }
    
    const tagStringOf = function (tag, value = null, comp = "") {
        if(value !== null) {
            return "{" + tag + " " + comp + value + "}";
        }
        else {
            return "{" + tag + "}";
        }
    }
    
    // various elements
    const INPUTS_USE_QUOTES = {
        "TYPE": true,
    };
    const MONSTER_INPUTS = {
        ARROWS:     [...document.querySelectorAll(".rs-ext-toggle-button")],
        TYPE:       document.getElementById("rs-ext-monster-type"),
        ATTRIBUTE:  document.getElementById("rs-ext-monster-attribute"),
        LEVEL:      document.getElementById("rs-ext-level"),
        SCALE:      document.getElementById("rs-ext-scale"),
        LIMIT:      document.getElementById("rs-ext-monster-limit"),
        ATK:        document.getElementById("rs-ext-atk"),
        DEF:        document.getElementById("rs-ext-def"),
        CATEGORY:   document.getElementById("rs-ext-monster-category"),
        ABILITY:    document.getElementById("rs-ext-monster-ability"),
    };
    const INPUT_TO_KEYWORD = {
        // ARROWS: "ARROWS",
        TYPE: "TYPE",
        ATTRIBUTE: "ATTR",
        LEVEL: "LEVIND",
        ATK: "ATK",
        DEF: "DEF",
        SCALE: "SCALE",
        LIMIT: "LIMIT",
    };
    const CATEGORY_TO_KEYWORD = {
        // primary
        "Normal": "NORMAL",
        "Effect": "EFFECT",
        "Ritual": "RITUAL",
        "Fusion": "FUSION",
        "Synchro": "SYNC",
        "Xyz": "XYZ",
        "Pendulum": "PEND",
        "Link": "LINK",
        // derived
        "Leveled": "LEVELED",
        "Extra Deck": "EXTRA",
        "Non-Effect": "NONEFF",
        // secondary
        "Flip": "FLIP",
        "Spirit": "SPIRIT",
        "Gemini": "GEMINI",
        "Toon": "TOON",
        "Tuner": "TUNER",
    };
    const CATEGORY_SOURCES = [ "CATEGORY", "ABILITY" ];
    const monsterSectionTags = function () {
        let tagString = "{MONSTER}";
        
        // links
        let selectedArrows = MONSTER_INPUTS.ARROWS.filter(arrow => arrow.classList.contains("rs-ext-selected"));
        let selectedSymbols = selectedArrows.map(arrow => arrow.textContent);
        let bitmaps = selectedSymbols.map(convertUnicodeToNumber);
        let mask = bitmaps.reduce((a, c) => a | c, 0b0);
        
        if(mask) {
            let comp = (selectedSymbols.indexOf("=") !== -1) ? "=" : "&";
            tagString += tagStringOf("ARROWS", mask, comp);
        }
        
        // category
        for(let category of CATEGORY_SOURCES) {
            let value = MONSTER_INPUTS[category].value;
            if(value) {
                let keyword = CATEGORY_TO_KEYWORD[value];
                tagString += tagStringOf(keyword);
            }
        }
        
        for(let [inputName, tagName] of Object.entries(INPUT_TO_KEYWORD)) {
            let inputElement = MONSTER_INPUTS[inputName];
            let value = inputElement.value;
            if(!value) continue;
            if(INPUTS_USE_QUOTES[inputName]) {
                value = '"' + value + '"';
            }
            switch(inputElement.tagName) {
                case "INPUT":
                    tagString += tagStringOf(tagName, value);
                    break;
                case "SELECT":
                    tagString += tagStringOf(tagName, value);
                    break;
                default:
                    console.error("Fatal error: unknown");
                    break;
            }
        }
        
        return tagString;
    }
    
    const SPELL_TRAP_INPUTS = {
        SPELL:       document.getElementById("rs-ext-spell-type"),
        SPELL_LIMIT: document.getElementById("rs-ext-spell-limit"),
        TRAP:        document.getElementById("rs-ext-trap-type"),
        TRAP_LIMIT:  document.getElementById("rs-ext-trap-limit"),
    };
    const SPELL_TO_KEYWORD = {
        "Normal": "NORMALST",
        "Quick-play": "QUICK",
        "Field": "FIELD",
        "Continuous": "CONT",
        "Ritual": "RITUALST",
        "Equip": "EQUIP",
    };
    const spellSectionTags = function () {
        let tagString = "{SPELL}";
        
        let value = SPELL_TRAP_INPUTS.SPELL.value;
        if(value) {
            let keyword = SPELL_TO_KEYWORD[value];
            tagString += tagStringOf(keyword);
        }
        
        let limit = SPELL_TRAP_INPUTS.SPELL_LIMIT.value;
        if(limit) {
            tagString += tagStringOf("LIM", limit);
        }
        
        return tagString;
    };
    
    const TRAP_TO_KEYWORD = {
        "Normal": "NORMALST",
        "Continuous": "CONT",
        "Counter": "COUNTER",
    };
    const trapSectionTags = function () {
        let tagString = "{TRAP}";
        
        let value = SPELL_TRAP_INPUTS.TRAP.value;
        if(value) {
            let keyword = TRAP_TO_KEYWORD[value];
            tagString += tagStringOf(keyword);
        }
        
        let limit = SPELL_TRAP_INPUTS.TRAP_LIMIT.value;
        if(limit) {
            tagString += tagStringOf("LIM", limit);
        }
        
        return tagString;
    }
    
    const generateSearchFilters = function () {
        let tags = "";
        for(let section of currentSections()) {
            switch(section) {
                case monsterTab:
                    tags += monsterSectionTags();
                    break;
                    
                case spellTab:
                    tags += spellSectionTags();
                    break;
                    
                case trapTab:
                    tags += trapSectionTags();
                    break;
                    
                // case null:
                default: 
                    break;
            }
        }
        return tags;
    }
    
    /* main code */
    
    const COMPARATORS = {
        ">":  function (x, y) { return x  >  y; },
        "<":  function (x, y) { return x  <  y; },
        "=":  function (x, y) { return x === y; },
        // used exclusively for masks
        "&":  function (x, y) { return (x & y) == y; },
        // "!":  function (x, y) { return x !== y; },
        "!=": function (x, y) { return x !== y; },
        "<=": function (x, y) { return x  <= y; },
        ">=": function (x, y) { return x  >= y; },
    };
    const generateComparator = function(compIdentifier) {
        let comp = COMPARATORS[compIdentifier];
        if(comp) {
            return comp;
        }
        else {
            return null;
        }
    }
    
    const createKindValidator = function (tagName) {
        tagName = tagName.toUpperCase();
        if(kindMap[tagName]) {
            return kindMap[tagName];
        } else {
            addMessage(STATUS.ERROR, "No such kind tag: " + tagName);
            return null;
        }
    }
    
    const VALIDATOR_ONTO_MAP = {
        "ATK": "attack",
        "DEF": "i",
        "ARROWS": "i",
        "SCALE": "lscale",
    };
    const VALIDATOR_LEVEL_MAP = {
        "LEVEL": isLevelMonster,
        "LV": isLevelMonster,
        "RANK": isXyzMonster,
        "RK": isXyzMonster,
        "LINK": isLinkMonster,
        "LR": isLinkMonster,
        "LI": () => true,
        "LEVIND": () => true,
    };
    
    const initialCapitalize = function (str) {
        return str.replace(/\w+/g, function (word) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
    }
    
    
    // returns a validation function
    /*
     * ALLOWED PARAMETERS:
     * ATK, num - search for atk 
     * DEF, num - search for atk
     * LIM, num - search by limit status (0 = banned, 1 = limited, 2 = semi-limited, 3 = unlimited)
     * LV,  num - search by level indicator
     * LEVEL,RANK,RK,LINK,LR - same for respective type
     *
     *
     * tag {
     *     value: compare to
     *     param: tag name
     *     comp:  functional comparator
     * }
     */
    const createValidator = function (tag) {
        if(VALIDATOR_ONTO_MAP[tag.param]) {
            let value = parseInt(tag.value, 10);
            let prop = VALIDATOR_ONTO_MAP[tag.param];
            return function (cardObject) {
                let objectValue = cardObject[prop];
                if(tag.param === "DEF" && isLinkMonster(cardObject)) {
                    return false;
                }
                if(tag.param === "ARROWS" && !isLinkMonster(cardObject)) {
                    return false;
                }
                if(tag.param === "SCALE" && !isPendulumMonster(cardObject)) {
                    return false;
                }
                return isMonster(cardObject) && tag.comp(objectValue, value);
            };
        }
        else if(VALIDATOR_LEVEL_MAP[tag.param]) {
            let check = VALIDATOR_LEVEL_MAP[tag.param];
            let level = parseInt(tag.value, 10);
            return function (cardObject) {
                return check(cardObject) && tag.comp(cardObject.level, level);
            }
        }
        else if(tag.param === "LIM" || tag.param === "LIMIT") {
            if(/^\d+$/.test(tag.value)) {
                let value = parseInt(tag.value, 10);
                return function (cardObject) {
                    let count = allowedCount(cardObject);
                    return tag.comp(count, value);
                };
            }
            else {
                addMessage(STATUS.ERROR, "Invalid numeral " + tag.value + ", ignoring tag");
                return function () {
                    return true;
                };
            }
        }
        else if(tag.param === "NAME") {
            let sub = sanitizeText(tag.value);
            return function (cardObject) {
                return sanitizeText(cardObject.Z).indexOf(sub) !== -1;
            };
        }
        else if(tag.param === "TYPE") {
            let searchType = initialCapitalize(tag.value);
            if(TYPE_LIST.indexOf(searchType) !== -1) {
                return function (cardObject) {
                    return monsterType(cardObject) == searchType;
                };
            }
            else {
                addMessage(STATUS.ERROR, "Invalid type " + tag.value + ", ignoring tag");
                return function () {
                    return true;
                };
            }
        }
        else if(tag.param === "ATTR" || tag.param === "ATTRIBUTE") {
            let searchAttribute = tag.value.toUpperCase();
            let attributeMask = ATTRIBUTE_HASH[searchAttribute];
            if(attributeMask !== undefined) {
                attributeMask = parseInt(attributeMask, 10);
                return function (cardObject) {
                    return attributeOf(cardObject) === attributeMask;
                };
            }
            else {
                addMessage(STATUS.ERROR, "Invalid attribute " + tag.value + ", ignoring tag");
                return function () {
                    return true;
                };
            }
        }
        else {
            addMessage(STATUS.ERROR, "No such parameter supported: " + tag.param);
            return null;
        }
    }
    
    const ISOLATE_COMPARATOR_REGEX = /^([&=]|[!><]=?)?(.+)/;
    
    // returns 1 or 2 elements
    const isolateComparator = function (str) {
        let [_, comp, rest] = str.match(ISOLATE_COMPARATOR_REGEX);
        return [rest, comp].filter(e => e);
    }
    
    const expressionToPredicate = function (expression, param, defaultComp = "=") {
        let [rest, comp] = isolateComparator(expression);
        comp = comp || defaultComp;
        let fn = generateComparator(comp);
        if(!fn) {
            throw new Error("Invalid comparator: " + comp);
        }
        
        let tag = {
            value: rest,
            param: param.toUpperCase(),
            comp: fn,
        };
        
        return createValidator(tag);
    }
    
    const operatorFunctions = {
        "OR": FN.or,
        "AND": FN.and,
    };
    const operatorNameToFunction = function (opName) {
        let fn = operatorFunctions[opName];
        return fn;
    }

    const textToPredicate = function (text, param) {
        let tokens = SearchInputShunter.parseSections(text);
        let stack = [];
        for(let token of tokens) {
            if(token.type === TokenTypes.EXPRESSION) {
                stack.push(expressionToPredicate(token.raw, param));
            }
            else if(token.type === TokenTypes.OPERATOR) {
                let right = stack.pop();
                let left = stack.pop();
                if(!left || !right) {
                    throw new Error("Insufficient arguments (incomplete input)");
                }
                let fn = operatorNameToFunction(token.raw);
                stack.push(FN.hook(left, fn, right));
            }
        }
        if(stack.length === 0) {
            addMessage(STATUS.ERROR, "Malformed input, not enough tokens.");
            return null;
        }
        return stack.pop();
    }
    
    const compare = (a, b) => (a > b) - (a < b);
    const compareBy = (f, rev = false) =>
        (a, b) => compare(f(a), f(b)) * (rev ? -1 : 1);
    
    // TODO: put traps always at end
    const SORT_BY_COMPARATORS = {
        "Name": compareBy(x => x.name),
        "Level": compareBy(x => x.level),
        "ATK": compareBy(x => x.attack),
        "DEF": compareBy(x => x.i),
        // TODO: sort each sub-strata? e.g. all level 1s by name
        // "Level": compareByAlterantives("level", "name"),
        // "ATK": compareByAlterantives("attack", "name"),
        // "DEF": compareByAlterantives("i", "name"),
    };
    let STRATA_KINDS = {
        LEVELED: [ isLevelMonster, isXyzMonster, isLinkMonster, isSpellCard, isTrapCard ],
        DEFAULT: [ isNormalMonster, isBasicMainDeckMonster, isRitualMonster, isFusionMonster, isSynchroMonster, isXyzMonster, isLinkMonster, isLevelMonster, isSpellCard, isTrapCard ],
    };
    let formStrata = function (list, by = "DEFAULT") {
        let fns = STRATA_KINDS[by];
        let strata = fns.map(e => []);
        for(let card of list) {
            let index = fns.findIndex(fn => fn(card));
            if(index !== -1) {
                strata[index].push(card);
            }
            else {
                console.error("Index not found in strata array", card);
            }
        }
        return strata;
    };
    let sortCardList = function (list, options) {
        let { methods, reverse, stratify, strataKind } = options;
        if(!Array.isArray(methods)) {
            methods = [ methods, "Name", "Level", "ATK", "DEF" ];
        }
        if(stratify) {
            let strata = formStrata(list, strataKind).map(stratum => 
                sortCardList(stratum, {
                    methods: methods,
                    reverse: reverse,
                    stratify: false,
                })
            );
            return [].concat(...strata);
        }
        let cmps = methods.map(method => SORT_BY_COMPARATORS[method]);
        let sorted = list.sort((a, b) => {
            for(let cmp of cmps) {
                let diff = cmp(a, b);
                if(diff !== 0) {
                    return diff;
                }
            }
            return 0;
        });
        if(reverse) {
            sorted.reverse();
        }
        return sorted;
    }
    
    let ensureCompareText = function (card) {
        card.compareText = card.compareText || card.description.toUpperCase();
        return card.compareText;
    };
    let parseInputQuery = function (text) {
        let prepend = "";
        let append = "";
        let inner = text.toString().trim();
        if(inner[0] === "^") {
            prepend = inner[0];
            inner = inner.slice(1);
        }
        if(lastElement(inner) === "$") {
            append = lastElement(inner);
            inner = inner.slice(0, -1);
        }
        inner = escapeRegex(inner);
        inner = inner.replace(/\\\*/g, ".*")
                     .replace(/_/g, ".");
        let compiled = prepend + inner + append;
        return new RegExp(compiled);
    };
    const ISOLATE_TAG_REGEX = /\{(!?)(\w+)([^\{\}]*?)\}/g;
    let updateSearchContents = function () {
        clearVisualSearchOptions();
        initializeMessageContainer();
        // TODO: move sanitation process later in the procedure
        let input = $("#editor-search-text").val();
        let effect = $("#editor-search-effect").val() || "";
        
        // append tags generated by search options
        let extraTags = generateSearchFilters();
        if(extraTags) {
            input += extraTags;
        }
        
        // isolate the tags in the input
        let tags = [];
        input = input.replace(ISOLATE_TAG_REGEX, function (match, isNegation, param, info) {
            // over each tag:
            let validator;
            try {
                if(info) {
                    validator = textToPredicate(info, param);
                }
                else {
                    validator = createKindValidator(param);
                }
            } catch(error) {
                addMessage(STATUS.ERROR, "Problem creating validator: " + error.message);
                return "";
            }
            
            if(validator) {
                if(isNegation) {
                    validator = FN.compose(FN.not, validator);
                }
                tags.push(validator);
            }
            else if(validator !== null) {
                addMessage(STATUS.ERROR, "Invalid validator (bug, please report): " + match);
            }
            
            // remove the tag, replace with nothing
            return "";
        });
        
        // remove any improper tags
        input = input.replace(/\{[^\}]*$/, function (tag) {
            addMessage(STATUS.NEUTRAL, "Removed incomplete tag: " + tag);
            return "";
        });
        
        // needs non-empty input
        if (input.length !== 0 || effect.length !== 0 || tags.length !== 0) {
            let exactMatches = [];
            let fuzzyMatches = [];
            
            let cardId = parseInt(input, 10);
            
            // if the user is searching by ID
            if(!isNaN(cardId)) {
                cardId = CARD_LIST[cardId];
                if(cardId && isPlayableCard(cardId)) {
                    fuzzyMatches.push(cardId);
                }
            }
            
            // only if the user is not searching by a valid ID
            let hasTags = tags.length !== 0;
            let isLongEnough = input.length >= EXT.MIN_INPUT_LENGTH || effect.length >= EXT.MIN_INPUT_LENGTH;
            let isFuzzySearch = hasTags || isLongEnough;
            
            let uppercaseInput = input.toUpperCase();
            let uppercaseText = parseInputQuery(effect.toUpperCase());
            let searchableInput = parseInputQuery(uppercaseInput.replace(/ /g, ""));
            if (0 === fuzzyMatches.length) {
                // for each card ID
                for (var e in CARD_LIST) {
                    let card = CARD_LIST[e];
                    if(!isPlayableCard(card) || !allSatisfies(tags, card)) {
                        continue;
                    }
                    let compareName = searchableCardName(card);
                    if(compareName === searchableInput) {
                        // if the search name is the input, push it
                        exactMatches.push(card);
                    } else if(isFuzzySearch) {
                        ensureCompareText(card);
                        let cardMatchesName = compareName.search(searchableInput) !== -1;
                        let cardMatchesEffect = card.compareText.search(uppercaseText) !== -1;
                        if(cardMatchesName && cardMatchesEffect) {
                            fuzzyMatches.push(card);
                        }
                    }
                }
            }
            
            // sort the results
            let method = $("#rs-ext-sort-by").val();
            let reverseResults = $("#rs-ext-sort-order").val() === "Descending";
            let stratify = document.getElementById("rs-ext-sort-stratify").checked;
            let strataKind;
            if(method === "Level") {
                strataKind = "LEVELED";
                stratify = true;
            }
            let params = {
                methods: method,
                reverse: reverseResults,
                stratify: stratify,
                strataKind: strataKind,
            };
            exactMatches = sortCardList(exactMatches, params);
            fuzzyMatches = sortCardList(fuzzyMatches, params);
            // exactMatches.sort(cardCompare);
            // fuzzyMatches.sort(cardCompare);
            
            // display 
            let totalEntryCount = exactMatches.length + fuzzyMatches.length;
            let displayAmount = Math.min(totalEntryCount, EXT.RESULTS_PER_PAGE);
            if(displayAmount === 0) {
                EXT.Search.cache = [];
                if(isFuzzySearch) {
                    let suggestion;
                    if(hasTags) {
                        suggestion = "Try changing or removing some tags.";
                    }
                    else {
                        suggestion = "Check your spelling and try again.";
                    }
                    if(input.replace(/\W/g, "").toLowerCase() == "sock") {
                        addMessage(STATUS.ERROR, "No results found. If you're looking for me, try Sock#3222 on discord :D");
                    }
                    else {
                        addMessage(STATUS.ERROR, "No results found. " + suggestion);
                    }
                }
                else {
                    addMessage(STATUS.ERROR, "Your input was too short. Try typing in some text or adding some tags.");
                }
            }
            else {
                let cache = exactMatches.concat(fuzzyMatches);
                EXT.Search.cache = cache;
                // RESULTS_PER_PAGE can change between calculations
                EXT.Search.per_page = EXT.RESULTS_PER_PAGE;
                EXT.Search.current_page = 1;
                EXT.Search.max_page = Math.ceil(EXT.Search.cache.length / EXT.Search.per_page);
                
                replaceTextNode(currentPageIndicator, EXT.Search.current_page);
                replaceTextNode(maxPageIndicator, EXT.Search.max_page);
                
                let message = "";
                
                let anyErrors = EXT.Search.messages.some(
                    message => message[0] == STATUS.ERROR
                );
                message += "Search successful";
                if(anyErrors) {
                    message += ", but there were some errors";
                }
                message += ". Found " + totalEntryCount + " ";
                message += pluralize("entr", totalEntryCount, "ies", "y");
                message += " (" + EXT.Search.max_page + " " + pluralize("page", EXT.Search.max_page) + ")";
                addMessage(anyErrors ? STATUS.NEUTRAL : STATUS.SUCCESS, message);
            }
        }
        else {
            EXT.Search.cache = [];
            replaceTextNode(currentPageIndicator, "X");
            replaceTextNode(maxPageIndicator, "X");
            addMessage(STATUS.NEUTRAL, "Please enter a search term to begin.");
        }
        displayResults();
    };
    
    // add new input function
    $("#editor-search-text").on("input", updateSearchContents)
    updateSearchContents();
    
    // add search by effect
    $("#editor-search-text").wrap($("<div class=rs-ext-flex></div>"));
    let searchWrapper = $("#editor-search-text").parent();
    let editorSearchByEffect = $("<input type=text class=engine-text-box id=editor-search-effect></input>");
    searchWrapper.append(editorSearchByEffect);
    editorSearchByEffect.on("input", updateSearchContents);
    
    // update attributes
    $("#editor-search-text").attr("placeholder", "Search by name/query");
    editorSearchByEffect.attr("placeholder", "Search by effect");
    
    // add relevant listeners
    let allInputs = [
        document.querySelectorAll("#rs-ext-monster-table input, #rs-ext-monster-table select"),
        Object.values(SPELL_TRAP_INPUTS),
        document.querySelectorAll("#rs-ext-sort-table input, #rs-ext-sort-table select"),
    ].flat();
    
    for(let input of allInputs) {
        $(input).on("input", updateSearchContents);
    }
    
    let previousPage = function () {
        EXT.Search.current_page = Math.max(1, EXT.Search.current_page - 1);
        displayResults();
    }
    let nextPage = function () {
        EXT.Search.current_page = Math.min(EXT.Search.max_page, EXT.Search.current_page + 1);
        displayResults();
    }
    $(leftButton).on("click", previousPage);
    $(rightButton).on("click", nextPage);
};

let checkStartUp = function () {
    if(Z.xa) {
        onStart();
        // destroy reference; pseudo-closure
        onStart = null;
    }
    else {
        setTimeout(checkStartUp, 100);
    }
}

checkStartUp();