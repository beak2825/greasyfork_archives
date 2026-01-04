// ==UserScript==
// @name         LeetCode Intelligent
// @namespace    https://shiyu.dev/
// @version      0.1
// @description  为 LeetCode 增加智能代码提示，提供代码补全功能
// @author       ShiYu
// @license      MIT
// @match        https://leetcode.com/problems/* 
// @match        https://leetcode.cn/problems/*
// @match        https://www.leetcode.com/problems/* 
// @match        https://www.leetcode.cn/problems/*
// @grant        none
// @antifeature  none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/512718/LeetCode%20Intelligent.user.js
// @updateURL https://update.greasyfork.org/scripts/512718/LeetCode%20Intelligent.meta.js
// ==/UserScript==

// src/cpp/utils.ts
function extractVariables(code, position) {
  const variableRegex = /\b(?:vector|stack|queue|deque|map|unordered_map|set|unordered_set|list|forward_list|multiset|unordered_multiset|multimap|unordered_multimap|priority_queue|pair|tuple|array)\s*<[^>]+>\s+(\w+)\s*;/g;
  const basicTypeRegex = /\b(?:int|float|double|char|bool|string|auto)\s+(\w+)\s*;/g;
  const funcParamRegex = /\(([^)]*)\)/g;
  const variables = new Map;
  const lines = code.split("\n").slice(0, position.lineNumber - 1);
  let currentLine = code.split("\n")[position.lineNumber - 1].substring(0, position.column - 1);
  lines.push(currentLine);
  const codeBeforeCursor = lines.join("\n");
  let match;
  while ((match = variableRegex.exec(codeBeforeCursor)) !== null) {
    const varName = match[1];
    variables.set(varName, { type: "template", kind: "variable" });
  }
  while ((match = basicTypeRegex.exec(codeBeforeCursor)) !== null) {
    const varName = match[1];
    variables.set(varName, { type: "basic", kind: "variable" });
  }
  const funcMatch = funcParamRegex.exec(codeBeforeCursor);
  if (funcMatch) {
    const params = funcMatch[1].split(",");
    params.forEach((param) => {
      const parts = param.trim().split(/\s+/);
      const paramName = parts[parts.length - 1];
      variables.set(paramName, { type: "parameter", kind: "parameter" });
    });
  }
  return variables;
}
function getRange(position, word) {
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };
}

