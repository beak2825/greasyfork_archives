// ==UserScript==
// @name          fetchElements
// @namespace     https://greasyfork.org
// @version       0.1
// @description   Convert fetch body to dom elements.
// @match         *://*/*
// @grant         none
// ==/UserScript==

/**
 * fix Fetch Chinese garbled
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

/**
 * https://stackoverflow.com/a/35385518
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
const htmlToElements = (htmlSrc) => {
  let template = document.createElement('template');
  template.innerHTML = htmlSrc;
  return template.content;
};

/**
 * @param {String} fetchUrl
 * @param {Object} fetchOptions
 * @return {NodeList}
 */
const fetchElements = async (fetchUrl, fetchOptions = {}) => {
  const body_response = await fetch(fetchUrl, fetchOptions);
  const body_blob = await body_response.blob();
  const body_utf8Text = await binary2Text(body_blob);
  const body_elements = htmlToElements(body_utf8Text);
  return body_elements;
};
