// ==UserScript==
// @name            hinatazaka46-process
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @description	    Perform base processing
// @description:ja  基底処理を実行
// @version         0.15
// @icon            https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @grant           none
// @license         MIT
// ==/UserScript==

let id;
let count = 0;

const replaceLang = () => {

  const langSelect = document.getElementById('wovn-translate-widget');
  
  if (count >= 10) {
    clearInterval(id);
  }
  if (langSelect) {
    langSelect.style.top = "5px";
    document.querySelector('.wovn-lang-selector').style.height = "25px";
    document.querySelector('.wovn-lang-selector-links').style.paddingTop = "5px";
    clearInterval(id);
  }
  count++;
};


const doProcess = (proc, scriptName) => {
  
  handleException(proc, scriptName);

  handleException(() => {
    const colorMode = getColorMode();

    initializeColorToggle(colorMode);

    analyzeDefaultColor();
    setColor(getPageType(), colorMode);

  }, "HinatazakaBaseProcessor");
    
  id = setInterval(replaceLang, 200);
};
