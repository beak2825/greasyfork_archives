// ==UserScript==
// @name         LeetCode|力扣 智能C++语法智能提示
// @namespace    https://tampermonkey.net/
// @version      5.1.0
// @description  为 [LeetCode（力扣）中国站](https://leetcode.cn) 提供增强版的 C++ 自动补全、悬浮提示与跳转功能，**纯前端实现、无需后端服务器**，助力更高效刷题！
// @author       bigonion
// @match        https://leetcode.cn/problems/*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540907/LeetCode%7C%E5%8A%9B%E6%89%A3%20%E6%99%BA%E8%83%BDC%2B%2B%E8%AF%AD%E6%B3%95%E6%99%BA%E8%83%BD%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540907/LeetCode%7C%E5%8A%9B%E6%89%A3%20%E6%99%BA%E8%83%BDC%2B%2B%E8%AF%AD%E6%B3%95%E6%99%BA%E8%83%BD%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 1. STATIC DICTIONARY ---------- */
  const cppDict = [
    { label:'int',  type:'keyword',  hover:'Signed 32-bit integer' },
    { label:'double',type:'keyword', hover:'Double-precision float' },
    { label:'char', type:'keyword',  hover:'8-bit character' },
    { label:'bool', type:'keyword',  hover:'Boolean true / false' },
    { label:'void', type:'keyword',  hover:'No return value' },
    { label:'auto', type:'keyword',  hover:'Type deduced by compiler (C++11)' },
    { label:'constexpr',type:'keyword',hover:'Compile-time constant (C++11)' },
    { label:'return', type:'keyword',  hover:'Return from current function' },
    { label:'for', type:'keyword',
      snippet:'for (int ${1:i}=0; ${1:i}<${2:n}; ++${1:i}) {\n\t$0\n}',
      hover:'Counting loop' },
    { label:'while', type:'keyword',
      snippet:'while (${1:cond}) {\n\t$0\n}',
      hover:'Loop while *cond* true' },
    { label:'if', type:'keyword',
      snippet:'if (${1:cond}) {\n\t$0\n}',
      hover:'Conditional branch' },
    { label:'else', type:'keyword', hover:'Alternative branch' },
    { label:'main', type:'snippet',
      snippet:`int main() {
\tios::sync_with_stdio(false);
\tcin.tie(nullptr);
\t$0
\treturn 0;
}`, hover:'Contest main() with fast I/O' },
    { label:'vector', type:'class',
      snippet:'vector<${1:int}> ${2:v};',
      hover:'\`vector<T>\` — dynamic array (`<vector>`)' },
    { label:'string', type:'class',
      hover:'\`string\` — mutable text (`<string>`)' },
    { label:'unordered_map',type:'class',
      hover:'Hash table (`<unordered_map>`)' },
    { label:'queue',type:'class',hover:'FIFO queue (`<queue>`)' },
    { label:'priority_queue',type:'class',
      hover:'Binary heap (`<queue>`)' },
    { label:'stack',type:'class',hover:'LIFO stack (`<stack>`)' },
    { label:'sort',type:'function',
      snippet:'sort(${1:begin}, ${2:end});',
      hover:'\`sort(first,last)\` ascending' },
    { label:'reverse',type:'function',
      snippet:'reverse(${1:begin}, ${2:end});',
      hover:'Reverse range in-place' },
    { label:'max',type:'function',snippet:'max(${1:a}, ${2:b});',
      hover:'Return larger value' },
    { label:'min',type:'function',snippet:'min(${1:a}, ${2:b});',
      hover:'Return smaller value' },
    { label:'accumulate',type:'function',
      snippet:'accumulate(${1:begin}, ${2:end}, ${3:0});',
      hover:'Sum range (`<numeric>`)' },
    { label:'lower_bound',type:'function',
      snippet:'lower_bound(${1:b}, ${2:e}, ${3:v});',
      hover:'First ≥ val (binary search)' },
    { label:'upper_bound',type:'function',
      snippet:'upper_bound(${1:b}, ${2:e}, ${3:v});',
      hover:'First > val (binary search)' },
    { label:'abs',type:'function',snippet:'abs(${1:x});',
      hover:'Absolute value' },
    { label:'pow',type:'function',snippet:'pow(${1:b}, ${2:e});',
      hover:'Power (`<cmath>`)' },
    { label:'sqrt',type:'function',snippet:'sqrt(${1:x});',
      hover:'Square root (`<cmath>`)' },
    { label:'cout',type:'function',
      snippet:'cout << ${1:msg} << endl;',
      hover:'Standard output stream' },
    { label:'cin', type:'function', hover:'Standard input stream' },
    { label:'getline',type:'function',
      snippet:'getline(cin, ${1:str});',
      hover:'Read full line' },
    { label:'memset',type:'function',
      snippet:'memset(${1:ptr}, 0, sizeof(${1:ptr}));',
      hover:'Fill bytes (`<cstring>`)' },
    { label:'memcpy',type:'function',
      snippet:'memcpy(${1:dst}, ${2:src}, sizeof(${1:dst}));',
      hover:'Copy bytes (`<cstring>`)' }
  ];

  /* ---------- 2. WAIT FOR MONACO ---------- */
  const ready = f => new Promise(r=>{const t=setInterval(()=>f()&&(clearInterval(t),r()),250);});
  ready(()=>unsafeWindow.monaco && unsafeWindow.monaco.editor.getModels().length).then(init);

  function init(){
    const monaco = unsafeWindow.monaco;
    const model  = monaco.editor.getModels()[0];
    if (!['cpp','c'].includes(model.getLanguageId())) return;
    if (model.getLanguageId()!=='cpp') monaco.editor.setModelLanguage(model,'cpp');

    /* --- 3. Build variable & function index --- */
    let varTable=new Map();  // name -> {type,line,col}
    let fnTable =new Map();  // name -> {line,col}

    const VAR_RE = /^\s*(?:const\s+)?([\w:<>\s*&]+?)\s+([A-Za-z_]\w*)\s*(?:[=;\[,]|$)/;
    const FN_RE  = /^\s*(?:template<[^>]+>\s*)?([\w:<>\s*&]+?)\s+([A-Za-z_]\w*)\s*\([^;{]*\)\s*\{/;

    const buildIndex = () => {
      varTable.clear(); fnTable.clear();
      model.getLinesContent().forEach((line,i)=>{
        let m = VAR_RE.exec(line);
        if(m) varTable.set(m[2],{type:m[1].trim().replace(/\s+/g,' '),line:i+1,col:line.indexOf(m[2])+1});
        m = FN_RE.exec(line);
        if(m) fnTable.set(m[2],{line:i+1,col:line.indexOf(m[2])+1});
      });
    };
    buildIndex();
    model.onDidChangeContent(buildIndex);   // ✅ FIXED api

    /* --- 4. Completion --- */
    monaco.languages.registerCompletionItemProvider('cpp',{
      provideCompletionItems:(mdl,pos)=>{
        const w=mdl.getWordUntilPosition(pos);
        const pre=w.word;
        const r={startLineNumber:pos.lineNumber,endLineNumber:pos.lineNumber,
                 startColumn:w.startColumn,endColumn:w.endColumn};
        const out=[]; const seen=new Set();
        for(const x of cppDict){
          if(pre && !x.label.startsWith(pre)) continue;
          if(seen.has(x.label)) continue; seen.add(x.label);
          out.push({
            label:x.label, range:r,
            kind:{keyword:monaco.languages.CompletionItemKind.Keyword,
                  function:monaco.languages.CompletionItemKind.Function,
                  class:monaco.languages.CompletionItemKind.Class,
                  snippet:monaco.languages.CompletionItemKind.Snippet}[x.type],
            insertText:x.snippet||x.label,
            insertTextRules:x.snippet?monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet:undefined,
            documentation:x.hover?{value:x.hover}:undefined,
            sortText:'zz_'+x.label
          });
        }
        return{suggestions:out};
      }
    });

    /* --- 5. Hover (dict + variables) --- */
    monaco.languages.registerHoverProvider('cpp',{
      provideHover:(mdl,pos)=>{
        const w=mdl.getWordAtPosition(pos); if(!w) return null;
        const dict = cppDict.find(x=>x.label===w.word && x.hover);
        if(dict) return mkHover(dict.hover,pos,w);
        const v = varTable.get(w.word);
        if(v) return mkHover(`\`${v.type} ${w.word}\``,pos,w);
        return null;
      }
    });
    function mkHover(text,pos,w){
      return{contents:[{value:text}],
        range:{startLineNumber:pos.lineNumber,endLineNumber:pos.lineNumber,
               startColumn:w.startColumn,endColumn:w.endColumn}};
    }

    /* --- 6. Definition (functions) --- */
    monaco.languages.registerDefinitionProvider('cpp',{
      provideDefinition:(mdl,pos)=>{
        const w=mdl.getWordAtPosition(pos); if(!w) return null;
        const def=fnTable.get(w.word);
        if(!def) return null;
        return{uri:mdl.uri,range:{startLineNumber:def.line,endLineNumber:def.line,
                                  startColumn:def.col,endColumn:def.col+w.word.length}};
      }
    });

    console.log('[C++] Booster V5.1 ready – vars:',varTable.size,'funcs:',fnTable.size);
  }
})();
