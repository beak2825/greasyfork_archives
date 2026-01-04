// ==UserScript==
// @name         Snowflake SQL Formatter
// @namespace    https://environicsanalytics.ca/
// @version      1.0
// @description  Adds a 'Format SQL' button to Snowflake's console query history details dialog
// @author       robert.macfadyen@environicsanalytics.com
// @license      MIT License
// @match        https://*.snowflakecomputing.com/console
// @icon64       data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439378/Snowflake%20SQL%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/439378/Snowflake%20SQL%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    // Watch for document changes
    //
    (new MutationObserver(Observatory)).observe(document.body, { childList: true });

    //
    // Watch for format sql button clicks
    //
    document.addEventListener('click', FormatSql_OnClick);
})();


function Observatory(mutationRecords) {
    //
    // Only on the query history's page
    //
    if (window.location.hash !== '#/monitoring/queries') {
        return;
    }

    //
    // Check each change for the displaying of a dialog
    //
    mutationRecords.forEach(function(mutation) {
        //
        // Only care when an element has been added
        //
        if (mutation.addedNodes.length === 0) {
            return;
        }

        //
        // Only care about snow-sql-popup div's
        //
        var dialog = mutation.addedNodes[0];
        if (!dialog.classList.contains('snow-sql-popup')) {
            return;
        }

        //
        // Locate the footer
        //
        var footer = dialog.querySelector('.snow-popup-footer .x-box-target');

        var btn = '<a class="x-btn x-unselectable snow-btn-border-all x-box-item x-btn-secondary-small" style="min-width: 100px; margin: 0px; height: 28px; right: 220px; left: auto; top: 0px;" hidefocus="on" unselectable="on" role="button" aria-hidden="false" aria-disabled="false" id="FormatSQL" tabindex="0" >' +
            '<span data-ref="btnWrap" role="presentation" unselectable="on" class="x-btn-wrap x-btn-wrap-secondary-small "><span data-ref="btnEl" role="presentation" unselectable="on" style="height:auto;" class="x-btn-button x-btn-button-secondary-small x-btn-text x-btn-button-center ">' +
            '<span data-ref="btnIconEl" role="presentation" unselectable="on" class="x-btn-icon-el x-btn-icon-el-secondary-small  "></span>' +
            '<span data-ref="btnInnerEl" unselectable="on" class="x-btn-inner x-btn-inner-secondary-small">Format SQL</span>' +
            '</span></span></a>';

        footer.prepend(createElementFromHTML(btn));
    });
}

//
// Create an element from a string
//
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

//
// Format the SQL
//
function FormatSql_OnClick(e) {
    //
    // Only care about clicks on an anchor with id of FormatSQL
    //
    var btn = e.target.tagName === 'A' ? e.target : e.target.closest('A');
    if (!btn || btn.id !== 'FormatSQL') {
        return;
    }

    //
    // Find the code mirror component so we can manipulate the SQL
    //
    var cm = e.target.closest('.snow-sql-popup').querySelector('.CodeMirror');
    if (cm) {
        //
        // Get the current SQL
        //
        cm = cm.CodeMirror;
        var Sql = cm.getValue();
        var Formatted = SqlFormatting.format(Sql);
        cm.setValue(Formatted);
    }
}



