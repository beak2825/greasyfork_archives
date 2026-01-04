// ==UserScript==
// @name         Restore Twitter tab's title and icon
// @description  Restores Twitter tab's title and icon on twitter.com (Now X i guess)
// @version      1.2
// @author       yungsamd17
// @namespace    https://github.com/yungsamd17/UserScripts
// @license      MIT License
// @icon         https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472021/Restore%20Twitter%20tab%27s%20title%20and%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/472021/Restore%20Twitter%20tab%27s%20title%20and%20icon.meta.js
// ==/UserScript==

const iconUrl = `data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=`;

const setIcon = () => {
  const icon = document.querySelector('link[rel="shortcut icon"]');
  if (!icon) return;

  if (icon.getAttribute("href") === iconUrl) return;
  icon.setAttribute("href", iconUrl);
};

const setTitle = () => {
  const title = document.querySelector('head > title');
  if (!title) return;

  if (!title.innerText.endsWith(' / X')) return;

  document.querySelector('head > title').innerHTML = title.innerText.replace(' / X', ' / Twitter');
};

const updatePage = () => {
  setIcon();
  setTitle();
};

updatePage();

const observer = new MutationObserver(updatePage);
observer.observe(document, { subtree: true, childList: true });
