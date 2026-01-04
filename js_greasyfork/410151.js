// ==UserScript==
// @name          binary2Text
// @namespace     https://greasyfork.org
// @version       0.1.1
// @description   Convert html source text to dom elements.
// @match         *://*/*
// @grant         none
// ==/UserScript==

/** 解决 Fetch 直接输出的中文乱码问题
 * https://segmentfault.com/q/1010000004338890
 * https://blog.shovonhasan.com/using-promises-with-filereader/
 * @param {Binary} https://developer.mozilla.org/docs/Web/API/FileReader/readAsText
 * @return {String}
 */
const binary2Text = async (input) => {
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException('Problem parsing input.'));
    };
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsText(input);
  });
};