// SQLFormatter.js
var SqlFormatting;
(function (SqlFormatting) {
    class Bugger {
    }
    SqlFormatting.Bugger = Bugger;
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    class Zeep {
        constructor() {
            var t = new SqlFormatting.Bugger();
        }
    }
    SqlFormatting.Zeep = Zeep;
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    /**
     * Format whitespace in a query to make it easier to read.
     *
     * @param {String} query
     * @param {Object} cfg
     *  @param {String} cfg.language Query language, default is Standard SQL
     *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
     *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
     *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
     *  @param {Object} cfg.params Collection of params for placeholder replacement
     * @return {String}
     */
    SqlFormatting.format = (query, cfg = {}) => {
        if (typeof query !== 'string') {
            throw new Error('Invalid query argument. Extected string, instead got ' + typeof query);
        }
        const formatters = {
            db2: SqlFormatting.languages.Db2Formatter,
            mariadb: SqlFormatting.languages.MariaDbFormatter,
            mysql: SqlFormatting.languages.MySqlFormatter,
            n1ql: SqlFormatting.languages.N1qlFormatter,
            plsql: SqlFormatting.languages.PlSqlFormatter,
            postgresql: SqlFormatting.languages.PostgreSqlFormatter,
            redshift: SqlFormatting.languages.RedshiftFormatter,
            spark: SqlFormatting.languages.SparkSqlFormatter,
            sql: SqlFormatting.languages.StandardSqlFormatter,
            tsql: SqlFormatting.languages.TSqlFormatter,
        };
        let Formatter = SqlFormatting.languages.StandardSqlFormatter;
        if (cfg.language !== undefined) {
            Formatter = formatters[cfg.language];
        }
        if (Formatter === undefined) {
            throw Error(`Unsupported SQL dialect: ${cfg.language}`);
        }
        return new Formatter(cfg).format(query);
    };
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var utils;
    (function (utils) {
        // Only removes spaces, not newlines
        utils.trimSpacesEnd = (str) => str.replace(/[ \t]+$/u, '');
        // Last element from array
        utils.last = (arr) => arr[arr.length - 1];
        // True array is empty, or it's not an array at all
        utils.isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;
        // Escapes regex special chars
        utils.escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
        // Sorts strings by length, so that longer ones are first
        // Also sorts alphabetically after sorting by length.
        utils.sortByLengthDesc = (strings) => strings.sort((a, b) => {
            return b.length - a.length || a.localeCompare(b);
        });
    })(utils = SqlFormatting.utils || (SqlFormatting.utils = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var core;
    (function (core) {
        class Formatter {
            /**
             * @param {Object} cfg
             *  @param {String} cfg.language
             *  @param {String} cfg.indent
             *  @param {Boolean} cfg.uppercase
             *  @param {Integer} cfg.linesBetweenQueries
             *  @param {Object} cfg.params
             */
            constructor(cfg) {
                this.cfg = cfg;
                this.indentation = new core.Indentation(this.cfg.indent);
                this.inlineBlock = new core.InlineBlock();
                this.params = new core.Params(this.cfg.params);
                this.previousReservedToken = {};
                this.tokens = [];
                this.index = 0;
            }
            /**
             * SQL Tokenizer for this formatter, provided by subclasses.
             */
            tokenizer() {
                throw new Error('tokenizer() not implemented by subclass');
            }
            /**
             * Reprocess and modify a token based on parsed context.
             *
             * @param {Object} token The token to modify
             *  @param {String} token.type
             *  @param {String} token.value
             * @return {Object} new token or the original
             *  @return {String} token.type
             *  @return {String} token.value
             */
            tokenOverride(t) {
                // subclasses can override this to modify tokens during formatting
                return t;
            }
            /**
             * Formats whitespace in a SQL string to make it easier to read.
             *
             * @param {String} query The SQL query string
             * @return {String} formatted query
             */
            format(query) {
                this.tokens = this.tokenizer().tokenize(query);
                const formattedQuery = this.getFormattedQueryFromTokens();
                return formattedQuery.trim();
            }
            getFormattedQueryFromTokens() {
                let formattedQuery = '';
                this.tokens.forEach((t, index) => {
                    this.index = index;
                    t = this.tokenOverride(t);
                    if (t.type === SqlFormatting.TokenHelpers.tokenTypes.LINE_COMMENT) {
                        formattedQuery = this.formatLineComment(t, formattedQuery);
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.BLOCK_COMMENT) {
                        formattedQuery = this.formatBlockComment(t, formattedQuery);
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL) {
                        formattedQuery = this.formatTopLevelReservedWord(t, formattedQuery);
                        this.previousReservedToken = t;
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT) {
                        formattedQuery = this.formatTopLevelReservedWordNoIndent(t, formattedQuery);
                        this.previousReservedToken = t;
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_NEWLINE) {
                        formattedQuery = this.formatNewlineReservedWord(t, formattedQuery);
                        this.previousReservedToken = t;
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED) {
                        formattedQuery = this.formatWithSpaces(t, formattedQuery);
                        this.previousReservedToken = t;
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.OPEN_PAREN) {
                        formattedQuery = this.formatOpeningParentheses(t, formattedQuery);
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.CLOSE_PAREN) {
                        formattedQuery = this.formatClosingParentheses(t, formattedQuery);
                    }
                    else if (t.type === SqlFormatting.TokenHelpers.tokenTypes.PLACEHOLDER) {
                        formattedQuery = this.formatPlaceholder(t, formattedQuery);
                    }
                    else if (t.value === ',') {
                        formattedQuery = this.formatComma(t, formattedQuery);
                    }
                    else if (t.value === ':') {
                        formattedQuery = this.formatWithSpaceAfter(t, formattedQuery);
                    }
                    else if (t.value === '.') {
                        formattedQuery = this.formatWithoutSpaces(t, formattedQuery);
                    }
                    else if (t.value === ';') {
                        formattedQuery = this.formatQuerySeparator(t, formattedQuery);
                    }
                    else {
                        formattedQuery = this.formatWithSpaces(t, formattedQuery);
                    }
                });
                return formattedQuery;
            }
            formatLineComment(t, query) {
                return this.addNewline(query + this.show(t));
            }
            formatBlockComment(t, query) {
                return this.addNewline(this.addNewline(query) + this.indentComment(t.value));
            }
            indentComment(comment) {
                return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
            }
            formatTopLevelReservedWordNoIndent(t, query) {
                this.indentation.decreaseTopLevel();
                query = this.addNewline(query) + this.equalizeWhitespace(this.show(t));
                return this.addNewline(query);
            }
            formatTopLevelReservedWord(t, query) {
                this.indentation.decreaseTopLevel();
                query = this.addNewline(query);
                this.indentation.increaseTopLevel();
                query += this.equalizeWhitespace(this.show(t));
                return this.addNewline(query);
            }
            formatNewlineReservedWord(t, query) {
                if (SqlFormatting.TokenHelpers.isAnd(t) && SqlFormatting.TokenHelpers.isBetween(this.tokenLookBehind(2))) {
                    return this.formatWithSpaces(t, query);
                }
                return this.addNewline(query) + this.equalizeWhitespace(this.show(t)) + ' ';
            }
            // Replace any sequence of whitespace characters with single space
            equalizeWhitespace(string) {
                return string.replace(/\s+/gu, ' ');
            }
            // Opening parentheses increase the block indent level and start a new line
            formatOpeningParentheses(t, query) {
                var _a;
                // Take out the preceding space unless there was whitespace there in the original query
                // or another opening parens or line comment
                const preserveWhitespaceFor = {
                    [SqlFormatting.TokenHelpers.tokenTypes.OPEN_PAREN]: true,
                    [SqlFormatting.TokenHelpers.tokenTypes.LINE_COMMENT]: true,
                    [SqlFormatting.TokenHelpers.tokenTypes.OPERATOR]: true,
                };
                if (t.whitespaceBefore.length === 0 &&
                    !preserveWhitespaceFor[(_a = this.tokenLookBehind()) === null || _a === void 0 ? void 0 : _a.type]) {
                    query = SqlFormatting.utils.trimSpacesEnd(query);
                }
                query += this.show(t);
                this.inlineBlock.beginIfPossible(this.tokens, this.index);
                if (!this.inlineBlock.isActive()) {
                    this.indentation.increaseBlockLevel();
                    query = this.addNewline(query);
                }
                return query;
            }
            // Closing parentheses decrease the block indent level
            formatClosingParentheses(t, query) {
                if (this.inlineBlock.isActive()) {
                    this.inlineBlock.end();
                    return this.formatWithSpaceAfter(t, query);
                }
                else {
                    this.indentation.decreaseBlockLevel();
                    return this.formatWithSpaces(t, this.addNewline(query));
                }
            }
            formatPlaceholder(t, query) {
                return query + this.params.get(t) + ' ';
            }
            // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
            formatComma(t, query) {
                query = SqlFormatting.utils.trimSpacesEnd(query) + this.show(t) + ' ';
                if (this.inlineBlock.isActive()) {
                    return query;
                }
                else if (SqlFormatting.TokenHelpers.isLimit(this.previousReservedToken)) {
                    return query;
                }
                else {
                    return this.addNewline(query);
                }
            }
            formatWithSpaceAfter(t, query) {
                return SqlFormatting.utils.trimSpacesEnd(query) + this.show(t) + ' ';
            }
            formatWithoutSpaces(t, query) {
                return SqlFormatting.utils.trimSpacesEnd(query) + this.show(t);
            }
            formatWithSpaces(t, query) {
                return query + this.show(t) + ' ';
            }
            formatQuerySeparator(t, query) {
                this.indentation.resetIndentation();
                return SqlFormatting.utils.trimSpacesEnd(query) + this.show(t) + '\n'.repeat(this.cfg.linesBetweenQueries || 1);
            }
            // Converts token to string (uppercasing it if needed)
            show({ type, value }) {
                if (this.cfg.uppercase &&
                    (type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED ||
                        type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL ||
                        type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT ||
                        type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_NEWLINE ||
                        type === SqlFormatting.TokenHelpers.tokenTypes.OPEN_PAREN ||
                        type === SqlFormatting.TokenHelpers.tokenTypes.CLOSE_PAREN)) {
                    return value.toUpperCase();
                }
                else {
                    return value;
                }
            }
            addNewline(query) {
                query = SqlFormatting.utils.trimSpacesEnd(query);
                if (!query.endsWith('\n')) {
                    query += '\n';
                }
                return query + this.indentation.getIndent();
            }
            tokenLookBehind(n = 1) {
                return this.tokens[this.index - n];
            }
            tokenLookAhead(n = 1) {
                return this.tokens[this.index + n];
            }
        }
        core.Formatter = Formatter;
    })(core = SqlFormatting.core || (SqlFormatting.core = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var core;
    (function (core) {
        /**
         * Manages indentation levels.
         *
         * There are two types of indentation levels:
         *
         * - BLOCK_LEVEL : increased by open-parenthesis
         * - TOP_LEVEL : increased by RESERVED_TOP_LEVEL words
         */
        class Indentation {
            /**
             * @param {String} indent Indent value, default is "  " (2 spaces)
             */
            constructor(indent) {
                this.INDENT_TYPE_TOP_LEVEL = 'top-level';
                this.INDENT_TYPE_BLOCK_LEVEL = 'block-level';
                this.indent = indent || '  ';
                this.indentTypes = [];
            }
            /**
             * Returns current indentation string.
             * @return {String}
             */
            getIndent() {
                return this.indent.repeat(this.indentTypes.length);
            }
            /**
             * Increases indentation by one top-level indent.
             */
            increaseTopLevel() {
                this.indentTypes.push(this.INDENT_TYPE_TOP_LEVEL);
            }
            /**
             * Increases indentation by one block-level indent.
             */
            increaseBlockLevel() {
                this.indentTypes.push(this.INDENT_TYPE_BLOCK_LEVEL);
            }
            /**
             * Decreases indentation by one top-level indent.
             * Does nothing when the previous indent is not top-level.
             */
            decreaseTopLevel() {
                if (this.indentTypes.length > 0 && SqlFormatting.utils.last(this.indentTypes) === this.INDENT_TYPE_TOP_LEVEL) {
                    this.indentTypes.pop();
                }
            }
            /**
             * Decreases indentation by one block-level indent.
             * If there are top-level indents within the block-level indent,
             * throws away these as well.
             */
            decreaseBlockLevel() {
                while (this.indentTypes.length > 0) {
                    const type = this.indentTypes.pop();
                    if (type !== this.INDENT_TYPE_TOP_LEVEL) {
                        break;
                    }
                }
            }
            resetIndentation() {
                this.indentTypes = [];
            }
        }
        core.Indentation = Indentation;
    })(core = SqlFormatting.core || (SqlFormatting.core = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var core;
    (function (core) {
        const INLINE_MAX_LENGTH = 50;
        /**
         * Bookkeeper for inline blocks.
         *
         * Inline blocks are parenthized expressions that are shorter than INLINE_MAX_LENGTH.
         * These blocks are formatted on a single line, unlike longer parenthized
         * expressions where open-parenthesis causes newline and increase of indentation.
         */
        class InlineBlock {
            constructor() {
                this.level = 0;
            }
            /**
             * Begins inline block when lookahead through upcoming tokens determines
             * that the block would be smaller than INLINE_MAX_LENGTH.
             * @param  {Object[]} tokens Array of all tokens
             * @param  {Number} index Current token position
             */
            beginIfPossible(tokens, index) {
                if (this.level === 0 && this.isInlineBlock(tokens, index)) {
                    this.level = 1;
                }
                else if (this.level > 0) {
                    this.level++;
                }
                else {
                    this.level = 0;
                }
            }
            /**
             * Finishes current inline block.
             * There might be several nested ones.
             */
            end() {
                this.level--;
            }
            /**
             * True when inside an inline block
             * @return {Boolean}
             */
            isActive() {
                return this.level > 0;
            }
            // Check if this should be an inline parentheses block
            // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
            isInlineBlock(tokens, index) {
                let length = 0;
                let level = 0;
                for (let i = index; i < tokens.length; i++) {
                    const token = tokens[i];
                    length += token.value.length;
                    // Overran max length
                    if (length > INLINE_MAX_LENGTH) {
                        return false;
                    }
                    if (token.type === SqlFormatting.TokenHelpers.tokenTypes.OPEN_PAREN) {
                        level++;
                    }
                    else if (token.type === SqlFormatting.TokenHelpers.tokenTypes.CLOSE_PAREN) {
                        level--;
                        if (level === 0) {
                            return true;
                        }
                    }
                    if (this.isForbiddenToken(token)) {
                        return false;
                    }
                }
                return false;
            }
            // Reserved words that cause newlines, comments and semicolons
            // are not allowed inside inline parentheses block
            isForbiddenToken({ type, value }) {
                return (type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL ||
                    type === SqlFormatting.TokenHelpers.tokenTypes.RESERVED_NEWLINE ||
                    type === SqlFormatting.TokenHelpers.tokenTypes.LINE_COMMENT ||
                    type === SqlFormatting.TokenHelpers.tokenTypes.BLOCK_COMMENT ||
                    value === ';');
            }
        }
        core.InlineBlock = InlineBlock;
    })(core = SqlFormatting.core || (SqlFormatting.core = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var core;
    (function (core) {
        /**
         * Handles placeholder replacement with given params.
         */
        class Params {
            /**
             * @param {Object} params
             */
            constructor(params) {
                this.index = 0;
                this.params = params;
            }
            /**
             * Returns param value that matches given placeholder with param key.
             * @param {Object} token
             *   @param {String} token.key Placeholder key
             *   @param {String} token.value Placeholder value
             * @return {String} param or token.value when params are missing
             */
            get({ key, value }) {
                if (!this.params) {
                    return value;
                }
                if (key) {
                    return this.params[key];
                }
                return this.params[this.index++];
            }
        }
        core.Params = Params;
    })(core = SqlFormatting.core || (SqlFormatting.core = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var core;
    (function (core) {
        class Tokenizer {
            /**
             * @param {Object} cfg
             *  @param {String[]} cfg.reservedWords Reserved words in SQL
             *  @param {String[]} cfg.reservedTopLevelWords Words that are set to new line separately
             *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
             *  @param {String[]} cfg.reservedTopLevelWordsNoIndent Words that are top level but have no indentation
             *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
             *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
             *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
             *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
             *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
             *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
             *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
             *  @param {String[]} [cfg.operator] Additional operators to recognize
             */
            constructor(cfg) {
                this.WHITESPACE_REGEX = /^(\s+)/u;
                this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?([eE]-?[0-9]+(\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u;
                this.OPERATOR_REGEX = SqlFormatting.regexFactory.createOperatorRegex([
                    '<>',
                    '<=',
                    '>=',
                    ...(cfg.operators || []),
                ]);
                this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/u;
                this.LINE_COMMENT_REGEX = SqlFormatting.regexFactory.createLineCommentRegex(cfg.lineCommentTypes);
                this.RESERVED_TOP_LEVEL_REGEX = SqlFormatting.regexFactory.createReservedWordRegex(cfg.reservedTopLevelWords);
                this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX = SqlFormatting.regexFactory.createReservedWordRegex(cfg.reservedTopLevelWordsNoIndent);
                this.RESERVED_NEWLINE_REGEX = SqlFormatting.regexFactory.createReservedWordRegex(cfg.reservedNewlineWords);
                this.RESERVED_PLAIN_REGEX = SqlFormatting.regexFactory.createReservedWordRegex(cfg.reservedWords);
                this.WORD_REGEX = SqlFormatting.regexFactory.createWordRegex(cfg.specialWordChars);
                this.STRING_REGEX = SqlFormatting.regexFactory.createStringRegex(cfg.stringTypes);
                this.OPEN_PAREN_REGEX = SqlFormatting.regexFactory.createParenRegex(cfg.openParens);
                this.CLOSE_PAREN_REGEX = SqlFormatting.regexFactory.createParenRegex(cfg.closeParens);
                this.INDEXED_PLACEHOLDER_REGEX = SqlFormatting.regexFactory.createPlaceholderRegex(cfg.indexedPlaceholderTypes, '[0-9]*');
                this.IDENT_NAMED_PLACEHOLDER_REGEX = SqlFormatting.regexFactory.createPlaceholderRegex(cfg.namedPlaceholderTypes, '[a-zA-Z0-9._$]+');
                this.STRING_NAMED_PLACEHOLDER_REGEX = SqlFormatting.regexFactory.createPlaceholderRegex(cfg.namedPlaceholderTypes, SqlFormatting.regexFactory.createStringPattern(cfg.stringTypes));
            }
            /**
             * Takes a SQL string and breaks it into tokens.
             * Each token is an object with type and value.
             *
             * @param {String} input The SQL string
             * @return {Object[]} tokens An array of tokens.
             *  @return {String} token.type
             *  @return {String} token.value
             *  @return {String} token.whitespaceBefore Preceding whitespace
             */
            tokenize(input) {
                const tokens = [];
                let t;
                // Keep processing the string until it is empty
                while (input.length) {
                    // grab any preceding whitespace
                    const whitespaceBefore = this.getWhitespace(input);
                    input = input.substring(whitespaceBefore.length);
                    if (input.length) {
                        // Get the next token and the token type
                        var t2 = this.getNextToken(input, t);
                        console.log('next token', t2);
                        // Advance the string
                        input = input.substring(t2.value.length);
                        tokens.push(Object.assign(Object.assign({}, t2), { whitespaceBefore }));
                    }
                }
                return tokens;
            }
            getWhitespace(input) {
                const matches = input.match(this.WHITESPACE_REGEX);
                return matches ? matches[1] : '';
            }
            getNextToken(input, previousToken) {
                return (this.getCommentToken(input) ||
                    this.getStringToken(input) ||
                    this.getOpenParenToken(input) ||
                    this.getCloseParenToken(input) ||
                    this.getPlaceholderToken(input) ||
                    this.getNumberToken(input) ||
                    this.getReservedWordToken(input, previousToken) ||
                    this.getWordToken(input) ||
                    this.getOperatorToken(input));
            }
            getCommentToken(input) {
                return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
            }
            getLineCommentToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.LINE_COMMENT,
                    regex: this.LINE_COMMENT_REGEX,
                });
            }
            getBlockCommentToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.BLOCK_COMMENT,
                    regex: this.BLOCK_COMMENT_REGEX,
                });
            }
            getStringToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.STRING,
                    regex: this.STRING_REGEX,
                });
            }
            getOpenParenToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.OPEN_PAREN,
                    regex: this.OPEN_PAREN_REGEX,
                });
            }
            getCloseParenToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.CLOSE_PAREN,
                    regex: this.CLOSE_PAREN_REGEX,
                });
            }
            getPlaceholderToken(input) {
                return (this.getIdentNamedPlaceholderToken(input) ||
                    this.getStringNamedPlaceholderToken(input) ||
                    this.getIndexedPlaceholderToken(input));
            }
            getIdentNamedPlaceholderToken(input) {
                return this.getPlaceholderTokenWithKey({
                    input,
                    regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
                    parseKey: (v) => v.slice(1),
                });
            }
            getStringNamedPlaceholderToken(input) {
                return this.getPlaceholderTokenWithKey({
                    input,
                    regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
                    parseKey: (v) => this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
                });
            }
            getIndexedPlaceholderToken(input) {
                return this.getPlaceholderTokenWithKey({
                    input,
                    regex: this.INDEXED_PLACEHOLDER_REGEX,
                    parseKey: (v) => v.slice(1),
                });
            }
            getPlaceholderTokenWithKey({ input, regex, parseKey }) {
                const t = this.getTokenOnFirstMatch({ input, regex, type: SqlFormatting.TokenHelpers.tokenTypes.PLACEHOLDER });
                if (t) {
                    t.key = parseKey(t.value);
                }
                return t;
            }
            getEscapedPlaceholderKey({ key, quoteChar }) {
                return key.replace(new RegExp(SqlFormatting.utils.escapeRegExp('\\' + quoteChar), 'gu'), quoteChar);
            }
            // Decimal, binary, or hex numbers
            getNumberToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.NUMBER,
                    regex: this.NUMBER_REGEX,
                });
            }
            // Punctuation and symbols
            getOperatorToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.OPERATOR,
                    regex: this.OPERATOR_REGEX,
                });
            }
            getReservedWordToken(input, previousToken) {
                // A reserved word cannot be preceded by a "."
                // this makes it so in "mytable.from", "from" is not considered a reserved word
                if (previousToken && previousToken.value && previousToken.value === '.') {
                    return undefined;
                }
                return (this.getTopLevelReservedToken(input) ||
                    this.getNewlineReservedToken(input) ||
                    this.getTopLevelReservedTokenNoIndent(input) ||
                    this.getPlainReservedToken(input));
            }
            getTopLevelReservedToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL,
                    regex: this.RESERVED_TOP_LEVEL_REGEX,
                });
            }
            getNewlineReservedToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.RESERVED_NEWLINE,
                    regex: this.RESERVED_NEWLINE_REGEX,
                });
            }
            getTopLevelReservedTokenNoIndent(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT,
                    regex: this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX,
                });
            }
            getPlainReservedToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.RESERVED,
                    regex: this.RESERVED_PLAIN_REGEX,
                });
            }
            getWordToken(input) {
                return this.getTokenOnFirstMatch({
                    input,
                    type: SqlFormatting.TokenHelpers.tokenTypes.WORD,
                    regex: this.WORD_REGEX,
                });
            }
            getTokenOnFirstMatch({ input, type, regex }) {
                const matches = input.match(regex);
                console.log('getTokenOnFirstMatch', input, regex, matches, matches ? matches[1] : "no match");
                return matches ? { type, value: matches[1], key: null } : undefined;
            }
        }
        core.Tokenizer = Tokenizer;
    })(core = SqlFormatting.core || (SqlFormatting.core = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var regexFactory;
    (function (regexFactory) {
        function createOperatorRegex(multiLetterOperators) {
            return new RegExp(`^(${SqlFormatting.utils.sortByLengthDesc(multiLetterOperators).map(SqlFormatting.utils.escapeRegExp).join('|')}|.)`, 'u');
        }
        regexFactory.createOperatorRegex = createOperatorRegex;
        function createLineCommentRegex(lineCommentTypes) {
            return new RegExp(`^((?:${lineCommentTypes.map((c) => SqlFormatting.utils.escapeRegExp(c)).join('|')}).*?)(?:\r\n|\r|\n|$)`, 'u');
        }
        regexFactory.createLineCommentRegex = createLineCommentRegex;
        function createReservedWordRegex(reservedWords) {
            if (reservedWords.length === 0) {
                return new RegExp(`^\b$`, 'u');
            }
            const reservedWordsPattern = SqlFormatting.utils.sortByLengthDesc(reservedWords).join('|').replace(/ /gu, '\\s+');
            return new RegExp(`^(${reservedWordsPattern})\\b`, 'iu');
        }
        regexFactory.createReservedWordRegex = createReservedWordRegex;
        function createWordRegex(specialChars = []) {
            return new RegExp(`^([\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}${specialChars.join('')}]+)`, 'u');
        }
        regexFactory.createWordRegex = createWordRegex;
        function createStringRegex(stringTypes) {
            return new RegExp('^(' + createStringPattern(stringTypes) + ')', 'u');
        }
        regexFactory.createStringRegex = createStringRegex;
        // This enables the following string patterns:
        // 1. backtick quoted string using `` to escape
        // 2. square bracket quoted string (SQL Server) using ]] to escape
        // 3. double quoted string using "" or \" to escape
        // 4. single quoted string using '' or \' to escape
        // 5. national character quoted string using N'' or N\' to escape
        // 6. Unicode single-quoted string using \' to escape
        // 7. Unicode double-quoted string using \" to escape
        // 8. PostgreSQL dollar-quoted strings
        function createStringPattern(stringTypes) {
            const patterns = {
                '``': '((`[^`]*($|`))+)',
                '{}': '((\\{[^\\}]*($|\\}))+)',
                '[]': '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)',
                '""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
                "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
                "N''": "((N'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
                "U&''": "((U&'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
                'U&""': '((U&"[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
                $$: '((?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$))',
            };
            return stringTypes.map((t) => patterns[t]).join('|');
        }
        regexFactory.createStringPattern = createStringPattern;
        function createParenRegex(parens) {
            return new RegExp('^(' + parens.map(escapeParen).join('|') + ')', 'iu');
        }
        regexFactory.createParenRegex = createParenRegex;
        function escapeParen(paren) {
            if (paren.length === 1) {
                // A single punctuation character
                return SqlFormatting.utils.escapeRegExp(paren);
            }
            else {
                // longer word
                return '\\b' + paren + '\\b';
            }
        }
        function createPlaceholderRegex(types, pattern) {
            if (SqlFormatting.utils.isEmpty(types)) {
                return false;
            }
            const typesRegex = types.map(SqlFormatting.utils.escapeRegExp).join('|');
            return new RegExp(`^((?:${typesRegex})(?:${pattern}))`, 'u');
        }
        regexFactory.createPlaceholderRegex = createPlaceholderRegex;
    })(regexFactory = SqlFormatting.regexFactory || (SqlFormatting.regexFactory = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var TokenHelpers;
    (function (TokenHelpers) {
        let tokenTypes;
        (function (tokenTypes) {
            tokenTypes[tokenTypes["WORD"] = 0] = "WORD";
            tokenTypes[tokenTypes["STRING"] = 1] = "STRING";
            tokenTypes[tokenTypes["RESERVED"] = 2] = "RESERVED";
            tokenTypes[tokenTypes["RESERVED_TOP_LEVEL"] = 3] = "RESERVED_TOP_LEVEL";
            tokenTypes[tokenTypes["RESERVED_TOP_LEVEL_NO_INDENT"] = 4] = "RESERVED_TOP_LEVEL_NO_INDENT";
            tokenTypes[tokenTypes["RESERVED_NEWLINE"] = 5] = "RESERVED_NEWLINE";
            tokenTypes[tokenTypes["OPERATOR"] = 6] = "OPERATOR";
            tokenTypes[tokenTypes["OPEN_PAREN"] = 7] = "OPEN_PAREN";
            tokenTypes[tokenTypes["CLOSE_PAREN"] = 8] = "CLOSE_PAREN";
            tokenTypes[tokenTypes["LINE_COMMENT"] = 9] = "LINE_COMMENT";
            tokenTypes[tokenTypes["BLOCK_COMMENT"] = 10] = "BLOCK_COMMENT";
            tokenTypes[tokenTypes["NUMBER"] = 11] = "NUMBER";
            tokenTypes[tokenTypes["PLACEHOLDER"] = 12] = "PLACEHOLDER";
        })(tokenTypes = TokenHelpers.tokenTypes || (TokenHelpers.tokenTypes = {}));
        ;
        const isToken = (type, regex) => (t) => (t === null || t === void 0 ? void 0 : t.type) === type && regex.test(t === null || t === void 0 ? void 0 : t.value);
        TokenHelpers.isAnd = isToken(tokenTypes.RESERVED_NEWLINE, /^AND$/iu);
        TokenHelpers.isBetween = isToken(tokenTypes.RESERVED, /^BETWEEN$/iu);
        TokenHelpers.isLimit = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^LIMIT$/iu);
        TokenHelpers.isSet = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^SET$/iu);
        TokenHelpers.isBy = isToken(tokenTypes.RESERVED, /^BY$/iu);
        TokenHelpers.isWindow = isToken(tokenTypes.RESERVED_TOP_LEVEL, /^WINDOW$/iu);
        TokenHelpers.isEnd = isToken(tokenTypes.CLOSE_PAREN, /^END$/iu);
    })(TokenHelpers = SqlFormatting.TokenHelpers || (SqlFormatting.TokenHelpers = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        // For reference: https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_72/db2/rbafzintro.htm
        class Db2Formatter extends SqlFormatting.core.Formatter {
            constructor() {
                super(...arguments);
                this.reservedWords = [
                    'ABS',
                    'ACTIVATE',
                    'ALIAS',
                    'ALL',
                    'ALLOCATE',
                    'ALLOW',
                    'ALTER',
                    'ANY',
                    'ARE',
                    'ARRAY',
                    'AS',
                    'ASC',
                    'ASENSITIVE',
                    'ASSOCIATE',
                    'ASUTIME',
                    'ASYMMETRIC',
                    'AT',
                    'ATOMIC',
                    'ATTRIBUTES',
                    'AUDIT',
                    'AUTHORIZATION',
                    'AUX',
                    'AUXILIARY',
                    'AVG',
                    'BEFORE',
                    'BEGIN',
                    'BETWEEN',
                    'BIGINT',
                    'BINARY',
                    'BLOB',
                    'BOOLEAN',
                    'BOTH',
                    'BUFFERPOOL',
                    'BY',
                    'CACHE',
                    'CALL',
                    'CALLED',
                    'CAPTURE',
                    'CARDINALITY',
                    'CASCADED',
                    'CASE',
                    'CAST',
                    'CCSID',
                    'CEIL',
                    'CEILING',
                    'CHAR',
                    'CHARACTER',
                    'CHARACTER_LENGTH',
                    'CHAR_LENGTH',
                    'CHECK',
                    'CLOB',
                    'CLONE',
                    'CLOSE',
                    'CLUSTER',
                    'COALESCE',
                    'COLLATE',
                    'COLLECT',
                    'COLLECTION',
                    'COLLID',
                    'COLUMN',
                    'COMMENT',
                    'COMMIT',
                    'CONCAT',
                    'CONDITION',
                    'CONNECT',
                    'CONNECTION',
                    'CONSTRAINT',
                    'CONTAINS',
                    'CONTINUE',
                    'CONVERT',
                    'CORR',
                    'CORRESPONDING',
                    'COUNT',
                    'COUNT_BIG',
                    'COVAR_POP',
                    'COVAR_SAMP',
                    'CREATE',
                    'CROSS',
                    'CUBE',
                    'CUME_DIST',
                    'CURRENT',
                    'CURRENT_DATE',
                    'CURRENT_DEFAULT_TRANSFORM_GROUP',
                    'CURRENT_LC_CTYPE',
                    'CURRENT_PATH',
                    'CURRENT_ROLE',
                    'CURRENT_SCHEMA',
                    'CURRENT_SERVER',
                    'CURRENT_TIME',
                    'CURRENT_TIMESTAMP',
                    'CURRENT_TIMEZONE',
                    'CURRENT_TRANSFORM_GROUP_FOR_TYPE',
                    'CURRENT_USER',
                    'CURSOR',
                    'CYCLE',
                    'DATA',
                    'DATABASE',
                    'DATAPARTITIONNAME',
                    'DATAPARTITIONNUM',
                    'DATE',
                    'DAY',
                    'DAYS',
                    'DB2GENERAL',
                    'DB2GENRL',
                    'DB2SQL',
                    'DBINFO',
                    'DBPARTITIONNAME',
                    'DBPARTITIONNUM',
                    'DEALLOCATE',
                    'DEC',
                    'DECIMAL',
                    'DECLARE',
                    'DEFAULT',
                    'DEFAULTS',
                    'DEFINITION',
                    'DELETE',
                    'DENSERANK',
                    'DENSE_RANK',
                    'DEREF',
                    'DESCRIBE',
                    'DESCRIPTOR',
                    'DETERMINISTIC',
                    'DIAGNOSTICS',
                    'DISABLE',
                    'DISALLOW',
                    'DISCONNECT',
                    'DISTINCT',
                    'DO',
                    'DOCUMENT',
                    'DOUBLE',
                    'DROP',
                    'DSSIZE',
                    'DYNAMIC',
                    'EACH',
                    'EDITPROC',
                    'ELEMENT',
                    'ELSE',
                    'ELSEIF',
                    'ENABLE',
                    'ENCODING',
                    'ENCRYPTION',
                    'END',
                    'END-EXEC',
                    'ENDING',
                    'ERASE',
                    'ESCAPE',
                    'EVERY',
                    'EXCEPTION',
                    'EXCLUDING',
                    'EXCLUSIVE',
                    'EXEC',
                    'EXECUTE',
                    'EXISTS',
                    'EXIT',
                    'EXP',
                    'EXPLAIN',
                    'EXTENDED',
                    'EXTERNAL',
                    'EXTRACT',
                    'FALSE',
                    'FENCED',
                    'FETCH',
                    'FIELDPROC',
                    'FILE',
                    'FILTER',
                    'FINAL',
                    'FIRST',
                    'FLOAT',
                    'FLOOR',
                    'FOR',
                    'FOREIGN',
                    'FREE',
                    'FULL',
                    'FUNCTION',
                    'FUSION',
                    'GENERAL',
                    'GENERATED',
                    'GET',
                    'GLOBAL',
                    'GOTO',
                    'GRANT',
                    'GRAPHIC',
                    'GROUP',
                    'GROUPING',
                    'HANDLER',
                    'HASH',
                    'HASHED_VALUE',
                    'HINT',
                    'HOLD',
                    'HOUR',
                    'HOURS',
                    'IDENTITY',
                    'IF',
                    'IMMEDIATE',
                    'IN',
                    'INCLUDING',
                    'INCLUSIVE',
                    'INCREMENT',
                    'INDEX',
                    'INDICATOR',
                    'INDICATORS',
                    'INF',
                    'INFINITY',
                    'INHERIT',
                    'INNER',
                    'INOUT',
                    'INSENSITIVE',
                    'INSERT',
                    'INT',
                    'INTEGER',
                    'INTEGRITY',
                    'INTERSECTION',
                    'INTERVAL',
                    'INTO',
                    'IS',
                    'ISOBID',
                    'ISOLATION',
                    'ITERATE',
                    'JAR',
                    'JAVA',
                    'KEEP',
                    'KEY',
                    'LABEL',
                    'LANGUAGE',
                    'LARGE',
                    'LATERAL',
                    'LC_CTYPE',
                    'LEADING',
                    'LEAVE',
                    'LEFT',
                    'LIKE',
                    'LINKTYPE',
                    'LN',
                    'LOCAL',
                    'LOCALDATE',
                    'LOCALE',
                    'LOCALTIME',
                    'LOCALTIMESTAMP',
                    'LOCATOR',
                    'LOCATORS',
                    'LOCK',
                    'LOCKMAX',
                    'LOCKSIZE',
                    'LONG',
                    'LOOP',
                    'LOWER',
                    'MAINTAINED',
                    'MATCH',
                    'MATERIALIZED',
                    'MAX',
                    'MAXVALUE',
                    'MEMBER',
                    'MERGE',
                    'METHOD',
                    'MICROSECOND',
                    'MICROSECONDS',
                    'MIN',
                    'MINUTE',
                    'MINUTES',
                    'MINVALUE',
                    'MOD',
                    'MODE',
                    'MODIFIES',
                    'MODULE',
                    'MONTH',
                    'MONTHS',
                    'MULTISET',
                    'NAN',
                    'NATIONAL',
                    'NATURAL',
                    'NCHAR',
                    'NCLOB',
                    'NEW',
                    'NEW_TABLE',
                    'NEXTVAL',
                    'NO',
                    'NOCACHE',
                    'NOCYCLE',
                    'NODENAME',
                    'NODENUMBER',
                    'NOMAXVALUE',
                    'NOMINVALUE',
                    'NONE',
                    'NOORDER',
                    'NORMALIZE',
                    'NORMALIZED',
                    'NOT',
                    'NULL',
                    'NULLIF',
                    'NULLS',
                    'NUMERIC',
                    'NUMPARTS',
                    'OBID',
                    'OCTET_LENGTH',
                    'OF',
                    'OFFSET',
                    'OLD',
                    'OLD_TABLE',
                    'ON',
                    'ONLY',
                    'OPEN',
                    'OPTIMIZATION',
                    'OPTIMIZE',
                    'OPTION',
                    'ORDER',
                    'OUT',
                    'OUTER',
                    'OVER',
                    'OVERLAPS',
                    'OVERLAY',
                    'OVERRIDING',
                    'PACKAGE',
                    'PADDED',
                    'PAGESIZE',
                    'PARAMETER',
                    'PART',
                    'PARTITION',
                    'PARTITIONED',
                    'PARTITIONING',
                    'PARTITIONS',
                    'PASSWORD',
                    'PATH',
                    'PERCENTILE_CONT',
                    'PERCENTILE_DISC',
                    'PERCENT_RANK',
                    'PIECESIZE',
                    'PLAN',
                    'POSITION',
                    'POWER',
                    'PRECISION',
                    'PREPARE',
                    'PREVVAL',
                    'PRIMARY',
                    'PRIQTY',
                    'PRIVILEGES',
                    'PROCEDURE',
                    'PROGRAM',
                    'PSID',
                    'PUBLIC',
                    'QUERY',
                    'QUERYNO',
                    'RANGE',
                    'RANK',
                    'READ',
                    'READS',
                    'REAL',
                    'RECOVERY',
                    'RECURSIVE',
                    'REF',
                    'REFERENCES',
                    'REFERENCING',
                    'REFRESH',
                    'REGR_AVGX',
                    'REGR_AVGY',
                    'REGR_COUNT',
                    'REGR_INTERCEPT',
                    'REGR_R2',
                    'REGR_SLOPE',
                    'REGR_SXX',
                    'REGR_SXY',
                    'REGR_SYY',
                    'RELEASE',
                    'RENAME',
                    'REPEAT',
                    'RESET',
                    'RESIGNAL',
                    'RESTART',
                    'RESTRICT',
                    'RESULT',
                    'RESULT_SET_LOCATOR',
                    'RETURN',
                    'RETURNS',
                    'REVOKE',
                    'RIGHT',
                    'ROLE',
                    'ROLLBACK',
                    'ROLLUP',
                    'ROUND_CEILING',
                    'ROUND_DOWN',
                    'ROUND_FLOOR',
                    'ROUND_HALF_DOWN',
                    'ROUND_HALF_EVEN',
                    'ROUND_HALF_UP',
                    'ROUND_UP',
                    'ROUTINE',
                    'ROW',
                    'ROWNUMBER',
                    'ROWS',
                    'ROWSET',
                    'ROW_NUMBER',
                    'RRN',
                    'RUN',
                    'SAVEPOINT',
                    'SCHEMA',
                    'SCOPE',
                    'SCRATCHPAD',
                    'SCROLL',
                    'SEARCH',
                    'SECOND',
                    'SECONDS',
                    'SECQTY',
                    'SECURITY',
                    'SENSITIVE',
                    'SEQUENCE',
                    'SESSION',
                    'SESSION_USER',
                    'SIGNAL',
                    'SIMILAR',
                    'SIMPLE',
                    'SMALLINT',
                    'SNAN',
                    'SOME',
                    'SOURCE',
                    'SPECIFIC',
                    'SPECIFICTYPE',
                    'SQL',
                    'SQLEXCEPTION',
                    'SQLID',
                    'SQLSTATE',
                    'SQLWARNING',
                    'SQRT',
                    'STACKED',
                    'STANDARD',
                    'START',
                    'STARTING',
                    'STATEMENT',
                    'STATIC',
                    'STATMENT',
                    'STAY',
                    'STDDEV_POP',
                    'STDDEV_SAMP',
                    'STOGROUP',
                    'STORES',
                    'STYLE',
                    'SUBMULTISET',
                    'SUBSTRING',
                    'SUM',
                    'SUMMARY',
                    'SYMMETRIC',
                    'SYNONYM',
                    'SYSFUN',
                    'SYSIBM',
                    'SYSPROC',
                    'SYSTEM',
                    'SYSTEM_USER',
                    'TABLE',
                    'TABLESAMPLE',
                    'TABLESPACE',
                    'THEN',
                    'TIME',
                    'TIMESTAMP',
                    'TIMEZONE_HOUR',
                    'TIMEZONE_MINUTE',
                    'TO',
                    'TRAILING',
                    'TRANSACTION',
                    'TRANSLATE',
                    'TRANSLATION',
                    'TREAT',
                    'TRIGGER',
                    'TRIM',
                    'TRUE',
                    'TRUNCATE',
                    'TYPE',
                    'UESCAPE',
                    'UNDO',
                    'UNIQUE',
                    'UNKNOWN',
                    'UNNEST',
                    'UNTIL',
                    'UPPER',
                    'USAGE',
                    'USER',
                    'USING',
                    'VALIDPROC',
                    'VALUE',
                    'VARCHAR',
                    'VARIABLE',
                    'VARIANT',
                    'VARYING',
                    'VAR_POP',
                    'VAR_SAMP',
                    'VCAT',
                    'VERSION',
                    'VIEW',
                    'VOLATILE',
                    'VOLUMES',
                    'WHEN',
                    'WHENEVER',
                    'WHILE',
                    'WIDTH_BUCKET',
                    'WINDOW',
                    'WITH',
                    'WITHIN',
                    'WITHOUT',
                    'WLM',
                    'WRITE',
                    'XMLELEMENT',
                    'XMLEXISTS',
                    'XMLNAMESPACES',
                    'YEAR',
                    'YEARS',
                ];
                this.reservedTopLevelWords = [
                    'ADD',
                    'AFTER',
                    'ALTER COLUMN',
                    'ALTER TABLE',
                    'DELETE FROM',
                    'EXCEPT',
                    'FETCH FIRST',
                    'FROM',
                    'GROUP BY',
                    'GO',
                    'HAVING',
                    'INSERT INTO',
                    'INTERSECT',
                    'LIMIT',
                    'ORDER BY',
                    'SELECT',
                    'SET CURRENT SCHEMA',
                    'SET SCHEMA',
                    'SET',
                    'UPDATE',
                    'VALUES',
                    'WHERE',
                ];
                this.reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
                this.reservedNewlineWords = [
                    'AND',
                    'OR',
                    // joins
                    'JOIN',
                    'INNER JOIN',
                    'LEFT JOIN',
                    'LEFT OUTER JOIN',
                    'RIGHT JOIN',
                    'RIGHT OUTER JOIN',
                    'FULL JOIN',
                    'FULL OUTER JOIN',
                    'CROSS JOIN',
                    'NATURAL JOIN',
                ];
            }
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords: this.reservedWords,
                    reservedTopLevelWords: this.reservedTopLevelWords,
                    reservedNewlineWords: this.reservedNewlineWords,
                    reservedTopLevelWordsNoIndent: this.reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "''", '``', '[]'],
                    openParens: ['('],
                    closeParens: [')'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: [':'],
                    lineCommentTypes: ['--'],
                    specialWordChars: ['#', '@'],
                    operators: ['**', '!=', '!>', '!>', '||'],
                });
            }
        }
        languages.Db2Formatter = Db2Formatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'ACCESSIBLE',
            'ADD',
            'ALL',
            'ALTER',
            'ANALYZE',
            'AND',
            'AS',
            'ASC',
            'ASENSITIVE',
            'BEFORE',
            'BETWEEN',
            'BIGINT',
            'BINARY',
            'BLOB',
            'BOTH',
            'BY',
            'CALL',
            'CASCADE',
            'CASE',
            'CHANGE',
            'CHAR',
            'CHARACTER',
            'CHECK',
            'COLLATE',
            'COLUMN',
            'CONDITION',
            'CONSTRAINT',
            'CONTINUE',
            'CONVERT',
            'CREATE',
            'CROSS',
            'CURRENT_DATE',
            'CURRENT_ROLE',
            'CURRENT_TIME',
            'CURRENT_TIMESTAMP',
            'CURRENT_USER',
            'CURSOR',
            'DATABASE',
            'DATABASES',
            'DAY_HOUR',
            'DAY_MICROSECOND',
            'DAY_MINUTE',
            'DAY_SECOND',
            'DEC',
            'DECIMAL',
            'DECLARE',
            'DEFAULT',
            'DELAYED',
            'DELETE',
            'DESC',
            'DESCRIBE',
            'DETERMINISTIC',
            'DISTINCT',
            'DISTINCTROW',
            'DIV',
            'DO_DOMAIN_IDS',
            'DOUBLE',
            'DROP',
            'DUAL',
            'EACH',
            'ELSE',
            'ELSEIF',
            'ENCLOSED',
            'ESCAPED',
            'EXCEPT',
            'EXISTS',
            'EXIT',
            'EXPLAIN',
            'FALSE',
            'FETCH',
            'FLOAT',
            'FLOAT4',
            'FLOAT8',
            'FOR',
            'FORCE',
            'FOREIGN',
            'FROM',
            'FULLTEXT',
            'GENERAL',
            'GRANT',
            'GROUP',
            'HAVING',
            'HIGH_PRIORITY',
            'HOUR_MICROSECOND',
            'HOUR_MINUTE',
            'HOUR_SECOND',
            'IF',
            'IGNORE',
            'IGNORE_DOMAIN_IDS',
            'IGNORE_SERVER_IDS',
            'IN',
            'INDEX',
            'INFILE',
            'INNER',
            'INOUT',
            'INSENSITIVE',
            'INSERT',
            'INT',
            'INT1',
            'INT2',
            'INT3',
            'INT4',
            'INT8',
            'INTEGER',
            'INTERSECT',
            'INTERVAL',
            'INTO',
            'IS',
            'ITERATE',
            'JOIN',
            'KEY',
            'KEYS',
            'KILL',
            'LEADING',
            'LEAVE',
            'LEFT',
            'LIKE',
            'LIMIT',
            'LINEAR',
            'LINES',
            'LOAD',
            'LOCALTIME',
            'LOCALTIMESTAMP',
            'LOCK',
            'LONG',
            'LONGBLOB',
            'LONGTEXT',
            'LOOP',
            'LOW_PRIORITY',
            'MASTER_HEARTBEAT_PERIOD',
            'MASTER_SSL_VERIFY_SERVER_CERT',
            'MATCH',
            'MAXVALUE',
            'MEDIUMBLOB',
            'MEDIUMINT',
            'MEDIUMTEXT',
            'MIDDLEINT',
            'MINUTE_MICROSECOND',
            'MINUTE_SECOND',
            'MOD',
            'MODIFIES',
            'NATURAL',
            'NOT',
            'NO_WRITE_TO_BINLOG',
            'NULL',
            'NUMERIC',
            'ON',
            'OPTIMIZE',
            'OPTION',
            'OPTIONALLY',
            'OR',
            'ORDER',
            'OUT',
            'OUTER',
            'OUTFILE',
            'OVER',
            'PAGE_CHECKSUM',
            'PARSE_VCOL_EXPR',
            'PARTITION',
            'POSITION',
            'PRECISION',
            'PRIMARY',
            'PROCEDURE',
            'PURGE',
            'RANGE',
            'READ',
            'READS',
            'READ_WRITE',
            'REAL',
            'RECURSIVE',
            'REF_SYSTEM_ID',
            'REFERENCES',
            'REGEXP',
            'RELEASE',
            'RENAME',
            'REPEAT',
            'REPLACE',
            'REQUIRE',
            'RESIGNAL',
            'RESTRICT',
            'RETURN',
            'RETURNING',
            'REVOKE',
            'RIGHT',
            'RLIKE',
            'ROWS',
            'SCHEMA',
            'SCHEMAS',
            'SECOND_MICROSECOND',
            'SELECT',
            'SENSITIVE',
            'SEPARATOR',
            'SET',
            'SHOW',
            'SIGNAL',
            'SLOW',
            'SMALLINT',
            'SPATIAL',
            'SPECIFIC',
            'SQL',
            'SQLEXCEPTION',
            'SQLSTATE',
            'SQLWARNING',
            'SQL_BIG_RESULT',
            'SQL_CALC_FOUND_ROWS',
            'SQL_SMALL_RESULT',
            'SSL',
            'STARTING',
            'STATS_AUTO_RECALC',
            'STATS_PERSISTENT',
            'STATS_SAMPLE_PAGES',
            'STRAIGHT_JOIN',
            'TABLE',
            'TERMINATED',
            'THEN',
            'TINYBLOB',
            'TINYINT',
            'TINYTEXT',
            'TO',
            'TRAILING',
            'TRIGGER',
            'TRUE',
            'UNDO',
            'UNION',
            'UNIQUE',
            'UNLOCK',
            'UNSIGNED',
            'UPDATE',
            'USAGE',
            'USE',
            'USING',
            'UTC_DATE',
            'UTC_TIME',
            'UTC_TIMESTAMP',
            'VALUES',
            'VARBINARY',
            'VARCHAR',
            'VARCHARACTER',
            'VARYING',
            'WHEN',
            'WHERE',
            'WHILE',
            'WINDOW',
            'WITH',
            'WRITE',
            'XOR',
            'YEAR_MONTH',
            'ZEROFILL',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'ALTER COLUMN',
            'ALTER TABLE',
            'DELETE FROM',
            'EXCEPT',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'LIMIT',
            'ORDER BY',
            'SELECT',
            'SET',
            'UPDATE',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'UNION', 'UNION ALL'];
        const reservedNewlineWords = [
            'AND',
            'ELSE',
            'OR',
            'WHEN',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
            // non-standard joins
            'STRAIGHT_JOIN',
            'NATURAL LEFT JOIN',
            'NATURAL LEFT OUTER JOIN',
            'NATURAL RIGHT JOIN',
            'NATURAL RIGHT OUTER JOIN',
        ];
        // For reference: https://mariadb.com/kb/en/sql-statements-structure/
        class MariaDbFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: ['``', "''", '""'],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: [],
                    lineCommentTypes: ['--', '#'],
                    specialWordChars: ['@'],
                    operators: [':=', '<<', '>>', '!=', '<>', '<=>', '&&', '||'],
                });
            }
        }
        languages.MariaDbFormatter = MariaDbFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'ACCESSIBLE',
            'ADD',
            'ALL',
            'ALTER',
            'ANALYZE',
            'AND',
            'AS',
            'ASC',
            'ASENSITIVE',
            'BEFORE',
            'BETWEEN',
            'BIGINT',
            'BINARY',
            'BLOB',
            'BOTH',
            'BY',
            'CALL',
            'CASCADE',
            'CASE',
            'CHANGE',
            'CHAR',
            'CHARACTER',
            'CHECK',
            'COLLATE',
            'COLUMN',
            'CONDITION',
            'CONSTRAINT',
            'CONTINUE',
            'CONVERT',
            'CREATE',
            'CROSS',
            'CUBE',
            'CUME_DIST',
            'CURRENT_DATE',
            'CURRENT_TIME',
            'CURRENT_TIMESTAMP',
            'CURRENT_USER',
            'CURSOR',
            'DATABASE',
            'DATABASES',
            'DAY_HOUR',
            'DAY_MICROSECOND',
            'DAY_MINUTE',
            'DAY_SECOND',
            'DEC',
            'DECIMAL',
            'DECLARE',
            'DEFAULT',
            'DELAYED',
            'DELETE',
            'DENSE_RANK',
            'DESC',
            'DESCRIBE',
            'DETERMINISTIC',
            'DISTINCT',
            'DISTINCTROW',
            'DIV',
            'DOUBLE',
            'DROP',
            'DUAL',
            'EACH',
            'ELSE',
            'ELSEIF',
            'EMPTY',
            'ENCLOSED',
            'ESCAPED',
            'EXCEPT',
            'EXISTS',
            'EXIT',
            'EXPLAIN',
            'FALSE',
            'FETCH',
            'FIRST_VALUE',
            'FLOAT',
            'FLOAT4',
            'FLOAT8',
            'FOR',
            'FORCE',
            'FOREIGN',
            'FROM',
            'FULLTEXT',
            'FUNCTION',
            'GENERATED',
            'GET',
            'GRANT',
            'GROUP',
            'GROUPING',
            'GROUPS',
            'HAVING',
            'HIGH_PRIORITY',
            'HOUR_MICROSECOND',
            'HOUR_MINUTE',
            'HOUR_SECOND',
            'IF',
            'IGNORE',
            'IN',
            'INDEX',
            'INFILE',
            'INNER',
            'INOUT',
            'INSENSITIVE',
            'INSERT',
            'INT',
            'INT1',
            'INT2',
            'INT3',
            'INT4',
            'INT8',
            'INTEGER',
            'INTERVAL',
            'INTO',
            'IO_AFTER_GTIDS',
            'IO_BEFORE_GTIDS',
            'IS',
            'ITERATE',
            'JOIN',
            'JSON_TABLE',
            'KEY',
            'KEYS',
            'KILL',
            'LAG',
            'LAST_VALUE',
            'LATERAL',
            'LEAD',
            'LEADING',
            'LEAVE',
            'LEFT',
            'LIKE',
            'LIMIT',
            'LINEAR',
            'LINES',
            'LOAD',
            'LOCALTIME',
            'LOCALTIMESTAMP',
            'LOCK',
            'LONG',
            'LONGBLOB',
            'LONGTEXT',
            'LOOP',
            'LOW_PRIORITY',
            'MASTER_BIND',
            'MASTER_SSL_VERIFY_SERVER_CERT',
            'MATCH',
            'MAXVALUE',
            'MEDIUMBLOB',
            'MEDIUMINT',
            'MEDIUMTEXT',
            'MIDDLEINT',
            'MINUTE_MICROSECOND',
            'MINUTE_SECOND',
            'MOD',
            'MODIFIES',
            'NATURAL',
            'NOT',
            'NO_WRITE_TO_BINLOG',
            'NTH_VALUE',
            'NTILE',
            'NULL',
            'NUMERIC',
            'OF',
            'ON',
            'OPTIMIZE',
            'OPTIMIZER_COSTS',
            'OPTION',
            'OPTIONALLY',
            'OR',
            'ORDER',
            'OUT',
            'OUTER',
            'OUTFILE',
            'OVER',
            'PARTITION',
            'PERCENT_RANK',
            'PRECISION',
            'PRIMARY',
            'PROCEDURE',
            'PURGE',
            'RANGE',
            'RANK',
            'READ',
            'READS',
            'READ_WRITE',
            'REAL',
            'RECURSIVE',
            'REFERENCES',
            'REGEXP',
            'RELEASE',
            'RENAME',
            'REPEAT',
            'REPLACE',
            'REQUIRE',
            'RESIGNAL',
            'RESTRICT',
            'RETURN',
            'REVOKE',
            'RIGHT',
            'RLIKE',
            'ROW',
            'ROWS',
            'ROW_NUMBER',
            'SCHEMA',
            'SCHEMAS',
            'SECOND_MICROSECOND',
            'SELECT',
            'SENSITIVE',
            'SEPARATOR',
            'SET',
            'SHOW',
            'SIGNAL',
            'SMALLINT',
            'SPATIAL',
            'SPECIFIC',
            'SQL',
            'SQLEXCEPTION',
            'SQLSTATE',
            'SQLWARNING',
            'SQL_BIG_RESULT',
            'SQL_CALC_FOUND_ROWS',
            'SQL_SMALL_RESULT',
            'SSL',
            'STARTING',
            'STORED',
            'STRAIGHT_JOIN',
            'SYSTEM',
            'TABLE',
            'TERMINATED',
            'THEN',
            'TINYBLOB',
            'TINYINT',
            'TINYTEXT',
            'TO',
            'TRAILING',
            'TRIGGER',
            'TRUE',
            'UNDO',
            'UNION',
            'UNIQUE',
            'UNLOCK',
            'UNSIGNED',
            'UPDATE',
            'USAGE',
            'USE',
            'USING',
            'UTC_DATE',
            'UTC_TIME',
            'UTC_TIMESTAMP',
            'VALUES',
            'VARBINARY',
            'VARCHAR',
            'VARCHARACTER',
            'VARYING',
            'VIRTUAL',
            'WHEN',
            'WHERE',
            'WHILE',
            'WINDOW',
            'WITH',
            'WRITE',
            'XOR',
            'YEAR_MONTH',
            'ZEROFILL',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'ALTER COLUMN',
            'ALTER TABLE',
            'DELETE FROM',
            'EXCEPT',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'LIMIT',
            'ORDER BY',
            'SELECT',
            'SET',
            'UPDATE',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'UNION', 'UNION ALL'];
        const reservedNewlineWords = [
            'AND',
            'ELSE',
            'OR',
            'WHEN',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
            // non-standard joins
            'STRAIGHT_JOIN',
            'NATURAL LEFT JOIN',
            'NATURAL LEFT OUTER JOIN',
            'NATURAL RIGHT JOIN',
            'NATURAL RIGHT OUTER JOIN',
        ];
        class MySqlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: ['``', "''", '""'],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: [],
                    lineCommentTypes: ['--', '#'],
                    specialWordChars: ['@'],
                    operators: [':=', '<<', '>>', '!=', '<>', '<=>', '&&', '||', '->', '->>'],
                });
            }
        }
        languages.MySqlFormatter = MySqlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'ALL',
            'ALTER',
            'ANALYZE',
            'AND',
            'ANY',
            'ARRAY',
            'AS',
            'ASC',
            'BEGIN',
            'BETWEEN',
            'BINARY',
            'BOOLEAN',
            'BREAK',
            'BUCKET',
            'BUILD',
            'BY',
            'CALL',
            'CASE',
            'CAST',
            'CLUSTER',
            'COLLATE',
            'COLLECTION',
            'COMMIT',
            'CONNECT',
            'CONTINUE',
            'CORRELATE',
            'COVER',
            'CREATE',
            'DATABASE',
            'DATASET',
            'DATASTORE',
            'DECLARE',
            'DECREMENT',
            'DELETE',
            'DERIVED',
            'DESC',
            'DESCRIBE',
            'DISTINCT',
            'DO',
            'DROP',
            'EACH',
            'ELEMENT',
            'ELSE',
            'END',
            'EVERY',
            'EXCEPT',
            'EXCLUDE',
            'EXECUTE',
            'EXISTS',
            'EXPLAIN',
            'FALSE',
            'FETCH',
            'FIRST',
            'FLATTEN',
            'FOR',
            'FORCE',
            'FROM',
            'FUNCTION',
            'GRANT',
            'GROUP',
            'GSI',
            'HAVING',
            'IF',
            'IGNORE',
            'ILIKE',
            'IN',
            'INCLUDE',
            'INCREMENT',
            'INDEX',
            'INFER',
            'INLINE',
            'INNER',
            'INSERT',
            'INTERSECT',
            'INTO',
            'IS',
            'JOIN',
            'KEY',
            'KEYS',
            'KEYSPACE',
            'KNOWN',
            'LAST',
            'LEFT',
            'LET',
            'LETTING',
            'LIKE',
            'LIMIT',
            'LSM',
            'MAP',
            'MAPPING',
            'MATCHED',
            'MATERIALIZED',
            'MERGE',
            'MISSING',
            'NAMESPACE',
            'NEST',
            'NOT',
            'NULL',
            'NUMBER',
            'OBJECT',
            'OFFSET',
            'ON',
            'OPTION',
            'OR',
            'ORDER',
            'OUTER',
            'OVER',
            'PARSE',
            'PARTITION',
            'PASSWORD',
            'PATH',
            'POOL',
            'PREPARE',
            'PRIMARY',
            'PRIVATE',
            'PRIVILEGE',
            'PROCEDURE',
            'PUBLIC',
            'RAW',
            'REALM',
            'REDUCE',
            'RENAME',
            'RETURN',
            'RETURNING',
            'REVOKE',
            'RIGHT',
            'ROLE',
            'ROLLBACK',
            'SATISFIES',
            'SCHEMA',
            'SELECT',
            'SELF',
            'SEMI',
            'SET',
            'SHOW',
            'SOME',
            'START',
            'STATISTICS',
            'STRING',
            'SYSTEM',
            'THEN',
            'TO',
            'TRANSACTION',
            'TRIGGER',
            'TRUE',
            'TRUNCATE',
            'UNDER',
            'UNION',
            'UNIQUE',
            'UNKNOWN',
            'UNNEST',
            'UNSET',
            'UPDATE',
            'UPSERT',
            'USE',
            'USER',
            'USING',
            'VALIDATE',
            'VALUE',
            'VALUED',
            'VALUES',
            'VIA',
            'VIEW',
            'WHEN',
            'WHERE',
            'WHILE',
            'WITH',
            'WITHIN',
            'WORK',
            'XOR',
        ];
        const reservedTopLevelWords = [
            'DELETE FROM',
            'EXCEPT ALL',
            'EXCEPT',
            'EXPLAIN DELETE FROM',
            'EXPLAIN UPDATE',
            'EXPLAIN UPSERT',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INFER',
            'INSERT INTO',
            'LET',
            'LIMIT',
            'MERGE',
            'NEST',
            'ORDER BY',
            'PREPARE',
            'SELECT',
            'SET CURRENT SCHEMA',
            'SET SCHEMA',
            'SET',
            'UNNEST',
            'UPDATE',
            'UPSERT',
            'USE KEYS',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
        const reservedNewlineWords = [
            'AND',
            'OR',
            'XOR',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
        ];
        // For reference: http://docs.couchbase.com.s3-website-us-west-1.amazonaws.com/server/6.0/n1ql/n1ql-language-reference/index.html
        class N1qlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "''", '``'],
                    openParens: ['(', '[', '{'],
                    closeParens: [')', ']', '}'],
                    namedPlaceholderTypes: ['$'],
                    lineCommentTypes: ['#', '--'],
                    operators: ['==', '!='],
                });
            }
        }
        languages.N1qlFormatter = N1qlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'A',
            'ACCESSIBLE',
            'AGENT',
            'AGGREGATE',
            'ALL',
            'ALTER',
            'ANY',
            'ARRAY',
            'AS',
            'ASC',
            'AT',
            'ATTRIBUTE',
            'AUTHID',
            'AVG',
            'BETWEEN',
            'BFILE_BASE',
            'BINARY_INTEGER',
            'BINARY',
            'BLOB_BASE',
            'BLOCK',
            'BODY',
            'BOOLEAN',
            'BOTH',
            'BOUND',
            'BREADTH',
            'BULK',
            'BY',
            'BYTE',
            'C',
            'CALL',
            'CALLING',
            'CASCADE',
            'CASE',
            'CHAR_BASE',
            'CHAR',
            'CHARACTER',
            'CHARSET',
            'CHARSETFORM',
            'CHARSETID',
            'CHECK',
            'CLOB_BASE',
            'CLONE',
            'CLOSE',
            'CLUSTER',
            'CLUSTERS',
            'COALESCE',
            'COLAUTH',
            'COLLECT',
            'COLUMNS',
            'COMMENT',
            'COMMIT',
            'COMMITTED',
            'COMPILED',
            'COMPRESS',
            'CONNECT',
            'CONSTANT',
            'CONSTRUCTOR',
            'CONTEXT',
            'CONTINUE',
            'CONVERT',
            'COUNT',
            'CRASH',
            'CREATE',
            'CREDENTIAL',
            'CURRENT',
            'CURRVAL',
            'CURSOR',
            'CUSTOMDATUM',
            'DANGLING',
            'DATA',
            'DATE_BASE',
            'DATE',
            'DAY',
            'DECIMAL',
            'DEFAULT',
            'DEFINE',
            'DELETE',
            'DEPTH',
            'DESC',
            'DETERMINISTIC',
            'DIRECTORY',
            'DISTINCT',
            'DO',
            'DOUBLE',
            'DROP',
            'DURATION',
            'ELEMENT',
            'ELSIF',
            'EMPTY',
            'END',
            'ESCAPE',
            'EXCEPTIONS',
            'EXCLUSIVE',
            'EXECUTE',
            'EXISTS',
            'EXIT',
            'EXTENDS',
            'EXTERNAL',
            'EXTRACT',
            'FALSE',
            'FETCH',
            'FINAL',
            'FIRST',
            'FIXED',
            'FLOAT',
            'FOR',
            'FORALL',
            'FORCE',
            'FROM',
            'FUNCTION',
            'GENERAL',
            'GOTO',
            'GRANT',
            'GROUP',
            'HASH',
            'HEAP',
            'HIDDEN',
            'HOUR',
            'IDENTIFIED',
            'IF',
            'IMMEDIATE',
            'IN',
            'INCLUDING',
            'INDEX',
            'INDEXES',
            'INDICATOR',
            'INDICES',
            'INFINITE',
            'INSTANTIABLE',
            'INT',
            'INTEGER',
            'INTERFACE',
            'INTERVAL',
            'INTO',
            'INVALIDATE',
            'IS',
            'ISOLATION',
            'JAVA',
            'LANGUAGE',
            'LARGE',
            'LEADING',
            'LENGTH',
            'LEVEL',
            'LIBRARY',
            'LIKE',
            'LIKE2',
            'LIKE4',
            'LIKEC',
            'LIMITED',
            'LOCAL',
            'LOCK',
            'LONG',
            'MAP',
            'MAX',
            'MAXLEN',
            'MEMBER',
            'MERGE',
            'MIN',
            'MINUTE',
            'MLSLABEL',
            'MOD',
            'MODE',
            'MONTH',
            'MULTISET',
            'NAME',
            'NAN',
            'NATIONAL',
            'NATIVE',
            'NATURAL',
            'NATURALN',
            'NCHAR',
            'NEW',
            'NEXTVAL',
            'NOCOMPRESS',
            'NOCOPY',
            'NOT',
            'NOWAIT',
            'NULL',
            'NULLIF',
            'NUMBER_BASE',
            'NUMBER',
            'OBJECT',
            'OCICOLL',
            'OCIDATE',
            'OCIDATETIME',
            'OCIDURATION',
            'OCIINTERVAL',
            'OCILOBLOCATOR',
            'OCINUMBER',
            'OCIRAW',
            'OCIREF',
            'OCIREFCURSOR',
            'OCIROWID',
            'OCISTRING',
            'OCITYPE',
            'OF',
            'OLD',
            'ON',
            'ONLY',
            'OPAQUE',
            'OPEN',
            'OPERATOR',
            'OPTION',
            'ORACLE',
            'ORADATA',
            'ORDER',
            'ORGANIZATION',
            'ORLANY',
            'ORLVARY',
            'OTHERS',
            'OUT',
            'OVERLAPS',
            'OVERRIDING',
            'PACKAGE',
            'PARALLEL_ENABLE',
            'PARAMETER',
            'PARAMETERS',
            'PARENT',
            'PARTITION',
            'PASCAL',
            'PCTFREE',
            'PIPE',
            'PIPELINED',
            'PLS_INTEGER',
            'PLUGGABLE',
            'POSITIVE',
            'POSITIVEN',
            'PRAGMA',
            'PRECISION',
            'PRIOR',
            'PRIVATE',
            'PROCEDURE',
            'PUBLIC',
            'RAISE',
            'RANGE',
            'RAW',
            'READ',
            'REAL',
            'RECORD',
            'REF',
            'REFERENCE',
            'RELEASE',
            'RELIES_ON',
            'REM',
            'REMAINDER',
            'RENAME',
            'RESOURCE',
            'RESULT_CACHE',
            'RESULT',
            'RETURN',
            'RETURNING',
            'REVERSE',
            'REVOKE',
            'ROLLBACK',
            'ROW',
            'ROWID',
            'ROWNUM',
            'ROWTYPE',
            'SAMPLE',
            'SAVE',
            'SAVEPOINT',
            'SB1',
            'SB2',
            'SB4',
            'SEARCH',
            'SECOND',
            'SEGMENT',
            'SELF',
            'SEPARATE',
            'SEQUENCE',
            'SERIALIZABLE',
            'SHARE',
            'SHORT',
            'SIZE_T',
            'SIZE',
            'SMALLINT',
            'SOME',
            'SPACE',
            'SPARSE',
            'SQL',
            'SQLCODE',
            'SQLDATA',
            'SQLERRM',
            'SQLNAME',
            'SQLSTATE',
            'STANDARD',
            'START',
            'STATIC',
            'STDDEV',
            'STORED',
            'STRING',
            'STRUCT',
            'STYLE',
            'SUBMULTISET',
            'SUBPARTITION',
            'SUBSTITUTABLE',
            'SUBTYPE',
            'SUCCESSFUL',
            'SUM',
            'SYNONYM',
            'SYSDATE',
            'TABAUTH',
            'TABLE',
            'TDO',
            'THE',
            'THEN',
            'TIME',
            'TIMESTAMP',
            'TIMEZONE_ABBR',
            'TIMEZONE_HOUR',
            'TIMEZONE_MINUTE',
            'TIMEZONE_REGION',
            'TO',
            'TRAILING',
            'TRANSACTION',
            'TRANSACTIONAL',
            'TRIGGER',
            'TRUE',
            'TRUSTED',
            'TYPE',
            'UB1',
            'UB2',
            'UB4',
            'UID',
            'UNDER',
            'UNIQUE',
            'UNPLUG',
            'UNSIGNED',
            'UNTRUSTED',
            'USE',
            'USER',
            'USING',
            'VALIDATE',
            'VALIST',
            'VALUE',
            'VARCHAR',
            'VARCHAR2',
            'VARIABLE',
            'VARIANCE',
            'VARRAY',
            'VARYING',
            'VIEW',
            'VIEWS',
            'VOID',
            'WHENEVER',
            'WHILE',
            'WITH',
            'WORK',
            'WRAPPED',
            'WRITE',
            'YEAR',
            'ZONE',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'ALTER COLUMN',
            'ALTER TABLE',
            'BEGIN',
            'CONNECT BY',
            'DECLARE',
            'DELETE FROM',
            'DELETE',
            'END',
            'EXCEPT',
            'EXCEPTION',
            'FETCH FIRST',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'LIMIT',
            'LOOP',
            'MODIFY',
            'ORDER BY',
            'SELECT',
            'SET CURRENT SCHEMA',
            'SET SCHEMA',
            'SET',
            'START WITH',
            'UPDATE',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
        const reservedNewlineWords = [
            'AND',
            'CROSS APPLY',
            'ELSE',
            'END',
            'OR',
            'OUTER APPLY',
            'WHEN',
            'XOR',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'FULL JOIN',
            'FULL OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
        ];
        class PlSqlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "N''", "''", '``'],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: [':'],
                    lineCommentTypes: ['--'],
                    specialWordChars: ['_', '$', '#', '.', '@'],
                    operators: ['||', '**', '!=', ':='],
                });
            }
            tokenOverride(token) {
                if (token.isSet(token) && token.isBy(this.previousReservedToken)) {
                    return { type: token.tokenTypes.RESERVED, value: token.value };
                }
                return token;
            }
        }
        languages.PlSqlFormatter = PlSqlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'ABORT',
            'ABSOLUTE',
            'ACCESS',
            'ACTION',
            'ADD',
            'ADMIN',
            'AFTER',
            'AGGREGATE',
            'ALL',
            'ALSO',
            'ALTER',
            'ALWAYS',
            'ANALYSE',
            'ANALYZE',
            'AND',
            'ANY',
            'ARRAY',
            'AS',
            'ASC',
            'ASSERTION',
            'ASSIGNMENT',
            'ASYMMETRIC',
            'AT',
            'ATTACH',
            'ATTRIBUTE',
            'AUTHORIZATION',
            'BACKWARD',
            'BEFORE',
            'BEGIN',
            'BETWEEN',
            'BIGINT',
            'BINARY',
            'BIT',
            'BOOLEAN',
            'BOTH',
            'BY',
            'CACHE',
            'CALL',
            'CALLED',
            'CASCADE',
            'CASCADED',
            'CASE',
            'CAST',
            'CATALOG',
            'CHAIN',
            'CHAR',
            'CHARACTER',
            'CHARACTERISTICS',
            'CHECK',
            'CHECKPOINT',
            'CLASS',
            'CLOSE',
            'CLUSTER',
            'COALESCE',
            'COLLATE',
            'COLLATION',
            'COLUMN',
            'COLUMNS',
            'COMMENT',
            'COMMENTS',
            'COMMIT',
            'COMMITTED',
            'CONCURRENTLY',
            'CONFIGURATION',
            'CONFLICT',
            'CONNECTION',
            'CONSTRAINT',
            'CONSTRAINTS',
            'CONTENT',
            'CONTINUE',
            'CONVERSION',
            'COPY',
            'COST',
            'CREATE',
            'CROSS',
            'CSV',
            'CUBE',
            'CURRENT',
            'CURRENT_CATALOG',
            'CURRENT_DATE',
            'CURRENT_ROLE',
            'CURRENT_SCHEMA',
            'CURRENT_TIME',
            'CURRENT_TIMESTAMP',
            'CURRENT_USER',
            'CURSOR',
            'CYCLE',
            'DATA',
            'DATABASE',
            'DAY',
            'DEALLOCATE',
            'DEC',
            'DECIMAL',
            'DECLARE',
            'DEFAULT',
            'DEFAULTS',
            'DEFERRABLE',
            'DEFERRED',
            'DEFINER',
            'DELETE',
            'DELIMITER',
            'DELIMITERS',
            'DEPENDS',
            'DESC',
            'DETACH',
            'DICTIONARY',
            'DISABLE',
            'DISCARD',
            'DISTINCT',
            'DO',
            'DOCUMENT',
            'DOMAIN',
            'DOUBLE',
            'DROP',
            'EACH',
            'ELSE',
            'ENABLE',
            'ENCODING',
            'ENCRYPTED',
            'END',
            'ENUM',
            'ESCAPE',
            'EVENT',
            'EXCEPT',
            'EXCLUDE',
            'EXCLUDING',
            'EXCLUSIVE',
            'EXECUTE',
            'EXISTS',
            'EXPLAIN',
            'EXPRESSION',
            'EXTENSION',
            'EXTERNAL',
            'EXTRACT',
            'FALSE',
            'FAMILY',
            'FETCH',
            'FILTER',
            'FIRST',
            'FLOAT',
            'FOLLOWING',
            'FOR',
            'FORCE',
            'FOREIGN',
            'FORWARD',
            'FREEZE',
            'FROM',
            'FULL',
            'FUNCTION',
            'FUNCTIONS',
            'GENERATED',
            'GLOBAL',
            'GRANT',
            'GRANTED',
            'GREATEST',
            'GROUP',
            'GROUPING',
            'GROUPS',
            'HANDLER',
            'HAVING',
            'HEADER',
            'HOLD',
            'HOUR',
            'IDENTITY',
            'IF',
            'ILIKE',
            'IMMEDIATE',
            'IMMUTABLE',
            'IMPLICIT',
            'IMPORT',
            'IN',
            'INCLUDE',
            'INCLUDING',
            'INCREMENT',
            'INDEX',
            'INDEXES',
            'INHERIT',
            'INHERITS',
            'INITIALLY',
            'INLINE',
            'INNER',
            'INOUT',
            'INPUT',
            'INSENSITIVE',
            'INSERT',
            'INSTEAD',
            'INT',
            'INTEGER',
            'INTERSECT',
            'INTERVAL',
            'INTO',
            'INVOKER',
            'IS',
            'ISNULL',
            'ISOLATION',
            'JOIN',
            'KEY',
            'LABEL',
            'LANGUAGE',
            'LARGE',
            'LAST',
            'LATERAL',
            'LEADING',
            'LEAKPROOF',
            'LEAST',
            'LEFT',
            'LEVEL',
            'LIKE',
            'LIMIT',
            'LISTEN',
            'LOAD',
            'LOCAL',
            'LOCALTIME',
            'LOCALTIMESTAMP',
            'LOCATION',
            'LOCK',
            'LOCKED',
            'LOGGED',
            'MAPPING',
            'MATCH',
            'MATERIALIZED',
            'MAXVALUE',
            'METHOD',
            'MINUTE',
            'MINVALUE',
            'MODE',
            'MONTH',
            'MOVE',
            'NAME',
            'NAMES',
            'NATIONAL',
            'NATURAL',
            'NCHAR',
            'NEW',
            'NEXT',
            'NFC',
            'NFD',
            'NFKC',
            'NFKD',
            'NO',
            'NONE',
            'NORMALIZE',
            'NORMALIZED',
            'NOT',
            'NOTHING',
            'NOTIFY',
            'NOTNULL',
            'NOWAIT',
            'NULL',
            'NULLIF',
            'NULLS',
            'NUMERIC',
            'OBJECT',
            'OF',
            'OFF',
            'OFFSET',
            'OIDS',
            'OLD',
            'ON',
            'ONLY',
            'OPERATOR',
            'OPTION',
            'OPTIONS',
            'OR',
            'ORDER',
            'ORDINALITY',
            'OTHERS',
            'OUT',
            'OUTER',
            'OVER',
            'OVERLAPS',
            'OVERLAY',
            'OVERRIDING',
            'OWNED',
            'OWNER',
            'PARALLEL',
            'PARSER',
            'PARTIAL',
            'PARTITION',
            'PASSING',
            'PASSWORD',
            'PLACING',
            'PLANS',
            'POLICY',
            'POSITION',
            'PRECEDING',
            'PRECISION',
            'PREPARE',
            'PREPARED',
            'PRESERVE',
            'PRIMARY',
            'PRIOR',
            'PRIVILEGES',
            'PROCEDURAL',
            'PROCEDURE',
            'PROCEDURES',
            'PROGRAM',
            'PUBLICATION',
            'QUOTE',
            'RANGE',
            'READ',
            'REAL',
            'REASSIGN',
            'RECHECK',
            'RECURSIVE',
            'REF',
            'REFERENCES',
            'REFERENCING',
            'REFRESH',
            'REINDEX',
            'RELATIVE',
            'RELEASE',
            'RENAME',
            'REPEATABLE',
            'REPLACE',
            'REPLICA',
            'RESET',
            'RESTART',
            'RESTRICT',
            'RETURNING',
            'RETURNS',
            'REVOKE',
            'RIGHT',
            'ROLE',
            'ROLLBACK',
            'ROLLUP',
            'ROUTINE',
            'ROUTINES',
            'ROW',
            'ROWS',
            'RULE',
            'SAVEPOINT',
            'SCHEMA',
            'SCHEMAS',
            'SCROLL',
            'SEARCH',
            'SECOND',
            'SECURITY',
            'SELECT',
            'SEQUENCE',
            'SEQUENCES',
            'SERIALIZABLE',
            'SERVER',
            'SESSION',
            'SESSION_USER',
            'SET',
            'SETOF',
            'SETS',
            'SHARE',
            'SHOW',
            'SIMILAR',
            'SIMPLE',
            'SKIP',
            'SMALLINT',
            'SNAPSHOT',
            'SOME',
            'SQL',
            'STABLE',
            'STANDALONE',
            'START',
            'STATEMENT',
            'STATISTICS',
            'STDIN',
            'STDOUT',
            'STORAGE',
            'STORED',
            'STRICT',
            'STRIP',
            'SUBSCRIPTION',
            'SUBSTRING',
            'SUPPORT',
            'SYMMETRIC',
            'SYSID',
            'SYSTEM',
            'TABLE',
            'TABLES',
            'TABLESAMPLE',
            'TABLESPACE',
            'TEMP',
            'TEMPLATE',
            'TEMPORARY',
            'TEXT',
            'THEN',
            'TIES',
            'TIME',
            'TIMESTAMP',
            'TO',
            'TRAILING',
            'TRANSACTION',
            'TRANSFORM',
            'TREAT',
            'TRIGGER',
            'TRIM',
            'TRUE',
            'TRUNCATE',
            'TRUSTED',
            'TYPE',
            'TYPES',
            'UESCAPE',
            'UNBOUNDED',
            'UNCOMMITTED',
            'UNENCRYPTED',
            'UNION',
            'UNIQUE',
            'UNKNOWN',
            'UNLISTEN',
            'UNLOGGED',
            'UNTIL',
            'UPDATE',
            'USER',
            'USING',
            'VACUUM',
            'VALID',
            'VALIDATE',
            'VALIDATOR',
            'VALUE',
            'VALUES',
            'VARCHAR',
            'VARIADIC',
            'VARYING',
            'VERBOSE',
            'VERSION',
            'VIEW',
            'VIEWS',
            'VOLATILE',
            'WHEN',
            'WHERE',
            'WHITESPACE',
            'WINDOW',
            'WITH',
            'WITHIN',
            'WITHOUT',
            'WORK',
            'WRAPPER',
            'WRITE',
            'XML',
            'XMLATTRIBUTES',
            'XMLCONCAT',
            'XMLELEMENT',
            'XMLEXISTS',
            'XMLFOREST',
            'XMLNAMESPACES',
            'XMLPARSE',
            'XMLPI',
            'XMLROOT',
            'XMLSERIALIZE',
            'XMLTABLE',
            'YEAR',
            'YES',
            'ZONE',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'AFTER',
            'ALTER COLUMN',
            'ALTER TABLE',
            'CASE',
            'DELETE FROM',
            'END',
            'EXCEPT',
            'FETCH FIRST',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'LIMIT',
            'ORDER BY',
            'SELECT',
            'SET CURRENT SCHEMA',
            'SET SCHEMA',
            'SET',
            'UPDATE',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'UNION', 'UNION ALL'];
        const reservedNewlineWords = [
            'AND',
            'ELSE',
            'OR',
            'WHEN',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'FULL JOIN',
            'FULL OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
        ];
        class PostgreSqlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "''", "U&''", 'U&""', '$$'],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: ['$'],
                    namedPlaceholderTypes: [':'],
                    lineCommentTypes: ['--'],
                    operators: [
                        '!=',
                        '<<',
                        '>>',
                        '||/',
                        '|/',
                        '::',
                        '->>',
                        '->',
                        '~~*',
                        '~~',
                        '!~~*',
                        '!~~',
                        '~*',
                        '!~*',
                        '!~',
                        '!!',
                    ],
                });
            }
        }
        languages.PostgreSqlFormatter = PostgreSqlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'AES128',
            'AES256',
            'ALLOWOVERWRITE',
            'ANALYSE',
            'ARRAY',
            'AS',
            'ASC',
            'AUTHORIZATION',
            'BACKUP',
            'BINARY',
            'BLANKSASNULL',
            'BOTH',
            'BYTEDICT',
            'BZIP2',
            'CAST',
            'CHECK',
            'COLLATE',
            'COLUMN',
            'CONSTRAINT',
            'CREATE',
            'CREDENTIALS',
            'CURRENT_DATE',
            'CURRENT_TIME',
            'CURRENT_TIMESTAMP',
            'CURRENT_USER',
            'CURRENT_USER_ID',
            'DEFAULT',
            'DEFERRABLE',
            'DEFLATE',
            'DEFRAG',
            'DELTA',
            'DELTA32K',
            'DESC',
            'DISABLE',
            'DISTINCT',
            'DO',
            'ELSE',
            'EMPTYASNULL',
            'ENABLE',
            'ENCODE',
            'ENCRYPT',
            'ENCRYPTION',
            'END',
            'EXPLICIT',
            'FALSE',
            'FOR',
            'FOREIGN',
            'FREEZE',
            'FULL',
            'GLOBALDICT256',
            'GLOBALDICT64K',
            'GRANT',
            'GZIP',
            'IDENTITY',
            'IGNORE',
            'ILIKE',
            'INITIALLY',
            'INTO',
            'LEADING',
            'LOCALTIME',
            'LOCALTIMESTAMP',
            'LUN',
            'LUNS',
            'LZO',
            'LZOP',
            'MINUS',
            'MOSTLY13',
            'MOSTLY32',
            'MOSTLY8',
            'NATURAL',
            'NEW',
            'NULLS',
            'OFF',
            'OFFLINE',
            'OFFSET',
            'OLD',
            'ON',
            'ONLY',
            'OPEN',
            'ORDER',
            'OVERLAPS',
            'PARALLEL',
            'PARTITION',
            'PERCENT',
            'PERMISSIONS',
            'PLACING',
            'PRIMARY',
            'RAW',
            'READRATIO',
            'RECOVER',
            'REFERENCES',
            'REJECTLOG',
            'RESORT',
            'RESTORE',
            'SESSION_USER',
            'SIMILAR',
            'SYSDATE',
            'SYSTEM',
            'TABLE',
            'TAG',
            'TDES',
            'TEXT255',
            'TEXT32K',
            'THEN',
            'TIMESTAMP',
            'TO',
            'TOP',
            'TRAILING',
            'TRUE',
            'TRUNCATECOLUMNS',
            'UNIQUE',
            'USER',
            'USING',
            'VERBOSE',
            'WALLET',
            'WHEN',
            'WITH',
            'WITHOUT',
            'PREDICATE',
            'COLUMNS',
            'COMPROWS',
            'COMPRESSION',
            'COPY',
            'FORMAT',
            'DELIMITER',
            'FIXEDWIDTH',
            'AVRO',
            'JSON',
            'ENCRYPTED',
            'BZIP2',
            'GZIP',
            'LZOP',
            'PARQUET',
            'ORC',
            'ACCEPTANYDATE',
            'ACCEPTINVCHARS',
            'BLANKSASNULL',
            'DATEFORMAT',
            'EMPTYASNULL',
            'ENCODING',
            'ESCAPE',
            'EXPLICIT_IDS',
            'FILLRECORD',
            'IGNOREBLANKLINES',
            'IGNOREHEADER',
            'NULL AS',
            'REMOVEQUOTES',
            'ROUNDEC',
            'TIMEFORMAT',
            'TRIMBLANKS',
            'TRUNCATECOLUMNS',
            'COMPROWS',
            'COMPUPDATE',
            'MAXERROR',
            'NOLOAD',
            'STATUPDATE',
            'MANIFEST',
            'REGION',
            'IAM_ROLE',
            'MASTER_SYMMETRIC_KEY',
            'SSH',
            'ACCEPTANYDATE',
            'ACCEPTINVCHARS',
            'ACCESS_KEY_ID',
            'SECRET_ACCESS_KEY',
            'AVRO',
            'BLANKSASNULL',
            'BZIP2',
            'COMPROWS',
            'COMPUPDATE',
            'CREDENTIALS',
            'DATEFORMAT',
            'DELIMITER',
            'EMPTYASNULL',
            'ENCODING',
            'ENCRYPTED',
            'ESCAPE',
            'EXPLICIT_IDS',
            'FILLRECORD',
            'FIXEDWIDTH',
            'FORMAT',
            'IAM_ROLE',
            'GZIP',
            'IGNOREBLANKLINES',
            'IGNOREHEADER',
            'JSON',
            'LZOP',
            'MANIFEST',
            'MASTER_SYMMETRIC_KEY',
            'MAXERROR',
            'NOLOAD',
            'NULL AS',
            'READRATIO',
            'REGION',
            'REMOVEQUOTES',
            'ROUNDEC',
            'SSH',
            'STATUPDATE',
            'TIMEFORMAT',
            'SESSION_TOKEN',
            'TRIMBLANKS',
            'TRUNCATECOLUMNS',
            'EXTERNAL',
            'DATA CATALOG',
            'HIVE METASTORE',
            'CATALOG_ROLE',
            'VACUUM',
            'COPY',
            'UNLOAD',
            'EVEN',
            'ALL',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'AFTER',
            'ALTER COLUMN',
            'ALTER TABLE',
            'DELETE FROM',
            'EXCEPT',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'INTERSECT',
            'TOP',
            'LIMIT',
            'MODIFY',
            'ORDER BY',
            'SELECT',
            'SET CURRENT SCHEMA',
            'SET SCHEMA',
            'SET',
            'UNION ALL',
            'UNION',
            'UPDATE',
            'VALUES',
            'WHERE',
            'VACUUM',
            'COPY',
            'UNLOAD',
            'ANALYZE',
            'ANALYSE',
            'DISTKEY',
            'SORTKEY',
            'COMPOUND',
            'INTERLEAVED',
            'FORMAT',
            'DELIMITER',
            'FIXEDWIDTH',
            'AVRO',
            'JSON',
            'ENCRYPTED',
            'BZIP2',
            'GZIP',
            'LZOP',
            'PARQUET',
            'ORC',
            'ACCEPTANYDATE',
            'ACCEPTINVCHARS',
            'BLANKSASNULL',
            'DATEFORMAT',
            'EMPTYASNULL',
            'ENCODING',
            'ESCAPE',
            'EXPLICIT_IDS',
            'FILLRECORD',
            'IGNOREBLANKLINES',
            'IGNOREHEADER',
            'NULL AS',
            'REMOVEQUOTES',
            'ROUNDEC',
            'TIMEFORMAT',
            'TRIMBLANKS',
            'TRUNCATECOLUMNS',
            'COMPROWS',
            'COMPUPDATE',
            'MAXERROR',
            'NOLOAD',
            'STATUPDATE',
            'MANIFEST',
            'REGION',
            'IAM_ROLE',
            'MASTER_SYMMETRIC_KEY',
            'SSH',
            'ACCEPTANYDATE',
            'ACCEPTINVCHARS',
            'ACCESS_KEY_ID',
            'SECRET_ACCESS_KEY',
            'AVRO',
            'BLANKSASNULL',
            'BZIP2',
            'COMPROWS',
            'COMPUPDATE',
            'CREDENTIALS',
            'DATEFORMAT',
            'DELIMITER',
            'EMPTYASNULL',
            'ENCODING',
            'ENCRYPTED',
            'ESCAPE',
            'EXPLICIT_IDS',
            'FILLRECORD',
            'FIXEDWIDTH',
            'FORMAT',
            'IAM_ROLE',
            'GZIP',
            'IGNOREBLANKLINES',
            'IGNOREHEADER',
            'JSON',
            'LZOP',
            'MANIFEST',
            'MASTER_SYMMETRIC_KEY',
            'MAXERROR',
            'NOLOAD',
            'NULL AS',
            'READRATIO',
            'REGION',
            'REMOVEQUOTES',
            'ROUNDEC',
            'SSH',
            'STATUPDATE',
            'TIMEFORMAT',
            'SESSION_TOKEN',
            'TRIMBLANKS',
            'TRUNCATECOLUMNS',
            'EXTERNAL',
            'DATA CATALOG',
            'HIVE METASTORE',
            'CATALOG_ROLE',
        ];
        const reservedTopLevelWordsNoIndent = [];
        const reservedNewlineWords = [
            'AND',
            'ELSE',
            'OR',
            'OUTER APPLY',
            'WHEN',
            'VACUUM',
            'COPY',
            'UNLOAD',
            'ANALYZE',
            'ANALYSE',
            'DISTKEY',
            'SORTKEY',
            'COMPOUND',
            'INTERLEAVED',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'FULL JOIN',
            'FULL OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
        ];
        class RedshiftFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "''", '``'],
                    openParens: ['('],
                    closeParens: [')'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: ['@', '#', '$'],
                    lineCommentTypes: ['--'],
                    operators: ['|/', '||/', '<<', '>>', '!=', '||'],
                });
            }
        }
        languages.RedshiftFormatter = RedshiftFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'ALL',
            'ALTER',
            'ANALYSE',
            'ANALYZE',
            'ARRAY_ZIP',
            'ARRAY',
            'AS',
            'ASC',
            'AVG',
            'BETWEEN',
            'CASCADE',
            'CASE',
            'CAST',
            'COALESCE',
            'COLLECT_LIST',
            'COLLECT_SET',
            'COLUMN',
            'COLUMNS',
            'COMMENT',
            'CONSTRAINT',
            'CONTAINS',
            'CONVERT',
            'COUNT',
            'CUME_DIST',
            'CURRENT ROW',
            'CURRENT_DATE',
            'CURRENT_TIMESTAMP',
            'DATABASE',
            'DATABASES',
            'DATE_ADD',
            'DATE_SUB',
            'DATE_TRUNC',
            'DAY_HOUR',
            'DAY_MINUTE',
            'DAY_SECOND',
            'DAY',
            'DAYS',
            'DECODE',
            'DEFAULT',
            'DELETE',
            'DENSE_RANK',
            'DESC',
            'DESCRIBE',
            'DISTINCT',
            'DISTINCTROW',
            'DIV',
            'DROP',
            'ELSE',
            'ENCODE',
            'END',
            'EXISTS',
            'EXPLAIN',
            'EXPLODE_OUTER',
            'EXPLODE',
            'FILTER',
            'FIRST_VALUE',
            'FIRST',
            'FIXED',
            'FLATTEN',
            'FOLLOWING',
            'FROM_UNIXTIME',
            'FULL',
            'GREATEST',
            'GROUP_CONCAT',
            'HOUR_MINUTE',
            'HOUR_SECOND',
            'HOUR',
            'HOURS',
            'IF',
            'IFNULL',
            'IN',
            'INSERT',
            'INTERVAL',
            'INTO',
            'IS',
            'LAG',
            'LAST_VALUE',
            'LAST',
            'LEAD',
            'LEADING',
            'LEAST',
            'LEVEL',
            'LIKE',
            'MAX',
            'MERGE',
            'MIN',
            'MINUTE_SECOND',
            'MINUTE',
            'MONTH',
            'NATURAL',
            'NOT',
            'NOW()',
            'NTILE',
            'NULL',
            'NULLIF',
            'OFFSET',
            'ON DELETE',
            'ON UPDATE',
            'ON',
            'ONLY',
            'OPTIMIZE',
            'OVER',
            'PERCENT_RANK',
            'PRECEDING',
            'RANGE',
            'RANK',
            'REGEXP',
            'RENAME',
            'RLIKE',
            'ROW',
            'ROWS',
            'SECOND',
            'SEPARATOR',
            'SEQUENCE',
            'SIZE',
            'STRING',
            'STRUCT',
            'SUM',
            'TABLE',
            'TABLES',
            'TEMPORARY',
            'THEN',
            'TO_DATE',
            'TO_JSON',
            'TO',
            'TRAILING',
            'TRANSFORM',
            'TRUE',
            'TRUNCATE',
            'TYPE',
            'TYPES',
            'UNBOUNDED',
            'UNIQUE',
            'UNIX_TIMESTAMP',
            'UNLOCK',
            'UNSIGNED',
            'USING',
            'VARIABLES',
            'VIEW',
            'WHEN',
            'WITH',
            'YEAR_MONTH',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'AFTER',
            'ALTER COLUMN',
            'ALTER DATABASE',
            'ALTER SCHEMA',
            'ALTER TABLE',
            'CLUSTER BY',
            'CLUSTERED BY',
            'DELETE FROM',
            'DISTRIBUTE BY',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'LIMIT',
            'OPTIONS',
            'ORDER BY',
            'PARTITION BY',
            'PARTITIONED BY',
            'RANGE',
            'ROWS',
            'SELECT',
            'SET CURRENT SCHEMA',
            'SET SCHEMA',
            'SET',
            'TBLPROPERTIES',
            'UPDATE',
            'USING',
            'VALUES',
            'WHERE',
            'WINDOW',
        ];
        const reservedTopLevelWordsNoIndent = [
            'EXCEPT ALL',
            'EXCEPT',
            'INTERSECT ALL',
            'INTERSECT',
            'UNION ALL',
            'UNION',
        ];
        const reservedNewlineWords = [
            'AND',
            'CREATE OR',
            'CREATE',
            'ELSE',
            'LATERAL VIEW',
            'OR',
            'OUTER APPLY',
            'WHEN',
            'XOR',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'FULL JOIN',
            'FULL OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
            // non-standard-joins
            'ANTI JOIN',
            'SEMI JOIN',
            'LEFT ANTI JOIN',
            'LEFT SEMI JOIN',
            'RIGHT OUTER JOIN',
            'RIGHT SEMI JOIN',
            'NATURAL ANTI JOIN',
            'NATURAL FULL OUTER JOIN',
            'NATURAL INNER JOIN',
            'NATURAL LEFT ANTI JOIN',
            'NATURAL LEFT OUTER JOIN',
            'NATURAL LEFT SEMI JOIN',
            'NATURAL OUTER JOIN',
            'NATURAL RIGHT OUTER JOIN',
            'NATURAL RIGHT SEMI JOIN',
            'NATURAL SEMI JOIN',
        ];
        class SparkSqlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "''", '``', '{}'],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: ['$'],
                    lineCommentTypes: ['--'],
                    operators: ['!=', '<=>', '&&', '||', '=='],
                });
            }
            tokenOverride(t) {
                // Fix cases where names are ambiguously keywords or functions
                if (SqlFormatting.TokenHelpers.isWindow(t)) {
                    const aheadToken = this.tokenLookAhead();
                    if (aheadToken && aheadToken.type === SqlFormatting.TokenHelpers.tokenTypes.OPEN_PAREN) {
                        // This is a function call, treat it as a reserved word
                        return { type: SqlFormatting.TokenHelpers.tokenTypes.RESERVED, value: t.value };
                    }
                }
                // Fix cases where names are ambiguously keywords or properties
                if (SqlFormatting.TokenHelpers.isEnd(t)) {
                    const backToken = this.tokenLookBehind();
                    if (backToken && backToken.type === SqlFormatting.TokenHelpers.tokenTypes.OPERATOR && backToken.value === '.') {
                        // This is window().end (or similar) not CASE ... END
                        return { type: SqlFormatting.TokenHelpers.tokenTypes.WORD, value: t.value };
                    }
                }
                return SqlFormatting.TokenHelpers;
            }
        }
        languages.SparkSqlFormatter = SparkSqlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#reserved-word
        const reservedWords = [
            'ABS',
            'ALL',
            'ALLOCATE',
            'ALTER',
            'AND',
            'ANY',
            'ARE',
            'ARRAY',
            'AS',
            'ASENSITIVE',
            'ASYMMETRIC',
            'AT',
            'ATOMIC',
            'AUTHORIZATION',
            'AVG',
            'BEGIN',
            'BETWEEN',
            'BIGINT',
            'BINARY',
            'BLOB',
            'BOOLEAN',
            'BOTH',
            'BY',
            'CALL',
            'CALLED',
            'CARDINALITY',
            'CASCADED',
            'CASE',
            'CAST',
            'CEIL',
            'CEILING',
            'CHAR',
            'CHAR_LENGTH',
            'CHARACTER',
            'CHARACTER_LENGTH',
            'CHECK',
            'CLOB',
            'CLOSE',
            'COALESCE',
            'COLLATE',
            'COLLECT',
            'COLUMN',
            'COMMIT',
            'CONDITION',
            'CONNECT',
            'CONSTRAINT',
            'CONVERT',
            'CORR',
            'CORRESPONDING',
            'COUNT',
            'COVAR_POP',
            'COVAR_SAMP',
            'CREATE',
            'CROSS',
            'CUBE',
            'CUME_DIST',
            'CURRENT',
            'CURRENT_CATALOG',
            'CURRENT_DATE',
            'CURRENT_DEFAULT_TRANSFORM_GROUP',
            'CURRENT_PATH',
            'CURRENT_ROLE',
            'CURRENT_SCHEMA',
            'CURRENT_TIME',
            'CURRENT_TIMESTAMP',
            'CURRENT_TRANSFORM_GROUP_FOR_TYPE',
            'CURRENT_USER',
            'CURSOR',
            'CYCLE',
            'DATE',
            'DAY',
            'DEALLOCATE',
            'DEC',
            'DECIMAL',
            'DECLARE',
            'DEFAULT',
            'DELETE',
            'DENSE_RANK',
            'DEREF',
            'DESCRIBE',
            'DETERMINISTIC',
            'DISCONNECT',
            'DISTINCT',
            'DOUBLE',
            'DROP',
            'DYNAMIC',
            'EACH',
            'ELEMENT',
            'ELSE',
            'END',
            'END-EXEC',
            'ESCAPE',
            'EVERY',
            'EXCEPT',
            'EXEC',
            'EXECUTE',
            'EXISTS',
            'EXP',
            'EXTERNAL',
            'EXTRACT',
            'FALSE',
            'FETCH',
            'FILTER',
            'FLOAT',
            'FLOOR',
            'FOR',
            'FOREIGN',
            'FREE',
            'FROM',
            'FULL',
            'FUNCTION',
            'FUSION',
            'GET',
            'GLOBAL',
            'GRANT',
            'GROUP',
            'GROUPING',
            'HAVING',
            'HOLD',
            'HOUR',
            'IDENTITY',
            'IN',
            'INDICATOR',
            'INNER',
            'INOUT',
            'INSENSITIVE',
            'INSERT',
            'INT',
            'INTEGER',
            'INTERSECT',
            'INTERSECTION',
            'INTERVAL',
            'INTO',
            'IS',
            'JOIN',
            'LANGUAGE',
            'LARGE',
            'LATERAL',
            'LEADING',
            'LEFT',
            'LIKE',
            'LIKE_REGEX',
            'LN',
            'LOCAL',
            'LOCALTIME',
            'LOCALTIMESTAMP',
            'LOWER',
            'MATCH',
            'MAX',
            'MEMBER',
            'MERGE',
            'METHOD',
            'MIN',
            'MINUTE',
            'MOD',
            'MODIFIES',
            'MODULE',
            'MONTH',
            'MULTISET',
            'NATIONAL',
            'NATURAL',
            'NCHAR',
            'NCLOB',
            'NEW',
            'NO',
            'NONE',
            'NORMALIZE',
            'NOT',
            'NULL',
            'NULLIF',
            'NUMERIC',
            'OCTET_LENGTH',
            'OCCURRENCES_REGEX',
            'OF',
            'OLD',
            'ON',
            'ONLY',
            'OPEN',
            'OR',
            'ORDER',
            'OUT',
            'OUTER',
            'OVER',
            'OVERLAPS',
            'OVERLAY',
            'PARAMETER',
            'PARTITION',
            'PERCENT_RANK',
            'PERCENTILE_CONT',
            'PERCENTILE_DISC',
            'POSITION',
            'POSITION_REGEX',
            'POWER',
            'PRECISION',
            'PREPARE',
            'PRIMARY',
            'PROCEDURE',
            'RANGE',
            'RANK',
            'READS',
            'REAL',
            'RECURSIVE',
            'REF',
            'REFERENCES',
            'REFERENCING',
            'REGR_AVGX',
            'REGR_AVGY',
            'REGR_COUNT',
            'REGR_INTERCEPT',
            'REGR_R2',
            'REGR_SLOPE',
            'REGR_SXX',
            'REGR_SXY',
            'REGR_SYY',
            'RELEASE',
            'RESULT',
            'RETURN',
            'RETURNS',
            'REVOKE',
            'RIGHT',
            'ROLLBACK',
            'ROLLUP',
            'ROW',
            'ROW_NUMBER',
            'ROWS',
            'SAVEPOINT',
            'SCOPE',
            'SCROLL',
            'SEARCH',
            'SECOND',
            'SELECT',
            'SENSITIVE',
            'SESSION_USER',
            'SET',
            'SIMILAR',
            'SMALLINT',
            'SOME',
            'SPECIFIC',
            'SPECIFICTYPE',
            'SQL',
            'SQLEXCEPTION',
            'SQLSTATE',
            'SQLWARNING',
            'SQRT',
            'START',
            'STATIC',
            'STDDEV_POP',
            'STDDEV_SAMP',
            'SUBMULTISET',
            'SUBSTRING',
            'SUBSTRING_REGEX',
            'SUM',
            'SYMMETRIC',
            'SYSTEM',
            'SYSTEM_USER',
            'TABLE',
            'TABLESAMPLE',
            'THEN',
            'TIME',
            'TIMESTAMP',
            'TIMEZONE_HOUR',
            'TIMEZONE_MINUTE',
            'TO',
            'TRAILING',
            'TRANSLATE',
            'TRANSLATE_REGEX',
            'TRANSLATION',
            'TREAT',
            'TRIGGER',
            'TRIM',
            'TRUE',
            'UESCAPE',
            'UNION',
            'UNIQUE',
            'UNKNOWN',
            'UNNEST',
            'UPDATE',
            'UPPER',
            'USER',
            'USING',
            'VALUE',
            'VALUES',
            'VAR_POP',
            'VAR_SAMP',
            'VARBINARY',
            'VARCHAR',
            'VARYING',
            'WHEN',
            'WHENEVER',
            'WHERE',
            'WIDTH_BUCKET',
            'WINDOW',
            'WITH',
            'WITHIN',
            'WITHOUT',
            'YEAR',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'ALTER COLUMN',
            'ALTER TABLE',
            'CASE',
            'DELETE FROM',
            'END',
            'FETCH FIRST',
            'FETCH NEXT',
            'FETCH PRIOR',
            'FETCH LAST',
            'FETCH ABSOLUTE',
            'FETCH RELATIVE',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'LIMIT',
            'ORDER BY',
            'SELECT',
            'SET SCHEMA',
            'SET',
            'UPDATE',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = [
            'INTERSECT',
            'INTERSECT ALL',
            'INTERSECT DISTINCT',
            'UNION',
            'UNION ALL',
            'UNION DISTINCT',
            'EXCEPT',
            'EXCEPT ALL',
            'EXCEPT DISTINCT',
        ];
        const reservedNewlineWords = [
            'AND',
            'ELSE',
            'OR',
            'WHEN',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'FULL JOIN',
            'FULL OUTER JOIN',
            'CROSS JOIN',
            'NATURAL JOIN',
        ];
        class StandardSqlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "''"],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: ['?'],
                    namedPlaceholderTypes: [],
                    lineCommentTypes: ['--'],
                });
            }
        }
        languages.StandardSqlFormatter = StandardSqlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