// src/cpp/vector.ts
function getVectorSuggestions(monaco, range) {
  return [
    {
      label: "push_back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "push_back(${1:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Adds an element to the end of the vector.",
      range
    },
    {
      label: "pop_back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "pop_back();",
      documentation: "Removes the last element of the vector.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size()",
      documentation: "Returns the number of elements in the vector.",
      range
    },
    {
      label: "clear",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "clear();",
      documentation: "Removes all elements from the vector.",
      range
    },
    {
      label: "at",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "at(${1:index})",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns a reference to the element at the specified position.",
      range
    },
    {
      label: "empty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "empty()",
      documentation: "Checks if the vector is empty.",
      range
    },
    {
      label: "reserve",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "reserve(${1:size});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Requests that the vector capacity be at least enough to contain a specified number of elements.",
      range
    },
    {
      label: "capacity",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "capacity()",
      documentation: "Returns the number of elements that can be held in currently allocated storage.",
      range
    },
    {
      label: "front",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "front()",
      documentation: "Returns a reference to the first element in the vector.",
      range
    },
    {
      label: "back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "back()",
      documentation: "Returns a reference to the last element in the vector.",
      range
    },
    {
      label: "insert",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "insert(${1:position}, ${2:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts elements at the specified position.",
      range
    },
    {
      label: "erase",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "erase(${1:position});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Erases elements at the specified position.",
      range
    },
    {
      label: "resize",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "resize(${1:new_size});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Resizes the container to contain the specified number of elements.",
      range
    },
    {
      label: "shrink_to_fit",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "shrink_to_fit();",
      documentation: "Reduces the capacity of the vector to fit its size.",
      range
    },
    {
      label: "data",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "data()",
      documentation: "Returns a direct pointer to the memory array used internally by the vector to store its owned elements.",
      range
    },
    {
      label: "emplace_back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "emplace_back(${1:args});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Constructs and inserts a new element at the end of the vector.",
      range
    }
  ];
}

// src/cpp/stack.ts
function getStackSuggestions(monaco, range) {
  return [
    {
      label: "push",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "push(${1:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Pushes an element onto the stack.",
      range
    },
    {
      label: "pop",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "pop();",
      documentation: "Removes the top element of the stack.",
      range
    },
    {
      label: "top",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "top()",
      documentation: "Returns a reference to the top element of the stack.",
      range
    },
    {
      label: "empty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "empty()",
      documentation: "Checks whether the stack is empty.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size()",
      documentation: "Returns the number of elements in the stack.",
      range
    },
    {
      label: "emplace",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "emplace(${1:args});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Constructs and inserts an element at the top of the stack.",
      range
    },
    {
      label: "swap",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "swap(${1:other_stack});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Exchanges the contents of the container with another stack.",
      range
    }
  ];
}

// src/cpp/queue.ts
function getQueueSuggestions(monaco, range) {
  return [
    {
      label: "push",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "push(${1:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts an element at the end of the queue.",
      range
    },
    {
      label: "pop",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "pop();",
      documentation: "Removes the next element in the queue.",
      range
    },
    {
      label: "front",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "front()",
      documentation: "Accesses the next element in the queue.",
      range
    },
    {
      label: "back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "back()",
      documentation: "Accesses the last element in the queue.",
      range
    },
    {
      label: "empty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "empty()",
      documentation: "Checks if the queue is empty.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size()",
      documentation: "Returns the number of elements in the queue.",
      range
    },
    {
      label: "emplace",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "emplace(${1:args});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Constructs and inserts a new element at the end of the queue.",
      range
    },
    {
      label: "swap",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "swap(${1:other_queue});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Exchanges the contents of the queue with another.",
      range
    }
  ];
}

// src/cpp/generalSuggestions.ts
function getGeneralSuggestions(monaco, range) {
  return [
    {
      label: "cout",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "cout << $1 << endl;",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Standard output stream",
      range
    },
    {
      label: "cin",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "cin >> $1;",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Standard input stream",
      range
    },
    {
      label: "for (auto x : num)",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "for (auto ${1:x} : ${2:container}) {\n\t$0\n}",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Range-based for loop using auto",
      range
    },
    {
      label: "for",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "For loop",
      range
    },
    {
      label: "while",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "while (${1:condition}) {\n\t$0\n}",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "While loop",
      range
    },
    {
      label: "vector",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "vector<${1:int}> ${2:vec};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::vector",
      range
    },
    {
      label: "stack",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "stack<${1:int}> ${2:stk};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::stack",
      range
    },
    {
      label: "queue",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "queue<${1:int}> ${2:q};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::queue",
      range
    },
    {
      label: "deque",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "deque<${1:int}> ${2:dq};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::deque",
      range
    },
    {
      label: "map",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "map<${1:int}, ${2:int}> ${3:m};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::map",
      range
    },
    {
      label: "unordered_map",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "unordered_map<${1:int}, ${2:int}> ${3:umap};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::unordered_map",
      range
    },
    {
      label: "set",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "set<${1:int}> ${2:s};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::set",
      range
    },
    {
      label: "unordered_set",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "unordered_set<${1:int}> ${2:uset};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::unordered_set",
      range
    },
    {
      label: "multimap",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "multimap<${1:int}, ${2:int}> ${3:mm};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::multimap",
      range
    },
    {
      label: "multiset",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "multiset<${1:int}> ${2:ms};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::multiset",
      range
    },
    {
      label: "priority_queue",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "priority_queue<${1:int}> ${2:pq};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::priority_queue",
      range
    },
    {
      label: "array",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "array<${1:int}, ${2:N}> ${3:arr};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::array",
      range
    },
    {
      label: "pair",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "pair<${1:int}, ${2:int}> ${3:p};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::pair",
      range
    },
    {
      label: "forward_list",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "forward_list<${1:int}> ${2:fl};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::forward_list",
      range
    },
    {
      label: "unordered_multimap",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "unordered_multimap<${1:int}, ${2:int}> ${3:umm};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::unordered_multimap",
      range
    },
    {
      label: "unordered_multiset",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "unordered_multiset<${1:int}> ${2:ums};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::unordered_multiset",
      range
    },
    {
      label: "tuple",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "tuple<${1:int}, ${2:int}, ${3:int}> ${4:tup};",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a std::tuple",
      range
    },
    {
      label: "sort",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "sort(${1:begin}, ${2:end});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Sorts the range [begin, end).",
      range
    },
    {
      label: "max",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "max(${1:a}, ${2:b});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns the maximum of two values.",
      range
    },
    {
      label: "min",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "min(${1:a}, ${2:b});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns the minimum of two values.",
      range
    },
    {
      label: "reverse",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "reverse(${1:begin}, ${2:end});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Reverses the range [begin, end).",
      range
    },
    {
      label: "find",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "find(${1:begin}, ${2:end}, ${3:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Finds the first occurrence of value in the range [begin, end).",
      range
    },
    {
      label: "accumulate",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "accumulate(${1:begin}, ${2:end}, ${3:init});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Accumulates the sum of the range [begin, end) starting from init.",
      range
    },
    {
      label: "binary_search",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "binary_search(${1:begin}, ${2:end}, ${3:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Checks if value exists in the sorted range [begin, end).",
      range
    },
    {
      label: "lower_bound",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "lower_bound(${1:begin}, ${2:end}, ${3:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns an iterator pointing to the first element not less than value in the sorted range [begin, end).",
      range
    },
    {
      label: "upper_bound",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "upper_bound(${1:begin}, ${2:end}, ${3:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns an iterator pointing to the first element greater than value in the sorted range [begin, end).",
      range
    },
    {
      label: "unique",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "unique(${1:begin}, ${2:end});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Removes consecutive duplicates in the range [begin, end).",
      range
    }
  ];
}

// src/cpp/deque.ts
function getDequeSuggestions(monaco, range) {
  return [
    {
      label: "push_back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "push_back(${1:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Adds an element to the end of the deque.",
      range
    },
    {
      label: "push_front",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "push_front(${1:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Adds an element to the front of the deque.",
      range
    },
    {
      label: "pop_back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "pop_back();",
      documentation: "Removes the last element of the deque.",
      range
    },
    {
      label: "pop_front",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "pop_front();",
      documentation: "Removes the first element of the deque.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size()",
      documentation: "Returns the number of elements in the deque.",
      range
    },
    {
      label: "clear",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "clear();",
      documentation: "Removes all elements from the deque.",
      range
    },
    {
      label: "at",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "at(${1:index})",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns a reference to the element at the specified position.",
      range
    },
    {
      label: "empty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "empty()",
      documentation: "Checks if the deque is empty.",
      range
    },
    {
      label: "front",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "front()",
      documentation: "Returns a reference to the first element in the deque.",
      range
    },
    {
      label: "back",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "back()",
      documentation: "Returns a reference to the last element in the deque.",
      range
    },
    {
      label: "insert",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "insert(${1:position}, ${2:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts elements at the specified position.",
      range
    },
    {
      label: "erase",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "erase(${1:position});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Erases elements at the specified position.",
      range
    },
    {
      label: "resize",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "resize(${1:new_size});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Resizes the container to contain the specified number of elements.",
      range
    },
    {
      label: "shrink_to_fit",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "shrink_to_fit();",
      documentation: "Reduces the capacity of the deque to fit its size.",
      range
    },
    {
      label: "data",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "data()",
      documentation: "Returns a direct pointer to the memory array used internally by the deque.",
      range
    }
  ];
}

// src/cpp/map.ts
function getMapSuggestions(monaco, range) {
  return [
    {
      label: "insert",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "insert(${1:pair});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts a pair (key, value) into the map.",
      range
    },
    {
      label: "erase",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "erase(${1:key});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Erases the element by key from the map.",
      range
    },
    {
      label: "find",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "find(${1:key})",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Finds an element by its key.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size()",
      documentation: "Returns the number of elements in the map.",
      range
    },
    {
      label: "clear",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "clear();",
      documentation: "Removes all elements from the map.",
      range
    },
    {
      label: "empty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "empty()",
      documentation: "Checks if the map is empty.",
      range
    },
    {
      label: "at",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "at(${1:key})",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Accesses an element by key and returns a reference to its value.",
      range
    },
    {
      label: "count",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "count(${1:key})",
      documentation: "Returns the number of elements matching the key (either 0 or 1 in a map).",
      range
    }
  ];
}

// src/cpp/unordered_map.ts
function getUnorderedMapSuggestions(monaco, range) {
  return [
    {
      label: "insert",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "insert(${1:pair});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts a pair (key, value) into the unordered_map.",
      range
    },
    {
      label: "erase",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "erase(${1:key});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Erases the element by key from the unordered_map.",
      range
    },
    {
      label: "find",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "find(${1:key})",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Finds an element by its key.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size()",
      documentation: "Returns the number of elements in the unordered_map.",
      range
    },
    {
      label: "clear",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "clear();",
      documentation: "Removes all elements from the unordered_map.",
      range
    },
    {
      label: "empty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "empty()",
      documentation: "Checks if the unordered_map is empty.",
      range
    },
    {
      label: "at",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "at(${1:key})",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Accesses an element by key and returns a reference to its value.",
      range
    },
    {
      label: "count",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "count(${1:key})",
      documentation: "Returns the number of elements matching the key (either 0 or 1 in an unordered_map).",
      range
    }
  ];
}

// src/cpp/index.ts
function initCppCompletion(monaco) {
  monaco.languages.registerCompletionItemProvider("cpp", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = getRange(position, word);
      const code = model.getValue();
      const variables = extractVariables(code, position);
      const variableSuggestions = [];
      variables.forEach(({ type }, name) => {
        variableSuggestions.push({
          label: name,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: name,
          documentation: `Variable of type ${type}`,
          range
        });
      });
      const lineContent = model.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.substring(0, position.column - 1).trim();
      const lastDotIndex = textBeforeCursor.lastIndexOf(".");
      let functionSuggestions = [];
      let isDotAfterVariable = false;
      if (lastDotIndex !== -1) {
        const varName = textBeforeCursor.substring(0, lastDotIndex).trim();
        if (variables.has(varName)) {
          const varInfo = variables.get(varName);
          isDotAfterVariable = true;
          switch (varInfo?.type) {
            case "template":
              functionSuggestions = getVectorSuggestions(monaco, range);
              break;
            case "stack":
              functionSuggestions = getStackSuggestions(monaco, range);
              break;
            case "queue":
              functionSuggestions = getQueueSuggestions(monaco, range);
              break;
            case "deque":
              functionSuggestions = getDequeSuggestions(monaco, range);
              break;
            case "map":
              functionSuggestions = getMapSuggestions(monaco, range);
              break;
            case "unordered_map":
              functionSuggestions = getUnorderedMapSuggestions(monaco, range);
              break;
            default:
              break;
          }
        }
      }
      if (!isDotAfterVariable) {
        const generalSuggestions = getGeneralSuggestions(monaco, range);
        return {
          suggestions: [...generalSuggestions, ...variableSuggestions]
        };
      } else {
        return {
          suggestions: [...functionSuggestions]
        };
      }
    }
  });
}

// src/java/arrayList.ts
function getArrayListSuggestions(monaco, range) {
  return [
    {
      label: "add",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "add(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Adds an element to the ArrayList.",
      range
    },
    {
      label: "remove",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "remove(${1:index});",
      documentation: "Removes the element at the specified index.",
      range
    },
    {
      label: "get",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "get(${1:index});",
      documentation: "Returns the element at the specified index.",
      range
    },
    {
      label: "set",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "set(${1:index}, ${2:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Replaces the element at the specified index with the specified element.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of elements in the ArrayList.",
      range
    },
    {
      label: "clear",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "clear();",
      documentation: "Removes all elements from the ArrayList.",
      range
    },
    {
      label: "contains",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "contains(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns true if this list contains the specified element.",
      range
    },
    {
      label: "indexOf",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "indexOf(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns the index of the first occurrence of the specified element, or -1 if this list does not contain the element.",
      range
    },
    {
      label: "lastIndexOf",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "lastIndexOf(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns the index of the last occurrence of the specified element, or -1 if this list does not contain the element.",
      range
    },
    {
      label: "isEmpty",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "isEmpty();",
      documentation: "Returns true if this list contains no elements.",
      range
    },
    {
      label: "toArray",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "toArray();",
      documentation: "Returns an array containing all of the elements in this list in proper sequence.",
      range
    }
  ];
}

// src/java/hashMap.ts
function getHashMapSuggestions(monaco, range) {
  return [
    {
      label: "put",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "put(${1:key}, ${2:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Associates the specified value with the specified key in this map.",
      range
    },
    {
      label: "get",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "get(${1:key});",
      documentation: "Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.",
      range
    },
    {
      label: "remove",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "remove(${1:key});",
      documentation: "Removes the mapping for the specified key from this map if present.",
      range
    },
    {
      label: "containsKey",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "containsKey(${1:key});",
      documentation: "Returns true if this map contains a mapping for the specified key.",
      range
    },
    {
      label: "containsValue",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "containsValue(${1:value});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Returns true if this map maps one or more keys to the specified value.",
      range
    },
    {
      label: "keySet",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "keySet();",
      documentation: "Returns a Set view of the keys contained in this map.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of key-value mappings in this map.",
      range
    },
    {
      label: "clear",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "clear();",
      documentation: "Removes all of the mappings from this map. The map will be empty after this call.",
      range
    },
    {
      label: "values",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "values();",
      documentation: "Returns a Collection view of the values contained in this map.",
      range
    },
    {
      label: "entrySet",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "entrySet();",
      documentation: "Returns a Set view of the mappings contained in this map.",
      range
    }
  ];
}

// src/java/list.ts
function getListSuggestions(monaco, range) {
  return [
    {
      label: "add",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "add(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Appends the specified element to the end of this list.",
      range
    },
    {
      label: "get",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "get(${1:index});",
      documentation: "Returns the element at the specified position in this list.",
      range
    },
    {
      label: "remove",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "remove(${1:index});",
      documentation: "Removes the element at the specified position in this list.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of elements in this list.",
      range
    }
  ];
}

// src/java/set.ts
function getSetSuggestions(monaco, range) {
  return [
    {
      label: "add",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "add(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Adds the specified element to this set if it is not already present.",
      range
    },
    {
      label: "contains",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "contains(${1:element});",
      documentation: "Returns true if this set contains the specified element.",
      range
    },
    {
      label: "remove",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "remove(${1:element});",
      documentation: "Removes the specified element from this set if it is present.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of elements in this set.",
      range
    }
  ];
}

// src/java/queue.ts
function getQueueSuggestions2(monaco, range) {
  return [
    {
      label: "offer",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "offer(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts the specified element into this queue.",
      range
    },
    {
      label: "poll",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "poll();",
      documentation: "Retrieves and removes the head of this queue, or returns null if this queue is empty.",
      range
    },
    {
      label: "peek",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "peek();",
      documentation: "Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of elements in this queue.",
      range
    }
  ];
}

// src/java/stack.ts
function getStackSuggestions2(monaco, range) {
  return [
    {
      label: "push",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "push(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Pushes an item onto the top of this stack.",
      range
    },
    {
      label: "pop",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "pop();",
      documentation: "Removes the object at the top of this stack and returns that object as the value of this function.",
      range
    },
    {
      label: "peek",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "peek();",
      documentation: "Looks at the object at the top of this stack without removing it from the stack.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of elements in this stack.",
      range
    }
  ];
}

// src/java/deque.ts
function getDequeSuggestions2(monaco, range) {
  return [
    {
      label: "addFirst",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "addFirst(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts the specified element at the front of this deque.",
      range
    },
    {
      label: "addLast",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "addLast(${1:element});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Inserts the specified element at the end of this deque.",
      range
    },
    {
      label: "removeFirst",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "removeFirst();",
      documentation: "Removes and returns the first element from this deque.",
      range
    },
    {
      label: "removeLast",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "removeLast();",
      documentation: "Removes and returns the last element from this deque.",
      range
    },
    {
      label: "size",
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: "size();",
      documentation: "Returns the number of elements in this deque.",
      range
    }
  ];
}

// src/java/utils.ts
function extractJavaVariables(code, position) {
  const variableRegex = /\b(?:ArrayList|List|Set|Map|Queue|Stack|Deque|LinkedList|HashMap|HashSet|TreeMap|TreeSet|PriorityQueue)\s*<[^>]+>\s+(\w+)\s*=/g;
  const basicTypeRegex = /\b(?:int|float|double|char|boolean|String|byte|short|long)\s+(\w+)\s*;/g;
  const funcParamRegex = /\(([^)]*)\)/g;
  const variables = new Map;
  const lines = code.split("\n").slice(0, position.lineNumber - 1);
  let currentLine = code.split("\n")[position.lineNumber - 1].substring(0, position.column - 1);
  lines.push(currentLine);
  const codeBeforeCursor = lines.join("\n");
  let match;
  while ((match = variableRegex.exec(codeBeforeCursor)) !== null) {
    const varName = match[1];
    variables.set(varName, { type: "ArrayList", kind: "variable" });
  }
  while ((match = basicTypeRegex.exec(codeBeforeCursor)) !== null) {
    const varName = match[1];
    variables.set(varName, { type: "basic", kind: "variable" });
  }
  const funcMatch = funcParamRegex.exec(codeBeforeCursor);
  if (funcMatch) {
    const params = funcMatch[1].split(",");
    params.forEach((param) => {
      const parts = param.trim().split(/\s+/);
      const paramName = parts[parts.length - 1];
      variables.set(paramName, { type: "parameter", kind: "parameter" });
    });
  }
  return variables;
}
function getJavaRange(position, word) {
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };
}

