// ==UserScript==
// @name         texmath
// @namespace    https://www.cc98.org/
// @version      0.1
// @description  TeXmath support for cc98 markdown posts
// @author       Secant
// @match        https://www.cc98.org/topic/*
// @grant        none
// jshint esversion: 6
(function () {
  "use strict";
  function texmath(md, options) {
    const delimiters = "dollars";
    const imgtexOptions = (options && options.imgtexOptions) || {
      apiBase: "https://math.now.sh",
      color: "black",
    };

    if (!texmath.imgtex) {
      // else ... depricated `use` method was used ...
      if (options && typeof options.engine === "object") {
        texmath.imgtex = options.engine;
      }
      // artifical error object.
      else
        texmath.imgtex = {
          renderToString() {
            return "No math renderer found.";
          },
        };
    }

    if (delimiters in texmath.rules) {
      for (const rule of texmath.rules[delimiters].inline) {
        md.inline.ruler.before("escape", rule.name, texmath.inline(rule)); // ! important
        md.renderer.rules[rule.name] = (tokens, idx) =>
          rule.tmpl.replace(
            /\$1/,
            texmath.render(
              tokens[idx].content,
              !!rule.displayMode,
              imgtexOptions
            )
          );
      }

      for (const rule of texmath.rules[delimiters].block) {
        md.block.ruler.before("fence", rule.name, texmath.block(rule)); // ! important for ```math delimiters
        md.renderer.rules[rule.name] = (tokens, idx) =>
          rule.tmpl.replace(
            /\$1/,
            texmath.render(tokens[idx].content, true, imgtexOptions)
          );
      }
    }
  }

  texmath.inline = (rule) =>
    function (state, silent) {
      const pos = state.pos;
      const str = state.src;
      const pre =
        str.startsWith(rule.tag, (rule.rex.lastIndex = pos)) &&
        (!rule.pre || rule.pre(str, pos)); // valid pre-condition ...
      const match = pre && rule.rex.exec(str);
      const res =
        !!match &&
        pos < rule.rex.lastIndex &&
        (!rule.post || rule.post(str, rule.rex.lastIndex - 1));

      if (res) {
        if (!silent) {
          const token = state.push(rule.name, "math", 0);
          token.content = match[1];
          token.markup = rule.tag;
        }
        state.pos = rule.rex.lastIndex;
      }
      return res;
    };

  texmath.block = (rule) =>
    function block(state, begLine, endLine, silent) {
      const pos = state.bMarks[begLine] + state.tShift[begLine];
      const str = state.src;
      const pre =
        str.startsWith(rule.tag, (rule.rex.lastIndex = pos)) &&
        (!rule.pre || rule.pre(str, pos)); // valid pre-condition ....
      const match = pre && rule.rex.exec(str);
      const res =
        !!match &&
        pos < rule.rex.lastIndex &&
        (!rule.post || rule.post(str, rule.rex.lastIndex - 1));

      if (res && !silent) {
        // match and valid post-condition ...
        const endpos = rule.rex.lastIndex - 1;
        let curline;

        for (curline = begLine; curline < endLine; curline++)
          if (
            endpos >= state.bMarks[curline] + state.tShift[curline] &&
            endpos <= state.eMarks[curline]
          )
            // line for end of block math found ...
            break;

        // "this will prevent lazy continuations from ever going past our end marker"
        // s. https://github.com/markdown-it/markdown-it-container/blob/master/index.js
        const lineMax = state.lineMax;
        state.lineMax = curline;

        // begin token
        let token = state.push(rule.name, "math", 1); // 'math_block'
        token.block = true;
        token.markup = rule.tag;
        token.content = match[1];
        token.map = [begLine, curline];
        // end token
        token = state.push(rule.name + "_end", "math", -1);
        token.block = true;
        token.markup = rule.tag;

        state.lineMax = lineMax;
        state.line = curline + 1;
      }
      return res;
    };

  texmath.render = function (tex, displayMode, options) {
    options.displayMode = displayMode;
    let res;
    try {
      res = texmath.imgtex.renderToString(tex, options);
    } catch (err) {
      res = tex + ": " + err.message;
    }
    return res;
  };

  // used for enable/disable math rendering by `markdown-it`
  texmath.inlineRuleNames = ["math_inline"];
  texmath.blockRuleNames = ["math_block"];

  texmath.$_pre = (str, beg) => {
    const prv = beg > 0 ? str[beg - 1].charCodeAt(0) : false;
    return (
      !prv ||
      (prv !== 0x5c && // no backslash,
        (prv < 0x30 || prv > 0x39))
    ); // no decimal digit .. before opening '$'
  };
  texmath.$_post = (str, end) => {
    const nxt = str[end + 1] && str[end + 1].charCodeAt(0);
    return !nxt || nxt < 0x30 || nxt > 0x39; // no decimal digit .. after closing '$'
  };

  texmath.rules = {
    dollars: {
      inline: [
        {
          name: "math_inline",
          rex: /\$((?:\S)|(?:\S.*?\S))\$/gy,
          tmpl: "$1",
          tag: "$",
          pre: texmath.$_pre,
          post: texmath.$_post,
        },
      ],
      block: [
        {
          name: "math_block",
          rex: /\${2}([^$]+?)\${2}/gmy,
          tmpl: "<center>$1</center>",
          tag: "$$",
        },
      ],
    },
  };

  window.texmath = texmath;
})();