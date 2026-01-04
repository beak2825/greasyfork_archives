(() => {
  var __webpack_modules__ = {
    29: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      let parser = __webpack_require__(121);
      module.exports.parse = parse;
      function parse(text, config) {
        let fallback = true;
        let duplicateKeys = false;
        if (config) {
          if ("fallback" in config && config[fallback] === false) {
            fallback = false;
          }
          duplicateKeys =
            "duplicateKeys" in config && config["duplicateKeys"] === true;
        }
        try {
          return parser.parse(text, duplicateKeys);
        } catch (e) {
          if (fallback === false) {
            throw e;
          }
          try {
            let json = JSON.parse(text);
            console.warn(
              "dirty-json got valid JSON that failed with the custom parser. We're returning the valid JSON, but please file a bug report here: https://github.com/RyanMarcus/dirty-json/issues  -- the JSON that caused the failure was: " +
                text
            );
            return json;
          } catch (json_error) {
            throw e;
          }
        }
      }
    },
    113: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      const Lexer = __webpack_require__(885);
      const unescapeJs = __webpack_require__(840);
      const utf8 = __webpack_require__(458);
      const LEX_KV = 0;
      const LEX_KVLIST = 1;
      const LEX_VLIST = 2;
      const LEX_BOOLEAN = 3;
      const LEX_COVALUE = 4;
      const LEX_CVALUE = 5;
      const LEX_FLOAT = 6;
      const LEX_INT = 7;
      const LEX_KEY = 8;
      const LEX_LIST = 9;
      const LEX_OBJ = 10;
      const LEX_QUOTE = 11;
      const LEX_RB = 12;
      const LEX_RCB = 13;
      const LEX_TOKEN = 14;
      const LEX_VALUE = 15;
      const LEX_COLON = -1;
      const LEX_COMMA = -2;
      const LEX_LCB = -3;
      const LEX_LB = -4;
      const LEX_DOT = -5;
      const lexMap = {
        ":": {
          type: LEX_COLON,
        },
        ",": {
          type: LEX_COMMA,
        },
        "{": {
          type: LEX_LCB,
        },
        "}": {
          type: LEX_RCB,
        },
        "[": {
          type: LEX_LB,
        },
        "]": {
          type: LEX_RB,
        },
        ".": {
          type: LEX_DOT,
        },
      };
      const lexSpc = [
        [/\s*:\s*/, LEX_COLON],
        [/\s*,\s*/, LEX_COMMA],
        [/\s*{\s*/, LEX_LCB],
        [/\s*}\s*/, LEX_RCB],
        [/\s*\[\s*/, LEX_LB],
        [/\s*\]\s*/, LEX_RB],
        [/\s*\.\s*/, LEX_DOT],
      ];
      function parseString(str) {
        str = str.replace(/\\\//, "/");
        return unescapeJs(str);
      }
      function getLexer(string) {
        let lexer = new Lexer();
        let col = 0;
        let row = 0;
        lexer.addRule(/"((?:\\.|[^"])*?)($|")/, (lexeme, txt) => {
          col += lexeme.length;
          return {
            type: LEX_QUOTE,
            value: parseString(txt),
            row: row,
            col: col,
            single: false,
          };
        });
        lexer.addRule(/'((?:\\.|[^'])*?)($|'|(",?[ \t]*\n))/, (lexeme, txt) => {
          col += lexeme.length;
          return {
            type: LEX_QUOTE,
            value: parseString(txt),
            row: row,
            col: col,
            single: true,
          };
        });
        lexer.addRule(
          /[\-0-9]*\.[0-9]*([eE][\+\-]?)?[0-9]*(?:\s*)/,
          (lexeme) => {
            col += lexeme.length;
            return {
              type: LEX_FLOAT,
              value: parseFloat(lexeme),
              row: row,
              col: col,
            };
          }
        );
        lexer.addRule(/\-?[0-9]+([eE][\+\-]?)[0-9]*(?:\s*)/, (lexeme) => {
          col += lexeme.length;
          return {
            type: LEX_FLOAT,
            value: parseFloat(lexeme),
            row: row,
            col: col,
          };
        });
        lexer.addRule(/\-?[0-9]+(?:\s*)/, (lexeme) => {
          col += lexeme.length;
          return {
            type: LEX_INT,
            value: parseInt(lexeme),
            row: row,
            col: col,
          };
        });
        lexSpc.forEach((item) => {
          lexer.addRule(item[0], (lexeme) => {
            col += lexeme.length;
            return {
              type: item[1],
              value: lexeme,
              row: row,
              col: col,
            };
          });
        });
        lexer.addRule(/\s/, (lexeme) => {
          if (lexeme == "\n") {
            col = 0;
            row++;
          } else {
            col += lexeme.length;
          }
        });
        lexer.addRule(/\S[ \t]*/, (lexeme) => {
          col += lexeme.length;
          let lt = LEX_TOKEN;
          let val = lexeme;
          return {
            type: lt,
            value: val,
            row: row,
            col: col,
          };
        });
        lexer.setInput(string);
        return lexer;
      }
      module.exports.lexString = lexString;
      function lexString(str, emit) {
        let lex = getLexer(str);
        let token = "";
        while ((token = lex.lex())) {
          emit(token);
        }
      }
      module.exports.getAllTokens = getAllTokens;
      function getAllTokens(str) {
        let arr = [];
        let emit = function (i) {
          arr.push(i);
        };
        lexString(str, emit);
        return arr;
      }
    },
    121: (module, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      let lexer = __webpack_require__(113);
      const LEX_KV = 0;
      const LEX_KVLIST = 1;
      const LEX_VLIST = 2;
      const LEX_BOOLEAN = 3;
      const LEX_COVALUE = 4;
      const LEX_CVALUE = 5;
      const LEX_FLOAT = 6;
      const LEX_INT = 7;
      const LEX_KEY = 8;
      const LEX_LIST = 9;
      const LEX_OBJ = 10;
      const LEX_QUOTE = 11;
      const LEX_RB = 12;
      const LEX_RCB = 13;
      const LEX_TOKEN = 14;
      const LEX_VALUE = 15;
      const LEX_COLON = -1;
      const LEX_COMMA = -2;
      const LEX_LCB = -3;
      const LEX_LB = -4;
      const LEX_DOT = null && -5;
      function extendArray(arr) {
        if (arr.peek == null) {
          Object.defineProperty(arr, "peek", {
            enumerable: false,
            value: function () {
              return this[this.length - 1];
            },
          });
        }
        if (arr.last == null) {
          Object.defineProperty(arr, "last", {
            enumerable: false,
            value: function (i) {
              return this[this.length - (1 + i)];
            },
          });
        }
      }
      function is(obj, prop) {
        return obj && obj.hasOwnProperty("type") && obj.type == prop;
      }
      function log(str) {}
      module.exports.parse = parse;
      function parse(text, dupKeys) {
        let stack = [];
        let tokens = [];
        extendArray(stack);
        extendArray(tokens);
        let emit = function (t) {
          tokens.push(t);
        };
        lexer.lexString(text, emit);
        if (tokens[0].type == LEX_LB && tokens.last(0).type != LEX_RB) {
          tokens.push({
            type: LEX_RB,
            value: "]",
            row: -1,
            col: -1,
          });
        }
        if (tokens[0].type == LEX_LCB && tokens.last(0).type != LEX_RCB) {
          tokens.push({
            type: LEX_RCB,
            value: "}",
            row: -1,
            col: -1,
          });
        }
        for (let i = 0; i < tokens.length; i++) {
          log("Shifting " + tokens[i].type);
          stack.push(tokens[i]);
          log(stack);
          log("Reducing...");
          while (reduce(stack)) {
            log(stack);
            log("Reducing...");
          }
        }
        if (stack.length == 1 && stack[0].type == LEX_KVLIST) {
          log("Pre-compile error fix 1");
          stack = [
            {
              type: LEX_OBJ,
              value: stack[0].value,
            },
          ];
        }
        return compileOST(stack[0], dupKeys);
      }
      function reduce(stack) {
        let next = stack.pop();
        switch (next.type) {
          case LEX_KEY:
            if (next.value.trim() == "true") {
              log("Rule 5");
              stack.push({
                type: LEX_BOOLEAN,
                value: "true",
              });
              return true;
            }
            if (next.value.trim() == "false") {
              log("Rule 6");
              stack.push({
                type: LEX_BOOLEAN,
                value: "false",
              });
              return true;
            }
            if (next.value.trim() == "null") {
              log("Rule 7");
              stack.push({
                type: LEX_VALUE,
                value: null,
              });
              return true;
            }
            break;

          case LEX_TOKEN:
            if (is(stack.peek(), LEX_KEY)) {
              log("Rule 11a");
              stack.peek().value += next.value;
              return true;
            }
            log("Rule 11c");
            stack.push({
              type: LEX_KEY,
              value: next.value,
            });
            return true;

          case LEX_INT:
            if (is(next, LEX_INT) && is(stack.peek(), LEX_KEY)) {
              log("Rule 11b");
              stack.peek().value += next.value;
              return true;
            }
            log("Rule 11f");
            next.type = LEX_VALUE;
            stack.push(next);
            return true;

          case LEX_QUOTE:
            log("Rule 11d");
            next.type = LEX_VALUE;
            next.value = next.value;
            stack.push(next);
            return true;

          case LEX_BOOLEAN:
            log("Rule 11e");
            next.type = LEX_VALUE;
            if (next.value == "true") {
              next.value = true;
            } else {
              next.value = false;
            }
            stack.push(next);
            return true;

          case LEX_FLOAT:
            log("Rule 11g");
            next.type = LEX_VALUE;
            stack.push(next);
            return true;

          case LEX_VALUE:
            if (is(stack.peek(), LEX_COMMA)) {
              log("Rule 12");
              next.type = LEX_CVALUE;
              stack.pop();
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_COLON)) {
              log("Rule 13");
              next.type = LEX_COVALUE;
              stack.pop();
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && is(stack.last(1), LEX_VALUE)) {
              log("Error rule 1");
              let middleVal = stack.pop();
              stack.peek().value += '"' + middleVal.value + '"';
              stack.peek().value += next.value;
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && is(stack.last(1), LEX_VLIST)) {
              log("Error rule 2");
              let middleVal = stack.pop();
              let oldLastVal = stack.peek().value.pop();
              oldLastVal += '"' + middleVal.value + '"';
              oldLastVal += next.value;
              stack.peek().value.push(oldLastVal);
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && is(stack.last(1), LEX_KVLIST)) {
              log("Error rule 3");
              let middleVal = stack.pop();
              let oldLastVal = stack.peek().value.pop();
              const qChar = next.single ? "'" : '"';
              oldLastVal.value += qChar + middleVal.value + qChar;
              oldLastVal.value += next.value;
              stack.peek().value.push(oldLastVal);
              return true;
            }
            if (is(stack.peek(), LEX_KEY)) {
              log("Error rule 4");
              let keyValue = stack.pop().value;
              next.value = keyValue + next.value;
              stack.push(next);
              return true;
            }
            break;

          case LEX_LIST:
            if (is(next, LEX_LIST) && is(stack.peek(), LEX_COMMA)) {
              log("Rule 12a");
              next.type = LEX_CVALUE;
              stack.pop();
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_COLON)) {
              log("Rule 13a");
              next.type = LEX_COVALUE;
              stack.pop();
              stack.push(next);
              return true;
            }
            break;

          case LEX_OBJ:
            if (is(stack.peek(), LEX_COMMA)) {
              log("Rule 12b");
              let toPush = {
                type: LEX_CVALUE,
                value: next,
              };
              stack.pop();
              stack.push(toPush);
              return true;
            }
            if (is(stack.peek(), LEX_COLON)) {
              log("Rule 13b");
              let toPush = {
                type: LEX_COVALUE,
                value: next,
              };
              stack.pop();
              stack.push(toPush);
              return true;
            }
            if (is(stack.peek(), LEX_KEY)) {
              log("Error rule 9");
              let key = stack.pop();
              stack.push({
                type: LEX_KV,
                key: key.value.trim(),
                value: next,
              });
              return true;
            }
            break;

          case LEX_CVALUE:
            if (is(stack.peek(), LEX_VLIST)) {
              log("Rule 14");
              stack.peek().value.push(next.value);
              return true;
            }
            log("Rule 15");
            stack.push({
              type: LEX_VLIST,
              value: [next.value],
            });
            return true;

          case LEX_VLIST:
            if (is(stack.peek(), LEX_VALUE)) {
              log("Rule 15a");
              next.value.unshift(stack.peek().value);
              stack.pop();
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_LIST)) {
              log("Rule 15b");
              next.value.unshift(stack.peek().value);
              stack.pop();
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_OBJ)) {
              log("Rule 15c");
              next.value.unshift(stack.peek());
              stack.pop();
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && (stack.last(1), LEX_COMMA)) {
              log("Error rule 7");
              let l = stack.pop();
              stack.push({
                type: LEX_VALUE,
                value: l.value,
              });
              log("Start subreduce... (" + l.value + ")");
              while (reduce(stack));
              log("End subreduce");
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_VLIST)) {
              log("Error rule 8");
              stack.peek().value.push(next.value[0]);
              return true;
            }
            break;

          case LEX_COVALUE:
            if (
              is(stack.peek(), LEX_KEY) ||
              is(stack.peek(), LEX_VALUE) ||
              is(stack.peek(), LEX_VLIST)
            ) {
              log("Rule 16");
              let key = stack.pop();
              stack.push({
                type: LEX_KV,
                key: key.value,
                value: next.value,
              });
              return true;
            }
            throw new Error(
              "Got a :value that can't be handled at line " +
                next.row +
                ":" +
                next.col
            );

          case LEX_KV:
            if (is(stack.last(0), LEX_COMMA) && is(stack.last(1), LEX_KVLIST)) {
              log("Rule 17");
              stack.last(1).value.push(next);
              stack.pop();
              return true;
            }
            log("Rule 18");
            stack.push({
              type: LEX_KVLIST,
              value: [next],
            });
            return true;

          case LEX_KVLIST:
            if (is(stack.peek(), LEX_KVLIST)) {
              log("Rule 17a");
              next.value.forEach(function (i) {
                stack.peek().value.push(i);
              });
              return true;
            }
            break;

          case LEX_RB:
            if (is(stack.peek(), LEX_VLIST) && is(stack.last(1), LEX_LB)) {
              log("Rule 19");
              let l = stack.pop();
              stack.pop();
              stack.push({
                type: LEX_LIST,
                value: l.value,
              });
              return true;
            }
            if (is(stack.peek(), LEX_LIST) && is(stack.last(1), LEX_LB)) {
              log("Rule 19b");
              let l = stack.pop();
              stack.pop();
              stack.push({
                type: LEX_LIST,
                value: [l.value],
              });
              return true;
            }
            if (is(stack.peek(), LEX_LB)) {
              log("Rule 22");
              stack.pop();
              stack.push({
                type: LEX_LIST,
                value: [],
              });
              return true;
            }
            if (is(stack.peek(), LEX_VALUE) && is(stack.last(1), LEX_LB)) {
              log("Rule 23");
              let val = stack.pop().value;
              stack.pop();
              stack.push({
                type: LEX_LIST,
                value: [val],
              });
              return true;
            }
            if (is(stack.peek(), LEX_OBJ) && is(stack.last(1), LEX_LB)) {
              log("Rule 23b");
              let val = stack.pop();
              stack.pop();
              stack.push({
                type: LEX_LIST,
                value: [val],
              });
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && is(stack.last(1), LEX_COMMA)) {
              log("Error rule 5");
              let l = stack.pop();
              stack.push({
                type: LEX_VALUE,
                value: l.value,
              });
              log("Start subreduce... (" + l.value + ")");
              while (reduce(stack));
              log("End subreduce");
              stack.push({
                type: LEX_RB,
              });
              return true;
            }
            if (
              is(stack.peek(), LEX_COMMA) &&
              (is(stack.last(1), LEX_KEY) ||
                is(stack.last(1), LEX_OBJ) ||
                is(stack.last(1), LEX_VALUE))
            ) {
              log("Error rule 5a");
              stack.pop();
              stack.push({
                type: LEX_RB,
                value: "]",
              });
              log("Start subreduce...");
              log("Content: " + JSON.stringify(stack));
              while (reduce(stack));
              log("End subreduce");
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && is(stack.last(1), LEX_LB)) {
              log("Error rule 5b");
              let v = stack.pop();
              stack.pop();
              stack.push({
                type: LEX_LIST,
                value: [v.value],
              });
              return true;
            }
            if (is(stack.peek(), LEX_COMMA) && is(stack.last(1), LEX_VLIST)) {
              log("Error rule 5c");
              stack.pop();
              stack.push({
                type: LEX_RB,
              });
              log("Start subreduce...");
              log("Content: " + JSON.stringify(stack));
              while (reduce(stack));
              log("End subreduce");
              return true;
            }
            break;

          case LEX_RCB:
            if (is(stack.peek(), LEX_KVLIST) && is(stack.last(1), LEX_LCB)) {
              log("Rule 20");
              let l = stack.pop();
              stack.pop();
              stack.push({
                type: LEX_OBJ,
                value: l.value,
              });
              return true;
            }
            if (is(stack.peek(), LEX_LCB)) {
              log("Rule 21");
              stack.pop();
              stack.push({
                type: LEX_OBJ,
                value: null,
              });
              return true;
            }
            if (is(stack.peek(), LEX_KEY) && is(stack.last(1), LEX_COLON)) {
              log("Error rule 4a");
              let l = stack.pop();
              stack.push({
                type: LEX_VALUE,
                value: l.value,
              });
              log("Start subreduce... (" + l.value + ")");
              while (reduce(stack));
              log("End subreduce");
              stack.push({
                type: LEX_RCB,
              });
              return true;
            }
            if (is(stack.peek(), LEX_COLON)) {
              log("Error rule 4b");
              stack.push({
                type: LEX_VALUE,
                value: null,
              });
              log("Starting subreduce...");
              while (reduce(stack));
              log("End subreduce.");
              stack.push({
                type: LEX_RCB,
              });
              return true;
            }
            if (is(stack.peek(), LEX_COMMA)) {
              log("Error rule 10a");
              stack.pop();
              stack.push({
                type: LEX_RCB,
              });
              return true;
            }
            throw new Error(
              "Found } that I can't handle at line " + next.row + ":" + next.col
            );

          case LEX_COMMA:
            if (is(stack.peek(), LEX_COMMA)) {
              log("Comma error rule 1");
              return true;
            }
            if (is(stack.peek(), LEX_KEY)) {
              log("Comma error rule 2");
              const key = stack.pop();
              stack.push({
                type: LEX_VALUE,
                value: key.value,
              });
              log("Starting subreduce...");
              while (reduce(stack));
              log("End subreduce.");
              stack.push(next);
              return true;
            }
            if (is(stack.peek(), LEX_COLON)) {
              log("Comma error rule 3");
              stack.push({
                type: LEX_VALUE,
                value: null,
              });
              log("Starting subreduce...");
              while (reduce(stack));
              log("End subreduce.");
              stack.push(next);
              return true;
            }
        }
        stack.push(next);
        return false;
      }
      function compileOST(tree, dupKeys) {
        let rawTypes = ["boolean", "number", "string"];
        if (rawTypes.indexOf(typeof tree) != -1) return tree;
        if (tree === null) return null;
        if (Array.isArray(tree)) {
          let toR = [];
          while (tree.length > 0) toR.unshift(compileOST(tree.pop()));
          return toR;
        }
        if (is(tree, LEX_OBJ)) {
          let toR = {};
          if (tree.value === null) return {};
          tree.value.forEach(function (i) {
            const key = i.key;
            const val = compileOST(i.value);
            if (dupKeys && key in toR) {
              toR[key] = {
                value: toR[key],
                next: val,
              };
            } else {
              toR[key] = val;
            }
          });
          return toR;
        }
        if (is(tree, LEX_LIST)) {
          return compileOST(tree.value);
        }
        return tree.value;
      }
    },
    885: (module) => {
      if (true && typeof module.exports === "object") module.exports = Lexer;
      Lexer.defunct = function (chr) {
        throw new Error(
          "Unexpected character at index " + (this.index - 1) + ": " + chr
        );
      };
      function Lexer(defunct) {
        if (typeof defunct !== "function") defunct = Lexer.defunct;
        var tokens = [];
        var rules = [];
        var remove = 0;
        this.state = 0;
        this.index = 0;
        this.input = "";
        this.addRule = function (pattern, action, start) {
          var global = pattern.global;
          if (!global) {
            var flags = "g";
            if (pattern.multiline) flags += "m";
            if (pattern.ignoreCase) flags += "i";
            pattern = new RegExp(pattern.source, flags);
          }
          if (Object.prototype.toString.call(start) !== "[object Array]")
            start = [0];
          rules.push({
            pattern: pattern,
            global: global,
            action: action,
            start: start,
          });
          return this;
        };
        this.setInput = function (input) {
          remove = 0;
          this.state = 0;
          this.index = 0;
          tokens.length = 0;
          this.input = input;
          return this;
        };
        this.lex = function () {
          if (tokens.length) return tokens.shift();
          this.reject = true;
          while (this.index <= this.input.length) {
            var matches = scan.call(this).splice(remove);
            var index = this.index;
            while (matches.length) {
              if (this.reject) {
                var match = matches.shift();
                var result = match.result;
                var length = match.length;
                this.index += length;
                this.reject = false;
                remove++;
                var token = match.action.apply(this, result);
                if (this.reject) this.index = result.index;
                else if (typeof token !== "undefined") {
                  switch (Object.prototype.toString.call(token)) {
                    case "[object Array]":
                      tokens = token.slice(1);
                      token = token[0];

                    default:
                      if (length) remove = 0;
                      return token;
                  }
                }
              } else break;
            }
            var input = this.input;
            if (index < input.length) {
              if (this.reject) {
                remove = 0;
                var token = defunct.call(this, input.charAt(this.index++));
                if (typeof token !== "undefined") {
                  if (
                    Object.prototype.toString.call(token) === "[object Array]"
                  ) {
                    tokens = token.slice(1);
                    return token[0];
                  } else return token;
                }
              } else {
                if (this.index !== index) remove = 0;
                this.reject = true;
              }
            } else if (matches.length) this.reject = true;
            else break;
          }
        };
        function scan() {
          var matches = [];
          var index = 0;
          var state = this.state;
          var lastIndex = this.index;
          var input = this.input;
          for (var i = 0, length = rules.length; i < length; i++) {
            var rule = rules[i];
            var start = rule.start;
            var states = start.length;
            if (
              !states ||
              start.indexOf(state) >= 0 ||
              (state % 2 && states === 1 && !start[0])
            ) {
              var pattern = rule.pattern;
              pattern.lastIndex = lastIndex;
              var result = pattern.exec(input);
              if (result && result.index === lastIndex) {
                var j = matches.push({
                  result: result,
                  action: rule.action,
                  length: result[0].length,
                });
                if (rule.global) index = j;
                while (--j > index) {
                  var k = j - 1;
                  if (matches[j].length > matches[k].length) {
                    var temple = matches[j];
                    matches[j] = matches[k];
                    matches[k] = temple;
                  }
                }
              }
            }
          }
          return matches;
        }
      }
    },
    237: () => {
      if (!String.fromCodePoint) {
        (function () {
          var defineProperty = (function () {
            try {
              var object = {};
              var $defineProperty = Object.defineProperty;
              var result =
                $defineProperty(object, object, object) && $defineProperty;
            } catch (error) {}
            return result;
          })();
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function (_) {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (
                !isFinite(codePoint) ||
                codePoint < 0 ||
                codePoint > 1114111 ||
                floor(codePoint) != codePoint
              ) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = (codePoint % 1024) + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (defineProperty) {
            defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true,
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    },
    840: (module, exports, __webpack_require__) => {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports["default"] = void 0;
      __webpack_require__(237);
      var jsEscapeRegex =
        /\\(u\{([0-9A-Fa-f]+)\}|u([0-9A-Fa-f]{4})|x([0-9A-Fa-f]{2})|([1-7][0-7]{0,2}|[0-7]{2,3})|(['"tbrnfv0\\]))|\\U([0-9A-Fa-f]{8})/g;
      var usualEscapeSequences = {
        0: "\0",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "\t",
        v: "\v",
        "'": "'",
        '"': '"',
        "\\": "\\",
      };
      var fromHex = function fromHex(str) {
        return String.fromCodePoint(parseInt(str, 16));
      };
      var fromOct = function fromOct(str) {
        return String.fromCodePoint(parseInt(str, 8));
      };
      var _default = function _default(string) {
        return string.replace(
          jsEscapeRegex,
          function (
            _,
            __,
            varHex,
            longHex,
            shortHex,
            octal,
            specialCharacter,
            python
          ) {
            if (varHex !== undefined) {
              return fromHex(varHex);
            } else if (longHex !== undefined) {
              return fromHex(longHex);
            } else if (shortHex !== undefined) {
              return fromHex(shortHex);
            } else if (octal !== undefined) {
              return fromOct(octal);
            } else if (python !== undefined) {
              return fromHex(python);
            } else {
              return usualEscapeSequences[specialCharacter];
            }
          }
        );
      };
      exports["default"] = _default;
      module.exports = exports.default;
    },
    458: (__unused_webpack_module, exports) => {
      (function (root) {
        var stringFromCharCode = String.fromCharCode;
        function ucs2decode(string) {
          var output = [];
          var counter = 0;
          var length = string.length;
          var value;
          var extra;
          while (counter < length) {
            value = string.charCodeAt(counter++);
            if (value >= 55296 && value <= 56319 && counter < length) {
              extra = string.charCodeAt(counter++);
              if ((extra & 64512) == 56320) {
                output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
              } else {
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        }
        function ucs2encode(array) {
          var length = array.length;
          var index = -1;
          var value;
          var output = "";
          while (++index < length) {
            value = array[index];
            if (value > 65535) {
              value -= 65536;
              output += stringFromCharCode(((value >>> 10) & 1023) | 55296);
              value = 56320 | (value & 1023);
            }
            output += stringFromCharCode(value);
          }
          return output;
        }
        function checkScalarValue(codePoint) {
          if (codePoint >= 55296 && codePoint <= 57343) {
            throw Error(
              "Lone surrogate U+" +
                codePoint.toString(16).toUpperCase() +
                " is not a scalar value"
            );
          }
        }
        function createByte(codePoint, shift) {
          return stringFromCharCode(((codePoint >> shift) & 63) | 128);
        }
        function encodeCodePoint(codePoint) {
          if ((codePoint & 4294967168) == 0) {
            return stringFromCharCode(codePoint);
          }
          var symbol = "";
          if ((codePoint & 4294965248) == 0) {
            symbol = stringFromCharCode(((codePoint >> 6) & 31) | 192);
          } else if ((codePoint & 4294901760) == 0) {
            checkScalarValue(codePoint);
            symbol = stringFromCharCode(((codePoint >> 12) & 15) | 224);
            symbol += createByte(codePoint, 6);
          } else if ((codePoint & 4292870144) == 0) {
            symbol = stringFromCharCode(((codePoint >> 18) & 7) | 240);
            symbol += createByte(codePoint, 12);
            symbol += createByte(codePoint, 6);
          }
          symbol += stringFromCharCode((codePoint & 63) | 128);
          return symbol;
        }
        function utf8encode(string) {
          var codePoints = ucs2decode(string);
          var length = codePoints.length;
          var index = -1;
          var codePoint;
          var byteString = "";
          while (++index < length) {
            codePoint = codePoints[index];
            byteString += encodeCodePoint(codePoint);
          }
          return byteString;
        }
        function readContinuationByte() {
          if (byteIndex >= byteCount) {
            throw Error("Invalid byte index");
          }
          var continuationByte = byteArray[byteIndex] & 255;
          byteIndex++;
          if ((continuationByte & 192) == 128) {
            return continuationByte & 63;
          }
          throw Error("Invalid continuation byte");
        }
        function decodeSymbol() {
          var byte1;
          var byte2;
          var byte3;
          var byte4;
          var codePoint;
          if (byteIndex > byteCount) {
            throw Error("Invalid byte index");
          }
          if (byteIndex == byteCount) {
            return false;
          }
          byte1 = byteArray[byteIndex] & 255;
          byteIndex++;
          if ((byte1 & 128) == 0) {
            return byte1;
          }
          if ((byte1 & 224) == 192) {
            byte2 = readContinuationByte();
            codePoint = ((byte1 & 31) << 6) | byte2;
            if (codePoint >= 128) {
              return codePoint;
            } else {
              throw Error("Invalid continuation byte");
            }
          }
          if ((byte1 & 240) == 224) {
            byte2 = readContinuationByte();
            byte3 = readContinuationByte();
            codePoint = ((byte1 & 15) << 12) | (byte2 << 6) | byte3;
            if (codePoint >= 2048) {
              checkScalarValue(codePoint);
              return codePoint;
            } else {
              throw Error("Invalid continuation byte");
            }
          }
          if ((byte1 & 248) == 240) {
            byte2 = readContinuationByte();
            byte3 = readContinuationByte();
            byte4 = readContinuationByte();
            codePoint =
              ((byte1 & 7) << 18) | (byte2 << 12) | (byte3 << 6) | byte4;
            if (codePoint >= 65536 && codePoint <= 1114111) {
              return codePoint;
            }
          }
          throw Error("Invalid UTF-8 detected");
        }
        var byteArray;
        var byteCount;
        var byteIndex;
        function utf8decode(byteString) {
          byteArray = ucs2decode(byteString);
          byteCount = byteArray.length;
          byteIndex = 0;
          var codePoints = [];
          var tmp;
          while ((tmp = decodeSymbol()) !== false) {
            codePoints.push(tmp);
          }
          return ucs2encode(codePoints);
        }
        root.version = "3.0.0";
        root.encode = utf8encode;
        root.decode = utf8decode;
      })(false ? 0 : exports);
    },
    138: (module, __unused_webpack_exports, __webpack_require__) => {
      const dJSON = __webpack_require__(29);
      module.exports = {
        dJSON: dJSON,
      };
    },
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = __webpack_require__(138);
  var __webpack_export_target__ = window;
  for (var i in __webpack_exports__)
    __webpack_export_target__[i] = __webpack_exports__[i];
  if (__webpack_exports__.__esModule)
    Object.defineProperty(__webpack_export_target__, "__esModule", {
      value: true,
    });
})();
