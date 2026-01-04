// ==UserScript==
// @name         vocabsize hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A perfectly normal script
// @author       NewtonWarrier
// @match        https://vocabsize.xeersoft.co.th/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488070/vocabsize%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/488070/vocabsize%20hack.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Your code here
     var input = document.getElementsByClassName("mg-10 user_ans answer-input");
var inputs = [];

for (let i = 0; i < input.length; i++) {
  inputs.push(input[i].attributes.word_id.nodeValue);
}

console.log(inputs);

let url = "https://vocabsize.xeersoft.co.th/vocab-test/save";
let payload = {
  mode: "basic",
  vocabs: [
    {
      test_word_id: "36127",
      tst_vocab_status: "0",
    },
  ],
  special_key: "346162",
  usage_time: "16",
  assignment_id: "346162",
  crs_id: "22495",
  cdad_id: "25",
  cl_id: "",
  cldd_id: "",
};

const transformedPayload = {};

// for (let i in payload) {
// //   console.log(i)
//   let initVal = payload[i];
//   if (i == "vocabs") {
//     let vocabs = [];
// for (let j = 0; j < inputs; j++) {
//   console.log({ test_word_id: inputs[j], tst_vocab_status: "1" })
//   vocabs.push({ test_word_id: inputs[j], tst_vocab_status: "1" });
// }
//     // console.log(vocabs)
//     initVal = vocabs;
//   }
//   transformedPayload[i] = initVal
// }

// For vocab section
let transformedVocab = [];
for (let j = 0; j < inputs.length; j++) {
  console.log({ test_word_id: inputs[j], tst_vocab_status: "1" });
  transformedVocab.push({ test_word_id: inputs[j], tst_vocab_status: "1" });
}
payload.vocabs = transformedVocab;

console.log(window.location.pathname)

// For the class identifier
let classId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2]
// console.log(classId)
payload.special_key = $("#special_key").val()
payload.assignment_id = $("#assignment_id").val()

// For setting time it took to finish
payload.usage_time = 10800 * 6

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content'),
    "X-Requested-With": "XMLHttpRequest",
  },
  body: JSON.stringify(payload),
});

})();