var SqlFormatting;
(function (SqlFormatting) {
    var languages;
    (function (languages) {
        const reservedWords = [
            'ADD',
            'EXTERNAL',
            'PROCEDURE',
            'ALL',
            'FETCH',
            'PUBLIC',
            'ALTER',
            'FILE',
            'RAISERROR',
            'AND',
            'FILLFACTOR',
            'READ',
            'ANY',
            'FOR',
            'READTEXT',
            'AS',
            'FOREIGN',
            'RECONFIGURE',
            'ASC',
            'FREETEXT',
            'REFERENCES',
            'AUTHORIZATION',
            'FREETEXTTABLE',
            'REPLICATION',
            'BACKUP',
            'FROM',
            'RESTORE',
            'BEGIN',
            'FULL',
            'RESTRICT',
            'BETWEEN',
            'FUNCTION',
            'RETURN',
            'BREAK',
            'GOTO',
            'REVERT',
            'BROWSE',
            'GRANT',
            'REVOKE',
            'BULK',
            'GROUP',
            'RIGHT',
            'BY',
            'HAVING',
            'ROLLBACK',
            'CASCADE',
            'HOLDLOCK',
            'ROWCOUNT',
            'CASE',
            'IDENTITY',
            'ROWGUIDCOL',
            'CHECK',
            'IDENTITY_INSERT',
            'RULE',
            'CHECKPOINT',
            'IDENTITYCOL',
            'SAVE',
            'CLOSE',
            'IF',
            'SCHEMA',
            'CLUSTERED',
            'IN',
            'SECURITYAUDIT',
            'COALESCE',
            'INDEX',
            'SELECT',
            'COLLATE',
            'INNER',
            'SEMANTICKEYPHRASETABLE',
            'COLUMN',
            'INSERT',
            'SEMANTICSIMILARITYDETAILSTABLE',
            'COMMIT',
            'INTERSECT',
            'SEMANTICSIMILARITYTABLE',
            'COMPUTE',
            'INTO',
            'SESSION_USER',
            'CONSTRAINT',
            'IS',
            'SET',
            'CONTAINS',
            'JOIN',
            'SETUSER',
            'CONTAINSTABLE',
            'KEY',
            'SHUTDOWN',
            'CONTINUE',
            'KILL',
            'SOME',
            'CONVERT',
            'LEFT',
            'STATISTICS',
            'CREATE',
            'LIKE',
            'SYSTEM_USER',
            'CROSS',
            'LINENO',
            'TABLE',
            'CURRENT',
            'LOAD',
            'TABLESAMPLE',
            'CURRENT_DATE',
            'MERGE',
            'TEXTSIZE',
            'CURRENT_TIME',
            'NATIONAL',
            'THEN',
            'CURRENT_TIMESTAMP',
            'NOCHECK',
            'TO',
            'CURRENT_USER',
            'NONCLUSTERED',
            'TOP',
            'CURSOR',
            'NOT',
            'TRAN',
            'DATABASE',
            'NULL',
            'TRANSACTION',
            'DBCC',
            'NULLIF',
            'TRIGGER',
            'DEALLOCATE',
            'OF',
            'TRUNCATE',
            'DECLARE',
            'OFF',
            'TRY_CONVERT',
            'DEFAULT',
            'OFFSETS',
            'TSEQUAL',
            'DELETE',
            'ON',
            'UNION',
            'DENY',
            'OPEN',
            'UNIQUE',
            'DESC',
            'OPENDATASOURCE',
            'UNPIVOT',
            'DISK',
            'OPENQUERY',
            'UPDATE',
            'DISTINCT',
            'OPENROWSET',
            'UPDATETEXT',
            'DISTRIBUTED',
            'OPENXML',
            'USE',
            'DOUBLE',
            'OPTION',
            'USER',
            'DROP',
            'OR',
            'VALUES',
            'DUMP',
            'ORDER',
            'VARYING',
            'ELSE',
            'OUTER',
            'VIEW',
            'END',
            'OVER',
            'WAITFOR',
            'ERRLVL',
            'PERCENT',
            'WHEN',
            'ESCAPE',
            'PIVOT',
            'WHERE',
            'EXCEPT',
            'PLAN',
            'WHILE',
            'EXEC',
            'PRECISION',
            'WITH',
            'EXECUTE',
            'PRIMARY',
            'WITHIN GROUP',
            'EXISTS',
            'PRINT',
            'WRITETEXT',
            'EXIT',
            'PROC',
        ];
        const reservedTopLevelWords = [
            'ADD',
            'ALTER COLUMN',
            'ALTER TABLE',
            'CASE',
            'DELETE FROM',
            'END',
            'EXCEPT',
            'FROM',
            'GROUP BY',
            'HAVING',
            'INSERT INTO',
            'INSERT',
            'LIMIT',
            'ORDER BY',
            'SELECT',
            'SET CURRENT SCHEMA',
            'SET SCHEMA',
            'SET',
            'UPDATE',
            'VALUES',
            'WHERE',
        ];
        const reservedTopLevelWordsNoIndent = ['INTERSECT', 'INTERSECT ALL', 'MINUS', 'UNION', 'UNION ALL'];
        const reservedNewlineWords = [
            'AND',
            'ELSE',
            'OR',
            'WHEN',
            // joins
            'JOIN',
            'INNER JOIN',
            'LEFT JOIN',
            'LEFT OUTER JOIN',
            'RIGHT JOIN',
            'RIGHT OUTER JOIN',
            'FULL JOIN',
            'FULL OUTER JOIN',
            'CROSS JOIN',
        ];
        class TSqlFormatter extends SqlFormatting.core.Formatter {
            tokenizer() {
                return new SqlFormatting.core.Tokenizer({
                    reservedWords,
                    reservedTopLevelWords,
                    reservedNewlineWords,
                    reservedTopLevelWordsNoIndent,
                    stringTypes: [`""`, "N''", "''", '[]'],
                    openParens: ['(', 'CASE'],
                    closeParens: [')', 'END'],
                    indexedPlaceholderTypes: [],
                    namedPlaceholderTypes: ['@'],
                    lineCommentTypes: ['--'],
                    specialWordChars: ['#', '@'],
                    operators: [
                        '>=',
                        '<=',
                        '<>',
                        '!=',
                        '!<',
                        '!>',
                        '+=',
                        '-=',
                        '*=',
                        '/=',
                        '%=',
                        '|=',
                        '&=',
                        '^=',
                        '::',
                    ],
                    // TODO: Support for money constants
                });
            }
        }
        languages.TSqlFormatter = TSqlFormatter;
    })(languages = SqlFormatting.languages || (SqlFormatting.languages = {}));
})(SqlFormatting || (SqlFormatting = {}));
//# sourceMappingURL=sqlformatter.js.map