// src/java/getGeneralSuggestions.ts
function getGeneralSuggestions2(monaco, range) {
  return [
    {
      label: "System.out.println",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "System.out.println(${1:message});",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Prints a message to the standard output",
      range
    },
    {
      label: "for (int i = 0; i < n; i++)",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Basic for loop",
      range
    },
    {
      label: "while",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "while (${1:condition}) {\n\t$0\n}",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "While loop",
      range
    },
    {
      label: "if",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "if (${1:condition}) {\n\t$0\n}",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "If statement",
      range
    },
    {
      label: "ArrayList",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "ArrayList<${1:type}> ${2:list} = new ArrayList<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates an ArrayList",
      range
    },
    {
      label: "HashMap",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "HashMap<${1:K}, ${2:V}> ${3:map} = new HashMap<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a HashMap",
      range
    },
    {
      label: "HashSet",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "HashSet<${1:type}> ${2:set} = new HashSet<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a HashSet",
      range
    },
    {
      label: "LinkedList",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "LinkedList<${1:type}> ${2:list} = new LinkedList<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a LinkedList",
      range
    },
    {
      label: "Stack",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "Stack<${1:type}> ${2:stack} = new Stack<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a Stack",
      range
    },
    {
      label: "Queue",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "Queue<${1:type}> ${2:queue} = new LinkedList<>(); // \u4F7F\u7528 LinkedList \u5B9E\u73B0\u961F\u5217",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a Queue",
      range
    },
    {
      label: "PriorityQueue",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "PriorityQueue<${1:type}> ${2:pq} = new PriorityQueue<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a PriorityQueue",
      range
    },
    {
      label: "Deque",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "Deque<${1:type}> ${2:deque} = new ArrayDeque<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a Deque",
      range
    },
    {
      label: "Set",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "Set<${1:type}> ${2:set} = new HashSet<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a Set",
      range
    },
    {
      label: "TreeMap",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "TreeMap<${1:K}, ${2:V}> ${3:map} = new TreeMap<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a TreeMap",
      range
    },
    {
      label: "TreeSet",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: "TreeSet<${1:type}> ${2:set} = new TreeSet<>();",
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Creates a TreeSet",
      range
    }
  ];
}

