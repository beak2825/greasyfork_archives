// ==UserScript==
// @name        math
// @namespace   Violentmonkey Scripts
// @match       https://www.ncbi.nlm.nih.gov/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     0.0.2
// @author      chopong
// @description 2022/9/9 11:20:58
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451065/math.user.js
// @updateURL https://update.greasyfork.org/scripts/451065/math.meta.js
// ==/UserScript==

var copymath = function(){
  "use strict";
  var mathblocks = document.querySelectorAll("math");
  var num = mathblocks.length;
  if (num>0){
    for (var i=0;i<num;i++){
      mathblocks[i].addEventListener("click",function(){
        var latexcontent = MathML2LaTeX.convert(this.outerHTML);
        
        let transfer = document.createElement('input');
        this.parentNode.appendChild(transfer);
        // document.body.appendChild(transfer);
        transfer.value = latexcontent  // 这里表示想要复制的内容
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
        }
        this.parentNode.removeChild(transfer);
        // document.body.removeChild(transfer);
        
        console.log(latexcontent)
        
        if(window.Notification && Notification.permission !== "denied") {
          Notification.requestPermission(function(status) {
            var n = new Notification('LaTeX', { body: latexcontent }); 
          });
        }
      });
    }
  }
};


// ===============================
var MathML2LaTeX = (function () {
  'use strict';

  const Brackets = {
    left: ['(', '[', '{', '|', '‖', '⟨', '⌊', '⌈', '⌜'],
    right: [')', ']', '}', '|', '‖', '⟩', '⌋', '⌉', '⌝'],
    isPair: function(l, r){
      const idx = this.left.indexOf(l);
      return r === this.right[idx];
    },
    contains: function(it) {
      return this.isLeft(it) || this.isRight(it);
    },
    isLeft: function(it) {
      return this.left.indexOf(it) > -1
    },
    isRight: function(it) {
      return this.right.indexOf(it) > -1;
    },
    parseLeft: function(it, stretchy = true) {
      if(this.left.indexOf(it) < 0){ return it}
      let r = '';
      switch(it){
        case '(':
        case '[':
        case '|': r = `\\left${it}`;
          break;
        case '‖': r = '\\left\\|';
          break;
        case '{': r = '\\left\\{';
          break;
        case '⟨': r = '\\left\\langle ';
          break;
        case '⌊': r = '\\left\\lfloor ';
          break;
        case '⌈': r = '\\left\\lceil ';
          break;
        case '⌜': r = '\\left\\ulcorner ';
          break;
      }
      return (stretchy ? r : r.replace('\\left', ''));
    },

    parseRight: function(it, stretchy = true) {
      if(this.right.indexOf(it) < 0){ return it}
      let r = '';
      switch(it){
        case ')':
        case ']':
        case '|': r = `\\right${it}`;
          break;
        case '‖': r = '\\right\\|';
          break;
        case '}': r = '\\right\\}';
          break;
        case '⟩': r = ' \\right\\rangle';
          break;
        case '⌋': r = ' \\right\\rfloor';
          break;
        case '⌉': r = ' \\right\\rceil';
          break;
        case '⌝': r = ' \\right\\urcorner';
          break;
      }
      return (stretchy ? r : r.replace('\\right', ''));
    }
  };

  // @see https://en.wikibooks.org/wiki/LaTeX/Mathematics#List_of_mathematical_symbols
  // @see https://www.andy-roberts.net/res/writing/latex/symbols.pdf   (more completed)
  // @see http://www.rpi.edu/dept/arc/training/latex/LaTeX_symbols.pdf (wtf)
  // https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols

  // accessed directly from keyboard
  // + - = ! / ( ) [ ] < > | ' : *

  const MathSymbol = {
    parseIdentifier: function(it) {
      if(it.length === 0){ return '' }
      if(it.length === 1){
        const charCode = it.charCodeAt(0);
        let index = this.greekLetter.decimals.indexOf(charCode);
        if ( index > -1) {
          return this.greekLetter.scripts[index] + ' ';
        } else {
          return it;
        }
      } else {
        return this.parseMathFunction(it);
      }
    },

    parseOperator: function(it) {
      if(it.length === 0){ return ''}
      if(it.length === 1){
        const charCode = it.charCodeAt(0);
        const opSymbols = [
          this.bigCommand,
          this.relation,
          this.binaryOperation,
          this.setAndLogic,
          this.delimiter,
          this.other
        ];

        const padSpaceBothSide = [false, true, true, false, false, false];

        for(let i = 0; i < opSymbols.length; i++){
          const opSymbol = opSymbols[i];
          const index = opSymbol.decimals.indexOf(charCode);
          if(index > -1) {
            if(padSpaceBothSide[i]){
              return [' ', opSymbol.scripts[index], ' '].join('');
            }else {
              return opSymbol.scripts[index] + ' ';
            }
          }
        }
        return it;
      } else {
        return this.parseMathFunction(it);
      }
    },

    parseMathFunction: function (it) {
      const marker = T.createMarker();
      const replacements = [];
      this.mathFunction.names.forEach((name, index) => {
        const regExp = new RegExp(name, 'g');
        if(it.match(regExp)){
          replacements.push(this.mathFunction.scripts[index]);
          it = it.replace(regExp, marker.next() + ' ');
        }
      });
      return marker.replaceBack(it, replacements);
    },

    //FIXME COMPLETE ME
    overScript: {
      decimals: [9182],
      templates: [
        "\\overbrace{@v}",
      ]
    },

    //FIXME COMPLETE ME
    underScript: {
      decimals: [9183],
      templates: [
        "\\underbrace{@v}"
      ]
    },

    // sum, integral...
    bigCommand: {
      decimals: [8721, 8719, 8720, 10753, 10754, 10752, 8899, 8898, 10756, 10758, 8897, 8896, 8747, 8750, 8748, 8749, 10764, 8747],
      scripts: [
        "\\sum",
        "\\prod",
        "\\coprod",
        "\\bigoplus",
        "\\bigotimes",
        "\\bigodot",
        "\\bigcup",
        "\\bigcap",
        "\\biguplus",
        "\\bigsqcup",
        "\\bigvee",
        "\\bigwedge",
        "\\int",
        "\\oint",
        "\\iint",
        "\\iiint",
        "\\iiiint",
        "\\idotsint",
      ]
    },

    // mo
    relation: {
      decimals: [60, 62, 61, 8741, 8742, 8804, 8805, 8784, 8781, 8904, 8810, 8811, 8801, 8866, 8867, 8834, 8835, 8776, 8712, 8715, 8838, 8839, 8773, 8995, 8994, 8840, 8841, 8771, 8872, 8713, 8847, 8848, 126, 8764, 8869, 8739, 8849, 8850, 8733, 8826, 8827, 10927, 10928, 8800, 8738, 8737],
      scripts: [
        "<",
        ">",
        "=",
        "\\parallel",
        "\\nparallel",
        "\\leq",
        "\\geq",
        "\\doteq",
        "\\asymp",
        "\\bowtie",
        "\\ll",
        "\\gg",
        "\\equiv",
        "\\vdash",
        "\\dashv",
        "\\subset",
        "\\supset",
        "\\approx",
        "\\in",
        "\\ni",
        "\\subseteq",
        "\\supseteq",
        "\\cong",
        "\\smile",
        "\\frown",
        "\\nsubseteq",
        "\\nsupseteq",
        "\\simeq",
        "\\models",
        "\\notin",
        "\\sqsubset",
        "\\sqsupset",
        "\\sim",
        "\\sim",
        "\\perp",
        "\\mid",
        "\\sqsubseteq",
        "\\sqsupseteq",
        "\\propto",
        "\\prec",
        "\\succ",
        "\\preceq",
        "\\succeq",
        "\\neq",
        "\\sphericalangle",
        "\\measuredangle"
          ]
    },

    // complete
    binaryOperation: {
      decimals: [43, 45, 177, 8745, 8900, 8853, 8723, 8746, 9651, 8854, 215, 8846, 9661, 8855, 247, 8851, 9667, 8856, 8727, 8852, 9657, 8857, 8902, 8744, 9711, 8728, 8224, 8743, 8729, 8726, 8225, 8901, 8768, 10815],
      scripts: [
        "+",
        "-",
        "\\pm",
        "\\cap",
        "\\diamond",
        "\\oplus",
        "\\mp",
        "\\cup",
        "\\bigtriangleup",
        "\\ominus",
        "\\times",
        "\\uplus",
        "\\bigtriangledown",
        "\\otimes",
        "\\div",
        "\\sqcap",
        "\\triangleleft",
        "\\oslash",
        "\\ast",
        "\\sqcup",
        "\\triangleright",
        "\\odot",
        "\\star",
        "\\vee",
        "\\bigcirc",
        "\\circ",
        "\\dagger",
        "\\wedge",
        "\\bullet",
        "\\setminus",
        "\\ddagger",
        "\\cdot",
        "\\wr",
        "\\amalg"
          ]
    },

    setAndLogic: {
      decimals: [8707, 8594, 8594, 8708, 8592, 8592, 8704, 8614, 172, 10233, 8834, 8658, 10233, 8835, 8596, 8712, 10234, 8713, 8660, 8715, 8868, 8743, 8869, 8744, 8709, 8709],
      scripts: [
        "\\exists",
        "\\rightarrow",
        "\\to",
        "\\nexists",
        "\\leftarrow",
        "\\gets",
        "\\forall",
        "\\mapsto",
        "\\neg",
        "\\implies",
        "\\subset",
        "\\Rightarrow",
        "\\implies",
        "\\supset",
        "\\leftrightarrow",
        "\\in",
        "\\iff",
        "\\notin",
        "\\Leftrightarrow",
        "\\ni",
        "\\top",
        "\\land",
        "\\bot",
        "\\lor",
        "\\emptyset",
        "\\varnothing"
          ]
    },

    delimiter: {
      decimals: [124, 8739, 8214, 47, 8726, 123, 125, 10216, 10217, 8593, 8657, 8968, 8969, 8595, 8659, 8970, 8971],
      scripts: [
        "|",
        "\\mid",
        "\\|",
        "/",
        "\\backslash",
        "\\{",
        "\\}",
        "\\langle",
        "\\rangle",
        "\\uparrow",
        "\\Uparrow",
        "\\lceil",
        "\\rceil",
        "\\downarrow",
        "\\Downarrow",
        "\\lfloor",
        "\\rfloor"
      ]
    },

    greekLetter: {
      decimals: [ 913, 945, 925, 957, 914, 946, 926, 958, 915, 947, 927, 959, 916, 948, 928, 960, 982, 917, 1013, 949, 929, 961, 1009, 918, 950, 931, 963, 962, 919, 951, 932, 964, 920, 952, 977, 933, 965, 921, 953, 934, 981, 966, 922, 954, 1008, 935, 967, 923, 955, 936, 968, 924, 956, 937, 969 ],
      scripts: [
        "A"         , "\\alpha"   ,
        "N"         , "\\nu"      ,
        "B"         , "\\beta"    ,
        "\\Xi"      , "\\xi"      ,
        "\\Gamma"   , "\\gamma"   ,
        "O"         , "o"         ,
        "\\Delta"   , "\\delta"   ,
        "\\Pi"      , "\\pi"      , "\\varpi"      ,
        "E"         , "\\epsilon" , "\\varepsilon" ,
        "P"         , "\\rho"     , "\\varrho"     ,
        "Z"         , "\\zeta"    ,
        "\\Sigma"   , "\\sigma"   , "\\varsigma"   ,
        "H"         , "\\eta"     ,
        "T"         , "\\tau"     ,
        "\\Theta"   , "\\theta"   , "\\vartheta"   ,
        "\\Upsilon" , "\\upsilon" ,
        "I"         , "\\iota"    ,
        "\\Phi"     , "\\phi"     , "\\varphi"     ,
        "K"         , "\\kappa"   , "\\varkappa"   ,
        "X"         , "\\chi"     ,
        "\\Lambda"  , "\\lambda"  ,
        "\\Psi"     , "\\psi"     ,
        "M"         , "\\mu"      ,
        "\\Omega"   , "\\omega"
          ]
    },


    other: {
      decimals: [8706, 305, 8476, 8711, 8501, 240, 567, 8465, 9723, 8502, 8463, 8467, 8472, 8734, 8503],
      scripts: [
        "\\partial",
        "\\imath",
        "\\Re",
        "\\nabla",
        "\\aleph",
        "\\eth",
        "\\jmath",
        "\\Im",
        "\\Box",
        "\\beth",
        "\\hbar",
        "\\ell",
        "\\wp",
        "\\infty",
        "\\gimel"
      ]
    },

    // complete
    // Be careful, the order of these name matters (overlap situation).
    mathFunction: {

      names: [
        "arcsin" , "sinh"   , "sin" , "sec" ,
        "arccos" , "cosh"   , "cos" , "csc" ,
        "arctan" , "tanh"   , "tan" ,
        "arccot" , "coth"   , "cot" ,

        "limsup" , "liminf" , "exp" , "ker" ,
        "deg"    , "gcd"    , "lg"  , "ln"  ,
        "Pr"     , "sup"    , "det" , "hom" ,
        "lim"    , "log"    , "arg" , "dim" ,
        "inf"    , "max"    , "min" ,
      ],
      scripts: [
        "\\arcsin" , "\\sinh"   , "\\sin" , "\\sec" ,
        "\\arccos" , "\\cosh"   , "\\cos" , "\\csc" ,
        "\\arctan" , "\\tanh"   , "\\tan" ,
        "\\arccot" , "\\coth"   , "\\cot" ,

        "\\limsup" , "\\liminf" , "\\exp" , "\\ker" ,
        "\\deg"    , "\\gcd"    , "\\lg"  , "\\ln"  ,
        "\\Pr"     , "\\sup"    , "\\det" , "\\hom" ,
        "\\lim"    , "\\log"    , "\\arg" , "\\dim" ,
        "\\inf"    , "\\max"    , "\\min" ,
      ]
    }
  };

  const T = {}; // Tool
  T.createMarker = function() {
    return {
      idx: -1,
      reReplace: /@\[\[(\d+)\]\]/mg,
      next: function() {
        return `@[[${++this.idx}]]`
      },
      replaceBack: function(str, replacements) {
        return str.replace(this.reReplace, (match, p1) => {
          const index = parseInt(p1);
          return replacements[index];
        });
      }
    }
  };

  /*
   * Set up window for Node.js
   */

  const root = (typeof window !== 'undefined' ? window : {});

  /*
   * Parsing HTML strings
   */

  function canParseHTMLNatively () {
    const Parser = root.DOMParser;
    let canParse = false;

    // Adapted from https://gist.github.com/1129031
    // Firefox/Opera/IE throw errors on unsupported types
    try {
      // WebKit returns null on unsupported types
      if (new Parser().parseFromString('', 'text/html')) {
        canParse = true;
      }
    } catch (e) {}

    return canParse
  }

  function createHTMLParser () {
    const Parser = function () {};

    {
      if (shouldUseActiveX()) {
        Parser.prototype.parseFromString = function (string) {
          const doc = new window.ActiveXObject('htmlfile');
          doc.designMode = 'on'; // disable on-page scripts
          doc.open();
          doc.write(string);
          doc.close();
          return doc
        };
      } else {
        Parser.prototype.parseFromString = function (string) {
          const doc = document.implementation.createHTMLDocument('');
          doc.open();
          doc.write(string);
          doc.close();
          return doc
        };
      }
    }
    return Parser
  }

  function shouldUseActiveX () {
    let useActiveX = false;
    try {
      document.implementation.createHTMLDocument('').open();
    } catch (e) {
      if (window.ActiveXObject) useActiveX = true;
    }
    return useActiveX
  }

  var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

  const NodeTool = {
    parseMath: function(html) {
      const parser = new HTMLParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.querySelector('math');
    },
    getChildren: function(node) {
      return node.children;
    },
    getNodeName: function(node) {
      return node.tagName.toLowerCase();
    },
    getNodeText: function(node) {
      return node.textContent;
    },
    getAttr: function(node, attrName, defaultValue) {
      const value = node.getAttribute(attrName);
      if ( value === null) {
        return defaultValue;
      } else {
        return value;
      }
    },
    getPrevNode: function(node) {
      return node.previousElementSibling;
    },
    getNextNode: function(node) {
      return node.nextElementSibling;
    }
  };

  function convert(mathmlHtml){
    const math = NodeTool.parseMath(mathmlHtml);
    return toLatex(parse(math));
  }

  function toLatex(result) {
    // binomial coefficients
    result = result.replace(/\\left\(\\DELETE_BRACKET_L/g, '');
    result = result.replace(/\\DELETE_BRACKET_R\\right\)/g, '');
    result = result.replace(/\\DELETE_BRACKET_L/g, '');
    result = result.replace(/\\DELETE_BRACKET_R/g, '');
    return result;
  }

  function parse(node) {
    const children = NodeTool.getChildren(node);
    if (!children || children.length === 0) {
      return parseLeaf(node);
    } else {
      return parseContainer(node, children);
    }
  }

  // @see https://www.w3.org/TR/MathML3/chapter7.html
  function parseLeaf(node) {
    let r = '';
    const nodeName = NodeTool.getNodeName(node);
    switch(nodeName){
      case 'mi': r = parseElementMi(node);
        break;
      case 'mn': r = parseElementMn(node);
        break;
      case 'mo': r = parseOperator(node);
        break;
      case 'ms': r = parseElementMs(node);
        break;
      case 'mtext': r = parseElementMtext(node);
        break;
      case 'mglyph': r = parseElementMglyph(node);
        break;
      case 'mprescripts': r = '';
        break;
      case 'mspace': r = parseElementMspace();
      case 'none': r = '\\:';
      //TODO other usecase of 'none' ?
        break;
      default: r = escapeSpecialChars(NodeTool.getNodeText(node).trim());
        break;
    }
    return r;
  }

  // operator token, mathematical operators
  function parseOperator(node) {
    let it = NodeTool.getNodeText(node).trim();
    it = MathSymbol.parseOperator(it);
    return escapeSpecialChars(it);
  }

  // Math identifier
  function parseElementMi(node){
    let it = NodeTool.getNodeText(node).trim();
    it = MathSymbol.parseIdentifier(it);
    return escapeSpecialChars(it);
  }

  // Math Number
  function parseElementMn(node){
    let it = NodeTool.getNodeText(node).trim();
    return escapeSpecialChars(it);
  }

  // Math String
  function parseElementMs(node){
    const content = NodeTool.getNodeText(node).trimRight();
    const it = escapeSpecialChars(content);
    return ['"', it, '"'].join('');
  }

  // Math Text
  function parseElementMtext(node){
    const content = NodeTool.getNodeText(node);
    const it = escapeSpecialChars(content);
    return `\\text{${it}}`;
  }

  // Math glyph (image)
  function parseElementMglyph(node){
    const it = ['"', NodeTool.getAttr(node, 'alt', ''), '"'].join('');
    return escapeSpecialChars(it);
  }

  // TODO need or not
  function parseElementMspace(node){
    return '';
  }

  function escapeSpecialChars(text) {
    const specialChars = /\$|%|_|&|#|\{|\}/g;
    text = text.replace(specialChars, char => `\\${ char }`);
    return text;
  }


  function parseContainer(node, children) {
    const render = getRender(node);
    if(render){
      return render(node, children);
    } else {
      throw new Error(`Couldn't get render function for container node: ${NodeTool.getNodeName(node)}`);
    }
  }

  function renderChildren(children) {
    const parts = [];
    let lefts = [];
    Array.prototype.forEach.call(children, (node) => {
      if(NodeTool.getNodeName(node) === 'mo'){
        const op = NodeTool.getNodeText(node).trim();
        if(Brackets.contains(op)){
          let stretchy = NodeTool.getAttr(node, 'stretchy', 'true');
          stretchy = ['', 'true'].indexOf(stretchy) > -1;
          // 操作符是括號
          if(Brackets.isRight(op)){
            const nearLeft = lefts[lefts.length - 1];
            if(nearLeft){
              if(Brackets.isPair(nearLeft, op)){
                parts.push(Brackets.parseRight(op, stretchy));
                lefts.pop();
              } else {
                // some brackets left side is same as right side.
                if(Brackets.isLeft(op)) {
                  parts.push(Brackets.parseLeft(op, stretchy));
                  lefts.push(op);
                } else {
                  console.error("bracket not match");
                }
              }
            }else {
              // some brackets left side is same as right side.
              if(Brackets.isLeft(op)) {
                parts.push(Brackets.parseLeft(op, stretchy));
                lefts.push(op);
              }else {
                console.error("bracket not match");
              }
            }
          } else {
            parts.push(Brackets.parseLeft(op, stretchy));
            lefts.push(op);
          }
        } else {
          parts.push(parseOperator(node));
        }
      } else {
        parts.push(parse(node));
      }
    });
    // 這裏非常不嚴謹
    if(lefts.length > 0){
      for(let i=0; i < lefts.length; i++){
        parts.push("\\right.");
      }
    }
    lefts = undefined;
    return parts;
  }


  function getRender(node) {
    let render = undefined;
    const nodeName = NodeTool.getNodeName(node);
    switch(nodeName){
      case 'msub':
        render = getRender_default("@1_{@2}");
        break;
      case 'msup':
        render = getRender_default("@1^{@2}");
        break;
      case 'msubsup':
        render = getRender_default("@1_{@2}^{@3}");
        break;
      case 'mover':
        render = renderMover;
        break;
      case 'munder':
        render = renderMunder;
        break;
      case 'munderover':
        render = getRender_default("@1\\limits_{@2}^{@3}");
        break;
      case 'mmultiscripts':
        render = renderMmultiscripts;
        break;
      case 'mroot':
        render = getRender_default("\\sqrt[@2]{@1}");
        break;
      case 'msqrt':
        render = getRender_joinSeparator("\\sqrt{@content}");
        break;
      case 'mtable':
        render = renderTable;
        break;
      case 'mtr':
        render = getRender_joinSeparator("@content \\\\ ", ' & ');
        break;
      case 'mtd':
        render = getRender_joinSeparator("@content");
        break;
      case 'mfrac':
        render = renderMfrac;
        break;
      case 'mfenced':
        render = renderMfenced;
        break;
      case 'mi':
      case 'mn':
      case 'mo':
      case 'ms':
      case 'mtext':
        // they may contains <mglyph>
        render = getRender_joinSeparator("@content");
        break;
      case 'mphantom':
        render = renderMphantom;
        break;
      default:
        // math, mstyle, mrow
        render = getRender_joinSeparator("@content");
        break;
    }
    return render;
  }

  function renderTable(node, children) {
    const template = "\\begin{matrix} @content \\end{matrix}";
    const render = getRender_joinSeparator(template);
    return render(node, children);
  }

  function renderMfrac(node, children){
    const [linethickness, bevelled] = [
      NodeTool.getAttr(node, 'linethickness', 'medium'),
      NodeTool.getAttr(node, 'bevelled', 'false')
    ];

    let render = null;
    if(bevelled === 'true') {
      render = getRender_default("{}^{@1}/_{@2}");
    } else if(['0', '0px'].indexOf(linethickness) > -1) {
      const [prevNode, nextNode] = [
        NodeTool.getPrevNode(node),
        NodeTool.getNextNode(node)
      ];
      if((prevNode && NodeTool.getNodeText(prevNode).trim() === '(') &&
         (nextNode && NodeTool.getNodeText(nextNode).trim() === ')')
      ) {
        render = getRender_default("\\DELETE_BRACKET_L\\binom{@1}{@2}\\DELETE_BRACKET_R");
      } else {
        render = getRender_default("{}_{@2}^{@1}");
      }
    } else {
      render = getRender_default("\\frac{@1}{@2}");
    }
    return render(node, children);
  }

  function renderMfenced(node, children){
    const [open, close, separatorsStr] = [
      NodeTool.getAttr(node, 'open', '('),
      NodeTool.getAttr(node, 'close', ')'),
      NodeTool.getAttr(node, 'separators', ',')
    ];
    const [left, right] = [
      Brackets.parseLeft(open),
      Brackets.parseRight(close)
    ];

    const separators = separatorsStr.split('').filter((c) => c.trim().length === 1);
    const template = `${left}@content${right}`;
    const render = getRender_joinSeparators(template, separators);
    return render(node, children);
  }

  function renderMmultiscripts(node, children) {
    if(children.length === 0) { return '' }
    let sepIndex = -1;
    let mprescriptsNode = null;
    Array.prototype.forEach.call(children, (node) => {
      if(NodeTool.getNodeName(node) === 'mprescripts'){
        mprescriptsNode = node;
      }
    });
    if(mprescriptsNode) {
      sepIndex = Array.prototype.indexOf.call(children, mprescriptsNode);
    }
    const parts = renderChildren(children);

    const splitArray = (arr, index) => {
      return [arr.slice(0, index), arr.slice(index + 1, arr.length)]
    };
    const renderScripts = (items) => {
      if(items.length > 0) {
        const subs = [];
        const sups = [];
        items.forEach((item, index) => {
          // one render as sub script, one as super script
          if((index + 1) % 2 === 0){
            sups.push(item);
          } else {
            subs.push(item);
          }
        });
        return [
          (subs.length > 0 ? `_{${subs.join(' ')}}` : ''),
          (sups.length > 0 ? `^{${sups.join(' ')}}` : '')
        ].join('');
      } else {
        return '';
      }
    };
    const base = parts.shift();
    let prevScripts = [];
    let backScripts = [];
    if(sepIndex === -1){
      backScripts = parts;
    } else {
      [backScripts, prevScripts] = splitArray(parts, sepIndex - 1);
    }
    return [renderScripts(prevScripts), base, renderScripts(backScripts)].join('');
  }

  function renderMover(node, children){
    const nodes = flattenNodeTreeByNodeName(node, 'mover');
    let result = undefined;
    for(let i = 0; i < nodes.length - 1; i++) {
      if(!result){ result = parse(nodes[i]); }
      const over = parse(nodes[i + 1]);
      const template = getMatchValueByChar({
        decimals: MathSymbol.overScript.decimals,
        values: MathSymbol.overScript.templates,
        judgeChar: over,
        defaultValue: "@1\\limits^{@2}"
      });
      result = renderTemplate(template.replace("@v", "@1"), [result, over]);
    }
    return result;
  }

  function renderMunder(node, children){
    const nodes = flattenNodeTreeByNodeName(node, 'munder');
    let result = undefined;
    for(let i = 0; i < nodes.length - 1; i++) {
      if(!result){ result = parse(nodes[i]); }
      const under = parse(nodes[i + 1]);
      const template = getMatchValueByChar({
        decimals: MathSymbol.underScript.decimals,
        values: MathSymbol.underScript.templates,
        judgeChar: under,
        defaultValue: "@1\\limits_{@2}"
      });
      result =  renderTemplate(template.replace("@v", "@1"), [result, under]);
    }
    return result;
  }

  function flattenNodeTreeByNodeName(root, nodeName) {
    let result = [];
    const children = NodeTool.getChildren(root);
    Array.prototype.forEach.call(children, (node) => {
      if (NodeTool.getNodeName(node) === nodeName) {
        result = result.concat(flattenNodeTreeByNodeName(node, nodeName));
      } else {
        result.push(node);
      }
    });
    return result;
  }


  function getMatchValueByChar(params) {
    const {decimals, values, judgeChar, defaultValue=null} = params;
    if (judgeChar && judgeChar.length === 1) {
      const index = decimals.indexOf(judgeChar.charCodeAt(0));
      if (index > -1) {
        return values[index];
      }
    }
    return defaultValue;
  }

  // https://developer.mozilla.org/en-US/docs/Web/MathML/Element/mphantom
  // FIXME :)
  function renderMphantom(node, children) {
      return '';
  }



  function getRender_default(template) {
    return function(node, children) {
      const parts = renderChildren(children);
      return renderTemplate(template, parts)
    }
  }

  function renderTemplate(template, values) {
    return template.replace(/\@\d+/g, (m) => {
      const idx = parseInt(m.substring(1, m.length)) - 1;
      return values[idx];
    });
  }

  function getRender_joinSeparator(template, separator = '') {
    return function(node, children) {
      const parts = renderChildren(children);
      return template.replace("@content", parts.join(separator));
    }
  }

  function getRender_joinSeparators(template, separators) {
    return function(node, children) {
      const parts = renderChildren(children);
      let content = '';
      if(separators.length === 0){
        content = parts.join('');
      } else {
        content =  parts.reduce((accumulator, part, index) => {
          accumulator += part;
          if(index < parts.length - 1){
            accumulator += (separators[index] || separators[separators.length - 1]);
          }
          return accumulator;
        }, '');
      }
      return template.replace("@content", content);
    }
  }

  var mathml2latex = {convert: convert};

  return mathml2latex;

})();


$(function(){
  setTimeout(function(){copymath()}, 3000 )
})();