// src/java/index.ts
function initJavaCompletion(monaco) {
  monaco.languages.registerCompletionItemProvider("java", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = getJavaRange(position, word);
      const code = model.getValue();
      const variables = extractJavaVariables(code, position);
      const variableSuggestions = [];
      variables.forEach(({ type }, name) => {
        variableSuggestions.push({
          label: name,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: name,
          documentation: `Variable of type ${type}`,
          range
        });
      });
      const lineContent = model.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.substring(0, position.column - 1).trim();
      const lastDotIndex = textBeforeCursor.lastIndexOf(".");
      let methodSuggestions = [];
      let isDotAfterVariable = false;
      if (lastDotIndex !== -1) {
        const varName = textBeforeCursor.substring(0, lastDotIndex).trim();
        if (variables.has(varName)) {
          const varInfo = variables.get(varName);
          isDotAfterVariable = true;
          switch (varInfo?.type) {
            case "ArrayList":
              methodSuggestions = getArrayListSuggestions(monaco, range);
              break;
            case "HashMap":
              methodSuggestions = getHashMapSuggestions(monaco, range);
              break;
            case "List":
              methodSuggestions = getListSuggestions(monaco, range);
              break;
            case "Set":
              methodSuggestions = getSetSuggestions(monaco, range);
              break;
            case "Queue":
              methodSuggestions = getQueueSuggestions2(monaco, range);
              break;
            case "Stack":
              methodSuggestions = getStackSuggestions2(monaco, range);
              break;
            case "Deque":
              methodSuggestions = getDequeSuggestions2(monaco, range);
              break;
            default:
              break;
          }
        }
      }
      if (!isDotAfterVariable) {
        const generalSuggestions = getGeneralSuggestions2(monaco, range);
        return {
          suggestions: [...generalSuggestions, ...variableSuggestions]
        };
      } else {
        return {
          suggestions: [...methodSuggestions]
        };
      }
    }
  });
}

// src/index.ts
function waitForMonaco() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.monaco) {
        clearInterval(interval);
        resolve(window.monaco);
      }
    }, 100);
  });
}
async function init() {
  const monaco = await waitForMonaco();
  monaco.editor.onDidCreateEditor((editor) => {
    setTimeout(() => {
      editor.updateOptions({ suggestOnTriggerCharacters: true });
      editor.updateOptions({ quickSuggestions: { comments: "on", strings: "on", other: "on" } });
    }, 500);
  });
  initCppCompletion(monaco);
  initJavaCompletion(monaco);
}
window.addEventListener("load", init);
